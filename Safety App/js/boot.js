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

// The site mascot -- a small friendly raccoon face, used as the header logo
// (see .brand__badge in every page) and as the topic-loading animation
// (js/page-topic.js). Kept as one shared function so both stay in sync.
function mascotSvg(){
  return '<svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">'
    + '<circle cx="16" cy="15" r="9" fill="#fff"/><circle cx="48" cy="15" r="9" fill="#fff"/>'
    + '<circle cx="16" cy="16" r="4.5" fill="#3b3b3b" opacity=".5"/><circle cx="48" cy="16" r="4.5" fill="#3b3b3b" opacity=".5"/>'
    + '<ellipse cx="32" cy="35" rx="21" ry="18" fill="#fff"/>'
    + '<path d="M12 29c6-7 34-7 40 0 0 9-9 12-20 12S12 38 12 29Z" fill="#3b3b3b"/>'
    + '<circle cx="24" cy="30" r="3.2" fill="#fff"/><circle cx="40" cy="30" r="3.2" fill="#fff"/>'
    + '<circle cx="24" cy="30.5" r="1.5" fill="#1a1a1a"/><circle cx="40" cy="30.5" r="1.5" fill="#1a1a1a"/>'
    + '<ellipse cx="32" cy="43" rx="7.5" ry="5.5" fill="#f4ede3"/><ellipse cx="32" cy="42" rx="2.2" ry="1.6" fill="#2b2b2b"/>'
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

  window.addEventListener('safetylib:langchange', () => applyStaticI18n());
});
