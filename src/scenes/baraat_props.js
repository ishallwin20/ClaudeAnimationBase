// baraat_props.js: the sets and props for "The SCARIEST baraat in history" (src/scenes/baraat.js). Loaded before it;
// everything here is a pure function of its arguments (and T for boil).
//
//   Copied from ad 5 (aparna_props.js): TK, endCard (now with a centre book, sides and lines), sparkStar,
//     vanishPuff, sparkleBurst, fallingPetals, whipH, veil, garland
//   BRT                                         the palette of this reel
//   the ganas (each (x, y) = the ground under it, u its size unit; faces through Clawd's eyes() / mouth()):
//     dholGhost(x, y, u, o)                     #2, the hook ghost: a lilac sheet ghost in a red pagdi with a skull-faced dhol
//     naginImp(x, y, u, o) + cobra(x, y, s, o)  #1, the nagin dancer, and the snake who dances with him
//     foodBhoot(x, y, u, o) + laddooTower(...)  #3, the foodie: a round plum bhoot with a huge mouth
//     selfieGhost(x, y, u, o) + phoneInset(...) #4, the tall sage ghost who isn't in his own selfie
//   badge(x, y, n, age, s)                      the gold number badge of the roll call
//   soundArcs(x, y, age, s, col, dir)           painted ")))" sound marks; bellRings(x, y, age) the bell's gold rings
//   torch(x, y, s, t, key)                      a procession torch
//   palaceSet(S), roadSet(cx), duskSky(...)     the door at night, the road, the plain hook ground
//   glowPoof(x, y, s, age)                      the glow-up cloud; petalSwirl(x, y, u, k, t) the transformation
//   bellPts(cx, cy, r)                          a bell outline (for the iris to the card)
//   weddingSet(t), platform(x, y, w)            the rose-gold wedding morning and the groom's seat
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', white: '#FFF5E2', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  ash: '#8E8890', ashDk: '#5E5862', ashLt: '#BDB7BE', gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const BRT = {
  ink: '#2B2233', night: '#3B2F66', dusk: '#4A3F78', duskLt: '#6A5C9A', hill: '#33285A', road: '#6E5A80', roadLt: '#8A759A',
  sand: '#D9A877', sandDk: '#B07E55', sandLt: '#EBC596', arch: '#C98F5E', door: '#4A2228', doorLt: '#8A4A30',
  floor: '#A8806A', floorDk: '#86604E',
  ghost: '#B9B6E8', ghostDk: '#8E89C9', ghostLt: '#DCDAF6', pagdi: '#D2283A', pagdiDk: '#9E1A2A',
  dhol: '#B5452E', dholDk: '#7E2A1C', skin: '#F5E6C8', skinDk: '#D9C29A', rope: '#F3E2BC', stick: '#7A4A2A',
  imp: '#6FC2A8', impDk: '#4A9A82', impLt: '#A8E2CC', horn: '#F5E6C8', dhoti: '#F39A2B', dhotiDk: '#C8701A',
  cobra: '#5E9A6A', cobraDk: '#3E6E4A', cobraLt: '#B9DCA0',
  bhoot: '#8A4FA0', bhootDk: '#643578', bhootLt: '#B07CC2', mouth: '#3A1530', tongue: '#E8708C',
  laddoo: '#F2A93B', laddooDk: '#C97E1F', plate: '#E8B23C',
  sage: '#A9BFA4', sageDk: '#7E9878', sageLt: '#D2E2CC', phone: '#2B2233',
  rose: '#F6C1A8', roseLt: '#FCE2C8', roseDk: '#E8A98C', silk: '#C8324A',
};

// ---------- copied from ad 5 ----------
function sparkStar(x, y, r, key = 'spark', col = TK.goldLt) {
  if (r < 1) return;
  boilSeed(key);
  glow(x, y, r * 2.4, col, .8);
  paint(starPts(x, y, r, .22, 4), { wash: TK.cream, ink: null });
}
// The Rishi Katha end card: C = { book, fan, logo, series, sub, pill, follow } (times); centre / sides = PICS keys;
// L = { series, sub, follow } (the lines).
function endCard(t, C, centre, sides, L) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 508, BY = 872, fan = backOut(seg(t, C.fan, C.fan + .45)), br = Math.sin(t * 1.3) * .008;
  const pk = t0 => Math.max(0, t - t0) * 5;
  if (t > C.fan - .02) {
    picture(PICS[sides[0]], lerp(X, 300, fan), BY + 6, 400, 400, { rot: -.12 * fan + br, r: 10, shadow: 22 });
    picture(PICS[sides[1]], lerp(X, 716, fan), BY + 6, 400, 400, { rot: .12 * fan - br, r: 10, shadow: 22 });
  }
  if (t > C.book) picture(PICS[centre], X, BY, 470, 470, { rot: -br * .5, pop: pk(C.book), r: 10, shadow: 28 });
  if (t > C.logo) picture(PICS.logo, X, 512, 170, 170, { pop: pk(C.logo) });
  if (t > C.series) letter(L.series, X, 1180, 70, TK.teal, { screen: true, font: '70px Marcellus', ink: false, maxW: 900, pop: pk(C.series) });
  if (t > C.sub) letter(L.sub, X, 1252, 38, TK.brown, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.sub) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1352); scale(k); paint(rrPts(-220, -46, 440, 92, 45), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1354, 52, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter(L.follow, X, 1444, 38, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 820, pop: pk(C.follow) });
}
function vanishPuff(x, y, s, age, key = 'puff', cols = ['#FFF3D6', '#FFE08A']) {
  if (age < 0 || age > .6) return;
  const k = age / .6; boilSeed(key);
  glow(x, y, s * 1.7 * (1 - k * .4), '#FFE39A', .75 * (1 - k));
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + hash(i) * .6, d = s * (.15 + .8 * easeOut(k)) * (.7 + .4 * hash(i * 3)), r = s * (.2 + .15 * hash(i * 1.7)) * (1 + .5 * k);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 - k * s * .35, r, r * .9, 10, 1), { wash: cols[i % 2], washOp: 235 * (1 - k * k), ink: null });
  }
}
function sparkleBurst(x, y, s, age, key = 'burst', n = 8) {
  if (age < 0 || age > .8) return;
  const k = age / .8; boilSeed(key);
  glow(x, y, s * (1 + k), '#FFE39A', .6 * (1 - k));
  for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i) * .5, d = s * (.3 + 1.1 * easeOut(k)) * (.7 + .5 * hash(i * 2.1)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d - k * s * .2, s * .22 * (1 - k * .8) * (.6 + hash(i * 5)), .3, 4), { wash: i % 2 ? TK.cream : TK.goldLt, ink: null }); }
}
function fallingPetals(t, a = 1, n = 26) {
  if (a <= .02) return;
  boilSeed('petals');
  for (let i = 0; i < n; i++) {
    const x = W * frac(hash(i * 3.3) + .05 * Math.sin(t * .8 + i * 1.3)), y = (H + 100) * frac(hash(i * 7.1) + t * (.09 + .05 * hash(i * 1.9))) - 50, r = t * 1.6 + i, s = 12 + 9 * hash(i * 2.2);
    paint([[x + Math.cos(r) * s, y + Math.sin(r) * s], [x + Math.cos(r + 1.6) * s * .5, y + Math.sin(r + 1.6) * s * .5], [x - Math.cos(r) * s, y - Math.sin(r) * s], [x + Math.cos(r - 1.6) * s * .5, y + Math.sin(r - 1.6) * s * .5]], { wash: i % 3 === 0 ? '#FFD27A' : i % 3 === 1 ? TK.petal : TK.petalDk, washOp: 235 * a, ink: null, curv: .5 });
  }
}
// Horizontal speed streaks for a whip pan: k 0..1 strength, dir ±1.
function whipH(k, dir = 1, t = 0, cols = [TK.cream, '#D9CCF2']) {
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
// A marigold garland between two points (sagging), or (b = null) hanging in a loop from one point. cols: flowers.
function garland(a, b, sag, key = 'garl', fr = 15, cols = ['#F39A2E', '#F7B845', '#D0701A']) {
  const pts = [];
  if (b) for (let i = 0; i <= 20; i++) { const k = i / 20; pts.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k) + sag * 4 * k * (1 - k)]); }
  else for (let i = 0; i <= 24; i++) { const th = -Math.PI / 2 + i / 24 * TAU; pts.push([a[0] + Math.cos(th) * sag * .24, a[1] + sag * .5 + Math.sin(th) * sag * .5]); }
  boilSeed(key + 'thread');
  inkLine(pts, 1.6, '#6E7B3A', 'ink', .3);
  let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const n = b ? Math.max(7, Math.round(L / (fr * 1.6))) : 15;
  for (let i = 0; i < n; i++) {
    const p = pts[Math.round((i + .5) / n * (pts.length - 1))];
    boilSeed(key + 'f' + i);
    paint(starPts(p[0], p[1], fr * (.9 + .15 * hash(i * 2.3)), .8, 9, hash(i) * 3), { wash: cols[i % 2], fill: cols[2], fillOp: 70, tex: .4, ink: BRT.ink, sw: .6, curv: .5 });
    paint(ellPts(p[0], p[1], fr * .32, fr * .32, 8), { wash: cols[2], ink: null });
  }
}

// ---------- shared bits ----------
// Clawd's eyes / mouth on a gana's face: eyes centred at (0, ey) with spacing 2.5u·k; mouth at (0, my) scaled m.
function ganaFace(u, o, sw, ey, k, my, m) {
  push(); translate(0, ey * u); scale(k); translate(0, 6 * u); eyes(u, o, sw / k * .85, [-1, 1], 0); pop();
  if (o.mouth) { push(); translate(0, my * u); scale(m); translate(0, 4.3 * u); mouth(u, o.mouth, sw / m * .8); pop(); }
}
function ganaEmote(o, x, y, u, top) {
  if (!o.emote) return;
  emote(o.emote, x, y, u * 1.1, o.emoteK ?? 1, o.emoteAge ?? T);
}
// A wavy ghost tail: the bottom edge from (x1, y) to (x0, y), n scallops, its tips moving with phase ph.
function ghostHem(x0, x1, y, n, ph, amp) {
  const p = []; for (let i = 0; i <= n * 6; i++) { const k = i / (n * 6), x = lerp(x1, x0, k); p.push([x, y + amp * (.5 + .5 * Math.cos(k * n * TAU + ph))]); } return p;
}

// ---------- #2 the dhol-wala: the hook ghost ----------
// o: dy, sq, rot, hit 0..1 (the big stick comes down onto the drumhead), hitL 0..1 (the thin stick), sticksUp 0..1
// (both sticks held high: the freeze), bow 0..1, eyes / mouth / blush / lookX / seed / emote, dhol (default true)
function dholGhost(x, y, u, o = {}) {
  const key = o.key || 'dhol', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = BRT.ink, P = pts => U(pts, u);
  const fl = .9 + .35 * Math.sin(T * 2.6 + (o.seed || 0)), bow = clamp(o.bow || 0);
  rs('shadow'); paint(ellPts(x, y + u * .1, u * 4.4 * (1 - .1 * fl), u * .7, 18), { fill: PAL.ink, fillOp: 60, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y - fl * u + (o.dy || 0) * u); rotate((o.rot || 0) - bow * .5); scale(1 + (o.sq || 0) * .6, 1 - (o.sq || 0));
  // the body: a dome and a wavy hem, one outline
  rs('body');
  const dome = []; for (let i = 0; i <= 18; i++) { const a = Math.PI + i / 18 * Math.PI; dome.push([Math.cos(a) * 4.6 * u, -10 * u + Math.sin(a) * 4.8 * u]); }
  const body = [...dome, [4.8 * u, -6 * u], [5 * u, -2 * u], ...ghostHem(-5 * u, 5 * u, -2 * u, 4, T * 6, -1.1 * u).map(([a, b]) => [a, b + 1.1 * u]), [-5 * u, -2 * u], [-4.8 * u, -6 * u]];
  paint(body, { wash: BRT.ghost, ink: null, curv: .3 });
  paint(ellPts(-1.6 * u, -11.6 * u, 1.8 * u, 1.2 * u, 14, 0, -.4), { wash: BRT.ghostLt, washOp: 200, ink: null });
  paint(ellPts(2 * u, -3.2 * u, 3 * u, 1.3 * u, 14), { fill: BRT.ghostDk, fillOp: 90, bleed: .1, tex: .5, ink: null });
  paint(body, { ink: INK, sw, curv: .3 });
  // the red bandhani pagdi
  rs('pagdi');
  paint(ellPts(0, -14.9 * u, 3.6 * u, 1.9 * u, 20, u * .05), { wash: BRT.pagdi, ink: INK, sw: sw * .8 });
  paint(P([[-3.7, -14.2], [3.7, -14.2], [3.4, -13.1], [0, -12.8], [-3.4, -13.1]]), { wash: BRT.pagdiDk, ink: INK, sw: sw * .7, curv: .4 });
  for (let i = 0; i < 9; i++) paint(ellPts(lerp(-2.8, 2.8, hash(i * 3.1)) * u, lerp(-16, -13.6, hash(i * 5.3)) * u, .13 * u, .13 * u, 6), { wash: '#FFF5E2', ink: null });
  paint(ribbon(P([[2.6, -15.8], [3.8, -17], [4.5 + Math.sin(T * 5) * .2, -17.8]]), .6 * u, .2 * u), { wash: '#F39A2B', ink: INK, sw: sw * .5 });   // the turra
  // the face
  rs('face');
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.6 * u, -8.7 * u, .9 * u, .5 * u, 12), { fill: PAL.rose, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  ganaFace(u, o, sw, -10, .62, -8.2, .62);
  // the sticks and the little arms (behind the drum's top edge)
  const hit = clamp(o.hit || 0), hitL = clamp(o.hitL || 0), up = clamp(o.sticksUp || 0);
  const hR = [lerp(lerp(4.6, 2.2, hit), 4.4, up), lerp(lerp(-9.6, -6.2, hit), -11.8, up)], hL = [lerp(lerp(-4.8, -3, hitL), -4.6, up), lerp(lerp(-8.6, -6.6, hitL), -11.6, up)];
  rs('arms');
  for (const [s, h, a0] of [[1, hR, lerp(lerp(1.2, -.55, hit), 1.5, up)], [-1, hL, lerp(lerp(-1, 1.2, hitL), -1.4, up)]]) {
    paint(ribbon(P([[s * 4.3, -7], [lerp(s * 4.3, h[0], .5) + s * .5, lerp(-7, h[1], .5)], h]), 1.2 * u, .9 * u), { wash: BRT.ghost, ink: INK, sw: sw * .7 });
    push(); translate(h[0] * u, h[1] * u); rotate(a0);
    if (s > 0) paint(ribbon(P([[0, 0], [-1.5, -.6], [-3, -.2], [-3.6, .5]]), .35 * u, .25 * u), { wash: BRT.stick, ink: INK, sw: sw * .5 });   // the curved dagga
    else inkLine(P([[0, 0], [2.6, -.4]]), sw * 1.4, BRT.stick, 'ink', 0);   // the thin tilli
    paint(ellPts(0, 0, .6 * u, .55 * u, 10), { wash: BRT.ghost, ink: INK, sw: sw * .6 });
    pop();
  }
  // the dhol on its strap, its drumhead to us with a cute skull painted on it
  if (o.dhol !== false) {
    rs('dhol');
    for (const s of [-1, 1]) inkLine(P([[s * 3.2, -6.6], [s * 4.1, -7.6], [s * 4.6, -8.6]]), sw * 1.6, BRT.pagdiDk, 'ink', .5);   // the strap, to his sides
    paint(rrPts(-1.2 * u, -7.1 * u, 5.8 * u, 5.4 * u, 1.6 * u), { wash: BRT.dhol, fill: BRT.dholDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .8 });   // the barrel, running back to the right
    for (let k = 0; k < 6; k++) inkLine(P([[lerp(-.6, 4, k / 6), -6.9], [lerp(-.6, 4, (k + .5) / 6), -1.9]]), sw * .6, BRT.rope, 'inkfine', 0);
    const hp = 1 + .06 * hit;
    paint(ellPts(-.6 * u, -4.4 * u, 2.9 * u * hp, 2.75 * u * hp, 26), { wash: BRT.dholDk, ink: INK, sw: sw * .8 });
    paint(ellPts(-.6 * u, -4.4 * u, 2.55 * u * hp, 2.4 * u * hp, 24), { wash: BRT.skin, ink: INK, sw: sw * .6 });
    // the skull: round sockets, a heart-ish nose, a big toothy grin
    push(); translate(-.6 * u, -4.4 * u); scale(hp);
    for (const s of [-1, 1]) { paint(ellPts(s * .95 * u, -.55 * u, .62 * u, .7 * u, 12), { wash: BRT.ink, ink: null }); paint(ellPts(s * .95 * u - .15 * u, -.75 * u, .17 * u, .17 * u, 6), { wash: '#FFF5E2', ink: null }); }
    paint(P([[0, .05], [.28, .4], [0, .55], [-.28, .4]]), { wash: BRT.ink, ink: null, curv: .4 });
    paint(P([[-1.25, .85], [1.25, .85], [.9, 1.55], [-.9, 1.55]]), { wash: '#FFF5E2', ink: INK, sw: sw * .5, curv: .3 });
    for (const k of [-.6, -.2, .2, .6]) inkLine(P([[k, .9], [k * .9, 1.5]]), sw * .4, BRT.ink, 'inkfine', 0);
    pop();
  }
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x + 5.6 * u, y - fl * u - 15 * u, u * 1.3, o.emoteK ?? 1, o.emoteAge ?? T); }
  boilSeed(`${key} after`);
}

// ---------- #1 the nagin dancer and his cobra ----------
// o: ph (the dance phase), dy, sq, bow 0..1, eyes / mouth / blush / seed / emote
function naginImp(x, y, u, o = {}) {
  const key = o.key || 'imp', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = BRT.ink, P = pts => U(pts, u);
  const ph = o.ph ?? T * 2, sway = Math.sin(ph * TAU) , bow = clamp(o.bow || 0);
  rs('shadow'); paint(ellPts(x, y + u * .1, u * 4.2, u * .75, 18), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, ink: null });
  push(); translate(x + sway * .5 * u, y + (o.dy || 0) * u); rotate(sway * .12 * (1 - bow) + bow * .55); scale(1 + (o.sq || 0) * .6, 1 - (o.sq || 0));
  rs('feet');
  for (const s of [-1, 1]) paint(ellPts(s * 1.6 * u, -.4 * u, 1.2 * u, .55 * u, 12), { wash: BRT.impDk, ink: INK, sw: sw * .7 });
  // the arms, raised over the head with the hands joined into a hood (drawn behind the body)
  rs('arms');
  const hd = [sway * .4, -11.6 + bow * 3];
  for (const s of [-1, 1]) paint(ribbon(P([[s * 3, -6.6], [s * 3.6 + sway * .3, -9.4], [hd[0] + s * .6, hd[1] + .6]]), 1.15 * u, .85 * u), { wash: BRT.imp, ink: INK, sw: sw * .7 });
  paint(P([[hd[0] - 1.3, hd[1] + .6], [hd[0] - 1.1, hd[1] - .6], [hd[0], hd[1] - 1.2], [hd[0] + 1.1, hd[1] - .6], [hd[0] + 1.3, hd[1] + .6], [hd[0], hd[1] + .9]]), { wash: BRT.imp, ink: INK, sw: sw * .7, curv: .5 });
  // the body: a pear with horn nubs, one outline
  rs('body');
  const body = P([[-3.4, -1.2], [-4.2, -3.6], [-3.9, -6.4], [-3, -8.4], [-1.5, -9.4], [0, -9.6], [1.5, -9.4], [3, -8.4], [3.9, -6.4], [4.2, -3.6], [3.4, -1.2], [0, -.8]]);
  for (const s of [-1, 1]) paint(P([[s * 1.2, -9.2], [s * 1.9, -10.9], [s * 2.2, -8.8]]), { wash: BRT.horn, ink: INK, sw: sw * .6, curv: .3 });
  paint(body, { wash: BRT.imp, ink: null, curv: .5 });
  paint(ellPts(0, -4 * u, 2.6 * u, 2.2 * u, 16), { wash: BRT.impLt, washOp: 210, ink: null });
  paint(body, { ink: INK, sw, curv: .5 });
  rs('dhoti');
  paint(P([[-3.85, -3.4], [3.85, -3.4], [3.5, -1.4], [1, -1.1], [0, -2], [-1, -1.1], [-3.5, -1.4]]), { wash: BRT.dhoti, fill: BRT.dhotiDk, fillOp: 70, tex: .5, ink: INK, sw: sw * .7, curv: .2 });
  rs('face');
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 2.2 * u, -5.6 * u, .7 * u, .4 * u, 12), { fill: PAL.rose, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  ganaFace(u, o, sw, -6.8, .55, -5.2, .55);
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x + 4.6 * u, y - 12 * u, u * 1.2, o.emoteK ?? 1, o.emoteAge ?? T); }
  boilSeed(`${key} after`);
}
// A cobra coiled at (x, y), rearing s tall-ish, swaying with ph (mirrors the imp), bow 0..1 lowers it; look -1..1.
function cobra(x, y, s, o = {}) {
  const key = o.key || 'cobra', sw = clamp(s / 120, .4, 1.6), ph = o.ph ?? T * 2, sway = -Math.sin(ph * TAU), bow = clamp(o.bow || 0);
  boilSeed(key + 'coil');
  paint(ellPts(x, y - s * .08, s * .42, s * .14, 16), { wash: BRT.cobraDk, ink: BRT.ink, sw });
  paint(ellPts(x + s * .05, y - s * .16, s * .3, s * .11, 14), { wash: BRT.cobra, ink: BRT.ink, sw: sw * .8 });
  const hx = x + sway * s * .14 + bow * s * .25, hy = y - s * (1 - .45 * bow);
  boilSeed(key + 'neck');
  paint(ribbon([[x - s * .1, y - s * .2], [x + sway * s * .1, y - s * .5], [hx - sway * s * .05, y - s * .78 * (1 - .4 * bow)], [hx, hy]], s * .2, s * .14), { wash: BRT.cobra, ink: BRT.ink, sw });
  inkLine([[x - s * .03, y - s * .3], [x + sway * s * .08, y - s * .52], [hx - sway * s * .03, y - s * .75 * (1 - .4 * bow)]], sw * 2, BRT.cobraLt, 'ink', .5);
  boilSeed(key + 'hood');
  paint(ellPts(hx, hy + s * .05, s * .26, s * .2, 16), { wash: BRT.cobra, ink: BRT.ink, sw });
  paint(ellPts(hx, hy + s * .08, s * .13, s * .1, 12), { wash: BRT.cobraLt, ink: null });
  paint(ellPts(hx, hy - s * .1, s * .14, s * .12, 12), { wash: BRT.cobra, ink: BRT.ink, sw: sw * .8 });
  for (const k of [-1, 1]) { paint(ellPts(hx + k * s * .06, hy - s * .12, s * .035, s * .045, 8), { wash: '#FFF5E2', ink: null }); paint(ellPts(hx + k * s * .06 + (o.look || 0) * s * .012, hy - s * .115, s * .02, s * .03, 6), { wash: BRT.ink, ink: null }); }
  if (frac(T * .9 + (o.seed || 0)) < .2) inkLine([[hx, hy - s * .02], [hx, hy + s * .08], [hx - s * .02, hy + s * .11]], sw * .9, '#D2452F', 'inkfine', 0);
}

// ---------- #3 the foodie ----------
// o: open 0..1 (the huge mouth), full 0..1 (cheeks stuffed), dy, sq, bow, eyes / blush / seed / emote, mouth (when closed)
function foodBhoot(x, y, u, o = {}) {
  const key = o.key || 'bhoot', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = BRT.ink, P = pts => U(pts, u);
  const op = clamp(o.open || 0), full = clamp(o.full || 0), bow = clamp(o.bow || 0), br = Math.sin(T * 3 + (o.seed || 0)) * .04;
  rs('shadow'); paint(ellPts(x, y + u * .1, u * 5.2, u * .8, 18), { fill: PAL.ink, fillOp: 70, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y + (o.dy || 0) * u); rotate(bow * .5); scale(1 + (o.sq || 0) * .6 + full * .12, 1 - (o.sq || 0) + br);
  rs('feet'); for (const s of [-1, 1]) paint(ellPts(s * 2 * u, -.35 * u, 1.1 * u, .5 * u, 12), { wash: BRT.bhootDk, ink: INK, sw: sw * .7 });
  rs('body');
  const body = ellPts(0, -5.4 * u, 5 * u, 5.1 * u, 30, u * .05);
  paint(body, { wash: BRT.bhoot, ink: null });
  paint(ellPts(-1.8 * u, -7.6 * u, 1.8 * u, 1.2 * u, 14, 0, -.5), { wash: BRT.bhootLt, washOp: 200, ink: null });
  paint(body, { ink: INK, sw });
  for (const s of [-1, 1]) paint(ellPts(s * 5 * u, -4.8 * u, .9 * u, .7 * u, 10), { wash: BRT.bhoot, ink: INK, sw: sw * .7 });   // little arms
  rs('face');
  if (full > .02) for (const s of [-1, 1]) paint(ellPts(s * 3.2 * u, -4.6 * u, (1.1 + 1.1 * full) * u, (.9 + .9 * full) * u, 14), { wash: BRT.bhoot, ink: INK, sw: sw * .7 });
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 3.1 * u, -5.4 * u, .8 * u, .45 * u, 12), { fill: PAL.rose, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  ganaFace(u, { ...o, mouth: op > .05 ? null : o.mouth ?? 'smile' }, sw, -8.4 + op * .6, .6, -5.4, .7);
  if (op > .05) {
    paint(ellPts(0, (-3.9 + op * .2) * u, 3.4 * op * u, 2.7 * op * u, 22), { wash: BRT.mouth, ink: INK, sw: sw * .8 });
    paint(ellPts(0, (-2.6 + op * .4) * u, 2 * op * u, .9 * op * u, 14), { wash: BRT.tongue, ink: null });
    for (const s of [-1, 1]) paint(P([[s * 1.4 * op, -6.3 + op * .1 - (1 - op)], [s * 2 * op, -6.25 + op * .1 - (1 - op)], [s * 1.7 * op, -5.6 + op * .1 - (1 - op)]]), { wash: '#FFF5E2', ink: null });   // two little fangs
  }
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x + 5.6 * u, y - 11 * u, u * 1.2, o.emoteK ?? 1, o.emoteAge ?? T); }
  boilSeed(`${key} after`);
}
// A gold plate with a pyramid of laddoos (4, 3, 2, 1) at (x, y), s = a laddoo's radius.
function laddooTower(x, y, s, key = 'laddoo', rot = 0) {
  push(); translate(x, y); rotate(rot);
  boilSeed(key + 'plate');
  paint(ellPts(0, 0, s * 5, s * 1.3, 22), { wash: BRT.plate, fill: TK.goldDk, fillOp: 60, tex: .4, ink: BRT.ink, sw: 1.2 });
  let i = 0;
  for (const [row, n] of [[0, 4], [1, 3], [2, 2], [3, 1]]) for (let k = 0; k < n; k++) {
    const lx = (k - (n - 1) / 2) * s * 1.9, ly = -s * .6 - row * s * 1.6;
    boilSeed(key + 'l' + (i++));
    paint(ellPts(lx, ly, s, s * .95, 14, s * .05), { wash: BRT.laddoo, fill: BRT.laddooDk, fillOp: 70, tex: .7, ink: BRT.ink, sw: .9 });
    paint(ellPts(lx - s * .35, ly - s * .35, s * .22, s * .18, 6), { wash: '#FFE08A', ink: null });
  }
  pop();
}

// ---------- #4 the selfie ghost ----------
// o: phone 0..1 (0 = the phone held up to the side for the selfie, 1 = lowered in front to check it), scratch 0..1
// (his other hand scratches his head), dy, sq, bow, eyes / mouth / blush / seed / emote
function selfieGhost(x, y, u, o = {}) {
  const key = o.key || 'selfie', rs = p => boilSeed(`${key} ${p}`), sw = clamp(u / 20, .4, 2), INK = BRT.ink, P = pts => U(pts, u);
  const fl = .8 + .3 * Math.sin(T * 2.2 + 1.3), ph = clamp(o.phone || 0), sc = clamp(o.scratch || 0), bow = clamp(o.bow || 0);
  rs('shadow'); paint(ellPts(x, y + u * .1, u * 3.4, u * .6, 16), { fill: PAL.ink, fillOp: 60, bleed: .25, tex: .3, ink: null });
  push(); translate(x, y - fl * u + (o.dy || 0) * u); rotate(bow * .45); scale(1 + (o.sq || 0) * .6, 1 - (o.sq || 0));
  rs('body');
  const dome = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; dome.push([Math.cos(a) * 3.2 * u, -15 * u + Math.sin(a) * 3.4 * u]); }
  const body = [...dome, [3.4 * u, -9 * u], [3.8 * u, -2 * u], ...ghostHem(-3.8 * u, 3.8 * u, -2 * u, 3, T * 5 + 1, -1 * u).map(([a, b]) => [a, b + 1 * u]), [-3.8 * u, -2 * u], [-3.4 * u, -9 * u]];
  paint(body, { wash: BRT.sage, ink: null, curv: .3 });
  paint(ellPts(-1.1 * u, -16.4 * u, 1.2 * u, .9 * u, 12, 0, -.4), { wash: BRT.sageLt, washOp: 200, ink: null });
  paint(body, { ink: INK, sw, curv: .3 });
  rs('face');
  if (o.blush) for (const s of [-1, 1]) paint(ellPts(s * 1.9 * u, -13.6 * u, .7 * u, .4 * u, 12), { fill: PAL.rose, fillOp: 170 * clamp(o.blush), bleed: .2, tex: .4, ink: null });
  ganaFace(u, o, sw, -14.8, .48, -12.9, .55);
  // the phone arm (screen-right): up and out for the selfie, or down in front to check
  rs('arm');
  const hp = [lerp(5.2, 1.8, ph), lerp(-17.5, -10.4, ph)];
  paint(ribbon(P([[3.2, -10.6], [lerp(4.8, 3.6, ph), lerp(-13, -9.4, ph)], hp]), .95 * u, .7 * u), { wash: BRT.sage, ink: INK, sw: sw * .7 });
  push(); translate(hp[0] * u, hp[1] * u); rotate(lerp(-.35, -.1, ph));
  paint(rrPts(-.8 * u, -2.6 * u, 1.6 * u, 2.8 * u, .3 * u), { wash: BRT.phone, ink: INK, sw: sw * .6 });
  paint(rrPts(-.6 * u, -2.4 * u, 1.2 * u, 2.4 * u, .2 * u), { wash: lerp(0, 1, ph) > .5 ? BRT.dusk : '#3A3550', ink: null });
  paint(ellPts(0, 0, .55 * u, .5 * u, 10), { wash: BRT.sage, ink: INK, sw: sw * .6 });
  pop();
  // the other arm: a nub, or scratching his head
  const hs = [lerp(-3.8, -2.2, sc), lerp(-8.4, -17.6, sc) + Math.sin(T * 30) * .2 * sc];
  paint(ribbon(P([[-3.2, -10.4], [lerp(-4.2, -4.6, sc), lerp(-9.4, -14, sc)], hs]), .95 * u, .7 * u), { wash: BRT.sage, ink: INK, sw: sw * .7 });
  paint(ellPts(hs[0] * u, hs[1] * u, .55 * u, .5 * u, 10), { wash: BRT.sage, ink: INK, sw: sw * .6 });
  pop();
  if (o.emote) { rs('emote'); emote(o.emote, x - 4.4 * u, y - fl * u - 20 * u, u * 1.3, o.emoteK ?? 1, o.emoteAge ?? T); }
  boilSeed(`${key} after`);
}
// The phone, big, centred at (cx, cy), w × h: on its screen the road and the torches, and nobody.
function phoneInset(cx, cy, w, h, k, t) {
  if (k <= .01) return;
  push(); translate(cx, cy); scale(backOut(k)); rotate(-.05);
  boilSeed('phone');
  paint(rrPts(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28, 34), { wash: BRT.phone, ink: BRT.ink, sw: 2 });
  paint(rrPts(-w / 2, -h / 2, w, h, 22), { wash: BRT.dusk, ink: null });
  paint(rectPts(-w / 2, -h * .05, w, h * .2), { wash: BRT.hill, ink: null });
  paint(rrPts(-w / 2, h * .15, w, h * .35, 18), { wash: BRT.road, ink: null });
  for (const [fx, fy] of [[-.3, .02], [.05, .0], [.35, .03]]) { glow(fx * w, fy * h - 18, 40, '#FFB040', .9); paint(ribbon([[fx * w, fy * h + 40], [fx * w, fy * h - 10]], 4, 4), { wash: '#5E3A1E', ink: null }); paint(ellPts(fx * w, fy * h - 18, 8, 13, 8), { wash: '#FFC94A', ink: null }); }
  paint(ellPts(0, h / 2 - 34, 18, 18, 14), { wash: '#FFF5E2', washOp: 210, ink: null });   // the shutter button
  paint(rrPts(-34, -h / 2 + 8, 68, 10, 5), { wash: BRT.phone, ink: null });   // the notch
  pop();
}

// ---------- the roll-call badge and sound marks ----------
function badge(x, y, n, age, s = 70) {
  if (age < 0) return;
  const k = backOut(clamp(age / .3)) * (1 + .05 * Math.sin(age * 6));
  push(); translate(x, y); scale(k); rotate(.08 * Math.sin(age * 3));
  boilSeed('badge' + n);
  glow(0, 0, s * 1.4, '#FFD27A', .5);
  paint(starPts(0, 0, s * 1.08, .86, 14), { wash: TK.goldDk, ink: null });
  paint(ellPts(0, 0, s * .88, s * .88, 24), { wash: TK.gold, ink: BRT.ink, sw: 1.6 });
  pop();
  letter(String(n), x, y + s * .05, s * 1.1 * k, BRT.ink, { font: `700 ${Math.round(s * 1.1 * k)}px Poppins`, ink: false });
}
// ")))": three painted arcs flying out from (x, y) toward dir (radians), age 0..~.5
function soundArcs(x, y, age, s, col = TK.cream, dir = 0, key = 'arcs') {
  if (age < 0 || age > .55) return;
  boilSeed(key);
  for (let i = 0; i < 3; i++) {
    const k = clamp(age / .55 - i * .12), r = s * (.5 + .9 * k + i * .25), a0 = dir - .7, a1 = dir + .7, p = [];
    if (k <= 0) continue;
    for (let j = 0; j <= 8; j++) { const a = lerp(a0, a1, j / 8); p.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
    inkLine(p, (6 - i * 1.4) * (1 - k * .6) * s / 60, col, 'ink', .5);
  }
}
// The bell's sound: gold rings sweeping out from (x, y) across the frame; age 0..1
function bellRings(x, y, age, key = 'rings') {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  const k = easeOut(age), r = 40 + 1500 * k, a = 1 - age;
  glow(x, y, 180 * (1 - age), '#FFE7A0', a);
  for (const [dr, w, c] of [[0, 9, '#FFD45A'], [-26, 4, '#FFF1C0']]) { const e = ellPts(x, y, Math.max(4, r + dr), Math.max(4, (r + dr) * .92), 48); inkLine([...e, e[0], e[1]], w * a + .5, c, 'ink', .5); }
}

// ---------- sets ----------
function torch(x, y, s, t, key = 'torch') {
  boilSeed(key);
  glow(x, y - s * 1.1, s * 2.6, '#FF9A3A', .55 + .1 * Math.sin(t * 13 + x));
  paint(ribbon([[x, y], [x + s * .03, y - s]], s * .08, s * .1), { wash: '#5E3A1E', ink: BRT.ink, sw: .8 });
  const f = 1 + .1 * Math.sin(t * 17 + x * .1);
  paint([[x - s * .16, y - s], [x + s * .16, y - s], [x + s * .05, y - s * (1.45 * f)], [x - s * .06, y - s * 1.25]], { wash: '#FFB040', ink: null, curv: .5 });
  paint([[x - s * .07, y - s * 1.02], [x + s * .08, y - s * 1.02], [x + s * .02, y - s * 1.28 * f]], { wash: '#FFF2C0', ink: null, curv: .5 });
}
// The plain hook ground: a dusky violet with a softer spot behind the subject.
function duskSky(cx = 540, cy = 1150, key = 'dusk') {
  boilSeed(key);
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: BRT.dusk, ink: null });
  paint(ellPts(cx, cy, 620, 760, 40, 4), { fill: BRT.duskLt, fillOp: 150, bleed: .3, tex: .3, ink: null });
  paint(ellPts(cx, cy + 80, 360, 440, 30, 4), { fill: '#8070B0', fillOp: 90, bleed: .3, tex: .3, ink: null });
}
// The palace door at night: a sandstone wall with a carved arch (warm light inside), a toran and two diyas; past
// x ≈ 860 the wall ends and the violet night (the baraat's side) begins. S: { t, warm 0..1 (morning light) }.
function palaceSet(S = {}) {
  const t = S.t || 0;
  boilSeed('pal sky');
  paint(rectPts(-800, -400, 2800, 2800), { wash: BRT.dusk, ink: null });
  paint(ellPts(1250, 1250, 700, 600, 30, 4), { fill: BRT.duskLt, fillOp: 140, bleed: .3, tex: .3, ink: null });
  for (const [tx, ty] of [[1040, 1330], [1260, 1300], [1460, 1340]]) torch(tx, ty, 90, t, 'pal t' + tx);
  boilSeed('pal wall');
  paint(rectPts(-800, -400, 1660, 1960), { wash: BRT.sand, fill: BRT.sandDk, fillOp: 60, bleed: .05, tex: .6, border: .3, ink: null });
  inkLine([[860, 200], [860, 1560]], 3, BRT.ink, 'ink', 0);
  for (let r = 0; r < 9; r++) inkLine([[-500, 300 + r * 140], [850, 300 + r * 140]], 1.2, BRT.sandDk, 'inkfine', 0);   // stone courses
  // the carved arch: a cusped, pointed doorway
  boilSeed('pal arch');
  const ax = 300, aw = 230, top = 720, base = 1560;
  const arch = (w, tp) => [[ax - w, base], [ax - w, tp + 300], [ax - w * .82, tp + 170], [ax - w * .5, tp + 60], [ax, tp], [ax + w * .5, tp + 60], [ax + w * .82, tp + 170], [ax + w, tp + 300], [ax + w, base]];
  paint(arch(aw + 46, top - 46), { wash: BRT.arch, fill: BRT.sandDk, fillOp: 60, tex: .5, ink: BRT.ink, sw: 2, curv: .25 });
  paint(arch(aw, top), { wash: BRT.door, ink: BRT.ink, sw: 1.8, curv: .25 });
  glow(ax, 1250, 300, '#FF9A50', .6);
  paint(ellPts(ax, 1330, 150, 230, 24, 3), { fill: BRT.doorLt, fillOp: 120, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 7; i++) { const a = -1.2 + i * .4; paint(ellPts(ax + Math.sin(a) * (aw + 23), top + 300 - Math.cos(a) * 240 - 20, 9, 9, 8), { wash: TK.goldLt, ink: null }); }
  garland([ax - aw - 30, top + 210], [ax + aw + 30, top + 210], 70, 'pal toran', 17);
  for (let i = 0; i < 6; i++) { const k = (i + .5) / 6, px = lerp(ax - aw, ax + aw, k), py = top + 210 + 70 * 4 * k * (1 - k); boilSeed('pal leaf' + i); paint([[px, py + 6], [px + 10, py + 30], [px, py + 52], [px - 10, py + 30]], { wash: '#4E8A4E', ink: BRT.ink, sw: .8, curv: .4 }); }
  // the diyas, on little ledges either side of the arch
  for (const dx of [-340, 340]) {
    const x = ax + dx * (dx < 0 ? .62 : .95), y = 1230;
    boilSeed('pal diya' + dx);
    paint(rectPts(x - 46, y, 92, 18), { wash: BRT.arch, ink: BRT.ink, sw: 1.2 });
    glow(x, y - 30, 120, '#FFB040', .75 + .1 * Math.sin(t * 11 + dx));
    paint([[x - 26, y - 4], [x + 26, y - 4], [x + 16, y + 4], [x - 16, y + 4]], { wash: '#B5603A', ink: BRT.ink, sw: 1, curv: .4 });
    paint([[x, y - 6], [x + 7, y - 16], [x, y - 36 - 3 * Math.sin(t * 17 + dx)], [x - 7, y - 16]], { wash: '#FFC94A', ink: null, curv: .5 });
  }
  boilSeed('pal floor');
  paint(rectPts(-800, 1540, 2800, 1600), { wash: BRT.floor, fill: BRT.floorDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[-800, 1545], [2000, 1545]], 2.4, BRT.ink, 'ink', 0);
  paint(rectPts(860, 1540, 1200, 1600), { wash: BRT.road, fill: BRT.hill, fillOp: 40, tex: .5, ink: null });
}
// The road to the palace: a violet sky, hills, a row of torches, the dusty road at y 1430. Draws only what the
// camera at cx can see (zoom 1).
function roadSet(cx, t, gy = 1400) {
  const o = gy - 1400;
  boilSeed('road sky');
  paint(rectPts(cx - 700, -300, 1400, 1800), { wash: BRT.night, ink: null });
  paint(rectPts(cx - 700, 900 + o, 1400, 400), { fill: BRT.dusk, fillOp: 200, bleed: .2, tex: .3, ink: null });
  for (let i = 0; i < 14; i++) { const sx = cx - 600 + frac(hash(i * 3.1) - cx * .0002) * 1200, sy = 480 + hash(i * 7.7) * 500; boilSeed('road st' + i); paint(starPts(sx, sy, 5 + 4 * hash(i), .35, 4), { wash: '#E9E2FF', washOp: 150 + 100 * Math.sin(t * 2 + i), ink: null }); }
  boilSeed('road hills');
  const hills = []; for (let x = Math.floor((cx - 760) / 120) * 120; x <= cx + 760; x += 120) hills.push([x, 1200 + o - 70 * (.5 + .5 * Math.sin(x * .004)) - 40 * hash(Math.round(x / 120))]);
  paint([...hills, [cx + 760, 1440 + o], [cx - 760, 1440 + o]], { wash: BRT.hill, ink: null, curv: .5 });
  for (let k = Math.floor((cx - 700) / 340); k <= Math.ceil((cx + 700) / 340); k++) torch(k * 340 + 60, 1330 + o, 85, t, 'road t' + k);
  boilSeed('road ground');
  paint(rectPts(cx - 760, gy, 1520, 900), { wash: BRT.road, fill: BRT.hill, fillOp: 50, tex: .5, ink: null });
  paint(rectPts(cx - 760, gy + 70, 1520, 200), { fill: BRT.roadLt, fillOp: 110, bleed: .2, tex: .6, ink: null });
  for (let k = Math.floor((cx - 700) / 230); k <= Math.ceil((cx + 700) / 230); k++) { boilSeed('road pb' + k); paint(ellPts(k * 230 + 90 * hash(k), gy + 240 + 80 * hash(k * 3), 16 + 10 * hash(k * 5), 8, 10), { wash: BRT.hill, ink: null }); }
}
// The glow-up cloud: a big round puff of cream and gold, sparkles in it; age 0..1.
function glowPoof(x, y, s, age, key = 'gpoof') {
  if (age < 0 || age > 1) return;
  const fade = 1 - seg(age, .5, 1), k = Math.min(1, age * 3); boilSeed(key);
  glow(x, y, s * 1.6, '#FFE39A', .7 * fade);
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU + hash(i) * .5, d = s * (.15 + .7 * easeOut(k)) * (.55 + .5 * hash(i * 3.3)), r = s * (.34 + .2 * hash(i * 1.7)) * (.5 + age);
    paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * 1.05 - age * s * .2, r, r * .9, 12, 2), { wash: ['#FFF5E2', '#FFE7B0', '#E9DFF5'][i % 3], washOp: 240 * fade, ink: null });
  }
  paint(ellPts(x, y, s * .7 * (.3 + k), s * .75 * (.3 + k), 18, 2), { wash: '#FFF5E2', washOp: 240 * fade, ink: null });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + age * 2; paint(starPts(x + Math.cos(a) * s * .5 * k, y + Math.sin(a) * s * .5 * k, s * .09 * fade, .3, 4), { wash: TK.goldLt, ink: null }); }
}
// The transformation: a column of marigold petals spiralling up round (x, y) (her feet), u her size, k 0..1 the
// density (1 covers her completely), t for the spin.
function petalSwirl(x, y, u, k, t) {
  if (k <= .01) return;
  const n = Math.round(50 + 230 * k);
  for (let i = 0; i < n; i++) {
    const h = frac(hash(i * 1.37) + t * .8), a = hash(i * 7.3) * TAU + t * 7 + h * 6, r = u * (4.6 + 1.5 * Math.sin(h * 9 + i)) * (1 - .25 * h);
    const px = x + Math.cos(a) * r, py = y - h * u * 30 + Math.sin(a) * u * .9, s = u * (.75 + .5 * hash(i * 3.1)) * (.6 + .6 * k), rr = t * 5 + i;
    if (Math.sin(a) < -.2 && k < .5) continue;   // the far side of the spiral hides behind her until it's dense
    boilSeed('swirl' + i);
    paint([[px + Math.cos(rr) * s, py + Math.sin(rr) * s], [px + Math.cos(rr + 1.6) * s * .5, py + Math.sin(rr + 1.6) * s * .5], [px - Math.cos(rr) * s, py - Math.sin(rr) * s], [px + Math.cos(rr - 1.6) * s * .5, py + Math.sin(rr - 1.6) * s * .5]],
      { wash: ['#F39A2E', '#FFD45A', '#F7B845', '#E0708C'][i % 4], washOp: 240, ink: i % 3 ? null : BRT.ink, sw: .6, curv: .5 });
  }
  if (k > .3) { glow(x, y - 15 * u, u * 14 * k, '#FFE7A0', k); glow(x, y - 15 * u, u * 7 * k, '#FFFFFF', k * .8); }
}
// A bell outline (a dome, a flared lip) centred at (cx, cy), r ≈ half its height.
function bellPts(cx, cy, r) {
  const p = [[0, -1.15], [.32, -1.05], [.55, -.6], [.66, .1], [.8, .55], [1, .8], [1, .95], [-1, .95], [-1, .8], [-.8, .55], [-.66, .1], [-.55, -.6], [-.32, -1.05]];
  return through(p.map(([a, b]) => [cx + a * r, cy + b * r]));
}
// The groom's seat: a low platform with a red-and-gold cushion.
function platform(x, y, w, key = 'plat') {
  boilSeed(key);
  paint(rrPts(x - w / 2, y - 10, w, 90, 14), { wash: TK.goldDk, fill: '#8A5A20', fillOp: 60, tex: .5, ink: BRT.ink, sw: 1.6 });
  paint(rrPts(x - w / 2 + 14, y - 34, w - 28, 44, 20), { wash: BRT.silk, fill: '#962338', fillOp: 70, tex: .5, ink: BRT.ink, sw: 1.4 });
  inkLine([[x - w / 2 + 24, y - 6], [x + w / 2 - 24, y - 6]], 4, TK.gold, 'ink', 0);
  for (let i = 0; i < 5; i++) paint(ellPts(x - w / 2 + 40 + i * (w - 80) / 4, y + 40, 9, 9, 8), { wash: TK.goldLt, ink: null });
}
// The rose-gold wedding morning: a soft sky, marigold strings hanging at the top, a mandap's two pillars, the floor.
function weddingSet(t) {
  boilSeed('wed sky');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: BRT.rose, ink: null });
  paint(ellPts(540, 1000, 700, 600, 32, 4), { fill: BRT.roseLt, fillOp: 200, bleed: .3, tex: .3, ink: null });
  glow(540, 900, 600, '#FFE7B0', .35);
  for (const px of [70, 1010]) { boilSeed('wed pil' + px); paint(rectPts(px - 34, 380, 68, 1200), { wash: '#E9B38E', fill: '#C98F6A', fillOp: 70, tex: .5, ink: BRT.ink, sw: 1.4 }); }
  for (let i = 0; i < 5; i++) garland([-40 + i * 240, 400], [200 + i * 240, 400], 60, 'wed g' + i, 14, i % 2 ? ['#E0708C', '#F4A6B8', '#C8507A'] : undefined);
  boilSeed('wed floor');
  paint(rectPts(-200, 1500, W + 400, 700), { wash: BRT.roseDk, fill: '#D88E74', fillOp: 70, tex: .5, ink: null });
  inkLine([[-200, 1502], [W + 200, 1502]], 2.2, BRT.ink, 'ink', 0);
  for (let i = 0; i < 8; i++) { boilSeed('wed r' + i); const x = 80 + i * 130, y = 1580 + 60 * hash(i); paint(ellPts(x, y, 14, 9, 8), { wash: i % 2 ? TK.petal : '#FFD27A', washOp: 220, ink: null }); }
}

// Model sheet of the ganas: studio.html?loop=ganas
(() => {
  LOOPS.ganas = t => {
    duskSky(540, 960);
    dholGhost(300, 820, 24, { ...feel('happy', t), hit: pulse(t, 6), hitL: pulse(t + .25, 6) });
    naginImp(780, 820, 22, { ...feel('happy', t, { eyes: 'happy' }), ph: t * 1.6 });
    cobra(960, 820, 230, { ph: t * 1.6 });
    foodBhoot(300, 1450, 24, { ...feel('happy', t), open: .5 + .5 * Math.sin(t * 3), key: 'fb' });
    laddooTower(120, 1450, 26);
    selfieGhost(780, 1450, 22, { ...feel('confused', t), phone: frac(t / 4) > .5 ? 1 : 0, scratch: frac(t / 4) > .5 ? 1 : 0, emote: '?' });
    phoneInset(540, 1700, 160, 260, 1, t);
    badge(540, 480, 3, t);
  };
  LOOPS.ganas.len = 4;
})();
