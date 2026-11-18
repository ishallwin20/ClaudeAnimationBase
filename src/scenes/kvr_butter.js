// kvr_butter.js: "Kanha vs Radha" #1, The butter thief (Cel style; STORYBOARD.md). One frame, like a comic panel: Kanha
// (butter all over his face) brags, Radha points at his face, he blames the monkeys, a monkey hops in with a full pot
// and a clean face ("Not me."), and Kanha offers Radha some butter. She melts. Bhagavata 10.8.29, 10.9.8.
// Lines are handwritten (Kalam), in the speaker's colour, at the top of the safe band; every one re-wobbles each drawing.
const GROUND = 1478, KX = 300, RX = 742, KS = 1.1, MS = 1, MGROUND = 1525;
const MON_IN = 9.3, MON_HOP1 = 9.7, MON_LAND = 10.1, HEART_T = [13.45, 13.75, 14.05, 14.4];
const INK = { k: '#2F5FC4', r: '#D23A78', m: '#8A5426' };
// [from, to, who, lines, delays (s after `from` that each line appears)]
const LINES = [
  [-1, 3.2, 'k', ['Nobody can catch', 'the butter thief!']],
  [3.3, 6.5, 'r', ['Kanha…', 'your face.'], [0, .75]],
  [6.6, 9.5, 'k', ['The MONKEYS', 'ate it!']],
  [10.4, 12.3, 'm', ['Not me.']],
  [12.4, 99, 'k', ['…want some?']],
];
const LX = { k: 410, r: 730, m: 560 };

const K0 = { hip: [0, -112], lean: 0, head: -.1, hL: [-84, -30], hR: [84, -30], eL: [-1, -.4], eR: [1, -.4], handL: 'fist', handR: 'fist', fL: [-44, 0], fR: [44, 0],
  eyes: 'closed', look: [0, 0], lid: 0, brow: .1, browR: .1, tilt: 0, mouth: 'grin', blush: 0, sweat: 0, butter: 1, talk: 1, hop: 0, squash: 0 };
const KANHA = [
  [0, K0],
  [1.5, { talk: 0, mouth: 'grin' }],
  [1.95, { hop: 30, squash: -.4, tr: .15, head: -.14 }],
  [2.2, { hop: 0, squash: 0, tr: .15 }],
  [3.5, { eyes: 'open', look: [1, 0], mouth: 'o', head: .04, tr: .2 }],
  [4.4, { eyes: 'wide', look: [0, 0], mouth: 'wobble', sweat: 1, tilt: 1, brow: .6, browR: .6, hL: [-80, -40], hR: [94, -222], eR: [1, .7], handR: 'open', lean: -.05, tr: .15 }],
  [6.6, { eyes: 'puppy', mouth: 'cat', talk: 1, sweat: 0, tilt: .6, brow: .3, browR: .3, blush: 1, head: .12, lean: .02, hL: [-14, -110], hR: [14, -110], eL: [-1, .6], eR: [1, .6], handL: 'fist', handR: 'fist' }],
  [7.9, { talk: 0 }],
  [10.15, { eyes: 'wide', mouth: 'o', look: [1, .6], sweat: 1, blush: 0, head: -.04, lean: -.03, tilt: 1, brow: .8, browR: .8, hL: [-84, -56], hR: [84, -56], eL: [-1, .5], eR: [1, .5], handL: 'open', handR: 'open', tr: .12 }],
  [11.0, { mouth: 'wobble' }],
  [12.4, { eyes: 'happy', look: [0, 0], mouth: 'grin', talk: 1, sweat: 0, blush: .7, tilt: .3, brow: .2, browR: .2, head: .1, lean: .06, hR: [150, -150], eR: [0, 1], handR: 'butter' }],
  [13.3, { talk: 0, blush: 1 }],
];
const R0 = { hip: [0, -112], lean: 0, head: .04, hL: [34, -88], hR: [-34, -82], eL: [-1, .3], eR: [1, .3], handL: 'fist', handR: 'fist', fL: [-44, 0], fR: [44, 0],
  eyes: 'open', look: [-1, 0], lid: .45, brow: -.1, browR: -.1, tilt: 0, mouth: 'flat', blush: 0, sweat: 0, talk: 0, hop: 0, squash: 0 };
const RADHA = [
  [0, R0],
  [3.3, { hL: [-170, -196], eL: [0, 1], handL: 'point', hR: [70, -40], eR: [1, .2], talk: 1, lid: .5, browR: .8, head: -.06, lean: -.05 }],
  [4.7, { talk: 0 }],
  [6.6, { hL: [34, -88], hR: [-34, -82], eL: [-1, .3], eR: [1, .3], handL: 'fist', handR: 'fist', lid: .55, brow: -.2, browR: .9, head: .06, lean: 0 }],
  [10.35, { eyes: 'closed', mouth: 'smug', lid: 0, head: .1, brow: .2, browR: .2, look: [0, 0] }],
  [13.3, { eyes: 'happy', mouth: 'cat', blush: 1, head: -.08, lean: -.04, hL: [-92, -214], hR: [92, -214], eL: [-1, .2], eR: [1, .2], handL: 'open', handR: 'open', tr: .25 }],
];
const MONKEY = [
  [0, { eyes: 'open', mouth: 'flat', look: [-1, 0], pot: true, head: 0, lean: 0, talk: 0, blush: 0 }],
  [10.5, { talk: 1, head: .16, tr: .12 }], [10.8, { head: -.16, tr: .12 }], [11.1, { head: .14, tr: .12 }], [11.4, { head: 0, talk: 0, tr: .12 }],
  [13.35, { eyes: 'sparkle', mouth: 'open', look: [1, -.6], blush: .6 }],
];
// the monkey's two hops in from the right: x, the height off the ground, and the time since it last landed
function monkeyAt(t) {
  const td = celHold(t);
  if (td < MON_IN) return null;
  if (td < MON_HOP1) { const u = seg(td, MON_IN, MON_HOP1); return { x: lerp(1240, 840, u), hop: Math.sin(u * Math.PI) * 170, land: 9 }; }
  if (td < MON_LAND) { const u = seg(td, MON_HOP1, MON_LAND); return { x: lerp(840, 556, u), hop: Math.sin(u * Math.PI) * 120, land: td - MON_HOP1, lx: 840 }; }
  return { x: 556, hop: 0, land: td - MON_LAND, lx: 556 };
}

function shadow(c, x, y, w, a = .22) {
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

SHOTS.push({ a: 0, b: DUR + 1, draw(c, t) {
  c.fillStyle = '#FFF8EE'; c.fillRect(0, 0, W, H);
  let g = c.createRadialGradient(540, 1150, 0, 540, 1150, 700); g.addColorStop(0, 'rgba(255,214,222,.45)'); g.addColorStop(1, 'rgba(255,214,222,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const K = celKeys(t, KANHA), R = celKeys(t, RADHA), M = monkeyAt(t), MP = celKeys(t, MONKEY), td = K.td;
  shadow(c, KX, GROUND + 4, 170 - K.hop * .8); shadow(c, RX, GROUND + 4, 160);
  const AK = celKanha(c, KX, GROUND, KS, K), AR = celRadha(c, RX, GROUND, KS, R);
  if (M) { shadow(c, M.x, MGROUND + 4, 120 - M.hop * .4); celMonkey(c, M.x, MGROUND, MS, { ...MP, hop: M.hop, land: M.land }); }
  if (M && M.land < .5) celPuff(c, M.lx - 10, MGROUND - 6, 70, 1 - M.land / .5);
  if (t > 2.2 && t < 2.7) celPuff(c, KX, GROUND - 6, 80, 1 - (t - 2.2) / .5);

  // Kanha's "!" when he's caught, his innocent sparkles, the monkey's verdict, the hearts
  const top = AK.top;
  if (td >= 4.4 && td < 6.5) celMark(c, top[0] - 150, top[1] + 60, popK(td - 4.4) * .9, '!');
  if (td >= 10.15 && td < 12.3) celMark(c, top[0] - 160, top[1] + 70, popK(td - 10.15) * .9, '!?');
  if (td >= 6.7 && td < 9.6) for (let i = 0; i < 5; i++) {
    const a = -2.6 + i * .55, r = 250 + (i % 2) * 40, tw = .65 + .35 * Math.abs(Math.sin(td * 5 + i * 1.7));
    celSparkle(c, AK.head[0] + Math.cos(a) * r, AK.head[1] + Math.sin(a) * r * .8, (22 + (i % 3) * 8) * popK(td - 6.7 - i * .08) * tw, { rot: i });
  }
  HEART_T.forEach((h0, i) => {
    const u = td - h0; if (u < 0 || u > 2.4) return;
    const sd = i % 2 ? 1 : -1, x = AR.head[0] + sd * (70 + i * 30) + Math.sin(u * 4 + i) * 12, y = AR.head[1] - 230 - u * 80;
    celHeart(c, x, y, (30 + (i % 2) * 10) * popK(u), { rot: sd * .2, a: 1 - seg(u, 1.8, 2.4) });
  });
  if (td >= 13.3) celHeart(c, (AK.head[0] + AR.head[0]) / 2, AK.head[1] - 40 - Math.sin(td * 3) * 6, 26 * popK(td - 13.5), { rot: -.1 });

  // the lines
  for (const [a, b, who, L, dl] of LINES) {
    if (t < a || t >= b) continue;
    L.forEach((s, i) => hand(c, s, LX[who], 450 + i * 78 - (L.length === 1 ? -36 : 0), INK[who], t - a - (dl ? dl[i] : 0) + (a < 0 ? 9 : 0)));
  }
  // the watermark
  text(c, '@therishikatha', 540, 1560, '600 30px Poppins', 'rgba(150,100,120,.5)');
} });
LOOK.bloom = 0; LOOK.vignette = 0; LOOK.grain = .02;
