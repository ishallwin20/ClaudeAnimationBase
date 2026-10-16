// kailasa_tl.js: the reel's timeline (reel/kailasa-ellora), taken from the voice: VO (src/scenes/kailasa_vo.js, written
// by tools/sarvam_tts.mjs from tools/kailasa_vo.json) gives each line's start and end and each word's start. The scene
// (src/scenes/kailasa.js) and the sound (tools/kailasa_sfx.mjs) both read TL, so the picture, the voice and the effects
// stay in step when the voice is re-rendered.
const TL = (() => {
  const L = VO.lines, a = k => L[k].a, e = k => L[k].end;
  // the start of a word in a line (lower-case letters only), else the line's start
  const w = (id, word) => {
    for (const k of VO.caps) if (k.id === id) { const ws = k.text.split(/\s+/).filter(x => x && x !== '|'); const i = ws.findIndex(x => x.replace(/[^A-Za-z]/g, '').toLowerCase() === word); if (i >= 0) return k.at[i]; }
    return a(id);
  };
  const T = {
    hook: 0, carved: w('hook2', 'carved'), one: w('hook2', 'one'),
    name: a('name') - .35, mountain: w('name', 'mountain'),
    none: a('none') - .3, bricks: w('none', 'bricks'), blocks: w('none', 'blocks'), mortar: w('none', 'mortar'), hill: w('none', 'just'),
    trench: a('trench') - .3, three: w('trench', 'three'), down: w('trench', 'straight'),
    island: a('island') - .1, standing: w('island', 'standing'),
    topdown: a('topdown') - .3, top: w('topdown', 'top'),
    order: a('order') - .3, tower: w('order', 'tower'), halls: w('order', 'halls'), floor: w('order', 'floor'),
    tonnes: a('tonnes') - .3, hand: w('tonnes', 'hand'),
    final: a('final') - .3, strike: w('final2', 'strike'), fin: w('final2', 'final'),
    reveal: a('reveal') - .4, over: w('reveal', 'over'), tall: w('reveal', 'tall'),
    eleph: a('elephants') - .25, elephants: w('elephants', 'elephants'),
    nandi: a('nandi') - .3, bridge: w('nandi2', 'bridge'),
    ravana: a('ravana') - .35, lifting: w('ravana', 'lifting'),
    plate: a('plate') - .4, gods: w('plate', 'gods'), struck: w('plate', 'struck'),
    quote: a('gods') - .3, itself: w('gods', 'itself'), beauty: a('gods2'),
    arch: a('arch') - .4, oh: a('archq'), built: w('archq', 'built'),
    ask: a('ask') - .4, card: e('ask2') + 1.45,
  };
  T.end = +(T.card + 3.6).toFixed(2);
  return T;
})();
