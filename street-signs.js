// Illustrative signs using modern Georgian place names and everyday public vocabulary.
globalThis.SignReader = (() => {
  const {esc, icon, title} = UI;
  const rows = [
    ['ონი', 'Oni', 'road'], ['ვანი', 'Vani', 'road'], ['გორი', 'Gori', 'road'],
    ['ფოთი', 'Poti', 'road'], ['ბათუმი', 'Batumi', 'road'], ['მესტია', 'Mestia', 'road'],
    ['თელავი', 'Telavi', 'road'], ['დმანისი', 'Dmanisi', 'road'], ['სენაკი', 'Senaki', 'road'],
    ['თბილისი', 'Tbilisi', 'road'], ['ქუთაისი', 'Kutaisi', 'road'], ['ბორჯომი', 'Borjomi', 'road'],
    ['ქობულეთი', 'Kobuleti', 'road'], ['მცხეთა', 'Mtskheta', 'road'], ['გურია', 'Guria', 'road'],
    ['გელათი', 'Gelati', 'road'], ['ბიბლიოთეკა', 'Library', 'public'], ['ავტობუსი', 'Bus', 'public'],
    ['მედია', 'Media', 'public'], ['მეტრო', 'Metro', 'public'], ['ტაქსი', 'Taxi', 'public'],
    ['თეატრი', 'Theater', 'public'], ['მუზეუმი', 'Museum', 'public'], ['სადგური', 'Station', 'public'],
    ['გასასვლელი', 'Exit', 'public'], ['ღიაა', 'Open', 'shop'], ['დაკეტილია', 'Closed', 'shop'],
    ['კაფე', 'Café', 'shop'], ['ბანკი', 'Bank', 'shop'], ['აფთიაქი', 'Pharmacy', 'shop'],
    ['მაღაზია', 'Shop', 'shop'], ['სასტუმრო', 'Hotel', 'shop'], ['საცხობი', 'Bakery', 'shop'],
    ['ყავა', 'Coffee', 'shop'], ['პური', 'Bread', 'shop'], ['წყალი', 'Water', 'public']
  ];
  const deck = rows.map(([word, meaning, kind]) => ({
    word, meaning, kind, reading: [...word].map(g => Study.byGlyph.get(g).latin).join('')
  }));
  const starters = new Set(['ონი','გორი','ბანკი','კაფე','მეტრო','ბათუმი']);
  const categories = {road:'Destination sign', public:'Public sign', shop:'Storefront sign'};
  const main = () => document.querySelector('#content');
  let mode = 'studied', round = null;

  function available() {
    if (mode === 'all') return deck;
    if (mode === 'starter') return deck.filter(s => starters.has(s.word));
    return deck.filter(s => [...s.word].every(g => Study.state.cards[g]));
  }

  function settings() {
    const eligible = available();
    const length = Math.min(6, eligible.length);
    let note = mode === 'studied'
      ? `${eligible.length} of ${deck.length} signs use only letters you’ve studied.`
      : `${eligible.length} signs in this set. It can include letters you haven’t studied yet.`;
    if (!length) {
      const missing = deck.map(s => [...new Set([...s.word].filter(g => !Study.state.cards[g]))]).sort((a,b) => a.length - b.length)[0];
      note = `No signs unlocked yet. Study ${missing.join(' · ')} to unlock a sign, or choose Starter signs to play now.`;
    }
    return `${title('Street Sign Reader','Read a sign aloud, then reveal its spelling and meaning.')}
      <div class="game-stage"><div class="stage-art mint"><img src="./art/signs.webp" alt=""></div>
      <div class="stage-body"><h2>Choose your signs</h2>
      <div class="game-settings"><label for="sign-pool">Practice set</label><select id="sign-pool">
      ${[['studied','My studied letters'],['starter','Starter signs'],['all','All signs']].map(([v,label])=>`<option value="${v}" ${mode===v?'selected':''}>${label}</option>`).join('')}</select></div>
      <p class="sign-set-note" role="status">${note}</p><div class="stage-actions">
      ${length ? `<button class="primary" data-game-act="sign-start">${icon('play',17)}Read ${length} ${length===1?'sign':'signs'}</button>` : '<a class="secondary" href="#session">Study letters</a>'}
      <a href="#games" class="text-link">Other games</a></div></div></div>`;
  }

  function intro() { mode = 'studied'; round = null; return settings(); }
  function choose(value) {
    if (round || !['studied','starter','all'].includes(value)) return;
    mode = value;
    main().innerHTML = settings();
    document.querySelector('#sign-pool')?.focus();
  }
  function start(signs) {
    const queue = Study.shuffle(signs).slice(0,6).sort((a,b)=>a.word.length-b.word.length);
    if (!queue.length) { main().innerHTML=settings(); return; }
    round = {queue,index:0,missed:[],revealed:false,done:false};
    render();
  }
  function render() {
    const sign = round.queue[round.index];
    const letters = [...sign.word].map(g => {
      const card = Study.byGlyph.get(g);
      return `<button class="decode-tile" data-sound="${g}" aria-label="Hear ${esc(card.name)}"><strong lang="ka">${g}</strong><small>${esc(card.latin)}</small></button>`;
    }).join('');
    const answer = round.revealed ? `<div class="sign-answer" role="status"><strong>${esc(sign.reading)}</strong>
      <span>${sign.kind==='road'?'Destination · ':''}${esc(sign.meaning)}</span>${wordAudio(sign)}
      <details class="decode"><summary>Read letter by letter</summary><div class="decode-row">${letters}</div></details></div>
      <p>Could you read it before revealing it?</p><div class="button-row">
      <button class="secondary" data-game-act="sign-again">Practice again</button><button class="primary" data-game-act="sign-good">I read it</button></div>` :
      '<p>Read the Georgian aloud.</p><button class="primary" data-game-act="sign-reveal">Reveal reading</button>';
    main().innerHTML = `<div class="action-heading"><a href="#games" class="text-link">${icon('back',16)}Arcade</a><span>Street Sign Reader</span></div>
      <section class="question-panel sign-round"><div class="panel-top"><span class="kicker">Sign ${round.index+1} of ${round.queue.length}</span><span>${categories[sign.kind]}</span></div>
      <div class="question-body"><div class="street-placard sign-${sign.kind}"><b lang="ka">${sign.word}</b>${sign.kind==='road'?'<i aria-hidden="true">➜</i>':''}</div>
      ${answer}</div></section>`;
    main().querySelector(round.revealed?'[data-game-act="sign-good"]':'[data-game-act="sign-reveal"]')?.focus({preventScroll:true});
  }
  function wordAudio(sign) {
    const card = ALPHABET.find(c => c.word === sign.word);
    if (card) return UI.wordSoundButton(card);
    const recording = SIGN_RECORDINGS.find(r => r.word === sign.word);
    if (recording) return `<button class="word-sound" data-sign-sound="${esc(sign.word)}" aria-label="Hear the whole word ${esc(sign.word)}">${icon('sound',16)}Hear word</button>
      <a class="native-sample" href="${esc(recording.source)}" target="_blank" rel="noopener">Recording by ${esc(recording.author)}</a>`;
    const page = SIGN_LISTEN_PAGES[sign.word];
    return page ? `<a class="native-sample" href="${esc(page)}" target="_blank" rel="noopener">Hear a speaker on Forvo ↗</a>` : '';
  }
  function finish() {
    round.done = true;
    const total = round.queue.length, correct = total - round.missed.length;
    Study.gameFinished('signs',correct);
    const missed = round.missed.map(s=>`<li><b lang="ka">${s.word}</b><span>${esc(s.reading)} · ${esc(s.meaning)}</span></li>`).join('');
    main().innerHTML = `<section class="result"><span class="result-symbol">${icon('pin',34)}</span><h1>Signs read</h1>
      <p class="big-score">${correct}<small> / ${total}</small></p><p>Signs you read before revealing the answer.</p>
      ${missed?`<div class="sign-recap"><h2>Practice again</h2><ul>${missed}</ul></div>`:''}
      <div class="button-row">${missed?'<button class="primary" data-game-act="sign-retry">Retry these signs</button>':''}
      <button class="secondary" data-game-act="sign-menu">Choose signs</button><a class="text-link" href="#games">Other games</a></div></section>`;
    main().focus({preventScroll:true});
  }
  function click(act) {
    if (act === 'sign-menu') {round=null;main().innerHTML=settings();return;}
    if (act === 'sign-start' && !round) {start(available());return;}
    if (!round) return;
    if (round.done) {
      if (act === 'sign-retry' && round.missed.length) start(round.missed);
      return;
    }
    if (act === 'sign-reveal' && !round.revealed) {round.revealed=true;render();return;}
    if (!round.revealed || !['sign-again','sign-good'].includes(act)) return;
    if (act === 'sign-again') round.missed.push(round.queue[round.index]);
    round.index++;
    round.revealed=false;
    if (round.index === round.queue.length) finish();
    else render();
  }
  return {intro,choose,click};
})();
