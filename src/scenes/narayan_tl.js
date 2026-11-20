// narayan_tl.js: the timeline of the Narayanastra reel (ad 100), from the voice (narayan_vo.js), shared by the scene
// (narayan.js) and the sound (tools/narayan_sfx.mjs, which loads both files with vm). Re-render the voice and both follow.
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
    B0: mid('hook', 'drona'), C0: mid('drona', 'ash'), D0: mid('ash', 'name'), E0: mid('name', 'omen'), F0: mid('omen', 'sky'), G0: mid('sky', 'grow'),
    H0: mid('grow', 'krishna'), I0: mid('krishna', 'drop'), J0: mid('drop', 'bhima'), K0: mid('bhima', 'fire'), L0: mid('fire', 'rescue'),
    M0: mid('rescue', 'calm'), N0: mid('calm', 'twist'), O0: mid('twist', 'again'), P0: mid('again', 'ask'), Q0: mid('ask', 'comic'), CARD: LN.comic.end + 1.0,
    ONE: Wd('hook', 'one'), DROPPING: Wd('hook', 'dropping'), FIGHT: Wd('hook', 'fight'), MIND: Wd('hook', 'mind'), KILLS: Wd('hook', 'kills'),
    DAY15: Wd('drona', 'day'), DRONA: Wd('drona', 'drona'), LIE: Wd('drona', 'lie'),
    ASH: Wd('ash', 'ashwatthama'), TEARS: Wd('ash', 'tears'), CALLS: Wd('ash', 'calls'), NARAYANA: Wd('ash', 'narayana'),
    NAME: Wd('name', 'narayanastra'),
    SHOOK: Wd('omen', 'shook'), SEA: Wd('omen', 'sea'), RIVERS: Wd('omen', 'rivers'), BACK: Wd('omen', 'backwards'),
    FILLED: Wd('sky', 'filled'), THOUSANDS: Wd('sky', 'thousands'), BALLS: Wd('sky', 'balls'), DISCS: Wd('sky', 'discs'),
    FOUGHT: Wd('grow', 'fought'), STRIKE: Wd('grow', 'strike'), STRONGER: Wd('grow', 'stronger'),
    KRISHNA: Wd('krishna', 'krishna'), ARMS: Wd('krishna', 'arms'), DROP: Wd('krishna', 'drop'), GROUND: Wd('krishna', 'ground'), WHOEVER: Wd('krishna', 'whoever'), KMIND: Wd('krishna', 'mind'), KILL: Wd('krishna', 'kill'),
    ARMY: Wd('drop', 'army'), FALL: Wd('drop', 'fall'),
    ALL: Wd('bhima', 'all'), BHIMA: Wd('bhima', 'bhima'), STRENGTH: Wd('bhima', 'strength'), N10K: Wd('bhima', '10,000'), ELEPHANTS: Wd('bhima', 'elephants'), WILL: Wd('bhima', 'will'), FIGHTIT: Wd('bhima', 'fight'),
    WHOLE: Wd('fire', 'whole'), HIS: Wd('fire', 'his'), HEAD: Wd('fire', 'head'),
    RAN: Wd('rescue', 'ran'), INTO: Wd('rescue', 'into'), UNARMED: Wd('rescue', 'unarmed'), DRAGGED: Wd('rescue', 'dragged'), THREW: Wd('rescue', 'threw'), TOGROUND: Wd('rescue', 'ground'),
    MOMENT: Wd('calm', 'moment'), TOUCHED: Wd('calm', 'touched'), EARTH: Wd('calm', 'earth'), SILENT: Wd('calm', 'silent'),
    OWN: Wd('twist', 'own'), STOPPED: Wd('twist', 'stopped'), NARAYANA2: Wd('twist', 'narayana'),
    BEGGED: Wd('again', 'begged'), AGAIN: Wd('again', 'again'), TWICE: Wd('again', 'twice'), ME: Wd('again', 'me'),
    TELL: Wd('ask', 'tell'), BHIMA2: Wd('ask', 'bhima'), BRAVE: Wd('ask', 'brave'), FOOLISH: Wd('ask', 'foolish'),
    ASH2: Wd('comic', 'ashwatthama'), LATER: Wd('comic', 'later'), NIGHT: Wd('comic', 'night'), KILLER: Wd('comic', 'killer'), READ: Wd('comic', 'read'), COMIC: Wd('comic', 'comic'),
  };
  T.END = T.CARD + 6.5;
  return T;
})();
