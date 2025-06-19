
const CACHE_NAME = 'chathy-v1';
const DOMAIN = 'https://chathy.app';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/bundle.css',
  '/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png',
  '/lovable-uploads/6278072d-3af7-4137-a3ab-0b4239621600.png',
  '/lovable-uploads/c3048bc0-d027-4174-b4d7-175e6286480e.png',
  '/lovable-uploads/a3af063e-0a1f-48b2-ab8b-8a97f20b3ea0.png'
];

// Instalar o service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Apenas interceptar requisições do nosso domínio
  if (event.request.url.startsWith(DOMAIN) || event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Retorna o cache se encontrar, senão busca na rede
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});

// Ativar o service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Lidar com mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
