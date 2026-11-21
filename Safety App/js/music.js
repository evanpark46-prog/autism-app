/* ==========================================================================
   Safety Superheroes — background hero theme (opt-in)
   An original 8-bar superhero march, synthesized live with the Web Audio API
   (no audio files, nothing copyrighted). Design choices for this audience:
     - OFF by default; the learner/grown-up turns it on with the 🎵 button.
       Remembered per device.
     - Quiet: low master volume, soft low-passed tones, no sudden hits.
     - Ducks (gets much quieter) while read-aloud is talking.
     - Never plays under Calm Mode; pauses when the tab is hidden.
     - Browsers only allow audio after a tap/keypress, so on a new page it
       starts on the learner's first interaction.
   ========================================================================== */

const MUSIC_KEY = 'safetylib_music';
const MUSIC_BPM = 104;
const MUSIC_VOLUME = 0.075;

function isMusicOn(){
  try { return localStorage.getItem(MUSIC_KEY) === 'on'; } catch (e) { return false; }
}
function musicBlocked(){ return typeof getCalmMode === 'function' && getCalmMode(); }

/* ---- The tune ----
   8th-note grid, 8 steps per bar. Numbers are MIDI notes, '_' holds the
   previous note, null is a rest. Phrase A climbs (C F C G); phrase B lifts
   through the heroic Ab -> Bb -> C cadence. */
const _ = '_';
const THEME_LEAD = [
  [67, 72, 76, _, 79, _, _, _],      // C
  [81, _, 79, 77, 76, _, 72, _],     // F
  [76, _, 79, _, 84, _, _, _],       // C
  [83, _, 81, _, 79, _, 74, _],      // G
  [72, _, 75, _, 80, _, _, _],       // Ab
  [74, _, 77, _, 82, _, _, _],       // Bb
  [84, _, _, _, 79, _, 76, _],       // C
  [79, _, 84, _, _, _, null, null],  // C
];
const THEME_CHORDS = [48, 53, 48, 43, 44, 46, 48, 48]; // roots (major triads)

let musicCtx = null, musicMaster = null, musicDuck = null, musicLowpass = null;
let musicTimer = null, musicNextTime = 0, musicStep = 0, musicLoop = 0, musicPlaying = false;
let noiseBuffer = null;
let musicFanfareBus = null;
let fanfareHold = 0;
// Read-aloud tracking for ducking. js/speech.js announces each utterance's
// start/end. (Touching speechSynthesis from here while an AudioContext is
// live was found to stall page navigation in Chromium.)
let speechActive = 0, speechLastStart = 0;
window.addEventListener('safetylib:speechstart', () => { speechActive++; speechLastStart = Date.now(); });
window.addEventListener('safetylib:speechend', () => { speechActive = Math.max(0, speechActive - 1); });

function midiHz(m){ return 440 * Math.pow(2, (m - 69) / 12); }

function ensureMusicCtx(){
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!musicCtx){
    musicCtx = new Ctx();
    musicLowpass = musicCtx.createBiquadFilter();
    musicLowpass.type = 'lowpass';
    musicLowpass.frequency.value = 2600;
    musicDuck = musicCtx.createGain();
    musicDuck.gain.value = 1;
    musicMaster = musicCtx.createGain();
    musicMaster.gain.value = 0;
    musicLowpass.connect(musicDuck);
    musicDuck.connect(musicMaster);
    musicMaster.connect(musicCtx.destination);
    musicFanfareBus = musicCtx.createBiquadFilter();
    musicFanfareBus.type = 'lowpass';
    musicFanfareBus.frequency.value = 3000;
    musicFanfareBus.connect(musicMaster);
    noiseBuffer = musicCtx.createBuffer(1, musicCtx.sampleRate * 0.25, musicCtx.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return musicCtx;
}

function playTone(freq, start, dur, type, level, attack){
  const osc = musicCtx.createOscillator();
  const g = musicCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(level, start + (attack || 0.015));
  g.gain.exponentialRampToValueAtTime(level * 0.55, start + Math.min(dur * 0.5, 0.25));
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g); g.connect(musicLowpass);
  osc.start(start); osc.stop(start + dur + 0.02);
}

function fanfareTone(freq, start, dur, type, level){
  const osc = musicCtx.createOscillator();
  const g = musicCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(level, start + 0.012);
  g.gain.exponentialRampToValueAtTime(level * 0.6, start + Math.min(dur * 0.5, 0.2));
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g); g.connect(musicFanfareBus);
  osc.start(start); osc.stop(start + dur + 0.02);
}

function playDrum(kind, start, level){
  if (kind === 'kick'){
    const osc = musicCtx.createOscillator(); const g = musicCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, start);
    osc.frequency.exponentialRampToValueAtTime(45, start + 0.12);
    g.gain.setValueAtTime(level, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
    osc.connect(g); g.connect(musicDuck);
    osc.start(start); osc.stop(start + 0.18);
    return;
  }
  const src = musicCtx.createBufferSource(); src.buffer = noiseBuffer;
  const hp = musicCtx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
  const g = musicCtx.createGain();
  g.gain.setValueAtTime(level, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);
  src.connect(hp); hp.connect(g); g.connect(musicDuck);
  src.start(start); src.stop(start + 0.1);
}

function scheduleStep(step, time){
  const eighth = 60 / MUSIC_BPM / 2;
  const bar = Math.floor(step / 8) % 8;
  const pos = step % 8;
  const root = THEME_CHORDS[bar];
  const variation = musicLoop % 2 === 1; // every other loop: softer, lower melody

  // Lead melody
  const note = THEME_LEAD[bar][pos];
  if (typeof note === 'number'){
    let len = 1;
    while (pos + len < 8 && THEME_LEAD[bar][pos + len] === _) len++;
    const dur = len * eighth * 0.95;
    if (variation){
      playTone(midiHz(note - 12), time, dur, 'triangle', 0.32);
    } else {
      playTone(midiHz(note), time, dur, 'sawtooth', 0.11);
      playTone(midiHz(note), time, dur, 'triangle', 0.22); // body under the "brass"
    }
  }
  // March: bass on beats 1 & 3, chord stabs on 2 & 4
  if (pos === 0 || pos === 4){
    playTone(midiHz(root - 12 + (pos === 4 ? 7 : 0)), time, eighth * 1.6, 'triangle', 0.42);
  }
  if (pos === 2 || pos === 6){
    [0, 4, 7].forEach(iv => playTone(midiHz(root + 12 + iv), time, eighth * 0.9, 'square', 0.035, 0.01));
  }
  // Drums: soft kick on 1 & 3, light snare on 2 & 4, a little roll into the loop
  if (pos === 0 || pos === 4) playDrum('kick', time, 0.5);
  if (pos === 2 || pos === 6) playDrum('snare', time, 0.12);
  if (bar === 7 && pos >= 4){
    playDrum('snare', time, 0.07);
    playDrum('snare', time + eighth / 2, 0.09);
  }
}

function musicScheduler(){
  const eighth = 60 / MUSIC_BPM / 2;
  while (musicNextTime < musicCtx.currentTime + 0.15){
    scheduleStep(musicStep, musicNextTime);
    musicNextTime += eighth;
    musicStep++;
    if (musicStep % 64 === 0) musicLoop++;
  }
  // Duck under read-aloud speech
  const talking = speechActive > 0 && Date.now() - speechLastStart < 30000;
  const target = Date.now() < fanfareHold ? 0.15 : (talking ? 0.22 : 1);
  musicDuck.gain.setTargetAtTime(target, musicCtx.currentTime, 0.12);
}

function startMusic(){
  if (musicPlaying || musicBlocked() || !isMusicOn()) return;
  const ctx = ensureMusicCtx();
  if (!ctx) return;
  const begin = () => {
    if (musicPlaying) return;
    musicPlaying = true;
    musicStep = 0; musicLoop = 0;
    musicNextTime = ctx.currentTime + 0.08;
    musicMaster.gain.cancelScheduledValues(ctx.currentTime);
    musicMaster.gain.setValueAtTime(0.0001, ctx.currentTime);
    musicMaster.gain.exponentialRampToValueAtTime(MUSIC_VOLUME, ctx.currentTime + 1.2); // gentle fade-in
    musicTimer = setInterval(musicScheduler, 25);
  };
  if (ctx.state === 'suspended') ctx.resume().then(begin).catch(() => {});
  else begin();
}

function stopMusic(){
  if (!musicPlaying || !musicCtx) return;
  musicPlaying = false;
  clearInterval(musicTimer);
  musicTimer = null;
  const now = musicCtx.currentTime;
  musicMaster.gain.cancelScheduledValues(now);
  musicMaster.gain.setValueAtTime(Math.max(musicMaster.gain.value, 0.0001), now);
  musicMaster.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
}

function setMusicOn(on){
  try { localStorage.setItem(MUSIC_KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
  if (on) startMusic(); else stopMusic();
  window.dispatchEvent(new CustomEvent('safetylib:musicchange'));
}

/* A short heroic fanfare for finishing a level -- only when music is on
   (otherwise the existing soft completion chime plays). */
function playHeroFanfare(){
  if (musicBlocked() || !isMusicOn() || !musicPlaying || !musicCtx) return false;
  const ctx = musicCtx;
  try {
    const t0 = ctx.currentTime + 0.05;
    // Pause the loop's melody for the fanfare by briefly ducking the bed,
    // then play the fanfare straight to the master bus.
    musicDuck.gain.setTargetAtTime(0.15, ctx.currentTime, 0.05);
    [[67, 0, 0.14], [72, 0.15, 0.14], [76, 0.3, 0.14], [79, 0.45, 0.5], [76, 0.98, 0.14], [79, 1.13, 0.14], [84, 1.28, 0.9]]
      .forEach(([n, at, d]) => {
        fanfareTone(midiHz(n), t0 + at, d, 'sawtooth', 0.11);
        fanfareTone(midiHz(n), t0 + at, d, 'triangle', 0.22);
      });
    [48, 52, 55].forEach(n => fanfareTone(midiHz(n), t0 + 1.28, 0.9, 'triangle', 0.16));
    fanfareHold = Date.now() + 2600; // keep the bed ducked until the fanfare ends
    return true;
  } catch (e) { return false; }
}

/* ---- Header button ---- */
function musicButtonLabel(){ return t(isMusicOn() ? 'music_turn_off' : 'music_turn_on'); }

function injectMusicButton(){
  const anchor = document.querySelector('[data-profile-open]') || document.querySelector('.display-settings');
  if (!anchor || document.querySelector('[data-music-toggle]')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'music-btn';
  btn.setAttribute('data-music-toggle', '');
  const render = () => {
    const on = isMusicOn() && !musicBlocked();
    btn.innerHTML = `<span aria-hidden="true">${on ? '🎵' : '🔇'}</span>`;
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', musicButtonLabel());
    btn.title = musicBlocked() ? t('music_calm_note') : musicButtonLabel();
    btn.classList.toggle('is-on', on);
    btn.disabled = musicBlocked();
  };
  btn.addEventListener('click', () => { setMusicOn(!isMusicOn()); render(); });
  anchor.parentNode.insertBefore(btn, anchor);
  render();
  window.addEventListener('safetylib:musicchange', render);
  window.addEventListener('safetylib:langchange', render);
  // Calm Mode toggled from the Display panel: stop music immediately.
  document.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('[data-calmmode-btn]')){
      setTimeout(() => { if (musicBlocked()) stopMusic(); else if (isMusicOn()) startMusic(); render(); }, 0);
    }
  });
}

function initMusic(){
  injectMusicButton();
  // Release the audio device when leaving the page so navigation is never
  // held up by a live AudioContext.
  window.addEventListener('pagehide', () => {
    if (musicTimer){ clearInterval(musicTimer); musicTimer = null; }
    musicPlaying = false;
    if (musicCtx){ try { musicCtx.close(); } catch (e) { /* ignore */ } musicCtx = null; }
  });
  if (!isMusicOn() || musicBlocked()) return;
  // Autoplay rules: start on the first tap / key press on this page.
  const kick = () => {
    window.removeEventListener('pointerdown', kick, true);
    window.removeEventListener('keydown', kick, true);
    startMusic();
  };
  window.addEventListener('pointerdown', kick, true);
  window.addEventListener('keydown', kick, true);
  document.addEventListener('visibilitychange', () => {
    if (!musicCtx) return;
    if (document.hidden) musicCtx.suspend(); else if (musicPlaying) musicCtx.resume();
  });
}
