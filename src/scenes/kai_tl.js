// kai_tl.js: the timeline of "No human has EVER climbed this mountain." (ad 41), from the voice (kai_vo.js), shared by
// the scene (kai.js) and the sound (tools/kai_sfx.mjs, which loads both files with vm). Re-render the voice and the
// picture and the sound move with it.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'everest'), D0: mid('zero', 'name'), E0: mid('name', 'ravana'), F0: mid('ravana', 'rivers'),
    G0: mid('rivers', 'messner'), G2: Wd('messner', 1, 0) - .3, H0: mid('messner', 'quote'), I0: mid('quote', 'ban'),
    J0: mid('ban', 'twist'), K0: mid('twist', 'kora'), K2: Wd('kora', 1, 0) - .3, L0: mid('kora', 'prad'), M0: mid('prad', 'ask'),
    CARD: LN.ask.end + 1.4,
    // words the picture lands on
    MOUNTAIN: Wd('hook', 0, 6), EVEREST: Wd('everest', 0, 0), TALLER: Wd('everest', 0, 4), TIMES: Wd('everest', 1, 5),
    ONE: Wd('zero', 0, 1), ZERO: Wd('zero', 0, 2),
    KAILASH: Wd('name', 0, 3), SHIVA: Wd('name', 0, 7), RAVANA: Wd('ravana', 0, 2), LIFTED: Wd('ravana', 0, 4),
    RIVERS: Wd('rivers', 0, 2), INDUS: Wd('rivers', 1, 1), SUTLEJ: Wd('rivers', 1, 3), BRAHMA: Wd('rivers', 1, 5), KARNALI: Wd('rivers', 1, 8),
    MESSNER: Wd('messner', 0, 1), FOURTEEN: Wd('messner', 0, 8), CHANCE: Wd('messner', 1, 3), REFUSED: Wd('messner', 1, 5),
    CONQUER: Wd('quote', 0, 4), SOULS: Wd('quote', 1, 5), FORBIDDEN: Wd('ban', 0, 4),
    PILGRIMS: Wd('twist', 0, 1), WALK: Wd('twist', 0, 6), AROUND: Wd('twist', 0, 7),
    KM: Wd('kora', 0, 2), PASS: Wd('kora', 0, 5), METRES: Wd('kora', 0, 8), KSHIVA: Wd('kora', 1, 1), RIGHT: Wd('kora', 1, 4),
    PRAD: Wd('prad', 0, 1), HOME: Wd('prad', 0, 5), FAMILY: Wd('ask', 0, 4), YATRA: Wd('ask', 0, 8), CITY: Wd('ask', 1, 2),
  };
  T.END = T.CARD + 7.6;
  // the card's beats
  Object.assign(T, { CAP_T: T.CARD + .1, COVERS: T.CARD + .4, PRICE: T.CARD + 1.2, STRIKE: T.CARD + 1.7, DEAD: T.CARD + 2.2, PILL: T.CARD + 2.7, SUB: T.CARD + 3.2, FOLLOW: T.CARD + 3.7 });
  return T;
})();
