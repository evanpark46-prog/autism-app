/* ==========================================================================
   Safety Scouts — tiny sound effects
   Just one: a soft two-note completion chime, synthesized with the Web
   Audio API (no audio file to fetch). Skipped entirely when Calm Mode is
   on (see js/calmmode.js's isMuted()) or when Web Audio isn't available --
   never blocks or throws either way.
   ========================================================================== */

let sharedAudioCtx = null;

function playCompletionChime(){
  if (typeof isMuted === 'function' && isMuted()) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  try {
    if (!sharedAudioCtx) sharedAudioCtx = new Ctx();
    const ctx = sharedAudioCtx;
    const now = ctx.currentTime;
    [523.25, 659.25].forEach((freq, i) => { // C5, E5 -- a small, warm two-note rise
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.16;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    });
  } catch (e) { /* audio blocked/unavailable -- silently skip */ }
}
