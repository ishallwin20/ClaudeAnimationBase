// dhan_tl.js: the timeline of "DHANTERAS was never about GOLD", from the voice (dhan_vo.js), shared by the scene
// (dhan.js) and the sound (tools/dhan_sfx.mjs, which loads both files with vm). Re-render the voice and the picture and
// the sound move with it.
const TL = (() => {
  const LN = VO.lines, mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  // Wd(id, word, n): when the n-th "word" of a line is spoken (case and punctuation ignored)
  const norm = s => s.replace(/[*“”"'’.,:?!]/g, '').toLowerCase();
  const Wd = (id, word, n = 0) => {
    const hits = [];
    VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (norm(w) === norm(word)) hits.push(c.at[i]); }));
    if (hits[n] == null) throw new Error(`no "${word}" in ${id}`); return hits[n];
  };
  const T = {
    C0: mid('name', 'churn'), D0: mid('churn', 'treasure'), E0: mid('treasure', 'lakshmi'), F0: mid('lakshmi', 'kept'),
    G0: mid('kept', 'last'), H0: mid('last', 'health'), I0: mid('health', 'prize'), J0: mid('prize', 'lamp'),
    K0: mid('lamp', 'yama'), L0: mid('yama', 'gold'), M0: mid('gold', 'save'), N0: LN.ask.a - .35, O0: mid('ask', 'next'),
    CARD: LN.next.end + 1.2,
    // words the picture lands on
    GOLD0: Wd('hook', 'gold'), NAME: Wd('name', 'dhanvantari'), TRAY: Wd('name', 'trayodashi'),
    OCEAN: Wd('churn', 'ocean'), ONE: Wd('churn', 'one'), AMRIT: Wd('churn', 'amrit'),
    TREAS: Wd('treasure', 'treasures'), COW: Wd('treasure', 'wish-cow'), ELEPHANT: Wd('treasure', 'elephant'), JEWEL: Wd('treasure', 'jewel'),
    LAKSHMI: Wd('lakshmi', 'lakshmi'), WEALTH: Wd('lakshmi', 'wealth'),
    CHURNING: Wd('kept', 'churning'),
    LAST: Wd('last', 'last'), DHANV: Wd('last', 'dhanvantari'), JUG: Wd('last', 'jug'), AMRIT2: Wd('last', 'amrit'),
    HEALTH: Wd('health', 'health'), AYURVEDA: Wd('health', 'ayurveda'),
    WEALTH2: Wd('prize', 'wealth'), LIFE: Wd('prize', 'life'), PRIZE: Wd('prize', 'prize'),
    PADMA: Wd('lamp', 'padma'), RULE: Wd('lamp', 'rule'),
    LAMP: Wd('yama', 'lamp'), YAMA: Wd('yama', 'yama'), DOOR: Wd('yama', 'door'), DEATH: Wd('yama', 'death'),
    WORD: Wd('gold', 'word'), GOLD: Wd('gold', 'gold'),
    SCREEN: Wd('save', 'screenshot'), FRIDAY: Wd('save', 'friday'),
    GOLD2: Wd('ask', 'gold'), HEALTH2: Wd('ask', 'health'), COMMENT: Wd('ask', 'comment'),
    NEXT: Wd('next', 'next'), AARTI: Wd('next', 'aarti'), FOLLOW: Wd('next', 'follow'),
  };
  T.END = T.CARD + 7.2;
  return T;
})();
