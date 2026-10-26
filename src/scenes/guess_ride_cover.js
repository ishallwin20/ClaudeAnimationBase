// guess_ride_cover.js: the Instagram cover for "Guess whose ride I am?" (cover.html = studio.html + this): the three
// vahanas in a row under the question, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/guess_ride_out (then t0_00.png → cover.png)
SHOTS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c) {
  sbBg(c, '#F2A93B', { speck: [34, 'rgba(201,124,31,.5)'], seed: 20 });
  sbGround(c, 60, 1020, 1520, '#D98C27', { seed: 9, n: 30 });
  sbMouse(c, 220, 1520, .5, { t: .4, hold: 'modak' }); sbOwl(c, 540, 1520, .56, { t: .8 }); sbDonkey(c, 850, 1520, .5, { t: .2 });
  sbSay(c, 'Guess whose | *ride* I am?', 540, 560, 150, { hi: SB.ink, seed: 7 });
  sbSay(c, '3 rounds: easy to *hard*', 540, 820, 84, { hi: SB.ink, seed: 12 });
} });
