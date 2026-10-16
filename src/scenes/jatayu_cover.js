// jatayu_cover.js: the Instagram cover for the Jatayu reel (cover.html = studio.html + this). Replaces the reel's shots
// with one still: Jatayu rising with his wings spread before the red sun, Ravana's gold chariot and its mules below,
// and the title kept inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/jatayu_cover
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 19.4;
  SKY.storm(c); ellipse(c, 540, 930, 300, 300, rgba('#FFC070', .95)); glow(c, 540, 930, 700, '#FF9A3A', .6);
  clouds(c, [[-300, 1180, 1000, 63, 20], [300, 640, 900, 65, 30, true]], t, PALETTES.nightFar, .55);
  figure(c, (f) => { f.translate(540, 960); f.scale(.6, .6); jatayu(f, { t, pose: 'spread', flap: .15, expr: 'fierce', strike: .6, wind: 1 }); }, SIL_FX(.82));
  figure(c, (f) => { f.translate(250, 1560); f.scale(.3, .3); rig(f, { t, frontL: 'bow' }); }, SIL_FX(.8));
  for (const [y0, y1] of [[180, 520], [1340, 1720]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(8,2,4,0)'); g.addColorStop(.35, 'rgba(8,2,4,.78)'); g.addColorStop(.65, 'rgba(8,2,4,.78)'); g.addColorStop(1, 'rgba(8,2,4,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, '60,000 YEARS OLD.', 540, 330, '700 76px Cinzel', '#F4C46A', { glow: ['rgba(244,150,60,.6)', 26], spacing: 3, maxW: 960 });
  text(c, 'HE FOUGHT', 540, 1470, '700 70px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, 'RAVANA', 540, 1590, '700 140px Cinzel', '#F4C46A', { glow: ['rgba(255,170,60,.85)', 40], spacing: 8, maxW: 980 });
} });
