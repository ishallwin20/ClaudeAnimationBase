// phere_tl.js: the timeline of "Saat phere were never seven rounds" (ad 102), from the voice (phere_vo.js), shared by
// the scene (phere.js) and the sound (tools/phere_sfx.mjs, which loads both files with vm).
// The counts, the seven words and FRIEND are measured on the takes (ffmpeg silencedetect, speech starts after each
// pause): the tool's estimate had TWO, THREE … up to 0.5 s early, and the steps land on those words.
(() => {
  const patch = (id, rows) => {
    const caps = VO.caps.filter(c => c.id === id), o = VO.lines[id].a;
    if (caps.length !== rows.length) return;
    rows.forEach(([a, at], i) => { caps[i].a = o + a - .12; caps[i].at = at.map(v => o + v); if (i) caps[i - 1].b = o + a - .14; });
  };
  patch('count', [[0, [0]], [.823, [.823, 1.03, 1.25, 1.976]], [2.555, [2.555, 2.8, 3.452]], [3.985, [3.985, 4.25, 4.5]]]);
  patch('words', [[0, [0, .857, 1.898, 2.558]], [3.518, [3.518, 4.221, 4.962, 5.534]], [6.364, [6.364, 7.296, 7.993, 8.65, 8.85]]]);
  patch('seven', [[0, [0, .15, .28, .45, .995, 1.25, 1.5]], [2.07, [2.07]]]);
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
    B0: mid('hook', 'src'), C0: mid('src', 'rite'), D0: 0, E0: mid('count', 'steps'), F0: mid('steps', 'words'),
    G0: mid('words', 'seven'), H0: mid('seven', 'law'), I0: mid('law', 'ask'),
    CARD: LN.ask.end + 1.6,
    THREE0: Wd('hook', 'three'), SEVEN0: Wd('hook', 'seven'), NEVER: Wd('hook', 'never'), STEPS0: Wd('hook', 'steps'),
    PARAS: Wd('src', 'paraskara'), SHUKLA: Wd('src', 'shukla'), TWOMORE: Wd('src', 'two'), SAME: Wd('src', 'same'),
    BROTHER: Wd('rite', 'brother'), RICE: Wd('rite', 'rice'), HANDS: Wd('rite', 'hands'), OFFERS: Wd('rite', 'offers'), FIRE: Wd('rite', 'fire'),
    STONE: Wd('rite', 'stone'), FIRM: Wd('rite', 'firm'), WALK: Wd('rite', 'walk'), ROUND: Wd('rite', 'round'),
    ONE: Wd('count', 'one'), TWO: Wd('count', 'two'), THREE: Wd('count', 'three'), ONLY: Wd('count', 'only'),
    THEN: Wd('steps', 'then'), SEVENSTEPS: Wd('steps', 'seven'), NORTH: Wd('steps', 'north'), EACH: Wd('steps', 'each'), WORD: Wd('steps', 'word'),
    W: ['one', 'two', 'three', 'four', 'five', 'six'].map(w => Wd('words', w)),
    WW: ['food', 'strength', 'wealth', 'joy', 'cattle', 'seasons'].map(w => Wd('words', w)),
    SEVENTH: Wd('seven', 'seventh'), FRIEND: Wd('seven', 'friend'),
    ACT: Wd('law', 'act'), SAPTA: Wd('law', 'saptapadi'), COMPLETE: Wd('law', 'complete'), SEVSTEP: Wd('law', 'seventh'),
    HOW: Wd('ask', 'how'), YOUR: Wd('ask', 'your'), N3: Wd('ask', '3'), N4: Wd('ask', '4'), N7: Wd('ask', '7'), STATE: Wd('ask', 'state'), SEND: Wd('ask', 'send'),
  };
  T.D0 = Wd('rite', 'then') - .15;
  // the rounds: the first starts on "walk round", the second and third end on "TWO" and "THREE"
  T.R = [[T.WALK - .1, T.ONE], [T.ONE + .25, T.TWO], [T.TWO + .25, T.THREE]];
  T.END = T.CARD + 7;
  return T;
})();
