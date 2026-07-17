/*
 * AVISOR DE PARTES - Service Worker
 * Caches all app assets so the iPad PWA works offline after the first load.
 *
 * To force users to pick up a new app version: bump CACHE_VERSION.
 */
const CACHE_VERSION = 'v10';
const CACHE_NAME = 'avisor-de-partes-ios-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './robots.txt',
  './icon-180.png',
  './icon-512.png',
  './assets/app.js',
  './assets/app.css',
  './assets/fondo.jpg',
  './assets/firebase-app-compat.js',
  './assets/firebase-firestore-compat.js'
];

// Install: pre-cache the app shell
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activate: drop old caches when the version changes
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Fetch: cache-first for app assets, network fallback
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        // Cache successful responses for later offline use
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () {
        // If offline and asking for an HTML page, fall back to the shell
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
