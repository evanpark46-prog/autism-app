/* ==========================================================================
   Safety Superheroes — animal superhero mascots (one per lesson)
   Each lesson's hero is drawn as a masked, caped animal: same house style
   for all 31 (round head, hero mask, cape + suit in the lesson's theme
   color, the hero's emblem on the chest), with per-animal ears, face,
   colors and markings. Pure inline SVG -- crisp at any size, no image files.
   Used by js/heroes.js (lesson logos + hero portraits) and the lesson
   loading screen in js/page-topic.js.
   ========================================================================== */

// Per-hero look. fur: main color · face: muzzle / face-patch color ·
// ears / snout: shape styles · iris: eye color · trim: the costume's second
// color (cape lining, cuffs, collar, chest trim) · gear: lesson gear, drawn
// by ahGearSvg() (see the list there) · mask: 'goggles' / 'visor' /
// 'natural' replace the usual hero domino mask.
const ANIMAL_HEROES = {
  'stranger-safety':       { animal: 'owl',       fur: '#9c6b45', face: '#f3dcc0', ears: 'tufts',  snout: 'beak',   beak: '#f2a93b', iris: '#f0a020', trim: '#ffcf3f', gear: ['highcollar', 'epaulets'] },
  'street-safety':         { animal: 'zebra',     fur: '#f7f7f7', face: '#4a4a4a', ears: 'pointy', snout: 'muzzle', markColor: '#2b2b2b', earInner: '#d9d9d9', iris: '#7a5232', trim: '#ff9a3c', gear: ['mohawk', 'reflect'] },
  'lost-safety':           { animal: 'puppy',     fur: '#d9a066', face: '#f6e1c5', ears: 'floppy', snout: 'muzzle', earColor: '#8a5a34', iris: '#8a5a2b', trim: '#ff6b5a', gear: ['tagcollar'] },
  'emergency-safety':      { animal: 'monkey',    fur: '#8b5a3c', face: '#f0c9a0', ears: 'side',   snout: 'muzzle', iris: '#7a4a26', trim: '#ffd23f', gear: ['siren'] },
  'fire-safety':           { animal: 'dalmatian', fur: '#ffffff', face: '#ffffff', ears: 'floppy', snout: 'muzzle', markColor: '#2b2b2b', earColor: '#2b2b2b', iris: '#3f7fcf', trim: '#ffd23f', gear: ['firehelmet'] },
  'earthquake-safety':     { animal: 'turtle',    fur: '#7cc47f', face: '#b5e2b3', ears: 'none',   snout: 'nose',   markColor: '#4f9a52', iris: '#5a3a20', trim: '#ffb52e', gear: ['hardhat', 'shell'] },
  'rainyweather-safety':   { animal: 'duck',      fur: '#ffd84d', face: '#ffe88a', ears: 'none',   snout: 'bill',   beak: '#f28c28', iris: '#3a6fb0', trim: '#3a8fd6', gear: ['souwester'] },
  'selfadvocacy-safety':   { animal: 'lion',      fur: '#f0b14a', face: '#f8d58c', ears: 'round',  snout: 'muzzle', markColor: '#c9772a', iris: '#c9801a', trim: '#e2574c', gear: ['mane', 'headmic'] },
  'body-boundaries-safety':{ animal: 'hedgehog',  fur: '#a57a52', face: '#f1d7b5', ears: 'small',  snout: 'nose',   markColor: '#6d4a2c', iris: '#8a5a2b', trim: '#ff8fc0', gear: ['aura', 'spikes'] },
  'secrets-safety':        { animal: 'parrot',    fur: '#3dbb63', face: '#b4ecc2', ears: 'none',   snout: 'hook',   beak: '#ffb43b', markColor: '#e5484d', iris: '#e8a317', trim: '#ffb43b', gear: ['crest', 'keybuckle'] },
  'reporting-safety':      { animal: 'meerkat',   fur: '#c9a06e', face: '#ecd3ad', ears: 'low',  snout: 'muzzle', markColor: '#7a5a3a', iris: '#6b4a2a', trim: '#4fc4a8', gear: ['rangerhat'] },
  'awareness-safety':      { animal: 'cat',       fur: '#9aa3ad', face: '#e8ecf0', ears: 'pointy', snout: 'nose',   markColor: '#5b636b', earInner: '#f7b6c8', iris: '#62b83a', trim: '#5ad1e6', gear: ['radarear', 'whiskers'] },
  'plan-safety':           { animal: 'beaver',    fur: '#8f5e3b', face: '#d8b08a', ears: 'small',  snout: 'teeth',  iris: '#6b4a2a', trim: '#ffd23f', gear: ['headband', 'pencil'] },
  'privacy-safety':        { animal: 'raccoon',   fur: '#8d949b', face: '#e6e9ec', ears: 'pointy', snout: 'nose',   markColor: '#3d4247', earInner: '#3d4247', iris: '#4a7fc0', trim: '#c3b0f0', mask: 'natural', gear: ['hood'] },
  'bullying-safety':       { animal: 'bear',      fur: '#a0683f', face: '#e2bb92', ears: 'round',  snout: 'muzzle', iris: '#7a4a26', trim: '#e5484d', gear: ['pauldrons'] },
  'online-safety':         { animal: 'penguin',   fur: '#2f3542', face: '#ffffff', ears: 'none',   snout: 'beak',   beak: '#f7a531', iris: '#3a7bd5', trim: '#45d8d0', mask: 'visor', gear: ['earpiece'] },
  'cyberbullying-safety':  { animal: 'koala',     fur: '#a9b2bc', face: '#dfe4ea', ears: 'fluffy', snout: 'bignose', iris: '#6a5a9a', trim: '#9b7bff', gear: ['techband'] },
  'citizenship-safety':    { animal: 'bunny',     fur: '#f4f1ee', face: '#ffffff', ears: 'long',   snout: 'nose',   earInner: '#f7b6c8', iris: '#5b8fd0', trim: '#ff8fb1', gear: ['sash'] },
  'rights-safety':         { animal: 'tiger',     fur: '#f3923a', face: '#fff1df', ears: 'round',  snout: 'muzzle', markColor: '#2b2b2b', iris: '#d9901a', trim: '#2f8fd6', gear: ['ribbonband'] },
  'water-safety':          { animal: 'otter',     fur: '#8a5c3a', face: '#e2c29e', ears: 'small',  snout: 'muzzle', markColor: '#5a3b24', iris: '#6b4a2a', trim: '#ff9a3c', mask: 'goggles', gear: ['lifevest', 'whiskers'] },
  'home-safety':           { animal: 'mouse',     fur: '#b8bec6', face: '#e9ecef', ears: 'mouse',  snout: 'nose',   earInner: '#f7b6c8', iris: '#3a6fb0', trim: '#ffd23f', gear: ['headlamp', 'whiskers'] },
  'bike-safety':           { animal: 'fox',       fur: '#f07c2c', face: '#ffffff', ears: 'pointy', snout: 'muzzle', earInner: '#2b2b2b', iris: '#d98a1e', trim: '#4fc3f7', gear: ['bikehelmet'] },
  'peer-pressure-safety':  { animal: 'panda',     fur: '#ffffff', face: '#ffffff', ears: 'round',  snout: 'nose',   markColor: '#2b2b2b', earColor: '#2b2b2b', iris: '#6b4a2a', trim: '#e5484d', mask: 'natural', gear: ['sweatband', 'champbelt'] },
  'elopement-safety':      { animal: 'sheep',     fur: '#ecd5bb', face: '#fff3e4', ears: 'side',   snout: 'nose',   markColor: '#ffffff', iris: '#6b8f3a', trim: '#2f6fb5', gear: ['wool', 'sailorcap', 'neckerchief'] },
  'safehelper-safety':     { animal: 'hawk',      fur: '#8a5a33', face: '#ffffff', ears: 'none',   snout: 'hook',   beak: '#f2b13b', markColor: '#5a3a20', iris: '#e8a317', trim: '#ffd23f', gear: ['hawkcrest', 'aviators'] },
  'medical-safety':        { animal: 'piglet',    fur: '#f7b2c4', face: '#ffd0dc', ears: 'pointy', snout: 'pig',    earInner: '#ef8fab', iris: '#4a7fc0', trim: '#58c7e8', gear: ['stethoscope'] },
  'selfregulation-safety': { animal: 'sloth',     fur: '#a68a6d', face: '#e9d8c3', ears: 'none',   snout: 'nose',   markColor: '#6b543e', iris: '#6b4a2a', trim: '#7fd1b9', mask: 'natural', gear: ['headphones'] },
  'firstaid-safety':       { animal: 'frog',      fur: '#6ccb5f', face: '#c4f0b8', ears: 'frog',   snout: 'smile',  iris: '#d9901a', trim: '#ffffff', gear: ['medband'] },
  'seizure-safety':        { animal: 'elephant',  fur: '#9fa9b8', face: '#c3cbd6', ears: 'elephant', snout: 'trunk', iris: '#5a7fb0', trim: '#6fb8ff', gear: ['watch'] },
  'money-safety':          { animal: 'squirrel',  fur: '#c0703a', face: '#f2d2b0', ears: 'tufted', snout: 'nose',   iris: '#6b4a2a', trim: '#3dbb63', gear: ['tail', 'coinbuckle'] },
  'dating-safety':         { animal: 'deer',      fur: '#b47a46', face: '#f2dcc0', ears: 'deer',   snout: 'nose',   markColor: '#7a5230', earInner: '#f2dcc0', iris: '#6b4a2a', trim: '#ff9ecb', gear: ['antlers', 'scarf'] },
};

const ANIMAL_NAMES = {
  en: { owl: 'owl', zebra: 'zebra', puppy: 'puppy', monkey: 'monkey', dalmatian: 'dalmatian', turtle: 'turtle', duck: 'duck', lion: 'lion', hedgehog: 'hedgehog', parrot: 'parrot', meerkat: 'meerkat', cat: 'cat', beaver: 'beaver', raccoon: 'raccoon', bear: 'bear', penguin: 'penguin', koala: 'koala', bunny: 'bunny', tiger: 'tiger', otter: 'otter', mouse: 'mouse', fox: 'fox', panda: 'panda', sheep: 'sheep', hawk: 'hawk', piglet: 'piglet', sloth: 'sloth', frog: 'frog', elephant: 'elephant', squirrel: 'squirrel', deer: 'deer' },
  es: { owl: 'búho', zebra: 'cebra', puppy: 'perrito', monkey: 'mono', dalmatian: 'dálmata', turtle: 'tortuga', duck: 'pato', lion: 'león', hedgehog: 'erizo', parrot: 'loro', meerkat: 'suricata', cat: 'gato', beaver: 'castor', raccoon: 'mapache', bear: 'oso', penguin: 'pingüino', koala: 'koala', bunny: 'conejito', tiger: 'tigre', otter: 'nutria', mouse: 'ratón', fox: 'zorro', panda: 'panda', sheep: 'oveja', hawk: 'halcón', piglet: 'cerdito', sloth: 'perezoso', frog: 'rana', elephant: 'elefante', squirrel: 'ardilla', deer: 'ciervo' },
};

/* ---- House style ----------------------------------------------------------
   One ink color and one outline weight (2.4 on big shapes, 1.6 on details)
   for all 31 heroes. Cel shading = the flat color, one cool shadow shape
   (AH_SHADE at ~20% alpha, so it works on any fur or theme color) and a
   white rim light on the upper left. Head is drawn in a 100-unit box
   centred on (50,41); the bust puts it on top of a compact chest. */
const INK = '#2b2b2b';
const AH_SHADE = '#2a1650';
const AH_GOLD_DARK = '#b07800';
const AH_BELT = '#3a3f58';

const ahSt = (w) => `stroke="${INK}" stroke-width="${w || 2.4}" stroke-linejoin="round" stroke-linecap="round"`;
const ahSym = (svg) => svg + `<g transform="matrix(-1 0 0 1 100 0)">${svg}</g>`;
const ahCircleD = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
// Several shapes with ONE shared outline: an ink pass at double width, then
// the fills on top, so overlaps merge cleanly (head + cheek fur + tufts).
const ahUnion = (shapes, fill, w) => `<g fill="${INK}" stroke="${INK}" stroke-width="${(w || 2.4) * 2}" stroke-linejoin="round">${shapes}</g><g fill="${fill}">${shapes}</g>`;
// Cel shadow: everything inside the clip that falls outside a circle offset
// toward the light (upper left) gets one flat shadow tone.
const ahCel = (clipId, cx, cy, r, op) => `<g clip-path="url(#${clipId})"><path fill-rule="evenodd" d="M-40 -40H140V140H-40Z ${ahCircleD(cx, cy, r)}" fill="${AH_SHADE}" opacity="${op || 0.2}"/></g>`;
const ahShine = (cx, cy, rx, ry, rot, op) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op || 0.55}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
const ahHas = (a, g) => !!(a.gear && a.gear.indexOf(g) !== -1);

// Every hero SVG gets its own ids (gradients, clips) and its own animation
// timing, so a page full of heroes never blinks in sync.
let ahUid = 0;
function ahTiming(topicId){
  ahUid += 1;
  const h = (typeof hashStr === 'function' ? hashStr(topicId + ahUid) : ahUid * 7919) % 1000;
  return { uid: 'ah' + ahUid, d1: -(h % 50) / 10, d2: -((h * 7) % 90) / 10 };
}

// Shared defs: a soft 3D "ball" shade, a left-lit suit shade, polished gold,
// and (for framed portraits) the backdrop glow in the lesson color.
function ahDefs(uid, accent){
  return `<defs>`
    + `<radialGradient id="${uid}b" cx="38%" cy="30%" r="72%"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></radialGradient>`
    + `<linearGradient id="${uid}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>`
    + `<radialGradient id="${uid}g" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff8c2"/><stop offset=".55" stop-color="#ffd23f"/><stop offset="1" stop-color="#e0a100"/></radialGradient>`
    + `<linearGradient id="${uid}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#d7dde6"/><stop offset="1" stop-color="#9aa6b6"/></linearGradient>`
    + (accent ? `<radialGradient id="${uid}bd" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff" stop-opacity=".92"/><stop offset="1" style="stop-color:${accent}" stop-opacity=".55"/></radialGradient>` : '')
    + `</defs>`;
}

// A chunky limb: dark outline, colored tube, and a light streak on top so it
// reads as round instead of a stick.
function ahLimb(x1, y1, x2, y2, w, color){
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="${w + 4.6}" stroke-linecap="round"/>`
    + `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
    + `<line x1="${x1 + (x2 - x1) * 0.1}" y1="${y1 + (y2 - y1) * 0.1 - w * 0.22}" x2="${x1 + (x2 - x1) * 0.75}" y2="${y2 - (y2 - y1) * 0.25 - w * 0.22}" stroke="rgba(255,255,255,.38)" stroke-width="${Math.max(1.6, w * 0.22)}" stroke-linecap="round"/>`;
}

/* ---- Head --------------------------------------------------------------- */
const AH_HEAD_D = 'M50 15 C66.5 15 78.5 26.5 78.5 42 C78.5 56.5 66 66.5 50 66.5 C34 66.5 21.5 56.5 21.5 42 C21.5 26.5 33.5 15 50 15 Z';
const AH_CHEEKS = ahSym('<path d="M23.5 45 L17 48.8 L22.6 51.6 L18.4 55.6 L26.5 57.6 Z"/>');
const AH_TOPTUFT = '<path d="M42 17.5 C43 10.5 47.5 7.6 52 8.6 C50 10.6 49.8 12.8 50.8 15 C52.8 11 56.8 9.8 60 11.5 C57.2 12.8 56.4 15 57 17.8 Z"/>';
const AH_BIRDS = { owl: 1, parrot: 1, penguin: 1, hawk: 1, duck: 1 };
const AH_HATS = { firehelmet: 1, hardhat: 1, souwester: 1, rangerhat: 1, siren: 1, bikehelmet: 1, hood: 1, sailorcap: 1 };

// The union of shapes that makes the head silhouette (also used as its clip).
function ahHeadShapes(a){
  if (a.animal === 'frog') return `<ellipse cx="50" cy="45" rx="31" ry="21.5"/><circle cx="35" cy="25.5" r="11.5"/><circle cx="65" cy="25.5" r="11.5"/>`;
  const hat = a.gear && a.gear.some(g => AH_HATS[g]);
  const cheeks = (a.animal === 'hawk' || !AH_BIRDS[a.animal]) && a.animal !== 'turtle' && a.animal !== 'elephant' && a.animal !== 'piglet';
  const tuft = !hat && !AH_BIRDS[a.animal] && ['turtle', 'elephant', 'lion', 'sheep', 'hedgehog', 'zebra', 'deer', 'bunny'].indexOf(a.animal) === -1;
  return `<path d="${AH_HEAD_D}"/>` + (cheeks ? AH_CHEEKS : '') + (tuft ? AH_TOPTUFT : '');
}

function ahEarsSvg(a, uid){
  const c = a.earColor || a.fur;
  const inner = a.earInner || a.face;
  const st = ahSt(2.4);
  const sh = `fill="${AH_SHADE}" opacity=".18"`;
  switch (a.ears){
    case 'round': return ahSym(`<circle cx="27.5" cy="21" r="9.8" fill="${c}" ${st}/><circle cx="27.8" cy="21.6" r="5.2" fill="${inner}"/><path d="M33 28.5 A9.8 9.8 0 0 1 19 26" stroke="${AH_SHADE}" stroke-opacity=".18" stroke-width="3" fill="none"/>`);
    case 'low': return ahSym(`<path d="M24 30 C16.5 28.6 12.6 33.4 13.6 38.4 C14.6 43 19.4 44.6 24 42.4 Z" fill="${a.markColor}" ${st}/><path d="M22 33.4 C18.8 33.2 17.4 35.6 17.8 37.8 C18.2 39.6 20.2 40.4 22 39.6 Z" fill="#4a3420"/>`);
    case 'small': return ahSym(`<circle cx="26.5" cy="24" r="6.8" fill="${c}" ${st}/><circle cx="26.8" cy="24.4" r="3.4" fill="${inner}"/>`);
    case 'pointy': return ahSym(`<path d="M22.5 33 C20.5 23 21.5 12.5 25.5 5 C32 8.5 39 14.5 43.5 21 Z" fill="${c}" ${st}/><path d="M26 27.5 C25.3 20.5 25.8 14.5 27.6 10.4 C31 13.2 35 16.6 37.8 20.6 Z" fill="${inner}"/><path d="M25.5 5 C24 12 24 20 25 30" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    case 'deer': return ahSym(`<path d="M27 28 C20.5 22.6 14 21.4 10.5 24 C13.6 30 20 33.4 26 33 Z" fill="${c}" ${st}/><path d="M24.5 28.6 C20.4 25.8 16.6 25 14.6 25.8 C16.8 28.8 20.4 30.6 23.8 30.8 Z" fill="${inner}"/>`);
    case 'tufted': return ahSym(`<path d="M23 33 C21 23 22 13 25.5 5.5 C32 9 39 15 43.5 21.5 Z" fill="${c}" ${st}/><path d="M26.4 27.5 C25.8 21 26.2 15.5 27.8 11.5 C31 14 34.6 17.2 37.2 21 Z" fill="${a.face}"/><path d="M25.5 6 C23 2.5 21 1.6 18.6 1.8 M25.5 6 C25.2 2.2 26.6 0.6 28.8 0.2 M25.5 6 C22.8 4.6 20.4 5.2 19 6.4" stroke="${c}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`);
    case 'floppy': return '';
    case 'long': return `<g><path d="M35.5 21 C30.5 13 27.5 4 29.5 1.2 C32 -1.6 38.5 3.5 42 10.5 C43.5 14 44 18 43.5 20.5 Z" fill="${c}" ${st}/><path d="M37.2 17.6 C34 12 32.2 6.6 33 5.2 C34.4 4.2 38 8 39.8 12.4 C40.6 14.6 40.8 16.6 40.5 17.6 Z" fill="${inner}"/>`
      + `<path d="M57 20.5 C57 15 58.5 9.5 61.5 6.6 C64.5 3.8 69 4.6 71.5 7.4 L80 12.4 C82 13.6 81.4 16.4 79 16.4 L71 15.4 C68 16.4 66 19 65 22 Z" fill="${c}" ${st}/><path d="M60.4 18.4 C60.6 14.4 61.6 11 63.6 9.4 C65.6 7.8 68.2 8.6 69.4 10.6 C66.6 12.4 64.2 15.4 63.2 19.2 Z" fill="${inner}"/></g>`;
    case 'mouse': return ahSym(`<circle cx="23.5" cy="21.5" r="13.6" fill="${c}" ${st}/><circle cx="24" cy="22.2" r="8" fill="${inner}"/><path d="M15 15 A12 12 0 0 1 24 9.6" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>`);
    case 'fluffy': return ahSym(`<g transform="translate(3.4 0.6)"><path d="M30 16 C24 11 14 12 10.5 19 C8.5 21.5 7.6 25 9 27.4 C7.6 30 8.6 33.5 11.2 35 C12.4 38.4 16.4 40 19.6 38.8 C23 40.4 27 38.6 28.5 35.5 Z" fill="${c}" ${st}/><path d="M26 22 C22 18.4 16.6 19 14.2 22.6 C12.6 25.4 13.4 29.8 16.4 32.4 C19.6 34.6 24 34 26.4 31.4 Z" fill="#f4f6f8"/></g>`);
    case 'elephant': return ahSym(`<path d="M29 27 C20 18.5 10.5 22 11 34.5 C11.4 45.5 14.6 54.5 20.4 56.4 C25 57.8 28 53 29.4 47 Z" fill="${c}" ${st}/><path d="M26.6 31 C20.6 25.6 15.4 27.8 15.4 35.6 C15.4 43.4 17.8 49.6 21.2 51 C23.8 51.8 25.6 49 26.4 45 Z" fill="#f3c6d1"/><path d="M29 27 C20 18.5 10.5 22 11 34.5" stroke="#fff" stroke-opacity=".4" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
    case 'side': return a.animal === 'sheep'
      ? ahSym(`<path d="M25 37 C18 35 11.5 37 9.5 41.5 C13 46.5 20 47.5 25.5 44.5 Z" fill="${c}" ${st}/><path d="M23.2 39.4 C19 38.6 15.4 39.6 13.8 41.6 C16.4 44 20.4 44.4 23.4 43 Z" fill="#f7b6c8"/>`)
      : ahSym(`<ellipse cx="18.5" cy="41" rx="8.4" ry="7.4" fill="${c}" ${st}/><ellipse cx="18.8" cy="41.4" rx="4.6" ry="4" fill="${a.face}"/>`);
    case 'tufts': return ahSym(`<path d="M26.5 28 C24.5 20 20.5 12.5 14.5 6.5 C24 7 33.5 11.5 40 19.5 Z" fill="${c}" ${st}/><path d="M22.5 13.5 C26.5 15 30 17.6 33 21" stroke="${AH_SHADE}" stroke-opacity=".3" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    default: return '';
  }
}

// Floppy ears hang in FRONT of the head (drawn after it).
function ahFloppyEarsSvg(a){
  if (a.ears !== 'floppy') return '';
  const c = a.earColor || a.fur;
  return ahSym(`<path d="M33 18.5 C23 15 14.5 21 12.5 33 C11 42 13 51.5 18 54.5 C22.5 57 26.5 52 28 45 C29.5 38 31.5 28 33 18.5 Z" fill="${c}" ${ahSt(2.4)}/><path d="M16 50 C14.5 44 14.6 36 16.6 29.5" stroke="#fff" stroke-opacity=".32" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M28 45 C27 49 24.6 52.4 22 53.6" stroke="${AH_SHADE}" stroke-opacity=".25" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
}

// Fur, feather and skin markings, drawn inside the head clip.
function ahFurMarksSvg(a){
  const m = a.markColor || INK;
  const s = (d, w) => `<path d="${d}" stroke="${m}" stroke-width="${w || 3.2}" stroke-linecap="round" fill="none"/>`;
  switch (a.animal){
    case 'zebra': return s('M50 14.5 L50 23.5') + ahSym(s('M43 15.5 C44 19 45 21.5 46.8 24') + s('M20.5 33.5 C25.5 33 29 35 31 38.5') + s('M20.5 43 C24.5 42.6 27.6 44.2 29.4 47') + s('M23 52.5 C26 52 29 53.4 30.6 56'));
    case 'tiger': return s('M50 14.5 L50 21.5', 3) + ahSym(s('M43.5 15.5 C44.5 18.5 45.5 20 47 21.5', 2.6) + s('M21 35 C25.5 35.4 28.5 37 30 39.5', 2.8) + s('M21 44.5 C24.8 44.4 27.6 45.6 29 47.6', 2.8) + s('M24 54 C26.6 54 28.6 55 29.8 56.8', 2.4));
    case 'dalmatian': return `<circle cx="64" cy="22" r="3.4" fill="${m}"/><circle cx="71" cy="31" r="2.2" fill="${m}"/><circle cx="27" cy="53" r="2.6" fill="${m}"/><circle cx="72.5" cy="55" r="2" fill="${m}"/><circle cx="36" cy="58.5" r="1.6" fill="${m}"/>`;
    case 'cat': return s('M50 15.5 L50 22', 2.6) + ahSym(s('M44.5 16.5 C45.2 18.6 46 20 47 21.2', 2.2) + s('M22 39 C24.8 39.4 26.6 40.4 27.8 42', 2.2));
    case 'turtle': return `<path d="M42 18 L48 15.5 L54 17.5 L53 22.5 L46.5 23.5 Z" fill="${m}" opacity=".55"/><path d="M58 19.5 L63.5 20.5 L64 25 L59 25.5 Z" fill="${m}" opacity=".45"/><path d="M33.5 21.5 L38.5 20 L39.5 24.5 L34.5 25.5 Z" fill="${m}" opacity=".45"/>`;
    case 'owl': return `<path d="M44.5 26.5 L50 31.5 L55.5 26.5" stroke="${AH_SHADE}" stroke-opacity=".35" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'deer': return `<circle cx="41" cy="19" r="1.4" fill="#fff" opacity=".85"/><circle cx="46" cy="17" r="1.1" fill="#fff" opacity=".85"/><circle cx="57" cy="18" r="1.3" fill="#fff" opacity=".85"/><circle cx="62" cy="21" r="1" fill="#fff" opacity=".85"/>`;
    case 'elephant': return s('M44 21 C47 20 53 20 56 21', 1.6).replace(`stroke="${m}"`, `stroke="${AH_SHADE}" stroke-opacity=".3"`);
    case 'meerkat': return ahSym(`<path d="M27 42 C29 47 34 49.5 39 49" stroke="${m}" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>`);
    case 'hawk': return `<path d="M33 25 C38 22.5 43 23 46 25.5" stroke="${m}" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M67 25 C62 22.5 57 23 54 25.5" stroke="${m}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
    default: return '';
  }
}

// The lighter face area (muzzle, face disc, cheek fluff), inside the clip.
function ahFacePatchSvg(a){
  const f = a.face;
  switch (a.animal){
    case 'owl': case 'monkey': case 'hedgehog': return `<path d="M50 27.5 C44 21 27 21.5 26 36 C25 51 38 63.5 50 66 C62 63.5 75 51 74 36 C73 21.5 56 21 50 27.5 Z" fill="${f}"/>`;
    case 'penguin': return `<path d="M50 28.5 C43 22.5 27.5 24.5 27.5 39 C27.5 55 39.5 65 50 65 C60.5 65 72.5 55 72.5 39 C72.5 24.5 57 22.5 50 28.5 Z" fill="${f}"/>`;
    case 'fox': case 'tiger': case 'squirrel': case 'raccoon': return `<path d="M20 43 C29 47.5 39 48 50 53.5 C61 48 71 47.5 80 43 L82 72 L18 72 Z" fill="${f}"/>`;
    case 'parrot': return ahSym(`<ellipse cx="33" cy="47" rx="9" ry="7" fill="${f}"/>`);
    case 'hawk': return `<path d="M20 40 C30 44 40 45 50 49 C60 45 70 44 80 40 L82 72 L18 72 Z" fill="${f}"/>`;
    case 'frog': return `<path d="M19 48 C30 44 70 44 81 48 L82 72 L18 72 Z" fill="${f}"/>`;
    case 'zebra': case 'duck': case 'elephant': case 'koala': case 'piglet': return '';
    case 'sheep': return `<path d="M50 47 C45 43.5 35 44.5 34 52.5 C33.4 59.5 41 65.6 50 65.6 C59 65.6 66.6 59.5 66 52.5 C65 44.5 55 43.5 50 47 Z" fill="${a.face}"/>`;
    default: return `<path d="M50 46 C45 41.5 32.5 42.5 31 52.5 C30 60.5 39.5 67 50 67 C60.5 67 70 60.5 69 52.5 C67.5 42.5 55 41.5 50 46 Z" fill="${f}"/>`;
  }
}

// Big glossy cartoon eyes: white, colored iris, dark pupil, two highlights,
// a bold upper lash line. The lid (CSS .ah-lid) closes for a blink; the
// .ah-look group glances side to side now and then.
function ahEyeSvg(cx, cy, lid, iris, r){
  r = r || 1;
  const rx = 6.5 * r, ry = 7.4 * r;
  const ix = cx + 0.7 * r, iy = cy + 1 * r;
  return `<g class="ah-eye">`
    + `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`
    + `<path d="M${cx - rx + 0.8} ${cy - 1.2 * r} A${rx - 0.8} ${ry - 0.8} 0 0 1 ${cx + rx - 0.8} ${cy - 1.2 * r} A${rx} ${ry * 0.62} 0 0 0 ${cx - rx + 0.8} ${cy - 1.2 * r} Z" fill="${AH_SHADE}" opacity=".12"/>`
    + `<g class="ah-look">`
    + `<circle cx="${ix}" cy="${iy}" r="${4.6 * r}" fill="${iris || '#6b4a2a'}"/>`
    + `<path d="M${ix - 3.6 * r} ${iy + 1.4 * r} A${3.9 * r} ${3.9 * r} 0 0 0 ${ix + 3.6 * r} ${iy + 1.4 * r} A${4.2 * r} ${2.6 * r} 0 0 1 ${ix - 3.6 * r} ${iy + 1.4 * r} Z" fill="#fff" opacity=".32"/>`
    + `<circle cx="${ix}" cy="${iy}" r="${4.6 * r}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="${0.8 * r}"/>`
    + `<circle cx="${ix + 0.1 * r}" cy="${iy + 0.1 * r}" r="${2.5 * r}" fill="#17110c"/>`
    + `<circle cx="${ix + 1.7 * r}" cy="${iy - 1.9 * r}" r="${1.75 * r}" fill="#fff"/>`
    + `<circle cx="${ix - 1.7 * r}" cy="${iy + 2.1 * r}" r="${0.85 * r}" fill="#fff" opacity=".9"/>`
    + `</g>`
    + `<path d="M${cx - rx - 0.3} ${cy + 0.4 * r} A${rx + 0.2} ${ry + 0.2} 0 0 1 ${cx + rx + 0.2} ${cy - 0.6 * r} l${1.5 * r} ${-1.3 * r}" stroke="${INK}" stroke-width="${2.1 * r}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<g class="ah-lid"><path d="M${cx - rx - 0.6} ${cy} A${rx + 0.6} ${ry + 0.6} 0 0 1 ${cx + rx + 0.6} ${cy} A${rx + 0.6} ${ry + 0.6} 0 0 1 ${cx - rx - 0.6} ${cy} Z" fill="${lid}" stroke="${INK}" stroke-width="1.5"/>`
    + `<path d="M${cx - rx * 0.8} ${cy + ry * 0.15} Q${cx} ${cy + ry * 0.85} ${cx + rx * 0.8} ${cy + ry * 0.15}" stroke="${INK}" stroke-width="${1.8 * r}" fill="none" stroke-linecap="round"/></g>`
    + `</g>`;
}

// Hero mask (theme color, flared tips), goggles, visor or a natural mask,
// with the eyes and brows. Brows tilt in a touch (determined) but stay soft
// and high (friendly) -- never an angry V.
function ahMaskSvg(a, accent){
  const EY = 37.5, iris = a.iris;
  if (a.animal === 'frog'){
    return `<path d="M22.5 25 C23.5 15.5 46.5 15.5 47.5 25 C46.5 33 23.5 33 22.5 25 Z M52.5 25 C53.5 15.5 76.5 15.5 77.5 25 C76.5 33 53.5 33 52.5 25 Z" fill="${accent}" ${ahSt(2)}/>`
      + `<path d="M26 21.5 C29 18.5 35 17.8 39 18.8 M56 21.5 C59 18.5 65 17.8 69 18.8" stroke="#fff" stroke-opacity=".5" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
      + ahEyeSvg(35, 25, accent, iris, 0.9) + ahEyeSvg(65, 25, accent, iris, 0.9)
      + `<path d="M29 15.6 C32 13.8 37 13.6 40.5 15.4 M59.5 15.4 C63 13.6 68 13.8 71 15.6" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }
  const brows = (y, col) => `<path d="M31 ${y} C35 ${y - 2.6} 40.5 ${y - 2.4} 45 ${y + 0.6}" stroke="${col || INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M69 ${y} C65 ${y - 2.6} 59.5 ${y - 2.4} 55 ${y + 0.6}" stroke="${col || INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const eyes = (lid) => ahEyeSvg(39.5, EY, lid, iris) + ahEyeSvg(60.5, EY, lid, iris);
  if (a.mask === 'natural'){
    const m = a.markColor;
    let patch;
    if (a.animal === 'raccoon') patch = `<path d="M17.5 34 C24 27.5 41 28 50 35 C59 28 76 27.5 82.5 34 C80 42 72 48 62 47.5 C56 47 53 44.5 50 41.5 C47 44.5 44 47 38 47.5 C28 48 20 42 17.5 34 Z" fill="${m}" ${ahSt(1.6)}/>`;
    else if (a.animal === 'sloth') patch = ahSym(`<path d="M47 33.5 C45 28.5 36 28 31.5 31.5 C27 35 25 41.5 23.5 47 C22.6 50.5 25 52 28 50.5 C34 47.5 40.5 46 44.5 42.5 C47 40 47.8 36.5 47 33.5 Z" fill="${m}"/>`);
    else patch = ahSym(`<ellipse cx="39" cy="38.5" rx="10.2" ry="11.6" transform="rotate(28 39 38.5)" fill="${m}"/>`);
    return patch + eyes(m) + (a.animal === 'raccoon' ? brows(26.5) : '');
  }
  if (a.mask === 'goggles'){
    const frame = a.trim;
    return `<path d="M21 36 C16 36 15 30 21.5 30 L78.5 30 C85 30 84 36 79 36" stroke="${INK}" stroke-width="5.6" fill="none" stroke-linecap="round"/><path d="M21 36 C17 36 16.5 31.5 21.5 31.5 L78.5 31.5 C83.5 31.5 83 36 79 36" stroke="#34495e" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      + eyes(a.fur)
      + ahSym(`<circle cx="39.5" cy="37.5" r="10" fill="#9fe6ff" fill-opacity=".38" stroke="${frame}" stroke-width="3.4"/><circle cx="39.5" cy="37.5" r="11.7" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="39.5" cy="37.5" r="8.3" fill="none" stroke="${INK}" stroke-width="1.2"/><path d="M33.5 33 C35 30.8 37.4 29.8 40 29.8" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>`)
      + `<path d="M48.5 36 C49.5 34.8 50.5 34.8 51.5 36" stroke="${frame}" stroke-width="3" fill="none"/>`
      + brows(25);
  }
  if (a.mask === 'visor'){
    return eyes(a.face)
      + `<path d="M20.5 33 C29 26.5 71 26.5 79.5 33 L77.5 43 C69 49 31 49 22.5 43 Z" fill="#5ff2ff" fill-opacity=".34" stroke="${accent}" stroke-width="3.2" stroke-linejoin="round"/>`
      + `<path d="M20.5 33 C29 26.5 71 26.5 79.5 33 L77.5 43 C69 49 31 49 22.5 43 Z" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round" transform="translate(50 38) scale(1.07 1.12) translate(-50 -38)"/>`
      + `<path d="M28 41 L36 30.5 M33 42.5 L41 31" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>`
      + `<path d="M24 33.5 C33 28.6 67 28.6 76 33.5" stroke="#fff" stroke-opacity=".55" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  }
  const d = 'M50 34 C45.5 30 36 29.5 28 31.5 L20.5 28.5 C21 34.5 22.6 39.6 26.4 43.2 C31 46.8 41.5 47.2 50 42.2 C58.5 47.2 69 46.8 73.6 43.2 C77.4 39.6 79 34.5 79.5 28.5 L72 31.5 C64 29.5 54.5 30 50 34 Z';
  return `<path d="${d}" fill="${accent}" ${ahSt(2.2)}/>`
    + `<path d="M28.5 44 C33.5 46.6 42 46.8 48.5 43 M71.5 44 C66.5 46.6 58 46.8 51.5 43" stroke="${AH_SHADE}" stroke-opacity=".3" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
    + `<path d="M23.5 32 C25.6 32.4 27.6 32 29.6 31.4 C34 30.4 39.5 30.4 44 31.8" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    + eyes(accent) + brows(26.4);
}

// Open, happy grin: dark mouth, pink tongue, a hint of teeth.
function ahGrin(cx, y, w, h){
  const l = cx - w, r = cx + w;
  const mouth = `M${l} ${y} Q${cx} ${y + h * 0.3} ${r} ${y} Q${r - w * 0.12} ${y + h} ${cx} ${y + h} Q${l + w * 0.12} ${y + h} ${l} ${y} Z`;
  return `<path d="${mouth}" fill="#5a1a26" ${ahSt(1.6)}/>`
    + `<path d="M${cx - w * 0.58} ${y + h * 0.8} Q${cx} ${y + h * 0.42} ${cx + w * 0.58} ${y + h * 0.8} Q${cx + w * 0.4} ${y + h - 0.5} ${cx} ${y + h - 0.5} Q${cx - w * 0.4} ${y + h - 0.5} ${cx - w * 0.58} ${y + h * 0.8} Z" fill="#ff8a9c"/>`
    + `<path d="M${l + w * 0.22} ${y + h * 0.1} Q${cx} ${y + h * 0.42} ${r - w * 0.22} ${y + h * 0.1}" stroke="#fff" stroke-width="${Math.max(1.2, h * 0.17)}" fill="none" stroke-linecap="round"/>`
    + `<path d="M${l - 0.8} ${y - 1} Q${l} ${y + 0.4} ${l - 0.4} ${y + 1.4} M${r + 0.8} ${y - 1} Q${r} ${y + 0.4} ${r + 0.4} ${y + 1.4}" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
}

const ahNose = (cx, cy, s, col) => {
  s = s || 1;
  return `<path d="M${cx - 4.8 * s} ${cy - 1.2 * s} C${cx - 4.4 * s} ${cy - 3.8 * s} ${cx + 4.4 * s} ${cy - 3.8 * s} ${cx + 4.8 * s} ${cy - 1.2 * s} C${cx + 4.8 * s} ${cy + 1.2 * s} ${cx + 2.3 * s} ${cy + 3 * s} ${cx} ${cy + 3.2 * s} C${cx - 2.3 * s} ${cy + 3 * s} ${cx - 4.8 * s} ${cy + 1.2 * s} ${cx - 4.8 * s} ${cy - 1.2 * s} Z" fill="${col || INK}" ${ahSt(1.2)}/>`
    + ahShine(cx - 1.8 * s, cy - 1.6 * s, 1.7 * s, 0.9 * s, -10, 0.9);
};

function ahSnoutSvg(a){
  const f = a.face;
  switch (a.snout){
    case 'beak': // small open beak with a tongue (owl, penguin)
      return `<path d="M44 49 Q50 51 56 49 Q55 57.5 50 58.5 Q45 57.5 44 49 Z" fill="#5a1a26" ${ahSt(1.5)}/><path d="M46.6 55.4 Q50 53.4 53.4 55.4 Q52 58 50 58 Q48 58 46.6 55.4 Z" fill="#ff8a9c"/>`
        + `<path d="M43.5 47.5 C44.5 43.4 55.5 43.4 56.5 47.5 C56 50.6 53 52.6 50 54 C47 52.6 44 50.6 43.5 47.5 Z" fill="${a.beak}" ${ahSt(1.6)}/>${ahShine(47.5, 46, 2.2, 1, -10, 0.7)}`
        + `<path d="M45.5 56 Q50 60.6 54.5 56" stroke="${a.beak}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    case 'hook': // hooked beak (parrot, hawk)
      return `<path d="M44.5 51 Q50 53 55.5 51 Q54.5 59 50 60 Q45.5 59 44.5 51 Z" fill="#5a1a26" ${ahSt(1.5)}/><path d="M46.8 57 Q50 55 53.2 57 Q52 59.6 50 59.6 Q48 59.6 46.8 57 Z" fill="#ff8a9c"/>`
        + `<path d="M42.5 47 C43 42 57 42 57.5 47 C57.5 51.5 54.5 54.5 51.5 57.5 C50.5 58.5 49 58 49.2 56.6 C49.4 55 47 53.5 45 52 C43.4 50.6 42.5 49 42.5 47 Z" fill="${a.beak}" ${ahSt(1.6)}/>${ahShine(46.8, 45.6, 2.6, 1.1, -10, 0.7)}`
        + `<path d="M51.5 57.5 C53 55 54.4 52.6 55.4 50" stroke="${AH_SHADE}" stroke-opacity=".3" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    case 'bill':
      return ahGrin(50, 53.5, 8.2, 8)
        + `<path d="M37 49.5 C37 44 63 44 63 49.5 C63 53 57.5 55.5 50 55.5 C42.5 55.5 37 53 37 49.5 Z" fill="${a.beak}" ${ahSt(1.8)}/>${ahShine(43.5, 47.4, 4, 1.3, -6, 0.6)}`
        + `<ellipse cx="46.5" cy="49" rx="1" ry="0.7" fill="${INK}" opacity=".6"/><ellipse cx="53.5" cy="49" rx="1" ry="0.7" fill="${INK}" opacity=".6"/>`;
    case 'teeth':
      return `<ellipse cx="50" cy="54.5" rx="12" ry="9" fill="${f}" ${ahSt(1.5)}/>` + ahGrin(50, 55.5, 7, 7)
        + `<path d="M46 55.8 L46.4 61 Q48 62 49.6 61 L49.8 56.6 Z M50.2 56.6 L50.4 61 Q52 62 53.6 61 L54 55.8 Z" fill="#fff" ${ahSt(1.2)}/>` + ahNose(50, 49.4, 0.95);
    case 'bignose':
      return ahGrin(50, 58.5, 6.4, 6.4) + `<path d="M50 41.5 C56.5 41.5 57.5 47.5 57 51.5 C56.4 56 53.4 58 50 58 C46.6 58 43.6 56 43 51.5 C42.5 47.5 43.5 41.5 50 41.5 Z" fill="#3d4247" ${ahSt(1.5)}/>${ahShine(47.4, 45.8, 1.8, 3, -8, 0.6)}`;
    case 'pig':
      return ahGrin(50, 59.4, 6.6, 5.8) + `<ellipse cx="50" cy="52.5" rx="9" ry="6.6" fill="#ff9fb7" ${ahSt(1.8)}/><ellipse cx="46.6" cy="52.8" rx="1.7" ry="2.4" fill="#8a3a52"/><ellipse cx="53.4" cy="52.8" rx="1.7" ry="2.4" fill="#8a3a52"/>${ahShine(46.5, 49, 3, 1.1, -8, 0.6)}`;
    case 'trunk':
      return ahGrin(40.5, 57.5, 5, 5.4)
        + `<path d="M44.5 44 C43.5 51 44.5 57 48.5 60.5 C52.5 63.5 59.5 62.8 63 58.2 C65 55.2 64.4 51.4 61.4 50.8 C59.6 53.6 57.6 56 54.8 55.4 C52.6 54.8 54.4 49.2 55.5 44 Z" fill="${a.fur}" ${ahSt(2)}/>`
        + `<path d="M46.4 50.5 Q50 51.6 53.6 50.5 M46.8 55 Q49.6 56.6 52.8 55.8" stroke="${AH_SHADE}" stroke-opacity=".3" stroke-width="1.3" fill="none" stroke-linecap="round"/><ellipse cx="62.2" cy="53" rx="1.6" ry="1.1" fill="${AH_SHADE}" opacity=".5"/>`
        + `<path d="M46.2 45 C45.6 50 46.2 54.4 48.6 57.6" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    case 'smile':
      return `<path d="M30 50 Q50 56.5 70 50 Q66.5 64.5 50 65 Q33.5 64.5 30 50 Z" fill="#5a1a26" ${ahSt(1.8)}/><path d="M39 60.5 Q50 54.5 61 60.5 Q57 64.6 50 64.6 Q43 64.6 39 60.5 Z" fill="#ff8a9c"/><path d="M34 51.6 Q50 57 66 51.6" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
        + `<ellipse cx="46" cy="45" rx="1.2" ry=".8" fill="${INK}"/><ellipse cx="54" cy="45" rx="1.2" ry=".8" fill="${INK}"/>`;
    case 'muzzle': {
      const zebra = a.animal === 'zebra';
      return `<ellipse cx="50" cy="54.8" rx="12" ry="9.2" fill="${f}" ${ahSt(1.5)}/>` + ahShine(45, 49.2, 4, 1.6, -12, zebra ? 0.18 : 0.5)
        + ahGrin(50, 56, 6.8, 6.8) + `<path d="M50 52.6 L50 55.6" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>`
        + (zebra ? `<ellipse cx="45.5" cy="50" rx="1.6" ry="1.1" fill="#1a1a1a"/><ellipse cx="54.5" cy="50" rx="1.6" ry="1.1" fill="#1a1a1a"/>` : ahNose(50, 49.6, 1));
    }
    default: // small nose + grin on the face patch
      return ahGrin(50, 55.6, 6, 6.2) + `<path d="M50 52.2 L50 55.3" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>` + ahNose(50, 50.2, a.animal === 'mouse' || a.animal === 'bunny' ? 0.62 : 0.78, a.animal === 'bunny' || a.animal === 'mouse' || a.animal === 'cat' ? '#f27a98' : null);
  }
}

/* ---- Lesson gear --------------------------------------------------------
   back:  drawn behind the head (manes, spikes, crests, antlers, hats' backs)
   front: drawn over the face (helmets, hats, bands, headsets, goggles)
   body / neck: on the suit (see ahBustSvg). */
function ahHeadBackSvg(a, accent){
  const m = a.markColor;
  let s = '';
  if (ahHas(a, 'mane')){
    const bumps = [];
    for (let i = 0; i < 16; i++){
      const t = i / 16 * Math.PI * 2, r = 31.5;
      bumps.push(`<circle cx="${(50 + r * Math.cos(t)).toFixed(1)}" cy="${(42 + r * 0.98 * Math.sin(t)).toFixed(1)}" r="8.4"/>`);
    }
    s += ahUnion(`<circle cx="50" cy="42" r="31"/>` + bumps.join(''), m, 2.4)
      + `<circle cx="50" cy="42" r="31" fill="#fff" opacity=".12"/>`
      + [200, 240, 290, 330].map(d => { const t = d * Math.PI / 180; return `<path d="M${(50 + 25 * Math.cos(t)).toFixed(1)} ${(42 + 25 * Math.sin(t)).toFixed(1)} L${(50 + 34 * Math.cos(t)).toFixed(1)} ${(42 + 34 * Math.sin(t)).toFixed(1)}" stroke="${AH_SHADE}" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>`; }).join('');
  }
  if (ahHas(a, 'spikes')){
    const sp = [];
    [168, 190, 212, 234, 256, 278, 300, 322, 344, 6, 28].forEach(d => {
      const t = d * Math.PI / 180, x = 50 + 25 * Math.cos(t), y = 42 + 25 * Math.sin(t), x2 = 50 + 40 * Math.cos(t), y2 = 42 + 39 * Math.sin(t);
      const px = 7.5 * Math.cos(t + Math.PI / 2), py = 7.5 * Math.sin(t + Math.PI / 2);
      sp.push(`<path d="M${(x - px).toFixed(1)} ${(y - py).toFixed(1)} Q${(x2 - px * 0.2).toFixed(1)} ${(y2 - py * 0.2).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} Q${(x2 + px * 0.05).toFixed(1)} ${(y2 + py * 0.05).toFixed(1)} ${(x + px).toFixed(1)} ${(y + py).toFixed(1)} Z"/>`);
    });
    s += ahUnion(sp.join(''), m, 2.2) + `<g fill="#fff" opacity=".22">${sp.slice(1, 6).join('')}</g>`.replace(/Q/g, 'Q');
  }
  if (ahHas(a, 'wool')){
    const puffs = [[50, 14, 11], [36, 17, 10], [64, 17, 10], [25, 26, 9.5], [75, 26, 9.5], [20, 38, 8.5], [80, 38, 8.5], [43, 9.5, 8], [57, 9.5, 8]];
    s += ahUnion(puffs.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}"/>`).join(''), m, 2.2)
      + puffs.slice(0, 5).map(p => `<path d="M${p[0] - p[2] * 0.6} ${p[1] - p[2] * 0.2} A${p[2] * 0.7} ${p[2] * 0.7} 0 0 1 ${p[0] + p[2] * 0.1} ${p[1] - p[2] * 0.68}" stroke="#dfe6ee" stroke-width="1.6" fill="none" stroke-linecap="round" transform="rotate(10 ${p[0]} ${p[1]})"/>`).join('');
  }
  if (ahHas(a, 'antlers')){
    const ant = `<path d="M36.5 19 C34 13 30.5 9 26 4.5 M31.4 11 C28 11.4 24.6 13.2 22 15.6 M28.6 7.2 C28.4 4.6 29.4 2.4 31 1"/>`;
    s += `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`
      + `<g stroke="${INK}" stroke-width="7.4">${ahSym(ant)}</g><g stroke="${m}" stroke-width="3.4">${ahSym(ant)}</g></g>`
      + ahSym(`<path d="M35.4 16.4 C33.4 12.4 30.6 9.4 27.6 6.6" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" fill="none" stroke-linecap="round"/>`);
  }
  if (ahHas(a, 'crest')){
    s += ahUnion(`<path d="M44 17.5 C40.5 10 41 4 44.5 0.8 C46 5.5 48 9 50 12 Z"/><path d="M48 16 C47.5 8 50.5 2.5 55.5 0.4 C55 5.5 54 10 52.5 15.5 Z"/><path d="M53 17 C55 10.5 59.5 7 64.5 6.6 C62 10.6 59.5 14 57.2 18 Z"/>`, m, 2)
      + `<path d="M44.6 4 C44.4 7.6 46 11 48 13.6 M54.5 3.4 C52.6 6.6 51.6 10.4 51.4 14" stroke="#ffb43b" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  }
  if (ahHas(a, 'hawkcrest')){
    s += ahUnion(`<path d="M42 17 C42 10.5 46 7 50.5 6.5 C49 9.5 49.4 12 50.4 14 C52 10 56 8 60.5 8.6 C57.6 11 56.6 14 57.4 17.4 Z"/>`, a.fur, 2.2);
  }
  if (ahHas(a, 'mohawk')){
    const spikes = '<path d="M39.5 18.5 L37.5 9 L43 12.5 L44.5 3.5 L49 9.5 L52.5 2.5 L55 10 L60.5 6 L60 18.5 Z"/>';
    s += ahUnion(spikes, '#ffffff', 2.2)
      + `<path d="M41.8 12 L42.6 17 M47 8 L47.6 16.5 M53 6.5 L52.8 16.5 M58 9 L57.4 17" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
  }
  if (ahHas(a, 'radarear')){
    s += `<g transform="translate(5.5 1)"><path d="M19 30 L12 21" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M19 30 L12 21" stroke="#9aa6b6" stroke-width="1.8" stroke-linecap="round"/>`
      + `<path d="M5.5 22 C7 14 15 10.5 20 14 Z" fill="#e8eef5" ${ahSt(1.8)}/><circle cx="12.6" cy="18" r="1.8" fill="${a.trim}" ${ahSt(1)}/>`
      + `<path d="M8 10 C10 8 13 7.4 15.4 8 M6 6.6 C9.4 3.6 14 2.8 17.6 4" stroke="${a.trim}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  }
  if (ahHas(a, 'headphones') || ahHas(a, 'headmic')){
    s += `<path d="M20 40 C18 18 32 9.5 50 9.5 C68 9.5 82 18 80 40" stroke="${INK}" stroke-width="6.6" fill="none" stroke-linecap="round"/><path d="M20 40 C18 18 32 9.5 50 9.5 C68 9.5 82 18 80 40" stroke="#4a5068" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}

function ahHeadFrontSvg(a, accent, uid){
  const trim = a.trim;
  let s = '';
  // Fire helmet: bright yellow shell, red comb, reflective band, round red
  // front badge with a white flame.
  if (ahHas(a, 'firehelmet')){
    s += `<path d="M16.5 31.5 C17 25.5 83 25.5 83.5 31.5 C84 36 16 36 16.5 31.5 Z" fill="${trim}" ${ahSt(2.4)}/>`
      + `<path d="M23.5 29 C23 15 35 6.5 50 6.5 C65 6.5 77 15 76.5 29 C66 26.4 34 26.4 23.5 29 Z" fill="${trim}" ${ahSt(2.4)}/>`
      + `<path d="M45.5 7 C45 13 45 20 45.5 27 L54.5 27 C55 20 55 13 54.5 7 Z" fill="${accent}" ${ahSt(1.6)}/>`
      + `<path d="M23.5 29 C34 26.4 66 26.4 76.5 29 L76.7 32 C66 29.4 34 29.4 23.3 32 Z" fill="#eef3f8" stroke="${INK}" stroke-width="1.2"/>`
      + `<path d="M26 30 C36 28 64 28 74 30" stroke="${AH_SHADE}" stroke-opacity=".18" stroke-width="1" fill="none"/>`
      + `<circle cx="50" cy="18" r="7.2" fill="${accent}" stroke="${INK}" stroke-width="1.6"/><circle cx="50" cy="18" r="5.8" fill="none" stroke="#ffe680" stroke-width="1.2"/>`
      + `<path d="M50 13.2 C51 15.6 47.8 16.6 47.8 19.2 A2.2 2.2 0 0 0 52.2 19.2 C52.8 19.8 52.8 20.6 52.8 21 C52.8 22.2 51.5 22.9 50 22.9 C48.5 22.9 47.2 22 47.2 20.5 C47.2 17.4 49 16 50 13.2 Z" fill="#fff"/>`
      + `<path d="M28 22 C30 15 37.5 10 43.5 9" stroke="#fff" stroke-opacity=".65" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  if (ahHas(a, 'hardhat')){
    s += `<path d="M19 28.5 C19 25 81 25 81 28.5 C81 32 19 32 19 28.5 Z" fill="${trim}" ${ahSt(2.2)}/>`
      + `<path d="M25 27.5 C24.5 15 35.5 7.5 50 7.5 C64.5 7.5 75.5 15 75 27.5 C64 25.5 36 25.5 25 27.5 Z" fill="${trim}" ${ahSt(2.4)}/>`
      + `<path d="M45.5 8.5 C45 15 45 21 45.5 26 L54.5 26 C55 21 55 15 54.5 8.5 Z" fill="#fff" fill-opacity=".28" stroke="${INK}" stroke-width="1.4"/>`
      + `<path d="M25 27.5 C36 25.5 64 25.5 75 27.5" stroke="${AH_SHADE}" stroke-opacity=".3" stroke-width="2" fill="none"/>`
      + `<path d="M30 21 C31.5 15 37 11 42.5 10" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>`
      + `<path d="M50 13 l1.4 2.9 3.2.4-2.4 2.2.6 3.1-2.8-1.6-2.8 1.6.6-3.1-2.4-2.2 3.2-.4z" fill="${accent}" stroke="${INK}" stroke-width=".8"/>`;
  }
  if (ahHas(a, 'souwester')){
    s += `<path d="M14.5 33 C14 27 24 23.5 50 23.5 C76 23.5 86 27 85.5 33 C84.5 36.5 78 31.5 50 31 C22 31.5 15.5 36.5 14.5 33 Z" fill="${trim}" ${ahSt(2.4)}/>`
      + `<path d="M26 26.5 C25.5 14.5 36.5 8 50 8 C63.5 8 74.5 14.5 74 26.5 C64 24.6 36 24.6 26 26.5 Z" fill="${trim}" ${ahSt(2.4)}/>`
      + `<path d="M26 26.5 C36 24.6 64 24.6 74 26.5" stroke="#fff" stroke-opacity=".5" stroke-width="2.2" fill="none"/>`
      + `<path d="M31 20 C32.5 14 38 10.5 44 9.8" stroke="#fff" stroke-opacity=".55" stroke-width="2" fill="none" stroke-linecap="round"/>`
      + `<path d="M58 9.4 C61 7 64 4.6 66.5 5.4 C67.6 6 66.4 8.6 63.6 10.6" fill="${a.fur}" ${ahSt(1.6)}/>`;
  }
  if (ahHas(a, 'rangerhat')){
    s += `<path d="M10.5 28 C12 22.5 32 20.5 50 20.5 C68 20.5 88 22.5 89.5 28 C88.5 32 68 30.5 50 30.5 C32 30.5 11.5 32 10.5 28 Z" fill="#d8b676" ${ahSt(2.4)}/>`
      + `<path d="M31.5 25 C31.5 17 35 9.5 42 5 L46.5 8.5 L50 3.5 L53.5 8.5 L58 5 C65 9.5 68.5 17 68.5 25 Z" fill="#d8b676" ${ahSt(2.4)}/>`
      + `<path d="M31.8 21.5 C42 19.5 58 19.5 68.2 21.5 L68.4 25 C58 23.2 42 23.2 31.6 25 Z" fill="${accent}" stroke="${INK}" stroke-width="1.4"/>`
      + `<path d="M46.5 8.5 L48 20 M53.5 8.5 L52 20" stroke="${AH_SHADE}" stroke-opacity=".3" stroke-width="1.5" stroke-linecap="round"/>`
      + `<path d="M36 17 C36.6 12.6 39 9 42 7" stroke="#fff" stroke-opacity=".55" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
      + `<circle cx="61.5" cy="23.2" r="2.4" fill="url(#${uid}g)" stroke="${INK}" stroke-width="1"/>`;
  }
  if (ahHas(a, 'siren')){
    s += `<path d="M24 31 C22 17 34 10 50 10 C66 10 78 17 76 31 C66 27.5 34 27.5 24 31 Z" fill="${accent}" ${ahSt(2.4)}/>`
      + `<path d="M24 31 C34 27.5 66 27.5 76 31 L76.4 33.6 C66 30.4 34 30.4 23.6 33.6 Z" fill="${trim}" stroke="${INK}" stroke-width="1.2"/>`
      + `<path d="M43 11 C43 4 57 4 57 11 Z" fill="#ffe680" ${ahSt(2)}/><rect x="41" y="10.4" width="18" height="3.6" rx="1.6" fill="#c7ced8" ${ahSt(1.4)}/>`
      + `<path d="M46 9.4 C46 7 48 5.8 50 5.8" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      + `<path d="M38 5.5 L35 3 M62 5.5 L65 3 M50 1.6 L50 -0.6" stroke="${trim}" stroke-width="1.8" stroke-linecap="round"/>`
      + `<path d="M29 23 C31 17 37 13.4 43 12.6" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  if (ahHas(a, 'bikehelmet')){
    s += `<path d="M22 30 C19 15 33 6 50 6 C67 6 81 15 78 30 C77 31 74.5 30.8 73.5 29.8 C66 26.6 34 26.6 26.5 29.8 C25.5 30.8 23 31 22 30 Z" fill="${trim}" ${ahSt(2.4)}/>`
      + `<path d="M36 9 C33 16 32 22 32.4 27.6 M50 6.4 L50 27 M64 9 C67 16 68 22 67.6 27.6" stroke="${accent}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      + `<path d="M41 10.5 C40 15 39.6 19.5 39.8 23.5 L44.4 23.5 C44.2 19 44.4 14.5 45.2 9.6 Z M59 10.5 C60 15 60.4 19.5 60.2 23.5 L55.6 23.5 C55.8 19 55.6 14.5 54.8 9.6 Z" fill="#33384a" stroke="${INK}" stroke-width="1"/>`
      + `<path d="M26 27.5 C35 24 65 24 74 27.5 L73 31.4 C64 28.6 36 28.6 27 31.4 Z" fill="#33384a" ${ahSt(1.4)}/>`
      + `<path d="M26 20 C27.5 14 32 10 37 8.6" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  if (ahHas(a, 'hood')){
    s += `<path d="M17 50 C12 24 28 8.5 50 8.5 C72 8.5 88 24 83 50 C81.5 57 78 62 73 65 C77 54 77.5 36 70 28.5 C63.5 22 36.5 22 30 28.5 C22.5 36 23 54 27 65 C22 62 18.5 57 17 50 Z" fill="${accent}" ${ahSt(2.4)}/>`
      + `<path d="M30 28.5 C36.5 22 63.5 22 70 28.5" stroke="${trim}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
      + `<path d="M19.5 44 C18 30 26 17 40 12.5" stroke="#fff" stroke-opacity=".4" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      + `<path d="M80.5 46 C82 34 78 22 68 15" stroke="${AH_SHADE}" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  if (ahHas(a, 'sailorcap')){
    s += `<g transform="rotate(-10 50 14)"><path d="M37 15 C36 9 64 9 63 15 L61.5 20 C55 18.6 45 18.6 38.5 20 Z" fill="#fff" ${ahSt(2.2)}/>`
      + `<path d="M34.5 19.5 C40 16.4 60 16.4 65.5 19.5 C66.5 21.5 65 23.2 63 22.8 C56 20.8 44 20.8 37 22.8 C35 23.2 33.5 21.5 34.5 19.5 Z" fill="#fff" ${ahSt(2)}/>`
      + `<path d="M36 21 C44 19 56 19 64 21" stroke="${trim}" stroke-width="1.8" fill="none"/><path d="M40 12.4 C41.5 11.2 44 10.6 46.6 10.6" stroke="${AH_SHADE}" stroke-opacity=".18" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  }
  if (ahHas(a, 'medband')){
    s += `<path d="M40.5 23.5 C40 15.5 44 11.5 50 11.5 C56 11.5 60 15.5 59.5 23.5 C54 22 46 22 40.5 23.5 Z" fill="#fff" ${ahSt(2)}/><path d="M40.4 21 C46 19.6 54 19.6 59.6 21" stroke="#e5484d" stroke-width="1.6" fill="none"/>`
      + `<path d="M50 19.4 C47 17.4 46 15.8 46 14.8 C46 13.4 47.2 12.6 48.2 12.6 C49 12.6 49.7 13.2 50 13.8 C50.3 13.2 51 12.6 51.8 12.6 C52.8 12.6 54 13.4 54 14.8 C54 15.8 53 17.4 50 19.4 Z" fill="#e5484d" stroke="${INK}" stroke-width="1"/>`
      + `<path d="M43 18 C43.4 15.4 45 13.6 47 13" stroke="${AH_SHADE}" stroke-opacity=".15" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  }
  if (ahHas(a, 'headband') || ahHas(a, 'sweatband') || ahHas(a, 'ribbonband') || ahHas(a, 'techband') || ahHas(a, 'headlamp')){
    const frog = a.animal === 'frog';
    const col = ahHas(a, 'headlamp') ? '#33384a' : (ahHas(a, 'techband') ? accent : trim);
    const y = frog ? 33 : 22.5;
    const band = frog ? `M24 ${y} C32 ${y - 4} 68 ${y - 4} 76 ${y} L76.5 ${y + 4.6} C68 ${y + 0.6} 32 ${y + 0.6} 23.5 ${y + 4.6} Z` : `M23.5 ${y + 3} C30 ${y - 5} 70 ${y - 5} 76.5 ${y + 3} L77.6 ${y + 8} C70 ${y + 0.6} 30 ${y + 0.6} 22.4 ${y + 8} Z`;
    s += `<path d="${band}" fill="${col}" ${ahSt(2)}/>`
      + `<path d="${frog ? `M27 ${y + 0.5} C36 ${y - 2.6} 64 ${y - 2.6} 73 ${y + 0.5}` : `M27 ${y + 2.4} C34 ${y - 2.6} 66 ${y - 2.6} 73 ${y + 2.4}`}" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    if (ahHas(a, 'ribbonband')){
      s += `<path d="M76 ${y + 4} C81 ${y + 1} 85.5 ${y + 2.4} 88.5 ${y - 0.6} C88 ${y + 4.6} 85 ${y + 7.6} 80 ${y + 8} Z" fill="${col}" ${ahSt(1.8)}/><path d="M76.5 ${y + 6} C80.6 ${y + 9} 84 ${y + 13.6} 85.4 ${y + 18} C81.6 ${y + 16.6} 78.6 ${y + 13} 76.6 ${y + 9.4} Z" fill="${col}" ${ahSt(1.8)}/><circle cx="76.6" cy="${y + 5.6}" r="2.8" fill="${col}" ${ahSt(1.6)}/>`;
    }
    if (ahHas(a, 'sweatband')){
      s += `<path d="M24.6 ${y + 5.2} C31 ${y - 1.6} 69 ${y - 1.6} 75.4 ${y + 5.2}" stroke="#fff" stroke-width="1.5" fill="none"/>`;
    }
    if (ahHas(a, 'medband')){
      s += `<path d="M50 ${y + 5.4} C46 ${y + 2.6} 44.6 ${y + 0.4} 44.6 ${y - 1} C44.6 ${y - 3} 46.2 ${y - 4} 47.6 ${y - 4} C48.8 ${y - 4} 49.6 ${y - 3.2} 50 ${y - 2.4} C50.4 ${y - 3.2} 51.2 ${y - 4} 52.4 ${y - 4} C53.8 ${y - 4} 55.4 ${y - 3} 55.4 ${y - 1} C55.4 ${y + 0.4} 54 ${y + 2.6} 50 ${y + 5.4} Z" fill="#e5484d" stroke="${INK}" stroke-width="1.1"/>`;
    }
    if (ahHas(a, 'techband')){
      s += `<path d="M50 ${y - 2} L50 ${y - 13}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M50 ${y - 2} L50 ${y - 13}" stroke="#c7ced8" stroke-width="1.4" stroke-linecap="round"/>`
        + `<circle cx="50" cy="${y - 15}" r="3.6" fill="${trim}" ${ahSt(1.4)}/>${ahShine(48.8, y - 16.2, 1.2, 0.8, 0, 0.9)}`
        + `<path d="M43 ${y - 18} C44 ${y - 21} 47 ${y - 22.4} 50 ${y - 22.4} C53 ${y - 22.4} 56 ${y - 21} 57 ${y - 18}" stroke="${trim}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>`
        + `<rect x="44" y="${y - 3.4}" width="12" height="5.2" rx="2.2" fill="#33384a" stroke="${INK}" stroke-width="1"/><circle cx="47" cy="${y - 0.8}" r="1" fill="${trim}"/><circle cx="50" cy="${y - 0.8}" r="1" fill="#7fffa8"/><circle cx="53" cy="${y - 0.8}" r="1" fill="${trim}"/>`;
    }
    if (ahHas(a, 'headlamp')){
      s += `<circle cx="50" cy="${y - 0.5}" r="6.4" fill="#c7ced8" ${ahSt(1.8)}/><circle cx="50" cy="${y - 0.5}" r="4.2" fill="#fff6b0" stroke="${INK}" stroke-width="1"/>${ahShine(48.6, y - 2, 1.6, 1, -20, 0.95)}`
        + `<path d="M42 ${y - 7.5} L39.5 ${y - 10} M50 ${y - 9.5} L50 ${y - 12.5} M58 ${y - 7.5} L60.5 ${y - 10}" stroke="${trim}" stroke-width="1.8" stroke-linecap="round"/>`;
    }
  }
  if (ahHas(a, 'pencil')){
    s += `<g transform="translate(100 0) scale(-1 1) rotate(-34 76 22)"><rect x="70" y="19.6" width="14" height="5" fill="#ff9a3c" ${ahSt(1.4)}/><path d="M72.6 19.8 L72.6 24.4 M77 19.8 L77 24.4" stroke="#d9701c" stroke-width="1"/><path d="M70 19.6 L65.6 22.1 L70 24.6 Z" fill="#f3d2a6" ${ahSt(1.2)}/><path d="M65.6 22.1 L67.2 21.2 L67.2 23 Z" fill="${INK}"/><rect x="84" y="19.6" width="3.6" height="5" rx="1.2" fill="#ff8fb1" ${ahSt(1.2)}/></g>`;
  }
  if (ahHas(a, 'aviators')){
    s += `<path d="M22 24.5 C30 19.5 70 19.5 78 24.5" stroke="${INK}" stroke-width="4.6" fill="none" stroke-linecap="round"/><path d="M22 24.5 C30 19.5 70 19.5 78 24.5" stroke="#7a5230" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      + ahSym(`<circle cx="40" cy="19.5" r="6.6" fill="#ffd27a" stroke="#c7ced8" stroke-width="2.6"/><circle cx="40" cy="19.5" r="8" fill="none" stroke="${INK}" stroke-width="1.4"/><circle cx="40" cy="19.5" r="5.2" fill="none" stroke="${INK}" stroke-width="1"/><path d="M36.6 17.6 C37.4 16 38.8 15.2 40.4 15" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>`)
      + `<path d="M47.6 19.5 L52.4 19.5" stroke="#c7ced8" stroke-width="2.4"/>`;
  }
  if (ahHas(a, 'headphones')){
    s += ahSym(`<rect x="13" y="33" width="12.4" height="18" rx="6" fill="${a.trim}" ${ahSt(2.2)}/><rect x="16" y="35.6" width="6.4" height="12.8" rx="3.2" fill="${accent}" stroke="${INK}" stroke-width="1"/>`)
      + `<path d="M15.6 37 C16 35.2 17.6 34.4 19 34.4" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }
  if (ahHas(a, 'headmic')){
    s += `<rect x="74.5" y="33" width="10" height="15" rx="5" fill="${accent}" ${ahSt(2.2)}/><circle cx="79.5" cy="40.5" r="2.6" fill="${a.trim}" stroke="${INK}" stroke-width="1"/>`
      + `<path d="M77 46 C74 55 68 59.5 62 60" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M77 46 C74 55 68 59.5 62 60" stroke="#4a5068" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      + `<ellipse cx="60.6" cy="60" rx="3.2" ry="2.6" fill="#33384a" ${ahSt(1.2)}/>`;
  }
  if (ahHas(a, 'earpiece')){
    s += `<circle cx="79" cy="40" r="4.4" fill="${accent}" ${ahSt(1.8)}/><path d="M80.5 36 L84 22" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M80.5 36 L84 22" stroke="#c7ced8" stroke-width="1.3" stroke-linecap="round"/><circle cx="84.3" cy="20.6" r="2.4" fill="${a.trim}" ${ahSt(1.2)}/>`;
  }
  if (ahHas(a, 'radarear')){
    s += `<path d="M22.8 24 C34 15.6 66 15.6 77.2 24" stroke="${INK}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M22.8 24 C34 15.6 66 15.6 77.2 24" stroke="${accent}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      + `<circle cx="21.5" cy="33" r="5" fill="${accent}" ${ahSt(1.8)}/><circle cx="21.5" cy="33" r="2" fill="${a.trim}"/>`;
  }
  if (ahHas(a, 'whiskers')){
    const wc = a.animal === 'cat' ? '#5b636b' : a.animal === 'mouse' ? '#8a929b' : '#5a3b24';
    s += ahSym(`<path d="M31 54 C26 52.6 20.5 52.4 15.5 53.2 M31 57 C26 57 21 58 16.6 60" stroke="${wc}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`);
  }
  if (ahHas(a, 'bandage')){
    s += `<g transform="rotate(-24 70 52)"><rect x="63.5" y="49.6" width="13" height="5.2" rx="2.4" fill="#f5d7b0" ${ahSt(1.2)}/><rect x="67.6" y="49.6" width="4.8" height="5.2" fill="#e8c090" stroke="${INK}" stroke-width=".8"/></g>`;
  }
  return s;
}

// Rosy cheeks (not on beaks, and not under goggles/visor tints).
function ahCheeksSvg(a){
  if (AH_BIRDS[a.animal] && a.animal !== 'owl') return '';
  if (a.animal === 'frog') return `<ellipse cx="25.5" cy="50" rx="4.6" ry="2.8" fill="#ff7f9a" opacity=".5"/><ellipse cx="74.5" cy="50" rx="4.6" ry="2.8" fill="#ff7f9a" opacity=".5"/>`;
  const y = a.animal === 'owl' ? 50 : 52;
  return `<ellipse cx="29" cy="${y}" rx="5" ry="3" fill="#ff7f9a" opacity=".5"/><ellipse cx="71" cy="${y}" rx="5" ry="3" fill="#ff7f9a" opacity=".5"/>`;
}

// The whole head: back gear, ears, fur (one outline), cel shade, rim light,
// face patch, markings, mask + eyes, snout, cheeks, front gear.
function ahHeadSvg(a, accent, uid){
  const shapes = ahHeadShapes(a);
  const clip = `${uid}hc`;
  const frog = a.animal === 'frog';
  return `<g class="ah-head">`
    + `<defs><clipPath id="${clip}">${shapes}</clipPath></defs>`
    + ahHeadBackSvg(a, accent)
    + `<g class="ah-ears">${ahEarsSvg(a, uid)}</g>`
    + ahUnion(shapes, a.fur, 2.6)
    + `<g clip-path="url(#${clip})">${ahFacePatchSvg(a)}${ahFurMarksSvg(a)}</g>`
    + ahCel(clip, frog ? 46 : 45.5, frog ? 38 : 36, frog ? 33 : 29.2, 0.2)
    + `<g clip-path="url(#${clip})"><path d="${frog ? 'M24 24 C25 17 30 14.5 35 14.5' : 'M26.5 46 C24.5 31 33 19.5 46 17.6'}" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`
    + (frog ? ahShine(62, 16.5, 4, 2, -15, 0.45) : ahShine(36.5, 23.5, 6.5, 3.2, -30, 0.32))
    + (a.ears === 'floppy' ? `<g class="ah-ears">${ahFloppyEarsSvg(a)}</g>` : '')
    + ahCheeksSvg(a)
    + ahMaskSvg(a, accent)
    + ahSnoutSvg(a)
    + ahHeadFrontSvg(a, accent, uid)
    + `</g>`;
}

/* ---- Bust ----------------------------------------------------------------
   Big head on a compact, puffed-out chest; cape flaring behind with its
   lining showing; collar, chest trim, beveled badge with the hero emblem,
   utility belt + buckle, white gloves with colored cuffs. One arm gives a
   thumbs-up, the other waves now and then (CSS .ah-wave). */
const AH_TORSO = 'M37 61 C29 62 23.5 65.5 22.5 72 C21.5 79 23.5 89 26 102 L74 102 C76.5 89 78.5 79 77.5 72 C76.5 65.5 71 62 63 61 C59 64 54.5 65.5 50 65.5 C45.5 65.5 41 64 37 61 Z';

function ahGlove(x, y, fromX, fromY, trim, uid){
  const ux = fromX - x, uy = fromY - y, len = Math.hypot(ux, uy) || 1;
  const deg = Math.atan2(-ux / len, uy / len) * 180 / Math.PI;
  return `<g transform="translate(${x} ${y}) rotate(${deg.toFixed(1)})">`
    + `<rect x="-5.4" y="2.4" width="10.8" height="5.6" rx="2.2" fill="${trim}" ${ahSt(1.8)}/>`
    + `<ellipse cx="0" cy="0" rx="6.2" ry="5.8" fill="#fff" ${ahSt(2)}/><ellipse cx="0" cy="0" rx="6.2" ry="5.8" fill="url(#${uid}b)"/>`
    + `<path d="M-2.6 -4.6 C-2.8 -2.2 -2.6 0 -2 2 M1.4 -5 C1.2 -2.6 1.4 -0.4 2 1.6" stroke="${INK}" stroke-opacity=".45" stroke-width="1" fill="none" stroke-linecap="round"/>`
    + `</g>`;
}

// Thumbs-up fist (in front of the chest, left side of the picture).
function ahThumbsUp(x, y, trim, uid, watch){
  return `<g transform="translate(${x} ${y}) rotate(-8)">`
    + `<rect x="-6" y="4.4" width="11.4" height="5.4" rx="2.2" fill="${trim}" ${ahSt(1.8)}/>`
    + (watch ? `<rect x="-4.6" y="3.4" width="8.6" height="7.4" rx="2" fill="#33384a" ${ahSt(1.4)}/><circle cx="-0.3" cy="7.1" r="2.6" fill="#e8fbff" stroke="${INK}" stroke-width=".8"/><path d="M-0.3 7.1 L-0.3 5.4 M-0.3 7.1 L1 7.8" stroke="${INK}" stroke-width=".8" stroke-linecap="round"/>` : '')
    + `<path d="M-3.4 -3.6 C-3.6 -7.6 -3 -10.6 -0.8 -10.8 C1.4 -11 2 -8.6 1.8 -4.8 Z" fill="#fff" ${ahSt(1.8)}/>`
    + `<rect x="-6.6" y="-5" width="12.6" height="10.6" rx="4.6" fill="#fff" ${ahSt(2)}/><rect x="-6.6" y="-5" width="12.6" height="10.6" rx="4.6" fill="url(#${uid}b)"/>`
    + `<path d="M-6 -1.4 L-1 -1.4 M-6 2 L-1.4 2" stroke="${INK}" stroke-opacity=".5" stroke-width="1" stroke-linecap="round"/>`
    + `</g>`;
}

function ahBadgeSvg(cx, cy, r, accent, emblemInner, uid){
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${uid}g)" ${ahSt(2)}/>`
    + `<path d="M${cx - r * 0.72} ${cy - r * 0.5} A${r * 0.86} ${r * 0.86} 0 0 1 ${cx + r * 0.3} ${cy - r * 0.82}" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${accent}" stroke="${AH_GOLD_DARK}" stroke-width="1.2"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${AH_SHADE}" opacity=".28"/>`
    + (emblemInner ? `<g transform="translate(${cx},${cy}) scale(${(r * 0.054).toFixed(3)}) translate(-12,-12)" style="color:${accent}">${emblemInner}</g>` : `<path d="M${cx} ${cy - r * 0.45} l${r * 0.13} ${r * 0.28} ${r * 0.31} ${r * 0.04}-${r * 0.23} ${r * 0.21} ${r * 0.07} ${r * 0.3}-${r * 0.28}-${r * 0.16}-${r * 0.28} ${r * 0.16} ${r * 0.07}-${r * 0.3}-${r * 0.23}-${r * 0.21} ${r * 0.31}-${r * 0.04}z" fill="#fff"/>`)
    + ahShine(cx - r * 0.32, cy - r * 0.38, r * 0.26, r * 0.13, -35, 0.5);
}

function ahBustSvg(a, accent, uid, emblemInner, backdrop){
  const trim = a.trim || '#ffd23f';
  const tc = `${uid}tc`;
  let s = '';
  if (backdrop){
    s += `<rect x="-5" y="-5" width="110" height="110" style="fill:${accent}"/><rect x="-5" y="-5" width="110" height="110" fill="url(#${uid}bd)"/>`
      + `<g opacity=".5">` + [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(d => { const t = d * Math.PI / 180, t2 = (d + 11) * Math.PI / 180; return `<path d="M50 44 L${(50 + 80 * Math.cos(t)).toFixed(1)} ${(44 + 80 * Math.sin(t)).toFixed(1)} L${(50 + 80 * Math.cos(t2)).toFixed(1)} ${(44 + 80 * Math.sin(t2)).toFixed(1)} Z" fill="#fff"/>`; }).join('') + `</g>`
      + `<circle cx="50" cy="44" r="41" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.2"/>`;
  }
  // back gear
  if (ahHas(a, 'aura')) s += `<circle cx="50" cy="47" r="44" fill="${trim}" fill-opacity=".22" stroke="${trim}" stroke-width="2.4" stroke-dasharray="6 4"/><path d="M14 30 C18 21 25 14 34 9.6" stroke="#fff" stroke-opacity=".8" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if (ahHas(a, 'tail')) s += `<g transform="rotate(-6 80 70)"><path d="M70 98 C88 95 99 78 96 58 C93.5 41 82 30 69 32 C60.5 33.5 58.5 43 65 47 C73 45.5 80 51.5 81 61 C82 73 74.5 82 66 86 Z" fill="${a.fur}" ${ahSt(2.4)}/><path d="M77 46 C85 51 88 61 86.4 71 C85 79 80 86 73 90" stroke="${a.face}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M93 58 C92 50 88 43 82 38" stroke="${AH_SHADE}" stroke-opacity=".22" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M68 34 C64 32 60 30.5 57 31.5 M71 33 C70 29.5 67.6 27.6 64.6 27" stroke="${a.fur}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
  if (ahHas(a, 'shell')) s += `<path d="M14 92 C10 66 26 50 50 49 C74 50 90 66 86 92 Z" fill="#6aa86c" ${ahSt(2.4)}/><path d="M18 84 C17 66 30 55 50 54 C70 55 83 66 82 84" fill="none" stroke="#c9b26a" stroke-width="3.4"/><path d="M26 66 L34 60 M74 66 L66 60" stroke="${AH_SHADE}" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>`;
  // cape with its lining
  s += `<g class="ah-cape"><path d="M35 61 C24 64 14 72 9.5 85 C7.5 91 6 97 5 102 L95 102 C94 97 92.5 91 90.5 85 C86 72 76 64 65 61 Z" fill="${accent}" ${ahSt(2.4)}/>`
    + `<path d="M35 61 C24 64 14 72 9.5 85 C7.5 91 6 97 5 102 L95 102 C94 97 92.5 91 90.5 85 C86 72 76 64 65 61 Z" fill="${AH_SHADE}" opacity=".3"/>`
    + ahSym(`<path d="M5 102 C6 93 9 85 14.5 77.5 C13.6 86 14.6 94 17.6 102 Z" fill="${trim}" ${ahSt(1.8)}/>`)
    + `<path d="M20 74 C16 81 13.6 88 12.6 96" stroke="#fff" stroke-opacity=".28" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
    + `</g>`;
  if (ahHas(a, 'highcollar')) s += ahSym(`<path d="M35 65.5 C26 61 19.5 53 16.5 42 C25.5 45.5 33.5 50.5 41 59 Z" fill="${accent}" ${ahSt(2.2)}/><path d="M34.6 62.4 C28 58.6 23.4 53 21 46.6 C27.4 49.6 33 53.4 38 58.4 Z" fill="${trim}"/><path d="M34.6 62.4 C28 58.6 23.4 53 21 46.6" stroke="${AH_SHADE}" stroke-opacity=".25" stroke-width="1.4" fill="none"/>`);
  // suit: base, cel shade, rim light, panels and trim
  s += `<defs><clipPath id="${tc}"><path d="${AH_TORSO}"/></clipPath></defs>`
    + `<path d="${AH_TORSO}" fill="${accent}" ${ahSt(2.4)}/>`
    + `<g clip-path="url(#${tc})">`
    + `<path d="M65 60 C71.5 70 72 86 68.5 103 L82 103 L82 60 Z" fill="${AH_SHADE}" opacity=".24"/>`
    + `<path d="M35 60 C29 70 28.5 86 31.5 103 L18 103 L18 60 Z" fill="#fff" opacity=".1"/>`
    + `<path d="M25.5 73 C25 79 26 86 27.6 92" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none" stroke-linecap="round"/>`
    + `<path d="M40 70.5 C44 72.5 56 72.5 60 70.5" stroke="${AH_SHADE}" stroke-opacity=".2" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    + `</g>`
    + `<path d="M24.5 68 C33 70 39.5 74 43.5 79 M75.5 68 C67 70 60.5 74 56.5 79" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M24.5 68 C33 70 39.5 74 43.5 79 M75.5 68 C67 70 60.5 74 56.5 79" stroke="${trim}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  // body gear
  if (ahHas(a, 'reflect')) s += ahSym(`<path d="M32 64 C34 74 36 86 37 102 L42.5 102 C41.5 86 39.5 74 37.5 63 Z" fill="${trim}" ${ahSt(1.8)}/><path d="M34.8 64.5 C36.8 75 38.6 87 39.6 102" stroke="#eef3f8" stroke-width="1.8" fill="none"/>`);
  if (ahHas(a, 'lifevest')) s += ahSym(`<path d="M37 61.5 C31 63 26 66.5 25.5 72 C25 79 26.5 89 28.5 101 L40.5 101 C40 92 39.5 82 39.5 72 C39.5 67 38.6 63.6 37 61.5 Z" fill="${trim}" ${ahSt(2)}/><path d="M28 72 L39.4 72 M29 84 L39.8 84" stroke="#fff" stroke-width="2.4"/><path d="M29.4 66.5 C28.4 72 28.6 80 29.6 88" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" fill="none" stroke-linecap="round"/>`)
    + `<rect x="38.5" y="70.4" width="23" height="3.2" rx="1" fill="#33384a" stroke="${INK}" stroke-width="1"/><rect x="47.4" y="69.4" width="5.2" height="5.2" rx="1" fill="#c7ced8" stroke="${INK}" stroke-width="1"/>`;
  if (ahHas(a, 'sash')) s += `<g clip-path="url(#${tc})"><path d="M26 66.5 L35 63 L76 96 L72 103 Z" fill="${trim}" ${ahSt(1.8)}/><path d="M31 65 L74 99.5" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="2.6 2.6"/></g>`
    + [[36, 72.4], [64, 92]].map(p => `<path d="M${p[0]} ${p[1] - 2.6} l.9 1.8 2 .2-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.2z" fill="#fff" stroke="${INK}" stroke-width=".6"/>`).join('');
  if (ahHas(a, 'pauldrons')) s += ahSym(`<path d="M20 74 C19 66 25 61 33.5 61.5 C38 62 40.5 65 40 68.4 C35 67.6 28 69.6 20 74 Z" fill="url(#${uid}m)" ${ahSt(2)}/><path d="M22 71.5 C26 68.2 31 66.6 36.5 66.4" stroke="${INK}" stroke-width="1" fill="none"/><circle cx="28.4" cy="65.6" r="1.3" fill="${trim}" stroke="${INK}" stroke-width=".7"/>`);
  if (ahHas(a, 'epaulets')) s += ahSym(`<path d="M20.5 72 C20 66 25.5 62.5 32.5 63 C36.5 63.4 38.6 65.6 38.2 68 C32.5 67.6 26.5 69 20.5 72 Z" fill="url(#${uid}g)" ${ahSt(1.8)}/><path d="M22 73 L21.4 77 M25 71.4 L24.6 75.6 M28.2 70.2 L28 74.4 M31.4 69.4 L31.4 73.6" stroke="${AH_GOLD_DARK}" stroke-width="1.6" stroke-linecap="round"/>`);
  if (ahHas(a, 'stethoscope')) s += `<path d="M36 64 C33 72 34 80 40 83.5 M64 64 C67 72 66 80 60 83.5" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M36 64 C33 72 34 80 40 83.5 M64 64 C67 72 66 80 60 83.5" stroke="#4a5068" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    + `<path d="M60 83.5 C63 88 66.5 89 69 88" stroke="${INK}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M60 83.5 C63 88 66.5 89 69 88" stroke="#4a5068" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="70.5" cy="87.6" r="3.4" fill="url(#${uid}m)" ${ahSt(1.4)}/>`;
  // chest badge, belt
  s += ahBadgeSvg(50, 80.5, 10.5, accent, emblemInner, uid);
  s += `<rect x="23" y="93.5" width="54" height="9" rx="2" fill="${AH_BELT}" ${ahSt(2)}/>`
    + `<path d="M25 95.4 L75 95.4" stroke="#fff" stroke-opacity=".22" stroke-width="1.2"/>`
    + ahSym(`<rect x="28.5" y="92.4" width="8" height="8" rx="2" fill="${trim}" ${ahSt(1.6)}/><path d="M28.8 95 L36.2 95" stroke="${INK}" stroke-width="1"/>`);
  if (ahHas(a, 'champbelt')) s += `<path d="M38 91.5 L62 91.5 L64.5 97.5 L62 103 L38 103 L35.5 97.5 Z" fill="url(#${uid}g)" ${ahSt(2)}/><path d="M50 93.4 l1.6 3.3 3.6.4-2.7 2.5.8 3.5-3.3-1.9-3.3 1.9.8-3.5-2.7-2.5 3.6-.4z" fill="${trim}" stroke="${INK}" stroke-width=".9"/>`;
  else if (ahHas(a, 'keybuckle')) s += `<rect x="44" y="92" width="12" height="10.5" rx="2.4" fill="url(#${uid}g)" ${ahSt(1.8)}/><circle cx="50" cy="96" r="1.8" fill="${INK}"/><path d="M50 96.4 L49 100 L51 100 Z" fill="${INK}"/>`;
  else if (ahHas(a, 'coinbuckle')) s += `<circle cx="50" cy="97.5" r="6.4" fill="url(#${uid}g)" ${ahSt(1.8)}/><circle cx="50" cy="97.5" r="4.4" fill="none" stroke="${AH_GOLD_DARK}" stroke-width="1"/><path d="M50 94.6 L50 100.4 M48.4 95.8 C48.4 95 51.6 95 51.6 96 C51.6 97.4 48.4 97 48.4 98.6 C48.4 99.6 51.6 99.6 51.6 99" stroke="${AH_GOLD_DARK}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  else s += `<rect x="44" y="92" width="12" height="10.5" rx="2.4" fill="url(#${uid}g)" ${ahSt(1.8)}/><rect x="47" y="94.6" width="6" height="5.2" rx="1.2" fill="${accent}" stroke="${AH_GOLD_DARK}" stroke-width="1"/>`;
  // neck gear (under the chin)
  s += `<path d="M36.5 61.6 C41 65.6 45.5 66.8 50 66.8 C54.5 66.8 59 65.6 63.5 61.6" stroke="${INK}" stroke-width="5.6" fill="none" stroke-linecap="round"/><path d="M36.5 61.6 C41 65.6 45.5 66.8 50 66.8 C54.5 66.8 59 65.6 63.5 61.6" stroke="${trim}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (ahHas(a, 'tagcollar')) s += `<path d="M35.5 61 C41 66.5 59 66.5 64.5 61 L65 64.5 C59 70 41 70 35 64.5 Z" fill="${trim}" ${ahSt(1.8)}/><circle cx="50" cy="71.4" r="4" fill="url(#${uid}g)" ${ahSt(1.6)}/><path d="M48.6 70.6 C49 70 51 70 51.4 70.6 C51.4 72 50 72.8 50 72.8 C50 72.8 48.6 72 48.6 70.6 Z" fill="${AH_GOLD_DARK}"/>`;
  if (ahHas(a, 'neckerchief')) s += `<path d="M37 62 C42 66 58 66 63 62 L50 78 Z" fill="${trim}" ${ahSt(2)}/><path d="M40.5 64.8 C45 67.2 55 67.2 59.5 64.8" stroke="#fff" stroke-width="1.4" fill="none"/><circle cx="50" cy="67" r="2.8" fill="${trim}" ${ahSt(1.4)}/>`;
  if (ahHas(a, 'scarf')) s += `<path d="M35.5 60.5 C41 66.5 59 66.5 64.5 60.5 L65.5 65 C59 71.5 41 71.5 34.5 65 Z" fill="${trim}" ${ahSt(2)}/><path d="M60 66 C66 69 72 70 80 68 C78 72.5 74.5 75 70 75.6 C73 77.5 76 78 79 77.6 C75 82 68 82 62 77 Z" fill="${trim}" ${ahSt(1.8)}/><path d="M40 66 L42 64 M46 67.6 L48 65.4 M52 67.6 L54 65.4 M58 66 L60 63.8" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round"/>`;
  // cape clasps
  s += ahSym(`<circle cx="33.5" cy="64.5" r="3.4" fill="url(#${uid}g)" ${ahSt(1.6)}/>`);
  return s;
}

// Full animal-hero bust in a 100x100 box (or just the head with
// opts.headOnly). opts.backdrop adds the glowing lesson-color backdrop for
// framed badges/portraits. Animated by CSS (.ah-* in css/styles.css):
// blink, glance, gentle bob, cape sway, ear twitch, wave. Calm Mode /
// reduced motion keep it still (blink only).
function animalHeroSvg(topicId, theme, emblemInner, opts){
  const a = ANIMAL_HEROES[topicId];
  const headOnly = !!(opts && opts.headOnly);
  if (!a) return '';
  const accent = `var(--${theme}, #4b79bd)`;
  const tm = ahTiming(topicId);
  const style = `style="--ah-d:${tm.d1}s;--ah-d2:${tm.d2}s"`;
  if (headOnly){
    return `<svg class="ah ah--head" viewBox="10 -2 80 78" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" ${style}>`
      + ahDefs(tm.uid) + ahHeadSvg(a, accent, tm.uid) + '</svg>';
  }
  const shoulderR = [66.5, 68.5], handR = [70.5, 91];
  const handL = [31.5, 77];
  return `<svg class="ah" viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" ${style}>`
    + ahDefs(tm.uid, opts && opts.backdrop ? accent : null)
    + `<g class="ah-bob">`
    + ahBustSvg(a, accent, tm.uid, emblemInner, !!(opts && opts.backdrop))
    // thumbs-up arm (elbow tucked low), then the waving arm
    + `<g class="ah-arm-l">${ahLimb(30, 69, 23.5, 87, 8.6, accent)}${ahLimb(23.5, 87, handL[0] - 1, handL[1] + 5, 8, accent)}${ahThumbsUp(handL[0], handL[1], a.trim, tm.uid, ahHas(a, 'watch'))}</g>`
    + `<g class="ah-wave">${ahLimb(shoulderR[0], shoulderR[1], 78, 82, 8.6, accent)}${ahLimb(78, 82, handR[0], handR[1], 8, accent)}${ahGlove(handR[0] - 0.6, handR[1] + 0.6, 78, 82, a.trim, tm.uid)}</g>`
    + `<g transform="translate(0 -2) rotate(-4 50 62)">${ahHeadSvg(a, accent, tm.uid)}</g>`
    + `</g></svg>`;
}

function animalNameFor(topicId, lang){
  const a = ANIMAL_HEROES[topicId];
  if (!a) return '';
  return (ANIMAL_NAMES[lang] || ANIMAL_NAMES.en)[a.animal] || a.animal;
}

// Full-body flying pose: stretched out, fist forward, cape flapping behind.
// Faces right. Same costume as the bust: lesson-color suit with trim stripe,
// cape with its lining, utility belt, beveled chest badge with the hero's
// emblem, white gloves with colored cuffs, boots in the trim color. The
// cape is a separate group so CSS can flutter it.
function flyingHeroSvg(topicId, theme){
  const a = ANIMAL_HEROES[topicId];
  if (!a) return '';
  const accent = `var(--${theme}, #4b79bd)`;
  const trim = a.trim || '#ffd23f';
  const tm = ahTiming(topicId + 'fly');
  const u = tm.uid;
  const hero = typeof heroFor === 'function' ? heroFor(topicId) : null;
  const emblem = hero && typeof heroEmblemInner === 'function' ? heroEmblemInner(hero.emblem) : '';
  const big = (x, y, k, svg) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${svg}</g>`;
  const cape = 'M152 48 C124 38 84 28 24 18 Q40 31 22 43 Q42 54 20 64 Q40 75 24 89 C80 89 122 84 152 78 Z';
  const boot = (x, y) => `<path d="M${x} ${y - 8} C${x + 8} ${y - 11} ${x + 18} ${y - 8} ${x + 18} ${y} C${x + 18} ${y + 8} ${x + 8} ${y + 10} ${x} ${y + 7} C${x - 6} ${y + 5} ${x - 6} ${y - 6} ${x} ${y - 8} Z" fill="${trim}" ${ahSt(2.4)}/>`
    + `<path d="M${x - 2.6} ${y - 5} C${x - 4.6} ${y - 1} ${x - 4.6} ${y + 2} ${x - 2.6} ${y + 5.4}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + `<path d="M${x + 15} ${y - 6} C${x + 16.4} ${y - 3} ${x + 16.6} ${y + 3} ${x + 15} ${y + 6}" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`
    + ahShine(x + 5, y - 4.4, 4, 1.8, -8, 0.55);
  return `<svg class="fly-hero ah" viewBox="0 0 240 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" style="--ah-d:${tm.d1}s;--ah-d2:${tm.d2}s">`
    + ahDefs(u)
    // cape (behind everything), lining along the lower edge
    + `<g class="fly-hero__cape"><path d="${cape}" fill="${accent}" ${ahSt(2.6)}/><path d="${cape}" fill="${AH_SHADE}" opacity=".3"/>`
    + `<path d="M24 89 C80 89 122 84 152 78 L152 71 C122 77 86 81.5 37 82.6 Q31 86 24 89 Z" fill="${trim}" ${ahSt(2)}/>`
    + `<path d="M150 55 C120 49 86 43 50 38" stroke="#fff" stroke-opacity=".3" stroke-width="3.2" stroke-linecap="round"/>`
    + `<path d="M146 64 C116 62 84 60 46 58" stroke="${AH_SHADE}" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/></g>`
    // legs + boots
    + ahLimb(108, 60, 66, 55, 17, accent) + ahLimb(108, 73, 68, 78, 17, accent)
    + `<path d="M76 49 L76 62 M78 72 L78 85" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path d="M76 49 L76 62 M78 72 L78 85" stroke="${trim}" stroke-width="2.2" stroke-linecap="round"/>`
    + boot(50, 55) + boot(52, 78)
    // back arm + glove
    + ahLimb(150, 74, 130, 92, 13, accent)
    + big(127, 95, 1.35, ahGlove(127, 95, 150, 74, trim, u))
    // body: suit, shade, trim stripe, belt + buckle, badge
    + `<rect x="94" y="46" width="74" height="36" rx="18" fill="${accent}" ${ahSt(2.6)}/>`
    + `<path d="M96 66 C110 76 150 78 166 68 L166 70 C162 78 154 82 150 82 L112 82 C104 82 98 76 96 70 Z" fill="${AH_SHADE}" opacity=".22"/>`
    + `<path d="M104 52 C120 49 140 49 158 52" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="M120 47 C126 57 126 71 120 81" stroke="${INK}" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M120 47 C126 57 126 71 120 81" stroke="${trim}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    + `<rect x="104" y="46.5" width="10" height="35" fill="${AH_BELT}" ${ahSt(1.8)}/>`
    + `<rect x="102.6" y="57.5" width="12.8" height="13" rx="2.6" fill="url(#${u}g)" ${ahSt(1.8)}/><rect x="105.8" y="60.6" width="6.4" height="6.8" rx="1.2" fill="${accent}" stroke="${AH_GOLD_DARK}" stroke-width="1"/>`
    + ahBadgeSvg(143, 63, 11, accent, emblem, u)
    // head
    + animalHeroSvg(topicId, theme, '', { headOnly: true })
        .replace(' width="100%" height="100%"', ' x="148" y="-2" width="72" height="70"')
    // front arm under the chin, glove fist forward
    + ahLimb(160, 70, 216, 66, 14, accent)
    + big(222, 66, 1.6, ahGlove(222, 66, 160, 70, trim, u))
    + '</svg>';
}

// Lesson loading screen: the lesson's own hero flies in over a glowing
// light burst while two other caped animal heroes zoom past behind it.
function heroLoadingSceneHtml(topicId, theme, lang){
  const hero = typeof heroFor === 'function' ? heroFor(topicId) : null;
  const emblem = id => (typeof heroEmblemInner === 'function' && heroFor(id)) ? heroEmblemInner(heroFor(id).emblem) : '';
  const others = (typeof TOPICS !== 'undefined' ? TOPICS : []).filter(m => m.id !== topicId && ANIMAL_HEROES[m.id]);
  const pick = () => others.splice(Math.floor(Math.random() * others.length), 1)[0];
  const f1 = pick(), f2 = pick();
  const data = hero ? (hero[lang] || hero.en) : null;
  const line = data ? t('loading_hero_line', { name: data.name, animal: animalNameFor(topicId, lang) }) : '';
  const tip = heroTipFor(topicId, lang);
  return `
    <div class="hero-load" aria-hidden="true">
      <div class="hero-load__burst"></div>
      <span class="hero-load__spark s1">✦</span><span class="hero-load__spark s2">★</span><span class="hero-load__spark s3">✦</span><span class="hero-load__spark s4">★</span>
      ${f1 ? `<div class="hero-load__fly f1">${flyingHeroSvg(f1.id, f1.theme)}</div>` : ''}
      ${f2 ? `<div class="hero-load__fly f2">${flyingHeroSvg(f2.id, f2.theme)}</div>` : ''}
      <div class="hero-load__main"><div class="hero-load__trail"></div>${flyingHeroSvg(topicId, theme)}</div>
    </div>
    ${line ? `<p class="hero-load__line">${escapeHtml(line)}</p>` : ''}
    ${tip ? `<p class="safety-tip"><span class="safety-tip__label">${escapeHtml(t('hero_tip_label'))}</span> ${escapeHtml(tip)}</p>` : ''}`;
}

/* ---- Hero safety tips ----
   Two short, positive tips per lesson (EN + ES), said by that lesson's
   animal hero on page transitions and the lesson loading screen. */
const HERO_TIPS = {
  'stranger-safety': {
    en: ['If someone you don\'t know asks you to go with them, say "No!" and tell a grown-up you trust.', 'Stay where your grown-up can see you.'],
    es: ['Si alguien que no conoces te pide que vayas con él, di "¡No!" y avisa a un adulto de confianza.', 'Quédate donde tu adulto pueda verte.'] },
  'street-safety': {
    en: ['Stop, look left, look right, and look left again before you cross.', 'Hold a grown-up\'s hand when you cross the street.'],
    es: ['Para, mira a la izquierda, a la derecha y otra vez a la izquierda antes de cruzar.', 'Toma la mano de un adulto para cruzar la calle.'] },
  'lost-safety': {
    en: ['If you get lost, stay where you are and look for a worker or a mom with kids.', 'Learn your grown-up\'s phone number by heart.'],
    es: ['Si te pierdes, quédate donde estás y busca a un trabajador o a una mamá con niños.', 'Apréndete de memoria el número de teléfono de tu adulto.'] },
  'emergency-safety': {
    en: ['In an emergency, call 911 and stay on the phone.', 'Say your name and where you are, slowly and clearly.'],
    es: ['En una emergencia, llama al 911 y no cuelgues.', 'Di tu nombre y dónde estás, despacio y claro.'] },
  'fire-safety': {
    en: ['If there\'s smoke, get low and go out fast.', 'If your clothes catch fire: stop, drop, and roll!'],
    es: ['Si hay humo, agáchate y sal rápido.', 'Si tu ropa se prende: ¡detente, tírate al suelo y rueda!'] },
  'earthquake-safety': {
    en: ['When the ground shakes: drop, cover, and hold on!', 'Stay away from windows during an earthquake.'],
    es: ['Cuando la tierra tiembla: ¡agáchate, cúbrete y sujétate!', 'Aléjate de las ventanas durante un terremoto.'] },
  'rainyweather-safety': {
    en: ['Never walk or play in flood water.', 'When thunder roars, go indoors!'],
    es: ['Nunca camines ni juegues en agua de inundación.', '¡Si truena, ve adentro!'] },
  'selfadvocacy-safety': {
    en: ['It\'s okay to say "I need help" or "I need a break."', 'Your feelings and needs matter. Use your words, card, or device to share them.'],
    es: ['Está bien decir "necesito ayuda" o "necesito un descanso".', 'Lo que sientes y necesitas importa. Usa tus palabras, tarjeta o dispositivo para decirlo.'] },
  'body-boundaries-safety': {
    en: ['Your body belongs to you. You can say "No, stop!"', 'Parts covered by a swimsuit are private.'],
    es: ['Tu cuerpo es tuyo. Puedes decir "¡No, para!"', 'Las partes que cubre el traje de baño son privadas.'] },
  'secrets-safety': {
    en: ['Surprises are fun to keep. Secrets that make you feel bad should be told.', 'No grown-up should ask you to keep a secret from your family.'],
    es: ['Las sorpresas son divertidas de guardar. Los secretos que te hacen sentir mal se deben contar.', 'Ningún adulto debe pedirte que guardes un secreto de tu familia.'] },
  'reporting-safety': {
    en: ['If something feels wrong, tell a trusted grown-up. Keep telling until someone helps.', 'Telling to get help is not tattling.'],
    es: ['Si algo se siente mal, díselo a un adulto de confianza. Sigue diciéndolo hasta que alguien te ayude.', 'Contar algo para pedir ayuda no es chismear.'] },
  'awareness-safety': {
    en: ['Look up from your screen when you walk.', 'Notice the exits when you go into a new place.'],
    es: ['Levanta la vista de la pantalla cuando camines.', 'Fíjate dónde están las salidas al entrar a un lugar nuevo.'] },
  'plan-safety': {
    en: ['Make a meeting spot with your family, in case you get separated.', 'Practice your safety plan, just like a fire drill.'],
    es: ['Elige con tu familia un lugar para reunirse por si se separan.', 'Practica tu plan de seguridad, igual que un simulacro de incendio.'] },
  'privacy-safety': {
    en: ['Keep your address and passwords private.', 'Ask a grown-up before you share a photo.'],
    es: ['Mantén en privado tu dirección y tus contraseñas.', 'Pregunta a un adulto antes de compartir una foto.'] },
  'bullying-safety': {
    en: ['If someone is mean to you, walk away and tell a grown-up.', 'Be a buddy: stand next to someone who is being picked on.'],
    es: ['Si alguien es malo contigo, aléjate y díselo a un adulto.', 'Sé un amigo: ponte al lado de alguien a quien están molestando.'] },
  'online-safety': {
    en: ['Never meet up with someone you only know online.', 'If something online feels weird, close it and tell a grown-up.'],
    es: ['Nunca te reúnas con alguien que solo conoces por internet.', 'Si algo en internet se siente raro, ciérralo y díselo a un adulto.'] },
  'cyberbullying-safety': {
    en: ['Don\'t answer mean messages. Save them and show a grown-up.', 'You can block someone who is being mean online.'],
    es: ['No contestes mensajes groseros. Guárdalos y muéstraselos a un adulto.', 'Puedes bloquear a alguien que es grosero por internet.'] },
  'citizenship-safety': {
    en: ['Police officers, firefighters, and doctors are community helpers.', 'Treat others the way you want to be treated.'],
    es: ['Los policías, bomberos y médicos son ayudantes de la comunidad.', 'Trata a los demás como quieres que te traten.'] },
  'rights-safety': {
    en: ['You have the right to be safe and to ask for help.', 'You can ask for the supports you need at school.'],
    es: ['Tienes derecho a estar seguro y a pedir ayuda.', 'Puedes pedir los apoyos que necesitas en la escuela.'] },
  'water-safety': {
    en: ['Always swim with a grown-up watching.', 'Wear a life jacket on boats and near deep water.'],
    es: ['Nada siempre con un adulto mirando.', 'Usa chaleco salvavidas en botes y cerca del agua profunda.'] },
  'home-safety': {
    en: ['Medicine is only for when a grown-up gives it to you.', 'Don\'t open the door to someone you don\'t know.'],
    es: ['La medicina solo es para cuando un adulto te la da.', 'No abras la puerta a alguien que no conoces.'] },
  'bike-safety': {
    en: ['Always wear your helmet when you ride.', 'Ride on the right side, the same way as cars.'],
    es: ['Usa siempre tu casco cuando montes.', 'Anda por la derecha, en la misma dirección que los carros.'] },
  'peer-pressure-safety': {
    en: ['A real friend won\'t make you do something unsafe.', 'You can say "No thanks" and walk away.'],
    es: ['Un verdadero amigo no te obliga a hacer algo peligroso.', 'Puedes decir "No, gracias" y alejarte.'] },
  'elopement-safety': {
    en: ['Before you go anywhere, tell a grown-up where you\'re going.', 'If you feel like running, stop and squeeze your hands instead.'],
    es: ['Antes de ir a cualquier lugar, dile a un adulto adónde vas.', 'Si sientes ganas de correr, para y aprieta tus manos.'] },
  'safehelper-safety': {
    en: ['Safe helpers wear a uniform or name tag, like store workers and police.', 'If you need help, look for a worker at a counter.'],
    es: ['Los ayudantes seguros llevan uniforme o gafete, como los empleados y la policía.', 'Si necesitas ayuda, busca a un trabajador en un mostrador.'] },
  'medical-safety': {
    en: ['Tell a grown-up when something hurts.', 'Doctors and nurses help you get better. It\'s okay to ask questions.'],
    es: ['Dile a un adulto cuando algo te duela.', 'Los médicos y enfermeros te ayudan a mejorar. Está bien hacer preguntas.'] },
  'selfregulation-safety': {
    en: ['Feeling big feelings? Smell the flower, blow out the candle.', 'It\'s okay to ask for a quiet space.'],
    es: ['¿Sientes emociones grandes? Huele la flor, sopla la vela.', 'Está bien pedir un lugar tranquilo.'] },
  'firstaid-safety': {
    en: ['For a small cut: wash it, then put on a bandage.', 'If someone is badly hurt, get a grown-up or call 911.'],
    es: ['Para una cortada pequeña: lávala y ponle una curita.', 'Si alguien está muy lastimado, busca a un adulto o llama al 911.'] },
  'seizure-safety': {
    en: ['If someone has a seizure, move things away and don\'t hold them down.', 'Stay with them and get a grown-up.'],
    es: ['Si alguien tiene una convulsión, aparta las cosas y no lo sujetes.', 'Quédate con la persona y busca a un adulto.'] },
  'money-safety': {
    en: ['Keep your money in a safe place, like a wallet or pocket.', 'Never give your bank card or PIN to someone online.'],
    es: ['Guarda tu dinero en un lugar seguro, como una cartera o un bolsillo.', 'Nunca des tu tarjeta del banco ni tu PIN a alguien por internet.'] },
  'dating-safety': {
    en: ['A good friend listens when you say no.', 'Tell a trusted grown-up where you\'re going and who you\'re with.'],
    es: ['Un buen amigo te escucha cuando dices que no.', 'Dile a un adulto de confianza adónde vas y con quién.'] },
};

function heroTipFor(topicId, lang){
  const set = HERO_TIPS[topicId];
  if (!set) return '';
  const list = set[lang] || set.en;
  return list[Math.floor(Math.random() * list.length)];
}
