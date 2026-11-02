// parshu4_cover.js: the Instagram cover for ad 72 (cover.html = studio.html + this). One still: young Parshurama close
// with the axe, the king's thousand arms fanned behind him on the royal sunburst; the series template: the orange
// PART 4 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu4_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    sunburst(.4, 540, 1250);
    push(); translate(540, 1950); armFan(30, 1.4, { boilKey: 'cov', fanWave: 0 }, { ...RAM, ...DASH_PAL, ...KART_PAL }); pop();
    parshurama(540, 2240, 50, { flip: 1, beard: false, quiver: false, boilKey: 'covr', seed: 7, axe: 'hold', axeGlow: .5, eyes: 'angry', brow: -1, mouth: 'frown', wind: .4, aura: .5 });
    camEnd();
    boilSeed('covpill');
    paint(rrPts(540 - 170, 300 - 58, 340, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 4', 540, 304, 92, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('PARSHURAMA', 455, 150, GOLDC);
    L('VS THE KING', 585, 104, '#FFFFFF', -.02);
    L('WITH 1000 ARMS', 700, 100, '#FF6A4A', -.02);
  }]]);
})();
