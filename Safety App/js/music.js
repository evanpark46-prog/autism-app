/* ==========================================================================
   Safety Superheroes — background hero music (opt-in)
   Real recorded instrumental tracks by Kevin MacLeod (incompetech.com),
   licensed under Creative Commons: By Attribution 4.0
   (https://creativecommons.org/licenses/by/4.0/). Credit is shown in the
   music menu and on the For Parents page. Files live in audio/music/ and were
   re-encoded to 112 kbps and loudness-matched.

   Design choices for this audience:
     - OFF by default; the learner/grown-up turns it on with the 🎵 button.
       Remembered per device.
     - Quiet background level; ducks (gets much quieter) while read-aloud
       is talking.
     - Never plays under Calm Mode; pauses when the tab is hidden.
     - Picks up where it left off when moving to another page.
     - Browsers only allow audio after a tap/keypress, so if a new page
       can't start it straight away it starts on the first interaction.
   ========================================================================== */

const MUSIC_KEY = 'safetylib_music';
const MUSIC_TRACK_KEY = 'safetylib_music_track';
const MUSIC_POS_KEY = 'safetylib_music_pos';
const MUSIC_VOLUME = 0.32;      // background level (tracks are loudness-matched)
const MUSIC_DUCKED = 0.07;      // while read-aloud is talking
const MUSIC_CREDIT_URL = 'https://incompetech.com';
const MUSIC_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';

function isMusicOn(){
  try { return localStorage.getItem(MUSIC_KEY) === 'on'; } catch (e) { return false; }
}
function musicBlocked(){ return typeof getCalmMode === 'function' && getCalmMode(); }

/* Titles are the composer's song names (kept as-is in both languages);
   nameKey adds a short translated description of the style. */
const MUSIC_TRACKS = [
  { id: 'super-power', file: 'super-power-cool-dude.mp3', title: 'Super Power Cool Dude', emoji: '⚡', nameKey: 'music_track_superpower' },
  { id: 'big-rock',    file: 'big-rock.mp3',              title: 'Big Rock',              emoji: '🎸', nameKey: 'music_track_bigrock' },
  { id: 'heroic-age',  file: 'heroic-age.mp3',            title: 'Heroic Age',            emoji: '🦸', nameKey: 'music_track_heroicage' },
  { id: 'adventure',   file: 'call-to-adventure.mp3',     title: 'Call to Adventure',     emoji: '🗺️', nameKey: 'music_track_adventure' },
  { id: 'show',        file: 'welcome-to-the-show.mp3',   title: 'Welcome to the Show',   emoji: '🎺', nameKey: 'music_track_show' },
  { id: 'party',       file: 'who-likes-to-party.mp3',    title: 'Who Likes to Party',    emoji: '🎉', nameKey: 'music_track_party' },
];

function currentTrack(){
  let id = null;
  try { id = localStorage.getItem(MUSIC_TRACK_KEY); } catch (e) { /* ignore */ }
  return MUSIC_TRACKS.find(tr => tr.id === id) || MUSIC_TRACKS[0];
}
function trackLabel(tr){ return `${tr.title} · ${t(tr.nameKey)}`; }

// Resolve audio/music/ relative to this script, so pages in any folder work.
const MUSIC_BASE = (() => {
  const s = document.currentScript && document.currentScript.src;
  return s ? new URL('../audio/music/', s).href : 'audio/music/';
})();

let musicEl = null, musicCtx = null, musicGain = null, musicPlaying = false, playingTrack = null;
let musicDuckTimer = null;
// Read-aloud tracking for ducking: js/speech.js announces each utterance's
// start/end. (Touching speechSynthesis from here while an AudioContext is
// live was found to stall page navigation in Chromium.)
let speechActive = 0, speechLastStart = 0;
window.addEventListener('safetylib:speechstart', () => { speechActive++; speechLastStart = Date.now(); applyMusicLevel(); });
window.addEventListener('safetylib:speechend', () => { speechActive = Math.max(0, speechActive - 1); applyMusicLevel(); });

function musicTalking(){ return speechActive > 0 && Date.now() - speechLastStart < 30000; }

/* Volume goes through a Web Audio gain node when possible (iPhone/iPad
   ignore <audio>.volume), falling back to element volume. */
function setMusicLevel(level, seconds){
  if (!musicEl) return;
  if (musicGain && musicCtx){
    const now = musicCtx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(Math.max(musicGain.gain.value, 0.0001), now);
    musicGain.gain.linearRampToValueAtTime(Math.max(level, 0.0001), now + (seconds || 0.3));
  } else {
    musicEl.volume = Math.max(0, Math.min(1, level));
  }
}
function applyMusicLevel(){
  if (!musicPlaying) return;
  setMusicLevel(musicTalking() ? MUSIC_DUCKED : MUSIC_VOLUME, 0.35);
  // Safety net if a speechend event never arrives: re-check after 30s.
  clearTimeout(musicDuckTimer);
  if (musicTalking()) musicDuckTimer = setTimeout(applyMusicLevel, 30500);
}

function ensureMusicEl(){
  if (musicEl) return musicEl;
  musicEl = new Audio();
  musicEl.preload = 'none';
  musicEl.loop = false;
  musicEl.addEventListener('ended', () => {
    // Play the playlist in order, starting from the chosen song.
    const i = MUSIC_TRACKS.indexOf(playingTrack);
    loadTrack(MUSIC_TRACKS[(i + 1) % MUSIC_TRACKS.length], 0);
    musicEl.play().catch(() => {});
    window.dispatchEvent(new CustomEvent('safetylib:musicchange'));
  });
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (Ctx){
    try {
      musicCtx = new Ctx();
      const src = musicCtx.createMediaElementSource(musicEl);
      musicGain = musicCtx.createGain();
      musicGain.gain.value = 0.0001;
      src.connect(musicGain); musicGain.connect(musicCtx.destination);
    } catch (e) { musicCtx = null; musicGain = null; }
  }
  if (!musicGain) musicEl.volume = 0;
  return musicEl;
}

function loadTrack(tr, pos){
  playingTrack = tr;
  musicEl.src = MUSIC_BASE + encodeURIComponent(tr.file);
  if (pos > 0){
    const seek = () => { try { musicEl.currentTime = pos; } catch (e) { /* ignore */ } };
    musicEl.addEventListener('loadedmetadata', seek, { once: true });
  }
}

function savedPosition(){
  try {
    const s = JSON.parse(sessionStorage.getItem(MUSIC_POS_KEY) || 'null');
    if (s && s.id && Date.now() - s.at < 10 * 60 * 1000) return s;
  } catch (e) { /* ignore */ }
  return null;
}

// Returns a promise resolving true if playback started.
function startMusic(){
  if (musicPlaying || musicBlocked() || !isMusicOn()) return Promise.resolve(musicPlaying);
  ensureMusicEl();
  const want = currentTrack();
  const saved = savedPosition();
  // Resume where the last page left off (same song, or the playlist moved on).
  const resumeTrack = saved && MUSIC_TRACKS.find(tr => tr.id === saved.id);
  if (!playingTrack || playingTrack !== (resumeTrack || want)){
    loadTrack(resumeTrack || want, resumeTrack ? saved.pos : 0);
  }
  musicPlaying = true;
  if (musicCtx && musicCtx.state === 'suspended') musicCtx.resume().catch(() => {});
  return musicEl.play().then(() => {
    setMusicLevel(0.0001, 0.01);
    applyMusicLevel(); // gentle fade-in to the background level
    return true;
  }).catch(() => { musicPlaying = false; return false; });
}

function stopMusic(){
  if (!musicPlaying || !musicEl) return;
  musicPlaying = false;
  setMusicLevel(0.0001, 0.35);
  const el = musicEl;
  setTimeout(() => { if (!musicPlaying) el.pause(); }, 380);
}

function setMusicOn(on){
  try { localStorage.setItem(MUSIC_KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
  if (!on){ try { sessionStorage.removeItem(MUSIC_POS_KEY); } catch (e) { /* ignore */ } }
  if (on) startMusic(); else stopMusic();
  window.dispatchEvent(new CustomEvent('safetylib:musicchange'));
}

/* Level complete: with real music playing, give it a short celebratory
   swell instead of a synthesized fanfare. Returns false so the normal
   completion chime still plays on top. */
function playHeroFanfare(){
  if (!musicPlaying || musicTalking()) return false;
  setMusicLevel(Math.min(1, MUSIC_VOLUME * 1.8), 0.4);
  setTimeout(applyMusicLevel, 2600);
  return false;
}

/* ---- Header button + track menu ---- */
function musicButtonLabel(){
  const tr = (musicPlaying && playingTrack) || currentTrack();
  return t(isMusicOn() ? 'music_menu_label_on' : 'music_menu_label_off', { track: tr.title });
}

function selectTrack(id){
  try {
    localStorage.setItem(MUSIC_TRACK_KEY, id);
    sessionStorage.removeItem(MUSIC_POS_KEY);
  } catch (e) { /* ignore */ }
  const tr = MUSIC_TRACKS.find(x => x.id === id) || MUSIC_TRACKS[0];
  try { localStorage.setItem(MUSIC_KEY, 'on'); } catch (e) { /* ignore */ }
  if (musicBlocked()) return;
  ensureMusicEl();
  musicPlaying = false;
  loadTrack(tr, 0);
  startMusic().then(() => window.dispatchEvent(new CustomEvent('safetylib:musicchange')));
  window.dispatchEvent(new CustomEvent('safetylib:musicchange'));
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
    const cur = ((musicPlaying && playingTrack) || currentTrack()).id;
    menu.innerHTML = `<p class="music-menu__title">${escapeHtml(t('music_menu_title'))}</p>`
      + MUSIC_TRACKS.map(tr => `
        <button type="button" role="menuitemradio" class="music-menu__item" data-music-track="${tr.id}" aria-checked="${on && tr.id === cur}">
          <span aria-hidden="true">${tr.emoji}</span>
          <span class="music-menu__name">${escapeHtml(tr.title)}<small>${escapeHtml(t(tr.nameKey))}</small></span>
        </button>`).join('')
      + `<button type="button" role="menuitemradio" class="music-menu__item music-menu__off" data-music-track="off" aria-checked="${!on}">
          <span aria-hidden="true">🔇</span> ${escapeHtml(t('music_off'))}
        </button>`
      + `<p class="music-menu__credit">${escapeHtml(t('music_credit_short'))}
          <a href="${MUSIC_CREDIT_URL}" target="_blank" rel="noopener">incompetech.com</a> ·
          <a href="${MUSIC_LICENSE_URL}" target="_blank" rel="noopener">CC BY 4.0</a></p>`;
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
  // Remember the song position for the next page, and release the audio
  // device so navigation is never held up by a live AudioContext.
  window.addEventListener('pagehide', () => {
    if (musicPlaying && musicEl && playingTrack){
      try { sessionStorage.setItem(MUSIC_POS_KEY, JSON.stringify({ id: playingTrack.id, pos: musicEl.currentTime || 0, at: Date.now() })); } catch (e) { /* ignore */ }
    }
    musicPlaying = false;
    if (musicEl){ try { musicEl.pause(); } catch (e) { /* ignore */ } }
    if (musicCtx){ try { musicCtx.close(); } catch (e) { /* ignore */ } }
    musicEl = null; musicCtx = null; musicGain = null; playingTrack = null;
  });
  // Back/forward cache restore: the player was released on pagehide.
  window.addEventListener('pageshow', e => {
    if (e.persisted && isMusicOn() && !musicBlocked()) startMusic();
  });
  document.addEventListener('visibilitychange', () => {
    if (!musicEl) return;
    if (document.hidden){ if (musicPlaying) musicEl.pause(); }
    else if (musicPlaying) musicEl.play().catch(() => {});
  });
  if (!isMusicOn() || musicBlocked()) return;
  // Try to continue straight away (allowed once the learner has interacted
  // with the site); otherwise start on the first tap / key press.
  const kick = () => {
    window.removeEventListener('pointerdown', kick, true);
    window.removeEventListener('keydown', kick, true);
    startMusic();
  };
  startMusic().then(ok => {
    if (ok) return;
    window.addEventListener('pointerdown', kick, true);
    window.addEventListener('keydown', kick, true);
  });
}
