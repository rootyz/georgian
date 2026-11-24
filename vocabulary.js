(() => {
  const alternateCues = {
  "ანბანი": {
    "wordAnchor": "Ani and Bani start the alphabet",
    "wordCue": "Picture the first two letters answering an alphabet roll call. Take AN from Ani and all of BANI. AN + BANI spells anbani, alphabet.",
    "picture": "🔤"
  },
  "ბიჭი": {
    "wordAnchor": "A boy on the beach",
    "wordCue": "Picture a boy on a beach calling “ee!” Beach plus ee gets you close to bi-ch’i. Give the ch’ a small pop.",
    "picture": "👦"
  },
  "ზამთარი": {
    "wordAnchor": "A frozen jam tart",
    "wordCue": "Picture a jam tart frozen solid in winter. On its label change JAM to ZAM and the last T of TART to I. ZAM + TARI spells zamtari, winter.",
    "picture": "❄️"
  },
  "თაგვი": {
    "wordAnchor": "A mouse with a V-shaped tag",
    "wordCue": "Picture a mouse with a V-shaped tag stamped I. Read TAG, V and I along its tail. Together they spell tagvi, mouse.",
    "picture": "🐭"
  },
  "იმედი": {
    "wordAnchor": "Hoping for a medal",
    "wordCue": "Imagine two runners each saying “I hope for a MEDal.” Put MED between their two I’s. I-MED-I spells imedi, hope.",
    "picture": "🏅"
  },
  "კვერცხი": {
    "wordAnchor": "Vera’s egg",
    "wordCue": "Imagine Vera writing her name on an egg, then cracking off the A. VER is still on the shell. Use it as the middle landmark in k’VERtskhi, egg.",
    "picture": "🥚"
  },
  "ნემსი": {
    "wordAnchor": "Nemo’s needle at sea",
    "wordCue": "Nemo drops a sewing needle in the sea. Keep NEM from Nemo and add the sound of “sea” to get nem-si, needle.",
    "picture": "🪡"
  },
  "ჟანგბადი": {
    "wordAnchor": "An oxygen tank with a rusty valve",
    "wordCue": "Picture your diving buddy holding an oxygen tank with a rusty valve. Georgian ჟანგი (zhangi) means rust. Keep zhang from rust. Your buddy supplies the last two beats of zhang-ba-di.",
    "picture": "🫧"
  },
  "რადიო": {
    "wordAnchor": "A radio dial",
    "wordCue": "Look at the word RADIO on a radio dial. It already spells the Georgian word in Latin letters. Read it ra-di-o, starting with rah.",
    "picture": "📻"
  },
  "ტურა": {
    "wordAnchor": "A jackal on tour",
    "wordCue": "Picture a jackal leading a tour. “Tour” starts you on t’ur. Add ah and pop the first t’ to get t’u-ra, jackal.",
    "picture": "🐾"
  },
  "უარი": {
    "wordAnchor": "Ari refuses a U-turn",
    "wordCue": "Ari refuses to make a U-turn. Put U in front of ARI on the road sign. Read UARI in three beats, u-a-ri, for refusal.",
    "picture": "✋"
  },
  "ფუტკარი": {
    "wordAnchor": "A bee at the door",
    "wordCue": "Picture a bee at the door and a sign saying PUT IT OUT. PUT supplies the first three letters. The second half, კარი (k’ari), means door. Join them and pop the t’ for put’k’ari, bee.",
    "picture": "🐝"
  },
  "ქალაქი": {
    "wordAnchor": "Call a key-cutter in the city",
    "wordCue": "Imagine arriving in a city and having to “call a key-cutter.” CALL + A + KEY cues ka-la-ki. Give the two a’s an open ah sound.",
    "picture": "🏙️"
  },
  "ღუზა": {
    "wordAnchor": "A muddy anchor",
    "wordCue": "Pull up an anchor that oozes mud. “Ooze” gives you the middle uz. Put a rough, voiced gh in front and ah at the end to get ghuza, anchor.",
    "picture": "⚓"
  },
  "შაქარი": {
    "wordAnchor": "A shah carrying sugar",
    "wordCue": "Picture a shah carrying a sack of sugar. “Shah” gives sha; “carry” cues ka-ri. Together they remind you of sha-ka-ri.",
    "picture": "🥄"
  },
  "ჩიტი": {
    "wordAnchor": "A bird calling from a wire",
    "wordCue": "Picture a bird calling “chee-tee” on two notes. Copy the call for chi-t’i and give the t’ on the second note a pop.",
    "picture": "🐦"
  },
  "ცხოველი": {
    "wordAnchor": "A velvet animal",
    "wordCue": "Picture a wild animal with velvet ears. VEL from velvet is your spelling landmark near the end of tskho-VEL-i. Listen once for the crowded start, tskho.",
    "picture": "🐾"
  },
  "ჭეშმარიტი": {
    "wordAnchor": "The chess master tells the truth",
    "wordCue": "A chess master named Rita swears a story is true. Chess cues ch’esh. MA from master and RIT from Rita give the next letters. Add i for ch’esh-ma-ri-t’i.",
    "picture": "♟️"
  },
  "ჯანჯაფილი": {
    "wordAnchor": "Peeling ginger",
    "wordCue": "Picture two ginger roots and a peeler. Say the j in “ginger” twice for jan-ja. The sound of “peel” cues pil near the end of jan-ja-pi-li.",
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
