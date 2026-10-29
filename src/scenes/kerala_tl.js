// kerala_tl.js: the timeline of "Kerala was pulled out of the SEA" (ad 62), shared by the scene (kerala.js) and the
// sound (tools/kerala_sfx.mjs, which loads it with vm). No voice: the captions carry the story, each held >= 2 s
// (three lines >= 3.2 s). CAPS: [id, a, b, text] (say() syntax: *gold*, | a line break).
const CAPS = [
  ['hook', -1, 4.2, '*Kerala* was pulled | out of the *SEA*… | by ONE *AXE*.'],
  ['won', 4.4, 8.2, '*Parshurama* had won the earth | from arrogant kings… | and given ALL of it away.'],
  ['kashyapa', 8.4, 12.0, 'Sage *Kashyapa* told him: | “You can’t live on land | you have given away.”'],
  ['mbh', 12.2, 15.6, 'The *Mahabharata* says | the *ocean* made new land for him.'],
  ['legend', 15.8, 19.4, '*Kerala’s* own legend tells how. | He stood at *Gokarna*…'],
  ['varuna', 19.6, 22.8, '…and prayed to *Varuna*, | the god of the sea.'],
  ['throw', 23.4, 25.8, 'Then he *THREW* his axe.'],
  ['flight', 26.0, 30.4, 'The *sea* drew back | as far as it flew…'],
  ['kanya', 30.6, 34.0, 'from *Gokarna* | to *Kanyakumari*.'],
  ['name', 34.4, 38.2, 'That’s why Kerala is called | *Parashurama Kshetram*.'],
  ['sci', 38.6, 42.0, 'And *science*? | Kerala’s coastal plain | is *young* land.'],
  ['sea', 42.2, 45.6, 'Thousands of years ago, | the *sea* came further inland.'],
  ['back', 45.8, 49.4, 'The *backwaters* began | as a bay of the sea, | shut in by sand bars.'],
  ['kuttanad', 49.6, 53.0, '*Kuttanad* is still farmed | *BELOW* sea level.'],
  ['same', 53.4, 57.0, 'The legend says the sea *drew back*. | The land says so too.'],
  ['piravi', 57.4, 60.4, 'Happy *Kerala Piravi*! | 1 November'],
  ['ask', 60.6, 64.4, 'Which part of *Kerala* | are YOU from? | Tell us below!'],
];
const TL = (() => {
  const C = Object.fromEntries(CAPS.map(([id, a, b]) => [id, { a, b }]));
  const T = {
    A0: 0, B0: C.won.a, C0: C.kashyapa.a, D0: C.mbh.a, E0: C.legend.a, F0: C.varuna.a, THROW: 23.6, G0: 23.4, H0: C.flight.a,
    SWEEP0: 26.0, SWEEP1: 33.2, KANYA: C.kanya.a + .9, I0: C.name.a, J0: C.sci.a, RISE0: C.sea.a, K0: C.back.a, KUTT: C.kuttanad.a,
    L0: C.same.a, M0: C.piravi.a, ASK: C.ask.a, CARD: 64.8,
  };
  T.END = T.CARD + 6.8;
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW: T.CARD + 1.95 });
  return T;
})();
