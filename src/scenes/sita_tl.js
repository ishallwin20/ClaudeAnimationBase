// sita_tl.js: the timeline of "Was RAM right to leave SITA?" (ad 67), from the voice (sita_vo.js), shared by the scene
// (sita.js) and the sound (tools/sita_sfx.mjs, which loads both with vm).
const TL = (() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const T = {
    // the shots: each starts between two lines, or on a word
    B0: mid('hook', 'setup'), C0: mid('setup', 'valmiki'), C1: Wd('valmiki', 0, 2) - .15, D0: mid('valmiki', 'ram1'),
    E0: mid('ram1', 'kali'), E1: mid('kali', 'sita1'), F0: mid('sita1', 'pray'), G0: mid('sita2', 'heart'), H0: mid('heart', 'yagna'),
    I0: mid('yagna', 'oath'), J0: mid('oath', 'earth'), K0: mid('earth', 'gold'), L0: mid('gold', 'bhava'), L1: Wd('bhava', 1, 0) - .15,
    M0: mid('bhava', 'tulsi'), M1: Wd('tulsi', 0, 2) - .15, N0: mid('tulsi', 'split'), O0: mid('split', 'ask'),
    CARD: LN.ask.end + 1.6,
    // the words things land on
    POETS: Wd('setup', 0, 3), VALMIKI: Wd('valmiki', 0, 1), WHISPER: Wd('valmiki', 0, 3), RAVANA: Wd('valmiki', 1, 0),
    BROTHERS: Wd('ram1', 0, 3), PURE: Wd('ram1', 0, 9), LIFE: Wd('ram1', 1, 11),
    KALIDASA: Wd('kali', 0, 1), FIRE: Wd('sita1', 0, 6), GOSSIP: Wd('sita1', 1, 2), FAMILY: Wd('sita1', 2, 5),
    PRAYS: Wd('pray', 0, 3), HUSBAND: Wd('sita2', 0, 7), HEART: Wd('heart', 0, 9),
    YAGNA: Wd('yagna', 0, 4), TELLS_V: Wd('yagna', 0, 7), SINLESS: Wd('yagna', 1, 4), FORGIVE: Wd('yagna', 1, 5),
    RAM_O: Wd('oath', 0, 8), MOTHER: Wd('oath', 1, 0), OPEN: Wd('oath', 1, 2),
    EARTH: Wd('earth', 0, 2), HOME: Wd('earth', 0, 5),
    NEVER: Wd('gold', 0, 1), EVERY: Wd('gold', 0, 5), GOLD: Wd('gold', 1, 3),
    BHAVA: Wd('bhava', 0, 0), REUNITED: Wd('bhava', 1, 5),
    TULSI: Wd('tulsi', 0, 1), NOEXILE: Wd('tulsi', 1, 2),
    DIVIDED: Wd('split', 0, 6), SITA_W: Wd('split', 1, 2), RAM_W: Wd('split', 1, 5), BOTH: Wd('split', 2, 3),
    YOU: Wd('ask', 0, 3), COMMENT: Wd('ask', 0, 7),
  };
  T.END = T.CARD + 6;
  return T;
})();
