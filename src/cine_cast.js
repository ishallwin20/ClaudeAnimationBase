// cine_cast.js: the rest of the cast for the cinematic engine, mostly figures that read as rim-lit silhouettes.
// Same units as cine_shiva.js: feet at (0, 0), up is -y, an adult stands about 820–1000 tall.
//   sati(c, o)          Sati from behind: red sari with a gold border, the pallu over her shoulder, hair down her back
//   daksha(c, o)        King Daksha on his throne, pointing (o.point), shaking with laughter (o.laugh)
//   crowd(c, ...)       a row of seated guests (heads and shoulders), bobbing when they laugh; rise (0..1) stands them up
//   rudra(c, o)         Shiva's Rudra Tandava: stamping, Sati's body across his shoulders, locks flying
//   shivaSeated(c, o)   Shiva in padmasana with the trishul planted beside him
//   nandiLying(c, o)    Nandi lying in the temple pose (legs folded, head up), facing left; o.stone: the black temple Nandi
//   chakra(c, ...)      the Sudarshan chakra: a spinning, flaming disc of light
//   yagna(c, ...)       the fire altar and its fire
//   nandiStanding(c, o) Nandi, the great white bull (an Ongole zebu), standing, facing left; o.col, o.stone, o.eyes glow, o.ear perks
//   pushpak(c, o)       Ravana's flying chariot, side view flying right; o.layer 'back' | 'front' to put a rider between
//   shivaFoot(c, o)     Shiva's foot, side view (toes to screen right) on a rock: o.press 0..1, the big toe pressing down
//   parvatiCling(c, o)  Parvati seated, leaning to clutch Shiva's arm (to her left): a silhouette (o.col)
//   hanumanLeap(c, o)   Hanuman in mid-leap to screen right, his tail curled up: a silhouette; returns the tail tip
//   ramSil(c, o)        Ram standing, facing screen left, the tall kirita and the Kodanda bow: a silhouette (o.bless: the right hand raised)
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
// rise (0..1) stands them up, one by one in a ripple (a court rising when someone walks in).
function crowd(c, x0, x1, y, n, k, t, laugh, col, seed = 1, rise = 0) {
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + .5) / n) + (hash(i + seed) - .5) * 20 * k, b = laugh * Math.abs(Math.sin(t * (10 + hash(i * 3 + seed) * 6) + i)) * 5 * k, s = k * (.9 + hash(i * 7 + seed) * .2);
    const up = rise ? easeOut(clamp(rise * 1.7 - hash(i * 5 + seed) * .7)) * 120 : 0;
    c.save(); c.translate(x, y - b); c.scale(s, s);
    if (up) { fillPath(c, `M -56 4 L -50 ${-up} L 50 ${-up} L 56 4 Z`, col); c.translate(0, -up); }
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

// ---------- Nandi ----------
// The great white bull, an Ongole zebu, side view facing screen left. What makes him read as a bull and not a goat (a
// viewer called ad 15's first Nandi a goat): the big hump over the shoulders, the long folded dewlap, a broad blocky
// head with a black muzzle and a big kohl-rimmed eye, short thick horns curving up and forward, a heavy front end.
//   nandiStanding: feet at y 0, x about -330..300, the hump top at -494.
//   nandiLying: the temple pose (legs folded under, head up), resting on y 0, x about -330..300, horn tips near -330.
// o: t, col (one colour: a silhouette), stone (the temple Nandi: oiled black basalt with a sheen and a fresh marigold
// garland), eyes (0..1 a gold glow in the eye: his anger), ear (0..1 the near ear lifts: listening), look (the
// head raised, radians; lying defaults to .2), bare (no cloth, band or garland).
const NANDI = { white: '#ECE7DD', sh: '#BBB2A6', dk: '#8A8076', hump: '#A39B91', muzzle: '#3C3536', nose: '#1C1617', inEar: '#C9A7A0',
  eye: '#1A1210', iris: '#3A2418', lid: '#6E645C', hoof: '#2E2826', horn: '#D8CDBB', hornSh: '#9E9282', switch: '#2A2422', sheen: '#FFFFFF',
  cloth: '#9E1E2A', clothSh: '#6A1420', gold: '#D9A441', goldSh: '#9A6E22', marigold: '#F0A030', marigoldSh: '#C8701E', tilak: '#C8202A', sandal: '#E8C98A' };
const NANDI_STONE = { ...NANDI, white: '#3F3B38', sh: '#272422', dk: '#1E1C1A', hump: '#2E2A28', muzzle: '#1E1B1A', nose: '#0E0C0B', inEar: '#6A615A',
  eye: '#0E0C0B', iris: '#0E0C0B', lid: '#55504A', hoof: '#1E1B1A', horn: '#4A4540', hornSh: '#2A2725', switch: '#1E1B1A', sheen: '#A8A198',
  cloth: '#48413C', clothSh: '#2F2A27', gold: '#615A52', goldSh: '#3A3531' };
const ndPal = (o) => { const P = o.stone ? NANDI_STONE : NANDI, one = o.col; return [P, (k) => one || P[k], one]; };
const ndHoof = (c, x, w, col, sh) => { fillPath(c, `M ${x - w} 0 L ${x - w * .78} -26 L ${x + w * .78} -26 L ${x + w} 0 Z`, col); if (sh) strokePath(c, `M ${x - w * .1} -2 L ${x - w * .05} -20`, sh, 2.4); };

// The head, in its own frame: the origin is where the neck meets the back of the skull; the muzzle hangs down-left.
function ndHead(c, o, P, C, one) {
  const t = o.t || 0, HEAD = 'M -50 -72 C -66 -46 -84 -8 -98 24 C -110 48 -122 62 -126 80 C -130 98 -122 114 -102 116 C -84 118 -62 112 -44 104 C -22 94 -2 76 8 56 C 16 30 16 0 10 -18 C 2 -46 -22 -70 -50 -72 Z';
  // the far horn, then the near ear (behind the near horn), the head, the near horn
  limb(c, [[-58, -66], [-58, -102], [-70, -134], [-90, -146]], [28, 22, 13, 5], C('hornSh'));
  if (!o.bare) limb(c, [[-72, -134], [-90, -146]], [14, 6], C('goldSh'));
  const lift = (o.ear || 0) * .45 + Math.sin(t * .9) * .03 * (1 - (o.ear || 0));
  c.save(); c.translate(-14, -48); c.rotate(-lift);
  const EAR = 'M -2 -8 C 20 -22 50 -16 66 2 C 48 12 20 12 0 8 Z';
  fillPath(c, EAR, C('white')); if (o.stone && !one) strokePath(c, 'M 4 -10 C 24 -22 48 -16 62 0', rgba(P.sheen, .5), 3); if (!one) { fillPath(c, 'M 6 -2 C 24 -12 46 -8 58 2 C 44 8 22 7 6 4 Z', rgba(P.inEar, .8)); fillPath(c, 'M -2 -8 C 20 -22 50 -16 66 2 C 46 -6 22 -8 -2 -8 Z', rgba(P.sh, .6)); }
  c.restore();
  fillPath(c, HEAD, C('white'));
  if (!one) inside(c, HEAD, () => {
    fillPath(c, 'M -70 120 C -30 104 -4 76 12 40 L 30 40 L 30 130 Z', rgba(P.sh, .9));   // the jaw, in shade
    strokePath(c, 'M -46 -2 C -58 30 -78 58 -102 72', rgba(P.sh, .55), 10);   // the ridge down the face
    fillPath(c, 'M -134 46 C -112 48 -94 66 -86 90 C -82 104 -86 116 -94 122 L -140 122 Z', P.muzzle);   // the black muzzle
    ellipse(c, -120, 72, 9, 5.5, P.nose, -1);
    strokePath(c, 'M -128 102 Q -112 108 -92 106', rgba(P.nose, .8), 3);
    if (o.stone) { strokePath(c, 'M -46 -70 C -62 -44 -78 -10 -92 20', rgba(P.sheen, .35), 7); ellipse(c, 2, 20, 10, 26, rgba(P.sheen, .12)); }
  });
  // the eye: kohl-rimmed, a heavy lid, calm
  ellipse(c, -60, -20, 19, 12, C('eye'), -.35);
  if (!one) {
    ellipse(c, -61, -20, 13, 8.5, P.iris, -.35); ellipse(c, -66, -23, 3, 2.4, '#FFF4E0');
    fillPath(c, 'M -82 -24 C -72 -38 -50 -38 -40 -20 C -52 -30 -70 -30 -82 -24 Z', P.lid);
    strokePath(c, 'M -42 -16 L -30 -10', C('eye'), 3);
  }
  if (o.eyes) { glow(c, -61, -20, 80 * o.eyes, '#FFC54A', .9 * o.eyes); ellipse(c, -61, -20, 12, 8, mixCol('#1A1210', '#FFE27A', o.eyes), -.35); }
  // the near horn: short and thick, curving up and forward, a gold cap
  limb(c, [[-36, -62], [-30, -100], [-38, -134], [-58, -150]], [34, 27, 16, 6], C('horn'));
  if (!one) limb(c, [[-28, -66], [-22, -100], [-30, -130]], [9, 7, 3], rgba(P.hornSh, .9));
  if (!o.bare) { limb(c, [[-40, -132], [-58, -150]], [17, 7], C('gold')); limb(c, [[-31, -112], [-35, -122]], [24, 22], C('gold'), false); }
  // the forehead: a kumkum dot (not on stone: there it reads as a second eye)
  if (!o.stone && !o.bare && !one) ellipse(c, -56, -54, 4.5, 4.5, P.tilak);
}

// The body with the neck and hump (no legs), its saddle cloth, and the dewlap; br breathes the topline.
const ndBody = (br) => `M -232 -330 C -232 -370 -224 -396 -206 -404 C -192 -412 -182 -424 -176 -440 C -166 -468 -140 ${-482 + br} -108 ${-478 + br} C -74 ${-472 + br} -48 -446 -20 -400 C 40 ${-382 + br} 120 ${-376 + br} 190 -372 C 232 -372 262 -358 274 -328 C 286 -292 282 -250 270 -214 C 262 -196 250 -184 232 -178 C 160 -186 60 -192 -40 -188 C -100 -186 -150 -176 -180 -190 C -204 -204 -212 -250 -214 -290 Z`;
const ND_DEW = 'M -236 -246 C -262 -212 -262 -184 -244 -172 C -226 -160 -206 -164 -192 -172 C -180 -166 -166 -168 -158 -180 L -172 -250 L -196 -270 Z';
function ndTorso(c, o, P, C, one, br, legs) {
  const BODY = ndBody(br);
  fillPath(c, BODY, C('white'));
  if (!one) inside(c, BODY, () => {
    fillPath(c, 'M -260 -400 C -200 -500 -60 -500 -10 -392 C -80 -360 -170 -330 -260 -300 Z', rgba(P.hump, o.stone ? .4 : .38));   // the grey hump and neck of an Ongole
    fillPath(c, 'M -240 -232 C -100 -214 100 -222 300 -246 L 300 -140 L -240 -140 Z', rgba(P.sh, .85));   // the belly
    strokePath(c, 'M 176 -364 C 146 -304 156 -246 200 -204', rgba(P.sh, .9), 5);   // the thigh
    strokePath(c, 'M -138 -388 C -110 -330 -124 -274 -160 -236', rgba(P.sh, .7), 5);   // the shoulder blade
    if (o.stone) { strokePath(c, `M -164 -446 C -146 ${-470 + br} -110 ${-476 + br} -76 -464`, rgba(P.sheen, .45), 8); strokePath(c, 'M -20 -386 C 60 -372 140 -368 200 -364', rgba(P.sheen, .3), 6); ellipse(c, 230, -310, 30, 46, rgba(P.sheen, .14)); }
  });
  legs && legs();
  // the saddle cloth: red with a gold border, gold studs and tassels (in stone, carved)
  if (!o.bare) {
    const CL = `M -30 ${-392 + br} C 40 ${-380 + br} 120 ${-374 + br} 188 -372 L 182 -264 C 100 -258 20 -260 -42 -270 Z`;
    fillPath(c, CL, C('cloth'));
    if (!one) inside(c, CL, () => { fillPath(c, 'M -60 -294 L 200 -292 L 200 -262 L -60 -262 Z', P.gold); fillPath(c, 'M 90 -400 L 210 -400 L 210 -250 L 90 -250 Z', rgba(P.clothSh, .6)); for (let i = 0; i < 5; i++) ellipse(c, -6 + i * 40, -334, 8, 8, P.gold); });
    for (let i = 0; i < 8; i++) limb(c, [[-30 + i * 29, -266], [-30 + i * 29, -248]], [6, 3], C('gold'), false);
  }
}
function ndDewlap(c, o, P, C, one) {
  fillPath(c, ND_DEW, C('white'));
  if (!one) inside(c, ND_DEW, () => { fillPath(c, 'M -270 -200 C -240 -176 -200 -172 -150 -190 L -150 -150 L -270 -150 Z', rgba(P.sh, .8));
    strokePath(c, 'M -246 -222 C -236 -204 -220 -194 -202 -192', rgba(P.sh, .9), 3); strokePath(c, 'M -232 -246 C -222 -230 -206 -220 -188 -216', rgba(P.sh, .9), 3); });
}
// the red band with a bell, and a marigold garland, over the neck (the garland stays fresh on a stone Nandi)
function ndNeckDress(c, o, P, C, one) {
  if (o.bare) return;
  if (!o.stone) { strokePath(c, 'M -186 -414 C -170 -350 -200 -290 -236 -262', C('cloth'), 12);
    fillPath(c, 'M -240 -262 C -254 -262 -260 -246 -260 -230 L -222 -230 C -222 -246 -228 -262 -240 -262 Z', C('gold')); if (!one) fillPath(c, 'M -246 -230 L -234 -230 L -240 -222 Z', P.goldSh); }
  for (let i = 0; i < 15; i++) { const u = i / 14, x = (1 - u) ** 2 * -196 + 2 * u * (1 - u) * -132 + u * u * -238, y = (1 - u) ** 2 * -408 + 2 * u * (1 - u) * -286 + u * u * -262;
    ellipse(c, x, y, 11, 11, one || (i % 2 ? NANDI.marigold : NANDI.marigoldSh)); }
}

// ---------- Nandi standing ----------
function nandiStanding(c, o = {}) {
  const t = o.t || 0, [P, C, one] = ndPal(o), br = Math.sin(t * 1.5) * 1.5, nod = Math.sin(t * 1.1) * .02 - (o.look || 0), sw = Math.sin(t * 1.3) * 8;
  // the far legs, in shade
  limb(c, [[-112, -220], [-112, -140], [-108, -90], [-110, -34], [-112, -14]], [56, 42, 30, 26, 24], C('dk')); ndHoof(c, -113, 17, C('hoof'));
  limb(c, [[158, -270], [164, -190], [194, -112], [188, -36], [186, -14]], [84, 52, 30, 26, 24], C('dk')); ndHoof(c, 186, 17, C('hoof'));
  // the tail, down the back of the thighs to a black switch
  limb(c, [[266, -346], [290, -300], [296, -220], [294 + sw * .5, -150], [292 + sw, -96]], [18, 13, 10, 8, 7], C('sh'), false);
  ellipse(c, 292 + sw, -76, 13, 30, C('switch'));
  ndTorso(c, o, P, C, one, br, () => {});
  ndDewlap(c, o, P, C, one);
  // the near legs: a thick foreleg with a knee, a heavy thigh and a hock
  for (const [Pts, Wd, x] of [[[[-162, -280], [-158, -190], [-152, -110], [-150, -36], [-152, -14]], [86, 60, 38, 32, 30], -152],
                              [[[214, -326], [218, -212], [246, -118], [238, -38], [234, -14]], [132, 74, 36, 32, 30], 234]]) {
    limb(c, Pts, Wd, C('white'));
    if (!one) limb(c, Pts.slice(1).map(([px, py], i) => [px + Wd[i + 1] * .28, py]), Wd.slice(1).map((w) => w * .34), rgba(P.sh, .85));
    ndHoof(c, x, 19, C('hoof'), one ? 0 : rgba(P.sh, .5));
  }
  if (!one) ellipse(c, -153, -110, 21, 16, rgba(P.sh, .35));
  ndNeckDress(c, o, P, C, one);
  c.save(); c.translate(-200, -330); c.rotate(nod); ndHead(c, o, P, C, one); c.restore();
}

// ---------- Nandi lying: the temple pose ----------
function nandiLying(c, o = {}) {
  const t = o.t || 0, [P, C, one] = ndPal(o), br = Math.sin(t * 1.5) * 1.2, D = 180, look = (o.look ?? .2) + Math.sin(t * 1.1) * .015;
  c.save(); c.translate(0, D);
  // the tail, laid along the ground and curling forward
  limb(c, [[266, -346], [290, -290], [292, -220], [270, -186], [220, -184]], [18, 13, 10, 8, 7], C('sh'), false);
  ellipse(c, 206, -186, 28, 10, C('switch'));
  // the far foreleg, folded, its hoof just showing in front
  limb(c, [[-120, -230], [-176, -204], [-236, -196], [-190, -184]], [56, 40, 30, 26], C('dk')); ellipse(c, -186, -186, 18, 10, C('hoof'));
  ndTorso(c, o, P, C, one, br);
  ndDewlap(c, o, P, C, one);
  c.restore();
  // the near hind leg folded: the haunch, the hock behind, the hoof tucked forward beside the belly
  const HAUNCH = 'M 120 -150 C 150 -196 240 -200 270 -150 C 290 -110 284 -40 262 -12 C 230 4 160 2 120 -10 C 96 -40 98 -110 120 -150 Z';
  fillPath(c, HAUNCH, C('white')); if (!one) { inside(c, HAUNCH, () => fillPath(c, 'M 80 -60 C 160 -50 240 -50 300 -70 L 300 20 L 80 20 Z', rgba(P.sh, .85))); strokePath(c, 'M 124 -146 C 102 -100 100 -50 120 -14', rgba(P.dk, .7), 4); }
  limb(c, [[252, -26], [180, -14], [92, -14]], [36, 30, 26], C('white')); if (!one) limb(c, [[252, -18], [180, -6], [92, -6]], [14, 12, 10], rgba(P.sh, .9));
  ellipse(c, 80, -14, 18, 13, C('hoof'));
  // the near foreleg folded under: the elbow, the knee forward, the cannon back along the ground
  limb(c, [[-150, -96], [-196, -50], [-226, -22]], [72, 50, 38], C('white'));
  limb(c, [[-226, -22], [-176, -14], [-116, -14]], [38, 30, 26], C('white'));
  if (!one) { limb(c, [[-226, -12], [-176, -6], [-116, -6]], [14, 12, 10], rgba(P.sh, .9)); ellipse(c, -224, -24, 22, 18, rgba(P.sh, .3)); strokePath(c, 'M -200 -60 C -196 -40 -180 -30 -150 -30', rgba(P.dk, .6), 4); }
  ellipse(c, -106, -14, 18, 13, C('hoof'));
  c.save(); c.translate(0, D); ndNeckDress(c, o, P, C, one); c.translate(-200, -330); c.rotate(look); ndHead(c, o, P, C, one); c.restore();
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

// ---------- Ram (a silhouette) ----------
// Standing in profile, facing screen left, about 1030 tall to the kirita's tip: a heroic V torso, hair falling to the
// shoulders, a tall kirita with a finial, a dhoti to the knees with a pleat hanging in front, the uttariya flowing
// back, the Kodanda bow upright in his near hand, a quiver on his back. o: t, col, bless (0..1 the other hand rises
// in blessing), wind.
function ramSil(c, o = {}) {
  const col = o.col || '#0C0810', t = o.t || 0, bl = o.bless || 0, wd = (o.wind ?? .4) * Math.sin(t * 1.7);
  c.save(); c.translate(40, -690); c.rotate(.42);   // the quiver on his back
  fillPath(c, 'M -18 0 L 18 0 L 15 250 L -15 250 Z', col); for (let i = -1; i <= 1; i++) fillPath(c, `M ${i * 10 - 4} 4 L ${i * 10} -50 L ${i * 10 + 4} 4 Z`, col);
  c.restore();
  limb(c, [[44, -700], [100 + wd * 10, -620], [130 + wd * 24, -500], [150 + wd * 34, -390]], [34, 30, 22, 5], col, false);   // the uttariya
  // legs in stride, the feet pointing left
  limb(c, [[16, -480], [26, -260], [34, -44]], [84, 66, 46], col); fillPath(c, 'M 50 -50 C 54 -20 56 -6 52 0 L -30 0 C -34 -12 -14 -22 10 -30 L 14 -50 Z', col);
  limb(c, [[-14, -480], [-44, -262], [-66, -44]], [84, 66, 46], col); fillPath(c, 'M -50 -50 C -46 -20 -44 -6 -48 0 L -134 0 C -138 -12 -116 -22 -90 -30 L -86 -50 Z', col);
  // the dhoti, flaring to the knees, a pleat hanging in front
  fillPath(c, 'M -58 -506 C -82 -430 -104 -340 -118 -244 C -60 -232 20 -232 78 -244 C 72 -330 64 -420 56 -506 Z', col);
  fillPath(c, 'M -44 -490 L -92 -150 L -58 -158 L -18 -470 Z', col);
  // the torso: the chest forward, a narrow waist
  fillPath(c, 'M -52 -500 C -70 -560 -100 -620 -96 -664 C -90 -698 -50 -722 0 -726 C 52 -724 92 -706 96 -662 C 100 -610 76 -550 56 -500 Z', col);
  for (const x of [-30, 34]) ellipse(c, x, -690, 46, 40, col);   // the shoulders
  // the bow arm and the Kodanda, upright, almost his height
  limb(c, [[-24, -686], [-86, -588], [-128, -486]], [50, 40, 32], col); ellipse(c, -136, -470, 22, 24, col);
  strokePath(c, 'M -136 -930 C -230 -760 -230 -190 -136 -30', col, 14); strokePath(c, 'M -136 -930 L -136 -30', col, 2.5);
  for (const y of [-930, -30]) ellipse(c, -136, y, 9, 9, col);
  // the other arm: down by his side, or raised in blessing, the palm out
  const E = [lerp(30, -40, bl), lerp(-580, -610, bl)], H = [lerp(36, -70, bl), lerp(-460, -720, bl)];
  limb(c, [[22, -688], E, H], [50, 40, 32], col); ellipse(c, H[0] - (bl > .5 ? 4 : 0), H[1] - (bl > .5 ? 20 : -14), bl > .5 ? 22 : 20, bl > .5 ? 30 : 24, col);
  // the neck, the head in profile, the hair down to the shoulders
  limb(c, [[-2, -712], [-12, -764]], [46, 40], col);
  limb(c, [[16, -846], [44, -790], [54, -716]], [64, 56, 32], col, false);
  ellipse(c, -10, -816, 48, 56, col);
  fillPath(c, 'M -50 -834 C -56 -826 -60 -816 -54 -808 L -44 -802 Z', col);   // the nose
  fillPath(c, 'M -50 -790 C -50 -776 -42 -764 -28 -760 L -22 -790 Z', col);   // the chin
  ellipse(c, -2, -778, 8, 11, col);   // an earring
  // the kirita: tall, tapering, a finial
  fillPath(c, 'M -54 -852 L -44 -910 L -34 -960 C -26 -972 12 -974 20 -960 L 30 -910 L 42 -852 Z', col);
  for (const s of [-1, 1]) fillPath(c, `M ${-6 + s * 40} -880 L ${-6 + s * 62} -920 L ${-6 + s * 34} -906 Z`, col);
  ellipse(c, -7, -982, 14, 16, col); fillPath(c, 'M -13 -992 L -7 -1030 L -1 -992 Z', col);
}

// ---------- the Nandi story: Sage Shilada, the boy Nandi, sages, a devotee, Nandanar (silhouettes, facing left) ----------
// All are drawn in one colour (o.col, near-black by default) with a recognisable outline, to be lit by figure() with an
// edge and rim. Adults stand about 900 tall, feet at (0, 0); the boy about 540.

// A rishi: a long beard, a topknot, a dhoti and shawl, a staff. o: t, col, pose ('stand' with the staff | 'sit' in
// meditation, hands joined | 'plough', leaning on a plough's handle, striding | 'point' the right arm out), staff.
function rishi(c, o = {}) {
  const col = o.col || '#120C10', t = o.t || 0, pose = o.pose || 'stand', br = Math.sin(t * 1.4) * 1.5;
  const head = (x, y, lean = 0) => {
    c.save(); c.translate(x, y); c.rotate(lean);
    ellipse(c, 0, 0, 36, 44, col);
    fillPath(c, 'M -34 -6 L -48 8 L -34 14 Z', col);   // the nose
    fillPath(c, 'M -36 10 C -60 50 -76 120 -70 190 C -54 160 -30 110 -10 80 C 0 60 10 40 14 30 Z', col);   // the beard, long and forward
    ellipse(c, 6, -54, 22, 18, col); ellipse(c, 10, -70, 14, 12, col);   // the topknot
    c.restore();
  };
  if (pose === 'sit') {
    fillPath(c, 'M -130 0 C -130 -56 -70 -86 0 -86 C 70 -86 120 -56 120 0 Z', col);   // crossed legs
    fillPath(c, `M -44 -70 C -50 -170 -56 -260 -46 ${-330 + br} L 50 ${-330 + br} C 60 -260 56 -170 48 -70 Z`, col);
    fillPath(c, `M -50 ${-330 + br} C -40 -350 40 -350 50 ${-330 + br} Z`, col);
    limb(c, [[-30, -310], [-56, -230], [-84, -270]], [34, 28, 22], col);   // forearm up to the joined hands
    fillPath(c, 'M -96 -262 C -100 -290 -92 -316 -84 -330 C -76 -316 -72 -290 -76 -262 Z', col);
    fillPath(c, 'M -12 -350 L -10 -376 L 18 -376 L 16 -350 Z', col);
    head(0, -416);
    return;
  }
  const lean = pose === 'plough' ? -.32 : 0, stride = pose === 'plough' ? 1 : 0;
  // legs and dhoti
  if (stride) { limb(c, [[-10, -440], [-60, -230], [-110, -20]], [74, 56, 40], col); limb(c, [[20, -440], [60, -230], [110, -20]], [74, 56, 40], col); ellipse(c, -124, -10, 30, 12, col); ellipse(c, 100, -10, 30, 12, col); }
  else { fillPath(c, 'M -50 -470 C -60 -320 -78 -160 -86 -30 L 84 -30 C 76 -160 64 -320 56 -470 Z', col); ellipse(c, -30, -12, 34, 14, col); ellipse(c, 34, -12, 30, 14, col); }
  c.save(); c.translate(0, -440); c.rotate(lean);
  fillPath(c, `M -56 ${-266 + br} C -64 -190 -56 -90 -46 0 L 54 0 C 64 -90 70 -190 62 ${-266 + br} C 34 ${-292 + br} -26 ${-292 + br} -56 ${-266 + br} Z`, col);
  fillPath(c, `M -50 ${-266 + br} C -20 -200 30 -120 60 -40 L 70 -90 C 50 -160 30 -220 30 ${-280 + br} Z`, col);   // the shawl
  fillPath(c, 'M -14 -282 L -16 -306 L 14 -306 L 12 -282 Z', col);
  head(-4, -350);
  // arms
  if (pose === 'plough') { limb(c, [[-30, -250], [-90, -170], [-160, -140]], [36, 30, 24], col); limb(c, [[20, -250], [-50, -170], [-130, -130]], [34, 28, 22], col); }
  else if (pose === 'point') { limb(c, [[-30, -250], [-130, -240], [-230, -250]], [36, 30, 24], col); limb(c, [[-232, -250], [-266, -254]], [16, 8], col); limb(c, [[30, -250], [44, -150], [40, -60]], [34, 28, 22], col); }
  else { limb(c, [[-30, -250], [-60, -160], [-86, -100]], [36, 30, 24], col); limb(c, [[30, -250], [44, -150], [40, -60]], [34, 28, 22], col); }
  c.restore();
  if (pose === 'stand' && o.staff !== false) { fillPath(c, 'M -100 6 L -100 -980 L -88 -980 L -88 6 Z', col); ellipse(c, -94, -986, 14, 14, col); }
}
// The plough of Shilada's yagna field: a wooden plough, the share in the soil at (0, 0), the handle up and back.
function plough(c, o = {}) {
  const col = o.col || '#120C10';
  limb(c, [[0, 0], [70, -40], [190, -150], [210, -220]], [30, 24, 18, 14], col);   // the stilt to the handle
  limb(c, [[60, -40], [-160, -90], [-360, -96]], [22, 18, 16], col);              // the beam
  fillPath(c, 'M -30 6 L 40 -10 L 30 -40 L -10 -30 Z', col);                       // the share
}
// The boy Nandi: o.pose 'baby' (a newborn curled in the furrow), 'sit' (cross-legged, hands joined: praying), 'stand'
// (hands joined, looking up); o.col; o.t. A small tuft (shikha) on the head.
function boy(c, o = {}) {
  const col = o.col || '#120C10', t = o.t || 0, pose = o.pose || 'stand', br = Math.sin(t * 1.8) * 1.2;
  if (pose === 'baby') {
    ellipse(c, 10, -46, 86, 48, col);                     // the body, curled
    ellipse(c, -86, -64, 46, 44, col);                    // the head
    limb(c, [[-30, -40], [-60, -10], [-30, 6]], [26, 22, 18], col);   // an arm tucked
    limb(c, [[80, -30], [60, 0], [20, 6]], [34, 28, 22], col);        // the legs drawn up
    ellipse(c, -96, -112, 8, 10, col);
    return;
  }
  const head = (x, y) => { ellipse(c, x, y, 40, 46, col); fillPath(c, `M ${x - 38} ${y - 4} L ${x - 50} ${y + 8} L ${x - 38} ${y + 14} Z`, col); limb(c, [[x + 4, y - 42], [x + 16, y - 62], [x + 30, y - 66]], [12, 9, 4], col, false); };
  if (pose === 'sit') {
    fillPath(c, 'M -90 0 C -90 -40 -50 -62 0 -62 C 50 -62 84 -40 84 0 Z', col);
    fillPath(c, `M -32 -50 C -36 -120 -40 -180 -32 ${-226 + br} L 36 ${-226 + br} C 42 -180 40 -120 34 -50 Z`, col);
    limb(c, [[-20, -210], [-44, -150], [-64, -184]], [26, 22, 18], col);
    fillPath(c, 'M -74 -176 C -78 -200 -72 -222 -64 -234 C -58 -222 -54 -200 -58 -176 Z', col);
    fillPath(c, 'M -10 -240 L -8 -258 L 12 -258 L 10 -240 Z', col);
    head(0, -298);
    return;
  }
  limb(c, [[-12, -250], [-18, -130], [-22, -16]], [36, 30, 24], col); limb(c, [[14, -250], [20, -130], [24, -16]], [36, 30, 24], col);
  ellipse(c, -32, -10, 24, 11, col); ellipse(c, 14, -10, 22, 11, col);
  fillPath(c, 'M -40 -300 C -46 -270 -48 -240 -46 -214 L 48 -214 C 50 -240 46 -270 40 -300 Z', col);   // the dhoti
  fillPath(c, `M -36 -300 C -40 -360 -40 -400 -34 ${-430 + br} L 38 ${-430 + br} C 42 -400 42 -360 38 -300 Z`, col);
  limb(c, [[-20, -420], [-50, -360], [-66, -400]], [26, 22, 18], col);
  fillPath(c, 'M -76 -392 C -80 -416 -74 -438 -66 -450 C -60 -438 -56 -416 -60 -392 Z', col);
  fillPath(c, 'M -10 -440 L -8 -456 L 12 -456 L 10 -440 Z', col);
  head(0, -496);
}
// A woman at the temple, her sari's pallu over her head. o.pose: 'whisper' (leaning in, a hand cupped at her mouth),
// 'pray' (hands joined); o.lean (radians forward, default .1 for whisper); o.col; o.t.
function devotee(c, o = {}) {
  const col = o.col || '#120C10', t = o.t || 0, pose = o.pose || 'whisper', br = Math.sin(t * 1.5) * 1.2, lean = o.lean ?? (pose === 'whisper' ? .1 : 0);
  fillPath(c, 'M -46 -470 C -60 -320 -76 -150 -86 0 L 90 0 C 82 -150 66 -320 52 -470 Z', col);   // the sari's skirt
  ellipse(c, -40, -8, 30, 12, col);
  c.save(); c.translate(0, -470); c.rotate(-lean);
  fillPath(c, `M -46 0 C -52 -60 -62 -130 -56 ${-190 + br} C -50 -220 -40 -236 -30 ${-250 + br} L 40 ${-250 + br} C 50 -200 54 -100 52 0 Z`, col);   // the torso
  fillPath(c, 'M -12 -246 L -14 -276 L 14 -276 L 12 -246 Z', col);
  // the head, a profile: brow, nose, lips, chin
  c.save(); c.translate(-2, -316); c.rotate(-lean * .8);
  fillPath(c, 'M 30 -40 C 22 -52 -6 -54 -24 -44 C -34 -36 -36 -22 -36 -12 L -44 6 L -36 10 C -38 16 -34 18 -36 24 C -32 30 -36 34 -30 40 C -20 50 0 50 14 44 C 30 34 38 10 36 -10 C 36 -24 34 -34 30 -40 Z', col);
  // the pallu: over the head and down her back
  fillPath(c, 'M -30 -40 C -20 -66 30 -70 46 -40 C 60 -10 64 60 66 140 L 30 160 C 34 80 34 20 26 -10 C 20 -30 0 -40 -30 -40 Z', col);
  c.restore();
  limb(c, [[50, -220], [80, -100], [74, 40]], [40, 50, 60], col, false);   // the pallu's fall
  if (pose === 'whisper') { limb(c, [[-20, -236], [-48, -170], [-58, -300]], [30, 26, 20], col); fillPath(c, 'M -66 -326 C -82 -312 -84 -290 -70 -280 C -64 -296 -60 -312 -50 -322 Z', col); }
  else { limb(c, [[-20, -236], [-50, -170], [-74, -206]], [30, 26, 20], col); fillPath(c, 'M -84 -196 C -88 -222 -82 -244 -74 -256 C -68 -244 -64 -222 -68 -196 Z', col); }
  limb(c, [[26, -236], [34, -150], [24, -70]], [28, 24, 20], col);
  c.restore();
}
// Nandanar, a devotee kept outside the temple: a lean man in a dhoti, his joined hands raised over his head (o.raise
// 0..1), a cloth over his shoulder; o.col; o.t.
function nandanar(c, o = {}) {
  const col = o.col || '#120C10', t = o.t || 0, r = o.raise ?? 1, br = Math.sin(t * 1.4) * 1.2;
  fillPath(c, 'M -40 -460 C -46 -320 -56 -170 -60 -30 L 56 -30 C 54 -170 46 -320 40 -460 Z', col);
  ellipse(c, -30, -12, 30, 13, col); ellipse(c, 30, -12, 28, 13, col);
  fillPath(c, `M -40 -460 C -44 -540 -46 -620 -40 ${-700 + br} L 42 ${-700 + br} C 46 -620 44 -540 40 -460 Z`, col);
  fillPath(c, `M -42 ${-696 + br} C -10 -620 20 -540 44 -480 L 44 -520 C 20 -580 0 -640 -20 ${-700 + br} Z`, col);
  fillPath(c, 'M -12 -700 L -14 -726 L 14 -726 L 12 -700 Z', col);
  ellipse(c, -4, -770, 36, 44, col); fillPath(c, 'M -38 -772 L -50 -760 L -38 -752 Z', col); ellipse(c, 8, -808, 20, 14, col);
  const hy = lerp(-640, -900, r), hx = lerp(-80, -30, r);
  limb(c, [[-24, -690], [lerp(-70, -60, r), lerp(-600, -800, r)], [hx, hy]], [30, 26, 20], col);
  limb(c, [[24, -690], [lerp(-10, 10, r), lerp(-600, -800, r)], [hx + 8, hy]], [30, 26, 20], col);
  fillPath(c, `M ${hx - 8} ${hy + 10} C ${hx - 12} ${hy - 16} ${hx - 6} ${hy - 38} ${hx + 2} ${hy - 50} C ${hx + 10} ${hy - 38} ${hx + 14} ${hy - 16} ${hx + 10} ${hy + 10} Z`, col);
}
