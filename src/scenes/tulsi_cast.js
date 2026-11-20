// tulsi_cast.js: the designs for "Why do we marry TULSI to a STONE?" (ad 104, Painterly; STORYBOARD.md).
// Tulasi is Maa Tara's Devi rig from reel/maa-tara-shiva (its Parvati: warm skin, two arms) in an emerald saree:
//   trBody({})        Tulasi seated (no head). Stage px; the face is at TR_FACE.
//   trHead(o)         her head: o.eyes 'front' | 'down' | 'shut', o.tear, o.mouth 'smile' | 'soft' | 'sad' | 'firm',
//                     o.brow 'angry', o.sindoor (false before her marriage)
// and the reel's own sets and props (below the rig): the courtyard with the tulsi vrindavan, the mandap of sugarcane and
// the chunari, the Shaligram, the ocean with Vishnu asleep on Shesha, the riverbank under the Kartik full moon, the
// palace chamber, the battlefield, and the silhouettes (Shankhachuda, Shiva, Brahma).
const TR_X = 540, TR_DY = 100, TR_HS = 1.15;                        // the figure is drawn in dhLakshmi's frame, moved down TR_DY
const trHd = (x, y) => [TR_X + (x - TR_X) * TR_HS, 1100 + TR_DY + (y - 1100) * TR_HS];   // a head point → stage px
const TR_FACE = trHd(540, 1000), TR_THIRD = trHd(540, 950);
const TR_MOON = [812, 380];
const TR_BABY = [TR_X + 72, 1236 + TR_DY], TR_THROAT = [TR_X + 74, 1282 + TR_DY], TR_HEART = [TR_X + 40, 1250 + TR_DY];
const TR_LAMPS = [[118, 1838], [262, 1866], [818, 1866], [962, 1838], [404, 1880], [676, 1880]];
const TR_BLUE = { base: '#3D5AA6', dk: '#1A2758', lt: '#7896D6', face: [[0, '#88A4E0'], [.45, '#5470B8'], [.8, '#3A5296'], [1, '#22336E']], sh: '14,22,64', hl: '200,220,255' };
const TR_WARM = { base: '#E8B088', dk: '#A86A48', lt: '#FCD8B6', face: [[0, '#FFE2C6'], [.45, '#F2C09A'], [.8, '#DDA07A'], [1, '#B47452']], sh: '150,80,50', hl: '255,236,220' };
const VS_BLUE = { base: '#3E6CC0', dk: '#1C3576', lt: '#86AEEA', face: [[0, '#9CC0F2'], [.45, '#5E8ADA'], [.8, '#3E66B4'], [1, '#22407E']], sh: '14,26,80', hl: '210,230,255' };
const TV_SAREE = { base: '#17704A', dk: '#08361F', lt: '#3AA46C' };
const TR_CRIM = { base: '#8E1426', dk: '#4A0612', lt: '#C2304A' };
const TR_TIGER = { base: '#D98A2B', dk: '#97521A', lt: '#F2B85A' };
const TR_BODY_BOX = [90, 620, 900, 1200];
const TR_HEAD_BOX = [TR_X - 260, 600, 520, 680];
const TR_BABY_BOX = [TR_X - 120, 1150 + TR_DY, 280, 240];

// ---------- small parts ----------
function trJaba(c, x, y, r, rot = 0) {   // a red hibiscus seen from the front: five broad petals, the long stamen
  c.save(); c.translate(x, y); c.rotate(rot);
  for (let i = 0; i < 5; i++) {
    c.save(); c.rotate(i / 5 * TAU);
    ptShape(c, `M 0 0 C ${r * .5} ${-r * .2} ${r * .7} ${-r * .8} ${r * .25} ${-r * 1.02} C 0 ${-r * 1.1} ${-r * .3} ${-r * 1.05} ${-r * .5} ${-r * .85} C ${-r * .7} ${-r * .5} ${-r * .4} ${-r * .15} 0 0 Z`,
      ptLin(c, 0, 0, 0, -r, [[0, '#6A0410'], [.35, '#C0101E'], [1, '#E83A3A']]));
    c.restore();
  }
  ellipse(c, 0, 0, r * .18, r * .18, '#4A020A');
  limb(c, [[0, 0], [r * .35, -r * .5], [r * .55, -r * 1.1]], [r * .07, r * .06, r * .05], '#E8C040', false);
  ellipse(c, r * .55, -r * 1.12, r * .1, r * .1, '#FFE070');
  c.restore();
}
function trLeaf(c, x, y, l, w, a, col) { c.save(); c.translate(x, y); c.rotate(a); ptShape(c, `M 0 0 C ${w} ${-l * .3} ${w * .6} ${-l * .8} 0 ${-l} C ${-w * .6} ${-l * .8} ${-w} ${-l * .3} 0 0 Z`, col); c.restore(); }
function trDiya(c, x, y) {   // a clay lamp on the step
  ellipse(c, x, y + 10, 46, 12, 'rgba(0,0,0,.5)');
  ptShape(c, `M ${x - 40} ${y - 4} C ${x - 36} ${y + 14} ${x + 30} ${y + 16} ${x + 40} ${y - 4} C ${x + 52} ${y - 8} ${x + 54} ${y - 14} ${x + 44} ${y - 12} C ${x + 10} ${y - 4} ${x - 26} ${y - 6} ${x - 40} ${y - 4} Z`, ptLin(c, 0, y - 12, 0, y + 16, [[0, '#C8783A'], [1, '#5A2A10']]));
  ellipse(c, x, y - 6, 38, 7, '#3A1A08'); ellipse(c, x, y - 7, 32, 5, '#B8862A');
}

function trLock(c, P, w, R) {   // a lock of loose hair: blue-black, a few cold-lit strands
  limb(c, P, [w, w * .8, w * .45, 3], '#08060C');
  for (let k = 0; k < 3; k++) { const o = (R() - .5) * w * .5; c.save(); c.globalAlpha = .3 + R() * .25; limb(c, P.map(([x, y], i) => [x + o * (1 - i / P.length), y]), [3, 2.4, 1.6, 1], ['#262A44', '#3A4064', '#1C1E30'][k]); c.restore(); }
}

// ---------- the Devi seated (design, dhLakshmi's frame moved down TR_DY; no head) ----------
function trHand(c, x, y, ang, sk) {   // a hand curved round his back: the fingers together, seen from the back, alta at the tips
  c.save(); c.translate(x, y); c.rotate(ang);
  const m = 'M -26 -18 C -6 -26 30 -24 52 -14 C 64 -8 66 8 54 14 C 30 22 -4 22 -26 16 C -36 8 -36 -10 -26 -18 Z';
  ptShape(c, m, ptLin(c, 0, -24, 0, 22, [[0, sk.lt], [.5, sk.base], [1, sk.dk]]));
  for (const v of [-7, 1, 9]) limb(c, [[22, v], [40, v + 1], [56, v + 2]], [1.2, 1.4, .8], `rgba(${sk.sh},.5)`, false);
  for (const v of [-10, -2, 6, 13]) ellipse(c, 58, v + 1, 4, 3.2, '#C0303A');
  ellipse(c, -6, -14, 16, 5, rgba(sk.lt, .5));
  c.restore();
}
function trBody(o = {}) {
  const T = !!o.tara, sk = T ? TR_BLUE : TR_WARM;
  return (c) => {
    c.translate(0, TR_DY);
    const R = lcg(T ? 151 : 153), X = TR_X, red = T ? TR_CRIM : TV_SAREE;
    // ---- hair behind: Tara's loose and wild, spreading past her shoulders to the waist; Parvati's long and smooth
    if (T) {
      ptShape(c, `M ${X - 130} 860 C ${X - 260} 900 ${X - 330} 1080 ${X - 320} 1300 C ${X - 300} 1400 ${X - 250} 1440 ${X - 200} 1420 L ${X + 200} 1420 C ${X + 250} 1440 ${X + 300} 1400 ${X + 320} 1300 C ${X + 330} 1080 ${X + 260} 900 ${X + 130} 860 Z`, ptLin(c, X - 330, 0, X + 330, 0, [[0, '#06040A'], [.3, '#16101C'], [.5, '#0C0810'], [.7, '#16101C'], [1, '#06040A']]));
      for (let k = 0; k < 30; k++) { const s = k % 2 ? 1 : -1, j = k >> 1, sp = j * 14, w = (R() - .5) * 40; trLock(c, [[X + s * (60 + j * 6), 900 + j * 10], [X + s * (150 + sp * .6), 1040 + w], [X + s * (220 + sp * .5), 1200 - w], [X + s * (250 + sp * .4 + R() * 40), 1330 + j * 6]], 26 - j * .8, R); }
    } else {
      for (const s of [-1, 1]) ptShape(c, `M ${X + s * 60} 930 C ${X + s * 120} 960 ${X + s * 140} 1080 ${X + s * 170} 1180 C ${X + s * 190} 1260 ${X + s * 200} 1330 ${X + s * 170} 1360 L ${X + s * 110} 1300 C ${X + s * 100} 1200 ${X + s * 80} 1100 ${X + s * 40} 1040 Z`, ptLin(c, X, 0, X + s * 190, 0, [[0, '#120A08'], [.6, '#24160F'], [1, '#0C0605']]));
      // the veil falling behind her shoulders
      ptShape(c, `M ${X - 110} 900 C ${X - 150} 980 ${X - 170} 1080 ${X - 196} 1180 C ${X - 120} 1150 ${X - 60} 1140 ${X} 1140 C ${X + 60} 1140 ${X + 120} 1150 ${X + 196} 1180 C ${X + 170} 1080 ${X + 150} 980 ${X + 110} 900 Z`, ptLin(c, X - 240, 0, X + 240, 0, [[0, TV_SAREE.dk], [.5, TV_SAREE.lt], [1, TV_SAREE.dk]]));
    }
    ellipse(c, X, 950, 112, 108, '#100A0C');
    // ---- Tara's upper arms: her right (screen left) raises the khadga, her left holds the blue lotus
    if (T) for (const s of [-1, 1]) {
      const sh = [X + s * 150, 1200], el = [X + s * 302, 1238], wr = [X + s * 292, 1098];
      ptForm(c, [sh, [X + s * 240, 1236], el], [64, 58, 50], sk, -s * .2, -.9, .45);
      ptForm(c, [el, [X + s * 302, 1170], wr], [50, 44, 38], sk, -s * .4, -.6, .5);
      dhBand(c, [[X + s * 250, 1206], [X + s * 262, 1238], [X + s * 254, 1268]], 12);
      dhBangles(c, [X + s * 292, 1100], -1);
      if (s < 0) {   // the khadga: a heavy blade curving forward at the tip, a gold hilt
        const hx = X - 290, hy = 1060;
        const blade = `M ${hx - 10} ${hy - 20} L ${hx - 14} ${hy - 200} C ${hx - 16} ${hy - 280} ${hx + 10} ${hy - 330} ${hx + 40} ${hy - 352} C ${hx + 30} ${hy - 300} ${hx + 18} ${hy - 260} ${hx + 14} ${hy - 200} L ${hx + 12} ${hy - 20} Z`;
        ptShape(c, blade, ptLin(c, hx - 16, 0, hx + 40, 0, [[0, '#4A5270'], [.35, '#E8EEFA'], [.55, '#9AA4BC'], [1, '#3A4260']]));
        limb(c, [[hx - 2, hy - 30], [hx - 2, hy - 190]], [2, 1], 'rgba(255,255,255,.5)', false);
        limb(c, [[hx - 34, hy - 20], [hx, hy - 24], [hx + 34, hy - 20]], [12, 14, 12], ptLin(c, 0, hy - 30, 0, hy - 10, [[0, '#FFE38C'], [1, '#94631A']]));
        limb(c, [[hx, hy - 14], [hx, hy + 40]], [14, 12], '#5A3610');
      } else {
        limb(c, [[X + s * 290, 1060], [X + s * 292, 1020]], [8, 8], '#2E5A3A');
        c.save(); c.translate(X + s * 292, 990); c.rotate(s * .12);   // the blue lotus (utpala): narrow pointed petals
        for (const a of [-1.1, -.7, -.35, 0, .35, .7, 1.1]) dhPetalAt(c, 0, 20, a, 74 - Math.abs(a) * 10, 18, { base: '#E8EEFF', mid: '#8AA4E8', tip: '#3E5CB8' });
        for (const a of [-.4, 0, .4]) dhPetalAt(c, 0, 24, a, 48, 16, { base: '#F4F6FF', mid: '#B4C6F2', tip: '#5A78CC' });
        ellipse(c, 0, 4, 10, 6, '#F2C84A');
        c.restore();
      }
      dhFist(c, X + s * 290, 1068, s);
    }
    // ---- the lap: Tara in a tiger skin, Parvati in her red saree
    const lap = `M ${X - 150} 1380 C ${X - 260} 1400 ${X - 360} 1450 ${X - 384} 1530 C ${X - 396} 1600 ${X - 320} 1650 ${X - 200} 1652
                 L ${X + 200} 1652 C ${X + 320} 1650 ${X + 396} 1600 ${X + 384} 1530 C ${X + 360} 1450 ${X + 260} 1400 ${X + 150} 1380 Z`;
    if (T) {
      ptShape(c, lap, ptLin(c, 0, 1380, 0, 1652, [[0, TR_TIGER.lt], [.55, TR_TIGER.base], [1, TR_TIGER.dk]]));
      inside(c, lap, () => {
        for (const s of [-1, 1]) { ellipse(c, X + s * 270, 1500, 90, 54, 'rgba(255,214,140,.4)', s * -.2); ellipse(c, X + s * 210, 1610, 120, 28, 'rgba(110,52,14,.5)'); }
        for (let i = 0; i < 26; i++) { const s = i % 2 ? 1 : -1, k = (i >> 1) / 13, x0 = X + s * (390 - k * 330), y0 = 1430 + (i >> 1) % 3 * 60 + (R() - .5) * 20, l = 44 + R() * 30; for (const d of [0, 16]) limb(c, [[x0 - s * d * .3, y0 + d], [x0 - s * (l * .5 + d * .3), y0 + d + 6], [x0 - s * (l + d * .2), y0 + d + 18]], [13, 9, 1.5], '#1A1006'); }
      });
      dhBand(c, [[X - 392, 1590], [X - 300, 1640], [X, 1650], [X + 300, 1640], [X + 392, 1590]], 14);
    } else {
      ptShape(c, lap, ptLin(c, 0, 1380, 0, 1652, [[0, red.lt], [.45, red.base], [1, red.dk]]));
      dhBand(c, [[X - 392, 1590], [X - 300, 1640], [X, 1650], [X + 300, 1640], [X + 392, 1590]], 26);
    }
    // ---- the torso: skin, the choli
    const torso = `M ${X - 44} 1130 C ${X - 92} 1150 ${X - 160} 1158 ${X - 192} 1190 C ${X - 216} 1240 ${X - 206} 1320 ${X - 170} 1400 L ${X + 170} 1400 C ${X + 206} 1320 ${X + 216} 1240 ${X + 192} 1190 C ${X + 160} 1158 ${X + 92} 1150 ${X + 44} 1130 Z`;
    ptShape(c, torso, ptRad(c, X, 1210, 10, 260, [[0, sk.lt], [.55, sk.base], [1, sk.dk]], X, 1260));
    inside(c, torso, () => { ellipse(c, X, 1365, 26, 6, `rgba(${sk.sh},.35)`); ellipse(c, X, 1372, 5, 4, `rgba(${sk.sh},.6)`); });
    const choli = `M ${X - 196} 1214 C ${X - 130} 1196 ${X - 64} 1236 ${X} 1252 C ${X + 64} 1236 ${X + 130} 1196 ${X + 196} 1214 L ${X + 190} 1336 C ${X + 100} 1346 ${X - 100} 1346 ${X - 190} 1336 Z`;
    ptShape(c, choli, ptLin(c, 0, 1200, 0, 1346, [[0, red.lt], [.5, red.base], [1, red.dk]]));
    dhBand(c, [[X - 194, 1216], [X - 130, 1200], [X - 64, 1238], [X, 1254], [X + 64, 1238], [X + 130, 1200], [X + 194, 1216]], 12);
    dhBand(c, [[X - 190, 1334], [X, 1346], [X + 190, 1334]], 12);
    // ---- shoulders (the lower arms come from here; Tara's are in trFront)
    for (const s of [-1, 1]) {
      const sh = [X + s * 182, 1222];
      ellipse(c, sh[0] + s * 4, sh[1] + 4, 46, 50, sk.dk); ellipse(c, sh[0], sh[1], 42, 46, sk.base); ellipse(c, sh[0] - s * 8, sh[1] - 14, 22, 18, rgba(sk.lt, .6));
      ellipse(c, sh[0] + s * 4, sh[1] + 2, 44, 40, red.dk); ellipse(c, sh[0] + s * 2, sh[1] - 2, 40, 36, red.base);
      dhBand(c, [[sh[0] - s * 30, sh[1] + 30], [sh[0] + s * 8, sh[1] + 40], [sh[0] + s * 42, sh[1] + 24]], 10);
    }
    if (!T) {   // Parvati's arms, down at her sides, hands in her lap
      for (const s of [-1, 1]) {
        const sh = [X + s * 186, 1240], el = [X + s * 236, 1400], wr = [X + s * 120, 1520];
        ptForm(c, [sh, [X + s * 220, 1320], el], [64, 60, 52], sk, -s * .3, -.9, .45);
        ptForm(c, [el, [X + s * 180, 1480], wr], [52, 46, 40], sk, -s * .3, -.8, .5);
        dhBangles(c, [X + s * 140, 1500], 1);
      }
      // her pallu over her left shoulder
      const pallu = `M ${X + 120} 1176 C ${X + 170} 1170 ${X + 204} 1196 ${X + 206} 1240 C ${X + 110} 1330 ${X - 30} 1400 ${X - 176} 1440 L ${X - 190} 1356 C ${X - 80} 1340 ${X + 40} 1270 ${X + 120} 1176 Z`;
      ptShape(c, pallu, ptLin(c, X + 200, 1170, X - 180, 1430, [[0, TV_SAREE.lt], [.45, TV_SAREE.base], [1, TV_SAREE.dk]]));
      dhBand(c, [[X + 206, 1242], [X + 110, 1332], [X - 30, 1402], [X - 178, 1442]], 22);
    }
    // ---- the neck, necklaces; Tara's garland of jaba
    const neck = `M ${X - 38} 1070 L ${X + 38} 1070 C ${X + 40} 1110 ${X + 56} 1130 ${X + 90} 1146 L ${X - 90} 1146 C ${X - 56} 1130 ${X - 40} 1110 ${X - 38} 1070 Z`;
    ptShape(c, neck, ptLin(c, 0, 1070, 0, 1146, [[0, sk.dk], [.45, sk.base], [1, sk.base]]));
    dhBand(c, [[X - 42, 1108], [X, 1122], [X + 42, 1108]], 14);
    [-28, -10, 10, 28].forEach((dx, i) => dhGem(c, X + dx, 1118 + Math.abs(dx) * -.14, 4.5, i % 2 ? '#1E8A5A' : '#B0182C'));
    dhBeads(c, [[X - 74, 1146], [X - 50, 1186], [X, 1206], [X + 50, 1186], [X + 74, 1146]], 6, 10);
    if (T) {
      const G = through([[X - 130, 1150], [X - 170, 1300], [X - 150, 1440], [X - 60, 1520], [X + 60, 1520], [X + 150, 1440], [X + 170, 1300], [X + 130, 1150]], 6);
      for (let i = 0; i < G.length; i += 2) { limb(c, [G[i], G[Math.min(G.length - 1, i + 2)]], [6, 6], '#1E3A1A', false); }
      for (let i = 0; i < G.length; i += 3) trJaba(c, G[i][0], G[i][1], 20, i * .9);
    } else {
      dhBeads(c, [[X - 96, 1150], [X - 90, 1240], [X - 40, 1300], [X, 1312], [X + 40, 1300], [X + 90, 1240], [X + 96, 1150]], 5, 11, ['#F4EEE2', '#FFFFFF', '#FFFFFF']);
    }
    // ---- grade: moonlight from above right, lamplight warm from below
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 640, 0, 1700, [[0, 'rgba(190,210,255,.12)'], [.55, 'rgba(190,210,255,0)'], [1, 'rgba(255,140,60,.22)']]); c.fillRect(0, 600, PT_W, 1200);
    c.restore();
  };
}

// ---------- her head (design, in dhLakshmi's head frame; placed with trHd) ----------
function trHead(o = {}) {
  const V = o.god === 'vishnu', T = !!o.tara && !V, BL = T || V, sk = V ? VS_BLUE : T ? TR_BLUE : TR_WARM, eyes = o.eyes || 'front', mouth = o.mouth || 'soft';
  const S = a => `rgba(${sk.sh},${a})`, HL = a => `rgba(${sk.hl},${a})`;
  return (c) => {
    c.translate(TR_X, 1100 + TR_DY); c.scale(TR_HS, TR_HS); c.translate(-TR_X, -1100);
    const X = TR_X, R = lcg(T ? 61 : 63);
    // ears and jhumkas
    for (const s of [-1, 1]) {
      ellipse(c, X + s * 71, 1012, 8, 15, sk.base); ellipse(c, X + s * 72, 1013, 4, 8, sk.dk);
      if (V) {   // makara kundalas: a gold fish curling up from the lobe
        const jx = X + s * 78, jy = 1032;
        ptShape(c, `M ${jx} ${jy} C ${jx + s * 22} ${jy + 4} ${jx + s * 26} ${jy + 34} ${jx + s * 6} ${jy + 46} C ${jx - s * 8} ${jy + 50} ${jx - s * 14} ${jy + 36} ${jx - s * 4} ${jy + 30} C ${jx + s * 8} ${jy + 28} ${jx + s * 8} ${jy + 14} ${jx} ${jy} Z`, ptLin(c, jx - 20, 0, jx + 20, 0, [[0, DH_GOLD.dk], [.45, DH_GOLD.lt], [1, DH_GOLD.base]]));
        dhGem(c, jx + s * 8, jy + 24, 5, '#B0182C'); ellipse(c, jx + s * 4, jy + 50, 4, 5, '#FFFFFF');
        continue;
      }
      dhGem(c, X + s * 78, 1030, 6, '#B0182C');
      const jx = X + s * 80, jy = 1046;
      ptShape(c, `M ${jx - 6} ${jy} C ${jx - 20} ${jy + 12} ${jx - 22} ${jy + 30} ${jx - 20} ${jy + 40} L ${jx + 20} ${jy + 40} C ${jx + 22} ${jy + 30} ${jx + 20} ${jy + 12} ${jx + 6} ${jy} Z`, ptLin(c, jx - 22, 0, jx + 22, 0, [[0, DH_GOLD.dk], [.4, DH_GOLD.lt], [1, DH_GOLD.base]]));
      for (let k = 0; k < 5; k++) ellipse(c, jx - 16 + k * 8, jy + 46, 3.4, 3.8, '#FFFFFF');
      dhBand(c, [[jx - 22, jy + 40], [jx + 22, jy + 40]], 6);
    }
    const faceD = `M ${X - 68} 952 C ${X - 72} 1004 ${X - 64} 1044 ${X - 42} 1074 C ${X - 27} 1096 ${X - 12} 1107 ${X} 1108 C ${X + 12} 1107 ${X + 27} 1096 ${X + 42} 1074 C ${X + 64} 1044 ${X + 72} 1004 ${X + 68} 952 C ${X + 50} 908 ${X - 50} 908 ${X - 68} 952 Z`;
    ptShape(c, faceD, ptRad(c, X - 14, 990, 8, 118, sk.face, X, 1006));
    inside(c, faceD, () => {
      ellipse(c, X + 62, 1020, 20, 70, S(.22)); ellipse(c, X - 64, 1020, 12, 60, S(.12));
      for (const s of [-1, 1]) { ellipse(c, X + s * 34, 980, 24, 8, S(.14)); ellipse(c, X + s * 42, 1036, 17, 11, BL ? 'rgba(150,120,220,.16)' : 'rgba(236,128,112,.17)'); ellipse(c, X + s * 36, 1014, 22, 7, HL(.22)); }
      ellipse(c, X, 940, 40, 14, HL(.3)); ellipse(c, X + 9, 1012, 5, 24, S(.16)); ellipse(c, X, 1056, 5, 5, S(.1));
      ellipse(c, X, 1084, 13, 3.5, S(.28)); ellipse(c, X - 2, 1093, 13, 7, HL(.4)); ellipse(c, X, 1106, 30, 6, S(.28));
    });
    // the eyes (as dhLakshmi's): open looking at us, lowered looking down, or shut
    const EI = 16, EO = 52, EY = 993, dn = eyes === 'down';
    const eye = s => dn ? `M ${X + s * EI} ${EY + 3} C ${X + s * 22} ${EY - 1} ${X + s * 38} ${EY - 3} ${X + s * EO} ${EY + 1} C ${X + s * 40} ${EY + 7} ${X + s * 24} ${EY + 8} ${X + s * EI} ${EY + 3} Z`
      : `M ${X + s * EI} ${EY + 2} C ${X + s * 21} ${EY - 7} ${X + s * 38} ${EY - 10} ${X + s * EO} ${EY - 2} C ${X + s * 40} ${EY + 7} ${X + s * 24} ${EY + 8} ${X + s * EI} ${EY + 2} Z`;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const s of [-1, 1]) {
      c.save(); c.globalAlpha = .32; ptShape(c, `M ${X + s * (EI - 1)} ${EY + 1} C ${X + s * 20} ${EY - 16} ${X + s * 42} ${EY - 18} ${X + s * (EO + 6)} ${EY - 5} C ${X + s * 40} ${EY - 11} ${X + s * 22} ${EY - 8} ${X + s * (EI - 1)} ${EY + 1} Z`, BL ? 'rgba(110,70,160,.7)' : 'rgba(178,92,70,.6)'); c.restore();
      c.strokeStyle = S(.5); c.lineWidth = 1.3; c.beginPath(); c.moveTo(X + s * 20, EY - 10); c.bezierCurveTo(X + s * 28, EY - 17, X + s * 42, EY - 17, X + s * 50, EY - 10); c.stroke();
      if (eyes !== 'shut') {
        ptShape(c, eye(s), ptLin(c, X + s * EI, 0, X + s * EO, 0, [[0, '#E4D6D0'], [.25, '#F8F2EC'], [.75, '#F6EEE6'], [1, '#D8C4B8']]));
        inside(c, eye(s), () => {
          const ix = X + s * 33 + (o.look || 0) * 3, iy = EY - .5 + (dn ? 4.5 : 0);
          ellipse(c, ix, iy, 7.6, 7.6, '#1C0E08');
          ellipse(c, ix, iy, 6.7, 6.7, ptRad(c, ix, iy + 2, 1, 6.7, [[0, '#8A5426'], [.6, '#5A3216'], [1, '#3A1E0C']]));
          ellipse(c, ix, iy, 2.9, 2.9, '#0A0402');
          ellipse(c, ix - s * 2.4, iy - 2.4, 1.6, 1.5, '#FFFFFF'); ellipse(c, ix + s * 2, iy + 2.6, .8, .8, 'rgba(255,255,255,.7)');
          ellipse(c, X + s * 34, EY - (dn ? 4 : 9), 22, dn ? 5 : 4, 'rgba(50,24,30,.5)');
          ellipse(c, X + s * (EI + 2), EY + 2, 2.6, 2, 'rgba(220,130,130,.6)');
          if (o.tear) ellipse(c, X + s * 34, EY + 6, 16, 2.4, 'rgba(230,245,255,.75)');   // the eye brimming
        });
        if (dn) limb(c, [[X + s * (EI - 1), EY + 3], [X + s * 22, EY - 1], [X + s * 38, EY - 3], [X + s * EO, EY + 1], [X + s * (EO + 9), EY - 4]], [1.2, 3, 3.4, 2.8, .6], '#120806');
        else limb(c, [[X + s * (EI - 1), EY + 2], [X + s * 22, EY - 7], [X + s * 38, EY - 10], [X + s * EO, EY - 2], [X + s * (EO + 9), EY - 7]], [1.2, 2.8, 3.2, 2.6, .6], '#120806');
        limb(c, [[X + s * (EI + 1), EY + 3], [X + s * 28, EY + 7.5], [X + s * 42, EY + 5.5], [X + s * EO, EY - 1.5]], [.6, 1.5, 1.7, 1], 'rgba(22,10,8,.85)');
        if (dn) { c.strokeStyle = '#120806'; c.lineWidth = 1; for (let k = 0; k < 5; k++) { const x = X + s * (24 + k * 5.5); c.beginPath(); c.moveTo(x, EY + 1); c.lineTo(x + s * 1.2, EY + 5); c.stroke(); } }
      } else {
        ptShape(c, eye(s), BL ? 'rgba(60,70,130,.5)' : 'rgba(196,118,92,.45)');
        limb(c, [[X + s * (EI - 1), EY + 2], [X + s * 28, EY + 6], [X + s * 42, EY + 4], [X + s * EO, EY - 2], [X + s * (EO + 9), EY - 7]], [1.2, 2.6, 2.8, 2.2, .6], '#120806');
        c.strokeStyle = '#120806'; c.lineWidth = 1; for (let k = 0; k < 5; k++) { const x = X + s * (24 + k * 5.5); c.beginPath(); c.moveTo(x, EY + 6); c.lineTo(x + s * 1.4, EY + 10); c.stroke(); }
      }
      // the brows: Parvati's knit a little in grief
      const lift = mouth === 'sad' ? 1 : 0, ang = o.brow === 'angry' ? 1 : 0;
      limb(c, [[X + s * 17, EY - 15 - lift * 4 + ang * 6], [X + s * 30, EY - 22 - lift * 2 + ang * 1], [X + s * 45, EY - 23 - ang * 2], [X + s * 61, EY - 17 - ang * 3]], [2.2 + ang, 3.2 + ang, 2.4 + ang * .6, .7], '#1A0C08');
    }
    if (o.tear) {   // one tear down her right cheek (screen left)
      ptShape(c, `M ${X - 40} 1004 C ${X - 43} 1020 ${X - 44} 1034 ${X - 42} 1046 C ${X - 40} 1052 ${X - 34} 1052 ${X - 34} 1044 C ${X - 34} 1032 ${X - 37} 1018 ${X - 40} 1004 Z`, 'rgba(220,240,255,.6)');
      ellipse(c, X - 38, 1044, 2.4, 3, 'rgba(255,255,255,.95)');
    }
    // the nose
    limb(c, [[X + 10, 1000], [X + 10, 1016], [X + 12, 1030]], [.6, 1.6, 1.2], S(.3));
    ellipse(c, X - 1, 1033, 7, 5, HL(.5));
    c.strokeStyle = BL ? 'rgba(14,20,60,.75)' : 'rgba(112,48,32,.75)'; c.lineWidth = 2;
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(X + s * 14, 1033); c.bezierCurveTo(X + s * 17, 1042, X + s * 11, 1046, X + s * 6, 1043.5); c.stroke(); }
    c.lineWidth = 1.5; c.beginPath(); c.moveTo(X - 6, 1043.5); c.quadraticCurveTo(X, 1046.5, X + 6, 1043.5); c.stroke();
    ellipse(c, X - 7, 1042, 2.8, 1.6, BL ? '#101640' : '#5E2618'); ellipse(c, X + 7, 1042, 2.8, 1.6, BL ? '#101640' : '#5E2618');
    // the lips: a soft smile, a gentle one, or sad (corners down)
    const up = mouth === 'smile' ? 1 : mouth === 'sad' ? -1 : mouth === 'firm' ? -.4 : .35;
    ptShape(c, `M ${X - 22} ${1063 - up * 1.5} C ${X - 14} 1061 ${X - 10} 1058 ${X - 5} 1059 C ${X - 2} 1059 ${X - 1} 1061 ${X} 1061.5 C ${X + 1} 1061 ${X + 2} 1059 ${X + 5} 1059 C ${X + 10} 1058 ${X + 14} 1061 ${X + 22} ${1063 - up * 1.5} C ${X + 12} 1067 ${X - 12} 1067 ${X - 22} ${1063 - up * 1.5} Z`, ptLin(c, 0, 1058, 0, 1067, BL ? [[0, '#9A2A48'], [1, '#701438']] : [[0, '#B4323E'], [1, '#8E1C2A']]));
    ptShape(c, `M ${X - 19} 1065 C ${X - 12} ${1078 + up} ${X + 12} ${1078 + up} ${X + 19} 1065 C ${X + 10} 1069.5 ${X - 10} 1069.5 ${X - 19} 1065 Z`, ptLin(c, 0, 1066, 0, 1079, BL ? [[0, '#A0304E'], [.6, '#BC4A68'], [1, '#A0384E']] : [[0, '#B83442'], [.6, '#D0505C'], [1, '#B83E4A']]));
    ellipse(c, X + 1, 1073, 6, 2, 'rgba(255,214,220,.55)');
    c.strokeStyle = BL ? '#3A0820' : '#5A0E18'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(X - 24, 1064 - up * 4); c.quadraticCurveTo(X - 18, 1066 - up, X - 12, 1067); c.quadraticCurveTo(X, 1069, X + 12, 1067); c.quadraticCurveTo(X + 18, 1066 - up, X + 24, 1064 - up * 4); c.stroke();
    if (up > .5) for (const s of [-1, 1]) ellipse(c, X + s * 38, 1040, 15, 10, HL(.3));
    if (!V) { c.strokeStyle = DH_GOLD.base; c.lineWidth = 3; c.beginPath(); c.arc(X + 12, 1052, 12, -1.9, 1.3); c.stroke();
    dhGem(c, X + 23, 1058, 3, '#B0182C'); }
    // the hair over the brow, parted; sindoor in the parting
    ptShape(c, `M ${X - 80} 990 C ${X - 84} 930 ${X - 50} 900 ${X} 896 C ${X + 50} 900 ${X + 84} 930 ${X + 80} 990 C ${X + 70} 950 ${X + 40} 926 ${X + 2} 930 L ${X - 2} 930 C ${X - 40} 926 ${X - 70} 950 ${X - 80} 990 Z`, '#120A0C');
    for (const s of [-1, 1]) { c.save(); c.globalAlpha = .4; limb(c, [[X + s * 4, 904], [X + s * 44, 916], [X + s * 74, 962]], [3, 2.4, 1.4], '#5A3E40'); c.restore(); }
    if (T) {   // loose strands falling over her temples
      for (const s of [-1, 1]) for (let k = 0; k < 3; k++) limb(c, [[X + s * (60 + k * 6), 930], [X + s * (82 + k * 8), 990], [X + s * (78 + k * 10), 1060 + k * 20]], [6, 4, 1.5], '#100A0E');
    }
    if (!V && o.sindoor !== false) limb(c, [[X, 900], [X, 928]], [3, 2], '#C8102A');
    // the third eye (Tara: open, upright) or the bindi (Parvati)
    if (T) {
      const ty = 952, th = o.third ?? 1;
      ptShape(c, `M ${X} ${ty - 15} C ${X + 8} ${ty - 6} ${X + 8} ${ty + 6} ${X} ${ty + 15} C ${X - 8} ${ty + 6} ${X - 8} ${ty - 6} ${X} ${ty - 15} Z`, '#120806');
      if (th > 0) { c.save(); c.translate(X, ty); c.scale(th, 1); ptShape(c, `M 0 -12 C 6 -5 6 5 0 12 C -6 5 -6 -5 0 -12 Z`, '#F6EEE6'); ellipse(c, 0, 0, 4.2, 5, '#8A2A16'); ellipse(c, 0, 0, 2, 2.6, '#0A0402'); ellipse(c, -1.2, -1.6, 1, 1, '#FFFFFF'); c.restore(); }
      ellipse(c, X, 974, 4, 4, '#C8102A');
    } else if (V) {   // the urdhva pundra: a white U of sandal paste, a red line up its middle
      for (const sd of [-1, 1]) limb(c, [[X + sd * 10, 930], [X + sd * 10, 966], [X + sd * 4, 980]], [4, 4, 3], '#F6EEDC');
      limb(c, [[X - 4, 980], [X, 983], [X + 4, 980]], [3, 3, 3], '#F6EEDC', false); limb(c, [[X, 934], [X, 974]], [3.4, 2.6], '#D0202A');
    } else { dhGem(c, X, 968, 5, '#C41E32'); ellipse(c, X, 959, 2.2, 2.2, DH_GOLD.lt); }
    // the crown: a coronet of seven pointed gold petals on a jewelled band; Tara's with jaba tucked at the sides
    if (V) vsKirita(c, X);
    else for (let k = -3; k <= 3; k++) {
      const x = X + k * 25, h = (T ? 92 : 74) - Math.abs(k) * 10, a = k * .1;
      c.save(); c.translate(x, 910); c.rotate(a);
      const leaf = `M -15 0 C -20 ${-h * .45} -8 ${-h * .8} 0 ${-h} C 8 ${-h * .8} 20 ${-h * .45} 15 0 Z`;
      ptShape(c, leaf, ptLin(c, -16, 0, 16, 0, [[0, DH_GOLD.dk], [.4, DH_GOLD.lt], [1, DH_GOLD.base]]));
      c.strokeStyle = DH_GOLD.dk; c.lineWidth = 2; c.stroke(new Path2D(leaf));
      dhGem(c, 0, -h * .42, k ? 5 : 8, k % 2 ? '#1E8A5A' : '#B0182C'); ellipse(c, 0, -h * .82, 2.4, 2.4, '#FFF6DA');
      c.restore();
    }
    if (!V) { dhBand(c, [[X - 88, 904], [X, 914], [X + 88, 904]], 20);
    for (let k = -3; k <= 3; k++) dhGem(c, X + k * 25, 908 + Math.abs(k) * -.6, k % 2 ? 4.5 : 5.5, k % 2 ? '#1E8A5A' : '#B0182C');
    for (let k = -8; k <= 8; k++) ellipse(c, X + k * 10.5, 920 - Math.abs(k) * .5, 2.4, 2.8, '#FFFFFF'); }
    if (T) { trJaba(c, X - 96, 900, 22, .4); trJaba(c, X + 96, 900, 22, -.4); }
    else if (V) { for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) limb(c, [[X + sd * (70 + k * 6), 940], [X + sd * (86 + k * 8), 1010], [X + sd * (90 + k * 10), 1090 + k * 16]], [9, 7, 2], '#0C0810'); }
    else {   // Parvati's veil over the back of the crown, framing her face
      ptShape(c, `M ${X - 100} 960 C ${X - 120} 880 ${X - 70} 830 ${X} 828 C ${X + 70} 830 ${X + 120} 880 ${X + 100} 960 C ${X + 110} 1000 ${X + 104} 1040 ${X + 96} 1080 L ${X + 84} 1080 C ${X + 92} 1000 ${X + 90} 940 ${X + 80} 900 C ${X + 40} 880 ${X - 40} 880 ${X - 80} 900 C ${X - 90} 940 ${X - 92} 1000 ${X - 84} 1080 L ${X - 96} 1080 C ${X - 104} 1040 ${X - 110} 1000 ${X - 100} 960 Z`, ptLin(c, X - 120, 0, X + 120, 0, [[0, TV_SAREE.dk], [.5, TV_SAREE.lt], [1, TV_SAREE.dk]]));
      dhBand(c, [[X - 98, 1076], [X - 104, 960], [X - 70, 860], [X, 838], [X + 70, 860], [X + 104, 960], [X + 98, 1076]], 8);
    }
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 820, 0, 1110, [[0, 'rgba(200,220,255,.12)'], [1, 'rgba(255,150,80,.1)']]); c.fillRect(X - 200, 780, 400, 340);
    c.restore();
  };
}


// ======================================================================================================================
// The reel's own designs (stage px, 1080 × 1920)
// ======================================================================================================================
const TV_GOLD = DH_GOLD;
const TV_LEAF = ['#1E5A2C', '#2C7438', '#3E8E44', '#57A852', '#173F22'];
const TV_CX = 540, TV_TOP = 1236, TV_BASE = 1660;                  // the vrindavan (tulsi planter): centre x, top, foot
const TV_PLANT = [TV_CX, TV_TOP - 10];                              // where the tulsi grows from
const TV_NICHE = [TV_CX, TV_TOP + 236];                             // the lamp in the vrindavan's niche
const TV_STONE = [TV_CX, 1772];                                     // the Shaligram on its plate, in front
const TV_CMOON = [842, 196];                                         // the full moon over the courtyard
const TV_CLAMPS = [[120, 1846], [260, 1872], [820, 1872], [960, 1846]];
const TV_DOORLAMPS = [[300, 1236], [780, 1236]];
const TV_APEX = [TV_CX, 470];                                        // where the sugarcane meets

// ---------- the tulsi: holy basil, a bush of opposite leaf pairs with purple spikes (manjari) at the tips ----------
// (x, y): the foot of the stem; s: scale (1 ≈ 560 px tall); o.dark: back-lit (night), o.seed
function tvTulsi(c, x, y, s = 1, o = {}) {
  const R = lcg(o.seed || 7), B = [];
  const n = o.n || 11;
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1) - .5, a = -Math.PI / 2 + f * 2.1 + (R() - .5) * .18, l = (380 + R() * 140) * s * (1 - Math.abs(f) * .5);
    const bend = f * .5 + (R() - .5) * .2, P = [[x + f * 20 * s, y]];
    for (let k = 1; k <= 5; k++) { const u = k / 5, aa = a + bend * u; P.push([P[k - 1][0] + Math.cos(aa) * l / 5, P[k - 1][1] + Math.sin(aa) * l / 5]); }
    B.push({ P, depth: Math.abs(f) < .2 ? 1 : R() < .5 ? 0 : 1 });
  }
  // a dark leafy mass behind, for volume
  for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (R() - .5) * 2.4, d = (.25 + R() * .55) * 360 * s; ellipse(c, x + Math.cos(a) * d * .8, y - 40 * s + Math.sin(a) * d * .9, (60 + R() * 50) * s, (50 + R() * 40) * s, ['#10301A', '#143A20', '#0C2614'][R() * 3 | 0]); }
  // the woody stems
  for (const { P } of B) limb(c, P, [10 * s, 8 * s, 6 * s, 4 * s, 3 * s, 2 * s], '#4A3A22');
  limb(c, [[x - 8 * s, y + 10 * s], [x, y - 60 * s]], [22 * s, 14 * s], '#3A2C1A');
  const leaf = (lx, ly, l, w, a, col, hi) => {
    c.save(); c.translate(lx, ly); c.rotate(a);
    const d = `M 0 0 C ${w} ${-l * .2} ${w * 1.05} ${-l * .7} 0 ${-l} C ${-w * 1.05} ${-l * .7} ${-w} ${-l * .2} 0 0 Z`;
    ptShape(c, d, ptLin(c, -w, 0, w, 0, [[0, col[0]], [.5, col[1]], [1, col[0]]]));
    limb(c, [[0, -l * .08], [0, -l * .85]], [1.4 * s + .4, .6], hi, false);
    c.restore();
  };
  // two passes: the far leaves darker, then the near ones lit from above
  for (const pass of [0, 1]) for (const { P, depth } of B) {
    if (depth !== pass) continue;
    const C = through(P, 6);
    for (let i = 3; i < C.length; i += 2) {
      const [px, py] = C[i], u = i / C.length, ang = Math.atan2(C[i][1] - C[i - 1][1], C[i][0] - C[i - 1][0]);
      const l = (50 - u * 22) * s * (.8 + R() * .4), w = l * .42;
      const lit = clamp(.15 + (y - py) / (600 * s) * .7 + pass * .2 + (R() - .5) * .35);
      const col = lit > .72 ? [TV_LEAF[2], TV_LEAF[3]] : lit > .5 ? [TV_LEAF[1], TV_LEAF[2]] : lit > .3 ? [TV_LEAF[4], TV_LEAF[1]] : ['#0E2A16', TV_LEAF[4]];
      const hi = lit > .6 ? 'rgba(200,240,170,.5)' : 'rgba(120,170,110,.4)';
      for (const sd of [-1, 1]) leaf(px, py, l, w, ang + Math.PI / 2 + sd * (1.05 + R() * .35), col, hi);
    }
    // the tip: a tuft of small leaves and a purple-brown manjari spike
    const [tx, ty] = P[P.length - 1], ta = Math.atan2(ty - P[P.length - 2][1], tx - P[P.length - 2][0]);
    for (let k = 0; k < 4; k++) leaf(tx, ty, 26 * s, 11 * s, ta + Math.PI / 2 + (R() - .5) * 1.6, [TV_LEAF[2], TV_LEAF[3]], 'rgba(200,240,170,.5)');
    const sp = []; for (let k = 0; k < 7; k++) sp.push([tx + Math.cos(ta) * k * 9 * s, ty + Math.sin(ta) * k * 9 * s]);
    limb(c, sp, sp.map((_, k) => (5 - k * .5) * s), '#5A3A4E');
    sp.forEach(([sx, sy], k) => { if (k % 2) for (const sd of [-1, 1]) ellipse(c, sx + sd * 5 * s, sy, 3.4 * s, 2.2 * s, k > 3 ? '#B48AB8' : '#8A5A86'); });
  }
  if (o.dark) { c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = 'rgba(8,16,30,.35)'; c.fillRect(x - 600 * s, y - 700 * s, 1200 * s, 760 * s); c.restore(); }
}

// ---------- the Shaligram: a black river stone, smooth as glass, a spiral (chakra) on its face ----------
function tvStone(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (o.plate) {   // a small brass plate, a few tulsi leaves and marigold petals on it
    ellipse(c, 0, 34, 132, 30, 'rgba(0,0,0,.45)');
    ellipse(c, 0, 26, 122, 28, ptLin(c, -120, 0, 120, 0, [[0, TV_GOLD.dk], [.35, TV_GOLD.lt], [.7, TV_GOLD.base], [1, TV_GOLD.dk]]));
    ellipse(c, 0, 22, 104, 20, ptLin(c, 0, 4, 0, 40, [[0, '#8A5A16'], [1, '#E8B84A']]));
    const R = lcg(3);
    for (let i = 0; i < 9; i++) { const a = R() * TAU; ellipse(c, Math.cos(a) * 80, 22 + Math.sin(a) * 14, 9, 6, R() < .5 ? '#F29A1E' : '#FFC23A', a); }
    for (const [lx, a] of [[-70, -.6], [-52, -1.2], [64, .7], [80, 1.3]]) { c.save(); c.translate(lx, 20); c.rotate(a); ptShape(c, 'M 0 0 C 9 -6 9 -20 0 -28 C -9 -20 -9 -6 0 0 Z', '#3E8E44'); c.restore(); }
  }
  ellipse(c, 0, 18, 70, 14, 'rgba(0,0,0,.6)');
  const body = 'M -80 -4 C -84 -46 -40 -66 4 -64 C 52 -62 84 -38 80 -2 C 78 26 40 40 0 40 C -42 40 -78 26 -80 -4 Z';
  ptShape(c, body, ptRad(c, -20, -34, 4, 96, [[0, '#4A4E58'], [.35, '#22252C'], [.8, '#0C0D12'], [1, '#050608']]));
  inside(c, body, () => {
    // the chakra: an ammonite's spiral, worn smooth, a shade lighter than the stone
    c.save(); c.translate(6, -14); c.lineCap = 'round';
    for (let k = 0; k < 2; k++) {
      c.beginPath();
      for (let a = 0; a < TAU * 2.6; a += .08) { const r = 3 + a * 5.2; const px = Math.cos(a) * r, py = Math.sin(a) * r * .72; a ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.strokeStyle = k ? (o.glow ? 'rgba(255,214,120,.95)' : 'rgba(176,164,140,.75)') : 'rgba(0,0,0,.7)'; c.lineWidth = k ? 3 : 6; c.stroke();
    }
    for (let a = .6; a < TAU * 2.6; a += .55) { const r = 3 + a * 5.2; limb(c, [[Math.cos(a) * r * .8, Math.sin(a) * r * .58], [Math.cos(a) * r * 1.08, Math.sin(a) * r * .78]], [1.6, 1.2], o.glow ? 'rgba(255,200,110,.6)' : 'rgba(140,130,115,.35)', false); }
    c.restore();
    ellipse(c, -26, -40, 24, 10, 'rgba(255,255,255,.28)', -.4); ellipse(c, -32, -44, 8, 3, 'rgba(255,255,255,.7)', -.4);
    ellipse(c, 30, 26, 40, 10, 'rgba(255,170,90,.18)');
  });
  if (o.tilak) { limb(c, [[-6, -52], [-8, -34]], [4, 3], '#F2E2C0'); limb(c, [[6, -52], [8, -34]], [4, 3], '#F2E2C0'); limb(c, [[0, -50], [0, -36]], [3, 2], '#D0202A'); }
  c.restore();
}

// ---------- the vrindavan: the tulsi's planter, whitewashed, a red border, a lamp niche, four corner turrets ----------
function tvChaura(c) {
  const x = TV_CX, t = TV_TOP, b = TV_BASE, tw = 170, bw = 196;
  ellipse(c, x, b + 6, 260, 30, 'rgba(0,0,0,.5)');
  // the foot: two steps
  poly(c, [[x - bw - 40, b - 40], [x + bw + 40, b - 40], [x + bw + 52, b + 10], [x - bw - 52, b + 10]], ptLin(c, 0, b - 40, 0, b + 10, [[0, '#D8C6A8'], [1, '#7A6248']]));
  poly(c, [[x - bw - 20, b - 76], [x + bw + 20, b - 76], [x + bw + 32, b - 40], [x - bw - 32, b - 40]], ptLin(c, 0, b - 76, 0, b - 40, [[0, '#E8D8BC'], [1, '#9A8064']]));
  // the body, tapering, its right side in shadow
  const front = [[x - tw, t + 40], [x + tw, t + 40], [x + bw, b - 76], [x - bw, b - 76]];
  poly(c, front, ptLin(c, x - bw, 0, x + bw, 0, [[0, '#F6EAD2'], [.55, '#EADAB8'], [1, '#B8A080']]));
  inside(c, `M ${front.map(p => p.join(' ')).join(' L ')} Z`, () => {
    const R = lcg(41); for (let i = 0; i < 26; i++) ellipse(c, x - bw + R() * bw * 2, t + 60 + R() * (b - t - 140), 20 + R() * 40, 8 + R() * 14, `rgba(150,120,90,${.04 + R() * .06})`);
    // the red ochre border and a band of white dots, a painted Om and the lamp's niche
    for (const [dy, w] of [[52, 14], [b - t - 100, 14]]) limb(c, [[x - bw - 10, t + dy], [x + bw + 10, t + dy]], [w, w], '#B4281E', false);
    for (let k = 0; k < 2; k++) for (const sx of [-1, 1]) limb(c, [[x + sx * (tw - 18 + k * 4), t + 70], [x + sx * (bw - 18 + k * 2), b - 110]], [8, 8], '#B4281E', false);
    for (let i = -6; i <= 6; i++) ellipse(c, x + i * 24, t + 74, 3.6, 3.6, '#FFF8E8');
    text(c, 'ॐ', x, t + 128, '68px "Tiro Devanagari Sanskrit"', '#B4281E');
    ptShape(c, `M ${x - 52} ${t + 290} L ${x - 52} ${t + 214} C ${x - 52} ${t + 176} ${x - 26} ${t + 160} ${x} ${t + 150} C ${x + 26} ${t + 160} ${x + 52} ${t + 176} ${x + 52} ${t + 214} L ${x + 52} ${t + 290} Z`, ptLin(c, 0, t + 150, 0, t + 290, [[0, '#2A1A10'], [1, '#4A2A14']]));
    ellipse(c, x, t + 250, 52, 44, 'rgba(255,170,80,.45)');
    trDiya(c, x, t + 274);
    // swastiks either side of the niche, in sindoor
    for (const sx of [-1, 1]) { c.save(); c.translate(x + sx * 112, t + 220); c.strokeStyle = '#C0301E'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-14, 0); c.lineTo(14, 0); c.moveTo(0, -14); c.lineTo(0, 14); c.moveTo(0, -14); c.lineTo(10, -14); c.moveTo(14, 0); c.lineTo(14, 10); c.moveTo(0, 14); c.lineTo(-10, 14); c.moveTo(-14, 0); c.lineTo(-14, -10); c.stroke(); for (const [dx, dy] of [[-7, -7], [7, -7], [7, 7], [-7, 7]]) ellipse(c, dx, dy, 2.2, 2.2, '#C0301E'); c.restore(); }
  });
  // the top: a cornice, the soil, four little corner turrets
  poly(c, [[x - tw - 26, t + 4], [x + tw + 26, t + 4], [x + tw + 16, t + 42], [x - tw - 16, t + 42]], ptLin(c, 0, t, 0, t + 42, [[0, '#FFF6E2'], [1, '#B8A080']]));
  limb(c, [[x - tw - 26, t + 8], [x + tw + 26, t + 8]], [6, 6], '#B4281E', false);
  ellipse(c, x, t + 2, tw + 10, 18, '#3A2616'); ellipse(c, x, t - 2, tw - 10, 12, '#4E3420');
  for (const sx of [-1, 1]) {
    const cx = x + sx * (tw + 8);
    poly(c, [[cx - 20, t + 6], [cx + 20, t + 6], [cx + 16, t - 40], [cx - 16, t - 40]], ptLin(c, cx - 20, 0, cx + 20, 0, [[0, '#FFF2DA'], [1, '#C8B090']]));
    ptShape(c, `M ${cx - 22} ${t - 38} C ${cx - 22} ${t - 70} ${cx - 6} ${t - 86} ${cx} ${t - 96} C ${cx + 6} ${t - 86} ${cx + 22} ${t - 70} ${cx + 22} ${t - 38} Z`, ptLin(c, cx - 22, 0, cx + 22, 0, [[0, '#FFF6E2'], [1, '#C0A888']]));
    limb(c, [[cx - 22, t - 40], [cx + 22, t - 40]], [5, 5], '#B4281E', false);
    ellipse(c, cx, t - 98, 5, 5, TV_GOLD.base);
  }
}

// ---------- the chunari: a red bridal veil with a gold border laid over the top of the tulsi; a marigold garland ----------
function tvChunari(c, x = TV_PLANT[0], y = TV_PLANT[1], s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const veil = `M -150 -250 C -170 -330 -100 -446 -6 -452 C 90 -446 170 -340 150 -250 C 100 -226 40 -218 0 -218 C -40 -218 -100 -226 -150 -250 Z`;
  c.save(); c.globalAlpha = .42;
  ptShape(c, veil, ptLin(c, -240, -450, 240, -140, [[0, '#F0485A'], [.45, '#D01834'], [1, '#86081C']]));
  c.restore();
  inside(c, veil, () => {
    const R = lcg(13); for (let i = 0; i < 40; i++) ellipse(c, -150 + R() * 300, -440 + R() * 230, 2.4, 2.4, 'rgba(255,214,120,.9)');
    for (let k = 0; k < 6; k++) limb(c, [[-120 + k * 48, -430], [-170 + k * 66, -300], [-200 + k * 80, -150]], [2, 7, 4], 'rgba(70,0,14,.28)');
    ellipse(c, -70, -380, 90, 40, 'rgba(255,210,210,.22)', -.5);
  });
  const H = through([[-150, -250], [-100, -226], [-40, -218], [0, -218], [40, -218], [100, -226], [150, -250]], 4);
  dhBand(c, H, 12);
  H.forEach(([hx, hy], i) => { if (i % 2) { ellipse(c, hx, hy + 18, 4, 7, TV_GOLD.lt); ellipse(c, hx, hy + 26, 3, 3, TV_GOLD.base); } });
  // a little gold mukut on the crown and a garland of marigolds round the bush below
  for (let k = -2; k <= 2; k++) { c.save(); c.translate(k * 16, -446); c.rotate(k * .2); ptShape(c, 'M -9 0 C -12 -20 -4 -34 0 -42 C 4 -34 12 -20 9 0 Z', ptLin(c, -10, 0, 10, 0, [[0, TV_GOLD.dk], [.4, TV_GOLD.lt], [1, TV_GOLD.base]])); c.restore(); }
  dhBand(c, [[-44, -444], [0, -452], [44, -444]], 10);
  const G = through([[-250, -70], [-130, -20], [0, -6], [130, -20], [250, -70]], 6);
  for (let i = 0; i < G.length; i++) { const [gx, gy] = G[i]; ellipse(c, gx, gy, 15, 15, i % 2 ? '#F28A12' : '#FFB21E'); ellipse(c, gx - 3, gy - 3, 6, 6, 'rgba(255,230,140,.7)'); }
  c.restore();
}

// the bride's red saree tied round the vrindavan's top, pleated, a gold border along its scalloped hem
function tvSaree(c) {
  const x = TV_CX, t = TV_TOP, w = 196;
  const P = [[x - w - 8, t + 30]];
  for (let i = 0; i <= 8; i++) { const u = i / 8; P.push([x - w + u * w * 2, t + 112 + Math.sin(u * Math.PI * 8) * 8 + Math.sin(u * Math.PI) * 14]); }
  const d = `M ${x - w - 14} ${t + 24} L ${x + w + 14} ${t + 24} L ${P[P.length - 1][0] + 10} ${P[P.length - 1][1]} ` + P.slice(1).reverse().map(p => `L ${p[0]} ${p[1]}`).join(' ') + ' Z';
  ptShape(c, d, ptLin(c, x - w, 0, x + w, 0, [[0, '#8A0A1E'], [.3, '#D81E38'], [.6, '#C01430'], [1, '#6A0614']]));
  inside(c, d, () => { for (let k = 0; k < 9; k++) limb(c, [[x - w + k * 49, t + 30], [x - w + k * 49 + 6, t + 120]], [3, 6], 'rgba(60,0,10,.3)'); const R = lcg(17); for (let i = 0; i < 40; i++) ellipse(c, x - w + R() * w * 2, t + 34 + R() * 70, 2.4, 2.4, 'rgba(255,214,120,.85)'); });
  dhBand(c, P.slice(1), 14); dhBand(c, [[x - w - 14, t + 28], [x + w + 14, t + 28]], 12);
}

// ---------- the mandap: four sugarcanes leaning in, tied at the top with red mauli, their leaves falling over ----------
function tvCane(c, P, w, R, dark = 0) {
  const C = through(P, 10);
  limb(c, C, C.map(() => w), dark ? '#2A3A1C' : '#3E5A26');
  c.save(); c.globalAlpha = .7; limb(c, C.map(([x, y]) => [x - w * .18, y]), C.map(() => w * .4), dark ? '#4A5A2A' : '#7E9A44'); c.restore();
  for (let i = 1; i < C.length - 1; i += 1) { const [x, y] = C[i], a = Math.atan2(C[i + 1][1] - y, C[i + 1][0] - x) + Math.PI / 2; limb(c, [[x - Math.cos(a) * w * .55, y - Math.sin(a) * w * .55], [x + Math.cos(a) * w * .55, y + Math.sin(a) * w * .55]], [3, 3], dark ? '#1E2614' : '#5E3A4A', false); }
}
function tvCaneLeaves(c, x, y, R, n = 14, s = 1) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (R() - .5) * 2.6, l = (200 + R() * 160) * s, P = [[x, y]];
    for (let k = 1; k <= 4; k++) { const u = k / 4; P.push([x + Math.cos(a) * l * u, y + Math.sin(a) * l * u + u * u * l * .9]); }
    limb(c, P, [7 * s, 9 * s, 6 * s, 3 * s, 1], R() < .5 ? '#4E7A2E' : '#3A6224');
    c.save(); c.globalAlpha = .5; limb(c, P, [2, 2, 1.5, 1, .5], '#A8C878', false); c.restore();
  }
}
function tvMandap(c, part) {
  const R = lcg(part === 'back' ? 21 : 23), [ax, ay] = TV_APEX;
  if (part === 'back') {
    tvCane(c, [[360, 1500], [430, 1000], [ax - 16, ay + 20]], 16, R, 1);
    tvCane(c, [[720, 1500], [650, 1000], [ax + 16, ay + 20]], 16, R, 1);
    tvCaneLeaves(c, ax, ay, R, 18, .9);
  } else {
    tvCane(c, [[190, 1900], [330, 1200], [ax - 8, ay + 4]], 26, R);
    tvCane(c, [[890, 1900], [750, 1200], [ax + 8, ay + 4]], 26, R);
    for (let k = 0; k < 4; k++) limb(c, [[ax - 30, ay + 10 + k * 8], [ax, ay + 18 + k * 8], [ax + 30, ay + 10 + k * 8]], [5, 5, 5], k % 2 ? '#E8B030' : '#C0201E', false);
    tvCaneLeaves(c, ax, ay - 6, R, 10, .8);
    // marigold strings hanging from the apex down along the canes
    for (const sd of [-1, 1]) { const G = through([[ax + sd * 8, ay + 30], [ax + sd * 150, ay + 300], [ax + sd * 230, ay + 520]], 8); G.forEach(([gx, gy], i) => { ellipse(c, gx, gy, 13, 13, i % 2 ? '#F28A12' : '#FFB21E'); ellipse(c, gx - 3, gy - 3, 5, 5, 'rgba(255,230,140,.6)'); }); }
  }
}

// ---------- the courtyard at night (design): the moon over the wall, the house's door and window, rangoli ----------
function tvCourt(c, o = {}) {
  const R = lcg(31);
  // the sky over the wall
  c.fillStyle = ptLin(c, 0, 0, 0, 420, [[0, '#060A1E'], [.7, '#101C40'], [1, '#1C2A54']]); c.fillRect(0, 0, PT_W, 420);
  c.fillStyle = ptRad(c, ...TV_CMOON, 10, 420, [[0, 'rgba(200,214,255,.4)'], [.5, 'rgba(160,180,235,.1)'], [1, 'rgba(160,180,235,0)']]); c.fillRect(0, 0, PT_W, 420);
  ellipse(c, ...TV_CMOON, 50, 50, ptRad(c, TV_CMOON[0] - 14, TV_CMOON[1] - 14, 4, 56, [[0, '#FFFDF2'], [.7, '#F2EED8'], [1, '#D8D6C8']]));
  for (const [dx, dy, r] of [[-14, 10, 11], [15, -11, 8], [6, 19, 6]]) ellipse(c, TV_CMOON[0] + dx, TV_CMOON[1] + dy, r, r * .8, 'rgba(170,170,160,.32)');
  // a neem's branches over the wall at the left
  for (let i = 0; i < 60; i++) trLeaf(c, -40 + R() * 300, 60 + R() * 320, 40 + R() * 24, 12, R() * TAU, ['#06100C', '#0A1610', '#0C1A12'][R() * 3 | 0]);
  // the back wall: lime plaster, warm in the lamplight, a parapet along the top
  c.fillStyle = ptLin(c, 0, 380, 0, 1360, [[0, '#4A3A34'], [.4, '#6A5040'], [1, '#8A6448']]); c.fillRect(0, 380, PT_W, 980);
  ptMottle(c, 0, 400, PT_W, 1360, 160, ['#5A4438', '#76584A', '#4A3A30', '#82604A'], R, 30, 90, .25);
  poly(c, [[0, 372], [1080, 372], [1080, 404], [0, 404]], '#7A6656'); limb(c, [[0, 408], [1080, 408]], [8, 8], 'rgba(0,0,0,.35)', false);
  // the door: carved wood, a mango-leaf toran over it, the lamp-lit inside showing through the gap
  const dx = 540, dw = 190, dt = 560, db = 1310;
  poly(c, [[dx - dw - 34, dt - 40], [dx + dw + 34, dt - 40], [dx + dw + 34, db], [dx - dw - 34, db]], ptLin(c, 0, dt, 0, db, [[0, '#3A2414'], [1, '#2A180C']]));
  for (const sd of [-1, 1]) {
    poly(c, [[dx + sd * 4, dt], [dx + sd * dw, dt], [dx + sd * dw, db], [dx + sd * 4, db]], ptLin(c, dx, 0, dx + sd * dw, 0, [[0, '#5A3418'], [1, '#3A200E']]));
    for (let k = 0; k < 4; k++) { const y = dt + 40 + k * 180; poly(c, [[dx + sd * 30, y], [dx + sd * (dw - 26), y], [dx + sd * (dw - 26), y + 150], [dx + sd * 30, y + 150]], 'rgba(20,10,4,.35)'); for (let j = 0; j < 3; j++) ellipse(c, dx + sd * (60 + j * 46), y + 75, 8, 8, TV_GOLD.dk); }
  }
  limb(c, [[dx, dt], [dx, db]], [10, 10], 'rgba(255,170,80,.6)', false);
  ptShape(c, `M ${dx - dw - 34} ${dt - 40} C ${dx - dw} ${dt - 150} ${dx + dw} ${dt - 150} ${dx + dw + 34} ${dt - 40} Z`, '#3A2414');
  for (let i = 0; i < 15; i++) { const u = i / 14, px = dx - dw - 20 + u * (dw * 2 + 40), py = dt - 34 + Math.sin(u * Math.PI) * 16; limb(c, [[px, py], [px + 2, py + 54]], [12, 2], i % 2 ? '#2E6A28' : '#3E7E30'); }
  { const T = through([[dx - dw - 30, dt - 36], [dx, dt - 18], [dx + dw + 30, dt - 36]], 6); limb(c, T, T.map(() => 6), '#C0201E', false); }
  // two windows with a warm glow, lamps on their sills
  for (const sd of [-1, 1]) {
    const wx = 540 + sd * 380, wy = 760;
    poly(c, [[wx - 70, wy - 110], [wx + 70, wy - 110], [wx + 70, wy + 110], [wx - 70, wy + 110]], '#2A1608');
    poly(c, [[wx - 54, wy - 94], [wx + 54, wy - 94], [wx + 54, wy + 94], [wx - 54, wy + 94]], ptRad(c, wx, wy + 40, 10, 160, [[0, '#FFC870'], [.6, '#C8702A'], [1, '#5A2A10']]));
    for (let k = -1; k <= 1; k++) limb(c, [[wx + k * 30, wy - 94], [wx + k * 30, wy + 94]], [6, 6], '#2A1608', false);
  }
  // the floor: cow-dung plaster, a rangoli in front of the vrindavan
  ptShape(c, 'M 0 1340 L 1080 1340 L 1080 1920 L 0 1920 Z', ptLin(c, 0, 1340, 0, 1920, [[0, '#4A3626'], [.4, '#5E4430'], [1, '#2E2016']]));
  ptMottle(c, 0, 1340, PT_W, 1920, 200, ['#523C2A', '#3E2C1E', '#664A34', '#2E2216'], R, 20, 60, .3);
  limb(c, [[0, 1344], [1080, 1344]], [10, 10], 'rgba(0,0,0,.4)', false);
  c.save(); c.translate(TV_CX, 1790); c.scale(1, .36);
  const ring = (r, n, col, w) => { for (let i = 0; i < n; i++) { const a = i / n * TAU; c.save(); c.rotate(a); ptShape(c, `M 0 ${-r + w} C ${w * .7} ${-r + w * .3} ${w * .6} ${-r - w * .3} 0 ${-r - w} C ${-w * .6} ${-r - w * .3} ${-w * .7} ${-r + w * .3} 0 ${-r + w} Z`, col); c.restore(); } };
  ellipse(c, 0, 0, 360, 360, 'rgba(240,230,210,.12)');
  ring(330, 24, '#E8E0D0', 34); ring(280, 20, '#D8402A', 30); ring(232, 16, '#F2A81E', 28); ring(186, 12, '#2E8A4A', 26); ring(140, 10, '#E8E0D0', 22);
  c.restore();
  for (const [x, y] of TV_CLAMPS) trDiya(c, x, y);
  c.save(); c.translate(540, 1820); c.scale(1, .3); glow(c, 0, 0, 640, '#FF9A4A', .3, 'source-over'); c.restore();
  // the warm light on the wall round the vrindavan
  c.save(); c.globalCompositeOperation = 'source-atop'; c.fillStyle = ptRad(c, TV_CX, 1300, 40, 800, [[0, 'rgba(255,170,90,.25)'], [1, 'rgba(255,170,90,0)']]); c.fillRect(0, 380, PT_W, 1540); c.restore();
}
// the near layer: the vrindavan, the tulsi, the bride's chunari, the front sugarcanes (o.bride, o.mandap)
function tvCourtFront(o = {}) {
  return (c) => {
    if (o.mandap !== false) tvMandap(c, 'back');
    tvChaura(c);
    tvTulsi(c, ...TV_PLANT, 1, { seed: 7 });
    if (o.bride !== false) { tvSaree(c); tvChunari(c); }
    if (o.mandap !== false) tvMandap(c, 'front');
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 400, 0, 1900, [[0, 'rgba(150,170,230,.18)'], [.5, 'rgba(255,160,80,0)'], [1, 'rgba(255,150,70,.22)']]); c.fillRect(0, 380, PT_W, 1540);
    c.restore();
  };
}

// ---------- Vishnu's kirita: a tall gold crown in tiers of jewels (in trHead's frame, the forehead band at y 912) ----------
function vsKirita(c, X) {
  const g = ptLin(c, X - 90, 0, X + 90, 0, [[0, DH_GOLD.dk], [.35, DH_GOLD.lt], [.6, DH_GOLD.base], [1, DH_GOLD.dk]]);
  for (const sd of [-1, 1]) ptShape(c, `M ${X + sd * 70} 918 C ${X + sd * 104} 904 ${X + sd * 114} 874 ${X + sd * 104} 852 C ${X + sd * 96} 876 ${X + sd * 86} 888 ${X + sd * 64} 892 Z`, g);
  const body = `M ${X - 80} 918 L ${X - 60} 838 C ${X - 54} 816 ${X - 24} 804 ${X} 788 C ${X + 24} 804 ${X + 54} 816 ${X + 60} 838 L ${X + 80} 918 Z`;
  ptShape(c, body, g);
  inside(c, body, () => {
    for (const [y, w] of [[886, 76], [858, 68], [832, 60]]) { dhBand(c, [[X - w, y], [X, y + 4], [X + w, y]], 7); for (let k = -3; k <= 3; k++) dhGem(c, X + k * w / 3.6, y - 12, 3.4, k % 2 ? '#1E8A5A' : '#B0182C'); }
    ellipse(c, X - 30, 850, 12, 46, 'rgba(255,250,220,.35)');
  });
  dhGem(c, X, 870, 10, '#B0182C');
  ptShape(c, `M ${X - 11} 794 C ${X - 13} 778 ${X - 4} 766 ${X} 756 C ${X + 4} 766 ${X + 13} 778 ${X + 11} 794 Z`, g); ellipse(c, X, 752, 4, 4, '#FFF6DA');
  dhBand(c, [[X - 92, 910], [X, 922], [X + 92, 910]], 22);
  for (let k = -8; k <= 8; k++) ellipse(c, X + k * 10.5, 926 - Math.abs(k) * .4, 2.4, 2.8, '#FFFFFF');
}
// the head anywhere: trHead's face (TR_FACE) moved to (x, y), turned by a, scaled by k
function headAt(c, o, x, y, a, k) { c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k); c.translate(-TR_FACE[0], -TR_FACE[1]); trHead(o)(c); c.restore(); }

// ---------- the ocean of milk at night, Vishnu asleep on Shesha (design) ----------
const VS_FACE = [356, 1150], VS_TILT = -.14, VS_K = .42;
function tvOcean(c) {
  const R = lcg(61);
  c.fillStyle = ptLin(c, 0, 0, 0, 1100, [[0, '#04061A'], [.5, '#0C1238'], [.85, '#262A5E'], [1, '#4A4478']]); c.fillRect(0, 0, PT_W, 1100);
  ptMottle(c, 0, 0, PT_W, 1080, 200, ['#0A1030', '#141A44', '#1E2252', '#0C0E2A'], R, 40, 140, .22);
  for (let i = 0; i < 9; i++) { const y = 700 + R() * 340, x = R() * 1100; ellipse(c, x, y, 220 + R() * 200, 26 + R() * 20, `rgba(120,110,170,${.12 + R() * .1})`); }
  c.fillStyle = ptRad(c, 560, 1100, 20, 700, [[0, 'rgba(255,220,180,.25)'], [1, 'rgba(255,220,180,0)']]); c.fillRect(0, 400, PT_W, 700);
  // the ocean of milk: pale and silver, rows of soft swells
  ptShape(c, 'M 0 1090 L 1080 1090 L 1080 1920 L 0 1920 Z', ptLin(c, 0, 1090, 0, 1920, [[0, '#B8C2DE'], [.25, '#8C98C0'], [.7, '#5A6694'], [1, '#2C3460']]));
  for (let r = 0; r < 26; r++) { const y = 1100 + Math.pow(r / 26, 1.5) * 820, a = .12 + r / 26 * .2; for (let i = 0; i < 6; i++) { const x = R() * 1200 - 60, w = 80 + r * 10 + R() * 120; limb(c, [[x - w, y + 4], [x, y - 3 - r * .3], [x + w, y + 4]], [2, 3 + r * .3, 2], `rgba(240,244,255,${a})`, false); limb(c, [[x - w, y + 10 + r * .5], [x + w, y + 10 + r * .5]], [2, 4], `rgba(30,36,80,${a * .8})`, false); } }
  ptMottle(c, 0, 1090, PT_W, 1920, 160, ['#9AA6CC', '#6E7AA8', '#C8D0E8', '#4A5486'], R, 20, 70, .2);
  c.save(); c.translate(560, 1640); c.scale(1, .2); glow(c, 0, 0, 520, '#1C2250', .55, 'source-over'); c.restore();
}
function vsCoil(c, cx, cy, rx, ry, w, half) {   // one ring of Shesha's coils: half 'back' (upper arc) or 'front'
  const P = []; for (let i = 0; i <= 24; i++) { const a = half === 'back' ? Math.PI + i / 24 * Math.PI : i / 24 * Math.PI; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  const dk = half === 'back';
  limb(c, P, P.map(() => w), dk ? '#123A3C' : '#1E5654');
  limb(c, P.map(([x, y]) => [x, y - w * .16]), P.map(() => w * .7), dk ? '#1E5050' : '#2E7A70');
  c.save(); c.globalAlpha = .55; limb(c, P.map(([x, y]) => [x, y - w * .3]), P.map(() => w * .22), dk ? '#4A8A7A' : '#8AC8A8'); c.restore();
  for (let i = 1; i < P.length - 1; i++) for (let k = -1; k <= 1; k++) ellipse(c, P[i][0], P[i][1] + k * w * .24 - w * .1, 7, 4, `rgba(${dk ? '10,30,30' : '14,50,44'},.45)`);
  if (!dk) limb(c, P.map(([x, y]) => [x, y + w * .34]), P.map(() => w * .22), '#D8C890');   // the pale belly showing below
}
function vsHood(c) {   // seven hoods fanned over his head, the necks gathering into one
  const [hx, hy] = [262, 1010];
  limb(c, [[250, 1420], [236, 1260], [244, 1120], [hx, hy + 40]], [96, 90, 86, 80], '#1E5654');
  limb(c, [[268, 1420], [256, 1260], [262, 1120]], [26, 24, 22], '#8A8A5E');
  ellipse(c, hx, hy, 190, 150, '#123A3C');
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * .92 + i / 6 * Math.PI * .84, x = hx + Math.cos(a) * 150, y = hy + Math.sin(a) * 140;
    c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2);
    const hood = 'M 0 40 C -46 30 -54 -30 -30 -70 C -16 -92 16 -92 30 -70 C 54 -30 46 30 0 40 Z';
    ptShape(c, hood, ptLin(c, -50, 0, 50, 0, [[0, '#123A3C'], [.5, '#2E7A70'], [1, '#123A3C']]));
    ptShape(c, 'M 0 30 C -20 20 -24 -30 -12 -54 C -5 -62 5 -62 12 -54 C 24 -30 20 20 0 30 Z', ptLin(c, 0, -60, 0, 30, [[0, '#8E9A6A'], [1, '#4E6A50']]));
    for (let k = 0; k < 4; k++) limb(c, [[-14 + k, -40 + k * 16], [14 - k, -40 + k * 16]], [2, 2], 'rgba(20,50,40,.35)', false);
    ellipse(c, 0, -92, 16, 14, '#1E5654'); ellipse(c, -6, -96, 3, 3, '#F2E080'); ellipse(c, 6, -96, 3, 3, '#F2E080');
    dhGem(c, 0, -72, 4, '#B0182C');
    c.restore();
  }
}
// the whole design: hood, coils, Vishnu reclining with his head on his hand (o.eyes 'shut' | 'front')
function tvVishnu(o = {}) {
  return (c) => {
    const sk = VS_BLUE, R = lcg(71);
    vsHood(c);
    vsCoil(c, 580, 1560, 390, 66, 86, 'back'); vsCoil(c, 580, 1560, 390, 66, 86, 'front');
    vsCoil(c, 580, 1480, 360, 62, 82, 'back'); vsCoil(c, 580, 1480, 360, 62, 82, 'front');
    vsCoil(c, 580, 1402, 330, 58, 80, 'back');
    // the tail curling up at the right
    limb(c, [[900, 1420], [960, 1380], [980, 1310], [950, 1270], [930, 1290]], [70, 56, 40, 24, 10], '#1E5654');
    // his far (right) arm: the elbow on the coil, the hand under his cheek
    ptForm(c, [[420, 1262], [380, 1300], [346, 1316]], [52, 48, 44], sk, .3, -.9, .45);
    ptForm(c, [[346, 1316], [330, 1270], [326, 1236]], [44, 40, 36], sk, .4, -.6, .5);
    dhBand(c, [[306, 1250], [326, 1256], [346, 1250]], 9);
    ptShape(c, 'M 300 1236 C 296 1210 306 1192 322 1186 C 340 1182 356 1194 356 1214 C 356 1232 344 1242 326 1244 C 312 1246 302 1244 300 1236 Z', ptLin(c, 300, 0, 356, 0, [[0, sk.lt], [1, sk.base]]));
    for (const fx of [310, 322, 334, 346]) limb(c, [[fx, 1196], [fx + 2, 1176]], [9, 7], sk.base);
    // the pitambar: yellow silk from the hips to the ankles, one knee a little raised
    const dhoti = 'M 590 1262 C 650 1240 720 1206 770 1214 C 830 1222 880 1252 910 1272 L 914 1330 C 850 1340 700 1346 600 1338 C 570 1320 566 1282 590 1262 Z';
    ptShape(c, dhoti, ptLin(c, 0, 1206, 0, 1346, [[0, '#FFE070'], [.5, '#F2B82A'], [1, '#B47A10']]));
    inside(c, dhoti, () => { for (let k = 0; k < 6; k++) limb(c, [[620 + k * 46, 1250 - (k < 3 ? k * 10 : (6 - k) * 10)], [640 + k * 48, 1340]], [3, 4], 'rgba(150,90,0,.35)'); ellipse(c, 760, 1230, 60, 14, 'rgba(255,250,200,.5)'); });
    dhBand(c, [[600, 1338], [700, 1346], [850, 1340], [914, 1330]], 12);
    for (const [fx, fy] of [[934, 1282], [926, 1318]]) { ellipse(c, fx, fy, 30, 16, sk.base); ellipse(c, fx + 4, fy - 4, 16, 6, sk.lt); ellipse(c, fx + 24, fy, 6, 10, '#C0303A'); }
    // the torso lying along the coil, a little raised at the shoulders
    c.save(); c.translate(500, 1282); c.rotate(.12);
    const torso = 'M -112 -40 C -60 -60 60 -56 112 -30 C 124 -10 124 22 108 40 C 40 56 -60 54 -112 40 C -126 20 -126 -20 -112 -40 Z';
    ptShape(c, torso, ptRad(c, -20, -30, 10, 160, [[0, sk.lt], [.55, sk.base], [1, sk.dk]]));
    inside(c, torso, () => { ellipse(c, -40, -24, 50, 12, 'rgba(210,230,255,.3)'); ellipse(c, 70, 30, 60, 14, `rgba(${sk.sh},.3)`); ellipse(c, 34, 10, 5, 4, `rgba(${sk.sh},.5)`); });
    // the yellow uttariya over the chest and the vanamala
    ptShape(c, 'M -100 -44 C -40 -30 30 0 90 30 L 80 46 C 20 20 -50 -12 -110 -26 Z', ptLin(c, 0, -44, 0, 46, [[0, '#FFE070'], [1, '#D89A1A']]));
    const G = through([[-96, -36], [-60, 10], [0, 40], [60, 52], [104, 44]], 6);
    G.forEach(([gx, gy], i) => { ellipse(c, gx, gy, 9, 9, ['#F2F2E0', '#E83A4A', '#F2A81E', '#3E8E44'][i % 4]); });
    dhGem(c, -70, -6, 9, '#B0182C');
    c.restore();
    // his near (left) arm resting along his side, the hand on his thigh
    ptForm(c, [[430, 1250], [480, 1300], [540, 1318]], [50, 46, 42], sk, -.2, -1, .5);
    ptForm(c, [[540, 1318], [600, 1310], [652, 1290]], [42, 38, 34], sk, -.2, -1, .5);
    dhBangles(c, [600, 1308], 1); dhBand(c, [[456, 1262], [470, 1280], [462, 1300]], 10);
    ellipse(c, 668, 1286, 26, 16, sk.base); ellipse(c, 672, 1280, 12, 5, sk.lt);
    // the neck and the head
    ptForm(c, [[392, 1238], [374, 1200]], [52, 48], sk, .2, -1, .4);
    dhBeads(c, [[350, 1214], [380, 1236], [410, 1226]], 4, 6);
    headAt(c, { god: 'vishnu', eyes: o.eyes || 'shut', mouth: 'soft' }, ...VS_FACE, VS_TILT, VS_K);
    // grade: the moon from above, the milk's glow from below
    c.save(); c.globalCompositeOperation = 'source-atop';
    c.fillStyle = ptLin(c, 0, 800, 0, 1650, [[0, 'rgba(200,210,255,.14)'], [1, 'rgba(230,236,255,.1)']]); c.fillRect(0, 800, PT_W, 900);
    c.restore();
  };
}
const VS_BOX = [40, 800, 1000, 900];

// ---------- the riverbank under the Kartik full moon (design): the Himalaya's foothills, a stone to sit on ----------
const TV_BMOON = [330, 330];
function tvBank(c, o = {}) {
  const R = lcg(83);
  c.fillStyle = ptLin(c, 0, 0, 0, 1130, [[0, '#040716'], [.45, '#0A1434'], [.8, '#172A56'], [1, '#22396A']]); c.fillRect(0, 0, PT_W, 1130);
  ptMottle(c, 0, 0, PT_W, 1080, 220, ['#0E1A44', '#13244E', '#08102C', '#1C2C5C'], R, 40, 140, .22);
  c.fillStyle = ptRad(c, ...TV_BMOON, 10, 600, [[0, 'rgba(200,214,255,.45)'], [.4, 'rgba(150,170,235,.14)'], [1, 'rgba(150,170,235,0)']]); c.fillRect(0, 0, PT_W, 1130);
  ellipse(c, ...TV_BMOON, 70, 70, ptRad(c, TV_BMOON[0] - 18, TV_BMOON[1] - 18, 4, 76, [[0, '#FFFDF2'], [.7, '#F4F0DA'], [1, '#DAD8C8']]));
  for (const [dx, dy, r] of [[-18, 12, 15], [20, -14, 11], [8, 26, 9], [-28, -20, 8]]) ellipse(c, TV_BMOON[0] + dx, TV_BMOON[1] + dy, r, r * .8, 'rgba(170,170,160,.32)');
  // the foothills in two dark ranges, moonlit on their right flanks
  for (const [y0, amp, col, lit, sd] of [[860, 260, '#101C3A', 'rgba(120,140,200,.16)', 3], [990, 160, '#0A1228', 'rgba(110,130,190,.12)', 9]]) {
    const P = [[-20, 1120]]; for (let x = -20; x <= 1100; x += 30) P.push([x, y0 - Math.abs(vnoise(x * .004, sd)) * amp - Math.max(0, vnoise(x * .012, sd + 2)) * amp * .3]);
    P.push([1100, 1120]); poly(c, P, col);
    for (let i = 1; i < P.length - 2; i++) if (P[i + 1][1] > P[i][1]) limb(c, [P[i], P[i + 1]], [5, 5], lit, false);
  }
  // the river, the moon's road on it
  ptShape(c, `M 0 1080 L 1080 1080 L 1080 1440 C 800 1420 300 1426 0 1450 Z`, ptLin(c, 0, 1080, 0, 1440, [[0, '#1C3058'], [.3, '#12224A'], [1, '#081430']]));
  for (let i = 0; i < 40; i++) { const y = 1090 + Math.pow(R(), 1.4) * 340, x = R() * 1080, l = 40 + R() * 160; limb(c, [[x, y], [x + l, y + (R() - .5) * 3]], [1.5, 2.5], `rgba(120,150,210,${.08 + R() * .14})`, false); }
  for (let i = 0; i < 26; i++) { const y = 1086 + i * 13, w = 18 + i * 3.4 + R() * 20; ellipse(c, TV_BMOON[0] + (R() - .5) * 30, y, w, 3 + i * .12, `rgba(230,236,255,${.35 - i * .01})`); }
  // the near bank: earth and river stones
  ptShape(c, `M 0 1430 C 300 1404 800 1398 1080 1420 L 1080 1920 L 0 1920 Z`, ptLin(c, 0, 1400, 0, 1920, [[0, '#2A2626'], [.3, '#1C1818'], [1, '#0A0808']]));
  ptMottle(c, 0, 1420, PT_W, 1920, 240, ['#2E2624', '#191414', '#3A302C', '#100C0C'], R, 10, 40, .3);
  for (let i = 0; i < 40; i++) { const x = R() * 1080, y = 1440 + Math.pow(R(), .7) * 460, r = 8 + R() * 22; ellipse(c, x, y, r * 1.4, r, ['#3A3634', '#2A2626', '#4A4440'][R() * 3 | 0]); ellipse(c, x - r * .3, y - r * .4, r * .5, r * .25, 'rgba(180,190,230,.18)'); }
  // reeds at the left, an old tree at the right
  for (let i = 0; i < 40; i++) { const x = R() * 220, y = 1460 + R() * 120, h = 120 + R() * 160; limb(c, [[x, y], [x + (R() - .5) * 40, y - h * .5], [x + (R() - .5) * 70, y - h]], [5, 3, 1], ['#0A1A12', '#0E2216', '#08140E'][R() * 3 | 0]); }
  limb(c, [[1010, 1460], [1000, 1100], [1030, 700], [1010, 300], [1050, -20]], [110, 96, 86, 80, 76], '#0E0A0A');
  for (let i = 0; i < 70; i++) { const x = 700 + R() * 420, y = -30 + R() * 360; trLeaf(c, x, y, 40 + R() * 30, 18, R() * TAU, ['#06100C', '#0A1812', '#0C1C14'][R() * 3 | 0]); }
  if (o.seat !== false) {   // a flat river stone with a kusha-grass mat
    ptShape(c, `M ${TR_X - 330} 1720 C ${TR_X - 330} 1690 ${TR_X + 330} 1690 ${TR_X + 330} 1720 L ${TR_X + 350} 1800 C ${TR_X + 200} 1820 ${TR_X - 200} 1820 ${TR_X - 350} 1800 Z`, ptLin(c, 0, 1690, 0, 1820, [[0, '#5A5658'], [.3, '#3A3638'], [1, '#161416']]));
    const mat = `M ${TR_X - 290} 1712 L ${TR_X + 290} 1712 L ${TR_X + 260} 1786 L ${TR_X - 260} 1786 Z`;
    ptShape(c, mat, ptLin(c, 0, 1712, 0, 1786, [[0, '#C8B070'], [1, '#7A6230']]));
    inside(c, mat, () => { for (let i = 0; i < 60; i++) { const x = TR_X - 290 + i * 10; limb(c, [[x, 1712], [x - 6, 1786]], [1.5, 1.5], 'rgba(90,70,30,.5)', false); } });
  }
  c.save(); c.translate(540, 1820); c.scale(1, .3); glow(c, 0, 0, 640, '#FF9A4A', .18, 'source-over'); c.restore();
}

// ---------- the palace chamber at night (design): a cusped doorway to the moonlit garden, a hanging lamp ----------
const TV_DOOR = [190, 1330];          // the doorway's foot (centre)
function tvPalace(c) {
  const R = lcg(91);
  c.fillStyle = ptLin(c, 0, 0, 0, 1380, [[0, '#0A0E1C'], [.5, '#16203A'], [1, '#202A44']]); c.fillRect(0, 0, PT_W, 1380);
  ptMottle(c, 0, 0, PT_W, 1380, 200, ['#121A30', '#1A2440', '#0C1224', '#22304C'], R, 30, 100, .25);
  // painted gold arches along the wall
  for (let i = 0; i < 4; i++) { const x = 420 + i * 220; ptShape(c, `M ${x - 80} 1200 L ${x - 80} 620 C ${x - 80} 520 ${x - 30} 470 ${x} 440 C ${x + 30} 470 ${x + 80} 520 ${x + 80} 620 L ${x + 80} 1200`, 'rgba(0,0,0,0)'); c.strokeStyle = 'rgba(200,160,80,.3)'; c.lineWidth = 6; c.stroke(new Path2D(`M ${x - 80} 1200 L ${x - 80} 620 C ${x - 80} 520 ${x - 30} 470 ${x} 440 C ${x + 30} 470 ${x + 80} 520 ${x + 80} 620 L ${x + 80} 1200`)); }
  // the doorway: a cusped arch, the moonlit garden beyond
  const [dx, dy] = TV_DOOR, dw = 150, dt = 560;
  const arch = `M ${dx - dw} ${dy} L ${dx - dw} ${dt + 140} C ${dx - dw} ${dt + 90} ${dx - dw + 30} ${dt + 80} ${dx - dw + 46} ${dt + 60} C ${dx - dw + 50} ${dt + 20} ${dx - 50} ${dt} ${dx - 40} ${dt - 20}
                C ${dx - 20} ${dt - 50} ${dx} ${dt - 70} ${dx} ${dt - 90} C ${dx} ${dt - 70} ${dx + 20} ${dt - 50} ${dx + 40} ${dt - 20} C ${dx + 50} ${dt} ${dx + dw - 50} ${dt + 20} ${dx + dw - 46} ${dt + 60}
                C ${dx + dw - 30} ${dt + 80} ${dx + dw} ${dt + 90} ${dx + dw} ${dt + 140} L ${dx + dw} ${dy} Z`;
  c.save(); c.lineWidth = 50; c.strokeStyle = '#3A3020'; c.stroke(new Path2D(arch)); c.lineWidth = 16; c.strokeStyle = '#8A6A30'; c.stroke(new Path2D(arch)); c.restore();
  ptShape(c, arch, ptLin(c, 0, dt - 90, 0, dy, [[0, '#2A3E70'], [.6, '#3A5288'], [1, '#22304E']]));
  inside(c, arch, () => {
    ellipse(c, dx + 60, dt + 60, 34, 34, '#F2F0DC'); c.fillStyle = ptRad(c, dx + 60, dt + 60, 10, 260, [[0, 'rgba(220,230,255,.4)'], [1, 'rgba(220,230,255,0)']]); c.fillRect(dx - dw, dt - 100, dw * 2, dy - dt + 100);
    for (let i = 0; i < 30; i++) trLeaf(c, dx - dw + R() * dw * 2, dt + 300 + R() * 300, 40 + R() * 30, 14, R() * TAU, ['#0A1A24', '#0E2230'][R() * 2 | 0]);
    ptShape(c, `M ${dx - dw} ${dy - 120} C ${dx - 40} ${dy - 140} ${dx + 40} ${dy - 140} ${dx + dw} ${dy - 120} L ${dx + dw} ${dy} L ${dx - dw} ${dy} Z`, '#2A3A5A');
  });
  // a pillar at the right, a drape at the top
  ptShape(c, 'M 960 0 L 1080 0 L 1080 1380 L 960 1380 Z', ptLin(c, 960, 0, 1080, 0, [[0, '#3A2E26'], [.4, '#5A4838'], [1, '#2A201A']]));
  for (let k = 0; k < 6; k++) limb(c, [[960, 200 + k * 220], [1080, 200 + k * 220]], [10, 10], 'rgba(200,160,80,.4)', false);
  for (const sd of [-1, 1]) ptShape(c, sd < 0 ? 'M 0 0 L 420 0 C 300 80 160 200 0 360 Z' : 'M 1080 0 L 640 0 C 760 80 900 200 1080 360 Z', ptLin(c, 0, 0, 0, 360, [[0, '#5A0A1E'], [1, '#2A0410']]));
  // the hanging lamp
  limb(c, [[860, 0], [860, 220]], [3, 3], '#6A5020', false);
  ptShape(c, 'M 820 236 C 830 270 890 270 900 236 C 890 226 830 226 820 236 Z', ptLin(c, 820, 0, 900, 0, [[0, TV_GOLD.dk], [.5, TV_GOLD.lt], [1, TV_GOLD.dk]]));
  // the floor: dark polished stone, the lamps' reflections, a carpet under her
  ptShape(c, 'M 0 1360 L 1080 1360 L 1080 1920 L 0 1920 Z', ptLin(c, 0, 1360, 0, 1920, [[0, '#2A2630'], [.5, '#1A1620'], [1, '#0A080C']]));
  limb(c, [[0, 1364], [1080, 1364]], [10, 10], 'rgba(0,0,0,.5)', false);
  ellipse(c, dx, 1420, 120, 30, 'rgba(120,150,220,.16)');
  const rug = `M 100 1700 L 980 1700 L 1040 1900 L 40 1900 Z`;
  ptShape(c, rug, ptLin(c, 0, 1700, 0, 1900, [[0, '#7A1424'], [1, '#4A0812']]));
  inside(c, rug, () => { dhBand(c, [[90, 1716], [990, 1716]], 14); for (let i = 0; i < 12; i++) ellipse(c, 140 + i * 72, 1800, 14, 8, 'rgba(230,180,80,.45)'); });
}

// ---------- the battlefield (design): o.tone 'red' (the asura's war, heaven burning) or 'blue' (Shiva's side) ----------
function tvWar(c, o = {}) {
  const R = lcg(o.tone === 'blue' ? 97 : 99), red = o.tone !== 'blue';
  c.fillStyle = ptLin(c, 0, 0, 0, 1300, red ? [[0, '#0C0306'], [.45, '#2A0A0C'], [.8, '#6A1A10'], [1, '#B04218']] : [[0, '#04060E'], [.5, '#0C1428'], [.85, '#1E2E52'], [1, '#3A4E7A']]); c.fillRect(0, 0, PT_W, 1300);
  for (let i = 0; i < 26; i++) { const x = R() * 1200 - 60, y = 60 + R() * 900, w = 160 + R() * 260; ellipse(c, x, y, w, w * .3, red ? ['#1A0608', '#2A0A0C', '#3A100E'][R() * 3 | 0] : ['#0A1020', '#121A30', '#1A2238'][R() * 3 | 0], (R() - .5) * .2); ellipse(c, x - w * .2, y + w * .1, w * .5, w * .08, red ? 'rgba(255,120,60,.14)' : 'rgba(120,150,210,.14)'); }
  ptMottle(c, 0, 0, PT_W, 1300, 200, red ? ['#2A0A0C', '#4A1410', '#1A0608', '#6A2014'] : ['#0A1020', '#1A2438', '#22304A', '#0C1222'], R, 30, 120, .25);
  if (red) {   // heaven burning on the horizon: gold towers in flames
    for (let i = 0; i < 16; i++) { const x = 40 + i * 66 + (R() - .5) * 30, h = 80 + R() * 160, w = 24 + R() * 30, y = 1250; poly(c, [[x - w, y], [x - w * .8, y - h], [x, y - h - 40 - R() * 40], [x + w * .8, y - h], [x + w, y]], '#2A1408'); ellipse(c, x, y - h - 14, w * .6, w * .6, '#3A1C0A'); limb(c, [[x - w * .8, y - h], [x, y - h - 40]], [3, 2], 'rgba(255,190,90,.5)', false); }
    c.fillStyle = ptLin(c, 0, 1000, 0, 1260, [[0, 'rgba(255,120,40,0)'], [1, 'rgba(255,140,50,.5)']]); c.fillRect(0, 1000, PT_W, 260);
  }
  // the ridge, an army's spears along it
  const P = [[-20, 1320]]; for (let x = -20; x <= 1100; x += 40) P.push([x, 1290 - Math.abs(vnoise(x * .006, 5)) * 80]); P.push([1100, 1920], [-20, 1920]);
  poly(c, P, red ? '#140608' : '#080C16');
  for (let i = 0; i < 90; i++) { const x = R() * 1080, y = 1260 + R() * 60; limb(c, [[x, y + 40], [x + (R() - .5) * 10, y - 60 - R() * 40]], [2, 1], red ? '#1A080A' : '#0A0E18', false); }
  ptMottle(c, 0, 1300, PT_W, 1920, 120, red ? ['#1A080A', '#24100E', '#0C0406'] : ['#0A0E18', '#121828', '#06080E'], R, 20, 60, .3);
}

// ---------- silhouettes (designs, stage px): Shankhachuda, Shiva, Brahma ----------
function silBody(c, col, o = {}) {   // a standing man, feet at (0, 0), 1000 tall; o.arms: [[shoulder, elbow, wrist] × 2]
  for (const sd of [-1, 1]) { limb(c, [[sd * 58, -430], [sd * 92, -220], [sd * 110, -24]], [74, 52, 32], col); ellipse(c, sd * 120, -12, 38, 16, col); }
  ptShape(c, 'M -128 -770 C -140 -690 -96 -560 -72 -470 L -90 -420 L 90 -420 L 72 -470 C 96 -560 140 -690 128 -770 C 70 -800 -70 -800 -128 -770 Z', col);
  for (const sd of [-1, 1]) ellipse(c, sd * 126, -752, 46, 40, col);
  for (const A of o.arms) { limb(c, A, [50, 42, 32], col); ellipse(c, A[2][0], A[2][1], 26, 30, col); }
  limb(c, [[0, -790], [0, -830]], [54, 50], col); ellipse(c, 0, -880, 54, 66, col);
}
// Shankhachuda: a giant in armour, a crown crested with a conch, a cape, his mace on his shoulder. (x, y): his feet
function tvAsura(x, y, h, col = '#0A0608') {
  return (c) => {
    c.save(); c.translate(x, y); const k = h / 1000; c.scale(k, k);
    ptShape(c, 'M 140 -770 C 260 -620 330 -380 380 -60 C 300 -90 220 -70 160 -40 C 170 -300 150 -520 100 -700 Z', col);   // the cape flying back
    silBody(c, col, { arms: [[[-126, -752], [-196, -610], [-176, -476]], [[126, -752], [200, -620], [140, -500]]] });
    ptShape(c, 'M -110 -470 L 110 -470 L 150 -250 C 60 -230 -60 -230 -150 -250 Z', col);   // the armoured skirt
    limb(c, [[-200, -480], [-150, -1000]], [22, 18], col); ellipse(c, -146, -1050, 62, 76, col);   // the mace over his shoulder
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; ellipse(c, -146 + Math.cos(a) * 62, -1050 + Math.sin(a) * 76, 14, 14, col); }
    ptShape(c, 'M -66 -920 L -56 -1020 L -28 -980 L 0 -1060 L 28 -980 L 56 -1020 L 66 -920 Z', col);   // the crown
    c.save(); c.translate(0, -1086); c.rotate(.25); ptShape(c, 'M -26 26 C -36 -8 -18 -44 8 -58 C 26 -44 34 -8 22 26 C 8 34 -12 34 -26 26 Z', col); limb(c, [[6, -52], [12, -78]], [10, 4], col); c.restore();
    c.restore();
  };
}
// Shiva standing: the jata in a high knot with the crescent, locks down his back, the trishul raised in his right hand
function tvShivaSil(x, y, h, col = '#05070E') {
  return (c) => {
    c.save(); c.translate(x, y); const k = h / 1000; c.scale(k, k);
    for (const sd of [-1, 1]) for (let j = 0; j < 3; j++) limb(c, [[sd * (30 + j * 12), -900], [sd * (90 + j * 16), -820], [sd * (120 + j * 18), -690 + j * 20]], [22, 16, 6], col);
    silBody(c, col, { arms: [[[-126, -752], [-230, -830], [-270, -960]], [[126, -752], [180, -600], [160, -470]]] });
    ptShape(c, 'M -104 -470 L 104 -470 L 140 -300 L 100 -320 L 70 -280 L 30 -310 L -10 -276 L -50 -312 L -90 -280 L -140 -300 Z', col);   // the tiger skin
    ellipse(c, 0, -990, 44, 70, col); ellipse(c, 0, -1050, 30, 36, col);   // the jata knot
    c.save(); c.translate(36, -1060); c.rotate(.6); ptShape(c, 'M 0 -26 C 20 -18 22 18 4 26 C 12 12 12 -12 0 -26 Z', col); c.restore();
    limb(c, [[-110, -770], [-60, -740], [0, -730], [60, -740], [110, -770], [126, -830], [150, -846]], [16, 16, 16, 16, 16, 12, 8], col);   // the snake
    limb(c, [[-280, 40], [-280, -1300]], [18, 12], col);
    ptShape(c, 'M -280 -1250 L -280 -1460 L -266 -1300 Z M -280 -1240 C -360 -1260 -380 -1340 -360 -1420 C -340 -1330 -310 -1300 -280 -1300 Z M -280 -1240 C -200 -1260 -180 -1340 -200 -1420 C -220 -1330 -250 -1300 -280 -1300 Z', col);
    c.save(); c.translate(-280, -1180); ellipse(c, -22, 0, 24, 28, col); ellipse(c, 22, 0, 24, 28, col); c.restore();
    c.restore();
  };
}
// Brahma: four heads crowned (three seen), seated on a lotus; drawn as a shape for golden light
function tvBrahma(c, x, y, s, col) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const [hx, w] of [[-120, .8], [120, .8], [0, 1]]) { ellipse(c, hx, -300, 56 * w, 66 * w, col); ptShape(c, `M ${hx - 50 * w} -340 L ${hx - 36 * w} -440 L ${hx} -470 L ${hx + 36 * w} -440 L ${hx + 50 * w} -340 Z`, col); }
  ptShape(c, 'M -200 -230 C -260 -160 -260 -40 -220 0 L 220 0 C 260 -40 260 -160 200 -230 C 120 -260 -120 -260 -200 -230 Z', col);
  for (let i = -4; i <= 4; i++) { c.save(); c.translate(i * 60, 20); c.rotate(i * .18); ptShape(c, 'M 0 0 C -40 -20 -36 -90 0 -120 C 36 -90 40 -20 0 0 Z', col); c.restore(); }
  c.restore();
}
