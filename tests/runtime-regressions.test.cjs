'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const CARD_PATH = path.join(__dirname, '..', 'nimbus-weather-card.js');
const source = fs.readFileSync(CARD_PATH, 'utf8');

function loadCardClass() {
  const classes = new Map();
  const localStorageValues = new Map();
  const localStorage = {
    get length() {
      return localStorageValues.size;
    },
    clear() {
      localStorageValues.clear();
    },
    getItem(key) {
      return localStorageValues.has(String(key)) ? localStorageValues.get(String(key)) : null;
    },
    key(index) {
      return [...localStorageValues.keys()][index] ?? null;
    },
    removeItem(key) {
      localStorageValues.delete(String(key));
    },
    setItem(key, value) {
      localStorageValues.set(String(key), String(value));
    },
  };

  class FakeHTMLElement {
    constructor() {
      this._attributes = new Map();
      this.isConnected = false;
      const values = new Map();
      this.style = {
        setProperty: (name, value) => values.set(name, String(value)),
        getPropertyValue: (name) => values.get(name) || '',
        removeProperty: (name) => values.delete(name),
      };
    }

    attachShadow() {
      this.shadowRoot = {
        innerHTML: '',
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
      };
      return this.shadowRoot;
    }

    setAttribute(name, value = '') {
      this._attributes.set(name, String(value));
    }

    getAttribute(name) {
      return this._attributes.get(name) ?? null;
    }

    hasAttribute(name) {
      return this._attributes.has(name);
    }

    removeAttribute(name) {
      this._attributes.delete(name);
    }

    dispatchEvent() {
      return true;
    }
  }

  const context = {
    AbortController,
    CustomEvent: class {
      constructor(type, options = {}) {
        this.type = type;
        Object.assign(this, options);
      }
    },
    HTMLElement: FakeHTMLElement,
    Image: class {},
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    ResizeObserver: class {
      observe() {}
      disconnect() {}
    },
    cancelAnimationFrame() {},
    clearInterval,
    clearTimeout,
    console,
    customElements: {
      define: (name, constructor) => classes.set(name, constructor),
      get: (name) => classes.get(name),
      whenDefined: () => new Promise(() => {}),
    },
    document: {
      createElement: () => ({ classList: {}, dataset: {}, style: {} }),
      hidden: false,
    },
    localStorage,
    location: { pathname: '/lovelace/weather' },
    navigator: { language: 'en-US', userAgent: 'Nimbus regression tests' },
    queueMicrotask,
    requestAnimationFrame: () => 0,
    setInterval,
    setTimeout,
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: CARD_PATH });
  const CardClass = classes.get('nimbus-weather-card');
  CardClass.__nimbusTestWindow = context;
  return CardClass;
}

const Card = loadCardClass();

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

test('late forecast subscriptions are cleaned up and cannot update a replacement subscription', async () => {
  const subscriptions = [];
  const card = new Card();
  card._config = { forecast_type: 'daily' };
  card._renderContent = () => {};
  card._hass = {
    connection: {
      subscribeMessage(callback, message) {
        const pending = deferred();
        subscriptions.push({ callback, message, pending });
        return pending.promise;
      },
    },
  };

  card._subscribeForecast('weather.home', 'daily');
  assert.equal(subscriptions.length, 2, 'daily view subscribes to its strip and hourly modal');
  const stale = subscriptions.slice();

  card._subscribeForecast('weather.home', 'daily');
  assert.equal(subscriptions.length, 4, 'replacement creates a fresh pair of subscriptions');
  const active = subscriptions.slice(2);

  let activeMainUnsubscribed = 0;
  let activeModalUnsubscribed = 0;
  const activeMainUnsubscribe = () => {
    activeMainUnsubscribed += 1;
  };
  const activeModalUnsubscribe = () => {
    activeModalUnsubscribed += 1;
  };
  active[0].pending.resolve(activeMainUnsubscribe);
  active[1].pending.resolve(activeModalUnsubscribe);
  await flushPromises();

  assert.equal(card._forecastUnsub, activeMainUnsubscribe);
  assert.equal(card._modalForecastUnsub, activeModalUnsubscribe);

  let staleMainUnsubscribed = 0;
  let staleModalUnsubscribed = 0;
  const staleMainUnsubscribe = () => {
    staleMainUnsubscribed += 1;
  };
  const staleModalUnsubscribe = () => {
    staleModalUnsubscribed += 1;
  };
  stale[0].pending.resolve(staleMainUnsubscribe);
  stale[1].pending.resolve(staleModalUnsubscribe);
  await flushPromises();

  assert.equal(staleMainUnsubscribed, 1, 'late main subscription is immediately disposed');
  assert.equal(staleModalUnsubscribed, 1, 'late modal subscription is immediately disposed');
  assert.equal(card._forecastUnsub, activeMainUnsubscribe, 'late promise cannot replace active main cleanup');
  assert.equal(card._modalForecastUnsub, activeModalUnsubscribe, 'late promise cannot replace active modal cleanup');

  card._forecast = [{ temperature: 20 }];
  card._modalForecast = [{ temperature: 21 }];
  stale[0].callback({ forecast: [{ temperature: 99 }] });
  stale[1].callback({ forecast: [{ temperature: 98 }] });
  assert.deepEqual(card._forecast, [{ temperature: 20 }], 'stale main callback is ignored');
  assert.deepEqual(card._modalForecast, [{ temperature: 21 }], 'stale modal callback is ignored');

  card._unsubscribeForecasts();
  assert.equal(activeMainUnsubscribed, 1);
  assert.equal(activeModalUnsubscribed, 1);
});

test('active source and local temperature units are used instead of the root weather unit', () => {
  const card = new Card();
  card._config = {
    entity: 'weather.primary',
    language: 'en',
    temperature_unit: 'C',
  };
  card._hass = {
    states: {
      'weather.primary': {
        state: 'sunny',
        attributes: { temperature: 20, temperature_unit: 'C' },
      },
      'weather.secondary': {
        state: 'sunny',
        attributes: { temperature: 68, temperature_unit: 'F' },
      },
      'sensor.local_temperature': {
        state: '86',
        attributes: { unit_of_measurement: '°F' },
      },
      'sensor.local_feels_like': {
        state: '77',
        attributes: { unit_of_measurement: '°F' },
      },
    },
  };

  const weatherHtml = card._renderHero({
    sourceMode: true,
    activeSource: { name: 'Secondary' },
    stateObj: card._hass.states['weather.secondary'],
    attrs: card._hass.states['weather.secondary'].attributes,
    cond: 'sunny',
    localSensor: () => null,
    highText: '',
    lowText: '',
    highLowHtml: '',
  });
  assert.match(weatherHtml, /<div class="tmp"><bdi class="bidi-ltr" dir="ltr">20°<\/bdi><\/div>/);

  const localHtml = card._renderHero({
    sourceMode: true,
    activeSource: { name: 'Station' },
    stateObj: card._hass.states['weather.secondary'],
    attrs: card._hass.states['weather.secondary'].attributes,
    cond: 'sunny',
    localSensor: (key) =>
      key === 'local_temperature' ? card._hass.states['sensor.local_temperature'] : null,
    highText: '',
    lowText: '',
    highLowHtml: '',
  });
  assert.match(localHtml, /<div class="tmp"><bdi class="bidi-ltr" dir="ltr">30°<\/bdi><\/div>/);

  const detailHtml = card._renderDetailRows({
    attrs: card._hass.states['weather.secondary'].attributes,
    displayOptions: { wind_unit: 'km/h' },
    localField: () => null,
    localSensor: (key) =>
      key === 'local_feels_like' ? card._hass.states['sensor.local_feels_like'] : null,
    sourceMode: true,
  });
  assert.match(detailHtml, /Feels like 25°/);
});

test('forecast strip, modal, and sun-event slots use the active source temperature unit', () => {
  const card = new Card();
  card._config = {
    entity: 'weather.primary',
    language: 'en',
    temperature_unit: 'C',
  };
  card._hass = {
    states: {
      'weather.primary': {
        state: 'sunny',
        attributes: { temperature: 20, temperature_unit: 'C' },
      },
      'weather.secondary': {
        state: 'sunny',
        attributes: { temperature: 68, temperature_unit: 'F' },
      },
    },
  };
  card.getCachedIcon = () => '<i></i>';
  card._moonSnapshot = () => ({ phase: 'full_moon', fraction: 0.5 });
  card._day = () => 'Now';
  card._forecastIconArgs = () => ({ condition: 'sunny', isNight: false });
  const sourceCtx = {
    enabled: true,
    activeSource: { type: 'weather', entity: 'weather.secondary' },
    weatherEntity: 'weather.secondary',
  };
  const displayOptions = {
    show_forecast: true,
    show_precipitation_probability: false,
    use_24h: true,
  };

  const dailyHtml = card._renderForecastStrip({
    displayOptions,
    items: [
      {
        datetime: '2026-10-08T12:00:00Z',
        condition: 'sunny',
        temperature: 68,
        templow: 50,
      },
    ],
    mainType: 'daily',
    maxItems: 1,
    moonFraction: 0.5,
    moonPhase: 'full_moon',
    sourceCtx,
  });
  assert.match(dailyHtml, />20°</);
  assert.match(dailyHtml, />10°</);
  assert.doesNotMatch(dailyHtml, />68°</);

  const now = Date.now();
  const slotTime = new Date(now + 60 * 60 * 1000).toISOString();
  const secondTime = new Date(now + 2 * 60 * 60 * 1000).toISOString();
  const taggedHourly = card._withForecastTemperatureUnit(
    [
      { datetime: slotTime, condition: 'sunny', temperature: 68 },
      { datetime: secondTime, condition: 'sunny', temperature: 66 },
    ],
    card._forecastTemperatureUnit(sourceCtx),
  );
  card._sunEvents = () => [
    { datetime: slotTime, condition: 'sunset', _isSunEvent: true },
  ];
  const merged = card._forecastStripItems({
    items: taggedHourly,
    mainType: 'hourly',
    maxItems: 2,
    sourceCtx,
  });
  const sunEvent = merged.find((item) => item._isSunEvent);
  assert.equal(sunEvent._temperatureUnit, 'F');
  assert.equal(sunEvent._slotTemp, 68);

  const rows = { innerHTML: '' };
  const title = { textContent: '' };
  card.shadowRoot = {
    getElementById: (id) => (id === 'fc-modal-rows' ? rows : null),
    querySelector: () => title,
  };
  card._updateForecastModal(
    [
      {
        datetime: '2026-10-08T12:00:00Z',
        condition: 'sunny',
        temperature: 68,
        templow: 50,
      },
    ],
    'full_moon',
    0.5,
    'daily',
    true,
    sourceCtx,
  );
  assert.match(rows.innerHTML, />20°</);
  assert.match(rows.innerHTML, />10°</);
  assert.doesNotMatch(rows.innerHTML, />68°</);
});

test('local source normalization accepts every supported sensor-only source shape', () => {
  const card = new Card();
  card._config = {
    sources: [
      { id: 'pressure', type: 'local', pressure: 'sensor.pressure' },
      { id: 'wind', type: 'local', local_wind_speed: 'sensor.wind' },
      { id: 'condition', type: 'local', condition: 'sensor.condition' },
      { id: 'uv', type: 'local', local_uv: 'sensor.uv' },
    ],
  };

  assert.deepEqual(
    Array.from(card._normalizeSources(), (sourceEntry) => sourceEntry.id),
    ['pressure', 'wind', 'condition', 'uv'],
  );
});

test('source persistence keys survive source reordering and migrate ordered keys', () => {
  const storage = Card.__nimbusTestWindow.localStorage;
  storage.clear();
  const card = new Card();
  const orderedSources = [
    { id: 'station', type: 'local' },
    { id: 'home', type: 'weather', entity: 'weather.home' },
    { id: 'coast', type: 'weather', entity: 'weather.coast' },
  ];
  const reorderedSources = [orderedSources[2], orderedSources[0], orderedSources[1]];
  const oldActiveKey =
    'nimbus-weather-card:active-source:/lovelace/weather:station|home|coast';
  const stableActiveKey =
    'nimbus-weather-card:active-source:/lovelace/weather:coast|home|station';
  storage.setItem(oldActiveKey, 'home');

  assert.equal(card._sourceStorageKey(orderedSources), stableActiveKey);
  assert.equal(card._sourceStorageKey(reorderedSources), stableActiveKey);
  assert.equal(card._storedSourceId(reorderedSources), 'home');
  assert.equal(storage.getItem(stableActiveKey), 'home', 'legacy selection is copied forward');
  assert.equal(storage.getItem(oldActiveKey), 'home', 'legacy key remains available for rollback');
});

test('carousel pages migrate from any prior tab order and remain source-specific', () => {
  const storage = Card.__nimbusTestWindow.localStorage;
  storage.clear();
  const card = new Card();
  const oldCarouselKey =
    'nimbus-weather-card:carousel-pages:/lovelace/weather:station|home|coast';
  const stableCarouselKey =
    'nimbus-weather-card:carousel-pages:/lovelace/weather:coast|home|station';
  storage.setItem(oldCarouselKey, JSON.stringify({ station: 1, home: 0, coast: 1 }));

  card._loadCarouselPages({
    sources: [
      { id: 'coast' },
      { id: 'station' },
      { id: 'home' },
    ],
  });

  assert.equal(card._carouselStorageKey, stableCarouselKey);
  assert.deepEqual(
    Object.fromEntries(card._carouselPages),
    { coast: 1, station: 1, home: 0 },
  );
  assert.equal(storage.getItem(stableCarouselKey), storage.getItem(oldCarouselKey));

  card._loadCarouselPages({
    sources: [
      { id: 'home' },
      { id: 'coast' },
      { id: 'station' },
    ],
  });
  assert.deepEqual(
    Object.fromEntries(card._carouselPages),
    { coast: 1, station: 1, home: 0 },
    'same source set must not reset in-memory page state after reordering',
  );
});

test('legacy sensor rows keep YAML overflow while the forecast carousel remains capped', () => {
  const sensors = Array.from({ length: 7 }, (_, index) => ({
    entity: `sensor.extra_${index + 1}`,
    name: `Extra ${index + 1}`,
  }));
  const states = Object.fromEntries(
    sensors.map((sensor, index) => [
      sensor.entity,
      {
        state: String(index + 1),
        attributes: { friendly_name: sensor.name, unit_of_measurement: '%' },
      },
    ]),
  );
  const card = new Card();
  card._config = { entity: 'weather.home', local_sensors: sensors };
  card._hass = { states };
  const sourceCtx = { activeSource: null };

  assert.equal(card._supplementalSensors(sourceCtx).length, 5, 'carousel is intentionally capped');

  const tracked = card._trackedEntityIds();
  for (const sensor of sensors) {
    assert.ok(tracked.has(sensor.entity), `${sensor.entity} must remain reactive`);
  }

  const legacyHtml = card._renderLocalSensors({
    displayOptions: { show_forecast: false },
    sourceCtx,
  });
  assert.equal((legacyHtml.match(/class="sr"/g) || []).length, 7);
  assert.match(legacyHtml, /Extra 7/);
});
