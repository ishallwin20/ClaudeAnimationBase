// ninth_tl.js: the timeline of "The 9th avatar" (ad 81), from the voice (ninth_vo.js), shared by the scene (ninth.js)
// and the sound (tools/ninth_sfx.mjs, which loads both files with vm). Re-render the voice and both follow it.
const TL = (() => {
  const LN = VO.lines, mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const norm = s => s.replace(/[*“”"'’.,:?!]/g, '').toLowerCase();
  // Wd(id, word, n): when the n-th "word" of a line is spoken (case and punctuation ignored)
  const Wd = (id, word, n = 0) => {
    const hits = [];
    VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (norm(w) === norm(word)) hits.push(c.at[i]); }));
    if (hits[n] == null) throw new Error(`no "${word}" in ${id}`); return hits[n];
  };
  const T = {
    B0: mid('hook', 'fight'), C0: mid('fight', 'eight'), D0: mid('eight', 'three'), E0: mid('three', 'varaha'),
    F0: mid('varaha', 'jaya'), G0: mid('jaya', 'desika'), H0: mid('desika', 'mbh'), I0: mid('mbh', 'bhag'),
    J0: mid('bhag', 'countless'), K0: mid('countless', 'save'),
    CARD: LN.ask.end + 1.5,
    NINTH: Wd('hook', 'ninth'), BAL0: Wd('hook', 'balaram'), BUD0: Wd('hook', 'buddha'),
    ASK0: Wd('fight', 'ask'), FIGHT: Wd('fight', 'fight'), BREAK: Wd('fight', 'break'),
    EVERY: Wd('eight', 'every'), AGREES: Wd('eight', 'agrees'), EIGHT: Wd('eight', 'eight'), TEN: Wd('eight', 'ten'),
    TWO: Wd('three', 'two'), PLACES: Wd('three', 'places'), THREE: Wd('three', 'three'), KRI1: Wd('three', 'krishna'), BAL1: Wd('three', 'balaram'), BUD1: Wd('three', 'buddha'),
    VARAHA: Wd('varaha', 'varaha'), PICKS1: Wd('varaha', 'picks'), KRI2: Wd('varaha', 'krishna'), BUD2: Wd('varaha', 'buddha'),
    GEET: Wd('jaya', 'geet'), PICKS2: Wd('jaya', 'picks'), BAL3: Wd('jaya', 'balaram'), BUD3: Wd('jaya', 'buddha'), WHERE: Wd('jaya', 'where'), KRI3: Wd('jaya', 'krishna'), TAKES: Wd('jaya', 'takes'), FORMS: Wd('jaya', 'forms'),
    SOUTH: Wd('desika', 'south'), DESIKA: Wd('desika', 'vedanta'), BAL4: Wd('desika', 'balaram'), KRI4: Wd('desika', 'krishna'), NOBUD: Wd('desika', 'no'),
    MBH: Wd('mbh', 'mahabharats'), NEITHER: Wd('mbh', 'neither'), SWAN: Wd('mbh', 'swan'),
    RIGHT: Wd('bhag', 'right'), BHAG: Wd('bhag', 'bhagavata'), ALL3: Wd('bhag', 'three'), BAL5: Wd('bhag', 'balaram'), N19: Wd('bhag', '19th'), KRI5: Wd('bhag', 'krishna'), N20: Wd('bhag', '20th'), BUD5: Wd('bhag', 'buddha'), N21: Wd('bhag', '21st'),
    COUNTLESS: Wd('countless', 'countless'), STREAMS: Wd('countless', 'streams'), LAKE: Wd('countless', 'lake'),
    SAVE: Wd('save', 'save'), DEBATE: Wd('save', 'debate'), YOUR: Wd('ask', 'your'), COMMENT: Wd('ask', 'comment'), STATE: Wd('ask', 'state'),
  };
  T.END = T.CARD + 7;
  return T;
})();
