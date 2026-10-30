// never_tl.js: the timeline of "NEVER offer THIS flower to SHIVA", from the voice (never_vo.js), shared by the scene
// (never.js) and the sound (tools/never_sfx.mjs, which loads both files with vm). Re-render the voice and the picture
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
    B0: mid('lie', 'fight'), C0: mid('pillar', 'search'), C1: Wd('search', 'brahma') - .15, D0: mid('search', 'fell'),
    E0: mid('fell', 'beg'), F0: mid('lied', 'curse'), G0: mid('curse', 'champa'), H0: mid('champa', 'tulsi'),
    I0: mid('lists', 'ganesha'), J0: mid('cursed', 'vishnu'), K0: mid('vishnu', 'save'), L0: mid('save', 'ask'),
    M0: mid('ask', 'next'), CARD: LN.next.end + 1.2,
    // words the picture lands on
    NEVER0: Wd('hook', 'never'), SHIVA0: Wd('hook', 'shiva'), LIE: Wd('lie', 'lie'),
    BRAHMA: Wd('fight', 'brahma'), VISHNU: Wd('fight', 'vishnu'), GREATER: Wd('fight', 'greater'),
    PILLAR: Wd('pillar', 'pillar'), NOEND: Wd('pillar', 'end'),
    ROOT: Wd('search', 'root'), TOP: Wd('search', 'top'),
    FELL: Wd('fell', 'fell'), HEAD: Wd('fell', 'head'), KETAKI: Wd('fell', 'ketaki'),
    SAY: Wd('beg', 'say'), LIED: Wd('lied', 'lied'),
    SAID: Wd('curse', 'said'), WORSHIP: Wd('curse', 'worship'),
    PURANA: Wd('champa', 'purana'), CHAMPA: Wd('champa', 'champa'),
    TULSI: Wd('tulsi', 'tulsi'), NEVER: Wd('tulsi', 'never'),
    LISTS: Wd('lists', 'lists'), JOY: Wd('lists', 'joy'), MOKSHA: Wd('lists', 'moksha'),
    REFUSES: Wd('ganesha', 'refuses'), GANESHA: Wd('ganesha', 'ganesha'),
    MARRY: Wd('cursed', 'marry'), NO: Wd('cursed', 'no'), CURSED: Wd('cursed', 'cursed'),
    TWO: Wd('vishnu', 'two'), VLOVES: Wd('vishnu', 'vishnu'), LOVES: Wd('vishnu', 'loves'),
    SCREEN: Wd('save', 'screenshot'),
    ALLOWED: Wd('ask', 'allowed'), YES: Wd('ask', 'yes'), NOQ: Wd('ask', 'no'),
    NEXT: Wd('next', 'next'), POUR: Wd('next', 'pour'), GET: Wd('next', 'get'), FOLLOW: Wd('next', 'follow'),
  };
  T.END = T.CARD + 7.2;
  // the card's beats
  Object.assign(T, { CAP_T: T.CARD + .35, COVERS: T.CARD + .7, PRICE: T.CARD + 1.25, PILL: T.CARD + 1.65, FOLLOW_C: T.CARD + 1.95 });
  return T;
})();
