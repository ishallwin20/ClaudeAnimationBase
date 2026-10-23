// jyoti_tl.js: the timeline of "Shiva appeared as LIGHT in 12 places in India." (ad 43), from the voice (jyoti_vo.js),
// shared by the scene (jyoti.js) and the sound (tools/jyoti_sfx.mjs, which loads both files with vm).
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('you', 'argue'), B2: mid('search', 'shiva') - .0, C0: mid('search', 'shiva'), D0: mid('shiva', 'purana'), E0: mid('n4', 'kedar'),
    F0: mid('kedar', 'rames'), G0: mid('rames', 'debate'), H0: mid('debate', 'ask'),
    CARD: LN.ask.end + 1.4,
    LIGHT: Wd('hook', 0, 3), TWELVE: Wd('hook', 0, 5), YOU: Wd('you', 0, 3),
    BRAHMA: Wd('argue', 0, 0), VISHNU: Wd('argue', 0, 2), GREATER: Wd('argue', 0, 7), ROSE: Wd('pillar', 0, 2), FIRE: Wd('pillar', 0, 6), NOEND: Wd('pillar', 0, 8),
    UP: Wd('search', 0, 2), SWAN: Wd('search', 0, 5), VDOWN: Wd('search', 0, 6), DOWN: Wd('search', 0, 8), BOAR: Wd('search', 0, 12), NEITHER: Wd('search', 1, 1), ENDW: Wd('search', 1, 4),
    SHIVA: Wd('shiva', 0, 3), LINGA: Wd('shiva', 0, 5), JYOTI: Wd('shiva', 0, 9), PURANA: Wd('purana', 0, 1), SHINES: Wd('purana', 0, 8),
    KEDAR: Wd('kedar', 0, 1), METRES: Wd('kedar', 0, 2), HIMALAYA: Wd('kedar', 0, 7),
    RAMES: Wd('rames', 0, 1), SEA: Wd('rames', 0, 4), RAM: Wd('rames', 0, 6), WAR: Wd('rames', 0, 11),
    ARGUED: Wd('debate', 0, 5), VAIDYA: Wd('debate', 0, 7), DEOGHAR: Wd('debate', 0, 8), PARLI: Wd('debate', 0, 10),
    NAGESH: Wd('debate', 1, 0), DWARKA: Wd('debate', 1, 1), AUNDHA: Wd('debate', 1, 2), JAGESH: Wd('debate', 1, 4), CLAIM: Wd('debate', 1, 6),
    JYOTI2: Wd('ask', 0, 1), YOUR: Wd('ask', 0, 5), CITY: Wd('ask', 0, 6), COMMENT: Wd('ask', 1, 0),
  };
  // when each of the twelve is named (the Shiva Purana's order)
  T.NAMES = [['n1', 0], ['n1', 1], ['n1', 2], ['n2', 0], ['n2', 1], ['n2', 2], ['n3', 0], ['n3', 2], ['n3', 3], ['n4', 0], ['n4', 1], ['n4', 2]].map(([id, w]) => Wd(id, 0, w));
  T.END = T.CARD + 7.6;
  Object.assign(T, { CAP_T: T.CARD + .1, COVERS: T.CARD + .4, PRICE: T.CARD + 1.2, STRIKE: T.CARD + 1.7, DEAD: T.CARD + 2.2, PILL: T.CARD + 2.7, SUB: T.CARD + 3.2, FOLLOW: T.CARD + 3.7 });
  return T;
})();
