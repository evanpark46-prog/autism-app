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

// Matches each skin's --rose value, so the mobile browser chrome / installed
// PWA title bar tint follows the chosen skin instead of staying rose.
const SKIN_THEME_COLORS = {
  rose: '#d6789f', ocean: '#2dbfc7', sunset: '#f2994a', meadow: '#3fae6a', berry: '#9b5fe0',
};

function getSkin(){
  const saved = localStorage.getItem('safetylib_skin');
  return SKINS.some(s => s.code === saved) ? saved : 'rose';
}

function applyThemeColorMeta(code){
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', SKIN_THEME_COLORS[code] || SKIN_THEME_COLORS.rose);
}

function setSkin(code){
  if (!SKINS.some(s => s.code === code)) return;
  localStorage.setItem('safetylib_skin', code);
  document.documentElement.setAttribute('data-skin', code);
  applyThemeColorMeta(code);
}

function initSkinSwitcher(){
  const wrap = document.querySelector('[data-skin-switch]');
  applyThemeColorMeta(getSkin());
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
