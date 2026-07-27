/* ==========================================================================
   Safety Superheroes — tiny sound effects
   A handful of short, soft tones synthesized with the Web Audio API (no
   audio files to fetch). All skipped entirely when Calm Mode is on (see
   js/calmmode.js's isMuted()) or when Web Audio isn't available -- never
   blocks or throws either way. Kept deliberately gentle/low-volume across
   the board -- no buzzers or harsh tones, even for "zap" effects.
   ========================================================================== */

let sharedAudioCtx = null;

function getSharedAudioCtx(){
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioCtx) sharedAudioCtx = new Ctx();
  return sharedAudioCtx;
}

// A single short, soft downward blip -- used for the Sky Chase bonus
// mission's "zap" feedback. A gentle sine sweep, not a harsh buzzer.
function playZapSound(){
  if (typeof isMuted === 'function' && isMuted()) return;
  const ctx = getSharedAudioCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(720, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.12);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  } catch (e) { /* audio blocked/unavailable -- silently skip */ }
}

// A single warm, short note -- used for per-question "correct" feedback in
// the quiz games. Deliberately smaller/quieter than the full completion
// chime below, which is reserved for finishing a whole lesson/level.
function playCorrectDing(){
  if (typeof isMuted === 'function' && isMuted()) return;
  const ctx = getSharedAudioCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 659.25; // E5
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) { /* audio blocked/unavailable -- silently skip */ }
}

function playCompletionChime(){
  if (typeof isMuted === 'function' && isMuted()) return;
  const ctx = getSharedAudioCtx();
  if (!ctx) return;
  try {
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
