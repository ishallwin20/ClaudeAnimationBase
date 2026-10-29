// hanuman.js: Hanuman grown up, Shri Ram's servant in Ayodhya, drawn on Narad Muni's rig (narada.js) with its monkey
// face, so he stands at one height with Ram (ram.js) and Sita (parvati() + SITA_PAL): Bal Hanuman's golden fur
// ("kanchan baran") and peach mask, a gold mukut with a ruby, gold kundals, a sindoor U-tilak, a crimson dhoti with a
// gold border, the munja thread across his bare chest, a gold mala and armbands, a long tail curling up behind him
// (screen right), and his gada. Load after narada.js, bal_hanuman.js (BH) and chandraghanta.js (gada()).
// (x, y) is the ground point under him; u is narada()'s unit (about 28u tall to the mukut's tip). Every narada() option
// works (walk, sit, bow, pray, lean, hx, htilt, handL / handR, eyes, mouth, emote, behind, armL / armR, …) except the
// veena, the topknot and the uttariya, which he doesn't have.
// His own options:
//   sindoor 0..1   covers him in sindoor: fur, face, hands and feet turn vermilion (the crown, the dhoti and the gada
//                  keep their colours); sindoorTail 0..1 (default: sindoor) does the tail on its own (the tail dipped last)
//   tail           'curl' (up behind him, default) | 'droop' | false; tailSway (phase, default T-driven)
//   gada 0..1      the mace in his right hand, resting on his right shoulder (gadaA turns it, + tips its head outward)
//   crown          false: no mukut
//   pal            overrides HNM (his colours)
// Helpers: as narada's (naradaHand, naradaHead, naradaMouth, naradaTop, …: same body); hanumanTail(x, y, u, o) → the
// world point of the tail's tip curl.
const HNM = {
  skin: BH.fur, skinDk: BH.furDk, skinLt: BH.furLt, ink: '#4A2A18',
  fur: BH.fur, furDk: BH.furDk, furLt: BH.furLt, mask: BH.face, maskDk: BH.faceDk,
  dhoti: '#B8202E', dhotiDk: '#861422', dhotiLt: '#E2505A', border: '#F2C230',
  shawl: BH.thread, shawlDk: '#C9B070', bead: '#F2C230', beadDk: '#B88A1C', tulsi: '#FFE39A',
  gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A', gem: '#D2283A',
  iris: '#2A160C', mouth: '#7A2A22', white: '#FFF8EC', tilak: BH.tilak, red: BH.tilak, thread: BH.thread,
};
// sindoor: what each fur colour becomes under it (vermilion, the face a shade lighter so it still reads)
const HNM_SINDOOR = { skin: '#EE5A24', skinDk: '#BC3812', skinLt: '#FF8E4E', fur: '#EE5A24', furDk: '#BC3812', furLt: '#FF8E4E',
  mask: '#F88A52', maskDk: '#DC6230', tilak: '#FFE39A', red: '#FFF1C8' };
const HNM_TAIL = [[1.0, -7.4], [4.0, -6.6], [6.3, -8.6], [7.0, -12.4], [6.5, -16.1], [5.3, -18.2], [4.1, -17.9], [3.85, -16.8], [4.55, -16.2]];

function _hnmCols(C, k) {
  if (k <= 0) return C;
  const D = { ...C };
  for (const key in HNM_SINDOOR) D[key] = mixCol(C[key], HNM_SINDOOR[key], clamp(k));
  return D;
}
function _hnmTailPts(o) {
  const sw = o.tailSway ?? T * 1.7, droop = o.tail === 'droop';
  return HNM_TAIL.map(([a, b], i) => {
    const k = i / (HNM_TAIL.length - 1);
    if (droop) return [lerp(1.0, 5.4, Math.min(1, k * 1.6)) + Math.sin(sw + k * 2) * .2 * k, -7.4 + k * 6.6];
    return [a + Math.sin(sw + k * 2.4) * .55 * k, b + Math.cos(sw * .8 + k * 2) * .25 * k];
  });
}
function hanumanTail(x, y, u, o = {}) {
  const P = _hnmTailPts(o), [a, b] = P[P.length - 3], fx = o.flip ? -1 : 1;
  return [x + (o.dx || 0) * u + fx * a * u, y + (o.dy || 0) * u + b * u];
}
// the tail, in body space: one tapered ribbon of fur with a darker tuft at the curl
function hanumanTailDraw(u, sw, o, C) {
  const P = _hnmTailPts(o), INK = C.ink;
  paint(ribbon(U(P, u), 1.05 * u, .5 * u), { wash: C.fur, fill: C.furDk, fillOp: 45, tex: .5, ink: INK, sw: sw * .8 });
  const L = P.length;
  for (let i = 2; i < L - 2; i += 2) { const [a, b] = P[i]; inkLine(U([[a - .25, b - .15], [a + .2, b + .2]], u), sw * .4, C.furDk, 'inkfine', .4); }
  paint(ellPts(P[L - 1][0] * u, P[L - 1][1] * u, .42 * u, .42 * u, 10), { wash: C.furDk, ink: INK, sw: sw * .5 });
}
// the mukut and the kundals, in narada()'s head space (monkey head centre (0, -20.6), 3.3 × 3.15; ears at ±3.55)
function hanumanMukut(u, sw, o, C) {
  const P = pts => U(pts, u), INK = C.ink, J = u * .03;
  boilSeed(`hanuman ${o.boilKey ?? ''} kundal`);
  for (const s of [-1, 1]) {   // gold rings hanging from the ears
    const sx = s * 3.75, sy = -19.05, rr = Math.sin(T * 2.2 + s) * .08;
    push(); translate(sx * u, sy * u); rotate(rr);
    inkLine(ellPts(0, .55 * u, .5 * u, .55 * u, 14), sw * 1.3, C.gold, 'ink', .5);
    paint(ellPts(0, 1.1 * u, .16 * u, .16 * u, 8), { wash: C.gem, ink: null });
    pop();
  }
  if (o.crown === false) return;
  boilSeed(`hanuman ${o.boilKey ?? ''} mukut`);
  push(); translate(0, -.75 * u);   // sits on the crown of the head, the tilak shows under its band
  const crown = P([[-2.75, -22.5], [-2.85, -24.3], [-2.0, -24.9], [-1.25, -26.2], [-.55, -26.4], [0, -27.9], [.55, -26.4], [1.25, -26.2], [2.0, -24.9], [2.85, -24.3], [2.75, -22.5], [0, -22.85]]);
  paint(crown, { wash: C.gold, fill: C.goldDk, fillOp: 55, bleed: .08, tex: .5, border: .4, ink: INK, sw: sw * .8, curv: .15 });
  paint(P([[-1.2, -24.4], [0, -26.9], [1.2, -24.4], [0, -24.1]]), { fill: C.goldLt, fillOp: 140, bleed: .2, tex: .5, ink: null });
  paint(P([[-2.9, -23.05], [2.9, -23.05], [2.85, -22.3], [0, -22.65], [-2.85, -22.3]]), { wash: C.goldDk, ink: INK, sw: sw * .6, curv: .2 });   // the band
  for (let i = 0; i < 7; i++) paint(ellPts((-2.4 + i * .8) * u, -22.68 * u, .14 * u, .14 * u, 8), { wash: C.goldLt, ink: null });
  paint(ellPts(0, -24.4 * u, .45 * u, .55 * u, 12, J), { wash: C.gem, ink: INK, sw: sw * .4 });
  paint(ellPts(-.12 * u, -24.6 * u, .14 * u, .16 * u, 8), { wash: C.white, washOp: 200, ink: null });
  paint(ellPts(0, -28.05 * u, .3 * u, .3 * u, 10), { wash: C.gold, ink: INK, sw: sw * .4 });   // the finial
  pop();
}
// the munja thread across his chest and a gold mala, in body space (narada()'s torso: chest -16.9..-12)
// (over his left shoulder: from the screen-right shoulder, flipped or not)
function hanumanChest(u, sw, C, flip) {
  const fx = flip ? -1 : 1, P = pts => U(pts.map(([a, b]) => [a * fx, b]), u);
  inkLine(P([[2.7, -16.8], [1.2, -15.2], [-.6, -13.6], [-2.4, -12.3]]), sw * 1.6, C.thread, 'ink', .4);
  inkLine(P([[2.55, -16.55], [1.05, -15], [-.75, -13.4], [-2.3, -12.1]]), sw * .35, C.shawlDk, 'inkfine', .4);
}

function hanuman(x, y, u, o = {}) {
  const C0 = { ...HNM, ...(o.pal || {}) }, k = clamp(o.sindoor || 0), kt = clamp(o.sindoorTail ?? k), C = _hnmCols(C0, k), CT = _hnmCols(C0, kt);
  const q = { veena: false, topknot: false, shawl: false, ...o, monkey: 1, pal: C, col: C.skin, dk: C.skinDk, lt: C.skinLt };   // his own fur always (emotions() hands over Clawd's)
  q.hat = (uu, sw) => { hanumanMukut(uu, sw, o, C); if (o.hat) o.hat(uu, sw); };
  q.chest = (uu, sw) => { hanumanChest(uu, sw, C, o.flip); if (o.chest) o.chest(uu, sw); };
  q.behind = (uu, sw) => { if (o.tail !== false) hanumanTailDraw(uu, sw, o, CT); if (o.behind) o.behind(uu, sw); };
  const g = clamp(o.gada || 0);
  if (g > 0) {
    q.handR = o.handR || [3.4, -12.9]; q.bendR = o.bendR ?? .9;
    q.armR = (uu, sw) => { push(); scale(g); gada(uu * 1.05, sw, .36 + (o.gadaA || 0), C.ink); pop(); if (o.armR) o.armR(uu, sw); };
  }
  delete q.sindoor; delete q.sindoorTail; delete q.gada;
  return narada(x, y, u, q);
}

// Model sheet: studio.html?loop=hanuman, or node render.mjs --loop=hanuman --sheet=0.5 --cols=1 --w=1080
(() => {
  LOOPS.hanuman = t => {
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
    hanuman(200, 820, 20, { seed: 1, mouth: 'smile', gada: 1 });
    hanuman(540, 820, 20, { seed: 2, eyes: 'wide', mouth: 'O', brow: 1, handL: [-4.4, -19.5] });
    hanuman(880, 820, 20, { seed: 3, pray: 1, bow: .4, eyes: 'closed', mouth: 'smile' });
    hanuman(200, 1460, 20, { seed: 4, sindoor: frac(t / 4), mouth: 'grin', eyes: 'happy' });
    hanuman(540, 1460, 20, { seed: 5, sindoor: 1, sindoorTail: 0, eyes: 'look', lookX: 1, mouth: 'flat' });
    hanuman(880, 1460, 20, { seed: 6, sindoor: 1, gada: 1, mouth: 'grin', walk: t * 1.4 });
    hanuman(300, 1860, 15, { sit: 1, eyes: 'closed', mouth: 'smile', tail: 'droop' });
    hanuman(780, 1860, 15, { sindoor: 1, eyes: ['normal', 'closed'], mouth: 'grin' });
  };
  LOOPS.hanuman.len = 4;
})();
