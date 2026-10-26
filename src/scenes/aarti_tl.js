// aarti_tl.js: the timeline of "You've been doing AARTI wrong" (ad 54), from the voice (aarti_vo.js), shared by the
// scene (aarti.js) and the sound (tools/aarti_sfx.mjs, which loads both files with vm). Re-render the voice and the
// picture and the sound move with it.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'most'), C0: mid('most', 'path'), D0: mid('path', 'feet'), E0: mid('feet', 'navel'), F0: mid('navel', 'face'),
    G0: mid('face', 'whole'), H0: mid('whole', 'wicks'), I0: mid('wicks', 'twist'), J0: mid('twist', 'shiva'), K0: mid('shiva', 'kid'),
    L0: mid('kid', 'ask'), CARD: LN.ask.end + 1.4,
    // words the picture lands on
    AARTI: Wd('hook', 0, 3), WAVE: Wd('most', 0, 4), ROUND: Wd('most', 0, 7),
    TEMPLES: Wd('path', 0, 2), PATH: Wd('path', 0, 7), NUMBER: Wd('path', 1, 2), PART: Wd('path', 1, 5),
    FOUR: Wd('feet', 0, 0), FEET: Wd('feet', 0, 4), TWO: Wd('navel', 0, 0), NAVEL: Wd('navel', 0, 3),
    THREE: Wd('face', 0, 0), FACE: Wd('face', 0, 3), THEN: Wd('whole', 0, 0), SEVEN: Wd('whole', 0, 1), BODY: Wd('whole', 0, 5),
    FLAME: Wd('wicks', 0, 2), GHEE: Wd('wicks', 0, 3), CAMPHOR: Wd('wicks', 0, 5), ODD: Wd('wicks', 1, 2), WICKS: Wd('wicks', 1, 5),
    MANTRAS: Wd('twist', 0, 2), WRONG: Wd('twist', 0, 6),
    SKANDA: Wd('shiva', 0, 2), SHIVA: Wd('shiva', 0, 4), PARVATI: Wd('shiva', 0, 6), DOIT: Wd('shiva', 1, 0), COMPLETE: Wd('shiva', 1, 7),
    COUNT: Wd('kid', 0, 8), N4: Wd('kid', 1, 0), N2: Wd('kid', 1, 1), N3: Wd('kid', 1, 2), N7: Wd('kid', 1, 3),
    ONCE: Wd('ask', 0, 6), YOUR: Wd('ask', 1, 2), C1: Wd('ask', 1, 6), C3: Wd('ask', 1, 8),
  };
  T.END = T.CARD + 7.2;
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW: T.CARD + 1.95 });
  // the circles: [start, seconds a circle] for each part; the lamp moves to the next part between them
  T.feet = [T.FOUR - .12, (T.E0 - .15 - (T.FOUR - .12)) / 4];
  T.navel = [T.TWO - .1, (T.F0 - .15 - (T.TWO - .1)) / 2];
  T.face = [T.THREE - .1, (T.G0 - .15 - (T.THREE - .1)) / 3];
  T.whole = [T.THEN - .05, (T.H0 - .1 - (T.THEN - .05)) / 7];
  return T;
})();
