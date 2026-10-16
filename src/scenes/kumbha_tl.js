// kumbha_tl.js: the reel's timeline (reel/kumbhakarna-sleep), taken from the voice: VO (src/scenes/kumbha_vo.js, written
// by tools/sarvam_tts.mjs from tools/kumbha_vo.json) gives each line's start and end and each word's start. The scene
// (src/scenes/kumbha.js) and the sound (tools/kumbha_sfx.mjs) both read TL, so the picture, the voice and the effects
// stay in step when the voice is re-rendered.
const TL = (() => {
  const L = VO.lines, a = k => L[k].a, e = k => L[k].end;
  // the start of a word in a line (lower-case letters only), else the line's start
  const w = (id, word) => {
    for (const k of VO.caps) if (k.id === id) { const ws = k.text.split(/\s+/).filter(x => x && x !== '|'); const i = ws.findIndex(x => x.replace(/[^A-Za-z]/g, '').toLowerCase() === word); if (i >= 0) return k.at[i]; }
    return a(id);
  };
  const T = {
    hook: 0, tongue: w('hook2', 'tongue'),
    name: a('name') - .35,
    born: a('born') - .3, thousands: w('born', 'thousands'),
    ate: a('ate') - .3, apsaras: w('ate', 'apsaras'), followers: w('ate', 'followers'),
    indra: a('indra') - .3, vajra: w('indra', 'vajra'),
    tusk: a('tusk') - .2, ripped: w('tusk', 'ripped'), stab: w('tusk2', 'stabbed'),
    tapas: a('tapas') - .3, fire: w('tapas', 'fire'), water: w('tapas', 'water'),
    brahma: a('brahma') - .3, begged: w('brahma', 'begged'),
    gods: a('gods') - .1, delusion: w('gods', 'delusion'),
    sara: a('sara') - .3, saraswati: w('sara', 'saraswati'), mouth: w('sara2', 'mouth'),
    wish: a('wish') - .2, sleep: w('wish', 'sleep'),
    sobe: a('sobe') - .2, be: w('sobe', 'be'),
    left: a('left') - .3, froze: w('left', 'froze'),
    what: a('what') - .1,
    eased: a('eased') - .3, six: a('eased2'), one: w('eased2', 'one'),
    war: a('war') - .3, meat: w('war2', 'meat'),
    noise: a('noise') - .1, birds: w('noise', 'birds'),
    eleph: a('eleph') - .1, thousand: w('eleph', 'thousand'),
    yawn: a('yawn') - .3, yawning: w('yawn', 'yawning'), hungry: w('yawn', 'hungry'),
    ask: a('ask') - .4, card: e('ask2') + 1.45,
  };
  T.end = +(T.card + 3.6).toFixed(2);
  return T;
})();
