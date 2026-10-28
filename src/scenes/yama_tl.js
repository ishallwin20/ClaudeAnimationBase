// yama_tl.js: the timeline of "Diwali is FIVE days. The god of DEATH gets THREE." (ad 58), from the voice (yama_vo.js),
// shared by the scene (yama.js) and the sound (tools/yama_sfx.mjs, which loads both files with vm). Re-render the voice
// and the picture and the sound move with it.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'd1'), C0: LN.south.a - .25, C1: capOf('south')[1].a - .1, D0: mid('south', 'd2') + .25,
    E0: LN.d34.a - .35, G0: mid('d34', 'twist'), H0: mid('twist', 'story'), I0: mid('story', 'rule'), J0: mid('rule', 'close'),
    J1: capOf('close')[1].a - .1, K0: mid('close', 'ask'), CARD: LN.ask.end + 1.4,
    // words the picture lands on
    FIVE: Wd('hook', 0, 2), DEATH: Wd('hook', 0, 7), THREE: Wd('hook', 0, 9),
    ONE: Wd('d1', 0, 1), DHAN: Wd('d1', 0, 2), OUTSIDE: Wd('d1', 0, 6), YAMA: Wd('d1', 0, 10),
    SOUTH: Wd('south', 0, 5), DIRECTION: Wd('south', 1, 1), UNTIMELY: Wd('south', 1, 3), AWAY: Wd('south', 1, 6),
    TWO: Wd('d2', 0, 1), BATH: Wd('d2', 0, 5), WATER: Wd('d2', 0, 7), N14: Wd('d2', 1, 2), NAMES: Wd('d2', 1, 3),
    THREE3: Wd('d34', 0, 1), MOON: Wd('d34', 0, 4), LAKSHMI: Wd('d34', 0, 6), FOUR: Wd('d34', 1, 1), GOVARDHAN: Wd('d34', 1, 2),
    FIVE5: Wd('twist', 0, 2), SISTERS: Wd('twist', 0, 10), HOUSE: Wd('twist', 0, 11),
    YAMUNA: Wd('story', 0, 5), FED: Wd('story', 0, 6), HOMEST: Wd('story', 0, 12),
    BHAI: Wd('rule', 0, 2), SISTERH: Wd('rule', 0, 8), HAND: Wd('rule', 0, 9),
    TWOD: Wd('close', 0, 0), DEATHA: Wd('close', 0, 4), AWAYC: Wd('close', 0, 5), THIRD: Wd('close', 1, 2), HOME: Wd('close', 1, 6), SISTERC: Wd('close', 1, 9),
    YOUR: Wd('ask', 0, 1), DIYA: Wd('ask', 0, 6), YES: Wd('ask', 0, 8), NO: Wd('ask', 0, 10),
  };
  T.F0 = T.FOUR - .3;
  T.END = T.CARD + 7.2;
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW: T.CARD + 1.95 });
  // the fourteen names: one pops every NSTEP from N14 (the last lands before the d34 cut)
  T.NSTEP = (T.E0 - .9 - T.N14) / 13;
  return T;
})();
