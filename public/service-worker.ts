/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "package-tracker-v1";
const urlsToCache = [
	"/",
	"/index.html",
	"/manifest.json",
	"/success-beep.mp3",
	// Add other static assets here
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache).catch((error) => {
				console.error('Cache addAll failed:', error);
				// Continue with installation even if caching fails
				return [];
			});
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((response) => response || fetch(event.request))
			.catch(() => {
				// Return a fallback response or handle offline case
				if (event.request.mode === 'navigate') {
					return caches.match('/index.html');
				}
				return new Response('Offline');
			})
	);
});

// Handle camera access offline
self.addEventListener("fetch", (event: FetchEvent) => {
	if (event.request.url.includes("getUserMedia")) {
		event.respondWith(
			fetch(event.request).catch(
				() => new Response(JSON.stringify({ error: "Camera not available offline" })),
			),
		);
	}
});
