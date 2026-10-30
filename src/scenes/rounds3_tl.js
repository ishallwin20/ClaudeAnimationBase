// rounds3_tl.js: the timeline of "How many times should you walk around HANUMAN?", from the voice (rounds3_vo.js),
// shared by the scene (rounds3.js) and the sound (tools/rounds3_sfx.mjs, which loads both files with vm). Re-render the
// voice and the picture and the sound move with it.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'asked'), C0: mid('asked', 'krishna'), D0: mid('krishna', 'murugan'), E0: mid('murugan', 'nava'),
    F0: mid('nava', 'hanuman'), G0: mid('hanuman', 'twist'), H0: mid('twist', 'kverse'), I0: mid('kverse', 'mverse'),
    J0: mid('mverse', 'custom'), K0: mid('custom', 'priest'), L0: mid('priest', 'save'), M0: mid('save', 'ask'),
    N0: mid('ask', 'next'), CARD: LN.next.end + 1.3,
    // words the picture lands on
    HANUMAN0: Wd('hook', 0, 7), PART2: Wd('asked', 0, 1), FOUR_MORE: Wd('asked', 0, 6),
    KRISHNA: Wd('krishna', 0, 1), FOUR: Wd('krishna', 0, 2), VISHNU: Wd('krishna', 0, 6),
    MURUGAN: Wd('murugan', 0, 1), SIX: Wd('murugan', 0, 2),
    NAVA: Wd('nava', 0, 2), NINE: Wd('nava', 0, 6),
    HANUMAN: Wd('hanuman', 0, 2), THREE: Wd('hanuman', 0, 3), ELEVEN: Wd('hanuman', 1, 4),
    ONE: Wd('twist', 0, 2), PURANA: Wd('twist', 0, 9),
    KV: Wd('kverse', 0, 0), NARASIMHA: Wd('kverse', 0, 9),
    MV: Wd('mverse', 0, 0), SOUTH: Wd('mverse', 0, 5), NOSRC: Wd('mverse', 1, 1),
    CH: Wd('custom', 0, 0), CN: Wd('custom', 0, 3), CUSTOM: Wd('custom', 1, 0),
    PRIEST: Wd('priest', 0, 4), SCREEN: Wd('save', 0, 0),
    ASK3: Wd('ask', 0, 1), ASK11: Wd('ask', 0, 3), YOURT: Wd('ask', 1, 2),
    PART4: Wd('next', 0, 0), SHANI: Wd('next', 0, 2), LAKSHMI: Wd('next', 0, 3), AYYAPPA: Wd('next', 0, 4), FOLLOW: Wd('next', 1, 0),
  };
  T.END = T.CARD + 7.2;
  // the card's beats
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW_C: T.CARD + 1.95 });
  // the rounds: when each god's rings start and how long one takes
  T.ringsC = [T.KRISHNA - .1, (T.D0 - .3 - T.KRISHNA) / 4];
  T.ringsD = [T.MURUGAN - .1, (T.E0 - .3 - T.MURUGAN) / 6];
  T.ringsE = [T.NAVA - .1, (T.F0 - .3 - T.NAVA) / 9];
  T.ringsF = [T.F0 + .2, (T.THREE + .25 - T.F0 - .2) / 3];               // three, done on "THREE"
  T.ringsF2 = [T.ELEVEN - .25, (T.G0 - .3 - T.ELEVEN) / 8];               // then eight more, on "ELEVEN"
  return T;
})();
