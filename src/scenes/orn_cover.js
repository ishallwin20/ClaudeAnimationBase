// orn_cover.js: the Instagram cover for "Why does SHIVA wear such SCARY ornaments?" (cover.html = studio.html + this).
// One still: the cobra reared in the jewel studio, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/orn_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const ex = studio({ t: 2, key: [1.4, 2.4, 2.6], keyAt: [0, .45, 0], cone: .42, spot: 70 });
  COB.visible = true; COB.set(2, { rise: 1, hood: 1, tongue: 0 }); TUSK.visible = true; TUSK.position.set(-.45, .036, .35); TUSK.rotation.set(-Math.PI / 2, 0, .9);
  clip(.02, 60);
  const cam = orbit(1.75, .14, .18, [.03, .45, .1], 32);
  render3(c, ST.S, cam, { exposure: ex, fx: lens(dist([.03, .6, .2]), 9) });
  c.save(); const g = c.createLinearGradient(0, 220, 0, 640); g.addColorStop(0, 'rgba(6,3,4,.92)'); g.addColorStop(.65, 'rgba(6,3,4,.55)'); g.addColorStop(1, 'rgba(6,3,4,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 640); c.restore();
  text(c, 'Why does SHIVA wear', 540, 340, '700 66px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 2, maxW: 980 });
  text(c, 'SCARY ORNAMENTS?', 540, 450, '700 96px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 30], spacing: 2, maxW: 1000 });
  c.save(); const h = c.createLinearGradient(0, 1280, 0, H); h.addColorStop(0, 'rgba(6,3,4,0)'); h.addColorStop(.35, 'rgba(6,3,4,.8)'); h.addColorStop(1, 'rgba(6,3,4,.92)'); c.fillStyle = h; c.fillRect(0, 1280, W, H - 1280); c.restore();
  text(c, 'the real stories, from the', 540, 1480, 'italic 46px Marcellus', '#F4E6CC', { glow: ['rgba(6,3,4,.9)', 16] });
  text(c, 'PURANAS', 540, 1580, '700 104px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 30], spacing: 8 });
} });
