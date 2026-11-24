const V='english-v18';
const FILES=['./','./index.html','./words.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
// cache:'reload' / 'no-cache' bypass the browser's HTTP cache, so a new version is picked up on the next launch
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request,{cache:'no-cache'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r})
      .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html')))
  );
});
