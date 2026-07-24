/* ==========================================================================
   Registers the service worker (see service-worker.js) so the site can be
   installed to a home screen and opened offline after a first visit.
   No-ops safely on file:// or any context without service worker support.
   ========================================================================== */

if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => { /* offline support unavailable, app still works online */ });
  });
}
