// toran_tl.js: the timeline of "Why mango leaves over the door?" (ad 82), from the voice (toran_vo.js), shared by the
// scene (toran.js) and the sound (tools/toran_sfx.mjs, which loads both files with vm). Re-render the voice and both follow.
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
    B0: mid('hook', 'toran'), C0: mid('toran', 'leave'), D0: mid('leave', 'back'), E0: mid('back', 'dwarka'),
    F0: mid('dwarka', 'kalash'), G0: mid('kalash', 'never'), H0: mid('never', 'lakshmi'), I0: mid('lakshmi', 'ask'),
    J0: mid('ask', 'send'),
    CARD: LN.send.end + 1.4,
    MANGO: Wd('hook', 'mango'), DOOR: Wd('hook', 'door'), WASNT: Wd('hook', 'wasnt'), DECOR: Wd('hook', 'decorating'),
    TORAN: Wd('toran', 'toran'), TORANA: Wd('toran', 'torana'), SANSKRIT: Wd('toran', 'sanskrit'), GATEWAY: Wd('toran', 'gateway'),
    BHAG: Wd('leave', 'bhagavatam'), DHRUVA: Wd('leave', 'dhruva'), CRYING: Wd('leave', 'crying'),
    BACK: Wd('back', 'back'), EVERY: Wd('back', 'every'), CITY: Wd('back', 'city'), LEAVES: Wd('back', 'leaves'), POTS: Wd('back', 'pots'), LAMPS: Wd('back', 'lamps'),
    KRISHNA: Wd('dwarka', 'krishna'), DWARKA: Wd('dwarka', 'dwarka'), WORE: Wd('dwarka', 'wore'), TORANA2: Wd('dwarka', 'torana'),
    SAME: Wd('kalash', 'same'), KALASH: Wd('kalash', 'kalash'), PUJA: Wd('kalash', 'puja'),
    NEVER: Wd('never', 'never'), SAYS: Wd('never', 'says'), LOVE: Wd('never', 'love'), HOME: Wd('never', 'home'),
    DIWALI: Wd('lakshmi', 'diwali'), LAKSHMI: Wd('lakshmi', 'lakshmi'),
    MANGO2: Wd('ask', 'mango'), MARIGOLDS: Wd('ask', 'marigolds'), BEADS: Wd('ask', 'beads'), YOUR: Wd('ask', 'your'), STATE: Wd('ask', 'state'),
    SEND: Wd('send', 'send'), YOURS: Wd('send', 'yours'),
  };
  T.END = T.CARD + 7;
  return T;
})();
