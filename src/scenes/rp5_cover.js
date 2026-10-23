// rp5_cover.js: the Instagram cover for Ramayan Part 5 (cover.html = studio.html + this). Ram, bow drawn, against the
// horde at dusk; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp5_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1250, 1);
    duskField(.5, 'cv');
    horde(.5, 'cvh', 0, 48, 470);
    ram(250, 1950, 32, { boilKey: 'cvr', flip: true, eyes: 'angry', brow: -.7, mouth: 'flat', kodanda: true, hx: -.5, lookX: -1, handL: [-7.6, -18], bendL: .3, handR: [-.4, -18.6], bendR: .9, kodanda: false, armL: heldBow(1) });
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 5', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('ONE MAN', 490, 120, RMY.cream);
    L('14,000 DEMONS', 630, 140, RMY.gold, -.02);
    L('72 MINUTES', 760, 100, RMY.cream, -.03);
  }]]);
})();
