// kali.js: Maa Kali, who burst out of Durga's forehead (Devi Mahatmya, ch. 7) and drank Raktabija's blood before a
// drop could touch the ground (ch. 8): deep-blue skin, wild hair, a third eye, the skull mala, a tall gold mukut, a
// red saree, and HER TONGUE, out. Four arms: a curved khadga raised (back, screen-right), an open hand (back,
// screen-left), a kapala (a skull bowl) in the front left hand and abhaya (an open palm, "don't fear") in the front
// right. Built on Kalaratri (kalaratri.js: same body, hair, mukut, halo, mala and arm solver).
// Load after kalaratri.js.
//
// kali(x, y, u, o): (x, y) is the ground under her; u is the size unit (as kalaratri(): about 27u to the mukut tip).
// Every kalaratri() option works (pose, hair, eyes, mouths, arms, aura, halo, emote…). Hers:
//   tongue 0..1   how far her tongue is out (1 = the classic, tongueLen u long; default 1)
//   tongueLen     u (default 3.0); tongueWag -1..1 swings the tip sideways; tongueW (width ×, default 1)
//   bite 0..1     her upper teeth come down on the tongue (embarrassment: "oops!"), and she blushes
//   kapala        default true (the skull bowl in the front left hand); abhaya default true (the front right palm)
//   tongueOff     true: don't draw the tongue (draw it yourself, e.g. as a long carpet, from kaliMouth())
// Helpers: kaliMouth(x, y, u, o) → world [x, y] of the tongue's root; kaliTongueTip(x, y, u, o); kaliTongue(x0, y0,
// pts, w, o) draws a tongue along any world path (the red-carpet roll); kapala(u, sw) draws the skull bowl.
const KALI = {
  skin: '#2D4C9E', skinDk: '#1D3172', skinLt: '#5C80D2',
  tongue: '#E2303E', tongueDk: '#A81E2E', tongueLt: '#FF8A92', teeth: '#FFF8EC',
};

function kaliMouth(x, y, u, o = {}) { const hx = clamp(o.hx || 0, -1, 1); return shailputriWorld(x, y, u, o, hx * .45 + hx * .8 * 1.18, KAL_HEAD_Y(-17.95)); }
function kaliTongueTip(x, y, u, o = {}) {
  const [mx, my] = kaliMouth(x, y, u, o), L = (o.tongueLen ?? 3) * clamp(o.tongue ?? 1) * u * (1 - (o.sq || 0)), a = o.rot || 0, w = (o.tongueWag || 0) * u;
  return [mx + w * Math.cos(a) - L * Math.sin(a), my + w * Math.sin(a) + L * Math.cos(a)];
}
// a tongue along a world path P (root first), w its width in px at the root; o: lt (highlight), key, sw
function kaliTongue(P, w, o = {}) {
  if (P.length < 2) return;
  boilSeed(o.key || 'tongue');
  const sw = o.sw ?? 1.6, tip = P[P.length - 1], prev = P[P.length - 2], a = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const wt = w * (o.tipK ?? 1.18);
  paint(ribbon(P, w, wt), { wash: KALI.tongue, fill: KALI.tongueDk, fillOp: 50, tex: .4, ink: SHL.ink, sw });
  paint(ellPts(tip[0], tip[1], wt * .52, wt * .48, 16, 0, a), { wash: KALI.tongue, ink: null });
  const arc = []; for (let i = 0; i <= 10; i++) { const b = a - Math.PI / 2 + i / 10 * Math.PI; arc.push([tip[0] + Math.cos(b) * wt * .52, tip[1] + Math.sin(b) * wt * .48]); }
  inkLine(arc, sw, SHL.ink, 'ink', .5);
  // the groove down the middle and a wet highlight
  const n = P.length, mid = P.slice(Math.min(1, n - 2), n).map(([px, py], i, A) => i === A.length - 1 ? [px - Math.cos(a) * wt * .3, py - Math.sin(a) * wt * .3] : [px, py]);
  if (mid.length > 1) inkLine(mid, sw * .8, KALI.tongueDk, 'inkfine', .5);
  const [p0, p1] = [P[0], P[Math.min(1, n - 1)]];
  const hx = lerp(p0[0], p1[0], .5) - Math.sin(a) * w * .22, hy = lerp(p0[1], p1[1], .5) + Math.cos(a) * w * .0;
  paint(ellPts(hx - Math.cos(a) * w * .2, hy, w * .12, w * .3, 8, 0, a), { wash: KALI.tongueLt, washOp: 200, ink: null });
}
// the kapala: a skull bowl, rim up, held at (0, 0) under it
function kapala(u, sw, INK = SHL.ink) {
  paint(U([[-1.25, -.85], [1.25, -.85], [1.05, .05], [.5, .55], [-.5, .55], [-1.05, .05]], u), { wash: KAL.skull, fill: KAL.skullDk, fillOp: 50, tex: .4, ink: INK, sw: sw * .6, curv: .4 });
  paint(ellPts(0, -.85 * u, 1.25 * u, .32 * u, 16), { wash: '#B8202E', ink: INK, sw: sw * .5 });
  paint(ellPts(-.35 * u, -.92 * u, .35 * u, .1 * u, 8), { wash: '#FF7A84', ink: null });
  for (const s of [-1, 1]) paint(ellPts(s * .42 * u, -.15 * u, .2 * u, .22 * u, 8), { wash: KAL.socket, ink: null });
}
function kaliPalm(u, sw, col, INK = SHL.ink) {   // abhaya: an open palm facing us, fingers up
  for (const k of [-1.5, -.5, .5, 1.5]) paint(ribbon(U([[k * .2, -.3], [k * .26, -1.05 + Math.abs(k) * .12]], u), .26 * u, .22 * u), { wash: col, ink: INK, sw: sw * .45 });
  paint(ribbon(U([[.45, .05], [.85, -.35]], u), .26 * u, .22 * u), { wash: col, ink: INK, sw: sw * .45 });
  paint(ellPts(0, 0, .62 * u, .56 * u, 14), { wash: col, ink: INK, sw: sw * .6 });
  paint(ellPts(0, -.05 * u, .2 * u, .2 * u, 8), { wash: '#D2283A', ink: null });   // a red alta dot
}

function kali(x, y, u, o = {}) {
  const tg = clamp(o.tongue ?? 1), bite = clamp(o.bite || 0), col = o.col || KALI.skin;
  const ko = {
    dark: 1, wild: 1, bolt: 0, fire: 0, spear: false, lotus: false, trishul: false, eye3: 1, ...o,
    col, dk: o.dk || KALI.skinDk, lt: o.lt || KALI.skinLt,
    mouth: tg > .05 ? (bite > .3 ? 'teeth' : 'roar') : o.mouth, blush: Math.max(o.blush || 0, bite * .9),
    backL: o.backL || [-6.2, -19.6 + Math.sin(T * 1.5) * .12],
    armL: (uu, sw) => { if (o.kapala !== false) { push(); translate(0, -.45 * uu); kapala(uu, sw); pop(); } if (o.armL) o.armL(uu, sw); },
    armR: (uu, sw) => { if (o.abhaya !== false) kaliPalm(uu, sw, col); if (o.armR) o.armR(uu, sw); },
  };
  kalaratri(x, y, u, ko);
  if (tg > .02 && !o.tongueOff) {
    const [mx, my] = kaliMouth(x, y, u, ko), [tx, ty] = kaliTongueTip(x, y, u, ko), a = o.rot || 0, wg = (o.tongueWag || 0) * u;
    const mid = [lerp(mx, tx, .55) + wg * .25 * Math.cos(a), lerp(my, ty, .55) + wg * .25 * Math.sin(a)];
    const sw = clamp(u / 20, .4, 2) * (o.swMul || 1);
    kaliTongue([[mx, my], mid, [tx, ty]], u * 1.0 * (o.tongueW ?? 1), { key: `kali ${o.boilKey ?? ''} tongue`, sw: sw * .8 });
    if (bite > .3) {   // her teeth on it: oops
      boilSeed(`kali ${o.boilKey ?? ''} bite`);
      push(); translate(mx, my); rotate(a);
      paint(rrPts(-.62 * u, -.32 * u, 1.24 * u, .42 * u, .15 * u), { wash: KALI.teeth, ink: SHL.ink, sw: sw * .5 });
      for (const k of [-.3, 0, .3]) inkLine([[k * u, -.28 * u], [k * u, .05 * u]], sw * .35, KAL.skullDk, 'inkfine', 0);
      pop();
    }
  }
}

// Model sheet: studio.html?loop=kali, or node render.mjs --loop=kali --sheet=0.5 --cols=1 --w=720
(() => {
  LOOPS.kali = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#141A3A', ink: null });
    kali(280, 900, 17, { ...feel('fierce', t), eyes: 'angry', tongueWag: Math.sin(t * 3) * .5, aura: .5, auraCol: '#5A6CFF' });
    kali(800, 900, 17, { ...feel('fierce', t), eyes: 'wide', bite: 1, tongue: .7, lookY: .8, hx: .2 });
    kali(540, 2200, 50, { ...feel('fierce', t), eyes: 'wide', lookX: Math.sin(t * 2), tongueWag: Math.sin(t * 6) * .4, noShadow: true });
  };
  LOOPS.kali.len = 4;
})();
