// rp6_cover.js: the Instagram cover for Ramayan Part 6 (cover.html = studio.html + this). The golden deer in the dark
// forest with the horned demon's shadow looming behind; the series badge and the title inside the 3:4 grid crop.
//   node render.mjs --page=cover.html --stills=0 --out=out/rp6_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1250, 1);
    nightForest(.5, 'cv', .7);
    demonShadow(540, 1760, 800, 1, 'cvds');
    for (const ex of [-28, 28]) glow(540 + ex, 1760 - 800 * .75, 36, '#FF3030', .8);
    goldenDeer(520, 1760, 420, { key: 'cvd', glow: 1, neck: .3, cute: 1 });
    camEnd();
    boilSeed('cvpill'); paint(rrPts(540 - 230, 300, 460, 92, 46), { wash: RMY.maroon, ink: null });
    letter('RAMAYAN · PART 6', 540, 347, 50, RMY.gold, { screen: true, font: '700 50px Poppins', ink: false, maxW: 420 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: RMY.ink, sw: .22, ink: false, maxW: 960, rot });
    L('THE GOLDEN DEER', 490, 110, RMY.gold);
    L('WAS A DEMON', 620, 130, RMY.cream, -.02);
    L('(and no Lakshman Rekha!)', 740, 66, RMY.cream, -.03);
  }]]);
})();
