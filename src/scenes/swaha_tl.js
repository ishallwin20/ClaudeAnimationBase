// swaha_tl.js: the timeline of "Every time you say SWAHA, you're calling a GODDESS." (ad 49), from the voice
// (swaha_vo.js), shared by the scene (swaha.js) and the sound (tools/swaha_sfx.mjs, which loads both files with vm).
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    B0: mid('hook', 'said'), C0: mid('said', 'veda'), D0: mid('veda', 'name'), E0: mid('name', 'hungry'), F0: mid('hungry', 'appear'),
    G0: mid('appear', 'agni'), H0: mid('agni', 'rule'), I0: mid('rule', 'snake'), J0: mid('snake', 'others'),
    K0: Wd('others', 2, 0) - .15, L0: Wd('others', 3, 0) - .15, M0: mid('others', 'kid'), N0: mid('kid', 'ask'),
    CARD: LN.ask.end + 1.4,
    SWAHA0: Wd('hook', 0, 4), GODDESS0: Wd('hook', 0, 8),
    HAVAN: Wd('said', 0, 2), WEDDING: Wd('said', 0, 4), GRIHA: Wd('said', 0, 6),
    VEDAS: Wd('veda', 0, 2), AGNAYE: Wd('veda', 1, 0), SWAHA1: Wd('veda', 1, 1), SWAHA2: Wd('veda', 1, 4),
    DEVIB: Wd('name', 0, 2), SAYS: Wd('name', 0, 4), NAME: Wd('name', 0, 8),
    NEVER: Wd('hungry', 0, 3), GODS0: Wd('hungry', 1, 1),
    BRAHMA: Wd('appear', 0, 0), DEVI: Wd('appear', 0, 5), GODDESS: Wd('appear', 1, 2), SWAHA3: Wd('appear', 1, 3),
    AGNI: Wd('agni', 0, 2), BURN: Wd('agni', 0, 5), WIFE: Wd('agni', 0, 8),
    RULE: Wd('rule', 0, 1), HERNAME: Wd('rule', 0, 7), REACH: Wd('rule', 1, 2), GODS: Wd('rule', 1, 4),
    WITHOUT: Wd('snake', 0, 2), SNAKE: Wd('snake', 1, 2), POISON: Wd('snake', 1, 4),
    ALONE: Wd('others', 0, 3), SWADHA: Wd('others', 0, 4), FEED: Wd('others', 1, 6), DAKSHINA: Wd('others', 2, 0), GIFT: Wd('others', 2, 2), BOTH: Wd('others', 3, 0),
    CHILD: Wd('kid', 0, 4), NAMEK: Wd('kid', 0, 6),
    KNOW: Wd('ask', 0, 2), SWAHA4: Wd('ask', 0, 3), YES: Wd('ask', 1, 1), NO: Wd('ask', 1, 3),
  };
  // the ghee offerings: each lands in the fire on its word (the ladle tips just before)
  T.POURS = [T.SWAHA0, T.HAVAN, T.WEDDING, T.GRIHA, T.SWAHA1, T.SWAHA2, T.HERNAME + .25, T.YES];
  T.FAILS = [T.NEVER - .2, T.WITHOUT];        // offerings without her: the fire doesn't take them
  T.END = T.CARD + 7.6;
  Object.assign(T, { CAP_T: T.CARD + .1, COVERS: T.CARD + .4, PRICE: T.CARD + 1.2, STRIKE: T.CARD + 1.7, DEAD: T.CARD + 2.2, PILL: T.CARD + 2.7, SUB: T.CARD + 3.2, FOLLOW: T.CARD + 3.7 });
  return T;
})();
