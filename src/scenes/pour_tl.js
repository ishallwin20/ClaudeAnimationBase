// pour_tl.js: the timeline of "What you POUR on SHIVA decides what you GET", from the voice (pour_vo.js), shared by the
// scene (pour.js) and the sound (tools/pour_sfx.mjs, which loads both files with vm). Re-render the voice and the
// picture and the sound move with it.
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
    B0: mid('hook', 'splash'), C0: mid('splash', 'stream'), D0: mid('stream', 'water'), E0: mid('water', 'ghee'),
    F0: mid('ghee', 'milk'), G0: mid('milk', 'honey'), H0: mid('honey', 'cane'), I0: mid('cane', 'enemy'),
    J0: mid('enemy', 'only'), L0: mid('ganga', 'mantra'), M0: mid('mantra', 'save'), N0: mid('save', 'ask'),
    O0: mid('ask', 'next'), CARD: LN.next.end + 1.2,
    // words the picture lands on
    POUR: Wd('hook', 'pour'), SHIVA: Wd('hook', 'shiva'), GET: Wd('hook', 'get'),
    SPLASH: Wd('splash', 'splash'), PURANA: Wd('stream', 'purana'), STREAM: Wd('stream', 'stream'), BREAKS: Wd('stream', 'breaks'),
    WATER: Wd('water', 'water'), FEVER: Wd('water', 'fever'),
    GHEE: Wd('ghee', 'ghee'), FAMILY: Wd('ghee', 'family'),
    MILK: Wd('milk', 'milk'), SUGAR: Wd('milk', 'sugar'), BRIHASPATI: Wd('milk', 'brihaspati'), GURU: Wd('milk', 'guru'),
    HONEY: Wd('honey', 'honey'), KUBERA: Wd('honey', 'kubera'),
    CANE: Wd('cane', 'sugarcane'), JOY: Wd('cane', 'joy'),
    ENEMIES: Wd('enemy', 'enemies'),
    ONE: Wd('only', 'one'), MOKSHA: Wd('only', 'moksha'), GANGA: Wd('ganga', 'ganga'),
    MANTRA: Wd('mantra', 'mahamrityunjaya'), TEN: Wd('mantra', 'ten'), TIMES: Wd('mantra', 'times'),
    SCREEN: Wd('save', 'screenshot'), MONDAY: Wd('save', 'monday'),
    YOU: Wd('ask', 'you'), COMMENT: Wd('ask', 'comment'),
    NEXT: Wd('next', 'next'), AARTI: Wd('next', 'aarti'), FOLLOW: Wd('next', 'follow'),
  };
  T.K0 = T.GANGA - .5;
  T.END = T.CARD + 7.2;
  return T;
})();
