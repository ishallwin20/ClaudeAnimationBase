// cine_hanuman.js: Hanuman grown, for the Cinematic engine and the Inked comics (CHIRANJEEVI Issue 2). The same face
// as Bal Hanuman (cine_balhanuman.js) grown into a hero: the peach heart-shaped face, now with a strong forward muzzle
// and the heavy jaw his name comes from (hanu, broken on his left), almond eyes lined in kohl, a heavy fur brow, a
// flaring ruff of darker gold round the face, the Vaishnava tilak, gold kundals, and a crown (a diadem, a tall mukut,
// or none). o.age 0..1 greys him for the coda (Bhima, an age later). Load after cine.js, cine_vanara.js.
//
//   hanHead(c, o)   the head, its centre at (0, 0), radius ~100. o:
//     expr   'calm' | 'fierce' | 'roar' | 'snarl' | 'grief' | 'smile' | 'tender' | 'shout' | 'sleep' | 'awe'
//     look [x, y], turn (-1..1, a cheap three-quarter view), crown 'band' | 'mukut' | false, age 0..1, t, blood (0..1:
//     a cut on the brow and blood at the mouth corner, for Lanka)
//   hanumanFig(c, o)  the whole figure on the vanara rig (cine_vanara.js units: feet at (0, 0), ~1000 tall): o is
//     vanara()'s (pose, arms, step, press…) plus hanHead's expr, look, crown, age, blood.
const HN = {
  fur: '#E39A34', furSh: '#B06A1A', furDk: '#7A4410', furLt: '#FFC864', ruff: '#B8701E', ruffSh: '#7E460C',
  face: '#E9B583', faceSh: '#C38A5A', faceDk: '#9A643A', muzzle: '#F2CB9E',
  eyeW: '#F8EEDA', iris: '#C27A18', irisDk: '#4A2608', kohl: '#1E0E06', nose: '#4A2414', lip: '#7A3420', mouth: '#3A0A08',
  teeth: '#FBF4E2', tongue: '#B84440', gold: '#F0B83A', goldSh: '#A87418', goldLt: '#FFE48A', ruby: '#C21E2A', emerald: '#1E8A5A',
  tilakW: '#FFF6E6', tilak: '#D8201E', blood: '#9E1414',
};
const HN_EXPR = {
  calm: { open: 1, brow: 0, mouth: 'calm' },
  fierce: { open: 1.05, brow: -1, mouth: 'set' },
  roar: { open: 1.15, brow: -1, mouth: 'roar' },
  snarl: { open: .9, brow: -1, mouth: 'snarl' },
  grief: { open: .75, brow: 1, mouth: 'grief' },
  smile: { open: .9, brow: .2, mouth: 'smile' },
  tender: { open: 'shut', brow: .5, mouth: 'smile' },
  shout: { open: 1.1, brow: -.4, mouth: 'shout' },
  sleep: { open: 'shut', brow: .1, mouth: 'calm' },
  awe: { open: 1.2, brow: .8, mouth: 'o' },
};
function hnGrey(S, age) {
  if (!age) return S;
  const g = (k, to) => mixCol(S[k], to, age * .75);
  return { ...S, fur: g('fur', '#B9AE9E'), furSh: g('furSh', '#867A6C'), furDk: g('furDk', '#5E544A'), furLt: g('furLt', '#E2DACC'),
    ruff: g('ruff', '#D2CABE'), ruffSh: g('ruffSh', '#8C8478'), face: g('face', '#D2B49A'), muzzle: g('muzzle', '#E6D6C4') };
}
function hanHead(c, o = {}) {
  const S = hnGrey(o.pal ? { ...HN, ...o.pal } : HN, o.age || 0), E = HN_EXPR[o.expr || 'calm'], t = o.t || 0, tn = clamp(o.turn || 0, -1, 1), lk = o.look || [0, 0];
  const sx = tn * 20, mo = E.mouth, open = mo === 'roar' ? 1 : mo === 'shout' ? .6 : mo === 'snarl' ? .25 : mo === 'o' ? .3 : 0;
  c.save(); c.rotate(o.tilt || 0);
  // ---- the ruff: darker gold fur flaring round the face, longest at the jaw (sideburns), tufted
  {
    const R = lcg(11), P = new Path2D(), n = 44;
    for (let i = 0; i <= n; i++) {
      const a = -Math.PI / 2 + i / n * TAU, lo = Math.max(0, Math.sin(a) + .25), side = Math.abs(Math.cos(a));
      const base = 112 + lo * side * 34 + lo * 10, tuft = i % 2 ? 0 : 16 + side * lo * 26 + R() * 6;
      const r = base + tuft;
      const x = Math.cos(a) * r * 1.02 + sx * .2, y = 12 + Math.sin(a) * r * (a > 0 && a < Math.PI ? .92 : .86);
      if (!i) P.moveTo(x, y); else if (i % 2) P.lineTo(x, y); else { const am = a - TAU / n * .5, rm = base * .98; P.quadraticCurveTo(Math.cos(am) * rm + sx * .2, 12 + Math.sin(am) * rm * .9, x, y); }
    }
    P.closePath(); fillPath(c, P, S.ruff); radialShade(c, P, sx, 0, 90, 170, S.ruffSh, .8);
  }
  // ---- ears
  for (const s of [-1, 1]) {
    const ex = s * 98 + sx * .3, k = 1 - Math.max(0, s * -tn) * .4;
    const E1 = ellP(ex, -10, 22 * k, 28); fillPath(c, E1, S.fur); fillPath(c, ellP(ex + s * 2, -8, 13 * k, 18), S.faceSh);
  }
  // ---- the skull: fur, a little taller than wide
  const SK = ellP(sx * .3, -14, 92, 98);
  fillPath(c, SK, S.fur); radialShade(c, SK, -26 + sx, -60, 30, 140, S.furSh, .7);
  // ---- the face: a heart, the eye lobes high, the muzzle pushed forward and down, the jaw heavy
  const fx = sx, F = new Path2D();
  F.moveTo(fx, -50);
  F.bezierCurveTo(fx - 14, -70, fx - 66, -72, fx - 80 + tn * 8, -36);
  F.bezierCurveTo(fx - 92 + tn * 10, -6, fx - 82 + tn * 8, 30, fx - 66, 56);
  F.bezierCurveTo(fx - 58, 94 + open * 30, fx - 26, 116 + open * 36, fx + 6, 116 + open * 36);
  F.bezierCurveTo(fx + 40, 116 + open * 36, fx + 66, 96 + open * 30, fx + 70, 56);
  F.bezierCurveTo(fx + 84 + tn * 8, 30, fx + 92 + tn * 10, -6, fx + 80 + tn * 8, -36);
  F.bezierCurveTo(fx + 66, -72, fx + 14, -70, fx, -50);
  F.closePath();
  fillPath(c, F, S.face);
  inside(c, F, () => {
    // the muzzle mound, paler, shaded under
    const M = ellP(fx + tn * 10, 50 + open * 10, 54, 50 + open * 12); fillPath(c, M, S.muzzle);
    shade(c, M, fx, 30, fx, 104 + open * 30, S.faceDk, .55);
    shade(c, F, fx + 30, -40, fx - 80, 40, S.faceSh, .45);
    // the hanu: the jaw, heavier on his left (screen right)
    fillPath(c, ellP(fx + 12 + tn * 8, 104 + open * 34, 40, 16), rgba(S.faceSh, .6));
  });
  c.save(); c.strokeStyle = S.furSh; c.lineWidth = 3; c.stroke(F); c.restore();
  for (const s of [-1, 1]) strokePath(c, `M ${fx + s * 26 + tn * 6} 20 C ${fx + s * 50} 34 ${fx + s * 56} 62 ${fx + s * 48} ${84 + open * 26}`, rgba(S.faceDk, .75), 3.5);
  strokePath(c, `M ${fx - 22 + tn * 8} ${100 + open * 34} Q ${fx + 8 + tn * 8} ${110 + open * 36} ${fx + 36 + tn * 8} ${98 + open * 34}`, rgba(S.faceDk, .55), 3);
  // ---- the brow: a heavy fur ridge over each eye (angry down, grieving up at the middle)
  const bw = E.brow;
  for (const s of [-1, 1]) {
    const x0 = fx + s * 10, x1 = fx + s * 74, yin = -44 + (bw < 0 ? 14 * -bw : -12 * bw), yout = -50 + (bw > 0 ? 10 * bw : -2);
    const B = `M ${x0} ${yin} Q ${fx + s * 40} ${yin - 22 + bw * 4} ${x1} ${yout - 8} L ${x1 + s * 4} ${yout + 4} Q ${fx + s * 40} ${yin - 6} ${x0} ${yin + 12} Z`;
    fillPath(c, B, S.furDk);
  }
  // ---- eyes: almond, kohl-lined, amber
  const op = E.open;
  for (const s of [-1, 1]) {
    const far = s * tn < 0 ? -s * tn : 0, kx = 1 - far * .3, ex = fx + s * 36 + tn * 6, ey = -16;
    if (op === 'shut') { strokePath(c, `M ${ex - 22 * kx} ${ey - 2} Q ${ex} ${ey + 10} ${ex + 22 * kx} ${ey - 2}`, S.kohl, 5); continue; }
    const h = 15 * op, A = `M ${ex - 27 * kx} ${ey + 2} Q ${ex - 4 * kx} ${ey - h - 6} ${ex + 27 * kx} ${ey - 3} Q ${ex + 2 * kx} ${ey + h + 2} ${ex - 27 * kx} ${ey + 2} Z`;
    fillPath(c, A, S.eyeW);
    inside(c, A, () => {
      const ix = ex + lk[0] * 9 * kx, iy = ey - 1 + lk[1] * 5;
      ellipse(c, ix, iy, 14 * kx, 15, S.iris); ellipse(c, ix, iy - 4, 14 * kx, 8, rgba(S.irisDk, .5)); ellipse(c, ix, iy, 7 * kx, 8, '#120804');
      ellipse(c, ix - 4 * kx, iy - 5, 3.4, 3.4, '#FFFFFF');
    });
    strokePath(c, `M ${ex - 28 * kx} ${ey + 2} Q ${ex - 4 * kx} ${ey - h - 7} ${ex + 28 * kx} ${ey - 3} l ${s * 8} -4`, S.kohl, 5);
  }
  // ---- the tilak: a white U on the brow fur with a red line
  if (o.tilak !== false) {
  strokePath(c, `M ${fx - 12} -96 L ${fx - 9} -66 Q ${fx} -56 ${fx + 9} -66 L ${fx + 12} -96`, S.tilakW, 6);
  strokePath(c, `M ${fx} -96 L ${fx} -64`, S.tilak, 6);
  }
  // ---- the nose: broad and flat
  fillPath(c, `M ${fx - 22 + tn * 6} 18 C ${fx - 22} 4 ${fx + 22} 4 ${fx + 22 + tn * 6} 18 C ${fx + 20} 30 ${fx + 8} 34 ${fx + tn * 3} 32 C ${fx - 8} 34 ${fx - 20} 30 ${fx - 22 + tn * 6} 18 Z`, S.nose);
  for (const s of [-1, 1]) ellipse(c, fx + s * 9 + tn * 3, 24, 5, 3.4, '#1A0804');
  ellipse(c, fx - 6, 10, 7, 3, rgba('#FFFFFF', .35));
  // ---- the mouth
  const mx = fx + tn * 8, my = 64;
  if (mo === 'calm') strokePath(c, `M ${mx - 34} ${my} Q ${mx} ${my + 8} ${mx + 34} ${my}`, S.lip, 4.5);
  else if (mo === 'smile') strokePath(c, `M ${mx - 36} ${my - 4} Q ${mx} ${my + 16} ${mx + 36} ${my - 4}`, S.lip, 5);
  else if (mo === 'set') strokePath(c, `M ${mx - 34} ${my + 4} Q ${mx} ${my - 2} ${mx + 34} ${my + 4}`, S.lip, 5.5);
  else if (mo === 'grief') strokePath(c, `M ${mx - 30} ${my + 8} Q ${mx} ${my - 6} ${mx + 30} ${my + 8}`, S.lip, 5);
  else {
    const w = mo === 'o' ? 16 : mo === 'snarl' ? 40 : 38, d = mo === 'roar' ? 62 : mo === 'shout' ? 40 : mo === 'snarl' ? 18 : 22;
    const M = `M ${mx - w} ${my - 2} C ${mx - w * .8} ${my + d} ${mx + w * .8} ${my + d} ${mx + w} ${my - 2} C ${mx + w * .4} ${my - 8} ${mx - w * .4} ${my - 8} ${mx - w} ${my - 2} Z`;
    fillPath(c, M, S.mouth);
    inside(c, M, () => {
      if (mo !== 'o') {
        fillPath(c, `M ${mx - w} ${my - 4} L ${mx + w} ${my - 4} L ${mx + w} ${my + 6} L ${mx - w} ${my + 6} Z`, S.teeth);
        for (const s of [-1, 1]) fillPath(c, `M ${mx + s * (w - 14)} ${my} l ${s * 7} 0 l ${-s * 3} 20 Z`, S.teeth);   // fangs
        if (d > 30) fillPath(c, `M ${mx - w} ${my + d} L ${mx + w} ${my + d} L ${mx + w} ${my + d - 10} L ${mx - w} ${my + d - 10} Z`, S.teeth);
      }
      ellipse(c, mx, my + d * .85, w * .55, d * .3, S.tongue);
    });
    strokePath(c, M, S.lip, 3.5);
  }
  // ---- blood (Lanka): a cut over the brow, a trickle from the mouth corner
  if (o.blood) {
    const b = o.blood;
    strokePath(c, `M ${fx + 52} -66 L ${fx + 78} -50`, S.blood, 5 * b);
    fillPath(c, `M ${mx + 36} ${my + 2} C ${mx + 40} ${my + 20} ${mx + 36} ${my + 34 * b} ${mx + 40} ${my + 44 * b} C ${mx + 46} ${my + 30} ${mx + 44} ${my + 14} ${mx + 40} ${my} Z`, S.blood);
  }
  // ---- age: lines under the eyes and across the brow
  if (o.age) for (const s of [-1, 1]) { strokePath(c, `M ${fx + s * 22} 0 Q ${fx + s * 38} 8 ${fx + s * 56} 2`, rgba(S.faceDk, .7 * o.age), 3); strokePath(c, `M ${fx + s * 60} -4 l ${s * 12} 12`, rgba(S.faceDk, .6 * o.age), 3); }
  // ---- kundals
  for (const s of [-1, 1]) { c.strokeStyle = S.gold; c.lineWidth = 7; c.beginPath(); c.arc(s * 100 + sx * .3, 30, 15, 0, TAU); c.stroke(); ellipse(c, s * 100 + sx * .3, 47, 5, 5, S.goldLt); }
  // ---- the crown
  const cr = o.crown === undefined ? 'band' : o.crown;
  if (cr) {
    const cx = sx * .4;
    // the band round the head, a jewel over the tilak
    const BAND = `M ${cx - 92} -82 C ${cx - 60} -112 ${cx + 60} -112 ${cx + 92} -82 L ${cx + 88} -62 C ${cx + 56} -92 ${cx - 56} -92 ${cx - 88} -62 Z`;
    if (cr === 'mukut') {
      const MK = `M ${cx - 74} -96 L ${cx - 70} -170 C ${cx - 50} -190 ${cx - 30} -200 ${cx - 18} -232 L ${cx} -290 L ${cx + 18} -232 C ${cx + 30} -200 ${cx + 50} -190 ${cx + 70} -170 L ${cx + 74} -96 Z`;
      fillPath(c, MK, S.gold); shade(c, MK, cx - 70, -200, cx + 74, -120, S.goldSh, .6);
      for (const [y, w] of [[-150, 62], [-196, 34]]) strokePath(c, `M ${cx - w} ${y} Q ${cx} ${y - 14} ${cx + w} ${y}`, S.goldSh, 5);
      ellipse(c, cx, -170, 14, 17, S.ruby); ellipse(c, cx - 4, -175, 4, 4, '#FFB0A0');
      for (const s of [-1, 1]) ellipse(c, cx + s * 40, -128, 9, 10, S.emerald);
      ellipse(c, cx, -294, 8, 8, S.goldLt);
    }
    fillPath(c, BAND, S.gold); shade(c, BAND, cx, -112, cx, -62, S.goldSh, .55);
    for (let i = -3; i <= 3; i++) ellipse(c, cx + i * 24, -86 - Math.cos(i / 3 * 1.2) * 12, 4, 4, i ? S.goldLt : S.ruby);
    if (cr === 'band') { fillPath(c, `M ${cx} -134 L ${cx + 14} -104 L ${cx} -92 L ${cx - 14} -104 Z`, S.gold); ellipse(c, cx, -108, 6, 8, S.ruby); }
  }
  c.restore();
}

// the whole figure on the vanara rig, with this head in place of vanaraHead
const HAN_BODY = { fur: '#E39A34', furSh: '#B06A1A', furDk: '#7A4410', furLt: '#FFC864', chest: '#F0B66A', face: '#E9B583', faceSh: '#C38A5A',
  muzzle: '#F2CB9E', dhoti: '#D8322E', dhotiSh: '#9E1A1A', sash: '#F0B83A', sashSh: '#A87418' };
function hanumanFig(c, o = {}) {
  const head = (cc, q) => { cc.save(); cc.translate(0, -812); cc.scale(.66, .66); hanHead(cc, { ...q, expr: o.expr, look: o.look, crown: o.crown, age: o.age, blood: o.blood, turn: o.turn, t: o.t }); cc.restore(); };
  const pal = o.age ? { ...HAN_BODY, fur: hnGrey(HN, o.age).fur, furSh: hnGrey(HN, o.age).furSh } : HAN_BODY;
  vanara(c, { ...o, pal, headFn: head });
}
