// chhath_tl.js: the timeline of the Chhath reel (ad 97), from the voice (chhath_vo.js), shared by the scene (chhath.js)
// and the sound (tools/chhath_sfx.mjs, which loads both files with vm). Re-render the voice and both follow.
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
    B0: mid('hook', 'what'), C0: mid('what', 'd1'), D0: mid('d1', 'd2'), F0: mid('d2', 'd3'), G0: mid('d3', 'd4'), H0: LN.rise.a - .55,
    I0: mid('rise', 'maiya'), J0: mid('maiya', 'mean'), K0: mid('mean', 'ask'), CARD: LN.ask.end + 1.5,
    RISING: Wd('hook', 'rising'), ONE: Wd('hook', 'one'), SETTING: Wd('hook', 'setting'),
    CHHATH: Wd('what', 'chhath'), PRIEST: Wd('what', 'priest'), IDOL: Wd('what', 'idol'), TEMPLE: Wd('what', 'temple'), JUST: Wd('what', 'just'), RIVER: Wd('what', 'river'), SUN: Wd('what', 'sun'), FAST: Wd('what', 'fast'), H36: Wd('what', '36'),
    DAY1: Wd('d1', 'day'), DIP: Wd('d1', 'dip'), MEAL: Wd('d1', 'meal'), RICE: Wd('d1', 'rice'), DAL: Wd('d1', 'dal'), LAUKI: Wd('d1', 'lauki'),
    DAY2: Wd('d2', 'day'), FASTALL: Wd('d2', 'fast'), NIGHT: Wd('d2', 'night'), KHEER: Wd('d2', 'kheer'), ROTI: Wd('d2', 'roti'), STOVE: Wd('d2', 'stove'), THEN: Wd('d2', 'then'), E36: Wd('d2', '36'), FOOD: Wd('d2', 'food'), DROP: Wd('d2', 'drop'), WATER: Wd('d2', 'water'),
    DAY3: Wd('d3', 'day'), WAIST: Wd('d3', 'waist-deep'), SOOP: Wd('d3', 'soop'), FRUIT: Wd('d3', 'fruit'), THEKUA: Wd('d3', 'thekua'), RAISED: Wd('d3', 'raised'), SET3: Wd('d3', 'setting'),
    DAY4: Wd('d4', 'day'), DAWN: Wd('d4', 'dawn'), COLD: Wd('d4', 'cold'), WAITING: Wd('d4', 'waiting'),
    RISES: Wd('rise', 'rises'), ONLY: Wd('rise', 'only'), BREAK: Wd('rise', 'break'),
    MAIYA: Wd('maiya', 'chhathi'), SHASHTHI: Wd('maiya', 'shashthi'), GUARD: Wd('maiya', 'guardian'), FOLK: Wd('maiya', 'folk'), SISTER: Wd('maiya', 'sister'),
    SALUTES: Wd('mean', 'salutes'), RISING2: Wd('mean', 'rising'), BOWS: Wd('mean', 'bows'), SETS: Wd('mean', 'sets'), BECAUSE: Wd('mean', 'because'), RISE2: Wd('mean', 'rise'),
    GHAT: Wd('ask', 'ghat'), SAY: Wd('ask', 'say'), JAI: Wd('ask', 'jai'),
  };
  T.END = T.CARD + 6.5;
  return T;
})();
