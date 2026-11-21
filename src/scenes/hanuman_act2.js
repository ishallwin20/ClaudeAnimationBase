// Issue 2, Act 2 (pp. 17–21): the shore, Jambavan, Hanuman remembers, grows, and pushes off from Mahendra.
const JAMB = { arms: ['down', 'fist'], hold: 'staff' };
function dusk(c, P, horizon = .55) {
  vgrad(c, P, [[0, '#2A1E4A'], [horizon * .7, '#C85A4A'], [horizon, '#F2A060'], [1, '#2A3A5A']], 0, P.h);
  redSun(c, P.w * .7, P.h * horizon, 60, { a: .7 });
  fillPath(c, `M -20 ${P.h * horizon} L ${P.w + 20} ${P.h * horizon} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#2E4A6E');
  for (let i = 0; i < 9; i++) { const y = P.h * (horizon + .04 + i * .05); strokePath(c, `M ${P.w * (.2 + (i % 3) * .2)} ${y} l ${80 + i * 10} 0`, 'rgba(255,190,140,.35)', 3); }
}
function sand(c, P, y = .78) { fillPath(c, `M -20 ${P.h * y} Q ${P.w * .5} ${P.h * (y - .05)} ${P.w + 20} ${P.h * y} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#C8A070'); }

// =================== p17 · the shore ===================
ART.shore = (c, P) => {
  dusk(c, P, .5); sand(c, P, .74);
  // the army along the beach: rows of vanaras, the far rows small and in shadow
  const R = lcg(3);
  for (const [y, k, n, tint] of [[.8, .1, 16, .55], [.88, .14, 12, .35], [.98, .2, 8, .12]]) for (let i = 0; i < n; i++) {
    const x = P.w * (i + .5 + (R() - .5) * .4) / n;
    bust(c, x, P.h * y, k, { v: Math.floor(R() * 4), expr: ['calm', 'grief', 'calm', 'awe'][i % 4], look: [(R() - .5), .3], turn: (R() - .5) * .6, arms: ['down', 'down'] }, { ...lit(DAY()), tint: ['#2A1A2A', tint] }, vanaraBust);
  }
};
// the leaders' answers (4.64.3–13): each in his own fur, faces falling as the numbers climb
const LEAPS = { leap10: [0, 'smile'], leap20: [1, 'calm'], leap30: [2, 'calm'], leap40: [3, 'calm'], leap50: [0, 'grief'], leap60: [1, 'grief'], leap70: [2, 'grief'], leap80: [3, 'grief'] };
for (const [name, [v, e]] of Object.entries(LEAPS)) ART[name] = (c, P) => { dusk(c, P, .62); bust(c, P.w * .5, P.h * .56, .44, { v, expr: e, look: [0, .3], arms: ['down', 'down'], t: P.t }, lit(DAY()), vanaraBust); };
ART.leap90 = (c, P) => { dusk(c, P, .62); bust(c, P.w * .25, P.h * .58, .5, { ...JAMB, expr: 'calm', look: [.6, .3], turn: .3 }, lit(DAY()), jambBust); };
// Angad, Vali's son, the young prince: a band crown, darker gold fur, a green dhoti
const ANGAD = { pal: { skin: '#C8862E', skinSh: '#985A16', skinDk: '#5A3410', cloth: '#2E7A4A', clothSh: '#1A4A2A' }, headPal: { fur: '#C8862E', furSh: '#985A16', ruff: '#A86A22', kohl: '#5A3418', irisDk: '#6A3A12' } };
function angadBust(c, o = {}) { devaBust(c, { ...o, pal: ANGAD.pal, head: (cc) => { cc.save(); cc.translate(0, -6); hanHead(cc, { expr: o.expr, look: o.look, turn: o.turn, crown: 'mukut', tilak: false, t: o.t, pal: ANGAD.headPal }); cc.restore(); } }); }
ART.leap100 = (c, P) => { dusk(c, P, .62); bust(c, P.w * .75, P.h * .58, .5, { expr: 'grief', look: [-.6, .3], turn: -.3, arms: ['down', 'chest'] }, lit(DAY()), angadBust); };
ART.angadAsks = (c, P) => {
  dusk(c, P, .55); sand(c, P, .8);
  for (let i = 0; i < 7; i++) bust(c, P.w * (.42 + i * .09), P.h * (.92 + (i % 2) * .05), .16, { v: i % 4, expr: 'calm', look: [-1, -.3], arms: ['down', 'down'] }, { ...lit(DAY()), tint: ['#2A1A2A', .35] }, vanaraBust);
  bust(c, P.w * .2, P.h * .5, .5, { expr: 'shout', look: [1, 0], turn: .3, arms: ['down', 'open'] }, lit(DAY()), angadBust);
};
ART.searchParty = (c, P) => {
  vgrad(c, P, [[0, '#7AA8C8'], [.6, '#D8E4D0'], [1, '#6A8A5A']]);
  ridge(c, P.w, P.h, P.h * .5, 70, '#8A9AB0', 3); ridge(c, P.w, P.h, P.h * .66, 50, '#5E7A5E', 7);
  for (let i = 0; i < 8; i++) tree(c, P.w * (.04 + i * .13), P.h * .86, P.h * .34, i % 2 ? '#3E6A3E' : '#4A7A42', i + 2, 1.3);
  ridge(c, P.w, P.h, P.h * .9, 20, '#3A5A32', 9);
  // vanaras fanning out over the hills, shading their eyes, pointing (the search, Kishkindha 39–42)
  [[.12, .78, .2, 0, [-.6, -.2]], [.34, .7, .16, 1, [.6, -.4]], [.58, .74, .18, 2, [.6, -.2]], [.82, .64, .13, 3, [-.6, -.4]], [.92, .82, .22, 0, [-.8, -.1]]].forEach(([x, y, k, v, lk], i) =>
    bust(c, P.w * x, P.h * y, k, { v, expr: i % 2 ? 'awe' : 'calm', look: lk, turn: lk[0] * .4, arms: ['down', i % 2 ? 'point' : 'abhaya'] }, lit(DAY()), vanaraBust));
  for (let i = 0; i < 7; i++) puffs(c, P.w * (i + .5) / 7, P.h * 1.02, 260, i % 2 ? '#3A5A32' : '#466A3A', i + 30, 6);
};
ART.hanAlone = (c, P) => {
  dusk(c, P, .5); sand(c, P, .82);
  const R = lcg(5);
  for (let i = 0; i < 9; i++) bust(c, P.w * (.04 + i * .055), P.h * (.9 + (i % 2) * .04), .12, { v: i % 4, expr: 'calm', look: [-.5, 0], arms: ['down', 'down'] }, { ...lit(DAY()), tint: ['#2A1A2A', .4] }, vanaraBust);
  // a rock apart, Hanuman on it, silent, looking at the sea
  fillPath(c, `M ${P.w * .62} ${P.h + 20} L ${P.w * .66} ${P.h * .74} L ${P.w * .86} ${P.h * .7} L ${P.w * .96} ${P.h + 20} Z`, '#3A3036');
  bust(c, P.w * .78, P.h * 0.635, 0.28, { expr: 'calm', look: [-.6, .2], turn: -.3, arms: ['down', 'down'] }, lit(DAY(-4, -4)), hanBust);
};

// =================== Jambavan, introduced (4.64.11–16, 4.65.30) ===================
ART.trivikrama = (c, P) => {
  // gold flashback: Vishnu as Trivikrama, a giant striding across the worlds; the earth's curve under his feet; the
  // young bear racing round his foot (no stars: in the Inked look they ink into black dots)
  vgrad(c, P, [[0, '#2A1A50'], [.45, '#8A4A7A'], [1, '#F0B050']]);
  glow(c, P.w * .7, P.h * .3, 520, '#FFD27A', .55);
  fig(c, P.w * .7, P.h * .1, .3, { who: 'ram', crown: 'kirita', tilak: 'namam', expr: 'calm', look: [-.3, .7], legs: [[2.25, .05], [.9, .2]], arms: ['up', 'down'], dhoti: '#F0C030' }, { ...lit(DAY()), tint: ['#FFD27A', .15] }, devaFigure);
  // the earth's curve
  const E = `M -40 ${P.h + 40} C ${P.w * .2} ${P.h * .78} ${P.w * .8} ${P.h * .78} ${P.w + 40} ${P.h + 40} Z`;
  fillPath(c, E, '#3E6A4A'); inside(c, E, () => { for (let i = 0; i < 5; i++) ellipse(c, P.w * (.1 + i * .2), P.h * .93, 60, 16, '#5A8A5A'); });
  // the young bear, running round the giant's foot, a trail of dust behind him
  const bx = P.w * .88, by = P.h * .97;
  speedLines(c, bx + 50, by - 70, 9, 30, 130, 'rgba(255,240,200,.85)', 3, 5, -.25, .25);
  c.save(); c.translate(bx, by - 1150 * .17); c.scale(-.17, .17);
  figure(c, (c) => devaFigure(c, { pal: { skin: '#3A3238', skinSh: '#26202A', skinDk: '#141016', skinLt: '#5A5058', cloth: '#8A6A3A', clothSh: '#5A4220' }, dress: 'rishi', build: 1.15, legs: 'run', arms: ['reach', 'up'], dhoti: '#8A6A3A', head: (cc) => jambHead(cc, { expr: 'smile', look: [1, 0], turn: .3 }) }), lit(DAY()));
  c.restore();
  c.fillStyle = 'rgba(255,200,120,.1)'; c.fillRect(0, 0, P.w, P.h);
};
ART.jambaNow = (c, P) => {
  dusk(c, P, .58); sand(c, P, .84);
  for (let i = 0; i < 8; i++) bust(c, P.w * (.5 + i * .065), P.h * (.92 + (i % 2) * .04), .13, { v: i % 4, expr: 'grief', look: [-.5, 0], arms: ['down', 'down'] }, { ...lit(DAY()), tint: ['#2A1A2A', .35] }, vanaraBust);
  bust(c, P.w * .2, P.h * .5, .5, { ...JAMB, expr: 'calm', look: [.8, .3], turn: .3 }, lit(DAY()), jambBust);
};

// =================== p18 · Jambavan ===================
ART.jambavan = (c, P) => {
  dusk(c, P, .6); sand(c, P, .86);
  bust(c, P.w * .18, P.h * .5, .5, { ...JAMB, expr: 'speak', look: [1, 0], turn: .3 }, lit(DAY()), jambBust);
  bust(c, P.w * .88, P.h * .58, .46, { expr: 'calm', look: [-.6, .5], turn: -.3, arms: ['down', 'down'] }, lit(DAY(-4, -4)), hanBust);
};
ART.jambaMemory = (c, P) => {
  vgrad(c, P, [[0, '#E8A040'], [1, '#FFE0A0']]);
  redSun(c, P.w * .82, P.h * .52, 70);
  baby(c, P.w * .44, P.h * .72, .4, .5, { pose: 'leap', arms: [[-2.0, .2], [-1.25, -.1]], legs: [[2.4, .3], [2.0, .25]], expr: 'grin', look: [.8, -.5], red: .6, t: P.t });
  c.fillStyle = 'rgba(255,200,120,.18)'; c.fillRect(0, 0, P.w, P.h);
};
ART.hanEyes = (c, P) => {
  vgrad(c, P, [[0, '#3A2A4A'], [1, '#C86A4A']]);
  c.save(); c.translate(P.w * .5, P.h * .82); c.scale(2.1, 2.1); figure(c, (c) => hanHead(c, { expr: 'awe', look: [0, -.6], t: P.t }), lit(DAY())); c.restore();
};
ART.jambaWind = (c, P) => {
  dusk(c, P, .6); sand(c, P, .86);
  bust(c, P.w * .2, P.h * .56, .44, { ...JAMB, arms: ['down', 'reach'], hold: null, expr: 'smile', look: [1, 0], turn: .3 }, lit(DAY()), jambBust);
  bust(c, P.w * .8, P.h * .6, .44, { expr: 'calm', look: [-1, 0], turn: -.3, arms: ['down', 'down'] }, lit(DAY(-4, -4)), hanBust);
};

// =================== p19 · rise ===================
ART.jambaOld = (c, P) => { dusk(c, P, .62); bust(c, P.w * .5, P.h * .66, .46, { ...JAMB, expr: 'calm', look: [0, .3] }, lit(DAY()), jambBust); };
ART.jambaGetUp = (c, P) => { dusk(c, P, .62); bust(c, P.w * .44, P.h * .66, .46, { ...JAMB, arms: ['down', 'point'], hold: null, expr: 'stern', look: [1, 0], turn: .3 }, lit(DAY()), jambBust); };
ART.hanRises = (c, P) => {
  dusk(c, P, .55); sand(c, P, .84);
  glow(c, P.w * .5, P.h * .35, 420, '#FFD27A', .5);
  bust(c, P.w * .5, P.h * .36, .9, { expr: 'smile', look: [0, -.2], arms: ['down', 'down'] }, lit(DAY()), hanBust);
  [[.1, 0, .3], [.26, 1, .2], [.74, 2, -.2], [.9, 3, -.3]].forEach(([x, v, tn]) => bust(c, P.w * x, P.h * .84, .26, { v, expr: 'awe', look: [-tn * 2, -1], turn: tn, arms: ['down', 'down'] }, lit(DAY()), vanaraBust));
};

// =================== p20 · he grows ===================
ART.hanGrows = (c, P) => {
  vgrad(c, P, [[0, '#1A1030'], [.5, '#C8503A'], [1, '#F2A060']]);
  glow(c, P.w * .5, P.h * .38, 700, '#FFC060', .6);
  // the face blazing like a smokeless fire (4.66.4): a ring of light behind his head
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; fillPath(c, `M ${P.w * .5 + Math.cos(a - .05) * 230} ${P.h * .34 + Math.sin(a - .05) * 230} L ${P.w * .5 + Math.cos(a) * (360 + (i % 2) * 120)} ${P.h * .34 + Math.sin(a) * (360 + (i % 2) * 120)} L ${P.w * .5 + Math.cos(a + .05) * 230} ${P.h * .34 + Math.sin(a + .05) * 230} Z`, i % 2 ? '#FFD27A' : '#FF9A3A'); }
  bust(c, P.w * .5, P.h * .34, 1.15, { expr: 'roar', look: [0, 0], arms: ['fist', 'fist'] }, lit(DAY()), hanBust);
  // he is as tall as a hill now: the clouds drift round his waist
  for (let i = 0; i < 8; i++) puffs(c, P.w * (i + .5) / 8, P.h * (.8 + (i % 2) * .03), 330, i % 2 ? '#F6C890' : '#F2B47A', i + 21, 6);
  // the vanaras tiny at his feet, on the beach
  sand(c, P, .92);
  const R = lcg(9);
  for (let i = 0; i < 26; i++) { const x = P.w * R(), y = P.h * (.93 + R() * .05), k = .07; c.save(); c.translate(x, y); c.scale(k * (x < P.w / 2 ? 1 : -1), k); vanaraSil(c, { pose: R() > .5 ? 'raise' : 'stand', col: '#2A1A16', tw: .8 }); c.restore(); }
};

// =================== p21 · Mahendra ===================
ART.mahendra = (c, P) => {
  vgrad(c, P, [[0, '#1A2A4A'], [.6, '#6A8AB0'], [1, '#2A2A30']]);
  // the peak, splitting; water bursting from the rock; snakes biting the rocks and the rocks catching fire (5.1.10–18)
  const MT = `M -20 ${P.h + 20} L -20 ${P.h * .78} L ${P.w * .2} ${P.h * .66} L ${P.w * .42} ${P.h * .62} L ${P.w * .62} ${P.h * .64} L ${P.w * .82} ${P.h * .7} L ${P.w + 20} ${P.h * .76} L ${P.w + 20} ${P.h + 20} Z`;
  fillPath(c, MT, '#4A3E3A'); inside(c, MT, () => { for (let i = 0; i < 6; i++) strokePath(c, `M ${P.w * (.15 + i * .14)} ${P.h * .64} l ${(i % 2 ? 30 : -30)} 120 l ${(i % 2 ? -20 : 20)} 90`, '#14100E', 7); });
  for (const [x, a] of [[.12, -.5], [.3, -.3], [.74, .3], [.9, .5]]) { c.save(); c.translate(P.w * x, P.h * .72); c.rotate(a); for (let k = 0; k < 4; k++) strokePath(c, `M ${k * 8 - 12} 0 Q ${k * 14 - 20} -120 ${k * 30 - 40} -260`, 'rgba(200,230,255,.85)', 10 - k * 2); c.restore(); }
  for (const [x, y] of [[.22, .86], [.68, .9], [.86, .84]]) { glow(c, P.w * x, P.h * y, 90, '#FF8A2A', .8); flames(c, P.w * x, P.h * y, 26, 10, 50, ['#E8401A', '#FFB040'], 4); }
  for (const [x, y, s] of [[.36, .9, 1], [.56, .94, -1]]) { const X = P.w * x, Y = P.h * y; limb(c, [[X - s * 60, Y + 20], [X - s * 30, Y - 10], [X, Y + 10], [X + s * 30, Y - 14]], [16, 16, 14, 10], '#3A7A4A'); ellipse(c, X + s * 34, Y - 16, 14, 10, '#3A7A4A'); }
  // the trees dropping every flower
  const R = lcg(6); for (let i = 0; i < 60; i++) ellipse(c, P.w * R(), P.h * (.1 + R() * .6), 5, 5, ['#F4A0BE', '#FFE07A', '#FFFFFF'][i % 3]);
  // Hanuman, crouched on the peak, gripping it with both hands, about to push
  glow(c, P.w * .5, P.h * .4, 500, '#FFD27A', .35);
  c.save(); c.translate(P.w * .5, P.h * .29); c.scale(.5, .5);
  figure(c, (c) => hanFigure(c, { legs: 'crouch', arms: [[1.15, .25, 'fist'], [1.15, .25, 'fist']], expr: 'fierce', look: [0, -.8], tail: 'stream', t: P.t }), lit(DAY()));
  c.restore();
};
