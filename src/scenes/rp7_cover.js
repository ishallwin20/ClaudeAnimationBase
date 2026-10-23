// rp7_cover.js: the Instagram cover for Ramayan Part 7 (cover.html = studio.html + this). The bundle of jewels falling
// from Ravana's chariot toward a monkey's raised hands (the five found them: Kishkindha 6); the series badge and the title inside the 3:4 grid crop.
//   node render.mjs --page=cover.html --stills=0 --out=out/rp7_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1250, 1);
    skyChase(.5, 'cv', 0);
    skyChariot(700, 1080, 220, .5, { riders: ([sx, sy]) => { parvati(sx - 70, sy, 11, { pal: SITA_PAL, ...SITA_SKIN, eyes: 'cry', mouth: 'wail', handR: [7, -10], noShadow: true }); ravana(sx + 50, sy, 8, { boilKey: 'cvr', all: { eyes: 'angry', mouth: 'grin' }, noShadow: true }); } });
    bundle(520, 1380, 160, .5, 'cvb');
    hanuman(420, 2040, 30, { boilKey: 'cvh', crown: false, gada: 0, eyes: 'wide', mouth: 'O', handL: [-3, -26], handR: [3, -26], bendL: .6, bendR: .6, lookY: -1, lookX: .4 });
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 7', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L("SITA'S JEWELS", 490, 120, RMY.gold);
    L('FELL FROM THE SKY', 620, 104, RMY.cream, -.02);
    L('guess who found them', 740, 70, RMY.cream, -.03);
  }]]);
})();
