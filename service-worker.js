const CACHE_NAME = 'j1-cross-chain-portal-v2'; // bump when assets change
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
  // keep your current hashed bundle names here
  '/assets/main-Bd--inSA.js',
  '/assets/main-vUsCpqLf.css'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return Promise.all(
          ASSETS_TO_CACHE.map((url) =>
            cache.add(url).catch((error) =>
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
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Offline SPA fallback for navigations
  const isNavigation =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache a fresh copy of index.html if successful navigation to root
          if (res.ok && new URL(req.url).pathname === '/') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          }
          return res;
        })
        .catch(async () => {
          // Network failed: serve cached shell if present
          const cache = await caches.open(CACHE_NAME);
          const cachedShell = await cache.match('/index.html');
          return cachedShell || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // Don’t intercept the SW file itself
  const path = new URL(req.url).pathname;
  if (path === '/service-worker.js') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Background refresh (best-effort)
        fetch(req).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.ok &&
            new URL(req.url).origin === self.location.origin &&
            (networkResponse.type === 'basic' || networkResponse.type === 'default')
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, networkResponse.clone());
            });
          }
        }).catch(() => {}); // ignore refresh errors offline
        return cached;
      }

      // Otherwise fetch from network and cache same-origin, OK responses
      return fetch(req)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.ok &&
            new URL(req.url).origin === self.location.origin &&
            (networkResponse.type === 'basic' || networkResponse.type === 'default')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // As a minimal fallback for asset requests, try the shell (optional)
          if (path.startsWith('/assets/')) {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Optional: Push notification handler (kept same behavior, with safety)
self.addEventListener('push', (event) => {
  const body = event?.data?.text?.() || 'New update available';
  const title = 'J1 Cross-Chain Portal';
  const options = {
    body,
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
