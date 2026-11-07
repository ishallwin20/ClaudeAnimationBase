// dasha_book_cine.js: Dashavatar book test, Vamana pp. 2–5 in the Cinematic style (the film-lit motion-comic look on
// cine.js: flat shapes, rim and edge light, skies by mood, glow and haze). Slot 0 is the character sheet, slot 1 the
// spread "Three steps" (pp. 2–3, golden hour on the Narmada, the yagna fire), slot 2 "He grew and grew" (pp. 4–5, the
// cosmos); each is rendered at t = slot + .5. Drawn in the book's design space (DW × DH = half the 300 dpi canvas,
// under scale 2): 1 mm ≈ 5.9 units, the trim 3 mm in, the fold at x = DW / 2. The words are set over it by
// tools/book.mjs from books/dashavatar/book.js (variant 'cine').
(() => {
  const DW = W / 2, DH = H / 2, MM = DW / 438, K = W / DW;
  const X = (mm, side = 'L') => (3 + (side === 'R' ? 216 : 0) + mm) * MM, Y = mm => (3 + mm) * MM;
  Object.assign(LOOK, { bloom: .14, vignette: .28, grain: .025 });
  const at = (c, x, y, s, f, rot = 0) => { c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.scale(s, s); f(c); c.restore(); };
  // lights in screen px (the canvas is twice the design space)
  const FIRE = { tint: ['#2A1008', .16], edge: { col: '#FFB070', w: 4, a: .6 }, rim: { col: '#FFD490', dx: 9, dy: -4, a: .9, blur: 2 } };
  const SUNBACK = { tint: ['#3A1A28', .12], edge: { col: '#FFE6A8', w: 4.5, a: .95 }, rim: { col: '#FFF4D0', dx: 7, dy: -5, a: .95, blur: 2 } };
  const COSMIC = { tint: ['#1A1040', .12], edge: { col: '#FFE0A8', w: 5, a: .7 }, rim: { col: '#FFF2C8', dx: -10, dy: -5, a: .9, blur: 2 } };
  const SMALL = (dx) => ({ tint: ['#1A1030', .3], edge: { col: '#FFD8A0', w: 3, a: .8 }, rim: { col: '#FFF0C8', dx, dy: -3, a: .95, blur: 1 } });
  const star4 = (c, x, y, r, col, a = 1) => { glow(c, x, y, r * 3, col, .35 * a); fillPath(c, `M ${x} ${y - r} Q ${x + r * .12} ${y - r * .12} ${x + r} ${y} Q ${x + r * .12} ${y + r * .12} ${x} ${y + r} Q ${x - r * .12} ${y + r * .12} ${x - r} ${y} Q ${x - r * .12} ${y - r * .12} ${x} ${y - r} Z`, rgba(col, a)); };

  function sheet(c, u, t) {
    c.save(); c.scale(K, K);
    sky(c, [[0, '#2B1B3E'], [DH, '#B85A48']]);
    at(c, 240, 1200, .9, (f) => figure(f, (g) => shukraC(g, { t, pose: 'wary', look: [1, 0] }), FIRE));
    at(c, 560, 1200, .9, (f) => figure(f, (g) => shukraC(g, { t, pose: 'shock' }), FIRE));
    at(c, 1000, 1200, .95, (f) => figure(f, (g) => baliC(g, { t, look: [1, .2] }), FIRE));
    at(c, 1450, 1200, 1.4, (f) => figure(f, (g) => vamanaC(g, { t, look: [-1, 0] }), SUNBACK));
    at(c, 1750, 1200, .8, (f) => figure(f, (g) => baliKneel(g, { t }), SMALL(-4)));
    at(c, 2250, 1250, 1.05, (f) => figure(f, (g) => trivikramaC(g, { t, look: [-.6, .5] }), COSMIC));
    c.restore();
  }

  // ---- spread 1, "Three steps": Bali's yagna on the Narmada at sunset; the little boy walks in out of the sun
  function spread1(c, u, t) {
    c.save(); c.scale(K, K);
    sky(c, [[0, '#24183A'], [Y(50), '#4E2A4E'], [Y(100), '#A84E4A'], [Y(128), '#EE9450'], [Y(142), '#FFD27A']]);
    const sx = X(84, 'R'), sy = Y(136);
    soft(c, 4, (s) => { glow(s, sx, sy, 1300, '#FF8A3A', .55); glow(s, sx, sy, 520, '#FFE2A0', .85); });
    rays(c, sx, sy, { n: 34, dir: -Math.PI / 2, spread: Math.PI * 1.25, len: 1500, w: 240, col: '#FFE6B0', a: .2, t: 0, seed: 5 });
    // a few long evening clouds, lit from below
    for (const [x, y, w, sd] of [[X(150), Y(100), 560, 6], [X(10), Y(112), 520, 3], [X(40, 'R'), Y(84), 620, 9], [X(170, 'R'), Y(104), 520, 12]]) cloud(c, x, y, w, sd, ['#6A3048', '#A24A50', '#F2A060'], .55);
    ellipse(c, sx, sy, 92, 92, '#FFF2CC'); glow(c, sx, sy, 200, '#FFF6DC', .9);
    // far hills, the river, the near bank
    ridge(c, Y(144), 120, 3, '#7E4660', { freq: .0022 }); haze(c, Y(141), 140, '#F6AE74', .55);
    ridge(c, Y(150), 60, 8, '#5A3050', { freq: .0035 }); haze(c, Y(150), 60, '#F0A070', .35);
    const RV = c.createLinearGradient(0, Y(150), 0, Y(164)); RV.addColorStop(0, '#F2B070'); RV.addColorStop(.5, '#C06A58'); RV.addColorStop(1, '#5A3050');
    c.fillStyle = RV; c.fillRect(-20, Y(150), DW + 40, Y(164) - Y(150));
    const rr = lcg(21); for (let i = 0; i < 70; i++) { const y = lerp(Y(151), Y(163), rr()), sp = 1 - (y - Y(151)) / (Y(163) - Y(151)), x = sx + (rr() - .5) * (260 + 900 * (1 - sp)), w = 20 + rr() * 90; strokePath(c, `M ${x - w / 2} ${y} L ${x + w / 2} ${y}`, rgba('#FFF0C8', .25 + .6 * sp * rr()), 3); }
    for (let i = 0; i < 40; i++) { const y = lerp(Y(151), Y(163), rr()), x = rr() * DW, w = 30 + rr() * 60; strokePath(c, `M ${x - w / 2} ${y} L ${x + w / 2} ${y}`, rgba('#FFD8A0', .25), 2.4); }
    const GR = 'M -20 ' + Y(162) + ' C ' + X(60) + ' ' + Y(158) + ' ' + X(160) + ' ' + Y(163) + ' ' + X(10, 'R') + ' ' + Y(160) + ' C ' + X(80, 'R') + ' ' + Y(158) + ' ' + X(160, 'R') + ' ' + Y(164) + ' ' + (DW + 20) + ' ' + Y(161) + ' L ' + (DW + 20) + ' ' + (DH + 20) + ' L -20 ' + (DH + 20) + ' Z';
    const g = c.createLinearGradient(0, Y(160), 0, DH); g.addColorStop(0, '#7A4030'); g.addColorStop(.35, '#4E2618'); g.addColorStop(1, '#24120C');
    fillPath(c, GR, g);
    inside(c, GR, () => { glow(c, X(172), Y(190), 700, '#FF8A3A', .35); glow(c, sx, Y(162), 900, '#FFB060', .28); });
    // grass tufts along the bank
    const gr = lcg(7); for (let i = 0; i < 60; i++) { const x = gr() * DW, y = Y(162) + gr() * 6; if (Math.abs(x - X(84, 'R')) < 60) continue; for (let k = -2; k <= 2; k++) strokePath(c, `M ${x} ${y} q ${k * 4} -14 ${k * 9} -${22 + gr() * 14}`, rgba('#3A2014', .9), 3); }
    // the yagna pavilion: two posts and a mango-leaf toran on the left page
    for (const px of [X(14), X(202)]) { strokePath(c, `M ${px} ${Y(190)} L ${px} ${Y(78)}`, '#3A1E14', 16); strokePath(c, `M ${px + 4} ${Y(190)} L ${px + 4} ${Y(80)}`, rgba('#FFB070', .35), 4); }
    const TX = (f) => [lerp(X(14), X(202), f), Y(80) + Math.sin(f * Math.PI) * 46];
    strokePath(c, `M ${TX(0)[0]} ${TX(0)[1]} Q ${X(108)} ${Y(80) + 92} ${TX(1)[0]} ${TX(1)[1]}`, '#B8402A', 5);
    for (let i = 1; i < 26; i++) { const f = i / 26, [x, y] = TX(f); at(c, x, y, 1, (h) => { fillPath(h, 'M -8 0 C -12 18 -6 36 0 46 C 6 36 12 18 8 0 Z', i % 2 ? '#2E5A2A' : '#467A34'); strokePath(h, 'M 0 2 L 0 42', rgba('#A8D080', .4), 1.4); }, Math.sin(i * 1.7) * .12); if (i % 4 === 0) { ellipse(c, x, y + 4, 9, 9, '#F28A1A'); ellipse(c, x, y + 16, 7, 7, '#F2B01A'); } }
    // the fire altar, its smoke and sparks
    const fx = X(172), fy = Y(194);
    soft(c, 3, (s) => { for (let i = 0; i < 6; i++) { const y = fy - 260 - i * 110, x = fx + Math.sin(i * 1.3 + t * .4) * 40 + i * 18; ellipse(s, x, y, 70 + i * 26, 50 + i * 16, rgba('#E8C8B8', .1 - i * .012)); } }, { blur: 6 });
    yagna(c, fx, fy, 170, t, 1.15);
    motes(c, { n: 26, seed: 4, box: [fx - 120, fy - 560, fx + 160, fy - 120], r: 4, col: '#FFC060', a: .8, vx: 10, vy: -40, t });
    // Shukracharya, wary, behind the king; Bali, holding out the water; the boy, out of the sun
    at(c, X(44), Y(190), .5, (f) => figure(f, (g) => shukraC(g, { t, pose: 'wary', look: [1, 0] }), FIRE));
    at(c, X(102), Y(194), .59, (f) => figure(f, (g) => baliC(g, { t, look: [1, .25] }), FIRE));
    at(c, X(86, 'R'), Y(197), .56, (f) => figure(f, (g) => vamanaC(g, { t, look: [-1, .1] }), SUNBACK));
    c.restore();
  }

  // ---- spread 2, "He grew and grew": Trivikrama fills the sky; on the earth below his raised foot, Bali kneels
  function spread2(c, u, t) {
    c.save(); c.scale(K, K);
    sky(c, [[0, '#07061A'], [Y(60), '#16103A'], [Y(130), '#38205E'], [Y(185), '#7A3A78']]);
    // the Milky Way and two nebulae
    soft(c, 4, (s) => { for (let i = 0; i < 14; i++) { const f = i / 13, x = lerp(-100, DW + 100, f), y = lerp(Y(40), Y(150), f) + Math.sin(f * 7) * 40; glow(s, x, y, 360, i % 3 ? '#6A5AB8' : '#B86AA8', .22); } glow(s, X(60, 'R'), Y(60), 700, '#3A6AB0', .25); glow(s, X(80), Y(140), 600, '#A04A8A', .25); });
    const r = lcg(12), quiet = (x, y) => (x < X(142) && y < Y(52)) || (x > X(106, 'R') && y < Y(64));   // no stars behind the words
    for (let i = 0; i < 520; i++) { const x = r() * DW, y = r() * Y(190), s = r(); if (quiet(x, y)) continue; ellipse(c, x, y, .8 + s * 2.4, .8 + s * 2.4, rgba(s > .8 ? '#FFE8B0' : '#F4F0FF', .35 + .6 * r())); }
    for (let i = 0; i < 26; i++) { const x = r() * DW, y = r() * Y(170), k = r(), g = r(); if (!quiet(x, y)) star4(c, x, y, 8 + k * 14, g < .3 ? '#FFE6A0' : '#FFFFFF', .9); }
    // the sun the second step strides past (left page), the moon (right page), Saturn and Mars
    const sx = X(40), sy = Y(104);
    soft(c, 4, (s) => { glow(s, sx, sy, 900, '#FF9A3A', .5); glow(s, sx, sy, 380, '#FFE0A0', .8); });
    rays(c, sx, sy, { n: 22, dir: 0, spread: TAU, len: 520, w: 120, col: '#FFE8B0', a: .35, t: 0, seed: 2 });
    ellipse(c, sx, sy, 96, 96, '#FFD060'); inside(c, ellP(sx, sy, 96, 96), () => { glow(c, sx - 20, sy - 24, 120, '#FFF8E0', .9); }); glow(c, sx, sy, 180, '#FFF2C8', .6);
    const mx = X(184, 'R'), my = Y(112);
    glow(c, mx, my, 260, '#C8D4FF', .3); ellipse(c, mx, my, 62, 62, '#E8E6EE');
    inside(c, ellP(mx, my, 62, 62), () => { ellipse(c, mx + 30, my + 10, 66, 66, rgba('#8A88A8', .55)); for (const [a, b, rr2] of [[-20, -18, 12], [10, 14, 9], [-26, 22, 7], [18, -26, 6]]) ellipse(c, mx + a, my + b, rr2, rr2, rgba('#B8B4C8', .8)); });
    const tx = X(26), ty = Y(150);
    glow(c, tx, ty, 120, '#F2D090', .3);
    at(c, tx, ty, 1, (h) => { ellipse(h, 0, 0, 96, 22, rgba('#E8C890', .55), -.25); ellipse(h, 0, 0, 44, 44, '#E2B870'); inside(h, ellP(0, 0, 44, 44), () => { for (let i = -3; i <= 3; i++) strokePath(h, `M -50 ${i * 11} L 50 ${i * 11 - 8}`, rgba(i % 2 ? '#B8884A' : '#F4D898', .7), 6); ellipse(h, 18, 10, 40, 40, rgba('#5A3A2A', .45)); }); strokePath(h, 'M -96 6 C -60 30 60 6 96 -18', rgba('#F4DCA8', .8), 6); });
    const ax = X(150, 'R'), ay = Y(150);
    glow(c, ax, ay, 90, '#FF7A4A', .35); ellipse(c, ax, ay, 26, 26, '#D8603A'); inside(c, ellP(ax, ay, 26, 26), () => ellipse(c, ax + 10, ay + 8, 26, 26, rgba('#6A2018', .5)));
    // the earth: a great curve across both pages, its rim lit by the sun on the left
    const ecx = DW * .52, ecy = Y(186) + 2600, R = 2600;
    soft(c, 3, (s) => { s.save(); s.beginPath(); s.arc(ecx, ecy, R + 90, 0, TAU); s.arc(ecx, ecy, R - 10, 0, TAU, true); s.fillStyle = rgba('#7AC8FF', .35); s.fill('evenodd'); s.restore(); }, { blur: 10 });
    ellipse(c, ecx, ecy, R + 16, R + 16, '#9ADCFF');
    ellipse(c, ecx, ecy, R, R, '#1E4E8E');
    inside(c, circ(ecx, ecy, R), () => {
      for (const [a, w, h, d] of [[-.42, 300, 80, 40], [-.3, 240, 70, 10], [-.16, 380, 110, 50], [.02, 260, 80, 0], [.16, 420, 130, 60], [.32, 280, 90, 30], [.46, 320, 110, 50]]) {
        const an = -Math.PI / 2 + a, rr2 = R - d; ellipse(c, ecx + Math.cos(an) * rr2, ecy + Math.sin(an) * rr2, w, h, '#3E8A4A', a);
        ellipse(c, ecx + Math.cos(an) * rr2 + 20, ecy + Math.sin(an) * rr2 + 16, w * .7, h * .5, rgba('#2A6A38', .8), a);
      }
      const gg = c.createLinearGradient(X(0), 0, X(216, 'R'), 0); gg.addColorStop(0, rgba('#FFE6B0', .28)); gg.addColorStop(.4, rgba('#FFE6B0', 0)); gg.addColorStop(1, rgba('#0A0A2A', .45)); c.fillStyle = gg; c.fillRect(0, 0, DW, DH);
      const gv = c.createLinearGradient(0, Y(180), 0, DH); gv.addColorStop(0, rgba('#000010', 0)); gv.addColorStop(1, rgba('#000010', .45)); c.fillStyle = gv; c.fillRect(0, 0, DW, DH);
      for (const [x, y, w, sd] of [[X(30), Y(198), 360, 41], [X(160), Y(204), 300, 43], [X(120, 'R'), Y(202), 380, 45]]) cloud(c, x, y, w, sd, ['#8AA8D0', '#C8DAF0', '#FFFFFF'], .5);
    });
    const surf = (x) => ecy - Math.sqrt(R * R - (x - ecx) * (x - ecx));
    // Trivikrama, his right foot on the earth, his left raised past the sun; clouds round his shin
    const vx = X(56, 'R');
    at(c, vx, surf(vx) + 10, .98, (f) => figure(f, (g) => trivikramaC(g, { t, look: [-.7, .6], light: -1 }), COSMIC));
    cloud(c, vx + 30, surf(vx) - 150, 520, 51, ['#5A4A8A', '#9A8AC0', '#FFE6C8'], .92);
    cloud(c, vx - 180, surf(vx) - 60, 360, 53, ['#5A4A8A', '#9A8AC0', '#FFE6C8'], .85);
    // on the earth below the raised foot: Shukracharya aghast, Bali kneeling to offer his head
    const shx = X(64), bx = X(120);
    at(c, shx, surf(shx) + 4, .27, (f) => figure(f, (g) => shukraC(g, { t, pose: 'shock' }), SMALL(-4)));
    at(c, bx, surf(bx) + 6, .5, (f) => figure(f, (g) => baliKneel(g, { t }), SMALL(-4)));
    c.restore();
  }

  SHOTS.push({ a: 0, b: 1, draw: sheet });
  SHOTS.push({ a: 1, b: 2, draw: spread1 });
  SHOTS.push({ a: 2, b: 3, draw: spread2 });
})();
