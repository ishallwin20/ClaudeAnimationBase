// kushmanda_smile.js: ad 27, "This goddess created the WHOLE universe… with just a smile." Maa Kushmanda on her lion
// walks through a grey misty forest; it sinks into the darkness before creation; she smiles, a spark at her face
// swells into the cosmic egg behind her and bursts, and the forest wakes in gold; her name; the Sun; the card (Book 4).
// One continuous walk: the camera tracks her, the plates and trunks slide past (see STORYBOARD.md for the beats).

const TL = { DARK: 3.4, SMILE: 6.6, SPARK: 7.2, EGG: 8.2, BURST: 10.9, NAME: 13.2, SUN: 16.8, ASK: 20, CARD: 23.2, END: 28.4 };
const SPEED = 150, STEP = 1.15, SC = .52, RX = 540, RY = 1452;   // the camera's pan (see matte_test.js), her scale and place
const FACE = [RX + (1421 - KUSH.anchor[0]) * SC, RY + (276 - KUSH.anchor[1]) * SC];   // her face on screen, ~(540, 836)
const DARK = t => kf(t, [[TL.DARK, 0], [TL.DARK + 1.6, 1], [TL.BURST, 1], [TL.BURST + .25, 0]]);
const GOLD = t => kf(t, [[TL.BURST, 0], [TL.BURST + .7, 1]]);
const ZOOM = t => kf(t, [[TL.SMILE, 1], [TL.BURST - .1, 1.22], [TL.BURST + 1.6, 1]], easeIO);
const EGG = t => t < TL.EGG ? 0 : t < TL.BURST ? easeOut(seg(t, TL.EGG, TL.BURST - .2)) : 1 + 3 * easeOut(seg(t, TL.BURST, TL.BURST + 1));
// The near trunks pass close to the camera, fast (TRUNK_V px/s), one at a time: [the time it crosses her, which trunk]
// (a column of assets/matte/trunks_cut.png: its centre and half-width in source px), kept off the hook and the egg.
const TRUNK_V = 420, TRUNK_COLS = [[1128, 70], [1656, 330], [480, 60], [624, 200]];
const TRUNKS = [[4.4, 0], [6.9, 2], [12.9, 1], [17.0, 3], [20.6, 0], [23.0, 1]];
function nearTrunk(c, i, x) {
  const img = PICS.trunks, [cx, hw] = TRUNK_COLS[i], k = 2050 / img.naturalHeight;
  if (x + hw * k < -50 || x - hw * k > W + 50) return;
  c.drawImage(img, cx - hw, 0, hw * 2, img.naturalHeight, x - hw * k, -60, hw * 2 * k, 2050);
}
const SUN = t => ease(seg(t, TL.SUN - .4, TL.SUN + 1.2));

function forest(c, t) {
  const camX = SPEED * t, g = GOLD(t), d = DARK(t), PH = 1700;
  c.fillStyle = mixCol('#1A171D', '#1C130C', g); c.fillRect(-200, -200, W + 400, H + 400);
  platePan(c, PICS.plateGrey, camX, .5, { h: PH, x0: -300 });
  if (g > 0) { c.globalAlpha = g; platePan(c, PICS.plateGold, camX, .5, { h: PH, x0: -300 }); c.globalAlpha = 1; }
  const fl = c.createLinearGradient(0, PH - 120, 0, H); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(.35, mixCol('#16131A', '#1A120B', g)); fl.addColorStop(1, '#0B0A0C');
  c.fillStyle = fl; c.fillRect(-200, PH - 120, W + 400, H - PH + 320);
  // the sun, high on the right, once she is named as its heart
  const sun = SUN(t);
  if (sun > 0) { glow(c, 930, 360, 900, '#FFD27A', .55 * sun); glow(c, 930, 360, 260, '#FFF4D8', .9 * sun); rays(c, 930, 360, { n: 12, dir: 2.25, spread: .9, len: 2400, w: 300, col: '#FFDFA0', a: .3 * sun, t, seed: 11 }); }
  // the drifting mist behind her
  soft(c, 6, (s) => { for (let i = 0; i < 7; i++) { const x = ((hash(i) * 1600 - camX * .6 - t * 25 * (1 + hash(i + 3))) % 1700 + 1700) % 1700 - 300, y = 1050 + hash(i + 9) * 380; ellipse(s, x, y, 380 + hash(i + 4) * 260, 90 + hash(i + 5) * 60, rgba(mixCol('#C9C6D4', '#F2C98A', g), .22)); } }, { blur: 6 });
  // the darkness before creation: the forest all but gone, a little cold mist left moving in it
  if (d > 0) { c.fillStyle = rgba('#05060C', .9 * d); c.fillRect(-200, -200, W + 400, H + 400); haze(c, 1300, 500, '#2A3048', .25 * d); }
}
// the cosmic egg: a spark at her smile that swells into a glowing egg behind her, then bursts into the light
function egg(c, t) {
  const e = EGG(t); if (e <= 0) return;
  const burst = t >= TL.BURST, k = burst ? 1 - seg(t, TL.BURST + .2, TL.BURST + 1.1) : 1;
  const cx = lerp(FACE[0], RX + 20, ease(seg(t, TL.EGG, TL.BURST - .6))), cy = lerp(FACE[1], 930, ease(seg(t, TL.EGG, TL.BURST - .6)));
  const rx = 40 + 300 * e, ry = rx * 1.3, br = .8 + .2 * Math.sin(t * 7);
  c.save(); c.translate(cx, cy); c.scale(1, 1.3);
  glow(c, 0, 0, rx * 2.4, '#FF9F45', .5 * k * br, 'screen');
  const gr = c.createRadialGradient(0, -rx * .2, 0, 0, 0, rx); gr.addColorStop(0, rgba('#FFFBEA', .95 * k)); gr.addColorStop(.45, rgba('#FFD98A', .8 * k)); gr.addColorStop(.85, rgba('#F59A3A', .35 * k)); gr.addColorStop(1, rgba('#F59A3A', 0));
  c.globalCompositeOperation = 'screen'; c.fillStyle = gr; c.beginPath(); c.arc(0, 0, rx, 0, TAU); c.fill(); c.restore();
  motes(c, { n: 40, seed: 5, box: [cx - rx * 1.4, cy - ry * 1.4, cx + rx * 1.4, cy + ry * 1.4], r: 4, col: '#FFE2A0', a: .8 * k * Math.min(1, e * 2), vx: 0, vy: -30, t });
}

SHOTS.push({ a: 0, b: TL.CARD + .6, draw(c, u, t) {
  const z = ZOOM(t), d = DARK(t), g = GOLD(t), camX = SPEED * t;
  c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
  forest(c, t);
  egg(c, t);
  // the spark: her smile in the dark, a point of warm light at her face before the egg grows out of it
  const sp = seg(t, TL.SPARK, TL.SPARK + .5) * (1 - seg(t, TL.EGG + .6, TL.EGG + 1.2));
  if (sp > 0) { glow(c, FACE[0] + 4, FACE[1] + 14, 180, '#FFC870', .7 * sp * (.85 + .15 * Math.sin(t * 9))); glow(c, FACE[0] + 4, FACE[1] + 14, 40, '#FFFFFF', .9 * sp); }
  // Kushmanda: a hazed painting in the mist, a silhouette in the dark (a little of her shows by the spark and the egg),
  // warm and rim-lit in the gold
  const lit = Math.max(sp * .35, EGG(t) > 0 && t < TL.BURST ? .2 + .3 * EGG(t) : 0);
  const pose = quadWalk(t / STEP, { legs: KUSH_LEGS, A: .17, lift: 30, bob: 6, tail: 'tail' });
  figure(c, (l) => { l.filter = 'blur(.8px)'; drawRig(l, cutRig(KUSH), RX, RY, SC, pose); l.filter = 'none'; }, {
    tint: d > .01 ? [mixCol('#9C9AAD', '#06070D', d), lerp(.36, .9 - .45 * lit, d)] : [mixCol('#9C9AAD', '#C9935A', g), lerp(.36, .2, g)],
    grade: [[700, 'rgba(0,0,0,0)'], [1460, rgba(mixCol('#2A2733', '#3A2410', g), .35)]],
    edge: d > .01 ? { col: '#FFD08A', w: 2, a: .6 * d * Math.max(lit * 1.6, .25) } : undefined,
    rim: { col: '#FFE2A6', dx: 4, dy: -3, a: Math.max(.85 * g, 1.2 * lit * d), blur: 1 },
  });
  haze(c, 1440, 120, mixCol('#BDB9C8', '#E8B878', g), .28 * (1 - d * .8));
  soft(c, 4, (s) => { const gr = s.createLinearGradient(0, 1480, 0, 1640); gr.addColorStop(0, 'rgba(13,11,14,0)'); gr.addColorStop(1, '#0D0B0E'); s.fillStyle = gr; s.fillRect(-200, 1480, W + 400, 160); s.fillStyle = '#0D0B0E'; s.fillRect(-200, 1640, W + 400, 500); for (let i = 0; i < 14; i++) { const x = ((hash(i + 40) * 2400 - camX * 2) % 2400 + 2400) % 2400 - 400; ellipse(s, x, 1570 + hash(i) * 40, 160 + hash(i + 2) * 200, 30, '#0D0B0E'); } }, { blur: 5 });
  rays(c, 1300, -200, { n: 9, dir: 2.3, spread: .5, len: 2600, w: 260, col: '#FFD58A', a: .22 * g, t, seed: 3 });
  // a soft dark band behind the captions once the forest is bright
  if (g > 0) { const cb = c.createLinearGradient(0, 380, 0, 760); cb.addColorStop(0, 'rgba(30,14,4,0)'); cb.addColorStop(.5, rgba('#1E0E04', .5 * g)); cb.addColorStop(1, 'rgba(30,14,4,0)'); c.fillStyle = cb; c.fillRect(-200, 380, W + 400, 380); }
  figure(c, (l) => { l.filter = 'blur(3px)'; TRUNKS.forEach(([tc, i]) => nearTrunk(l, i, RX + (tc - t) * TRUNK_V)); l.filter = 'none'; }, {
    tint: [mixCol(mixCol('#26232C', '#24160C', g), '#030306', d), .55 + .4 * d], rim: { col: '#FFD58A', dx: 5, dy: 0, a: .7 * g, blur: 2 },
  });
}});
// the burst: a white-gold flash as the egg breaks
POST.push((c, t) => flash(c, Math.exp(-Math.max(0, t - TL.BURST) * 5) * (t >= TL.BURST ? .85 : 0), '#FFF1D0'));
SHOTS.push({ a: TL.CARD, b: TL.END + 1, xf: .6, draw(c, u, t) {
  rkCardCine(c, u, t, { hero: 'book4', badge: 'OUT NOW', title: 'Her story is Book 4', price: 'Book 4 · ₹200', books: ['book1', 'book3', 'book2'], note: 'Books 1–3: set of 3 for ₹500' });
}});

// captions: the hook is up and lit on frame 0
CAP.dim = .5;   // the words still to come stay readable over the bright gold
say(-1, 1.9, 'This goddess created | the *WHOLE* universe…', { y: 560, at: [-1, -1, -1, -1, -1, -1] });
say(1.9, 3.4, '…with just a *smile*.', { y: 560, size: 66 });
say(TL.DARK, TL.SMILE, 'Before creation, | there was only | *darkness*.', { y: 560 });
say(TL.SMILE, TL.EGG + 1.4, 'Then *Maa Kushmanda* | smiled.', { y: 560 });
say(TL.EGG + 1.4, TL.NAME, 'Her warm smile lit up | the cosmic egg, | the *Brahmanda*.', { y: 560 });
say(TL.NAME, TL.SUN, '*Ku*: a little | *Ushma*: warmth | *Anda*: the cosmic egg', { y: 560 });
say(TL.SUN, TL.ASK, 'She still lives | in the heart of the *Sun*.', { y: 560 });
say(TL.ASK, TL.CARD, 'Write *Jai Maa Kushmanda* | in the comments', { y: 560 });

// cover.html: one still of the golden forest, the title over it, inside the 3:4 grid crop (y 240–1680)
if (window.COVER) {
  CAPTIONS.length = 0;
  const shot = SHOTS[0]; SHOTS.length = 0;
  SHOTS.push({ a: 0, b: 99, draw(c) {
    shot.draw(c, 15.2, 15.2);
    const g = c.createLinearGradient(0, 260, 0, 820); g.addColorStop(0, 'rgba(20,10,4,.55)'); g.addColorStop(1, 'rgba(20,10,4,0)'); c.fillStyle = g; c.fillRect(0, 240, W, 600);
    text(c, 'SHE CREATED', 540, 380, '700 74px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.8)', 26], spacing: 4 });
    text(c, 'THE UNIVERSE', 540, 478, '700 108px Cinzel', '#F4C46A', { glow: ['rgba(120,60,0,.9)', 30], spacing: 3, maxW: 980 });
    text(c, 'WITH A SMILE', 540, 580, '700 74px Cinzel', '#FFF3DC', { glow: ['rgba(0,0,0,.8)', 26], spacing: 4 });
  }});
}
