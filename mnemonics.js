// Original visual associations for the example words. These are imaginative memory aids.
globalThis.MNEMONICS = {
  "ა": { anchor: "A peach hook", story: "Catch a peach by its stem on the open tip of ა. Let it swing as you say ah." },
  "ბ": { anchor: "A cherry on its stem", story: "The closed oval of ბ is a cherry. Pick it by the bent stem sticking out of the top." },
  "გ": { anchor: "A stethoscope", story: "Put the little curl of გ in your ear. Press its big round end against your chest to hear your heart." },
  "დ": { anchor: "A mother cradling a baby", story: "Tuck a swaddled baby into the right-hand loop of დ. The long curve on the left is the mother’s arm." },
  "ე": { anchor: "A left ear", story: "Imagine ე as your left ear. A tongue leans in and whispers the Georgian word ენა." },
  "ვ": { anchor: "An apple peel", story: "Peel an apple in one long strip. Let it fall into the two round bends of ვ, like a handwritten 3." },
  "ზ": { anchor: "A bell on a ring", story: "Hang the larger oval of ზ from its tiny top ring. Give the bell a shake and hear it buzz, zzz." },
  "თ": { anchor: "A honey dipper", story: "Dip the closed loop of თ into honey. A sticky strand arches over to the right and drips down." },
  "ი": { anchor: "A building in Batumi", story: "Picture a seaside building in Batumi shaped like the arch of ი. Violets grow between its two feet." },
  "კ": { anchor: "A door latch", story: "Slip a finger into the open lower curve of კ. Lift its little sideways latch and the door pops open." },
  "ლ": { anchor: "A lion’s paw", story: "Count three toe humps across the top of ლ. The long sweep underneath is the mark the lion’s paw left in the sand." },
  "მ": { anchor: "A mountain tunnel", story: "Walk into the lower loop of მ as if it were a tunnel. The tall stroke curling over it is the mountain ridge." },
  "ნ": { anchor: "A boat at the jetty", story: "The flat top of ნ is a jetty. An oval boat bobs against the post just below it." },
  "ო": { anchor: "Two hilltops", story: "Run your finger across the two humps of ო. Count them in Georgian as you go: ერთი, ორი — one, two." },
  "პ": { anchor: "A baker’s oven", story: "Slide bread into the open round belly of პ. Watch a wisp of steam curl out at the very top." },
  "ჟ": { anchor: "A berry picker", story: "Snag a raspberry with the little inward hook of ჟ. Drop it into the curved scoop at the bottom." },
  "რ": { anchor: "A road on a map", story: "Picture the two humps of რ as hills on a map. Trace the road that curves up and over the left hill." },
  "ს": { anchor: "A house drainpipe", story: "Follow the straight side of ს down the wall of a house. A puddle collects in the upturned foot of the pipe." },
  "ტ": { anchor: "A pier in a lake", story: "Look down at ტ from above. Its oval is a lake, and its straight pier sticks out into the water." },
  "უ": { anchor: "A neighborhood street", story: "The top of უ makes two little rooftops. The street below bends in a U around the neighborhood." },
  "ფ": { anchor: "A coin purse", story: "Roll the round coin on the left of ფ over the middle hump. Your money drops into the open purse below." },
  "ქ": { anchor: "A windsock", story: "Use the tall upright of ქ as a pole. A gust of wind blows the short curved windsock out to the left." },
  "ღ": { anchor: "A night owl", story: "Put an owl’s eyes under the twin brows of ღ. At night it perches on the little forked branch below." },
  "ყ": { anchor: "A coffee maker", story: "Fit a filter into the top cup of ყ. Coffee drips into the curved pot underneath." },
  "შ": { anchor: "A sleeping black cat", story: "Find two tiny ears at the top of შ. The big round loop below is a black cat curled up asleep." },
  "ჩ": { anchor: "A steaming teapot", story: "Grip the lower arch of ჩ like a teapot handle. A curl of steam rises from the tea to make the little hook above." },
  "ც": { anchor: "A cloud in the sky", story: "Frame a patch of sky with the tall curve on the left of ც. Imagine a cloud puffing out the two bumps on the right." },
  "ძ": { anchor: "A dog on a lead", story: "Clip a lead to your dog’s round collar. The collar forms the loop of ძ and the lead goes straight up on the right." },
  "წ": { anchor: "A water tap", story: "Turn the double-curved tap at the top of წ. The loop below is a bucket filling with water." },
  "ჭ": { anchor: "A straw in a glass", story: "Sip from the round drinking glass at the bottom of ჭ. Its tall straw has a little curly loop sticking out to the left." },
  "ხ": { anchor: "A hollow tree", story: "The straight left edge of ხ is a tree trunk. Look for a squirrel in the round hollow at its base." },
  "ჯ": { anchor: "A jam spoon", story: "The diagonal slash across ჯ is the rim of a tilted jam jar. Scrape it with the curled end of the spoon." },
  "ჰ": { anchor: "A ribbon in the air", story: "Blow air under a hanging ribbon. It flutters into the three stacked bends of ჰ as you breathe out hhh." },
};

// Letter outlines are from the bundled Georgian font, with its license in fonts/LICENSE.txt.
const mnemonicGlyphPaths = {
  "ა": "M940 426Q940 -30 519 -30Q100 -30 100 436L138 643H314L280 436Q280 110 522 110Q761 110 761 426Q760 638 565 819Q370 1001 370 1213H557Q558 1049 749 868Q940 687 940 426Z",
  "ე": "M920 -63Q920 -483 524 -483Q100 -483 100 -61L133 164H305L280 -63Q280 -343 524 -343Q750 -343 750 -65V722Q750 980 525 980Q325 980 325 736L380 510H208L159 730Q159 1120 525 1120Q920 1120 920 719Z",
  "ი": "M960 580Q960 312 817 1H634Q780 289 780 580Q780 980 530 980Q280 980 280 577Q280 289 425 0H241Q100 312 100 583Q100 1120 530 1120Q960 1120 960 580Z",
};

function mnemonicOutline(glyph, transform) {
  return `<path fill="#283d34" transform="${transform}" d="${mnemonicGlyphPaths[glyph]}"/>`;
}

const mnemonicIllustrations = {
  "ა": () => `<path d="M0 31Q26 39 55 23M0 39Q31 45 58 32" fill="none" stroke="#d4ba88" stroke-width="1"/>
    <path d="M136 -5Q148 22 133 46" fill="none" stroke="#91694e" stroke-width="3"/>
    ${mnemonicOutline("ა","translate(101 138) scale(.077 -.077)")}
    <path d="M74 96C85 86 90 90 96 94C106 87 117 96 114 109C112 122 101 134 91 136C78 132 63 112 74 96Z" fill="#ec8059" stroke="#594a35" stroke-width="2.4"/>
    <path d="M96 94Q85 110 91 130" fill="none" stroke="#ba5b3e" stroke-width="1.8"/>
    <path d="M95 95Q100 79 114 88" fill="none" stroke="#594a35" stroke-width="3" stroke-linecap="round"/>
    <path d="M99 86Q91 72 77 77Q82 88 99 86Z" fill="#688955" stroke="#465d3f" stroke-width="1.6"/>`,
  "ე": () => `<path d="M31 79C43 75 44 57 67 62Q75 64 81 75Q62 91 47 86Z" fill="#c96a55" stroke="#674638" stroke-width="2"/>
    <path d="M46 81Q65 74 78 77Q87 79 84 83Q76 89 63 85Z" fill="#e8a08b" stroke="#674638" stroke-width="1.6"/>
    <path d="M91 65Q98 75 91 85M98 60Q110 75 99 91" fill="none" stroke="#9c8866" stroke-width="2.2" stroke-linecap="round"/>
    ${mnemonicOutline("ე","translate(103 96) scale(.064 -.064)")}
    <path d="M128 50Q151 43 151 67Q151 82 137 85Q126 88 130 103" fill="none" stroke="#bd8b71" stroke-width="2" stroke-linecap="round"/>`,
  "ი": () => `<path d="M0 105Q54 99 99 106T220 103V160H0Z" fill="#c2d9ca"/>
    <path d="M0 116Q59 109 108 116T220 110M1 124Q32 122 53 118" fill="none" stroke="#94b6aa" stroke-width="1.5"/>
    <circle cx="169" cy="44" r="11" fill="#e5b864"/>
    <path d="M98 125V79Q98 43 125 43Q151 43 151 79V125Z" fill="#dda96e"/>
    <path d="M111 64h5v7h-5zm14-4h5v7h-5zm13 5h5v7h-5zm-25 14h5v7h-5zm15-3h5v7h-5zm9 15h5v7h-5z" fill="#927c59"/>
    ${mnemonicOutline("ი","translate(83 123) scale(.078 -.078)")}
    <path d="M0 139Q44 128 81 132T154 124T220 128V160H0Z" fill="#b7c393"/>
    <g stroke="#698458" stroke-width="1.8" fill="none"><path d="M117 140l3-13m-3 12l-4-6m12 6l3-15m7 13l-2-8"/></g>
    <g fill="#866791"><circle cx="119" cy="125" r="3"/><circle cx="123" cy="126" r="2.4"/><circle cx="117" cy="128" r="2"/>
    <circle cx="126" cy="123" r="2.4"/><circle cx="130" cy="123" r="2.4"/><circle cx="128" cy="126" r="2.2"/><circle cx="133" cy="128" r="2.6"/></g>`,
};

// The card already presents the same scene in text, so the picture is decorative to a screen reader.
globalThis.mnemonicPicture = function mnemonicPicture(glyph) {
  if (!Object.hasOwn(mnemonicIllustrations, glyph)) return "";
  return `<svg class="mnemonic-picture" viewBox="0 0 220 152" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="220" height="152" rx="9" fill="#f5e7c7"/>${mnemonicIllustrations[glyph]()}</svg>`;
};
