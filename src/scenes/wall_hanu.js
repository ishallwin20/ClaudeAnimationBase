// wall_hanu.js: Bal Hanuman wallpapers, batch 6 (studio_wall_hanu.html) at 1290×2796, drawn in a 1080×2340 design
// space; the poses (src/sc_hanu.js, in the reels' 1080×1920 frame) are moved down DY px so the clock sits in the sky.
// Four looks from four kinds of Instagram art (owner, 14 Nov 2026), never their subjects:
//   hn_chandni  thread art on dark paper: asleep hugging his gada in a moonbeam under a peepal (wake: the moonlight pours in)
//   hn_ram      colour scribble on black: hugging a floating stone with राम on it, kicking his feet (wake: राम writes itself)
//   hn_surya    coloured pencil on cream paper: leaping at the sun (wake: he springs up into the leap)
//   hn_barish   a rainy night: under a banana leaf, guarding a diya (wake: lightning, and the rain comes)
// Seamless 6 s loops; each has <name>_wake (2 s: k 0 → 1 over 1.5 s, landing on the still) and <name>_lock.
const WL = 6, DW = 1080, DH = 2340, KS = W / DW, WAKE = 1.5, DY = 360;
let LOCK = false;
function lockScreen(c) {
  c.save(); c.setTransform(KS, 0, 0, KS, 0, 0); c.fillStyle = 'rgba(255,255,255,.92)'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '500 46px Poppins'; c.fillText('Saturday, 14 November', DW / 2, 255); c.font = '700 250px Poppins'; c.fillText('9:41', DW / 2, 450);
  c.fillStyle = 'rgba(30,30,40,.5)'; for (const x of [150, 930]) { c.beginPath(); c.arc(x, 2175, 62, 0, TAU); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(DW / 2 - 140, 2282, 280, 12); c.restore();
}
function wallH(name, look, fn) {
  const m = t => ((t % WL) + WL) % WL;
  const at = (c, t, k) => { T = m(t); Object.assign(LOOK, look); c.setTransform(KS, 0, 0, KS, 0, 0); fn(c, m(t), k); };
  LOOPS[name] = (c, t) => at(c, t, 1); LOOPS[name + '_wake'] = (c, t) => at(c, t - WAKE, clamp(t / WAKE)); LOOPS[name + '_lock'] = (c, t) => { at(c, t, 1); c.__lock = 1; };
  LOOPS[name].len = LOOPS[name + '_lock'].len = WL; LOOPS[name + '_wake'].len = 2;
}
SHOTS.push({ a: 0, b: 1e9, draw(c, u, t) { const q = new URLSearchParams(location.search).get('loop'), L = window.LOOP || LOOPS[q] || Object.values(LOOPS)[0]; c.__lock = 0; L(c, t); LOCK = !!c.__lock; } });
POST.push(c => { if (LOCK) lockScreen(c); });
const breath6 = t => .5 - .5 * Math.cos(TAU * t / WL);
const sw = (t, n = 1, ph = 0) => Math.sin(TAU * n * t / WL + ph);   // a sway with n whole cycles a loop
const shadowAt = (c, x, y, r, a = .55, k = .14, col = '30,24,18') => {
  c.save(); const g = c.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g;
  c.translate(x, y); c.scale(1, k); c.translate(-x, -y); c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
};

// ---------- 01 Chandni: asleep hugging his gada in the moonlight (thread art on dark paper) ----------
const HN_MOON = [236, 770];
const HN_PEEPAL = () => window._pp || (window._pp = {
  a: scPeepal('a', [[1150, 470], [1030, 512], [930, 570], [850, 650], [800, 740]], [[1100, 490, .82, .1], [1010, 520, .9, -.25], [950, 640, .78, .3], [880, 600, .95, .05], [830, 720, .8, -.2], [1060, 660, .7, .45], [770, 760, .7, .35]]),
  b: scPeepal('b', [[850, 650], [740, 700], [660, 770], [610, 860]], [[740, 700, .8, .25], [660, 770, .88, -.12], [600, 880, .7, .2], [700, 860, .6, .5]]),
  c: scPeepal('c', [[-40, 380], [70, 420], [170, 470], [250, 520]], [[50, 420, .7, .15], [150, 462, .72, -.22], [250, 520, .56, -.35]]),
  ground: scPart('tground', [-40, 1960, 1160, 400], [scLook('thread', {
    len: 90, w: 1.1, dens: 1.2, flow: 0, follow: .6, hair: .5, outline: 10, curl: .5, inkCol: '#100C08', under: .55, jit: .35,
    draw(c) {
      c.beginPath(); c.moveTo(-40, 2020); for (let x = -40; x <= 1120; x += 20) c.lineTo(x, 2008 + Math.sin(x / 90) * 6 + scFbm2(x / 120, 3, 4, 3) * 10); c.lineTo(1120, 2360); c.lineTo(-40, 2360); c.closePath();
      const g = c.createLinearGradient(0, 2000, 0, 2340); g.addColorStop(0, '#8A6A4C'); g.addColorStop(.15, '#5E4632'); g.addColorStop(1, '#2A2018'); c.fillStyle = g; c.fill();
      const r = scRnd(4); for (let i = 0; i < 26; i++) scBall(c, r() * 1080, 2040 + r() * 280, 30 + r() * 60, 8 + r() * 12, ['#9A7A58', '#6E5238', '#3E2E20']);
    },
  })], { seed: 59 }),
});
wallH('hn_chandni', { bloom: .12, vignette: .34, grain: .05 }, (c, t, k) => {
  const e = easeOut(k), b = breath6(t), P = window._hg || (window._hg = scHanuGada('thread')), L = HN_PEEPAL(), S = SCHG;
  scPaperDark(c);
  scThreadTemple(c, t, 900, 2030, .86, .8);
  scThreadMoon(c, t, HN_MOON[0], HN_MOON[1], 58, lerp(.45, 1, e));
  scMoonbeam(c, t, HN_MOON[0] + 24, HN_MOON[1] + 36, 640, 2040, 100, 980, e * (.85 + .15 * sw(t, 1)));
  scDraw(c, L.c, t, { ax: 250, ay: 540, rot: .02 * sw(t, 1, 1) });
  scDraw(c, L.ground, t);
  c.save(); c.translate(0, DY);
  shadowAt(c, 520, 1656, 360, .7, .14, '5,4,3');
  const lift = 14 * b;
  scDraw(c, P.tail, t, { ax: S.tailRoot[0], ay: S.tailRoot[1], rot: -.03 * b + .02 * sw(t, 2) });
  scDraw(c, P.legs, t);
  scDraw(c, P.torso, t, { ax: S.lap[0], ay: S.lap[1], sx: 1 + .025 * b, sy: 1 + .05 * b });
  scDraw(c, P.gada, t);
  scDraw(c, P.head, t, { ax: S.neck[0], ay: S.neck[1], rot: S.tilt + .02 * b, dy: -lift * .5 });
  scDraw(c, P.arms, t, { ax: 540, ay: 1300, dy: -lift * .2 });
  c.restore();
  // the moonlight on him: a soft cool-gold wash, dust drifting down the beam
  glow(c, 520, 1500, 420, '#FFF0C8', .16 * e, 'screen');
  scLooped(t, WL, (tt, w) => motes(c, { n: 40, seed: 3, box: [260, 900, 760, 1950], r: 3.2, col: '#FFF1C8', a: .6 * w * e, vx: 6, vy: 30, t: tt }));
  scDraw(c, L.a, t, { ax: 1150, ay: 500, rot: .025 * sw(t, 1) });
  scDraw(c, L.b, t, { ax: 800, ay: 650, rot: .035 * sw(t, 1, .8) });
  scStrays(c, t, { key: 'ch', box: [0, 560, 1080, 2340], n: 150, cols: ['rgba(240,226,196,.9)', 'rgba(210,170,110,.9)', 'rgba(170,190,120,.8)', 'rgba(200,110,70,.8)'], len: 60, w: .9, a: .35, curl: .2, seed: 7 });
});

// ---------- 02 Ram: hugging a floating stone with राम on it (colour scribble on black) ----------
wallH('hn_ram', { bloom: .16, vignette: .3, grain: .05 }, (c, t, k) => {
  const e = easeOut(k), b = breath6(t), P = window._hs || (window._hs = scHanuStone('color')), [sx, sy] = SCHS.stone;
  c.fillStyle = '#050505'; c.fillRect(0, 0, DW, DH);
  glow(c, 540, 1600, 760, '#3A2A1A', .5, 'screen');
  // ripples on dark water under the stone (Ram's name made the stones float)
  const bob = 12 * sw(t, 1);
  const RY = 200; c.save(); c.translate(0, RY + bob);
  scDraw(c, P.tail, t, { ax: 640, ay: 1420, rot: .05 * sw(t, 1, 1) });
  scDraw(c, P.back, t, { ax: 540, ay: 1300, sx: 1 + .02 * b, sy: 1 + .04 * b });
  scDraw(c, P.legL, t, { ax: SCHS.legL[0], ay: SCHS.legL[1], rot: .22 * sw(t, 2) });
  scDraw(c, P.legR, t, { ax: SCHS.legR[0], ay: SCHS.legR[1], rot: .22 * sw(t, 2, Math.PI) });
  scDraw(c, P.stone, t);
  // राम: hand-lettered in saffron light; on wake it writes itself left to right
  const pulse = .85 + .15 * sw(t, 1);
  c.save(); c.font = '700 176px Kalam'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const tw = c.measureText('राम').width; c.beginPath(); c.rect(sx - tw / 2 - 30, sy - 140, (tw + 60) * clamp(e * 1.15), 300); c.clip();
  c.shadowColor = 'rgba(255,150,40,.95)'; c.shadowBlur = 46 * pulse; c.fillStyle = '#FF8A1E'; c.fillText('राम', sx, sy + 10);
  c.shadowBlur = 12; c.fillStyle = '#FFD27A'; c.globalAlpha = .55 + .2 * pulse; c.fillText('राम', sx, sy + 8); c.restore();
  glow(c, sx, sy, 300, '#FF9A3A', (.25 + .08 * sw(t, 1)) * e, 'screen');
  scDraw(c, P.arms, t, { ax: 540, ay: 1300, sx: 1 + .01 * b });
  scDraw(c, P.head, t, { ax: SCHS.neck[0], ay: SCHS.neck[1], rot: -.06 + .03 * sw(t, 1, .5), dy: -6 * b });
  c.restore();
  scLooped(t, WL, (tt, w) => motes(c, { n: 26, seed: 11, box: [180, 900, 900, 1850], r: 3.6, col: '#FFB45A', a: .55 * w * e, vx: 0, vy: -40, t: tt }));
  scStrays(c, t, { key: 'ram', box: [40, 760, 1040, 2120], n: 130, cols: ['rgba(245,240,228,.9)', 'rgba(240,190,60,.9)', 'rgba(230,110,30,.9)', 'rgba(150,150,150,.8)'], len: 70, w: .9, a: .4, curl: .35, seed: 3 });
});

// ---------- 03 Surya: leaping at the sun (coloured pencil on cream paper) ----------
const HN_SUN = [800, 800];
wallH('hn_surya', { bloom: 0, vignette: .12, grain: .03 }, (c, t, k) => {
  const P = window._hl || (window._hl = scHanuLeap('pencil')), jump = 1 - easeOut(k), S = SCHL;
  scPaperCream(c);
  scPencilSun(c, t, HN_SUN[0], HN_SUN[1], 150, lerp(.7, 1, easeOut(k)));
  scPencilCloud(c, t, 230 + 16 * sw(t, 1), 960, 1, 1); scPencilCloud(c, t, 930 - 14 * sw(t, 1, 1), 1330, .75, 2); scPencilCloud(c, t, 160 - 10 * sw(t, 1, 2), 1620, .6, 3);
  scPencilHills(c, t, { y: 1640, h: 420 });
  const fl = -14 * sw(t, 1), DX = -140, DYs = -70 + fl + 320 * jump * jump;
  c.save(); c.translate(DX, DYs);
  c.save(); c.globalCompositeOperation = 'multiply';
  scDraw(c, P.tail, t, { ax: S.tailRoot[0], ay: S.tailRoot[1], rot: .08 * sw(t, 1, 1) - .3 * jump });
  scDraw(c, P.body, t, { ax: 500, ay: 1440, rot: .012 * sw(t, 1) });
  scDraw(c, P.head, t, { ax: 540, ay: 1250, dx: S.neck[0] - 540, dy: S.neck[1] - 1250, rot: S.tilt + .02 * sw(t, 1, .4) });
  c.restore(); c.restore();
  // the title, in the paper's brown ink
  c.save(); c.fillStyle = 'rgba(92,52,30,.9)'; c.font = '400 44px Marcellus'; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (c.letterSpacing !== undefined) c.letterSpacing = '18px'; c.fillText('BAL HANUMAN', DW / 2 + 9, 2080);
  c.letterSpacing = '0px'; c.fillRect(DW / 2 - 350, 2079, 70, 2); c.fillRect(DW / 2 + 280, 2079, 70, 2); c.restore();
});

// ---------- 04 Barish: under a banana leaf in the rain, guarding a diya ----------
wallH('hn_barish', { bloom: .14, vignette: .36, grain: .05 }, (c, t, k) => {
  const e = easeOut(k), b = breath6(t), P = window._hr || (window._hr = { h: scHanuLeaf('fur'), diya: scDiya() }), H = P.h, S = SCHR;
  scRainNight(c);
  // far rain behind him
  scRain(c, t, { n: 260, box: [-200, 0, 1180, 2340], speed: 1500, slant: .14, len: 54, w: 1.1, a: .28 * lerp(.3, 1, e), col: 'rgba(200,230,236,1)', seed: 1 });
  scRock(c, { w: DW, h: DH, dy: DY, key: 'rain', y0: 1620, top: X => 1650 + Math.pow((X - 540) / 600, 2) * 40 + scFbm2(X / 150, 6, 2, 3) * 10, pal: { base: [74, 84, 86], lichen: .25, shade: [.8, .55] }, near: 120 });
  c.save(); c.translate(0, DY);
  shadowAt(c, 540, 1660, 420, .6, .12, '4,10,12');
  const lift = 14 * b, lr = .015 * sw(t, 1);
  scDraw(c, H.tail, t, { ax: 600, ay: 1612, rot: .03 * sw(t, 1) + .12 * Math.max(0, sw(t, 2, 1)) ** 4 });
  scDraw(c, H.legs, t);
  scDraw(c, H.torso, t, { ax: S.lap[0], ay: S.lap[1], sx: 1 + .025 * b, sy: 1 + .05 * b });
  scDraw(c, H.leaf, t, { ax: S.stemHand[0], ay: S.stemHand[1], rot: lr, dy: -lift * .3 });
  scDraw(c, H.head, t, { ax: S.neck[0], ay: S.neck[1], dy: -lift * .6, rot: -.04 + .02 * sw(t, 1, 1) });
  scDraw(c, H.arms, t, { ax: 540, ay: 1300, dy: -lift * .25 });
  c.restore();
  c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(120,168,178,.55)'; c.fillRect(0, 0, DW, DH); c.restore();
  c.save(); c.translate(0, DY);
  scDiyaDraw(c, P.diya, t, 120, 1650, 1.55, .12 * sw(t, 2), { h: 1.15, glow: 1.3 });
  // drops: from the leaf's tip and lower edge, falling to the rock
  const drip = (x0, y0, ph) => {
    const u = ((t / WL * 3 + ph) % 1), fall = clamp((u - .45) / .4), yy = y0 + 700 * fall * fall;
    const [rx, ry] = [x0 + (y0 - S.stemHand[1]) * -lr, yy];
    if (u < .45) { const s = u / .45; c.save(); c.fillStyle = 'rgba(210,236,240,.85)'; c.beginPath(); c.ellipse(x0, y0 + 6 * s, 4 + 3 * s, 5 + 6 * s, 0, 0, TAU); c.fill(); c.restore(); }
    else if (fall < 1) { c.save(); c.fillStyle = 'rgba(220,240,244,.9)'; c.beginPath(); c.ellipse(rx, ry, 4.5, 11, 0, 0, TAU); c.fill(); c.restore(); }
    if (u > .85) { const s = (u - .85) / .15; c.save(); c.strokeStyle = `rgba(210,236,240,${(1 - s) * .8})`; c.lineWidth = 2; c.beginPath(); c.ellipse(x0, y0 + 700, 10 + 40 * s, 3 + 8 * s, 0, Math.PI, TAU); c.stroke(); c.restore(); }
  };
  c.restore();
  c.save(); c.translate(0, DY);
  drip(156, 990, 0); drip(232, 948, .5);
  c.restore();
  // the diya's warm light on him, the night's cool on everything else
  glow(c, 240, 1940, 640, '#FFB050', .34, 'screen'); glow(c, 520, 1700, 420, '#FFC070', .12, 'screen');
  // near rain in front, not under the leaf
  c.save(); c.beginPath(); c.rect(-200, 0, 1480, 2340);
  c.moveTo(60, 1300); c.quadraticCurveTo(420, 1050, 860, 1180); c.lineTo(900, 2100); c.lineTo(60, 2100); c.closePath(); c.clip('evenodd');
  scRain(c, t, { n: 70, box: [-200, 0, 1180, 2340], speed: 2100, slant: .14, len: 120, w: 2, a: .32 * lerp(.2, 1, e), col: 'rgba(214,238,242,1)', seed: 9 });
  c.restore();
  // splashes on the rock
  for (let i = 0; i < 14; i++) { const s = i * 3.3, u = (t / WL * 4 + hash(s)) % 1, x = hash(s + 1) * DW, y = 2030 + hash(s + 2) * 260; if (x > 80 && x < 880 && y < 2060) continue;
    const a = (1 - u) * .7 * e; c.save(); c.strokeStyle = `rgba(210,236,240,${a})`; c.lineWidth = 1.6; c.beginPath(); c.ellipse(x, y, 6 + 26 * u, 2 + 6 * u, 0, Math.PI, TAU); c.stroke(); c.restore(); }
  // the wake: lightning, twice
  if (k < 1) { const f = Math.max(Math.exp(-Math.pow((k - .12) / .04, 2)), .7 * Math.exp(-Math.pow((k - .3) / .03, 2))); c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = `rgba(200,226,255,${.55 * f})`; c.fillRect(0, 0, DW, DH); c.restore(); }
});
