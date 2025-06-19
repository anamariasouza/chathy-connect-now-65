
const CACHE_NAME = 'chathy-v2';
const DOMAIN = 'https://chathy.app';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/bundle.css',
  '/manifest.json',
  '/lovable-uploads/0e775d7a-2c40-49d5-83a9-620db5ffef64.png',
  '/lovable-uploads/6278072d-3af7-4137-a3ab-0b4239621600.png',
  '/lovable-uploads/c3048bc0-d027-4174-b4d7-175e6286480e.png',
  '/lovable-uploads/a3af063e-0a1f-48b2-ab8b-8a97f20b3ea0.png',
  '/lovable-uploads/ad3eed74-11c0-4afc-86c2-ab8ad73056e2.png'
];

// Instalar o service worker
self.addEventListener('install', (event) => {
  console.log('SW: Instalando service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('SW: Erro ao adicionar arquivos ao cache:', error);
      })
  );
  // Força a ativação imediata do novo service worker
  self.skipWaiting();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Apenas interceptar requisições GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Apenas interceptar requisições do nosso domínio ou origem local
  if (event.request.url.startsWith(DOMAIN) || event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Retorna o cache se encontrar
          if (response) {
            console.log('SW: Servindo do cache:', event.request.url);
            return response;
          }
          
          // Senão busca na rede
          console.log('SW: Buscando na rede:', event.request.url);
          return fetch(event.request)
            .then((response) => {
              // Adiciona ao cache se a resposta for válida
              if (response && response.status === 200 && response.type === 'basic') {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return response;
            })
            .catch((error) => {
              console.error('SW: Erro na requisição:', error);
              // Retorna uma resposta offline básica se disponível
              return caches.match('/');
            });
        })
    );
  }
});

// Ativar o service worker
self.addEventListener('activate', (event) => {
  console.log('SW: Ativando service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Força o controle de todas as abas abertas
      return self.clients.claim();
    })
  );
});

// Lidar com mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Adicionar evento para melhorar a detecção de instalabilidade
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('SW: beforeinstallprompt event interceptado');
});
