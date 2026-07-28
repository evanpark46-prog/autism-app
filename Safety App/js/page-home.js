/* ==========================================================================
   Safety Superheroes — Home page (index.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Home page: topic grid, grouped into categories with progress badges   */
/* ---------------------------------------------------------------------- */

// TOPIC_CATEGORIES / CATEGORY_ACCENT_VAR live in js/categories.js, shared
// with the badge collection page.

function topicCardHtml(meta, lang, completedIds, opts){
  const content = getTopicSummary(meta.id, lang);
  const done = completedIds.has(meta.id);
  const pinned = isFavorite(meta.id);
  const reveal = (opts && opts.noReveal) ? '' : ' reveal-on-scroll';
  return `
    <div class="topic-card-wrap">
      <button type="button" class="topic-card__pin ${pinned ? 'is-pinned' : ''}" data-pin-topic="${meta.id}"
        aria-pressed="${pinned}" aria-label="${t(pinned ? 'topic_card_unpin_label' : 'topic_card_pin_label')}"
        title="${t(pinned ? 'topic_card_unpin_label' : 'topic_card_pin_label')}">${pinned ? '★' : '☆'}</button>
      <a class="topic-card${reveal}" data-theme="${meta.theme}" href="topic.html?id=${encodeURIComponent(meta.id)}">
        ${done ? `<span class="topic-card__done" title="${t('topic_card_done_label')}" aria-label="${t('topic_card_done_label')}">✓</span>` : ''}
        <div class="topic-card__icon"><img src="${meta.image}" alt="" loading="lazy" decoding="async" width="64" height="64"></div>
        <h3>${escapeHtml(content.title)}</h3>
        <p>${escapeHtml(content.tagline)}</p>
        <div class="topic-card__tags">
          <span class="tag">${t('mode_story')}</span>
          <span class="tag">${t('mode_flashcards')}</span>
          <span class="tag">${t('mode_video')}</span>
        </div>
      </a>
    </div>`;
}

/* ---------------------------------------------------------------------- */
/* Home page: "Meet your superheroes" wall -- one card per topic's hero,  */
/* linking straight into that topic's lesson.                             */
/* ---------------------------------------------------------------------- */

// Not every card has to be a rectangle -- cycle a small set of superhero
// badge shapes (see .shape-hex/.shape-shield/.shape-tag in styles.css) so
// the wall reads as a collection of badges, not a plain grid.
const HERO_CARD_SHAPES = ['', 'shape-hex', 'shape-shield', 'shape-tag'];

function heroCardHtml(meta, lang, index){
  const hero = heroFor(meta.id);
  if (!hero) return '';
  const data = hero[lang] || hero.en;
  const tilt = index % 2 === 0 ? 'hero-card--tilt-a' : 'hero-card--tilt-b';
  const shape = HERO_CARD_SHAPES[index % HERO_CARD_SHAPES.length];
  return `
    <a class="hero-card comic-panel ${tilt} ${shape} reveal-on-scroll" data-theme="${meta.theme}"
      href="topic.html?id=${encodeURIComponent(meta.id)}">
      ${heroPortraitHtml(meta.id, lang, meta.theme, 84)}
      <h3>${escapeHtml(data.name)}</h3>
      <span class="hero-card__power">${escapeHtml(data.power)}</span>
      <p class="hero-card__tagline">${escapeHtml(data.tagline)}</p>
    </a>`;
}

function renderHeroWall(){
  const wall = document.querySelector('[data-hero-wall]');
  if (!wall) return;
  const lang = getLang();
  wall.innerHTML = TOPICS.map((meta, i) => heroCardHtml(meta, lang, i)).join('');
  initScrollReveal(wall);
}

function wirePinButtons(container){
  container.querySelectorAll('[data-pin-topic]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(btn.dataset.pinTopic);
      renderTopicGrid();
    });
  });
}

function renderTopicGrid(){
  const grid = document.querySelector('[data-topic-grid]');
  if (!grid) return;
  const lang = getLang();

  const analytics = loadAnalytics();
  const completedIds = new Set(Object.keys(analytics.topics).filter(id => analytics.topics[id].levelCompletes > 0));

  const favoriteIds = getFavorites();
  const favoritesHtml = favoriteIds.length ? `
    <div class="topic-group" style="--group-accent:var(--rose-dark)">
      <h3>${t('home_favorites_heading')}</h3>
      <div class="grid grid-topics">${favoriteIds.map(id => getTopicMeta(id)).filter(Boolean)
        .map(meta => topicCardHtml(meta, lang, completedIds, { noReveal: true })).join('')}</div>
    </div>` : '';

  const groupsHtml = TOPIC_CATEGORIES.map(group => {
    const cardsHtml = group.topics
      .map(id => getTopicMeta(id))
      .filter(Boolean)
      .map(meta => topicCardHtml(meta, lang, completedIds))
      .join('');
    return `
      <div class="topic-group" style="--group-accent:${CATEGORY_ACCENT_VAR[group.color]}">
        <h3>${t('home_category_' + group.key)}</h3>
        <div class="grid grid-topics">${cardsHtml}</div>
      </div>`;
  }).join('');

  const progressHtml = `<p class="home-progress">${t('home_progress_summary', { done: completedIds.size, total: TOPICS.length })}
    &nbsp;<a href="badges.html">${t('home_badges_link')}</a></p>`;

  grid.innerHTML = progressHtml + favoritesHtml + groupsHtml;
  wirePinButtons(grid);
  initScrollReveal(grid);
}

// Cards fade/rise into view the first time they scroll into the viewport,
// instead of all being visible at once. One-time per card (never re-hides
// on scrolling back up) to stay calm and predictable rather than flickering.
function initScrollReveal(container){
  const items = container.querySelectorAll('.reveal-on-scroll');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  items.forEach(el => observer.observe(el));
}

function initHomePage(){
  renderTopicGrid();
  renderHeroWall();
  window.addEventListener('safetylib:langchange', renderTopicGrid);
  window.addEventListener('safetylib:langchange', renderHeroWall);
  if (typeof initEmotionCheckin === 'function') initEmotionCheckin();
}

