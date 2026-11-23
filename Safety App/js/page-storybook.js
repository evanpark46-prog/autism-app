/* ==========================================================================
   Safety Superheroes — Hero Stories (storybook.html)
   Every lesson's story as a picture book to read, or to have read aloud.
   The book follows Alex (or the learner's own name) making each SAFE choice
   and why, like a social story.

   Two kinds of book:
     - Hand-written picture books (content/books/<id>.js, BOOK_STORIES):
       pages with pictures (img/book/<id>/), and real reading-comprehension
       questions of several kinds (recall, story order, feelings, cause and
       effect, word meaning, prediction, inference, big idea). Wide screens
       show a picture-book spread: the picture on the left page, the words on
       the right. Phones show the picture above the words.
     - Every other lesson: the book is made from the lesson's story steps
       (content/<id>.js), two pages of words side by side, with questions
       made from the lesson's decisions.

   Reading help (all books):
     - big story text with its own size control (A / A+ / A++, saved in
       safetylib_book_text_v1), on top of the app's Display text size
     - "Read to me": reads each page aloud, the sentence being read is
       highlighted; optional "Turn pages for me"; questions, choices and the
       feedback are read too (saved in safetylib_book_read_v1; it starts on
       when the profile's "read everything aloud" is on)
     - each page turn is announced to screen readers; pictures have alt text
     - a gentle page-turn (none in Calm Mode / reduced motion)
     - Next / Back buttons, arrow keys and swipe
     - a wrong answer gives a kind hint and "Look back at page N"; the reader
       can jump back and return. Nothing ever blocks reading on.
     - the Super Reader Challenge at the end (2 questions, still saves
       safetylib_super_reader_v1)
     - superhero bookmarks: the page is saved per lesson + level
       (safetylib_bookmarks_v1) so the child can carry on next time

     storybook.html              -> the bookshelf (lessons for the age group)
     storybook.html?id=X&level=N -> one book
   ========================================================================== */

let bookState = null;

// Hand-written picture books register here (content/books/<id>.js).
const BOOK_STORIES = {};
const BOOK_STORY_IDS = ['stranger-safety'];
const BOOK_PIC_BASE = 'img/book/';

/* ---------- Strings that only this page uses ------------------------------ */
const SB_UI = {
  en: {
    shelf_lead: 'Every lesson is a short superhero book. Tap “Read to me” to hear it. Your hero asks a question now and then, and if you stop reading, your hero saves your place!',
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
    page_heading: 'Page {n}',
    q_tag: 'Hero question',
    hero_asks: '{hero} asks',
    q_super: 'Super reading!',
    q_hero_says: '{hero} says:',
    q_hint_did: 'Good try! Look back at page {n} to see what {name} did.',
    q_hint_said: 'Good try! Look back at page {n} to see what {name} said.',
    q_hint_ask: 'Good try! The answer is on page {n}.',
    q_look_page: 'Look back at page {n}.',
    q_look: '📖 Look back at page {n}',
    q_keep: 'Keep reading',
    q_right_mark: 'Right!',
    q_wrong_mark: 'Not this one',
    q_guess_mark: 'Your guess',
    q_turn_find: 'Turn the page to find out!',
    q_choices_n: '{n} answers to choose from.',
    q_wrong_say: 'Not this one.',
    look_here: 'Look here',
    recap_intro: 'One last quick check! Answer {n} questions to earn your Super Reader star.',
    endpaper: 'The back of the book',
    tools_label: 'Reading tools',
    read_to_me: 'Read to me',
    auto_turn: 'Turn pages for me',
    read_page: 'Read this page aloud',
    size_label: 'Story text size',
    size_0: 'Big text', size_1: 'Bigger text', size_2: 'Biggest text',
    kind_recall: 'Remember', kind_sequence: 'Story order', kind_feeling: 'Feelings', kind_cause: 'Why did it happen?',
    kind_vocab: 'Word detective', kind_predict: 'What will happen?', kind_infer: 'Think about it', kind_theme: 'The big idea',
  },
  es: {
    shelf_lead: 'Cada lección es un librito de superhéroes. Toca “Léeme” para escucharlo. Tu héroe te hace una pregunta de vez en cuando, y si dejas de leer, ¡tu héroe guarda tu lugar!',
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
    page_heading: 'Página {n}',
    q_tag: 'Pregunta del héroe',
    hero_asks: '{hero} te pregunta',
    q_super: '¡Súper lectura!',
    q_hero_says: '{hero} dice:',
    q_hint_did: '¡Buen intento! Mira otra vez la página {n} para ver qué hizo {name}.',
    q_hint_said: '¡Buen intento! Mira otra vez la página {n} para ver qué dijo {name}.',
    q_hint_ask: '¡Buen intento! La respuesta está en la página {n}.',
    q_look_page: 'Mira otra vez la página {n}.',
    q_look: '📖 Volver a la página {n}',
    q_keep: 'Seguir leyendo',
    q_right_mark: '¡Correcto!',
    q_wrong_mark: 'Esta no',
    q_guess_mark: 'Tu idea',
    q_turn_find: '¡Pasa la página para descubrirlo!',
    q_choices_n: 'Hay {n} respuestas para elegir.',
    q_wrong_say: 'Esta no.',
    look_here: 'Mira aquí',
    recap_intro: '¡Un repaso rápido! Contesta {n} preguntas para ganar tu estrella de Súper Lector.',
    endpaper: 'La parte de atrás del libro',
    tools_label: 'Herramientas de lectura',
    read_to_me: 'Léeme',
    auto_turn: 'Pasa las páginas por mí',
    read_page: 'Leer esta página en voz alta',
    size_label: 'Tamaño de la letra del cuento',
    size_0: 'Letra grande', size_1: 'Letra más grande', size_2: 'Letra enorme',
    kind_recall: 'Recuerda', kind_sequence: 'Orden del cuento', kind_feeling: 'Sentimientos', kind_cause: '¿Por qué pasó?',
    kind_vocab: 'Detective de palabras', kind_predict: '¿Qué pasará?', kind_infer: 'Piénsalo', kind_theme: 'La gran idea',
  },
};
function sbT(key, vars){
  const lang = typeof getLang === 'function' ? getLang() : 'en';
  let s = (SB_UI[lang] && SB_UI[lang][key]) || SB_UI.en[key] || key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
}
const SB_KIND_ICON = { recall: '🔎', sequence: '🔢', feeling: '💛', cause: '🔗', vocab: '📚', predict: '🔮', infer: '💡', theme: '⭐' };

function bookName(){
  return (typeof learnerName === 'function' && learnerName()) || 'Alex';
}
function sbPersonal(s){ return typeof personalizeText === 'function' ? personalizeText(s) : s; }

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

/* ---------- Books made from the lesson's story steps ---------------------- */
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
// within 2 story pages of each other. Each is asked one page AFTER the page
// that holds its answer (so it is remembering, not re-reading the line just
// above), and the hint points back to that page. 2 answer buttons for the
// youngest level, 3 otherwise.
function planQuestions(candidates, pageCount, levelIndex){
  const maxChoices = levelIndex === 0 ? 2 : 3;
  const want = Math.max(1, Math.min(5, Math.round(pageCount / 3)));
  const sorted = candidates.slice().sort((a, b) => a.storyIndex - b.storyIndex)
    .map(c => Object.assign({}, c, { placeAt: Math.min(pageCount - 1, c.storyIndex + 1) }));
  // Walk the story once, taking a question when we reach the next target
  // spot. With `rightPage`, only take ones whose question page will be a
  // right-hand page in the two-page view (the cover is page 1, so the
  // question after story page s, with k questions before it, is leaf
  // s + 2 + k).
  const greedy = rightPage => {
    const out = [];
    let last = -99;
    const gap = pageCount / (want + 1);
    for (const c of sorted){
      if (out.length >= want) break;
      const target = Math.round(gap * (out.length + 1)) - 1;
      if (c.placeAt < target - 1 || c.placeAt - last < 2) continue;
      if (rightPage && (c.placeAt + out.length) % 2 !== 0) continue;
      out.push(c); last = c.placeAt;
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

/* ---------- Questions (one shape for both kinds of book) ------------------ */
// { kind, predict, parts:[{ ask, context, choices:[{text, correct, clue, icon}], hint, why }],
//   lookLeaf, revealLeaf, clueWhy, guessWhy, stage, wrong, solved, picked, anyWrong }
function newQState(q){ return Object.assign(q, { stage: 0, wrong: [], solved: false, picked: null, anyWrong: false }); }
function resetQ(q){ newQState(q); q.parts.forEach(p => { p.choices = shuffleBookArray(p.choices.slice()); }); return q; }

function derivedQuestion(c, name, lookLeaf){
  const said = c.kind === 'said';
  const ask = c.kind === 'ask' ? c.asked : t(said ? 'bq_said' : 'bq_did', { name });
  const hintKey = c.kind === 'ask' ? 'q_hint_ask' : (said ? 'q_hint_said' : 'q_hint_did');
  return newQState({
    kind: c.kind === 'ask' ? 'infer' : 'recall', predict: false, lookLeaf,
    parts: [{ ask, context: c.context, said, hint: sbT(hintKey, { n: '{n}', name }), why: c.why,
      choices: c.choices.map(x => ({ text: x.text, correct: x.correct })) }],
  });
}

/* ---------- Hand-written picture books ------------------------------------- */
const SB_BOOK_TRIED = {};
const SB_BOOK_LOADING = {};
function loadBookStory(id){
  if (!BOOK_STORY_IDS.includes(id) || BOOK_STORIES[id]) return Promise.resolve();
  if (!SB_BOOK_LOADING[id]){
    SB_BOOK_LOADING[id] = new Promise(resolve => {
      const s = document.createElement('script');
      s.src = `content/books/${id}.js`;
      s.onload = () => resolve();
      s.onerror = () => resolve(); // fall back to the lesson-made book
      document.head.appendChild(s);
    });
  }
  return SB_BOOK_LOADING[id];
}

function buildAuthoredState(id, levelIndex, lang, name, book, meta, title){
  const lv = book.levels[Math.min(levelIndex, book.levels.length - 1)];
  const L = s => (s == null ? '' : sbPersonal(typeof s === 'string' ? s : (s[lang] != null ? s[lang] : s.en)));
  const leaves = [{ type: 'cover' }];
  const pageLeaf = {};
  const pending = [];
  lv.pages.forEach(pg => {
    pageLeaf[pg.id] = leaves.length;
    leaves.push({ type: 'story', pageId: pg.id, pic: pg.pic, paras: (pg[lang] || pg.en).map(text => ({ text: sbPersonal(text) })) });
    (lv.questions || []).filter(q => q.after === pg.id).forEach(src => {
      const leaf = { type: 'question', q: null };
      leaves.push(leaf);
      pending.push([leaf, src]);
    });
  });
  // {page:<id>} -> that page's number in this book
  const P = s => L(s).replace(/\{page:([\w-]+)\}/g, (m, k) => (pageLeaf[k] != null ? pageLeaf[k] + 1 : m));
  const part = src => ({
    ask: P(src.q), hint: P(src.hint), why: P(src.why),
    choices: shuffleBookArray((src.choices || []).map(c => ({ text: P(c), correct: !!c.ok, clue: !!c.clue, icon: c.icon || '' }))),
  });
  const toQ = src => newQState({
    kind: src.kind || 'recall', predict: src.kind === 'predict',
    lookLeaf: src.look && pageLeaf[src.look] != null ? pageLeaf[src.look] : null,
    revealLeaf: src.reveal && pageLeaf[src.reveal] != null ? pageLeaf[src.reveal] : null,
    clueWhy: P(src.clueWhy), guessWhy: P(src.guessWhy),
    parts: [part(src)].concat(src.then ? [part(src.then)] : []),
  });
  pending.forEach(([leaf, src]) => { leaf.q = toQ(src); });
  const recapQs = (lv.recap || []).map(toQ);
  if (recapQs.length) leaves.push({ type: 'recap' });
  leaves.push({ type: 'end' });
  return {
    id, level: levelIndex, lang, name, theme: meta.theme, title,
    leaves, recap: (lv.learned && (lv.learned[lang] || lv.learned.en) || []).map(sbPersonal), quiz: newQuiz(recapQs),
    leaf: 0, returnTo: null, lookTarget: null, resumeAsked: false, spread: null,
    pictureMode: true, scenes: book.scenes || {}, coverPic: book.cover || null, picBase: `${BOOK_PIC_BASE}${id}/`, authored: true,
  };
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

/* ---------- Reading preferences --------------------------------------------- */
const BOOK_TEXT_KEY = 'safetylib_book_text_v1';
const BOOK_READ_KEY = 'safetylib_book_read_v1';
const SB_SCALES = [1, 1.2, 1.42];
function sbTextSize(){
  try { const n = parseInt(localStorage.getItem(BOOK_TEXT_KEY), 10); return n >= 0 && n < SB_SCALES.length ? n : 0; } catch (e){ return 0; }
}
function setSbTextSize(n){ try { localStorage.setItem(BOOK_TEXT_KEY, String(n)); } catch (e){} }
function sbReadPrefs(){
  let p = null;
  try { p = JSON.parse(localStorage.getItem(BOOK_READ_KEY)); } catch (e){ p = null; }
  if (!p || typeof p !== 'object') p = { on: typeof isAutoRead === 'function' && isAutoRead(), auto: false };
  return { on: !!p.on && sbCanSpeak(), auto: !!p.auto };
}
function setSbReadPrefs(p){ try { localStorage.setItem(BOOK_READ_KEY, JSON.stringify({ on: !!p.on, auto: !!p.auto })); } catch (e){} }
function sbCanSpeak(){ return typeof SPEECH_SUPPORTED !== 'undefined' && SPEECH_SUPPORTED && typeof speakQueue === 'function'; }

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
function sbPortrait(st, size){
  return typeof heroPortraitHtml === 'function' ? heroPortraitHtml(st.id, getLang(), st.theme, size) : '';
}

function bookGrades(i){ return t(['level1_desc', 'level2_desc', 'level3_desc'][i]).split(' — ')[0]; }

/* ---------- Pictures --------------------------------------------------------- */
// A picture that isn't painted yet (or fails to load) never shows a broken
// image: the soft painted-meadow vignette under it stays instead, and the
// figure is hidden from screen readers. Results are remembered so a missing
// file is only asked for once.
const SB_PIC_STATE = new Map(); // url -> 'ok' | 'missing'
function sbVignette(){
  return `<svg class="sb-pic__art" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <rect width="300" height="200" fill="#d3e9f6"/><rect y="70" width="300" height="130" fill="#e4f1f0"/><rect y="110" width="300" height="90" fill="#eef6ee"/>
    <circle cx="246" cy="44" r="20" fill="#ffe7a3"/>
    <g fill="#fff" opacity=".85"><ellipse cx="70" cy="46" rx="30" ry="10"/><ellipse cx="88" cy="40" rx="18" ry="10"/><ellipse cx="190" cy="70" rx="24" ry="8"/></g>
    <path d="M0 140 C60 112 120 120 170 132 S260 112 300 122 V200 H0Z" fill="#c9e0a8"/>
    <path d="M0 162 C70 146 140 150 200 160 S270 152 300 158 V200 H0Z" fill="#a9cf86"/>
    <g transform="translate(118 58) rotate(-12)"><path d="M0 -16 L12 0 L0 20 L-12 0Z" fill="currentColor" opacity=".55"/><path d="M0 20 C4 34 -6 42 2 56" stroke="currentColor" stroke-width="1.6" fill="none" opacity=".45"/></g>
  </svg>`;
}
function sbPicHtml(st, sceneId, cls, fallbackHtml){
  const sc = sceneId && st.scenes && st.scenes[sceneId];
  if (!sc || !sc.file) return '';
  const url = st.picBase + sc.file;
  const alt = sbPersonal((sc.alt && (sc.alt[getLang()] || sc.alt.en)) || '');
  const under = fallbackHtml || sbVignette();
  const state = SB_PIC_STATE.get(url);
  if (state === 'missing') return `<figure class="sb-pic is-missing ${cls || ''}" aria-hidden="true">${under}</figure>`;
  return `<figure class="sb-pic ${state === 'ok' ? 'is-loaded' : ''} ${cls || ''}" data-pic="${escapeHtml(url)}">${under}<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" decoding="async"></figure>`;
}
function wirePics(root){
  root.querySelectorAll('figure[data-pic]').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    const url = fig.getAttribute('data-pic');
    const ok = () => { SB_PIC_STATE.set(url, 'ok'); fig.classList.add('is-loaded'); };
    const bad = () => {
      SB_PIC_STATE.set(url, 'missing');
      fig.classList.add('is-missing'); fig.classList.remove('is-loaded');
      fig.setAttribute('aria-hidden', 'true');
      img.remove();
    };
    if (img.complete){ if (img.naturalWidth) ok(); else bad(); }
    else { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', bad, { once: true }); }
  });
}

/* ---------- Bookshelf ------------------------------------------------------- */
function renderBookshelf(root, lang){
  sbParkBreakButton();
  document.body.removeAttribute('data-sb-view');
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
// The story text size in px (root size × book size × a little more for
// the youngest book), matching css/storybook.css.
function sbStoryPx(st){
  const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const lv = st && st.level === 0 ? 1.1 : 1;
  return fs * 1.75 * SB_SCALES[sbTextSize()] * lv;
}
// Two pages side by side only when the words page still gets a comfortable
// line of story text (about 15 of its letters wide) at the chosen text size.
// Returns the share of the width the words page gets (0 = one page only).
// Picture books may give the words up to 64% (the picture page gets
// narrower); word-only books keep two equal pages.
function sbSpreadPlan(st){
  const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const bookW = Math.min(window.innerWidth - 40, fs * 80) - 24;
  const need = 15 * sbStoryPx(st) + 90;
  if (st && st.pictureMode){ const f = Math.max(0.5, need / bookW); return f <= 0.64 ? f : 0; }
  return bookW >= 2 * need ? 0.5 : 0;
}
function sbWantsSpread(st){ return sbSpreadPlan(st) > 0; }

function newQuiz(qs){ return { qs, i: 0, done: false }; }

function buildBookState(id, levelIndex, lang, name, content, meta){
  const book = BOOK_STORIES[id];
  if (book && book.levels && book.levels.length) return buildAuthoredState(id, levelIndex, lang, name, book, meta, content.title);
  const built = buildBookPages(content, levelIndex, name);
  const plan = planQuestions(built.candidates, built.pages.length, levelIndex);
  const leaves = [{ type: 'cover' }];
  const storyLeaf = [];
  built.pages.forEach((paras, i) => {
    storyLeaf[i] = leaves.length;
    leaves.push({ type: 'story', paras });
    const q = plan.inline.find(x => x.placeAt === i);
    if (q) leaves.push({ type: 'question', q: derivedQuestion(q, name, storyLeaf[q.storyIndex]) });
  });
  const recapQs = plan.recap.map(q => derivedQuestion(q, name, storyLeaf[q.storyIndex]));
  if (recapQs.length) leaves.push({ type: 'recap' });
  leaves.push({ type: 'end' });
  return {
    id, level: levelIndex, lang, name, theme: meta.theme, title: content.title,
    leaves, recap: built.recap, quiz: newQuiz(recapQs),
    leaf: 0, returnTo: null, lookTarget: null, resumeAsked: false, spread: null, pictureMode: false,
  };
}

// Which leaves are shown together. Picture books: one page per spread (the
// picture is the left page). Other books: cover alone, then pairs.
function sbSpreads(st){
  const n = st.leaves.length;
  if (st.pictureMode) return st.leaves.map((l, i) => [i]);
  const s = [[0]];
  for (let i = 1; i < n; i += 2) s.push(i + 1 < n ? [i, i + 1] : [i]);
  return s;
}
function sbVisible(st){
  if (!st.spread) return [st.leaf];
  return sbSpreads(st).find(sp => sp.includes(st.leaf)) || [st.leaf];
}

/* ---------- Main render ----------------------------------------------------- */
function renderStoryBook(){
  const root = document.querySelector('[data-book-root]');
  if (!root) return;
  const lang = getLang();
  const q = new URLSearchParams(location.search);
  const id = q.get('id');
  const levelIndex = Math.max(0, Math.min(2, parseInt(q.get('level'), 10) || 0));
  sbStopReading();
  if (!id){ bookState = null; renderBookshelf(root, lang); return; }

  const meta = getTopicMeta(id);
  if (!meta){ root.innerHTML = `<section class="hero"><h1>${escapeHtml(t('book_missing'))}</h1><p><a class="btn btn-primary" href="storybook.html">${escapeHtml(t('book_back_shelf'))}</a></p></section>`; return; }
  const content = getTopicContent(id, lang);
  const needBook = BOOK_STORY_IDS.includes(id) && !BOOK_STORIES[id] && !SB_BOOK_TRIED[id];
  if (!content || needBook){
    if (!root.querySelector('.sb')) root.innerHTML = `<div class="card"><p role="status">${escapeHtml(t('review_loading'))}</p></div>`;
    Promise.all([content ? null : ensureTopicContentLoaded(id), loadBookStory(id)]).then(() => {
      SB_BOOK_TRIED[id] = true;
      renderStoryBook();
    }).catch(() => {
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
  document.title = `${st.title} — ${t('book_shelf_title')}`;

  if (!st.resumeAsked){
    st.resumeAsked = true;
    const bm = getBookmark(id, levelIndex);
    if (bookInProgress(bm) && bm.page < st.leaves.length - 1){ renderResume(root, st, bm.page); return; }
  }
  renderBookShell(root, st);
}

function renderResume(root, st, page){
  sbParkBreakButton();
  document.body.removeAttribute('data-sb-view');
  root.innerHTML = `
    <section class="sb-resume" data-theme="${st.theme}" aria-labelledby="sb-resume-title">
      <div class="sb-resume__art" aria-hidden="true">
        ${sbPortrait(st, 132)}
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
    renderBookShell(root, st, { focusLeaf: true, read: true });
  });
  root.querySelector('[data-resume-restart]').addEventListener('click', () => {
    st.leaf = 0;
    saveBookmark(st.id, st.level, 0, st.leaves.length);
    renderBookShell(root, st, { focusLeaf: true, read: true });
  });
  const go = root.querySelector('[data-resume-go]');
  if (go) go.focus({ preventScroll: true });
}

// The app's floating "I need a break" button sits in the book's toolbar
// while a book is open (so it never covers Next), and goes back to its
// usual corner on the bookshelf.
function sbParkBreakButton(){
  const b = document.querySelector('[data-calmspace-btn]');
  if (b && b.parentNode !== document.body){ b.classList.remove('calmspace-btn--inline'); document.body.appendChild(b); }
}
function sbDockBreakButton(root){
  const b = document.querySelector('[data-calmspace-btn]');
  const slot = root.querySelector('[data-sb-break-slot]');
  if (b && slot){ b.classList.add('calmspace-btn--inline'); slot.appendChild(b); }
}
// Height of the sticky site header, so the book fills the rest of the screen.
function sbMeasureHeader(){
  const hdr = document.querySelector('.site-header');
  const sticky = hdr && /sticky|fixed/.test(getComputedStyle(hdr).position);
  document.body.style.setProperty('--sb-hdr', (sticky ? hdr.offsetHeight : 0) + 'px');
}

function sbToolsHtml(st){
  const prefs = sbReadPrefs();
  const size = sbTextSize();
  const speak = sbCanSpeak();
  return `<div class="sb-tools" role="group" aria-label="${escapeHtml(sbT('tools_label'))}">
    ${speak ? `<button type="button" class="sb-tool" data-sb-readto aria-pressed="${prefs.on}"><span class="sb-tool__icon" aria-hidden="true">🔊</span> <span>${escapeHtml(sbT('read_to_me'))}</span><span class="sb-tool__state" aria-hidden="true"></span></button>` : ''}
    ${speak ? `<button type="button" class="sb-tool" data-sb-auto aria-pressed="${prefs.auto}" ${prefs.on ? '' : 'hidden'}><span class="sb-tool__icon" aria-hidden="true">⏩</span> <span>${escapeHtml(sbT('auto_turn'))}</span><span class="sb-tool__state" aria-hidden="true"></span></button>` : ''}
    <div class="sb-size" role="group" aria-label="${escapeHtml(sbT('size_label'))}">
      ${SB_SCALES.map((s, k) => `<button type="button" class="sb-size__btn sb-size__btn--${k}" data-sb-size="${k}" aria-pressed="${k === size}" aria-label="${escapeHtml(sbT('size_' + k))}">A${'+'.repeat(k)}</button>`).join('')}
    </div>
    <span class="sb-break-slot" data-sb-break-slot></span>
  </div>`;
}

function renderBookShell(root, st, opts){
  opts = opts || {};
  sbParkBreakButton();
  document.body.setAttribute('data-sb-view', 'book');
  sbMeasureHeader();
  st.textFrac = sbSpreadPlan(st);
  st.spread = st.textFrac > 0;
  const lv = st.level === 0 ? 1.1 : 1;
  root.innerHTML = `
    <div class="sb ${st.pictureMode ? 'sb--pictures' : 'sb--words'} sb--lv${st.level + 1}" data-theme="${st.theme}" style="--sb-scale:${SB_SCALES[sbTextSize()]};--sb-lv:${lv}">
      <div class="sb-toolbar">
        <div class="sb-toolbar__head">
          <a class="sb-toolbar__shelf" href="storybook.html"><span aria-hidden="true">←</span> ${escapeHtml(t('book_back_shelf'))}</a>
          <h1 class="sb-toolbar__title">${escapeHtml(st.title)} <span>· ${escapeHtml(t('book_level_btn', { n: st.level + 1 }))}</span></h1>
        </div>
        ${sbToolsHtml(st)}
      </div>
      <div class="sb-returnbar" data-sb-returnbar hidden>
        <button type="button" class="btn btn-primary sb-big-btn" data-sb-return>${escapeHtml(t('bq_back_to_q'))}</button>
      </div>
      <div class="sb-stage" data-sb-stage>
        <div class="sb-book" data-sb-book role="region" aria-roledescription="${escapeHtml(sbT('book_role'))}" aria-label="${escapeHtml(sbT('book_label', { title: st.title, n: st.level + 1 }))}"></div>
      </div>
      <nav class="sb-nav" aria-label="${escapeHtml(t('book_nav_label'))}">
        <button type="button" class="btn btn-secondary sb-nav__btn" data-sb-prev><span aria-hidden="true">←</span> ${escapeHtml(t('book_prev'))}</button>
        <div class="sb-nav__mid">
          <p class="sb-nav__status" data-sb-status></p>
          <div class="sb-dots" data-sb-dots aria-hidden="true"></div>
        </div>
        <button type="button" class="btn btn-primary sb-nav__btn" data-sb-next><span data-sb-next-label></span> <span aria-hidden="true">→</span></button>
      </nav>
      <p class="visually-hidden" data-sb-announce aria-live="polite" aria-atomic="true"></p>
    </div>`;
  sbDockBreakButton(root);

  const go = (d, how) => {
    sbStopReading();
    const sp = sbSpreads(st);
    let target;
    if (st.spread){
      const k = sp.findIndex(s => s.includes(st.leaf));
      const nk = Math.max(0, Math.min(sp.length - 1, k + d));
      if (nk === k) return;
      target = sp[nk][0];
    } else {
      target = Math.max(0, Math.min(st.leaves.length - 1, st.leaf + d));
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
  wireTools(root, st);
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
  updateBook(st, { focusLeaf: opts.focusLeaf, read: opts.read, focusSel: opts.focusSel });
}

function wireTools(root, st){
  const readBtn = root.querySelector('[data-sb-readto]');
  const autoBtn = root.querySelector('[data-sb-auto]');
  if (readBtn) readBtn.addEventListener('click', () => {
    const p = sbReadPrefs();
    p.on = !p.on;
    setSbReadPrefs(p);
    readBtn.setAttribute('aria-pressed', String(p.on));
    if (autoBtn) autoBtn.hidden = !p.on;
    if (p.on) sbReadVisible(st); else sbStopReading();
  });
  if (autoBtn) autoBtn.addEventListener('click', () => {
    const p = sbReadPrefs();
    p.auto = !p.auto;
    setSbReadPrefs(p);
    autoBtn.setAttribute('aria-pressed', String(p.auto));
    if (!p.auto) clearTimeout(st.autoTimer);
    else if (!sbIsSpeaking()) sbAfterRead(st);
  });
  root.querySelectorAll('[data-sb-size]').forEach(btn => btn.addEventListener('click', () => {
    const k = parseInt(btn.dataset.sbSize, 10);
    if (k === sbTextSize()) return;
    setSbTextSize(k);
    renderBookShell(root, st, { focusSel: `[data-sb-size="${k}"]` });
  }));
}

// Shows the spread / page holding `leaf`; turns the page only if needed.
function showLeaf(st, leaf, opts){
  if (sbVisible(st).includes(leaf)){
    st.leaf = st.spread ? st.leaf : leaf;
    updateBook(st, { focusLeafIndex: opts && opts.focus ? leaf : null, noTurn: true });
    return;
  }
  sbStopReading();
  turnTo(st, leaf, { dir: leaf > st.leaf ? 1 : -1, how: 'jump', focusLeafIndex: opts && opts.focus ? leaf : null });
}

function turnTo(st, leaf, opts){
  st.leaf = leaf;
  updateBook(st, Object.assign({ read: true }, opts));
}

/* ---------- Leaf HTML ------------------------------------------------------- */
function leafLabel(st, i){ return t('book_page_of', { n: i + 1, total: st.leaves.length }); }

// Text split into sentences, each in its own span, so "Read to me" can
// highlight the sentence being read.
function sbSentenceSplit(text){
  return String(text).match(/[^.!?…]+(?:[.!?…]+[”"»’)]*|$)\s*/g) || [String(text)];
}
function sbSentencesHtml(text){
  return sbSentenceSplit(text).filter(s => s.trim()).map(s => `<span class="sb-s">${escapeHtml(s.trim())}</span>`).join(' ');
}

function storyTextHtml(st, leaf, i){
  const looking = st.lookTarget === i;
  const tagAll = looking && !leaf.paras.some(p => /book-safe/.test(p.cls || ''));
  return `<div class="sb-text ${looking ? 'is-lookback' : ''} ${tagAll ? 'is-lookback-all' : ''}">
    ${tagAll ? `<p class="sb-look-tag sb-look-tag--block"><span aria-hidden="true">👀</span> ${escapeHtml(sbT('look_here'))}</p>` : ''}
    ${leaf.paras.map(p => {
      const tag = looking && /book-safe/.test(p.cls || '') ? `<span class="sb-look-tag"><span aria-hidden="true">👀</span> ${escapeHtml(sbT('look_here'))}</span> ` : '';
      const speaker = p.speaker ? `<span class="book-speaker sb-s">${escapeHtml(p.speaker)}:</span> ` : '';
      return `<p class="book-p sb-p ${p.cls || ''}">${tag}${speaker}${sbSentencesHtml(p.speaker ? `“${p.text}”` : p.text)}</p>`;
    }).join('')}
  </div>`;
}

function leafHtml(st, i, side){
  const leaf = st.leaves[i];
  const name = st.name;
  const lang = getLang();
  let inner = '';
  let readable = true;
  if (leaf.type === 'cover'){
    const hero = sbHeroName(st.id, lang);
    const portrait = `<div class="sb-cover__hero">${sbPortrait(st, 150)}</div>`;
    const art = st.pictureMode && st.coverPic ? sbPicHtml(st, st.coverPic, 'sb-pic--cover', portrait) : portrait;
    inner = `
      <div class="sb-cover">
        <p class="sb-cover__series">${escapeHtml(t('book_series'))}</p>
        <h2 class="sb-cover__title"><span class="sb-s">${escapeHtml(st.title)}</span></h2>
        <div class="sb-cover__art">${art}</div>
        ${hero ? `<p class="sb-cover__with"><span class="sb-s">${escapeHtml(sbT('with_hero', { hero }))}</span></p>` : ''}
        <p class="sb-cover__level">${escapeHtml(t('book_level_btn', { n: st.level + 1 }))} · ${escapeHtml(bookGrades(st.level))}</p>
        <p class="sb-cover__starring"><span class="sb-s">${escapeHtml(t('book_starring', { name }))}</span></p>
      </div>`;
  } else if (leaf.type === 'end'){
    // In a picture-book spread "The End" and the buttons sit on the left
    // page (artLeafHtml) and this page holds what we learned.
    const split = side === 'right' && st.pictureMode && st.recap.length;
    inner = `
      <div class="sb-end">
        ${split ? '' : `<h2 class="sb-end__title"><span class="sb-s">${escapeHtml(t('book_the_end'))}</span></h2>
        <div class="sb-end__hero" aria-hidden="true">${sbPortrait(st, 110)}</div>`}
        ${st.recap.length ? `<h3 class="sb-end__heading"><span class="sb-s">${escapeHtml(t('book_learned'))}</span></h3>
          <ul class="sb-end__list">${st.recap.map(r => `<li>${sbSentencesHtml(r)}</li>`).join('')}</ul>` : ''}
        ${split ? '' : endActionsHtml(st)}
      </div>`;
  } else if (leaf.type === 'story'){
    const pic = st.pictureMode && side === 'solo' && leaf.pic ? sbPicHtml(st, leaf.pic, 'sb-pic--top') : '';
    inner = `<h2 class="visually-hidden">${escapeHtml(sbT('page_heading', { n: i + 1 }))}</h2>${pic}${storyTextHtml(st, leaf, i)}`;
  } else if (leaf.type === 'question'){
    inner = questionLeafHtml(st, leaf.q, i);
  } else if (leaf.type === 'recap'){
    readable = !st.quiz.done;
    inner = recapHtml(st, i);
  }
  const tools = readable && sbCanSpeak() ? `<div class="sb-leaf__tools"><button type="button" class="speak-btn sb-speak" data-sb-speak aria-label="${escapeHtml(sbT('read_page'))}" title="${escapeHtml(sbT('read_page'))}"><span aria-hidden="true">🔊</span></button></div>` : '';
  return `<section class="sb-leaf sb-leaf--${side} sb-leaf--${leaf.type}" data-leaf="${i}" tabindex="-1" aria-label="${escapeHtml(leafLabel(st, i))}">
    <div class="sb-leaf__inner">${tools}${inner}</div>
    <p class="sb-leaf__num" aria-hidden="true">${i + 1}</p>
  </section>`;
}

function endActionsHtml(st){
  return `<div class="sb-end__actions">
    <button type="button" class="btn btn-secondary" data-book-restart>↺ ${escapeHtml(t('book_read_again'))}</button>
    <a class="btn btn-primary" href="topic.html?id=${encodeURIComponent(st.id)}">${escapeHtml(t('book_play_lesson'))}</a>
    <a class="btn btn-secondary" href="storybook.html">${escapeHtml(t('book_back_shelf'))}</a>
  </div>`;
}

// The left page of a picture-book spread: the page's picture, or the hero.
function artLeafHtml(st, i){
  const leaf = st.leaves[i];
  let inner = '';
  if (leaf.type === 'end' && st.recap.length){
    inner = `<div class="sb-art sb-art--end">
      <h2 class="sb-end__title"><span class="sb-s">${escapeHtml(t('book_the_end'))}</span></h2>
      <div class="sb-art__hero" aria-hidden="true">${sbPortrait(st, 200)}</div>
      ${endActionsHtml(st)}
    </div>`;
  } else if (leaf.type === 'story' && leaf.pic){
    inner = sbPicHtml(st, leaf.pic, 'sb-pic--page');
  } else {
    const kind = leaf.type === 'question' ? leaf.q.kind : '';
    inner = `<div class="sb-art" aria-hidden="true">
      <div class="sb-art__hero">${sbPortrait(st, 200)}</div>
      ${kind && sbHeroName(st.id, getLang()) ? `<p class="sb-art__kind">${escapeHtml(sbT('hero_asks', { hero: sbHeroName(st.id, getLang()) }))}</p>` : ''}
      ${leaf.type === 'recap' ? `<p class="sb-art__kind"><span>⭐</span> ${escapeHtml(t('bq_title').replace(/^\S+\s/, ''))}</p>` : ''}
    </div>`;
    if (!inner.includes('hero-portrait')) inner = '';
  }
  if (!inner) inner = `<div class="sb-art" aria-hidden="true">${sbVignette()}</div>`;
  return `<div class="sb-leaf sb-leaf--left sb-leaf--art sb-leaf--art-${leaf.type}" data-art="${i}">${inner}</div>`;
}

function blankLeafHtml(st){
  return `<div class="sb-leaf sb-leaf--right sb-leaf--blank" aria-hidden="true">
    <div class="sb-endpaper">${sbHeroHead(st.id, st.theme)}</div>
  </div>`;
}

function choiceButtons(q, part, active){
  const stageDone = !active;
  return part.choices.map((c, k) => {
    const isWrong = active && q.wrong.includes(k);
    const isRight = (stageDone || q.solved) && c.correct && !q.predict;
    const isGuess = q.predict && q.picked === k;
    const locked = isWrong || stageDone || q.solved;
    const mark = isRight ? `<span class="sb-choice__mark"><span aria-hidden="true">✅</span> ${escapeHtml(sbT('q_right_mark'))}</span>`
      : isWrong ? `<span class="sb-choice__mark"><span aria-hidden="true">✖</span> ${escapeHtml(sbT('q_wrong_mark'))}</span>`
      : isGuess ? `<span class="sb-choice__mark"><span aria-hidden="true">🔮</span> ${escapeHtml(sbT('q_guess_mark'))}</span>` : '';
    const text = part.said ? `“${c.text}”` : c.text;
    return `<button type="button" class="sb-choice ${isWrong ? 'is-wrong' : ''} ${isRight ? 'is-right' : ''} ${isGuess ? 'is-guess' : ''}" data-choice="${k}" ${locked ? 'disabled' : ''}>
      ${c.icon ? `<span class="sb-choice__icon" aria-hidden="true">${c.icon}</span>` : ''}
      <span class="sb-choice__text"><span class="sb-s">${escapeHtml(text)}</span></span>
      ${mark}
    </button>`;
  }).join('');
}

function cheerHtml(st, why){
  const hero = sbHeroName(st.id, getLang());
  return `<div class="sb-cheer" data-say-now>
    ${sbHeroHead(st.id, st.theme)}
    <p class="sb-cheer__bubble">${hero ? `<span class="visually-hidden">${escapeHtml(sbT('q_hero_says', { hero }))} </span>` : ''}<strong class="sb-s">${escapeHtml(sbT('q_super'))}</strong> <span aria-hidden="true">⭐</span>${why ? ` ${sbSentencesHtml(why)}` : ''}</p>
    <span class="sb-sparkles" aria-hidden="true"><i>⭐</i><i>✨</i><i>⭐</i></span>
  </div>`;
}

function hintText(q, part){
  const n = q.lookLeaf != null ? q.lookLeaf + 1 : null;
  let h = part.hint || '';
  if (n == null) return h.replace(/\s*\{n\}/g, '');
  if (/\{n\}/.test(h)) return h.replace(/\{n\}/g, n);
  return `${h} ${sbT('q_look_page', { n })}`.trim();
}

// The question body (inline questions and the end-of-book challenge).
// `after` is what goes under it once it is solved (Keep reading / Next).
function questionBodyHtml(st, q, idBase, afterHtml){
  const parts = q.parts;
  const ctx = parts[0].context;
  let html = ctx ? `<p class="book-p sb-p book-think sb-q__context">${sbSentencesHtml(ctx)}</p>` : '';
  parts.forEach((part, p) => {
    if (p > q.stage) return;
    const active = p === q.stage && !q.solved;
    const done = p < q.stage || q.solved;
    const right = part.choices.find(c => c.correct);
    const justDone = done && p === q.stage - 1;   // the first part, just answered
    html += `<div class="sb-q__part" data-part="${p}" ${p === q.stage && p > 0 && !q.solved ? 'data-say-now' : ''}>
      <p class="sb-q__ask" id="${idBase}-${p}"><span class="sb-s">${escapeHtml(part.ask)}</span></p>
      ${done && p < parts.length - 1 && right && !q.predict
        ? `<p class="sb-q__done" ${justDone ? 'data-say-now' : ''}><span aria-hidden="true">✅</span> <strong class="sb-s">${escapeHtml(right.text)}${/[.!?…”"»]$/.test(right.text) ? '' : '.'}</strong>${part.why ? ` ${sbSentencesHtml(part.why)}` : ''}</p>`
        : `<div class="sb-choices" role="group" aria-labelledby="${idBase}-${p}">${choiceButtons(q, part, active)}</div>`}
    </div>`;
  });
  const part = parts[Math.min(q.stage, parts.length - 1)];
  let fb = '';
  if (q.solved && q.predict){
    const pick = part.choices[q.picked] || {};
    fb = `<div class="sb-cheer" data-say-now>${sbHeroHead(st.id, st.theme)}<p class="sb-cheer__bubble">${sbSentencesHtml(pick.clue ? q.clueWhy : q.guessWhy)} <strong class="sb-s">${escapeHtml(sbT('q_turn_find'))}</strong></p></div>${afterHtml}`;
  } else if (q.solved){
    fb = `${cheerHtml(st, part.why)}${afterHtml}`;
  } else if (q.wrong.length){
    fb = `<p class="sb-hint" data-say-now>${sbSentencesHtml(hintText(q, part))}</p>
      ${q.lookLeaf != null ? `<button type="button" class="btn btn-secondary sb-big-btn" data-q-look>${escapeHtml(sbT('q_look', { n: q.lookLeaf + 1 }))}</button>` : ''}`;
  }
  return `${html}<div class="sb-fb">${fb}</div>`;
}

function questionLeafHtml(st, q, i){
  const keep = `<button type="button" class="btn btn-primary sb-big-btn" data-q-keep>${escapeHtml(sbT('q_keep'))} <span aria-hidden="true">→</span></button>`;
  return `<div class="sb-q">
    <h2 class="sb-q__tag">${sbHeroHead(st.id, st.theme)} <span class="sb-s">${escapeHtml(sbT('q_tag'))}</span><span class="sb-q__kind"><span aria-hidden="true">${SB_KIND_ICON[q.kind] || ''}</span> ${escapeHtml(sbT('kind_' + q.kind))}</span></h2>
    ${questionBodyHtml(st, q, `sb-q-${i}`, keep)}
  </div>`;
}

function recapScore(st){
  // Questions skipped while reading (and guesses) are left out of the score.
  const inline = st.leaves.filter(l => l.type === 'question' && !l.q.predict && (l.q.solved || l.q.anyWrong)).map(l => l.q);
  const all = inline.concat(st.quiz.qs.filter(q => q.solved));
  return { n: all.filter(q => q.solved && !q.anyWrong).length, total: inline.length + st.quiz.qs.length };
}

function recapHtml(st, i){
  const qz = st.quiz;
  const title = `<h2 class="sb-recap__title"><span class="sb-s">${escapeHtml(t('bq_title'))}</span></h2>`;
  if (qz.done){
    const sc = recapScore(st);
    return `<div class="sb-recap sb-recap--done" data-say-now>${title}
      <div class="sb-recap__medal" aria-hidden="true">⭐</div>
      <p class="sb-recap__done-title"><span class="sb-s">${escapeHtml(t('bq_done_title'))}</span></p>
      <p><span class="sb-s">${escapeHtml(t('bq_done_score', { n: sc.n, total: sc.total }))}</span></p>
      <p class="sb-recap__stars" aria-hidden="true">${'⭐'.repeat(sc.n)}${'☆'.repeat(Math.max(0, sc.total - sc.n))}</p>
      <button type="button" class="btn btn-secondary" data-bq-again>${escapeHtml(t('bq_again'))}</button>
    </div>`;
  }
  const q = qz.qs[qz.i];
  const fresh = qz.i === 0 && !q.wrong.length && !q.solved && !q.stage;
  const next = `<button type="button" class="btn btn-primary sb-big-btn" data-bq-next>${escapeHtml(qz.i + 1 < qz.qs.length ? t('bq_next') : t('bq_finish'))} <span aria-hidden="true">→</span></button>`;
  return `<div class="sb-recap sb-q">${title}
    ${fresh ? `<p class="sb-recap__intro">${sbSentencesHtml(sbT('recap_intro', { n: qz.qs.length }))}</p>` : ''}
    <p class="sb-recap__progress"><span class="sb-s">${escapeHtml(t('bq_progress', { n: qz.i + 1, total: qz.qs.length }))}</span></p>
    ${questionBodyHtml(st, q, `sb-recap-q`, next)}
  </div>`;
}

/* ---------- Updating the open book ----------------------------------------- */
function sbAnnounce(text){
  const el = document.querySelector('[data-sb-announce]');
  if (!el) return;
  el.textContent = '';
  clearTimeout(sbAnnounce.t);
  const clean = String(text).replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/\s+/g, ' ').trim();
  sbAnnounce.t = setTimeout(() => { el.textContent = clean; }, 60);
}
function sbLeafSummary(st, i){
  const leaf = st.leaves[i];
  if (leaf.type === 'story') return leaf.paras.map(p => (p.speaker ? `${p.speaker}: ` : '') + p.text).join(' ');
  if (leaf.type === 'cover') return st.title;
  if (leaf.type === 'end') return t('book_the_end');
  const q = leaf.type === 'question' ? leaf.q : (!st.quiz.done ? st.quiz.qs[st.quiz.i] : null);
  if (!q) return '';
  const part = q.parts[Math.min(q.stage, q.parts.length - 1)];
  const head = leaf.type === 'question' ? `${sbT('q_tag')}, ${sbT('kind_' + q.kind)}.` : `${t('bq_title').replace(/^\S+\s/, '')}.`;
  return `${head} ${part.ask} ${q.solved ? '' : sbT('q_choices_n', { n: part.choices.length })}`;
}

function updateBook(st, opts){
  opts = opts || {};
  const root = document.querySelector('[data-book-root]');
  const book = root && root.querySelector('[data-sb-book]');
  if (!book) return;
  if (st.animCleanup) st.animCleanup();
  clearTimeout(st.autoTimer);
  if (!opts.noTurn) sbStopReading();

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
  book.classList.toggle('is-picture', !!(st.pictureMode && isPair));
  book.style.gridTemplateColumns = st.pictureMode && isPair && st.textFrac > 0.5 ? `${(1 - st.textFrac).toFixed(3)}fr ${st.textFrac.toFixed(3)}fr` : '';
  if (isPair && st.pictureMode){
    book.innerHTML = artLeafHtml(st, visible[0]) + leafHtml(st, visible[0], 'right');
  } else if (isPair){
    book.innerHTML = leafHtml(st, visible[0], 'left') + (visible[1] != null ? leafHtml(st, visible[1], 'right') : blankLeafHtml(st));
  } else {
    book.innerHTML = leafHtml(st, visible[0], visible[0] === 0 ? 'cover' : 'solo');
  }
  wirePics(book);
  book.querySelectorAll('.sb-leaf[data-leaf]').forEach(el => wireLeaf(st, el, parseInt(el.dataset.leaf, 10)));
  book.querySelectorAll('.sb-leaf[data-art]').forEach(el => wireRestart(st, el));

  // Nav state
  const prev = root.querySelector('[data-sb-prev]');
  const next = root.querySelector('[data-sb-next]');
  const atStart = visible.includes(0);
  const atEnd = visible.includes(n - 1);
  prev.disabled = atStart;
  next.disabled = atEnd;
  sbNextLabel(st, root);
  const status = visible.length > 1
    ? sbT('pages_of', { a: visible[0] + 1, b: visible[1] + 1, total: n })
    : t('book_page_of', { n: visible[0] + 1, total: n });
  root.querySelector('[data-sb-status]').textContent = status;
  root.querySelector('[data-sb-dots]').innerHTML = st.leaves.map((l, i) =>
    `<span class="${visible.includes(i) ? 'is-on' : ''} ${l.type === 'question' || l.type === 'recap' ? 'is-q' : ''}"></span>`).join('');
  const ret = root.querySelector('[data-sb-returnbar]');
  ret.hidden = !(st.returnTo != null && !visible.includes(st.returnTo));

  // Bookmark: the page you are on, or "finished" once The End is open.
  if (atEnd) finishBookmark(st.id, st.level);
  else saveBookmark(st.id, st.level, visible[0], n);

  if (!opts.noTurn && opts.dir && oldLeaves.length) animateTurn(st, book, oldClones, oldBoxes, oldWasPair, isPair, opts.dir);

  // Focus
  let focusEl = null;
  if (opts.focusSel) focusEl = root.querySelector(opts.focusSel);
  else if (opts.focusLeafIndex != null) focusEl = book.querySelector(`[data-leaf="${opts.focusLeafIndex}"]`);
  else if (opts.focusLeaf) focusEl = book.querySelector('.sb-leaf[data-leaf]');
  const ae = document.activeElement;
  if (!focusEl && (!ae || ae === document.body || !document.contains(ae) || ae.disabled)){
    if (opts.how) focusEl = book.querySelector('.sb-leaf[data-leaf]');
  }
  if (focusEl) focusEl.focus({ preventScroll: true });

  // Tell screen readers which page this is (and, when the book isn't
  // reading itself aloud, what it says).
  if (!opts.noTurn){
    const reading = sbReadPrefs().on;
    sbAnnounce(reading ? status : `${status}. ${visible.map(i => sbLeafSummary(st, i)).filter(Boolean).join(' ')}`);
  }

  // After a turn, bring the top of the book back into view (below the
  // sticky site header) so the new page is read from its start.
  if (!opts.noTurn && opts.how){
    const hdr = document.querySelector('.site-header');
    const pos = hdr ? getComputedStyle(hdr).position : '';
    const off = (pos === 'sticky' || pos === 'fixed') ? Math.max(0, hdr.getBoundingClientRect().bottom) : 0;
    const narrow = window.innerWidth < 700;
    const target = root.querySelector(narrow ? '.sb-stage' : '.sb-toolbar');
    const r = target.getBoundingClientRect();
    if (r.top < off || (narrow && Math.abs(r.top - off) > 8)) window.scrollTo({ top: window.scrollY + r.top - off - 8, behavior: sbReducedMotion() ? 'auto' : 'smooth' });
  }

  if (opts.read && sbReadPrefs().on){
    clearTimeout(st.readTimer);
    st.readTimer = setTimeout(() => sbReadVisible(st), sbReducedMotion() ? 150 : 500);
  }
}

function sbNextLabel(st, root){
  const visible = sbVisible(st);
  const label = root.querySelector('[data-sb-next-label]');
  if (!label) return;
  const showsUnsolvedRecap = visible.some(k => st.leaves[k].type === 'recap') && !st.quiz.done;
  label.textContent = visible.includes(0) ? t('book_start') : (showsUnsolvedRecap ? t('bq_skip') : t('book_next'));
}

// Re-draws one page in place (after answering a question) — no page turn.
function refreshLeaf(st, i, focusSel, sayNow){
  const book = document.querySelector('[data-sb-book]');
  const el = book && book.querySelector(`[data-leaf="${i}"]`);
  if (!el) return;
  const side = (el.className.match(/sb-leaf--(left|right|solo|cover)/) || [])[1] || 'solo';
  const tmp = document.createElement('div');
  tmp.innerHTML = leafHtml(st, i, side);
  const fresh = tmp.firstElementChild;
  el.replaceWith(fresh);
  wirePics(fresh);
  wireLeaf(st, fresh, i);
  const root = document.querySelector('[data-book-root]');
  sbNextLabel(st, root);
  const f = focusSel && fresh.querySelector(focusSel);
  if (f) f.focus({ preventScroll: true });
  // Keep the new feedback (or the next part of the question) in view, above
  // the sticky page-turn bar.
  const show = fresh.querySelector('.sb-fb > :last-child') || fresh.querySelector('[data-say-now]');
  if (show && sayNow){
    const r = show.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 90) show.scrollIntoView({ block: 'end', behavior: sbReducedMotion() ? 'auto' : 'smooth' });
  }
  if (sayNow){
    const say = Array.from(fresh.querySelectorAll('[data-say-now]'));
    const text = say.map(x => x.textContent.replace(/\s+/g, ' ').trim()).join(' ');
    if (text) sbAnnounce(text);
    if (sbReadPrefs().on && say.length){
      const spans = say.flatMap(x => Array.from(x.querySelectorAll('.sb-s')).filter(s => readChoicesOk(s)));
      sbSpeakSpans(st, spans, null);
    }
  }
}
function readChoicesOk(span){
  if (!span.closest('.sb-choice')) return true;
  return typeof readChoicesAloud !== 'function' || readChoicesAloud();
}

function wireRestart(st, el){
  const again = el.querySelector('[data-book-restart]');
  if (again) again.addEventListener('click', () => {
    st.leaves.forEach(l => { if (l.q) resetQ(l.q); });
    st.quiz = newQuiz(st.quiz.qs.map(resetQ));
    st.returnTo = null; st.lookTarget = null;
    turnTo(st, 0, { dir: -1, how: 'jump', focusLeafIndex: 0 });
  });
}

function wireLeaf(st, el, i){
  const leaf = st.leaves[i];
  wireRestart(st, el);
  if (leaf.type === 'question') wireQuestion(st, el, i, leaf.q, false);
  if (leaf.type === 'recap' && !st.quiz.done) wireQuestion(st, el, i, st.quiz.qs[st.quiz.i], true);
  if (leaf.type === 'recap') wireRecapExtras(st, el, i);
  const speakBtn = el.querySelector('[data-sb-speak]');
  if (speakBtn) speakBtn.addEventListener('click', () => {
    if (sbIsSpeaking()){ sbStopReading(); return; }
    sbSpeakSpans(st, sbLeafSpans(el), null);
  });
}

// Answered right: drop the "Look here" marks on a page still in view.
function clearLookBack(st, i){
  if (st.returnTo !== i) return;
  const lt = st.lookTarget;
  st.returnTo = null; st.lookTarget = null;
  if (lt != null && sbVisible(st).includes(lt)) refreshLeaf(st, lt);
  const ret = document.querySelector('[data-sb-returnbar]');
  if (ret) ret.hidden = true;
}

function celebrate(){
  if (typeof playCorrectDing === 'function') playCorrectDing();
}

function wireQuestion(st, el, i, q, isRecap){
  el.querySelectorAll('.sb-choices:not([data-done]) [data-choice]').forEach(btn => btn.addEventListener('click', () => {
    const k = parseInt(btn.dataset.choice, 10);
    const part = q.parts[q.stage];
    sbStopReading();
    if (q.predict){
      q.picked = k; q.solved = true;
      refreshLeaf(st, i, isRecap ? '[data-bq-next]' : '[data-q-keep]', true);
      return;
    }
    if (part.choices[k].correct){
      celebrate();
      if (q.stage + 1 < q.parts.length){
        q.stage++; q.wrong = [];
        refreshLeaf(st, i, `[data-part="${q.stage}"] [data-choice]`, true);
        return;
      }
      q.solved = true;
      clearLookBack(st, i);
      refreshLeaf(st, i, isRecap ? '[data-bq-next]' : '[data-q-keep]', true);
    } else {
      if (!q.wrong.includes(k)) q.wrong.push(k);
      q.anyWrong = true;
      refreshLeaf(st, i, '.sb-choices [data-choice]:not([disabled])', true);
    }
  }));
  const keep = el.querySelector('[data-q-keep]');
  if (keep) keep.addEventListener('click', () => {
    if (i + 1 >= st.leaves.length) return;
    if (sbVisible(st).includes(i + 1) || !st.go) showLeaf(st, i + 1, { focus: true });
    else st.go(1, 'button');
  });
  const look = el.querySelector('[data-q-look]');
  if (look) look.addEventListener('click', () => {
    st.returnTo = i; st.lookTarget = q.lookLeaf;
    showLeaf(st, q.lookLeaf, { focus: true });
  });
}

function wireRecapExtras(st, el, i){
  const qz = st.quiz;
  const next = el.querySelector('[data-bq-next]');
  if (next) next.addEventListener('click', () => {
    sbStopReading();
    if (qz.i + 1 < qz.qs.length){
      qz.i++;
      refreshLeaf(st, i, '[data-choice]');
      if (sbReadPrefs().on){ const fresh = document.querySelector(`[data-leaf="${i}"]`); if (fresh) sbSpeakSpans(st, sbLeafSpans(fresh), null); }
      sbAnnounce(sbLeafSummary(st, i));
    } else {
      qz.done = true;
      markSuperReader(st.id, st.level);
      if (typeof playZapSound === 'function') playZapSound();
      refreshLeaf(st, i, '[data-bq-again]', true);
    }
  });
  const again = el.querySelector('[data-bq-again]');
  if (again) again.addEventListener('click', () => {
    st.quiz = newQuiz(qz.qs.map(resetQ));
    refreshLeaf(st, i, '[data-choice]');
  });
}

/* ---------- Read to me ------------------------------------------------------ */
// Reads the sentence spans aloud with the app's voice (the recorded natural
// voice when every sentence has a recording, otherwise the device voice; see
// js/speech.js), highlighting the sentence being read.
function sbIsSpeaking(){ return typeof speechBusy !== 'undefined' && speechBusy; }
function sbClearHi(){ document.querySelectorAll('.sb-s.is-reading').forEach(x => x.classList.remove('is-reading')); }
function sbStopReading(){
  if (bookState){ clearTimeout(bookState.autoTimer); clearTimeout(bookState.readTimer); }
  clearTimeout(sbSpeakSpans.est);
  if (typeof stopSpeaking === 'function') stopSpeaking();
  sbClearHi();
  document.querySelectorAll('[data-sb-speak].is-speaking').forEach(b => b.classList.remove('is-speaking'));
}
function sbLeafSpans(leafEl){
  return Array.from(leafEl.querySelectorAll('.sb-s')).filter(s => readChoicesOk(s) && !s.closest('.visually-hidden'));
}
function sbSpeakSpans(st, spans, onDone){
  if (!sbCanSpeak() || !spans.length) return;
  sbStopReading();
  let text = '';
  const map = spans.map(el => {
    let s = el.textContent.replace(/\s+/g, ' ').trim();
    if (!/[.!?…:;]["”»’)]*$/.test(s)) s += '.';
    const start = text.length;
    text += s + ' ';
    return { el, start, end: start + s.length };
  });
  const at = ci => map.find(m => ci >= m.start && ci < m.end + 1) || null;
  const mark = m => {
    if (!m || m.el.classList.contains('is-reading')) return;
    sbClearHi();
    m.el.classList.add('is-reading');
    const r = m.el.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 90 || r.top < 0) m.el.scrollIntoView({ block: 'center', behavior: sbReducedMotion() ? 'auto' : 'smooth' });
  };
  let realBoundary = false;
  const btns = document.querySelectorAll('[data-sb-speak]');
  btns.forEach(b => b.classList.add('is-speaking'));
  speakQueue(text, voiceProfileFor(null), {
    chunkStart(chunk, rate, recorded){
      const lead = chunk.text.length - chunk.text.replace(/^\s+/, '').length;
      mark(at(chunk.start + lead));
      if (recorded || realBoundary) return;
      // Device voices without word events: step through the sentences of
      // this piece by their length.
      clearTimeout(sbSpeakSpans.est);
      const inChunk = map.filter(m => m.start >= chunk.start + lead && m.start < chunk.start + chunk.text.length);
      const msPerChar = 1000 / (13.5 * (rate || 1));
      const step = k => {
        if (k >= inChunk.length || realBoundary) return;
        sbSpeakSpans.est = setTimeout(() => { mark(inChunk[k]); step(k + 1); }, (inChunk[k].start - inChunk[k - 1].start) * msPerChar);
      };
      if (inChunk.length > 1) step(1);
    },
    boundary(ci){ realBoundary = true; clearTimeout(sbSpeakSpans.est); mark(at(ci)); },
    done(){
      clearTimeout(sbSpeakSpans.est);
      sbClearHi();
      btns.forEach(b => b.classList.remove('is-speaking'));
      if (onDone) onDone();
    },
  });
}
function sbReadVisible(st){
  const book = document.querySelector('[data-sb-book]');
  if (!book || st !== bookState) return;
  const spans = Array.from(book.querySelectorAll('.sb-leaf[data-art], .sb-leaf[data-leaf]')).flatMap(sbLeafSpans);
  sbSpeakSpans(st, spans, () => sbAfterRead(st));
}
// "Turn pages for me": after a story page is read, wait a moment and turn.
// Never turns past a question that is still waiting for an answer.
function sbAfterRead(st){
  const p = sbReadPrefs();
  if (!p.on || !p.auto || st !== bookState) return;
  const visible = sbVisible(st);
  if (visible.includes(st.leaves.length - 1)) return;
  const waiting = visible.some(i => {
    const l = st.leaves[i];
    return (l.type === 'question' && !l.q.solved) || (l.type === 'recap' && !st.quiz.done);
  });
  if (waiting) return;
  clearTimeout(st.autoTimer);
  st.autoTimer = setTimeout(() => {
    if (st === bookState && sbReadPrefs().auto && !sbIsSpeaking() && st.go) st.go(1, 'auto');
  }, 1800);
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
    node.removeAttribute('data-art');
    node.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    node.querySelectorAll('[data-sb-speak]').forEach(x => x.removeAttribute('data-sb-speak'));
    node.querySelectorAll('figure[data-pic]').forEach(x => x.removeAttribute('data-pic'));
    node.querySelectorAll('.is-reading').forEach(x => x.classList.remove('is-reading'));
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

  const evenPages = newLeaves.length === 2 && Math.abs(newLeaves[0].offsetWidth - newLeaves[1].offsetWidth) < 8;
  if (oldWasPair && isPair && oldClones.length === 2 && newLeaves.length === 2 && evenPages){
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
      const lastNew = newLeaves[newLeaves.length - 1];
      card.appendChild(prep(lastNew.cloneNode(true)));
      box(card, lastNew.getBoundingClientRect());
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
  window.addEventListener('safetylib:profilechange', () => { if (bookState && bookState.name !== bookName()) renderStoryBook(); });
  document.addEventListener('keydown', e => {
    if (!bookState || !bookState.go || !document.querySelector('[data-sb-book]') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.target && e.target.closest && e.target.closest('.display-panel, [role="dialog"]')) return;
    if (e.key === 'ArrowRight'){ e.preventDefault(); bookState.go(1, 'key'); }
    else if (e.key === 'ArrowLeft'){ e.preventDefault(); bookState.go(-1, 'key'); }
  });
  // One page or two? Re-check when the window or the text size changes.
  const recheck = () => {
    const st = bookState;
    const root = document.querySelector('[data-book-root]');
    if (!st || !root || !root.querySelector('[data-sb-book]')) return;
    sbMeasureHeader();
    if (sbWantsSpread(st) !== st.spread){ renderBookShell(root, st); return; }
    const f = sbSpreadPlan(st);
    if (f && Math.abs(f - (st.textFrac || 0)) > 0.005){ st.textFrac = f; updateBook(st, { noTurn: true }); }
  };
  let rt = null;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(recheck, 150); });
  if (typeof MutationObserver === 'function'){
    new MutationObserver(recheck).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  }
}
