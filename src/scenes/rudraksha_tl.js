// rudraksha_tl.js: the timeline of "Count the lines on your RUDRAKSHA" (ad 56), from the voice (rudraksha_vo.js), shared
// by the scene (rudraksha.js) and the sound (tools/rudraksha_sfx.mjs, which loads both with vm).
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'god'), C0: mid('god', 'tapas'), D0: mid('tapas', 'tears'), E0: mid('tears', 'trees'), F0: mid('trees', 'name'),
    G0: mid('name', 'blue'), H0: mid('blue', 'count'), I0: mid('count', 'one'), J0: mid('fourteen', 'five'), K0: mid('five', 'crore'),
    L0: mid('crore', 'save'), M0: mid('save', 'ask'), CARD: LN.ask.end + 1.4,
    RUDRAKSHA0: Wd('hook', 0, 5), GOD: Wd('god', 0, 6), PURANA: Wd('tapas', 0, 3), TAPAS: Wd('tapas', 0, 7), THOUSANDS: Wd('tapas', 1, 1),
    OPENED: Wd('tears', 0, 2), EYES: Wd('tears', 0, 4), TEARS: Wd('tears', 0, 6), EARTH: Wd('tears', 0, 9),
    WHERE: Wd('trees', 0, 0), TREES: Wd('trees', 0, 4), GREW: Wd('trees', 0, 5),
    RUDRA: Wd('name', 0, 0), AKSHA: Wd('name', 0, 2), EYE: Wd('name', 0, 4),
    BLUE: Wd('blue', 0, 3), BEAD: Wd('blue', 1, 1), SEED: Wd('blue', 1, 4),
    LINES: Wd('count', 0, 3), BOTTOM: Wd('count', 0, 6),
    FIVE1: Wd('five', 0, 5), FIVE2: Wd('five', 1, 1), RUDRA5: Wd('five', 1, 3), KALAGNI: Wd('five', 1, 5), J1: capOf('five')[1].a - .15,
    CHANT: Wd('crore', 0, 0), SPURANA: Wd('crore', 0, 6), MANTRA: Wd('crore', 1, 2), CRORE: Wd('crore', 1, 5),
    SAVE: Wd('save', 0, 0), YOURS: Wd('ask', 0, 2), COMMENT: Wd('ask', 1, 0),
  };
  // the count: each god's line, its number, its sign
  const IDS = [['one', 1, 'shiva'], ['four', 4, 'brahma'], ['six', 6, 'kartikeya'], ['nine', 9, 'durga'], ['ten', 10, 'vishnu'], ['twelve', 12, 'suns'], ['fourteen', 14, 'param']];
  T.GODS = IDS.map(([id, n, key], i) => ({ id, n, key, a: i ? mid(IDS[i - 1][0], id) : T.I0, num: LN[id].a, name: Wd(id, 0, 1), end: LN[id].end }));
  T.END = T.CARD + 7.2;
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW: T.CARD + 1.95 });
  return T;
})();
