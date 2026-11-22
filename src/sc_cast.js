// sc_cast.js: the Scribble style's cast and sets. Load after scribble.js.
//
// The set is a photograph that isn't one: a Himalayan valley thrown far out of focus (scHimalaya: sky, snow ridges,
// forested slopes, a green spur, blown-out bokeh) and, sharp in front, a granite boulder (scRock: per-pixel mottling,
// mica and feldspar speckle, lichen, cracks, a lit top face). Both are baked once as sprites.
//
// The cast: Bal Hanuman sitting in meditation, front view, eyes closed, hands in dhyana mudra in his lap, tail curling up
// behind him on his left (screen right). Golden fur ("kanchan baran"), a peach face, a curly tuft, gold rings in his
// ears, the munja thread, a red langot with a gold band, a sindoor tilak. He comes in four parts so a scene can breathe
// him: scHanuman() → { tail, legs, torso, head }, with the pivots in SCH (design px, frame 1080 × 1920).
//   SCH.x, SCH.ground: where he sits · SCH.lap: the torso's pivot · SCH.neck: the head's pivot · SCH.tailRoot
const SCH = { x: 540, ground: 1652, lap: [540, 1585], neck: [540, 1250], tailRoot: [640, 1600] };
const SC_FUR = { fur: '#E9A23B', dk: '#B8691A', lt: '#FBD07A', face: '#F8D7B4', faceDk: '#DFA57C', faceLt: '#FFF0DE',
  red: '#C9372A', redDk: '#8E2219', gold: '#EDB838', ink: '#3A2412' };

// a round form lit from the upper left: lt at the light, base in the middle, dk at the rim
function scBall(c, x, y, rx, ry, cols, rot = 0, lx = -.35, ly = -.45) {
  const g = c.createRadialGradient(x + rx * lx, y + ry * ly, Math.min(rx, ry) * .08, x, y, Math.max(rx, ry) * 1.08);
  g.addColorStop(0, cols[0]); g.addColorStop(.55, cols[1]); g.addColorStop(1, cols[2]);
  c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.fill();
}
const scFurCols = () => [SC_FUR.lt, SC_FUR.fur, SC_FUR.dk];

function scHanuman() {
  const F = SC_FUR, X = SCH.x;
  const tail = scPart('bh-tail', [600, 980, 340, 660], [{
    len: 64, w: 1.5, dens: 1.6, follow: 1.4, hair: .8, outline: 6, curl: .6,
    draw(c) {
      const P = [[600, 1612], [700, 1606], [790, 1560], [846, 1460], [850, 1340], [818, 1230], [806, 1130], [836, 1050], [884, 1028], [912, 1064], [896, 1100], [866, 1092]];
      limb(c, P, [40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18], F.dk);
      c.save(); c.translate(-5, -4); limb(c, P, [32, 30, 28, 26, 25, 24, 22, 20, 18, 16, 14, 12], F.fur); c.restore();
      c.save(); c.translate(-9, -6); c.globalAlpha = .55; limb(c, P.slice(2, 9), [10, 12, 12, 10, 8, 6, 4], F.lt); c.restore();
    },
  }], { seed: 3 });

  const legs = scPart('bh-legs', [270, 1520, 540, 160], [{
    len: 84, w: 1.5, dens: 1.6, flow: 0, follow: .9, hair: .8, outline: 9, curl: .6,
    draw(c) {
      scBall(c, 395, 1592, 128, 62, scFurCols(), -.06);
      scBall(c, 685, 1592, 128, 62, scFurCols(), .06);
      // the shins crossing in front
      limb(c, [[318, 1618], [470, 1630], [640, 1622]], [64, 62, 54], F.fur);
      limb(c, [[762, 1614], [610, 1628], [440, 1618]], [64, 62, 54], F.fur);
      c.save(); c.globalAlpha = .5; limb(c, [[330, 1606], [470, 1618], [600, 1612]], [16, 18, 12], F.lt); c.restore();
      // under-shadow
      const g = c.createLinearGradient(0, 1600, 0, 1665); g.addColorStop(0, 'rgba(120,60,10,0)'); g.addColorStop(1, 'rgba(110,52,8,.55)');
      c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = g; c.fillRect(250, 1580, 580, 100); c.restore();
    },
  }, {
    len: 18, w: 1.3, dens: 1.8, flow: .3, hair: .2, outline: 2, under: .95,
    draw(c) {   // the soles, turned up where the shins cross
      scBall(c, 458, 1606, 34, 21, [F.faceLt, F.face, F.faceDk], -.35);
      scBall(c, 622, 1604, 34, 21, [F.faceLt, F.face, F.faceDk], .35);
    },
    ink(c, rnd) { scInk(c, [[440, 1612], [458, 1617], [476, 1611]], 1.4, F.faceDk, rnd, { alpha: .6 }); scInk(c, [[604, 1610], [622, 1615], [640, 1608]], 1.4, F.faceDk, rnd, { alpha: .6 });
      [[432, 1598], [438, 1590], [446, 1586]].forEach(([x, y]) => scDot(c, x, y, 2.2, F.faceDk, rnd)); [[648, 1596], [642, 1588], [634, 1584]].forEach(([x, y]) => scDot(c, x, y, 2.2, F.faceDk, rnd)); },
  }], { seed: 5 });

  const torso = scPart('bh-torso', [300, 1180, 480, 450], [{
    len: 86, w: 1.5, dens: 1.6, flow: Math.PI / 2, follow: 1.1, hair: .8, outline: 8, curl: .6,
    draw(c) {   // the trunk: a pear, and a paler belly
      c.save(); c.beginPath();
      c.moveTo(540, 1228); c.bezierCurveTo(640, 1228, 690, 1300, 696, 1400); c.bezierCurveTo(702, 1500, 640, 1556, 540, 1556);
      c.bezierCurveTo(440, 1556, 378, 1500, 384, 1400); c.bezierCurveTo(390, 1300, 440, 1228, 540, 1228); c.closePath();
      const g = c.createRadialGradient(490, 1330, 20, 540, 1400, 200); g.addColorStop(0, F.lt); g.addColorStop(.55, F.fur); g.addColorStop(1, F.dk);
      c.fillStyle = g; c.fill(); c.restore();
      c.save(); c.globalAlpha = .75; scBall(c, 540, 1430, 98, 104, ['#FFE6A8', F.lt, F.fur]); c.restore();
    },
    ink(c, rnd) {   // the munja thread: over his left shoulder (screen right) down to the right hip, "/"
      scInk(c, [[652, 1262], [600, 1340], [530, 1430], [452, 1520]], 4.5, '#7A5A1C', rnd, { alpha: .55, jit: 1.2 });
      scInk(c, [[650, 1260], [598, 1338], [528, 1428], [450, 1518]], 2.6, '#F2DC8A', rnd, { alpha: .9, jit: 1 });
    },
  }, {
    len: 24, w: 1.4, dens: 1.6, flow: 0, follow: .8, hair: .2, outline: 3, inkCol: '#4A1410',
    draw(c) {   // the langot: a thin gold band round the waist, the red cloth hanging in a fold between the knees
      c.save(); c.beginPath(); c.moveTo(506, 1512); c.lineTo(574, 1512); c.quadraticCurveTo(586, 1570, 592, 1614); c.quadraticCurveTo(540, 1626, 488, 1614); c.quadraticCurveTo(494, 1570, 506, 1512); c.closePath();
      const g = c.createLinearGradient(500, 0, 590, 0); g.addColorStop(0, F.red); g.addColorStop(.6, F.red); g.addColorStop(1, F.redDk); c.fillStyle = g; c.fill(); c.restore();
      c.save(); c.strokeStyle = F.gold; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(436, 1488); c.quadraticCurveTo(540, 1530, 644, 1488); c.stroke(); c.restore();
    },
    ink(c, rnd) { scInk(c, [[540, 1524], [536, 1570], [540, 1612]], 1.4, '#5A140E', rnd, { alpha: .5 }); },
  }, {
    len: 64, w: 1.5, dens: 1.6, follow: 1.5, hair: .8, outline: 10, curl: .5, inkCol: '#5A3210',
    draw(c) {   // the arms, down his sides and out to rest on his knees
      limb(c, [[414, 1284], [370, 1360], [344, 1450], [346, 1530]], [70, 62, 54, 46], F.dk);
      limb(c, [[666, 1284], [710, 1360], [736, 1450], [734, 1530]], [70, 62, 54, 46], F.dk);
      limb(c, [[408, 1284], [364, 1360], [338, 1448], [342, 1526]], [56, 48, 42, 36], F.fur);
      limb(c, [[660, 1284], [704, 1360], [730, 1448], [728, 1526]], [56, 48, 42, 36], F.fur);
      c.save(); c.globalAlpha = .6; limb(c, [[398, 1292], [360, 1366], [338, 1440]], [18, 16, 10], F.lt); c.restore();
    },
  }, {
    len: 22, w: 1.3, dens: 1.8, flow: 0, follow: 1, hair: .25, outline: 2, under: .95,
    draw(c) {   // gyan mudra on each knee: palm up, the thumb and first finger touching in a ring, three fingers out
      [[1, 344], [-1, 736]].forEach(([m, x]) => {
        scBall(c, x, 1556, 44, 30, scFurCols());
        c.save(); c.strokeStyle = F.fur; c.lineWidth = 11; c.beginPath(); c.ellipse(x + m * 14, 1530, 14, 12, 0, 0, TAU); c.stroke(); c.restore();
        scBall(c, x - m * 4, 1550, 30, 17, [F.faceLt, F.face, F.faceDk]);
        [[-46, -4, -.2], [-44, 10, .12], [-38, 23, .45]].forEach(([dx, dy, a]) => {
          c.save(); c.translate(x + m * dx, 1556 + dy); c.rotate(m > 0 ? a : -a); scBall(c, 0, 0, 16, 8, scFurCols()); c.restore();
        });
      });
    },
    ink(c, rnd) {
      const I = '#6A3A12';
      [[1, 344], [-1, 736]].forEach(([m, x]) => {
        c.save(); c.strokeStyle = I; c.lineWidth = 2.6; c.globalAlpha = .8;
        c.beginPath(); c.ellipse(x + m * 14 + (rnd() - .5), 1530 + (rnd() - .5), 14, 12, 0, 0, TAU); c.stroke(); c.restore();   // the ring
        scInk(c, [[x - m * 6, 1546], [x + m * 6, 1544], [x + m * 14, 1546]], 1.4, I, rnd, { alpha: .5 });
      });
    },
  }], { seed: 7 });

  const head = scPart('bh-head', [280, 850, 520, 420], [{
    len: 66, w: 1.5, dens: 1.7, follow: 1.2, hair: 1, outline: 9, curl: .6,
    flow: (x, y) => Math.atan2(y - 1100, x - 540),   // fur grows out from the face
    draw(c) {
      scBall(c, 352, 1112, 54, 56, scFurCols());
      scBall(c, 728, 1112, 54, 56, scFurCols());
      scBall(c, 540, 1094, 182, 160, scFurCols());
      // the curly tuft ("kunchit kesa")
      limb(c, [[512, 958], [522, 912], [556, 884], [598, 888], [612, 914], [596, 934], [576, 924]], [44, 36, 30, 24, 18, 14, 10], F.fur);
      c.save(); c.globalAlpha = .6; limb(c, [[520, 940], [532, 906], [560, 892]], [12, 10, 6], F.lt); c.restore();
    },
  }, {
    len: 30, w: 1.2, dens: 1.5, flow: 0, follow: 1.1, hair: .3, outline: 4, inkCol: '#8A5536', under: .85, underBlur: 2, dk: .03, lt: .25, jit: .12,
    draw(c) {   // the peach face: two eye lobes and a muzzle; the inside of the ears
      const cols = [F.faceLt, F.face, F.faceDk];
      c.save(); c.beginPath();
      c.ellipse(476, 1074, 76, 72, -.1, 0, TAU); c.ellipse(604, 1074, 76, 72, .1, 0, TAU); c.ellipse(540, 1164, 112, 74, 0, 0, TAU);
      const g = c.createRadialGradient(510, 1080, 10, 540, 1110, 170); g.addColorStop(0, cols[0]); g.addColorStop(.6, cols[1]); g.addColorStop(1, cols[2]);
      c.fillStyle = g; c.fill(); c.restore();
      scBall(c, 352, 1114, 30, 32, cols); scBall(c, 728, 1114, 30, 32, cols);
      // blush
      [[436, 1150], [644, 1150]].forEach(([x, y]) => { const b = c.createRadialGradient(x, y, 2, x, y, 40); b.addColorStop(0, 'rgba(240,120,110,.55)'); b.addColorStop(1, 'rgba(240,120,110,0)'); c.fillStyle = b; c.fillRect(x - 45, y - 45, 90, 90); });
    },
    ink(c, rnd) {
      const I = SC_FUR.ink;
      // eyes closed, at peace: lids lowered in soft U-curves, a few lashes at the outer corners
      scInk(c, [[438, 1080], [458, 1094], [482, 1098], [506, 1092], [520, 1080]], 4.2, I, rnd);
      scInk(c, [[560, 1080], [574, 1092], [598, 1098], [622, 1094], [642, 1080]], 4.2, I, rnd);
      scInk(c, [[440, 1082], [428, 1078]], 2.4, I, rnd); scInk(c, [[640, 1082], [652, 1078]], 2.4, I, rnd);
      // nostrils, a small smile
      scDot(c, 528, 1142, 4.2, I, rnd); scDot(c, 552, 1142, 4.2, I, rnd);
      scInk(c, [[512, 1180], [526, 1192], [540, 1195], [554, 1192], [568, 1180]], 3, '#7A3A26', rnd);
      // the sindoor tilak, the kajal nazar dot, gold rings in his ears ("kanan kundal")
      scInk(c, [[540, 978], [540, 1016]], 9, '#E0401E', rnd, { jit: 1 }); scDot(c, 540, 1022, 4, '#F4C040', rnd);
      scDot(c, 408, 1006, 3.6, '#2A1C14', rnd);
      [[350, 1168], [730, 1168]].forEach(([x, y]) => { c.save(); c.strokeStyle = F.gold; c.lineWidth = 5; c.beginPath(); c.ellipse(x + (rnd() - .5) * 1.5, y, 13, 15, 0, 0, TAU); c.stroke(); c.strokeStyle = '#8A5A10'; c.lineWidth = 1.2; c.globalAlpha = .7; c.stroke(); c.restore(); });
    },
  }], { seed: 11 });
  return { tail, legs, torso, head };
}

// ---------- the set ----------
function scNoise2(x, y, s = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const h = (a, b) => { const q = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453; return q - Math.floor(q); };
  return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v) * 2 - 1;
}
const scFbm2 = (x, y, s = 0, o = 4) => { let a = 0, f = 1, m = .5, t = 0; for (let i = 0; i < o; i++) { a += scNoise2(x * f, y * f, s + i * 13) * m; t += m; f *= 2.03; m *= .5; } return a / t; };

// the valley, far out of focus. o: { w, h (the frame, default W × H), dy (the scene moved down: a wallpaper grows the
// sky up behind the clock) }
function scHimalaya(c, o = {}) {
  const w = o.w || W, h = o.h || H, dy = o.dy || 0;
  const cv = sprite(`sc-himalaya${w}x${h}+${dy}`, w, h, x => {
    const raw = scCanvas(w, h), r = raw.getContext('2d');
    const g = r.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#4F9AC8'); g.addColorStop(.2 * 1920 / h, '#86C0DE'); g.addColorStop(clamp((.4 * 1920 + dy) / h), '#BFE0EC'); g.addColorStop(1, '#BFD8DF');
    r.fillStyle = g; r.fillRect(0, 0, w, h);
    r.translate(0, dy);
    const ridged = (xx, sc, seed) => { let a = 0, f = 1, m = .55; for (let i = 0; i < 5; i++) { a += Math.pow(1 - Math.abs(scNoise2(xx / sc * f, .5, seed + i * 7)), 2) * m; f *= 2.1; m *= .48; } return a; };
    const edge = (base, amp, sc, seed, xx) => base - amp * ridged(xx, sc, seed) + (seed === 3 ? 230 * Math.exp(-Math.pow((xx - 520) / 240, 2)) : 0);
    const B = h - dy;
    const ridgePath = (cx, base, amp, sc, seed) => { cx.beginPath(); cx.moveTo(-60, B); for (let xx = -60; xx <= w + 60; xx += 6) cx.lineTo(xx, edge(base, amp, sc, seed, xx)); cx.lineTo(w + 60, B); cx.closePath(); };
    // the far snow range: blue rock, and snowfields picked out by noise, thickest near the crests
    r.fillStyle = '#5A7E9E'; ridgePath(r, 980, 780, 420, 3); r.fill();
    const q = 4, snow = scCanvas(w / q, h / q), sn = snow.getContext('2d'), id = sn.createImageData(Math.ceil(w / q), Math.ceil(h / q)), d = id.data, sw = Math.ceil(w / q);
    for (let yy = 0; yy < h / q; yy++) for (let xx = 0; xx < sw; xx++) {
      const X = xx * q, Y = yy * q - dy, crest = edge(980, 780, 420, 3, X), n = scFbm2(X / 50, Y / 30, 9, 4) * 1.1 + (crest + 300 - Y) / 220, i = (yy * sw + xx) * 4;
      d[i] = 242; d[i + 1] = 246; d[i + 2] = 248; d[i + 3] = clamp((n + .1) * 3) * 255;
    }
    sn.putImageData(id, 0, 0);
    const rm = scCanvas(w, h), rmc = rm.getContext('2d'); rmc.translate(0, dy); rmc.fillStyle = '#000'; ridgePath(rmc, 980, 780, 420, 3); rmc.fill();
    rmc.setTransform(1, 0, 0, 1, 0, 0); rmc.globalCompositeOperation = 'source-in'; rmc.drawImage(snow, 0, 0, w, h); r.drawImage(rm, 0, -dy);
    // the sunlit side of the snow, the shadowed side blue
    r.save(); ridgePath(r, 980, 780, 420, 3); r.clip();
    const sh = r.createLinearGradient(0, 0, w, 0); sh.addColorStop(0, 'rgba(255,248,232,.25)'); sh.addColorStop(.6, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(60,90,130,.25)');
    r.fillStyle = sh; r.fillRect(0, -dy, w, h); r.restore();
    // haze, the forested slopes in blue-green, a dark treeline, a sunny green spur on the right
    const hz = r.createLinearGradient(0, 560, 0, 1100); hz.addColorStop(0, 'rgba(200,226,236,0)'); hz.addColorStop(1, 'rgba(200,226,236,.45)'); r.fillStyle = hz; r.fillRect(0, 560, w, 700);
    r.fillStyle = '#3E7290'; ridgePath(r, 1330, 340, 300, 7); r.fill();
    r.fillStyle = '#2D5C79'; ridgePath(r, 1420, 220, 260, 11); r.fill();
    r.fillStyle = 'rgba(190,220,232,.14)'; r.fillRect(0, 1000, w, B - 1000);
    r.fillStyle = '#82A25A'; r.beginPath(); r.moveTo(w + 40, 1250); r.quadraticCurveTo(900, 1380, 660, 1720); r.lineTo(660, B); r.lineTo(w + 40, B); r.closePath(); r.fill();
    r.fillStyle = '#B2C470'; r.globalAlpha = .6; r.beginPath(); r.moveTo(w + 40, 1300); r.quadraticCurveTo(960, 1390, 830, 1560); r.lineTo(w + 40, 1560); r.closePath(); r.fill(); r.globalAlpha = 1;
    r.fillStyle = '#22394A'; r.beginPath(); r.moveTo(-40, 1420);
    for (let xx = -40; xx <= 520; xx += 10) r.lineTo(xx, 1450 + scFbm2(xx / 40, 1, 4) * 60 + xx * .22);
    r.lineTo(520, B); r.lineTo(-40, B); r.closePath(); r.fill();
    // bokeh: a few bright blobs (snow and cloud catching the sun)
    const rb = scRnd(21);
    for (let i = 0; i < 6; i++) { const bx = 60 + rb() * (w - 120), by = 900 + rb() * 420, br = 26 + rb() * 34; r.fillStyle = `rgba(240,246,244,${.45 + rb() * .35})`; r.beginPath(); r.ellipse(bx, by, br, br * 1.1, 0, 0, TAU); r.fill(); }
    // throw it all out of focus
    x.filter = window.SC_SHARP ? 'none' : 'blur(24px)'; x.drawImage(raw, -40, -40, w + 80, h + 80); x.filter = 'none';
  });
  c.drawImage(cv, 0, 0);
}

// the boulder he sits on: sharp, granite, lit from the upper left; scRockTop(x) is its top edge
const scRockTop = x => 1642 + Math.pow((x - 520) / 560, 2) * 60 + Math.pow(Math.max(0, x - 900) / 180, 2) * 70 + scFbm2(x / 160, 4, 2, 3) * 10;
// o: { w, h (the frame), dy (moved down), top (x → its top edge, before dy), y0 (the sprite's top), key, pal: { base: [r, g, b],
// lichen (0..1), shade: [top face, front face] }, near (the out-of-focus band at the bottom, px) }
function scRock(c, o = {}) {
  const Wf = o.w || W, dy = o.dy || 0, Y0 = (o.y0 ?? 1600) + dy, h = (o.h || H) - Y0, topF = o.top || scRockTop, scRockTop_ = X => topF(X) + dy;
  const pal = o.pal || {}, base = pal.base || [146, 138, 126], lichA = pal.lichen ?? 1, [shTop, shFront] = pal.shade || [.98, .84];
  const cv = sprite('sc-rock' + (o.key || '') + Wf + 'x' + h + '+' + dy, Wf, h, x => {
    const W = Wf, scRockTop = scRockTop_;
    const id = x.createImageData(W, h), d = id.data;
    // the height: broad lumps, vertical facets on the front, a fine grain
    const hf = (X, Y) => scFbm2(X / 220, Y / 140, 1, 3) + scFbm2(X / 70, Y / 260, 21, 3) * .5 + scFbm2(X / 14, Y / 14, 5, 2) * .08;
    for (let yy = 0; yy < h; yy++) {
      const Y = Y0 + yy;
      for (let X = 0; X < W; X++) {
        const top = scRockTop(X), lip = top + 40 + scFbm2(X / 80, 8, 5, 3) * 14, i = (yy * W + X) * 4;
        if (Y < top) { d[i + 3] = 0; continue; }
        const h0 = hf(X, Y), hx = hf(X + 2, Y) - h0, hy = hf(X, Y + 2) - h0;
        const relief = clamp(1 + (-hx * 1.2 - hy * .7) * 6, .7, 1.3);
        const mott = scFbm2(X / 260, Y / 150, 3, 3), fine = scNoise2(X / 2.2, Y / 2.2, 17) * .6 + scNoise2(X / 5, Y / 5, 19) * .4, lich = scFbm2(X / 90, Y / 45, 7, 4);
        let r = base[0] + mott * 22 + fine * 16, g = base[1] + mott * 20 + fine * 15, b = base[2] + mott * 18 + fine * 14;
        if (lich > .24) { const k = clamp((lich - .24) * 4) * .55 * lichA; r = lerp(r, 176, k); g = lerp(g, 148, k); b = lerp(b, 84, k); }
        if (lich < -.34) { const k = clamp((-.34 - lich) * 4) * .45 * lichA; r = lerp(r, 112, k); g = lerp(g, 122, k); b = lerp(b, 94, k); }
        const mica = scNoise2(X / 2.6, Y / 2.6, 31);
        if (mica > .72) { const k = clamp((mica - .72) * 6); r *= 1 - .6 * k; g *= 1 - .6 * k; b *= 1 - .58 * k; }
        else if (mica < -.8) { const k = clamp((-.8 - mica) * 8) * .45; r = lerp(r, 232, k); g = lerp(g, 228, k); b = lerp(b, 218, k); }
        let shade;
        if (Y < lip) shade = shTop + (Y - top) / 40 * .04;                                    // the top face, in the sun
        else shade = shFront - clamp((Y - lip) / 280) * .4;                                     // the front face, turning away
        if (Y >= lip && Y < lip + 10) shade *= .8 + (Y - lip) / 10 * .2;                    // a soft shadow under the worn lip
        shade *= relief;
        d[i] = clamp(r * shade, 0, 255); d[i + 1] = clamp(g * shade, 0, 255); d[i + 2] = clamp(b * shade * .98, 0, 255);
        d[i + 3] = Y < top + 1.5 ? 255 * (Y - top) / 1.5 : 255;
      }
    }
    x.putImageData(id, 0, 0);
    // a few cracks: dark hairlines that wander down the front, a pale edge under each
    const rc = scRnd(44);
    x.save(); x.globalCompositeOperation = 'source-atop'; x.lineCap = 'round';
    for (let k = 0; k < 7; k++) {
      let cx = 40 + rc() * (W - 80), cy = scRockTop(cx) + 50 + rc() * 40 - Y0, a = Math.PI / 2 + (rc() - .5) * .9;
      const pts = [[cx, cy]], n = 8 + Math.floor(rc() * 14);
      for (let s = 0; s < n; s++) { a += (rc() - .5) * .8; cx += Math.cos(a) * 9; cy += Math.sin(a) * 9; pts.push([cx, cy]); }
      [[1.4, 'rgba(235,228,214,.35)', 1.5], [1.6, 'rgba(40,34,28,.75)', 0]].forEach(([w, col, off]) => {
        x.strokeStyle = col; x.lineWidth = w; x.beginPath(); pts.forEach(([px, py], i) => i ? x.lineTo(px, py + off) : x.moveTo(px, py + off)); x.stroke();
      });
    }
    x.restore();
    // a touch soft all over, and the near edge falls out of focus
    const sf = scCanvas(W, h), sfc = sf.getContext('2d'); sfc.filter = 'blur(.8px)'; sfc.drawImage(x.canvas, 0, 0);
    x.clearRect(0, 0, W, h); x.drawImage(sf, 0, 0);
    const bl = scCanvas(W, h), b = bl.getContext('2d'); b.filter = 'blur(6px)'; b.drawImage(x.canvas, 0, 0);
    const m = scCanvas(W, h), mc = m.getContext('2d'); const gg = mc.createLinearGradient(0, h - (o.near ?? 150), 0, h); gg.addColorStop(0, 'rgba(0,0,0,0)'); gg.addColorStop(1, '#000');
    mc.fillStyle = gg; mc.fillRect(0, 0, W, h); mc.globalCompositeOperation = 'source-in'; mc.drawImage(bl, 0, 0);
    x.drawImage(m, 0, 0);
  });
  c.drawImage(cv, 0, Y0);
}
