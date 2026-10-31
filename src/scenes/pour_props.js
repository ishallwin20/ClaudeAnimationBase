// pour_props.js: what "What you POUR on SHIVA decides what you GET" (ad 69) builds: a dark sanctum with a black stone
// linga on its pitha (the somasutra spout to the north, a brass bowl under it), two standing lamps and floor diyas
// behind for the lens to blur, a brass lota that tips; the liquids (water, ghee, milk, honey, sugarcane juice, oil,
// Ganga water) as a stream that falls in a true arc and thins as it falls, a film that runs down the stone from the
// crown in fingers, a pool in the pitha that runs out of the spout, and splashes; a thrown splash for the "not a
// splash" beat; an aarti plate for next. 2D: the drop row (the liquids named so far), marks, tags, the verse band, the
// screenshot board. Matte (owner, 30 Oct: nothing shiny): stone and brass rough, the environment dim, no fx bloom.

// ---------- the liquids ----------
// col / op: colour and opacity; rough; em / emK: a little light of its own (honey and ghee glow amber, as when lit
// through); r: the stream's radius at the bottom; speed: how fast its streaks run; wob: how much it ripples; front:
// how fast the film runs down the stone (the height a second, 0..1); drip: how long its fingers get; splash: spray;
// sheet: how much of the film is an even skin (the rest runs in rivulets, so the black stone shows between).
const LIQ = {
  water: { sheet: .1, name: 'WATER', col: '#A4BCC8', op: .32, rough: .05, em: '#1E3E4E', emK: .3, r: .011, speed: 5.5, wob: .22, front: 1.2, drip: .05, splash: 1, dot: '#9FD4EC' },
  ghee: { sheet: .08, name: 'GHEE', col: '#B88228', op: .72, rough: .22, em: '#7A4A0E', emK: .35, r: .009, speed: 3.2, wob: .1, front: .7, drip: .1, splash: .35, dot: '#F2C04A' },
  milk: { sheet: .22, name: 'MILK', col: '#F4F0E6', op: .97, rough: .32, em: '#000000', emK: 0, r: .013, speed: 4.2, wob: .12, front: .85, drip: .08, splash: .8, dot: '#FFFFFF' },
  honey: { sheet: .06, name: 'HONEY', col: '#7A3A06', op: .86, rough: .2, em: '#6A3006', emK: .45, r: .006, speed: 1.3, wob: .04, front: .26, drip: .16, splash: 0, dot: '#D88A1E' },
  cane: { sheet: .1, name: 'SUGARCANE', col: '#B4B46A', op: .76, rough: .3, em: '#3A3A10', emK: .2, r: .012, speed: 3.8, wob: .14, front: .8, drip: .08, splash: .6, dot: '#C8D46A' },
  oil: { sheet: .2, name: '?', col: '#3A2208', op: .92, rough: .15, em: '#000000', emK: 0, r: .008, speed: 2.2, wob: .06, front: .5, drip: .12, splash: .2, dot: '#8A1E1A' },
  ganga: { sheet: .12, name: 'GANGA JAL', col: '#B4D0DA', op: .38, rough: .05, em: '#3E7E9C', emK: .5, r: .015, speed: 6, wob: .2, front: 1.3, drip: .05, splash: 1, dot: '#BFEFFF' },
};
const ROW = ['water', 'ghee', 'milk', 'honey', 'cane', 'oil', 'ganga'];

// soft streaks for the liquids to scroll (neutral, so each liquid's colour tints them)
const liqTex3 = () => tex3('liq', 256, 64, (g) => {
  g.fillStyle = 'rgb(225,225,225)'; g.fillRect(0, 0, 256, 64);
  const r = lcg(69);
  for (let i = 0; i < 120; i++) { const y = r() * 64, x = r() * 256, l = 30 + r() * 110; g.strokeStyle = r() < .55 ? `rgba(255,255,255,${.3 + r() * .5})` : `rgba(120,120,120,${.15 + r() * .25})`; g.lineWidth = 1 + r() * 3; for (const dx of [0, -256]) { g.beginPath(); g.moveTo(x + dx, y); g.lineTo(x + dx + l, y); g.stroke(); } }
});
function liqMat3(o = {}) {
  const m = new THREE.MeshStandardMaterial({ map: liqTex3().rep(o.rep ?? 3, 1), transparent: true, depthWrite: false, metalness: 0, envMapIntensity: .5 });
  m.liquid = (id, a = 1) => { const L = LIQ[id]; m.color.set(L.col); m.opacity = L.op * a; m.roughness = L.rough; m.emissive.set(L.em); m.emissiveIntensity = L.emK; };
  m.liquid('water'); return m;
}

// tube3(parent): a stream rebuilt each frame. .pour(t, p0, p1, id, o): from the lip p0 to the point p1 (world), in a
// parabola (it leaves the lip sideways and falls), thinning as it speeds up; o.head / o.tail (0..1 along it: the front
// arriving, the end leaving), o.r (radius, else the liquid's), o.a (opacity). .off() hides it.
function tube3(parent, N = 80, M = 12) {
  const n = (N + 1) * (M + 1), P = new Float32Array(n * 3), Nn = new Float32Array(n * 3), U = new Float32Array(n * 2), idx = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + M + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry(); geo.setIndex(idx);
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(Nn, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(U, 2));
  const mat = liqMat3({ rep: 1 }), m = mesh3(parent, geo, mat, [0, 0, 0], { cast: false, receive: false }); m.frustumCulled = false; m.renderOrder = 3;
  const pt = (p0, p1, f) => [p0[0] + (p1[0] - p0[0]) * f, p0[1] - (p0[1] - p1[1]) * f * f, p0[2] + (p1[2] - p0[2]) * f];
  m.pour = (t, p0, p1, id, o = {}) => {
    const L = LIQ[id], h0 = clamp(o.head ?? 1), t0 = clamp(o.tail ?? 0); m.visible = h0 > t0 + .002; if (!m.visible) return;
    mat.liquid(id, o.a ?? 1); const r0 = o.r ?? L.r, len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
    let prev = null;
    for (let i = 0; i <= N; i++) {
      const f = lerp(t0, h0, i / N), c = pt(p0, p1, f), nx = pt(p0, p1, Math.min(1, f + .01)), pv = pt(p0, p1, Math.max(0, f - .01));
      // the tangent, and a frame round it
      let tx = nx[0] - pv[0], ty = nx[1] - pv[1], tz = nx[2] - pv[2]; const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
      const rf = Math.abs(tz) < .9 ? [0, 0, 1] : [1, 0, 0];
      let bx = ty * rf[2] - tz * rf[1], by = tz * rf[0] - tx * rf[2], bz = tx * rf[1] - ty * rf[0]; const bl = Math.hypot(bx, by, bz) || 1; bx /= bl; by /= bl; bz /= bl;
      const qx = by * tz - bz * ty, qy = bz * tx - bx * tz, qz = bx * ty - by * tx;
      // it ripples, and wanders a little more the further it falls
      const s = f * len, w = L.wob * (o.wob ?? 1);
      const rr = r0 * (1.55 - .55 * Math.sqrt(f)) * (1 + w * (.6 * Math.sin(s * 55 - t * 31) + .4 * Math.sin(s * 23 - t * 17 + 1))) * (i === 0 && t0 > 0 ? .3 : 1) * (i === N && h0 < 1 ? .5 : 1);
      const wx = w * .012 * f * Math.sin(s * 9 - t * 12), wz = w * .012 * f * Math.cos(s * 7 - t * 10);
      for (let j = 0; j <= M; j++) {
        const a = j / M * TAU, ca = Math.cos(a), sa = Math.sin(a), ox = ca * qx + sa * bx, oy = ca * qy + sa * by, oz = ca * qz + sa * bz, k = (i * (M + 1) + j);
        P[k * 3] = c[0] + wx + ox * rr; P[k * 3 + 1] = c[1] + oy * rr; P[k * 3 + 2] = c[2] + wz + oz * rr;
        Nn[k * 3] = ox; Nn[k * 3 + 1] = oy; Nn[k * 3 + 2] = oz; U[k * 2] = s * 4 - t * L.speed; U[k * 2 + 1] = j / M;
      }
      prev = c;
    }
    geo.attributes.position.needsUpdate = geo.attributes.normal.needsUpdate = geo.attributes.uv.needsUpdate = true;
  };
  m.off = () => { m.visible = false; };
  m.visible = false; return m;
}

// coat3(parent, profile): the film on the stone, a turned shell just over the linga (profile [[r, y], ...] in the
// linga's frame, y 0 at its foot). .set(t, id, front, o): front 0..1 (from the crown down to the pitha), o.a opacity,
// o.spots (0..1: wet blotches instead, the thrown splash; o.side, the angle they come from), o.drip (finger length).
function coat3(parent, profile, top) {
  const geo = lathe3(profile.map(([r, y]) => [r + .004, y + (y > top - .01 ? .004 : 0)]), 96);
  const mat = liqMat3({ rep: 2 }), U = { uSheet: { value: .4 }, uFront: { value: 0 }, uDrip: { value: .06 }, uT: { value: 0 }, uTop: { value: top + .004 }, uFlow: { value: 1 }, uSpot: { value: 0 }, uSide: { value: 0 } };
  mat.map = null;
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = 'varying vec3 vLp;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvLp = position;');
    sh.fragmentShader = `uniform float uSheet, uFront, uDrip, uT, uTop, uFlow, uSpot, uSide; varying vec3 vLp;
      float hh(float n) { return fract(sin(n) * 43758.5453); }
      float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); float n = i.x + i.y * 57.;
        return mix(mix(hh(n), hh(n + 1.), f.x), mix(hh(n + 57.), hh(n + 58.), f.x), f.y); }
      ` + sh.fragmentShader.replace('#include <alphatest_fragment>', `{
        float ang = atan(vLp.z, vLp.x);
        float fing = (.5 + .5 * sin(ang * 7. + 1.3)) * (.5 + .5 * sin(ang * 11. + 2.1)); fing = pow(fing, 1.4) + .25 * vn(vec2(ang * 5., 3.));
        float front = uTop - uFront * (uTop + .06), lim = front - uDrip * fing * clamp(uFront * 3., 0., 1.), edge = vLp.y - lim;
        if (uSpot > 0.) { float m = vn(vec2(ang * 9., vLp.y * 16.)) * .6 + vn(vec2(ang * 23., vLp.y * 40.)) * .4; m *= smoothstep(-.4, .7, cos(ang - uSide)); edge = m - (1. - uSpot * .75); }
        if (edge < 0.) discard;
        float rim = 1. - smoothstep(0., .014, edge), st = vn(vec2(ang * 10., vLp.y * 13. + uT * uFlow));
        // rivulets: bands down the stone that wander and pulse as they run; between them only a thin skin
        float rv = vn(vec2(ang * 9. + .4 * sin(vLp.y * 9. + ang * 3.), vLp.y * 2. + uT * uFlow * .3));
        rv = smoothstep(.58, .82, rv) * (.75 + .25 * st);
        float top = smoothstep(uTop - .07, uTop - .01, vLp.y);   // the crown, under the stream, is all wet
        float cov = mix(uSheet, 1., max(max(rv, top), rim));
        if (uSpot > 0.) cov = 1.;
        diffuseColor.rgb *= .9 + .18 * st + .2 * rim; diffuseColor.a *= cov;
      }
      #include <alphatest_fragment>`);
  };
  mat.customProgramCacheKey = () => 'coat3';
  const m = mesh3(parent, geo, mat, [0, 0, 0], { cast: false, receive: false }); m.renderOrder = 2;
  m.set = (t, id, front, o = {}) => {
    m.visible = front > .001 || (o.spots ?? 0) > 0; if (!m.visible) return;
    const L = LIQ[id]; mat.liquid(id, o.a ?? 1); U.uFront.value = clamp(front); U.uT.value = t; U.uFlow.value = -L.speed * .4;
    U.uDrip.value = o.drip ?? L.drip; U.uSheet.value = L.sheet; U.uSpot.value = o.spots ?? 0; U.uSide.value = o.side ?? 0;
  };
  m.off = () => { m.visible = false; };
  m.visible = false; return m;
}

// spray3(parent, n): drops thrown up where a stream lands. .at(t, p, id, k): k 0..1 how much (the liquid's own
// splash times k); the drops live a third of a second each, on a loop seeded per drop, so any frame renders alone.
function spray3(parent, n = 90) {
  const mat = liqMat3({ rep: 1 }), m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), mat, n); m.frustumCulled = false; m.renderOrder = 4; parent.add(m);
  const r = lcg(7), D = [...Array(n)].map(() => ({ L: .25 + r() * .25, ph: r(), a: r() * TAU, s: .15 + r() * .55, vy: .3 + r() * .9, sz: .002 + r() * .004 }));
  const o3 = new THREE.Object3D();
  m.at = (t, p, id, k = 1) => {
    const L = LIQ[id], amt = L.splash * k; m.visible = amt > .01; if (!m.visible) return; mat.liquid(id, Math.min(1, L.op + .3));
    D.forEach((d, i) => {
      const ph = frac(t / d.L + d.ph), tau = ph * d.L, on = i / n < amt;
      o3.position.set(p[0] + Math.cos(d.a) * d.s * tau, p[1] + d.vy * tau - 4.9 * tau * tau, p[2] + Math.sin(d.a) * d.s * tau);
      o3.scale.setScalar(on ? d.sz * (1 - ph * .6) : 0); o3.updateMatrix(); m.setMatrixAt(i, o3.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };
  m.off = () => { m.visible = false; };
  m.visible = false; return m;
}

// throw3(parent, n): a splash thrown from the side at the linga (the wrong way): drops fly from `from` toward points
// on the stone; most hit and stop there, some miss and fall past. .at(t, t0, from): t0 the throw.
function throw3(parent, n = 160) {
  const mat = liqMat3({ rep: 1 }), m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), mat, n); m.frustumCulled = false; m.renderOrder = 4; parent.add(m);
  const r = lcg(13), D = [...Array(n)].map(() => ({ a: (r() - .5) * 2.2, y: .45 + r() * .7, miss: r() < .3, dt: r() * .12, T: .26 + r() * .14, sz: .003 + r() * .008, sp: [r() - .5, r() - .5, r() - .5] }));
  const o3 = new THREE.Object3D();
  m.at = (t, t0, from) => {
    const age = t - t0; m.visible = age > 0 && age < 1.6; if (!m.visible) return; mat.liquid('water', .85);
    D.forEach((d, i) => {
      const a = Math.atan2(from[2], from[0]) + d.a, R = d.miss ? .6 : .25, tx = Math.cos(a) * R, tz = Math.sin(a) * R, ty = d.y + (d.miss ? (d.sp[1] - .5) * .4 : 0);
      const k = (age - d.dt) / d.T; let x, y, z, s = d.sz;
      if (k < 0) s = 0;
      else if (k < 1) { x = lerp(from[0], tx, k) + d.sp[0] * .1 * k; z = lerp(from[2], tz, k) + d.sp[2] * .1 * k; y = lerp(from[1], ty, k) + .25 * Math.sin(k * Math.PI); }
      else if (d.miss) { const q = (k - 1) * d.T; x = tx + (tx - from[0]) * q * 2; z = tz + (tz - from[2]) * q * 2; y = ty - 4.9 * q * q; s *= y > .4 ? 1 : 0; }
      else { const q = (k - 1) * d.T; x = tx; z = tz; y = ty - .2 * q; s *= Math.max(0, 1 - q * 3); }
      o3.position.set(x || 0, y || 0, z || 0); o3.scale.setScalar(s); o3.updateMatrix(); m.setMatrixAt(i, o3.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };
  m.visible = false; return m;
}

// ---------- the sanctum ----------
// a dark basalt for the linga: fine speckle and a soft mottle, roughness to match (matte, not polished)
const basaltTex3 = () => tex3('basalt', 512, 512, (g, w, h) => {
  g.fillStyle = '#26232A'; g.fillRect(0, 0, w, h); const r = lcg(5);
  for (let i = 0; i < 60; i++) { const x = r() * w, y = r() * h, rr = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rr), dk = r() > .5; gr.addColorStop(0, rgba(dk ? '#000000' : '#5A5560', .18)); gr.addColorStop(1, rgba('#000000', 0)); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  for (let i = 0; i < 14000; i++) { g.fillStyle = r() < .7 ? rgba('#000000', .3 + r() * .4) : rgba('#8A8490', .15 + r() * .2); g.fillRect(r() * w, r() * h, 1, 1); }
});
// sanctum3() → { scene, L (the pitha + linga group), set(t, o), coat, stream, drip, pool, run, spray, toss, lota, plate, ... }
function sanctum3() {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#050406');
  scene.fog = new THREE.Fog('#07060A', 4, 11);
  scene.environment = studioEnv3({ room: '#0A0806', boxes: [[-5, 6, 5, 6, 4, 2.2], [6, 3, 3, 2, 6, 1.6], [0, 9, 0, 5, 5, .9], [-6, 2, -6, 4, 3, .8]], floor: .3 }); scene.environmentIntensity = .45;
  const hemi = new THREE.HemisphereLight('#7A6C5E', '#20160E', .35); scene.add(hemi);
  // the key: a warm spot from the east, above the door; a cool rim from behind; a low warm bounce
  const key = new THREE.SpotLight('#FFD8B0', 30, 9, .55, .85, 1.6); key.position.set(2.6, 2.8, 1.2); key.target.position.set(0, .75, 0); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.radius = 4; scene.add(key, key.target);
  const rim = new THREE.SpotLight('#C8D4FF', 11, 8, .5, .9, 1.6); rim.position.set(-2.2, 2.4, -1.6); rim.target.position.set(0, .8, 0); scene.add(rim, rim.target);
  const bounce = new THREE.PointLight('#FF9A50', 1.2, 3, 1.6); bounce.position.set(1, .25, .4); scene.add(bounce);
  // the room: a granite floor, walls of big blocks to the west, north and south, a niche with a lamp in the west wall
  const flr = stone3({ col: '#3A342E', rows: 4, cols: 4, seed: 3, rep: [4, 4], rough: .9, mottle: 1.2 });
  mesh3(scene, new THREE.PlaneGeometry(12, 12), flr, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const wall = (s) => stone3({ col: '#3E3832', rows: 6, cols: 3, seed: s, rep: [2, 2], rough: .92 });
  block3(scene, .4, 3.4, 6, wall(4), [-2.6, 0, 0]);
  block3(scene, 6, 3.4, .4, wall(5), [0, 0, -2.6]); block3(scene, 6, 3.4, .4, wall(6), [0, 0, 2.6]);
  block3(scene, .3, .7, .6, new THREE.MeshStandardMaterial({ color: '#0C0A0A', roughness: 1 }), [-2.38, 1.2, 0], { cast: false });
  const lamps = [flame3(scene, [-2.3, 1.22, 0], .8, { power: 1.6, range: 3 })];
  // two standing brass lamps behind, either side; diyas along the floor behind
  const brass = new THREE.MeshStandardMaterial({ color: '#8C6A36', metalness: .45, roughness: .56, envMapIntensity: .4 });
  for (const z of [-.95, .95]) {
    mesh3(scene, lathe3(smooth3([[0, 0], [.16, 0], [.16, .03], [.06, .07], [.03, .12], [.03, .92], [.06, .96], [.03, .99], [.14, 1.03], [.16, 1.07], [0, 1.06]], 3), 32), brass, [-.85, 0, z]);
    lamps.push(flame3(scene, [-.85, 1.1, z], .9, { power: 2.4, range: 4, shadow: false }));
  }
  const dish = lathe3([[0, 0], [.05, 0], [.07, .02], [.1, .035], [.1, .045], [.08, .04], [0, .035]], 24);
  for (let i = -3; i <= 3; i++) { const x = -1.9, z = i * .55; mesh3(scene, dish, brass, [x, 0, z]); lamps.push(flame3(scene, [x, .04, z], 1, { light: i % 3 === 0, power: 1.2, range: 2.4 })); }

  // the pitha and the linga (as cine3d_temple.js's, a little less polished), the spout to the north
  const L = new THREE.Group(); scene.add(L);
  const black = new THREE.MeshStandardMaterial({ color: '#2C2A2E', map: basaltTex3().rep(2, 2), roughness: .52, metalness: 0, envMapIntensity: .22 });
  mesh3(L, lathe3(smooth3([[0, 0], [.52, 0], [.52, .07], [.44, .1], [.42, .2], [.58, .26], [.6, .34], [.56, .37], [.3, .35], [0, .35]], 3), 64), black, [0, 0, 0]);
  block3(L, .26, .08, .62, black, [0, .27, -.78]);
  mesh3(L, new THREE.CylinderGeometry(.13, .13, .08, 24, 1, false, Math.PI / 2, Math.PI), black, [0, .31, -1.09]);
  block3(L, .1, .012, .8, new THREE.MeshStandardMaterial({ color: '#0E0D0E', roughness: .6 }), [0, .35, -.72], { cast: false });
  const bowl = mesh3(scene, lathe3([[0, 0], [.08, 0], [.12, .03], [.15, .08], [.14, .085], [.11, .04], [0, .02]], 32), brass, [0, 0, -1.32]);
  const linga = new THREE.Group(); linga.position.y = .34; L.add(linga);
  const lp = [[0, 0], [.24, 0]]; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI / 2; lp.push([.24 * Math.cos(a), .44 + .3 * Math.sin(a)]); }
  const TOP = .74;
  mesh3(linga, lathe3([...lp, [0, TOP]], 96), black, [0, 0, 0]);
  // the tripundra on the east face, a red dot; a marigold garland round its foot
  const ash = new THREE.MeshStandardMaterial({ color: '#D8D0C0', roughness: .95 });
  for (let i = 0; i < 3; i++) mesh3(linga, new THREE.TorusGeometry(.242, .007, 6, 24, 1.5), ash, [0, .42 + i * .055, 0], { rot: [Math.PI / 2, 0, -.75], cast: false });
  mesh3(linga, new THREE.SphereGeometry(.022, 12, 8), new THREE.MeshStandardMaterial({ color: '#B21E26', roughness: .6 }), [.237, .5, 0], { cast: false });
  const mari = [new THREE.MeshStandardMaterial({ color: '#F09A1E', roughness: .85 }), new THREE.MeshStandardMaterial({ color: '#E2601A', roughness: .85 })];
  for (let i = 0; i < 34; i++) { const a = i / 34 * TAU; mesh3(linga, new THREE.IcosahedronGeometry(.03, 1), mari[i % 2], [Math.cos(a) * .27, .035, Math.sin(a) * .27]); }

  // the liquids
  const coat = coat3(linga, lp, TOP);
  const stream = tube3(scene), drip = tube3(scene, 30, 10), spray = spray3(scene), toss = throw3(scene);
  const poolMat = liqMat3({ rep: 3 }), pool = mesh3(L, new THREE.RingGeometry(.25, .555, 64), poolMat, [0, .357, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); pool.renderOrder = 1;
  const runMat = liqMat3({ rep: 3 }), run = mesh3(L, new THREE.PlaneGeometry(.085, .72), runMat, [0, .358, -.78], { rot: [-Math.PI / 2, 0, 0], cast: false }); run.renderOrder = 1;
  // the stream lands just off the crown's top, on the east (the camera's) side
  const CROWN = [.03, .34 + TOP, .0];

  // the lota: a turned brass vessel, its lip at the group's origin, so it tips about the lip
  const lota = new THREE.Group(); scene.add(lota); lota.rotation.order = 'YXZ';
  const lprof = [[0, 0], [.055, 0], [.07, .015], [.1, .05], [.115, .1], [.105, .145], [.075, .175], [.052, .19], [.05, .2], [.065, .214], [.076, .224], [.07, .228], [.05, .21], [0, .205]];
  mesh3(lota, lathe3(smooth3(lprof, 3), 48), new THREE.MeshStandardMaterial({ color: '#8C6A36', metalness: .45, roughness: .56, envMapIntensity: .4, side: THREE.DoubleSide }), [-.076, -.226, 0]);
  // tip(p, toward, tilt): the lip at p, facing the point `toward`, tipped by tilt (radians); returns the pour point
  lota.tip = (p, toward, tilt) => {
    lota.visible = true; lota.position.set(...p); lota.rotation.set(0, Math.atan2(-(toward[2] - p[2]), toward[0] - p[0]), -tilt);
    lota.updateMatrixWorld(); return lota.localToWorld(V3(.006, -.004, 0)).toArray();
  };

  // the aarti plate: a brass plate with five wicks, for next
  const plate = new THREE.Group(); scene.add(plate);
  mesh3(plate, lathe3([[0, 0], [.16, 0], [.18, .012], [.19, .02], [.17, .02], [0, .012]], 48), brass, [0, 0, 0]);
  const wicks = [0, 1, 2, 3, 4].map(i => { const a = i / 5 * TAU, x = i ? Math.cos(a) * .1 : 0, z = i ? Math.sin(a) * .1 : 0; mesh3(plate, dish, brass, [x, .012, z], { scale: .45 }); return flame3(plate, [x, .03, z], .55, { light: i === 0, power: 1.6, range: 2.2 }); });
  plate.visible = false;

  const reset = () => { coat.off(); stream.off(); drip.off(); spray.off(); toss.visible = false; pool.visible = run.visible = false; lota.visible = false; plate.visible = false; };
  // set(t, o): lamps (0..1), key / rim (multipliers), col (the key's colour)
  const set = (t, o = {}) => {
    lamps.forEach(l => l.set(t, o.lamps ?? 1));
    key.intensity = 30 * (o.key ?? 1); rim.intensity = 11 * (o.rim ?? 1); key.color.set(o.col || '#FFD8B0'); rim.color.set(o.rimCol || '#C8D4FF');
    hemi.intensity = .35 * (o.hemi ?? 1); bounce.intensity = 1.2 * (o.key ?? 1); scene.environmentIntensity = .45 * (o.env ?? 1);
  };
  // wet(t, id, k): the liquid down the stone (film front k 0..1), then filling the pitha and running out of the spout
  const wet = (t, id, k, o = {}) => {
    coat.set(t, id, k, o);
    const pk = clamp((k - .75) * 3), rk = clamp((k - .9) * 6);
    pool.visible = pk > .01; if (pool.visible) { poolMat.liquid(id, pk * .75 * (o.a ?? 1)); poolMat.map.offset.x = t * .05; poolMat.map.rotation = t * .02; }
    run.visible = rk > .01; if (run.visible) { runMat.liquid(id, rk * (o.a ?? 1)); runMat.map.offset.x = -t * LIQ[id].speed * .2; runMat.map.rotation = Math.PI / 2; }
    if (rk > .5) drip.pour(t, [0, .345, -1.17], [0, .06, -1.32], id, { r: LIQ[id].r * .5, head: clamp((rk - .5) * 3) }); else drip.off();
  };
  return { scene, L, linga, TOP, CROWN, key, rim, hemi, coat, stream, drip, spray, toss, pool, run, lota, plate, wicks, lamps, set, wet, reset };
}

// ---------- 2D: the drop row, marks, tags, the verse band, the board ----------
// a drop at (x, y), s px tall, filled with col (a = alpha; q: a question mark in it)
function drop(c, x, y, s, col, a = 1, o = {}) {
  if (a <= 0) return;
  c.save(); c.translate(x, y); c.globalAlpha *= a; const k = s / 100;
  const p = new Path2D(`M 0 ${-50 * k} C ${22 * k} ${-20 * k} ${36 * k} ${2 * k} ${36 * k} ${18 * k} C ${36 * k} ${40 * k} ${20 * k} ${52 * k} 0 ${52 * k} C ${-20 * k} ${52 * k} ${-36 * k} ${40 * k} ${-36 * k} ${18 * k} C ${-36 * k} ${2 * k} ${-22 * k} ${-20 * k} 0 ${-50 * k} Z`);
  c.shadowColor = o.glow || col; c.shadowBlur = o.blur ?? s * .3; c.fillStyle = col; c.fill(p); c.shadowBlur = 0;
  c.strokeStyle = 'rgba(12,8,6,.85)'; c.lineWidth = Math.max(2, s * .05); c.stroke(p);
  c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-12 * k, 14 * k, 6 * k, 11 * k, .4, 0, TAU); c.fill();
  c.restore();
  if (o.q) text(c, '?', x, y + 14 * s / 100, `700 ${Math.round(s * .5)}px Cinzel`, '#FFE2A0', { alpha: a });
}
// the row of drops at the top of the safe band: the liquids named so far (shown[i] = the time it was named, or null)
function dropRow(c, t, shown, o = {}) {
  const n = ROW.length, gap = o.gap ?? 118, x0 = 470 - (n - 1) * gap / 2, y = o.y ?? 470;
  ROW.forEach((id, i) => {
    const at = shown[i], x = x0 + i * gap;
    if (at == null || t < at) { drop(c, x, y, 64, 'rgba(255,240,220,.12)', (o.alpha ?? 1) * .9, { blur: 0 }); return; }
    const k = popK(t - at), cur = o.cur === i;
    drop(c, x, y - (cur ? 6 : 0), (cur ? 84 : 64) * k, LIQ[id].dot, o.alpha ?? 1, { q: id === 'oil', blur: cur ? 26 : 10 });
  });
}
function mark(c, ok, x, y, s, t, at, o = {}) {
  if (t < at) return;
  const age = t - at, k = age < .12 ? lerp(1.8, 1, easeOut(age / .12)) : 1, a = (o.alpha ?? 1) * clamp(age / .06);
  const col = ok ? '#FFD45A' : '#FF3A2E';
  c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= a; c.lineCap = 'round'; c.lineJoin = 'round';
  const p = new Path2D(ok ? `M ${-s * .4} ${0} L ${-s * .1} ${s * .3} L ${s * .45} ${-s * .35}` : `M ${-s * .38} ${-s * .38} L ${s * .38} ${s * .38} M ${s * .38} ${-s * .38} L ${-s * .38} ${s * .38}`);
  c.fillStyle = 'rgba(14,8,8,.6)'; c.beginPath(); c.arc(0, 0, s * .62, 0, TAU); c.fill(); c.strokeStyle = col; c.lineWidth = s * .06; c.stroke();
  c.strokeStyle = 'rgba(10,4,4,.85)'; c.lineWidth = s * .2; c.stroke(p);
  c.strokeStyle = col; c.lineWidth = s * .13; c.shadowColor = col; c.shadowBlur = s * .25; c.stroke(p);
  c.restore();
}
// a source tag: a dark pill with a gold edge, small capitals
function tag(c, txt, x, y, t, at, o = {}) {
  if (t < at) return;
  const k = popK(t - at), a = o.alpha ?? 1, col = o.col || '#F4C46A', f = `700 ${o.size || 26}px Cinzel`;
  c.save(); c.font = f; c.letterSpacing = '2px'; const w = c.measureText(txt).width + 50, h = (o.size || 26) * 1.7;
  c.translate(x, y); c.scale(k, k); c.globalAlpha *= a;
  c.fillStyle = 'rgba(16,10,8,.82)'; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, h / 2); c.fill(); c.stroke();
  c.restore();
  text(c, txt, x, y + 2, f, col, { alpha: a * Math.min(1, k), spacing: 2, maxW: 900 });
}
// a quote or verse on a dark band: lines [[txt, font, col], ...] from y, dy apart
function verse(c, lines, y, t, at, o = {}) {
  const a = seg(t, at, at + .4) * (1 - seg(t, o.out ?? 1e9, (o.out ?? 1e9) + .4)) * (o.alpha ?? 1); if (a <= 0) return;
  band(c, y - 80, y + lines.length * (o.dy || 58) + 30, .72 * a);
  lines.forEach(([s, f, col], i) => text(c, s, 540, y + i * (o.dy || 58), f, col, { alpha: a, maxW: 900, glow: ['rgba(6,5,10,.9)', 14] }));
}
// a dark band behind 2D lettering (y0..y1, fading at both ends)
function band(c, y0, y1, a = .6) {
  c.save(); const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(6,5,10,0)'); g.addColorStop(.25, `rgba(6,5,10,${a})`); g.addColorStop(.75, `rgba(6,5,10,${a})`); g.addColorStop(1, 'rgba(6,5,10,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
function seriesTag(c, txt, t, at, o = {}) {
  const k = popK(t - at), w = o.w || 500;
  c.save(); c.translate(540, o.y || 470); c.scale(k, k); c.fillStyle = 'rgba(20,12,8,.72)'; c.strokeStyle = 'rgba(244,196,106,.85)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.stroke(); c.restore();
  text(c, txt, 540, (o.y || 470) + 2, '700 36px Cinzel', '#F4C46A', { spacing: 2, alpha: Math.min(1, k) });
}

// ---------- the screenshot board ----------
const BOARD = [
  ['water', 'WATER', 'eases fever', '14.68'],
  ['ghee', 'GHEE', 'the family flourishes', '14.72'],
  ['milk', 'MILK + SUGAR', 'a sharp mind', '14.74'],
  ['honey', 'HONEY', 'wealth, like Kubera', '14.80'],
  ['cane', 'SUGARCANE', 'every joy', '14.80'],
  ['ganga', 'GANGA JAL', 'joys AND moksha', '14.81'],
  ['oil', 'MUSTARD OIL', 'defeats enemies', '14.79'],
];
function board(c, t, t0, o = {}) {
  const a = seg(t, t0, t0 + .35) * (o.alpha ?? 1); if (a <= 0) return;
  const x0 = 50, x1 = 930, y0 = o.y0 ?? 470, rh = 94, hgt = 140 + rh * BOARD.length + 110;
  c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(12,8,10,.88)'; c.strokeStyle = 'rgba(244,196,106,.8)'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(x0, y0 - 60, x1 - x0, hgt, 34); c.fill(); c.stroke(); c.restore();
  text(c, 'WHAT YOU POUR ON SHIVA', (x0 + x1) / 2, y0, '700 40px Cinzel', '#F4C46A', { alpha: a, spacing: 2 });
  text(c, 'and what you get', (x0 + x1) / 2, y0 + 50, 'italic 34px Marcellus', '#FFF3DC', { alpha: a });
  BOARD.forEach(([id, name, gift, v], i) => {
    const y = y0 + 135 + i * rh, ai = a * seg(t, t0 + .2 + i * .1, t0 + .45 + i * .1);
    if (i) { c.save(); c.globalAlpha *= ai; c.strokeStyle = 'rgba(244,196,106,.22)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 30, y - rh / 2); c.lineTo(x1 - 30, y - rh / 2); c.stroke(); c.restore(); }
    drop(c, x0 + 70, y, 54, LIQ[id].dot, ai, { blur: 8 });
    c.save(); c.font = '700 38px Cinzel'; c.letterSpacing = '1px'; const nw = c.measureText(name).width; c.restore();
    text(c, name, x0 + 130 + nw / 2, y - 15, '700 38px Cinzel', id === 'oil' ? '#FF8A70' : '#FFE2A0', { alpha: ai, spacing: 1 });
    c.save(); c.font = '34px Marcellus'; const gw = c.measureText(gift).width; c.restore();
    text(c, gift, x0 + 130 + gw / 2, y + 22, '34px Marcellus', '#FFF3DC', { alpha: ai });
    text(c, v, x1 - 80, y + 4, '700 28px Cinzel', '#CFC2B0', { alpha: ai * .9 });
  });
  const yb = y0 + 135 + rh * BOARD.length - 18;
  text(c, 'In a stream · Mahamrityunjaya, 10,000 times', (x0 + x1) / 2, yb, '32px Marcellus', '#FFE2A0', { alpha: a, maxW: 840 });
  text(c, 'Shiva Purana, Rudra Samhita, Srishti Khanda 14', (x0 + x1) / 2, yb + 46, '28px Marcellus', '#CFC2B0', { alpha: a, maxW: 840 });
}
