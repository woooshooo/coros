// Service Worker Cache Name
const CACHE_NAME = 'run-stats-v1';

// Files to cache for offline use (URLs for CDNs used in index.html)
const urlsToCache = [
    './index.html',
    './manifest.json',
    // --- Critical CDN Resources ---
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    // NOTE: You will need to add paths for your actual icon files (e.g., /android-chrome-192x192.png) here.
];

// 1. Install Event: Caches required files on first install
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing and Caching App Shell');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch Event: Intercepts network requests and serves from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // No cache hit - fetch from network
        return fetch(event.request);
      })
  );
});

// 3. Activate Event: Cleans up old caches if the version name changes
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
