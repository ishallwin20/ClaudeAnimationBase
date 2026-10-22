// prad_tl.js: the timeline of "Why do Hindus walk around a temple CLOCKWISE?", from the voice (prad_vo.js), shared by
// the scene (prad.js) and the sound (tools/prad_sfx.mjs, which loads both files with vm). Re-render the voice and the
// picture and the sound move with it.
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'name'), C0: mid('name', 'right'), D0: mid('right', 'sun'), E0: mid('sun', 'twist'),
    F0: mid('twist', 'water'), F2: Wd('water', 1, 0) - .25, G0: mid('water', 'tirtha'), H0: mid('tirtha', 'back'),
    I0: mid('back', 'text'), J0: mid('text', 'kid'), K0: mid('kid', 'ask'), CARD: LN.ask.end + 1.4,
    // words the picture lands on
    PRAD: Wd('name', 0, 2), DAKS: Wd('name', 0, 3), RIGHTW: Wd('name', 0, 5),
    RSIDE: Wd('right', 0, 5),
    EAST: Wd('sun', 0, 0), SOUTH: Wd('sun', 0, 2), WEST: Wd('sun', 0, 4), SUNW: Wd('sun', 1, 3),
    SHIVA: Wd('twist', 0, 3), NEVER: Wd('twist', 0, 6), CIRCLE: Wd('twist', 0, 9),
    POURED: Wd('water', 0, 2), LINGA: Wd('water', 0, 6), NORTH: Wd('water', 1, 7), SOMA: Wd('water', 1, 9),
    TIRTHA: Wd('tirtha', 0, 3), STEP: Wd('tirtha', 0, 7),
    ROUND: Wd('back', 0, 2), REACH: Wd('back', 0, 5), TURN: Wd('back', 0, 8), OTHER: Wd('back', 0, 13),
    RAHASYA: Wd('text', 0, 1), CROSS: Wd('text', 0, 8), SOMA2: Wd('text', 0, 10),
    CHILD: Wd('kid', 0, 3), YES: Wd('ask', 0, 7),
  };
  T.END = T.CARD + 7.6;
  // the card's beats
  Object.assign(T, { CAP_T: T.CARD + .1, COVERS: T.CARD + .4, PRICE: T.CARD + 1.2, STRIKE: T.CARD + 1.7, DEAD: T.CARD + 2.2, PILL: T.CARD + 2.7, SUB: T.CARD + 3.2, FOLLOW: T.CARD + 3.7 });
  // the walks (path s: 0 east, .25 south, .5 west, .75 north = the channel; the speed in path per second)
  T.walkC = [.16, .33];                       // C: round the south-east corner and along the south side, heading west
  T.walkE = [.47, .695];                      // E: up the west side, round the corner, stopping short of the channel
  T.walkG = [.62, .715];                      // G: along the north side to the channel's edge
  return T;
})();
