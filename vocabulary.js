(() => {
  const alternateCues = {
  "ანბანი": {
    "wordAnchor": "The opening letters",
    "wordCue": "An-bani sounds like the start of a roll call. Imagine ა (Ani) and ბ (Bani) answering first when the whole alphabet is called.",
    "picture": "🔤"
  },
  "ბიჭი": {
    "wordAnchor": "A boy on the beach",
    "wordCue": "Picture a boy on a beach shouting “ee!” Beach-ee brings you close to bich’i. Give the ch’ a little pop.",
    "picture": "👦"
  },
  "ზამთარი": {
    "wordAnchor": "A frozen thermometer",
    "wordCue": "Picture a thermometer frozen in winter. Tap its frosty glass in three beats as you say zam-ta-ri.",
    "picture": "❄️"
  },
  "თაგვი": {
    "wordAnchor": "Tag the mouse",
    "wordCue": "Picture a mouse with a tag on its tail. It squeals “wee!” as it runs. Blend tag and vee into tagvi.",
    "picture": "🐭"
  },
  "იმედი": {
    "wordAnchor": "Hoping to win a medal",
    "wordCue": "At the finish line a runner hopes for a medal. Think “ee, MEDal, ee” and shorten it to i-me-di.",
    "picture": "🏅"
  },
  "კვერცხი": {
    "wordAnchor": "Crack the egg",
    "wordCue": "Hold an egg over a bowl. The sharp k’ at the start cracks the shell. Say k’ver-tskhi as the two halves part.",
    "picture": "🥚"
  },
  "ნემსი": {
    "wordAnchor": "A needle for hems",
    "wordCue": "A tailor names each needle by the hems it sews. Let “names” and “sew” remind you to say nem-si as you stitch.",
    "picture": "🪡"
  },
  "ჟანგბადი": {
    "wordAnchor": "An oxygen buddy",
    "wordCue": "Picture your diving buddy handing you oxygen. “Buddy” cues the ending badi. Picture the oxygen tank as you say zhang-ba-di.",
    "picture": "🫧"
  },
  "რადიო": {
    "wordAnchor": "Tune the radio",
    "wordCue": "Turn an imaginary dial. Radio is spelled with five familiar sounds: ra-di-o. Turn the dial once for each syllable.",
    "picture": "📻"
  },
  "ტურა": {
    "wordAnchor": "A jackal on tour",
    "wordCue": "Picture a jackal leading a tour. The start of “tour” gets you going. Add ah and give the first t’ a pop: t’u-ra.",
    "picture": "🐾"
  },
  "უარი": {
    "wordAnchor": "Turning down tea",
    "wordCue": "Someone offers you tea. Picture yourself holding up a hand and saying oo-ah-ree. That gesture is your cue for uari, a refusal.",
    "picture": "✋"
  },
  "ფუტკარი": {
    "wordAnchor": "A bee near your foot",
    "wordCue": "A bee lands on your foot beside a parked car. Foot and car cue the sound sequence. Say put’k’ari as you picture it flying away.",
    "picture": "🐝"
  },
  "ქალაქი": {
    "wordAnchor": "Call across the city",
    "wordCue": "Picture yourself calling across city rooftops. Call cues the start of ka-la-ki. Tap out the three syllables on three rooftops.",
    "picture": "🏙️"
  },
  "ღუზა": {
    "wordAnchor": "An anchor going down",
    "wordCue": "Picture a sailor lowering an anchor to a two-beat chant: ghu-za. Start with the buzzing gh as the chain rattles.",
    "picture": "⚓"
  },
  "შაქარი": {
    "wordAnchor": "Shake the sugar",
    "wordCue": "Picture shaking sugar into tea. The sh in shake starts the word. Shake once per syllable as you say sha-ka-ri.",
    "picture": "🥄"
  },
  "ჩიტი": {
    "wordAnchor": "A bird calling twice",
    "wordCue": "Picture a tiny bird chirping “chee-tee” from a wire. Its two-note call cues chi-t’i. Give the second consonant a small pop.",
    "picture": "🐦"
  },
  "ცხოველი": {
    "wordAnchor": "An animal in the valley",
    "wordCue": "Picture a wild animal in a valley. “Valley” helps you remember the ending veli. Add the hiss and rough kh at the start: tskho-ve-li.",
    "picture": "🐾"
  },
  "ჭეშმარიტი": {
    "wordAnchor": "A true answer in chess",
    "wordCue": "Picture a chess referee checking whether a claim is true. “Chess” cues the opening ch’esh. Say ch’esh-ma-ri-t’i as the referee nods.",
    "picture": "♟️"
  },
  "ჯანჯაფილი": {
    "wordAnchor": "Ginger at the market",
    "wordCue": "Imagine a vendor drumming on a ginger root. Hear the two j sounds in jan-ja, then finish the four-beat call: jan-ja-pi-li.",
    "picture": "🫚"
  }
};
  const listeningPages = {
  "ატამი": "https://forvo.com/word/%E1%83%90%E1%83%A2%E1%83%90%E1%83%9B%E1%83%98/",
  "ია": "https://forvo.com/word/%E1%83%98%E1%83%90/",
  "კარი": "https://forvo.com/word/%E1%83%99%E1%83%90%E1%83%A0%E1%83%98/",
  "ფული": "https://forvo.com/word/%E1%83%A4%E1%83%A3%E1%83%9A%E1%83%98/",
  "ქარი": "https://forvo.com/word/%E1%83%A5%E1%83%90%E1%83%A0%E1%83%98/",
  "შავი": "https://forvo.com/word/%E1%83%A8%E1%83%90%E1%83%95%E1%83%98/",
  "ჩაი": "https://forvo.com/word/%E1%83%A9%E1%83%90%E1%83%98/",
  "ჭიქა": "https://forvo.com/word/%E1%83%AD%E1%83%98%E1%83%A5%E1%83%90/",
  "ბალი": "https://ru.forvo.com/word/%E1%83%91%E1%83%90%E1%83%9A%E1%83%98/",
  "ჟოლო": "https://de.forvo.com/word/%E1%83%9F%E1%83%9D%E1%83%9A%E1%83%9D/",
  "ტბა": "https://ru.forvo.com/word/%E1%83%A2%E1%83%91%E1%83%90/",
  "ღამე": "https://fr.forvo.com/word/%E1%83%A6%E1%83%90%E1%83%9B%E1%83%94/",
  "ცა": "https://ro.forvo.com/word/%E1%83%AA%E1%83%90/"
};
  for (const recording of RECORDINGS) {
    const card = ALPHABET[recording.cardNumber - 1];
    card.wordMemory = MNEMONICS[card.glyph];
    if (card.word !== recording.word) {
      card.originalExample = {
        glyph: card.glyph, word: card.word, meaning: card.meaning, reading: card.reading,
        wordMemory: card.wordMemory, listeningPage: listeningPages[card.word], original: true
      };
      card.word = recording.word;
      card.meaning = recording.meaning;
      card.reading = Array.from(card.word, glyph => nationalRomanization.get(glyph)).join('');
      card.wordMemory = alternateCues[card.word];
    }
    card.recording = recording;
  }
})();
