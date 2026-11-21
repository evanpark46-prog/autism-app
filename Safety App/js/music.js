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
const MUSIC_TRACK_KEY = 'safetylib_music_track';
const MUSIC_VOLUME = 0.075;

function isMusicOn(){
  try { return localStorage.getItem(MUSIC_KEY) === 'on'; } catch (e) { return false; }
}
function musicBlocked(){ return typeof getCalmMode === 'function' && getCalmMode(); }

/* ---- The tracks (all original compositions) ----
   8th-note grid, 8 steps per bar, 8 bars per loop. Numbers are MIDI notes,
   '_' holds the previous note, null is a rest. Chords are [root, 'M'|'m'].
   style.bass: 'march' (root on 1, fifth on 3) | 'drive' (steady 8ths) | 'soft' (half notes)
   style.comp: 'stabs' (chord hits on 2 & 4) | 'pad' (held chord) | 'offbeat' (hits between beats)
   style.drums: 'march' | 'drive' | 'soft' | 'fanfare' */
const _ = '_';
const MUSIC_TRACKS = [
  { id: 'march', emoji: '🦸', nameKey: 'music_track_march', bpm: 104,
    lead: [
      [67, 72, 76, _, 79, _, _, _],      // C
      [81, _, 79, 77, 76, _, 72, _],     // F
      [76, _, 79, _, 84, _, _, _],       // C
      [83, _, 81, _, 79, _, 74, _],      // G
      [72, _, 75, _, 80, _, _, _],       // Ab
      [74, _, 77, _, 82, _, _, _],       // Bb
      [84, _, _, _, 79, _, 76, _],       // C
      [79, _, 84, _, _, _, null, null],  // C
    ],
    chords: [[48, 'M'], [53, 'M'], [48, 'M'], [43, 'M'], [44, 'M'], [46, 'M'], [48, 'M'], [48, 'M']],
    style: { lead: 'brass', bass: 'march', comp: 'stabs', drums: 'march' } },

  { id: 'sky', emoji: '🚀', nameKey: 'music_track_sky', bpm: 132,
    lead: [
      [69, 72, 76, 72, 81, _, 76, _],    // Am
      [77, _, 72, 77, 81, _, 84, _],     // F
      [79, _, 76, 72, 76, _, 79, _],     // C
      [83, _, 79, 74, 79, _, _, _],      // G
      [81, _, _, 79, 76, _, 72, _],      // Am
      [77, _, _, 76, 72, _, 69, _],      // F
      [71, 74, 79, _, 83, _, 86, _],     // G
      [88, _, _, _, 80, _, _, _],        // E
    ],
    chords: [[45, 'm'], [41, 'M'], [48, 'M'], [43, 'M'], [45, 'm'], [41, 'M'], [43, 'M'], [40, 'M']],
    style: { lead: 'synth', bass: 'drive', comp: 'offbeat', drums: 'drive' } },

  { id: 'city', emoji: '🌃', nameKey: 'music_track_city', bpm: 90,
    lead: [
      [72, _, _, _, 69, _, 72, _],       // F
      [74, _, _, _, 77, _, _, _],        // Dm
      [74, _, 72, _, 70, _, _, _],       // Bb
      [72, _, _, _, null, null, 67, _],  // C
      [77, _, _, _, 76, _, 74, _],       // F
      [72, _, _, _, 69, _, _, _],        // Dm
      [70, _, 74, _, 79, _, 77, _],      // Gm
      [76, _, _, _, _, _, null, null],   // C
    ],
    chords: [[41, 'M'], [38, 'm'], [46, 'M'], [48, 'M'], [41, 'M'], [38, 'm'], [43, 'm'], [48, 'M']],
    style: { lead: 'soft', bass: 'soft', comp: 'pad', drums: 'soft' } },

  { id: 'victory', emoji: '🏆', nameKey: 'music_track_victory', bpm: 112,
    lead: [
      [74, _, _, 78, 81, _, _, _],       // D
      [83, _, 81, _, 79, _, 78, _],      // G
      [76, _, _, 78, 79, _, 81, _],      // A
      [86, _, _, _, 81, _, _, _],        // D
      [83, _, _, 81, 78, _, 74, _],      // Bm
      [79, _, _, 78, 76, _, 74, _],      // G
      [73, _, 76, _, 81, _, 85, _],      // A
      [86, _, _, _, _, _, null, null],   // D
    ],
    chords: [[50, 'M'], [43, 'M'], [45, 'M'], [50, 'M'], [47, 'm'], [43, 'M'], [45, 'M'], [50, 'M']],
    style: { lead: 'brass', bass: 'march', comp: 'stabs', drums: 'fanfare' } },
];

function currentTrack(){
  let id = null;
  try { id = localStorage.getItem(MUSIC_TRACK_KEY); } catch (e) { /* ignore */ }
  return MUSIC_TRACKS.find(tr => tr.id === id) || MUSIC_TRACKS[0];
}

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

let playingTrack = MUSIC_TRACKS[0];

function chordTones(chord){
  const [root, q] = chord;
  return [0, q === 'm' ? 3 : 4, 7].map(iv => root + iv);
}

function playLead(note, time, dur, kind, variation){
  if (kind === 'soft'){
    playTone(midiHz(note), time, dur, 'sine', 0.3, 0.04);
    playTone(midiHz(note + 12), time, dur, 'sine', 0.05, 0.04);
    return;
  }
  if (variation){
    playTone(midiHz(note - 12), time, dur, 'triangle', 0.32);
    return;
  }
  if (kind === 'synth'){
    playTone(midiHz(note), time, dur, 'square', 0.07, 0.01);
    playTone(midiHz(note), time, dur, 'triangle', 0.22, 0.01);
    return;
  }
  playTone(midiHz(note), time, dur, 'sawtooth', 0.11);
  playTone(midiHz(note), time, dur, 'triangle', 0.22); // body under the "brass"
}

function scheduleStep(step, time){
  const tr = playingTrack;
  const eighth = 60 / tr.bpm / 2;
  const bar = Math.floor(step / 8) % 8;
  const pos = step % 8;
  const chord = tr.chords[bar];
  const root = chord[0];
  const tones = chordTones(chord);
  const variation = tr.style.lead !== 'soft' && musicLoop % 2 === 1; // every other loop: softer, lower melody

  // Lead melody
  const note = tr.lead[bar][pos];
  if (typeof note === 'number'){
    let len = 1;
    while (pos + len < 8 && tr.lead[bar][pos + len] === _) len++;
    playLead(note, time, len * eighth * 0.95, tr.style.lead, variation);
  }

  // Bass
  if (tr.style.bass === 'march' && (pos === 0 || pos === 4)){
    playTone(midiHz(root - 12 + (pos === 4 ? 7 : 0)), time, eighth * 1.6, 'triangle', 0.42);
  } else if (tr.style.bass === 'drive'){
    playTone(midiHz(root - 12 + (pos % 4 === 3 ? 12 : 0)), time, eighth * 0.8, 'triangle', 0.34, 0.008);
  } else if (tr.style.bass === 'soft' && (pos === 0 || pos === 4)){
    playTone(midiHz(root - 12), time, eighth * 3.6, 'sine', 0.38, 0.03);
  }

  // Chords
  if (tr.style.comp === 'stabs' && (pos === 2 || pos === 6)){
    tones.forEach(n => playTone(midiHz(n + 12), time, eighth * 0.9, 'square', 0.035, 0.01));
  } else if (tr.style.comp === 'offbeat' && pos % 2 === 1){
    tones.forEach(n => playTone(midiHz(n + 12), time, eighth * 0.6, 'square', 0.022, 0.005));
  } else if (tr.style.comp === 'pad' && pos === 0){
    tones.forEach(n => playTone(midiHz(n + 12), time, eighth * 7.6, 'triangle', 0.07, 0.25));
  }

  // Drums
  const d = tr.style.drums;
  if (d === 'march' || d === 'fanfare'){
    if (pos === 0 || pos === 4) playDrum('kick', time, 0.5);
    if (pos === 2 || pos === 6) playDrum('snare', time, d === 'fanfare' ? 0.14 : 0.12);
    if (bar === 7 && pos >= 4){
      playDrum('snare', time, 0.07);
      playDrum('snare', time + eighth / 2, 0.09);
    }
    if (d === 'fanfare' && bar % 4 === 3 && pos === 6) playDrum('kick', time, 0.45);
  } else if (d === 'drive'){
    if (pos % 2 === 0) playDrum('kick', time, 0.42);
    if (pos === 2 || pos === 6) playDrum('snare', time, 0.11);
    if (pos % 2 === 1) playDrum('snare', time, 0.03); // light "hi-hat"
  } else if (d === 'soft'){
    if (pos === 0) playDrum('kick', time, 0.32);
    if (pos === 4) playDrum('snare', time, 0.05);
  }
}

function musicScheduler(){
  const eighth = 60 / playingTrack.bpm / 2;
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
    playingTrack = currentTrack();
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

/* ---- Header button + track menu ---- */
function musicButtonLabel(){ return t(isMusicOn() ? 'music_menu_label_on' : 'music_menu_label_off', { track: t(currentTrack().nameKey) }); }

function selectTrack(id){
  try { localStorage.setItem(MUSIC_TRACK_KEY, id); } catch (e) { /* ignore */ }
  if (musicPlaying) stopMusic();
  setMusicOn(true);
}

function injectMusicButton(){
  const anchor = document.querySelector('[data-profile-open]') || document.querySelector('.display-settings');
  if (!anchor || document.querySelector('[data-music-toggle]')) return;
  const wrap = document.createElement('div');
  wrap.className = 'music-menu-wrap';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'music-btn';
  btn.setAttribute('data-music-toggle', '');
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  const menu = document.createElement('div');
  menu.className = 'music-menu';
  menu.setAttribute('role', 'menu');
  menu.hidden = true;
  wrap.appendChild(btn);
  wrap.appendChild(menu);

  const render = () => {
    const on = isMusicOn() && !musicBlocked();
    btn.innerHTML = `<span aria-hidden="true">${on ? '🎵' : '🔇'}</span>`;
    btn.setAttribute('aria-label', musicBlocked() ? t('music_calm_note') : musicButtonLabel());
    btn.title = musicBlocked() ? t('music_calm_note') : musicButtonLabel();
    btn.classList.toggle('is-on', on);
    btn.disabled = musicBlocked();
    const cur = currentTrack().id;
    menu.innerHTML = `<p class="music-menu__title">${escapeHtml(t('music_menu_title'))}</p>`
      + MUSIC_TRACKS.map(tr => `
        <button type="button" role="menuitemradio" class="music-menu__item" data-music-track="${tr.id}" aria-checked="${on && tr.id === cur}">
          <span aria-hidden="true">${tr.emoji}</span> ${escapeHtml(t(tr.nameKey))}
        </button>`).join('')
      + `<button type="button" role="menuitemradio" class="music-menu__item music-menu__off" data-music-track="off" aria-checked="${!on}">
          <span aria-hidden="true">🔇</span> ${escapeHtml(t('music_off'))}
        </button>`;
    menu.querySelectorAll('[data-music-track]').forEach(item => item.addEventListener('click', () => {
      const id = item.dataset.musicTrack;
      if (id === 'off') setMusicOn(false); else selectTrack(id);
      close();
      btn.focus();
    }));
  };
  const open = () => { render(); menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); const first = menu.querySelector('[aria-checked="true"]') || menu.querySelector('[data-music-track]'); if (first) first.focus(); };
  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => { if (menu.hidden) open(); else close(); });
  // composedPath() (not contains) because opening the menu re-renders the
  // button icon, detaching the original click target.
  document.addEventListener('click', e => { if (!menu.hidden && !e.composedPath().includes(wrap)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden){ close(); btn.focus(); } });
  menu.addEventListener('keydown', e => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = [...menu.querySelectorAll('[data-music-track]')];
    const i = items.indexOf(document.activeElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
  });

  anchor.parentNode.insertBefore(wrap, anchor);
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
