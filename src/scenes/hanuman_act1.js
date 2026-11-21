// Issue 2, Act 1 (pp. 9–16): the worlds without air, Brahma, the revival, the boons, the mischief, the curse, the
// answer. Uses the helpers in hanuman_preview.js (vgrad, ridge, puffs, baby, babyFace, bust, dhead, WARM…).
const BRAHMA = { expr: 'calm' };
const VAYU = { who: 'vayu', crown: 'kirita', hair: 'wind', tilak: 'dot' };
const RISHI = { who: 'rishi', crown: 'jata', beard: 'long', stache: true, age: .8, tilak: 'tripundra', dress: 'rishi' };
function brahmaAt(c, x, y, k, o = {}, lotus = true, light = WARM()) {
  c.save(); c.translate(x, y); c.scale(k, k);
  figure(c, (c) => { if (lotus) { c.save(); c.translate(0, 560); lotusSeat(c, 320); c.restore(); } brahmaBust(c, { ...BRAHMA, ...o }); }, light);
  c.restore();
}
// Vayu with the boy sitting on his shoulder (screen right)
function vayuWithBoy(c, x, y, k, o = {}, boy = {}) {
  c.save(); c.translate(x, y); c.scale(k, k);
  figure(c, (c) => { devaBust(c, { ...VAYU, expr: 'smile', arms: ['down', 'up'], ...o }); }, lit(DAY()));
  c.save(); c.translate(150, -10); c.scale(.62, .62); figure(c, (c) => balHanuman(c, { pose: 'sit', expr: 'grin', t: 0, ...boy }), lit(DAY())); c.restore();
  c.restore();
}
function ashram(c, P) {
  vgrad(c, P, [[0, '#BFE0E8'], [.6, '#F2E8C8'], [1, '#C8B07A']]);
  ridge(c, P.w, P.h, P.h * .62, 40, '#9AB89A', 3);
  for (let i = 0; i < 3; i++) tree(c, P.w * (.08 + i * .4), P.h * .7, P.h * .5, '#6A8A5A', i + 3, 1.6);
  // a hut: mud walls, a thatched roof
  fillPath(c, `M ${P.w * .62} ${P.h * .72} L ${P.w * .62} ${P.h * .5} L ${P.w * .92} ${P.h * .5} L ${P.w * .92} ${P.h * .72} Z`, '#C89A6A');
  fillPath(c, `M ${P.w * .58} ${P.h * .52} L ${P.w * .77} ${P.h * .3} L ${P.w * .96} ${P.h * .52} Z`, '#A88A3A');
  fillPath(c, `M -20 ${P.h * .72} L ${P.w + 20} ${P.h * .72} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#B89A62');
}

// =================== p9 · hell ===================
const SICK = () => ({ ...lit(DAY()), tint: ['#6A7A4A', .22] });
function veena(c, x, y, k, a) { c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k); strokePath(c, 'M -160 0 L 160 0', '#6A3A1A', 16); for (const [gx, r] of [[-150, 52], [150, 40]]) { fillPath(c, ellP(gx, 26, r, r), '#B8742E'); strokePath(c, ellP(gx, 26, r, r), '#4A2410', 3); } for (const yy of [-6, 0, 6]) strokePath(c, `M -150 ${yy - 8} L 150 ${yy - 8}`, '#F2E8C8', 1.5); c.restore(); }
ART.hellHeaven = (c, P) => {
  vgrad(c, P, [[0, '#4A5A3A'], [1, '#A8AC80']]);
  // the gods on their clouds, hands at their throats (35.50)
  [['indra', { crown: 'kirita', stache: true, tilak: 'dot' }, 'shock'], ['surya', { crown: 'sun', tilak: 'line' }, 'pain'], ['varuna', { crown: 'kirita', tilak: 'dot' }, 'scream'], ['kubera', { crown: 'mukut', stache: true, build: 1.2 }, 'pain']].forEach(([w, o, e], i) =>
    bust(c, P.w * (.4 + i * .17), P.h * (.6 + (i % 2) * .04), .34, { who: w, ...o, expr: e, look: [(i - 1.5) * .3, -.4], arms: ['throat', i % 2 ? 'chest' : 'throat'] }, SICK()));
  for (let i = 0; i < 7; i++) puffs(c, P.w * (.3 + i * .12), P.h * (.92 + (i % 2) * .04), 300, i % 2 ? '#C8C8A8' : '#B8B898', i + 4, 6);
};
ART.hellEarth = (c, P) => {
  vgrad(c, P, [[0, '#7A7A56'], [1, '#A89A6A']]);
  // a village behind, its people standing still as walls (35.62)
  for (let i = 0; i < 6; i++) { const x = P.w * (.06 + i * .17), h = P.h * (.16 + (i % 2) * .05); fillPath(c, `M ${x - 60} ${P.h * .62} L ${x - 60} ${P.h * .62 - h} L ${x} ${P.h * .62 - h - 50} L ${x + 60} ${P.h * .62 - h} L ${x + 60} ${P.h * .62} Z`, '#6A6446'); }
  fillPath(c, `M -20 ${P.h * .62} L ${P.w + 20} ${P.h * .62} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#8A7E56');
  const R = lcg(8);
  for (let i = 0; i < 9; i++) { const x = P.w * (.5 + i * .055), y = P.h * (.66 + (i % 2) * .02), k = .1; c.save(); c.translate(x, y); c.scale(k * (i % 2 ? 1 : -1), k); manSil(c, { pose: 'stand', head: ['knot', 'turban', 'bare'][i % 3], col: '#3A3826' }); c.restore(); }
  // two villagers, close, choking
  bust(c, P.w * .3, P.h * .72, .32, { expr: 'shock', look: [-.3, -.4], arms: ['chest', 'throat'], pal: { cloth: '#3A7A8A', clothSh: '#1A4A5A' } }, SICK(), sitaBust);
  // the altar: the fire dead, a thread of smoke standing dead straight (no wind)
  fillPath(c, `M ${P.w * .5} ${P.h * .98} L ${P.w * .54} ${P.h * .88} L ${P.w * .7} ${P.h * .88} L ${P.w * .74} ${P.h * .98} Z`, '#4A3E2A');
  for (let i = 0; i < 9; i++) ellipse(c, P.w * .62 + (i % 2 ? 4 : -4), P.h * (.84 - i * .05), 16 - i * .6, 20, rgba('#D8D8C8', .75 - i * .05));
  for (let i = 0; i < 4; i++) strokePath(c, `M ${P.w * (.56 + i * .04)} ${P.h * .88} L ${P.w * (.57 + i * .035)} ${P.h * .85}`, '#2A2018', 8);
  // the rishi at it, hands at his throat
  bust(c, P.w * .86, P.h * .5, .46, { ...RISHI, expr: 'pain', look: [-.6, -1], tilt: .15, arms: ['throat', 'throat'] }, SICK());
};
ART.hellBelow = (c, P) => {
  vgrad(c, P, [[0, '#1A1024'], [1, '#3A2A3A']]);
  // the asuras' hall under the earth: pillars, lamps whose flames stand dead straight
  for (let i = 0; i < 6; i++) { const x = P.w * (.05 + i * .19); fillPath(c, `M ${x - 30} ${P.h + 20} L ${x - 30} ${P.h * .1} L ${x + 30} ${P.h * .1} L ${x + 30} ${P.h + 20} Z`, '#2E2236'); fillPath(c, `M ${x - 44} ${P.h * .1} L ${x + 44} ${P.h * .1} L ${x + 44} ${P.h * .16} L ${x - 44} ${P.h * .16} Z`, '#3E3046'); }
  for (const x of [.14, .52, .9]) { glow(c, P.w * x, P.h * .38, 70, '#FFB040', .6); fillPath(c, `M ${P.w * x - 7} ${P.h * .4} C ${P.w * x - 7} ${P.h * .34} ${P.w * x} ${P.h * .28} ${P.w * x} ${P.h * .24} C ${P.w * x} ${P.h * .28} ${P.w * x + 7} ${P.h * .34} ${P.w * x + 7} ${P.h * .4} Z`, '#FFD070'); fillPath(c, `M ${P.w * x - 26} ${P.h * .4} L ${P.w * x + 26} ${P.h * .4} L ${P.w * x + 14} ${P.h * .45} L ${P.w * x - 14} ${P.h * .45} Z`, '#C8963A'); }
  [[.26, 0, 'scream', ['throat', 'throat']], [.46, 1, 'pain', ['chest', 'throat']], [.66, 2, 'shock', ['throat', 'chest']]].forEach(([x, r, e, a], i) =>
    bust(c, P.w * x, P.h * (.6 + (i % 2) * .04), .34, { r, expr: e, look: [(i - 1) * .4, -.3], arms: a }, { ...lit(DAY()), tint: ['#4A2A5A', .2] }, rakshasaBust));
};

// =================== p10 · to Brahma ===================
ART.godsBrahma = (c, P) => {
  vgrad(c, P, [[0, '#E8B870'], [1, '#B8784A']]);
  glow(c, P.w * .78, P.h * .4, 360, '#FFF0C0', .6);
  brahmaAt(c, P.w * .8, P.h * .36, .36, { expr: 'grief', look: [-1, .2], arms: ['down', 'abhaya'] });
  // the gods, gasping, their bellies swollen (35.53), hands at their throats
  const G = [['indra', { crown: 'kirita', stache: true, tilak: 'dot' }], ['varuna', { crown: 'kirita', tilak: 'dot' }], ['kubera', { crown: 'mukut', stache: true, build: 1.25 }], ['yama', { crown: 'mukut', stache: true }]];
  G.forEach(([w, o], i) => bust(c, P.w * (.12 + i * .15), P.h * (.7 + (i % 2) * .06), .32, { who: w, ...o, build: (o.build || 1) * 1.12, expr: i % 2 ? 'pain' : 'shock', look: [1, -.3], arms: ['throat', i % 2 ? 'chest' : 'throat'] }, lit(DAY())));
};
ART.brahmaSpeaks = (c, P) => {
  vgrad(c, P, [[0, '#E8B870'], [1, '#C88A50']]);
  brahmaAt(c, P.w * .26, P.h * .38, .58, { expr: 'speak', look: [1, 0], arms: ['down', 'open'] }, false);
};
ART.brahmaRises = (c, P) => {
  vgrad(c, P, [[0, '#E8C890'], [1, '#B8885A']]);
  const D = '#5A3A26';
  for (let i = 0; i < 8; i++) { c.save(); c.translate(P.w * (.34 - i * .04), P.h * (1.02 - (i % 2) * .03)); c.scale(.24 - i * .012, .24 - i * .012); manSil(c, { pose: 'walk', head: i % 3 ? 'kirita' : 'knot', col: D }); c.restore(); }
  brahmaAt(c, P.w * .44, P.h * .44, .34, { expr: 'fierce', look: [1, 0], arms: ['down', 'reach'] }, false, lit(DAY()));
};

// =================== p11 · alive ===================
function cave(c, P, mouthX = .78) {
  vgrad(c, P, [[0, '#14100E'], [1, '#2A2018']]);
  const m = `M ${P.w * mouthX} ${P.h + 20} C ${P.w * (mouthX - .04)} ${P.h * .4} ${P.w * (mouthX + .05)} ${P.h * .08} ${P.w * (mouthX + .14)} ${P.h * .1} C ${P.w + 40} ${P.h * .2} ${P.w + 40} ${P.h * .6} ${P.w + 40} ${P.h + 20} Z`;
  fillPath(c, m, '#F2E2B8');
}
ART.caveLap = (c, P) => {
  cave(c, P, .74);
  // the gods crowding the cave mouth, against the light
  for (let i = 0; i < 6; i++) { c.save(); c.translate(P.w * (.8 + i * .04), P.h * (1.02 - (i % 2) * .05)); c.scale(-.22, .22); manSil(c, { pose: 'stand', head: i ? 'kirita' : 'knot', col: '#3A2A20' }); c.restore(); }
  // Vayu with the child in his lap; the child glowing like the sun, fire and gold (35.65)
  glow(c, P.w * .36, P.h * .78, 260, '#FFB040', .7);
  c.save(); c.translate(P.w * .36, P.h * .3); c.scale(.5, .5);
  figure(c, (c) => { devaBust(c, { ...VAYU, expr: 'grief', look: [-.2, 1], tilt: .1, arms: ['cradle', 'down'], t: P.t }); c.save(); c.translate(-190, 330); c.rotate(-1.62); c.scale(.78, .78); balHanuman(c, { pose: 'limp', expr: 'sleep', tail: 'limp' }); c.restore(); }, { ...lit(DAY(4, 4)), tint: ['#FF9A3A', .12] });
  c.restore();
};
ART.vayuBows = (c, P) => {
  vgrad(c, P, [[0, '#E8C890'], [1, '#B8885A']]);
  c.save(); c.translate(-20, P.h * .86); lotusSeat(c, 260); c.restore();
  for (const x of [-30, 60]) ellipse(c, x, P.h * .78, 46, 20, DEVA.brahma.skin);
  c.save(); c.translate(P.w * .62, P.h * .5); c.rotate(-.45); c.scale(.42, .42);
  figure(c, (c) => { devaBust(c, { ...VAYU, expr: 'grief', look: [-1, .4], arms: ['cradle', 'down'], t: P.t }); c.save(); c.translate(-190, 330); c.rotate(-1.62); c.scale(.78, .78); balHanuman(c, { pose: 'limp', expr: 'sleep', tail: 'limp' }); c.restore(); }, lit(DAY()));
  c.restore();
};
ART.brahmaTouch = (c, P) => {
  vgrad(c, P, [[0, '#F2D8A0'], [1, '#E8B870']]);
  glow(c, P.w * .5, P.h * .42, 240, '#FFF2C0', .8);
  babyFace(c, P.w * .5, P.h * .48, 1.05, { expr: 'wonder', look: [0, -.6], spark: 1, t: P.t });
  // Brahma's hand on the small head
  c.save(); c.translate(P.w * .54, P.h * .04); c.rotate(1.75); c.scale(1.5, 1.5); figure(c, (c) => { limb(c, [[-200, 0], [-60, 0], [0, 0]], [60, 54, 50], DEVA.brahma.skin); devaHand(c, [0, 0], 0, 'palm', devaPal({ who: 'brahma' })); }, lit(DAY())); c.restore();
};
ART.windReturns = (c, P) => {
  vgrad(c, P, [[0, '#6AB0E8'], [.6, '#CFE8F6'], [1, '#E8D8A0']]);
  speedLines(c, P.w * -.1, P.h * .5, 30, 300, 1400, 'rgba(255,255,255,.7)', 4, 3, -.25, .25);
  ridge(c, P.w, P.h, P.h * .8, 20, '#8AA86A', 5);
  const R = lcg(4);
  for (let i = 0; i < 40; i++) leaf(c, P.w * R(), P.h * (.2 + R() * .5), 10 + R() * 6, R() * 6, ['#5E8A3A', '#7AA048'][i % 2]);
  for (const [x, y, a] of [[.6, .2, -.3], [.7, .14, -.2], [.82, .24, -.4]]) bird(c, P.w * x, P.h * y, .9, a, '#2A3A4A');
  // people breathing again: arms flung up, cloths streaming
  for (let i = 0; i < 6; i++) { c.save(); c.translate(P.w * (.12 + i * .15), P.h * .98); c.scale((i % 2 ? .3 : -.3), .3); manSil(c, { pose: i % 3 ? 'raise' : 'shout', head: ['knot', 'turban', 'bare'][i % 3], col: '#2A3A2A' }); c.restore(); }
};

// =================== p12–13 · the boons ===================
ART.brahmaAsks = (c, P) => {
  vgrad(c, P, [[0, '#F2D8A0'], [1, '#D8A870']]);
  brahmaAt(c, P.w * .16, P.h * .4, .42, { expr: 'speak', look: [1, 0], arms: ['down', 'open'] }, false);
  vayuWithBoy(c, P.w * .84, P.h * .44, .4, {}, { expr: 'giggle' });
};
// one row per god (pp. 12–14): the god in his own colours on one side (L: on the left, the words right), holding
// what he gives; a soft beam of his light toward the words. Scaled to the row's height.
const BOON = {
  boonIndra: ['L', ['#9EC2E8', '#E2EEF8'], '#FFFFFF', { who: 'indra', crown: 'kirita', tilak: 'dot', stache: true, expr: 'kind', arms: ['down', 'fist'], hold: 'garland' }],
  boonSurya: ['R', ['#E8603A', '#FFC070'], '#FFF0A0', { who: 'surya', crown: 'sun', tilak: 'line', expr: 'smile', arms: ['down', 'fist'], hold: 'lotus' }],
  boonVaruna: ['L', ['#2E6A8A', '#8AC8D8'], '#C8F0FF', { who: 'varuna', crown: 'kirita', tilak: 'dot', expr: 'kind', arms: ['down', 'fist'], hold: 'noose' }],
  boonYama: ['R', ['#2A2A3A', '#6A6A8A'], '#C8C0E8', { who: 'yama', crown: 'mukut', stache: true, tilak: 'line', expr: 'calm', arms: ['down', 'fist'], hold: 'staff' }],
  boonKubera: ['L', ['#2E6A4A', '#B8D8A0'], '#FFE48A', { who: 'kubera', crown: 'mukut', stache: true, tilak: 'dot', expr: 'smile', build: 1.18, arms: ['down', 'fist'], hold: 'mace' }],
  boonShiva: ['R', ['#3A3A5A', '#A8B8D8'], '#E8F0FF', { who: 'shiva', crown: 'jata', moon: true, snake: true, snakeSide: 1, thirdEye: true, tilak: 'tripundra', dress: 'rishi', expr: 'kind', arms: ['down', 'fist'], hold: 'trishul' }],
  boonBrahma: ['L', ['#E8B870', '#FBE0B0'], '#FFF4D0', null],
  boonVishva: ['R', ['#5A5A6A', '#B8B0A0'], '#FFD8A0', { who: 'vishva', crown: 'mukut', beard: 'long', stache: true, age: .7, tilak: 'line', expr: 'kind', arms: ['down', 'fist'], hold: 'hammer' }],
};
for (const [name, [side, [a, b], beam, o]] of Object.entries(BOON)) {
  ART[name] = (c, P) => {
    const L = side === 'L', gx = P.w * (L ? .17 : .8), k = .42 * P.h / 330, gy = P.h * .43;
    const g = c.createLinearGradient(L ? 0 : P.w, 0, L ? P.w : 0, 0); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, P.w, P.h);
    glow(c, gx, gy, 260 * k / .42, beam, .45);
    if (!o) brahmaAt(c, gx, gy, k, { expr: 'kind', look: [L ? 1 : -1, 0], arms: ['down', 'fist'], hold: 'kamandalu' }, false, lit(DAY()));
    else bust(c, gx, gy, k, { ...o, look: [L ? .6 : -.6, 0], turn: L ? .2 : -.2, t: P.t }, lit(DAY()));
  };
}
ART.boonEnd = (c, P) => {
  vgrad(c, P, [[0, '#F2D8A0'], [1, '#D8A870']]);
  glow(c, P.w * .8, P.h * .4, 380, '#FFF2C0', .6);
  brahmaAt(c, P.w * .17, P.h * .5, .74, { expr: 'smile', look: [1, 0], arms: ['down', 'open'] }, false);
  vayuWithBoy(c, P.w * .78, P.h * .5, .74, { expr: 'laugh' }, { expr: 'grin', pose: 'wail' });
};

// =================== p14 · trouble ===================
function pot(c, x, y, k, a, col = '#B8642A') { c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k); const K = 'M -40 -40 C -70 0 -50 50 0 54 C 50 50 70 0 40 -40 Z'; fillPath(c, K, col); strokePath(c, K, '#5A2A10', 3); fillPath(c, 'M -30 -50 L 30 -50 L 26 -38 L -26 -38 Z', col); c.restore(); }
ART.ladle = (c, P) => {
  ashram(c, P);
  // the sacrificial fire, pots flying, the ladle spinning up
  fillPath(c, `M ${P.w * .3} ${P.h * .9} L ${P.w * .36} ${P.h * .8} L ${P.w * .62} ${P.h * .8} L ${P.w * .68} ${P.h * .9} Z`, '#8A5A3A');
  pot(c, P.w * .2, P.h * .32, .9, .6); pot(c, P.w * .82, P.h * .22, .8, -.8, '#C8A040'); pot(c, P.w * .72, P.h * .45, .7, 2.2);
  c.save(); c.translate(P.w * .6, P.h * .12); c.rotate(-.7); strokePath(c, 'M -60 0 L 50 0', '#7A4A20', 9); ellipse(c, 60, 0, 22, 14, '#C8A040'); c.restore();
  baby(c, P.w * .46, P.h * .44, .62, -.2, { pose: 'reach', expr: 'giggle', look: [.5, -1], t: P.t, jewel: true });
  bust(c, P.w * .16, P.h * .78, .34, { ...RISHI, expr: 'shock', look: [1, -1], arms: ['down', 'up'] }, lit(DAY()));
};
ART.barkSwing = (c, P) => {
  ashram(c, P);
  strokePath(c, `M -20 ${P.h * .24} Q ${P.w * .5} ${P.h * .36} ${P.w + 20} ${P.h * .2}`, '#6A4A2A', 5);
  for (let i = 0; i < 4; i++) { const x = P.w * (.12 + i * .22); fillPath(c, `M ${x} ${P.h * .27} L ${x + 60} ${P.h * .29} L ${x + 56} ${P.h * .5} L ${x + 4} ${P.h * .48} Z`, ['#B88A5A', '#C8A070'][i % 2]); }
  // he hangs from it by both hands, kicking; it tears
  baby(c, P.w * .56, P.h * .46, .62, 0, { pose: 'swing', arms: [[-1.9, .1], [-1.3, -.1]], expr: 'giggle', look: [-.6, -.5], t: P.t, jewel: true });
  bust(c, P.w * .84, P.h * .76, .34, { ...RISHI, pal: { skin: '#D07050', skinSh: '#A84E34' }, expr: 'rage', look: [-1, -1], arms: ['fist', 'down'] }, lit(DAY()));
};
ART.parentsNo = (c, P) => {
  ashram(c, P);
  bust(c, P.w * .2, P.h * .66, 0.42, { expr: 'fierce', crown: 'mukut', age: .25, arms: ['down', 'point'], pal: { skin: '#C8842E', skinSh: '#985A16', cloth: '#2E5A9A', clothSh: '#1A3A6A' } }, lit(DAY()), hanBust);
  bust(c, P.w * .48, P.h * .66, 0.42, { ...VAYU, expr: 'fierce', arms: ['down', 'point'] }, lit(DAY()));
  bust(c, P.w * .76, P.h * .66, 0.42, { expr: 'pout', look: [1, 0], arms: ['down', 'point'] }, lit(DAY()), anjanaBust);
  // the boy's tail tip vanishing out of frame
  limb(c, [[P.w + 30, P.h * .7], [P.w * .95, P.h * .68], [P.w * .93, P.h * .6], [P.w * .95, P.h * .56]], [20, 18, 14, 10], BH.fur);
};
ART.stripDark = (c, P) => { c.fillStyle = '#0E0A10'; c.fillRect(0, 0, P.w, P.h); };

// =================== p15 · the curse ===================
ART.rishisCurse = (c, P) => {
  ashram(c, P);
  c.fillStyle = 'rgba(80,20,10,.25)'; c.fillRect(0, 0, P.w, P.h);
  bust(c, P.w * .16, P.h * .5, .44, { ...RISHI, expr: 'fierce', look: [1, 0], arms: ['down', 'abhaya'] }, lit(DAY()));
  bust(c, P.w * .38, P.h * .54, .42, { ...RISHI, pal: { beard: '#BEB6AA', hair: '#5A5248' }, beard: 'short', expr: 'fierce', look: [1, .2], arms: ['abhaya', 'down'] }, lit(DAY()));
  baby(c, P.w * .86, P.h * .55, .5, 0, { pose: 'sit', expr: 'wonder', look: [-1, -.4], t: P.t, jewel: true });
};
ART.dizzy = (c, P) => {
  // the curse lands: he sits down hard, his head spinning, the gold glow drifting off him (7.36.33–34)
  ashram(c, P); c.fillStyle = 'rgba(70,50,90,.35)'; c.fillRect(0, 0, P.w, P.h);
  const x = P.w * .66, y = P.h * .4;
  glow(c, x, y + 60, 200, '#FFD27A', .25);
  const R = lcg(12); for (let i = 0; i < 26; i++) { const a = R() * TAU, r = 90 + R() * 160; ellipse(c, x + Math.cos(a) * r * 1.4, y + 40 + Math.sin(a) * r * .8 - R() * 60, 3 + R() * 4, 3 + R() * 4, rgba('#FFE08A', .35 + R() * .5)); }
  baby(c, x, y, .62, -.12, { pose: 'sit', expr: 'dizzy', t: P.t, jewel: true, tail: 'limp' });
  // stars circling his head
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .4, sx = x + Math.cos(a) * 92, sy = y - 70 + Math.sin(a) * 22; c.save(); c.translate(sx, sy); const st = new Path2D(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 6 : 15, b2 = j / 10 * TAU - Math.PI / 2; j ? st.lineTo(Math.cos(b2) * r, Math.sin(b2) * r) : st.moveTo(Math.cos(b2) * r, Math.sin(b2) * r); } st.closePath(); fillPath(c, st, '#FFE060'); strokePath(c, st, '#8A5A10', 2.5); c.restore(); }
  strokePath(c, `M ${x - 100} ${y - 70} A 100 24 0 0 0 ${x + 100} ${y - 70}`, rgba('#FFFFFF', .7), 3);
};
ART.gentle = (c, P) => {
  ashram(c, P);
  // the rishis by the hut, smiling now
  bust(c, P.w * .72, P.h * 0.632, 0.3, { ...RISHI, expr: 'kind', look: [-1, 0], arms: ['down', 'abhaya'] }, lit(DAY()));
  bust(c, P.w * .88, P.h * 0.657, 0.28, { ...RISHI, beard: 'short', expr: 'smile', look: [-1, 0] }, lit(DAY()));
  // the boy walking carefully with a pot of water held up on his head
  baby(c, P.w * .46, P.h * .46, .56, 0, { pose: 'stand', arms: [[-1.9, -.9], [-1.25, .9]], expr: 'calm', look: [1, 0], turn: .3, t: P.t, jewel: true });
  c.save(); c.translate(P.w * .46, P.h * .46 - 150 * .56); kalash(c, 0, 0, .55); c.restore();
};

// =================== p16 · the answer ===================
ART.valiAgain = (c, P) => {
  ART.valiSugriva(c, P);
  // this time we see Hanuman: his fists clenched, nothing coming
  glow(c, P.w * .88, P.h * .55, 160, '#FFD27A', .45);
};
ART.agastya = (c, P) => {
  court(c, P);
  bust(c, P.w * .2, P.h * .42, .5, { who: 'agastya', crown: 'jata', beard: 'long', stache: true, tilak: 'tripundra', age: .7, dress: 'rishi', expr: 'speak', look: [1, 0], arms: ['down', 'open'] }, WARM());
};
ART.hanBowed2 = (c, P) => { court(c, P); bust(c, P.w * .72, P.h * .5, .8, { expr: 'sleep', arms: ['namaste', 'namaste'], tilt: .16 }, WARM(), hanBust); };
