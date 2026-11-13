// palm_tl.js: the timeline of "Your palm has FOUR holy places" (ad 92), from the voice (palm_vo.js), shared by the
// scene (palm.js) and the sound (tools/palm_sfx.mjs, which loads both files with vm). Re-render the voice and both follow.
// The ask's word times, measured (whisper + silencedetect on the take): the tool's estimate had "1 2 3 4" bunched and
// the last caption starting before "and save".
(() => {
  const ask = VO.caps.filter(c => c.id === 'ask');
  if (ask.length === 3 && ask[1].text.startsWith('Comment')) {
    const o = VO.lines.ask.a, R = (v) => o + v;   // offsets from the line's start (the take is cached, so they hold)
    ask[0].b = R(2.059);
    Object.assign(ask[1], { a: R(2.079), b: R(5.359), at: [2.199, 2.959, 3.639, 4.099, 4.639, 4.859].map(R) });
    Object.assign(ask[2], { a: R(5.379), at: [5.499, 5.709, 6.009, 6.459, 6.659, 6.859, 7.109].map(R) });
  }
  // the rule's "ONE or TWO" (measured the same way: the estimate had ONE 0.5 s late)
  const rule = VO.caps.filter(c => c.id === 'rule');
  if (rule.length === 3 && rule[1].text.startsWith('*ONE*')) {
    const o = VO.lines.rule.a, R = (v) => o + v;
    rule[0].b = R(3.195);
    Object.assign(rule[1], { a: R(3.215), at: [3.305, 3.855, 4.015, 4.575, 4.815, 5.015, 5.215].map(R) });
  }
})();
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
    B0: mid('hook', 'src'), C0: mid('src', 'one'), D0: mid('one', 'two'), E0: mid('two', 'three'), F0: mid('three', 'four'),
    G0: mid('four', 'rule'), H0: mid('rule', 'how'), I0: mid('how', 'ask'),
    CARD: LN.ask.end + 1.4,
    PALM: Wd('hook', 'palm'), FOUR: Wd('hook', 'four'), ONE0: Wd('hook', 'one'), DEAD: Wd('hook', 'dead'),
    NOT: Wd('src', 'not'), TIRTHA: Wd('src', 'tirtha'), LAW: Wd('src', 'law'), MANU: Wd('src', 'manu'), YAJ: Wd('src', 'yajnavalkya'), VISHNU: Wd('src', 'vishnu'),
    ONE: Wd('one', 'one'), TIPS: Wd('one', 'fingertips'), GODS: Wd('one', 'gods'), WATER: Wd('one', 'water'), OFFERED: Wd('one', 'offered'), HERE1: Wd('one', 'here'),
    TWO: Wd('two', 'two'), LITTLE: Wd('two', 'little'), PRAJA: Wd('two', 'prajapatis'), CREATOR: Wd('two', 'creators'),
    THREE: Wd('three', 'three'), THUMB: Wd('three', 'thumb'), BRAHMA: Wd('three', 'brahmas'), FIRST: Wd('three', 'first'), SIP: Wd('three', 'sip'),
    FOUR2: Wd('four', 'four'), BETWEEN: Wd('four', 'between'), PITRI: Wd('four', 'pitri'), ANCESTORS: Wd('four', 'ancestors'), W4: Wd('four', 'water'), DEAD2: Wd('four', 'dead'), HERE4: Wd('four', 'here'),
    R_SIP: Wd('rule', 'sip'), R_THREE: Wd('rule', 'three'), R_ONE: Wd('rule', 'one'), R_TWO: Wd('rule', 'two'), MUST: Wd('rule', 'must'), R_FOUR: Wd('rule', 'four'), NEVER: Wd('rule', 'never'), ONCE: Wd('rule', 'once'),
    S3: Wd('how', 'three'), BASE: Wd('how', 'base'), HOT: Wd('how', 'hot'), FOAM: Wd('how', 'foaming'), WIPE: Wd('how', 'wipe'), TWICE: Wd('how', 'twice'),
    YOU: Wd('ask', 'you'), COMMENT: Wd('ask', 'comment'), N1: Wd('ask', '1'), N2: Wd('ask', '2'), N3: Wd('ask', '3'), N4: Wd('ask', '4'), SAVE: Wd('ask', 'save'), PUJA: Wd('ask', 'puja'),
  };
  // the three sips (H): spread over the line
  T.SIPS = [T.S3 - .1, (T.HOT + T.FOAM) / 2, T.TWICE - .2];
  T.END = T.CARD + 7;
  return T;
})();
