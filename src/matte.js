// matte.js: the Matte style's additions to cine.js (load it after cine.js). Matte reels are painted by an image model
// (tools/imagegen.mjs: characters on chroma green, backgrounds as plates) and keyed into PICS (tools/cutout.mjs); this
// file turns those pictures into puppets and sets: a character is cut into parts along polygons (legs, a tail), each
// part swings about a pivot, and the body keeps everything that isn't cut away. The lighting, haze, grain and captions
// are cine.js's.
//
//   cutRig(def) → rig     def = { pic: 'kushmanda', anchor: [x, y] (the ground point under it, source px),
//                           parts: [{ name, poly: [[x, y], ...], cut (y: the part is taken off the body below this line;
//                           omit to take the whole polygon), pivot: [x, y], z: -1 behind the body | 1 in front }] }
//                         All in the source picture's pixels. Parts are cut once and cached.
//   drawRig(c, rig, x, y, s, pose)  the anchor at (x, y), s = scale; pose = { body: { r, dx, dy }, <part>: { r, dx, dy } }
//                         (r radians about the part's pivot, dx/dy in source px). pose.debug tints the parts.
//   quadWalk(ph, o)       a four-legged walk as a pose: o.legs = { name: the leg's phase at ph = 0 } (pick the phases that
//                         match the painting, so ph = 0 is the picture as painted), o.A (half the swing, rad), o.lift (px),
//                         o.bob (px), o.tail (part name).
//   platePan(c, img, camX, depth, o)  a wide plate scrolled with the camera: o.h (drawn height), o.y (top), o.x0.

const RIGS = new Map();
function cutRig(def) {
  const key = def.pic + ':' + def.parts.map(p => p.name).join(',');
  if (RIGS.has(key)) return RIGS.get(key);
  const img = PICS[def.pic], iw = img.naturalWidth, ih = img.naturalHeight;
  const body = document.createElement('canvas'); body.width = iw; body.height = ih;
  const b = body.getContext('2d'); b.drawImage(img, 0, 0);
  const path = P => { const p = new Path2D(); P.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p; };
  const parts = def.parts.map(d => {
    const xs = d.poly.map(p => p[0]), ys = d.poly.map(p => p[1]);
    const x0 = Math.floor(Math.min(...xs)), y0 = Math.floor(Math.min(...ys)), w = Math.ceil(Math.max(...xs)) - x0, h = Math.ceil(Math.max(...ys)) - y0;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
    g.translate(-x0, -y0); g.clip(path(d.poly)); g.drawImage(img, 0, 0);
    // take it off the body: the polygon below the cut line (soft-edged by a few px so the seam doesn't show)
    b.save(); b.clip(path(d.poly));
    if (d.cut == null) b.clearRect(0, 0, iw, ih);
    else { const gr = b.createLinearGradient(0, d.cut - 6, 0, d.cut + 6); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)'); b.globalCompositeOperation = 'destination-out'; b.fillStyle = gr; b.fillRect(0, d.cut - 6, iw, ih); }
    b.restore();
    return { ...d, cv, x0, y0, z: d.z ?? -1 };
  });
  const rig = { def, body, parts, anchor: def.anchor };
  RIGS.set(key, rig); return rig;
}
function drawRig(c, rig, x, y, s, pose = {}) {
  const bp = pose.body || {};
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(-rig.anchor[0] + (bp.dx || 0), -rig.anchor[1] + (bp.dy || 0));
  if (bp.r) { const [px, py] = rig.anchor; c.translate(px, py - 400); c.rotate(bp.r); c.translate(-px, -(py - 400)); }
  const part = p => {
    const q = pose[p.name] || {}; c.save();
    c.translate(p.pivot[0] + (q.dx || 0), p.pivot[1] + (q.dy || 0)); c.rotate(q.r || 0); c.translate(-p.pivot[0], -p.pivot[1]);
    c.drawImage(p.cv, p.x0, p.y0);
    if (pose.debug) { c.globalCompositeOperation = 'source-atop'; c.fillStyle = `hsla(${hash(p.name.length * 7 + p.name.charCodeAt(0)) * 360},90%,50%,.45)`; c.fillRect(p.x0, p.y0, p.cv.width, p.cv.height); }
    c.restore();
    if (pose.debug) { c.fillStyle = '#f0f'; c.beginPath(); c.arc(p.pivot[0], p.pivot[1], 10, 0, TAU); c.fill(); }
  };
  rig.parts.filter(p => p.z < 0).forEach(part);
  c.drawImage(rig.body, 0, 0);
  rig.parts.filter(p => p.z >= 0).forEach(part);
  c.restore();
}
// A walk. Each leg's phase runs 0..1: stance from 0 (planted forward) to .6 (pushed back), the foot gliding back
// evenly; then swing .6..1, the foot lifting and reaching forward again. Angles are + forward (toward screen right).
function quadWalk(ph, o = {}) {
  const A = o.A ?? .2, lift = o.lift ?? 40, pose = {};
  const ang = p => { p = frac(p); return p < .6 ? lerp(A, -A, p / .6) : lerp(-A, A, easeIO((p - .6) / .4)); };
  for (const [name, p0] of Object.entries(o.legs || {})) {
    const p = frac(ph + p0), up = p < .6 ? 0 : Math.sin((p - .6) / .4 * Math.PI);
    pose[name] = { r: -(ang(ph + p0) - ang(p0)), dy: -lift * up };   // canvas rotation + is clockwise: the foot goes back
  }
  pose.body = { dy: -(o.bob ?? 8) * Math.abs(Math.sin(ph * TAU)), r: (o.sway ?? .004) * Math.sin(ph * TAU) };
  if (o.tail) pose[o.tail] = { r: (o.tailA ?? .07) * Math.sin(ph * TAU + 1) };
  return pose;
}
// A plate wider than the frame, scrolled with the camera at a depth (1 moves with the stage, .4 lags behind like far
// scenery, >1 runs ahead like foreground). It repeats, mirrored, if the camera runs off its end; o.gap leaves that
// many px empty between repeats (sparse foreground trunks).
function platePan(c, img, camX, depth, o = {}) {
  if (!img || !img.naturalWidth) return;
  const h = o.h ?? H, w = img.naturalWidth * h / img.naturalHeight, y = o.y ?? 0, P = w + (o.gap || 0);
  let x = (o.x0 ?? 0) - camX * depth, i = Math.floor(-x / P);
  for (let k = i; k * P + x < W; k++) {
    const px = x + k * P; if (px + w < 0) continue; c.save();
    if (k % 2) { c.translate(px + w, y); c.scale(-1, 1); c.drawImage(img, 0, 0, w, h); } else c.drawImage(img, px, y, w, h);
    c.restore();
  }
}
