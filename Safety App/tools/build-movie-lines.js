// Lists every line the Hero Movies speak (all episodes, EN + ES) with its voice key,
// for tools/voice/movie.py to record.  usage: node tools/build-movie-lines.js
const fs = require('fs'), path = require('path');
const { voiceKey } = require('../js/voice-audio.js');
const { MOVIE_EPISODES } = require('../js/movie-data.js');

const out = [], seen = new Set();
function add(lang, who, text){
  if (!text) return;
  const key = voiceKey(who + ': ' + text), id = lang + key;
  if (seen.has(id)) return; seen.add(id);
  out.push({ lang, who, text, key });
}
function walk(steps){
  for (const s of steps || []){
    if (s.say) for (const l of ['en', 'es']) add(l, s.say, s[l]);
    if (s.par) walk(s.par);
    if (s.seq) walk(s.seq);
    if (s.ask){
      for (const l of ['en', 'es']) add(l, 'narrator', s.ask.q[l]);
      for (const c of s.ask.choices){ walk(c.then); if (c.tip) for (const l of ['en', 'es']) add(l, 'hero', c.tip[l]); }
    }
  }
}
for (const ep of Object.values(MOVIE_EPISODES)){
  walk(ep.steps); walk(ep.tag);
  for (const r of ep.rescue || []) for (const l of ['en', 'es']) add(l, 'hero', r[l]);
  for (const s of ep.signoff || []) for (const l of ['en', 'es']) add(l, s.who, s[l]);
  for (const l of ['en', 'es']) add(l, 'hero', ep.heroTip[l]);
}
const file = path.join(__dirname, 'voice', 'movie-lines.json');
fs.writeFileSync(file, JSON.stringify(out, null, 1));
console.log(`${out.length} movie lines -> ${path.relative(process.cwd(), file)}`);
