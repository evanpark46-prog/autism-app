/* ==========================================================================
   Safety Superheroes — Usage insights (analytics.html)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Analytics page (parent-only, local device — see js/analytics.js)      */
/* ---------------------------------------------------------------------- */

function renderAnalyticsDashboard(){
  const root = document.querySelector('[data-analytics-root]');
  if (!root) return;
  const data = loadAnalytics();
  const lang = getLang();
  const locale = lang === 'es' ? 'es' : 'en';

  const entries = Object.keys(data.topics).map(id => {
    const meta = getTopicMeta(id);
    const content = meta ? getTopicSummary(id, lang) : null;
    return { id, title: content ? content.title : id, stats: data.topics[id] };
  }).sort((a, b) => {
    const at = a.stats.lastVisited ? new Date(a.stats.lastVisited).getTime() : 0;
    const bt = b.stats.lastVisited ? new Date(b.stats.lastVisited).getTime() : 0;
    return bt - at;
  });

  const totals = entries.reduce((acc, e) => {
    acc.opens += e.stats.opens;
    acc.completes += e.stats.levelCompletes;
    return acc;
  }, { opens: 0, completes: 0 });

  const lastActivity = entries.length
    ? new Date(entries[0].stats.lastVisited).toLocaleString(locale)
    : t('analytics_never');

  const statsHtml = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card__num">${totals.opens}</div><div class="stat-card__label">${t('analytics_stat_total_opens')}</div></div>
      <div class="stat-card"><div class="stat-card__num">${totals.completes}</div><div class="stat-card__label">${t('analytics_stat_total_completes')}</div></div>
      <div class="stat-card"><div class="stat-card__num">${entries.length}</div><div class="stat-card__label">${t('analytics_stat_topics_active')}</div></div>
      <div class="stat-card"><div class="stat-card__num" style="font-size:1.1rem">${escapeHtml(lastActivity)}</div><div class="stat-card__label">${t('analytics_stat_last_activity')}</div></div>
    </div>`;

  const tableHtml = entries.length ? `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr>
          <th>${t('analytics_col_topic')}</th>
          <th>${t('analytics_col_opens')}</th>
          <th>${t('analytics_col_starts')}</th>
          <th>${t('analytics_col_completes')}</th>
          <th>${t('analytics_col_flashcards')}</th>
          <th>${t('analytics_col_video')}</th>
          <th>${t('analytics_col_last')}</th>
        </tr></thead>
        <tbody>
          ${entries.map(e => `
            <tr>
              <td>${escapeHtml(e.title)}</td>
              <td>${e.stats.opens}</td>
              <td>${e.stats.levelStarts}</td>
              <td>${e.stats.levelCompletes}</td>
              <td>${e.stats.flashcardOpens}</td>
              <td>${e.stats.videoOpens}</td>
              <td>${e.stats.lastVisited ? escapeHtml(new Date(e.stats.lastVisited).toLocaleString(locale)) : t('analytics_never')}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>` : `<p class="analytics-empty">${t('analytics_empty')}</p>`;

  root.innerHTML = `
    <div class="card">
      ${statsHtml}
      ${tableHtml}
      <button type="button" class="btn btn-danger mt-lg" data-analytics-clear>${t('analytics_clear_btn')}</button>
    </div>`;

  const clearBtn = root.querySelector('[data-analytics-clear]');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (window.confirm(t('analytics_clear_confirm'))){
      clearAnalytics();
      renderAnalyticsDashboard();
    }
  });
}

function initAnalyticsPage(){
  renderAnalyticsDashboard();
  window.addEventListener('safetylib:langchange', renderAnalyticsDashboard);
}

