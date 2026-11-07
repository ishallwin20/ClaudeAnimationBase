// puja_tl.js: the timeline of "Lakshmi Puja, step by step" (ad 83), from the voice (puja_vo.js), shared by the scene
// (puja.js) and the sound (tools/puja_sfx.mjs, which loads both files with vm). Re-render the voice and both follow.
const TL = (() => {
  const LN = VO.lines, mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const norm = s => s.replace(/[*“”"'’.,:?!…]/g, '').toLowerCase();
  // Wd(id, word, n): when the n-th "word" of a line is spoken (case and punctuation ignored)
  const Wd = (id, word, n = 0) => {
    const hits = [];
    VO.caps.filter(c => c.id === id).forEach(c => c.text.split(/\s+/).filter(w => w && w !== '|').forEach((w, i) => { if (norm(w) === norm(word)) hits.push(c.at[i]); }));
    if (hits[n] == null) throw new Error(`no "${word}" in ${id}`); return hits[n];
  };
  const ids = ['hook', 'when', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 'ask'];
  const T = {};
  ids.forEach((id, i) => { T[id.toUpperCase() + '0'] = i ? mid(ids[i - 1], id) : 0; });
  Object.assign(T, {
    CARD: LN.ask.end + 1.2,
    SAVE: Wd('hook', 'save'), STEP: Wd('hook', 'step'),
    SUNSET: Wd('when', 'sunset'), PRADOSH: Wd('when', 'pradosh'), MUHURAT: Wd('when', 'muhurat'),
    CLEAN: Wd('s1', 'clean'), MANDIR: Wd('s1', 'mandir'), PLATE: Wd('s1', 'plate'), METAL: Wd('s1', 'metal'), BATH: Wd('s1', 'bath'), CLAY: Wd('s1', 'clay'), WIPE: Wd('s1', 'wipe'),
    RED: Wd('s2', 'red'), CHOWKI: Wd('s2', 'chowki'),
    FACE: Wd('s3', 'face'), SARAS: Wd('s3', 'saraswati'), LAKSH: Wd('s3', 'lakshmi'), GANESH: Wd('s3', 'ganesha'), MANY: Wd('s3', 'many'), DIFFER: Wd('s3', 'differ'),
    CLOTHES: Wd('s4', 'clothes'), MALA: Wd('s4', 'mala'), FLOWERS: Wd('s4', 'flowers'), LOTUS: Wd('s4', 'lotus'),
    KALASH: Wd('s5', 'kalash'), WATER: Wd('s5', 'water'), COIN: Wd('s5', 'coin'), SUPARI: Wd('s5', 'supari'), RICE: Wd('s5', 'rice'),
    LEAVES: Wd('s5', 'leaves'), COCONUT: Wd('s5', 'coconut'), SWASTIK: Wd('s5', 'swastik'), MAULI: Wd('s5', 'mauli'), NECK: Wd('s5', 'neck'),
    SIT: Wd('s6', 'sit'), EAST: Wd('s6', 'east'), NORTH: Wd('s6', 'north'), SIP: Wd('s6', 'sip'), THREE: Wd('s6', 'three'), ACHAMAN: Wd('s6', 'achaman'),
    HAND: Wd('s7', 'hand'), NAME: Wd('s7', 'name'), DAY: Wd('s7', 'day'), WHY: Wd('s7', 'why'), SANKALP: Wd('s7', 'sankalp'),
    BEGIN: Wd('s8', 'begin'), GANESHA8: Wd('s8', 'ganesha'), SHIVA: Wd('s8', 'shiva'), FIRST: Wd('s8', 'first'),
    EACH: Wd('s9', 'each'), TILAK: Wd('s9', 'tilak'), AKSHAT: Wd('s9', 'akshat'), FLOWERS9: Wd('s9', 'flowers'), INCENSE: Wd('s9', 'incense'), LAMP9: Wd('s9', 'lamp'), BHOG: Wd('s9', 'bhog'), MANTRA: Wd('s9', 'mantra'),
    HAVAN: Wd('s10', 'havan'), NOW: Wd('s10', 'now'),
    AARTI: Wd('s11', 'aarti'), GFIRST: Wd('s11', 'first'), THENL: Wd('s11', 'lakshmi'),
    FOLDED: Wd('s12', 'folded'), PUSHP: Wd('s12', 'pushpanjali'),
    FORGIVE: Wd('s13', 'forgiveness'), MANTRAH: Wd('s13', 'mantra-heenam'), BHAKTI: Wd('s13', 'bhakti-heenam'), MISSED: Wd('s13', 'missed'), LOVE: Wd('s13', 'love'), COMPLETE: Wd('s13', 'complete'),
    DIYAS: Wd('s14', 'diyas'), ROOM: Wd('s14', 'room'), RANGOLI: Wd('s14', 'rangoli'), FOOT: Wd('s14', 'footprints'), DOOR: Wd('s14', 'door'), ALL: Wd('s14', 'all'),
    YOUR: Wd('ask', 'your'), COMMENT: Wd('ask', 'comment'), SAVE2: Wd('ask', 'save'),
  });
  T.END = T.CARD + 7;
  return T;
})();
