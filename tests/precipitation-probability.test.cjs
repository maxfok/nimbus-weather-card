'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const CARD_PATH = path.join(__dirname, '..', 'nimbus-weather-card.js');
const source = fs.readFileSync(CARD_PATH, 'utf8');

class FakeControl {
  constructor({ value = '', type = 'text', dataset = {}, checked = false } = {}) {
    this.value = value;
    this.type = type;
    this.dataset = dataset;
    this.checked = checked;
    this._listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this._listeners.get(type) || [];
    listeners.push(listener);
    this._listeners.set(type, listeners);
  }

  emit(type) {
    const event = {
      detail: {},
      target: this,
      preventDefault() {},
      stopPropagation() {},
    };
    for (const listener of this._listeners.get(type) || []) listener(event);
  }

  hasAttribute() {
    return false;
  }
}

function loadComponents() {
  const classes = new Map();

  class FakeHTMLElement {
    constructor() {
      this._attributes = new Map();
      this._events = [];
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

    dispatchEvent(event) {
      this._events.push(event);
      return true;
    }
  }

  class FakeCustomEvent {
    constructor(type, options = {}) {
      this.type = type;
      Object.assign(this, options);
    }
  }

  const context = {
    AbortController,
    CustomEvent: FakeCustomEvent,
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
    navigator: { language: 'en-US', userAgent: 'Nimbus test browser' },
    queueMicrotask,
    requestAnimationFrame: () => 0,
    setInterval,
    setTimeout,
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(
    source +
      '\n' +
      'globalThis.nimbusPrecipitationTestHelpers = { _sourceDisplayDefaultsFromConfig, _sourceWithDisplayDefaults };',
    context,
    { filename: CARD_PATH },
  );

  return {
    Card: classes.get('nimbus-weather-card'),
    Editor: classes.get('nimbus-weather-card-editor'),
    helpers: context.nimbusPrecipitationTestHelpers,
  };
}

const { Card, Editor, helpers } = loadComponents();

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function prepareForecastCard() {
  const card = new Card();
  card._config = { language: 'en', temperature_unit: 'C' };
  card._day = (_datetime, mainType) => (mainType === 'hourly' ? '10:00' : 'MON');
  card._formatEventTime = () => '10:40';
  card._forecastIconArgs = (forecast) => ({
    condition: forecast.condition || 'rainy',
    isNight: false,
  });
  card._moonSnapshot = () => ({ phase: 'full_moon', fraction: 0.5 });
  card.getCachedIcon = () => '<i class="test-icon"></i>';
  card._tempNumber = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  card._t = (value) => String(value);
  return card;
}

function forecastView(items, showPrecipitationProbability) {
  return {
    displayOptions: {
      show_forecast: true,
      show_precipitation_probability: showPrecipitationProbability,
      use_24h: true,
    },
    items,
    mainType: 'daily',
    maxItems: items.length,
    moonFraction: 0.5,
    moonPhase: 'full_moon',
    sourceCtx: { enabled: false },
  };
}

function makeEditorShadow({ sourceMode = false, checked = true } = {}) {
  const toggle = new FakeControl({
    type: 'checkbox',
    checked,
    dataset: sourceMode
      ? { idx: '0', key: 'show_precipitation_probability' }
      : {},
  });
  const entity = new FakeControl({ value: 'weather.home' });
  const sourceType = new FakeControl({ value: 'weather' });
  const sourceName = new FakeControl({ value: 'Home' });
  const sourceEntity = new FakeControl({ value: 'weather.home' });
  const sourceEntry = { dataset: { idx: '0' } };

  return {
    toggle,
    getElementById(id) {
      if (id === 'entity') return entity;
      if (!sourceMode && id === 'show_precipitation_probability') return toggle;
      return null;
    },
    querySelector(selector) {
      if (!sourceMode) return null;
      if (selector === '.source-type[data-idx="0"]') return sourceType;
      if (selector === '.source-name[data-idx="0"]') return sourceName;
      if (selector === '.source-entity[data-idx="0"]') return sourceEntity;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '.sensor-entry') return [];
      if (selector === '.source-entry') return sourceMode ? [sourceEntry] : [];
      if (selector === '.source-display-toggle[data-idx="0"]') {
        return sourceMode ? [toggle] : [];
      }
      if (
        selector ===
        'select:not(.source-extra-mode), input[type="text"]:not(.timezone-search):not(.source-sky-coordinate), input[type="checkbox"], input[type="range"]'
      ) {
        return [toggle];
      }
      return [];
    },
  };
}

test('precipitation probability is opt-in for both root and source display settings', () => {
  const rootDefaults = helpers._sourceDisplayDefaultsFromConfig({});
  const sourceDefaults = helpers._sourceWithDisplayDefaults({}, {});
  assert.equal(rootDefaults.show_precipitation_probability, false);
  assert.equal(sourceDefaults.show_precipitation_probability, false);

  const card = new Card();
  card.setConfig({ entity: 'weather.home' });
  assert.equal(card._config.show_precipitation_probability, false);
  assert.equal(card._activeDisplayOptions().show_precipitation_probability, false);

  card.setConfig({ entity: 'weather.home', show_precipitation_probability: true });
  assert.equal(card._config.show_precipitation_probability, true);
  assert.equal(card._activeDisplayOptions().show_precipitation_probability, true);

  card.setConfig({
    entity: 'weather.home',
    sources: [
      {
        id: 'rain',
        type: 'weather',
        entity: 'weather.rain',
        show_precipitation_probability: true,
      },
      {
        id: 'dry',
        type: 'weather',
        entity: 'weather.dry',
      },
    ],
  });
  const [rain, dry] = card._config.sources;
  assert.equal(
    card._activeDisplayOptions({ enabled: true, activeSource: rain })
      .show_precipitation_probability,
    true,
  );
  assert.equal(
    card._activeDisplayOptions({ enabled: true, activeSource: dry })
      .show_precipitation_probability,
    false,
  );

  card.setConfig({
    entity: 'weather.home',
    show_precipitation_probability: true,
    sources: [
      { id: 'inherited', type: 'weather', entity: 'weather.inherited' },
      {
        id: 'disabled',
        type: 'weather',
        entity: 'weather.disabled',
        show_precipitation_probability: false,
      },
    ],
  });
  const [inherited, disabled] = card._config.sources;
  assert.equal(inherited.show_precipitation_probability, true);
  assert.equal(disabled.show_precipitation_probability, false);
});

test('precipitation probability normalizes finite in-range values and rejects invalid ranges', () => {
  const card = prepareForecastCard();
  const probability = (value) =>
    card._forecastPrecipitationProbability({ precipitation_probability: value });

  assert.equal(probability(0), 0);
  assert.equal(probability('8.4'), 8);
  assert.equal(probability('8,6'), 9);
  assert.equal(probability(100), 100);
  assert.equal(probability(-1), null);
  assert.equal(probability(101), null);
  assert.equal(probability(Number.NaN), null);
  assert.equal(probability(Number.POSITIVE_INFINITY), null);
  assert.equal(probability(''), null);
  assert.equal(probability('not-a-number'), null);
});

test('editor serialization preserves the option at root or per source without leaking both', () => {
  const rootEditor = new Editor();
  const rootShadow = makeEditorShadow({ checked: true });
  rootEditor.shadowRoot = rootShadow;
  rootEditor._config = { entity: 'weather.home' };
  rootEditor._attach();
  rootShadow.toggle.emit('change');
  assert.equal(rootEditor._config.show_precipitation_probability, true);

  const sourceEditor = new Editor();
  const sourceShadow = makeEditorShadow({ sourceMode: true, checked: true });
  sourceEditor.shadowRoot = sourceShadow;
  sourceEditor._config = {
    entity: 'weather.home',
    sources: [{ id: 'home', type: 'weather', entity: 'weather.home' }],
  };
  sourceEditor._attach();
  sourceShadow.toggle.emit('change');

  const serialized = plain(sourceEditor._config);
  assert.equal(serialized.sources[0].show_precipitation_probability, true);
  assert.equal(
    Object.hasOwn(serialized, 'show_precipitation_probability'),
    false,
    'source mode must not retain an ambiguous root setting',
  );
});

test('forecast strip renders valid precipitation values, including zero, only when enabled', () => {
  const card = prepareForecastCard();
  const items = [
    {
      condition: 'rainy',
      datetime: '2026-10-08T12:00:00Z',
      precipitation_probability: 42,
      temperature: 21,
    },
    {
      condition: 'sunny',
      datetime: '2026-10-09T12:00:00Z',
      precipitation_probability: 0,
      temperature: 22,
    },
  ];

  const enabled = card._renderForecastStrip(forecastView(items, true));
  assert.match(enabled, /42%/);
  assert.match(enabled, /0%/);

  const disabled = card._renderForecastStrip(forecastView(items, false));
  assert.doesNotMatch(disabled, /42%|0%/);
});

test('forecast strip suppresses unavailable or invalid precipitation values safely', () => {
  const card = prepareForecastCard();
  const markup = card._renderForecastStrip(
    forecastView(
      [
        {
          condition: 'cloudy',
          datetime: '2026-10-08T12:00:00Z',
          temperature: 20,
        },
        {
          condition: 'rainy',
          datetime: '2026-10-09T12:00:00Z',
          precipitation_probability: 'not-a-number',
          temperature: 19,
        },
      ],
      true,
    ),
  );

  assert.doesNotMatch(markup, /not-a-number|NaN%|undefined%/);
  assert.doesNotMatch(markup, /\d+(?:\.\d+)?%/);
});

test('hourly sunrise or sunset tiles retain the replaced slot precipitation probability', () => {
  const card = prepareForecastCard();
  card._sourceDateTime = (value) => new Date(value);
  card._sunEvents = () => [
    {
      _isSunEvent: true,
      condition: 'sunset',
      datetime: '2099-01-01T10:40:00Z',
    },
  ];

  const view = {
    displayOptions: {
      show_forecast: true,
      show_precipitation_probability: true,
      use_24h: true,
    },
    items: [
      {
        condition: 'rainy',
        datetime: '2099-01-01T10:00:00Z',
        precipitation_probability: 17,
        temperature: 20,
      },
      {
        condition: 'partlycloudy',
        datetime: '2099-01-01T11:00:00Z',
        precipitation_probability: 61,
        temperature: 21,
      },
    ],
    mainType: 'hourly',
    maxItems: 2,
    moonFraction: 0.5,
    moonPhase: 'full_moon',
    sourceCtx: { enabled: false },
  };

  const markup = card._renderForecastStrip(view);
  assert.match(markup, /61%/);
  assert.doesNotMatch(markup, /undefined%|NaN%/);
});
