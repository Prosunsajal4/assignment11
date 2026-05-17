// Service Worker with network-first strategy for HTML pages
const CACHE_NAME = "bookcourier-v2.0.0";
const STATIC_CACHE = "bookcourier-static-v2.0.0";
const DYNAMIC_CACHE = "bookcourier-dynamic-v2.0.0";

// Resources to cache (NO index.html - it should always be fresh)
const STATIC_ASSETS = [
  "/manifest.json",
  "/favicon.ico",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting(),
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim(),
    ])
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // HTML pages: network-first, never cache index.html
  if (request.destination === "document") {
    event.respondWith(networkFirst(request));
    return;
  }

  // JS/CSS assets: cache-first (they have content hashes in filenames)
  if (request.destination === "style" || request.destination === "script") {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images/fonts: cache-first
  if (request.destination === "image" || request.destination === "font") {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // API requests: network-first
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: network-first
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    return new Response("Offline", { status: 503 });
  }
}
