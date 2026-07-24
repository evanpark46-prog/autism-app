/* ==========================================================================
   Build script — splits js/data.js (the authored source of truth for all
   lesson content) into the files the site actually loads at runtime:

     js/topics-index.js   Small, loaded on every page. TOPICS metadata plus
                           a TOPIC_SUMMARY (title/tagline/video checkpoints
                           per language) for every topic -- enough for the
                           home grid, cumulative review, worksheets, and the
                           usage-insights page without downloading full
                           lesson content.

     content/<id>.js       One per topic (both languages together, since the
                            language switcher is instant/client-side). Only
                            loaded on demand when a learner opens that topic.

   Run this after editing js/data.js:
     node tools/build-content.js
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'js', 'data.js');
const TOPICS_INDEX_PATH = path.join(ROOT, 'js', 'topics-index.js');
const CONTENT_DIR = path.join(ROOT, 'content');

function loadSourceData(){
  const code = fs.readFileSync(DATA_PATH, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code + '\nthis.TOPICS = TOPICS; this.CONTENT = CONTENT;', sandbox);
  return { TOPICS: sandbox.TOPICS, CONTENT: sandbox.CONTENT };
}

function buildSummaryForTopic(id){
  const summary = {};
  ['en', 'es'].forEach(lang => {
    const langBlock = CONTENT[lang] || CONTENT.en;
    const full = langBlock[id] || CONTENT.en[id];
    const checkpoints = (full.video && full.video.checkpoints) || [];
    summary[lang] = { title: full.title, tagline: full.tagline, video: { checkpoints } };
  });
  return summary;
}

let CONTENT;

function main(){
  const data = loadSourceData();
  CONTENT = data.CONTENT;
  const TOPICS = data.TOPICS;

  const topicSummary = {};
  TOPICS.forEach(meta => {
    ['en', 'es'].forEach(lang => {
      topicSummary[lang] = topicSummary[lang] || {};
    });
    const s = buildSummaryForTopic(meta.id);
    topicSummary.en[meta.id] = s.en;
    topicSummary.es[meta.id] = s.es;
  });

  const topicsIndexSource = `/* ==========================================================================
   Safety Library — topic metadata + lightweight summaries.
   GENERATED FILE -- do not hand-edit. Edit js/data.js, then run:
     node tools/build-content.js
   Loaded on every page (small). Full per-topic lesson content (story
   steps, flashcards, video id) lives in content/<id>.js and is loaded on
   demand by calling ensureTopicContentLoaded(id), defined below.
   ========================================================================== */

const TOPICS = ${JSON.stringify(TOPICS, null, 2)};

const TOPIC_SUMMARY = ${JSON.stringify(topicSummary, null, 2)};

function getTopicMeta(id){
  return TOPICS.find(tp => tp.id === id);
}

function getTopicSummary(id, lang){
  const langBlock = TOPIC_SUMMARY[lang] || TOPIC_SUMMARY.en;
  return langBlock[id] || TOPIC_SUMMARY.en[id];
}

/* ---------------------------------------------------------------------- */
/* On-demand full content loading (topic.html only)                       */
/* ---------------------------------------------------------------------- */

const TOPIC_CONTENT = {};
const _topicContentPromises = {};

function ensureTopicContentLoaded(id){
  if (TOPIC_CONTENT[id]) return Promise.resolve();
  if (_topicContentPromises[id]) return _topicContentPromises[id];
  _topicContentPromises[id] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = \`content/\${id}.js\`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load lesson content for ' + id));
    document.head.appendChild(script);
  });
  return _topicContentPromises[id];
}

function getTopicContent(id, lang){
  const langBlock = TOPIC_CONTENT[id];
  if (!langBlock) return null;
  return langBlock[lang] || langBlock.en;
}
`;

  fs.writeFileSync(TOPICS_INDEX_PATH, topicsIndexSource, 'utf8');
  console.log('Wrote', path.relative(ROOT, TOPICS_INDEX_PATH));

  TOPICS.forEach(meta => {
    const full = { en: CONTENT.en[meta.id], es: CONTENT.es[meta.id] || CONTENT.en[meta.id] };
    const source = `/* GENERATED FILE -- do not hand-edit. Edit js/data.js, then run:
     node tools/build-content.js */
(function(){
  TOPIC_CONTENT['${meta.id}'] = ${JSON.stringify(full, null, 2)};
})();
`;
    fs.writeFileSync(path.join(CONTENT_DIR, `${meta.id}.js`), source, 'utf8');
  });
  console.log('Wrote', TOPICS.length, 'files to', path.relative(ROOT, CONTENT_DIR) + '/');

  const totalContentBytes = TOPICS.reduce((sum, meta) => {
    return sum + fs.statSync(path.join(CONTENT_DIR, `${meta.id}.js`)).size;
  }, 0);
  const indexBytes = fs.statSync(TOPICS_INDEX_PATH).size;
  console.log(`topics-index.js: ${(indexBytes / 1024).toFixed(1)} KB`);
  console.log(`largest single topic file: ${(Math.max(...TOPICS.map(meta => fs.statSync(path.join(CONTENT_DIR, meta.id + '.js')).size)) / 1024).toFixed(1)} KB`);
  console.log(`all ${TOPICS.length} topic files combined: ${(totalContentBytes / 1024).toFixed(1)} KB (was one ${(fs.statSync(DATA_PATH).size / 1024).toFixed(0)} KB data.js loaded on every page)`);
}

main();
