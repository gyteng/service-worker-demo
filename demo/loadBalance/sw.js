var ONLINE_CACHE_NAME = '2017-01-04 15:42';
var onlineCacheUrl = [
  '/loadBalance',
  '/loadBalance/',
  '/loadBalance/angular.min.js',
];

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [ONLINE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('delete ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(ONLINE_CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(onlineCacheUrl);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // console.log(event.request);
  if(event.request.url === 'http://localhost:8080/loadBalance/data') {
    var url1 = 'http://localhost:8081/loadBalance/data';
    var url2 = 'http://localhost:8082/loadBalance/data';
    var getData = function () {
      return fetch(url1, {
        mode: 'cors'
      }).then(function(success) {
        if(success.ok) {
          return success;
        }
        return fetch(url2, {
          mode: 'cors'
        });
      }).then(function(success) {
        if(success.ok) {
          return success;
        }
        return new Response('Error');
      });
    };
    event.respondWith(getData());
  } else {
    event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  }
});
