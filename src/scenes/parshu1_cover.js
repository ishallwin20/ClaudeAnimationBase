// parshu1_cover.js: the Instagram cover for ad 63 (cover.html = studio.html + this). One still: Parshurama on the sunset
// ridge, the axe raised and glowing, the two bowls of kheer (red and gold) at his feet; the series template: PART 1 big,
// the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/parshu1_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 1060, 1);
    sunsetRidge(.3, { top: 1630, wind: 1 });
    parshurama(540, 1640, 24, { flip: 1, boilKey: 'covpsr', seed: 5, axe: 'raise', axeA: -.55, axeGlow: 1, wind: .8, aura: 1, eyes: 'normal', brow: -.5, mouth: 'flat' });
    kheerBowl(240, 1700, 220, { glow: '#FF6A3A', key: 'covr', steam: .8, halo: false });
    kheerBowl(840, 1700, 220, { glow: '#FFD86A', key: 'covg', steam: .8, halo: false });
    camEnd();
    // PART 1: the series badge
    boilSeed('covpill');
    paint(rrPts(540 - 170, 300 - 58, 340, 116, 58), { wash: '#F15A24', ink: PK.ink, sw: 1.6 });
    letter('PART 1', 540, 304, 92, '#FFF5E2', { screen: true, stroke: PK.ink, sw: .2, ink: false, rot: 0 });
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PK.ink, sw: .22, ink: false, maxW: 980, rot });
    L('PARSHURAMA', 470, 150, GOLDC);
    L('WAS BORN A WARRIOR', 600, 92, '#FFFFFF', -.02);
    L('BECAUSE OF A KHEER MIX-UP!', 705, 76, GOLDC);
  }]]);
})();
