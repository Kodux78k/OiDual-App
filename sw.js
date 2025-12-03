// sw.js · Service Worker básico pro ./index.html

const CACHE_NAME = 'OiDual-App-v1';

// Arquivos que você quer disponíveis offline
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  self.clients.claim();
});

// Estrategia cache-first simples
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() =>
        caches.match('./index.html')
      );
    })
  );
});
