// ashowl_props.js: sets and props for "An OWL gave him the darkest idea in the Mahabharata" (ad 118, the first comic
// reel: CHIRANJEEVI Issue 1, Ashwatthama). The night of the 18th day (Sauptika Parva 10.1): a vast banyan under the
// moon, thousands of crows asleep in it, the horned owl, the two sleepers, the field and the Pandava camp.
// All world coordinates; the banyan set's ground is AO_GY.
const AO = {
  sky: '#151B3A', skyHi: '#26305E', skyLo: '#0F1328', moon: '#F4ECD6', moonDk: '#D9CDB0', moonGlow: '#AFC4FF',
  leaf: '#0F1C26', leafMid: '#1F3644', leafLt: '#3E5E70', bark: '#2B2329', barkDk: '#1A1519', barkLt: '#463A40',
  ground: '#141824', groundLt: '#222A3C', grass: '#1C2433', root: '#2E262C',
  fire: '#FF8A2A', fireIn: '#FFD27A', fireGlow: '#FF7A1A', tent: '#2A2232', tentLit: '#7A3E2A', pole: '#3A2A22',
  feather: '#2A2634', featherLt: '#8A86A8', ink: '#120E16', star: '#E8EEFF', gold: '#F5C542', cream: '#FFF4E0',
  owl: '#9A6A3A', owlDk: '#6A4420', owlLt: '#C99A62', owlFace: '#D8B486', owlFaceDk: '#B08A5E', owlRim: '#3E2614',
  owlEye: '#F2C21E', owlEyeLt: '#FFE36A', crowEyeLid: '#4A5062',
};
const AO_GY = 1500;

// ---------------- the sky: a deep night, stars, the moon (mx, my) with its halo
function aoSky(key, mx = 1120, my = -680, mr = 130) {
  boilSeed('sky ' + key);
  paint(rectPts(-2000, -3000, 5200, 6400), { wash: AO.sky, ink: null });
  paint(ellPts(mx, my, mr * 6, mr * 5, 30), { fill: AO.skyHi, fillOp: 110, bleed: .3, tex: .4, ink: null });
  for (let i = 0; i < 70; i++) {
    const sx = -900 + hash(i * 3.1) * 2900, sy = -2000 + hash(i * 7.7) * 2900, tw = .5 + .5 * Math.sin(T * (1 + hash(i) * 2) + i);
    paint(ellPts(sx, sy, 3 + hash(i * 1.3) * 3, 3 + hash(i * 1.3) * 3, 6), { wash: AO.star, washOp: 120 + 120 * tw, ink: null });
  }
  boilSeed('moon ' + key);
  glow(mx, my, mr * 4.2, AO.moonGlow, 70);
  glow(mx, my, mr * 1.7, '#FFFFFF', 60);
  paint(ellPts(mx, my, mr, mr, 36), { wash: AO.moon, ink: null });
  for (const [a, b, r] of [[-.3, -.2, .22], [.25, .2, .3], [.1, -.4, .14], [-.35, .35, .12]]) paint(ellPts(mx + a * mr, my + b * mr, r * mr, r * mr, 12), { wash: AO.moonDk, washOp: 150, ink: null });
}

// ---------------- the banyan: a trunk of fused stems, pillar roots, great branches, aerial roots, the canopy
const AO_BR = [   // branch centre lines (world), each with a base and tip width
  [[[520, 560], [300, 420], [60, 360], [-240, 380]], 74, 26],
  [[[580, 540], [800, 400], [1060, 330], [1330, 350]], 74, 26],
  [[[520, 440], [400, 180], [200, 40], [-80, -10]], 62, 22],
  [[[580, 440], [720, 190], [920, 60], [1200, 20]], 62, 22],
  [[[550, 380], [570, 80], [520, -240], [560, -470]], 56, 20],
  [[[480, 200], [260, -160], [40, -330]], 40, 16],
  [[[620, 200], [840, -170], [1080, -320]], 40, 16],
];
function aoBranchPt(i, k) {   // a point along branch i (k 0..1) on its upper edge, where a bird sits
  const P = through(AO_BR[i][0]), n = P.length - 1, f = clamp(k) * n, j = Math.min(n - 1, Math.floor(f)), q = f - j;
  const [a, b] = [P[j], P[j + 1]], w = lerp(AO_BR[i][1], AO_BR[i][2], k);
  return [lerp(a[0], b[0], q), lerp(a[1], b[1], q) - w * .42];
}
// the crows: [branch, k, size, flip]; every crow has a stable place
const AO_CROWS = (() => {
  const out = [];
  AO_BR.forEach((b, i) => { const n = i < 4 ? 7 : 4; for (let j = 0; j < n; j++) { const k = .2 + .78 * (j + hash(i * 13 + j) * .5) / n; out.push([i, k, 15 + hash(i * 5 + j * 3) * 5, hash(i + j * 9) > .5 ? 1 : 0]); } });
  return out;
})();
function aoCanopy(key, t, layer) {
  // layer 'back': the big dark masses behind the branches; 'front': a few clumps over the branch tips
  boilSeed(`canopy ${key} ${layer}`);
  const sw = Math.sin(t * .6) * 6;
  const back = [[540, -620, 900, 360], [-160, -260, 520, 300], [1240, -260, 520, 300], [140, -520, 520, 260], [940, -520, 520, 260], [-300, 120, 360, 240], [1380, 120, 360, 240], [540, -900, 520, 220]];
  const front = [[-330, 300, 230, 120], [1420, 290, 230, 120], [-150, -60, 200, 110], [1260, -40, 210, 110], [560, -560, 220, 110]];
  for (const [x, y, rx, ry] of (layer === 'back' ? back : front)) {
    paint(ellPts(x + sw, y, rx, ry, 26, 18), { fill: AO.leaf, fillOp: 255, bleed: .12, tex: .5, ink: null });
    paint(ellPts(x + sw - rx * .2, y - ry * .35, rx * .7, ry * .45, 18, 14), { fill: AO.leafMid, fillOp: 170, bleed: .2, tex: .6, ink: null });
    paint(ellPts(x + sw + rx * .35, y - ry * .55, rx * .4, ry * .25, 14, 10), { fill: AO.leafLt, fillOp: 120, bleed: .25, tex: .6, ink: null });   // moonlit edge
  }
}
function aoBanyan(key, t, o = {}) {
  aoCanopy(key, t, 'back');
  boilSeed('aerial ' + key);   // aerial roots hanging from the branches
  for (let i = 0; i < 22; i++) {
    const b = i % 4, k = .25 + hash(i * 3.3) * .7, [x, y] = aoBranchPt(b, k), len = 260 + hash(i * 5.1) * 520, s = Math.sin(t * .9 + i) * 6;
    inkLine([[x, y + 20], [x + s * .5, y + len * .5], [x + s, y + len]], 3 + hash(i) * 3, AO.root, 'ink', .4);
  }
  boilSeed('pillars ' + key);   // two pillar roots that reached the ground and thickened
  for (const [x, w] of [[90, 46], [1000, 52]]) paint([[x - w * .5, AO_GY + 10], [x - w * .45, 600], [x - w * .2, 420], [x + w * .2, 420], [x + w * .45, 600], [x + w * .6, AO_GY + 10]], { wash: AO.bark, fill: AO.barkDk, fillOp: 80, tex: .5, ink: AO.ink, sw: 1.2, curv: .2 });
  boilSeed('trunk ' + key);
  const trunk = [[300, AO_GY + 20], [370, 1380], [400, 1100], [410, 800], [440, 560], [500, 420], [600, 420], [660, 560], [690, 800], [700, 1100], [730, 1380], [800, AO_GY + 20]];
  paint(trunk, { wash: AO.bark, fill: AO.barkDk, fillOp: 90, bleed: .05, tex: .6, ink: AO.ink, sw: 1.6, curv: .3 });
  for (const [x0, x1] of [[450, 470], [520, 530], [600, 590], [650, 670]]) inkLine([[x0, 520], [x0 + 6, 900], [x1, 1300], [x1 - 10, AO_GY]], 2.2, AO.barkLt, 'ink', .4);   // fused stems
  paint([[420, 700], [470, 690], [480, 1300], [430, 1320]], { fill: AO.barkLt, fillOp: 60, bleed: .2, tex: .5, ink: null });   // moonlight on one side
  boilSeed('branches ' + key);
  for (const [P, w0, w1] of AO_BR) paint(ribbon(through(P), w0, w1), { wash: AO.bark, fill: AO.barkDk, fillOp: 70, tex: .5, ink: AO.ink, sw: 1.3 });
  if (o.crows !== false) aoCrows(key, t, o.dead || (() => -1));
  aoCanopy(key, t, 'front');
}
// the sleeping crows; dead(i) → the time crow i is taken (or -1)
function aoCrows(key, t, dead) {
  AO_CROWS.forEach(([b, k, s, fl], i) => {
    const td = dead(i); if (td >= 0 && t > td) return;
    const [x, y] = aoBranchPt(b, k), br = Math.sin(t * 1.6 + i * 1.7);
    shaniCrow(x, y - s * 2.6 + br * 1.2, s, { boilKey: `crow ${key} ${i}`, eyes: t > (dead.woke ?? 1e9) ? 'wide' : 'closed', flip: fl, tail: -.1, flap: -.8 });
  });
}
// the ground under the banyan: dark earth, a few grass tufts, the roots' feet
function aoGround(key, t, x0 = -1200, x1 = 2300) {
  boilSeed('ground ' + key);
  paint([[x0, AO_GY - 30], [x1, AO_GY - 30], [x1, 3200], [x0, 3200]], { wash: AO.ground, ink: null });
  paint(ellPts(540, AO_GY + 60, 900, 120, 24), { fill: AO.groundLt, fillOp: 120, bleed: .25, tex: .5, ink: null });
  for (let i = 0; i < 16; i++) {
    const gx = x0 + 200 + hash(i * 4.4) * (x1 - x0 - 400), gy = AO_GY + 20 + hash(i * 2.2) * 240, s = Math.sin(t * 1.2 + i) * 3;
    for (const d of [-8, 0, 8]) inkLine([[gx + d, gy], [gx + d * 1.6 + s, gy - 26]], 2, AO.grass, 'ink', .3);
  }
}

// ---------------- the owl: a great horned owl on the Lakshmi owl's rig, tawny, ear tufts, burning yellow eyes
const AO_OWL_PAL = { body: AO.owl, dk: AO.owlDk, lt: AO.owlLt, grey: '#5A4630', greyDk: '#3A2A1A', speck: '#2A1A10',
  white: AO.owlFace, whiteDk: AO.owlFaceDk, rim: AO.owlRim, rimDk: '#24140A', ink: AO.ink, eye: '#2A1A06', eyeLt: AO.owlEye,
  beak: '#3A3030', beakDk: '#1E1818', toe: '#6A5A4A', talon: '#140E10' };
function aoOwl(x, y, u, o = {}) {
  const g = clamp(o.eyeGlow ?? .7);
  owl(x, y, u, { eyes: 'angry', brows: -1, mouth: 'flat', ...o, pal: AO_OWL_PAL,
    hat: (uu, sw) => {   // the ear tufts
      for (const s of [-1, 1]) paint(U([[s * 1.2, -12.4], [s * 2.2, -14.6], [s * 2.6, -15.4], [s * 2.5, -13.6], [s * 2.6, -12.2]], uu), { wash: AO.owlDk, ink: AO.ink, sw: sw * .7, curv: .25 });
      if (o.hat) o.hat(uu, sw);
    } });
  if (g > 0) for (const s of [-1, 1]) {   // the eyes burn in the dark
    const [bx, by] = owlHead(x, y, u, o);
    glow(bx + s * 1.3 * u * 1.16 * (o.flip ? -1 : 1), by - .1 * u, 1.4 * u, AO.owlEye, 110 * g);
  }
}
// two eyes opening in the dark (the owl unseen): k 0..1 opens them
function aoEyes(x, y, s, k, key) {
  if (k <= .01) return;
  boilSeed('eyes ' + key);
  for (const sx of [-1, 1]) {
    glow(x + sx * s, y, s * 1.6, AO.owlEye, 120 * k);
    paint(ellPts(x + sx * s, y, s * .55, s * .55 * k, 14), { wash: AO.owlEyeLt, ink: null });
    paint(ellPts(x + sx * s, y, s * .2, s * .26 * k, 8), { wash: AO.ink, ink: null });
  }
}
// a puff of black feathers where a crow was taken (age since the strike)
function aoFeathers(x, y, age, key, n = 9, spread = 1) {
  if (age < 0 || age > 3.2) return;
  boilSeed('feathers ' + key);
  for (let i = 0; i < n; i++) {
    const a = hash(i * 3.7 + x) * TAU, v = (60 + hash(i * 1.9) * 140) * spread, e = 1 - Math.exp(-age * 5);
    const px = x + Math.cos(a) * v * e + Math.sin(age * 3 + i) * 22 * age, py = y + Math.sin(a) * v * e * .6 + age * age * 40 + age * 30;
    const s = 12 + hash(i * 5.3) * 10, r = a + Math.sin(age * 4 + i) * .8, al = 1 - seg(age, 2.4, 3.2);
    push(); translate(px, py); rotate(r);
    paint([[-s, 0], [-s * .3, -s * .32], [s, 0], [-s * .3, s * .32]], { wash: AO.feather, washOp: 255 * al, ink: al > .5 ? AO.featherLt : null, sw: .6, curv: .5 });
    pop();
  }
}

// ---------------- the sleepers: Kripa (white-haired) and Kritavarma, lying on the bare ground on Narad's rig
// (x, y) the ground point under the middle of the body; dir 1 = head to the right
const AO_KRIPA = { ...NRD_SAGE, dhoti: '#C9C0A8', dhotiDk: '#9E9478', dhotiLt: '#E6DFCA', border: '#7A3A1E' };
const AO_KRITA = { skin: '#D7A274', skinDk: '#AE7A50', skinLt: '#F0C49A', dhoti: '#C08A26', dhotiDk: '#8E6216', dhotiLt: '#E6B652', border: '#5A2A4A', hair: '#241A1E', hairLt: '#4A3A40' };
function aoSleeper(x, y, u, who, t, dir = 1) {
  const pal = who === 'kripa' ? AO_KRIPA : AO_KRITA, br = Math.sin(t * 1.4 + (who === 'kripa' ? 0 : 2));
  push(); translate(x - dir * 13 * u, y - 3.1 * u); rotate(dir * Math.PI / 2);
  narada(0, 0, u, { boilKey: 'sleep ' + who, seed: who === 'kripa' ? 81 : 82, veena: false, shawl: who === 'kripa', mala: false, tilak: who === 'kripa' ? undefined : false,
    beard: who === 'kripa' ? '#EDE6DC' : '#241A1E', beardLen: who === 'kripa' ? .8 : .4, brawn: who === 'kripa' ? 0 : 1, pal,
    eyes: 'closed', mouth: who === 'kripa' ? 'O' : 'flat', puff: .15 + .15 * br, handL: [-1.4, -14.2], handR: [1.6, -13.8], bendL: -.5, bendR: -.5, noShadow: 1 });
  pop();
}

// ---------------- the field and the Pandava camp far off: tents, fires, a palisade and its gate
function aoCamp(key, t, o = {}) {
  const hz = o.hz ?? 1180, cx = o.cx ?? 820;
  boilSeed('field ' + key);
  paint([[-1400, hz], [2600, hz], [2600, 3400], [-1400, 3400]], { wash: AO.ground, ink: null });
  paint(ellPts(cx, hz + 20, 760, 70, 24), { fill: AO.fireGlow, fillOp: 70, bleed: .3, tex: .4, ink: null });   // the camp's glow on the earth
  boilSeed('camp ' + key);
  glow(cx, hz - 40, 520, AO.fireGlow, 60);
  for (let i = 0; i < 16; i++) {   // tents
    const tx = cx - 640 + i * 86 + hash(i * 2.3) * 30, th = 110 + hash(i * 4.1) * 70, tw = th * .8, ty = hz + 6 - (i % 2) * 10;
    paint([[tx - tw, ty], [tx, ty - th], [tx + tw, ty]], { wash: AO.tent, ink: AO.ink, sw: .9 });
    paint([[tx - tw * .3, ty], [tx, ty - th * .55], [tx + tw * .3, ty]], { wash: AO.tentLit, washOp: 230, ink: null });
    inkLine([[tx, ty - th], [tx, ty - th - 26]], 1.6, AO.pole, 'ink', 0);
  }
  for (let i = 0; i < 6; i++) {   // fires between the tents
    const fx = cx - 560 + i * 220 + hash(i) * 60, fy = hz + 18, h = 26 + 10 * Math.sin(T * 9 + i * 2), w = 13;
    glow(fx, fy - 10, 70, AO.fireGlow, 90);
    paint([[fx - w, fy], [fx - w * .6, fy - h * .5], [fx + Math.sin(T * 7 + i) * 5, fy - h], [fx + w * .6, fy - h * .5], [fx + w, fy]], { wash: AO.fire, ink: null, curv: .5 });
    paint(ellPts(fx, fy - h * .3, w * .4, h * .28, 8), { wash: AO.fireIn, ink: null });
  }
  boilSeed('palisade ' + key);   // the palisade in front of the camp, with a gate gap at gx
  const gx = o.gx ?? cx - 80;
  for (let i = 0; i < 40; i++) {
    const px = cx - 760 + i * 38; if (Math.abs(px - gx) < 70) continue;
    paint([[px - 10, hz + 70], [px - 10, hz + 22], [px, hz + 8], [px + 10, hz + 22], [px + 10, hz + 70]], { wash: AO.barkDk, ink: AO.ink, sw: .8 });
  }
  for (const s of [-1, 1]) paint(rectPts(gx + s * 80 - 12, hz - 40, 24, 110), { wash: AO.bark, ink: AO.ink, sw: 1 });   // the gateposts
  boilSeed('field fg ' + key);
  for (let i = 0; i < 24; i++) {   // near grass
    const gx2 = -600 + hash(i * 3.9) * 2300, gy = hz + 220 + hash(i * 6.1) * 900, s = Math.sin(t * 1.3 + i) * 4;
    for (const d of [-9, 0, 9]) inkLine([[gx2 + d, gy], [gx2 + d * 1.6 + s, gy - 34]], 2.4, AO.grass, 'ink', .3);
  }
}
// the thing at the gate, rising (k 0..1): a vast dark shape with many raised arms and a burning mouth, seen only as a
// shadow against the camp's glow (the comic's p16 shows it in full)
function aoGuardian(x, y, s, k, key) {
  if (k <= .01) return;
  boilSeed('guardian ' + key);
  const h = s * k, w = s * .4;
  glow(x, y - h * .55, s * .75, '#FF5A1A', 120 * k);   // the camp's fire behind it: a rim of light round the shadow
  glow(x, y - h * .8, s * .3, '#FFB04A', 90 * k);
  for (let i = 0; i < 12; i++) {   // the raised arms, fanned, each with a weapon's shape at the end
    const a = -Math.PI / 2 + (i - 5.5) * .27, L = s * (.5 + .06 * Math.sin(T * 2 + i)) * k, bx = x + Math.cos(a) * w * .4, by = y - h * .66;
    const ex = bx + Math.cos(a + .08) * L, ey = by + Math.sin(a + .08) * L;
    inkLine([[bx, by], [bx + Math.cos(a) * L * .55, by + Math.sin(a) * L * .55], [ex, ey]], s * .045, AO.ink, 'ink', .4);
    paint(ellPts(ex, ey, s * .035, s * .035, 8), { wash: AO.ink, ink: null });
  }
  paint([[x - w, y], [x - w * .85, y - h * .5], [x - w * .5, y - h * .7], [x - w * .3, y - h * .9], [x, y - h], [x + w * .3, y - h * .9], [x + w * .5, y - h * .7], [x + w * .85, y - h * .5], [x + w, y]], { wash: AO.ink, ink: null, curv: .3 });
  for (let i = 0; i < 14; i++) {   // a thousand eyes, opening
    const ex = x + (hash(i * 3.1) - .5) * w * 1.3, ey = y - h * (.25 + hash(i * 5.7) * .55), o = clamp((k - .4 - hash(i) * .4) * 4);
    if (o > 0) paint(ellPts(ex, ey, s * .018, s * .011 * o, 8), { wash: '#FFE07A', ink: null });
  }
  for (const sx of [-1, 1]) { glow(x + sx * s * .07, y - h * .86, s * .07, '#FFE07A', 220 * k); paint(ellPts(x + sx * s * .07, y - h * .86, s * .035, s * .02, 8), { wash: '#FFF4B0', ink: null }); }
  glow(x, y - h * .76, s * .1, '#FF7A2A', 200 * k);
  paint(ellPts(x, y - h * .76, s * .075, s * .045 * (1 + .3 * Math.sin(T * 9)), 12), { wash: '#FF8A2A', ink: null });   // the mouth of flames
  paint(ellPts(x, y - h * .76, s * .04, s * .022, 10), { wash: '#FFE07A', ink: null });
}
// the owl as a shadow among the leaves (the hook): a dark shape with ear tufts, its eyes lit by aoEyes()
function aoOwlShadow(x, y, s, k, key) {
  if (k <= .01) return;
  boilSeed('owlshadow ' + key);
  paint([[x - s * 1.7, y + s * 2.6], [x - s * 1.9, y + s * .6], [x - s * 1.6, y - s * .8], [x - s * 1.5, y - s * 1.9], [x - s * 1.1, y - s * 1.2], [x, y - s * 1.35], [x + s * 1.1, y - s * 1.2], [x + s * 1.5, y - s * 1.9], [x + s * 1.6, y - s * .8], [x + s * 1.9, y + s * .6], [x + s * 1.7, y + s * 2.6]],
    { wash: '#0B0F1C', washOp: 230 * k, ink: '#2A3550', sw: 1.2, curv: .35 });
}
