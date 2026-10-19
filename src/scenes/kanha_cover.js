// kanha_cover.js: the Instagram cover for Little Kanha Part 1 (cover.html = studio.html + this). One still: baby Kanha
// in the courtyard, mouth wide open with the universe inside, starlight on his face; the title inside the 3:4 grid crop
// (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/kanha_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(430, 1330, 1.95);
    courtyardSet(.2);
    balKrishna(420, 1700, 34, { pose: 'sit', eyes: 'closed', mouth: 'aam', mouthK: 1.4, cosmos: 1, blush: .7, handL: [-2.8, -5.2], handR: [2.8, -5.2], handShapeL: 'open', handShapeR: 'open', boilKey: 'ck', seed: 1, featherWob: .3 });
    const [mx, my] = bkMouth(420, 1700, 34, { pose: 'sit' });
    glow(mx, my + 30, 260, '#8A6AE8', .45);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 520, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 940, rot });
    L('HIS MOM SAID', 330, 96, PAL.cream);
    L('"OPEN YOUR MOUTH"', 450, 104, PAL.cream);
    L('SHE SAW THE', 1450, 96, PAL.cream, -.02);
    L('UNIVERSE', 1590, 176, GOLDC, -.02);
    boilSeed('cpart');
    paint(rrPts(780, 560, 200, 70, 35), { wash: KS.rkOrange, ink: null });
    letter('PART 1', 880, 597, 46, KS.cream, { screen: true, ink: false });
  }]]);
})();
