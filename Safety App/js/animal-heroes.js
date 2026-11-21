/* ==========================================================================
   Safety Superheroes — animal superhero mascots (one per lesson)
   Each lesson's hero is drawn as a masked, caped animal: same house style
   for all 31 (round head, hero mask, cape + suit in the lesson's theme
   color, the hero's emblem on the chest), with per-animal ears, face,
   colors and markings. Pure inline SVG -- crisp at any size, no image files.
   Used by js/heroes.js (lesson logos + hero portraits) and the lesson
   loading screen in js/page-topic.js.
   ========================================================================== */

// fur: main color · face: muzzle/face color · ears: ear style · snout: nose style
// marks: extra markings · markColor: color of markings
const ANIMAL_HEROES = {
  'stranger-safety':       { animal: 'owl',       fur: '#9c6b45', face: '#f3dcc0', ears: 'tufts',  snout: 'beak',   beak: '#f2a93b' },
  'street-safety':         { animal: 'zebra',     fur: '#f7f7f7', face: '#3a3a3a', ears: 'pointy', snout: 'muzzle', marks: 'stripes', markColor: '#2b2b2b', earInner: '#d9d9d9' },
  'lost-safety':           { animal: 'puppy',     fur: '#d9a066', face: '#f6e1c5', ears: 'floppy', snout: 'muzzle', earColor: '#8a5a34' },
  'emergency-safety':      { animal: 'monkey',    fur: '#8b5a3c', face: '#f0c9a0', ears: 'side',   snout: 'muzzle' },
  'fire-safety':           { animal: 'dalmatian', fur: '#ffffff', face: '#ffffff', ears: 'floppy', snout: 'muzzle', marks: 'spots', markColor: '#2b2b2b', earColor: '#2b2b2b' },
  'earthquake-safety':     { animal: 'turtle',    fur: '#7cc47f', face: '#a8dba9', ears: 'none',   snout: 'nose', marks: 'shell', markColor: '#4f9a52' },
  'rainyweather-safety':   { animal: 'duck',      fur: '#ffd84d', face: '#ffe88a', ears: 'none',   snout: 'bill',   beak: '#f28c28', marks: 'tuft', markColor: '#ffd84d' },
  'selfadvocacy-safety':   { animal: 'lion',      fur: '#f0b14a', face: '#f8d58c', ears: 'round',  snout: 'muzzle', marks: 'mane', markColor: '#c9772a' },
  'body-boundaries-safety':{ animal: 'hedgehog',  fur: '#a57a52', face: '#f1d7b5', ears: 'small',  snout: 'nose',   marks: 'spikes', markColor: '#6d4a2c' },
  'secrets-safety':        { animal: 'parrot',    fur: '#3dbb63', face: '#a8e8b8', ears: 'none',   snout: 'beak',   beak: '#ffb43b', marks: 'crest', markColor: '#e5484d' },
  'reporting-safety':      { animal: 'meerkat',   fur: '#c9a06e', face: '#ecd3ad', ears: 'small',  snout: 'muzzle', marks: 'eyepatch', markColor: '#7a5a3a' },
  'awareness-safety':      { animal: 'cat',       fur: '#9aa3ad', face: '#e8ecf0', ears: 'pointy', snout: 'nose',   marks: 'whiskers', markColor: '#5b636b', earInner: '#f7b6c8' },
  'plan-safety':           { animal: 'beaver',    fur: '#8f5e3b', face: '#d8b08a', ears: 'small',  snout: 'teeth' },
  'privacy-safety':        { animal: 'raccoon',   fur: '#8d949b', face: '#e6e9ec', ears: 'pointy', snout: 'nose',   marks: 'raccoon', markColor: '#3d4247', earInner: '#3d4247' },
  'bullying-safety':       { animal: 'bear',      fur: '#a0683f', face: '#e2bb92', ears: 'round',  snout: 'muzzle' },
  'online-safety':         { animal: 'penguin',   fur: '#2f3542', face: '#ffffff', ears: 'none',   snout: 'beak',   beak: '#f7a531', marks: 'penguin' },
  'cyberbullying-safety':  { animal: 'koala',     fur: '#a9b2bc', face: '#dfe4ea', ears: 'fluffy', snout: 'bignose' },
  'citizenship-safety':    { animal: 'bunny',     fur: '#f4f1ee', face: '#ffffff', ears: 'long',   snout: 'nose',   earInner: '#f7b6c8' },
  'rights-safety':         { animal: 'tiger',     fur: '#f3923a', face: '#fff1df', ears: 'round',  snout: 'muzzle', marks: 'tigerstripes', markColor: '#2b2b2b' },
  'water-safety':          { animal: 'otter',     fur: '#8a5c3a', face: '#e2c29e', ears: 'small',  snout: 'muzzle', marks: 'whiskers', markColor: '#5a3b24' },
  'home-safety':           { animal: 'mouse',     fur: '#b8bec6', face: '#e9ecef', ears: 'mouse',  snout: 'nose',   earInner: '#f7b6c8' },
  'bike-safety':           { animal: 'fox',       fur: '#f07c2c', face: '#ffffff', ears: 'pointy', snout: 'muzzle', earInner: '#2b2b2b' },
  'peer-pressure-safety':  { animal: 'panda',     fur: '#ffffff', face: '#ffffff', ears: 'round',  snout: 'nose',   marks: 'panda', markColor: '#2b2b2b', earColor: '#2b2b2b' },
  'elopement-safety':      { animal: 'sheep',     fur: '#5b4a40', face: '#f1e6da', ears: 'side',   snout: 'nose',   marks: 'wool', markColor: '#ffffff' },
  'safehelper-safety':     { animal: 'hawk',      fur: '#8a5a33', face: '#ffffff', ears: 'none',   snout: 'beak',   beak: '#f2b13b', marks: 'brow', markColor: '#5a3a20' },
  'medical-safety':        { animal: 'piglet',    fur: '#f7b2c4', face: '#ffd0dc', ears: 'pointy', snout: 'pig',    earInner: '#ef8fab' },
  'selfregulation-safety': { animal: 'sloth',     fur: '#a68a6d', face: '#e9d8c3', ears: 'none',   snout: 'nose',   marks: 'eyepatch', markColor: '#6b543e' },
  'firstaid-safety':       { animal: 'frog',      fur: '#6ccb5f', face: '#b7ecaa', ears: 'frog',   snout: 'smile' },
  'seizure-safety':        { animal: 'elephant',  fur: '#9fa9b8', face: '#c3cbd6', ears: 'elephant', snout: 'trunk' },
  'money-safety':          { animal: 'squirrel',  fur: '#c0703a', face: '#f2d2b0', ears: 'tufted', snout: 'nose' },
  'dating-safety':         { animal: 'deer',      fur: '#b47a46', face: '#f2dcc0', ears: 'pointy', snout: 'nose',   marks: 'antlers', markColor: '#7a5230', earInner: '#f2dcc0' },
};

const ANIMAL_NAMES = {
  en: { owl: 'owl', zebra: 'zebra', puppy: 'puppy', monkey: 'monkey', dalmatian: 'dalmatian', turtle: 'turtle', duck: 'duck', lion: 'lion', hedgehog: 'hedgehog', parrot: 'parrot', meerkat: 'meerkat', cat: 'cat', beaver: 'beaver', raccoon: 'raccoon', bear: 'bear', penguin: 'penguin', koala: 'koala', bunny: 'bunny', tiger: 'tiger', otter: 'otter', mouse: 'mouse', fox: 'fox', panda: 'panda', sheep: 'sheep', hawk: 'hawk', piglet: 'piglet', sloth: 'sloth', frog: 'frog', elephant: 'elephant', squirrel: 'squirrel', deer: 'deer' },
  es: { owl: 'búho', zebra: 'cebra', puppy: 'perrito', monkey: 'mono', dalmatian: 'dálmata', turtle: 'tortuga', duck: 'pato', lion: 'león', hedgehog: 'erizo', parrot: 'loro', meerkat: 'suricata', cat: 'gato', beaver: 'castor', raccoon: 'mapache', bear: 'oso', penguin: 'pingüino', koala: 'koala', bunny: 'conejito', tiger: 'tigre', otter: 'nutria', mouse: 'ratón', fox: 'zorro', panda: 'panda', sheep: 'oveja', hawk: 'halcón', piglet: 'cerdito', sloth: 'perezoso', frog: 'rana', elephant: 'elefante', squirrel: 'ardilla', deer: 'ciervo' },
};

const INK = '#2b2b2b';

function animalEarsSvg(a){
  const c = a.earColor || a.fur;
  const inner = a.earInner || a.face;
  const st = `stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"`;
  switch (a.ears){
    case 'round': return `<circle cx="28" cy="22" r="9" fill="${c}" ${st}/><circle cx="72" cy="22" r="9" fill="${c}" ${st}/><circle cx="28" cy="22" r="4.2" fill="${inner}"/><circle cx="72" cy="22" r="4.2" fill="${inner}"/>`;
    case 'small': return `<circle cx="29" cy="24" r="6" fill="${c}" ${st}/><circle cx="71" cy="24" r="6" fill="${c}" ${st}/>`;
    case 'pointy': return `<path d="M24 32 L28 8 L42 22 Z" fill="${c}" ${st}/><path d="M76 32 L72 8 L58 22 Z" fill="${c}" ${st}/><path d="M28.5 26 L30 15 L37 22 Z" fill="${inner}"/><path d="M71.5 26 L70 15 L63 22 Z" fill="${inner}"/>`;
    case 'tufted': return `<path d="M24 32 L26 6 L42 22 Z" fill="${c}" ${st}/><path d="M76 32 L74 6 L58 22 Z" fill="${c}" ${st}/><path d="M26 6 l-3 -4 M26 6 l2 -5 M74 6 l3 -4 M74 6 l-2 -5" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
    case 'floppy': return `<path d="M30 22 C18 20 12 34 16 50 C20 54 26 50 28 44 Z" fill="${c}" ${st}/><path d="M70 22 C82 20 88 34 84 50 C80 54 74 50 72 44 Z" fill="${c}" ${st}/>`;
    case 'long': return `<path d="M34 26 C28 8 30 -2 37 0 C44 2 44 16 42 26 Z" fill="${c}" ${st}/><path d="M66 26 C72 8 70 -2 63 0 C56 2 56 16 58 26 Z" fill="${c}" ${st}/><path d="M36 22 C33 10 34 5 37 5 C40 6 40 14 39.5 22 Z" fill="${inner}"/><path d="M64 22 C67 10 66 5 63 5 C60 6 60 14 60.5 22 Z" fill="${inner}"/>`;
    case 'mouse': return `<circle cx="25" cy="22" r="13" fill="${c}" ${st}/><circle cx="75" cy="22" r="13" fill="${c}" ${st}/><circle cx="25" cy="22" r="7" fill="${inner}"/><circle cx="75" cy="22" r="7" fill="${inner}"/>`;
    case 'fluffy': return `<circle cx="24" cy="26" r="13" fill="${c}" ${st}/><circle cx="76" cy="26" r="13" fill="${c}" ${st}/><circle cx="24" cy="26" r="6.5" fill="#f4f6f8"/><circle cx="76" cy="26" r="6.5" fill="#f4f6f8"/>`;
    case 'elephant': return `<path d="M30 30 C8 18 2 46 14 60 C22 66 30 56 32 48 Z" fill="${c}" ${st}/><path d="M70 30 C92 18 98 46 86 60 C78 66 70 56 68 48 Z" fill="${c}" ${st}/><path d="M28 36 C16 30 12 46 18 54" stroke="#f3c6d1" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M72 36 C84 30 88 46 82 54" stroke="#f3c6d1" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'side': return `<ellipse cx="22" cy="42" rx="8" ry="6" fill="${a.face}" ${st}/><ellipse cx="78" cy="42" rx="8" ry="6" fill="${a.face}" ${st}/>`;
    case 'tufts': return `<path d="M28 28 L22 8 L40 20 Z" fill="${c}" ${st}/><path d="M72 28 L78 8 L60 20 Z" fill="${c}" ${st}/>`;
    case 'frog': return `<circle cx="34" cy="20" r="10" fill="${c}" ${st}/><circle cx="66" cy="20" r="10" fill="${c}" ${st}/>`;
    default: return '';
  }
}

function animalBackMarksSvg(a){
  const m = a.markColor;
  switch (a.marks){
    case 'mane': return `<circle cx="50" cy="40" r="33" fill="${m}" stroke="${INK}" stroke-width="2.4"/>`
      + [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(d => `<circle cx="${50 + 31 * Math.cos(d * Math.PI / 180)}" cy="${40 + 31 * Math.sin(d * Math.PI / 180)}" r="8" fill="${m}"/>`).join('');
    case 'spikes': return [200, 225, 250, 275, 300, 325, 350, 15, 165, 140].map(d => {
      const r = d * Math.PI / 180, x = 50 + 27 * Math.cos(r), y = 40 + 27 * Math.sin(r), x2 = 50 + 40 * Math.cos(r), y2 = 40 + 40 * Math.sin(r);
      const px = 7 * Math.cos(r + Math.PI / 2), py = 7 * Math.sin(r + Math.PI / 2);
      return `<path d="M${x - px} ${y - py} L${x2} ${y2} L${x + px} ${y + py} Z" fill="${m}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    }).join('');
    case 'wool': return [0, 40, 80, 120, 160, 200, 240, 280, 320].map(d => `<circle cx="${50 + 24 * Math.cos(d * Math.PI / 180)}" cy="${36 + 22 * Math.sin(d * Math.PI / 180)}" r="11" fill="${m}" stroke="${INK}" stroke-width="2"/>`).join('');
    case 'antlers': return `<path d="M36 18 C32 8 26 6 22 2 M30 9 C26 10 23 13 21 16 M64 18 C68 8 74 6 78 2 M70 9 C74 10 77 13 79 16" stroke="${m}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'crest': return `<path d="M44 16 C42 6 46 2 50 0 C50 6 54 4 58 2 C58 8 56 12 54 16 Z" fill="${m}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    case 'tuft': return `<path d="M48 16 C46 8 50 5 54 6 C51 9 52 12 53 16 Z" fill="${m}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    default: return '';
  }
}

function animalFaceMarksSvg(a){
  const m = a.markColor;
  switch (a.marks){
    case 'stripes': return `<path d="M50 14 L50 24 M40 16 L44 25 M60 16 L56 25 M27 34 L35 36 M73 34 L65 36 M26 44 L33 44 M74 44 L67 44" stroke="${m}" stroke-width="3.5" stroke-linecap="round"/>`;
    case 'tigerstripes': return `<path d="M50 15 L50 23 M42 16 L45 22 M58 16 L55 22 M26 36 L34 38 M74 36 L66 38 M27 46 L34 45 M73 46 L66 45" stroke="${m}" stroke-width="3" stroke-linecap="round"/>`;
    case 'spots': return `<circle cx="34" cy="24" r="3.5" fill="${m}"/><circle cx="64" cy="20" r="2.8" fill="${m}"/><circle cx="71" cy="50" r="3" fill="${m}"/><circle cx="27" cy="50" r="2.5" fill="${m}"/>`;
    case 'shell': return `<path d="M34 18 L42 14 L50 18 L58 14 L66 18" stroke="${m}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'whiskers': return `<path d="M30 52 L18 50 M30 55 L18 57 M70 52 L82 50 M70 55 L82 57" stroke="${m}" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'panda': return `<ellipse cx="38" cy="40" rx="9" ry="10" fill="${m}" transform="rotate(-20 38 40)"/><ellipse cx="62" cy="40" rx="9" ry="10" fill="${m}" transform="rotate(20 62 40)"/>`;
    case 'eyepatch': return `<ellipse cx="38" cy="41" rx="9" ry="7" fill="${m}"/><ellipse cx="62" cy="41" rx="9" ry="7" fill="${m}"/>`;
    case 'raccoon': return `<path d="M22 42 C30 32 44 34 50 42 C56 34 70 32 78 42 C70 50 58 50 50 46 C42 50 30 50 22 42 Z" fill="${m}"/>`;
    case 'penguin': return `<path d="M50 20 C36 20 28 30 30 44 C32 56 42 64 50 64 C58 64 68 56 70 44 C72 30 64 20 50 20 Z" fill="#ffffff"/>`;
    case 'brow': return `<path d="M28 33 L44 37 M72 33 L56 37" stroke="${m}" stroke-width="4" stroke-linecap="round"/>`;
    default: return '';
  }
}

function animalSnoutSvg(a){
  switch (a.snout){
    case 'beak': return `<path d="M44 49 L56 49 L50 60 Z" fill="${a.beak}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    case 'bill': return `<ellipse cx="50" cy="53" rx="11" ry="5.5" fill="${a.beak}" stroke="${INK}" stroke-width="2"/><path d="M41 53 L59 53" stroke="${INK}" stroke-width="1.4"/>`;
    case 'muzzle': return `<ellipse cx="50" cy="54" rx="12" ry="9" fill="${a.face}" stroke="${INK}" stroke-width="1.6"/><ellipse cx="50" cy="50.5" rx="4" ry="3" fill="${INK}"/><path d="M45 57 C48 60 52 60 55 57" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    case 'teeth': return `<ellipse cx="50" cy="53" rx="11" ry="8" fill="${a.face}" stroke="${INK}" stroke-width="1.6"/><ellipse cx="50" cy="49.5" rx="4" ry="2.8" fill="${INK}"/><rect x="46.5" y="55" width="7" height="6" rx="1" fill="#ffffff" stroke="${INK}" stroke-width="1.4"/><path d="M50 55 L50 61" stroke="${INK}" stroke-width="1"/>`;
    case 'bignose': return `<ellipse cx="50" cy="51" rx="6.5" ry="8" fill="#3d4247"/><path d="M45 61 C48 63 52 63 55 61" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    case 'pig': return `<ellipse cx="50" cy="54" rx="9" ry="6.5" fill="#ff9fb7" stroke="${INK}" stroke-width="1.8"/><ellipse cx="46.5" cy="54" rx="1.6" ry="2.2" fill="${INK}"/><ellipse cx="53.5" cy="54" rx="1.6" ry="2.2" fill="${INK}"/>`;
    case 'trunk': return `<path d="M44 48 C44 58 46 66 52 70 C56 72 60 70 60 66 C55 66 53 60 56 48 Z" fill="${a.fur}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    case 'smile': return `<path d="M34 54 C42 62 58 62 66 54" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    default: return `<ellipse cx="50" cy="51" rx="3.6" ry="2.8" fill="${INK}"/><path d="M45 55 C48 58 52 58 55 55" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  }
}

// The hero mask across the eyes (theme color), with eye holes + pupils.
function animalMaskSvg(themeVar, frog){
  const y = frog ? 22 : 40;
  if (frog){
    return `<path d="M22 22 C24 14 44 14 46 22 C44 28 24 28 22 22 Z M54 22 C56 14 76 14 78 22 C76 28 56 28 54 22 Z" fill="${themeVar}" stroke="${INK}" stroke-width="2"/>`
      + `<ellipse cx="34" cy="21.5" rx="4" ry="3.6" fill="#fff"/><ellipse cx="66" cy="21.5" rx="4" ry="3.6" fill="#fff"/><circle cx="35" cy="22" r="2" fill="${INK}"/><circle cx="67" cy="22" r="2" fill="${INK}"/>`;
  }
  return `<path d="M24 ${y} C26 ${y - 9} 46 ${y - 9} 50 ${y - 3} C54 ${y - 9} 74 ${y - 9} 76 ${y} C74 ${y + 8} 56 ${y + 8} 50 ${y + 3} C44 ${y + 8} 26 ${y + 8} 24 ${y} Z" fill="${themeVar}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`
    + `<ellipse cx="38" cy="${y}" rx="5" ry="4.2" fill="#fff"/><ellipse cx="62" cy="${y}" rx="5" ry="4.2" fill="#fff"/>`
    + `<circle cx="39" cy="${y + 0.5}" r="2.4" fill="${INK}"/><circle cx="63" cy="${y + 0.5}" r="2.4" fill="${INK}"/>`
    + `<circle cx="39.8" cy="${y - 0.4}" r="0.8" fill="#fff"/><circle cx="63.8" cy="${y - 0.4}" r="0.8" fill="#fff"/>`;
}

// Full animal-hero bust in a 100x100 box: cape, suit + emblem, head.
function animalHeroSvg(topicId, theme, emblemInner){
  const a = ANIMAL_HEROES[topicId];
  if (!a) return '';
  const accent = `var(--${theme})`;
  const accentDark = `var(--${theme}-dark, ${accent})`;
  const head = a.animal === 'frog'
    ? `<ellipse cx="50" cy="40" rx="30" ry="24" fill="${a.fur}" stroke="${INK}" stroke-width="2.4"/>`
    : `<circle cx="50" cy="40" r="27" fill="${a.fur}" stroke="${INK}" stroke-width="2.4"/>`;
  const faceShade = (a.snout === 'beak' || a.snout === 'bill' || a.marks === 'penguin' || a.animal === 'zebra')
    ? '' : `<ellipse cx="50" cy="48" rx="18" ry="14" fill="${a.face}" opacity=".55"/>`;
  return '<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">'
    + `<path d="M50 58 C26 62 12 80 14 100 L86 100 C88 80 74 62 50 58 Z" fill="${accentDark}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`
    + `<path d="M30 74 C38 66 62 66 70 74 L74 100 L26 100 Z" fill="${accent}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`
    + `<circle cx="50" cy="86" r="9" fill="#ffe066" stroke="${INK}" stroke-width="1.8"/>`
    + (emblemInner ? `<g transform="translate(50,86) scale(0.5) translate(-12,-12)">${emblemInner.replace(/#fff\b/g, accentDark).replace(/#ffffff/g, accentDark)}</g>` : '')
    + animalBackMarksSvg(a)
    + animalEarsSvg(a)
    + head
    + faceShade
    + animalFaceMarksSvg(a)
    + animalMaskSvg(accent, a.animal === 'frog')
    + animalSnoutSvg(a)
    + '</svg>';
}

function animalNameFor(topicId, lang){
  const a = ANIMAL_HEROES[topicId];
  if (!a) return '';
  return (ANIMAL_NAMES[lang] || ANIMAL_NAMES.en)[a.animal] || a.animal;
}

// Lesson loading screen: the lesson's own hero swoops in over a glowing
// light burst while two other animal heroes zoom past behind it.
function heroLoadingSceneHtml(topicId, theme, lang){
  const hero = typeof heroFor === 'function' ? heroFor(topicId) : null;
  const emblem = id => (typeof heroEmblemInner === 'function' && heroFor(id)) ? heroEmblemInner(heroFor(id).emblem) : '';
  const others = (typeof TOPICS !== 'undefined' ? TOPICS : []).filter(m => m.id !== topicId && ANIMAL_HEROES[m.id]);
  const pick = () => others.splice(Math.floor(Math.random() * others.length), 1)[0];
  const f1 = pick(), f2 = pick();
  const data = hero ? (hero[lang] || hero.en) : null;
  const line = data ? t('loading_hero_line', { name: data.name, animal: animalNameFor(topicId, lang) }) : '';
  return `
    <div class="hero-load" aria-hidden="true">
      <div class="hero-load__burst"></div>
      <span class="hero-load__spark s1">✦</span><span class="hero-load__spark s2">★</span><span class="hero-load__spark s3">✦</span><span class="hero-load__spark s4">★</span>
      ${f1 ? `<div class="hero-load__fly f1">${animalHeroSvg(f1.id, f1.theme, emblem(f1.id))}</div>` : ''}
      ${f2 ? `<div class="hero-load__fly f2">${animalHeroSvg(f2.id, f2.theme, emblem(f2.id))}</div>` : ''}
      <div class="hero-load__main">${animalHeroSvg(topicId, theme, emblem(topicId))}</div>
    </div>
    ${line ? `<p class="hero-load__line">${escapeHtml(line)}</p>` : ''}`;
}
