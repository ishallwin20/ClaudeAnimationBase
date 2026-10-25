// rounds_tl.js: the timeline of "How many times should you walk around EACH god?", from the voice (rounds_vo.js),
// shared by the scene (rounds.js) and the sound (tools/rounds_sfx.mjs, which loads both files with vm). Re-render the
// voice and the picture and the sound move with it.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'same'), C0: mid('same', 'own'), D0: mid('own', 'devi'), E0: mid('devi', 'ganesha'),
    F0: mid('ganesha', 'vishnu'), G0: mid('vishnu', 'surya'), H0: mid('surya', 'shiva'), I0: mid('shiva', 'why'),
    J0: capOf('why')[1].a - .05, K0: mid('why', 'verse'), L0: mid('verse', 'kid'), M0: mid('kid', 'ask'), CARD: LN.ask.end + 1.4,
    // words the picture lands on
    SAME: Wd('same', 0, 5), EVERY: Wd('same', 0, 8), OWN: Wd('own', 0, 7), NUMBER: Wd('own', 0, 8),
    DEVI: Wd('devi', 0, 1), ONE: Wd('devi', 0, 5),
    GANESHA: Wd('ganesha', 0, 1), THREE: Wd('ganesha', 0, 2),
    VISHNU: Wd('vishnu', 0, 1), FOUR: Wd('vishnu', 0, 2),
    SURYA: Wd('surya', 0, 1), SEVEN: Wd('surya', 0, 4), MOST: Wd('surya', 0, 6),
    SHIVA: Wd('shiva', 0, 2), HALF: Wd('shiva', 0, 4),
    PART1: Wd('why', 0, 1), CROSS: Wd('why', 0, 5), WATER: Wd('why', 0, 7), WALK: Wd('why', 1, 1), TURN: Wd('why', 1, 6),
    VERSE: Wd('verse', 0, 4), NARASIMHA: Wd('verse', 0, 7),
    COUNT: Wd('kid', 0, 3), CHILD: Wd('kid', 0, 7), YOU: Wd('ask', 0, 4), YOURN: Wd('ask', 0, 7),
  };
  T.END = T.CARD + 7.2;
  // the card's beats
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW: T.CARD + 1.95 });
  // the rounds: when each god's rings start and how long one takes
  T.ringsB = [T.B0 + .35, .62];                                   // B: three rounds for everyone, together
  T.ringsD = [T.DEVI - .15, T.ONE - T.DEVI + .45];                // Devi: one, done on "ONE"
  T.ringsE = [T.GANESHA - .1, (T.F0 - .25 - T.GANESHA) / 3];
  T.ringsF = [T.VISHNU - .15, (T.G0 - .25 - T.VISHNU) / 4];
  T.ringsG = [T.SURYA - .1, (T.H0 - .25 - T.SURYA) / 7];
  return T;
})();
