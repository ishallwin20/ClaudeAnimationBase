// cine_yama.js: Yama, the god of death, and the Markandeya story, for the Cinematic style (src/cine.js).
// Yama is drawn on Surya's rig (cine_surya.js: he is Surya's son) with his own colours, as the texts paint him (dark yet
// shining, red-eyed, in red garments, crowned, the noose in his hand): a deep slate skin, a crimson dhoti, the gold
// kirita, a thick curling moustache, fierce brows, red eyes that can burn, the noose (pasha) coiled in his left fist and
// a gold mace (gada) in his right. Load after cine_surya.js.
//   YAMA_C                    his colours over SUR's
//   yamaC(c, o)               standing, front view, both fists raised: surya()'s units (feet at 0, face at (0, -815));
//                             o as surya (t, eyes, look, light, pain, mouth, …) and fierce (default 1), noose (false:
//                             the hand empty; 0..1 the coil paying out), gada (false), crown (false: bareheaded, for a
//                             fall)
//   yamaHeadC(c, o)           the head alone at (0, -815), for close-ups (translate, scale(k), translate(0, 815))
//   yamaEyeGlow(c, a, o)      the burning red eyes, in head units: call after the figure() with the same transform
//   yamaCrownC(c, x, y, k, r) the kirita alone (fallen, tumbling), centred at (x, y)
//   yamaRope(c, pts, k, o)    the noose in flight along world points, grown to k (0..1); a loop at its end (o.r, o.w)
//   buffaloSide(c, o)         his water buffalo, side view facing right, feet at y 0, ~760 long, the withers at -405;
//                             o.t, o.col (one colour), o.walk (the gait phase, in cycles), o.eye (0..1 a red glow),
//                             o.bell (true)
//   yamaRider(c, o)           Yama riding it: buffaloSide() with him astride (his front view from the belt up, the near
//                             leg down the flank); o as both (o.gadaA tilts the mace)
// The Markandeya story:
//   MARK_PAL                  the boy's colours over SUR's: warm brown skin, a saffron dhoti, ash and rudraksha
//   markHead(c, o)            his head at (0, -815): no crown, the hair in a knot, the tripundra; o as suryaHead
//   markHug(c, o)             kneeling, clinging to a Shiva linga with both arms, his cheek pressed to it; the linga's
//                             foot at (0, 0), its top at -540 (linga() at k 2); o.t, o.eyes (default 0), o.pain,
//                             o.smile, o.col (a silhouette), o.stone, o.lit, o.glow (0..1 the linga's light), o.linga
//                             (false: the boy alone)
//   shivaKick(c, o)           Shiva striking with his foot, side view facing right, a silhouette (o.col): the standing
//                             leg at (0, 0), the kick reaching x ~430 at chest height (o.k 0..1 how far it has
//                             thrust), the trishul raised behind, the jata flying; o.t
const YAMA_C = {
  skin: '#45606A', skinSh: '#2E4550', skinDk: '#1A2A33', palm: '#5C7C84', lip: '#262C34', lipLo: '#36404A',
  hair: '#0A090E', hairLt: '#24222E', eyeW: '#EED6CC', iris: '#A8121A', brow: '#08070A', tilak: '#E8402A',
  gold: '#D9A441', goldSh: '#8A5E1C', goldLt: '#F6D58A', ruby: '#C8102A', emerald: '#1E7A5A',
  dhoti: '#A8201C', dhotiSh: '#68100E', dhotiLt: '#D04A3A', rope: '#B88A3E', ropeDk: '#5E401A', ropeLt: '#E8C878',
};
const MARK_PAL = {
  skin: '#B47A52', skinSh: '#8C5636', skinDk: '#5A3220', palm: '#D49A70', lip: '#7A3A2A', lipLo: '#96503A',
  hair: '#140C0C', hairLt: '#30201C', eyeW: '#F2E8D8', iris: '#2A1810', brow: '#140C0A', tilak: '#C81E2A',
  gold: '#D9A441', goldSh: '#93692A', goldLt: '#F6D58A', dhoti: '#D8701E', dhotiSh: '#A04A14', dhotiLt: '#F09A48',
  ash: '#EFE8DA', bead: '#5E2F1B',
};
// draw with SUR recoloured for the length of the call
function withSur(pal, draw) { const keep = { ...SUR }; Object.assign(SUR, pal); try { return draw(); } finally { for (const k in SUR) if (!(k in keep)) delete SUR[k]; Object.assign(SUR, keep); } }

// ---------- Yama ----------
// the moustache, thick, its ends curling up past the cheeks (head units, after suryaHead)
function yamaStache(c, P) {
  for (const s of [-1, 1]) fillPath(c, `M ${s * 1} -779 C ${s * 10} -785 ${s * 22} -785 ${s * 31} -777 C ${s * 38} -770 ${s * 41} -760 ${s * 37} -752 C ${s * 35} -747 ${s * 30} -748 ${s * 31} -753 C ${s * 33} -760 ${s * 29} -768 ${s * 21} -771 C ${s * 13} -773 ${s * 6} -772 ${s * 1} -772 Z`, P.hair);
  strokePath(c, 'M -18 -781 C -8 -783 8 -783 18 -781', rgba(P.hairLt, .7), 1.4);
}
function yamaHeadC(c, o = {}) {
  const P = { ...YAMA_C, ...(o.pal || {}) };
  withSur(P, () => { suryaHead(c, { fierce: 1, ...o, kundala: o.kundala ?? 'sun' }); yamaStache(c, P); });
}
function yamaEyeGlow(c, a = 1, o = {}) {
  if (a <= 0) return;
  for (const s of [-1, 1]) { glow(c, s * 19, -820, 34 * (o.r || 1), '#FF2A10', .9 * a); glow(c, s * 19, -820, 10 * (o.r || 1), '#FFD0A0', .8 * a); }
}
function yamaCrownC(c, x, y, k = 1, r = 0, o = {}) {
  withSur({ ...YAMA_C, ...(o.pal || {}) }, () => { c.save(); c.translate(x, y); c.rotate(r); c.scale(k, k); c.translate(0, 950); suryaCrown(c, o.t || 0, 1); c.restore(); });
}
// the mace, in the right fist (hx, hy), its head above the shoulder
function gadaC(c, hx, hy, a, P) {
  c.save(); c.translate(hx, hy); c.rotate(a);
  fillPath(c, 'M -8 120 L 8 120 L 9 -250 L -9 -250 Z', P.goldSh);
  strokePath(c, 'M 3 110 L 3 -240', rgba(P.goldLt, .6), 3);
  for (const y of [-252, -232]) ellipse(c, 0, y, 20, 8, P.gold);
  const HEAD = 'M 0 -380 C 40 -372 62 -340 62 -306 C 62 -272 40 -250 0 -246 C -40 -250 -62 -272 -62 -306 C -62 -340 -40 -372 0 -380 Z';
  fillPath(c, HEAD, P.gold);
  inside(c, HEAD, () => {
    fillPath(c, 'M -70 -390 L -20 -390 C -34 -350 -34 -280 -20 -240 L -70 -240 Z', rgba(P.goldSh, .75));
    for (let i = -2; i <= 2; i++) strokePath(c, `M ${i * 22} -378 C ${i * 30} -330 ${i * 30} -290 ${i * 22} -248`, rgba(P.goldSh, .8), 3);
    strokePath(c, 'M 20 -366 C 36 -340 40 -300 30 -270', rgba(P.goldLt, .85), 5);
  });
  fillPath(c, 'M 0 -436 C 8 -414 12 -396 0 -380 C -12 -396 -8 -414 0 -436 Z', P.gold);
  ellipse(c, 0, -312, 13, 13, P.ruby);
  c.restore();
}
// the noose coiled below the left fist (hx, hy); k < 1 pays it out (fewer loops)
function yamaCoil(c, hx, hy, k, P) {
  const n = k > .66 ? 3 : k > .33 ? 2 : k > 0 ? 1 : 0;
  for (let i = 0; i < n; i++) {
    const cx = hx + (i - 1) * 10, cy = hy + 70 + i * 12, rx = 40 + i * 7, ry = 62 + i * 9;
    c.save(); c.translate(cx, cy); c.rotate((i - 1) * .12);
    for (const [w, col] of [[11, P.ropeDk], [6.5, P.rope]]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.stroke(); }
    c.strokeStyle = rgba(P.ropeLt, .7); c.lineWidth = 2; c.setLineDash([7, 9]); c.beginPath(); c.ellipse(0, 0, rx, ry, 0, -2.6, -.4); c.stroke(); c.setLineDash([]);
    c.restore();
  }
  if (n) { strokePath(c, `M ${hx + 6} ${hy + 10} C ${hx + 26} ${hy + 90} ${hx + 10} ${hy + 170} ${hx + 22} ${hy + 220}`, P.ropeDk, 11); strokePath(c, `M ${hx + 6} ${hy + 10} C ${hx + 26} ${hy + 90} ${hx + 10} ${hy + 170} ${hx + 22} ${hy + 220}`, P.rope, 6.5); }
}
function yamaC(c, o = {}) {
  const P = { ...YAMA_C, ...(o.pal || {}) };
  if (o.gada !== false) gadaC(c, 220, -664, o.gadaA ?? .08, P);
  withSur(P, () => {
    surya(c, { fierce: 1, kundala: 'sun', ...o, lotus: false });
    yamaStache(c, P);
    const nk = o.noose ?? 1;
    if (nk !== false && nk > 0) yamaCoil(c, -214, -650, nk === true ? 1 : nk, P);
  });
}
// the rope in flight: along world points, grown to k, a loop opening at its end
function yamaRope(c, pts, k = 1, o = {}) {
  if (k <= 0 || pts.length < 2) return;
  const P = { ...YAMA_C, ...(o.pal || {}) }, w = o.w || 9, Q = through(pts, 12), n = Math.max(2, Math.round(Q.length * clamp(k))), path = new Path2D();
  Q.slice(0, n).forEach(([x, y], i) => i ? path.lineTo(x, y) : path.moveTo(x, y));
  strokePath(c, path, P.ropeDk, w * 1.7); strokePath(c, path, P.rope, w);
  if (o.loop !== false && k > .85) {
    const [ex, ey] = Q[n - 1], r = (o.r || 90) * ease(seg(k, .85, 1)), sq = o.sq ?? .55;
    c.save(); c.translate(ex, ey);
    for (const [ww, col] of [[w * 1.7, P.ropeDk], [w, P.rope]]) { c.strokeStyle = col; c.lineWidth = ww; c.beginPath(); c.ellipse(0, r * sq * .2, r, r * sq, o.rot || 0, 0, TAU); c.stroke(); }
    c.restore();
  }
}

// ---------- his buffalo, side view facing right ----------
const BUF = { body: '#24222A', sh: '#16151B', lt: '#3E3A48', horn: '#BDB2A0', hornSh: '#7E7464', muzzle: '#121116', hoof: '#0C0B0F' };
// What makes a buffalo read (not a bull, not a pig): the great flat horns swept back over the neck in crescents, their
// tips rising above the back line; the head carried low and long; a heavy barrel with a deep sagging belly; thick
// legs with knees and hocks.
function buffaloSide(c, o = {}) {
  const one = o.col, C = k => one || BUF[k], t = o.t || 0, wk = o.walk ?? 0, bob = Math.sin(wk * TAU * 2) * 6;
  const leg = (x, ph, far, hind) => {
    const a = Math.sin((wk + ph) * TAU), sw = a * 30, lift = Math.max(0, Math.cos((wk + ph) * TAU)) * 20;
    const col = far ? (one || BUF.sh) : C('body');
    if (hind) limb(c, [[x, -270 + bob], [x - 26 + sw * .3, -150], [x + 8 + sw * .8, -70 - lift * .6], [x + 4 + sw, -22 - lift]], [130, 74, 44, 38], col);
    else limb(c, [[x, -250 + bob], [x + 6 + sw * .4, -130 - lift * .4], [x + sw, -22 - lift]], [104, 52, 40], col);
    fillPath(c, `M ${x + sw - 26} ${-lift} L ${x + sw - 22} ${-30 - lift} L ${x + sw + 22} ${-30 - lift} L ${x + sw + 30} ${-lift} Z`, one || BUF.hoof);
  };
  leg(-210, .5, true, true); leg(206, 0, true, false);
  // the tail, hanging from the rump to a tuft
  limb(c, [[-332, -360 + bob], [-356, -290], [-360, -210 + Math.sin(t * 2) * 6], [-352, -160]], [18, 12, 9, 8], C('body'));
  fillPath(c, `M -352 -184 C -370 -160 -364 -120 -346 -110 C -332 -128 -334 -160 -344 -184 Z`, C('body'));
  c.save(); c.translate(0, bob);
  // the far horn, a little higher and behind
  const HORN = 'M 394 -316 C 370 -390 300 -446 226 -460 C 194 -466 168 -488 162 -526 C 146 -494 154 -452 196 -430 C 262 -404 332 -352 366 -270 Z';
  c.save(); c.translate(-34, -22); fillPath(c, HORN, one || BUF.hornSh); c.restore();
  // the barrel: a hump at the withers, a straight back to the rump, a deep belly
  const BODY = 'M 300 -330 C 272 -400 214 -440 140 -438 C 40 -436 -100 -410 -240 -400 C -310 -394 -344 -350 -346 -290 C -348 -236 -320 -192 -280 -176 C -200 -150 -60 -128 80 -136 C 190 -142 264 -170 296 -220 Z';
  fillPath(c, BODY, C('body'));
  if (!one) inside(c, BODY, () => { fillPath(c, 'M -360 -236 C -100 -196 120 -196 330 -240 L 330 -120 L -360 -120 Z', rgba(BUF.sh, .9)); strokePath(c, 'M 250 -420 C 140 -444 -60 -420 -240 -404', rgba(BUF.lt, .8), 5); });
  // the neck, low and thick, into a long head carried low
  limb(c, [[220, -350], [318, -300], [388, -250]], [190, 150, 104], C('body'));
  const HEAD = 'M 356 -318 C 398 -324 436 -290 456 -230 C 470 -190 470 -150 446 -136 C 418 -124 384 -150 360 -200 C 344 -232 338 -296 356 -318 Z';
  fillPath(c, HEAD, C('body'));
  fillPath(c, 'M 436 -180 C 458 -182 474 -164 468 -142 C 460 -128 436 -128 426 -142 C 420 -158 424 -176 436 -180 Z', one || BUF.muzzle);
  ellipse(c, 458, -150, 5, 4, one ? one : '#050407');
  // the ear, sticking out sideways under the horn
  fillPath(c, 'M 372 -286 C 350 -282 318 -268 300 -252 C 322 -246 352 -256 374 -272 Z', C('body'));
  // the near horn
  fillPath(c, HORN, one || BUF.horn);
  if (!one) { strokePath(c, 'M 386 -312 C 360 -380 296 -432 226 -448', rgba(BUF.hornSh, .9), 5); for (let i = 0; i < 5; i++) strokePath(c, `M ${356 - i * 34} ${-362 - i * 16} l -10 20`, rgba(BUF.hornSh, .7), 2.5); }
  ellipse(c, 404, -262, 7, 5, one ? '#000' : '#0A0608');
  if (o.eye) { glow(c, 404, -262, 28, '#FF2A10', .85 * o.eye); ellipse(c, 404, -262, 5, 4, rgba('#FF6A40', o.eye)); }
  if (o.bell !== false) {
    const sway = Math.sin(t * 3 + wk * TAU) * .14;
    strokePath(c, 'M 262 -360 C 286 -270 320 -232 346 -226', one || '#8A1E22', 9);
    c.save(); c.translate(306, -244); c.rotate(sway);
    fillPath(c, 'M -16 0 L 16 0 L 22 44 L -22 44 Z', one || '#B88A3E'); ellipse(c, 0, 48, 6, 6, one || '#5E401A');
    c.restore();
  }
  c.restore();
  leg(-250, 0, false, true); leg(166, .5, false, false);
}
function yamaRider(c, o = {}) {
  buffaloSide(c, o);
  const bob = Math.sin((o.walk ?? 0) * TAU * 2) * 6, sit = [30, -426 + bob];
  // Yama from the belt up, astride (his front view: the old images show him frontal on his mount)
  c.save(); c.beginPath(); c.rect(-2000, -3000, 4000, 3000 + sit[1] + 8); c.clip();
  c.translate(sit[0], sit[1]); c.scale(.6, .6); c.translate(0, 480);
  if (o.col) { const one = o.col, P = {}; for (const k in YAMA_C) P[k] = one; yamaC(c, { ...o, pal: { ...P, ...(o.pal || {}) } }); } else yamaC(c, o);
  c.restore();
  // the near leg, down the flank
  limb(c, [[sit[0] + 30, sit[1] - 4], [sit[0] + 70, sit[1] + 90], [sit[0] + 54, sit[1] + 190]], [70, 52, 36], o.col || YAMA_C.dhoti);
  fillPath(c, `M ${sit[0] + 34} ${sit[1] + 186} L ${sit[0] + 90} ${sit[1] + 200} L ${sit[0] + 40} ${sit[1] + 212} Z`, o.col || YAMA_C.skin);
}

// ---------- Markandeya ----------
function markHead(c, o = {}) {
  withSur({ ...MARK_PAL, ...(o.pal || {}) }, () => suryaHead(c, { crown: false, bun: true, kundala: 'ring', tilak: 'tripundra', ...o }));
}
function markHug(c, o = {}) {
  const t = o.t || 0, one = o.col, P = { ...MARK_PAL, ...(o.pal || {}) }, C = k => one || P[k], br = Math.sin(t * 1.6) * 2;
  if (o.linga !== false) linga(c, 0, 0, 2, { col: one || o.stone || '#2A2228', lit: o.lit || '#FFB060', glow: o.glow || 0 });
  // the far arm, reaching round behind the linga (behind his body)
  limb(c, [[-246, -372 + br], [-268, -270], [-150, -236]], [58, 46, 40], C('skinSh'));
  // kneeling: the dhoti from the waist to the ground, its pleats
  const DH = 'M -222 -226 C -246 -150 -272 -60 -286 0 L -40 0 C -52 -70 -68 -150 -82 -226 Z';
  fillPath(c, DH, C('dhoti'));
  if (!one) inside(c, DH, () => { fillPath(c, 'M -300 -230 L -200 -230 C -214 -150 -230 -70 -238 0 L -300 0 Z', rgba(P.dhotiSh, .8)); for (let i = 0; i < 4; i++) strokePath(c, `M ${-176 + i * 22} -214 C ${-180 + i * 22} -140 ${-186 + i * 24} -70 ${-190 + i * 26} -4`, rgba(P.dhotiSh, .7), 3); strokePath(c, 'M -222 -224 C -170 -214 -130 -214 -82 -224', P.gold, 6); });
  // the bare torso, a lean boy's
  const TOR = `M -262 -${380 - br} C -268 -340 -248 -290 -222 -226 L -82 -226 C -64 -290 -40 -340 -30 -${382 - br} C -60 -${398 - br} -110 -${404 - br} -146 -${404 - br} C -182 -${404 - br} -232 -${398 - br} -262 -${380 - br} Z`;
  fillPath(c, TOR, C('skin'));
  if (!one) inside(c, TOR, () => {
    fillPath(c, 'M -280 -420 L -230 -420 C -236 -340 -222 -280 -200 -220 L -280 -220 Z', rgba(P.skinSh, .85));
    for (const s of [-1, 1]) strokePath(c, `M ${-146 + s * 70} ${-352 + br} C ${-146 + s * 40} ${-334 + br} ${-146 + s * 12} ${-334 + br} ${-146 + s * 4} ${-344 + br}`, rgba(P.skinSh, .7), 3);
    strokePath(c, `M -240 ${-390 + br} C -190 -330 -140 -270 -96 -228`, rgba('#F2EADA', .9), 3.2);   // the sacred thread
    for (let i = 0; i < 3; i++) strokePath(c, `M -250 ${-344 + i * 9} L -214 ${-346 + i * 9}`, rgba(P.ash, .8), 3);   // ash on the shoulder
  });
  // a rudraksha mala
  if (!one) for (let i = 0; i <= 12; i++) { const u = i / 12, x = lerp(-196, -96, u), y = -396 + br + Math.sin(u * Math.PI) * 54; ellipse(c, x, y, 5.5, 5.5, P.bead); }
  // the head, cheek pressed to the stone
  c.save(); c.translate(-130, -486 + br * .6); c.rotate(o.tilt ?? .22); c.translate(0, 815);
  if (one) { ellipse(c, 0, -815, 50, 72, one); fillPath(c, 'M -36 -790 L 36 -790 L 31 -700 L -31 -700 Z', one); ellipse(c, 0, -900, 44, 22, one); ellipse(c, 0, -912, 30, 24, one); }
  else markHead(c, { t, eyes: o.eyes ?? 0, pain: o.pain, smile: o.smile, mouth: o.mouth, look: o.look });
  c.restore();
  // the near arm: across the front of the linga, the hand gripping its far side
  const ARM = [[-40, -376 + br], [30, -322], [108, -336]];
  limb(c, ARM, [60, 48, 40], C('skin'));
  if (!one) { limb(c, [[-40, -360 + br], [30, -310], [104, -322]], [20, 16, 12], rgba(P.skinSh, .7)); for (let i = 0; i < 3; i++) strokePath(c, `M ${-26 + i * 10} ${-370 + i * 7} l 14 12`, rgba(P.ash, .8), 2.6); }
  fillPath(c, 'M 96 -362 C 116 -366 130 -352 128 -332 C 126 -314 112 -306 98 -310 Z', C('skin'));   // the fingers curled round the stone
  if (!one) for (let i = 0; i < 3; i++) strokePath(c, `M ${112 + i * 4} ${-356 + i * 13} l 14 2`, rgba(P.skinSh, .9), 2);
}

// ---------- Shiva's kick (a silhouette) ----------
function shivaKick(c, o = {}) {
  const col = o.col || '#0C0A10', t = o.t || 0, k = o.k ?? 1, wd = Math.sin(t * 3) * .5 + .5;
  // the jata streaming back
  for (let i = 0; i < 6; i++) limb(c, [[-56, -900 + i * 10], [-150 - i * 10, -880 + i * 20 + wd * 10], [-260 - i * 16, -830 + i * 30 + wd * 20], [-360 - i * 18, -790 + i * 40]], [26, 22, 16, 4], col);
  // the trishul, raised behind in the back hand
  c.save(); c.translate(-190, -980); c.rotate(-.22);
  fillPath(c, 'M -7 -300 L 7 -300 L 7 520 L -7 520 Z', col);
  fillPath(c, 'M 0 -470 C 14 -420 16 -360 10 -300 L -10 -300 C -16 -360 -14 -420 0 -470 Z', col);
  for (const s of [-1, 1]) fillPath(c, `M ${s * 10} -300 C ${s * 50} -310 ${s * 66} -350 ${s * 62} -420 C ${s * 50} -380 ${s * 36} -340 ${s * 6} -326 Z`, col);
  ellipse(c, 0, -290, 24, 12, col);
  c.restore();
  // the standing leg, the foot planted
  limb(c, [[-10, -500], [-30, -260], [-36, -40]], [96, 70, 50], col);
  fillPath(c, 'M -70 0 L -60 -50 L -12 -50 L 60 -10 L 64 0 Z', col);
  // the kicking leg: thrust forward at chest height, the sole flat to its target
  const kx = lerp(160, 430, k), ky = lerp(-380, -610, k);
  limb(c, [[20, -500], [lerp(110, 230, k), lerp(-420, -560, k)], [kx, ky]], [104, 78, 54], col);
  fillPath(c, `M ${kx - 20} ${ky + 26} L ${kx + 26} ${ky + 34} L ${kx + 40} ${ky - 70} L ${kx + 8} ${ky - 84} Z`, col);
  // the tiger skin at the hips, flaring
  fillPath(c, 'M -100 -620 C -130 -540 -120 -470 -90 -420 L 60 -440 C 90 -500 80 -570 60 -620 Z', col);
  // the torso leaning back, the chest out
  fillPath(c, 'M -90 -560 C -120 -660 -130 -740 -110 -800 C -70 -830 0 -830 30 -790 C 50 -730 40 -640 50 -560 Z', col);
  // the front arm out toward the struck, the palm open
  limb(c, [[0, -780], [110, -790], [210, -770]], [60, 48, 38], col);
  fillPath(c, 'M 200 -800 C 236 -808 256 -786 250 -760 C 240 -740 214 -744 204 -756 Z', col);
  // the back arm up to the trishul
  limb(c, [[-90, -790], [-170, -870], [-196, -960]], [60, 48, 40], col);
  // the head, the jata knot, the moon
  ellipse(c, -40, -880, 56, 66, col);
  fillPath(c, 'M -10 -884 L 26 -872 L -4 -856 Z', col);   // the nose
  ellipse(c, -60, -968, 50, 40, col); ellipse(c, -70, -1010, 30, 28, col);
  fillPath(c, 'M -20 -1000 C 10 -1030 40 -1020 46 -990 C 30 -1006 6 -1006 -14 -990 Z', col);   // the crescent
}
