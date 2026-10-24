// rp12_cover.js: the Instagram cover for Ramayan Part 12, the finale (cover.html = studio.html + this). Ram with the
// glowing Brahmastra drawn, Ravana's ten heads glaring on the right; the badge and the title inside the 3:4 grid crop.
//   node render.mjs --page=cover.html --stills=0 --out=out/rp12_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(560, 1420, 1.05);
    battlefield(.5, 'cv');
    ravana(800, 1860, 13, { boilKey: 'cvr', flip: true, all: { eyes: 'angry', brows: -.9, mouth: 'teeth', lookX: -1 } });
    const bp = { flip: true, handL: [-7.6, -18], bendL: .3, handR: [-.4, -18.6], bendR: .9, kodanda: false, armL: heldBow(1) };
    ram(250, 1880, 22, { boilKey: 'cvram', eyes: 'determined', brow: -.6, mouth: 'flat', hx: -.5, lookX: -1, ...bp });
    const [hx, hy] = naradaHand(250, 1880, 22, bp, -1); glow(hx + 40, hy - 10, 180, '#FFE070', .8); glow(hx + 40, hy - 10, 70, '#FFFFFF', .6);
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 280, 300, 560, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · THE FINALE', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 520 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('THE LAST ARROW', 490, 120, RMY.gold, -.02);
    L('HIS HEADS KEPT', 620, 86, RMY.cream);
    L('GROWING BACK!', 720, 104, RMY.cream, -.03);
  }]]);
})();
