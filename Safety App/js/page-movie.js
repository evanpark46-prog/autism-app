/* ==========================================================================
   Safety Superheroes — Hero Movies player (movie.html)
   Plays an interactive 2D cartoon from js/movie-data.js using the cast in
   js/movie-cast.js and the sets in js/movie-sets.js.
     - a scene plays, then pauses on the lesson's question
     - a wrong choice plays out what happens next, then the lesson's hero
       swoops in, rewinds time and leaves a Hero Tip
     - a right choice plays the safe ending and the story moves on
   Slow mode, captions, pause and "repeat line" are always one tap away.
   Voices: pre-recorded clips in audio/movie/<lang>/ (tools/voice/movie.py),
   falling back to the device voice.
   ========================================================================== */

const MOVIE_PROGRESS_KEY = 'safetylib_movies_v1';
function movieProgress(){ try { return JSON.parse(localStorage.getItem(MOVIE_PROGRESS_KEY) || '{}') || {}; } catch (e) { return {}; } }
function saveMovieProgress(id, rec){ try { const p = movieProgress(); p[id] = Object.assign(p[id] || {}, rec); localStorage.setItem(MOVIE_PROGRESS_KEY, JSON.stringify(p)); } catch (e) {} }
function movieOpts(){ try { return JSON.parse(localStorage.getItem('safetylib_movie_opts') || '{}') || {}; } catch (e) { return {}; } }
function saveMovieOpts(o){ try { localStorage.setItem('safetylib_movie_opts', JSON.stringify(o)); } catch (e) {} }
const mvEsc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function initMoviePage(){
  const root = document.querySelector('[data-movie-root]');
  if (!root) return;
  const id = new URLSearchParams(location.search).get('id');
  if (id && MOVIE_EPISODES[id]) movieIntro(root, id);
  else movieShelf(root);
  window.addEventListener('safetylib:langchange', () => location.reload());
}

function movieHeroName(id, lang){
  const h = typeof heroFor === 'function' ? heroFor(id) : null;
  return h ? (h[lang] || h.en).name : '';
}
function movieHeroHead(id, theme){
  return typeof animalHeroSvg === 'function' ? animalHeroSvg(id, theme, '', { headOnly: true }) : '';
}

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
      <div class="movie-intro__hero">${typeof animalHeroSvg === 'function' ? animalHeroSvg(id, ep.theme, typeof heroEmblemInner === 'function' && heroFor(id) ? heroEmblemInner(heroFor(id).emblem) : '', {}) : ''}</div>
      <p class="movie-intro__kicker">🎬 ${U.movie} · ${U.episode} ${ep.n}</p>
      <h1 class="movie-intro__title">${mvEsc(ep.title[lang] || ep.title.en)}</h1>
      <p class="movie-intro__lead">${U.lead}</p>
      <div class="movie-intro__opts">
        <label class="movie-toggle"><input type="checkbox" data-opt="slow" ${o.slow ? 'checked' : ''}> 🐢 ${U.slow}</label>
        <label class="movie-toggle"><input type="checkbox" data-opt="cc" ${o.cc === false ? '' : 'checked'}> 💬 ${U.captions}</label>
      </div>
      <button type="button" class="btn btn-primary movie-bigbtn movie-intro__start" data-start>${U.start}</button>
    </div></section>`;
  root.querySelectorAll('[data-opt]').forEach(cb => cb.addEventListener('change', () => { const n = movieOpts(); n[cb.dataset.opt] = cb.checked; saveMovieOpts(n); }));
  root.querySelector('[data-start]').addEventListener('click', () => { MovieSfx.unlock(); new MoviePlayer(root, id).start(); });
}

/* ======================================================================== */
class MoviePlayer {
  constructor(root, id){
    this.root = root; this.id = id; this.ep = MOVIE_EPISODES[id];
    this.lang = getLang(); this.U = MOVIE_UI[this.lang] || MOVIE_UI.en;
    const o = movieOpts(); this.slow = !!o.slow; this.cc = o.cc !== false;
    this.paused = false; this.waiters = []; this.timers = []; this.tweens = [];
    this.stars = 0; this.asks = 0; this.askDone = 0; this.rescueN = 0; this.lastLine = null;
    this.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        <div class="movie__overlay" data-overlay hidden></div>
      </div>
      <div class="movie__captionbar"><div class="movie__caption" data-caption aria-live="polite" hidden><span class="movie__who" data-who></span><span class="movie__text" data-text></span></div></div>
      <div class="movie__controls">
        <button type="button" class="movie-btn" data-pause aria-pressed="false">⏸ <span>${U.pause}</span></button>
        <button type="button" class="movie-btn" data-repeat>🔁 <span>${U.repeat}</span></button>
        <button type="button" class="movie-btn" data-slow aria-pressed="${this.slow}">🐢 <span>${U.slow}</span></button>
        <button type="button" class="movie-btn" data-cc aria-pressed="${this.cc}">💬 <span>${U.captions}</span></button>
        <span class="movie__dots" data-dots>${Array.from({ length: this.asks }, () => '<i></i>').join('')}</span>
      </div>
      <div class="movie__ask" data-ask hidden></div>
    </section>`;
    const $ = s => this.root.querySelector(s);
    this.svg = $('.movie__svg'); this.stage = $('[data-stage]');
    this.layers = {}; this.svg.querySelectorAll('[data-layer]').forEach(g => (this.layers[g.dataset.layer] = g));
    this.el = { bubbles: $('[data-bubbles]'), banner: $('[data-banner]'), words: $('[data-words]'), caption: $('[data-caption]'), who: $('[data-who]'), text: $('[data-text]'), rewind: $('[data-rewind]'), overlay: $('[data-overlay]'), ask: $('[data-ask]'), dots: $('[data-dots]') };
    $('[data-pause]').addEventListener('click', () => this.togglePause());
    $('[data-repeat]').addEventListener('click', () => this.repeatLine());
    $('[data-slow]').addEventListener('click', e => { this.slow = !this.slow; e.currentTarget.setAttribute('aria-pressed', this.slow); saveMovieOpts(Object.assign(movieOpts(), { slow: this.slow })); });
    $('[data-cc]').addEventListener('click', e => { this.cc = !this.cc; e.currentTarget.setAttribute('aria-pressed', this.cc); this.el.caption.hidden = !this.cc || !this.captionOn; saveMovieOpts(Object.assign(movieOpts(), { cc: this.cc })); });
    this.keyHandler = e => { if (e.code === 'Space' && !/INPUT|BUTTON|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); this.togglePause(); } };
    document.addEventListener('keydown', this.keyHandler);
    // actors
    this.actors = {};
    for (const [k, c] of Object.entries(this.ep.cast)) this.addActor(k, c);
    this.addHero();
    this.cam = { x: ep.cam.x, y: null, zoom: ep.cam.zoom }; this.follow = null;
    this.audio = new Audio(); this.loadManifest();
    this.t = 0; this.last = performance.now();
    this.raf = requestAnimationFrame(now => this.frame(now));
    this.run(this.ep.steps).catch(err => { if (err !== 'stopped') console.error(err); });
  }
  countAsks(steps){ let n = 0; for (const s of steps){ if (s.ask) n++; if (s.par) n += this.countAsks(s.par); } return n; }

  addActor(k, c){
    const rig = MOVIE_CAST[k]();
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = rig.svg; this.layers.actors.appendChild(g);
    const q = s => g.querySelector(s);
    const a = {
      id: k, rig, el: g, x: c.x, y: c.y, face: c.face || 1, scale: c.scale || 1,
      parts: { bob: q('.mc-bob'), legF: q('.mc-leg-f'), legB: q('.mc-leg-b'), armF: q('.mc-arm-f'), armB: q('.mc-arm-b'), head: q('.mc-head'), earL: q('.mc-ear-l'), earR: q('.mc-ear-r'),
        flip: g.querySelectorAll('.mc-flipfix'), eyes: q('.mc-eyes'), dizzy: q('.mc-eyes-dizzy'), browL: q('.mc-brow-l'), browR: q('.mc-brow-r'), tail: q('.mc-tail'), candy: q('.mc-prop-candy'),
        mouths: { smile: q('.m-smile'), open: q('.m-open'), grin: q('.m-grin'), frown: q('.m-frown'), o: q('.m-o'), wobble: q('.m-wobble') } },
      phase: 0, walkAmt: 0, walk: null, arm: 'down', armA: 0, armBA: 0, mood: 'smile', ears: 'norm', earA: 0, lean: 0, leanA: 0,
      hopLeft: 0, hopT: 0, hold: null, talking: false, lookCam: false, blinkAt: 1 + Math.random() * 3, tailPuff: 0, layer: 'actors',
    };
    this.actors[k] = a;
  }
  addHero(){
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = `<g class="mv-hero-inner">${mcHeroSvg(this.id, this.ep.theme)}</g>`;
    g.style.display = 'none'; this.layers.actors.appendChild(g);
    this.hero = { el: g, inner: g.firstChild, x: 0, y: 0, rot: 0, visible: false, hover: false, scale: 1.55, height: 180 * 1.55 };
  }

  // ------------------------------------------------------------ clock
  get slowF(){ return this.slow ? 1.35 : 1; }
  frame(now){
    if (this.dead) return;
    let dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (this.paused) dt = 0;
    this.t += dt;
    for (const w of this.timers.slice()) { w.left -= dt; if (w.left <= 0) { this.timers.splice(this.timers.indexOf(w), 1); w.res(); } }
    for (const tw of this.tweens.slice()) {
      tw.e += dt; const p = Math.min(1, tw.e / tw.d); tw.fn(p);
      if (p >= 1) { this.tweens.splice(this.tweens.indexOf(tw), 1); tw.res(); }
    }
    for (const a of Object.values(this.actors)) this.updateActor(a, dt);
    this.updateHero(dt);
    this.updateCamera(dt);
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
    if (this.paused) { if (!this.audio.paused) this.audio.pause(); if (window.speechSynthesis) speechSynthesis.pause(); }
    else { if (this.audio.src && this.audioPlaying) this.audio.play().catch(() => {}); if (window.speechSynthesis) speechSynthesis.resume(); this.waiters.splice(0).forEach(r => r()); }
  }
  stop(){ this.dead = true; cancelAnimationFrame(this.raf); this.audio.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); document.removeEventListener('keydown', this.keyHandler); }

  // ------------------------------------------------------------ drawing
  updateActor(a, dt){
    const t = this.t, P = a.parts, pv = a.rig.pivots;
    if (a.walk) {
      const w = a.walk, dir = Math.sign(w.target - a.x), step = w.speed * dt / this.slowF;
      const dist = Math.abs(w.target - a.x);
      if (dist <= step || dir === 0) { a.x = w.target; a.y = w.y1; a.walk = null; w.res(); }
      else {
        a.x += dir * step; a.phase += step / (a.rig.height * 0.28) * (w.back ? -1 : 1);
        const p = 1 - Math.abs(w.target - a.x) / Math.max(1, Math.abs(w.target - w.x0)); a.y = w.y0 + (w.y1 - w.y0) * p;
        if (!w.back) a.face = dir;
      }
    }
    a.walkAmt += ((a.walk ? 1 : 0) - a.walkAmt) * Math.min(1, dt * 8);
    let hopY = 0;
    if (a.hopLeft > 0) { a.hopT += dt / 0.42; if (a.hopT >= 1) { a.hopT = 0; a.hopLeft--; } hopY = -Math.sin(Math.PI * a.hopT) * a.rig.height * 0.16; if (a.hopLeft === 0) hopY = 0; }
    const sw = Math.sin(a.phase * Math.PI * 2) * a.walkAmt;
    const armT = { down: 0, reach: -82, offer: -58, point: -96, stop: -112, wave: -150 + Math.sin(t * 10) * 22, cheer: -165, tell: -48 + Math.sin(t * 6) * 16 }[a.arm] ?? 0;
    const armBT = a.arm === 'cheer' ? -160 : 0;
    a.armA += (armT - a.armA) * Math.min(1, dt * 9); a.armBA += (armBT - a.armBA) * Math.min(1, dt * 9);
    const earT = { droop: 42, up: -10, norm: 0 }[a.ears] ?? 0;
    a.earA += (earT - a.earA) * Math.min(1, dt * 6);
    a.leanA += (a.lean - a.leanA) * Math.min(1, dt * 5);
    const rot = (el, ang, p) => el && el.setAttribute('transform', `rotate(${ang.toFixed(2)} ${p[0]} ${p[1]})`);
    rot(P.legF, sw * 26, pv.hipF); rot(P.legB, -sw * 26, pv.hipB);
    rot(P.armF, a.armA - sw * 18, pv.shF); rot(P.armB, a.armBA + sw * 18, pv.shB);
    const breathe = Math.sin(t * 2.2 + a.x) * 1.6, walkBob = -Math.abs(sw) * a.rig.height * 0.02;
    const talkNod = a.talking ? Math.sin(t * 9) * 1.5 : 0;
    const tilt = (a.mood === 'thinking' ? 7 : 0) + (a.lookCam ? -5 + Math.sin(t * 2) * 2 : 0) + talkNod;
    if (P.head) P.head.setAttribute('transform', `rotate(${tilt.toFixed(2)} ${pv.neck[0]} ${pv.neck[1]})`);
    if (P.earL && pv.earL) rot(P.earL, -a.earA + Math.sin(t * 3) * 2, pv.earL);
    if (P.earR && pv.earR) rot(P.earR, a.earA - Math.sin(t * 3 + 1) * 2, pv.earR);
    if (P.tail) { const s = 1 + a.tailPuff * 0.35 + Math.sin(t * 4) * 0.02; P.tail.setAttribute('transform', `translate(${-14 * (1 - s)} ${-18 * (1 - s)}) scale(${s})`); a.tailPuff = Math.max(0, a.tailPuff - dt * 0.7); }
    P.bob.setAttribute('transform', `translate(0 ${(breathe + walkBob).toFixed(2)}) rotate(${a.leanA.toFixed(2)})`);
    // face
    a.blinkAt -= dt;
    const blink = a.blinkAt < 0.12 && a.blinkAt > 0;
    if (a.blinkAt <= 0) a.blinkAt = 2.4 + Math.random() * 2.8;
    const dizzy = a.mood === 'dizzy';
    if (P.eyes) { const cy = +P.eyes.dataset.cy; P.eyes.style.display = dizzy ? 'none' : ''; P.eyes.setAttribute('transform', blink ? `translate(0 ${cy}) scale(1 .12) translate(0 ${-cy})` : ''); }
    if (P.dizzy) P.dizzy.style.display = dizzy ? '' : 'none';
    const browA = a.mood === 'worried' ? 16 : a.mood === 'surprised' ? -8 : a.mood === 'thinking' ? 6 : 0;
    if (P.browL) P.browL.style.transform = `translateY(${a.mood === 'surprised' ? -5 : 0}px) rotate(${-browA}deg)`;
    if (P.browR) P.browR.style.transform = `translateY(${a.mood === 'surprised' ? -5 : 0}px) rotate(${a.mood === 'thinking' ? -browA : browA}deg)`;
    const base = { smile: 'smile', grin: 'grin', worried: 'frown', surprised: 'o', dizzy: 'wobble', thinking: 'smile' }[a.mood] || 'smile';
    const show = a.talking ? ((Math.floor(t * 8.5) % 3) ? 'open' : base) : base;
    for (const [k, el] of Object.entries(P.mouths)) if (el) el.style.display = k === show ? '' : 'none';
    if (P.candy) P.candy.style.display = a.hold === 'candy' ? '' : 'none';
    if (P.flip) P.flip.forEach(f => f.setAttribute('transform', a.face < 0 ? 'scale(-1 1)' : ''));
    a.el.setAttribute('transform', `translate(${a.x.toFixed(1)} ${(a.y + hopY).toFixed(1)}) scale(${a.face * a.scale} ${a.scale})`);
  }
  updateHero(){
    const h = this.hero;
    h.el.style.display = h.visible ? '' : 'none';
    if (!h.visible) return;
    const bob = h.hover ? Math.sin(this.t * 3) * 9 : 0;
    h.el.setAttribute('transform', `translate(${h.x.toFixed(1)} ${(h.y + bob).toFixed(1)}) rotate(${h.rot.toFixed(1)}) scale(${h.scale})`);
  }
  updateCamera(dt){
    const c = this.cam, W = this.set.width;
    if (this.follow) { const a = this.actors[this.follow]; c.x += (a.x + a.face * 120 - c.x) * Math.min(1, dt * 2.5); }
    const half = 800 / c.zoom; c.x = Math.max(half - 60, Math.min(W - half + 60, c.x));
    const cy = c.y != null ? c.y : 900 - 450 / c.zoom;
    for (const [k, g] of Object.entries(this.layers)) {
      const p = k in this.set.parallax ? this.set.parallax[k] : 1;
      const zl = 1 + (c.zoom - 1) * p, cyl = 450 + (cy - 450) * p;
      g.setAttribute('transform', `translate(800 450) scale(${zl.toFixed(4)}) translate(${(-c.x * p).toFixed(1)} ${(-cyl).toFixed(1)})`);
    }
    this.camCY = cy;
  }
  toScreen(x, y){ const c = this.cam; return [800 + (x - c.x) * c.zoom, 450 + (y - this.camCY) * c.zoom]; }

  // ------------------------------------------------------------ script
  async run(steps){ for (const s of steps) { if (this.dead) throw 'stopped'; await this.gate(); await this.step(s); } }
  step(s){
    if (s.par) return Promise.all(s.par.map(x => this.step(x)));
    if (s.seq) return this.run(s.seq);
    if (s.say) return this.say(s);
    if (s.ask) return this.ask(s.ask);
    if (s.end) return this.ending();
    const a = s.a && (s.a === 'hero' ? null : this.actors[s.a]);
    switch (s.do) {
      case 'walk': return (s.delay ? this.wait(s.delay) : Promise.resolve()).then(() => new Promise(res => {
        a.walk = { x0: a.x, target: s.x, speed: s.speed || 150, y0: a.y, y1: s.y != null ? s.y : a.y, back: !!s.back, res };
        if (!s.back && s.x !== a.x) a.face = Math.sign(s.x - a.x);
      }));
      case 'face': a.face = s.dir; return Promise.resolve();
      case 'pose':
        if (s.arm) a.arm = s.arm; if (s.mood) a.mood = s.mood; if (s.ears) a.ears = s.ears;
        if ('lean' in s) a.lean = s.lean * (a.face || 1); if ('hold' in s) a.hold = s.hold;
        if (s.hop) { a.hopLeft = s.hop; a.hopT = 0; return this.wait(0.42 * s.hop); }
        return Promise.resolve();
      case 'cam': {
        if (s.follow) { this.follow = s.follow; return Promise.resolve(); }
        this.follow = null;
        const from = { ...this.cam }, to = { x: s.x != null ? s.x : from.x, y: s.y != null ? s.y : null, zoom: s.zoom || from.zoom };
        const fy = from.y != null ? from.y : 900 - 450 / from.zoom, ty = to.y != null ? to.y : 900 - 450 / to.zoom;
        const d = this.reduced ? 0 : (s.dur || 0) * this.slowF;
        const ease = p => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        return this.tween(d, p => { const e = ease(p); this.cam.x = from.x + (to.x - from.x) * e; this.cam.zoom = from.zoom + (to.zoom - from.zoom) * e; this.cam.y = fy + (ty - fy) * e; if (p >= 1) this.cam.y = to.y; });
      }
      case 'wait': return this.wait(s.s * this.slowF);
      case 'sfx': if (MovieSfx[s.s]) MovieSfx[s.s](); return Promise.resolve();
      case 'spark': return this.spark(a, s.at);
      case 'hero': return this.heroMove(s.mode, s.x);
      case 'gag': return this.gag(s.name, a);
      case 'layer': (s.layer === 'back' ? this.layers.actorsBack : this.layers.actors).appendChild(a.el); a.layer = s.layer === 'back' ? 'actorsBack' : 'actors'; return Promise.resolve();
      case 'title': return this.titleCard();
    }
    return Promise.resolve();
  }

  // ------------------------------------------------------------ voice + captions
  loadManifest(){
    this.manifest = new Set();
    fetch(`audio/movie/${this.lang}/index.json`).then(r => r.ok ? r.json() : []).then(l => (this.manifest = new Set(l))).catch(() => {});
  }
  whoName(who){
    if (who === 'narrator') return '';
    if (who === 'hero') return movieHeroName(this.id, this.lang);
    if (who === 'goat') return this.lang === 'es' ? 'Adulto desconocido' : 'Grown-up';
    if (who === 'bear') return this.lang === 'es' ? 'Salvavidas Bruno' : 'Lifeguard Bruno';
    return (MOVIE_CAST[who] && this.actors[who]) ? this.actors[who].rig.name : who;
  }
  async say(s){
    const who = s.say, text = s[this.lang] || s.en, a = this.actors[who];
    if (a && s.mood) a.mood = s.mood;
    if (a && s.ears) a.ears = s.ears;
    if (a && s.look === 'camera') a.lookCam = true;
    this.lastLine = { who, text };
    this.showCaption(who, text);
    if (who !== 'narrator' && !s.noBubble) this.showBubble(who, text);
    if (a) a.talking = true;
    await this.voice(who, text);
    if (a) a.talking = false;
    await this.wait(this.slow ? 1.4 : 0.6);
    if (a) a.lookCam = false;
    this.hideBubble();
  }
  showCaption(who, text){
    this.captionOn = true;
    this.el.who.textContent = this.whoName(who); this.el.who.hidden = who === 'narrator';
    this.el.text.textContent = text; this.el.caption.dataset.who = who;
    this.el.caption.hidden = !this.cc;
  }
  showBubble(who, text){
    this.el.bubbles.innerHTML = `<div class="movie-bubble movie-bubble--${who}">${mvEsc(text)}</div>`;
    this.bubbleWho = who; this.positionBubbles();
  }
  hideBubble(){ this.el.bubbles.innerHTML = ''; this.bubbleWho = null; }
  positionBubbles(){
    const b = this.el.bubbles.firstChild; if (!b || !this.bubbleWho) return;
    let x, y;
    if (this.bubbleWho === 'hero') { x = this.hero.x; y = this.hero.y - this.hero.height - 10; }
    else { const a = this.actors[this.bubbleWho]; if (!a) return; x = a.x; y = a.y - a.rig.height * a.scale - 12; }
    let [sx, sy] = this.toScreen(x, y);
    sx = Math.max(230, Math.min(1370, sx)); sy = Math.max(150, Math.min(700, sy));
    b.style.left = (sx / 16) + '%'; b.style.top = (sy / 9) + '%';
  }
  voice(who, text){
    return new Promise(resolve => {
      let done = false; const fin = () => { if (!done) { done = true; this.audioPlaying = false; resolve(); } };
      const key = typeof voiceKey === 'function' ? voiceKey(who + ': ' + text) : '';
      const safety = setTimeout(fin, (3000 + text.length * 120) * this.slowF + 4000);
      const tts = () => {
        if (!window.speechSynthesis) { this.wait(1 + text.length * 0.06).then(fin); return; }
        const u = new SpeechSynthesisUtterance(text.replace(/[“”]/g, ''));
        u.lang = this.lang === 'es' ? 'es-ES' : 'en-US';
        u.rate = this.slow ? 0.78 : 0.9;
        u.pitch = { alex: 1.35, nutty: 1.6, goat: 1.0, bear: 0.75, hero: 1.1 }[who] || 1;
        u.onend = () => { clearTimeout(safety); fin(); }; u.onerror = u.onend;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      };
      if (key && this.manifest.has(key)) {
        this.audio.src = `audio/movie/${this.lang}/${key}.mp3`;
        this.audio.playbackRate = this.slow ? 0.9 : 1;
        this.audio.preservesPitch = true;
        this.audio.onended = () => { clearTimeout(safety); fin(); };
        this.audio.onerror = () => tts();
        this.audioPlaying = true;
        this.audio.play().catch(() => tts());
      } else tts();
    });
  }
  repeatLine(){ if (this.lastLine && !this.repeating) { this.repeating = true; const l = this.lastLine; this.showCaption(l.who, l.text); this.voice(l.who, l.text).then(() => (this.repeating = false)); } }

  // ------------------------------------------------------------ effects
  async spark(a, at){
    const s = a.scale, x = at === 'hand' ? a.x + a.face * a.rig.height * 0.1 : a.x, y = at === 'hand' ? a.y - a.rig.height * 0.42 * s : a.y - a.rig.height * s - 40;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x} ${y})`); g.innerHTML = `<g class="mv-spark-pop">${mcSparkSvg()}</g>`;
    this.layers.fx.appendChild(g); MovieSfx.notice();
    this.wait(2.6).then(() => g.remove());
    return this.wait(0.7);
  }
  async gag(name, a){
    if (name === 'tail-puff') { a.tailPuff = 1; a.hopLeft = 1; a.hopT = 0; return this.wait(0.5); }
    if (name === 'acorn-bonk') {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.innerHTML = `<g><ellipse cx="0" cy="0" rx="10" ry="12" fill="#b9773a" stroke="#2b2b2b" stroke-width="3"/><path d="M-11 -5 q11 -12 22 0 z" fill="#7a4a22" stroke="#2b2b2b" stroke-width="3"/></g>`;
      this.layers.fx.appendChild(g);
      const x0 = a.x + 10, y0 = a.y - 300, y1 = a.y - 108;
      await this.tween(0.55, p => g.setAttribute('transform', `translate(${x0} ${y0 + (y1 - y0) * p * p}) rotate(${p * 200})`));
      MovieSfx.bonk(); a.mood = 'dizzy'; a.ears = 'droop';
      const stars = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      stars.innerHTML = [0, 1, 2].map(i => `<path class="mv-dizzy-star" style="--i:${i}" d="M0 -9 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#ffd23f" stroke="#2b2b2b" stroke-width="2"/>`).join('');
      stars.setAttribute('transform', `translate(${a.x + 6} ${a.y - 112})`); stars.setAttribute('class', 'mv-dizzy');
      this.layers.fx.appendChild(stars);
      this.tween(0.8, p => g.setAttribute('transform', `translate(${x0 + 120 * p} ${y1 - Math.sin(Math.PI * p) * 80 + p * 100}) rotate(${200 + p * 300})`)).then(() => g.remove());
      await this.wait(1.0);
      this.wait(1.6).then(() => { stars.remove(); if (a.mood === 'dizzy') { a.mood = 'smile'; a.ears = 'norm'; } });
    }
  }
  async heroMove(mode, x){
    const h = this.hero, alex = this.actors.alex, c = this.cam;
    const fly = (tx, ty, d, then) => { const fx = h.x, fy = h.y; MovieSfx.whoosh(); h.hover = false;
      return this.tween(d, p => { const e = 1 - Math.pow(1 - p, 3); h.x = fx + (tx - fx) * e; h.y = fy + (ty - fy) * e - Math.sin(Math.PI * p) * 60; h.rot = (1 - p) * (tx < fx ? -18 : 18); }).then(then); };
    if (mode === 'flyby' || mode === 'rescue') {
      h.visible = true; h.x = c.x + 1000; h.y = 120; const side = alex.x > c.x + 200 ? -1 : 1;
      return fly(alex.x + side * 230, alex.y - 210, 1.3, () => { h.hover = true; h.rot = 0; });
    }
    if (mode === 'land') {
      h.visible = true; h.x = c.x + 1000; h.y = 80;
      await fly(x, 800, 1.6, () => { h.rot = 0; }); MovieSfx.pop();
      await this.tween(0.35, p => (h.y = 800 - Math.sin(Math.PI * p) * 30));
      return;
    }
    if (mode === 'out') return fly(c.x + 1100, -260, 1.0, () => { h.visible = false; });
  }
  async titleCard(){
    const ep = this.ep, U = this.U, o = this.el.overlay;
    o.innerHTML = `<div class="movie-titlecard"><div class="movie-titlecard__hero">${typeof animalHeroSvg === 'function' ? animalHeroSvg(this.id, ep.theme, heroFor(this.id) ? heroEmblemInner(heroFor(this.id).emblem) : '', {}) : ''}</div>
      <p class="movie-titlecard__kicker">${U.movie} · ${U.episode} ${ep.n}</p><h2 class="movie-titlecard__title">${mvEsc(ep.title[this.lang] || ep.title.en)}</h2>
      <button type="button" class="movie-btn movie-titlecard__skip">${U.skip} ⏭</button></div>`;
    o.hidden = false; MovieSfx.sparkle();
    await Promise.race([this.wait(3.6), new Promise(r => o.querySelector('button').addEventListener('click', r))]);
    o.hidden = true; o.innerHTML = '';
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
    for (const a of Object.values(this.actors)) acts[a.id] = { x: a.x, y: a.y, face: a.face, arm: a.arm, mood: a.mood, ears: a.ears, lean: a.lean, hold: a.hold, layer: a.layer };
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
        const nx = f.x + (s.x - f.x) * e; a.phase -= Math.abs(nx - a.x) / (a.rig.height * 0.28); a.walkAmt = Math.abs(s.x - f.x) > 5 && p < 1 ? 1 : 0;
        a.x = nx; a.y = f.y + (s.y - f.y) * e;
      }
      this.cam.x = cam0.x + (snap.cam.x - cam0.x) * e; this.cam.zoom = cam0.zoom + (snap.cam.zoom - cam0.zoom) * e;
    });
    for (const a of Object.values(this.actors)) {
      const s = snap.acts[a.id];
      Object.assign(a, { face: s.face, arm: s.arm, mood: s.mood, ears: s.ears, lean: s.lean, hold: s.hold, walkAmt: 0 });
      if (a.layer !== s.layer) { this.layers[s.layer].appendChild(a.el); a.layer = s.layer; }
    }
    this.cam = { ...snap.cam }; this.follow = snap.follow;
    this.stage.classList.remove('is-rewinding'); this.el.rewind.hidden = true;
  }
  async heroRescue(tip, snap){
    await this.heroMove('rescue');
    const line = this.ep.rescue[this.rescueN++ % this.ep.rescue.length];
    await this.say({ say: 'hero', en: line.en, es: line.es });
    await this.rewindTo(snap);
    // the Hero Tip card
    const o = this.el.overlay, U = this.U, text = tip[this.lang] || tip.en;
    o.innerHTML = `<div class="movie-tip comic-panel" role="dialog" aria-label="${U.tip}"><div class="movie-tip__head">${movieHeroHead(this.id, this.ep.theme)}</div>
      <p class="movie-tip__kicker">💡 ${U.tip}</p><p class="movie-tip__text">${mvEsc(text)}</p>
      <button type="button" class="btn btn-primary movie-bigbtn" data-again>↺ ${U.tryAgain}</button></div>`;
    o.hidden = false; MovieSfx.sparkle();
    const btn = o.querySelector('[data-again]');
    const clicked = new Promise(r => btn.addEventListener('click', r));
    this.lastLine = { who: 'hero', text }; this.showCaption('hero', text);
    this.voice('hero', text);
    btn.focus({ preventScroll: true });
    await clicked;
    this.audio.pause(); if (window.speechSynthesis) speechSynthesis.cancel();
    o.hidden = true; o.innerHTML = '';
    await this.heroMove('out');
  }
  async ask(q){
    const U = this.U, crossed = new Set(); let firstTry = true;
    const alex = this.actors.alex;
    while (true) {
      if (alex) alex.lookCam = true;
      const choice = await this.showChoices(q, crossed);
      if (alex) alex.lookCam = false;
      const idx = q.choices.indexOf(choice);
      if (choice.ok) {
        if (firstTry) this.stars++;
        this.markDot(firstTry);
        this.banner('safe'); MovieSfx.safe();
        if (alex) { alex.ears = 'up'; alex.hopLeft = 1; alex.hopT = 0; }
        await this.run(choice.then || []);
        this.banner(null);
        return;
      }
      firstTry = false; crossed.add(idx);
      const snap = this.snapshot();
      this.banner('next');
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
    const read = () => { this.lastLine = { who: 'narrator', text: qt }; this.showCaption('narrator', qt); return this.voice('narrator', qt); };
    read();
    box.querySelector('[data-listen]').addEventListener('click', read);
    return new Promise(res => box.querySelectorAll('.movie-choice').forEach(b => b.addEventListener('click', () => {
      if (b.disabled) return;
      this.audio.pause(); if (window.speechSynthesis) speechSynthesis.cancel();
      const c = q.choices[+b.dataset.i];
      b.classList.add(c.ok ? 'is-right' : 'is-wrong');
      setTimeout(() => { box.hidden = true; box.innerHTML = ''; this.stage.classList.remove('is-asking'); this.scrollTo(this.stage, 'top'); res(c); }, 450);
    })));
  }
  scrollTo(el, where){
    const hdr = document.querySelector('.site-header'), hh = hdr && getComputedStyle(hdr).position.match(/sticky|fixed/) ? hdr.getBoundingClientRect().height : 0;
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
    for (const [i, l] of ep.signoff.entries()) {
      if (i === 0) this.ruleWords(true);
      await this.say({ say: l.who, en: l.en, es: l.es, mood: 'grin', noBubble: i === 0 });
      if (i === 0) this.ruleWords(false);
    }
    this.el.caption.hidden = true; this.captionOn = false;
    saveMovieProgress(this.id, { done: true, stars: Math.max(this.stars, (movieProgress()[this.id] || {}).stars || 0), sticker: true });
    const o = this.el.ask, tip = ep.heroTip[this.lang] || ep.heroTip.en;
    if (this.actors.alex) { this.actors.alex.arm = 'wave'; this.actors.alex.mood = 'grin'; }
    if (this.actors.bear) this.actors.bear.arm = 'wave';
    const back = typeof TOPICS_INDEX !== 'undefined' || true ? `topic.html?id=${this.id}` : 'index.html';
    o.innerHTML = `<div class="movie-end comic-panel">
      <div class="movie-end__sticker"><span class="movie-end__badge">${typeof animalHeroSvg === 'function' ? animalHeroSvg(this.id, ep.theme, heroFor(this.id) ? heroEmblemInner(heroFor(this.id).emblem) : '', {}) : ''}</span><span class="movie-end__ribbon">${mvEsc(ep.sticker[this.lang] || ep.sticker.en)}</span></div>
      <p class="movie-end__kicker">🎉 ${U.sticker}</p>
      <p class="movie-end__stars" aria-label="${U.stars}">${'⭐'.repeat(this.stars)}${'☆'.repeat(Math.max(0, this.asks - this.stars))}</p>
      <div class="movie-tip movie-tip--inline"><p class="movie-tip__kicker">💡 ${U.tip}</p><p class="movie-tip__text">${mvEsc(tip)}</p></div>
      <div class="movie-end__btns">
        <button type="button" class="btn btn-primary" data-again>↺ ${U.again}</button>
        <a class="btn btn-secondary" href="${back}">${U.back}</a>
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
