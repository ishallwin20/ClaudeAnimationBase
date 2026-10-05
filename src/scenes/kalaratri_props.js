// kalaratri_props.js: the sets and props for "Why does the SCARIEST goddess ride a DONKEY?" (src/scenes/kalaratri.js).
// Loaded before it; everything here is a pure function of its arguments (and T for boil).
//
//   Copied from ad 6 (baraat_props.js): TK, sparkStar, vanishPuff, sparkleBurst, whipH, veil, ganaFace
//   KR                                          the palette of this reel
//   nightSky(cx, cy, o)                         the starry indigo night (o.stars 0..1, o.dark 0..1, o.moon)
//   warSky(t, k)                                the maroon war night, with drifting embers
//   raktabija(x, y, u, o)                       the demon (and every clone): a chunky maroon asura with a moustache
//   bloodDrop(x, y, r, key), zap(...), slashArc(...)
//   pedestal(x, y, w), lionV / peacockV / swanV (x, y, u, o)   the gods' rides on the stage
//   sheep / horse / wolf (x, y, u, o), bush(x, y, s), pastureSet(t)
//   bedroomSet(t, warm, o), monsterShadow(x, y, s, k)   the boy's room; the coat's shadow (k 0 monster → 1 bunny)
//   kalaCard(t, C)                              the end card: Book 7 coming soon, Books 1–3 for ₹500
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const KR = {
  ink: '#2B2233', night: '#121430', nightMid: '#1E2254', nightLt: '#2E3478', star: '#FFF5E2', moon: '#F5ECD6',
  war: '#4A1624', warLt: '#7E2A36', warDk: '#24090F', ember: '#FF8A4A', warGround: '#2E1018',
  stage: '#3E3470', stageLt: '#64579E', curtain: '#8E2A3E', curtainDk: '#5E1A2A',
  sky: '#1A2350', skyLt: '#30407A', hill: '#24345F', hillLt: '#33497E', grass: '#2F4A70', grassLt: '#43638E', bushC: '#1C2A48',
  rak: '#9A2E40', rakDk: '#6E1E2E', rakLt: '#C2566A', horn: '#F2E4C4', stache: '#2A1418', dhoti: '#2E8A78', dhotiDk: '#1E6457',
  blood: '#E8283A', bloodLt: '#FF8A94',
  lion: '#EDB04A', lionDk: '#C8862A', mane: '#C8622A', maneDk: '#9A4418', peacock: '#2E6FB8', peacockDk: '#1E4E8A', feather: '#3E9A6A',
  swan: '#FFF8EE', swanDk: '#D8D2E2', beak: '#F39A2E',
  wool: '#F4EEE2', woolDk: '#D2C8B8', sheepFace: '#3A3038', horse: '#9A5A34', horseDk: '#6E3E22', horseMane: '#3A2418',
  wolf: '#4A5272', wolfDk: '#323850', wolfLt: '#6E7898', wolfEye: '#FFE45A',
  wall: '#34304E', wallWarm: '#D49A62', floor: '#4A3A50', floorWarm: '#A86E42', bed: '#7A4A30', bedDk: '#56321E',
  sheet: '#D6D2EA', blanket: '#5A7EC0', blanketDk: '#3E5E9A', blanketLt: '#86A6DA', pillow: '#EDE8F6', coat: '#5A4A3A',
};

// ---------- copied from ad 6 ----------
function sparkStar(x, y, r, key = 'spark', col = TK.goldLt) {
  if (r < 1) return;
  boilSeed(key);
  glow(x, y, r * 2.4, col, .8);
  paint(starPts(x, y, r, .22, 4), { wash: TK.cream, ink: null });
}
function vanishPuff(x, y, s, age, key = 'puff', cols = ['#FFF3D6', '#FFE08A']) {
  if (age < 0 || age > .6) return;
  const k = age / .6; boilSeed(key);
  glow(x, y, s * 1.7 * (1 - k * .4), cols[1], .75 * (1 - k));
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .6, d = s * (.15 + .8 * easeOut(k)) * (.7 + .4 * hash(i * 3)), r = s * (.2 + .15 * hash(i * 1.7)) * (1 + .5 * k);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - k * s * .35, r, r * .9, 10, 1), { wash: cols[i % 2], washOp: 235 * (1 - k * k), ink: null });
  }
}
function sparkleBurst(x, y, s, age, key = 'burst', n = 8, cols = [TK.cream, TK.goldLt]) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), cols[1], .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: cols[i % 2], ink: null }); }
}
// Horizontal speed streaks for a whip pan: k 0..1 strength, dir ±1.
function whipH(k, dir = 1, t = 0, cols = [TK.cream, '#C9CCF2']) {
  if (k <= .02) return;
  boilSeed('whiph');
  for (let i = 0; i < 20; i++) {
    const y = 240 + hash(i * 2.7) * (H - 480), l = 500 + 900 * hash(i * 5.3), x = ((hash(i * 9.1) * 2400 - 300 + dir * t * 3800) % (W + l)) - l * .5, w = 5 + 16 * hash(i * 1.3);
    paint(ribbon([[x - l / 2, y], [x, y + 3], [x + l / 2, y]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 200 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
}
function veil(col, a) {
  if (a <= .004) return;
  flushBrush(); const c = color(col);
  push(); resetMatrix(); translate(-W / 2, -H / 2); noStroke(); fill(red(c), green(c), blue(c), 255 * clamp(a)); rect(-4, -4, W + 8, H + 8); pop();
}
// Clawd's eyes / mouth on a prop's face: eyes centred at (0, ey) scaled k; mouth at (0, my) scaled m.
function ganaFace(u, o, sw, ey, k, my, m) {
  push(); translate(0, ey * u); scale(k); translate(0, 6 * u); eyes(u, o, sw / k * .85, [-1, 1], 0); pop();
  if (o.mouth) { push(); translate(0, my * u); scale(m); translate(0, 4.3 * u); mouth(u, o.mouth, sw / m * .8); pop(); }
}

// ---------- skies ----------
// The starry night, filling the frame round world point (cx, cy): stars 0..1 (they come out one by one), dark 0..1
// (deeper), moon [x, y, r] or null.
function nightSky(cx, cy, o = {}) {
  const st = o.stars ?? 1, dk = clamp(o.dark || 0);
  boilSeed('nsky');
  paint(rectPts(cx - 1700, cy - 2400, 3400, 4800), { wash: mixCol(KR.nightMid, KR.night, dk), ink: null });
  paint(ellPts(cx, cy + 700, 1300, 700, 30, 20), { fill: mixCol(KR.nightLt, KR.nightMid, dk), fillOp: 150, bleed: .3, tex: .3, ink: null });
  if (o.moon) { const [mx, my, mr] = o.moon; glow(mx, my, mr * 3.2, '#DCE4FF', .5); boilSeed('moon'); paint(ellPts(mx, my, mr, mr, 26), { wash: KR.moon, ink: null }); paint(ellPts(mx - mr * .3, my - mr * .2, mr * .25, mr * .2, 10), { wash: '#E6DCC2', ink: null }); }
  boilSeed('stars');
  for (let i = 0; i < 70; i++) {
    const k = clamp((st - hash(i * 4.1) * .8) / .2); if (k <= 0) continue;
    const x = cx - 900 + hash(i * 1.7) * 1800, y = cy - 1300 + hash(i * 3.9) * 2000, tw = .6 + .4 * Math.sin(T * (1.5 + hash(i) * 2) + i);
    const r = (2.5 + 5 * hash(i * 2.3)) * tw * k;
    if (hash(i * 5.5) > .8) glow(x, y, r * 5, '#DCE4FF', .5 * k);
    paint(starPts(x, y, r * 1.6, .3, 4), { wash: KR.star, ink: null });
  }
}
// The maroon war night: k 0..1 how red (0 = the ink-black night it drains into), with embers drifting up.
function warSky(t, cx, cy, k = 1) {
  boilSeed('wsky');
  paint(rectPts(cx - 1700, cy - 2400, 3400, 4800), { wash: mixCol(KR.night, KR.war, k), ink: null });
  paint(ellPts(cx, cy + 600, 1300, 800, 30, 20), { fill: mixCol(KR.nightMid, KR.warLt, k), fillOp: 160, bleed: .3, tex: .4, ink: null });
  boilSeed('embers');
  for (let i = 0; i < 22; i++) {
    const x = cx - 600 + hash(i * 2.1) * 1200 + 30 * Math.sin(t + i), y = cy + 900 - frac(hash(i * 5.3) + t * (.05 + .04 * hash(i))) * 2000, r = 3 + 4 * hash(i * 7);
    glow(x, y, r * 4, KR.ember, .5 * k);
    paint(ellPts(x, y, r, r, 8), { wash: '#FFC27A', washOp: 220 * k, ink: null });
  }
}

// ---------- Raktabija ----------
// (x, y) the ground under him, u his size unit (about 11u tall, 9u wide). o: dy, sq, rot, flip, lean, run (leg phase),
// twirl 0..1 (his right hand twirls the moustache tip), arms 0..1 (both up: panic), eyes / mouth / lookX / blush /
// seed / emote + emoteK + emoteAge, key, alpha-free: pop him in with u.
function raktabija(x, y, u, o = {}) {
  if (u < 1) return;
  const key = o.key || 'rak', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .3, 2), INK = KR.ink, P = pts => U(pts, u);
  const tw = clamp(o.twirl || 0), up = clamp(o.arms || 0), br = Math.sin(T * 3 + (o.seed || 0)) * .03, ph = o.run;
  rs('shadow'); paint(ellPts(x, y + u * .1, u * 4.6, u * .7, 16), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y + (o.dy || 0) * u); rotate(o.rot || 0); scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .6), 1 - (o.sq || 0) + br);
  // legs
  rs('legs');
  for (const s of [-1, 1]) {
    const st = ph == null ? 0 : Math.sin((ph + (s > 0 ? .5 : 0)) * TAU) * .8, lift = ph == null ? 0 : Math.max(0, Math.cos((ph + (s > 0 ? .5 : 0)) * TAU)) * .5;
    paint(ribbon(P([[s * 1.6, -2.6], [s * 1.8 + st * .5, -1.2], [s * 1.7 + st, -.4 - lift]]), 1.5 * u, 1.3 * u), { wash: KR.rakDk, ink: INK, sw: sw * .8 });
    paint(ellPts((s * 1.9 + st) * u, (-.3 - lift) * u, 1 * u, .45 * u, 10), { wash: KR.rakDk, ink: INK, sw: sw * .6 });
  }
  // body: a chunky pear, the face on its top half
  rs('body');
  const lean = o.lean || 0, body = P([[-3.6, -2.2], [-4.2, -4.6], [-3.9, -7.4], [-2.8, -9.4], [0 + lean * .3, -10.1], [2.8, -9.4], [3.9, -7.4], [4.2, -4.6], [3.6, -2.2], [0, -1.7]]);
  paint(body, { wash: KR.rak, ink: null, curv: .5 });
  paint(ellPts(-1.6 * u, -7.8 * u, 1.4 * u, 1 * u, 12, 0, -.5), { wash: KR.rakLt, washOp: 180, ink: null });
  paint(body, { ink: INK, sw, curv: .5 });
  // the dhoti
  rs('dhoti');
  paint(P([[-3.85, -3.6], [3.85, -3.6], [3.65, -2.1], [1.8, -1.75], [0, -2.5], [-1.8, -1.75], [-3.65, -2.1]]), { wash: KR.dhoti, fill: KR.dhotiDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .7, curv: .2 });
  inkLine(P([[-3.85, -3.55], [0, -3.4], [3.85, -3.55]]), sw * 2, TK.gold, 'ink', .3);
  // horns and a spiky tuft
  rs('horns');
  for (const s of [-1, 1]) paint(P([[s * 1.7, -9.5], [s * 2.6, -10.6], [s * 2.5, -11.6], [s * 2.1, -10.9], [s * 1.1, -9.8]]), { wash: KR.horn, ink: INK, sw: sw * .6, curv: .3 });
  paint(P([[-.9, -9.95], [-.6, -11], [-.2, -10.4], [.2, -11.3], [.5, -10.4], [.9, -10.9], [1, -9.9]]), { wash: KR.stache, ink: INK, sw: sw * .5, curv: .1 });
  // face
  rs('face');
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.4 * u, -6.3 * u, .7 * u, .4 * u, 12), { fill: PAL.rose, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  ganaFace(u, { ...o, mouth: null }, sw, -7.6, .48, 0, 1);
  paint(ellPts(0, -6.35 * u, .8 * u, .62 * u, 12), { wash: KR.rakLt, ink: INK, sw: sw * .6 });   // a big round nose
  rs('mouth');
  if (o.mouth) { push(); translate(0, -4.7 * u); scale(.5); translate(0, 4.3 * u); mouth(u, o.mouth, sw / .5 * .8); pop(); }
  for (const s of [-1, 1]) paint(P([[s * .7, -5.1], [s * 1.05, -5.1], [s * .85, -4.5]]), { wash: KR.horn, ink: INK, sw: sw * .35 });   // two little fangs
  // the moustache: a fat handlebar under the nose, tips curling up (the right tip curls more as he twirls it)
  rs('stache');
  for (const s of [-1, 1]) {
    const c = s > 0 ? tw : 0, tip = [s * (2.9 + .3 * c), -6.9 - .9 * c - .2 * Math.sin(T * 2)];
    paint(ribbon(P([[s * .15, -5.75], [s * 1.2, -5.55], [s * 2.3, -5.75], [s * 2.9, -6.3], tip]), .75 * u, .12 * u), { wash: KR.stache, ink: INK, sw: sw * .5 });
  }
  // arms: stubby; the right one twirls, both go up in a panic
  rs('arms');
  for (const s of [-1, 1]) {
    const sh = [s * 3.5, -6.4], twk = s > 0 ? tw : 0;
    const ha = [lerp(lerp(s * 4.8, s * 4.4, up), s * 3.1, twk), lerp(lerp(-3.6, -10.4, up), -6.6, twk)];
    const el = [lerp(lerp(s * 5.1, s * 5.4, up), s * 5.2, twk), lerp(lerp(-5, -8.6, up), -6, twk)];
    paint(ribbon(P([sh, el, ha]), 1.25 * u, 1 * u), { wash: KR.rak, ink: INK, sw: sw * .7 });
    inkLine(P([[el[0] - .5, el[1] - .2], [el[0] + .5, el[1] + .2]]), sw * 1.6, TK.gold, 'ink', 0);
    paint(ellPts(ha[0] * u, ha[1] * u, .62 * u, .58 * u, 10), { wash: KR.rak, ink: INK, sw: sw * .6 });
  }
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x + (o.flip ? -1 : 1) * 4.6 * u, y - 11.5 * u, u * 1.2, o.emoteK ?? 1, o.emoteAge ?? T); }
  boilSeed(`${key} after`);
}
// A bright, kid-friendly red drop (a teardrop, point up), r its radius.
function bloodDrop(x, y, r, key = 'drop', a = 1) {
  if (r < 1 || a <= 0) return;
  boilSeed(key);
  glow(x, y, r * 3, '#FF4A5A', .5 * a);
  paint([[x, y - 2 * r], [x + .7 * r, y - .6 * r], [x + r, y + .2 * r], [x + .7 * r, y + .85 * r], [x, y + r], [x - .7 * r, y + .85 * r], [x - r, y + .2 * r], [x - .7 * r, y - .6 * r]], { wash: KR.blood, ink: KR.ink, sw: .8, curv: .5 });
  paint(ellPts(x - .35 * r, y - .1 * r, .22 * r, .35 * r, 8, 0, .3), { wash: KR.bloodLt, ink: null });
}
// A lightning bolt from (x0, y0) to (x1, y1): k 0..1 (it strikes out to the end over k), w its weight.
function zap(x0, y0, x1, y1, key, k = 1, w = 1) {
  if (k <= 0) return;
  boilSeed(key);
  const n = 8, pts = [], d = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / d, ny = (x1 - x0) / d;
  for (let i = 0; i <= n; i++) { const f = i / n * clamp(k), j = i === 0 || (i === n && k >= 1) ? 0 : (random() - .5) * d * .14; pts.push([lerp(x0, x1, f) + nx * j, lerp(y0, y1, f) + ny * j]); }
  const e = pts[pts.length - 1];
  glow(e[0], e[1], 60 * w, '#9CC8FF', .9); glow(x0, y0, 40 * w, '#9CC8FF', .6);
  inkLine(pts, 9 * w, '#7FB2FF', 'ink', 0);
  inkLine(pts, 3.5 * w, '#FFFBEA', 'ink', 0);
}
// A white crescent slash along the arc (cx, cy, r) from a0 to a1, revealed as k 0 → .5 and fading out .5 → 1.
function slashArc(cx, cy, r, a0, a1, k, key = 'slash') {
  if (k <= 0 || k >= 1) return;
  boilSeed(key);
  const head = clamp(k * 2), tail = clamp(k * 2 - .6), pts = [];
  for (let i = 0; i <= 14; i++) { const a = lerp(a0, a1, lerp(tail, head, i / 14)); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  glow(pts[14][0], pts[14][1], r * .5, '#DCE8FF', .7 * (1 - tail));
  paint(ribbon(pts, 2, r * .16 * (1 - k * .6)), { wash: '#F4F7FF', washOp: 240 * (1 - clamp((k - .5) * 2)), ink: null });
}

// ---------- the gods' rides on the stage ----------
function pedestal(x, y, w, key = 'ped') {
  boilSeed(key);
  glow(x, y - w * .9, w * 1.3, '#FFE7B0', .35);
  paint(rrPts(x - w * .5, y, w, w * .55, 6), { wash: TK.gold, fill: TK.goldDk, fillOp: 70, tex: .5, ink: KR.ink, sw: 1.1 });
  paint(ellPts(x, y, w * .5, w * .1, 20), { wash: TK.goldLt, ink: KR.ink, sw: 1.1 });
  inkLine([[x - w * .45, y + w * .42], [x + w * .45, y + w * .42]], 1.4, TK.goldDk, 'inkfine', .2);
}
// A chibi lion sitting, facing us: (x, y) the ground, u ≈ 1/9 of his height. o: jaw 0..1 (it drops), eyes, lookX, key
function lionV(x, y, u, o = {}) {
  const key = o.key || 'lion', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = KR.ink, P = pts => U(pts, u), jaw = clamp(o.jaw || 0);
  push(); translate(x, y);
  rs('tail'); paint(ribbon(P([[2.6, -1], [4.3, -2.2], [4.5, -4.2]]), .4 * u, .25 * u), { wash: KR.lion, ink: INK, sw: sw * .6 }); paint(ellPts(4.5 * u, -4.5 * u, .5 * u, .6 * u, 10), { wash: KR.mane, ink: INK, sw: sw * .5 });
  rs('body'); paint(P([[-2.8, 0], [-3.1, -2.6], [-2.2, -5], [2.2, -5], [3.1, -2.6], [2.8, 0]]), { wash: KR.lion, ink: INK, sw, curv: .4 });
  for (const s of [-1, 1]) paint(ellPts(s * 1.15 * u, -.4 * u, .9 * u, .5 * u, 10), { wash: KR.lion, ink: INK, sw: sw * .6 });
  rs('mane'); paint(starPts(0, -6.6 * u, 3.6 * u, .78, 14, T * .2), { wash: KR.mane, fill: KR.maneDk, fillOp: 70, tex: .4, ink: INK, sw: sw * .8, curv: .4 });
  rs('face'); paint(ellPts(0, -6.5 * u, 2.4 * u, 2.25 * u, 22), { wash: KR.lion, ink: INK, sw });
  for (const s of [-1, 1]) paint(ellPts(s * 1.9 * u, -8.5 * u, .55 * u, .55 * u, 10), { wash: KR.lion, ink: INK, sw: sw * .6 });
  ganaFace(u, o, sw, -9.4, .32, 0, 1);
  paint(ellPts(0, -5.6 * u, 1.1 * u, .8 * u, 12), { wash: '#F8DDA0', ink: null });
  paint(P([[-.35, -6.2], [.35, -6.2], [0, -5.8]]), { wash: '#6A3A2A', ink: null });
  if (jaw > .05) paint(ellPts(0, (-5.1 + .4 * jaw) * u, .5 * u, (.25 + .7 * jaw) * u, 12), { wash: '#5A1E2A', ink: INK, sw: sw * .6 });
  else inkLine(P([[-.6, -5.3], [0, -5.1], [.6, -5.3]]), sw * .7, INK, 'inkfine', .5);
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x + 3.4 * u, y - 10.5 * u, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T); }
}
// A peacock facing us with its fan up: droop 0..1 folds the fan down. o: eyes, lookX, key
function peacockV(x, y, u, o = {}) {
  const key = o.key || 'pea', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = KR.ink, P = pts => U(pts, u), dr = clamp(o.droop || 0);
  push(); translate(x, y);
  rs('fan');
  const spread = lerp(1.25, .25, dr), R = lerp(6.4, 4.6, dr), cy = lerp(-5.4, -2.4, dr);
  for (let i = 0; i < 13; i++) {
    const a = -Math.PI / 2 + (i / 12 - .5) * 2 * spread + Math.sin(T * 1.2 + i) * .02, fx = Math.cos(a) * R, fy = cy + Math.sin(a) * R;
    paint(ribbon(P([[0, cy], [fx * .55, cy + (fy - cy) * .55], [fx, fy]]), .4 * u, 1.3 * u), { wash: KR.feather, ink: INK, sw: sw * .4 });
    paint(ellPts(fx * u, fy * u, .55 * u, .62 * u, 10), { wash: TK.gold, ink: null });
    paint(ellPts(fx * u, fy * u, .32 * u, .38 * u, 8), { wash: KR.peacockDk, ink: null });
  }
  rs('body'); paint(P([[-1.4, 0], [-1.7, -2.4], [-1, -4.6], [-.5, -6.4], [.5, -6.4], [1, -4.6], [1.7, -2.4], [1.4, 0]]), { wash: KR.peacock, ink: INK, sw, curv: .5 });
  paint(ellPts(0, -7.1 * u, 1 * u, 1 * u, 14), { wash: KR.peacock, ink: INK, sw: sw * .8 });
  for (const k of [-.5, 0, .5]) { inkLine(P([[0, -8], [k * .7, -9.1]]), sw * .5, KR.peacockDk, 'inkfine', 0); paint(ellPts(k * .7 * u, -9.2 * u, .17 * u, .17 * u, 6), { wash: KR.peacock, ink: null }); }
  ganaFace(u, o, sw, -7.6, .18, 0, 1);
  paint(P([[-.22, -6.8], [.22, -6.8], [0, -6.3]]), { wash: TK.gold, ink: INK, sw: sw * .4 });
  pop();
}
// A swan in side view facing right, on a little pool of light. o: eyes, key
function swanV(x, y, u, o = {}) {
  const key = o.key || 'swan', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = KR.ink, P = pts => U(pts, u);
  push(); translate(x, y);
  rs('body');
  paint(P([[-3.8, -2.6], [-3.2, -.4], [0, 0], [2.6, -.4], [3.3, -1.6], [2.4, -2.6], [0, -2.9], [-2.6, -3.4]]), { wash: KR.swan, fill: KR.swanDk, fillOp: 60, tex: .4, ink: INK, sw, curv: .5 });
  inkLine(P([[-2.6, -2.2], [-.6, -1.4], [1.4, -1.8]]), sw * .6, KR.swanDk, 'inkfine', .5);
  const nk = Math.sin(T * 1.4) * .15;
  paint(ribbon(P([[2, -2.2], [3.2, -3.6], [2.4, -5.4], [2.6 + nk, -6.8]]), .9 * u, .6 * u), { wash: KR.swan, ink: INK, sw: sw * .8 });
  paint(ellPts((2.9 + nk) * u, -7.1 * u, .75 * u, .62 * u, 12), { wash: KR.swan, ink: INK, sw: sw * .7 });
  paint(P([[3.5 + nk, -7.3], [4.6 + nk, -6.9], [3.5 + nk, -6.75]]), { wash: KR.beak, ink: INK, sw: sw * .5 });
  paint(ellPts((3.05 + nk) * u, -7.25 * u, .14 * u, .16 * u, 6), { wash: KR.ink, ink: null });
  pop();
}

// ---------- the pasture ----------
function sheep(x, y, u, o = {}) {
  const key = o.key || 'sheep', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = KR.ink, P = pts => U(pts, u);
  const ph = o.walk, hop = o.hop || 0;
  rs('shadow'); paint(ellPts(x, y + u * .1, u * 3.4, u * .5, 14), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y - hop * u); scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .5), 1 - (o.sq || 0));
  rs('legs');
  for (const [lx, p] of [[-1.6, 0], [1.4, .5], [-1, .5], [2, 0]]) { const st = ph == null ? 0 : Math.sin((ph + p) * TAU) * .4; inkLine(P([[lx, -1.6], [lx + st, 0]]), sw * 2.6, KR.sheepFace, 'ink', 0); }
  rs('wool');
  const puffs = [[-2, -2.5, 1.4], [-.6, -3.2, 1.5], [.9, -3, 1.5], [2.1, -2.4, 1.3], [-.4, -1.9, 1.5], [1.2, -1.9, 1.3], [-1.9, -1.8, 1.1]];
  for (const [px, py, r] of puffs) paint(ellPts(px * u, py * u, r * u, r * .9 * u, 14, u * .05), { wash: KR.wool, ink: INK, sw: sw * .6 });
  for (const [px, py, r] of puffs) paint(ellPts(px * u, py * u, r * .85 * u, r * .75 * u, 14), { wash: KR.wool, ink: null });
  rs('head');
  const hy = -3.2 + Math.sin(T * 2 + (o.seed || 0)) * .08;
  paint(ellPts(3.1 * u, hy * u, 1 * u, 1.25 * u, 14, 0, .3), { wash: KR.sheepFace, ink: INK, sw: sw * .7 });
  paint(ellPts(2.3 * u, (hy - .9) * u, .8 * u, .35 * u, 10, 0, -.4), { wash: KR.sheepFace, ink: INK, sw: sw * .5 });
  paint(ellPts(3 * u, (hy - 1.1) * u, .7 * u, .55 * u, 10), { wash: KR.wool, ink: null });
  push(); translate(3.2 * u, (hy - .1) * u); scale(.17); translate(0, 6 * u); eyes(u, { eyes: o.eyes || 'normal', lookX: o.lookX ?? .4, lookY: o.lookY || 0, seed: o.seed }, sw / .17 * .7, [-1, 1], 0); pop();
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x + (o.flip ? -1 : 1) * 3 * u, y - 6 * u, u * 1, o.emoteK ?? 1, o.emoteAge ?? T); }
}
// A horse in side view facing right: rear 0..1 (up on its hind legs), gallop (leg phase), eyes, key
function horse(x, y, u, o = {}) {
  const key = o.key || 'horse', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = KR.ink, P = pts => U(pts, u);
  const rr = clamp(o.rear || 0), ph = o.gallop;
  rs('shadow'); paint(ellPts(x, y + u * .1, u * 5.5, u * .7, 16), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y); scale((o.flip ? -1 : 1), 1); translate(-3.6 * u, -4.6 * u); rotate(-rr * .55); translate(3.6 * u, 4.6 * u);
  const leg = (lx, p, c, front) => {
    let fx = lx, fy = 0; if (ph != null) { const a = (ph + p) * TAU; fx += Math.sin(a) * 1.6; fy = -Math.max(0, Math.cos(a)) * 1.2; }
    if (front && rr > 0) { fx = lerp(fx, lx + 1.6, rr); fy = lerp(fy, -3.4, rr); }
    paint(ribbon(P([[lx, -4.6], [(lx + fx) / 2 + (front ? .3 : -.3), -2.4 + fy * .5], [fx, fy - .4]]), 1.1 * u, .7 * u), { wash: c, ink: INK, sw: sw * .7 });
    paint(ellPts(fx * u, (fy - .2) * u, .45 * u, .3 * u, 8), { wash: KR.horseMane, ink: null });
  };
  rs('far'); leg(-3, 0, KR.horseDk, false); leg(3.6, .5, KR.horseDk, true);
  rs('tail'); paint(ribbon(P([[-4.6, -7], [-6.4, -6], [-6.8 - (ph != null ? 1 : 0), -3.6]]), .9 * u, .3 * u), { wash: KR.horseMane, ink: INK, sw: sw * .6 });
  rs('body');
  paint(P([[-4.8, -7.2], [-5, -5], [-3.6, -4.2], [0, -4.2], [3.6, -4.4], [4.6, -5.6], [5, -7.6], [5.8, -9.8], [6.4, -11], [5, -11.4], [4, -9.4], [3, -7.8], [0, -7.6], [-3.4, -7.8]]), { wash: KR.horse, ink: INK, sw, curv: .5 });
  paint(P([[5.4, -11.6], [6.8, -11.2], [8.3, -9.4], [8.4, -8.6], [7.6, -8.4], [6.6, -9.4], [5.2, -10.2]]), { wash: KR.horse, ink: INK, sw, curv: .5 });
  paint(ellPts(5.8 * u, -11.9 * u, .3 * u, .6 * u, 8, 0, .3), { wash: KR.horse, ink: INK, sw: sw * .5 });
  paint(ribbon(P([[5.3, -11.6], [4.6, -10.4], [3.6, -8.8], [2.6, -7.8]]), .9 * u, .5 * u), { wash: KR.horseMane, ink: INK, sw: sw * .5 });
  push(); translate(6.6 * u, -10.3 * u); scale(.18); translate(0, 6 * u); eyes(u, { eyes: o.eyes || 'wide', lookX: o.lookX ?? 0, seed: o.seed }, sw / .18 * .7, [1], 0); pop();
  rs('near'); leg(-3.6, .5, KR.horse, false); leg(3, 0, KR.horse, true);
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x + (o.flip ? -1 : 1) * 6 * u, y - 13 * u, u * 1.2, o.emoteK ?? 1, o.emoteAge ?? T); }
}
// A wolf in side view facing left (toward the sheep): creep 0..1 (low, stalking), tumble (radians, spinning off),
// eyes glow in the dark: dark 0..1 (only the eyes show: hidden in the bush)
function wolf(x, y, u, o = {}) {
  const key = o.key || 'wolf', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = KR.ink, P = pts => U(pts, u);
  const cr = clamp(o.creep || 0), ph = o.walk;
  push(); translate(x, y); rotate(o.tumble || 0); scale(-1, 1 - cr * .12);
  const leg = (lx, p, c) => { const st = ph == null ? 0 : Math.sin((ph + p) * TAU) * .7; paint(ribbon(P([[lx, -3.2], [lx + st * .5 + .3, -1.6], [lx + st, -.2]]), .8 * u, .55 * u), { wash: c, ink: INK, sw: sw * .6 }); };
  rs('far'); leg(-2.6, 0, KR.wolfDk); leg(2.6, .5, KR.wolfDk);
  rs('tail'); paint(ribbon(P([[-3.8, -4.4], [-5.4, -4.8], [-6.6, -3.6]]), .9 * u, .4 * u), { wash: KR.wolf, ink: INK, sw: sw * .7 });
  rs('body'); paint(P([[-4, -4.8], [-4.2, -3], [-2, -2.6], [2, -2.8], [3.6, -3.2], [4.2, -4.6], [3.4, -5.6], [0, -5.4], [-2.8, -5.5]]), { wash: KR.wolf, ink: INK, sw, curv: .5 });
  rs('head'); const hy = -5.2 + cr * .9;
  paint(P([[3, hy - .2], [3.4, hy - 1.6], [4.2, hy - 1.9], [4.8, hy - 1.4], [6.6, hy - .6], [6.6, hy + .1], [4.8, hy + .5], [3.6, hy + .7]]), { wash: KR.wolf, ink: INK, sw, curv: .3 });
  for (const ex of [3.6, 4.4]) paint(P([[ex - .35, hy - 1.6], [ex, hy - 2.9], [ex + .35, hy - 1.5]]), { wash: KR.wolfDk, ink: INK, sw: sw * .5 });
  paint(ellPts(6.55 * u, (hy - .25) * u, .3 * u, .25 * u, 8), { wash: KR.ink, ink: null });
  if (o.tooth !== false) paint(P([[5.8, hy + .15], [6.05, hy + .15], [5.92, hy + .55]]), { wash: KR.horn, ink: null });
  rs('near'); leg(-1.8, .5, KR.wolf); leg(3.2, 0, KR.wolf);
  rs('eye');
  const ex = 4.7 * u, ey = (hy - .8) * u;
  if (o.eyes === 'x') { inkLine([[ex - .3 * u, ey - .3 * u], [ex + .3 * u, ey + .3 * u]], sw * 1.2, INK, 'ink', 0); inkLine([[ex - .3 * u, ey + .3 * u], [ex + .3 * u, ey - .3 * u]], sw * 1.2, INK, 'ink', 0); }
  else { glow(ex, ey, u * 1.4, KR.wolfEye, .8); paint(P([[4.3, hy - .9], [5.1, hy - 1], [4.8, hy - .55]]), { wash: KR.wolfEye, ink: null }); }
  pop();
}
// Just the wolf's glowing eyes in the dark (in the bush): k 0..1
function wolfEyes(x, y, s, k, key = 'weyes') {
  if (k <= .02) return;
  boilSeed(key);
  const bl = ((T * .7) % 2.4) < .1 ? .15 : 1;
  for (const d of [-1, 1]) { glow(x + d * s, y, s * 1.6, KR.wolfEye, .9 * k); paint([[x + d * s - s * .5, y], [x + d * s + s * .5, y - s * .2 * bl], [x + d * s + s * .3, y + s * .35 * bl]], { wash: KR.wolfEye, washOp: 255 * k, ink: null }); }
}
function bush(x, y, s, key = 'bush', col = KR.bushC) {
  boilSeed(key);
  for (const [dx, dy, r] of [[-.6, -.4, .55], [0, -.7, .65], [.6, -.4, .55], [-.3, -.15, .5], [.35, -.15, .5]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * .85 * s, 14, s * .02), { wash: col, ink: KR.ink, sw: 1 });
}
// The moonlit pasture round world point (cx, cy): sky, moon, two hill lines, the meadow at ground y gy.
function pastureSet(t, cx, cy, gy = 1500) {
  boilSeed('psky');
  paint(rectPts(cx - 1700, cy - 2400, 3400, 4800), { wash: KR.sky, ink: null });
  paint(ellPts(cx, gy - 200, 1400, 600, 30, 20), { fill: KR.skyLt, fillOp: 150, bleed: .3, tex: .3, ink: null });
  const mx = cx + 300, my = gy - 900; glow(mx, my, 260, '#DCE4FF', .55); boilSeed('pmoon'); paint(ellPts(mx, my, 80, 80, 24), { wash: KR.moon, ink: null });
  boilSeed('pstars');
  for (let i = 0; i < 26; i++) { const x = cx - 700 + hash(i * 1.7) * 1400, y = gy - 1300 + hash(i * 3.9) * 650, r = (3 + 4 * hash(i * 2.3)) * (.6 + .4 * Math.sin(T * 2 + i)); paint(starPts(x, y, r * 1.5, .3, 4), { wash: KR.star, ink: null }); }
  boilSeed('phills');
  const hill = (y0, amp, ph, col) => { const p = [[cx - 1400, gy + 600]]; for (let i = 0; i <= 28; i++) { const x = cx - 1400 + i * 100; p.push([x, y0 - amp * (.5 + .5 * Math.sin(x * .004 + ph))]); } p.push([cx + 1400, gy + 600]); paint(p, { wash: col, ink: null, curv: .5 }); };
  hill(gy - 230, 120, 1, KR.hill); hill(gy - 90, 70, 3, KR.hillLt);
  boilSeed('pmeadow');
  paint(rectPts(cx - 1400, gy - 40, 2800, 900), { wash: KR.grass, ink: null });
  inkLine([[cx - 1300, gy - 38], [cx, gy - 44], [cx + 1300, gy - 36]], 1.2, KR.ink, 'inkfine', .3);
  for (let i = 0; i < 30; i++) { const x = cx - 700 + hash(i * 5.1) * 1400, y = gy + hash(i * 2.9) * 380, s = 8 + 8 * hash(i); inkLine([[x - s, y], [x - s * .3, y - s * 1.2 - 3 * Math.sin(t * 2 + i)], [x, y]], 1.4, KR.grassLt, 'inkfine', .3); }
}

// ---------- the boy's room ----------
// warm 0..1: the night-light's warmth fills the room. o.window = [x, y, w, h] (the window's opening).
function bedroomSet(t, warm, o = {}) {
  const [wx, wy, ww, wh] = o.window || [640, 700, 330, 560];
  boilSeed('wall');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: mixCol(KR.wall, KR.wallWarm, warm * .75), ink: null });
  for (let i = 0; i < 7; i++) inkLine([[i * 170 + 40, 300], [i * 170 + 40, 1520]], .8, mixCol(KR.wall, KR.ink, .25), 'inkfine', .1);   // the wallpaper stripes
  boilSeed('floor');
  paint(rectPts(-200, 1520, W + 400, 600), { wash: mixCol(KR.floor, KR.floorWarm, warm * .8), ink: null });
  for (let i = 0; i < 6; i++) inkLine([[-100, 1560 + i * 70], [W + 100, 1556 + i * 70]], .8, KR.ink, 'inkfine', .1);
  boilSeed('wsky');
  paint(rectPts(wx, wy, ww, wh), { wash: KR.nightMid, ink: null });
  glow(wx + ww * .7, wy + wh * .22, 160, '#DCE4FF', .45); paint(ellPts(wx + ww * .72, wy + wh * .2, 42, 42, 20), { wash: KR.moon, ink: null });
  for (let i = 0; i < 8; i++) paint(starPts(wx + 20 + hash(i * 3.1) * (ww - 40), wy + 20 + hash(i * 1.3) * wh * .5, 5 * (.6 + .4 * Math.sin(T * 2 + i)), .3, 4), { wash: KR.star, ink: null });
}
// the window frame, the sill and the wall below it: drawn over whatever leans in through the window
function windowFront(warm, o = {}) {
  const [wx, wy, ww, wh] = o.window || [640, 700, 330, 560];
  boilSeed('wfront');
  paint(rectPts(wx - 40, wy + wh, ww + 80, 1520 - wy - wh), { wash: mixCol(KR.wall, KR.wallWarm, warm * .75), ink: null });
  paint(rectPts(wx - 30, wy - 26, ww + 60, 26), { wash: KR.bed, ink: KR.ink, sw: 1.2 });
  paint(rectPts(wx - 50, wy + wh, ww + 100, 30), { wash: KR.bed, ink: KR.ink, sw: 1.2 });
  for (const xx of [wx - 26, wx + ww]) paint(rectPts(xx, wy - 10, 26, wh + 10), { wash: KR.bed, ink: KR.ink, sw: 1.2 });
}
// the bed, the pillow and the blanket's lower half (the boy sits in it)
function bed(x, y, w, warm, key = 'bed') {
  boilSeed(key);
  paint(rrPts(x - w * .5, y - 420, 70, 520, 14), { wash: KR.bed, fill: KR.bedDk, fillOp: 70, tex: .5, ink: KR.ink, sw: 1.4 });   // the headboard
  paint(rrPts(x - w * .5, y - 40, w, 150, 12), { wash: KR.bed, ink: KR.ink, sw: 1.4 });
  paint(rrPts(x - w * .5 + 40, y - 330, 260, 130, 50), { wash: mixCol(KR.pillow, '#FFE8C8', warm * .5), ink: KR.ink, sw: 1.2 });
}
function blanket(x, y, w, warm, key = 'blanket') {
  boilSeed(key);
  const c = mixCol(KR.blanket, '#C88A6A', warm * .35);
  paint([[x - w * .5, y - 140], [x - w * .2, y - 175], [x + w * .2, y - 160], [x + w * .5, y - 120], [x + w * .52, y + 20], [x - w * .52, y + 30]], { wash: c, fill: KR.blanketDk, fillOp: 70, tex: .5, ink: KR.ink, sw: 1.4, curv: .4 });
  for (let i = 0; i < 4; i++) { const xx = x - w * .35 + i * w * .23; paint(starPts(xx, y - 60 + 20 * Math.sin(i), 14, .45, 5), { wash: KR.blanketLt, ink: null }); }
}
// the coat on its hook (x, y the hook) and its shadow on the wall at (sx, sy): k 0 a clawed monster → 1 a bunny
function coatAndShadow(x, y, sx, sy, s, k, warm, key = 'coat') {
  const N = 26, mons = [], bun = [];
  for (let i = 0; i < N; i++) {
    const a = i / N * TAU;
    // the monster: a big head with two horns and two clawed arms out; the bunny: a round head with two tall ears
    const horn = Math.max(0, Math.cos((a - 4.2) * 5)) * (Math.abs(a - 4.2) < .35 ? .9 : 0) + Math.max(0, Math.cos((a - 5.2) * 5)) * (Math.abs(a - 5.2) < .35 ? .9 : 0);
    const arm = (Math.abs(a - .3) < .45 || Math.abs(a - 2.85) < .45) ? .7 + .25 * Math.sin(a * 22) : 0;
    const rm = 1 + horn + arm * (1 - Math.abs(Math.sin(a)) * .4);
    mons.push([sx + Math.cos(a) * s * rm, sy + Math.sin(a) * s * .95 * rm]);
    const ear = (Math.abs(a - 4.35) < .22 || Math.abs(a - 5.05) < .22) ? 1.5 : 0;
    const rb = .8 + ear;
    bun.push([sx + Math.cos(a) * s * rb * .85, sy + s * .2 + Math.sin(a) * s * .8 * rb]);
  }
  boilSeed(key + 'shadow');
  paint(mons.map((p, i) => [lerp(p[0], bun[i][0], k), lerp(p[1], bun[i][1], k)]), { wash: mixCol('#1E1A34', '#7A5440', warm * .7), washOp: 200, ink: null, curv: .5 });
  if (k < .5) for (const d of [-1, 1]) paint(ellPts(sx + d * s * .35, sy - s * .15, s * .12 * (1 - 2 * k), s * .18 * (1 - 2 * k), 8), { wash: '#FFE45A', washOp: 220 * (1 - 2 * k) * (1 - warm), ink: null });   // its eyes (the coat's buttons)
  boilSeed(key);
  paint(ellPts(x, y, 9, 9, 8), { wash: TK.goldDk, ink: KR.ink, sw: 1 });
  paint([[x - 50, y + 10], [x + 50, y + 10], [x + 90, y + 260], [x - 90, y + 260]], { wash: KR.coat, ink: KR.ink, sw: 1.3, curv: .2 });
  paint(ellPts(x, y + 4, 34, 26, 12), { wash: KR.coat, ink: KR.ink, sw: 1.1 });
}

// ---------- the card ----------
// Book 7 big with a COMING SOON ribbon, Books 1–3 in a row under it (out now, ₹500), the logo, the pill, follow.
function kalaCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 508, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.cover) {
    picture(PICS.book7, X, 838, 370, 370, { rot: -.03 + br, pop: pk(C.cover), r: 10, shadow: 26 });
    if (t > C.cover + .25) {   // the COMING SOON ribbon across the top-right corner
      const k = backOut(clamp((t - C.cover - .25) * 4)), rx = X + 112, ry = 728;
      flushLetters(); boilSeed('ribbon');
      push(); translate(rx, ry); rotate(.62); scale(k);
      paint(rectPts(-160, -27, 320, 54), { wash: TK.rkOrange, ink: null });
      pop();
      letter('COMING SOON', rx, ry + 2, 30, TK.cream, { screen: true, font: '700 30px Poppins', ink: false, rot: .62, pop: pk(C.cover + .25) });
    }
    letter('Book 7 · The Fierce Dark Knight', X, 1058, 36, TK.brown, { screen: true, font: '500 36px Poppins', ink: false, maxW: 860, pop: pk(C.cover + .15) });
  }
  if (t > C.row) [['book1', -1], ['book2', 0], ['book3', 1]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.row - j * .1);
    if (a > 0) picture(PICS[b], X + i * 172, 1190, 140, 140, { rot: i * .06 - br, pop: a * 5, r: 6, shadow: 14 });
  });
  if (t > C.price) letter('OUT NOW: Books 1–3 · Set of 3 for ₹500', X, 1292, 36, TK.brown, { screen: true, font: '700 36px Poppins', ink: false, maxW: 880, pop: pk(C.price) });
  if (t > C.logo) picture(PICS.logo, X, 548, 150, 150, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1384); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1386, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter("Follow @therishikatha so you don't miss Book 7", X, 1466, 34, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
