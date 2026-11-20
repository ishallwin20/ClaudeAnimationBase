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
  // the army in rows along the beach, small and dark against the sunset
  const R = lcg(3);
  for (const [y, k, n, col] of [[.8, .1, 14, '#5A4038'], [.9, .14, 10, '#3A2A26'], [1.02, .19, 7, '#22181A']]) for (let i = 0; i < n; i++) { const x = P.w * (i + .5 + (R() - .5) * .5) / n; c.save(); c.translate(x, P.h * y); c.scale(k * (R() > .5 ? 1 : -1), k); vanaraSil(c, { pose: R() > .8 ? 'kneel' : 'stand', col, tw: .7 }); c.restore(); }
};
const LEAPS = { leap10: [0, 'smile'], leap20: [1, 'calm'], leap30: [2, 'grief'], leap50: [3, 'grief'] };
for (const [name, [v, e]] of Object.entries(LEAPS)) ART[name] = (c, P) => { dusk(c, P, .62); bust(c, P.w * .5, P.h * .68, .3, { v, expr: e, look: [0, .3], arms: ['down', 'down'], t: P.t }, lit(DAY()), vanaraBust); };
ART.hanAlone = (c, P) => {
  dusk(c, P, .5); sand(c, P, .82);
  const R = lcg(5);
  for (let i = 0; i < 14; i++) { const x = P.w * (.05 + R() * .4), y = P.h * (.84 + R() * .12), k = .1; c.save(); c.translate(x, y); c.scale(k, k); vanaraSil(c, { pose: 'stand', col: '#3A2A26', tw: .8 }); c.restore(); }
  // a rock apart, Hanuman on it, silent, looking at the sea
  fillPath(c, `M ${P.w * .62} ${P.h + 20} L ${P.w * .66} ${P.h * .74} L ${P.w * .86} ${P.h * .7} L ${P.w * .96} ${P.h + 20} Z`, '#3A3036');
  bust(c, P.w * .78, P.h * .46, .28, { expr: 'calm', look: [-.6, .2], turn: -.3, arms: ['down', 'down'] }, lit(DAY(-4, -4)), hanBust);
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
  glow(c, P.w * .5, P.h * .3, 600, '#FFD27A', .5);
  c.save(); c.translate(P.w * .52, P.h * .66); c.scale(-.9, .9);
  figure(c, (c) => vanaraSil(c, { pose: 'kneel', col: '#1A1018', tw: 1.4 }), { edge: { col: '#FFD27A', w: 6, a: 1 } });
  c.restore();
};
