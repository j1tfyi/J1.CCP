const CACHE_NAME = 'j1-cross-chain-portal-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/android-chrome-144x144.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/manifest-icon-192.maskable.png',
  '/manifest-icon-512.maskable.png',
  '/apple-touch-icon.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png',
  '/assets/index-CP0plr9E.js',
  '/assets/index-vUsCpqLf.css'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return Promise.all(
          ASSETS_TO_CACHE.map(url => 
            cache.add(url).catch(error => 
              console.error(`[Service Worker] Failed to cache: ${url}`, error)
            )
          )
        );
      })
      .then(() => console.log('[Service Worker] All assets cached successfully'))
      .catch((error) => {
        console.error('[Service Worker] Caching failed:', error);
      })
  );
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of uncontrolled clients
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Try to cache dynamic responses
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          });
      })
  );
});

// Optional: Push notification handler
self.addEventListener('push', (event) => {
  const title = 'J1 Cross-Chain Portal';
  const options = {
    body: event.data.text(),
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png'
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});