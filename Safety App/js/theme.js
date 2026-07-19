/* ==========================================================================
   Safety Scouts — cosmetic color skin picker
   Purely decorative: swaps the --rose/--rose-dark/--rose-tint accent used for
   the header brand, headings, and level-chip numbers. Never touches the
   --blue/--green/--red/--amber/--purple set, since those carry meaning
   (per-topic safety category colors) elsewhere in the app.
   ========================================================================== */

const SKINS = [
  { code: 'rose',   labelKey: 'skin_rose' },
  { code: 'ocean',  labelKey: 'skin_ocean' },
  { code: 'sunset', labelKey: 'skin_sunset' },
  { code: 'meadow', labelKey: 'skin_meadow' },
  { code: 'berry',  labelKey: 'skin_berry' },
];

function getSkin(){
  const saved = localStorage.getItem('safetylib_skin');
  return SKINS.some(s => s.code === saved) ? saved : 'rose';
}

function setSkin(code){
  if (!SKINS.some(s => s.code === code)) return;
  localStorage.setItem('safetylib_skin', code);
  document.documentElement.setAttribute('data-skin', code);
}

function initSkinSwitcher(){
  const wrap = document.querySelector('[data-skin-switch]');
  if (!wrap) return;
  function render(){
    const current = getSkin();
    wrap.innerHTML = SKINS.map(s => `
      <button type="button" class="skin-switch__swatch skin-swatch-${s.code}"
        data-skin-option="${s.code}" aria-pressed="${s.code === current}"
        aria-label="${t(s.labelKey)}" title="${t(s.labelKey)}"></button>`).join('');
    wrap.querySelectorAll('[data-skin-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        setSkin(btn.dataset.skinOption);
        render();
      });
    });
  }
  render();
  window.addEventListener('safetylib:langchange', render);
}
