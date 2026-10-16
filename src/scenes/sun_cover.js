// sun_cover.js: the Instagram cover for the Bal Hanuman reel (cover.html = studio.html + this). Replaces the reel's shots
// with one still: the hook image (the baby flying at the sun, sparkle eyes, mouth open AAM; the sun gasping and
// sweating) and a big title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/sun_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    gradBands(['#FFA94D', '#FFC46E', '#FFE0A0'], -80, H + 80, 'cvsky');
    for (let i = 0; i < 5; i++) cloud(100 + hash(i * 3.1) * 900, 1560 + hash(i * 5.3) * 340, 110, { key: 'cvc' + i, col: '#FFF1D6', dk: '#F6C98A', ink: false });
    surya(700, 930, 230, { key: 'cvsun', eyes: 'wide', mouth: 'gasp', sweat: 1, lookX: -1, lookY: .6, rot: .1, glowK: .9 });
    emote('!?', 960, 700, 44, 1, .5);
    balHanuman(300, 1340, 31, { pose: 'fly', boilKey: 'cvbaby', seed: 1, eyes: 'sparkle', mouth: 'aam', mouthK: 1.3, tail: 'curl', tailSway: 1.2, kick: 2,
      rot: .45, handL: [-1.2, -12.8], handR: [2.4, -12.4], handShapeL: 'open', handShapeR: 'open' });
    letter('BABY HANUMAN', 520, 330, 104, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 900, rot: -.025 });
    letter('ATE THE SUN.', 520, 475, 160, GOLDC, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 940, rot: -.025 });
    letter("…and that's how he got his NAME", 540, 1600, 64, PAL.cream, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 940, rot: -.02 });
  }]]);
})();
