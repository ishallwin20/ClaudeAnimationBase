// mira_sets.js: the paintings of "Saanwaro nahi aayo" (Mira's song, a poem by Shivangi Singh), in the Miniature style.
// Each set is drawn in screen pixels at the camera's rest; the folio covers anything outside MN.win.
const MC = MN.col;

// ---------- the terrace (dusk and night) ----------
// mrTerrace(c, t, o): far hills and a path, a marble terrace with a rail, a pavilion on the right with a dome.
//   o.night 0..1 (dusk → night), o.peacock, o.rain
function mrSkyTerrace(c, t, o = {}) {
  const n = o.night || 0;
  mnSky(c, 'dusk', { hy: 980, to: 'night', k: n });
  if (n > .3) mnStars(c, 70, [60, 60, 1020, 760], 3, t, (n - .3) / .7);
  if (o.moon) mnMoon(c, o.moon[0], o.moon[1], 30, { glow: .3 });
  mnCloudBand(c, 60 + t * 3, 330, 460, { seed: 2, col: mixCol('#EBC6AE', '#55648E', n), under: mixCol('#9C8AB0', '#1A2348', n) });
  mnCloudBand(c, 560 - t * 2, 470, 380, { seed: 5, col: mixCol('#E8BCA6', '#4D5C88', n), under: mixCol('#9C8AB0', '#1A2348', n) });
  mnCloudBand(c, 300 + t * 1.5, 640, 300, { seed: 8, th: 18, col: mixCol('#F0CDB2', '#5C6B96', n), under: mixCol('#B898A8', '#1A2348', n) });
}
function mrFarHills(c, t, o = {}) {
  const n = o.night || 0, dk = (col, k = .72) => mixCol(col, '#0E1630', n * k);
  mnHill(c, [[-40, 930], [140, 850], [330, 880], [520, 820], [760, 870], [1120, 830], [1120, 1200, 1], [-40, 1200, 1]], dk('#7C9A82'), { rimN: 6, rim: dk('#E9E2C0') });
  // a far temple on a hill
  mnFill(c, [[612, 830, 1], [648, 830, 1], [648, 806, 1], [612, 806, 1]], dk('#F1E8D8'), { lw: 1.2 });
  mnDome(c, 630, 806, 34, dk('#F1E8D8'));
  for (let i = 0; i < 9; i++) mnTree(c, 70 + i * 120 + (i % 2) * 30, 880 + (i % 3) * 14 + (i === 4 ? -40 : 0), 70 + (i % 3) * 14, ['dome', 'cypress', 'dome', 'mango', 'cypress', 'dome', 'blossom', 'cypress', 'dome'][i], { seed: 20 + i, leaf: dk('#2E4A26', .5) });
  mnHill(c, [[-40, 1010], [200, 950], [460, 990], [700, 960], [1120, 1000], [1120, 1300, 1], [-40, 1300, 1]], dk('#5F8450'), { rimN: 5, rim: dk('#E4E0B0') });
  // the path, winding away to the far hills
  mnFill(c, [[150, 1300, 1], [300, 1300, 1], [310, 1150], [380, 1060], [470, 1000], [520, 975], [530, 978], [490, 1005], [370, 1080], [250, 1160]], dk('#D9B98A'), { lw: 1.4 });
  for (let i = 0; i < 6; i++) mnTree(c, 40 + i * 190, 1010 + (i % 2) * 20, 110 + (i % 2) * 30, i % 3 === 1 ? 'cypress' : 'dome', { seed: 40 + i, leaf: dk('#2E4A26', .5) });
}
function mrTerrace(c, t, o = {}) {
  const n = o.night || 0, dk = (col, k = .6) => mixCol(col, '#101A38', n * k);
  // the marble floor
  mnFill(c, [[-40, 1120, 1], [1120, 1120, 1], [1120, 1900, 1], [-40, 1900, 1]], dk(MC.stone), { lw: 1.4 });
  c.save(); c.strokeStyle = rgba(mnLineCol(MC.stone), .35); c.lineWidth = 1; for (let i = -8; i < 16; i++) { c.beginPath(); c.moveTo(540 + i * 90, 1120); c.lineTo(540 + i * 150, 1900); c.stroke(); } for (const y of [1180, 1280, 1420, 1600]) { c.beginPath(); c.moveTo(-40, y); c.lineTo(1120, y); c.stroke(); } c.restore();
}
function mrRail(c, t, o = {}) {
  const n = o.night || 0, col = mixCol(MC.white, '#101A38', n * .55);
  mnRail(c, -40, 1120, 1250, 92, col, { gap: 26 });
  mnFill(c, [[-40, 1162, 1], [1120, 1162, 1], [1120, 1146, 1], [-40, 1146, 1]], mixCol('#E2D6C0', '#101A38', n * .55), { lw: 1.4 });
}
// the pavilion on the right: a pillar, a cusped arch, a dome; a lamp niche
function mrPavilion(c, t, o = {}) {
  const n = o.night || 0, col = mixCol(MC.white, '#101A38', n * .5), x0 = o.x0 ?? 800;
  // the arch's dark interior
  const arch = mnArchPath(x0 + 170, 1150, 260, 380);
  mnFill(c, arch, mixCol('#7A2A22', '#1A0E10', n * .6), { lw: 1.6 });
  c.save(); c.clip(arch); glow(c, x0 + 170, 1000, 260, '#E89A50', .25 * (o.lamp ?? 1), 'lighter'); c.restore();
  // the body round the arch
  const p = new Path2D(); p.rect(x0, 560, 400, 600); p.addPath(arch);
  c.save(); c.fillStyle = col; c.fill(p, 'evenodd'); c.strokeStyle = mnLineCol(col); c.lineWidth = 1.6; c.stroke(p); c.restore();
  // pillar bands, a cornice, the dome
  mnFill(c, [[x0 - 20, 560, 1], [x0 + 420, 560, 1], [x0 + 420, 530, 1], [x0 - 20, 530, 1]], mixCol('#E6DCC8', '#101A38', n * .5), { lw: 1.6 });
  mnDome(c, x0 + 170, 530, 220, col);
  for (const px of [x0 + 30, x0 + 310]) { mnFill(c, [[px, 1150, 1], [px + 22, 1150, 1], [px + 22, 760, 1], [px, 760, 1]], mixCol('#E9DFCB', '#101A38', n * .5), { lw: 1.2 }); }
  mnStroke(c, [[x0, 620], [x0 + 400, 620]], mixCol(MC.gold, '#101A38', n * .4), 3);
  if (o.peacock) mnPeacock(c, x0 + 230, 516 - 120, .9, { flip: true });
  mnDiya(c, x0 + 170, 1140, 1.4, t, { glow: o.lamp ?? 1 });
}

// ---------- the street and the jharokha ----------
function mrStreet(c, t, o = {}) {
  mnSky(c, 'dusk', { hy: 700 });
  mnCloudBand(c, 520 + t * 4, 150, 420, { seed: 12, col: '#ECCDB4' });
  // the palace wall (pink sandstone) on the left, with the jharokha
  const wall = '#E8C3AE';
  mnFill(c, [[-40, -100, 1], [600, -100, 1], [600, 1120, 1], [-40, 1120, 1]], wall, { lw: 1.6, shade: ['#9A6A5A', 600, 0, -40, 0], shadeA: .3 });
  c.save(); c.strokeStyle = rgba('#9A6A5A', .35); c.lineWidth = 1; for (let y = -60; y < 1120; y += 46) { c.beginPath(); c.moveTo(-40, y); c.lineTo(600, y); c.stroke(); for (let x = (y / 46 % 2) * 60; x < 600; x += 120) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 46); c.stroke(); } } c.restore();
  // a far house and trees on the right
  mnHill(c, [[560, 760], [800, 700], [1120, 740], [1120, 1100, 1], [560, 1100, 1]], '#7C9A72', { rimN: 3 });
  mnTree(c, 700, 900, 240, 'dome', { seed: 61 }); mnTree(c, 960, 880, 280, 'cypress', { seed: 62 }); mnTree(c, 1020, 920, 190, 'mango', { seed: 63 });
  mnFill(c, [[780, 1060, 1], [1060, 1060, 1], [1060, 900, 1], [780, 900, 1]], '#F2E9DA', { lw: 1.4 });
  mnFill(c, [[770, 900, 1], [920, 830], [1070, 900, 1]], '#B5622E', { lw: 1.4 });
  mnFill(c, mnArchPath(920, 1060, 70, 70, 3), '#5A2A1E', { lw: 1.2 });
  // the street
  mnFill(c, [[-40, 1100, 1], [1120, 1100, 1], [1120, 1900, 1], [-40, 1900, 1]], '#D8B27A', { lw: 1.4 });
  c.save(); c.fillStyle = 'rgba(140,90,40,.25)'; for (let i = 0; i < 60; i++) { c.beginPath(); c.ellipse(lerp(0, 1080, hash(i)), lerp(1120, 1880, hash(i + 3)), 3, 1.5, 0, 0, TAU); c.fill(); } c.restore();
}
// the jharokha box: back (dark), then whoever is inside, then the front (parapet and arch frame)
function mrJharokhaBack(c, x, y) { mnFill(c, [[x - 150, y + 10, 1], [x + 150, y + 10, 1], [x + 150, y - 300, 1], [x - 150, y - 300, 1]], '#4A1E18', { lw: 1.4 }); glow(c, x, y - 140, 200, '#F0A050', .2, 'lighter'); }
function mrJharokhaFront(c, x, y) {
  const col = '#F2E6D6';
  const outer = new Path2D(); outer.rect(x - 180, y - 380, 360, 400);
  const p = new Path2D(); p.addPath(outer); p.addPath(mnArchPath(x, y + 10, 280, 230, 5));
  c.save(); c.fillStyle = col; c.fill(p, 'evenodd'); c.strokeStyle = mnLineCol(col); c.lineWidth = 1.6; c.stroke(p); c.restore();
  // the parapet (covers her below the chest), brackets, a little dome on top
  mnFill(c, [[x - 190, y + 120, 1], [x + 190, y + 120, 1], [x + 190, y - 10, 1], [x - 190, y - 10, 1]], col, { lw: 1.6 });
  for (let i = 0; i < 6; i++) mnFill(c, mnArchPath(x - 150 + i * 60, y + 100, 34, 50, 3), '#C99A7A', { lw: 1 });
  for (const bx of [x - 150, x, x + 150]) mnFill(c, [[bx - 20, y + 120, 1], [bx + 20, y + 120, 1], [bx + 6, y + 190], [bx - 6, y + 190]], col, { lw: 1.4 });
  mnFill(c, [[x - 200, y - 380, 1], [x + 200, y - 380, 1], [x + 200, y - 404, 1], [x - 200, y - 404, 1]], '#E6D6C0', { lw: 1.4 });
  mnDome(c, x, y - 404, 200, col);
}

// ---------- the chamber (parrot, shrine, dance) ----------
function mrChamber(c, t, o = {}) {
  // a red wall, a window with the evening sky, a dhurrie floor
  mnFill(c, [[-40, -100, 1], [1120, -100, 1], [1120, 1140, 1], [-40, 1140, 1]], '#B23F2E', { lw: 1.4, shade: ['#5A1A10', 0, 200, 0, 1140], shadeA: .35 });
  if (o.window !== false) {
    const wx = o.wx ?? 760, wy = o.wy ?? 860, arch = mnArchPath(wx, wy, 300, 330);
    c.save(); c.clip(arch); mnSky(c, o.sky || 'dusk', { hy: wy, y0: wy - 600 }); mnCloudBand(c, wx - 140 + t * 4, wy - 360, 220, { seed: 31, th: 16 }); mnHill(c, [[wx - 200, wy - 40], [wx, wy - 90], [wx + 200, wy - 50], [wx + 200, wy + 10, 1], [wx - 200, wy + 10, 1]], '#6E8C70', { rim: false }); mnTree(c, wx - 60, wy - 30, 120, 'cypress', { seed: 71 }); mnTree(c, wx + 70, wy - 20, 100, 'dome', { seed: 72 }); c.restore();
    c.save(); c.strokeStyle = MC.gold; c.lineWidth = 6; c.stroke(arch); c.strokeStyle = mnLineCol('#B23F2E'); c.lineWidth = 1.6; c.stroke(arch); c.restore();
    mnFill(c, [[wx - 170, wy + 26, 1], [wx + 170, wy + 26, 1], [wx + 170, wy, 1], [wx - 170, wy, 1]], '#EDE2CC', { lw: 1.4 });
  }
  // a border frieze at the top
  mnFill(c, [[-40, 300, 1], [1120, 300, 1], [1120, 330, 1], [-40, 330, 1]], '#E8B83C', { lw: 1.2 });
  for (let x = 0; x < 1080; x += 40) mnDot(c, x + 20, 315, 5, '#B23F2E');
  // the floor: a striped dhurrie
  mnFill(c, [[-40, 1140, 1], [1120, 1140, 1], [1120, 1900, 1], [-40, 1900, 1]], '#EFE3C6', { lw: 1.4 });
  c.save(); for (let i = 0; i < 12; i++) { const y = 1160 + i * 60; c.fillStyle = i % 2 ? 'rgba(178,63,46,.55)' : 'rgba(40,52,107,.35)'; c.fillRect(-40, y, 1160, 14); } c.restore();
}
function mrCage(c, x, y, t) {
  mnStroke(c, [[x, y - 200], [x, y - 120]], MC.gold, 2);
  c.save(); c.strokeStyle = MC.gold; c.lineWidth = 2; for (let i = 0; i <= 8; i++) { const u = i / 8; c.beginPath(); c.moveTo(x, y - 120); c.quadraticCurveTo(x + (u - .5) * 140, y - 100, x + (u - .5) * 100, y); c.stroke(); } c.beginPath(); c.ellipse(x, y, 50, 10, 0, 0, TAU); c.stroke(); c.restore();
}
// the shrine niche with Giridhar Gopal, lamps and flowers
function mrShrine(c, x, y, t) {
  const arch = mnArchPath(x, y, 260, 300);
  mnFill(c, arch, '#2A1E3A', { lw: 1.6 });
  c.save(); c.clip(arch); glow(c, x, y - 160, 220, '#F2B860', .35, 'lighter'); c.restore();
  c.save(); c.strokeStyle = MC.gold; c.lineWidth = 8; c.stroke(arch); c.restore();
  mnMurti(c, x, y - 14, .78);
  for (const dx of [-100, 100]) mnDiya(c, x + dx, y - 8, 1.1, t + dx);
  // marigold strings along the arch
  for (let i = 0; i < 26; i++) { const u = i / 25, px = x - 130 + u * 260, py = y - 300 - Math.sin(u * Math.PI) * 60 + Math.sin(u * Math.PI * 3) * 12; mnDot(c, px, py, 7, i % 3 ? '#F0A020' : '#F7F0E0'); }
  mnFill(c, [[x - 160, y + 26, 1], [x + 160, y + 26, 1], [x + 160, y, 1], [x - 160, y, 1]], '#EDE2CC', { lw: 1.4 });
  for (let i = 0; i < 7; i++) mnDot(c, x - 120 + i * 40, y + 13, 6, ['#F0A020', '#F7F0E0', '#C9372A'][i % 3]);
}

// ---------- the river scroll ----------
// a winding river from its source (top) down the hills; R(y) its centre x and half-width at world y
const RIVER = { top: 1100, bot: 5600 };
function mrRiverAt(y) {
  const u = clamp((y - RIVER.top) / (RIVER.bot - RIVER.top));
  return [540 + Math.sin(u * 7.2 + .6) * 230 * Math.min(1, u * 4) + Math.sin(u * 17) * 30 * u, 10 + 230 * Math.pow(u, .8)];
}
function mrRiverPath(y0, y1) {
  const L = [], R = [];
  for (let y = y0; y <= y1; y += 20) { const [cx, hw] = mrRiverAt(y); L.push([cx - hw, y]); R.unshift([cx + hw, y]); }
  return L.concat(R);
}

// ---------- her feet with ghungroo (the anklets close) ----------
// mrFoot(c, x, y, s, o): a foot in profile facing right, heel at (x, y); o.lift (0..1 up on the toes), o.back (the far foot)
function mrFoot(c, x, y, s, o = {}) {
  const lift = o.lift || 0, skin = o.back ? '#DDB49A' : MIRA.skin;
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(250, 0); c.rotate(-lift * .45); c.translate(-250, 0);
  const P = [[-16, -46], [-4, -6], [26, 0], [96, -8], [190, 2], [246, 5], [272, -3], [270, -17], [236, -30], [160, -52], [104, -92], [76, -150], [72, -230], [74, -380, 1], [2, -380, 1], [2, -230], [0, -130], [-12, -90]];
  mnFill(c, P, skin, { shade: ['#C08A6A', 120, -180, 120, 0], shadeA: .4 });
  // alta: red along the sole and on the toes
  mnStroke(c, [[-8, -10], [26, -1], [96, -7], [190, 1], [246, 4], [266, -5]], '#C9372A', 7);
  for (const tx of [222, 238, 252, 264]) mnDot(c, tx, -10, 4.2, '#C9372A');
  mnStroke(c, [[236, -28], [266, -14]], mnLineCol(skin), 1.4);
  // a toe ring
  mnStroke(c, [[226, -22], [228, -6]], '#E8E2D0', 3);
  // ghungroo: three rows of small brass bells round the ankle
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) {
    const bx = 2 + i * 12 + r * 3, by = -150 + r * 15 + Math.sin(i * .9) * 2 + (o.jingle ? Math.sin((o.t || 0) * 40 + i + r) * 1.4 : 0);
    mnEll(c, bx, by, 6.5, 6.5, '#D9A93A', { line: '#7A5414', lw: 1 }); mnDot(c, bx - 2, by - 2, 1.8, '#FFF1B8'); mnStroke(c, [[bx - 3, by + 2.5], [bx + 3, by + 2.5]], '#5A3A0A', 1);
  }
  mnStroke(c, [[-4, -166], [100, -166]], '#C9372A', 3);
  c.restore();
}
function mrFeetClose(c, t) {
  // the dhurrie floor seen low, the red wall above
  mnFill(c, [[-40, -100, 1], [1120, -100, 1], [1120, 860, 1], [-40, 860, 1]], '#B23F2E', { lw: 1.4, shade: ['#5A1A10', 0, 200, 0, 860], shadeA: .35 });
  mnFill(c, [[-40, 860, 1], [1120, 860, 1], [1120, 1900, 1], [-40, 1900, 1]], '#EFE3C6', { lw: 1.4 });
  c.save(); for (let i = 0; i < 14; i++) { const y = 880 + i * 46 + i * i * 2; c.fillStyle = i % 2 ? 'rgba(178,63,46,.55)' : 'rgba(40,52,107,.35)'; c.fillRect(-40, y, 1160, 10 + i * 1.2); } c.restore();
  const beat = t * 2.6, k1 = Math.max(0, Math.sin(beat * Math.PI)), k2 = Math.max(0, -Math.sin(beat * Math.PI));
  mrFoot(c, 380, 1090 - k2 * 40, 1.25, { lift: k2, back: true, jingle: k2 > .2, t });
  // the hem of her ghagra swinging just above the feet
  const sw = Math.sin(beat * Math.PI) * 26, hy = 905 + Math.abs(sw) * .3;
  mnFill(c, [[-40, -100, 1], [1120, -100, 1], [1120, hy - 30 + sw * .5], [800, hy + 10 - sw * .2], [500, hy + 30], [200, hy + 10 + sw * .2], [-40, hy - 20 - sw * .5]], MIRA.ghagra, { shade: [MIRA.fold, 0, 0, 0, hy], shadeA: .35 });
  for (let i = 0; i < 12; i++) mnStroke(c, [[i * 100 - 40, 0], [i * 100 - 40 + sw * .6, hy - 40]], MIRA.fold, 1.6);
  const hem = mnPts([[-40, hy - 37 - sw * .5], [200, hy - 7 + sw * .2], [500, hy + 13], [800, hy - 7 - sw * .2], [1120, hy - 47 + sw * .5]], false);
  c.save(); c.strokeStyle = MIRA.gold; c.lineWidth = 34; c.beginPath(); hem.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); c.strokeStyle = MIRA.border; c.lineWidth = 8; c.stroke(); c.restore();
  // the near foot in front of the floor but under the skirt: clipped below the hem band, so the leg goes up into it
  c.save(); c.beginPath(); hem.forEach(([px, py], i) => i ? c.lineTo(px, py + 10) : c.moveTo(px, py + 10)); c.lineTo(1120, 2000); c.lineTo(-40, 2000); c.closePath(); c.clip();
  mrFoot(c, 470, 1150 - k1 * 40, 1.4, { lift: k1, jingle: k1 > .2, t });
  c.restore();
  // the hem's lower edge over the leg, so it reads as tucked behind the border
  c.save(); c.strokeStyle = MIRA.border; c.lineWidth = 3; c.beginPath(); hem.forEach(([px, py], i) => i ? c.lineTo(px, py + 16) : c.moveTo(px, py + 16)); c.stroke(); c.restore();
  return [[470 + 60, 1150 - k1 * 40 - 210, k1], [380 + 50, 1090 - k2 * 40 - 190, k2]];
}

// ---------- the temple (her childhood): the sanctum with Giridhar's murti ----------
// mrMohan(c, x, y, s, o): Krishna's murti, front view, black stone in tribhanga with the flute, standing on a gold
// lotus: the tall gold mukut with its peacock feather (always on his head), makara kundalas, the long temple eyes, a
// sandal tilak, yellow pitambar, a vaijayanti mala. ~1000 units tall. o.glow 0..1 (the lamps' gold on the stone)
function mrMohan(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  mnScaleLines(s, () => {
    const bk = '#262A40', bkL = '#46506E', gd = MC.gold, gl = o.glow || 0;
    // the lotus pedestal
    mnFill(c, [[-170, 0, 1], [170, 0, 1], [160, -40, 1], [-160, -40, 1]], '#B88A2E', { lw: 1.4 });
    for (let i = 0; i < 9; i++) { const px = -150 + i * 37.5; mnFill(c, [[px - 20, -40], [px, -92], [px + 20, -40]], i % 2 ? '#F0B7C0' : '#E8909C', { lw: 1 }); }
    mnFill(c, [[-130, -86, 1], [130, -86, 1], [130, -100, 1], [-130, -100, 1]], gd, { lw: 1.2 });
    // legs: the right crossed over the left at the ankle (tribhanga), gold anklets
    mnLimb(c, [[30, -104], [50, -260], [40, -420]], [30, 36, 46], bk);
    mnLimb(c, [[-34, -104], [10, -260], [-30, -420]], [30, 36, 46], bk);
    mnFill(c, [[22, -104], [62, -100], [64, -92, 1], [18, -92, 1]], bk, { lw: .9 }); mnFill(c, [[-44, -104], [-6, -100], [-4, -92, 1], [-48, -92, 1]], bk, { lw: .9 });
    for (const [ax, ay] of [[30, -122], [-30, -122]]) mnFill(c, [[ax - 22, ay - 8, 1], [ax + 22, ay - 8, 1], [ax + 22, ay + 6, 1], [ax - 22, ay + 6, 1]], gd, { lw: .9 });
    // the pitambar: yellow, pleated, a red-and-gold border; the sash's ends hanging between the knees
    const dh = [[-70, -600], [70, -600], [84, -470], [96, -360, 1], [40, -340], [-10, -360], [-60, -340], [-100, -362, 1], [-86, -480]];
    mnFill(c, dh, MC.yellow, { shade: ['#B07A10', 60, -600, -60, -360], shadeA: .4 });
    for (let i = 0; i < 6; i++) mnStroke(c, [[-50 + i * 20, -590], [-70 + i * 30, -360]], '#B98A1E', MN.lw * .9);
    mnStroke(c, [[96, -362], [40, -342], [-10, -362], [-60, -342], [-100, -364]], MC.vermilion, MN.lw * 3);
    mnFill(c, [[-12, -560], [14, -560], [26, -300], [6, -280], [-16, -300]], MC.vermilion, { lw: 1 });
    mnStroke(c, [[-14, -300], [24, -300]], gd, MN.lw * 2);
    // the waist and torso
    mnFill(c, [[-64, -604], [64, -604], [72, -700], [84, -770], [60, -792], [-60, -792], [-84, -770], [-72, -700]], bk, { shade: [bkL, -60, -700, 60, -700], shadeA: .5 });
    // the uttariya: a yellow scarf over the shoulders, its ends falling past the elbows
    mnFill(c, [[-84, -786], [-30, -760], [30, -760], [84, -786], [104, -700], [96, -560], [80, -566], [82, -690], [60, -740], [-60, -740], [-82, -690], [-80, -566], [-96, -560], [-104, -700]], MC.yellow, { shade: ['#B07A10', 0, -790, 0, -560], shadeA: .35 });
    mnStroke(c, [[-96, -562], [-80, -568]], MC.vermilion, MN.lw * 3); mnStroke(c, [[96, -562], [80, -568]], MC.vermilion, MN.lw * 3);
    mnFill(c, [[-72, -612, 1], [72, -612, 1], [72, -592, 1], [-72, -592, 1]], gd, { lw: 1 });
    // the arms up to the flute: it runs from his lips out to his right (our left)
    mnLimb(c, [[-80, -776], [-150, -700], [-120, -840]], [30, 24, 20], bk);
    mnLimb(c, [[80, -776], [104, -706], [-26, -846]], [30, 24, 20], bk);
    for (const [bx, by] of [[-146, -712], [100, -716]]) mnEll(c, bx, by, 18, 7, gd, { lw: .9 });
    // necklaces and the vaijayanti mala down to the knees
    mnStroke(c, [[-60, -770], [0, -730], [60, -770]], gd, MN.lw * 3);
    mnStroke(c, [[-66, -772], [0, -700], [66, -772]], '#F4EEDF', MN.lw * 2);
    const vm = mnPts([[-80, -776], [-96, -600], [-60, -420], [0, -390], [60, -420], [96, -600], [80, -776]], false, 5);
    vm.forEach(([px, py], i) => mnDot(c, px, py, 9, ['#C9372A', '#F4EEDF', '#E8B83C', '#4F7A3E'][i % 4]));
    // the flute, gold-tipped, across the arms
    // (drawn after the face, below)
    // the face: round, black stone; long white temple eyes with a red rim; the tilak; red lips
    mnFill(c, [[-22, -800, 1], [22, -800, 1], [20, -830, 1], [-20, -830, 1]], bk, {});
    mnEll(c, 0, -890, 60, 70, bk, { shade: [bkL, -40, -900, 40, -900], shadeA: .4 });
    for (const sx of [-1, 1]) {
      const ex = sx * 26, ey = -900, eye = [[ex - 22 * sx, ey + 2, 1], [ex - 4 * sx, ey - 12], [ex + 16 * sx, ey - 9], [ex + 30 * sx, ey - 3, 1], [ex + 14 * sx, ey + 9], [ex - 6 * sx, ey + 9]];
      mnFill(c, eye, '#FBF7EE', { line: '#7A1A18', lw: MN.lw * .9 });
      mnDot(c, ex + 2 * sx, ey - 1, 8, '#120E10'); mnDot(c, ex + 4 * sx, ey - 4, 2.2, 'rgba(255,255,255,.85)');
      mnStroke(c, [[ex - 20 * sx, ey - 18], [ex + 6 * sx, ey - 24], [ex + 30 * sx, ey - 16]], '#120E10', MN.lw * 1.4);
    }
    mnFill(c, [[-12, -960], [12, -960], [6, -918], [0, -912], [-6, -918]], '#F3E6C8', { lw: .8 });
    mnStroke(c, [[0, -950], [0, -920]], MC.vermilion, MN.lw * 2.2);
    mnFill(c, [[-14, -852], [0, -858], [14, -852], [0, -842]], '#C9372A', { line: false });
    // the flute at his lips, gold-tipped, his fingers on it
    mnStroke(c, [[-240, -838], [30, -852]], '#9C6A34', MN.lw * 7);
    for (const fx of [-200, -170, -140]) mnDot(c, fx, -840 - (fx + 240) * .052, 3, '#3A2210');
    mnStroke(c, [[-242, -838], [-226, -839]], gd, MN.lw * 8); mnStroke(c, [[16, -851], [30, -852]], gd, MN.lw * 8);
    mnEll(c, -120, -844, 22, 13, bk, {}); mnEll(c, -36, -848, 22, 13, bk, {});
    // curls under the crown, and the makara kundalas
    for (const sx of [-1, 1]) { for (let i = 0; i < 3; i++) mnEll(c, sx * (58 + i * 6), -930 + i * 26, 14, 16, bk, { lw: .9 }); mnEll(c, sx * 70, -846, 13, 20, gd, { lw: 1 }); mnDot(c, sx * 70, -846, 5, '#C9372A'); }
    // the mukut: tall, tiered, jewelled; the peacock feather tilted on its right
    const mk = [[-62, -950, 1], [62, -950, 1], [56, -1010], [40, -1080], [22, -1124], [0, -1150], [-22, -1124], [-40, -1080], [-56, -1010]];
    mnFill(c, mk, gd, { shade: ['#8A5A10', 0, -1150, 0, -950], shadeA: .35 });
    mnStroke(c, [[-62, -962], [62, -962]], MC.goldLt, MN.lw * 3);
    for (const [jx, jy, jc] of [[0, -1000, '#C9372A'], [-30, -990, '#2E7A5A'], [30, -990, '#2E7A5A'], [0, -1060, '#2A5DA8'], [0, -1112, '#C9372A']]) mnDot(c, jx, jy, 7, jc);
    for (let i = 0; i < 9; i++) mnDot(c, -54 + i * 13.5, -952, 3.6, '#F4EEDF');
    mnStroke(c, [[30, -1060], [70, -1140], [92, -1190]], '#2E7A5A', MN.lw * 2.4);
    for (let i = 0; i < 6; i++) { const u = i / 5; mnStroke(c, [[lerp(40, 90, u), lerp(-1080, -1186, u)], [lerp(40, 90, u) + 18, lerp(-1080, -1186, u) - 6]], '#3F8A5A', MN.lw); }
    mnEll(c, 98, -1204, 18, 26, '#2E7A5A', { rot: .5, lw: 1 }); mnEll(c, 99, -1204, 11, 16, '#2A5DA8', { rot: .5, lw: .8 }); mnEll(c, 100, -1205, 5, 7, MC.gold, { rot: .5, lw: .6 });
    // the lamps' gold on the stone
    if (gl > 0) { glow(c, -40, -880, 120, '#FFD27A', .22 * gl, 'lighter'); glow(c, 50, -700, 150, '#FFC864', .14 * gl, 'lighter'); }
  });
  c.restore();
}
// mrTemple(c, t, o): the mandapa of a white-stone temple: a pillar, a carved sanctum doorway lit gold, the murti in it
// (mrMohan), a marigold toran, a hanging bell, a brass lamp-stand, a black-and-white marble floor.
//   o.glow 0..1: the moment he shows his form (the sanctum blazes, a halo opens behind him, petals fall)
function mrTemple(c, t, o = {}) {
  const gl = o.glow || 0, X = 640, Y = 1110;
  // the wall, the frieze, the floor
  mnFill(c, [[-40, -100, 1], [1120, -100, 1], [1120, 1130, 1], [-40, 1130, 1]], '#EADFC8', { lw: 1.4, shade: ['#A8987A', 0, 200, 0, 1130], shadeA: .3 });
  mnFill(c, [[-40, 240, 1], [1120, 240, 1], [1120, 276, 1], [-40, 276, 1]], MC.vermilion, { lw: 1.2 });
  for (let x = 0; x < 1080; x += 36) mnFill(c, mnArchPath(x + 18, 274, 26, 28, 3), MC.yellow, { lw: .8 });
  mnFill(c, [[-40, 1130, 1], [1120, 1130, 1], [1120, 2400, 1], [-40, 2400, 1]], '#EFE8DA', { lw: 1.4 });
  c.save(); c.beginPath(); c.rect(-40, 1130, 1160, 1300); c.clip(); c.fillStyle = 'rgba(122,92,70,.32)';
  const rows = [1130, 1160, 1196, 1240, 1292, 1354, 1428, 1516, 1620, 1744, 1890, 2060, 2400];
  for (let r = 0; r < rows.length - 1; r++) { const y0 = rows[r], y1 = rows[r + 1], w0 = 40 + r * 10, w1 = w0 + 10; for (let i = -14; i < 14; i++) if ((i + r) % 2 === 0) { c.beginPath(); c.moveTo(X + i * w0, y0); c.lineTo(X + (i + 1) * w0, y0); c.lineTo(X + (i + 1) * w1, y1); c.lineTo(X + i * w1, y1); c.closePath(); c.fill(); } }
  c.restore();
  // the sanctum: a carved surround, a stepped doorway, the dark garbhagriha lit by its lamps
  mnFill(c, [[X - 330, 1130, 1], [X + 330, 1130, 1], [X + 330, 330, 1], [X - 330, 330, 1]], '#E2D2B4', { lw: 1.6, shade: ['#9A8664', 0, 330, 0, 1130], shadeA: .2 });
  for (const sx of [-1, 1]) { mnFill(c, [[X + sx * 300, 1130, 1], [X + sx * 262, 1130, 1], [X + sx * 262, 360, 1], [X + sx * 300, 360, 1]], '#D6C29E', { lw: 1.2 }); for (let i = 0; i < 9; i++) mnEll(c, X + sx * 281, 420 + i * 82, 12, 26, '#C9B088', { lw: .8 }); }
  mnFill(c, [[X - 340, 330, 1], [X + 340, 330, 1], [X + 330, 300, 1], [X - 330, 300, 1]], '#D6C29E', { lw: 1.4 });
  mnDome(c, X, 300, 300, '#E9DCC4');
  mnFill(c, [[X - 10, 160, 1], [X + 10, 160, 1], [X + 14, 120], [X, 96], [X - 14, 120]], MC.gold, { lw: 1 });
  const arch = mnArchPath(X, Y, 470, 760);
  mnFill(c, arch, mixCol('#2A1E3A', '#5A3A2A', gl * .5), { lw: 1.6 });
  c.save(); c.clip(arch);
  glow(c, X, 700, 340, '#F2B860', .38 + .4 * gl, 'lighter');
  if (gl > 0) {
    // the halo opens behind him: rings of gold and rays
    c.save(); c.globalAlpha = gl; c.translate(X, 1080 - 890 * .56);
    for (let i = 0; i < 36; i++) { const a = i / 36 * TAU + t * .05; c.fillStyle = rgba('#FFE7A0', .18 + .1 * (i % 2)); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 520, a, a + .05); c.closePath(); c.fill(); }
    for (const [r, w, col] of [[96, 6, '#FFE7A0'], [114, 3, MC.gold], [132, 2, '#FFE7A0']]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(0, 0, r * (.6 + .4 * gl), 0, TAU); c.stroke(); }
    c.restore();
  }
  mrMohan(c, X, 1080, .56, { glow: .6 + gl });
  for (const dx of [-170, 170]) mnDiya(c, X + dx, 1094, 1.2, t + dx, { glow: 1 + gl });
  c.restore();
  c.save(); c.strokeStyle = MC.gold; c.lineWidth = 9; c.stroke(arch); c.strokeStyle = mnLineCol('#E2D2B4'); c.lineWidth = 1.6; c.stroke(arch); c.restore();
  // the threshold step, flowers on it
  mnFill(c, [[X - 260, 1150, 1], [X + 260, 1150, 1], [X + 260, 1112, 1], [X - 260, 1112, 1]], '#F2E9DA', { lw: 1.4 });
  for (let i = 0; i < 11; i++) mnDot(c, X - 200 + i * 40, 1131, 7, ['#F0A020', '#F7F0E0', '#C9372A'][i % 3]);
  // a marigold toran over the door
  for (const k of [0, 1]) for (let i = 0; i < 30; i++) { const u = i / 29, px = X - 240 + u * 480, py = 352 + k * 20 + Math.sin(u * Math.PI * 4) ** 2 * 14; mnDot(c, px, py, 8, (i + k) % 3 ? '#F0A020' : '#F7F0E0'); }
  for (let i = 0; i < 9; i++) { const px = X - 240 + i * 60; for (let j = 0; j < 3; j++) mnDot(c, px, 380 + j * 13, 5.5, j % 2 ? '#C9372A' : '#F0A020'); mnFill(c, [[px - 6, 414], [px, 432], [px + 6, 414]], '#4F7A3E', { lw: .7 }); }
  // the bell on its chain, swinging a little
  const bx = 190, sw = Math.sin(t * 1.4) * .04;
  c.save(); c.translate(bx, 276); c.rotate(sw);
  for (let i = 0; i < 9; i++) mnEll(c, 0, 14 + i * 22, 5, 11, '#B98A2E', { lw: .8 });
  mnFill(c, [[-10, 214], [10, 214], [20, 236], [34, 300], [44, 312, 1], [-44, 312, 1], [-34, 300], [-20, 236]], '#C99A3A', { shade: ['#6A4A10', -40, 0, 40, 0], shadeA: .45 });
  mnDot(c, 0, 318, 8, '#8A6A20');
  c.restore();
  // a brass lamp-stand on the right, its wicks lit
  const lx = 1000; mnFill(c, [[lx - 40, 1130, 1], [lx + 40, 1130, 1], [lx + 20, 1100], [lx - 20, 1100]], '#B88A2E', { lw: 1.2 });
  mnFill(c, [[lx - 8, 1100, 1], [lx + 8, 1100, 1], [lx + 8, 720, 1], [lx - 8, 720, 1]], '#C99A3A', { lw: 1 });
  for (const [ly, w] of [[900, 46], [800, 38], [720, 30]]) { mnFill(c, [[lx - w, ly, 1], [lx + w, ly, 1], [lx + w * .6, ly + 14], [lx - w * .6, ly + 14]], '#C99A3A', { lw: 1 }); for (const sx of [-1, 1]) mnDiya(c, lx + sx * (w - 6), ly - 2, .5, t + ly + sx, { glow: .6 }); }
  // the pillar at the left
  mnFill(c, [[20, 1130, 1], [110, 1130, 1], [110, 276, 1], [20, 276, 1]], '#E2D2B4', { lw: 1.4, shade: ['#9A8664', 110, 0, 20, 0], shadeA: .35 });
  for (const py of [340, 700, 1060]) mnFill(c, [[10, py + 30, 1], [120, py + 30, 1], [120, py, 1], [10, py, 1]], '#D6C29E', { lw: 1.2 });
  // petals drifting down while he shows his form
  if (gl > 0) for (let i = 0; i < 28; i++) { const px = (hash(i) * 1000 + Math.sin(t + i) * 30) % 1000 + 40, py = (hash(i + 4) * 1100 + t * 70) % 1100 + 120; c.save(); c.globalAlpha = gl; c.translate(px, py); c.rotate(t * 2 + i); mnEll(c, 0, 0, 7, 4, i % 3 ? '#F0A020' : '#E8909C', { lw: .7 }); c.restore(); }
}
