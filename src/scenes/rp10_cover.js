// rp10_cover.js: the Instagram cover for Ramayan Part 10 (cover.html = studio.html + this). Hanuman grinning on a Lanka
// rooftop, his tail ablaze, the city catching fire; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp10_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1250, 1);
    roofs(.5, .55, 'cv');
    boilSeed('cvr'); paint(rectPts(-300, 1700, 1700, 1400), { wash: P10.wall, fill: P10.wallDk, fillOp: 50, tex: .5, ink: null });
    for (let i = 0; i < 9; i++) paint(rectPts(-260 + i * 190, 1660, 100, 44), { wash: P10.wall, ink: P10.ink, sw: .8 });
    const o = { crown: false, gada: 0, boilKey: 'cvh', tail: 'curl', tailSway: 1, eyes: 'smug', mouth: 'grin', brow: -.4, lookX: .3, hx: .2, handL: [-4.6, -11.4], handR: [4.6, -11.4], bendL: -.6, bendR: -.6 };
    hanuman(420, 1700, 26, o);
    tailFire(420, 1700, 26, o, .5, 1, 'cvf');
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 240, 300, 480, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 10', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 440 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('LANKA BURNS', 490, 128, RMY.gold, -.02);
    L('THEY SET HIS TAIL', 620, 86, RMY.cream);
    L('ON FIRE…', 720, 104, RMY.cream, -.03);
  }]]);
})();
