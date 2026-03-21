const CACHE='facial-v4';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(CACHE).then(cache=>
    cache.match(e.request).then(cached=>{
      const fresh=fetch(e.request).then(res=>{
        if(res&&res.status===200)cache.put(e.request,res.clone());
        return res;
      }).catch(()=>cached);
      return cached||fresh;
    })
  ));
});
