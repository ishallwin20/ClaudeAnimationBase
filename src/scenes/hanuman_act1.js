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
ART.hell = (c, P) => {
  vgrad(c, P, [[0, '#2E3428'], [.45, '#7A7A56'], [1, '#2A2A1E']]);
  const SICK = { ...lit(DAY()), tint: ['#6A7A4A', .28] };
  // heaven: the gods on their clouds, choking
  puffs(c, P.w * .62, P.h * .22, 900, '#A8A88A', 4, 9);
  [['indra', { crown: 'kirita', stache: true, tilak: 'dot' }, 'throat'], ['surya', { crown: 'sun', tilak: 'line' }, 'chest'], ['kubera', { crown: 'mukut', stache: true, build: 1.25 }, 'throat']].forEach(([w, o, a], i) =>
    bust(c, P.w * (.42 + i * .2), P.h * (.15 + (i % 2) * .03), .3, { who: w, ...o, expr: i % 2 ? 'pain' : 'shock', look: [0, .4], arms: [a, 'chest'] }, SICK));
  puffs(c, P.w * .62, P.h * .33, 900, '#B8B898', 7, 9);
  // a gandharva falling out of the sky
  c.save(); c.translate(P.w * .18, P.h * .3); c.rotate(2.6); c.scale(.32, .32); figure(c, (c) => devaBust(c, { who: 'indra', pal: { skin: '#E8B890', cloth: '#7A3AA0', clothSh: '#4A1A6A' }, crown: 'mukut', expr: 'scream', arms: ['up', 'up'] }), SICK); c.restore();
  // earth: a city whose people stand still as walls
  for (let i = 0; i < 9; i++) { const x = P.w * (i / 8), h = P.h * (.08 + (i % 3) * .03); fillPath(c, `M ${x - 50} ${P.h * .58} L ${x - 50} ${P.h * .58 - h} L ${x} ${P.h * .58 - h - 40} L ${x + 50} ${P.h * .58 - h} L ${x + 50} ${P.h * .58} Z`, '#4A4A36'); }
  fillPath(c, `M -20 ${P.h * .58} L ${P.w + 20} ${P.h * .58} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#5E5A40');
  const R = lcg(8);
  for (let i = 0; i < 12; i++) { const x = P.w * (.05 + i * .08 + (R() - .5) * .03), y = P.h * (.64 + (i % 2) * .02), k = .12 + R() * .02; c.save(); c.translate(x, y); c.scale(k * (i % 2 ? 1 : -1), k); manSil(c, { pose: 'stand', head: ['knot', 'turban', 'bare'][i % 3], col: '#26261A' }); c.restore(); }
  // the altar in front: the fire dead, a thread of smoke straight up
  fillPath(c, `M ${P.w * .08} ${P.h * .96} L ${P.w * .13} ${P.h * .86} L ${P.w * .4} ${P.h * .86} L ${P.w * .45} ${P.h * .96} Z`, '#3A3424');
  for (let i = 0; i < 5; i++) strokePath(c, `M ${P.w * (.16 + i * .05)} ${P.h * .86} L ${P.w * (.18 + i * .04)} ${P.h * .83}`, '#1A1410', 10);
  strokePath(c, `M ${P.w * .26} ${P.h * .83} C ${P.w * .26} ${P.h * .76} ${P.w * .26} ${P.h * .72} ${P.w * .26} ${P.h * .64}`, 'rgba(200,200,180,.6)', 8);
  // the priest at it, choking: close, in colour
  bust(c, P.w * .7, P.h * .68, .62, { ...RISHI, expr: 'pain', look: [0, -1], tilt: -.25, arms: ['throat', 'throat'] }, SICK);
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
const BOON = {
  boonIndra: [['#9EC2E8', '#E2EEF8'], { who: 'indra', crown: 'kirita', tilak: 'dot', stache: true, expr: 'kind', arms: ['down', 'fist'], hold: 'garland' }],
  boonSurya: [['#E8603A', '#FFC070'], { who: 'surya', crown: 'sun', tilak: 'line', expr: 'smile', arms: ['down', 'abhaya'] }],
  boonVaruna: [['#2E6A8A', '#8AC8D8'], { who: 'varuna', crown: 'kirita', tilak: 'dot', expr: 'calm', arms: ['down', 'fist'], hold: 'noose' }],
  boonYama: [['#2A2A3A', '#6A6A8A'], { who: 'yama', crown: 'mukut', stache: true, tilak: 'line', expr: 'calm', arms: ['down', 'fist'], hold: 'staff' }],
  boonKubera: [['#2E6A4A', '#B8D8A0'], { who: 'kubera', crown: 'mukut', stache: true, tilak: 'dot', expr: 'smile', build: 1.18, arms: ['down', 'fist'], hold: 'mace' }],
  boonShiva: [['#3A3A5A', '#A8B8D8'], { who: 'shiva', crown: 'jata', moon: true, snake: true, thirdEye: true, tilak: 'tripundra', dress: 'rishi', expr: 'kind', arms: ['down', 'fist'], hold: 'trishul' }],
  boonBrahma: [['#E8B870', '#FBE0B0'], null],
  boonVishva: [['#5A5A6A', '#B8B0A0'], { who: 'vishva', crown: 'mukut', beard: 'long', stache: true, age: .7, tilak: 'line', expr: 'kind', arms: ['down', 'fist'], hold: 'hammer' }],
};
for (const [name, [[a, b], o]] of Object.entries(BOON)) {
  ART[name] = (c, P) => {
    vgrad(c, P, [[0, a], [1, b]]);
    if (!o) { brahmaAt(c, P.w * .5, P.h * .76, .48, { expr: 'kind', arms: ['down', 'abhaya'] }, false); return; }
    bust(c, P.w * .5, P.h * .78, .5, { ...o, t: P.t }, lit(DAY()));
  };
}
ART.boonEnd = (c, P) => {
  vgrad(c, P, [[0, '#F2D8A0'], [1, '#D8A870']]);
  brahmaAt(c, P.w * .14, P.h * .52, .36, { expr: 'smile', look: [1, 0], arms: ['down', 'open'] }, false);
  vayuWithBoy(c, P.w * .8, P.h * .5, .46, { expr: 'laugh' }, { expr: 'grin', pose: 'wail' });
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
  bust(c, P.w * .2, P.h * .45, .42, { expr: 'fierce', crown: 'mukut', age: .25, arms: ['down', 'point'], pal: { skin: '#C8842E', skinSh: '#985A16', cloth: '#2E5A9A', clothSh: '#1A3A6A' } }, lit(DAY()), hanBust);
  bust(c, P.w * .48, P.h * .42, .42, { ...VAYU, expr: 'fierce', arms: ['down', 'point'] }, lit(DAY()));
  bust(c, P.w * .76, P.h * .44, .42, { expr: 'pout', look: [1, 0], arms: ['down', 'point'] }, lit(DAY()), anjanaBust);
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
ART.eyesDim = (c, P) => {
  vgrad(c, P, [[0, '#3A3040'], [1, '#2A2230']]);
  c.save(); c.translate(P.w * .5, P.h * .78); c.scale(3.2, 3.2);
  figure(c, (c) => balHead(c, { expr: 'calm', look: [0, .2], t: P.t }), { ...lit(DAY()), tint: ['#6A6080', .3] });
  c.restore();
};
ART.gentle = (c, P) => {
  ashram(c, P);
  // the rishis by the hut, smiling now
  bust(c, P.w * .72, P.h * .5, .3, { ...RISHI, expr: 'kind', look: [-1, 0], arms: ['down', 'abhaya'] }, lit(DAY()));
  bust(c, P.w * .88, P.h * .54, .28, { ...RISHI, beard: 'short', expr: 'smile', look: [-1, 0] }, lit(DAY()));
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
