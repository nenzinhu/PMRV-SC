const CACHE_NAME = 'pmrv-4em1-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/inlined.css',
  './css/style.css',
  './js/core.js',
  './js/assuncao.js',
  './js/envolvidos.js',
  './js/pmrv.js',
  './js/danos.js',
  './js/relatorio.js',
  './icon-192.png',
  './icon-512.png',
  './icon.png',
  './relatorio.png',
  './AJUDA.png',
  './service_worker.js',
  './img/extracted_1.png',
  './img/extracted_2.png',
  './img/extracted_3.png',
  './img/extracted_4.png',
  './img/extracted_5.png',
  './img/extracted_8.png',
  './img/extracted_9.png',
  './img/extracted_10.png',
  './img/extracted_11.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(name => (name !== CACHE_NAME ? caches.delete(name) : Promise.resolve()))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
