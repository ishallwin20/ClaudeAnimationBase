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
  const P = [[-16, -46], [-4, -6], [26, 0], [96, -8], [190, 2], [246, 5], [272, -3], [270, -17], [236, -30], [160, -52], [104, -92], [76, -150], [70, -210, 1], [4, -210, 1], [0, -130], [-12, -90]];
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
  c.save(); c.strokeStyle = MIRA.gold; c.lineWidth = 34; c.beginPath(); mnPts([[-40, hy - 37 - sw * .5], [200, hy - 7 + sw * .2], [500, hy + 13], [800, hy - 7 - sw * .2], [1120, hy - 47 + sw * .5]], false).forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); c.strokeStyle = MIRA.border; c.lineWidth = 8; c.stroke(); c.restore();
  mrFoot(c, 470, 1150 - k1 * 40, 1.4, { lift: k1, jingle: k1 > .2, t });
  return [[470 + 60, 1150 - k1 * 40 - 210, k1], [380 + 50, 1090 - k2 * 40 - 190, k2]];
}
