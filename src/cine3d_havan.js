// cine3d_havan.js: a havan (homa) for the 3D style (load after cine3d.js). A square brick kund with three stepped rims
// (mekhala) washed white, red and black, mango-wood logs inside, a big fire of flame sprites with its own shadowed light,
// embers and smoke; a wooden sruva (the ladle) that tips ghee into the fire; a copper kalash with mango leaves and a
// coconut, a brass ghee bowl, a plate of samagri, two standing lamps, a rangoli round the kund. For the reels about the
// words said at the fire, two small sets beside it: tarpan (a copper vessel pouring water and black sesame onto kusha
// grass in a plate: Svadha, the offering to the ancestors) and dakshina (coins, a betel leaf and a supari on a brass
// plate). Gold lights that rise from the fire into the sky: the offering reaching the gods. Metres; y up.
//
//   const HV = havan3(scene, { at: [5.4, 0, 0] });   HV.group, HV.at (the kund's centre), HV.top (the rim's height),
//   HV.cup() (the sruva's cup, world point), HV.tarpanAt, HV.dakshinaAt, HV.kalashAt (world points)
//   HV.set(t, o): o.fire (0..1 its size), o.flare (0..1 a flare-up: an offering landing), o.dull (0..1 a weak, red,
//   smoky fire), o.gold (0..1 the fire turns gold-white), o.ember (0..1), o.smoke (0..1), o.lamps (0..1),
//   o.ladle (0..1 how far the sruva has tipped; 0 hides it unless o.ladleOn), o.pour (0..1 the ghee running),
//   o.rise [age, k, fail]: the offering's lights rising (age seconds since they left the fire; k their brightness; fail
//   0..1 they die out low instead of reaching the sky), o.tarpan (0..1 the water and sesame pouring)
const HAVAN = { half: .6, tier: .1, pit: .3 };

// flame tongues: three textures, each a few licks of fire
const havanFlameTex3 = (n) => tex3('hflame' + n, 128, 256, (g, w, h) => {
  const r = lcg(17 + n * 11);
  const tongue = (x, top, wd, bend) => { g.beginPath(); g.moveTo(x - wd, h - 6); g.bezierCurveTo(x - wd * 1.1, h * .6, x + bend - wd * .3, top + 50, x + bend, top); g.bezierCurveTo(x + bend + wd * .25, top + 60, x + wd * 1.15, h * .62, x + wd, h - 6); g.closePath(); };
  g.filter = 'blur(5px)';
  for (let i = 0; i < 4; i++) {
    const x = 64 + (r() - .5) * 46, top = 8 + r() * 90 + (i ? 30 : 0), wd = 16 + r() * 18, bend = (r() - .5) * 30;
    const gr = g.createLinearGradient(0, top, 0, h); gr.addColorStop(0, 'rgba(255,110,30,0)'); gr.addColorStop(.25, 'rgba(255,130,40,.75)'); gr.addColorStop(.7, 'rgba(255,190,90,.95)'); gr.addColorStop(1, 'rgba(255,230,170,1)');
    g.fillStyle = gr; tongue(x, top, wd, bend); g.fill();
  }
  g.filter = 'blur(6px)'; const gc = g.createLinearGradient(0, h * .45, 0, h); gc.addColorStop(0, 'rgba(255,245,220,0)'); gc.addColorStop(1, 'rgba(255,250,235,.95)');
  g.fillStyle = gc; tongue(64, h * .45, 26, 0); g.fill();
});
const smokeTex3 = () => tex3('hsmoke', 128, 128, (g) => {
  const r = lcg(5); g.filter = 'blur(6px)';
  for (let i = 0; i < 14; i++) { const x = 64 + (r() - .5) * 50, y = 64 + (r() - .5) * 50, rr = 18 + r() * 24, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
});
const dotTex3 = () => tex3('hdot', 32, 32, (g) => { const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); });
// the rangoli round the kund: petals and dots in turmeric, kumkum, white and green
const rangoliTex3 = () => tex3('rangoli', 1024, 1024, (g, w) => {
  g.clearRect(0, 0, w, w); const C = w / 2, cols = ['#F2B21E', '#D2262E', '#F4EFE6', '#2E8A4A', '#E8601A', '#7A2A8A'];
  g.save(); g.translate(C, C);
  const ring = (R, n, len, wd, col, rot = 0) => { g.fillStyle = col; for (let i = 0; i < n; i++) { g.save(); g.rotate(i / n * TAU + rot); g.beginPath(); g.ellipse(R, 0, len, wd, 0, 0, TAU); g.fill(); g.restore(); } };
  const dots = (R, n, rr, col) => { g.fillStyle = col; for (let i = 0; i < n; i++) { const a = i / n * TAU; g.beginPath(); g.arc(Math.cos(a) * R, Math.sin(a) * R, rr, 0, TAU); g.fill(); } };
  ring(470, 48, 34, 13, cols[0]); ring(470, 48, 18, 6, cols[1]); dots(430, 72, 6, cols[2]);
  ring(400, 32, 40, 16, cols[1], .05); ring(400, 32, 22, 8, cols[0], .05); dots(352, 64, 5, cols[3]);
  g.strokeStyle = cols[2]; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 452, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, 372, 0, TAU); g.stroke();
  g.restore();
}, {});

function havan3(scene, o = {}) {
  const G = new THREE.Group(); G.position.set(...(o.at || [0, 0, 0])); if (o.rot) G.rotation.y = o.rot; scene.add(G);
  const A = HAVAN.half, th = HAVAN.tier, P = HAVAN.pit, top = 3 * th;
  const plaster = (col, seed) => new THREE.MeshStandardMaterial({ color: col, roughness: .95, bumpMap: stoneTex({ seed, rows: 3, cols: 4, mottle: 1.6, speck: .5 }).bump.rep(1, 1), bumpScale: 1.2 });
  // ---- the rangoli, flat on the floor round the kund ----
  mesh3(G, new THREE.PlaneGeometry(2.7, 2.7), new THREE.MeshStandardMaterial({ map: rangoliTex3(), transparent: true, roughness: .95, depthWrite: false }), [0, .004, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // ---- the kund: three hollow square tiers, washed white (top), red, black (bottom); the pit inside ----
  const tiers = [['#2A2422', 11], ['#9A3324', 12], ['#B8AA96', 13]];
  tiers.forEach(([col, seed], i) => {
    const s = A - i * .09, m = plaster(col, seed), y = i * th, b = (s - P) ;
    block3(G, 2 * s, th, b, m, [0, y, -(P + b / 2)]); block3(G, 2 * s, th, b, m, [0, y, P + b / 2]);
    block3(G, b, th, 2 * P, m, [-(P + b / 2), y, 0]); block3(G, b, th, 2 * P, m, [P + b / 2, y, 0]);
  });
  // the pit walls (sooty brick) and its floor of ash
  const soot = new THREE.MeshStandardMaterial({ color: '#2A1E18', roughness: 1 });
  mesh3(G, new THREE.BoxGeometry(2 * P, top - .02, 2 * P), new THREE.MeshStandardMaterial({ color: '#1A120E', roughness: 1, side: THREE.BackSide }), [0, (top - .02) / 2 + .01, 0], { cast: false });
  mesh3(G, new THREE.PlaneGeometry(2 * P, 2 * P), new THREE.MeshStandardMaterial({ color: '#4A3A32', roughness: 1, emissive: '#3A1404', emissiveIntensity: .8 }), [0, .03, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // mango-wood logs, criss-crossed, glowing at the ends
  const bark = new THREE.MeshStandardMaterial({ color: '#3A2618', roughness: 1, emissive: '#5A1A04', emissiveIntensity: .5 });
  const rl = lcg(8);
  for (let i = 0; i < 9; i++) { const a = (i % 2 ? Math.PI / 2 : 0) + (rl() - .5) * .5, y = .07 + Math.floor(i / 2) * .055; mesh3(G, new THREE.CylinderGeometry(.028, .032, .54, 8), bark, [(rl() - .5) * .22, y, (rl() - .5) * .22], { rot: [Math.PI / 2, a, 0] }); }
  const coal = []; for (let i = 0; i < 18; i++) coal.push(glow3(G, [(rl() - .5) * .44, .06 + rl() * .1, (rl() - .5) * .44], .12, '#FF5A10', .8));

  // ---- the fire: rising flame particles (born white-gold at the logs, rising, narrowing, reddening, gone), a few
  // tongues standing at its root, a halo, embers, smoke, and its light ----
  const FP = [], NP = 170, fr = lcg(3);
  for (let i = 0; i < NP; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex3(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); s.center.set(.5, .3); G.add(s); FP.push({ s, x: (fr() - .5) * .42, z: (fr() - .5) * .42, per: .55 + fr() * .5, ph: fr(), sz: .7 + fr() * .6, seed: fr() * 100 }); }
  const TG = []; for (let i = 0; i < 7; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: havanFlameTex3(i % 3), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); s.center.set(.5, .03); G.add(s); TG.push({ s, x: (fr() - .5) * .3, z: (fr() - .5) * .3, seed: fr() * 100 }); }
  const halo = glow3(G, [0, .6, 0], 2.2, '#FF7A20', .35), core = glow3(G, [0, .3, 0], .8, '#FFD890', .5);
  const light = new THREE.PointLight('#FF9A40', 0, 9, 1.6); light.position.set(0, .75, 0); light.castShadow = true; light.shadow.mapSize.set(1024, 1024); light.shadow.bias = -.003; light.shadow.radius = 5; G.add(light);
  const C_HOT = new THREE.Color('#FFE6B0'), C_MID = new THREE.Color('#FF8A1E'), C_END = new THREE.Color('#B8260A'), C_GOLD = new THREE.Color('#FFE9A8'), C_DULL = new THREE.Color('#8A2008'), tmp = new THREE.Color();
  // embers: points that rise out of the fire, drifting, and fade
  const NE = 140, eg = new THREE.BufferGeometry(), ePos = new Float32Array(NE * 3), eCol = new Float32Array(NE * 3);
  eg.setAttribute('position', new THREE.BufferAttribute(ePos, 3)); eg.setAttribute('color', new THREE.BufferAttribute(eCol, 3));
  const embers = new THREE.Points(eg, new THREE.PointsMaterial({ map: dotTex3(), size: .03, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); embers.frustumCulled = false; G.add(embers);
  // smoke
  const SM = []; for (let i = 0; i < 18; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex3(), color: '#8A8078', transparent: true, depthWrite: false, opacity: 0 })); G.add(s); SM.push(s); }
  // the offering's lights: gold sparks, each with a short trail, that spiral up into the sky
  const RS = []; for (let i = 0; i < 40; i++) { const head = glow3(G, [0, 0, 0], .3, i % 3 ? '#FFC860' : '#FFF0C8', 0), tr = []; for (let k = 1; k <= 5; k++) tr.push(glow3(G, [0, 0, 0], .2, '#FFB040', 0)); RS.push({ head, tr }); }
  const riseAt = (i, a0, fail) => { const sp = 2.0 + hash(i + 40) * 1.2, h = .7 + a0 * sp + a0 * a0 * (1 - fail) * 1.8, R = (.1 + a0 * .25) * (1 - fail * .5), ang = a0 * 2.4 + i * 2.39;
    return [Math.cos(ang) * R, fail ? Math.min(h, 1.2 + a0 * .5) : h, Math.sin(ang) * R]; };

  // ---- the sruva: a wooden ladle reaching in from the -z side (screen right, seen from the east), its brass cup over
  // the fire; it tips toward +x (toward a camera in the east) and the ghee runs from its lip into the fire ----
  const ladle = new THREE.Group(); ladle.position.set(0, .92, .02); G.add(ladle);
  const wood = new THREE.MeshStandardMaterial({ color: '#6A3E20', roughness: .55 }), brass = metal3('#D6A24A', .25);
  mesh3(ladle, new THREE.CylinderGeometry(.013, .017, 1.5, 10), wood, [0, .03, -.8], { rot: [Math.PI / 2 - .04, 0, 0] });
  mesh3(ladle, new THREE.CylinderGeometry(.02, .02, .06, 10), brass, [0, .005, -.1], { rot: [Math.PI / 2, 0, 0] });
  const cupG = new THREE.Group(); ladle.add(cupG);
  mesh3(cupG, lathe3(smooth3([[0, -.035], [.03, -.034], [.048, -.016], [.052, .006], [.046, .008], [.04, -.012], [0, -.02]], 3), 32), brass, [0, 0, 0]);
  const ghee = mesh3(cupG, new THREE.CircleGeometry(.042, 24), new THREE.MeshStandardMaterial({ color: '#F2C24A', roughness: .2, emissive: '#6A4A08', emissiveIntensity: .4 }), [0, -.002, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const pourMat = new THREE.MeshStandardMaterial({ map: waterTex3().rep(3, 1), color: '#FFD060', transparent: true, opacity: .95, roughness: .1, emissive: '#D08A10', emissiveIntensity: 1, depthWrite: false });
  const L0 = [.055, .9, .02], pourCurve = new THREE.CatmullRomCurve3([L0, [.07, .86, .02], [.075, .6, .015], [.07, .3, .01], [.06, .15, .01]].map(p => V3(...p)));
  const pourGeo = new THREE.TubeGeometry(pourCurve, 40, .0055, 8, false), pour = mesh3(G, pourGeo, pourMat, [0, 0, 0], { cast: false, receive: false });

  // ---- around the kund: kalash, ghee bowl, samagri plate, two lamps ----
  const cu = new THREE.MeshStandardMaterial({ color: '#C47848', metalness: .55, roughness: .35 }), lampM = metal3('#C9963E', .3);
  const kalashAt = [-.5, 0, -1.05];
  const K = new THREE.Group(); K.position.set(...kalashAt); G.add(K);
  mesh3(K, lathe3(smooth3([[0, 0], [.1, 0], [.17, .08], [.19, .2], [.15, .3], [.08, .35], [.075, .38], [.11, .41], [0, .41]], 4), 48), cu, [0, 0, 0]);
  for (let i = 0; i < 3; i++) mesh3(K, new THREE.TorusGeometry(.185 - i * .006, .006, 6, 40), new THREE.MeshStandardMaterial({ color: i === 1 ? '#F2C21E' : '#C21E28', roughness: .8 }), [0, .17 + i * .02, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  const mango = new THREE.MeshStandardMaterial({ color: '#2E6A24', roughness: .55, side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; const lf = new THREE.Group(); lf.position.set(Math.cos(a) * .07, .4, Math.sin(a) * .07); lf.rotation.set(0, -a, 0); K.add(lf); mesh3(lf, new THREE.SphereGeometry(.09, 12, 6), mango, [.09, .02, 0], { scale: [1, .08, .32], rot: [0, 0, -.7] }); }
  const coco = mesh3(K, new THREE.SphereGeometry(.1, 20, 14), new THREE.MeshStandardMaterial({ color: '#6A4426', roughness: 1, bumpMap: stoneTex({ seed: 4, rows: 8, cols: 1, speck: 1.5 }).bump, bumpScale: 3 }), [0, .52, 0], { scale: [1, 1.2, 1] });
  mesh3(K, new THREE.TorusGeometry(.085, .01, 6, 30), new THREE.MeshStandardMaterial({ color: '#D2262E', roughness: .8 }), [0, .48, 0], { rot: [Math.PI / 2, 0, 0] });
  mesh3(K, new THREE.ConeGeometry(.03, .08, 8), new THREE.MeshStandardMaterial({ color: '#8A6A3A', roughness: 1 }), [0, .66, 0]);
  // a brass bowl of ghee
  const bowlAt = [.75, 0, -.9];
  mesh3(G, lathe3(smooth3([[0, 0], [.08, 0], [.13, .04], [.15, .09], [.14, .095], [.12, .05], [0, .03]], 3), 40), brass, bowlAt);
  mesh3(G, new THREE.CircleGeometry(.125, 32), new THREE.MeshStandardMaterial({ color: '#F0C04A', roughness: .25, emissive: '#5A3A08', emissiveIntensity: .3 }), [bowlAt[0], .075, bowlAt[2]], { rot: [-Math.PI / 2, 0, 0], cast: false });
  // a plate of samagri: rice, black sesame, marigolds
  const plate = (at, r = .2) => { mesh3(G, lathe3([[0, 0], [r * .8, 0], [r, .02], [r * 1.02, .03], [r * .96, .025], [0, .012]], 40), brass, at); };
  const heap = (x, z, r, col, rough = .9) => mesh3(G, new THREE.SphereGeometry(r, 16, 8, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: col, roughness: rough, bumpMap: stoneTex({ seed: 30, rows: 1, cols: 1, speck: 2 }).bump.rep(4, 4), bumpScale: 4 }), [x, .012, z], { scale: [1, .5, 1] });
  const sam = [-.85, 0, .75]; plate(sam, .22);
  heap(sam[0] - .07, sam[2] - .05, .08, '#EEE8DA'); heap(sam[0] + .08, sam[2] - .02, .07, '#1E1A18'); heap(sam[0], sam[2] + .09, .07, '#C89A5A');
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; mesh3(G, new THREE.IcosahedronGeometry(.028, 1), new THREE.MeshStandardMaterial({ color: i % 2 ? '#F09A1E' : '#E2601A', roughness: .8 }), [sam[0] + Math.cos(a) * .15, .035, sam[2] + Math.sin(a) * .15]); }
  // two standing lamps at the back corners
  const lamps = [];
  for (const s of [-1, 1]) {
    const x = -.95, z = s * .85;
    mesh3(G, lathe3(smooth3([[0, 0], [.13, 0], [.13, .025], [.05, .06], [.025, .1], [.025, .55], [.05, .58], [.025, .61], [.1, .64], [.12, .67], [0, .66]], 3), 32), lampM, [x, 0, z]);
    lamps.push(flame3(G, [x, .7, z], .9, { power: 1.6, range: 4 }));
  }

  // ---- tarpan (Svadha): a small copper lota pours water and black sesame over a bundle of kusha grass in a copper plate ----
  const tarpanAt = [.35, 0, 1.15];
  const TP = new THREE.Group(); TP.position.set(...tarpanAt); G.add(TP);
  mesh3(TP, lathe3([[0, 0], [.2, 0], [.24, .028], [.25, .042], [.23, .038], [0, .014]], 40), cu, [0, 0, 0]);
  const water = mesh3(TP, new THREE.CircleGeometry(.215, 40), waterMat3({ rep: 2, opacity: .65 }), [0, .03, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const kusha = new THREE.MeshStandardMaterial({ color: '#7E9A3E', roughness: .7, side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) { const g = new THREE.Group(); g.position.set(0, .036, 0); g.rotation.y = .5 + (i - 3) * .07; TP.add(g); mesh3(g, new THREE.PlaneGeometry(.34, .007), kusha, [0, 0, (i - 3) * .006], { rot: [-Math.PI / 2, 0, 0], cast: false }); }
  mesh3(TP, new THREE.TorusGeometry(.012, .004, 6, 16), new THREE.MeshStandardMaterial({ color: '#C21E28', roughness: .8 }), [0, .04, 0], { rot: [0, .5, 0], cast: false });
  const tilM = new THREE.MeshStandardMaterial({ color: '#141210', roughness: .6 }), rt = lcg(12);
  for (let i = 0; i < 60; i++) { const a = rt() * TAU, r = rt() * .19; mesh3(TP, new THREE.SphereGeometry(.0045, 5, 4), tilM, [Math.cos(a) * r, .034, Math.sin(a) * r], { scale: [1, .5, .7], cast: false }); }
  // the lota: held above the plate's edge (-z), tipping toward the middle
  const lota = new THREE.Group(); lota.position.set(-.02, .34, -.17); lota.scale.setScalar(.75); TP.add(lota);
  mesh3(lota, lathe3(smooth3([[0, -.08], [.045, -.08], [.07, -.04], [.075, .01], [.05, .05], [.033, .065], [.045, .085], [0, .085]], 4), 40), cu, [0, 0, 0]);
  const tStream = stream3(TP, [[-.02, .39, -.13], [-.02, .38, -.1], [-.02, .24, -.07], [-.02, .04, -.06]], .005, { speed: 4, opacity: .8 });
  const tilFall = []; for (let i = 0; i < 20; i++) tilFall.push(mesh3(TP, new THREE.SphereGeometry(.005, 5, 4), tilM, [0, 0, 0], { cast: false }));

  // ---- dakshina: gold and silver coins on a betel leaf, a supari, on a brass plate ----
  const dakshinaAt = [.6, 0, -1.15];
  const DK = new THREE.Group(); DK.position.set(...dakshinaAt); G.add(DK);
  mesh3(DK, lathe3([[0, 0], [.17, 0], [.2, .02], [.21, .03], [.195, .026], [0, .012]], 40), brass, [0, 0, 0]);
  const leafShape = new THREE.Shape(); leafShape.moveTo(0, -.12); leafShape.bezierCurveTo(.05, -.06, .1, .02, .07, .07); leafShape.bezierCurveTo(.05, .1, .01, .1, 0, .07); leafShape.bezierCurveTo(-.01, .1, -.05, .1, -.07, .07); leafShape.bezierCurveTo(-.1, .02, -.05, -.06, 0, -.12);
  mesh3(DK, new THREE.ShapeGeometry(leafShape, 16), new THREE.MeshStandardMaterial({ color: '#3E8A2E', roughness: .4, side: THREE.DoubleSide }), [0, .022, 0], { rot: [-Math.PI / 2, 0, .6], cast: false });
  const gold = metal3('#E8B84A', .2), silver = metal3('#D0D0D4', .22), coins = [];
  [[.0, 0, .0, gold], [.012, 1, .01, gold], [-.004, 2, .02, gold], [.045, 0, -.03, silver], [-.045, 0, .035, gold], [.05, 1, -.025, silver]].forEach(([x, k, z, m], i) => coins.push(mesh3(DK, new THREE.CylinderGeometry(.026, .026, .005, 28), m, [x, .028 + k * .0055, z], { rot: [(hash(i) - .5) * .12, 0, (hash(i + 3) - .5) * .12] })));
  mesh3(DK, new THREE.SphereGeometry(.026, 14, 10), new THREE.MeshStandardMaterial({ color: '#7A4A2A', roughness: .8 }), [-.03, .045, -.05], { scale: [1, .8, 1] });

  const world = (p) => G.localToWorld(V3(...p)).toArray();
  const set = (t, s = {}) => {
    const fire = s.fire ?? 1, flare = clamp(s.flare ?? 0), dull = clamp(s.dull ?? 0), gold = clamp(s.gold ?? 0);
    const hK = fire * (1 + .8 * flare) * (1 - .55 * dull) * (1 + .2 * gold), bri = fire * (1 + .5 * flare) * (1 - .45 * dull);
    FP.forEach((f, i) => {
      const k = frac(t / f.per + f.ph), sw = vnoise(t * 2 + f.seed, 1) * .05 * k;
      const H = (.66 + .22 * vnoise(t * 1.3 + i * .1, 2)) * hK, w = .16 * f.sz * (1 - .75 * k) * (1 + .4 * flare) * (.6 + .4 * fire);
      f.s.visible = hK > .01;
      f.s.position.set(f.x * (1 - .7 * k) + sw + k * .04, .1 + k * H, f.z * (1 - .7 * k) + sw * .5);
      f.s.scale.set(w, w * (1.6 + .8 * k), 1); f.s.material.rotation = vnoise(t * 3 + f.seed, 3) * .25;
      tmp.copy(k < .35 ? C_HOT : C_MID).lerp(k < .35 ? C_MID : C_END, k < .35 ? k / .35 : (k - .35) / .65);
      if (dull) tmp.lerp(C_DULL, dull * .6); if (gold) tmp.lerp(C_GOLD, gold * (1 - k) * .8);
      f.s.material.color.copy(tmp); f.s.material.opacity = clamp(bri) * Math.pow(Math.sin(Math.min(1, k * 1.15) * Math.PI), .6) * .42;
    });
    TG.forEach((g, i) => { const n = vnoise(t * 4 + g.seed, 4); g.s.visible = hK > .01; g.s.position.set(g.x, .06, g.z); g.s.scale.set(.2 * (.6 + .4 * fire), Math.max(.001, .5 * hK * (.8 + .3 * n)), 1); g.s.material.rotation = n * .12;
      g.s.material.color.set(dull ? '#C04010' : gold ? mixCol('#FF9A30', '#FFE2A0', gold) : '#FF9A30'); g.s.material.opacity = .4 * clamp(bri); });
    const fl = .85 + .15 * vnoise(t * 9, 4);
    halo.material.opacity = .3 * bri * fl * (1 + .5 * gold); halo.scale.setScalar(2.2 * (1 + .4 * flare + .3 * gold)); halo.material.color.set(gold ? mixCol('#FF7A20', '#FFD27A', gold) : '#FF7A20');
    core.material.opacity = .5 * bri * fl;
    light.intensity = 5 * bri * fl * (1 + .3 * gold); light.color.set(dull ? mixCol('#FF9A40', '#C0401A', dull) : gold ? mixCol('#FF9A40', '#FFD890', gold) : '#FF9A40');
    coal.forEach((g, i) => g.material.opacity = (.5 + .3 * Math.sin(t * 2 + i)) * Math.max(.4, fire));
    // embers
    const ek = (s.ember ?? 1) * fire * (1 + flare * 1.5) * (1 - .5 * dull);
    for (let i = 0; i < NE; i++) {
      const per = 1.6 + hash(i) * 1.4, age = frac(t / per + hash(i + 7)) * per, x0 = (hash(i + 3) - .5) * .4, z0 = (hash(i + 5) - .5) * .4;
      const v = .45 + hash(i + 9) * .7 + flare * .8;
      ePos[i * 3] = x0 + Math.sin(age * 2.3 + i) * .05 * age + age * .06; ePos[i * 3 + 1] = .3 + age * v; ePos[i * 3 + 2] = z0 + Math.cos(age * 2 + i) * .05 * age;
      const a = ek * clamp(age * 6) * clamp(1 - age / per) * (hash(i + 11) < .5 ? 1 : .6);
      eCol[i * 3] = a; eCol[i * 3 + 1] = a * (.45 + .3 * hash(i + 13)); eCol[i * 3 + 2] = a * .12;
    }
    eg.attributes.position.needsUpdate = true; eg.attributes.color.needsUpdate = true;
    // smoke: thin normally, heavy and grey when the fire is dull
    const sk = (s.smoke ?? .35) + dull * .8;
    SM.forEach((m, i) => {
      const per = 4 + hash(i + 20) * 2, age = frac(t / per + hash(i + 21)) * per, k = age / per;
      m.position.set((hash(i + 22) - .5) * .3 + k * .5, .5 + k * 3.2, (hash(i + 23) - .5) * .3 - k * .3); m.scale.setScalar(.35 + k * 1.6);
      m.material.opacity = clamp(sk) * .22 * Math.sin(k * Math.PI); m.material.color.set(dull ? '#6A625C' : '#9A8C80'); m.material.rotation = i + t * .2;
    });
    // the rising lights
    const [age, rk, fail] = s.rise || [0, 0, 0];
    RS.forEach((r, i) => {
      const a0 = age - i * .05, on = rk > 0 && a0 > 0;
      const pos = on ? riseAt(i, a0, fail) : [0, 0, 0], h = pos[1];
      const fade = on ? (fail ? clamp(1 - (a0 - .2) / .6) : clamp(1 - (h - 16) / 10)) * clamp(a0 * 5) : 0;
      r.head.position.set(...pos); r.head.scale.setScalar(.22 + .12 * hash(i + 41) + h * .01); r.head.material.opacity = rk * fade * (.75 + .25 * Math.sin(t * 9 + i));
      r.tr.forEach((g, k) => { const p = on ? riseAt(i, Math.max(0, a0 - (k + 1) * .035), fail) : [0, 0, 0]; g.position.set(...p); g.scale.setScalar((.18 - k * .025) * (1 + h * .01)); g.material.opacity = rk * fade * (.45 - k * .08); });
    });
    // lamps
    lamps.forEach(l => l.set(t, s.lamps ?? 1));
    // the sruva: tipped toward +x about its handle; the pour runs while it is tipped
    const tip = clamp(s.ladle ?? 0); ladle.visible = tip > 0 || !!s.ladleOn; ladle.rotation.set(0, 0, -tip * 1.9); ghee.visible = tip < .6;
    const pr = clamp(s.pour ?? 0); pour.visible = pr > .001; pourMat.map.offset.x = -t * 3; pourGeo.setDrawRange(0, Math.floor(pr * 40) * 8 * 6);
    // tarpan: the lota tips, water and sesame fall
    const tp = clamp(s.tarpan ?? 0);
    lota.rotation.set(-(tp * 1.5 + .1), 0, 0); tStream.set(t, clamp(tp * 3 - .6)); water.material.map.offset.x = t * .2;
    tilFall.forEach((m, i) => { const per = .45, a = frac(t / per + hash(i + 60)) * per; m.position.set(-.02 + (hash(i + 61) - .5) * .02, .4 - a * a * 4.5 - a * .25, -.1 + a * .1 + (hash(i + 62) - .5) * .02); m.visible = tp > .5 && m.position.y > .04; });
  };
  set(0, {});
  return { group: G, at: world([0, 0, 0]), top, set, cup: () => cupG.getWorldPosition(V3()).toArray(), lip: world(L0),
    kalashAt: world(kalashAt), tarpanAt: world(tarpanAt), dakshinaAt: world(dakshinaAt), bowlAt: world(bowlAt), samagriAt: world(sam), ladle, lamps, light, world };
}
