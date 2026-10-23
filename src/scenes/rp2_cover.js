// rp2_cover.js: the Instagram cover for Ramayan Part 2 (cover.html = studio.html + this). Kaikeyi in the lamp-lit dark,
// two golden boons rising from her palm; the series badge and the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rp2_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1180, 1);
    angerRoom(.5, 'cv');
    glow(700, 1250, 520, P2.lamp, .45);
    kaikeyi(420, 2060, 34, { boilKey: 'cvk', eyes: 'angry', brow: -.6, mouth: 'smirk', lookX: .6, hx: .3, handR: [6.4, -17.5], bendR: .5 });
    const [hx, hy] = parvatiHand(420, 2060, 34, { handR: [6.4, -17.5], bendR: .5 }, 1);
    boonLight(hx + 30, hy - 130, 46, 1, 'cvb1'); boonLight(hx + 190, hy - 230, 46, 1, 'cvb2');
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 2', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('WHY DID KAIKEYI', 490, 104, RMY.cream);
    L('SEND RAM', 620, 150, RMY.gold, -.02);
    L('AWAY?', 760, 130, RMY.gold, -.03);
  }]]);
})();
