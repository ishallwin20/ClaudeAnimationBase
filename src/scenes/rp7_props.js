// rp7_props.js: sets, props and the extra cast for rp7.js (Ramayan Part 7, "Ravana Takes Sita"). Loaded after
// src/ramayan.js and src/ramayan_sets.js (P1, ashram, hut, tree, bush, notes, tears, arrowAt).
//   P7                               the palette
//   skyChase, monkeyHill, pyre, poof sets and props
//   skyChariot(x, y, s, o)           Ravana's flying chariot (Surya's gold chariot, pulled by ghost-faced donkeys)
//   jatayu(x, y, s, o)               the old vulture king on the parrot rig (brown, a white ruff, a hooked yellow beak)
//   vanaraOn(x, y, u, o)             one of the five on the hill (Hanuman's rig in other furs), sitting
//   bundle(x, y, s, open)            Sita's jewels tied in her yellow scarf
const P7 = {
  ink: '#2B2233', cream: '#FFF5E2', gold: '#F5C542',
  skyHi: '#7FA8D8', skyLo: '#F6D2A8', cloud: '#FFFFFF', cloudDk: '#E2D2C2', hill: '#7E9A5E', hillDk: '#5E7A44', rock: '#9A8E7E',
};
const JATAYU_PAL = { parrot: '#8A6A4A', parrotDk: '#5E4430', parrotLt: '#B08E6A', wing: '#6E5238', wingDk: '#4A3424', head: '#F4ECDC', headDk: '#D2C6AE',
  tail: '#5E4430', tailDk: '#3E2C1E', beak: '#E8B83A', beakDk: '#B8862A', claw: '#B8862A' };

// a high sky with clouds streaming past (the chariot flies through it)
function skyChase(t, key = 'sk', speed = 1) {
  boilSeed(key + 'sky');
  paint(rectPts(-600, -600, W + 1200, 3200), { wash: P7.skyHi, ink: null });
  paint(ellPts(540, 1300, 1100, 600, 26), { fill: P7.skyLo, fillOp: 220, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 8; i++) {
    const sp = (260 + 200 * hash(i * 3.1)) * speed, x = 1500 - frac(hash(i * 7.3) + t * sp / 2000) * 2000, y = 300 + hash(i * 5.1) * 1700;
    cloudPuff7(x, y, 100 + 90 * hash(i * 1.9), key + i);
  }
  if (speed > 0) { boilSeed(key + 'streak'); for (let i = 0; i < 9; i++) { const y = 300 + hash(i * 2.2) * 1500, x = 1200 - frac(hash(i * 4.4) + t * 1.4) * 1700; inkLine([[x, y], [x + 220, y]], 2, '#E8EEF6', 'inkfine', 0); } }
}
function cloudPuff7(x, y, s, key, a = 230) {
  boilSeed('cloud' + key);
  paint(ellPts(x, y + s * .18, s * 1.1, s * .32, 18), { wash: P7.cloudDk, washOp: a, ink: null });
  for (const [dx, dy, r] of [[-.6, 0, .42], [-.15, -.22, .55], [.4, -.08, .46], [.85, .06, .3]]) paint(ellPts(x + dx * s, y + dy * s, r * s, r * s * .85, 16), { wash: P7.cloud, washOp: a, ink: null });
}
// the hill with the five monkeys, seen from above as the chariot passes: a green rise with rocks, its top at (x, y)
function monkeyHill(x, y, s, key = 'mh') {
  boilSeed(key);
  paint([[x - s, y + s * .7], [x - s * .6, y + s * .1], [x - s * .2, y - s * .05], [x + s * .3, y], [x + s * .7, y + s * .2], [x + s * 1.1, y + s * .7]], { wash: P7.hill, fill: P7.hillDk, fillOp: 50, tex: .5, ink: P7.ink, sw: 1, curv: .5 });
  for (let i = 0; i < 4; i++) paint(ellPts(x - s * .5 + i * s * .35, y + s * .2 + (i % 2) * s * .1, s * .1, s * .06, 10, 2), { wash: P7.rock, ink: P7.ink, sw: .7 });
}
// a funeral pyre with flames (k 0..1 the fire grows), its base centred at (x, y), s wide
function pyre(x, y, s, t, k = 1, key = 'py') {
  boilSeed(key);
  for (let i = 0; i < 4; i++) paint(rrPts(x - s * .5, y - (i + 1) * s * .08, s, s * .07, s * .02), { wash: i % 2 ? '#8A5A30' : '#6E4422', ink: P7.ink, sw: .7 });
  if (k <= 0) return;
  glow(x, y - s * .5, s * 1.2 * k, '#FF9A40', .6 * k);
  for (let i = 0; i < 7; i++) {
    const fx = x - s * .4 + i * s * .13, h = s * (.4 + .4 * hash(i * 3.1)) * k * (.85 + .15 * Math.sin(t * 9 + i * 2)), w = s * .08;
    paint([[fx - w, y - s * .3], [fx - w * .4, y - s * .3 - h * .6], [fx + Math.sin(t * 7 + i) * w * .5, y - s * .3 - h], [fx + w * .5, y - s * .3 - h * .5], [fx + w, y - s * .3]], { wash: i % 2 ? '#F2A23A' : '#FFD45A', ink: null, curv: .5 });
  }
}

// a puff of magic smoke (age 0..1)
function poof(x, y, s, age, key = 'pf') {
  if (age < 0 || age > 1) return;
  boilSeed(key);
  glow(x, y, s * 1.6 * (1 - age), '#C8A0FF', .6 * (1 - age));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = s * (.3 + age * .9); paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, s * .35 * (1 - age * .6), s * .3 * (1 - age * .6), 12), { wash: i % 2 ? '#E2D4F2' : '#C8B4E8', washOp: 255 * (1 - age), ink: null }); }
}
// ---------- the cast ----------
// Ravana's chariot in the sky: Surya's gold chariot drawn by two grey donkeys with fangs (ghost-faced, Aranya 49)
function skyChariot(x, y, s, t, o = {}) {
  const u = s / 14, gal = t * 1.6;
  for (const [dx, dy, k] of [[11.5, -1, 'a'], [14.5, .6, 'b']]) donkey(x + dx * u, y + dy * u, u * .8, { boilKey: 'skd' + k, walk: gal + (k === 'b' ? .3 : 0), ears: 1, eyes: 'angry', tint: '#4A3A5A', tintK: .35, cloth: false, garland: false, noShadow: true, bray: .3 + .3 * Math.sin(t * 6) });
  suryaChariot(x, y, u * 1.4, { part: 'back', boilKey: 'skc' });
  if (o.riders) o.riders(suryaChariotSeat(x, y, u * 1.4));
  suryaChariot(x, y, u * 1.4, { part: 'front', boilKey: 'skc', spin: gal * 3, pole: [x + 11 * u, y - 4 * u] });
}
function jatayu(x, y, s, o = {}) { return kamaParrot(x, y, s, { ring: false, brow: true, ...o, pal: { ...JATAYU_PAL, ...(o.pal || {}) } }); }
const VANARA_FURS = [{ skin: '#8A6A4A', skinDk: '#634A30', skinLt: '#B08E6A', fur: '#8A6A4A', furDk: '#634A30', furLt: '#B08E6A' }, { skin: '#B8864A', skinDk: '#8A5E2E', skinLt: '#D8A86A', fur: '#B8864A', furDk: '#8A5E2E', furLt: '#D8A86A' },
  { skin: '#9A8A7A', skinDk: '#6E6050', skinLt: '#BCAC9A', fur: '#9A8A7A', furDk: '#6E6050', furLt: '#BCAC9A' }, { skin: '#C8763A', skinDk: '#9A5420', skinLt: '#E8985A', fur: '#C8763A', furDk: '#9A5420', furLt: '#E8985A' }];
function vanaraOn(x, y, u, o = {}) {
  const fur = o.fur == null ? null : VANARA_FURS[o.fur % 4];
  return hanuman(x, y, u, { sit: 1, gada: 0, tail: 'droop', ...(fur ? { crown: false, pal: { ...HNM, ...fur, dhoti: '#5E7A44', dhotiDk: '#3E5A2E', dhotiLt: '#7E9A5E' } } : {}), ...o });
}
// Sita's jewels tied in her yellow scarf (open 0..1: it falls open to show the jewels), centred at (x, y)
function bundle(x, y, s, open = 0, key = 'bd') {
  boilSeed(key);
  paint(ellPts(x, y, s * .5, s * .38, 14, 2), { wash: '#F2C83A', fill: '#C89A22', fillOp: 50, tex: .4, ink: P7.ink, sw: .9 });
  paint([[x - s * .1, y - s * .35], [x, y - s * .6], [x + s * .12, y - s * .36]], { wash: '#F2C83A', ink: P7.ink, sw: .7, curv: .4 });
  if (open > 0) for (let i = 0; i < 5; i++) { const a = -Math.PI * (.1 + .8 * i / 4); glow(x + Math.cos(a) * s * .5 * open, y + Math.sin(a) * s * .4 * open, s * .2, '#FFF2C0', .5 * open); paint(ellPts(x + Math.cos(a) * s * .5 * open, y + Math.sin(a) * s * .4 * open, s * .08, s * .08, 8), { wash: i % 2 ? '#D2283A' : '#3EB8E8', ink: P7.ink, sw: .5 }); }
}
