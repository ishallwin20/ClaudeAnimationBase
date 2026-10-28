// yama_cover.js: the Instagram cover for "Diwali is FIVE days. The god of DEATH gets THREE." (cover.html = studio.html
// + this). One still: Yama on his buffalo halted in the misty lane, seen from the doorway past the Yama diya, the five
// days with his three marked, the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/yama_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  const tt = TL.C1 + .1 + 2.35;   // halted at the light
  reset(tt); const ex = lane({ inner: 1.0 }); V.hero.setOpen(.95);
  const w = yamaWalk(tt, TL.C1 + .1);
  HD.flame.set(tt, 1.6);
  const cam = cam3({ pos: [HERO.x - .22, .8, -.12], at: [YAMA_X, .95, 1.3], fov: 66 });
  BACK.position.set(YAMA_X + 2.4, 2.0, w.z + .6); BACK.material.opacity = .95; BACK.scale.set(14, 9, 1); BACK.visible = true;
  YB.place([YAMA_X, 0, w.z], { h: 3.9, yaw: -Math.PI / 2, flip: true, a: 1, draw: (g, push) => rider(g, push, { d: w.d, t: tt }) });
  render3(c, SC, cam, { exposure: ex * 1.2 });
  eyeGlows(c, 1, { r: 36 });
  c.save(); const g = c.createLinearGradient(0, 220, 0, 760); g.addColorStop(0, 'rgba(6,5,12,.92)'); g.addColorStop(.65, 'rgba(6,5,12,.6)'); g.addColorStop(1, 'rgba(6,5,12,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 760); c.restore();
  text(c, 'DIWALI IS 5 DAYS.', 540, 330, '700 74px Cinzel', '#FFF3DC', { glow: ['rgba(5,4,12,.9)', 24], spacing: 3, maxW: 980 });
  text(c, 'THE GOD OF DEATH', 540, 430, '700 76px Cinzel', '#FF8A6A', { glow: ['rgba(255,80,40,.55)', 30], spacing: 2, maxW: 980 });
  text(c, 'GETS 3', 540, 545, '700 120px Cinzel', '#F4C46A', { glow: ['rgba(244,170,60,.6)', 34], spacing: 4, maxW: 980 });
  c.save(); const h = c.createLinearGradient(0, 1380, 0, 1640); h.addColorStop(0, 'rgba(6,5,12,0)'); h.addColorStop(.5, 'rgba(6,5,12,.6)'); h.addColorStop(1, 'rgba(6,5,12,0)'); c.fillStyle = h; c.fillRect(0, 1380, W, 260); c.restore();
  tracker(c, 9, { cur: -1, noPop: true, marks: true, y: 1520 });
} });
