/* ==========================================================================
   Safety Superheroes — My Badges (badges.html)
   Shows one badge per topic, grouped the same way as the home page. A
   badge unlocks in full color once that topic's story has been completed
   at least once (same levelCompletes signal the home page checkmark
   uses); until then it shows grayscale with a lock.
   ========================================================================== */

function badgeHtml(meta, lang, unlocked){
  const content = getTopicSummary(meta.id, lang);
  const hero = typeof heroFor === 'function' ? heroFor(meta.id) : null;
  const heroData = hero ? (hero[lang] || hero.en) : null;
  const powerHtml = heroData
    ? (unlocked
        ? `<p class="topic-badge-power font-comic">${escapeHtml(heroData.power)}</p>`
        : `<p class="topic-badge-power topic-badge-power--locked">${t('power_locked_label')}</p>`)
    : '';
  const certificateHtml = unlocked
    ? `<a class="topic-badge-certificate" href="certificate.html?id=${encodeURIComponent(meta.id)}">${t('certificate_print_link')}</a>`
    : '';
  return `
    <div class="badge-cell">
      <div class="topic-badge ${unlocked ? '' : 'topic-badge--locked'}" data-theme="${meta.theme}">
        ${heroPortraitHtml(meta.id, lang, meta.theme, 58)}
        ${unlocked ? '' : `<span class="topic-badge__lock" aria-hidden="true">🔒</span>`}
      </div>
      <p class="topic-badge-label">${escapeHtml(content.title)}</p>
      ${powerHtml}
      ${certificateHtml}
    </div>`;
}

function renderBadgesPage(){
  const root = document.querySelector('[data-badges-root]');
  if (!root) return;
  const lang = getLang();
  const analytics = loadAnalytics();
  const completedIds = new Set(Object.keys(analytics.topics).filter(id => analytics.topics[id].levelCompletes > 0));

  const summaryHtml = `<p class="home-progress">${t('badges_summary', { done: completedIds.size, total: TOPICS.length })}</p>`;

  const allComplete = completedIds.size >= TOPICS.length;
  const battleBannerHtml = allComplete ? `
    <div class="comic-panel battle-banner">
      <div class="comic-burst battle-banner__burst"><span class="font-comic">${t('power_unlocked_label')}</span></div>
      <h2 class="font-comic">${t('battle_banner_title')}</h2>
      <p>${t('battle_banner_body')}</p>
      <a class="btn btn-primary btn-lg" href="boss-battle.html">${t('battle_banner_cta')}</a>
    </div>` : '';

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

  root.innerHTML = summaryHtml + battleBannerHtml + groupsHtml;
}

function initBadgesPage(){
  renderBadgesPage();
  window.addEventListener('safetylib:langchange', renderBadgesPage);
}
