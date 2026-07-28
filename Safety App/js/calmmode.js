/* ==========================================================================
   Safety Superheroes — Calm Mode
   One toggle that: forces the same "no motion" behavior as
   prefers-reduced-motion (regardless of the OS setting), mutes the new
   sound effects this app adds (e.g. the completion chime -- never the
   existing read-aloud button, which stays available since some learners
   depend on it), and strips decorative chrome (tag pills, gradients,
   heavier shadows) so the screen shows only what's needed. Persisted
   locally and applied via [data-calm-mode] on <html>, same pattern as the
   skin/text-size preferences.

   ON by default (a never-visited learner gets the calm experience) --
   motion/decoration is the opt-in, not the opt-out, matching this app's
   own "a calm place" brief. Matches the inline bootstrap script in every
   page's <head>, which must stay in sync with this same default.
   ========================================================================== */

const CALM_MODE_KEY = 'safetylib_calm_mode';

function getCalmMode(){
  try { return localStorage.getItem(CALM_MODE_KEY) !== 'off'; } catch (e) { return true; }
}

function setCalmMode(on){
  try { localStorage.setItem(CALM_MODE_KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
  document.documentElement.setAttribute('data-calm-mode', on ? 'on' : 'off');
}

function isMuted(){
  return getCalmMode();
}

function initCalmModeToggle(){
  const wrap = document.querySelector('[data-calmmode-switch]');
  if (!wrap) return;
  function render(){
    const on = getCalmMode();
    wrap.innerHTML = `
      <button type="button" class="calmmode-toggle ${on ? 'is-on' : ''}" data-calmmode-btn role="switch" aria-checked="${on}">
        <span class="calmmode-toggle__track"><span class="calmmode-toggle__thumb"></span></span>
        <span>${t(on ? 'calmmode_on' : 'calmmode_off')}</span>
      </button>`;
    wrap.querySelector('[data-calmmode-btn]').addEventListener('click', () => {
      setCalmMode(!getCalmMode());
      render();
    });
  }
  render();
  window.addEventListener('safetylib:langchange', render);
}
