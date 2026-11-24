globalThis.RecallGames = (() => {
  'use strict';
  const {esc, games, icon, memoryCue, title} = UI;
  const {byGlyph, shuffle} = Study;
  const main = () => document.querySelector('#content');
  const starterLetters = new Set('ამიდენოთ');
  const starterWords = new Set(['დედა','ენა','ორი','ხე','მთა','პური','ყავა','ბათუმი']);
  const batumi = SIGN_RECORDINGS.find(r => r.word === 'ბათუმი');
  const words = [...ALPHABET, {
    word: batumi.word, reading: [...batumi.word].map(g => byGlyph.get(g).latin).join(''),
    meaning: 'Batumi', recording: batumi
  }];
  let game, pool, prompt, round, question, pad;
  const writing = () => game === 'write';
  const act = (name, text, style = 'secondary', disabled = false) =>
    `<button type="button" class="${style}" data-recall-act="${name}" ${disabled ? 'disabled' : ''}>${text}</button>`;
  const focus = selector => main().querySelector(selector)?.focus({preventScroll:true});

  function stop() { round = null; question = null; pad = null; }
  function intro(id) {
    stop();
    game = id;
    pool = 'starter';
    prompt = 'name';
    return menu();
  }
  function available() {
    const deck = writing() ? ALPHABET : words;
    if (pool === 'all') return deck;
    if (pool === 'studied') return deck.filter(c =>
      [...(writing() ? c.glyph : c.word)].every(g => Study.state.cards[g]));
    return deck.filter(c => writing() ? starterLetters.has(c.glyph) : starterWords.has(c.word));
  }
  function select(id, label, choices, selected) {
    return `<div class="game-settings"><label for="${id}">${label}</label><select id="${id}">
      ${choices.map(([value,name]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${name}</option>`).join('')}</select></div>`;
  }
  function menu() {
    const g = games[game], noun = writing() ? 'letter' : 'word', n = Math.min(5, available().length);
    const sets = [['starter','Starter '+noun+'s'],['all', 'All '+noun+'s'],['studied','My studied letters']];
    const settings = select('recall-pool','Practice set',sets,pool) + (writing() ?
      select('recall-prompt','Prompt',[['name','Letter name'],['sound','Sound only']],prompt) : '');
    const note = n ? '' : `<p>Study ${writing() ? 'a letter' : 'all the letters in a word'} to unlock it here, or choose the starter set.</p>`;
    return `${title(g.name, g.desc)}<div class="game-stage"><div class="stage-art ${g.color}"><img src="./art/${g.art}.webp" alt=""></div>
      <section class="stage-body"><h2>${writing() ? 'Choose your letters' : 'Choose your words'}</h2><p>${g.instructions}</p>${settings}${note}
      <div class="stage-actions">${n ? act('start', `${writing() ? 'Draw' : 'Spell'} ${n} ${noun}${n===1?'':'s'}`, 'primary') : '<a class="primary" href="#session">Study letters</a>'}
      <a class="text-link" href="#games">Other games</a></div></section></div>`;
  }
  function change(el) {
    if (round) return;
    if (el.id === 'recall-pool') pool = el.value;
    else if (el.id === 'recall-prompt') prompt = el.value;
    main().innerHTML = menu();
    focus('#'+el.id);
  }
  function start(items, retry, play) {
    if (!items.length) return;
    round = {items, retry, index:0, score:0, misses:[], skipped:0};
    next(play);
  }
  function next(play) {
    if (round.index >= round.items.length) { finish(); return; }
    const item = round.items[round.index];
    question = {item, revealed:false, heard:false, picks:[], tiles:[], audioAttempt:0};
    if (writing()) {
      main().innerHTML = frame(writeBody());
      pad = InkPad.attach(main().querySelector('canvas'), count => {
        for (const k of ['undo','clear']) main().querySelector(`[data-recall-act="${k}"]`).disabled = !count;
      });
      focus('.recall-prompt');
      if (prompt === 'sound') listen(play);
    } else {
      const distractors = shuffle(ALPHABET.filter(c => !item.word.includes(c.glyph) && (pool !== 'studied' || Study.state.cards[c.glyph]))).slice(0,2);
      question.tiles = shuffle([...item.word, ...distractors.map(c => c.glyph)]);
      if (question.tiles.join('').includes(item.word)) {
        // Avoid presenting the complete solution already in order.
        const offset = question.tiles.join('').indexOf(item.word);
        const j = [...item.word].findIndex(g => g !== item.word[0]);
        if (j > 0) [question.tiles[offset], question.tiles[offset+j]] = [question.tiles[offset+j], question.tiles[offset]];
      }
      main().innerHTML = frame(spellBody());
      focus('.recall-prompt');
      listen(play);
    }
  }
  function frame(body) {
    const step = round.index + 1;
    return `<div class="action-heading"><a href="#games" class="text-link">${icon('back',16)}Arcade</a><span>${games[game].name}</span></div>
      <section class="question-panel"><div class="panel-top"><span class="kicker">${round.retry?'Retry':writing()?'Letter':'Word'} ${step} of ${round.items.length}</span>
      <span class="round-stat">${round.score} ${writing()?'recalled':'correct'}</span></div><div class="question-body recall-body">${body}</div></section>`;
  }
  function listenButton() {return act('listen', icon('sound',18)+(writing()?'Hear letter':'Play word'), 'word-sound recall-listen');}
  function writeBody() {
    const c = question.item;
    return `<h2 class="recall-prompt" tabindex="-1">${prompt === 'name' ? `Draw ${esc(c.name)} <span>· ${esc(c.latin)}</span>` : 'Draw the letter you hear'}</h2>${listenButton()}
      <div class="recall-audio-status" role="status"></div><div class="writing-pads"><figure><figcaption>Your writing</figcaption>
      <div class="writing-square grid-paper"><canvas aria-label="Draw your letter here">You can also write on paper.</canvas></div></figure></div>
      <p class="recall-help">Draw with your finger, stylus, or mouse. You can also write on paper.</p>
      <div class="writing-tools">${act('undo','Undo stroke','soft-btn',true)}${act('clear','Clear','soft-btn',true)}</div>
      <div class="write-response">${act('reveal','Compare letter','primary')}</div>`;
  }
  function revealWriting() {
    if (question.revealed) return;
    question.revealed = true;
    pad.lock();
    const c = question.item;
    const pads = main().querySelector('.writing-pads');
    pads.classList.add('comparing');
    pads.insertAdjacentHTML('beforeend', `<figure><figcaption>Printed letter</figcaption><div class="writing-square grid-paper model-letter" lang="ka">${c.glyph}</div></figure>`);
    main().querySelector('.writing-tools').hidden = true;
    main().querySelector('.recall-help').hidden = true;
    main().querySelector('.recall-audio-status').textContent = '';
    main().querySelector('.write-response').innerHTML = `<p><b>${esc(c.name)} · ${esc(c.latin)}</b><br>How closely did your letter match?</p><div class="button-row">
      ${act('again','Practice again')}${act('good','I recalled it','primary')}</div>
      <details class="recall-memory"><summary>Letter mnemonic</summary>${memoryCue(c)}</details>`;
    focus('[data-recall-act="good"]');
  }
  function spellBody() {
    return `<h2 class="recall-prompt" tabindex="-1">Spell the word you hear</h2>${listenButton()}
      <div class="recall-audio-status" role="status"></div><div class="spell-work">${board()}</div>
      <div class="spell-response" aria-live="polite"></div>`;
  }
  function board() {
    const {item, tiles, picks, revealed, heard} = question;
    const slots = [...item.word].map((_,i) => {
      const g = tiles[picks[i]];
      return `<button class="slot" data-slot="${i}" aria-label="${g ? 'Remove '+g+' from position '+(i+1) : 'Empty position '+(i+1)}" ${!g||revealed?'disabled':''}><span lang="ka">${g||''}</span></button>`;
    }).join('');
    const keys = tiles.map((g,i) => `<button class="letter-key" lang="ka" data-letter-tile="${i}" ${!heard||revealed||picks.includes(i)||picks.length===item.word.length?'disabled':''}>${g}</button>`).join('');
    return `<div class="slots" role="group" aria-label="Your spelling">${slots}</div>
      ${revealed?'':`<p class="recall-help">Tap the letters in order. Tap a filled space to remove it.</p>
      <div class="tile-tray" role="group" aria-label="Letter tiles">${keys}</div><div class="button-row">
      ${act('check','Check spelling','primary',!heard || picks.length !== item.word.length)}${act('give-up','Show answer','soft-btn',!heard)}</div>`}`;
  }
  function refreshBoard() { main().querySelector('.spell-work').innerHTML = board(); }
  function tile(el) {
    if (!question || writing() || !question.heard || question.revealed) return;
    const {picks,tiles,item} = question;
    let destination;
    if (el.hasAttribute('data-slot')) {
      const i = Number(el.dataset.slot);
      if (picks[i] === undefined) return;
      destination = `[data-letter-tile="${picks[i]}"]`;
      picks.splice(i,1);
    } else {
      const i = Number(el.dataset.letterTile);
      if (!tiles[i] || picks.includes(i) || picks.length >= item.word.length) return;
      picks.push(i);
      destination = picks.length === item.word.length ? '[data-recall-act="check"]' : '.letter-key:not(:disabled)';
    }
    refreshBoard();
    focus(destination);
  }
  // The prompt and audio controls must not give away a dictation answer.
  async function listen(play) {
    const q = question, attempt = ++q.audioAttempt;
    const status = main().querySelector('.recall-audio-status');
    const url = writing() ? './audio/'+UI.number(UI.idx(q.item.glyph)+1)+'.mp3' :
      './audio/dictation/'+q.item.recording.cardNumber+'.mp3';
    status.textContent = 'Playing…';
    const ok = await play(url);
    if (q !== question || attempt !== q.audioAttempt || !status.isConnected) return;
    if (ok) {
      status.textContent = '';
      if (!q.heard && !writing() && !q.revealed) { q.heard = true; refreshBoard(); }
    } else if (!q.revealed) {
      status.innerHTML = writing() ? `Audio unavailable. Draw ${esc(q.item.name)} · ${esc(q.item.latin)}.` :
        `Recording unavailable. Try Play word again.${!q.heard ? ' '+act('skip','Skip this recording','soft-btn') : ''}`;
    } else status.textContent = 'Recording unavailable. Try again.';
  }
  function check(giveUp) {
    if (question.revealed || !question.heard) return;
    const {item,picks,tiles} = question;
    if (!giveUp && picks.length !== item.word.length) return;
    question.revealed = true;
    const typed = picks.map(i=>tiles[i]).join('');
    const correct = !giveUp && typed === item.word;
    record(correct);
    refreshBoard();
    main().querySelector('.spell-response').innerHTML = `<div class="feedback ${correct?'yes':'no'}"><span>${icon(correct?'check':'info',18)}${correct?'Correct spelling.':'The spelling is shown below.'}</span></div>
      <p class="spell-answer"><b lang="ka">${esc(item.word)}</b><span>${esc(item.reading)} · ${esc(item.meaning)}</span></p>
      ${act('next',round.index+1===round.items.length?'See results':'Next word','primary')}`;
    focus('[data-recall-act="next"]');
  }
  function record(correct) {
    if (correct) round.score++;
    else round.misses.push(question.item);
    main().querySelector('.round-stat').textContent = round.score + (writing()?' recalled':' correct');
  }
  function advance(play) { round.index++; next(play); }
  function finish() {
    question = null; pad = null;
    const total = round.items.length-round.skipped;
    if (!round.retry && total) Study.gameFinished(game, round.score);
    const noun = writing() ? 'letters' : 'words';
    main().innerHTML = `<section class="result"><span class="result-symbol">${icon(writing()?'edit':'sounds',32)}</span>
      <div class="kicker">${round.retry?'Retry complete':'Round complete'}</div><h1>${games[game].name}</h1>
      ${total?`<p class="big-score">${round.score}<small> / ${total}</small></p><p>${writing()?'Letters you recalled from memory.':'Words you spelled correctly.'}</p>`:''}
      ${round.skipped?`<p>${round.skipped} unavailable ${round.skipped===1?'recording was':'recordings were'} skipped.</p>`:''}
      <div class="button-row">${round.misses.length?act('retry','Retry missed '+noun,'primary'):''}${act('menu','Choose '+noun,round.misses.length?'secondary':'primary')}
      <a class="text-link" href="#games">Other games</a></div></section>`;
    main().focus({preventScroll:true});
  }
  function click(el, play) {
    const action = el.dataset.recallAct;
    if (!round) { if (action === 'start') start(shuffle(available()).slice(0,5), false, play); return; }
    if (!question) {
      if (action === 'retry' && round.misses.length) start(shuffle(round.misses),true,play);
      else if (action === 'menu') { stop(); main().innerHTML = menu(); focus('#recall-pool'); }
      return;
    }
    if (action === 'listen') { listen(play); return; }
    if (writing()) {
      if (action === 'clear' || action === 'undo') pad[action]();
      else if (action === 'reveal') revealWriting();
      else if (question.revealed && ['good','again'].includes(action)) { record(action==='good'); advance(play); }
    } else if (!action) tile(el);
    else if (action === 'check' || action === 'give-up') check(action==='give-up');
    else if (action === 'next' && question.revealed) advance(play);
    else if (action === 'skip' && !question.heard && !question.revealed) { round.skipped++; advance(play); }
  }
  return {intro, change, click, stop};
})();
