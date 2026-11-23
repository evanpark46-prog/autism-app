/* ==========================================================================
   Safety Superheroes — Hero Stories (storybook.html)
   Every lesson's story, told as a picture-free book to read (or have read
   aloud). The book follows Alex (or the learner's own name) making each
   SAFE choice and why — like a social story — so it models the right
   behavior from start to finish.

   Book format:
     - a cover (title + the lesson's animal hero), story pages, and an end page
     - two pages side by side on wide screens, one page on phones
     - a gentle page-turn (none in Calm Mode / reduced motion)
     - Next / Back buttons, arrow keys and swipe
     - short "hero questions" placed right after the page where the answer
       happened (about one every 2–4 pages). A wrong answer gives a gentle
       hint and "Look back"; nothing ever blocks reading on.
     - the Super Reader Challenge at the end is now a short 2-question recap
       (still saves safetylib_super_reader_v1)
     - superhero bookmarks: the page is saved per lesson + level
       (safetylib_bookmarks_v1) so the child can carry on next time

     storybook.html              -> the bookshelf (lessons for the age group)
     storybook.html?id=X&level=N -> one book
   ========================================================================== */

let bookState = null;

/* ---------- Strings that only this page uses ------------------------------ */
const SB_UI = {
  en: {
    shelf_lead: 'Every lesson is a short superhero book. Tap 🔊 to hear any page. Your hero asks a question now and then — and if you stop reading, your hero saves your place!',
    shelf_legend_mark: 'Hero bookmark = your place is saved',
    shelf_legend_star: 'Star = book finished',
    shelf_keep_title: 'Keep reading',
    shelf_keep_btn: '{title} · Book {n} · page {page}',
    shelf_bookmark_sr: 'Your hero saved your place on page {n}.',
    shelf_done_sr: 'Finished.',
    shelf_super_sr: 'Finished. Super Reader!',
    resume_title: 'Your hero saved your place!',
    resume_q: 'Keep reading from page {n}?',
    resume_continue: 'Continue',
    resume_restart: 'Start over',
    pages_of: 'Pages {a} and {b} of {total}',
    book_label: '{title}, book {n}',
    book_role: 'book',
    with_hero: 'With {hero}',
    q_tag: 'Hero question',
    q_super: 'Super reading!',
    q_hero_says: '{hero} says:',
    q_hint_did: 'Good try! Look back at page {n} to see what {name} did.',
    q_hint_said: 'Good try! Look back at page {n} to see what {name} said.',
    q_hint_ask: 'Good try! The answer is on page {n}.',
    q_look: '📖 Look back at page {n}',
    q_keep: 'Keep reading',
    q_right_mark: 'Right!',
    q_wrong_mark: 'Not this one',
    look_here: 'Look here',
    recap_intro: 'One last quick check! Answer {n} questions to earn your Super Reader star.',
    endpaper: 'The back of the book',
  },
  es: {
    shelf_lead: 'Cada lección es un librito de superhéroes. Toca 🔊 para escuchar cualquier página. Tu héroe te hace una pregunta de vez en cuando, y si dejas de leer, ¡tu héroe guarda tu lugar!',
    shelf_legend_mark: 'Marcador de héroe = tu lugar está guardado',
    shelf_legend_star: 'Estrella = libro terminado',
    shelf_keep_title: 'Sigue leyendo',
    shelf_keep_btn: '{title} · Libro {n} · página {page}',
    shelf_bookmark_sr: 'Tu héroe guardó tu lugar en la página {n}.',
    shelf_done_sr: 'Terminado.',
    shelf_super_sr: 'Terminado. ¡Súper Lector!',
    resume_title: '¡Tu héroe guardó tu lugar!',
    resume_q: '¿Sigues leyendo desde la página {n}?',
    resume_continue: 'Continuar',
    resume_restart: 'Empezar de nuevo',
    pages_of: 'Páginas {a} y {b} de {total}',
    book_label: '{title}, libro {n}',
    book_role: 'libro',
    with_hero: 'Con {hero}',
    q_tag: 'Pregunta del héroe',
    q_super: '¡Súper lectura!',
    q_hero_says: '{hero} dice:',
    q_hint_did: '¡Buen intento! Mira otra vez la página {n} para ver qué hizo {name}.',
    q_hint_said: '¡Buen intento! Mira otra vez la página {n} para ver qué dijo {name}.',
    q_hint_ask: '¡Buen intento! La respuesta está en la página {n}.',
    q_look: '📖 Volver a la página {n}',
    q_keep: 'Seguir leyendo',
    q_right_mark: '¡Correcto!',
    q_wrong_mark: 'Esta no',
    look_here: 'Mira aquí',
    recap_intro: '¡Un repaso rápido! Contesta {n} preguntas para ganar tu estrella de Súper Lector.',
    endpaper: 'La parte de atrás del libro',
  },
};
function sbT(key, vars){
  const lang = typeof getLang === 'function' ? getLang() : 'en';
  let s = (SB_UI[lang] && SB_UI[lang][key]) || SB_UI.en[key] || key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
}

function bookName(){
  return (typeof learnerName === 'function' && learnerName()) || 'Alex';
}

function lowerFirst(s, name){
  if (!s) return s;
  const first = s.split(/\s+/)[0];
  if (first === 'I' || first.startsWith(name) || /^[A-ZÁÉÍÓÚÑ]{2,}/.test(first)) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// "Say “No thank you.”" / "Di “No, gracias.”" -> the spoken words.
function spokenWords(choiceText){
  const m = /^(?:say|di|decir|dile|dígale|tell them|answer)\s*[:,]?\s*[“"«]([^”"»]+)[”"»]\.?$/i.exec((choiceText || '').trim());
  return m ? m[1].trim() : '';
}

// Quiz feedback ("Yes — ...", "Exactly! ...") reads oddly in a book: drop
// the cheer, keep the reason; drop lines that are only a cheer.
function bookReason(feedback){
  let s = (feedback || '').trim();
  if (!s) return '';
  if (s.length < 60 && /(safe|right|correct|best) (answer|choice|response)|respuesta (segura|correcta)|opción (segura|correcta)/i.test(s) && !/because|porque|so |así/i.test(s)) return '';
  s = s.replace(/^[¡]?(yes|yep|exactly right|exactly|right|correct|great job|good job|nice work|nice|that'?s right|perfect|sí|exacto|exactamente|correcto|muy bien|bien hecho|perfecto)\b[!.,]*\s*(—|–|-|:)?\s*/i, '');
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Story pages + question candidates. Each candidate remembers the story page
// (storyIndex) that holds its answer.
function buildBookPages(content, levelIndex, name){
  const levels = (content.story && content.story.levels) || [];
  const level = levels[Math.min(levelIndex, levels.length - 1)];
  const pages = [];
  const questions = [];
  let lastNarrative = '';
  const addQuestion = (step, kind, context, right, toText, asked) => {
    const wrongs = (step.choices || []).filter(c => !c.correct).map(toText).filter(Boolean);
    const rightText = toText(right);
    if (!wrongs.length || !rightText || (!context && !asked)) return;
    if (kind === 'ask' && context === asked) context = '';
    // pages.length is the index this step's page is about to get.
    questions.push({ kind, asked: asked || '', context, right: rightText, wrongs, why: bookReason(right.feedback), storyIndex: pages.length });
  };
  (level ? level.steps : []).forEach(step => {
    const paras = [];
    if (step.type === 'narrative'){
      if (step.text){ paras.push({ text: step.text }); lastNarrative = step.text; }
    } else if (step.type === 'decision' || step.type === 'sequence'){
      const right = (step.choices || []).find(c => c.correct);
      if (step.type === 'sequence' && Array.isArray(step.stepsSoFar) && step.stepsSoFar.length){
        paras.push({ text: step.stepsSoFar.join(' ') });
      }
      if (step.text) paras.push({ text: step.text, cls: 'book-think' });
      if (right){
        const said = spokenWords(right.text);
        paras.push(said
          ? { text: t('book_said', { name, words: said }), cls: 'book-safe' }
          : { text: t('book_chose', { name, choice: lowerFirst(right.text, name) }), cls: 'book-safe' });
        const why = bookReason(right.feedback);
        if (why) paras.push({ text: why });
        if (step.type === 'decision'){
          const qp = quizParts(step.text, lastNarrative);
          const kind = quizKind(qp.question, said);
          addQuestion(step, kind, qp.context || qp.question, right,
            c => kind === 'said' && said ? spokenWords(c.text) || c.text : c.text, qp.question);
        }
      }
    } else if (step.type === 'dialogue'){
      (step.lines || []).forEach(l => paras.push({ speaker: l.speaker, text: l.text, cls: 'book-line' }));
      const right = (step.choices || []).find(c => c.correct);
      if (right){
        const said = spokenWords(right.text);
        paras.push(said
          ? { speaker: name, text: said, cls: 'book-line book-safe' }
          : { text: t('book_chose', { name, choice: lowerFirst(right.text, name) }), cls: 'book-safe' });
        const why = bookReason(right.feedback);
        if (why) paras.push({ text: why });
        const heard = (step.lines || []).filter(l => !/think|piensa/i.test(l.speaker || ''));
        const line = heard[0] || (step.lines || [])[0];
        if (line) addQuestion(step, said ? 'said' : 'did', `${line.speaker}: “${line.text}”`, right,
          c => said ? spokenWords(c.text) || c.text : c.text);
      }
    }
    if (paras.length) pages.push(paras);
  });
  return { pages, recap: (level && level.recap) || [], candidates: questions };
}

// Splits a decision prompt into the situation ("Someone Alex does not know
// is close by.") and its question ("What should Alex do?"). When there is no
// situation, the last story sentence before it reminds the reader instead.
function bookSentences(tx){ return ((tx || '').match(/[^.!?]*[.!?]+["”»]?|[^.!?]+$/g) || []).map(x => x.trim()).filter(Boolean); }
function quizParts(stepText, lastNarrative){
  const all = bookSentences(stepText);
  const isQ = x => /\?["”»]?$/.test(x);
  const question = all.filter(isQ).pop() || '';
  const situation = all.filter(x => !isQ(x)).join(' ');
  const prev = bookSentences(lastNarrative);
  return { context: situation || prev[prev.length - 1] || '', question };
}
// "What should Alex do?" becomes "In the story, what did Alex do?"; any
// other question ("Is it OK to say no?", "Why…?") is asked as written.
function quizKind(question, said){
  if (/\bwhat should\b.*\b(say|tell)\b|qu[eé] (debe|deber[ií]a|puede) (decir|responder|contestar)/i.test(question)) return said ? 'said' : 'did';
  if (!question || /\bwhat (should|could|can|will)\b.*\bdo\b|qu[eé] (debe|deber[ií]a|puede|deben) hacer/i.test(question)) return said ? 'said' : 'did';
  // "What's the safest choice?" in the middle of the story = what Alex did;
  // "Why…", "Is it OK…", "If someone…" are bigger-picture questions.
  const q = question.replace(/^[¿¡"“«\s]+/, '');
  if (!/^(why|is|are|was|if|what if|how|do|does|can|por qu[eé]|es|est[aá]|si|c[oó]mo|puede|qu[eé] pasa si)\b/i.test(q) &&
      /safest|best|smartest|seguro|segura|mejor/i.test(q)) return said ? 'said' : 'did';
  return 'ask';
}

function shuffleBookArray(a){
  for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Evenly spread `want` items from `all`, keeping story order.
function spreadPick(all, want){
  if (all.length <= want) return all.slice();
  if (want <= 0) return [];
  if (want === 1) return [all[Math.floor((all.length - 1) / 2)]];
  const out = [];
  for (let k = 0; k < want; k++) out.push(all[Math.round(k * (all.length - 1) / (want - 1))]);
  return out.filter((q, i, arr) => arr.indexOf(q) === i);
}

// Inline questions: about one every 3 story pages (1–5 of them), never two
// within 2 story pages of each other, each placed right after the page that
// holds its answer. 2 answer buttons for the youngest level, 3 otherwise.
function planQuestions(candidates, pageCount, levelIndex){
  const maxChoices = levelIndex === 0 ? 2 : 3;
  const want = Math.max(1, Math.min(5, Math.round(pageCount / 3)));
  const sorted = candidates.slice().sort((a, b) => a.storyIndex - b.storyIndex);
  // Walk the story once, taking a question when we reach the next target
  // spot. With `rightPage`, only take ones whose question page will be a
  // right-hand page in the two-page view (the cover is page 1, so the
  // question after story page s, with k questions before it, is leaf
  // s + 2 + k) — then the answer is on the facing left page.
  const greedy = rightPage => {
    const out = [];
    let last = -99;
    const gap = pageCount / (want + 1);
    for (const c of sorted){
      if (out.length >= want) break;
      const target = Math.round(gap * (out.length + 1)) - 1;
      if (c.storyIndex < target - 1 || c.storyIndex - last < 2) continue;
      if (rightPage && (c.storyIndex + out.length) % 2 !== 0) continue;
      out.push(c); last = c.storyIndex;
    }
    return out;
  };
  const strict = greedy(true), loose = greedy(false);
  const chosen = strict.length >= Math.max(1, loose.length - 1) ? strict : loose;
  const withChoices = q => ({
    ...q,
    choices: shuffleBookArray([{ text: q.right, correct: true }, ...shuffleBookArray(q.wrongs.slice()).slice(0, maxChoices - 1).map(text => ({ text, correct: false }))]),
  });
  // Recap: 2 questions, ones not asked inside the book first.
  const unused = sorted.filter(q => !chosen.includes(q));
  let recap = spreadPick(unused, 2);
  if (recap.length < 2) recap = recap.concat(spreadPick(chosen, 2 - recap.length).filter(q => !recap.includes(q)));
  recap.sort((a, b) => a.storyIndex - b.storyIndex);
  return { inline: chosen.map(withChoices), recap: recap.map(withChoices) };
}

/* ---------- Saved progress -------------------------------------------------- */
const SUPER_READER_KEY = 'safetylib_super_reader_v1';
function superReaderWins(){
  try { return JSON.parse(localStorage.getItem(SUPER_READER_KEY)) || {}; } catch (e){ return {}; }
}
function markSuperReader(id, level){
  try { const w = superReaderWins(); w[`${id}:${level}`] = true; localStorage.setItem(SUPER_READER_KEY, JSON.stringify(w)); } catch (e){}
}

// { "lesson-id:level": { page, total, done, ts } } — page is the 0-based
// leaf index (0 = cover); shown to the child as page + 1.
const BOOKMARK_KEY = 'safetylib_bookmarks_v1';
function readBookmarks(){
  try { const o = JSON.parse(localStorage.getItem(BOOKMARK_KEY)); return o && typeof o === 'object' ? o : {}; } catch (e){ return {}; }
}
function writeBookmarks(o){
  try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(o)); } catch (e){}
}
function getBookmark(id, level){ return readBookmarks()[`${id}:${level}`] || null; }
function saveBookmark(id, level, page, total){
  const all = readBookmarks();
  const k = `${id}:${level}`;
  const entry = Object.assign({}, all[k] || {});
  if (page > 0 && page < total - 1){ entry.page = page; entry.total = total; }
  else { delete entry.page; delete entry.total; }
  entry.ts = Date.now();
  if (entry.page == null && !entry.done) delete all[k]; else all[k] = entry;
  writeBookmarks(all);
}
function finishBookmark(id, level){
  const all = readBookmarks();
  all[`${id}:${level}`] = { done: true, ts: Date.now() };
  writeBookmarks(all);
}
function bookInProgress(bm){ return !!(bm && bm.page > 0); }

/* ---------- Hero art -------------------------------------------------------- */
function sbHeroName(id, lang){
  const h = typeof heroFor === 'function' ? heroFor(id) : null;
  return h ? (h[lang] || h.en).name : '';
}
// Small round hero head in the lesson's theme color (bookmarks, cheers).
function sbHeroHead(id, theme){
  let art = '';
  if (typeof animalHeroSvg === 'function' && typeof ANIMAL_HEROES !== 'undefined' && ANIMAL_HEROES[id]){
    art = animalHeroSvg(id, theme, null, { headOnly: true });
  } else if (typeof heroFor === 'function' && heroFor(id)){
    art = `<svg viewBox="0 0 24 24" width="70%" height="70%" focusable="false">${heroEmblemInner(heroFor(id).emblem)}</svg>`;
  } else {
    art = '<span>🦸</span>';
  }
  return `<span class="sb-head" data-theme="${theme}" aria-hidden="true">${art}</span>`;
}

function bookGrades(i){ return t(['level1_desc', 'level2_desc', 'level3_desc'][i]).split(' — ')[0]; }

/* ---------- Bookshelf ------------------------------------------------------- */
function renderBookshelf(root, lang){
  const band = typeof getAgeBand === 'function' ? getAgeBand() : 'all';
  const metas = TOPICS.filter(m => typeof topicMatchesAgeBand !== 'function' || topicMatchesAgeBand(m, band));
  const wins = superReaderWins();
  const marks = readBookmarks();
  const levelNames = ['level1_label', 'level2_label', 'level3_label'];

  // "Keep reading" row: the books the child left mid-way, newest first.
  const reading = Object.keys(marks)
    .map(k => { const [id, lv] = k.split(':'); return { id, level: parseInt(lv, 10), bm: marks[k], meta: getTopicMeta(id) }; })
    .filter(r => r.meta && bookInProgress(r.bm) && r.level >= 0 && r.level <= 2)
    .sort((a, b) => (b.bm.ts || 0) - (a.bm.ts || 0))
    .slice(0, 3);

  root.innerHTML = `
    <section class="hero sb-shelf-hero">
      <h1>${escapeHtml(t('book_shelf_title'))}</h1>
      <p>${escapeHtml(sbT('shelf_lead'))}</p>
      <p><a class="btn btn-secondary" href="say-it.html">${escapeHtml(t('book_say_link'))}</a></p>
    </section>
    ${reading.length ? `<section class="sb-keep" aria-labelledby="sb-keep-title">
      <h2 class="sb-keep__title" id="sb-keep-title">🔖 ${escapeHtml(sbT('shelf_keep_title'))}</h2>
      <ul class="sb-keep__list">
        ${reading.map(r => `<li><a class="sb-keep__btn" data-theme="${r.meta.theme}" href="storybook.html?id=${encodeURIComponent(r.id)}&level=${r.level}">
          ${sbHeroHead(r.id, r.meta.theme)}
          <span>${escapeHtml(sbT('shelf_keep_btn', { title: getTopicSummary(r.id, lang).title, n: r.level + 1, page: r.bm.page + 1 }))}</span>
        </a></li>`).join('')}
      </ul>
    </section>` : ''}
    <p class="sb-legend">
      <span class="sb-legend__item"><span class="sb-legend__mark" aria-hidden="true"></span>${escapeHtml(sbT('shelf_legend_mark'))}</span>
      <span class="sb-legend__item"><span aria-hidden="true">⭐</span> ${escapeHtml(sbT('shelf_legend_star'))}</span>
    </p>
    <ul class="bookshelf sb-shelf">
      ${metas.map(meta => {
        const summary = getTopicSummary(meta.id, lang);
        return `<li class="book-spine" data-theme="${meta.theme}">
          <div class="book-spine__icon" aria-hidden="true">${typeof heroBadgeHtml === 'function' ? heroBadgeHtml(meta.id, lang, meta.theme, 56) : '📖'}</div>
          <div class="book-spine__body">
            <h2 class="book-spine__title">${escapeHtml(summary.title)}</h2>
            <div class="book-spine__levels">
              ${levelNames.map((k, i) => {
                const bm = marks[`${meta.id}:${i}`];
                const reading = bookInProgress(bm);
                const superR = !!wins[`${meta.id}:${i}`];
                const done = !reading && (superR || !!(bm && bm.done));
                return `<a class="book-spine__level sb-shelf-book ${reading ? 'is-reading' : ''} ${done ? 'is-done' : ''}" data-theme="${meta.theme}" href="storybook.html?id=${encodeURIComponent(meta.id)}&level=${i}">
                  <span class="sb-shelf-book__name"><span class="sb-shelf-book__icon" aria-hidden="true">📖 </span>${escapeHtml(t('book_level_btn', { n: i + 1 }))}</span><small>${escapeHtml(bookGrades(i))}</small>
                  ${reading ? `<span class="sb-ribbon" data-theme="${meta.theme}" aria-hidden="true">${sbHeroHead(meta.id, meta.theme)}<span class="sb-ribbon__tail"><span class="sb-ribbon__pg">${bm.page + 1}</span></span></span>
                    <span class="visually-hidden">${escapeHtml(sbT('shelf_bookmark_sr', { n: bm.page + 1 }))}</span>` : ''}
                  ${done ? `<span class="sb-shelf-star" aria-hidden="true">⭐</span><span class="visually-hidden">${escapeHtml(sbT(superR ? 'shelf_super_sr' : 'shelf_done_sr'))}</span>` : ''}
                </a>`;
              }).join('')}
            </div>
          </div>
        </li>`;
      }).join('')}
    </ul>`;
}

/* ---------- Book state ------------------------------------------------------ */
function sbReducedMotion(){
  const r = document.documentElement;
  if (r.getAttribute('data-calm-mode') === 'on' || r.getAttribute('data-look') === 'calm') return true;
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
// Two pages side by side only when there is room for them at the chosen
// text size (bigger text needs a wider screen).
function sbWantsSpread(){
  const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return window.innerWidth >= fs * 54;
}

function newQuiz(qs){ return { qs, i: 0, wrong: [], solved: false, firstTry: 0, done: false }; }

function buildBookState(id, levelIndex, lang, name, content, meta){
  const built = buildBookPages(content, levelIndex, name);
  const plan = planQuestions(built.candidates, built.pages.length, levelIndex);
  const leaves = [{ type: 'cover' }];
  const storyLeaf = [];
  built.pages.forEach((paras, i) => {
    storyLeaf[i] = leaves.length;
    leaves.push({ type: 'story', paras });
    const q = plan.inline.find(x => x.storyIndex === i);
    if (q) leaves.push({ type: 'question', q: Object.assign(q, { answerLeaf: storyLeaf[i], wrong: [], solved: false, firstTry: false }) });
  });
  plan.recap.forEach(q => { q.answerLeaf = storyLeaf[q.storyIndex]; });
  if (plan.recap.length) leaves.push({ type: 'recap' });
  leaves.push({ type: 'end' });
  return {
    id, level: levelIndex, lang, name, theme: meta.theme, title: content.title,
    leaves, recap: built.recap, quiz: newQuiz(plan.recap),
    leaf: 0, returnTo: null, lookTarget: null, resumeAsked: false, spread: null,
  };
}

function sbSpreads(n){
  const s = [[0]];
  for (let i = 1; i < n; i += 2) s.push(i + 1 < n ? [i, i + 1] : [i]);
  return s;
}
function sbVisible(st){
  if (!st.spread) return [st.leaf];
  return sbSpreads(st.leaves.length).find(sp => sp.includes(st.leaf)) || [st.leaf];
}

/* ---------- Main render ----------------------------------------------------- */
function renderStoryBook(){
  const root = document.querySelector('[data-book-root]');
  if (!root) return;
  const lang = getLang();
  const q = new URLSearchParams(location.search);
  const id = q.get('id');
  const levelIndex = Math.max(0, Math.min(2, parseInt(q.get('level'), 10) || 0));
  if (typeof stopSpeaking === 'function') stopSpeaking();
  if (!id){ bookState = null; renderBookshelf(root, lang); return; }

  const meta = getTopicMeta(id);
  if (!meta){ root.innerHTML = `<section class="hero"><h1>${escapeHtml(t('book_missing'))}</h1><p><a class="btn btn-primary" href="storybook.html">${escapeHtml(t('book_back_shelf'))}</a></p></section>`; return; }
  const content = getTopicContent(id, lang);
  if (!content){
    root.innerHTML = `<div class="card"><p role="status">${escapeHtml(t('review_loading'))}</p></div>`;
    ensureTopicContentLoaded(id).then(renderStoryBook).catch(() => {
      root.innerHTML = `<div class="card"><p role="alert">${escapeHtml(t('review_load_error'))}</p></div>`;
    });
    return;
  }
  const name = bookName();
  if (!bookState || bookState.id !== id || bookState.level !== levelIndex || bookState.lang !== lang || bookState.name !== name){
    const prev = bookState && bookState.id === id && bookState.level === levelIndex ? bookState : null;
    bookState = buildBookState(id, levelIndex, lang, name, content, meta);
    // A language / name change keeps the reader on the same page.
    if (prev){
      bookState.leaf = Math.min(prev.leaf, bookState.leaves.length - 1);
      // Still on the "saved your place" screen? Show it again, translated.
      bookState.resumeAsked = prev.resumeAsked && !root.querySelector('.sb-resume');
    }
  }
  const st = bookState;
  document.title = `${content.title} — ${t('book_shelf_title')}`;

  if (!st.resumeAsked){
    st.resumeAsked = true;
    const bm = getBookmark(id, levelIndex);
    if (bookInProgress(bm) && bm.page < st.leaves.length - 1){ renderResume(root, st, bm.page); return; }
  }
  renderBookShell(root, st);
}

function renderResume(root, st, page){
  const lang = getLang();
  root.innerHTML = `
    <section class="sb-resume" data-theme="${st.theme}" aria-labelledby="sb-resume-title">
      <div class="sb-resume__art" aria-hidden="true">
        ${typeof heroPortraitHtml === 'function' ? heroPortraitHtml(st.id, lang, st.theme, 132) : ''}
        <span class="sb-resume__ribbon" data-theme="${st.theme}"><span class="sb-ribbon__tail"><span class="sb-ribbon__pg">${page + 1}</span></span></span>
      </div>
      <p class="sb-resume__book">${escapeHtml(st.title)} · ${escapeHtml(t('book_level_btn', { n: st.level + 1 }))}</p>
      <h1 class="sb-resume__title" id="sb-resume-title">${escapeHtml(sbT('resume_title'))}</h1>
      <p class="sb-resume__q">${escapeHtml(sbT('resume_q', { n: page + 1 }))}</p>
      <div class="sb-resume__actions">
        <button type="button" class="btn btn-primary sb-big-btn" data-resume-go>▶ ${escapeHtml(sbT('resume_continue'))}</button>
        <button type="button" class="btn btn-secondary sb-big-btn" data-resume-restart>↺ ${escapeHtml(sbT('resume_restart'))}</button>
      </div>
      <p class="sb-resume__shelf"><a href="storybook.html">← ${escapeHtml(t('book_back_shelf'))}</a></p>
    </section>`;
  root.querySelector('[data-resume-go]').addEventListener('click', () => {
    st.leaf = Math.max(0, Math.min(page, st.leaves.length - 1));
    renderBookShell(root, st, { focusLeaf: true });
  });
  root.querySelector('[data-resume-restart]').addEventListener('click', () => {
    st.leaf = 0;
    saveBookmark(st.id, st.level, 0, st.leaves.length);
    renderBookShell(root, st, { focusLeaf: true });
  });
  const go = root.querySelector('[data-resume-go]');
  if (go) go.focus({ preventScroll: true });
}

function renderBookShell(root, st, opts){
  st.spread = sbWantsSpread();
  root.innerHTML = `
    <div class="sb" data-theme="${st.theme}">
      <div class="sb-toolbar">
        <a class="sb-toolbar__shelf" href="storybook.html">← ${escapeHtml(t('book_back_shelf'))}</a>
        <h1 class="sb-toolbar__title">${escapeHtml(st.title)} <span>· ${escapeHtml(t('book_level_btn', { n: st.level + 1 }))}</span></h1>
        <button type="button" class="btn btn-primary sb-toolbar__return" data-sb-return hidden>${escapeHtml(t('bq_back_to_q'))}</button>
      </div>
      <div class="sb-stage" data-sb-stage>
        <div class="sb-book" data-sb-book role="region" aria-roledescription="${escapeHtml(sbT('book_role'))}" aria-label="${escapeHtml(sbT('book_label', { title: st.title, n: st.level + 1 }))}"></div>
      </div>
      <nav class="sb-nav" aria-label="${escapeHtml(t('book_nav_label'))}">
        <button type="button" class="btn btn-secondary sb-nav__btn" data-sb-prev><span aria-hidden="true">←</span> ${escapeHtml(t('book_prev'))}</button>
        <div class="sb-nav__mid">
          <p class="sb-nav__status" data-sb-status role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="sb-dots" data-sb-dots aria-hidden="true"></div>
        </div>
        <button type="button" class="btn btn-primary sb-nav__btn" data-sb-next><span data-sb-next-label></span> <span aria-hidden="true">→</span></button>
      </nav>
    </div>`;

  const go = (d, how) => {
    const n = st.leaves.length;
    let target;
    if (st.spread){
      const sp = sbSpreads(n);
      const k = sp.findIndex(s => s.includes(st.leaf));
      const nk = Math.max(0, Math.min(sp.length - 1, k + d));
      if (nk === k) return;
      target = sp[nk][0];
    } else {
      target = Math.max(0, Math.min(n - 1, st.leaf + d));
      if (target === st.leaf) return;
    }
    turnTo(st, target, { dir: d > 0 ? 1 : -1, how });
  };
  st.go = go;
  root.querySelector('[data-sb-prev]').addEventListener('click', () => go(-1, 'button'));
  root.querySelector('[data-sb-next]').addEventListener('click', () => go(1, 'button'));
  root.querySelector('[data-sb-return]').addEventListener('click', () => {
    const r = st.returnTo;
    if (r != null) showLeaf(st, r, { focus: true });
  });
  // Swipe to turn pages on tablets / phones.
  const stage = root.querySelector('[data-sb-stage]');
  let sx = null, sy = null;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = sy = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1, 'swipe');
  });
  updateBook(st, { focusLeaf: opts && opts.focusLeaf });
}

// Shows the spread / page holding `leaf`; turns the page only if needed.
function showLeaf(st, leaf, opts){
  if (sbVisible(st).includes(leaf)){
    st.leaf = st.spread ? st.leaf : leaf;
    updateBook(st, { focusLeafIndex: opts && opts.focus ? leaf : null, noTurn: true });
    return;
  }
  turnTo(st, leaf, { dir: leaf > st.leaf ? 1 : -1, how: 'jump', focusLeafIndex: opts && opts.focus ? leaf : null });
}

function turnTo(st, leaf, opts){
  st.leaf = leaf;
  updateBook(st, opts);
}

/* ---------- Leaf HTML ------------------------------------------------------- */
function leafLabel(st, i){ return t('book_page_of', { n: i + 1, total: st.leaves.length }); }

function leafHtml(st, i, side){
  const leaf = st.leaves[i];
  const name = st.name;
  const lang = getLang();
  let inner = '';
  let readable = false;
  if (leaf.type === 'cover'){
    const hero = sbHeroName(st.id, lang);
    inner = `
      <div class="sb-cover">
        <p class="sb-cover__series">${escapeHtml(t('book_series'))}</p>
        <h2 class="sb-cover__title">${escapeHtml(st.title)}</h2>
        <div class="sb-cover__hero" aria-hidden="true">${typeof heroPortraitHtml === 'function' ? heroPortraitHtml(st.id, lang, st.theme, 170) : ''}</div>
        ${hero ? `<p class="sb-cover__with">${escapeHtml(sbT('with_hero', { hero }))}</p>` : ''}
        <p class="sb-cover__level">${escapeHtml(t('book_level_btn', { n: st.level + 1 }))} · ${escapeHtml(bookGrades(st.level))}</p>
        <p class="sb-cover__starring">${escapeHtml(t('book_starring', { name }))}</p>
      </div>`;
  } else if (leaf.type === 'end'){
    inner = `
      <div class="sb-end">
        <p class="sb-end__title">${escapeHtml(t('book_the_end'))}</p>
        <div class="sb-end__hero" aria-hidden="true">${typeof heroPortraitHtml === 'function' ? heroPortraitHtml(st.id, lang, st.theme, 110) : ''}</div>
        ${st.recap.length ? `<h2 class="sb-end__heading">${escapeHtml(t('book_learned'))}</h2>
          <ul class="sb-end__list">${st.recap.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
        <div class="sb-end__actions">
          <button type="button" class="btn btn-secondary" data-book-restart>↺ ${escapeHtml(t('book_read_again'))}</button>
          <a class="btn btn-primary" href="topic.html?id=${encodeURIComponent(st.id)}">${escapeHtml(t('book_play_lesson'))}</a>
          <a class="btn btn-secondary" href="storybook.html">${escapeHtml(t('book_back_shelf'))}</a>
        </div>
      </div>`;
  } else if (leaf.type === 'story'){
    readable = true;
    const looking = st.lookTarget === i;
    inner = `<div class="sb-text ${looking ? 'is-lookback' : ''}">${leaf.paras.map((p, k) => {
      const tag = looking && /book-safe/.test(p.cls || '') ? `<span class="sb-look-tag"><span aria-hidden="true">👀</span> ${escapeHtml(sbT('look_here'))}</span> ` : '';
      return `<p class="book-p sb-p ${p.cls || ''}">${tag}${p.speaker ? `<span class="book-speaker">${escapeHtml(p.speaker)}:</span> ` : ''}<span data-book-seg="${k}">${escapeHtml(p.speaker ? `“${p.text}”` : p.text)}</span></p>`;
    }).join('')}</div>`;
  } else if (leaf.type === 'question'){
    readable = !leaf.q.solved;
    inner = questionHtml(st, leaf.q, i);
  } else if (leaf.type === 'recap'){
    readable = !st.quiz.done;
    inner = recapHtml(st);
  }
  const tools = readable && typeof speakButtonHtml === 'function' ? `<div class="sb-leaf__tools">${speakButtonHtml()}</div>` : '';
  return `<section class="sb-leaf sb-leaf--${side} sb-leaf--${leaf.type}" data-leaf="${i}" tabindex="-1" aria-label="${escapeHtml(leafLabel(st, i))}">
    <div class="sb-leaf__inner">${tools}${inner}</div>
    <p class="sb-leaf__num" aria-hidden="true">${i + 1}</p>
  </section>`;
}

function blankLeafHtml(st){
  return `<div class="sb-leaf sb-leaf--right sb-leaf--blank" aria-hidden="true">
    <div class="sb-endpaper">${sbHeroHead(st.id, st.theme)}</div>
  </div>`;
}

function questionPrompt(q, name){
  return q.kind === 'ask' ? q.asked : t(q.kind === 'said' ? 'bq_said' : 'bq_did', { name });
}

function choiceButtons(q, attr, solved, wrong){
  return q.choices.map((c, k) => {
    const isWrong = wrong.includes(k);
    const isRight = solved && c.correct;
    return `<button type="button" class="sb-choice ${isWrong ? 'is-wrong' : ''} ${isRight ? 'is-right' : ''}" ${attr}="${k}" ${isWrong || solved ? 'disabled' : ''}>
      <span class="sb-choice__text" data-book-seg="${k + 2}">${escapeHtml(q.kind === 'said' ? `“${c.text}”` : c.text)}</span>
      ${isRight ? `<span class="sb-choice__mark"><span aria-hidden="true">✅</span> ${escapeHtml(sbT('q_right_mark'))}</span>` : ''}
      ${isWrong ? `<span class="sb-choice__mark"><span aria-hidden="true">✖</span> ${escapeHtml(sbT('q_wrong_mark'))}</span>` : ''}
    </button>`;
  }).join('');
}

function cheerHtml(st, why){
  const hero = sbHeroName(st.id, getLang());
  return `<div class="sb-cheer">
    ${sbHeroHead(st.id, st.theme)}
    <p class="sb-cheer__bubble">${hero ? `<span class="visually-hidden">${escapeHtml(sbT('q_hero_says', { hero }))} </span>` : ''}<strong>${escapeHtml(sbT('q_super'))} <span aria-hidden="true">⭐</span></strong>${why ? ` ${escapeHtml(why)}` : ''}</p>
    <span class="sb-sparkles" aria-hidden="true"><i>⭐</i><i>✨</i><i>⭐</i></span>
  </div>`;
}

function hintText(q, name){
  const n = q.answerLeaf + 1;
  return sbT(q.kind === 'ask' ? 'q_hint_ask' : (q.kind === 'said' ? 'q_hint_said' : 'q_hint_did'), { n, name });
}

function questionHtml(st, q, i){
  const name = st.name;
  const prompt = questionPrompt(q, name);
  const lastWrong = q.wrong.length && !q.solved;
  return `<div class="sb-q">
    <p class="sb-q__tag">${sbHeroHead(st.id, st.theme)} <span>${escapeHtml(sbT('q_tag'))}</span></p>
    ${q.context ? `<p class="book-p sb-p book-think"><span data-book-seg="0">${escapeHtml(q.context)}</span></p>` : ''}
    <p class="sb-q__ask" id="sb-q-${i}"><span data-book-seg="1">${escapeHtml(prompt)}</span></p>
    <div class="sb-choices" role="group" aria-labelledby="sb-q-${i}">${choiceButtons(q, 'data-q-choice', q.solved, q.wrong)}</div>
    <div class="sb-fb" role="status" aria-live="polite">
      ${q.solved ? `${cheerHtml(st, q.why)}
        <button type="button" class="btn btn-primary sb-big-btn" data-q-keep>${escapeHtml(sbT('q_keep'))} <span aria-hidden="true">→</span></button>` : ''}
      ${lastWrong ? `<p class="sb-hint">${escapeHtml(hintText(q, name))}</p>
        <button type="button" class="btn btn-secondary sb-big-btn" data-q-look>${escapeHtml(sbT('q_look', { n: q.answerLeaf + 1 }))}</button>` : ''}
    </div>
  </div>`;
}

function recapScore(st){
  // Questions skipped while reading are simply left out of the score.
  const inline = st.leaves.filter(l => l.type === 'question' && (l.q.solved || l.q.wrong.length)).map(l => l.q);
  return { n: inline.filter(q => q.firstTry).length + st.quiz.firstTry, total: inline.length + st.quiz.qs.length };
}

function recapHtml(st){
  const qz = st.quiz;
  const title = `<h2 class="sb-recap__title">${escapeHtml(t('bq_title'))}</h2>`;
  if (qz.done){
    const sc = recapScore(st);
    return `<div class="sb-recap sb-recap--done">${title}
      <div class="sb-recap__medal" aria-hidden="true">⭐</div>
      <p class="sb-recap__done-title">${escapeHtml(t('bq_done_title'))}</p>
      <p>${escapeHtml(t('bq_done_score', { n: sc.n, total: sc.total }))}</p>
      <p class="sb-recap__stars" aria-hidden="true">${'⭐'.repeat(sc.n)}${'☆'.repeat(Math.max(0, sc.total - sc.n))}</p>
      <button type="button" class="btn btn-secondary" data-bq-again>${escapeHtml(t('bq_again'))}</button>
    </div>`;
  }
  const q = qz.qs[qz.i];
  const lastWrong = qz.wrong.length && !qz.solved;
  return `<div class="sb-recap">${title}
    ${qz.i === 0 && !qz.wrong.length && !qz.solved ? `<p class="sb-recap__intro">${escapeHtml(sbT('recap_intro', { n: qz.qs.length }))}</p>` : ''}
    <p class="sb-recap__progress">${escapeHtml(t('bq_progress', { n: qz.i + 1, total: qz.qs.length }))}</p>
    ${q.context ? `<p class="book-p sb-p book-think"><span data-book-seg="0">${escapeHtml(q.context)}</span></p>` : ''}
    <p class="sb-q__ask" id="sb-recap-q"><span data-book-seg="1">${escapeHtml(questionPrompt(q, st.name))}</span></p>
    <div class="sb-choices" role="group" aria-labelledby="sb-recap-q">${choiceButtons(q, 'data-bq-choice', qz.solved, qz.wrong)}</div>
    <div class="sb-fb" role="status" aria-live="polite">
      ${qz.solved ? `${cheerHtml(st, q.why)}
        <button type="button" class="btn btn-primary sb-big-btn" data-bq-next>${escapeHtml(qz.i + 1 < qz.qs.length ? t('bq_next') : t('bq_finish'))} <span aria-hidden="true">→</span></button>` : ''}
      ${lastWrong ? `<p class="sb-hint">${escapeHtml(hintText(q, st.name))}</p>
        <button type="button" class="btn btn-secondary sb-big-btn" data-bq-look>${escapeHtml(sbT('q_look', { n: q.answerLeaf + 1 }))}</button>` : ''}
    </div>
  </div>`;
}

/* ---------- Updating the open book ----------------------------------------- */
function updateBook(st, opts){
  opts = opts || {};
  const root = document.querySelector('[data-book-root]');
  const book = root && root.querySelector('[data-sb-book]');
  if (!book) return;
  if (st.animCleanup) st.animCleanup();
  if (typeof stopSpeaking === 'function' && !opts.noTurn) stopSpeaking();

  const visible = sbVisible(st);
  const n = st.leaves.length;
  // Turning back to the question you looked back from (or reading on past
  // it) ends the "look back".
  if (st.returnTo != null){
    const backAtQ = visible.includes(st.returnTo) && (!opts.noTurn || opts.focusLeafIndex === st.returnTo);
    if (backAtQ || Math.min.apply(null, visible) > st.returnTo){ st.returnTo = null; st.lookTarget = null; }
  }

  // Remember the old pages for the turn animation.
  const oldLeaves = Array.from(book.querySelectorAll(':scope > .sb-leaf'));
  const oldWasPair = book.classList.contains('is-pair');
  const oldBookRect = book.getBoundingClientRect();
  const oldClones = oldLeaves.map(el => el.cloneNode(true));
  const oldBoxes = oldLeaves.map(el => { const r = el.getBoundingClientRect(); return { left: r.left - oldBookRect.left, top: r.top - oldBookRect.top, width: r.width, height: r.height }; });

  const isPair = st.spread && visible[0] !== 0;
  book.classList.toggle('is-spread', !!st.spread);
  book.classList.toggle('is-pair', !!isPair);
  book.classList.toggle('is-single', !isPair);
  if (isPair){
    book.innerHTML = leafHtml(st, visible[0], 'left') + (visible[1] != null ? leafHtml(st, visible[1], 'right') : blankLeafHtml(st));
  } else {
    book.innerHTML = leafHtml(st, visible[0], visible[0] === 0 ? 'cover' : 'solo');
  }
  wireLeaves(st, book);

  // Nav state
  const prev = root.querySelector('[data-sb-prev]');
  const next = root.querySelector('[data-sb-next]');
  const atStart = visible.includes(0);
  const atEnd = visible.includes(n - 1);
  prev.disabled = atStart;
  next.disabled = atEnd;
  const showsUnsolvedRecap = visible.some(i => st.leaves[i].type === 'recap') && !st.quiz.done;
  root.querySelector('[data-sb-next-label]').textContent = atStart ? t('book_start') : (showsUnsolvedRecap ? t('bq_skip') : t('book_next'));
  const status = visible.length > 1
    ? sbT('pages_of', { a: visible[0] + 1, b: visible[1] + 1, total: n })
    : t('book_page_of', { n: visible[0] + 1, total: n });
  root.querySelector('[data-sb-status]').textContent = status;
  root.querySelector('[data-sb-dots]').innerHTML = st.leaves.map((l, i) =>
    `<span class="${visible.includes(i) ? 'is-on' : ''} ${l.type === 'question' || l.type === 'recap' ? 'is-q' : ''}"></span>`).join('');
  const ret = root.querySelector('[data-sb-return]');
  ret.hidden = !(st.returnTo != null && !visible.includes(st.returnTo));

  // Bookmark: the page you are on, or "finished" once The End is open.
  if (atEnd) finishBookmark(st.id, st.level);
  else saveBookmark(st.id, st.level, visible[0], n);

  if (!opts.noTurn && opts.dir && oldLeaves.length) animateTurn(st, book, oldClones, oldBoxes, oldWasPair, isPair, opts.dir);

  // Focus
  let focusEl = null;
  if (opts.focusLeafIndex != null) focusEl = book.querySelector(`[data-leaf="${opts.focusLeafIndex}"]`);
  else if (opts.focusLeaf) focusEl = book.querySelector('.sb-leaf[data-leaf]');
  const ae = document.activeElement;
  if (!focusEl && (!ae || ae === document.body || !document.contains(ae) || ae.disabled)){
    if (opts.how) focusEl = book.querySelector('.sb-leaf[data-leaf]');
  }
  if (focusEl) focusEl.focus({ preventScroll: true });

  // After a turn, bring the top of the book back into view (below the
  // sticky site header) so the new page is read from its start.
  if (!opts.noTurn){
    const hdr = document.querySelector('.site-header');
    const pos = hdr ? getComputedStyle(hdr).position : '';
    const off = (pos === 'sticky' || pos === 'fixed') ? Math.max(0, hdr.getBoundingClientRect().bottom) : 0;
    const r = root.querySelector('.sb-toolbar').getBoundingClientRect();
    if (r.top < off) window.scrollTo({ top: window.scrollY + r.top - off - 8, behavior: sbReducedMotion() ? 'auto' : 'smooth' });
  }
}

function wireLeaves(st, book){
  let autoUsed = false;
  book.querySelectorAll('.sb-leaf[data-leaf]').forEach(el => {
    const i = parseInt(el.dataset.leaf, 10);
    wireLeaf(st, el, i, !autoUsed);
    if (el.querySelector('[data-speak-btn]')) autoUsed = true;
  });
}

// Re-draws one page in place (after answering a question) — no page turn.
function refreshLeaf(st, i, focusSel){
  const book = document.querySelector('[data-sb-book]');
  const el = book && book.querySelector(`[data-leaf="${i}"]`);
  if (!el) return;
  const side = (el.className.match(/sb-leaf--(left|right|solo|cover)/) || [])[1] || 'solo';
  const tmp = document.createElement('div');
  tmp.innerHTML = leafHtml(st, i, side);
  const fresh = tmp.firstElementChild;
  el.replaceWith(fresh);
  wireLeaf(st, fresh, i, false);
  const root = document.querySelector('[data-book-root]');
  const visible = sbVisible(st);
  const next = root.querySelector('[data-sb-next-label]');
  if (next && !visible.includes(0)){
    const showsUnsolvedRecap = visible.some(k => st.leaves[k].type === 'recap') && !st.quiz.done;
    next.textContent = showsUnsolvedRecap ? t('bq_skip') : t('book_next');
  }
  const f = focusSel && fresh.querySelector(focusSel);
  if (f) f.focus({ preventScroll: true });
}

function wireLeaf(st, el, i, autoRead){
  const leaf = st.leaves[i];
  const again = el.querySelector('[data-book-restart]');
  if (again) again.addEventListener('click', () => {
    st.leaves.forEach(l => { if (l.q){ l.q.wrong = []; l.q.solved = false; l.q.firstTry = false; l.q.choices = shuffleBookArray(l.q.choices.slice()); } });
    st.quiz = newQuiz(st.quiz.qs.map(q => ({ ...q, choices: shuffleBookArray(q.choices.slice()) })));
    st.returnTo = null; st.lookTarget = null;
    turnTo(st, 0, { dir: -1, how: 'jump', focusLeafIndex: 0 });
  });

  if (leaf.type === 'question') wireQuestion(st, el, i, leaf.q);
  if (leaf.type === 'recap') wireRecap(st, el, i);

  // Read aloud, with the word being spoken highlighted.
  const segs = Array.from(el.querySelectorAll('[data-book-seg]')).map(s => ({ el: s, text: s.textContent }));
  if (segs.length && typeof wireSpeakButtonHighlighted === 'function') wireSpeakButtonHighlighted(el, segs, null, ' ', autoRead);
}

// Answered right: drop the "Look here" marks on a page still in view.
function clearLookBack(st, i){
  if (st.returnTo !== i) return;
  const lt = st.lookTarget;
  st.returnTo = null; st.lookTarget = null;
  if (lt != null && sbVisible(st).includes(lt)) refreshLeaf(st, lt);
  const ret = document.querySelector('[data-sb-return]');
  if (ret) ret.hidden = true;
}

function celebrate(){
  if (typeof playCorrectDing === 'function') playCorrectDing();
}

function wireQuestion(st, el, i, q){
  el.querySelectorAll('[data-q-choice]').forEach(btn => btn.addEventListener('click', () => {
    const k = parseInt(btn.dataset.qChoice, 10);
    if (typeof stopSpeaking === 'function') stopSpeaking();
    if (q.choices[k].correct){
      q.solved = true;
      if (!q.wrong.length) q.firstTry = true;
      celebrate();
      clearLookBack(st, i);
      refreshLeaf(st, i, '[data-q-keep]');
    } else {
      if (!q.wrong.includes(k)) q.wrong.push(k);
      refreshLeaf(st, i, '[data-q-choice]:not([disabled])');
    }
  }));
  const keep = el.querySelector('[data-q-keep]');
  if (keep) keep.addEventListener('click', () => {
    if (i + 1 < st.leaves.length) showLeaf(st, i + 1, { focus: true });
  });
  const look = el.querySelector('[data-q-look]');
  if (look) look.addEventListener('click', () => {
    st.returnTo = i; st.lookTarget = q.answerLeaf;
    showLeaf(st, q.answerLeaf, { focus: true });
  });
}

function wireRecap(st, el, i){
  const qz = st.quiz;
  el.querySelectorAll('[data-bq-choice]').forEach(btn => btn.addEventListener('click', () => {
    const k = parseInt(btn.dataset.bqChoice, 10);
    const q = qz.qs[qz.i];
    if (typeof stopSpeaking === 'function') stopSpeaking();
    if (q.choices[k].correct){
      qz.solved = true;
      if (!qz.wrong.length) qz.firstTry++;
      celebrate();
      clearLookBack(st, i);
      refreshLeaf(st, i, '[data-bq-next]');
    } else {
      if (!qz.wrong.includes(k)) qz.wrong.push(k);
      refreshLeaf(st, i, '[data-bq-choice]:not([disabled])');
    }
  }));
  const next = el.querySelector('[data-bq-next]');
  if (next) next.addEventListener('click', () => {
    if (qz.i + 1 < qz.qs.length){ qz.i++; qz.wrong = []; qz.solved = false; refreshLeaf(st, i, '[data-bq-choice]'); }
    else {
      qz.done = true;
      markSuperReader(st.id, st.level);
      if (typeof playZapSound === 'function') playZapSound();
      refreshLeaf(st, i, '[data-bq-again]');
    }
  });
  const look = el.querySelector('[data-bq-look]');
  if (look) look.addEventListener('click', () => {
    const q = qz.qs[qz.i];
    st.returnTo = i; st.lookTarget = q.answerLeaf;
    showLeaf(st, q.answerLeaf, { focus: true });
  });
  const again = el.querySelector('[data-bq-again]');
  if (again) again.addEventListener('click', () => {
    st.quiz = newQuiz(qz.qs.map(q => ({ ...q, choices: shuffleBookArray(q.choices.slice()) })));
    refreshLeaf(st, i, '[data-bq-choice]');
  });
}

/* ---------- Page-turn animation --------------------------------------------- */
// Two open pages: the turning page is a two-sided card that swings over the
// spine (front = the old page, back = the new one). One page (phones, the
// cover): the old page lifts away to the left, or the new page settles back
// in from the left. Skipped entirely in Calm Mode / reduced motion.
function animateTurn(st, book, oldClones, oldBoxes, oldWasPair, isPair, dir){
  if (sbReducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'sb-turn-layer';
  layer.setAttribute('aria-hidden', 'true');
  const prep = node => {
    node.removeAttribute('id');
    node.removeAttribute('tabindex');
    node.removeAttribute('data-leaf');
    node.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    node.querySelectorAll('[data-speak-btn]').forEach(x => x.removeAttribute('data-speak-btn'));
    node.setAttribute('inert', '');
    return node;
  };
  const newLeaves = Array.from(book.querySelectorAll(':scope > .sb-leaf'));
  const bookRect = book.getBoundingClientRect();
  const box = (el, rect) => {
    const r = rect || el.getBoundingClientRect();
    el.style.left = (r.left - bookRect.left) + 'px';
    el.style.top = (r.top - bookRect.top) + 'px';
    el.style.width = r.width + 'px';
    el.style.height = r.height + 'px';
  };
  let finished = false;
  const cleanup = () => {
    if (finished) return;
    finished = true;
    layer.remove();
    book.classList.remove('is-turning');
    if (st.animCleanup === cleanup) st.animCleanup = null;
  };

  if (oldWasPair && isPair && oldClones.length === 2 && newLeaves.length === 2){
    const [oldL, oldR] = oldClones.map(prep);
    const newL = prep(newLeaves[0].cloneNode(true));
    const newR = prep(newLeaves[1].cloneNode(true));
    const lRect = newLeaves[0].getBoundingClientRect();
    const rRect = newLeaves[1].getBoundingClientRect();
    const still = document.createElement('div');
    still.className = 'sb-turn-still';
    const flip = document.createElement('div');
    flip.className = 'sb-turn-flip ' + (dir > 0 ? 'is-fwd' : 'is-back');
    const front = document.createElement('div'); front.className = 'sb-turn-face sb-turn-face--front';
    const back = document.createElement('div'); back.className = 'sb-turn-face sb-turn-face--back';
    if (dir > 0){
      still.appendChild(oldL); box(still, lRect);
      front.appendChild(oldR); back.appendChild(newL); box(flip, rRect);
    } else {
      still.appendChild(oldR); box(still, rRect);
      front.appendChild(oldL); back.appendChild(newR); box(flip, lRect);
    }
    flip.appendChild(front); flip.appendChild(back);
    layer.appendChild(still); layer.appendChild(flip);
    flip.addEventListener('animationend', cleanup);
  } else {
    const card = document.createElement('div');
    if (dir > 0 && oldClones[0]){
      // Old page lifts away to reveal the new one underneath.
      card.className = 'sb-turn-lift';
      const last = oldClones.length - 1;
      card.appendChild(prep(oldClones[last]));
      const ob = oldBoxes[last];
      box(card, { left: bookRect.left + ob.left, top: bookRect.top + ob.top, width: ob.width, height: ob.height });
    } else {
      // New page settles in from the left, over the old one.
      card.className = 'sb-turn-settle';
      const under = document.createElement('div');
      under.className = 'sb-turn-still';
      if (oldClones[0]){ under.appendChild(prep(oldClones[0])); box(under, { left: bookRect.left + oldBoxes[0].left, top: bookRect.top + oldBoxes[0].top, width: oldBoxes[0].width, height: oldBoxes[0].height }); layer.appendChild(under); }
      card.appendChild(prep(newLeaves[0].cloneNode(true)));
      box(card, newLeaves[0].getBoundingClientRect());
    }
    layer.appendChild(card);
    card.addEventListener('animationend', cleanup);
  }
  book.classList.add('is-turning');
  book.appendChild(layer);
  st.animCleanup = cleanup;
  setTimeout(cleanup, 1200);
}

/* ---------- Page setup ------------------------------------------------------ */
function initStoryBookPage(){
  renderStoryBook();
  window.addEventListener('safetylib:langchange', () => { renderStoryBook(); });
  window.addEventListener('safetylib:agebandchange', () => { if (!bookState) renderStoryBook(); });
  document.addEventListener('keydown', e => {
    if (!bookState || !bookState.go || !document.querySelector('[data-sb-book]') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.target && e.target.closest && e.target.closest('.display-panel')) return;
    if (e.key === 'ArrowRight'){ e.preventDefault(); bookState.go(1, 'key'); }
    else if (e.key === 'ArrowLeft'){ e.preventDefault(); bookState.go(-1, 'key'); }
  });
  // One page or two? Re-check when the window or the text size changes.
  const recheck = () => {
    const st = bookState;
    const root = document.querySelector('[data-book-root]');
    if (!st || !root || !root.querySelector('[data-sb-book]')) return;
    if (sbWantsSpread() !== st.spread) renderBookShell(root, st);
  };
  let rt = null;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(recheck, 150); });
  if (typeof MutationObserver === 'function'){
    new MutationObserver(recheck).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  }
}
