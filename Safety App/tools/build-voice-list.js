#!/usr/bin/env node
/* Collects every sentence the app reads aloud (lessons, Hero Stories, the
   games, Say It words, villains, UI text) in English and Spanish, splits
   them exactly the way js/voice-audio.js does in the browser, and writes
   tools/voice/sentences.json for tools/voice/generate.py to record.

     node tools/build-voice-list.js          # write the sentence list
     node tools/build-voice-list.js --index  # rebuild audio/voice/<lang>/index.json
                                             # from the .mp3 files present

   Sentences are ordered by how often kids hear them (games and level 1
   lessons first) so a partial recording run already covers the most. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const VA = require(path.join(ROOT, 'js', 'voice-audio.js'));
const LANGS = ['en', 'es'];

function writeIndexes(){
  for (const lang of LANGS){
    const dir = path.join(ROOT, 'audio', 'voice', lang);
    if (!fs.existsSync(dir)) continue;
    const keys = fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();
    fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(keys));
    console.log(lang, keys.length, 'recordings indexed');
  }
}
if (process.argv.includes('--index')){ writeIndexes(); process.exit(0); }

// Load a browser script and return its top-level const/let data objects.
function loadGlobals(file, ctx){
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const names = [...src.matchAll(/^(?:const|let|var)\s+([A-Z_][A-Z0-9_]*)\s*=\s*[{[]/gm)].map(m => m[1]);
  ctx = ctx || vm.createContext({ window: {}, document: undefined, console });
  vm.runInContext(src + '\n;this.__out = {' + names.map(n => `${n}: typeof ${n} !== 'undefined' ? ${n} : null`).join(',') + '};', ctx);
  return ctx.__out;
}

const SKIP_KEYS = new Set(['id', 'type', 'illustration', 'cta', 'image', 'images', 'theme', 'icon', 'emblem', 'hero', 'topic', 'cat', 'e', 'emoji', 'scene', 'wall', 'floor', 'color', 'animal', 'fur', 'face', 'ears', 'snout', 'marks', 'markColor', 'beak', 'earColor', 'earInner', 'stress', 'lvl', 'href', 'url', 'key', 'kind']);
function strings(value, out, key){
  if (typeof value === 'string'){
    if (SKIP_KEYS.has(key)) return;
    if (!/\p{L}{2}/u.test(value)) return;
    if (/^[a-z0-9_\-./]+$/.test(value)) return;      // ids, file names
    if (/[<>{}]/.test(value)) return;                 // html / templates
    out.push(value);
  } else if (Array.isArray(value)) value.forEach(v => strings(v, out, key));
  else if (value && typeof value === 'object') for (const k of Object.keys(value)) strings(value[k], out, k);
}

const list = new Map(); // lang|key -> {lang, key, text, p}
function add(lang, str, p){
  for (const s of VA.speechSentences(VA.cleanForSpeech(str))){
    const text = VA.voiceSentenceNorm(s.text);
    if (!text || !/[\p{L}\p{N}]/u.test(text)) continue;
    const key = VA.voiceKey(s.text);
    const id = lang + '|' + key;
    const had = list.get(id);
    if (had){
      if (had.text !== text) console.warn('KEY COLLISION', key, JSON.stringify(had.text), JSON.stringify(text));
      had.p = Math.min(had.p, p);
    } else list.set(id, { lang, key, text, p });
  }
}

// 0: the new hero games
const games = loadGlobals('js/hero-games-data.js');
for (const lang of LANGS){
  const out = [];
  strings(games.HERO_ROUTES[lang], out); strings(games.DANGER_SCENES[lang], out);
  strings(games.HELP_CALLS[lang], out);
  const script = JSON.parse(JSON.stringify(games.HELP_CALL_SCRIPT[lang]));
  for (const call of games.HELP_CALLS[lang]) out.push(call.what);
  strings(script, out);
  // Lines the game pages put together themselves.
  for (const sc of games.DANGER_SCENES[lang]) for (const it of sc.items) out.push(it.name + '.');
  const ui = loadGlobals('js/page-hero-games.js').HG_UI[lang];
  strings(ui, out);
  ['rule1', 'rule2', 'rule3'].forEach(k => out.push(ui[k] + '.'));
  out.push(ui.call_tips.replace(/ · /g, '. ') + '.');
  out.forEach(s => add(lang, s, 0));
}

// 1: Say It words (the word, its syllables / sound-it-out parts, meaning, example)
const words = loadGlobals('js/safety-words.js');
for (const lang of LANGS){
  for (const w of (words.SAFETY_WORDS[lang] || [])){
    [w.w, w.mean, w.ex].filter(Boolean).forEach(s => add(lang, s, 1));
    (w.syl || []).forEach(s => add(lang, s, 1));
    if (w.sounds) w.sounds.split(/[-\s]+/).filter(Boolean).forEach(s => add(lang, s.toLowerCase(), 1));
  }
}

// 2-5: lesson content (level 1 first)
const ctx = vm.createContext({ TOPIC_CONTENT: {} });
for (const f of fs.readdirSync(path.join(ROOT, 'content')).filter(f => f.endsWith('.js'))){
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'content', f), 'utf8'), ctx);
}
for (const id of Object.keys(ctx.TOPIC_CONTENT)){
  for (const lang of LANGS){
    const c = ctx.TOPIC_CONTENT[id][lang];
    if (!c) continue;
    const levels = (c.story && c.story.levels) || [];
    levels.forEach((lv, i) => { const out = []; strings(lv, out); out.forEach(s => add(lang, s, 2 + Math.min(i, 2))); });
    const rest = Object.assign({}, c, { story: Object.assign({}, c.story, { levels: [] }) });
    const out = []; strings(rest, out); out.forEach(s => add(lang, s, 3));
  }
}

// 5: villains, hero tips, glossary, topic index text
for (const file of ['js/villains.js', 'js/heroes.js', 'js/animal-heroes.js', 'js/glossary.js', 'js/topics-index.js', 'js/story.js']){
  let g;
  try { g = loadGlobals(file); } catch (e){ console.warn('skip', file, e.message); continue; }
  for (const name of Object.keys(g)){
    const v = g[name];
    if (!v || typeof v !== 'object') continue;
    for (const lang of LANGS){
      const out = [];
      // Objects keyed by language, or arrays of objects with en/es fields.
      if (v[lang]) strings(v[lang], out);
      else JSON.stringify(v, (k, x) => { if (x && typeof x === 'object' && !Array.isArray(x) && x[lang] && typeof x[lang] !== 'function') strings(x[lang], out, k); return x; });
      out.forEach(s => add(lang, s, 5));
    }
  }
}

// 6: interface text
const i18n = loadGlobals('js/i18n.js');
for (const lang of LANGS){
  const out = []; strings(i18n.UI_STRINGS[lang], out); out.forEach(s => add(lang, s, 6));
}

const rows = [...list.values()].sort((a, b) => a.p - b.p || (a.lang === b.lang ? 0 : a.lang === 'en' ? -1 : 1));
const outDir = path.join(ROOT, 'tools', 'voice');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sentences.json'), JSON.stringify(rows));
const byP = {};
rows.forEach(r => { const k = r.lang + ' p' + r.p; byP[k] = byP[k] || { n: 0, chars: 0 }; byP[k].n++; byP[k].chars += r.text.length; });
console.log(rows.length, 'sentences');
for (const k of Object.keys(byP).sort()) console.log(k, byP[k].n, 'sentences', Math.round(byP[k].chars / 14 / 60), 'min');
