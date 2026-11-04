// parshu6_cover.js: the Instagram cover for ad 75 (cover.html = studio.html + this). One still: the face-off, Parshurama
// (axe glowing) on the left, Ram drawing Vishnu's bow at him on the right, on the royal sunburst; the series template: the
// orange PART 6 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu6_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    sunburst(.4, 540, 1250);
    glow(760, 1200, 420, P6.vGlow, .45);
    parshurama(290, 1700, 24, { flip: 1, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'covr', seed: 7, axe: 'hold', axeGlow: .7, eyes: 'angry', brow: -1, mouth: 'frown', lookX: 1, wind: .4, aura: .6 });
    ram(800, 1700, 24, { boilKey: 'covram', seed: 3, kodanda: false, handL: [-7.6, -18], bendL: .3, handR: [-.4, -18.6], bendR: .9, armL: vishnuBow(1, true, 1), eyes: 'angry', brow: -.4, mouth: 'flat', lookX: -1, chest: flowerMala });
    camEnd();
    boilSeed('covpill');
    paint(rrPts(540 - 170, 300 - 58, 340, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 6', 540, 304, 92, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('PARSHURAMA', 455, 150, GOLDC);
    L('CHALLENGED', 585, 92, '#FFFFFF', -.02);
    L('LORD RAM', 700, 110, '#9FDCFF', -.02);
  }]]);
})();
