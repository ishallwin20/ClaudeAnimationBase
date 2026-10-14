// surya_props.js: props for the sun story (ad/16-book4-sun) that only this reel uses.

// The goddess who steps out of the light, as a silhouette: the Devi (cine_devi.js) with four more arms fanned out
// behind her (Kushmanda is ashtabhuja, eight-armed), holding a chakra, a lotus, a kalash and a mace. Feet at (0, 0), the
// house units; draw it inside figure() with a silhouette light (it is never seen in colour in this reel).
function devi8(c, o = {}) {
  const t = o.t || 0, col = '#2A1018', sp = o.spread ?? 1;
  for (const s of [-1, 1]) {
    const sway = Math.sin(t * 1.2 + s) * 4;
    // the upper extra arm, out and up; the lower one, out and down
    const A = [[s * 100, -670], [s * (210 + 30 * sp), -690 - 30 * sp], [s * (300 + 50 * sp), -800 - 40 * sp + sway]];
    const B = [[s * 100, -640], [s * (220 + 30 * sp), -580 + 10 * sp], [s * (320 + 50 * sp), -500 + 40 * sp - sway]];
    limb(c, A, [46, 40, 30], col); limb(c, B, [46, 40, 30], col);
    ellipse(c, A[2][0], A[2][1], 20, 22, col); ellipse(c, B[2][0], B[2][1], 20, 22, col);
    if (s < 0) {   // screen left: a chakra up, a kalash down
      c.save(); c.translate(A[2][0], A[2][1] - 50); c.rotate(t * 2); c.strokeStyle = col; c.lineWidth = 12; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.stroke(); for (let k = 0; k < 8; k++) { c.rotate(TAU / 8); fillPath(c, 'M -4 -40 L 0 -58 L 4 -40 Z', col); } c.restore();
      fillPath(c, `M ${B[2][0] - 26} ${B[2][1] + 10} C ${B[2][0] - 40} ${B[2][1] + 50} ${B[2][0] + 40} ${B[2][1] + 50} ${B[2][0] + 26} ${B[2][1] + 10} L ${B[2][0] + 12} ${B[2][1] - 6} L ${B[2][0] - 12} ${B[2][1] - 6} Z`, col);
    } else {        // screen right: a lotus up, a mace down
      limb(c, [[A[2][0], A[2][1]], [A[2][0] + 6, A[2][1] - 70]], [7, 6], col);
      for (const a of [-.7, 0, .7]) { c.save(); c.translate(A[2][0] + 6, A[2][1] - 70); c.rotate(a); fillPath(c, 'M 0 0 C -16 -16 -12 -40 0 -50 C 12 -40 16 -16 0 0 Z', col); c.restore(); }
      limb(c, [[B[2][0], B[2][1] - 30], [B[2][0] + 20, B[2][1] + 150]], [12, 12], col); ellipse(c, B[2][0] + 22, B[2][1] + 170, 34, 34, col);
    }
  }
  devi(c, { t, wind: o.wind ?? .4, eyes: 1 });
}

// A flower on a stem from (x, y): open 0..1 (a bud .. full bloom), droop 0..1 (the stem bowed, the petals hanging).
function flower(c, x, y, k, open, droop, t, col = '#F07A9A', seed = 0) {
  const sw = Math.sin(t * 1.3 + seed) * .04 * (1 - droop), bend = droop * 1.3;
  c.save(); c.translate(x, y); c.scale(k, k);
  const tip = [Math.sin(sw + bend) * 120 * .8, -120 + (1 - Math.cos(bend)) * 50];
  limb(c, [[0, 0], [tip[0] * .4, -60], [tip[0], tip[1]]], [6, 5, 4], mixCol('#3E7A3A', '#4A4030', droop), false);
  fillPath(c, `M 0 -40 C -26 -50 -34 -70 -30 -76 C -14 -70 -4 -56 0 -40 Z`, mixCol('#3E7A3A', '#4A4030', droop));
  c.translate(tip[0], tip[1]); c.rotate(sw + bend * 1.2);
  const pc = mixCol(col, '#5A4A48', droop), n = 6, r = 10 + 26 * open;
  for (let i = 0; i < n; i++) { c.save(); c.rotate((i - (n - 1) / 2) * (.25 + .5 * open)); fillPath(c, `M 0 0 C ${-r * .5} ${-r * .5} ${-r * .4} ${-r} 0 ${-r * 1.15} C ${r * .4} ${-r} ${r * .5} ${-r * .5} 0 0 Z`, i % 2 ? pc : mixCol(pc, '#FFFFFF', .15)); c.restore(); }
  ellipse(c, 0, -3, 6 + 4 * open, 4 + 2 * open, mixCol('#FFC83A', '#5A4A30', droop));
  c.restore();
}
// A row of flowers along y, from x0 to x1.
function flowerBed(c, x0, x1, y, k, open, droop, t, seed = 1) {
  const n = Math.round((x1 - x0) / (90 * k)), cols = ['#F07A9A', '#FFB03A', '#F5E06A', '#E8607A'];
  for (let i = 0; i < n; i++) flower(c, x0 + (i + .5) * (x1 - x0) / n + (hash(i + seed) - .5) * 40 * k, y + hash(i * 3 + seed) * 30 * k, k * (.8 + .4 * hash(i * 5 + seed)), open, droop, t, cols[i % 4], i + seed);
}
// A village of small huts on the horizon at y: dark shapes, a window glow each (lit 0..1).
function huts(c, x0, x1, y, k, lit, col = '#0A0C14') {
  for (let i = 0, x = x0; x < x1; i++, x += (120 + hash(i) * 80) * k) {
    const w = (70 + hash(i * 2) * 40) * k, h = (50 + hash(i * 3) * 30) * k;
    fillPath(c, `M ${x - w / 2} ${y} L ${x - w / 2} ${y - h} L ${x} ${y - h - w * .45} L ${x + w / 2} ${y - h} L ${x + w / 2} ${y} Z`, col);
    if (lit > .01) { const a = lit * (.7 + .3 * Math.sin(i * 2.3)); fillPath(c, `M ${x - 8 * k} ${y - 6 * k} L ${x - 8 * k} ${y - 28 * k} L ${x + 8 * k} ${y - 28 * k} L ${x + 8 * k} ${y - 6 * k} Z`, rgba('#FFB050', a)); glow(c, x, y - 18 * k, 40 * k, '#FF9A3A', .5 * a); }
  }
}
