// cine3d_glb.js: 3D models from GLB files in the 3D style (src/vendor/three_gltf.min.js: three r170's GLTFLoader and
// SkeletonUtils as a classic script). The page loads from file://, where fetch() fails, so the file is read with XHR
// (render.mjs runs Chrome with --allow-file-access-from-files; open studio.html the same way, or through a local server).
// cine.js waits for every glb3() before the first frame (window.LOADS).
//
// glb3(path, o) → a THREE.Group, empty until the model arrives, then holding it: normalised so its feet stand on y 0,
// centred on x/z, o.height metres tall (or o.scale), turned o.yaw radians. o.cast / o.receive (shadows, true),
// o.mat(mesh) to touch each mesh's material, o.onload(group, gltf). The group's .gltf keeps the animations, .box its size.
// Every mesh's material is made a MeshStandardMaterial if it was specular-glossiness (three dropped that extension).
window.LOADS = window.LOADS || [];
const GLTF3 = new THREE.GLTFLoader(), GLBBUF3 = new Map();
// KHR_materials_pbrSpecularGlossiness (older Sketchfab exports): three dropped it, which left those models white and
// metallic; read its diffuse colour and texture into a plain matte MeshStandardMaterial.
GLTF3.register(parser => ({ name: 'KHR_materials_pbrSpecularGlossiness', extendMaterialParams(i, p) {
  const e = (parser.json.materials[i].extensions || {}).KHR_materials_pbrSpecularGlossiness; if (!e) return Promise.resolve();
  const d = e.diffuseFactor || [1, 1, 1, 1];
  p.color = new THREE.Color().setRGB(d[0], d[1], d[2], THREE.LinearSRGBColorSpace); p.opacity = d[3];
  p.metalness = 0; p.roughness = 1 - (e.glossinessFactor ?? 1) * .5;
  return e.diffuseTexture ? parser.assignTexture(p, 'map', e.diffuseTexture, THREE.SRGBColorSpace) : Promise.resolve();
} }));
function glbBuf3(path) {
  if (!GLBBUF3.has(path)) GLBBUF3.set(path, new Promise((res, rej) => {
    const x = new XMLHttpRequest(); x.open('GET', path); x.responseType = 'arraybuffer';
    x.onload = () => (x.status === 0 || x.status === 200) && x.response ? res(x.response) : rej(new Error('glb ' + path + ': ' + x.status));
    x.onerror = () => rej(new Error('glb ' + path + ': cannot read (open with --allow-file-access-from-files)')); x.send();
  }));
  return GLBBUF3.get(path);
}
function glb3(path, o = {}) {
  const g = new THREE.Group(); g.name = 'glb:' + path;
  const p = glbBuf3(path).then(buf => new Promise((res, rej) => GLTF3.parse(buf, '', res, rej))).then(gltf => {
    const m = gltf.scene;
    m.traverse(n => { if (n.isMesh) { n.castShadow = o.cast ?? true; n.receiveShadow = o.receive ?? true; if (o.mat) o.mat(n); } });
    m.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(m), sz = b.getSize(V3()), k = o.scale ?? (o.height ? o.height / sz.y : 1);
    const inner = new THREE.Group(); inner.add(m);
    m.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
    if (o.center === 'mid') m.position.y = -(b.min.y + b.max.y) / 2;
    inner.scale.setScalar(k); inner.rotation.y = o.yaw ?? 0; g.add(inner);
    g.gltf = gltf; g.box = sz.multiplyScalar(k); g.inner = inner;
    if (o.onload) o.onload(g, gltf);
    return g;
  });
  p.catch(e => console.error(e)); window.LOADS.push(p); g.ready = p; return g;
}
// glbAnim3(g, name|index): a mixer posed by t (seconds) for a skinned model's clip: .at(t) (frames render in any order)
function glbAnim3(g, clip = 0) {
  let mix = null, act = null;
  return { at(t) {
    if (!g.gltf) return; if (!mix) { mix = new THREE.AnimationMixer(g.gltf.scene); const A = g.gltf.animations;
      act = mix.clipAction(typeof clip === 'string' ? A.find(a => a.name === clip) : A[clip]); act.play(); }
    mix.setTime(t % act.getClip().duration);
  } };
}
