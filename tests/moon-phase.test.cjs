const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const cardPath = path.join(__dirname, '..', 'nimbus-weather-card.js');
const source = fs.readFileSync(cardPath, 'utf8');
const moonStart = source.indexOf('// ── MOON PHASE SVG ──');
const moonEnd = source.indexOf('const BG_MAP', moonStart);
assert.notEqual(moonStart, -1, 'moon helper block must exist');
assert.notEqual(moonEnd, -1, 'moon helper block must end before BG_MAP');

const context = {};
vm.createContext(context);
vm.runInContext(
  `${source.slice(moonStart, moonEnd)}\n` +
    'globalThis.moonHelpers = { _moonLitPath, getMoonSVG, getMoonSVGLarge };',
  context,
);

const { _moonLitPath } = context.moonHelpers;

function loadCardClass({ fullyKiosk = false, userAgent = 'Nimbus test browser' } = {}) {
  const classes = new Map();
  class HTMLElement {
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
    attachShadow() {
      return {
        innerHTML: '',
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
      };
    }
  }
  const cardContext = {
    console,
    HTMLElement,
    customElements: {
      get: (name) => classes.get(name),
      define: (name, constructor) => classes.set(name, constructor),
    },
    document: { createElement: () => ({ style: {}, classList: {}, dataset: {} }) },
    navigator: { language: 'en-US', userAgent },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    Image: class {},
    ResizeObserver: class {
      observe() {}
      disconnect() {}
    },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
  };
  if (fullyKiosk) cardContext.FullyKiosk = {};
  cardContext.window = cardContext;
  vm.createContext(cardContext);
  vm.runInContext(
    source +
      '\n' +
      'globalThis.nimbusTestHelpers = { _normalizeTimeZoneSearch, _timeZoneOptions, _findTimeZoneOption, _searchTimeZoneOptions, _parseIanaZoneCoordinates, _skyCoordinatePair, _timeZoneCoordinates, _latitudeZoneForLatitude, _migrateLegacyFeelsLikeToUniqueRootSource, _directionConfigValue, _resolvedTextDirection };',
    cardContext,
  );
  const Card = classes.get('nimbus-weather-card');
  Card.__nimbusTestHelpers = cardContext.nimbusTestHelpers;
  return Card;
}

test('forecast and hero preserve the same lunar phase geometry near new moon', () => {
  const phaseFraction = 0.9524557257569768; // 2026-08-11 21:14 EEST, about 2.2% illuminated

  const heroPath = _moonLitPath('waning_crescent', 10, 12, 12, phaseFraction, false);
  const forecastPath = _moonLitPath('waning_crescent', 10, 12, 12, phaseFraction, true);

  assert.equal(forecastPath, heroPath);
});

test('forecast moon uses the forecast timestamp rather than the current snapshot', () => {
  const Card = loadCardClass();
  const card = new Card();
  let iconArgs;
  card._day = () => '00:00';
  card._forecastIconArgs = () => ({ condition: 'clear-night', isNight: true });
  card.getCachedIcon = (...args) => {
    iconArgs = args;
    return '<svg></svg>';
  };
  card._tempNumber = (value) => Number(value);
  card._t = (value) => String(value);

  card._renderForecastTile(
    { datetime: '2026-08-11T21:00:00Z', condition: 'clear-night', temperature: 26 },
    {
      mainType: 'hourly',
      displayOptions: { use_24h: true },
      moonPhase: 'full_moon',
      moonFraction: 0.5,
    },
  );

  assert.notEqual(iconArgs[2], 'full_moon');
  assert.ok(iconArgs[3] > 0.9 && iconArgs[3] < 1);
  assert.notEqual(iconArgs[3], 0.5);
});

test('continuous phase reaches new moon at the astronomical conjunction', () => {
  const Card = loadCardClass();
  const card = new Card();
  const phase = card._moonPhaseFractionFromDate(new Date('2026-08-12T17:37:00Z'));
  const distanceToNew = Math.min(phase, 1 - phase);

  // The card uses a compact low-precision ephemeris; half a percent of a
  // lunation (~3.5 hours) is sufficient at icon scale.
  assert.ok(distanceToNew < 0.006, `expected new moon, received phase ${phase}`);
});

test('hero moon snapshot is astronomical and ignores Home Assistant moon sensors', () => {
  const Card = loadCardClass();
  const card = new Card();
  card._config = { moon_entity: 'sensor.custom_moon' };
  card._hass = {
    states: {
      'sensor.custom_moon': { state: 'full_moon' },
      'sensor.moon_phase': { state: 'full_moon' },
    },
  };

  const atConjunction = new Date('2026-08-12T17:37:00Z');
  const snapshot = card._moonSnapshot(atConjunction);

  assert.equal(snapshot.phase, 'new_moon');
  assert.ok(Math.min(snapshot.fraction, 1 - snapshot.fraction) < 0.006);
});

test('moon sensors are not tracked and legacy moon_entity is removed from config', () => {
  const Card = loadCardClass();
  const card = new Card();
  card.setConfig({ entity: 'weather.home', moon_entity: 'sensor.custom_moon' });

  assert.equal(Object.hasOwn(card._config, 'moon_entity'), false);
  assert.equal(card._trackedEntityIds().has('sensor.custom_moon'), false);
  assert.equal(card._trackedEntityIds().has('sensor.moon_phase'), false);
});

test('card height normalizes to a safe default and only requests fill in a Panel', () => {
  const Card = loadCardClass();
  const card = new Card();

  card.setConfig({ entity: 'weather.home' });
  assert.equal(card._config.card_height, 'auto');
  assert.equal(card.getAttribute('data-card-height'), 'auto');

  card.setConfig({ entity: 'weather.home', card_height: 'fill' });
  assert.equal(card._config.card_height, 'fill');
  assert.equal(card.getAttribute('data-card-height'), 'fill');
  assert.equal(card._panelFillRequested(), false);

  card.layout = 'panel';
  assert.equal(card._panelFillRequested(), true);
  assert.equal(card.hasAttribute('data-ha-panel-layout'), true);

  card.setConfig({ entity: 'weather.home', card_height: 'unexpected-value' });
  assert.equal(card._config.card_height, 'auto');
  assert.equal(card.getAttribute('data-card-height'), 'auto');
  assert.equal(card._panelFillRequested(), false);
});

test('text direction defaults safely, supports explicit overrides, and stays language-independent', () => {
  const Card = loadCardClass();
  const card = new Card();
  const { _directionConfigValue, _resolvedTextDirection } = Card.__nimbusTestHelpers;

  card.setConfig({ entity: 'weather.home' });
  assert.equal(card._config.direction, 'auto');
  assert.equal(card.getAttribute('dir'), 'ltr');
  assert.equal(card.getAttribute('data-direction'), 'ltr');

  card.setConfig({ entity: 'weather.home', language: 'fa' });
  assert.equal(card._config.language, 'fa');
  assert.equal(card.getAttribute('dir'), 'ltr');

  card.setConfig({ entity: 'weather.home', direction: 'RTL' });
  assert.equal(card._config.direction, 'rtl');
  assert.equal(card.getAttribute('dir'), 'rtl');

  card.setConfig({ entity: 'weather.home', direction: 'unexpected-value' });
  assert.equal(card._config.direction, 'auto');
  assert.equal(_directionConfigValue('unexpected-value'), 'auto');
  assert.equal(_resolvedTextDirection('auto', { locale: { text_direction: 'rtl' } }), 'rtl');
  assert.equal(_resolvedTextDirection('ltr', { locale: { text_direction: 'rtl' } }), 'ltr');
});

test('horizontal input and supplemental offsets mirror without changing logical page values', () => {
  const Card = loadCardClass();
  const card = new Card();

  card.setConfig({ entity: 'weather.home', direction: 'ltr' });
  assert.equal(card._horizontalKeyStep('ArrowRight'), 1);
  assert.equal(card._horizontalKeyStep('ArrowLeft'), -1);
  assert.equal(card._horizontalGestureStep(-60), 1);
  assert.equal(card._horizontalGestureStep(60), -1);
  assert.equal(card._supplementTrackOffset(2), -200 / 3);

  card.setConfig({ entity: 'weather.home', direction: 'rtl' });
  assert.equal(card._horizontalKeyStep('ArrowLeft'), 1);
  assert.equal(card._horizontalKeyStep('ArrowRight'), -1);
  assert.equal(card._horizontalGestureStep(60), 1);
  assert.equal(card._horizontalGestureStep(-60), -1);
  assert.equal(card._supplementTrackOffset(2), 200 / 3);
});

test('RTL selectors are scoped to interface carousels and never mirror the atmospheric scene', () => {
  assert.match(source, /:host\(\[dir="rtl"\]\) \.carousel-page-sensors/);
  assert.match(source, /:host\(\[dir="rtl"\]\) \.carousel-viewport\[data-page="1"\] \.carousel-page-forecast/);
  const rtlRules = [...source.matchAll(/:host\(\[dir="rtl"\]\)([^{}]*)\{([^{}]*)\}/g)]
    .map((match) => `${match[1]} {${match[2]}}`);
  assert.ok(rtlRules.length >= 3);
  for (const rule of rtlRules) {
    assert.doesNotMatch(rule, /(?:sun|solar|moon|lunar|cloud|rain|lightning|canvas|ptcl)/i);
  }
});

test('active Panel Fill measures intrinsic blocks instead of the stretched content box', () => {
  const Card = loadCardClass();
  const card = new Card();
  const content = {
    scrollHeight: 600,
    offsetHeight: 600,
    children: [
      { scrollHeight: 112, offsetHeight: 112 },
      { scrollHeight: 218, offsetHeight: 218 },
    ],
    ownerDocument: {
      defaultView: {
        getComputedStyle: () => ({ paddingTop: '18px', paddingBottom: '18px' }),
      },
    },
  };
  card.shadowRoot = {
    getElementById: (id) => (id === 'ct' ? content : null),
  };

  card._panelFillActive = false;
  assert.equal(card._panelFillSceneHeight(), 600);

  card._panelFillActive = true;
  assert.equal(card._panelFillSceneHeight(), 366);
});

test('Panel Fill markup groups the viewport and footer without changing natural flow', () => {
  assert.match(source, /id="carousel-lower" class="carousel-lower"/);
  assert.match(source, /\.carousel-hero,\.carousel-lower \{ display:contents; \}/);
  assert.match(
    source,
    /:host\(\[data-panel-fill-active\]\) \.carousel-lower \{[\s\S]*?margin-block-start:auto;/,
  );
});

test('corner style uses the Fully bridge only for Auto and preserves explicit overrides', () => {
  const AndroidCard = loadCardClass({ userAgent: 'Mozilla/5.0 (Linux; Android 14)' });
  const ordinaryCard = new AndroidCard();

  ordinaryCard.setConfig({ entity: 'weather.home' });
  assert.equal(ordinaryCard._config.corner_style, 'auto');
  assert.equal(ordinaryCard.getAttribute('data-corner-style'), 'rounded');

  ordinaryCard.setConfig({ entity: 'weather.home', corner_style: 'invalid' });
  assert.equal(ordinaryCard._config.corner_style, 'auto');
  assert.equal(ordinaryCard.getAttribute('data-corner-style'), 'rounded');

  ordinaryCard.setConfig({ entity: 'weather.home', corner_style: 'square' });
  assert.equal(ordinaryCard.getAttribute('data-corner-style'), 'square');

  const FullyCard = loadCardClass({ fullyKiosk: true });
  const fullyCard = new FullyCard();
  fullyCard.setConfig({ entity: 'weather.home' });
  assert.equal(fullyCard.getAttribute('data-corner-style'), 'square');

  fullyCard.setConfig({ entity: 'weather.home', corner_style: 'rounded' });
  assert.equal(fullyCard.getAttribute('data-corner-style'), 'rounded');
});

test('editor exposes and persists the global corner style setting', () => {
  assert.equal((source.match(/id="corner_style"/g) || []).length, 2);
  assert.match(
    source,
    /corner_style:\s*_cornerStyleConfigValue\(getValue\('corner_style', this\._config\.corner_style\)\)/,
  );
});

test('editor exposes one direction control per configuration branch and persists it', () => {
  assert.equal((source.match(/id="direction"/g) || []).length, 2);
  assert.match(source, /Text Direction/);
  assert.match(
    source,
    /direction:\s*_directionConfigValue\(getValue\('direction', this\._config\.direction\)\)/,
  );
  assert.match(source, /_resolvedTextDirection\('auto', this\._hass, this\)/);
});

test('clock formats IANA time zones and lets the active source override the card fallback', () => {
  const Card = loadCardClass();
  const card = new Card();
  card._config = { language: 'en', time_zone: 'Europe/Athens' };
  const winter = new Date('2026-01-15T00:00:00Z');
  const summer = new Date('2026-07-15T00:00:00Z');
  const mashhad = { enabled: true, activeSource: { time_zone: 'Asia/Tehran' } };

  assert.equal(card._clockParts(true, { enabled: false }, winter).time, '02:00');
  assert.equal(card._clockParts(true, { enabled: false }, summer).time, '03:00');

  assert.equal(card._clockTimeZone(mashhad), 'Asia/Tehran');
  assert.equal(card._clockParts(true, mashhad, winter).time, '03:30');
  assert.equal(card._clockParts(true, mashhad, summer).time, '03:30');
  assert.equal(
    card._clockParts(false, mashhad, new Date('2026-07-15T12:00:00Z')).time,
    '3:30pm',
  );
  assert.match(
    card._clockParts(true, mashhad, new Date('2026-01-15T21:30:00Z')).date,
    /Jan 16/,
  );
});

test('clock safely falls through invalid or blank time zones', () => {
  const Card = loadCardClass();
  const card = new Card();
  const sourceWithInvalidZone = { enabled: true, activeSource: { time_zone: 'Not/AZone' } };
  const sourceWithBlankZone = { enabled: true, activeSource: { time_zone: '   ' } };
  card._config = { language: 'en', time_zone: 'Europe/Athens' };

  assert.equal(card._clockTimeZone(sourceWithInvalidZone), 'Europe/Athens');
  assert.equal(card._clockTimeZone(sourceWithBlankZone), 'Europe/Athens');

  card._config.time_zone = 'Not/AZone';
  assert.equal(card._clockTimeZone(sourceWithInvalidZone), null);
  assert.doesNotThrow(() =>
    card._clockParts(true, sourceWithInvalidZone, new Date('2026-01-15T00:00:00Z')),
  );
});

test('IANA zones provide an active source location for solar, forecast, and lunar context', () => {
  const Card = loadCardClass();
  const card = new Card();
  const { _findTimeZoneOption, _parseIanaZoneCoordinates, _timeZoneCoordinates } =
    Card.__nimbusTestHelpers;
  card._config = { language: 'en', time_zone: 'Europe/Athens', latitude_zone: 'northern_temperate' };
  card._hass = {
    config: { latitude: 37.9838, longitude: 23.7275, time_zone: 'Europe/Athens' },
    states: {},
  };

  const newYorkOption = _findTimeZoneOption('America/New_York', 'en');
  assert.ok(newYorkOption.coordinates);
  assert.ok(Math.abs(newYorkOption.coordinates.latitude - 40.7142) < 0.001);
  assert.ok(Math.abs(newYorkOption.coordinates.longitude + 74.0064) < 0.001);
  assert.equal(_parseIanaZoneCoordinates('+3540+05126').latitude, 35 + 40 / 60);
  assert.ok(Math.abs(_timeZoneCoordinates('Asia/Tehran').longitude - 51.4333) < 0.001);
  assert.ok(_timeZoneCoordinates('Asia/Calcutta'));
  assert.ok(_timeZoneCoordinates('Europe/Kiev'));
  assert.ok(_timeZoneCoordinates('America/Godthab'));

  const newYork = { enabled: true, activeSourceId: 'new-york', activeSource: { time_zone: 'America/New_York' } };
  const atAthensMorning = new Date('2026-08-20T07:13:00Z'); // 03:13 New York, 10:13 Athens
  const newYorkLocation = card._activeLocationContext(newYork);
  assert.equal(newYorkLocation.origin, 'source-time-zone');
  assert.ok(Math.abs(newYorkLocation.latitude - 40.7142) < 0.001);

  const newYorkSolar = card._solarContextAt(atAthensMorning, newYork);
  const athensSolar = card._solarContextAt(atAthensMorning, { enabled: false });
  assert.ok(newYorkSolar.elevation < -10, `expected New York night, got ${newYorkSolar.elevation}`);
  assert.ok(athensSolar.elevation > 10, `expected Athens daylight, got ${athensSolar.elevation}`);
  assert.equal(card._day('2026-08-20T07:00:00Z', 'hourly', true, newYork), '03:00');
  assert.equal(card._day('2026-08-20T03:00:00', 'hourly', true, newYork), '03:00');
  assert.equal(
    card._sourceDateTime('2026-08-20T03:00:00', newYork).toISOString(),
    '2026-08-20T07:00:00.000Z',
  );
  assert.equal(card._formatEventTime('2026-08-20T07:13:00Z', true, newYork), '03:13');
  assert.equal(card._day('2026-08-20T02:00:00Z', 'daily', true, newYork), 'WED');
  const newYorkYesterday = card._activeDayContext(new Date('2026-08-20T02:00:00Z'), newYork);
  assert.equal(newYorkYesterday.dayKey, '2026-08-19');
  assert.equal(
    card._sameHomeDay('2026-08-20T02:00:00Z', newYorkYesterday.dayKey, newYorkYesterday.timeZone),
    true,
  );

  const mashhad = {
    enabled: true,
    activeSourceId: 'mashhad',
    activeSource: {
      time_zone: 'Asia/Tehran',
      sky_latitude: '36,2605',
      sky_longitude: '59.6168',
    },
  };
  const mashhadLocation = card._activeLocationContext(mashhad);
  assert.equal(mashhadLocation.origin, 'source-coordinate');
  assert.equal(mashhadLocation.latitude, 36.2605);
  assert.equal(mashhadLocation.longitude, 59.6168);

  const southern = card._lunarOrientation({
    enabled: true,
    activeSource: { time_zone: 'Australia/Sydney' },
  });
  assert.equal(southern.latitudeZone, 'southern_temperate');
  assert.equal(southern.hemisphereMirrored, true);

  const legacyCard = new Card();
  legacyCard._config = { language: 'en', latitude_zone: 'southern_temperate' };
  legacyCard._hass = card._hass;
  assert.equal(legacyCard._activeLocationContext({ enabled: false }).origin, 'home');
  assert.equal(legacyCard._activeLatitudeZone({ enabled: false }), 'southern_temperate');
});

test('hourly forecast starts at the active source-local hour instead of browser UTC hour', () => {
  const Card = loadCardClass();
  const card = new Card();
  card._config = { language: 'en', time_zone: 'Europe/Athens' };
  card._hass = { config: { latitude: 37.9838, longitude: 23.7275 }, states: {} };
  const newYork = { enabled: true, activeSource: { time_zone: 'America/New_York' } };
  const now = new Date('2026-08-20T07:13:47Z');
  const items = [
    { datetime: '2026-08-20T06:00:00Z' },
    { datetime: '2026-08-20T07:00:00Z' },
    { datetime: '2026-08-20T08:00:00Z' },
  ];

  assert.equal(card._currentSourceHourStart(now, newYork).toISOString(), '2026-08-20T07:00:00.000Z');
  assert.deepEqual(
    card
      ._currentOrUpcomingHourlyItems(items, 'hourly', newYork, now)
      .map((item) => item.datetime),
    ['2026-08-20T07:00:00Z', '2026-08-20T08:00:00Z'],
  );
  assert.deepEqual(
    card
      ._currentOrUpcomingHourlyItems(
        [
          { datetime: '2026-08-20T02:00:00' },
          { datetime: '2026-08-20T03:00:00' },
          { datetime: '2026-08-20T04:00:00' },
        ],
        'hourly',
        newYork,
        now,
      )
      .map((item) => item.datetime),
    ['2026-08-20T03:00:00', '2026-08-20T04:00:00'],
  );
});

test('timezone picker finds countries, canonical zones, and localized aliases', () => {
  const Card = loadCardClass();
  const {
    _normalizeTimeZoneSearch,
    _findTimeZoneOption,
    _searchTimeZoneOptions,
    _timeZoneOptions,
  } = Card.__nimbusTestHelpers;

  assert.equal(_timeZoneOptions('en').filter((option) => !option.coordinates).length, 0);

  const gre = _searchTimeZoneOptions('Gre', 'en');
  assert.ok(gre.some((option) => option.timeZone === 'Europe/Athens'));
  assert.ok(gre.some((option) => option.timeZone === 'America/Nuuk'));

  const iran = _searchTimeZoneOptions('Iran', 'en');
  assert.equal(iran.filter((option) => option.timeZone === 'Asia/Tehran').length, 1);
  assert.equal(_searchTimeZoneOptions('Tehran', 'en')[0].timeZone, 'Asia/Tehran');

  const espana = _searchTimeZoneOptions('España', 'en');
  const espanaWithoutAccent = _searchTimeZoneOptions('Espana', 'en');
  assert.ok(espana.some((option) => option.timeZone === 'Europe/Madrid'));
  assert.ok(espana.some((option) => option.timeZone === 'Atlantic/Canary'));
  assert.deepEqual(
    espana.map((option) => option.timeZone),
    espanaWithoutAccent.map((option) => option.timeZone),
  );

  assert.equal(
    _findTimeZoneOption('Asia/Tehran', 'en').label,
    'Iran · Tehran',
  );
  assert.ok(
    _searchTimeZoneOptions(' europe/madrid ', 'en').some(
      (option) => option.timeZone === 'Europe/Madrid',
    ),
  );
  assert.equal(_normalizeTimeZoneSearch('  España  '), 'espana');
  assert.equal(_searchTimeZoneOptions('', 'en').length, 0);
  assert.equal(_searchTimeZoneOptions('no such zone', 'en').length, 0);
});

test('editor stores canonical display time zones and an atomic exact source location', () => {
  assert.match(source, /type="hidden" \$\{canonicalInput\} value=/);
  assert.match(source, /class="source-display timezone-value" data-idx="\$\{sourceIndex\}" data-key="time_zone"/);
  assert.match(source, /canonical\.value = timeZone;/);
  assert.match(source, /input\[type="text"\]:not\(\.timezone-search\):not\(\.source-sky-coordinate\)/);
  assert.match(source, /const timeZone = String\(getValue\('time_zone', this\._config\.time_zone/);
  assert.match(source, /if \(timeZone\) cfg\.time_zone = timeZone;/);
  assert.match(source, /else delete cfg\.time_zone;/);
  assert.match(
    source,
    /'wind_unit',\n\s*'time_zone',\n\s*'sky_latitude',\n\s*'sky_longitude',/,
  );
  assert.match(source, /class="source-sky-coordinate" data-idx="\$\{index\}" data-key="sky_latitude"/);
  assert.match(source, /source\.sky_latitude = nextSkyCoordinates\.latitude;/);
  assert.match(source, /source\.sky_longitude = nextSkyCoordinates\.longitude;/);
  assert.match(source, /hasSkyInput && !skyInputIsBlank && previousSkyCoordinates/);
});

test('editor no longer exposes or persists Moon Entity', () => {
  assert.equal(source.includes('<div class="label">Moon Entity</div>'), false);
  assert.equal(source.includes("getElementById('moon_entity')"), false);
});

test('feels-like supplements remain isolated to the active source', () => {
  const Card = loadCardClass();
  const card = new Card();
  card._config = { temperature_unit: 'C', feels_like_entity: 'sensor.attica_feels' };
  card._hass = {
    states: {
      'sensor.attica_feels': { state: '35', attributes: { unit_of_measurement: '°C' } },
    },
  };
  card._t = (value) => String(value);
  card._detailWindValue = () => null;

  const newYork = card._renderDetailRows({
    sourceMode: true,
    attrs: { apparent_temperature: 23 },
    displayOptions: { wind_unit: 'kmh' },
    localSensor: () => null,
  });
  assert.match(newYork, /Feels like 23°/);
  assert.doesNotMatch(newYork, /Feels like 35°/);

  const attica = card._renderDetailRows({
    sourceMode: true,
    attrs: { apparent_temperature: 23 },
    displayOptions: { wind_unit: 'kmh' },
    localSensor: (key) =>
      key === 'local_feels_like'
        ? { state: '35', attributes: { unit_of_measurement: '°C' } }
        : null,
  });
  assert.match(attica, /Feels like 35°/);
});

test('legacy global feels-like remains available to single-source cards', () => {
  const Card = loadCardClass();
  const card = new Card();
  card._config = { temperature_unit: 'C', feels_like_entity: 'sensor.attica_feels' };
  card._hass = { states: { 'sensor.attica_feels': { state: '35' } } };
  card._t = (value) => String(value);
  card._detailWindValue = () => null;

  const details = card._renderDetailRows({
    sourceMode: false,
    attrs: { apparent_temperature: 23 },
    displayOptions: { wind_unit: 'kmh' },
    localSensor: () => null,
  });
  assert.match(details, /Feels like 35°/);
});

test('editor migrates legacy feels-like only to a unique matching weather source', () => {
  const Card = loadCardClass();
  const { _migrateLegacyFeelsLikeToUniqueRootSource } = Card.__nimbusTestHelpers;
  const config = {
    entity: 'weather.attica',
    feels_like_entity: 'sensor.attica_feels',
  };
  const sources = [
    { type: 'weather', entity: 'weather.attica', name: 'Attica' },
    { type: 'weather', entity: 'weather.new_york', name: 'New York' },
  ];

  assert.equal(_migrateLegacyFeelsLikeToUniqueRootSource(config, sources), true);
  assert.equal(sources[0].feels_like, 'sensor.attica_feels');
  assert.equal(sources[1].feels_like, undefined);

  const explicit = [{ type: 'weather', entity: 'weather.attica', feels_like: 'sensor.explicit' }];
  assert.equal(_migrateLegacyFeelsLikeToUniqueRootSource(config, explicit), false);
  assert.equal(explicit[0].feels_like, 'sensor.explicit');

  const ambiguous = [
    { type: 'weather', entity: 'weather.attica' },
    { type: 'weather', entity: 'weather.attica' },
  ];
  assert.equal(_migrateLegacyFeelsLikeToUniqueRootSource(config, ambiguous), false);
  assert.equal(ambiguous[0].feels_like, undefined);
  assert.equal(ambiguous[1].feels_like, undefined);
});

test('solar presence suppresses only its first-paint transition flight', () => {
  assert.match(
    source,
    /id="solar-presence" class="solar-presence" data-solar-hydrating aria-hidden="true"/,
  );
  assert.match(
    source,
    /\.solar-presence\[data-solar-hydrating\],[\s\S]*?transition:none !important;/,
  );
  assert.match(source, /_enableSolarPresenceTransitions\(renderer\);/);
  assert.match(
    source,
    /schedule\(\(\) => \{\s*schedule\(\(\) => \{[\s\S]*?removeAttribute\('data-solar-hydrating'\)/,
  );
});

test('moon texture is primed once and reused across shell rebuilds', () => {
  const ensureStart = source.indexOf('  _ensureMoonTexture() {');
  const moonUpdateStart = source.indexOf('  _updateMoonDiv(condition, t) {');
  const moonUpdateEnd = source.indexOf('// ── Layer 2 (νύχτα): Φεγγάρι — canvas (legacy)', moonUpdateStart);
  const ensureMoonTexture = source.slice(ensureStart, moonUpdateStart);
  const updateMoonDiv = source.slice(moonUpdateStart, moonUpdateEnd);

  assert.notEqual(ensureStart, -1, 'shared Moon texture loader must exist');
  assert.match(ensureMoonTexture, /if \(this\._hasLoadedMoonTexture\(\)\) return this\._moonTextureImg;/);
  assert.match(ensureMoonTexture, /if \(this\._moonTextureLoad \|\| typeof Image === 'undefined'\) return null;/);
  assert.match(updateMoonDiv, /moonDiv\._textureImg = this\._ensureMoonTexture\(\);/);
  assert.match(source, /_buildShell\(\) \{[\s\S]*?this\._ensureMoonTexture\(\);/);
});

test('moon enters visibly and promptly at the Nimbus night handoff', () => {
  const Card = loadCardClass();
  const card = new Card();

  assert.ok(card._moonFade(0.99) >= 0.1);
  assert.ok(card._moonFade(-0.85) > card._moonFade(0.99));
  assert.equal(card._moonFade(-2.5), 1);
  assert.match(source, /NIMBUS_LUNAR_ENTRY_TRANSITION_MS = 800/);
  assert.match(source, /`opacity \$\{NIMBUS_LUNAR_ENTRY_TRANSITION_MS\}ms ease`/);
  assert.equal(source.includes("opacity 24s ease"), false);
});
