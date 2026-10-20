// yama.js: Yama (Yamraj, Dharmaraja), the god of death, drawn on Shani's rig (shani.js: they are brothers, both sons of
// Surya), as the Mahabharata's Savitri story paints him (Vana Parva 281): dark (shyama) yet shining, red-eyed, in red
// garments, crowned, a noose (pasha) in his hand. A deep slate-teal skin, a crimson dhoti and sash, a gold kirita with a
// ruby, a big curling moustache, a vermilion tilak; the noose coiled in his left hand and a gold mace (gada) in his
// right. His buffalo (yamaBuffalo) is Mahishasura's rig in charcoal with a calm eye and a bell. Load after shani.js,
// mahishasura.js and chandraghanta.js (gada()).
// yama(x, y, u, o): every shani() option works (walk, bow, pray, lean, hx, handL / handR, eyes, mouth, glow (his red
// gaze), brow, sweat, emote, …). His own:
//   pasha (default true: the coiled noose in his left hand; 0..1 shrinks the coil as it pays out), gada (default true:
//   the mace in his right hand) + gadaA (radians), pal (overrides YAMA_PAL), ownTint (keep feel()'s mood tint: off by
//   default, it muddies his skin)
// yamaNoose(pts, k, key): the rope in flight, along a world path; k 0..1 grows it out from the first point; a loop at
//   the end. yamaBuffalo(x, y, u, o): mahishBuffalo() with his palette, eyes 'calm' by default, and a bell at the neck.
// Helpers: shani's (shaniHand, shaniHead, shaniEye: same body).
const YAMA_PAL = {
  skin: '#3F6460', skinDk: '#2A4643', skinLt: '#6E9690', ink: '#1E1A22',
  dhoti: '#B2302C', dhotiDk: '#82201E', dhotiLt: '#D8605A', sash: '#7A1E3A', sashDk: '#561428',
  gem: '#D8283A', gemLt: '#FF9AA4', hair: '#17141C', hairLt: '#3A3442', iris: '#6E1212', glow: '#FF4A2E', lip: '#3A1E24', ash: '#E8462E',
};
const YAMA_SKIN = { col: YAMA_PAL.skin, dk: YAMA_PAL.skinDk, lt: YAMA_PAL.skinLt };
const YAMA_ROPE = { rope: '#C9A04A', ropeDk: '#8A6A2A' };
const YAMA_BUF = { bf: '#34323E', bfDk: '#222029', bfLt: '#504D5E', bfMuzzle: '#46404E', bfEye: '#3A2418', hoof: '#1E1C24', horn: '#E6DCC4', hornDk: '#9C8E76' };

// the coiled noose, in an upright hand space (shani's armL hook): three loops hanging below the fist and a free end
function yamaPasha(u, sw, k = 1, INK = YAMA_PAL.ink) {
  const n = k > .66 ? 3 : k > .33 ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const r = (.95 + i * .18) * u, cy = (1.5 + i * .25) * u, dx = (i - 1) * .18 * u;
    const ring = ellPts(dx, cy, r * .82, r * 1.15, 18, u * .03, .15 * (i - 1));
    inkLine([...ring, ring[0], ring[1]], sw * 2.6, YAMA_ROPE.ropeDk, 'ink', .5);
    inkLine([...ring, ring[0], ring[1]], sw * 1.5, YAMA_ROPE.rope, 'ink', .5);
  }
  inkLine(U([[.2, .4], [.7, 2.8], [.45, 3.9]], u), sw * 2.2, YAMA_ROPE.ropeDk, 'ink', .6);
  inkLine(U([[.2, .4], [.7, 2.8], [.45, 3.9]], u), sw * 1.2, YAMA_ROPE.rope, 'ink', .6);
}

// the rope in flight: along pts (world), grown to k, with an open loop at its end
function yamaNoose(pts, k = 1, key = 'noose', w = 1.5, loop = 1) {
  if (k <= 0 || pts.length < 2) return;
  boilSeed(key);
  const P = through(pts), n = Math.max(2, Math.round(P.length * clamp(k)));
  const path = P.slice(0, n);
  inkLine(path, w * 1.7, YAMA_ROPE.ropeDk, 'ink', .4);
  inkLine(path, w, YAMA_ROPE.rope, 'ink', .4);
  if (loop > 0 && k > .9) {
    const [ex, ey] = path[path.length - 1], r = w * 18 * loop;
    const ring = ellPts(ex, ey + r * .6, r * .8, r, 16, 1);
    inkLine([...ring, ring[0], ring[1]], w * 1.7, YAMA_ROPE.ropeDk, 'ink', .5);
    inkLine([...ring, ring[0], ring[1]], w, YAMA_ROPE.rope, 'ink', .5);
  }
}

function yama(x, y, u, o = {}) {
  const C = { ...YAMA_PAL, ...(o.pal || {}) };
  const q = { stache: 'curl', ...o, pal: C, col: C.skin, dk: C.skinDk, lt: C.skinLt };   // his own skin always (emotions() hands over Clawd's)
  if (!o.ownTint) { delete q.tint; delete q.tintK; }   // mood tints muddy his dark skin; ownTint: true keeps them
  const pk = o.pasha ?? true, gd = o.gada ?? true;
  if (pk) q.armL = (uu, sw) => { yamaPasha(uu, sw, pk === true ? 1 : pk, C.ink); if (o.armL) o.armL(uu, sw); };
  if (gd) q.armR = (uu, sw) => { gada(uu * .95, sw, o.gadaA ?? .25, C.ink); if (o.armR) o.armR(uu, sw); };
  delete q.pasha; delete q.gada; delete q.gadaA;
  return shani(x, y, u, q);
}

function yamaBuffalo(x, y, u, o = {}) {
  mahishBuffalo(x, y, u, { eyes: 'calm', ...o, pal: { ...YAMA_BUF, ...(o.pal || {}) } });
  if (o.bell === false) return;
  // a bronze bell on a red cord at his neck
  boilSeed(`ybell ${o.boilKey ?? ''}`);
  const [nx, ny] = buffaloWorld(x, y, u, o, ...buffaloLocal(o, 4.9, -5.2)), sw = clamp(u / 20, .4, 2), sx = o.flip ? -1 : 1;
  const sway = Math.sin(T * 3 + (o.seed || 0)) * .12;
  inkLine([[nx - sx * u * 1.2, ny - u * 1.6], [nx, ny - u * .2], [nx + sx * u * .9, ny - u * 1.4]], sw * 2, '#A8323A', 'ink', .5);
  push(); translate(nx, ny); rotate(sway);
  paint(U([[-.55, 0], [.55, 0], [.75, 1.3], [-.75, 1.3]], u), { wash: '#C9922E', fill: '#8A5E1A', fillOp: 60, tex: .4, ink: YAMA_PAL.ink, sw: sw * .6, curv: .4 });
  paint(ellPts(0, 1.45 * u, .2 * u, .2 * u, 8), { wash: '#6A4410', ink: null });
  pop();
}

// Model sheet: studio.html?loop=yama, or node render.mjs --loop=yama --sheet=0.5,2.5 --cols=2 --w=540
(() => {
  LOOPS.yama = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    yama(230, 760, 19, { seed: 1, mouth: 'flat', brow: -.6 });
    yama(540, 760, 19, { ...feel('angry', t), ...YAMA_SKIN, seed: 2, glow: .8, mouth: 'open', brow: -1, handL: [-5.6, -21] });
    yama(850, 760, 19, { seed: 3, eyes: 'wide', mouth: 'O', brow: 1, sweat: 1, pasha: .3, gadaA: -.4 });
    yama(230, 1300, 19, { seed: 4, eyes: 'closed', mouth: 'smile', handR: [4.6, -19], bendR: 1.2, gada: false });
    yama(540, 1300, 19, { seed: 5, walk: t * 1.2, hx: -.5, lookX: -.7, mouth: 'flat' });
    yama(850, 1300, 19, { seed: 6, eyes: ['normal', 'wide'], mouth: 'sheepish', brow: .6 });
    yamaBuffalo(340, 1820, 26, { boilKey: 'yb1', run: t * .5, stride: .35 });
    yamaBuffalo(800, 1820, 20, { boilKey: 'yb2', flip: true, mouth: 'open' });
    yamaNoose([[620, 1500], [800, 1420], [960, 1520]], frac(t / 2) * 1.2, 'yn');
  };
  LOOPS.yama.len = 4;
})();
