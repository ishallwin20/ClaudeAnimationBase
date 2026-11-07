// puja_mandir.js: the 3D sets of "Lakshmi Puja, step by step" (ad 83), built once at load:
//   MANDIR  a home's puja corner at night: a cream lime wall with a marigold toran and a kumkum swastik, a teak chowki
//           (its red cloth unrolls), the three brass murtis (as you face them: Saraswati, Lakshmi, Ganesha), the kalash
//           built up on its rice (water, a coin, supari, rice, five mango leaves, the coconut in red cloth, the swastik, the
//           mauli), a brass samai, diyas, the puja thali (roli, haldi, akshat, flowers, incense), a bell, bhog (kheel-
//           batashe, laddoos), the asana, the panchapatra and its spoon for achaman, the aarti lamp, a shower of petals.
//           A side bench (x 3–5) is the washing place: a brass Ganesha in a tray under a pouring lota, a painted clay
//           Lakshmi and a cloth.
//   HVS     a small home havan: the kund and its fire (cine3d_havan.js) on a dark floor.
// Metres; y up; the chowki's centre at the origin, the camera at +z (the devotee).

const CH = { w: 1.24, d: .62, h: .34 };                      // the chowki: width, depth, top
const MZ = -.06, MX = [-.39, 0, .39];                         // the murtis: Saraswati, Lakshmi, Ganesha (as you face them)

const MANDIR = (() => {
  const S = new THREE.Scene(); S.background = new THREE.Color('#0C0806');
  const hemi = new THREE.HemisphereLight('#FFE2C0', '#3A2414', .35); S.add(hemi);
  // the key: a warm lamp up front-left (a ceiling bulb's spill), soft shadows on the wall
  const key = new THREE.SpotLight('#FFD2A0', 22, 9, .7, .6, 1.4); key.position.set(-1.2, 2.4, 2.2); key.target.position.set(0, .4, -.2);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.radius = 4; S.add(key, key.target);
  const rim = new THREE.DirectionalLight('#FFB070', .8); rim.position.set(1.5, 2, -1); S.add(rim);
  // the floor: polished stone tiles; the wall: cream lime
  mesh3(S, new THREE.PlaneGeometry(9, 9), stone3({ col: '#9A8C7C', rows: 6, cols: 6, seed: 31, rep: [7, 7], mottle: .9, bumpK: 1 }), [1.5, 0, 1.5], { rot: [-Math.PI / 2, 0, 0], cast: false });
  mesh3(S, new THREE.PlaneGeometry(9, 3.4), plaster3('#EAD2A8', [3, 1.2]), [1.5, 1.7, -.72], { cast: false });
  // a geru dado and a white line at the foot of the wall
  mesh3(S, new THREE.PlaneGeometry(9, .3), plaster3('#9A3A22', [3, .2]), [1.5, .15, -.715], { cast: false });
  mesh3(S, new THREE.PlaneGeometry(9, .03), std3('#F4ECDC', .9), [1.5, .31, -.714], { cast: false });
  // the kumkum swastik painted on the wall above the murtis, dots in its arms
  const swTex = tex3('wallSwastik', 256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.strokeStyle = 'rgba(196,20,28,.92)'; g.lineWidth = 16; g.lineCap = 'round';
    g.beginPath(); g.moveTo(128, 40); g.lineTo(128, 216); g.moveTo(40, 128); g.lineTo(216, 128);
    g.moveTo(128, 40); g.lineTo(208, 40); g.moveTo(216, 128); g.lineTo(216, 208); g.moveTo(128, 216); g.lineTo(48, 216); g.moveTo(40, 128); g.lineTo(40, 48); g.stroke();
    g.fillStyle = 'rgba(196,20,28,.92)'; for (const [x, y] of [[84, 84], [172, 84], [84, 172], [172, 172]]) { g.beginPath(); g.arc(x, y, 12, 0, TAU); g.fill(); }
  });
  mesh3(S, new THREE.PlaneGeometry(.26, .26), new THREE.MeshStandardMaterial({ map: swTex, transparent: true, roughness: .9, depthWrite: false }), [0, 1.18, -.712], { cast: false });
  // the marigold toran along the wall
  const TOR = toran3(S, { kind: 'marigold', w: 1.9, y: 1.62, z: -.66, sag: .05 });
  // ---- the chowki and its cloth ----
  const wood = pbr3('darkwood', { rep: [1, .5], tint: '#9A6440', rough: .7 });
  block3(S, CH.w, .045, CH.d, wood, [0, CH.h - .045, 0]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) block3(S, .05, CH.h - .045, .05, wood, [sx * (CH.w / 2 - .05), 0, sz * (CH.d / 2 - .05)]);
  block3(S, CH.w - .1, .05, .02, wood, [0, CH.h - .1, CH.d / 2 - .04]);
  const clothTex = tex3('redCloth', 512, 512, (g, w, h) => {
    g.fillStyle = '#B4121C'; g.fillRect(0, 0, w, h);
    const r = lcg(5); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(${r() < .5 ? '60,0,0' : '255,80,60'},${.05 + r() * .05})`; g.fillRect(r() * w, r() * h, 2, 2); }
    g.fillStyle = '#E8B040'; for (const y of [10, h - 30]) g.fillRect(0, y, w, 20); for (const x of [10, w - 30]) g.fillRect(x, 0, 20, h);
    g.fillStyle = 'rgba(232,176,64,.55)'; for (let x = 40; x < w - 40; x += 32) for (let y = 40; y < h - 40; y += 32) { g.beginPath(); g.arc(x + (y / 32 % 2) * 16, y, 3, 0, TAU); g.fill(); }
  });
  const clothM = new THREE.MeshStandardMaterial({ map: clothTex, roughness: .85, side: THREE.DoubleSide });
  const topG = new THREE.Group(); topG.position.set(0, CH.h + .002, -CH.d / 2 - .01); S.add(topG);
  mesh3(topG, new THREE.PlaneGeometry(CH.w + .04, CH.d + .02), clothM, [0, 0, (CH.d + .02) / 2], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const dropG = new THREE.Group(); dropG.position.set(0, CH.h + .002, CH.d / 2 + .012); S.add(dropG);
  const dropH = .2; mesh3(dropG, new THREE.PlaneGeometry(CH.w + .04, dropH), clothM, [0, -dropH / 2, 0], { cast: false });
  // ---- the murtis ----
  const SAR = devi3(S, [MX[0], CH.h + .004, MZ], .3, { kind: 'saraswati' });
  const LAK = devi3(S, [MX[1], CH.h + .004, MZ], .33, { kind: 'lakshmi' });
  const GAN = ganesha3(S, [MX[2], CH.h + .004, MZ], .3);
  const MURTIS = [SAR, LAK, GAN];
  // flowers on the chowki round the murtis (step 4): marigold heaps, roses, a few leaves
  const FL = new THREE.Group(); S.add(FL);
  const fr = lcg(19), flG = new THREE.IcosahedronGeometry(.022, 1), flS = new THREE.IcosahedronGeometry(.013, 1);
  for (let i = 0; i < 70; i++) { const x = (fr() - .5) * (CH.w - .1), z = MZ + .12 + fr() * .16; if (Math.abs(x) < .1 && z < MZ + .22) continue;
    const r = fr(); mesh3(FL, flS, r < .6 ? PMAT.mari[i % 3] : r < .82 ? PMAT.rose : PMAT.leaf, [x, CH.h + .01, z], { scale: r > .82 ? [1.4, .3, .8] : [1, .7, 1], rot: [0, fr() * 3, 0] }); }
  // bhog (step 9): kheel-batashe in a brass bowl before Lakshmi, laddoos before Ganesha, white pedas before Saraswati
  const BH = new THREE.Group(); S.add(BH);
  const bowl = (x, z, r = .07) => mesh3(BH, lathe3(smooth3([[0, 0], [r * .6, 0], [r, r * .5], [r * 1.05, r * .62], [r * .95, r * .6], [0, r * .25]], 3), 32), PMAT.brass, [x, CH.h, z]);
  bowl(-.13, .2); bowl(.25, .2, .065); bowl(-.48, .2, .06);
  const br = lcg(23);
  for (let i = 0; i < 40; i++) { const a = br() * TAU, rr = br() * .055; mesh3(BH, new THREE.IcosahedronGeometry(.009 + br() * .005, 0), std3('#F6EEDC', .9), [-.13 + Math.cos(a) * rr, CH.h + .045 + br() * .015, .2 + Math.sin(a) * rr], { cast: false }); }
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; mesh3(BH, scG(new THREE.SphereGeometry(.016, 12, 8), [1, .7, 1]), std3('#FFFFFF', .4, { emissive: '#3A3A3A', emissiveIntensity: .3 }), [-.13 + Math.cos(a) * .035, CH.h + .065, .2 + Math.sin(a) * .035], { cast: false }); }
  for (const [x, z, y] of [[.23, .19, 0], [.27, .21, 0], [.25, .17, 0], [.25, .2, .03]]) mesh3(BH, new THREE.SphereGeometry(.024, 14, 10), std3('#F0A030', .85, { bumpMap: stoneTex({ seed: 3, rows: 1, cols: 1, speck: 2 }).bump, bumpScale: 4 }), [x, CH.h + .05 + y, z]);
  for (const [x, z] of [[-.5, .19], [-.46, .21], [-.48, .17]]) mesh3(BH, new THREE.CylinderGeometry(.02, .02, .012, 16), std3('#F2E6CC', .9), [x, CH.h + .04, z]);
  // a ghee diya on the chowki in front of Lakshmi (step 9, the lamp)
  const lampC = diya3(S, [.06, CH.h, .25], { light: true, power: .8, range: 2.5 });
  // ---- the kalash on its rice, to the front right on the floor ----
  const KX = .7, KZ = .36, KS = .6;
  const KG = new THREE.Group(); KG.position.set(KX, 0, KZ); S.add(KG);
  mesh3(KG, lathe3([[0, 0], [.2, 0], [.24, .015], [.25, .025], [.23, .022], [0, .01]], 40), PMAT.brass, [0, 0, 0]);
  const rice = mesh3(KG, new THREE.SphereGeometry(.16, 24, 10, 0, TAU, 0, Math.PI / 2), std3('#EFE8D8', .95, { bumpMap: stoneTex({ seed: 30, rows: 1, cols: 1, speck: 2.5 }).bump.rep(5, 5), bumpScale: 5 }), [0, .012, 0], { scale: [1, .3, 1] });
  const K = new THREE.Group(); K.position.set(0, .055, 0); K.scale.setScalar(KS); KG.add(K);
  const cu = new THREE.MeshStandardMaterial({ color: '#C47848', metalness: .7, roughness: .3 });
  mesh3(K, lathe3(smooth3([[0, 0], [.1, 0], [.17, .08], [.19, .2], [.15, .3], [.08, .35], [.075, .38], [.11, .41], [.1, .415], [.07, .39], [.07, .36], [0, .36]], 4), 48), cu, [0, 0, 0]);
  const water = mesh3(K, new THREE.CircleGeometry(.068, 24), new THREE.MeshStandardMaterial({ color: '#8AB8D0', roughness: .05, metalness: .2, emissive: '#1A3A4A', emissiveIntensity: .5 }), [0, .37, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const coin = mesh3(K, new THREE.CylinderGeometry(.03, .03, .006, 20), metal3('#E6C060', .25), [0, .5, 0]);
  const supari = mesh3(K, new THREE.SphereGeometry(.022, 12, 8), std3('#8A5A32', .8), [0, .5, 0], { scale: [1, .8, 1] });
  const grains = []; for (let i = 0; i < 8; i++) grains.push(mesh3(K, scG(new THREE.SphereGeometry(.006, 6, 4), [1, 1, 2.2]), std3('#F4EEDC', .8), [0, .5, 0], { cast: false }));
  const leaves = []; for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3, lf = new THREE.Group(); lf.position.set(Math.cos(a) * .07, .41, Math.sin(a) * .07); lf.rotation.set(0, -a + Math.PI / 2, 0); K.add(lf);
    const m = mesh3(lf, LEAF3.geo, LEAF3.mats[i % 2], [0, 0, 0], { scale: 1.1 }); m.rotation.set(-2.25, 0, 0); leaves.push(lf); }
  const cocoG = new THREE.Group(); K.add(cocoG);
  mesh3(cocoG, new THREE.SphereGeometry(.1, 20, 14), new THREE.MeshStandardMaterial({ color: '#6A4426', roughness: 1, bumpMap: stoneTex({ seed: 4, rows: 8, cols: 1, speck: 1.5 }).bump, bumpScale: 3 }), [0, .5, 0], { scale: [1, 1.2, 1] });
  mesh3(cocoG, new THREE.SphereGeometry(.104, 20, 14, 0, TAU, Math.PI * .45, Math.PI * .55), PMAT.silkR, [0, .5, 0], { scale: [1, 1.2, 1] });   // the red cloth round its lower half
  mesh3(cocoG, new THREE.ConeGeometry(.03, .08, 8), std3('#8A6A3A', 1), [0, .64, 0]);
  const swK = mesh3(K, new THREE.PlaneGeometry(.12, .12), new THREE.MeshStandardMaterial({ map: swTex, transparent: true, roughness: .8, depthWrite: false }), [0, .21, .192], { cast: false });
  const mauli = new THREE.Group(); K.add(mauli);
  for (let i = 0; i < 3; i++) mesh3(mauli, new THREE.TorusGeometry(.08 + i * .002, .006, 6, 40), std3(i === 1 ? '#F2C21E' : '#C21E28', .8), [0, .355 + i * .011, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  // ---- the samai (a tall brass lamp) front left, diyas on the floor ----
  const SX = -.72, SZ = .3;
  mesh3(S, lathe3(smooth3([[0, 0], [.1, 0], [.1, .02], [.04, .05], [.02, .1], [.02, .36], [.045, .39], [.02, .41], [.08, .44], [.1, .47], [0, .46]], 3), 32), PMAT.brass, [SX, 0, SZ]);
  mesh3(S, new THREE.ConeGeometry(.035, .12, 12), PMAT.brass, [SX, .53, SZ]);
  const samai = [0, 1, 2, 3, 4].map(i => { const a = i / 5 * TAU; return flame3(S, [SX + Math.cos(a) * .075, .475, SZ + Math.sin(a) * .075], .55, { light: i === 0, power: 1.4, range: 3.5, seed: i * 2.3 }); });
  const DY = [[-.46, .62], [-.26, .7], [.26, .7], [.46, .62], [-.98, .1], [.98, .1], [-1.2, .5], [1.2, .5]];
  const diyas = DY.map(([x, z], i) => diya3(S, [x, 0, z], { light: i < 4 && i % 3 === 0, power: 1.4, range: 3 }));
  // ---- the thali on the floor before the chowki, the bell, the incense ----
  const TX = 0, TZ = .62, TH = new THREE.Group(); TH.position.set(TX, 0, TZ); S.add(TH);
  mesh3(TH, lathe3([[0, 0], [.13, 0], [.16, .015], [.17, .025], [.16, .022], [0, .01]], 48), PMAT.brass, [0, 0, 0]);
  const katori = (x, z, col) => { mesh3(TH, lathe3(smooth3([[0, 0], [.018, 0], [.032, .02], [.034, .03], [.03, .03], [0, .012]], 3), 24), PMAT.brass, [x, .012, z]); mesh3(TH, new THREE.CircleGeometry(.029, 20), std3(col, .9), [x, .036, z], { rot: [-Math.PI / 2, 0, 0], cast: false }); };
  katori(-.07, -.05, '#C8141C'); katori(.0, -.08, '#E8B020'); katori(.07, -.05, '#F2ECDC');
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; mesh3(TH, flG, PMAT.mari[i % 3], [Math.cos(a) * .115, .03, .03 + Math.sin(a) * .04], { cast: false }); }
  const thaliDiya = diya3(TH, [.0, .012, .06], { light: false });
  // incense: a holder and two sticks, smoke rising
  mesh3(TH, new THREE.CylinderGeometry(.012, .016, .02, 10), PMAT.brass, [.1, .012, .05]);
  const sticks = [[.1, .05, .2], [.1, .05, -.2]].map(([x, z, r]) => mesh3(TH, new THREE.CylinderGeometry(.0018, .0018, .22, 5), std3('#3A2418', .9), [x + Math.sin(r) * .11, .14, z], { rot: [0, 0, -r], cast: false }));
  const tips = sticks.map((s, i) => [TX + .1 + Math.sin(i ? -.2 : .2) * .22, .25, TZ + .05]);
  const embers = tips.map(p => glow3(S, p, .03, '#FF5A20', 0));
  const SMK = []; for (let i = 0; i < 26; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex3(), color: '#B8B0A8', transparent: true, depthWrite: false, opacity: 0 })); S.add(s); SMK.push(s); }
  // the bell
  const bell = new THREE.Group(); bell.position.set(.27, 0, .7); S.add(bell);
  mesh3(bell, lathe3(smooth3([[0, .02], [.03, .02], [.045, .0], [.05, .005], [.04, .04], [.03, .08], [.02, .1], [.008, .11], [.01, .17], [.02, .19], [0, .21]], 3), 28), PMAT.brass, [0, 0, 0]);
  // ---- the asana, the panchapatra with its spoon, the sankalp plate ----
  const asTex = tex3('asana', 256, 256, (g, w, h) => { g.fillStyle = '#7A1620'; g.fillRect(0, 0, w, h); g.strokeStyle = '#E8B040'; g.lineWidth = 8; g.strokeRect(14, 14, w - 28, h - 28); g.lineWidth = 3; g.strokeRect(30, 30, w - 60, h - 60);
    g.fillStyle = 'rgba(232,176,64,.6)'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.ellipse(128 + Math.cos(a) * 34, 128 + Math.sin(a) * 34, 20, 8, a, 0, TAU); g.fill(); } });
  block3(S, .7, .025, .6, new THREE.MeshStandardMaterial({ map: asTex, roughness: .95 }), [0, 0, 1.25]);
  const PP = new THREE.Group(); PP.position.set(-.3, 0, .98); S.add(PP);
  mesh3(PP, lathe3([[0, 0], [.08, 0], [.09, .01], [.085, .015], [0, .008]], 32), cu, [0, 0, 0]);                       // the plate (tamhan)
  mesh3(PP, lathe3(smooth3([[0, .01], [.03, .01], [.04, .03], [.035, .08], [.045, .1], [.04, .1], [.03, .08], [0, .07]], 3), 28), cu, [-.025, 0, 0]);   // the cup
  mesh3(PP, new THREE.CircleGeometry(.034, 20), new THREE.MeshStandardMaterial({ color: '#9AC8E0', roughness: .05, metalness: .2, emissive: '#1A3A4A', emissiveIntensity: .4 }), [-.025, .092, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const spoon = new THREE.Group(); spoon.position.set(-.025, .1, 0); PP.add(spoon);
  tubeP3(spoon, [[0, .0, 0], [.02, .03, .0], [.04, .09, 0]], .003, cu, { segs: 8 });
  mesh3(spoon, lathe3([[0, -.006], [.012, -.006], [.016, 0], [0, -.002]], 16), cu, [0, -.004, 0]);
  const drops = [0, 1, 2].map(() => mesh3(PP, new THREE.SphereGeometry(.007, 10, 8), new THREE.MeshStandardMaterial({ color: '#BFE6FF', roughness: .05, emissive: '#3A6A8A', emissiveIntensity: .6, transparent: true }), [0, 0, 0], { cast: false }));
  // the sankalp: a few grains of rice and a red flower in the plate
  const SK = new THREE.Group(); PP.add(SK);
  for (let i = 0; i < 12; i++) mesh3(SK, scG(new THREE.SphereGeometry(.004, 6, 4), [1, 1, 2.2]), std3('#F4EEDC', .8), [.03 + (hash(i) - .5) * .04, .016, (hash(i + 9) - .5) * .05], { rot: [0, hash(i + 3) * 3, 0], cast: false });
  mesh3(SK, flG, PMAT.rose, [.045, .02, .01], { scale: 1.3 });
  // ---- the aarti lamp and its trails ----
  const AL = new THREE.Group(); AL.scale.setScalar(.7); S.add(AL);
  mesh3(AL, lathe3(smooth3([[0, -.09], [.035, -.09], [.04, -.08], [.016, -.05], [.014, -.02], [.06, -.005], [.075, .005], [.07, .012], [0, .01]], 3), 32), PMAT.brass, [0, 0, 0], { cast: false });
  tubeP3(AL, [[.02, -.04, 0], [.12, -.09, .04], [.22, -.16, .1]], .009, PMAT.brass, { segs: 10, cast: false });
  const alF = [[0, 0], [.04, 0], [-.04, 0], [0, .04], [0, -.04]].map(([x, z], i) => { mesh3(AL, lathe3([[0, 0], [.012, 0], [.018, .008], [.02, .016], [0, .014]], 16), PMAT.brass, [x, .012, z], { cast: false }); return flame3(AL, [x, .03, z], .85, { light: false, seed: i * 3.7 }); });
  const alLight = new THREE.PointLight('#FFA24A', 0, 3, 1.5); alLight.position.set(0, .08, 0); AL.add(alLight);
  const alHalo = glow3(AL, [0, .07, 0], .4, '#FFB050', .4);
  const TRAIL = (() => {   // the last ~1.4 s of the lamp's path as glowing points
    const n = 60, pts = []; for (let i = 0; i < n; i++) pts.push(glow3(S, [0, 0, 0], .05, '#FFB040', 0)); return pts; })();
  // ---- petals for the pushpanjali, coins for Lakshmi ----
  const PET = []; const pr = lcg(61), petG = new THREE.CircleGeometry(.012, 8);
  for (let i = 0; i < 160; i++) { const m = mesh3(S, petG, [PMAT.mari[0], PMAT.mari[1], PMAT.mari[2], PMAT.rose][i % 4], [0, 0, 0], { cast: false });
    m.material = m.material.clone(); m.material.side = THREE.DoubleSide;
    PET.push({ m, x: (pr() - .5) * 1.3, z: MZ - .1 + pr() * .5, t0: pr() * 1.4, v: .55 + pr() * .35, sp: pr() * 6, land: CH.h + .3 * pr() }); }
  const COINS = []; for (let i = 0; i < 10; i++) COINS.push(mesh3(S, new THREE.CylinderGeometry(.01, .01, .002, 14), metal3('#F0C860', .2), [0, 0, 0], { cast: false }));
  const glint = glow3(S, [0, 0, 0], .5, '#FFE6B0', 0);
  const halo = glow3(S, [0, 0, 0], .8, '#FFD27A', 0);
  const motes = motes3(S, { n: 260, box: [-1.4, .05, -.6, 1.4, 2.2, 1.6], size: .006, col: '#FFE6C0', drift: [.01, .02, 0] });

  // ---- the washing place (step 1), on a bench to the right: a brass Ganesha in a tray under a lota; clay Lakshmi ----
  const WX = 3.4;
  block3(S, 1.6, .3, .7, wood, [WX + .4, 0, 0]);
  mesh3(S, lathe3([[0, 0], [.2, 0], [.25, .03], [.26, .06], [.25, .06], [.2, .025], [0, .02]], 48), PMAT.brass, [WX, .3, 0]);   // the tray
  const washWater = mesh3(S, new THREE.CircleGeometry(.21, 32), new THREE.MeshStandardMaterial({ color: '#9AC8E0', roughness: .05, metalness: .2, transparent: true, opacity: .6, emissive: '#1A3A4A', emissiveIntensity: .4 }), [WX, .335, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const GW = ganesha3(S, [WX, .325, 0], .27);
  const lota = new THREE.Group(); lota.position.set(WX + .2, .78, .05); S.add(lota);
  mesh3(lota, lathe3(smooth3([[0, 0], [.05, 0], [.08, .04], [.085, .08], [.06, .12], [.04, .14], [.05, .16], [0, .155]], 3), 32), cu, [0, -.08, 0]);
  const pour = stream3(S, [[WX + .13, .83, .05], [WX + .08, .79, .05], [WX + .03, .7, .06], [WX + .01, .6, .07]], .007, { speed: 3, segs: 30 });
  const splash = []; for (let i = 0; i < 24; i++) splash.push(mesh3(S, new THREE.SphereGeometry(.004, 6, 4), new THREE.MeshStandardMaterial({ color: '#CFEFFF', roughness: .05, emissive: '#5A8AAA', emissiveIntensity: .7, transparent: true }), [0, 0, 0], { cast: false }));
  const LC = devi3(S, [WX + .85, .3, 0], .3, { kind: 'lakshmi', mats: PMAT.clay });
  const washKey = new THREE.SpotLight('#FFD8B0', 0, 6, .8, .6, 1.4); washKey.position.set(WX - .6, 1.9, 1.6); washKey.target.position.set(WX + .4, .4, 0); washKey.castShadow = true; washKey.shadow.mapSize.set(1024, 1024); washKey.shadow.bias = -.0004; S.add(washKey, washKey.target);
  const rag = new THREE.Group(); S.add(rag);
  mesh3(rag, new THREE.SphereGeometry(.06, 16, 10), std3('#F4F0E6', 1), [0, 0, 0], { scale: [1.3, .5, .9] });
  for (let i = 0; i < 5; i++) mesh3(rag, new THREE.SphereGeometry(.03, 10, 8), std3('#ECE6DA', 1), [(hash(i) - .5) * .1, .02, (hash(i + 4) - .5) * .06]);

  // ---- set(t, o) ----
  // o.cloth 0..1 (the top unrolls, then the drop), o.murti [S, L, G] 0..1 (each drops in), o.dress / o.mala / o.tilak
  // [S, L, G], o.lotus, o.flowers, o.bhog, o.kalash { pot, water, coin, supari, rice, leaves, coco, swastik, mauli },
  // o.samai, o.diyas (0..1 or [k...]), o.thali, o.incense, o.chowkiLamp, o.drops [age per drop], o.sankalp, o.aarti
  // { p: [x,y,z], on, trail: [[x,y,z]...] }, o.petals (age), o.coins (age), o.glint [x,y,z,k], o.halo [x,y,z,k],
  // o.dull (0..1 tarnished brass), o.light (room light 0..1), o.wash { pour, wipe, x }
  const brass0 = new THREE.Color('#D2A04A'), brassDull = new THREE.Color('#6E5838');
  const set = (t, o = {}) => {
    const L = o.light ?? 1;
    hemi.intensity = .35 * L; key.intensity = 22 * L; rim.intensity = .8 * L;
    const dull = o.dull ?? 0;
    PMAT.brass.color.copy(brass0).lerp(brassDull, dull); PMAT.brass.roughness = lerp(.3, .75, dull); PMAT.brassD.roughness = lerp(.38, .8, dull);
    TOR.set(t, { wind: .25, on: o.toran ?? 1 });
    const ck = o.cloth ?? 1; topG.scale.z = Math.max(.001, clamp(ck * 1.6)); topG.visible = ck > .01; dropG.scale.y = Math.max(.001, clamp(ck * 2.4 - 1.4)); dropG.visible = ck > .6;
    const mk = o.murti ?? [1, 1, 1];
    MURTIS.forEach((M, i) => {
      const k = clamp(mk[i]); M.root.visible = k > .001; M.root.position.y = CH.h + .004 + (1 - easeOut(k)) * .18; M.group.scale.setScalar((i === 1 ? .33 : .3) * lerp(.9, 1, easeOut(k)));
      M.k({ dress: (o.dress ?? [1, 1, 1])[i], mala: (o.mala ?? [1, 1, 1])[i], tilak: (o.tilak ?? [1, 1, 1])[i], lotus: i === 1 ? (o.lotus ?? 1) : 0 });
    });
    FL.visible = (o.flowers ?? 1) > .01; BH.visible = (o.bhog ?? 1) > .01;
    lampC.set(t, o.chowkiLamp ?? 1);
    // the kalash, built up
    const kk = o.kalash || {}, kv = (n, d = 1) => clamp(kk[n] ?? d);
    KG.visible = kv('pot') > .001; K.scale.setScalar(KS * lerp(.85, 1, easeOut(kv('pot'))));
    rice.scale.set(1, .3 * kv('rice0', 1), 1);
    water.visible = kv('water') > .01; water.position.y = lerp(.25, .37, kv('water'));
    const drop = (m, k, x, z) => { m.visible = k > 0 && k < 1; m.position.set(x, lerp(.75, .37, k * k), z); };
    drop(coin, kk.coin ?? 2, 0, 0); drop(supari, kk.supari ?? 2, .02, -.01);
    grains.forEach((g, i) => drop(g, (kk.rice ?? 2) - i * .05, (hash(i) - .5) * .05, (hash(i + 5) - .5) * .05));
    leaves.forEach((lf, i) => { const k = clamp(kv('leaves') * 5 - i * .9); lf.visible = k > .01; lf.scale.setScalar(easeOut(k)); });
    const ck2 = kv('coco'); cocoG.visible = ck2 > .01; cocoG.position.y = (1 - easeOut(ck2)) * .25;
    swK.visible = kv('swastik') > .01; swK.material.opacity = kv('swastik'); mauli.visible = kv('mauli') > .01; mauli.scale.setScalar(lerp(1.3, 1, easeOut(kv('mauli'))));
    // lamps
    samai.forEach((f, i) => f.set(t, clamp(((o.samai ?? 1) * 5 - i))));
    const dk = o.diyas ?? 1; diyas.forEach((d, i) => d.set(t, Array.isArray(dk) ? dk[i] : dk));
    TH.visible = (o.thali ?? 1) > .01; thaliDiya.set(t, o.thali ?? 1);
    // incense smoke
    const inc = o.incense ?? 1; embers.forEach(e => e.material.opacity = .8 * inc * (.8 + .2 * Math.sin(t * 9)));
    SMK.forEach((s, i) => { const tp = tips[i % 2], per = 3.2, a = ((t / per + i / SMK.length) % 1), h = a * .9;
      s.position.set(tp[0] + Math.sin(t * .7 + i) * .03 * h * 3 + h * .08, tp[1] + h, tp[2] + Math.cos(t * .5 + i * 2) * .02 * h * 3);
      s.scale.setScalar(.04 + h * .25); s.material.opacity = inc * .22 * Math.sin(a * Math.PI) * (1 - a * .4); s.material.rotation = i + t * .2; });
    // achaman drops: each falls from the spoon's tip into... the palm (out of frame), a sparkle
    const dr = o.drops || [];
    drops.forEach((d, i) => { const a = dr[i]; d.visible = a != null && a > 0 && a < .7; if (!d.visible) return; d.position.set(.02, .19 - a * a * 2.2, .02); d.material.opacity = 1 - a; });
    spoon.rotation.z = o.spoon ?? 0;
    SK.visible = (o.sankalp ?? 0) > .01;
    // the aarti lamp
    const ar = o.aarti; AL.visible = !!ar && ar.on > .01;
    if (ar) { AL.position.set(...ar.p); alF.forEach((f, i) => f.set(t, ar.on)); alLight.intensity = 2.4 * ar.on * (.9 + .1 * vnoise(t * 8, 4)); alHalo.material.opacity = .35 * ar.on;
      TRAIL.forEach((g, i) => { const p = ar.trail && ar.trail[i]; g.visible = !!p; if (p) { g.position.set(...p); g.material.opacity = ar.on * .5 * (1 - i / TRAIL.length); g.scale.setScalar(.05 * (1 - i / TRAIL.length * .5)); } }); }
    else { alLight.intensity = 0; TRAIL.forEach(g => g.visible = false); }
    // petals
    const pa = o.petals;
    PET.forEach(P => { const a = pa == null ? -1 : pa - P.t0; P.m.visible = a > 0; if (a <= 0) return;
      const y = Math.max(P.land, 1.5 - a * P.v), still = y <= P.land;
      P.m.position.set(P.x + (still ? Math.sin(P.sp) * .03 : Math.sin(a * 3 + P.sp) * .03), y, P.z);
      P.m.rotation.set(still ? -Math.PI / 2 : a * 4 + P.sp, a * 3, 0); });
    // coins from Lakshmi's lower right hand
    const ca = o.coins, LR = LAK.root.position, cA = LAK.coinAt;
    COINS.forEach((c, i) => { const a = ca == null ? -1 : (ca - i * .16) % 1.6; c.visible = a > 0 && a < .45; if (!c.visible) return;
      c.position.set(LR.x + cA[0] + (hash(i) - .5) * .01, LR.y + cA[1] - a * a * 1.6, LR.z + cA[2] + .01); c.rotation.set(a * 9 + i, i, 0); });
    const gl = o.glint; glint.visible = !!gl; if (gl) { glint.position.set(gl[0], gl[1], gl[2]); glint.material.opacity = gl[3]; glint.scale.setScalar(gl[4] ?? .5); }
    const ha = o.halo; halo.visible = !!ha; if (ha) { halo.position.set(ha[0], ha[1], ha[2]); halo.material.opacity = ha[3]; halo.scale.setScalar(ha[4] ?? .8); }
    motes.set(t, o.motes ?? 0);
    // the washing place
    const w = o.wash || {}; washKey.intensity = o.wash ? 14 : 0;
    pour.set(t, w.pour ?? 0); lota.rotation.z = lerp(0, .9, clamp((w.pour ?? 0) * 3));
    washWater.material.opacity = .25 + .4 * clamp(w.pour ?? 0);
    splash.forEach((s, i) => { const a = ((t * 1.6 + hash(i) * 3) % 1); s.visible = (w.pour ?? 0) > .3; if (!s.visible) return; const ang = hash(i + 7) * TAU, r = a * .1;
      s.position.set(WX + .01 + Math.cos(ang) * r, .45 + a * .12 - a * a * .3 + hash(i + 2) * .2, .07 + Math.sin(ang) * r); s.material.opacity = 1 - a; });
    const wp = w.wipe ?? -1; rag.visible = wp >= 0;
    if (wp >= 0) rag.position.set(WX + .85 + Math.sin(wp * 5) * .07, .3 + .28 + Math.sin(wp * 2.5) * .06, .14);
  };
  return { S, set, MURTIS, SAR, LAK, GAN, GW, LC, TOR, KG, K, kalashAt: [KX, 0, KZ], samaiAt: [SX, .5, SZ], thaliAt: [TX, 0, TZ], PP, washAt: [WX, .3, 0], tips };
})();

// HVS: a small home havan on a dark floor (the kund, its fire, the kalash and lamps of cine3d_havan.js)
const HVS = (() => {
  const S = new THREE.Scene(); S.background = new THREE.Color('#0A0705');
  const hemi = new THREE.HemisphereLight('#FFD2A0', '#2A1A10', .15); S.add(hemi);
  mesh3(S, new THREE.PlaneGeometry(12, 12), stone3({ col: '#6A5C4E', rows: 6, cols: 6, seed: 33, rep: [6, 6], mottle: 1 }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  mesh3(S, new THREE.PlaneGeometry(12, 4), plaster3('#C8A880', [3, 1]), [0, 2, -2.2], { cast: false });
  const HV = havan3(S, { at: [0, 0, 0] });
  return { S, HV, set: (t, o = {}) => HV.set(t, { fire: o.fire ?? 1, flare: o.flare || 0, ember: 1, smoke: .6, lamps: 1, ladle: o.ladle || 0, ladleOn: !!o.ladle, pour: o.pour || 0, rise: o.rise }) };
})();
