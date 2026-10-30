// pushpak_cover.js: the Instagram cover for "The whole Ramayan in one flight" (cover.html = studio.html + this).
// One still: the Pushpak in the morning gold over the Lanka coast, the route north lit below, the title inside the 3:4
// grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/pushpak_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); CAM3.near = .2; const q = flyAt(1.2, { alt: 4, wisps: .7, wo: { v: 3, w: 6, span: 30, wide: 14, tall: 3, dy: -2 } });
  const ex = golden(q.p, { fogNear: 150, fogFar: 1600, shadow: 30 }); I3.set(1.2, { clouds: .3 });
  const C = chase(q, 12.5, .22, -2.4, { ly: -.2, fov: 34 });
  render3(c, I3.scene, C.cam, { exposure: ex * 1.05, fx: FXM(C.d, 7) });
  c.save(); const g = c.createLinearGradient(0, 220, 0, 720); g.addColorStop(0, 'rgba(6,4,8,.9)'); g.addColorStop(.6, 'rgba(6,4,8,.55)'); g.addColorStop(1, 'rgba(6,4,8,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 720); c.restore();
  text(c, 'THE WHOLE', 540, 360, '700 76px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 6, maxW: 1000 });
  text(c, 'RAMAYAN', 540, 470, '700 128px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 30], spacing: 4, maxW: 1000 });
  text(c, 'in ONE flight', 540, 570, 'italic 64px Marcellus', '#FFE8C0', { glow: ['rgba(5,4,12,.9)', 20] });
  c.save(); const h = c.createLinearGradient(0, 1280, 0, H); h.addColorStop(0, 'rgba(6,4,8,0)'); h.addColorStop(.35, 'rgba(6,4,8,.8)'); h.addColorStop(1, 'rgba(6,4,8,.92)'); c.fillStyle = h; c.fillRect(0, 1280, W, H - 1280); c.restore();
  text(c, 'LANKA → AYODHYA', 540, 1470, '700 60px Cinzel', '#FFE2A0', { glow: ['rgba(255,150,40,.6)', 24], spacing: 4 });
  text(c, 'every stop, told by Ram himself', 540, 1555, '42px Marcellus', '#F4E6CC', { glow: ['rgba(6,3,4,.9)', 16] });
} });
