// along.js: "Do your aarti WITH this reel" (ad 73), the Diwali aarti-along, in the 3D style, #4 of the five-reel push. One
// seamless 31 s loop with no voice and no song, so any family's aarti fits under it: a bronze Maa Lakshmi in a lamp-lit
// sanctum dressed for Diwali, the camera as the devotee, the aarti lamp circling the temple way (four at her feet, two
// at the navel, three at the face, seven round the whole body: ad 54's count), a gold ring left by each circle, the
// count by the lamp, a tracker (4 · 2 · 3 · 7) that lights a dot per circle, a bell per circle (along_sfx.mjs). At the
// end the lamp drops back to her feet and the hook comes back up, so Instagram's replay is the next round of the aarti.
// Frame 0 = frame LOOP. STORYBOARD.md has the plan and the sources; the set, murti, lamp and 2D pieces are along_props.js.
LOOK.bloom = .12;   // matte (owner, 30 Oct): cine.js's own bloom kept low, no fx bloom
const S = sanctum3(), SC = S.scene, LAK = lakshmi3(SC), LAMP = aartiLamp3(SC), RINGS = rings3(SC);
const COINS = coins3(SC, LAK.PALM, [.3, PED + .03, .24], { n: 8, rate: 5, fall: .8 });
const ORDER = ['feet', 'navel', 'face', 'whole'];

// ---------- the timeline: one round of the aarti ----------
// each part: [start, seconds a circle]; the moves between parts fill the gaps; LOOP is a whole number of frames (24 fps)
const D_S = 1.4, D_W = 2.0, LOOP = 31;
const TL = { feet: [0, D_S], navel: [6.5, D_S], face: [10.2, D_S], whole: [15.4, D_W] };
const partEnd = id => TL[id][0] + PARTS[id].n * TL[id][1];   // feet 5.6, navel 9.3, face 14.4, whole 29.4
const BACK = partEnd('whole');                                // from here the lamp drops back to her feet

// the lamp's path: circling during a part, an eased glide between (bowing out toward the devotee)
const circling = id => { const [t0, d] = TL[id], n = PARTS[id].n; return [t0, partEnd(id), t => { const k = clamp((t - t0) / d, 0, n - 1e-4); return circleAt(id, Math.floor(k), k % 1); }]; };
const SEGS = ORDER.map(circling);
function lampAt(t) {
  t = ((t % LOOP) + LOOP) % LOOP;
  for (let i = 0; i < SEGS.length; i++) {
    const [a, b, f] = SEGS[i];
    if (t >= a && t <= b) return f(t);
    const nx = SEGS[i + 1] || [LOOP, 0, () => circleAt('feet', 0, 0)];
    if (t > b && t < nx[0]) { const k = easeIO(seg(t, b, nx[0])), p = f(b), q = nx[2](nx[0]); return p.map((v, j) => lerp(v, q[j], k) + (j === 0 ? Math.sin(k * Math.PI) * .15 : 0)); }
  }
  return SEGS[0][2](0);
}
// which part is on (index into ORDER; during a move, the next one from halfway), and how many of its circles have begun
function partNow(t) {
  for (let i = 0; i < 4; i++) {
    const id = ORDER[i], [t0, d] = TL[id], end = partEnd(id), next = i < 3 ? TL[ORDER[i + 1]][0] : LOOP;
    if (t >= t0 && t < end) return { i, id, done: Math.floor((t - t0) / d) + 1, k: Math.floor((t - t0) / d), age: (t - t0) % d };
    if (t >= end && t < next) return (t - end) < (next - end) / 2 ? { i, id, done: PARTS[id].n, k: -1, age: 9, moving: true } : { i: (i + 1) % 4, id: ORDER[(i + 1) % 4], done: 0, k: -1, age: 9, moving: true };
  }
  return { i: 0, id: 'feet', done: 0, k: -1, age: 9 };
}

// the rings: drawn as the lamp goes; the part on bright, the ones done dimmer; all fade as the lamp drops back
function showRings(t) {
  const fade = 1 - seg(t, BACK, BACK + 1.2), cur = partNow(t).id;
  for (const id of ORDER) RINGS[id].forEach((r, k) => {
    const [t0, d] = TL[id];
    r.set(seg(t, t0 + k * d, t0 + (k + 1) * d), (id === cur ? .95 : .42) * fade);
  });
}

// the camera: the devotee at the door, breathing a little (periodic in LOOP)
const lens = (focus, ap = 4, o = {}) => ({ dof: { focus, aperture: ap, max: 10, nearK: .6 }, grade: { contrast: 1.06, sat: o.sat ?? 1.04, temp: o.temp ?? .035, lift: 0, gamma: 1, gain: 1 } });
const dist = p => CAM3.position.distanceTo(V3(...p));
const camAt = t => { const w = TAU * t / LOOP; cam3({ pos: [6.3 + .12 * Math.cos(w), 1.66 + .04 * Math.sin(2 * w), -.25 + .2 * Math.sin(w)], at: [0, 1.65, -.22 + .03 * Math.sin(w)], fov: 40 }); };

// ---------- captions: on top, all lit (no voice); the hook is up at frame 0 and comes back before the loop ends ----------
const CAPY = 480;
const cap = (a, b, txt) => say(a, b, txt, { at: txt.split(/\s+/).filter(w => w !== '|').map(() => a), y: CAPY, size: 44 });
const HOOK = '*SAVE* this for *DIWALI* night. | Do your *AARTI* with this reel.';
cap(-1, 6.1, HOOK);
cap(6.3, 14.9, 'Follow the *GOLD* lamp. | Count each circle *OUT LOUD.*');
cap(15.1, 22.3, 'The *TEMPLE* way: | *4 · 2 · 3 · 7*');
cap(22.5, BACK + .2, 'It *LOOPS.* Keep going | till your aarti ends.');
cap(LOOP - 1.4, LOOP + 1, HOOK);
POST.unshift((c, t) => band(c, 370, 590, .5));

// the count by the lamp: the circle it's on, big, beside that part's rings
function lampCount(c, t) {
  const P = partNow(t); if (P.k < 0) return;
  const id = P.id, R = PARTS[id], kk = R.n - 1, cx = RX + kk * RSTEP;
  const ctr = toScreen3([cx, R.y, 0]), edge = toScreen3([cx, R.y, -(R.rz ?? R.r) * (1 + kk * RGROW)]), rx = Math.abs(edge[0] - ctr[0]);
  const whole = id === 'whole';
  let x = ctr[0] - rx - 105, y = ctr[1];
  // the body's count: above the rings' upper-left shoulder, clear of them
  if (whole) { const g = 1 + kk * (R.grow ?? RGROW), sh = toScreen3([cx, R.y + R.ry * g * .78, R.rz * g * .78]); x = sh[0] - 90; y = sh[1] - 60; }
  x = clamp(x, 110, 800); y = clamp(y, 640, 1380);
  const a = 1 - seg(t, partEnd(id) - .1, partEnd(id) + .35);
  text(c, String(P.done), x, y, '700 150px Cinzel', '#FFF3DC', { pop: P.age + .1, alpha: a, glow: ['rgba(255,170,60,.75)', 34] });
  text(c, whole ? 'BODY' : id.toUpperCase(), x, y + 92, '700 32px Cinzel', '#F4C46A', { alpha: a, glow: ['rgba(10,6,4,.95)', 16], spacing: 3 });
}

// ================= the loop: one shot =================
SHOTS.push({ a: 0, b: LOOP + 1, draw(c, u, t) {
  S.set(t); camAt(t);
  LAMP.place(lampAt(t), t, { power: 4.2 });
  COINS.set(t, LOOP);
  showRings(t);
  render3(c, SC, CAM3, { exposure: 1.1, fx: lens(dist([0, 1.5, 0]), 4) });
  lampCount(c, t);
  const P = partNow(t);
  tracker(c, 862, 800, P.i, P.done, { pulse: P.k >= 0 ? Math.exp(-P.age * 6) : 0 });
} });
