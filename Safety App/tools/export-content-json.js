/* Dumps every lesson's story levels (EN + ES) as JSON on stdout, in lesson
   order, for tools/build-scenario-sheet.py. Reads the generated content/
   files, so run `node tools/build-content.js` first after editing data.js. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

global.TOPIC_CONTENT = {};
for (const f of fs.readdirSync(path.join(root, 'content')).filter(f => f.endsWith('.js'))){
  eval(fs.readFileSync(path.join(root, 'content', f), 'utf8'));
}
// Lesson order + metadata from the generated index (TOPICS array literal).
const indexSrc = fs.readFileSync(path.join(root, 'js', 'topics-index.js'), 'utf8');
const topicsLiteral = indexSrc.slice(indexSrc.indexOf('const TOPICS = ') + 'const TOPICS = '.length);
const TOPICS = eval(topicsLiteral.slice(0, topicsLiteral.indexOf('];') + 1));

const out = TOPICS.filter(t => TOPIC_CONTENT[t.id]).map(t => ({
  id: t.id,
  ageBands: t.ageBands || [],
  en: TOPIC_CONTENT[t.id].en,
  es: TOPIC_CONTENT[t.id].es,
}));
process.stdout.write(JSON.stringify(out));
