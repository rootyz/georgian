// Increment the version whenever the bundled app or content changes.
const prefix = `anbani:${self.registration.scope}:`;
const cacheName = `${prefix}1.0.0`;
const files = [
  './index.html', './style.css', './data.js', './study.js', './interface.js', './games.js', './app.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch.png',
  './art/landscape.webp', './art/match.webp', './art/build.webp', './art/sprint.webp', './fonts/georgian.ttf',
  './audio/CREDITS.txt', './audio/LICENSE.txt',
  ...Array.from({
    length: 33
  }, (_, i) => `./audio/${String(i+1).padStart(2,'0')}.mp3`)
];
const indexURL = new URL('./index.html', self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys())
      if (name.startsWith(prefix) && name !== cacheName) await caches.delete(name);
    await self.clients.claim();
  })());
});
async function partial(response, range) {
  const bytes = await response.arrayBuffer(),
    m = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!m || (!m[1] && !m[2])) return new Response(bytes, {
    headers: response.headers
  });
  const start = m[1] ? Number(m[1]) : Math.max(0, bytes.byteLength - Number(m[2]));
  const end = m[1] && m[2] ? Math.min(Number(m[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
  if (start >= bytes.byteLength || start > end) return new Response(null, {
    status: 416,
    headers: {
      'Content-Range': 'bytes *' + '/' + bytes.byteLength
    }
  });
  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${bytes.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}
self.addEventListener('fetch', event => {
  const req = event.request,
    url = new URL(req.url);
  if (req.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const home = new URL('./', self.registration.scope);
    const isHome = req.mode === 'navigate' && (url.pathname === home.pathname || url.pathname === new URL(indexURL).pathname);
    const saved = await cache.match(isHome ? indexURL : req.url, {
      ignoreSearch: true
    });
    if (!saved) return fetch(req);
    const range = req.headers.get('Range');
    return range ? partial(saved, range) : saved;
  })());
});
