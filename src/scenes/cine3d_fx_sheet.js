// cine3d_fx_sheet.js: the film look's demo on main (cine3d_fx.html). 0–4 s the shrine at dusk as the 3D style drew it
// before (direct render); 4–8 s the same shot through the film look (HDRI light, bloom, shafts, depth of field, grade);
// 8–12 s a product shot: a brass kalash on red wool under studio softboxes, the lens racking focus; 12–16 s under the
// sea: sand, caustics, sunbeams and plankton the lens turns to bokeh.
//   node render.mjs --page=cine3d_fx.html --sheet=2,6,10,14 --cols=4 --w=360 --out=docs/cine3d_fx.jpg
const W3 = world3(), T3 = shrine3(W3.scene);

// ---- the product stage
const P = new THREE.Scene();
P.environment = studioEnv3({ floor: .4 });
const wool = mesh3(P, new THREE.PlaneGeometry(6, 6), pbr3('redwool', { rep: [3, 3], normalK: 1.4 }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0] });
const brass = new THREE.MeshPhysicalMaterial({ color: '#E2B060', metalness: 1, roughness: .18, clearcoat: .4, clearcoatRoughness: .2 });
const kal = mesh3(P, lathe3(smooth3([[0, 0], [.22, .02], [.34, .16], [.36, .3], [.3, .44], [.16, .52], [.12, .58], [.17, .64], [.18, .67]]), 96), brass, [0, 0, 0]);
for (let i = 0; i < 5; i++) mesh3(P, lathe3(smooth3([[0, 0], [.07, .01], [.09, .05], [.08, .07]]), 48), brass, [Math.cos(i * 1.4) * (.7 + i * .25), 0, -.4 - i * .55 + Math.sin(i) * .2]);
const key = new THREE.DirectionalLight('#FFF2E0', 2.2); key.position.set(-2, 4, 3); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: .5, far: 12 }); key.shadow.radius = 6; key.shadow.bias = -.0005; P.add(key);
P.background = new THREE.Color('#0A0809');

// ---- the sea
const SEA = new THREE.Scene(); SEA.background = new THREE.Color('#06324A'); SEA.fog = new THREE.FogExp2('#0A4A66', .055);
const floor = mesh3(SEA, new THREE.PlaneGeometry(60, 60, 120, 120), pbr3('sand', { rep: [14, 14], tint: '#CFE2DC' }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0] });
{ const p = floor.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, .25 * Math.sin(p.getX(i) * .4) * Math.cos(p.getY(i) * .3) + .1 * Math.sin(p.getX(i) * 1.3 + p.getY(i))); floor.geometry.computeVertexNormals(); }
for (let i = 0; i < 14; i++) { const r = lcg(i + 3); mesh3(SEA, new THREE.DodecahedronGeometry(.3 + r() * .5, 1), pbr3('pebbles', { tint: '#9AB0A8' }), [(r() - .5) * 16, .1, -r() * 14], { scale: [1, .6, 1] }); }
const sun3 = new THREE.DirectionalLight('#CFF4FF', 2.4); sun3.position.set(2, 10, 1); SEA.add(sun3, new THREE.HemisphereLight('#4FB6D8', '#0A2A30', .8));
SEA.environment = studioEnv3({ room: '#0A3A50', boxes: [[0, 14, 0, 18, 18, 3]] });
const CAU = caustics3(SEA, 40, 40, [0, 0, -4], { y: .3, scale: 1.4, k: 1.2 });
const SH = shafts3(SEA, { n: 14, top: 14, len: 16, area: [14, 12], at: [0, -6], col: '#BFF0FF', r: [.3, 1.1] });
const MO = motes3(SEA, { n: 900, box: [-6, 0, -14, 6, 8, 4], size: .012, col: '#CFF4FF', drift: [.05, .08, 0] });

const before = { exposure: 1.05 };
SHOTS.push({ a: 0, b: 4.2, draw(c, u, t) {
  W3.scene.environment = null; const ex = W3.mood('dusk'); T3.set(t, { lamps: 1, water: 1 });
  render3(c, W3.scene, cam3({ pos: [Math.cos(.5) * 14, 3.2, Math.sin(.5) * 14], at: [0, 3, 0], fov: 46 }), { exposure: ex });
} });
SHOTS.push({ a: 4, b: 8.2, xf: .3, draw(c, u, t) {
  const ex = W3.mood('dusk', { hemi: .45 }); env3(W3.scene, 'dawn', { k: .55, rot: 2.2 }); T3.set(t, { lamps: 1, water: 1 });
  const cam = cam3({ pos: [Math.cos(.5) * 14, 3.2, Math.sin(.5) * 14], at: [0, 3, 0], fov: 46 });
  render3(c, W3.scene, cam, { exposure: ex, fx: { bloom: { k: .35, thresh: .9 }, rays: { at: [-60, 12, -20], k: .6, thresh: .55, col: '#FFC890', minZ: 40 },
    dof: { focus: 14, aperture: 7, max: 14 }, grade: { contrast: 1.08, sat: 1.1, temp: .15, shadows: '#3A4A80', highlights: '#FFB070', split: .12 }, ca: .002 } });
} });
SHOTS.push({ a: 8, b: 12.2, xf: .3, draw(c, u, t) {
  const f = lerp(2.6, 4.6, easeIO(seg(u, .8, 3)));
  render3(c, P, cam3({ pos: [Math.sin(u * .1) * 2.4, .7, 2.2], at: [0, .32, 0], fov: 32 }), { exposure: 1, fx: { bloom: { k: .3, thresh: 1.2 }, dof: { focus: f, aperture: 18, max: 22 }, grade: { contrast: 1.06, sat: 1.05, temp: .1 } } });
} });
SHOTS.push({ a: 12, b: 16, xf: .3, draw(c, u, t) {
  CAU.set(t, 1); SH.set(t, 1); MO.set(t, 1);
  const cam = cam3({ pos: [0, 1.6 + u * .1, 4 - u * .3], at: [0, 3, -8], fov: 50 });
  render3(c, SEA, cam, { exposure: 1.1, fx: { bloom: { k: .3, thresh: .9 }, rays: { at: [0, 40, -10], k: .8, thresh: .35, col: '#BFF0FF' }, dof: { focus: 5, aperture: 10, max: 18 }, grade: { contrast: 1.05, sat: 1.1, temp: -.2 } } });
} });
say(.2, 3.8, 'Before: a direct render', { y: 1380 });
say(4.4, 7.8, 'The *FILM LOOK*', { y: 1380 });
say(8.4, 11.6, 'Studio light · *DOF*', { y: 1380 });
say(12.4, 15.6, 'Under the *SEA*', { y: 1380 });
