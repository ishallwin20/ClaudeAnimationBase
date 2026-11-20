// kvr_universe.js: "Kanha vs Radha" #2, The universe in his mouth (Cel style; STORYBOARD.md). One frame, like a comic
// panel: Kanha, mud all over his face, says he did NOT eat mud; Radha says "Open."; he opens wide and the universe
// bursts out of his mouth and fills the frame, the two of them floating in it; on a tiny Earth with Vraja on it a tiny
// Radha waves, and Radha waves back; a clod of mud drifts past ("…is that MUD?"); he gulps the universe back in, they
// drop to the ground, and he says it's a planet. She cracks up. Bhagavata 10.8.32–39.
// The kids are held on threes (celKeys); the cosmos, the iris and the particles run at the full frame rate.
const GROUND = 1478, KX = 300, RX = 742, KS = 1.1;
const INK = { k: '#2F5FC4', r: '#D23A78' };
const BURST = 4.85, OPEN1 = 5.6, SWELL = 10.25, SUCK0 = 10.45, SUCK1 = 10.78, FALL = 10.62, DROP = 10.82;
const EARTH_IN = [6.85, 7.7], CLOD_IN = [9.2, 9.95], WAVE0 = 7.8, GIGGLE = [13.75, 15.1], HEART_T = [15.2, 15.45, 15.75, 16.05];
// [from, to, who, lines, delays (s after `from` that each line appears)]
const LINES = [
  [-1, 3.3, 'k', ['I did NOT', 'eat mud.']],
  [3.4, 4.6, 'r', ['Open.']],
  [4.65, 5.95, 'k', ['Aaaaa!']],
  [6.15, 7.6, 'r', ['Wow…']],
  [9.55, 11.5, 'r', ['…is that', 'MUD?'], [0, .55]],
  [11.7, 99, 'k', ["That's a", 'planet.'], [0, .45]],
];
const LX = { k: 400, r: 700 };
const sm = x => (x = clamp(x), x * x * (3 - 2 * x));

const K0 = { hip: [0, -112], lean: 0, head: -.1, hL: [34, -92], hR: [-34, -86], eL: [-1, .3], eR: [1, .3], handL: 'fist', handR: 'fist', fL: [-44, 0], fR: [44, 0],
  eyes: 'closed', look: [0, 0], lid: 0, brow: .3, browR: .3, tilt: -.2, mouth: 'pout', blush: 0, sweat: 0, mud: 1, cosmos: 0, talk: 1, hop: 0, squash: 0 };
const KANHA = [
  [0, K0],
  [1.5, { talk: 0 }],
  [1.9, { head: -.2, hop: 16, squash: -.3, tr: .15 }],                       // "hmph!"
  [2.15, { hop: 0, squash: 0, tr: .12 }],
  [3.6, { eyes: 'open', look: [1, 0], mouth: 'o', head: .02, brow: .6, browR: .6, tilt: 0, tr: .18 }],
  [4.25, { eyes: 'closed', mouth: 'smug', squash: .4, hip: [0, -102], hL: [-84, -30], hR: [84, -30], eL: [-1, -.4], eR: [1, -.4], brow: .3, browR: .3, tr: .2 }],   // wind-up
  [4.7, { mouth: 'aah', cosmos: 1, squash: -.4, hip: [0, -118], head: -.06, hL: [-168, -150], hR: [168, -150], eL: [-1, .6], eR: [1, .6], handL: 'open', handR: 'open', tr: .12 }],   // "AAA!" ta-da
  [5.05, { squash: 0, hip: [0, -112], tr: .25 }],
  [6.4, { hL: [-172, -166], hR: [172, -166], head: -.1, tr: .3 }],
  [8.0, { eyes: ['closed', 'open'], look: [1, -.2], browR: .9, head: -.02, tr: .15 }],   // peeks at her, proud
  [8.6, { browR: .3, tr: .1 }], [8.8, { browR: .95, tr: .1 }], [9.0, { browR: .3, tr: .1 }], [9.2, { browR: .95, tr: .1 }],
  [9.95, { eyes: 'wide', look: [.6, -1], brow: .8, browR: .8, tilt: .7, sweat: 1, head: .04, tr: .1 }],   // the mud!
  [10.42, { eyes: 'squeeze', squash: -.2, tr: .1 }],
  [10.62, { mouth: 'puff', cosmos: 0, eyes: 'wide', look: [0, 0], squash: .3, hL: [-136, -96], hR: [136, -96], eL: [-1, .5], eR: [1, .5], tr: .1 }],   // GULP
  [11.15, { mouth: 'wobble', squash: 0, head: .06, tr: .15 }],
  [11.7, { eyes: 'puppy', look: [.6, -.2], mouth: 'cat', talk: 1, sweat: 0, tilt: .6, brow: .3, browR: .3, blush: 1, head: .12, lean: .02, hL: [-14, -110], hR: [14, -110], eL: [-1, .6], eR: [1, .6], handL: 'fist', handR: 'fist', tr: .2 }],
  [12.9, { talk: 0 }],
  [14.1, { eyes: 'happy', look: [0, 0], mouth: 'grin', head: -.06, lean: -.02, hR: [150, -232], eR: [1, -.6], handR: 'open', hL: [-84, -30], eL: [-1, -.4], blush: .9, tilt: .3, tr: .2 }],   // sheepish
  [14.35, { hR: [168, -214], tr: .1 }], [14.6, { hR: [150, -234], tr: .1 }], [14.85, { hR: [168, -214], tr: .1 }], [15.1, { hR: [150, -234], tr: .1 }],
  [15.5, { mouth: 'cat', head: .08, tr: .25 }],
];
const R0 = { hip: [0, -112], lean: 0, head: .04, hL: [-84, -30], hR: [84, -30], eL: [-1, -.4], eR: [1, -.4], handL: 'fist', handR: 'fist', fL: [-44, 0], fR: [44, 0],
  eyes: 'open', look: [-1, 0], lid: .45, brow: -.1, browR: .45, tilt: 0, mouth: 'flat', blush: 0, sweat: 0, talk: 0, hop: 0, squash: 0 };
const GIG = []; for (let t = GIGGLE[0] + .15, i = 0; t < GIGGLE[1]; t += .1, i++) GIG.push([t, { head: i % 2 ? -.1 : .02, hop: i % 2 ? 0 : 9, tr: .05 }]);
const RADHA = [
  [0, R0],
  [3.4, { lean: -.07, head: -.05, hL: [-170, -160], eL: [0, 1], handL: 'point', talk: 1, lid: .5, browR: .9, tr: .18 }],   // "Open."
  [3.9, { talk: 0 }],
  [4.95, { eyes: 'wide', look: [-1, 0], mouth: 'o', lid: 0, brow: .7, browR: .7, lean: .03, head: .03, hL: [-90, -60], hR: [90, -60], eL: [-1, .4], eR: [1, .4], handL: 'open', handR: 'open', tr: .1 }],   // whoa
  [5.7, { eyes: 'sparkle', mouth: 'open', blush: .6, hL: [-92, -214], hR: [92, -214], eL: [-1, .2], eR: [1, .2], head: -.06, lean: 0, tr: .25 }],   // awe
  [6.15, { talk: 1 }], [6.75, { talk: 0 }],
  [7.6, { look: [-.5, -1], tr: .15 }],
  [8.2, { mouth: 'smile', hR: [100, -204], eR: [1, .6], handR: 'open', hL: [-70, -60], eL: [-1, .4], handL: 'fist', head: .02, tr: .18 }],   // waves back, shy
  [8.45, { hR: [128, -196], tr: .12 }], [8.7, { hR: [98, -208], tr: .12 }], [8.95, { hR: [128, -196], tr: .12 }], [9.2, { hR: [100, -204], tr: .12 }],
  [9.6, { eyes: 'open', lid: .5, look: [-.8, -.8], mouth: 'flat', blush: 0, brow: -.2, browR: .85, talk: 1, hL: [-150, -214], eL: [0, 1], handL: 'point', hR: [84, -30], eR: [1, -.4], handR: 'fist', head: -.04, tr: .18 }],   // "…is that MUD?"
  [10.4, { talk: 0 }],
  [10.62, { look: [-1, 0], hL: [34, -88], hR: [-34, -82], eL: [-1, .3], eR: [1, .3], handL: 'fist', handR: 'fist', head: .06, lid: .6, browR: .9, tr: .15 }],   // arms crossed
  [12.9, { browR: 1.1, lid: .7, tr: .4 }],
  [13.4, { mouth: 'wobble', blush: .4, tr: .1 }],   // trying not to laugh
  [GIGGLE[0], { eyes: 'squeeze', mouth: 'grin', lid: 0, blush: 1, hL: [-58, -172], hR: [58, -172], eL: [-1, .6], eR: [1, .6], handL: 'open', handR: 'open', head: -.08, lean: -.03, brow: .2, browR: .2, tr: .12 }],
  ...GIG,
  [15.2, { eyes: 'happy', mouth: 'cat', hL: [-92, -214], hR: [92, -214], eL: [-1, .2], eR: [1, .2], head: -.06, hop: 0, lean: 0, tr: .2 }],
];

// the float in zero-g (held time): rises as the universe opens, drops when he gulps it back
function floatAt(td, ph) {
  if (td < 5.1 || td >= DROP) return 0;
  const k = td < FALL ? sm(seg(td, 5.1, 6.2)) : 1 - seg(td, FALL, DROP) ** 2;
  return k * (44 + 14 * Math.sin(td * 2.2 + ph));
}
// how much of the universe is out (full frame rate): bursts out with an overshoot, swells a little, then is sucked in
function spaceK(t) {
  if (t < BURST || t >= SUCK1) return 0;
  if (t < OPEN1) return backOut(seg(t, BURST, OPEN1), 1.2);
  if (t < SWELL) return 1;
  if (t < SUCK0) return 1 + .06 * Math.sin(seg(t, SWELL, SUCK0) * Math.PI / 2);
  const u = seg(t, SUCK0, SUCK1); return 1.06 * (1 - u * u);
}
const KVR_SCR = document.createElement('canvas').getContext('2d');
function shadow(c, x, y, w, a = .22) {
  if (a <= .01) return;
  c.save(); c.translate(x, y); c.scale(1, .2); const g = c.createRadialGradient(0, 0, 0, 0, 0, w);
  g.addColorStop(0, `rgba(150,90,110,${a})`); g.addColorStop(1, 'rgba(150,90,110,0)'); c.fillStyle = g; c.fillRect(-w, -w, 2 * w, 2 * w); c.restore();
}
// a handwritten line: Kalam, the speaker's colour on a cream halo, popping in, re-wobbling a little each drawing
function hand(c, txt, x, y, col, age, size = 76) {
  const k = popK(age); if (k <= .01) return;
  const d = Math.floor(celHold(T) * 10), j = i => (hash(d * 3.7 + i + txt.length) - .5);
  c.save(); c.translate(x + j(1) * 3, y + j(2) * 3); c.rotate(j(3) * .02); c.scale(k, k);
  c.font = `700 ${size}px Kalam`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.lineJoin = 'round'; c.strokeStyle = '#FFF8EE'; c.lineWidth = 16; c.strokeText(txt, 0, 0);
  c.fillStyle = col; c.fillText(txt, 0, 0); c.restore();
}

// where the earth and the clod are (full frame rate)
function earthAt(t) {
  if (t < EARTH_IN[0]) return null;
  const u = sm(seg(t, EARTH_IN[0], EARTH_IN[1])), b = Math.sin(t * 1.6) * 6;
  return [lerp(1010, 660, u), lerp(470, 726, u) + b];
}
function clodAt(t) {
  if (t < CLOD_IN[0]) return null;
  const u = seg(t, CLOD_IN[0], CLOD_IN[1]), e = 1 - (1 - u) ** 3;
  return { x: lerp(-90, 480, e), y: lerp(560, 700, e) + Math.sin(t * 2.4) * 7, rot: (1 - e) * -5 + Math.sin(t * 1.3) * .15 };
}
// the universe's bodies, drawn round the mouth's transform
function cosmos(c, t, td) {
  celGalaxy(c, 830, 290, 230, -.35);
  celGalaxy(c, 230, 1720, 170, .5, .8);
  // a shooting star
  const ss = seg(t, 6.5, 7.1);
  if (ss > 0 && ss < 1) { const x = lerp(1120, 560, ss), y = lerp(330, 600, ss); c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,240,200,.6)'; c.lineCap = 'round'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 180, y - 86); c.stroke(); c.restore(); celSparkle(c, x, y, 20, { rot: t * 4 }); }
  celSun(c, 165 + Math.sin(t * .5) * 6, 640 + Math.cos(t * .4) * 8, 62, t);
  celMoon(c, 945 + Math.sin(t * .45 + 1) * 6, 650 + Math.cos(t * .5) * 8, 46);
  celPlanet(c, 965 + Math.sin(t * .4 + 2) * 7, 1330 + Math.cos(t * .5 + 1) * 9, 44, { col: '#C9A6FF', sh: '#9C74E4', lt: '#E8D8FF', ring: '#FFD36A', face: 'happy', rot: -.25 });
  celPlanet(c, 92 + Math.sin(t * .6 + 3) * 5, 1430 + Math.cos(t * .5 + 2) * 8, 34, { col: '#FF8A6E', sh: '#E0583E', lt: '#FFC0A8', band: 'rgba(200,70,50,.35)', face: 'open' });
  celPlanet(c, 108 + Math.sin(t * .7) * 5, 860 + Math.cos(t * .6) * 6, 24, { col: '#6FE0C8', sh: '#3AB49E', lt: '#B8F6E8', face: 'happy' });
  celPlanet(c, 560 + Math.sin(t * .5 + 4) * 6, 1720, 30, { col: '#FFB0D0', sh: '#E880A8', lt: '#FFE0EC', face: 'sleep' });
  // the earth with Vraja, and Radha on it, waving
  const E = earthAt(t);
  if (E) {
    const top = celEarth(c, E[0], E[1], 76, t);
    const wv = td >= WAVE0, ph = Math.floor(td * 5) % 2;
    const TR = { ...R0, td, eyes: 'happy', mouth: wv ? 'open' : 'cat', lid: 0, brow: .2, browR: .2, look: [0, 0], blush: .5, head: wv ? (ph ? .08 : -.04) : 0,
      hR: wv ? (ph ? [190, -232] : [204, -168]) : [84, -30], eR: wv ? [1, .6] : [1, -.4], handR: wv ? 'open' : 'fist', hop: wv ? (ph ? 6 : 0) : 0, land: 9 };
    CEL.inkK = 2.2; celRadha(c, top[0], top[1] + 6, .25, TR, { seed: 777 }); CEL.inkK = 1;
  }
  const M = clodAt(t);
  if (M) celClod(c, M.x, M.y, 44, M.rot);
}

SHOTS.push({ a: 0, b: DUR + 1, draw(c, t) {
  c.fillStyle = '#FFF8EE'; c.fillRect(0, 0, W, H);
  let g = c.createRadialGradient(540, 1150, 0, 540, 1150, 700); g.addColorStop(0, 'rgba(255,214,222,.45)'); g.addColorStop(1, 'rgba(255,214,222,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const K = celKeys(t, KANHA), R = celKeys(t, RADHA), td = K.td;
  const fk = floatAt(td, 0), fr = floatAt(td, 1.7);
  K.hop = (K.hop || 0) + fk; R.hop = (R.hop || 0) + fr;
  if (td >= DROP) { K.land = Math.min(K.land, td - DROP); R.land = Math.min(R.land, td - DROP); }
  const sk = spaceK(t);
  // the mouth, where the universe comes out (a dry run of the drawing on a scratch canvas)
  const mouth = sk > 0 ? celKanha(KVR_SCR, KX, GROUND, KS, K).mouth : [KX, 1140];
  mouth[1] += 18;
  if (sk < 1) { shadow(c, KX, GROUND + 4, 170 - fk * 2, .22 * (1 - fk / 50)); shadow(c, RX, GROUND + 4, 160 - fr * 2, .22 * (1 - fr / 50)); }
  if (sk > 0) {
    const r = t < SUCK0 ? 2300 * seg(t, BURST, BURST + .42) ** 1.5 : Math.min(sk, 1.06) * 2400 * Math.min(1, sk * 1.2);
    c.save(); c.beginPath(); c.arc(mouth[0], mouth[1], Math.max(1, r), 0, TAU); c.clip();
    celSpace(c, t);
    const sucking = t >= SUCK0, rot = sucking ? (1 - sk) * 2.2 : (1 - Math.min(sk, 1)) * -1.2;
    c.save(); c.translate(...mouth); c.rotate(rot); c.scale(sk, sk); c.translate(-mouth[0], -mouth[1]);
    cosmos(c, t, td);
    c.restore(); c.restore();
    // the iris's rim, while it is on screen
    if (r < 2200) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(190,150,255,.45)'; c.lineWidth = 34; c.beginPath(); c.arc(mouth[0], mouth[1], r, 0, TAU); c.stroke(); c.restore();
      celBegin(t); const P = []; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU; P.push([mouth[0] + Math.cos(a) * r, mouth[1] + Math.sin(a) * r]); } P.push(P[0]); celLine(c, P, 7, { taper: 0, col: '#2A1A66' }); }
  }
  const AK = celKanha(c, KX, GROUND, KS, K), AR = celRadha(c, RX, GROUND, KS, R);
  if (td >= DROP && td < DROP + .5) { celPuff(c, KX, GROUND - 6, 80, 1 - (td - DROP) / .5); celPuff(c, RX, GROUND - 6, 76, 1 - (td - DROP) / .5); }
  if (t > 2.15 && t < 2.65) celPuff(c, KX, GROUND - 6, 70, 1 - (t - 2.15) / .5);

  // the glow at his mouth while the universe is out, the stars bursting out of it and rushing back in
  const m = AK.mouth;
  if (sk > 0 || (t > 4.7 && t < BURST)) glow(c, m[0], m[1] + 16, 110 + 20 * Math.sin(t * 5), '#B48CFF', .55);
  const bu = seg(t, BURST - .05, BURST + .95);
  if (bu > 0 && bu < 1) for (let i = 0; i < 24; i++) {
    const a = hash(i * 1.9) * TAU, R0_ = 300 + 700 * hash(i * 3.3 + 1), e = 1 - (1 - bu) ** 2.4, rr = R0_ * e;
    celSparkle(c, m[0] + Math.cos(a) * rr, m[1] + 16 + Math.sin(a) * rr, (14 + 18 * hash(i + 7)) * (1 - bu * .7), { rot: a + bu * 3, col: ['#FFE07A', '#FFFFFF', '#FFB0E0', '#B8E6FF'][i % 4] });
  }
  const su = seg(t, SUCK0 - .08, SUCK1);
  if (su > 0 && su < 1) for (let i = 0; i < 20; i++) {
    const a = hash(i * 2.7 + 4) * TAU + su * 2.4, R0_ = 380 + 600 * hash(i * 5.1), rr = R0_ * (1 - su) ** 1.6;
    celSparkle(c, m[0] + Math.cos(a) * rr, m[1] + 16 + Math.sin(a) * rr, (12 + 16 * hash(i + 3)) * (.4 + .6 * (1 - su)), { rot: a, col: ['#FFE07A', '#FFFFFF', '#FFB0E0'][i % 3] });
  }

  // Kanha's "!" at the mud, his innocent sparkles, her giggle lines, the hearts
  const top = AK.top;
  if (td >= 9.95 && td < 10.6) celMark(c, top[0] - 150, top[1] + 60, popK(td - 9.95) * .9, '!');
  if (td >= 11.8 && td < 13.9) for (let i = 0; i < 5; i++) {
    const a = -2.6 + i * .55, r = 250 + (i % 2) * 40, tw = .65 + .35 * Math.abs(Math.sin(td * 5 + i * 1.7));
    celSparkle(c, AK.head[0] + Math.cos(a) * r, AK.head[1] + Math.sin(a) * r * .8, (22 + (i % 3) * 8) * popK(td - 11.8 - i * .08) * tw, { rot: i });
  }
  if (td >= GIGGLE[0] && td < GIGGLE[1]) {
    const on = Math.floor(td * 10) % 2;
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {
      const cx = AR.head[0] + sd * (225 + i * 4), cy = AR.head[1] - 40 + i * 44 + (on ? 4 : -4), l = 22 - Math.abs(i - 1) * 6;
      celLine(c, [[cx, cy - l], [cx + sd * 10, cy], [cx, cy + l]], 5, { taper: .5 });
    }
  }
  HEART_T.forEach((h0, i) => {
    const u = td - h0; if (u < 0 || u > 2.4) return;
    const sd = i % 2 ? 1 : -1, x = AR.head[0] + sd * (70 + i * 30) + Math.sin(u * 4 + i) * 12, y = AR.head[1] - 230 - u * 80;
    celHeart(c, x, y, (30 + (i % 2) * 10) * popK(u), { rot: sd * .2, a: 1 - seg(u, 1.8, 2.4) });
  });
  if (td >= 15.3) celHeart(c, (AK.head[0] + AR.head[0]) / 2, AK.head[1] - 40 - Math.sin(td * 3) * 6, 26 * popK(td - 15.3), { rot: -.1 });

  // the lines
  for (const [a, b, who, L, dl] of LINES) {
    if (t < a || t >= b) continue;
    L.forEach((s, i) => hand(c, s, LX[who], 450 + i * 78 - (L.length === 1 ? -36 : 0), INK[who], t - a - (dl ? dl[i] : 0) + (a < 0 ? 9 : 0)));
  }
  text(c, '@therishikatha', 540, 1560, '600 30px Poppins', sk > .5 ? 'rgba(235,220,255,.45)' : 'rgba(150,100,120,.5)');
} });
LOOK.bloom = 0; LOOK.vignette = 0; LOOK.grain = .02;
