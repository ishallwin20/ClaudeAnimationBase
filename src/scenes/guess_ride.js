// guess_ride.js: "Guess whose ride I am?" (ad 53, Books 1–3), the first Storybook reel. Three rounds, easy to hard:
// a vahana waits on a flat wall while three (four) dots tick off the guessing time, then its god pops in beside it.
// Mouse → Ganesha, owl → Maa Lakshmi, donkey → Maa Kalaratri. Then the comment ask and the card.
// The times below are the cue list for tools/guess_ride_sfx.mjs too.
const GR = {
  rounds: [
    { a: 0, rev: 3.4, b: 5.4, bg: '#F2A93B', ground: '#D98C27', speck: 'rgba(201,124,31,.5)', tag: '1 of 3 · EASY', tagCol: '#3E8E5A', dots: [1.1, 1.9, 2.7], ans: '*Ganesha\'s!*', hi: SB.ink },
    { a: 5.4, rev: 8.8, b: 11.0, bg: '#9DB8E3', ground: '#86A3D2', speck: 'rgba(255,255,255,.5)', tag: '2 of 3 · MEDIUM', tagCol: '#C9821E', dots: [6.5, 7.3, 8.1], ans: 'Maa *Lakshmi\'s!*', hi: '#FFE066' },
    { a: 11.0, rev: 15.0, b: 17.6, bg: '#B9A6D8', ground: '#9A87BC', speck: 'rgba(255,255,255,.45)', tag: '3 of 3 · HARD', tagCol: '#C8323C', dots: [11.9, 12.7, 13.5, 14.3], ans: 'Maa *Kalaratri\'s!*', hi: '#FFE066', sub: 'the 7th form of Durga' },
  ],
  ask: 17.6, card: 21.0, wipe: .45,
};
const GY = 1480;   // the ground line

// a little pill with the round number and how hard it is
function grTag(c, txt, col, x, y, age) {
  const k = popK(age); if (k < .01) return;
  c.save(); c.translate(x, y); c.scale(k, k); c.font = '700 34px Poppins'; const w = c.measureText(txt).width / 2 + 34;
  sbShape(c, sbPoly([[-w, -30], [w, -32], [w + 4, 30], [-w + 2, 31]], { n: 6, jit: .8 }), col, { tex: false }); c.restore();
  text(c, txt, x, y + 2, '700 34px Poppins', '#FFFFFF', { pop: age, spacing: 1 });
}
// the guessing dots: each one fills on its tick, with a pop
function grDots(c, dots, t, y, out) {
  const n = dots.length, gap = 70, a = 1 - clamp(out);
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a;
  dots.forEach((d, i) => { const x = 540 + (i - (n - 1) / 2) * gap, on = t >= d, k = on ? popK(t - d) : 1;
    sbEll(c, x, y, 20, 20, 'rgba(255,255,255,.35)', { tex: false });
    if (on) { c.save(); c.translate(x, y); c.scale(k, k); sbEll(c, 0, 0, 20, 20, SB.white, { tex: false }); c.restore(); } });
  c.restore();
}
// a jump: lift and squash/stretch for a hop starting at t0, d long
const grHop = (t, t0, d = .42, h = 70) => { const f = (t - t0) / d; if (f < 0 || f > 1.25) return [0, 0]; if (f > 1) return [0, -Math.sin((f - 1) / .25 * Math.PI) * .8]; return [-Math.sin(f * Math.PI) * h, Math.sin(f * Math.PI) * .9]; };

// each round: the animal alone, then (after rev) the animal steps left and its god springs in on the right
function grRound(i, c, t) {
  const R = GR.rounds[i], u = t - R.a, ur = t - R.rev, rev = ease(seg(t, R.rev, R.rev + .45));
  sbBg(c, R.bg, { speck: [34, R.speck], seed: 20 + i });
  if (i === 1) { sbCloud(c, 150, 1020, 330, '#FFFFFF', .75); sbCloud(c, 960, 1180, 260, '#FFFFFF', .6); }
  if (i === 2) { sbSwoosh(c, [[-80, 1220], [500, 1100], [1160, 1180]], 160, '#FFFFFF', .22); }
  sbGround(c, lerp(260, 120, rev), lerp(840, 960, rev), GY, R.ground, { seed: 4 + i });
  const [hy, hs] = grHop(t, R.rev + .05), [hy2, hs2] = grHop(t, R.rev + .62, .36, 40), ax = lerp(560, 330, rev);
  const o = { t: t + i, hop: hs + hs2, happy: ur > .1 && ur < 1.6 };
  if (i === 0) sbMouse(c, ax, GY + hy + hy2, lerp(.78, .6, rev), { ...o, hold: 'modak', mouth: ur > .05 ? 'grin' : 'smile' });
  if (i === 1) sbOwl(c, ax, GY + hy + hy2, lerp(.86, .64, rev), { ...o, flap: ur > 0 ? Math.max(0, Math.sin(ur * 12)) * Math.exp(-ur * 1.2) : 0, coin: true });
  if (i === 2) sbDonkey(c, lerp(560, 320, rev), GY + hy + hy2, lerp(.8, .56, rev), { ...o, bray: ur > .05 && ur < 1.3 ? Math.sin(clamp((ur - .05) / 1.25) * Math.PI) : 0, ears: ur > 0 ? 1 : undefined });
  // the god springs in
  if (ur > 0) {
    const k = popK(ur - .1), gx = 770;
    if (k > .01) {
      if (i === 0) sbBappa(c, gx, GY, .9 * k, { t, arm: 'wave', happy: ur < 1.4 });
      if (i === 1) sbDevi(c, gx, GY, .84 * k, { t, coins: 1 });
      if (i === 2) sbDevi(c, gx + 10, GY, .82 * k, { t, kind: 'kalaratri' });
      // a ring of little stars where it lands
      if (ur < .9) { const f = ease(ur / .9); for (let j = 0; j < 9; j++) { const a = j / 9 * TAU + .3, r = 140 + f * 260; c.save(); c.globalAlpha *= 1 - f; sbDot(c, gx + Math.cos(a) * r, GY - 330 + Math.sin(a) * r * .8, 12 * (1 - f * .5), '#FFFFFF'); c.restore(); } }
    }
  }
  // lettering: the question, then the answer
  grTag(c, R.tag, R.tagCol, 540, 452, i === 0 ? u + 1 : u - .2);
  const qOut = seg(t, R.rev - .12, R.rev + .05);
  if (qOut < 1) { c.save(); c.globalAlpha *= 1 - qOut; sbSay(c, 'Guess whose | *ride* I am?', 540, 610, 124, { hi: R.hi, seed: 7 + i, age: i === 0 ? u + 1 : u - .25 }); c.restore(); }
  grDots(c, R.dots, t, 760, qOut);
  if (ur > 0) {
    sbSay(c, R.ans, 540, 590, R.sub ? 128 : 142, { hi: R.hi, seed: 31 + i, age: ur, stagger: .12, maxW: 900 });
    if (R.sub) text(c, R.sub, 540, 700, '700 42px Poppins', '#FFFFFF', { pop: ur - .5, spacing: 1 });
  }
}
// a blob of the new wall grows over the old one
function grWipe(c, t, t0, drawOld, drawNew) {
  const f = seg(t, t0, t0 + GR.wipe);
  if (f >= 1) { drawNew(c); return; }
  drawOld(c);
  c.save(); sbPath(c, sbBlob(540, 1000, 40 + easeIO(f) * 1350, 40 + easeIO(f) * 1350, { wob: .08, seed: 3 })); c.clip(); drawNew(c); c.restore();
}

GR.rounds.forEach((R, i) => SHOTS.push({ a: R.a, b: i < 2 ? GR.rounds[i + 1].a : GR.ask, draw(c, u, t) {
  if (i === 0) return grRound(0, c, t);
  grWipe(c, t, R.a, c => grRound(i - 1, c, R.a - .001), c => grRound(i, c, t));
} }));

// the ask: the three vahanas in a row, waving, and the comment prompt
function grAsk(c, t) {
  const u = t - GR.ask;
  sbBg(c, '#F36F5E', { speck: [34, 'rgba(255,255,255,.35)'], seed: 40 });
  sbGround(c, 80, 1000, GY, '#D9574A', { seed: 9, n: 30 });
  const row = [[230, (x, y, s, o) => sbMouse(c, x, y, s * .52, { ...o, hold: 'modak' })], [540, (x, y, s, o) => sbOwl(c, x, y, s * .58, o)], [840, (x, y, s, o) => sbDonkey(c, x, y, s * .5, o)]];
  row.forEach(([x, f], j) => { const [hy, hs] = grHop(t, GR.ask + .35 + j * .18, .4, 50), k = popK(u - .1 - j * .12); if (k > .01) f(x, GY + hy, k, { t: t + j, hop: hs, happy: true }); });
  sbSay(c, 'How many | did you get?', 540, 600, 128, { hi: '#FFE066', seed: 51, age: u });
  sbSay(c, 'Comment *1, 2 or 3!*', 540, 820, 96, { hi: '#FFE066', seed: 52, age: u - .9 });
}
SHOTS.push({ a: GR.ask, b: GR.card, draw(c, u, t) { grWipe(c, t, GR.ask, c => grRound(2, c, GR.ask - .001), c => grAsk(c, t)); } });
SHOTS.push({ a: GR.card, b: PROJECT.duration + 1, draw(c, u, t) {
  grWipe(c, t, GR.card, c => grAsk(c, GR.card - .001), c => sbCard(c, u - .3, t, { title: 'Read their *stories*', price: 'Books 1–3 · set of 3 for ₹500', note: 'Book 7, Maa Kalaratri: coming soon' }));
} });
