// surya_tl.js: the reel's timeline (ad/16-book4-sun), taken from the voice: VO (src/scenes/surya_vo.js, written by
// tools/sarvam_tts.mjs) gives each line's start and end and each word's start. The scene (src/scenes/surya.js) and the
// sound (tools/surya_sfx.mjs) both read TL, so the picture, the voice and the effects stay in step when the voice is
// re-rendered.
const TL = (() => {
  const L = VO.lines, a = k => L[k].a, e = k => L[k].end;
  // the start of a word in a line (letters only, lower-case), else the line's start
  const w = (id, word) => {
    for (const k of VO.caps) if (k.id === id) { const ws = k.text.split(/\s+/).filter(x => x && x !== '|'); const i = ws.findIndex(x => x.replace(/[^A-Za-z]/g, '').toLowerCase() === word); if (i >= 0) return k.at[i]; }
    return a(id);
  };
  const T = {
    hook: 0, sunOut: w('hook1', 'sun'),
    mali: a('mali') - .35,
    glow: a('glow'), glowing: w('glow', 'glow'),
    surya: a('surya') - .3, blaze: w('surya', 'surya'), jealous: w('surya', 'jealous'),
    closer: a('closer') - .2, burn: w('closer', 'burned') - .3, burned: w('closer', 'burned'), ashes: w('closer', 'ashes'),
    fury: a('fury') - .15, eyes: a('fury') + .05, third: w('fury', 'furious'),
    hurl: a('hurl') - .15, throw: w('hurl', 'hurled'), impact: w('hurl', 'sun'),
    fell: a('fell') - .2, closing: w('fell', 'fell'), drop: w('fell', 'unconscious') + .2,
    dark: w('dark', 'dark'), cold: w('dark', 'cold'), froze: w('dark', 'froze'), died: w('dark', 'died'),
    curse: a('curse1') - .3, cursed: w('curse1', 'cursed'), curse2: a('curse2'), head: w('curse2', 'head'),
    ganesha: a('ganesha') - .3, gname: w('ganesha', 'ganesha'), elephant: w('ganesha', 'elephant'),
    plea: a('plea') - .2, one: w('plea', 'one'),
    warm: a('warm') - .2, stepped: w('warm', 'stepped'), wrapped: w('warm', 'wrapped'), warmth: w('warm', 'warmth'),
    ask: a('ask') - .2, become: w('ask', 'become'), guess: w('ask', 'comment'),
    card: a('book') - .15, set: a('set'),
  };
  T.end = +(e('set') + 3.5).toFixed(2);
  return T;
})();
