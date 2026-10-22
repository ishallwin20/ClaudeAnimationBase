// blue_cover.js: the Instagram cover for "Why are Hindu gods BLUE?" (cover.html = studio.html + this). One still: Bal
// Krishna, puzzled at his blue hands, and white Shiva beside him (the twist, as a tease) on the peach ground; the title
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/blue_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    peachGround(.5);
    shiva(800, 1660, 26, { boilKey: 'cshv', seed: 4, ...SHV_WHITE, throat: 1, eyes: 'normal', lookX: -.6, mouth: 'smile', handR: [4.6, -12.0], bendR: 1.2 });
    balKrishna(380, 1690, 44, { boilKey: 'ckr', seed: 2, pose: 'stand', eyes: 'look', lookY: .7, brows: -.6, mouth: 'pout',
      handL: [-2.7, -9.6], handR: [2.7, -9.6], handShapeL: 'open', handShapeR: 'open', handAL: -2.0, handAR: -1.1, emote: '?', emoteK: 1, emoteAge: 1 });
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 960, rot });
    L('WHY ARE', 330, 100, PAL.cream);
    L('HINDU GODS', 455, 140, GOLDC);
    L('BLUE?', 615, 190, '#6FA0EA', -.02);
  }]]);
})();
