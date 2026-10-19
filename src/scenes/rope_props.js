// rope_props.js: props of "The rope was ALWAYS two fingers short" (rope.js), Little Kanha Part 2. The courtyard and the
// follow card are Part 1's (kanha_props.js).
//   churnPot(x, y, t, o)       the big clay pot of curd with the churning rod and its rope; o.spin (radians), broken 0..1
//   chulha(x, y, t, boil)      a clay stove with the milk pan; boil 0..1 (froth rising and spilling over, steam)
//   mortar(x, y, s, o)         the wooden ulukhala, upturned (x, y = its foot); o.rot (tipped), key
//   curdSplash(x, y, t0, t)    shards and curd flying from a smashed pot
//   stick(u, sw, a)            a hand hook · beltRope(x, y, rx, ry, gap, o) a rope round a belly with a gap (radians)
//   ropePile(x, y, n, t)       n coils of rope on the ground · flowerFall(x, y, t, k, key) jasmine falling from her hair
//   arjunaTree(x, y, s, rot, t, key)  one of the twin arjuna trees (x, y = its foot), tipped by rot
//   kajalSmear(o)              a bal_krishna hat hook: kajal smeared down his cheeks
//   MONKEY                     a balHanuman() pal: a grey-brown langur-ish monkey, no gold, no thread
const RS = {
  ink: '#3A2A30', clay: '#B8603A', clayDk: '#8A4024', clayLt: '#D88A5A', curd: '#FFF8EC', curdDk: '#E6DCC6',
  wood: '#9A6A3A', woodDk: '#6A4426', woodLt: '#C8945E', rope: '#E8D2A0', ropeDk: '#9A7240', ropeLt: '#FFF0C8',
  milk: '#FFFFFF', steam: '#FFFDF6', fire: '#FFB43A', fireDk: '#F26A2A', stone: '#9A9088', stoneDk: '#6E6660',
  bark: '#8A6A4E', barkDk: '#5E4430', leaf: '#5E9A4E', leafDk: '#3E7A3A', leafLt: '#8CC26A', jasmine: '#FFFDF4', kajal: '#2A2440',
  butter: '#FFE68A', butterDk: '#E8C24E', glow: '#FFE6A0',
};
const MONKEY = { fur: '#A8805A', furDk: '#7A5A3C', furLt: '#C8A47E', face: '#F0C8A8', faceDk: '#D6A07E', faceLt: '#FFE0C8',
  langot: '#A8805A', langotDk: '#7A5A3C', gold: '#7A5A3C', goldDk: '#5E4430', thread: '#A8805A', tilak: '#F0C8A8', tilakLt: '#F0C8A8', kajal: '#F0C8A8', cheek: '#F2A08A', sole: '#E0A888', white: '#FFF8EC' };

// ---------- the churning pot ----------
// o: spin (the rod's turn, radians), broken 0..1 (the front of the pot gone, curd spilled), rod (default true)
function churnPot(x, y, t, o = {}) {
  const br = clamp(o.broken || 0), r = 120;
  boilSeed('churn');
  if (br < .5) {
    if (o.rod !== false) {
      // the rod (mathani) standing in the pot, its rope wound round it near the top
      paint(rrPts(x - 11, y - r * 3.6, 22, r * 2.6, 8), { wash: RS.wood, fill: RS.woodDk, fillOp: 50, tex: .4, ink: RS.ink, sw: 1.1 });
      paint(ellPts(x, y - r * 3.65, 22, 14, 10), { wash: RS.woodDk, ink: RS.ink, sw: .9 });
      const sp = o.spin || 0;
      for (let k = 0; k < 4; k++) { const yy = y - r * 3.0 + k * 16, ph = Math.sin(sp + k) * 10; inkLine([[x - 16, yy + ph * .2], [x + 16, yy - ph * .2]], 3.2, RS.rope, 'ink', 0); }
    }
    paint(ellPts(x, y - r * .95, r * 1.05, r * .95, 22, 3), { wash: RS.clay, fill: RS.clayDk, fillOp: 70, tex: .5, ink: RS.ink, sw: 1.4 });
    paint(ellPts(x - r * .35, y - r * 1.25, r * .3, r * .22, 12), { wash: RS.clayLt, washOp: 150, ink: null });
    paint(ellPts(x, y - r * 1.85, r * .62, r * .2, 16), { wash: RS.clayDk, ink: RS.ink, sw: 1.1 });
    paint(ellPts(x, y - r * 1.85, r * .5, r * .13, 14), { wash: RS.curd, ink: null });
    for (let k = 0; k < 3; k++) inkLine([[x - r * .9, y - r * (.6 + k * .25)], [x + r * .9, y - r * (.6 + k * .25)]], 1.4, RS.clayLt, 'inkfine', .5);
  } else {
    // the broken pot: the back half standing, shards around, a lake of curd
    paint(ellPts(x, y - 8, r * 1.9, r * .38, 22, 6), { wash: RS.curd, fill: RS.curdDk, fillOp: 50, tex: .4, ink: RS.ink, sw: .9 });
    paint([[x - r, y - r * .9], [x - r * .8, y - r * 1.6], [x - r * .3, y - r * 1.25], [x + r * .1, y - r * 1.7], [x + r * .5, y - r * 1.2], [x + r, y - r * .8], [x + r * .8, y - r * .1], [x - r * .8, y - r * .1]], { wash: RS.clayDk, ink: RS.ink, sw: 1.2 });
    for (const [dx, dy, a] of [[-r * 1.5, -10, .4], [r * 1.4, -4, -.6], [-r * .6, 16, 1.2], [r * .7, 18, -.2], [r * 1.9, 8, .9]]) {
      push(); translate(x + dx, y + dy); rotate(a); paint([[-28, 0], [-10, -26], [24, -14], [20, 8]], { wash: RS.clay, ink: RS.ink, sw: .9 }); pop();
    }
  }
}

// ---------- the clay stove with the milk pan ----------
function chulha(x, y, t, boil = 0) {
  boilSeed('chulha');
  paint([[x - 110, y], [x - 96, y - 130], [x + 96, y - 130], [x + 110, y]], { wash: RS.clay, fill: RS.clayDk, fillOp: 60, tex: .5, ink: RS.ink, sw: 1.2 });
  paint(rrPts(x - 46, y - 92, 92, 80, 40), { wash: '#3A2224', ink: RS.ink, sw: 1 });
  for (let i = 0; i < 4; i++) { const h = 40 + 14 * Math.sin(t * 9 + i * 2); paint([[x - 34 + i * 20, y - 14], [x - 26 + i * 20 + Math.sin(t * 7 + i) * 4, y - 14 - h], [x - 18 + i * 20, y - 14]], { wash: i % 2 ? RS.fireDk : RS.fire, ink: null, curv: .5 }); }
  glow(x, y - 50, 120, '#FFB43A', .4);
  // the pan
  paint([[x - 100, y - 130], [x + 100, y - 130], [x + 84, y - 210], [x - 84, y - 210]], { wash: '#C8C2BC', fill: '#8E8880', fillOp: 50, tex: .4, ink: RS.ink, sw: 1.1 });
  paint(ellPts(x, y - 212, 92, 18, 16), { wash: RS.milk, ink: RS.ink, sw: .9 });
  const b = clamp(boil);
  if (b > 0) {
    boilSeed('froth');
    const h = b * 70;
    for (let i = 0; i < 8; i++) { const bx = x - 84 + i * 24, bh = h * (.7 + .3 * Math.sin(t * 8 + i)); paint(ellPts(bx, y - 212 - bh * .5, 22, 14 + bh * .5, 10), { wash: RS.milk, ink: RS.ink, sw: .7 }); }
    if (b > .5) for (const s of [-1, 1]) paint(ribbon([[x + s * 92, y - 214], [x + s * 112, y - 170], [x + s * 106, y - 120 + 30 * (b - .5)]], 22, 12), { wash: RS.milk, ink: RS.ink, sw: .7 });
    for (let i = 0; i < 4; i++) { const q = frac(t * .9 + i * .25); paint(ellPts(x - 50 + i * 34 + Math.sin(q * 6 + i) * 18, y - 260 - h - q * 220, 26 * (1 - q * .4), 20 * (1 - q * .4), 12), { wash: RS.steam, washOp: 220 * (1 - q) * b, ink: null }); }
  }
}

// ---------- the mortar (ulukhala), upturned: a wooden drum with a waist ----------
function mortar(x, y, s = 1, o = {}) {
  boilSeed(o.key || 'mortar');
  push(); translate(x, y); rotate(o.rot || 0); scale(s);
  const P = [[-78, 0], [-84, -50], [-58, -90], [-58, -110], [-84, -150], [-80, -180], [80, -180], [84, -150], [58, -110], [58, -90], [84, -50], [78, 0]];
  paint(P, { wash: RS.wood, fill: RS.woodDk, fillOp: 60, tex: .6, ink: RS.ink, sw: 1.3, curv: .3 });
  paint(ellPts(0, -180, 80, 18, 16), { wash: RS.woodLt, ink: RS.ink, sw: 1 });
  paint(rectPts(-56, -150, 20, 130), { fill: RS.woodLt, fillOp: 100, bleed: .2, tex: .4, ink: null });
  for (const yy of [-30, -160]) inkLine([[-82, yy], [82, yy]], 2.4, RS.woodDk, 'ink', .2);
  pop();
}

// shards and curd flying out from (x, y), t0 the smash
function curdSplash(x, y, t0, t) {
  const a = t - t0; if (a < 0 || a > 1.2) return;
  boilSeed('splash');
  for (let i = 0; i < 14; i++) {
    const ang = -Math.PI * (.1 + .8 * hash(i * 3.1)), v = 500 + hash(i * 1.7) * 600, px = x + Math.cos(ang) * v * a, py = y + Math.sin(ang) * v * a + 1400 * a * a;
    if (py > y + 60) continue;
    if (i % 3) paint(ellPts(px, py, 14 + hash(i) * 10, 10 + hash(i) * 8, 10), { wash: RS.curd, ink: RS.ink, sw: .6 });
    else { push(); translate(px, py); rotate(a * 9 + i); paint([[-16, 0], [-6, -15], [14, -8], [12, 5]], { wash: RS.clay, ink: RS.ink, sw: .7 }); pop(); }
  }
}

// a stick (hand hook, upright at the hand), a = its angle
function stick(u, sw, a = 0) {
  push(); rotate(a);
  paint(ribbon(U([[0, 2.2], [0, -7.5]], u), .32 * u, .24 * u), { wash: RS.bark, fill: RS.barkDk, fillOp: 50, tex: .4, ink: RS.ink, sw: sw * .5 });
  inkLine(U([[0, -4], [.9, -5.2]], u), sw * .6, RS.barkDk, 'ink', .3);
  pop();
}

// a rope round a belly: an ellipse (rx, ry) at (x, y), open by gap radians at the front (0 = closed: a knot)
// o: knot (true: a bow at the front), glow 0..1, back (true: only the back half, drawn before the body)
function beltRope(x, y, rx, ry, gap, o = {}) {
  boilSeed(o.key || 'belt');
  const half = gap / 2, n = 44, pts = [];
  // the front is at angle PI/2 (bottom of the ellipse in screen = toward us); run round from half past it to the other side
  const a0 = Math.PI / 2 + half, a1 = Math.PI / 2 + TAU - half;
  for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]); }
  const front = pts.filter((p, i) => { const a = lerp(a0, a1, i / n) % TAU; return Math.sin(a) > -.2; });
  if (o.glow) glow(x, y, rx * 1.6, RS.glow, .6 * o.glow);
  const w = o.w || 16, draw = P => { paint(ribbon(P, w, w), { wash: RS.rope, ink: RS.ink, sw: 1.3 }); for (let i = 0; i < P.length - 1; i++) { const m = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2]; inkLine([[m[0] - w * .25, m[1] - w * .4], [m[0] + w * .25, m[1] + w * .4]], 1.3, RS.ropeDk, 'inkfine', 0); } };
  if (o.back) { draw(pts.filter((p, i) => Math.sin(lerp(a0, a1, i / n)) < 0)); return; }
  // the two halves of the front, split at the gap
  const L = [], R = [];
  for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); if (Math.sin(a) >= -.05) (Math.cos(a) < 0 ? L : R).push([x + Math.cos(a) * rx, y + Math.sin(a) * ry]); }
  if (L.length > 1) draw(L); if (R.length > 1) draw(R);
  if (gap > .05) for (const e of [pts[0], pts[pts.length - 1]]) paint(ellPts(e[0], e[1], 11, 11, 10), { wash: RS.ropeLt, ink: RS.ink, sw: 1.1 });
  if (o.knot) { paint(ellPts(x - 16, y + ry + 4, 14, 9, 10, 0, .4), { wash: RS.rope, ink: RS.ink, sw: .9 }); paint(ellPts(x + 16, y + ry + 4, 14, 9, 10, 0, -.4), { wash: RS.rope, ink: RS.ink, sw: .9 }); inkLine([[x - 4, y + ry + 8], [x - 14, y + ry + 34]], 4, RS.rope, 'ink', .3); inkLine([[x + 4, y + ry + 8], [x + 14, y + ry + 34]], 4, RS.rope, 'ink', .3); }
}

// a rope along a curve (world points), w its width
function ropeLine(P, w = 12, key = 'rline') { boilSeed(key); const Q = through(P, 8); paint(ribbon(Q, w, w), { wash: RS.rope, ink: RS.ink, sw: 1.1 }); for (let i = 1; i < Q.length - 1; i += 2) inkLine([[Q[i][0] - w * .3, Q[i][1] - w * .4], [Q[i][0] + w * .3, Q[i][1] + w * .4]], .9, RS.ropeDk, 'inkfine', 0); }

// n coils of rope piled on the ground at (x, y)
function ropePile(x, y, n, t) {
  for (let i = 0; i < n; i++) {
    boilSeed('coil' + i);
    const cx = x + (hash(i * 2.3) - .5) * 120 + (i % 3 - 1) * 40, cy = y - Math.floor(i / 3) * 26 - (i % 3) * 6, rx = 70 + hash(i) * 14;
    paint(ellPts(cx, cy, rx, rx * .34, 18), { ink: RS.ink, sw: 2.6 });
    paint(ellPts(cx, cy, rx, rx * .34, 18), { ink: i % 2 ? RS.rope : RS.ropeLt, sw: 1.8 });
    paint(ellPts(cx, cy - 6, rx * .8, rx * .26, 16), { ink: RS.ropeDk, sw: 1.6 });
  }
}

// jasmine flowers falling from her hair: (x, y) the head, k 0..1 how many, key
function flowerFall(x, y, t, k, key = 'jas') {
  if (k <= 0) return;
  boilSeed(key);
  const n = Math.round(8 * k);
  for (let i = 0; i < n; i++) { const q = frac(t * .7 + hash(i * 3.3)), fx = x + (hash(i * 1.9) - .5) * 160 + Math.sin(q * 6 + i) * 30, fy = y + q * 520; push(); translate(fx, fy); rotate(q * 5 + i); for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; paint(ellPts(Math.cos(a) * 7, Math.sin(a) * 7, 6, 6, 6), { wash: RS.jasmine, ink: RS.ink, sw: .4 }); } pop(); }
}

// one of the twin arjuna trees: a tall pale trunk and a round crown; (x, y) its foot, s its scale, rot its tip
function arjunaTree(x, y, s, rot, t, key) {
  boilSeed(key);
  push(); translate(x, y); rotate(rot); scale(s);
  paint([[-34, 0], [-26, -300], [-40, -420], [-10, -400], [0, -460], [12, -400], [44, -430], [26, -300], [34, 0]], { wash: '#C8B49A', fill: RS.bark, fillOp: 60, tex: .6, ink: RS.ink, sw: 1.3, curv: .3 });
  for (let k = 0; k < 4; k++) inkLine([[-14 + k * 8, -40 - k * 50], [-6 + k * 8, -120 - k * 50]], 1.2, RS.barkDk, 'inkfine', .3);
  const sw = Math.sin(t * 1.3) * 6;
  for (const [cx, cy, r, c] of [[-80, -470, 120, RS.leafDk], [80, -480, 120, RS.leafDk], [0, -560, 150, RS.leaf], [-60, -600, 90, RS.leafLt], [70, -590, 80, RS.leaf]]) paint(ellPts(cx + sw, cy, r, r * .8, 18, 6), { wash: c, fill: RS.leafDk, fillOp: 50, tex: .5, ink: RS.ink, sw: 1 });
  pop();
}

// a bal_krishna hat hook (head space): kajal running down from both eyes, k 0..1
function kajalSmear(k) {
  return (u, sw) => {
    if (k <= 0) return;
    boilSeed('kajal');
    for (const s of [-1, 1]) {
      paint(ribbon(U([[s * 1.25, -12.1], [s * 1.35, -11.3], [s * 1.2, -10.6 - .3 * (1 - k)]], u), .32 * u * k, .14 * u * k), { wash: RS.kajal, washOp: 170, ink: null });
      paint(ellPts(s * 1.6 * u, -11.6 * u, .55 * u * k, .3 * u * k, 10), { wash: RS.kajal, washOp: 90, ink: null });
    }
  };
}
