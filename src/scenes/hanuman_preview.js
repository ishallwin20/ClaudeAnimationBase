// Issue 2, the free preview (pp. 1–8): the art for comics/hanuman/comic.js. Panel units: (0, 0) the panel's top-left,
// P.w × P.h. Bal Hanuman (cine_balhanuman.js): head centre (0, 0), radius ~100, soles ~330.

// ---------- shared bits ----------
function vgrad(c, P, stops, y0 = 0, y1 = P.h) { const g = c.createLinearGradient(0, y0, 0, y1); stops.forEach(([k, col]) => g.addColorStop(k, col)); c.fillStyle = g; c.fillRect(0, 0, P.w, P.h); }
// the rising sun, red as a hibiscus (japāpuṣpa, 7.35.23)
function redSun(c, x, y, r, o = {}) {
  const a = o.a ?? 1;
  glow(c, x, y, r * 4.2, '#FF5A2A', .32 * a); glow(c, x, y, r * 2.2, '#FF7A3A', .55 * a); glow(c, x, y, r * 1.35, '#FFB070', .7 * a);
  const g = c.createRadialGradient(x - r * .25, y - r * .25, r * .1, x, y, r);
  g.addColorStop(0, '#FF8A5A'); g.addColorStop(.55, '#F23A2A'); g.addColorStop(1, '#C8141E');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}
// a ridge of hills, a flat colour, from x 0 to w at about y, its top wobbling by amp
function ridge(c, w, h, y, amp, col, seed = 1, n = 9) {
  const R = lcg(seed); let d = `M -20 ${h + 20} L -20 ${y}`;
  for (let i = 0; i <= n; i++) { const x = -20 + (w + 40) * i / n, yy = y - R() * amp; const cx = x - (w + 40) / n / 2; d += ` Q ${cx} ${yy - amp * .5} ${x} ${yy}`; }
  fillPath(c, d + ` L ${w + 20} ${h + 20} Z`, col);
}
// a soft cloud bank: overlapping puffs filled as ONE shape (no seams for the ink pass to find), a flat base
function puffs(c, x, y, w, col, seed = 3, n = 7) {
  const R = lcg(seed), Q = new Path2D();
  for (let i = 0; i < n; i++) { const k = i / (n - 1), rx = w * (.12 + R() * .1), cx = x - w / 2 + w * k, cy = y - Math.sin(k * Math.PI) * w * .08 - R() * w * .04; Q.moveTo(cx + rx, cy); Q.ellipse(cx, cy, rx, rx * .62, 0, 0, TAU); }
  Q.moveTo(x - w / 2, y); Q.rect(x - w / 2, y - w * .02, w, w * .08);
  c.fillStyle = col; c.fill(Q);
}
// a tree: a tapering trunk and a scalloped canopy, one colour (mist does the depth)
function tree(c, x, base, h, col, seed = 1, k = 1) {
  const tw = 14 * k;
  fillPath(c, `M ${x - tw} ${base} C ${x - tw * .7} ${base - h * .4} ${x - tw * .4} ${base - h * .6} ${x - tw * .3} ${base - h * .7} L ${x + tw * .3} ${base - h * .7} C ${x + tw * .4} ${base - h * .6} ${x + tw * .7} ${base - h * .4} ${x + tw} ${base} Z`, col);
  const r = h * .3; c.fillStyle = col; c.fill(bhFluff(x, base - h * .78, r, r * .85, 9, .14, seed));
  c.fill(bhFluff(x - r * .55, base - h * .62, r * .6, r * .5, 7, .16, seed + 1)); c.fill(bhFluff(x + r * .6, base - h * .64, r * .62, r * .5, 7, .16, seed + 2));
}
// lightning: a jagged white-violet bolt along pts, glowing
function bolt(c, pts, w = 14, seed = 5) {
  const R = lcg(seed), path = [];
  for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; for (let k = 0; k < 6; k++) { const f = k / 6; path.push([a[0] + (b[0] - a[0]) * f + (R() - .5) * w * 4, a[1] + (b[1] - a[1]) * f + (R() - .5) * w * 4]); } }
  path.push(pts[pts.length - 1]);
  const d = 'M ' + path.map(p => p.join(' ')).join(' L ');
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [lw, col] of [[w * 5, 'rgba(150,110,255,.18)'], [w * 2.6, 'rgba(190,160,255,.5)'], [w * 1.2, '#E6DEFF'], [w * .5, '#FFFFFF']]) strokePath(c, d, col, lw);
  c.restore();
  return path;
}
function leaf(c, x, y, s, a, col) { c.save(); c.translate(x, y); c.rotate(a); fillPath(c, `M ${-s} 0 C ${-s * .4} ${-s * .55} ${s * .4} ${-s * .55} ${s} 0 C ${s * .4} ${s * .55} ${-s * .4} ${s * .55} ${-s} 0 Z`, col); c.restore(); }
// speed lines round a point, between angles a0 and a1
function speedLines(c, x, y, n, r0, r1, col, w = 3, seed = 9, a0 = 0, a1 = TAU) {
  const R = lcg(seed); c.save(); c.lineCap = 'round';
  for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * R(), q0 = r0 * (1 + R() * .4), q1 = r1 * (.7 + R() * .3); strokePath(c, `M ${x + Math.cos(a) * q0} ${y + Math.sin(a) * q0} L ${x + Math.cos(a) * q1} ${y + Math.sin(a) * q1}`, col, w * (.5 + R())); }
  c.restore();
}
// the baby, lit: o goes to balHanuman; at (x, y), scale k, rotated r
function baby(c, x, y, k, r, o, light = lit(DAY())) { c.save(); c.translate(x, y); c.rotate(r || 0); c.scale(k, k); figure(c, (c) => balHanuman(c, o), light); c.restore(); }
function babyFace(c, x, y, k, o, light = lit(DAY())) { c.save(); c.translate(x, y); c.scale(k, k); figure(c, (c) => balHead(c, o), light); c.restore(); }
// a head on the Surya rig (mbhHead) as a close-up: its face at (x, y), scale k
function bust(c, x, y, k, o, light = WARM(), fn = devaBust) { c.save(); c.translate(x, y); c.scale(k, k); figure(c, (c) => fn(c, { t: 0, ...o }), light); c.restore(); }
function dhead(c, x, y, k, o, light = WARM()) { c.save(); c.translate(x, y); c.scale(k, k); figure(c, (c) => devaHead(c, o), light); c.restore(); }
function rahuAt(c, x, y, k, o, light = lit(DAY())) { c.save(); c.translate(x, y); c.scale(k * (o.flip ? -1 : 1), k); figure(c, (c) => rahuHead(c, o), light); c.restore(); }
function godHead(c, x, y, k, o, light) { c.save(); c.translate(x, y); c.scale(k, k); c.translate(0, 815); figure(c, (c) => mbhHead(c, o), light); c.restore(); }
// the gods' palettes over SUR (cine_mbh.js)
// a warm interior light (the court, lamps): KLIGHT with a gold rim and a faint warm cast
const WARM = (dx = 5, dy = -4) => ({ ...lit(KLIGHT(dx, dy, { rim: '#FFD89A' })), tint: ['#FF9A40', .1] });
const GOD = {
  vayu: { skin: '#86C3E6', skinSh: '#5C9DC8', skinDk: '#30608A', palm: '#B8DCF2', lip: '#3A4E7A', lipLo: '#4E6694', hair: '#1E2A44', hairLt: '#3A4A6A', iris: '#1A2234', brow: '#1A2236',
    cloth: '#F2F6FA', clothSh: '#B8C8DA' },
  ram: { ...MBH.krishna, skin: '#3F6A9A', skinSh: '#2C4E7A', skinDk: '#16304E', cloth: '#F0C030', clothSh: '#B8861A' },
  indra: { skin: '#E0A878', skinSh: '#B8805A', skinDk: '#6E4430', lip: '#7A3424', lipLo: '#9A4A36', hair: '#1A1010', hairLt: '#3A2420', cloth: '#F4EEDC', clothSh: '#C4B898' },
};

// =================== p1 · cover ===================
ART.cover = (c, P) => {
  // the title zone (y > .74) is kept clean: a plain dark field with no shape edges, speed lines or limbs under the
  // lettering, so the words read on top of the art (owner, 21 Nov: COMIC_GUIDE.md "Lettering sits on clean ground")
  vgrad(c, P, [[0, '#3A0E1E'], [.32, '#C2321E'], [.56, '#F08A3A'], [.7, '#8A3A3A'], [.76, '#2A1020'], [1, '#12070E']]);
  redSun(c, P.w * .66, P.h * .22, 240);
  ridge(c, P.w, P.h, P.h * .68, 26, '#7A3A46', 4, 7); ridge(c, P.w, P.h, P.h * .72, 22, '#4A1E2C', 6, 6);
  c.fillStyle = '#2A1020'; c.fillRect(0, P.h * .745, P.w, P.h);
  const g = c.createLinearGradient(0, P.h * .745, 0, P.h); g.addColorStop(0, '#2A1020'); g.addColorStop(1, '#12070E'); c.fillStyle = g; c.fillRect(0, P.h * .745, P.w, P.h * .26);
  bolt(c, [[-20, -30], [90, 110], [60, 180], [190, 300], [160, 360], [280, 470]], 9, 7);
  speedLines(c, P.w * .42, P.h * .4, 20, 240, 520, 'rgba(255,230,190,.35)', 3, 11, Math.PI * .8, Math.PI * 1.12);
  baby(c, P.w * .44, P.h * .4, 1.22, .4, { pose: 'leap', arms: [[-2.0, .2], [-1.25, -.1]], legs: [[2.6, .3], [2.25, .25]], expr: 'grin', look: [.8, -.7], red: .7, spark: 1, t: P.t }, lit(DAY(5, -5)));
};

// =================== p2 · the question ===================
const COOL = { tint: ['#183A6A', .45] };
// a vanara in silhouette (manSil, profile facing screen left) with a muzzle and a tail
function vanaraSil(c, o) {
  const col = o.col || '#0C0A10', J = { ...SIL_POSE[o.pose || 'stand'], ...(o.joints || {}) }, w = o.tw ?? 1;
  const h = J.hip, T = [[h[0] + 20, h[1] + 10], [h[0] + 140 * w, h[1] + 60], [h[0] + 240 * w, h[1] - 40], [h[0] + 230 * w, h[1] - 200], [h[0] + 170 * w, h[1] - 240]];
  limb(c, T, [26, 22, 18, 14, 10], col);
  manSil(c, { ...o, col, head: 'bare' });
  const n = J.neck, hx = n[0] - 6, hy = n[1] - 70;
  ellipse(c, hx - 52, hy + 18, 34, 28, col); ellipse(c, hx + 30, hy - 10, 18, 22, col);
}
ART.valiSugriva = (c, P) => {
  vgrad(c, P, [[0, '#9EB8D8'], [.6, '#D8E4F0'], [1, '#7A90AE']]);
  ridge(c, P.w, P.h, P.h * .66, 60, '#7A92B2', 4); ridge(c, P.w, P.h, P.h * .84, 40, '#3A4E6E', 8, 5);
  const S = '#14203A';
  // young Hanuman, behind, fists at his sides, doing nothing
  c.save(); c.translate(P.w * .88, P.h * .86); c.scale(.3, .3); vanaraSil(c, { pose: 'stand', col: '#3A4E6E' }); c.restore();
  // Sugriva, beaten down, facing his brother
  c.save(); c.translate(P.w * .3, P.h * .9); c.scale(-.36, .36); vanaraSil(c, { pose: 'kneel', col: S }); c.restore();
  // Vali, huge, smashing down at him
  c.save(); c.translate(P.w * .62, P.h * .93); c.scale(.5, .5); vanaraSil(c, { pose: 'smash', col: S, tw: 1.2 }); c.restore();
  speedLines(c, P.w * .38, P.h * .62, 18, 40, 170, 'rgba(255,255,255,.85)', 4, 3);
};
function court(c, P) {
  vgrad(c, P, [[0, '#4A1E14'], [.6, '#8A4A22'], [1, '#3A1A10']]);
  for (const x of [.08, .92]) { c.fillStyle = '#6A3418'; c.fillRect(P.w * x - 30, 0, 60, P.h); c.fillStyle = '#C8912E'; c.fillRect(P.w * x - 36, P.h * .1, 72, 14); }
  glow(c, P.w * .7, P.h * .3, 380, '#FFC870', .35);
}
ART.ramAsks = (c, P) => {
  court(c, P);
  fillPath(c, `M ${P.w * .52} ${P.h} L ${P.w * .52} ${P.h * .3} C ${P.w * .52} ${P.h * .02} ${P.w * .97} ${P.h * .02} ${P.w * .97} ${P.h * .3} L ${P.w * .97} ${P.h} Z`, '#C8912E');
  fillPath(c, `M ${P.w * .56} ${P.h} L ${P.w * .56} ${P.h * .32} C ${P.w * .56} ${P.h * .1} ${P.w * .93} ${P.h * .1} ${P.w * .93} ${P.h * .32} L ${P.w * .93} ${P.h} Z`, '#7A1A22');
  bust(c, P.w * .75, P.h * .44, .42, { who: 'ram', crown: 'kirita', tilak: 'namam', expr: 'speak', look: [-.8, 0], turn: -.25, arms: ['down', 'open'] });
};
ART.ramAsks2 = (c, P) => { court(c, P); dhead(c, P.w * .74, P.h * .56, .95, { who: 'ram', crown: 'kirita', tilak: 'namam', expr: 'speak', look: [-.9, .1], turn: -.3, tilt: -.05 }); };
ART.hanBowed = (c, P) => {
  court(c, P);
  bust(c, P.w * .72, P.h * .48, .78, { expr: 'sleep', arms: ['namaste', 'namaste'], tilt: .12 }, WARM(), hanBust);
};

// =================== p3 · hungry ===================
function dawnWoods(c, P, o = {}) {
  vgrad(c, P, [[0, '#F3B07A'], [.55, '#FBE0B0'], [1, '#C8A070']]);
  ridge(c, P.w, P.h, P.h * .55, 50, '#C89A8A', 3); ridge(c, P.w, P.h, P.h * .7, 40, '#8A7068', 5);
  const R = lcg(o.seed || 12);
  for (const [a, cols] of [[.8, ['#B8A08E', '#AA9484']], [1.1, ['#7E7466', '#706858']]]) for (let i = 0; i < 6; i++) { const x = R() * P.w, h = P.h * (.4 + R() * .3) * a; tree(c, x, P.h * (.7 + a * .1), h, cols[i % 2], i + (o.seed || 1), a * 1.4); }
}
ART.anjanaLeaves = (c, P) => {
  dawnWoods(c, P, { seed: 5 });
  // Anjana, the whole of her: going into the woods with her basket, looking back at him with love
  c.save(); c.translate(P.w * .78, P.h * .12); c.scale(.305, .305);
  figure(c, (c) => anjanaFigure(c, { expr: 'calm', open: 'happy', look: [-1, .5], turn: -.35, basket: true, tail: 'up', t: P.t }), lit(DAY()));
  c.restore();
  // the newborn asleep in a nest of leaves in the fork of a tree, close
  fillPath(c, `M -20 ${P.h * .66} C ${P.w * .2} ${P.h * .62} ${P.w * .4} ${P.h * .74} ${P.w * .55} ${P.h * .86} L ${P.w * .5} ${P.h + 20} L -20 ${P.h + 20} Z`, '#5A3A26');
  const R = lcg(4); for (let i = 0; i < 30; i++) leaf(c, P.w * (.02 + R() * .45), P.h * (.76 + R() * .12), 22 + R() * 10, R() * 3, ['#5E8A3A', '#4A7A2E', '#7AA048'][i % 3]);
  baby(c, P.w * .25, P.h * .74, .58, -.5, { pose: 'curl', expr: 'sleep', t: P.t, tail: 'curl' });
  for (let i = 0; i < 8; i++) leaf(c, P.w * (.04 + R() * .44), P.h * (.88 + R() * .1), 24 + R() * 10, R() * 3, ['#5E8A3A', '#4A7A2E', '#7AA048'][i % 3]);
};
ART.babyWail = (c, P) => {
  dawnWoods(c, P, { seed: 8 });
  fillPath(c, `M -20 ${P.h * .86} C ${P.w * .3} ${P.h * .78} ${P.w * .7} ${P.h * .78} ${P.w + 20} ${P.h * .88} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#7A6A60');
  baby(c, P.w * .5, P.h * .3, .78, 0, { pose: 'wail', expr: 'wail', tears: 1, t: P.t });
};
ART.sunRise = (c, P) => {
  vgrad(c, P, [[0, '#6A2A4A'], [.5, '#E8604A'], [.8, '#FFC080'], [1, '#FFE0A8']]);
  redSun(c, P.w * .5, P.h * .78, 120);
  ridge(c, P.w, P.h, P.h * .78, 50, '#7A3A4A', 6); ridge(c, P.w, P.h, P.h * .88, 40, '#4A1E30', 9, 7);
  for (const [x, y, w] of [[.18, .3, 300], [.8, .22, 260]]) puffs(c, P.w * x, P.h * y, w, 'rgba(255,190,150,.45)', 5);
};
ART.babyFruit = (c, P) => {
  vgrad(c, P, [[0, '#E8704A'], [1, '#F8C890']]);
  glow(c, P.w * .5, -60, 420, '#FF5A3A', .55);
  babyFace(c, P.w * .42, P.h * .52, 1.75, { expr: 'hungry', look: [.1, -1], red: 1, tears: .5, drool: 1, t: P.t }, lit(DAY(0, -6)));
};

// =================== p4 · the leap ===================
ART.leap = (c, P) => {
  vgrad(c, P, [[0, '#2E5FA8'], [.45, '#6AA6E0'], [.8, '#BFE0F6'], [1, '#F2E2C0']]);
  redSun(c, P.w * .86, P.h * .12, 150);
  // Vayu, vast and made of air, behind him in the clouds, breathing snow over his son (7.35.28)
  puffs(c, P.w * .2, P.h * .9, 700, '#FFFFFF', 2, 9);
  // the Wind: cold streams curling up behind him from below, full of snow
  c.save(); c.lineCap = 'round'; for (let i = 0; i < 7; i++) strokePath(c, `M ${-40 + i * 30} ${P.h * (.8 + i * .02)} C ${P.w * .2} ${P.h * (.62 - i * .02)} ${P.w * .3} ${P.h * (.5 + i * .02)} ${P.w * (.48 + i * .015)} ${P.h * (.4 + i * .015)}`, 'rgba(255,255,255,.55)', 10 - i); c.restore();
  // his breath: a cold stream of snow from his lips over the child
  const R = lcg(21);
  for (let i = 0; i < 90; i++) { const k = R(), x = P.w * (.05 + k * .45) + (R() - .5) * 90 * (1 + k), y = P.h * (.78 - k * .36) + (R() - .5) * 90 * (1 + k); const s = 3 + R() * 5; fillPath(c, `M ${x - s} ${y} L ${x + s} ${y} M ${x} ${y - s} L ${x} ${y + s}`, '#FFFFFF'); strokePath(c, `M ${x - s} ${y} L ${x + s} ${y} M ${x} ${y - s} L ${x} ${y + s} M ${x - s * .7} ${y - s * .7} L ${x + s * .7} ${y + s * .7} M ${x - s * .7} ${y + s * .7} L ${x + s * .7} ${y - s * .7}`, '#FFFFFF', 2); }
  ridge(c, P.w, P.h, P.h * .94, 30, '#3E6A3A', 3, 14); ridge(c, P.w, P.h, P.h * .98, 20, '#2A4E2A', 7, 18);
  for (let i = 0; i < 26; i++) { const k = i / 26; leaf(c, P.w * (.2 + k * .38) + (R() - .5) * 60, P.h * (.92 - k * .5) + (R() - .5) * 60, 10 + R() * 8, R() * 6, ['#5E8A3A', '#7AA048', '#4A7A2E'][i % 3]); }
  speedLines(c, P.w * .6, P.h * .32, 26, 200, 700, 'rgba(255,255,255,.55)', 3, 4, Math.PI * .5, Math.PI * 1.05);
  baby(c, P.w * .6, P.h * .32, 1.05, .5, { pose: 'leap', arms: [[-2.0, .2], [-1.25, -.1]], legs: [[2.4, .3], [2.0, .25]], expr: 'grin', look: [.8, -.8], red: .6, spark: 1, t: P.t }, lit(DAY(5, -5)));
};

// =================== p5 · the sun · Rahu ===================
// flames: tongues licking outward from a disc's edge
function flames(c, x, y, r, n, len, cols, seed = 2) {
  const R = lcg(seed);
  for (const [k, col] of cols.map((cc, i) => [1 - i * .22, cc])) for (let i = 0; i < n; i++) {
    const a = i / n * TAU + R() * .2, l = len * k * (.5 + R()), w = TAU / n * .9;
    const p0 = [x + Math.cos(a - w / 2) * r, y + Math.sin(a - w / 2) * r], p1 = [x + Math.cos(a + w / 2) * r, y + Math.sin(a + w / 2) * r], tp = [x + Math.cos(a + .15) * (r + l), y + Math.sin(a + .15) * (r + l)];
    fillPath(c, `M ${p0[0]} ${p0[1]} Q ${x + Math.cos(a - .1) * (r + l * .6)} ${y + Math.sin(a - .1) * (r + l * .6)} ${tp[0]} ${tp[1]} Q ${x + Math.cos(a + .3) * (r + l * .4)} ${y + Math.sin(a + .3) * (r + l * .4)} ${p1[0]} ${p1[1]} Z`, col);
  }
}
function sunFire(c, P, x, y, r) {
  vgrad(c, P, [[0, '#7A1A0A'], [1, '#E8501A']]);
  glow(c, x, y, r * 2.4, '#FFB040', .7);
  flames(c, x, y, r * .92, 26, r * .5, ['#F05A1A', '#FF9A2A', '#FFD050'], 3);
  const g = c.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, '#FFE6A0'); g.addColorStop(.7, '#FFB040'); g.addColorStop(1, '#F07A20');
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}
ART.surya = (c, P) => {
  sunFire(c, P, P.w * .68, P.h * .55, P.h * .62);
  dhead(c, P.w * .68, P.h * .5, 1.05, { who: 'surya', crown: 'sun', tilak: 'line', expr: 'kind', look: [-.9, .6], turn: -.25, tilt: -.08, t: P.t }, lit(DAY()));
  // the small gold shape coming at him
  baby(c, P.w * .12, P.h * .8, .22, -.4, { pose: 'leap', arms: [[-2.0, .2], [-1.25, -.1]], legs: [[2.4, .3], [2.0, .25]], expr: 'grin', t: P.t });
};
ART.rahu = (c, P) => {
  vgrad(c, P, [[0, '#0A0610'], [1, '#2A1430']]);
  // the edge of the sun at the left
  glow(c, -P.w * .2, P.h * .5, P.h * .9, '#FF9A3A', .7); c.fillStyle = '#FFB040'; c.beginPath(); c.arc(-P.w * .35, P.h * .5, P.h * .55, 0, TAU); c.fill();
  rahuAt(c, P.w * .64, P.h * .64, .9, { expr: 'rage', look: [-1, -.2], t: P.t, trail: 1 });
};
ART.babyGrabs = (c, P) => {
  vgrad(c, P, [[0, '#2A1430'], [1, '#6A2A3A']]);
  rahuAt(c, P.w * .9, P.h * .46, .85, { expr: 'shock', look: [-1, .3], t: P.t, trail: 1 });
  speedLines(c, P.w * .35, P.h * .5, 16, 120, 340, 'rgba(255,220,180,.5)', 3, 5, Math.PI * .7, Math.PI * 1.3);
  baby(c, P.w * .36, P.h * .48, .62, .9, { pose: 'leap', arms: [[-.9, .1], [-.3, -.1]], legs: [[2.4, .3], [2.0, .25]], expr: 'giggle', look: [1, 0], t: P.t }, lit(DAY(4, -3)));
};
ART.rahuFlees = (c, P) => {
  vgrad(c, P, [[0, '#3A1E5A'], [.6, '#E86A4A'], [1, '#FFC080']]);
  speedLines(c, P.w * .62, P.h * .5, 30, 200, 900, 'rgba(255,255,255,.35)', 3, 8, -.3, .3);
  rahuAt(c, P.w * .2, P.h * .5, .7, { expr: 'scream', look: [1, -.2], t: P.t, trail: 1 });
  baby(c, P.w * .82, P.h * .62, .5, -.9, { pose: 'leap', arms: [[-2.0, .2], [-1.25, -.1]], legs: [[2.4, .3], [2.0, .25]], expr: 'grin', look: [-1, 0], t: P.t, flip: true });
};

// =================== p6 · a bigger fruit ===================
// Airavata (the white four-tusked elephant, elephantSide in cine_kumbha.js, whitened) with Indra on his back
function airavata(c, x, y, k, o = {}) {
  c.save(); c.translate(x, y); c.scale(k * (o.flip ? -1 : 1), k);
  const seat = o.rider ? (c) => { c.save(); c.translate(0, -170); c.scale(o.flip ? -.5 : .5, .5); devaBust(c, { who: 'indra', crown: 'kirita', tilak: 'dot', stache: true, expr: o.expr || 'fierce', look: [1, 0], arms: o.arms || ['down', 'fist'], t: o.t }); c.restore(); } : null;
  figure(c, (c) => airavataSide(c, { t: o.t, run: o.run ?? 1, trunk: o.trunk ?? .1, seat }), lit(DAY(4, -4)));
  c.restore();
}
ART.indraRides = (c, P) => {
  vgrad(c, P, [[0, '#2E4E8E'], [.7, '#8AB0D8'], [1, '#E8D8B8']]);
  puffs(c, P.w * .5, P.h * .9, 1100, '#F4F0EA', 5, 10);
  rahuAt(c, P.w * .1, P.h * .36, .3, { expr: 'scream', look: [-1, 0], t: P.t, trail: 1 });
  airavata(c, P.w * .56, P.h * 1.0, .5, { flip: true, rider: true, t: P.t });
};
ART.babyBigger = (c, P) => {
  vgrad(c, P, [[0, '#7AA8D8'], [1, '#E8D8B8']]);
  airavata(c, P.w * .92, P.h * .62, .24, { flip: true, rider: true, t: P.t, run: .4 });
  babyFace(c, P.w * .36, P.h * .6, 1.1, { expr: 'hungry', look: [1, -.3], drool: 1, spark: 1, turn: .4, t: P.t });
};
ART.babyBlaze = (c, P) => {
  vgrad(c, P, [[0, '#3A0A0A'], [1, '#8A2A0A']]);
  glow(c, P.w * .5, P.h * .5, 380, '#FF8A2A', .9);
  flames(c, P.w * .5, P.h * .48, 120, 14, 200, ['#E8401A', '#FF8A2A', '#FFD050'], 6);
  baby(c, P.w * .5, P.h * .44, .62, .5, { pose: 'leap', arms: [[-1.4, .2], [-.7, -.1]], legs: [[2.4, .3], [2.0, .25]], expr: 'fierce', look: [1, -.3], t: P.t }, { ...WARM(), tint: ['#FF6A1A', .25] });
};
ART.vajraLeaves = (c, P) => {
  vgrad(c, P, [[0, '#1A1030'], [1, '#4A2A6A']]);
  bust(c, P.w * .24, P.h * .52, .62, { who: 'indra', crown: 'kirita', tilak: 'dot', stache: true, expr: 'calm', look: [1, -.4], turn: .3, arms: ['down', 'throw'] }, lit(DAY(4, -4)));
  glow(c, P.w * .62, P.h * .32, 220, '#B89AFF', .8);
  speedLines(c, P.w * .62, P.h * .32, 22, 90, 260, 'rgba(220,200,255,.8)', 3, 7);
  vajraK(c, P.w * .62, P.h * .32, 1.1, .9);
};

// =================== p7 · the vajra ===================
ART.vajraHit = (c, P) => {
  vgrad(c, P, [[0, '#0C0618'], [1, '#2A1440']]);
  const x = P.w * .5, y = P.h * .55;
  glow(c, x, y, 700, '#9A7AFF', .7); glow(c, x, y, 320, '#E6DEFF', .9);
  // the star: long white spikes
  const R = lcg(13);
  for (let i = 0; i < 18; i++) { const a = i / 18 * TAU + R() * .1, l = 220 + R() * 520, w = .05 + R() * .05; fillPath(c, `M ${x + Math.cos(a - w) * 40} ${y + Math.sin(a - w) * 40} L ${x + Math.cos(a) * l} ${y + Math.sin(a) * l} L ${x + Math.cos(a + w) * 40} ${y + Math.sin(a + w) * 40} Z`, i % 2 ? '#FFFFFF' : '#D8CCFF'); }
  c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(x, y, 150, 0, TAU); c.fill();
  bolt(c, [[P.w * .95, -20], [P.w * .8, P.h * .2], [P.w * .66, P.h * .35], [x + 40, y - 40]], 12, 3);
  // the child, black inside the light, thrown back
  baby(c, x, y + 10, .62, -.7, { pose: 'limp', expr: 'hurt', t: P.t }, { tint: ['#0A0610', 1] });
};
ART.babyFallen = (c, P) => {
  vgrad(c, P, [[0, '#2A2234'], [1, '#4A4050']]);
  // a black peak, the child on it
  fillPath(c, `M -20 ${P.h + 20} L -20 ${P.h * .8} L ${P.w * .3} ${P.h * .64} L ${P.w * .5} ${P.h * .67} L ${P.w * .75} ${P.h * .62} L ${P.w + 20} ${P.h * .76} L ${P.w + 20} ${P.h + 20} Z`, '#141018');
  fillPath(c, `M ${P.w * .3} ${P.h * .64} L ${P.w * .36} ${P.h * .76} L ${P.w * .5} ${P.h * .67} Z`, '#2A2430');
  baby(c, P.w * .5, P.h * .47, .68, -1.5, { pose: 'limp', expr: 'hurt', bruise: 1, blood: 1, t: P.t, tail: 'limp' }, lit(DAY(-3, -4)));
  // dust still settling
  const R = lcg(4); for (let i = 0; i < 26; i++) ellipse(c, P.w * (.3 + R() * .45), P.h * (.5 + R() * .2), 3 + R() * 4, 3 + R() * 4, rgba('#8A8090', .5));
};

// =================== p8 · the wind stops ===================
ART.vayuLifts = (c, P) => {
  vgrad(c, P, [[0, '#2A2234'], [1, '#141018']]);
  c.save(); c.translate(P.w * .5, P.h * .46); c.scale(.66, .66);
  figure(c, (c) => {
    devaBust(c, { who: 'vayu', crown: 'kirita', hair: 'wind', tilak: 'dot', expr: 'grief', look: [-.3, 1], tilt: .08, arms: ['cradle', 'down'], t: P.t });
    c.save(); c.translate(-190, 330); c.rotate(-1.62); c.scale(.78, .78); balHanuman(c, { pose: 'limp', expr: 'hurt', bruise: 1, blood: 1, tail: 'limp' }); c.restore();
  }, lit(DAY(-3, -4)));
  c.restore();
};
ART.vayuCave = (c, P) => {
  vgrad(c, P, [[0, '#4A5A6A'], [1, '#8A8A70']]);
  // the cave mouth, black, on the right
  fillPath(c, `M ${P.w * .55} ${P.h + 20} C ${P.w * .58} ${P.h * .4} ${P.w * .8} ${P.h * .2} ${P.w + 20} ${P.h * .22} L ${P.w + 20} ${P.h + 20} Z`, '#3A3428');
  fillPath(c, `M ${P.w * .66} ${P.h + 20} C ${P.w * .68} ${P.h * .55} ${P.w * .82} ${P.h * .38} ${P.w + 20} ${P.h * .4} L ${P.w + 20} ${P.h + 20} Z`, '#050306');
  // everything bending toward it: grass, a banner, a torch flame, leaves flying in
  const R = lcg(7);
  for (let i = 0; i < 60; i++) { const x = R() * P.w * .66, y = P.h * (.82 + R() * .18), h = 30 + R() * 40; strokePath(c, `M ${x} ${y} Q ${x + h * .3} ${y - h * .7} ${x + h} ${y - h * .5}`, '#5A6A3A', 4); }
  strokePath(c, `M ${P.w * .14} ${P.h} L ${P.w * .14} ${P.h * .3}`, '#3A2A1A', 8);
  fillPath(c, `M ${P.w * .14} ${P.h * .3} C ${P.w * .26} ${P.h * .28} ${P.w * .34} ${P.h * .36} ${P.w * .44} ${P.h * .32} L ${P.w * .4} ${P.h * .4} C ${P.w * .3} ${P.h * .44} ${P.w * .24} ${P.h * .38} ${P.w * .14} ${P.h * .42} Z`, '#B8302A');
  for (let i = 0; i < 14; i++) leaf(c, P.w * (.3 + R() * .5), P.h * (.3 + R() * .4), 10, R() * 3, '#6A7A3A');
  speedLines(c, P.w * 1.1, P.h * .7, 20, 300, 700, 'rgba(255,255,255,.4)', 3, 2, Math.PI * .85, Math.PI * 1.15);
  // Vayu walking in, the child held to him
  c.save(); c.translate(P.w * .7, P.h * .98); c.scale(-.36, .36); manSil(c, { pose: 'walk', head: 'kirita', col: '#0A0810' }); c.restore();
};
function bird(c, x, y, k, a, col) { c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k); fillPath(c, 'M -30 0 C -10 -8 10 -8 30 0 C 10 4 -10 4 -30 0 Z', col); fillPath(c, 'M -4 -2 C -20 -30 -40 -36 -56 -30 C -40 -20 -24 -8 -8 2 Z', col); fillPath(c, 'M 4 -2 C 14 -24 30 -30 44 -26 C 30 -16 18 -6 8 2 Z', col); ellipse(c, 32, -2, 8, 6, col); c.restore(); }
ART.choke = (c, P) => {
  vgrad(c, P, [[0, '#4A5A3A'], [.6, '#A8A878'], [1, '#6A6A4A']]);
  const D = '#1A1A12';
  // a god in the clouds, kneeling, clutching his chest
  puffs(c, P.w * .82, P.h * .3, 360, '#C8C8A8', 3, 7);
  c.save(); c.translate(P.w * .82, P.h * .3); c.scale(.17, .17); manSil(c, { pose: 'kneel', head: 'kirita', col: '#3A3A2A' }); c.restore();
  // birds dropping out of the sky
  for (const [x, y, a] of [[.36, .16, 1.9], [.5, .3, 2.3], [.62, .12, 1.7], [.44, .46, 2.6]]) bird(c, P.w * x, P.h * y, .8, a, D);
  ridge(c, P.w, P.h, P.h * .82, 24, '#4A4A34', 5);
  // the fire standing dead straight, no flicker
  fillPath(c, `M ${P.w * .27 - 22} ${P.h * .82} C ${P.w * .27 - 26} ${P.h * .66} ${P.w * .27 - 6} ${P.h * .44} ${P.w * .27} ${P.h * .36} C ${P.w * .27 + 6} ${P.h * .44} ${P.w * .27 + 26} ${P.h * .66} ${P.w * .27 + 22} ${P.h * .82} Z`, '#E8A040');
  fillPath(c, `M ${P.w * .27 - 10} ${P.h * .82} C ${P.w * .27 - 12} ${P.h * .7} ${P.w * .27 - 3} ${P.h * .56} ${P.w * .27} ${P.h * .5} C ${P.w * .27 + 3} ${P.h * .56} ${P.w * .27 + 12} ${P.h * .7} ${P.w * .27 + 10} ${P.h * .82} Z`, '#FFE6A0');
  // the rishi at it, head thrown back, hands at his throat
  c.save(); c.translate(P.w * .14, P.h * .9); c.scale(.36, .36); rishi(c, { pose: 'drink', tip: 1, col: D }); c.restore();
  // a man on his knees, a woman fallen against him
  c.save(); c.translate(P.w * .52, P.h * .92); c.scale(.36, .36); manSil(c, { pose: 'kneel', head: 'knot', col: D }); c.restore();
  c.save(); c.translate(P.w * .68, P.h * .93); c.scale(-.34, .34); womanSil(c, { col: D }); c.restore();
};

