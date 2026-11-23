(() => {
  'use strict';
  const {icon, title, esc, soundButton, wordSoundButton} = UI;
  const lessons = globalThis.SOUND_GUIDES;
  let lesson = lessons[0];
  let quiz = null;
  const rounds = 5;

  function reset(id) {
    lesson = lessons.find(group => group.id === id) || lessons[0];
    quiz = null;
  }

  function cardLink(glyph) {
    const group = lessons.find(g => g.letters.some(letter => letter.glyph === glyph));
    return group ? `<a class="sound-guide-link" href="#sounds/${group.id}">${icon('sounds', 16)}Practice tongue position in Sound lab</a>` : '';
  }

  function compare({glyph, cue}) {
    const card = Study.byGlyph.get(glyph);
    return `<div class="lab-sample">
      <div class="lab-sample-top"><strong lang="ka">${glyph}</strong>${soundButton(glyph)}</div>
      <div class="lab-phoneme"><b>${esc(card.name)}</b> <span>/${esc(card.ipa)}/</span></div>
      <p>${esc(cue)}</p>
      <div class="lab-word"><div><b lang="ka">${card.word}</b><span>${esc(card.meaning)}</span></div>${wordSoundButton(card)}</div>
    </div>`;
  }

  function lessonGlyphs(group) {
    return group.letters.map(letter => letter.glyph).join(' · ');
  }

  function quizBody() {
    if (!quiz) return `<h3>Can you hear the difference?</h3><p>Listen to five sounds and choose the letter you hear.</p>
      <button class="primary" data-lab-act="start">${icon('play',16)}Start listening drill</button>`;
    if (quiz.done) return `<h3>Listening drill complete</h3><p>You identified <strong>${quiz.score} of ${rounds}</strong> sounds correctly.</p>
      <button class="secondary" data-lab-act="start">${icon('repeat',16)}Try again</button>`;
    const choices = lesson.letters.map(({glyph}) => {
      const card = Study.byGlyph.get(glyph);
      const resolved = quiz.answer !== null;
      const state = !resolved ? '' : glyph === quiz.target ? ' correct' : glyph === quiz.answer ? ' incorrect' : '';
      return `<button class="lab-choice${state}" data-lab-pick="${glyph}" ${resolved ? 'disabled' : ''}>
        <b lang="ka">${glyph}</b><span>${esc(card.latin)}</span></button>`;
    }).join('');
    const feedback = quiz.answer === null ? '' : `<div class="lab-feedback" role="status">
      <span>${quiz.answer === quiz.target ? 'Correct.' : 'Listen again.'} You heard <b lang="ka">${quiz.target}</b> /${esc(Study.byGlyph.get(quiz.target).ipa)}/.</span>
      <button class="secondary small" data-lab-act="next">${quiz.index + 1 === rounds ? 'See result' : 'Next sound'}</button></div>`;
    return `<div class="lab-quiz-head"><span class="kicker">Sound ${quiz.index+1} of ${rounds}</span><span>${quiz.score} correct</span></div>
      <h3>Which letter did you hear?</h3><button class="secondary" data-lab-act="replay">${icon('sound',17)}Replay sound</button>
      <div class="lab-choices">${choices}</div>${feedback}`;
  }

  function html() {
    const links = lessons.map(group => `<a href="#sounds/${group.id}" ${group === lesson ? 'aria-current="true"' : ''}>
      <span lang="ka">${lessonGlyphs(group)}</span>${esc(group.title)}</a>`).join('');
    const options = lessons.map(group => `<option value="${group.id}" ${group === lesson ? 'selected' : ''}>${lessonGlyphs(group)} — ${esc(group.title)}</option>`).join('');
    return `${title('Sound lab', 'Practice tongue position, airflow, and the sounds that distinguish Georgian words.')}
      <div class="sound-layout">
        <nav class="sound-list box" aria-label="Sound lessons"><h2>Sound lessons</h2>${links}</nav>
        <div class="sound-select"><label for="sound-lesson">Sound lesson</label><select id="sound-lesson">${options}</select></div>
        <section class="lab-detail"><div class="box lab-overview"><span class="kicker">${icon('sounds',16)} Pronunciation practice</span>
          <h2>${esc(lesson.title)}</h2><p>${esc(lesson.summary)}</p>
          <div class="lab-samples" style="--samples:${lesson.letters.length}">${lesson.letters.map(compare).join('')}</div>
          ${lesson.id === 'soft-palate' ? `<div class="lab-minimal"><h3>Compare the two words</h3><p>Both words end in არი. Listen for the puff or pop at the beginning.</p>${['ქ','კ'].map(g => {
            const example = Study.byGlyph.get(g).originalExample;
            return `<div class="lab-word"><div><b lang="ka">${example.word}</b><span>${esc(example.meaning)}</span></div><a class="native-sample" href="${esc(example.listeningPage)}" target="_blank" rel="noopener">Hear on Forvo ↗</a></div>`;
          }).join('')}</div>` : ''}
          <div class="lab-instructions"><div><h3>Tongue & lips</h3><p>${esc(lesson.placement)}</p></div>
            <div><h3>Breath & throat</h3><p>${esc(lesson.airflow)}</p></div>
            <div><h3>Try it aloud</h3><p>${esc(lesson.practice)}</p></div></div></div>
          <section class="box lab-quiz" id="lab-quiz" tabindex="-1" aria-label="Listening drill">${quizBody()}</section>
          <details class="sound-note"><summary>What makes the popping sound?</summary>
          <p>Georgian distinguishes consonants by how you release the air. The click-like sounds are called <strong>ejectives</strong>. Air held briefly above the vocal folds releases outward. Keep a comfortable pitch as you practice these sounds. An apostrophe in the Latin spelling marks an ejective.</p></details>
        </section>
      </div>`;
  }

  function refresh(focusSelector) {
    const box = document.querySelector('#lab-quiz');
    box.innerHTML = quizBody();
    (box.querySelector(focusSelector) || box).focus({preventScroll:true});
  }

  function startRound(play) {
    quiz.target = quiz.sequence[quiz.index];
    quiz.answer = null;
    refresh('[data-lab-act="replay"]');
    play(quiz.target);
  }

  function click(button, play) {
    const {labAct, labPick} = button.dataset;
    if (labAct === 'start') {
      const options = lesson.letters.map(letter => letter.glyph);
      const sequence = Study.shuffle(Array.from({length: rounds}, (_, i) => options[i % options.length]));
      quiz = {sequence, index:0, score:0, done:false};
      startRound(play);
      return;
    }
    if (!quiz || quiz.done) return;
    if (labAct === 'replay') play(quiz.target);
    if (labPick && quiz.answer === null) {
      quiz.answer = labPick;
      if (labPick === quiz.target) quiz.score++;
      refresh('[data-lab-act="next"]');
    }
    if (labAct === 'next' && quiz.answer !== null) {
      if (++quiz.index === rounds) {
        quiz.done = true;
        refresh('[data-lab-act="start"]');
      } else startRound(play);
    }
  }

  globalThis.SoundLab = {html, click, reset, cardLink, has: id => lessons.some(group => group.id === id)};
})();

