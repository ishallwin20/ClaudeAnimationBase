// shani_cover.js: the Instagram cover for Shani series Part 1 (cover.html = studio.html + this). One still: Shani's
// face with the cursed glow, glancing sideways at the baby's head flying off, the title inside the 3:4 grid crop
// (y 240–1680).   node render.mjs --page=cover.html --stills=0 --out=out/shani1_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    nightSet(.7);
    const o = { boilKey: 'cshani', lookX: 1, lookY: .1, brow: -.7, mouth: 'flat', glow: .85, seed: 2 };
    shani(370, 2160, 55, o);
    const e = shaniEye(370, 2160, 55, o, 1);
    sparkleBurst(e[0] + 16, e[1] - 6, 70, .25, 'cglint', 6, ['#FFFFFF', SP.curse]);
    // the baby's head, flying off to the right, trailing sparkles
    for (let i = 1; i < 6; i++) sparkleBurst(850 - i * 30, 1130 + i * 52, 34, .25 + i * .07, 'ctrail' + i, 4);
    glow(850, 960, 260, '#FFE9A8', .6);
    balBappa(855, 1200, 28, { ...feel('starstruck', 0), human: 1, part: 'head', boilKey: 'chead', rot: .35, noShadow: true });
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 520, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 940, rot });
    L('SHANI DEV LOOKED AT', 330, 90, PAL.cream);
    L('BABY GANESHA...', 455, 130, GOLDC);
    L('HIS HEAD', 1450, 110, PAL.cream, -.02);
    L('FLEW OFF!', 1590, 170, GOLDC, -.02);
    boilSeed('cpart');
    paint(rrPts(760, 600, 200, 70, 35), { wash: TK.rkOrange, ink: null });
    letter('PART 1', 860, 637, 46, TK.cream, { screen: true, ink: false });
  }]]);
})();
