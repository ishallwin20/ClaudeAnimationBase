// hanu21_cover.js: the Instagram cover for ad 90 (cover.html = studio.html + this). One still: Hanuman on warm gold
// with the three badges (a shield 8, a violet 8, a green 9); the series template: the orange PART 2.1 pill over the
// title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu21_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1060, 1);
    warmBack(.4, 'cov', 540, 1250);
    [[200, 1250], [880, 1130], [880, 1420]].forEach(([x, y], i) => h21Badge(x, y, 110, i, 1, .4, 'covb' + i));
    hanuman(540, 1780, 25, { boilKey: 'covh', seed: 60, gada: 0, eyes: 'wide', mouth: 'O', lookX: .6, lookY: -.3, hx: .3, blush: .3,
      handR: [3.0, -24.2], bendR: 1.3, handL: [-3.4, -10.6], bendL: 1, htilt: .1, tailSway: 1, emote: '?', emoteK: 1, emoteAge: .5 });
    camEnd();
    hsCoverTitle('2.1', [['8 BOONS · 8 SIDDHIS', 470, 100, '#FFFFFF'], ['9 NIDHIS', 600, 140, '#F5C542'], ['NOT THE SAME!', 730, 96, '#FFFFFF']]);
  }]]);
})();
