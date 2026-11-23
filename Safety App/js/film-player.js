/* ==========================================================================
   Safety Superheroes — Hero Movie FILM player
   Plays a hand-painted film episode as clips (video/<id>/<clip>.<lang>.mp4):
     clip -> freeze on its last frame -> question card -> the child chooses
       right: safe chime -> the next clip
       wrong: that answer's consequence clip -> the shared hero-rescue clip
              -> Hero Tip card -> the question again (that answer crossed out)
   Two stacked <video>s crossfade so a clip change never flashes black.
   Captions are WebVTT tracks; Slow mode plays at 0.85x. Data: js/film-data.js.
   ========================================================================== */

class FilmPlayer {
  constructor(root, id){
    this.root = root; this.id = id; this.ep = FILM_EPISODES[id];
    this.lang = getLang() === 'es' ? 'es' : 'en';
    this.U = (typeof MOVIE_UI !== 'undefined' && (MOVIE_UI[this.lang] || MOVIE_UI.en)) || {};
    const o = typeof movieOpts === 'function' ? movieOpts() : {};
    this.slow = !!o.slow; this.cc = o.cc !== false;
    this.stars = 0; this.done = 0; this.front = 0;
    this.reduced = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-calm-mode') === 'on';
  }
  t(k, d){ return this.U[k] || d; }
  start(){
    const U = this.U, title = this.ep.title[this.lang] || this.ep.title.en;
    this.root.innerHTML = `<section class="film${this.reduced ? ' is-calm' : ''}" aria-label="${mvEsc(title)}">
      <div class="film__stage">
        <video class="film__v is-on" playsinline preload="auto"></video>
        <video class="film__v" playsinline preload="auto"></video>
        <div class="film__banner" data-banner hidden></div>
        <div class="film__overlay" data-overlay hidden></div>
        <button type="button" class="film__big-play" data-bigplay hidden aria-label="${this.t('play', 'Play')}">▶</button>
      </div>
      <div class="film__controls">
        <button type="button" class="movie-btn" data-pause aria-pressed="false">⏸ <span>${this.t('pause', 'Pause')}</span></button>
        <button type="button" class="movie-btn" data-replay>⟲ <span>${this.t('repeat', 'Repeat')}</span></button>
        <button type="button" class="movie-btn" data-slow aria-pressed="${this.slow}">🐢 <span>${this.t('slow', 'Slow')}</span></button>
        <button type="button" class="movie-btn" data-cc aria-pressed="${this.cc}">💬 <span>${this.t('captions', 'Captions')}</span></button>
        <span class="movie__dots" data-dots>${this.ep.questions.map(() => '<i></i>').join('')}</span>
      </div>
      <div class="film__ask" data-ask hidden></div>
    </section>`;
    const $ = s => this.root.querySelector(s);
    this.v = Array.from(this.root.querySelectorAll('.film__v'));
    this.el = { banner: $('[data-banner]'), overlay: $('[data-overlay]'), ask: $('[data-ask]'), dots: $('[data-dots]'), bigplay: $('[data-bigplay]'), stage: $('.film__stage') };
    $('[data-pause]').addEventListener('click', e => this.togglePause(e.currentTarget));
    $('[data-replay]').addEventListener('click', () => this.replay());
    $('[data-slow]').addEventListener('click', e => { this.slow = !this.slow; e.currentTarget.setAttribute('aria-pressed', this.slow); this.cur().playbackRate = this.slow ? 0.85 : 1; this.saveOpts(); });
    $('[data-cc]').addEventListener('click', e => { this.cc = !this.cc; e.currentTarget.setAttribute('aria-pressed', this.cc); this.v.forEach(v => this.applyCC(v)); this.saveOpts(); });
    this.el.bigplay.addEventListener('click', () => { this.el.bigplay.hidden = true; this.cur().play().catch(() => {}); });
    this.playClip(this.ep.start);
  }
  saveOpts(){ if (typeof saveMovieOpts === 'function') saveMovieOpts(Object.assign(movieOpts(), { slow: this.slow, cc: this.cc })); }
  cur(){ return this.v[this.front]; }
  src(clip, ext){ return `${this.ep.base}${clip}.${this.lang}.${ext}`; }
  applyCC(v){ for (const tr of v.textTracks) tr.mode = this.cc ? 'showing' : 'hidden'; }
  // load a clip into the hidden video, crossfade to it, play; resolves when it ends
  playClip(clip){
    this.clip = clip;
    return new Promise(resolve => {
      const next = this.v[1 - this.front], prev = this.v[this.front];
      next.querySelectorAll('track').forEach(t => t.remove());
      next.src = this.src(clip, 'mp4');
      const tr = document.createElement('track'); tr.kind = 'captions'; tr.srclang = this.lang; tr.label = this.lang === 'es' ? 'Español' : 'English'; tr.src = this.src(clip, 'vtt'); tr.default = true;
      next.appendChild(tr);
      next.playbackRate = this.slow ? 0.85 : 1;
      const go = () => {
        next.removeEventListener('canplay', go);
        this.applyCC(next);
        next.classList.add('is-on'); prev.classList.remove('is-on');
        this.front = 1 - this.front;
        setTimeout(() => { if (!prev.classList.contains('is-on')) { prev.pause(); } }, 320);
        next.onended = () => resolve();
        next.play().catch(() => { this.el.bigplay.hidden = false; });
      };
      next.addEventListener('canplay', go);
      next.load();
    }).then(() => this.afterClip(clip));
  }
  replay(){ const v = this.cur(); this.el.ask.hidden = true; v.currentTime = 0; v.play().catch(() => {}); }
  togglePause(btn){
    const v = this.cur(); if (v.paused) { v.play().catch(() => {}); btn.innerHTML = `⏸ <span>${this.t('pause', 'Pause')}</span>`; btn.setAttribute('aria-pressed', 'false'); }
    else { v.pause(); btn.innerHTML = `▶ <span>${this.t('play', 'Play')}</span>`; btn.setAttribute('aria-pressed', 'true'); }
  }
  // ---------- voice for questions + tips (recorded clips when available, else device voice) ----------
  speak(who, text){
    if (typeof voiceKey !== 'function') return;
    const key = voiceKey(who + ': ' + text);
    const tryTTS = () => { if (!window.speechSynthesis) return; const u = new SpeechSynthesisUtterance(text.replace(/[“”]/g, '')); u.lang = this.lang === 'es' ? 'es-ES' : 'en-US'; u.rate = this.slow ? 0.8 : 0.92; speechSynthesis.cancel(); speechSynthesis.speak(u); };
    fetch(`audio/movie/${this.lang}/index.json`).then(r => r.ok ? r.json() : []).then(list => {
      if (!list.includes(key)) return tryTTS();
      this.vo && this.vo.pause(); this.vo = new Audio(`audio/movie/${this.lang}/${key}.mp3`); this.vo.playbackRate = this.slow ? 0.9 : 1; this.vo.play().catch(tryTTS);
    }).catch(tryTTS);
  }
  hush(){ if (this.vo) this.vo.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); }
  // ---------- the question ----------
  ask(q, crossed){
    const box = this.el.ask, qt = q.q[this.lang] || q.q.en;
    box.innerHTML = `<div class="film-ask comic-panel"><p class="movie-ask__kicker">${this.t('yourTurn', 'Your turn! What should Alex do?')}</p>
      <p class="movie-ask__q"><button type="button" class="movie-ask__listen" data-listen aria-label="${this.t('listen', 'Listen')}">🔊</button> ${mvEsc(qt)}</p>
      <div class="movie-ask__choices">${q.choices.map((c, i) => `<button type="button" class="movie-choice film-choice${crossed.has(i) ? ' is-crossed' : ''}" data-i="${i}" ${crossed.has(i) ? 'disabled aria-disabled="true"' : ''}>
        <span class="movie-choice__icon" aria-hidden="true">${c.icon || '•'}</span><span class="movie-choice__text">${mvEsc(c[this.lang] || c.en)}</span>${crossed.has(i) ? '<span class="movie-choice__x" aria-hidden="true">✗</span>' : ''}</button>`).join('')}</div></div>`;
    box.hidden = false; box.classList.remove('is-leaving');
    requestAnimationFrame(() => box.classList.add('is-in'));
    const firstOpen = box.querySelector('.film-choice:not([disabled])'); if (firstOpen) firstOpen.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: this.reduced ? 'auto' : 'smooth', block: 'nearest' });
    this.speak('narrator', qt);
    box.querySelector('[data-listen]').addEventListener('click', () => this.speak('narrator', qt));
    return new Promise(res => box.querySelectorAll('.film-choice').forEach(b => b.addEventListener('click', () => {
      if (b.disabled) return;
      this.hush();
      const i = +b.dataset.i, c = q.choices[i];
      b.classList.add(c.ok ? 'is-right' : 'is-wrong');
      box.classList.remove('is-in'); box.classList.add('is-leaving');
      setTimeout(() => { box.hidden = true; box.classList.remove('is-leaving'); res({ c, i }); }, 180);
    }))).then(async ({ c, i }) => {
      const first = crossed.size === 0;
      if (c.ok) {
        if (first) this.stars++;
        const d = this.el.dots.children[this.done++]; if (d) d.className = first ? 'is-star' : 'is-done';
        this.banner('safe'); if (typeof MovieSfx !== 'undefined') MovieSfx.safe();
        setTimeout(() => this.banner(null), 2200);
        return this.playClip(c.next);
      }
      this.crossed = this.crossed || {}; this.crossed[q.after] = new Set([...crossed, i]);
      this.banner('next');
      return this.playClip(c.next);   // afterClip() then runs rescue -> tip -> ask again
    });
  }
  banner(kind){
    const b = this.el.banner;
    if (!kind) { b.classList.remove('is-in'); setTimeout(() => (b.hidden = true), 160); return; }
    b.className = 'film__banner movie__banner movie__banner--' + kind;
    b.innerHTML = kind === 'safe' ? `<span class="movie__mark">✓</span> ${this.t('safe', 'Safe choice!')}` : `<span class="movie__mark">✗</span> ${this.t('whatNext', 'What happens next?')}`;
    b.hidden = false; requestAnimationFrame(() => b.classList.add('is-in'));
  }
  tipCard(tip){
    const o = this.el.overlay, text = tip[this.lang] || tip.en;
    o.innerHTML = `<div class="movie-tip film-tip comic-panel" role="dialog" aria-label="${this.t('tip', 'Hero Tip')}"><div class="movie-tip__head">${typeof movieHeroHead === 'function' ? movieHeroHead(this.id, this.ep.theme) : ''}</div>
      <p class="movie-tip__kicker">💡 ${this.t('tip', 'Hero Tip')}</p><p class="movie-tip__text">${mvEsc(text)}</p>
      <button type="button" class="btn btn-primary movie-bigbtn" data-again>↺ ${this.t('tryAgain', 'Try again')}</button></div>`;
    o.hidden = false; requestAnimationFrame(() => o.classList.add('is-in'));
    this.speak('hero', text);
    const btn = o.querySelector('[data-again]'); btn.focus({ preventScroll: true });
    return new Promise(r => btn.addEventListener('click', () => { this.hush(); o.classList.remove('is-in'); setTimeout(() => { o.hidden = true; o.innerHTML = ''; r(); }, 180); }));
  }
  ending(){
    const ep = this.ep, box = this.el.ask, tip = ep.heroTip[this.lang] || ep.heroTip.en, n = ep.questions.length;
    if (typeof saveMovieProgress === 'function') saveMovieProgress(this.id, { done: true, stars: Math.max(this.stars, ((movieProgress()[this.id]) || {}).stars || 0), sticker: true });
    box.innerHTML = `<div class="movie-end film-end comic-panel">
      <div class="movie-end__sticker"><span class="movie-end__badge">${typeof movieHeroFull === 'function' ? movieHeroFull(this.id, ep.theme) : ''}</span><span class="movie-end__ribbon">${mvEsc(ep.sticker[this.lang] || ep.sticker.en)}</span></div>
      <p class="movie-end__kicker">🎉 ${this.t('sticker', 'New sticker!')}</p>
      <p class="movie-end__stars" aria-label="${this.t('stars', 'First-try safe choices')}">${'⭐'.repeat(this.stars)}${'☆'.repeat(Math.max(0, n - this.stars))}</p>
      <div class="movie-tip movie-tip--inline"><p class="movie-tip__kicker">💡 ${this.t('tip', 'Hero Tip')}</p><p class="movie-tip__text">${mvEsc(tip)}</p></div>
      <div class="movie-end__btns"><button type="button" class="btn btn-primary" data-again>↺ ${this.t('again', 'Watch again')}</button>
        <a class="btn btn-secondary" href="topic.html?id=${this.id}">${this.t('back', 'Back to the lesson')}</a></div></div>`;
    box.hidden = false; requestAnimationFrame(() => box.classList.add('is-in'));
    box.scrollIntoView({ behavior: this.reduced ? 'auto' : 'smooth', block: 'nearest' });
    if (typeof MovieSfx !== 'undefined') MovieSfx.sparkle();
    box.querySelector('[data-again]').addEventListener('click', () => { this.hush(); new FilmPlayer(this.root, this.id).start(); });
    this.speak('hero', tip);
  }
}
// wrong-answer flow lives here so afterClip stays simple: consequence -> rescue -> tip -> ask again
FilmPlayer.prototype.afterClip = async function (clip){
  const q = this.ep.questions.find(x => x.after === clip);
  if (q) return this.ask(q, new Set());
  if (clip === this.ep.end) return this.ending();
  for (const qq of this.ep.questions) {
    const c = qq.choices.find(ch => !ch.ok && ch.next === clip);
    if (!c) continue;
    this.banner(null);
    await this.playClipRaw(this.ep.rescue);
    await this.showFreeze(qq.after);      // back to the moment of the question (time was rewound!)
    await this.tipCard(c.tip);
    return this.ask(qq, (this.crossed && this.crossed[qq.after]) || new Set());
  }
};
// show the last frame of a clip, paused (used to return to the question after the rewind)
FilmPlayer.prototype.showFreeze = function (clip){
  return new Promise(resolve => {
    const next = this.v[1 - this.front], prev = this.v[this.front];
    next.querySelectorAll('track').forEach(t => t.remove());
    next.onended = null; next.src = this.src(clip, 'mp4'); next.muted = true;
    const onMeta = () => { next.removeEventListener('loadedmetadata', onMeta); next.currentTime = Math.max(0, next.duration - 0.08); };
    const onSeek = () => { next.removeEventListener('seeked', onSeek); next.pause(); next.muted = false; next.classList.add('is-on'); prev.classList.remove('is-on'); this.front = 1 - this.front; setTimeout(resolve, 320); };
    next.addEventListener('loadedmetadata', onMeta); next.addEventListener('seeked', onSeek);
    next.load();
  });
};
// play a clip without running afterClip (used for the rescue clip)
FilmPlayer.prototype.playClipRaw = function (clip){
  const save = this.afterClip; this.afterClip = async () => {};
  return this.playClip(clip).then(() => { this.afterClip = save; });
};
