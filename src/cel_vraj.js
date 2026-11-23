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
  const R = who === 'radha', C = { flute: CEL_KANHA.flute, fluteSh: CEL_KANHA.fluteSh, ...(R ? CEL_RADHA : CEL_KANHA), ...(o.pal || {}) }, A = {}, td = P.td ?? o.t ?? 0;
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
  c.save(); c.translate(hip[0], hip[1]); c.rotate(lag.lean || 0); c.translate(...NECK); c.rotate((lag.head || 0) * .85); c.scale(sx, sy); c.translate(...HC);
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

  // the legs and feet (Radha's only peep out under her lehenga)
  const legs = [-1, 1].map(sd => {
    const f0 = (sd < 0 ? P.fL : P.fR) || [sd * 44, 0], f = [f0[0], f0[1] - hop], hj = Wp([sd * 30, -6]);
    const [knee, ank] = celIK(hj, [f[0], f[1] - 16], 56, 56, (sd < 0 ? P.kL : P.kR) || [sd, -.3]);
    return { sd, hj, knee, ank, f };
  });
  const foot = L => { const d = v2.norm(v2.sub(L.ank, L.knee)); celOval(c, L.ank[0] + L.sd * 8 + d[0] * 9, L.ank[1] + d[1] * 9 + 3, 34, 17, C.skin, { ...skin, rot: Math.atan2(d[1], d[0]) - Math.PI / 2 }); };
  for (const L of legs) {
    if (R) { celShape(c, celTube([v2.lerp(L.knee, L.ank, .3), L.ank], [42, 40]), C.skin, { dense: true, ...skin }); foot(L); celBand(c, L.knee, L.ank, .86, 44, 9, C.gold); }
    else { celShape(c, celTube([L.hj, L.knee, L.ank], [64, 54, 46]), C.skin, { dense: true, ...skin }); foot(L); celBand(c, L.knee, L.ank, .84, 50, 10, C.gold); }
  }
  A.feet = legs.map(L => at(...L.f));

  if (!R) {
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
    const fx0 = Math.min(legs[0].f[0], legs[1].f[0]), fx1 = Math.max(legs[0].f[0], legs[1].f[0]), hy = -12 - hop;
    const sw = Math.sin(td * 2.6) * 4 - (lag.lean || 0) * 70, hl = fx0 - 76 + sw, hr = fx1 + 76 + sw;
    const H = []; for (let i = 0; i <= 8; i++) H.push([lerp(hl, hr, i / 8), hy + (i % 2 ? 7 : -3) + Math.sin(i / 8 * Math.PI) * 6]);
    const border = q => {
      q.strokeStyle = C.gold; q.lineWidth = 34; q.lineJoin = 'round'; q.beginPath(); H.forEach((p, i) => i ? q.lineTo(...p) : q.moveTo(...p)); q.stroke();
      q.strokeStyle = C.red; q.lineWidth = 5; q.beginPath(); H.forEach((p, i) => i ? q.lineTo(p[0], p[1] - 19) : q.moveTo(p[0], p[1] - 19)); q.stroke();
      for (let i = 0; i < 9; i++) { const u = (i + .5) / 9, yy = lerp(-40, hy - 30, (i % 3) / 3 + .2); ellipse(q, lerp(lerp(Wp([-50, 0])[0], hl, .7), lerp(Wp([50, 0])[0], hr, .7), u), yy, 5, 5, C.gold); }
    };
    celShape(c, [Wp([-58, -40]), Wp([-66, -8]), [hl + 6, hy - 14], ...H, [hr - 6, hy - 14], Wp([66, -8]), Wp([58, -40])], C.lehenga, { n: 3, shade: sh(C.lehSh), lt: lt(C.lehLt), over: border });
    for (const k of [-.5, 0, .5]) celLine(c, [Wp([k * 60, -30]), [lerp(hl, hr, .5 + k * .62), hy - 26]], 3, { col: rgba(CEL.ink, .7) });
    celLine(c, [Wp([-60, -40]), Wp([0, -34]), Wp([60, -40])], 16, { under: C.red, taper: 0 });
  } else {
    // the kardhani with little bells, and the flute tucked in at the waist
    c.save(); c.translate(hip[0], hip[1]); c.rotate(lean);
    celLine(c, [[-72, -40], [0, -30], [72, -40]], 15, { under: C.gold, taper: 0 });
    for (let i = 0; i < 5; i++) { const u = -52 + i * 26; celOval(c, u, -24 + Math.abs(u) * -.1, 6.5, 7, C.gold, { w: 2.4, boil: .3 }); }
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
  } else {
    // the vaijayanti mala
    for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; celOval(c, -50 * Math.cos(a), -150 + 96 * Math.sin(a), 9.5, 9.5, C.mala[i % 4], { w: 2.4, boil: .3 }); }
  }

  // the head
  c.save(); c.translate(...NECK); c.rotate(P.head || 0); c.scale(sx, sy); c.translate(...HC);
  if (!R) for (const sd of [-1, 1]) { celOval(c, sd * 166, 26, 24, 32, C.skin, skin); celLine(c, [[sd * 170, 12], [sd * 162, 28], [sd * 170, 42]], 3); }
  celShape(c, [[-150, -128], [-80, -160], [0, -166], [80, -160], [150, -128], [172, -30], [168, 50], [142, 112], [72, 142], [0, 148], [-72, 142], [-142, 112], [-168, 50], [-172, -30]], C.skin, {
    shade: [C.sh, 10, 12], lt: [C.lt, 6, 6],
    over: q => { const g = q.createRadialGradient(-30, 30, 0, -30, 30, 200); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = g; q.fillRect(-200, -200, 400, 400); },
  });
  A.head = at(0, 0); A.mouth = at(0, 92); A.cheekL = at(-112, 72); A.cheekR = at(112, 72);
  if (R) {
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
    c.save(); c.translate(26, -214); c.rotate(.38 + fw);
    celShape(c, [[0, 6], [-20, -60], [-30, -130], [-16, -196], [0, -214], [16, -196], [30, -130], [20, -60]], C.feather, { w: 4, shade: ['#2A7444', 6, 4], over: q => {
      q.strokeStyle = rgba(C.featherLt, .9); q.lineWidth = 2.5; for (let i = 0; i < 9; i++) { const yy = -30 - i * 18; q.beginPath(); q.moveTo(0, yy); q.lineTo(-22, yy - 14); q.moveTo(0, yy); q.lineTo(22, yy - 14); q.stroke(); }
      ellipse(q, 0, -158, 22, 28, C.fEye1); ellipse(q, 0, -156, 15, 20, C.fEye2); ellipse(q, 0, -152, 8, 11, C.fEye3);
    } });
    celLine(c, [[0, 4], [0, -150]], 3, { col: '#1E5A34', taper: .3, boil: .4 });
    c.restore();
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
  c.restore();   // head

  // playing the flute (P.flute 'play'): from just right of the lips, down across the chin toward the screen-left hand (hL),
  // under the arms so both hands hold it; a little red tassel swings from its far end
  if (P.flute === 'play') {
    const h = P.head || 0, lx = 34 * sx, ly = (-138 + 96) * sy, S = [NECK[0] + lx * Math.cos(h) - ly * Math.sin(h), NECK[1] + lx * Math.sin(h) + ly * Math.cos(h)];
    const d = v2.norm(v2.sub(P.hL || [-120, -120], S)), a = v2.add(S, v2.mul(d, -18)), b = v2.add(S, v2.mul(d, 290));
    celFluteAt(c, a, b, C, td);
    A.fluteLip = at(...a); A.fluteEnd = at(...b);
  }

  // the arms, last (they reach across the face)
  for (const sd of [-1, 1]) {
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
  }
  c.restore();   // upper body
  c.restore();
  return A;
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
