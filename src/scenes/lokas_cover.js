// lokas_cover.js: the Instagram cover for "7 worlds below your feet" (cover.html = studio.html + this).
// One still: the column of the seven worlds glowing in the dark, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/lokas_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  base(2, { ext: 1.1, inside: 1.3 });
  orbit(178, .06, .32, [0, -31.5, 0], 34);
  render3(c, COL.S, CAM3, { exposure: 1.15, fx: lens(dist(COLC), 2) });
  WORLDS.forEach((w, i) => { const [x, y] = toScreen3([LK.R * .72, LK.mid(i), LK.R * .72]); c.save(); c.font = '700 42px Cinzel'; c.letterSpacing = '3px'; const ww = c.measureText(w.name).width; c.restore(); text(c, w.name, x + 36 + ww / 2, y + 2, '700 42px Cinzel', lighten(w.col, .35), { glow: ['rgba(4,4,10,.95)', 18], spacing: 3 }); });
  c.save(); const g = c.createLinearGradient(0, 220, 0, 500); g.addColorStop(0, 'rgba(4,4,10,.92)'); g.addColorStop(.7, 'rgba(4,4,10,.6)'); g.addColorStop(1, 'rgba(4,4,10,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 500); c.restore();
  text(c, '7 WORLDS', 540, 318, '700 120px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 30], spacing: 6 });
  text(c, 'BELOW YOUR FEET', 540, 420, '700 76px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3 });
  c.save(); const h = c.createLinearGradient(0, 1300, 0, H); h.addColorStop(0, 'rgba(4,4,10,0)'); h.addColorStop(.35, 'rgba(4,4,10,.8)'); h.addColorStop(1, 'rgba(4,4,10,.92)'); c.fillStyle = h; c.fillRect(0, 1300, W, H - 1300); c.restore();
  text(c, 'and not one of them is', 540, 1500, 'italic 46px Marcellus', '#F4E6CC', { glow: ['rgba(4,4,10,.9)', 16] });
  text(c, 'HELL', 540, 1600, '700 104px Cinzel', '#FF7A5A', { glow: ['rgba(255,90,60,.55)', 30], spacing: 10 });
} });
