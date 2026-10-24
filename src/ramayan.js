// ramayan.js: the Ramayan series kit (Painted): the cast every part shares beyond ram.js / hanuman.js / ravana.js, the
// series ident and the follow card. Load after narada.js, ram.js, kartikeya.js, parvati.js, chandraghanta.js (dhanush(),
// baan()) and shailputri.js.
//   RMY                          the series palette (gold, the ident's saffron and maroon, the card's brand colours)
//   valmiki(x, y, u, o)          the adi kavi on Narad's rig: white hair and beard, an ochre dhoti, no veena; every
//                                narada() option works; o.leaf 0..1 a palm-leaf manuscript in his hands, o.stylus
//   nishada(x, y, u, o)          the hunter (Bala 2.10): dark skin, a bark-brown loincloth, a feather band, a beard; o.aim
//                                0..1 draws the bow (an arrow nocked while aim < 1; loosed at 1), o.bow false, o.cower 0..1
//   brahma(x, y, u, o)           Brahma, four-faced (Bala 2.23), sitting on his lotus: golden skin, a white beard, a red
//                                dhoti, three faces showing, four arms (the back pair raise the Vedas and a kamandalu);
//                                o.bless 0..1 raises abhaya; o.lotus (default true) draws the lotus under him
//   krauncha(x, y, s, o)         a sarus crane in side view (the krauncha of Bala 2.9), facing screen right (o.flip):
//                                o.neck (radians: 0 up, + forward), o.beak 0..1 open, o.wings 0..1 (spread, the dance),
//                                o.walk phase, o.dead 0..1 (falls over, lying), o.eye 'open' | 'closed' | 'x', o.col
//   dasharatha(x, y, u, o)       King Dasharatha on Ram's rig: fair, a white beard, grey curls, the tall kirita, a royal
//                                purple dhoti and a gold uttariya, no bow; every ram() / narada() option works
//   kaikeyi(x, y, u, o)          Queen Kaikeyi on Parvati's rig: an emerald saree, a maroon blouse, her mukut; o.plain
//                                (no crown: the jewels torn off), o.hairDown 0..1 (her hair loose over her shoulders)
//   manthara(x, y, u, o)         Manthara, Kaikeyi's hunchbacked maid (Ayodhya 7.1): Parvati's rig, old, grey hair under
//                                a brown odhni, a hump behind her shoulders, stooped; every parvati() option works
//   goldenDeer(x, y, s, o)       Maricha's golden deer (Aranya 42): side view facing screen right (o.flip), a gold coat
//                                with silver spots, antlers tipped with gems; o.walk phase, o.leap 0..1 (mid-bound, legs
//                                tucked), o.neck (radians), o.look ('back': the head turned over the shoulder), o.glow
//                                o.cute (a big glossy eye with lashes and a blush), o.blink (the eye shut in a happy arc)
//   surpanakha(x, y, u, o)       Ravana's sister on Parvati's rig: grey-green skin, a wild violet mane, little tusks, a
//                                dark plum saree; o.hurt 0..1 (hands over her face: after Lakshman's sword)
//   rkVerse(lines, x, y, size, age, o)   Devanagari in gold (Tiro Devanagari Sanskrit), line by line, glowing
//   ramayanIdent(t, lt, part, title)     the series ident: RAMAYAN in gold over a saffron sunburst, Ram with his bow,
//                                        the part pill and the episode title
//   followCard(t, lt, C)          the end card: the next part's number and title, "Follow @therishikatha", the comment ask,
//                                 a small books line (Books 1–3 for ₹500 · rishikatha.com)
const RMY = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldDk: '#B88A1C', goldLt: '#FFE69A',
  saffron: '#E8742A', saffronLt: '#F7B05A', maroon: '#6E1A30', maroonDk: '#4A0E20', ray: '#FFD27A',
  teal: '#2E5F5A', orange: '#F15A24', peach: '#FBE0CF', peachLt: '#FFF1E6', brown: '#3A2418', grey: '#6B5A50',
};

// ---------- Valmiki ----------
const VALMIKI_PAL = { hair: '#F2ECE2', hairLt: '#FFFFFF', dhoti: '#D9963A', dhotiDk: '#A86A1E', dhotiLt: '#F2C27A', border: '#7A3A1E',
  shawl: '#F6EEDC', shawlDk: '#DCCDAE', skin: '#D9A27A', skinDk: '#B47A54', skinLt: '#F0C4A0' };
// a palm-leaf manuscript held open across both hands, in arm space at the left hand (upright)
function palmLeaf(u, sw, k = 1, INK = NRD.ink) {
  push(); scale(k);
  for (let i = 0; i < 3; i++) paint(rrPts(-.4 * u, (-.5 - i * .32) * u, 7.2 * u, .9 * u, .3 * u), { wash: i === 2 ? '#F2DDA8' : '#E2C482', fill: '#B8944E', fillOp: 40, tex: .4, ink: INK, sw: sw * .5 });
  for (let j = 0; j < 3; j++) inkLine(U([[.4, -.95 + j * .2 - .3 * 0], [6.4, -.95 + j * .2]], u).map(([a, b]) => [a, b - .64 * u]), sw * .3, '#8A6A38', 'inkfine', 0);
  inkLine(U([[3.2, -1.6], [3.2, .5]], u), sw * .5, '#7A4A22', 'ink', 0);   // the cord through the leaves
  pop();
}
function valmiki(x, y, u, o = {}) {
  const q = { veena: false, beard: '#F4F0E8', ...o, pal: { ...VALMIKI_PAL, ...(o.pal || {}) } };
  if (o.leaf) { q.handL = q.handL || [-3.6, -13.4]; q.handR = q.handR || [3.4, -13.6]; q.bendL = q.bendL ?? .4; q.bendR = q.bendR ?? .4;
    const prev = o.armL; q.armL = (uu, sw) => { palmLeaf(uu, sw, clamp(o.leaf)); if (prev) prev(uu, sw); }; }
  return narada(x, y, u, q);
}

// ---------- the hunter ----------
const NISH_PAL = { skin: '#8A5A3C', skinDk: '#64402A', skinLt: '#A8785A', hair: '#1E1614', hairLt: '#3E302A', dhoti: '#7A5634', dhotiDk: '#553A22', dhotiLt: '#9E7A52', border: '#3E2A18',
  bead: '#C8B48A', beadDk: '#8A7650', tulsi: '#E8D6A8', tilak: '#8A5A3C', red: '#8A5A3C', ink: '#24161A' };
const nishadaBand = (u, sw) => {
  const P = pts => U(pts, u);
  paint(P([[-3.3, -22.4], [3.3, -22.4], [3.2, -21.7], [-3.2, -21.7]]), { wash: '#B8402E', ink: NISH_PAL.ink, sw: sw * .5 });
  paint(P([[2.1, -22.2], [3.3, -23.4], [4.2, -25.4], [4.5, -27.6], [3.6, -26.2], [2.6, -24.4], [1.9, -22.6]]), { wash: '#C88A3A', fill: '#7A4A1E', fillOp: 50, tex: .4, ink: NISH_PAL.ink, sw: sw * .5, curv: .5 });
  for (const k of [.3, .55, .8]) inkLine(P([[lerp(2.2, 4.3, k) - .55, lerp(-22.6, -27.2, k) + .1], [lerp(2.2, 4.3, k) + .45, lerp(-22.6, -27.2, k) - .3]]), sw * .6, '#4A2A12', 'inkfine', 0);
  inkLine(P([[2.1, -22.4], [3.4, -24.4], [4.4, -27.4]]), sw * .35, '#4A2A12', 'inkfine', .5);
};
function nishada(x, y, u, o = {}) {
  const aim = clamp(o.aim ?? 0), cw = clamp(o.cower || 0), loosed = aim >= 1;
  const q = { veena: false, shawl: false, topknot: false, beard: '#2A1E1A', ...o, pal: { ...NISH_PAL, ...(o.pal || {}) } };
  const hat = o.hat; q.hat = (uu, sw) => { nishadaBand(uu, sw); if (hat) hat(uu, sw); };
  if (o.bow !== false && cw < .5) {
    // the bow arm out to screen left, the draw hand pulled back to the cheek
    q.handL = [lerp(-4.6, -8.2, ease(aim)), lerp(-13, -17.6, ease(aim))]; q.bendL = .3;
    q.handR = loosed ? [-1.2, -16.4] : [lerp(-2.6, -.4, ease(aim)), lerp(-14.4, -18.6, ease(aim))]; q.bendR = .9;
    const pull = loosed ? 0 : ease(aim);
    q.armL = (uu, sw) => {
      push(); scale(1.7);
      inkLine(U([[.6, -4.5], [.6 + pull * 2.6, 0], [.6, 4.5]], uu / 1.7 * 1), sw * .45, '#F0E2C0', 'inkfine', 0);
      paint(ribbon(U([[.6, -4.6], [-.55, -2.8], [-.95, -.6], [-.95, .6], [-.55, 2.8], [.6, 4.6]], uu / 1.7), .22 * uu / 1.7, .22 * uu / 1.7), { wash: '#7A4A22', ink: NISH_PAL.ink, sw: sw * .5 });
      if (!loosed && aim > .05) {   // the arrow on the string, pointing screen left
        const ax = (.6 + pull * 2.6) * uu / 1.7;
        inkLine([[ax, 0], [-3.4 * uu / 1.7, 0]], sw * 1.1, '#A0784A', 'ink', 0);
        paint([[-3.4 * uu / 1.7, -.35 * uu / 1.7], [-4.4 * uu / 1.7, 0], [-3.4 * uu / 1.7, .35 * uu / 1.7]], { wash: '#C8CCD8', ink: NISH_PAL.ink, sw: sw * .4 });
        for (const s of [-1, 1]) paint([[ax - .2 * uu, 0], [ax + .3 * uu, s * .4 * uu], [ax + .5 * uu, s * .4 * uu], [ax, 0]], { wash: '#E8D6B0', ink: NISH_PAL.ink, sw: sw * .3 });
      }
      pop();
    };
  }
  if (cw > 0) { q.handL = [lerp(-4.6, -2.2, cw), lerp(-13, -21.5, cw)]; q.handR = [lerp(3.4, 2.4, cw), lerp(-11, -21.2, cw)]; q.bendL = 1; q.bendR = 1; q.bow = cw * .4; }
  delete q.aim; delete q.cower;
  return narada(x, y, u, q);
}

// ---------- Brahma ----------
const BRAHMA_PAL = { skin: '#F2B26A', skinDk: '#CC8A44', skinLt: '#FFD49A', hair: '#F4EEE4', hairLt: '#FFFFFF', dhoti: '#C8323A', dhotiDk: '#962330', dhotiLt: '#E8697A', border: '#F2C230',
  shawl: '#FFF3DC', shawlDk: '#E2CFA8', bead: '#F2C230', beadDk: '#B88A1C', tulsi: '#FFE39A', ink: '#3A2430', tilak: '#FFF6E6', red: '#D9302E' };
// a lotus seat: open pink petals around (x, y) (its top centre), s wide
function lotusSeat(x, y, s, key = 'lotus', glowK = 1) {
  if (glowK) glow(x, y, s * .9, '#FFD8E8', .35 * glowK);
  boilSeed(key);
  const petal = (a, len, w, c, dk) => {
    const ca = Math.cos(a), sa = Math.sin(a), P = (d, n) => [x + ca * d - sa * n, y + s * .08 + sa * d * .45 + ca * n * .45];
    paint([P(0, 0), P(len * .45, w), P(len, 0), P(len * .45, -w)], { wash: c, fill: dk, fillOp: 50, tex: .4, ink: RMY.ink, sw: .9, curv: .55 });
  };
  for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI; petal(a, s * .62, s * .14, '#E88AA8', '#C25A80'); }
  paint(ellPts(x, y + s * .08, s * .38, s * .1, 20), { wash: '#F6D25A', ink: RMY.ink, sw: .8 });
  for (let i = 0; i < 7; i++) { const a = Math.PI * .12 + i / 6 * Math.PI * .76; petal(a, s * .55, s * .13, '#F4A8C0', '#D87898'); }
}
// one of his side faces, in body space: s = -1 / 1 (screen left / right), looking outward (3/4)
function brahmaSide(u, sw, s, o) {
  const P = pts => U(pts, u), C = BRAHMA_PAL, INK = C.ink, cx = s * 4.7, cy = -20.2, k = .86;
  const Q = pts => P(pts.map(([a, b]) => [cx + a * k * s, cy + b * k]));
  paint(ellPts(cx * u, cy * u, 2.9 * k * u, 3 * k * u, 24), { wash: C.skinDk, ink: INK, sw: sw * .8 });
  paint(ellPts((cx + s * .5) * u, cy * u, 2.5 * k * u, 2.8 * k * u, 22), { wash: C.skin, ink: null });
  paint(Q([[-2.6, .2], [-2.2, 2.4], [-.6, 3.9], [.9, 3.2], [2.4, 1.6], [2.8, .2], [1.6, 1.1], [.4, 1.4], [-1.2, 1.2]]), { wash: C.hair, fill: '#D8D0C4', fillOp: 40, ink: INK, sw: sw * .6, curv: .45 });   // the beard
  const eye = (ex) => inkLine(Q([[ex - .55, -.6], [ex, -.32], [ex + .55, -.6]]), sw * .9, INK, 'ink', .5);
  eye(-.3); eye(1.5);
  inkLine(Q([[-1, -1.5], [-.1, -1.7]]), sw * .8, C.hair, 'ink', .3); inkLine(Q([[.9, -1.7], [2, -1.5]]), sw * .8, C.hair, 'ink', .3);
  paint(Q([[-2.5, -2.2], [-2.3, -4.6], [-1.2, -5.4], [0, -6.6], [1.2, -5.4], [2.3, -4.6], [2.5, -2.2], [0, -2.6]]), { wash: '#F2C230', fill: '#B88A1C', fillOp: 50, tex: .4, ink: INK, sw: sw * .7, curv: .15 });   // a crown
  paint(ellPts((cx + s * .2) * u, (cy - 3.4 * k) * u, .35 * u, .4 * u, 10), { wash: '#D2283A', ink: null });
}
// the back arms and what they hold, in body space (drawn behind him)
function brahmaBack(u, sw, o) {
  push(); translate(0, NRD_SIT * u);
  const P = pts => U(pts, u), C = BRAHMA_PAL, INK = C.ink, lift = Math.sin(T * 1.4) * .2;
  for (const s of [-1, 1]) {
    const sh = [s * 2.6, -16], el = [s * 6.4, -18.6 + lift], ha = [s * 7.6, -23.2 + lift];
    paint(ribbon(P([sh, el, ha]), 1.1 * u, .8 * u), { wash: C.skinDk, fill: C.skinDk, fillOp: 40, ink: INK, sw: sw * .8 });
    paint(ellPts(ha[0] * u, ha[1] * u, .66 * u, .62 * u, 12), { wash: C.skin, ink: INK, sw: sw * .7 });
    if (s < 0) {   // the Vedas: a bound palm-leaf book
      push(); translate(ha[0] * u, (ha[1] - .5) * u); rotate(-.15);
      for (let i = 0; i < 3; i++) paint(rrPts(-1.8 * u, (-1.2 - i * .28) * u, 3.6 * u, .9 * u, .25 * u), { wash: i === 2 ? '#F2DDA8' : '#E2C482', ink: INK, sw: sw * .5 });
      inkLine(U([[0, -2.1], [0, -.2]], u), sw * .6, '#C8323A', 'ink', 0);
      pop();
    } else {   // the kamandalu
      push(); translate(ha[0] * u, (ha[1] - 1.4) * u);
      paint(ellPts(0, 0, 1.2 * u, 1.05 * u, 16), { wash: '#C8A040', fill: '#8A6A1E', fillOp: 60, tex: .4, ink: INK, sw: sw * .6 });
      paint(ribbon(U([[.9, -.2], [1.9, -.9], [2.3, -1.6]], u), .32 * u, .18 * u), { wash: '#C8A040', ink: INK, sw: sw * .5 });
      inkLine(U([[-.8, -.8], [0, -2], [.8, -.8]], u), sw * .9, '#8A6A1E', 'ink', .6);
      pop();
    }
  }
  brahmaSide(u, sw, -1, o); brahmaSide(u, sw, 1, o);
  pop();
}
function brahma(x, y, u, o = {}) {
  if (o.lotus !== false) lotusSeat(x, y - .4 * u, 17 * u, (o.boilKey || 'br') + 'lotus', o.lotusGlow ?? 1);
  const b = clamp(o.bless ?? 0);
  const q = { veena: false, sit: 1, beard: '#F4F0E8', noShadow: true, ...o, pal: { ...BRAHMA_PAL, ...(o.pal || {}) } };
  q.handR = o.handR || [lerp(3.6, 4.4, b), lerp(-10.4, -17.4, b)]; q.bendR = .6;
  q.handL = o.handL || [-3.6, -10.4];
  const beh = o.behind; q.behind = (uu, sw) => { brahmaBack(uu, sw, o); if (beh) beh(uu, sw); };
  const hat = o.hat; q.hat = (uu, sw) => { ramKirita(uu, sw, { boilKey: o.boilKey }, { ...RAM, ink: BRAHMA_PAL.ink, hair: BRAHMA_PAL.hair, hairLt: '#FFFFFF' }); if (hat) hat(uu, sw); };
  q.topknot = false;
  if (b > .5) { const prev = o.armR; q.armR = (uu, sw) => { paint(U([[-.6, 0], [-.7, -1.6], [-.2, -1.9], [.3, -1.9], [.75, -1.5], [.6, 0]], uu), { wash: BRAHMA_PAL.skin, ink: BRAHMA_PAL.ink, sw: sw * .6, curv: .5 }); if (prev) prev(uu, sw); }; }
  delete q.bless; delete q.lotus;
  return narada(x, y, u, q);
}

// ---------- the krauncha (a sarus crane), side view facing screen right; (x, y) the ground under it, s its body length ----------
const KRC = { body: '#A9AEB8', bodyDk: '#7E8490', bodyLt: '#CDD2DA', wing: '#959BA8', tip: '#4A4E58', head: '#D2453A', cheek: '#C8CCD2', beak: '#5E5A48', leg: '#B87A6A', ink: '#2B2233' };
function krauncha(x, y, s, o = {}) {
  const C = { ...KRC, ...(o.col || {}) }, fx = o.flip ? -1 : 1, dead = (o.dead || 0) > .5, key = o.key || 'krc';
  const wk = o.walk, wings = clamp(o.wings || 0), na = o.neck ?? 0, beak = clamp(o.beak || 0), L = s * .78, sw = clamp(s / 160, .5, 1.4);
  boilSeed(key + 'shadow');
  paint(ellPts(x, y, s * (dead ? .8 : .5), s * .07, 16), { fill: RMY.ink, fillOp: 60, bleed: .2, tex: .3, ink: null });
  push(); translate(x, y); scale(fx, 1);
  const leg = (P, w) => paint(ribbon(P, w, w * .8), { wash: C.leg, ink: C.ink, sw: sw * .5 });
  let by, n0, head, hA = 0;
  if (dead) {
    // lying on its side: the body on the ground, the legs limp, the neck along the ground, the head down
    by = -s * .17;
    boilSeed(key + 'legs');
    leg([[-s * .05, by + s * .05], [-s * .2, by - s * .25], [-s * .1, by - s * .45]], s * .03);
    leg([[s * .05, by + s * .05], [s * .02, by - s * .3], [s * .16, by - s * .42]], s * .03);
    boilSeed(key + 'body');
    paint(ellPts(0, by, s * .44, s * .18, 22, 0, .08), { wash: C.body, fill: C.bodyDk, fillOp: 50, tex: .5, ink: C.ink, sw });
    paint([[-s * .4, by - s * .02], [-s * .66, by + s * .02], [-s * .7, by + s * .14], [-s * .4, by + s * .15]], { wash: C.tip, ink: C.ink, sw: sw * .8, curv: .5 });
    paint([[-s * .3, by - s * .1], [s * .25, by - s * .14], [s * .2, by + s * .04], [-s * .3, by + s * .06]], { wash: C.wing, ink: C.ink, sw: sw * .7, curv: .5 });
    n0 = [s * .36, by - s * .02]; head = [s * .95, -s * .07];
    boilSeed(key + 'neck');
    paint(ribbon(through([n0, [s * .62, by + s * .04], head]), s * .085, s * .06), { wash: C.body, ink: C.ink, sw: sw * .8 });
    hA = .15;
  } else {
    boilSeed(key + 'legs');
    for (const k of [-1, 1]) {
      const l = wk == null ? 0 : Math.sin((wk + (k < 0 ? 0 : .5)) * TAU) * .25, hip = [k * s * .04, -L - s * .02], knee = [k * s * .03 + l * s * .2 + s * .03, -L * .5], foot = [k * s * .05 + l * s * .4, 0];
      leg([hip, knee, foot], s * .032);
      inkLine([[foot[0] - s * .04, 0], [foot[0] + s * .13, 0]], sw * .9, C.leg, 'ink', 0);
    }
    by = -L - s * .16;
    // the wings raised in the dance, behind the body
    if (wings > .02) {
      boilSeed(key + 'wingB');
      for (const k of [.82, 1]) {
        const sh = [s * .05, by - s * .1], tip = [lerp(-s * .35, -s * .1, wings) * k, by - lerp(s * .1, s * .85, wings) * k], back = [-s * .5 * k, by - lerp(0, s * .35, wings) * k];
        paint([sh, [lerp(sh[0], tip[0], .5) + s * .12, lerp(sh[1], tip[1], .5)], tip, back, [-s * .3, by + s * .02]], { wash: k < 1 ? C.bodyDk : C.wing, ink: C.ink, sw: sw * .7, curv: .4 });
        paint([tip, [lerp(tip[0], back[0], .45), lerp(tip[1], back[1], .45)], [tip[0] - s * .02, tip[1] + s * .12]], { wash: C.tip, ink: null, curv: .3 });
      }
    }
    boilSeed(key + 'body');
    paint([[-s * .44, by + s * .02], [-s * .25, by - s * .14], [s * .12, by - s * .17], [s * .36, by - s * .1], [s * .4, by + s * .04], [s * .2, by + s * .15], [-s * .25, by + s * .14]], { wash: C.body, fill: C.bodyDk, fillOp: 50, tex: .5, ink: C.ink, sw, curv: .55 });
    paint([[-s * .36, by - s * .04], [-s * .6, by + s * .02], [-s * .66, by + s * .16], [-s * .48, by + s * .2], [-s * .26, by + s * .1]], { wash: C.tip, fill: C.ink, fillOp: 25, ink: C.ink, sw: sw * .8, curv: .5 });   // the tail bustle
    if (wings < .5) { boilSeed(key + 'wing'); paint([[-s * .34, by - s * .06], [s * .2, by - s * .12], [s * .16, by + s * .04], [-s * .3, by + s * .08]], { wash: C.wing, fill: C.bodyDk, fillOp: 40, ink: C.ink, sw: sw * .7, curv: .5 }); }
    // the neck: an S from the chest up to the head; neck > 0 bows it forward, < 0 throws the head back
    n0 = [s * .3, by - s * .1];
    const nl = s * .72;
    head = [n0[0] + Math.sin(na) * nl + s * .06, n0[1] - Math.cos(na) * nl];
    const nm = [lerp(n0[0], head[0], .5) - s * .07 * Math.cos(na), lerp(n0[1], head[1], .5) - s * .02];
    boilSeed(key + 'neck');
    paint(ribbon(through([n0, nm, head]), s * .085, s * .055), { wash: C.body, fill: C.bodyDk, fillOp: 25, ink: C.ink, sw: sw * .8 });
    hA = na * .8 + (o.headA || 0);
  }
  // the head: grey cheek, red crown, a long dark beak (opens by beak)
  boilSeed(key + 'head');
  push(); translate(head[0], head[1]); rotate(hA);
  paint(ellPts(0, 0, s * .075, s * .062, 14), { wash: C.cheek, ink: C.ink, sw: sw * .7 });
  paint([[-s * .075, s * .01], [-s * .05, -s * .05], [s * .03, -s * .058], [s * .06, -s * .02], [s * .02, s * .04], [-s * .05, s * .05]], { wash: C.head, ink: null, curv: .5 });
  const bo = beak * .3;
  push(); translate(s * .055, -s * .005); rotate(-bo); paint([[0, -s * .022], [s * .25, -s * .002], [0, s * .004]], { wash: C.beak, ink: C.ink, sw: sw * .5 }); pop();
  push(); translate(s * .055, s * .004); rotate(bo); paint([[0, -s * .002], [s * .23, s * .004], [0, s * .02]], { wash: C.beak, ink: C.ink, sw: sw * .5 }); pop();
  const ek = o.eye || (dead ? 'closed' : 'open');
  if (ek === 'open') { paint(ellPts(s * .015, -s * .015, s * .017, s * .017, 8), { wash: '#F2B23A', ink: null }); paint(ellPts(s * .02, -s * .015, s * .009, s * .009, 6), { wash: C.ink, ink: null }); }
  else inkLine([[-s * .005, -s * .02], [s * .015, -s * .008], [s * .04, -s * .02]], sw * .7, C.ink, 'inkfine', .5);
  pop();
  pop();
  boilSeed(key + 'after');
  return { head: [x + fx * head[0], y + head[1]], body: [x + fx * s * .02, y + by] };
}


// ---------- Ayodhya's royal family ----------
const DASH_PAL = { skin: '#F2C49A', skinDk: '#D69A6E', skinLt: '#FFE2C4', hair: '#B8B2B8', hairLt: '#E8E4EA', dhoti: '#6E3E9E', dhotiDk: '#4E2A78', dhotiLt: '#9A6AC8', border: '#F2C230',
  shawl: '#F2C230', shawlDk: '#B88A1C', ink: '#2A1E3A' };
function dasharatha(x, y, u, o = {}) { return ram(x, y, u, { kodanda: false, beard: '#F0ECE6', ...o, pal: { ...DASH_PAL, ...(o.pal || {}) } }); }
const KAIKEYI_PAL = { saree: '#2E8A5A', sareeDk: '#1E5E3E', sareeLt: '#5EB88A', blouse: '#8A1E3A', blouseDk: '#5E1228', bangle: '#F2C230', skin: '#F2C29E', skinDk: '#D69A74', skinLt: '#FFE2CC', lip: '#B8404E' };
function kaikeyi(x, y, u, o = {}) {
  const q = { ...o, pal: { ...KAIKEYI_PAL, ...(o.pal || {}) }, col: KAIKEYI_PAL.skin, dk: KAIKEYI_PAL.skinDk, lt: KAIKEYI_PAL.skinLt };
  if (o.plain) q.crown = false;
  if (o.hairDown) { const k = clamp(o.hairDown), beh = o.behind; q.behind = (uu, sw) => {   // loose hair falling behind her shoulders
    paint(U([[-3, -22], [-3.9, -18], [-4.2, -13.5], [-3.4, -12 + 2 * (1 - k)], [3.4, -12 + 2 * (1 - k)], [4.2, -13.5], [3.9, -18], [3, -22]], uu), { wash: PRV.hair, ink: PRV.ink, sw: sw * .8, curv: .5 });
    if (beh) beh(uu, sw); }; }
  delete q.plain; delete q.hairDown;
  return parvati(x, y, u, q);
}
const MANTHARA_PAL = { saree: '#8A6A4A', sareeDk: '#634A30', sareeLt: '#B08E6A', blouse: '#5A4A3A', blouseDk: '#3E3226', gold: '#B89A6A', goldDk: '#8A7048', goldLt: '#D8C29A',
  hair: '#B8B0A8', hairLt: '#DAD4CC', bangle: '#8A7048', lip: '#9A5A50', skin: '#D8A27A', skinDk: '#B07A54', skinLt: '#EEC09C', veil: '#7A5A3E', veilDk: '#5A4028', sindoor: '#9A5A50' };
function manthara(x, y, u, o = {}) {
  const beh = o.behind;
  const q = { crown: false, veil: 1, sq: (o.sq || 0) + .07, htilt: (o.htilt || 0) + .12, lean: (o.lean || 0) + .8, ...o, pal: { ...MANTHARA_PAL, ...(o.pal || {}) }, col: MANTHARA_PAL.skin, dk: MANTHARA_PAL.skinDk, lt: MANTHARA_PAL.skinLt };
  q.sq = (o.sq || 0) + .07; q.htilt = (o.htilt || 0) + .12; q.lean = (o.lean || 0) + .8;
  q.behind = (uu, sw) => {   // the hump, rising behind her left shoulder
    paint(ellPts(-2.2 * uu, -17.6 * uu, 3.1 * uu, 2.7 * uu, 20), { wash: MANTHARA_PAL.veil, fill: MANTHARA_PAL.veilDk, fillOp: 50, tex: .5, ink: PRV.ink, sw: sw * .8 });
    if (beh) beh(uu, sw); };
  return parvati(x, y, u, q);
}


// ---------- the golden deer ----------
const GDEER = { coat: '#E8B83A', coatDk: '#B8862A', coatLt: '#FFE07A', spot: '#F4F4FA', belly: '#FFF0C0', antler: '#C8A05A', gem: '#E2283A', gem2: '#3EB8E8', hoof: '#6A4A2A', ink: '#3A2418' };
function goldenDeer(x, y, s, o = {}) {
  const C = { ...GDEER, ...(o.col || {}) }, fx = o.flip ? -1 : 1, key = o.key || 'gd', sw = clamp(s / 150, .5, 1.5), leap = clamp(o.leap || 0), wk = o.walk;
  if (o.glow) glow(x, y - s * .7, s * 1.3, '#FFE070', .5 * o.glow);
  boilSeed(key + 'sh'); paint(ellPts(x, y, s * .5 * (1 - leap * .4), s * .07, 16), { fill: RMY.ink, fillOp: 60 * (1 - leap * .6), bleed: .2, tex: .3, ink: null });
  push(); translate(x, y - leap * s * .35); scale(fx, 1); if (leap) rotate(-.12 * Math.sin(leap * Math.PI));
  const L = s * .42, by = -L - s * .18;
  boilSeed(key + 'legs');
  const legs = [[-s * .3, 0], [-s * .22, .5], [s * .22, .25], [s * .3, .75]];
  for (const [hx, ph] of legs) {
    const w = wk == null ? 0 : Math.sin((wk + ph) * TAU) * .35, tuck = leap;
    const hip = [hx, by + s * .06], knee = [hx + w * s * .12 + (hx < 0 ? -1 : 1) * tuck * s * .18, by + L * .5 - tuck * s * .15], foot = [hx + w * s * .25 + (hx < 0 ? -1 : 1) * tuck * s * .32, -tuck * s * .1];
    paint(ribbon([hip, knee, foot], s * .07, s * .04), { wash: C.coatDk, ink: C.ink, sw: sw * .6 });
    paint(ellPts(foot[0], foot[1], s * .035, s * .025, 8), { wash: C.hoof, ink: null });
  }
  boilSeed(key + 'body');
  paint([[-s * .45, by], [-s * .32, by - s * .2], [s * .1, by - s * .22], [s * .38, by - s * .14], [s * .45, by + s * .05], [s * .25, by + s * .2], [-s * .3, by + s * .19]], { wash: C.coat, fill: C.coatDk, fillOp: 40, tex: .4, ink: C.ink, sw, curv: .55 });
  paint(ellPts(0, by + s * .08, s * .3, s * .05, 14), { wash: C.belly, washOp: 200, ink: null });
  for (let i = 0; i < 9; i++) paint(ellPts(-s * .3 + hash(i * 3.1) * s * .6, by - s * .1 + hash(i * 5.3) * s * .16, s * .025, s * .02, 8), { wash: C.spot, ink: null });   // silver spots
  paint([[-s * .42, by - s * .04], [-s * .5, by - s * .14], [-s * .44, by + s * .02]], { wash: C.coatLt, ink: C.ink, sw: sw * .6 });   // the tail flick
  // neck and head (look 'back' turns the head over the shoulder)
  boilSeed(key + 'neck');
  const back = o.look === 'back', na = (o.neck ?? .3) + (back ? -.9 : 0), n0 = [s * .3, by - s * .12], nl = s * .36;
  const head = [n0[0] + Math.sin(na) * nl * (back ? -.4 : 1), n0[1] - Math.cos(na) * nl];
  paint(ribbon([n0, [lerp(n0[0], head[0], .5), lerp(n0[1], head[1], .5)], head], s * .15, s * .09), { wash: C.coat, ink: C.ink, sw: sw * .8 });
  push(); translate(head[0], head[1]); if (back) scale(-1, 1); rotate(.25); scale(1.5);
  paint(ellPts(s * .05, 0, s * .1, s * .065, 14), { wash: C.coat, ink: C.ink, sw: sw * .8 });
  paint(ellPts(s * .14, s * .02, s * .04, s * .03, 10), { wash: C.coatDk, ink: C.ink, sw: sw * .5 });   // the muzzle
  paint(ellPts(s * .19, s * .015, s * .012, s * .01, 6), { wash: C.ink, ink: null });
  if (o.blink) inkLine([[s * .02, -s * .012], [s * .04, -s * .002], [s * .062, -s * .012]], sw * 1.6, C.ink, 'inkfine', 0);   // eye shut (a happy arc)
  else if (o.cute) {   // big glossy eye, two highlights, lashes, a blush
    paint(ellPts(s * .04, -s * .015, s * .03, s * .034, 10), { wash: C.ink, ink: null });
    paint(ellPts(s * .05, -s * .028, s * .011, s * .011, 6), { wash: '#FFFFFF', ink: null }); paint(ellPts(s * .03, -s * .002, s * .005, s * .005, 6), { wash: '#FFFFFF', ink: null });
  } else { paint(ellPts(s * .04, -s * .015, s * .018, s * .02, 8), { wash: C.ink, ink: null }); paint(ellPts(s * .045, -s * .02, s * .006, s * .006, 6), { wash: '#FFFFFF', ink: null }); }
  if (o.cute) {
    if (!o.blink) for (const a of [-.5, -.1, .3]) inkLine([[s * .04 + Math.sin(a) * s * .034, -s * .015 - Math.cos(a) * s * .034], [s * .04 + Math.sin(a) * s * .05, -s * .015 - Math.cos(a) * s * .05]], sw * .9, C.ink, 'inkfine', 0);
    paint(ellPts(s * .085, s * .035, s * .028, s * .014, 8), { wash: '#FF8AA0', washOp: 150, ink: null });
  }
  paint([[-s * .02, -s * .04], [-s * .1, -s * .1], [-s * .03, -s * .02]], { wash: C.coatDk, ink: C.ink, sw: sw * .5 });   // ear
  // antlers with gems on every tip
  for (const k of [-1, 1]) {
    const b = [s * .01 + k * s * .015, -s * .05], t1 = [b[0] - s * .06 + k * s * .02, b[1] - s * .2], br = [lerp(b[0], t1[0], .5) + s * .06, lerp(b[1], t1[1], .5) - s * .04];
    paint(ribbon([b, t1], s * .025, s * .012), { wash: C.antler, ink: C.ink, sw: sw * .4 }); paint(ribbon([[lerp(b[0], t1[0], .45), lerp(b[1], t1[1], .45)], br], s * .02, s * .01), { wash: C.antler, ink: C.ink, sw: sw * .4 });
    for (const [gx, gy, c] of [[...t1, C.gem], [...br, C.gem2]]) { glow(gx, gy, s * .06, '#FFFFFF', .35); paint(ellPts(gx, gy, s * .022, s * .022, 8), { wash: c, ink: C.ink, sw: sw * .3 }); }
  }
  pop();
  pop();
  boilSeed(key + 'after');
}
// ---------- Surpanakha ----------
const SURP_PAL = { skin: '#8E9A7A', skinDk: '#6A7658', skinLt: '#B0BC98', saree: '#4A1E4A', sareeDk: '#2E1030', sareeLt: '#7A3A7A', blouse: '#8A2A2A', blouseDk: '#5E1A1A', hair: '#3A1E4A', hairLt: '#5A3A6E', gold: '#B8862E', goldDk: '#7A5A1E', goldLt: '#D8B060', lip: '#5A2A3A', sindoor: '#8A2A2A', bangle: '#B8862E' };
function surpanakha(x, y, u, o = {}) {
  const hurt = clamp(o.hurt || 0), beh = o.behind;
  const q = { crown: false, eyes: 'angry', ...o, pal: { ...SURP_PAL, ...(o.pal || {}) }, col: SURP_PAL.skin, dk: SURP_PAL.skinDk, lt: SURP_PAL.skinLt };
  q.behind = (uu, sw) => {   // the wild mane, spiking out behind her head
    const P = pts => U(pts, uu), cx = 0, cy = -20;
    const pts = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * (1.05 + i / 14 * .9) + Math.sin(T * 3 + i) * .04, r = (i % 2 ? 4.2 : 5.6); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.1]); }
    pts.push([4.2, -14.5], [-4.2, -14.5]);
    paint(P(pts), { wash: SURP_PAL.hair, fill: SURP_PAL.hairLt, fillOp: 40, ink: PRV.ink, sw: sw * .8, curv: .2 });
    if (beh) beh(uu, sw); };
  if (hurt > 0) { q.handL = [-1.2, -19.6]; q.handR = [1.2, -19.6]; q.bendL = 1; q.bendR = 1; q.eyes = 'closed'; q.mouth = 'wail'; }
  delete q.hurt;
  parvati(x, y, u, q);
  if (hurt <= 0) {   // the little tusks over her lip
    const [mx, my] = parvatiHand(x, y, u, { ...o, handR: [0, -18.3] }, 1);
  }
}

// ---------- a bow in the hand ----------
// heldBow(draw, arrow): an armL hook for narada()'s rig (Ram, Lakshman, the young king): a tall bow upright at the hand,
// its string pulled back by draw 0..1 toward the body (+x in arm space), an arrow nocked while arrow is true. Pair it with
// handL out to the side ([-7.6, -18]) and handR at the chin; flip the figure to aim screen right.
function heldBow(draw = 0, arrow = true, wood = '#8A5230') {
  return (u, sw) => {
    const k = u / 1.7, pull = clamp(draw);
    push(); scale(1.7);
    inkLine(U([[.6, -4.5], [.6 + pull * 2.6, 0], [.6, 4.5]], k), sw * .45, '#F0E2C0', 'inkfine', 0);
    paint(ribbon(U([[.6, -4.6], [-.55, -2.8], [-.95, -.6], [-.95, .6], [-.55, 2.8], [.6, 4.6]], k), .24 * k, .24 * k), { wash: wood, ink: NRD.ink, sw: sw * .5 });
    paint(U([[-1.15, -.6], [-.7, -.6], [-.7, .6], [-1.15, .6]], k), { wash: '#F2C230', ink: NRD.ink, sw: sw * .4 });
    if (arrow && pull > .05) {
      const ax = (.6 + pull * 2.6) * k;
      inkLine([[ax, 0], [-3.4 * k, 0]], sw * 1.1, '#A0784A', 'ink', 0);
      paint([[-3.4 * k, -.35 * k], [-4.4 * k, 0], [-3.4 * k, .35 * k]], { wash: '#C8CCD8', ink: NRD.ink, sw: sw * .4 });
    }
    pop();
  };
}

// ---------- lettering ----------
// Devanagari verse lines (gold, ink-stroked, a soft glow behind), popping in line by line; age = seconds since the first
function rkVerse(lines, x, y, size, age, o = {}) {
  if (age < 0) return;
  const lh = size * 1.5, a = o.alpha ?? 1;
  lines.forEach((l, i) => {
    const k = age - i * (o.stagger ?? .5); if (k < 0) return;
    letter(l, x, y + i * lh, size, o.color || RMY.gold, { screen: true, font: `${size}px "Tiro Devanagari Sanskrit"`, stroke: RMY.ink, sw: .16, ink: false, pop: k * 4, alpha: a * clamp(k * 3), maxW: o.maxW ?? 900, rot: o.rot ?? 0 });
  });
}

// ---------- the series ident ----------
// RAMAYAN in gold over a saffron sunburst; Ram stands below with his bow; the part pill and the episode title pop in
function ramayanIdent(t, lt, part, title) {
  camBegin(540, 960 - lt * 8, 1 + lt * .015);
  boilSeed('idbg');
  paint(rectPts(-200, -200, W + 400, H + 400), { wash: RMY.maroon, ink: null });
  paint(ellPts(540, 1150, 900, 900, 40), { fill: RMY.saffron, fillOp: 230, bleed: .25, tex: .4, border: .3, ink: null });
  glow(540, 1150, 700, '#FFB060', .55);
  boilSeed('idrays');
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + lt * .12, r0 = 420, r1 = 1100; paint([[540 + Math.cos(a - .05) * r0, 1150 + Math.sin(a - .05) * r0], [540 + Math.cos(a) * r1, 1150 + Math.sin(a) * r1], [540 + Math.cos(a + .05) * r0, 1150 + Math.sin(a + .05) * r0]], { wash: RMY.ray, washOp: 70, ink: null }); }
  ram(540, 1900, 31, { boilKey: 'idram', eyes: 'normal', mouth: 'smile', handR: [4.4, -17.6], bendR: .6, kodanda: true, lookY: -.2 });
  camEnd();
  const pk = d => Math.max(0, lt - d) * 4;
  letter('RAMAYAN', 540, 560, 168, RMY.gold, { screen: true, font: '168px Marcellus', stroke: RMY.maroonDk, sw: .14, ink: false, pop: pk(0), maxW: 940 });
  if (lt > .35) {
    const k = backOut(clamp(pk(.35)));
    boilSeed('idpill'); push(); translate(540, 700); scale(k); paint(rrPts(-150, -44, 300, 88, 44), { wash: RMY.cream, ink: RMY.maroonDk, sw: 1.2 }); pop();
    letter(`PART ${part}`, 540, 703, 56, RMY.maroon, { screen: true, font: '700 56px Poppins', ink: false, pop: pk(.35) });
  }
  if (lt > .7) letter(title, 540, 800, 62, RMY.cream, { screen: true, stroke: RMY.maroonDk, sw: .2, ink: false, pop: pk(.7), maxW: 900 });
}

// ---------- the follow card ----------
// C: { part (the NEXT part's number), title (its title), finale (true: 'missed a part? start from Part 1' instead), sale (an offer line over the books line; none by default: owner, 24 Oct 2026, after the Insta Family Sale), at: { head, title, pill, ask, books } (absolute times) }
function followCard(t, lt, C) {
  boilSeed('fcbg');
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: RMY.maroon, ink: null });
  paint(ellPts(540, 900, 820, 820, 36), { fill: RMY.saffron, fillOp: 150, bleed: .3, tex: .4, border: .3, ink: null });
  glow(540, 900, 600, '#FFB060', .35);
  boilSeed('fcrays');
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .08, r0 = 360, r1 = 1100; paint([[540 + Math.cos(a - .05) * r0, 900 + Math.sin(a - .05) * r0], [540 + Math.cos(a) * r1, 900 + Math.sin(a) * r1], [540 + Math.cos(a + .05) * r0, 900 + Math.sin(a + .05) * r0]], { wash: RMY.ray, washOp: 45, ink: null }); }
  const A = C.at, pk = d => Math.max(0, t - d) * 4, X = 470;
  if (t > A.head) {
    letter('RAMAYAN', X, 500, 96, RMY.gold, { screen: true, font: '96px Marcellus', stroke: RMY.maroonDk, sw: .14, ink: false, pop: pk(A.head), maxW: 820 });
    letter(C.finale ? 'THE END · ALL 12 PARTS' : 'NEXT', X, 600, 44, RMY.cream, { screen: true, font: '700 44px Poppins', ink: false, pop: pk(A.head + .15), maxW: 820 });
  }
  if (t > A.title) {
    // the finale (owner, 24 Oct 2026): send them back to the start instead of teasing the next part
    letter(C.finale ? 'MISSED A PART?' : `PART ${C.part}`, X, 700, C.finale ? 96 : 120, RMY.cream, { screen: true, stroke: RMY.maroonDk, sw: .2, ink: false, pop: pk(A.title), rot: -.02, maxW: 820 });
    letter(C.finale ? 'START FROM PART 1' : C.title, X, 830, 92, RMY.gold, { screen: true, stroke: RMY.maroonDk, sw: .2, ink: false, pop: pk(A.title + .2), maxW: 820, rot: -.02 });
  }
  if (t > A.pill) {
    const k = backOut(clamp(pk(A.pill))) * (1 + .03 * pulse(t, 4));
    boilSeed('fcpill'); push(); translate(X, 1000); scale(k); paint(rrPts(-330, -58, 660, 116, 58), { wash: RMY.orange, ink: null }); pop();
    letter('Follow @therishikatha', X, 1003, 54, RMY.cream, { screen: true, font: '700 54px Poppins', ink: false, pop: pk(A.pill), maxW: 600 });
    letter(C.finale ? 'for the next series' : "so you don't miss it", X, 1098, 38, RMY.cream, { screen: true, font: '500 38px Poppins', ink: false, pop: pk(A.pill + .2) });
  }
  if (t > A.ask) letter(C.ask || 'Comment JAI SHRI RAM 🙏', X, 1200, 56, RMY.gold, { screen: true, stroke: RMY.maroonDk, sw: .2, ink: false, pop: pk(A.ask), maxW: 820 });
  if (t > A.books) {
    const a = pk(A.books);
    // the three covers in a row, the two lines under them (owner, 23 Oct 2026: the text sat on the covers; no price, the sale)
    [['book1', -1], ['book2', 0], ['book3', 1]].forEach(([b, i], j) => picture(PICS[b], X + i * 96, 1300, 84, 84, { rot: i * .06, pop: Math.max(0, a - j * .5), r: 6, shadow: 10 }));
    if (C.sale) {
      letter(C.sale, X, 1398, 36, RMY.gold, { screen: true, font: '700 36px Poppins', ink: false, pop: a, maxW: 820 });
      letter('Our picture books · rishikatha.com · link in bio', X, 1446, 28, RMY.cream, { screen: true, font: '500 28px Poppins', ink: false, pop: a, maxW: 820 });
    } else {
      letter('Our picture books', X, 1398, 36, RMY.gold, { screen: true, font: '700 36px Poppins', ink: false, pop: a, maxW: 820 });
      letter('rishikatha.com · link in bio', X, 1446, 28, RMY.cream, { screen: true, font: '500 28px Poppins', ink: false, pop: a, maxW: 820 });
    }
  }
}

// ---------- the model sheet: ?loop=ramayan ----------
LOOPS.ramayan = t => {
  paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
  valmiki(200, 760, 18, { boilKey: 'sv', eyes: 'closed', mouth: 'smile' });
  valmiki(540, 760, 18, { boilKey: 'sv2', eyes: 'angry', mouth: 'open', handR: [7.5, -21], bendR: .3, brow: -.8 });
  valmiki(880, 760, 18, { boilKey: 'sv3', leaf: 1, eyes: 'look', lookY: .6, mouth: 'smile' });
  nishada(200, 1380, 18, { boilKey: 'sn', aim: frac(t / 2) * 1.2, eyes: 'angry', mouth: 'flat' });
  nishada(540, 1380, 18, { boilKey: 'sn2', cower: 1, eyes: 'wide', mouth: 'scream', sweat: true });
  brahma(860, 1380, 16, { boilKey: 'sb', bless: 1, eyes: 'closed', mouth: 'smile' });
  krauncha(220, 1820, 220, { key: 'k1', wings: (Math.sin(t * 3) + 1) / 2, neck: .2 });
  krauncha(560, 1820, 220, { key: 'k2', flip: true, neck: -.5, beak: 1 });
  krauncha(850, 1820, 220, { key: 'k3', dead: 1 });
};
LOOPS.ayodhya = t => {
  paint(rectPts(-40, -40, W + 80, H + 80), { wash: PAL.paper, ink: null });
  dasharatha(200, 760, 18, { boilKey: 'sd', mouth: 'smile' });
  dasharatha(540, 760, 18, { boilKey: 'sd2', eyes: 'closed', mouth: 'O', brow: .9, pray: 1 });
  kaikeyi(880, 760, 18, { boilKey: 'sk', mouth: 'smile', eyes: 'happy' });
  kaikeyi(200, 1400, 18, { boilKey: 'sk2', plain: 1, hairDown: 1, eyes: 'angry', mouth: 'frown' });
  manthara(540, 1400, 18, { boilKey: 'sm', eyes: 'narrow', mouth: 'smirk' });
  manthara(880, 1400, 18, { boilKey: 'sm2', eyes: 'angry', mouth: 'open', handR: [4.6, -19], bendR: .4 });
  ram(540, 1880, 16, { boilKey: 'sr', mouth: 'smile' });
  goldenDeer(200, 1880, 220, { key: 'sgd', walk: t, glow: 1 });
  surpanakha(880, 1880, 16, { boilKey: 'ssp', mouth: 'grin' });
};
LOOPS.ayodhya.len = 2;
LOOPS.ramayan.len = 2;
