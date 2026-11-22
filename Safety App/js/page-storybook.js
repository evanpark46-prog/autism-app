/* ==========================================================================
   Safety Superheroes — Hero Stories (storybook.html)
   Every lesson's story, told as a picture-free book to read (or have read
   aloud). The book follows Alex (or the learner's own name) making each
   SAFE choice and why — like a social story — so it models the right
   behavior from start to finish. After the last story page comes the
   Super Reader Challenge: a few no-fail reading-comprehension questions
   ("In the story, what did Alex do?") with a "look back at page N" hint.
     storybook.html              -> the bookshelf (lessons for the age group)
     storybook.html?id=X&level=N -> one book, a page at a time
   ========================================================================== */

let bookState = null;

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
    // pages.length is the index this step's page will get; the reader shows
    // it as page (index + 2) because the cover is page 1.
    if (kind === 'ask' && context === asked) context = '';
    questions.push({ kind, asked: asked || '', context, right: rightText, wrongs, why: bookReason(right.feedback), page: pages.length + 1 });
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
  return { pages, recap: (level && level.recap) || [], questions: pickQuestions(questions, levelIndex) };
}

// Splits a decision prompt into the situation ("Someone Alex does not know
// is close by.") and its question ("What should Alex do?"). When there is no
// situation, the last story sentence before it reminds the reader instead.
function bookSentences(t){ return ((t || '').match(/[^.!?]*[.!?]+["”»]?|[^.!?]+$/g) || []).map(x => x.trim()).filter(Boolean); }
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

// 3 questions (2 choices) for the youngest level, 4 questions (3 choices)
// otherwise — spread across the story, in story order.
function pickQuestions(all, levelIndex){
  const want = levelIndex === 0 ? 3 : 4;
  const maxChoices = levelIndex === 0 ? 2 : 3;
  let chosen = all;
  if (all.length > want){
    chosen = [];
    for (let k = 0; k < want; k++) chosen.push(all[Math.round(k * (all.length - 1) / (want - 1))]);
    chosen = chosen.filter((q, i, arr) => arr.indexOf(q) === i);
  }
  return chosen.map(q => ({
    ...q,
    choices: shuffleBookArray([{ text: q.right, correct: true }, ...shuffleBookArray(q.wrongs.slice()).slice(0, maxChoices - 1).map(text => ({ text, correct: false }))]),
  }));
}

const SUPER_READER_KEY = 'safetylib_super_reader_v1';
function superReaderWins(){
  try { return JSON.parse(localStorage.getItem(SUPER_READER_KEY)) || {}; } catch (e){ return {}; }
}
function markSuperReader(id, level){
  try { const w = superReaderWins(); w[`${id}:${level}`] = true; localStorage.setItem(SUPER_READER_KEY, JSON.stringify(w)); } catch (e){}
}

function bookGrades(i){ return t(['level1_desc', 'level2_desc', 'level3_desc'][i]).split(' — ')[0]; }

function renderBookshelf(root, lang){
  const band = typeof getAgeBand === 'function' ? getAgeBand() : 'all';
  const metas = TOPICS.filter(m => typeof topicMatchesAgeBand !== 'function' || topicMatchesAgeBand(m, band));
  const levelNames = ['level1_label', 'level2_label', 'level3_label'];
  root.innerHTML = `
    <section class="hero">
      <h1>${escapeHtml(t('book_shelf_title'))}</h1>
      <p>${escapeHtml(t('book_shelf_lead'))}</p>
      <p><a class="btn btn-secondary" href="say-it.html">${escapeHtml(t('book_say_link'))}</a></p>
    </section>
    <ul class="bookshelf">
      ${metas.map(meta => {
        const summary = getTopicSummary(meta.id, lang);
        const wins = superReaderWins();
        return `<li class="book-spine" data-theme="${meta.theme}">
          <div class="book-spine__icon" aria-hidden="true">${typeof heroBadgeHtml === 'function' ? heroBadgeHtml(meta.id, lang, meta.theme, 56) : '📖'}</div>
          <div class="book-spine__body">
            <h2 class="book-spine__title">${escapeHtml(summary.title)}</h2>
            <div class="book-spine__levels">
              ${levelNames.map((k, i) => `<a class="book-spine__level" href="storybook.html?id=${encodeURIComponent(meta.id)}&level=${i}">📖 ${escapeHtml(t('book_level_btn', { n: i + 1 }))}${wins[`${meta.id}:${i}`] ? ' <span class="book-spine__star" title="Super Reader">⭐</span>' : ''}<small>${escapeHtml(bookGrades(i))}</small></a>`).join('')}
            </div>
          </div>
        </li>`;
      }).join('')}
    </ul>`;
}

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
    const built = buildBookPages(content, levelIndex, name);
    bookState = { id, level: levelIndex, lang, name, page: 0, pages: built.pages, recap: built.recap, quiz: newQuiz(built.questions) };
  }
  const st = bookState;
  const hasQuiz = st.quiz.qs.length > 0;
  const quizPage = hasQuiz ? st.pages.length + 1 : -1;
  const total = st.pages.length + 2 + (hasQuiz ? 1 : 0); // cover + story + quiz + "The End"
  const pageNo = st.page;
  const isStory = pageNo > 0 && pageNo <= st.pages.length;
  if (pageNo === quizPage) st.lookingBack = false;
  let speakSegs = null;
  document.title = `${content.title} — ${t('book_shelf_title')}`;

  let inner = '';
  if (pageNo === 0){
    inner = `
      <div class="book-cover">
        <p class="book-cover__series">${escapeHtml(t('book_series'))}</p>
        <h1 class="book-cover__title">${escapeHtml(content.title)}</h1>
        <p class="book-cover__level">${escapeHtml(t('book_level_btn', { n: levelIndex + 1 }))} · ${escapeHtml(bookGrades(levelIndex))}</p>
        <p class="book-cover__starring">${escapeHtml(t('book_starring', { name }))}</p>
      </div>`;
  } else if (pageNo === total - 1){
    inner = `
      <div class="book-end">
        <p class="book-end__title">${escapeHtml(t('book_the_end'))}</p>
        ${st.recap.length ? `<h2 class="book-end__heading">${escapeHtml(t('book_learned'))}</h2>
          <ul class="book-end__list">${st.recap.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
        <div class="hero-actions">
          <button type="button" class="btn btn-secondary" data-book-restart>${escapeHtml(t('book_read_again'))}</button>
          <a class="btn btn-primary" href="topic.html?id=${encodeURIComponent(id)}">${escapeHtml(t('book_play_lesson'))}</a>
          <a class="btn btn-secondary" href="storybook.html">${escapeHtml(t('book_back_shelf'))}</a>
        </div>
      </div>`;
  } else if (pageNo === quizPage){
    inner = quizHtml(st, name);
  } else {
    const paras = st.pages[pageNo - 1];
    inner = `<div class="book-text">${paras.map((p, i) => `<p class="book-p ${p.cls || ''}">${p.speaker ? `<span class="book-speaker">${escapeHtml(p.speaker)}:</span> ` : ''}<span data-book-seg="${i}">${escapeHtml(p.speaker ? `“${p.text}”` : p.text)}</span></p>`).join('')}</div>`;
  }

  root.innerHTML = `
    <div class="book-toolbar">
      <a class="book-toolbar__shelf" href="storybook.html">← ${escapeHtml(t('book_back_shelf'))}</a>
      ${st.lookingBack && isStory ? `<button type="button" class="btn btn-primary book-toolbar__back-q" data-bq-return>${escapeHtml(t('bq_back_to_q'))}</button>` : ''}
      ${(isStory || (pageNo === quizPage && !st.quiz.done)) && typeof speakButtonHtml === 'function' ? speakButtonHtml() : ''}
    </div>
    <article class="book-page ${pageNo === 0 ? 'is-cover' : ''}" data-theme="${meta.theme}" aria-roledescription="${escapeHtml(t('book_page_role'))}" aria-label="${escapeHtml(t('book_page_of', { n: pageNo + 1, total }))}">
      ${inner}
      <p class="book-page__num" aria-hidden="true">${pageNo + 1} / ${total}</p>
    </article>
    <nav class="book-nav" aria-label="${escapeHtml(t('book_nav_label'))}">
      <button type="button" class="btn btn-secondary book-nav__btn" data-book-prev ${pageNo === 0 ? 'disabled' : ''}>← ${escapeHtml(t('book_prev'))}</button>
      <div class="book-dots" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<span class="${i === pageNo ? 'is-on' : ''}"></span>`).join('')}</div>
      <button type="button" class="btn btn-primary book-nav__btn" data-book-next ${pageNo === total - 1 ? 'disabled' : ''}>${escapeHtml(pageNo === 0 ? t('book_start') : (pageNo === quizPage && !st.quiz.done ? t('bq_skip') : t('book_next')))} →</button>
    </nav>`;

  const go = (d, abs) => {
    const n = Math.max(0, Math.min(total - 1, abs != null ? abs : st.page + d));
    if (n === st.page) return;
    st.page = n;
    renderStoryBook();
    const page = document.querySelector('.book-page');
    if (page) page.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  root.querySelector('[data-book-prev]').addEventListener('click', () => go(-1));
  root.querySelector('[data-book-next]').addEventListener('click', () => go(1));
  const again = root.querySelector('[data-book-restart]');
  if (again) again.addEventListener('click', () => { st.page = 0; renderStoryBook(); });
  const pageEl = root.querySelector('.book-page');
  pageEl.tabIndex = -1;
  // Swipe to turn pages on tablets / phones.
  let sx = null;
  pageEl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  pageEl.addEventListener('touchend', e => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  });
  bookState.go = go;
  const ret = root.querySelector('[data-bq-return]');
  if (ret) ret.addEventListener('click', () => go(0, quizPage));
  if (pageNo === quizPage) wireQuiz(root, st, go);

  let segs = null;
  if (isStory){
    segs = st.pages[pageNo - 1].map((p, i) => ({ el: root.querySelector(`[data-book-seg="${i}"]`), text: p.speaker ? `“${p.text}”` : p.text }));
  } else if (pageNo === quizPage && !st.quiz.done){
    segs = Array.from(root.querySelectorAll('[data-book-seg]')).map(el => ({ el, text: el.textContent }));
  }
  if (segs && typeof wireSpeakButtonHighlighted === 'function') wireSpeakButtonHighlighted(root, segs, null, ' ');
}

function newQuiz(qs){ return { qs, i: 0, wrong: [], solved: false, firstTry: 0, done: false }; }

function quizHtml(st, name){
  const qz = st.quiz;
  const title = `<h2 class="book-quiz__title">${escapeHtml(t('bq_title'))}</h2>`;
  if (qz.done){
    const total = qz.qs.length;
    return `<div class="book-quiz book-quiz--done">${title}
      <div class="book-quiz__medal" aria-hidden="true">⭐</div>
      <p class="book-quiz__done-title">${escapeHtml(t('bq_done_title'))}</p>
      <p>${escapeHtml(t('bq_done_score', { n: qz.firstTry, total }))}</p>
      <p class="book-quiz__stars" aria-hidden="true">${'⭐'.repeat(qz.firstTry)}${'☆'.repeat(total - qz.firstTry)}</p>
      <button type="button" class="btn btn-secondary" data-bq-again>${escapeHtml(t('bq_again'))}</button>
    </div>`;
  }
  const q = qz.qs[qz.i];
  const lastWrong = qz.wrong.length && !qz.solved;
  return `<div class="book-quiz">${title}
    ${qz.i === 0 && !qz.wrong.length && !qz.solved ? `<p class="book-quiz__intro">${escapeHtml(t('bq_intro', { n: qz.qs.length }))}</p>` : ''}
    <p class="book-quiz__progress">${escapeHtml(t('bq_progress', { n: qz.i + 1, total: qz.qs.length }))}</p>
    ${q.context ? `<p class="book-p book-think"><span data-book-seg="0">${escapeHtml(q.context)}</span></p>` : ''}
    <p class="book-quiz__q"><span data-book-seg="1">${escapeHtml(q.kind === 'ask' ? q.asked : t(q.kind === 'said' ? 'bq_said' : 'bq_did', { name }))}</span></p>
    <div class="book-quiz__choices">
      ${q.choices.map((c, i) => {
        const isWrong = qz.wrong.includes(i);
        const isRight = qz.solved && c.correct;
        return `<button type="button" class="book-quiz__choice ${isWrong ? 'is-wrong' : ''} ${isRight ? 'is-right' : ''}" data-bq-choice="${i}" ${isWrong || qz.solved ? 'disabled' : ''}>
          <span data-book-seg="${i + 2}">${escapeHtml(q.kind === 'said' ? `“${c.text}”` : c.text)}</span>${isRight ? ' ✅' : ''}${isWrong ? ' ✖' : ''}</button>`;
      }).join('')}
    </div>
    <div class="book-quiz__fb" role="status" aria-live="polite">
      ${qz.solved ? `<p class="book-quiz__good">${escapeHtml(t('bq_right'))}${q.why ? ` ${escapeHtml(q.why)}` : ''}</p>
        <button type="button" class="btn btn-primary" data-bq-next>${escapeHtml(qz.i + 1 < qz.qs.length ? t('bq_next') : t('bq_finish'))} →</button>` : ''}
      ${lastWrong ? `<p class="book-quiz__try">${escapeHtml(t('bq_try'))}</p>
        <button type="button" class="btn btn-secondary" data-bq-look>${escapeHtml(t('bq_look', { n: q.page + 1 }))}</button>` : ''}
    </div>
  </div>`;
}

function wireQuiz(root, st, go){
  const qz = st.quiz;
  const rerender = focusSel => {
    renderStoryBook();
    const el = focusSel && document.querySelector(focusSel);
    if (el) el.focus({ preventScroll: true });
  };
  root.querySelectorAll('[data-bq-choice]').forEach(btn => btn.addEventListener('click', () => {
    const i = parseInt(btn.dataset.bqChoice, 10);
    const q = qz.qs[qz.i];
    if (typeof stopSpeaking === 'function') stopSpeaking();
    if (q.choices[i].correct){
      qz.solved = true;
      if (!qz.wrong.length) qz.firstTry++;
      if (typeof playCorrectDing === 'function') playCorrectDing();
      rerender('[data-bq-next]');
    } else {
      qz.wrong.push(i);
      rerender('[data-bq-choice]:not([disabled])');
    }
  }));
  const next = root.querySelector('[data-bq-next]');
  if (next) next.addEventListener('click', () => {
    if (qz.i + 1 < qz.qs.length){ qz.i++; qz.wrong = []; qz.solved = false; rerender('[data-bq-choice]'); }
    else {
      qz.done = true;
      markSuperReader(st.id, st.level);
      if (typeof playZapSound === 'function') playZapSound();
      rerender('[data-bq-again]');
    }
  });
  const look = root.querySelector('[data-bq-look]');
  if (look) look.addEventListener('click', () => { st.lookingBack = true; go(0, qz.qs[qz.i].page); });
  const again = root.querySelector('[data-bq-again]');
  if (again) again.addEventListener('click', () => {
    st.quiz = newQuiz(pickQuestionsAgain(st.quiz.qs));
    rerender('[data-bq-choice]');
  });
}

// Same questions, choices reshuffled.
function pickQuestionsAgain(qs){ return qs.map(q => ({ ...q, choices: shuffleBookArray(q.choices.slice()) })); }

function initStoryBookPage(){
  renderStoryBook();
  window.addEventListener('safetylib:langchange', () => { bookState = null; renderStoryBook(); });
  window.addEventListener('safetylib:agebandchange', renderStoryBook);
  document.addEventListener('keydown', e => {
    if (!bookState || !bookState.go || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') bookState.go(1);
    else if (e.key === 'ArrowLeft') bookState.go(-1);
  });
}
