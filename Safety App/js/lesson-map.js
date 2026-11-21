/* ==========================================================================
   Safety Superheroes — Hero Map (home page "Map" view)
   Lessons as stops along a winding road, grouped into "worlds" (the same
   categories as the card view). Each stop shows the lesson's hero; its
   villain waits beside it and turns dizzy once beaten. Nothing is locked:
   a grown-up can always jump to the lesson a child needs. The "Next!" flag
   just suggests the first lesson not finished yet.
   ========================================================================== */

const HOME_VIEW_KEY = 'safetylib_home_view';
// Horizontal positions (as % of the map width) the road snakes through.
const MAP_SWAY = [50, 74, 80, 62, 38, 20, 26];

function getHomeView(){
  try { return localStorage.getItem(HOME_VIEW_KEY) === 'cards' ? 'cards' : 'map'; } catch (e) { return 'map'; }
}
function setHomeView(view){
  try { localStorage.setItem(HOME_VIEW_KEY, view); } catch (e) { /* ignore */ }
}

function homeViewToggleHtml(view){
  return `
    <div class="home-view-toggle" role="group" aria-label="${escapeHtml(t('map_view_label'))}">
      <button type="button" class="home-view-toggle__btn" data-home-view="map" aria-pressed="${view === 'map'}">${escapeHtml(t('map_view_map'))}</button>
      <button type="button" class="home-view-toggle__btn" data-home-view="cards" aria-pressed="${view === 'cards'}">${escapeHtml(t('map_view_cards'))}</button>
    </div>`;
}

function lessonMapHtml(groups, lang, completedIds){
  let i = 0;
  let nextMarked = false;
  const worlds = groups.map((group, gi) => {
    const stops = group.metas.map(meta => {
      const n = i++;
      const x = MAP_SWAY[n % MAP_SWAY.length];
      const content = getTopicSummary(meta.id, lang);
      const done = completedIds.has(meta.id);
      const isNext = !done && !nextMarked;
      if (isNext) nextMarked = true;
      const hasVillain = typeof villainFor === 'function' && villainFor(meta.id);
      const beaten = hasVillain && villainBeaten(meta.id);
      const vName = hasVillain ? villainData(meta.id, lang).name : '';
      const side = x >= 50 ? 'left' : 'right';
      const status = done ? t('map_stop_done') : (isNext ? t('map_stop_next') : '');
      return `
        <li class="map-stop ${done ? 'is-done' : ''} ${isNext ? 'is-next' : ''}" style="--x:${x}%" data-map-stop>
          <a class="map-stop__link" href="topic.html?id=${encodeURIComponent(meta.id)}" data-theme="${meta.theme}"
             aria-label="${escapeHtml(`${n + 1}. ${content.title}${status ? ' — ' + status : ''}${beaten ? ' — ' + t('map_villain_beaten', { villain: vName }) : ''}`)}">
            <span class="map-stop__num" aria-hidden="true">${done ? '★' : n + 1}</span>
            <span class="map-stop__badge" aria-hidden="true">${heroBadgeHtml(meta.id, lang, meta.theme, 70)}</span>
            <span class="map-stop__title">${escapeHtml(content.title)}</span>
            ${isNext ? `<span class="map-stop__flag" aria-hidden="true">${escapeHtml(t('map_stop_next'))}</span>` : ''}
          </a>
          ${hasVillain ? `<span class="map-stop__villain map-stop__villain--${side} ${beaten ? 'is-beaten' : ''}" aria-hidden="true" title="${escapeHtml(beaten ? t('map_villain_beaten', { villain: vName }) : vName)}">
            ${villainSvg(meta.id, beaten)}${beaten ? '<span class="map-stop__beaten">✓</span>' : ''}</span>` : ''}
        </li>`;
    }).join('');
    return `
      <section class="map-world" style="--group-accent:${group.accent}">
        <h3 class="map-world__title"><span>${escapeHtml(t('map_world_label', { n: gi + 1 }))}</span> ${escapeHtml(group.title)}</h3>
        <ol class="map-road" start="${i - group.metas.length + 1}">${stops}</ol>
      </section>`;
  }).join('');
  return `<div class="lesson-map" data-lesson-map>
      <svg class="lesson-map__road" aria-hidden="true" focusable="false"><path class="lesson-map__road-edge"/><path class="lesson-map__road-line"/></svg>
      ${worlds}
    </div>`;
}

// Draw one continuous dotted road through every stop's badge, behind them.
function drawLessonMapRoad(){
  const map = document.querySelector('[data-lesson-map]');
  if (!map) return;
  const svg = map.querySelector('.lesson-map__road');
  const box = map.getBoundingClientRect();
  const pts = [...map.querySelectorAll('.map-stop__badge')].map(el => {
    const r = el.getBoundingClientRect();
    return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2];
  });
  svg.setAttribute('width', box.width);
  svg.setAttribute('height', box.height);
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  if (pts.length < 2) return;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let k = 1; k < pts.length; k++){
    const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
    const my = (y0 + y1) / 2;
    d += ` C${x0} ${my} ${x1} ${my} ${x1} ${y1}`;
  }
  svg.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
}

let lessonMapResizeWired = false;
function wireLessonMap(container){
  container.querySelectorAll('[data-home-view]').forEach(btn => btn.addEventListener('click', () => {
    setHomeView(btn.dataset.homeView);
    if (typeof renderTopicGrid === 'function') renderTopicGrid();
  }));
  drawLessonMapRoad();
  // Fonts / images can shift layout after first paint.
  setTimeout(drawLessonMapRoad, 300);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLessonMapRoad);
  if (!lessonMapResizeWired){
    lessonMapResizeWired = true;
    let raf = 0;
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(drawLessonMapRoad); });
  }
}
