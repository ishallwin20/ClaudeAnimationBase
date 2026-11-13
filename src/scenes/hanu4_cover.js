// hanu4_cover.js: the Instagram cover for ad 89 (cover.html = studio.html + this). One still: Hanuman alone on Lanka's
// wall at night, a rain cloud over him, his little lamp still burning beside him; the series template: the orange
// PART 4 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu4_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1180, 1);
    h4Wall(.4, 'cov');
    hanuman(500, 1640, 31, { boilKey: 'covh', seed: 60, crown: false, gada: 0, sit: 1, bow: .4, eyes: 'sad', mouth: 'frown', lookX: .6, lookY: .4, hx: .3, tail: 'droop', gloom: .45, handL: [-3.0, -10.8], handR: [3.0, -10.8] });
    boilSeed('covcloud'); emote('cloud', 520, 1010, 50, 1, 3.3);
    glow(800, 1580, 260, '#FFD27A', .55);
    diya(770, 1640, 44, 1, 'cov');
    camEnd();
    hsCoverTitle(4, [['THE NIGHT HANUMAN', 470, 104, '#FFFFFF'], ['ALMOST GAVE UP', 616, 140, '#F5C542']]);
  }]]);
})();
