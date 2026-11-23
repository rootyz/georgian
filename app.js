(() => {
  'use strict';
  const S = Study,
    {
      icon,
      menu,
      games,
      esc,
      idx,
      number,
      gameCard,
      soundButton,
      wordExample,
      title,
      glyphCard
    } = UI;
  const $ = s => document.querySelector(s),
    main = $('#content'),
    dialog = $('#dialog'),
    modal = $('#dialog-content');
  let route = '',
    spotlight = 0,
    session = null,
    search = '',
    filter = 'All',
    audio = null,
    toastTimer, selectedLetter = null,
    installPrompt = null;
  let offlineReady = false,
    priorFocus = null;

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 3600);
  }

  function head() {
    const active = route === 'session' ? 'desk' : route.startsWith('game/') ? 'games' : route;
    $('#navigation').innerHTML = menu.map(([k, label]) => `<a href="#${k}" ${k===active?'aria-current="page"':''}>${icon(k,18)}<span>${label}</span></a>`).join('');
    $('#streak').innerHTML = `${icon('flame',19)} <span>${S.streak()}<span class="streak-words"> day streak</span></span>`;
    $('#streak').setAttribute('aria-label', `${S.streak()} day study streak. View progress.`);
    $('#settings').innerHTML = icon('settings', 20);
  }
  const groups = () => Object.fromEntries(['New', 'Learning', 'Learned'].map(k => [k, ALPHABET.filter(c => S.status(c.glyph) === k).length]));

  function progressBox() {
    const n = groups(),
      total = ALPHABET.length,
      seen = total - n.New,
      p = Math.round(100 * seen / total);
    return `<section class="box progress-box"><div class="box-head"><h2>Alphabet progress</h2>${icon('progress',19)}</div>
    <div class="progress-core"><div class="ring" style="--value:${p}%"><span><strong>${p}<small>%</small></strong><em>explored</em></span></div><div class="progress-text"><strong>${seen} <span>/ 33</span></strong><span>letters studied</span></div></div>
    <div class="legend">${['New','Learning','Learned'].map(k=>`<div><span><i class="status-dot ${k.toLowerCase()}"></i>${k}</span><strong>${n[k]}</strong></div>`).join('')}</div></section>`;
  }

  function spotlightBox() {
    const c = ALPHABET[spotlight];
    return `<section class="box spotlight"><div class="box-head"><h2>Letter spotlight</h2><button class="plain-icon" data-act="shuffle" title="Next spotlight letter" aria-label="Next spotlight letter">${icon('shuffle',17)}</button></div><button class="specimen grid-paper" data-letter="${c.glyph}" aria-label="Explore ${esc(c.name)}"><span class="spec-pos">${number(spotlight+1)} / 33</span><span class="spec-plus">+</span><b lang="ka">${c.glyph}</b><span class="spec-bottom">${c.category}</span></button><div class="spot-foot"><div><strong>${esc(c.name)}</strong><span>/${esc(c.ipa)}/</span></div>${soundButton(c.glyph)}</div></section>`;
  }

  function nextDue() {
    const at = Math.min(...Object.values(S.state.cards).map(c => c.due));
    if (!Number.isFinite(at)) return '';
    if (at <= Date.now()) return 'A review is ready now.';
    const date = new Date(at),
      when = S.day(at) === S.day() ? `at ${date.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}` : `on ${date.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}`;
    return `Next review ${when}.`;
  }

  function hero() {
    const q = S.queue(),
      any = q.all.length > 0;
    return `<section class="hero"><div class="hero-art" aria-hidden="true"></div><div class="hero-body"><span class="kicker">${icon('cards',17)}Spaced repetition</span><h2>Daily flashcards</h2><p>${any?'Learn new letters and bring familiar ones back to mind.':`You’re caught up for now. ${nextDue()}`}</p><div class="hero-counts"><span><i></i>${q.fresh.length} new</span><span><i></i>${q.due.length} due</span></div><a class="hero-start" href="#${any?'session':'alphabet'}">${icon(any?'play':'alphabet',17)}${any?'Start session':'Explore alphabet'}</a></div><span class="location">${icon('pin',13)}Kazbegi, Georgia</span></section>`;
  }

  function desk() {
    const date = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    return `${title('Study desk','Your personal workspace for the Georgian alphabet.',`<span class="date">${icon('cal',17)}${date}</span>`)}
    <div class="desk-grid"><div class="desk-left">${hero()}<section class="arcade-section"><div class="section-head"><h2>Practice arcade</h2><a href="#games" class="text-link">All games</a></div><div class="game-grid">${Object.keys(games).map(gameCard).join('')}</div></section></div>
    <aside>${progressBox()}${spotlightBox()}</aside></div>
    <section class="shelf"><div class="section-head"><h2>Alphabet shelf</h2><a href="#alphabet" class="text-link">Explore all 33</a></div><div class="shelf-grid">${ALPHABET.slice(0,8).map(glyphCard).join('')}</div></section>`;
  }

  function library() {
    return `${title('Alphabet library','Explore the 33 letters of Mkhedruli, the modern Georgian script.')}<div class="library-tools"><label class="search">${icon('search',18)}<input id="search" type="search" placeholder="Search letters, sounds, or words" value="${esc(search)}" aria-label="Search letters, sounds, or example words"></label><div class="segmented" role="group" aria-label="Letter filter">${['All','Vowels','Consonants','Studied'].map(k=>`<button data-filter="${k}" aria-pressed="${filter===k}">${k}</button>`).join('')}</div></div><p class="kicker result-count" id="result-count"></p><div class="library-grid" id="letters"></div>`;
  }

  function libraryResults() {
    const norm = v => v.toLowerCase().replace(/[’ʼ‘]/g, "'").trim();
    const term = norm(search);
    const matches = ALPHABET.filter(c => (filter === 'All' || (filter === 'Studied' ? S.status(c.glyph) !== 'New' : filter === c.category + 's')) && [c.glyph, c.latin, c.name, c.word, c.reading, c.meaning].some(x => norm(x).includes(term)));
    $('#result-count').textContent = `${matches.length} ${matches.length===1?'letter':'letters'}`;
    $('#letters').innerHTML = matches.length ? matches.map(glyphCard).join('') : `<div class="empty"><h3>${filter==='Studied'&&!Object.keys(S.state.cards).length?'Your studied letters will appear here.':'No matching letters.'}</h3><p>${filter==='Studied'?'Rate a flashcard to add it to your studied set.':'Try a different spelling or change the filter.'}</p><button class="secondary" data-act="reset-search">Show all letters</button></div>`;
  }

  function gamesPage() {
    return `${title('Practice arcade','Train letter recognition, spelling, and reading speed.')}<div class="game-grid big-games">${Object.keys(games).map(gameCard).join('')}</div>`;
  }

  function weekly() {
    const days = Array.from({
      length: 7
    }, (_, i) => S.dayOffset(i - 6));
    const vals = days.map(d => (S.state.activity[d]?.reviews || 0) + (S.state.activity[d]?.games || 0));
    const max = Math.max(1, ...vals);
    return `<section class="box week-box"><div class="box-head"><h2>This week</h2><span class="muted">Last 7 days</span></div><div class="week-chart">${days.map((d,i)=>`<div class="day" aria-label="${d}, ${vals[i]} activities"><small>${vals[i]}</small><div class="bar"><i style="height:${Math.max(2,vals[i]/max*100)}%;${vals[i]?'':'background:var(--line)'}"></i></div><span>${new Date(d+'T12:00:00').toLocaleDateString('en',{weekday:'short'})}</span></div>`).join('')}</div><p class="muted">Each card rating and completed game counts once.</p></section>`;
  }

  function progress() {
    const records = Object.values(S.state.activity),
      all = records.reduce((a, r) => a + r.reviews, 0),
      plays = records.reduce((a, r) => a + r.games, 0);
    return `${title('Your progress','See what you’ve studied and when to return.')}<div class="metrics">${[['flame','Day streak',S.streak()],['cards','Card reviews',all],['games','Games played',plays]].map(([i,t,n])=>`<div class="box metric">${icon(i,23)}<strong>${n}</strong><span>${t}</span></div>`).join('')}</div><div class="report-grid">${weekly()}${progressBox()}</div><div class="report-grid"><section class="box padded"><h2>Review schedule</h2><p>${S.queue().due.length} due now. ${nextDue()||'Your first review is scheduled when you rate a card.'}</p><a href="#session" class="text-link">Open daily flashcards</a><hr><p class="muted">A letter counts as learned when its next review is at least 21 days away.</p></section><section class="box padded"><h2>Arcade bests</h2><div class="legend">${Object.entries(games).map(([k,g])=>`<div><span>${icon(g.icon,16)}${g.name}</span><strong>${k in S.state.best?S.state.best[k]:'—'}</strong></div>`).join('')}</div></section></div>`;
  }

  function sessionPage() {
    if (!session) session = {
      queue: S.queue().all,
      index: 0,
      revealed: false,
      again: 0
    };
    const q = session.queue;
    if (session.index >= q.length) {
      const completed = q.length > 0;
      const readable = completed ? ALPHABET.filter(c => [...c.word].every(g => S.state.cards[g]) && [...c.word].some(g => q.includes(g))).slice(0, 3) : [];
      const practice = readable.length ? `<div class="unlocked"><h3>Words you can read</h3><p>Try these aloud, then tap a word to check.</p><div>${readable.map(c=>`<button class="secondary" data-letter="${c.glyph}" lang="ka">${c.word}</button>`).join('')}</div></div>` : '';
      return `<section class="result"><span class="result-symbol">${icon(completed?'check':'time',36)}</span><div class="kicker">Spaced repetition</div><h1>${completed?'Session complete':'All caught up'}</h1><p>${completed?`You practiced ${q.length} ${q.length===1?'letter':'letters'}. `:''}${nextDue()||'Visit your study desk to begin.'}</p>${session.again?`<p>${session.again} ${session.again===1?'letter is':'letters are'} scheduled for another look in about a minute.</p>`:''}${practice}<div class="button-row"><a class="primary" href="#desk">Back to desk</a><a class="secondary" href="#games">Practice a game</a></div></section>`;
    }
    const c = S.byGlyph.get(q[session.index]),
      r = session.revealed,
      status = S.status(c.glyph);
    return `<div class="action-heading"><a class="text-link" href="#desk">${icon('back',16)}Study desk</a><span>Daily flashcards</span></div><section class="question-panel review"><div class="panel-top"><span class="kicker">${icon('cards',17)}Card ${session.index+1} of ${q.length}</span><span class="state"><i class="status-dot ${status.toLowerCase()}"></i>${status}</span></div><div class="session-meter"><i style="width:${100*session.index/q.length}%"></i></div><div class="question-body"><p class="prompt">${r?'Read it aloud, then rate your recall.':'What sound does this letter make?'}</p><div class="flash-letter grid-paper" lang="ka">${c.glyph}</div>${r?`<div class="answer-title"><h2>${esc(c.name)} <span>· ${esc(c.latin)}</span></h2>${soundButton(c.glyph)}</div><div class="answer-meta">${c.category} <i>·</i> /${esc(c.ipa)}/</div><p class="cue">${esc(c.tip)}</p>${wordExample(c)}<fieldset class="ratings"><legend>How well did you remember?</legend>${['again','hard','good','easy'].map((gr,i)=>`<button class="grade ${gr}" data-grade="${gr}" title="Shortcut ${i+1}"><strong>${gr[0].toUpperCase()+gr.slice(1)}</strong><small>${S.delayLabel(S.interval(c.glyph,gr))}</small></button>`).join('')}</fieldset>`:`<button class="primary" data-act="reveal">Reveal answer</button><span class="keyhint">Press <kbd>Space</kbd> to reveal</span>`}</div></section>`;
  }

  function view() {
    if (route === 'desk') main.innerHTML = desk();
    else if (route === 'alphabet') {
      main.innerHTML = library();
      libraryResults();
    } else if (route === 'progress') main.innerHTML = progress();
    else if (route === 'games') main.innerHTML = gamesPage();
    else if (route === 'session') main.innerHTML = sessionPage();
    else main.innerHTML = Arcade.intro(route.split('/')[1]);
    head();
  }

  function updateRoute() {
    const raw = decodeURIComponentSafe(location.hash.slice(1));
    if (raw === 'content') {
      main.focus();
      return;
    }
    const dest = menu.some(([k]) => k === raw) || raw === 'session' || (raw.startsWith('game/') && Object.hasOwn(games, raw.slice(5))) ? raw : 'desk';
    const initial = !route;
    if (dialog.open) dialog.close();
    audio?.pause();
    Arcade.stop();
    session = null;
    route = dest;
    view();
    document.title = `${route.startsWith('game/')?games[route.slice(5)].name:menu.find(k=>k[0]===route)?.[1]||'Daily flashcards'} · Anbani`;
    window.scrollTo(0, 0);
    if (!initial) main.focus({
      preventScroll: true
    });
  }

  function decodeURIComponentSafe(s) {
    try {
      return decodeURIComponent(s);
    } catch {
      return '';
    }
  }

  function play(g) {
    if (!S.byGlyph.has(g)) return;
    audio?.pause();
    audio = new Audio(`./audio/${number(idx(g)+1)}.mp3`);
    audio.play().catch(e => {
      if (e.name !== 'AbortError') toast('Audio could not play. Check the device audio output and try again.');
    });
  }

  function openDialog(markup) {
    if (!dialog.open) priorFocus = document.activeElement;
    modal.innerHTML = markup;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    modal.querySelector('[data-act="close"]')?.focus({
      preventScroll: true
    });
  }
  const closeBtn = `<button class="square" data-act="close" aria-label="Close dialog">${icon('close',18)}</button>`;

  function details(g) {
    const c = S.byGlyph.get(g);
    if (!c) return;
    selectedLetter = g;
    openDialog(`<div class="modal-head"><span class="kicker">Letter ${number(idx(g)+1)} / 33</span>${closeBtn}</div><div class="detail-letter grid-paper" lang="ka">${g}</div><div class="detail-head"><div><h2>${esc(c.name)}</h2><p>${c.category} · ${esc(c.latin)} · /${esc(c.ipa)}/</p></div>${soundButton(g)}</div><p class="cue">${esc(c.tip)}</p>${wordExample(c)}<div class="detail-bottom"><button class="secondary" data-act="trace">${icon('edit',16)}Trace letter</button><div><button class="square" data-shift="-1" aria-label="Previous letter">${icon('back',17)}</button><button class="square" data-shift="1" aria-label="Next letter">${icon('next',17)}</button></div></div>`);
  }

  function trace() {
    const c = S.byGlyph.get(selectedLetter);
    openDialog(`<div class="modal-head"><span class="kicker">Handwriting practice</span>${closeBtn}</div><h2>Trace ${esc(c.name)}</h2><p class="muted">Use your finger, stylus, or mouse to follow the letter.</p><div class="trace-pad grid-paper"><span lang="ka">${c.glyph}</span><canvas id="trace" aria-label="Drawing surface for ${esc(c.name)}"></canvas></div><div class="detail-bottom"><button class="secondary" data-act="detail-back">Letter details</button><button class="soft-btn" data-act="clear">Clear ink</button></div>`);
    const cv = $('#trace'),
      ctx = cv.getContext('2d');
    let pointer = null;
    const rect = cv.getBoundingClientRect(),
      dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(rect.width * dpr);
    cv.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#a93d1e';
    ctx.lineWidth = 7;
    ctx.lineCap = ctx.lineJoin = 'round';
    const point = e => {
      const b = cv.getBoundingClientRect();
      return [(e.clientX - b.left) * rect.width / b.width, (e.clientY - b.top) * rect.height / b.height];
    };
    cv.onpointerdown = e => {
      if (pointer !== null) return;
      pointer = e.pointerId;
      cv.setPointerCapture(pointer);
      ctx.beginPath();
      const [x, y] = point(e);
      ctx.moveTo(x, y);
      ctx.lineTo(x + .05, y);
      ctx.stroke();
    };
    cv.onpointermove = e => {
      if (e.pointerId === pointer) {
        ctx.lineTo(...point(e));
        ctx.stroke();
      }
    };
    cv.onlostpointercapture = () => {
      pointer = null;
    };
  }

  function settings() {
    selectedLetter = null;
    openDialog(`<div class="modal-head"><span class="kicker">Preferences</span>${closeBtn}</div><h2>Study settings</h2><div class="setting-row"><div><label for="goal">New letters per day</label><p>Due reviews are always included.</p></div><select id="goal">${[3,5,8,12].map(n=>`<option value="${n}" ${S.state.goal===n?'selected':''}>${n}</option>`).join('')}</select></div><div class="setting-block"><h3>Progress backup</h3><p>Progress stays in this browser. Export a copy to move it to another device.</p><div class="button-row"><button class="secondary small" data-act="export">${icon('download',16)}Export</button><button class="secondary small" data-act="import">Import backup</button><input hidden type="file" id="backup" accept=".json,application/json"></div></div><div class="setting-block"><h3>Offline & installation</h3><p id="offline-status">${offlineReady?'Offline practice is ready on this device.':'Open the app online over HTTPS and leave it open briefly to save the offline lessons.'}</p>${installPrompt?'<button class="secondary small" data-act="install">Install Anbani</button>':'<p>Use your browser’s install option or Add to Home Screen where available.</p>'}</div><details><summary>About the alphabet & audio</summary><p>Mkhedruli has 33 letters. An apostrophe in the Latin spelling marks an ejective sound. IPA appears between slashes.</p><p>Letter clips come from the <a href="https://github.com/noBloodOnTheLeaves/alphabet_learner" target="_blank" rel="noopener">Alphabet Learner project</a>. <a href="./audio/CREDITS.txt" target="_blank" rel="noopener">Audio credits</a></p></details>`);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(S.state, null, 2)], {
        type: 'application/json'
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = `anbani-progress-${S.day()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importData(file) {
    if (!file) return;
    try {
      if (file.size > 5e6) throw Error();
      const data = JSON.parse(await file.text());
      if (!S.validate(data)) throw Error();
      if (!window.confirm(`Replace progress on this device with the backup containing ${Object.keys(data.cards).length} studied letters?`)) return;
      S.restore(data);
      dialog.close();
      session = null;
      view();
      toast('Progress restored.');
    } catch {
      toast('This file is not a valid Anbani progress backup.');
    }
  }
  document.addEventListener('click', async e => {
    const el = e.target.closest('button, [data-act]');
    if (!el || el.disabled) return;
    if (el.id === 'settings') {
      settings();
      return;
    }
    const ds = el.dataset;
    if (ds.gameAct !== undefined || ds.gameAnswer !== undefined || ds.gameTile !== undefined || ds.gameRemove !== undefined) {
      Arcade.click(el);
      return;
    }
    if (ds.sound) {
      play(ds.sound);
      return;
    }
    if (ds.letter) {
      details(ds.letter);
      return;
    }
    if (ds.shift) {
      details(ALPHABET[(idx(selectedLetter) + Number(ds.shift) + 33) % 33].glyph);
      return;
    }
    if (ds.filter) {
      filter = ds.filter;
      view();
      document.querySelector(`[data-filter="${filter}"]`)?.focus({
        preventScroll: true
      });
      return;
    }
    if (ds.grade && route === 'session' && session?.revealed && session.index < session.queue.length) {
      S.rate(session.queue[session.index], ds.grade);
      if (ds.grade === 'again') session.again++;
      session.index++;
      session.revealed = false;
      view();
      main.focus({
        preventScroll: true
      });
      return;
    }
    switch (ds.act) {
      case 'close':
        dialog.close();
        break;
      case 'shuffle':
        spotlight = (spotlight + 1 + Math.floor(Math.random() * 32)) % 33;
        document.querySelector('.spotlight').outerHTML = spotlightBox();
        document.querySelector('[data-act="shuffle"]').focus({
          preventScroll: true
        });
        break;
      case 'reveal':
        session.revealed = true;
        view();
        main.focus({
          preventScroll: true
        });
        break;
      case 'reset-search':
        search = '';
        filter = 'All';
        view();
        $('#search').focus();
        break;
      case 'detail-back':
        details(selectedLetter);
        break;
      case 'trace':
      case 'clear':
        trace();
        break;
      case 'export':
        exportData();
        break;
      case 'import':
        $('#backup').click();
        break;
      case 'install':
        if (installPrompt) {
          await installPrompt.prompt();
          installPrompt = null;
          settings();
        }
        break;
    }
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'search') {
      search = e.target.value;
      libraryResults();
    }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'goal') {
      S.setGoal(Number(e.target.value));
      if (route === 'desk') view();
      toast('Daily limit updated.');
    }
    if (e.target.id === 'backup') {
      importData(e.target.files[0]);
      e.target.value = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (dialog.open || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.target.matches('input,textarea,select')) return;
    if (route === 'session' && session?.index < session?.queue.length) {
      if (e.code === 'Space' && !session.revealed && !(e.target.closest('a,button') && !e.target.matches('[data-act="reveal"]'))) {
        e.preventDefault();
        $('[data-act="reveal"]')?.click();
      } else if (session.revealed && /^[1-4]$/.test(e.key)) {
        e.preventDefault();
        document.querySelectorAll('[data-grade]')[Number(e.key) - 1]?.click();
      }
    } else if (route.startsWith('game/') && Arcade.shortcut(e.key)) e.preventDefault();
  });
  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    audio?.pause();
    priorFocus?.isConnected ? priorFocus.focus({
      preventScroll: true
    }) : main.focus({
      preventScroll: true
    });
  });
  document.querySelector('.skip').addEventListener('click', event => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView();
  });
  window.addEventListener('hashchange', updateRoute);
  window.addEventListener('anbani-save', () => {
    head();
    if (!S.storageOK) toast('Browser storage is unavailable. Export a backup before closing.');
  });
  window.addEventListener('storage', e => {
    if (e.key === S.key) {
      S.sync();
      if (['desk', 'alphabet', 'progress'].includes(route)) view();
      else head();
    }
  });

  function refreshDesk() {
    if (route === 'desk' && !dialog.open && !document.hidden) {
      const el = document.querySelector('.hero');
      if (el && !el.contains(document.activeElement)) el.outerHTML = hero();
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      S.sync();
      refreshDesk();
      head();
    }
  });
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installPrompt = e;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    toast('Anbani installed.');
  });
  updateRoute();
  setInterval(refreshDesk, 30000);
  if ('serviceWorker' in navigator && ['https:', 'http:'].includes(location.protocol)) {
    navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
      offlineReady = true;
      if ($('#offline-status')) $('#offline-status').textContent = 'Offline practice is ready on this device.';
    }).catch(() => {});
  }
})();
