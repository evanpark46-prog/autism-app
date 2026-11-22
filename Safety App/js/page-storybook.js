/* ==========================================================================
   Safety Superheroes — Story Books (storybook.html)
   Every lesson's story, told as a picture-free book to read (or have read
   aloud). The book follows Alex (or the learner's own name) making each
   SAFE choice and why — like a social story — so it models the right
   behavior from start to finish. No quizzes, no wrong turns.
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
  (level ? level.steps : []).forEach(step => {
    const paras = [];
    if (step.type === 'narrative'){
      if (step.text) paras.push({ text: step.text });
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
      }
    }
    if (paras.length) pages.push(paras);
  });
  return { pages, recap: (level && level.recap) || [] };
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
    </section>
    <ul class="bookshelf">
      ${metas.map(meta => {
        const summary = getTopicSummary(meta.id, lang);
        return `<li class="book-spine" data-theme="${meta.theme}">
          <div class="book-spine__icon" aria-hidden="true">${typeof heroBadgeHtml === 'function' ? heroBadgeHtml(meta.id, lang, meta.theme, 56) : '📖'}</div>
          <div class="book-spine__body">
            <h2 class="book-spine__title">${escapeHtml(summary.title)}</h2>
            <div class="book-spine__levels">
              ${levelNames.map((k, i) => `<a class="book-spine__level" href="storybook.html?id=${encodeURIComponent(meta.id)}&level=${i}">📖 ${escapeHtml(t('book_level_btn', { n: i + 1 }))}<small>${escapeHtml(bookGrades(i))}</small></a>`).join('')}
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
    bookState = { id, level: levelIndex, lang, name, page: 0, pages: built.pages, recap: built.recap };
  }
  const st = bookState;
  const total = st.pages.length + 2; // cover + story pages + "The End"
  const pageNo = st.page;
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
  } else {
    const paras = st.pages[pageNo - 1];
    inner = `<div class="book-text">${paras.map((p, i) => `<p class="book-p ${p.cls || ''}">${p.speaker ? `<span class="book-speaker">${escapeHtml(p.speaker)}:</span> ` : ''}<span data-book-seg="${i}">${escapeHtml(p.speaker ? `“${p.text}”` : p.text)}</span></p>`).join('')}</div>`;
  }

  root.innerHTML = `
    <div class="book-toolbar">
      <a class="book-toolbar__shelf" href="storybook.html">← ${escapeHtml(t('book_back_shelf'))}</a>
      ${pageNo > 0 && pageNo < total - 1 && typeof speakButtonHtml === 'function' ? speakButtonHtml() : ''}
    </div>
    <article class="book-page ${pageNo === 0 ? 'is-cover' : ''}" data-theme="${meta.theme}" aria-roledescription="${escapeHtml(t('book_page_role'))}" aria-label="${escapeHtml(t('book_page_of', { n: pageNo + 1, total }))}">
      ${inner}
      <p class="book-page__num" aria-hidden="true">${pageNo + 1} / ${total}</p>
    </article>
    <nav class="book-nav" aria-label="${escapeHtml(t('book_nav_label'))}">
      <button type="button" class="btn btn-secondary book-nav__btn" data-book-prev ${pageNo === 0 ? 'disabled' : ''}>← ${escapeHtml(t('book_prev'))}</button>
      <div class="book-dots" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<span class="${i === pageNo ? 'is-on' : ''}"></span>`).join('')}</div>
      <button type="button" class="btn btn-primary book-nav__btn" data-book-next ${pageNo === total - 1 ? 'disabled' : ''}>${escapeHtml(pageNo === 0 ? t('book_start') : t('book_next'))} →</button>
    </nav>`;

  const go = d => {
    const n = Math.max(0, Math.min(total - 1, st.page + d));
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

  if (pageNo > 0 && pageNo < total - 1 && typeof wireSpeakButtonHighlighted === 'function'){
    const paras = st.pages[pageNo - 1];
    const segs = paras.map((p, i) => ({ el: root.querySelector(`[data-book-seg="${i}"]`), text: p.speaker ? `“${p.text}”` : p.text }));
    wireSpeakButtonHighlighted(root, segs, null, ' ');
  }
}

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
