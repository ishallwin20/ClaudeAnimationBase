// parshu5_props.js: sets, props and the cast for parshu5.js (ad 74, "PARSHURAMA won the whole EARTH, then gave it
// away", Parshurama series Part 5). Loaded after parshu1_props.js (PK, CP, crownProp, yagnaKund, smokePuff, cloudPuff,
// sparkleBurst, diya, sunsetRidge, skyLapse, richika, RICHIKA_PAL), parshu2_props.js (P2, stormSky, dustPlain, halo,
// lightBeam, navCard), parshu3_props.js (P3, jamadagni, ashramSet, grade, eyeBlaze, wick, nameTag, bloodGround,
// silPal), parshu4_props.js (P4, kartavirya, KART_PAL, sunburst, arrowVolley, podium) and the shared rigs
// (parshurama.js, ramayan.js: valmiki(); jambavan.js; kartikeya.js; cow.js). Pure functions of their arguments (and T).
//   P5                                                   the palette
//   kashyapa, ancestor, kartSon, littlePrince            the cast
//   lakesSet, ridgeFront                                 sets
//   earthBall, sruva, firewood, sticks, pyreFire, signPost, banners, bigCount   props
const P5 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', red: '#FF5A3C',
  sea: '#3E8EC8', seaDk: '#2A6A9E', seaLt: '#8FD0F0', land: '#6FAE52', landDk: '#4A8A3A', sand: '#E8C27A',
  lakeRed: '#8E1424', lakeRedDk: '#5E0A18', lakeRedLt: '#C8323A', lakeBlue: '#4EA6D2', lakeBlueDk: '#2E7AAE', lakeBlueLt: '#B8E4F4',
  plain: '#7A5A4A', plainDk: '#5A3E34', plainLt: '#A8826A',
  wood: '#8A5A32', woodDk: '#5E3A1E', woodLt: '#B88050', twine: '#C8A06A',
  fire: '#FF8A2A', fireIn: '#FFE07A', fireOut: '#E8401E', ember: '#FFB050',
  ghost: '#FFE9B8', board: '#C89A5A', boardDk: '#8A6232',
};

// ---------- the cast ----------
// Kashyapa, the Prajapati, who receives the earth at the horse sacrifice holding the sacrificial ladle (MBh 12.49):
// Valmiki's rig, a long white beard, a turmeric dhoti with a red border, a cream shawl; ladle: the sruva in the screen-left
// hand (ladleA turns it), earth: r (u) the little earth held up in the screen-right hand
const KASH_PAL = { hair: '#F2ECE2', hairLt: '#FFFFFF', dhoti: '#E8B830', dhotiDk: '#B8861A', dhotiLt: '#FFDA6A', border: '#B8282E',
  shawl: '#FFF6E6', shawlDk: '#E2D2B2', skin: '#E0A880', skinDk: '#B87E58', skinLt: '#F4CCA6' };
function kashyapa(x, y, u, o = {}) {
  const prevR = o.armR, prevL = o.armL;
  return valmiki(x, y, u, { boilKey: 'kash', seed: 61, beardLen: 1, ...o, pal: { ...KASH_PAL, ...(o.pal || {}) },
    armL: o.ladle ? (uu, sw) => { sruva(uu, sw, o.ladleA || 0); if (prevL) prevL(uu, sw); } : prevL,
    armR: o.earth ? (uu, sw) => { if (prevR) prevR(uu, sw); earthBall(0, -o.earth * .9 * uu, o.earth * uu, T, 'kearth', false); } : prevR });
}
// the ancestors, the Bhrigus led by Richika (MBh 1.2.6-9; 3.117.10): rishis of light, Valmiki's rig in a pale gold
// wash with a glow behind; i picks the beard and the cloth's tint (0 is Richika: his dark beard from Part 1)
const ANC = [{ beard: '#2A2030', beardLen: .75, base: RICHIKA_PAL }, { beard: '#F4F0E8', beardLen: 1, base: VALMIKI_PAL },
  { beard: '#B8B0B8', beardLen: .9, base: { ...VALMIKI_PAL, dhoti: '#C8603A' } }, { beard: '#F4F0E8', beardLen: .6, base: { ...VALMIKI_PAL, dhoti: '#A8783A' } }];
const ghostPal = (P, k = .5) => Object.fromEntries(Object.entries(P).map(([n, c]) => [n, typeof c === 'string' && c[0] === '#' ? mixCol(c, P5.ghost, k) : c]));
function ancestor(i, x, y, u, o = {}) {
  const A = ANC[i % ANC.length], k = o.ghostK ?? .5;
  glow(x, y - 17 * u, 15 * u, '#FFE6A0', .45 * (o.glowA ?? 1));
  return valmiki(x, y, u, { boilKey: 'anc' + i, seed: 70 + i * 3, beard: mixCol(A.beard, P5.ghost, k * .6), beardLen: A.beardLen, noShadow: true, ...o,
    pal: ghostPal({ ...VALMIKI_PAL, ...A.base, skin: '#E0A880', skinDk: '#B87E58', skinLt: '#F4CCA6', ...(o.pal || {}) }, k) });
}
// Kartavirya's sons (MBh 3.116.23-26; 12.49 "always haughty and cruel"): their father's rig without the thousand arms,
// young (short beards), gold kiritas, each in his own colour
const SONS = [{ dhoti: '#A81E34', dhotiDk: '#741226', dhotiLt: '#D84A5E', shawl: '#F2C230', shawlDk: '#B88A1C' },
  { dhoti: '#5A2E7A', dhotiDk: '#3E1E56', dhotiLt: '#8A5AAE', shawl: '#E8A030', shawlDk: '#B87818', skin: '#C8905E', skinDk: '#A06A40', skinLt: '#E6B484' },
  { dhoti: '#2E5E7A', dhotiDk: '#1E4256', dhotiLt: '#5A8EAE', shawl: '#E8C25A', shawlDk: '#B8922E', skin: '#E0AC7E', skinDk: '#B8845A', skinLt: '#F4CCA2' }];
function kartSon(i, x, y, u, o = {}) {
  return kartavirya(x, y, u, { fan: 0, beardLen: .25, boilKey: 'son' + i, seed: 80 + i * 5, ...o, pal: { ...SONS[i % 3], ...(o.pal || {}) } });
}
// a hidden prince grown up in the wild (MBh 12.49: among bears on the Rikshavat, among cows, among calves): Kartikeya's
// rig, no spear or shield, a plain dhoti; crown 0..1 pops a little kirita on
const KIDS = [{ teal: '#8A5A3A', tealDk: '#5E3A22', tealLt: '#B8865E', skin: '#D49A6E', skinDk: '#AE744C', skinLt: '#EEC09A' },
  { teal: '#E2D2AE', tealDk: '#B8A47C', tealLt: '#F6ECD4', skin: '#E6B48A', skinDk: '#C28C62', skinLt: '#F8D2B0' }];
function littlePrince(i, x, y, u, o = {}) {
  const c = clamp(o.crownK || 0);
  return kartikeya(x, y, u, { spear: false, shield: false, feather: false, boilKey: 'kid' + i, seed: 90 + i, ...o, crown: c > .5 ? 1 : 0, pal: { ...KIDS[i % 2], ...(o.pal || {}) } });
}

// ---------- props ----------
// the earth as a little globe (the way Varaha lifts her): a blue sea, green and ochre lands turning slowly, a soft
// shine; (x, y) its centre, r its radius; glowOn draws a warm light behind it
function earthBall(x, y, r, t, key = 'earth', glowOn = true) {
  if (glowOn) glow(x, y, r * 1.9, '#BFE6FF', .45);
  boilSeed(key);
  paint(ellPts(x, y, r, r, 36), { wash: P5.sea, fill: P5.seaDk, fillOp: 60, tex: .4, ink: P5.ink, sw: 1.4 });
  const LANDS = [[0, .35, .42, .3], [.9, -.35, .3, .36], [1.9, .1, .36, .26], [2.8, -.45, .24, .2], [3.7, .4, .3, .22], [4.6, -.1, .4, .34], [5.5, .5, .22, .18]];
  for (let i = 0; i < LANDS.length; i++) {
    const [lon, lat, w, h] = LANDS[i], a = lon + t * .25, s = Math.sin(a), c = Math.cos(a);
    if (c < .15) continue;   // on the far side
    const cx = x + s * r * .78 * Math.sqrt(1 - lat * lat), cy = y + lat * r * .8, sx = w * r * c * .9, sy = h * r;
    boilSeed(key + 'l' + i);
    paint(ellPts(cx, cy, sx, sy, 14, 3), { wash: i % 3 === 1 ? P5.sand : P5.land, fill: P5.landDk, fillOp: 50, tex: .4, ink: null });
  }
  boilSeed(key + 'shine');
  paint(ellPts(x - r * .35, y - r * .4, r * .32, r * .2, 16, 0, -.6), { wash: '#FFFFFF', washOp: 120, ink: null });
  paint(ellPts(x, y, r, r, 36), { ink: P5.ink, sw: 1.4 });
}
// the sruva, the sacrificial ladle, in hand space (upright): a long wooden handle and a small cupped bowl at the top; a turns it
function sruva(u, sw, a = 0) {
  push(); rotate(a);
  paint(ribbon(U([[0, 3.5], [0, -1], [0, -7]], u), .32 * u, .26 * u), { wash: P5.wood, fill: P5.woodDk, fillOp: 50, tex: .5, ink: P5.ink, sw: sw * .6 });
  paint(ellPts(0, -7.6 * u, .9 * u, .6 * u, 12), { wash: P5.woodLt, fill: P5.woodDk, fillOp: 50, tex: .4, ink: P5.ink, sw: sw * .6 });
  paint(ellPts(0, -7.75 * u, .55 * u, .3 * u, 10), { wash: '#F6C24A', ink: null });   // ghee in the bowl
  pop();
}
// a bundle of firewood and kusha grass on the shoulder, in hand space at his right hand (MBh 3.116.27: "bearing fuel")
function firewood(u, sw) {
  boilSeed('fwood');
  for (let i = 0; i < 5; i++) {
    const y0 = -1.4 + i * .5, a = (i - 2) * .05;
    paint(ribbon(U([[-4.2, y0 + a * 8], [0, y0], [4.6, y0 - a * 8]], u), .5 * u, .45 * u), { wash: i % 2 ? P5.wood : P5.woodLt, fill: P5.woodDk, fillOp: 50, tex: .5, ink: P5.ink, sw: sw * .5 });
  }
  for (const xx of [-2.2, 2.4]) paint(rrPts((xx - .3) * u, -1.9 * u, .6 * u, 2.9 * u, .2 * u), { wash: P5.twine, ink: P5.ink, sw: sw * .4 });
  for (let i = 0; i < 6; i++) inkLine(U([[3.8, -.6 + i * .2], [6 + i * .2, -1.8 + i * .5]], u), sw * .5, '#B8B05A', 'inkfine', .3);   // kusha
}
// the bundle dropped: sticks tumbling from (x, y) to the ground at gy, age seconds since
function sticks(x, y, gy, s, age, key = 'sticks') {
  for (let i = 0; i < 5; i++) {
    const k = clamp(age / (.35 + .08 * i)), px = x + (i - 2) * s * .3 * k + Math.sin(i * 3) * s * .2 * k, py = lerp(y, gy - i * 3, easeIn(k)), a = (i - 2) * .5 * k + (k < 1 ? k * 2 : 2) * (i % 2 ? 1 : -1) * .3;
    boilSeed(key + i);
    const c = Math.cos(a) * s * .5, d = Math.sin(a) * s * .5;
    paint(ribbon([[px - c, py - d], [px, py], [px + c, py + d]], s * .055, s * .05), { wash: i % 2 ? P5.wood : P5.woodLt, fill: P5.woodDk, fillOp: 50, tex: .5, ink: P5.ink, sw: .8 });
  }
}
// a funeral pyre in the foreground: crossed logs and tall flames, (x, y) the base centre, w wide; embers rise
function pyreFire(x, y, w, t, key = 'pyre') {
  glow(x, y - w * .5, w * 1.3, '#FF8A3A', .7);
  boilSeed(key + 'logs');
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) {
    const yy = y - r * w * .07, xx = x + (i - 1.5) * w * .24 + (r % 2) * w * .1;
    paint(ribbon([[xx - w * .16, yy + 6], [xx + w * .16, yy - 6]], w * .045, w * .045), { wash: P5.wood, fill: P5.woodDk, fillOp: 60, tex: .5, ink: P5.ink, sw: .9 });
  }
  boilSeed(key + 'fire');
  const by = y - w * .18;
  for (let i = 0; i < 7; i++) {
    const fx = x + (i - 3) * w * .13, h = w * (.38 + .2 * Math.sin(i * 1.9 + 1)) * (1 + .14 * Math.sin(t * 11 + i * 2.1)), fw = w * .1;
    paint([[fx - fw, by], [fx - fw * .6, by - h * .5], [fx + Math.sin(t * 7 + i) * fw * .6, by - h], [fx + fw * .6, by - h * .5], [fx + fw, by]], { wash: i % 2 ? P5.fire : P5.fireOut, ink: null, curv: .6 });
  }
  for (let i = 0; i < 4; i++) { const fx = x + (i - 1.5) * w * .16, h = w * .26 * (1 + .18 * Math.sin(t * 13 + i)); paint([[fx - w * .05, by], [fx, by - h], [fx + w * .05, by]], { wash: P5.fireIn, ink: null, curv: .6 }); }
  boilSeed(key + 'emb');
  for (let i = 0; i < 14; i++) {
    const k = frac(hash(i * 3.1) + t * (.25 + .15 * hash(i))), ex = x + (hash(i * 7.3) - .5) * w + Math.sin(t * 2 + i) * 30, ey = by - k * w * 2.2;
    paint(ellPts(ex, ey, 5 * (1 - k) + 2, 5 * (1 - k) + 2, 6), { wash: i % 2 ? P5.ember : P5.fireIn, washOp: 230 * (1 - k), ink: null });
  }
}
// a wooden signpost, its foot at (x, y), the board w wide, a name on it (world-space letters); k 0..1 pops it up
function signPost(x, y, w, txt, k = 1, key = 'sign') {
  if (k <= 0) return;
  const h = w * .7 * backOut(k);
  boilSeed(key);
  paint(rrPts(x - w * .04, y - h, w * .08, h, 4), { wash: P5.wood, fill: P5.woodDk, fillOp: 50, tex: .5, ink: P5.ink, sw: 1 });
  paint(rrPts(x - w / 2, y - h - w * .16, w, w * .22, 8), { wash: P5.board, fill: P5.boardDk, fillOp: 50, tex: .5, ink: P5.ink, sw: 1.2 });
  flushLetters();
  letter(txt, x, y - h - w * .05, w * .115, '#3A2416', { screen: false, ink: false, rot: -.02 });
}
// war banners on the horizon (the armies of the Mahabharata, far off): poles with pennants, k fades them in
function banners(x0, x1, y, k, t, key = 'ban', cols = ['#E8B830', '#C8323A', '#F2F2F2', '#3E86B8']) {
  if (k <= 0) return;
  boilSeed(key);
  for (let i = 0; i < 9; i++) {
    const x = lerp(x0, x1, i / 8) + (hash(i * 2.2) - .5) * 40, h = 120 + 50 * hash(i * 3.7), f = Math.sin(t * 4 + i) * 10;
    inkLine([[x, y], [x, y - h]], 2.4, mixCol('#3A2A2A', '#7A5A6A', .3), 'ink', 0);
    paint([[x, y - h], [x + 56, y - h + 10 + f * .4], [x + 50 + f * .3, y - h + 22], [x, y - h + 30]], { wash: cols[i % cols.length], washOp: 255 * k, ink: null, curv: .4 });
  }
}
// a big gold number for a count, in screen space, popped by its own tick
function bigCount(n, x, y, size, age) {
  flushLetters();
  letter(String(n), x, y, size, P5.gold, { screen: true, stroke: P5.ink, sw: .2, ink: false, pop: Math.max(.01, age * 6), rot: -.03 });
}

// ---------- sets ----------
// Samantapanchaka (MBh 1.2.3-9): a plain seen from a rise, five lakes in a loose ring; blue 0..1 turns them from blood
// to clear water with lotuses (the ancestors' boon: holy tirthas); sky 'dusk' | 'gold'
function lakesSet(t, blue = 0, o = {}) {
  const gold = clamp(o.gold || 0), key = 'lk';
  boilSeed(key + 'sky');
  paint(rectPts(-300, -300, W + 600, 1100), { wash: mixCol('#3A1E3E', '#E8A86A', gold), ink: null });
  paint(ellPts(540, 760, 1100, 300, 26), { wash: mixCol('#7A2A3A', '#FFD89A', gold), washOp: 220, ink: null });
  glow(540, 740, 500, mixCol('#C8402A', '#FFE6A0', gold), .45);
  boilSeed(key + 'hills');
  paint([[-300, 800], [0, 740], [300, 780], [640, 720], [1000, 770], [1380, 740], [1380, 900], [-300, 900]], { wash: mixCol('#3E2232', '#8A6A5A', gold), ink: null, curv: .5 });
  boilSeed(key + 'plain');
  paint(rectPts(-300, 820, W + 600, 1800), { wash: mixCol(P5.plainDk, '#9A8A5A', gold), ink: null });
  paint(ellPts(540, 1350, 1000, 500, 26), { fill: mixCol(P5.plain, '#B8A86A', gold), fillOp: 200, bleed: .3, tex: .5, ink: null });
  const L = [[540, 1000, 230, 60], [190, 1150, 210, 70], [890, 1150, 220, 70], [320, 1420, 260, 95], [790, 1430, 250, 95]];
  L.forEach(([x, y, w, h], i) => {
    boilSeed(key + 'lake' + i);
    paint(ellPts(x, y + h * .12, w * 1.06, h * 1.1, 26, 3), { wash: mixCol('#4A3026', '#7A6A3E', gold), ink: null });
    paint(ellPts(x, y, w, h, 26, 3), { wash: mixCol(P5.lakeRed, P5.lakeBlue, blue), fill: mixCol(P5.lakeRedDk, P5.lakeBlueDk, blue), fillOp: 60, tex: .4, ink: P5.ink, sw: 1 });
    paint(ellPts(x - w * .2, y - h * .25, w * .45, h * .18, 14), { wash: mixCol(P5.lakeRedLt, P5.lakeBlueLt, blue), washOp: 140, ink: null });
    if (blue > .6) for (let j = 0; j < 3; j++) {
      const lx = x + (hash(i * 3 + j) - .5) * w * 1.2, ly = y + (hash(i * 7 + j) - .3) * h * .8, s = 14 * clamp((blue - .6) / .4);
      paint(ellPts(lx, ly + s * .4, s * 1.5, s * .5, 10), { wash: P1.leaf, ink: null });
      paint([[lx - s * .8, ly], [lx - s * .4, ly - s], [lx, ly - s * .5], [lx + s * .4, ly - s], [lx + s * .8, ly]], { wash: P3.lotus, ink: null, curv: .4 });
    }
  });
  boilSeed(key + 'grass');
  for (let i = 0; i < 16; i++) { const x = -100 + hash(i * 4.4) * 1300, y = 900 + hash(i * 2.6) * 900; for (let j = -1; j <= 1; j++) inkLine([[x, y], [x + j * 8, y - 22 - 8 * hash(i + j)]], 1.4, mixCol('#5A3A30', '#6A7A3A', gold), 'inkfine', 0); }
}
// a dark ridge across the foreground for the time-lapse march (its crest at y = top)
function ridgeFront(top, col = '#1C0E16', key = 'rfront') {
  boilSeed(key);
  paint([[-300, 2400], [-300, top + 60], [100, top + 10], [400, top], [700, top + 20], [1000, top - 10], [1380, top + 30], [1380, 2400]], { wash: col, ink: null, curv: .4 });
}
