/* ==========================================================================
   Safety Scouts — boot
   Tiny utilities used everywhere, plus the DOMContentLoaded dispatcher that
   wires up the universal switchers and calls the current page's init
   function (see js/page-*.js and js/speech.js for those). Loaded on every
   page.
   ========================================================================== */

function formatTime(seconds){
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------------------------------------------------------------------- */
/* Display settings popover (skin/text-size/heading-font/voice-speed,     */
/* collapsed behind one header control) -- see js/theme.js etc. for the  */
/* switchers themselves; this only shows/hides the panel they live in.   */
/* ---------------------------------------------------------------------- */

function initDisplayPanel(){
  const toggle = document.querySelector('[data-display-toggle]');
  const panel = document.querySelector('[data-display-panel]');
  if (!toggle || !panel) return;

  function close(){
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }
  function open(){
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) open(); else close();
  });
  document.addEventListener('click', e => {
    if (panel.hidden) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden){
      close();
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Boot                                                                    */
/* ---------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  applyStaticI18n();
  initLangSwitcher();
  initSkinSwitcher();
  initSpeechRateSwitcher();
  initTextSizeSwitcher();
  initHeadingFontSwitcher();
  initDisplayPanel();
  if (typeof initCalmSpace === 'function') initCalmSpace();

  const page = document.body.dataset.page;
  if (page === 'home') initHomePage();
  else if (page === 'topic') initTopicPage();
  else if (page === 'analytics') initAnalyticsPage();
  else if (page === 'worksheet') initWorksheetPage();
  else if (page === 'review') initReviewPage();

  window.addEventListener('safetylib:langchange', () => applyStaticI18n());
});
