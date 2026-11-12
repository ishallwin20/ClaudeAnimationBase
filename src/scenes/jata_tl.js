// jata_tl.js: the timeline of "Why do some sadhus keep JATA and some SHAVE?" (ad 87), from the voice (jata_vo.js), shared
// by the scene (jata.js) and the sound (tools/jata_sfx.mjs, which loads both files with vm). Re-render the voice and both follow.
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
    B0: mid('hook', 'two'), C0: mid('two', 'hermit'), D0: mid('hermit', 'ram'), E0: mid('ram', 'wander'), F0: mid('wander', 'same'),
    G0: mid('same', 'today'), H0: mid('today', 'twist'), I0: mid('twist', 'bhaja'), J0: mid('bhaja', 'ask'),
    CARD: LN.ask.end + 1.4,
    NEVER: Wd('hook', 'never'), SHAVE: Wd('hook', 'shave'), WHY: Wd('hook', 'why'),
    TWO: Wd('two', 'two'), ROADS: Wd('two', 'roads'),
    HERMIT: Wd('hermit', 'hermit'), MANU: Wd('hermit', 'manu'), JATA: Wd('hermit', 'jata'), BEARD: Wd('hermit', 'beard'), NAILS: Wd('hermit', 'nails'),
    RAM: Wd('ram', 'ram'), FOREST: Wd('ram', 'forest'), ASKED: Wd('ram', 'asked'), BANYAN: Wd('ram', 'banyan'), MILK: Wd('ram', 'milk'), MATTED: Wd('ram', 'matted'),
    SANNYASI: Wd('wander', 'sannyasi'), NOTHING: Wd('wander', 'nothing'), SHAVEN: Wd('wander', 'shaven'), SHIKHA: Wd('wander', 'shikha'), GIVEN: Wd('wander', 'given'),
    ONE1: Wd('same', 'one', 0), ONE2: Wd('same', 'one', 1), BOTH: Wd('same', 'both'), SAME: Wd('same', 'same'), COMB: Wd('same', 'comb'),
    SHIVA: Wd('today', 'shiva'), MATTEDH: Wd('today', 'matted-haired'), KEEP: Wd('today', 'keep'), NAGA: Wd('today', 'naga'), DANDI: Wd('today', 'dandi'), STAFF: Wd('today', 'staff'), SHAVEN2: Wd('today', 'shaven'),
    NAGA2: Wd('twist', 'naga'), SHAVED: Wd('twist', 'shaved'), DIKSHA: Wd('twist', 'diksha'),
    BHAJA: Wd('bhaja', 'bhaja'), MATTED2: Wd('bhaja', 'matted'), STOMACH: Wd('bhaja', 'stomach'), COSTUME: Wd('bhaja', 'costume'),
    YOU: Wd('ask', 'you'), JATA2: Wd('ask', 'jata'), COMMENT: Wd('ask', 'comment'), PLACE: Wd('ask', 'place'),
  };
  T.END = T.CARD + 7;
  return T;
})();
