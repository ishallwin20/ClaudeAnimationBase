// shani2_cover.js: the Instagram cover for Shani series Part 2 (cover.html = studio.html + this). One still: the
// mother's violet shadow on the sunlit wall, her pale eyes open, the baby's violet eyes in her arms; little Shani in
// colour in front, looking up at it; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/shani2_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(545, 1100, 1);
    goldWall(.5, 0);
    shadowWoman(600, 1640, 31, { boilKey: 'cshadow', bundle: 1, babyEyes: 1, eyes: 'normal', lookX: -.4, lookY: .5, htilt: -.06 });
    glow(330, 1400, 220, '#FFE6A0', .25);
    kid('shani', 300, 1600, 15, { boilKey: 'ckid', eyes: 'normal', lookX: .7, lookY: -1, mouth: 'O', aR: .2 });
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 520, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 940, rot });
    L("SHANI DEV'S", 330, 110, PAL.cream);
    L('MOTHER', 460, 150, PAL.cream);
    L('WAS A', 1440, 100, PAL.cream, -.02);
    L('SHADOW', 1580, 180, GOLDC, -.02);
    boilSeed('cpart');
    paint(rrPts(760, 600, 200, 70, 35), { wash: TK.rkOrange, ink: null });
    letter('PART 2', 860, 637, 46, TK.cream, { screen: true, ink: false });
  }]]);
})();
