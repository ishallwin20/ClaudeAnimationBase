// nidhi_tl.js: the timeline of ad 116 (Nidhivan), from the voice (nidhi_vo.js), shared by the scene (nidhi.js) and the
// sound (tools/nidhi_sfx.mjs, which loads both files with vm).
(() => {
  for (let i = 0; i < VO.caps.length - 1; i++) { const a = VO.caps[i], b = VO.caps[i + 1]; if (b.a - a.b < 1.2) a.b = b.a - .02; }
})();
const TL = (() => {
  const LN = VO.lines, mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const norm = s => s.replace(/[*“”"'’.,:?!…]/g, '').toLowerCase();
  const Wd = (id, word, n = 0) => {
    const hits = [];
    VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (norm(w) === norm(word)) hits.push(c.at[i]); }));
    if (hits[n] == null) throw new Error(`no "${word}" in ${id}`); return hits[n];
  };
  const T = {
    B0: mid('hook', 'reason') + .1,        // through the gate at dusk
    C0: mid('reason', 'name'),             // the path at dusk: Nidhivan, Banke Bihari, Haridas
    D0: mid('name', 'belief'),             // night falls: the moonlit path
    E0: mid('belief', 'trees'),            // a pair of trees
    F0: mid('trees', 'bed'),               // the Rang Mahal at night, the bed made
    G0: LN.items.a - .25,                  // the offerings, one by one
    H0: mid('items', 'lock'),              // the doors shut, the lock
    I0: mid('lock', 'windows'),            // the neighbour's bricked window
    J0: mid('windows', 'twist'),           // the peek through the leaves
    K0: mid('twist', 'morning'),           // dawn in the Rang Mahal
    L0: mid('morning', 'true'),            // the gate at dawn: true?
    M0: mid('true', 'bhag'),               // the Raas ring from above
    O0: mid('bhag', 'hear'),               // Radha-Krishna, close
    P0: mid('hear', 'ask'),                // the path at night, lamplight in the Rang Mahal's door: do you believe?
    CARD: LN.ask.end + 1.2,
    // the words
    NOBODY: Wd('hook', 'nobody'), SUNSET: Wd('hook', 'sunset'), BELIEVE: Wd('reason', 'believe'),
    NIDHIVAN: Wd('name', 'nidhivan'), BANKE: Wd('name', 'banke'), HARIDAS: Wd('name', 'haridas'),
    KRISHNA: Wd('belief', 'krishna'), MAHARAAS: Wd('belief', 'maharaas'), RADHA: Wd('belief', 'radha'), GOPIS: Wd('belief', 'gopis'),
    PAIRS: Wd('trees', 'pairs'), TWISTED: Wd('trees', 'twisted'), NIGHT: Wd('trees', 'night'), GOPIS2: Wd('trees', 'gopis'),
    BED: Wd('bed', 'bed'), RANG: Wd('bed', 'rang'),
    WATER: Wd('items', 'water'), PAAN: Wd('items', 'paan'), SWEETS: Wd('items', 'sweets'), NEEM: Wd('items', 'neem'), BANGLES: Wd('items', 'bangles'), SINDOOR: Wd('items', 'sindoor'),
    LOCKED: Wd('lock', 'locked'), OUTSIDE: Wd('lock', 'outside'),
    WINDOWS: Wd('windows', 'windows'), BRICKED: Wd('windows', 'bricked'),
    WARN: Wd('twist', 'warn'), WATCH: Wd('twist', 'watch'), SIGHT: Wd('twist', 'sight'), MIND: Wd('twist', 'mind'),
    DAWN: Wd('morning', 'dawn'), SLEPT: Wd('morning', 'slept'), WATER2: Wd('morning', 'water'), PAAN2: Wd('morning', 'paan'),
    TRUE: Wd('true', 'true'), FILMED: Wd('true', 'filmed'), SUPPOSED: Wd('true', 'supposed'),
    BHAG: Wd('bhag', 'bhagavatam'), RAAS: Wd('bhag', 'raas'), MANY: Wd('bhag', 'many'), GOPIS3: Wd('bhag', 'gopis'),
    SEE: Wd('hear', 'see'), HEARS: Wd('hear', 'hears'), DISEASE: Wd('hear', 'disease'),
    BELIEVE2: Wd('ask', 'believe'), COMES: Wd('ask', 'comes'), WRITE: Wd('ask', 'write'), RADHE: Wd('ask', 'radhe'),
  };
  T.END = T.CARD + 7;
  return T;
})();
