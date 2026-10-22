// prad_props.js: what "Why do Hindus walk around a temple CLOCKWISE?" adds to the shrine set (cine3d_temple.js): gold
// footprint trails along the pradakshina path, the stop lines either side of the somasutra, the sun's orb, the POV
// walker, compass letters pinned to the ground, the Shiva Rahasya line, and the 15K Family Deal card in Cinematic
// lettering.

// ---------- footprint trails ----------
// trail3(parent, s0, s1, n, o): n footprints along the path from s0 to s1 (s1 < s0 walks it anticlockwise), left and
// right in turn, o.off metres out from the path's line (+ = away from the shrine), o.col.
function trail3(parent, s0, s1, n, o = {}) {
  const feet = [];
  for (let i = 0; i < n; i++) {
    const s = lerp(s0, s1, i / (n - 1)), p = path3(s), dir = Math.sign(s1 - s0), hx = p.dx * dir, hz = p.dz * dir;
    const out = [p.dz, -p.dx], side = i % 2 ? 1 : -1, rx = -hz, rz = hx;   // out: away from the shrine; r: the walker's right
    const x = p.x + out[0] * (o.off || 0) + rx * side * .11, z = p.z + out[1] * (o.off || 0) + rz * side * .11;
    feet.push(foot3(parent, x, z, yawOf(hx, hz), side, { col: o.col, size: o.size }));
  }
  return feet;
}
// trailShow(feet, t, tA, tB, o): the footprints land one by one from tA to tB; o.a (brightness), o.hold (seconds each
// stays fully lit before dimming to o.rest of its brightness; default: they stay).
function trailShow(feet, t, tA, tB, o = {}) {
  const n = feet.length;
  feet.forEach((f, i) => {
    const ti = tA + (tB - tA) * i / Math.max(1, n - 1), on = seg(t, ti, ti + .12);
    const fade = o.hold != null ? lerp(1, o.rest ?? .35, seg(t, ti + o.hold, ti + o.hold + .6)) : 1;
    f.material.opacity = (o.a ?? 1) * on * fade; f.visible = on > 0;
  });
}
const trailHide = (...trails) => trails.forEach(tr => tr.forEach(f => { f.visible = false; }));

// a glowing bar across the path either side of the channel: "stop here"
function stopLine3(parent, x) {
  return mesh3(parent, new THREE.PlaneGeometry(.12, 1.5), new THREE.MeshBasicMaterial({ map: glowTex3(), color: '#FF6A3A', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
    [x, .02, -SHR.pathA], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false, scale: [3, 1, 1] });
}

// ---------- the walker ----------
// pov(s, o): the camera as a devotee on the path at s (o.off metres further out), eyes 1.6 m up, looking along the way they walk (dir 1 clockwise,
// -1 back), o.turn radians toward the shrine (their right), o.pitch (down, radians), o.fov, o.bob (0..1); o.at [x, y, z]: look
// at that point instead (a corner of the shrine kept in view while walking past it).
function pov(s, o = {}) {
  const q = path3(s), off = o.off || 0, p = { ...q, x: q.x + q.dz * off, z: q.z - q.dx * off }, dir = o.dir ?? 1, hx = p.dx * dir, hz = p.dz * dir, rx = -hz, rz = hx, tn = o.turn ?? 0;
  const lx = hx * Math.cos(tn) + rx * Math.sin(tn), lz = hz * Math.cos(tn) + rz * Math.sin(tn);
  const steps = s * PATH3.len / .66, y = 1.6 + .03 * (o.bob ?? 1) * Math.abs(Math.sin(steps * Math.PI)) - .015;
  return cam3({ pos: [p.x, y, p.z], at: o.at || [p.x + lx * 4, y - Math.tan(o.pitch ?? .08) * 4, p.z + lz * 4], fov: o.fov ?? 66, roll: (o.bob ?? 1) * .004 * Math.sin(steps * Math.PI) });
}

// ---------- 2D on the 3D frame ----------
// a letter pinned to a ground point (compass marks): pops at `at`, o.size, o.col, o.alpha
function pin(c, txt, p, t, at, o = {}) {
  const [x, y, z] = toScreen3(p); if (z > 1 || t < at) return;
  text(c, txt, x, y, `700 ${o.size || 64}px Cinzel`, o.col || '#F4C46A', { pop: t - at, alpha: o.alpha ?? 1, glow: ['rgba(10,6,4,.9)', 18], spacing: 2 });
}

// ---------- the card ----------
// The 15K Family Deal (Books 1–3, ₹350 instead of ₹500, till 25 Oct 2026 midnight; CTA "Comment FAMILY"), laid out
// like the Painted card of ad 30 but lettered and lit like rkCardCine. u = seconds since the card's shot began.
function dealCardCine(c, u, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 470, 950, 760, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 300, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
  const X = 470, pk = d => u - d, br = Math.sin(t * 1.3) * .008;
  picture(c, PICS.logo, X, 500, 120, 120, { pop: pk(.05), r: 60 });
  text(c, '15K FAMILY DEAL', X, 618, '700 66px Cinzel', '#F4C46A', { pop: pk(.1), glow: ['rgba(244,196,106,.55)', 26], spacing: 3, maxW: 860 });
  text(c, 'our thank-you to all of YOU', X, 688, '42px Marcellus', '#FBE0CF', { pop: pk(.25), maxW: 840 });
  [['book1', -1], ['book3', 1], ['book2', 0]].forEach(([b, i], j) => picture(c, PICS[b], X + i * 205, 905 + Math.abs(i) * 28, 250, 250, { rot: i * .1 + br, pop: pk(.4 + j * .12), r: 10, shadow: 26, glow: ['rgba(255,196,120,.28)', 40] }));
  text(c, 'Books 1–3 · Set of 3', X, 1112, '700 40px Poppins', '#FFFFFF', { pop: pk(1.2), maxW: 880 });
  text(c, '₹500', X - 120, 1186, '500 56px Poppins', '#9FB8B3', { pop: pk(1.2) });
  const ks = easeOut(seg(u, 1.7, 1.95));
  if (ks > 0) { c.save(); c.strokeStyle = '#F15A24'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(X - 185, 1196); c.lineTo(lerp(X - 185, X - 55, ks), lerp(1196, 1172, ks)); c.stroke(); c.restore(); }
  text(c, '₹350', X + 95, 1182, `700 ${88 * (1 + .04 * Math.max(0, Math.sin(t * 5)))}px Poppins`, '#F15A24', { pop: pk(1.7), glow: ['rgba(241,90,36,.45)', 24] });
  text(c, 'Only till 25 Oct, midnight', X, 1262, '700 40px Poppins', '#FF9A6A', { pop: pk(2.2), maxW: 860 });
  const k = popK(pk(2.7)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(X, 1350); c.scale(k, k); c.fillStyle = '#F15A24'; c.shadowColor = 'rgba(241,90,36,.6)'; c.shadowBlur = 30; c.beginPath(); c.roundRect(-270, -48, 540, 96, 48); c.fill(); c.restore(); }
  text(c, 'Comment FAMILY', X, 1353, '700 52px Poppins', '#FFFFFF', { pop: pk(2.7) });
  text(c, "we'll DM you the deal · or tap the link in bio", X, 1428, '500 31px Poppins', '#CFE3DF', { pop: pk(3.2), maxW: 860 });
  text(c, 'Follow @therishikatha', X, 1478, '700 31px Poppins', '#F4C46A', { pop: pk(3.7), maxW: 860 });
}
