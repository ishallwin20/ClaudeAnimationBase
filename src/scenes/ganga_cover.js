// ganga_cover.js: the Instagram cover for the Ganga reel (cover.html = studio.html + this). Replaces the reel's shots
// with one still: Shiva, his locks spread wide, the river of heaven pouring into his jata; the title kept inside the
// 3:4 grid crop (y 240–1680).
//   node render.mjs --page=cover.html --stills=0 --out=out/ganga_out (then t0_00.png → cover.png)
SHOTS.length = 0; POST.length = 0; CAPTIONS.length = 0;
SHOTS.push({ a: 0, b: 100, draw(c, u, t) {
  t = 47.2;
  const X = 540, Y = 2230, K = 1.3, jt = Y - 1004 * K;
  SKY.storm(c); glow(c, 540, 200, 800, '#BFD8FF', .45);
  clouds(c, [[-300, 120, 1000, 11, 30], [400, 260, 900, 12, 40, true]], t, PALETTES.nightFar, .8);
  bolt(c, 900, -40, 820, 520, 21, .6);
  figure(c, (f) => { f.translate(X, Y); f.scale(K, K); jataSpread(f, { t, spread: .85, wet: 1 }); }, { ...MOON_FX, edge: { col: '#DCEBFF', w: 2, a: 0 }, rim: { col: '#DCEBFF', dx: 0, dy: -6, a: .7 } });
  figure(c, (f) => { f.translate(X, Y); f.scale(K, K); shiva(f, { t, eyes: 0, arm: 'abhaya', trishul: false, wind: .6 }); }, { ...MOON_FX, rim: { col: '#DCEBFF', dx: 0, dy: -6, a: 1.2, blur: 1 } });
  gangaFall(c, X, -120, jt + 70, 230, { t, w1: 250, splash: .7 });
  motes(c, { n: 70, seed: 4, box: [-100, 0, W + 100, 1900], r: 3, col: '#DCEBFF', a: .45, vx: 30, vy: 260, t });
  for (const [y0, y1] of [[180, 520], [1300, 1720]]) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(2,4,10,0)'); g.addColorStop(.35, 'rgba(2,4,10,.8)'); g.addColorStop(.65, 'rgba(2,4,10,.8)'); g.addColorStop(1, 'rgba(2,4,10,0)'); c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); }
  text(c, 'GANGA FELL FROM HEAVEN.', 540, 340, '700 64px Cinzel', '#F4C46A', { glow: ['rgba(120,170,255,.6)', 26], spacing: 2, maxW: 980 });
  text(c, 'SHIVA CAUGHT HER', 540, 1440, '700 70px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.9)', 24], spacing: 3, maxW: 960 });
  text(c, 'IN HIS HAIR', 540, 1580, '700 120px Cinzel', '#F4C46A', { glow: ['rgba(140,190,255,.85)', 40], spacing: 6, maxW: 980 });
} });
