// rp5_props.js: sets and props for rp5.js (Ramayan Part 5, "One Man, 14,000 Demons"). Loaded after src/ramayan.js and
// src/ramayan_sets.js (P1, ashram, tree, bush, hut, notes, tears, arrowAt). Pure functions of their arguments.
//   P5                         the palette
//   duskField, caveMouth       sets
//   horde, arrowRain, counter  the battle
const P5 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  duskHi: '#B8483A', duskLo: '#F2A060', sun: '#FFE0A8', ground: '#6A3A2A', groundDk: '#4A2418', rock: '#8A7A6A', rockDk: '#5E5048', cave: '#1E1418',
};

// the battlefield at dusk: a red sky, a low sun, dark ground to the horizon; sun 0..1 sets it lower (time passing)
function duskField(t, key = 'df', sun = 0) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 2400), { wash: P5.duskHi, ink: null });
  paint(ellPts(540, 1300, 1100, 600, 26), { fill: P5.duskLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  const sy = lerp(1080, 1300, sun);
  glow(780, sy, 300, '#FFD890', .5); paint(ellPts(780, sy, 90, 90, 20), { wash: P5.sun, ink: null });
  boilSeed(key + 'ground');
  paint(rectPts(-600, 1420, W + 1200, 1300), { wash: P5.ground, ink: null });
  paint(ellPts(540, 1800, 900, 260, 22), { fill: P5.groundDk, fillOp: 90, bleed: .3, tex: .5, ink: null });
  inkLine([[-100, 1420], [500, 1410], [1200, 1425]], .9, P5.ink, 'ink', .5);
}
// a rocky hill with a cave mouth, the cave's foot at (x, y), s wide
function caveMouth(x, y, s, key = 'cv') {
  boilSeed(key);
  paint([[x - s * .6, y], [x - s * .5, y - s * .5], [x - s * .2, y - s * .8], [x + s * .2, y - s * .75], [x + s * .55, y - s * .4], [x + s * .65, y]], { wash: P5.rock, fill: P5.rockDk, fillOp: 60, tex: .5, ink: P5.ink, sw: 1, curv: .3 });
  paint([[x - s * .22, y], [x - s * .2, y - s * .3], [x, y - s * .42], [x + s * .2, y - s * .3], [x + s * .22, y]], { wash: P5.cave, ink: P5.ink, sw: 1, curv: .45 });
}
// the horde: rows of demons (Raktabija's far crowd) on the right half; gone 0..1 knocks them down from the front
function horde(t, key = 'hd', gone = 0, n = 48, x0 = 430) {
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 8), col = i % 8, x = x0 + col * 80 + (row % 2) * 40 + 8 * Math.sin(t * 2 + i), y = 1450 + row * 70, u = 4 + row * 1.4;
    const down = gone * n > n - 1 - i ? 1 : 0;   // the nearest rows fall first
    raktabija(x, y, u, { boilKey: key + i, lod: 1, rot: down ? 1.4 : Math.sin(t * 3 + i) * .05, dy: down ? .5 : 0, eyes: down ? 'x' : 'angry', tint: down ? '#4A3A3A' : null, tintK: .5 });
  }
}
// arrows streaking from (x0, y0) to the right, many at once (phase t)
function arrowRain(t, x0, y0, n = 10, key = 'ar') {
  for (let i = 0; i < n; i++) {
    const k = frac(t * 2.2 + i / n), x = x0 + k * 900, y = y0 - 300 * Math.sin(k * Math.PI) * (.4 + .6 * hash(i * 2.2)) + (hash(i * 3.3) - .5) * 200, a = Math.atan2(-Math.cos(k * Math.PI) * 300 * (.4 + .6 * hash(i * 2.2)) * Math.PI, 900);
    arrowAt(x, y, -a, 100, key + i);
  }
}
// "DEMONS LEFT: n" in a pill (screen space), for the battle
function counter(n, x, y, k = 1) {
  if (k <= .01) return;
  boilSeed('ctr'); push(); translate(x, y); scale(backOut(clamp(k))); paint(rrPts(-300, -52, 600, 104, 52), { wash: '#2B2233', washOp: 220, ink: null }); pop();
  letter(`DEMONS LEFT: ${n.toLocaleString('en-IN')}`, x, y + 2, 62, n > 0 ? '#FFE69A' : '#9EE08A', { screen: true, ink: false, pop: k * 4, maxW: 560 });
}
