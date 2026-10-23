// rp4_tl.js: the timeline of Ramayan Part 4, "The Crow and the Grass" (no voice: captions and retro cartoon SFX, a soft
// tanpura only under the Lanka scene). Every shot and beat in video seconds; rp4.js draws to it, tools/rp4_sfx.mjs
// times the sounds from it (loaded with vm). 64.1 s.
const TL = {
  // A the hook: Ram holds up the blazing blade of grass; a crow flaps past
  CROWH: 1.4,
  // B the ident
  B0: 3.8,
  // C Chitrakoot: Ram dozes; the crow pecks; the clod; it comes back and claws; Ram wakes; Indra's son
  C0: 6.6, PECK: 10.1, CLOD: 12.5, CAME: 14.5, CLAW: 15.1, BLED: 16.1, WOKE: 17.8, BLOOD: 18.6, INDRAS: 20.0,
  // D the blade of grass becomes the Brahmastra
  D0: 23.4, PICK: 23.8, BLADE: 24.6, BRAHM: 25.8,
  // E the crow flees through the three worlds; his father, the gods, the sages turn him away
  E0: 28.3, FATHER: 30.7, GODS: 31.6, SAGES: 32.2, NOONE: 33.2,
  // F back at Ram's feet; the astra can't be wasted; it takes his right eye; spared
  F0: 35.4, FEET: 36.6, WASTED: 37.8, RIGHT: 40.1, HIT: 40.9, SPARED: 42.4,
  // G Lanka, years later: Sita tells Hanuman; "why not for the demon who took me?"
  G0: 44.6, ASKED: 48.1, WHYNOT: 50.5,
  // H the Part 5 tease: one man against fourteen thousand
  H0: 53.6,
  // K the follow card
  K0: 57.1, END: 64.1,
};
TL.LANKA = TL.G0 + .5; TL.ONLY = TL.G0 + .85; TL.TOOK = TL.WHYNOT + .35; TL.FOURTEEN = TL.H0 + .85;
TL.CARD = { head: TL.K0 + .1, title: TL.K0 + .5, pill: TL.K0 + 1.0, ask: TL.K0 + 2.6, books: TL.K0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'Ram once fired a', '*BRAHMASTRA* at a crow…', '^WITH A BLADE OF GRASS!'],
  [TL.C0 + .15, TL.PECK - .1, 'In the forest of *CHITRAKOOT,*', 'Ram and Sita rested', 'by the water.'],
  [TL.PECK, TL.CLOD - .4, 'A crow kept', 'pecking at *SITA!*'],
  [TL.CLOD - .3, TL.CAME - .1, 'She threw', 'a *CLOD OF EARTH.*'],
  [TL.CAME, TL.WOKE - .1, 'It came back,', 'and clawed her', '^UNTIL SHE BLED!'],
  [TL.WOKE, TL.INDRAS - .1, 'Ram woke', 'and saw the *BLOOD.*'],
  [TL.INDRAS, TL.D0 - .1, 'This was no ordinary crow.', 'It was', "^INDRA'S OWN SON!"],
  [TL.D0 + .15, TL.BRAHM - .1, 'Ram picked up', 'a *BLADE OF GRASS…*'],
  [TL.BRAHM, TL.E0 - .1, 'and made it a', '^BRAHMASTRA!'],
  [TL.E0 + .15, TL.FATHER - .15, 'The crow fled', 'through *ALL THREE WORLDS!*'],
  [TL.FATHER - .1, TL.NOONE - .1, 'His father *INDRA,*', 'the gods, the sages…'],
  [TL.NOONE, TL.F0 - .1, '^NO ONE', 'would shelter him!'],
  [TL.F0 + .15, TL.WASTED - .1, 'So he came back', "and fell at *RAM'S FEET.*"],
  [TL.WASTED, TL.RIGHT - .1, 'But a Brahmastra', '^IS NEVER WASTED.'],
  [TL.RIGHT, TL.SPARED - .1, 'So the crow gave up', 'his *RIGHT EYE…*'],
  [TL.SPARED, TL.G0 - .1, 'and Ram', '^SPARED HIM.'],
  [TL.G0 + .15, TL.ASKED - .1, 'Years later, in *LANKA,*', 'Sita told *HANUMAN* this,', 'a secret *ONLY RAM* knew.'],
  [TL.ASKED, TL.WHYNOT - .1, 'And she asked:', '"For a crow, a *BRAHMASTRA…*'],
  [TL.WHYNOT, TL.H0 - .1, 'Why not for the demon', '^WHO TOOK ME?"'],
  [TL.H0 + .15, TL.K0 - .1, '*NEXT, PART 5:*', 'one man against', '^14,000 DEMONS!'],
];
