/* ==========================================================================
   Safety Superheroes — superhero page transitions
   Tapping a link to another page: a random caped animal hero flies across
   a bursting sky with a short safety tip (about 2 seconds; a tap skips), then the next page opens with a
   circle "iris" wipe (pure CSS, driven by data-hero-enter which the page's
   head script sets, so there's no flash of the page first).
   Skipped entirely in Calm Mode and when the device asks for reduced motion.
   ========================================================================== */

const HERO_NAV_KEY = 'safetylib_hero_nav';
const HERO_NAV_DELAY = 520;      // ms the swoop plays before the page changes
const HERO_NAV_TIP_DELAY = 2200;  // when a safety tip is shown (tap skips)
const HERO_NAV_THEMES = ['blue', 'red', 'green', 'purple', 'amber'];

function heroNavAllowed(){
  if (typeof getCalmMode === 'function' && getCalmMode()) return false;
  try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false; } catch (e) { /* ignore */ }
  return true;
}

function heroNavEligible(e, a){
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (!a || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return false;
  if (a.target && a.target !== '_self') return false;
  const raw = a.getAttribute('href') || '';
  if (!raw || raw.startsWith('#') || /^(mailto|tel|sms|javascript):/i.test(raw)) return false;
  let url;
  try { url = new URL(a.href, location.href); } catch (err) { return false; }
  if (url.origin !== location.origin) return false;
  // Same page, only the #hash differs: let the browser scroll.
  if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
  return url;
}

function heroNavOverlay(x, y){
  const ids = typeof ANIMAL_HEROES !== 'undefined' ? Object.keys(ANIMAL_HEROES) : [];
  const id = ids.length ? ids[Math.floor(Math.random() * ids.length)] : null;
  const theme = HERO_NAV_THEMES[Math.floor(Math.random() * HERO_NAV_THEMES.length)];
  const lang = typeof getLang === 'function' ? getLang() : 'en';
  const hero = id && typeof flyingHeroSvg === 'function' ? flyingHeroSvg(id, theme) : '';
  const tip = id && typeof heroTipFor === 'function' ? heroTipFor(id, lang) : '';
  const el = document.createElement('div');
  el.className = 'hero-nav';
  el.setAttribute('role', 'status');
  el.style.setProperty('--hx', x + 'px');
  el.style.setProperty('--hy', y + 'px');
  el.innerHTML = `
    <div class="hero-nav__sky" aria-hidden="true"></div>
    <div class="hero-nav__lines" aria-hidden="true"></div>
    <span class="hero-nav__star s1" aria-hidden="true">★</span><span class="hero-nav__star s2" aria-hidden="true">✦</span><span class="hero-nav__star s3" aria-hidden="true">★</span>
    ${hero ? `<div class="hero-nav__hero" aria-hidden="true"><div class="hero-nav__trail"></div>${hero}</div>` : ''}
    ${tip ? `<p class="safety-tip hero-nav__tip"><span class="safety-tip__label">${escapeHtml(t('hero_tip_label'))}</span> ${escapeHtml(tip)}</p>
      <p class="hero-nav__skip">${escapeHtml(t('hero_tip_skip'))}</p>` : ''}`;
  return { el, hasTip: !!tip };
}

function initHeroTransitions(){
  // Entry wipe finished (or never started): clear the flag attribute.
  const root = document.documentElement;
  if (root.hasAttribute('data-hero-enter')) setTimeout(() => root.removeAttribute('data-hero-enter'), 900);

  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');
    const url = heroNavEligible(e, a);
    if (!url || !heroNavAllowed() || document.querySelector('.hero-nav')) return;
    e.preventDefault();
    const r = a.getBoundingClientRect();
    const x = e.clientX || (r.left + r.width / 2), y = e.clientY || (r.top + r.height / 2);
    const { el, hasTip } = heroNavOverlay(x, y);
    document.body.appendChild(el);
    try { sessionStorage.setItem(HERO_NAV_KEY, String(Date.now())); } catch (err) { /* ignore */ }
    let gone = false;
    const go = () => { if (gone) return; gone = true; location.href = url.href; };
    // With a tip on screen, give time to read it; a tap or key skips ahead.
    setTimeout(go, hasTip ? HERO_NAV_TIP_DELAY : HERO_NAV_DELAY);
    setTimeout(() => {
      el.addEventListener('pointerdown', go);
      document.addEventListener('keydown', go, { once: true });
    }, 250);
  });

  // Coming back via the Back button (page restored from cache): remove the
  // leftover overlay so the page is usable.
  window.addEventListener('pageshow', ev => {
    if (!ev.persisted) return;
    document.querySelectorAll('.hero-nav').forEach(n => n.remove());
    root.removeAttribute('data-hero-enter');
    try { sessionStorage.removeItem(HERO_NAV_KEY); } catch (err) { /* ignore */ }
  });
}
