// narayan_sets.js: the 3D world of the Narayanastra reel (ad 100). Kurukshetra under a cosmic sky: a nebula dome (blue
// over the Pandavas' side, fire over the Kauravas'), the dusty plain, both armies as instanced silhouette billboards (a
// whole army can kneel and drop its weapons in a wave), the weapon itself (thousands of blazing arrows, razor discs and
// iron balls flying from a burning mandala in the sky), the hero arrow of the hook, Drona's fallen bow, Bhima's mace,
// a river that runs backwards.
// Units: metres, y up. The Kauravas stand to the north (-z), the Pandavas to the south (+z). WORLD.set(t, o) sets a
// frame; the shots call it, then cam3() and render3().

// ---------- shader noise (GLSL) ----------
const GLSL_NOISE = `
float h31(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p) { float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * vn(p); p = p * 2.03 + 1.7; a *= .5; } return s; }
`;

// ---------- the nebula sky ----------
// uniforms: fire (0..1 how far the fire side spreads over the sky), calm (0..1 the sky cleared, blue, starlit), dark,
// t (slow drift), k (overall brightness), night (0..1 a plain night with a moon glow, for the close)
function nebula3(scene) {
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { fire: { value: .3 }, calm: { value: 0 }, t: { value: 0 }, k: { value: 1 }, night: { value: 0 }, fireDir: { value: V3(.85, .2, -1).normalize() } },
    vertexShader: 'varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position.z = gl_Position.w; }',
    fragmentShader: GLSL_NOISE + `
      uniform float fire, calm, t, k, night; uniform vec3 fireDir; varying vec3 vD;
      void main() {
        vec3 d = normalize(vD);
        float el = d.y;
        vec3 col = mix(vec3(.003, .004, .014), vec3(.008, .008, .026), smoothstep(-.1, .7, el));
        vec3 p = d * 2.4 + vec3(t * .008, 0., t * .005);
        float n1 = fbm(p), n2 = fbm(p * 2.1 + 4.3), n3 = fbm(p * 5.3 - 2.);
        float cloud = smoothstep(.42, .78, n1 * .8 + n2 * .3);
        float dustL = smoothstep(.5, .75, n2) * smoothstep(.62, .45, n1);          // dark lanes through the clouds
        float wisps = smoothstep(.5, .85, n2) * smoothstep(.35, .75, n3);
        float side = dot(d, fireDir), c0 = mix(.55, -.55, fire);
        float fk = smoothstep(c0 - .3, c0 + .3, side + (n1 - .5) * .7);
        vec3 blue = mix(vec3(.01, .05, .16), vec3(.06, .42, .85), wisps);
        blue += vec3(.25, .85, 1.0) * smoothstep(.72, .95, n3) * cloud * .7;
        vec3 red = mix(vec3(.22, .025, .06), vec3(1.0, .34, .07), wisps);
        red += vec3(1.3, .8, .35) * smoothstep(.7, .95, n3) * cloud * .7;
        vec3 neb = mix(blue, red, fk * (1. - calm));
        col += neb * cloud * (1. - .75 * dustL) * (.5 + .5 * smoothstep(-.15, .5, el)) * (1. - .45 * calm) * (1. - .85 * night);
        col += vec3(1.0, .32, .06) * pow(max(side, 0.), 9.) * .55 * fire * (1. - calm) * (1. - night);
        vec3 sp = d * 420.; vec3 si = floor(sp); float sh = h31(si);
        float star = step(.982, sh) * smoothstep(.45, .0, length(fract(sp) - .5)) * (.5 + 1.2 * h31(si + 3.));
        col += vec3(.85, .9, 1.) * star * (1.0 + calm) * smoothstep(-.05, .15, el) * (1. - .6 * cloud * (1. - calm));
        float hz = exp(-abs(el + .01) * 22.);
        col += mix(vec3(.04, .07, .14), vec3(.32, .1, .04), fk * (1. - calm)) * hz * .35 * (1. - .6 * night);
        vec3 moonD = normalize(vec3(-.6, .45, -.5));
        col = mix(col, vec3(.010, .015, .035) + vec3(.22, .27, .38) * pow(max(dot(d, moonD), 0.), 40.) + vec3(.9, .9, .95) * smoothstep(.9996, .9998, dot(d, moonD)), night * .85);
        gl_FragColor = vec4(col * k, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(400, 64, 40), m); dome.renderOrder = -10; dome.frustumCulled = false; scene.add(dome);
  return { dome, u: m.uniforms };
}

// ---------- the plain ----------
function plain3(scene) {
  const tex = tex3('kuruDust', 512, 512, (g) => {
    const r = lcg(7); g.fillStyle = '#5E4A3A'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) { const x = r() * 512, y = r() * 512, s = 1 + r() * 3; g.fillStyle = `rgba(${r() < .5 ? '30,22,16' : '120,100,80'},${.08 + r() * .14})`; g.fillRect(x, y, s, s); }
    for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(40,28,20,${.1 + r() * .15})`; g.lineWidth = 1 + r() * 2; g.beginPath(); let x = r() * 512, y = r() * 512; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - .5) * 60; y += (r() - .5) * 60; g.lineTo(x, y); } g.stroke(); }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(90, 90); tex.anisotropy = MAX_ANISO;
  const mat = new THREE.MeshStandardMaterial({ map: tex, color: '#B8A08A', roughness: 1, metalness: 0 });
  const g = mesh3(scene, new THREE.PlaneGeometry(1200, 1200, 1, 1), mat, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: true });
  return g;
}

// ---------- silhouette atlases (2D rigs drawn once into a canvas) ----------
// cells 256 × 256 (soldiers) in a 4 × 2 grid: 0 spear, 1 bow, 2 sword raised, 3 drawing a bow, 4 kneeling, 5 bowed,
// 6 kneeling (other side), 7 a banner bearer. The figure is near-black with a light edge baked in on its upper left.
const SOLDIER_CELLS = 8, SOLDIER_KNEEL = [4, 5, 6];
function soldierAtlas() {
  return tex3('soldierAtlas', 1024, 512, (g) => {
    const cell = (i, draw) => { g.save(); g.translate((i % 4) * 256 + 128, Math.floor(i / 4) * 256 + 250); g.scale(.22, .22); draw(); g.restore(); };
    const P = [
      { pose: 'stand', prop: 'spear', head: 'turban' }, { pose: 'stand', prop: 'bow', head: 'knot', quiver: true }, { pose: 'raise', prop: 'sword', head: 'turban', propA: -1.7 },
      { pose: 'draw', prop: 'bow', head: 'knot' }, { pose: 'kneel', head: 'turban' }, { pose: 'sitBow', head: 'knot' }, { pose: 'kneel', head: 'knot' }, { pose: 'stand', prop: 'spear', head: 'turban', banner: true },
    ];
    P.forEach((o, i) => {
      for (const [dx, dy, col] of [[-3, -3, '#FFD9A8'], [0, 0, '#0A0809']]) {
        cell(i, () => {
          g.translate(dx / .22, dy / .22);
          if (o.banner) { strokePath(g, 'M 10 -1300 L 10 0', col, 12); fillPath(g, 'M 10 -1300 C 120 -1270 220 -1320 330 -1280 L 320 -1100 C 220 -1140 120 -1090 10 -1120 Z', col); }
          manSil(g, { ...o, col, prop: o.banner ? null : o.prop });
        });
      }
    });
  });
}
// chariots: 2 cells 512 × 256: 0 a chariot with its warrior standing, 1 the warrior down (kneeling on the ground beside)
function chariotAtlas() {
  return tex3('chariotAtlas', 1024, 256, (g) => {
    for (let i = 0; i < 2; i++) for (const [dx, dy, col] of [[-4, -4, '#FFD9A8'], [0, 0, '#0A0809']]) {
      g.save(); g.translate(i * 512 + 170 + dx, 200 + dy); g.scale(.2, .2);
      chariot(g, { col, flag: true, t: 0 });
      if (i === 0) { g.save(); g.translate(-40, 0); g.scale(-.62, .62); manSil(g, { pose: 'draw', prop: 'bow', col, head: 'kirita' }); g.restore(); }
      else { g.save(); g.translate(-420, 80); g.scale(-.6, .6); manSil(g, { pose: 'kneel', col, head: 'kirita' }); g.restore(); }
      g.restore();
    }
  });
}

// ---------- an army of billboards ----------
// army3(scene, o): n figures in a box; each faces the camera about the vertical axis. o.box [x0, z0, x1, z1], o.h
// (height, m), o.atlas, o.cols/rows, o.cells (which cells it uses), o.kneel (cells when down), o.aspect (w/h of a cell),
// o.seed. .set(t, { drop, wave: [x, z] origin, speed, tint, light, a }): a figure kneels once the wave (drop seconds since
// it started, travelling `speed` m/s from `wave`) reaches it. Returns { mesh, set, at(i) }.
function army3(scene, o) {
  const n = o.n, rnd = lcg(o.seed ?? 3), [x0, z0, x1, z1] = o.box;
  const base = new THREE.PlaneGeometry(1, 1); base.translate(0, .5, 0);
  const geo = new THREE.InstancedBufferGeometry(); geo.index = base.index; geo.setAttribute('position', base.attributes.position); geo.setAttribute('uv', base.attributes.uv);
  const pos = new Float32Array(n * 3), cell = new Float32Array(n), kneel = new Float32Array(n), sc = new Float32Array(n), flip = new Float32Array(n), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let x = lerp(x0, x1, rnd()), z = lerp(z0, z1, rnd());
    if (o.rows) { const r = Math.floor(rnd() * o.rows); z = lerp(z0, z1, (r + .5 + (rnd() - .5) * .6) / o.rows); }
    pos[i * 3] = x; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = z;
    cell[i] = o.cells[Math.floor(rnd() * o.cells.length)]; kneel[i] = o.kneel[Math.floor(rnd() * o.kneel.length)];
    sc[i] = o.h * (.88 + rnd() * .24); flip[i] = o.flip ?? (rnd() < .5 ? -1 : 1); ph[i] = rnd() * 6.28;
  }
  geo.setAttribute('iPos', new THREE.InstancedBufferAttribute(pos, 3)); geo.setAttribute('iCell', new THREE.InstancedBufferAttribute(cell, 1));
  geo.setAttribute('iKneel', new THREE.InstancedBufferAttribute(kneel, 1)); geo.setAttribute('iScale', new THREE.InstancedBufferAttribute(sc, 1));
  geo.setAttribute('iFlip', new THREE.InstancedBufferAttribute(flip, 1)); geo.setAttribute('iPh', new THREE.InstancedBufferAttribute(ph, 1));
  geo.instanceCount = n;
  const mat = new THREE.ShaderMaterial({ transparent: false, depthWrite: true, side: THREE.DoubleSide,
    uniforms: { atlas: { value: o.atlas }, cols: { value: o.cols }, rows: { value: o.rowsA }, aspect: { value: o.aspect ?? 1 }, camP: { value: V3() },
      drop: { value: -1 }, wave: { value: new THREE.Vector2(0, 0) }, speed: { value: 30 }, t: { value: 0 },
      tint: { value: new THREE.Color('#FFFFFF') }, edge: { value: new THREE.Color('#FFD9A8') }, edgeK: { value: 1 },
      fogCol: { value: new THREE.Color('#000') }, fogN: { value: 30 }, fogF: { value: 200 }, a: { value: 1 } },
    vertexShader: `
      attribute vec3 iPos; attribute float iCell, iKneel, iScale, iFlip, iPh;
      uniform vec3 camP; uniform float aspect, drop, speed, t; uniform vec2 wave;
      varying vec2 vUv; varying float vCell, vDist;
      void main() {
        float down = drop >= 0. ? step(length(iPos.xz - wave) / speed, drop) : 0.;
        vCell = mix(iCell, iKneel, down);
        vec3 toC = camP - iPos; toC.y = 0.; vec3 fw = normalize(toC); vec3 rt = vec3(fw.z, 0., -fw.x);
        float h = iScale * (1. + .01 * sin(t * 2. + iPh));
        vec3 wp = iPos + rt * (position.x * h * aspect * iFlip) + vec3(0., position.y * h, 0.);
        vUv = uv; vec4 mv = viewMatrix * vec4(wp, 1.); vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform sampler2D atlas; uniform float cols, rows, edgeK, fogN, fogF, a; uniform vec3 tint, edge, fogCol;
      varying vec2 vUv; varying float vCell, vDist;
      void main() {
        float c = floor(vCell + .5); vec2 cu = vec2(mod(c, cols), rows - 1. - floor(c / cols));
        vec4 s = texture2D(atlas, (cu + vUv) / vec2(cols, rows));
        if (s.a < .4) discard;
        float lum = dot(s.rgb, vec3(.33));
        vec3 col = mix(vec3(.02, .018, .02) * tint, edge * edgeK, smoothstep(.15, .6, lum));
        float f = smoothstep(fogN, fogF, vDist);
        gl_FragColor = vec4(mix(col, fogCol, f) * a, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; scene.add(mesh);
  const set = (t, q = {}) => {
    mesh.visible = (q.a ?? 1) > .001; const U = mat.uniforms;
    U.t.value = t; U.camP.value.copy(CAM3.position); U.drop.value = q.drop ?? -1; U.speed.value = q.speed ?? 30;
    if (q.wave) U.wave.value.set(q.wave[0], q.wave[1]);
    U.tint.value.set(q.tint || '#FFFFFF'); U.edge.value.set(q.edge || '#FFD9A8'); U.edgeK.value = q.edgeK ?? .55; U.a.value = q.a ?? 1;
    const F = scene.fog; if (F) { U.fogCol.value.copy(F.color); U.fogN.value = F.near; U.fogF.value = F.far; }
  };
  return { mesh, set, pos };
}

// ---------- the weapon ----------
// The Narayanastra (Drona Parva 7.170.16-19): blazing arrows like fire-mouthed snakes, glowing iron balls, shataghnis,
// razor-edged discs. Each missile flies from the mandala in the sky (SRC) to a point over the Pandava army, again and
// again (each its own period and phase), so a frame depends only on t.
const SRC = V3(0, 46, -95), FOCUS = V3(6, 1.2, 14);
function swarm3(scene) {
  const NA = 1800, ND = 160, NB = 420, rnd = lcg(41);
  // an arrow: a shaft, a barbed head, fletching; a flame trail behind (additive)
  const shaft = new THREE.CylinderGeometry(.035, .035, 2.2, 5); shaft.rotateX(Math.PI / 2);
  const head = new THREE.ConeGeometry(.12, .5, 6); head.rotateX(Math.PI / 2); head.translate(0, 0, 1.3);
  const arrowGeo = THREE.BufferGeometryUtils ? THREE.BufferGeometryUtils.mergeGeometries([shaft, head]) : shaft;
  const arrowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFB040').multiplyScalar(2.2), fog: false });
  const arrows = new THREE.InstancedMesh(arrowGeo, arrowMat, NA); arrows.frustumCulled = false; scene.add(arrows);
  const trailTex = tex3('trail', 32, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(.15, 'rgba(255,170,60,.9)'); gr.addColorStop(.6, 'rgba(255,70,20,.25)'); gr.addColorStop(1, 'rgba(120,20,10,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 256); const h = g.createLinearGradient(0, 0, 32, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(.5, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = h; g.fillRect(0, 0, 32, 256); });
  const trailGeo = new THREE.CylinderGeometry(.22, .05, 7, 6, 1, true); trailGeo.rotateX(-Math.PI / 2); trailGeo.translate(0, 0, -3.4);
  // the cylinder's v runs along it: map the bright end to the arrow
  const trailMat = new THREE.MeshBasicMaterial({ map: trailTex, color: new THREE.Color('#FFFFFF').multiplyScalar(1.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide });
  const trails = new THREE.InstancedMesh(trailGeo, trailMat, NA); trails.frustumCulled = false; scene.add(trails);
  // a razor disc: a flat ring with teeth
  const ds = new THREE.Shape(); const T = 16;
  for (let i = 0; i <= T * 2; i++) { const a = i / (T * 2) * TAU, r = i % 2 ? .95 : 1.25, a2 = a + (i % 2 ? .0 : .12); (i ? ds.lineTo.bind(ds) : ds.moveTo.bind(ds))(Math.cos(a2) * r, Math.sin(a2) * r); }
  const hole = new THREE.Path(); hole.absarc(0, 0, .45, 0, TAU, true); ds.holes.push(hole);
  const discGeo = new THREE.ExtrudeGeometry(ds, { depth: .08, bevelEnabled: false }); discGeo.translate(0, 0, -.04);
  const discMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFD070').multiplyScalar(2.4), fog: false });
  const discs = new THREE.InstancedMesh(discGeo, discMat, ND); discs.frustumCulled = false; scene.add(discs);
  // iron balls, red-hot
  const ballMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF5A20').multiplyScalar(2.0), fog: false });
  const balls = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.45, 1), ballMat, NB); balls.frustumCulled = false; scene.add(balls);
  // the missiles' paths
  const mk = (n, kind) => Array.from({ length: n }, () => ({
    s: V3((rnd() - .5) * 26, (rnd() - .5) * 14, (rnd() - .5) * 18), tgt: V3((rnd() - .5) * 160, 0, 2 + rnd() * 60),
    arc: 8 + rnd() * 26, side: (rnd() - .5) * 30, per: (kind === 'd' ? 3.2 : 2.4) + rnd() * 1.6, ph: rnd(), ord: rnd(), spin: (rnd() - .5) * 20, sz: .8 + rnd() * .5,
    hang: V3((rnd() - .5), (rnd() - .5), rnd()) }));
  const PA = mk(NA, 'a'), PD = mk(ND, 'd'), PB = mk(NB, 'b');
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = V3(), P = V3(), P2 = V3(), Z = V3(0, 0, 1), D = V3(), E = new THREE.Euler();
  const p0 = V3(), p1 = V3(), p2 = V3(), tg = V3();
  const bez = (u, out) => { const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return out.set(p0.x * a + p1.x * b + p2.x * c, p0.y * a + p1.y * b + p2.y * c, p0.z * a + p1.z * b + p2.z * c); };
  const hide = (im, i) => { M.makeScale(0, 0, 0); im.setMatrixAt(i, M); };
  // set(t, o): o.fill (0..1 how many fly), o.focus (0..1 all aim at FOCUS), o.size, o.speed, o.hang (0..1: the hook's
  // formation, every arrow hanging in the sky aimed at o.aim), o.aim, o.fade (0..1 the weapon dying: missiles shrink
  // and rise), o.glow (brightness), o.src (where they come from)
  const set = (t, o = {}) => {
    const fill = o.fill ?? 0, focus = o.focus ?? 0, size = o.size ?? 1, fade = o.fade ?? 0, hang = o.hang ?? 0, src = o.src || SRC, sp = o.speed ?? 1;
    arrowMat.color.set('#FFA040').multiplyScalar(1.5 * (o.glow ?? 1)); discMat.color.set('#FFC060').multiplyScalar(1.5 * (o.glow ?? 1)); ballMat.color.set('#FF5A20').multiplyScalar(1.4 * (o.glow ?? 1));
    trailMat.opacity = .55 * (1 - hang) * (o.trail ?? 1);
    const one = (L, i, p, kind) => {
      if (p.ord > fill || size * (1 - fade) < .01) { hide(L, i); if (kind === 'a') hide(trails, i); return; }
      let u, pos, dir;
      if (hang > 0) {
        // the formation: a cone of arrows behind o.aimFrom, all pointing at o.aim
        const af = o.hangAt || V3(0, 30, -30);
        P.set(af.x + p.hang.x * 26, af.y + p.hang.y * 15, af.z - p.hang.z * 50);
        D.copy(o.aim || CAM3.position).sub(P).normalize();
        P.addScaledVector(D, Math.sin(t * .8 + p.ph * 6) * .3);
        pos = P; dir = D;
      } else {
        u = ((t * sp) / p.per + p.ph) % 1;
        p0.copy(src).add(p.s);
        tg.copy(p.tgt).lerp(FOCUS, focus); tg.x += (1 - focus) * 0;
        p2.copy(tg); p2.y += kind === 'b' ? .4 : 0;
        p1.set((p0.x + p2.x) / 2 + p.side * (1 - focus * .7), Math.max(p0.y, p2.y) + p.arc, (p0.z + p2.z) / 2);
        pos = bez(u, P); bez(Math.min(1, u + .01), P2); dir = D.copy(P2).sub(P).normalize();
        if (fade > 0) { pos.y += fade * 30 * p.ord; }
      }
      const k = size * p.sz * (1 - fade) * (hang > 0 ? 1 : smoothstep01(clamp(u * 12)) * (1 - smoothstep01(clamp((u - .94) * 16))));
      if (kind === 'a') { Q.setFromUnitVectors(Z, dir); S.setScalar(k); M.compose(pos, Q, S); L.setMatrixAt(i, M); trails.setMatrixAt(i, M); }
      else if (kind === 'd') { Q.setFromUnitVectors(Z, dir); E.set(0, 0, t * p.spin); Q.multiply(new THREE.Quaternion().setFromEuler(E)); S.setScalar(k * .75); M.compose(pos, Q, S); L.setMatrixAt(i, M); }
      else { Q.identity(); S.setScalar(k); M.compose(pos, Q, S); L.setMatrixAt(i, M); }
    };
    PA.forEach((p, i) => one(arrows, i, p, 'a')); PD.forEach((p, i) => one(discs, i, p, 'd')); PB.forEach((p, i) => one(balls, i, p, 'b'));
    arrows.instanceMatrix.needsUpdate = trails.instanceMatrix.needsUpdate = discs.instanceMatrix.needsUpdate = balls.instanceMatrix.needsUpdate = true;
    const vis = fill > 0 || hang > 0; arrows.visible = trails.visible = vis; discs.visible = balls.visible = vis && hang === 0;
  };
  return { set, arrows, discs, balls, trails };
}

// the mandala in the sky the weapon pours out of: rings of fire turning, a white-hot core, rays
function mandala3(scene) {
  const g = new THREE.Group(); g.position.copy(SRC); scene.add(g);
  const ringMat = (col, k) => new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide });
  const rings = [[14, .35, '#FF9A3A', 2.2], [19, .22, '#FFC870', 1.8], [24, .5, '#FF5A20', 1.4], [9, .28, '#FFE0A0', 2.6]].map(([r, w, col, k]) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, w, 8, 128), ringMat(col, k)); g.add(m); return m;
  });
  // spokes: thin blazing blades between the rings (a wheel of weapons)
  const spokes = new THREE.Group(); g.add(spokes);
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, m = new THREE.Mesh(new THREE.BoxGeometry(.25, 10, .2), ringMat('#FFB050', 1.8)); m.position.set(Math.cos(a) * 16.5, Math.sin(a) * 16.5, 0); m.rotation.z = a - Math.PI / 2; spokes.add(m); }
  const core = glow3(g, [0, 0, 0], 40, '#FFE6B0', 1), halo = glow3(g, [0, 0, 0], 120, '#FF6A20', .6);
  const set = (t, k = 1, o = {}) => {
    g.visible = k > .002; if (!g.visible) return;
    g.lookAt(o.face || CAM3.position);
    rings.forEach((m, i) => { m.rotation.z = t * (i % 2 ? -.3 : .2) * (1 + i * .3); m.scale.setScalar(k * (1 + .03 * Math.sin(t * 3 + i))); m.material.opacity = clamp(k * 1.2); });
    spokes.rotation.z = t * .5; spokes.scale.setScalar(k); spokes.children.forEach(m => m.material.opacity = clamp(k * 1.2));
    core.scale.setScalar(40 * k * (o.core ?? 1) * (1 + .06 * Math.sin(t * 7))); core.material.opacity = clamp(k);
    halo.scale.setScalar(130 * k * (o.core ?? 1)); halo.material.opacity = .5 * clamp(k);
  };
  return { group: g, set };
}

// the hero arrow of the hook: dark wood with gold bands, a long blade of a head, burning
function heroArrow3(scene) {
  const g = new THREE.Group(); scene.add(g);
  const wood = new THREE.MeshStandardMaterial({ color: '#2A1A12', roughness: .7 }), gold = new THREE.MeshStandardMaterial({ color: '#B8862E', roughness: .5, metalness: .5 });
  const hot = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFC060').multiplyScalar(3), fog: false });
  mesh3(g, new THREE.CylinderGeometry(.05, .05, 4, 12), wood, [0, 0, 0], { rot: [Math.PI / 2, 0, 0], cast: false });
  for (const z of [-1.6, -1.2, 1.2, 1.55]) mesh3(g, new THREE.CylinderGeometry(.07, .07, .08, 16), gold, [0, 0, z], { rot: [Math.PI / 2, 0, 0], cast: false });
  // the head: a long leaf blade
  const hs = new THREE.Shape(); hs.moveTo(0, 0); hs.bezierCurveTo(.28, .25, .26, .9, 0, 1.5); hs.bezierCurveTo(-.26, .9, -.28, .25, 0, 0);
  const hg = new THREE.ExtrudeGeometry(hs, { depth: .04, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 2 }); hg.rotateX(Math.PI / 2); hg.translate(0, 0, 1.9);
  mesh3(g, hg, hot, [0, 0, 0], { cast: false });
  mesh3(g, hg.clone(), hot, [0, 0, 0], { rot: [0, 0, Math.PI / 2], cast: false });
  // fletching
  for (let i = 0; i < 3; i++) { const f = new THREE.Shape(); f.moveTo(0, 0); f.lineTo(.22, -.1); f.lineTo(.22, -.8); f.lineTo(0, -.6); const m = mesh3(g, new THREE.ShapeGeometry(f), new THREE.MeshStandardMaterial({ color: '#6A1F1C', side: THREE.DoubleSide, roughness: .9 }), [0, 0, -1.3], { cast: false }); m.rotation.set(Math.PI / 2, i / 3 * TAU, 0); }
  const fl = [glow3(g, [0, 0, 2.5], 2.0, '#FF8A30', .8), glow3(g, [0, 0, 2.5], .8, '#FFF0C8', .9)];
  const set = (t, o = {}) => { g.visible = (o.a ?? 1) > .01; if (!g.visible) return; g.position.set(...o.pos); g.lookAt(V3(...o.aim)); fl[0].scale.setScalar(2.0 * (1 + .1 * Math.sin(t * 9))); fl[1].scale.setScalar(.8 * (1 + .15 * Math.sin(t * 13 + 1))); };
  return { group: g, set };
}

// Drona's bow lying in the dust, his arrows spilled
function bow3(scene, at) {
  const g = new THREE.Group(); g.position.set(...at); scene.add(g);
  const wood = new THREE.MeshStandardMaterial({ color: '#3A2416', roughness: .6 }), gold = new THREE.MeshStandardMaterial({ color: '#A8782A', roughness: .5, metalness: .5 });
  const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20 - .5; pts.push([u * 2.6, .06, -Math.cos(u * Math.PI) * .5 + Math.pow(Math.abs(u) * 2, 3) * .18]); }
  tubeP3(g, pts, [.045, .045], wood, { segs: 48, radial: 8 });
  mesh3(g, new THREE.CylinderGeometry(.06, .06, .22, 12), gold, [0, .06, -.5], { rot: [0, 0, Math.PI / 2] });
  const str = tubeP3(g, [[-1.3, .06, .08], [1.3, .06, .08]], .006, new THREE.MeshStandardMaterial({ color: '#D8D0BC' }), { segs: 2 });
  const rnd = lcg(5);
  for (let i = 0; i < 7; i++) { const a = mesh3(g, new THREE.CylinderGeometry(.015, .015, 1.4, 5), wood, [(rnd() - .5) * 2.4, .03, .4 + rnd() * .8], { rot: [Math.PI / 2, 0, (rnd() - .5) * 2.4] }); a.rotation.order = 'YXZ'; a.rotation.y = (rnd() - .5) * 2; }
  g.rotation.y = .5; return g;
}

// Bhima's mace: a fluted gold-bronze head on a long haft (matte, owner 30 Oct)
function mace3(scene) {
  const g = new THREE.Group(); scene.add(g);
  const bronze = new THREE.MeshStandardMaterial({ color: '#8A6A34', roughness: .55, metalness: .5 }), dark = new THREE.MeshStandardMaterial({ color: '#3A2A1A', roughness: .7 });
  mesh3(g, lathe3([[0, -1.2], [.05, -1.2], [.05, -1.1], [.04, -1.05], [.045, .2], [.08, .3], [0, .3]].map(([r, y]) => [r, y])), dark, [0, 0, 0]);
  const head = new THREE.LatheGeometry(Array.from({ length: 24 }, (_, i) => { const u = i / 23; return new THREE.Vector2(Math.max(.001, Math.sin(u * Math.PI) * .38 * (1 - .25 * u)), .3 + u * .9); }), 32);
  const p = head.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), f = 1 + .12 * Math.cos(a * 8); p.setX(i, x * f); p.setZ(i, z * f); } head.computeVertexNormals();
  mesh3(g, head, bronze, [0, 0, 0]);
  for (const y of [.36, 1.12]) mesh3(g, new THREE.TorusGeometry(.2 - (y > 1 ? .1 : 0), .035, 8, 24), bronze, [0, y, 0], { rot: [Math.PI / 2, 0, 0] });
  mesh3(g, new THREE.ConeGeometry(.06, .25, 12), bronze, [0, 1.3, 0]);
  return g;
}

// a river for the omen: a channel of water whose current can run either way (flow, integrated by the caller as `off`)
function river3(scene, at) {
  const m = new THREE.ShaderMaterial({ transparent: false, fog: false,
    uniforms: { off: { value: 0 }, t: { value: 0 }, sky: { value: new THREE.Color('#2A4A7A') }, hot: { value: new THREE.Color('#FF7A30') }, fire: { value: 0 }, churn: { value: 0 } },
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: GLSL_NOISE + `
      uniform float off, t, fire, churn; uniform vec3 sky, hot; varying vec2 vUv; varying vec3 vW;
      void main() {
        vec2 p = vec2(vW.x * .35, vW.z * .12 - off * .12);
        float n = fbm(vec3(p * vec2(4., .8), t * .15 + churn * t * .6));
        float streak = smoothstep(.6, .85, fbm(vec3(p.x * 9., p.y * 1.1, 1.3)));
        float foam = smoothstep(.68, .85, n) * (.3 + churn * .8);
        vec3 col = mix(vec3(.01, .02, .035), vec3(.05, .07, .1), n);
        col += hot * fire * .35 * smoothstep(.45, .9, n);
        col += vec3(1., .85, .7) * streak * .28 + vec3(1., .95, .9) * foam * .4;
        float edge = smoothstep(.0, .08, vUv.x) * smoothstep(1., .92, vUv.x);
        gl_FragColor = vec4(col * edge + vec3(.05, .04, .03) * (1. - edge), 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  const w = mesh3(scene, new THREE.PlaneGeometry(14, 220, 1, 1), m, [at[0], .03, at[2]], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  return { mesh: w, u: m.uniforms };
}

// ---------- the world ----------
const WORLD = (() => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#1A1420', 40, 260);
  const sky = nebula3(scene), ground = plain3(scene);
  const hemi = new THREE.HemisphereLight('#4A70B8', '#2A1A12', .7); scene.add(hemi);
  const key = new THREE.DirectionalLight('#FF9A5A', 1.6); key.position.set(0, 30, -60); scene.add(key, key.target);
  const fill = new THREE.DirectionalLight('#5AA0FF', .5); fill.position.set(-30, 20, 60); scene.add(fill);
  const glowL = new THREE.PointLight('#FF8A3A', 0, 160, 1.2); glowL.position.set(0, 20, 10); scene.add(glowL);
  const soldier = soldierAtlas(), car = chariotAtlas();
  const pand = army3(scene, { n: 2400, box: [-90, 4, 90, 70], h: 1.8, atlas: soldier, cols: 4, rowsA: 2, cells: [0, 1, 2, 3, 0, 0, 1, 7], kneel: SOLDIER_KNEEL, aspect: 1, seed: 3 });
  const pandC = army3(scene, { n: 70, box: [-80, 6, 80, 60], h: 2.6, atlas: car, cols: 2, rowsA: 1, cells: [0], kneel: [1], aspect: 2, seed: 9, flip: -1 });
  const kaur = army3(scene, { n: 1800, box: [-110, -150, 110, -105], h: 1.8, atlas: soldier, cols: 4, rowsA: 2, cells: [0, 1, 2, 7, 0], kneel: [0], aspect: 1, seed: 17 });
  const kaurC = army3(scene, { n: 40, box: [-90, -110, 90, -100], h: 2.6, atlas: car, cols: 2, rowsA: 1, cells: [0], kneel: [0], aspect: 2, seed: 23, flip: 1 });
  const bhimaC = army3(scene, { n: 1, box: [6, 14, 6, 14], h: 2.9, atlas: car, cols: 2, rowsA: 1, cells: [0], kneel: [0], aspect: 2, seed: 2, flip: -1 });
  const sw = swarm3(scene), md = mandala3(scene), hero = heroArrow3(scene);
  // the blaze on Bhima: a column of fire (flames and glows round FOCUS)
  const blaze = new THREE.Group(); blaze.position.set(FOCUS.x, 0, FOCUS.z); scene.add(blaze);
  const bf = [], brnd = lcg(31);
  for (let i = 0; i < 14; i++) { const a = brnd() * TAU, r = brnd() * 1.6; bf.push(flame3(blaze, [Math.cos(a) * r, 0, Math.sin(a) * r], 14 + brnd() * 14, { light: false, seed: i * 3.3 })); }
  const bg = [glow3(blaze, [0, 2.5, 0], 12, '#FF7A2A', .8), glow3(blaze, [0, 1.6, 0], 6, '#FFE0A0', .9), glow3(blaze, [0, 6, 0], 22, '#FF5020', .45)];
  const bow = bow3(scene, [-6, 0, -30]), mace = mace3(scene);
  const riv = river3(scene, [260, 0, 0]);
  const dust = motes3(scene, { n: 900, box: [-40, 0, -40, 40, 6, 60], size: .025, col: '#C8A07A', drift: [.4, .25, 0], seed: 13 });
  const embers = motes3(scene, { n: 500, box: [-30, 0, -30, 30, 14, 40], size: .03, col: '#FFB060', drift: [.2, .9, 0], seed: 19 });
  let flowOff = 0;
  // set(t, o): the frame's state
  //   sky: { fire, calm, k, night }; armies: pand { drop, wave, speed, a }, kaur; swarm: { fill, focus, size, … };
  //   mandala (0..1); hero { pos, aim } or null; mace { pos, rot } or null; bow (bool); river { off, fire, churn } or null;
  //   light: { key, fill, glow, glowAt }; fog: [col, near, far]; dust, embers (0..1)
  const set = (t, o = {}) => {
    const S = o.sky || {};
    sky.dome.position.copy(CAM3.position);
    Object.assign(sky.u.fire, { value: S.fire ?? .35 }); sky.u.calm.value = S.calm ?? 0; sky.u.k.value = S.k ?? 1; sky.u.night.value = S.night ?? 0; sky.u.t.value = t;
    const fg = o.fog || ['#1A1420', 40, 260]; scene.fog.color.set(fg[0]); scene.fog.near = fg[1]; scene.fog.far = fg[2];
    const L = o.light || {};
    key.intensity = L.key ?? 1.6; key.color.set(L.keyCol || '#FF9A5A'); fill.intensity = L.fill ?? .5; hemi.intensity = L.hemi ?? .7;
    glowL.intensity = L.glow ?? 0; if (L.glowAt) glowL.position.set(...L.glowAt);
    const ed = o.edge || '#FFD9A8';
    pand.set(t, { a: 1, edge: ed, ...(o.pand || {}) }); pandC.set(t, { a: 1, edge: ed, ...(o.pandC || o.pand || {}) });
    kaur.set(t, { a: 1, edge: ed, ...(o.kaur || {}) }); kaurC.set(t, { a: 1, edge: ed, ...(o.kaur || {}) });
    bhimaC.set(t, { a: 0, edge: ed, ...(o.bhimaC || {}) });
    const bk = o.blaze ?? 0; blaze.visible = bk > .002; if (blaze.visible) { bf.forEach(f => f.set(t, bk)); bg.forEach((g, i) => { g.material.opacity = bk * [.8, .9, .45][i]; g.scale.setScalar([12, 6, 22][i] * (.6 + .4 * bk) * (1 + .06 * Math.sin(t * 8 + i))); }); }
    sw.set(t, o.swarm || {});
    md.set(t, o.mandala ?? 0, o.mandalaO || {});
    if (o.hero) hero.set(t, o.hero); else hero.group.visible = false;
    bow.visible = !!o.bow;
    if (o.mace) { mace.visible = true; mace.position.set(...o.mace.pos); mace.rotation.set(...(o.mace.rot || [0, 0, 0])); } else mace.visible = false;
    if (o.river) { riv.mesh.visible = true; riv.u.off.value = o.river.off ?? 0; riv.u.t.value = t; riv.u.fire.value = o.river.fire ?? 0; riv.u.churn.value = o.river.churn ?? 0; } else riv.mesh.visible = false;
    dust.set(t, o.dust ?? 0); embers.set(t, o.embers ?? 0);
    return o.exposure ?? 1;
  };
  return { scene, set, sky, pand, kaur, sw, md, hero, mace, bow, riv, glowL };
})();
