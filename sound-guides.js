// Contrast sets follow Shosted & Chikovani, Standard Georgian (2006).
// Every drill uses letters and example words already in the alphabet deck.
globalThis.SOUND_GUIDES = [
  {
    id: 'lips',
    title: 'Two ways to release p',
    summary: 'Your lips do the same job in both sounds. Listen for a puff or a short pop.',
    letters: [
      { glyph: 'ფ', cue: 'Airy p, like the first sound in “pie”.' },
      { glyph: 'პ', cue: 'Ejective p’. Your lips open with a small pop.' }
    ],
    placement: 'Close both lips gently. Let your tongue rest low and keep your jaw loose.',
    airflow: 'For ფ, open your lips on an easy breath. For პ, briefly catch your breath, as in the middle of “uh-oh”. Part your lips while the catch is still there, then let the vowel begin.',
    practice: 'Hold your palm near your mouth. Say ფუ, then პუ. Feel which one sends more breath toward your hand. Try the same beginnings in ფუტკარი (bee) and პური (bread).'
  },
  {
    id: 'teeth',
    title: 'Two ways to release t',
    summary: 'Stay near your upper front teeth as you change how the air comes out.',
    letters: [
      { glyph: 'თ', cue: 'Airy t, like the t at the start of “top”.' },
      { glyph: 'ტ', cue: 'Ejective t’. The tongue lifts away with a crisp release.' }
    ],
    placement: 'Touch the tip or blade of your tongue to the backs of your upper front teeth. Keep your lips apart.',
    airflow: 'For თ, release your tongue with a little breath. For ტ, catch your breath briefly while your tongue is touching your teeth. Release your tongue first, then start the vowel.',
    practice: 'Alternate თა and ტა with a hand in front of your lips. Then try მთა (mountain) in one syllable. Start with closed lips for მ and have your tongue ready for თ as your lips part.'
  },
  {
    id: 'soft-palate',
    title: 'Wind or door?',
    summary: 'ქარი means wind. კარი means door. The first consonant changes the word.',
    letters: [
      { glyph: 'ქ', cue: 'Airy k, as at the start of “kite”.' },
      { glyph: 'კ', cue: 'Ejective k’. Listen for the brief catch at the release.' }
    ],
    placement: 'Leave the tongue tip low. Lift the back of your tongue against the soft part of the roof of your mouth, just as you would for English k.',
    airflow: 'For ქ, let a puff follow the release. For კ, briefly close your vocal folds as if beginning “uh-oh”. Release the back of the tongue, then open into the vowel.',
    practice: 'Play ქარი and კარი. Repeat them with the same ending, არი. Change only the way you start.'
  },
  {
    id: 'ts',
    title: 'The ts family',
    summary: 'Move the ending of English “cats” to the beginning of a syllable.',
    letters: [
      { glyph: 'ც', cue: 'Airy ts. A brief closure opens into a hiss.' },
      { glyph: 'წ', cue: 'Ejective ts’. The hiss begins with a tight, short release.' },
      { glyph: 'ძ', cue: 'Voiced dz, like the ending of “adds”.' }
    ],
    placement: 'Touch the ridge just behind your upper teeth with the front of your tongue. Ease the closure into a narrow groove for s. The tongue makes one continuous movement.',
    airflow: 'Use breath for ც. For წ, add a momentary catch in your throat as the hiss begins. For ძ, let your voice buzz through the release.',
    practice: 'Say the ending of “cats”, then attach ah to make ცა (sky). Keep that single ts movement as you try წა, then add voice for ძა.'
  },
  {
    id: 'ch',
    title: 'The ch family',
    summary: 'Use the tongue shape for “sh” as you listen for breath, a pop, or voice.',
    letters: [
      { glyph: 'ჩ', cue: 'Airy ch, like the start of “chair”.' },
      { glyph: 'ჭ', cue: 'Ejective ch’. Listen for the short catch as the sound releases.' },
      { glyph: 'ჯ', cue: 'Voiced j, as in “jam”.' }
    ],
    placement: 'Lift the blade of your tongue a little behind the ridge above your upper teeth. Briefly close the gap, then ease it open into the sh shape.',
    airflow: 'For ჩ, let breath pass through the opening. For ჭ, briefly catch your breath and release into sh. For ჯ, let the vocal folds vibrate as the closure opens.',
    practice: 'Say ჩა, ჭა, ჯა on the same vowel. Then listen for those three beginnings in ჩიტი (bird), ჭეშმარიტი (true), and ჯანჯაფილი (ginger).'
  },
  {
    id: 'friction',
    title: 'Breath and friction',
    summary: 'Hear how a plain h changes when the back of the tongue narrows the airflow.',
    letters: [
      { glyph: 'ჰ', cue: 'Open, breathy h, as in “hat”.' },
      { glyph: 'ხ', cue: 'A continuous rough kh, as in German “Bach”.' },
      { glyph: 'ღ', cue: 'A voiced gh. Feel the vibration underneath the friction.' }
    ],
    placement: 'For ჰ, let your mouth take the shape of the next vowel. For ხ and ღ, bring the back of your tongue close to the soft palate. Leave a narrow gap.',
    airflow: 'Breathe gently through the gap for ხ. Keep the air moving in the same place and add voice for ღ. You can feel the buzz with fingertips resting lightly on your throat.',
    practice: 'Try ჰა, ხა, ღა. Stretch the beginning of each syllable for a moment. Listen for open breath, rough air, and then rough air with a buzz.'
  },
  {
    id: 'deep-ejective',
    title: 'Moving k’ farther back',
    summary: 'კ and ყ are both ejectives. The tongue reaches farther back for ყ.',
    letters: [
      { glyph: 'კ', cue: 'Ejective k’ at the soft palate, where English k is made.' },
      { glyph: 'ყ', cue: 'Deep q’ near the uvula. Its release can sound rough or like a brief catch.' }
    ],
    placement: 'Start with the back of your tongue in the k position. For ყ, draw it slightly farther back toward the uvula, the small part hanging at the back of the soft palate.',
    airflow: 'Use the same brief catch as in კ. Release gently into the vowel. Speakers vary in how much friction you hear with ყ.',
    practice: 'Say კა and ყა slowly with a relaxed jaw. Then alternate კვერცხი (egg) and ყავა (coffee), listening to where each word begins.'
  }
];
