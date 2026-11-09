/* Business HQ: cross-origin isolation helper for hosts that cannot set headers (GitHub Pages).
   UNTESTED on iPhone. Scope is limited to the folder this file lives in (/Hq/raven/),
   so the live dashboard at /Hq/ is never affected. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
  e.respondWith(
    fetch(r).then(function (res) {
      if (res.status === 0) return res; /* opaque response: cannot be modified */
      var h = new Headers(res.headers);
      h.set('Cross-Origin-Embedder-Policy', 'require-corp');
      h.set('Cross-Origin-Opener-Policy', 'same-origin');
      h.set('Cross-Origin-Resource-Policy', 'cross-origin');
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
    }).catch(function (err) { return new Response('Service worker fetch failed: ' + err, { status: 502 }); })
  );
});
