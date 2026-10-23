// rp4_cover.js: the Instagram cover for Ramayan Part 4 (cover.html = studio.html + this). Ram holding up the blazing
// blade of grass, the crow fleeing; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp4_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1180, 1);
    warmBack(.5, 'cv', 620, 1150);
    const o = { boilKey: 'cvr', eyes: 'angry', brow: -.7, mouth: 'flat', handR: [6.6, -24.5], bendR: .4, lookX: .6, lookY: -.6, hx: .3 };
    const [hx, hy] = naradaHand(380, 2080, 36, o, 1);
    glow(hx + 30, hy - 160, 360, '#FFE070', .6);
    ram(380, 2080, 36, o);
    grassStar(hx + 14, hy - 130, -Math.PI / 2 + .2, 280, 'cvg', 0);
    shaniCrow(860, 1160, 22, { boilKey: 'cvc', flap: .8, fly: 1, eyes: 'wide', caw: .8 });
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 4', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('A BRAHMASTRA', 490, 120, RMY.gold);
    L('AT A CROW', 620, 120, RMY.cream, -.02);
    L('WITH A BLADE OF GRASS', 740, 76, RMY.cream, -.03);
  }]]);
})();
