# Changelog

Notable changes to Nimbus Weather Card are recorded here. Nimbus follows semantic versioning with release tags in the form `vMAJOR.MINOR.PATCH`.

## [Unreleased]

## [v2.6.0] — 2026-10-08

### Added

- Source-aware Forecast/Sensors carousel. The outer card stays fixed while the lower content slides horizontally.
- Swipe, pagination-pill, and keyboard navigation between forecast and supplemental sensor pages.
- Carousel page persistence per weather source across normal renders and entity updates.
- Root default and per-source supplemental sensor lists with explicit inherit, none, and custom modes.
- Visual-editor entity search, optional labels, optional icon overrides, and support for up to five supplemental sensors per list.
- One-shot sensor-page discoverability motion, three-reading windows, and unavailable-value filtering.
- Opt-in `show_precipitation_probability` at root or source level. Numeric zero is preserved as a valid forecast value.
- Generic `direction: auto | ltr | rtl` support for layout, gestures, keyboard navigation, and numeric isolation.
- Focus management for inactive carousel pages, reduced-motion handling, and larger coarse-pointer targets.

### Changed

- The expanded hourly/7-day forecast remains a separate bottom-right control; it is independent from the Forecast/Sensors page switch.
- Panel Fill distributes the existing card sections through available height and falls back to natural height on short panels.
- Supplemental sensor selection is source-aware: an omitted source list inherits root defaults, `[]` opts out, and a non-empty list replaces the defaults.
- Existing forecast-disabled YAML can continue to render all configured legacy sensor rows even though the editor and carousel cap new lists at five.

### Fixed

- Default Extra Sensors remain editable in single-source cards while the forecast strip is enabled.
- Unrelated visual-editor saves preserve legacy supplemental-sensor entries beyond the five-item editor limit.
- Forecast strip, expanded modal, and hourly sun-event temperatures use the active source unit before display conversion.
- The visual editor retains Local Station sources when they contain any supported local metric, including pressure-, wind-, UV-, condition-, precipitation-, or feels-like-only configurations.
- Supplemental sensor state changes remain tracked for legacy YAML lists beyond the editor limit.
- Precipitation probability rows are omitted when the provider supplies no valid values instead of rendering placeholders as data.
- Saved source and carousel selections use an order-independent source-set key, with migration from the previous ordered key, so stable source IDs survive tab reordering.

### Validation

- Regression coverage now protects existing forecast-subscription cleanup, source-order persistence and migration, plus the editor and source-specific compatibility paths above.

## [v2.5.1]

### Changed

- Refreshed the HACS README demo GIF. Runtime behavior is unchanged from v2.5.0.

## [v2.5.0]

### Added

- Global and per-source IANA time-zone configuration.
- Optional exact per-source coordinates for solar and lunar context.
- Source-local time for the clock, hourly forecast start, daily range, and sky rendering.
- Automatic, rounded, and square corner styles.
- Richer Local Station editor controls.

### Changed

- Hero moon, forecast moons, and night-sky lighting use the same continuous astronomical phase model.
- Animation pausing retains the correct static cloud and lightning state.

### Fixed

- Forecast subscriptions are isolated per source and stale asynchronous subscriptions are cleaned up.
- Temperature conversion and daily high/low handling use the active source's unit and local day.
- Canvas and UFO animation lifecycles use independent animation-frame handles.

## [v2.4.2]

### Changed

- Daily high/low preserves the widest valid range observed for the active source and local date.
- Forecast and modal moon icons use a grey palette closer to the large moon.
- Aurora uses a higher, layered cyan/green curtain without the earlier pink/purple mass.

### Fixed

- Temporary invalid daily ranges during Home Assistant restarts or updates no longer replace a stable range.

## [v2.4.1]

### Changed

- Common provider condition variants are normalised before rendering.
- Fog uses soft radial mist veils instead of visible horizontal bands.
- The exceptional-state warning icon has a more balanced small-size shape.
- Moon opacity is reduced behind overcast, exceptional, and lightning conditions.

### Fixed

- `overcast` uses the cloudy icon rather than the exceptional warning icon.
- `overcast` and `exceptional` use appropriate night backgrounds.

## [v2.4.0]

### Added

- Multiple weather integrations, locations, and Local Station sources as tabs.
- Source editor with a preview that follows the source being edited.
- Per-source forecast type, item count, time format, strip/details/clock visibility, and wind unit.
- Local Station readings alongside reference forecast integrations.
- Continuous moon terminator shared by hero and forecast icons.
- Southern-hemisphere aurora treatment for Antarctic latitude zones.

### Changed

- Smoother sunrise, sunset, twilight, astronomical-night, and sun/moon transitions.
- More natural mobile and procedural cloud variation.
- Lens flares are limited to sunny conditions and peak near solar noon.

### Fixed

- Daily lows no longer follow the current or remaining hourly temperature.
- Invalid restart ranges and unavailable supplemental readings are ignored.
- Active source persists after refresh when possible.
- More Info and the editor preview follow the selected source.

## [v2.3.0]

### Added

- Approximately three-minute background cross-fades between sun-elevation zones.
- Aurora Borealis for clear Arctic nights.
- Thunderstorm sky-flash effect.
- Shooting stars on clear nights.
- Forecast dialog haptics, swipe-to-close, backdrop tap, Escape key, and accessibility semantics.

### Changed

- Refined night colours and visual layer ordering.

### Fixed

- The moon remains visible for an explicit `clear-night` condition.
- Internal timers are cleaned up when the card is removed or rebuilt.

## [v2.2.0]

### Added

- Seven-phase solar gradient from deep night through midday.
- Automatic moon phase calculation and fixed top-right hero placement.
- Daily/hourly expanded forecast flow and configurable card tap actions.
- Dedicated mobile cloud rendering.
- Redesigned thermometer icon.

### Fixed

- Hero high/low values use daily data when the strip is hourly.
- `clear-night` from integrations such as KNMI displays daytime visuals when the sun is up.

## [v2.0.1]

### Added

- English, Spanish, and German language selection.

### Fixed

- Added the HACS filename metadata required for update notifications.
- Forecast icons use the correct day/night context for each forecast timestamp.
- The sun entity takes priority over a stale weather condition for day/night detection.

## [v2.0.0]

### Added

- Complete visual rewrite with animated rain, glass droplets, SVG clouds, snow, lightning, and wind-blown autumn leaves.
- Dynamic solar gradient based on sun elevation.
- Textured moon rendering with hemisphere-aware orientation.

[Unreleased]: https://github.com/maxfok/nimbus-weather-card/compare/v2.6.0...HEAD
[v2.6.0]: https://github.com/maxfok/nimbus-weather-card/compare/v2.5.1...v2.6.0
[v2.5.1]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.5.1
[v2.5.0]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.5.0
[v2.4.2]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.4.2
[v2.4.1]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.4.1
[v2.4.0]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.4.0
[v2.3.0]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.3.0
[v2.2.0]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.2.0
[v2.0.1]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.0.1
[v2.0.0]: https://github.com/maxfok/nimbus-weather-card/releases/tag/v2.0.0
