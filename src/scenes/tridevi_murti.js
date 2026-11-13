// tridevi_murti.js: the murtis of "Lakshmi was born as BRAHMA'S sister" (ad 91), from ad 83's puja_murti.js, made matte
// (owner, 30 Oct: not too shiny) and with more kinds of devi3: 'gauri' (a trishul and a lotus, abhaya and varada),
// 'maha' (the primordial Mahalakshmi of the Pradhanika Rahasya 5: citron, mace, shield, cup) and 'kali' (Mahakali, 8-9:
// sword, shield, cup; abhaya). mats.seat sets the lotus seat's material. ganesha3 is unused here.
// ad 83's notes:
//   ganesha3  four arms (the ankusha and the pasha raised, the lower right in abhaya, the lower left holding a bowl of
//             modaks), the trunk curling to his left onto the bowl, one tusk whole and one broken, a tiered crown, a
//             snake for a belt, his mouse by the lotus
//   devi3     the seated goddess on a lotus under a flame-edged arch: { kind: 'lakshmi' } lotuses in the raised hands, the
//             lower right pouring coins, the lower left holding a little pot; { kind: 'saraswati' } the veena across her
//             lap, a rosary and a book in the raised hands
// Each is built in its own units (about 1.2 tall) facing +z, and returns handles for the puja: dress (silk and a shawl
// that appear), mala (a marigold garland), tilak (the red mark), and k(...) to show it. mats: { skin, cloth, gold, dark }
// so the same Lakshmi can be painted clay (step 1's gentle wipe).

const PMAT = (() => {
  const std = (col, rough = .6, o = {}) => new THREE.MeshStandardMaterial({ color: col, roughness: rough, ...o });
  return {
    brass: new THREE.MeshStandardMaterial({ color: '#C8964A', metalness: .55, roughness: .46, envMapIntensity: .55 }),
    brassD: new THREE.MeshStandardMaterial({ color: '#9C6E30', metalness: .55, roughness: .5, envMapIntensity: .5 }),
    eye: std('#1A1008', .45), red: std('#D0121C', .45, { emissive: '#3A0204', emissiveIntensity: .4 }),
    ruby: std('#D01828', .2, { metalness: .3, emissive: '#400408', emissiveIntensity: .6 }),
    silkY: std('#E8A818', .45, { emissive: '#3A2004', emissiveIntensity: .2, side: THREE.DoubleSide }),
    silkR: std('#B8141E', .45, { emissive: '#2A0204', emissiveIntensity: .25, side: THREE.DoubleSide }),
    silkW: std('#F2EADA', .5, { emissive: '#3A362E', emissiveIntensity: .2, side: THREE.DoubleSide }),
    zari: new THREE.MeshStandardMaterial({ color: '#E8B850', metalness: .55, roughness: .45, envMapIntensity: .55 }),
    mari: [std('#F29A18', .75), std('#E8641A', .75), std('#F6C228', .75)], rose: std('#C0182E', .6), leaf: std('#2E6A24', .6),
    lotus: std('#F4A6B8', .55, { emissive: '#3A1018', emissiveIntensity: .2, side: THREE.DoubleSide }), lotusD: std('#E06A8A', .55, { side: THREE.DoubleSide }),
    // painted clay (a Diwali murti bought new): skin, a pink sari, gold paint, black eyes
    clay: { skin: std('#E9B08A', .85), cloth: std('#D8306A', .7), gold: std('#E2B040', .45, { metalness: .4 }), dark: std('#140C08', .5) },
  };
})();
const BRASS_SET = { skin: PMAT.brass, cloth: PMAT.brass, gold: PMAT.brassD, dark: PMAT.eye };

const scG = (g, s) => { g.scale(...s); return g; };
// beads along a curve (a garland, a necklace)
function beads3(parent, pts, n, size, mats, o = {}) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => V3(...p))), geo = new THREE.IcosahedronGeometry(size, 1), out = [];
  for (let i = 0; i < n; i++) { const p = curve.getPointAt(i / (n - 1)); out.push(mesh3(parent, geo, mats[i % mats.length], [p.x, p.y, p.z], { cast: o.cast ?? false })); }
  return out;
}
// a marigold garland hanging from two shoulder points down to a low point in front: returns a group
function garland3(parent, a, b, low, n = 70, r = .028) {
  const G = new THREE.Group(); parent.add(G);
  const mid = [(a[0] + b[0]) / 2, low[1], low[2]];
  beads3(G, [a, [lerp(a[0], mid[0], .45), lerp(a[1], low[1], .6), lerp(a[2], low[2], .8)], mid, [lerp(b[0], mid[0], .45), lerp(b[1], low[1], .6), lerp(b[2], low[2], .8)], b], n, r,
    [PMAT.mari[0], PMAT.mari[2], PMAT.mari[1], PMAT.mari[0], PMAT.mari[2], PMAT.rose]);
  return G;
}
// a lotus seat: a round base and two rows of petals turned out
function lotusSeat3(G, r, mat, o = {}) {
  mesh3(G, lathe3(smooth3([[0, 0], [r * .92, 0], [r, .03], [r * .96, .06], [r * .82, .09], [0, .09]], 3), 48), mat, [0, 0, 0]);
  const pet = scG(new THREE.SphereGeometry(1, 16, 10), [.32, 1, .14]);
  for (const [row, n, rr, y, tilt, sz] of [[0, 18, r * .96, .05, .95, r * .3], [1, 14, r * .8, .09, .55, r * .28]]) {
    for (let i = 0; i < n; i++) { const a = (i + row * .5) / n * TAU, g = new THREE.Group(); g.rotation.y = a; G.add(g);
      mesh3(g, pet, mat, [0, y + sz * .5, rr], { rot: [tilt, 0, 0], scale: [sz, sz, sz] }); }
  }
  if (o.top !== false) mesh3(G, new THREE.CylinderGeometry(r * .78, r * .8, .03, 40), mat, [0, .1, 0]);
}
// a tapering limb along points (shoulder → elbow → hand)
const limb3 = (G, pts, r0, r1, mat) => tubeP3(G, pts, [r0, r1], mat, { segs: 16, radial: 10, cast: true });
// a hand: a flattened egg, o.s its scale
const hand3 = (G, p, mat, s = [1, 1.25, .5], r = .042, rot = [0, 0, 0]) => mesh3(G, scG(new THREE.SphereGeometry(r, 14, 10), s), mat, p, { rot });

// ======================================================================================================
function ganesha3(parent, pos, scale = .3, mats = BRASS_SET) {
  const R = new THREE.Group(); R.position.set(...pos); parent.add(R);
  const G = new THREE.Group(); G.scale.setScalar(scale); R.add(G);
  const B = mats.skin, Au = mats.gold;
  lotusSeat3(G, .42, Au);
  const y0 = .11;
  // the lap: crossed legs under a dhoti, the feet showing
  mesh3(G, scG(new THREE.SphereGeometry(.3, 28, 18), [1.18, .42, .82]), B, [0, y0 + .1, .06]);
  for (const s of [-1, 1]) {
    limb3(G, [[s * .3, y0 + .1, .02], [s * .1, y0 + .1, .2], [-s * .1, y0 + .09, .26]], .075, .055, B);
    mesh3(G, scG(new THREE.SphereGeometry(.055, 14, 10), [1.3, .55, .8]), B, [-s * .14, y0 + .1, .27], { rot: [0, s * .4, 0] });
  }
  // the belly and the snake belt, the chest, the shoulders
  mesh3(G, scG(new THREE.SphereGeometry(.24, 32, 22), [1.05, .95, .95]), B, [0, y0 + .32, .07]);
  mesh3(G, new THREE.TorusGeometry(.19, .016, 8, 40), Au, [0, y0 + .22, .09], { rot: [Math.PI / 2 - .25, 0, 0], scale: [1.15, 1, 1] });
  mesh3(G, new THREE.SphereGeometry(.03, 12, 8), Au, [.0, y0 + .26, .29], { scale: [1.3, .8, .8] });   // the snake's head at the knot
  mesh3(G, scG(new THREE.SphereGeometry(.2, 28, 18), [1.15, .78, .78]), B, [0, y0 + .52, 0]);
  for (const s of [-1, 1]) mesh3(G, new THREE.SphereGeometry(.085, 16, 12), B, [s * .19, y0 + .55, 0]);
  // necklaces
  mesh3(G, new THREE.TorusGeometry(.13, .014, 8, 40, Math.PI), Au, [0, y0 + .6, .06], { rot: [-.35 + Math.PI, 0, 0] });
  mesh3(G, new THREE.TorusGeometry(.17, .01, 8, 40, Math.PI), Au, [0, y0 + .58, .05], { rot: [-.25 + Math.PI, 0, 0] });
  // ---- arms: +x is his left ----
  for (const s of [-1, 1]) {
    // the raised pair
    limb3(G, [[s * .2, y0 + .56, -.02], [s * .32, y0 + .52, -.05], [s * .35, y0 + .72, -.02]], .055, .04, B);
    hand3(G, [s * .35, y0 + .76, -.01], B, [1, 1.2, .7]);
    mesh3(G, new THREE.TorusGeometry(.045, .01, 6, 18), Au, [s * .3, y0 + .53, -.04], { rot: [0, 0, s * .6] });
  }
  // the ankusha (his right, raised): a shaft and a hook
  limb3(G, [[-.35, y0 + .66, 0], [-.35, y0 + .98, 0]], .011, .009, Au);
  limb3(G, [[-.35, y0 + .95, 0], [-.31, y0 + 1.0, 0], [-.29, y0 + .95, 0]], .01, .006, Au);
  mesh3(G, new THREE.ConeGeometry(.02, .06, 8), Au, [-.35, y0 + 1.0, 0]);
  // the pasha (his left, raised): a loop of rope
  mesh3(G, new THREE.TorusGeometry(.06, .009, 6, 24), Au, [.36, y0 + .85, .0], { rot: [0, 0, .3] });
  // lower right: abhaya, the palm turned out
  limb3(G, [[-.18, y0 + .52, .05], [-.29, y0 + .38, .1], [-.24, y0 + .44, .24]], .052, .04, B);
  hand3(G, [-.235, y0 + .5, .26], B, [1, 1.35, .45]);
  // lower left: the bowl of modaks on his knee
  limb3(G, [[.18, y0 + .52, .05], [.29, y0 + .36, .12], [.2, y0 + .32, .25]], .052, .04, B);
  hand3(G, [.19, y0 + .3, .27], B, [1.2, .7, 1]);
  const bowl = new THREE.Group(); bowl.position.set(.19, y0 + .31, .28); G.add(bowl);
  mesh3(bowl, lathe3([[0, 0], [.05, 0], [.075, .03], [.08, .045], [.072, .045], [0, .02]], 24), Au, [0, 0, 0]);
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; mesh3(bowl, lathe3([[0, 0], [.025, .005], [.025, .02], [.01, .04], [0, .05]], 12), Au, [Math.cos(a) * .03, .03, Math.sin(a) * .03]); }
  mesh3(bowl, lathe3([[0, 0], [.025, .005], [.025, .02], [.01, .04], [0, .05]], 12), Au, [0, .05, 0]);
  // ---- the head ----
  const Hd = new THREE.Group(); Hd.position.set(0, y0 + .74, .05); G.add(Hd);
  mesh3(Hd, scG(new THREE.SphereGeometry(.16, 32, 24), [1, 1, .95]), B, [0, 0, 0]);
  for (const s of [-1, 1]) mesh3(Hd, new THREE.SphereGeometry(.085, 20, 14), B, [s * .065, .085, .045]);   // the two domes of the brow
  // the ears: big flat fans, their outer edges swept back, a rim
  for (const s of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(s * .17, -.01, -.04); e.rotation.set(0, s * .5, s * -.1); Hd.add(e);
    mesh3(e, scG(new THREE.SphereGeometry(.2, 28, 18), [.85, 1.05, .12]), B, [s * .09, 0, 0]);
    mesh3(e, new THREE.TorusGeometry(.17, .012, 6, 40), Au, [s * .09, 0, .012], { scale: [.85, 1.05, 1] });
  }
  // the eyes
  for (const s of [-1, 1]) {
    mesh3(Hd, scG(new THREE.SphereGeometry(.024, 14, 10), [1.3, .6, .5]), mats.dark, [s * .062, .02, .148], { rot: [0, 0, s * -.2], cast: false });
    mesh3(Hd, scG(new THREE.SphereGeometry(.03, 14, 10), [1.4, .45, .6]), B, [s * .062, .036, .145], { rot: [0, 0, s * -.2] });
  }
  // the trunk: down from the face, curling to his left onto the bowl
  tubeP3(Hd, [[0, .0, .14], [0, -.09, .19], [.01, -.2, .22], [.05, -.3, .23], [.11, -.34, .22], [.15, -.33, .2], [.15, -.29, .19]], [.06, .022], B, { segs: 40, radial: 14, cast: true });
  for (let i = 0; i < 6; i++) { const yy = -.06 - i * .045; mesh3(Hd, new THREE.TorusGeometry(.046 - i * .004, .004, 5, 20, Math.PI), Au, [i > 3 ? (i - 3) * .03 : 0, yy, .2 + Math.min(i, 3) * .008], { rot: [Math.PI / 2 + .3, 0, 0], cast: false }); }
  // the tusks: his right whole, his left broken
  mesh3(Hd, new THREE.ConeGeometry(.016, .1, 10), PMAT.brassD, [-.06, -.08, .16], { rot: [Math.PI - .6, 0, .3] });
  mesh3(Hd, new THREE.CylinderGeometry(.012, .016, .03, 10), PMAT.brassD, [.06, -.07, .16], { rot: [Math.PI - .6, 0, -.3] });
  // the crown: tiered, a jewel at the front
  mesh3(Hd, lathe3([[0, 0], [.12, 0], [.13, .025], [.11, .05], [.105, .1], [.09, .12], [.085, .17], [.065, .19], [.06, .24], [.04, .26], [.036, .3], [.02, .32], [.03, .34], [0, .4]], 48), Au, [0, .1, -.01]);
  mesh3(Hd, new THREE.SphereGeometry(.022, 12, 8), PMAT.ruby, [0, .16, .12], { scale: [1, 1.2, .6] });
  const tilak = mesh3(Hd, scG(new THREE.SphereGeometry(.018, 12, 8), [.8, 1.6, .4]), PMAT.red, [0, .105, .135], { cast: false });
  // the mouse by the lotus, looking up at him
  const Ms = new THREE.Group(); Ms.position.set(.34, 0, .34); Ms.rotation.y = -.5; G.add(Ms);
  mesh3(Ms, scG(new THREE.SphereGeometry(.07, 16, 12), [1, .8, 1.4]), Au, [0, .06, 0]);
  mesh3(Ms, new THREE.ConeGeometry(.045, .1, 12), Au, [0, .09, .1], { rot: [Math.PI / 2 - .3, 0, 0] });
  for (const s of [-1, 1]) mesh3(Ms, scG(new THREE.SphereGeometry(.025, 10, 8), [1, 1, .3]), Au, [s * .035, .13, .06]);
  tubeP3(Ms, [[0, .05, -.09], [.03, .02, -.16], [.08, .02, -.2]], .008, Au, { segs: 8 });
  // ---- the puja's additions ----
  // new clothes: a yellow dhoti over the lap with a gold border, a red shawl round the shoulders
  const dress = new THREE.Group(); G.add(dress);
  mesh3(dress, new THREE.SphereGeometry(.315, 28, 16, 0, TAU, 0, Math.PI * .55), PMAT.silkY, [0, y0 + .08, .06], { scale: [1.18, .5, .86] });
  mesh3(dress, new THREE.TorusGeometry(.315 * Math.sin(Math.PI * .55), .01, 6, 48), PMAT.zari, [0, y0 + .08 - .315 * .5 * Math.cos(Math.PI * .55) * -1, .06], { rot: [Math.PI / 2, 0, 0], scale: [1.18, .86, 1] });
  tubeP3(dress, [[-.27, y0 + .48, -.02], [-.2, y0 + .62, .02], [0, y0 + .64, .1], [.2, y0 + .62, .02], [.27, y0 + .48, -.02]], .035, PMAT.silkR, { segs: 30 });
  for (const s of [-1, 1]) tubeP3(dress, [[s * .27, y0 + .5, -.02], [s * .3, y0 + .32, .02], [s * .3, y0 + .16, .06]], [.035, .03], PMAT.silkR, { segs: 12 });
  const mala = garland3(G, [-.17, y0 + .64, .08], [.17, y0 + .64, .08], [0, y0 + .2, .34], 70, .024);
  const k = (o = {}) => { dress.visible = (o.dress ?? 0) > .01; dress.scale.setScalar(lerp(.85, 1, o.dress ?? 0)); mala.visible = (o.mala ?? 0) > .01; tilak.visible = (o.tilak ?? 0) > .01; };
  k({});
  return { root: R, group: G, head: Hd, tilak, dress, mala, k, top: y0 + 1.25, face: [0, y0 + .74, .2] };
}

// ======================================================================================================
function devi3(parent, pos, scale = .3, o = {}) {
  const mats = o.mats || BRASS_SET, kind = o.kind || 'lakshmi', isS = kind === 'saraswati';
  const R = new THREE.Group(); R.position.set(...pos); parent.add(R);
  const G = new THREE.Group(); G.scale.setScalar(scale); R.add(G);
  const B = mats.skin, Au = mats.gold, C = mats.cloth;
  lotusSeat3(G, .4, mats.seat || Au);
  const y0 = .11;
  // the sari: a flared seat over the folded legs, the pleats, a foot showing on her right
  const skirt = lathe3(smooth3([[0, y0], [.34, y0], [.36, y0 + .04], [.33, y0 + .1], [.24, y0 + .15], [.15, y0 + .18], [.125, y0 + .21], [0, y0 + .21]], 4), 48);
  const D = .19, U = new THREE.Group(); U.position.y = -D; G.add(U);
  mesh3(G, skirt, C, [0, 0, .02], { scale: [1, 1, .82] });
  mesh3(G, new THREE.TorusGeometry(.35, .012, 6, 48), Au, [0, y0 + .02, .02], { rot: [Math.PI / 2, 0, 0], scale: [1, .82, 1] });
  mesh3(G, scG(new THREE.SphereGeometry(.05, 14, 10), [.9, .5, 1.4]), B, [-.16, y0 + .03, .3]);
  // the torso, the waist band, the chest drapes
  const tor = lathe3(smooth3([[0, y0 + .36], [.13, y0 + .36], [.115, y0 + .43], [.125, y0 + .5], [.15, y0 + .57], [.15, y0 + .62], [.11, y0 + .66], [.05, y0 + .68], [0, y0 + .68]], 4), 40);
  mesh3(U, tor, B, [0, 0, 0], { scale: [1, 1, .74] });
  mesh3(U, new THREE.TorusGeometry(.12, .012, 6, 36), Au, [0, y0 + .38, 0], { rot: [Math.PI / 2, 0, 0], scale: [1, .76, 1] });
  // the pallu across the chest from her left shoulder
  tubeP3(U, [[.13, y0 + .64, -.02], [.07, y0 + .58, .1], [-.04, y0 + .48, .11], [-.13, y0 + .4, .07]], .03, C, { segs: 16 });
  // necklaces
  mesh3(U, new THREE.TorusGeometry(.085, .011, 6, 30, Math.PI), Au, [0, y0 + .67, .04], { rot: [-.6 + Math.PI, 0, 0] });
  mesh3(U, new THREE.TorusGeometry(.12, .008, 6, 30, Math.PI), Au, [0, y0 + .66, .03], { rot: [-.35 + Math.PI, 0, 0] });
  mesh3(U, new THREE.SphereGeometry(.018, 10, 8), PMAT.ruby, [0, y0 + .55, .11]);
  // neck and head
  mesh3(U, new THREE.CylinderGeometry(.035, .045, .07, 14), B, [0, y0 + .7, 0]);
  const Hd = new THREE.Group(); Hd.position.set(0, y0 + .8, .01); U.add(Hd);
  const hg = new THREE.SphereGeometry(.075, 32, 24), hp = hg.attributes.position;
  for (let i = 0; i < hp.count; i++) { let x = hp.getX(i), y = hp.getY(i) * 1.22, z = hp.getZ(i); const lo = clamp(-y / .09), kk = 1 - .32 * lo * lo; x *= .92 * kk; z *= .95 * kk; hp.setXYZ(i, x, y, z); }
  hg.computeVertexNormals(); mesh3(Hd, hg, B, [0, 0, 0]);
  mesh3(Hd, new THREE.SphereGeometry(.07, 20, 14), B, [0, .02, -.035], { scale: [1.02, 1.05, 1] });            // the back of the head, the hair
  mesh3(Hd, new THREE.SphereGeometry(.045, 16, 12), B, [0, .0, -.1]);                                       // the bun
  for (const s of [-1, 1]) {
    mesh3(Hd, scG(new THREE.SphereGeometry(.018, 14, 10), [1.4, .5, .5]), mats.dark, [s * .027, .012, .066], { rot: [0, 0, s * -.15], cast: false });
    mesh3(Hd, scG(new THREE.SphereGeometry(.02, 14, 10), [1.4, .42, .6]), B, [s * .027, .022, .064], { rot: [0, 0, s * -.15] });
    mesh3(Hd, new THREE.TorusGeometry(.016, .005, 6, 16), Au, [s * .07, -.045, .0], { rot: [0, Math.PI / 2, 0] });
  }
  mesh3(Hd, new THREE.SphereGeometry(.01, 10, 8), B, [0, -.012, .08], { scale: [1, 1.4, 1] });                // the nose
  mesh3(Hd, scG(new THREE.SphereGeometry(.014, 12, 8), [1.2, .45, .6]), mats.lips || (mats === BRASS_SET ? PMAT.brassD : PMAT.red), [0, -.045, .068]);   // the lips
  const tilak = mesh3(Hd, new THREE.SphereGeometry(.009, 10, 8), PMAT.red, [0, .05, .074], { cast: false, scale: [1, 1, .5] });
  // the crown
  const kir = isS || kind === 'gauri'
    ? lathe3([[0, 0], [.082, 0], [.09, .02], [.08, .04], [.07, .08], [.05, .12], [.03, .15], [0, .18]], 40)
    : lathe3([[0, 0], [.085, 0], [.095, .02], [.085, .04], [.08, .08], [.068, .11], [.065, .15], [.05, .18], [.045, .22], [.028, .25], [.034, .27], [0, .32]], 48);
  mesh3(Hd, kir, Au, [0, .06, -.01]);
  mesh3(Hd, scG(new THREE.SphereGeometry(.05, 16, 10), [1, 1.1, .15]), Au, [0, .11, .065]);
  mesh3(Hd, new THREE.SphereGeometry(.014, 10, 8), PMAT.ruby, [0, .11, .074], { scale: [1, 1.2, .6] });
  // the arch behind her: a gold ring of flames on two posts
  const P = new THREE.Group(); P.position.set(0, 0, -.16); U.add(P);
  mesh3(P, new THREE.TorusGeometry(.4, .018, 8, 64, Math.PI), Au, [0, y0 + .62, 0]);
  for (const s of [-1, 1]) mesh3(P, new THREE.CylinderGeometry(.018, .022, y0 + .62 - .08, 10), Au, [s * .4, (y0 + .62 + .08) / 2, 0]);
  const tip = new THREE.ConeGeometry(.02, .07, 8);
  for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI; mesh3(P, tip, Au, [Math.cos(a) * .44, y0 + .62 + Math.sin(a) * .44, 0], { rot: [0, 0, a - Math.PI / 2] }); }
  mesh3(P, new THREE.SphereGeometry(.04, 14, 10), Au, [0, y0 + 1.08, 0]);
  // a little lotus (held, or lying in front)
  const lotusFlower = (par, p, s = 1, m = Au, m2 = Au) => { const L = new THREE.Group(); L.position.set(...p); L.scale.setScalar(s); par.add(L);
    const pt = scG(new THREE.SphereGeometry(1, 12, 8), [.35, 1, .16]);
    for (const [n, tilt, rr, sz, mm] of [[8, .9, .03, .045, m2], [6, .35, .015, .04, m]]) for (let i = 0; i < n; i++) { const g = new THREE.Group(); g.rotation.y = i / n * TAU + tilt; L.add(g); mesh3(g, pt, mm, [0, sz * .7, rr], { rot: [tilt, 0, 0], scale: sz }); }
    return L; };
  // ---- arms: +x is her left ----
  for (const s of [-1, 1]) {
    limb3(U, [[s * .13, y0 + .63, -.03], [s * .25, y0 + .58, -.05], [s * .27, y0 + .74, -.03]], .036, .026, B);
    hand3(U, [s * .27, y0 + .78, -.02], B, [1, 1.25, .6], .03);
    mesh3(U, new THREE.TorusGeometry(.03, .007, 6, 16), Au, [s * .23, y0 + .58, -.05], { rot: [0, 0, s * .7] });
  }
  const lower = (side, toward, h = [1, 1.3, .45], hy = .37) => {   // a lower arm to the lap (side -1 her right), its hand
    limb3(U, [[side * .12, y0 + .6, .02], [side * .2, y0 + .45, .07], [side * toward, y0 + .4, .2]], .034, .026, B);
    return hand3(U, [side * toward, y0 + hy, .22], B, h, .03, side < 0 ? [.4, 0, 0] : [0, 0, 0]);
  };
  const shaft = (x, y0s, y1s, r = .009) => limb3(U, [[x, y0 + y0s, -.015], [x, y0 + y1s, -.015]], r, r * .8, Au);
  if (kind === 'lakshmi') {
    // Lakshmi: lotuses in the raised hands, the lower right pouring coins, the lower left holding a little pot
    for (const s of [-1, 1]) lotusFlower(U, [s * .27, y0 + .82, -.02], 1.3);
    lower(-1, .17);
    limb3(U, [[.12, y0 + .6, .02], [.2, y0 + .45, .07], [.15, y0 + .4, .2]], .034, .026, B);
    hand3(U, [.15, y0 + .38, .22], B, [1.1, .7, 1], .03);
    mesh3(U, lathe3(smooth3([[0, 0], [.025, 0], [.04, .025], [.035, .05], [.018, .06], [.024, .07], [0, .07]], 3), 20), Au, [.15, y0 + .4, .23]);
  } else if (kind === 'gauri') {
    // Gauri: the trishul in the raised right hand, a lotus in the raised left; abhaya and varada below
    shaft(-.27, .5, 1.12, .01);
    const tri = new THREE.Group(); tri.position.set(-.27, y0 + 1.12, -.015); U.add(tri);
    mesh3(tri, new THREE.ConeGeometry(.018, .14, 10), Au, [0, .07, 0]);
    for (const s of [-1, 1]) tubeP3(tri, [[0, -.01, 0], [s * .05, .0, 0], [s * .065, .05, 0], [s * .06, .1, 0]], [.01, .004], Au, { segs: 12 });
    mesh3(tri, new THREE.TorusGeometry(.03, .008, 6, 16), Au, [0, -.02, 0], { rot: [Math.PI / 2, 0, 0] });
    mesh3(tri, new THREE.SphereGeometry(.02, 10, 8), Au, [0, -.06, 0], { scale: [1, .6, 1] });
    lotusFlower(U, [.27, y0 + .82, -.02], 1.3);
    lower(-1, .17, [1, 1.35, .45], .39);
    limb3(U, [[.12, y0 + .6, .02], [.2, y0 + .42, .1], [.2, y0 + .3, .2]], .034, .026, B);
    hand3(U, [.2, y0 + .27, .22], B, [1, 1.35, .45], .03, [-.3, 0, 0]);
  } else if (kind === 'maha') {
    // the primordial Mahalakshmi (Pradhanika Rahasya 5): the mace raised in her right, the shield in her left; the
    // citron (matulinga) in the lower right, the cup in the lower left
    shaft(-.27, .62, 1.0, .012);
    mesh3(U, new THREE.SphereGeometry(.05, 16, 12), Au, [-.27, y0 + 1.03, -.015]);
    mesh3(U, new THREE.TorusGeometry(.05, .008, 6, 20), Au, [-.27, y0 + 1.0, -.015], { rot: [Math.PI / 2, 0, 0] });
    mesh3(U, new THREE.CylinderGeometry(.075, .075, .016, 28), Au, [.29, y0 + .8, .0], { rot: [Math.PI / 2, 0, 0] });
    mesh3(U, new THREE.SphereGeometry(.02, 10, 8), PMAT.ruby, [.29, y0 + .8, .012]);
    lower(-1, .17); mesh3(U, new THREE.SphereGeometry(.03, 14, 10), Au, [-.17, y0 + .42, .25]);
    limb3(U, [[.12, y0 + .6, .02], [.2, y0 + .45, .07], [.15, y0 + .4, .2]], .034, .026, B);
    hand3(U, [.15, y0 + .38, .22], B, [1.1, .7, 1], .03);
    mesh3(U, lathe3([[0, 0], [.02, 0], [.04, .03], [.045, .045], [.038, .045], [0, .015]], 20), Au, [.15, y0 + .4, .23]);
  } else if (kind === 'kali') {
    // Mahakali (Pradhanika Rahasya 8-9): the sword raised in her right, the shield in her left, the cup below; abhaya
    const sw = new THREE.Group(); sw.position.set(-.27, y0 + .8, -.015); sw.rotation.z = .25; U.add(sw);
    mesh3(sw, new THREE.BoxGeometry(.03, .012, .012), Au, [0, 0, 0]);
    const bl = new THREE.Shape(); bl.moveTo(-.012, 0); bl.lineTo(.012, 0); bl.quadraticCurveTo(.03, .2, .0, .34); bl.quadraticCurveTo(-.006, .2, -.012, 0);
    mesh3(sw, new THREE.ExtrudeGeometry(bl, { depth: .006, bevelEnabled: false }), Au, [0, .01, -.003]);
    mesh3(U, new THREE.CylinderGeometry(.075, .075, .016, 28), Au, [.29, y0 + .8, .0], { rot: [Math.PI / 2, 0, 0] });
    lower(-1, .17, [1, 1.35, .45], .39);
    limb3(U, [[.12, y0 + .6, .02], [.2, y0 + .45, .07], [.15, y0 + .4, .2]], .034, .026, B);
    hand3(U, [.15, y0 + .38, .22], B, [1.1, .7, 1], .03);
    mesh3(U, lathe3([[0, 0], [.02, 0], [.04, .03], [.045, .045], [.038, .045], [0, .015]], 20), Au, [.15, y0 + .4, .23]);
  } else {
    // Saraswati: the veena across her lap (its big gourd at her right knee, the neck over her left shoulder),
    // her right hand on the strings, her left on the neck; a rosary and a book in the raised hands
    const a = [-.21, y0 + .4, .24], b = [.24, y0 + .9, .02];
    mesh3(U, new THREE.SphereGeometry(.1, 20, 14), Au, a, { scale: [1, .9, .8] });
    limb3(U, [a, [lerp(a[0], b[0], .5), lerp(a[1], b[1], .5), lerp(a[2], b[2], .5) + .02], b], .022, .016, Au);
    mesh3(U, new THREE.SphereGeometry(.055, 14, 10), Au, [b[0] - .03, b[1] - .07, b[2] - .02]);
    for (let i = 0; i < 3; i++) mesh3(U, new THREE.CylinderGeometry(.006, .006, .05, 6), Au, [b[0] + .01, b[1] - .02 - i * .035, b[2] + .02], { rot: [0, 0, Math.PI / 2] });
    mesh3(U, scG(new THREE.SphereGeometry(.08, 16, 10), [1.1, 1, .25]), Au, [b[0] + .03, b[1] + .04, b[2]], { rot: [0, 0, -.6] });   // the carved head of the neck
    limb3(U, [[-.12, y0 + .6, .02], [-.2, y0 + .48, .1], [-.08, y0 + .5, .26]], .034, .026, B);
    hand3(U, [-.06, y0 + .5, .27], B, [1.2, .9, .6], .03);
    limb3(U, [[.12, y0 + .6, .02], [.2, y0 + .52, .1], [.13, y0 + .69, .12]], .034, .026, B);
    hand3(U, [.12, y0 + .71, .12], B, [1.1, .9, .7], .03);
    mesh3(U, new THREE.TorusGeometry(.04, .006, 6, 24), Au, [-.27, y0 + .84, -.01]);   // the rosary
    block3(U, .07, .1, .025, Au, [.28, y0 + .79, -.01]);                                      // the book
  }
  // ---- the puja's additions: new clothes (a silk sari over the seat, a chunri over the head and shoulders) ----
  const dress = new THREE.Group(); G.add(dress);
  const silk = isS ? PMAT.silkW : PMAT.silkR;
  mesh3(dress, lathe3(smooth3([[.355, y0 - .01], [.375, y0 + .04], [.345, y0 + .11], [.25, y0 + .16], [.16, y0 + .19], [.135, y0 + .22]], 4), 48), silk, [0, 0, .02], { scale: [1, 1, .82] });
  mesh3(dress, new THREE.TorusGeometry(.365, .012, 6, 48), PMAT.zari, [0, y0 + .01, .02], { rot: [Math.PI / 2, 0, 0], scale: [1, .82, 1] });
  const veil = new THREE.LatheGeometry([[.03, .14], [.075, .11], [.1, .05], [.11, -.03], [.13, -.1], [.17, -.14], [.2, -.16]].map(([r, y]) => new THREE.Vector2(r, y)), 32, Math.PI * .3, Math.PI * 1.4);
  const dU = new THREE.Group(); dU.position.y = -D; dress.add(dU);
  const vm = mesh3(dU, veil, isS ? PMAT.silkW : PMAT.silkR, [0, y0 + .8, -.01]);
  
  const mala = garland3(U, [-.11, y0 + .68, .05], [.11, y0 + .68, .05], [0, y0 + .36, .22], 50, .02);
  const lotus = lotusFlower(R, [0, .005, .2], .9 * scale / .3, PMAT.lotus, PMAT.lotusD);
  const k = (o2 = {}) => { dress.visible = (o2.dress ?? 0) > .01; dress.scale.setScalar(lerp(.9, 1, o2.dress ?? 0)); mala.visible = (o2.mala ?? 0) > .01; tilak.visible = (o2.tilak ?? 0) > .01; lotus.visible = (o2.lotus ?? 0) > .01; lotus.scale.setScalar(.9 * scale / .3 * clamp(o2.lotus ?? 0)); };
  k({});
  // the coins' hand (Lakshmi's lower right), in the root group's units, for the falling coins
  const coinAt = [-.17 * scale, (y0 + .33 - D) * scale, .23 * scale];
  return { root: R, group: G, head: Hd, tilak, dress, mala, lotus, k, coinAt, top: y0 + 1.1 - D, face: [0, y0 + .8 - D, .1] };
}
