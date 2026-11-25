// bi_krishna.js: Krishna as a Brush Ink bust (the style test): a crowned bust with a knowing look, his finger at his
// chin, on a halo with lotus petals over a lavender mandala. The figure is drawn in head units: (0, 0) between the
// eyes, the chin at y 214, the shoulders at ~360.
const BK = {
  skin: '#8F8DE2', skinS: '#625AB8', skinD: '#3D3288', skinH: '#B7B9F4',
  lip: '#6C569F', lipS: '#46357F', lipH: '#9888D2', white: '#F2EFF8', lidS: '#C3BBE0', iris: '#4B2B1C', irisL: '#7A4A2A',
  gold: '#E3AF4C', goldS: '#A8661F', goldD: '#5A300F', goldH: '#FFE7A3',
  saf: '#EC8A2E', safS: '#B9581B', safD: '#7C3412', safH: '#FBBE6A',
  hair: '#120D17', hairH: '#4A3A7E', hairH2: '#7563BE',
  red: '#C7302B', redH: '#F26B4E', green: '#2F8F5A', leaf: '#3E7F3A',
  line: '#C8B5FF', bgT: '#5C22C6', bgB: '#360C8C',
};

function biKrishnaPanel(c, R, t) {
  const B = BI;
  c.save(); c.beginPath(); c.rect(R.x, R.y, R.w, R.h); c.clip();
  const cx = 540, cy = 560;
  // the ground: a violet gradient, lighter round the halo
  const g = c.createLinearGradient(0, R.y, 0, R.y + R.h); g.addColorStop(0, BK.bgT); g.addColorStop(1, BK.bgB);
  c.fillStyle = g; c.fillRect(R.x, R.y, R.w, R.h);
  const gl = c.createRadialGradient(cx, cy, 200, cx, cy, 760); gl.addColorStop(0, 'rgba(170,120,255,.55)'); gl.addColorStop(1, 'rgba(120,60,230,0)');
  c.fillStyle = gl; c.fillRect(R.x, R.y, R.w, R.h);
  biMandala(c, cx, cy);
  // warm bloom round the halo
  const gw = c.createRadialGradient(cx, cy, 300, cx, cy, 560); gw.addColorStop(0, 'rgba(255,196,214,.55)'); gw.addColorStop(.5, 'rgba(240,150,220,.18)'); gw.addColorStop(1, 'rgba(200,120,255,0)');
  c.fillStyle = gw; c.fillRect(R.x, R.y, R.w, R.h);
  biHalo(c, cx, cy, 330);
  c.save(); c.translate(540, 662); c.rotate(-.035); c.scale(1.3, 1.3);
  biKrishna(c, {});
  c.restore();
  c.restore();
}

// ---------- the mandala: lavender line work round the halo ----------
function biMandala(c, cx, cy) {
  const B = BI, col = BK.line, tint = 'rgba(205,180,255,.10)';
  const L = (P, w = 3, o = {}) => B.stroke(c, P, { w: w * 1.3, col, a: .12, b: .12, jit: .08, ...o });
  c.save(); c.translate(cx, cy);
  // ring 1: sixteen lotus petals
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * B.TAU, r0 = 330, h = 140, w = 70;
    const P = [[-w, -r0 + 10], [-w * 1.08, -r0 - h * .38], [-w * .6, -r0 - h * .82], [0, -r0 - h], [w * .6, -r0 - h * .82], [w * 1.08, -r0 - h * .38], [w, -r0 + 10]];
    const Q = B.tr(P, 0, -r0 * .25, .75).map(([x, y]) => [x, y - 6]);
    c.save(); c.rotate(a);
    B.fill(c, P, tint); L(P, 3.4); L(Q, 2.2);
    L([[0, -r0 - 30], [0, -r0 - h * .7]], 1.8);
    c.restore();
  }
  // ring 2: eight scroll flourishes between the petals' tips
  for (let i = 0; i < 8; i++) {
    c.save(); c.rotate((i + .5) / 8 * B.TAU);
    for (const s of [1, -1]) {
      const sp = B.spiral(s * 110, -610, 52, 8, 1.05, s > 0 ? Math.PI * .9 : Math.PI * .1, -s, 50);
      const arm = [[0, -470], [s * 40, -520], [s * 105, -560], [s * 150, -600], ...sp.slice(4)];
      L([[0, -470], [s * 40, -520], [s * 105, -560], [s * 160, -608]], 3.6, { b: .05 });
      L(sp, 3.2, { a: .02, b: .5 });
      const sp2 = B.spiral(s * 110, -610, 70, 58, .45, s > 0 ? Math.PI * .95 : Math.PI * .05, -s, 20);
      L(sp2, 2, { a: .3, b: .4 });
      // a leaf curling back from the scroll
      L([[s * 60, -540], [s * 40, -600], [s * 55, -660], [s * 90, -690]], 2.6);
      L([[s * 160, -560], [s * 210, -575], [s * 245, -620], [s * 250, -680]], 2.8, { a: .2, b: .5 });
      L(B.spiral(s * 225, -690, 26, 5, .9, s > 0 ? 0 : Math.PI, s, 30), 2.4, { a: .05, b: .6 });
      B.disc(c, s * 200, -520, 6, col); B.disc(c, s * 225, -500, 4, col);
    }
    // the spear between the scrolls
    const sp = [[0, -480], [-26, -580], [-16, -690], [0, -770], [16, -690], [26, -580]];
    B.fill(c, sp, tint); L([...sp, [0, -480]], 3, { a: .05, b: .05 });
    L([[0, -520], [0, -720]], 1.8);
    for (let k = 0; k < 3; k++) B.disc(c, 0, -800 - k * 26, 6 - k * 1.4, col);
    c.restore();
  }
  // ring 3: scallops
  for (let i = 0; i < 32; i++) {
    const a0 = i / 32 * B.TAU, a1 = (i + 1) / 32 * B.TAU, r = 860, P = [];
    for (let k = 0; k <= 10; k++) { const a = a0 + (a1 - a0) * k / 10, rr = r + Math.sin(k / 10 * Math.PI) * 46; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    L(P, 3, { a: .1, b: .1 });
    const am = (a0 + a1) / 2; B.disc(c, Math.cos(am) * (r + 70), Math.sin(am) * (r + 70), 5, col);
  }
  c.restore();
}

// ---------- the halo: a gold disc with lotus petals of flame ----------
function biHalo(c, cx, cy, r) {
  const B = BI;
  c.save(); c.translate(cx, cy);
  for (let i = 0; i < 14; i++) {
    c.save(); c.rotate(i / 14 * B.TAU + .11);
    const P = [[-34, -r + 6], [-40, -r - 34], [-18, -r - 66], [0, -r - 84], [18, -r - 66], [40, -r - 34], [34, -r + 6]];
    B.fill(c, P, '#F4A6C8');
    B.fill(c, B.tr(P, 0, (-r - 30) * .4, .6), '#FFE4F0');
    B.outline(c, P, { w: 3.2, col: '#8E2638', sh: [0, -1], heavy: .6 });
    B.stroke(c, [[0, -r - 20], [0, -r - 62]], { w: 2.4, col: '#B8405A', a: .2, b: .6 });
    c.restore();
  }
  const g = c.createRadialGradient(0, 40, 0, 0, 0, r);
  g.addColorStop(0, '#FFF6D6'); g.addColorStop(.42, '#FCE09C'); g.addColorStop(.78, '#F6B76E'); g.addColorStop(1, '#EE9374');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, B.TAU); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r + 6, 0, B.TAU); c.stroke();
  B.ring(c, 0, 0, r, r, { w: 4.4, col: '#8E2638', heavy: .5 });
  B.ring(c, 0, 0, r - 16, r - 16, { w: 1.6, col: 'rgba(178,72,60,.55)', heavy: 0 });
  c.restore();
}

// ---------- the figure ----------
function biHairMass(c, P, o = {}) {
  const B = BI, S = B.curve(P, true, 2), N = B.normals(S, true), r = B.rnd(o.seed || 5);
  let a2 = 0; S.forEach((p, i) => { const q = S[(i + 1) % S.length]; a2 += p[0] * q[1] - q[0] * p[1]; });
  const sg = a2 > 0 ? -1 : 1;
  B.fill(c, P, BK.hair);
  const bumps = [];
  for (let i = 0; i < S.length; i += o.every || 9) {
    const [x, y] = S[i]; if (o.edge && !o.edge(x, y)) continue;
    const nx = N[i][0] * sg, ny = N[i][1] * sg, rr = (o.r || 13) * (.7 + r() * .6);
    bumps.push([x + nx * rr * .45, y + ny * rr * .45, rr]);
  }
  bumps.forEach(([x, y, rr]) => B.disc(c, x, y, rr, BK.hair));
  // curl sheen: crescents on the upper-left of each curl, and loose curls inside the mass
  const arc = (x, y, rr, a0, a1, w, col) => { const Q = []; for (let k = 0; k <= 12; k++) { const a = a0 + (a1 - a0) * k / 12; Q.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } B.stroke(c, Q, { w, col, a: .35, b: .45, jit: .1 }); };
  bumps.forEach(([x, y, rr], k) => arc(x, y, rr * .62, Math.PI * (1.02 + r() * .1), Math.PI * (1.62 + r() * .2), rr * .26, k % 3 ? BK.hairH : BK.hairH2));
  if (o.inner) B.clip(c, P, () => o.inner.forEach(([x, y, rr], k) => {
    arc(x, y, rr, Math.PI * (.95 + r() * .15), Math.PI * (1.75 + r() * .2), rr * .28, BK.hairH);
    if (k % 2) arc(x + rr * .2, y + rr * .9, rr * .7, Math.PI * (1.1), Math.PI * 1.6, rr * .2, BK.hairH);
  }));
  if (o.strands) o.strands.forEach(s => B.stroke(c, s, { w: 3.2, col: BK.hairH, a: .3, b: .5 }));
}

// a ringlet: a black ribbon waving down its spine, tapering to a point, with a sheen crossing it at each turn
function biLock(c, spine, o = {}) {
  const B = BI, S = B.curve(spine, false, 1.5), N = B.normals(S, false), Ls = [0];
  for (let i = 1; i < S.length; i++) Ls.push(Ls[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const tot = Ls[Ls.length - 1], w = o.w || 40, amp = o.amp ?? 8, per = o.per || 42, ph = o.ph || 0, r = B.rnd(o.seed || 1);
  const env = u => Math.min(1, u / .18);
  const D = S.map((p, i) => { const u = Ls[i] / tot, d = amp * Math.sin(Ls[i] / per * B.TAU + ph) * env(u); return [p[0] + N[i][0] * d, p[1] + N[i][1] * d]; });
  const wid = u => w * (1 - .82 * Math.pow(u, 1.4)) * (1 + .12 * Math.sin(u * tot / per * B.TAU * 2 + ph));
  // the ribbon, with scalloped edges where each curl turns
  B.stroke(c, D.filter((_, i) => i % 2 === 0), { w: 1, a: .03, b: .3, jit: 0, col: BK.hair, wf: (u) => wid(u) });
  const DN = B.normals(D, false), lightSide = o.flip ? -1 : 1;
  if (o.rim) {
    // the halo behind lights the outer edge of each curl
    let run = [];
    const flush = () => { if (run.length > 4) B.stroke(c, run, { w: 3.2, col: o.rim, a: .3, b: .3, jit: .2 }); run = []; };
    D.forEach((p, i) => {
      const u = Ls[i] / tot, on = Math.sin(Ls[i] / per * B.TAU + ph) > .15 && u < .9, hw = wid(u) / 2 - 2.5;
      if (on) run.push([p[0] + DN[i][0] * hw * lightSide, p[1] + DN[i][1] * hw * lightSide]); else flush();
    });
    flush();
  }
  {
    // a sheen that runs down the lock's left (lit) side, following each wave
    let run = [];
    const flush = () => { if (run.length > 5) B.stroke(c, run, { w: Math.max(2.4, w * .07), col: o.dim ? BK.hairH : BK.hairH2, a: .4, b: .4, jit: .15 }); run = []; };
    D.forEach((p, i) => {
      const u = Ls[i] / tot, on = Math.cos(Ls[i] / per * B.TAU + ph) > .2 && u > .04 && u < .88, hw = wid(u) / 2, sd = DN[i][0] < 0 ? 1 : -1;
      if (on) run.push([p[0] + DN[i][0] * hw * .42 * sd, p[1] + DN[i][1] * hw * .42 * sd]); else flush();
    });
    flush();
  }
  for (let k = 0; ; k += 2) {
    const s0 = per * (k + .25 + (ph / B.TAU)) % (tot + 1); if (per * (k + .25) > tot * .92) break;
    const i = Ls.findIndex(L => L >= per * (k + .25)); if (i < 0) break;
    const u = Ls[i] / tot, hw = wid(u) / 2, [x, y] = D[i], [nx, ny] = DN[i], tx = -ny, ty = nx;
    // a crescent across the lock: the curl catching the light
    const bulge = hw * .55 * (k % 2 ? 1 : -1);
    const P = [[x - nx * hw * .78 * lightSide, y - ny * hw * .78 * lightSide], [x + tx * bulge, y + ty * bulge], [x + nx * hw * .5 * lightSide, y + ny * hw * .5 * lightSide]];
    B.stroke(c, P, { w: Math.max(2, hw * .15), col: BK.hairH, a: .3, b: .55, jit: .1, seed: k + (o.seed || 0) });
    if (r() < .3) B.stroke(c, [[x - nx * hw * .55 * lightSide + tx * 6, y - ny * hw * .55 * lightSide + ty * 6], [x - nx * hw * .3 * lightSide + tx * 16, y - ny * hw * .3 * lightSide + ty * 16]], { w: 1.6, col: BK.hairH, a: .4, b: .5 });
  }
}

function biKrishna(c, o = {}) {
  const head = !!o.head;
  const B = BI, K = BK, ink = B.ink;
  const S = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  const curlGrid = (x0, y0, x1, y1, n, seed) => { const r = B.rnd(seed), out = []; for (let i = 0; i < n; i++) out.push([x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), 10 + r() * 9]); return out; };

  if (o.hairSpines) o.hairSpines.forEach((sp, i) => biLock(c, sp, { w: 50 - i * 2, amp: 9, per: 44 + i * 3, seed: i + 70, ph: i * 1.1, dim: i % 2 === 0, rim: o.rim || null, flip: sp[sp.length - 1][0] > 0 }));
  else {
  // --- hair behind: long ringlets to the shoulders ---
  const backL = [
    [[-104, -158], [-168, -136], [-206, -60], [-226, 40], [-250, 140], [-274, 240], [-284, 330], [-272, 410]],
    [[-112, -152], [-152, -112], [-178, -20], [-194, 80], [-218, 180], [-242, 280], [-256, 370], [-246, 446]],
    [[-120, -120], [-160, -60], [-182, 40], [-204, 150], [-228, 250], [-236, 340], [-222, 426]],
    [[-128, -84], [-150, 0], [-164, 100], [-182, 200], [-192, 300], [-202, 392]],
  ];
  B.fill(c, [[-120, -158], [-178, -112], [-206, 0], [-232, 150], [-252, 300], [-236, 400], [-150, 420], [-100, 300], [-100, -100]], K.hair);
  B.fill(c, B.mir([[-120, -158], [-178, -112], [-206, 0], [-232, 150], [-252, 300], [-236, 400], [-150, 420], [-100, 300], [-100, -100]]), K.hair);
  B.fill(c, [[-130, -100], [130, -100], [120, 300], [-120, 300]], K.hair);
  backL.forEach((sp, i) => {
    biLock(c, sp, { w: [52, 58, 54, 48][i], amp: 9, per: 44 + i * 3, seed: i + 1, ph: i * 1.3, dim: i < 2, rim: i < 2 ? '#E7A0D6' : null });
    biLock(c, B.mir(sp).map(([x, y]) => [x * (1 + i * .01), y + i * 4]), { w: [52, 58, 54, 48][i], amp: 9, per: 46 + i * 2, seed: i + 11, ph: i * 1.7 + .5, dim: i < 2, flip: true, rim: i < 2 ? '#E7A0D6' : null });
  });

  }
  if (!head) {
  // --- the body ---
  const torso = [[-75, 240], [-82, 318], [-150, 338], [-262, 362], [-352, 405], [-422, 470], [-470, 560], [-484, 760], [484, 760], [470, 560], [422, 470], [352, 405], [262, 362], [150, 338], [82, 318], [75, 240]];
  B.fill(c, torso, K.skin);
  B.clip(c, torso, () => {
    // shadow down the right flank and under the pectorals, the hair's cast shadow on the left shoulder
    B.fill(c, [[-40, 472], [-110, 494], [-182, 482], [-246, 446], [-262, 480], [-200, 520], [-110, 530], [-40, 505]], K.skinS);
    B.fill(c, [[-262, 362], [-215, 372], [-196, 420], [-210, 470], [-262, 470]], K.skinS);
    B.fill(c, [[-470, 560], [-430, 520], [-410, 600], [-425, 760], [-490, 760]], K.skinS);
    B.fill(c, [[-6, 360], [10, 400], [8, 470], [-4, 520], [30, 520], [36, 420]], K.skinS);
    S([[-330, 410], [-372, 470], [-398, 540]], 3, { a: .3, b: .5 });
    B.feather(c, [[-246, 446], [-182, 482], [-110, 494]], { n: 9, len: 22, side: -1, w: 2, seed: 4 });
    // highlights on the lit chest
    S([[-170, 392], [-120, 400], [-80, 420]], 5, { col: K.skinH, a: .4, b: .5 });
  });
  S([[-78, 300], [-100, 330], [-150, 338], [-262, 362], [-352, 405], [-422, 470], [-466, 560], [-480, 700]], 5.5, { a: .05, b: .3 });
  S([[-28, 352], [-80, 346], [-140, 356], [-196, 372]], 3.4, { a: .3, b: .6 });
  S([[28, 352], [80, 346], [140, 356]], 3.4, { a: .3, b: .6 });
  S([[-14, 338], [0, 358], [14, 338]], 2.6, { a: .3, b: .3 });
  S([[-40, 470], [-110, 494], [-182, 482], [-246, 446]], 4.4, { a: .2, b: .4 });
  S([[0, 410], [-2, 470]], 2.2, { a: .4, b: .4 });

  // --- the neck ---
  const neck = [[-74, 120], [-78, 250], [-86, 334], [-40, 350], [0, 356], [40, 350], [86, 334], [78, 250], [74, 120]];
  B.fill(c, neck, K.skin);
  B.clip(c, neck, () => {
    B.fill(c, [[-80, 150], [80, 150], [84, 262], [40, 270], [0, 262], [-40, 270], [-80, 258]], K.skinS);
    B.fill(c, [[34, 266], [84, 258], [90, 340], [52, 344]], K.skinD);
    B.fill(c, [[-40, 205], [0, 218], [34, 212], [66, 192], [84, 160], [86, 210], [60, 236], [30, 244], [0, 240], [-30, 228]], K.skinD);
    B.fill(c, [[20, 214], [50, 204], [72, 186], [86, 160], [86, 196], [64, 220], [36, 228]], ink);
    B.hatch(c, [[30, 236], [84, 210], [86, 330], [52, 340]], { box: [20, 200, 90, 345], ang: -1.2, gap: 8, w: 1.5, col: K.skinD, seed: 5 });
    B.hatch(c, [[50, 250], [84, 230], [86, 330], [60, 336]], { box: [40, 220, 90, 345], ang: -.3, gap: 9, w: 1.3, col: B.ink, seed: 6 });
  });
  S([[-56, 228], [-40, 290], [-20, 342]], 2.6, { a: .3, b: .5 });
  S([[56, 228], [42, 290], [24, 342]], 2.6, { a: .3, b: .5 });
  S([[-74, 130], [-77, 250], [-84, 318]], 4, { a: .1, b: .3 });
  S([[74, 130], [79, 250], [86, 322]], 6, { a: .1, b: .3 });

  // --- jewellery on the chest ---
  biNecklaces(c);

  // --- the uttariya, saffron, over his left shoulder ---
  biShawl(c);
  }

  // --- the face ---
  const F = [[0, -150], [72, -147], [112, -120], [127, -60], [129, 0], [125, 52], [115, 102], [100, 148], [72, 188], [34, 210], [0, 214], [-34, 210], [-72, 188], [-100, 148], [-115, 102], [-125, 52], [-129, 0], [-127, -60], [-112, -120], [-72, -147]];
  biEar(c, 1); biEar(c, -1);
  B.fill(c, F, K.skin);
  B.clip(c, F, () => {
    B.fill(c, [[60, -152], [112, -120], [127, -60], [129, 0], [125, 52], [115, 102], [100, 148], [72, 188], [34, 210], [8, 216], [38, 194], [64, 164], [86, 124], [98, 80], [100, 36], [95, -6], [101, -50], [92, -98], [68, -130]], K.skinS);
    B.fill(c, [[102, 118], [116, 90], [124, 56], [134, 80], [122, 140], [96, 162]], K.skinD);
    B.fill(c, [[-64, 184], [-30, 198], [0, 202], [30, 198], [62, 182], [34, 212], [0, 218], [-34, 212]], K.skinS);
    B.fill(c, [[26, -26], [60, -36], [98, -28], [106, -6], [98, 14], [88, -6], [62, -18], [36, -14]], K.skinS);
    B.fill(c, [[-28, -24], [-60, -34], [-96, -26], [-104, -8], [-90, -8], [-62, -18], [-38, -14]], K.skinS);
    B.fill(c, [[8, -16], [16, 28], [24, 68], [32, 88], [24, 100], [10, 102], [14, 80], [12, 40], [4, 0]], K.skinS);
    B.fill(c, [[-22, 104], [0, 108], [22, 104], [14, 118], [0, 122], [-14, 118]], K.skinS);
    B.fill(c, [[-24, 165], [0, 171], [24, 165], [14, 180], [0, 184], [-14, 180]], K.skinS);
    B.fill(c, [[-128, -40], [-112, -40], [-108, 40], [-114, 110], [-128, 110]], K.skinS);
    // cast shadows: the crown band on the brow, the hair on the temples
    B.fill(c, [[-130, -150], [130, -150], [130, -112], [60, -116], [20, -108], [-30, -110], [-80, -114], [-130, -108]], K.skinS);
    B.feather(c, [[-110, -112], [-40, -110], [40, -112], [110, -114]], { n: 22, len: 12, side: -1, w: 1.5, seed: 31, col: K.skinD });
    B.fill(c, [[-130, -110], [-112, -100], [-116, -40], [-110, 10], [-124, 40], [-132, 0]], K.skinS);
    // light
    B.stroke(c, [[-104, 24], [-86, 20], [-70, 30]], { w: 6, col: K.skinH, a: .4, b: .5 });
    S([[-4, -4], [-7, 36], [-9, 70]], 5, { col: K.skinH, a: .3, b: .4 });
    S([[-70, -118], [-40, -124], [-20, -122]], 6, { col: K.skinH, a: .4, b: .5 });
    B.oval(c, -12, 196, 12, 6, K.skinH, -.1);
    // feathering into the shadow side
    B.feather(c, [[92, -98], [101, -50], [95, -6], [100, 36], [98, 80], [86, 124], [64, 164]], { n: 16, len: 16, side: -1, tilt: .5, w: 1.7, seed: 6, col: K.skinD });
    B.feather(c, [[98, 80], [86, 124], [64, 164], [38, 194]], { n: 9, len: 14, side: -1, tilt: -.3, w: 1.6, seed: 13 });
  });
  B.clip(c, F, () => {
    B.fill(c, [[14, -20], [28, -14], [24, 6], [16, 20]], K.skinD);
    B.fill(c, [[116, -30], [128, -60], [130, 10], [124, 60], [118, 20]], B.ink);
  });
  biFace(c, o);
  B.clip(c, F, () => B.stroke(c, [[118, -100], [128, -40], [128, 20], [122, 70]], { w: 5, col: '#B58BE0', a: .3, b: .4 }));
  B.outline(c, F, { w: 4.2, heavy: 1.4 });
  // the tilak
  const UO = [[-17, -150], [-13, -96], [-8, -46], [0, -24], [8, -46], [13, -96], [17, -150]], UI = [[8, -150], [5, -98], [2, -54], [0, -46], [-2, -54], [-5, -98], [-8, -150]];
  const U = B.curve(UO, false, 2).concat(B.curve(UI, false, 2));
  B.fill(c, U, '#FFFDF5', { straight: true }); B.stroke(c, U, { closed: true, w: 2, col: ink, jit: .15 });
  S([[0, -140], [0, -64]], 5.5, { col: K.red, a: .05, b: .35 });

  // --- hair in front: temples and the locks over the shoulders ---
  for (const m of [1, -1]) {
    const f = P => m > 0 ? P : B.mir(P);
    biLock(c, f([[-108, -150], [-122, -104], [-130, -44], [-134, 14], [-142, 58]]), { w: 30, amp: 4, per: 34, seed: 40 + m, flip: m < 0 });
    if (head) continue;
    biLock(c, f([[-130, 18], [-150, 82], [-164, 170], [-170, 258], [-188, 348], [-198, 430], [-184, 482]]), { w: 46, amp: 10, per: 40, seed: 50 + m, ph: 1, flip: m < 0 });
    biLock(c, f([[-140, 40], [-170, 110], [-192, 200], [-206, 290], [-226, 372], [-236, 440]]), { w: 38, amp: 9, per: 38, seed: 60 + m, ph: 2.2, flip: m < 0 });
    B.stroke(c, f(B.spiral(-190, 492, 14, 3, .9, -Math.PI * .5, 1, 30)), { w: 5, col: K.hair, a: .05, b: .6 });
    B.stroke(c, f(B.spiral(-244, 452, 11, 3, .9, -Math.PI * .4, 1, 30)), { w: 4.4, col: K.hair, a: .05, b: .6 });
  }

  biEarring(c, 1); biEarring(c, -1);
  if (o.feather !== false) biFeather(c);
  biCrown(c);
  if (!head) biHand(c);
}

function biEar(c, s) {
  const B = BI, P = [[124 * s, -14], [140 * s, -24], [151 * s, -2], [149 * s, 34], [140 * s, 58], [128 * s, 66], [122 * s, 40]];
  B.fill(c, P, s > 0 ? BK.skinS : BK.skin);
  B.stroke(c, [[134 * s, -8], [142 * s, 10], [138 * s, 36]], { w: 2.6, a: .3, b: .4 });
  B.outline(c, P, { w: 3.4 });
}

function biFace(c, o = {}) {
  const fierce = o.mood === 'fierce', gz = o.gaze || [13, 1];
  const B = BI, K = BK, ink = B.ink, S = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  // eyes: almond, white, the irises turned to his left (our right): a sidelong look
  for (const s of [-1, 1]) {
    const up = [[24, 2], [36, -10], [56, -15], [77, -12], [97, -2]].map(([x, y]) => [x * s, y]);
    const lo = [[97, -2], [80, 10], [58, 14], [36, 11], [24, 2]].map(([x, y]) => [x * s, y]);
    const A = B.curve(up, false, 1.5).concat(B.curve(lo, false, 1.5).slice(1));
    B.fill(c, A, K.white, { straight: true });
    B.clip(c, A, () => {
      const ix = 62 * s + gz[0], iy = gz[1];
      const ir = fierce ? 12 : 15; B.disc(c, ix, iy, ir, K.irisL); B.disc(c, ix, iy, ir * .8, K.iris); B.disc(c, ix, iy, ir * .43, ink);
      B.ring(c, ix, iy, ir, ir, { w: 2, heavy: 0 });
      B.fill(c, B.tr(up, 0, 7).concat(up.slice().reverse()), K.lidS);
      B.disc(c, ix - 5, iy - 5, 3.6, '#FFFFFF'); B.disc(c, ix + 5, iy + 4, 1.6, 'rgba(255,255,255,.8)');
    });
    S([[22 * s, 5], [34 * s, -9], [56 * s, -16], [78 * s, -13], [98 * s, -3], [110 * s, -10]], 7.5, { a: .2, b: .15, wf: u => .6 + u * .7 });
    S([[38 * s, -23], [60 * s, -29], [86 * s, -22]], 2.4, { a: .3, b: .4 });
    for (const [x, y, dx, dy] of [[90, -6, 10, -8], [98, -4, 12, -4], [82, -10, 6, -10]]) S([[x * s, y], [(x + dx) * s, y + dy]], 2.4, { a: .1, b: .8 });
    S([[30 * s, 6], [50 * s, 14], [72 * s, 14], [92 * s, 4]], 3.2, { col: '#2A1E44', a: .5, b: .2 });
    S([[42 * s, 12], [60 * s, 16], [80 * s, 11], [95 * s, 2]], 2.8, { a: .4, b: .2 });
    S([[48 * s, 26], [66 * s, 28], [82 * s, 22]], 1.6, { a: .4, b: .4, col: s > 0 ? ink : K.skinS });
  }
  // brows: the near one drawn down, the far one up (a knowing look)
  const brL = fierce ? [[-12, -14], [-40, -30], [-74, -44], [-104, -50], [-120, -46]] : [[-16, -24], [-44, -40], [-76, -49], [-102, -45], [-118, -34]];
  const brR = fierce ? B.mir(brL) : [[16, -30], [44, -50], [74, -61], [102, -56], [118, -43]];
  if (fierce) { S([[-8, -34], [-5, -14]], 2.6, { a: .3, b: .4 }); S([[8, -34], [5, -14]], 2.6, { a: .3, b: .4 }); S([[0, -40], [0, -26]], 2, { a: .3, b: .4 }); }
  S(brL, 17, { a: .04, b: .75, pa: .25, skew: .25 }); S(brR, 17, { a: .04, b: .75, pa: .25, skew: .25 });
  for (const [br, sg] of [[brL, -1], [brR, 1]]) { const Q = B.curve(br, false, 2); for (let i = 6; i < Q.length * .7; i += 7) { const [x, y] = Q[i]; S([[x, y + 5], [x + sg * 9, y - 7]], 2, { a: .1, b: .7 }); } }
  S([[-24, -26], [-30, -40]], 2.2, { a: .2, b: .5 }); S([[24, -32], [32, -46]], 2.2, { a: .2, b: .5 });
  // nose
  S([[8, -8], [12, 30], [19, 64]], 3, { a: .5, b: .3 });
  S([[-14, 80], [-26, 84], [-31, 94], [-22, 103]], 4, { a: .25, b: .3 });
  S([[14, 80], [28, 84], [32, 95], [22, 104]], 5.2, { a: .25, b: .3 });
  B.oval(c, -11, 99, 6.5, 3.6, ink, -.25); B.oval(c, 11, 99, 6.5, 3.6, ink, .25);
  S([[-8, 105], [0, 107], [8, 105]], 2.2, { a: .3, b: .3 });
  // mouth: a half-smile pulled up on his left
  if (fierce) {
    // a battle cry: the mouth open, the teeth set
    const M = [[-42, 138], [-22, 131], [0, 134], [22, 131], [42, 138], [30, 158], [0, 166], [-30, 158]];
    B.fill(c, M, '#22121E');
    B.clip(c, M, () => { B.fill(c, [[-34, 130], [34, 130], [30, 142], [0, 145], [-30, 142]], '#F2EEF6'); B.fill(c, [[-26, 166], [26, 166], [22, 156], [0, 152], [-22, 156]], '#E6DEF0'); B.fill(c, [[-18, 150], [18, 150], [12, 160], [-12, 160]], '#7A3048'); });
    B.stroke(c, M, { closed: true, w: 4.2, jit: .2 });
    S([[-28, 128], [0, 124], [28, 128]], 3.4, { col: K.lipS, a: .3, b: .3 });
    S([[-50, 118], [-46, 134], [-48, 148]], 2.6, { a: .3, b: .4 }); S([[50, 118], [46, 134], [48, 148]], 2.6, { a: .3, b: .4 });
  } else {
    const UL = [[-46, 143], [-30, 133], [-12, 127], [0, 131], [12, 127], [30, 128], [49, 131], [28, 138], [0, 142], [-24, 141]];
    const LL = [[-40, 144], [-24, 141], [0, 142], [28, 138], [46, 134], [34, 151], [14, 161], [0, 163], [-16, 161], [-32, 153]];
    B.fill(c, LL, K.lip); B.fill(c, UL, K.lipS);
    B.fill(c, [[-16, 150], [0, 152], [18, 148], [8, 157], [-8, 157]], K.lipH);
    S([[-48, 143], [-24, 141], [-8, 143], [0, 142], [10, 142], [28, 138], [50, 131], [56, 126]], 6, { a: .12, b: .12 });
    S([[-30, 133], [-12, 127], [0, 131], [12, 127], [30, 128]], 1.8, { col: K.lipS, a: .2, b: .2 });
  }
  S([[-12, 168], [0, 170], [12, 168]], 2.4, { a: .3, b: .3 });
  S([[58, 120], [61, 132], [58, 142]], 2.6, { a: .3, b: .4 });
  S([[-34, 104], [-42, 122], [-47, 136]], 2.2, { a: .5, b: .5 });
  S([[36, 100], [48, 117], [55, 128]], 2.6, { a: .5, b: .5 });
  S([[-2, 190], [0, 201]], 2.2, { a: .4, b: .4 });
  S([[106, 26], [98, 60], [91, 86]], 2.2, { a: .4, b: .4 });
}

function biEarring(c, s) {
  const B = BI, K = BK, x = 148 * s, y = 112, r = 31;
  B.stroke(c, [[134 * s, 62], [140 * s, 72], [146 * s, 82]], { w: 5, col: K.goldS, a: .1, b: .1 });
  B.disc(c, x, y, r, K.gold);
  B.clip(c, B.circ(x, y, r), () => {
    B.disc(c, x + 12, y + 12, r, K.goldS);
    B.disc(c, x + 26, y + 24, r, K.goldD);
  });
  B.ring(c, x, y, r, r, { w: 4, heavy: 1.2 });
  B.ring(c, x, y, r * .62, r * .62, { w: 2.2, heavy: .5 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * B.TAU; B.stroke(c, [[x + Math.cos(a) * r * .66, y + Math.sin(a) * r * .66], [x + Math.cos(a) * r * .92, y + Math.sin(a) * r * .92]], { w: 1.8, a: .3, b: .3, jit: 0 }); }
  B.disc(c, x, y, 9, K.red); B.disc(c, x - 3, y - 3, 3, K.redH); B.ring(c, x, y, 9, 9, { w: 1.8, heavy: .3 });
  const Q = []; for (let k = 0; k <= 10; k++) { const a = Math.PI * (1.05 + k / 10 * .5); Q.push([x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8]); }
  B.stroke(c, Q, { w: 4, col: K.goldH, a: .3, b: .4 });
}

function biNecklaces(c) {
  const B = BI, K = BK;
  const along = (P, gap, fn) => { const S = B.curve(P, false, 1); let acc = 0, k = 0; for (let i = 1; i < S.length; i++) { acc += Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]); if (acc >= gap) { acc = 0; fn(S[i][0], S[i][1], k++); } } };
  const bead = (x, y, r, col, sh) => { B.disc(c, x, y, r, col); B.disc(c, x + r * .3, y + r * .3, r * .7, sh); B.ring(c, x, y, r, r, { w: 1.7, heavy: .8 }); B.disc(c, x - r * .35, y - r * .35, r * .3, '#FFF3C8'); };
  // a long chain with the Kaustubha jewel
  const ch = [[-90, 330], [-74, 402], [-38, 448], [0, 462], [38, 448], [74, 402], [90, 330]];
  along(ch, 11, (x, y, k) => k % 2 ? bead(x, y, 4.2, K.red, '#8E1F1C') : bead(x, y, 5, K.gold, K.goldS));
  const kx = 0, ky = 486;
  B.oval(c, kx, ky, 20, 24, K.gold); B.oval(c, kx + 5, ky + 6, 16, 19, K.goldS); B.ring(c, kx, ky, 20, 24, { w: 2.6 });
  B.oval(c, kx, ky, 11, 14, K.red); B.oval(c, kx - 3, ky - 5, 4, 5, K.redH); B.ring(c, kx, ky, 11, 14, { w: 1.8, heavy: .4 });
  B.disc(c, kx, ky + 34, 6, '#F4F0FF'); B.ring(c, kx, ky + 34, 6, 6, { w: 1.6, heavy: .5 });
  // the collar of gold beads
  along([[-82, 318], [-42, 344], [0, 352], [42, 344], [82, 318]], 13, (x, y) => bead(x, y, 6.2, K.gold, K.goldS));
}

function biShawl(c) {
  const B = BI, K = BK, ink = B.ink, S = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  const C = [[74, 318], [150, 326], [252, 342], [354, 384], [432, 450], [478, 540], [494, 780], [170, 780], [118, 640], [94, 556], [98, 480], [112, 412], [96, 360]];
  B.fill(c, C, K.saf);
  B.clip(c, C, () => {
    // folds fall from the shoulder in S-curves; each has a shadow beside it, black in the deepest crease, and the
    // weave drawn as grain lines that follow the drape
    const folds = [
      [[150, 330], [162, 400], [150, 480], [138, 560], [150, 660], [178, 790]],
      [[212, 338], [224, 420], [216, 500], [200, 590], [206, 690], [222, 790]],
      [[282, 352], [298, 430], [294, 520], [276, 610], [280, 700], [292, 790]],
      [[350, 384], [372, 460], [370, 550], [352, 640], [358, 790]],
      [[420, 446], [442, 520], [438, 620], [432, 790]],
    ];
    const r = B.rnd(17);
    folds.forEach((f, i) => {
      const Sx = B.curve(f, false, 3), n = Sx.length;
      const sh = Sx.map(([x, y], k) => { const u = k / (n - 1); return [x + 14 + 26 * Math.sin(u * Math.PI * (1.2 + i * .2) + i), y + 4]; });
      B.fill(c, Sx.concat(sh.reverse()), K.safS, { straight: true });
      const dk = Sx.map(([x, y], k) => { const u = k / (n - 1); return [x + Math.max(0, 6 * Math.sin(u * Math.PI * 1.4 + i * .7)), y + 3]; });
      B.fill(c, Sx.concat(dk.reverse()), K.safD, { straight: true });
      S(f, 4.4, { a: .12, b: .05, seed: i });
      S(f.map(([x, y]) => [x - 14, y + 10]), 3.6, { a: .45, b: .35, col: K.safH, seed: i + 19 });
      for (let k = 0; k < 5; k++) {
        const off = 30 + k * 7 + r() * 4, u0 = r() * .3, u1 = .5 + r() * .5;
        const g = Sx.slice(Math.floor(u0 * n), Math.floor(u1 * n)).map(([x, y], j) => [x + off + Math.sin(j * .12 + k) * 3, y + k * 4]);
        if (g.length > 3) B.stroke(c, g, { w: 1.1 + r() * .6, a: .3, b: .4, jit: .3, seed: i * 9 + k, col: k % 3 === 1 ? B.ink : K.safD });
      }
    });
    // the shoulder turns away: shade and a black edge
    B.fill(c, [[354, 384], [432, 450], [478, 540], [494, 790], [462, 790], [456, 560], [420, 480], [360, 420]], K.safS);
    B.fill(c, [[446, 470], [478, 540], [494, 790], [482, 790], [472, 570]], '#1B0E10');
    // the hair's shadow falling on the cloth
    B.fill(c, [[180, 330], [240, 340], [250, 400], [242, 470], [222, 470], [196, 400]], K.safS);
    S([[104, 336], [190, 342], [280, 356], [350, 392], [410, 436]], 5, { col: K.safH, a: .3, b: .5 });
    B.spatter(c, 470, 720, 40, 26, { s: 2.2, seed: 5 });
  });
  // a gold border along the falling edge
  const edge = [[96, 360], [112, 412], [98, 480], [94, 556], [118, 640], [170, 780]];
  const E2 = edge.map(([x, y]) => [x + 22, y]);
  B.fill(c, B.curve(edge, false, 2).concat(B.curve(E2, false, 2).reverse()), K.gold, { straight: true });
  B.clip(c, B.pathL(B.curve(edge, false, 2).concat(B.curve(E2, false, 2).reverse())), () => {
    S(E2.map(([x, y]) => [x - 5, y]), 7, { col: K.goldS, a: 0, b: 0 });
  });
  S(E2, 2.6, { a: .05, b: .05 });
  const ES = B.curve(edge, false, 1); for (let i = 10; i < ES.length - 10; i += 22) { const [x, y] = ES[i]; B.disc(c, x + 11, y, 3.6, K.red); B.ring(c, x + 11, y, 3.6, 3.6, { w: 1.3, heavy: 0 }); }
  B.outline(c, C, { w: 4.8, heavy: 1.3 });
}

function biFeather(c) {
  // a peacock feather tucked in the crown, standing out to our right against the halo
  const B = BI, ex = 168, ey = -398, ang = .5;
  const stem = [[64, -196], [100, -270], [134, -330], [160, -390]];
  c.save(); c.translate(ex, ey); c.rotate(ang); c.scale(1.25, 1.25);
  // the barbs: bronze-green fringe round the eye
  const r = B.rnd(41);
  for (let i = 0; i < 70; i++) {
    const a = (i / 70) * B.TAU, rr = 60 + r() * 14, w = 1.6;
    const x1 = Math.cos(a) * rr * .72, y1 = Math.sin(a) * rr;
    B.stroke(c, [[0, 30], [x1 * .6, y1 * .6 + 12], [x1, y1]], { w, col: i % 3 ? '#7E9A2E' : '#B9A440', a: .1, b: .5, jit: 0 });
  }
  B.oval(c, 0, 0, 30, 42, '#C6B43C'); B.oval(c, 0, 4, 24, 34, '#2E9A62'); B.oval(c, 0, 8, 17, 25, '#2C63C0'); B.oval(c, 0, 10, 10, 15, '#14205E');
  B.oval(c, -3, 2, 3.6, 6, '#7FE0E6');
  B.ring(c, 0, 0, 30, 42, { w: 2.2, heavy: .6 }); B.ring(c, 0, 10, 10, 15, { w: 1.4, heavy: 0 });
  c.restore();
  B.stroke(c, stem, { w: 4, col: '#E8D9A0', a: .05, b: .4 }); B.stroke(c, stem.map(([x, y]) => [x + 2, y + 1]), { w: 1.4, a: .1, b: .5 });
}

function biCrown(c) {
  const B = BI, K = BK, ink = B.ink, S = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  const panel = (P, shade, seed) => {
    const cxp = P.reduce((s, p) => s + p[0], 0) / P.length, cyp = P.reduce((s, p) => s + p[1], 0) / P.length;
    B.fill(c, P, shade > .6 ? K.goldS : K.gold);
    B.clip(c, P, () => {
      // the shade side (light from the upper left), spotted black on the far right
      c.fillStyle = shade > .6 ? K.goldD : K.goldS; c.fillRect(cxp + 6 - shade * 30, -500, 400, 600);
      if (shade > .5) { c.fillStyle = ink; c.fillRect(cxp + 30 - shade * 30, -500, 400, 600); }
      const Q = P.map(([x, y]) => [cxp + (x - cxp) * .68, cyp + (y - cyp) * .72 + 6]);
      B.stroke(c, Q, { closed: true, w: 2.4, jit: .15 });
      // repeated leaves up the vein
      const top = Math.min(...P.map(p => p[1])), bot = Math.max(...P.map(p => p[1]));
      for (let y = bot - 58; y > top + 34; y -= 15) { const hw = 12; S([[cxp - hw, y + 6], [cxp, y - 4], [cxp + hw, y + 6]], 2, { a: .25, b: .25, seed: y }); }
      S([[cxp, bot - 52], [cxp, top + 30]], 1.8, { a: .2, b: .2, seed });
      B.stroke(c, [[P[1][0] + 7, P[1][1]], [P[2][0] + 7, P[2][1] + 4], [P[3][0] + 6, P[3][1] + 8]], { w: 4, col: K.goldH, a: .3, b: .5 });
      // a beaded border between the outline and the inner line
      const Qb = P.map(([x, y]) => [cxp + (x - cxp) * .84, cyp + (y - cyp) * .86 + 3]), QS = B.curve(Qb, true, 2);
      for (let i = 0; i < QS.length; i += 6) { const [x, y] = QS[i]; B.disc(c, x, y, 2.6, x > cxp + 6 - shade * 30 ? K.goldD : K.goldH); }
      // a jewel low in the panel
      const gy = bot - 34, gc = seed % 2 ? K.green : K.red;
      B.fill(c, [[cxp, gy - 15], [cxp + 9, gy], [cxp, gy + 12], [cxp - 9, gy]], gc, { straight: true });
      B.stroke(c, [[cxp, gy - 15], [cxp + 9, gy], [cxp, gy + 12], [cxp - 9, gy]], { closed: true, w: 2, jit: 0 });
      B.disc(c, cxp - 2.5, gy - 4, 2.2, 'rgba(255,255,255,.75)');
    });
    B.outline(c, P, { w: 3.6, heavy: 1.2, seed });
  };
  const outer = [[98, -160], [112, -212], [134, -252], [152, -256], [163, -224], [153, -182], [138, -156]];
  const inner = [[28, -164], [42, -230], [60, -292], [84, -322], [106, -304], [114, -252], [108, -192], [102, -164]];
  const centre = [[-42, -164], [-50, -232], [-42, -302], [-22, -346], [0, -364], [22, -346], [42, -302], [50, -232], [42, -164]];
  panel(B.mir(outer), .1, 1); panel(outer, .9, 2);
  panel(B.mir(inner), .15, 3); panel(inner, .7, 4);
  panel(centre, .35, 5);
  // the finial
  B.disc(c, 0, -376, 15, K.gold); B.clip(c, B.circ(0, -376, 15), () => B.disc(c, 7, -370, 14, K.goldS));
  B.ring(c, 0, -376, 15, 15, { w: 2.6 });
  B.fill(c, [[-7, -388], [0, -432], [7, -388]], K.gold, { straight: true });
  B.stroke(c, [[-7, -388], [0, -432], [7, -388]], { w: 2.4, a: .1, b: .1 });
  B.disc(c, 0, -438, 5, K.gold); B.ring(c, 0, -438, 5, 5, { w: 1.8 });
  // the band over the brow
  const top = [[-134, -158], [-60, -170], [0, -173], [60, -170], [134, -158]], bot = [[134, -124], [60, -137], [0, -140], [-60, -137], [-134, -124]];
  const band = B.curve(top, false, 2).concat(B.curve(bot, false, 2));
  B.fill(c, band, K.gold, { straight: true });
  B.clip(c, B.pathL(band), () => { c.fillStyle = K.goldS; c.fillRect(40, -200, 200, 100); c.fillStyle = K.goldD; c.fillRect(104, -200, 200, 100); B.stroke(c, top.map(([x, y]) => [x, y + 5]), { w: 3, col: K.goldH, a: .1, b: .5 }); });
  B.stroke(c, band, { closed: true, w: 3.8, jit: .15, wf: (u, x) => .7 + Math.max(0, x / 140) * .8 });
  for (let i = -4; i <= 4; i++) {
    const x = i * 28, y = -149 + Math.abs(i) * Math.abs(i) * .6;
    const col = i % 2 ? K.green : K.red;
    B.oval(c, x, y, 7, 9, col); B.oval(c, x - 2, y - 3, 2.4, 3, 'rgba(255,255,255,.7)'); B.ring(c, x, y, 7, 9, { w: 1.8, heavy: .4 });
  }
}


function biHand(c) {
  // his right hand, palm to us: the forefinger crooked up to his chin, the others curled loose, rings on three fingers
  const B = BI, K = BK, S = (P, w, e = {}) => B.stroke(c, P, { w, ...e });
  const pose = { view: 'palm', ang: .3, k: 3.05, f: { t: [36, 16, 24, 18], i: [6, 4, 22, 16], m: [0, 46, 64, 38], r: [4, 56, 68, 38], p: [9, 64, 68, 36] }, rings: { i: 0, m: 0, r: 0 }, pal: K };
  const tip = biHandRig(c, { ...pose, x: 0, y: 0, dry: true }).tip('i'), x = -36 - tip[0], y = 224 - tip[1];
  // the forearm, down out of the panel
  const ax = Math.sin(pose.ang), ay = -Math.cos(pose.ang), nx = -ay, ny = ax;
  const arm = [[x + nx * 34 - ax * 6, y + ny * 34 - ay * 6], [x + nx * 52 - ax * 420, y + ny * 52 - ay * 420], [x - nx * 52 - ax * 420, y - ny * 52 - ay * 420], [x - nx * 34 - ax * 6, y - ny * 34 - ay * 6]];
  B.fill(c, arm, K.skin);
  B.clip(c, arm, () => { B.fill(c, arm.map(([px, py]) => [px + nx * 30, py + ny * 30]), K.skinS); B.feather(c, [[x - ax * 60, y - ay * 60], [x - ax * 300, y - ay * 300]].map(([px, py]) => [px + nx * 6, py + ny * 6]), { n: 9, len: 16, side: 1, w: 1.8, seed: 3 }); });
  S([arm[0], arm[1]], 4, { a: .05, b: .05 }); S([arm[3], arm[2]], 5.5, { a: .05, b: .05 });
  // a gold kada at the wrist
  const kd = t => [[x + nx * 38 - ax * t, y + ny * 38 - ay * t], [x - nx * 38 - ax * t, y - ny * 38 - ay * t]];
  const kp = [...kd(10), ...kd(38).reverse()];
  B.fill(c, kp, K.gold); B.clip(c, kp, () => { B.fill(c, [...kd(10), ...kd(38).reverse()].map(([px, py], q) => q === 0 || q === 3 ? [px - nx * 40, py - ny * 40] : [px, py]), K.goldS); S(kd(18), 3, { col: K.goldH, a: .2, b: .5 }); });
  B.outline(c, kp, { w: 3.2, heavy: 1 });
  for (let q = 0; q < 6; q++) { const u = -.7 + q * .28; B.disc(c, x + nx * 38 * u - ax * 30, y + ny * 38 * u - ay * 30, 2.6, K.goldD); }
  biHandRig(c, { ...pose, x, y });
}
