// ayyappa_series.js: the Ayyappa series kit (Painted; plan in AYYAPPA_SERIES.md). Shared by every part's scene.
// Load after bal_krishna.js, parshurama.js, parvati.js, mahishasura.js and hanuman_series.js (HSK, hsCard,
// hsCoverTitle and the small props: poof, sparkleBurst, cloudPuff, orb, diya are reused as they are).
//   AYK                                   the series palette
//   ayyappa(x, y, u, o)                   little Manikanta on Bal Krishna's rig (bal_krishna.js): dusky blue skin (the
//                                         Bhoothanathopakhyanam's "nila", the Kanda Puranam's "dark"), black curls and a
//                                         topknot with a gold band, an ash tripundra and a red dot, a saffron mundu with a
//                                         maroon border, and THE GOLD BELL at his throat (o.bell false hides it: before
//                                         Shiva gives it, Bhoothanathopakhyanam ch. 4); no feather, no flute; every
//                                         balKrishna() option works (pose 'sit' / 'stand', arms, eyes, mouths, …)
//   shivaStand(x, y, u, o)                Shiva standing, on Parshurama's rig (Narad's body, brawn, a jatamukuta and
//                                         locks): Shiva's blue skin (shiva.js), clean-shaven, the ash tripundra, a tiger-
//                                         skin dhoti, the crescent moon in his jata and Vasuki round his neck (o.snake
//                                         false hides him), a trishul in his left hand (o.trishul 0..1); every narada() /
//                                         parshurama() option works (walk, bow, pray, hx, handL / handR, eyes, mouths…)
//   mohini(x, y, u, o)                    Vishnu as Mohini, on Parvati's rig: Vishnu's yellow silk as a saree, a blue
//                                         blouse, a small gold kirita, fish-shaped earrings (Bhoothanathopakhyanam ch. 3:
//                                         "meenakundalam"); every parvati() option works
//   mahishi(x, y, u, o)                   Mahishi, the buffalo-faced demoness (Mahishasura's sister, Bhoothanathopakhyanam
//                                         ch. 1), on Mahishasura's rig: slate-violet skin, buffalo horns, a wild mane, a
//                                         gold nath, earrings, no moustache, no sword or shield; every mahishasura() option
//   ayPill(part, a)                       the small "AYYAPPA · PART N" pill, bottom left of the safe band (screen space)
//   aySource(txt, age, life)              the source line beside it (hsSource's place and look)
//   ayBell(x, y, s, swing, key)           the gold bell on its own (a close-up, the cover)
const AYK = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542', goldLt: '#FFE69A', goldDk: '#C8922A', black: '#2A1E2A',
  saffron: '#F08A2E', saffronDk: '#C4621A', saffronLt: '#FFB870', maroon: '#8A1E2A',
  champak: '#F7C64A', champakDk: '#D99A22', leaf: '#4E9A5A', leafDk: '#2E6A40', leafLt: '#8CC26E', ruby: '#D2283A', rubyLt: '#FF8A98',
  milk: '#FFFBF2', milkDk: '#E6DCCB', silver: '#D6DCE4', silverDk: '#98A2B0',
};

// ---------- little Ayyappa (Manikanta) ----------
const AYP_PAL = {
  skin: '#5A6CAA', skinDk: '#3E4E8A', skinLt: '#8E9ED0', sole: '#A2AED6', cheek: '#D88AB0',
  pit: AYK.saffron, pitDk: AYK.saffronDk, pitLt: AYK.saffronLt, border: AYK.maroon, cord: AYK.black,
  tilak: '#F6F2EA', tilakRed: '#D2283A', glow: '#FFE2A0',
};
function ayyappa(x, y, u, o = {}) {
  return balKrishna(x, y, u, { feather: false, flute: false, tilak: 'ash', pearls: false, pendant: o.bell === false ? false : 'bell', ...o,
    pal: { ...AYP_PAL, ...(o.pal || {}) } });
}
// the bell on its own, hanging from (x, y) (the top of its loop); s ≈ its height
function ayBell(x, y, s, swing = 0, key = 'bell') {
  boilSeed('aybell ' + key);
  push(); translate(x, y); rotate(swing);
  inkLine([[0, -s * .15], [0, s * .12]], Math.max(.6, s / 40), AYK.black, 'inkfine', 0);
  paint(ellPts(0, -s * .2, s * .1, s * .1, 10), { ink: AYK.ink, sw: Math.max(.5, s / 70) });
  const P = [[-.16, .1], [.16, .1], [.42, .38], [.52, .82], [.66, 1.0], [-.66, 1.0], [-.52, .82], [-.42, .38]].map(([a, b]) => [a * s, b * s]);
  paint(P, { wash: AYK.gold, fill: AYK.goldDk, fillOp: 55, tex: .4, ink: AYK.ink, sw: Math.max(.6, s / 60), curv: .45 });
  paint(ellPts(-s * .17, s * .45, s * .09, s * .22, 8), { wash: AYK.goldLt, washOp: 220, ink: null });
  inkLine([[-s * .55, s * .86], [s * .55, s * .86]], Math.max(.5, s / 80), AYK.goldDk, 'inkfine', 0);
  paint(ellPts(0, s * 1.1, s * .15, s * .12, 10), { wash: AYK.goldDk, ink: AYK.ink, sw: Math.max(.4, s / 90) });
  pop();
}

// ---------- Shiva, standing ----------
const SHS_PAL = {
  skin: '#86AEDD', skinDk: '#5B84BC', skinLt: '#BCD6F2', ink: '#243052',
  dhoti: '#E89A3A', dhotiDk: '#B86A1A', dhotiLt: '#F6C27A', border: '#5A3A20',
  hair: '#2A2438', hairLt: '#4E4660', bead: '#7E3E22', beadDk: '#552614', tulsi: '#7E3E22',
  ash: '#F4F0E8', ashDk: '#CFC6B8', red: '#D42A2A', tilak: '#FFF6E6', lip: '#6E4A6A', mouth: '#4A2236',
};
function shivaStand(x, y, u, o = {}) {
  const prevHat = o.hat, prevChest = o.chest, prevArmL = o.armL, tri = o.trishul ?? 0;
  return parshurama(x, y, u, { beard: false, axe: false, quiver: false, hide: false, ...o, pal: { ...SHS_PAL, ...(o.pal || {}) },
    hat: (uu, sw) => {   // the crescent moon in the jata, screen right
      boilSeed('shs moon ' + (o.boilKey || ''));
      const cx = 1.9, cy = -26.3;
      paint(U([[cx - .6, cy - 1.2], [cx + .3, cy - 1.15], [cx + .95, cy - .45], [cx + 1.0, cy + .35], [cx + .5, cy + .95], [cx - .35, cy + 1.1], [cx + .15, cy + .45], [cx + .35, cy - .1], [cx + .1, cy - .7]], uu), { wash: '#FFF6D8', fill: '#E8D49A', fillOp: 40, ink: SHS_PAL.ink, sw: sw * .55, curv: .5 });
      if (prevHat) prevHat(uu, sw);
    },
    chest: (uu, sw) => {   // Vasuki: a green snake round his neck, his head raised by Shiva's right collarbone
      if (o.snake !== false) {
        boilSeed('shs snake ' + (o.boilKey || ''));
        const wv = Math.sin(T * 2.2) * .15;
        paint(U(ribbon([[-2.6, -16.4], [-1.6, -15.2], [0, -14.7], [1.6, -15.2], [2.5, -16.2], [2.9, -17.2 + wv], [2.6, -18.0 + wv]], .62, .5), uu), { wash: '#4FA26A', fill: '#2E7A4E', fillOp: 50, tex: .4, ink: SHS_PAL.ink, sw: sw * .6, curv: .4 });
        paint(ellPts(2.6 * uu, (-18.2 + wv) * uu, .55 * uu, .45 * uu, 12), { wash: '#4FA26A', ink: SHS_PAL.ink, sw: sw * .5 });
        paint(ellPts(2.75 * uu, (-18.35 + wv) * uu, .1 * uu, .1 * uu, 6), { wash: SHS_PAL.ink, ink: null });
        for (let i = 0; i < 5; i++) { const k = i / 4; paint(ellPts(lerp(-1.8, 2.2, k) * uu, (-15.25 + Math.sin(k * Math.PI) * .45) * uu, .16 * uu, .12 * uu, 6), { wash: '#BEE6A0', ink: null }); }
      }
      if (prevChest) prevChest(uu, sw);
    },
    armL: tri > 0 ? (uu, sw) => { push(); scale(tri); trishul(uu * .9, sw); pop(); if (prevArmL) prevArmL(uu, sw); } : prevArmL,
  });
}

// ---------- Mohini ----------
const MOH_PAL = { saree: '#F6C431', sareeDk: '#D49A1A', sareeLt: '#FFE38A', blouse: '#3E6CB8', blouseDk: '#2A4E8E', bangle: '#3E6CB8',
  skin: '#F6CDA8', skinDk: '#DCA27C', skinLt: '#FFE6CE', lip: '#D0506A', gold: '#F2C230', goldDk: '#B88A1C', goldLt: '#FFE69A' };
function mohini(x, y, u, o = {}) {
  const prev = o.behind;
  return parvati(x, y, u, { col: MOH_PAL.skin, dk: MOH_PAL.skinDk, lt: MOH_PAL.skinLt, blush: .35, ...o, pal: { ...MOH_PAL, ...(o.pal || {}) },
    behind: (uu, sw) => { if (o.glowK) { boilSeed('moh glow ' + (o.boilKey || '')); glow(0, -16 * uu, uu * 14, '#FFF0B8', o.glowK); } if (prev) prev(uu, sw); } });
}

// ---------- Mahishi ----------
const MHI_PAL = { skin: '#7C7598', skinDk: '#5A5478', skinLt: '#A49CC0', hair: '#1E1A2A', hairLt: '#3E3850', dhoti: '#8A2E4A', dhotiDk: '#62203A', dhotiLt: '#B8506E',
  sash: '#E8A23A', sashDk: '#B87A1E', eye: '#FFD84A' };
function mahishi(x, y, u, o = {}) {
  const prevHat = o.hat;
  return mahishasura(x, y, u, { stache: 'none', tusks: false, sword: false, shield: false, fistL: false, fistR: false, ...o, pal: { ...MHI_PAL, ...(o.pal || {}) },
    hat: (uu, sw) => {   // a red bindi and a red flower in her mane
      boilSeed('mhi bindi ' + (o.boilKey || ''));
      paint(ellPts(0, -20.55 * uu, .3 * uu, .3 * uu, 10), { wash: '#E2283A', ink: null });
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; paint(ellPts((2.2 + Math.cos(a) * .55) * uu, (-22.2 + Math.sin(a) * .55) * uu, .42 * uu, .34 * uu, 8, 0, a), { wash: '#E2283A', ink: MHS.ink, sw: sw * .4 }); }
      paint(ellPts(2.2 * uu, -22.2 * uu, .25 * uu, .25 * uu, 8), { wash: '#F5C542', ink: null });
      if (prevHat) prevHat(uu, sw);
    } });
}

// ---------- the series marks ----------
function ayPill(part, a = 1) {
  boilSeed('aypill');
  paint(rrPts(64, 1440, 268, 52, 26), { wash: HSK.orange, washOp: 255 * a, ink: a < 1 ? null : HSK.ink, sw: 1 });
  letter('AYYAPPA · PART ' + part, 198, 1468, 32, HSK.cream, { screen: true, ink: false, rot: 0, alpha: a, maxW: 240 });
}
function aySource(txt, age, life = 99) { hsSource(txt, age, life); }

LOOPS.ayyappa = t => {
  camBegin(540, 960, 1);
  boilSeed('ayl bg'); paint(rectPts(-60, -60, 1200, 2040), { wash: '#FBE6C8', ink: null });
  ayyappa(270, 900, 30, { pose: 'sit', eyes: 'happy', mouth: 'grin', blush: .5 });
  ayyappa(780, 900, 30, { pose: 'stand', eyes: 'normal', mouth: 'smile', handR: [3.2, -9.4], handShapeR: 'open' });
  shivaStand(250, 1800, 26, { boilKey: 'shl', eyes: 'happy', mouth: 'smile', trishul: 1 });
  mohini(560, 1800, 28, { boilKey: 'mol', eyes: 'happy', mouth: 'smile' });
  mahishi(870, 1800, 30, { boilKey: 'mhl', eyes: 'angry', mouth: 'laugh' });
  camEnd();
};
LOOPS.ayyappa.len = 2;
