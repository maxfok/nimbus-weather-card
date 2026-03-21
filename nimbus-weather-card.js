/**
 * Bubble Weather Card v2.0.0 - Fixed Night Mode
 * Apple Weather-inspired card for Home Assistant
 */

const MDI = {
  sunny: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="gs"><stop offset="0%" stop-color="rgba(255,255,255,0.7)"/><stop offset="100%" stop-color="rgba(255,255,255,0.15)"/></radialGradient></defs>
    <circle cx="32" cy="32" r="12" fill="url(#gs)" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
    <g stroke="rgba(255,255,255,0.45)" stroke-width="2" stroke-linecap="round">
      <line x1="32" y1="6" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="58"/>
      <line x1="6" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="58" y2="32"/>
      <line x1="14" y1="14" x2="19.6" y2="19.6"/><line x1="44.4" y1="44.4" x2="50" y2="50"/>
      <line x1="14" y1="50" x2="19.6" y2="44.4"/><line x1="44.4" y1="19.6" x2="50" y2="14"/>
    </g>
  </svg>`,
  'clear-night': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.5)"/><stop offset="100%" stop-color="rgba(255,255,255,0.1)"/></linearGradient></defs>
    <path d="M36 8C24.95 8 16 16.95 16 28s8.95 20 20 20c3.9 0 7.55-1.12 10.64-3.06A16 16 0 0 1 28 16c2.8 0 5.44.72 7.73 2z" fill="url(#gn)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <circle cx="45" cy="14" r="1.2" fill="rgba(255,255,255,0.5)"/><circle cx="51" cy="26" r="0.8" fill="rgba(255,255,255,0.3)"/>
  </svg>`,
  partlycloudy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="gps"><stop offset="0%" stop-color="rgba(255,255,255,0.6)"/><stop offset="100%" stop-color="rgba(255,255,255,0.15)"/></radialGradient>
    <linearGradient id="gpc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.45)"/><stop offset="100%" stop-color="rgba(255,255,255,0.12)"/></linearGradient></defs>
    <circle cx="24" cy="22" r="8" fill="url(#gps)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <g stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round">
      <line x1="24" y1="8" x2="24" y2="12"/><line x1="12" y1="22" x2="16" y2="22"/>
      <line x1="15" y1="13" x2="17.8" y2="15.8"/>
    </g>
    <path d="M46 44H22a10 10 0 0 1-1.5-19.9A12 12 0 0 1 46 32a8 8 0 0 1 0 12z" fill="url(#gpc)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  </svg>`,
  'partlycloudy-night': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gpn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.35)"/><stop offset="100%" stop-color="rgba(255,255,255,0.08)"/></linearGradient>
    <linearGradient id="gpnc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.4)"/><stop offset="100%" stop-color="rgba(255,255,255,0.1)"/></linearGradient></defs>
    <path d="M26 10c-6 0-11 5-11 11s5 11 11 11c2 0 4-.6 5.6-1.6A9 9 0 0 1 22 14c1.5 0 3 .4 4.2 1z" fill="url(#gpn)" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
    <path d="M46 44H22a10 10 0 0 1-1.5-19.9A12 12 0 0 1 46 32a8 8 0 0 1 0 12z" fill="url(#gpnc)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  </svg>`,
  cloudy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gc1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.35)"/><stop offset="100%" stop-color="rgba(255,255,255,0.08)"/></linearGradient>
    <linearGradient id="gc2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.45)"/><stop offset="100%" stop-color="rgba(255,255,255,0.12)"/></linearGradient></defs>
    <path d="M44 42H16a10 10 0 0 1-1.6-19.88A12 12 0 0 1 38 16a8 8 0 0 1 6 26z" fill="url(#gc1)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <path d="M50 50H22a10 10 0 0 1-1.6-19.88A12 12 0 0 1 44 24a8 8 0 0 1 6 26z" fill="url(#gc2)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  </svg>`,
  fog: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M46 30H20a9 9 0 0 1-1.4-17.9A11 11 0 0 1 46 20a7 7 0 0 1 0 10z" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <line x1="10" y1="40" x2="54" y2="40" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="14" y1="47" x2="50" y2="47" stroke="rgba(255,255,255,0.25)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="12" y1="54" x2="52" y2="54" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  rainy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="grc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.4)"/><stop offset="100%" stop-color="rgba(255,255,255,0.1)"/></linearGradient></defs>
    <path d="M48 36H18a10 10 0 0 1-1.5-19.9A12 12 0 0 1 48 24a8 8 0 0 1 0 12z" fill="url(#grc)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <g stroke="rgba(255,255,255,0.55)" stroke-width="2" stroke-linecap="round">
      <line x1="20" y1="42" x2="18" y2="50"/><line x1="30" y1="42" x2="28" y2="50"/><line x1="40" y1="42" x2="38" y2="50"/>
    </g>
  </svg>`,
  pouring: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 34H18a10 10 0 0 1-1.5-19.9A12 12 0 0 1 48 22a8 8 0 0 1 0 12z" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <g stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round">
      <line x1="16" y1="40" x2="13" y2="52"/><line x1="24" y1="40" x2="21" y2="52"/>
      <line x1="32" y1="40" x2="29" y2="52"/><line x1="40" y1="40" x2="37" y2="52"/>
      <line x1="48" y1="40" x2="45" y2="52"/>
    </g>
  </svg>`,
  lightning: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 34H18a10 10 0 0 1-1.5-19.9A12 12 0 0 1 48 22a8 8 0 0 1 0 12z" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <path d="M34 34l-4 10h6l-5 14 10-16h-6l4-8z" fill="rgba(255,255,255,0.75)"/>
  </svg>`,
  'lightning-rainy': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 32H18a10 10 0 0 1-1.5-19.9A12 12 0 0 1 48 20a8 8 0 0 1 0 12z" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <g stroke="rgba(255,255,255,0.45)" stroke-width="1.8" stroke-linecap="round">
      <line x1="18" y1="38" x2="16" y2="46"/><line x1="42" y1="38" x2="40" y2="46"/>
    </g>
    <path d="M32 32l-3.5 9h5l-4.5 13 9-14h-5.5l3.5-8z" fill="rgba(255,255,255,0.7)"/>
  </svg>`,
  snowy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 34H18a10 10 0 0 1-1.5-19.9A12 12 0 0 1 48 22a8 8 0 0 1 0 12z" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <g fill="rgba(255,255,255,0.6)"><circle cx="20" cy="44" r="2.5" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
    <circle cx="32" cy="42" r="2.5" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
    <circle cx="44" cy="46" r="2.5" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/></g>
  </svg>`,
  'snowy-rainy': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 34H18a10 10 0 0 1-1.5-19.9A12 12 0 0 1 48 22a8 8 0 0 1 0 12z" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <g stroke="rgba(255,255,255,0.45)" stroke-width="1.8" stroke-linecap="round">
      <line x1="20" y1="40" x2="18" y2="48"/><line x1="36" y1="40" x2="34" y2="48"/>
    </g>
    <g fill="rgba(255,255,255,0.55)"><circle cx="28" cy="46" r="2.2"/><circle cx="44" cy="44" r="2.2"/></g>
  </svg>`,
  hail: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 34H18a10 10 0 0 1-1.5-19.9A12 12 0 0 1 48 22a8 8 0 0 1 0 12z" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <circle cx="20" cy="44" r="3.2" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
    <circle cx="32" cy="42" r="3.2" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
    <circle cx="44" cy="46" r="3.2" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
  </svg>`,
  windy: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="rgba(255,255,255,0.45)" stroke-width="2.5" stroke-linecap="round">
      <path d="M8 20h30a5 5 0 1 0-3.5-8.5"/>
      <path d="M8 32h38a4 4 0 1 1-3 6.6"/>
      <path d="M12 44h26a4.5 4.5 0 1 0-3.2-7.7"/>
    </g>
  </svg>`,
  'windy-variant': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="rgba(255,255,255,0.4)" stroke-width="2.5" stroke-linecap="round">
      <path d="M8 24h28a5 5 0 1 0-3.5-8.5"/>
      <path d="M8 38h34a4 4 0 1 1-3 6.6"/>
    </g>
  </svg>`,
  exceptional: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 50L32 10l13 40H19z" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="32" y1="24" x2="32" y2="36" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="32" cy="43" r="1.5" fill="rgba(255,255,255,0.7)"/>
  </svg>`,
  humidity: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ghm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.45)"/><stop offset="100%" stop-color="rgba(255,255,255,0.12)"/></linearGradient></defs>
    <path d="M32 8l14 14a20 20 0 1 1-28 0z" fill="url(#ghm)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  </svg>`,
  wind: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="rgba(255,255,255,0.45)" stroke-width="2.5" stroke-linecap="round">
      <path d="M8 22h24a4 4 0 1 0-3-6.6"/><path d="M8 38h30a4 4 0 1 1-3 6.6"/>
    </g>
  </svg>`,
  pressure: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
    <line x1="32" y1="20" x2="32" y2="32" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round"/>
    <line x1="32" y1="32" x2="40" y2="40" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="2" fill="rgba(255,255,255,0.6)"/>
  </svg>`,
  thermometer: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="28" y="10" width="8" height="30" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
    <rect x="30" y="20" width="4" height="20" rx="2" fill="rgba(255,160,120,0.7)"/>
    <circle cx="32" cy="46" r="8" fill="rgba(255,130,100,0.6)" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
    <line x1="36" y1="20" x2="40" y2="20" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="36" y1="27" x2="40" y2="27" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="36" y1="34" x2="40" y2="34" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
};

// ── MOON PHASE SVG ──
// Σχεδιάζει το σωστό σχήμα φεγγαριού με clip-path geometry.
// Χρησιμοποιεί δύο ημικύκλια: ένα για τη φωτισμένη πλευρά, ένα ellipse για τη σκιά.
// Υπολογισμός lit path βάσει phase string
// Ακολουθεί την ίδια λογική με το button-card offset map:
// new=40, wax_cres=25, first_q=10, wax_gib=-10, full=-40, wan_gib=-10, last_q=10, wan_cres=25
// offset = cos(2π*phase)*r  → new(0)=+r, full(0.5)=-r
// Μετατρέπουμε το string σε offset απευθείας
function _moonLitPath(phase, r, cx, cy) {
  // offset του shadow circle (όπως button-card, κανονικοποιημένο σε r=1)
  const offMap = {
    'new_moon':        1.00,   // σκιά στο κέντρο → όλο σκοτεινό
    'waxing_crescent': 0.60,   // λεπτή ημισέληνος δεξιά
    'first_quarter':   0.22,   // δεξί ημικύκλιο
    'waxing_gibbous': -0.22,   // σχεδόν γεμάτο δεξιά
    'full_moon':      -1.00,   // σκιά μακριά → όλο φωτεινό
    'waning_gibbous': -0.22,   // σχεδόν γεμάτο αριστερά
    'last_quarter':    0.22,   // αριστερό ημικύκλιο
    'waning_crescent': 0.60,   // λεπτή ημισέληνος αριστερά
  };
  const off = (offMap[phase] !== undefined ? offMap[phase] : -1.00) * r;
  const shadowCx = cx + off;

  // Lit path = full circle MINUS shadow circle overlap
  // Υλοποίηση: clipPath με SVG path (ημισφαίριο + ελλειπτικό terminator)
  // Υπολογίζουμε tx = απόσταση shadow center από cx
  const tx = Math.abs(off); // x-radius του terminator ellipse

  const isWaxing = ['waxing_crescent','first_quarter','waxing_gibbous'].includes(phase);
  const isNew    = phase === 'new_moon';
  const isFull   = phase === 'full_moon';

  if (isNew)  return `M${cx},${cy-r} A${r},${r} 0 0,1 ${cx},${cy+r} A0,${r} 0 0,0 ${cx},${cy-r} Z`; // κενό
  if (isFull) return `M${cx},${cy-r} A${r},${r} 0 1,1 ${cx},${cy+r} A${r},${r} 0 1,1 ${cx},${cy-r} Z`; // πλήρες

  if (isWaxing) {
    // Φωτεινό δεξιά: δεξί ημικύκλιο + terminator που κόβει αριστερά
    // waxing_crescent: terminator κοίλος προς τα αριστερά (sweep=0)
    // waxing_gibbous:  terminator κοίλος προς τα δεξιά (sweep=1)
    const sweep = off > 0 ? 0 : 1;
    return `M${cx},${cy-r} A${r},${r} 0 0,1 ${cx},${cy+r} A${tx},${r} 0 0,${sweep} ${cx},${cy-r} Z`;
  } else {
    // Φωτεινό αριστερά: αριστερό ημικύκλιο + terminator
    const sweep = off > 0 ? 1 : 0;
    return `M${cx},${cy-r} A${r},${r} 0 0,0 ${cx},${cy+r} A${tx},${r} 0 0,${sweep} ${cx},${cy-r} Z`;
  }
}

// Craters από vecteezy SVG — scaled για κάθε μέγεθος
function _moonCraters(r, cx, cy, opacity) {
  const origR = 155.1, origCx = 177.4, origCy = 672.7;
  const s = r / origR;
  const mt = `translate(${cx},${cy}) scale(${s}) translate(${-origCx},${-origCy})`;
  return `<g transform="${mt}" opacity="${opacity}" fill="#8A7F76">
    <path d="M165.3,661.2c0.9-1.5,2.5-2.5,3.6-3.9c5.2-5.9,0.4-16-1.4-21.8c-1.1-3.4-3.9-6.1-7.5-6.6c-6.8-1-9.5,5.9-10.7,11.7c-2.9,14.2-16.6,10.7-16,25.6c0,0.1,0,0.2,0,0.3c0.3,6.5-8.2,9.1-11.6,3.6c-4.9-8-9.8-16.1-13.1-24.8c-6.8-17.9-4.4-42.2,12.7-50.6c9-4.4,19.6-3.3,29.5-4.5c9.9-1.3,21.1-6.9,22.1-16.9c-1.8-2-3.6-3.9-5.4-5.9c5.1-2.1,7.9-8.6,5.8-13.8c-2.9-7.4-25-17.8-32.1-13c-6.2,4.2-9.6,11.8-15.8,16c-9.7,6.5-22.9,2.8-34.3,5.2c-10,2.1-17.8,8.7-24.2,16.9c-0.6-0.8-1.1-1.6-1.4-2.7c-1-3.2-1.1-6.5-1-9.8c-2.5,2.6-4.8,5.3-7.1,8c-20.7,25.2-33.7,57.1-35.1,91.9c2.7-4.3,5.4-8.5,8.1-12.8c4.4,2.9,8.7,5.8,13.1,8.7c1.7,5.4,4.2,10.6,7.5,15.1c-0.6,0.3-1.2,0.8-1.6,1.3c-2.2,2.5-2.4,6.2-1.9,9.5c0.5,3.3,1.6,6.5,1.8,9.8c0.2,3.3-0.7,6.6-0.1,9.9c1.1,6.1,7.8,10.7,13.9,9.3c6.1-1.3,10.4-8.2,8.8-14.3c2.6,2.4,7.3,0.1,8.2-3.3c0.5-2,0.3-4-0.4-5.9c5.3,0.3,10.6,0,15.4,2.1c-0.5,3.1-0.1,6.3,1.3,9.1c-3.7,2.9-7.1,6.6-8.4,11.2c-1.3,4.5-0.1,10.1,3.8,12.7c0.2,0.1,0.4,0.3,0.6,0.4c0.7,0.9,1.5,1.7,2.6,2.2c5.6,3.2,13.9-0.8,14.9-7.2c3.2,9.6,18.6,9.3,24.6,1.1c3.2-4.4,4.2-9.7,4-15.1c7.4,0.3,22.2-22.8,15.9-26.3c3.8,2.1,7.9,4.3,12.4,3.5c2.6-0.5,5-2.1,5.8-4.7C175.1,674.5,161.4,668.1,165.3,661.2z"/>
    <path d="M288.2,616.6c-1.6-5.5-6-9.8-7.2-15.4c-0.8-3.6,0-7.4,0.2-11.1c0.8-13.6-21.8-16-31.7-10.9c-5.1,2.6-8.4,8.1-9.4,13.8s0.2,11.6,2.4,16.9c3.6,8.9,9.9,16.6,17.9,21.9c4,2.6,8.5,4.7,13.3,4.6C283,636.1,290.8,625.7,288.2,616.6z"/>
    <path d="M193.5,610.3c2.9-3.8,2.8-9.5-0.2-13.2c-8.6-10.5-17.9,2.8-24.8,7.5c-4,2.7-7.9,7.7-5.7,12.1c1.5,3,5.3,4.1,7.8,6.3c4.8,4.2,4.6,11.7,7.8,17.2c4.4,7.4,15.7,9.3,22.3,3.8c6.6-5.5,6.7-17,0.2-22.6c2.2-1.6,4.4-3.3,5.7-5.7c1.3-2.4,1.4-5.6-0.5-7.6C202.8,604.6,197.2,607.4,193.5,610.3z"/>
    <path d="M300.2,643.9c3.8-2.5,1.6-9.7-2.9-9.8c-2.7-2.4-8.2-1.5-11.4,1.1c-6.1,4.9-9.1,13.8-6,20.9c3.1,7.2,12.7,11.1,19.4,7.2C306,659.4,306.8,648,300.2,643.9z"/>
  </g>`;
}

// Μικρό φεγγάρι για forecast icons (viewBox 24×24)
function getMoonSVG(phase) {
  const r = 10, cx = 12, cy = 12;
  const litPath = _moonLitPath(phase, r, cx, cy);
  const uid = 'sm' + phase;
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mg${uid}" cx="60%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#EDD8BC"/><stop offset="60%" stop-color="#C4B09C"/><stop offset="100%" stop-color="#96897F"/>
      </radialGradient>
      <clipPath id="mc${uid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <clipPath id="lc${uid}"><path d="${litPath}"/></clipPath>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#252938" clip-path="url(#mc${uid})"/>
    <g clip-path="url(#lc${uid})">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#mg${uid})"/>
      ${_moonCraters(r, cx, cy, 0.45)}
    </g>
  </svg>`;
}

// Μεγάλο φεγγάρι για particle layer (viewBox 64×64)
function getMoonSVGLarge(phase) {
  const r = 28, cx = 32, cy = 32;
  const litPath = _moonLitPath(phase, r, cx, cy);
  const uid = 'lg' + phase;
  return `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mg${uid}" cx="60%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#EDD8BC"/><stop offset="35%" stop-color="#D9C4AD"/><stop offset="70%" stop-color="#C4B09C"/><stop offset="100%" stop-color="#96897F"/>
      </radialGradient>
      <radialGradient id="gd${uid}" cx="50%" cy="50%" r="50%">
        <stop offset="68%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="88%" stop-color="rgba(0,0,0,0.20)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.52)"/>
      </radialGradient>
      <clipPath id="mc${uid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <clipPath id="lc${uid}"><path d="${litPath}"/></clipPath>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#252938" clip-path="url(#mc${uid})"/>
    <g clip-path="url(#lc${uid})">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#mg${uid})"/>
      ${_moonCraters(r, cx, cy, 0.55)}
    </g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gd${uid})" clip-path="url(#mc${uid})"/>
  </svg>`;
}

function getIcon(condition, isNight, moonPhase) {
  if (condition === 'partlycloudy' && isNight) return MDI['partlycloudy-night'];
  if (condition === 'clear-night' || (condition === 'sunny' && isNight)) {
    return moonPhase ? getMoonSVG(moonPhase) : MDI['clear-night'];
  }
  return MDI[condition] || MDI['exceptional'];
}

const BG_MAP = {
  'sunny': 'bg-sunny', 'clear-night': 'bg-night', 'partlycloudy': 'bg-partlycloudy',
  'cloudy': 'bg-cloudy', 'fog': 'bg-fog', 'rainy': 'bg-rainy', 'pouring': 'bg-rainy',
  'lightning': 'bg-stormy', 'lightning-rainy': 'bg-stormy', 'snowy': 'bg-snowy',
  'snowy-rainy': 'bg-snowy', 'hail': 'bg-snowy', 'windy': 'bg-windy', 'windy-variant': 'bg-windy',
};

const COND_LABELS = {
  'sunny': 'Sunny', 'clear-night': 'Clear Night', 'partlycloudy': 'Partly Cloudy',
  'cloudy': 'Cloudy', 'fog': 'Fog', 'rainy': 'Rainy', 'pouring': 'Pouring',
  'lightning': 'Lightning', 'lightning-rainy': 'Thunder & Rain', 'snowy': 'Snowy',
  'snowy-rainy': 'Sleet', 'hail': 'Hail', 'windy': 'Windy', 'windy-variant': 'Windy',
  'exceptional': 'Exceptional',
};

const BOLT_PATHS = [
  'M50,0 L45,35 L55,38 L42,75 L52,78 L38,100',
  'M55,0 L48,28 L58,32 L44,62 L54,65 L40,100',
  'M45,0 L50,30 L42,34 L55,68 L46,72 L52,100',
  'M52,0 L46,22 L56,26 L43,55 L53,58 L41,85 L48,100',
  'M48,0 L52,32 L44,36 L56,70 L47,74 L55,100',
];

class NimbusWeatherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._forecast = [];
    this._lastEntity = null;
    this._forecastUnsub = null;
    this._lastParticleKey = null;
    this._initialized = false;
    this._lxInterval = null;
    this._timeInterval = null;
    this._iconCache = new Map();
    this._renderDebounced = this._debounce(this._render.bind(this), 100);
  }

  _debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  getCachedIcon(condition, isNight, moonPhase) {
    const key = `${condition}|${isNight}|${moonPhase}`;
    if (this._iconCache.has(key)) return this._iconCache.get(key);
    const icon = getIcon(condition, isNight, moonPhase);
    this._iconCache.set(key, icon);
    return icon;
  }

  set hass(hass) {
    this._hass = hass;
    this._renderDebounced();
  }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define a weather entity');
    this._config = {
      entity: config.entity,
      forecast_type: config.forest_type || config.forecast_type || 'daily',
      max_items: config.max_items || 5,
      show_forecast: config.show_forecast !== false,
      show_details: config.show_details !== false,
      name: config.name || null,
      moon_entity: config.moon_entity || null,
      sun_entity: config.sun_entity || null,
      temperature_unit: config.temperature_unit || 'C',
      use_24h: config.use_24h !== false,
      show_feels_like: config.show_feels_like !== false,
      animation_speed: config.animation_speed || 1,
    };
    if (!config.moon_entity)
      console.warn('[nimbus-weather-card] moon_entity not set — moon phase will not display. Add moon_entity: sensor.moon_phase to your config.');
    if (!config.sun_entity)
      console.warn('[nimbus-weather-card] sun_entity not set — day/night detection will use clock fallback. Add sun_entity: sun.sun for accuracy.');
  }

  // Επιστρέφει ταχύτητα ανέμου και μονάδα από το HA state
  _windSpeed(attrs) {
    const speed = attrs.wind_speed;
    const unit  = attrs.wind_speed_unit || 'km/h';
    if (speed === undefined || speed === null) return '--';
    // Μετατροπή αν το HA δίνει mph
    if (unit === 'mph') return `${this._t(speed)} mph`;
    if (unit === 'm/s')  return `${(speed * 3.6).toFixed(1)} km/h`;
    return `${this._t(speed)} ${unit}`;
  }

  connectedCallback() {
    // Έλεγχος κάθε λεπτό για αλλαγή μέρας/νύχτας
    this._timeInterval = setInterval(() => {
      if (this._hass && this._config) {
        this._render();
      }
    }, 60000);
    // Re-inject σταγόνες κάθε 5 λεπτά για τυχαία θέση
    this._dripInterval = setInterval(() => {
      const cond = this._hass && this._config && this._hass.states[this._config.entity]?.state?.toLowerCase();
      if (cond && ['rainy','pouring','lightning-rainy','snowy-rainy'].includes(cond)) {
        this._lastParticleKey = null;
        this._render();
      }
    }, 1 * 60 * 1000);
  }

  disconnectedCallback() {
    if (this._lxInterval)   { clearInterval(this._lxInterval);   this._lxInterval   = null; }
    if (this._timeInterval) { clearInterval(this._timeInterval);  this._timeInterval = null; }
    if (this._dripInterval) { clearInterval(this._dripInterval);  this._dripInterval = null; }
    if (this._forecastUnsub) { this._forecastUnsub(); this._forecastUnsub = null; }
  }

  _moonPhase() {
    if (this._config.moon_entity && this._hass.states[this._config.moon_entity]) {
      return this._hass.states[this._config.moon_entity].state;
    }
    return null;
  }

  _sunElevation() {
    if (this._config.sun_entity && this._hass.states[this._config.sun_entity]) {
      const elevation = parseFloat(this._hass.states[this._config.sun_entity].attributes.elevation);
      return isNaN(elevation) ? 45 : elevation;
    }
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    return Math.max(-5, Math.min(90, Math.sin((h - 6) / 12 * Math.PI) * 60 - 5));
  }

  _isNight() {
    // Αν έχουμε sun_entity, χρησιμοποιούμε το επίσημο state του HA
    if (this._config && this._config.sun_entity && this._hass) {
      const sun = this._hass.states[this._config.sun_entity];
      if (sun) return sun.state === 'below_horizon';
    }
    // Fallback σε ώρα
    const h = new Date().getHours();
    return h < 7 || h >= 19;
  }

  _bgClass(condition, isNight) {
    // Νυχτερινά backgrounds
    if (isNight) {
      if (condition === 'sunny' || condition === 'clear-night') return 'bg-night';
      if (condition === 'partlycloudy') return 'bg-cloudy-night';
      if (['rainy', 'pouring'].includes(condition)) return 'bg-rainy-night';
      if (['lightning', 'lightning-rainy'].includes(condition)) return 'bg-stormy-night';
      if (['snowy', 'snowy-rainy', 'hail'].includes(condition)) return 'bg-snowy-night';
      if (condition === 'fog') return 'bg-fog-night';
      if (condition === 'cloudy') return 'bg-cloudy-night';
      if (['windy', 'windy-variant'].includes(condition)) return 'bg-windy-night';
    }
    
    // Ημερήσια backgrounds
    return BG_MAP[condition] || 'bg-default';
  }

  _injectParticles(condition, isNight, moonPhase) {
    const box = this.shadowRoot.getElementById('ptcl');
    if (!box) return;

    const elevation = this._sunElevation();
    const key = condition + '|' + isNight + '|' + (moonPhase || '') + '|' + Math.round(elevation / 5);
    if (this._lastParticleKey === key) return;
    this._lastParticleKey = key;
    box.innerHTML = '';
    if (this._lxInterval) { clearInterval(this._lxInterval); this._lxInterval = null; }

    const make = (cls, styles) => {
      const el = document.createElement('div');
      el.className = cls;
      Object.assign(el.style, styles);
      return el;
    };

    // ── BASE LAYER: ΦΕΓΓΑΡΙ (όλες οι νύχτες) ──
    if (isNight && moonPhase && moonPhase !== 'new_moon') {
      // Opacity ανάλογα με συνθήκη — πίσω από σύννεφα/ομίχλη/χιόνι
      const moonOpacity = {
        'clear-night': 1, 'sunny': 1,
        'partlycloudy': 0.6,
        'cloudy': 0.2,
        'fog': 0.15,
        'rainy': 0.25, 'pouring': 0.15,
        'lightning': 0.2, 'lightning-rainy': 0.15,
        'snowy': 0.3, 'snowy-rainy': 0.2, 'hail': 0.2,
        'windy': 0.7, 'windy-variant': 0.7,
      }[condition] ?? 0.5;

      // Blur ανάλογα με συνθήκη
      const moonBlur = {
        'clear-night': 0, 'sunny': 0,
        'partlycloudy': 2,
        'cloudy': 6,
        'fog': 10,
        'rainy': 4, 'pouring': 6,
        'snowy': 3,
      }[condition] ?? 0;

      const moonGroup = document.createElement('div');
      moonGroup.className = 'moon-group';
      moonGroup.style.opacity = moonOpacity;
      moonGroup.style.filter = moonBlur > 0 ? `blur(${moonBlur}px)` : '';
      const moonHaze = document.createElement('div'); moonHaze.className = 'moon-haze';
      const moonBody = document.createElement('div'); moonBody.className = 'moon-body';
      moonBody.innerHTML = getMoonSVGLarge(moonPhase);
      moonGroup.appendChild(moonHaze);
      moonGroup.appendChild(moonBody);
      box.appendChild(moonGroup);
    }

    // ── BASE LAYER: ΗΛΙΟΣ (όλες οι μέρες) ──
    if (!isNight) {
      // elevation: -5 έως 90° → προσαρμόζουμε χρώμα και ένταση
      const clampedEl = Math.max(-5, Math.min(90, elevation));

      // Opacity του ήλιου ανάλογα με συνθήκη
      const sunOpacity = {
        'sunny': 1,
        'partlycloudy': 0.65,
        'cloudy': 0.18,
        'fog': 0.12,
        'rainy': 0.2, 'pouring': 0.12,
        'lightning': 0.15, 'lightning-rainy': 0.12,
        'snowy': 0.25, 'snowy-rainy': 0.15, 'hail': 0.2,
        'windy': 0.8, 'windy-variant': 0.75,
      }[condition] ?? 0.5;

      const sunBlur = {
        'sunny': 0, 'partlycloudy': 3,
        'cloudy': 8, 'fog': 12,
        'rainy': 5, 'pouring': 8,
        'snowy': 4,
      }[condition] ?? 0;

      // Χρώμα ανάλογα με elevation:
      // Πολύ χαμηλά (<5°): πορτοκαλί/κόκκινο (ανατολή/δύση)
      // Χαμηλά (5-20°): χρυσό
      // Ψηλά (>20°): λευκό-κίτρινο
      let bodyColor, hazeColor;
      if (clampedEl < 5) {
        bodyColor = `rgba(255,180,60,0.95) 0%, rgba(255,120,40,0.50) 30%, rgba(255,80,20,0.15) 60%, transparent 80%`;
        hazeColor = `rgba(255,140,40,0.22) 0%, rgba(255,100,30,0.08) 40%, transparent 70%`;
      } else if (clampedEl < 20) {
        bodyColor = `rgba(255,235,160,0.92) 0%, rgba(255,210,80,0.50) 30%, rgba(255,190,40,0.15) 60%, transparent 80%`;
        hazeColor = `rgba(255,220,100,0.20) 0%, rgba(255,190,60,0.07) 40%, transparent 70%`;
      } else {
        bodyColor = `rgba(255,252,230,0.92) 0%, rgba(255,245,200,0.55) 28%, rgba(255,230,140,0.18) 55%, transparent 75%`;
        hazeColor = `rgba(255,240,180,0.18) 0%, rgba(255,210,100,0.07) 40%, transparent 70%`;
      }

      // Μέγεθος haze ανάλογα με elevation (πιο χαμηλά = πιο μεγάλο, dramatic)
      const hazeScale = clampedEl < 5 ? 1.6 : clampedEl < 20 ? 1.2 : 1.0;

      const group = document.createElement('div');
      group.className = 'sun-glow-group';
      group.style.opacity = sunOpacity;
      group.style.filter = sunBlur > 0 ? `blur(${sunBlur}px)` : '';

      const haze = document.createElement('div');
      haze.className = 'sun-haze';
      haze.style.background = `radial-gradient(circle, ${hazeColor})`;
      haze.style.transform = `scale(${hazeScale})`;
      haze.style.transformOrigin = 'top right';

      const body = document.createElement('div');
      body.className = 'sun-body';
      body.style.background = `radial-gradient(circle at 50% 50%, ${bodyColor})`;

      const rays = document.createElement('div');
      rays.className = 'sun-rays';

      group.appendChild(haze);
      group.appendChild(body);
      // Rays μόνο αν η ορατότητα είναι καλή
      if (sunOpacity > 0.4) group.appendChild(rays);
      // Lens flares μόνο για sunny/partlycloudy
      if (['sunny', 'partlycloudy', 'windy', 'windy-variant'].includes(condition)) {
        const track = document.createElement('div');
        track.className = 'flare-track';
        track.style.opacity = sunOpacity;
        ['f1','f2','f3','f4','f5'].forEach(cls => {
          const el = document.createElement('div');
          el.className = 'flare ' + cls;
          track.appendChild(el);
        });
        box.appendChild(track);
      }
      box.appendChild(group);
    }

    // ── ΑΣΤΕΡΙΑ — πάντα πρώτα αν είναι νύχτα, πριν από τα weather particles ──
    // Αριθμός αστεριών ανάλογα με συνθήκη (λιγότερα αν κρύβονται από σύννεφα/ομίχλη)
    if (isNight) {
      const starCount = {
        'clear-night': 42, 'sunny': 42,
        'partlycloudy': 18, 'windy': 28, 'windy-variant': 28,
        'cloudy': 4,
        'fog': 0,
        'rainy': 0, 'pouring': 0,
        'lightning': 0, 'lightning-rainy': 0,
        'snowy': 8, 'snowy-rainy': 4, 'hail': 4,
      }[condition] ?? 20;
      for (let i = 0; i < starCount; i++) {
        const s = (1 + Math.random() * 2.4).toFixed(1);
        box.appendChild(make('star', {
          top: (Math.random() * 86) + '%',
          left: (Math.random() * 100) + '%',
          width: s + 'px', height: s + 'px',
          animationDelay: (Math.random() * 4) + 's',
          animationDuration: (1.8 + Math.random() * 2.2) + 's',
        }));
      }
    }

    // ── RAIN + DROPLETS + LIGHTNING ──
    if (['rainy', 'pouring', 'lightning', 'lightning-rainy'].includes(condition)) {
      if (condition.includes('lightning')) {
        const lxLayer = make('lx-layer', {});
        box.appendChild(lxLayer);
        box.appendChild(make('lx-flash', {}));
        const spawnBolt = () => {
          const boltPath = BOLT_PATHS[Math.floor(Math.random() * BOLT_PATHS.length)];
          const leftPos = 10 + Math.random() * 75;
          const bolt = document.createElement('div');
          bolt.className = 'lx-bolt';
          bolt.style.left = leftPos + '%';
          const filterId = 'bg' + Math.random().toString(36).substr(2,5);
          bolt.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%">
            <defs><filter id="${filterId}"><feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            <path d="${boltPath}" fill="none" stroke="rgba(200,210,255,0.9)" stroke-width="2.8"
              filter="url(#${filterId})" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="${boltPath}" fill="none" stroke="#fff" stroke-width="1.4"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
          lxLayer.appendChild(bolt);
          const flash = make('lx-flash-instant', {});
          box.appendChild(flash);
          setTimeout(() => { if (flash.parentNode) flash.remove(); }, 180);
          setTimeout(() => { if (bolt.parentNode) bolt.remove(); }, 350 + Math.random() * 200);
        };
        setTimeout(spawnBolt, 800);
        this._lxInterval = setInterval(spawnBolt, 3000 + Math.random() * 5000);
      }
      const n = condition === 'pouring' ? 55 : (['lightning','lightning-rainy'].includes(condition) ? 40 : 32);
      for (let i = 0; i < n; i++) {
        box.appendChild(make('rain', {
          left: (Math.random() * 100) + '%',
          animationDelay: (Math.random() * 2) + 's',
          animationDuration: (0.7 + Math.random() * 0.8) + 's',
        }));
      }
      const dripCount = condition === 'pouring' ? 10 : 6;
      const slotW = 96 / dripCount; // μοιράζουμε το πλάτος σε ίσα slots
      for (let i = 0; i < dripCount; i++) {
        const left = 2 + i * slotW + Math.random() * (slotW * 0.7); // τυχαία μέσα στο slot
        const top = 5 + Math.random() * 35;
        const delay = Math.random() * 12;
        const dur = 4 + Math.random() * 6;
        const size = condition === 'pouring' ? (4 + Math.random() * 5) : (3 + Math.random() * 3);
        box.appendChild(make('drip', { left: left+'%', top: top+'%', width: size+'px', height: size+'px', animationDelay: delay+'s', animationDuration: dur+'s' }));
        box.appendChild(make('drip-trail', { left: (left+0.1)+'%', top: (top+2)+'%', animationDelay: (delay+0.5)+'s', animationDuration: dur+'s' }));
      }
      return;
    }

    // ── SNOW + SHIMMER ──
    if (['snowy', 'snowy-rainy', 'hail'].includes(condition)) {
      for (let i = 0; i < 28; i++) {
        const s = (4 + Math.random() * 5).toFixed(1);
        box.appendChild(make('flake', {
          left: (Math.random() * 100) + '%',
          width: s + 'px', height: s + 'px',
          animationDelay: (Math.random() * 5) + 's',
          animationDuration: (4 + Math.random() * 4) + 's',
        }));
      }
      box.appendChild(make('snow-shimmer', {}));
      return;
    }

    // ── FOG (mist layers) ──
    if (condition === 'fog') {
      for (let i = 0; i < 3; i++) {
        box.appendChild(make('mist mist' + (i + 1), {}));
      }
      return;
    }

    // ── CLOUDS ──
    if (['cloudy', 'partlycloudy'].includes(condition)) {
      if (condition === 'partlycloudy' && !isNight) {
        box.appendChild(make('pc-sun-glow', {}));
      }
      // Νύχτα: πιο σκούρα, μπλε-γκρι σύννεφα. Μέρα: λευκά
      const ca = isNight ? '180,200,230' : '255,255,255';
      const co = isNight ? 0.75 : 1.0; // opacity multiplier
      const clouds = [
        { cls: 'cloud cloud1', v: '0 0 220 90', s: `<ellipse cx="110" cy="70" rx="100" ry="24" fill="rgba(${ca},${0.28*co})"/><ellipse cx="80" cy="52" rx="56" ry="38" fill="rgba(${ca},${0.30*co})"/><ellipse cx="140" cy="55" rx="48" ry="32" fill="rgba(${ca},${0.28*co})"/><ellipse cx="110" cy="42" rx="38" ry="30" fill="rgba(${ca},${0.32*co})"/><ellipse cx="60" cy="62" rx="30" ry="22" fill="rgba(${ca},${0.22*co})"/>` },
        { cls: 'cloud cloud2', v: '0 0 180 75', s: `<ellipse cx="90" cy="58" rx="78" ry="20" fill="rgba(${ca},${0.24*co})"/><ellipse cx="68" cy="44" rx="46" ry="32" fill="rgba(${ca},${0.26*co})"/><ellipse cx="115" cy="46" rx="40" ry="28" fill="rgba(${ca},${0.24*co})"/><ellipse cx="90" cy="36" rx="30" ry="24" fill="rgba(${ca},${0.28*co})"/>` },
        { cls: 'cloud cloud3', v: '0 0 240 95', s: `<ellipse cx="120" cy="75" rx="110" ry="25" fill="rgba(${ca},${0.18*co})"/><ellipse cx="90" cy="55" rx="55" ry="40" fill="rgba(${ca},${0.20*co})"/><ellipse cx="155" cy="58" rx="50" ry="34" fill="rgba(${ca},${0.18*co})"/><ellipse cx="120" cy="44" rx="42" ry="32" fill="rgba(${ca},${0.22*co})"/><ellipse cx="65" cy="65" rx="35" ry="25" fill="rgba(${ca},${0.15*co})"/><ellipse cx="175" cy="62" rx="30" ry="22" fill="rgba(${ca},${0.14*co})"/>` },
        { cls: 'cloud cloud4', v: '0 0 130 60', s: `<ellipse cx="65" cy="45" rx="55" ry="18" fill="rgba(${ca},${0.20*co})"/><ellipse cx="50" cy="34" rx="34" ry="24" fill="rgba(${ca},${0.22*co})"/><ellipse cx="80" cy="36" rx="28" ry="20" fill="rgba(${ca},${0.18*co})"/>` },
      ];
      clouds.forEach(conf => {
        const c = document.createElement('div');
        c.className = conf.cls;
        c.innerHTML = `<svg viewBox="${conf.v}" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;filter:blur(4px)">${conf.s}</svg>`;
        box.appendChild(c);
      });
      return;
    }

    // ── WIND STREAKS ──
    if (['windy', 'windy-variant'].includes(condition)) {
      for (let i = 0; i < 8; i++) {
        box.appendChild(make('wind-streak', {
          top: (8 + Math.random() * 80) + '%',
          left: '-30%',
          width: (40 + Math.random() * 60) + 'px',
          animationDelay: (Math.random() * 5) + 's',
          animationDuration: (2 + Math.random() * 3) + 's',
          opacity: (0.15 + Math.random() * 0.25).toFixed(2),
        }));
      }
    }
  }

  _subscribeForecast(entityId) {
    if (this._forecastUnsub) { this._forecastUnsub(); this._forecastUnsub = null; }
    if (!this._hass) return;
    this._hass.connection.subscribeMessage(
      msg => { this._forecast = msg.forecast || []; this._renderContent(); },
      { type: 'weather/subscribe_forecast', forecast_type: this._config.forecast_type, entity_id: entityId }
    ).then(u => { this._forecastUnsub = u; }).catch(() => { this._forecast = []; });
  }

  async _render() {
    if (!this._hass || !this._config) return;
    const id = this._config.entity;
    if (this._lastEntity !== id) {
      this._lastEntity = id;
      this._initialized = false;
      this._lastParticleKey = null;
    }
    if (!this._initialized) {
      this._buildShell();
      this._initialized = true;
      this._subscribeForecast(id);
    }
    this._renderContent();
  }

  _buildShell() {
    this.shadowRoot.innerHTML = `
<style>
:host { display:block; font-family:system-ui,-apple-system,sans-serif; width:100% }
.wrapper { position:relative; border-radius:24px; width:100% }

/* ── BACKGROUNDS ── */
.bg { position:absolute; inset:0; border-radius:24px; z-index:0; transition:background 0.8s ease }
.bg-sunny          { background:linear-gradient(180deg,#1a85d6 0%,#47a0e4 25%,#7ec5f0 50%,#b8ddf7 75%,#e4eefc 100%) }
.bg-night          { background:linear-gradient(145deg,#09102b,#192060) }
.bg-partlycloudy   { background:linear-gradient(145deg,#5aaaf5,#b7d8f8) }
.bg-cloudy-night   { background:linear-gradient(145deg,#1a2540,#2e4060) }
.bg-cloudy         { background:linear-gradient(145deg,#5c7ea8,#a8c0d8) }
.bg-fog            { background:linear-gradient(145deg,#7a8fa8,#b0c2d0) }
.bg-fog-night      { background:linear-gradient(145deg,#1a2030,#3a4560) }
.bg-rainy          { background:linear-gradient(145deg,#243445,#435d6f) }
.bg-rainy-night    { background:linear-gradient(145deg,#0f1a24,#1e3040) }
.bg-stormy         { background:linear-gradient(145deg,#121226,#34346e) }
.bg-stormy-night   { background:linear-gradient(145deg,#080812,#1a1a40) }
.bg-snowy          { background:linear-gradient(145deg,#8aacca,#6a92b5) }
.bg-snowy-night    { background:linear-gradient(145deg,#1a2540,#384868) }
.bg-windy          { background:linear-gradient(145deg,#4a7ca8,#8ab4d0) }
.bg-windy-night    { background:linear-gradient(145deg,#1a2a40,#2e4868) }
.bg-default        { background:linear-gradient(145deg,#3a7bd5,#00d2ff) }

/* ── PARTICLE LAYER ── */
#ptcl { position:absolute; inset:0; border-radius:24px; overflow:hidden; pointer-events:none; z-index:1 }

/* ── CONTENT ── */
.ct { position:relative; z-index:2; padding:18px; color:#fff; text-shadow:0 2px 4px rgba(0,0,0,0.35), 0 0 8px rgba(0,0,0,0.2) }

/* ── RAIN ── */
.rain {
  position:absolute; top:-20px; width:1.5px; height:20px;
  background:rgba(255,255,255,0.45); border-radius:2px;
  animation:rfal linear infinite; will-change:transform;
}
@keyframes rfal {
  0%   { transform:translate3d(0,0,0) rotate(10deg) }
  100% { transform:translate3d(-10px,280px,0) rotate(10deg) }
}

/* ── SCREEN DROPLETS ── */
.drip {
  position:absolute; border-radius:50%;
  background:radial-gradient(circle at 35% 35%, rgba(255,255,255,0.45), rgba(255,255,255,0.1));
  box-shadow:0 0 3px rgba(255,255,255,0.15), inset 0 0 2px rgba(255,255,255,0.2);
  animation:dripSlide ease-in infinite; will-change:transform,opacity; z-index:5;
}
.drip-trail {
  position:absolute; width:1.5px; height:0;
  background:linear-gradient(to bottom, rgba(255,255,255,0.18), transparent);
  animation:dripTrailGrow ease-in infinite; will-change:transform,height,opacity; z-index:4;
  transform:translateZ(0);
}
@keyframes dripSlide {
  0%   { transform:translate3d(0,0,0) scale(1); opacity:0 }
  8%   { opacity:1; transform:translate3d(0,0,0) scale(1) }
  15%  { transform:translate3d(0,2px,0) scale(1); opacity:1 }
  100% { transform:translate3d(2px,120px,0) scale(0.5); opacity:0 }
}
@keyframes dripTrailGrow {
  0%   { height:0; opacity:0 }
  8%   { height:0; opacity:0 }
  15%  { height:0; opacity:0.35 }
  100% { height:80px; opacity:0 }
}

/* ── SNOW ── */
.flake {
  position:absolute; top:-10px; border-radius:50%; background:#fff; opacity:0.85;
  animation:sfal linear infinite; will-change:transform;
}
@keyframes sfal {
  0%   { transform:translate3d(0,0,0) }
  100% { transform:translate3d(20px,280px,0) }
}

/* ── SNOW SHIMMER ── */
.snow-shimmer {
  position:absolute; inset:0;
  background:linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.06) 25%, transparent 50%, rgba(255,255,255,0.04) 75%, transparent 100%);
  background-size:200% 200%;
  animation:snowShimmer 6s ease-in-out infinite;
}
@keyframes snowShimmer {
  0%,100% { background-position:0% 0% }
  50%     { background-position:100% 100% }
}

/* ── STARS ── */
.star {
  position:absolute; border-radius:50%; background:#fff;
  animation:twkl ease-in-out infinite; will-change:opacity;
}
@keyframes twkl { 0%,100% { opacity:0.2 } 50% { opacity:1 } }

/* ── MOON ── */
.moon-group { position:absolute; top:8px; right:8px; pointer-events:none; animation:moonDrift 18s ease-in-out infinite; }
@keyframes moonDrift { 0%,100%{transform:translate3d(2px,-1px,0)} 50%{transform:translate3d(-2px,1px,0)} }
.moon-body { position:absolute; top:0; right:0; width:64px; height:64px; animation:moonPulse 8s ease-in-out infinite; }
@keyframes moonPulse { 0%,100%{opacity:0.9;transform:scale(1)} 50%{opacity:1;transform:scale(1.03)} }
.moon-haze { position:absolute; top:-16px; right:-16px; width:96px; height:96px; border-radius:50%;
  background:radial-gradient(circle, rgba(255,252,200,0.14) 0%, rgba(200,220,255,0.06) 45%, transparent 70%);
  filter:blur(12px); animation:moonPulse 8s ease-in-out infinite; }

 */
.sun-glow-group { position:absolute; inset:0; pointer-events:none; animation:sunGroupDrift 16s ease-in-out infinite }
@keyframes sunGroupDrift { 0%,100%{transform:translate3d(3px,-2px,0)} 50%{transform:translate3d(-3px,2px,0)} }

/* Main sun body — flat atmospheric bloom, no 3D sphere */
.sun-body {
  position:absolute; top:-55px; right:-35px; width:150px; height:150px; border-radius:50%;
  background:radial-gradient(circle at 50% 50%,
    rgba(255,252,230,0.92) 0%,
    rgba(255,245,200,0.55) 28%,
    rgba(255,230,140,0.18) 55%,
    transparent 75%);
  filter:blur(2px);
  animation:sunPulse 6s ease-in-out infinite;
}
@keyframes sunPulse { 0%,100%{transform:scale(1);opacity:0.88} 50%{transform:scale(1.06);opacity:1} }

/* Outer warm haze — very soft, wide, almost invisible bloom */
.sun-haze {
  position:absolute; top:-110px; right:-80px; width:300px; height:300px; border-radius:50%;
  background:radial-gradient(circle,
    rgba(255,240,180,0.18) 0%,
    rgba(255,210,100,0.07) 40%,
    transparent 70%);
  filter:blur(18px);
  animation:sunHazeDrift 8s ease-in-out infinite;
}
@keyframes sunHazeDrift { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }

/* Sun rays — anchored at sun center, scaled outward */
.sun-rays {
  position:absolute; top:-55px; right:-35px; width:150px; height:150px;
  background: conic-gradient(from 0deg at 50% 50%,
    transparent 0deg,   rgba(255,240,180,0.10) 8deg,  transparent 16deg,
    transparent 36deg,  rgba(255,235,170,0.09) 44deg, transparent 52deg,
    transparent 72deg,  rgba(255,240,180,0.08) 80deg, transparent 88deg,
    transparent 110deg, rgba(255,235,170,0.09) 118deg,transparent 126deg,
    transparent 150deg, rgba(255,240,180,0.07) 158deg,transparent 166deg,
    transparent 190deg, rgba(255,235,170,0.08) 198deg,transparent 206deg,
    transparent 230deg, rgba(255,240,180,0.07) 238deg,transparent 246deg,
    transparent 275deg, rgba(255,235,170,0.06) 283deg,transparent 291deg,
    transparent 320deg, rgba(255,240,180,0.07) 328deg,transparent 336deg,
    transparent 360deg);
  transform-origin:50% 50%;
  transform:scale(6);
  animation:raysBreath 8s ease-in-out infinite;
  opacity:0.9;
  pointer-events:none;
}
@keyframes raysBreath { 0%,100%{opacity:0.7;transform:scale(6)} 50%{opacity:1;transform:scale(6.3)} }

/* ── PARTLY CLOUDY SUN GLOW ── */
.pc-sun-glow {
  position:absolute; top:-50px; right:-30px; width:180px; height:180px; border-radius:50%;
  background:radial-gradient(circle,
    rgba(255,240,180,0.35) 0%,
    rgba(255,210,100,0.18) 30%,
    rgba(255,190,60,0.06) 55%,
    transparent 75%);
  animation:pcGlow 5s ease-in-out infinite;
}
@keyframes pcGlow { 0%,100%{transform:scale3d(1,1,1);opacity:.7} 50%{transform:scale3d(1.08,1.08,1);opacity:1} }

/* ── LIGHTNING ── */
.lx-layer { position:absolute; inset:0; pointer-events:none; z-index:3 }
.lx-bolt { position:absolute; top:0; width:40px; height:100%; animation:boltFade .35s ease-out forwards; will-change:opacity; z-index:3 }
@keyframes boltFade { 0%{opacity:1} 30%{opacity:.9} 100%{opacity:0} }
.lx-flash { position:absolute; inset:0; background:rgba(200,200,255,0.08); animation:lxf 7s ease-in-out infinite; will-change:opacity }
.lx-flash-instant { position:absolute; inset:0; background:rgba(220,220,255,0.25); animation:lxfI .18s ease-out forwards; will-change:opacity; z-index:2 }
@keyframes lxf { 0%,88%,100%{opacity:0} 90%,94%{opacity:1} 92%,96%{opacity:0} }
@keyframes lxfI { 0%{opacity:1} 100%{opacity:0} }

/* ── FOG MIST ── */
.mist {
  position:absolute; left:-20%; width:140%; height:40%;
  background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent 100%);
  filter:blur(12px); will-change:transform;
}
.mist1 { top:15%; animation:mD1 14s ease-in-out infinite }
.mist2 { top:40%; animation:mD2 18s ease-in-out infinite; opacity:.7 }
.mist3 { top:65%; animation:mD3 22s ease-in-out infinite; opacity:.5 }
@keyframes mD1 { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(30px,5px,0)} }
@keyframes mD2 { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(-25px,-8px,0)} }
@keyframes mD3 { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(20px,10px,0)} }

/* ── WIND STREAKS ── */
.wind-streak {
  position:absolute; height:1.5px;
  background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.6) 60%, transparent 100%);
  border-radius:2px; animation:windSw linear infinite; will-change:transform;
}
@keyframes windSw { 0%{transform:translate3d(0,0,0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translate3d(500px,0,0);opacity:0} }

/* ── CLOUDS (organic, layered) ── */
.cloud { position:absolute; pointer-events:none; will-change:transform; animation:cloudMove linear infinite; filter:blur(3px) }
.cloud1 { top:6%;  width:180px; left:-190px; animation-duration:80s; animation-delay:0s; opacity:0.9 }
.cloud2 { top:35%; width:140px; left:-150px; animation-duration:65s; animation-delay:-18s; opacity:0.75 }
.cloud3 { top:58%; width:200px; left:-210px; animation-duration:95s; animation-delay:-35s; opacity:0.6 }
.cloud4 { top:20%; width:100px; left:-110px; animation-duration:70s; animation-delay:-8s; opacity:0.5 }
@keyframes cloudMove { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(calc(100vw + 300px),0,0)} }

/* ── LAYOUT ── */
.card { position:relative; border-radius:24px; min-height:170px; cursor:pointer; isolation:isolate; width:100% }
.hd   { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px }
.loc  { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; opacity:.85 }
.cnd  { font-size:11px; opacity:.7; text-transform:capitalize }
.tmp  { font-size:62px; font-weight:200; letter-spacing:-2px; line-height:1; margin-bottom:2px }
.hl   { font-size:13px; opacity:.75; font-weight:500; margin-bottom:2px }
.high { color:#ff9f7c }
.low  { color:#7cb9ff }
.cn2  { font-size:18px; font-weight:500; opacity:.9; text-transform:capitalize; margin-bottom:12px }
.det  { display:flex; gap:12px; padding:10px 12px; background:rgba(0,20,60,0.22); backdrop-filter:blur(25px) saturate(200%) brightness(0.9); -webkit-backdrop-filter:blur(25px) saturate(200%) brightness(0.9); border-radius:14px; margin-bottom:12px; flex-wrap:wrap; border:1px solid rgba(255,255,255,0.18); box-shadow:0 2px 8px rgba(0,0,0,0.10) }
.di   { display:flex; align-items:center; gap:5px; font-size:12px; opacity:.9 }
.dic  { width:16px; height:16px; flex-shrink:0 }
.fc   { display:flex; gap:0; overflow-x:auto; background:rgba(0,20,60,0.22); backdrop-filter:blur(25px) saturate(200%) brightness(0.9); -webkit-backdrop-filter:blur(25px) saturate(200%) brightness(0.9); border-radius:16px; border:1px solid rgba(255,255,255,0.18); box-shadow:0 2px 8px rgba(0,0,0,0.10) }
.fc::-webkit-scrollbar { display:none }
.fi   { flex:1; min-width:52px; display:flex; flex-direction:column; align-items:center; padding:10px 6px }
.fd  { font-size:13px; font-weight:700; opacity:.85; margin-bottom:5px; letter-spacing:.04em; text-transform:uppercase }
.fic { width:30px; height:30px; opacity:.85; color:white }
.fh  { font-size:14px; font-weight:600; margin-top:4px; color:white }
.fl  { font-size:12px; font-weight:400; opacity:.5; margin-top:2px }
</style>

<div class="wrapper">
  <div class="card" id="card" role="button" tabindex="0" aria-label="Weather card, click for more details">
    <div class="bg" id="bg"></div>
    <div id="ptcl"></div>
    <div class="ct" id="ct"></div>
  </div>
</div>`;
    this.shadowRoot.getElementById('card').addEventListener('click', () => {
      const entity = this._config && this._config.entity;
      if (!entity) return;
      const event = new Event('hass-more-info', { bubbles: true, composed: true });
      event.detail = { entityId: entity };
      this.dispatchEvent(event);
    });
  }

  _t(v) {
    if (v === undefined || v === null) return '--';
    if (this._config?.temperature_unit === 'F' && typeof v === 'number') {
      v = Math.round(v * 9/5 + 32);
    }
    return Math.round(v);
  }

  _day(str) {
    if (!str) return '--';
    const d = new Date(str);
    return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  }

  _renderContent() {
    if (!this._hass || !this._config) return;
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj) return;

    const cond    = stateObj.state;
    const attrs   = stateObj.attributes;
    const isNight = this._isNight();
    const bgCls   = this._bgClass(cond, isNight);
    const moonPhase = this._moonPhase();
    const forecast = this._forecast.length ? this._forecast : (attrs.forecast || []);
    const items   = forecast.slice(0, this._config.max_items);

    const bgEl = this.shadowRoot.getElementById('bg');
    if (bgEl) bgEl.className = 'bg ' + bgCls;

    const ct = this.shadowRoot.getElementById('ct');
    if (ct) {
      ct.innerHTML = `
        <div class="hd">
          <div class="loc">${this._config.name || attrs.friendly_name || ''}</div>
        </div>
        <div class="tmp">${this._t(attrs.temperature)}°</div>
        <div class="hl"><span class="high">↑${this._t(items[0]?.temperature ?? attrs.temperature)}°</span>  <span class="low">↓${this._t(items[0]?.templow ?? attrs.temperature)}°</span></div>
        <div class="cn2">${COND_LABELS[cond] || cond.replace(/-/g,' ')}</div>
        ${this._config.show_details ? `
        <div class="det">
          <div class="di"><div class="dic">${MDI.humidity}</div>${this._t(attrs.humidity)}%</div>
          <div class="di"><div class="dic">${MDI.wind}</div>${this._windSpeed(attrs)}</div>
          <div class="di"><div class="dic">${MDI.pressure}</div>${this._t(attrs.pressure)} hPa</div>
          ${(attrs.feels_like !== undefined || attrs.apparent_temperature !== undefined) ? `<div class="di"><div class="dic">${MDI.thermometer}</div>Feels ${this._t(attrs.feels_like ?? attrs.apparent_temperature)}°</div>` : ''}
        </div>` : ''}
        ${this._config.show_forecast && items.length ? `
        <div class="fc">
          ${items.map(f => `
            <div class="fi">
              <div class="fd">${this._day(f.datetime)}</div>
              <div class="fic">${this.getCachedIcon(f.condition, isNight, moonPhase)}</div>
              <div class="fh">${this._t(f.temperature)}°</div>
              ${f.templow !== undefined ? `<div class="fl">${this._t(f.templow)}°</div>` : ''}
            </div>`).join('')}
        </div>` : ''}
      `;
    }
    this._injectParticles(cond, isNight, moonPhase);
  }
}

customElements.define('nimbus-weather-card', NimbusWeatherCard);

// ── CONFIG EDITOR ──────────────────────────────────────────────────────────────
class NimbusWeatherCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) this._render();
  }

  _fire(config) {
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
  }

  _val(key, def) {
    return this._config[key] !== undefined ? this._config[key] : def;
  }

  _weatherEntities() {
    if (!this._hass) return [];
    return Object.keys(this._hass.states).filter(e => e.startsWith('weather.')).sort();
  }

  _sensorEntities() {
    if (!this._hass) return [];
    return Object.keys(this._hass.states).filter(e => e.startsWith('sensor.')).sort();
  }

  _sunEntities() {
    if (!this._hass) return [];
    return Object.keys(this._hass.states).filter(e => e.startsWith('sun.')).sort();
  }

  _render() {
    this._rendered = true;
    const c = this._config;
    const weatherEntities = this._weatherEntities();
    const sensorEntities = this._sensorEntities();
    const sunEntities = this._sunEntities();

    this.shadowRoot.innerHTML = `
<style>
  :host { display:block; font-family:var(--primary-font-family,system-ui); }
  .section { margin-bottom:16px; }
  .section-title { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:var(--secondary-text-color); margin-bottom:8px; }
  .row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--divider-color,#eee); }
  .row:last-child { border-bottom:none; }
  .label { font-size:14px; color:var(--primary-text-color); }
  .sublabel { font-size:12px; color:var(--secondary-text-color); margin-top:2px; }
  select, input[type="text"] {
    background:var(--card-background-color,#fff);
    color:var(--primary-text-color);
    border:1px solid var(--divider-color,#ccc);
    border-radius:4px;
    padding:6px 8px;
    font-size:13px;
    min-width:180px;
  }
  .toggle { position:relative; width:40px; height:22px; flex-shrink:0; }
  .toggle input { opacity:0; width:0; height:0; }
  .slider-track {
    position:absolute; inset:0; background:var(--disabled-color,#ccc);
    border-radius:11px; cursor:pointer; transition:background .2s;
  }
  .toggle input:checked + .slider-track { background:var(--primary-color,#03a9f4); }
  .slider-thumb {
    position:absolute; width:18px; height:18px; left:2px; top:2px;
    background:#fff; border-radius:50%; transition:transform .2s; pointer-events:none;
  }
  .toggle input:checked ~ .slider-thumb { transform:translateX(18px); }
  .speed-row { display:flex; align-items:center; gap:12px; }
  .speed-row input[type=range] { flex:1; accent-color:var(--primary-color,#03a9f4); }
  .speed-val { font-size:13px; min-width:24px; text-align:right; color:var(--secondary-text-color); }
</style>

<!-- REQUIRED -->
<div class="section">
  <div class="section-title">Required</div>
  <div class="row">
    <div><div class="label">Weather Entity</div></div>
    <select id="entity">
      ${weatherEntities.map(e => `<option value="${e}" ${c.entity===e?'selected':''}>${e}</option>`).join('')}
    </select>
  </div>
</div>

<!-- DISPLAY -->
<div class="section">
  <div class="section-title">Display</div>
  <div class="row">
    <div><div class="label">Name</div><div class="sublabel">Leave empty for entity friendly name</div></div>
    <input type="text" id="name" value="${c.name||''}" placeholder="e.g. Athens">
  </div>
  <div class="row">
    <div><div class="label">Temperature Unit</div></div>
    <select id="temperature_unit">
      <option value="C" ${this._val('temperature_unit','C')==='C'?'selected':''}>°C</option>
      <option value="F" ${this._val('temperature_unit','C')==='F'?'selected':''}>°F</option>
    </select>
  </div>
  <div class="row">
    <div><div class="label">24h Time Format</div><div class="sublabel">Used in hourly forecast</div></div>
    ${this._toggle('use_24h', this._val('use_24h', true))}
  </div>
</div>

<!-- FORECAST -->
<div class="section">
  <div class="section-title">Forecast</div>
  <div class="row">
    <div><div class="label">Forecast Type</div></div>
    <select id="forecast_type">
      <option value="daily" ${this._val('forecast_type','daily')==='daily'?'selected':''}>Daily</option>
      <option value="hourly" ${this._val('forecast_type','daily')==='hourly'?'selected':''}>Hourly</option>
    </select>
  </div>
  <div class="row">
    <div><div class="label">Max Items</div></div>
    <select id="max_items">
      ${[1,2,3,4,5,6,7].map(n=>`<option value="${n}" ${this._val('max_items',5)==n?'selected':''}>${n}</option>`).join('')}
    </select>
  </div>
  <div class="row">
    <div><div class="label">Show Forecast Strip</div></div>
    ${this._toggle('show_forecast', this._val('show_forecast', true))}
  </div>
  <div class="row">
    <div><div class="label">Show Details</div><div class="sublabel">Humidity, wind, pressure</div></div>
    ${this._toggle('show_details', this._val('show_details', true))}
  </div>
  <div class="row">
    <div><div class="label">Show Feels Like</div></div>
    ${this._toggle('show_feels_like', this._val('show_feels_like', true))}
  </div>
</div>

<!-- ENTITIES -->
<div class="section">
  <div class="section-title">Optional Entities</div>
  <div class="row">
    <div><div class="label">Moon Entity</div><div class="sublabel">For realistic moon phases</div></div>
    <select id="moon_entity">
      <option value="">— None —</option>
      ${sensorEntities.map(e=>`<option value="${e}" ${c.moon_entity===e?'selected':''}>${e}</option>`).join('')}
    </select>
  </div>
  <div class="row">
    <div><div class="label">Sun Entity</div><div class="sublabel">For accurate day/night</div></div>
    <select id="sun_entity">
      <option value="">— None —</option>
      ${sunEntities.map(e=>`<option value="${e}" ${c.sun_entity===e?'selected':''}>${e}</option>`).join('')}
    </select>
  </div>
</div>

<!-- PERFORMANCE -->
<div class="section">
  <div class="section-title">Performance</div>
  <div class="row">
    <div><div class="label">Animation Speed</div><div class="sublabel">0 = off, 1 = normal, 2 = fast</div></div>
    <div class="speed-row">
      <input type="range" id="animation_speed" min="0" max="2" step="0.5" value="${this._val('animation_speed',1)}">
      <span class="speed-val" id="speed-val">${this._val('animation_speed',1)}</span>
    </div>
  </div>
</div>`;

    this._attach();
  }

  _toggle(id, checked) {
    return `<label class="toggle">
      <input type="checkbox" id="${id}" ${checked?'checked':''}>
      <div class="slider-track"></div>
      <div class="slider-thumb"></div>
    </label>`;
  }

  _attach() {
    const sr = this.shadowRoot;
    const upd = () => {
      const cfg = {
        entity: sr.getElementById('entity')?.value || this._config.entity,
        forecast_type: sr.getElementById('forecast_type')?.value || 'daily',
        max_items: parseInt(sr.getElementById('max_items')?.value) || 5,
        show_forecast: sr.getElementById('show_forecast')?.checked ?? true,
        show_details: sr.getElementById('show_details')?.checked ?? true,
        show_feels_like: sr.getElementById('show_feels_like')?.checked ?? true,
        temperature_unit: sr.getElementById('temperature_unit')?.value || 'C',
        use_24h: sr.getElementById('use_24h')?.checked ?? true,
        animation_speed: parseFloat(sr.getElementById('animation_speed')?.value ?? 1),
      };
      const name = sr.getElementById('name')?.value?.trim();
      if (name) cfg.name = name;
      const moon = sr.getElementById('moon_entity')?.value;
      if (moon) cfg.moon_entity = moon;
      const sun = sr.getElementById('sun_entity')?.value;
      if (sun) cfg.sun_entity = sun;
      this._config = cfg;
      this._fire(cfg);
    };

    sr.querySelectorAll('select, input[type="text"], input[type="checkbox"]').forEach(el => {
      el.addEventListener('change', upd);
    });
    const spd = sr.getElementById('animation_speed');
    const spdVal = sr.getElementById('speed-val');
    if (spd && spdVal) {
      spd.addEventListener('input', () => { spdVal.textContent = spd.value; upd(); });
    }
  }
}

customElements.define('nimbus-weather-card-editor', NimbusWeatherCardEditor);

// Inject getStubConfig and getConfigElement into NimbusWeatherCard
Object.assign(NimbusWeatherCard, {
  getStubConfig: () => ({ entity: 'weather.home' }),
});
NimbusWeatherCard.getConfigElement = () => document.createElement('nimbus-weather-card-editor');
NimbusWeatherCard.getStubConfig = () => ({ entity: 'weather.home' });