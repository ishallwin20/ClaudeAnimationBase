// parshu3_cover.js: the Instagram cover for ad 70 (cover.html = studio.html + this). One still: young Parshurama close on
// the blood-maroon ground, the axe in his hand, eyes wide; the series
// template: the orange PART 3 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu3_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    bloodGround(.4, 540, 1250);
    parshurama(540, 2240, 50, { flip: 1, beard: false, quiver: false, boilKey: 'covr', seed: 7, axe: 'hold', axeGlow: .35, eyes: 'wide', brow: .9, mouth: 'frown', sweat: true, wind: .4 });
    camEnd();
    boilSeed('covpill');
    paint(rrPts(540 - 170, 300 - 58, 340, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 3', 540, 304, 92, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('HIS FATHER ORDERED', 450, 92, '#FFFFFF', -.02);
    L('PARSHURAMA', 575, 150, GOLDC);
    L('TO KILL HIS MOTHER', 705, 100, '#FF6A4A', -.02);
  }]]);
})();
