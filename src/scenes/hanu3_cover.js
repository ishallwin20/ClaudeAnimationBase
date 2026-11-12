// hanu3_cover.js: the Instagram cover for ad 88 (cover.html = studio.html + this). One still: the little monk with a
// finger to his lips and, peeking from behind him, his real self (tail and all) on warm gold; the series template:
// the orange PART 3 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu3_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 960, 1);
    warmBack(.4, 'cov', 540, 1200);
    glow(540, 1250, 560, '#FFE6A0', .4);
    // Hanuman peeking out from behind the monk, grinning
    hanuman(700, 1660, 30, { boilKey: 'covh', seed: 60, crown: false, gada: 0, eyes: 'happy', mouth: 'grin', blush: .7, hx: .4, htilt: .22, handR: [4.8, -19.6], bendR: .6, tailSway: 1.4 });
    bhikshu(470, 1690, 34, { boilKey: 'covm', seed: 61, eyes: ['closed', 'normal'], mouth: 'smile', blush: .6, handR: [1.0, -18.6], bendR: 1, htilt: .05 });
    camEnd();
    hsCoverTitle(3, [['HANUMAN MET RAM', 470, 104, '#FFFFFF'], ['IN DISGUISE', 616, 150, '#F5C542']]);
  }]]);
})();
