(() => {
  'use strict';
  const {
    icon,
    games,
    esc,
    title,
    number,
    idx
  } = UI;
  const {
    byGlyph,
    shuffle
  } = Study;
  const root = () => document.querySelector('#content');
  const introLetters = 'ამიდენოუ';
  const easierWords = ['ია', 'დედა', 'ორი', 'ენა', 'ცა', 'ხე', 'ჩაი', 'ნავი'];
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

  function intro(id) {
    stop();
    gameId = id;
    poolChoice = 'starter';
    const g = games[id];
    return `${title('Practice arcade','Choose a challenge and put your letters to work.')}<div class="game-stage"><div class="stage-art ${g.color}"><img src="./art/${g.art}.webp" alt=""></div><div class="stage-body"><span class="kicker"><i class="mini-dot ${g.color}"></i>${g.tag}</span><h2>${g.name}</h2>
    <p>${id==='build'?'Read the Latin spelling and build the Georgian word. Tap tiles in order, then check your answer.':id==='sprint'?'You have 45 seconds to pick the Georgian letter for each sound. Each correct match earns one point.':'Read each Georgian letter and choose its Latin sound. Look closely for apostrophes on ejective sounds.'}</p>
    <div class="game-settings"><label for="pool">Practice set</label><select id="pool"><option value="starter">${id==='build'?'Starter words':'Starter letters'}</option><option value="all">Full alphabet</option>${id!=='build'&&Object.keys(Study.state.cards).length>=4?'<option value="mine">My studied letters</option>':''}</select></div>
    <div class="stage-actions"><button class="primary" data-game-act="start">${icon('play',18)}Start game</button><a class="text-link" href="#games">Other games</a></div></div></div>`;
  }

  function pool() {
    if (poolChoice === 'all') return ALPHABET;
    if (gameId === 'build') return easierWords.map(w => ALPHABET.find(c => c.word === w));
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
    root().innerHTML = `<section class="result"><span class="result-symbol">${icon('trophy',34)}</span><div class="kicker">Game complete</div><h1>${games[gameId].name}</h1><p class="big-score">${run.score}<small> / ${run.total}</small></p><p>${run.total===0?'Time is up. Try another round when you’re ready.':`${run.score===1?'Correct answer':'Correct answers'} · Personal best ${Study.state.best[gameId]}`}</p><div class="button-row"><button class="primary" data-game-act="replay">${icon('repeat',17)}Play again</button><a class="secondary" href="#games">Other games</a></div></section>`;
    root().focus({
      preventScroll: true
    });
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
      play = `<p class="prompt">Build the Georgian word for <b>${esc(c.meaning)}</b>.</p><strong class="word-reading">${esc(c.reading)}</strong><div class="slots">${slots}</div><div class="tile-tray">${tiles}</div>${run.feedback===null?`<div class="button-row"><button class="primary" data-game-act="check" ${run.picks.length===c.word.length?'':'disabled'}>Check word</button><button class="soft-btn" data-game-act="hint" ${run.hint?'disabled':''}>${run.hint?'Hint used':'Show hint'}</button></div>${run.hint?`<p class="hint">The first letter is <b lang="ka">${c.glyph}</b> (${esc(c.latin)}).</p>`:''}`:''}`;
    } else {
      const options = run.choices.map((o, i) => `<button class="option ${sprint?'option-glyph':''} ${run.feedback!==null?(o===c?'correct':o===run.selected?'incorrect':''):''}" data-game-answer="${i}" ${run.feedback!==null?'disabled':''}><small>${i+1}</small><b ${sprint?'lang="ka"':''}>${sprint?o.glyph:esc(o.latin)}</b></button>`).join('');
      play = `<p class="prompt">${sprint?'Which Georgian letter makes this sound?':'Which sound does this letter make?'}</p><div class="quiz-glyph" ${sprint?'':'lang="ka"'}>${sprint?esc(c.latin):c.glyph}</div><div class="options">${options}</div>`;
    }
    const fb = run.feedback === null ? '' : `<div class="feedback ${run.feedback?'yes':'no'}" role="status"><span>${icon(run.feedback?'check':'info',19)} ${run.feedback?'Correct!':'Answer'} <b lang="ka">${build?c.word:c.glyph}</b> · ${esc(build?c.reading:c.latin)}</span><button class="secondary small" data-game-act="next">${!sprint&&run.total>=run.limit?'See results':'Next'}</button></div>`;
    root().innerHTML = `<div class="action-heading"><a class="text-link" href="#games">${icon('back',16)} Arcade</a><span>${g.name}</span></div><section class="question-panel"><div class="panel-top"><span class="kicker"><i class="mini-dot ${g.color}"></i>${sprint?'Speed round':`Round ${Math.min(run.limit,run.total+(run.feedback===null?1:0))} of ${run.limit}`}</span><span class="round-stat">${sprint?`${icon('time',16)} <b id="clock">${Math.max(0,Math.ceil((run.deadline-performance.now())/1000))}s</b><i>·</i>`:''} ${run.score} correct</span></div><div class="question-body">${play}${fb}</div></section>`;
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
    if (act === 'next') {
      if (run.feedback === null) return;
      if (gameId !== 'sprint' && run.total >= run.limit) end();
      else if (gameId === 'sprint' && performance.now() >= run.deadline) end();
      else question();
    } else if (run.feedback !== null) return;
    else if (el.hasAttribute('data-game-answer')) {
      run.selected = run.choices[Number(el.dataset.gameAnswer)];
      respond(run.selected === run.target);
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
    if (!run || run.ended || gameId === 'build' || run.feedback !== null || !['1', '2', '3', '4'].includes(key)) return false;
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
