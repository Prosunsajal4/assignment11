// Modern Service Worker with advanced caching strategies
const CACHE_NAME = "bookcourier-v1.0.0";
const STATIC_CACHE = "bookcourier-static-v1.0.0";
const DYNAMIC_CACHE = "bookcourier-dynamic-v1.0.0";
const API_CACHE = "bookcourier-api-v1.0.0";

// Resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  // Add your main CSS and JS files here when built
];

// API endpoints to cache
const API_ENDPOINTS = [
  "/books",
  "/categories",
  // Add other API endpoints
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
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

// Fetch event - implement different caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (
    url.pathname.startsWith("/api/") ||
    API_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))
  ) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    STATIC_ASSETS.some((asset) => url.pathname === asset) ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Handle HTML pages with network-first strategy
  if (request.destination === "document") {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Default: network-first for everything else
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Cache-first strategy failed:", error);
    // Return offline fallback for images
    if (request.destination === "image") {
      return caches.match("/offline-image.png");
    }
    throw error;
  }
}

// Network-first strategy (for dynamic content)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Network-first strategy failed, trying cache:", error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback for HTML pages
    if (request.destination === "document") {
      return caches.match("/offline.html");
    }

    throw error;
  }
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered");

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  console.log("Performing background sync...");
}

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  const options = {
    body: event.data ? event.data.text() : "New notification from BookCourier!",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Explore Books",
        icon: "/explore-icon.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/close-icon.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("BookCourier", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(self.clients.openWindow("/books"));
  } else {
    event.waitUntil(self.clients.openWindow("/"));
  }
});

// Periodic background tasks (for cache management)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "cache-cleanup") {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];

  for (const cacheName of cacheNames) {
    if (!validCaches.includes(cacheName)) {
      await caches.delete(cacheName);
    }
  }

  // Clean up old entries in dynamic cache
  const dynamicCache = await caches.open(DYNAMIC_CACHE);
  const keys = await dynamicCache.keys();

  for (const request of keys) {
    const response = await dynamicCache.match(request);
    if (response) {
      const date = response.headers.get("date");
      if (date) {
        const responseDate = new Date(date);
        const now = new Date();
        const diffInHours = (now - responseDate) / (1000 * 60 * 60);

        // Remove entries older than 24 hours
        if (diffInHours > 24) {
          await dynamicCache.delete(request);
        }
      }
    }
  }
}
