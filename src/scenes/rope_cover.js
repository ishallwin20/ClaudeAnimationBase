// rope_cover.js: the Instagram cover for Little Kanha Part 2 (cover.html = studio.html + this). One still: Kanha in
// the courtyard with a rope round his belly that won't meet, a glow at the gap, the rope pile beside him; the title
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/rope_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(450, 1335, 1.25);
    courtyardSet(.2, { patch: false });
    ropePile(720, 1700, 6, .2);
    const o = { pose: 'stand', eyes: 'innocent', mouth: 'grin', blush: .7, hx: .1, handL: [-3.9, -7.0], handR: [3.9, -7.0], handShapeL: 'open', handShapeR: 'open', boilKey: 'ck', seed: 1, featherWob: .3 };
    balKrishna(430, 1700, 34, o);
    const [bx, by] = bkBelly(430, 1700, 34, o);
    beltRope(bx, by - .7 * 34, 2.9 * 34, .9 * 34, .8, { key: 'cbelt' });
    glow(bx, by + .2 * 34, 90, RS.glow, .8);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 960, rot });
    L('HIS MOM TRIED', 320, 96, PAL.cream);
    L('TO TIE HIM UP', 440, 110, PAL.cream);
    L('THE ROPE WAS ALWAYS', 1450, 80, PAL.cream, -.02);
    L('2 FINGERS SHORT', 1585, 140, GOLDC, -.02);
    boilSeed('cpart');
    paint(rrPts(780, 560, 200, 70, 35), { wash: KS.rkOrange, ink: null });
    letter('PART 2', 880, 597, 46, KS.cream, { screen: true, ink: false });
  }]]);
})();
