// Service Worker — LORE POS
const CACHE = 'lore-pos-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['/logo.png']))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;
  // Solo cachear el logo, todo lo demás va a la red
  if (e.request.url.includes('/logo.png')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
