'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const CARD_PATH = path.join(__dirname, '..', 'nimbus-weather-card.js');

class FakeControl {
  constructor({ value = '', type = 'text', dataset = {}, disabled = false } = {}) {
    this.value = value;
    this.type = type;
    this.dataset = dataset;
    this.checked = false;
    this._disabledAttribute = disabled;
    this._listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this._listeners.get(type) || [];
    listeners.push(listener);
    this._listeners.set(type, listeners);
  }

  emit(type, detail = {}) {
    const event = {
      detail,
      stopPropagation() {},
      preventDefault() {},
      target: this,
    };
    for (const listener of this._listeners.get(type) || []) listener(event);
  }

  hasAttribute(name) {
    return name === 'disabled' && this._disabledAttribute;
  }
}

function sensorRow(scope, { entity = '', icon = '', name = '' } = {}) {
  const fields = {
    '.sensor-entity': new FakeControl({ value: entity }),
    '.sensor-icon': new FakeControl({ value: icon }),
    '.sensor-name': new FakeControl({ value: name }),
  };
  return {
    dataset: { scope },
    querySelector(selector) {
      return fields[selector] || null;
    },
    fields,
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadEditorClass() {
  const source = fs.readFileSync(CARD_PATH, 'utf8');
  const start = source.indexOf('class NimbusWeatherCardEditor extends HTMLElement');
  const end = source.indexOf("if (!customElements.get('nimbus-weather-card-editor'))", start);
  assert.notEqual(start, -1, 'NimbusWeatherCardEditor class must exist');
  assert.notEqual(end, -1, 'editor custom-element registration must follow the class');

  class FakeHTMLElement {
    constructor() {
      this._events = [];
      this.isConnected = true;
    }

    attachShadow() {
      this.shadowRoot = {
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
      };
      return this.shadowRoot;
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

  const registry = new Map();
  const context = {
    AbortController,
    CustomEvent: FakeCustomEvent,
    HTMLElement: FakeHTMLElement,
    NIMBUS_LOCAL_SENSOR_KEYS: [
      'local_temperature',
      'local_humidity',
      'local_wind_speed',
      'local_wind_direction',
      'local_precipitation',
      'local_pressure',
      'local_uv',
      'local_feels_like',
      'local_condition',
    ],
    NIMBUS_MAX_SUPPLEMENTAL_SENSORS: 5,
    clearTimeout,
    console,
    customElements: {
      define: (name, ctor) => registry.set(name, ctor),
      get: (name) => registry.get(name),
      whenDefined: () => new Promise(() => {}),
    },
    queueMicrotask,
    setTimeout,
    _cardHeightConfigValue: (value) => value,
    _boolConfigValue: (value, fallback = true) => {
      if (value === undefined || value === null || value === '') return fallback;
      if (value === true || value === 'true') return true;
      if (value === false || value === 'false') return false;
      return Boolean(value);
    },
    _cornerStyleConfigValue: (value) => value,
    _directionConfigValue: (value) =>
      ['ltr', 'rtl'].includes(String(value || '').toLowerCase())
        ? String(value).toLowerCase()
        : 'auto',
    _findTimeZoneOption: () => null,
    _migrateLegacyFeelsLikeToUniqueRootSource: () => false,
    _searchTimeZoneOptions: () => [],
    _skyCoordinatePair: () => null,
    _sourceWithDisplayDefaults: (source) => ({ ...source }),
    _textSizeConfigValue: (value) => value,
    _weatherSourceId: (source, index) => source?.id || `source-${index}`,
    _resolvedTextDirection: () => 'ltr',
  };

  vm.runInNewContext(
    `${source.slice(start, end)}\nthis.__NimbusWeatherCardEditor = NimbusWeatherCardEditor;`,
    context,
    { filename: CARD_PATH },
  );
  return context.__NimbusWeatherCardEditor;
}

const NimbusWeatherCardEditor = loadEditorClass();

function makeEditorShadow({
  rows = [],
  sourceMode = null,
  picker = null,
  sourceIndex = 0,
  sourceTypeValue = 'weather',
} = {}) {
  const trigger = new FakeControl();
  const sourceEntry = { dataset: { idx: String(sourceIndex) } };
  const sourceType = new FakeControl({ value: sourceTypeValue });
  const sourceName = new FakeControl({ value: 'Weather source' });
  const sourceEntity = new FakeControl({ value: 'weather.home' });
  const modeControl =
    sourceMode === null
      ? null
      : new FakeControl({ value: sourceMode, dataset: { idx: String(sourceIndex) } });

  return {
    trigger,
    getElementById() {
      return null;
    },
    querySelector(selector) {
      if (selector === `.source-type[data-idx="${sourceIndex}"]`) return sourceType;
      if (selector === `.source-name[data-idx="${sourceIndex}"]`) return sourceName;
      if (selector === `.source-entity[data-idx="${sourceIndex}"]`) return sourceEntity;
      if (selector === `.source-extra-mode[data-idx="${sourceIndex}"]`) return modeControl;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '.sensor-entry') return rows;
      if (selector === '.source-entry') return sourceMode === null ? [] : [sourceEntry];
      if (selector === '.sensor-entity-picker') return picker ? [picker] : [];
      if (
        selector ===
        'select:not(.source-extra-mode), input[type="text"]:not(.timezone-search):not(.source-sky-coordinate), input[type="checkbox"], input[type="range"]'
      ) {
        return [trigger];
      }
      return [];
    },
  };
}

test('source Extra Sensors modes map absent, empty and non-empty arrays without migration', () => {
  const editor = new NimbusWeatherCardEditor();

  assert.equal(editor._sourceExtraMode({ id: 'inherit' }, 0), 'inherit');
  assert.equal(editor._sourceExtraMode({ id: 'none', local_sensors: [] }, 1), 'none');
  assert.equal(
    editor._sourceExtraMode(
      { id: 'custom', local_sensors: [{ entity: 'sensor.outdoor_humidity' }] },
      2,
    ),
    'custom',
  );
});

test('setConfig before hass rerenders once for first hass and only syncs routine updates', () => {
  const editor = new NimbusWeatherCardEditor();
  let renders = 0;
  let pickerSyncs = 0;
  editor._render = () => {
    renders += 1;
    editor._rendered = true;
  };
  editor._syncExtraSensorPickers = () => {
    pickerSyncs += 1;
  };

  editor.setConfig({ entity: 'weather.home' });
  assert.equal(renders, 1, 'setConfig performs the initial render');

  editor.hass = { states: {} };
  assert.equal(renders, 2, 'first hass assignment repairs a config-first render');
  assert.equal(pickerSyncs, 0);

  editor.hass = { states: { 'sensor.updated': { state: '1' } } };
  assert.equal(renders, 2, 'routine hass updates must not replace focused editor DOM');
  assert.equal(pickerSyncs, 1, 'routine hass updates refresh picker properties');
});

for (const scenario of [
  { mode: 'inherit', expected: undefined },
  { mode: 'none', expected: [] },
  {
    mode: 'custom',
    expected: [{ entity: 'sensor.source_only', icon: 'mdi:thermometer', name: 'Source' }],
  },
]) {
  test(`scoped sensor collection keeps global and source rows isolated in ${scenario.mode} mode`, () => {
    const editor = new NimbusWeatherCardEditor();
    const rows = [
      sensorRow('global', {
        entity: 'sensor.global_only',
        icon: 'mdi:home',
        name: 'Default',
      }),
      sensorRow('global'),
      sensorRow('source-0', {
        entity: 'sensor.source_only',
        icon: 'mdi:thermometer',
        name: 'Source',
      }),
      sensorRow('source-0'),
    ];
    const shadow = makeEditorShadow({ rows, sourceMode: scenario.mode });
    editor.shadowRoot = shadow;
    editor._config = {
      entity: 'weather.home',
      local_sensors: [{ entity: 'sensor.stale_default' }],
      sources: [
        {
          id: 'home',
          type: 'weather',
          entity: 'weather.home',
          local_sensors: [{ entity: 'sensor.stale_source' }],
        },
      ],
    };

    editor._attach();
    shadow.trigger.emit('change');

    const config = plain(editor._config);
    assert.deepEqual(config.local_sensors, [
      { entity: 'sensor.global_only', icon: 'mdi:home', name: 'Default' },
    ]);
    if (scenario.expected === undefined) {
      assert.equal(
        Object.hasOwn(config.sources[0], 'local_sensors'),
        false,
        'Use defaults is represented by an omitted source property',
      );
    } else {
      assert.deepEqual(config.sources[0].local_sensors, scenario.expected);
    }
    assert.equal(JSON.stringify(config).includes('"entity":""'), false);
    assert.equal(
      config.local_sensors.some((sensor) => sensor.entity === 'sensor.source_only'),
      false,
      'source rows must not leak into defaults',
    );
  });
}

test('blank draft rows are editor-only and never serialize placeholder sensor objects', () => {
  const editor = new NimbusWeatherCardEditor();
  const rows = [sensorRow('global'), sensorRow('source-0')];
  const shadow = makeEditorShadow({ rows, sourceMode: 'custom' });
  editor.shadowRoot = shadow;
  editor._config = {
    entity: 'weather.home',
    sources: [{ id: 'home', type: 'weather', entity: 'weather.home' }],
  };

  editor._attach();
  shadow.trigger.emit('change');

  const config = plain(editor._config);
  assert.deepEqual(config.local_sensors, []);
  assert.equal(Object.hasOwn(config.sources[0], 'local_sensors'), false);
  assert.equal(JSON.stringify(config).includes('"entity":""'), false);
});

test('editor retains local sources backed by any supported local metric', () => {
  const supportedSources = [
    { id: 'wind', type: 'local', wind_speed: 'sensor.wind' },
    { id: 'uv', type: 'local', local_uv: 'sensor.uv' },
    { id: 'condition', type: 'local', condition: 'sensor.condition' },
    { id: 'rain', type: 'local', precipitation: 'sensor.rain' },
    { id: 'feels', type: 'local', feels_like: 'sensor.feels_like' },
  ];

  for (const source of supportedSources) {
    const editor = new NimbusWeatherCardEditor();
    const shadow = makeEditorShadow({
      sourceMode: 'inherit',
      sourceTypeValue: 'local',
    });
    editor.shadowRoot = shadow;
    editor._config = { sources: [source] };

    editor._attach();
    shadow.trigger.emit('change');

    assert.equal(editor._config.sources.length, 1, `${source.id} source must survive save`);
    assert.equal(editor._config.sources[0].id, source.id);
  }
});

test('single-source editor keeps extra sensors editable while forecast is enabled', () => {
  const editor = new NimbusWeatherCardEditor();
  editor._hass = {
    states: {
      'weather.home': {
        state: 'sunny',
        attributes: { friendly_name: 'Home' },
      },
    },
  };
  editor._config = {
    entity: 'weather.home',
    show_forecast: true,
    local_sensors: [{ entity: 'sensor.humidity' }],
  };

  editor._render();

  const sensorsSection = editor.shadowRoot.innerHTML.match(
    /<div class="section" id="sensors-section"[\s\S]*?<!-- TAP ACTION -->/,
  )?.[0];
  assert.ok(sensorsSection, 'extra-sensor section must render');
  assert.doesNotMatch(sensorsSection, /\sdisabled(?:[\s>])/, 'sensor controls remain enabled');
  assert.match(sensorsSection, /Supplemental Sensors page with forecast/);
});

test('unrelated editor saves preserve legacy supplemental-sensor overflow', () => {
  const sensors = Array.from({ length: 7 }, (_, index) => ({
    entity: `sensor.extra_${index + 1}`,
    name: `Extra ${index + 1}`,
  }));

  const rootEditor = new NimbusWeatherCardEditor();
  const rootShadow = makeEditorShadow({
    rows: sensors.slice(0, 5).map((sensor) => sensorRow('global', sensor)),
  });
  rootEditor.shadowRoot = rootShadow;
  rootEditor._config = { entity: 'weather.home', local_sensors: sensors };
  rootEditor._attach();
  rootShadow.trigger.emit('change');
  assert.deepEqual(plain(rootEditor._config.local_sensors), sensors);

  const sourceEditor = new NimbusWeatherCardEditor();
  const sourceShadow = makeEditorShadow({
    rows: sensors.slice(0, 5).map((sensor) => sensorRow('source-0', sensor)),
    sourceMode: 'custom',
  });
  sourceEditor.shadowRoot = sourceShadow;
  sourceEditor._config = {
    entity: 'weather.home',
    sources: [
      {
        id: 'home',
        type: 'weather',
        entity: 'weather.home',
        local_sensors: sensors,
      },
    ],
  };
  sourceEditor._attach();
  sourceShadow.trigger.emit('change');
  assert.deepEqual(plain(sourceEditor._config.sources[0].local_sensors), sensors);
});

test('Home Assistant entity picker receives searchable-picker properties and serializes selection', () => {
  const editor = new NimbusWeatherCardEditor();
  const row = sensorRow('global', { entity: 'sensor.existing' });
  const picker = new FakeControl();
  picker.closest = (selector) => (selector === '.sensor-entry' ? row : null);
  const shadow = makeEditorShadow({ rows: [row], picker });
  editor.shadowRoot = shadow;
  const hass = { states: { 'sensor.existing': { state: '1' } } };
  editor._hass = hass;
  editor._config = { entity: 'weather.home' };

  editor._attach();

  assert.equal(picker.hass, hass);
  assert.equal(picker.value, 'sensor.existing');
  assert.equal(picker.label, 'Entity');
  assert.equal(picker.placeholder, 'Search entity');
  assert.equal(picker.allowCustomEntity, true);
  assert.deepEqual(Array.from(picker.excludeDomains), ['weather', 'sun']);
  assert.equal(picker.disabled, false);
  assert.equal((picker._listeners.get('value-changed') || []).length, 1);

  picker.emit('value-changed', { value: 'sensor.selected_by_name' });
  assert.equal(row.fields['.sensor-entity'].value, 'sensor.selected_by_name');
  assert.deepEqual(plain(editor._config.local_sensors), [
    { entity: 'sensor.selected_by_name' },
  ]);

  picker.emit('value-changed', { value: '' });
  assert.deepEqual(plain(editor._config.local_sensors), []);
  assert.equal(JSON.stringify(editor._config).includes('"entity":""'), false);
});
