/* ==========================================================================
   Safety Superheroes — age tabs
   A persistent tab bar (Toddlers / Kids / Teens / All) above the home page
   topic grid -- clicking a tab filters the grid + hero wall in place, all
   on index.html, no navigating to a separate page. Every topic in
   js/data.js TOPICS carries an `ageBands` array (subset of
   'toddler' | 'youth' | 'teen'); this module just tracks which tab is
   active and lets js/page-home.js filter by it. Nothing renders below the
   tabs until one is picked on a first visit, so a newcomer isn't handed
   all 31 lessons at once -- the choice is remembered in localStorage
   after that.
   ========================================================================== */

const AGE_BANDS = [
  { code: 'toddler', icon: '🧸', titleKey: 'ageband_gate_toddler_title', subtitleKey: 'ageband_gate_toddler_subtitle' },
  { code: 'youth',   icon: '🎒', titleKey: 'ageband_gate_youth_title',   subtitleKey: 'ageband_gate_youth_subtitle' },
  { code: 'teen',    icon: '🎓', titleKey: 'ageband_gate_teen_title',    subtitleKey: 'ageband_gate_teen_subtitle' },
];
const ALL_BANDS_CODE = 'all';
const AGEBAND_STORAGE_KEY = 'safetylib_ageband';

function hasChosenAgeBand(){
  const saved = localStorage.getItem(AGEBAND_STORAGE_KEY);
  return saved === ALL_BANDS_CODE || AGE_BANDS.some(b => b.code === saved);
}

function getAgeBand(){
  const saved = localStorage.getItem(AGEBAND_STORAGE_KEY);
  return AGE_BANDS.some(b => b.code === saved) ? saved : ALL_BANDS_CODE;
}

function setAgeBand(code){
  if (code !== ALL_BANDS_CODE && !AGE_BANDS.some(b => b.code === code)) return;
  localStorage.setItem(AGEBAND_STORAGE_KEY, code);
  window.dispatchEvent(new CustomEvent('safetylib:agebandchange'));
}

// Topics with no ageBands (shouldn't happen, but stay permissive) always pass.
function topicMatchesAgeBand(meta, band){
  if (band === ALL_BANDS_CODE) return true;
  return !meta.ageBands || meta.ageBands.includes(band);
}

function initAgeGate(){
  const wrap = document.querySelector('[data-age-gate]');
  if (!wrap) return;

  function render(){
    const chosen = hasChosenAgeBand();
    const current = getAgeBand();
    const tabs = AGE_BANDS.concat([{ code: ALL_BANDS_CODE, icon: '📚', titleKey: 'ageband_all', subtitleKey: null }]);
    wrap.innerHTML = `
      <div class="age-gate">
        <h2 class="age-gate__heading">${escapeHtml(t('ageband_gate_heading'))}</h2>
        <div class="age-gate__grid" role="tablist" aria-label="${escapeHtml(t('ageband_gate_heading'))}">
          ${tabs.map(b => `
            <button type="button" class="age-gate__card" role="tab"
              aria-selected="${chosen && b.code === current}" data-age-gate-pick="${b.code}">
              <span class="age-gate__icon" aria-hidden="true">${b.icon}</span>
              <span class="age-gate__title">${escapeHtml(t(b.titleKey))}</span>
              ${b.subtitleKey ? `<span class="age-gate__subtitle">${escapeHtml(t(b.subtitleKey))}</span>` : ''}
            </button>`).join('')}
        </div>
      </div>`;
    wrap.querySelectorAll('[data-age-gate-pick]').forEach(btn => {
      btn.addEventListener('click', () => {
        setAgeBand(btn.dataset.ageGatePick);
        render();
      });
    });
  }

  render();
  window.addEventListener('safetylib:langchange', render);
}
