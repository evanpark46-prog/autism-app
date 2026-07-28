/* ==========================================================================
   Safety Superheroes — service worker
   Precaches the app shell (pages, styles, core scripts, icons) so the site
   opens offline once visited. Lesson content (content/<id>.js) and topic
   images are cached at runtime, the first time each topic is actually
   opened -- so a fresh install doesn't force-download all 23 lessons, only
   the ones a learner has visited end up available offline.

   Bump CACHE_NAME (e.g. v1 -> v2) after editing any shell file below so
   returning visitors pick up the change instead of an old cached copy.
   ========================================================================== */

const CACHE_NAME = 'safety-superheroes-shell-v23';

const SHELL_FILES = [
  'index.html',
  'topic.html',
  'review.html',
  'games.html',
  'worksheet.html',
  'parents.html',
  'about.html',
  'privacy.html',
  'analytics.html',
  'badges.html',
  'certificate.html',
  'boss-battle.html',
  'hero-rush.html',
  'vocab-quiz.html',
  'sort-it-out.html',
  '404.html',
  'manifest.json',
  'css/styles.css',
  'js/i18n.js',
  'js/theme.js',
  'js/textsize.js',
  'js/headingfont.js',
  'js/speechrate.js',
  'js/analytics.js',
  'js/favorites.js',
  'js/emotioncheckin.js',
  'js/calmmode.js',
  'js/symbols.js',
  'js/glossary.js',
  'js/heroes.js',
  'js/soundfx.js',
  'js/categories.js',
  'js/topics-index.js',
  'js/story.js',
  'js/speech.js',
  'js/page-home.js',
  'js/page-topic.js',
  'js/page-review.js',
  'js/page-worksheet.js',
  'js/page-analytics.js',
  'js/page-badges.js',
  'js/page-certificate.js',
  'js/page-boss-battle.js',
  'js/page-hero-rush.js',
  'js/page-vocab-quiz.js',
  'js/page-sort-it-out.js',
  'js/boot.js',
  'js/pwa.js',
  'js/calmspace.js',
  'js/herobg.js',
  'js/vendor/three.r134.min.js',
  'js/vendor/vanta.clouds2.min.js',
  'js/vendor/gsap.min.js',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/icon-maskable-512.png',
  'img/apple-touch-icon.png',
  'img/og-banner.png',
  'img/vanta/noise.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Pages: try the network first so edits show up right away; fall back to
  // the cached shell copy when offline. ignoreSearch matters here -- pages
  // like topic.html?id=X vary by query string but the precached shell entry
  // has no query, so matching without it is what makes an offline visit to
  // a *different* topic still get the right page shell (which then shows
  // its own "couldn't load" message) instead of silently landing on Home.
  if (request.mode === 'navigate'){
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }).then(cached => cached || caches.match('index.html')))
    );
    return;
  }

  // Everything else (css/js/img/content): serve from cache if we have it,
  // otherwise fetch and stash a copy for next time (this is how a visited
  // topic's content/<id>.js and images become available offline).
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.ok){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
