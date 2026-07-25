/* ==========================================================================
   Safety Scouts — Home page (index.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Home page: topic grid, grouped into categories with progress badges   */
/* ---------------------------------------------------------------------- */

// Groups the 23 topics into labeled sections instead of one flat grid --
// same content, less scanning. Order here is display order on the page.
// Each topic's `theme` (js/data.js) is already assigned per category, so
// every card in a section shares one accent color naturally -- no override
// needed here, just a matching accent for the section heading/divider.
const TOPIC_CATEGORIES = [
  { key: 'out_about', color: 'green', topics: ['stranger-safety', 'street-safety', 'lost-safety', 'bike-safety', 'awareness-safety'] },
  { key: 'emergencies', color: 'red', topics: ['emergency-safety', 'fire-safety', 'earthquake-safety', 'rainyweather-safety', 'water-safety', 'home-safety', 'plan-safety'] },
  { key: 'body', color: 'purple', topics: ['body-boundaries-safety', 'secrets-safety', 'reporting-safety', 'privacy-safety'] },
  { key: 'online', color: 'blue', topics: ['online-safety', 'cyberbullying-safety', 'citizenship-safety'] },
  { key: 'speaking_up', color: 'amber', topics: ['selfadvocacy-safety', 'rights-safety', 'bullying-safety', 'peer-pressure-safety'] },
];

const CATEGORY_ACCENT_VAR = {
  blue: 'var(--blue-dark)', green: 'var(--green)', purple: 'var(--purple)',
  red: 'var(--red)', amber: 'var(--amber)',
};

function topicCardHtml(meta, lang, completedIds){
  const content = getTopicSummary(meta.id, lang);
  const done = completedIds.has(meta.id);
  return `
    <a class="topic-card reveal-on-scroll" data-theme="${meta.theme}" href="topic.html?id=${encodeURIComponent(meta.id)}">
      ${done ? `<span class="topic-card__done" title="${t('topic_card_done_label')}" aria-label="${t('topic_card_done_label')}">✓</span>` : ''}
      <div class="topic-card__icon"><img src="${meta.image}" alt="" loading="lazy"></div>
      <h3>${escapeHtml(content.title)}</h3>
      <p>${escapeHtml(content.tagline)}</p>
      <div class="topic-card__tags">
        <span class="tag">${t('mode_story')}</span>
        <span class="tag">${t('mode_flashcards')}</span>
        <span class="tag">${t('mode_video')}</span>
      </div>
    </a>`;
}

function renderTopicGrid(){
  const grid = document.querySelector('[data-topic-grid]');
  if (!grid) return;
  const lang = getLang();

  const analytics = loadAnalytics();
  const completedIds = new Set(Object.keys(analytics.topics).filter(id => analytics.topics[id].levelCompletes > 0));

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

  const progressHtml = `<p class="home-progress">${t('home_progress_summary', { done: completedIds.size, total: TOPICS.length })}</p>`;

  grid.innerHTML = progressHtml + groupsHtml;
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
  window.addEventListener('safetylib:langchange', renderTopicGrid);
}

