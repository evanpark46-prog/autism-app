/* ==========================================================================
   Safety Superheroes — home-page sky (VANTA.CLOUDS2 background covering the
   whole page + a GSAP patrol loop of the site mascot in a cape around the
   whole screen)
   Purely decorative, so both are skipped under Calm Mode and
   prefers-reduced-motion, same as every other motion effect in this app --
   and react live if a learner flips Calm Mode on/off from the display
   panel without leaving the page. Kept slow and smooth (no flashing, no
   quick moves) to match this app's calm-motion design rule -- one full lap
   takes about half a minute.
   ========================================================================== */

(function(){
  function reducedMotion(){
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function calmModeOn(){
    return document.documentElement.getAttribute('data-calm-mode') === 'on';
  }
  function motionAllowed(){
    return !calmModeOn() && !reducedMotion();
  }

  /* ---------------- cloud background ---------------- */

  const cloudEl = document.getElementById('hero-vanta');
  let cloudEffect = null;

  function startClouds(){
    if (!cloudEl || cloudEffect || typeof VANTA === 'undefined' || !motionAllowed()) return;
    cloudEffect = VANTA.CLOUDS2({
      el: cloudEl,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      texturePath: 'img/vanta/noise.png',
    });
  }

  function stopClouds(){
    if (cloudEffect){ cloudEffect.destroy(); cloudEffect = null; }
  }

  /* ---------------- flying squadron (GSAP) ---------------- */

  // A small squadron, not a single mascot -- each flies the same patrol
  // loop but phase-offset (started at a different waypoint) so they're
  // spread around the screen instead of clumped together. See the
  // matching page-flyhero-b/-c markup + CSS sizing in index.html/styles.css.
  const SQUADRON_SUFFIXES = ['', '-b', '-c'];
  const squadron = SQUADRON_SUFFIXES.map(suffix => ({
    el: document.getElementById(`hero-flyhero${suffix}`),
    capeEl: document.getElementById(`flyhero-cape${suffix}`),
    bodyEl: document.getElementById(`flyhero-body${suffix}`),
    body2El: document.getElementById(`flyhero-body2${suffix}`),
    emblemEl: document.getElementById(`flyhero-emblem${suffix}`),
    tween: null,
    flutterTween: null,
  })).filter(hero => hero.el);

  // Cycle through a random topic's colour + emblem each lap, so each flying
  // hero reads as "one of the 23 heroes" rather than always the same look --
  // reuses the existing HEROES/HERO_EMBLEMS data (js/heroes.js), already
  // loaded on this page for the "Meet your superheroes" wall.
  function cycleHeroSkin(hero){
    if (!hero.capeEl || typeof TOPICS === 'undefined' || typeof HERO_EMBLEMS === 'undefined') return;
    const meta = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    if (!meta) return;
    const heroData = typeof heroFor === 'function' ? heroFor(meta.id) : null;
    const themeVar = `var(--${meta.theme})`;
    const themeDarkVar = `var(--${meta.theme}-dark, ${themeVar})`;
    hero.capeEl.setAttribute('fill', themeVar);
    if (hero.bodyEl) hero.bodyEl.setAttribute('fill', themeDarkVar);
    if (hero.body2El) hero.body2El.setAttribute('fill', themeDarkVar);
    if (hero.emblemEl && heroData){
      hero.emblemEl.innerHTML = HERO_EMBLEMS[heroData.emblem] || HERO_EMBLEMS.star;
    }
  }

  // A closed lap around the screen's edges (clockwise), each leg eased with
  // sine.inOut. The lap loops back to WAYPOINTS[0] as its own last leg, so
  // repeat:-1 restarts exactly where it left off -- no visible teleport.
  const WAYPOINTS = [
    { left: '8%',  top: '14%', rotation: -12 },
    { left: '50%', top: '7%',  rotation: 0 },
    { left: '90%', top: '16%', rotation: 14 },
    { left: '92%', top: '50%', rotation: 30 },
    { left: '88%', top: '82%', rotation: 14 },
    { left: '50%', top: '88%', rotation: 0 },
    { left: '10%', top: '80%', rotation: -14 },
    { left: '6%',  top: '45%', rotation: -26 },
  ];
  const LEG_DURATION = 3.4;

  /** Rotated copy of WAYPOINTS starting at `offset`, so a squadron member's
   * lap begins partway around the same closed loop instead of at the top. */
  function rotatedWaypoints(offset){
    const n = WAYPOINTS.length;
    return Array.from({ length: n }, (_, i) => WAYPOINTS[(offset + i) % n]);
  }

  function startHero(hero, index){
    if (hero.tween || typeof gsap === 'undefined' || !motionAllowed()) return;
    const offset = Math.round((index * WAYPOINTS.length) / squadron.length);
    const points = rotatedWaypoints(offset);
    const legDuration = LEG_DURATION * (1 + index * 0.12); // slightly different pace per hero
    cycleHeroSkin(hero);
    hero.tween = gsap.timeline({ repeat: -1, onRepeat: () => cycleHeroSkin(hero) }).set(hero.el, points[0]);
    for (let i = 1; i <= points.length; i++){
      hero.tween.to(hero.el, Object.assign({ duration: legDuration, ease: 'sine.inOut' }, points[i % points.length]));
    }
    // A small secondary "flutter" (gentle scale breathing, offset per hero so the
    // squadron doesn't pulse in lockstep) layered on top of the patrol path --
    // scale is untouched by the path tween above, so the two never fight. Kept
    // slow and subtle (4% scale, ~1.8s half-cycle) to match the calm-motion rule.
    hero.flutterTween = gsap.to(hero.el, {
      scale: 1.04, duration: 1.8 + index * 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1,
      delay: index * 0.5,
    });
  }

  function stopHero(hero, index){
    if (hero.tween){ hero.tween.kill(); hero.tween = null; }
    if (hero.flutterTween){ hero.flutterTween.kill(); hero.flutterTween = null; }
    if (hero.el && typeof gsap !== 'undefined'){
      const offset = Math.round((index * WAYPOINTS.length) / squadron.length);
      gsap.set(hero.el, Object.assign({ scale: 1 }, WAYPOINTS[offset % WAYPOINTS.length]));
    }
  }

  function startSquadron(){
    squadron.forEach((hero, i) => startHero(hero, i));
  }
  function stopSquadron(){
    squadron.forEach((hero, i) => stopHero(hero, i));
  }

  /* ---------------- wire up ---------------- */

  startClouds();
  startSquadron();

  // Calm Mode can be toggled on this same page via the display panel --
  // react immediately instead of waiting for a reload.
  new MutationObserver(() => {
    if (motionAllowed()){ startClouds(); startSquadron(); }
    else { stopClouds(); stopSquadron(); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-calm-mode'] });
})();
