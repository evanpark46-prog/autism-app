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
// (see .brand__badge in every page). The "S" stands in for both "Safety" and
// "Superheroes" -- a full "SAFE" wordmark doesn't stay legible at the ~28px
// header badge size, so a single bold glyph (same trick as most superhero
// chest emblems) reads better, especially since the full wordmark already
// sits right next to the badge.
function mascotSvg(){
  return '<svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">'
    + '<path d="M32 3 58 12v17c0 18-11 29-26 32C17 58 6 47 6 29V12Z" fill="#c8460a" stroke="#2b2b2b" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M32 10 50 16v13.5c0 14-8.5 23-18 26-9.5-3-18-12-18-26V16Z" fill="#fff8f0" stroke="#2b2b2b" stroke-width="2.5" stroke-linejoin="round"/>'
    + '<text x="32" y="42" font-family="\'Baloo 2\', sans-serif" font-weight="800" font-size="28" text-anchor="middle" fill="#c8460a">S</text>'
    + '</svg>';
}

// The topic-loading animation: the same bear superhero used elsewhere in the
// app (homepage flying squadron, Sky Chase), shown in a "just landed" pose
// -- crouched, arms out for balance -- against a ground glow tinted with the
// topic's own category color, so each topic feels like its own touchdown
// spot rather than a generic spinner. js/page-topic.js drives the actual
// drop-in + dust-puff animation with GSAP; this just returns the static
// markup (and IS the fallback look under Calm Mode / reduced motion, so it
// must read fine with zero motion too).
function heroLandingSvg(theme){
  const accent = `var(--${theme})`;
  const accentDark = `var(--${theme}-dark, ${accent})`;
  return '<svg class="hero-landing" viewBox="0 0 160 200" width="170" height="212" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">'
    + `<ellipse class="hero-landing__ground" cx="80" cy="184" rx="70" ry="14" fill="${accent}" opacity=".22"/>`
    + '<g class="hero-landing__dust" opacity="0">'
    + `<circle cx="30" cy="182" r="7" fill="${accent}" opacity=".4"/>`
    + `<circle cx="130" cy="182" r="7" fill="${accent}" opacity=".4"/>`
    + `<circle cx="80" cy="190" r="9" fill="${accent}" opacity=".35"/>`
    + '</g>'
    + '<g class="hero-landing__figure">'
    + `<path d="M80 58 C34 70 16 122 30 168 C50 150 110 150 130 168 C144 122 126 70 80 58 Z" fill="${accent}"/>`
    + `<path d="M40 150 C48 138 58 132 62 150 L56 178 L38 172 Z" fill="${accentDark}"/>`
    + `<path d="M120 150 C112 138 102 132 98 150 L104 178 L122 172 Z" fill="${accentDark}"/>`
    + `<ellipse cx="80" cy="112" rx="30" ry="34" fill="${accentDark}"/>`
    + '<path d="M80 97l4 8 9 1-6.5 6 2 8.7-8.5-5-8.5 5 2-8.7-6.5-6 9-1Z" fill="#fff"/>'
    + `<ellipse cx="46" cy="118" rx="9" ry="7" fill="#c98a4b" transform="rotate(-18 46 118)"/>`
    + `<ellipse cx="114" cy="118" rx="9" ry="7" fill="#c98a4b" transform="rotate(18 114 118)"/>`
    + '<circle cx="80" cy="54" r="25" fill="#c98a4b"/>'
    + '<circle cx="62" cy="36" r="9" fill="#c98a4b"/><circle cx="98" cy="36" r="9" fill="#c98a4b"/>'
    + '<circle cx="62" cy="37" r="4" fill="#f0d3ab"/><circle cx="98" cy="37" r="4" fill="#f0d3ab"/>'
    + '<ellipse cx="80" cy="60" rx="12" ry="9" fill="#f0d3ab"/>'
    + '<ellipse cx="80" cy="56" rx="3.6" ry="3" fill="#3b2a20"/>'
    + '<circle cx="72" cy="48" r="2.6" fill="#3b2a20"/><circle cx="88" cy="48" r="2.6" fill="#3b2a20"/>'
    + '<path d="M73 63c4 3 10 3 14 0" stroke="#3b2a20" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    + '</g>'
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
  else if (page === 'certificate') initCertificatePage();

  window.addEventListener('safetylib:langchange', () => applyStaticI18n());
});
