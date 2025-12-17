/* ============================================
   SERVICE WORKER - OFFLINE CACHING
   Provides offline support and faster loading
   ============================================ */

const CACHE_NAME = 'planhub-v2.0.0';
const CACHE_VERSION = 2;

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/layout.css',
    '/css/components.css',
    '/js/utils.js',
    '/js/store.js',
    '/js/auth.js',
    '/js/ui.js',
    '/js/app.js'
];

// Assets to cache on first use
const LAZY_CACHE_ASSETS = [
    '/js/modules/tests.js',
    '/js/modules/projects.js',
    '/js/pro.js',
    '/js/i18n.js',
    '/js/translations.js'
];

/**
 * Install Event - Cache critical assets
 * Runs when service worker is first installed
 */
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching critical assets');
                return cache.addAll(CRITICAL_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                // Force activation immediately
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

/**
 * Activate Event - Clean up old caches
 * Runs when service worker becomes active
 */
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                // Delete old caches
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

/**
 * Fetch Event - Serve from cache or network
 * Cache-first strategy for assets, network-first for API
 */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip POST requests and API calls
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Return cached response if available
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', request.url);

                    // Update cache in background (stale-while-revalidate)
                    fetch(request)
                        .then(response => {
                            if (response && response.status === 200) {
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(request, response));
                            }
                        })
                        .catch(() => {
                            // Network failed, but we have cache
                        });

                    return cachedResponse;
                }

                // Not in cache, fetch from network
                console.log('[Service Worker] Fetching from network:', request.url);
                return fetch(request)
                    .then(response => {
                        // Don't cache if not successful
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the fetched resource
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                                console.log('[Service Worker] Cached new resource:', request.url);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.error('[Service Worker] Fetch failed:', error);

                        // Return offline page if available
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }

                        throw error;
                    });
            })
    );
});

/**
 * Message Event - Handle messages from main thread
 * Allows clearing cache or updating service worker
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME)
                .then(() => {
                    console.log('[Service Worker] Cache cleared');
                    event.ports[0].postMessage({ success: true });
                })
        );
    }
});

/**
 * Background Sync - Sync data when online
 * Useful for offline form submissions
 */
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // Sync logic here
            Promise.resolve()
        );
    }
});

console.log('[Service Worker] Loaded successfully');
