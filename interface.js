(() => {
  const paths = {
    sounds: '<path d="M3 10v4m4-8v12m5-16v20m5-16v12m4-8v4"/>',
    desk: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m0-10h12"/>',
    alphabet: '<path d="M4 5h5c2 0 3 1 3 2 0-1 1-2 3-2h5v14h-5c-1.5 0-2 .4-3 1.5-1-1.1-1.5-1.5-3-1.5H4zM12 7v13"/>',
    games: '<path d="M7.5 7.5a4 4 0 0 0-4 3.2l-1.2 5.7c-.6 2.6 2 3.9 3.7 2.1l2.5-2.6h7l2.5 2.6c1.7 1.8 4.3.5 3.7-2.1l-1.2-5.7a4 4 0 0 0-4-3.2zM7.5 10v4.5m-2.2-2.2h4.4m5.9-.9h.1m2 2h.1"/>',
    progress: '<path d="M4 19h16M6 15v-4m6 4V5m6 10V8"/>',
    flame: '<path d="M13 2.8c.4 4.6-3.5 5-2.6 8.5 1.1-.4 2.1-1.5 2.4-3.2 3 2.3 5.3 4.6 5.3 7.4a6.2 6.2 0 0 1-12.4 0c0-3.4 2.1-5.2 4-7.9.1 1.8.5 2.1.6 2.2C9.9 6.9 11.8 5.6 13 2.8z"/>',
    settings: '<path d="m9.7 3-.6 2.3-1.8 1-2.2-.6-2.2 3.8 1.6 1.7v1.7l-1.6 1.7 2.2 3.8 2.2-.6 1.8 1 .6 2.2h4.5l.7-2.2 1.7-1 2.3.6 2.1-3.8-1.6-1.7v-1.7l1.6-1.7-2.1-3.8-2.3.6-1.7-1-.7-2.3z"/><circle cx="12" cy="12" r="3"/>',
    cal: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4m9-4v4m-13 3.5h17m-13 4h2m3 0h2"/>',
    cards: '<path d="M4 15 2.6 6.9a1.5 1.5 0 0 1 1.2-1.7l11-1.9"/><rect x="6" y="7" width="15" height="13" rx="2"/>',
    play: '<path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
    time: '<circle cx="12" cy="12" r="8.7"/><path d="M12 6.5v6l3.8 2.1"/>',
    star: '<path d="m12 2 2.4 6.8L21 11l-6.6 2.2L12 21l-2.4-7.8L3 11l6.6-2.2z"/>',
    sound: '<path d="m11 5-5 4H3v6h3l5 4zM15 8c2.4 2.5 2.4 5.5 0 8m3.5-10.5a9.3 9.3 0 0 1 0 13"/>',
    shuffle: '<path d="M3 6h2.5c5.8 0 6.1 12 12.3 12H21m-3-3 3 3-3 3M3 18h2.5c2.3 0 4-2.2 5.1-4.5M13 9c1.2-2 2.4-3 4.8-3H21m-3-3 3 3-3 3"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    edit: '<path d="m4 17 1.4-4.5L16.2 2l4 4L9.5 16.6 4 18zM14 4.5l4 4M4 21h15"/>',
    back: '<path d="m14.5 5-7 7 7 7"/>',
    next: '<path d="m9.5 5 7 7-7 7"/>',
    trophy: '<path d="M7 4h10v5c0 3-2 5.2-5 5.2S7 12 7 9zM7 6H3v2c0 3 2 4 5 4m9-6h4v2c0 3-2 4-5 4m-4 3v4m-4 1h8"/>',
    bolt: '<path d="m14 2-10 12h7l-1 8 10-13h-7z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
    tiles: '<rect x="3" y="7" width="8" height="11" rx="1.4"/><rect x="13" y="5" width="8" height="11" rx="1.4"/>',
    pin: '<path d="M18.5 9A6.5 6.5 0 1 0 5.5 9c0 4.4 6.5 11 6.5 11s6.5-6.6 6.5-11z"/><circle cx="12" cy="9" r="2"/>',
    leaf: '<path d="M4 19c.5-7 3-11 13-13m2-2c1 8-2 15-10 14L5 17c-1-8 4-13 14-13z"/>',
    repeat: '<path d="M4 11a8 8 0 1 1 .8 5M4 4v7h7"/>',
    download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>'
  };
  const icon = (key, size = 20) => `<svg class="icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[key]||''}</svg>`;
  const menu = [['desk', 'Study desk'], ['alphabet', 'Alphabet'], ['sounds', 'Sound lab'], ['games', 'Games'], ['progress', 'Progress']];
  const games = {
    match: {
      name: 'Letter match',
      desc: 'Pair a Georgian letter with its sound.',
      icon: 'grid',
      tag: 'Recognition',
      art: 'match',
      color: 'mint'
    },
    build: {
      name: 'Word builder',
      desc: 'Spell real words with letter tiles.',
      icon: 'tiles',
      tag: 'Spelling',
      art: 'build',
      color: 'lilac'
    },
    sprint: {
      name: 'Speed round',
      desc: 'Race the clock to recognize letters.',
      icon: 'bolt',
      tag: 'Timed',
      art: 'sprint',
      color: 'gold'
    }
  };
  const emoji = ['🍑', '🍒', '❤️', '👩', '👅', '🍎', '🔔', '🍯', '🪻', '🚪', '🦁', '🏔️', '⛵', '✌️', '🍞', '🫐', '🗺️', '🏠', '🏞️', '🏘️', '🪙', '🌬️', '🌙', '☕', '⚫', '🍵', '☁️', '🐕', '💧', '🥛', '🌳', '🫙', '💨'];
  emoji[15] = ''; // Raspberries have no dedicated emoji.
  const esc = value => String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  } [c]));
  const idx = g => ALPHABET.findIndex(c => c.glyph === g);
  const number = n => String(n).padStart(2, '0');
  const gameCard = id => {
    const g = games[id];
    return `<a class="game-tile" href="#game/${id}"><div class="game-art ${g.color}"><img src="./art/${g.art}.webp" alt="" width="720" height="290"></div><div class="game-copy"><span class="kicker"><i class="mini-dot ${g.color}"></i>${g.tag}</span><h3>${g.name}</h3><p>${g.desc}</p></div></a>`;
  };
  const soundButton = g => `<button class="sound square" data-sound="${g}" aria-label="Hear ${esc(Study.byGlyph.get(g).name)} pronounced" title="Hear letter pronunciation">${icon('sound',18)}</button>`;

  function wordSoundButton(card) {
    return `<button type="button" class="word-sound" data-word-sound="${card.glyph}" aria-label="Hear the whole word ${esc(card.word)}, ${esc(card.meaning)}">${icon('sound', 16)}Hear word</button>`;
  }

  function memoryCue(card, hint = false) {
    const cue = MNEMONICS[card.glyph];
    const picture = mnemonicPicture(card.glyph);
    const scene = `<div class="memory-scene">${picture}<div><h3>${esc(cue.anchor)}</h3><p>${esc(cue.story)}</p></div></div>`;
    if (hint) return `<details class="memory-hint"><summary>Show a memory hint</summary>${scene}</details>`;
    return `<section class="memory-cue"><span class="kicker">${icon('star', 13)} Memory cue</span>${scene}</section>`;
  }

  function wordExample(c) {
    const tiles = [...c.word].map(glyph => {
      const letter = Study.byGlyph.get(glyph);
      return `<button class="decode-tile" data-sound="${glyph}" title="Hear ${esc(letter.name)}" aria-label="Hear ${esc(letter.name)}, ${esc(letter.latin)}"><strong lang="ka">${glyph}</strong><small>${esc(letter.latin)}</small></button>`;
    }).join('');
    const nativeLink = c.word === 'მთა' ? '<a class="native-sample" href="https://commons.wikimedia.org/wiki/File:Ka-მთა-Nicodene-mom.ogg" target="_blank" rel="noopener">Native speaker on Wikimedia</a>' : '';
    return `<div class="example"><span class="example-img" aria-hidden="true">${emoji[idx(c.glyph)]||icon('alphabet',30)}</span><div><span class="kicker">Example word</span><div class="example-word"><strong lang="ka"><b>${c.word[0]}</b>${c.word.slice(1)}</strong>${wordSoundButton(c)}</div><span class="example-trans">${esc(c.reading)} <i>·</i> ${esc(c.meaning)}</span><details class="decode"><summary>Read letter by letter</summary><div class="decode-row">${tiles}</div></details>${nativeLink}</div></div>`;
  }
  const title = (heading, sub, side = '') => `<div class="page-title"><div><h1>${heading}</h1><p>${sub}</p></div>${side}</div>`;
  const glyphCard = c => `<button class="glyph-tile" data-letter="${c.glyph}" aria-label="Explore ${esc(c.name)}, ${esc(c.latin)}"><span class="tile-top"><small>${number(idx(c.glyph)+1)}</small><i class="status-dot ${Study.status(c.glyph).toLowerCase()}" title="${Study.status(c.glyph)}"></i></span><b lang="ka">${c.glyph}</b><span>${esc(c.latin)}</span></button>`;
  globalThis.UI = {
    icon,
    menu,
    games,
    emoji,
    esc,
    idx,
    number,
    gameCard,
    soundButton,
    wordExample,
    wordSoundButton,
    memoryCue,
    title,
    glyphCard
  };
})();
