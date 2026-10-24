// rp9_cover.js: the Instagram cover for Ramayan Part 9 (cover.html = studio.html + this). Surasa's open mouth and
// Hanuman flying at it; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp9_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1250, 1);
    openSea(.5, 'cv', { hy: 1780 });
    surasa(640, 1260, 500, { key: 'cvs', open: 1.15, eyes: 'normal', look: -.7, sway: 0 });
    frontSea(.5, 1780, 'cvfs');
    glow(250, 1120, 120, '#FFE070', .5);
    hanuman(140, 1260, 12, { boilKey: 'cvh', crown: false, gada: 0, rot: 1.0, handR: [2.4, -24.5], bendR: .15, handL: [-4.6, -11], bendL: -.3, tail: 'droop', tailSway: 0, eyes: 'determined', mouth: 'grin', lookX: 1, hx: .4, noShadow: true });
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 9', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L("HANUMAN'S LEAP", 490, 116, RMY.gold, -.02);
    L("INTO A MONSTER'S", 620, 86, RMY.cream);
    L('MOUTH?!', 720, 110, RMY.cream, -.03);
  }]]);
})();
