/* ==========================================================================
   Safety Superheroes — Hero Movies player (movie.html)
   Plays an interactive 2D cartoon from js/movie-data.js using the jointed
   cast in js/movie-cast.js and the sets in js/movie-sets.js.
     - a scene plays, then pauses on the lesson's question
     - a wrong choice plays out what happens next, then the lesson's hero
       swoops in, rewinds time and leaves a Hero Tip
     - a right choice plays the safe ending and the story moves on
   Acting: knees/elbows, head turns, eyes that look at whoever is talking,
   blinking lids, emotion brows + mouth, lip sync to the recorded voice,
   squash & stretch hops, springy ears/tails, comic emotes, camera cuts,
   and a soft underscore that ducks under the voices.
   ========================================================================== */

const MOVIE_PROGRESS_KEY = 'safetylib_movies_v1';
function movieProgress(){ try { return JSON.parse(localStorage.getItem(MOVIE_PROGRESS_KEY) || '{}') || {}; } catch (e) { return {}; } }
function saveMovieProgress(id, rec){ try { const p = movieProgress(); p[id] = Object.assign(p[id] || {}, rec); localStorage.setItem(MOVIE_PROGRESS_KEY, JSON.stringify(p)); } catch (e) {} }
function movieOpts(){ try { return JSON.parse(localStorage.getItem('safetylib_movie_opts') || '{}') || {}; } catch (e) { return {}; } }
function saveMovieOpts(o){ try { localStorage.setItem('safetylib_movie_opts', JSON.stringify(o)); } catch (e) {} }
const mvEsc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mvClamp = (v, a, b) => Math.max(a, Math.min(b, v));

function initMoviePage(){
  const root = document.querySelector('[data-movie-root]');
  if (!root) return;
  const id = new URLSearchParams(location.search).get('id');
  if (id && MOVIE_EPISODES[id]) movieIntro(root, id);
  else movieShelf(root);
  window.addEventListener('safetylib:langchange', () => location.reload());
}
function movieHeroName(id, lang){ const h = typeof heroFor === 'function' ? heroFor(id) : null; return h ? (h[lang] || h.en).name : ''; }
function movieHeroHead(id, theme){ return typeof animalHeroSvg === 'function' ? animalHeroSvg(id, theme, '', { headOnly: true }) : ''; }
function movieHeroFull(id, theme){ return typeof animalHeroSvg === 'function' ? animalHeroSvg(id, theme, (typeof heroFor === 'function' && heroFor(id) && typeof heroEmblemInner === 'function') ? heroEmblemInner(heroFor(id).emblem) : '', {}) : ''; }

function movieShelf(root){
  const lang = getLang(), U = MOVIE_UI[lang] || MOVIE_UI.en, prog = movieProgress();
  const cards = Object.entries(MOVIE_EPISODES).map(([id, ep]) => `
    <a class="movie-card comic-panel" href="movie.html?id=${id}">
      <span class="movie-card__hero">${movieHeroHead(id, ep.theme)}</span>
      <span class="movie-card__ep">${U.episode} ${ep.n}</span>
      <span class="movie-card__title">${mvEsc(ep.title[lang] || ep.title.en)}</span>
      ${prog[id] && prog[id].done ? `<span class="movie-card__done">⭐ ${prog[id].stars || 0}</span>` : ''}
    </a>`).join('');
  root.innerHTML = `<section class="movie-shelf"><h1 class="page-title">🎬 ${U.movie}s</h1><p class="lead">${U.lead}</p><div class="movie-shelf__grid">${cards}</div></section>`;
}
function movieIntro(root, id){
  const ep = MOVIE_EPISODES[id], lang = getLang(), U = MOVIE_UI[lang] || MOVIE_UI.en, o = movieOpts();
  root.innerHTML = `<section class="movie-intro">
    <div class="movie-intro__card comic-panel">
      <div class="movie-intro__hero">${movieHeroFull(id, ep.theme)}</div>
      <p class="movie-intro__kicker">🎬 ${U.movie} · ${U.episode} ${ep.n}</p>
      <h1 class="movie-intro__title">${mvEsc(ep.title[lang] || ep.title.en)}</h1>
      <p class="movie-intro__lead">${U.lead}</p>
      <div class="movie-intro__opts">
        <label class="movie-toggle"><input type="checkbox" data-opt="slow" ${o.slow ? 'checked' : ''}> 🐢 ${U.slow}</label>
        <label class="movie-toggle"><input type="checkbox" data-opt="cc" ${o.cc === false ? '' : 'checked'}> 💬 ${U.captions}</label>
        <label class="movie-toggle"><input type="checkbox" data-opt="music" ${o.music === false ? '' : 'checked'}> 🎵 ${U.music}</label>
      </div>
      <button type="button" class="btn btn-primary movie-bigbtn movie-intro__start" data-start>${U.start}</button>
    </div></section>`;
  root.querySelectorAll('[data-opt]').forEach(cb => cb.addEventListener('change', () => { const n = movieOpts(); n[cb.dataset.opt] = cb.checked; saveMovieOpts(n); }));
  root.querySelector('[data-start]').addEventListener('click', () => { MovieSfx.unlock(); new MoviePlayer(root, id).start(); });
}

// Facial expressions: smile (-1..1), brow raise, brow inner-tilt, top lid, open mouth, happy eyes
const MV_MOODS = {
  smile: { smile: 0.55, raise: 1, tilt: 2, lid: 0.12 },
  grin: { smile: 1, raise: 4, tilt: 3, lid: 0.05, open: 0.25 },
  laugh: { smile: 1, raise: 5, tilt: 4, lid: 0, open: 0.55, happy: true },
  worried: { smile: -0.55, raise: 2, tilt: 9, lid: 0.12 },
  sad: { smile: -0.8, raise: 0, tilt: 11, lid: 0.38 },
  surprised: { smile: 0, raise: 9, tilt: 0, lid: 0, open: 0.4, pupil: 0.8 },
  thinking: { smile: 0.15, raise: 2, tilt: 1, lid: 0.3, asym: true },
  dizzy: { smile: -0.3, raise: 2, tilt: 6, lid: 0.45, wobble: true },
  proud: { smile: 0.9, raise: 2, tilt: 1, lid: 0.3 },
  neutral: { smile: 0.15, raise: 0, tilt: 0, lid: 0.15 },
};
// Arm poses: [shoulder, elbow] in degrees (negative = forward/up for a right-facing character)
function mvArm(name, t, amp){
  switch (name) {
    case 'wave': return [-152 + Math.sin(t * 9) * 16, -38 + Math.sin(t * 9 + 1) * 26];
    case 'hi': return [-162, -8];
    case 'reach': return [-78, -6];
    case 'offer': return [-52, -38];
    case 'point': return [-92, -2];
    case 'stop': return [-74, -100];
    case 'cheer': return [-166, -14 + Math.sin(t * 7) * 8];
    case 'tell': return [-32 - amp * 22, -68 - Math.sin(t * 5) * 18];
    case 'think': return [-38, -142];
    case 'hips': return [32, -84];
    case 'hug': return [-72, -48];
    case 'shrug': return [-22, -104];
    case 'hold': return [-24, -72];
    case 'book': return [-48, -62];
    default: return [6, -8];
  }
}

/* ======================================================================== */
class MoviePlayer {
  constructor(root, id){
    this.root = root; this.id = id; this.ep = MOVIE_EPISODES[id];
    this.lang = getLang(); this.U = MOVIE_UI[this.lang] || MOVIE_UI.en;
    const o = movieOpts(); this.slow = !!o.slow; this.cc = o.cc !== false; this.musicOn = o.music !== false;
    this.paused = false; this.waiters = []; this.timers = []; this.tweens = []; this.emotes = [];
    this.stars = 0; this.asks = 0; this.askDone = 0; this.rescueN = 0; this.lastLine = null;
    this.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.speaker = null; this.level = 0;
  }

  // ------------------------------------------------------------ setup
  start(){
    const ep = this.ep, U = this.U;
    this.set = MOVIE_SETS[ep.set]();
    this.asks = this.countAsks(ep.steps);
    const L = this.set.layers, layer = (k, inner) => `<g data-layer="${k}">${inner || ''}</g>`;
    this.root.innerHTML = `<section class="movie" data-movie>
      <div class="movie__stage" data-stage role="img" aria-label="${mvEsc(ep.title[this.lang] || ep.title.en)}">
        <svg class="movie__svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          ${layer('sky', L.sky)}${layer('far', L.far)}${layer('hills', L.hills)}${layer('world', L.world)}
          ${layer('actorsBack')}${layer('props', L.props)}${layer('actors')}${layer('fx')}${layer('fore', L.fore)}
        </svg>
        <div class="movie__bubbles" data-bubbles></div>
        <div class="movie__banner" data-banner hidden></div>
        <div class="movie__words" data-words hidden></div>
        <div class="movie__rewind" data-rewind hidden><span>⏪ ${U.rewind}</span></div>
        <div class="movie__wipe" data-wipe hidden></div>
        <div class="movie__overlay" data-overlay hidden></div>
      </div>
      <div class="movie__captionbar"><div class="movie__caption" data-caption aria-live="polite" hidden><span class="movie__who" data-who></span><span class="movie__text" data-text></span></div></div>
      <div class="movie__controls">
        <button type="button" class="movie-btn" data-pause aria-pressed="false">⏸ <span>${U.pause}</span></button>
        <button type="button" class="movie-btn" data-repeat>🔁 <span>${U.repeat}</span></button>
        <button type="button" class="movie-btn" data-slow aria-pressed="${this.slow}">🐢 <span>${U.slow}</span></button>
        <button type="button" class="movie-btn" data-cc aria-pressed="${this.cc}">💬 <span>${U.captions}</span></button>
        <button type="button" class="movie-btn" data-music aria-pressed="${this.musicOn}">🎵 <span>${U.music}</span></button>
        <span class="movie__dots" data-dots>${Array.from({ length: this.asks }, () => '<i></i>').join('')}</span>
      </div>
      <div class="movie__ask" data-ask hidden></div>
    </section>`;
    const $ = s => this.root.querySelector(s);
    this.svg = $('.movie__svg'); this.stage = $('[data-stage]');
    this.layers = {}; this.svg.querySelectorAll('[data-layer]').forEach(g => (this.layers[g.dataset.layer] = g));
    this.el = { bubbles: $('[data-bubbles]'), banner: $('[data-banner]'), words: $('[data-words]'), caption: $('[data-caption]'), who: $('[data-who]'), text: $('[data-text]'), rewind: $('[data-rewind]'), wipe: $('[data-wipe]'), overlay: $('[data-overlay]'), ask: $('[data-ask]'), dots: $('[data-dots]') };
    $('[data-pause]').addEventListener('click', () => this.togglePause());
    $('[data-repeat]').addEventListener('click', () => this.repeatLine());
    $('[data-slow]').addEventListener('click', e => { this.slow = !this.slow; e.currentTarget.setAttribute('aria-pressed', this.slow); saveMovieOpts(Object.assign(movieOpts(), { slow: this.slow })); });
    $('[data-cc]').addEventListener('click', e => { this.cc = !this.cc; e.currentTarget.setAttribute('aria-pressed', this.cc); this.el.caption.hidden = !this.cc || !this.captionOn; saveMovieOpts(Object.assign(movieOpts(), { cc: this.cc })); });
    $('[data-music]').addEventListener('click', e => { this.musicOn = !this.musicOn; e.currentTarget.setAttribute('aria-pressed', this.musicOn); MovieSfx.music.set(this.musicOn); saveMovieOpts(Object.assign(movieOpts(), { music: this.musicOn })); });
    this.keyHandler = e => { if (e.code === 'Space' && !/INPUT|BUTTON|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); this.togglePause(); } };
    document.addEventListener('keydown', this.keyHandler);
    this.actors = {};
    for (const [k, c] of Object.entries(this.ep.cast)) this.addActor(k, c);
    this.addHero();
    this.cam = { x: ep.cam.x, y: null, zoom: ep.cam.zoom }; this.follow = null;
    this.audio = new Audio(); this.loadManifest(); this.setupAnalyser();
    const calm = document.documentElement.getAttribute('data-calm-mode') === 'on';
    if (this.musicOn && !calm) { MovieSfx.music.start(); }
    this.t = 0; this.last = performance.now();
    this.raf = requestAnimationFrame(now => this.frame(now));
    this.run(this.ep.steps).catch(err => { if (err !== 'stopped') console.error(err); });
  }
  countAsks(steps){ let n = 0; for (const s of steps) { if (s.ask) n++; if (s.par) n += this.countAsks(s.par); } return n; }
  setupAnalyser(){
    try {
      const c = MovieSfx.ctx(); if (!c) return;
      const src = c.createMediaElementSource(this.audio), an = c.createAnalyser();
      an.fftSize = 1024; src.connect(an); an.connect(c.destination);
      this.analyser = an; this.anBuf = new Float32Array(an.fftSize);
    } catch (e) { this.analyser = null; }
  }
  voiceLevel(){
    if (!this.analyser || !this.audioPlaying) return null;
    this.analyser.getFloatTimeDomainData(this.anBuf);
    let s = 0; for (let i = 0; i < this.anBuf.length; i += 2) s += this.anBuf[i] * this.anBuf[i];
    return mvClamp((Math.sqrt(s / (this.anBuf.length / 2)) - 0.012) * 7, 0, 1);
  }

  addActor(k, c){
    const rig = MOVIE_CAST[k]();
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = rig.svg; this.layers.actors.appendChild(g);
    const q = s => g.querySelector(s), qa = s => Array.from(g.querySelectorAll(s));
    const earPart = (k2) => { const b = q('.mc-ear' + k2 + ' .mc-ear-base'); return b ? { base: b, tip: b.querySelector('.mc-ear-tip'), px: +b.dataset.px, py: +b.dataset.py, a: 0, v: 0, ta: 0, tv: 0 } : null; };
    const tb = q('.mc-tail-base');
    const a = {
      id: k, rig, el: g, x: c.x, y: c.y, face: c.face || 1, scale: c.scale || 1,
      parts: { body: q('.mc-body'), hipF: q('.mc-hipF'), kneeF: q('.mc-kneeF'), hipB: q('.mc-hipB'), kneeB: q('.mc-kneeB'),
        shF: q('.mc-shF'), elF: q('.mc-elF'), shB: q('.mc-shB'), elB: q('.mc-elB'), head: q('.mc-head'), face: q('.mc-face'), eyesG: q('.mc-eyes'),
        eyes: qa('.mc-eye').map(e => ({ el: e, pupil: e.querySelector('.mc-pupil'), lid: e.querySelector('.mc-lid'), line: e.querySelector('.mc-lidline') })),
        happy: qa('.mc-happy'), brows: qa('.mc-brow'), mouth: q('.mc-mouth'), candy: q('.mc-prop-candy'), acorn: q('.mc-prop-acorn'), flip: qa('.mc-flipfix'),
        earF: earPart('F'), earB: earPart('B'), tail: tb ? { base: tb, tip: tb.querySelector('.mc-tail-tip'), px: +tb.dataset.px, py: +tb.dataset.py, a: 0, v: 0, ta: 0, tv: 0 } : null },
      phase: 0, walkAmt: 0, walk: null, speed: 0, arm: c.arm || 'down', armB: c.armB || 'down', sh: [6, -8], shB: [6, -8],
      mood: c.mood || 'smile', ears: 'norm', lean: 0, leanA: 0, hold: c.hold || null, talking: false, mouthOpen: 0,
      look: c.look || null, turn: 0.35, turnT: 0.35, pupil: [0, 0], blinkAt: 1 + Math.random() * 3, blink: 0,
      hop: null, sx: 1, sy: 1, vyPrev: 0, yOff: 0, yOffPrev: 0, seed: Math.random() * 10, tilt: 0, lidA: 0.12, smileA: 0.55, raiseA: 0, tiltA: 0, layer: 'actors',
    };
    this.actors[k] = a;
  }
  addHero(){
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = `<g class="mv-hero-inner">${mcHeroSvg(this.id, this.ep.theme)}</g>`;
    g.style.display = 'none'; this.layers.actors.appendChild(g);
    this.hero = { el: g, x: 0, y: 0, rot: 0, visible: false, hover: false, scale: 1.55, height: 180 * 1.55, sq: 1 };
  }

  // ------------------------------------------------------------ clock
  get slowF(){ return this.slow ? 1.35 : 1; }
  frame(now){
    if (this.dead) return;
    let dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (this.paused) dt = 0;
    this.t += dt;
    for (const w of this.timers.slice()) { w.left -= dt; if (w.left <= 0) { this.timers.splice(this.timers.indexOf(w), 1); w.res(); } }
    for (const tw of this.tweens.slice()) { tw.e += dt; const p = Math.min(1, tw.e / tw.d); tw.fn(p); if (p >= 1) { this.tweens.splice(this.tweens.indexOf(tw), 1); tw.res(); } }
    const lv = this.voiceLevel();
    this.level = lv != null ? lv : (this.speaker ? (0.35 + 0.35 * Math.sin(this.t * 17) * Math.sin(this.t * 5.3)) : 0);
    for (const a of Object.values(this.actors)) this.updateActor(a, dt);
    this.updateHero(dt);
    this.updateCamera(dt);
    this.updateEmotes(dt);
    this.positionBubbles();
    this.raf = requestAnimationFrame(n => this.frame(n));
  }
  wait(s){ return new Promise(res => this.timers.push({ left: s, res })); }
  tween(d, fn){ return new Promise(res => { if (d <= 0) { fn(1); res(); } else this.tweens.push({ d, e: 0, fn, res }); }); }
  gate(){ return this.paused ? new Promise(res => this.waiters.push(res)) : Promise.resolve(); }
  togglePause(){
    this.paused = !this.paused;
    const b = this.root.querySelector('[data-pause]');
    b.setAttribute('aria-pressed', this.paused); b.innerHTML = this.paused ? `▶ <span>${this.U.play}</span>` : `⏸ <span>${this.U.pause}</span>`;
    this.stage.classList.toggle('is-paused', this.paused);
    if (this.paused) { if (!this.audio.paused) this.audio.pause(); if (window.speechSynthesis) speechSynthesis.pause(); MovieSfx.music.set(false); }
    else { if (this.audio.src && this.audioPlaying) this.audio.play().catch(() => {}); if (window.speechSynthesis) speechSynthesis.resume(); MovieSfx.music.set(this.musicOn); this.waiters.splice(0).forEach(r => r()); }
  }
  stop(){ this.dead = true; cancelAnimationFrame(this.raf); this.audio.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); MovieSfx.music.stop(); document.removeEventListener('keydown', this.keyHandler); }

  // ------------------------------------------------------------ acting
  headWorld(a){ const r = a.rig; return [a.x + a.face * (r.fc[0]) * a.scale, a.y + (r.P.head[1]) * a.scale]; }
  updateActor(a, dt){
    const t = this.t, P = a.parts, R = a.rig, pv = R.P, k = Math.min(1, dt * 9);
    // walking / running
    if (a.walk) {
      const w = a.walk, dir = Math.sign(w.target - a.x), step = w.speed * dt / this.slowF, dist = Math.abs(w.target - a.x);
      a.speed = w.speed;
      if (dist <= step || dir === 0) { a.x = w.target; a.y = w.y1; a.walk = null; w.res(); }
      else {
        a.x += dir * step; a.phase += step / (R.legLen * (a.speed > 230 ? 3.4 : 2.6)) * (w.back ? -1 : 1);
        const p = 1 - Math.abs(w.target - a.x) / Math.max(1, Math.abs(w.target - w.x0)); a.y = w.y0 + (w.y1 - w.y0) * p;
        if (!w.back) a.face = dir;
      }
    }
    a.walkAmt += ((a.walk ? 1 : 0) - a.walkAmt) * Math.min(1, dt * 8);
    const run = a.speed > 230 ? 1 : 0, w = a.walkAmt, ph = a.phase * Math.PI * 2, s1 = Math.sin(ph);
    // hop: anticipation squash -> stretch in the air -> landing squash
    let yOff = 0, sx = 1, sy = 1;
    if (a.hop) {
      const h = a.hop; h.t += dt / (0.62 * (h.big ? 1.2 : 1));
      const p = h.t;
      if (p < 0.18) { const q = p / 0.18; sy = 1 - 0.14 * Math.sin(Math.PI * q * 0.5); }
      else if (p < 0.8) { const q = (p - 0.18) / 0.62; yOff = -Math.sin(Math.PI * q) * R.height * (h.big ? 0.22 : 0.15); sy = 1 + 0.1 * Math.cos(Math.PI * q) * (q < 0.5 ? 1 : 0.3); }
      else if (p < 1) { const q = (p - 0.8) / 0.2; sy = 1 - 0.16 * Math.sin(Math.PI * q); if (!h.landed) { h.landed = true; this.dust(a.x, a.y, R.height > 350); } }
      if (p >= 1) { h.n--; h.t = 0; h.landed = false; if (h.n <= 0) { a.hop = null; h.res && h.res(); } }
      sx = 1 + (1 - sy) * 0.9;
    }
    sy *= 1 + Math.sin(t * 2.2 + a.seed) * 0.007 - Math.abs(Math.cos(ph)) * 0.025 * w;
    a.sx += (sx - a.sx) * Math.min(1, dt * 20); a.sy += (sy - a.sy) * Math.min(1, dt * 20);
    // body vertical motion for the ear/tail springs
    const bodyY = yOff - Math.abs(Math.cos(ph)) * R.height * 0.022 * w, vy = (bodyY - a.yOffPrev) / Math.max(dt, 0.001); const ay = (vy - a.vyPrev); a.vyPrev = vy; a.yOffPrev = bodyY;
    // lean: walking/running forward + scripted lean
    a.leanA += (a.lean + (run ? 7 : 2) * w - a.leanA) * Math.min(1, dt * 5);
    const rot = (el, ang, p) => el && el.setAttribute('transform', `rotate(${ang.toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)})`);
    // legs
    const amp = run ? 40 : 26;
    rot(P.hipF, -s1 * amp * w, pv.hipF); rot(P.hipB, s1 * amp * w, pv.hipB);
    rot(P.kneeF, (0.5 + 0.5 * Math.sin(ph + 1.3)) * (run ? 62 : 34) * w, pv.kneeF); rot(P.kneeB, (0.5 + 0.5 * Math.sin(ph + 1.3 + Math.PI)) * (run ? 62 : 34) * w, pv.kneeB);
    // arms: pose + walk swing (+ auto gestures while talking)
    const talkAmp = a.talking ? this.level : 0;
    let armF = a.arm, armB = a.armB;
    if (a.talking && armF === 'down' && !a.walk && !a.hold) armF = (Math.floor((t + a.seed) / 2.4) % 3 === 1) ? 'tell' : 'down';
    const tF = mvArm(armF, t, talkAmp), tB = mvArm(armB, t, talkAmp);
    const swing = (run ? 34 : 20) * w;
    a.sh[0] += (tF[0] - s1 * swing * (armF === 'down' ? 1 : 0.2) - a.sh[0]) * k; a.sh[1] += (tF[1] - (run ? 70 : 18) * w - a.sh[1]) * k;
    a.shB[0] += (tB[0] + s1 * swing * (armB === 'down' ? 1 : 0.2) - a.shB[0]) * k; a.shB[1] += (tB[1] - (run ? 70 : 18) * w - a.shB[1]) * k;
    rot(P.shF, a.sh[0], pv.shF); rot(P.elF, a.sh[1], pv.elF); rot(P.shB, a.shB[0], pv.shB); rot(P.elB, a.shB[1], pv.elB);
    // body: squash/stretch about the feet, lean, bob
    P.body.setAttribute('transform', `translate(0 ${bodyY.toFixed(1)}) rotate(${a.leanA.toFixed(1)} 0 ${pv.hipF[1]}) scale(${a.sx.toFixed(3)} ${a.sy.toFixed(3)})`);
    // where to look: target actor / camera / ahead
    let lx = 1, ly = 0, turnT = 0.4;
    const tgt = a.look === 'camera' ? 'camera' : (a.look || (this.speaker && this.speaker !== a.id ? this.speaker : null));
    if (tgt === 'camera') { lx = 0; ly = 0.05; turnT = 0; }
    else if (tgt && (this.actors[tgt] || tgt === 'hero')) {
      const [hx, hy] = tgt === 'hero' ? [this.hero.x, this.hero.y - this.hero.height * 0.7] : this.headWorld(this.actors[tgt]);
      const [mx, my] = this.headWorld(a);
      const dx = (hx - mx) * a.face, dy = hy - my, d = Math.hypot(dx, dy) || 1;
      lx = dx / d; ly = dy / d; turnT = 0.15 + Math.max(0, lx) * 0.5;
      if (lx < -0.2 && !a.walk && !a.lockFace) { a.face = -a.face; lx = -lx; }
    } else if (a.walk) { lx = 1; ly = 0.05; turnT = 0.55; }
    const mood = MV_MOODS[a.mood] || MV_MOODS.smile;
    if (mood.asym) { ly = -0.6; lx = 0.4; }
    // saccades: little glances while idle
    const sac = Math.floor((t + a.seed * 3) / 1.7), sj = Math.sin(sac * 12.9898 + a.seed) * 43758.5453 % 1;
    a.pupil[0] += (lx * 0.95 + (tgt ? 0 : sj * 0.25) - a.pupil[0]) * Math.min(1, dt * 14); a.pupil[1] += (ly * 0.8 - a.pupil[1]) * Math.min(1, dt * 14);
    a.turn += (turnT - a.turn) * Math.min(1, dt * 5);
    // head: tilt + talking nods + idle drift
    const nod = a.talking ? Math.sin(t * 7.5) * 3 * (0.4 + talkAmp) : 0;
    const tiltT = (mood.asym ? 8 : 0) + (a.mood === 'sad' ? 6 : 0) + (mood.wobble ? Math.sin(t * 5) * 8 : 0) + Math.sin(t * 0.7 + a.seed) * 1.5 + nod - ly * 6;
    a.tilt += (tiltT - a.tilt) * Math.min(1, dt * 7);
    rot(P.head, a.tilt, pv.neck);
    const td = a.turn * R.turnDx;
    if (P.face) P.face.setAttribute('transform', `translate(${td.toFixed(1)} 0)`);
    if (P.eyesG) { const cx = R.fc[0], sc = 1 - Math.abs(a.turn) * 0.16; P.eyesG.setAttribute('transform', `translate(${cx} 0) scale(${sc.toFixed(3)} 1) translate(${-cx} 0)`); }
    // blink + lids
    a.blinkAt -= dt;
    if (a.blinkAt <= 0) { a.blink = 1; a.blinkAt = 2.2 + Math.random() * 3.2; }
    a.blink = Math.max(0, a.blink - dt * 7);
    a.lidA += ((mood.lid || 0) - a.lidA) * Math.min(1, dt * 8);
    const lid = Math.max(a.lidA, a.blink > 0 ? Math.sin(Math.PI * (1 - a.blink)) * 1 : 0, mood.happy ? 1 : 0);
    const E = R.eye, eyCx = (i) => R.fc[0] + (i ? 1 : -1) * E.gap, eyCy = R.fc[1] + E.dy;
    P.eyes.forEach((e, i) => {
      const ps = mood.pupil || 1;
      e.pupil.setAttribute('transform', `translate(${(a.pupil[0] * E.rx * 0.38).toFixed(1)} ${(a.pupil[1] * E.ry * 0.32).toFixed(1)}) ${ps !== 1 ? `translate(${eyCx(i)} ${eyCy}) scale(${ps}) translate(${-eyCx(i)} ${-eyCy})` : ''}`);
      const h = lid * (E.ry * 2 + 4);
      e.lid.setAttribute('height', h.toFixed(1));
      if (lid > 0.04 && lid < 0.97) { const yl = eyCy - E.ry - 2 + h, f = Math.sqrt(Math.max(0, 1 - Math.pow((yl - eyCy) / E.ry, 2))); e.line.setAttribute('d', `M${(eyCx(i) - E.rx * f).toFixed(1)} ${yl.toFixed(1)} L${(eyCx(i) + E.rx * f).toFixed(1)} ${yl.toFixed(1)}`); }
      else e.line.setAttribute('d', lid >= 0.97 && !mood.happy ? `M${eyCx(i) - E.rx} ${eyCy} q${E.rx} ${E.ry * 0.5} ${E.rx * 2} 0` : '');
      e.el.style.display = mood.happy ? 'none' : '';
    });
    P.happy.forEach(h => (h.style.display = mood.happy ? '' : 'none'));
    // brows
    a.raiseA += ((mood.raise || 0) - a.raiseA) * Math.min(1, dt * 8); a.tiltA += ((mood.tilt || 0) - a.tiltA) * Math.min(1, dt * 8);
    P.brows.forEach((b, i) => {
      const cx = eyCx(i), base = eyCy - R.brow.h - a.raiseA - (mood.asym && i === 1 ? 5 : 0), bw = R.brow.w;
      const inner = i ? -1 : 1; // inner end points toward the face center
      const yIn = base - a.tiltA, yOut = base + a.tiltA * 0.35;
      const x1 = cx - bw * inner, x2 = cx + bw * inner;
      b.setAttribute('d', `M${x1.toFixed(1)} ${yOut.toFixed(1)} Q${cx.toFixed(1)} ${(Math.min(yIn, yOut) - 4).toFixed(1)} ${x2.toFixed(1)} ${yIn.toFixed(1)}`);
    });
    // mouth: mood + lip sync
    a.smileA += ((mood.smile || 0) - a.smileA) * Math.min(1, dt * 6);
    const openT = a.talking ? mvClamp(this.level * 0.95 + 0.05, 0, 1) : (mood.open || 0) * (mood.happy ? 0.8 + Math.sin(t * 14) * 0.2 : 1);
    a.mouthOpen += (openT - a.mouthOpen) * Math.min(1, dt * 22);
    const M = R.mouth, wob = mood.wobble ? Math.sin(t * 9) * 0.25 : 0;
    P.mouth.setAttribute('d', mcMouthPath(M.x, M.y, M.w * (1 + a.mouthOpen * 0.1), a.mouthOpen, a.smileA + wob));
    P.mouth.setAttribute('fill', a.mouthOpen < 0.04 ? 'none' : '#7a2a3c');
    // ears + tail on springs
    const earT = { droop: 42, up: -12, norm: 0 }[a.ears] ?? 0;
    for (const [ear, sgn] of [[P.earF, 1], [P.earB, -1]]) {
      if (!ear) continue;
      const target = earT * sgn * 0.8 + 9 * sgn + (a.ears === 'droop' ? 0 : Math.sin(t * 2 + sgn) * 2);
      ear.v += ((target - ear.a) * 70 - ear.v * 9 + ay * 0.9 * sgn) * dt; ear.a += ear.v * dt;
      const tipT = (ear.a - target) * 0.8 + (a.ears === 'droop' ? 30 * sgn : 0) - a.tilt * 0.4;
      ear.tv += ((tipT - ear.ta) * 55 - ear.tv * 7 + ay * 1.4 * sgn) * dt; ear.ta += ear.tv * dt;
      ear.base.setAttribute('transform', `translate(${(-td * 0.35).toFixed(1)} 0) rotate(${(ear.a).toFixed(1)} ${ear.px} ${ear.py})`);
      if (ear.tip) ear.tip.setAttribute('transform', `rotate(${(ear.ta * 1.2).toFixed(1)} ${ear.tip.dataset.px} ${ear.tip.dataset.py})`);
    }
    if (P.tail) {
      const tl = P.tail, puff = a.tailPuff || 0, target = Math.sin(t * 2.4) * 6 - w * 10;
      tl.v += ((target - tl.a) * 50 - tl.v * 6 + ay * 0.8) * dt; tl.a += tl.v * dt;
      tl.tv += (((tl.a - target) * 1.2 - tl.ta) * 40 - tl.tv * 5 + ay * 1.3) * dt; tl.ta += tl.tv * dt;
      tl.base.setAttribute('transform', `rotate(${tl.a.toFixed(1)} ${tl.px} ${tl.py}) translate(${tl.px} ${tl.py}) scale(${1 + puff * 0.3}) translate(${-tl.px} ${-tl.py})`);
      if (tl.tip) tl.tip.setAttribute('transform', `rotate(${tl.ta.toFixed(1)} ${tl.tip.dataset.px} ${tl.tip.dataset.py})`);
      a.tailPuff = Math.max(0, puff - dt * 0.7);
    }
    if (P.candy) P.candy.style.display = a.hold === 'candy' ? '' : 'none';
    if (P.acorn) P.acorn.style.display = a.hold === 'acorn' ? '' : 'none';
    P.flip.forEach(f => f.setAttribute('transform', a.face < 0 ? 'scale(-1 1)' : ''));
    a.el.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) scale(${a.face * a.scale} ${a.scale})`);
  }
  updateHero(){
    const h = this.hero;
    h.el.style.display = h.visible ? '' : 'none';
    if (!h.visible) return;
    const bob = h.hover ? Math.sin(this.t * 3) * 9 : 0;
    h.el.setAttribute('transform', `translate(${h.x.toFixed(1)} ${(h.y + bob).toFixed(1)}) rotate(${h.rot.toFixed(1)}) scale(${(h.scale * (2 - h.sq)).toFixed(3)} ${(h.scale * h.sq).toFixed(3)})`);
  }
  updateCamera(dt){
    const c = this.cam, W = this.set.width;
    if (this.follow) { const a = this.actors[this.follow]; c.x += (a.x + a.face * 120 - c.x) * Math.min(1, dt * 2.5); }
    const half = 800 / c.zoom; c.x = Math.max(half - 60, Math.min(W - half + 60, c.x));
    // a tiny "handheld" drift keeps still shots alive
    const dx = this.reduced ? 0 : Math.sin(this.t * 0.31) * 6, dy = this.reduced ? 0 : Math.sin(this.t * 0.23) * 3;
    const cy = (c.y != null ? c.y : 900 - 450 / c.zoom) + dy;
    for (const [k, g] of Object.entries(this.layers)) {
      const p = k in this.set.parallax ? this.set.parallax[k] : 1;
      const zl = 1 + (c.zoom - 1) * p, cyl = 450 + (cy - 450) * p;
      g.setAttribute('transform', `translate(800 450) scale(${zl.toFixed(4)}) translate(${(-(c.x + dx) * p).toFixed(1)} ${(-cyl).toFixed(1)})`);
    }
    this.camCY = cy; this.camDX = dx;
  }
  toScreen(x, y){ const c = this.cam; return [800 + (x - c.x - (this.camDX || 0)) * c.zoom, 450 + (y - this.camCY) * c.zoom]; }

  // ------------------------------------------------------------ script
  async run(steps){ for (const s of steps) { if (this.dead) throw 'stopped'; await this.gate(); await this.step(s); } }
  step(s){
    if (s.par) return Promise.all(s.par.map(x => this.step(x)));
    if (s.seq) return this.run(s.seq);
    if (s.say) return this.say(s);
    if (s.ask) return this.ask(s.ask);
    if (s.end) return this.ending();
    const a = s.a && this.actors[s.a];
    switch (s.do) {
      case 'walk': return (s.delay ? this.wait(s.delay) : Promise.resolve()).then(() => new Promise(res => {
        a.walk = { x0: a.x, target: s.x, speed: s.speed || 150, y0: a.y, y1: s.y != null ? s.y : a.y, back: !!s.back, res };
        if (!s.back && s.x !== a.x) a.face = Math.sign(s.x - a.x);
      }));
      case 'face': a.face = s.dir; return Promise.resolve();
      case 'look': a.look = s.at || null; return Promise.resolve();
      case 'pose':
        if (s.arm) a.arm = s.arm; if (s.armB) a.armB = s.armB; if (s.mood) a.mood = s.mood; if (s.ears) a.ears = s.ears;
        if ('lean' in s) a.lean = s.lean; if ('hold' in s) a.hold = s.hold; if ('lock' in s) a.lockFace = s.lock;
        if (s.hop) return new Promise(res => { a.hop = { n: s.hop, t: 0, big: !!s.big, res }; if (s.sfx !== false) MovieSfx.boing(); });
        return Promise.resolve();
      case 'cam': return this.camMove(s);
      case 'wait': return this.wait(s.s * this.slowF);
      case 'sfx': if (MovieSfx[s.s]) MovieSfx[s.s](); return Promise.resolve();
      case 'music': MovieSfx.music.mood(s.mood); return Promise.resolve();
      case 'spark': return this.spark(a, s.at);
      case 'emote': this.emote(a || (s.a === 'hero' ? 'hero' : null), s.e, s.dur); return this.wait(0.35);
      case 'hero': return this.heroMove(s.mode, s.x);
      case 'gag': return this.gag(s.name, a, s);
      case 'layer': (s.layer === 'back' ? this.layers.actorsBack : this.layers.actors).appendChild(a.el); a.layer = s.layer === 'back' ? 'actorsBack' : 'actors'; return Promise.resolve();
      case 'title': return this.titleCard();
      case 'wipe': return this.wipe(s.color);
    }
    return Promise.resolve();
  }
  camMove(s){
    if (s.follow) { this.follow = s.follow; return Promise.resolve(); }
    this.follow = null;
    const from = { ...this.cam }, to = { x: s.x != null ? s.x : from.x, y: s.y != null ? s.y : null, zoom: s.zoom || from.zoom };
    const fy = from.y != null ? from.y : 900 - 450 / from.zoom, ty = to.y != null ? to.y : 900 - 450 / to.zoom;
    const d = this.reduced || s.cut ? 0 : (s.dur || 0) * this.slowF;
    const ease = p => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    return this.tween(d, p => { const e = ease(p); this.cam.x = from.x + (to.x - from.x) * e; this.cam.zoom = from.zoom + (to.zoom - from.zoom) * e; this.cam.y = fy + (ty - fy) * e; if (p >= 1) this.cam.y = to.y; });
  }

  // ------------------------------------------------------------ voice + captions
  loadManifest(){
    this.manifest = new Set();
    fetch(`audio/movie/${this.lang}/index.json`).then(r => r.ok ? r.json() : []).then(l => (this.manifest = new Set(l))).catch(() => {});
  }
  whoName(who){
    if (who === 'narrator') return '';
    if (who === 'hero') return movieHeroName(this.id, this.lang);
    const names = (this.ep.names && this.ep.names[this.lang]) || {};
    if (names[who]) return names[who];
    return this.actors[who] ? this.actors[who].rig.name : who;
  }
  async say(s){
    const who = s.say, text = s[this.lang] || s.en, a = this.actors[who];
    if (a && s.mood) a.mood = s.mood;
    if (a && s.ears) a.ears = s.ears;
    if (a && s.arm) a.arm = s.arm;
    const prevLook = a ? a.look : null;
    if (a && s.look) a.look = s.look;
    if (a && s.to) a.look = s.to;
    if (s.emote) this.emote(a || (who === 'hero' ? 'hero' : null), s.emote);
    let camBack = null;
    if (s.shot && a) { camBack = { ...this.cam }; this.shot(s.shot, a, s.to); }
    this.lastLine = { who, text };
    this.showCaption(who, text);
    if (who !== 'narrator' && !s.noBubble) this.showBubble(who, text);
    this.speaker = who === 'narrator' ? null : who;
    if (a) a.talking = true;
    MovieSfx.music.duck(true);
    await this.voice(who, text);
    MovieSfx.music.duck(false);
    if (a) a.talking = false;
    this.speaker = null;
    await this.wait(this.slow ? 1.4 : 0.55);
    if (a && (s.look || s.to)) a.look = prevLook;
    this.hideBubble();
    if (camBack && s.shotBack !== false) { this.cam = camBack; }
  }
  shot(kind, a, other){
    const R = a.rig, top = a.y - R.height * a.scale;
    if (kind === 'close') { this.cam = { x: a.x + a.face * 40, y: top + R.height * 0.42 * a.scale, zoom: mvClamp(900 / (R.height * a.scale * 1.45), 1.2, 2.2) }; return; }
    if (kind === 'two' && other && this.actors[other]) {
      const b = this.actors[other], x0 = Math.min(a.x, b.x) - 160, x1 = Math.max(a.x, b.x) + 160, hmax = Math.max(R.height * a.scale, b.rig.height * b.scale);
      const all = Object.values(this.actors).filter(o => Math.abs(o.x - (x0 + x1) / 2) < 500), hall = Math.max(hmax, ...all.map(o => o.rig.height * o.scale));
      const z = mvClamp(Math.min(1600 / (x1 - x0), 900 / (hall * 1.6)), 1.0, 1.75);
      this.cam = { x: (x0 + x1) / 2, y: null, zoom: z };
    }
  }
  showCaption(who, text){
    this.captionOn = true;
    this.el.who.textContent = this.whoName(who); this.el.who.hidden = who === 'narrator';
    this.el.text.textContent = text; this.el.caption.dataset.who = who;
    this.el.caption.hidden = !this.cc;
  }
  showBubble(who, text){ this.el.bubbles.innerHTML = `<div class="movie-bubble movie-bubble--${who}">${mvEsc(text)}</div>`; this.bubbleWho = who; this.positionBubbles(); }
  hideBubble(){ this.el.bubbles.innerHTML = ''; this.bubbleWho = null; }
  positionBubbles(){
    const b = this.el.bubbles.firstChild; if (!b || !this.bubbleWho) return;
    let x, y;
    if (this.bubbleWho === 'hero') { x = this.hero.x; y = this.hero.y - this.hero.height - 10; }
    else { const a = this.actors[this.bubbleWho]; if (!a) return; x = a.x; y = a.y - a.rig.height * a.scale - 14; }
    let [sx, sy] = this.toScreen(x, y);
    sx = mvClamp(sx, 230, 1370); sy = mvClamp(sy, 150, 700);
    b.style.left = (sx / 16) + '%'; b.style.top = (sy / 9) + '%';
  }
  voice(who, text){
    return new Promise(resolve => {
      let done = false; const fin = () => { if (!done) { done = true; this.audioPlaying = false; resolve(); } };
      const key = typeof voiceKey === 'function' ? voiceKey(who + ': ' + text) : '';
      const safety = setTimeout(fin, (3000 + text.length * 120) * this.slowF + 4000);
      const tts = () => {
        this.audioPlaying = false;
        if (!window.speechSynthesis) { this.wait(1 + text.length * 0.06).then(fin); return; }
        const u = new SpeechSynthesisUtterance(text.replace(/[“”]/g, ''));
        u.lang = this.lang === 'es' ? 'es-ES' : 'en-US';
        u.rate = this.slow ? 0.78 : 0.9;
        u.pitch = { alex: 1.6, nutty: 1.8, goat: 1.0, dad: 0.85, bear: 0.75, hero: 1.1 }[who] || 1;
        u.onend = () => { clearTimeout(safety); fin(); }; u.onerror = u.onend;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      };
      if (key && this.manifest.has(key)) {
        this.audio.src = `audio/movie/${this.lang}/${key}.mp3`;
        this.audio.playbackRate = this.slow ? 0.9 : 1; this.audio.preservesPitch = true;
        this.audio.onended = () => { clearTimeout(safety); fin(); };
        this.audio.onerror = () => tts();
        this.audioPlaying = true;
        const c = MovieSfx.ctx(); if (c && c.state === 'suspended') c.resume();
        this.audio.play().catch(() => tts());
      } else tts();
    });
  }
  repeatLine(){ if (this.lastLine && !this.repeating) { this.repeating = true; const l = this.lastLine; this.showCaption(l.who, l.text); this.speaker = l.who === 'narrator' ? null : l.who; const a = this.actors[l.who]; if (a) a.talking = true; this.voice(l.who, l.text).then(() => { this.repeating = false; if (a) a.talking = false; this.speaker = null; }); } }

  // ------------------------------------------------------------ effects
  emote(a, type, dur){
    const svg = MC_EMOTE[type]; if (!svg || !a) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = `<g class="mv-emote-pop">${svg}</g>`; this.layers.fx.appendChild(g);
    this.emotes.push({ g, a, life: dur || 1.6, age: 0 });
    if (type === '!') MovieSfx.boop();
  }
  updateEmotes(dt){
    for (const e of this.emotes.slice()) {
      e.age += dt;
      let x, y;
      if (e.a === 'hero') { x = this.hero.x + 70; y = this.hero.y - this.hero.height; }
      else { const R = e.a.rig; x = e.a.x + e.a.face * R.headR * 0.9 * e.a.scale; y = e.a.y + (R.P.head[1] - R.headR * 1.1) * e.a.scale; }
      const fl = Math.sin(e.age * 6) * 3;
      e.g.setAttribute('transform', `translate(${x.toFixed(1)} ${(y - e.age * 12 + fl).toFixed(1)})`);
      e.g.style.opacity = e.age > e.life - 0.3 ? Math.max(0, (e.life - e.age) / 0.3) : 1;
      if (e.age >= e.life) { e.g.remove(); this.emotes.splice(this.emotes.indexOf(e), 1); }
    }
  }
  dust(x, y, heavy){
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x} ${y}) scale(${heavy ? 1.3 : 0.9})`); g.innerHTML = mcDustSvg();
    this.layers.fx.appendChild(g); if (heavy) MovieSfx.thud();
    this.wait(0.7).then(() => g.remove());
  }
  async spark(a, at){
    const s = a.scale, R = a.rig;
    const x = at === 'hand' ? a.x + a.face * R.P.shF[0] * s + a.face * 50 * s : a.x, y = at === 'hand' ? a.y + (R.P.elF[1] - 10) * s : a.y - R.height * s - 40;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x} ${y})`); g.innerHTML = `<g class="mv-spark-pop">${mcSparkSvg()}</g>`;
    this.layers.fx.appendChild(g); MovieSfx.notice();
    this.wait(2.6).then(() => g.remove());
    return this.wait(0.7);
  }
  async gag(name, a, s){
    if (name === 'tail-puff') { a.tailPuff = 1; a.hop = { n: 1, t: 0 }; this.emote(a, '!'); return this.wait(0.5); }
    if (name === 'acorn-bonk') {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = `<g><ellipse cx="0" cy="0" rx="10" ry="12" fill="#b9773a" stroke="#2b2b2b" stroke-width="3"/><path d="M-11 -5 q11 -12 22 0 z" fill="#7a4a22" stroke="#2b2b2b" stroke-width="3"/></g>`;
      this.layers.fx.appendChild(g);
      const hx = a.x + a.face * 8, x0 = hx, y0 = a.y - 320, y1 = a.y + (a.rig.P.head[1] - a.rig.headR * 0.8);
      a.look = null; a.mood = 'surprised';
      await this.tween(0.55, p => g.setAttribute('transform', `translate(${x0} ${y0 + (y1 - y0) * p * p}) rotate(${p * 200})`));
      MovieSfx.bonk(); a.mood = 'dizzy'; a.ears = 'droop'; a.hop = { n: 1, t: 0.7 };
      const stars = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      stars.innerHTML = [0, 1, 2].map(i => `<g transform="rotate(${i * 120})"><path transform="translate(26 0)" d="M0 -9 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#ffd23f" stroke="#2b2b2b" stroke-width="2"/></g>`).join('');
      stars.setAttribute('transform', `translate(${hx} ${y1 - 6})`);
      const spin = document.createElementNS('http://www.w3.org/2000/svg', 'g'); spin.setAttribute('class', 'mv-dizzy'); spin.appendChild(stars.firstChild); while (stars.firstChild) spin.appendChild(stars.firstChild);
      stars.appendChild(spin); this.layers.fx.appendChild(stars);
      this.tween(0.8, p => g.setAttribute('transform', `translate(${x0 + 120 * p} ${y1 - Math.sin(Math.PI * p) * 80 + p * 100}) rotate(${200 + p * 300})`)).then(() => g.remove());
      await this.wait(1.0);
      this.wait(1.8).then(() => { stars.remove(); if (a.mood === 'dizzy') { a.mood = 'smile'; a.ears = 'norm'; } });
      return;
    }
    if (name === 'grab-acorn') { // Nutty snatches the golden acorn and scampers off
      const from = this.actors[s.from]; if (from) from.hold = null;
      a.hold = 'acorn'; MovieSfx.pop(); a.tailPuff = 0.6; return this.wait(0.3);
    }
  }
  async heroMove(mode, x){
    const h = this.hero, alex = this.actors.alex, c = this.cam;
    const fly = (tx, ty, d, then) => { const fx = h.x, fy = h.y; MovieSfx.whoosh(); h.hover = false;
      return this.tween(d, p => { const e = 1 - Math.pow(1 - p, 3); h.x = fx + (tx - fx) * e; h.y = fy + (ty - fy) * e - Math.sin(Math.PI * p) * 60; h.rot = (1 - p) * (tx < fx ? -18 : 18); h.sq = 1 - Math.sin(Math.PI * p) * 0.06; }).then(then); };
    if (mode === 'flyby' || mode === 'rescue') {
      h.visible = true; h.x = c.x + 1000; h.y = 120; const side = alex.x > c.x + 100 ? -1 : 1;
      const res = fly(alex.x + side * 250, alex.y - 160, 1.3, () => { h.hover = true; h.rot = 0; h.sq = 1; });
      this.sparkleTrail(1.3);
      return res;
    }
    if (mode === 'land') {
      h.visible = true; h.x = c.x + 1000; h.y = 80;
      this.sparkleTrail(1.6);
      await fly(x, 805, 1.6, () => { h.rot = 0; }); MovieSfx.pop(); this.dust(x, 805, false);
      await this.tween(0.4, p => { h.sq = 1 - Math.sin(Math.PI * p) * 0.18; h.y = 805; });
      h.sq = 1; return;
    }
    if (mode === 'out') return fly(c.x + 1100, -260, 1.0, () => { h.visible = false; });
  }
  sparkleTrail(d){
    let n = 0; const tick = () => { if (n++ > d * 12 || !this.hero.visible) return;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${this.hero.x - 40} ${this.hero.y - 120})`);
      g.innerHTML = `<g class="mv-trail">${MC_EMOTE.sparkle}</g>`; this.layers.fx.appendChild(g); this.wait(0.8).then(() => g.remove()); this.wait(0.08).then(tick); };
    tick();
  }
  async titleCard(){
    const ep = this.ep, U = this.U, o = this.el.overlay;
    o.innerHTML = `<div class="movie-titlecard"><div class="movie-titlecard__hero">${movieHeroFull(this.id, ep.theme)}</div>
      <p class="movie-titlecard__kicker">${U.movie} · ${U.episode} ${ep.n}</p><h2 class="movie-titlecard__title">${mvEsc(ep.title[this.lang] || ep.title.en)}</h2></div>
      <button type="button" class="movie-btn movie-titlecard__skip">${U.skip} ⏭</button>`;
    o.hidden = false; MovieSfx.sparkle();
    await Promise.race([this.wait(3.6), new Promise(r => o.querySelector('button').addEventListener('click', r))]);
    o.hidden = true; o.innerHTML = '';
  }
  async wipe(){
    const w = this.el.wipe; w.hidden = false; w.className = 'movie__wipe is-in'; MovieSfx.whoosh();
    await this.wait(0.55); w.className = 'movie__wipe is-out'; await this.wait(0.55); w.hidden = true;
  }
  banner(kind){
    const b = this.el.banner;
    if (!kind) { b.hidden = true; return; }
    b.className = 'movie__banner movie__banner--' + kind;
    b.innerHTML = kind === 'safe' ? `<span class="movie__mark">✓</span> ${this.U.safe}` : `<span class="movie__mark">✗</span> ${this.U.whatNext}`;
    b.hidden = false;
  }

  // ------------------------------------------------------------ questions
  snapshot(){
    const acts = {};
    for (const a of Object.values(this.actors)) acts[a.id] = { x: a.x, y: a.y, face: a.face, arm: a.arm, armB: a.armB, mood: a.mood, ears: a.ears, lean: a.lean, hold: a.hold, layer: a.layer, look: a.look };
    return { acts, cam: { ...this.cam }, follow: this.follow };
  }
  async rewindTo(snap){
    this.el.rewind.hidden = false; this.stage.classList.add('is-rewinding'); MovieSfx.rewind();
    const d = 1.6, from = {};
    for (const a of Object.values(this.actors)) { from[a.id] = { x: a.x, y: a.y }; a.walk = null; }
    const cam0 = { ...this.cam }; this.follow = null;
    await this.tween(d, p => {
      const e = p * p * (3 - 2 * p);
      for (const a of Object.values(this.actors)) {
        const s = snap.acts[a.id], f = from[a.id];
        const nx = f.x + (s.x - f.x) * e; a.phase -= Math.abs(nx - a.x) / (a.rig.legLen * 2.6); a.walkAmt = Math.abs(s.x - f.x) > 5 && p < 1 ? 1 : 0;
        a.x = nx; a.y = f.y + (s.y - f.y) * e;
      }
      this.cam.x = cam0.x + (snap.cam.x - cam0.x) * e; this.cam.zoom = cam0.zoom + (snap.cam.zoom - cam0.zoom) * e;
    });
    for (const a of Object.values(this.actors)) {
      const s = snap.acts[a.id];
      Object.assign(a, { face: s.face, arm: s.arm, armB: s.armB, mood: s.mood, ears: s.ears, lean: s.lean, hold: s.hold, look: s.look, walkAmt: 0, lockFace: false });
      if (a.layer !== s.layer) { this.layers[s.layer].appendChild(a.el); a.layer = s.layer; }
    }
    this.cam = { ...snap.cam }; this.follow = snap.follow;
    this.stage.classList.remove('is-rewinding'); this.el.rewind.hidden = true;
  }
  async heroRescue(tip, snap){
    MovieSfx.music.mood('hero');
    await this.heroMove('rescue');
    const line = this.ep.rescue[this.rescueN++ % this.ep.rescue.length];
    await this.say({ say: 'hero', en: line.en, es: line.es });
    await this.rewindTo(snap);
    const o = this.el.overlay, U = this.U, text = tip[this.lang] || tip.en;
    o.innerHTML = `<div class="movie-tip comic-panel" role="dialog" aria-label="${U.tip}"><div class="movie-tip__head">${movieHeroHead(this.id, this.ep.theme)}</div>
      <p class="movie-tip__kicker">💡 ${U.tip}</p><p class="movie-tip__text">${mvEsc(text)}</p>
      <button type="button" class="btn btn-primary movie-bigbtn" data-again>↺ ${U.tryAgain}</button></div>`;
    o.hidden = false; MovieSfx.sparkle();
    const btn = o.querySelector('[data-again]');
    const clicked = new Promise(r => btn.addEventListener('click', r));
    this.lastLine = { who: 'hero', text }; this.showCaption('hero', text);
    MovieSfx.music.duck(true); this.voice('hero', text).then(() => MovieSfx.music.duck(false));
    btn.focus({ preventScroll: true });
    await clicked;
    this.audio.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); MovieSfx.music.duck(false);
    o.hidden = true; o.innerHTML = '';
    MovieSfx.music.mood('happy');
    await this.heroMove('out');
  }
  async ask(q){
    const crossed = new Set(); let firstTry = true;
    const alex = this.actors.alex;
    while (true) {
      if (alex) { alex.look = 'camera'; alex.mood = 'thinking'; }
      const choice = await this.showChoices(q, crossed);
      if (alex) { alex.look = null; alex.mood = 'smile'; }
      const idx = q.choices.indexOf(choice);
      if (choice.ok) {
        if (firstTry) this.stars++;
        this.markDot(firstTry);
        this.banner('safe'); MovieSfx.safe();
        if (alex) { alex.ears = 'up'; alex.hop = { n: 1, t: 0 }; this.emote(alex, 'sparkle'); }
        await this.run(choice.then || []);
        this.banner(null);
        return;
      }
      firstTry = false; crossed.add(idx);
      const snap = this.snapshot();
      this.banner('next'); MovieSfx.music.mood('tense');
      await this.run(choice.then || []);
      MovieSfx.uhoh();
      await this.wait(0.8);
      this.banner(null);
      await this.heroRescue(choice.tip || { en: '', es: '' }, snap);
    }
  }
  showChoices(q, crossed){
    const U = this.U, box = this.el.ask, qt = q.q[this.lang] || q.q.en;
    box.innerHTML = `<div class="movie-ask comic-panel"><p class="movie-ask__kicker">${U.yourTurn}</p>
      <p class="movie-ask__q"><button type="button" class="movie-ask__listen" data-listen aria-label="${U.listen}">🔊</button> ${mvEsc(qt)}</p>
      <div class="movie-ask__choices">${q.choices.map((c, i) => `
        <button type="button" class="movie-choice${crossed.has(i) ? ' is-crossed' : ''}" data-i="${i}" ${crossed.has(i) ? 'disabled aria-disabled="true"' : ''}>
          <span class="movie-choice__icon" aria-hidden="true">${c.icon || '•'}</span><span class="movie-choice__text">${mvEsc(c[this.lang] || c.en)}</span>${crossed.has(i) ? '<span class="movie-choice__x" aria-hidden="true">✗</span>' : ''}
        </button>`).join('')}</div></div>`;
    box.hidden = false;
    this.stage.classList.add('is-asking');
    this.scrollTo(box, 'bottom');
    const read = () => { this.lastLine = { who: 'narrator', text: qt }; this.showCaption('narrator', qt); MovieSfx.music.duck(true); return this.voice('narrator', qt).then(() => MovieSfx.music.duck(false)); };
    read();
    box.querySelector('[data-listen]').addEventListener('click', read);
    return new Promise(res => box.querySelectorAll('.movie-choice').forEach(b => b.addEventListener('click', () => {
      if (b.disabled) return;
      this.audio.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); MovieSfx.music.duck(false);
      const c = q.choices[+b.dataset.i];
      b.classList.add(c.ok ? 'is-right' : 'is-wrong');
      setTimeout(() => { box.hidden = true; box.innerHTML = ''; this.stage.classList.remove('is-asking'); this.scrollTo(this.stage, 'top'); res(c); }, 450);
    })));
  }
  scrollTo(el, where){
    const hdr = document.querySelector('.site-header'), hh = hdr && /sticky|fixed/.test(getComputedStyle(hdr).position) ? hdr.getBoundingClientRect().height : 0;
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    let y = null;
    if (where === 'top' && (r.top < hh + 8 || r.bottom > vh)) y = window.scrollY + r.top - hh - 8;
    if (where === 'bottom' && r.bottom > vh - 8) y = window.scrollY + r.bottom - vh + 16;
    if (y != null) window.scrollTo({ top: Math.max(0, y), behavior: this.reduced ? 'auto' : 'smooth' });
  }
  markDot(first){ const d = this.el.dots.children[this.askDone++]; if (d) d.className = first ? 'is-star' : 'is-done'; }

  // ------------------------------------------------------------ ending
  async ending(){
    const ep = this.ep, U = this.U;
    MovieSfx.music.mood('hero');
    for (const [i, l] of ep.signoff.entries()) {
      if (i === 0) this.ruleWords(true);
      await this.say({ say: l.who, en: l.en, es: l.es, mood: 'grin', noBubble: i === 0 });
      if (i === 0) this.ruleWords(false);
    }
    if (ep.tag) await this.run(ep.tag);
    this.el.caption.hidden = true; this.captionOn = false;
    saveMovieProgress(this.id, { done: true, stars: Math.max(this.stars, (movieProgress()[this.id] || {}).stars || 0), sticker: true });
    const o = this.el.ask, tip = ep.heroTip[this.lang] || ep.heroTip.en;
    for (const a of Object.values(this.actors)) { if (a.id !== 'goat') { a.arm = 'wave'; a.mood = 'grin'; a.look = 'camera'; } }
    o.innerHTML = `<div class="movie-end comic-panel">
      <div class="movie-end__sticker"><span class="movie-end__badge">${movieHeroFull(this.id, ep.theme)}</span><span class="movie-end__ribbon">${mvEsc(ep.sticker[this.lang] || ep.sticker.en)}</span></div>
      <p class="movie-end__kicker">🎉 ${U.sticker}</p>
      <p class="movie-end__stars" aria-label="${U.stars}">${'⭐'.repeat(this.stars)}${'☆'.repeat(Math.max(0, this.asks - this.stars))}</p>
      <div class="movie-tip movie-tip--inline"><p class="movie-tip__kicker">💡 ${U.tip}</p><p class="movie-tip__text">${mvEsc(tip)}</p></div>
      <div class="movie-end__btns">
        <button type="button" class="btn btn-primary" data-again>↺ ${U.again}</button>
        <a class="btn btn-secondary" href="topic.html?id=${this.id}">${U.back}</a>
        <a class="btn btn-secondary" href="movie.html">🎬 ${U.more}</a>
      </div></div>`;
    o.hidden = false; MovieSfx.sparkle(); this.scrollTo(o, 'bottom');
    o.querySelector('[data-again]').addEventListener('click', () => { this.stop(); new MoviePlayer(this.root, this.id).start(); });
    this.voice('hero', tip);
  }
  ruleWords(on){
    const w = this.el.words;
    if (!on) { setTimeout(() => (w.hidden = true), 600); return; }
    const t = this.lang === 'es' ? ['Di NO.', 'VE con un adulto.', 'CUÉNTALE.'] : ['Say NO.', 'GO to a grown-up.', 'TELL them.'];
    w.innerHTML = t.map((x, i) => `<span style="--i:${i}">${x}</span>`).join(''); w.hidden = false;
  }
}
