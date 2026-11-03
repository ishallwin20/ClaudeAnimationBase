// parshu5_cover.js: the Instagram cover for ad 74 (cover.html = studio.html + this). One still: Parshurama, axe glowing,
// standing on top of the whole earth on the royal sunburst; the series template: the orange PART 5 pill over the title,
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu5_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    sunburst(.4, 540, 1200);
    earthBall(540, 2000, 560, 0, 'covearth');
    // lands across the visible top of the globe, so it reads as the earth at a glance
    for (const [x, y, w, h, c] of [[300, 1560, 120, 46, P5.land], [700, 1530, 150, 40, P5.land], [520, 1640, 90, 36, P5.sand], [860, 1660, 70, 50, P5.land]]) { boilSeed('covl' + x); paint(ellPts(x, y, w, h, 14, 3), { wash: c, fill: P5.landDk, fillOp: 50, tex: .4, ink: null }); }
    parshurama(540, 1470, 25, { flip: 1, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'covr', seed: 7, axe: 'hold', axeGlow: .7, eyes: 'angry', brow: -1, mouth: 'frown', wind: .4, aura: .6, puff: .3 });
    camEnd();
    boilSeed('covpill');
    paint(rrPts(540 - 170, 300 - 58, 340, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 5', 540, 304, 92, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('PARSHURAMA', 455, 150, GOLDC);
    L('WON THE WHOLE EARTH', 585, 92, '#FFFFFF', -.02);
    L('& GAVE IT AWAY', 695, 100, '#FF6A4A', -.02);
  }]]);
})();
