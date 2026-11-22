// po_dasha_frame.js: the Dashavatar book's page furniture in the Pothi style with Pichwai/Tanjore richness (needs
// pothi.js, po_dashavatar.js, po_dasha_gods.js).
//   pdPageFrame(c, x0, y0, x1, y1, o): the page border round the trim box (x0, y0)-(x1, y1): a deep indigo band, bled
//     out past the trim, with a gold lotus vine running round it, lotus rosettes at the corners, fine gold rules and a
//     thin line in the chapter's accent colour inside. o.bw band width (units), o.bleed, o.accent (a colour),
//     o.wilt (0 fresh .. 1 wilted: the vine droops, the gold dulls, the flowers close and fall), o.bloom (0..1: the
//     flowers open wide and glow), o.seed
//   pdMedallion(c, x, y, r, icon, o): a Tanjore gold roundel (a ring of gold petals, pearls, a jewelled rim) round a
//     deep field with an icon: 'fish' 'tortoise' 'boar' 'lion' 'vamana' 'axe' 'bow' 'flute' 'buddha' 'horse' (the ten),
//     'shankha' 'chakra' 'gada' 'padma' (Vishnu's four); o.field the field colour, o.glow
//   pdBanner(c, x, y, w, h, o): a gold scroll for a verse, its ends rolled; o.field (cream by default)
//   pdWisdomBox(c, x, y, w, h, o): a framed box with lotus corners for the "Dharma wisdom" verses
//   pdGoldenLotus(c, x, y, r, o): a vast golden lotus opening on the water, seen from the side (o.open 0..1)
//   pdNightSky(c, x0, y0, x1, y1, o): a Pichwai indigo night, deepest at the top, with stars (o.seed, o.stars, o.dawn)
//   pdMilkOcean(c, x0, y0, x1, y1, o): the Ocean of Milk: pearl water glowing from within, rows of scalloped waves in
//     cream and gold (o.t phase)
//   pdCloud(c, x, y, w, seed, a, col, shc): a Pothi cloud, round lobes on a flat base
const PFR = {
  indigo: '#1C2150', indigoLt: '#2C3470', indigoDk: '#10142E',
  gold: PDX.gold, dull: { base: '#9C8452', lt: '#BCA672', dk: '#6A5630' },
  lotus: { base: '#C2506A', lt: '#E888A0', dk: '#7E2440' }
};
const pfMixPal = (a, b, t) => ({ base: lerpCol(a.base, b.base, t), lt: lerpCol(a.lt, b.lt, t), dk: lerpCol(a.dk, b.dk, t) });
function lerpCol(a, b, t) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), A = h(a), B = h(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

// ---------- the page border ----------
function pdPageFrame(c, x0, y0, x1, y1, o = {}) {
  const bw = o.bw ?? 64, bl = o.bleed ?? 40, wilt = o.wilt || 0, bloom = o.bloom || 0;
  const G = pfMixPal(PFR.gold, PFR.dull, wilt), L = pfMixPal(PFR.lotus, { base: '#8E6A5A', lt: '#A88878', dk: '#5A4036' }, wilt), R = lcg(o.seed || 7);
  // the band: everything from the bleed to bw inside the trim
  const band = new Path2D(); band.rect(x0 - bl, y0 - bl, x1 - x0 + bl * 2, y1 - y0 + bl * 2); band.rect(x0 + bw, y0 + bw, x1 - x0 - bw * 2, y1 - y0 - bw * 2);
  c.save(); c.fillStyle = PFR.indigo; c.fill(band, 'evenodd');
  c.clip(band, 'evenodd');
  // a soft Pichwai mottling in the indigo
  for (let i = 0; i < 40; i++) { const px = lerp(x0, x1, R()), py = lerp(y0, y1, R()); glow(c, px, py, 60 + R() * 80, PFR.indigoLt, .25, 'source-over'); }
  c.restore();
  // rules: gold along the outer and inner edges of the band, the accent inside
  const rule = (ins, w, col) => { c.save(); c.strokeStyle = col; c.lineWidth = w; c.strokeRect(x0 + ins, y0 + ins, x1 - x0 - ins * 2, y1 - y0 - ins * 2); c.restore(); };
  rule(bw * .1, 3, G.base); rule(bw * .16, 1.2, rgba(G.lt, .7));
  rule(bw, 5, G.base); rule(bw + 4, 1.4, G.dk);
  if (o.accent) rule(bw + 11, 4, o.accent);
  // the vine on the band's centre line, edge by edge (corner rosettes between)
  const m = bw * .55, cr = bw * .42;
  const edges = [[[x0 + m, y0 + m], [x1 - m, y0 + m]], [[x1 - m, y0 + m], [x1 - m, y1 - m]], [[x1 - m, y1 - m], [x0 + m, y1 - m]], [[x0 + m, y1 - m], [x0 + m, y0 + m]]];
  for (const [[ax, ay], [bx, by]] of edges) {
    const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, nx = -uy, ny = ux;
    const s0 = cr * 1.5, s1 = len - cr * 1.5, wl = bw * 1.6, n = Math.max(2, Math.round((s1 - s0) / wl)), step = (s1 - s0) / n, amp = bw * .2;
    // gravity for a wilted vine: sag toward +y on every edge
    const at = (s, k = 1) => { const ph = (s - s0) / step * Math.PI, w = Math.sin(ph) * amp * k; return [ax + ux * s + nx * w, ay + uy * s + ny * w + wilt * bw * .12 * Math.sin((s - s0) / (s1 - s0) * Math.PI)]; };
    const stem = []; for (let s = s0; s <= s1 + .1; s += 6) stem.push(at(s));
    poLine(c, stem, G.dk, 4.4); poLine(c, stem, G.base, 2.8); poLine(c, stem.map(([x, y]) => [x - .6, y - .6]), rgba(G.lt, .7), .9);
    for (let i = 0; i < n; i++) {
      const sp = s0 + (i + .5) * step, [px, py] = at(sp), side = i % 2 ? 1 : -1, ang = Math.atan2(uy, ux);
      // a curling tendril with a leaf, and a flower or bud at each crest
      const fx = px + nx * side * amp * 1.1, fy = py + ny * side * amp * 1.1 + wilt * 10;
      const droop = wilt * 1.1 * (ny * side > 0 ? 0 : 1);
      c.save(); c.translate(px, py); c.rotate(ang + side * (Math.PI / 2 - .5) + droop * side);
      poFill(c, [[0, 0, 1], [bw * .1, -bw * .08], [bw * .3, -bw * .06], [bw * .38, 0, 1], [bw * .3, bw * .06], [bw * .1, bw * .08]], G.base, { sh: [0, 2, 2, rgba(G.dk, .9)], hi: [0, -1.5, 1.5, rgba(G.lt, .9)] });
      c.restore();
      if (i % 2 === 0) {
        const r = bw * (.17 + .05 * bloom) * (1 - wilt * .25);
        if (bloom) glow(c, fx, fy, r * 3.4, '#FFE6A0', .5 * bloom, 'source-over');
        c.save(); c.translate(fx, fy); c.rotate(wilt * side * .9);
        // a small lotus in profile, pink with gold edges; closed and drooping when wilted
        const op = Math.max(.15, .75 + .25 * bloom - wilt * .7);
        for (let k = -2; k <= 2; k++) { c.save(); c.rotate(k * .36 * op); poFill(c, [[0, 0, 1], [-r * .32, -r * .5], [0, -r * 1.1, 1], [r * .32, -r * .5]], L.base, { sh: [r * .1, 0, r * .12, rgba(L.dk, .8)], hi: [-r * .08, -r * .1, r * .1, rgba(L.lt, .9)] }); c.restore(); }
        poLine(c, [[-r * .6 * op, -r * .06], [0, r * .14], [r * .6 * op, -r * .06]], G.base, 2.2);
        c.restore();
        if (wilt > .5 && R() < .6) { const qx = fx + (R() - .5) * bw * .6, qy = fy + bw * .3; c.save(); c.translate(qx, qy); c.rotate(R() * 3); poFill(c, [[0, 0, 1], [-4, -6], [0, -12, 1], [4, -6]], L.base, { alpha: .8 }); c.restore(); }
      } else {
        poDots(c, [[fx, fy]], 3.4, 10, G.base);
        ellipse(c, fx, fy, 2.2, 2.2, PDX.ruby);
      }
    }
  }
  // corner rosettes: a gold lotus seen from above, a ruby at the heart
  for (const [cx, cy] of [[x0 + m, y0 + m], [x1 - m, y0 + m], [x1 - m, y1 - m], [x0 + m, y1 - m]]) {
    if (bloom) glow(c, cx, cy, cr * 2.6, '#FFE6A0', .5 * bloom, 'source-over');
    c.save(); c.translate(cx, cy);
    for (let k = 0; k < 8; k++) { c.save(); c.rotate(k / 8 * TAU + Math.PI / 8); poFill(c, [[0, 0, 1], [-cr * .26, -cr * .5], [0, -cr * (1 - wilt * .25), 1], [cr * .26, -cr * .5]], G.base, { sh: [cr * .06, 0, cr * .08, rgba(G.dk, .85)], hi: [-cr * .04, -cr * .06, cr * .06, rgba(G.lt, .9)] }); c.restore(); }
    for (let k = 0; k < 8; k++) { c.save(); c.rotate(k / 8 * TAU); poFill(c, [[0, 0, 1], [-cr * .2, -cr * .36], [0, -cr * .68, 1], [cr * .2, -cr * .36]], L.base, { sh: [cr * .05, 0, cr * .06, rgba(L.dk, .8)], hi: [-cr * .03, -cr * .05, cr * .05, rgba(L.lt, .9)] }); c.restore(); }
    ellipse(c, 0, 0, cr * .26, cr * .26, G.base); pdGem(c, 0, 0, cr * .14, PDX.ruby);
    c.restore();
  }
}

// ---------- medallions ----------
function pdMedallion(c, x, y, r, icon, o = {}) {
  const G = PFR.gold;
  c.save(); c.translate(x, y);
  if (o.glow) glow(c, 0, 0, r * 2.2, '#FFE6A0', .5 * o.glow, 'source-over');
  // a ring of gold lotus petals
  const n = 16;
  for (let k = 0; k < n; k++) { c.save(); c.rotate(k / n * TAU); poFill(c, [[-r * .16, -r * .9], [-r * .12, -r * 1.06], [0, -r * 1.24, 1], [r * .12, -r * 1.06], [r * .16, -r * .9]], G.base, { sh: [r * .03, 0, r * .04, rgba(G.dk, .85)], hi: [-r * .02, -r * .03, r * .03, rgba(G.lt, .9)] }); c.restore(); }
  // the rim: gold, pearls, a fine dark line
  ellipse(c, 0, 0, r, r, G.dk); ellipse(c, 0, 0, r * .97, r * .97, G.base);
  poDots(c, Array.from({ length: 41 }, (_, i) => [Math.cos(i / 40 * TAU) * r * .88, Math.sin(i / 40 * TAU) * r * .88]), r * .035, r * .14, PDX.pearl, false);
  ellipse(c, 0, 0, r * .8, r * .8, G.dk);
  // the field, a soft light behind the icon
  const field = o.field || PFR.indigo;
  ellipse(c, 0, 0, r * .78, r * .78, field);
  c.save(); const cp = new Path2D(); cp.arc(0, 0, r * .78, 0, TAU); c.clip(cp);
  glow(c, 0, -r * .1, r * .9, o.fieldGlow || '#3E4A9A', .7, 'source-over');
  c.scale(r / 100, r / 100);
  pdIcon(c, icon, o);
  c.restore();
  c.restore();
}
// an icon in a 140-unit box about (0, 0): gold (or white for the horse) with soft shading
function pdIcon(c, icon, o = {}) {
  const G = PFR.gold, gd = { sh: [3, 4, 5, rgba(G.dk, .9)], hi: [-2, -3, 3, rgba(G.lt, .95)] };
  const W = { base: '#F4EEE2', lt: '#FFFFFF', dk: '#B8B0C4' }, wd = { sh: [3, 4, 5, rgba(W.dk, .9)], hi: [-2, -3, 3, rgba(W.lt, .95)] };
  const eye = (x, y, r = 3) => { ellipse(c, x, y, r, r, PFR.indigoDk); ellipse(c, x - r * .3, y - r * .3, r * .3, r * .3, '#FFF'); };
  if (icon === 'fish') {
    // Matsya: a great fish leaping, with his horn
    c.save(); c.rotate(-.2);
    poFill(c, [[-56, 0], [-40, -18], [-6, -28], [30, -22], [52, -8], [60, 4], [50, 14], [24, 22], [-10, 22], [-40, 14]], G.base, { ...gd, inside: () => { for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) poLine(c, [[-30 + i * 12, -12 + j * 10], [-24 + i * 12, -8 + j * 10], [-30 + i * 12, -4 + j * 10]], rgba(G.dk, .6), 1.2); } });
    poFill(c, [[-52, 0], [-80, -24], [-74, 0], [-80, 24]], G.base, gd);
    poFill(c, [[-6, -26], [6, -44], [14, -24]], G.base, gd); poFill(c, [[0, 20], [10, 34], [16, 20]], G.base, gd);
    poFill(c, [[34, -20], [40, -46, 1], [44, -18]], G.lt, gd);
    eye(40, -6, 3.6); poLine(c, [[54, 8], [60, 6]], rgba(G.dk, .8), 1.6);
    c.restore();
    for (let i = 0; i < 3; i++) poLine(c, [[-60 + i * 50, 48], [-46 + i * 50, 42], [-32 + i * 50, 48]], rgba('#9AB4D8', .8), 2.4);
  } else if (icon === 'tortoise') {
    // Kurma: a tortoise, the shell domed, a little mountain on its back
    poFill(c, [[-26, -52], [-8, -76], [6, -66], [18, -82], [30, -50]], '#8E8AA6', { sh: [3, 3, 4, 'rgba(50,46,70,.8)'], hi: [-2, -2, 3, 'rgba(200,196,220,.8)'] });
    poFill(c, [[-58, 10], [-50, -24], [-24, -46], [10, -50], [42, -34], [58, 0], [44, 14], [-44, 16]], G.base, { ...gd, inside: () => { for (const [cx, cy] of [[-24, -18], [4, -26], [30, -14], [-8, 2], [20, 4]]) poLine(c, [[cx - 10, cy], [cx - 5, cy - 9], [cx + 5, cy - 9], [cx + 10, cy], [cx + 5, cy + 9], [cx - 5, cy + 9], [cx - 10, cy]], rgba(G.dk, .7), 1.6); } });
    poFill(c, [[52, -2], [70, -10], [84, -4], [80, 8], [60, 10]], G.base, gd); eye(74, -4, 2.6);
    for (const x of [-40, 30]) poFill(c, [[x - 8, 12], [x + 10, 12], [x + 12, 28], [x - 10, 28]], G.base, gd);
    poFill(c, [[-56, 6], [-72, 12], [-58, 14]], G.base, gd);
  } else if (icon === 'boar') {
    // Varaha: a boar's head and forequarters, the earth on its tusks
    poFill(c, [[-60, 40], [-56, 0], [-40, -30], [-10, -44], [20, -40], [44, -22], [66, -6], [74, 8], [60, 16], [40, 14], [20, 30], [-20, 44]], G.base, { ...gd, inside: () => { for (let i = 0; i < 8; i++) poLine(c, [[-40 + i * 8, -34 + i], [-34 + i * 8, -44 + i]], rgba(G.dk, .6), 1.4); } });
    poFill(c, [[0, -40], [-6, -60], [12, -46]], G.base, gd);
    eye(30, -16, 3.2);
    poFill(c, [[58, 8], [70, -4], [66, 12]], W.base, wd);
    c.save(); c.translate(70, -26); ellipse(c, 0, 0, 20, 20, '#3E7A9A'); poFill(c, [[-12, -8], [0, -16], [10, -6], [4, 6], [-10, 6]], '#5E9A5A'); poFill(c, [[6, 8], [14, 4], [14, 12]], '#5E9A5A'); c.restore();
  } else if (icon === 'lion') {
    // Narasimha: the lion face, the mane in flames, a crown
    for (let k = 0; k < 14; k++) { c.save(); c.rotate(k / 14 * TAU); poFill(c, [[-14, -34], [0, -66, 1], [14, -34]], '#C67A2E', { sh: [2, 0, 3, 'rgba(110,50,20,.8)'] }); c.restore(); }
    poFill(c, pfSym([[0, -40, 1], [24, -36], [36, -16], [36, 10], [26, 30], [12, 40], [0, 42, 1]]), G.base, gd);
    for (const s of [-1, 1]) { poLine(c, [[s * 6, -6], [s * 22, -12]], PFR.indigoDk, 3); eye(s * 15, -4, 3.6); }
    poFill(c, [[-10, 6], [10, 6], [8, 16], [-8, 16]], '#8E5A2E');
    poFill(c, [[-14, 22], [0, 30], [14, 22], [10, 32], [-10, 32]], '#7A2A2A'); for (const s of [-1, 1]) poFill(c, [[s * 8, 22], [s * 6, 30], [s * 4, 22]], W.base);
    poFill(c, [[-24, -36], [-22, -54], [-10, -46], [0, -60, 1], [10, -46], [22, -54], [24, -36]], G.lt, gd); pdGem(c, 0, -44, 3, PDX.ruby);
  } else if (icon === 'vamana') {
    // Vamana: the boy with his umbrella and water pot, walking
    poLine(c, [[-22, 60], [-20, -50]], '#7A5638', 4);
    poFill(c, [[-70, -40], [-56, -64], [-20, -78], [16, -64], [30, -40]], G.base, { ...gd, inside: () => { for (const x of [-56, -38, -20, -2, 16]) poLine(c, [[-20, -76], [x, -42]], rgba(G.dk, .6), 1.4); } });
    poDots(c, [[-70, -40], [-20, -38], [30, -40]], 2.4, 8, PDX.pearl, false);
    ellipse(c, 6, -14, 16, 16, G.base); poFill(c, [[-6, -28], [10, -34], [20, -26], [10, -22]], PFR.indigoDk);
    poFill(c, [[-8, 2], [18, 2], [24, 40], [-12, 40]], G.base, gd);
    poFill(c, [[-10, 38], [22, 38], [28, 60], [-14, 60]], W.base, wd);
    poFill(c, poLimb([[18, 10], [34, 26], [36, 44]], [10, 9, 8]), G.base, gd); ellipse(c, 38, 52, 10, 9, G.dk);
  } else if (icon === 'axe') {
    // Parashurama: the parashu
    c.save(); c.rotate(.5);
    poFill(c, poLimb([[0, 70], [0, -60]], [10, 10]), '#8A5E3A', { sh: [2, 0, 3, 'rgba(70,40,20,.8)'] });
    poFill(c, [[2, -60], [34, -84], [52, -60], [52, -20], [34, 0], [2, -20]], '#C8CCD8', { sh: [4, 3, 5, 'rgba(90,92,120,.9)'], hi: [-2, -2, 3, 'rgba(255,255,255,.9)'] });
    poLine(c, [[50, -60], [50, -20]], '#FFFFFF', 2);
    pfGoldBand(c, [[-8, -40], [10, -40]], 8); pfGoldBand(c, [[-8, 56], [10, 56]], 6);
    c.restore();
  } else if (icon === 'bow') {
    // Rama: the bow drawn with an arrow
    poLine(c, [[-20, -70], [14, -40], [26, 0], [14, 40], [-20, 70]], G.dk, 9); poLine(c, [[-20, -70], [14, -40], [26, 0], [14, 40], [-20, 70]], G.base, 6);
    poLine(c, [[-20, -70], [-44, 0], [-20, 70]], '#F2EEE2', 1.6);
    poLine(c, [[-46, 0], [66, 0]], '#9A7048', 3);
    poFill(c, [[60, -8], [80, 0, 1], [60, 8]], '#C8CCD8', { sh: [2, 2, 2, 'rgba(90,92,120,.9)'] });
    for (const s of [-1, 1]) poFill(c, [[-46, 0], [-58, s * 10], [-40, s * 2]], '#C0303C');
    pfGoldBand(c, [[18, -8], [30, -8], [30, 8], [18, 8]], 5);
  } else if (icon === 'flute') {
    // Krishna: the flute and a peacock feather
    c.save(); c.rotate(-.35);
    poFill(c, poLimb([[-74, 0], [74, 0]], [11, 11]), '#B88A48', { sh: [0, 3, 3, 'rgba(100,70,30,.9)'], hi: [0, -2, 2, 'rgba(240,210,150,.9)'] });
    for (const x of [-40, -24, -8, 8, 24]) ellipse(c, x, 0, 2.6, 2.2, '#3A2414');
    for (const x of [-60, 52]) pfGoldBand(c, [[x, -7], [x, 7]], 6);
    c.restore();
    c.save(); c.translate(20, -10); c.rotate(.5);
    poLine(c, [[0, 0], [-4, -70]], '#6A6040', 2);
    for (let i = 0; i < 12; i++) { const yy = -10 - i * 5.4, w = 4 + Math.sin(i / 11 * Math.PI) * 12; poLine(c, [[-1, yy], [-w, yy - 6]], 'rgba(96,150,110,.85)', 1.2); poLine(c, [[-1, yy], [w, yy - 6]], 'rgba(96,150,110,.85)', 1.2); }
    ellipse(c, -4, -64, 12, 15, '#3E8A72'); ellipse(c, -4, -62, 8, 10, '#D8A63A'); ellipse(c, -4, -60, 5, 6.4, '#2E5CA8'); ellipse(c, -4, -59, 2.6, 3.2, '#101A38');
    c.restore();
  } else if (icon === 'buddha') {
    // the Buddha: seated in meditation on a lotus, a soft halo
    glow(c, 0, -30, 50, '#FFF0C0', .5, 'source-over');
    pdLotusSeat(c, 0, 40, 130);
    poFill(c, [[-56, 40], [-50, 18], [-24, 8], [24, 8], [50, 18], [56, 40], [0, 46]], '#C87A3A', { sh: [3, 4, 5, 'rgba(110,50,20,.8)'], hi: [-2, -3, 3, 'rgba(240,170,110,.8)'] });
    poFill(c, pfSym([[0, -44, 1], [20, -40], [30, -20], [36, 10], [0, 14, 1]]), '#C87A3A', { sh: [3, 4, 5, 'rgba(110,50,20,.8)'], hi: [-2, -3, 3, 'rgba(240,170,110,.8)'] });
    poFill(c, pfSym([[0, -42, 1], [12, -42], [16, -36], [0, -34, 1]]), G.base);
    ellipse(c, 0, -60, 15, 17, G.base); ellipse(c, 0, -78, 7, 6, G.dk);
    for (const s of [-1, 1]) poLine(c, [[s * 3, -60], [s * 10, -58]], PFR.indigoDk, 1.6);
    poFill(c, [[-20, 18], [20, 18], [14, 26], [-14, 26]], G.base, gd);
  } else if (icon === 'horse') {
    // Kalki: a white horse galloping, its mane flying
    poFill(c, [[-56, -4], [-40, -20], [0, -22], [30, -26], [44, -48], [60, -60], [74, -54], [76, -44], [62, -38], [52, -20], [46, 6], [20, 14], [-30, 14], [-52, 10]], W.base, { ...wd, inside: () => pdFold(c, [[-40, 0], [20, 4]], 4, rgba(W.dk, .5), 3) });
    poFill(c, [[44, -48], [36, -60], [24, -50], [16, -40], [30, -38]], '#E0D8EA', wd);
    poFill(c, [[-54, -8], [-74, -14], [-84, 4], [-70, 8]], W.base, wd);
    for (const [hx, hy, kx, ky, fx, fy] of [[36, 8, 58, 18, 72, 6], [24, 10, 34, 30, 26, 46], [-34, 10, -50, 26, -66, 30], [-44, 8, -40, 30, -46, 46]]) poFill(c, poLimb([[hx, hy], [kx, ky], [fx, fy]], [12, 8, 6]), W.base, wd);
    eye(64, -50, 2.4);
    pfGoldBand(c, [[46, -44], [58, -34], [70, -40]], 4);
    poFill(c, [[-20, -22], [10, -24], [14, -16], [-22, -14]], PDX.maroon.base);
  } else if (icon === 'shankha') { pdShankha(c, 0, 0, -.3); c.scale(1.4, 1.4); }
  else if (icon === 'chakra') pdChakra(c, 0, 0, 56);
  else if (icon === 'gada') { c.save(); c.rotate(-.6); c.translate(0, -6); pdGada(c, 0, 0, 0, 96); c.restore(); }
  else if (icon === 'padma') { poLine(c, [[0, 70], [4, 20]], PO.leaf.dk, 5); poLotus(c, 0, 10, 54, 1, PFR.lotus); }
}

// ---------- verse banners ----------
function pdBanner(c, x, y, w, h, o = {}) {
  const G = PFR.gold, F = o.field || { base: '#F6EEDC', lt: '#FFFBF0', dk: '#D8C8A6' };
  c.save(); c.translate(x, y);
  // the rolled ends
  for (const s of [-1, 1]) {
    c.save(); c.translate(s * w / 2, 0);
    poFill(c, [[0, -h * .62, 1], [s * h * .18, -h * .62], [s * h * .3, -h * .4], [s * h * .3, h * .4], [s * h * .18, h * .62], [0, h * .62, 1]], G.base, { sh: [s * 4, 0, 6, rgba(G.dk, .9)], hi: [-s * 2, -3, 4, rgba(G.lt, .9)] });
    for (const yy of [-.62, .62]) { ellipse(c, s * h * .14, yy * h, h * .1, h * .1, G.dk); pdGem(c, s * h * .14, yy * h, h * .06, PDX.ruby); }
    c.restore();
  }
  // the sheet, a little waved
  const P = [[-w / 2, -h / 2, 1], [0, -h / 2 - 6], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [0, h / 2 + 6], [-w / 2, h / 2, 1]];
  poFill(c, P, F.base, { sh: [0, 6, 10, rgba(F.dk, .9)], hi: [0, -4, 6, rgba(F.lt, .9)] });
  poBorder(c, [[-w / 2 + 6, -h / 2 + 8], [0, -h / 2 + 2], [w / 2 - 6, -h / 2 + 8]], 6, G);
  poBorder(c, [[-w / 2 + 6, h / 2 - 8], [0, h / 2 - 2], [w / 2 - 6, h / 2 - 8]], 6, G);
  c.restore();
}
function pdWisdomBox(c, x, y, w, h, o = {}) {
  const G = PFR.gold, F = o.field || { base: '#F8F0DE', lt: '#FFFCF2', dk: '#DCCBA8' };
  c.save(); c.translate(x, y);
  poFill(c, [[-w / 2, -h / 2, 1], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1]], F.base, { sh: [0, 6, 10, rgba(F.dk, .8)] });
  c.strokeStyle = G.base; c.lineWidth = 7; c.strokeRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16);
  c.strokeStyle = PFR.indigo; c.lineWidth = 2; c.strokeRect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32);
  for (const [cx, cy] of [[-w / 2 + 8, -h / 2 + 8], [w / 2 - 8, -h / 2 + 8], [w / 2 - 8, h / 2 - 8], [-w / 2 + 8, h / 2 - 8]]) { ellipse(c, cx, cy, 18, 18, PFR.indigo); poLotus(c, cx, cy + 8, 16, 1, PFR.lotus); }
  // a lotus crest at the top centre for the title
  c.save(); c.translate(0, -h / 2); ellipse(c, 0, 0, 30, 22, PFR.indigo); poLotus(c, 0, 10, 24, 1, { base: G.base, lt: G.lt, dk: G.dk }); c.restore();
  c.restore();
}

// ---------- the golden lotus ----------
function pdGoldenLotus(c, x, y, r, o = {}) {
  const G = PFR.gold, op = o.open ?? 1;
  c.save(); c.translate(x, y);
  glow(c, 0, -r * .4, r * 2.6, '#FFE4A0', .55, 'source-over');
  // pads on the water
  for (const [px, s] of [[-r * 1.3, 1], [r * 1.35, .9]]) { c.save(); c.translate(px, r * .08); c.scale(s, s * .28); ellipse(c, 0, 0, r * .6, r * .6, '#3E6A4E'); ellipse(c, -r * .1, -r * .05, r * .5, r * .5, '#4E8060'); c.restore(); }
  // petals: the back row, the middle, the front, opening outward with op
  const petal = (a, l, wd, col, k = 1) => { c.save(); c.rotate(a); poFill(c, [[0, 0, 1], [-wd, -l * .4], [-wd * .6, -l * .85], [0, -l, 1], [wd * .6, -l * .85], [wd, -l * .4]], col.base, { sh: [wd * .3, 0, wd * .4, rgba(col.dk, .85)], hi: [-wd * .2, -l * .2, wd * .3, rgba(col.lt, .95)], inside: () => { poLine(c, [[0, -l * .1], [0, -l * .9]], rgba(col.dk, .4), 2); poLine(c, [[-wd * .9, -l * .4], [-wd * .5, -l * .86], [0, -l], [wd * .5, -l * .86], [wd * .9, -l * .4]], rgba(col.lt, .8), 2); } }); c.restore(); };
  const PK = { base: '#E7A9A2', lt: '#FAD8CC', dk: '#B0646A' }, GD = { base: G.base, lt: G.lt, dk: G.dk };
  for (let i = -3; i <= 3; i++) petal(i * .3 * op, r * 1.15, r * .22, pfMixPal(GD, PK, .25));
  for (let i = -4; i <= 4; i++) if (i) petal(i * .36 * op, r * 1.0, r * .2, GD);
  for (const i of [-1.5, -.5, .5, 1.5]) petal(i * .5 * op, r * .9, r * .22, pfMixPal(GD, PK, .1));
  petal(0, r * .95, r * .24, GD);
  // the base and the water ring
  poFill(c, [[-r * .5, 0], [r * .5, 0], [r * .3, r * .12], [-r * .3, r * .12]], G.dk);
  c.restore();
}

// ---------- skies, the Ocean of Milk, clouds ----------
function pdNightSky(c, x0, y0, x1, y1, o = {}) {
  c.save();
  c.fillStyle = ptLin(c, 0, y0, 0, y1, o.stops || [[0, '#0E1236'], [.55, '#1E2658'], [.85, '#3A3E78'], [1, o.dawn || '#6A5E8E']]);
  c.fillRect(x0, y0, x1 - x0, y1 - y0);
  const R = lcg(o.seed || 5), n = o.stars ?? 160;
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, R()), y = lerp(y0, y1, R() * R()), r = .8 + R() * 2.2; ellipse(c, x, y, r, r, rgba('#FFF4D8', .4 + R() * .5)); }
  c.restore();
}
function pdMilkOcean(c, x0, y0, x1, y1, o = {}) {
  const G = PFR.gold, t = o.t || 0;
  c.save();
  c.fillStyle = ptLin(c, 0, y0, 0, y1, [[0, '#F6F0E4'], [.3, '#E8E2EE'], [1, '#B8B2D2']]);
  c.fillRect(x0, y0, x1 - x0, y1 - y0);
  glow(c, (x0 + x1) / 2, y0 + 20, (x1 - x0) * .5, '#FFF6DA', .7, 'source-over');
  // rows of scalloped waves, smaller toward the horizon (the Pichwai pattern)
  let y = y0 + 14, row = 0;
  while (y < y1 + 20) {
    const k = (y - y0) / (y1 - y0), w = 26 + k * 90, h = w * .28, off = (row % 2) * w / 2 + t * w;
    c.lineWidth = 1.2 + k * 3; c.strokeStyle = rgba(row % 3 === 0 ? G.base : '#FFFFFF', .35 + k * .4);
    c.beginPath();
    for (let x = x0 - w + (off % w); x < x1 + w; x += w) { c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y - h, x + w, y); }
    c.stroke();
    y += h * 1.2 + 2; row++;
  }
  c.restore();
}
function pdCloud(c, x, y, w, seed = 1, a = 1, col = '#F7F1E6', shc = 'rgba(150,140,172,.6)') {
  // a row of round puffs: the top is the puffs' outline, the bottom a shallow curve, both closing into a round lobe at
  // each end (no straight sides)
  const R = lcg(seed), n = Math.max(3, Math.round(w / 60)), C = [];
  for (let i = 0; i < n; i++) { const u = (i + .5) / n, r = (22 + R() * 22) * (.55 + .45 * Math.sin(Math.PI * u)) * w / 300 + 14; C.push([x - w / 2 + u * w, y - r * .35, r]); }
  const T = [];
  for (let px = x - w / 2; px <= x + w / 2 + .1; px += 5) { let top = y; for (const [cx, cy, r] of C) { const d = px - cx; if (Math.abs(d) < r) top = Math.min(top, cy - Math.sqrt(r * r - d * d)); } T.push([px, y - top]); }
  const Hm = Math.max(...T.map(p => p[1])), mid = y - Hm * .22, P = [];
  for (const [px, h] of T) { const u = (px - x) / (w / 2), e = Math.sqrt(Math.max(0, 1 - u * u)); P.push([px, mid - (mid - (y - Math.max(h, Hm * .22))) * Math.pow(e, 1.1)]); }
  for (let k = T.length - 1; k >= 0; k--) { const px = T[k][0], u = (px - x) / (w / 2), e = Math.sqrt(Math.max(0, 1 - u * u)); P.push([px, mid + (y - mid) * Math.pow(e, .9)]); }
  c.save(); c.globalAlpha *= a; poFill(c, P, col, { sh: [0, 14, 10, shc], hi: [0, -8, 6, 'rgba(255,255,252,.95)'] }); c.restore();
}
