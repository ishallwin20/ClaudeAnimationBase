// lakshmi.js: Maa Lakshmi, the goddess of wealth, standing, on Parvati's rig (parvati.js): golden skin, a rose-pink
// saree with a gold border, a gold blouse, a tall gold kirita with a lotus jewel, a gold halo, and four arms as in her
// images: the back pair raise pink lotuses, the front right hand is open (varada) with gold coins pouring from the
// palm, the front left holds a gold kalash brimming with coins. Load after parvati.js and shailputri.js (lotus()).
// (x, y) is the ground under her; u is the size unit (about 26.5u tall to the tip of the kirita).
//
// lakshmi(x, y, u, o): every parvati() option works (walk, hx, htilt, lean, eyes, mouth, lookX, blush, handL / handR,
// pray, emote, boilKey…); and
//   coins 0..1     the stream of coins from her right palm (its strength), coinsTo: the ground y in world space
//                  (default y: her feet), coinT: the time that drives the stream (default T)
//   lotuses 0..1   the back arms' lotuses open (default 1); backArms: false leaves the back arms off
//   halo 0..1      the gold halo behind her head (default 1), glowK 0..1 (her warm light, default .6)
//   kalash: false  no pot in the left hand
// Helpers: lakshmiPalm(x, y, u, o) → world [x, y] of the right palm (where coins leave); lakshmiCoin(x, y, r, spin, key)
// draws one coin; lakshmiCoinRain(t, t0, o) a full-frame shower of coins (screen space; o: n, x0, x1, y1, key).
const LKS_PAL = {
  skin: '#F6C79C', skinDk: '#DBA076', skinLt: '#FFE4C8', saree: '#E0406E', sareeDk: '#A82A55', sareeLt: '#F583A8',
  blouse: '#E9AE3A', blouseDk: '#B67D1C', bangle: '#C8324A', lip: '#D0506A', sindoor: '#D2283A',
  coin: '#F2C043', coinDk: '#B8841C', coinLt: '#FFE79A', lotus: '#F48FB1', lotusDk: '#D45C8A', halo: '#FFD873',
};
const LKS_SKIN = { col: LKS_PAL.skin, dk: LKS_PAL.skinDk, lt: LKS_PAL.skinLt };
const LKS_HAND_R = [3.5, -12.6], LKS_HAND_L = [-3.1, -12.9];

// one gold coin, centred at (x, y), radius r; spin turns it edge-on (|cos| squashes it across)
function lakshmiCoin(x, y, r, spin = 0, key) {
  if (key != null) boilSeed('coin ' + key);
  const sx = Math.max(.15, Math.abs(Math.cos(spin)));
  push(); translate(x, y); scale(sx, 1);
  paint(ellPts(0, 0, r, r, 14), { wash: LKS_PAL.coin, fill: LKS_PAL.coinDk, fillOp: 40, tex: .3, ink: PAL.ink, sw: clamp(r / 14, .4, 1.4) });
  if (sx > .45) { inkLine(ellPts(0, 0, r * .62, r * .62, 12), clamp(r / 16, .3, 1.2), LKS_PAL.coinDk, 'inkfine', .5); paint(ellPts(-r * .3, -r * .35, r * .22, r * .14, 8), { wash: LKS_PAL.coinLt, ink: null }); }
  pop();
}
function lakshmiPalm(x, y, u, o = {}) { return parvatiHand(x, y, u, { handR: LKS_HAND_R, ...o }, 1); }

// her crown: a tall gold kirita in tiers, a pink lotus jewel, little flares at the sides (parvati head space)
function lakshmiCrown(u, sw, C) {
  const INK = C.ink, P = pts => U(pts, u);
  paint(P([[-2.15, -22.3], [2.15, -22.3], [2.3, -23.3], [1.75, -24.2], [1.3, -24.0], [.8, -25.0], [.35, -25.3], [0, -26.1], [-.35, -25.3], [-.8, -25.0], [-1.3, -24.0], [-1.75, -24.2], [-2.3, -23.3]]), { wash: C.gold, fill: C.goldDk, fillOp: 55, tex: .5, ink: INK, sw: sw * .65, curv: .12 });
  inkLine(P([[-2.1, -23.0], [0, -23.25], [2.1, -23.0]]), sw * .55, C.goldDk, 'inkfine', .5);
  for (const k of [-1.5, -.75, .75, 1.5]) paint(ellPts(k * u, -22.7 * u, .14 * u, .14 * u, 6), { wash: C.goldLt, ink: null });
  paint(ellPts(0, -24.0 * u, .5 * u, .42 * u, 10), { wash: LKS_PAL.lotus, ink: INK, sw: sw * .4 });   // the lotus jewel
  for (const s of [-1, 1]) paint(ellPts(s * 1.3 * u, -23.55 * u, .22 * u, .22 * u, 8), { wash: '#3FB6A8', ink: null });
  paint(ellPts(0, -26.15 * u, .22 * u, .22 * u, 8), { wash: C.goldLt, ink: INK, sw: sw * .35 });
}
// a gold kalash, brimming with coins, at the hand (arm hook space)
function lakshmiKalash(u, sw, INK) {
  const P = pts => U(pts, u);
  push(); translate(0, -.5 * u);
  for (const [cx, cy] of [[-.45, -1.75], [.45, -1.8], [0, -2.05]]) lakshmiCoin(cx * u, cy * u, .38 * u, .4);
  paint(P([[-.75, -1.45], [.75, -1.45], [.6, -1.05], [1.15, -.5], [1.2, .25], [.8, .8], [-.8, .8], [-1.2, .25], [-1.15, -.5], [-.6, -1.05]]), { wash: LKS_PAL.coin, fill: LKS_PAL.coinDk, fillOp: 60, tex: .4, ink: INK, sw: sw * .6, curv: .45 });
  inkLine(P([[-1.1, -.15], [0, .05], [1.1, -.15]]), sw * .6, LKS_PAL.sareeDk, 'ink', .5);
  paint(P([[-.85, -1.6], [.85, -1.6], [.85, -1.35], [-.85, -1.35]]), { wash: LKS_PAL.coinDk, ink: INK, sw: sw * .4 });
  pop();
}

function lakshmi(x, y, u, o = {}) {
  const C = { ...PRV, ...LKS_PAL, ...(o.pal || {}) }, INK = C.ink, lot = o.lotuses ?? 1, hal = o.halo ?? 1;
  const q = { ...o, ...LKS_SKIN, pal: C, crown: o.crown ?? lakshmiCrown };   // her own skin always (feel() hands over Clawd's)
  if (!q.handR) q.handR = LKS_HAND_R;
  if (!q.handL) q.handL = LKS_HAND_L;
  q.behind = (uu, sw) => {
    if (hal > 0) {   // the halo, a gold ring behind her head
      glow(0, -20.6 * uu, 6.5 * uu, C.halo, .45 * hal);
      paint(ellPts(0, -20.6 * uu, 4.3 * uu, 4.3 * uu, 32), { wash: C.halo, washOp: 200 * hal, ink: null });
      inkLine(ellPts(0, -20.6 * uu, 4.3 * uu, 4.3 * uu, 32).concat([[4.3 * uu, -20.6 * uu]]), sw * 1.6, C.gold, 'ink', .5);
    }
    if (o.backArms !== false) for (const s of [-1, 1]) {   // the back arms, raising lotuses
      const sh = [s * 2.2, -15.9], el = [s * 4.75, -15.6 + Math.sin(T * 1.3 + s) * .1], ha = [s * 5.15, -19.3 + Math.sin(T * 1.3 + s) * .15];
      const sk = mixCol(q.col, q.dk, .35);
      paint(ribbon(U([sh, el, ha], uu), .95 * uu, .7 * uu), { wash: sk, fill: q.dk, fillOp: 40, tex: .5, ink: INK, sw: sw * .75 });
      for (const k of [.6, .72]) { const bx = lerp(el[0], ha[0], k), by = lerp(el[1], ha[1], k); inkLine(U([[bx - .45, by], [bx + .45, by]], uu), sw * 1.1, k < .65 ? C.bangle : C.gold, 'ink', 0); }
      push(); translate(ha[0] * uu, ha[1] * uu); rotate(s * .18);
      lotus(uu * .95, sw, lot, INK);
      paint(ellPts(0, .35 * uu, .55 * uu, .5 * uu, 12), { wash: sk, ink: INK, sw: sw * .6 });   // the hand round the stem
      pop();
    }
    if (o.behind) o.behind(uu, sw);
  };
  const hookR = o.armR, hookL = o.armL;
  q.armR = (uu, sw) => {   // the open palm, fingers down (varada)
    for (const k of [-.3, 0, .3]) inkLine(U([[k, .25], [k * 1.1, .7]], uu), sw * .5, INK, 'inkfine', 0);
    paint(ellPts(0, .05 * uu, .2 * uu, .2 * uu, 8), { wash: C.sindoor, ink: null });   // the alta dot on her palm
    if (hookR) hookR(uu, sw);
  };
  q.armL = (uu, sw) => { if (o.kalash !== false) lakshmiKalash(uu, sw, INK); if (hookL) hookL(uu, sw); };
  delete q.coins; delete q.coinsTo; delete q.coinT; delete q.lotuses; delete q.halo; delete q.glowK; delete q.kalash; delete q.backArms;
  if (o.glowK ?? .6) { boilSeed(`lakshmi glow ${o.boilKey ?? ''}`); glow(x + (o.dx || 0) * u, y - 14 * u, 16 * u, '#FFD27A', (o.glowK ?? .6) * .5); }
  parvati(x, y, u, q);
  // the coins pouring from her palm to the ground
  const ck = clamp(o.coins || 0);
  if (ck > 0) {
    const [px, py] = lakshmiPalm(x, y, u, q), gy = o.coinsTo ?? y, tt = o.coinT ?? T;
    for (let i = 0; i < 9; i++) {
      const ph = frac(tt * .9 + i / 9), fall = ph * ph;
      if (hash(i * 3.3) > ck + .1) continue;
      const cx = px + (hash(i * 7.1) - .3) * u * 1.6 * ph + u * .3, cy = lerp(py + u * .6, gy - u * .3, fall);
      lakshmiCoin(cx, cy, u * (.42 + .1 * hash(i)), tt * 6 + i, `lk ${o.boilKey ?? ''} ${i}`);
    }
    // a little heap where they land
    boilSeed(`lakshmi heap ${o.boilKey ?? ''}`);
    for (let i = 0; i < Math.round(5 * ck); i++) lakshmiCoin(px + (hash(i * 2.2) - .2) * u * 2 + u * .5, gy - u * (.15 + .25 * hash(i * 4.4)), u * .42, .2 + hash(i) * .9);
  }
}

// A shower of coins over the whole frame (screen space), from t0
function lakshmiCoinRain(t, t0, o = {}) {
  const age = t - t0; if (age < 0) return;
  const n = o.n || 24, x0 = o.x0 ?? 0, x1 = o.x1 ?? W, y1 = o.y1 ?? H + 60;
  for (let i = 0; i < n; i++) {
    const st = hash(i * 1.9) * .8, a = age - st; if (a < 0) continue;
    const x = lerp(x0, x1, hash(i * 3.1)) + 30 * Math.sin(a * 3 + i), y = -60 + a * a * 900 + a * 200;
    if (y > y1) continue;
    lakshmiCoin(x, y, 18 + 8 * hash(i * 5.3), a * 8 + i, `rain ${o.key || ''} ${i}`);
  }
}

// Model sheet: studio.html?loop=lakshmi, or node render.mjs --loop=lakshmi --sheet=0.5 --cols=1 --w=540
(() => {
  LOOPS.lakshmi = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2A2C5E', ink: null });
    lakshmi(300, 900, 22, { eyes: 'normal', mouth: 'smile', coins: 1, boilKey: 'l1' });
    lakshmi(780, 900, 22, { ...feel('happy', t), ...LKS_SKIN, walk: t * 1.1, coins: .5, boilKey: 'l2' });
    lakshmi(300, 1760, 22, { eyes: 'closed', mouth: 'smile', handR: [4.6, -16], lean: 1, htilt: .1, halo: .5, boilKey: 'l3' });
    lakshmi(780, 1760, 22, { eyes: 'wide', mouth: 'O', lookX: .8, kalash: false, handL: [-1.4, -15.6], boilKey: 'l4' });
    lakshmiCoinRain(t % 2, 0, { n: 12, key: 'm' });
  };
  LOOPS.lakshmi.len = 4;
})();
