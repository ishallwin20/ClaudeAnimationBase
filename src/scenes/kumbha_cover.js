// kumbha_cover.js: the Instagram cover for the Kumbhakarna reel (cover.html = studio.html + this). Replaces the reel's
// shots with one still: Kumbhakarna's face, his eyes white, Saraswati's syllables pouring into his mouth; the title kept
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/kumbha_out (then t0_00.png → cover.png)
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 2;
  SKY.fire(c); glow(c, 540, 1200, 800, '#FF7A2A', .35);
  faceAt(c, 540, 1180, 4.6, { t, expr: 'speak', pal: POSSESSED, eyes: 1 });
  glow(c, 540, 1180 + 49 * 4.6, 260, '#FFD890', .6);
  syllables(c, [[-100, 700], [200, 880], [420, 1220], [540, 1405]], t, { a: 1, shrink: true, size: 62 });
  for (const [y0, y1] of [[220, 640], [1380, 1760]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(10,3,4,0)'); g.addColorStop(.35, 'rgba(10,3,4,.85)'); g.addColorStop(.65, 'rgba(10,3,4,.85)'); g.addColorStop(1, 'rgba(10,3,4,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, 'THE GODS FEARED', 540, 360, '700 62px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 22], spacing: 3, maxW: 960 });
  text(c, 'HIS WISH', 540, 470, '700 100px Cinzel', '#F4C46A', { glow: ['rgba(255,170,90,.6)', 30], spacing: 5, maxW: 980 });
  text(c, 'SO A GODDESS', 540, 1490, '700 66px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 22], spacing: 3, maxW: 960 });
  text(c, 'TOOK HIS TONGUE', 540, 1610, '700 92px Cinzel', '#F4C46A', { glow: ['rgba(255,170,90,.7)', 36], spacing: 4, maxW: 980 });
} });
