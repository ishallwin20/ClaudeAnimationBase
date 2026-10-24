// rp11_cover.js: the Instagram cover for Ramayan Part 11 (cover.html = studio.html + this). Ram at the stormy shore,
// the Brahmastra glowing on his drawn bow; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp11_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1300, 1);
    shore(.5, 'cv', { angry: .8, churn: .6 });
    const bp = { flip: true, handL: [-7.6, -18], bendL: .3, handR: [-.4, -18.6], bendR: .9, kodanda: false, armL: heldBow(1) };
    ram(300, 1900, 29, { boilKey: 'cvr', eyes: 'angry', brow: -.9, mouth: 'flat', hx: -.5, lookX: -1, ...bp });
    const [hx, hy] = naradaHand(300, 1900, 29, bp, -1); glow(hx + 50, hy - 10, 200, '#FFE070', .7); glow(hx + 50, hy - 10, 70, '#FFFFFF', .6);
    fish(760, 1420, 90, -.6, 'cvf1'); fish(900, 1480, 70, .5, 'cvf2', '#E2706A');
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 240, 300, 480, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 11', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 440 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('RAM VS', 480, 100, RMY.cream, -.02);
    L('THE OCEAN', 600, 136, RMY.gold, -.02);
    L('IT IGNORED HIM 3 DAYS…', 720, 76, RMY.cream, -.03);
  }]]);
})();
