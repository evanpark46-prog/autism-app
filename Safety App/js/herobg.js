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

  /* ---------------- flying mascot (GSAP) ---------------- */

  const heroEl = document.getElementById('hero-flyhero');
  const capeEl = document.getElementById('flyhero-cape');
  const bodyEl = document.getElementById('flyhero-body');
  const body2El = document.getElementById('flyhero-body2');
  const emblemEl = document.getElementById('flyhero-emblem');
  let heroTween = null;

  // Cycle through a random topic's colour + emblem each lap, so the flying
  // mascot reads as "one of the 23 heroes" rather than always the same
  // raccoon -- reuses the existing HEROES/HERO_EMBLEMS data (js/heroes.js),
  // already loaded on this page for the "Meet your superheroes" wall.
  function cycleHeroSkin(){
    if (!capeEl || typeof TOPICS === 'undefined' || typeof HERO_EMBLEMS === 'undefined') return;
    const meta = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    if (!meta) return;
    const hero = typeof heroFor === 'function' ? heroFor(meta.id) : null;
    const themeVar = `var(--${meta.theme})`;
    const themeDarkVar = `var(--${meta.theme}-dark, ${themeVar})`;
    if (capeEl) capeEl.setAttribute('fill', themeVar);
    if (bodyEl) bodyEl.setAttribute('fill', themeDarkVar);
    if (body2El) body2El.setAttribute('fill', themeDarkVar);
    if (emblemEl && hero){
      emblemEl.innerHTML = HERO_EMBLEMS[hero.emblem] || HERO_EMBLEMS.star;
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

  function startHero(){
    if (!heroEl || heroTween || typeof gsap === 'undefined' || !motionAllowed()) return;
    cycleHeroSkin();
    heroTween = gsap.timeline({ repeat: -1, onRepeat: cycleHeroSkin }).set(heroEl, WAYPOINTS[0]);
    for (let i = 1; i <= WAYPOINTS.length; i++){
      heroTween.to(heroEl, Object.assign({ duration: LEG_DURATION, ease: 'sine.inOut' }, WAYPOINTS[i % WAYPOINTS.length]));
    }
  }

  function stopHero(){
    if (heroTween){ heroTween.kill(); heroTween = null; }
    if (heroEl && typeof gsap !== 'undefined') gsap.set(heroEl, WAYPOINTS[0]);
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
