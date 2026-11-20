// cine_deva.js: the gods, kings and rishis for the Inked comics (CHIRANJEEVI Issue 2), drawn in the same language as
// Hanuman (cine_hanuman.js) and Bal Hanuman (cine_balhanuman.js): clean shapes that ink well, single dark strokes, big
// readable almond eyes lined in kohl, warm skin. Load after cine.js.
//
//   devaHead(c, o)   a head, its centre at (0, 0), the chin at ~112, the crown's tip up to ~-300. o:
//     who    a palette in DEVA (ram, indra, vayu, surya, rahu, agastya, brahma, vali…) or pal (colours over it)
//     expr   'calm' | 'kind' | 'smile' | 'fierce' | 'rage' | 'grief' | 'shock' | 'scream' | 'speak' | 'sleep' | 'pain' | 'laugh'
//     look [x, y]; turn (-1..1, features slide: a cheap three-quarter); tilt
//     crown  'kirita' (a tall gold crown) | 'mukut' (a shorter one) | 'sun' (kirita + a ring of rays) | 'jata' (a rishi's
//            topknot) | 'band' | false;  hair 'long' | 'wind' (blown to screen left) | 'wild' | 'short'
//     tilak  'namam' | 'dot' | 'line' | 'tripundra' | false; beard false | 'long' | 'short'; stache (bool); age 0..1
//     fangs (bool), glow (the eyes burn: Rahu); neck (default true)
//   devaBust(c, o)   head and body to the waist, the head at (0, 0), the waist at ~600. o: devaHead's options plus
//     arms   [far, near]: each 'down' | 'hip' | 'abhaya' (hand raised, palm out) | 'reach' (forward, open) |
//            'point' | 'fist' | 'cradle' (forearm across the chest: holding a child) | 'namaste' | 'up' (raised high,
//            open) | 'throw' (high, the hand opening) | 'chest' (clutching the chest) | 'throat' | [upper, bend, hand]
//     dress  'royal' (bare chest, gold haras, an uttariya) | 'rishi' (a rudraksha mala, a deerskin over one shoulder)
//            | 'armor'; build (1 broad .. .85 slight); head (a function (c, o) that draws the head: Hanuman's)
//     cloth  the uttariya's colour
//   rahuHead(c, o)   Rahu: a head with no body, its neck trailing smoke.
const DEVA = {
  base: { skin: '#E2A878', skinSh: '#BC7E52', skinDk: '#7A4A2C', skinLt: '#F6CBA0', lip: '#9A3A2E', lipLo: '#B8564A', mouth: '#3A0A0C',
    teeth: '#FBF4E6', tongue: '#C0504A', hair: '#1A1012', hairLt: '#3A2A2C', iris: '#8A5428', kohl: '#140A08', brow: '#1A0E0C', eyeW: '#FBF2E4',
    gold: '#F0B83A', goldSh: '#A87418', goldLt: '#FFE48A', ruby: '#C21E2A', emerald: '#1E8A5A', pearl: '#F6EEDC',
    tilakW: '#FFF6E6', tilak: '#D8201E', cloth: '#F0C030', clothSh: '#B8861A', thread: '#FFF4D8', beard: '#F2EEE6', beardSh: '#B8B2A8' },
  ram: { skin: '#3A6A98', skinSh: '#28507A', skinDk: '#142E4C', skinLt: '#6A96C2', lip: '#7A2E48', lipLo: '#9A4462', cloth: '#F2C230', clothSh: '#B88A18' },
  indra: { skin: '#EDB98A', skinSh: '#C88E60', skinDk: '#84542E', skinLt: '#FBD8B0', cloth: '#E8E2D2', clothSh: '#B4AA92', hair: '#2A1A10' },
  vayu: { skin: '#8CC6E8', skinSh: '#5E9CC6', skinDk: '#2E5E88', skinLt: '#C4E4F6', lip: '#3E5486', lipLo: '#56709E', hair: '#1E2A44', hairLt: '#3A4A6A', cloth: '#F4F8FC', clothSh: '#B4C6DA', iris: '#4A6A9A' },
  surya: { skin: '#F2A84A', skinSh: '#CC7E26', skinDk: '#8A4A14', skinLt: '#FFD488', lip: '#A2381E', lipLo: '#C8502E', cloth: '#E8501E', clothSh: '#A8341A' },
  rahu: { skin: '#3A3658', skinSh: '#26223E', skinDk: '#100E1E', skinLt: '#5A5680', lip: '#1A1222', lipLo: '#2A1E34', hair: '#08060E', hairLt: '#1E1A2C', iris: '#FF4A2A', kohl: '#04020A', brow: '#04020A', eyeW: '#FFD86A', mouth: '#120408' },
  agastya: { skin: '#B07A52', skinSh: '#8A5838', skinDk: '#4E2E1C', skinLt: '#D09A6E', hair: '#E4DED2', hairLt: '#FFFFFF', brow: '#D8D2C6', cloth: '#E8A050', clothSh: '#A86A28' },
  brahma: { skin: '#E8A060', skinSh: '#C07438', skinDk: '#7A4420', skinLt: '#FAC88E', hair: '#EAE4D8', hairLt: '#FFFFFF', brow: '#D8D2C6', cloth: '#E86A2A', clothSh: '#A8461A' },
  vali: { skin: '#E8A040' },
};
const DEVA_EXPR = {
  calm:   { op: 1, brow: 0, cw: 0, open: 0 },
  kind:   { op: .92, brow: .25, cw: .5, open: 0 },
  smile:  { op: .8, brow: .2, cw: 1, open: .25, teeth: true },
  laugh:  { op: 'happy', brow: .3, cw: 1, open: .7, teeth: true },
  speak:  { op: 1, brow: .1, cw: .1, open: .35 },
  fierce: { op: 1.05, brow: -1, cw: -.4, open: 0 },
  rage:   { op: 1.15, brow: -1.2, cw: -.6, open: .9, teeth: true },
  grief:  { op: .7, brow: 1.2, cw: -.8, open: .15 },
  pain:   { op: .45, brow: 1, cw: -.6, open: .35, teeth: true },
  shock:  { op: 1.3, brow: 1.1, cw: -.2, open: .8, round: true },
  scream: { op: 1.25, brow: .9, cw: -.6, open: 1.2, teeth: true },
  sleep:  { op: 'shut', brow: .1, cw: 0, open: 0 },
};
function devaPal(o) { return { ...DEVA.base, ...(DEVA[o.who] || {}), ...(o.pal || {}) }; }

function devaHead(c, o = {}) {
  const S = devaPal(o), E = DEVA_EXPR[o.expr || 'calm'] || DEVA_EXPR.calm, tn = clamp(o.turn || 0, -1, 1), lk = o.look || [0, 0];
  const sx = tn * 22, fx = sx, t = o.t || 0, hair = o.hair || 'long', age = o.age || 0;
  c.save(); c.rotate(o.tilt || 0);
  // ---- the sun's rays behind (Surya)
  if (o.crown === 'sun') {
    const R = new Path2D(); for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, b = a + TAU / 48, r1 = 230 + (i % 2) * 40; R.moveTo(Math.cos(a - .07) * 150, -40 + Math.sin(a - .07) * 150); R.lineTo(Math.cos(b) * r1, -40 + Math.sin(b) * r1); R.lineTo(Math.cos(a + .2) * 150, -40 + Math.sin(a + .2) * 150); }
    fillPath(c, R, S.gold); ellipse(c, 0, -40, 160, 160, S.goldSh); ellipse(c, 0, -40, 148, 148, S.goldLt);
  }
  // ---- hair behind: a mass, and locks to the shoulders
  if (hair !== 'short' && o.crown !== 'jata') {
    const wd = hair === 'wind' ? -1 : 0, wl = hair === 'wild';
    for (const s of [-1, 1]) for (let j = 0; j < 3; j++) {
      const sw = wd * (40 + j * 20) + (wl ? s * 40 : 0), x0 = s * (56 + j * 12), y0 = -20 + j * 10, len = 150 + j * 20;
      const pts = [0, .25, .5, .75, 1].map(k => [x0 + s * (14 + j * 6) * k + sw * k + Math.sin(k * 7 + j + t) * 6 * k, y0 + len * k]);
      limb(c, pts, [30, 30, 28, 22, 12], j === 1 ? S.hairLt : S.hair);
      const e = pts[4]; c.strokeStyle = S.hair; c.lineWidth = 9; c.beginPath(); c.arc(e[0] - s * 8, e[1], 10, 0, TAU * .75); c.stroke();
    }
    if (wl) { const R = lcg(3); for (let i = 0; i < 14; i++) { const a = Math.PI + i / 13 * Math.PI, r = 120 + R() * 40; limb(c, [[Math.cos(a) * 80, -30 + Math.sin(a) * 80], [Math.cos(a) * r, -30 + Math.sin(a) * r], [Math.cos(a + .2) * (r + 40), -30 + Math.sin(a + .2) * (r + 40)]], [26, 16, 4], S.hair); } }
  }
  fillPath(c, ellP(sx * .2, -24, 88, 96), S.hair);
  // ---- the neck
  if (o.neck !== false) { const N = 'M -36 70 C -36 110 -40 140 -46 176 L 46 176 C 40 140 36 110 36 70 Z'; fillPath(c, N, S.skin); shade(c, N, 0, 90, 0, 150, S.skinSh, .8); }
  // ---- ears, with kundals
  for (const s of [-1, 1]) {
    const k = 1 - Math.max(0, s * -tn) * .5, ex = s * 76 + sx * .25;
    fillPath(c, ellP(ex, -2, 13 * k, 24), S.skin); fillPath(c, ellP(ex + s * 2, 0, 6 * k, 14), S.skinSh);
  }
  // ---- the face: an oval with a gentle jaw
  const F = new Path2D(`M ${fx * .3} -96 C ${44 + fx * .3} -96 ${74 + tn * 6} -66 ${76 + tn * 4} -24 C ${80 + tn * 2} 14 ${76} 48 ${64 + tn * 4} 76 C ${50 + tn * 6} 102 ${26 + sx} 112 ${sx} 112 C ${-26 + sx} 112 ${-50 + tn * 6} 102 ${-64 + tn * 4} 76 C -76 48 ${-80 + tn * 2} 14 ${-76 + tn * 4} -24 C ${-74 + tn * 6} -66 ${-44 + fx * .3} -96 ${fx * .3} -96 Z`);
  fillPath(c, F, S.skin);
  inside(c, F, () => {
    // one crescent of shadow down the far side of the face (one shape: one ink line)
    fillPath(c, `M ${58 + sx * .5} -80 C ${74 + sx * .5} -30 ${66 + sx * .5} 50 ${24 + sx} 116 L 140 140 L 140 -80 Z`, rgba(S.skinSh, .7));
  });
  c.save(); c.strokeStyle = S.skinDk; c.lineWidth = 3; c.stroke(F); c.restore();
  // ---- the hairline over the forehead (a centre parting), or a rishi's bald brow
  if (o.crown !== 'jata') fillPath(c, `M ${-80 + tn * 4} -14 C -86 -80 -50 -116 ${fx * .3} -116 C 50 -116 86 -80 ${80 + tn * 4} -14 C 72 -50 50 -74 ${fx * .3 + 4} -78 L ${fx * .3} -70 L ${fx * .3 - 4} -78 C -50 -74 -72 -50 ${-80 + tn * 4} -14 Z`, S.hair);
  // ---- age: lines
  if (age) { for (const y of [-62, -50]) strokePath(c, `M ${fx - 34} ${y} Q ${fx} ${y - 6} ${fx + 34} ${y}`, rgba(S.skinDk, .55 * age), 2.5); for (const s of [-1, 1]) strokePath(c, `M ${fx + s * 30} 30 Q ${fx + s * 40} 56 ${fx + s * 30} 76`, rgba(S.skinDk, .5 * age), 2.5); }
  // ---- brows: one dark stroke each (raised at the middle in grief, drawn down in anger)
  const bw = E.brow;
  for (const s of [-1, 1]) {
    const x0 = fx + s * 12, x1 = fx + s * 66, yin = -42 + (bw < 0 ? 12 * -bw : -12 * bw), yout = -42 + (bw > 0 ? 6 * bw : -4 * bw);
    const B = `M ${x0} ${yin} Q ${fx + s * 34} ${yin - 16 - (bw < 0 ? -6 : 0)} ${x1} ${yout}`;
    strokePath(c, B, S.brow, 5.5);
  }
  // ---- eyes: almond, lined in kohl, big enough to read at phone size
  const op = E.op;
  for (const s of [-1, 1]) {
    const far = s * tn < 0 ? -s * tn : 0, kx = 1 - far * .35, ex = fx + s * 34 + tn * 4, ey = -8;
    if (op === 'shut') { strokePath(c, `M ${ex - 22 * kx} ${ey} Q ${ex} ${ey + 8} ${ex + 22 * kx} ${ey}`, S.kohl, 5); continue; }
    if (op === 'happy') { strokePath(c, `M ${ex - 22 * kx} ${ey + 4} Q ${ex} ${ey - 12} ${ex + 22 * kx} ${ey + 4}`, S.kohl, 5); continue; }
    const h = 19 * op, A = `M ${ex - 28 * kx} ${ey + 3} C ${ex - 20 * kx} ${ey - h - 4} ${ex + 14 * kx} ${ey - h - 6} ${ex + 28 * kx} ${ey - 2} C ${ex + 16 * kx} ${ey + h + 2} ${ex - 14 * kx} ${ey + h + 4} ${ex - 28 * kx} ${ey + 3} Z`;
    fillPath(c, A, S.eyeW);
    inside(c, A, () => {
      const ix = ex + lk[0] * 9 * kx, iy = ey - 1 + lk[1] * 5;
      ellipse(c, ix, iy, 12.5 * kx, 13.5, S.iris); ellipse(c, ix, iy, 5 * kx, 6, o.glow ? '#FFF2A0' : '#1A0C06');
      if (!o.glow) { ellipse(c, ix - 5 * kx, iy - 5, 4.5, 4.5, '#FFFFFF'); ellipse(c, ix + 5 * kx, iy + 5, 2.2, 2.2, '#FFFFFF'); }
    });
    strokePath(c, `M ${ex - 29 * kx} ${ey + 3} C ${ex - 20 * kx} ${ey - h - 5} ${ex + 14 * kx} ${ey - h - 7} ${ex + 29 * kx} ${ey - 2} l ${s * 10} -6`, S.kohl, 5.5);
  }
  // ---- tilak
  const tk = o.tilak ?? false;
  if (tk === 'namam') { strokePath(c, `M ${fx - 11} -84 L ${fx - 8} -52 Q ${fx} -42 ${fx + 8} -52 L ${fx + 11} -84`, S.tilakW, 5.5); strokePath(c, `M ${fx} -82 L ${fx} -50`, S.tilak, 5.5); }
  else if (tk === 'dot') ellipse(c, fx, -46, 6, 7, S.tilak);
  else if (tk === 'line') strokePath(c, `M ${fx} -80 L ${fx} -48`, S.tilak, 7);
  else if (tk === 'tripundra') { for (const y of [-74, -64, -54]) strokePath(c, `M ${fx - 36} ${y} Q ${fx} ${y - 4} ${fx + 36} ${y}`, S.tilakW, 4.5); ellipse(c, fx, -64, 5, 6, S.tilak); }
  // ---- nose: the bridge in shade on one side, a soft base
  strokePath(c, `M ${fx - 14 + tn * 4} 34 Q ${fx - 16 + tn * 4} 42 ${fx - 7 + tn * 4} 42 Q ${fx + tn * 6} 45 ${fx + 7 + tn * 6} 42 Q ${fx + 16 + tn * 6} 42 ${fx + 14 + tn * 6} 34`, S.skinDk, 3.5);
  ellipse(c, fx + tn * 6, 30, 7, 4, rgba(S.skinLt, .7));
  // ---- the moustache and beard
  if (o.beard) {
    const L = o.beard === 'long', B = `M ${fx - 58} 40 C ${fx - 60} ${L ? 150 : 110} ${fx - 30} ${L ? 230 : 150} ${fx} ${L ? 260 : 160} C ${fx + 30} ${L ? 230 : 150} ${fx + 60} ${L ? 150 : 110} ${fx + 58} 40 C ${fx + 40} 90 ${fx + 20} 96 ${fx} 96 C ${fx - 20} 96 ${fx - 40} 90 ${fx - 58} 40 Z`;
    fillPath(c, B, S.beard); inside(c, B, () => { for (let i = -3; i <= 3; i++) strokePath(c, `M ${fx + i * 14} 100 Q ${fx + i * 16} ${L ? 180 : 130} ${fx + i * 8} ${L ? 250 : 156}`, rgba(S.beardSh, .7), 2.5); });
  }
  // ---- the mouth
  const mx = fx + tn * 8, my = 72, cw = E.cw, opn = E.open;
  if (opn > .05) {
    const w = E.round ? 13 : 22, d = 10 + opn * 32;
    const M = `M ${mx - w} ${my - cw * 4} C ${mx - w * .8} ${my + d} ${mx + w * .8} ${my + d} ${mx + w} ${my - cw * 4} C ${mx + w * .4} ${my - 6} ${mx - w * .4} ${my - 6} ${mx - w} ${my - cw * 4} Z`;
    fillPath(c, M, S.mouth);
    inside(c, M, () => {
      if (E.teeth || o.fangs) fillPath(c, `M ${mx - w} ${my - 8} L ${mx + w} ${my - 8} L ${mx + w} ${my + 4} L ${mx - w} ${my + 4} Z`, S.teeth);
      if (o.fangs) for (const s of [-1, 1]) fillPath(c, `M ${mx + s * (w - 8)} ${my} l ${s * 8} 0 l ${-s * 4} 26 Z`, S.teeth);
      ellipse(c, mx, my + d * .9, w * .6, d * .3, S.tongue);
    });
    strokePath(c, M, S.lip, 3.5);
  } else {
    const up = cw * 7;
    fillPath(c, `M ${mx - 20} ${my - up} Q ${mx - 8} ${my - 8} ${mx} ${my - 4} Q ${mx + 8} ${my - 8} ${mx + 20} ${my - up} Q ${mx} ${my + 1} ${mx - 20} ${my - up} Z`, S.lip);
    fillPath(c, `M ${mx - 15} ${my + 1 - up * .5} Q ${mx} ${my + 13} ${mx + 15} ${my + 1 - up * .5} Q ${mx} ${my + 4} ${mx - 15} ${my + 1 - up * .5} Z`, S.lipLo);
    strokePath(c, `M ${mx - 21} ${my - up} Q ${mx} ${my + 2} ${mx + 21} ${my - up}`, S.mouth, 3);
    if (o.fangs) for (const s of [-1, 1]) fillPath(c, `M ${mx + s * 14} ${my} l ${s * 7} 0 l ${-s * 4} 20 Z`, S.teeth);
  }
  if (o.stache) fillPath(c, `M ${mx} ${my - 12} C ${mx - 14} ${my - 20} ${mx - 34} ${my - 16} ${mx - 42} ${my - 2} C ${mx - 30} ${my - 8} ${mx - 14} ${my - 8} ${mx} ${my - 6} C ${mx + 14} ${my - 8} ${mx + 30} ${my - 8} ${mx + 42} ${my - 2} C ${mx + 34} ${my - 16} ${mx + 14} ${my - 20} ${mx} ${my - 12} Z`, o.beard ? S.beard : S.hair);
  // ---- kundals
  for (const s of [-1, 1]) { const kx = s * 78 + sx * .25; c.strokeStyle = S.gold; c.lineWidth = 6; c.beginPath(); c.arc(kx, 34, 13, 0, TAU); c.stroke(); ellipse(c, kx, 50, 5, 6, S.goldLt); }
  // ---- crowns
  const cr = o.crown;
  if (cr === 'kirita' || cr === 'sun' || cr === 'mukut') {
    const top = cr === 'mukut' ? -190 : -250, cx = sx * .3;
    const K = `M ${cx - 80} -92 L ${cx - 74} -140 C ${cx - 70} ${top * .7} ${cx - 44} ${top * .92} ${cx - 16} ${top + 14} Q ${cx} ${top - 8} ${cx + 16} ${top + 14} C ${cx + 44} ${top * .92} ${cx + 70} ${top * .7} ${cx + 74} -140 L ${cx + 80} -92 Z`;
    fillPath(c, K, S.gold);
    inside(c, K, () => { shade(c, K, cx - 70, top, cx + 80, -100, S.goldSh, .55); for (const y of [-150, -150 + (top + 150) * .45, -150 + (top + 150) * .78]) { const w = 78 * (1 - (y + 140) / (top + 140) * .82); strokePath(c, `M ${cx - w - 10} ${y + 8} Q ${cx} ${y - 12} ${cx + w + 10} ${y + 8}`, S.goldSh, 5); for (let i = -2; i <= 2; i++) ellipse(c, cx + i * w * .38, y - 4 + Math.abs(i) * 2, 4, 4, S.goldLt); } });
    strokePath(c, K, S.goldSh, 3);
    ellipse(c, cx, -128, 14, 17, S.ruby); ellipse(c, cx - 4, -133, 4, 4, '#FFB0A0');
    for (const s of [-1, 1]) ellipse(c, cx + s * 40, -116, 8, 9, S.emerald);
    // a row of petal points along the base
    for (let i = -3; i <= 3; i++) { const x = cx + i * 22; fillPath(c, `M ${x - 10} -96 Q ${x} -124 ${x + 10} -96 Z`, S.goldLt); }
    ellipse(c, cx, top - 6, 9, 9, S.pearl);
  }
  if (cr && cr !== 'jata') {    // the brow band
    const BD = `M ${-82} -78 C -50 -108 50 -108 82 -78 L 80 -62 C 50 -92 -50 -92 -80 -62 Z`;
    fillPath(c, BD, S.gold); strokePath(c, BD, S.goldSh, 2.5); for (let i = -3; i <= 3; i++) ellipse(c, i * 22, -84 - Math.cos(i / 3 * 1.2) * 11, 3.5, 3.5, i ? S.pearl : S.ruby);
  }
  if (cr === 'jata') {   // a rishi's matted topknot, tied with a strand of rudraksha
    const J = `M -60 -80 C -70 -140 -40 -190 0 -196 C 40 -190 70 -140 60 -80 C 40 -100 -40 -100 -60 -80 Z`;
    fillPath(c, J, S.hair); inside(c, J, () => { for (let i = -3; i <= 3; i++) strokePath(c, `M ${i * 16} -86 Q ${i * 22} -140 ${i * 6} -190`, rgba(S.beardSh, .9), 3); });
    strokePath(c, 'M -46 -130 Q 0 -144 46 -130', '#6A2A1A', 9);
    fillPath(c, `M -78 -14 C -86 -80 -50 -102 0 -102 C 50 -102 86 -80 78 -14 C 70 -40 50 -60 0 -64 C -50 -60 -70 -40 -78 -14 Z`, S.hair);
  }
  c.restore();
}

// ---------- the body ----------
const DEVA_ARM = {   // [upper angle, bend, hand] radians, 0 = +x (screen right for the near arm; mirrored for the far)
  down: [1.62, .08, 'rest'], hip: [1.9, -1.9, 'fist'], abhaya: [1.75, -2.6, 'palm'], reach: [.35, -.25, 'open'], point: [.1, -.05, 'point'],
  fist: [1.3, -2.2, 'fist'], cradle: [1.5, 1.85, 'cup'], namaste: [1.75, 2.05, 'join'], up: [-1.1, -.2, 'open'], throw: [-1.5, -.4, 'open'],
  chest: [1.7, 2.3, 'claw'], throat: [1.85, 2.6, 'claw'], open: [.9, -.6, 'open'],
};
function devaHand(c, p, a, kind, S) {
  c.save(); c.translate(p[0], p[1]); c.rotate(a);
  const sk = S.skin, dk = S.skinDk;
  if (kind === 'fist' || kind === 'rest' || kind === 'cup' || kind === 'claw') {
    const H = `M -6 -26 C 30 -30 52 -22 54 0 C 56 24 32 32 0 28 C -12 26 -14 -20 -6 -26 Z`;
    fillPath(c, H, sk); strokePath(c, H, dk, 2.5);
    if (kind !== 'rest') for (const y of [-12, 2, 16]) strokePath(c, `M 34 ${y} L 52 ${y + 2}`, dk, 2.5);
    fillPath(c, ellP(18, -24, 18, 10, -.3), sk); strokePath(c, ellP(18, -24, 18, 10, -.3), dk, 2.5);
  } else {
    // an open hand: palm and four fingers, the thumb
    const H = `M -4 -24 C 20 -28 40 -26 46 -18 L 46 22 C 30 30 10 30 -4 26 Z`;
    fillPath(c, H, sk);
    const sp = kind === 'palm' ? .16 : kind === 'point' ? 0 : .1;
    [-.24, -.08, .08, .24].forEach((k, i) => { const fa = k * (1 + sp * 4), len = kind === 'point' && i ? 26 : (i === 1 || i === 2 ? 50 : 42); const q = [[42, k * 70], [42 + Math.cos(fa) * len * .55, k * 70 + Math.sin(fa) * len * .55], [42 + Math.cos(fa) * len, k * 70 + Math.sin(fa) * len]]; limb(c, q, [14, 12, 10], sk); });
    strokePath(c, H, dk, 2.5);
    limb(c, [[10, -22], [26, -40], [40, -50]], [16, 13, 11], sk);
  }
  c.restore();
}
function devaBust(c, o = {}) {
  const S = devaPal(o), b = o.build ?? 1, arms = o.arms || ['down', 'down'], dress = o.dress || 'royal', t = o.t || 0;
  const cloth = o.cloth || S.cloth, clothSh = o.clothSh || S.clothSh;
  const shY = 196, shX = 176 * b;
  const armOf = (k) => Array.isArray(k) ? k : DEVA_ARM[k] || DEVA_ARM.down;
  const front = (k) => ['cradle', 'namaste', 'chest', 'throat', 'abhaya', 'reach', 'point', 'fist', 'up', 'throw', 'open'].includes(k) || Array.isArray(k);
  const PTS = {   // the near arm (s = 1); mirrored for the far: [elbow, wrist, hand kind]
    namaste: [[shX - 20, shY + 210], [34, shY + 150], 'none'], cradle: [[shX + 10, shY + 220], [-70, shY + 250], 'cup'],
    chest: [[shX - 10, shY + 200], [60, shY + 110], 'claw'], throat: [[shX - 40, shY + 190], [40, 40], 'claw'],
  };
  const drawArm = (s, k) => {
    const [u, bd, hk0] = armOf(k), ua = s > 0 ? u : Math.PI - u, ba = s > 0 ? bd : -bd;
    let ch = chain([s * shX, shY + 10], ua, 190 * b, ba, 170 * b), hk = hk0;
    if (PTS[k]) { const [e, w, h] = PTS[k]; ch = [[s * shX, shY + 10], [s * e[0], e[1]], [s * w[0], w[1]]]; hk = h; }
    limb(c, ch, [70 * b, 58 * b, 46 * b], S.skin);
    strokePath(c, `M ${ch[0][0]} ${ch[0][1] + 20} L ${ch[1][0]} ${ch[1][1]}`, rgba(S.skinSh, .0), 1);
    // an armlet and a bangle
    const am = [lerp(ch[0][0], ch[1][0], .35), lerp(ch[0][1], ch[1][1], .35)], ang = Math.atan2(ch[1][1] - ch[0][1], ch[1][0] - ch[0][0]);
    c.save(); c.translate(am[0], am[1]); c.rotate(ang); fillPath(c, 'M -10 -36 L 10 -36 L 10 36 L -10 36 Z', S.gold); ellipse(c, 0, 0, 8, 10, S.ruby); c.restore();
    const wr = [lerp(ch[1][0], ch[2][0], .86), lerp(ch[1][1], ch[2][1], .86)], ang2 = Math.atan2(ch[2][1] - ch[1][1], ch[2][0] - ch[1][0]);
    c.save(); c.translate(wr[0], wr[1]); c.rotate(ang2); fillPath(c, 'M -8 -26 L 8 -26 L 8 26 L -8 26 Z', S.gold); c.restore();
    if (hk !== 'none') devaHand(c, ch[2], ang2, hk, S);
    return ch;
  };
  // the body is drawn a little smaller than life under the head (the comic's proportions: faces read at phone size)
  const bk = o.bodyK ?? .82; c.save(); c.translate(0, 120); c.scale(bk, bk); c.translate(0, -120);
  // arms behind the torso
  if (!front(arms[0])) drawArm(-1, arms[0]);
  if (!front(arms[1])) drawArm(1, arms[1]);
  // ---- the neck
  { const N = 'M -40 60 C -40 110 -44 150 -50 200 L 50 200 C 44 150 40 110 40 60 Z'; fillPath(c, N, S.skin); inside(c, N, () => fillPath(c, 'M -60 60 L 60 60 L 60 120 Q 0 150 -60 120 Z', rgba(S.skinSh, .8))); }
  // ---- the torso
  const TOR = `M ${-shX - 36} ${shY + 70} C ${-shX - 50} ${shY - 10} ${-shX + 10} 156 -50 158 L 50 158 C ${shX - 10} 156 ${shX + 50} ${shY - 10} ${shX + 36} ${shY + 70} C ${shX + 20} ${shY + 140} ${shX - 6} 380 ${shX - 40} 460 C ${shX - 56} 520 ${shX - 60} 580 ${shX - 56} 640 L ${-shX + 56} 640 C ${-shX + 60} 580 ${-shX + 56} 520 ${-shX + 40} 460 C ${-shX + 6} 380 ${-shX - 20} ${shY + 140} ${-shX - 36} ${shY + 70} Z`;
  fillPath(c, TOR, S.skin);
  inside(c, TOR, () => {
    shade(c, TOR, shX * .2, 200, -shX - 40, 300, S.skinSh, .5);
    for (const s of [-1, 1]) strokePath(c, `M ${s * 12} 300 C ${s * 60} 330 ${s * 120} 326 ${s * 150} 290`, rgba(S.skinDk, .55), 3.5);   // the chest
    strokePath(c, 'M 0 330 L 0 470', rgba(S.skinDk, .35), 3); ellipse(c, 0, 520, 6, 8, rgba(S.skinDk, .6));
    ellipse(c, -20, 250, 70, 24, rgba(S.skinLt, .35));
  });
  strokePath(c, TOR, S.skinDk, 3);
  if (dress === 'armor') {
    const AR = `M ${-shX + 4} 250 C -60 220 60 220 ${shX - 4} 250 L ${shX - 30} 620 L ${-shX + 30} 620 Z`;
    fillPath(c, AR, S.gold); inside(c, AR, () => { shade(c, AR, 0, 240, 0, 620, S.goldSh, .5); for (let y = 300; y < 620; y += 50) strokePath(c, `M ${-shX} ${y} Q 0 ${y + 24} ${shX} ${y}`, S.goldSh, 4); });
    strokePath(c, AR, S.goldSh, 3);
  }
  // ---- the sacred thread: from his left shoulder (screen right) to his right hip (screen left)
  if (dress !== 'armor') strokePath(c, `M ${shX * .55} 196 C ${shX * .2} 320 ${-shX * .3} 470 ${-shX * .62} 620`, S.thread, 5);
  // ---- haras, or a mala
  if (dress === 'rishi') { for (let i = 0; i <= 18; i++) { const a = Math.PI * .1 + i / 18 * Math.PI * .8; ellipse(c, Math.cos(a) * -86, 200 + Math.sin(a) * 140, 7, 7, '#5A2A1A'); } }
  else {
    for (const [d, w, col] of [[60, 5, S.gold], [96, 6, S.gold], [140, 4, S.pearl]]) strokePath(c, `M -64 182 Q 0 ${182 + d * 1.6} 64 182`, col, w);
    fillPath(c, ellP(0, 182 + 96 * .8 + 6, 14, 18), S.gold); ellipse(c, 0, 182 + 96 * .8 + 6, 8, 10, S.ruby);
  }
  // ---- the uttariya over both shoulders, an end falling in front on screen left
  if (dress !== 'armor') {
    const U1 = `M ${shX + 40} ${shY + 80} C ${shX + 30} ${shY - 10} ${shX - 30} 160 ${shX - 90} 168 C ${shX - 70} 230 ${-shX * .2} 420 ${-shX + 40} 520 L ${-shX + 70} 590 C ${-shX * .1} 470 ${shX * .4} 320 ${shX + 40} ${shY + 80} Z`;
    for (const U of [U1]) { fillPath(c, U, dress === 'rishi' ? '#A8743E' : cloth); inside(c, U, () => { for (let i = 0; i < 3; i++) strokePath(c, `M ${shX - 60 + i * 24} ${190 + i * 10} Q ${shX * .1 + i * 20} ${360 + i * 20} ${-shX + 70 + i * 16} ${540 + i * 10}`, rgba(clothSh, .8), 3); }); strokePath(c, U, rgba(clothSh, 1), 3); }
  }
  // arms in front
  if (front(arms[0])) drawArm(-1, arms[0]);
  if (front(arms[1])) drawArm(1, arms[1]);
  if (arms[0] === 'namaste' && arms[1] === 'namaste') {   // the palms joined, fingers up
    const J = `M 0 ${shY + 150} C -34 ${shY + 140} -36 ${shY + 60} -22 ${shY + 10} C -14 ${shY - 16} 14 ${shY - 16} 22 ${shY + 10} C 36 ${shY + 60} 34 ${shY + 140} 0 ${shY + 150} Z`;
    fillPath(c, J, S.skin); strokePath(c, J, S.skinDk, 3); strokePath(c, `M 0 ${shY - 6} L 0 ${shY + 146}`, S.skinDk, 3);
    for (const s2 of [-1, 1]) strokePath(c, `M ${s2 * 26} ${shY + 96} Q ${s2 * 40} ${shY + 70} ${s2 * 22} ${shY + 56}`, S.skinDk, 3);
  }
  c.restore();
  // ---- the head
  c.save(); c.translate(0, 0);
  if (o.head) o.head(c, o); else { c.save(); c.translate(0, 0); devaHead(c, { ...o, neck: false }); c.restore(); }
  c.restore();
}
// Rahu: a head with no body, the neck trailing into smoke
function rahuHead(c, o = {}) {
  const S = devaPal({ who: 'rahu' }), t = o.t || 0, dir = o.trail ?? 1;
  const R = lcg(7);
  for (let i = 0; i < 9; i++) { const k = i / 8, x = dir * (40 + k * 260) + Math.sin(i * 1.7 + t) * 20, y = 150 + k * 60 + Math.sin(i * 2.3) * 30, r = 60 * (1 - k * .7); ellipse(c, x, y, r, r * .8, rgba(i % 2 ? S.skinDk : '#1A1628', .9 - k * .6)); }
  fillPath(c, `M -40 90 C -50 150 -30 200 ${dir * 30} 220 C ${dir * 60} 200 50 150 40 90 Z`, S.skinSh);
  devaHead(c, { who: 'rahu', crown: 'mukut', hair: 'wild', fangs: true, glow: true, neck: false, tilak: false, ...o });
}

// Hanuman on the deva body: his head (cine_hanuman.js) on golden fur, the dhoti's sash for the uttariya
const HAN_FUR = { skin: '#E39A34', skinSh: '#B06A1A', skinDk: '#7A4410', skinLt: '#FFC864', cloth: '#D8322E', clothSh: '#9E1A1A' };
function hanBust(c, o = {}) {
  devaBust(c, { ...o, pal: { ...HAN_FUR, ...(o.pal || {}) }, head: (cc) => { cc.save(); cc.translate(0, -6); hanHead(cc, { expr: o.expr, look: o.look, crown: o.crown, age: o.age, blood: o.blood, turn: o.turn, tilt: o.tilt, t: o.t }); cc.restore(); } });
}

// ---------- Airavata: Indra's white elephant, four tusks, side view facing screen right ----------
// airavataSide(c, o): the feet at y 0, the back at ~-430, from x ~-300 (the tail) to ~+380 (the trunk). o: t, run (0..1
// a gallop), trunk (0 hanging .. 1 raised), seat (a function (c) drawn on his back: the rider; the seat at (0, -420))
const AIR2 = { body: '#F4F2EE', sh: '#C8C6CE', dk: '#8E8C9A', lt: '#FFFFFF', tusk: '#FFF8E8', tuskSh: '#D8CCB0', gold: '#F0B83A', goldSh: '#A87418', goldLt: '#FFE48A', cloth: '#C21E2A', clothSh: '#7E1018', ruby: '#C21E2A', emerald: '#1E8A5A', eye: '#1A1210' };
function airavataSide(c, o = {}) {
  const A = AIR2, t = o.t || 0, run = o.run ?? 1, ph = t * 8 + .7, tr = o.trunk ?? .1;
  const leg = (x, p, near) => {
    const sw = Math.sin(ph + p) * .45 * run, lift = Math.max(0, Math.sin(ph + p)) * 50 * run;
    const k = [x + Math.sin(sw) * 50, -120 - lift * .4], f = [x + Math.sin(sw) * 110, -lift];
    limb(c, [[x, -250], k, f], [118, 104, 108], near ? A.body : A.sh);
    fillPath(c, ellP(f[0], f[1] - 6, 56, 14), near ? A.sh : A.dk);
    fillPath(c, `M ${f[0] - 54} ${f[1] - 50} L ${f[0] + 54} ${f[1] - 50} L ${f[0] + 52} ${f[1] - 34} L ${f[0] - 52} ${f[1] - 34} Z`, A.gold);
  };
  const bob = Math.abs(Math.sin(ph)) * 8 * run;
  c.save(); c.translate(0, -bob);
  leg(-150, Math.PI, false); leg(170, 0, false);
  limb(c, [[-290, -360], [-326, -280], [-322, -200]], [20, 14, 9], A.sh); ellipse(c, -322, -190, 11, 20, A.dk);
  // the barrel of the body, the back rising to the shoulders
  const B = 'M -300 -330 C -320 -460 -220 -540 -40 -544 C 120 -548 240 -520 280 -440 C 310 -380 300 -280 240 -220 C 120 -170 -120 -168 -240 -200 C -290 -230 -306 -280 -300 -330 Z';
  fillPath(c, B, A.body); inside(c, B, () => fillPath(c, 'M -340 -280 C -200 -230 100 -220 320 -270 L 320 -150 L -340 -150 Z', A.sh));
  strokePath(c, B, A.dk, 3);
  // the caparison
  const CP = 'M -180 -530 C -60 -544 80 -544 150 -528 L 144 -250 C 40 -228 -80 -228 -176 -250 Z';
  fillPath(c, CP, A.cloth); inside(c, CP, () => { fillPath(c, 'M -200 -290 L 180 -290 L 180 -220 L -200 -220 Z', A.gold); for (let i = 0; i < 6; i++) ellipse(c, -136 + i * 52, -400, 13, 13, A.goldLt); fillPath(c, 'M -200 -550 L 180 -550 L 180 -510 L -200 -510 Z', A.gold); });
  strokePath(c, CP, A.goldSh, 3);
  for (let i = 0; i < 7; i++) { const x = -156 + i * 48; strokePath(c, `M ${x} -246 L ${x} -222`, A.goldSh, 3); ellipse(c, x, -214, 10, 11, A.gold); }
  // the rider, then the howdah's front rail over his waist
  if (o.seat) { c.save(); c.translate(-20, -540); o.seat(c); c.restore(); fillPath(c, 'M -150 -566 C -60 -580 60 -580 130 -566 L 130 -500 L -150 -500 Z', A.gold); strokePath(c, 'M -150 -566 C -60 -580 60 -580 130 -566 L 130 -500 L -150 -500 Z', A.goldSh, 4); for (let i = 0; i < 6; i++) ellipse(c, -120 + i * 48, -534, 8, 8, A.ruby); }
  // the head: a big domed skull ahead of the shoulders, the ear, trunk and four tusks
  const H = 'M 180 -480 C 190 -590 320 -620 390 -560 C 440 -510 444 -420 420 -350 C 400 -290 340 -260 280 -270 C 210 -290 172 -380 180 -480 Z';
  fillPath(c, H, A.body); strokePath(c, H, A.dk, 3);
  const sw = Math.sin(t * 2) * 10;
  const trunk = [[410, -360], [440 + tr * 20, -280 - tr * 40], [452 + tr * 70, -190 - tr * 120], [446 + tr * 130 + sw, -110 - tr * 220], [420 + tr * 150 + sw, -66 - tr * 270], [396 + tr * 130 + sw, -76 - tr * 290]];
  limb(c, trunk, [86, 72, 56, 42, 30, 22], A.body);
  for (let i = 1; i < 5; i++) { const p = trunk[i]; strokePath(c, `M ${p[0] - 22} ${p[1]} l 30 4`, rgba(A.dk, .55), 3); }
  const tusk = (dx, dy, k, col) => limb(c, [[388 + dx, -330 + dy], [470 + dx, -300 + dy], [540 + dx, -340 + dy], [560 + dx, -390 + dy]], [42 * k, 34 * k, 20 * k, 6], col);
  tusk(-20, -14, .85, A.tuskSh); tusk(-36, 16, .85, A.tuskSh); tusk(0, 0, 1, A.tusk); tusk(-16, 30, .95, A.tusk);
  const EAR = 'M 250 -520 C 150 -560 90 -480 100 -380 C 108 -300 170 -260 250 -300 C 280 -360 280 -460 250 -520 Z';
  fillPath(c, EAR, A.sh); strokePath(c, EAR, A.dk, 3);
  const HP = 'M 300 -600 C 350 -612 400 -590 414 -540 L 396 -450 C 370 -462 330 -480 306 -500 Z';
  fillPath(c, HP, A.gold); strokePath(c, HP, A.goldSh, 3); ellipse(c, 362, -544, 14, 17, A.ruby);
  for (let i = 0; i < 4; i++) ellipse(c, 318 + i * 24, -486 + i * 10, 6, 6, A.goldLt);
  ellipse(c, 352, -430, 11, 8, A.eye); strokePath(c, 'M 334 -444 Q 352 -454 372 -442', A.dk, 3.5); ellipse(c, 348, -432, 3, 3, '#FFFFFF');
  leg(-80, Math.PI * .4, true); leg(230, Math.PI * 1.4, true);
  c.restore();
}
