// ayy1_cover.js: the Instagram cover for ad 101 (cover.html = studio.html + this). One still: little Ayyappa with his
// bell between Shiva and Mohini, in the warm light of the hook. The series template: the orange PART 1 pill over the
// title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/ayy1_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 960, 1.0);
    warmBack(.4, 'cov', 540, 1300);
    glow(540, 1350, 460, '#FFE9A8', .6);
    shivaStand(170, 1660, 17, { boilKey: 'covs', seed: 21, eyes: 'happy', mouth: 'smile', hx: .45, lookX: .8, trishul: 1 });
    mohini(910, 1640, 18, { boilKey: 'covm', seed: 33, eyes: 'happy', mouth: 'smile', hx: -.45, lookX: -.8, glowK: .4 });
    ayyappa(540, 1650, 38, { boilKey: 'cova', seed: 7, pose: 'sit', eyes: 'happy', mouth: 'grin', blush: .6, bellSwing: .25, glowK: .5 });
    for (const [x, y, r] of [[330, 1020, 22], [760, 1000, 20], [700, 940, 14]]) { boilSeed('ch' + x); paint(heartPts(x, y, r), { wash: '#F2557A', ink: '#2B2233', sw: .9 }); }
    camEnd();
    hsCoverTitle(1, [['HIS FATHER IS SHIVA.', 440, 92, '#FFFFFF'], ['HIS MOTHER IS', 556, 92, '#FFFFFF'], ['VISHNU.', 712, 188, '#F5C542']]);
  }]]);
})();
