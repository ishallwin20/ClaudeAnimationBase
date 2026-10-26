// story_review.js: the Book 1 review Story (story_review.html, Storybook style, 24 s). A parent found Book 1 on
// Instagram, bought it and left five stars on Amazon (Nikhil, 21 Oct 2026, Verified Purchase); the Story letters their
// words, verbatim, one beat a wall: the headline and five stars, the Insta post, the little one asking to re-read it
// (Mooshak with the book and a cloud of question marks), "Indian history at this age", then the Book 1 card with ₹200,
// the set note and an empty slot for the link sticker. Stories cover the top ~220 px and the bottom ~280 px: everything
// sits in y 220–1640. The times are the cue list for tools/story_review_sfx.mjs too.
const RV = { hook: 0, insta: 4.2, like: 5.6, glad: 6.4, kid: 8.6, ask: 10.9, hist: 13.4, card: 17.4, end: 24, wipe: .45 };
const RV_GOLD = '#FFD24A', RV_TEAL = '#2E5F5A', RV_ORANGE = '#F15A24';

// a soft five-pointed star (the review's stars), r the outer radius
function rvStar(c, x, y, r, col = RV_GOLD, o = {}) {
  const P = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .5 : r; P.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); }
  sbShape(c, sbPoly(P, { n: 3, jit: .6 }), col, { tex: false, shade: o.shade ?? ['rgba(200,110,0,.35)', .9, .4] });
}
// a row of n stars centred on x; pulse(i) → 0..1 bumps star i
function rvStars(c, x, y, r, gap, pulse = () => 0) {
  for (let i = 0; i < 5; i++) { const k = 1 + .28 * pulse(i), sx = x + (i - 2) * gap; c.save(); c.translate(sx, y); c.scale(k, k); rvStar(c, 0, 0, r); c.restore(); }
}
// a little sparkle burst (four dry dashes and a dot) for age 0 … .5
function rvSparkle(c, x, y, age, r = 90, col = SB.white) {
  if (age < 0 || age > .55) return; const f = easeOut(age / .55), a = 1 - age / .55;
  for (let i = 0; i < 6; i++) { const ang = i / 6 * TAU + .3, r0 = r * (.45 + f * .5), r1 = r * (.6 + f * .75); sbLine(c, [[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], 7, col, { alpha: a, taper: .4 }); }
}
// a heart (the like), w wide
function rvHeart(c, x, y, w, col = '#F0425A') {
  const s = w / 100, P = [[0, -22], [24, -46], [50, -36], [52, -6], [26, 26], [0, 46], [-26, 26], [-52, -6], [-50, -36], [-24, -46]].map(([a, b]) => [x + a * s, y + b * s]);
  sbShape(c, sbPoly(P, { n: 5, jit: .5 }), col, { tex: false, spot: [x - 20 * s, y - 24 * s, 22 * s, 'rgba(255,255,255,.45)'] });
}
// a paper pill with a label (the hook's tag)
function rvTag(c, txt, col, x, y, age, font = '700 34px Poppins') {
  const k = popK(age); if (k < .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.font = font; const w = c.measureText(txt).width / 2 + 34;
  sbShape(c, sbPoly([[-w, -30], [w, -32], [w + 4, 30], [-w + 2, 31]], { n: 6, jit: .8 }), col, { tex: false }); c.restore();
  text(c, txt, x, y + 2, font, '#FFFFFF', { pop: age, spacing: 1 });
}
// Mooshak (the little one) holding the Book 1 cover up in front of him, paws on its edges
function rvMouseBook(c, x, y, s, o = {}) {
  sbMouse(c, x, y, s, o);
  c.save(); c.translate(x, y); c.scale(s, s);
  picture(c, PICS.book1, -130, -300, 270, 270, { rot: .06 + (o.tip || 0), r: 8, shadow: 14 });
  sbEll(c, -262, -302, 38, 30, SB_MOUSE.fur, { rot: .5 }); sbEll(c, 4, -292, 38, 30, SB_MOUSE.fur, { rot: -.5 });
  c.restore();
}
// a paper rectangle w × h (half sizes hw, hh) with softly rounded corners r, as points for sbPoly
const rvRect = (hw, hh, r = 30) => [[-hw + r, -hh], [0, -hh - 1], [hw - r, -hh], [hw, -hh + r], [hw + 1, 0], [hw, hh - r], [hw - r, hh], [0, hh + 1], [-hw + r, hh], [-hw, hh - r], [-hw - 1, 0], [-hw, -hh + r]];
// a blob of the new wall grows over the old one (as ad 53)
function rvWipe(c, t, t0, drawOld, drawNew) {
  const f = seg(t, t0, t0 + RV.wipe);
  if (f >= 1) { drawNew(c); return; }
  drawOld(c);
  c.save(); sbPath(c, sbBlob(540, 1000, 40 + easeIO(f) * 1350, 40 + easeIO(f) * 1350, { wob: .08, seed: 3 })); c.clip(); drawNew(c); c.restore();
}
const rvHop = (t, t0, d = .42, h = 60) => { const f = (t - t0) / d; if (f < 0 || f > 1.25) return [0, 0]; if (f > 1) return [0, -Math.sin((f - 1) / .25 * Math.PI) * .8]; return [-Math.sin(f * Math.PI) * h, Math.sin(f * Math.PI) * .9]; };

// ---------- 1. the hook: the headline, five stars (finished at frame 0; the stars twinkle in turn) ----------
const RV_STAR_T = [.5, .7, .9, 1.1, 1.3];
function rvHook(c, t) {
  sbBg(c, '#6DB8A8', { speck: [34, 'rgba(255,255,255,.35)'], seed: 31 });
  sbCloud(c, 130, 300, 300, '#FFFFFF', .5); sbCloud(c, 980, 1130, 260, '#FFFFFF', .45);
  rvTag(c, 'A NEW REVIEW · BOOK 1', RV_TEAL, 540, 300, 1);
  sbSay(c, '"Finally, | something | *different!*"', 540, 610, 132, { hi: '#FFE066', seed: 32 });
  const pulse = i => { const a = t - RV_STAR_T[i]; return a > 0 && a < .4 ? Math.sin(a / .4 * Math.PI) : 0; };
  rvStars(c, 540, 905, 58, 132, pulse);
  RV_STAR_T.forEach((s, i) => rvSparkle(c, 540 + (i - 2) * 132, 905, t - s - .05, 85));
  text(c, 'from a parent who found us on Insta', 540, 1000, '500 38px Poppins', SB.white, { maxW: 900 });
  sbGround(c, 300, 820, 1590, '#57A090', { seed: 4 });
  const [hy, hs] = rvHop(t, 1.7, .42, 30);
  rvMouseBook(c, 560, 1590 + hy, .58, { t, hop: hs, happy: t > 1.6 && t < 3.2, mouth: t > 1.6 ? 'grin' : 'smile', tip: hs * .05 });
}

// ---------- 2. the Insta post: "Saw this on my Insta feed and took a chance… So glad I did!" ----------
function rvInsta(c, t) {
  const u = t - RV.insta;
  sbBg(c, '#B9A6D8', { speck: [30, 'rgba(255,255,255,.4)'], seed: 41 });
  sbSay(c, '"Saw this on my *Insta* feed | and took a chance…"', 540, 450, 92, { hi: '#FFE066', seed: 42, age: u - .3, maxW: 960, caps: .2 });
  // the phone, tilted a little, bobbing
  const bob = Math.sin(t * 1.6) * 6, k = popK(u - .15);
  c.save(); c.translate(540, 1035 + bob); c.rotate(-.035); c.scale(k, k);
  sbShape(c, sbPoly(rvRect(232, 400, 70), { n: 6, jit: 1 }), '#2E2A36', { tex: false });
  sbShape(c, sbPoly(rvRect(206, 372, 50), { n: 6, jit: .8 }), SB.white, { tex: false });
  picture(c, PICS.logo, -160, -320, 54, 54, { r: 27 });
  c.save(); c.font = '700 28px Poppins'; c.fillStyle = SB.ink; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('therishikatha', -122, -320); c.restore();
  for (const dx of [150, 166, 182]) sbDot(c, dx, -320, 4.5, SB.ink);
  picture(c, PICS.book1, 0, -70, 400, 400);
  // the like: the outline heart fills red with a pop, then a big heart floats up over the post
  const lk = t - RV.like;
  if (lk < 0) { rvHeart(c, -165, 185, 56, '#2E2A36'); rvHeart(c, -165, 187, 38, SB.white); }
  else { const hk = popK(lk); c.save(); c.translate(-165, 185); c.scale(hk, hk); rvHeart(c, 0, 0, 56); c.restore(); }
  sbLine(c, [[-100, 168], [-74, 162], [-58, 178], [-70, 204], [-98, 206], [-112, 190], [-100, 168]], 6, SB.ink, { taper: 0 });
  sbLine(c, [[-20, 200], [26, 166], [8, 206], [-2, 186], [-20, 200]], 6, SB.ink, { taper: 0 });
  sbLine(c, [[148, 166], [182, 166], [182, 208], [165, 194], [148, 208], [148, 166]], 6, SB.ink, { taper: 0 });
  rvSparkle(c, -165, 185, lk, 70, '#F0425A');
  for (const [y, w] of [[262, 330], [306, 250]]) sbShape(c, sbPoly(rvRect(w / 2, 9, 9), { n: 4, jit: .5 }).map(([a, b]) => [a - 180 + w / 2, b + y]), '#DAD4DF', { tex: false });
  if (lk > 0 && lk < 1.1) { const f = easeOut(lk / 1.1), a = lk < .7 ? 1 : 1 - (lk - .7) / .4; c.save(); c.globalAlpha *= a; const hk = popK(lk); c.translate(0, -70 - f * 60); c.scale(hk, hk); rvHeart(c, 0, 0, 220, SB.white); c.restore(); }
  c.restore();
  sbSay(c, '"So glad I *did!*"', 540, 1555, 120, { hi: '#FFE066', seed: 43, age: t - RV.glad });
}

// ---------- 3. the little one: re-reading it, and so many questions ----------
const RV_Q = [[300, 860, -.25, 0], [420, 760, .1, .25], [800, 790, .3, .5], [905, 930, -.15, .75], [250, 1010, .2, 1.0], [690, 700, -.1, 1.2]];
function rvKid(c, t) {
  const u = t - RV.kid, ua = t - RV.ask;
  sbBg(c, '#F36F5E', { speck: [34, 'rgba(255,255,255,.35)'], seed: 51 });
  sbSay(c, '"My little one keeps asking | to *re-read* it…"', 540, 400, 90, { hi: '#FFE066', seed: 52, age: u - .2, maxW: 960 });
  sbSay(c, '"…and has so many | *questions* every time"', 540, 600, 90, { hi: '#FFE066', seed: 53, age: ua, maxW: 960 });
  sbGround(c, 260, 860, 1600, '#D9574A', { seed: 9, n: 30 });
  // a page-turn nod for each re-read, then a head tilt as the questions come
  const nod = ua < 0 ? Math.max(0, Math.sin(u * 3.2)) * .04 : 0, tilt = ua > 0 ? Math.sin(ua * 2.2) * .06 : 0;
  rvMouseBook(c, 600, 1600, .74, { t, tilt: tilt - nod, happy: ua < 0 && frac(u / 1.2) < .55, look: ua > 0 ? [-.4, -.6] : [0, .3], mouth: ua > 0 ? 'o' : 'smile', tip: nod });
  RV_Q.forEach(([x, y, r, d], i) => { const a = ua - d; if (a <= 0) return;
    sbSay(c, '?', x + Math.sin(t * 2 + i) * 8, y + Math.cos(t * 1.7 + i) * 10, 120 + (i % 3) * 22, { col: i % 2 ? '#FFE066' : SB.white, seed: 60 + i, age: a });
    rvSparkle(c, x, y, a - .05, 70, i % 2 ? '#FFE066' : SB.white); });
}

// ---------- 4. "Such an easy way to introduce Indian history at this age." + the review slip ----------
function rvHist(c, t) {
  const u = t - RV.hist;
  sbBg(c, '#9DB8E3', { speck: [30, 'rgba(255,255,255,.5)'], seed: 61 });
  sbCloud(c, 160, 1500, 330, '#FFFFFF', .7); sbCloud(c, 960, 330, 260, '#FFFFFF', .6);
  sbSay(c, '"Such an easy way | to introduce | *Indian history* | at this age."', 540, 640, 112, { hi: '#FFE066', seed: 62, age: u - .2, lh: 1.02, caps: .2 });
  // the review slip: a paper card with the stars, the name and the verified line
  const k = popK(u - 1.0); if (k < .01) return;
  c.save(); c.translate(540, 1170); c.rotate(-.02); c.scale(k, k);
  sbShape(c, sbPoly(rvRect(400, 132, 26), { n: 6, jit: 1.2 }), SB.white, { tex: false, shade: ['rgba(120,90,60,.12)', 1.2] });
  picture(c, PICS.book1, -300, 0, 190, 190, { r: 8, rot: -.04 });
  c.save(); c.translate(80, -62); c.scale(.42, .42); rvStars(c, 0, 0, 58, 132); c.restore();
  text(c, 'Nikhil', 80, 0, '700 44px Poppins', SB.ink);
  text(c, 'Verified Purchase · Amazon', 80, 60, '500 30px Poppins', RV_ORANGE, { maxW: 470 });
  c.restore();
}

// ---------- 5. the card: Book 1, ₹200, the set note, and a slot for the link sticker (y ~1510–1620) ----------
function rvCard(c, t) {
  const u = t - RV.card, pk = d => u - d, br = Math.sin(t * 1.3) * .012;
  sbBg(c, '#FBE0CF', { speck: [30, 'rgba(241,90,36,.25)'], seed: 9 });
  sbCloud(c, 110, 560, 300, '#FFFFFF', .55); sbCloud(c, 990, 1180, 340, '#FFFFFF', .55);
  picture(c, PICS.logo, 540, 285, 104, 104, { pop: pk(.1), r: 52 });
  sbSay(c, 'Your little one\'s | *next favourite* book?', 540, 445, 84, { col: RV_TEAL, hi: RV_ORANGE, seed: 71, age: pk(.25), maxW: 960 });
  picture(c, PICS.book1, 540, 800, 500, 500, { pop: pk(.55), rot: br, r: 12, shadow: 30 });
  if (popK(pk(.9)) > .01) { c.save(); c.translate(540, 1105); const s = popK(pk(.9)) * .5; c.scale(s, s); rvStars(c, 0, 0, 58, 132); c.restore(); }
  text(c, '"So glad I did!"  — Nikhil, a parent', 540, 1160, '500 34px Poppins', RV_TEAL, { pop: pk(1.0), maxW: 900 });
  text(c, 'Book 1 · Shailputri · ₹200', 540, 1235, '700 54px Poppins', RV_TEAL, { pop: pk(1.25), maxW: 940 });
  text(c, 'or Books 1–3 for ₹500', 540, 1295, '500 38px Poppins', RV_ORANGE, { pop: pk(1.45), maxW: 900 });
  const k = popK(pk(1.65)) * (1 + .03 * Math.max(0, Math.sin(t * 5)));
  if (k > .01) { c.save(); c.translate(540, 1378); c.scale(k, k); sbShape(c, sbPoly([[-220, -42], [220, -42], [226, 42], [-224, 40]], { n: 8, jit: 1 }), RV_ORANGE, { tex: false }); c.restore(); }
  text(c, 'rishikatha.com', 540, 1381, '700 50px Poppins', '#FFFFFF', { pop: pk(1.65) });
  text(c, 'TAP THE LINK', 540, 1452, '700 34px Poppins', RV_TEAL, { pop: pk(1.95), spacing: 4 });
  const kk = popK(pk(2.1)); if (kk > .01) { const b = Math.sin(t * 5) * 7; c.save(); c.globalAlpha *= clamp(kk); sbLine(c, [[514, 1478 + b], [540, 1500 + b], [566, 1478 + b]], 7, RV_TEAL, { taper: .2 }); c.restore(); }
}

const RV_SH = [[RV.hook, rvHook], [RV.insta, rvInsta], [RV.kid, rvKid], [RV.hist, rvHist], [RV.card, rvCard]];
RV_SH.forEach(([a, f], i) => SHOTS.push({ a, b: i < RV_SH.length - 1 ? RV_SH[i + 1][0] : RV.end + 1, draw(c, u, t) {
  if (!i) return f(c, t);
  const [a0, f0] = RV_SH[i - 1];
  rvWipe(c, t, a, c => f0(c, a - .001), c => f(c, t));
} }));
