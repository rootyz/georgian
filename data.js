// Spellings use Georgia's national romanization. An apostrophe marks an ejective.
// The reading of each example is assembled from the same letter-to-sound map.
const letterRows = [
  ["ა", "Ani", "a", "ɑ", "Open your mouth for ah, as in father. Keep the vowel steady.", "ატამი", "peach"],
  ["ბ", "Bani", "b", "b", "Close your lips and start your voice as you release them, like b in bell.", "ბალი", "cherry"],
  ["გ", "Gani", "g", "ɡ", "Use the hard g in go. In გული, follow it with the oo sound.", "გული", "heart"],
  ["დ", "Doni", "d", "d", "Touch your tongue near your upper teeth for d. Say the same d twice in დედა.", "დედა", "mother"],
  ["ე", "Eni", "e", "ɛ", "Say the vowel in bed. Keep your mouth in one position as you say it.", "ენა", "tongue"],
  ["ვ", "Vini", "v", "v", "Rest your upper teeth on your lower lip. Let them buzz as in vine.", "ვაშლი", "apple"],
  ["ზ", "Zeni", "z", "z", "Say s, then turn your voice on. The buzzing z starts ზარი.", "ზარი", "bell"],
  ["თ", "Tani", "t", "tʰ", "Say the t in top. A small puff of air follows it. Compare ტ, the popped t'.", "თაფლი", "honey"],
  ["ი", "Ini", "i", "i", "Say ee as in see. In ია, move from ee to ah in two syllables.", "ია", "violet"],
  ["კ", "K'ani", "k'", "kʼ", "Set up for k, briefly hold your breath, then release a small, crisp pop. Compare airy ქ.", "კარი", "door"],
  ["ლ", "Lasi", "l", "l", "Raise the tip of your tongue for the l at the start of leaf.", "ლომი", "lion"],
  ["მ", "Mani", "m", "m", "Close your lips and hum m. In მთა, slide straight from m into t.", "მთა", "mountain"],
  ["ნ", "Nari", "n", "n", "Hold your tongue just behind your upper teeth and hum, as in nose.", "ნავი", "boat"],
  ["ო", "Oni", "o", "ɔ", "Round your lips for one steady o. Try the start of oh and keep your lips still.", "ორი", "two"],
  ["პ", "P'ari", "p'", "pʼ", "Close your lips, briefly hold your breath and pop the p. Compare ფ, which has a puff of air.", "პური", "bread"],
  ["ჟ", "Zhani", "zh", "ʒ", "Find the sound in the middle of measure. Put it at the beginning of ჟოლო.", "ჟოლო", "raspberry"],
  ["რ", "Rae", "r", "r", "Let the tip of your tongue tap or briefly trill behind your upper teeth, like a Spanish r.", "რუკა", "map"],
  ["ს", "Sani", "s", "s", "Make a quiet s hiss, as in sun. Compare the buzzing ზ.", "სახლი", "house"],
  ["ტ", "T'ari", "t'", "tʼ", "Shape a t, briefly hold your breath, then release the tongue with a pop. Compare airy თ.", "ტბა", "lake"],
  ["უ", "Uni", "u", "u", "Round your lips for the oo in food. Keep the sound steady from start to finish.", "უბანი", "neighborhood"],
  ["ფ", "Pari", "p", "pʰ", "Start with p as in pen. Hold a hand near your mouth to feel its small puff of air.", "ფული", "money"],
  ["ქ", "Kani", "k", "kʰ", "Say k as in kite, with a puff of air. Compare ქარი (wind) and კარი (door).", "ქარი", "wind"],
  ["ღ", "Ghani", "gh", "ɣ", "Bring the back of your tongue near the soft palate. Keep air flowing and add voice, like a buzzing ხ.", "ღამე", "night"],
  ["ყ", "Q'ari", "q'", "qʼ", "Move the back of your tongue farther back than for k'. Release a short, deep catch into the vowel.", "ყავა", "coffee"],
  ["შ", "Shini", "sh", "ʃ", "Say sh as in shoe. Hold the hush for a moment before starting the vowel.", "შავი", "black"],
  ["ჩ", "Chini", "ch", "t͡ʃʰ", "Start with the ch in chair. Let a small puff follow it. Compare the popped ჭ.", "ჩაი", "tea"],
  ["ც", "Tsani", "ts", "t͡sʰ", "Join t and s as at the end of cats. Use that single sound to start ცა.", "ცა", "sky"],
  ["ძ", "Dzili", "dz", "d͡z", "Find dz at the end of adds. Keep the two parts together when you start ძაღლი.", "ძაღლი", "dog"],
  ["წ", "Ts'ili", "ts'", "t͡sʼ", "Shape a ts, briefly hold your breath and release it with a pop. Compare ც, the airy ts.", "წყალი", "water"],
  ["ჭ", "Ch'ari", "ch'", "t͡ʃʼ", "Get ready to say ch, briefly hold your breath and release with a crisp pop. Compare airy ჩ.", "ჭიქა", "drinking glass"],
  ["ხ", "Khani", "kh", "x", "Use the rough ch in German Bach or Scottish loch. Leave a small gap at the back of your mouth for air.", "ხე", "tree"],
  ["ჯ", "Jani", "j", "d͡ʒ", "Use the j in jam. The Georgian word ჯემი starts with that same sound.", "ჯემი", "jam"],
  ["ჰ", "Hae", "h", "h", "Let out a gentle breath as in hello. In ჰაერი, follow it immediately with ah.", "ჰაერი", "air"]
];

const nationalRomanization = new Map(letterRows.map(([glyph, , latin]) => [glyph, latin]));
const georgianVowels = new Set("აეიოუ");

globalThis.ALPHABET = letterRows.map(([glyph, name, latin, ipa, tip, word, meaning]) => ({
  glyph, name, latin, ipa, tip, word, meaning,
  reading: Array.from(word, letter => nationalRomanization.get(letter)).join(""),
  category: georgianVowels.has(glyph) ? "Vowel" : "Consonant"
}));
