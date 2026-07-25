/* ==========================================================================
   Safety Scouts — My Badges (badges.html)
   Shows one badge per topic, grouped the same way as the home page. A
   badge unlocks in full color once that topic's story has been completed
   at least once (same levelCompletes signal the home page checkmark
   uses); until then it shows grayscale with a lock.
   ========================================================================== */

function badgeHtml(meta, lang, unlocked){
  const content = getTopicSummary(meta.id, lang);
  return `
    <div class="badge-cell">
      <div class="topic-badge ${unlocked ? '' : 'topic-badge--locked'}" data-theme="${meta.theme}">
        <img src="${meta.image}" alt="" loading="lazy" decoding="async" width="58" height="58">
        ${unlocked ? '' : `<span class="topic-badge__lock" aria-hidden="true">🔒</span>`}
      </div>
      <p class="topic-badge-label">${escapeHtml(content.title)}</p>
    </div>`;
}

function renderBadgesPage(){
  const root = document.querySelector('[data-badges-root]');
  if (!root) return;
  const lang = getLang();
  const analytics = loadAnalytics();
  const completedIds = new Set(Object.keys(analytics.topics).filter(id => analytics.topics[id].levelCompletes > 0));

  const summaryHtml = `<p class="home-progress">${t('badges_summary', { done: completedIds.size, total: TOPICS.length })}</p>`;

  const groupsHtml = TOPIC_CATEGORIES.map(group => {
    const cellsHtml = group.topics
      .map(id => getTopicMeta(id))
      .filter(Boolean)
      .map(meta => badgeHtml(meta, lang, completedIds.has(meta.id)))
      .join('');
    return `
      <div class="topic-group" style="--group-accent:${CATEGORY_ACCENT_VAR[group.color]}">
        <h3>${t('home_category_' + group.key)}</h3>
        <div class="badge-grid">${cellsHtml}</div>
      </div>`;
  }).join('');

  root.innerHTML = summaryHtml + groupsHtml;
}

function initBadgesPage(){
  renderBadgesPage();
  window.addEventListener('safetylib:langchange', renderBadgesPage);
}
