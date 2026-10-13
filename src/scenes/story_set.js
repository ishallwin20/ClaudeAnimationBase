// story_set.js: the Books 1–3 Story ad (story_set.html, 14 s). "Three goddesses. Three stories." Three diyas light one
// by one, each revealing its cover (Shailputri, Brahmacharini, Chandraghanta); then the three fan together: ₹500 for the
// set, and a slot for the link sticker. SFX: tools/story_sfx.mjs (same times).
const TL = { open: 0, b1: 2.4, b2: 4.4, b3: 6.4, set: 8.4, end: 14 };
const BOOKS = [['book1', 'SHAILPUTRI', 'The Daughter of the Mountain', ['#1A2A48', '#6E8CC0']], ['book2', 'BRAHMACHARINI', 'The Seeker of Sacred Wisdom', ['#0E2A20', '#5E9A70']], ['book3', 'CHANDRAGHANTA', 'The Fierce Protector', ['#2A1A08', '#D8A040']]];
const DIYA_X = [300, 540, 780], DIYA_Y = 1560;
const litAt = (t, i) => easeOut(seg(t, [TL.b1, TL.b2, TL.b3][i] - .2, [TL.b1, TL.b2, TL.b3][i] + .3));
function diyaRow(c, t) { fillPath(c, `M -100 ${DIYA_Y + 4} C 300 ${DIYA_Y - 10} 780 ${DIYA_Y - 10} 1180 ${DIYA_Y + 4} L 1180 2100 L -100 2100 Z`, '#0A0608'); DIYA_X.forEach((x, i) => diya(c, x, DIYA_Y, 1, litAt(t, i), t)); }

SHOTS.push({ a: TL.open, b: TL.b1 + .5, draw(c, u, t) {
  sky(c, [[0, '#05050C'], [1200, '#140C18'], [1900, '#24101A']]);
  stars(c, 120, 6, t, .6); glow(c, 540, 1500, 700, '#FF8A3A', .12 + .05 * Math.sin(t * 3));
  diyaRow(c, t);
} });
BOOKS.forEach(([key, name, sub, [dark, lite]], i) => {
  const a = [TL.b1, TL.b2, TL.b3][i];
  SHOTS.push({ a, b: a + 2.5, xf: .4, draw(c, u, t) {
    sky(c, [[0, '#05050C'], [800, dark], [1900, '#0A0608']]);
    glow(c, 540, 800, 760, lite, .35); stars(c, 80, 6 + i, t, .4);
    rays(c, DIYA_X[i], DIYA_Y - 40, { n: 10, dir: -Math.PI / 2, spread: 1.6, len: 1300, w: 200, col: '#FFD58A', a: .14, t, seed: i });
    motes(c, { n: 50, seed: 11 + i, box: [-50, 300, W + 50, 1700], r: 3, col: '#FFD9A0', a: .6, vx: 6, vy: -40, t });
    const s = lerp(.94, 1.02, easeOut(u / 2.5));
    picture(c, PICS[key], 540, 800, 640 * s, 640 * s, { pop: u - .15, r: 14, shadow: 40, glow: ['rgba(255,196,120,.4)', 60] });
    text(c, `${i + 1} · ${name}`, 540, 1215, '700 60px Cinzel', '#F4C46A', { pop: u - .35, glow: ['rgba(244,196,106,.5)', 22], spacing: 3, maxW: 940 });
    text(c, sub, 540, 1295, '42px Marcellus', '#FBE0CF', { pop: u - .5, maxW: 900 });
    diyaRow(c, t);
  } });
});
SHOTS.push({ a: TL.set, b: TL.end + 1, xf: .5, draw(c, u, t) {
  storyGround(c, t);
  picture(c, PICS.logo, 540, 300, 110, 110, { pop: u - .1, r: 55 });
  text(c, 'THE NAVADURGA SET', 540, 440, '700 62px Cinzel', '#F4C46A', { pop: u - .2, glow: ['rgba(244,196,106,.55)', 24], spacing: 3, maxW: 960 });
  text(c, 'Books 1 · 2 · 3', 540, 515, '42px Marcellus', '#FBE0CF', { pop: u - .35 });
  const br = Math.sin(t * 1.3) * .008;
  ['book1', 'book3', 'book2'].forEach((b, j) => { const i = [-1, 1, 0][j]; picture(c, PICS[b], 540 + i * 250, 830 + Math.abs(i) * 40, 380, 380, { rot: i * .1 + br, pop: u - .5 - j * .12, r: 12, shadow: 30, glow: ['rgba(255,196,120,.3)', 44] }); });
  storyCTA(c, u - 1.1, t, '₹500 for all 3', '₹600 if bought one by one · rishikatha.com', 1240);
} });

say(-.35, 2.5, 'Three goddesses. | Three stories.', { y: 760, size: 66, at: Array(4).fill(-.35) });
