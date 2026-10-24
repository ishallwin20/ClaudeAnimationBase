// rp11_tl.js: the timeline of Ramayan Part 11, "Ram vs the Ocean" (no voice: captions and retro cartoon SFX, a soft
// tanpura only under the three days of waiting). Every shot and beat in video seconds; rp11.js draws to it,
// tools/rp11_sfx.mjs times the sounds from it (loaded with vm). 58.0 s.
const TL = {
  // A the hook: Ram at the shore, the bow drawn at the sea
  // B the ident
  B0: 3.4,
  // C Vibhishana comes over; "he's a spy!"; Ram: I protect all who come, even Ravana
  C0: 6.2, SPY: 9.0, SAFE: 11.4,
  // D Ram prays to the Ocean on the grass by the shore; three days; no answer
  D0: 14.6, DAYS: 17.7,
  // E Ram's arrows churn the sea; he raises the Brahmastra
  E0: 20.8, ASTRA: 24.1,
  // F the Ocean rises, hands joined; the arrow shot far north; "Nala can build a bridge"
  F0: 27.2, NORTH: 30.7, NALA: 33.5,
  // G the bridge in five days; the army marches across
  G0: 36.2, FIVE: 39.6, MARCH: 43.0,
  // H the finale tease: Ravana's ten heads glare from Lanka
  H0: 46.4,
  // I the follow card
  I0: 50.8, END: 58.0,
};
TL.ARRIVE = TL.C0 + 1.4; TL.SHOOT = TL.E0 + .9; TL.RISE = TL.F0 + .2; TL.FLY = TL.NORTH + 1.0;
TL.CARD = { head: TL.I0 + .1, title: TL.I0 + .5, pill: TL.I0 + 1.0, ask: TL.I0 + 2.6, books: TL.I0 + 3.6 };
// the captions: [first line's time, gone by, ...lines]; *gold*, ^ a huge gold line; each line pops in .35 s after the last
TL.CAPS = [
  [-1, TL.B0 - .1, 'The Ocean ignored Ram', 'for 3 days…', '^BAD IDEA.'],
  [TL.C0 + .1, TL.SPY - .1, "Ravana's own brother,", '*VIBHISHANA*, came to Ram.'],
  [TL.SPY, TL.SAFE - .1, 'The monkeys:', '^"HE\'S A SPY!"'],
  [TL.SAFE, TL.D0 - .1, 'Ram: "I protect all who', 'come to me…', '^EVEN RAVANA!"'],
  [TL.D0 + .1, TL.DAYS - .1, 'To cross the sea,', 'Ram prayed to the *OCEAN*…'],
  [TL.DAYS, TL.E0 - .1, 'For *3 DAYS*.', '^NO ANSWER.'],
  [TL.E0 + .1, TL.ASTRA - .1, 'So Ram got angry.', 'His arrows', '^CHURNED THE SEA!'],
  [TL.ASTRA, TL.F0 - .1, 'Then he raised', '^THE BRAHMASTRA…'],
  [TL.F0 + .1, TL.NORTH - .1, 'The *OCEAN* himself rose,', 'hands joined:', '^"FORGIVE ME, RAM!"'],
  [TL.NORTH, TL.NALA - .1, 'The arrow had to fly,', 'so Ram shot it', '^FAR TO THE NORTH.'],
  [TL.NALA, TL.G0 - .1, 'The Ocean: "*NALA* can build', 'a bridge. I\'ll hold it up!"'],
  [TL.G0 + .1, TL.FIVE - .1, 'Nala and the monkeys', 'built a', '^BRIDGE…'],
  [TL.FIVE, TL.MARCH - .1, '*100 YOJANAS* long,', '^IN 5 DAYS!'],
  [TL.MARCH, TL.H0 - .1, 'And the army', '^MARCHED TO LANKA!'],
  [TL.H0 + .1, TL.I0 - .1, '*NEXT, THE FINALE:*', '^RAM VS RAVANA!'],
];
