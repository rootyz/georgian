(() => {
  'use strict';
  const {esc, icon, games, soundButton, wordSoundButton, title} = UI;
  const {byGlyph, shuffle} = Study;
  const root = () => document.querySelector('#content');

  // Each contrast describes the two glyphs as printed in the bundled font.
  const pairs = [
    ['იო', 'Count the arches', 'One arch leaves one opening underneath.', 'Two arches meet in the middle.'],
    ['მნ', 'Follow the top stroke', 'The top curls over to the left of the right-hand stem.', 'The stem is on the left, with a flat cap pointing right.'],
    ['ას', 'Find the straight stem', 'The stroke above the bowl bends diagonally, like a hook.', 'A tall, straight stroke rises from the left edge of the bowl.'],
    ['ბგ', 'Look above the oval', 'A short bent stalk rises from the top of the oval.', 'A curl like the top of a 2 sits above the lower oval.'],
    ['ევ', 'Follow the right edge', 'The right edge runs straight between the top and bottom bends.', 'The right edge curves inward halfway down, like the waist of a 3.'],
    ['ვკ', 'Look at the upper tip', 'The top curls over and its left tip points down.', 'The upper tip points up and left, above a short middle bar.'],
    ['ხძ', 'Find the tall stroke', 'The tall straight stroke is on the left of the bowl.', 'The tall straight stroke is on the right of the bowl.'],
    ['თდ', 'Find the closed loop', 'The closed loop is on the left. The right arch ends in an open tip.', 'The closed loop is on the right. Two strokes cross underneath on the left.'],
    ['ღლ', 'Count the humps above the tail', 'Two rounded humps sit above the crossing tail.', 'Three rounded humps sit above the crossing tail.'],
    ['ორ', 'Look above the two humps', 'The letter stops at the tops of its two humps.', 'An extra long curve sweeps up and over the two humps.'],
    ['ნწ', 'Look above the bottom loop', 'The top of the left stem turns right into a flat cap.', 'The top has two little humps with a notch between them.'],
    ['ფთ', 'Look below the left loop', 'A long bottom curl sweeps left under the loop.', 'The right arch finishes beside the loop and leaves a gap below.'],
    ['შწ', 'Find the long side of the loop', 'Below the notched top, the straight side of the loop is on the right.', 'Below the notched top, the straight side of the loop is on the left.'],
    ['უჟ', 'Trace the top edge', 'The top makes a rounded dip before joining the right stem.', 'The top edge slopes up to a sharp corner on the right.']
  ].map(([letters, focus, first, second]) => ({letters, focus, clues: [first, second]}));

  let set = 'starter';
  let round = null;

  function available() {
    if (set === 'all') return pairs;
    if (set === 'mine') return pairs.filter(p => [...p.letters].every(g => Study.state.cards[g]));
    return pairs.slice(0, 4);
  }

  function menu() {
    const choices = available(), count = Math.min(4, choices.length) * 2;
    const label = {starter:'Starter pairs', all:'All pairs', mine:'My studied letters'};
    const note = count ? `${choices.length} eligible ${choices.length === 1 ? 'pair' : 'pairs'}. Each letter gets a turn.` :
      'Study both letters of a pair to unlock it here. You can play Starter pairs right away.';
    return `${title(games.duel.name,'Pick the letter you hear and learn to spot the stroke that gives it away.')}
      <section class="game-stage"><div class="stage-art sky"><img src="./art/duel.webp" alt=""></div>
      <div class="stage-body"><h2>Choose your pairs</h2>
      <p>Read the name or play its sound, then choose between two similar letters. Take your time.</p>
      <div class="game-settings"><label for="duel-set">Practice set</label><select id="duel-set">
        ${Object.entries(label).map(([id,name]) => `<option value="${id}" ${set === id ? 'selected' : ''}>${name}</option>`).join('')}
      </select></div><p class="duel-note">${note}</p><div class="stage-actions">
      ${count ? `<button class="primary" data-game-act="duel-start">${icon('play', 17)}Play ${count} questions</button>` : '<a class="primary" href="#session">Study letters</a>'}
      <a class="text-link" href="#games">Other games</a></div></div></section>`;
  }

  function intro() {
    set = 'starter';
    round = null;
    return menu();
  }

  function change(value) {
    if (!['starter', 'all', 'mine'].includes(value)) return;
    set = value;
    root().innerHTML = menu();
    document.querySelector('#duel-set').focus();
  }

  function start(questions, review = false) {
    if (!questions.length) return;
    round = {questions, review, index: 0, score: 0, misses: [], picked: null};
    showQuestion();
  }

  function play() {
    const picked = shuffle(available()).slice(0, 4);
    const first = picked.map(pair => ({pair, target: shuffle([...pair.letters])[0]}));
    const second = shuffle(first).map(({pair, target}) => ({pair, target: [...pair.letters].find(g => g !== target)}));
    if (picked.length > 1 && first.at(-1).pair === second[0].pair) second.push(second.shift());
    start([...first, ...second]);
  }

  function showQuestion() {
    const q = round.questions[round.index];
    round.order = shuffle([...q.pair.letters]);
    round.picked = null;
    render();
    root().querySelector('.duel-prompt').focus({preventScroll: true});
  }

  function render() {
    const {pair, target} = round.questions[round.index];
    const card = byGlyph.get(target), answered = round.picked !== null;
    const tiles = round.order.map((g, i) => {
      const c = byGlyph.get(g);
      const result = !answered ? '' : g === target ? 'correct' : g === round.picked ? 'incorrect' : '';
      return `<div class="duel-column"><button class="option option-glyph duel-tile ${result}" data-game-answer="${i}" ${answered ? 'disabled' : ''}>
        <small aria-hidden="true">${i+1}</small><b lang="ka">${g}</b></button>
        ${answered ? `<div class="duel-letter-label"><strong>${esc(c.name)} · ${esc(c.latin)}</strong>${soundButton(g)}</div>
        <p class="duel-clue">${esc(pair.clues[pair.letters.indexOf(g)])}</p>` : ''}</div>`;
    }).join('');
    const examples = answered ? `<details class="duel-examples"><summary>Hear both letters in words</summary>
      ${round.order.map(g => {const c = byGlyph.get(g); return `<div><span><b lang="ka">${esc(c.word)}</b> · ${esc(c.meaning)}</span>${wordSoundButton(c)}</div>`;}).join('')}</details>` : '';
    const correct = round.picked === target;
    const answer = answered ? `<div class="feedback ${correct ? 'yes' : 'no'}" role="status">
      <span>${icon(correct ? 'check' : 'info',18)} ${correct ? 'Correct.' : 'Look again.'} ${esc(card.name)} is <b lang="ka">${target}</b>.</span>
      <button class="secondary small" data-game-act="duel-next">${round.index+1 === round.questions.length ? 'See results' : 'Next pair'}</button></div>` : '';
    root().innerHTML = `<div class="action-heading"><a class="text-link" href="#games">${icon('back',16)}Arcade</a><span>${games.duel.name}</span></div>
      <section class="question-panel"><div class="panel-top"><span class="kicker">${round.review ? 'Retry' : 'Question'} ${round.index+1} of ${round.questions.length}</span><span class="round-stat">${round.score} correct</span></div>
      <div class="question-body"><p class="prompt">Which letter is this?</p><h2 class="duel-prompt" tabindex="-1">${esc(card.name)} <span>· ${esc(card.latin)}</span></h2>
      <button class="word-sound duel-listen" data-sound="${target}">${icon('sound',16)}Hear letter</button>
      ${answered ? `<h3 class="duel-focus">${esc(pair.focus)}</h3>` : ''}
      <div class="options duel-options">${tiles}</div>${answer}${examples}</div></section>`;
  }

  function finish() {
    const {review, score, questions, misses} = round;
    if (!review) Study.gameFinished('duel', score);
    root().innerHTML = `<section class="result"><span class="result-symbol">${icon('trophy',32)}</span>
      <div class="kicker">${review ? 'Retry complete' : 'Game complete'}</div><h1>${games.duel.name}</h1>
      <p class="big-score">${score}<small> / ${questions.length}</small></p>
      <p>${misses.length ? 'Try the letters you mixed up once more.' : 'You recognized every letter in this round.'}</p>
      <div class="button-row">${misses.length ? `<button class="primary" data-game-act="duel-retry">Retry ${misses.length} missed ${misses.length === 1 ? 'letter' : 'letters'}</button>` : ''}
      <button class="${misses.length ? 'secondary' : 'primary'}" data-game-act="duel-menu">Choose pairs</button><a class="text-link" href="#games">Other games</a></div></section>`;
    root().focus({preventScroll: true});
  }

  function click(el) {
    const act = el.dataset.gameAct;
    if (act === 'duel-menu') { round = null; root().innerHTML = menu(); root().querySelector('#duel-set').focus(); return; }
    if (act === 'duel-start') { play(); return; }
    if (!round) return;
    const q = round.questions[round.index];
    if (!q) {
      if (act === 'duel-retry') start(shuffle(round.misses), true);
      return;
    }
    if (act === 'duel-next' && round.picked !== null) {
      round.index++;
      if (round.index === round.questions.length) finish();
      else showQuestion();
    } else if (round.picked === null && el.hasAttribute('data-game-answer')) {
      const g = round.order[Number(el.dataset.gameAnswer)];
      if (!g) return;
      round.picked = g;
      if (g === q.target) round.score++;
      else round.misses.push(q);
      render();
      root().querySelector('[data-game-act="duel-next"]').focus({preventScroll: true});
    }
  }

  function shortcut(key) {
    if (!round || round.picked !== null || !['1', '2'].includes(key)) return false;
    root().querySelector(`[data-game-answer="${Number(key)-1}"]`)?.click();
    return true;
  }

  globalThis.LookalikeDuel = {intro, change, click, shortcut};
})();
