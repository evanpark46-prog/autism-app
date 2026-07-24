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
/* Boot                                                                    */
/* ---------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  applyStaticI18n();
  initLangSwitcher();
  initSkinSwitcher();
  initSpeechRateSwitcher();
  initTextSizeSwitcher();
  initHeadingFontSwitcher();

  const page = document.body.dataset.page;
  if (page === 'home') initHomePage();
  else if (page === 'topic') initTopicPage();
  else if (page === 'analytics') initAnalyticsPage();
  else if (page === 'worksheet') initWorksheetPage();
  else if (page === 'review') initReviewPage();

  window.addEventListener('safetylib:langchange', () => applyStaticI18n());
});
