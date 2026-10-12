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
//   nandiStanding(c, o) Nandi, the great white bull, standing, side view facing left; in colour (or o.col), o.eyes glow
//   pushpak(c, o)       Ravana's flying chariot, side view flying right; o.layer 'back' | 'front' to put a rider between
//   shivaFoot(c, o)     Shiva's foot, side view (toes to screen right) on a rock: o.press 0..1, the big toe pressing down
//   parvatiCling(c, o)  Parvati seated, leaning to clutch Shiva's arm (to her left): a silhouette (o.col)
//   hanumanLeap(c, o)   Hanuman in mid-leap to screen right, his tail curled up: a silhouette; returns the tail tip
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

// ---------- Nandi standing ----------
// The great white bull, side view facing screen left, about 600 long and 470 to the horn tips; feet at y 0, x -260..270.
// o: t, col (one colour: a silhouette), eyes (0..1 a gold glow in the eye: his anger), light (1 from the right).
const NANDI = { white: '#E9E4DA', sh: '#B7AEA2', dk: '#857B70', muzzle: '#CDBDB4', nose: '#5A4A48', hoof: '#3A302C', horn: '#D9CFBF', hornSh: '#9E9282',
  cloth: '#9E1E2A', clothSh: '#6A1420', gold: '#D9A441', marigold: '#F0A030', marigoldSh: '#C8701E' };
function nandiStanding(c, o = {}) {
  const t = o.t || 0, N = NANDI, one = o.col, C = (k) => one || N[k], br = Math.sin(t * 1.5) * 1.5, nod = Math.sin(t * 1.1) * .02;
  // the far legs, in shade
  for (const [x, w] of [[-120, 52], [196, 62]]) { limb(c, [[x, -190], [x + 6, -90], [x + 2, -16]], [w, w * .7, w * .55], C('dk')); ellipse(c, x + 2, -10, w * .32, 12, C('hoof')); }
  // the tail
  limb(c, [[250, -310], [268, -240], [266 + Math.sin(t * 1.3) * 6, -160], [260 + Math.sin(t * 1.3) * 10, -110]], [16, 11, 8, 6], C('sh'), false);
  ellipse(c, 260 + Math.sin(t * 1.3) * 10, -96, 12, 22, C('dk'));
  // body and hump
  const BODY = `M -214 -250 C -224 -312 -172 ${-352 + br} -110 ${-354 + br} C -20 ${-352 + br} 80 ${-342 + br} 160 -338 C 222 -336 254 -300 254 -250 C 254 -200 234 -170 204 -166 C 120 -158 -40 -150 -150 -160 C -192 -166 -210 -200 -214 -250 Z`;
  fillPath(c, BODY, C('white'));
  fillPath(c, `M -178 -330 C -170 ${-430 + br} -86 ${-432 + br} -60 -342 Z`, C('white'));
  if (!one) inside(c, BODY, () => { fillPath(c, 'M -240 -210 C -100 -196 100 -206 270 -224 L 270 -140 L -240 -140 Z', rgba(N.sh, .85)); ellipse(c, 170, -290, 80, 50, rgba(N.sh, .35)); });
  // the cloth over his back: red with a gold border and tassels
  const CL = `M -96 ${-350 + br} C 0 ${-352 + br} 90 -344 150 -338 L 142 -236 C 60 -240 -40 -242 -108 -236 Z`;
  fillPath(c, CL, C('cloth'));
  if (!one) { inside(c, CL, () => { fillPath(c, 'M -140 -256 L 180 -256 L 180 -226 L -140 -226 Z', N.gold); fillPath(c, 'M 40 -360 L 200 -360 L 200 -220 L 40 -220 Z', rgba(N.clothSh, .6)); for (let i = 0; i < 5; i++) ellipse(c, -60 + i * 46, -300, 9, 9, N.gold); }); for (let i = 0; i < 9; i++) limb(c, [[-104 + i * 30, -238], [-104 + i * 30, -222]], [6, 3], N.gold, false); }
  // the near legs
  for (const [x, w, k] of [[-150, 56, 0], [164, 68, 1]]) {
    limb(c, [[x, -200], [x - 4 + k * 10, -120], [x - 2, -18]], [w * 1.2, w * .66, w * .52], C('white'));
    if (!one) limb(c, [[x + w * .3, -190], [x + w * .2 + k * 8, -120], [x + 10, -24]], [w * .4, w * .25, w * .2], rgba(N.sh, .8));
    ellipse(c, x - 2, -10, w * .34, 12, C('hoof'));
  }
  // neck, dewlap, head (muzzle down and forward), horns, ear, eye
  c.save(); c.translate(-200, -300); c.rotate(nod);
  fillPath(c, 'M 30 -60 C -10 -80 -60 -86 -90 -76 L -110 10 C -70 30 -10 40 40 46 Z', C('white'));
  fillPath(c, 'M -10 30 C -30 80 -60 96 -84 70 C -84 40 -80 10 -70 -10 Z', C('white'));
  if (!one) fillPath(c, 'M -10 30 C -30 80 -60 96 -84 70 C -70 74 -50 64 -40 30 Z', rgba(N.sh, .8));
  const HEAD = 'M -60 -90 C -92 -102 -128 -94 -146 -66 C -160 -42 -168 -2 -160 22 C -150 40 -126 42 -112 30 C -96 6 -74 -26 -48 -44 Z';
  limb(c, [[-104, -94], [-96, -140], [-70, -168], [-52, -172]], [20, 15, 9, 3], C('horn'));
  if (!one) limb(c, [[-100, -100], [-90, -140], [-68, -164]], [7, 5, 2], rgba(N.hornSh, .9));
  fillPath(c, HEAD, C('white'));
  if (!one) inside(c, HEAD, () => { fillPath(c, 'M -170 -10 C -150 -10 -120 0 -100 30 L -170 60 Z', rgba(N.muzzle, .9)); ellipse(c, -100, -60, 40, 18, rgba(N.sh, .5), -.6); });
  ellipse(c, -152, 18, 7, 5, C('nose'), .4);
  limb(c, [[-58, -86], [-46, -132], [-30, -150]], [16, 11, 3], C('horn'));
  ellipse(c, -50, -66, 30, 11, C('white'), .5); if (!one) ellipse(c, -50, -66, 20, 5, rgba(N.muzzle, .9), .5);
  if (!one) {
    ellipse(c, -110, -60, 8, 6, '#1A1210', -.2); ellipse(c, -108, -62, 2.2, 2, '#FFF4E0');
    strokePath(c, 'M -122 -66 Q -110 -72 -98 -64', rgba(N.dk, .9), 2.4);
  }
  if (o.eyes) { glow(c, -110, -60, 70 * o.eyes, '#FFC54A', .9 * o.eyes); ellipse(c, -110, -60, 8, 6, mixCol('#1A1210', '#FFE27A', o.eyes), -.2); }
  // the bell on a red band, and a marigold garland
  strokePath(c, 'M 10 -40 C -10 10 -40 30 -70 34', C('cloth'), 12);
  fillPath(c, 'M -54 38 C -66 38 -72 52 -72 66 L -36 66 C -36 52 -42 38 -54 38 Z', C('gold'));
  for (let i = 0; i < 11; i++) { const u = i / 10, x = lerp(26, -96, u), y = -54 + Math.sin(u * Math.PI) * 70; ellipse(c, x, y, 11, 11, C(i % 2 ? 'marigold' : 'marigoldSh')); }
  c.restore();
}

// ---------- the Pushpak vimana ----------
// Kubera's flying chariot, taken by Ravana: a gilded boat with a swan prow, a pillared pavilion and a temple tower,
// wings, pennants, light underneath. Side view flying right; the deck at y 0, x -320..360. o: t, layer ('back' draws
// the wing, tower, pillars and canopy; 'front' the hull, rail and prow; omit for both), col (silhouette), glow (0..1).
const PUSHPAK = { gold: '#D9A441', goldSh: '#93692A', goldLt: '#F6D58A', wood: '#7A3A22', woodSh: '#4E2414', roof: '#A8342A', roofSh: '#6E1E1A', cloth: '#C8452B', white: '#F2EBDC', wing: '#E9DFC8', wingSh: '#B5A684' };
function pushpak(c, o = {}) {
  const t = o.t || 0, P = PUSHPAK, one = o.col, C = (k) => one || P[k], back = o.layer !== 'front', front = o.layer !== 'back';
  if (back) {
    // the wing, beating slowly
    const fl = Math.sin(t * 2.2) * .18;
    c.save(); c.translate(-40, -10); c.rotate(-.15 + fl);
    fillPath(c, 'M 0 0 C -60 -120 -200 -230 -380 -260 C -330 -220 -320 -190 -340 -170 C -290 -170 -270 -140 -290 -110 C -230 -120 -200 -90 -220 -60 C -150 -70 -90 -40 -60 0 Z', C('wing'));
    if (!one) for (let i = 0; i < 4; i++) strokePath(c, `M ${-40 - i * 20} ${-10 - i * 8} C ${-120 - i * 40} ${-80 - i * 30} ${-220 - i * 30} ${-150 - i * 25} ${-330 + i * 10} ${-170 - i * 20}`, rgba(P.wingSh, .9), 3);
    c.restore();
    // the temple tower at the back, then the pillars and the canopy
    fillPath(c, 'M -250 -20 L -250 -230 L -90 -230 L -90 -20 Z', C('wood'));
    for (let i = 0; i < 4; i++) { const w = 90 - i * 18, y = -230 - i * 48; fillPath(c, `M ${-170 - w} ${y} L ${-170 + w} ${y} L ${-170 + w * .82} ${y - 50} L ${-170 - w * .82} ${y - 50} Z`, C(i % 2 ? 'roofSh' : 'roof')); fillPath(c, `M ${-170 - w - 6} ${y} L ${-170 + w + 6} ${y} L ${-170 + w + 6} ${y - 8} L ${-170 - w - 6} ${y - 8} Z`, C('gold')); }
    ellipse(c, -170, -440, 26, 22, C('gold')); fillPath(c, 'M -176 -458 L -164 -458 L -170 -500 Z', C('gold'));
    limb(c, [[-170, -500], [-170, -560]], [5, 4], C('goldSh'), false);
    const wv = (k) => Math.sin(t * 6 - k * 3) * 10 * k;
    limb(c, [[-170, -556], [-210, -548 + wv(.3)], [-250, -544 + wv(.6)], [-300, -530 + wv(1)]], [24, 22, 16, 4], C('cloth'), false);
    for (const x of [-60, 30, 120, 210]) { fillPath(c, `M ${x - 9} -10 L ${x + 9} -10 L ${x + 9} -210 L ${x - 9} -210 Z`, C('gold')); if (!one) fillPath(c, `M ${x + 2} -10 L ${x + 9} -10 L ${x + 9} -210 L ${x + 2} -210 Z`, P.goldSh); }
    fillPath(c, 'M -90 -200 C 0 -250 150 -250 250 -200 L 250 -224 C 150 -280 0 -280 -90 -224 Z', C('roof'));
    fillPath(c, 'M -100 -196 L 260 -196 L 260 -212 L -100 -212 Z', C('gold'));
    for (let i = 0; i < 9; i++) { const x = -80 + i * 40; strokePath(c, `M ${x} -196 L ${x} -176`, C('goldSh'), 2); ellipse(c, x, -172, 5, 6, C('gold')); }
  }
  if (front) {
    if (!one && (o.glow ?? 1) > 0) { glow(c, 0, 70, 420, '#FFC86A', .5 * (o.glow ?? 1)); glow(c, 0, 50, 160, '#FFF0C0', .5 * (o.glow ?? 1)); }
    const HULL = 'M -320 -40 C -260 40 -150 74 0 76 C 150 74 270 44 330 -30 L 316 -42 C 210 -10 100 -2 0 -2 C -100 -2 -210 -8 -320 -40 Z';
    fillPath(c, HULL, C('gold'));
    if (!one) inside(c, HULL, () => { fillPath(c, 'M -400 30 C -200 90 200 90 400 20 L 400 120 L -400 120 Z', P.goldSh); for (let i = 0; i < 13; i++) { const x = -270 + i * 45; ellipse(c, x, 26 + Math.sin(i / 12 * Math.PI) * 12, 10, 10, i % 2 ? P.cloth : P.goldLt); } strokePath(c, 'M -320 -26 C -200 4 200 4 330 -18', P.goldLt, 3); });
    // the rail
    strokePath(c, 'M -300 -66 C -200 -40 160 -40 300 -62', C('gold'), 6);
    for (let i = 0; i < 14; i++) { const x = -290 + i * 44; strokePath(c, `M ${x} -4 L ${x} ${-60 + Math.abs(x) * .02}`, C('goldSh'), 4); }
    // the swan prow
    limb(c, [[300, -30], [356, -90], [360, -150], [338, -186]], [44, 34, 26, 22], C('white'));
    ellipse(c, 330, -196, 26, 20, C('white'));
    fillPath(c, 'M 306 -196 L 270 -188 L 308 -184 Z', C('gold'));
    if (!one) { ellipse(c, 326, -200, 3.5, 3.5, '#1A1210'); limb(c, [[356, -110], [368, -150]], [6, 3], rgba(P.wingSh, .8), false); }
    // a tail of feathers at the stern
    for (let i = 0; i < 4; i++) limb(c, [[-316, -40], [-360 - i * 6, -90 - i * 22 + Math.sin(t * 3 + i) * 4], [-372 - i * 10, -150 - i * 30]], [26, 18, 4], C(i % 2 ? 'wing' : 'cloth'), false);
  }
}

// ---------- Shiva's foot, close ----------
// Side view, the toes to screen right, on a snowy rock; the shin rises from the ankle (-200) to the tiger skin (-560).
// About 360 long. o: t, press (0..1: the big toe bears down and the light rings out from it), light (glow at the toe).
function shivaFoot(c, o = {}) {
  const S = SHV, p = o.press || 0, dy = p * 6;
  c.save(); c.translate(0, dy);
  const SHIN = 'M -62 -640 C -58 -480 -54 -320 -50 -170 L 50 -170 C 52 -320 60 -480 66 -640 Z';
  fillPath(c, SHIN, S.skin); inside(c, SHIN, () => fillPath(c, 'M -90 -660 L -22 -660 C -18 -480 -18 -320 -20 -150 L -90 -150 Z', rgba(S.skinSh, .9)));
  const FOOT = 'M -50 -190 L 50 -190 C 54 -150 72 -116 112 -94 C 140 -80 164 -70 186 -64 C 210 -56 232 -44 240 -28 C 246 -14 240 0 226 4 L -50 4 C -86 4 -98 -20 -94 -56 C -90 -100 -68 -150 -50 -190 Z';
  fillPath(c, FOOT, S.skin);
  inside(c, FOOT, () => { fillPath(c, 'M -110 -40 C -40 -20 120 -18 290 -18 L 290 20 L -110 20 Z', rgba(S.skinSh, .85)); strokePath(c, 'M 50 -130 C 80 -100 120 -80 170 -68', rgba(S.palm, .5), 5); ellipse(c, -62, -80, 26, 40, rgba(S.skinSh, .5)); ellipse(c, 34, -150, 12, 10, rgba(S.skinDk, .4)); });
  // the toes, the little one furthest back; each lobe edged dark so they read apart; the big toe bends down as he presses
  for (const [x, y, rx, ry] of [[196, -60, 10, 9], [206, -55, 12, 10], [218, -48, 14, 11], [230, -40, 16, 12]]) {
    ellipse(c, x, y, rx + 2, ry + 2, rgba(S.skinDk, .8)); ellipse(c, x, y, rx, ry, mixCol(S.skin, S.skinSh, .25));
  }
  c.save(); c.translate(226, -28); c.rotate(p * .2);
  ellipse(c, 34, 6, 34, 23, S.skinDk); ellipse(c, 34, 6, 31.5, 20.5, S.skin);
  fillPath(c, 'M 4 14 C 20 28 50 30 64 18 L 66 30 L 4 30 Z', rgba(S.skinSh, .9));
  ellipse(c, 50, -2, 13, 8, '#B9CDEC', -.2);
  c.restore();
  // anklet with little bells
  ellipse(c, 0, -176, 58, 13, S.gold); ellipse(c, 0, -182, 54, 5, S.goldSh);
  for (let i = 0; i < 7; i++) ellipse(c, -44 + i * 15, -161 + Math.abs(i - 3) * 1.5, 6, 7, S.gold);
  // the tiger-skin hem at the top
  fillPath(c, 'M -110 -700 L 120 -700 L 110 -600 L 70 -620 L 30 -590 L -10 -620 L -50 -592 L -90 -616 L -116 -600 Z', S.tiger);
  for (const [x, y] of [[-60, -660], [0, -670], [60, -655]]) fillPath(c, `M ${x - 22} ${y} C ${x - 8} ${y - 8} ${x + 8} ${y - 8} ${x + 22} ${y + 3} C ${x + 8} ${y - 2} ${x - 8} ${y - 1} ${x - 22} ${y} Z`, S.stripe);
  c.restore();
  if (p > 0) { glow(c, 280, 4, 160 * p, '#BFD8FF', .8 * p); glow(c, 280, 4, 50 * p, '#FFFFFF', .7 * p); }
}

// ---------- Parvati clinging to Shiva (a silhouette, to sit at Shiva's left: screen right of shivaSeated) ----------
function parvatiCling(c, o = {}) {
  const col = o.col || '#0E1220', t = o.t || 0, sh = Math.sin(t * 9) * (o.shake || 0) * 3;
  fillPath(c, 'M -110 0 C -110 -54 -50 -80 20 -80 C 90 -80 130 -48 130 0 Z', col);
  c.save(); c.translate(10 + sh, -66); c.rotate(-.32);
  fillPath(c, 'M -52 0 C -58 -80 -66 -150 -74 -196 C -48 -212 46 -212 74 -196 C 66 -150 58 -80 52 0 Z', col);
  fillPath(c, 'M -14 -200 L -14 -226 L 14 -226 L 14 -200 Z', col);
  ellipse(c, 0, -258, 28, 34, col);
  fillPath(c, 'M -22 -282 L -18 -312 L -8 -298 L 0 -322 L 8 -298 L 18 -312 L 22 -282 Z', col);   // a small crown
  limb(c, [[16, -270], [40, -220], [56, -150], [70, -80]], [30, 34, 26, 12], col, false);   // her hair down her back
  limb(c, [[60, -190], [96 + Math.sin(t * 2) * 6, -120], [120 + Math.sin(t * 2.4) * 10, -60]], [40, 30, 8], col, false);   // the pallu
  limb(c, [[-62, -186], [-150, -200], [-214, -236]], [28, 22, 18], col); ellipse(c, -222, -240, 15, 12, col);
  limb(c, [[-54, -170], [-130, -130], [-200, -160]], [26, 20, 16], col); ellipse(c, -208, -164, 14, 11, col);
  c.restore();
}

// ---------- Hanuman leaping (a silhouette) ----------
// Mid-leap to screen right, arms forward, legs trailing, the tail curled high. About 520 long; the body's centre at
// (0, -250). Returns the tail tip [x, y] (local units) so a scene can set it on fire.
function hanumanLeap(c, o = {}) {
  const col = o.col || '#0C0608', t = o.t || 0, w = Math.sin(t * 6) * 6;
  const tail = [[-70, -220], [-170, -300 + w], [-170, -430], [-100, -500 + w], [-20, -480], [6, -430]];
  limb(c, tail, [24, 20, 17, 14, 12, 10], col);
  limb(c, [[-50, -210], [-140, -180], [-230, -214 + w]], [58, 42, 30], col); ellipse(c, -246, -216 + w, 26, 12, col, -.3);
  limb(c, [[-40, -196], [-120, -130], [-210, -120]], [54, 38, 28], col); ellipse(c, -226, -116, 26, 12, col);
  limb(c, [[-60, -214], [20, -252], [110, -262]], [100, 106, 86], col);
  limb(c, [[100, -270], [196, -290], [282, -270]], [42, 32, 26], col); ellipse(c, 296, -268, 22, 18, col);
  limb(c, [[96, -246], [180, -226], [262, -206]], [40, 30, 24], col); ellipse(c, 276, -204, 20, 16, col);
  ellipse(c, 160, -312, 44, 48, col); ellipse(c, 196, -296, 26, 22, col);
  fillPath(c, 'M 130 -346 L 134 -392 L 150 -372 L 162 -408 L 174 -372 L 190 -392 L 192 -346 Z', col);
  ellipse(c, 128, -312, 12, 16, col);
  return tail[tail.length - 1];
}
