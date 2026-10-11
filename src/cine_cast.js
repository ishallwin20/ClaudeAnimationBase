// cine_cast.js: the rest of the cast for the cinematic engine, mostly figures that read as rim-lit silhouettes.
// Same units as cine_shiva.js: feet at (0, 0), up is -y, an adult stands about 820–1000 tall.
//   sati(c, o)          Sati from behind: red sari with a gold border, the pallu over her shoulder, hair down her back
//   daksha(c, o)        King Daksha on his throne, pointing (o.point), shaking with laughter (o.laugh)
//   crowd(c, ...)       a row of seated guests (heads and shoulders), bobbing when they laugh
//   rudra(c, o)         Shiva's Rudra Tandava: stamping, Sati's body across his shoulders, locks flying
//   shivaSeated(c, o)   Shiva in padmasana with the trishul planted beside him
//   nandiLying(c, o)    Nandi lying down, side view facing left
//   chakra(c, ...)      the Sudarshan chakra: a spinning, flaming disc of light
//   yagna(c, ...)       the fire altar and its fire
const SATI = { skin: '#B9785A', skinSh: '#8E5640', hair: '#16101A', hairLt: '#33263A', sari: '#A51E2C', sariSh: '#6E1320', border: '#E3A93B', blouse: '#7A1420', flower: '#F3EBD8' };

// ---------- Sati, seen from behind ----------
// o: t, wind (the pallu's end and her hair lift), trishul (true: Shailputri's, held in her right hand), lotus.
function sati(c, o = {}) {
  const t = o.t || 0, g = (o.wind ?? .3) * (1 + .3 * Math.sin(t * 2.1)), S = SATI;
  if (o.trishul) {
    const X = 128;
    fillPath(c, `M ${X - 4} 6 L ${X - 4} -1000 L ${X + 4} -1000 L ${X + 4} 6 Z`, '#9AA2AE');
    fillPath(c, `M ${X - 38} -1006 C ${X - 44} -1036 ${X - 40} -1066 ${X - 28} -1086 C ${X - 32} -1060 ${X - 30} -1034 ${X - 18} -1012 Z M ${X + 38} -1006 C ${X + 44} -1036 ${X + 40} -1066 ${X + 28} -1086 C ${X + 32} -1060 ${X + 30} -1034 ${X + 18} -1012 Z`, '#9AA2AE');
    fillPath(c, `M ${X - 40} -998 C ${X - 24} -1016 ${X + 24} -1016 ${X + 40} -998 L ${X + 32} -992 C ${X + 16} -1006 ${X - 16} -1006 ${X - 32} -992 Z`, '#9AA2AE');
    fillPath(c, `M ${X} -1120 C ${X + 11} -1096 ${X + 10} -1046 ${X + 5} -1010 L ${X - 5} -1010 C ${X - 10} -1046 ${X - 11} -1096 ${X} -1120 Z`, '#9AA2AE');
  }
  // the skirt of the sari, pleated, its gold border at the hem
  const SKIRT = 'M -62 -500 C -72 -330 -94 -150 -110 0 L 110 0 C 94 -150 72 -330 62 -500 Z';
  fillPath(c, SKIRT, S.sari);
  inside(c, SKIRT, () => {
    for (let i = -3; i <= 3; i++) strokePath(c, `M ${i * 14} -470 C ${i * 18} -300 ${i * 24} -150 ${i * 30} 10`, rgba(S.sariSh, .8), 3);
    fillPath(c, 'M -130 -30 L 130 -30 L 130 10 L -130 10 Z', S.border);
    fillPath(c, 'M -130 -40 L 130 -40 L 130 -34 L -130 -34 Z', S.border);
  });
  fillPath(c, 'M -60 -560 C -62 -540 -63 -520 -63 -494 L 63 -494 C 63 -520 62 -540 60 -560 Z', S.skin);   // the waist
  // back, the choli, the neck
  fillPath(c, 'M -96 -690 C -102 -660 -86 -620 -72 -590 C -66 -575 -62 -565 -60 -556 L 60 -556 C 62 -565 66 -575 72 -590 C 86 -620 102 -660 96 -690 C 70 -712 30 -716 0 -716 C -30 -716 -70 -712 -96 -690 Z', S.skin);
  fillPath(c, 'M -92 -680 C -96 -650 -82 -620 -72 -600 L 72 -600 C 82 -620 96 -650 92 -680 C 64 -700 30 -704 0 -704 C -30 -704 -64 -700 -92 -680 Z', S.blouse);
  fillPath(c, 'M -19 -742 L -21 -700 L 21 -700 L 19 -742 Z', S.skinSh);
  // arms at her sides, red-and-gold bangles; Shailputri's right hand holds the trishul, her left a lotus
  for (const s of [-1, 1]) {
    const hold = o.trishul && s > 0;
    const P = hold ? [[s * 94, -680], [s * 112, -600], [s * 124, -540], [s * 126, -520]] : [[s * 94, -680], [s * 110, -590], [s * 116, -500], [s * 118, -432]];
    limb(c, P, [34, 29, 25, 21], S.skin);
    limb(c, [[s * 94, -684], [s * 104, -640]], [40, 34], S.blouse);
    const w = P[P.length - 1];
    ellipse(c, w[0], w[1] - 14, 13, 5, S.border); ellipse(c, w[0], w[1] - 22, 13, 4, S.sari);
    if (o.lotus && s < 0) { glow(c, w[0] - 6, w[1] + 20, 60, '#FFB0C0', .3); for (let i = 0; i < 5; i++) { c.save(); c.translate(w[0] - 4, w[1] + 22); c.rotate((i - 2) * .38); fillPath(c, 'M 0 0 C -9 -12 -7 -28 0 -36 C 7 -28 9 -12 0 0 Z', i % 2 ? '#F2A6B6' : '#E48A9E'); c.restore(); } }
  }
  // the pallu, over her left shoulder (screen left), across her back to the right hip, its end lifting in the wind
  const PP = [[-82, -694], [-24, -650], [36, -572], [80, -486], [98 + g * 12, -400], [104 + g * 34, -320]];
  limb(c, PP, [56, 92, 100, 94, 84, 76], S.border, false);
  limb(c, PP.map(([x, y]) => [x - 2, y - 2]), [44, 78, 86, 80, 70, 62], S.sari, false);
  limb(c, PP.map(([x, y]) => [x + 6, y + 4]), [8, 14, 14, 12, 10, 8], rgba(S.sariSh, .6), false);
  // head and hair: loose to the waist, jasmine at the crown, jhumkas peeking out
  for (const s of [-1, 1]) { ellipse(c, s * 43, -736, 7, 9, S.border); ellipse(c, s * 43, -724, 9, 6, S.border); }
  ellipse(c, 0, -772, 44, 52, S.hair);
  const HAIR = `M -46 -790 C -56 -740 -50 -690 -44 -640 C -40 -590 ${-34 + g * 6} -540 ${-22 + g * 10} -500 L ${g * 14} -466 L ${22 + g * 10} -500 C ${34 + g * 6} -540 40 -590 44 -640 C 50 -690 56 -740 46 -790 Z`;
  fillPath(c, HAIR, S.hair);
  for (let i = -2; i <= 2; i++) strokePath(c, `M ${i * 10} -800 C ${i * 13} -720 ${i * 11 + g * 4} -600 ${i * 6 + g * 10} -500`, rgba(S.hairLt, .9), 2);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (.15 + .7 * i / 8); ellipse(c, Math.cos(a) * 40, -770 - Math.sin(a) * 24, 4.5, 4.5, S.flower); }
}

// ---------- Daksha on his throne ----------
// o: t, col (the figure), col2 (the throne), point (0..1 his arm out toward screen left), laugh (0..1 shaking)
function daksha(c, o = {}) {
  const t = o.t || 0, col = o.col || '#140C10', col2 = o.col2 || '#24141A', lh = (o.laugh || 0) * Math.abs(Math.sin(t * 13)) * 6, p = o.point ?? 1;
  fillPath(c, 'M -180 0 L -180 -560 C -180 -720 -96 -810 0 -822 C 96 -810 180 -720 180 -560 L 180 0 Z', col2);
  for (const s of [-1, 1]) { ellipse(c, s * 176, -600, 20, 20, col2); fillPath(c, `M ${s * 176} -620 L ${s * 186} -660 L ${s * 166} -660 Z`, col2); }
  fillPath(c, 'M -6 -820 L 0 -880 L 6 -820 Z', col2); ellipse(c, 0, -884, 12, 12, col2);
  fillPath(c, 'M -230 -320 L 230 -320 L 230 0 L -230 0 Z', col2);   // the seat
  c.save(); c.translate(0, -lh);
  fillPath(c, 'M -128 0 L -118 -150 C -116 -232 -104 -300 -84 -336 L 84 -336 C 104 -300 116 -232 118 -150 L 128 0 Z', col);
  fillPath(c, 'M -84 -330 C -92 -400 -102 -460 -112 -520 C -80 -546 -40 -552 0 -554 C 40 -552 80 -546 112 -520 C 102 -460 92 -400 84 -330 Z', col);
  limb(c, [[104, -516], [150, -430], [160, -350]], [44, 36, 30], col);
  const ex = lerp(-150, -300, p), ey = lerp(-380, -520, p);
  limb(c, [[-104, -516], [lerp(-150, -200, p), lerp(-440, -500, p)], [ex, ey]], [44, 36, 28], col);
  limb(c, [[ex, ey], [ex - 34 * p, ey - 6 * p]], [16, 8], col);   // the pointing finger
  fillPath(c, 'M -18 -580 L -20 -552 L 20 -552 L 18 -580 Z', col);
  ellipse(c, 0, -616, 40, 48, col);
  fillPath(c, 'M -34 -610 C -36 -570 -20 -530 0 -508 C 20 -530 36 -570 34 -610 Z', col);   // beard
  fillPath(c, 'M -40 -640 L -34 -712 L -18 -700 L 0 -752 L 18 -700 L 34 -712 L 40 -640 Z', col);   // crown
  c.restore();
}
// A row of seated guests from behind/side: n heads and shoulders across [x0, x1] at y, scale k; laugh makes them bob.
function crowd(c, x0, x1, y, n, k, t, laugh, col, seed = 1) {
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + .5) / n) + (hash(i + seed) - .5) * 20 * k, b = laugh * Math.abs(Math.sin(t * (10 + hash(i * 3 + seed) * 6) + i)) * 5 * k, s = k * (.9 + hash(i * 7 + seed) * .2);
    c.save(); c.translate(x, y - b); c.scale(s, s);
    fillPath(c, 'M -60 0 C -60 -50 -40 -70 0 -72 C 40 -70 60 -50 60 0 Z', col);
    ellipse(c, 0, -94, 22, 26, col);
    if (hash(i * 11 + seed) > .5) ellipse(c, 0, -122, 12, 11, col); else fillPath(c, 'M -24 -104 C -26 -130 26 -130 24 -104 Z', col);
    c.restore();
  }
}

// ---------- the Rudra Tandava ----------
// Shiva stamping out the dance of grief, carrying Sati's body across his arms. He is a dark silhouette; she keeps her
// colours (red sari, gold border) so she reads against him. o: t, col, beat (the step period, s).
// Returns the stamp's strength at t (0..1), for shakes and booms; the stamp lands at 70% of each beat.
function satiCarried(c, t, hs) {
  const S = SATI, sk = '#8A5040', sari = '#8A1A24', sariSh = '#5A0F18', bd = '#D89A3A';
  // her hair, falling from her hanging head
  limb(c, [[-214, -600], [-226 + hs * .2, -540], [-232 + hs * .5, -470], [-236 + hs, -400]], [52, 46, 34, 6], S.hair, false);
  // her arm hanging down
  limb(c, [[-150, -626], [-158 + hs * .3, -560], [-162 + hs * .5, -500]], [24, 20, 16], sk);
  ellipse(c, -162 + hs * .5, -510, 10, 4, bd);
  // the body: shoulders, waist, hips, the knees over his arm, the shins hanging
  limb(c, [[-170, -630], [-90, -626], [-10, -606], [70, -606], [150, -624]], [56, 50, 58, 64, 50], sari);
  limb(c, [[150, -624], [196, -596], [222 + hs * .2, -540], [230 + hs * .4, -500]], [48, 40, 34, 28], sari);
  limb(c, [[-160, -644], [-60, -632], [40, -620], [150, -640]], [8, 8, 8, 8], bd, false);   // the border along her side
  limb(c, [[150, -624], [198, -600], [226, -544], [232 + hs * .4, -506]], [6, 6, 6, 6], bd, false);
  fillPath(c, `M ${226 + hs * .4} -508 C ${236 + hs * .4} -496 ${238 + hs * .4} -480 ${226 + hs * .4} -474 L ${216 + hs * .4} -500 Z`, sk);   // a foot
  // the pallu slipping and hanging, fluttering
  fillPath(c, `M 60 -600 C 70 -570 ${80 + hs * .4} -530 ${86 + hs} -486 L ${118 + hs} -494 C ${110 + hs * .4} -540 104 -574 104 -606 Z`, sariSh);
  strokePath(c, `M ${86 + hs} -486 L ${118 + hs} -494`, bd, 6);
  // her head, tipped back
  ellipse(c, -206, -612, 30, 34, sk); ellipse(c, -214, -606, 30, 32, S.hair);
}
function rudra(c, o = {}) {
  const t = o.t || 0, col = o.col || '#120A12', P = o.beat || 1.1;
  const n = Math.floor(t / P), p = t / P - n, side = n % 2 ? 1 : -1, lift = p < .7 ? Math.sin(Math.PI * p / .7) ** 2 : 0;
  const bob = -lift * 26, lean = side * lift * .05, sway = Math.sin(t * Math.PI / P) * 10, hs = Math.sin(t * Math.PI * 2 / P + 1) * 14;
  c.save(); c.rotate(lean); c.translate(sway, 0);
  // locks streaming out to the sides and down, waving
  c.save(); c.translate(0, bob);
  for (const s of [-1, 1]) for (let i = 0; i < 5; i++) {
    const y0 = -870 + i * 16, len = 220 + (i % 3) * 40, ph = t * 3.2 + i * .9 + (s > 0 ? 1.3 : 0);
    limb(c, [[s * 30, y0], [s * (30 + len * .3), y0 + 10 + Math.sin(ph) * 12], [s * (30 + len * .65), y0 + 40 + i * 14 + Math.sin(ph + 1) * 22], [s * (30 + len), y0 + 80 + i * 26 + Math.sin(ph + 2) * 30]], [30, 26, 16, 3], col, false);
  }
  c.restore();
  // legs: one stamps while the other is raised, knee out to the side
  for (const s of [-1, 1]) {
    const up = s === side ? lift : 0, hip = [s * 38, -480];
    const knee = [s * (96 + up * 90), -270 - up * 150], ank = [s * (78 + up * 30), -64 - up * 250];
    limb(c, [hip, [lerp(hip[0], knee[0], .5) + s * 8, lerp(hip[1], knee[1], .5)], knee, [lerp(knee[0], ank[0], .45) + s * 6, lerp(knee[1], ank[1], .45)], ank], [86, 76, 56, 50, 34], col);
    fillPath(c, `M ${ank[0] - 26} ${ank[1] + 16} L ${ank[0] + s * 50} ${ank[1] + 16} C ${ank[0] + s * 44} ${ank[1]} ${ank[0] + s * 20} ${ank[1] - 10} ${ank[0]} ${ank[1] - 12} Z`, col);
  }
  c.translate(0, bob);
  // the tiger skin flaring with the stamp, the torso, neck, head and jata
  fillPath(c, `M -86 -520 C -110 -470 ${-130 - lift * 20} -420 ${-136 - lift * 30} -370 L -96 -384 L -64 -360 L -30 -386 L 0 -360 L 30 -386 L 64 -360 L 96 -384 L ${136 + lift * 30} -370 C ${130 + lift * 20} -420 110 -470 86 -520 Z`, col);
  fillPath(c, 'M -82 -510 C -92 -580 -112 -640 -136 -700 C -100 -726 -52 -734 -22 -740 L 22 -740 C 52 -734 100 -726 136 -700 C 112 -640 92 -580 82 -510 Z', col);
  for (const s of [-1, 1]) ellipse(c, s * 132, -684, 38, 46, col, s * -.2);
  fillPath(c, 'M -24 -736 L -22 -772 L 22 -772 L 24 -736 Z', col);
  ellipse(c, 0, -818, 42, 54, col);
  fillPath(c, 'M -38 -850 C -46 -896 -28 -938 2 -950 C 32 -938 50 -896 42 -850 Z', col);
  ellipse(c, 2, -956, 16, 13, col);
  // upper arms down to the elbows, then Sati, then his forearms around her
  for (const s of [-1, 1]) limb(c, [[s * 134, -690], [s * 170, -620], [s * 168, -560]], [58, 50, 44], col);
  satiCarried(c, t, hs);
  limb(c, [[-168, -560], [-150, -600], [-128, -632]], [42, 36, 30], col); ellipse(c, -124, -640, 18, 22, col);   // under her shoulders
  limb(c, [[168, -560], [150, -600], [134, -630]], [42, 36, 30], col); ellipse(c, 132, -636, 18, 22, col);   // under her knees
  c.restore();
  return p < .7 ? 0 : Math.exp(-(p - .7) * P * 10);
}

// ---------- Shiva in meditation ----------
function shivaSeated(c, o = {}) {
  const col = o.col || '#0E1220', t = o.t || 0;
  const X = 200;   // the trishul, planted beside him
  fillPath(c, `M ${X - 4} 10 L ${X - 4} -560 L ${X + 4} -560 L ${X + 4} 10 Z`, col);
  fillPath(c, `M ${X - 34} -566 C ${X - 40} -594 ${X - 36} -620 ${X - 24} -640 C ${X - 28} -616 ${X - 26} -592 ${X - 14} -572 Z M ${X + 34} -566 C ${X + 40} -594 ${X + 36} -620 ${X + 24} -640 C ${X + 28} -616 ${X + 26} -592 ${X + 14} -572 Z`, col);
  fillPath(c, `M ${X - 36} -558 C ${X - 20} -574 ${X + 20} -574 ${X + 36} -558 L ${X + 28} -552 C ${X + 14} -564 ${X - 14} -564 ${X - 28} -552 Z`, col);
  fillPath(c, `M ${X} -676 C ${X + 10} -654 ${X + 9} -610 ${X + 4} -572 L ${X - 4} -572 C ${X - 9} -610 ${X - 10} -654 ${X} -676 Z`, col);
  fillPath(c, 'M -160 0 C -160 -56 -96 -86 0 -84 C 96 -86 160 -56 160 0 Z', col);
  fillPath(c, 'M -70 -70 C -76 -150 -96 -224 -112 -276 C -80 -298 -40 -304 0 -306 C 40 -304 80 -298 112 -276 C 96 -224 76 -150 70 -70 Z', col);
  for (const s of [-1, 1]) { limb(c, [[s * 108, -266], [s * 132, -170], [s * 124, -84]], [40, 32, 26], col); ellipse(c, s * 122, -70, 20, 14, col); }
  fillPath(c, 'M -18 -300 L -18 -330 L 18 -330 L 18 -300 Z', col);
  ellipse(c, 0, -362, 34, 42, col);
  fillPath(c, `M -32 -386 C -36 -420 -24 -452 ${2 + Math.sin(t) * .5} -462 C 28 -452 40 -420 36 -386 Z`, col);
  for (const s of [-1, 1]) limb(c, [[s * 30, -380], [s * 44, -330], [s * 60, -290]], [16, 14, 4], col, false);
}

// ---------- Nandi, lying down, side view facing screen left ----------
function nandiLying(c, o = {}) {
  const col = o.col || '#140C12', t = o.t || 0, nod = Math.sin(t * 1.2) * .03;
  fillPath(c, 'M 230 -40 C 250 -110 220 -190 120 -200 C 40 -226 -60 -226 -120 -196 C -170 -170 -190 -110 -180 -40 C -180 -10 -150 0 -110 0 L 200 0 C 224 0 232 -20 230 -40 Z', col);
  fillPath(c, 'M -160 -190 C -150 -296 -60 -306 -20 -206 Z', col);   // the hump
  limb(c, [[-150, -40], [-230, -16], [-276, -8]], [50, 34, 26], col);   // the folded foreleg
  limb(c, [[226, -60], [262, -30], [270, 10]], [14, 10, 6], col, false); ellipse(c, 272, 12, 10, 14, col);   // tail
  c.save(); c.translate(-150, -180); c.rotate(nod);
  limb(c, [[0, 0], [-56, -40], [-104, -76]], [120, 90, 66], col);   // the neck, raised
  fillPath(c, 'M -70 -40 C -86 -10 -100 10 -112 14 C -100 -20 -96 -40 -90 -60 Z', col);   // the dewlap
  limb(c, [[-104, -76], [-128, -48], [-142, -14]], [64, 54, 44], col);   // the head, the muzzle down
  ellipse(c, -146, -12, 24, 20, col);
  limb(c, [[-92, -100], [-84, -150], [-60, -176]], [16, 12, 4], col, false);   // horns
  limb(c, [[-112, -104], [-118, -152], [-100, -184]], [15, 11, 4], col, false);
  ellipse(c, -70, -92, 26, 10, col, .45);   // the ear
  c.restore();
}

// ---------- the Sudarshan chakra ----------
function chakra(c, x, y, r, ang, a = 1, t = 0) {
  if (a <= 0) return;
  glow(c, x, y, r * 5, '#FFAA3A', .6 * a); glow(c, x, y, r * 1.8, '#FFF2C8', .8 * a);
  c.save(); c.translate(x, y); c.rotate(ang); c.globalAlpha *= a;
  c.fillStyle = '#FFB347'; c.beginPath();
  for (let i = 0; i < 48; i++) { const q = i / 48 * TAU, rr = i % 2 ? r * 1.04 : r * (1.32 + .1 * Math.sin(t * 30 + i)); c.lineTo(Math.cos(q) * rr, Math.sin(q) * rr); }
  c.closePath(); c.fill();
  ellipse(c, 0, 0, r * 1.02, r * 1.02, '#FFE7A6');
  ellipse(c, 0, 0, r * .84, r * .84, '#C8761E');
  c.strokeStyle = '#FFE7A6'; c.lineWidth = r * .07; c.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const q = i / 12 * TAU; c.beginPath(); c.moveTo(Math.cos(q) * r * .2, Math.sin(q) * r * .2); c.lineTo(Math.cos(q) * r * .84, Math.sin(q) * r * .84); c.stroke(); }
  ellipse(c, 0, 0, r * .24, r * .24, '#FFF5D6');
  c.restore();
}

// ---------- the yagna fire ----------
// The altar (a stepped brick kund) at (x, y) w wide, and its fire, k = 0..1+ how high it burns.
function yagna(c, x, y, w, t, k = 1) {
  glow(c, x, y - w * .5 * k, w * 2.6 * Math.max(.4, k), '#FF7A26', .55);
  for (let i = 0; i < 3; i++) { const ww = w * (1 - i * .14), h = w * .1; fillPath(c, `M ${x - ww / 2} ${y - i * h} L ${x + ww / 2} ${y - i * h} L ${x + ww / 2 - h * .3} ${y - (i + 1) * h} L ${x - ww / 2 + h * .3} ${y - (i + 1) * h} Z`, ['#3A1A12', '#4E2216', '#5E2A1A'][i]); fillPath(c, `M ${x - ww / 2 + h * .3} ${y - (i + 1) * h} L ${x + ww / 2 - h * .3} ${y - (i + 1) * h} L ${x + ww / 2 - h * .3} ${y - (i + 1) * h + 4} L ${x - ww / 2 + h * .3} ${y - (i + 1) * h + 4} Z`, '#E07A3A'); }
  const base = y - w * .3, N = 13;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (const [layer, col, sc] of [[0, '#C8321A', 1], [1, '#FF7A22', .78], [2, '#FFC04A', .55], [3, '#FFF3C4', .3]]) {
    for (let i = 0; i < N; i++) {
      const u = (i + .5) / N - .5, bx = x + u * w * .78 * (1 - layer * .15), hh = w * k * sc * (.55 + .45 * Math.cos(u * Math.PI)) * (.75 + .25 * Math.sin(t * (7 + i) + i * 2.3 + layer));
      const lean = Math.sin(t * 3 + i) * w * .05, ww = w * .1 * (1 - layer * .15);
      c.fillStyle = rgba(col, .75); c.beginPath(); c.moveTo(bx - ww, base);
      c.quadraticCurveTo(bx - ww * 1.1, base - hh * .5, bx + lean, base - hh);
      c.quadraticCurveTo(bx + ww * 1.1, base - hh * .5, bx + ww, base); c.closePath(); c.fill();
    }
  }
  c.restore();
}
