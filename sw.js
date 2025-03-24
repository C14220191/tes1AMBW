const CACHE_NAME = "pwa-blog-cache-v1";
const API_CACHE_NAME = "api-cache";
const OFFLINE_URL = "/offline.html";
const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/styles.css",
    "/app.js",
    "/offline.html",
    "/manifest.json",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(
                PRECACHE_ASSETS.map(url =>
                    fetch(url)
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                            return cache.put(url, response);
                        })
                        .catch(err => console.error(`Cache failed for ${url}:`, err))
                )
            );
        })
    );
});


self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME && name !== API_CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.pathname === "/about.html") {
        event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
        return;
    }

    if (url.origin === "https://jsonplaceholder.typicode.com/posts") {
        event.respondWith(
            fetch(request)
                .then(response => {
                    return caches.open(API_CACHE_NAME).then(cache => {
                        cache.put(request, response.clone());
                        return response;
                    });
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    event.respondWith(
        fetch(request)
            .then(response => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, response.clone());
                    return response;
                });
            })
            .catch(() => caches.match(request).then(response => response || caches.match(OFFLINE_URL)))
    );
});
