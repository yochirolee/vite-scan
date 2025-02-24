const CACHE_NAME = "package-tracker-v1";
const urlsToCache = [
	"/",
	"/index.html",
	"/manifest.json",
	"/success-beep.mp3",
	// Add other static assets here
];

self.addEventListener("install", (event: ExtendableEvent) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", (event: FetchEvent) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			// Cache hit - return response
			if (response) {
				return response;
			}
			return fetch(event.request);
		}),
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
