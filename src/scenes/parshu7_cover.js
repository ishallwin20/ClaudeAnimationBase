// parshu7_cover.js: the Instagram cover for ad 76 (cover.html = studio.html + this). One still: Parshurama (axe raised,
// glowing) on the left, Ganesha on the right, calm, his broken tusk in his hand, on the royal sunburst; the series
// template: the orange PART 7 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu7_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    sunburst(.4, 540, 1250);
    glow(270, 1150, 380, '#FFE6A0', .35);
    parshurama(290, 1660, 23, { flip: 1, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'covr', seed: 7, axe: 'raise', axeGlow: .9, eyes: 'angry', brow: -1, mouth: 'frown', lookX: 1, wind: .4, aura: .6 });
    balBappa(790, 1660, 25, { stand: 1, tusks: 1.7, broken: 1, boilKey: 'covg', seed: 4, trunk: 'down', aR: .45, armR: (u, sw) => balTusk(u * 2.4, sw), eyes: 'normal', lookX: -.6, mouth: 'smile', ear: .15 });
    camEnd();
    boilSeed('covpill');
    paint(rrPts(540 - 170, 300 - 58, 340, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 7', 540, 304, 92, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('PARSHURAMA', 455, 150, GOLDC);
    L('BROKE', 585, 92, '#FFFFFF', -.02);
    L('GANESHA\'S TUSK', 700, 110, GOLDC, -.02);
  }]]);
})();
