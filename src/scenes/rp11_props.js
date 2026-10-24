// rp11_props.js: sets, props and the extra cast for rp11.js (Ramayan Part 11, "Ram vs the Ocean"). Loaded after
// src/ramayan.js and src/ramayan_sets.js (P1, tree, notes, tears, arrowAt). Pure functions.
//   P11                                              the palette
//   shore, frontSea, lankaWall                        sets (shore's sky runs through days and nights with o.day)
//   cloudPuff, poof, fish, crab, rockLoad, bridge, dayPill   props
//   vibhishana, vanaraKing (Sugriva), vanara, nala, sagara   the cast
const P11 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  skyHi: '#8FC0EA', skyLo: '#FCE3C4', nightHi: '#141C44', nightLo: '#33366E', dawnHi: '#F2A07A', dawnLo: '#FFE2B8',
  sea: '#3E86B8', seaDk: '#2A6494', seaLt: '#9ED0EE', foam: '#EAF6FC', angry: '#2A3E6A',
  sand: '#E8CC98', sandDk: '#C8A470', grass: '#9AB86A', grassDk: '#6E8E48',
  rock: '#A8988A', rockDk: '#7A6C5E', rockLt: '#C8BAAA', lanka: '#E2A83A', lankaDk: '#A8701E',
  sagara: '#3E9EC8', sagaraDk: '#2A7A9E', sagaraLt: '#7CC8E8',
};

// ---------- small props ----------
function cloudPuff(x, y, s, key, a = 255, col = '#FFF6EC', dk = '#E8D6CC') {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: dk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: col, washOp: a, ink: null });
}
function poof(x, y, s, age, key = 'pf', cols = ['#FFF2C8', '#F2D890']) {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: cols[i % 2], washOp: 255 * (1 - age), ink: null }); }
}
// a little cartoon fish leaping (a = its tilt), s long, with a worried face
function fish(x, y, s, a, key = 'fi', col = '#F2A03A') {
  boilSeed(key);
  push(); translate(x, y); rotate(a);
  paint([[-s * .5, 0], [-s * .75, -s * .22], [-s * .75, s * .22]], { wash: col, ink: P11.ink, sw: .7 });
  paint(ellPts(0, 0, s * .42, s * .24, 14), { wash: col, ink: P11.ink, sw: .8 });
  paint(ellPts(s * .2, -s * .05, s * .07, s * .07, 8), { wash: '#FFFFFF', ink: P11.ink, sw: .4 });
  paint(ellPts(s * .22, -s * .05, s * .03, s * .03, 6), { wash: P11.ink, ink: null });
  inkLine([[s * .3, s * .1], [s * .36, s * .06]], 1.4, P11.ink, 'inkfine', 0);
  pop();
}
// a red crab, its body at (x, y), s wide, pinch 0..1
function crab(x, y, s, pinch = 0, key = 'cr') {
  boilSeed(key);
  for (const d of [-1, 1]) { for (let i = 0; i < 3; i++) inkLine([[x + d * s * .3, y + s * .05], [x + d * s * (.55 + i * .06), y + s * (.12 + i * .08)], [x + d * s * (.6 + i * .06), y + s * (.3 + i * .05)]], 2, '#C8382A', 'ink', .3);
    paint(ellPts(x + d * s * .55, y - s * .35, s * .16, s * .12, 10), { wash: '#E2503A', ink: P11.ink, sw: .6 });
    paint([[x + d * s * .55, y - s * .35], [x + d * s * (.7 + .1 * pinch), y - s * .5], [x + d * s * .66, y - s * .3]], { wash: '#FFE0D0', ink: P11.ink, sw: .4 }); }
  paint(ellPts(x, y, s * .38, s * .24, 16), { wash: '#E2503A', ink: P11.ink, sw: .8 });
  for (const d of [-1, 1]) { inkLine([[x + d * s * .1, y - s * .2], [x + d * s * .12, y - s * .38]], 2, P11.ink, 'ink', 0); paint(ellPts(x + d * s * .12, y - s * .4, s * .06, s * .06, 8), { wash: '#FFFFFF', ink: P11.ink, sw: .4 }); }
}
// a boulder (carried or placed), centred at (x, y), r its radius
function rockLoad(x, y, r, key = 'rk') { boilSeed(key); paint(ellPts(x, y, r, r * .8, 12, r * .08), { wash: P11.rock, fill: P11.rockDk, fillOp: 50, tex: .4, ink: P11.ink, sw: .9 }); paint(ellPts(x - r * .3, y - r * .3, r * .25, r * .15, 8), { wash: P11.rockLt, ink: null }); }
// the bridge: a causeway of boulders and logs from x0 to x0 + len * k at water level y, h thick
function bridge(x0, y, len, k, h = 70, key = 'br') {
  if (k <= 0) return;
  const x1 = x0 + len * k;
  boilSeed(key);
  paint(rectPts(x0, y - h * .5, x1 - x0, h), { wash: P11.rock, fill: P11.rockDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[x0, y - h * .5], [x1, y - h * .5]], 1.2, P11.ink, 'ink', .2);
  for (let x = x0 + 30, i = 0; x < x1 - 20; x += 62, i++) { paint(ellPts(x, y - h * .5 + 6 * Math.sin(i), 34, 18, 10, 2), { wash: i % 3 ? P11.rockLt : '#8A6A44', ink: P11.ink, sw: .6 }); }
  paint(ellPts(x1, y - h * .2, h * .6, h * .55, 12, 3), { wash: P11.rock, ink: P11.ink, sw: .8 });   // the growing end
}
// a pill with a day count (screen space), for the waiting and the building
function dayPill(txt, x, y, k = 1) {
  if (k <= 0) return;
  boilSeed('pill' + txt);
  push(); translate(x, y); scale(backOut(clamp(k))); paint(rrPts(-130, -40, 260, 80, 40), { wash: '#FFF5E2', ink: P11.ink, sw: 1.2 }); pop();
  letter(txt, x, y + 3, 48, '#7A2236', { screen: true, font: '700 50px Poppins', ink: false, pop: k * 4 });
}

// ---------- sets ----------
// the shore facing the sea: sky (o.day: 0 noon .. 1 night, o.dawn 0..1 warms it, o.angry 0..1 darkens the sea and sky),
// the sea from o.hy down, sand from o.sy down
function shore(t, key = 'sh', o = {}) {
  const hy = o.hy ?? 1340, sy = o.sy ?? 1640, night = o.night || 0, dawn = o.dawn || 0, angry = o.angry || 0;
  boilSeed(key + 'sky');
  const hi = mixCol(mixCol(mixCol(P11.skyHi, P11.dawnHi, dawn), P11.nightHi, night), '#3A2A4A', angry), lo = mixCol(mixCol(mixCol(P11.skyLo, P11.dawnLo, dawn), P11.nightLo, night), '#6A4A5A', angry);
  paint(rectPts(-600, -800, W + 1200, hy + 900), { wash: hi, ink: null });
  paint(ellPts(540, hy - 160, 1200, 420, 26), { fill: lo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  if (o.sun != null) { const [sx, syy, a] = o.sun; glow(sx, syy, 200, '#FFD890', .5 * a); paint(ellPts(sx, syy, 60, 60, 18), { wash: '#FFE6B0', washOp: 255 * a, ink: null }); }
  if (o.moon != null) { const [mx, my, a] = o.moon; glow(mx, my, 140, '#FFF4D2', .4 * a); paint(ellPts(mx, my, 44, 44, 18), { wash: '#FFF4D2', washOp: 255 * a, ink: null }); }
  if (night > .3) { boilSeed(key + 'st'); for (let i = 0; i < 16; i++) paint(starPts(-100 + hash(i * 2.3) * 1300, 300 + hash(i * 6.7) * (hy - 500), 3 + 3 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', washOp: 255 * clamp((night - .3) * 2), ink: null }); }
  if (o.lanka) {   // far off: Lanka's hill with a few domed towers, pale with distance
    boilSeed(key + 'lk'); const far = mixCol(mixCol(P11.lanka, lo, .45), '#4A3A5A', night);
    paint(ellPts(870, hy + 4, 190, 34, 18), { wash: mixCol(far, '#6A5A4A', .3), ink: null });
    for (let i = 0; i < 5; i++) { const x = 790 + i * 40, h = 26 + 40 * Math.sin((i + .5) / 5 * Math.PI); paint(rectPts(x - 11, hy - 20 - h, 22, h + 4), { wash: far, ink: null }); paint(ellPts(x, hy - 20 - h, 12, 11, 10), { wash: far, ink: null }); }
  }
  frontSea(t, hy, key + 'sea', { night, angry, churn: o.churn || 0 });
  if (sy < 2400) { boilSeed(key + 'sand'); paint(rectPts(-600, sy, W + 1200, 1200), { wash: mixCol(P11.sand, '#4A4468', night * .8), fill: mixCol(P11.sandDk, '#34304E', night * .8), fillOp: 50, tex: .5, ink: null }); inkLine([[-100, sy + 2], [500, sy - 6], [1200, sy + 4]], 1, P11.ink, 'ink', .5); }
}
// the sea surface from y down; churn 0..1 makes the waves big and fast with foam
function frontSea(t, y, key = 'fs', o = {}) {
  const night = o.night || 0, angry = o.angry || 0, ch = o.churn || 0;
  boilSeed(key);
  paint(rectPts(-600, y, W + 1200, 2200), { wash: mixCol(mixCol(P11.sea, '#2A3A6A', night), P11.angry, angry), ink: null });
  for (let i = 0; i < 16; i++) {
    const r = hash(i * 2.3), yy = y + 26 + r * r * 700 + Math.sin(t * 6 + i) * 20 * ch, x = 1500 - frac(hash(i * 7.7) + t * (.02 + ch * .2)) * 2200, w = (50 + r * 70) * (1 + ch), hh = (10 + r * 6) * (1 + ch * 3);
    inkLine([[x, yy], [x + w * .5, yy - hh], [x + w, yy]], 1.4 + r * 1.4 + ch * 2, mixCol(P11.seaLt, P11.foam, ch), 'inkfine', .5);
  }
}
// Lanka's wall at night (the finale tease): a crenellated gold wall across the frame, its top at y, burnt towers behind
function lankaWall(t, y, key = 'lw') {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -800, W + 1200, 3200), { wash: '#2A1A3A', ink: null });
  paint(ellPts(540, y - 300, 1100, 460, 26), { fill: '#6A2E3A', fillOp: 200, bleed: .3, tex: .4, ink: null });
  boilSeed(key + 'tw'); for (let i = 0; i < 6; i++) { const x = 40 + i * 200, h = 300 + 200 * hash(i * 3.3); paint(rectPts(x - 50, y - h, 100, h), { wash: '#3A2A3A', ink: null }); paint(ellPts(x, y - h, 46, 40, 14), { wash: '#4A3040', ink: null }); }
}
function lankaWallFront(y, key = 'lwf') {
  boilSeed(key);
  paint(rectPts(-600, y, W + 1200, 1400), { wash: '#B8862E', fill: '#7E5420', fillOp: 60, tex: .5, ink: null });
  for (let i = 0; i < 9; i++) paint(rectPts(-60 + i * 150, y - 50, 90, 54), { wash: '#C8963E', ink: P11.ink, sw: .8 });
  inkLine([[-300, y + 2], [1400, y + 2]], 1, P11.ink, 'ink', 0);
}

// ---------- the cast ----------
// Vibhishana, Ravana's good brother (as in Part 10)
function vibhishana(x, y, u, o = {}) { asura(x, y, u, { kind: 'nishumbha', sword: false, shield: false, horns: 'none', stache: false, tusks: false, pal: { skin: '#7E9AC0', skinDk: '#5E789E', skinLt: '#A8C0DE', dhoti: '#E8A33A', dhotiDk: '#B67D1C', sash: '#F2E6C8', sashDk: '#C8B890' }, ...o }); }
// Sugriva (as in Part 8): Hanuman's rig in gold fur with a king's mukut
const VK_FUR = { skin: '#C89A4A', skinDk: '#9A702A', skinLt: '#E8BC6A', fur: '#C89A4A', furDk: '#9A702A', furLt: '#E8BC6A', dhoti: '#2E6A5A', dhotiDk: '#1E4A3E', dhotiLt: '#4E8A7A' };
function vanaraKing(x, y, u, o = {}) { return hanuman(x, y, u, { gada: 0, tail: 'curl', ...o, pal: { ...HNM, ...VK_FUR, ...(o.pal || {}) } }); }
// a vanara of the army: Hanuman's rig, no crown, in one of a few furs (i picks)
const VANARA_FURS = [['#B8864A', '#8A5E2E', '#D8A86A'], ['#9A8A7A', '#6E6050', '#BCAE9E'], ['#C87A3A', '#9A5420', '#E89E62'], ['#8A6A4A', '#5E4430', '#AA8A6A']];
function vanara(x, y, u, i = 0, o = {}) { const [f, d, l] = VANARA_FURS[i % 4]; return hanuman(x, y, u, { gada: 0, crown: false, tail: 'curl', ...o, pal: { ...HNM, skin: f, skinDk: d, skinLt: l, fur: f, furDk: d, furLt: l, dhoti: ['#2E6A5A', '#7A3A8A', '#3A5A9A', '#8A3A2E'][i % 4], dhotiDk: '#1E2A3A', ...(o.pal || {}) } }); }
// Nala, son of Vishwakarma, the builder: a grey-brown vanara with a builder's band on his head
const nalaBand = (u, sw) => { paint(rrPts(-3.6 * u, -24.4 * u, 7.2 * u, 1.2 * u, .5 * u), { wash: '#E8A33A', ink: HNM.ink, sw: sw * .6 }); };
function nala(x, y, u, o = {}) { return vanara(x, y, u, 1, { hat: nalaBand, ...o }); }
// Sagara, the Ocean in person: Ram's rig in sea blue with a pearl-white crown, rising from the water
const SAGARA_PAL = { skin: '#4EA8D2', skinDk: '#2E80AA', skinLt: '#8ED0EE', dhoti: '#E8F4FA', dhotiDk: '#B8D4E2', dhotiLt: '#FFFFFF', border: '#2E6A9A', shawl: '#2E6A9A', shawlDk: '#1E4A6E' };
function sagara(x, y, u, o = {}) { return ram(x, y, u, { kodanda: false, ...o, pal: { ...SAGARA_PAL, ...(o.pal || {}) } }); }
