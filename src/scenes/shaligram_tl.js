// shaligram_tl.js: the timeline of "This stone is 150 MILLION years old" (ad 61), from the voice (shaligram_vo.js),
// shared by the scene (shaligram.js) and the sound (tools/shaligram_sfx.mjs, which loads both with vm).
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'vishnu'), C0: mid('vishnu', 'name'), D0: mid('name', 'heart'), E0: mid('heart', 'accept'), F0: mid('accept', 'worms'),
    G0: mid('worms', 'science'), H0: mid('science', 'ammonite'), I0: mid('ammonite', 'ocean'), J0: mid('ocean', 'india'), K0: mid('india', 'river'),
    L0: mid('river', 'same'), M0: mid('same', 'puja'), N0: mid('puja', 'gita'), O0: mid('gita', 'nature'), P0: mid('nature', 'tulsi'), Q0: mid('tulsi', 'ask'),
    CARD: LN.ask.end + 1.3,
    MILLION: Wd('hook', 0, 3), VISHNU: Wd('vishnu', 0, 5), SHALIGRAM: Wd('name', 0, 2), PURANA: Wd('name', 0, 4), SCIENCE: Wd('name', 0, 10),
    BROKE: Wd('heart', 0, 1), TULSI1: Wd('heart', 0, 7), CURSED: Wd('heart', 1, 1), STONE1: Wd('heart', 1, 6), BECOME: Wd('heart', 1, 7), STONE2: Wd('heart', 1, 9),
    ACCEPTED: Wd('accept', 0, 1), RIVER1: Wd('accept', 0, 5), GANDAKI1: Wd('accept', 0, 6), TULSI2: Wd('accept', 1, 2), PLANT: Wd('accept', 1, 3), STONE3: Wd('accept', 1, 8), BANK: Wd('accept', 1, 11),
    TINY: Wd('worms', 0, 0), TEETH: Wd('worms', 0, 4), CARVE: Wd('worms', 1, 1), CHAKRAS: Wd('worms', 1, 3),
    INSIDE: Wd('science', 0, 2), SPIRAL1: Wd('science', 0, 5), AMMONITE: Wd('ammonite', 0, 2), CREATURE: Wd('ammonite', 0, 5), STONE4: Wd('ammonite', 0, 8),
    SEA: Wd('ocean', 0, 4), AGO: Wd('ocean', 0, 8), DINOS: Wd('ocean', 0, 11),
    INDIA: Wd('india', 0, 1), CRASHED: Wd('india', 0, 2), ASIA: Wd('india', 0, 4), ROSE: Wd('india', 1, 3), HIMALAYAS1: Wd('india', 1, 7),
    FOSSILS: Wd('river', 0, 2), WASH: Wd('river', 0, 3), GANDAKI2: Wd('river', 0, 9),
    SAME_R: Wd('same', 0, 1), SAME_S: Wd('same', 0, 3), SAME_P: Wd('same', 0, 5),
    WORSHIP: Wd('puja', 0, 6), PIECE: Wd('puja', 1, 1), HIMALAYAS2: Wd('puja', 1, 4), TULSI3: Wd('puja', 1, 6), RIVERW: Wd('puja', 1, 8),
    GITA: Wd('gita', 0, 4), STILL: Wd('gita', 0, 9), HIMALAYA3: Wd('gita', 0, 13),
    NATURE: Wd('nature', 0, 3), SACRED: Wd('nature', 0, 6),
    NEVER: Wd('tulsi', 0, 5), TULSI4: Wd('tulsi', 0, 8),
    FOSSIL: Wd('ask', 0, 6), COMMENT: Wd('ask', 0, 7), YES: Wd('ask', 0, 8),
  };
  T.END = T.CARD + 6.8;
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW: T.CARD + 1.95 });
  return T;
})();
