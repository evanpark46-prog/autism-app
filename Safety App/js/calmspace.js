/* ==========================================================================
   Safety Scouts — Calm space
   A always-reachable "I need a break" button that opens a quiet,
   breathing-paced overlay and returns the learner to exactly where they
   were. No sound, no score, nothing to get right — the one feature aimed
   squarely at overload, which is the thing most likely to end a session
   badly. Respects prefers-reduced-motion: no animated movement, just a
   static calm message the learner paces themselves.
   ========================================================================== */

function initCalmSpace(){
  if (document.querySelector('[data-calmspace-btn]')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'calmspace-btn';
  btn.setAttribute('data-calmspace-btn', '');
  btn.innerHTML = `<span aria-hidden="true">🌿</span> <span data-i18n="calmspace_btn">I need a break</span>`;
  document.body.appendChild(btn);

  const overlay = document.createElement('div');
  overlay.className = 'calmspace-overlay';
  overlay.setAttribute('data-calmspace-overlay', '');
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'calmspace-title');
  overlay.innerHTML = `
    <div class="calmspace-card">
      <h2 id="calmspace-title" data-i18n="calmspace_title">Let’s take a calm moment</h2>
      <div class="calmspace-circle" data-calmspace-circle>
        <span data-calmspace-phase data-i18n="calmspace_in">Breathe in…</span>
      </div>
      <p class="calmspace-hint" data-i18n="calmspace_hint">Take your time. There’s nothing to answer here.</p>
      <button type="button" class="btn btn-primary" data-calmspace-close data-i18n="calmspace_done_btn">I’m ready to continue</button>
    </div>`;
  document.body.appendChild(overlay);

  applyStaticI18n(overlay);
  applyStaticI18n(btn);

  const circle = overlay.querySelector('[data-calmspace-circle]');
  const phaseEl = overlay.querySelector('[data-calmspace-phase]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let breathTimer = null;
  let lastFocused = null;

  function startBreathing(){
    if (reduceMotion){
      phaseEl.textContent = t('calmspace_static');
      return;
    }
    let inhale = true;
    circle.classList.add('is-inhale');
    phaseEl.textContent = t('calmspace_in');
    breathTimer = setInterval(() => {
      inhale = !inhale;
      circle.classList.toggle('is-inhale', inhale);
      circle.classList.toggle('is-exhale', !inhale);
      phaseEl.textContent = inhale ? t('calmspace_in') : t('calmspace_out');
    }, 4000);
  }

  function stopBreathing(){
    if (breathTimer){ clearInterval(breathTimer); breathTimer = null; }
    circle.classList.remove('is-inhale', 'is-exhale');
  }

  function open(){
    lastFocused = document.activeElement;
    overlay.hidden = false;
    startBreathing();
    overlay.querySelector('[data-calmspace-close]').focus();
  }

  function close(){
    stopBreathing();
    overlay.hidden = true;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  btn.addEventListener('click', open);
  overlay.querySelector('[data-calmspace-close]').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  window.addEventListener('safetylib:langchange', () => {
    applyStaticI18n(overlay);
    applyStaticI18n(btn);
    if (!overlay.hidden && !reduceMotion){
      phaseEl.textContent = circle.classList.contains('is-exhale') ? t('calmspace_out') : t('calmspace_in');
    }
  });
}
