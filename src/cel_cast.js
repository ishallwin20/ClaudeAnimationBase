// cel_cast.js: the Cel style's cast and sets (CEL_GUIDE.md).
//   celSnowfield(c)          a DESIGN (bake it with ptLayer): a snowfield on Kailash under a bright sky, clouds lit
//                            from behind, a warm band at the horizon, far blue ranges, drifts and snow-capped rocks
//   celShiva(c, x, y, s, P, o) chibi Shiva standing at (x, y) (his feet), s = scale (about 1000 px tall at 1), in pose P
//                            (from celDance over CEL_SHIVA_DANCE, or one key). Returns screen anchors { bun, feet, eye3 }.
//                            o: pal (colours), fierce (the Rudra face: no blush, brows down, a roar), eye3 (0..1: the
//                            third eye opens and burns), locks (n: jata flying out on both sides)
//   CEL_SHIVA_POSES          the key poses by name (hook, wide, damaru, kick, squat, thrust, cross, ears, jump, lunge,
//                            rage, nataraja); CEL_SHIVA_DANCE: eight of them, the trial's loop
//   celCloudBank(...)        a storm or fair-weather cloud bank (design)
//   celStormfield(c)         a DESIGN: Kailash in the Rudra tandav: a violet-black sky burning red at the horizon, clouds
//                            lit from below, the peak dark against the fire, dark snow catching red light
//   celDamaru, celTrishulGlow, celChakra, celFlameRing (the ring of fire), celCracks (fire in the ground): effects
//
// A pose (all in px at s = 1; x to screen right, y down; "L" is screen left, his right):
//   hip [x, y]      the pelvis, from the ground point between his feet (standing: [0, -230])
//   lean            the upper body's tilt (radians, + leans to screen right); head: the head's tilt on top
//   hL, hR [x, y]   where each hand goes, in the upper body's frame (origin at the pelvis; shoulders at [±100, -205])
//   eL, eR [x, y]   which way each elbow bends (default out and down); kL, kR the knees (default out)
//   fL, fR [x, y]   where each foot stands, on the ground (y 0) or lifted (y < 0)
//   front           'L' or 'R': a leg in front of the body (crossed or lifted across), drawn over the dhoti with the
//                   cloth wrapped round its thigh
//   handL, handR    'open' | 'fist' | 'damaru'; mouth 'flat' | 'o' | 'smile'; squash (0..1): the head squashes as it lands; stomp: the scene shakes and the snow jumps as it lands

// ---------- clouds (design) ----------
// celCloudBank(c, R, sun, cx, cy, w, h, n, cols, rr, lean, o): n lumps (radii rr) merged into one bank w × h round (cx, cy),
// darker toward its underside, lit along the edges that face the light at sun. cols = [shadow, body, lit, rim]; opt.rim,
// opt.rimY: the rim's width (px); opt.below: lit from below (a fire under the clouds), so the tops are the dark side.
// R: the random source.
function celCloudBank(c, R, sun, cx, cy, w, h, n, cols, rr = [40, 110], lean = 0, opt = {}) {
  const L = [];
  for (let i = 0; i < n; i++) { const u = R(), e = 1 - Math.pow(Math.abs(u - .5) * 2, 2); L.push([cx + (u - .5) * w, cy + (R() - .5) * h * .5 * e - e * h * .3 + (u - .5) * lean, (rr[0] + R() * (rr[1] - rr[0])) * (.45 + .55 * e)]); }
  const off = ptCanvas(W, H), o = off.getContext('2d'), sil = (k, dx = 0, dy = 0, sc = 1) => { k.beginPath(); for (const [x, y, r] of L) { k.moveTo(x + dx + r * sc, y + dy); k.ellipse(x + dx, y + dy, r * sc, r * .62 * sc, 0, 0, TAU); } k.fill(); };
  const d = v2.norm(v2.sub(sun, [cx, cy]));
  o.fillStyle = cols[1]; sil(o);
  o.globalCompositeOperation = 'source-atop';
  let g = o.createLinearGradient(0, cy - h * .7, 0, cy + h * .45);
  if (opt.below) { g.addColorStop(0, rgba(cols[0], .95)); g.addColorStop(.5, rgba(cols[0], .4)); g.addColorStop(1, rgba(cols[2], 0)); }   // lit from below: dark tops
  else { g.addColorStop(0, rgba(cols[2], 0)); g.addColorStop(.55, rgba(cols[0], .25)); g.addColorStop(1, rgba(cols[0], .95)); }
  o.fillStyle = g; o.fillRect(0, 0, W, H);
  // the lit rim: the lit colour everywhere, then the silhouette pushed away from the sun covers all but the rim
  const rim = ptCanvas(W, H), rc = rim.getContext('2d'); rc.fillStyle = cols[3] || cols[2]; sil(rc);
  rc.globalCompositeOperation = 'destination-out'; rc.filter = 'blur(6px)'; sil(rc, -d[0] * (opt.rim ?? 26), -d[1] * (opt.rimY ?? 18)); rc.filter = 'none';
  const mid = ptCanvas(W, H), mc = mid.getContext('2d'); mc.fillStyle = cols[2]; sil(mc);
  mc.globalCompositeOperation = 'destination-out'; mc.filter = 'blur(14px)'; sil(mc, -d[0] * 60, -d[1] * 44); mc.filter = 'none';
  o.globalAlpha = .8; o.drawImage(mid, 0, 0); o.globalAlpha = 1; o.drawImage(rim, 0, 0);
  c.save(); c.filter = 'blur(2px)'; c.drawImage(off, 0, 0); c.restore();
}

// ---------- the snowfield (design) ----------
// (the storm, celStormfield, is further down: the Rudra tandav's set)
const CEL_HZ = 1130;   // the horizon
function celSnowfield(c) {
  const R = lcg(21), HZ = CEL_HZ, sun = [380, 880];
  let g = c.createLinearGradient(0, 0, 0, HZ);
  [[0, '#2A57B0'], [.3, '#4F82D2'], [.58, '#9DBFEA'], [.82, '#E6EEF4'], [1, '#FFF4E0']].forEach(([k, col]) => g.addColorStop(k, col));
  c.fillStyle = g; c.fillRect(0, 0, W, HZ + 40);
  g = c.createRadialGradient(sun[0], sun[1], 0, sun[0], sun[1], 760);
  g.addColorStop(0, 'rgba(255,250,232,1)'); g.addColorStop(.3, 'rgba(255,246,226,.7)'); g.addColorStop(1, 'rgba(255,246,226,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, HZ + 40);
  // cloud banks: lumps merged into one silhouette, lit along the edges that face the sun (it is behind them, low on
  // the left), darker toward the underside, the edge softened
  const bank = (...a) => celCloudBank(c, R, sun, ...a);
  bank(160, 210, 820, 300, 40, ['#24499A', '#4A77C4', '#AFC9EC', '#F6F9FD'], [40, 120], 60);
  bank(930, 380, 640, 220, 30, ['#2E58A8', '#5784CC', '#BCD2EF', '#FAFCFF'], [34, 96], -40);
  bank(640, 690, 1080, 300, 52, ['#7095CF', '#BCD1EE', '#EEF3FB', '#FFFFFF'], [40, 120], -30);
  bank(170, 990, 560, 130, 30, ['#B88F9F', '#DDAFAE', '#F6D6C6', '#FFF3E6'], [24, 64]);
  bank(940, 1030, 480, 110, 24, ['#7491C4', '#A2B9DE', '#D9E4F3', '#F2F6FC'], [22, 56]);
  // the light veil round the sun, over the clouds
  g = c.createRadialGradient(sun[0], sun[1], 0, sun[0], sun[1], 520);
  g.addColorStop(0, 'rgba(255,252,240,.95)'); g.addColorStop(.35, 'rgba(255,248,232,.45)'); g.addColorStop(1, 'rgba(255,248,232,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, HZ + 40);
  // far ranges, pale and blue
  ridge(c, HZ - 10, 70, 4, '#A8BEE0', { freq: .006, bottom: HZ + 60 });
  ridge(c, HZ + 8, 36, 9, '#8DA9D6', { freq: .009, bottom: HZ + 60, shape: x => x > 700 ? (x - 700) * .12 : 0 });
  // the snowfield: bright at the horizon (sun on snow), blue in the foreground shade
  g = c.createLinearGradient(0, HZ, 0, H);
  [[0, '#F7F9FC'], [.12, '#E0EAF7'], [.45, '#A5C0EA'], [1, '#4269B6']].forEach(([k, col]) => g.addColorStop(k, col));
  c.fillStyle = g; c.beginPath(); c.moveTo(0, HZ + 30); for (let x = 0; x <= W; x += 20) c.lineTo(x, HZ + 26 + Math.sin(x * .012) * 6); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.save(); c.translate(sun[0] + 40, HZ + 60); c.scale(1, .18); g = c.createRadialGradient(0, 0, 0, 0, 0, 700);
  g.addColorStop(0, 'rgba(255,255,250,.95)'); g.addColorStop(.5, 'rgba(250,250,255,.4)'); g.addColorStop(1, 'rgba(250,250,255,0)'); c.fillStyle = g; c.fillRect(-800, -800, 1600, 1600); c.restore();
  // drifts: a blue shade under a white crest, wave after wave toward us
  for (let k = 0; k < 9; k++) {
    const y = HZ + 90 + Math.pow(k / 8, 1.4) * 720, amp = 10 + k * 4, ph = R() * 6, f = .004 + R() * .003;
    const crest = x => y + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.7 + ph * 2) * amp * .4;
    c.fillStyle = `rgba(70,105,180,${.16 + k * .025})`; c.beginPath(); c.moveTo(0, crest(0)); for (let x = 0; x <= W; x += 16) c.lineTo(x, crest(x)); for (let x = W; x >= 0; x -= 16) c.lineTo(x, crest(x) + 24 + k * 6); c.fill();
    c.fillStyle = `rgba(250,252,255,${.5 - k * .03})`; c.beginPath(); c.moveTo(0, crest(0) - 4); for (let x = 0; x <= W; x += 16) c.lineTo(x, crest(x) - 4); for (let x = W; x >= 0; x -= 16) c.lineTo(x, crest(x) + 3); c.fill();
  }
  // rocks: dark blue lumps with snow on their tops
  const rock = (x, y, w, h) => {
    const n = 7, P = []; for (let i = 0; i <= n; i++) { const u = i / n, top = Math.sin(u * Math.PI); P.push([x - w / 2 + u * w + (R() - .5) * w * .08, y - h * top * (.6 + R() * .5)]); }
    ellipse(c, x + w * .1, y + 6, w * .62, h * .2, 'rgba(40,70,150,.35)');
    poly(c, [...P, [x + w / 2, y + 4], [x - w / 2, y + 4]], '#1E3270');
    poly(c, [...P.slice(0, 5).map(([a, b]) => [a, b + 4]), [P[4][0] - w * .1, y], [x - w / 2 + w * .1, y]], '#2E4C94');   // the lit left face
    c.save(); c.beginPath(); c.moveTo(P[0][0], P[0][1]); P.forEach(([a, b]) => c.lineTo(a, b)); for (let i = n; i >= 0; i--) c.lineTo(P[i][0], P[i][1] + h * (.18 + .1 * Math.sin(i * 1.7))); c.closePath(); c.fillStyle = '#EAF1FB'; c.fill(); c.restore();
  };
  [[80, 1480, 230, 90], [1000, 1350, 200, 70], [180, 1250, 110, 40], [880, 1196, 80, 26], [660, 1760, 280, 90], [40, 1850, 220, 100], [1030, 1790, 190, 80], [430, 1176, 56, 16]].forEach(r => rock(...r));
  // haze over the horizon
  g = c.createLinearGradient(0, HZ - 90, 0, HZ + 120); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(250,250,255,.55)'); g.addColorStop(1, 'rgba(250,250,255,0)');
  c.fillStyle = g; c.fillRect(0, HZ - 90, W, 210);
}

// ---------- the storm (design) ----------
// celStormfield(c): Kailash in the Rudra tandav: a near-black violet sky burning red and orange at the horizon, storm
// clouds lit from below by the fire, the peak of Kailash dark against the glow, dark snow catching red light, black rocks.
function celStormfield(c) {
  const R = lcg(33), HZ = CEL_HZ, fire = [540, HZ + 260];
  let g = c.createLinearGradient(0, 0, 0, HZ);
  [[0, '#08040F'], [.25, '#170A26'], [.5, '#34103C'], [.7, '#62183A'], [.86, '#A8282C'], [1, '#F06A2C']].forEach(([k, col]) => g.addColorStop(k, col));
  c.fillStyle = g; c.fillRect(0, 0, W, HZ + 60);
  g = c.createRadialGradient(540, HZ - 20, 0, 540, HZ - 20, 700); g.addColorStop(0, 'rgba(255,150,70,.85)'); g.addColorStop(.35, 'rgba(230,70,40,.4)'); g.addColorStop(1, 'rgba(160,30,40,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, HZ + 60);
  const bank = (...a) => celCloudBank(c, R, fire, ...a);
  bank(220, 160, 900, 300, 44, ['#07040C', '#1C0D28', '#4A1A3E', '#8E3A58'], [50, 130], 60, { below: 1, rim: 10, rimY: 22 });
  bank(880, 300, 700, 240, 36, ['#0A0510', '#25102F', '#6A2140', '#C24A4A'], [40, 110], -50, { below: 1, rim: 10, rimY: 22 });
  bank(540, 620, 1100, 300, 56, ['#12081A', '#3A1236', '#9A2A38', '#FF7A3C'], [40, 120], -20, { below: 1, rim: 12, rimY: 26 });
  bank(170, 900, 560, 150, 30, ['#2A0E22', '#5E1A2E', '#D2482E', '#FFB050'], [26, 70], 0, { below: 1, rim: 10, rimY: 20 });
  bank(930, 940, 500, 140, 28, ['#2A0E22', '#5E1A2E', '#C2402E', '#FF9A48'], [24, 64], 0, { below: 1, rim: 10, rimY: 20 });
  // Kailash: the four-sided peak behind him, dark against the fire, its ridges just lit
  const pk = x => Math.max(0, 300 - Math.abs(x - 560) * 1.05);
  ridge(c, HZ + 4, 50, 6, '#4A1A2C', { freq: .006, bottom: HZ + 80, shape: x => pk(x) + 6 });
  ridge(c, HZ + 10, 50, 6, '#1C0A1C', { freq: .006, bottom: HZ + 80, shape: pk });
  c.save(); c.globalAlpha = .55; poly(c, [[560, HZ - 290], [580, HZ - 260], [640, HZ - 160], [700, HZ - 60], [600, HZ - 120], [570, HZ - 220]], '#3A1426'); c.restore();
  ridge(c, HZ + 30, 26, 11, '#120814', { freq: .01, bottom: HZ + 90 });
  // the snowfield, dark, catching red from the sky
  g = c.createLinearGradient(0, HZ, 0, H);
  [[0, '#6A2A3A'], [.1, '#3E1E36'], [.4, '#251632'], [1, '#0C0814']].forEach(([k, col]) => g.addColorStop(k, col));
  c.fillStyle = g; c.beginPath(); c.moveTo(0, HZ + 40); for (let x = 0; x <= W; x += 20) c.lineTo(x, HZ + 34 + Math.sin(x * .012) * 6); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.save(); c.translate(540, HZ + 70); c.scale(1, .16); g = c.createRadialGradient(0, 0, 0, 0, 0, 760);
  g.addColorStop(0, 'rgba(255,120,60,.6)'); g.addColorStop(.5, 'rgba(200,60,50,.25)'); g.addColorStop(1, 'rgba(200,60,50,0)'); c.fillStyle = g; c.fillRect(-800, -800, 1600, 1600); c.restore();
  for (let k = 0; k < 9; k++) {
    const y = HZ + 90 + Math.pow(k / 8, 1.4) * 720, amp = 10 + k * 4, ph = R() * 6, f = .004 + R() * .003;
    const crest = x => y + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.7 + ph * 2) * amp * .4;
    c.fillStyle = `rgba(8,4,14,${.25 + k * .03})`; c.beginPath(); c.moveTo(0, crest(0)); for (let x = 0; x <= W; x += 16) c.lineTo(x, crest(x)); for (let x = W; x >= 0; x -= 16) c.lineTo(x, crest(x) + 24 + k * 6); c.fill();
    c.fillStyle = `rgba(255,${120 - k * 8},${90 - k * 6},${.32 - k * .025})`; c.beginPath(); c.moveTo(0, crest(0) - 4); for (let x = 0; x <= W; x += 16) c.lineTo(x, crest(x) - 4); for (let x = W; x >= 0; x -= 16) c.lineTo(x, crest(x) + 3); c.fill();
  }
  const rock = (x, y, w, h) => {
    const n = 7, P = []; for (let i = 0; i <= n; i++) { const u = i / n, top = Math.sin(u * Math.PI); P.push([x - w / 2 + u * w + (R() - .5) * w * .08, y - h * top * (.6 + R() * .5)]); }
    ellipse(c, x + w * .1, y + 6, w * .62, h * .2, 'rgba(0,0,0,.45)');
    poly(c, [...P, [x + w / 2, y + 4], [x - w / 2, y + 4]], '#0C0812');
    c.save(); c.strokeStyle = 'rgba(255,110,60,.7)'; c.lineWidth = 4; c.beginPath(); P.forEach(([a, b], i) => i ? c.lineTo(a, b + 2) : c.moveTo(a, b + 2)); c.stroke(); c.restore();
  };
  [[80, 1480, 230, 110], [1000, 1350, 200, 90], [180, 1250, 110, 46], [880, 1196, 80, 30], [660, 1760, 280, 110], [40, 1850, 220, 120], [1030, 1790, 190, 100], [430, 1176, 56, 20]].forEach(r => rock(...r));
  g = c.createLinearGradient(0, HZ - 80, 0, HZ + 140); g.addColorStop(0, 'rgba(255,90,50,0)'); g.addColorStop(.5, 'rgba(255,90,50,.28)'); g.addColorStop(1, 'rgba(255,90,50,0)');
  c.fillStyle = g; c.fillRect(0, HZ - 80, W, 220);
}

// ---------- chibi Shiva ----------
const CEL_SHIVA = {
  skin: '#4E86E6', sh: '#3060C4', lt: '#8DB9FF', hair: '#191C40', hairLt: '#2E3F86', dhoti: '#ECAB3B', dhotiSh: '#C47F25', dhotiLt: '#F8CB6A',
  red: '#E2552E', snake: '#2FA095', snakeSh: '#1D6E6C', belly: '#A6E0CF', ash: '#F4F7FF', moon: '#FBF6E2', moonSh: '#D9D3BC', blush: '#F27FA2', bead: '#6E2A20', eye3: '#C8466A',
};
const CEL_SH = ['', 9, 11], CEL_LT = ['', 5, 6];   // the shade sits down-right; the light comes from up-left
function celShiva(c, x, y, s, P, o = {}) {
  const C = { ...CEL_SHIVA, ...(o.pal || {}) }, A = {}, td = P.td ?? o.t ?? 0;
  const sh = col => [col, CEL_SH[1], CEL_SH[2]], lt = col => [col, CEL_LT[1], CEL_LT[2]];
  const skin = { shade: sh(C.sh), lt: lt(C.lt) };
  celBegin(td);
  c.save(); c.translate(x, y); c.scale(s, s);
  const land = P.land ?? 9, bl = P.beatLand ?? 9, hit = Math.max(land >= 0 ? Math.exp(-land * 9) : 0, bl >= 0 ? .45 * Math.exp(-bl * 11) : 0);
  const hip = [P.hip[0], P.hip[1] + hit * 14 + Math.sin(td * 5.1) * 2], lean = P.lean || 0, cs = Math.cos(lean), sn = Math.sin(lean);
  const Wp = ([px, py]) => [hip[0] + px * cs - py * sn, hip[1] + px * sn + py * cs];
  const sq = clamp((P.squash || 0) + hit * .5, -1, 1), sx = 1 + sq * .1, sy = 1 - sq * .12;
  const NECK = [0, -238], HC = [0, -175];
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };

  // the hair: one big dark shape behind him, a drawing late (it swings after the head)
  const lag = P.lag || P;
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lag.lean || 0); c.translate(...NECK); c.rotate((lag.head || 0) * .7); c.scale(sx, sy);
  // o.locks: the jata thrown out on both sides, lashing (a new lash each drawing)
  for (let i = 0; i < (o.locks || 0); i++) {
    const sd = i % 2 ? 1 : -1, j = i >> 1, by = -320 + j * 96, ph = td * 7 + i * 1.9, len = 260 + hash(i + 5) * 120, droop = -30 + j * 60, amp = 44 + j * 8;
    const P = []; for (let k = 0; k <= 6; k++) { const u = k / 6; P.push([sd * (160 + len * u), by + droop * u * u + Math.sin(ph - u * 3.2) * amp * u]); }
    celShape(c, celTube(P, [98, 84, 70, 56, 42, 28, 14]), C.hair, { dense: true, lt: [C.hairLt, -4, 8] });
  }
  celShape(c, [[0, -440], [150, -420], [245, -300], [262, -100], [235, 80], [150, 195], [0, 225], [-150, 195], [-235, 80], [-262, -100], [-245, -300], [-150, -420]], C.hair, {
    over: (k) => { k.fillStyle = ptLin(k, -200, -400, 120, 200, [[0, rgba(C.hairLt, .9)], [.45, rgba(C.hairLt, .25)], [1, rgba(C.hair, 0)]]); k.fillRect(-300, -460, 600, 700); },
  });
  c.restore();

  // legs: hip joint, knee, ankle (IK to the foot), the anklet, the foot
  const legs = [-1, 1].map(sd => {
    const f = sd < 0 ? P.fL : P.fR, hj = Wp([sd * 52, -12]), [knee, ank] = celIK(hj, [f[0], f[1] - 20], 118, 118, (sd < 0 ? P.kL : P.kR) || [sd, -.35]);
    return { sd, hj, knee, ank, f };
  });
  const leg = L => {
    celShape(c, celTube([L.hj, L.knee, L.ank], [86, 68, 54]), C.skin, { dense: true, ...skin });
    celBand(c, L.knee, L.ank, .8, 60, 14, C.red);
    const d = v2.norm(v2.sub(L.ank, L.knee));
    celOval(c, L.ank[0] + L.sd * 10 + d[0] * 14, L.ank[1] + d[1] * 14 + 4, 46, 22, C.skin, { ...skin, rot: Math.atan2(d[1], d[0]) - Math.PI / 2 });
  };
  // a leg in front (P.front: crossed or lifted across) is drawn after the dhoti, with the cloth wrapped round its thigh
  const fi = P.front === 'L' ? 0 : P.front === 'R' ? 1 : -1;
  legs.forEach((L, i) => { if (i !== fi) leg(L); });
  A.feet = legs.map(L => at(L.f[0], L.f[1]));

  // the dhoti: from the waist to the thighs, following the legs, with its front fold
  const hem = L => { const tp = v2.lerp(L.hj, L.knee, .8), d = v2.norm(v2.sub(L.knee, L.hj)); let q = v2.perp(d); if (q[0] * L.sd < 0) q = v2.mul(q, -1); return [v2.add(tp, v2.mul(q, 52)), v2.add(tp, v2.mul(q, -40))]; };
  const hemOf = i => i === fi ? hem({ ...legs[i], knee: v2.add(legs[i].hj, [legs[i].sd * 6, 80]) }) : hem(legs[i]);   // the front leg's side hangs short
  const [oL, iL] = hemOf(0), [oR, iR] = hemOf(1);
  celShape(c, [Wp([-96, -48]), Wp([-108, 0]), oL, iL, Wp([0, 26]), iR, oR, Wp([108, 0]), Wp([96, -48])], C.dhoti, { n: 4, shade: sh(C.dhotiSh), lt: lt(C.dhotiLt) });
  celLine(c, [Wp([-70, -30]), v2.lerp(Wp([-70, -30]), oL, .5), v2.lerp(oL, iL, .35)], 3.5);
  celLine(c, [Wp([74, -28]), v2.lerp(Wp([74, -28]), oR, .55)], 3.5);
  celShape(c, [Wp([-42, -44]), Wp([42, -44]), Wp([48, 58]), Wp([0, 78]), Wp([-48, 58])], C.dhoti, { n: 4, shade: sh(C.dhotiSh), lt: lt(C.dhotiLt) });
  celLine(c, [Wp([-8, -30]), Wp([-14, 60])], 3);
  if (fi >= 0) {
    const L = legs[fi]; leg(L);
    celShape(c, celTube([v2.add(L.hj, [0, -34]), v2.lerp(L.hj, L.knee, .8)], [100, 112]), C.dhoti, { dense: true, shade: sh(C.dhotiSh), lt: lt(C.dhotiLt) });
    celLine(c, [v2.add(L.hj, [-L.sd * 6, -10]), v2.lerp(L.hj, L.knee, .7)], 3.5);
  }

  // the upper body
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
  celShape(c, [[-86, -34], [-94, -120], [-108, -196], [-78, -232], [0, -240], [78, -232], [108, -196], [94, -120], [86, -34], [0, -26]], C.skin, skin);
  celLine(c, [[98, -200], [20, -120], [-70, -36]], 7, { col: CEL.ink, under: C.red, taper: 0 });   // the sacred thread, over his left shoulder (screen right)
  for (let i = 0; i <= 14; i++) { const a = Math.PI * i / 14; celOval(c, 82 * Math.cos(a), -215 + 150 * Math.sin(a), 8, 8, C.bead, { w: 2.2, boil: .3 }); }
  celLine(c, [[-98, -44], [0, -36], [98, -44]], 20, { col: CEL.ink, under: C.red, taper: 0 });   // the waistband
  // Vasuki's coil round the neck (behind the chin)
  celShape(c, celTube([[-112, -196], [-60, -228], [0, -236], [60, -228], [112, -196]], [34, 34, 32, 32, 30]), C.snake, { dense: true, shade: sh(C.snakeSh) });

  // the head
  c.save(); c.translate(...NECK); c.rotate(P.head || 0); c.scale(sx, sy); c.translate(...HC);
  for (const sd of [-1, 1]) { celOval(c, sd * 180, 18, 30, 40, C.skin, skin); celLine(c, [[sd * 186, 0], [sd * 176, 22], [sd * 184, 40]], 3.5); }
  celShape(c, [[-172, -140], [-95, -172], [0, -178], [95, -172], [172, -140], [186, -10], [162, 104], [80, 148], [0, 156], [-80, 148], [-162, 104], [-186, -10]], C.skin, {
    shade: [C.sh, 12, 14], lt: [C.lt, 6, 6],
    over: (k) => { k.fillStyle = ptRad(k, -40, 30, 0, 230, [[0, 'rgba(160,205,255,.32)'], [1, 'rgba(160,205,255,0)']]); k.fillRect(-200, -200, 400, 400); },
  });
  // the bun with the moon, then the hair over the top of the head, then the band
  celOval(c, 0, -282, 94, 80, C.hair, { over: (k) => { k.fillStyle = rgba(C.hairLt, .7); k.beginPath(); k.ellipse(-30, -312, 46, 26, -.4, 0, TAU); k.fill(); } });
  celShape(c, [[-190, -20], [-184, -140], [-122, -206], [0, -224], [122, -206], [184, -140], [190, -20], [168, -78], [112, -110], [40, -122], [0, -116], [-40, -122], [-112, -110], [-168, -78]], C.hair, {
    over: (k) => { k.fillStyle = rgba(C.hairLt, .55); k.beginPath(); k.ellipse(-70, -175, 70, 24, -.3, 0, TAU); k.fill(); },
  });
  celLine(c, [[-74, -214], [0, -230], [74, -214]], 22, { col: CEL.ink, under: C.red, taper: 0 });
  // the crescent: an outer circle less an inner one offset up and right, horns up-right
  { const cx = -26, cy = -292, r = 48, oa = -.75, d = r * .42, r2 = r * .86, ox = cx + Math.cos(oa) * d, oy = cy + Math.sin(oa) * d;
    const ph = Math.acos(clamp((r * r + d * d - r2 * r2) / (2 * r * d), -1, 1)), pts = [];
    for (let i = 0; i <= 16; i++) { const a = oa + ph + (TAU - 2 * ph) * i / 16; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    const pa = Math.atan2(pts[16][1] - oy, pts[16][0] - ox), pb = Math.atan2(pts[0][1] - oy, pts[0][0] - ox);
    let span = pb - pa; while (span > 0) span -= TAU;
    for (let i = 1; i < 12; i++) { const a = pa + span * i / 12; pts.push([ox + Math.cos(a) * r2, oy + Math.sin(a) * r2]); }
    celShape(c, pts, C.moon, { dense: true, shade: [C.moonSh, 4, 5], w: 4.5 }); }
  A.bun = at(0, -362);
  // the face: ash, the third eye, the bindi, brows, closed eyes, blush, nose, mouth. o.fierce: brows drawn down in a
  // V, eyes shut tight, no blush, a grim mouth or a roar ('o' roars); o.eye3 (0..1) opens the third eye, glowing
  for (const yy of [-90, -71, -52]) celLine(c, [[-88, yy + 6], [0, yy], [88, yy + 6]], 12, { under: C.ash, taper: .3 });
  const e3 = clamp(o.eye3 || 0);
  if (e3 > .05) {
    celOval(c, 0, -71, 4 + 9 * e3, 22, '#FFF1E0', { w: 3.5 });
    c.save(); c.beginPath(); c.ellipse(0, -71, 4 + 9 * e3, 22, 0, 0, TAU); c.clip();
    ellipse(c, 0, -71, 9 * e3, 12, '#FF3B1F'); ellipse(c, 0, -71, 2.4 * e3, 8, '#2A0505'); c.restore();
  } else celOval(c, 0, -71, 9, 19, C.eye3, { w: 3 });
  A.eye3 = at(0, -71);
  ellipse(c, 0, -28, 9, 9, C.red);
  for (const sd of [-1, 1]) {
    if (o.fierce) {
      celLine(c, [[sd * 28, 6], [sd * 66, -10], [sd * 108, -24]], 10, { taper: .5 });
      celLine(c, [[sd * 36, 32], [sd * 70, 26], [sd * 104, 16]], 7.5, { taper: .3 });
      celLine(c, [[sd * 44, 44], [sd * 70, 40]], 3, { boil: .5 });
      continue;
    }
    celLine(c, [[sd * 42, -6], [sd * 72, -14], [sd * 102, -8]], 5.5);
    celLine(c, [[sd * 40, 26], [sd * 70, 38], [sd * 100, 26]], 6.5, { taper: .4 });
    celLine(c, [[sd * 100, 26], [sd * 112, 18]], 4);
    c.save(); c.globalAlpha = .75; ellipse(c, sd * 100, 74, 34, 15, C.blush); c.restore();
    for (let i = 0; i < 3; i++) celLine(c, [[sd * 100 - 16 + i * 13, 82], [sd * 100 - 8 + i * 13, 66]], 3.2, { boil: .5 });
  }
  celLine(c, [[-5, 56], [3, 60]], 4);
  const m = o.fierce ? (P.mouth === 'o' ? 'roar' : 'grim') : P.mouth || 'flat';
  if (m === 'roar') {
    celShape(c, [[-34, 90], [34, 90], [26, 128], [0, 138], [-26, 128]], '#4A0A18', { n: 3, w: 5, over: (k) => {
      k.fillStyle = '#F4EEE6'; k.fillRect(-40, 84, 80, 12); k.fillStyle = '#C8384A'; k.beginPath(); k.ellipse(0, 136, 20, 12, 0, 0, TAU); k.fill(); } });
  } else if (m === 'grim') celLine(c, [[-26, 108], [-8, 100], [8, 100], [26, 108]], 6);
  else if (m === 'o') celOval(c, 0, 104, 12, 15, '#7A2438', { w: 4 });
  else if (m === 'smile') celLine(c, [[-24, 96], [0, 110], [24, 96]], 5.5);
  else celLine(c, [[-20, 102], [0, 104], [20, 100]], 5.5);
  c.restore();   // head

  // Vasuki rising in front of the chin, his hood beside the mouth
  const sw = Math.sin(td * 2.4) * 7;
  celShape(c, celTube([[70, -214], [104, -250], [86 + sw, -292]], [28, 26, 24]), C.snake, { dense: true, shade: sh(C.snakeSh) });
  celOval(c, 80 + sw, -312, 34, 44, C.snake, { rot: -.18 + sw * .01, shade: sh(C.snakeSh), over: (k) => { k.fillStyle = C.belly; k.beginPath(); k.ellipse(84 + sw, -300, 17, 30, -.18, 0, TAU); k.fill(); } });
  for (const ex of [-12, 12]) ellipse(c, 80 + sw + ex, -332, 4, 5, CEL.ink);

  // arms: shoulder, elbow, wrist (IK to the hand), bands, the hand
  for (const sd of [-1, 1]) {
    const S = [sd * 102, -205], T = sd < 0 ? P.hL : P.hR, [el, wr] = celIK(S, T, 112, 104, (sd < 0 ? P.eL : P.eR) || [sd, .6]);
    celShape(c, celTube([S, el, wr], [58, 48, 40]), C.skin, { dense: true, ...skin });
    celBand(c, S, el, .42, 56, 13, C.red); celBand(c, el, wr, .8, 46, 12, C.red);
    const d = v2.norm(v2.sub(wr, el)), q = v2.perp(d), hc = v2.add(wr, v2.mul(d, 24)), rot = Math.atan2(d[1], d[0]);
    const hand = sd < 0 ? P.handL : P.handR;
    if (hand === 'damaru') {   // he grips the damaru by its waist; it shakes from side to side each drawing
      celDamaru(c, hc[0], hc[1], 1, rot + Math.PI / 2 + (CEL.d % 2 ? .22 : -.22));
      celOval(c, hc[0], hc[1], 26, 24, C.skin, { ...skin, rot });
    } else if (hand === 'fist') celOval(c, hc[0], hc[1], 26, 24, C.skin, { ...skin, rot });
    else {
      const th = v2.add(v2.add(wr, v2.mul(d, 10)), v2.mul(q, 24 * (d[1] * sd > 0 ? -1 : 1) * sd));
      celOval(c, th[0], th[1], 15, 10, C.skin, { rot: rot - .6 });
      celOval(c, hc[0] + d[0] * 6, hc[1] + d[1] * 6, 32, 22, C.skin, { ...skin, rot });
    }
  }
  c.restore();   // upper body
  c.restore();
  return A;
}

// the damaru: two drum heads joined at a waist, a cord with a bead on each side. (x, y) is its waist; rot turns it.
function celDamaru(c, x, y, k = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  for (const sd of [-1, 1]) {
    celShape(c, [[-8, 0], [8, 0], [40, sd * 62], [-40, sd * 62]], '#B5582E', { n: 2, shade: ['#8A3A1C', 6, 0], w: 4.5 });
    celOval(c, 0, sd * 62, 42, 11, '#F3E2BC', { w: 4 });
  }
  celOval(c, 0, 0, 12, 7, '#E2552E', { w: 3.5 });
  for (const sd of [-1, 1]) { celLine(c, [[0, 0], [sd * 30, 18], [sd * 44, 8]], 3.5, { taper: 0 }); celOval(c, sd * 46, 6, 9, 9, '#F2C14E', { w: 3 }); }
  c.restore();
}

// ---------- the dance ----------
// The key poses, by name. Mirror any with celMirror().
const CEL_SHIVA_POSES = {
  // the hook: one hand at the chest, one on the hip, his weight on his left
  hook: { hip: [0, -230], lean: .05, head: .07, hL: [-20, -196], eL: [-1, .8], hR: [108, -56], eR: [1, -.2], fL: [-108, 0], fR: [98, 0], handR: 'fist', mouth: 'flat' },
  // arms flung wide, his left knee up
  wide: { hip: [12, -252], lean: -.07, head: -.09, hL: [-250, -170], hR: [248, -160], eL: [-.3, 1], eR: [.3, 1], fL: [-58, 0], fR: [96, -112], front: 'R', mouth: 'o' },
  // the damaru raised high in his right hand, the left at the chest, feet wide
  damaru: { hip: [-10, -220], lean: .09, head: .11, hL: [-226, -372], eL: [-1, .2], hR: [30, -150], eR: [1, .5], fL: [-132, 0], fR: [124, 0], handL: 'damaru', squash: .4, mouth: 'smile' },
  // a kick across: the left leg lifted in front, arms out and up
  kick: { hip: [-14, -255], lean: -.1, head: -.05, hL: [-250, -70], eL: [-.2, 1], hR: [206, -350], fL: [-52, 0], fR: [-18, -148], kR: [1, -.6], front: 'R', mouth: 'flat' },
  // a stomp into a squat, hands crossed at the chest
  squat: { hip: [0, -186], lean: 0, head: 0, hL: [26, -156], eL: [-1, .4], hR: [-26, -150], eR: [1, .4], fL: [-142, 0], fR: [142, 0], handL: 'fist', handR: 'fist', squash: 1, mouth: 'o', stomp: 1 },
  // a thrust to the side, the other hand on the hip
  thrust: { hip: [22, -232], lean: .13, head: .13, hL: [-276, -214], eL: [0, 1], hR: [104, -58], eR: [1, -.2], fL: [-92, 0], fR: [152, 0], handR: 'fist', mouth: 'flat' },
  // a cross step, his left hand up
  cross: { hip: [0, -224], lean: -.05, head: -.11, hL: [-128, -58], eL: [-1, -.2], hR: [186, -340], fL: [34, 0], fR: [-46, 0], front: 'L', mouth: 'smile' },
  // both hands up by the ears, his left foot flicked back
  ears: { hip: [0, -250], lean: .03, head: .04, hL: [-158, -372], hR: [156, -376], eL: [-1, .3], eR: [1, .3], fL: [-74, 0], fR: [104, -56], mouth: 'smile' },
  // a jump: both feet off the snow, arms flung up in a V
  jump: { hip: [0, -300], lean: 0, head: -.04, hL: [-246, -330], hR: [246, -330], eL: [-1, .6], eR: [1, .6], fL: [-64, -56], fR: [64, -60], mouth: 'o', squash: -.6 },
  // a low lunge to his right, the arm sweeping out low, the other up by his face
  lunge: { hip: [-50, -200], lean: -.16, head: -.14, hL: [-268, -96], eL: [-.2, 1], hR: [60, -250], eR: [1, .4], fL: [-176, 0], fR: [100, 0], mouth: 'flat' },
  // rage: both fists thrown out wide, elbows down, feet planted wide, roaring
  rage: { hip: [0, -214], lean: 0, head: -.02, hL: [-262, -236], hR: [262, -236], eL: [-.4, 1], eR: [.4, 1], fL: [-150, 0], fR: [150, 0], handL: 'fist', handR: 'fist', squash: .5, mouth: 'o' },
  // the Nataraja: standing on his right leg, the left lifted and swung across, the damaru high, the left arm across
  // the body pointing down to the lifted foot (gaja hasta)
  nataraja: { hip: [10, -246], lean: .08, head: .12, hL: [-214, -352], eL: [-1, .2], hR: [-70, -96], eR: [1, .1], fL: [-10, 0], fR: [-170, -150], kR: [0, -1], front: 'R', handL: 'damaru', mouth: 'smile' },
};
// the trial's 4 s loop: eight of them, one a beat at 120 BPM
const CEL_SHIVA_DANCE = ['hook', 'wide', 'damaru', 'kick', 'squat', 'thrust', 'cross', 'ears'].map(k => CEL_SHIVA_POSES[k]);

// ---------- effects ----------
// The trishul in light: a gold glowing trishul standing from (x, y0) (its foot) up to y1 (its tips), a = 0..1.
function celTrishulGlow(c, x, y0, y1, a, col = '#FFC93C') {
  if (a <= .01) return;
  const h = y0 - y1, pw = h * .16, top = y1 + h * .2;
  const draw = (w, cl, al) => {
    c.globalAlpha = al * a;
    limb(c, [[x, y0], [x, top]], [w, w], cl);
    limb(c, [[x - pw, y1 + h * .05], [x - pw, top - h * .02], [x - pw * .6, top + h * .03], [x, top + h * .035], [x + pw * .6, top + h * .03], [x + pw, top - h * .02], [x + pw, y1 + h * .05]], [w, w, w, w, w, w, w * .4], cl);
    limb(c, [[x, top + 4], [x, y1]], [w * 1.1, w * .3], cl);
    for (const sd of [-1, 1]) limb(c, [[x + sd * pw, y1 + h * .06], [x + sd * pw * 1.05, y1 - h * .02]], [w, w * .3], cl);
  };
  glow(c, x, top, h * .45, col, .45 * a, 'screen');
  c.save(); c.globalCompositeOperation = 'lighter'; draw(48, rgba(col, .22), 1); draw(26, rgba(col, .4), 1); c.restore();
  c.save(); draw(13, '#F0A21E', 1); draw(6, '#FFE68A', 1); c.restore();
}
// The chakra rings: gold and ink arcs whirling out from (x, y) as u goes 0 → 1 (a burst on a hit).
function celChakra(c, x, y, u, seed = 1) {
  if (u <= 0 || u >= 1) return;
  const e = easeOut(u), fade = 1 - Math.pow(u, 2);
  c.save(); c.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const r = 220 + i * 58 + e * 260, a0 = hash(i + seed) * TAU + e * (i % 2 ? 2.2 : -2.2), span = .6 + hash(i + seed + 9) * 1.6;
    c.globalAlpha = fade * (.55 + .45 * hash(i + seed + 3));
    c.strokeStyle = i % 3 === 1 ? CEL.ink : '#FFC93C'; c.lineWidth = i % 3 === 1 ? 4 : 6;
    c.setLineDash(i % 2 ? [3, 16] : [40, 14, 6, 14]); c.beginPath(); c.arc(x, y, r, a0, a0 + span); c.stroke();
    c.beginPath(); c.arc(x, y, r, a0 + Math.PI, a0 + Math.PI + span * .7); c.stroke();
  }
  c.setLineDash([]); c.restore();
  glow(c, x, y, 420 * (1 - u * .4), '#FFD36B', .25 * fade);
}

// The ring of fire (the Nataraja's prabha) round (x, y), radius r: flame tongues licking outward, each re-drawn every
// drawing (td: the held time); a = 0..1; flare (0..1) makes them leap (on a hit).
function celFlameRing(c, x, y, r, td, a = 1, flare = 0) {
  if (a <= .01) return;
  glow(c, x, y, r * 1.45, '#FF3A12', .2 * a * (1 + flare), 'screen');
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  c.globalAlpha = .3 * a; c.strokeStyle = '#E8360F'; c.lineWidth = 30; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  c.globalAlpha = .75 * a; c.strokeStyle = '#FF8A2A'; c.lineWidth = 7; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  const d = Math.floor(td * 10 + 1e-4);
  // two rows of tongues: big uneven ones, then smaller ones between them; each bends with the wind and re-draws per drawing
  for (const [N, sz, off, seed] of [[22, 1, 0, 0], [22, .55, .5, 40]]) for (let i = 0; i < N; i++) {
    const ang = (i + off) / N * TAU + td * .2, dir = [Math.cos(ang), Math.sin(ang)], tg = [-dir[1], dir[0]];
    const fl = (.55 + .45 * (vnoise(i * 1.7 + d * .9 + seed, 4) * .5 + .5)) * (1 + flare * .8);
    const L = (70 + 110 * hash(i * 3.1 + seed)) * fl * sz, w = (34 + 22 * hash(i + seed + 7)) * sz;
    const s1 = vnoise(i * 2.3 + d * 1.3 + seed, 8) * 22 * sz, s2 = vnoise(i * 1.1 + d * 1.7 + seed, 9) * 34 * sz;
    const at = (k, sw) => [x + dir[0] * (r - 4 + L * k) + tg[0] * sw, y + dir[1] * (r - 4 + L * k) + tg[1] * sw];
    const P = [at(0, 0), at(.35, s1), at(.7, s1 + s2 * .6), at(1, s2 * 1.4)];
    c.globalAlpha = .5 * a; limb(c, P, [w, w * .85, w * .4, 2], '#A3100F');
    c.globalAlpha = .7 * a; limb(c, P.slice(0, 3), [w * .62, w * .5, 2], '#FF4A14');
    c.globalAlpha = .75 * a; limb(c, P.slice(0, 2), [w * .34, 2], '#FFB03A');
  }
  c.restore();
}
// Cracks of fire in the ground round (x, y) (a stomp): branching lines along the ground plane, glowing; a = 0..1.
function celCracks(c, x, y, seed, a) {
  if (a <= .01) return;
  const R = lcg(seed), paths = [];
  const grow = (p, ang, len, depth) => {
    const pts = [p]; let [px, py] = p;
    for (let k = 0; k < 6; k++) { ang += (R() - .5) * .7; px += Math.cos(ang) * len / 6; py += Math.sin(ang) * len / 6 * .22; pts.push([px, py]); }
    paths.push([pts, depth]);
    if (depth < 2) for (let b = 0; b < 2; b++) if (R() < .7) grow(pts[2 + (R() * 3 | 0)], ang + (R() - .5) * 1.4, len * .55, depth + 1);
  };
  for (let i = 0; i < 7; i++) grow([x + (R() - .5) * 40, y + (R() - .5) * 8], i / 7 * TAU + R() * .5, 220 + R() * 200, 0);
  const stroke = (w, col, al) => { for (const [pts, dp] of paths) { c.globalAlpha = al * a / (1 + dp * .5); c.strokeStyle = col; c.lineWidth = w / (1 + dp * .5); c.beginPath(); pts.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); } };
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  stroke(7, '#05030A', .9);
  c.globalCompositeOperation = 'lighter'; stroke(18, '#FF3A12', .35); stroke(6, '#FF8A2A', .9); stroke(2, '#FFE9A0', 1);
  c.restore();
  glow(c, x, y, 260, '#FF4A1A', .35 * a, 'screen');
}
