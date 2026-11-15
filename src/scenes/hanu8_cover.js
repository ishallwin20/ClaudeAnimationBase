// hanu8_cover.js: the Instagram cover for ad 96 (cover.html = studio.html + this). One still: Hanuman kneeling with
// joined palms, a heap of jewels beside him that he isn't looking at, a "?" in his thought bubble. The series
// template: the orange PART 8 pill over the title, inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/hanu8_cover
SHOTS.length = 0;
(() => {
  shots([[0, (t) => {
    camBegin(540, 1010, 1.0);
    warmBack(.4, 'cov', 540, 1250);
    h8Jewels(240, 1640, 420, .4, 'covjw', 8);
    hanuman(620, 1640, 23, { boilKey: 'covh', seed: 60, gada: 0, sit: 1, pray: 1, hx: .35, lookX: .7, lookY: -.6, eyes: 'happy', mouth: 'smile', blush: .5, bow: .06 });
    h4Bubble(900, 1010, 112, 104, 800, 1180, 1, 'covbb', '#FFFDF2');
    glow(900, 1010, 110, H8.goldLt, .5);
    letter('?', 900, 1016, 150, '#F5C542', { stroke: HSK.ink, sw: .2, ink: false, rot: .05 });
    camEnd();
    hsCoverTitle(8, [['RAM GAVE EVERYONE JEWELS.', 430, 84, '#FFFFFF'], ['HANUMAN', 570, 190, '#F5C542'], ['ASKED FOR THIS.', 716, 118, '#FFFFFF']]);
  }]]);
})();
