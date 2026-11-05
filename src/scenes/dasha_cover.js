// dasha_cover.js: the Instagram cover for ad 77 (cover.html = studio.html + this). One still: Vishnu on Shesha on the
// cosmic ocean, ringed by his ten forms (the 10th a "?"), the "WHY A FISH?" pill over the title, inside the
// 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/dasha_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    cosmicOcean(.4, { seaY: 1600 });
    glow(540, 1250, 520, '#4E7AC8', .4);
    shesha(540, 1620, 27, { boilKey: 'cvsh' });
    vishnu(540, 1620, 27, { boilKey: 'cvvi', eyes: 'happy', mouth: 'smile', chakraSpin: .6 });
    for (let i = 0; i < 10; i++) {
      const a = Math.PI + (i + .5) / 10 * Math.PI, x = 540 + Math.cos(a) * 410, y = 1430 + Math.sin(a) * 440;
      medallion(i, x, y, 58, 0, 1);
    }
    camEnd();
    boilSeed('cvpill');
    paint(rrPts(540 - 190, 300 - 52, 380, 104, 52), { wash: '#F15A24', ink: DP.ink, sw: 1.6 });
    letter('WHY A FISH?', 540, 304, 76, '#FFF5E2', { screen: true, stroke: DP.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: DP.ink, sw: .22, ink: false, maxW: 980, rot });
    L('VISHNU\'S', 450, 110, '#FFFFFF');
    L('10 AVATARS', 590, 160, GOLDC, -.02);
    L('AND WHY EACH ONE', 720, 74, '#FFFFFF', -.02);
  }]]);
})();
