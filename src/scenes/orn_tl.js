// orn_tl.js: the timeline of "Why does SHIVA wear such SCARY ornaments?" (ad 78), from the voice (orn_vo.js), shared
// by the scene (orn.js) and the sound (tools/orn_sfx.mjs, which loads both files with vm). Re-render the voice and the
// picture and the sound move with it.
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
    C0: mid('hook', 'snake'), D0: mid('snake', 'poison'), E0: mid('poison', 'drink'), M0: mid('drink', 'moon'), F0: mid('moon', 'tusk'),
    G0: mid('tusk', 'hide'), H0: mid('hide', 'ganga'), I0: mid('ganga', 'skulls'), J0: mid('skulls', 'tears'), K0: mid('tears', 'devotee'),
    L0: mid('devotee', 'save'),
    CARD: LN.ask.end + 1.3,
    // words the picture lands on
    SHIVA: Wd('hook', 'shiva'), SCARY: Wd('hook', 'scary'),
    SNAKE: Wd('snake', 'snake'), BITE: Wd('snake', 'bite'), KILL: Wd('snake', 'kill'), KING: Wd('snake', 'king'), NECKLACE: Wd('snake', 'necklace'),
    CHURNED: Wd('poison', 'churned'), HALAHAL: Wd('poison', 'halahal'), ROSE: Wd('poison', 'rose'), SPREAD: Wd('poison', 'spread'), ALL: Wd('poison', 'all'),
    DRANK: Wd('drink', 'drank'), THROAT: Wd('drink', 'throat'), BLUE: Wd('drink', 'blue'), MARK: Wd('drink', 'mark'), ORNAMENT: Wd('drink', 'ornament'),
    MOON: Wd('moon', 'moon'), HEAD: Wd('moon', 'head'), RELIEF: Wd('moon', 'relief'), POISON2: Wd('moon', 'poison'),
    TUSK: Wd('tusk', 'tusk'), HIRANYAKSHA: Wd('tusk', 'hiranyaksha'), VARAHA: Wd('tusk', 'varahas'), FELL: Wd('tusk', 'fell'), PICKED: Wd('tusk', 'picked'), WORE: Wd('tusk', 'wore'),
    GAJASURA: Wd('hide', 'gajasura'), FOUGHT: Wd('hide', 'fought'), FELL2: Wd('hide', 'fell'), DYING: Wd('hide', 'dying'), WEAR: Wd('hide', 'wear'), SKIN: Wd('hide', 'skin'), DID: Wd('hide', 'did'), KRITTIVASA: Wd('hide', 'krittivasa'),
    EARTH: Wd('ganga', 'earth'), GANGA: Wd('ganga', 'gangas'), HEAVEN: Wd('ganga', 'heaven'), SWEEP: Wd('ganga', 'sweep'), HELD: Wd('ganga', 'held'), JATA: Wd('ganga', 'jata'),
    SKULLS: Wd('skulls', 'skulls'), THOUSANDS: Wd('skulls', 'thousands'), BRAHMAS: Wd('skulls', 'brahmas'), VISHNUS: Wd('skulls', 'vishnus'),
    RUDRAKSHA: Wd('tears', 'rudraksha'), GREW: Wd('tears', 'grew'), TEARS: Wd('tears', 'tears'),
    CRYSTAL: Wd('devotee', 'crystal'), KARUNGALI: Wd('devotee', 'karungali'), RED: Wd('devotee', 'red'), DEVOTEES: Wd('devotee', 'devotees'),
    SAVE: Wd('save', 'save'), BHAKT: Wd('save', 'bhakt'), YOU: Wd('ask', 'you'), COMMENT: Wd('ask', 'comment'),
  };
  T.END = T.CARD + 7;
  return T;
})();
