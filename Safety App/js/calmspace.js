/* ==========================================================================
   Safety Superheroes — Calm space
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
      <div class="calmspace-circle" data-calmspace-circle aria-hidden="true">
        <svg class="calmspace-hero" viewBox="0 0 160 190" focusable="false">
          <path d="M80 62 C34 74 16 128 30 176 C54 158 106 158 130 176 C144 128 126 74 80 62 Z" fill="#4b3f8a"/>
          <path d="M38 158 C54 138 106 138 122 158 L130 178 C90 190 70 190 30 178 Z" fill="#2f2a63"/>
          <ellipse cx="80" cy="112" rx="32" ry="36" fill="#5b4fb0"/>
          <path d="M80 96l4 8.5 9.5 1-7 6.5 2.2 9.3-8.7-5.3-8.7 5.3 2.2-9.3-7-6.5 9.5-1Z" fill="#ffd166"/>
          <ellipse cx="66" cy="140" rx="9" ry="7" fill="#f2c199"/>
          <ellipse cx="94" cy="140" rx="9" ry="7" fill="#f2c199"/>
          <circle cx="80" cy="54" r="25" fill="#f2c199"/>
          <path d="M57 46c6-9 40-9 46 0 1.5 6-3 11-9 12.5-3.5-3.5-24.5-3.5-28 0-6-1.5-10.5-6.5-9-12.5Z" fill="#2f2a63"/>
          <path d="M66 50c2 2 6 2 8 0M86 50c2 2 6 2 8 0" stroke="#1c1740" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M74 64c3 2.4 9 2.4 12 0" stroke="#a8734a" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="calmspace-phase" data-calmspace-phase data-i18n="calmspace_in">Breathe in…</p>
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
