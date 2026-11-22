/* ==========================================================================
   Safety Superheroes — Word Builder (words.html)
   A vocabulary skill builder for the words used in the safety lessons.
   Words come from js/word-builder-data.js, grouped into levels and units.

   Each unit:
     1. Learn  – one word at a time: picture, word, meaning, example, read
                 aloud; "Say it" with the microphone (or "I said it!").
     2. Find   – Level 1: "Which picture shows ___?"
                 Levels 2-3: "Which word means ___?"
     3. Use it – fill the word into a sentence.
   Wrong answers never fail: the right answer glows and the meaning is
   shown again (errorless learning). Each first-try right answer earns the
   word a star (3 stars = mastered); Review brings back words that aren't
   mastered yet. Progress: localStorage safetylib_words_v1.
   ========================================================================== */

const WB_UI = {
  en: {
    title: 'Word Builder', lead: 'Learn the words superheroes use to stay safe. Start with Level 1 and build up!',
    review: '⭐ Review my words', review_none: 'Learn a unit first, then come back to review.', start: 'Start', again: 'Practice again',
    start_here: 'Start here', mastered: '{n} of {total} words mastered', unit_done: '✓ Done',
    learn: 'Learn the words', find: 'Find it', use: 'Use it', word_n: 'Word {n} of {total}', q_n: 'Question {n} of {total}',
    hear: '🔊 Hear it', slow: '🐢 Slow', say: '🗣️ Say it', said: '✅ I said it!', listening: 'Listening…', next: 'Next ▶', practice: 'Practice ▶',
    great_say: 'You said it like a hero!', almost_say: 'Almost! Listen once more and try again.', mic_off: 'I didn’t hear anything. Try again, or tap “I said it!”.',
    meaning: 'What it means', example: 'Example',
    which_pic: 'Which picture shows “{w}”?', which_word: 'Which word means this?', fill: 'Which word goes in the blank?',
    right: 'Yes! That’s right.', think: 'Let’s look again.', this_is: '“{w}” means: {d}',
    done: 'Unit complete!', done_review: 'Review complete!', your_stars: 'Your word stars', next_unit: 'Next unit ▶', all_units: 'All units',
    stars_note: 'Get 3 stars on a word to master it.', back_units: '← All units', back_games: '← Home',
  },
  es: {
    title: 'Taller de palabras', lead: 'Aprende las palabras que usan los superhéroes para cuidarse. ¡Empieza en el Nivel 1 y sigue subiendo!',
    review: '⭐ Repasar mis palabras', review_none: 'Primero aprende una unidad y luego vuelve a repasar.', start: 'Empezar', again: 'Practicar otra vez',
    start_here: 'Empieza aquí', mastered: '{n} de {total} palabras dominadas', unit_done: '✓ Hecho',
    learn: 'Aprende las palabras', find: 'Encuéntrala', use: 'Úsala', word_n: 'Palabra {n} de {total}', q_n: 'Pregunta {n} de {total}',
    hear: '🔊 Escuchar', slow: '🐢 Despacio', say: '🗣️ Dilo', said: '✅ ¡Ya lo dije!', listening: 'Escuchando…', next: 'Siguiente ▶', practice: 'Practicar ▶',
    great_say: '¡Lo dijiste como un héroe!', almost_say: '¡Casi! Escucha otra vez e inténtalo de nuevo.', mic_off: 'No escuché nada. Inténtalo otra vez o toca “¡Ya lo dije!”.',
    meaning: 'Qué significa', example: 'Ejemplo',
    which_pic: '¿Qué dibujo muestra “{w}”?', which_word: '¿Qué palabra significa esto?', fill: '¿Qué palabra va en el espacio?',
    right: '¡Sí! Muy bien.', think: 'Veamos otra vez.', this_is: '“{w}” significa: {d}',
    done: '¡Unidad completa!', done_review: '¡Repaso completo!', your_stars: 'Tus estrellas de palabras', next_unit: 'Siguiente unidad ▶', all_units: 'Todas las unidades',
    stars_note: 'Consigue 3 estrellas en una palabra para dominarla.', back_units: '← Todas las unidades', back_games: '← Inicio',
  },
};

function wbT(key, vars){
  const lang = getLang();
  let s = (WB_UI[lang] && WB_UI[lang][key]) || WB_UI.en[key] || key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
}

/* ---------- progress ---------- */
const WB_KEY = 'safetylib_words_v1';
function wbLoad(){
  try { const p = JSON.parse(localStorage.getItem(WB_KEY)); if (p && p.words) return p; } catch (e){}
  return { words: {}, units: {} };
}
function wbSave(p){ try { localStorage.setItem(WB_KEY, JSON.stringify(p)); } catch (e){} }
function wbStars(id){ const w = wbLoad().words[id]; return w ? Math.min(3, w.pts || 0) : 0; }

/* ---------- lookups ---------- */
function wbWord(id){ const w = VOCAB_WORDS[getLang()][id]; return w ? Object.assign({ id, e: VOCAB_PICS[id] }, w) : null; }
function wbLevelOf(id){ return VOCAB_LEVELS.find(l => l.units.some(u => u.words.includes(id))); }
function wbUnit(levelId, unitId){
  const lv = VOCAB_LEVELS.find(l => l.id === levelId);
  return lv ? { lv, unit: lv.units.find(u => u.id === unitId) } : null;
}
function wbShuffle(list){
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function wbStarsHtml(n){ return `<span class="wb-stars" aria-label="${n}/3">${'★'.repeat(n)}<span class="wb-stars__off">${'★'.repeat(3 - n)}</span></span>`; }

// Two wrong choices that cannot also be right: same unit first, then the
// same level, never the answer or anything in its VOCAB_AVOID list.
function wbDistractors(id){
  const bad = new Set([id].concat(VOCAB_AVOID[id] || []));
  const lv = wbLevelOf(id);
  const unit = lv.units.find(u => u.words.includes(id));
  const same = wbShuffle(unit.words.filter(w => !bad.has(w)));
  const level = wbShuffle(lv.units.flatMap(u => u.words).filter(w => !bad.has(w) && !unit.words.includes(w)));
  return same.concat(level).slice(0, 2);
}

/* ---------- speech ---------- */
function wbSay(text, rate){
  if (typeof SPEECH_SUPPORTED === 'undefined' || !SPEECH_SUPPORTED || !text) return;
  const prof = voiceProfileFor('Narrator');
  if (rate) prof.rate = rate;
  speakQueue(text, prof);
}
// The fill-in sentence read aloud with a pause where the blank is.
function wbBlankSpoken(fill){ return fill.replace(/_{2,}/g, '…'); }
// The sentence with the word filled in (capitalized at a sentence start).
function wbFillWith(fill, word){
  const at = fill.search(/_{2,}/);
  const before = fill.slice(0, at).replace(/[\s“"¡¿]+$/, '');
  const starts = before === '' || /[.!?:]$/.test(before) || /[“"]\s*[¡¿]?\s*$/.test(fill.slice(0, at));
  const shown = starts ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  return fill.replace(/_{2,}/, shown);
}

/* ---------- views ---------- */
let wbState = null;

function initWordsPage(){
  const root = document.querySelector('[data-wb-root]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const u = params.get('u');
  if (u){ const [lv, unit] = u.split('.'); if (wbUnit(lv, unit) && wbUnit(lv, unit).unit){ wbStartUnit(root, lv, unit); } else wbHome(root); }
  else wbHome(root);
  window.addEventListener('safetylib:langchange', () => { if (wbState && wbState.mode !== 'home') wbRender(root); else wbHome(root); });
}

function wbHome(root){
  if (typeof stopSpeaking === 'function') stopSpeaking();
  wbState = { mode: 'home' };
  const p = wbLoad();
  const lang = getLang();
  let suggested = null;
  VOCAB_LEVELS.forEach(lv => lv.units.forEach(u => { if (!suggested && !p.units[lv.id + '.' + u.id]) suggested = lv.id + '.' + u.id; }));
  const seen = Object.keys(p.words).length;
  root.innerHTML = `
    <section class="hg-head wb-head">
      <div class="wb-head__hero">${typeof hgHero === 'function' ? hgHero('selfadvocacy-safety', 96) : ''}</div>
      <h1>📚 ${escapeHtml(wbT('title'))}</h1>
      <p>${escapeHtml(wbT('lead'))}</p>
      <div class="hg-actions"><button type="button" class="btn btn-secondary btn-lg" data-wb-review ${seen ? '' : 'disabled'}>${escapeHtml(wbT('review'))}</button></div>
      ${seen ? '' : `<p class="wb-note">${escapeHtml(wbT('review_none'))}</p>`}
    </section>
    ${VOCAB_LEVELS.map(lv => {
      const ids = lv.units.flatMap(u => u.words);
      const mastered = ids.filter(id => wbStars(id) >= 3).length;
      return `
      <section class="wb-level wb-level--${lv.color}">
        <header class="wb-level__head">
          <h2>${escapeHtml(lv.name[lang])}</h2>
          <p class="wb-level__grade">${escapeHtml(lv.grade[lang])}</p>
          <div class="wb-meter" role="img" aria-label="${escapeHtml(wbT('mastered', { n: mastered, total: ids.length }))}"><span style="width:${Math.round((mastered / ids.length) * 100)}%"></span></div>
          <p class="wb-level__count">${escapeHtml(wbT('mastered', { n: mastered, total: ids.length }))}</p>
        </header>
        <ul class="wb-units">
          ${lv.units.map(u => {
            const key = lv.id + '.' + u.id;
            const done = !!p.units[key];
            return `<li><button type="button" class="wb-unit ${done ? 'is-done' : ''} ${key === suggested ? 'is-next' : ''}" data-wb-unit="${key}">
              ${key === suggested ? `<span class="wb-unit__flag">${escapeHtml(wbT('start_here'))}</span>` : ''}
              ${done ? `<span class="wb-unit__done">${escapeHtml(wbT('unit_done'))}</span>` : ''}
              <span class="wb-unit__e" aria-hidden="true">${u.e}</span>
              <span class="wb-unit__title">${escapeHtml(u.title[lang])}</span>
              <span class="wb-unit__words">${u.words.map(id => { const w = wbWord(id); return `<span class="wb-chip"><span aria-hidden="true">${w.e}</span> ${escapeHtml(w.w)} ${wbStarsHtml(wbStars(id))}</span>`; }).join('')}</span>
            </button></li>`;
          }).join('')}
        </ul>
      </section>`;
    }).join('')}`;
  root.querySelectorAll('[data-wb-unit]').forEach(b => b.addEventListener('click', () => { const [lv, u] = b.dataset.wbUnit.split('.'); wbStartUnit(root, lv, u); }));
  const rv = root.querySelector('[data-wb-review]');
  if (rv) rv.addEventListener('click', () => wbStartReview(root));
}

function wbBuildQuestions(ids, levelOf){
  const qs = [];
  wbShuffle(ids).forEach(id => qs.push({ id, kind: levelOf(id).id === 'l1' ? 'pic' : 'mean' }));
  wbShuffle(ids).forEach(id => qs.push({ id, kind: 'fill' }));
  return qs.map(q => Object.assign(q, { choices: wbShuffle([q.id].concat(wbDistractors(q.id))) }));
}

function wbStartUnit(root, levelId, unitId){
  const { lv, unit } = wbUnit(levelId, unitId);
  wbState = { mode: 'unit', key: levelId + '.' + unitId, lv, unit, ids: unit.words.slice(), phase: 'learn', i: 0, qs: wbBuildQuestions(unit.words, wbLevelOf), qi: 0, first: {} };
  wbRender(root);
}

function wbStartReview(root){
  const p = wbLoad();
  const seen = Object.keys(p.words).filter(id => VOCAB_PICS[id]);
  if (!seen.length) return;
  // weakest words first, then a little randomness
  const pick = wbShuffle(seen).sort((a, b) => wbStars(a) - wbStars(b)).slice(0, 6);
  wbState = { mode: 'review', ids: pick, phase: 'practice', i: 0, qs: wbBuildQuestions(pick, wbLevelOf), qi: 0, first: {} };
  wbRender(root);
}

function wbRender(root){
  const st = wbState;
  if (typeof stopSpeaking === 'function') stopSpeaking();
  if (st.phase === 'learn') wbLearn(root);
  else if (st.phase === 'practice') wbPractice(root);
  else wbDone(root);
}

function wbTop(root){
  const st = wbState;
  const steps = st.mode === 'review' ? [] : ['learn', 'find', 'use'];
  const now = st.phase === 'learn' ? 0 : (st.qs[st.qi] && st.qs[st.qi].kind === 'fill' ? 2 : 1);
  return `
    <div class="hg-toolbar"><button type="button" class="hg-back" data-wb-home>${escapeHtml(wbT('back_units'))}</button></div>
    ${steps.length ? `<ol class="wb-steps">${steps.map((s, i) => `<li class="${i === now ? 'is-now' : i < now ? 'is-done' : ''}">${escapeHtml(wbT(s))}</li>`).join('')}</ol>` : ''}`;
}

function wbWireTop(root){
  root.querySelector('[data-wb-home]').addEventListener('click', () => wbHome(root));
}

/* ---- 1. Learn ---- */
function wbLearn(root){
  const st = wbState;
  const w = wbWord(st.ids[st.i]);
  const last = st.i === st.ids.length - 1;
  const exHtml = escapeHtml(w.ex).replace(new RegExp('(' + w.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i'), '<mark>$1</mark>');
  const micOk = typeof SPEECH_RECOGNITION_SUPPORTED !== 'undefined' && SPEECH_RECOGNITION_SUPPORTED;
  root.innerHTML = `
    ${wbTop(root)}
    <section class="hg-card wb-card wb-card--${st.lv.color}">
      <p class="hg-kicker">${st.unit.e} ${escapeHtml(st.unit.title[getLang()])} · ${escapeHtml(wbT('word_n', { n: st.i + 1, total: st.ids.length }))}</p>
      <div class="wb-dots" aria-hidden="true">${st.ids.map((x, i) => `<span class="${i < st.i ? 'is-done' : i === st.i ? 'is-now' : ''}"></span>`).join('')}</div>
      <div class="wb-pic" aria-hidden="true">${w.e}</div>
      <h1 class="wb-word" tabindex="-1">${escapeHtml(w.w)}</h1>
      <div class="hg-actions wb-say-row">
        <button type="button" class="btn btn-secondary" data-wb-hear>${escapeHtml(wbT('hear'))}</button>
        <button type="button" class="btn btn-secondary" data-wb-slow>${escapeHtml(wbT('slow'))}</button>
      </div>
      <div class="wb-learn">
        <p><span class="wb-label">${escapeHtml(wbT('meaning'))}</span> ${escapeHtml(w.def)}</p>
        <p class="wb-ex"><span class="wb-label">${escapeHtml(wbT('example'))}</span> ${exHtml}</p>
      </div>
      <div class="wb-say">
        ${micOk ? `<button type="button" class="btn btn-secondary btn-lg" data-wb-mic>${escapeHtml(wbT('say'))}</button>` : ''}
        <button type="button" class="btn btn-secondary btn-lg" data-wb-said>${escapeHtml(wbT('said'))}</button>
        <p class="wb-say__fb" aria-live="polite"></p>
      </div>
      <div class="hg-actions"><button type="button" class="btn btn-primary btn-lg" data-wb-next>${escapeHtml(last ? wbT('practice') : wbT('next'))}</button></div>
    </section>`;
  wbWireTop(root);
  const fb = root.querySelector('.wb-say__fb');
  const hear = () => wbSay(`${w.w}. ${w.def} ${w.ex}`);
  root.querySelector('[data-wb-hear]').addEventListener('click', hear);
  root.querySelector('[data-wb-slow]').addEventListener('click', () => wbSay(w.w, 0.55));
  root.querySelector('[data-wb-said]').addEventListener('click', () => { fb.className = 'wb-say__fb is-great'; fb.textContent = '⭐ ' + wbT('great_say'); if (typeof playCorrectDing === 'function') playCorrectDing(); });
  const mic = root.querySelector('[data-wb-mic]');
  if (mic) mic.addEventListener('click', () => wbListen(w, mic, fb));
  root.querySelector('[data-wb-next]').addEventListener('click', () => {
    const p = wbLoad(); p.words[w.id] = p.words[w.id] || { pts: 0 }; wbSave(p);
    if (last){ st.phase = 'practice'; st.qi = 0; } else st.i += 1;
    wbRender(root);
  });
  hear();
}

let wbRecognizer = null;
function wbListen(w, btn, fb){
  if (typeof stopSpeaking === 'function') stopSpeaking();
  try { if (wbRecognizer) wbRecognizer.abort(); } catch (e){}
  const rec = new SpeechRecognitionCtor();
  wbRecognizer = rec;
  rec.lang = getLang() === 'es' ? 'es-US' : 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  let heard = null;
  btn.classList.add('is-listening');
  fb.className = 'wb-say__fb'; fb.textContent = wbT('listening');
  rec.onresult = e => { heard = []; const r = e.results[0]; for (let i = 0; i < r.length; i++) heard.push(r[i].transcript); };
  rec.onerror = () => {};
  rec.onend = () => {
    btn.classList.remove('is-listening');
    if (!heard || !heard.length){ fb.className = 'wb-say__fb'; fb.textContent = wbT('mic_off'); return; }
    const ok = typeof sayItHeardIt === 'function' ? sayItHeardIt(heard, w.w) : heard.some(h => h.toLowerCase().includes(w.w.toLowerCase()));
    if (ok){ fb.className = 'wb-say__fb is-great'; fb.textContent = '⭐ ' + wbT('great_say'); if (typeof playCorrectDing === 'function') playCorrectDing(); }
    else { fb.className = 'wb-say__fb is-almost'; fb.textContent = wbT('almost_say'); wbSay(w.w); }
  };
  try { rec.start(); } catch (e){ btn.classList.remove('is-listening'); }
}

/* ---- 2 & 3. Find it / Use it ---- */
function wbPractice(root){
  const st = wbState;
  const q = st.qs[st.qi];
  const w = wbWord(q.id);
  const lvl = wbLevelOf(q.id);
  const color = (st.lv || lvl).color;
  const pics = lvl.id === 'l1';
  let prompt, spoken;
  if (q.kind === 'pic'){ prompt = wbT('which_pic', { w: w.w }); spoken = prompt; }
  else if (q.kind === 'mean'){ prompt = wbT('which_word'); spoken = `${prompt} ${w.def}`; }
  else { prompt = w.fill; spoken = wbBlankSpoken(w.fill); }
  const choiceHtml = id => {
    const c = wbWord(id);
    if (q.kind === 'pic') return `<span class="wb-choice__pic" aria-hidden="true">${c.e}</span><span class="visually-hidden">${escapeHtml(c.w)}</span>`;
    return `${pics ? `<span class="wb-choice__mini" aria-hidden="true">${c.e}</span>` : ''}<span>${escapeHtml(c.w)}</span>`;
  };
  root.innerHTML = `
    ${wbTop(root)}
    <section class="hg-card wb-card wb-card--${color}">
      <div class="hg-route__top">
        <p class="hg-kicker">${escapeHtml(wbT('q_n', { n: st.qi + 1, total: st.qs.length }))}</p>
        <button type="button" class="hg-read" data-wb-read>🔊</button>
      </div>
      ${q.kind === 'fill' ? `<p class="hg-kicker">${escapeHtml(wbT('fill'))}</p>` : ''}
      <h2 class="wb-prompt">${q.kind === 'fill' ? escapeHtml(prompt).replace(/_{2,}/, '<span class="wb-blank" data-wb-blank>?</span>') : escapeHtml(prompt)}</h2>
      ${q.kind === 'mean' ? `<p class="wb-def">${escapeHtml(w.def)}</p>` : ''}
      <div class="wb-choices ${q.kind === 'pic' ? 'wb-choices--pics' : ''}">
        ${q.choices.map(id => `<button type="button" class="wb-choice" data-wb-c="${id}">${choiceHtml(id)}</button>`).join('')}
      </div>
      <div class="hg-feedback" aria-live="polite"></div>
      <div class="hg-actions" data-wb-nextwrap hidden><button type="button" class="btn btn-primary btn-lg" data-wb-next>${escapeHtml(wbT('next'))}</button></div>
    </section>`;
  wbWireTop(root);
  const fb = root.querySelector('.hg-feedback');
  root.querySelector('[data-wb-read]').addEventListener('click', () => wbSay(spoken));
  wbSay(spoken);
  let wrong = false;
  const btns = [...root.querySelectorAll('[data-wb-c]')];
  btns.forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.wbC;
    if (id === q.id){
      btns.forEach(x => { x.disabled = true; x.classList.remove('is-glow'); });
      b.classList.add('is-right');
      if (!wrong){
        const p = wbLoad(); p.words[q.id] = p.words[q.id] || { pts: 0 }; p.words[q.id].pts = (p.words[q.id].pts || 0) + 1; wbSave(p);
        st.first[q.id] = (st.first[q.id] || 0) + 1;
      }
      if (typeof playCorrectDing === 'function') playCorrectDing();
      const blank = root.querySelector('[data-wb-blank]');
      if (blank){ blank.textContent = wbFillWith(w.fill, w.w).slice(w.fill.search(/_{2,}/), w.fill.search(/_{2,}/) + w.w.length); blank.classList.add('is-filled'); }
      fb.className = 'hg-feedback hg-feedback--right';
      fb.innerHTML = `<strong>✅ ${escapeHtml(wbT('right'))}</strong> ${q.kind === 'fill' ? escapeHtml(wbFillWith(w.fill, w.w)) : escapeHtml(wbT('this_is', { w: w.w, d: w.def }))}`;
      wbSay(q.kind === 'fill' ? wbFillWith(w.fill, w.w) : `${w.w}. ${w.def}`);
      root.querySelector('[data-wb-nextwrap]').hidden = false;
    } else {
      wrong = true;
      b.disabled = true; b.classList.add('is-wrong');
      const right = btns.find(x => x.dataset.wbC === q.id);
      if (right) right.classList.add('is-glow');
      const c = wbWord(id);
      fb.className = 'hg-feedback hg-feedback--think';
      fb.innerHTML = `<strong>🤔 ${escapeHtml(wbT('think'))}</strong> ${escapeHtml(wbT('this_is', { w: c.w, d: c.def }))}`;
      wbSay(`${c.w}. ${c.def}`);
    }
  }));
  root.querySelector('[data-wb-next]').addEventListener('click', () => {
    st.qi += 1;
    if (st.qi >= st.qs.length) st.phase = 'done';
    wbRender(root);
  });
}

/* ---- done ---- */
function wbDone(root){
  const st = wbState;
  const p = wbLoad();
  let nextKey = null;
  if (st.mode === 'unit'){
    p.units[st.key] = (p.units[st.key] || 0) + 1; wbSave(p);
    const flat = VOCAB_LEVELS.flatMap(l => l.units.map(u => l.id + '.' + u.id));
    nextKey = flat[flat.indexOf(st.key) + 1] || null;
  }
  if (typeof playCompletionChime === 'function') playCompletionChime();
  root.innerHTML = `
    ${wbTop(root)}
    <section class="hg-card wb-card hg-done">
      <div class="hg-burst" aria-hidden="true">📚🎉</div>
      <h1>${escapeHtml(st.mode === 'review' ? wbT('done_review') : wbT('done'))}</h1>
      <h2 class="wb-sub">${escapeHtml(wbT('your_stars'))}</h2>
      <ul class="wb-results">${st.ids.map(id => { const w = wbWord(id); return `<li><span class="wb-results__e" aria-hidden="true">${w.e}</span><span class="wb-results__w">${escapeHtml(w.w)}</span>${wbStarsHtml(wbStars(id))}</li>`; }).join('')}</ul>
      <p class="wb-note">${escapeHtml(wbT('stars_note'))}</p>
      <div class="hg-actions">
        <button type="button" class="btn btn-secondary" data-wb-again>${escapeHtml(wbT('again'))}</button>
        ${nextKey ? `<button type="button" class="btn btn-primary btn-lg" data-wb-nextunit>${escapeHtml(wbT('next_unit'))}</button>` : ''}
        <button type="button" class="btn btn-secondary" data-wb-all>${escapeHtml(wbT('all_units'))}</button>
      </div>
    </section>`;
  wbWireTop(root);
  wbSay(st.mode === 'review' ? wbT('done_review') : wbT('done'));
  root.querySelector('[data-wb-again]').addEventListener('click', () => {
    if (st.mode === 'review') wbStartReview(root);
    else { const [lv, u] = st.key.split('.'); wbState = Object.assign({}, st, { phase: 'practice', qi: 0, qs: wbBuildQuestions(st.ids, wbLevelOf), first: {} }); wbRender(root); }
  });
  root.querySelector('[data-wb-all]').addEventListener('click', () => wbHome(root));
  const nu = root.querySelector('[data-wb-nextunit]');
  if (nu) nu.addEventListener('click', () => { const [lv, u] = nextKey.split('.'); wbStartUnit(root, lv, u); });
}
