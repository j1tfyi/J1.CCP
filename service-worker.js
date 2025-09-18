/* service-worker.js — hash-agnostic, works for / and /bridge/ */

// Bump version each deploy (auto via timestamp)
const SW_VERSION = (self.registration?.scope || "") + ":" + Date.now();
const IMMUTABLE_CACHE = `immutable:${SW_VERSION}`;
const HTML_CACHE = `html:${SW_VERSION}`;
const RUNTIME_CACHE = `runtime:${SW_VERSION}`;

// -------- helpers
function isImmutableAsset(url) {
  // cache-first for hashed static assets from both apps
  return /\/(assets|bridge\/assets)\/.+\.(js|css|woff2?|svg|png|jpg|jpeg|webp|ico)$/.test(url.pathname);
}

function isHtml(url) {
  // app shells
  return url.pathname === "/" || url.pathname === "/bridge/" || url.pathname.endsWith(".html");
}

// -------- lifecycle
self.addEventListener("install", (event) => {
  // no precache list needed; rely on runtime caching
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => !k.endsWith(SW_VERSION)).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// -------- fetch
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Do not intercept the SW itself
  if (url.pathname === "/service-worker.js") return;

  // Cache-first for immutable assets
  if (isImmutableAsset(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(IMMUTABLE_CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    })());
    return;
  }

  // Stale-while-revalidate for HTML shells
  if (isHtml(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(HTML_CACHE);
      const cached = await cache.match(req);
      const network = fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached || new Response("Offline", { status: 503 }));
      return cached ? Promise.race([network, Promise.resolve(cached)]) : network;
    })());
    return;
  }

  // Network-first fallback for everything else
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      return res;
    } catch {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(req);
      return cached || new Response("Offline", { status: 503 });
    }
  })());
});

// Optional: simple push handler
self.addEventListener("push", (event) => {
  const body = event?.data?.text?.() || "New update available";
  event.waitUntil(
    self.registration.showNotification("J1 Cross-Chain Portal", {
      body,
      icon: "/android-chrome-192x192.png",
      badge: "/android-chrome-192x192.png",
    })
  );
});