/* ==========================================================================
   Safety Scouts — heading font style picker
   "Readable" (Baloo 2) is the default for accessibility; the cursive
   Dancing Script look from earlier versions is kept as an opt-in style,
   never the default.
   ========================================================================== */

const HEADING_FONTS = [
  { code: 'readable', labelKey: 'headingfont_readable' },
  { code: 'cursive', labelKey: 'headingfont_cursive' },
];

function getHeadingFont(){
  const saved = localStorage.getItem('safetylib_heading_font');
  return HEADING_FONTS.some(f => f.code === saved) ? saved : 'readable';
}

function setHeadingFont(code){
  if (!HEADING_FONTS.some(f => f.code === code)) return;
  localStorage.setItem('safetylib_heading_font', code);
  applyHeadingFont();
}

function applyHeadingFont(){
  const code = getHeadingFont();
  if (code === 'cursive') document.documentElement.setAttribute('data-heading-font', 'cursive');
  else document.documentElement.removeAttribute('data-heading-font');
}

function initHeadingFontSwitcher(){
  applyHeadingFont();
  const select = document.querySelector('[data-headingfont-select]');
  if (!select) return;
  function render(){
    const current = getHeadingFont();
    select.innerHTML = HEADING_FONTS.map(f =>
      `<option value="${f.code}" ${f.code === current ? 'selected' : ''}>${t(f.labelKey)}</option>`).join('');
  }
  render();
  select.addEventListener('change', () => { setHeadingFont(select.value); });
  window.addEventListener('safetylib:langchange', render);
}
