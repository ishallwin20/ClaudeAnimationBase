// story_common.js: shared pieces for the Instagram Story ads (story_book1.html, story_set.html), Cinematic style.
// Stories cover the top ~220 px (the profile bar) and the bottom ~280 px (the reply bar): keep everything in y 220–1640.
// The owner adds a link sticker: storyCTA() leaves an empty, labelled slot for it.

// a small clay diya: lit = 0..1 (the flame grows in), at (x, y), size k
function diya(c, x, y, k, lit, t) {
  if (lit > 0) { glow(c, x, y - 40 * k, 260 * k * lit, '#FFB050', .7 * lit); glow(c, x, y - 34 * k, 70 * k * lit, '#FFF0C0', .8 * lit); }
  fillPath(c, `M ${x - 52 * k} ${y - 14 * k} C ${x - 44 * k} ${y + 20 * k} ${x + 44 * k} ${y + 20 * k} ${x + 52 * k} ${y - 14 * k} C ${x + 30 * k} ${y - 4 * k} ${x - 30 * k} ${y - 4 * k} ${x - 52 * k} ${y - 14 * k} Z`, '#8A3A1E');
  fillPath(c, `M ${x - 52 * k} ${y - 14 * k} C ${x - 30 * k} ${y - 22 * k} ${x + 30 * k} ${y - 22 * k} ${x + 52 * k} ${y - 14 * k} C ${x + 30 * k} ${y - 6 * k} ${x - 30 * k} ${y - 6 * k} ${x - 52 * k} ${y - 14 * k} Z`, '#B85A2A');
  if (lit > 0) {
    const h = (46 + 6 * Math.sin(t * 9 + x)) * k * lit, sw = Math.sin(t * 5 + x) * 4 * k;
    for (const [col, s] of [['#FF7A22', 1], ['#FFC04A', .7], ['#FFF6D0', .4]]) fillPath(c, `M ${x - 11 * k * s} ${y - 18 * k} C ${x - 12 * k * s} ${y - 18 * k - h * .5} ${x + sw} ${y - 18 * k - h * .8} ${x + sw} ${y - 18 * k - h * s} C ${x + 12 * k * s} ${y - 18 * k - h * .5} ${x + 11 * k * s} ${y - 18 * k} ${x} ${y - 14 * k} Z`, col);
  }
}
// the card's dark-teal ground with gold dust (as rkCardCine)
function storyGround(c, t) {
  sky(c, [[0, '#04100E'], [900, '#0F2A27'], [1920, '#050E0C']]);
  glow(c, 540, 900, 820, '#2E5F5A', .55, 'screen');
  motes(c, { n: 60, seed: 61, box: [-50, 200, W + 50, 1900], r: 3, col: '#F4C46A', a: .6, vx: 6, vy: -26, t });
}
// the price line, then "TAP THE LINK" with a bobbing chevron over an empty slot (y ~1470–1610) for the link sticker
function storyCTA(c, u, t, price, note, y = 1270) {
  text(c, price, 540, y, '700 92px Poppins', '#FFFFFF', { pop: u, glow: ['rgba(241,90,36,.55)', 30] });
  if (note) text(c, note, 540, y + 78, '500 36px Poppins', '#FF9A6A', { pop: u - .2, maxW: 900 });
  const k = popK(u - .5); if (k <= .01) return;
  text(c, 'TAP THE LINK', 540, y + 170, '700 40px Cinzel', '#F4C46A', { pop: u - .5, spacing: 6 });
  const b = Math.sin(t * 5) * 8;
  c.save(); c.globalAlpha = clamp(k); strokePath(c, `M 510 ${y + 205 + b} L 540 ${y + 232 + b} L 570 ${y + 205 + b}`, '#F4C46A', 6); c.restore();
}
