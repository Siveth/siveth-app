import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/Terminos',
  '/Privacidad',
  '/InformacionM',
  '/InformacionP',
  '/InformacionVP',
  
  '/public/src/img/mudanza.jpeg', // ruta img servicios
  '/public/src/img/R.jpeg',
  '/public/src/img/urban.png',

  '/public/src/img/logo.png',
  '/public/src/img/headerB.jpg',

  '/public/src/img/1.png', // Ruta img slider
  '/public/src/img/2.png',
  '/public/src/img/3.png',
  '/public/src/img/4.jpeg',

  '/public/src/img/Guadalajara.jpg', //rutas cards
  '/public/src/img/Monterrey.jpeg',
  '/public/src/img/Queretaro.jpeg',
  '/public/src/img/Tampico.jpeg',
  '/public/src/img/Valles.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  console.log('[Service Worker] Installing Service Worker ...', event);
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  console.log('[Service Worker] Activating Service Worker ....', event);
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

registerRoute(
  ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'assets-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

// Evento de push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'Notificación Push';
  const options = {
    body: data.body,
    icon: data.icon || '/assets/mudanzas.jpeg', // Ícono por defecto
    badge: data.badge || '/assets/mudanzas.jpeg', // Insignia por defecto
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Evento de click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
