// ganga_tl.js: the reel's timeline (reel/ganga-jata), taken from the voice: VO (src/scenes/ganga_vo.js, written by
// tools/sarvam_tts.mjs from tools/ganga_vo.json) gives each line's start and end and each word's start. The scene
// (src/scenes/ganga.js) and the sound (tools/ganga_sfx.mjs) both read TL, so the picture, the voice and the effects
// stay in step when the voice is re-rendered.
const TL = (() => {
  const L = VO.lines, a = k => L[k].a, e = k => L[k].end;
  // the start of a word in a line (lower-case letters only), else the line's start
  const w = (id, word) => {
    for (const k of VO.caps) if (k.id === id) { const ws = k.text.split(/\s+/).filter(x => x && x !== '|'); const i = ws.findIndex(x => x.replace(/[^A-Za-z]/g, '').toLowerCase() === word); if (i >= 0) return k.at[i]; }
    return a(id);
  };
  const T = {
    hook: 0, answer: a('hook2'), hair: w('hook2', 'hair'),
    sagara: a('sagara') - .35, princes: w('sagara', 'princes'),
    dig: a('dig') - .25, stolen: w('dig', 'stolen'), down: w('dig', 'dug'),
    kapila: a('kapila') - .3, thief: w('kapila', 'thief'),
    ash: a('ash') - .3, sound: a('ash'), ashed: w('ash', 'ash'),
    souls: a('souls') - .45, heaven: w('souls', 'heaven'),
    kings: a('kings') - .35, bhag: w('kings', 'bhagiratha'),
    tapas: a('tapas') - .25, brahma: w('tapas', 'brahma'),
    warn: a('warn') - .25, only: w('warn', 'only'),
    toe: a('toe') - .3, year: w('toe', 'year'),
    pride: a('pride') - .45, plunge: e('pride') + .1,
    fall: e('pride') + .5, hit: a('catch') - .55,
    catch: a('catch') - .3, lost: w('catch', 'lost'),
    streams: a('streams') - .35, seven: w('streams', 'seven'), chariot: w('streams', 'one'),
    jahnu: a('jahnu') - .3, drank: w('jahnu', 'drank'), ear: w('jahnu', 'then'),
    free: a('free') - .35, souls2: w('free', 'souls'),
    why: a('why') - .35, gangadhara: w('why', 'gangadhara'),
    ask: a('ask') - .35, card: e('ask') + 1.2,
  };
  T.end = +(T.card + 3.6).toFixed(2);
  return T;
})();
