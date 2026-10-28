// bhima.js: "BHIMA couldn't lift an old monkey's TAIL" (Painterly; STORYBOARD.md). Mahabharata, Vana Parva CXLV–CL.
// One painted stage (the banana grove, bhima_cast.js) shot with a camera: wide, two-shots and shot/reverse close-ups;
// a vista for the lotus, the sky for the giant, Kurukshetra for the flag, then the Books 1–3 card.
// Characters are baked cut-outs; their moving parts are stepped poses (about 6 a second) and swapped faces.
const ZK = 2.4;   // bake resolution for anything a close-up comes near
const TL = {
  hook: 0, lotus: 3.4, charge: 6.8, roar: 9.8, monkey: 12.4, wake: 15.4, getup: 18.6, jump: 21.0, god: 24.0, leap: 27.2,
  who: 30.4, bro: 32.8, tail: 35.6, one: 38.8, both: 40.4, budge: 42.2, bow: 44.8, iam: 48.0, elder: 51.0, vayu: 53.4,
  show: 56.4, giant: 59.4, grow2: 62.4, hug: 65.0, flag: 68.4, ask: 72.0, card: 75.4, end: 80.4,
};
const STEP = 6;   // stepped-animation rate (poses a second)
const stepT = t => Math.floor(t * STEP);

// ---------- layers ----------
const grove = (rock = true) => ptLayer('grove' + +rock, [0, 0, W, H], c => bhGrove(c, { rock }), { seed: 5 });
const tailL = k => ptLayer('tail' + k, BH_TAIL_BOX, bhTail(k / 8), { alpha: true, seed: 9, brushes: PT_BRUSHES.slice(2), k: 2.2 });
const hanBody = () => ptLayer('hanLie', [600, 1060, 520, 270], bhHanumanLie, { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(1), k: ZK, fine: [[672, 1205, 40]] });
const HN_FACES = {
  sleep: { eyes: [0, 0], mouth: 'smile' }, lazy: { eyes: [0, .45], look: [-.6, .2], mouth: 'smile', brows: [0, -.2] }, lazyT: { eyes: [0, .45], look: [-.6, .2], mouth: 'talk', brows: [0, -.2] },
  smirk: { eyes: [.5, .6], look: [-.8, 0], brows: [-.4, .9], mouth: 'smirk' }, smirkT: { eyes: [.5, .6], look: [-.8, 0], brows: [-.4, .9], mouth: 'talk' },
  yawn: { eyes: [0, 0], mouth: 'yawn', brows: [.4, .4] }, smile: { eyes: [1, 1], look: [-.6, 0], brows: [.3, .3], mouth: 'grin' }, smileT: { eyes: [1, 1], look: [-.6, 0], brows: [.3, .3], mouth: 'talk' },
  tear: { eyes: [0, 0], happy: true, tears: true, mouth: 'grin', blush: true }, front: { eyes: [1, 1], look: [0, .3], brows: [.2, .2], mouth: 'grin' },
};
const hanHead = (f, k = ZK * 1.1) => ptLayer('hh:' + f + k, BH_HEAD_BOX, bhHanumanHead(HN_FACES[f]), { alpha: true, seed: 19, brushes: PT_BRUSHES.slice(2), k, fine: BH_HEAD_FINE, keep: BH_HEAD_KEEP });
const BM_FACES = {
  talk: { mouth: 'talk' }, talkC: { mouth: 'smile' }, shout: { mouth: 'shout', brows: [-1, -1] }, shoutC: { mouth: 'small', brows: [-1, -1] },
  heart: { eyes: [0, 0], mouth: 'smile', brows: [.3, .3] }, heartT: { eyes: [0, 0], mouth: 'talk', brows: [.3, .3] },
  proud: { eyes: [0, 0], happy: true, mouth: 'proud', brows: [.5, .5] }, proudT: { eyes: [0, 0], happy: true, mouth: 'talk', brows: [.5, .5] },
  smug: { eyes: [.55, .55], mouth: 'smile', brows: [.2, .6] }, strain: { strain: true, mouth: 'strain', sweat: true }, strain2: { strain: true, mouth: 'strain', sweat: true, look: [0, -1] },
  bash: { eyes: [.9, .9], look: [.6, .3], mouth: 'small', brows: [.8, .8], blush: true }, bashT: { eyes: [.9, .9], look: [.6, .3], mouth: 'talk', brows: [.8, .8], blush: true },
  joy: { eyes: [1, 1], look: [.6, 0], mouth: 'joy', brows: [1, 1], tears: true }, joyT: { eyes: [1, 1], look: [.6, 0], mouth: 'talk', brows: [1, 1], tears: true },
  eager: { eyes: [1, 1], look: [.6, -.3], mouth: 'joy', brows: [1, 1] }, eagerT: { eyes: [1, 1], look: [.6, -.3], mouth: 'talk', brows: [1, 1] },
  awe: { eyes: [1, 1], look: [.3, -1], mouth: 'o', brows: [1, 1] }, shut: { eyes: [0, 0], mouth: 'o', brows: [-.6, -.6] }, happy: { eyes: [0, 0], happy: true, mouth: 'joy', brows: [.6, .6] },
};
const bmHead = f => ptLayer('bh:' + f, BH_BHEAD_BOX, bhBhimaHead(BM_FACES[f]), { alpha: true, seed: 23, brushes: PT_BRUSHES.slice(2), k: ZK * 1.1, fine: [[16, 10, 70]], keep: [[18, 8, 64, .6]] });
const bodyL = (who, name, P, k = ZK) => ptLayer(who + ':' + name + k, BH_BODY_BOX, bhimaBody(P, who === 'hb' ? HN_LOOK : BH_LOOK), { alpha: true, seed: 29, brushes: PT_BRUSHES.slice(1), k });

// ---------- placing ----------
// a standing figure at stage (x, y) (its feet), scale s. who 'bb' Bhima | 'hb' Hanuman (flipped: he faces left).
function person(c, who, x, y, s, pose, face, o = {}) {
  const P = typeof pose === 'string' ? BH_POSE[pose] : pose, name = typeof pose === 'string' ? pose : 'walk' + o.step;
  const flip = who === 'hb';
  c.save(); c.translate(x + (o.dx || 0), y + (o.dy || 0)); c.scale(s * (flip ? -1 : 1), s);
  if (o.shadow !== false) { c.save(); c.scale(1, .16); glow(c, 0, 0, 230, '#2A2010', .5, 'multiply'); c.restore(); }
  ptDraw(c, bodyL(who, name, P, o.k || ZK));
  const [nx, ny] = bhNeck(P);
  c.translate(nx, ny - (flip ? 58 : 64)); c.rotate((o.tilt || 0) + (P.lean || 0) * .5);
  if (flip) { c.scale(-1, 1); ptDraw(c, hanHead(face, o.hk)); } else ptDraw(c, bmHead(face));
  c.restore();
}
const bhima = (c, x, y, s, pose, face, o) => person(c, 'bb', x, y, s, pose, face, o);
function hanuman(c, face, o = {}) {
  ptDraw(c, hanBody());
  c.save(); c.translate(BH_HH[0], BH_HH[1]); c.rotate(o.tilt ?? -.12); ptDraw(c, hanHead(face)); c.restore();
}
// talking: mouth open/shut stepped, a little irregular, inside [a, b]
const talking = (t, a, b) => t > a && t < b && hash(stepT(t) * 1.3) > .38;
// the camera: stage point (sx, sy) to the frame point (fx, fy), zoom z; shake (px) as a decaying jitter
function cam(c, sx, sy, z, fx = W / 2, fy = H / 2, shake = 0) {
  const j = shake ? [vnoise(T * 31, 1) * shake, vnoise(T * 29, 5) * shake] : [0, 0];
  // keep the view inside the stage (no black edges): zoom in a hair when shaking, then clamp the centre
  z = Math.max(z, 1) * (shake ? 1 + (shake + 2) / 500 : 1);
  sx = clamp(sx, fx / z, W - (W - fx) / z); sy = clamp(sy, fy / z, H - (H - fy) / z);
  c.translate(fx + j[0], fy + j[1]); c.scale(z, z); c.translate(-sx, -sy);
}
const tailK = t => stepT(t * .5) % 8;   // the tip's sway pose
function stage(c, t, o = {}) {
  const g = grove(o.rock !== false);
  if (o.blur) { c.save(); c.filter = `blur(${o.blur}px)`; ptDraw(c, g); c.restore(); } else ptDraw(c, g);
  if (o.tail !== false) ptDraw(c, tailL(o.tailK ?? tailK(t)));
}
// light over the grove: rays from the sun, dust, a breathing glow
function air(c, t, a = 1) {
  rays(c, BH_SUN[0], BH_SUN[1] - 200, { n: 12, dir: Math.PI * .36, spread: .7, len: 2000, w: 220, col: '#FFF4C4', a: .14 * a, t, seed: 3 });
  motes(c, { n: 60, seed: 4, box: [0, 300, 1080, 1700], r: 3, col: '#FFF6C8', a: .6 * a, vx: 8, vy: -8, t });
}
// "z z z" over a sleeper
function zzz(c, x, y, t, a = 1) {
  for (let i = 0; i < 3; i++) { const u = frac(t * .45 + i / 3); text(c, 'z', x + u * 60 + Math.sin(u * 6) * 8, y - u * 120, `700 ${26 + u * 22}px Cinzel`, '#FFF8E0', { alpha: a * Math.sin(u * Math.PI) * .9 }); }
}
// sweat drops flying off a head at (x, y)
function sweat(c, x, y, t) {
  for (let i = 0; i < 4; i++) { const u = frac(t * 1.6 + i / 4), a = (i % 2 ? 1 : -1) * (.6 + hash(i) * .5); const px = x + Math.cos(-Math.PI / 2 + a) * (40 + u * 110), py = y + Math.sin(-Math.PI / 2 + a) * (40 + u * 110) + u * u * 90; ellipse(c, px, py, 7, 10, rgba('#CFEFFF', (1 - u) * .9), a); }
}
function birds(c, t, t0, n = 7, seed = 1) {
  if (t < t0) return; const u = t - t0;
  for (let i = 0; i < n; i++) {
    const x = 300 + hash(i + seed) * 500 + u * (120 + hash(i + 9) * 200) * (hash(i + 3) < .5 ? -1 : 1), y = 900 + hash(i + 5) * 300 - u * (260 + hash(i + 7) * 200), f = Math.sin(t * 22 + i) * 14, s = 1 + hash(i) * .6;
    c.strokeStyle = 'rgba(40,40,30,.75)'; c.lineWidth = 4 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 18 * s, y - f * s); c.quadraticCurveTo(x - 6 * s, y - 4, x, y); c.quadraticCurveTo(x + 6 * s, y - 4, x + 18 * s, y - f * s); c.stroke();
  }
}
const CAPY = 560;   // the caption line in most shots (over the canopy)
const hookAt = n => Array(n).fill(-.35);

// ---------- 1. the hook: the tail across the path ----------
SHOTS.push({ a: TL.hook, b: TL.lotus + .3, draw(c, u, t) {
  cam(c, 640, 1470, 2.0 + u * .02, 540, 1250);
  stage(c, t, { blur: 2.5 });
  ptDraw(c, tailL(tailK(t)));
  air(c, t, .7);
} });
say(-.35, TL.lotus, '*BHIMA* couldn\'t | lift an old | monkey\'s TAIL.', { y: 620, size: 72, at: hookAt(7) });

// ---------- 2. the lotus on the wind ----------
SHOTS.push({ a: TL.lotus, b: TL.charge + .3, xf: .3, draw(c, u, t) {
  c.save(); cam(c, 540, 960, 1 + u * .02); ptDraw(c, ptLayer('vista', [0, 0, W, H], bhVista, { seed: 7 })); c.restore();
  rays(c, 760, 700, { n: 14, dir: Math.PI / 2, spread: 2.6, len: 1400, w: 200, col: '#FFF4D0', a: .18, t, seed: 5 });
  const k = u / 3.8, x = lerp(880, 500, ease(k)) + Math.sin(u * 2.2) * 40, y = lerp(380, 1120, k), r = Math.sin(u * 1.7) * .3;
  for (let i = 1; i < 10; i++) { const uu = Math.max(0, u - i * .08), kk = uu / 3.8; twinkle(c, lerp(880, 500, ease(kk)) + Math.sin(uu * 2.2) * 40 + hash(i) * 30 - 15, lerp(380, 1120, kk) + hash(i + 3) * 30 - 15, 10 + hash(i) * 8, .7 * (1 - i / 10)); }
  glow(c, x, y, 200, '#FFE7A0', .6);
  c.save(); c.translate(x, y); c.rotate(r); c.scale(1.4, 1.4); ptDraw(c, ptLayer('lotus', BH_LOTUS_BOX, bhLotus, { alpha: true, seed: 11, brushes: PT_BRUSHES.slice(2), k: 1.6 })); c.restore();
  motes(c, { n: 50, seed: 8, box: [0, 200, 1080, 1700], r: 3, col: '#FFF4D0', a: .5, vx: -30, vy: 20, t });
} });
say(TL.lotus + .15, TL.charge, 'A golden lotus | blew in on the wind. | *DRAUPADI* wanted more.', { y: 1400 });

// ---------- 3. Bhima charges through the grove ----------
const FALLS = [[TL.charge + 1.2, 330, 1250, -1], [TL.roar + .1, 770, 1260, 1], [TL.roar + 1.3, 250, 1420, -1]];
SHOTS.push({ a: TL.charge, b: TL.monkey + .25, xf: .25, draw(c, u, t) {
  const roar = t > TL.roar, sh = roar ? 6 * Math.exp(-(t - TL.roar) * 2) : 0;
  c.save(); cam(c, 540, 1100, 1.25, 540, 1000, sh);
  ptDraw(c, grove(false));
  // plants knocked flat: they tip over away from the path
  FALLS.forEach(([t0, x, y, s], i) => {
    const k = easeIn(seg(t, t0, t0 + .55)), L = ptLayer('fall' + i, BH_FALL_BOX, bhFallPlant(91 + i), { alpha: true, seed: 31 + i, brushes: PT_BRUSHES.slice(1), k: 1.3 });
    c.save(); c.translate(x, y); c.rotate(s * (k * 1.15 + .04 * Math.sin(seg(t, t0 + .55, t0 + 1) * 9) * (1 - seg(t, t0 + .55, t0 + 1)))); c.scale(.62, .62); ptDraw(c, L); c.restore();
    if (t > t0 + .5) glow(c, x + s * 300, y, 220 * seg(t, t0 + .5, t0 + .9), '#E8D8A8', .5 * (1 - seg(t, t0 + .5, t0 + 1.4)), 'source-over');
  });
  // Bhima: from far up the path, walking toward us
  const k = seg(t, TL.charge, TL.monkey), x = lerp(560, 520, k), y = lerp(1180, 1560, k), s = lerp(.42, .95, easeIn(k * .8 + .2));
  const st = stepT(t) % 4;
  bhima(c, x, y + [0, -6, 0, -6][st] * s, s, bhWalkPose(st), roar ? (stepT(t) % 2 ? 'shout' : 'shoutC') : 'talkC', { step: st });
  c.restore();
  birds(c, t, TL.roar + .1, 9, 3);
  air(c, t, .8);
} });
say(TL.charge + .15, TL.roar, 'So *BHIMA* charged up | the mountain to find them.', { y: CAPY });
say(TL.roar, TL.monkey, 'ROARING. | Smashing trees.', { y: CAPY, size: 72 });

// ---------- 4. the monkey across the path (wide) ----------
const ENTER = TL.monkey + 1.4, ROAR2 = TL.monkey + 2.0;
SHOTS.push({ a: TL.monkey, b: TL.wake + .2, xf: .2, draw(c, u, t) {
  const sh = t > ROAR2 ? 5 * Math.exp(-(t - ROAR2) * 3) : 0;
  cam(c, 560, 1080, 1 + u * .015, 540, 960, sh);
  stage(c, t);
  hanuman(c, 'sleep'); zzz(c, 760, 1040, t, 1 - seg(t, ROAR2, ROAR2 + .3));
  const st = stepT(t) % 4, k = seg(t, TL.monkey, ENTER);
  if (t < ENTER) bhima(c, lerp(-160, BH_BX, k), BH_BY, 1, bhWalkPose(st), 'talkC', { step: st });
  else bhima(c, BH_BX, BH_BY, 1, t > ROAR2 ? 'shout' : 'stand', t > ROAR2 ? (stepT(t) % 2 ? 'shout' : 'shoutC') : 'talkC');
  air(c, t);
  birds(c, t, ROAR2, 5, 11);
} });
say(TL.monkey + .1, TL.wake, 'Across his path | lay a sleepy monkey.', { y: CAPY });

// ---------- shot/reverse close-ups ----------
const hanClose = (face, o = {}) => ({ draw(c, u, t) {
  cam(c, BH_HH[0] - 30, BH_HH[1] + 20, 2.3 + u * .012, 540, 1150);
  stage(c, t, { blur: 3 });
  const f = typeof face === 'function' ? face(t, u) : face;
  hanuman(c, f, o);
  air(c, t, .6);
} });
const bhiClose = (pose, face, o = {}) => ({ draw(c, u, t) {
  const z = o.z || 2.1;
  cam(c, BH_BX + 20, BH_BY - (o.sy || 470), z + u * .012, 520, o.fy || 1120, o.shake ? o.shake(t, u) : 0);
  stage(c, t, { blur: 3 });
  if (o.han !== false) hanuman(c, 'lazy');
  const f = typeof face === 'function' ? face(t, u) : face, p = typeof pose === 'function' ? pose(t, u) : pose;
  bhima(c, BH_BX, BH_BY, 1, p, f);
  air(c, t, .6);
} });
const T2 = (a, b, open, shut) => (t) => talking(t, a, b) ? open : shut;
SHOTS.push({ a: TL.wake, b: TL.getup + .1, ...hanClose((t) => t < TL.wake + .6 ? 'sleep' : talking(t, TL.wake + .8, TL.getup - .3) ? 'lazyT' : 'lazy') });
say(TL.wake + .25, TL.getup, '"I was sleeping so sweetly. | Why wake me?"', { y: CAPY });
SHOTS.push({ a: TL.getup, b: TL.jump + .1, ...bhiClose('shout', T2(TL.getup + .1, TL.jump - .4, 'shout', 'shoutC'), { shake: (t) => 7 * Math.exp(-(t - TL.getup) * 4) }) });
say(TL.getup + .1, TL.jump, '"GET UP! | Let me pass!"', { y: CAPY, size: 70 });
SHOTS.push({ a: TL.jump, b: TL.god + .1, ...hanClose(T2(TL.jump + .2, TL.god - .4, 'lazyT', 'lazy')) });
say(TL.jump + .1, TL.god, '"I\'m too sick to get up. | Just jump over me."', { y: CAPY });
SHOTS.push({ a: TL.god, b: TL.leap + .1, ...bhiClose('heart', T2(TL.god + .2, TL.leap - .4, 'heartT', 'heart')) });
say(TL.god + .1, TL.leap, '"God lives in every creature. | I won\'t step over you."', { y: CAPY });
SHOTS.push({ a: TL.leap, b: TL.who + .1, ...bhiClose('shout', T2(TL.leap + .2, TL.who - .4, 'eagerT', 'eager')) });
say(TL.leap + .1, TL.who, '"Or I\'d LEAP over you, | like *HANUMAN* | leapt the ocean!"', { y: CAPY });
SHOTS.push({ a: TL.who, b: TL.bro + .1, ...hanClose((t) => t < TL.who + .5 ? 'smirk' : talking(t, TL.who + .5, TL.bro - .5) ? 'smirkT' : 'smirk') });
say(TL.who + .4, TL.bro, '"…Who\'s this | *Hanuman*?"', { y: CAPY, size: 66 });
SHOTS.push({ a: TL.bro, b: TL.tail + .1, ...bhiClose('flex', T2(TL.bro + .2, TL.tail - .4, 'proudT', 'proud'), { z: 1.6, sy: 420, fy: 1150 }) });
say(TL.bro + .1, TL.tail, '"My BROTHER! | I\'m just as strong as him!"', { y: CAPY });
SHOTS.push({ a: TL.tail, b: TL.one + .1, ...hanClose(T2(TL.tail + .2, TL.one - .5, 'lazyT', 'lazy')) });
say(TL.tail + .1, TL.one, '"I\'m too old to get up. | Just move my tail aside."', { y: CAPY });

// ---------- the pull ----------
SHOTS.push({ a: TL.one, b: TL.budge + .1, draw(c, u, t) {
  const two = t > TL.both, sh = two ? 3 + 2 * Math.sin(t * 40) : 0;
  cam(c, 470, 1300, 1.28, 540, 1120, two ? 2 : 0);
  stage(c, t, { tailK: 0 });
  hanuman(c, 'sleep'); zzz(c, 760, 1040, t, .8);
  if (!two) bhima(c, BH_BX, BH_BY, 1, 'grip1', 'smug');
  else bhima(c, BH_BX + 10, BH_BY, 1, 'grip2', stepT(t) % 2 ? 'strain' : 'strain2', { dx: hash(stepT(t)) * sh - sh / 2 });
  air(c, t, .7);
} });
say(TL.one + .1, TL.budge, 'ONE hand… | then BOTH hands.', { y: 500, at: [TL.one + .15, TL.one + .5, TL.both, TL.both + .3, TL.both + .6] });
SHOTS.push({ a: TL.budge, b: TL.bow + .1, draw(c, u, t) {
  cam(c, 470, 1180, 1.65 + u * .03, 540, 1150, 3);
  stage(c, t, { tailK: 0, blur: 1 });
  const yawn = t > TL.budge + .5 && t < TL.budge + 1.7;
  hanuman(c, yawn ? 'yawn' : 'sleep');
  const sh = 4 + 3 * Math.sin(t * 40);
  bhima(c, BH_BX + 10, BH_BY, 1, 'grip2', stepT(t) % 2 ? 'strain' : 'strain2', { dx: hash(stepT(t)) * sh - sh / 2 });
  sweat(c, BH_BX + 40, BH_BY - 600, t);
  air(c, t, .6);
} });
say(TL.budge + .1, TL.bow, 'It didn\'t move. | Not one inch.', { y: 500, size: 66 });

// ---------- the bow, the reveal ----------
SHOTS.push({ a: TL.bow, b: TL.iam + .1, draw(c, u, t) {
  cam(c, 480, 1160, 1.45, 540, 1150);
  stage(c, t);
  hanuman(c, t > TL.bow + 1.2 ? 'smile' : 'lazy');
  bhima(c, BH_BX, BH_BY, 1, 'bow', talking(t, TL.bow + .3, TL.iam - .5) ? 'bashT' : 'bash');
  air(c, t, .7);
} });
say(TL.bow + .1, TL.iam, '"Forgive me. | Who ARE you?"', { y: 500 });
// Hanuman stands on the rock, in a glow
const HSX = 830, HSY = 1300, HSS = .88;
function hanStand(c, t, face, s = HSS) { person(c, 'hb', HSX, HSY, s, 'stand', face, { shadow: false }); }
SHOTS.push({ a: TL.iam, b: TL.elder + .1, draw(c, u, t) {
  cam(c, 760, 1020, 1.5 + u * .03, 540, 1180);
  stage(c, t, { tail: false });
  const g = ease(seg(t, TL.iam, TL.iam + .8));
  glow(c, HSX, HSY - 330, 700, '#FFE9A8', .55 * g);
  rays(c, HSX, HSY - 360, { n: 16, dir: -Math.PI / 2, spread: TAU, len: 900, w: 140, col: '#FFF0B8', a: .25 * g, t, seed: 9 });
  hanStand(c, t, talking(t, TL.iam + .5, TL.elder - .6) ? 'smileT' : 'smile');
  for (let i = 0; i < 14; i++) { const ph = frac(t * .7 + hash(i)); twinkle(c, HSX - 220 + hash(i + 2) * 440, HSY - 620 + hash(i + 4) * 600, 10 + hash(i) * 10, Math.pow(Math.sin(ph * Math.PI), 6) * g); }
  air(c, t, .7);
} });
say(TL.iam + .45, TL.elder, '"I am | *HANUMAN*."', { y: 540, size: 80 });
SHOTS.push({ a: TL.elder, b: TL.vayu + .1, ...bhiClose('stand', T2(TL.elder + .2, TL.vayu - .4, 'joyT', 'joy'), { z: 2.0, han: false }) });
// (bhiClose draws the lying Hanuman behind: here he is standing, out of this frame)
say(TL.elder + .1, TL.vayu, '"My elder | BROTHER!"', { y: CAPY, size: 76 });
SHOTS.push({ a: TL.vayu, b: TL.show + .1, draw(c, u, t) {
  cam(c, 560, 1100, 1.15, 540, 1060);
  stage(c, t, { tail: false });
  hanStand(c, t, 'smile');
  bhima(c, BH_BX, BH_BY, 1, 'stand', 'happy');
  // the wind: leaves and petals spiral up between them
  for (let i = 0; i < 26; i++) { const ph = frac(t * .35 + hash(i)), a = ph * TAU * 2 + hash(i + 1) * TAU, r = 60 + ph * 260; const x = 560 + Math.cos(a) * r, y = 1400 - ph * 700 + Math.sin(a) * r * .3; ellipse(c, x, y, 10, 5, rgba(['#B8D466', '#FFE08A', '#E8F0B0'][i % 3], Math.sin(ph * Math.PI) * .9), a); }
  for (let i = 0; i < 6; i++) { const ph = frac(t * .5 + i / 6); c.save(); c.globalAlpha = Math.sin(ph * Math.PI) * .35; c.strokeStyle = '#FFFFFF'; c.lineWidth = 4; c.beginPath(); c.ellipse(560, 1300 - ph * 500, 120 + ph * 180, 30 + ph * 40, 0, ph * 6, ph * 6 + 2.2); c.stroke(); c.restore(); }
  air(c, t);
} });
say(TL.vayu + .1, TL.show, 'Both were sons of | *VAYU*, the wind god.', { y: CAPY });
SHOTS.push({ a: TL.show, b: TL.giant + .1, draw(c, u, t) {
  cam(c, BH_BX + 20, BH_BY - 470, 2.1 + u * .012, 520, 1120);
  stage(c, t, { blur: 3, tail: false });
  bhima(c, BH_BX, BH_BY, 1, 'shout', talking(t, TL.show + .2, TL.giant - .4) ? 'eagerT' : 'eager');
  air(c, t, .6);
} });
say(TL.show + .1, TL.giant, '"Show me the form | that leapt the ocean!"', { y: CAPY });

// ---------- the giant ----------
SHOTS.push({ a: TL.giant, b: TL.hug + .1, xf: .2, draw(c, u, t) {
  const k = easeIO(seg(t, TL.giant + .4, TL.grow2 + .8)), sh = 9 * Math.sin(Math.PI * k) * (k < 1 ? 1 : 0);
  c.save(); cam(c, 540, 960, 1.04 - .04 * k, 540, 960, sh);
  ptDraw(c, ptLayer('gsky', [0, 0, W, H], bhGiantSky, { seed: 13 }));
  glow(c, 540, 1500 - 900 * k, 900, '#FFE3A0', .5 * k);
  rays(c, 540, 1600 - 1000 * k, { n: 18, dir: -Math.PI / 2, spread: TAU, len: 1500, w: 220, col: '#FFF0C0', a: .22 * k, t, seed: 21 });
  const s = lerp(.55, 2.35, k);
  person(c, 'hb', 560, 2000, s, 'stand', 'front', { k: 2.6, hk: 3, shadow: false });
  // clouds drift past his waist
  for (let i = 0; i < 4; i++) cloud(c, ((i * 330 + t * 40) % 1500) - 200, 1250 - i * 90 - 300 * k, 520, i + 3, ['#E8DCD8', '#FAF4EE', '#FFFFFF'], .55 * k);
  c.restore();
  // tiny Bhima at the bottom, eyes shut against the light
  bhima(c, 170, 1880, .32, 'stand', t > TL.grow2 ? 'shut' : 'awe', { shadow: false });
} });
say(TL.giant + .4, TL.grow2, 'He grew… | and GREW…', { y: 1400, size: 70 });
say(TL.grow2, TL.hug, '…as tall as the | *VINDHYA* mountains!', { y: 1400, size: 66 });

// ---------- the hug, the promise ----------
function hugShot(c, t, u, z, faces) {
  cam(c, 520, 1150, z + u * .015, 540, 1130);
  stage(c, t, { tail: false, blur: 1.5 });
  glow(c, 520, 1000, 600, '#FFE9B0', .35);
  // side by side, leaning in, heads together
  person(c, 'bb', 420, 1490, 1, 'side', faces[0], { tilt: .16 });
  person(c, 'hb', 610, 1490, 1.02, 'side', faces[1], { tilt: -.2 });
  for (let i = 0; i < 12; i++) { const ph = frac(t * .6 + hash(i)); twinkle(c, 300 + hash(i + 2) * 460, 820 + hash(i + 4) * 500, 9 + hash(i) * 9, Math.pow(Math.sin(ph * Math.PI), 6)); }
  air(c, t, .8);
}
SHOTS.push({ a: TL.hug, b: TL.flag + .1, xf: .25, draw(c, u, t) {
  hugShot(c, t, u, 1.5, ['happy', 'tear']);
  glow(c, 520, 1100, 900, '#FFF4D0', .8 * (1 - seg(t, TL.hug, TL.hug + .5)), 'screen');   // the flash as he shrinks back
} });
say(TL.hug + .1, TL.flag, 'Then he shrank back… | and HUGGED | his little brother.', { y: CAPY });
SHOTS.push({ a: TL.flag, b: TL.ask + .1, xf: .3, draw(c, u, t) {
  c.save(); cam(c, 540, 1000, 1.06 - u * .01);
  ptDraw(c, ptLayer('kuru', [0, 0, W, H], bhKuru, { seed: 15 }));
  ptDraw(c, ptLayer('ban' + stepT(t * 1.4) % 6, BH_BANNER_BOX, bhBanner((stepT(t * 1.4) % 6) / 6), { alpha: true, seed: 17, brushes: PT_BRUSHES.slice(2), k: 1.3 }));
  c.restore();
  motes(c, { n: 80, seed: 12, box: [0, 900, 1080, 1900], r: 4, col: '#FFD8A0', a: .55, vx: 40, vy: -6, t });
  glow(c, 760, 1180, 420, '#FFE0A0', .3 + .05 * Math.sin(t * 3));
} });
say(TL.flag + .2, TL.ask, '"In your war, I\'ll roar | from *ARJUNA*\'s flag!"', { y: 1430 });
SHOTS.push({ a: TL.ask, b: TL.card + .1, xf: .3, draw(c, u, t) { hugShot(c, t, u, 1.3, ['happy', 'smile']); } });
say(TL.ask + .1, TL.card, 'Did you know they were | BROTHERS? | Comment *JAI HANUMAN*', { y: CAPY });

// ---------- the card ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .25, draw(c, u, t) {
  rkCardCine(c, u, t, { title: 'MEET OUR GODS', line: 'Picture books of our gods, for kids', price: 'Books 1–3 · set of 3 for ₹500' });
} });
// a soft dark scrim under each caption, so white lettering reads over the bright grove
POST.push((c, t) => {
  for (const k of CAPTIONS) {
    if (t < k.a || t > k.b) continue;
    const vis = Math.min(seg(t, k.a, k.a + .25), 1 - seg(t, k.b - .25, k.b)), n = k.words.filter(w => w.br).length + 1, y = clamp(k.y, 470, 1450);
    c.save(); c.translate(540, y); c.scale(1, (n * k.size * 1.3 + 120) / 900);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 520); g.addColorStop(0, `rgba(20,22,10,${.3 * vis})`); g.addColorStop(.6, `rgba(20,22,10,${.16 * vis})`); g.addColorStop(1, 'rgba(20,22,10,0)');
    c.fillStyle = g; c.fillRect(-540, -520, 1080, 1040); c.restore();
  }
});
LOOK.bloom = .2; LOOK.vignette = .42; LOOK.grain = .045;
