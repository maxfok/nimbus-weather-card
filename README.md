# Nimbus Weather Card v2.0.0 & v2.0.1 — Complete rewrite! Animated moon, rain, snow, lightning, fog & multilingual support 🌙⚡❄️

After months of work, I'm excited to share the biggest update yet to Nimbus Weather Card — a complete rewrite of the visual engine with all-new weather effects.

🔗 **GitHub**: https://github.com/maxfok/nimbus-weather-card
📦 **HACS**: Search "Nimbus Weather Card"

---

## 🌟 What's new in v2.0.0

### 🌙 Moon with NASA texture + real phase calculation
The moon now uses an actual NASA texture with all 8 phases rendered accurately using canvas overlay geometry. It floats gently and rotates slowly — and yes, it accounts for your hemisphere's latitude.

### ☀️ Dynamic Sun based on solar elevation
The sun gradient changes throughout the day based on your `sun.sun` entity's elevation:
- **Sunrise** (~0-8°): warm golden tones
- **Morning/Afternoon** (8-30°): bright blue sky
- **Noon** (30°+): white-hot sun, deep blue

### 🌧️ Realistic rain + glass window droplets
Rain tilt adjusts based on actual wind bearing and speed. On rainy conditions, glass droplets appear on the "window" — they slide down slowly and reappear in random positions.

### ❄️ 3-layer snow with depth effect
Far, mid, and near layers with different opacity, size, and speed. Sine-wave sway for natural-looking movement.

### ⚡ Lightning with midpoint displacement
Proper branching bolt algorithm with sky flash, glow layers, and random double-flash. Intervals of 2-7 seconds.

### 🍂 Autumn leaf gusts for windy conditions
Replaced the old horizontal streaks with groups of 4-8 autumn leaves that sweep across the card every few seconds. Much more natural!

### ☁️ SVG feTurbulence clouds
Organic cloud shapes using SVG filters — different configurations for partly cloudy, cloudy, overcast, stormy, and night conditions.

### 🌫️ Fog effect
Layered animated mist with improved dark background for better visibility.

---

## 🌍 What's new in v2.0.1 — Internationalization

This one's for the community! Two users asked for translations in the previous release thread:

> — **u/R3x10** Spanish

> — **u/super-gando** German

**Done!** v2.0.1 adds:

- 🇬🇧 **English** (default)
- 🇪🇸 **Español** — condition labels, day names, clock date
- 🇩🇪 **Deutsch** — condition labels, day names, clock date

Select the language from the card editor. More languages coming — want to add yours? It's just a few lines in a Pull Request!

---

## 🔧 Also fixed

- Pressure field now hidden when no sensor is available (thanks **Andrew** for reporting!)
- Forecast icons now correctly show day/night per hour (no more moon at 1pm!)
- Sun entity takes priority over weather state for day/night detection
- HACS update notifications now work correctly (was missing `filename` in hacs.json — oops!)
- Removed ~600 lines of duplicate code

---

## 📦 Installation

**Via HACS** (recommended): Search for "Nimbus Weather Card"

**Manual**:
```
/config/www/community/nimbus-weather-card/nimbus-weather-card.js
```

**Lovelace config**:
```yaml
type: custom:nimbus-weather-card
entity: weather.forecast_home
sun_entity: sun.sun
language: en  # en | es | de
```

---

*Any bugs, feature requests or translation contributions — open an issue or PR on GitHub. Thanks for all the support!* 🙏
