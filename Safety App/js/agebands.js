/* ==========================================================================
   Safety Superheroes — age-band filter
   Lets a parent narrow the home page topic grid to one age tier. Every
   topic in js/data.js TOPICS carries an `ageBands` array (subset of
   'toddler' | 'youth' | 'teen'); this module just tracks which band is
   selected and lets other code (js/page-home.js) filter by it. Same
   localStorage + button-group pattern as js/theme.js.
   ========================================================================== */

const AGE_BANDS = [
  { code: 'all',     labelKey: 'ageband_all' },
  { code: 'toddler', labelKey: 'ageband_toddler' },
  { code: 'youth',   labelKey: 'ageband_youth' },
  { code: 'teen',    labelKey: 'ageband_teen' },
];

function getAgeBand(){
  const saved = localStorage.getItem('safetylib_ageband');
  return AGE_BANDS.some(b => b.code === saved) ? saved : 'all';
}

function setAgeBand(code){
  if (!AGE_BANDS.some(b => b.code === code)) return;
  localStorage.setItem('safetylib_ageband', code);
  window.dispatchEvent(new CustomEvent('safetylib:agebandchange'));
}

// Topics with no ageBands (shouldn't happen, but stay permissive) always pass.
function topicMatchesAgeBand(meta, band){
  if (band === 'all') return true;
  return !meta.ageBands || meta.ageBands.includes(band);
}

function initAgeBandSwitcher(){
  const wrap = document.querySelector('[data-ageband-switch]');
  if (!wrap) return;
  function render(){
    const current = getAgeBand();
    wrap.innerHTML = AGE_BANDS.map(b => `
      <button type="button" class="ageband-switch__option" data-ageband-option="${b.code}"
        aria-pressed="${b.code === current}">${escapeHtml(t(b.labelKey))}</button>`).join('');
    wrap.querySelectorAll('[data-ageband-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        setAgeBand(btn.dataset.agebandOption);
        render();
      });
    });
  }
  render();
  window.addEventListener('safetylib:langchange', render);
}
