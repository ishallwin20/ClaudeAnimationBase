// hanu10_cover.js: the Instagram cover for ad 99 (cover.html = studio.html + this). One still: Hanuman sitting in the
// golden meadow of Kimpurusha-varsha, a hand cupped to his ear, heart eyes, the gandharvas' notes drifting to him. The
// series template: the orange PART 10 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu10_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 960, 1.0);
    h10Varsha(.4, 'cov', 1560);
    glow(540, 1260, 420, '#FFF2C0', .6);
    gandharva(150, 1590, 11.5, 0, { boilKey: 'cg0', strum: 1, hx: .35, lookX: .7, eyes: 'happy', mouth: 'open' });
    gandharva(935, 1590, 11.5, 1, { boilKey: 'cg1', flip: true, strum: 1, hx: -.35, lookX: -.7, eyes: 'happy', mouth: 'smile' });
    for (const [x, y, s, c, f] of [[270, 1150, 17, '#F5C542', 1], [340, 1060, 13, '#FFFFFF', 0], [800, 1130, 17, '#FFFFFF', 1], [730, 1050, 13, '#F5C542', 0]]) h10Note(x, y, s, 'cn' + x, c, 255, f);
    hanuman(540, 1640, 27, { boilKey: 'covh', seed: 60, gada: 0, sit: 1, hx: .3, lookX: .8, eyes: 'heart', mouth: 'grin', blush: .7, htilt: .1, handR: [4.5, -20.7], bendR: -1 });
    for (const [x, y, r] of [[330, 1250, 24], [270, 1320, 17]]) { boilSeed('ch' + x); paint(heartPts(x, y, r), { wash: '#F2557A', ink: '#2B2233', sw: .9 }); }
    camEnd();
    // the series' cover marks (hsCoverTitle), with a wider pill for "PART 10 · FINALE"
    boilSeed('covpill');
    paint(rrPts(540 - 300, 300 - 58, 600, 116, 58), { wash: HSK.orange, ink: HSK.ink, sw: 1.6 });
    letter('PART 10 · FINALE', 540, 304, 84, HSK.cream, { screen: true, stroke: HSK.ink, sw: .2, ink: false, rot: 0, maxW: 540 });
    for (const [txt, y, size, col] of [['HANUMAN IS', 432, 104, '#FFFFFF'], ['STILL ALIVE.', 580, 168, '#F5C542'], ['THIS IS WHAT HE', 716, 92, '#FFFFFF'], ['DOES ALL DAY.', 820, 104, '#FFFFFF']]) letter(txt, 540, y, size, col, { screen: true, stroke: HSK.ink, sw: .22, ink: false, maxW: 980, rot: -.02 });
  }]]);
})();
