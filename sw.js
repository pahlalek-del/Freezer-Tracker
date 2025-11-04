self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('fryser-sync-cf-v1').then((cache) => cache.addAll([
      './','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== 'fryser-sync-cf-v1' ? caches.delete(k) : null))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});