#!/usr/bin/env node
/* Writes tools/movies/book-picture-briefs.json: one painting brief for every
   picture in the hand-written Hero Stories books (content/books/<id>.js).

     node tools/build-book-briefs.js

   Each entry is one book page:
     { topic, level, page, leaf, file, scene, shows, alt:{en,es}, size, sharedWith }
   level  0 = Book 1 (Pre-K–K), 1 = Book 2 (grades 1–3), 2 = Book 3 (grade 4+)
   page   the story page (1 = first story page; 0 = the front cover)
   leaf   the page number printed in the book (the cover is 1; question
          pages also have numbers)
   file   save the painting as img/book/<topic>/<file>. Levels that show the
          same moment share one file, so `sharedWith` lists the other pages
          that use it. Paint each file once.
   The book shows a soft placeholder until a file exists, so pictures can be
   added one at a time. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'content', 'books');
const OUT = path.join(ROOT, 'tools', 'movies', 'book-picture-briefs.json');
const SIZE = '1800x1200 px (3:2), WebP. Keep faces and the key action inside the middle 70% of the width: wide screens crop the sides a little to fill the left page.';

const ctx = vm.createContext({ BOOK_STORIES: {} });
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.js'))){
  vm.runInContext(fs.readFileSync(path.join(DIR, f), 'utf8'), ctx);
}

const out = [];
for (const [topic, book] of Object.entries(ctx.BOOK_STORIES)){
  const uses = {};
  const entries = [];
  const add = (level, page, leaf, scene) => {
    const sc = book.scenes[scene];
    if (!sc) throw new Error(`${topic}: unknown scene ${scene}`);
    const e = { topic, level, page, leaf, file: sc.file, scene, shows: sc.shows, alt: sc.alt, size: SIZE };
    (uses[sc.file] = uses[sc.file] || []).push(e);
    entries.push(e);
  };
  book.levels.forEach((lv, level) => {
    if (book.cover) add(level, 0, 1, book.cover);
    let leaf = 1;
    lv.pages.forEach((pg, i) => {
      leaf++;
      if (pg.pic) add(level, i + 1, leaf, pg.pic);
      leaf += (lv.questions || []).filter(q => q.after === pg.id).length;
    });
  });
  for (const e of entries){
    e.sharedWith = uses[e.file].filter(o => o !== e).map(o => `L${o.level + 1}-p${String(o.page).padStart(2, '0')}`);
  }
  out.push(...entries);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
const files = new Set(out.map(e => e.topic + '/' + e.file));
console.log(`${out.length} picture briefs (${files.size} paintings) -> ${path.relative(ROOT, OUT)}`);
