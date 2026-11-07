// cine_dashavatar.js: the Vamana chapter's cast in the Cinematic style (cine.js), for the Dashavatar book's style test.
// All on Surya's head rig (cine_surya.js) recoloured through withSur() (cine_yama.js): load after both.
// Units as surya(): the feet at (0, 0), up is -y, an adult's face centred at (0, -815).
//   VISHNU_PAL, BALI_PAL, SHUKRA_PAL   the palettes over SUR's
//   vTilak(c)                 the Vaishnava urdhva pundra (a white U, a red line), in head units
//   vamanaC(c, o)             the boy Vamana, front view, ~650 tall: blue, a shikha knot, a yellow dhoti, the munja
//                             belt, a deerskin and the sacred thread over his left shoulder, a palm-leaf parasol in his
//                             right hand, a brass kamandalu in his left; o.t, o.look, o.smile, o.armFx
//   baliC(c, o)               King Bali on surya()'s body (crowned, moustached, a purple dhoti): his left hand holds out
//                             a gold water pitcher (the gift-water), his right is raised open; o.t, o.look, o.smile
//   shukraC(c, o)             Shukracharya, the asuras' guru: white hair and beard, a saffron robe, a red shawl,
//                             rudraksha, a staff; o.pose 'wary' (a finger raised in warning) | 'shock' (hands to his head)
//   trivikramaC(c, o)         Vishnu grown to fill the sky: four arms (chakra, conch, gada, a blessing palm), a gold
//                             kirita, the vanamala, a yellow pitambara; the standing foot at (0, 0), the other leg raised
//                             high to screen left, its sole (to the viewer) about (-640, -900); o.t, o.look, o.light
//                             (-1: lit from the left), o.armFx
const VISHNU_PAL = {
  skin: '#5A84C6', skinSh: '#3D5F9E', skinDk: '#1F3366', palm: '#8EAEE0', lip: '#6A3458', lipLo: '#8A4C72',
  hair: '#0E0B16', hairLt: '#2A2440', eyeW: '#F4EEE6', iris: '#22140E', brow: '#0E0B14', tilak: '#D8282E',
  gold: '#E8B442', goldSh: '#9A6A1E', goldLt: '#FFE38E', ruby: '#C81E2A', emerald: '#1E8A5A',
  dhoti: '#F2B523', dhotiSh: '#B97E12', dhotiLt: '#FFD45E', bead: '#0E0B16', sole: '#E8A0A8',
};
const BALI_PAL = {
  skin: '#B87850', skinSh: '#8E5434', skinDk: '#5A301A', palm: '#D8A07A', lip: '#7A3424', lipLo: '#98503A',
  hair: '#140C0C', hairLt: '#34221C', dhoti: '#6A2A84', dhotiSh: '#44175A', dhotiLt: '#9050AC',
};
const SHUKRA_PAL = {
  skin: '#C99272', skinSh: '#A06A4E', skinDk: '#6A3E2A', palm: '#E0B090', lip: '#8A4A3A', lipLo: '#A0604A',
  hair: '#E9E4DA', hairLt: '#FFFFFF', brow: '#F2EEE6', bead: '#5E2F1B', ash: '#F4EEE2',
  robe: '#E07A22', robeSh: '#A84E12', robeLt: '#F8A050', shawl: '#B23A1A', shawlSh: '#7A2410',
};

function vTilak(c) {
  strokePath(c, 'M -9 -864 C -10 -848 -6 -838 0 -836 C 6 -838 10 -848 9 -864', '#F6F1E6', 3.4);
  strokePath(c, 'M 0 -862 L 0 -843', '#D8282E', 2.8);
}
// a head on the rig at (0, -fy), scale k
function headAt(c, fy, k, draw) { c.save(); c.translate(0, -fy); c.scale(k, k); c.translate(0, 815); draw(c); c.restore(); }
// a mitten hand, fingers up (an open palm, toward the viewer) at (x, y), turned a
function openPalm(c, x, y, k, a, col, sh) {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k);
  fillPath(c, 'M -18 18 C -22 0 -22 -18 -19 -34 C -18 -42 -10 -42 -9 -34 L -8 -20 L -6 -44 C -5 -52 4 -52 5 -44 L 6 -22 L 9 -40 C 10 -48 18 -47 18 -39 L 17 -16 C 22 -24 30 -22 28 -12 C 24 2 18 12 16 20 Z', col);
  strokePath(c, 'M -10 4 C -2 8 8 8 14 2', sh, 1.6);
  c.restore();
}

// ---------- Vamana ----------
function vamanaC(c, o = {}) {
  const t = o.t || 0, P = { ...VISHNU_PAL, ...(o.pal || {}) }, br = Math.sin(t * 1.6) * 1.2, FY = 536, HK = 1.34;
  // the parasol's staff, held in his right hand (screen left), tilted in over his head
  const sb = [-150, -40], st = [-94, -850], at = (y) => lerp(sb[0], st[0], (sb[1] - y) / (sb[1] - st[1]));
  strokePath(c, `M ${sb[0]} ${sb[1]} L ${st[0]} ${st[1]}`, '#6A4220', 9);
  strokePath(c, `M ${sb[0] + 2} ${sb[1]} L ${st[0] + 2} ${st[1]}`, rgba('#B07A40', .7), 3);
  // feet and shins
  for (const s of [-1, 1]) {
    const fw = s < 0 ? 1.06 : 1, dy = s < 0 ? 6 : 0;
    limb(c, [[s * 34, -120], [s * 36, -70], [s * 35, -26 + dy]], [44, 36, 30], s < 0 ? P.skinSh : P.skin);
    fillPath(c, `M ${s * 18} ${-30 + dy} C ${s * 16} ${-12 + dy} ${s * 16} ${-2 + dy} ${s * 22} ${2 + dy} L ${s * 66 * fw} ${2 + dy} C ${s * 70 * fw} ${-6 + dy} ${s * 60} ${-14 + dy} ${s * 52} ${-20 + dy} L ${s * 50} ${-30 + dy} Z`, s < 0 ? P.skinSh : P.skin);
    ellipse(c, s * 35, -34 + dy, 22, 4, P.gold);
  }
  // the dhoti, to the knee; pleats; the munja belt
  const DH = 'M -76 -282 C -92 -224 -102 -170 -100 -110 L -36 -104 L 0 -96 L 36 -104 L 100 -110 C 102 -170 92 -224 76 -282 Z';
  fillPath(c, DH, P.dhoti);
  inside(c, DH, () => {
    fillPath(c, 'M -110 -290 C -80 -220 -66 -160 -70 -90 L -110 -90 Z', rgba(P.dhotiSh, .75));
    for (let i = -2; i <= 2; i++) strokePath(c, `M ${i * 9} -270 C ${i * 9} -200 ${i * 10} -150 ${i * 12} -100`, rgba(P.dhotiSh, .7), 2.4);
    strokePath(c, 'M -100 -116 L -36 -110 L 0 -102 L 36 -110 L 100 -116', P.ruby, 6);
  });
  // the torso, a boy's, a little round in the belly
  const TOR = `M -92 ${-424 + br} C -102 -380 -92 -330 -76 -280 L 76 -280 C 92 -330 102 -380 92 ${-424 + br} C 50 ${-438 + br} -50 ${-438 + br} -92 ${-424 + br} Z`;
  fillPath(c, TOR, P.skin);
  inside(c, TOR, () => {
    fillPath(c, 'M -110 -440 L -66 -440 C -76 -390 -72 -330 -54 -276 L -110 -276 Z', rgba(P.skinSh, .8));
    ellipse(c, 6, -322, 46, 34, rgba(P.skinDk, .12)); ellipse(c, 14, -334, 26, 16, rgba('#FFFFFF', .08));
    ellipse(c, 2, -316, 3, 4, rgba(P.skinDk, .5));
  });
  for (let i = 0; i < 4; i++) strokePath(c, `M -78 ${-290 + i * 4} Q 0 ${-278 + i * 4} 78 ${-290 + i * 4}`, i % 2 ? '#B89A4A' : '#D8C07A', 4);   // the munja grass belt, twisted
  // the deerskin over his left shoulder (screen right), across to his right hip; the sacred thread beside it
  const SKIN = 'M 36 -436 C 78 -434 104 -414 98 -384 C 64 -344 4 -302 -52 -270 L -82 -288 C -32 -330 18 -384 36 -436 Z';
  fillPath(c, SKIN, '#B88650');
  inside(c, SKIN, () => { fillPath(c, 'M -90 -300 C -30 -340 30 -390 50 -440 L 30 -440 C 10 -390 -40 -340 -100 -300 Z', rgba('#6E4A24', .5)); const r = lcg(4); for (let i = 0; i < 9; i++) ellipse(c, lerp(-60, 80, r()), lerp(-290, -420, r()), 6, 4, rgba('#F4E6C8', .85)); });
  strokePath(c, 'M 58 -428 C 30 -380 -20 -320 -70 -280', '#F4EEE0', 3.4);
  // his left arm (screen right), the kamandalu hanging from the hand
  figure(c, (a) => {
    const kx = 140, ky = -188;
    strokePath(a, `M ${kx - 26} ${ky - 22} C ${kx - 30} ${ky - 74} ${kx + 26} ${ky - 74} ${kx + 22} ${ky - 22}`, '#7A521C', 6);
    ellipse(a, kx, ky + 6, 40, 34, '#C48A2E'); inside(a, ellP(kx, ky + 6, 40, 34), () => { ellipse(a, kx + 18, ky + 14, 34, 34, rgba('#7A521C', .6)); ellipse(a, kx - 14, ky - 6, 10, 7, rgba('#FFE6A0', .7)); });
    fillPath(a, `M ${kx + 30} ${ky - 6} C ${kx + 52} ${ky - 14} ${kx + 62} ${ky - 30} ${kx + 66} ${ky - 44} L ${kx + 72} ${ky - 40} C ${kx + 68} ${ky - 18} ${kx + 54} ${ky + 4} ${kx + 34} ${ky + 10} Z`, '#B07A26');
    ellipse(a, kx, ky - 26, 22, 6, '#8A5A1C');
    ellipse(a, 96, -404, 26, 30, P.skin, -.2);
    limb(a, [[92, -414], [114, -336], [124, -262]], [40, 34, 28], P.skin);
    limb(a, [[102, -404], [122, -336], [130, -268]], [12, 10, 8], rgba(P.skinSh, .5));
    ellipse(a, 124, -248, 18, 20, P.skin); ellipse(a, 120, -276, 15, 4, P.gold);
  }, o.armFx || {});
  // the head, then the parasol's canopy over it
  // a child's face: the rig's head drawn wider and shorter, round cheeks with a blush
  headAt(c, FY - br * .5, HK, (h) => withSur(P, () => {
    h.translate(0, -815); h.scale(1.12, .94); h.translate(0, 815);
    suryaHead(h, { t, crown: false, bun: true, kundala: 'ring', tilak: false, stache: false, curls: false, smile: o.smile ?? .8, look: o.look, eyes: 1, pain: 0 });
    for (const s of [-1, 1]) ellipse(h, s * 28, -796, 13, 8, rgba('#E07AA0', .4));
    vTilak(h);
  }));
  // his right arm (screen left), the fist round the staff
  const hy = -300, hx = at(hy);
  figure(c, (a) => {
    ellipse(a, -96, -404, 26, 30, P.skin, .2);
    limb(a, [[-92, -414], [-120, -360], [hx + 6, hy + 6]], [40, 34, 28], P.skin);
    limb(a, [[-100, -416], [-128, -360], [hx, hy + 4]], [14, 12, 8], rgba(P.skinSh, .8));
    ellipse(a, hx, hy, 20, 24, P.skin); for (let i = 0; i < 3; i++) strokePath(a, `M ${hx - 14} ${hy - 10 + i * 9} L ${hx + 14} ${hy - 12 + i * 9}`, P.skinSh, 1.8);
    ellipse(a, hx + 2, hy + 24, 15, 4, P.gold);
  }, o.armFx || {});
  // the canopy: a shallow palm-leaf dome, ribs, a red and gold fringe
  c.save(); c.translate(st[0], st[1] + 30); c.rotate(.08);
  const CAN = 'M -190 30 C -170 -24 -90 -58 0 -60 C 90 -58 170 -24 190 30 C 120 16 -120 16 -190 30 Z';
  fillPath(c, CAN, '#D9A85A');
  inside(c, CAN, () => { fillPath(c, 'M -200 40 C -170 -20 -90 -54 -20 -62 L -40 40 Z', rgba('#A87434', .6)); for (let i = -6; i <= 6; i++) strokePath(c, `M 0 -60 Q ${i * 18} -20 ${i * 30} 30`, rgba('#7A4E20', .55), 2.4); });
  fillPath(c, 'M -190 30 C -120 16 120 16 190 30 C 120 42 -120 42 -190 30 Z', '#7A4E20');
  for (let i = 0; i <= 14; i++) { const x = lerp(-184, 184, i / 14), y = 30 + Math.sin(i / 14 * Math.PI) * 6; strokePath(c, `M ${x} ${y} L ${x + Math.sin(t * 2 + i) * 2} ${y + 18}`, i % 2 ? '#C8282E' : '#F2C04A', 5); }
  ellipse(c, 0, -66, 9, 12, P.gold);
  c.restore();
}

// ---------- Bali ----------
function baliC(c, o = {}) {
  const P = { ...BALI_PAL, ...(o.pal || {}) }, t = o.t || 0;
  withSur(P, () => {
    surya(c, { ...o, lotus: false, armFx: { alpha: 0 }, smile: o.smile ?? .6, eyes: o.eyes ?? 1, pain: 0 });
    yamaStache(c, P);
    const S = SUR, L = o.light ?? 1;
    // his left arm (screen right): held out, the gold pitcher in the hand
    figure(c, (a) => {
      ellipse(a, 146, -672, 33, 40, S.skin, -.2);
      limb(a, [[140, -680], [196, -604], [240, -528]], [62, 54, 46], S.skin);
      limb(a, [[240, -528], [300, -548], [354, -580]], [46, 40, 34], S.skin);
      if (L < 0) limb(a, [[150, -690], [200, -612], [246, -536]], [22, 18, 14], rgba(S.skinSh, .8)); else limb(a, [[240, -516], [300, -534], [350, -566]], [16, 14, 10], rgba(S.skinSh, .7));
      ellipse(a, 196, -604, 30, 8, S.gold, .7); ellipse(a, 330, -568, 18, 7, S.gold, -.5);
      // the pitcher (jhari): a gold body, a neck, a lid, a long spout toward the boy
      const px = 392, py = -520;
      fillPath(a, `M ${px + 34} ${py - 10} C ${px + 70} ${py - 30} ${px + 92} ${py - 62} ${px + 106} ${py - 96} L ${px + 116} ${py - 90} C ${px + 104} ${py - 48} ${px + 76} ${py - 10} ${px + 40} ${py + 10} Z`, S.goldSh);
      ellipse(a, px, py, 50, 46, S.gold);
      inside(a, ellP(px, py, 50, 46), () => { ellipse(a, px - 22 * L, py + 14, 46, 46, rgba(S.goldSh, .6)); ellipse(a, px + 16 * L, py - 18, 14, 9, rgba(S.goldLt, .9)); strokePath(a, `M ${px - 50} ${py + 2} Q ${px} ${py + 16} ${px + 50} ${py + 2}`, S.goldSh, 3); });
      fillPath(a, `M ${px - 18} ${py - 42} L ${px + 18} ${py - 42} L ${px + 14} ${py - 70} L ${px - 14} ${py - 70} Z`, S.gold);
      ellipse(a, px, py - 72, 22, 7, S.goldLt); ellipse(a, px, py - 84, 9, 12, S.gold); ellipse(a, px, py + 4, 9, 9, S.ruby);
      // the fist round the neck
      const hx = 370, hy = -586;
      fillPath(a, `M ${hx - 16} ${hy - 20} C ${hx + 4} ${hy - 30} ${hx + 26} ${hy - 22} ${hx + 30} ${hy - 4} C ${hx + 32} ${hy + 14} ${hx + 16} ${hy + 24} ${hx - 6} ${hy + 22} C ${hx - 22} ${hy + 18} ${hx - 26} ${hy - 8} ${hx - 16} ${hy - 20} Z`, S.skin);
      for (let i = 0; i < 3; i++) strokePath(a, `M ${hx + 6 + i * 7} ${hy - 22} l 2 34`, S.skinSh, 1.6);
    }, o.armFx || {});
    // his right arm (screen left): raised, the palm open: "ask"
    figure(c, (a) => {
      ellipse(a, -146, -672, 33, 40, S.skin, .2);
      limb(a, [[-140, -680], [-198, -604], [-236, -526]], [62, 54, 46], S.skin);
      limb(a, [[-236, -526], [-252, -600], [-258, -668]], [46, 40, 34], S.skin);
      if (L > 0) limb(a, [[-150, -690], [-206, -612], [-244, -534]], [22, 18, 14], rgba(S.skinSh, .8));
      ellipse(a, -198, -604, 30, 8, S.gold, -.7); ellipse(a, -256, -650, 19, 6, S.gold);
      openPalm(a, -260, -706, 1.25, -.12, S.palm, S.skinSh);
    }, o.armFx || {});
  });
}

// ---------- Shukracharya ----------
function shukraC(c, o = {}) {
  const P = { ...SHUKRA_PAL, ...(o.pal || {}) }, t = o.t || 0, pose = o.pose || 'wary', br = Math.sin(t * 1.4) * 1.2;
  if (pose === 'wary') { strokePath(c, 'M -178 4 L -170 -990', '#5A3A1C', 12); strokePath(c, 'M -176 0 L -168 -990', rgba('#A0703A', .6), 4); ellipse(c, -170, -998, 16, 16, '#6A4422'); }
  // feet under the robe
  for (const s of [-1, 1]) fillPath(c, `M ${s * 22} -30 C ${s * 20} -10 ${s * 22} 0 ${s * 30} 2 L ${s * 82} 2 C ${s * 84} -8 ${s * 70} -16 ${s * 60} -22 L ${s * 58} -30 Z`, s < 0 ? P.skinSh : P.skin);
  // the robe, shoulder to ankle
  const ROBE = `M -116 ${-698 + br} C -146 -520 -158 -260 -146 -26 L 146 -26 C 158 -260 146 -520 116 ${-698 + br} C 60 ${-712 + br} -60 ${-712 + br} -116 ${-698 + br} Z`;
  fillPath(c, ROBE, P.robe);
  inside(c, ROBE, () => {
    fillPath(c, 'M -170 -720 C -120 -520 -100 -260 -110 0 L -170 0 Z', rgba(P.robeSh, .8));
    for (let i = -2; i <= 2; i++) strokePath(c, `M ${i * 24} -460 C ${i * 26} -300 ${i * 30} -160 ${i * 34} -30`, rgba(P.robeSh, .55), 3);
    strokePath(c, 'M -150 -40 Q 0 -30 150 -40', '#F2C04A', 7);
  });
  // the shawl over his left shoulder (screen right)
  const SH = `M 30 ${-712 + br} C 96 -712 132 -690 126 -640 C 80 -520 -10 -430 -126 -350 L -146 -410 C -50 -480 6 -560 30 ${-712 + br} Z`;
  fillPath(c, SH, P.shawl); inside(c, SH, () => { fillPath(c, 'M -150 -380 C -40 -460 30 -560 50 -720 L 20 -720 C 0 -560 -60 -470 -160 -410 Z', rgba(P.shawlSh, .6)); strokePath(c, 'M 126 -640 C 80 -520 -10 -430 -126 -350', '#F2C04A', 5); });
  // the head: white hair in a knot, the tripundra, a long white beard
  headAt(c, 815, 1, (h) => withSur(P, () => {
    suryaHead(h, { t, crown: false, bun: true, kundala: false, tilak: 'tripundra', eyes: pose === 'shock' ? 1 : .7, fierce: pose === 'shock' ? 0 : .7, pain: pose === 'shock' ? .9 : 0, mouth: pose === 'shock' ? .7 : 0, look: o.look });
    const B = 'M -48 -806 C -56 -740 -40 -650 0 -606 C 40 -650 56 -740 48 -806 C 40 -770 26 -748 0 -746 C -26 -748 -40 -770 -48 -806 Z';
    fillPath(h, B, P.hair); inside(h, B, () => { for (let i = -3; i <= 3; i++) strokePath(h, `M ${i * 10} -760 Q ${i * 8} -700 ${i * 4} -620`, rgba('#B8B0A4', .6), 1.6); fillPath(h, 'M -60 -810 C -54 -740 -36 -660 -4 -610 L -60 -610 Z', rgba('#BDB4A6', .5)); });
    for (const s of [-1, 1]) fillPath(h, `M 0 -778 C ${s * 10} -781 ${s * 20} -780 ${s * 26} -768 C ${s * 18} -772 ${s * 8} -772 0 -771 Z`, P.hair);
  }));
  // rudraksha
  for (let i = 0; i <= 16; i++) { const u = i / 16, x = lerp(-56, 56, u), y = -700 + Math.sin(u * Math.PI) * 120 + br; ellipse(c, x, y, 6, 6, P.bead); }
  if (pose === 'wary') {
    // his right hand (screen left) on the staff; his left (screen right) raised, one finger up: a warning
    figure(c, (a) => { limb(a, [[-110, -684], [-160, -580], [-172, -470]], [52, 44, 36], P.skin); limb(a, [[-118, -690], [-170, -584], [-180, -476]], [18, 14, 10], rgba(P.skinSh, .8)); ellipse(a, -172, -456, 22, 26, P.skin); for (let i = 0; i < 3; i++) strokePath(a, `M -188 ${-466 + i * 9} L -156 ${-468 + i * 9}`, P.skinSh, 1.8); }, o.armFx || {});
    figure(c, (a) => {
      limb(a, [[110, -684], [184, -620], [196, -720]], [52, 44, 36], P.skin);
      fillPath(a, 'M 178 -716 C 176 -740 186 -752 204 -750 C 218 -748 222 -734 216 -716 C 210 -704 186 -702 178 -716 Z', P.skin);
      limb(a, [[200, -748], [202, -800]], [13, 10], P.skin);
      strokePath(a, 'M 184 -730 L 214 -732', P.skinSh, 1.6);
    }, o.armFx || {});
  } else {
    // both hands flung to his head
    for (const s of [-1, 1]) figure(c, (a) => { limb(a, [[s * 110, -684], [s * 196, -700], [s * 84, -858]], [52, 44, 36], P.skin); openPalm(a, s * 74, -880, 1.1, s * -.9, P.palm, P.skinSh); }, o.armFx || {});
  }
}

// ---------- Trivikrama ----------
function trivikramaC(c, o = {}) {
  const P = { ...VISHNU_PAL, ...(o.pal || {}) }, t = o.t || 0, L = o.light ?? -1, br = Math.sin(t * 1.4) * 1.2;
  const gust = .6 * (1 + .35 * Math.sin(t * 2.3));
  withSur(P, () => {
    const S = SUR, sh = (s) => (s === -L ? S.skinSh : S.skin);
    // hair behind the shoulders
    fillPath(c, 'M -50 -874 C -80 -850 -96 -800 -98 -740 L -86 -680 L 86 -680 L 98 -740 C 96 -800 80 -850 50 -874 Z', S.hair);
    // the upper arms, raised behind: the chakra (his right, screen left) and the conch (his left, screen right)
    const up = (s) => figure(c, (a) => {
      limb(a, [[s * 132, -690], [s * 232, -770], [s * 250, -890]], [60, 52, 40], S.skin);
      limb(a, [[s * 138, -700], [s * 236, -782], [s * 256, -886]], [20, 16, 12], rgba(S.skinSh, s === -L ? .9 : .35));
      ellipse(a, s * 232, -770, 30, 9, S.gold, s * -.7); ellipse(a, s * 250, -880, 21, 7, S.gold);
      if (s < 0) {   // fingers up, the chakra spinning on the forefinger
        fillPath(a, 'M -270 -890 C -272 -910 -266 -926 -252 -930 C -238 -930 -230 -918 -232 -898 Z', S.skin); limb(a, [[-246, -926], [-244, -962]], [13, 9], S.skin);
        chakra(a, -244, -1030, 62, t * 3, 1, t);
      } else {       // the conch, white with a spiral, held upright
        fillPath(a, 'M 232 -896 C 230 -916 240 -930 256 -930 C 272 -928 278 -914 274 -894 Z', S.skin);
        const cx = 258, cy = -980;
        fillPath(a, `M ${cx - 6} ${cy + 64} C ${cx - 40} ${cy + 40} ${cx - 44} ${cy - 10} ${cx - 22} ${cy - 46} C ${cx - 10} ${cy - 64} ${cx + 10} ${cy - 70} ${cx + 20} ${cy - 56} C ${cx + 40} ${cy - 30} ${cx + 38} ${cy + 20} ${cx + 14} ${cy + 64} Z`, '#F6F0E2');
        inside(a, `M ${cx - 6} ${cy + 64} C ${cx - 40} ${cy + 40} ${cx - 44} ${cy - 10} ${cx - 22} ${cy - 46} C ${cx - 10} ${cy - 64} ${cx + 10} ${cy - 70} ${cx + 20} ${cy - 56} C ${cx + 40} ${cy - 30} ${cx + 38} ${cy + 20} ${cx + 14} ${cy + 64} Z`, () => { ellipse(a, cx + 26, cy + 10, 30, 70, rgba('#C8B898', .6)); for (let i = 0; i < 4; i++) strokePath(a, `M ${cx - 30} ${cy - 30 + i * 24} Q ${cx} ${cy - 18 + i * 24} ${cx + 30} ${cy - 34 + i * 24}`, rgba('#B8A27E', .8), 2.4); });
        fillPath(a, `M ${cx - 6} ${cy + 64} L ${cx + 14} ${cy + 64} L ${cx + 8} ${cy + 86} Z`, '#E8DCC4');
        glow(a, cx, cy, 80, '#FFF4D8', .25);
      }
    }, o.armFx || {});
    up(-1); up(1);
    // the raised leg (screen left), up through the sky; the sole toward us
    const RL = [[-46, -470], [-330, -650], [-596, -856]];
    limb(c, RL, [118, 90, 62], sh(-1));
    limb(c, [[-40, -486], [-326, -672], [-590, -874]], [40, 30, 20], rgba(L < 0 ? '#FFFFFF' : S.skinDk, L < 0 ? .1 : .35));
    c.save(); c.translate(-628, -892); c.rotate(Math.atan2(-856 + 650, -596 + 330) + Math.PI / 2);
    const SOLE = 'M -40 40 C -48 0 -44 -60 -24 -96 C -12 -116 16 -116 28 -96 C 46 -60 50 0 40 40 C 30 64 -30 64 -40 40 Z';
    fillPath(c, SOLE, S.skin); inside(c, SOLE, () => { ellipse(c, 0, -10, 34, 80, rgba(P.sole, .55)); ellipse(c, 0, 30, 26, 22, rgba(P.sole, .5)); });
    for (let i = 0; i < 5; i++) { const a = -1 + i * .5, r = [16, 13, 12, 11, 10][i]; ellipse(c, Math.sin(a) * 40, -108 - Math.cos(a) * 18 + Math.abs(i - 0) * 2, r, r * 1.15, S.skin); ellipse(c, Math.sin(a) * 40, -110 - Math.cos(a) * 18, r * .6, r * .6, rgba(P.sole, .6)); }
    c.restore();
    ellipse(c, -584, -846, 36, 14, S.gold, -.65);
    // the standing leg (screen right), the foot on the earth
    limb(c, [[48, -470], [62, -250], [52, -46]], [120, 92, 64], sh(1));
    fillPath(c, 'M 30 -50 C 26 -24 22 -8 28 0 L 120 0 C 126 -10 112 -20 96 -26 C 86 -32 80 -40 78 -50 Z', sh(1));
    ellipse(c, 52, -54, 34, 10, S.gold);
    // the pitambara: the hips, the cloth over each thigh, the pleats falling between, a red sash flying
    limb(c, [[-30, -466], [-170, -556], [-262, -612]], [150, 130, 116], S.dhoti);
    limb(c, [[-150, -590], [-262, -640]], [40, 30], rgba(S.dhotiSh, .3));
    limb(c, [[44, -460], [54, -380], [60, -318]], [150, 132, 118], S.dhoti);
    const HIP = 'M -104 -526 C -118 -476 -122 -430 -112 -390 L 116 -390 C 124 -430 118 -476 104 -526 Z';
    fillPath(c, HIP, S.dhoti);
    inside(c, HIP, () => fillPath(c, `M ${140 * -L} -530 C ${100 * -L} -480 ${96 * -L} -430 ${104 * -L} -380 L ${140 * -L} -380 Z`, rgba(S.dhotiSh, .6)));
    strokePath(c, 'M -270 -676 C -322 -650 -326 -600 -280 -556', S.gold, 9);
    strokePath(c, 'M 2 -290 C 30 -264 90 -264 118 -290', S.gold, 9);
    fillPath(c, 'M -26 -500 L 26 -500 L 36 -250 C 12 -236 -12 -236 -36 -250 Z', S.dhoti);
    for (let i = -1; i <= 1; i++) strokePath(c, `M ${i * 12} -496 L ${i * 18} -246`, rgba(S.dhotiSh, .8), 2.6);
    strokePath(c, 'M -36 -250 C -12 -236 12 -236 36 -250', S.gold, 6);
    for (const s of [-1, 1]) limb(c, [[s * 90, -470], [s * (120 + gust * 20), -400], [s * (130 + gust * 46), -330], [s * (150 + gust * 70), -270]], [16, 14, 12, 3], s > 0 ? S.ruby : '#A0141E', false);
    fillPath(c, 'M -100 -512 Q 0 -500 100 -512 L 98 -484 Q 0 -472 -98 -484 Z', S.gold);
    ellipse(c, 0, -492, 16, 13, S.ruby);
    // the torso, bare
    const TORSO = `M -90 -500 C -96 -560 -116 -610 -126 -646 C -134 -670 -142 -690 -150 -700 C -116 -720 -64 ${-722 + br} -27 -728 L 27 -728 C 64 ${-722 + br} 116 -720 150 -700 C 142 -690 134 -670 126 -646 C 116 -610 96 -560 90 -500 Z`;
    fillPath(c, TORSO, S.skin);
    inside(c, TORSO, () => {
      c.save(); c.scale(L, 1); fillPath(c, 'M -160 -740 L -96 -740 C -96 -660 -78 -580 -60 -496 L -160 -496 Z', rgba(S.skinSh, .85)); c.restore();
      for (const s of [-1, 1]) strokePath(c, `M ${s * 108} ${-650 + br} C ${s * 80} ${-618 + br} ${s * 40} ${-612 + br} ${s * 8} ${-624 + br}`, rgba(S.skinDk, .5), 3);
      strokePath(c, 'M 0 -600 L 0 -520', rgba(S.skinDk, .35), 2.4); ellipse(c, 0, -536, 4, 5, rgba(S.skinDk, .45));
    });
    // the sacred thread, over his left shoulder (screen right) to his right hip
    strokePath(c, `M 92 ${-716 + br} C 50 -640 -30 -560 -88 -508`, '#F6F0E2', 4);
    suryaHead(c, { t, crown: true, kundala: 'ring', tilak: false, stache: false, smile: o.smile ?? .5, look: o.look, light: L, eyes: 1, pain: 0 });
    vTilak(c);
    // necklaces, the Kaustubha gem, the vanamala (forest garland) to the thighs
    for (let r = 0; r < 2; r++) for (let i = 0; i <= 20; i++) { const u = i / 20, x = lerp(-36 - r * 8, 36 + r * 8, u), y = -720 + Math.pow(Math.sin(u * Math.PI), .8) * (40 + r * 26) + br; ellipse(c, x, y, 4 - r * .6, 4 - r * .6, r ? S.goldLt : S.gold); }
    ellipse(c, 0, -650 + br, 15, 15, S.gold); ellipse(c, 0, -650 + br, 10, 10, '#E2384A'); ellipse(c, -3, -654 + br, 3, 3, '#FFD0D4');
    const FL = ['#F7F2E8', '#F2A23A', '#E8463A', '#F2D040', '#6EB04E'];
    for (let i = 0; i <= 44; i++) { const u = i / 44, x = Math.sin((u - .5) * Math.PI) * 112, y = -716 + Math.pow(Math.sin(u * Math.PI), .9) * 380 + br; ellipse(c, x, y, 10, 10, FL[i % 5]); ellipse(c, x, y, 3, 3, rgba('#5A3A10', .5)); if (i % 3 === 0) ellipse(c, x + 8, y + 6, 8, 4, '#3E8A3A', .6); }
    // shoulders, armlets
    for (const s of [-1, 1]) { ellipse(c, s * 142, -680, 34, 38, sh(s), s * -.2); }
    // the lower arms: his right (screen left) raised in blessing, his left (screen right) resting on the gada
    figure(c, (a) => {
      limb(a, [[-140, -676], [-206, -586], [-168, -652]], [58, 50, 40], S.skin);
      ellipse(a, -206, -586, 30, 9, S.gold, .6);
      openPalm(a, -162, -700, 1.35, .15, S.palm, S.skinSh);
    }, o.armFx || {});
    figure(c, (a) => {
      // the gada: a gold mace planted beside him, his palm on its head
      strokePath(a, 'M 236 -420 L 244 -40', S.goldSh, 22); strokePath(a, 'M 232 -420 L 240 -40', S.gold, 10);
      ellipse(a, 244, -30, 24, 12, S.goldSh);
      ellipse(a, 236, -446, 50, 46, S.gold);
      inside(a, ellP(236, -446, 50, 46), () => { ellipse(a, 236 - 26 * L, -434, 46, 46, rgba(S.goldSh, .5)); for (let i = -2; i <= 2; i++) strokePath(a, `M ${236 + i * 18} -490 Q ${236 + i * 24} -446 ${236 + i * 18} -402`, rgba(S.goldSh, .7), 2.4); ellipse(a, 236 + 16 * L, -468, 12, 8, rgba(S.goldLt, .9)); });
      ellipse(a, 236, -496, 12, 10, S.gold);
      limb(a, [[140, -676], [214, -590], [232, -510]], [58, 50, 40], S.skin);
      ellipse(a, 214, -590, 30, 9, S.gold, -.6);
      fillPath(a, 'M 204 -520 C 206 -546 232 -556 256 -544 C 272 -534 272 -510 256 -502 C 236 -494 210 -500 204 -520 Z', S.skin);
    }, o.armFx || {});
  });
}
// Bali on his knees, bowed low, his hands joined: a small figure facing screen right, side view; the front knee at (0, 0),
// ~380 tall; o.t
function baliKneel(c, o = {}) {
  const P = BALI_PAL, t = o.t || 0, br = Math.sin(t * 1.3) * 2;
  // the shins along the ground, the feet behind
  limb(c, [[0, -24], [-110, -22], [-196, -18]], [58, 50, 40], P.dhotiSh);
  fillPath(c, 'M -190 -40 C -214 -40 -236 -30 -246 -8 L -244 0 L -180 0 Z', P.skinSh);
  // the thigh, from the knee back up to the hip; the dhoti's folds
  limb(c, [[6, -30], [-40, -100], [-92, -168]], [70, 86, 104], P.dhoti);
  strokePath(c, 'M -20 -60 C -50 -100 -70 -130 -96 -150', rgba(P.dhotiSh, .7), 4);
  // the torso, leaning far forward over the knee
  limb(c, [[-96, -176], [-20, -250 + br], [66, -280 + br]], [108, 112, 100], P.skin);
  limb(c, [[-110, -200], [-40, -272 + br], [50, -302 + br]], [30, 30, 24], rgba(P.skinSh, .7));
  limb(c, [[-120, -168], [-70, -186]], [40, 40], '#E8B442');
  strokePath(c, `M 50 ${-312 + br} C 0 -280 -50 -240 -96 -200`, '#F4EEE0', 3);
  // the head, bowed, the crown leaning forward: "place your third step here"
  c.save(); c.translate(126, -290 + br); c.rotate(1.85);
  fillPath(c, 'M -40 -10 C -50 30 -40 70 -20 90 L 10 60 Z', P.hair);
  ellipse(c, 0, 0, 44, 52, P.skin);
  fillPath(c, 'M 30 -12 L 52 2 L 36 10 Z', P.skin);
  fillPath(c, 'M 16 24 C 30 26 40 34 40 44 C 30 40 20 36 12 34 Z', P.hair);
  fillPath(c, 'M -44 -30 L -34 -110 L -16 -150 L 0 -170 L 16 -150 L 34 -110 L 44 -30 C 20 -40 -20 -40 -44 -30 Z', '#E8B442');
  strokePath(c, 'M -44 -32 C -20 -42 20 -42 44 -32', '#9A6A1E', 4); ellipse(c, 0, -80, 9, 9, '#C81E2A'); ellipse(c, 0, -178, 8, 12, '#E8B442');
  c.restore();
  // the arms, the palms joined before his bowed face
  limb(c, [[50, -286 + br], [110, -200], [176, -196]], [44, 38, 30], P.skin);
  fillPath(c, 'M 168 -186 C 190 -214 220 -230 232 -222 C 234 -200 210 -180 184 -172 Z', P.palm);
  ellipse(c, 160, -192, 16, 6, '#E8B442', -.2);
}
