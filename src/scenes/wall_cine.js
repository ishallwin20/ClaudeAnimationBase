// wall_cine.js: the Cinematic wallpapers (studio_wall_cine.html), seamless 6 s loops at 1290×2796, drawn in a
// 1080×2340 design space. The engine's own motion (shiva()'s breath and wind, rays, clouds) runs on t at rates that
// don't divide the loop, so it gets a clock that swings back and forth once a loop (ct); everything else is a whole
// number of cycles a loop. Times 100–106 are the same loop under the lock screen, for checking.
const WL = 6, DW = 1080, DH = 2340, KS = W / DW;
const lsin = (t, n = 1, ph = 0) => Math.sin((t / WL * n + ph) * TAU);
const clockT = t => 20 + 1.6 * Math.sin(TAU * t / WL);
// snow that falls a whole number of screens a loop
function snowLoop(c, t, n, seed, o = {}) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const s = i * 1.37 + seed, laps = 1 + Math.floor(hash(s + 2) * 2), k = frac(hash(s + 1) + t / WL * laps);
    const x = hash(s) * DW + Math.sin(k * TAU * 2 + s) * 30, y = -40 + k * (DH + 80), r = (o.r || 3) * (.4 + hash(s + 3));
    glow(c, x, y, r * 2.2, o.col || '#DCE6FF', (o.a ?? .7) * (.5 + .5 * hash(s + 4)));
  }
  c.restore();
}
function lockScreen(c) {
  c.save(); c.scale(KS, KS); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Thursday, 23 October', DW / 2, 255);
  c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}

// ---------- Shiva on Kailash under the full moon, eyes closed, the hand raised in blessing ----------
function shivaMoon(c, t, lock) {
  const ct = clockT(t);
  c.scale(KS, KS);
  sky(c, [[0, '#050913'], [800, '#0E1730'], [1500, '#22305A'], [2340, '#34426A']]);
  // the moon behind his head, its light breathing once a loop
  const mx = 540, my = 1290, br = .5 + .5 * lsin(t, 1);
  glow(c, mx, my, 900, '#5A74B8', .5); glow(c, mx, my, 520, '#9FB6F0', .45 + .08 * br);
  ellipse(c, mx, my, 215, 215, '#E9EEF8'); glow(c, mx, my, 300, '#FFFFFF', .25);
  for (const [a, b, r] of [[-70, -40, 40], [60, 50, 28], [20, -100, 20], [-50, 95, 24]]) ellipse(c, mx + a, my + b, r, r * .85, 'rgba(170,184,214,.35)');
  rays(c, mx, my, { n: 16, dir: Math.PI / 2, spread: 2.6, len: 1500, w: 160, col: '#BFD0F6', a: .16, t: ct, seed: 3 });
  // far peaks and Kailash, haze between
  ridge(c, 1650, 120, 4, '#1A2440', { freq: .006 });
  kailash(c, 230, 1440, 520, { rock: '#18203A', snow: '#6E7EA6', snowSh: '#3E4A6A' });
  kailash(c, 910, 1580, 380, { rock: '#151C34', snow: '#5E6E96', snowSh: '#384260', light: -1 });
  haze(c, 1780, 380, '#3E4C74', .5);
  ridge(c, 1950, 70, 9, '#0E1426', { freq: .005 });
  ledge(c, 300, 2140, '#0A0F1E', '#9FB6F0', .45);
  // Shiva, standing on the ledge
  figure(c, (f) => { f.translate(560, 2150); f.scale(1.05, 1.05); shiva(f, { t: ct, eyes: 0, arm: 'abhaya', wind: .35 + .1 * lsin(t, 1) }); },
    { ...LIGHTS.moon, grade: [[1400, 'rgba(0,0,0,0)'], [2400, 'rgba(4,7,18,.65)']], rim: { ...LIGHTS.moon.rim, a: .75 + .15 * br } });
  snowLoop(c, t, 70, 9, { r: 3.2, a: .55 });
  if (lock) { c.setTransform(1, 0, 0, 1, 0, 0); lockScreen(c); }
}
SHOTS.push({ a: 0, b: WL + 1, draw(c, u, t) { shivaMoon(c, t); } });
SHOTS.push({ a: 100, b: 100 + WL + 1, draw(c, u, t) { shivaMoon(c, t - 100, true); } });   // the lock-screen check: --sheet=100,103
