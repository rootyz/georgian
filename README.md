# Anbani

Anbani is an offline-capable Georgian alphabet trainer. Start at **Study desk → Start session**. The first five cards introduce ა, მ, ი, დ, and ე. Those five already let you read დედა (*deda*, “mother”).

## Upload to GitHub Pages

1. Unzip the download. Create a GitHub repository or open the repository that will host the app.
2. Upload the **contents** of the unzipped folder to the root of your publishing branch. Keep `index.html`, `sw.js`, and `manifest.webmanifest` together. Preserve the `art`, `audio`, `fonts`, and `icons` folders.
3. In **Settings → Pages**, choose **Deploy from a branch**. Select your uploaded branch, typically `main`, and the `/(root)` folder. Click **Save**.
4. Open the HTTPS address GitHub shows for the site. On the first online visit, open the gear and wait for **Offline lessons and letter audio are ready**. Choose **Save speaker audio** and wait for **All 33 recordings are ready for offline listening** before disconnecting. You can retry a partial download.

The app uses relative paths and works at a repository URL such as `https://YOUR-NAME.github.io/YOUR-REPOSITORY/`. It is ready to serve as uploaded. [GitHub Pages publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

For an existing Pages installation, upload the updated files to the same folder. Open the site online, close its open tabs or app windows, and reopen it to activate the new offline content. The update uses the same progress storage as the first release.

## Study

- Reveal each flashcard after trying the sound aloud. Tap **Hear word** beside the Georgian example to hear the complete word. Try it aloud, then use **Read letter by letter** to practice a difficult sound. Whole-word playback also works in the alphabet library and Word builder.
- Each letter has two memory cues. The **Letter mnemonic** links its shape to its sound, such as a hook for ა, a left ear for ე, or a curved building in Batumi for ი. The **Word mnemonic** connects the example’s pronunciation to its meaning. Open **Show a letter-shape hint** before revealing a card if you need a clue.
- Open **Sound lab** for seven pronunciation lessons. Compare letter recordings, listen to whole example words, and follow the tongue, lips, breath, and throat instructions. Select **Start listening drill** for a five-question sound identification exercise.
- Rate your recall with **Again**, **Hard**, **Good**, or **Easy**. The interval printed on each button is when the card will return. A new card rated Again returns in one minute, Hard in ten minutes, Good in one day, and Easy in four days. Open another session from the desk when a review is due.
- Later intervals grow with successful recall. A letter is marked **Learned** when its interval reaches 21 days. The progress ring counts every letter you have studied at least once.
- The desk starts with five new letters per local calendar day, plus due reviews. Use the gear to choose three, five, eight, or twelve new letters. In a review, press **Space** to reveal and **1–4** to rate.
- The **Alphabet** tab lets you search all 33 letters by glyph, name, sound, or example word. Open a letter and choose **Trace letter** for freehand practice.
- **Letter names** shows a name such as *Bani* and asks you to pick **ბ** from four Georgian letters. The starter set covers the first eight letters. Choose **Full alphabet** to practice any of the 33 names, or **My studied letters** once you have studied at least four. Each game has eight questions.
- **Shape hunt** asks you to identify a letter from its visual mnemonic. **Missing letter** has you restore a gap in a Georgian word. **Word pairs** challenges you to match four Georgian words with their English meanings in eight moves.
- **Letter match** tests recognition in eight questions. **Word builder** gives five words to spell from tiles. **Speed round** gives 45 seconds to identify as many letters as possible. Games track their own scores. Card ratings control spaced repetition.

## Install and save progress

Use the browser’s install option where available. On iPhone or iPad, open the site in Safari and use **Share → Add to Home Screen**.

Progress is saved in the current browser for this site. In the gear menu, choose **Export** to download a JSON backup. Use **Import backup** on another device or after moving the app to a different URL.

## Run or edit locally

From the folder containing `index.html`, run `python3 -m http.server 8000` and open `http://localhost:8000/`. Service workers require HTTPS or localhost. After changing an app file, increment the cache version in `sw.js`. Close existing app tabs and reopen after the new version has been downloaded.

`data.js` holds the deck, `study.js` schedules reviews, `games.js` runs the arcade, `interface.js` provides shared display elements, and `app.js` handles the study desk, flashcards, and letter library. The app has no runtime package dependencies.

## Learning references and credits

- Letter names follow the Georgian script reference in the [Georgian Label Generation Rules proposal](https://www.icann.org/en/system/files/files/proposal-georgian-lgr-24nov16-en.pdf).
- Latin spellings use the [Georgian national romanization system](https://assets.publishing.service.gov.uk/media/67990616636f8db3c2707143/ROMANIZATION_OF_GEORGIAN_Jan_25.pdf). Apostrophes distinguish ejective consonants, as in *k* and *k'*.
- Pronunciation references include Ryan Shosted and Vakhtang Chikovani’s [Standard Georgian](https://doi.org/10.1017/S0025100306002659) and Tamar Makharoblidze’s [Basic Georgian](https://eprints.iliauni.edu.ge/3035/1/Basic-Georgian%202%20bolo%20versia.pdf).
- The 33 letter recordings come from [Alphabet Learner](https://github.com/noBloodOnTheLeaves/alphabet_learner). Attribution and the Apache 2.0 license are in `audio/`. Each clip plays an individual letter sound.
- All 33 main examples have human recordings from Wikimedia Commons. A recording downloads the first time you play it on the installed site. **Settings → Save speaker audio** saves the entire set. Titles, authors, licenses, and source pages are in `audio/SPEAKERS.txt`. Nineteen cards also keep an earlier example under **Another word** with its original word mnemonic and a labeled synthesized guide. Where available, a Forvo link opens a speaker’s reading of the additional word.
- The Georgian glyphs use a subset of DejaVu Sans. The font license is in `fonts/LICENSE.txt`.

