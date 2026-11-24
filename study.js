(() => {
  'use strict';
  const deck = globalThis.ALPHABET;
  const byGlyph = new Map(deck.map(card => [card.glyph, card]));
  const intros = [..."ამიდენოუსლრვბგზთკპფქღყშჩცძწჭხჯჰჟტ"];
  if (new Set(intros).size !== deck.length) throw Error('Incomplete introduction order');
  const MINUTE = 60000;
  const DAY = 86400000;
  const cueLimits = {shape: 180, sound: 300};
  const key = 'anbani.v1:' + new URL('./', location.href).pathname;
  const blank = () => ({
    version: 1,
    cards: {},
    activity: {},
    best: {},
    mnemonics: {},
    goal: 5
  });
  const day = (value = Date.now()) => {
    const d = new Date(value);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  };
  const dayOffset = n => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return day(d);
  };

  function validate(s) {
    if (!s || s.version !== 1 || ![3, 5, 8, 12].includes(s.goal)) return false;
    if (![s.cards, s.activity, s.best].every(x => x && typeof x === 'object' && !Array.isArray(x))) return false;
    const dateKey = x => /^\d{4}-\d{2}-\d{2}$/.test(x);
    for (const [g, c] of Object.entries(s.cards)) {
      if (!byGlyph.has(g) || !c || !dateKey(c.added) || !Number.isSafeInteger(c.due) || c.due < 0 || !Number.isFinite(c.interval) || c.interval <= 0 || !Number.isSafeInteger(c.reviews) || c.reviews < 1) return false;
    }
    for (const [d, v] of Object.entries(s.activity)) {
      if (!dateKey(d) || !v || ![v.reviews, v.games].every(n => Number.isSafeInteger(n) && n >= 0)) return false;
    }
    if (s.mnemonics !== undefined) {
      if (s.mnemonics === null || typeof s.mnemonics !== 'object' || Array.isArray(s.mnemonics)) return false;
      for (const [g, cue] of Object.entries(s.mnemonics)) {
        if (!byGlyph.has(g) || !cue || typeof cue !== 'object' || Array.isArray(cue)) return false;
        const entries = Object.entries(cue);
        if (!entries.length || entries.some(([field, value]) =>
          !Object.hasOwn(cueLimits, field) || typeof value !== 'string' || !value.trim() || value.length > cueLimits[field])) return false;
      }
    }
    return Object.entries(s.best).every(([k, v]) => ['match', 'build', 'sprint', 'shape', 'missing', 'pairs', 'names', 'signs', 'duel', 'write', 'dictation'].includes(k) && Number.isSafeInteger(v) && v >= 0);
  }
  let storageOK = true;

  function load() {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return blank();
      const s = JSON.parse(raw);
      return validate(s) ? s : blank();
    } catch {
      storageOK = false;
      return blank();
    }
  }
  let state = load();

  function write() {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      storageOK = true;
    } catch {
      storageOK = false;
    }
    window.dispatchEvent(new Event('anbani-save'));
  }

  function sync() {
    if (storageOK) state = load();
  }

  function activity() {
    const today = day();
    return state.activity[today] ||= {
      reviews: 0,
      games: 0
    };
  }

  function status(letter) {
    const c = state.cards[letter];
    return !c ? 'New' : c.interval >= 21 * DAY ? 'Learned' : 'Learning';
  }

  function queue(now = Date.now()) {
    const due = Object.keys(state.cards).filter(g => state.cards[g].due <= now).sort((a, b) => state.cards[a].due - state.cards[b].due);
    const introduced = Object.values(state.cards).filter(c => c.added === day(now)).length;
    const fresh = intros.filter(g => !state.cards[g]).slice(0, Math.max(0, state.goal - introduced));
    return {
      due,
      fresh,
      all: [...due, ...fresh]
    };
  }

  function interval(g, grade) {
    const previous = (state.cards[g]?.interval || 0) / DAY;
    if (grade === 'again') return MINUTE;
    if (grade === 'hard') return previous >= 1 ? Math.max(1, Math.round(previous * 1.2)) * DAY : 10 * MINUTE;
    const multiplier = grade === 'good' ? 2.3 : 3.1,
      floor = grade === 'good' ? 1 : 4;
    return Math.min(365, Math.max(floor, Math.round(previous * multiplier))) * DAY;
  }

  function delayLabel(ms) {
    if (ms < DAY) return `${Math.max(1,Math.ceil(ms/MINUTE))} min`;
    const d = Math.round(ms / DAY);
    return `${d} ${d===1?'day':'days'}`;
  }

  function rate(g, grade, now = Date.now()) {
    sync();
    const old = state.cards[g],
      gap = interval(g, grade);
    state.cards[g] = {
      added: old?.added || day(now),
      due: now + gap,
      interval: gap,
      reviews: (old?.reviews || 0) + 1
    };
    activity().reviews++;
    write();
  }

  function gameFinished(id, score) {
    sync();
    activity().games++;
    state.best[id] = Math.max(state.best[id] || 0, score);
    write();
  }

  function streak() {
    let offset = state.activity[day()] ? 0 : -1,
      days = 0;
    while (state.activity[dayOffset(offset)]?.reviews || state.activity[dayOffset(offset)]?.games) {
      days++;
      offset--;
    }
    return days;
  }
  function letterMnemonic(glyph) {
    const builtIn = MNEMONICS[glyph];
    const custom = state.mnemonics?.[glyph];
    return {
      letterAnchor: custom?.shape ?? builtIn.letterAnchor,
      letterCue: custom?.shape ? '' : builtIn.letterCue,
      soundLink: custom?.sound ?? builtIn.soundLink,
      customShape: Boolean(custom?.shape),
      personal: Boolean(custom)
    };
  }

  function setMnemonic(glyph, shape, sound) {
    if (!byGlyph.has(glyph) || typeof shape !== 'string' || typeof sound !== 'string') return false;
    shape = shape.trim();
    sound = sound.trim();
    if (shape.length > cueLimits.shape || sound.length > cueLimits.sound) return false;
    sync();
    const builtIn = MNEMONICS[glyph], custom = {};
    if (shape && shape !== builtIn.letterAnchor) custom.shape = shape;
    if (sound && sound !== builtIn.soundLink) custom.sound = sound;
    state.mnemonics ||= {};
    if (Object.keys(custom).length) state.mnemonics[glyph] = custom;
    else delete state.mnemonics[glyph];
    write();
    return true;
  }

  function shuffle(values) {
    const a = [...values];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  globalThis.Study = {
    get state() {
      return state;
    },
    get storageOK() {
      return storageOK;
    },
    byGlyph,
    cueLimits,
    letterMnemonic,
    setMnemonic,
    intros,
    day,
    dayOffset,
    queue,
    status,
    interval,
    delayLabel,
    rate,
    gameFinished,
    streak,
    shuffle,
    sync,
    key,
    setGoal(n) {
      if ([3, 5, 8, 12].includes(n)) {
        sync();
        state.goal = n;
        write();
      }
    },
    restore(s) {
      if (!validate(s)) return false;
      state = s;
      write();
      return true;
    },
    validate
  };
})();
