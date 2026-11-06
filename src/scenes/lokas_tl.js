// lokas_tl.js: the timeline of "7 worlds below your feet" (ad 79), from the voice (lokas_vo.js), shared by the scene
// (lokas.js) and the sound (tools/lokas_sfx.mjs, which loads both files with vm). Re-render the voice and the picture
// and the sound move with it.
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
    B0: mid('hook', 'hell'), C0: mid('hell', 'narada'), D0: mid('narada', 'deep'),
    W0: [mid('deep', 'atala'), mid('atala', 'vitala'), mid('vitala', 'sutala'), mid('sutala', 'talatala'), mid('talatala', 'mahatala'), mid('mahatala', 'rasatala'), mid('rasatala', 'patala')],
    L0: mid('patala', 'shesha'), M0: mid('shesha', 'save'),
    CARD: LN.ask.end + 1.3,
    SEVEN: Wd('hook', 'seven'), FEET: Wd('hook', 'feet'), NOT: Wd('hell', 'not'), HELL: Wd('hell', 'hell'),
    NARADA: Wd('narada', 'narada'), DOWN: Wd('narada', 'down'), THERE: Wd('narada', 'there'), BEAUTIFUL: Wd('narada', 'beautiful'), INDRA: Wd('narada', 'indras'), HEAVEN: Wd('narada', 'heaven'),
    SEVEN2: Wd('deep', 'seven'), YOJANAS: Wd('deep', 'yojanas'), DEEP: Wd('deep', 'deep'),
    NAME: ['atala', 'vitala', 'sutala', 'talatala', 'mahatala', 'rasatala', 'patala'].map((id, i) => Wd(id, ['atal', 'vital', 'sutal', 'talatal', 'mahatal', 'rasatal', 'patal'][i])),
    BALA: Wd('atala', 'bala'), MAYA1: Wd('atala', 'maya'), N96: Wd('atala', '96'), MAGIC: Wd('atala', 'magic'),
    SHIVA1: Wd('vitala', 'shiva'), LORD: Wd('vitala', 'lord'), GOLD: Wd('vitala', 'gold'),
    BALI: Wd('sutala', 'bali'), DOOR: Wd('sutala', 'door'), VISHNU: Wd('sutala', 'vishnu'), GUARD: Wd('sutala', 'guard'), MACE: Wd('sutala', 'mace'), HAND: Wd('sutala', 'hand'),
    MAYA: Wd('talatala', 'maya'), ARCH: Wd('talatala', 'architect'), SHIVA2: Wd('talatala', 'shiva'), BURNED: Wd('talatala', 'burned'), CITIES: Wd('talatala', 'cities'), PLEASED: Wd('talatala', 'pleased'), GAVE: Wd('talatala', 'gave'), BACK: Wd('talatala', 'back'),
    MANY: Wd('mahatala', 'many'), HOODS: Wd('mahatala', 'hoods'), AFRAID: Wd('mahatala', 'afraid'), GARUDA: Wd('mahatala', 'garuda'),
    DEMONS: Wd('rasatala', 'demons'), HIDING: Wd('rasatala', 'hiding'), HOLES: Wd('rasatala', 'holes'), INDRA2: Wd('rasatala', 'indra'),
    DEEPEST: Wd('patala', 'deepest'), VASUKI: Wd('patala', 'vasuki'), NAGAS: Wd('patala', 'nagas'), NO: Wd('patala', 'no'), SUN: Wd('patala', 'sun'), JEWELS: Wd('patala', 'jewels'), LIGHT: Wd('patala', 'light'), EVERY: Wd('patala', 'everything'),
    BELOW: Wd('shesha', 'below'), ANANTA: Wd('shesha', 'ananta'), WHOLE: Wd('shesha', 'whole'), UNIVERSE: Wd('shesha', 'universe'), ONE: Wd('shesha', 'one'), MUSTARD: Wd('shesha', 'mustard'), SEED: Wd('shesha', 'seed'),
    SAVE: Wd('save', 'save'), PATAL2: Wd('save', 'patal'), HELL2: Wd('save', 'hell'), YOU: Wd('ask', 'you'), COMMENT: Wd('ask', 'comment'),
  };
  T.END = T.CARD + 7;
  return T;
})();
