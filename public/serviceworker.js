const CACHE_NAME = 'nofeeding-0.4.1'
const contentToCache = ['/index.html', '/static/', '/images/']

const self = this

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
            console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(contentToCache);
      })
    );
})

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(CACHE_NAME).then(function (cache) {
                  if(/\/static|\/files\/fabric\/assets/.test( e.request.url)){
                      console.log('[Service Worker] Caching new resource: ' + e.request.url);
                      cache.put(e.request, response.clone());
                    }
                    return response;
                });
            });
        })
    );
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if(CACHE_NAME.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
      })
    );
  });