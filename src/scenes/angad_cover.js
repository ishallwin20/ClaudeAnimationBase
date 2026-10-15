// angad_cover.js: the Instagram cover for ad 20 (cover.html = studio.html + this). Replaces the reel's shots with one
// still: Angad planted in Ravana's court, arms folded, a chain of rakshasas heaving at his leg, and the title kept
// inside the 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/angad_cover
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 50.6;
  court(c, { z: 1 }, t, { top: 300, floor: 1560, n: 6 });
  plane(c, { z: 1 }, 1, (c) => {
    glow(c, 640, 1250, 600, '#FFB060', .25);
    angadFig(c, 700, 1760, 1.08, t, { pose: 'plant', expr: 'smirk', look: [-.6, .4] });
    figure(c, (f) => { for (let i = 3; i >= 0; i--) warrior(f, 310 - i * 205, 1760, .7, t, { pull: 1, crown: i === 0, seed: i, hx: 300, hy: -200 }); }, SIL('#0E0608', '#FFB070', .92));
    embers(c, 540, 1800, t, 40, 18, 1100, 1300);
  });
  for (const [y0, y1] of [[180, 520], [1360, 1720]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(8,2,4,0)'); g.addColorStop(.35, 'rgba(8,2,4,.78)'); g.addColorStop(.65, 'rgba(8,2,4,.78)'); g.addColorStop(1, 'rgba(8,2,4,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, "RAVANA'S WHOLE COURT", 540, 310, '700 70px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, "COULDN'T MOVE", 540, 405, '700 76px Cinzel', '#F4C46A', { glow: ['rgba(244,150,60,.6)', 26], spacing: 3, maxW: 960 });
  text(c, "ONE MONKEY'S", 540, 1470, '700 66px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, 'FOOT', 540, 1590, '700 150px Cinzel', '#F4C46A', { glow: ['rgba(255,170,60,.85)', 40], spacing: 8, maxW: 980 });
} });
