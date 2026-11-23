// Shared by the page and its service worker. Keep recorded speech across app updates.
globalThis.SpeakerAudio = (() => {
  function sources(recording, mp3First) {
    const original = recording.url;
    if (!original.endsWith('.ogg')) return [original];
    const filename = original.slice(original.lastIndexOf('/') + 1);
    const mp3 = original.replace('/commons/', '/commons/transcoded/') + '/' + filename + '.mp3';
    return mp3First ? [mp3, original] : [original, mp3];
  }
  function prefersMP3() {
    const probe = new Audio();
    if (typeof probe.canPlayType !== 'function') return false;
    return !probe.canPlayType('audio/ogg; codecs="vorbis"');
  }
  function relativePath(recording, mp3First) {
    const ext = recording.url.endsWith('.wav') ? 'wav' : mp3First ? 'mp3' : 'ogg';
    return './speakers/' + recording.cardNumber + '.' + ext;
  }
  function urlFor(recording) {
    const mp3First = prefersMP3();
    return navigator.serviceWorker?.controller
      ? relativePath(recording, mp3First)
      : sources(recording, mp3First)[0];
  }
  function cacheKey(scope, recording, mp3First) {
    return new URL(relativePath(recording, mp3First), scope).href;
  }
  const cacheName = scope => 'anbani-speakers-v1:' + scope;
  async function load(scope, recording, mp3First) {
    const key = cacheKey(scope, recording, mp3First);
    const cache = await caches.open(cacheName(scope));
    const cached = await cache.match(key);
    if (cached) return cached;
    for (const url of sources(recording, mp3First)) {
      try {
        const response = await fetch(url, {mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer'});
        if (!response.ok) continue;
        const bytes = await response.arrayBuffer();
        const head = Array.from(new Uint8Array(bytes, 0, Math.min(4, bytes.byteLength)));
        const tag = String.fromCharCode(...head);
        const type = tag === 'OggS' ? 'audio/ogg' : tag === 'RIFF' ? 'audio/wav' :
          tag.startsWith('ID3') || (head[0] === 255 && (head[1] & 224) === 224) ? 'audio/mpeg' : null;
        // An MP3-only player needs a compatible file even if an Ogg original exists.
        if (!type || bytes.byteLength < 64 || (mp3First && type === 'audio/ogg')) continue;
        const clean = new Response(bytes, {headers: {'Content-Type': type, 'Content-Length': String(bytes.byteLength), 'Accept-Ranges': 'bytes'}});
        try { await cache.put(key, clean.clone()); } catch { /* Streaming still works at the storage limit. */ }
        return clean;
      } catch { /* Try the alternate encoding. */ }
    }
    throw new Error('The speaker recording is unavailable.');
  }
  async function count(scope, mp3First) {
    const cache = await caches.open(cacheName(scope));
    const stored = await Promise.all(RECORDINGS.map(r => cache.match(cacheKey(scope, r, mp3First))));
    return stored.filter(Boolean).length;
  }
  async function saveAll(scope, progress) {
    const format = prefersMP3();
    let finished = 0;
    const queue = [...RECORDINGS];
    async function saveNext() {
      while (queue.length) {
        try { await load(scope, queue.shift(), format); } catch { /* Saved clips remain available for a retry. */ }
        progress(++finished);
      }
    }
    await Promise.all([saveNext(), saveNext(), saveNext()]);
    return count(scope, format);
  }
  return {urlFor, sources, prefersMP3, cacheName, load, count, saveAll};
})();
