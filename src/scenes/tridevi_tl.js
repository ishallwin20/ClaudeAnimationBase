// tridevi_tl.js: the timeline of "Lakshmi was born as BRAHMA'S sister" (ad 91), from the voice (tridevi_vo.js), shared by
// the scene (tridevi.js) and the sound (tools/tridevi_sfx.mjs, which loads both files with vm). Re-render the voice and
// both follow.
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
    B0: mid('hook', 'src'), C0: mid('src', 'one'), D0: mid('one', 'pairs'), E0: mid('pairs', 'cross'), F0: mid('cross', 'egg'),
    G0: mid('egg', 'why'), H0: mid('why', 'life'), I0: mid('life', 'onemore'), J0: mid('onemore', 'ask'),
    CARD: LN.ask.end + 1.4,
    LAKSHMI: Wd('hook', 'lakshmi'), BRAHMAS: Wd('hook', 'brahmas'), SISTER: Wd('hook', 'sister'), SARASWATI: Wd('hook', 'saraswati'), SHIVAS: Wd('hook', 'shivas'),
    DEVI: Wd('src', 'devi'), SECRET: Wd('src', 'secret'), PRADHANIKA: Wd('src', 'pradhanika'),
    ONE: Wd('one', 'one'), MAHAL: Wd('one', 'mahalakshmi'), THREE: Wd('one', 'three'), MAHAK: Wd('one', 'mahakali'), MOON: Wd('one', 'moon-bright'), MAHAS: Wd('one', 'mahasaraswati'),
    PAIR: Wd('pairs', 'pair'), P_BR: Wd('pairs', 'brahma'), P_LA: Wd('pairs', 'lakshmi'), P_SH: Wd('pairs', 'shiva'), P_SA: Wd('pairs', 'saraswati'), P_VI: Wd('pairs', 'vishnu'), P_GA: Wd('pairs', 'gauri'), P_PA: Wd('pairs', 'parvati'),
    DIFFERENT: Wd('cross', 'different'), X_SA: Wd('cross', 'saraswati'), X_GA: Wd('cross', 'gauri'), X_LA: Wd('cross', 'lakshmi'), X_BR: Wd('cross', 'brahma'), X_SH: Wd('cross', 'shiva'), X_VI: Wd('cross', 'vishnu'),
    E_BR: Wd('egg', 'brahma'), EGG: Wd('egg', 'egg'), E_SH: Wd('egg', 'shiva'), OPEN: Wd('egg', 'open'), E_VI: Wd('egg', 'vishnu'), PROTECT: Wd('egg', 'protect'), INSIDE: Wd('egg', 'inside'),
    ALONE: Wd('why', 'alone'), KNOW: Wd('why', 'knowledge'), STRONG: Wd('why', 'strength'), WEALTH: Wd('why', 'wealth'),
    WASTED: Wd('life', 'wasted'), L_KN: Wd('life', 'knowledge', 1), HELPLESS: Wd('life', 'helpless'), L_ST: Wd('life', 'strength', 1), DANGEROUS: Wd('life', 'dangerous'),
    ENDS: Wd('onemore', 'ends'), ONE2: Wd('onemore', 'one'), MAHAL2: Wd('onemore', 'mahalakshmi'), MOTHER: Wd('onemore', 'mother'),
    YOUR: Wd('ask', 'your'), A_LA: Wd('ask', 'lakshmi'), A_SA: Wd('ask', 'saraswati'), A_PA: Wd('ask', 'parvati'), COMMENT: Wd('ask', 'comment'), STATE: Wd('ask', 'state'),
  };
  T.END = T.CARD + 7;
  return T;
})();
