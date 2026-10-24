// rp9_tl.js: the timeline of Ramayan Part 9, "Hanuman's Leap" (no voice: captions and retro cartoon SFX, a soft tanpura
// only under Sita in the grove). Every shot and beat in video seconds; rp9.js draws to it, tools/rp9_sfx.mjs times the
// sounds from it (loaded with vm). 77.0 s.
const TL = {
  // A the hook: tiny Hanuman flies into Surasa's open mouth; gulp
  GULP: 2.5,
  // B the ident
  B0: 3.6,
  // C Mount Mahendra: he grows huge, presses down, the mountain shakes; he leaps
  C0: 6.4, PRESS: 9.8, LEAP: 12.5,
  // D over the sea: Mainaka rises, "rest on me!"; he touches it and flies on
  D0: 13.4, MAIN: 16.0, THANKS: 19.2,
  // E Surasa: "into my mouth!"; bigger / wider; tiny as a thumb; in and out; she blesses him
  E0: 22.4, GROW: 25.8, TINY: 28.8, BLESS: 31.2,
  // F Simhika grabs his shadow; he shoots in and out; she sinks
  F0: 34.4, SIMH: 37.4,
  // G Lanka at dusk; at night he shrinks to a cat's size
  G0: 41.0, CAT: 43.4,
  // H the palace: a queen asleep, "is that Sita?!"; he kisses his tail and dances; "no"
  H0: 46.8, JOY: 50.2, DOUBT: 52.6,
  // I the Ashoka grove: Sita; he tells Ram's story; the ring
  I0: 55.8, SING: 59.2, RING: 62.2,
  // J the Part 10 tease: Hanuman grins over Lanka, his tail tip glowing
  J0: 66.0,
  // K the follow card
  K0: 69.8, END: 77.0,
};
TL.SHRINK = TL.CAT + .6; TL.GRAB = TL.F0 + .6; TL.THRU = TL.SIMH + 1.2; TL.SANK = TL.THRU + .8;
TL.GROW1 = TL.GROW + .2; TL.GROW2 = TL.GROW + 1.6; TL.ZIPIN = TL.TINY + .9; TL.ZIPOUT = TL.TINY + 1.6;
TL.BIG = TL.C0 + .9; TL.RISE = TL.MAIN - .4; TL.PAT = TL.THANKS + .3; TL.SURA = TL.E0 + .2;
TL.LAND = TL.G0 + .3; TL.QUEEN = TL.H0 + 1.4; TL.SHAKE = TL.DOUBT + 1.0; TL.LOOK = TL.SING + 1.4; TL.TAKE = TL.RING + 1.2;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'Hanuman flew *INTO*', "a monster's mouth…", '^ON PURPOSE!'],
  [TL.C0 + .15, TL.PRESS - .1, 'To find *SITA*,', 'Hanuman grew', '^HUGE!'],
  [TL.PRESS, TL.D0 - .1, 'He pushed off', 'Mount *MAHENDRA*…', '^IT SHOOK!'],
  [TL.D0 + .1, TL.MAIN - .1, '*100 YOJANAS* of ocean', 'to Lanka!'],
  [TL.MAIN, TL.THANKS - .1, 'The sea raised a gold mountain,', '*MAINAKA*:', '^"REST ON ME!"'],
  [TL.THANKS, TL.E0 - .1, 'He just touched it,', 'said thanks…', '^AND FLEW ON!'],
  [TL.E0 + .1, TL.GROW - .1, 'The gods sent *SURASA*,', 'mother of snakes, to test him:', '^"INTO MY MOUTH!"'],
  [TL.GROW, TL.TINY - .1, 'He grew *BIGGER*…', 'she opened *WIDER!*'],
  [TL.TINY, TL.BLESS - .1, 'So he shrank,', '^TINY AS A THUMB…'],
  [TL.BLESS, TL.F0 - .1, '…zipped in and out,', '^AND SHE BLESSED HIM!'],
  [TL.F0 + .1, TL.SIMH - .1, 'Then something', '^GRABBED HIS SHADOW!'],
  [TL.SIMH, TL.G0 - .1, 'Sea demon *SIMHIKA*!', 'He shot in, and out…', '^AND SHE SANK!'],
  [TL.G0 + .1, TL.CAT - .1, '*LANKA!*', 'A city of gold.'],
  [TL.CAT, TL.H0 - .1, 'At night, he shrank', 'to the size of', '^A CAT…'],
  [TL.H0 + .1, TL.JOY - .1, "In Ravana's palace,", 'a queen asleep…', '^"IS THAT SITA?!"'],
  [TL.JOY, TL.DOUBT - .1, 'He kissed his tail', '^AND DANCED!'],
  [TL.DOUBT, TL.I0 - .1, '"No. Sita would never', '^SLEEP HAPPY HERE."'],
  [TL.I0 + .1, TL.SING - .1, 'At last, in the *ASHOKA* grove,', 'under a tree:', '^SITA.'],
  [TL.SING, TL.RING - .1, 'From the branches, he softly', "told *RAM'S STORY*…"],
  [TL.RING, TL.J0 - .1, '…and gave her', "^RAM'S RING."],
  [TL.J0 + .1, TL.K0 - .1, '*NEXT, PART 10:*', 'Hanuman', '^SETS LANKA ON FIRE!'],
];
