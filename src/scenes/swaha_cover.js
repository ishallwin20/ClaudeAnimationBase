// swaha_cover.js: the Instagram cover for "Every time you say SWAHA, you're calling a GODDESS." (cover.html = studio.html
// + this). One still: Svaha rising in the havan's fire, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/swaha_cover
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  t = 3; const ex = night(); havan(t, { gold: .8, flare: .3 });
  render3(c, W3.scene, cam3({ pos: [K[0] + 2.5, .85, K[2] + .2], at: [K[0], 1.25, K[2]], fov: 52 }), { exposure: ex });
  svahaVision(c, 540, 1330, 2.85, t, 1);
  c.save(); const g = c.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(4,2,6,.92)'); g.addColorStop(.65, 'rgba(4,2,6,.6)'); g.addColorStop(1, 'rgba(4,2,6,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 640); c.restore();
  text(c, 'Every time you say', 540, 300, 'italic 54px Marcellus', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 20] });
  text(c, 'स्वाहा', 540, 420, '150px "Tiro Devanagari Sanskrit"', '#F4C46A', { glow: ['rgba(255,150,40,.8)', 40] });
  c.save(); const h = c.createLinearGradient(0, 1250, 0, H); h.addColorStop(0, 'rgba(4,2,6,0)'); h.addColorStop(.45, 'rgba(4,2,6,.82)'); h.addColorStop(1, 'rgba(4,2,6,.92)'); c.fillStyle = h; c.fillRect(0, 1250, W, H - 1250); c.restore();
  text(c, "you're calling a GODDESS", 540, 1530, '700 64px Cinzel', '#FF9A6A', { glow: ['rgba(5,4,12,.9)', 20], maxW: 1000 });
  text(c, 'Did you know?', 540, 1610, 'italic 46px Marcellus', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 16] });
} });
