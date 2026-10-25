// katha_thread_cover.js: the Instagram cover for "The gold thread" (cover.html = studio.html + this). Replaces the reel's
// shots with one still: the family constellation with its gold line, the gold threads still rising; the title kept
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/katha_thread_out (then t0_00.png → cover.png)
const LIFE = SHOTS[0].draw;
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c) {
  LIFE(c, 61.8, 61.8);
  const g = c.createLinearGradient(0, 1150, 0, 1700); g.addColorStop(0, 'rgba(3,5,14,0)'); g.addColorStop(.35, 'rgba(3,5,14,.82)'); g.addColorStop(1, 'rgba(3,5,14,.9)');
  c.fillStyle = g; c.fillRect(0, 1150, W, 770);
  text(c, 'Your life, as a thread.', 540, 1330, '64px Marcellus', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 20], maxW: 900 });
  text(c, 'Watch the', 540, 1440, '64px Marcellus', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 20] });
  text(c, 'GOLD one', 540, 1560, '700 112px Cinzel', '#F4C46A', { glow: ['rgba(244,196,106,.6)', 34], spacing: 6, maxW: 960 });
} });
