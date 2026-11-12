// hanu2_cover.js: the Instagram cover for ad 86 (cover.html = studio.html + this). One still: baby Hanuman standing in
// a ring of the eight boons' icons, glowing, on warm gold; the series template: the orange PART 2 pill over the title,
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu2_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    warmBack(.4, 'cov', 540, 1200);
    glow(540, 1230, 560, '#FFE6A0', .4);
    const X = 540, Y = 1600, u = 50;
    const o = { pose: 'stand', boilKey: 'covbaby', seed: 3, eyes: 'sparkle', mouth: 'grin', blush: .7, glowK: .7, tailSway: 1.2,
      handL: [-3.6, -10.8], handR: [3.6, -10.8], handShapeL: 'fist', handShapeR: 'fist', bendL: -1, bendR: -1 };
    balHanuman(X, Y, u, o);
    const P = [[150, 1010], [120, 1250], [170, 1490], [330, 1620], [750, 1620], [910, 1490], [960, 1250], [930, 1010]];
    P.forEach(([x, y], i) => {
      glow(x, y, 150, BOON_COL[i], .6);
      boilSeed('covslot' + i); paint(ellPts(x, y, 72, 72, 24), { wash: '#FFF5E2', ink: HSK.ink, sw: 1.6 });
      boonIcon(i, x, y, 44);
    });
    camEnd();
    hsCoverTitle(2, [['BABY HANUMAN GOT', 470, 104, '#FFFFFF'], ['8 SUPERPOWERS', 626, 150, '#F5C542']]);
  }]]);
})();
