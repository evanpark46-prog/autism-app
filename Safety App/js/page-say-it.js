/* ==========================================================================
   Safety Superheroes — Say It Like a Hero (say-it.html)
   A library of safety words to learn to SAY. For each word the learner can:
     1. Listen  — normal speed, hero-slow, or one syllable at a time (the
                  syllable chips light up as they're spoken).
     2. Say it  — tap 🎤 and say the word; the browser's speech recognition
                  checks it. No-fail: "almost" just means listen and try
                  again. Without a microphone / recognition, the learner
                  says it out loud and taps "I said it!".
     3. Learn   — what it means, an example sentence, and a link to the
                  Hero Story where the word comes up.
   Words live in js/safety-words.js.
   ========================================================================== */

const SAYIT_KEY = 'safetylib_sayit_v1';
const SAYIT_SESSION = 5;
let sayItState = { view: 'shelf', cat: 'all', word: null, session: null, feedback: null, listening: false };

function sayItWords(){
  const lang = getLang();
  const band = typeof getAgeBand === 'function' ? getAgeBand() : 'all';
  const maxLvl = band === 'toddler' ? 0 : band === 'youth' ? 1 : 2;
  return (SAFETY_WORDS[lang] || SAFETY_WORDS.en).filter(w => w.lvl <= maxLvl);
}
function sayItStars(){ try { return JSON.parse(localStorage.getItem(SAYIT_KEY)) || {}; } catch (e){ return {}; } }
function sayItHasStar(w){ return !!sayItStars()[`${getLang()}:${w.w}`]; }
function sayItGiveStar(w){
  try { const s = sayItStars(); const k = `${getLang()}:${w.w}`; s[k] = (s[k] || 0) + 1; localStorage.setItem(SAYIT_KEY, JSON.stringify(s)); } catch (e){}
}

/* ---------- speaking: whole word, slow, syllable by syllable ---------- */

function sayItParts(w){
  // English syllables like "cy" read badly on their own; the "sounds like"
  // guide (ih-MUR-jun-see) has the same number of parts and reads well.
  if (w.sounds){
    const parts = w.sounds.split(/[-\s]+/).filter(Boolean).map(p => p.toLowerCase());
    if (parts.length === w.syl.length) return parts;
  }
  return w.syl;
}

// Speaks a list of pieces one after another; onPart(i) fires as each starts.
function sayItSpeak(pieces, rate, onPart, onDone){
  if (typeof SPEECH_SUPPORTED === 'undefined' || !SPEECH_SUPPORTED) return;
  if (typeof stopSpeaking === 'function') stopSpeaking();
  const run = ++speechRun;
  const voice = readingVoice(getLang());
  speechBusy = true;
  fireSpeech('safetylib:speechstart');
  let i = 0;
  const next = () => {
    if (run !== speechRun) return;
    if (i >= pieces.length){
      speechBusy = false; fireSpeech('safetylib:speechend');
      if (onDone) onDone();
      return;
    }
    const idx = i++;
    const u = new SpeechSynthesisUtterance(pieces[idx]);
    if (voice){ u.voice = voice; u.lang = voice.lang; } else u.lang = getLang() === 'es' ? 'es-US' : 'en-US';
    u.rate = rate * getSpeechRateMultiplier();
    u.onstart = () => { if (run === speechRun && onPart) onPart(idx); };
    let done = false;
    const end = () => { if (done) return; done = true; setTimeout(next, pieces.length > 1 ? 280 : 0); };
    u.onend = end;
    u.onerror = e => { if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; end(); };
    window.speechSynthesis.speak(u);
  };
  next();
}

function sayItHighlightChip(root, idx){
  root.querySelectorAll('.sayit-chip').forEach((c, i) => c.classList.toggle('is-speaking', i === idx));
}

/* ---------- checking what the learner said ---------- */

function sayItNorm(s){
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/9\s*-?\s*1\s*-?\s*1/g, getLang() === 'es' ? 'nueve uno uno' : 'nine one one')
    .replace(/[^a-zñ0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function sayItEditDistance(a, b){
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++){
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}
// Kind matching: the word anywhere in what was heard, or close enough
// (speech recognition often mishears children and autistic speakers).
function sayItHeardIt(alternatives, target){
  const goal = sayItNorm(target).replace(/\s/g, '');
  if (!goal) return false;
  return alternatives.some(alt => {
    const heard = sayItNorm(alt);
    const flat = heard.replace(/\s/g, '');
    if (!flat) return false;
    if (flat.includes(goal)) return true;
    // compare against every run of heard words, best match wins
    const words = heard.split(' ');
    for (let a = 0; a < words.length; a++) for (let b = a + 1; b <= Math.min(words.length, a + 6); b++){
      const piece = words.slice(a, b).join('');
      const dist = sayItEditDistance(piece, goal);
      if (dist / Math.max(goal.length, piece.length) <= (goal.length <= 4 ? 0.25 : 0.34)) return true;
    }
    return false;
  });
}

let sayItRecognizer = null;
function sayItListen(w){
  if (!SPEECH_RECOGNITION_SUPPORTED) return;
  if (typeof stopSpeaking === 'function') stopSpeaking();
  try { if (sayItRecognizer) sayItRecognizer.abort(); } catch (e){}
  const rec = new SpeechRecognitionCtor();
  sayItRecognizer = rec;
  rec.lang = getLang() === 'es' ? 'es-US' : 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  let gotResult = false;
  sayItState.listening = true;
  sayItState.feedback = null;
  renderSayIt();
  rec.onresult = e => {
    gotResult = true;
    const alts = [];
    for (const res of e.results) for (let k = 0; k < res.length; k++) alts.push(res[k].transcript);
    const ok = sayItHeardIt(alts, w.w);
    if (ok){ sayItGiveStar(w); if (typeof playCorrectDing === 'function') playCorrectDing(); }
    sayItState.feedback = { kind: ok ? 'great' : 'almost', heard: alts[0] || '' };
  };
  rec.onerror = e => {
    gotResult = true;
    sayItState.feedback = { kind: e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'nomic' : (e.error === 'no-speech' ? 'quiet' : 'almost'), heard: '' };
    if (sayItState.feedback.kind === 'nomic') sayItState.noMic = true;
  };
  rec.onend = () => {
    sayItState.listening = false;
    if (!gotResult) sayItState.feedback = { kind: 'quiet', heard: '' };
    renderSayIt();
  };
  try { rec.start(); } catch (e){ sayItState.listening = false; sayItState.noMic = true; renderSayIt(); }
}

/* ---------- views ---------- */

function sayItWordHtml(w, words){
  const s = sayItState;
  const cat = SAY_IT_CATEGORIES.find(c => c.id === w.cat);
  const canListen = SPEECH_RECOGNITION_SUPPORTED && !s.noMic;
  const fb = s.feedback;
  let fbHtml = '';
  if (s.listening) fbHtml = `<p class="sayit-fb sayit-fb--listen"><span class="sayit-mic-dot" aria-hidden="true"></span> ${escapeHtml(t('sayit_listening'))}</p>`;
  else if (fb && fb.kind === 'great') fbHtml = `<p class="sayit-fb sayit-fb--great">⭐ ${escapeHtml(t('sayit_great'))}</p>`;
  else if (fb && fb.kind === 'self') fbHtml = `<p class="sayit-fb sayit-fb--great">⭐ ${escapeHtml(t('sayit_self_great'))}</p>`;
  else if (fb && fb.kind === 'almost') fbHtml = `<p class="sayit-fb sayit-fb--almost">${escapeHtml(t('sayit_almost'))}${fb.heard ? ` <span class="sayit-heard">${escapeHtml(t('sayit_heard', { words: fb.heard }))}</span>` : ''}</p>`;
  else if (fb && fb.kind === 'quiet') fbHtml = `<p class="sayit-fb sayit-fb--almost">${escapeHtml(t('sayit_quiet'))}</p>`;
  else if (fb && fb.kind === 'nomic') fbHtml = `<p class="sayit-fb sayit-fb--almost">${escapeHtml(t('sayit_nomic'))}</p>`;

  const session = s.session;
  const sessionInfo = session ? `<p class="sayit-session">${escapeHtml(t('sayit_session_progress', { n: session.i + 1, total: session.list.length }))}</p>` : '';
  const isLast = session && session.i + 1 >= session.list.length;
  const nextLabel = session ? (isLast ? t('sayit_finish') : t('sayit_next')) : t('sayit_next');
  return `
    <div class="sayit-toolbar">
      <button type="button" class="book-toolbar__shelf sayit-back" data-sayit-shelf>← ${escapeHtml(t('sayit_all_words'))}</button>
      ${sessionInfo}
    </div>
    <article class="sayit-card">
      <p class="sayit-cat">${cat ? cat.emoji : ''} ${escapeHtml(t('sayit_cat_' + w.cat))}${sayItHasStar(w) ? ' · ⭐' : ''}</p>
      <h1 class="sayit-word" lang="${getLang()}">${escapeHtml(w.w)}</h1>
      <div class="sayit-chips" aria-label="${escapeHtml(t('sayit_syllables_label', { n: w.syl.length }))}">
        ${w.syl.map((p, i) => `<button type="button" class="sayit-chip ${i === w.stress && w.syl.length > 1 ? 'is-stress' : ''}" data-sayit-chip="${i}">${escapeHtml(p)}</button>`).join('<span class="sayit-dot" aria-hidden="true">·</span>')}
      </div>
      ${w.sounds ? `<p class="sayit-sounds">${escapeHtml(t('sayit_sounds_like'))} <strong>${escapeHtml(w.sounds)}</strong></p>` : ''}
      ${w.syl.length > 1 ? `<p class="sayit-tip">${escapeHtml(t('sayit_stress_tip'))}</p>` : ''}

      <section class="sayit-step">
        <h2 class="sayit-step__title"><span class="sayit-step__n">1</span> ${escapeHtml(t('sayit_step_listen'))}</h2>
        <div class="sayit-buttons">
          <button type="button" class="btn btn-primary" data-sayit-hear>🔊 ${escapeHtml(t('sayit_hear'))}</button>
          <button type="button" class="btn btn-secondary" data-sayit-slow>🐢 ${escapeHtml(t('sayit_slow'))}</button>
          ${w.syl.length > 1 ? `<button type="button" class="btn btn-secondary" data-sayit-parts>👏 ${escapeHtml(t('sayit_parts'))}</button>` : ''}
        </div>
      </section>

      <section class="sayit-step">
        <h2 class="sayit-step__title"><span class="sayit-step__n">2</span> ${escapeHtml(t('sayit_step_say'))}</h2>
        <div class="sayit-buttons">
          ${canListen
            ? `<button type="button" class="btn btn-primary sayit-mic ${s.listening ? 'is-listening' : ''}" data-sayit-mic ${s.listening ? 'disabled' : ''}>🎤 ${escapeHtml(s.listening ? t('sayit_listening_btn') : t('sayit_mic'))}</button>`
            : `<p class="sayit-selfnote">${escapeHtml(t('sayit_self_note'))}</p>`}
          <button type="button" class="btn btn-secondary" data-sayit-self>🙋 ${escapeHtml(t('sayit_self'))}</button>
        </div>
        <div role="status" aria-live="polite">${fbHtml}</div>
      </section>

      <section class="sayit-step sayit-learn">
        <h2 class="sayit-step__title"><span class="sayit-step__n">3</span> ${escapeHtml(t('sayit_step_learn'))}</h2>
        <p><strong>${escapeHtml(t('sayit_means'))}</strong> ${escapeHtml(w.mean)}</p>
        <p class="sayit-example"><button type="button" class="sayit-ex-btn" data-sayit-ex aria-label="${escapeHtml(t('read_aloud'))}">🔊</button> “${escapeHtml(w.ex)}”</p>
        ${getTopicMeta(w.topic) ? `<a class="sayit-story-link" href="storybook.html?id=${encodeURIComponent(w.topic)}&level=${w.lvl}">📖 ${escapeHtml(t('sayit_story_link', { title: getTopicSummary(w.topic, getLang()).title }))}</a>` : ''}
      </section>
    </article>
    <nav class="book-nav">
      <button type="button" class="btn btn-secondary book-nav__btn" data-sayit-prev ${!session && words.indexOf(w) <= 0 ? 'disabled' : ''} ${session && session.i === 0 ? 'disabled' : ''}>← ${escapeHtml(t('book_prev'))}</button>
      <span></span>
      <button type="button" class="btn btn-primary book-nav__btn" data-sayit-next>${escapeHtml(nextLabel)} →</button>
    </nav>`;
}

function sayItShelfHtml(words){
  const s = sayItState;
  const shown = s.cat === 'all' ? words : words.filter(w => w.cat === s.cat);
  const starCount = words.filter(sayItHasStar).length;
  const cats = SAY_IT_CATEGORIES.filter(c => words.some(w => w.cat === c.id));
  return `
    <section class="hero">
      <h1>${escapeHtml(t('sayit_title'))}</h1>
      <p>${escapeHtml(t('sayit_lead'))}</p>
      <p class="sayit-score">⭐ ${escapeHtml(t('sayit_score', { n: starCount, total: words.length }))}</p>
      <div class="hero-actions"><button type="button" class="btn btn-primary" data-sayit-practice>🎲 ${escapeHtml(t('sayit_practice', { n: Math.min(SAYIT_SESSION, shown.length) }))}</button></div>
    </section>
    <div class="sayit-cats" role="group" aria-label="${escapeHtml(t('sayit_filter_label'))}">
      <button type="button" class="sayit-cat-btn" data-sayit-cat="all" aria-pressed="${s.cat === 'all'}">📚 ${escapeHtml(t('sayit_cat_all'))}</button>
      ${cats.map(c => `<button type="button" class="sayit-cat-btn" data-sayit-cat="${c.id}" aria-pressed="${s.cat === c.id}">${c.emoji} ${escapeHtml(t('sayit_cat_' + c.id))}</button>`).join('')}
    </div>
    <ul class="sayit-grid">
      ${shown.map(w => `<li><button type="button" class="sayit-tile ${sayItHasStar(w) ? 'has-star' : ''}" data-sayit-open="${escapeHtml(w.w)}">
        <span class="sayit-tile__word" lang="${getLang()}">${escapeHtml(w.w)}</span>
        <span class="sayit-tile__syl">${escapeHtml(w.syl.join(' · '))}</span>
        ${sayItHasStar(w) ? '<span class="sayit-tile__star" aria-label="⭐">⭐</span>' : ''}
      </button></li>`).join('')}
    </ul>`;
}

function sayItDoneHtml(session){
  return `<section class="hero sayit-done">
    <div class="book-quiz__medal" aria-hidden="true">🦸</div>
    <h1>${escapeHtml(t('sayit_done_title'))}</h1>
    <p>${escapeHtml(t('sayit_done_body', { n: session.list.length }))}</p>
    <p class="sayit-done__words">${session.list.map(w => `<span>${escapeHtml(w.w)}</span>`).join('')}</p>
    <div class="hero-actions">
      <button type="button" class="btn btn-primary" data-sayit-practice>🎲 ${escapeHtml(t('sayit_again'))}</button>
      <button type="button" class="btn btn-secondary" data-sayit-shelf>${escapeHtml(t('sayit_all_words'))}</button>
    </div>
  </section>`;
}

function sayItPickSession(words){
  const fresh = words.filter(w => !sayItHasStar(w));
  const pool = (fresh.length >= SAYIT_SESSION ? fresh : words).slice();
  for (let i = pool.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return { list: pool.slice(0, SAYIT_SESSION), i: 0 };
}

function renderSayIt(){
  const root = document.querySelector('[data-sayit-root]');
  if (!root) return;
  const s = sayItState;
  const words = sayItWords();
  let w = s.word && words.find(x => x.w === s.word);
  if (s.view === 'word' && !w) s.view = 'shelf';

  if (s.view === 'done') root.innerHTML = sayItDoneHtml(s.session);
  else if (s.view === 'word') root.innerHTML = sayItWordHtml(w, words);
  else root.innerHTML = sayItShelfHtml(words);

  const on = (sel, fn) => root.querySelectorAll(sel).forEach(el => el.addEventListener('click', fn));
  const open = (word, push) => {
    if (typeof stopSpeaking === 'function') stopSpeaking();
    s.view = 'word'; s.word = word; s.feedback = null; s.listening = false;
    if (push !== false) history.pushState({ sayit: word }, '', `say-it.html?w=${encodeURIComponent(word)}`);
    renderSayIt();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const h = document.querySelector('.sayit-word'); if (h){ h.tabIndex = -1; h.focus({ preventScroll: true }); }
  };
  const shelf = () => {
    if (typeof stopSpeaking === 'function') stopSpeaking();
    s.view = 'shelf'; s.session = null; s.word = null;
    history.pushState({}, '', 'say-it.html');
    renderSayIt();
  };
  on('[data-sayit-cat]', e => { s.cat = e.currentTarget.dataset.sayitCat; renderSayIt(); });
  on('[data-sayit-open]', e => { s.session = null; open(e.currentTarget.dataset.sayitOpen); });
  on('[data-sayit-practice]', () => { const inCat = s.cat === 'all' ? words : words.filter(x => x.cat === s.cat); s.session = sayItPickSession(inCat.length ? inCat : words); open(s.session.list[0].w); });
  on('[data-sayit-shelf]', shelf);
  if (s.view !== 'word') return;

  on('[data-sayit-hear]', () => sayItSpeak([w.w], 0.85));
  on('[data-sayit-slow]', () => sayItSpeak([w.w], 0.5));
  on('[data-sayit-parts]', () => sayItSpeak(sayItParts(w).concat([w.w]), 0.7, i => sayItHighlightChip(root, i < w.syl.length ? i : -1), () => sayItHighlightChip(root, -1)));
  root.querySelectorAll('[data-sayit-chip]').forEach(chip => chip.addEventListener('click', () => {
    const i = +chip.dataset.sayitChip;
    sayItSpeak([sayItParts(w)[i]], 0.6, () => sayItHighlightChip(root, i), () => sayItHighlightChip(root, -1));
  }));
  on('[data-sayit-ex]', () => sayItSpeak([w.ex], 0.9));
  on('[data-sayit-mic]', () => sayItListen(w));
  on('[data-sayit-self]', () => { sayItGiveStar(w); s.feedback = { kind: 'self' }; if (typeof playCorrectDing === 'function') playCorrectDing(); renderSayIt(); });
  on('[data-sayit-next]', () => {
    if (s.session){
      if (s.session.i + 1 >= s.session.list.length){
        if (typeof stopSpeaking === 'function') stopSpeaking();
        s.view = 'done'; renderSayIt();
        if (typeof playZapSound === 'function') playZapSound();
        return;
      }
      s.session.i++; open(s.session.list[s.session.i].w);
    } else {
      const i = words.indexOf(w);
      open(words[(i + 1) % words.length].w);
    }
  });
  on('[data-sayit-prev]', () => {
    if (s.session){ if (s.session.i > 0){ s.session.i--; open(s.session.list[s.session.i].w); } }
    else { const i = words.indexOf(w); if (i > 0) open(words[i - 1].w); }
  });
}

function initSayItPage(){
  const q = new URLSearchParams(location.search).get('w');
  if (q){ sayItState.view = 'word'; sayItState.word = q; }
  renderSayIt();
  window.addEventListener('popstate', () => {
    const w = new URLSearchParams(location.search).get('w');
    sayItState.view = w ? 'word' : 'shelf'; sayItState.word = w; sayItState.session = null; sayItState.feedback = null;
    if (typeof stopSpeaking === 'function') stopSpeaking();
    renderSayIt();
  });
  window.addEventListener('safetylib:langchange', () => { sayItState = { view: 'shelf', cat: 'all', word: null, session: null, feedback: null, listening: false }; history.replaceState({}, '', 'say-it.html'); renderSayIt(); });
  window.addEventListener('safetylib:agebandchange', renderSayIt);
}
