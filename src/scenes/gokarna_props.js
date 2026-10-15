// gokarna_props.js: the sets and props for "RAVANA needed a TOILET." (src/scenes/gokarna.js). Loaded before it;
// everything here is a pure function of its arguments (and T for boil).
//
//   TK, vanishPuff, sparkleBurst, whipH, impact, bonk, bubble, rkCard3      copied from ad 13
//   GK                                       the palette of this reel
//   whipV(k, dir, t, cols)                   a vertical whip pan (streaks up or down)
//   hookBg(t), kailashSet(t), skySet(t), roadSet(t, o), coastSet(t), sanctumSet(t), sunsetSet(t)   the sets
//   cloud(x, y, s, key, col), bush(x, y, s, key, o), palm(x, y, s, lean, key)                      set pieces
//   atmalinga(x, y, s, o)                    the Atmalinga on its base; o.twist 0..1 curls it into a cow's ear
//   waterPot(x, y, s, o)                     a brass lota; o.varuna 0..1 shows the little face in the water, o.wink
//   fakeStache(x, y, s, rot, key)            the cowherd's fake handlebar moustache
//   cowherdBag(x, y, s, t, peek)             the cloth bag with Mooshak peeking out
//   shepherdStick(u, sw)                     a crook, for Bal Bappa's armL hook
//   shivaCloud(x, y, u, t, o)                Shiva peeking over a cloud (o: hand 0..1 raised, wince, smile)
//   groundCrack(x, y, age, s)                the gold crack ring where the linga lands
//   stoneBappa(x, y, u, o)                   the black stone Maha Ganapati of Gokarna (Bal Bappa in stone), o.dent
//   iceBag(x, y, s, t)                       an ice bag for the bump
const TK = {
  ink: '#2B2233', cream: '#FFF5E2',
  petal: '#F4A6B8', petalDk: '#E0708C', marigold: '#F39A2E', yellow: '#FFD45A', leaf: '#5E9A6A',
  gold: '#EDB43C', goldLt: '#FFE39A', goldDk: '#B67D1C',
  rkOrange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50', teal: '#2E5F5A',
};
const GK = {
  ink: '#2E2226',
  ochre: '#F2C27A', ochreDk: '#E0A55A', ochreLt: '#FBE2B4',
  snowSky: '#C9C2E6', snowSkyLt: '#E6E0F6', snow: '#FBF8FF', snowDk: '#C8C4E2', rock: '#7A6E9A', rockDk: '#5A4E7A',
  sky: '#9FD0F0', skyLt: '#D6EEFA', cloud: '#FFFDF8', cloudDk: '#D8E6F2',
  heat: '#FFD98A', heatLt: '#FFF0C4', sun: '#FFE07A', sunCore: '#FFF6D6', dust: '#E8B470', dustDk: '#C48A44', road: '#D9A766', roadDk: '#B8854A', shrub: '#8A9A4A',
  sea: '#3FA3A8', seaDk: '#2A7E8A', seaLt: '#8ED6D2', sand: '#F2D7A6', sandDk: '#DDB57A', coastSky: '#FCE9C8', coastSkyLt: '#FFF6E2',
  palm: '#4E8A4A', palmDk: '#32663A', trunk: '#8A6040', trunkDk: '#5E3E26', bush: '#5E9A52', bushDk: '#3E7440', bushLt: '#8CC070', flower: '#F4A6B8',
  stone: '#3A3844', stoneDk: '#26242E', stoneLt: '#5A5866', glowGold: '#FFD27A',
  brass: '#E0A53A', brassDk: '#A87420', brassLt: '#FFE08A', water: '#7EC8E8', waterDk: '#4A9AC8', varuna: '#5AA8E0', varunaDk: '#2E76B8',
  bag: '#C9A06A', bagDk: '#9A7442', stick: '#8A5A32', stickDk: '#5E3A1E', stache: '#2A2230',
  wall: '#2E2430', wallLt: '#4A3A46', lamp: '#FFC766', flame: '#FFB23A', flameLt: '#FFF0B0',
  dusk: '#F6905A', duskTop: '#B85A8A', duskLow: '#FFC27A', seaDusk: '#6A5A9A', seaDuskLt: '#E89A7A',
  ice: '#BFE6F6', iceDk: '#86C2E0', tag: '#FFF5E2',
};

// ---------- copied from ad 13 ----------
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
function whipH(k, dir = 1, t = 0, cols = [TK.cream, '#C9CCF2']) {
  if (k <= .02) return;
  boilSeed('whiph');
  for (let i = 0; i < 18; i++) {
    const y = 240 + hash(i * 2.7) * (H - 480), l = 500 + 900 * hash(i * 5.3), x = ((hash(i * 9.1) * 2400 - 300 + dir * t * 3800) % (W + l)) - l * .5, w = 5 + 16 * hash(i * 1.3);
    paint(ribbon([[x - l / 2, y], [x, y + 3], [x + l / 2, y]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 190 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
}
function impact(x, y, age, s, key = 'imp') {
  if (age < 0 || age > .5) return;
  boilSeed(key);
  if (age < .085) {
    paint(rectPts(-3000, -3000, 8000, 8000), { wash: age < .042 ? '#FFF4DC' : '#1A1430', ink: null });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + hash(i) * .3, r0 = s * .25, r1 = s * (1.6 + 1.2 * hash(i * 3)); paint([[x + Math.cos(a - .05) * r0, y + Math.sin(a - .05) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a + .05) * r0, y + Math.sin(a + .05) * r0]], { wash: age < .042 ? '#1A1430' : '#FFF4DC', ink: null }); }
    return;
  }
  const k = (age - .085) / .415;
  glow(x, y, s * (1.2 + k), '#FFD27A', .9 * (1 - k));
  const R = s * (.3 + 1.6 * easeOut(k)), e = ellPts(x, y, R, R * .8, 36, 2);
  inkLine([...e, e[0], e[1]], 14 * (1 - k) + 1, '#F5B83A', 'ink', .5);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + hash(i * 2) * .5, d = s * (.4 + 1.5 * easeOut(k)) * (.6 + .5 * hash(i)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, s * .14 * (1 - k), .3, 4), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: null }); }
}
function bonk(x, y, age, s, key = 'bonk') {
  if (age < 0 || age > .45) return;
  const k = age / .45; boilSeed(key);
  glow(x, y, s * (1 + k), '#FFD27A', .7 * (1 - k));
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + hash(i * 4) * .4, d = s * (.3 + 1.1 * easeOut(k)); paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d, s * .3 * (1 - k * .7), .35, 4, a), { wash: i % 2 ? '#FFE08A' : '#FFF4DC', ink: GK.ink, sw: .6 }); }
}
// a speech bubble with a word, world px; o: tail [x, y], col, life
function bubble(txt, x, y, size, age, o = {}) {
  if (age < 0 || age > (o.life ?? 9)) return;
  const k = backOut(clamp(age * 5)), w = Math.max(size * 1.6, txt.length * size * .62) + size * .6, h = size * 1.5, a = 1 - seg(age, (o.life ?? 9) - .2, o.life ?? 9);
  if (a <= 0) return;
  boilSeed('bub ' + txt + x);
  push(); translate(x, y); scale(k);
  if (o.tail) paint([[-size * .3, h * .3], [size * .3, h * .3], [o.tail[0] - x, o.tail[1] - y]], { wash: o.col || GK.tag, ink: GK.ink, sw: .9 });
  paint(rrPts(-w / 2, -h / 2, w, h, h / 2), { wash: o.col || GK.tag, ink: GK.ink, sw: 1.1 });
  pop();
  letter(txt, x, y + size * .05, size * k, o.ink || GK.ink, { font: `700 ${size * k}px Poppins`, ink: false, alpha: a, rot: o.rot ?? 0 });
}

// a vertical whip pan: streaks running up (dir -1) or down (dir 1)
function whipV(k, dir = -1, t = 0, cols = [TK.cream, '#C9CCF2']) {
  if (k <= .02) return;
  boilSeed('whipv');
  for (let i = 0; i < 16; i++) {
    const x = 60 + hash(i * 2.7) * (W - 120), l = 700 + 1100 * hash(i * 5.3), y = ((hash(i * 9.1) * 3200 + dir * t * 5200) % (H + l) + (H + l)) % (H + l) - l * .5, w = 6 + 18 * hash(i * 1.3);
    paint(ribbon([[x, y - l / 2], [x + 3, y], [x, y + l / 2]], w * .3, w), { wash: i % 3 ? cols[0] : cols[1], washOp: 200 * clamp(k) * (.5 + .5 * hash(i)), ink: null });
  }
  if (k > .6) paint(rectPts(-60, -60, W + 120, H + 120), { wash: cols[0], washOp: 255 * seg(k, .6, 1), ink: null });
}

// ---------- set pieces ----------
function cloud(x, y, s, key = 'cloud', col = GK.cloud, dk = GK.cloudDk) {
  boilSeed(key);
  const blobs = [[-1.1, .15, .62], [-.5, -.25, .78], [.25, -.35, .85], [.95, -.05, .66], [1.45, .25, .45], [0, .25, .8], [-1.55, .35, .4]];
  paint(ellPts(x, y + s * .42, s * 1.9, s * .3, 20), { fill: dk, fillOp: 140, bleed: .2, tex: .3, ink: null });
  for (const [a, b, r] of blobs) paint(ellPts(x + a * s, y + b * s, r * s, r * s * .82, 18, 1), { wash: col, ink: GK.ink, sw: .7 });
  paint(rectPts(x - s * 1.7, y + s * .2, s * 3.3, s * .45), { wash: col, ink: null });
  inkLine([[x - s * 1.9, y + s * .62], [x + s * 1.8, y + s * .62]], .7, GK.ink, 'inkfine', .5);
}
function bush(x, y, s, key = 'bush', o = {}) {
  boilSeed(key);
  const blobs = [[-1.0, -.45, .62], [-.45, -.9, .7], [.25, -1.0, .72], [.9, -.6, .62], [1.2, -.2, .45], [-1.3, -.15, .45], [0, -.4, .9]];
  for (const [a, b, r] of blobs) paint(ellPts(x + a * s, y + b * s, r * s, r * s * .85, 18, 1.5), { wash: o.col || GK.bush, fill: GK.bushDk, fillOp: 70, tex: .5, ink: GK.ink, sw: 1 });
  for (let i = 0; i < 7; i++) paint(ellPts(x + (hash(i * 3.1) - .5) * 2.2 * s, y - (.25 + hash(i * 1.7) * .9) * s, s * .07, s * .07, 8), { wash: GK.flower, ink: GK.ink, sw: .5 });
  for (let i = 0; i < 6; i++) { const a = hash(i * 7.7) * Math.PI - Math.PI, r = .7 * s; paint(ellPts(x + Math.cos(a) * r * 1.1, y - .55 * s + Math.sin(a) * r * .8, s * .14, s * .09, 8, 0, a), { wash: GK.bushLt, ink: null }); }
}
function palm(x, y, s, lean = .2, key = 'palm') {
  boilSeed(key);
  const top = [x + lean * s * 2.2, y - s * 3.2], sway = Math.sin(T * 1.1 + x) * .06;
  paint(ribbon([[x, y], [x + lean * s * .6, y - s * 1.2], [x + lean * s * 1.5, y - s * 2.3], top], s * .22, s * .13), { wash: GK.trunk, fill: GK.trunkDk, fillOp: 60, tex: .5, ink: GK.ink, sw: .8 });
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * .52 + sway, L = s * (1.1 + .25 * hash(i)), mid = [top[0] + Math.cos(a) * L * .55, top[1] + Math.sin(a) * L * .55 - s * .2], end = [top[0] + Math.cos(a) * L, top[1] + Math.sin(a) * L + s * .35 * Math.abs(Math.cos(a))];
    paint(ribbon([top, mid, end], s * .22, s * .02), { wash: i % 2 ? GK.palm : GK.palmDk, ink: GK.ink, sw: .6, curv: .5 });
  }
  for (const d of [-1, 1]) paint(ellPts(top[0] + d * s * .1, top[1] + s * .12, s * .1, s * .1, 8), { wash: '#7A5A30', ink: GK.ink, sw: .5 });
}

// ---------- the sets (world = screen at zoom 1) ----------
function hookBg(t) {
  boilSeed('hookbg');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: GK.ochre, ink: null });
  paint(ellPts(540, 1150, 760, 900, 30), { fill: GK.ochreLt, fillOp: 150, bleed: .3, tex: .4, ink: null });
  paint(rectPts(-600, 1560, W + 1200, 900), { fill: GK.ochreDk, fillOp: 120, bleed: .2, tex: .4, ink: null });
}
function kailashSet(t) {
  boilSeed('kailsky');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: GK.snowSky, ink: null });
  paint(rectPts(-600, 300, W + 1200, 700), { fill: GK.snowSkyLt, fillOp: 140, bleed: .3, tex: .3, ink: null });
  boilSeed('kailpeaks');
  paint([[-400, 1250], [120, 700], [300, 880], [520, 560], [760, 900], [920, 760], [1500, 1250]], { wash: GK.snowDk, ink: GK.ink, sw: .8 });
  paint([[400, 760], [520, 560], [640, 740], [580, 720], [540, 780], [480, 730]], { wash: GK.snow, ink: null });
  paint([[-400, 1400], [-100, 1080], [300, 1200], [700, 1020], [1100, 1180], [1500, 1400]], { wash: GK.snow, fill: GK.snowDk, fillOp: 60, tex: .3, ink: GK.ink, sw: .8 });
  paint(rectPts(-600, 1380, W + 1200, 900), { wash: GK.snow, fill: GK.snowDk, fillOp: 50, tex: .3, ink: null });
  // Shiva's ledge
  boilSeed('kailledge');
  paint([[-200, 1160], [80, 1120], [420, 1130], [470, 1200], [440, 1330], [-200, 1360]], { wash: GK.rock, fill: GK.rockDk, fillOp: 80, tex: .5, ink: GK.ink, sw: 1.2 });
  paint([[-200, 1150], [80, 1108], [420, 1118], [460, 1160], [300, 1175], [100, 1165], [-200, 1185]], { wash: GK.snow, ink: GK.ink, sw: .8, curv: .4 });
  boilSeed('kailsnow');
  for (let i = 0; i < 40; i++) { const x = (hash(i * 3.3) * 1300 + Math.sin(t * .8 + i) * 30) % 1200 - 60, y = frac(hash(i * 7.1) + t * (.04 + .03 * hash(i))) * 2000 - 40; paint(ellPts(x, y, 4 + 4 * hash(i * 2), 4 + 4 * hash(i * 2), 8), { wash: GK.snow, washOp: 220, ink: null }); }
}
function skySet(t) {
  boilSeed('skybg');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: GK.sky, ink: null });
  paint(rectPts(-600, 900, W + 1200, 900), { fill: GK.skyLt, fillOp: 150, bleed: .3, tex: .3, ink: null });
  cloud(160 + Math.sin(t * .4) * 20, 820, 120, 'skyc1');
  cloud(930 + Math.sin(t * .3) * 20, 1000, 90, 'skyc2');
  cloud(540, 1720, 420, 'skyc3');
}
// o: heat 0..1 (shimmer), bushFar (the far bush on the horizon, for the BOSS's look)
function roadSet(t, o = {}) {
  boilSeed('roadsky');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: GK.heat, ink: null });
  paint(rectPts(-600, 200, W + 1200, 900), { fill: GK.heatLt, fillOp: 150, bleed: .3, tex: .3, ink: null });
  glow(860, 780, 520, GK.sun, .7);
  boilSeed('roadsun');
  paint(ellPts(860, 780, 110, 110, 30), { wash: GK.sunCore, ink: null });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .3, r0 = 140, r1 = 200 + 30 * Math.sin(t * 5 + i); paint([[860 + Math.cos(a - .08) * r0, 780 + Math.sin(a - .08) * r0], [860 + Math.cos(a) * r1, 780 + Math.sin(a) * r1], [860 + Math.cos(a + .08) * r0, 780 + Math.sin(a + .08) * r0]], { wash: GK.sun, ink: null }); }
  boilSeed('roadground');
  paint(rectPts(-600, 1120, W + 1200, 1400), { wash: GK.dust, fill: GK.dustDk, fillOp: 60, tex: .5, ink: null });
  inkLine([[-200, 1120], [1300, 1120]], 1, GK.ink, 'inkfine', 0);
  paint([[500, 1120], [580, 1120], [1400, 2200], [-300, 2200]], { wash: GK.road, fill: GK.roadDk, fillOp: 50, tex: .4, ink: GK.ink, sw: .8 });
  for (const [x, y, s] of [[90, 1260, 40], [980, 1300, 46], [170, 1500, 60], [1000, 1640, 70]]) { boilSeed('shrub' + x); for (let k = 0; k < 6; k++) inkLine([[x, y], [x + (k - 2.5) * s * .25, y - s * (.6 + .3 * hash(k + x))]], 1.6, GK.shrub, 'ink', .4); }
  if (o.bushFar) bush(150, 1125, 28, 'farbush');
  if (o.heat) { boilSeed('heat' + Math.floor(t * 6)); for (let i = 0; i < 6; i++) { const y = 1080 - i * 22, x0 = 300 + hash(i) * 300; inkLine([[x0, y], [x0 + 60, y - 6], [x0 + 120, y], [x0 + 180, y - 6]], 1.2, GK.heatLt, 'inkfine', .6); } }
}
function coastSet(t) {
  boilSeed('coastsky');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: GK.coastSky, ink: null });
  paint(rectPts(-600, 300, W + 1200, 700), { fill: GK.coastSkyLt, fillOp: 150, bleed: .3, tex: .3, ink: null });
  cloud(780 + Math.sin(t * .3) * 15, 640, 70, 'coastc1');
  boilSeed('coastsea');
  paint(rectPts(-600, 1000, W + 1200, 260), { wash: GK.sea, fill: GK.seaDk, fillOp: 60, tex: .4, ink: null });
  inkLine([[-200, 1000], [1300, 1000]], 1, GK.ink, 'inkfine', 0);
  for (let i = 0; i < 8; i++) { const y = 1030 + i * 26, x0 = ((hash(i * 4.1) * 1200 + t * 30 * (i % 2 ? 1 : -1)) % 1300) - 120; inkLine([[x0, y], [x0 + 40, y - 5], [x0 + 80, y]], 1.4, GK.seaLt, 'inkfine', .6); }
  boilSeed('coastsand');
  paint([[-600, 1250], [200, 1215], [700, 1235], [1700, 1200], [1700, 2600], [-600, 2600]], { wash: GK.sand, fill: GK.sandDk, fillOp: 50, tex: .5, ink: GK.ink, sw: .8, curv: .4 });
  const foam = 1238 + Math.sin(t * 1.4) * 6;
  inkLine([[-200, foam], [300, foam - 10], [800, foam + 4], [1300, foam - 8]], 3, '#FFFDF6', 'ink', .5);
  palm(990, 1260, 120, -.3, 'palm1');
  palm(70, 1240, 100, .25, 'palm2');
  boilSeed('coastpebbles');
  for (let i = 0; i < 12; i++) paint(ellPts(hash(i * 2.3) * 1080, 1700 + hash(i * 5.1) * 200, 10 + 8 * hash(i), 6, 8), { wash: GK.sandDk, ink: null });
}
function sanctumSet(t) {
  boilSeed('sanwall');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: GK.wall, ink: null });
  paint(ellPts(540, 1150, 600, 800, 30), { fill: GK.wallLt, fillOp: 120, bleed: .3, tex: .5, ink: null });
  glow(540, 1150, 700, GK.lamp, .35);
  boilSeed('sanarch');
  const arc = []; for (let k = 0; k <= 16; k++) { const a = Math.PI + k / 16 * Math.PI; arc.push([540 + Math.cos(a) * 330, 900 + Math.sin(a) * 260]); }
  inkLine([[210, 1900], [210, 900], ...arc, [870, 900], [870, 1900]], 26, GK.brassDk, 'ink', .3);
  inkLine([[230, 1900], [230, 905], ...arc.map(([a, b]) => [540 + (a - 540) * .94, 900 + (b - 900) * .92]), [850, 905], [850, 1900]], 6, GK.brass, 'ink', .3);
  // marigold strings hanging in the arch
  boilSeed('sangarland');
  for (let s = 0; s < 2; s++) { const x0 = s ? 830 : 250; for (let k = 0; k < 14; k++) paint(ellPts(x0 + (s ? -1 : 1) * Math.sin(k * .2) * 20, 760 + k * 34, 15, 13, 10), { wash: k % 3 === 2 ? '#E8573A' : TK.marigold, ink: GK.ink, sw: .5 }); }
  boilSeed('sanplinth');
  paint(rectPts(260, 1790, 560, 160), { wash: GK.stoneLt, fill: GK.stoneDk, fillOp: 60, tex: .5, ink: GK.ink, sw: 1 });
  for (let i = 0; i < 9; i++) paint(ellPts(300 + i * 60, 1790, 22, 18, 10), { wash: i % 2 ? TK.marigold : '#E8573A', ink: GK.ink, sw: .5 });
}
function diya(x, y, s, t, key = 'diya') {
  glow(x, y - s * 1.2, s * 4, GK.lamp, .75 + .15 * Math.sin(t * 9 + x));
  boilSeed(key);
  paint(rectPts(x - s * .12, y, s * .24, s * 3), { wash: GK.brass, ink: GK.ink, sw: .6 });
  paint([[x - s * .9, y - s * .1], [x + s * .9, y - s * .1], [x + s * .55, y + s * .4], [x - s * .55, y + s * .4]], { wash: GK.brass, fill: GK.brassDk, fillOp: 60, tex: .4, ink: GK.ink, sw: .7, curv: .4 });
  const fl = Math.sin(t * 13 + x) * .12;
  paint([[x, y - s * (1.25 + fl)], [x + s * .26, y - s * .45], [x, y - s * .1], [x - s * .26, y - s * .45]], { wash: GK.flame, ink: null, curv: .6 });
  paint([[x, y - s * (.85 + fl)], [x + s * .13, y - s * .38], [x, y - s * .2], [x - s * .13, y - s * .38]], { wash: GK.flameLt, ink: null, curv: .6 });
}
function sunsetSet(t) {
  boilSeed('dusksky');
  paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: GK.dusk, ink: null });
  paint(rectPts(-600, -600, W + 1200, 1100), { fill: GK.duskTop, fillOp: 130, bleed: .3, tex: .3, ink: null });
  paint(rectPts(-600, 850, W + 1200, 300), { fill: GK.duskLow, fillOp: 170, bleed: .3, tex: .3, ink: null });
  glow(700, 1110, 420, '#FFC266', .8);
  boilSeed('dusksun');
  paint(ellPts(700, 1110, 120, 120, 30), { wash: '#FFE08A', ink: null });
  boilSeed('duskasea');
  paint(rectPts(-600, 1110, W + 1200, 260), { wash: GK.seaDusk, ink: null });
  inkLine([[-200, 1110], [1300, 1110]], 1, GK.ink, 'inkfine', 0);
  for (let i = 0; i < 7; i++) { const y = 1130 + i * 22, w = 140 - i * 12; inkLine([[700 - w + Math.sin(t * 2 + i) * 10, y], [700 + w + Math.sin(t * 2 + i) * 10, y]], 4, GK.seaDuskLt, 'ink', 0); }
  boilSeed('dusksand');
  paint([[-600, 1330], [400, 1300], [1700, 1320], [1700, 2600], [-600, 2600]], { wash: '#E8B488', fill: '#C88A62', fillOp: 60, tex: .5, ink: GK.ink, sw: .8, curv: .4 });
  palm(1000, 1340, 130, -.3, 'duskpalm');
}

// ---------- props ----------
// the Atmalinga: (x, y) is the bottom of its base, s its size (about 1.3 s tall); o: glow 0..1, twist 0..1 (the cow's ear),
// rot, key
function atmalinga(x, y, s, o = {}) {
  const tw = clamp(o.twist || 0), g = o.glow ?? 1, sw = clamp(s / 60, .5, 1.6);
  if (g > 0) glow(x, y - s * .8, s * 1.6, GK.glowGold, .55 * g + .1 * Math.sin(T * 3) * g);
  boilSeed(o.key || 'linga');
  push(); translate(x, y); rotate(o.rot || 0);
  // the base (the pitha) with its spout to the right
  paint([[-.75 * s, -.1 * s], [-.7 * s, -.32 * s], [.7 * s, -.32 * s], [1.15 * s, -.3 * s], [1.2 * s, -.22 * s], [.75 * s, -.15 * s], [.7 * s, -.02 * s], [-.7 * s, 0]], { wash: GK.stoneLt, fill: GK.stoneDk, fillOp: 70, tex: .5, ink: GK.ink, sw, curv: .2 });
  paint(ellPts(0, -.33 * s, .74 * s, .13 * s, 20), { wash: GK.stone, ink: GK.ink, sw: sw * .8 });
  // the shaft: a rounded pillar, or twisted into a cow's ear
  const straight = [[-.36, -.33], [-.38, -.8], [-.32, -1.08], [-.18, -1.24], [0, -1.29], [.18, -1.24], [.32, -1.08], [.38, -.8], [.36, -.33]];
  const ear = [[-.36, -.33], [-.52, -.75], [-.4, -1.15], [-.02, -1.48], [.55, -1.66], [1.2, -1.62], [.92, -1.22], [.5, -.82], [.36, -.33]];
  const P = straight.map((p, i) => [lerp(p[0], ear[i][0], tw) * s, lerp(p[1], ear[i][1], tw) * s]);
  paint(P, { wash: GK.stone, fill: GK.stoneDk, fillOp: 60, tex: .5, ink: GK.ink, sw: sw * 1.1, curv: .5 });
  if (tw > .4) {   // the inside of the ear
    const k = seg(tw, .4, 1);
    paint([[-.18, -.5], [-.24, -1.0], [.1, -1.32], [.6, -1.5], [1.0 * k + .3 * (1 - k), -1.5], [.55, -1.1], [.15, -.65]].map(([a, b]) => [a * s, b * s]), { wash: '#7A6A80', fill: '#B88A9A', fillOp: 110 * k, tex: .4, ink: GK.ink, sw: sw * .6, curv: .5 });
  } else {
    paint(ellPts(-.13 * s, -.95 * s, .09 * s, .2 * s, 10), { wash: GK.stoneLt, ink: null });   // the sheen
    for (const k of [-.08, 0, .08]) inkLine([[(-.22 + k) * s, -1.0 * s], [(.22 + k) * s, -1.0 * s]], sw * .9, '#F2EAD8', 'inkfine', .3);   // the three ash lines
    paint(ellPts(0, -.92 * s, .05 * s, .05 * s, 8), { wash: '#D2304A', ink: null });
  }
  pop();
}
// a brass lota; (x, y) its bottom, s its size; o: rot, varuna 0..1 (his face in the water), wink 0..1
function waterPot(x, y, s, o = {}) {
  boilSeed(o.key || 'pot');
  push(); translate(x, y); rotate(o.rot || 0);
  paint([[-.45 * s, -.05 * s], [.45 * s, -.05 * s], [.75 * s, -.45 * s], [.6 * s, -.85 * s], [.35 * s, -1.0 * s], [.45 * s, -1.2 * s], [-.45 * s, -1.2 * s], [-.35 * s, -1.0 * s], [-.6 * s, -.85 * s], [-.75 * s, -.45 * s]], { wash: GK.brass, fill: GK.brassDk, fillOp: 60, tex: .5, ink: GK.ink, sw: .9, curv: .45 });
  paint(ellPts(-.3 * s, -.55 * s, .12 * s, .25 * s, 10), { wash: GK.brassLt, ink: null });
  inkLine([[-.68 * s, -.6 * s], [.68 * s, -.6 * s]], 1.2, GK.brassDk, 'inkfine', .3);
  // the mouth, seen from a little above, and the water in it
  paint(ellPts(0, -1.2 * s, .5 * s, .16 * s, 18), { wash: GK.brassLt, ink: GK.ink, sw: .8 });
  paint(ellPts(0, -1.19 * s, .4 * s, .11 * s, 16), { wash: GK.water, ink: null });
  const v = clamp(o.varuna || 0);
  if (v > 0) {   // Varuna: a little blue face with a gold crown and a curly moustache, peeking out of the water
    const fx = 0, fy = -1.22 * s - .14 * s * v, R = .3 * s;
    paint(ellPts(fx, fy, R, R * .9, 14), { wash: GK.varuna, ink: GK.ink, sw: .6 });
    paint([[fx - R * .7, fy - R * .7], [fx - R * .5, fy - R * 1.35], [fx - R * .2, fy - R * .95], [fx, fy - R * 1.5], [fx + R * .2, fy - R * .95], [fx + R * .5, fy - R * 1.35], [fx + R * .7, fy - R * .7]], { wash: TK.gold, ink: GK.ink, sw: .5 });
    const wk = clamp(o.wink || 0);
    paint(ellPts(fx - R * .38, fy - R * .1, R * .14, R * .18, 8), { wash: GK.ink, ink: null });
    if (wk > .5) inkLine([[fx + R * .22, fy - R * .1], [fx + R * .38, fy - R * .2], [fx + R * .54, fy - R * .1]], 1.1, GK.ink, 'inkfine', .5);
    else paint(ellPts(fx + R * .38, fy - R * .1, R * .14, R * .18, 8), { wash: GK.ink, ink: null });
    inkLine([[fx - R * .55, fy + R * .3], [fx - R * .2, fy + R * .22], [fx, fy + R * .3], [fx + R * .2, fy + R * .22], [fx + R * .55, fy + R * .3]], 1.2, GK.varunaDk, 'ink', .5);
    paint(ellPts(0, -1.19 * s, .4 * s, .05 * s, 16), { wash: GK.water, washOp: 200, ink: null });   // the water over his chin
  }
  pop();
}
function fakeStache(x, y, s, rot = 0, key = 'stache') {
  boilSeed(key);
  push(); translate(x, y); rotate(rot);
  for (const d of [-1, 1]) paint(ribbon([[d * .05 * s, 0], [d * .35 * s, -.02 * s], [d * .7 * s, .08 * s], [d * .95 * s, -.06 * s], [d * .92 * s, -.28 * s], [d * .78 * s, -.3 * s]], .24 * s, .05 * s), { wash: GK.stache, ink: GK.ink, sw: .6, curv: .5 });
  pop();
}
// the cowherd's bag; (x, y) its top centre; Mooshak's head peeks out of it (peek 0..1)
function cowherdBag(x, y, s, t, peek = 1) {
  if (peek > 0) mooshak(x + s * .1, y + s * .25 - peek * s * .45, s * .16, { boilKey: 'bagmouse', eyes: 'normal', lookX: Math.sin(t * 1.3) > .3 ? -1 : .6, mouth: 'smile', noShadow: true });
  boilSeed('bag');
  paint([[-.5 * s, 0], [.5 * s, 0], [.6 * s, .6 * s], [.4 * s, .95 * s], [-.4 * s, .95 * s], [-.6 * s, .6 * s]], { wash: GK.bag, fill: GK.bagDk, fillOp: 60, tex: .5, ink: GK.ink, sw: .9, curv: .4 });
  inkLine([[-.5 * s, .06 * s], [.5 * s, .06 * s]], 2, GK.bagDk, 'ink', .3);
  for (let i = 0; i < 3; i++) paint(ellPts((-.25 + i * .25) * s, .5 * s, .06 * s, .06 * s, 8), { wash: '#E8573A', ink: null });
}
function shepherdStick(u, sw) {
  boilSeed('stick');
  inkLine([[0, 4.2 * u], [0, -5.5 * u], [.3 * u, -6.6 * u], [1.1 * u, -6.9 * u], [1.6 * u, -6.3 * u], [1.4 * u, -5.7 * u]], sw * 2.6, GK.stick, 'ink', .5);
}
// Shiva peeking over a cloud; (x, y) the cloud's centre, u Shiva's size unit; o: hand 0..1 (his right hand up, counting),
// wince, smile, look
function shivaCloud(x, y, u, t, o = {}) {
  const lift = Math.sin(t * 1.2) * u * .3;
  const hand = clamp(o.hand || 0);
  shiva(x, y + 5 * u + lift, u, { boilKey: 'shivacloud', eyes: o.wince ? 'squeeze' : o.eyes || 'normal', mouth: o.wince ? 'teeth' : o.smile ? 'grin' : 'smile', lookX: o.look ?? -.8, noShadow: true, handR: hand > 0 ? [lerp(4.5, 6.5, hand), lerp(-6, -15.5, hand)] : undefined, snakeEyes: o.wince ? 'closed' : 'open' });
  cloud(x, y + 1.0 * u, u * 6.5, 'shivacl');
}
function groundCrack(x, y, age, s) {
  if (age < 0) return;
  const k = clamp(age / .5), fade = .35 + .65 * (1 - seg(age, .6, 2.2));
  glow(x, y, s * (1.2 + .6 * easeOut(k)), GK.glowGold, .75 * fade);
  boilSeed('crack');
  for (let i = 0; i < 7; i++) {   // cracks fanning out along the ground, squashed into perspective
    const ang = Math.PI + (i + .5) / 7 * Math.PI, L = s * (.6 + .8 * hash(i * 3)) * easeOut(k), c = Math.cos(ang), sn = Math.abs(Math.sin(ang));
    const pts = [[x, y], [x + c * L * .5, y + sn * L * .1 + 4], [x + c * L, y + sn * L * .2 + 8 * hash(i)]];
    inkLine(pts, 3.2, GK.glowGold, 'ink', .2);
    inkLine(pts, 1.2, '#FFF6D6', 'inkfine', .2);
  }
}
// the black stone Maha Ganapati of Gokarna: Bal Bappa, standing, in stone; o: dent 0..1 (its glint), boilKey
const BAL_STONE = {
  skin: '#4A4856', skinDk: '#302E3A', skinLt: '#6E6C7C', earIn: '#3E3C4A', ink: '#1A1820',
  blue: '#C9A23A', blueDk: '#9A7A20', blueLt: '#E8C860', shawl: '#D9483A', shawlDk: '#A8302A',
  orange: '#EDB43C', orangeDk: '#B67D1C', cream: '#FFE39A', tusk: '#D8D0C0', tilak: '#F2EAD8', drop: '#D2302A',
  eye: '#F2E8D0', brow: '#2A2830',
};
function stoneBappa(x, y, u, o = {}) {
  const save = { ...BAL }; Object.assign(BAL, BAL_STONE);
  try { balBappa(x, y, u, { boilKey: o.boilKey || 'stone', stand: 1, col: BAL_STONE.skin, dk: BAL_STONE.skinDk, lt: BAL_STONE.skinLt, eyes: 'normal', mouth: 'smile', noShadow: true, seed: 99 }); }
  finally { Object.assign(BAL, save); }
  // the dent: a little notch on top of the crown's knot, catching the lamp light
  const [dx, dy] = [x - .3 * u, y - 19.3 * u], d = clamp(o.dent ?? 1);
  boilSeed('dent');
  paint(ellPts(dx, dy, .62 * u, .3 * u, 14), { wash: '#6E5A30', ink: BAL_STONE.ink, sw: .8 });
  paint(ellPts(dx, dy + .06 * u, .42 * u, .16 * u, 12), { wash: '#3A2E18', ink: null });
  if (d > 0) { glow(dx, dy, u * 1.6, '#FFE6A0', .5 * d); paint(starPts(dx + .5 * u, dy - .35 * u, u * .45 * d, .3, 4, T), { wash: '#FFF6D6', ink: null }); }
}
function iceBag(x, y, s, t) {   // a classic ice bag: (x, y) its bottom, s its size; drips
  boilSeed('icebag');
  paint([[-.75 * s, -.1 * s], [-.55 * s, .05 * s], [.55 * s, .05 * s], [.75 * s, -.1 * s], [.7 * s, -.5 * s], [.4 * s, -.75 * s], [.22 * s, -.85 * s], [-.22 * s, -.85 * s], [-.4 * s, -.75 * s], [-.7 * s, -.5 * s]], { wash: GK.ice, fill: GK.iceDk, fillOp: 90, tex: .6, ink: GK.ink, sw: 1, curv: .5 });
  for (const k of [-.4, 0, .4]) inkLine([[k * s, -.05 * s], [k * s * .6, -.7 * s]], .8, GK.iceDk, 'inkfine', .4);
  paint(rrPts(-.3 * s, -1.15 * s, .6 * s, .34 * s, .08 * s), { wash: '#E8573A', ink: GK.ink, sw: .9 });
  for (const k of [-.15, 0, .15]) inkLine([[k * s, -1.12 * s], [k * s, -.84 * s]], .7, '#A8302A', 'inkfine', 0);
  paint(ellPts(-.35 * s, -.45 * s, .08 * s, .18 * s, 8), { wash: '#FFFFFF', ink: null });
  for (let i = 0; i < 2; i++) { const k = frac(t * .9 + i * .5); paint([[.7 * s + i * 8, -.2 * s + k * s], [.76 * s + i * 8, -.08 * s + k * s], [.7 * s + i * 8, 0 + k * s], [.64 * s + i * 8, -.08 * s + k * s]], { wash: GK.ice, washOp: 255 * (1 - k), ink: GK.ink, sw: .4, curv: .5 }); }
}

// ---------- the card ----------
function rkCard3(t, C) {
  boilSeed('cardbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: TK.peach, ink: null });
  boilSeed('cardpetals');
  for (let i = 0; i < 9; i++) {
    const x = 60 + hash(i * 3.3) * 960 + 30 * Math.sin(t * .9 + i), y = frac(hash(i * 7.1) + t * (.035 + .02 * hash(i))) * (H + 80) - 40, r = t * .8 + i;
    paint([[x + Math.cos(r) * 15, y + Math.sin(r) * 15], [x + Math.cos(r + 1.6) * 7, y + Math.sin(r + 1.6) * 7], [x - Math.cos(r) * 15, y - Math.sin(r) * 15], [x + Math.cos(r - 1.6) * 7, y + Math.sin(r - 1.6) * 7]], { wash: i % 2 ? TK.marigold : TK.petal, washOp: 200, ink: null, curv: .5 });
  }
  const X = 470, pk = t0 => Math.max(0, t - t0) * 5, br = Math.sin(t * 1.3) * .008;
  if (t > C.logo) picture(PICS.logo, X, 545, 140, 140, { pop: pk(C.logo) });
  if (t > C.cap) letter("Maa's 9 forms, as picture books", X, 665, 50, TK.teal, { screen: true, font: '50px Marcellus', ink: false, pop: pk(C.cap), maxW: 860 });
  if (t > C.covers) [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => {
    const a = Math.max(0, t - C.covers - j * .12);
    if (a > 0) picture(PICS[b], X + i * 215, 960 + Math.abs(i) * 30, 270, 270, { rot: i * .1 + br, pop: a * 5, r: 10, shadow: 22 });
  });
  if (t > C.price) letter('Books 1–3 · Set of 3 for ₹500', X, 1225, 40, TK.brown, { screen: true, font: '700 40px Poppins', ink: false, maxW: 880, pop: pk(C.price) });
  if (t > C.pill) {
    const k = backOut(clamp(pk(C.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('pill');
    push(); translate(X, 1340); scale(k); paint(rrPts(-220, -44, 440, 88, 44), { wash: TK.rkOrange, ink: null }); pop();
    letter('rishikatha.com', X, 1342, 50, TK.cream, { screen: true, font: '700 52px Poppins', ink: false, pop: pk(C.pill) });
  }
  if (t > C.follow) letter('Follow @therishikatha for more!', X, 1440, 36, TK.grey, { screen: true, font: '500 38px Poppins', ink: false, maxW: 860, pop: pk(C.follow) });
}
