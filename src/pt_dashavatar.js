// pt_dashavatar.js: the Dashavatar cast and sets in the Painterly style (load after pt_cast.js). Each is a DESIGN that
// ptLayer() bakes into a painting (PAINTERLY_GUIDE.md). Picture-book proportions (big heads, kind faces) but shaded
// like a painting: gradients on every mass, a lit side, mottled colour, a grade at the end.
// Characters draw in local units with the origin between the feet (y up is negative); place them with ptdAt().
//   ptdVamana(c, o)      the boy Vamana, ~640 tall (the parasol to ~1000): palm-leaf chhatra, brass kamandalu, deerskin,
//                        sacred thread, shikha. o.look
//   ptdBali(c, o)        King Bali, ~1100 tall: violet and gold, crown, short black beard. o.pose 'give' (a gold kalash
//                        held out) | 'kneel' (hands joined, head bowed, ~700 tall)
//   ptdShukra(c, o)      Shukracharya, ~900 tall: saffron, white beard and bun, a staff. o.pose 'wary' | 'shock'
//   ptdTrivikrama(c, o)  Vishnu filling the sky, ~1420 tall: on his right foot, the left leg striding up to screen left
//                        (PTD_TV_FOOT: that sole's centre), four arms (conch, chakra, hands on hips), kirita, garland
//   ptdFire(c, o)        a brick fire-pit and its fire, ~320 wide
//   ptdRiverSet(c, b)    spread 1's world: Narmada at golden hour, the yagna posts and toran (b: the layout, see the scene)
//   ptdCosmos(c, b)      spread 2's world: night above, dawn below, planets, clouds, the curve of the earth
const PTD = {
  blue: { base: '#4F7FC8', dk: '#2A4C8C', lt: '#93B8EE' },
  tan: { base: '#C98A5E', dk: '#8E5434', lt: '#EDB68A' },
  sage: { base: '#E2A982', dk: '#A9704C', lt: '#F8CFAE' },
  gold: { base: '#E5AE34', dk: '#94631A', lt: '#FFE38C' },
  ink: '#22140E', white: '#FFF8EC',
};
function ptdAt(c, x, y, s, draw, flip = false) { c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); draw(c); c.restore(); }
const ptdHand = (c, x, y, r, S, rot = 0) => { ellipse(c, x + r * .1, y + r * .12, r * 1.05, r * .9, S.dk, rot); ellipse(c, x, y, r, r * .84, S.base, rot); ellipse(c, x - r * .25, y - r * .25, r * .5, r * .36, rgba(S.lt, .6), rot); ellipse(c, x - r * .8, y - r * .35, r * .36, r * .24, S.base, rot - .6); for (let k = 0; k < 3; k++) ptdStroke(c, [[x - r * .1 + k * r * .3, y + r * .45], [x + k * r * .3, y + r * .7]], r * .08, rgba(S.dk, .6)); };
const ptdGoldBand = (c, P, w) => { limb(c, P, P.map(() => w), PTD.gold.dk); limb(c, P.map(([x, y]) => [x, y - w * .15]), P.map(() => w * .7), PTD.gold.base); limb(c, P.map(([x, y]) => [x, y - w * .3]), P.map(() => w * .22), PTD.gold.lt); };
// long hair falling in two locks from the temples over the shoulders (not a block under the chin, which reads as a beard)
function ptdLocks(c, x, y, r, len, col = '#17100D') {
  for (const sd of [-1, 1]) ptShape(c, `M ${x + sd * r * .78} ${y - r * .5} C ${x + sd * r * 1.08} ${y - r * .1} ${x + sd * r * 1.02} ${y + r * .6} ${x + sd * r * 1.2} ${y + r * len}
    C ${x + sd * r * 1.05} ${y + r * (len + .12)} ${x + sd * r * .82} ${y + r * (len + .05)} ${x + sd * r * .74} ${y + r * (len - .1)} C ${x + sd * r * .8} ${y + r * .6} ${x + sd * r * .86} ${y + r * .1} ${x + sd * r * .7} ${y - r * .3} Z`, col);
}
const ptdShoulder = (c, x, y, r, S) => { c.fillStyle = ptRad(c, x - r * .25, y - r * .35, r * .1, r * 1.1, [[0, S.lt], [.5, S.base], [1, S.dk]]); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
function ptdStroke(c, P, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); through(P, 10).forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); }

// a face in a head of radius r centred on (x, y). o: look [dx, dy], eyes 'open' | 'happy' | 'closed' | 'wide',
// brows (radians: + frowns toward the nose), mouth 'smile' | 'grin' | 'o' | 'flat' | 'none', light [lx, ly]
function ptdHead(c, x, y, r, S, o = {}) {
  const [lx, ly] = o.light || [.4, -.6], rx = r * .88;
  for (const sd of [-1, 1]) { ellipse(c, x + sd * rx * .96, y + r * .08, r * .17, r * .26, S.dk); ellipse(c, x + sd * rx * .94, y + r * .06, r * .12, r * .2, S.base); }
  c.fillStyle = ptRad(c, x + lx * r * .45, y + ly * r * .45, r * .1, r * 1.15, [[0, S.lt], [.45, S.base], [1, S.dk]]);
  c.beginPath(); c.ellipse(x, y, rx, r, 0, 0, TAU); c.fill();
  ellipse(c, x, y + r * .78, rx * .5, r * .16, rgba(S.dk, .35));   // under the chin
  const ey = y + r * .1, ex = r * .36, lk = o.look || [0, 0], eyes = o.eyes || 'open';
  for (const sd of [-1, 1]) {
    const cx = x + sd * ex;
    ellipse(c, cx, ey + r * .28, r * .17, r * .1, 'rgba(255,110,100,.28)');   // cheek
    if (eyes === 'happy' || eyes === 'closed') {
      ptdStroke(c, eyes === 'happy' ? [[cx - r * .15, ey + r * .03], [cx, ey - r * .08], [cx + r * .15, ey + r * .03]] : [[cx - r * .15, ey - r * .02], [cx, ey + r * .07], [cx + r * .15, ey - r * .02]], r * .05, PTD.ink);
    } else {
      const big = eyes === 'wide' ? 1.25 : 1;
      ellipse(c, cx, ey, r * .17 * big, r * .12 * big, '#FFFDF6');
      ellipse(c, cx + lk[0] * r * .06, ey + lk[1] * r * .04, r * .1 * big, r * .1 * big, '#3A2216');
      ellipse(c, cx + lk[0] * r * .06, ey + lk[1] * r * .04, r * .055 * big, r * .055 * big, '#120A06');
      ellipse(c, cx + lk[0] * r * .06 - r * .035, ey + lk[1] * r * .04 - r * .04, r * .03, r * .03, '#FFFFFF');
      ptdStroke(c, [[cx - r * .19 * big, ey + r * .01], [cx, ey - r * .13 * big], [cx + r * .19 * big, ey]], r * .045, PTD.ink);
    }
    const b = (o.brows || 0) * sd;
    ptdStroke(c, [[cx - r * .17, ey - r * .25 - b * r * .1], [cx + r * .17, ey - r * .25 + b * r * .1]], r * .055, o.browCol || '#2A1810');
  }
  ellipse(c, x + r * .03, y + r * .42, r * .1, r * .07, rgba(S.dk, .55));   // the nose's shadow
  ellipse(c, x - r * .02, y + r * .38, r * .06, r * .04, rgba(S.lt, .7));
  const my = y + r * .62, m = o.mouth || 'smile';
  if (m === 'smile') ptdStroke(c, [[x - r * .2, my - r * .03], [x, my + r * .07], [x + r * .2, my - r * .03]], r * .05, '#6A1E14');
  else if (m === 'grin') { c.fillStyle = '#6A1E14'; c.beginPath(); c.moveTo(x - r * .22, my - r * .04); c.quadraticCurveTo(x, my + r * .02, x + r * .22, my - r * .04); c.quadraticCurveTo(x, my + r * .26, x - r * .22, my - r * .04); c.fill(); ellipse(c, x, my + r * .1, r * .1, r * .05, '#E8706A'); }
  else if (m === 'o') { ellipse(c, x, my + r * .02, r * .09, r * .12, '#4A140C'); }
  else if (m === 'flat') ptdStroke(c, [[x - r * .15, my], [x + r * .15, my + r * .01]], r * .045, '#6A1E14');
}
// a Vaishnava U tilak on a forehead at (x, y), h tall
function ptdTilak(c, x, y, h) { ptdStroke(c, [[x - h * .22, y - h * .5], [x - h * .18, y + h * .3], [x, y + h * .45], [x + h * .18, y + h * .3], [x + h * .22, y - h * .5]], h * .14, '#FFFFFF'); ptdStroke(c, [[x, y - h * .45], [x, y + h * .3]], h * .14, '#D6141E'); }
// a kirita: a tall gold crown on a head of radius r centred on (x, y)
function ptdKirita(c, x, y, r, tall = 1.3) {
  const top = y - r * (1 + tall), base = y - r * .62, G = PTD.gold;
  const gl = ptLin(c, x - r, 0, x + r, 0, [[0, G.dk], [.3, G.lt], [.55, G.base], [1, G.dk]]);
  ptShape(c, `M ${x - r * .86} ${base} L ${x - r * .74} ${y - r * 1.3} Q ${x - r * .5} ${top + r * .2} ${x} ${top} Q ${x + r * .5} ${top + r * .2} ${x + r * .74} ${y - r * 1.3} L ${x + r * .86} ${base} Z`, gl);
  for (const k of [.25, .55, .85]) ptShape(c, `M ${x - r * .8 * (1 - k * .35)} ${lerp(base, top, k)} Q ${x} ${lerp(base, top, k) - r * .16} ${x + r * .8 * (1 - k * .35)} ${lerp(base, top, k)} L ${x + r * .8 * (1 - k * .35)} ${lerp(base, top, k) + r * .06} Q ${x} ${lerp(base, top, k) - r * .1} ${x - r * .8 * (1 - k * .35)} ${lerp(base, top, k) + r * .06} Z`, G.dk);
  ptdGoldBand(c, [[x - r * .9, base + r * .02], [x, base + r * .1], [x + r * .9, base + r * .02]], r * .2);
  ellipse(c, x, lerp(base, top, .4), r * .14, r * .18, '#9A1420'); ellipse(c, x - r * .04, lerp(base, top, .4) - r * .05, r * .05, r * .06, '#FF8A90');
  for (const sd of [-1, 1]) { ellipse(c, x + sd * r * .45, base - r * .05, r * .08, r * .08, '#1E7A44'); }
  ellipse(c, x, top + r * .02, r * .1, r * .14, G.lt);
  for (const sd of [-1, 1]) { ellipse(c, x + sd * r * .9, base - r * .02, r * .17, r * .17, G.dk); ellipse(c, x + sd * r * .9, base - r * .05, r * .13, r * .13, G.base); ellipse(c, x + sd * r * .9, base - r * .05, r * .06, r * .06, '#9A1420'); }
}
// the grade over a finished figure: warm light from the key side, a cool or warm bounce from below
function ptdGrade(c, y0, y1, top = 'rgba(255,236,180,.14)', bot = 'rgba(60,40,90,.12)') {
  c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = ptLin(c, 0, y0, 0, y1, [[0, top], [.55, 'rgba(255,255,255,0)'], [1, bot]]); c.fillRect(-4000, y0, 8000, y1 - y0); c.restore();
}

// ---------- Vamana ----------
function ptdParasol(c, x, y) {   // the staff's foot at (x, y)
  const P = { palm: '#E2B25C', dk: '#9A6A26', lt: '#FBE0A0' }, top = y - 800, R = lcg(7);
  limb(c, [[x, y], [x, top + 40]], [16, 14], '#5E3418'); limb(c, [[x + 3, y], [x + 3, top + 40]], [5, 5], '#A8703E');
  const dome = `M ${x - 260} ${top + 70} Q ${x - 200} ${top - 70} ${x} ${top - 96} Q ${x + 200} ${top - 70} ${x + 260} ${top + 70} ` +
    Array.from({ length: 10 }, (_, i) => `Q ${x + 260 - (i + .5) * 52} ${top + 96} ${x + 260 - (i + 1) * 52} ${top + 70}`).join(' ') + ' Z';
  ptShape(c, dome, ptLin(c, x, top - 96, x, top + 96, [[0, P.lt], [.5, P.palm], [1, P.dk]]));
  inside(c, dome, () => { ellipse(c, x + 90, top - 30, 160, 60, 'rgba(255,240,190,.45)', -.2); ellipse(c, x - 140, top + 50, 150, 40, 'rgba(120,70,20,.35)');
    for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; ptdStroke(c, [[x, top - 96], [x + Math.cos(a) * 270, top + 70 + Math.sin(a) * 30]], 4, rgba(P.dk, .7)); }
    ptMottle(c, x - 260, top - 100, x + 260, top + 100, 60, [P.lt, P.dk, '#F2C870'], R, 6, 20, .2); });
  ellipse(c, x, top - 100, 16, 20, PTD.gold.base); ellipse(c, x - 4, top - 106, 6, 7, PTD.gold.lt);
}
function ptdKamandalu(c, x, y) {   // hanging from the hand at (x, y)
  const B = { base: '#D99A2E', dk: '#7E4E12', lt: '#FFE08A' };
  ptdStroke(c, [[x - 30, y + 60], [x - 26, y + 4], [x, y - 8], [x + 26, y + 4], [x + 30, y + 60]], 9, B.dk);
  c.fillStyle = ptRad(c, x - 22, y + 82, 4, 80, [[0, B.lt], [.45, B.base], [1, B.dk]]); c.beginPath(); c.ellipse(x, y + 100, 58, 50, 0, 0, TAU); c.fill();
  ellipse(c, x, y + 56, 28, 9, B.dk); limb(c, [[x + 44, y + 86], [x + 78, y + 66], [x + 92, y + 40]], [16, 11, 8], B.base);
}
function ptdVamana(c, o = {}) {
  const S = PTD.blue, R = lcg(31), D = { base: '#F2BE3A', dk: '#A86A12', lt: '#FFE38A' };
  ptdParasol(c, -168, -200);
  // legs in a small stride, wooden sandals
  for (const [hx, fx, sd] of [[-34, -58, -1], [34, 46, 1]]) {
    ptForm(c, [[hx, -150], [hx + (fx - hx) * .5, -80], [fx, -16]], [58, 50, 40], S, .3, -.6, .5);
    ellipse(c, fx + sd * 6, -6, 44, 12, '#5E3418'); ellipse(c, fx + sd * 4, -16, 34, 15, S.base); ellipse(c, fx - 6, -20, 16, 7, rgba(S.lt, .7));
  }
  // the dhoti, a deerskin over it, the munja belt
  const dh = `M -112 -290 C -120 -230 -118 -170 -96 -120 C -40 -108 40 -108 96 -120 C 118 -170 120 -230 112 -290 Z`;
  ptShape(c, dh, ptLin(c, -110, 0, 110, 0, [[0, D.dk], [.35, D.base], [.65, D.lt], [1, D.dk]]));
  inside(c, dh, () => { for (const fx of [-50, 10, 60]) ptdStroke(c, [[fx, -280], [fx + 8, -200], [fx + 4, -120]], 6, rgba(D.dk, .55)); });
  const ds = `M -118 -300 L 118 -300 C 122 -260 110 -232 86 -214 C 60 -230 40 -206 14 -200 C -14 -214 -42 -196 -70 -210 C -96 -214 -116 -240 -118 -300 Z`;
  ptShape(c, ds, ptLin(c, 0, -300, 0, -200, [[0, '#D6A36A'], [1, '#8E5A2E']]));
  inside(c, ds, () => { for (const [a, b] of [[-80, -262], [-30, -238], [26, -270], [70, -246], [-92, -228], [100, -272]]) ellipse(c, a, b, 9, 7, '#FBEBD0'); ptMottle(c, -120, -300, 120, -200, 50, ['#B07A44', '#E8C08A'], R, 4, 12, .25); });
  limb(c, [[-112, -298], [0, -292], [112, -298]], [9, 9, 9], '#C8B060', false);
  // torso
  const tor = `M -60 -440 C -100 -432 -118 -400 -116 -360 C -114 -330 -112 -310 -110 -296 L 110 -296 C 112 -310 114 -330 116 -360 C 118 -400 100 -432 60 -440 Z`;
  ptShape(c, tor, ptRad(c, 30, -400, 10, 170, [[0, S.lt], [.5, S.base], [1, S.dk]], 10, -370));
  inside(c, tor, () => { ellipse(c, -100, -350, 30, 70, rgba(S.dk, .4)); ellipse(c, 0, -306, 70, 14, rgba(S.dk, .3)); });
  ptdStroke(c, [[92, -432], [30, -372], [-40, -326], [-104, -298]], 5, '#FFF8E4');   // the sacred thread, "/" over his left shoulder
  // arms: his right (screen left) up to the staff, his left down with the pot
  ptForm(c, [[-92, -420], [-140, -372], [-152, -436]], [50, 44, 38], S, .3, -.7, .5); ptdHand(c, -160, -446, 26, S);
  ptdStroke(c, [[-188, -452], [-134, -440]], 12, S.dk);   // fingers closed round the staff
  ptForm(c, [[92, -420], [124, -340], [132, -262]], [50, 44, 38], S, .3, -.7, .5); ptdHand(c, 134, -248, 26, S, .2);
  ptdKamandalu(c, 136, -238);
  ptMottle(c, -200, -460, 200, -100, 160, [S.lt, S.dk, '#6A98DA', '#3E68AE'], R, 4, 16, .16);
  // neck and head
  ptShape(c, `M -26 -470 L 26 -470 L 32 -436 L -32 -436 Z`, S.dk);
  const hy = -545, r = 100;
  ellipse(c, 0, hy - 18, 96, 88, '#17100D');   // hair cap
  ptdHead(c, 0, hy, r, S, { look: o.look || [-1, 0], mouth: 'smile', light: [.5, -.6] });
  ptShape(c, `M -92 ${hy - 20} C -94 ${hy - 90} -40 ${hy - 112} 0 ${hy - 112} C 40 ${hy - 112} 94 ${hy - 90} 92 ${hy - 20} C 70 ${hy - 70} 30 ${hy - 76} 0 ${hy - 74} C -30 ${hy - 76} -70 ${hy - 70} -92 ${hy - 20} Z`, '#17100D');
  ellipse(c, 10, hy - 122, 24, 20, '#17100D'); ptdStroke(c, [[22, hy - 134], [48, hy - 156], [40, hy - 178]], 9, '#17100D');   // the shikha
  ptdTilak(c, 0, hy - 52, 44);
  ptdGrade(c, -1000, 0, 'rgba(255,226,160,.16)', 'rgba(110,70,40,.14)');
}

// ---------- Bali ----------
function ptdBali(c, o = {}) {
  const S = PTD.tan, R = lcg(41), V = { base: '#7046A8', dk: '#3A1E66', lt: '#A57ED8' }, G = PTD.gold, kneel = o.pose === 'kneel';
  if (kneel) {
    ptShape(c, `M -230 0 C -240 -90 -200 -170 -120 -200 L 120 -200 C 200 -170 240 -90 230 0 Z`, ptLin(c, 0, -200, 0, 0, [[0, V.lt], [.5, V.base], [1, V.dk]]));
    for (const sd of [-1, 1]) ellipse(c, sd * 120, -96, 110, 80, rgba(V.lt, .35), sd * -.2);
    ptdGoldBand(c, [[-226, -16], [0, -4], [226, -16]], 16);
    c.translate(0, 330);   // the waist sits at -200, not -530
  } else {
    for (const sd of [-1, 1]) { ellipse(c, sd * 58, -14, 52, 18, S.dk); ellipse(c, sd * 56, -20, 44, 15, S.base); }
    const dh = `M -150 -530 C -168 -400 -176 -200 -170 -40 C -100 -24 100 -24 170 -40 C 176 -200 168 -400 150 -530 Z`;
    ptShape(c, dh, ptLin(c, -170, 0, 170, 0, [[0, V.dk], [.3, V.base], [.6, V.lt], [1, V.dk]]));
    inside(c, dh, () => { for (const fx of [-14, 0, 14, 28]) ptdStroke(c, [[fx, -520], [fx + 6, -280], [fx - 4, -40]], 7, rgba(fx % 28 ? V.dk : V.lt, .5));
      ptdGoldBand(c, [[-176, -50], [0, -34], [176, -50]], 22); ptdGoldBand(c, [[0, -520], [12, -280], [0, -44]], 14); ptMottle(c, -170, -530, 170, -30, 120, [V.lt, V.dk, '#8A5CC4'], R, 6, 22, .18); });
  }
  // torso
  const tor = `M -100 -830 C -160 -820 -190 -780 -184 -720 C -178 -650 -160 -580 -150 -526 L 150 -526 C 160 -580 178 -650 184 -720 C 190 -780 160 -820 100 -830 Z`;
  ptShape(c, tor, ptRad(c, 50, -760, 10, 280, [[0, S.lt], [.5, S.base], [1, S.dk]], 20, -700));
  inside(c, tor, () => { for (const sd of [-1, 1]) { ellipse(c, sd * 62, -740, 70, 46, rgba(S.lt, .4), sd * .2); ellipse(c, sd * 62, -692, 64, 12, rgba(S.dk, .35)); } ellipse(c, -170, -660, 40, 120, rgba(S.dk, .45)); });
  ptdGoldBand(c, [[-152, -532], [0, -520], [152, -532]], 26);
  for (const sd of [-1, 1]) ptdShoulder(c, sd * 158, -790, 56, S);
  // the gold uttariya across the chest, the necklaces
  ptShape(c, `M -150 -810 C -60 -730 40 -640 150 -560 L 150 -520 C 40 -600 -70 -690 -170 -770 Z`, ptLin(c, 0, -810, 0, -520, [[0, G.lt], [.5, G.base], [1, G.dk]]));
  c.strokeStyle = G.dk; c.lineWidth = 12; c.beginPath(); c.ellipse(0, -820, 80, 54, 0, .2, Math.PI - .2); c.stroke();
  c.strokeStyle = G.base; c.lineWidth = 8; c.beginPath(); c.ellipse(0, -824, 80, 54, 0, .2, Math.PI - .2); c.stroke();
  ellipse(c, 0, -768, 16, 20, G.base); ellipse(c, 0, -768, 9, 12, '#9A1420');
  // arms
  if (kneel) {
    for (const sd of [-1, 1]) { ptForm(c, [[sd * 160, -800], [sd * 176, -690], [sd * 60, -700]], [70, 60, 48], S, -sd * .2, -.8, .5); ptdGoldBand(c, [[sd * 150, -760], [sd * 190, -756]], 18); }
    for (const sd of [-1, 1]) { ellipse(c, sd * 16, -760, 26, 66, S.dk, sd * -.1); ellipse(c, sd * 14, -764, 22, 62, S.base, sd * -.1); }
  } else {
    ptForm(c, [[-164, -800], [-196, -690], [-200, -580]], [74, 64, 52], S, .2, -.8, .5); ptdGoldBand(c, [[-176, -752], [-212, -748]], 18); ptdHand(c, -200, -556, 34, S);
    ptForm(c, [[164, -800], [250, -700], [334, -720]], [74, 64, 52], S, .2, -.8, .5); ptdGoldBand(c, [[196, -760], [226, -740]], 18); ptdHand(c, 346, -722, 34, S);
    // the gold kalash on his palm, its spout toward the boy
    c.fillStyle = ptRad(c, 330, -800, 6, 90, [[0, G.lt], [.45, G.base], [1, G.dk]]); c.beginPath(); c.ellipse(350, -790, 62, 56, 0, 0, TAU); c.fill();
    ellipse(c, 350, -846, 30, 12, G.dk); limb(c, [[400, -806], [440, -834], [456, -868]], [18, 13, 9], G.base);
    ellipse(c, 330, -806, 12, 18, rgba('#FFFFFF', .5));
  }
  ptMottle(c, -260, -840, 460, -520, 200, [S.lt, S.dk, '#D49A6A', '#B07040'], R, 5, 18, .16);
  // neck, hair behind, head, beard, crown
  ptShape(c, `M -36 -880 L 36 -880 L 44 -826 L -44 -826 Z`, S.dk);
  const hy = -950, r = 92, kh = kneel ? 30 : 0;
  c.save(); c.translate(0, kh);
  ptdLocks(c, 0, hy, r, 1.55, '#1A1218');
  ptdHead(c, 0, hy, r, S, { look: o.look || [1, 0], eyes: kneel ? 'closed' : 'open', mouth: 'none', light: [.4, -.6] });
  ptShape(c, `M -72 ${hy + 36} C -70 ${hy + 84} -36 ${hy + 112} 0 ${hy + 114} C 36 ${hy + 112} 70 ${hy + 84} 72 ${hy + 36} C 56 ${hy + 68} 36 ${hy + 64} 0 ${hy + 66} C -36 ${hy + 64} -56 ${hy + 68} -72 ${hy + 36} Z`, '#1A1218');
  ptdStroke(c, [[-50, hy + 52], [-16, hy + 44], [0, hy + 50], [16, hy + 44], [50, hy + 52]], 10, '#1A1218');
  if (!kneel) ptdStroke(c, [[-18, hy + 72], [0, hy + 78], [18, hy + 72]], 5, '#8A3A2A');
  ptShape(c, `M -86 ${hy - 50} C -88 ${hy - 90} -40 ${hy - 104} 0 ${hy - 104} C 40 ${hy - 104} 88 ${hy - 90} 86 ${hy - 50} Z`, '#1A1218');
  for (const sd of [-1, 1]) { ellipse(c, sd * 82, hy + 30, 12, 16, G.base); ellipse(c, sd * 82, hy + 50, 8, 8, '#9A1420'); }
  ptdKirita(c, 0, hy, r, 1.15);
  c.restore();
  ptdGrade(c, -1200, 0, 'rgba(255,220,150,.16)', 'rgba(40,20,70,.16)');
}

// ---------- Shukracharya ----------
function ptdShukra(c, o = {}) {
  const S = PTD.sage, R = lcg(51), O = { base: '#E8782A', dk: '#8E3A0E', lt: '#FFAE62' }, shock = o.pose === 'shock', W = { base: '#F2EEE6', dk: '#B8B0A6', lt: '#FFFFFF' };
  if (!shock) { limb(c, [[220, 0], [220, -880]], [18, 16], '#5E3418'); limb(c, [[224, 0], [224, -880]], [6, 6], '#A8703E'); }
  for (const sd of [-1, 1]) { ellipse(c, sd * 52, -12, 46, 16, S.dk); ellipse(c, sd * 50, -18, 38, 13, S.base); }
  const robe = `M -150 -620 C -170 -440 -180 -220 -172 -26 C -100 -14 100 -14 172 -26 C 180 -220 170 -440 150 -620 Z`;
  ptShape(c, robe, ptLin(c, -170, 0, 170, 0, [[0, O.dk], [.35, O.base], [.65, O.lt], [1, O.dk]]));
  inside(c, robe, () => { ptdStroke(c, [[-140, -600], [20, -330], [160, -60]], 30, rgba(O.dk, .45)); for (const fx of [-90, -30, 40, 100]) ptdStroke(c, [[fx, -360], [fx + 10, -200], [fx, -30]], 8, rgba(O.dk, .4)); ptMottle(c, -170, -620, 170, -20, 120, [O.lt, O.dk, '#F29A48'], R, 6, 22, .2); });
  for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; ellipse(c, -90 * Math.cos(a), -620 + Math.sin(a) * 170, 10, 10, '#5A2414'); ellipse(c, -90 * Math.cos(a) - 3, -623 + Math.sin(a) * 170, 4, 4, '#A0583A'); }
  if (shock) {
    for (const sd of [-1, 1]) { ptForm(c, [[sd * 140, -600], [sd * 220, -680], [sd * 130, -830]], [64, 56, 46], O, 0, -1, .4); ptdHand(c, sd * 118, -846, 32, S); }
  } else {
    ptForm(c, [[-140, -600], [-176, -480], [-150, -380]], [64, 56, 46], O, .2, -.8, .4); ptdHand(c, -146, -362, 32, S);
    ptForm(c, [[140, -600], [200, -520], [214, -460]], [64, 56, 46], O, .2, -.8, .4); ptdHand(c, 220, -452, 32, S);
  }
  // head: the white bun, the beard to the chest
  const hy = -730, r = 84;
  ellipse(c, 0, hy - 100, 60, 46, W.dk); ellipse(c, -6, hy - 106, 52, 40, W.base); ellipse(c, -20, hy - 118, 22, 14, W.lt);
  ellipse(c, 0, hy - 40, 92, 70, W.base);
  ptdHead(c, 0, hy, r, S, { look: shock ? [0, 0] : (o.look || [1, 0]), eyes: shock ? 'wide' : 'open', brows: shock ? -.8 : .9, browCol: '#E8E2D8', mouth: 'none', light: [.4, -.6] });
  ptShape(c, `M -76 ${hy + 20} C -96 ${hy + 120} -70 ${hy + 220} 0 ${hy + 250} C 70 ${hy + 220} 96 ${hy + 120} 76 ${hy + 20} C 60 ${hy + 66} 40 ${hy + 56} 0 ${hy + 58} C -40 ${hy + 56} -60 ${hy + 66} -76 ${hy + 20} Z`, ptLin(c, 0, hy, 0, hy + 250, [[0, W.lt], [1, W.dk]]));
  inside(c, `M -90 ${hy + 20} L 90 ${hy + 20} L 90 ${hy + 260} L -90 ${hy + 260} Z`, () => { for (let i = 0; i < 9; i++) ptdStroke(c, [[-60 + i * 15, hy + 70], [-56 + i * 14, hy + 160], [-30 + i * 8, hy + 236]], 4, rgba(W.dk, .5)); });
  ptdStroke(c, [[-52, hy + 48], [-16, hy + 40], [0, hy + 46], [16, hy + 40], [52, hy + 48]], 12, W.base);
  if (shock) ellipse(c, 0, hy + 80, 14, 18, '#4A140C');
  for (const k of [-1, 0, 1]) ptdStroke(c, [[-46, hy - 52 + k * 11], [46, hy - 52 + k * 11]], 5, '#FFFFFF');
  ptdGrade(c, -1000, 0, 'rgba(255,226,160,.14)', 'rgba(80,40,30,.14)');
}

// ---------- Trivikrama ----------
const PTD_TV_FOOT = [-760, -1010];
function ptdTrivikrama(c, o = {}) {
  const S = PTD.blue, R = lcg(61), Y = { base: '#F2BE3A', dk: '#A86A12', lt: '#FFE38A' }, G = PTD.gold;
  // the raised left leg: thigh, shin, the sole turned to us
  ptForm(c, [[-70, -600], [-240, -720], [-400, -800]], [150, 132, 116], S, .1, -1, .5);
  ptForm(c, [[-400, -800], [-560, -880], [-690, -950]], [118, 100, 84], S, .1, -1, .5);
  ptdGoldBand(c, [[-650, -1000], [-700, -900]], 26);
  const [fx, fy] = PTD_TV_FOOT, fa = -.55;
  c.save(); c.translate(fx, fy); c.rotate(fa);
  ellipse(c, 0, 0, 118, 76, S.dk); ellipse(c, -4, -4, 110, 70, S.base);
  c.fillStyle = ptRad(c, -10, 0, 4, 100, [[0, '#FFC8C0'], [.7, '#E8A0A0'], [1, rgba('#E8A0A0', 0)]]); c.beginPath(); c.ellipse(-10, 4, 92, 54, 0, 0, TAU); c.fill();
  for (const [a, b, rr] of [[-124, -46, 26], [-112, -6, 21], [-98, 28, 18], [-80, 54, 16], [-56, 72, 14]]) { ellipse(c, a, b, rr, rr, S.base); ellipse(c, a - 4, b - 4, rr * .55, rr * .45, '#FFC8C0'); }
  c.restore();
  // the planted right leg
  ptForm(c, [[50, -620], [80, -330], [84, -60]], [176, 140, 100], S, .25, -.8, .5);
  ptdGoldBand(c, [[44, -96], [124, -96]], 26);
  ellipse(c, 100, -22, 104, 34, S.dk); ellipse(c, 96, -30, 92, 28, S.base);
  // the pitambara with its ends flying
  const dh = `M -190 -720 C -212 -650 -196 -580 -150 -536 C -60 -516 20 -470 70 -410 C 130 -392 190 -410 226 -440 C 222 -560 206 -650 190 -720 Z`;
  ptShape(c, dh, ptLin(c, -190, 0, 190, 0, [[0, Y.dk], [.35, Y.base], [.65, Y.lt], [1, Y.dk]]));
  inside(c, dh, () => { for (const fx2 of [-110, -40, 30, 100, 170]) ptdStroke(c, [[fx2, -710], [fx2 + 18, -600], [fx2 + 30, -420]], 9, rgba(Y.dk, .5)); ellipse(c, 120, -560, 70, 140, rgba(Y.lt, .45), -.2); ptdGoldBand(c, [[60, -414], [140, -400], [224, -440]], 16); });
  ptShape(c, `M 170 -700 C 260 -680 330 -640 380 -600 C 330 -610 280 -620 240 -630 C 280 -600 300 -570 320 -540 C 260 -580 210 -620 170 -640 Z`, ptLin(c, 170, 0, 380, 0, [[0, '#C8281E'], [1, '#F2604A']]));
  ptdGoldBand(c, [[-190, -716], [0, -704], [190, -716]], 24);
  // the back arms, raised: the conch (screen left) and the blazing chakra (screen right)
  for (const sd of [-1, 1]) { ptForm(c, [[sd * 170, -1000], [sd * 280, -1110], [sd * 330, -1250]], [86, 74, 60], S, -sd * .3, -.8, .5); ptdGoldBand(c, [[sd * 220, -1080], [sd * 262, -1050]], 20); ptdHand(c, sd * 336, -1272, 40, S); }
  const cx = 360, cy = -1340;
  c.fillStyle = ptRad(c, cx, cy, 10, 120, [[0, '#FFFBE0'], [.3, G.lt], [.7, G.base], [1, G.dk]]); c.beginPath(); c.arc(cx, cy, 96, 0, TAU); c.fill();
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; ptShape(c, `M ${cx + Math.cos(a - .1) * 92} ${cy + Math.sin(a - .1) * 92} L ${cx + Math.cos(a) * 132} ${cy + Math.sin(a) * 132} L ${cx + Math.cos(a + .1) * 92} ${cy + Math.sin(a + .1) * 92} Z`, i % 2 ? G.base : G.lt); }
  ellipse(c, cx, cy, 56, 56, G.dk); ellipse(c, cx, cy, 40, 40, G.base); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ptdStroke(c, [[cx + Math.cos(a) * 14, cy + Math.sin(a) * 14], [cx + Math.cos(a) * 54, cy + Math.sin(a) * 54]], 6, G.dk); } ellipse(c, cx, cy, 14, 14, G.lt);
  c.save(); c.translate(-350, -1340); c.rotate(-.5);
  ptShape(c, `M 0 -96 C 50 -70 66 -10 54 40 C 44 80 10 100 -20 92 C -50 60 -60 10 -50 -40 C -40 -70 -20 -90 0 -96 Z`, ptLin(c, -60, 0, 60, 0, [[0, '#D8CCBA'], [.4, '#FFF8EE'], [1, '#E8DCCA']]));
  for (let k = 0; k < 4; k++) ptdStroke(c, [[-46, -40 + k * 30], [48, -56 + k * 30]], 5, 'rgba(160,130,100,.6)');
  ptdStroke(c, [[0, -96], [22, -120], [40, -110]], 12, '#FFF8EE'); ellipse(c, 20, -60, 14, 30, 'rgba(255,255,255,.7)', -.3);
  c.restore();
  // the chest
  const tor = `M -120 -1050 C -190 -1040 -220 -990 -214 -920 C -206 -840 -196 -780 -186 -716 L 186 -716 C 196 -780 206 -840 214 -920 C 220 -990 190 -1040 120 -1050 Z`;
  ptShape(c, tor, ptRad(c, 40, -960, 10, 300, [[0, S.lt], [.5, S.base], [1, S.dk]], 20, -900));
  inside(c, tor, () => { for (const sd of [-1, 1]) { ellipse(c, sd * 72, -950, 84, 54, rgba(S.lt, .35), sd * .2); ellipse(c, sd * 72, -892, 76, 14, rgba(S.dk, .35)); } for (const sd of [-1, 1]) ellipse(c, sd * 196, -860, 40, 130, rgba(S.dk, .4)); });
  for (const sd of [-1, 1]) ptdShoulder(c, sd * 196, -1006, 60, S);
  // the front arms, hands on his hips
  for (const sd of [-1, 1]) { ptForm(c, [[sd * 196, -1010], [sd * 296, -860], [sd * 200, -740]], [92, 80, 64], S, -sd * .2, -.8, .5); ptdGoldBand(c, [[sd * 236, -950], [sd * 280, -920]], 22); ptdHand(c, sd * 190, -726, 40, S); }
  // the sacred thread, the kaustubha, the vaijayanti garland
  ptdStroke(c, [[150, -1036], [40, -880], [-150, -726]], 6, '#FFF8E4');
  c.strokeStyle = G.dk; c.lineWidth = 14; c.beginPath(); c.ellipse(0, -1036, 92, 60, 0, .2, Math.PI - .2); c.stroke(); c.strokeStyle = G.base; c.lineWidth = 9; c.beginPath(); c.ellipse(0, -1040, 92, 60, 0, .2, Math.PI - .2); c.stroke();
  ellipse(c, 0, -978, 22, 26, G.base); ellipse(c, 0, -978, 14, 18, '#1E7A44'); ellipse(c, -4, -984, 5, 6, '#9AF0B8');
  ptFlowers(c, [[-120, -1040], [-150, -900], [-120, -740], [-40, -660], [40, -660], [120, -740], [150, -900], [120, -1040]], 16, ['#F6971C', '#F7B22A', '#E8761A', '#FBC93C', '#FFFFFF', '#E8324A'], R, 2);
  ptMottle(c, -800, -1300, 420, -40, 300, [S.lt, S.dk, '#6A98DA', '#3E68AE'], R, 6, 22, .15);
  // neck and head, smiling down at the world
  ptShape(c, `M -40 -1090 L 40 -1090 L 50 -1036 L -50 -1036 Z`, S.dk);
  const hy = -1170, r = 100;
  ptdLocks(c, 0, hy, r, 1.6);
  ptdHead(c, 0, hy, r, S, { look: [-.6, .6], eyes: 'open', mouth: 'smile', light: [.3, -.7] });
  ptShape(c, `M -92 ${hy - 40} C -90 ${hy - 90} -40 ${hy - 104} 0 ${hy - 104} C 40 ${hy - 104} 90 ${hy - 90} 92 ${hy - 40} C 60 ${hy - 70} -60 ${hy - 70} -92 ${hy - 40} Z`, '#17100D');
  for (const sd of [-1, 1]) { c.fillStyle = ptRad(c, sd * 90, hy + 40, 2, 30, [[0, G.lt], [.6, G.base], [1, G.dk]]); c.beginPath(); c.ellipse(sd * 90, hy + 44, 22, 30, 0, 0, TAU); c.fill(); }
  ptdTilak(c, 0, hy - 48, 48);
  ptdKirita(c, 0, hy, r, 1.5);
  ptdGrade(c, -1500, 0, 'rgba(255,236,190,.16)', 'rgba(40,30,100,.16)');
}

// ---------- the fire ----------
function ptdFire(c) {
  const R = lcg(71);
  for (const [w, h, col, n] of [[150, 300, '#C8281E', 6], [118, 250, '#F06A1A', 5], [84, 190, '#FFB02E', 4], [48, 120, '#FFF0A0', 3]])
    for (let i = 0; i < n; i++) { const f = (i + .5) / n - .5, hh = h * (1 - Math.abs(f) * 1.1) * (.85 + R() * .3), x = f * w * 2, cv = (R() - .5) * 40;
      ptShape(c, `M ${x - 40} -40 C ${x - 40} ${-hh * .4} ${x + cv - 20} ${-hh * .7} ${x + cv} ${-hh} C ${x + cv + 20} ${-hh * .7} ${x + 40} ${-hh * .4} ${x + 40} -40 Z`, col); }
  const kund = `M -170 -56 L 170 -56 L 150 40 L -150 40 Z`;
  ptShape(c, kund, ptLin(c, 0, -56, 0, 40, [[0, '#E0844E'], [1, '#7A2E14']]));
  inside(c, kund, () => { for (const yy of [-24, 8]) ptdStroke(c, [[-170, yy], [170, yy]], 4, 'rgba(70,20,6,.55)'); for (const [xx, yy] of [[-100, -40], [-20, -40], [60, -40], [140, -40], [-60, -8], [20, -8], [100, -8], [-110, 24], [-30, 24], [50, 24], [120, 24]]) ptdStroke(c, [[xx, yy], [xx, yy + 22]], 4, 'rgba(70,20,6,.5)'); });
  ptShape(c, `M -186 -70 L 186 -70 L 186 -50 L -186 -50 Z`, '#F0A070');
}

// ---------- spread 1: the Narmada at golden hour ----------
// b: { DW, DH, sun: [x, y], horizon, bank, fold, posts: [x0, x1], toranY }
function ptdRiverSet(c, b) {
  const { DW, DH } = b, R = lcg(81);
  // the sky: pale blue above, warm gold toward the sun
  c.fillStyle = ptLin(c, 0, 0, 0, b.horizon, [[0, '#9CC4DE'], [.45, '#D8E2D0'], [.8, '#F8DDA8'], [1, '#FBC77E']]); c.fillRect(0, 0, DW, b.horizon + 20);
  c.fillStyle = ptRad(c, b.sun[0], b.sun[1], 10, 900, [[0, 'rgba(255,250,220,1)'], [.08, 'rgba(255,236,170,.9)'], [.35, 'rgba(255,214,140,.35)'], [1, 'rgba(255,214,140,0)']]); c.fillRect(0, 0, DW, b.horizon + 20);
  // clouds, lit gold from below on the sun's side
  for (const [x, y, w, sd] of [[DW * .12, b.horizon * .5, 520, 3], [DW * .34, b.horizon * .36, 420, 5], [DW * .62, b.horizon * .44, 560, 8], [DW * .9, b.horizon * .3, 480, 11]])
    cloud(c, x, y, w, sd, ['#E6B48C', '#F8E2C4', '#FFF6E6'], .85);
  // the far hills in haze, the far bank's trees
  ridge(c, b.horizon - 10, 70, 4, '#B7A8C0', { freq: .0026, bottom: b.horizon + 40 });
  haze(c, b.horizon - 20, 90, '#FBD8A8', .6);
  for (let i = 0; i < 70; i++) { const x = R() * DW, y = b.horizon + 6 + R() * 10; ellipse(c, x, y - 16 - R() * 26, 26 + R() * 40, 18 + R() * 24, mixCol('#7E8A6A', '#4E6048', R()), 0); }
  // the river: blue, with the sun's road on it
  c.fillStyle = ptLin(c, 0, b.horizon + 10, 0, b.bank, [[0, '#9DBBC8'], [.5, '#6E9CB8'], [1, '#4E7E9E']]); c.fillRect(0, b.horizon + 10, DW, b.bank - b.horizon);
  c.fillStyle = ptLin(c, b.sun[0] - 160, 0, b.sun[0] + 160, 0, [[0, 'rgba(255,230,160,0)'], [.5, 'rgba(255,236,170,.75)'], [1, 'rgba(255,230,160,0)']]); c.fillRect(b.sun[0] - 160, b.horizon + 12, 320, b.bank - b.horizon - 10);
  for (let i = 0; i < 60; i++) { const x = R() * DW, y = b.horizon + 16 + R() * (b.bank - b.horizon - 24), near = Math.abs(x - b.sun[0]) < 260; ptdStroke(c, [[x, y], [x + 30 + R() * 50, y]], 3 + R() * 3, near ? 'rgba(255,246,210,.9)' : 'rgba(220,236,240,.55)'); }
  // the near bank: warm sand, grass, kusha tufts
  const bank = `M 0 ${b.bank - 10} C ${DW * .25} ${b.bank - 30} ${DW * .55} ${b.bank + 10} ${DW} ${b.bank - 20} L ${DW} ${DH} L 0 ${DH} Z`;
  ptShape(c, bank, ptLin(c, 0, b.bank, 0, DH, [[0, '#E8C890'], [.4, '#D8A868'], [1, '#A8723E']]));
  inside(c, bank, () => {
    ellipse(c, b.sun[0], b.bank + 40, 600, 80, 'rgba(255,236,180,.35)');
    ptMottle(c, 0, b.bank - 30, DW, DH, 500, ['#F2D8A2', '#C89058', '#B88048', '#E2B878'], R, 10, 40, .25);
    for (let i = 0; i < 90; i++) { const x = R() * DW, y = b.bank + 20 + Math.pow(R(), .7) * (DH - b.bank); for (let k = 0; k < 5; k++) ptdStroke(c, [[x, y], [x + (k - 2) * 7 + (R() - .5) * 10, y - 20 - R() * 30]], 3, R() < .5 ? '#7A8A3A' : '#A8A84A'); }
  });
  // the yagna posts and the mango-leaf toran
  const [p0, p1] = b.posts;
  for (const px of [p0, p1]) { limb(c, [[px, b.bank + 120], [px, b.toranY - 30]], [30, 26], '#5E3418'); limb(c, [[px + 6, b.bank + 120], [px + 6, b.toranY - 30]], [9, 8], '#A8703E'); ellipse(c, px, b.toranY - 36, 22, 14, PTD.gold.base); }
  const sag = 90; ptdStroke(c, [[p0, b.toranY], [(p0 + p1) / 2, b.toranY + sag], [p1, b.toranY]], 5, '#8A4A1E');
  for (let i = 0; i <= 26; i++) { const f = i / 26, x = lerp(p0, p1, f), y = b.toranY + Math.sin(f * Math.PI) * sag, a = Math.sin(i * 2.3) * .15;
    c.save(); c.translate(x, y); c.rotate(a); ptShape(c, 'M -10 0 C -14 30 -6 56 0 70 C 6 56 14 30 10 0 Z', i % 2 ? '#3E7A34' : '#5E9A3E'); ptdStroke(c, [[0, 4], [0, 62]], 2, 'rgba(200,230,150,.6)'); c.restore();
    if (i % 3 === 0) { ellipse(c, x, y + 8, 12, 12, '#F08A1A'); ellipse(c, x - 3, y + 5, 5, 5, '#FFC04A'); } }
  // things of the yagna on the sand: a ghee pot, a ladle, marigolds
  for (let i = 0; i < 30; i++) ellipse(c, b.fire[0] + (R() - .5) * 520, b.fire[1] + 30 + R() * 90, 8, 6, R() < .5 ? '#F28A1A' : '#FFC23A');
}

// ---------- spread 2: the cosmos ----------
function ptdCosmos(c, b) {
  const { DW, DH } = b, R = lcg(91);
  c.fillStyle = ptLin(c, 0, 0, 0, b.horizon, [[0, '#141634'], [.35, '#2C2C66'], [.6, '#6A4486'], [.82, '#D47A7E'], [1, '#F8B868']]); c.fillRect(0, 0, DW, DH);
  // the Milky Way, a soft band across the dark
  c.save(); c.translate(DW * .5, b.horizon * .3); c.rotate(-.18);
  c.fillStyle = ptLin(c, 0, -160, 0, 160, [[0, 'rgba(200,190,255,0)'], [.5, 'rgba(210,200,255,.22)'], [1, 'rgba(200,190,255,0)']]); c.fillRect(-DW, -160, DW * 2, 320);
  for (let i = 0; i < 260; i++) ellipse(c, (R() - .5) * DW * 1.6, (R() - .5) * 200, 1.5 + R() * 2.5, 1.5 + R() * 2.5, 'rgba(255,250,240,.8)');
  c.restore();
  for (let i = 0; i < 420; i++) { const x = R() * DW, y = Math.pow(R(), 1.4) * b.horizon * .75, r = .8 + Math.pow(R(), 4) * 6; ellipse(c, x, y, r, r, R() < .2 ? '#FFE8B0' : R() < .4 ? '#C8D8FF' : '#FFFFFF'); }
  // the sun on the left page, the moon on the right, a ringed planet and a red one
  const [sx, sy] = b.sun;
  c.fillStyle = ptRad(c, sx, sy, 4, 420, [[0, 'rgba(255,250,220,1)'], [.14, 'rgba(255,214,120,.95)'], [.3, 'rgba(255,170,80,.35)'], [1, 'rgba(255,150,80,0)']]); c.fillRect(sx - 420, sy - 420, 840, 840);
  c.fillStyle = ptRad(c, sx - 20, sy - 20, 4, 96, [[0, '#FFFBEA'], [.6, '#FFD866'], [1, '#F29A2E']]); c.beginPath(); c.arc(sx, sy, 90, 0, TAU); c.fill();
  const [mx, my] = b.moon;
  c.fillStyle = ptRad(c, mx - 16, my - 16, 4, 70, [[0, '#FFFDF0'], [.7, '#E8E2CE'], [1, '#B8B09A']]); c.beginPath(); c.arc(mx, my, 62, 0, TAU); c.fill();
  for (const [a, bb, rr] of [[-18, -10, 12], [14, 16, 9], [20, -20, 7]]) ellipse(c, mx + a, my + bb, rr, rr, 'rgba(160,150,130,.45)');
  const [px, py] = b.planet;
  ellipse(c, px, py, 110, 22, 'rgba(240,210,160,.85)', -.25);
  c.fillStyle = ptRad(c, px - 14, py - 14, 2, 56, [[0, '#FFE8B8'], [.7, '#D8A868'], [1, '#8A5A2E']]); c.beginPath(); c.arc(px, py, 50, 0, TAU); c.fill();
  c.save(); c.beginPath(); c.rect(px - 120, py - 4, 240, 60); c.clip(); ellipse(c, px, py, 110, 22, 'rgba(240,210,160,.9)', -.25); ellipse(c, px, py, 84, 14, 'rgba(120,80,40,.6)', -.25); c.restore();
  c.fillStyle = ptRad(c, b.mars[0] - 8, b.mars[1] - 8, 2, 30, [[0, '#FFB088'], [1, '#B4422A']]); c.beginPath(); c.arc(b.mars[0], b.mars[1], 26, 0, TAU); c.fill();
  // clouds lit from the dawn below
  for (const [x, y, w, sd] of b.clouds) cloud(c, x, y, w, sd, ['#B0607A', '#F2A68A', '#FFE2C0'], .95);
  // the earth: a great curve, the sea, the lands, the glow of its air
  const ecx = DW / 2, R0 = 2900, ecy = b.earth + R0;
  c.fillStyle = ptRad(c, ecx, ecy, R0 - 10, R0 + 90, [[0, 'rgba(180,220,255,.9)'], [.4, 'rgba(160,210,255,.4)'], [1, 'rgba(160,210,255,0)']]); c.beginPath(); c.arc(ecx, ecy, R0 + 90, 0, TAU); c.fill();
  const E = new Path2D(); E.arc(ecx, ecy, R0, 0, TAU);
  c.fillStyle = ptLin(c, 0, b.earth, 0, DH, [[0, '#4A8ACB'], [1, '#1E4E8A']]); c.fill(E);
  c.save(); c.clip(E);
  for (const [a, w, h, d] of [[-.5, 260, 90, 30], [-.36, 200, 70, 10], [-.2, 340, 110, 40], [-.02, 220, 80, 0], [.14, 380, 120, 50], [.3, 240, 80, 20], [.44, 300, 100, 40]]) {
    const an = -Math.PI / 2 + a * .9, rr = R0 - d; c.fillStyle = ptRad(c, ecx + Math.cos(an) * rr, ecy + Math.sin(an) * rr - 20, 4, w, [[0, '#9CCB6A'], [.7, '#5E9A44'], [1, '#3E7A34']]);
    c.beginPath(); c.ellipse(ecx + Math.cos(an) * rr, ecy + Math.sin(an) * rr, w, h, a, 0, TAU); c.fill(); }
  c.fillStyle = ptLin(c, 0, b.earth - 10, 0, b.earth + 120, [[0, 'rgba(255,220,170,.45)'], [1, 'rgba(255,220,170,0)']]); c.fillRect(0, b.earth - 10, DW, 130);
  ptMottle(c, 0, b.earth - 20, DW, DH, 300, ['#6AA0D8', '#2E6AA8', '#86B860', '#4E8A3E'], R, 8, 30, .2);
  c.restore();
}
