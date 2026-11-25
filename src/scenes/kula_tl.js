// kula_tl.js: the timeline of ad 115 (Parvatha Raja Kulam), from the voice (kula_vo.js), shared by the scene (kula.js)
// and the sound (tools/kula_sfx.mjs, which loads both files with vm).
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
    // the shots
    B0: mid('hook', 'diya'),               // one home's diya
    B1: LN.years.a - .25,                  //   the years spin
    C0: mid('years', 'wick'),              // the wick: the cloth by the pot
    C1: Wd('wick', 'stand') - .35,         //   stood up beside the hill
    D0: mid('wick', 'pot'),                // the kopparai at dawn
    E0: mid('pot', 'carry'),               // carried up the mountain
    F0: mid('carry', 'fisher'),            // the lighters at dusk
    G0: mid('fisher', 'far'),              // the map: 90 km from the sea
    H0: mid('far', 'born'),                // the shore: Parvati born a fisherman's daughter
    I0: mid('born', 'shark'),              // the shark
    I1: mid('shark', 'vow'),               // the chief's vow
    J0: mid('vow', 'net'),                 // the net
    K0: mid('net', 'reveal'),              // the fisherman was Shiva
    K1: mid('reveal', 'nandi'),            // the shark? Nandi
    L0: mid('nandi', 'clan'),              // Parvatha Raja Kulam
    M0: mid('clan', 'bride'),              // the bride's family climbs
    N0: mid('bride', 'ask'),               // eleven days; tag them
    CARD: LN.ask.end + 1.3,
    // the words
    KILOS: Wd('hook', '3500'), MOUNTAIN: Wd('hook', 'mountain'), ONE: Wd('diya', 'one'), EVENING: Wd('diya', 'evening'), YEARS: Wd('years', 'years'),
    METRES: Wd('wick', 'metres'), TWICE: Wd('wick', 'twice'), MOUNT2: Wd('wick', 'mountain'),
    COPPER: Wd('pot', 'copper'), MAN: Wd('pot', 'man'), FOUR: Wd('pot', 'four'), FORTY: Wd('carry', '40'), FOOT: Wd('carry', 'foot'),
    GENS: Wd('fisher', 'generations'), FISHER: Wd('fisher', 'fishermen'), KM: Wd('far', '90'), SEA: Wd('far', 'sea'),
    PURANAM: Wd('born', 'tiruvilaiyadal'), PARVATI: Wd('born', 'parvati'), CHIEF: Wd('born', 'chief'),
    SHARK: Wd('shark', 'shark'), MARRIES: Wd('vow', 'marries'), NET: Wd('net', 'net'), DRAGS: Wd('net', 'drags'),
    SHIVA: Wd('reveal', 'shiva'), NANDI: Wd('nandi', 'nandi'), KULAM: Wd('clan', 'parvatha'), FATHER: Wd('clan', 'father'),
    BRIDE: Wd('bride', 'brides'), HIS: Wd('bride', 'his'), LIGHTS: Wd('bride', 'lights'), FIRE: Wd('bride', 'fire'),
    DAYS: Wd('ask', '11'), TAG: Wd('ask', 'tag'),
  };
  T.M1 = T.LIGHTS - .45;                  // the ignition shot
  T.END = T.CARD + 6.5;
  return T;
})();
