// nidhi_cover.js: the Instagram cover for ad 116 (cover.html = studio.html + this). One still: the path at night, the
// moon rising over the Rang Mahal's dome, lamplight in its door; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/nidhivan_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  GR.set('night', { az: 0, el: 8.5, fog: .055, moonSize: 9, bgK: .5 }); GR.rmGlow.material.opacity = .6; GR.fill.intensity = 0;
  render3(c, GR.scene, cam3({ pos: [0, 1.3, -4.5], at: [0, 2.6, -30], fov: 50 }), { exposure: 1.3, fx: lens(9, 2.5, { ...NIGHTG, rays: moonRays(.9) }) });
  const band = (y0, y1, a) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); };
  band(240, 700, .6);
  text(c, 'NOBODY ENTERS', 540, 400, '400 130px Anton', '#FFF4E4', { spacing: 4, glow: ['rgba(0,0,0,.8)', 30], maxW: 980 });
  text(c, 'AFTER SUNSET', 540, 545, '400 130px Anton', '#FFC65A', { spacing: 4, glow: ['rgba(255,150,60,.45)', 34], maxW: 980 });
  band(1300, 1680, .65);
  text(c, 'NIDHIVAN', 540, 1450, '400 150px Anton', '#FFF4E4', { spacing: 10, glow: ['rgba(0,0,0,.85)', 30] });
  tag(c, 9, 0, 99, 'VRINDAVAN · LOCKED EVERY NIGHT', 540, 1575, { align: 'center' });
} });
