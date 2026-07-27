/* ==========================================================================
   Safety Superheroes — boot
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

// The site mascot -- a bold superhero shield emblem, used as the header logo
// (see .brand__badge in every page) and as the topic-loading animation
// (js/page-topic.js). Kept as one shared function so both stay in sync.
// The "S" stands in for both "Safety" and "Superheroes" -- a full "SAFE"
// wordmark doesn't stay legible at the ~28px header badge size, so a single
// bold glyph (same trick as most superhero chest emblems) reads better,
// especially since the full wordmark already sits right next to the badge.
function mascotSvg(){
  return '<svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">'
    + '<path d="M32 3 58 12v17c0 18-11 29-26 32C17 58 6 47 6 29V12Z" fill="#c8460a" stroke="#2b2b2b" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M32 10 50 16v13.5c0 14-8.5 23-18 26-9.5-3-18-12-18-26V16Z" fill="#fff8f0" stroke="#2b2b2b" stroke-width="2.5" stroke-linejoin="round"/>'
    + '<text x="32" y="42" font-family="\'Baloo 2\', sans-serif" font-weight="800" font-size="28" text-anchor="middle" fill="#c8460a">S</text>'
    + '</svg>';
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
  if (typeof initCalmModeToggle === 'function') initCalmModeToggle();
  if (typeof initSymbolModeToggle === 'function') initSymbolModeToggle();
  if (typeof initCalmSpace === 'function') initCalmSpace();

  const page = document.body.dataset.page;
  if (page === 'home') initHomePage();
  else if (page === 'topic') initTopicPage();
  else if (page === 'analytics') initAnalyticsPage();
  else if (page === 'worksheet') initWorksheetPage();
  else if (page === 'review') initReviewPage();
  else if (page === 'badges') initBadgesPage();
  else if (page === 'boss-battle') initBossBattlePage();
  else if (page === 'hero-rush') initHeroRushPage();
  else if (page === 'vocab-quiz') initVocabQuizPage();
  else if (page === 'sort-it-out') initSortItOutPage();

  window.addEventListener('safetylib:langchange', () => applyStaticI18n());
});
