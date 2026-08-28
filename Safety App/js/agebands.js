/* ==========================================================================
   Safety Superheroes — age-gate + age-band filter
   The home page leads with three big "who's learning today?" squares
   instead of the full topic grid, so a parent isn't handed all 31 lessons
   at once. Picking a square filters the grid down to that tier (every
   topic in js/data.js TOPICS carries an `ageBands` array, a subset of
   'toddler' | 'youth' | 'teen'); a small "show everything instead" escape
   hatch is still available for a parent who wants the full library.
   Choice is remembered in localStorage (same pattern as js/theme.js) and
   distinguished from "never chosen yet" so a first-time visitor always
   sees the picker before any lesson cards render.
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

function clearAgeBandChoice(){
  localStorage.removeItem(AGEBAND_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('safetylib:agebandchange'));
}

// Topics with no ageBands (shouldn't happen, but stay permissive) always pass.
function topicMatchesAgeBand(meta, band){
  if (band === ALL_BANDS_CODE) return true;
  return !meta.ageBands || meta.ageBands.includes(band);
}

function ageBandLabel(code){
  if (code === ALL_BANDS_CODE) return t('ageband_all');
  const band = AGE_BANDS.find(b => b.code === code);
  return band ? t(band.titleKey) : '';
}

function initAgeGate(){
  const wrap = document.querySelector('[data-age-gate]');
  if (!wrap) return;

  function renderPicker(){
    wrap.innerHTML = `
      <div class="age-gate">
        <h2 class="age-gate__heading">${escapeHtml(t('ageband_gate_heading'))}</h2>
        <div class="age-gate__grid">
          ${AGE_BANDS.map(b => `
            <button type="button" class="age-gate__card" data-age-gate-pick="${b.code}">
              <span class="age-gate__icon" aria-hidden="true">${b.icon}</span>
              <span class="age-gate__title">${escapeHtml(t(b.titleKey))}</span>
              <span class="age-gate__subtitle">${escapeHtml(t(b.subtitleKey))}</span>
            </button>`).join('')}
        </div>
        <button type="button" class="age-gate__all-link" data-age-gate-pick="${ALL_BANDS_CODE}">${escapeHtml(t('ageband_gate_show_all'))}</button>
      </div>`;
    wrap.querySelectorAll('[data-age-gate-pick]').forEach(btn => {
      btn.addEventListener('click', () => {
        setAgeBand(btn.dataset.ageGatePick);
        render();
      });
    });
  }

  function renderBar(){
    const current = getAgeBand();
    wrap.innerHTML = `
      <div class="age-gate-bar">
        <span class="age-gate-bar__label">${escapeHtml(t('ageband_gate_current', { label: ageBandLabel(current) }))}</span>
        <button type="button" class="age-gate-bar__change" data-age-gate-change>${escapeHtml(t('ageband_gate_change'))}</button>
      </div>`;
    const changeBtn = wrap.querySelector('[data-age-gate-change]');
    if (changeBtn) changeBtn.addEventListener('click', () => {
      clearAgeBandChoice();
      render();
    });
  }

  function render(){
    if (hasChosenAgeBand()) renderBar();
    else renderPicker();
  }

  render();
  window.addEventListener('safetylib:langchange', render);
}
