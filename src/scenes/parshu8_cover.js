// parshu8_cover.js: the Instagram cover for ad 80 (cover.html = studio.html + this). One still: Parshurama behind, the
// axe on his shoulder; in front Bhishma (bow), Drona and Karna (kundalas, kavacha), named, on the royal sunburst; the
// series template: the orange PART 8 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu8_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    sunburst(.4, 540, 1250);
    glow(540, 1150, 420, '#FFE6A0', .35);
    parshurama(540, 1450, 22, { flip: 1, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'covr', seed: 7, axe: 'shoulder', axeGlow: .6, eyes: 'normal', brow: -.5, mouth: 'flat', wind: .4, aura: .6 });
    const FY = 1590, FU = 14;
    bhishma(200, FY, FU, { handL: [-4.6, -10.6], bendL: .7, armL: plainBow(0, false), eyes: 'normal', brow: -.4, mouth: 'flat', lookX: .5, hx: .2 });
    drona(540, FY, FU, { eyes: 'normal', brow: -.2, mouth: 'flat' });
    const ko = { crown: 'small', eyes: 'normal', brow: -.3, mouth: 'flat', lookX: -.5, hx: -.2 };
    karna(880, FY, FU, ko); karnaEars(880, FY, FU, ko, .9);
    for (const [x, n] of [[200, 'BHISHMA'], [540, 'DRONA'], [880, 'KARNA']]) letter(n, x, 1642, 54, GOLDC, { stroke: PK.ink, sw: .22, ink: false, rot: 0 });
    camEnd();
    boilSeed('covpill');
    paint(rrPts(540 - 250, 300 - 58, 500, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 8 · FINALE', 540, 304, 80, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('PARSHURAMA\'S', 460, 140, GOLDC);
    L('3 STUDENTS', 600, 120, '#FFFFFF', -.02);
  }]]);
})();
