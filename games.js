(() => {
  'use strict';
  const {
    icon,
    games,
    esc,
    title,
    number,
    idx,
    wordSoundButton
  } = UI;
  const {
    byGlyph,
    shuffle
  } = Study;
  const root = () => document.querySelector('#content');
  const introLetters = 'ამიდენოუ';
  const starterWordLetters = [...'დოეხბჩმყ'];
  const similar = ['ბპფ', 'დთტ', 'გკქყ', 'სზშჟ', 'ცწძ', 'ჩჭჯ', 'ღხჰ', 'აიეოუ', 'მნლ', 'ვრ'];
  let run = null,
    gameId = '',
    timer = null,
    poolChoice = 'starter';

  function stop() {
    clearInterval(timer);
    timer = null;
    run = null;
    gameId = '';
  }

  function usesWords() {
    return ['build','missing','pairs'].includes(gameId);
  }

  function intro(id) {
    stop();
    gameId = id;
    poolChoice = 'starter';
    const g = games[id];
    return `${title('Practice arcade','Choose a challenge and put your letters to work.')}<div class="game-stage"><div class="stage-art ${g.color}"><img src="./art/${g.art}.webp" alt=""></div><div class="stage-body"><span class="kicker"><i class="mini-dot ${g.color}"></i>${g.tag}</span><h2>${g.name}</h2>
    <p>${g.instructions || (id==='build'?'Read the Latin spelling and build the Georgian word. Tap tiles in order, then check your answer.':id==='sprint'?'You have 45 seconds to pick the Georgian letter for each sound. Each correct match earns one point.':'Read each Georgian letter and choose its Latin sound. Look closely for apostrophes on ejective sounds.')} </p>
    <div class="game-settings"><label for="pool">Practice set</label><select id="pool"><option value="starter">${usesWords()?'Starter words':'Starter letters'}</option><option value="all">Full alphabet</option>${!usesWords()&&Object.keys(Study.state.cards).length>=4?'<option value="mine">My studied letters</option>':''}</select></div>
    <div class="stage-actions"><button class="primary" data-game-act="start">${icon('play',18)}Start game</button><a class="text-link" href="#games">Other games</a></div></div></div>`;
  }

  function pool() {
    if (poolChoice === 'all') return ALPHABET;
    if (usesWords()) return starterWordLetters.map(glyph => byGlyph.get(glyph));
    return [...(poolChoice === 'mine' ? Object.keys(Study.state.cards) : introLetters)].map(g => byGlyph.get(g));
  }

  function choices(target, options) {
    const candidates = shuffle(options.filter(c => c !== target));
    const confusable = similar.find(group => group.includes(target.glyph));
    const first = candidates.find(c => confusable?.includes(c.glyph));
    return shuffle([target, ...(first ? [first] : []), ...candidates.filter(c => c !== first)].slice(0, 4));
  }

  function start() {
    poolChoice = document.querySelector('#pool')?.value || poolChoice;
    const options = pool();
    run = {
      options,
      bag: [],
      target: null,
      score: 0,
      total: 0,
      limit: gameId === 'build' ? 5 : 8,
      feedback: null,
      selected: null,
      expired: false,
      ended: false,
      deadline: performance.now() + 45000
    };
    if (gameId === 'pairs') {
      const words = shuffle(options).slice(0,4);
      run.board = shuffle(words.flatMap(card => [{card,side:'ka'},{card,side:'en'}]));
      run.open = [];
      run.matched = new Set();
      renderPairs();
      return;
    }
    question();
    if (gameId === 'sprint') timer = setInterval(tick, 200);
  }

  function question() {
    if (!run.bag.length) {
      const last = run.target;
      run.bag = shuffle(run.options);
      if (run.bag.length > 1 && run.bag.at(-1) === last)[run.bag[0], run.bag[run.bag.length - 1]] = [run.bag.at(-1), run.bag[0]];
    }
    run.target = run.bag.pop();
    run.feedback = null;
    run.selected = null;
    run.picks = [];
    run.hint = false;
    run.answer = run.target;
    if (gameId === 'missing') {
      run.blankPosition = Math.floor(Math.random() * run.target.word.length);
      run.answer = byGlyph.get(run.target.word[run.blankPosition]);
      run.choices = choices(run.answer, ALPHABET);
      renderRound();
      return;
    }
    if (gameId === 'build') {
      const word = [...run.target.word],
        more = shuffle(ALPHABET.filter(c => !word.includes(c.glyph))).slice(0, 2).map(c => c.glyph);
      run.tiles = shuffle([...word, ...more]);
    } else run.choices = choices(run.target, run.options);
    renderRound();
  }

  function tick() {
    if (!run || run.ended) return;
    const remaining = Math.max(0, Math.ceil((run.deadline - performance.now()) / 1000));
    const el = document.querySelector('#clock');
    if (el) {
      el.textContent = remaining + 's';
      el.classList.toggle('urgent', remaining <= 10);
    }
    if (!remaining) end();
  }

  function end() {
    if (!run || run.ended) return;
    clearInterval(timer);
    timer = null;
    run.ended = true;
    Study.gameFinished(gameId, run.score);
    const pairs = gameId === 'pairs';
    const denominator = pairs ? 4 : run.total;
    const summary = pairs ? `Pairs found in ${run.total} moves · Personal best ${Study.state.best[gameId]}` :
      run.total === 0 ? 'Time is up. Try another round when you’re ready.' :
      `Correct answers · Personal best ${Study.state.best[gameId]}`;
    root().innerHTML = `<section class="result"><span class="result-symbol">${icon('trophy',34)}</span><div class="kicker">Game complete</div><h1>${games[gameId].name}</h1><p class="big-score">${run.score}<small> / ${denominator}</small></p><p>${summary}</p><div class="button-row"><button class="primary" data-game-act="replay">${icon('repeat',17)}Play again</button><a class="secondary" href="#games">Other games</a></div></section>`;
    root().focus({
      preventScroll: true
    });
  }

  function renderPairs() {
    const showing = run.open.length === 2;
    const tiles = run.board.map(({card,side}, i) => {
      const matched = run.matched.has(card.word), faceUp = matched || run.open.includes(i);
      const value = side === 'ka' ? card.word : card.meaning;
      return `<button class="pair-tile ${faceUp ? 'face-up' : ''} ${matched ? 'matched' : ''}" data-pair-index="${i}"
        ${faceUp || showing ? 'disabled' : ''} aria-label="Card ${i+1}, ${faceUp ? esc(value) : 'face down'}">
        ${faceUp ? `<b lang="${side}">${esc(value)}</b>${matched ? icon('check',14) : ''}` : `<span aria-hidden="true">${icon('cards',22)}</span>`}</button>`;
    }).join('');
    const done = run.score === 4 || run.total === 8;
    let feedback = run.open.length === 1 ? 'Choose a second card.' : 'Choose any face-down card.';
    if (showing) feedback = run.lastMatch ? 'A match! The word and its meaning stay face up.' : 'Different words. Remember their positions for your next move.';
    root().innerHTML = `<div class="action-heading"><a href="#games" class="text-link">${icon('back',16)}Arcade</a><span>Word pairs</span></div>
      <section class="question-panel"><div class="panel-top"><span class="kicker">Move ${Math.min(8,run.total + (showing ? 0 : 1))} of 8</span><span class="round-stat">${run.score} / 4 pairs</span></div>
      <div class="question-body"><h2>Find the four word pairs</h2><div class="pair-board">${tiles}</div><p class="pair-message" role="status">${feedback}</p>
      ${showing && run.lastMatch ? `<div class="matched-audio">${wordSoundButton(run.board[run.open[0]].card)}</div>` : ''}
      ${showing ? `<button class="secondary" data-game-act="pairs-next">${done ? 'See results' : 'Next move'}</button>` : ''}</div></section>`;
    const next = showing ? root().querySelector('[data-game-act="pairs-next"]') : root().querySelector('.pair-tile:not(:disabled)');
    next?.focus({preventScroll:true});
  }

  function flip(index) {
    if (!Number.isInteger(index) || !run.board[index] || run.open.length >= 2 ||
        run.open.includes(index) || run.matched.has(run.board[index].card.word)) return;
    run.open.push(index);
    if (run.open.length === 2) {
      const [a,b] = run.open.map(i => run.board[i]);
      run.lastMatch = a.card === b.card && a.side !== b.side;
      run.total++;
      if (run.lastMatch) { run.matched.add(a.card.word); run.score++; }
    }
    renderPairs();
  }

  function renderRound() {
    const g = games[gameId],
      c = run.target,
      build = gameId === 'build',
      sprint = gameId === 'sprint';
    let play;
    if (build) {
      const slots = [...c.word].map((_, i) => `<button class="slot" ${run.feedback!==null||run.picks[i]===undefined?'disabled':''} data-game-remove="${i}" aria-label="Remove tile ${i+1}"><span lang="ka">${run.picks[i]===undefined?'':run.tiles[run.picks[i]]}</span></button>`).join('');
      const tiles = run.tiles.map((glyph, i) => `<button class="letter-key" data-game-tile="${i}" ${run.feedback!==null||run.picks.includes(i)||run.picks.length>=c.word.length?'disabled':''} lang="ka">${glyph}</button>`).join('');
      play = `<p class="prompt">Build the Georgian word for <b>${esc(c.meaning)}</b>.</p><div class="game-word"><strong class="word-reading">${esc(c.reading)}</strong>${wordSoundButton(c)}</div><div class="slots">${slots}</div><div class="tile-tray">${tiles}</div>${run.feedback===null?`<div class="button-row"><button class="primary" data-game-act="check" ${run.picks.length===c.word.length?'':'disabled'}>Check word</button><button class="soft-btn" data-game-act="hint" ${run.hint?'disabled':''}>${run.hint?'Hint used':'Show hint'}</button></div>${run.hint?`<p class="hint">The first letter is <b lang="ka">${c.glyph}</b> (${esc(c.latin)}).</p>`:''}`:''}`;
    } else {
      const glyphChoices = sprint || gameId === 'shape' || gameId === 'missing';
      const options = run.choices.map((o, i) => `<button class="option ${glyphChoices?'option-glyph':''} ${run.feedback!==null?(o===run.answer?'correct':o===run.selected?'incorrect':''):''}" data-game-answer="${i}" ${run.feedback!==null?'disabled':''}><small>${i+1}</small><b ${glyphChoices?'lang="ka"':''}>${glyphChoices?o.glyph:esc(o.latin)}</b></button>`).join('');
      play = `<p class="prompt">${sprint?'Which Georgian letter makes this sound?':'Which sound does this letter make?'}</p><div class="quiz-glyph" ${sprint?'':'lang="ka"'}>${sprint?esc(c.latin):c.glyph}</div><div class="options">${options}</div>`;
      if (gameId === 'shape') {
        play = `<p class="prompt">Which letter looks like this?</p><h2 class="shape-clue">${esc(MNEMONICS[c.glyph].letterAnchor)}</h2><div class="options">${options}</div>`;
      } else if (gameId === 'missing') {
        const masked = [...c.word].map((g,i)=>i===run.blankPosition?'＿':g).join('');
        play = `<p class="prompt">Which letter completes the word for <strong>${esc(c.meaning)}</strong>?</p><div class="missing-word" lang="ka">${masked}</div><p class="missing-reading">${esc(c.reading)}</p><div class="options">${options}</div>`;
      }
    }
    const fb = run.feedback === null ? '' : `<div class="feedback ${run.feedback?'yes':'no'}" role="status"><span>${icon(run.feedback?'check':'info',19)} ${run.feedback?'Correct!':'Answer'} <b lang="ka">${build || gameId==='missing'?c.word:c.glyph}</b> · ${esc(build || gameId==='missing'?c.reading:c.latin)}</span><button class="secondary small" data-game-act="next">${!sprint&&run.total>=run.limit?'See results':'Next'}</button></div>`;
    root().innerHTML = `<div class="action-heading"><a class="text-link" href="#games">${icon('back',16)} Arcade</a><span>${g.name}</span></div><section class="question-panel"><div class="panel-top"><span class="kicker"><i class="mini-dot ${g.color}"></i>${sprint?'Speed round':`Round ${Math.min(run.limit,run.total+(run.feedback===null?1:0))} of ${run.limit}`}</span><span class="round-stat">${sprint?`${icon('time',16)} <b id="clock">${Math.max(0,Math.ceil((run.deadline-performance.now())/1000))}s</b><i>·</i>`:''} ${run.score} correct</span></div><div class="question-body">${play}${fb}${run.feedback!==null && gameId==='missing' ? `<div class="matched-audio">${wordSoundButton(c)}</div>` : ''}${run.feedback!==null && gameId==='shape' ? `<p class="cue">${esc(MNEMONICS[c.glyph].letterCue)}</p>` : ''}</div></section>`;
  }

  function respond(correct) {
    if (!run || run.feedback !== null || run.ended) return;
    if (gameId === 'sprint' && performance.now() >= run.deadline) {
      end();
      return;
    }
    run.feedback = correct;
    run.total++;
    if (correct) run.score++;
    renderRound();
    document.querySelector('[data-game-act="next"]')?.focus({
      preventScroll: true
    });
  }

  function click(el) {
    const act = el.dataset.gameAct;
    if (act === 'start' || act === 'replay') {
      start();
      return;
    }
    if (!run || run.ended) return;
    if (gameId === 'pairs') {
      if (el.hasAttribute('data-pair-index')) flip(Number(el.dataset.pairIndex));
      else if (act === 'pairs-next' && run.open.length === 2) {
        if (run.score === 4 || run.total === 8) end();
        else {run.open = []; renderPairs();}
      }
      return;
    }
    if (act === 'next') {
      if (run.feedback === null) return;
      if (gameId !== 'sprint' && run.total >= run.limit) end();
      else if (gameId === 'sprint' && performance.now() >= run.deadline) end();
      else question();
    } else if (run.feedback !== null) return;
    else if (el.hasAttribute('data-game-answer')) {
      run.selected = run.choices[Number(el.dataset.gameAnswer)];
      respond(run.selected === run.answer);
    } else if (el.hasAttribute('data-game-tile')) {
      const n = Number(el.dataset.gameTile);
      if (!run.picks.includes(n) && run.picks.length < run.target.word.length) run.picks.push(n);
      renderRound();
    } else if (el.hasAttribute('data-game-remove')) {
      run.picks.splice(Number(el.dataset.gameRemove), 1);
      renderRound();
    } else if (act === 'hint') {
      run.hint = true;
      renderRound();
    } else if (act === 'check' && run.picks.length === run.target.word.length) {
      respond(run.picks.map(i => run.tiles[i]).join('') === run.target.word);
    }
  }

  function shortcut(key) {
    if (!run || run.ended || (gameId === 'build' || gameId === 'pairs') || run.feedback !== null || !['1', '2', '3', '4'].includes(key)) return false;
    document.querySelector(`[data-game-answer="${Number(key)-1}"]`)?.click();
    return true;
  }
  globalThis.Arcade = {
    intro,
    click,
    stop,
    shortcut
  };
})();
