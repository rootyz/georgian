// Increment the version whenever the bundled app or content changes.
importScripts('./recordings.js', './sign-recordings.js', './speaker-audio.js');
const prefix = `anbani:${self.registration.scope}:`;
const cacheName = `${prefix}1.5.0`;
const files = [
  './recordings.js', './speaker-audio.js', './vocabulary.js', './audio/SPEAKERS.txt', './index.html', './style.css', './data.js', './study.js', './interface.js', './mnemonics.js', './sound-guides.js', './sound-lab.js', './games.js', './street-signs.js', './sign-recordings.js', './app.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch.png',
  './art/landscape.webp', './art/match.webp', './art/build.webp', './art/sprint.webp', './art/shape.webp', './art/missing.webp', './art/pairs.webp', './art/names.webp', './art/signs.webp', './fonts/georgian.ttf',
  './audio/CREDITS.txt', './audio/LICENSE.txt', './audio/words/CREDITS.txt',
  ...Array.from({ length: 33 }, (_, index) => {
    const file = String(index + 1).padStart(2, '0') + '.mp3';
    return [`./audio/${file}`, `./audio/words/${file}`];
  }).flat()
];
const indexURL = new URL('./index.html', self.registration.scope).href;
self.addEventListener('install', event => {
  // Get current bytes even when an older release used the same asset URLs.
  const requests = files.map(file => new Request(new URL(file, self.registration.scope), {cache: 'reload'}));
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(requests)));
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
    const voiceRoot = new URL('./speakers/', self.registration.scope);
    if (url.pathname.startsWith(voiceRoot.pathname)) {
      const id = /^(\d+)\.(wav|ogg|mp3)$/.exec(url.pathname.slice(voiceRoot.pathname.length));
      const recording = id && [...RECORDINGS, ...SIGN_RECORDINGS].find(item => item.cardNumber === Number(id[1]));
      if (!recording) return new Response(null, {status: 404});
      try {
        const voice = await SpeakerAudio.load(self.registration.scope, recording, id[2] === 'mp3');
        const range = req.headers.get('Range');
        return range ? partial(voice, range) : voice;
      } catch { return new Response(null, {status: 503}); }
    }
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
