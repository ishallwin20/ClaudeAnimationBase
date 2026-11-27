// jtrail_cover.js: the Instagram cover for ad 119 (cover.html = studio.html + this). One still: Somnath at sunset, the
// top of its spire blown apart into flying stone; the title inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/jtrail_out   (then rename t0_00.png to cover.png)
SHOTS.length = 0; CAPTIONS.length = 0; POST.length = 0;
SHOTS.push({ a: 0, b: 1, draw(c, u, t) {
  reset(); TM.set(.5, { brk: .17, dust: .5, flag: 1 }); const ex = SW.mood('golden', { t: .5 });
  render3(c, SW.scene, tCam({ pos: [96, 6, 50], at: [8, 30, 0], fov: 50 }), { exposure: ex, fx: lens(100) });
  const band = (y0, y1, a) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); };
  band(200, 820, .7);
  jTitle(c, 9, 0, 470, { tag: 'The trailer' });
  band(1260, 1700, .72);
  text(c, 'THEY TRIED TO ERASE THEM.', 540, 1400, '400 84px Anton', '#FFF4E4', { spacing: 3, glow: ['rgba(0,0,0,.85)', 26], maxW: 980 });
  text(c, 'THEY FAILED.', 540, 1510, '400 110px Anton', '#FFC65A', { spacing: 5, glow: ['rgba(255,150,60,.45)', 30], maxW: 980 });
  jTag(c, 9, 0, 99, "WE NAME THE ONES WHO REBUILT", 540, 1615, { align: 'center', col: '#E8B030' });
} });
