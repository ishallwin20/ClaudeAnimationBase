// pearls_cover.js: the Instagram cover for ad 59 (cover.html = studio.html + this). One still: Hanuman close on the
// peach rays, his heart open with tiny Ram and Sita inside, bitten pearls at his feet; the title inside the 3:4 grid
// crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/pearls_cover
SHOTS.length = 0;
(() => {
  const GOLDC = '#F5C542';
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    peachGround(.5, 540, 1300);
    const X = 540, Y = 2060, u = 44;
    glow(X, Y - 15.4 * u, 420, '#FFC870', .7);
    hanuman(X, Y, u, { mala: false, boilKey: 'cov', seed: 2, noShadow: true, eyes: 'happy', mouth: 'grin', blush: .5, hx: 0, htilt: .04,
      handL: [-2.3, -15.6], handR: [2.3, -15.6], bendL: 1, bendR: 1, chest: (uu, sw) => heartReveal(uu, sw, 1, { t: .5, key: 'covheart', wave: 1 }) });
    boilSeed('covpearls');
    [[150, 1560, 1], [250, 1610, -1], [880, 1590, 1], [960, 1540, -1]].forEach(([x, y, s], i) => pearlHalf(x, y, 30, s, i * .7 - 1));
    pearl(820, 1640, 30); pearl(200, 1680, 26);
    camEnd();
    const L = (txt, y, size, col, rot = -.025) => letter(txt, 540, y, size, col, { screen: true, stroke: PAL.ink, sw: .22, ink: false, maxW: 980, rot });
    L('WHY DID HANUMAN JI', 330, 96, PAL.cream);
    L('BITE', 460, 150, GOLDC);
    L("MAA SITA'S PEARLS?", 600, 104, '#FFFFFF', -.02);
  }]]);
})();
