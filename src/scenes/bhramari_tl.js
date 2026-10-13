// bhramari_tl.js: the reel's timeline (reel/bhramari-bees), taken from the voice: VO (src/scenes/bhramari_vo.js, written
// by tools/sarvam_tts.mjs) gives each line's start and end and each word's start. The scene (src/scenes/bhramari.js)
// and the sound (tools/bhramari_sfx.mjs) both read TL, so the picture, the voice and the effects stay in step when the
// voice is re-rendered.
const TL = (() => {
  const L = VO.lines, a = k => L[k].a, e = k => L[k].end;
  // the start of a word in a line (lower-case letters only), else the line's start
  const w = (id, word) => {
    for (const k of VO.caps) if (k.id === id) { const ws = k.text.split(/\s+/).filter(x => x && x !== '|'); const i = ws.findIndex(x => x.replace(/[^A-Za-z]/g, '').toLowerCase() === word); if (i >= 0) return k.at[i]; }
    return a(id);
  };
  const six = a('six'), legs = [0, 1, 2, 3, 4, 5].map(i => six - .12 - (5 - i) * .4);
  const T = {
    hook: 0, strike1: 1.15, strike2: 3.35, gbee: w('hook2', 'six') - .25,
    tapas: a('tapas1') - .35, leaves: w('tapas2', 'leaves'), water: w('tapas2', 'water'), air: w('tapas2', 'air'), nothing: w('tapas2', 'nothing'),
    boon: a('boon') - .3, lotus: a('boon'), seal1: w('boon', 'weapon') - .1, seal2: w('boon', 'two'), seal3: w('boon', 'four'),
    heaven: a('heaven') - .3, storm: w('heaven', 'heaven'),
    shield: a('shield1') - .3, brihas: a('shield2') - .1, drop: w('shield2', 'dropping'),
    pray: a('pray') - .3, spark: e('pray') + .25,
    beeIn: a('abee') - .9, land: a('abee') - .15, count: a('count') - .2, legs, six,
    devi: a('devi1') - .45, formed: a('devi1') + 2.0, face: a('devi2') - .15, eyes: w('devi2', 'bhramari'),
    swarm: a('swarm1') - .3, millions: w('swarm1', 'millions'), engulf: a('swarm2') - .3,
    gone: a('gone1') - .6, crown: a('gone1') - .3, lone: a('gone2'),
    sri: a('sri') - .35, ask: a('ask') - .35, card: e('ask') + .25,
  };
  T.end = +(T.card + 3.6).toFixed(2);
  return T;
})();
