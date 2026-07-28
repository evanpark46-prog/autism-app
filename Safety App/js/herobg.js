/* ==========================================================================
   Safety Superheroes — home-page sky (VANTA.CLOUDS2 background covering the
   whole page) + a single GSAP-animated hero drifting gently within the hero
   banner only (not an ambient squadron flying over the whole page).
   Purely decorative, so both are skipped under Calm Mode and
   prefers-reduced-motion, same as every other motion effect in this app --
   and react live if a learner flips Calm Mode on/off from the display
   panel without leaving the page. Kept slow and smooth (no flashing, no
   quick moves) to match this app's calm-motion design rule.
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

  /* ---------------- one hero, contained to the banner (GSAP) ---------------- */

  // Deliberately a single hero, not a squadron, and confined to the hero
  // banner (see .page-flyhero's position:absolute + .hero's overflow:hidden
  // in styles.css) rather than patrolling the whole page forever -- a
  // character should read as a purposeful touch, not ambient decoration
  // flying over the topic grid/footer/etc. as the page scrolls.
  const hero = {
    el: document.getElementById('hero-flyhero'),
    capeEl: document.getElementById('flyhero-cape'),
    bodyEl: document.getElementById('flyhero-body'),
    body2El: document.getElementById('flyhero-body2'),
    emblemEl: document.getElementById('flyhero-emblem'),
    tween: null,
    flutterTween: null,
  };

  // Cycle through a random topic's colour + emblem each lap, so the visitor
  // sees a few different heroes over time rather than always the same
  // look -- reuses the existing HEROES/HERO_EMBLEMS data (js/heroes.js),
  // already loaded on this page for the "Meet your superheroes" wall.
  function cycleHeroSkin(){
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

  // A small closed loop within the banner's own bounds (percentages resolve
  // against .hero, which is position:relative) -- a gentle drift, not a
  // full-screen patrol. Loops back to WAYPOINTS[0] as its own last leg, so
  // repeat:-1 restarts exactly where it left off -- no visible teleport.
  const WAYPOINTS = [
    { left: '68%', top: '8%',  rotation: -12 },
    { left: '84%', top: '18%', rotation: 6 },
    { left: '80%', top: '58%', rotation: 16 },
    { left: '62%', top: '48%', rotation: -6 },
  ];
  const LEG_DURATION = 4.2;

  function startHero(){
    if (hero.tween || !hero.el || typeof gsap === 'undefined' || !motionAllowed()) return;
    cycleHeroSkin();
    hero.tween = gsap.timeline({ repeat: -1, onRepeat: cycleHeroSkin }).set(hero.el, WAYPOINTS[0]);
    for (let i = 1; i <= WAYPOINTS.length; i++){
      hero.tween.to(hero.el, Object.assign({ duration: LEG_DURATION, ease: 'sine.inOut' }, WAYPOINTS[i % WAYPOINTS.length]));
    }
    // A small secondary "flutter" (gentle scale breathing) layered on top of
    // the drift path -- scale is untouched by the path tween above, so the
    // two never fight. Kept slow and subtle to match the calm-motion rule.
    hero.flutterTween = gsap.to(hero.el, { scale: 1.04, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  function stopHero(){
    if (hero.tween){ hero.tween.kill(); hero.tween = null; }
    if (hero.flutterTween){ hero.flutterTween.kill(); hero.flutterTween = null; }
    if (hero.el && typeof gsap !== 'undefined') gsap.set(hero.el, Object.assign({ scale: 1 }, WAYPOINTS[0]));
  }

  /* ---------------- wire up ---------------- */

  startClouds();
  startHero();

  // Calm Mode can be toggled on this same page via the display panel --
  // react immediately instead of waiting for a reload.
  new MutationObserver(() => {
    if (motionAllowed()){ startClouds(); startHero(); }
    else { stopClouds(); stopHero(); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-calm-mode'] });
})();
