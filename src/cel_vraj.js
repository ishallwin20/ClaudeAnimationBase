// cel_vraj.js: the Vraja cast in the Cel style (CEL_GUIDE.md), for the "Kanha vs Radha" skits (RADHA_KANHA_SERIES.md):
// chibi Kanha and Radha (about 560 px to the top of the head at s = 1, the head half of that), a little monkey, a clay
// pot of butter, and the cute effects (hearts, sparkles, a sweat drop, ink marks). Load after cel.js.
//
//   celKeys(t, keys, o)          the pose at t from [[time, pose], ...]. Each pose lists only what changes; the rest carries
//                                over from the key before. A move takes tr s (o.tr, or the pose's own tr) and lands at its
//                                time with an overshoot, held on threes like celDance. Returns the pose plus .land (s since
//                                it landed), .lag (a drawing late: hair, plait), .td (the held time), .slot
//   celKanha(c, x, y, s, P, o)   chibi Kanha, feet at (x, y): blue, curly alakas, a topknot with pearls and a peacock
//                                feather, the white Vaishnava tilak, a vaijayanti mala, a yellow pitambar with a red
//                                border, a gold kardhani, his flute tucked in it. o.pal, o.seed. Returns screen anchors
//                                { head, mouth, top, handL, handR, cheekL, cheekR }
//   celRadha(c, x, y, s, P, o)   chibi Radha: long hair with a plait and a red tassel, a centre parting with a maang tikka,
//                                mogra and a rose in her hair, jhumkas, a tiny nose ring, a yellow choli, a pink lehenga
//                                with a gold border, a mint odhni across her, red and gold bangles, payal. Same anchors.
//   celMonkey(c, x, y, s, P, o)  a little monkey (about 330 px tall), feet at (x, y): P like a kid's (eyes, mouth, look,
//                                hL / hR, handL / handR, lean, hop) plus pot (true: hugging a pot of butter) and tail
//   celMatki(c, x, y, s, o)      a clay pot, its base at (x, y): o.empty (no butter), o.water (a water pot), o.tilt
//   Govardhan (Bhagavata 10.25): celGovardhan(c, x, y, r, t) the hill lifted up (green on top, its rocky underside and
//                                roots showing), celRainCloud(c, x, y, r, o) a fat cloud (o.face 'grumpy' | 'happy' | null),
//                                celRain(c, x0, x1, y0, y1, t, o) falling rain over a box, splashing at y1
//   a little Vishnu shrine:      celShrine(c, x, y, s, t, o) a wayside mandir on two steps (a white body with a cusped
//                                doorway, a shikhara with its kalash and a saffron flag, a marigold toran, two diyas, a
//                                brass bell; o.bell its swing, o.glow the light inside, o.lateBell to draw the bell later with
//                                celShrineBell(c, bellAt.x, bellAt.y, s, swing)), the murti in it (celVishnuMurti);
//                                returns { step, bell, bellAt, murti, door }
//   celVishnuMurti(c, x, y, s, t, o) a small four-armed Vishnu on a lotus (chakra, shankh, lotus, gada; kirita, mala,
//                                a gold prabhavali), the kids' blue and face, smiling; o.glow
//   celThali(c, x, y, s, o)      a brass plate of ladoos (o.n 0..6) with tulsi on top, (x, y) the plate's middle;
//                                celLadoo(c, x, y, r) one ladoo
//   Kaliya (Bhagavata 10.16):    celKaliya(c, x, y, s, P, o) a little five-hooded naga (violet, a cream belly), coiled,
//                                his base's middle at (x, y), about 420 px to the top of his middle hood at s = 1: P like a
//                                kid's face (eyes, mouth, look, lid, brow, tilt, blush, talk) on the middle hood, side
//                                ('open' | 'happy' | 'sleep' | 'dizzy' | 'flat') the four small heads' faces, lean (the hoods
//                                sway), squash (a stomp), tongue 0..1 (a forked flick), prints 0..1 (tiny blue footprints on
//                                his hoods, 10.16.63), tail [x, y] (its tip, local px), stick (the tail curled round a stick),
//                                stickRot. Returns { stand (where a kid stands on the middle hood), head, top, tail, heads }
//   celStick(c, x, y, len, rot) Yashoda's stick (a thin bamboo cane, Bhagavata 10.9.9), gripped at (x, y), rot from upright
//   the flute (Bhagavata 10.21): P.flute 'play' on a kid (the flute at the lips, held by both hands: hL ≈ [-120, -120], hR ≈
//                                [-28, -164]; its far end points toward hL), 'none' (not tucked in at the waist), 'tuck' (default);
//                                celFlute(c, x, y, len, rot, td) a flute held at (x, y); celFluteAt(c, a, b, C, td) one from a to b;
//                                celNote(c, x, y, r, o) a music note (o.kind 1 | 2, o.col, o.rot, o.a)
//   celCalf(c, x, y, s, P, o)    a little calf (white with tan patches, a red cord and a gold bell), side-on with its head
//                                turned to us: P like a kid's face plus dir, walk / stride (a trot), hop, lean, head, hx / hy
//                                (a nuzzle), ears 0..1 (floppy .. perked up), wag, milk 0..1 (10.21.13); 'heart' eyes (kids too)
//   the birthday (#7):           celHut(c, x, y, s, t, o) a Vraja hut front with a curtained doorway (o.curtain, shake, heap,
//                                toran, light; o.part 'back' | 'front' to stand a kid in the doorway between them);
//                                celDiya(c, x, y, s, t, k); celGift(c, x, y, s, 'box' | 'ball' | 'potli', o); celPetal,
//                                celScrap (bits of flowers and cloth); celPeacockFeather(c, C); on Radha P.feather (his
//                                feather in her hair), P.wreath (a crown of flowers), P.mala (a garland like his), all 0..1,
//                                and o.pal: CEL_RADHA_PIT (dressed in his colours: pitambar yellow, his red border, his blue)
//   celParrot(c, x, y, s, P, o)  a chibi rose-ringed parakeet (#9), feet at (x, y) on a perch, facing us: P like a kid's face
//                                plus beak (open), wL / wR (wings up), flap (beating), cheek (a wing on its cheek: the swoon),
//                                fly (feet tucked, tail streaming back, dir); green feathers: celFeatherBit
//   mangoes under a tree (#10):  P.sit on a kid (sitting on the ground, hip ≈ [0, -58]: Kanha cross-legged, the pitambar over
//                                his lap, shins crossed in front; Radha's lehenga spread round her, toes peeping out); the hands
//                                reach a rock's top beside them (hL / hR ≈ [∓132, -66]); celMango(c, x, y, r, o) a ripe mango
//                                (o.rot, o.leaf); celMangoSeed(c, x, y, r, o) its licked-clean stone; celLeafPlate(c, x, y, s,
//                                th, o) a banana leaf lying flat as a plate, turned th on the spot (half a turn swaps what sits
//                                at its ends; o.blur when it whirls), returns its ends { a, b }; celRock(c, x, y, s) a flat grey
//                                boulder (returns its top); celMangoTree(c, x, y, s, t, o) a mango tree (o.crown, o.fruit, o.h)
//   fake sleep (#11):            celShesha(c, x, y, s, P, o) a little white Shesha as a bed (two coils, a fan of five hoods
//                                with jewels, Bhagavata 3.8.23; a face on the middle hood, o.part 'back' / 'front' round a kid
//                                lying on him: draw the kid rotated -90° about the hip at .lie); P.bubble 0..1 on a kid (a snot
//                                bubble, asleep; P.bubblePop 0..1 its burst); celPlate (a brass thali face on), celLadle, celConch
//   the mirror (#12):            celMirrorPlate(c, x, y, r, o) a polished brass thali held up as a mirror, face on: a brass
//                                rim round a bright metal face that shows o.reflect(c, ri) (drawn clipped inside it, in the
//                                plate's frame: its centre at 0, 0, ri the face's radius) under a warm tint, a darker edge
//                                and a sweeping shine (o.shine 0..1); o.rot, o.sq (foreshortened). P.flush 0..1 on a kid:
//                                going red, the flush rising from the chin over the whole face (Kanha's ears too)
//   celHeart(c, x, y, r, o)      a pink heart (o.rot, o.a); celSparkle(c, x, y, r, o) a four-point twinkle;
//   celSweat(c, x, y, k)         a sweat drop; celMark(c, x, y, k, '!' | '?' | '!?')
//   celPuff(c, x, y, r, a)       a little cloud of dust (a hop landing)
//   celSmudge(c, x, y, r, S, sd) a smudge (butter, mud: CEL_MUD); celClod(c, x, y, r, rot) a clod of mud with grass
//   the cosmos (the universe in Kanha's mouth): celSpace(c, t) deep space over the frame, celSpaceIn(q, x, y, r, a) a
//                                little one inside a clipped shape, celGalaxy, celPlanet(c, x, y, r, { col, sh, lt, ring,
//                                band, craters, face }), celSun, celMoon (asleep), celMiniFace, celEarth(c, x, y, r, t)
//                                (Vraja on top: a hut and a kadamba; returns the point where a tiny figure stands)
//
// A kid's pose (px at s = 1; x to screen right, y down; "L" is screen left, the kid's right):
//   hip [x, y]      the pelvis from the ground point between the feet (standing: [0, -112]); hop (px: the whole kid
//                   rises, feet too); lean (radians, + to screen right); head (the head's tilt on top); squash
//   hL, hR [x, y]   the hands, in the upper body's frame (origin the pelvis; shoulders at [±64, -134]); eL, eR: which
//                   way each elbow bends; fL, fR the feet ([±44, 0] standing); kL, kR the knees
//   handL, handR    'open' | 'fist' | 'point' (the forearm's direction) | 'butter' (a blob of butter on the palm) |
//                   'pray' (a palm standing up: both hands in front of the chest are folded hands)
//   eyes            'open' | 'happy' (^ ^) | 'closed' (smug ‿ ‿) | 'squeeze' (> <) | 'wide' (shock) | 'sparkle' |
//                   'puppy' (huge, glossy, "who, ME?") | 'dizzy' (spirals) | 'heart'; or [screen left, screen right]
//   look [x, y]     -1..1, where the eyes look; lid 0..1 the upper lids down (deadpan); brow (-1..1 lower / raise);
//   tilt            -1 cross .. 1 worried (the brows' inner ends); browR: a different raise for the screen-right brow
//   mouth           'smile' | 'cat' (:3) | 'grin' | 'open' | 'o' | 'flat' | 'pout' | 'smug' | 'wobble' | 'frown' | 'wail' |
//                   'aah' (wide open; cosmos 0..1 fills it with the universe) | 'puff' (held shut, cheeks ballooned)
//   talk            1: the mouth flaps (a new shape every two drawings) over the pose's mouth
//   blush           0..1 extra; sweat 0..1 (a drop by the temple); butter 0..1 (Kanha: butter smeared on his face);
//                   mud 0..1 (Kanha: mud on his face); belly 0..1 (Kanha: a round full tummy)
//                   cry 0..1 (tears: two streams down the cheeks and drops flying off, anime-style; with eyes 'squeeze'
//                   and mouth 'wail' he bawls); kajal 0..1 (the black eye-ointment smeared down his cheeks by his
//                   crying and rubbing, Bhagavata 10.9.11)
// A tiny kid (s ≈ .2) keeps a readable line with CEL.inkK (ink width × k, cel.js) set round the call.

// ---------- acting ----------
function celKeys(t, keys, o = {}) {
  const tr0 = o.tr ?? .22, td = celHold(t, o.fps);
  if (!keys._full) { let acc = {}; keys._full = keys.map(([kt, p]) => [kt, acc = { ...acc, ...p }]); }
  const F = keys._full; let k = 0;
  for (let i = 0; i < F.length; i++) if (td >= F[i][0] - (F[i][1].tr ?? tr0)) k = i;
  const [tk, B] = F[k], A = F[Math.max(0, k - 1)][1], tr = B.tr ?? tr0;
  const P = k === 0 ? celMix(B, B, 1) : celMix(A, B, backOut(seg(td, tk - tr, tk + .04), B.over ?? 1.4));
  P.lag = k === 0 ? P : celMix(A, B, backOut(seg(td, tk - tr + .1, tk + .14), 2));
  return Object.assign(P, { land: k === 0 ? 9 : td - tk, prev: A, next: B, slot: k, td });
}

// ---------- palettes ----------
const CEL_KANHA = {
  skin: '#5B8FE0', sh: '#3F6DC4', lt: '#92BCF8', hair: '#1C1A30', hairLt: '#4A4A80', iris: '#15163A', iris2: '#3A6ED0',
  pit: '#F7C744', pitSh: '#DA9A22', pitLt: '#FFE48E', border: '#E04A36', gold: '#F2B52E', pearl: '#FFF8EC',
  feather: '#3FA45E', featherLt: '#8FD07A', fEye1: '#EDBB3A', fEye2: '#1FA39A', fEye3: '#22407E', tilak: '#FFF8EA', red: '#E2452B',
  flute: '#C98E4A', fluteSh: '#91592A', blush: '#F68BC0', mouth: '#6A1E3A', tongue: '#F27C90', butter: '#FFEFAE', butterSh: '#EBC860',
  mala: ['#FFF6E8', '#E2452B', '#F2B52E', '#F68BC0'],
};
const CEL_RADHA = {
  skin: '#F9CFA8', sh: '#EDA982', lt: '#FFE9D4', hair: '#21182A', hairLt: '#55406A', iris: '#24141E', iris2: '#9A5236',
  lehenga: '#F0507E', lehSh: '#C2335F', lehLt: '#FF8CAC', choli: '#F7C23E', choliSh: '#DC9A22', choliLt: '#FFE38E',
  odhni: '#5CCAB6', odhniSh: '#2E9A8C', odhniLt: '#A4EADA', gold: '#F2B52E', red: '#E2343E', blush: '#FF8AA6',
  mouth: '#7A1E36', tongue: '#F27C90', flower: '#FFFDF4', rose: '#F2578A', roseSh: '#C23466', leaf: '#4FA25A', pearl: '#FFF8EC',
  butter: '#FFEFAE', butterSh: '#EBC860',
};
// Radha dressed in Kanha's colours (o.pal): a yellow pitambar lehenga with his red border, a blue odhni, his mala's colours
const CEL_RADHA_PIT = { lehenga: '#F7C744', lehSh: '#DA9A22', lehLt: '#FFE48E', hem: '#E04A36', dot: '#E04A36', choli: '#F7C744', choliSh: '#DA9A22', choliLt: '#FFE48E',
  odhni: '#5B8FE0', odhniSh: '#3F6DC4', odhniLt: '#92BCF8' };

// ---------- the face (shared) ----------
// in head coordinates (the face's centre at 0, 0; about ±172 wide, -166 .. +148 tall)
const CEL_FACE = { ex: 66, ey: 18, my: 92, bx: 112, by: 72, k: 1 };
function celEye(c, ex, ey, kind, P, C, sd, k = 1, lashes = false) {
  const look = P.look || [0, 0], lid = clamp(P.lid || 0);
  if (kind === 'happy') { celLine(c, [[ex - 26 * k, ey + 8 * k], [ex, ey - 16 * k], [ex + 26 * k, ey + 8 * k]], 7.5 * k, { taper: .35 }); return; }
  if (kind === 'closed') {
    celLine(c, [[ex - 27 * k, ey - 2 * k], [ex, ey + 12 * k], [ex + 27 * k, ey - 2 * k]], 7 * k, { taper: .35 });
    if (lashes) celLine(c, [[ex + sd * 25 * k, ey], [ex + sd * 38 * k, ey - 8 * k]], 4 * k);
    return;
  }
  if (kind === 'heart') { const pu = 1 + .08 * Math.sin(CEL.d * 1.7 + sd); celHeart(c, ex, ey + 4 * k, 34 * k * pu, { rot: sd * .12 }); return; }
  if (kind === 'dizzy') { const sp = []; for (let i = 0; i <= 26; i++) { const a = i / 26 * TAU * 2.2 + sd * CEL.d * .9, r = (4 + i * 1.05) * k; sp.push([ex + Math.cos(a) * r * sd, ey + Math.sin(a) * r * 1.15]); } celLine(c, sp, 6 * k, { taper: .2, boil: .3 }); return; }
  if (kind === 'squeeze') { celLine(c, [[ex + sd * 22 * k, ey - 18 * k], [ex - sd * 20 * k, ey], [ex + sd * 22 * k, ey + 18 * k]], 7.5 * k, { taper: .3 }); return; }
  const ox = look[0] * 7 * k, oy = look[1] * 6 * k;
  if (kind === 'wide') {
    celOval(c, ex, ey, 30 * k, 38 * k, '#FFFFFF', { w: 4.5 * k });
    ellipse(c, ex + ox * 1.6, ey + oy * 1.6, 9 * k, 12 * k, C.iris); ellipse(c, ex + ox * 1.6 - 3 * k, ey + oy * 1.6 - 4 * k, 3 * k, 3.5 * k, '#FFFFFF');
    return;
  }
  const pk = kind === 'puppy' ? 1.18 : 1, rx = 29 * k * pk, ry = 39 * k * pk, cx = ex + ox, cy = ey + oy;
  const ly = cy - ry + lid * 1.9 * ry * .55;
  let pts = celEll(cx, cy, rx, ry, 0, 36);
  if (lid > .02) pts = pts.map(([x, y]) => [x, Math.max(y, ly + (x - cx) * sd * (P.lidTilt || 0))]);
  celShape(c, pts, C.iris, { dense: true, w: 4.5 * k, boil: .5, over: (q) => {
    let g = q.createLinearGradient(0, cy - ry, 0, cy + ry); g.addColorStop(0, rgba(C.iris, 0)); g.addColorStop(.55, rgba(C.iris2, .15)); g.addColorStop(1, rgba(C.iris2, .95));
    q.fillStyle = g; q.fillRect(cx - rx - 4, cy - ry - 4, rx * 2 + 8, ry * 2 + 8);
    const hy = Math.max(cy - ry * .42, ly + 12 * k);
    if (kind === 'sparkle') {
      q.fillStyle = '#FFFFFF'; q.beginPath(); const sx = cx - 7 * k, sy = hy + 2 * k, r = 15 * k;
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - Math.PI / 2, rr = i % 2 ? r * .32 : r; q.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); }
      q.fill(); ellipse(q, cx + 11 * k, cy + 15 * k, 5 * k, 5 * k, '#FFFFFF'); ellipse(q, cx - 12 * k, cy + 18 * k, 3 * k, 3 * k, '#FFFFFF');
    } else {
      ellipse(q, cx - 8 * k, hy, 10.5 * k * pk, 12.5 * k * pk, '#FFFFFF', -.3);
      ellipse(q, cx + 10 * k, cy + 15 * k, 5 * k * pk, 5 * k * pk, '#FFFFFF');
      if (kind === 'puppy') {
        ellipse(q, cx + 9 * k, hy - 6 * k, 5 * k, 6 * k, '#FFFFFF'); ellipse(q, cx - 13 * k, cy + 12 * k, 3.5 * k, 3.5 * k, '#FFFFFF');
        q.globalAlpha = .5; ellipse(q, cx, cy + ry * .78, rx * .8, ry * .2, '#BFE4FF'); q.globalAlpha = 1;
      }
    }
  } });
  // the lash line (kajal): a thick top edge, or the lid's straight edge
  if (lid > .02) celLine(c, [[cx - rx - 5 * k, ly - (rx + 5 * k) * sd * (P.lidTilt || 0) + 1], [cx + rx + 5 * k, ly + (rx + 5 * k) * sd * (P.lidTilt || 0) + 1]], 7.5 * k, { taper: .2 });
  else { const arc = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.12 + .76 * i / 8); arc.push([cx + Math.cos(a) * (rx + 1), cy + Math.sin(a) * (ry + 1)]); } celLine(c, arc, 7.5 * k, { taper: .25 }); }
  if (lashes) { const a = sd > 0 ? -.5 : Math.PI + .5, bx = cx + Math.cos(a) * rx, by = (lid > .02 ? ly : cy + Math.sin(a) * ry); celLine(c, [[bx, by], [bx + sd * 13 * k, by - 9 * k]], 4.5 * k); celLine(c, [[bx - sd * 4 * k, by - 4 * k], [bx + sd * 6 * k, by - 16 * k]], 4 * k); }
}
function celMouth(c, m, C, y = 92, k = 1, cos = 0) {
  const M = (P) => P.map(([a, b]) => [a * k, y + (b - 92) * k]), tongue = (q, ty, rx) => { q.fillStyle = C.tongue; q.beginPath(); q.ellipse(0, y + (ty - 92) * k, rx * k, 9 * k, 0, 0, TAU); q.fill(); };
  if (m === 'smile') celLine(c, M([[-20, 88], [0, 99], [20, 88]]), 5.5 * k);
  else if (m === 'cat') { celLine(c, M([[-24, 88], [-12, 99], [0, 90]]), 5 * k, { taper: .4 }); celLine(c, M([[0, 90], [12, 99], [24, 88]]), 5 * k, { taper: .4 }); }
  else if (m === 'grin') celShape(c, M([[-30, 84], [30, 84], [22, 104], [0, 114], [-22, 104]]), C.mouth, { n: 3, w: 4.5 * k, over: q => tongue(q, 112, 15) });
  else if (m === 'open') celOval(c, 0, y + 4 * k, 15 * k, 17 * k, C.mouth, { w: 4.5 * k, over: q => tongue(q, 106, 11) });
  else if (m === 'o') celOval(c, 0, y + 4 * k, 9 * k, 11 * k, C.mouth, { w: 4 * k });
  else if (m === 'flat') celLine(c, M([[-16, 94], [0, 95], [16, 94]]), 5 * k);
  else if (m === 'pout') { celLine(c, M([[-15, 100], [0, 91], [15, 100]]), 5 * k); }
  else if (m === 'smug') celLine(c, M([[-18, 95], [4, 98], [24, 85]]), 5.5 * k);
  else if (m === 'wobble') celLine(c, M([[-26, 96], [-13, 89], [0, 96], [13, 89], [26, 96]]), 4.5 * k, { taper: .3 });
  else if (m === 'frown') celLine(c, M([[-20, 100], [0, 90], [20, 100]]), 5.5 * k);
  else if (m === 'aah') celShape(c, M([[-40, 80], [0, 76], [40, 80], [46, 106], [30, 136], [0, 146], [-30, 136], [-46, 106]]), C.mouth, { n: 4, w: 4.5 * k, over: q => cos > .02 ? celSpaceIn(q, 0, y + 20 * k, 52 * k, cos) : tongue(q, 134, 20) });
  else if (m === 'puff') celLine(c, M([[-11, 97], [-4, 92], [4, 97], [11, 92]]), 4.5 * k, { taper: .3 });
  else if (m === 'wail') celShape(c, M([[-34, 82], [34, 82], [28, 120], [0, 128], [-28, 120]]), C.mouth, { n: 3, w: 4.5 * k, over: q => tongue(q, 122, 18) });
}
function celFace(c, P, C, o = {}) {
  const F = { ...CEL_FACE, ...(o.face || {}) }, k = F.k, ev = Array.isArray(P.eyes) ? P.eyes : [P.eyes || 'open', P.eyes || 'open'];
  // puffed cheeks (the mouth held shut round something big): skin balloons over the cheeks, inked on their outer side
  if (P.mouth === 'puff') for (const sd of [-1, 1]) {
    celOval(c, sd * 134 * k, 70 * k, 44 * k, 44 * k, C.skin, { ink: false, over: q => ellipse(q, sd * 126 * k, 54 * k, 14 * k, 9 * k, 'rgba(255,255,255,.35)', -.4) });
    const arc = []; for (let i = 0; i <= 10; i++) { const a = sd > 0 ? lerp(-1.1, 1.4, i / 10) : lerp(Math.PI + 1.1, Math.PI - 1.4, i / 10); arc.push([sd * 134 * k + Math.cos(a) * 44 * k, 70 * k + Math.sin(a) * 44 * k]); }
    celLine(c, arc, 5.5 * k, { taper: .55 });
  }
  // the blush first (under the eyes' lower edge)
  const bk = clamp((P.blush || 0)), ba = .5 + .4 * bk;
  for (const sd of [-1, 1]) {
    c.save(); c.globalAlpha = ba; ellipse(c, sd * F.bx * k, F.by * k + F.ey * 0, (30 + 10 * bk) * k, (14 + 5 * bk) * k, C.blush); c.restore();
    for (let i = 0; i < 3; i++) celLine(c, [[sd * F.bx * k + (-14 + i * 12) * k, (F.by + 9) * k], [sd * F.bx * k + (-7 + i * 12) * k, (F.by - 7) * k]], 2.8 * k, { boil: .4, col: rgba(CEL.ink, .55) });
  }
  [-1, 1].forEach((sd, i) => celEye(c, sd * F.ex * k, F.ey * k, ev[i], P, C, sd, k, o.lashes));
  // brows
  for (const sd of [-1, 1]) {
    const raise = (sd > 0 && P.browR != null ? P.browR : P.brow || 0), tl = P.tilt || 0, by = (F.ey - 60 - raise * 14) * k, bx = sd * F.ex * k;
    celLine(c, [[bx - sd * 18 * k, by - tl * 9 * k], [bx + sd * 18 * k, by + tl * 9 * k]], 5.5 * k, { taper: .5 });
  }
  celLine(c, [[-3 * k, (F.my - 36) * k], [4 * k, (F.my - 32) * k]], 3.5 * k);   // the nose
  let m = P.mouth || 'smile';
  if ((P.talk || 0) > .5) { const r = hash(Math.floor(CEL.d / 2) * 1.71 + (o.seed || 0)); m = r < .42 ? 'open' : r < .68 ? 'o' : m === 'open' ? 'smile' : m; }
  celMouth(c, m, C, F.my * k, k, P.cosmos || 0);
}
// a sweat drop, a heart, a sparkle, an ink mark: the little things that make it cute
function celSweat(c, x, y, k = 1) {
  if (k <= .02) return;
  c.save(); c.translate(x, y); c.scale(k, k);
  celShape(c, [[0, -34], [14, -6], [16, 10], [0, 22], [-16, 10], [-14, -6]], '#A6DCFF', { n: 5, w: 4, boil: .4, over: q => ellipse(q, -6, 4, 4, 7, '#FFFFFF', -.3) });
  c.restore();
}
function celHeart(c, x, y, r, o = {}) {
  if (r <= 1 || (o.a ?? 1) <= .02) return;
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= (o.a ?? 1);
  const P = []; for (let i = 0; i < 28; i++) { const t = i / 28 * TAU; P.push([16 * Math.pow(Math.sin(t), 3) * r / 16, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r / 16]); }
  celShape(c, P, o.col || '#FF6F9E', { dense: true, w: Math.max(2.5, r * .1), boil: .4, shade: [o.sh || '#E84A82', r * .12, r * .16], over: q => ellipse(q, -r * .42, -r * .3, r * .2, r * .13, 'rgba(255,255,255,.9)', -.6) });
  c.restore();
}
function celSparkle(c, x, y, r, o = {}) {
  if (r <= 1 || (o.a ?? 1) <= .02) return;
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= (o.a ?? 1);
  const P = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - Math.PI / 2, rr = i % 2 ? r * .26 : r; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  celShape(c, P, o.col || '#FFD95A', { dense: true, w: Math.max(2, r * .09), boil: .3, over: q => ellipse(q, 0, 0, r * .18, r * .18, '#FFFFFF') });
  c.restore();
}
function celMark(c, x, y, k = 1, kind = '!') {
  if (k <= .02) return;
  c.save(); c.translate(x, y); c.scale(k, k);
  const bang = dx => { celShape(c, [[dx - 10, -60], [dx + 10, -60], [dx + 5, -10], [dx - 5, -10]], CEL.ink, { n: 2, w: 3 }); celOval(c, dx, 10, 8, 8, CEL.ink, { w: 3 }); };
  if (kind === '!') bang(0);
  else if (kind === '?') { celLine(c, [[-18, -40], [-10, -58], [10, -60], [20, -44], [8, -26], [0, -14], [0, -4]], 11, { taper: .1 }); celOval(c, 0, 14, 8, 8, CEL.ink, { w: 3 }); }
  else { celLine(c, [[-36, -40], [-28, -58], [-8, -60], [2, -44], [-10, -26], [-18, -14], [-18, -4]], 10, { taper: .1 }); celOval(c, -18, 14, 7, 7, CEL.ink, { w: 3 }); bang(18); }
  c.restore();
}
function celPuff(c, x, y, r, a = 1) {
  if (a <= .02) return;
  c.save(); c.globalAlpha *= a;
  for (const [dx, dy, k] of [[-1, 0, .7], [-.45, -.35, .9], [.15, -.45, 1], [.7, -.2, .8], [1.05, .05, .6]]) celOval(c, x + dx * r, y + dy * r * .6, r * .42 * k, r * .34 * k, '#FFFFFF', { w: 3, boil: .4 });
  c.restore();
}

// mud on a kid's face (head coordinates), under the features: a muddy ring round the mouth, a swipe across his cheek
// where he wiped it with his hand, a dab on the nose, a drip on the chin. b 0..1 how much.
function celMudFace(c, b) {
  // a soft stain (no ink): round the mouth, a swipe across his cheek, the tip of his nose; filled once, so it is even
  const p = new Path2D(), blob = (x, y, rx, ry, r = 0) => { p.moveTo(x + rx * Math.cos(r), y + rx * Math.sin(r)); p.ellipse(x, y, rx * b, ry * b, r, 0, TAU); };
  for (const [x, y, rx, ry] of [[-30, 104, 22, 14], [-8, 116, 26, 14], [18, 112, 24, 13], [36, 100, 13, 10], [-42, 92, 10, 8], [6, 128, 15, 9]]) blob(x, y, rx, ry);
  for (let i = 0; i <= 5; i++) blob(lerp(-150, -84, i / 5), lerp(58, 34, i / 5), 17 - i * 1.6, 9 - i * .6, -.35);
  blob(-1, 61, 8, 6);
  c.save(); c.globalAlpha *= .82; c.fillStyle = '#9A6438'; c.fill(p); c.restore();
  // crumbs, inked
  for (const [x, y, r, sd] of [[-48, 114, 9, 1], [46, 118, 7.5, 2], [12, 142, 7, 3], [-116, 50, 7.5, 4], [62, 94, 5.5, 5]]) celSmudge(c, x, y, r * b, CEL_MUD, sd);
}

// ---------- a clay pot of butter ----------
function celMatki(c, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.rotate(o.tilt || 0); c.scale(s, s);
  celShape(c, [[-56, -8], [-70, -50], [-60, -92], [-34, -112], [34, -112], [60, -92], [70, -50], [56, -8], [0, 2]], '#CC6B3A', { shade: ['#9C4A26', 10, 8], lt: ['#EC9564', 5, 5] });
  celLine(c, [[-66, -62], [-33, -54], [0, -51], [33, -54], [66, -62]], 9, { under: '#F4E6CC', taper: 0 });
  for (let i = 0; i < 6; i++) { const u = -50 + i * 20; celLine(c, [[u, -44], [u + 10, -34], [u + 20, -44]], 3, { col: '#F4E6CC', boil: .4 }); }
  celOval(c, 0, -114, 40, 12, '#B85A30', { w: 4.5 });
  if (o.water) { ellipse(c, 0, -114, 31, 8, '#5DB8EC'); ellipse(c, -10, -116, 12, 3, 'rgba(255,255,255,.8)'); ellipse(c, 14, -112, 6, 2, 'rgba(255,255,255,.6)'); }
  else if (!o.empty) celShape(c, [[-38, -114], [-32, -136], [-12, -154], [12, -150], [32, -134], [40, -114], [0, -106]], '#FFF5D2', { n: 4, w: 4.5, shade: ['#F2DA8C', 6, 6], over: q => ellipse(q, -12, -136, 9, 6, '#FFFFFF', -.4) });
  else ellipse(c, 0, -114, 30, 7, '#5A2A16');
  c.restore();
}

// a blob of butter (on a palm, on a face): r its size
function celButter(c, x, y, r, C, seed = 0) { celSmudge(c, x, y, r, { col: C.butter, sh: C.butterSh }, seed); }
// a smudge of something soft (butter, mud): S.col, S.sh, S.dots (speckles), S.hi (the highlight's alpha)
const CEL_MUD = { col: '#9A6236', sh: '#6E3F1E', dots: '#5A3016', hi: .55 };
function celSmudge(c, x, y, r, S, seed = 0) {
  if (r <= 1) return;
  const P = []; for (let i = 0; i < 7; i++) { const a = i / 7 * TAU, rr = r * (.86 + .2 * hash(i + seed * 13)); P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .8]); }
  celShape(c, P, S.col, { n: 6, w: 3.2, boil: .5, shade: [S.sh, r * .2, r * .2], over: q => {
    if (S.dots) for (let i = 0; i < 3; i++) ellipse(q, x + (hash(seed * 5 + i) - .5) * r, y + (hash(seed * 7 + i + 3) - .5) * r * .8, r * .12, r * .1, S.dots);
    ellipse(q, x - r * .3, y - r * .25, r * .26, r * .17, `rgba(255,255,255,${S.hi ?? 1})`, -.4);
  } });
}

// ---------- the kids ----------
function celKanha(c, x, y, s, P, o = {}) { return celKid(c, x, y, s, P, o, 'kanha'); }
function celRadha(c, x, y, s, P, o = {}) { return celKid(c, x, y, s, P, o, 'radha'); }
function celKid(c, x, y, s, P, o, who) {
  const R = who === 'radha', G = !R && o.gopa, C = { flute: CEL_KANHA.flute, fluteSh: CEL_KANHA.fluteSh, ...(R ? CEL_RADHA : CEL_KANHA), ...(G ? G.pal || {} : {}), ...(o.pal || {}) }, A = {}, td = P.td ?? o.t ?? 0;
  const sh = col => [col, 7, 9], lt = col => [col, 4, 5], skin = { shade: sh(C.sh), lt: lt(C.lt) };
  celBegin(td); CEL.n = o.seed ?? (R ? 500 : 0);
  c.save(); c.translate(x, y); c.scale(s, s);
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, br = Math.sin(td * TAU / 2.6 + (R ? 1.3 : 0)), hop = P.hop || 0;
  const hip = [P.hip[0], P.hip[1] + hit * 9 + br * 1.8 - hop], lean = P.lean || 0, cs = Math.cos(lean), sn = Math.sin(lean);
  const Wp = ([px, py]) => [hip[0] + px * cs - py * sn, hip[1] + px * sn + py * cs];
  const sq = clamp((P.squash || 0) + hit * .35 + br * .015, -1, 1), sx = 1 + sq * .07, sy = 1 - sq * .08;
  const NECK = [0, -150], HC = [0, -138], lag = P.lag || P;
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const sheen = (x0, y0, rx, ry) => q => { const g = q.createRadialGradient(x0, y0, 0, x0, y0, rx); g.addColorStop(0, rgba(C.hairLt, .85)); g.addColorStop(1, rgba(C.hairLt, 0)); q.save(); q.translate(x0, y0); q.scale(1, ry / rx); q.translate(-x0, -y0); q.fillStyle = g; q.fillRect(x0 - rx, y0 - rx, rx * 2, rx * 2); q.restore(); };

  // the hair behind, a drawing late
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lag.lean || 0); c.translate(...NECK); c.rotate((lag.head || 0) * (P.hairK ?? .85)); c.scale(sx, sy); c.translate(...HC);
  if (R) {
    celShape(c, [[-150, -150], [0, -198], [150, -150], [196, -30], [188, 90], [150, 170], [100, 214], [0, 200], [-100, 214], [-150, 170], [-188, 90], [-196, -30]], C.hair, { over: sheen(-70, -120, 150, 90) });
    // the plait behind her left shoulder (screen right), swinging, a red tassel at its end
    const sw = Math.sin(td * 2.3) * 9 - (lag.lean || 0) * 90 - (lag.head || 0) * 60;
    const pl = [[128, 100], [168, 180], [164 + sw * .6, 250], [154 + sw, 304]];
    celShape(c, celTube(pl, [66, 58, 50, 40]), C.hair, { dense: true, lt: [C.hairLt, -4, 6] });
    const Q = through(pl, 6);
    for (let i = 3; i < Q.length - 2; i += 3) { const d = v2.norm(v2.sub(Q[i + 1], Q[i - 1])), q = v2.perp(d), w = 26 - i * .6; celLine(c, [v2.add(Q[i], v2.mul(q, w)), v2.add(Q[i], v2.mul(d, 9)), v2.add(Q[i], v2.mul(q, -w))], 3.2, { col: rgba(C.hairLt, .9), boil: .4 }); }
    const e = Q[Q.length - 1];
    celOval(c, e[0], e[1] + 8, 14, 12, C.gold, { w: 3.5 });
    celShape(c, [[e[0] - 12, e[1] + 14], [e[0] + 12, e[1] + 14], [e[0] + 18 + sw * .3, e[1] + 66], [e[0] + sw * .3, e[1] + 74], [e[0] - 16 + sw * .3, e[1] + 64]], C.red, { n: 3, w: 4, shade: ['#B0222C', 5, 4] });
  } else {
    const pts = []; for (let i = 0; i < 70; i++) { const a = i / 70 * TAU, kk = 1 + .07 * Math.abs(Math.sin(a * 7)); pts.push([Math.cos(a) * 190 * kk, 4 + Math.sin(a) * (Math.sin(a) > 0 ? 150 : 186) * kk]); }
    celShape(c, pts, C.hair, { dense: true, over: sheen(-70, -110, 160, 100) });
  }
  c.restore();

  // the legs and feet (Radha's only peep out under her lehenga); P.sit: sitting on the ground (below)
  const SIT = !!P.sit;
  const legs = [-1, 1].map(sd => {
    const f0 = (sd < 0 ? P.fL : P.fR) || [sd * 44, 0], f = [f0[0], f0[1] - hop], hj = Wp([sd * 30, -6]);
    const [knee, ank] = celIK(hj, [f[0], f[1] - 16], 56, 56, (sd < 0 ? P.kL : P.kR) || [sd, -.3]);
    return { sd, hj, knee, ank, f };
  });
  const foot = L => { const d = v2.norm(v2.sub(L.ank, L.knee)); celOval(c, L.ank[0] + L.sd * 8 + d[0] * 9, L.ank[1] + d[1] * 9 + 3, 34, 17, C.skin, { ...skin, rot: Math.atan2(d[1], d[0]) - Math.PI / 2 }); };
  if (!SIT) for (const L of legs) {
    if (R) { celShape(c, celTube([v2.lerp(L.knee, L.ank, .3), L.ank], [42, 40]), C.skin, { dense: true, ...skin }); foot(L); celBand(c, L.knee, L.ank, .86, 44, 9, C.gold); }
    else { celShape(c, celTube([L.hj, L.knee, L.ank], [64, 54, 46]), C.skin, { dense: true, ...skin }); foot(L); celBand(c, L.knee, L.ank, .84, 50, 10, C.gold); }
  }
  A.feet = SIT ? [at(-40, -hop), at(40, -hop)] : legs.map(L => at(...L.f));

  if (SIT && !R) {
    // sitting cross-legged (P.sit, hip ≈ [0, -58]): the pitambar over his lap out to the knees, a red border along its
    // edge, the front pleats falling between them; the shins crossing in front, the feet tucked under the far knees
    const g = -hop, edgeP = [[-176, g - 24], [-160, g - 4], [-60, g - 14], [0, g - 6], [60, g - 14], [160, g - 4], [176, g - 24]];
    const edge = q => { q.strokeStyle = C.border; q.lineWidth = 20; q.lineJoin = 'round'; q.beginPath(); through(edgeP, 4).forEach((p, i) => i ? q.lineTo(...p) : q.moveTo(...p)); q.stroke(); };
    celShape(c, [Wp([-70, -44]), Wp([-84, 0]), [-150, g - 58], ...edgeP, [150, g - 58], Wp([84, 0]), Wp([70, -44])], C.pit, { n: 4, shade: sh(C.pitSh), lt: lt(C.pitLt), over: edge });
    for (const sd of [-1, 1]) celLine(c, [Wp([sd * 50, -22]), [sd * 118, g - 40]], 3.2, { col: rgba(CEL.ink, .7) });
    for (const sd of [-1, 1]) {
      const kn = [sd * 128, g - 34], an = [-sd * 34, g - 22], d = v2.norm(v2.sub(an, kn));
      celShape(c, celTube([kn, v2.lerp(kn, an, .5), an], [54, 48, 42]), C.skin, { dense: true, ...skin });
      celBand(c, kn, an, .8, 46, 10, C.gold);
      celOval(c, an[0] + d[0] * 30, an[1] + d[1] * 30 + 4, 34, 17, C.skin, { ...skin, rot: Math.atan2(d[1], d[0]) });
    }
    celShape(c, [Wp([-28, -40]), Wp([28, -40]), Wp([30, 30]), [0, g - 30], Wp([-30, 30])], C.pit, { n: 4, shade: sh(C.pitSh), lt: lt(C.pitLt), over: q => { q.strokeStyle = C.border; q.lineWidth = 16; q.beginPath(); q.moveTo(...Wp([-32, 26])); q.lineTo(0, g - 34); q.lineTo(...Wp([32, 26])); q.stroke(); } });
  }
  if (!SIT && !R) {
    // the pitambar: waist to above the knees, following the legs, a red border at the hem, the front pleats
    const hem = L => { const tp = v2.lerp(L.hj, L.knee, .78), d = v2.norm(v2.sub(L.knee, L.hj)); let q = v2.perp(d); if (q[0] * L.sd < 0) q = v2.mul(q, -1); return [v2.add(tp, v2.mul(q, 40)), v2.add(tp, v2.mul(q, -30))]; };
    const [oL, iL] = hem(legs[0]), [oR, iR] = hem(legs[1]), cr = Wp([0, 16]);
    const edge = q => { q.strokeStyle = C.border; q.lineWidth = 20; q.lineJoin = 'round'; q.beginPath(); [oL, iL, cr, iR, oR].forEach((p, i) => i ? q.lineTo(...p) : q.moveTo(...p)); q.stroke(); };
    celShape(c, [Wp([-70, -44]), Wp([-82, 0]), oL, iL, cr, iR, oR, Wp([82, 0]), Wp([70, -44])], C.pit, { n: 4, shade: sh(C.pitSh), lt: lt(C.pitLt), over: edge });
    celLine(c, [Wp([-52, -24]), v2.lerp(Wp([-52, -24]), oL, .6)], 3.2);
    celShape(c, [Wp([-28, -40]), Wp([28, -40]), Wp([32, 38]), Wp([0, 52]), Wp([-32, 38])], C.pit, { n: 4, shade: sh(C.pitSh), lt: lt(C.pitLt), over: q => { q.strokeStyle = C.border; q.lineWidth = 16; q.beginPath(); q.moveTo(...Wp([-34, 34])); q.lineTo(...Wp([0, 50])); q.lineTo(...Wp([34, 34])); q.stroke(); } });
    celLine(c, [Wp([-6, -26]), Wp([-10, 40])], 3);
  }

  // the upper body
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
  if (R) {
    celShape(c, [[-54, -26], [-60, -84], [-60, -128], [-38, -150], [0, -154], [38, -150], [60, -128], [60, -84], [54, -26], [0, -18]], C.choli, { shade: sh(C.choliSh), lt: lt(C.choliLt) });
    celLine(c, [[-56, -36], [0, -28], [56, -36]], 12, { under: C.gold, taper: 0 });
  } else {
    // belly 0..1: a round full tummy (after the ladoos), pushed out at the sides and below, with a shine
    const bl = clamp(P.belly || 0), bw = 22 * bl;
    celShape(c, [[-64 - bw * .5, -24], [-74 - bw, -76], [-68 - bw * .3, -128], [-42, -150], [0, -156], [42, -150], [68 + bw * .3, -128], [74 + bw, -76], [64 + bw * .5, -24], [0, -12 + 12 * bl]], C.skin, { ...skin, over: bl > .02 ? q => ellipse(q, -30 - bw * .4, -92, 16 * bl, 22 * bl, 'rgba(255,255,255,.35)', -.4) : null });
    celLine(c, [[-5, -62 + 4 * bl], [0, -56 + 4 * bl], [5, -62 + 4 * bl]], 3);   // the tummy button
  }
  c.restore();

  if (R) {
    // the lehenga: a bell from the waist to the ankles, its hem swinging, a gold border and gold dots
    // sitting (P.sit): the lehenga spread round her on the ground like a flower, its hem curving toward us, toes peeping out
    const fx0 = Math.min(legs[0].f[0], legs[1].f[0]), fx1 = Math.max(legs[0].f[0], legs[1].f[0]), hy = (SIT ? -6 : -12) - hop;
    const sw = Math.sin(td * 2.6) * 4 - (lag.lean || 0) * 70, hl = SIT ? -200 + sw * .3 : fx0 - 76 + sw, hr = SIT ? 200 + sw * .3 : fx1 + 76 + sw;
    const H = []; for (let i = 0; i <= (SIT ? 12 : 8); i++) { const n = SIT ? 12 : 8; H.push([lerp(hl, hr, i / n), hy + (i % 2 ? 7 : -3) + Math.sin(i / n * Math.PI) * (SIT ? 16 : 6)]); }
    const border = q => {
      q.strokeStyle = C.hem || C.gold; q.lineWidth = 34; q.lineJoin = 'round'; q.beginPath(); H.forEach((p, i) => i ? q.lineTo(...p) : q.moveTo(...p)); q.stroke();
      q.strokeStyle = C.hem ? C.gold : C.red; q.lineWidth = 5; q.beginPath(); H.forEach((p, i) => i ? q.lineTo(p[0], p[1] - 19) : q.moveTo(p[0], p[1] - 19)); q.stroke();
      for (let i = 0; i < 9; i++) { const u = (i + .5) / 9, yy = lerp(-40, hy - 30, (i % 3) / 3 + .2); ellipse(q, lerp(lerp(Wp([-50, 0])[0], hl, .7), lerp(Wp([50, 0])[0], hr, .7), u), yy, 5, 5, C.dot || C.gold); }
    };
    const puffL = SIT ? [[-132, hy - 62], [-188, hy - 30]] : [[hl + 6, hy - 14]], puffR = SIT ? [[188, hy - 30], [132, hy - 62]] : [[hr - 6, hy - 14]];
    celShape(c, [Wp([-58, -40]), Wp([-66, -8]), ...puffL, ...H, ...puffR, Wp([66, -8]), Wp([58, -40])], C.lehenga, { n: 3, shade: sh(C.lehSh), lt: lt(C.lehLt), over: border });
    for (const k of SIT ? [-.75, -.32, .32, .75] : [-.5, 0, .5]) celLine(c, [Wp([k * 60, -30]), [lerp(hl, hr, .5 + k * .62), hy - 26 + (SIT ? 12 : 0)]], 3, { col: rgba(CEL.ink, .7) });
    if (SIT) for (const sd of [-1, 1]) {
      const fx = sd * 40, fy = hy + 14;
      celOval(c, fx, fy, 30, 15, C.skin, { ...skin, rot: sd * .15 });
      celLine(c, [[fx - 22, fy - 10], [fx + 22, fy - 10]], 7, { under: C.gold, taper: 0, boil: .3 });
    }
    celLine(c, [Wp([-60, -40]), Wp([0, -34]), Wp([60, -40])], 16, { under: C.red, taper: 0 });
  } else {
    // the kardhani with little bells, and the flute tucked in at the waist
    c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
    if (G) {
      // a gopa's cloth sash, knotted at the side, its ends hanging
      celLine(c, [[-74, -42], [0, -32], [74, -42]], 18, { under: G.sash, taper: 0 });
      celShape(c, [[44, -40], [58, -12], [50, 14], [40, -14]], G.sash, { n: 3, w: 3.5 }); celShape(c, [[54, -40], [76, -16], [74, 8], [62, -18]], G.sash, { n: 3, w: 3.5 });
    } else {
      celLine(c, [[-72, -40], [0, -30], [72, -40]], 15, { under: C.gold, taper: 0 });
      for (let i = 0; i < 5; i++) { const u = -52 + i * 26; celOval(c, u, -24 + Math.abs(u) * -.1, 6.5, 7, C.gold, { w: 2.4, boil: .3 }); }
    }
    if (!P.flute || P.flute === 'tuck') {
      celShape(c, celTube([[-94, -78], [40, -24]], [17, 17]), C.flute, { dense: true, w: 4, shade: [C.fluteSh, 0, 5] });
      for (const u of [.42, .54, .66, .78]) { const p = v2.lerp([-94, -78], [40, -24], u); ellipse(c, p[0], p[1] - 2, 3, 3, '#3A2414'); }
      celBand(c, [-94, -78], [40, -24], .12, 22, 6, C.red); celBand(c, [-94, -78], [40, -24], .9, 22, 6, C.red);
    }
    c.restore();
  }

  c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
  if (R) {
    // the odhni across her, from her left shoulder to her right hip, its end falling
    const sw = Math.sin(td * 2.1 + 1) * 7 - (lag.lean || 0) * 80;
    const od = [[56, -148], [14, -104], [-42, -58], [-74, -20], [-92 + sw * .5, 30], [-98 + sw, 72]];
    celShape(c, celTube(od, [34, 36, 38, 40, 42, 40]), C.odhni, { dense: true, shade: sh(C.odhniSh), lt: lt(C.odhniLt) });
    const Q = through(od, 4); for (let i = 1; i < Q.length - 1; i += 2) ellipse(c, Q[i][0], Q[i][1], 3.6, 3.6, C.gold);
    // P.mala 0..1: a garland like his vaijayanti, the beads popping on one by one
    const mk = clamp(P.mala || 0); if (mk > .02) for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12, k = clamp(mk * 13 - i); if (k > .05) celOval(c, -50 * Math.cos(a), -150 + 96 * Math.sin(a), 9.5 * k, 9.5 * k, CEL_KANHA.mala[i % 4], { w: 2.4, boil: .3 }); }
  } else if (G) {
    // a black thread with a little gold amulet (a taveez)
    const th = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; th.push([-44 * Math.cos(a), -152 + 70 * Math.sin(a)]); }
    celLine(c, th, 3.4, { taper: 0, boil: .3 });
    celShape(c, [[-9, -86], [9, -86], [7, -66], [0, -60], [-7, -66]], C.gold, { n: 2, w: 2.6, boil: .3 });
  } else {
    // the vaijayanti mala
    for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; celOval(c, -50 * Math.cos(a), -150 + 96 * Math.sin(a), 9.5, 9.5, C.mala[i % 4], { w: 2.4, boil: .3 }); }
  }

  if (P.armsFirst) arms();
  // the head
  c.save(); c.translate(...NECK); c.rotate(P.head || 0); c.scale(sx, sy); c.translate(...HC);
  if (!R) for (const sd of [-1, 1]) { celOval(c, sd * 166, 26, 24, 32, C.skin, { ...skin, over: (P.flush || 0) > .5 ? q => { q.fillStyle = rgba('#EE3F5C', .78 * seg(P.flush, .5, .8)); q.fillRect(sd * 166 - 30, -10, 60, 80); } : null }); celLine(c, [[sd * 170, 12], [sd * 162, 28], [sd * 170, 42]], 3); }
  celShape(c, [[-150, -128], [-80, -160], [0, -166], [80, -160], [150, -128], [172, -30], [168, 50], [142, 112], [72, 142], [0, 148], [-72, 142], [-142, 112], [-168, 50], [-172, -30]], C.skin, {
    shade: [C.sh, 10, 12], lt: [C.lt, 6, 6],
    over: q => {
      const g = q.createRadialGradient(-30, 30, 0, -30, 30, 200); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = g; q.fillRect(-200, -200, 400, 400);
      // P.flush 0..1 (#12): going red, the flush rising from the chin up over the whole face, a soft edge on top
      const fl = clamp(P.flush || 0);
      if (fl > .01) { const y0 = 160 - fl * 340, f = R ? '#F04E6E' : '#EE3F5C'; const g2 = q.createLinearGradient(0, y0 - 50, 0, y0 + 40); g2.addColorStop(0, rgba(f, 0)); g2.addColorStop(1, rgba(f, R ? .62 : .78)); q.fillStyle = g2; q.fillRect(-200, y0 - 50, 400, 420); }
    },
  });
  A.head = at(0, 0); A.mouth = at(0, 92); A.cheekL = at(-112, 72); A.cheekR = at(112, 72);
  if (R) {
    // P.feather 0..1: his peacock feather tucked in her hair (screen right), behind the front locks; it pops up
    const fk = clamp(P.feather || 0);
    if (fk > .02) { c.save(); c.translate(118, -150); c.rotate(.5 + Math.sin(td * 2) * .04 + (lag.head || 0) * .3 - (P.head || 0) * .25); c.scale(fk * .9, fk * .9); celPeacockFeather(c, CEL_KANHA); c.restore(); }
    // the hair: a centre parting, two soft sides over her ears; the maang tikka, flowers, jhumkas
    for (const sd of [-1, 1]) {
      celShape(c, [[sd * 4, -178], [sd * 80, -180], [sd * 150, -142], [sd * 186, -60], [sd * 188, 30], [sd * 176, 96], [sd * 152, 70], [sd * 148, 0], [sd * 132, -70], [sd * 92, -116], [sd * 38, -134], [sd * 4, -140]], C.hair, { over: sheen(sd * 90, -150, 70, 26) });
      celLine(c, [[sd * 156, 96], [sd * 156, 114]], 3, { boil: .3 });
      celShape(c, [[sd * 156 - 13, 114], [sd * 156 + 13, 114], [sd * 156 + 20, 140], [sd * 156 - 20, 140]], C.gold, { n: 2, w: 3.5, boil: .4 });
      for (let i = 0; i < 3; i++) ellipse(c, sd * 156 - 12 + i * 12, 146, 3.4, 3.4, C.gold);
    }
    celLine(c, [[0, -186], [0, -142]], 6, { col: C.sh, taper: .2, boil: .4 });
    celLine(c, [[0, -184], [0, -120]], 3, { col: '#B88A1C', taper: 0, boil: .3 });
    celShape(c, [[0, -122], [12, -108], [0, -92], [-12, -108]], C.gold, { n: 3, w: 3.5, boil: .3, over: q => ellipse(q, 0, -107, 4.5, 5, C.red) });
    celOval(c, 0, -82, 4.5, 5, C.pearl, { w: 2.2, boil: .2 });
    for (const [fx, fy, r] of [[-128, -150, 14], [-152, -126, 13], [-110, -172, 12]]) {
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; celOval(c, fx + Math.cos(a) * r * .55, fy + Math.sin(a) * r * .55, r * .5, r * .5, C.flower, { w: 2.2, boil: .25 }); }
      ellipse(c, fx, fy, r * .26, r * .26, C.gold);
    }
    celOval(c, -168, -96, 21, 19, C.rose, { w: 3, shade: [C.roseSh, 4, 5], over: q => { q.strokeStyle = C.roseSh; q.lineWidth = 3; q.beginPath(); q.arc(-168, -96, 9, 0, 5); q.stroke(); } });
    celShape(c, [[-150, -84], [-128, -72], [-146, -66]], C.leaf, { n: 2, w: 2.5, boil: .3 });
    ellipse(c, 0, -60, 6, 7, C.red);   // the bindi
    // P.wreath 0..1: a crown of flowers over her head (mogra, marigolds, little roses, leaves), popping on from her left
    const wk = clamp(P.wreath || 0);
    if (wk > .02) for (let i = 0; i < 13; i++) {
      const a = Math.PI * (1 - i / 12), k = backOut(clamp(wk * 14 - i), 2), fx = 172 * Math.cos(a), fy = -92 - 98 * Math.sin(a);
      if (k < .05) continue;
      if (i % 2 === 0 && i < 12) celShape(c, [[fx, fy], [fx + 14 * k, fy - 16 * k], [fx + 30 * k, fy - 6 * k], [fx + 14 * k, fy + 4 * k]], C.leaf, { n: 3, w: 2.4, boil: .3 });
      const kind = i % 3, r = (kind === 1 ? 16 : 14) * k;
      if (kind === 0) { for (let j = 0; j < 5; j++) { const b = j / 5 * TAU - Math.PI / 2; celOval(c, fx + Math.cos(b) * r * .55, fy + Math.sin(b) * r * .55, r * .5, r * .5, C.flower, { w: 2.2, boil: .25 }); } ellipse(c, fx, fy, r * .26, r * .26, C.gold); }
      else if (kind === 1) celOval(c, fx, fy, r, r * .92, '#FF9B1E', { w: 2.6, boil: .3, over: q => { for (let j = 0; j < 7; j++) { const b = j / 7 * TAU; ellipse(q, fx + Math.cos(b) * r * .5, fy + Math.sin(b) * r * .45, r * .24, r * .2, '#FFC23A'); } } });
      else celOval(c, fx, fy, r * .9, r * .85, C.rose, { w: 2.4, shade: [C.roseSh, 3, 3], over: q => { q.strokeStyle = C.roseSh; q.lineWidth = 2.4; q.beginPath(); q.arc(fx, fy, r * .4, 0, 5); q.stroke(); } });
    }
  } else if (G) {
    // a gopa: short curly hair with locks by the cheeks, and a turban (pagdi: a wrapped dome, its folds, a little fan at
    // the side) or, bare-headed, a small topknot tied with a red thread; G.feather: a peacock feather peeking out of it
    for (const sd of [-1, 1]) celShape(c, celTube([[sd * 166, -20], [sd * 186, 30], [sd * 176, 80], [sd * 158, 94]], [36, 30, 20, 10]), C.hair, { dense: true, lt: [C.hairLt, -3, 4] });
    const fk = clamp(G.feather || 0), fw = Math.sin(td * 2.2) * .05 + (lag.head || 0) * .3 - (P.head || 0) * .25;
    const feather = (fx, fy, r0) => { if (fk > .02) { c.save(); c.translate(fx, fy); c.rotate(r0 + fw); c.scale(.62 * fk, .62 * fk); celPeacockFeather(c, CEL_KANHA); c.restore(); } };
    if (G.turban) {
      feather(-118, -170, -.55);
      celShape(c, [[-184, -30], [-190, -112], [-156, -184], [-84, -222], [0, -232], [84, -222], [156, -184], [190, -112], [184, -30], [150, -58], [84, -82], [0, -90], [-84, -82], [-150, -58]], G.turban, { shade: [G.turbanSh, 8, 10], lt: [G.turbanLt, 5, 5] });
      for (const [y0, y1, k] of [[-120, -150, 1], [-160, -196, .8]]) celLine(c, [[-176 * k, y0 + 30], [-90 * k, y1 + 6], [0, y1], [90 * k, y1 + 6], [176 * k, y0 + 30]], 3.4, { col: rgba(CEL.ink, .75), boil: .4 });
      celLine(c, [[-150, -70], [-60, -150], [40, -206]], 3.2, { col: rgba(CEL.ink, .6), boil: .4 });
      celShape(c, [[96, -206], [120, -262], [150, -270], [158, -240], [130, -204]], G.turban, { n: 3, w: 4, shade: [G.turbanSh, 4, 4] });   // the fan
      celOval(c, 112, -200, 16, 13, G.turbanSh, { w: 3.5 });
    } else {
      feather(40, -214, .45);
      celShape(c, [[-182, 10], [-180, -72], [-142, -150], [-72, -188], [0, -194], [72, -188], [142, -150], [180, -72], [182, 10], [160, -10], [146, -64], [110, -98], [70, -88], [40, -120], [-6, -112], [-46, -126], [-80, -94], [-118, -100], [-148, -62], [-162, -10]], C.hair, { over: sheen(-80, -160, 90, 34) });
      for (const [cx, cy] of [[-120, -132], [-40, -160], [60, -160], [128, -126]]) celLine(c, [[cx - 14, cy + 6], [cx - 6, cy - 8], [cx + 8, cy - 6], [cx + 6, cy + 6]], 3, { col: rgba(C.hairLt, .9), boil: .4 });
      celOval(c, 0, -206, 44, 34, C.hair, { over: sheen(-14, -220, 36, 18) });
      celLine(c, [[-36, -180], [0, -174], [36, -180]], 9, { under: C.red, taper: 0 });
    }
    if (G.tilak) ellipse(c, 0, -60, 7, 8, G.tilak);
  } else {
    // the curls over his forehead, parted in the middle for the tilak; locks by his cheeks
    celShape(c, [[-182, 10], [-180, -72], [-142, -150], [-72, -188], [0, -194], [72, -188], [142, -150], [180, -72], [182, 10], [162, -6], [152, -58], [122, -72], [104, -112], [62, -104], [38, -142], [0, -150], [-38, -142], [-62, -104], [-104, -112], [-122, -72], [-152, -58], [-162, -6]], C.hair, { over: sheen(-80, -160, 90, 34) });
    for (const [cx, cy] of [[-120, -132], [-60, -160], [70, -158], [128, -126]]) celLine(c, [[cx - 14, cy + 6], [cx - 6, cy - 8], [cx + 8, cy - 6], [cx + 6, cy + 6]], 3, { col: rgba(C.hairLt, .9), boil: .4 });
    for (const sd of [-1, 1]) celShape(c, celTube([[sd * 166, -6], [sd * 192, 46], [sd * 182, 96], [sd * 160, 108]], [40, 34, 24, 12]), C.hair, { dense: true, lt: [C.hairLt, -3, 4] });
    for (const sd of [-1, 1]) { celOval(c, sd * 174, 64, 14, 14, C.gold, { w: 3, boil: .3, over: q => ellipse(q, sd * 174, 64, 5, 5, C.red) }); }
    // the tilak: a white U and the red line in it
    celLine(c, [[-15, -122], [-12, -78], [0, -62], [12, -78], [15, -122]], 11, { under: C.tilak, taper: .25, boil: .4 });
    celLine(c, [[0, -114], [0, -82]], 5, { col: C.red, taper: .3, boil: .3 });
    // the feather (behind the bun), then the topknot with its pearls
    const fw = Math.sin(td * 2) * .05 + (lag.head || 0) * .4 - (P.head || 0) * .3 + (lag.lean || 0) * .5 - lean * .4;
    c.save(); c.translate(26, -214); c.rotate(.38 + fw); celPeacockFeather(c, C); c.restore();
    celOval(c, 0, -200, 64, 46, C.hair, { over: sheen(-20, -220, 50, 24) });
    for (let i = 0; i < 9; i++) { const u = -56 + i * 14; celOval(c, u, -172 - Math.sqrt(Math.max(0, 1 - (u / 64) ** 2)) * 6, 7.5, 7.5, C.pearl, { w: 2.2, boil: .25 }); }
  }
  A.top = at(0, R ? -200 : -250);
  if (!R && (P.mud || 0) > .02) celMudFace(c, clamp(P.mud));
  celFace(c, P, C, { lashes: R, seed: R ? 7 : 0 });
  if (!R && (P.butter || 0) > .02) {
    const b = clamp(P.butter);
    celButter(c, -110, 52, 24 * b, C, 1); celButter(c, 40, 110, 21 * b, C, 2); celButter(c, 6, 54, 12 * b, C, 3); celButter(c, 104, 116, 15 * b, C, 4); celButter(c, -40, 134, 12 * b, C, 5); celButter(c, 120, -60, 16 * b, C, 6);
  }
  if ((P.kajal || 0) > .02) celKajal(c, clamp(P.kajal), R ? 7 : 0);
  if ((P.cry || 0) > .02) celTears(c, clamp(P.cry), td);
  if ((P.sweat || 0) > .02) celSweat(c, -160, -60, clamp(P.sweat) * 1.4);
  if ((P.bubble || 0) > .02 || (P.bubblePop || 0) > 0) celSnot(c, 12 + 40 * (P.bubble || .4), 70 + 18 * (P.bubble || .4), 46 * (P.bubble || 0), P.bubblePop || 0);   // #11: a snot bubble
  c.restore();   // head

  // playing the flute (P.flute 'play'): from just right of the lips, down across the chin toward the screen-left hand (hL),
  // under the arms so both hands hold it; a little red tassel swings from its far end
  if (P.flute === 'play') {
    const h = P.head || 0, lx = 34 * sx, ly = (-138 + 96) * sy, S = [NECK[0] + lx * Math.cos(h) - ly * Math.sin(h), NECK[1] + lx * Math.sin(h) + ly * Math.cos(h)];
    const d = v2.norm(v2.sub(P.hL || [-120, -120], S)), a = v2.add(S, v2.mul(d, -18)), b = v2.add(S, v2.mul(d, 290));
    celFluteAt(c, a, b, C, td);
    A.fluteLip = at(...a); A.fluteEnd = at(...b);
  }

  // the arms, last (they reach across the face); P.armsFirst: before the head (lying with the head turned back upright, #11)
  function arms() { for (const sd of [-1, 1]) {
    const S = [sd * 64, -134], T = (sd < 0 ? P.hL : P.hR) || [sd * 86, -36], [el, wr] = celIK(S, T, 50, 48, (sd < 0 ? P.eL : P.eR) || [sd, .5]);
    celShape(c, celTube([S, el, wr], [44, 38, 34]), C.skin, { dense: true, ...skin });
    if (R) { celBand(c, el, wr, .62, 36, 8, C.red); celBand(c, el, wr, .76, 36, 8, C.gold); } else celBand(c, el, wr, .74, 38, 10, C.gold);
    const d = v2.norm(v2.sub(wr, el)), q = v2.perp(d), hc = v2.add(wr, v2.mul(d, 14)), rot = Math.atan2(d[1], d[0]), kind = (sd < 0 ? P.handL : P.handR) || 'open';
    if (kind === 'point') {
      celShape(c, celTube([hc, v2.add(hc, v2.mul(d, 40))], [16, 13]), C.skin, { dense: true, w: 4 });
      celOval(c, hc[0], hc[1], 21, 19, C.skin, { ...skin, rot });
    } else if (kind === 'fist') celOval(c, hc[0], hc[1], 21, 19, C.skin, { ...skin, rot });
    else if (kind === 'pray') {
      // a flat palm standing up, fingers to the sky: two of them side by side (hL ≈ [-14, -96], hR ≈ [14, -96]) are folded hands
      const px = hc[0] - sd * 4, py = hc[1] - 18;
      celShape(c, [[px - sd * 15, py + 22], [px - sd * 16, py - 8], [px - sd * 9, py - 34], [px - sd * 1, py - 38], [px + sd * 2, py - 6], [px + sd * 1, py + 24]], C.skin, { n: 4, w: 4.5, shade: [C.sh, -sd * 5, 4] });
      celLine(c, [[px - sd * 13, py - 4], [px - sd * 4, py - 10]], 2.6, { boil: .3 });
    }
    else {
      const th = v2.add(v2.add(wr, v2.mul(d, 8)), v2.mul(q, 18 * (d[1] * sd > 0 ? -1 : 1) * sd));
      celOval(c, th[0], th[1], 11, 8, C.skin, { rot: rot - .6, w: 4 });
      celOval(c, hc[0] + d[0] * 4, hc[1] + d[1] * 4, 24, 18, C.skin, { ...skin, rot });
      if (kind === 'butter') celButter(c, hc[0] + d[0] * 6, hc[1] + d[1] * 6 - 18, 20, C, 9);
    }
    A[sd < 0 ? 'handL' : 'handR'] = at(...hc);
  } };
  if (!P.armsFirst) arms();
  c.restore();   // upper body
  c.restore();
  return A;
}

// a peacock feather, its quill's end at (0, 0), pointing up (about 214 px long); C a palette with Kanha's feather colours
function celPeacockFeather(c, C = CEL_KANHA) {
  celShape(c, [[0, 6], [-20, -60], [-30, -130], [-16, -196], [0, -214], [16, -196], [30, -130], [20, -60]], C.feather, { w: 4, shade: ['#2A7444', 6, 4], over: q => {
    q.strokeStyle = rgba(C.featherLt, .9); q.lineWidth = 2.5; for (let i = 0; i < 9; i++) { const yy = -30 - i * 18; q.beginPath(); q.moveTo(0, yy); q.lineTo(-22, yy - 14); q.moveTo(0, yy); q.lineTo(22, yy - 14); q.stroke(); }
    ellipse(q, 0, -158, 22, 28, C.fEye1); ellipse(q, 0, -156, 15, 20, C.fEye2); ellipse(q, 0, -152, 8, 11, C.fEye3);
  } });
  celLine(c, [[0, 4], [0, -150]], 3, { col: '#1E5A34', taper: .3, boil: .4 });
}

// ---------- a little monkey ----------
const CEL_MONKEY = { fur: '#9A6438', furSh: '#734626', furLt: '#C08A58', face: '#F4CDA4', faceSh: '#E0A880', ear: '#F2A6A0', iris: '#1E1410', iris2: '#6A4024', blush: '#F68A9A', mouth: '#5A1E26', tongue: '#F27C90' };
function celMonkey(c, x, y, s, P, o = {}) {
  const C = { ...CEL_MONKEY, ...(o.pal || {}) }, td = P.td ?? o.t ?? 0, A = {};
  const fur = { shade: [C.furSh, 6, 8], lt: [C.furLt, 4, 4] };
  celBegin(td); CEL.n = o.seed ?? 900;
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, hop = P.hop || 0;
  c.save(); c.translate(x, y - hop); c.scale(s, s);
  c.save(); c.translate(0, -40); c.rotate(P.lean || 0); c.scale(1 + hit * .06, 1 - hit * .08); c.translate(0, 40 + hit * 6);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  // the tail, curling up behind
  const ts = Math.sin(td * 2.4) * 12;
  celShape(c, celTube([[30, -46], [96, -60], [124 + ts * .3, -120], [104 + ts, -168], [76 + ts, -160], [80 + ts * .8, -136]], [26, 22, 20, 18, 14, 10]), C.fur, { dense: true, ...fur });
  // feet and legs
  for (const sd of [-1, 1]) { celShape(c, celTube([[sd * 26, -60], [sd * 32, -14]], [40, 34]), C.fur, { dense: true, ...fur }); celOval(c, sd * 38, -4, 28, 14, C.face, { w: 4, shade: [C.faceSh, 4, 4] }); }
  celShape(c, [[-50, -24], [-58, -90], [-40, -140], [0, -150], [40, -140], [58, -90], [50, -24], [0, -14]], C.fur, fur);
  celOval(c, 0, -76, 32, 42, C.face, { w: 4, shade: [C.faceSh, 4, 6] });
  // the head
  c.save(); c.translate(0, -150); c.rotate(P.head || 0); c.translate(0, -88);
  for (const sd of [-1, 1]) { celOval(c, sd * 104, -6, 34, 32, C.fur, fur); ellipse(c, sd * 104, -4, 19, 18, C.ear); }
  celShape(c, celEll(0, 0, 104, 96), C.fur, { dense: true, ...fur });
  celShape(c, [[-6, -98], [-22, -126], [0, -112], [14, -132], [16, -104]], C.fur, { n: 2, w: 4, boil: .5 });
  celShape(c, [[-84, -14], [-74, -58], [-38, -64], [0, -44], [38, -64], [74, -58], [84, -14], [74, 42], [0, 82], [-74, 42]], C.face, { shade: [C.faceSh, 5, 7] });
  celFace(c, P, C, { face: { ex: 38, ey: -10, my: 54, bx: 62, by: 30, k: .62 }, seed: 11 });
  for (const sd of [-1, 1]) ellipse(c, sd * 7, 26, 3.5, 4.5, CEL.ink);
  A.head = at(0, 0); A.top = at(0, -110);
  c.restore();
  if (P.pot) celMatki(c, 0, -26, .78, { empty: P.potEmpty });
  // arms
  for (const sd of [-1, 1]) {
    const S = [sd * 46, -124], T = (sd < 0 ? P.hL : P.hR) || (P.pot ? [sd * 46, -96] : [sd * 64, -44]), [el, wr] = celIK(S, T, 40, 40, (sd < 0 ? P.eL : P.eR) || [sd, .5]);
    celShape(c, celTube([S, el, wr], [30, 26, 24]), C.fur, { dense: true, ...fur });
    const d = v2.norm(v2.sub(wr, el)), hc = v2.add(wr, v2.mul(d, 10)), kind = (sd < 0 ? P.handL : P.handR) || 'open';
    if (kind === 'point') celShape(c, celTube([hc, v2.add(hc, v2.mul(d, 30))], [12, 10]), C.face, { dense: true, w: 3.5 });
    celOval(c, hc[0], hc[1], 16, 14, C.face, { w: 4, rot: Math.atan2(d[1], d[0]) });
    A[sd < 0 ? 'handL' : 'handR'] = at(...hc);
  }
  c.restore(); c.restore();
  return A;
}

// ---------- the cosmos (the universe in Kanha's mouth, Bhagavata 10.8.36–39) ----------
// Effects, not drawings: the stars twinkle at the full frame rate (T); the bodies are cel-inked and boil with CEL.d.
const CEL_SPACE = { top: '#120C34', mid: '#2A1A66', bot: '#170F3E', star: '#FFF6D8' };
// a small cosmos inside a clipped shape (Kanha's open mouth), a its opacity
function celSpaceIn(q, x, y, r, a = 1) {
  q.save(); q.globalAlpha *= a;
  const g = q.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, '#8A6AF0'); g.addColorStop(.4, '#3A2688'); g.addColorStop(1, '#120C34');
  q.fillStyle = g; q.fillRect(x - r * 2, y - r * 2, r * 4, r * 4);
  q.globalCompositeOperation = 'lighter';
  for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 14; i++) { const u = i / 14, an = arm * Math.PI + u * 3.4 + T * .8, rr = r * .5 * u; ellipse(q, x + Math.cos(an) * rr, y + Math.sin(an) * rr * .6, r * .05 * (1.2 - u), r * .05 * (1.2 - u), 'rgba(255,190,240,.7)'); }
  for (let i = 0; i < 12; i++) { const an = hash(i * 3.1) * TAU, rr = r * (.2 + .75 * hash(i * 7.7)), tw = .5 + .5 * Math.sin(T * 7 + i * 2.3), s = r * (.025 + .035 * hash(i + .5)) * (.6 + tw * .7); ellipse(q, x + Math.cos(an) * rr, y + Math.sin(an) * rr * .8, s, s, CEL_SPACE.star); }
  q.restore();
}
// deep space over the whole frame (w × h): a gradient, nebulae and twinkling stars
function celSpace(c, t, o = {}) {
  const w = o.w ?? W, h = o.h ?? H;
  let g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, CEL_SPACE.top); g.addColorStop(.45, CEL_SPACE.mid); g.addColorStop(1, CEL_SPACE.bot); c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (const [x, y, r, col, a] of [[200, 380, 460, '#FF6FB0', .22], [880, 1280, 520, '#3FD6C8', .15], [560, 900, 620, '#8A5CFF', .24], [900, 300, 380, '#FFB86B', .12], [150, 1600, 440, '#6F8CFF', .2]]) {
    const gg = c.createRadialGradient(x * w / 1080, y * h / 1920, 0, x * w / 1080, y * h / 1920, r); gg.addColorStop(0, rgba(col, a)); gg.addColorStop(1, rgba(col, 0)); c.fillStyle = gg; c.fillRect(0, 0, w, h);
  }
  for (let i = 0; i < 240; i++) {
    const x = hash(i * 1.37) * w, y = hash(i * 2.71 + 5) * h, s = .9 + 2.8 * hash(i * .91 + 2) ** 3, tw = .55 + .45 * Math.sin(t * (2 + hash(i) * 4) + i);
    c.globalAlpha = tw; ellipse(c, x, y, s, s, i % 7 === 0 ? '#FFE3A8' : i % 5 === 0 ? '#BFE2FF' : '#FFFFFF');
  }
  c.globalAlpha = 1;
}
// a spiral galaxy: two arms of glowing dots round a bright core (additive)
function celGalaxy(c, x, y, r, rot = 0, a = 1) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, .5); c.globalAlpha *= a; c.globalCompositeOperation = 'lighter';
  let g = c.createRadialGradient(0, 0, 0, 0, 0, r * .4); g.addColorStop(0, 'rgba(255,240,220,.9)'); g.addColorStop(.4, 'rgba(255,150,210,.35)'); g.addColorStop(1, 'rgba(255,150,210,0)'); c.fillStyle = g; c.fillRect(-r, -r, 2 * r, 2 * r);
  for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 70; i++) {
    const u = i / 70, an = arm * Math.PI + u * 3.8 + (hash(i + arm * 99) - .5) * .3, rr = r * (.08 + .92 * u) * (1 + (hash(i * 3 + arm) - .5) * .18), s = r * .045 * (1.1 - u * .7);
    ellipse(c, Math.cos(an) * rr, Math.sin(an) * rr, s, s, `rgba(${u < .5 ? '255,200,235' : '190,170,255'},${.75 * (1 - u * .7)})`);
  }
  c.restore();
}
// a little face for the planets, k ≈ r / 45: 'open' (shiny dots), 'happy' (^ ^), 'sleep' (‿ ‿)
function celMiniFace(c, x, y, k, kind = 'open', blush = '#FF7FA8') {
  for (const sd of [-1, 1]) {
    const ex = x + sd * 18 * k, ey = y;
    if (kind === 'happy') celLine(c, [[ex - 7 * k, ey + 3 * k], [ex, ey - 5 * k], [ex + 7 * k, ey + 3 * k]], 3.4 * k, { taper: .3, boil: .4 });
    else if (kind === 'sleep') celLine(c, [[ex - 7 * k, ey - 1 * k], [ex, ey + 5 * k], [ex + 7 * k, ey - 1 * k]], 3.4 * k, { taper: .3, boil: .4 });
    else if (kind === 'dizzy') { const sp = []; for (let i = 0; i <= 14; i++) { const a = i / 14 * TAU * 1.8 + sd * CEL.d, r = (1.5 + i * .55) * k; sp.push([ex + Math.cos(a) * r, ey + Math.sin(a) * r]); } celLine(c, sp, 3 * k, { taper: .2, boil: .3 }); }
    else if (kind === 'flat') celLine(c, [[ex - 7 * k, ey], [ex + 7 * k, ey]], 3.4 * k, { taper: .3, boil: .4 });
    else { ellipse(c, ex, ey, 5.5 * k, 7.5 * k, CEL.ink); ellipse(c, ex - 1.8 * k, ey - 2.8 * k, 2.3 * k, 2.5 * k, '#FFFFFF'); }
    c.save(); c.globalAlpha = .6; ellipse(c, x + sd * 29 * k, y + 10 * k, 7.5 * k, 4.2 * k, blush); c.restore();
  }
  celLine(c, [[x - 5 * k, y + 8 * k], [x, y + 12 * k], [x + 5 * k, y + 8 * k]], 2.8 * k, { taper: .3, boil: .4 });
}
// a planet: o.col / sh / lt, o.ring (a ring's colour), o.band (stripes), o.face, o.rot
function celPlanet(c, x, y, r, o = {}) {
  const col = o.col || '#F59A5A', sh = o.sh || '#D06A36', lt = o.lt || '#FFC89A', w = Math.max(3.2, r * .09);
  c.save(); c.translate(x, y); c.rotate(o.rot || 0);
  const arc = (a0, a1) => { const P = []; for (let i = 0; i <= 18; i++) { const a = lerp(a0, a1, i / 18); P.push([Math.cos(a) * r * 1.75, Math.sin(a) * r * .42]); } return P; };
  if (o.ring) celLine(c, arc(Math.PI, TAU), r * .3, { under: o.ring, taper: 0, boil: .5 });
  celOval(c, 0, 0, r, r, col, { w, shade: [sh, r * .16, r * .16], lt: [lt, r * .08, r * .08], over: q => {
    if (o.band) { q.fillStyle = o.band; for (const [by, bh] of [[-.42, .1], [.12, .16], [.5, .08]]) q.fillRect(-r, r * by, 2 * r, r * bh); }
    if (o.craters) for (const [cx, cy, cr] of [[.35, -.35, .16], [-.45, .25, .12], [.3, .5, .1]]) ellipse(q, r * cx, r * cy, r * cr, r * cr * .8, rgba(sh, .7));
    ellipse(q, -r * .42, -r * .45, r * .2, r * .13, 'rgba(255,255,255,.85)', -.6);
  } });
  if (o.face) celMiniFace(c, 0, r * .05, r / 45, o.face, o.blush);
  if (o.ring) celLine(c, arc(0, Math.PI), r * .3, { under: o.ring, taper: 0, boil: .5 });
  c.restore();
}
// the sun with a happy face and turning rays, the moon asleep
function celSun(c, x, y, r, t, o = {}) {
  glow(c, x, y, r * 2.6, '#FFC94A', .5);
  c.save(); c.translate(x, y); c.rotate(t * .25);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, l = r * (i % 2 ? 1.42 : 1.6); celShape(c, [[Math.cos(a - .16) * r * .9, Math.sin(a - .16) * r * .9], [Math.cos(a) * l, Math.sin(a) * l], [Math.cos(a + .16) * r * .9, Math.sin(a + .16) * r * .9]], i % 2 ? '#FFB43A' : '#FFD54A', { n: 2, w: Math.max(3, r * .06), boil: .5 }); }
  c.restore();
  celPlanet(c, x, y, r, { col: '#FFD84A', sh: '#F4A62C', lt: '#FFF1A6', face: o.face || 'happy', blush: '#FF8A5A' });
}
function celMoon(c, x, y, r, o = {}) { celPlanet(c, x, y, r, { col: '#FFF0BE', sh: '#E8CF8A', lt: '#FFFBE6', craters: 1, face: o.face || 'sleep', blush: '#FFA6B8' }); }
// the earth with Vraja on it: blue, green land, a cloud, a hut with a thatched roof and a kadamba tree on top.
// Returns the point on top where a tiny figure stands. o.spin turns the land under the clipped disc.
function celEarth(c, x, y, r, t, o = {}) {
  glow(c, x, y, r * 2, '#7FD4FF', .35);
  const sp = o.spin ?? t * .12;
  // the tree and the hut sit on the rim (behind the disc's ink), drawn first so the globe's edge overlaps their feet
  const onRim = (a, f) => { c.save(); c.translate(x + Math.cos(a) * r * .94, y + Math.sin(a) * r * .94); c.rotate(a + Math.PI / 2); f(); c.restore(); };
  const k = r / 90;
  onRim(-Math.PI / 2 - .78, () => {   // the kadamba: a trunk, a round crown, little orange flower-balls
    celShape(c, [[-7 * k, 4 * k], [-6 * k, -34 * k], [6 * k, -34 * k], [7 * k, 4 * k]], '#8A5A34', { n: 2, w: 3, boil: .4 });
    celOval(c, 0, -52 * k, 30 * k, 26 * k, '#4FA852', { w: 3.5, shade: ['#2F7E3C', 5 * k, 5 * k], over: q => { for (let i = 0; i < 6; i++) ellipse(q, (hash(i * 3) - .5) * 40 * k, -52 * k + (hash(i * 5 + 1) - .5) * 30 * k, 4.5 * k, 4.5 * k, '#FFB03A'); } });
  });
  onRim(-Math.PI / 2 + .78, () => {   // the hut: mud walls, a thatched roof, a dark door
    celShape(c, [[-20 * k, 4 * k], [-20 * k, -26 * k], [20 * k, -26 * k], [20 * k, 4 * k]], '#E8B98A', { n: 2, w: 3, boil: .4, shade: ['#C99466', 4 * k, 0], over: q => ellipse(q, 0, -6 * k, 6 * k, 10 * k, '#5A3420') });
    celShape(c, [[-30 * k, -22 * k], [0, -50 * k], [30 * k, -22 * k]], '#D6A043', { n: 3, w: 3, boil: .4, shade: ['#A87528', 0, 4 * k] });
  });
  celOval(c, x, y, r, r, '#4FB2EC', { w: Math.max(3.5, r * .05), shade: ['#2F82C6', r * .14, r * .14], lt: ['#9ADCFA', r * .07, r * .07], over: q => {
    const land = (lx, ly, lr, s2) => { const P = []; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = lr * (.75 + .4 * hash(i + s2 * 9)); P.push([x + lx + Math.cos(a) * rr, y + ly + Math.sin(a) * rr * .8]); } q.fillStyle = '#6CC45A'; q.beginPath(); P.forEach((p, i) => i ? q.lineTo(...p) : q.moveTo(...p)); q.closePath(); q.fill(); };
    for (const [lx, ly, lr, s2] of [[-.35, -.15, .5, 1], [.48, .32, .36, 2], [.08, -.66, .44, 3], [-.15, .64, .3, 4], [.9, -.4, .3, 5]]) { const u = ((lx + sp) % 2.4 + 2.4) % 2.4 - 1.2; land(u * r, ly * r, lr * r, s2); }
    q.strokeStyle = '#7FD0FF'; q.lineWidth = r * .06; q.beginPath(); for (let i = 0; i <= 12; i++) { const u = i / 12; q.lineTo(x + (u - .5) * r * 1.4, y + r * .1 + Math.sin(u * 9 + sp * 3) * r * .08); } q.stroke();   // the Yamuna
    ellipse(q, x - r * .2, y - r * .3, r * .22, r * .08, 'rgba(255,255,255,.85)'); ellipse(q, x + r * .35, y + r * .55, r * .18, r * .06, 'rgba(255,255,255,.75)');
    ellipse(q, x - r * .45, y - r * .5, r * .16, r * .1, 'rgba(255,255,255,.7)', -.6);
  } });
  return [x, y - r * .97];
}
// a clod of mud with a tuft of grass, r its size
function celClod(c, x, y, r, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  for (const [a, l] of [[-.35, 1.0], [0, 1.25], [.32, .9]]) celShape(c, [[Math.sin(a) * r * .5 - r * .07, -r * .7], [Math.sin(a) * r * 1.2 * l, -r * (.7 + .75 * l)], [Math.sin(a) * r * .5 + r * .07, -r * .7]], '#5DB54E', { n: 3, w: Math.max(2.5, r * .06), boil: .4 });
  const P = []; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = r * (.82 + .3 * hash(i * 2.3 + 1)); P.push([Math.cos(a) * rr, Math.sin(a) * rr * .86]); }
  celShape(c, P, '#93603A', { n: 4, w: Math.max(3.5, r * .09), shade: ['#6A3E1E', r * .16, r * .18], lt: ['#B98250', r * .08, r * .08], over: q => {
    for (let i = 0; i < 6; i++) ellipse(q, (hash(i * 4.1) - .5) * r * 1.3, (hash(i * 6.3 + 2) - .5) * r * 1.1, r * .08, r * .065, '#5A3016');
    ellipse(q, r * .25, r * .3, r * .14, r * .11, '#B9A08A'); ellipse(q, -r * .35, -r * .32, r * .2, r * .12, 'rgba(255,255,255,.5)', -.5);
  } });
  c.restore();
}

// ---------- Govardhan and Indra's rain (Bhagavata 10.25) ----------
// the hill lifted off the ground, (x, y) the middle of its underside, r its half width: a green dome with trees, rocks
// and flowers, the torn-up rock and earth underneath with roots hanging from it
function celGovardhan(c, x, y, r, t = 0) {
  const k = r / 100, w = Math.max(3, 4.5 * k);
  c.save(); c.translate(x, y);
  // the underside: rock and earth, roots dangling
  const U = []; for (let i = 0; i <= 10; i++) { const u = i / 10, a = Math.PI * u; U.push([-Math.cos(a) * 100 * k, Math.sin(a) * (26 + 10 * hash(i * 2.3)) * k]); }
  celShape(c, [[-100 * k, -6 * k], ...U, [100 * k, -6 * k]], '#9A6A44', { n: 3, w, shade: ['#6E4426', 0, -8 * k], over: q => {
    for (const [rx, ry, rr] of [[-50, 10, 9], [10, 18, 11], [55, 8, 8], [-15, 4, 6]]) ellipse(q, rx * k, ry * k, rr * k, rr * k * .7, '#B9A48E');
  } });
  for (const [rx, l, sw] of [[-60, 26, 1], [-22, 36, -1], [24, 30, 1], [64, 22, -1]]) {
    const ph = Math.sin(t * 2.4 + rx) * 3 * k;
    celLine(c, [[rx * k, 22 * k], [(rx + sw * 6) * k + ph, (22 + l * .5) * k], [(rx - sw * 2) * k + ph * 1.6, (22 + l) * k]], Math.max(2, 3 * k), { col: '#6E4426', taper: .7, boil: .5 });
  }
  // the hill itself
  const D = []; for (let i = 0; i <= 16; i++) { const u = i / 16, a = Math.PI * u; D.push([-Math.cos(a) * 104 * k, -Math.sin(a) * (78 + 8 * Math.sin(u * 9)) * k - 2 * k]); }
  celShape(c, [...D, [104 * k, 4 * k], [-104 * k, 4 * k]], '#6CC05A', { n: 3, w, shade: ['#3F9446', 12 * k, 10 * k], lt: ['#9ADE7A', 6 * k, 6 * k], over: q => {
    for (const [fx, fy] of [[-62, -22], [-30, -50], [40, -38], [72, -16], [4, -14]]) { ellipse(q, fx * k, fy * k, 5 * k, 5 * k, '#FFFFFF'); ellipse(q, fx * k, fy * k, 2.2 * k, 2.2 * k, '#FFC83A'); }
  } });
  for (const [rx, ry, rr] of [[-74, -10, 13], [58, -6, 15]]) celOval(c, rx * k, ry * k, rr * k, rr * k * .72, '#B8B4C4', { w: Math.max(2.5, 3.5 * k), shade: ['#8C88A0', 0, 4 * k] });
  // trees on top: round crowns on little trunks, kadamba flower-balls on the middle one
  for (const [tx, ty, tr, fl] of [[-46, -66, 24, 0], [6, -84, 30, 1], [54, -64, 22, 0]]) {
    celShape(c, [[(tx - 4) * k, (ty + 6) * k], [(tx - 3) * k, (ty - tr * .6) * k], [(tx + 3) * k, (ty - tr * .6) * k], [(tx + 4) * k, (ty + 6) * k]], '#8A5A34', { n: 2, w: Math.max(2, 3 * k), boil: .4 });
    celOval(c, tx * k, (ty - tr * 1.1) * k, tr * k, tr * .9 * k, fl ? '#4FA852' : '#5DB55A', { w, shade: ['#2F7E3C', 5 * k, 5 * k], over: fl ? q => { for (let i = 0; i < 5; i++) ellipse(q, (tx + (hash(i * 3) - .5) * tr * 1.3) * k, (ty - tr * 1.1 + (hash(i * 5 + 1) - .5) * tr) * k, 3.6 * k, 3.6 * k, '#FFB03A'); } : null });
  }
  c.restore();
}
// a fat rain cloud, (x, y) its middle, r its half width; o.face 'grumpy' (Indra's clouds) | 'happy' | null, o.col
function celRainCloud(c, x, y, r, o = {}) {
  const P = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, top = Math.sin(a) < 0, b = top ? 1 + .16 * Math.abs(Math.sin(a * 3.5)) : 1; P.push([Math.cos(a) * r * b, Math.sin(a) * r * (top ? .62 : .4) * b]); }
  c.save(); c.translate(x, y);
  celShape(c, P, o.col || '#8E98BC', { dense: true, w: Math.max(3, r * .05), shade: [o.sh || '#6C759C', 0, r * .1], lt: ['#B8C0DC', r * .05, r * .06] });
  const k = r / 90;
  if (o.face === 'grumpy') {
    for (const sd of [-1, 1]) {
      ellipse(c, sd * 24 * k, 2 * k, 5 * k, 6.5 * k, CEL.ink); ellipse(c, sd * 24 * k - 1.5 * k, -.5 * k, 2 * k, 2.2 * k, '#FFFFFF');
      celLine(c, [[sd * 36 * k, -14 * k], [sd * 12 * k, -6 * k]], 4 * k, { taper: .2, boil: .4 });
    }
    celLine(c, [[-11 * k, 22 * k], [0, 16 * k], [11 * k, 22 * k]], 3.4 * k, { taper: .3, boil: .4 });
    c.save(); c.globalAlpha = .45; for (const sd of [-1, 1]) ellipse(c, sd * 40 * k, 14 * k, 8 * k, 4.5 * k, '#C86A8A'); c.restore();
  } else if (o.face) celMiniFace(c, 0, 4 * k, k, o.face);
  c.restore();
}
// rain over the box x0..x1, y0..y1: slanted blue streaks falling at the full frame rate, little splashes at y1 (a number
// or a function of x). o.n streaks, o.a alpha, o.slant
function celRain(c, x0, x1, y0, y1, t, o = {}) {
  const n = o.n ?? 26, a = o.a ?? 1, sl = o.slant ?? .18, yb = typeof y1 === 'function' ? y1 : () => y1;
  if (a <= .01) return;
  c.save(); c.globalAlpha *= a; c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + hash(i * 1.7)) / n), bot = yb(x), span = bot - y0, sp = 1.4 + hash(i * 3.1) * .5, u = (t * sp + hash(i * 5.3)) % 1, yy = y0 + u * span, l = Math.min(26, span * .25);
    c.strokeStyle = 'rgba(90,150,230,.85)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - sl * (yy - y0), yy); c.lineTo(x - sl * (yy - y0) + sl * l, yy - l); c.stroke();
    const s = (t * sp + hash(i * 5.3) + .5) % 1;
    if (s < .18) { const xs = x - sl * span, e = s / .18; c.strokeStyle = `rgba(110,170,240,${.8 * (1 - e)})`; c.lineWidth = 3; for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(xs + sd * 4, bot - 2); c.lineTo(xs + sd * (6 + 12 * e), bot - 6 - 10 * e); c.stroke(); } }
  }
  c.restore();
}

// ---------- a Vishnu shrine, its murti, a plate of ladoos ----------
const CEL_LADOO = { col: '#F7A72C', sh: '#D67C12', lt: '#FFD370', dot: '#E08A1A' };
function celLadoo(c, x, y, r, o = {}) {
  const P = []; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = r * (.95 + .08 * hash(i * 1.9 + (o.seed || 0))); P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * .94]); }
  celShape(c, P, CEL_LADOO.col, { n: 4, w: Math.max(2.5, r * .12), boil: .4, shade: [CEL_LADOO.sh, r * .18, r * .2], lt: [CEL_LADOO.lt, r * .1, r * .1], over: q => {
    for (let i = 0; i < 9; i++) { const a = hash(i * 3.3 + (o.seed || 0)) * TAU, d = Math.sqrt(hash(i * 7.1 + 2)) * r * .8; ellipse(q, x + Math.cos(a) * d, y + Math.sin(a) * d, r * .09, r * .09, CEL_LADOO.dot); }   // boondi
    ellipse(q, x - r * .34, y - r * .36, r * .22, r * .15, 'rgba(255,255,255,.75)', -.6);
  } });
}
// a tulsi sprig: two leaves and a little stem
function celTulsi(c, x, y, k = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  celLine(c, [[0, 6], [0, -10]], 3, { col: '#2E6E34', boil: .3 });
  for (const sd of [-1, 1]) celShape(c, [[0, -6], [sd * 12, -22], [sd * 26, -20], [sd * 22, -6], [sd * 8, -2]], '#4BAA55', { n: 4, w: 3, boil: .3, shade: ['#2F8040', sd * 3, 3], over: q => celLine(q, [[sd * 2, -6], [sd * 18, -16]], 1.6, { col: 'rgba(30,80,40,.6)', ink: false }) });
  c.restore();
}
// a brass plate with a pile of ladoos (n of them: 3 + 2 + 1), tulsi on the top one; (x, y) the plate's middle
function celThali(c, x, y, s = 1, o = {}) {
  const n = o.n ?? 6;
  c.save(); c.translate(x, y); c.rotate(o.tilt || 0); c.scale(s, s);
  celOval(c, 0, 0, 118, 30, '#E9B23C', { w: 4.5, shade: ['#B98220', 0, 7], over: q => {
    q.strokeStyle = 'rgba(160,100,20,.55)'; q.lineWidth = 3; q.beginPath(); q.ellipse(0, -2, 92, 21, 0, 0, TAU); q.stroke();
    ellipse(q, -54, -10, 26, 5, 'rgba(255,248,210,.7)', -.05);
  } });
  const L = [[-46, -20, 0], [46, -20, 1], [0, -16, 2], [-23, -54, 3], [23, -54, 4], [0, -88, 5]];
  for (let i = 0; i < Math.min(n, 6); i++) celLadoo(c, L[i][0], L[i][1], 26, { seed: L[i][2] });
  if (n >= 6) celTulsi(c, 0, -114, 1, .1);
  // a marigold on the rim
  celOval(c, 92, -6, 13, 10, '#FF9B1E', { w: 3, boil: .3, over: q => { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ellipse(q, 92 + Math.cos(a) * 6, -6 + Math.sin(a) * 4.5, 3, 2.5, '#FFC23A'); } } });
  c.restore();
}

// a small Vishnu murti, standing on a lotus, feet at (x, y), about 250 px tall at s = 1; the kids' blue and face (smiling
// lidded, looking down at the offering); upper hands: the chakra (screen left, his right) and the shankh, lower: a lotus
// and the gada. o.glow 0..1 the prabhavali lights up
function celVishnuMurti(c, x, y, s = 1, t = 0, o = {}) {
  const C = CEL_KANHA, sk = { shade: [C.sh, 4, 5], lt: [C.lt, 3, 3] }, g = o.glow || 0, ik = CEL.inkK;
  c.save(); c.translate(x, y); c.scale(s, s); CEL.inkK = (ik ?? 1) * .75;
  // the prabhavali: a gold arch behind him, with flames along it
  const arch = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * (1 + i / 24); arch.push([Math.cos(a) * 92, -132 + Math.sin(a) * 140]); }
  if (g > .02) glow(c, 0, -160, 220, '#FFE7A0', .7 * g);
  celShape(c, [[-92, -20], ...arch, [92, -20], [74, -20], ...arch.map(([a, b]) => [a * .8, -132 + (b + 132) * .82]).reverse(), [-74, -20]], '#F2B52E', { n: 3, w: 3.5, shade: ['#C98A1A', 3, 4] });
  for (let i = 1; i < 24; i += 2) { const a = Math.PI * (1 + i / 24); celShape(c, [[Math.cos(a) * 92, -132 + Math.sin(a) * 140], [Math.cos(a) * 110, -132 + Math.sin(a) * 160], [Math.cos(a + .06) * 94, -132 + Math.sin(a + .06) * 142]], '#F7C744', { n: 2, w: 2.5, boil: .3 }); }
  // the lotus pedestal
  for (const [px, w, col] of [[-36, 30, '#F57DA8'], [36, 30, '#F57DA8'], [-14, 28, '#FF9CC0'], [14, 28, '#FF9CC0'], [0, 26, '#FFB6D0']]) celShape(c, [[px - w, -4], [px - w * .5, -30], [px, -40], [px + w * .5, -30], [px + w, -4], [px, 2]], col, { n: 3, w: 3, shade: ['#D6528A', 3, 3] });
  // the arms behind: upper ones raised, holding the chakra (spinning) and the shankh
  const arm = (S, H) => celShape(c, celTube([S, v2.lerp(S, H, .5), H], [22, 19, 17]), C.skin, { dense: true, w: 3.5, ...sk });
  arm([-26, -142], [-70, -186]); arm([26, -142], [70, -186]);
  celOval(c, -70, -186, 11, 10, C.skin, { w: 3 }); celOval(c, 70, -186, 11, 10, C.skin, { w: 3 });
  c.save(); c.translate(-74, -212); c.rotate(t * 1.6);
  if (g > .02) glow(c, 0, 0, 50, '#FFE08A', .6 * g);
  celOval(c, 0, 0, 22, 22, '#F7C744', { w: 3, shade: ['#D89A22', 2, 3], over: q => { q.strokeStyle = '#C47A18'; q.lineWidth = 2.5; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; q.beginPath(); q.moveTo(0, 0); q.lineTo(Math.cos(a) * 16, Math.sin(a) * 16); q.stroke(); } ellipse(q, 0, 0, 5, 5, '#E2452B'); } });
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; celShape(c, [[Math.cos(a - .18) * 21, Math.sin(a - .18) * 21], [Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a + .18) * 21, Math.sin(a + .18) * 21]], '#F7C744', { n: 2, w: 2.2, boil: .2 }); }
  c.restore();
  celShape(c, [[60, -196], [70, -226], [82, -232], [92, -220], [88, -200], [76, -190]], '#FFF8EC', { n: 4, w: 3, shade: ['#E2D2BC', 3, 3], over: q => { q.strokeStyle = 'rgba(160,130,100,.7)'; q.lineWidth = 2; q.beginPath(); q.arc(80, -214, 7, 0, 5); q.stroke(); } });
  // the dhoti (yellow) and the body
  celShape(c, [[-34, -104], [-40, -60], [-44, -30], [0, -26], [44, -30], [40, -60], [34, -104]], C.pit, { n: 3, w: 3.5, shade: [C.pitSh, 4, 4], lt: [C.pitLt, 3, 3], over: q => { q.strokeStyle = C.border; q.lineWidth = 8; q.beginPath(); q.moveTo(-44, -33); q.lineTo(0, -29); q.lineTo(44, -33); q.stroke(); } });
  celShape(c, [[-30, -100], [-36, -130], [-26, -152], [0, -156], [26, -152], [36, -130], [30, -100], [0, -96]], C.skin, { n: 3, w: 3.5, ...sk });
  celLine(c, [[-36, -104], [0, -100], [36, -104]], 7, { under: C.gold, taper: 0 });
  // the mala and the kaustubha gem
  for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; celOval(c, -28 * Math.cos(a), -150 + 52 * Math.sin(a), 5, 5, C.mala[i % 4], { w: 1.8, boil: .2 }); }
  celOval(c, 0, -134, 6, 7, '#E2452B', { w: 2.2, boil: .2, over: q => ellipse(q, -2, -136, 2, 2, '#FFFFFF') });
  // the lower arms: a lotus (screen left), the gada standing by him (screen right)
  arm([-30, -140], [-48, -96]); arm([30, -140], [48, -96]);
  celShape(c, celTube([[62, -132], [62, -30]], [8, 8]), '#E9B23C', { dense: true, w: 3 });
  celOval(c, 62, -140, 16, 16, '#F2B52E', { w: 3, shade: ['#C98A1A', 3, 3], over: q => ellipse(q, 57, -145, 4, 4, '#FFF2C0') });
  celOval(c, 48, -92, 10, 9, C.skin, { w: 3 });
  for (const [dx, a] of [[-10, -.5], [0, 0], [10, .5]]) celShape(c, [[-52 + dx * .3, -100], [-52 + dx - 7, -116], [-52 + dx, -128], [-52 + dx + 7, -116]].map(([px, py]) => [px, py]), '#FF8CB4', { n: 3, w: 2.5, boil: .3 });
  celOval(c, -48, -94, 10, 9, C.skin, { w: 3 });
  // the head: the kids' face, smaller, with the kirita
  c.save(); c.translate(0, -196);
  for (const sd of [-1, 1]) celShape(c, celTube([[sd * 36, -6], [sd * 44, 18], [sd * 38, 34]], [12, 10, 6]), C.hair, { dense: true, w: 3 });
  celShape(c, [[-36, -24], [-16, -38], [0, -40], [16, -38], [36, -24], [42, 4], [36, 26], [16, 38], [0, 40], [-16, 38], [-36, 26], [-42, 4]], C.skin, { w: 3.5, shade: [C.sh, 3, 4], lt: [C.lt, 2, 2] });
  celShape(c, [[-38, -10], [-36, -30], [-20, -42], [0, -44], [20, -42], [36, -30], [38, -10], [30, -18], [0, -24], [-30, -18]], C.hair, { n: 3, w: 3 });
  // the kirita: a tall gold crown with a jewel and a peak
  celShape(c, [[-34, -26], [-30, -72], [-20, -92], [0, -110], [20, -92], [30, -72], [34, -26], [0, -32]], '#F2B52E', { n: 3, w: 3.2, shade: ['#C98A1A', 4, 3], lt: ['#FFE48E', 2, 2], over: q => {
    q.strokeStyle = '#C98A1A'; q.lineWidth = 2.5; for (const yy of [-40, -62]) { q.beginPath(); q.moveTo(-34, yy); q.quadraticCurveTo(0, yy - 6, 34, yy); q.stroke(); }
    ellipse(q, 0, -50, 6, 7, '#E2452B'); ellipse(q, -18, -50, 3.5, 3.5, '#1FA39A'); ellipse(q, 18, -50, 3.5, 3.5, '#1FA39A'); ellipse(q, 0, -84, 4, 5, '#E2452B');
  } });
  for (const sd of [-1, 1]) celOval(c, sd * 42, 14, 6, 7, C.gold, { w: 2, boil: .2 });
  celLine(c, [[-4, -18], [-3, -8], [0, -4], [3, -8], [4, -18]], 3, { under: C.tilak, taper: .25, boil: .3 });
  CEL.inkK = (ik ?? 1) * 1.9;
  celFace(c, { eyes: 'happy', brow: .2, tilt: .1, mouth: 'smile', blush: .35 }, C, { face: { k: .22 } });
  c.restore();
  CEL.inkK = ik; c.restore();
}

// a wayside Vishnu shrine on two steps, its base's middle at (x, y), about 930 px to the flag's tip at s = 1, 460 wide
function celShrine(c, x, y, s = 1, t = 0, o = {}) {
  const A = {}, at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const stone = '#FBEFDC', stSh = '#E2CBA8', stLt = '#FFF9EE', och = '#E8833A', ochSh = '#C2602A';
  c.save(); c.translate(x, y); c.scale(s, s);
  // the flag on its pole, waving
  celLine(c, [[0, -820], [0, -930]], 4, { col: '#8A5A34', taper: 0 });
  const fw = i => Math.sin(t * 5 - i * .9) * 7 * i / 4;
  celShape(c, [[2, -928], [40, -920 + fw(1)], [82, -914 + fw(2)], [118, -906 + fw(3)], [92, -896 + fw(3)], [124, -882 + fw(4)], [80, -880 + fw(2)], [40, -884 + fw(1)], [2, -886]], '#FF8A1E', { n: 2, w: 3.5, shade: ['#E0621A', 0, 5] });
  // the shikhara: a curved tower with ribs, the amalaka and the kalash on top
  const sh = []; for (let i = 0; i <= 10; i++) { const u = i / 10; sh.push([-150 + 110 * Math.pow(u, 1.6), -436 - u * 330]); }
  celShape(c, [...sh, [0, -790], ...sh.map(([a, b]) => [-a, b]).reverse()], stone, { n: 3, w: 4.5, shade: [stSh, 10, 6], lt: [stLt, 5, 5], over: q => {
    q.strokeStyle = 'rgba(200,120,70,.65)'; q.lineWidth = 4; for (let i = 1; i < 8; i++) { const u = i / 8, hw = 150 - 110 * Math.pow(u, 1.6); q.beginPath(); q.moveTo(-hw, -436 - u * 330); q.lineTo(hw, -436 - u * 330); q.stroke(); }
    q.strokeStyle = 'rgba(200,120,70,.45)'; q.lineWidth = 3; for (const k of [-.45, 0, .45]) { q.beginPath(); for (let i = 0; i <= 10; i++) { const u = i / 10, hw = 150 - 110 * Math.pow(u, 1.6); q.lineTo(k * hw, -436 - u * 330); } q.stroke(); }
  } });
  celOval(c, 0, -790, 48, 16, stone, { w: 4, shade: [stSh, 0, 5], over: q => { q.strokeStyle = 'rgba(200,120,70,.6)'; q.lineWidth = 2.5; for (let i = -3; i <= 3; i++) { q.beginPath(); q.moveTo(i * 13, -804); q.lineTo(i * 14, -776); q.stroke(); } } });
  celShape(c, [[-20, -804], [-28, -826], [-16, -842], [-8, -848], [-8, -858], [8, -858], [8, -848], [16, -842], [28, -826], [20, -804]], '#F2B52E', { n: 3, w: 3.5, shade: ['#C98A1A', 4, 3] });
  // the body and the cornice
  celShape(c, [[-176, -84], [-176, -420], [176, -420], [176, -84]], stone, { n: 1, w: 4.5, shade: [stSh, 12, 0], lt: [stLt, 6, 0] });
  celShape(c, [[-196, -414], [-188, -446], [188, -446], [196, -414]], och, { n: 1, w: 4.5, shade: [ochSh, 0, 6] });
  // the doorway: a cusped arch, warm and lamp-lit inside
  const D = [[-104, -90]]; for (let i = 0; i <= 18; i++) { const u = i / 18, a = Math.PI * (1 + u), cusp = 1 - .07 * Math.abs(Math.sin(u * Math.PI * 5)); D.push([Math.cos(a) * 104 * cusp, -300 + Math.sin(a) * 82 * cusp]); } D.push([104, -90]);
  const gi = o.glow || 0;
  celShape(c, D, '#8C3E26', { n: 1, w: 4.5, over: q => {
    const g = q.createRadialGradient(0, -180, 0, 0, -180, 220); g.addColorStop(0, `rgba(255,${200 + 30 * gi | 0},120,${.75 + .25 * gi})`); g.addColorStop(.55, 'rgba(214,110,60,.8)'); g.addColorStop(1, 'rgba(120,46,30,1)');
    q.fillStyle = g; q.fillRect(-120, -400, 240, 320);
  } });
  A.door = at(0, -230);
  // a stone pedestal inside the door, so an offering on the step sits below the murti's feet
  celShape(c, [[-62, -88], [-56, -150], [-66, -150], [-66, -166], [66, -166], [66, -150], [56, -150], [62, -88]], '#E9D2AE', { n: 1, w: 3.5, shade: ['#C9A87C', 5, 0], over: q => { q.strokeStyle = 'rgba(200,80,60,.6)'; q.lineWidth = 4; q.beginPath(); q.moveTo(-58, -118); q.lineTo(58, -118); q.stroke(); } });
  celVishnuMurti(c, 0, -164, .76, t, { glow: gi });
  A.murti = at(0, -300);
  // pillars round the door, the arch's ochre frame
  for (const sd of [-1, 1]) {
    celShape(c, [[sd * 108, -88], [sd * 108, -396], [sd * 140, -396], [sd * 140, -88]], '#F6E2C2', { n: 1, w: 4, shade: [stSh, sd * 5, 0] });
    for (const yy of [-120, -250, -370]) celLine(c, [[sd * 108, yy], [sd * 140, yy]], 6, { under: och, taper: 0 });
  }
  // the marigold toran across the top of the door, mango leaves between the swags
  for (let k = 0; k < 3; k++) {
    const x0 = -120 + k * 80, x1 = x0 + 80;
    for (let i = 0; i <= 8; i++) { const u = i / 8, px = lerp(x0, x1, u), py = -392 + Math.sin(u * Math.PI) * 26; celOval(c, px, py, 9, 9, i % 2 ? '#FFB020' : '#FF8A1E', { w: 2.4, boil: .3 }); }
  }
  for (const lx of [-120, -40, 40, 120]) celShape(c, [[lx - 6, -394], [lx, -360], [lx + 6, -394]], '#3F9A4E', { n: 3, w: 2.6, boil: .3 });
  // the steps
  celShape(c, [[-226, 0], [-226, -42], [226, -42], [226, 0]], stone, { n: 1, w: 4.5, shade: [stSh, 0, 8], lt: [stLt, 0, 4] });
  celShape(c, [[-200, -42], [-200, -86], [200, -86], [200, -42]], stone, { n: 1, w: 4.5, shade: [stSh, 0, 8], lt: [stLt, 0, 4], over: q => { q.strokeStyle = 'rgba(214,80,60,.55)'; q.lineWidth = 5; q.beginPath(); q.moveTo(-200, -64); q.lineTo(200, -64); q.stroke(); } });
  A.step = at(0, -86); A.step0 = at(0, -42);
  // two diyas on the upper step
  for (const sd of [-1, 1]) {
    const dx = sd * 160, fl = 1 + .12 * Math.sin(t * 13 + sd * 2) + .06 * Math.sin(t * 29);
    glow(c, dx, -112, 60, '#FFD27A', .5);
    celShape(c, [[dx - 24, -94], [dx + 24, -94], [dx + 14, -84], [dx - 14, -84]], '#C96A36', { n: 2, w: 3.2, shade: ['#9A4A22', 0, 3] });
    celShape(c, [[dx - 5, -96], [dx - 6, -108 * 1], [dx, -96 - 26 * fl], [dx + 6, -108], [dx + 5, -96]], '#FFC23A', { n: 3, w: 2.6, boil: .3, over: q => ellipse(q, dx, -104, 3, 6, '#FFF6C8') });
  }
  // the brass bell, hanging from the cornice's left end by a chain (o.lateBell: leave it out and draw it later with
  // celShrineBell, over a kid ringing it)
  A.bellAt = at(-186, -414); A.bell = at(-186 + 140 * Math.sin(-(o.bell || 0)), -414 + 140 * Math.cos(o.bell || 0));
  c.restore();
  if (!o.lateBell) celShrineBell(c, A.bellAt[0], A.bellAt[1], s, o.bell || 0);
  return A;
}
// the shrine's bell, hung at (x, y), swung by `swing` radians
function celShrineBell(c, x, y, s = 1, swing = 0) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(swing);
  celLine(c, [[0, 0], [0, 100]], 4, { col: '#9A7A3A', taper: 0, boil: .3 });
  for (let i = 1; i < 6; i++) celOval(c, 0, i * 18, 4, 6, '#C9A040', { w: 2, boil: .2 });
  celShape(c, [[-10, 102], [-16, 120], [-24, 146], [-32, 152], [32, 152], [24, 146], [16, 120], [10, 102]], '#E0A93A', { n: 3, w: 3.5, shade: ['#B07C1E', 5, 3], lt: ['#FFE08A', 3, 3] });
  celOval(c, 0, 158, 7, 7, '#B07C1E', { w: 2.5 });
  c.restore();
}

// ---------- tears and smeared kajal (Bhagavata 10.9.11: crying, he rubbed his eyes and smeared the ointment) ----------
// head coordinates, drawn over the face
function celKajal(c, b, seed = 0) {
  const p = new Path2D(), blob = (x, y, rx, ry, r = 0) => { p.moveTo(x + rx * b * Math.cos(r), y + rx * b * Math.sin(r)); p.ellipse(x, y, rx * b, ry * b, r, 0, TAU); };
  for (const sd of [-1, 1]) {
    for (let i = 0; i <= 6; i++) { const u = i / 6; blob(sd * (64 + 10 * Math.sin(u * 5 + sd)), 62 + u * 74, 13 - u * 5, 11, 0); }   // a streak down each cheek
    for (let i = 0; i <= 4; i++) { const u = i / 4; blob(sd * lerp(40, 128, u), 66 + Math.sin(u * 3) * 10, 12, 8 - u * 2, sd * .3); }   // rubbed sideways
  }
  c.save(); c.globalAlpha *= .42; c.fillStyle = '#2B2550'; c.fill(p); c.restore();
}
function celTears(c, k, td) {
  const blue = '#9ED8FF';
  for (const sd of [-1, 1]) {
    // a stream from under the eye down the cheek, wobbling
    const P = []; for (let i = 0; i <= 5; i++) { const u = i / 5; P.push([sd * (70 + 6 * Math.sin(u * 4 + td * 9)), 50 + u * 96 * k]); }
    celShape(c, celTube(P, [22, 20, 18, 16, 15, 14].map(w => w * (.6 + .4 * k))), blue, { dense: true, w: 3.5, boil: .4, over: q => { q.strokeStyle = 'rgba(255,255,255,.85)'; q.lineWidth = 4; q.beginPath(); q.moveTo(sd * 66 - 3, 58); q.lineTo(sd * 64 - 3, 50 + 80 * k); q.stroke(); } });
    // drops flying off the outer corners
    for (let i = 0; i < 4; i++) {
      const u = (td * 1.7 + i / 4 + (sd > 0 ? .13 : 0)) % 1, x = sd * (92 + 170 * u), y = 20 - 90 * u + 260 * u * u, r = (13 - 5 * u) * k;
      if (r > 2) celShape(c, [[x, y - r * 1.5], [x + r, y], [x, y + r], [x - r, y]], blue, { n: 5, w: 3, boil: .3, over: q => ellipse(q, x - r * .3, y - r * .1, r * .25, r * .35, '#FFFFFF') });
    }
  }
}

// ---------- Kaliya (Bhagavata 10.16) and Yashoda's stick (10.9.9) ----------
const CEL_KALIYA = { skin: '#7464CC', sh: '#5446A6', lt: '#A79CEC', belly: '#F6E7B8', bellySh: '#DFC78E', hood: '#BCB2F2', iris: '#241A3A', iris2: '#5E46B0', blush: '#FF8AB6', mouth: '#5A1E3A', tongue: '#F04E6A', print: '#5B8FE0' };
function celStick(c, x, y, len = 300, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  const a = [0, len * .22], b = [0, -len * .78];
  celShape(c, celTube([a, b], [15, 12]), '#C68D4C', { dense: true, w: 4, shade: ['#94612E', 4, 0], lt: ['#E8B678', 2, 0] });
  for (let i = 1; i < 5; i++) { const yy = lerp(a[1], b[1], i / 5); celLine(c, [[-8, yy + 2], [0, yy - 1], [8, yy + 2]], 3.2, { taper: .2, boil: .3 }); }
  c.restore();
}
function celKaliya(c, x, y, s, P, o = {}) {
  const C = { ...CEL_KALIYA, ...(o.pal || {}) }, td = P.td ?? o.t ?? 0, A = {}, body = { shade: [C.sh, 8, 10], lt: [C.lt, 4, 5] };
  celBegin(td); CEL.n = o.seed ?? 1300;
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, sq = clamp((P.squash || 0) + hit * .3, -1, 1), br = Math.sin(td * TAU / 2.8);
  c.save(); c.translate(x, y); c.scale(s, s);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  // the tail: out of the lower coil along the ground, its tip curling up (round a stick)
  const tip = P.tail || [262, -18], tm = [lerp(170, tip[0], .5), Math.min(-14, lerp(-40, tip[1], .5) + 10)];
  celShape(c, celTube([[150, -54], [196, -28], tm, [tip[0] - 14, tip[1] + 8], tip], [64, 46, 30, 20, 14]), C.skin, { dense: true, ...body });
  if (P.stick) {
    const sr = P.stickRot ?? 0; celStick(c, tip[0], tip[1] - 4, P.stickLen ?? 320, sr);
    celShape(c, celTube([[tip[0] - 18, tip[1] + 6], [tip[0] - 20, tip[1] - 18], [tip[0], tip[1] - 26], [tip[0] + 18, tip[1] - 12], [tip[0] + 8, tip[1] + 6]], [16, 15, 14, 12, 10]), C.skin, { dense: true, w: 4, shade: [C.sh, 3, 4] });
  }
  A.tail = at(...tip);
  // two coils, each its back half then its front half; the cream belly peeks along the front of the lower one
  const coil = (cy, rx, ry, w) => {
    const arc = (a0, a1) => { const Q = []; for (let i = 0; i <= 8; i++) { const a = lerp(a0, a1, i / 8); Q.push([Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return Q; };
    celShape(c, celTube(arc(Math.PI * 1.04, Math.PI * 1.96), [w * .9, w * .86, w * .9]), C.skin, { dense: true, ...body });
    celShape(c, celTube(arc(-.06, Math.PI + .06), [w, w * 1.05, w]), C.skin, { dense: true, ...body, over: q => { q.strokeStyle = C.belly; q.lineWidth = w * .15; q.lineCap = 'round'; q.beginPath(); for (let i = 2; i <= 6; i++) { const a = lerp(0, Math.PI, i / 8); q.lineTo(Math.cos(a) * rx * .98, cy + Math.sin(a) * ry + w * .3); } q.stroke(); } });
    for (let i = 1; i < 8; i++) { const a = lerp(.1, Math.PI - .1, i / 8); ellipse(c, Math.cos(a) * rx, cy + Math.sin(a) * ry - w * .12, 6, 4, rgba(C.lt, .9)); }
  };
  coil(-58, 176, 30, 98); coil(-142, 128, 24, 84);
  // the hoods sway on the neck (lean, about its root) and squash on a stomp
  c.save(); c.translate(0, -150); c.rotate((P.lean || 0) + br * .015); c.scale(1 + sq * .08, 1 - sq * .12 + br * .008);
  const neck = (tx, ty, w) => celShape(c, celTube([[0, 8], [tx * .3, -40], [tx * .7, ty + 70], [tx, ty + 20]], [w, w * .92, w * .84, w * .8]), C.skin, { dense: true, ...body, over: q => { q.fillStyle = C.belly; for (let i = 0; i < 4; i++) { const u = .25 + i * .18; ellipse(q, tx * u * .95, lerp(-10, ty + 40, u), w * .26, 7, C.belly); } } });
  const hood = (hx, hy, r, rot, face) => {
    c.save(); c.translate(hx, hy); c.rotate(rot);
    celShape(c, [[0, -r * .96], [r * .72, -r * .76], [r, -r * .12], [r * .84, r * .56], [r * .36, r * .96], [-r * .36, r * .96], [-r * .84, r * .56], [-r, -r * .12], [-r * .72, -r * .76]], C.skin, { ...body, over: q => {
      ellipse(q, 0, r * .18, r * .62, r * .66, C.hood);
      for (let i = 0; i < 3; i++) celLine(q, [[-r * .42, r * (.42 + i * .17)], [0, r * (.52 + i * .17)], [r * .42, r * (.42 + i * .17)]], 2.6, { col: rgba(C.sh, .6), boil: .3, taper: .3 });
      const pr = clamp(P.prints || 0); if (pr > .02) for (const sd of [-1, 1]) { const fx = sd * r * .52, fy = -r * .42; q.save(); q.globalAlpha = .75 * pr; ellipse(q, fx, fy, r * .1, r * .15, C.print, sd * .2); for (let j = 0; j < 4; j++) ellipse(q, fx - r * .07 + j * r * .05, fy - r * .2 - Math.abs(j - 1.5) * -r * .015, r * .025, r * .03, C.print); q.restore(); }
    } });
    face(r); c.restore();
    return at(hx, hy);
  };
  const side = P.side || 'open', heads = [];
  const small = (r) => { celMiniFace(c, 0, -r * .2, r / 52, side, C.blush); if (side === 'dizzy' || side === 'flat') return; };
  for (const sd of [-1, 1]) neck(sd * 210, -150, 50);
  for (const sd of [-1, 1]) heads.push(hood(sd * 210, -150, 62, sd * .32, small));
  for (const sd of [-1, 1]) neck(sd * 118, -205, 58);
  for (const sd of [-1, 1]) heads.push(hood(sd * 118, -205, 74, sd * .16, small));
  neck(0, -228, 72);
  const MH = [0, -236], MR = 96;
  heads.splice(2, 0, hood(MH[0], MH[1], MR, 0, r => {
    c.save(); c.translate(0, -r * .26);
    celFace(c, P, C, { face: { ex: 70, ey: 0, my: 64, bx: 104, by: 40, k: .52 }, seed: 13 });
    const tg = clamp(P.tongue || 0);
    if (tg > .02) { const L = 46 * tg, ty = 64 * .52 + 10; celLine(c, [[0, ty], [0, ty + L]], 5, { col: C.tongue, taper: .1, boil: .3 }); celLine(c, [[0, ty + L], [-9, ty + L + 12]], 4, { col: C.tongue, taper: .3, boil: .3 }); celLine(c, [[0, ty + L], [9, ty + L + 12]], 4, { col: C.tongue, taper: .3, boil: .3 }); }
    c.restore();
  }));
  A.head = at(MH[0], MH[1] - MR * .26); A.stand = at(MH[0], MH[1] - MR * .9); A.top = at(0, MH[1] - MR);
  c.restore();
  A.heads = heads;
  c.restore();
  return A;
}

// ---------- the flute, music notes and a calf (Bhagavata 10.21: the flute song; 10.21.13 the calves stand still) ----------
// the bansuri from a (the blowing end) to b: a cane with six holes, red bands at both ends, a red tassel swinging from b
function celFluteAt(c, a, b, C = CEL_KANHA, td = 0) {
  const d = v2.norm(v2.sub(b, a)), L = v2.len(v2.sub(b, a)), red = C.red || '#E2452B';
  celShape(c, celTube([a, b], [17, 16]), C.flute, { dense: true, w: 4, shade: [C.fluteSh, 0, 5] });
  ellipse(c, ...v2.add(a, v2.mul(d, 26)), 3.6, 3.6, '#3A2414');   // the blowing hole
  for (let i = 0; i < 6; i++) { const p = v2.add(a, v2.mul(d, L * (.42 + i * .085))); ellipse(c, p[0], p[1] - 1, 3.2, 3.2, '#3A2414'); }
  celBand(c, a, b, .05, 22, 6, red); celBand(c, a, b, .93, 22, 6, red);
  const sw = Math.sin(td * 3.1) * 8, e = v2.add(b, v2.mul(d, -8));
  celLine(c, [e, [e[0] + sw * .3, e[1] + 22], [e[0] + sw * .6, e[1] + 40]], 3.4, { col: red, taper: .1, boil: .4 });
  celShape(c, [[e[0] + sw * .6 - 9, e[1] + 40], [e[0] + sw * .6 + 9, e[1] + 40], [e[0] + sw + 12, e[1] + 76], [e[0] + sw - 12, e[1] + 76]], red, { n: 3, w: 3.5, shade: ['#B0222C', 4, 4] });
  celOval(c, e[0] + sw * .6, e[1] + 38, 8, 7, C.gold || '#F2B52E', { w: 3 });
}
// a flute held in a hand: gripped at (x, y), pointing along rot (0: to screen right), len long (a third behind the grip)
function celFlute(c, x, y, len = 300, rot = 0, td = 0) {
  const d = [Math.cos(rot), Math.sin(rot)];
  celFluteAt(c, [x - d[0] * len * .3, y - d[1] * len * .3], [x + d[0] * len * .7, y + d[1] * len * .7], CEL_KANHA, td);
}
// a music note (o.kind 1: a quaver, 2: two beamed quavers), r the note head's size, o.col, o.rot, o.a
function celNote(c, x, y, r, o = {}) {
  if (r <= 1 || (o.a ?? 1) <= .02) return;
  const col = o.col || '#5B8FE0', w = Math.max(2.5, r * .12);
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= (o.a ?? 1);
  const stem = (hx, top) => celShape(c, celTube([[hx + r * .48, -r * .1], [hx + r * .48, top]], [r * .2, r * .2]), col, { dense: true, w, boil: .3 });
  const head = hx => celOval(c, hx, 0, r * .62, r * .44, col, { rot: -.4, w, boil: .3, over: q => ellipse(q, hx - r * .2, -r * .12, r * .16, r * .09, 'rgba(255,255,255,.8)', -.4) });
  if (o.kind === 2) {
    stem(0, -r * 1.7); stem(r * 1.3, -r * 1.9);
    celShape(c, [[r * .38, -r * 1.7 - r * .1], [r * 1.88, -r * 1.9 - r * .1], [r * 1.88, -r * 1.9 + r * .3], [r * .38, -r * 1.7 + r * .3]], col, { n: 2, w, boil: .3 });
    head(0); head(r * 1.3);
  } else {
    stem(0, -r * 1.8);
    celShape(c, celTube([[r * .48, -r * 1.75], [r * .95, -r * 1.35], [r * 1.05, -r * .9], [r * .8, -r * .6]], [r * .3, r * .26, r * .2, r * .1]), col, { dense: true, w, boil: .3 });
    head(0);
  }
  c.restore();
}
// a little calf (about 330 px tall to its ears at s = 1), its feet's middle at (x, y), side-on with its head turned to us.
// P like a kid's face (eyes, mouth, look, lid, brow, tilt, blush, talk) plus dir (1 faces screen right, -1 left), walk (the
// trot's phase, radians) and stride 0..1, hop, lean, head (tilt), hx / hy (the head pushed forward / down: a nuzzle),
// ears 0..1 (floppy .. perked up "like cups", 10.21.13), wag (the tail), milk 0..1 (milk dribbling from its mouth, 10.21.13).
// Returns { head, top, mouth, nose }
const CEL_CALF = { skin: '#FFF8F0', sh: '#EBDACB', lt: '#FFFFFF', patch: '#DDA066', patchSh: '#BC7E46', hoof: '#6B4A3C', muzzle: '#F8C1B6', muzzleSh: '#EA9F96', nostril: '#B8656A', ear: '#F7AAB4', horn: '#F2DFB2', hornSh: '#D9BE84', iris: '#1E1410', iris2: '#6A4024', blush: '#FF8AA6', mouth: '#6A1E3A', tongue: '#F27C90', red: '#E2343E', gold: '#F2B52E' };
function celCalf(c, x, y, s, P, o = {}) {
  const C = { ...CEL_CALF, ...(o.pal || {}) }, td = P.td ?? o.t ?? 0, A = {}, dir = P.dir ?? 1;
  const coat = { shade: [C.sh, 7, 9], lt: [C.lt, 4, 4] };
  celBegin(td); CEL.n = o.seed ?? 1700;
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, br = Math.sin(td * TAU / 2.4), st = P.stride || 0, ph = P.walk || 0;
  const bob = -Math.abs(Math.sin(ph)) * 10 * st + hit * 6 + br * 1.5;
  c.save(); c.translate(x, y - (P.hop || 0)); c.scale(s * dir, s);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const leg = (lx, off, far) => {
    const u = ph + off, fx = lx + Math.sin(u) * 22 * st, fy = -Math.max(0, Math.cos(u)) * 18 * st;
    celShape(c, celTube([[lx, -100 + bob], [lx + (fx - lx) * .5 + (lx > 0 ? 7 : -7), -50 + bob * .5], [fx, fy - 12]], [46, 36, 34]), far ? C.sh : C.skin, { dense: true, w: 4.5, shade: [far ? '#D6C2B0' : C.sh, 5, 4] });
    celOval(c, fx + 3, fy - 6, 21, 12, C.hoof, { w: 4 });
  };
  // the far legs, the tail, the body, the near legs
  leg(70, Math.PI, true); leg(-52, 0, true);
  const wag = Math.sin(td * 7) * (P.wag ?? .4);
  celShape(c, celTube([[-108, -150 + bob], [-132, -142 + bob], [-146 + wag * 14, -116 + bob], [-150 + wag * 26, -88 + bob]], [16, 13, 11, 9]), C.skin, { dense: true, w: 4 });
  celOval(c, -150 + wag * 28, -80 + bob, 13, 17, C.patchSh, { w: 3.5, rot: wag * .3 });
  c.save(); c.translate(0, bob); c.rotate(P.lean || 0);
  celShape(c, [[-120, -138], [-104, -176], [-44, -190], [40, -188], [96, -172], [122, -132], [110, -92], [60, -76], [0, -72], [-70, -76], [-114, -96]], C.skin, { ...coat, over: q => {
    ellipse(q, -48, -156, 44, 30, C.patch, -.2); ellipse(q, 34, -104, 24, 16, C.patch, .3); ellipse(q, -92, -112, 16, 12, C.patch);
  } });
  c.restore();
  leg(46, 0, false); leg(-76, Math.PI, false);
  // the neck and the head, turned to us
  const hc = [104 + (P.hx || 0), -258 + (P.hy || 0) + bob];
  celShape(c, celTube([[70, -150 + bob], [92, -190 + bob], [hc[0] - 6, hc[1] + 30]], [80, 72, 66]), C.skin, { dense: true, ...coat });
  c.save(); c.translate(...hc); c.rotate((P.head || 0) * dir); c.scale(dir, 1);   // the face is not mirrored
  const ea = lerp(.62, -.42, clamp(P.ears ?? 0)) + br * .03;
  for (const sd of [-1, 1]) {
    const b0 = [sd * 66, -36], tip = [b0[0] + sd * Math.cos(ea) * 78, b0[1] + Math.sin(ea) * 78], mid = v2.lerp(b0, tip, .5);
    celShape(c, celTube([b0, mid, tip], [38, 42, 12]), C.skin, { dense: true, ...coat });
    celShape(c, celTube([v2.lerp(b0, tip, .2), v2.lerp(b0, tip, .5), v2.lerp(b0, tip, .82)], [16, 22, 8]), C.ear, { dense: true, ink: false });
    celOval(c, sd * 36, -82, 13, 16, C.horn, { w: 4, shade: [C.hornSh, 3, 4], rot: sd * .25 });
  }
  celShape(c, [[-80, -52], [-50, -76], [0, -82], [50, -76], [80, -52], [90, 0], [78, 44], [46, 70], [0, 78], [-46, 70], [-78, 44], [-90, 0]], C.skin, { shade: [C.sh, 8, 10], lt: [C.lt, 4, 4], over: q => ellipse(q, -46, -16, 38, 42, C.patch, .2) });
  celShape(c, [[-18, -72], [-12, -94], [4, -102], [16, -90], [8, -80], [20, -72]], C.skin, { n: 3, w: 4, boil: .5 });   // a curl on the forehead
  celOval(c, 0, 40, 56, 34, C.muzzle, { w: 4.5, shade: [C.muzzleSh, 4, 6], over: q => ellipse(q, -20, 24, 14, 7, 'rgba(255,255,255,.6)', -.2) });
  for (const sd of [-1, 1]) ellipse(c, sd * 17, 34, 6, 8.5, C.nostril, sd * .3);
  const look = P.look || [0, 0];
  celFace(c, { ...P, look: [look[0] * dir, look[1]] }, C, { face: { ex: 70, ey: -26, my: 92, bx: 106, by: 18, k: .58 }, seed: 17, lashes: true });
  const mk = clamp(P.milk || 0);
  if (mk > .02) {
    // a round drop of milk at the corner of its mouth (a smear along the lips reads as teeth)
    const r = 5 + 5 * mk; celShape(c, [[30, 56], [30 + r, 62 + r], [30, 62 + r * 2], [30 - r, 62 + r]], '#FFFFFF', { n: 5, w: 3, boil: .3 });
  }
  A.head = at(0, 0); A.top = at(0, -90); A.mouth = at(0, 54); A.nose = at(0, 40);
  // a red cord round the neck and a little gold bell
  celLine(c, [[-46, 66], [0, 84], [46, 66]], 12, { under: C.red, taper: 0 });
  const bs = Math.sin(td * 5) * .2;
  c.save(); c.translate(0, 86); c.rotate(bs);
  celShape(c, [[-14, 2], [-12, 18], [-18, 30], [18, 30], [12, 18], [14, 2], [0, -4]], C.gold, { n: 3, w: 4, shade: ['#C98E1C', 4, 3] });
  celOval(c, 0, 33, 5, 5, '#8A5E12', { w: 2.5 });
  c.restore();
  c.restore();
  c.restore();
  return A;
}

// ---------- a Vraja hut with a curtained doorway, diyas, gifts, petals and cloth scraps (#7, the birthday) ----------
// a mud-walled hut front, the middle of its doorway's sill at (x, y), about 820 px to the thatch's top at s = 1; the wall
// runs from 330 left of the door to 430 right of it (let it run off the frame). o.curtain 0..1 (shut .. drawn aside and
// tied), o.shake 0..1 (someone busy behind it: the cloth bulges), o.heap 0..1 (petals and cloth scraps spilling out under
// it), o.toran 0..1 (a marigold toran over the door, popping on left to right), o.light 0..1 (lamplight inside), t the
// time; o.part 'back' (the hut without the curtain and the heap) or 'front' (only those), to put a kid in the doorway
// between them. Returns { door (the doorway's middle), top (the arch's top), sill } in screen px
function celHut(c, x, y, s = 1, t = 0, o = {}) {
  const A = {}, at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const mud = '#F3D3A4', mudSh = '#E2B47E', mudLt = '#FBE7C6', geru = '#C9573A', chalk = '#FFF8EA';
  c.save(); c.translate(x, y); c.scale(s, s);
  const back = o.part !== 'front', front = o.part !== 'back';
  // the wall, a geru plinth, chalk mandana dots and triangles
  if (back) {
  celShape(c, [[-330, 0], [-330, -640], [430, -640], [430, 0]], mud, { n: 1, w: 4.5, shade: [mudSh, 0, 10], lt: [mudLt, 6, 0], over: q => {
    q.fillStyle = geru; q.fillRect(-340, -46, 790, 50);
    q.fillStyle = chalk; for (let i = 0; i < 16; i++) { const px = -310 + i * 48; q.beginPath(); q.moveTo(px, -46); q.lineTo(px + 24, -70); q.lineTo(px + 48, -46); q.closePath(); q.globalAlpha = .55; q.fill(); }
    q.globalAlpha = 1; for (let i = 0; i < 15; i++) ellipse(q, -300 + i * 50, -96, 4, 4, rgba(chalk, .8));
    // a chalk rangoli flower by the door on each side
    for (const sx of [-250, 300]) { for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; ellipse(q, sx + Math.cos(a) * 20, -300 + Math.sin(a) * 20, 8, 5, rgba(chalk, .7), a); } ellipse(q, sx, -300, 7, 7, rgba(geru, .8)); }
  } });
  // the thatch: a deep roof over the wall, straw strokes, a ridge
  const th = []; for (let i = 0; i <= 12; i++) { const u = i / 12; th.push([lerp(-400, 500, u), -604 + Math.sin(u * Math.PI * 9) * 6]); }
  celShape(c, [...th, [500, -760], [380, -808], [-200, -820], [-330, -780]], '#DDA94E', { n: 2, w: 4.5, shade: ['#B57C2C', 0, 12], lt: ['#F2CC7A', 0, -8], over: q => {
    q.strokeStyle = 'rgba(150,96,34,.55)'; q.lineWidth = 3; for (let i = 0; i < 34; i++) { const px = -390 + i * 27, py = -606 - (i * 37 % 5) * 6; q.beginPath(); q.moveTo(px, py); q.lineTo(px + 6, py - 70 - (i % 3) * 22); q.stroke(); }
  } });
  celLine(c, [[-330, -780], [-200, -820], [380, -808], [500, -760]], 8, { under: '#C08A3A', taper: .2 });
  // the doorway: an arch, dark and warm inside (lamplight with o.light)
  const D = [[-152, 0], [-152, -420]]; for (let i = 0; i <= 14; i++) { const a = Math.PI * (1 + i / 14); D.push([Math.cos(a) * 152, -420 + Math.sin(a) * 150]); } D.push([152, -420], [152, 0]);
  const li = o.light || 0;
  celShape(c, D, '#5E3226', { n: 1, w: 5, over: q => {
    const g = q.createRadialGradient(0, -260, 0, 0, -260, 330); g.addColorStop(0, `rgba(255,${170 + 50 * li | 0},110,${.35 + .5 * li})`); g.addColorStop(1, 'rgba(80,36,26,0)'); q.fillStyle = g; q.fillRect(-170, -600, 340, 600);
  } });
  // the geru frame round the arch with chalk dots
  const fr = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * (1 + i / 14); fr.push([Math.cos(a) * 176, -420 + Math.sin(a) * 174]); }
  celLine(c, [[-176, -2], ...fr, [176, -2]], 22, { under: geru, taper: 0 });
  for (let i = 0; i < 22; i++) { const u = i / 21, a = Math.PI * (1 + u); ellipse(c, Math.cos(a) * 176, -420 + Math.sin(a) * 174, 3.5, 3.5, chalk); }
  }
  if (front) {
  // the curtain on its rod: two halves, bulging when someone is busy behind it, drawn aside and tied when open
  const ck = clamp(o.curtain || 0), sk = o.shake || 0, rodY = -452;
  celLine(c, [[-168, rodY], [168, rodY]], 9, { under: '#8A5A34', taper: 0 });
  for (const sd of [-1, 1]) {
    // the inner edge, top (u 0) to bottom (u 1): straight down the middle when shut, pinched at the tie when open
    const outer = sd * 156, tieU = .55, bot = -6;
    const openX = u => u < tieU ? lerp(100, 134, u / tieU) : lerp(134, 108, (u - tieU) / (1 - tieU));
    const inX = u => sd * lerp(2, openX(u), ck) + sk * sd * (Math.sin(t * 9 + sd * 1.3 + u * 3) * 14 + Math.sin(t * 23 + u * 7) * 5) * u * (1 - ck);
    const P = [[outer, rodY], [outer, bot]];
    for (let i = 8; i >= 0; i--) { const u = i / 8; P.push([inX(u), lerp(rodY, bot, u) + (i === 8 ? 0 : 0)]); }
    celShape(c, P, '#F27BA3', { n: 1, w: 4.5, shade: ['#D2507E', -sd * 10, 0], over: q => {
      for (let r = 0; r < 9; r++) for (let k = 0; k < 7; k++) { const px = sd * (8 + k * 24) + (r % 2) * 12 * sd, py = rodY + 30 + r * 50; ellipse(q, px, py, 5, 5, '#FFD95A'); }
      q.strokeStyle = 'rgba(160,40,80,.35)'; q.lineWidth = 3; for (let k = 1; k < 4; k++) { q.beginPath(); for (let i = 0; i <= 8; i++) { const u = i / 8; q.lineTo(lerp(inX(u), outer, k / 4), lerp(rodY, bot, u)); } q.stroke(); }
    } });
    if (ck > .6) celOval(c, lerp(inX(tieU), outer, .4), lerp(rodY, bot, tieU), 12, 9, '#F2B52E', { w: 3 });
  }
  for (let i = 0; i < 7; i++) celOval(c, -150 + i * 50, rodY, 7, 7, '#F2B52E', { w: 2.4, boil: .3 });   // the rings
  // the heap at the sill: petals and scraps spilling out under the curtain
  const hk = clamp(o.heap || 0);
  for (let i = 0; i < 26; i++) {
    if (hash(i * 2.3) > hk * 1.05) continue;
    const px = (hash(i * 1.7) - .5) * 330 * (.5 + .5 * hk), py = -6 - hash(i * 3.1) * 34 * (1 - Math.abs(px) / 200);
    const kind = i % 3, col = ['#FFFDF4', '#FF9B1E', '#F2578A', '#F7C744', '#5B8FE0', '#E04A36'][i % 6];
    if (kind === 2) celScrap(c, px, py, 16, hash(i) * 6, col); else celPetal(c, px, py, 12, hash(i * 5) * 6, col);
  }
  }
  // the toran: three swags of marigolds over the arch, mango leaves hanging between them
  const tk = clamp(o.toran || 0);
  if (tk > .01 && back) for (let k = 0; k < 3; k++) {
    const x0 = -210 + k * 140, x1 = x0 + 140;
    for (let i = 0; i <= 9; i++) { const u = i / 9, px = lerp(x0, x1, u), py = -612 + Math.sin(u * Math.PI) * 40, kk = backOut(clamp(tk * 34 - (k * 10 + i)), 2); if (kk > .05) celOval(c, px, py, 12 * kk, 12 * kk, i % 2 ? '#FFB020' : '#FF8A1E', { w: 2.6, boil: .3 }); }
    const lk = backOut(clamp(tk * 3 - k), 2); if (lk > .05) for (const lx of [x0, x1]) celShape(c, [[lx - 8, -614], [lx, -614 + 46 * lk], [lx + 8, -614]], '#3F9A4E', { n: 3, w: 2.6, boil: .3 });
  }
  A.door = at(0, -260); A.top = at(0, -570); A.sill = at(0, 0);
  c.restore();
  return A;
}
// a clay diya, its base at (x, y), the flame flickering at t; k 0..1 lit
function celDiya(c, x, y, s = 1, t = 0, k = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const fl = 1 + .12 * Math.sin(t * 13 + x) + .06 * Math.sin(t * 29);
  if (k > .02) glow(c, 0, -30, 90, '#FFD27A', .55 * k);
  celShape(c, [[-34, -22], [34, -22], [22, -4], [0, 0], [-22, -4]], '#C96A36', { n: 2, w: 3.5, shade: ['#9A4A22', 0, 4], over: q => { q.strokeStyle = '#F2B52E'; q.lineWidth = 3; q.beginPath(); q.moveTo(-26, -15); q.lineTo(26, -15); q.stroke(); } });
  if (k > .02) { c.save(); c.translate(0, -24); c.scale(k, k); celShape(c, [[-7, 0], [-8, -14], [0, -36 * fl], [8, -14], [7, 0]], '#FFC23A', { n: 3, w: 2.6, boil: .3, over: q => ellipse(q, 0, -10, 3.5, 7, '#FFF6C8') }); c.restore(); }
  c.restore();
}
// a gift, its base's middle at (x, y): kind 'box' (wrapped, a ribbon cross and a bow; o.col, o.rib), 'ball' (a striped
// cloth ball), 'potli' (a tied cloth pouch; o.col); o.rot
function celGift(c, x, y, s = 1, kind = 'box', o = {}) {
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(s, s);
  if (kind === 'ball') {
    const cols = ['#E04A36', '#F7C744', '#5B8FE0', '#3FA45E'];
    celOval(c, 0, -48, 48, 48, '#FFF6E8', { w: 4.5, shade: ['#E8D6BE', 8, 8], over: q => { for (let i = 0; i < 4; i++) { q.fillStyle = cols[i]; q.beginPath(); q.moveTo(0, -48); q.arc(0, -48, 50, i * Math.PI / 2 + .25, i * Math.PI / 2 + .25 + .7); q.closePath(); q.fill(); } ellipse(q, -16, -66, 12, 8, 'rgba(255,255,255,.7)', -.5); } });
  } else if (kind === 'potli') {
    const col = o.col || '#3FA45E';
    celShape(c, [[-46, -4], [-58, -46], [-40, -86], [-14, -96], [14, -96], [40, -86], [58, -46], [46, -4], [0, 2]], col, { n: 4, w: 4.5, shade: [o.sh || '#2E7E46', 8, 6], over: q => { for (let i = 0; i < 7; i++) ellipse(q, -36 + i * 12, -46 + (i % 2) * 14, 4, 4, '#FFD95A'); } });
    celShape(c, [[-18, -94], [-30, -128], [-8, -116], [0, -132], [8, -116], [30, -128], [18, -94]], col, { n: 3, w: 4, shade: [o.sh || '#2E7E46', 3, 3] });
    celLine(c, [[-22, -96], [0, -92], [22, -96]], 8, { under: '#E04A36', taper: 0 });
  } else {
    const col = o.col || '#F27BA3', rib = o.rib || '#F7C744', w = o.w || 120, h = o.h || 92;
    celShape(c, [[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], col, { n: 1, w: 4.5, shade: [o.sh || rgba('#000000', .14), 8, 0], over: q => { q.fillStyle = rib; q.fillRect(-10, -h, 20, h); q.fillRect(-w / 2, -h * .55 - 9, w, 18); } });
    celShape(c, [[-w / 2 - 6, -h], [-w / 2 - 6, -h - 22], [w / 2 + 6, -h - 22], [w / 2 + 6, -h]], col, { n: 1, w: 4.5, over: q => { q.fillStyle = rib; q.fillRect(-10, -h - 24, 20, 26); } });
    for (const sd of [-1, 1]) celShape(c, [[0, -h - 24], [sd * 30, -h - 52], [sd * 44, -h - 34], [sd * 20, -h - 22]], rib, { n: 3, w: 3.5 });
    celOval(c, 0, -h - 26, 10, 9, rib, { w: 3 });
  }
  c.restore();
}
// a petal (a soft teardrop) and a scrap of cloth (pinked edges), r their size
function celPetal(c, x, y, r, rot = 0, col = '#F2578A', a = 1) {
  if (r <= 1 || a <= .02) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a;
  celShape(c, [[0, -r], [r * .62, -r * .1], [r * .4, r * .7], [0, r * .9], [-r * .4, r * .7], [-r * .62, -r * .1]], col, { n: 4, w: Math.max(1.8, r * .16), boil: .3, shade: [rgba('#000000', .12), r * .15, r * .2] });
  c.restore();
}
function celScrap(c, x, y, r, rot = 0, col = '#F7C744', a = 1) {
  if (r <= 1 || a <= .02) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a;
  const P = []; for (let i = 0; i <= 6; i++) P.push([-r + i * r / 3, -r * .55 + (i % 2) * r * .16]); for (let i = 0; i <= 6; i++) P.push([r - i * r / 3, r * .5 - (i % 2) * r * .16]);
  celShape(c, P, col, { dense: true, w: Math.max(1.8, r * .14), boil: .3, shade: [rgba('#000000', .12), 0, r * .2] });
  c.restore();
}

// ---------- Brahma (#8, Brahma-vimohana, Bhagavata 10.13) ----------
// a tiny chibi Brahma seated on a pink lotus, the lotus's base at (x, y), about 420 px to his crowns at s = 1: four heads
// (the front one big, two side heads turned out, the fourth hidden behind), gold crowns, fluffy white beards, a saffron
// dhoti and a red uttariya; the back hands hold a palm-leaf pothi (the Vedas) and a kamandalu, the front hands follow P.
// P like a kid's face for the front head (eyes, look, lid, brow, tilt, mouth, talk, blush, sweat) plus side ('open' |
// 'dizzy' | 'happy' | 'flat': the side heads' faces), swivel -1..1 (the side heads lean as he looks about), hL / hR (the
// front hands, local px; shoulders at [±58, -196]), handL / handR ('open' | 'point' | 'fist'), hop, lean, td.
// Returns { head, top, handL, handR }
const CEL_BRAHMA = { skin: '#F7C08C', sh: '#DE9A62', lt: '#FFDDB8', beard: '#FFFFFF', beardSh: '#DCE0EE', dhoti: '#F08A2E', dhotiSh: '#C8641A', dhotiLt: '#FFB46A',
  cloth: '#D8364A', clothSh: '#A82236', gold: '#F2B52E', goldSh: '#C98A1A', goldLt: '#FFE48E', lotus: '#F57DA8', lotusSh: '#D6528A', lotusLt: '#FFB6D0',
  iris: '#2A1A14', iris2: '#8A5A30', blush: '#FF8AA6', mouth: '#7A1E36', tongue: '#F27C90', leaf: '#E8C27A', pot: '#C98A3A' };
function celBrahma(c, x, y, s, P, o = {}) {
  const C = { ...CEL_BRAHMA, ...(o.pal || {}) }, td = P.td ?? 0, A = {}, sk = { shade: [C.sh, 6, 7], lt: [C.lt, 3, 4] };
  celBegin(td); CEL.n = o.seed ?? 1900;
  c.save(); c.translate(x, y); c.scale(s, s);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, br = Math.sin(td * TAU / 2.2);
  // the lotus: back petals, then he sits, then the front petals
  const petal = (px, py, w, h, rot, col) => { c.save(); c.translate(px, py); c.rotate(rot); celShape(c, [[-w, 0], [-w * .7, -h * .6], [0, -h], [w * .7, -h * .6], [w, 0], [0, h * .12]], col, { n: 3, w: 4, shade: [C.lotusSh, 4, 5], over: q => celLine(q, [[0, -h * .15], [0, -h * .8]], 2.4, { col: rgba(C.lotusSh, .6), boil: .3 }) }); c.restore(); };
  for (const [px, rot] of [[-120, -.9], [120, .9], [-60, -.35], [60, .35], [0, 0]]) petal(px, -40, 46, 100, rot, C.lotusLt);
  c.save(); c.translate(0, -(P.hop || 0) + hit * 6 + br * 1.5); c.rotate(P.lean || 0);
  // the back arms: the pothi (screen left) and the kamandalu (screen right), raised
  const arm = (S, H) => celShape(c, celTube([S, v2.lerp(S, H, .5), H], [36, 32, 28]), C.skin, { dense: true, ...sk });
  arm([-50, -190], [-140, -250]); arm([50, -190], [140, -250]);
  c.save(); c.translate(-150, -270); c.rotate(-.25 + br * .03);
  celShape(c, [[-58, -16], [58, -16], [58, 16], [-58, 16]], C.leaf, { n: 1, w: 4, shade: ['#C49A52', 0, 5], over: q => { q.strokeStyle = 'rgba(110,70,30,.6)'; q.lineWidth = 2.4; for (const yy of [-6, 4]) { q.beginPath(); q.moveTo(-48, yy); q.lineTo(48, yy); q.stroke(); } } });
  celLine(c, [[-14, -18], [-14, 18]], 5, { under: C.cloth, taper: 0 }); c.restore();
  celOval(c, -140, -250, 18, 16, C.skin, { w: 3.5 });
  c.save(); c.translate(150, -262); celShape(c, [[-30, 18], [-34, -10], [-18, -30], [18, -30], [34, -10], [30, 18], [0, 26]], C.pot, { n: 3, w: 4, shade: ['#94601E', 6, 5], lt: ['#E8B060', 3, 3] }); celOval(c, 0, -32, 16, 6, '#94601E', { w: 3 }); celLine(c, [[30, -6], [52, -24], [56, -40]], 7, { under: C.pot, taper: 0 }); c.restore();
  celOval(c, 140, -250, 18, 16, C.skin, { w: 3.5 });
  // sitting cross-legged: the dhoti over the folded legs, the torso, the uttariya across
  celShape(c, [[-130, -54], [-120, -100], [-60, -122], [0, -118], [60, -122], [120, -100], [130, -54], [80, -34], [0, -30], [-80, -34]], C.dhoti, { n: 3, shade: [C.dhotiSh, 6, 8], lt: [C.dhotiLt, 4, 4] });
  for (const sd of [-1, 1]) celOval(c, sd * 96, -48, 30, 18, C.skin, { ...sk, rot: sd * -.2 });
  celShape(c, [[-62, -110], [-66, -170], [-48, -206], [0, -214], [48, -206], [66, -170], [62, -110], [0, -104]], C.skin, sk);
  celShape(c, celTube([[50, -206], [10, -168], [-34, -128], [-60, -108]], [30, 32, 34, 32]), C.cloth, { dense: true, shade: [C.clothSh, 4, 5] });
  celLine(c, [[-66, -116], [0, -108], [66, -116]], 12, { under: C.gold, taper: 0 });
  // the side heads, turned out (behind the front one), then the front head
  const head = (hx, hy, r, sd, face) => {
    c.save(); c.translate(hx, hy); c.rotate(sd * .22 + (P.head || 0));
    // the crown
    celShape(c, [[-r * .7, -r * .55], [-r * .62, -r * 1.2], [-r * .3, -r * 1.36], [0, -r * 1.62], [r * .3, -r * 1.36], [r * .62, -r * 1.2], [r * .7, -r * .55]], C.gold, { n: 3, w: 4, shade: [C.goldSh, 5, 4], lt: [C.goldLt, 3, 3], over: q => { ellipse(q, 0, -r * .95, r * .1, r * .12, '#E2452B'); q.strokeStyle = C.goldSh; q.lineWidth = 3; q.beginPath(); q.moveTo(-r * .66, -r * .72); q.quadraticCurveTo(0, -r * .8, r * .66, -r * .72); q.stroke(); } });
    celOval(c, 0, 0, r, r * .94, C.skin, { shade: [C.sh, 6, 8], lt: [C.lt, 4, 4] });
    celShape(c, [[-r * .92, -r * .05], [-r * .82, -r * .52], [-r * .4, -r * .72], [r * .4, -r * .72], [r * .82, -r * .52], [r * .92, -r * .05], [r * .6, -r * .38], [0, -r * .46], [-r * .6, -r * .38]], '#F4F4FA', { n: 3, w: 3.5, shade: [C.beardSh, 3, 4] });   // white hair under the crown
    // the beard: a fluffy cloud from ear to ear under the face
    const B = []; for (let i = 0; i <= 10; i++) { const a = Math.PI * (i / 10), rr = r * (1 + .1 * (i % 2)); B.push([Math.cos(a) * rr * .95, r * .25 + Math.sin(a) * rr * .85]); }
    celShape(c, [[-r * .95, r * .1], ...B.reverse(), [r * .95, r * .1], [r * .5, r * .52], [0, r * .6], [-r * .5, r * .52]], C.beard, { n: 3, w: 3.5, shade: [C.beardSh, 3, 5] });
    face(r);
    c.restore();
  };
  const sw = P.swivel || 0;
  for (const sd of [-1, 1]) head(sd * 104 + sw * 10, -292 + Math.abs(sw) * sd * sw * 6, 70, sd, r => {
    const ik = CEL.inkK; CEL.inkK = (ik ?? 1) * 1.2;
    celMiniFace(c, sd * r * .32, -r * .08, r / 52, P.side || 'open', C.blush);
    CEL.inkK = ik;
  });
  head(sw * 14, -300, 92, 0, r => {
    const ik = CEL.inkK; CEL.inkK = (ik ?? 1) * 1.25;
    celFace(c, { ...P, blush: P.blush ?? .3 }, C, { face: { ex: 66, ey: 4, my: 76, bx: 112, by: 48, k: r / 170 } , seed: 19 });
    if ((P.sweat || 0) > .02) celSweat(c, -r * .9, -r * .3, clamp(P.sweat) * .8);
    CEL.inkK = ik;
    A.head = at(0, 0); A.top = at(0, -r * 1.62);
  });
  // the front arms
  for (const sd of [-1, 1]) {
    const S = [sd * 58, -196], T = (sd < 0 ? P.hL : P.hR) || [sd * 70, -120], [el, wr] = celIK(S, T, 46, 44, [sd, .5]);
    celShape(c, celTube([S, el, wr], [36, 32, 28]), C.skin, { dense: true, ...sk });
    celBand(c, el, wr, .76, 32, 8, C.gold);
    const d = v2.norm(v2.sub(wr, el)), hc = v2.add(wr, v2.mul(d, 12)), rot = Math.atan2(d[1], d[0]), kind = (sd < 0 ? P.handL : P.handR) || 'open';
    if (kind === 'point') celShape(c, celTube([hc, v2.add(hc, v2.mul(d, 34))], [13, 11]), C.skin, { dense: true, w: 3.5 });
    celOval(c, hc[0], hc[1], kind === 'open' ? 20 : 17, 15, C.skin, { ...sk, rot });
    A[sd < 0 ? 'handL' : 'handR'] = at(...hc);
  }
  c.restore();
  for (const [px, rot] of [[-150, -1.2], [150, 1.2], [-84, -.6], [84, .6], [-26, -.15], [26, .15]]) petal(px, -10, 44, 70, rot, C.lotus);
  c.restore();
  return A;
}

// ---------- a parrot (#9: the parrot who only says "Radhe Radhe") ----------
// A chibi rose-ringed parakeet (shuka), facing us: a big round green head with a tuft, the kids' eyes, a red hooked beak
// that opens to talk, a black-and-pink ring round its neck like a necklace, a plump body with a yellow-green belly, two
// long blue-green tail plumes hanging below its perch, little pink feet gripping it. About 300 px from the feet to the
// tuft at s = 1 (the tail hangs 170 below). P like a kid's face (eyes, look, lid, brow, browR, tilt, blush, talk) plus
// head (tilt), lean, hop, squash, beak 0..1 (open), wL / wR 0 (folded) .. 1 (spread up and out), flap 0..1 (the wings beat,
// a new position every drawing), cheek -1 | 1 (that wing laid on its cheek, the swoon), fly 0..1 (the feet tuck up and
// the tail streams back), dir (which way the tail streams when flying). Returns { head, beak, top, feet, tail }
const CEL_PARROT = { body: '#5DC45A', sh: '#3C9A44', lt: '#9BE27A', belly: '#C4EC74', bellySh: '#A3D24E', wing: '#46AE4C', wingSh: '#2E8040',
  tip: '#3E86D0', tipSh: '#2C64A8', tail: '#4FB6A8', tailSh: '#2F8C86', tail2: '#5DC45A', beak: '#E8343C', beakSh: '#B01E2A', beakLt: '#FF7F74',
  lower: '#4A2A32', ring: '#1E1A2E', ring2: '#F48AB4', foot: '#D7A8B0', footSh: '#B08088', iris: '#1E1410', iris2: '#3E6A2A',
  blush: '#FF8AA6', mouth: '#7A1E36', tongue: '#F27C90' };
function celParrot(c, x, y, s, P, o = {}) {
  const C = { ...CEL_PARROT, ...(o.pal || {}) }, td = P.td ?? o.t ?? 0, A = {};
  celBegin(td); CEL.n = o.seed ?? 2300;
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, br = Math.sin(td * TAU / 2.2), fly = clamp(P.fly || 0), dir = P.dir ?? 1;
  const sq = clamp((P.squash || 0) + hit * .4 + br * .02, -1, 1), sx = 1 + sq * .08, sy = 1 - sq * .09;
  c.save(); c.translate(x, y - (P.hop || 0)); c.scale(s, s);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const body = { shade: [C.sh, 6, 8], lt: [C.lt, 4, 4] };
  c.save(); c.rotate(P.lean || 0); c.scale(sx, sy);
  // the tail: two long plumes hanging below the perch (streaming back when it flies), swaying a drawing late
  const sw = Math.sin(td * 2.6) * 10 + ((P.lag || P).lean || 0) * -60;
  for (const [dx, len, col, shc] of [[10, 1, C.tail, C.tailSh], [-10, .86, C.tail2, C.sh]]) {
    const end = [lerp(dx * 2.2 + sw, -dir * 150, fly), lerp(170 * len, 40, fly)], mid = v2.lerp([dx, -36], end, .5);
    celShape(c, celTube([[dx, -40], [mid[0] + dx * .4, mid[1]], end], [34, 26, 10]), col, { dense: true, w: 4.5, shade: [shc, 4, 4], over: q => { q.strokeStyle = rgba(shc, .8); q.lineWidth = 3; q.beginPath(); q.moveTo(dx, -30); q.lineTo(mid[0] + dx * .4, mid[1]); q.lineTo(...end); q.stroke(); } });
  }
  // the feet behind the belly's front, gripping the perch (tucked up in flight)
  const feet = () => { for (const sd of [-1, 1]) { const fy = lerp(-6, -40, fly); celOval(c, sd * 22, fy, 17, 11, C.foot, { w: 3.5, shade: [C.footSh, 2, 3] }); if (fly < .5) for (const k of [-1, 1]) celLine(c, [[sd * 22 + k * 9, fy + 4], [sd * 22 + k * 11, fy + 14]], 4.5, { taper: .3 }); } };
  // the body: plump, a yellow-green belly with little feather scallops
  celShape(c, [[-50, -18], [-64, -70], [-58, -120], [-32, -148], [0, -154], [32, -148], [58, -120], [64, -70], [50, -18], [0, -6]], C.body, { ...body, over: q => {
    ellipse(q, 0, -62, 40, 52, C.belly); q.strokeStyle = rgba(C.bellySh, .9); q.lineWidth = 3;
    for (const [bx, by] of [[-16, -88], [12, -78], [-6, -56], [20, -46], [-22, -40]]) { q.beginPath(); q.arc(bx, by, 9, .3, Math.PI - .3); q.stroke(); }
  } });
  feet();
  // a wing: from the shoulder, a = 0 folded down its side, π / 2 straight out, π straight up
  const wing = (sd, a, len = 1) => {
    c.save(); c.translate(sd * 46, -122); c.rotate(-sd * a); c.scale(sd, len);
    celShape(c, [[-26, 0], [-34, 34], [-26, 78], [-8, 112], [8, 116], [20, 84], [26, 36], [20, 0], [0, -10]], C.wing, { shade: [C.wingSh, 6, 6], over: q => {
      q.fillStyle = C.tip; q.beginPath(); q.moveTo(-40, 76); q.quadraticCurveTo(0, 64, 40, 70); q.lineTo(40, 130); q.lineTo(-40, 130); q.fill();
      q.strokeStyle = rgba(C.wingSh, .9); q.lineWidth = 3; for (const yy of [30, 52]) { q.beginPath(); q.moveTo(-26, yy); q.quadraticCurveTo(-8, yy + 12, 10, yy + 2); q.quadraticCurveTo(18, yy - 2, 24, yy + 8); q.stroke(); }
      q.strokeStyle = rgba(C.tipSh, .9); for (const xx of [-14, 2, 16]) { q.beginPath(); q.moveTo(xx, 80); q.lineTo(xx + 2, 108); q.stroke(); }
    } });
    A[sd < 0 ? 'wingL' : 'wingR'] = at(0, 110);
    c.restore();
  };
  const flap = clamp(P.flap || 0), beat = flap > .02 ? (CEL.d % 2 ? .6 : -1) * flap : 0;
  const wa = sd => { const w = clamp(sd < 0 ? P.wL || 0 : P.wR || 0); return lerp(.12, 1.95, Math.max(w, flap * .7 + fly * .3)) + beat * .55; };
  for (const sd of [-1, 1]) if (P.cheek !== sd) wing(sd, wa(sd));
  // the head
  c.save(); c.translate(0, -136); c.rotate(P.head || 0); c.translate(0, -74);
  for (const [tx, tr, k] of [[-14, -.5, .8], [4, .05, 1], [20, .55, .75]]) { c.save(); c.translate(tx, -74); c.rotate(tr + Math.sin(td * 3 + tx) * .05); c.scale(k, k); celShape(c, [[-10, 6], [-12, -24], [0, -46], [12, -24], [10, 6]], C.body, { n: 4, w: 4, shade: [C.sh, 3, 3] }); c.restore(); }
  celShape(c, [[-90, -10], [-78, -56], [-40, -82], [0, -88], [40, -82], [78, -56], [90, -10], [84, 34], [56, 66], [0, 80], [-56, 66], [-84, 34]], C.body, { shade: [C.sh, 8, 10], lt: [C.lt, 5, 5], over: q => {
    const g = q.createRadialGradient(-24, -20, 0, -24, -20, 110); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = g; q.fillRect(-100, -100, 200, 200);
  } });
  // the ring round its neck (a black line and a pink one, like a necklace)
  celLine(c, [[-80, 40], [-44, 66], [0, 76], [44, 66], [80, 40]], 7, { taper: .5 });
  celLine(c, [[-74, 52], [-40, 76], [0, 86], [40, 76], [74, 52]], 8, { col: C.ring2, taper: .5 });
  // blush, eyes, brows (the kids' face, small)
  const k = .64, bk = clamp(P.blush || 0), ev = Array.isArray(P.eyes) ? P.eyes : [P.eyes || 'open', P.eyes || 'open'];
  for (const sd of [-1, 1]) { c.save(); c.globalAlpha = .5 + .4 * bk; ellipse(c, sd * 60, 24, (18 + 6 * bk), (9 + 3 * bk), C.blush); c.restore(); for (let i = 0; i < 3; i++) celLine(c, [[sd * 60 + (-8 + i * 7), 30], [sd * 60 + (-4 + i * 7), 20]], 2.2, { boil: .4, col: rgba(CEL.ink, .55) }); }
  [-1, 1].forEach((sd, i) => celEye(c, sd * 42, -12, ev[i], P, C, sd, k, false));
  for (const sd of [-1, 1]) { const raise = sd > 0 && P.browR != null ? P.browR : P.brow || 0, tl = P.tilt || 0, by = -54 - raise * 8; celLine(c, [[sd * 42 - sd * 11, by - tl * 5], [sd * 42 + sd * 11, by + tl * 5]], 4.5, { taper: .5 }); }
  // the beak: the lower half drops open (a talk flap opens and shuts it a drawing at a time), the red hook over it
  let op = clamp(P.beak || 0); if ((P.talk || 0) > .5) op = hash(Math.floor(CEL.d / 2) * 1.37 + 3) < .6 ? .9 : .15;
  const dy = op * 16;
  if (op > .05) celOval(c, 0, 36 + dy * .5, 13, 6 + dy * .6, C.mouth, { w: 3, over: q => ellipse(q, 0, 42 + dy * .7, 8, 4 + dy * .3, C.tongue) });
  if (op > .05) celShape(c, [[-13, 30 + dy], [13, 30 + dy], [9, 42 + dy], [0, 46 + dy], [-9, 42 + dy]], C.lower, { n: 3, w: 3.5 });
  // the upper beak: broad at the top, curving down to a hooked point
  celShape(c, [[-24, 8], [-12, 0], [0, -2], [12, 0], [24, 8], [24, 20], [16, 32], [6, 44], [0, 56], [-6, 44], [-16, 32], [-24, 20]], C.beak, { n: 3, w: 4, shade: [C.beakSh, 5, 6], over: q => { ellipse(q, -9, 10, 7, 4.5, rgba('#FFFFFF', .75), -.3); q.strokeStyle = C.beakSh; q.lineWidth = 3; q.beginPath(); q.moveTo(-20, 16); q.quadraticCurveTo(0, 24, 20, 16); q.stroke(); } });
  A.head = at(0, 0); A.beak = at(0, 40); A.top = at(0, -110);
  c.restore();
  if (P.cheek === -1 || P.cheek === 1) wing(P.cheek, Math.PI * .97, .7);
  A.feet = at(0, 0); A.tail = at(0, 150);
  c.restore(); c.restore();
  return A;
}
// a little loose feather (flapping wings shed them), r its length, rot, col, a
function celFeatherBit(c, x, y, r, rot = 0, col = CEL_PARROT.wing, a = 1) {
  if (r <= 1 || a <= .02) return;
  c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a;
  celShape(c, [[0, -r], [r * .32, -r * .4], [r * .22, r * .5], [0, r * .7], [-r * .22, r * .5], [-r * .32, -r * .4]], col, { n: 4, w: Math.max(2.4, r * .09), boil: .4, shade: [CEL_PARROT.wingSh, r * .1, 0] });
  celLine(c, [[0, -r * .8], [0, r * .95]], Math.max(2, r * .07), { taper: .3, boil: .3 });
  c.restore();
}

// ---------- mangoes under a mango tree (#10) ----------
// celMango(c, x, y, r, o): a ripe mango, its middle at (x, y), r its half-length (about 1.3 r tall, r wide): golden yellow
// going orange, a red blush on its shoulder, green round the stalk, a shine; a stalk and one leaf on top. o.rot (default a
// little tilt), o.leaf (false: no leaf), o.a. Returns its top (the stalk) in screen px
const CEL_MANGO = { col: '#FFC233', sh: '#EE9424', lt: '#FFE27A', blush: '#F2603A', green: '#A6C93E', stalk: '#7A4A26', leaf: '#3F9A46', leafSh: '#2C7034', leafLt: '#7FCB62' };
function celMango(c, x, y, r, o = {}) {
  if (r <= 1 || (o.a ?? 1) <= .02) return [x, y];
  const C = { ...CEL_MANGO, ...(o.pal || {}) };
  c.save(); c.translate(x, y); c.rotate(o.rot ?? .32); c.globalAlpha *= (o.a ?? 1); c.scale(r / 60, r / 60);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  // the leaf first, behind the stalk
  if (o.leaf !== false) celShape(c, [[4, -70], [34, -98], [78, -108], [104, -96], [70, -72], [30, -64]], C.leaf, { n: 4, w: 3.6, shade: [C.leafSh, 3, 5], lt: [C.leafLt, -2, -3], over: q => { q.strokeStyle = rgba(C.leafSh, .9); q.lineWidth = 2.6; q.beginPath(); q.moveTo(8, -70); q.quadraticCurveTo(50, -92, 98, -97); q.stroke(); } });
  celShape(c, [[-6, -78], [10, -78], [22, -62], [26, -48], [44, -60], [56, -40], [60, -4], [54, 36], [34, 66], [6, 82], [-22, 78], [-46, 60], [-58, 30], [-60, -8], [-50, -46], [-28, -70]], C.col, {
    shade: [C.sh, 8, 10], lt: [C.lt, -5, -6], w: 5,
    over: q => {
      let g = q.createRadialGradient(34, -46, 0, 34, -46, 70); g.addColorStop(0, rgba(C.blush, .95)); g.addColorStop(.6, rgba(C.blush, .45)); g.addColorStop(1, rgba(C.blush, 0)); q.fillStyle = g; q.fillRect(-80, -100, 160, 200);
      g = q.createRadialGradient(4, -72, 0, 4, -72, 34); g.addColorStop(0, rgba(C.green, .9)); g.addColorStop(1, rgba(C.green, 0)); q.fillStyle = g; q.fillRect(-60, -110, 120, 90);
      ellipse(q, -30, -26, 11, 24, 'rgba(255,255,255,.75)', .35); ellipse(q, -22, 14, 5, 7, 'rgba(255,255,255,.6)');
      q.fillStyle = rgba(C.sh, .5); for (const [dx, dy] of [[-18, 40], [10, 52], [24, 20], [-40, 8], [36, -10]]) { q.beginPath(); q.arc(dx, dy, 2.2, 0, TAU); q.fill(); }
    } });
  celShape(c, celTube([[2, -76], [0, -92], [6, -104]], [11, 10, 9]), C.stalk, { dense: true, w: 3.6 });
  const top = at(4, -100);
  c.restore();
  return top;
}
// celMangoSeed(c, x, y, r, o): the stone of an eaten mango (a guthli), licked clean: a flat pale oval with fibres all
// round it, a shine; o.rot, o.a, o.flat (0..1: lying on the ground, squashed toward us)
function celMangoSeed(c, x, y, r, o = {}) {
  if (r <= 1 || (o.a ?? 1) <= .02) return;
  c.save(); c.translate(x, y); c.rotate(o.rot ?? -.3); c.globalAlpha *= (o.a ?? 1); c.scale(r / 40, r / 40 * lerp(1, .62, clamp(o.flat || 0)));
  for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, rx = 40, ry = 56, p0 = [Math.cos(a) * rx * .9, Math.sin(a) * ry * .9], p1 = [Math.cos(a + .08) * (rx + 10 + hash(i + 3) * 6), Math.sin(a + .08) * (ry + 10 + hash(i + 7) * 6)]; celLine(c, [p0, p1], 2.6, { col: '#C9A04E', boil: .5 }); }
  celOval(c, 0, 0, 40, 56, '#F4DC92', { w: 4.5, shade: ['#D9B45E', 6, 8], over: q => {
    q.strokeStyle = 'rgba(201,160,78,.8)'; q.lineWidth = 2.4; for (const k of [-.5, 0, .5]) { q.beginPath(); q.moveTo(k * 30, -48); q.quadraticCurveTo(k * 40, 0, k * 30, 48); q.stroke(); }
    ellipse(q, -14, -24, 7, 14, 'rgba(255,255,255,.8)', .3);
  } });
  c.restore();
}
// celLeafPlate(c, x, y, s, th, o): a piece of banana leaf lying flat as a plate, its middle at (x, y), about 340 × 140 px at
// s = 1 seen from the front and a little above (o.k the squash, default .3); th turns it round on the spot (0: its long
// way across the screen). Its two ends (u = ±o.end, default 100) are where things sit: returns { a, b } (the +u and -u
// ends: [x, y, depth], depth -1 far .. 1 near). Spun fast (o.blur 0..1) it smears into a disc with speed lines
function celLeafPlate(c, x, y, s = 1, th = 0, o = {}) {
  const K = o.k ?? .3, L = 170, Wd = 66, cs = Math.cos(th), sn = Math.sin(th);
  const P = (u, v) => [x + (u * cs - v * sn) * s, y + (u * sn + v * cs) * s * K];
  const out = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, ca = Math.cos(a), sa = Math.sin(a), sq = Math.pow(Math.abs(ca), .35) * Math.sign(ca); out.push(P(sq * L * (1 - .04 * Math.sin(a * 9)), sa * Wd * (1 - .25 * ca * ca))); }
  const blur = clamp(o.blur || 0);
  if (blur > .02) { c.save(); c.globalAlpha *= .35 * blur; ellipse(c, x, y, L * s * 1.02, L * s * K * 1.02, '#7FCB62'); c.restore(); }
  celShape(c, out, '#5DBA4E', { dense: true, w: 4.5, shade: ['#3F9440', 0, 6 * s], lt: ['#8FDA6E', 0, -4 * s], over: q => {
    q.strokeStyle = 'rgba(46,120,52,.55)'; q.lineWidth = 2.4 * s;
    for (let i = -7; i <= 7; i++) { if (!i) continue; const u = i * 22; q.beginPath(); q.moveTo(...P(u, 0)); q.lineTo(...P(u + Math.sign(i) * 16, Wd)); q.moveTo(...P(u, 0)); q.lineTo(...P(u + Math.sign(i) * 16, -Wd)); q.stroke(); }
    q.strokeStyle = '#D6EE96'; q.lineWidth = 7 * s; q.beginPath(); q.moveTo(...P(-L * .98, 0)); q.lineTo(...P(L * .98, 0)); q.stroke();
  } });
  if (blur > .02) for (let i = 0; i < 3; i++) {
    const a0 = th + i * 2.1, arc = []; for (let j = 0; j <= 10; j++) { const a = a0 + j * .09; arc.push([x + Math.cos(a) * L * 1.12 * s, y + Math.sin(a) * L * 1.12 * s * K]); }
    celLine(c, arc, 4 * s, { col: rgba(CEL.ink, .5 * blur), taper: .9 });
  }
  const end = o.end ?? 100, A = P(end, 0), B = P(-end, 0);
  return { a: [A[0], A[1], sn], b: [B[0], B[1], -sn] };
}
// celRock(c, x, y, s): a flat-topped grey boulder to set things on, its base's middle at (x, y), its top at y - 150 s,
// about 350 px wide at s = 1, lumpy sides, a crack, grass at its foot; returns the top's middle
const CEL_ROCK = { col: '#BDB3AA', sh: '#958A82', lt: '#D9D1C8', top: '#D3CABF', topLt: '#EAE3DA', crack: '#7C7068' };
function celRock(c, x, y, s = 1, o = {}) {
  const C = { ...CEL_ROCK, ...(o.pal || {}) };
  c.save(); c.translate(x, y); c.scale(s, s);
  celShape(c, [[-150, -156], [-178, -120], [-186, -70], [-172, -24], [-120, 2], [-40, 6], [50, 4], [130, 0], [176, -30], [188, -84], [176, -134], [140, -160]], C.col, { shade: [C.sh, 10, 12], lt: [C.lt, -8, -4], over: q => {
    q.strokeStyle = rgba(C.crack, .75); q.lineWidth = 3.4; q.beginPath(); q.moveTo(-110, -128); q.lineTo(-92, -90); q.lineTo(-104, -52); q.lineTo(-86, -24); q.moveTo(100, -140); q.lineTo(118, -98); q.stroke();
    q.fillStyle = rgba(C.crack, .3); for (const [dx, dy, r] of [[-50, -70, 14], [40, -50, 10], [140, -70, 12], [-150, -70, 9], [70, -104, 8]]) { q.beginPath(); q.ellipse(dx, dy, r, r * .6, .3, 0, TAU); q.fill(); }
    q.fillStyle = 'rgba(120,170,90,.55)'; for (const [dx, dy] of [[-160, -40], [-130, -20], [150, -30]]) { q.beginPath(); q.ellipse(dx, dy, 16, 8, .4, 0, TAU); q.fill(); }
  } });
  celShape(c, [[-150, -156], [-90, -186], [0, -192], [92, -186], [140, -160], [60, -132], [-40, -130], [-120, -138]], C.top, { n: 4, w: 4.5, over: q => ellipse(q, -30, -168, 80, 12, rgba(C.topLt, .9), -.04) });
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) celLine(c, [[sd * (160 + i * 16), 2], [sd * (166 + i * 18), -24 - (i % 2) * 10], [sd * (176 + i * 16), 0]], 3.4, { col: '#4F9A44', boil: .5 });
  c.restore();
  return [x, y - 160 * s];
}
// celMangoTree(c, x, y, s, t, o): a big mango tree, its trunk's foot at (x, y), the crown spreading about 900 px left of the
// trunk and 300 right at s = 1, its underside about 860 above the foot: a dense dome of dark glossy leaves, lighter clumps,
// mangoes hanging on long stalks (o.fruit: [[dx, dy, r], ...] from the trunk's foot), swaying a little with t; o.crown its
// clumps ([[dx, dy, r], ...]), o.h the trunk's height × (to raise the crown)
function celMangoTree(c, x, y, s = 1, t = 0, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const sway = Math.sin(t * .9) * 4, h = o.h ?? 1;
  celShape(c, [[-46, 0], [-38, -260], [-60, -520], [-120, -760], [-80, -790], [-20, -600], [10, -760], [40, -800], [30, -540], [44, -260], [56, 0]].map(([px, py]) => [px, py * h]), '#8A5A36', { shade: ['#64401F', 10, 0], lt: ['#AE7A4E', -8, 0], over: q => {
    q.strokeStyle = 'rgba(80,50,24,.55)'; q.lineWidth = 3; for (const [x0, y0, x1, y1] of [[-10, -40, -4, -200], [20, -120, 12, -300], [-24, -330, -40, -470]]) { q.beginPath(); q.moveTo(x0, y0); q.quadraticCurveTo(x0 + 10, (y0 + y1) / 2, x1, y1); q.stroke(); }
  } });
  for (const sd of [-1, 1]) celShape(c, celTube([[sd * 40, -4], [sd * 80, 6], [sd * 110, 4]], [26, 16, 6]), '#8A5A36', { dense: true, w: 4 });
  // the fruit's stalks hang from under the crown, so draw them first
  for (const [dx, dy, r] of o.fruit || []) {
    const fx = dx + sway * (1 + dy / -800) * .5;
    celLine(c, [[dx * .96, -830 * h], [fx, dy - r * 1.1]], 3.2, { col: '#5A3A1E', boil: .4 });
    celMango(c, fx, dy, r, { rot: .1 + Math.sin(t * 1.3 + dx) * .06, leaf: false });
  }
  // the crown: overlapping clumps, darker at the back
  const clump = (cx, cy, r, col, sh, lt, sd) => {
    const P = []; for (let i = 0; i < 36; i++) { const a = i / 36 * TAU, k = 1 + .09 * Math.abs(Math.sin(a * 6 + sd)); P.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * .72 * k]); }
    celShape(c, P, col, { dense: true, w: 5, shade: [sh, 8, 12], lt: [lt, -6, -8], over: q => {
      q.fillStyle = rgba(lt, .55); for (let i = 0; i < 7; i++) { const a = hash(sd * 7 + i) * TAU, d = hash(sd * 3 + i + 1) * r * .7; q.save(); q.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .7 - r * .1); q.rotate(a); q.beginPath(); q.ellipse(0, 0, 16, 5, 0, 0, TAU); q.fill(); q.restore(); }
    } });
  };
  const B = o.crown || [[-760, -1040, 230], [-480, -1120, 280], [-180, -1100, 280], [120, -1060, 230], [-620, -900, 200], [-320, -930, 240], [-20, -920, 220], [200, -900, 150]];
  B.forEach(([cx, cy, r], i) => clump(cx + sway * (i % 2 ? 1 : -1) * .4, cy, r, i < 4 ? '#2E7A3E' : '#3C9248', i < 4 ? '#225E30' : '#2C7438', i < 4 ? '#4E9C56' : '#64B262', i + 1));
  c.restore();
}

// ---------- #11 fake sleep: Shesha, the snot bubble, a thali and ladle, a conch ----------
// celShesha(c, x, y, s, P, o): a little Shesha (Ananta) as a bed, white "like a lotus stalk" with jewels on his hoods
// (Bhagavata 3.8.23): two coils piled up as a mattress (about ±300 px wide at s = 1, its base's middle at (x, y)), his neck
// rising behind the bed's screen-left end to a fan of five hoods (o.hx: the fan's x, local; its middle hood ~525 px up).
// P like a kid's face on the middle hood (eyes, look, lid, brow, tilt, blush, mouth, talk, sweat), side (the four small
// faces: 'open' | 'happy' | 'sleep' | 'dizzy' | 'flat'), lean (the fan sways), hop (the hoods jump up), squash, tail (its tip
// flicking 0..1). o.part 'back' (coils, neck, hoods) | 'front' (the top coil's front half and the tail, over a kid lying on
// him) | 'all'. Returns { head, top, heads, bed (the top's middle), lie (where a lying kid's centre line sits) }
const CEL_SHESHA = { skin: '#EEF0FF', sh: '#C3C4EC', lt: '#FFFFFF', hoodOut: '#B9BDEB', scale: '#CDD0F2', belly: '#F8DC8E', bellySh: '#E2BC5E', hood: '#FBE3A0', hoodSh: '#E8C468', gem: '#E2345A',
  iris: '#2A1E46', iris2: '#7A62C8', blush: '#FF9AB8', mouth: '#5A1E3A', tongue: '#F04E6A' };
function celShesha(c, x, y, s, P, o = {}) {
  const C = { ...CEL_SHESHA, ...(o.pal || {}) }, td = P.td ?? o.t ?? 0, A = {}, body = { shade: [C.sh, 8, 10], lt: [C.lt, 4, 5] }, part = o.part || 'all';
  celBegin(td); CEL.n = o.seed ?? 1700;
  const land = P.land ?? 9, hit = land >= 0 ? Math.exp(-land * 10) : 0, sq = clamp((P.squash || 0) + hit * .3, -1, 1), br = Math.sin(td * TAU / 3.2);
  c.save(); c.translate(x, y); c.scale(s, s);
  const at = (px, py) => { const p = c.getTransform().transformPoint(new DOMPoint(px, py)); return [p.x, p.y]; };
  const arc = (cy, rx, ry, a0, a1) => { const Q = []; for (let i = 0; i <= 10; i++) { const a = lerp(a0, a1, i / 10); Q.push([Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return Q; };
  const scales = (cy, rx, ry, w) => { for (let i = 1; i < 10; i++) { const a = lerp(.08, Math.PI - .08, i / 10); ellipse(c, Math.cos(a) * rx, cy + Math.sin(a) * ry - w * .14, 7, 4.5, rgba(C.lt, .95)); } };
  const front = (cy, rx, ry, w) => {
    celShape(c, celTube(arc(cy, rx, ry, -.05, Math.PI + .05), [w, w * 1.04, w * 1.06, w * 1.04, w]), C.skin, { dense: true, ...body, over: q => {
      q.strokeStyle = C.belly; q.lineWidth = w * .16; q.lineCap = 'round'; q.beginPath(); for (let i = 2; i <= 8; i++) { const a = lerp(0, Math.PI, i / 10); q.lineTo(Math.cos(a) * rx * .985, cy + Math.sin(a) * ry + w * .32); } q.stroke();
    } });
    scales(cy, rx, ry, w); chev(cy, rx, ry, w);
  };
  const back = (cy, rx, ry, w) => { celShape(c, celTube(arc(cy, rx, ry, Math.PI * 1.03, Math.PI * 1.97), [w * .9, w * .86, w * .84, w * .86, w * .9]), C.skin, { dense: true, ...body }); };
  const chev = (cy, rx, ry, w) => { for (let i = 1; i < 12; i++) { const a = lerp(.1, Math.PI - .1, i / 12), px = Math.cos(a) * rx, py = cy + Math.sin(a) * ry - w * .12; celLine(c, [[px - 12, py - 12], [px, py - 2], [px + 12, py - 12]], 3.2, { col: C.scale, boil: .3, taper: .2 }); } };
  const HX = o.hx ?? -150, HY = (o.hy ?? -525) - (P.hop || 0);
  A.bed = at(0, -196); A.lie = at(0, -265);
  if (part !== 'front') {
    back(-52, 300, 40, 104); front(-52, 300, 40, 104);
    // the neck: out of the bed behind its screen-left end (the top coil's back covers its root), up behind the kid's head to the fan
    const nb = [HX + 96, -150], nt = [HX + (P.lean || 0) * 60, HY + 120];
    celShape(c, celTube([nb, [HX + 80, -280], [lerp(HX + 60, nt[0], .5), lerp(-380, nt[1], .5)], nt], [96, 88, 80, 76]), C.skin, { dense: true, ...body, over: q => { for (let i = 0; i < 4; i++) { const u = .2 + i * .2; ellipse(q, lerp(nb[0], nt[0], u) - 6, lerp(nb[1], nt[1], u), 22, 8, C.belly); } } });
    back(-138, 262, 34, 92);
    // the fan of hoods, swaying about the neck's top, squashing on a jolt
    c.save(); c.translate(nt[0], nt[1]); c.rotate((P.lean || 0) * .5 + br * .012); c.scale(1 + sq * .08, 1 - sq * .12 + br * .008); c.translate(-nt[0], -nt[1]);
    const hood = (hx, hy, r, rot, face) => {
      celShape(c, celTube([nt, [lerp(nt[0], hx, .6), lerp(nt[1], hy, .6) + 10], [hx, hy + r * .4]], [70, 60, r * .8]), C.skin, { dense: true, ...body });
      c.save(); c.translate(hx, hy); c.rotate(rot);
      celShape(c, [[0, -r * .96], [r * .72, -r * .76], [r, -r * .12], [r * .84, r * .56], [r * .36, r * .96], [-r * .36, r * .96], [-r * .84, r * .56], [-r, -r * .12], [-r * .72, -r * .76]], C.skin, { ...body, over: q => {
        q.strokeStyle = C.hoodOut; q.lineWidth = r * .22; q.beginPath(); q.ellipse(0, r * .1, r * .86, r * .86, 0, 0, TAU); q.stroke();
        ellipse(q, 0, r * .18, r * .62, r * .66, C.hood);
        for (let i = 0; i < 3; i++) celLine(q, [[-r * .42, r * (.42 + i * .17)], [0, r * (.52 + i * .17)], [r * .42, r * (.42 + i * .17)]], 2.6, { col: rgba(C.hoodSh, .9), boil: .3, taper: .3 });
      } });
      celShape(c, [[0, -r * 1.02], [r * .1, -r * .88], [0, -r * .74], [-r * .1, -r * .88]], C.gem, { n: 2, w: 3, boil: .3, over: q => ellipse(q, -r * .03, -r * .9, r * .03, r * .04, '#FFFFFF') });   // a jewel (3.8.23)
      face(r); c.restore();
      return at(hx, hy);
    };
    const small = r => celMiniFace(c, 0, -r * .16, r / 52, P.side || 'sleep', C.blush), heads = [];
    const hk = o.hk ?? 1;
    for (const sd of [-1, 1]) heads.push(hood(HX + sd * 205 * hk, HY + 95 * hk, 60 * hk, sd * .55, small));
    for (const sd of [-1, 1]) heads.push(hood(HX + sd * 112 * hk, HY + 30 * hk, 74 * hk, sd * .28, small));
    const MR = 96 * hk;
    heads.splice(2, 0, hood(HX, HY, MR, 0, r => {
      c.save(); c.translate(0, -r * .24);
      celFace(c, P, C, { face: { ex: 70, ey: 0, my: 64, bx: 104, by: 40, k: .52 }, seed: 17 });
      if ((P.sweat || 0) > .02) celSweat(c, -r * .95, -r * .3, clamp(P.sweat) * .8);
      c.restore();
    }));
    A.head = at(HX, HY - MR * .24); A.top = at(HX, HY - MR); A.heads = heads;
    c.restore();
  }
  if (part !== 'back') {
    front(-138, 262, 34, 92);
    // the tail: out of the lower coil's screen-right end, along the ground, its tip curling up (and flicking)
    const fl = Math.sin(td * 9) * 10 * clamp(P.tail || 0), tip = [372 + fl * .4, -96 + fl];
    celShape(c, celTube([[262, -30], [318, -18], [366, -40], [tip[0] + 6, tip[1] + 28], tip], [70, 50, 34, 22, 12]), C.skin, { dense: true, ...body });
  }
  c.restore();
  return A;
}
// a snot bubble (asleep): blown from the nostril, r its radius, in head coordinates; a "pop" when it bursts
function celSnot(c, x, y, r, pop = 0) {
  if (pop > 0) { if (pop < 1) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, d = r * (1 + pop * 1.4); celLine(c, [[x + Math.cos(a) * d * .7, y + Math.sin(a) * d * .7], [x + Math.cos(a) * d, y + Math.sin(a) * d]], 4 * (1 - pop), { col: '#7CC4F0', boil: .3 }); } return; }
  if (r <= 2) return;
  celShape(c, celEll(x, y, r, r * .96, 0, 28), 'rgba(196,232,255,.55)', { dense: true, w: Math.max(2.4, r * .06), boil: .3, over: q => {
    ellipse(q, x - r * .38, y - r * .4, r * .22, r * .13, 'rgba(255,255,255,.95)', -.7); ellipse(q, x + r * .4, y + r * .38, r * .08, r * .08, 'rgba(255,255,255,.8)');
  } });
}
// a brass plate seen face on (a thali held up to bang), (x, y) its middle, r its radius; rot tilts it, sq squashes it
function celPlate(c, x, y, r, o = {}) {
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(1, o.sq ?? 1);
  celOval(c, 0, 0, r, r, '#EBB43E', { w: 4.5, shade: ['#BC8422', r * .07, r * .09], lt: ['#FFDB80', r * .04, r * .05], over: q => {
    q.strokeStyle = 'rgba(160,100,20,.6)'; q.lineWidth = 3.5; q.beginPath(); q.arc(0, 0, r * .78, 0, TAU); q.stroke();
    ellipse(q, -r * .36, -r * .38, r * .3, r * .1, 'rgba(255,250,220,.85)', -.75);
  } });
  c.restore();
}
// a brass ladle (a kalchhi): gripped at (x, y), pointing along rot, len long, its bowl at the far end
function celLadle(c, x, y, len = 170, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  celShape(c, celTube([[-len * .15, 0], [len * .78, 0]], [13, 10]), '#D7A33A', { dense: true, w: 4, shade: ['#A87A20', 0, 4] });
  celOval(c, len * .9, 0, len * .16, len * .13, '#EBB43E', { w: 4, shade: ['#BC8422', 4, 5], over: q => ellipse(q, len * .86, -len * .04, len * .06, len * .03, 'rgba(255,250,220,.9)', -.4) });
  c.restore();
}
// a conch (shankh): its blowing end at (x, y), its body along rot, s its scale (about 170 px long at s = 1)
function celConch(c, x, y, s = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  celShape(c, [[0, -7], [28, -20], [66, -40], [108, -50], [142, -40], [162, -18], [170, 0], [162, 16], [132, 36], [92, 46], [52, 32], [18, 12], [0, 7]], '#FBF5EA', { shade: ['#E2D3BC', 0, 9], lt: ['#FFFFFF', 0, -5] });
  celShape(c, [[44, 24], [84, 40], [124, 34], [104, 22], [66, 16]], '#F6AE92', { n: 3, w: 3.5, shade: ['#E08A70', 0, 4] });
  for (let i = 0; i < 3; i++) celLine(c, [[124 + i * 14, -40 + i * 6], [134 + i * 12, -10], [128 + i * 14, 22 - i * 4]], 3, { col: rgba(CEL.ink, .6), boil: .3 });
  celBand(c, [0, 0], [60, -10], .12, 20, 7, '#F2B52E');
  c.restore();
}

// ---------- #12 the mirror: a shiny thali ----------
// celMirrorPlate(c, x, y, r, o): a polished brass thali held up as a mirror, (x, y) its centre, r its radius: a brass rim, a
// bright metal face showing o.reflect(c, ri) (clipped inside the face, drawn in the plate's frame), a warm tint over it, a
// darker edge, a shine band sweeping across (o.shine 0..1, its position; o.glint 0..1 a twinkle on the rim); o.rot, o.sq
function celMirrorPlate(c, x, y, r, o = {}) {
  const ri = r * .8;
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(1, o.sq ?? 1);
  celOval(c, 0, 0, r, r, '#E9B545', { w: 5, shade: ['#B9822A', r * .06, r * .08], lt: ['#FFE08A', -r * .03, -r * .04], over: q => {
    q.strokeStyle = 'rgba(150,96,22,.5)'; q.lineWidth = 3; q.beginPath(); q.arc(0, 0, r * .9, 0, TAU); q.stroke();
  } });
  c.save(); c.beginPath(); c.arc(0, 0, ri, 0, TAU); c.clip();
  let g = c.createLinearGradient(0, -ri, 0, ri); g.addColorStop(0, '#FBF6EC'); g.addColorStop(.55, '#EEE6D6'); g.addColorStop(1, '#DCCFB2');
  c.fillStyle = g; c.fillRect(-ri, -ri, ri * 2, ri * 2);
  if (o.reflect) { c.save(); o.reflect(c, ri); c.restore(); }
  c.fillStyle = 'rgba(255,212,136,.16)'; c.fillRect(-ri, -ri, ri * 2, ri * 2);
  g = c.createRadialGradient(0, 0, ri * .55, 0, 0, ri); g.addColorStop(0, 'rgba(150,100,30,0)'); g.addColorStop(1, 'rgba(150,100,30,.34)');
  c.fillStyle = g; c.fillRect(-ri, -ri, ri * 2, ri * 2);
  const sx = lerp(-1.6, 1.6, o.shine ?? .25) * ri;
  c.save(); c.rotate(-.7); g = c.createLinearGradient(sx - ri * .35, 0, sx + ri * .35, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.35, 'rgba(255,255,255,.32)'); g.addColorStop(.5, 'rgba(255,255,255,.5)'); g.addColorStop(.62, 'rgba(255,255,255,.2)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(-ri * 2, -ri * 2, ri * 4, ri * 4); c.restore();
  ellipse(c, -ri * .5, -ri * .55, ri * .2, ri * .07, 'rgba(255,255,255,.75)', -.75);
  c.restore();
  const E = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU; E.push([Math.cos(a) * ri, Math.sin(a) * ri]); }
  celLine(c, E, 4, { taper: 0, boil: .4, col: rgba('#7A4C10', .85) });
  if ((o.glint || 0) > .02) celSparkle(c, r * .62, -r * .62, r * .34 * o.glint, { rot: .2 });
  c.restore();
}
