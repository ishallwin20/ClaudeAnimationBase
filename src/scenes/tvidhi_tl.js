// tvidhi_tl.js: the timeline of "Tulsi Vivah, step by step" (ad 105), from the voice (tvidhi_vo.js), shared by the scene
// (tvidhi.js) and the sound (tools/tvidhi_sfx.mjs, which loads both files with vm). Re-render the voice and both follow.
const TL = (() => {
  const LN = VO.lines, mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const norm = s => s.replace(/[*“”"'’.,:?!…]/g, '').toLowerCase();
  // Wd(id, word, n): when the n-th "word" of a line is spoken (case and punctuation ignored)
  const Wd = (id, word, n = 0) => {
    const hits = [];
    VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (norm(w) === norm(word)) hits.push(c.at[i]); }));
    if (hits[n] == null) throw new Error(`no "${word}" in ${id}`); return hits[n];
  };
  const ids = ['hook', 'when', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 'close', 'ask'];
  const T = {};
  ids.forEach((id, i) => { T[id.toUpperCase() + '0'] = i ? mid(ids[i - 1], id) : 0; });
  Object.assign(T, {
    CARD: LN.ask.end + 1.2,
    SAT: Wd('hook', 'saturday'), SAVE: Wd('hook', 'save'), STEP: Wd('hook', 'step'),
    DWADASHI: Wd('when', 'dwadashi'), DUSK: Wd('when', 'dusk'), GODHULI: Wd('when', 'godhuli'), FAST: Wd('when', 'fast'), EVENING: Wd('when', 'evening'),
    CLEAN: Wd('s1', 'clean'), CHAURA: Wd('s1', 'chaura'), RANGOLI: Wd('s1', 'rangoli'), PICK: Wd('s1', 'pick'), BEFORE: Wd('s1', 'before'),
    MANDAP: Wd('s2', 'mandap'), FOUR: Wd('s2', 'four'), CANE: Wd('s2', 'sugarcane'), TIED: Wd('s2', 'tied'), TORAN: Wd('s2', 'toran'), MARIGOLDS: Wd('s2', 'marigolds'),
    BRIDE: Wd('s3', 'bride'), CHUNARI: Wd('s3', 'chunari'), BANGLES: Wd('s3', 'bangles'), BINDI: Wd('s3', 'bindi'), GENTLY: Wd('s3', 'gently'), LIVING: Wd('s3', 'living'),
    GROOM: Wd('s4', 'groom'), SHALI: Wd('s4', 'shaligram'), BATHE: Wd('s4', 'bathe'), YELLOW: Wd('s4', 'yellow'), TILAK: Wd('s4', 'tilak'), SEAT: Wd('s4', 'seat'), BESIDE: Wd('s4', 'beside'),
    NOSHALI: Wd('s4', 'shaligram', 1), VISHNU: Wd('s4', 'vishnu'), KRISHNA: Wd('s4', 'krishna'),
    SIT: Wd('s5', 'sit'), NORTH: Wd('s5', 'north'), GANESHA: Wd('s5', 'ganesha'), SANKALP: Wd('s5', 'sankalp'),
    BOTH: Wd('s6', 'both'), FLOWERS: Wd('s6', 'flowers'), SANDAL: Wd('s6', 'sandal'), KUMKUM: Wd('s6', 'kumkum'), AKSHAT: Wd('s6', 'akshat'), INCENSE: Wd('s6', 'incense'), LAMP: Wd('s6', 'lamp'),
    KANYA: Wd('s7', 'kanyadaan'), GIVE: Wd('s7', 'give'), WATER: Wd('s7', 'water'), COUPLES: Wd('s7', 'couples'),
    TIE: Wd('s8', 'tie'), TOGETHER: Wd('s8', 'together'), THREAD: Wd('s8', 'thread'), EDGE: Wd('s8', 'edge'),
    VERSES: Wd('s9', 'verses'), MANGAL: Wd('s9', 'mangalashtak'), SAVDHAN: Wd('s9', 'savdhan'), SHOWERS: Wd('s9', 'showers'),
    PHERAS: Wd('s10', 'pheras'), CARRY: Wd('s10', 'carry'), SEVEN: Wd('s10', 'seven'), MANY: Wd('s10', 'many'),
    SINDOOR: Wd('s11', 'sindoor'), AARTI: Wd('s11', 'aarti'), CAMPHOR: Wd('s11', 'camphor'),
    BHOG: Wd('s12', 'bhog'), SEASON: Wd('s12', 'season'), CANE2: Wd('s12', 'sugarcane'), AMLA: Wd('s12', 'amla'), BER: Wd('s12', 'ber'), POTATO: Wd('s12', 'potato'), PRASAD: Wd('s12', 'prasad'),
    OPENS: Wd('close', 'opens'), WSEASON: Wd('close', 'season'),
    ROUNDS: Wd('ask', 'rounds'), COMMENT: Wd('ask', 'comment'), SAVE2: Wd('ask', 'save'),
  });
  T.END = T.CARD + 7;
  return T;
})();
