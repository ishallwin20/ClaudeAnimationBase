// lion_props.js: the sets and props for "Aarav had ONE job: ROAR." (src/scenes/lion.js). Loaded before it; everything
// here is a pure function of its arguments (and T for boil).
//
//   Copied from ad 8 (kalaratri_props.js): TK, sparkStar, vanishPuff, sparkleBurst, whipH, veil
//   LN                                   the palette of this reel
//   stageSet(t, o), frontCurtains(k, o)  the school stage: plum curtains, the spotlight, the boards; the front curtains
//   audience(t, o), mum(x, y, o)         silhouetted heads in the front rows; Mum filming on her phone
//   roomSet(t, o), bed(o), shelf(o)      Aarav's bedroom at night (the lamp, the window, the shelf of books)
//   mane(cx, cy, s, o), maneEars(o)      the paper lion mane (a ring of petals) and its headband with ears (a hat hook)
//   tail(x, y, s, o)                     the costume's yarn tail with the tiny bell; returns the tip
//   tinyBell(x, y, s, o), bookShut(...)  the little gold bell; a painted closed / open book
//   beam(...), petalSwirl(...), shockRings(...), lionSpirit(...)   the magic and the ROAR
//   hornsHat(o), cardSword(...)          the demon kid's costume
//   lionCard(t, C)                       the end card: Books 1–3, Book 3 in front
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const LN = {
  ink: '#2B2233',
  curtain: '#5A2650', curtainDk: '#3A1636', curtainLt: '#7E3C70', curtainRed: '#8E2A3E', curtainRedDk: '#5E1A2A', curtainRedLt: '#B04456',
  boards: '#6A4430', boardsDk: '#4A2E20', boardsLt: '#8A5E40', spot: '#FFE9C2', gold: '#FFD87A', goldLt: '#FFF1C2',
  wall: '#2C3358', wallWarm: '#C79A62', wallLt: '#3C4470', floor: '#3A3048', floorWarm: '#8A5E40', rug: '#8E3A4A', rugLt: '#B85A62',
  wood: '#7A4A30', woodDk: '#56321E', woodLt: '#9A6A44', sheet: '#E4DEF0', sheetDk: '#B8B0D2', blanket: '#5A7EC0', blanketDk: '#3E5E9A', blanketLt: '#86A6DA',
  pillow: '#F1ECF8', shade: '#F2C46A', shadeDk: '#C8962E', night: '#18204A', nightLt: '#26306A', star: '#FFF5E2', moon: '#F5ECD6',
  paper: ['#F39A2E', '#F7C341', '#E8692A', '#F5B03A'], paperDk: '#B8601E', band: '#8A5A32', yarn: '#E8A030', yarnDk: '#B87018',
  book: '#D9643A', bookDk: '#A8452A', pages: '#FFF6E2',
  head: '#1C1626', headLt: '#2E2638', phone: '#BFE0FF', phoneDk: '#22243A', mumSari: '#3A2A48',
  horn: '#F2E6D0', hornDk: '#C8B898', sword: '#C9A878', swordDk: '#8E6E48', foil: '#DCE3EA',
  lion: '#FFD25A', lionDk: '#E89A2E',
};

// ---------- copied from ad 8 ----------
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

// ---------- the stage ----------
// A curtain panel between x0 and x1 (top y0, hem y1): soft vertical folds. sway 0..1 ripples it; o.red for the warm show.
function curtainPanel(x0, x1, y0, y1, key, o = {}) {
  const c = o.red ? [LN.curtainRed, LN.curtainRedDk, LN.curtainRedLt] : [LN.curtain, LN.curtainDk, LN.curtainLt];
  boilSeed(key);
  paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: c[0], ink: null });
  const n = Math.max(2, Math.round((x1 - x0) / 120)), sw = o.sway || 0;
  for (let i = 0; i < n; i++) {
    const fx = lerp(x0, x1, (i + .5) / n), w = (x1 - x0) / n * .32, wv = Math.sin(T * 1.3 + i * 1.7) * 8 * sw;
    paint(ribbon([[fx, y0], [fx + wv * .5, lerp(y0, y1, .5)], [fx + wv, y1]], w * .7, w * 1.1), { fill: c[1], fillOp: 150, bleed: .08, tex: .5, border: .4, ink: null });
    paint(ribbon([[fx + w * .9, y0], [fx + w * .9 + wv * .5, lerp(y0, y1, .5)], [fx + w * .9 + wv, y1]], w * .25, w * .45), { wash: c[2], washOp: 120, ink: null });
  }
}
// The stage: the back curtain, the boards, a spotlight pool and cone. o: spot [x, y, r] (the pool on the boards, centred
// under the performer), spotA 0..1, warm 0..1 (the show: red curtain, gold light), floorY, x0, x1 (world extent)
function stageSet(t, o = {}) {
  const fy = o.floorY ?? 1600, x0 = o.x0 ?? -900, x1 = o.x1 ?? W + 400, warm = o.warm || 0;
  curtainPanel(x0, x1, -500, fy, 'backcurtain', { red: warm > .5, sway: .3 });
  boilSeed('boards');
  paint(rectPts(x0, fy, x1 - x0, 900), { wash: LN.boards, fill: LN.boardsDk, fillOp: 60, tex: .5, ink: null });
  for (let i = 0; i < 7; i++) inkLine([[x0, fy + 16 + i * i * 9], [x1, fy + 16 + i * i * 9]], 1, LN.boardsDk, 'inkfine', .05);
  inkLine([[x0, fy], [x1, fy]], 2.2, LN.ink, 'ink', 0);
  if (o.spot) {
    const [sx, sy, sr] = o.spot, a = o.spotA ?? 1;
    boilSeed('spotcone');
    paint([[sx - sr * .25, -500], [sx + sr * .25, -500], [sx + sr * 1.05, sy], [sx - sr * 1.05, sy]], { wash: LN.spot, washOp: 34 * a, ink: null });
    glow(sx, sy - sr * 1.3, sr * 2.3, warm > .5 ? '#FFC870' : '#E8D6FF', .55 * a);
    boilSeed('spotpool');
    paint(ellPts(sx, sy + 10, sr * 1.05, sr * .22, 30), { wash: LN.spot, washOp: 120 * a, ink: null });
    glow(sx, sy + 10, sr * .9, '#FFE6B0', .5 * a);
  }
}
// The front curtains: two halves that meet in the middle at k = 0 and are gathered to the sides at k = 1.
// o: cx (the centre), y0, y1, w (each half's width when closed)
function frontCurtains(k, o = {}) {
  const cx = o.cx ?? W / 2, y0 = o.y0 ?? -600, y1 = o.y1 ?? 1640, w = o.w ?? 1300, e = ease(k);
  for (const s of [-1, 1]) {
    const inner = cx + s * lerp(0, w * .82, e), outer = cx + s * (w + 200);
    curtainPanel(Math.min(inner, outer), Math.max(inner, outer), y0, y1, 'front' + s, { red: true, sway: 1 - e });
    boilSeed('fronthem' + s);
    inkLine([[inner, y0], [inner + s * 30 * e, (y0 + y1) / 2], [inner, y1]], 2, LN.ink, 'ink', .4);
  }
  boilSeed('valance');   // the pelmet over the top
  paint(rectPts(cx - 2000, y0 - 200, 4000, 560), { wash: LN.curtainRedDk, ink: null });
  for (let i = 0; i < 26; i++) { const x = cx - 2000 + i * 160; paint(ellPts(x + 80, y0 + 360, 90, 60, 16), { wash: LN.curtainRed, ink: LN.ink, sw: 1.2 }); }
  paint(rectPts(cx - 2000, y0 + 330, 4000, 18), { wash: TK.gold, ink: null });
}
// The front rows: silhouetted heads (back view) along the bottom, Mum among them. o: giggle (bob), blow 0..1 (hair
// streams back, heads tip), cheer 0..1 (arms up), y (the shoulder line), x0, x1
function audience(t, o = {}) {
  const y = o.y ?? 1840, x0 = o.x0 ?? -200, x1 = o.x1 ?? W + 200, gig = o.giggle || 0, blow = o.blow || 0, cheer = o.cheer || 0;
  const n = Math.round((x1 - x0) / 150);
  for (let i = 0; i < n; i++) {
    if (o.skip && o.skip(i)) continue;
    const hx = x0 + (i + .5) * (x1 - x0) / n + (hash(i * 3.3) - .5) * 40, hr = 50 + 12 * hash(i * 7.1), row = i % 2 ? 0 : 30;
    const bob = gig * Math.abs(Math.sin(t * 16 + i * 1.3)) * 10, tip = blow * (.12 + .05 * hash(i));
    const by = y + row - bob, hy = by - hr * 1.15;
    boilSeed('aud' + i);
    if (cheer > .02) for (const s of [-1, 1]) {   // arms up, waving
      const k = clamp(cheer * 1.4 - hash(i + s) * .4), wv = Math.sin(t * 10 + i + s) * .2;
      paint(ribbon([[hx + s * hr * .8, by + 10], [hx + s * hr * (1.3 + wv), by - hr * 1.4 * k], [hx + s * hr * (1.1 + wv * 2), by - hr * 2.6 * k]], 34, 26), { wash: LN.headLt, ink: null });
      paint(ellPts(hx + s * hr * (1.1 + wv * 2), by - hr * 2.7 * k, 22, 24, 12), { wash: LN.headLt, ink: null });
    }
    paint(ellPts(hx, by + 70, hr * 1.6, 90, 20), { wash: LN.head, ink: null });   // shoulders
    push(); translate(hx, hy + hr); rotate(-tip * (i % 2 ? 1 : -1) * .3); translate(-hx, -(hy + hr));
    paint(ellPts(hx, hy + blow * 6, hr, hr * 1.05, 22), { wash: LN.head, ink: null });
    for (const s of [-1, 1]) paint(ellPts(hx + s * hr * .98, hy + hr * .1, hr * .2, hr * .3, 10), { wash: LN.head, ink: null });   // ears
    if (blow > .02) for (let k = 0; k < 4; k++) {   // hair streaming back (down-screen, away from the stage)
      const ax = hx + (k - 1.5) * hr * .45;
      paint(ribbon([[ax, hy - hr * .85], [ax + (k - 1.5) * 8, hy - hr * (1.1 + .3 * blow)], [ax + (k - 1.5) * 16, hy - hr * (1.35 + .6 * blow)]], 18, 2), { wash: LN.head, ink: null });
    }
    pop();
    if (o.phones && hash(i * 5.7) > .55) {   // a phone held up, its screen glowing
      const px = hx + (hash(i) - .5) * 60, py = hy - hr * 1.2;
      paint(rrPts(px - 26, py - 44, 52, 88, 8), { wash: LN.phoneDk, ink: null });
      paint(rrPts(px - 21, py - 38, 42, 74, 6), { wash: LN.phone, washOp: 200, ink: null });
      glow(px, py, 70, '#BFE0FF', .35);
    }
  }
}
// Mum from behind, a little bigger than the rest, her phone held up in both hands. o: wobble (the phone shakes), wipe 0..1
// (her left hand leaves the phone to wipe a tear), cheer
function mum(x, y, o = {}) {
  push(); translate(x, y); scale(.8); translate(-x, -y);
  const wob = o.wobble || 0, wipe = clamp(o.wipe || 0), sh = Math.sin(T * 40) * 10 * wob;
  boilSeed('mum');
  paint(ellPts(x, y + 90, 170, 110, 22), { wash: LN.mumSari, ink: null });            // shoulders, a sari pallu
  paint(ribbon([[x - 120, y + 20], [x - 160, y + 110], [x - 150, y + 200]], 60, 80), { wash: '#4A3658', ink: null });
  paint(ellPts(x, y - 70, 82, 88, 22), { wash: LN.head, ink: null });                   // head, hair in a bun
  paint(ellPts(x + 10, y - 150, 42, 36, 14), { wash: LN.head, ink: null });
  inkLine([[x - 20, y - 160], [x + 40, y - 140]], 3, '#E8B04A', 'ink', .3);            // a gold hair pin
  const px = x + 60 + sh, py = y - 260 + Math.cos(T * 37) * 6 * wob;
  for (const s of [-1, 1]) {   // forearms up to the phone (the left one leaves to wipe a tear)
    const hx = s < 0 ? lerp(px - 30, x - 40, wipe) : px + 30, hy = s < 0 ? lerp(py + 30, y - 90, wipe) : py + 30;
    paint(ribbon([[x + s * 110, y + 40], [lerp(x + s * 110, hx, .5) + s * 20, lerp(y + 40, hy, .5)], [hx, hy]], 44, 34), { wash: '#4A3658', ink: null });
    paint(ellPts(hx, hy, 24, 26, 10), { wash: '#8A5A44', ink: null });
  }
  paint(rrPts(px - 52, py - 92, 104, 184, 14), { wash: LN.phoneDk, ink: null });
  paint(rrPts(px - 44, py - 82, 88, 164, 10), { wash: LN.phone, washOp: 230, ink: null });
  glow(px, py, 140, '#BFE0FF', .5);
  if (o.onScreen) { push(); translate(px, py); o.onScreen(); pop(); }
  pop();
}

// ---------- the bedroom ----------
// o: warm 0..1 (the room lit gold), gold 0..1 (the book's magic light), window [x, y, w, h], lampX, lampY, lampOn
function roomSet(t, o = {}) {
  const warm = o.warm || 0, gold = o.gold || 0, [wx, wy, ww, wh] = o.window || [700, 460, 300, 420];
  const wall = mixCol(mixCol(LN.wall, LN.wallWarm, warm * .7), '#D8A860', gold * .35);
  boilSeed('wall');
  paint(rectPts(-900, -600, W + 1800, 2160), { wash: wall, ink: null });
  for (let i = -5; i < 12; i++) inkLine([[i * 150 + 30, -600], [i * 150 + 30, 1560]], .9, mixCol(wall, LN.ink, .2), 'inkfine', .08);   // the wallpaper stripes
  boilSeed('floor');
  paint(rectPts(-900, 1560, W + 1800, 900), { wash: mixCol(LN.floor, LN.floorWarm, warm * .6 + gold * .2), ink: null });
  inkLine([[-900, 1560], [W + 900, 1560]], 1.6, LN.ink, 'ink', 0);
  for (let i = 0; i < 6; i++) inkLine([[-900, 1600 + i * i * 14], [W + 900, 1596 + i * i * 14]], .8, LN.ink, 'inkfine', .08);
  boilSeed('rug');
  paint(ellPts(260, 1700, 420, 90, 30), { wash: LN.rug, fill: '#6A2A38', fillOp: 60, tex: .5, ink: LN.ink, sw: 1.2 });
  paint(ellPts(260, 1700, 330, 60, 30), { wash: LN.rugLt, washOp: 150, ink: null });
  // the window: the night, a moon, stars (o.stars brightens them for the sparkle match)
  boilSeed('wsky');
  paint(rectPts(wx, wy, ww, wh), { wash: LN.night, ink: null });
  paint(rectPts(wx, wy + wh * .55, ww, wh * .45), { wash: LN.nightLt, washOp: 160, ink: null });
  glow(wx + ww * .72, wy + wh * .22, 130, '#DCE4FF', .4); paint(ellPts(wx + ww * .72, wy + wh * .2, 34, 34, 20), { wash: LN.moon, ink: null });
  for (let i = 0; i < 9; i++) { const sx = wx + 20 + hash(i * 3.1) * (ww - 40), sy = wy + 20 + hash(i * 1.3) * wh * .6, r = 6 * (.6 + .4 * Math.sin(T * 2 + i)) * (1 + (o.stars || 0)); paint(starPts(sx, sy, r, .3, 4), { wash: LN.star, ink: null }); if (o.stars) glow(sx, sy, 30 * o.stars, '#FFE6A0', .5); }
  if (o.windowOpen) {   // the panes swing open (the roar)
    const k = o.windowOpen;
    boilSeed('panes');
    for (const s of [-1, 1]) { const hx = s < 0 ? wx : wx + ww, pw = ww / 2 * Math.cos(k * 1.2); paint([[hx, wy], [hx - s * pw, wy - 20 * k], [hx - s * pw, wy + wh + 20 * k], [hx, wy + wh]], { wash: '#9AB0D8', washOp: 120, ink: LN.ink, sw: 1.4 }); }
  }
  boilSeed('wframe');
  for (const r of [[wx - 22, wy - 22, ww + 44, 22], [wx - 36, wy + wh, ww + 72, 26], [wx - 22, wy - 22, 22, wh + 22], [wx + ww, wy - 22, 22, wh + 22], [wx + ww / 2 - 7, wy, 14, wh], [wx, wy + wh / 2 - 7, ww, 14]])
    paint(rectPts(...r), { wash: LN.woodLt, ink: LN.ink, sw: 1.1 });
  // the lamp on its nightstand (o.lampX, lampY = the shade's centre); the bulb lights the room
  const lx = o.lampX ?? 960, ly = o.lampY ?? 1060, sway = o.lampSway || 0;
  boilSeed('stand');
  paint(rectPts(lx - 110, ly + 170, 220, 330), { wash: LN.wood, fill: LN.woodDk, fillOp: 60, tex: .5, ink: LN.ink, sw: 1.3 });
  paint(rectPts(lx - 125, ly + 160, 250, 24), { wash: LN.woodLt, ink: LN.ink, sw: 1.2 });
  inkLine([[lx - 60, ly + 300], [lx + 60, ly + 300]], 1.2, LN.woodDk, 'inkfine', 0);
  push(); translate(lx, ly + 160); rotate(sway * .2); translate(-lx, -(ly + 160));
  paint(ribbon([[lx, ly + 160], [lx, ly + 40]], 18, 14), { wash: LN.shadeDk, ink: LN.ink, sw: 1 });
  if (o.lampOn !== false) glow(lx, ly + 20, 380, '#FFC870', .55 * (o.lampA ?? 1));
  paint([[lx - 70, ly - 60], [lx + 70, ly - 60], [lx + 105, ly + 50], [lx - 105, ly + 50]], { wash: LN.shade, fill: LN.shadeDk, fillOp: 50, tex: .5, ink: LN.ink, sw: 1.3, curv: .1 });
  pop();
}
// The shelf on the wall at (x, y) (its board's top-left), with a row of books; o.glow 0..1 lights the one at index
// o.hero, o.gone hides it (it flew off), o.slide (0..1) pulls it out. Returns the hero book's [cx, cy, w, h].
function shelf(x, y, o = {}) {
  const cols = ['#5E8AC8', '#8EC07A', '#D9643A', '#E8C060', '#9A6AC0', '#E88A9A', '#4AA0A0'], hero = o.hero ?? 2;
  let bx = x + 20, heroAt = null;
  for (let i = 0; i < cols.length; i++) {
    const w = 34 + 10 * hash(i * 2.3), h = 120 + 40 * hash(i * 4.1), lean = i === cols.length - 1 ? .2 : 0;
    if (i === hero) heroAt = [bx + w / 2, y - h / 2, w, h];
    if (i === hero && o.gone) { bx += w + 4; continue; }
    const pull = i === hero ? (o.slide || 0) * 26 : 0;
    boilSeed('sb' + i);
    if (i === hero && o.glow) glow(bx + w / 2, y - h / 2, 140, '#FFD87A', o.glow);
    push(); translate(bx, y); rotate(lean); translate(-bx, -y);
    paint(rectPts(bx, y - h - pull * .3, w, h), { wash: cols[i], ink: LN.ink, sw: 1.1 });
    inkLine([[bx + 6, y - h + 18 - pull * .3], [bx + w - 6, y - h + 18 - pull * .3]], 2, mixCol(cols[i], '#FFF', .5), 'ink', 0);
    pop();
    bx += w + 4;
  }
  boilSeed('shelfboard');
  paint(rectPts(x, y, 340, 22), { wash: LN.woodLt, ink: LN.ink, sw: 1.2 });
  for (const s of [40, 300]) paint([[x + s, y + 22], [x + s + 14, y + 22], [x + s + 7, y + 60]], { wash: LN.wood, ink: LN.ink, sw: 1 });
  return heroAt;   // the hero book's centre, width and height
}
// The bed seen from its foot: (o.x, o.y) the front edge of the mattress at its middle, o.w its width
function bed(o = {}) {
  const x = o.x ?? 540, y = o.y ?? 1300, w = o.w ?? 860, warm = o.warm || 0;
  boilSeed('headboard');
  paint(rrPts(x - w * .5, y - 560, w, 420, 40), { wash: LN.wood, fill: LN.woodDk, fillOp: 60, tex: .5, ink: LN.ink, sw: 1.5 });
  paint(rrPts(x - w * .5 + 40, y - 520, w - 80, 340, 30), { wash: LN.woodLt, washOp: 120, ink: null });
  for (const s of [-1, 1]) paint(rrPts(x + s * w * .5 - 30, y - 640, 60, 700, 20), { wash: LN.wood, ink: LN.ink, sw: 1.4 });   // the posts
  boilSeed('mattress');
  paint(rrPts(x - w * .5 + 10, y - 200, w - 20, 200, 30), { wash: mixCol(LN.sheet, '#FFE8C8', warm * .5), ink: LN.ink, sw: 1.3 });   // the top of the bed
  paint(rrPts(x - w * .5 + 70, y - 260, 280, 120, 50), { wash: LN.pillow, ink: LN.ink, sw: 1.2 });
  paint(rrPts(x - w * .5, y - 10, w, 150, 20), { wash: mixCol(LN.sheet, '#FFE8C8', warm * .5), fill: LN.sheetDk, fillOp: 60, tex: .5, ink: LN.ink, sw: 1.4 });   // the front face
  paint(rectPts(x - w * .5 + 10, y + 140, w - 20, 70), { wash: LN.wood, ink: LN.ink, sw: 1.3 });
  for (const s of [-1, 1]) paint(rectPts(x + s * (w * .5 - 30) - 22, y + 140, 44, 130), { wash: LN.woodDk, ink: LN.ink, sw: 1.2 });
}

// ---------- the costume ----------
// The paper mane: a ring of petal-shaped paper cut-outs round (cx, cy), s = Aarav's u. o: puff 0..1 (bristles out),
// droop 0..1 (they hang), lost [indices] (fallen off), flat 0..1 (squashed: lying in his lap), wind [dx, dy], spin, key
function mane(cx, cy, s, o = {}) {
  const N = 16, puff = clamp(o.puff || 0, 0, 1.4), droop = clamp(o.droop || 0), flat = o.flat || 0, key = o.key || 'mane';
  const lost = o.lost || [], [wdx, wdy] = o.wind || [0, 0];
  boilSeed(key);
  for (let i = 0; i < N; i++) {
    if (lost.includes(i)) continue;
    let a = i / N * TAU - Math.PI / 2 + (o.spin || 0);
    const len = s * (2.2 + .9 * puff - .5 * droop) * (1 + .12 * hash(i * 3.7)), wid = s * (1.05 + .2 * puff);
    // droop pulls each petal toward hanging straight down; puff makes them shiver
    const dn = Math.PI / 2, da = Math.atan2(Math.sin(dn - a), Math.cos(dn - a));
    a += da * droop * .55 + Math.sin(T * 30 + i) * .05 * puff;
    const r0 = s * 3.2, bx = cx + Math.cos(a) * r0, by = cy + Math.sin(a) * r0 * (1 - flat * .6);
    const tx = bx + Math.cos(a) * len + wdx * s * hash(i * 1.9), ty = by + Math.sin(a) * len * (1 - flat * .6) + wdy * s * hash(i * 2.9) + droop * s * .6;
    const nx = -Math.sin(a) * wid * .5, ny = Math.cos(a) * wid * .5;
    paint([[bx + nx, by + ny], [lerp(bx, tx, .55) + nx * 1.15, lerp(by, ty, .55) + ny * 1.15], [tx, ty], [lerp(bx, tx, .55) - nx * 1.15, lerp(by, ty, .55) - ny * 1.15], [bx - nx, by - ny]],
      { wash: LN.paper[i % 4], ink: LN.ink, sw: clamp(s / 22, .4, 2) * .8, curv: .5 });
    inkLine([[lerp(bx, tx, .15), lerp(by, ty, .15)], [lerp(bx, tx, .7), lerp(by, ty, .7)]], clamp(s / 22, .4, 2) * .45, LN.paperDk, 'inkfine', 0);   // the paper's crease
  }
}
// One loose petal at (x, y), angle a (a falling one)
function loosePetal(x, y, s, a, i = 0, key = 'petal') {
  boilSeed(key);
  const len = s * 2.3, wid = s * 1.05, ca = Math.cos(a), sa = Math.sin(a);
  const P = [[0, -wid * .5], [len * .55, -wid * .58], [len, 0], [len * .55, wid * .58], [0, wid * .5]].map(([px, py]) => [x + px * ca - py * sa - len * .5 * ca, y + px * sa + py * ca - len * .5 * sa]);
  paint(P, { wash: LN.paper[i % 4], ink: LN.ink, sw: clamp(s / 22, .4, 2) * .8, curv: .5 });
}
// A petal falling like paper: it seesaws down from (x0, y0) to the floor at fy over dur seconds; age = time since it fell
function fallingPetal(x0, y0, fy, s, age, dur = 1.4, i = 0, key = 'fall') {
  if (age < 0) return;
  const k = clamp(age / dur), y = lerp(y0, fy, easeIn(k) * .4 + k * .6), x = x0 + Math.sin(age * 5.5) * s * 2.2 * (1 - k * .3) + age * s * .6;
  loosePetal(x, y, s, Math.sin(age * 5.5 + 1.2) * .7 + (k >= 1 ? 0 : 0), i, key);
}
// The headband with two round paper ears: a hat hook for aarav() (head space: the head's centre is (0, -16))
function maneEars(o = {}) {
  return (u, sw) => {
    const d = o.droop || 0, p = o.puff || 0;
    for (const s of [-1, 1]) {
      const ex = s * (2.35 + .2 * p), ey = -19.35 + d * .5, r = 1.05 + .15 * p;
      push(); translate(ex * u, ey * u); rotate(s * d * .5);
      paint(ellPts(0, 0, r * u, r * .95 * u, 16), { wash: LN.paper[0], ink: LN.ink, sw: sw * .8 });
      paint(ellPts(0, .1 * u, r * .55 * u, r * .5 * u, 12), { wash: '#FFC6A0', ink: null });
      pop();
    }
    paint(U(ribbon([[-3.3, -16.6], [-2.4, -18.8], [0, -19.75], [2.4, -18.8], [3.3, -16.6]], .55, .55), u), { wash: LN.band, ink: LN.ink, sw: sw * .7 });
  };
}
// The yarn tail from the hip (x, y), curling out to the side o.dir (-1 left, default; 1 right); s = his u. o: wiggle
// (radians), bell 0..1 (the tiny bell's pop), bellGlow, key. Returns the tip [x, y] (where the bell hangs).
function tail(x, y, s, o = {}) {
  const w = o.wiggle || 0, sway = Math.sin(T * 2.6) * .08 + w, d = -(o.dir || -1);
  const pts = [[0, 0], [-1.6, 1.2], [-3.0, 1.0 - sway * 4], [-3.9, -.4 - sway * 6]].map(([a, b]) => [x + d * a * s, y + b * s]);
  boilSeed(o.key || 'tail');
  paint(ribbon(pts, .55 * s, .45 * s), { wash: LN.yarn, ink: LN.ink, sw: clamp(s / 22, .4, 2) * .7 });
  inkLine(through(pts).filter((_, i) => i % 2 === 0), clamp(s / 22, .4, 2) * .4, LN.yarnDk, 'inkfine', .5);
  const tip = pts[3];
  for (let k = 0; k < 7; k++) {   // the tuft
    const a0 = -Math.PI / 2 - .9 + k * .3 + sway, a = d > 0 ? a0 : Math.PI - a0, l = s * (.9 + .3 * hash(k));
    paint(ribbon([tip, [tip[0] + Math.cos(a) * l * .5, tip[1] + Math.sin(a) * l * .5], [tip[0] + Math.cos(a) * l, tip[1] + Math.sin(a) * l]], .35 * s, .1 * s), { wash: k % 2 ? LN.yarn : LN.yarnDk, ink: null });
  }
  if (o.bell) tinyBell(tip[0], tip[1] + .6 * s, s * .9 * backOut(clamp(o.bell)), { glow: o.bellGlow || 0, swing: Math.sin(T * 5) * .2 + w * 2, key: (o.key || 'tail') + 'bell' });
  return tip;
}
// A tiny gold bell hanging from (x, y); s = size unit (its height is about 1.4s)
function tinyBell(x, y, s, o = {}) {
  if (s < .5) return;
  boilSeed(o.key || 'tbell');
  if (o.glow) glow(x, y + s * .8, s * 4, '#FFE08A', o.glow);
  push(); translate(x, y); rotate(o.swing || 0);
  inkLine([[0, 0], [0, s * .35]], clamp(s / 14, .4, 2), LN.ink, 'inkfine', 0);
  paint([[-s * .3, s * .4], [s * .3, s * .4], [s * .62, s * 1.25], [-s * .62, s * 1.25]], { wash: TK.gold, ink: LN.ink, sw: clamp(s / 14, .4, 2), curv: .5 });
  paint(ellPts(0, s * 1.33, s * .18, s * .14, 8), { wash: TK.goldDk, ink: null });
  paint(ellPts(-s * .2, s * .75, s * .1, s * .2, 8), { wash: TK.goldLt, ink: null });
  pop();
}
// A painted book at (x, y) (its centre), w × h. o: open 0..1 (0 shut, seen face-on; 1 lying open, pages up and
// foreshortened), rot, glow, cover (draw nothing on the board: a picture() goes there), key
function bookShut(x, y, w, h, o = {}) {
  const op = clamp(o.open || 0);
  boilSeed(o.key || 'book');
  push(); translate(x, y); rotate(o.rot || 0);
  if (o.glow) glow(0, 0, w * 1.4, '#FFD87A', o.glow);
  if (op < .5) {
    const sh = 1 - op * 1.2;   // it tips back as it opens
    paint(rrPts(-w / 2 - 6, -h / 2 * sh - 6, w + 12, h * sh + 12, 8), { wash: LN.bookDk, ink: LN.ink, sw: 1.4 });
    paint(rrPts(-w / 2, -h / 2 * sh, w, h * sh, 6), { wash: LN.book, ink: LN.ink, sw: 1.1 });
  } else {
    const k = (op - .5) * 2, ph = h * .55, pw = w * lerp(.5, 1, k);
    for (const s of [-1, 1]) {
      paint([[0, -ph / 2 + 8], [s * pw, -ph / 2], [s * pw * 1.02, ph / 2], [0, ph / 2 + 8]], { wash: LN.bookDk, ink: LN.ink, sw: 1.3 });
      paint([[0, -ph / 2 + 2], [s * pw * .95, -ph / 2 - 6], [s * pw * .97, ph / 2 - 8], [0, ph / 2 + 2]], { wash: LN.pages, ink: LN.ink, sw: 1, curv: .1 });
      for (let i = 1; i < 4; i++) inkLine([[s * pw * .15, -ph / 2 + i * ph / 4.2], [s * pw * .8, -ph / 2 + i * ph / 4.2 - 4]], .8, '#C8B898', 'inkfine', 0);
    }
  }
  pop();
}
// The magic stream: a tapering gold ribbon of light along pts (world), k 0..1 its strength
function beam(pts, w, k, key = 'beam') {
  if (k <= .01) return;
  boilSeed(key);
  for (const p of pts) glow(p[0], p[1], w * 1.4, '#FFD87A', .45 * k);
  paint(ribbon(pts, w * k, w * .25 * k), { wash: LN.goldLt, washOp: 210 * k, ink: null });
  paint(ribbon(pts, w * .45 * k, w * .1 * k), { wash: '#FFFDF2', washOp: 230 * k, ink: null });
}
// Marigold petals spiralling round (cx, cy), radius r; k 0..1 the swirl's strength (petals spin out as it rises)
function petalSwirl(cx, cy, r, t, k, key = 'swirl', n = 14) {
  if (k <= .02) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const a = t * (2.2 + hash(i) * 1.5) + i / n * TAU, rr = r * (.4 + .7 * hash(i * 3.1)), y = cy + (hash(i * 7.7) - .5) * r * 1.6 - frac(t * .3 + hash(i)) * r * .3;
    const x = cx + Math.cos(a) * rr, sz = 14 * (.6 + .6 * hash(i * 2.2)) * k;
    paint(ellPts(x, y + Math.sin(a) * rr * .25, sz, sz * .55, 10, 0, a), { wash: i % 3 ? TK.marigold : TK.yellow, washOp: 230 * k, ink: null });
  }
}
// Sound made visible: rings spreading from (x, y); age = since the sound, life in s
function shockRings(x, y, age, o = {}) {
  const life = o.life ?? .9, n = o.n ?? 3, r0 = o.r ?? 120, key = o.key || 'rings', col = o.col || LN.goldLt;
  if (age < 0 || age > life + n * .12) return;
  boilSeed(key);
  for (let i = 0; i < n; i++) {
    const a = age - i * .12; if (a < 0 || a > life) continue;
    const k = a / life, r = r0 * ((o.from ?? .3) + 2.4 * easeOut(k)), e = ellPts(x, y, r, r * (o.flatten ?? .85), 36);
    inkLine([...e, e[0], e[1]], (o.w ?? 10) * (1 - k), col, 'ink', .5);
  }
}
// The lion of the ROAR: a big golden lion's head over Aarav, mouth open; k 0..1 its presence, jaw 0..1, s = size unit
function lionSpirit(x, y, s, k, jaw = 1, key = 'spirit') {
  if (k <= .02) return;
  boilSeed(key);
  glow(x, y, s * 9, '#FFC24A', .7 * k);
  push(); translate(x, y); scale(.85 + .15 * k);
  paint(starPts(0, 0, 6.2 * s, .72, 18, T * .3), { wash: LN.lionDk, washOp: 170 * k, ink: null, curv: .5 });
  paint(starPts(0, 0, 5.2 * s, .75, 16, -T * .2), { wash: LN.lion, washOp: 150 * k, ink: null, curv: .5 });
  paint(ellPts(0, .3 * s, 3.2 * s, 3.1 * s, 26), { wash: '#FFE08A', washOp: 190 * k, ink: null });
  for (const sx of [-1, 1]) {
    paint(ellPts(sx * 2.5 * s, -2.6 * s, .8 * s, .8 * s, 12), { wash: '#FFE08A', washOp: 190 * k, ink: null });
    paint(ribbon([[sx * 1.9, -.9], [sx * 1.2, -.5], [sx * .6, -.8]].map(([a, b]) => [a * s, b * s]), .5 * s, .25 * s), { wash: '#8A4A12', washOp: 200 * k, ink: null });   // fierce eyes
  }
  paint(ellPts(0, 1.8 * s, 1.5 * s, (.5 + 1.3 * jaw) * s, 18), { wash: '#8A2A1A', washOp: 200 * k, ink: null });
  for (const sx of [-1, 1]) paint([[sx * 1.2 * s, (1.4 - .2 * jaw) * s], [sx * .8 * s, (1.4 - .2 * jaw) * s], [sx * 1.0 * s, (2.1 + .2 * jaw) * s]], { wash: '#FFF8EC', washOp: 220 * k, ink: null });
  paint([[-.55 * s, .5 * s], [.55 * s, .5 * s], [0, 1.0 * s]], { wash: '#8A4A12', washOp: 200 * k, ink: null });
  pop();
}

// ---------- the demon kid's costume ----------
// Buffalo horns on a headband: a hat hook. o.pop 0..1 throws them up and off (a spin, then gone), o.wob
function hornsHat(o = {}) {
  return (u, sw) => {
    const p = clamp(o.pop || 0);
    if (p >= 1) return;
    push(); translate(0, -p * 9 * u + p * p * 2 * u); rotate(p * 5);
    for (const s of [-1, 1]) paint(U([[s * 2.4, -19.0], [s * 3.7, -19.9], [s * 4.8, -21.8], [s * 4.3, -19.2], [s * 3.0, -18.2]], u), { wash: LN.horn, fill: LN.hornDk, fillOp: 60, tex: .5, ink: LN.ink, sw: sw * .7, curv: .5 });
    paint(U(ribbon([[-3.2, -17.0], [-2.3, -18.9], [0, -19.7], [2.3, -18.9], [3.2, -17.0]], .5, .5), u), { wash: '#4A3A30', ink: LN.ink, sw: sw * .6 });
    pop();
  };
}
// A cardboard sword with a foil blade, held at (0, 0) pointing along angle a
function cardSword(u, sw, a) {
  push(); rotate(a);
  paint(U([[-.3, -.4], [5.4, -.35], [6.2, 0], [5.4, .35], [-.3, .4]], u), { wash: LN.foil, fill: '#AAB8C8', fillOp: 50, tex: .5, ink: LN.ink, sw: sw * .7 });
  paint(U([[-.15, -1.0], [.25, -1.0], [.25, 1.0], [-.15, 1.0]], u), { wash: LN.sword, ink: LN.ink, sw: sw * .6 });
  paint(U([[-1.5, -.28], [-.15, -.28], [-.15, .28], [-1.5, .28]], u), { wash: LN.swordDk, ink: LN.ink, sw: sw * .6 });
  pop();
}

// ---------- the card ----------
// The three covers fanned (Book 3 in front, the hero), the price, the logo, the pill, follow.
function lionCard(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 490, CY = 905, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.row) [['book1', -1], ['book2', 1]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.row - j * .12);
    if (a > 0) picture(PICS[b], X + i * 215, CY + 25, 290, 290, { rot: i * .1 - br, pop: a * 5, r: 8, shadow: 18 });
  });
  if (t > C.cover) picture(PICS.book3, X, CY, 390, 390, { rot: -.02 + br, pop: pk(C.cover), r: 10, shadow: 26 });
  if (t > C.cover + .15) letter('Book 3 · Chandraghanta, The Fierce Protector', X, 1132, 34, TK.brown, { screen: true, font: '500 36px Poppins', ink: false, maxW: 860, pop: pk(C.cover + .15) });
  if (t > C.price) {
    letter('OUT NOW: Books 1–3', X, 1206, 46, TK.brown, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price) });
    letter('Set of 3 for ₹500', X, 1270, 40, TK.rkOrange, { screen: true, font: '700 52px Poppins', ink: false, maxW: 860, pop: pk(C.price + .12) });
  }
  if (t > C.logo) picture(PICS.logo, X, 548, 150, 150, { pop: pk(C.logo) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1368); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1370, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter("Follow @therishikatha for Aarav's next adventure", X, 1452, 32, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
