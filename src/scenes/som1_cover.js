// som1_cover.js: the Instagram cover for ad 120 (cover.html = studio.html + this). One still: Somnath at sunset by the
// sea; JYOTIRLINGA 1/12, SOMNATH big, PART I, the hook; all inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/som1_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); TM.set(.5, { flag: 1 }); const ex = SW.mood('golden', { t: .5 });
  render3(c, SW.scene, tCam({ pos: [98, 5, 50], at: [8, 30, 0], fov: 50 }), { exposure: ex, fx: lens(100) });
  const band = (y0, y1, a) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); };
  band(220, 760, .72);
  text(c, 'JYOTIRLINGA 1 / 12', 540, 330, '700 46px "Space Mono"', '#FFF3DC', { spacing: 6, glow: ['rgba(0,0,0,.9)', 18] });
  text(c, 'SOMNATH', 540, 470, '900 150px Cinzel', '#FFC65A', { spacing: 8, glow: ['rgba(255,150,60,.55)', 36], maxW: 1000 });
  text(c, 'PART I', 540, 600, '700 44px Cinzel', '#FBE8C8', { spacing: 14, glow: ['rgba(0,0,0,.9)', 16] });
  band(1240, 1720, .74);
  text(c, 'BROKEN 5 TIMES.', 540, 1400, '400 96px Anton', '#FFF4E4', { spacing: 3, glow: ['rgba(0,0,0,.85)', 26], maxW: 980 });
  text(c, 'STILL STANDING.', 540, 1520, '400 110px Anton', '#FFC65A', { spacing: 5, glow: ['rgba(255,150,60,.45)', 30], maxW: 980 });
  jTag(c, 9, 0, 99, 'WE NAME THE ONES WHO REBUILT', 540, 1625, { align: 'center', col: '#E8B030' });
} });
