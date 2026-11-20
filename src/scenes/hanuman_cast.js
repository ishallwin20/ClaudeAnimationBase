// Issue 2's cast: first pass, the existing rigs as they are (baseline for the cast test).
const DAY = (dx = 5, dy = -4) => KLIGHT(dx, dy);
function skyDawn(c, P, top = '#F6B26B', bot = '#FBE3B0') { const g = c.createLinearGradient(0, 0, 0, P.h); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, P.w, P.h); }
const HAN_PAL = { fur: '#D99A3A', furSh: '#A8701E', furDk: '#6E4210', furLt: '#F2C46A', chest: '#E8B870', face: '#EBC59A', faceSh: '#C29A6C', muzzle: '#F2D6B0', dhoti: '#D8322E', dhotiSh: '#A21E1E' };
ART.tBalSit = (c, P) => { skyDawn(c, P); c.translate(P.w / 2, P.h * .42); c.scale(1.15, 1.15); figure(c, (c) => balHanuman(c, { pose: 'wail', expr: 'wail', t: P.t }), lit(DAY())); };
ART.tBalWonder = (c, P) => { skyDawn(c, P, '#E8704A', '#F8C890'); glow(c, P.w * .5, -40, 300, '#FF6A3A', .5); c.translate(P.w / 2, P.h * .56); c.scale(2.1, 2.1); figure(c, (c) => balHead(c, { expr: 'hungry', look: [0, -1], red: .8, t: P.t }), lit(DAY(0, -6))); };
ART.tBalLeap = (c, P) => { skyDawn(c, P, '#5A9AD8', '#CFE6F6'); c.translate(P.w * .5, P.h * .42); c.rotate(.5); figure(c, (c) => balHanuman(c, { pose: 'leap', expr: 'grin', look: [.6, -.6], t: P.t }), lit(DAY())); };
ART.tBalFall = (c, P) => { skyDawn(c, P, '#3A3048', '#7A6A80'); c.translate(P.w / 2, P.h * .5); c.rotate(-1.4); figure(c, (c) => balHanuman(c, { pose: 'limp', expr: 'hurt', bruise: 1, t: P.t }), lit(DAY())); };
const EXPRS = ['calm', 'wonder', 'hungry', 'wail', 'grin', 'giggle', 'fierce', 'hurt', 'pout'];
ART.tBalExpr = (c, P) => { skyDawn(c, P, '#F8D8A0', '#FBEED0'); c.translate(P.w / 2, P.h * .5); c.scale(1.25, 1.25); const i = P.i; figure(c, (c) => balHead(c, { expr: EXPRS[i], turn: [0, -.5, .4, 0, .5, 0, -.4, 0, .3][i], t: P.t }), lit(DAY())); };
ART.tHanHead = (c, P) => { skyDawn(c, P, '#2A2440', '#8A5A50'); const H = [['calm', 'band', 0, 0], ['fierce', 'band', .4, 0], ['tender', 'mukut', -.3, 0]];
  H.forEach(([e, cr, tn, age], i) => { c.save(); c.translate(P.w * (.18 + i * .32), P.h * .58); c.scale(1.35, 1.35); figure(c, (c) => hanHead(c, { expr: e, crown: cr, turn: tn, age, t: P.t }), lit(KLIGHT(5, -4, { rim: '#FFD89A' }))); c.restore(); }); };
ART.tHanStand = (c, P) => { skyDawn(c, P, '#2A2440', '#8A5A50'); c.translate(P.w / 2, P.h * .97); c.scale(.6, .6); figure(c, (c) => hanumanFig(c, { pose: 'plant', arms: 'hips', expr: 'smile', t: P.t }), lit(KLIGHT(5, -4, { rim: '#FFD89A' }))); };
ART.tHanRoar = (c, P) => { skyDawn(c, P, '#401010', '#C04020'); c.translate(P.w / 2, P.h * .52); c.scale(1.9, 1.9); figure(c, (c) => hanHead(c, { expr: 'roar', blood: 1, t: P.t }), lit(KLIGHT(5, -4, { rim: '#FFD89A' }))); };
ART.tHanOld = (c, P) => { skyDawn(c, P, '#E8C890', '#F6E6C0'); c.translate(P.w / 2, P.h * .55); c.scale(1.7, 1.7); figure(c, (c) => hanHead(c, { expr: 'tender', age: 1, crown: false, t: P.t }), lit(DAY())); };
// the gods (cine_deva.js)
const GODS = [
  ['#F6D9A8', '#FBEBD0', { who: 'ram', crown: 'kirita', tilak: 'namam', expr: 'kind', arms: ['down', 'abhaya'] }],
  ['#9EC2E8', '#E2EEF8', { who: 'indra', crown: 'kirita', tilak: 'dot', stache: true, expr: 'fierce', arms: ['down', 'throw'] }],
  ['#3A4A6A', '#8AA2C2', { who: 'vayu', crown: 'kirita', hair: 'wind', tilak: 'dot', expr: 'grief', arms: ['cradle', 'cradle'] }],
  ['#E8603A', '#FFC070', { who: 'surya', crown: 'sun', tilak: 'line', expr: 'kind', arms: ['down', 'abhaya'] }],
  ['#140A1E', '#4A2A4A', null],
  ['#C8B08A', '#EAD8B8', { who: 'agastya', crown: 'jata', beard: 'long', stache: true, tilak: 'tripundra', age: .7, dress: 'rishi', expr: 'speak', arms: ['down', 'abhaya'] }],
];
ART.tGod = (c, P) => {
  const [a, b, o] = GODS[P.i]; skyDawn(c, P, a, b);
  if (!o) { c.translate(P.w * .45, P.h * .42); c.scale(1.1, 1.1); figure(c, (c) => rahuHead(c, { expr: 'scream', look: [-.6, 0], t: P.t }), lit(DAY())); return; }
  c.translate(P.w / 2, P.h * .38); c.scale(.56, .56); figure(c, (c) => devaBust(c, { ...o, t: P.t }), lit(DAY()));
};
const GEX = [['ram', 'smile'], ['ram', 'grief'], ['ram', 'speak'], ['indra', 'rage'], ['indra', 'shock'], ['vayu', 'rage'], ['vayu', 'pain'], ['agastya', 'laugh'], ['rahu', 'shock']];
ART.tGodExpr = (c, P) => {
  const [w, e] = GEX[P.i]; skyDawn(c, P, '#F8D8A0', '#FBEED0');
  const base = GODS.find(g => g[2] && g[2].who === w); const o = base ? base[2] : {};
  c.translate(P.w / 2, P.h * .56); c.scale(1.05, 1.05);
  figure(c, (c) => w === 'rahu' ? rahuHead(c, { expr: e, t: P.t }) : devaHead(c, { ...o, expr: e, turn: [0, .3, -.3, 0, .2, -.3, 0, .3, 0][P.i], t: P.t }), lit(DAY()));
};
ART.tAiravata = (c, P) => {
  skyDawn(c, P, '#5A8AD0', '#DCEAF6');
  c.translate(P.w * .4, P.h * .97); c.scale(.85, .85);
  figure(c, (c) => airavataSide(c, { t: P.t, trunk: .1, seat: (c) => { c.save(); c.translate(0, -230); c.scale(.55, .55); devaBust(c, { who: 'indra', crown: 'kirita', tilak: 'dot', stache: true, expr: 'fierce', look: [1, 0], arms: ['down', 'throw'] }); c.restore(); } }), lit(DAY()));
};
ART.tHanBust = (c, P) => { skyDawn(c, P, '#2A2440', '#8A5A50'); c.translate(P.w / 2, P.h * .3); c.scale(.8, .8); figure(c, (c) => hanBust(c, { expr: 'calm', arms: ['namaste', 'namaste'], t: P.t }), lit(DAY())); };
ART.tVayuChild = (c, P) => {
  skyDawn(c, P, '#2A2234', '#5A5070'); c.translate(P.w / 2, P.h * .3); c.scale(.8, .8);
  figure(c, (c) => { devaBust(c, { who: 'vayu', crown: 'kirita', hair: 'wind', tilak: 'dot', expr: 'grief', look: [0, 1], arms: ['cradle', 'down'], t: P.t }); c.save(); c.translate(-190, 330); c.rotate(-1.62); c.scale(.78, .78); balHanuman(c, { pose: 'limp', expr: 'hurt', bruise: 1, blood: 1, tail: 'limp' }); c.restore(); }, lit(DAY()));
};
const GODS2 = [
  ['brahma', (c) => { c.save(); c.translate(0, 560); lotusSeat(c, 300); c.restore(); brahmaBust(c, { expr: 'speak', arms: ['down', 'abhaya'], hold: null }); }],
  ['shiva', (c) => devaBust(c, { who: 'shiva', crown: 'jata', moon: true, snake: true, thirdEye: true, tilak: 'tripundra', hair: 'long', dress: 'rishi', expr: 'kind', arms: ['down', 'fist'], hold: 'trishul' })],
  ['yama', (c) => devaBust(c, { who: 'yama', crown: 'mukut', stache: true, tilak: 'line', expr: 'fierce', arms: ['down', 'fist'], hold: 'staff' })],
  ['varuna', (c) => devaBust(c, { who: 'varuna', crown: 'kirita', tilak: 'dot', expr: 'calm', arms: ['down', 'fist'], hold: 'noose' })],
  ['kubera', (c) => devaBust(c, { who: 'kubera', crown: 'mukut', stache: true, tilak: 'dot', expr: 'smile', build: 1.18, arms: ['down', 'fist'], hold: 'mace' })],
  ['vishva', (c) => devaBust(c, { who: 'vishva', crown: 'mukut', beard: 'long', stache: true, age: .7, tilak: 'line', expr: 'kind', arms: ['down', 'fist'], hold: 'hammer' })],
  ['kesari', (c) => hanBust(c, { expr: 'fierce', crown: 'mukut', age: .25, arms: ['down', 'down'], pal: { skin: '#C8842E', skinSh: '#985A16', cloth: '#2E5A9A', clothSh: '#1A3A6A' } })],
  ['anjana', (c) => anjanaHead(c, { expr: 'calm', t: 0 })],
  ['rishi', (c) => devaBust(c, { who: 'rishi', crown: 'jata', beard: 'long', stache: true, age: .8, tilak: 'tripundra', dress: 'rishi', expr: 'fierce', arms: ['down', 'abhaya'] })],
];
ART.tGod2 = (c, P) => {
  const [w, f] = GODS2[P.i]; skyDawn(c, P, '#F8D8A0', '#FBEED0');
  const head = w === 'anjana';
  c.translate(P.w / 2, P.h * (head ? .52 : .34)); c.scale(head ? 1.2 : .4, head ? 1.2 : .4); figure(c, (c) => f(c), lit(DAY()));
};
const HFIG = [
  { legs: 'stand', arms: ['hip', 'hip'], expr: 'smile' }, { legs: 'crouch', arms: [[1.3, -.3, 'fist'], [1.3, -.3, 'fist']], expr: 'fierce', tail: 'stream' },
  { legs: 'leap', arms: ['reach', 'reach'], expr: 'fierce', tail: 'stream', rot: .9 }, { legs: 'run', arms: ['fist', 'reach'], expr: 'roar', tail: 'stream' },
  { legs: 'kneel', arms: ['namaste', 'namaste'], expr: 'tender', tail: 'curl' }, { legs: 'stride', arms: ['down', 'up'], expr: 'shout' },
];
ART.tHanFig = (c, P) => { skyDawn(c, P, '#7AA8D8', '#E8F0F8'); const o = HFIG[P.i]; c.translate(P.w / 2, P.h * .2); c.rotate(o.rot || 0); c.scale(.24, .24); figure(c, (c) => hanFigure(c, { ...o, t: P.t }), lit(DAY())); };

ART.tRavana = (c, P) => { skyDawn(c, P, '#3A1A2A', '#8A3A3A'); c.translate(P.w / 2, P.h * .3); c.scale(.62, .62); figure(c, (c) => dashaBust(c, { expr: 'fierce', arms: ['down', 'fist'], hold: 'sword', t: P.t }), lit(DAY())); };
const LANKA1 = [
  (c) => sitaBust(c, { expr: 'grief', look: [0, .4], arms: ['down', 'down'] }),
  (c) => sitaBust(c, { expr: 'smile', look: [0, .6], arms: ['chest', 'down'] }),
  (c) => devaBust(c, { who: 'aksha', crown: 'mukut', expr: 'fierce', dress: 'armor', armor: '#B8862A', arms: ['down', 'fist'], hold: 'bow' }),
  (c) => devaBust(c, { who: 'indrajit', crown: 'kirita', stache: true, expr: 'fierce', dress: 'armor', armor: '#3A3A4A', tilak: 'line', arms: ['down', 'fist'], hold: 'bow' }),
  (c) => devaBust(c, { who: 'vibhi', crown: 'mukut', stache: true, beard: 'short', tilak: 'dot', expr: 'speak', arms: ['down', 'abhaya'] }),
  (c) => devaBust(c, { who: 'bhima', crown: 'band', stache: true, build: 1.2, expr: 'shock', arms: ['down', 'fist'], hold: 'mace' }),
];
ART.tLanka = (c, P) => { skyDawn(c, P, '#F8D8A0', '#FBEED0'); c.translate(P.w / 2, P.h * .4); c.scale(.6, .6); figure(c, (c) => LANKA1[P.i](c), lit(DAY())); };
const LANKA2 = [
  (c) => rakshasaBust(c, { r: 0, expr: 'rage', arms: ['down', 'fist'], hold: 'hammer' }),
  (c) => rakshasaBust(c, { r: 1, expr: 'fierce', arms: ['down', 'fist'], hold: 'mace' }),
  (c) => rakshasaBust(c, { r: 2, expr: 'laugh', arms: ['down', 'down'] }),
  (c) => rakshasaBust(c, { r: 3, expr: 'scream', arms: ['up', 'fist'], hold: 'mace' }),
  (c) => simhikaHead(c, {}),
  (c) => hanBust(c, { expr: 'smile', age: 1, arms: ['down', 'down'] }),
];
ART.tLanka2 = (c, P) => { skyDawn(c, P, '#7AA8D8', '#E8F0F8'); const hd = P.i === 4; c.translate(P.w / 2, P.h * (hd ? .45 : .3)); c.scale(hd ? 1.1 : .6, hd ? 1.1 : .6); figure(c, (c) => LANKA2[P.i](c), lit(DAY())); };
