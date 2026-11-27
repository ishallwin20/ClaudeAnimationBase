// cine3d_mandir.js: a Nagara (Maru-Gurjara) temple built of real stone blocks for the 3D style, made for the 12
// JYOTIRLINGAS series (JYOTIRLINGA_SERIES.md). Every block is an instance that knows where it rests, so the temple can fly
// apart (the raiders: `brk` with mode 'break') and fly back together course by course (the rebuilders: mode 'build').
// Load after cine3d.js and cine3d_fx.js (pbr3, env3).
//
//   const M = mandir3(scene, o)     a group; the temple faces east (+x), the sanctum's centre at the origin. o.stone (the
//                                   sandstone's colour), o.seed. M.at.{ top, sanctum, mandapa, door, kalash, flag } anchors.
//   M.set(t, { brk, mode, keep, flag, dust, lit })
//       brk 0..1: how far the blocks have flown (0 standing, 1 rubble on the ground); mode 'break' (top first, flying out
//       fast) or 'build' (the same rubble rising back, bottom courses first); keep: blocks resting below this height never
//       move (a ruin keeps its plinth); flag: the flag's wind (0..1); dust: the dust clouds' strength; lit: lamps on.
//   somWorld3(o) → { scene, sun, hemi, fill, sea, ground, mood(name, o) }: the shore at Somnath: a paved court, the sea wall
//                                   with the Baan Stambh (its arrow pointing south over the sea), the Arabian Sea; moods
//                                   'golden' (the evening HDRI, the sun low in the west over the sea), 'night' (the night2
//                                   HDRI, firelight), 'blue' (lamps at blue hour). W.stambh: the arrow pillar.
//   raiders3(parent, n, o)           faceless shadow raiders: black silhouettes (cloaks, spears, horsemen) with torches,
//                                   no faces, no flags, no dress or symbol of any faith (the series' rule). .set(t, { on, walk, fade })

const MD_COL = { stone: '#E2C48E', dark: '#3A2A1C', gold: '#C9963E', flag: '#F2761C' };

// ---------- carved stone (colour with the relief baked in, lit from above) ----------
// emboss: a shape drawn as a dark lower edge, a light upper edge and its face
function mdEmboss(g, path, base, k = 1) {
  g.save(); g.translate(0, 2.5 * k); g.fillStyle = 'rgba(40,24,10,.7)'; g.fill(path); g.restore();
  g.save(); g.translate(0, -1.6 * k); g.fillStyle = 'rgba(255,248,230,.55)'; g.fill(path); g.restore();
  g.fillStyle = base; g.fill(path);
}
function mdNoise(g, w, h, seed, a = .12) {
  const r = lcg(seed); for (let i = 0; i < w * h / 60; i++) { const v = r() > .5 ? 255 : 0; g.fillStyle = `rgba(${v},${v * .9},${v * .75},${a * r()})`; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 2); }
  for (let i = 0; i < 30; i++) { const x = r() * w, y = r() * h, rr = 20 + r() * 80, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(90,60,30,${.08 * r()})`); gr.addColorStop(1, 'rgba(90,60,30,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
}
// a little standing figure (a dancer / a deity in a niche): head, crown, hips swayed, arms
function mdFigure(g, x, y, s) {
  const p = new Path2D();
  p.ellipse(x, y - s * .82, s * .09, s * .1, 0, 0, TAU);                 // head
  p.moveTo(x - s * .06, y - s * .95); p.lineTo(x, y - s * 1.06); p.lineTo(x + s * .06, y - s * .95); p.closePath();   // crown
  p.moveTo(x - s * .13, y - s * .7); p.quadraticCurveTo(x - s * .2, y - s * .45, x - s * .1, y - s * .32);   // torso
  p.lineTo(x - s * .2, y); p.lineTo(x + s * .18, y); p.lineTo(x + s * .12, y - s * .32); p.quadraticCurveTo(x + s * .2, y - s * .5, x + s * .13, y - s * .7); p.closePath();
  p.moveTo(x - s * .13, y - s * .66); p.lineTo(x - s * .32, y - s * .5); p.lineTo(x - s * .28, y - s * .45); p.lineTo(x - s * .11, y - s * .56); p.closePath();   // arms
  p.moveTo(x + s * .13, y - s * .66); p.lineTo(x + s * .3, y - s * .86); p.lineTo(x + s * .34, y - s * .82); p.lineTo(x + s * .12, y - s * .56); p.closePath();
  return p;
}
const mdRect = (x, y, w, h) => { const p = new Path2D(); p.rect(x, y, w, h); return p; };
// the textures: wall (a row of niches with figures between pilasters, mouldings), spire (the jala: a mesh of horseshoe
// gavaksha arches, one course a tile), plinth (bead and lotus bands, a frieze of elephants), plain (ashlar)
function mdTex(kind) {
  return tex3('md_' + kind, 512, 512, (g, w, h) => {
    const B = '#D8C8AC'; g.fillStyle = B; g.fillRect(0, 0, w, h);
    const band = (y, hh, c = '#E2D4BA') => mdEmboss(g, mdRect(0, y, w, hh), c);
    if (kind === 'wall') {
      band(0, 26); band(470, 42); band(446, 18, '#D2C1A2');
      for (let i = 0; i < 4; i++) {
        const x0 = i * 128;
        mdEmboss(g, mdRect(x0 + 2, 40, 18, 400), '#E4D6BC');                        // pilaster
        g.fillStyle = 'rgba(60,40,20,.55)'; g.fillRect(x0 + 30, 70, 86, 340);         // the niche's shadow
        mdEmboss(g, mdRect(x0 + 26, 54, 94, 20), '#E4D6BC');                          // its lintel
        const p = new Path2D(); p.moveTo(x0 + 30, 70); p.lineTo(x0 + 73, 44); p.lineTo(x0 + 116, 70); p.closePath(); mdEmboss(g, p, '#E0D0B2');
        mdEmboss(g, mdFigure(g, x0 + 73, 396, 300), '#DCCBAE', 1.4);                  // the figure
        mdEmboss(g, mdRect(x0 + 40, 398, 66, 14), '#E2D2B6');                         // its pedestal
      }
    } else if (kind === 'spire') {
      // one course: a moulding on top, a row of three horseshoe gavakshas (the jala), a joint below
      band(0, 46, '#E0D2B6'); g.fillStyle = 'rgba(60,40,18,.5)'; g.fillRect(0, 46, w, 6);
      for (let i = 0; i < 3; i++) {
        const cx = i * 171 + 85, cy = 210, r = 66;
        const p = new Path2D(); p.arc(cx, cy, r, Math.PI * .92, Math.PI * 2.08); p.lineTo(cx + r * .92, 448); p.lineTo(cx - r * .92, 448); p.closePath();
        mdEmboss(g, p, '#E5D8BE', 1.6);
        const q = new Path2D(); q.arc(cx, cy + 10, r * .66, Math.PI, TAU); q.lineTo(cx + r * .66, 420); q.lineTo(cx - r * .66, 420); q.closePath();
        g.fillStyle = 'rgba(66,42,18,.5)'; g.fill(q);
        const d = new Path2D(); d.arc(cx, cy + 70, 22, 0, TAU); mdEmboss(g, d, '#E8DCC4', 1.2);
        const f = new Path2D(); f.moveTo(cx - 8, cy - r - 4); f.lineTo(cx, cy - r - 30); f.lineTo(cx + 8, cy - r - 4); f.closePath(); mdEmboss(g, f, '#E5D8BE');
      }
      g.fillStyle = 'rgba(50,32,14,.6)'; g.fillRect(0, 486, w, 26);
    } else if (kind === 'plinth') {
      band(0, 30); band(40, 34, '#DDCDB0');
      for (let i = 0; i < 26; i++) { const p = new Path2D(); p.ellipse(i * 20 + 10, 57, 8, 14, 0, 0, TAU); mdEmboss(g, p, '#E6D8BE'); }   // beads
      for (let i = 0; i < 4; i++) {   // the elephant frieze (gajathara)
        const x = i * 128 + 64, y = 210, p = new Path2D();
        p.ellipse(x, y, 46, 34, 0, 0, TAU); p.ellipse(x + 44, y - 12, 22, 22, 0, 0, TAU);
        p.rect(x + 54, y - 6, 10, 58); p.rect(x - 38, y + 10, 16, 46); p.rect(x - 8, y + 14, 16, 42); p.rect(x + 18, y + 12, 16, 44);
        mdEmboss(g, p, '#E0D0B4', 1.4);
      }
      g.fillStyle = 'rgba(70,46,22,.35)'; g.fillRect(0, 140, w, 8); g.fillRect(0, 266, w, 8);
      for (let i = 0; i < 17; i++) { const p = new Path2D(); const x = i * 32; p.moveTo(x, 360); p.quadraticCurveTo(x + 16, 290, x + 32, 360); p.closePath(); mdEmboss(g, p, '#E4D6BC'); }   // lotus petals
      band(372, 40, '#DCCCAE'); band(430, 82, '#E0D2B6');
    } else {
      for (let y = 0; y < h; y += 128) { g.fillStyle = 'rgba(80,56,30,.35)'; g.fillRect(0, y, w, 3); for (let x = ((y / 128) % 2) * 128; x < w; x += 256) g.fillRect(x, y, 3, 128); }
    }
    mdNoise(g, w, h, kind.length * 7 + 3);
  });
}

// a stone material for instanced blocks: the texture is laid in world space from where the block RESTS (aRest: x, y, z,
// yaw; aSize), so it stays glued to the stone while the block flies. rep: [metres a tile across, metres a tile up].
function mdMat(kind, rep, o = {}) {
  const m = new THREE.MeshStandardMaterial({ color: o.col || MD_COL.stone, roughness: o.rough ?? .92, metalness: o.metal ?? 0, map: o.noTex ? null : mdTex(kind), envMapIntensity: o.env ?? .45 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uRep = { value: new THREE.Vector2(1 / rep[0], 1 / rep[1]) }; sh.uniforms.uOff = { value: new THREE.Vector2(...(o.off || [0, 0])) }; sh.uniforms.uPer = { value: o.per ? 1 : 0 };
    sh.vertexShader = 'attribute vec4 aRest; attribute vec3 aSize; varying vec2 vRU; varying float vPV;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      { vec3 lp = position * aSize; float cy = cos(aRest.w), sy = sin(aRest.w);
        vec3 rp = vec3(cy * lp.x + sy * lp.z, lp.y, -sy * lp.x + cy * lp.z) + aRest.xyz;
        vec3 rn = vec3(cy * normal.x + sy * normal.z, normal.y, -sy * normal.x + cy * normal.z);
        vRU = abs(rn.y) > .6 ? rp.xz : (abs(rn.x) > abs(rn.z) ? vec2(rp.z * sign(rn.x), rp.y) : vec2(-rp.x * sign(rn.z), rp.y));
        vPV = (rp.y - aRest.y) / aSize.y + .5; }`);
    sh.fragmentShader = 'uniform vec2 uRep, uOff; uniform float uPer; varying vec2 vRU; varying float vPV;\n' + sh.fragmentShader.replace('#include <map_fragment>',
      '#ifdef USE_MAP\n vec2 mu = vec2((vRU.x + uOff.x) * uRep.x, uPer > .5 ? vPV : (vRU.y + uOff.y) * uRep.y); vec4 sampledDiffuseColor = texture2D(map, mu); diffuseColor *= sampledDiffuseColor;\n#endif');
  };
  m.customProgramCacheKey = () => 'md_' + kind + rep.join(',') + (o.per ? 'p' : '');
  return m;
}

// unit geometries (centred on y 0, height 1) for the turned and the ribbed parts
const MD_GEO = (() => {
  const L = (P, n = 40) => { const g = lathe3(P, n); g.translate(0, -.5, 0); g.computeVertexNormals(); return g; };
  const amal = (() => {   // the amalaka: a ribbed, squashed disc
    const g = lathe3([[0, 0], [.7, .02], [.93, .14], [1, .5], [.93, .86], [.7, .98], [0, 1]], 64); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), k = 1 + .07 * Math.cos(a * 36); p.setX(i, x * k); p.setZ(i, z * k); }
    g.translate(0, -.5, 0); g.computeVertexNormals(); return g;
  })();
  return {
    box: new THREE.BoxGeometry(1, 1, 1), amal,
    dome: L([[1, 0], [.99, .12], [.9, .36], [.7, .58], [.46, .74], [.26, .84], [.3, .89], [.12, .95], [.04, 1]]),
    kalash: L([[0, 0], [.5, .02], [.86, .16], [1, .36], [.86, .54], [.36, .64], [.3, .7], [.56, .74], [.24, .8], [.16, .9], [.06, 1]]),
    pillar: (() => { const g = new THREE.CylinderGeometry(.5, .5, 1, 8); g.rotateY(Math.PI / 8); return g; })(),
  };
})();

// ---------- the temple ----------
function mandir3(scene, o = {}) {
  const G = new THREE.Group(); scene.add(G);
  const R = lcg(o.seed ?? 5), B = [];   // blocks: { k (kind), x, y, z, yaw, sx, sy, sz }
  const add = (k, x, y, z, sx, sy, sz, yaw = 0) => B.push({ k, x, y, z, yaw, sx, sy, sz });
  // one course of a stepped (pancha-ratha) plan: the corner, the pratiratha, the bhadra (projecting most) on each side;
  // y is the course's foot, h its height; o2.e scales the projections; side faces skip: [+x, +z, -x, -z]
  const course = (k, cx, cz, y, h, half, o2 = {}) => {
    const b = half * .3, p = half * .22, c = half - b - p, e1 = half * .13 * (o2.e ?? 1), e2 = half * .065 * (o2.e ?? 1), th = Math.min(1.6, half * .4);
    const zones = [[-half, -half + c, 0], [-half + c, -b, e2], [-b, b, e1], [b, half - c, e2], [half - c, half, 0]];
    for (let s = 0; s < 4; s++) {
      if (o2.skip && o2.skip[s]) continue;
      const yaw = s * Math.PI / 2, cs = Math.cos(yaw), sn = Math.sin(yaw);
      for (const [z0, z1, e] of zones) {
        const len = z1 - z0, n = len > 4.5 ? 2 : 1;
        for (let j = 0; j < n; j++) {
          const za = z0 + len * j / n, zb = z0 + len * (j + 1) / n, d = half + e - th / 2 - .01 * s;
          // local (d, za..zb) on the +x side, turned to side s
          const lx = d, lz = (za + zb) / 2;
          add(k, cx + lx * cs + lz * sn, y + h / 2, cz - lx * sn + lz * cs, th + 0 * e, h, zb - za + (e ? 0 : .02), yaw);
        }
      }
    }
    if (half > th * 1.2 && !o2.hollow) add('core', cx, y + h / 2, cz, (half - th) * 2 + .1, h, (half - th) * 2 + .1);   // the core
  };
  // a straight-sided rectangular course (the jagati, the antarala): edges in blocks of ≤ 4 m
  const rect = (k, x0, x1, z0, z1, y, h, th = 1.2) => {
    const edge = (ax, az, bx, bz, nx, nz) => { const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / 4)); for (let j = 0; j < n; j++) { const u = (j + .5) / n, x = lerp(ax, bx, u) - nx * th / 2, z = lerp(az, bz, u) - nz * th / 2; const along = Math.abs(bx - ax) > Math.abs(bz - az); add(k, x, y + h / 2, z, along ? L / n + .02 : th, h, along ? th : L / n + .02); } };
    edge(x0, z1, x1, z1, 0, 1); edge(x0, z0, x1, z0, 0, -1); edge(x1, z0, x1, z1, 1, 0); edge(x0, z0, x0, z1, -1, 0);
  };
  // walls: the plinth's mouldings, the wall of niches, the cornice
  const WALLP = [[.45, .95, 'plinth'], [.55, .7, 'plinth'], [.7, .5, 'plinth'], [.6, .3, 'plinth'], [.5, .12, 'plain'],
    [1.6, 0, 'wall'], [1.6, 0, 'wall'], [1.6, 0, 'wall'], [1.4, 0, 'wall'], [.45, .3, 'plain'], [.4, .55, 'plain'], [.35, .7, 'plain']];
  const walls = (cx, cz, y0, half, o2 = {}) => { let y = y0; for (const [h, d, k] of (o2.prof || WALLP)) { course(k, cx, cz, y, h, half + d, o2); y += h; } return y; };
  // a curved spire: n courses tapering on the rekha curve, bhumi-amalakas on the corners, the neck, the amalaka, the kalasha
  const spire = (cx, cz, y0, H, half0, o2 = {}) => {
    const ch = o2.ch ?? .9, n = Math.round(H / ch), taper = o2.taper ?? .6, pw = o2.pow ?? 1.6; let half = half0;
    for (let i = 0; i < n; i++) {
      const u = i / n; half = half0 * (1 - taper * Math.pow(u, pw)); const y = y0 + i * ch;
      course('spire', cx, cz, y, ch, half, { e: 1.1, skip: o2.skip });
      if (o2.bhumi && i % 5 === 4) { const c = half * .48, q = half - c / 2; for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) add('amal', cx + sx * q, y + ch * .5, cz + sz * q, c * .34, ch * .6, c * .34); }
    }
    const yt = y0 + n * ch, ht = half;
    add('plain', cx, yt + ht * .12, cz, ht * 1.3, ht * .24, ht * 1.3);                   // the neck (griva)
    add('amal', cx, yt + ht * .24 + ht * .27, cz, ht * .92, ht * .54, ht * .92);         // the amalaka
    add('amal', cx, yt + ht * .78 + ht * .08, cz, ht * .5, ht * .16, ht * .5);           // the chandrika
    const kh = ht * (o2.kalashK ?? 1.1); add('gold', cx, yt + ht * .94 + kh / 2, cz, ht * .36, kh, ht * .36);   // the kalasha
    return yt + ht * 1.04 + kh;
  };
  // the mandapa's pyramid roof (samvarana): stepped courses with rows of bell-domes, a great bell on top, its kalasha
  const roof = (cx, cz, y0, half0, half1, n, o2 = {}) => {
    const ch = o2.ch ?? .8; let y = y0;
    for (let i = 0; i < n; i++) {
      const half = lerp(half0, half1, i / (n - 1));
      course(i % 3 === 2 ? 'plain' : 'spire', cx, cz, y, ch, half, { e: .6 });
      if (i % 3 === 1 && i < n - 1) {   // a row of bell-domes round the tier
        const ds = Math.min(1.6, half * .22), m = Math.max(2, Math.round(2 * half / (ds * 1.7)));
        for (let s = 0; s < 4; s++) for (let j = 0; j < m; j++) {
          const v = -half + (j + .5) * 2 * half / m, yaw = s * Math.PI / 2, lx = half - ds * .25, cs = Math.cos(yaw), sn = Math.sin(yaw);
          add('dome', cx + lx * cs + v * sn, y + ch + ds * .5, cz - lx * sn + v * cs, ds * .5, ds * 1, ds * .5);
        }
      }
      y += ch;
    }
    const top = half1 * 1.05; add('dome', cx, y + top * .55, cz, top, top * 1.1, top);
    add('amal', cx, y + top * 1.1 + top * .12, cz, top * .42, top * .24, top * .42);
    add('gold', cx, y + top * 1.34 + top * .45, cz, top * .26, top * .9, top * .26);
    return y + top * 2.2;
  };

  // ---- the plan (metres): the sanctum at the origin, the antarala, the sabha mandapa, the nritya mandapa, east ----
  const JX0 = -17, JX1 = 60, JZ = 18, JY = 2.6;
  // the jagati: a moulded platform (stays put; keep ≥ JY)
  [[0, .6, 1.4], [.6, .7, .9], [1.3, .7, .5], [2.0, .6, .2]].forEach(([y, h, d]) => rect(y < 1.3 ? 'plinth' : 'plain', JX0 - d, JX1 + d, -JZ - d, JZ + d, y, h, 1.6));
  const top = mesh3(G, new THREE.BoxGeometry(JX1 - JX0 - 1, .2, 2 * JZ - 1), pbr3('paving', { rep: [16, 8], tint: '#E8D9BE', env: .5 }), [(JX0 + JX1) / 2, JY - .1, 0]);
  const steps = new THREE.Group(); G.add(steps);
  for (let i = 0; i < 7; i++) mesh3(steps, new THREE.BoxGeometry(1, (i + 1) * JY / 7, 12), mdMat('plain', [2, 2], { noTex: true }), [JX1 + 6.5 - i * .9, (i + 1) * JY / 14, 0]);
  // the sanctum (garbhagriha) and its spire
  const SH = 8.6, wTop = walls(0, 0, JY, SH);
  // the main spire stands back from the wall's edge (a ledge on the cornice) so the urushringas can sit on the wall
  const yTop = spire(0, 0, wTop, 30, SH - 1.5, { taper: .64, pow: 2.1, bhumi: true, kalashK: 1.25 });
  // the urushringas: half-spires stacked against the main one on three sides (and above the mandapa's roof in front).
  // Each one's outer face stays inside the wall below it (its bhadra projection reaches SH × 1.13): nothing overhangs.
  const EDGE = SH * 1.1, ur = (d, half) => Math.min(d, EDGE - half * 1.14);
  for (let s = 0; s < 4; s++) {
    const yaw = s * Math.PI / 2, ux = Math.cos(yaw), uz = -Math.sin(yaw), front = s === 0;
    const d1 = ur(SH, 3.7), d2 = ur(SH - 1.2, 3.4) - .6, d3 = ur(SH - 2.4, 3.1) - 1.2;
    spire(ux * d1, uz * d1, wTop + (front ? 9 : 0), front ? 9 : 14, 3.7, { taper: .58, ch: .85 });
    spire(ux * d2, uz * d2, wTop + (front ? 14 : 4.5), front ? 10 : 15, 3.4, { taper: .58, ch: .85 });
    spire(ux * d3, uz * d3, wTop + (front ? 19 : 10), 12, 3.1, { taper: .58, ch: .85 });
  }
  // the corner spires, inside the wall's corner
  { const h = 2.1, q = SH - h * 1.05; for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) spire(sx * q, sz * q, wTop, 8.5, h, { taper: .55, ch: .7 }); }
  // the antarala: a short vestibule joining the sanctum and the hall
  for (let y = JY, i = 0; y < wTop - .2; i++) { const h = i < 5 ? .55 : 1.5; rect(i < 5 ? 'plinth' : 'wall', SH - 1, 14, -5.6, 5.6, y, Math.min(h, wTop - y), 1.4); y += h; }
  // the sabha mandapa
  const MX = 24.5, MH = 10.5, mTop = walls(MX, 0, JY, MH, { prof: WALLP.slice(0, 5).concat([[1.6, 0, 'wall'], [1.6, 0, 'wall'], [1.5, 0, 'wall'], [.45, .3, 'plain'], [.4, .55, 'plain']]) });
  const mRoofTop = roof(MX, 0, mTop, MH + .3, 3.4, 15);
  // the nritya mandapa: an open hall of pillars under its own roof
  const NX = 44.5, NH = 7.6; let y = JY;
  for (const [h, d, k] of WALLP.slice(0, 4)) { course(k, NX, 0, y, h, NH + d); y += h; }
  const py0 = y, ph = 6.2;
  for (let s = 0; s < 4; s++) for (let j = 0; j < 6; j++) {
    const v = -NH + .6 + j * (2 * NH - 1.2) / 5, yaw = s * Math.PI / 2, cs = Math.cos(yaw), sn = Math.sin(yaw), lx = NH - .7;
    if (s === 2) continue;   // the side towards the sabha mandapa is joined to it
    add('pillar', NX + lx * cs + v * sn, py0 + ph / 2, -lx * sn + v * cs, .8, ph, .8);
  }
  add('plain', NX, py0 - .1, 0, 2 * NH - 2.5, .2, 2 * NH - 2.5);
  for (const [h, d] of [[.5, .2], [.45, .5]]) { course('plain', NX, 0, py0 + ph + (d > .3 ? .5 : 0), h, NH + d, { hollow: true }); }
  const nRoofTop = roof(NX, 0, py0 + ph + .95, NH + .4, 2.6, 11, { ch: .75 });
  // a link between the two halls
  for (let yy = JY, i = 0; yy < mTop - 2; i++) { rect(i < 4 ? 'plinth' : 'wall', MX + MH - .5, NX - NH + .5, -5, 5, yy, 1.2, 1.2); yy += 1.2; }

  // ---- the instanced meshes, one per kind ----
  const KIND = {
    wall: [MD_GEO.box, mdMat('wall', [2.4, 6.2], { off: [0, -5.4] })], spire: [MD_GEO.box, mdMat('spire', [3.2, 1], { per: true })], plinth: [MD_GEO.box, mdMat('plinth', [3, 2.8], { off: [0, -2.6] })],
    plain: [MD_GEO.box, mdMat('plain', [2.5, 2.5])], core: [MD_GEO.box, mdMat('plain', [2.5, 2.5])], amal: [MD_GEO.amal, mdMat('plain', [2, 2], { noTex: true, col: '#A08560' })],
    dome: [MD_GEO.dome, mdMat('spire', [1.2, 1], { per: true })], pillar: [MD_GEO.pillar, mdMat('wall', [1.2, 1], { per: true })],
    gold: [MD_GEO.kalash, new THREE.MeshStandardMaterial({ color: MD_COL.gold, metalness: .55, roughness: .45, envMapIntensity: .6 })],
  };
  const IM = {}, dummy = new THREE.Object3D();
  const hTop = yTop;
  for (const [k, [geo, mat]] of Object.entries(KIND)) {
    const L = B.filter(b => b.k === k); if (!L.length) continue;
    const g = geo.clone(), n = L.length, rest = new Float32Array(n * 4), size = new Float32Array(n * 3);
    L.forEach((b, i) => { rest.set([b.x, b.y, b.z, b.yaw], i * 4); size.set([b.sx, b.sy, b.sz], i * 3); });
    g.setAttribute('aRest', new THREE.InstancedBufferAttribute(rest, 4)); g.setAttribute('aSize', new THREE.InstancedBufferAttribute(size, 3));
    const m = new THREE.InstancedMesh(g, mat, n); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; G.add(m);
    const tc = new THREE.Color(); for (let i = 0; i < n; i++) { const v = .86 + R() * .16, w = R() * .05; m.setColorAt(i, tc.setRGB(v, v - w * .5, v - w)); }
    // where each block lands when broken, and when it moves in each mode
    L.forEach(b => {
      const ax = clamp(b.x, -4, NX), dx = b.x - ax, dz = b.z, r0 = Math.hypot(dx, dz) || 1, out = R() < .4 ? (R() - .6) * 6 : 2 + R() * 14 * (.35 + b.y / hTop);
      let fx = b.x + dx / r0 * out + (R() - .5) * 6, fz = b.z + dz / r0 * out + (R() - .5) * 6;
      if (Math.abs(fz) < 3 && b.x > -4) fz += (R() < .5 ? -1 : 1) * (3 + R() * 5);
      const onJ = fx > JX0 && fx < JX1 && Math.abs(fz) < JZ;
      const ra = Math.hypot(fx - clamp(fx, -2, NX - 6), fz), heap = Math.max(0, 7 - ra * .55) * (.4 + .6 * R());
      b.f = [fx, (onJ ? JY : 0) + Math.min(b.sx, b.sy, b.sz) * .45 + heap, fz]; b.fr = [(R() - .5) * 2.6, b.yaw + (R() - .5) * 3, (R() - .5) * 2.6];
      b.arc = 2 + R() * 6 + b.y * .25; b.sB = .55 * R() + .45 * (1 - b.y / hTop); b.sR = .78 * clamp((b.y - JY) / (hTop - JY)) + .22 * R();
    });
    IM[k] = { m, L };
  }
  const n = B.length;
  // the flag on the spire's kalasha: saffron cloth on a pole, waving
  const flagPole = mesh3(G, new THREE.CylinderGeometry(.09, .12, 7.5, 8), new THREE.MeshStandardMaterial({ color: '#6A5038', roughness: .7 }), [0, yTop + 3.4, 0]);
  const flagGeo = new THREE.PlaneGeometry(5.2, 2.6, 24, 8), flagBase = flagGeo.attributes.position.array.slice();
  const flag = mesh3(G, flagGeo, new THREE.MeshStandardMaterial({ color: MD_COL.flag, roughness: .85, side: THREE.DoubleSide, emissive: '#3A1000', emissiveIntensity: .3 }), [2.6, yTop + 5.6, 0], { cast: true });
  // dust clouds for the breaking
  const dustTex = tex3('md_dust', 128, 128, (g2) => { const gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128); });
  const dust = [], rd = lcg(91);
  for (let i = 0; i < 70; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, color: '#B8A488', transparent: true, opacity: 0, depthWrite: false }));
    const b = B[Math.floor(rd() * n)]; s.userData = { p: [b.x, b.y, b.z], s0: rd(), dx: (rd() - .5) * 8, dz: (rd() - .5) * 8 }; G.add(s); dust.push(s);
  }
  // fires burning in the ruin (flickering glows among the rubble)
  const fires = [], rf = lcg(57);
  for (let i = 0; i < 36; i++) { const x = lerp(-10, 52, rf()), z = (rf() - .5) * 34, f = glow3(G, [x, JY + .5 + rf() * 3, z], 5 + rf() * 7, rf() < .5 ? '#FF7A20' : '#FFB040', 0); f.userData = { ph: rf() * TAU, k: .6 + rf() * .4, y: f.position.y }; fires.push(f); }
  const M = G;
  M.at = { top: [0, yTop, 0], sanctum: [0, JY + 1, 0], mandapa: [MX, mRoofTop, 0], nritya: [NX, nRoofTop, 0], door: [JX1, JY, 0], kalash: [0, yTop - 1, 0], flag: [2.6, yTop + 5.6, 0], wTop, JY };
  M.blocks = n;
  M.set = (t, s = {}) => {
    const brk = s.brk ?? 0, mode = s.mode || 'break', keep = s.keep ?? JY + .01;
    for (const k in IM) {
      const { m, L } = IM[k];
      for (let i = 0; i < L.length; i++) {
        const b = L[i], st = mode === 'build' ? b.sR : b.sB;
        let q = b.y < keep ? 0 : clamp((brk - st * .5) / .5);
        if (mode === 'break') q = 1 - (1 - q) * (1 - q); else q = q * q * (3 - 2 * q);
        const lift = b.arc * 4 * q * (1 - q);
        dummy.position.set(lerp(b.x, b.f[0], q), lerp(b.y, b.f[1], q) + lift, lerp(b.z, b.f[2], q));
        dummy.rotation.set(b.fr[0] * q, lerp(b.yaw, b.fr[1], q), b.fr[2] * q);
        const cs = k === 'core' ? Math.max(.001, 1 - q * 5) : 1;   // the hidden core shrinks away instead of flying as one slab
        dummy.scale.set(b.sx * cs, b.sy * cs, b.sz * cs); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    }
    // the flag goes with the top of the spire
    const fk = brk > 0 ? clamp(brk * 3) : 0; flag.visible = flagPole.visible = fk < 1;
    flagPole.position.y = yTop + 3.4 - fk * 40; flag.position.y = yTop + 5.6 - fk * 40;
    const pa = flagGeo.attributes.position, w = s.flag ?? .8;
    for (let i = 0; i < pa.count; i++) { const x0 = flagBase[i * 3], y0 = flagBase[i * 3 + 1], u = (x0 + 2.6) / 5.2; pa.setX(i, x0); pa.setY(i, y0 * (1 - .55 * u) + Math.sin(t * 3 + u * 5) * .2 * u * w); pa.setZ(i, Math.sin(t * 4.2 - u * 6) * .45 * u * w); }
    pa.needsUpdate = true; flagGeo.computeVertexNormals();
    const fo = s.fire ?? 0; fires.forEach(f => { const u = f.userData; f.visible = fo > .01; f.material.opacity = fo * u.k * (.65 + .35 * Math.sin(t * 13 + u.ph) * Math.sin(t * 7.3 + u.ph * 2)); f.position.y = u.y + .3 * Math.sin(t * 5 + u.ph); });
    // dust: puffs where blocks are moving
    const dk = s.dust ?? 1;
    dust.forEach((d, i) => { const u = d.userData, ph = clamp((brk - u.s0 * .5) / .5); const a = Math.sin(Math.PI * clamp(ph * 1.2)) * dk * (brk > 0 && brk < 1 ? 1 : 0);
      d.material.opacity = .55 * a; d.visible = a > .01; const sz = 4 + 14 * ph; d.scale.set(sz, sz, 1);
      d.position.set(u.p[0] + u.dx * ph, Math.max(1, u.p[1] * (1 - ph * .8)) + 2 * ph, u.p[2] + u.dz * ph); d.material.color.set(s.dustCol || '#B8A488'); });
  };
  M.set(0, {});
  return M;
}

// ---------- the shore at Somnath: the court, the sea wall with the Baan Stambh, the Arabian Sea ----------
function somWorld3(o = {}) {
  const scene = new THREE.Scene();
  const hemi = new THREE.HemisphereLight('#B8C8E8', '#5A4636', .35); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFC890', 3); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -80, right: 80, top: 80, bottom: -80, near: 1, far: 500 }); sun.shadow.bias = -.0003; sun.shadow.normalBias = .06;
  scene.add(sun, sun.target);
  const fill = new THREE.PointLight('#FF8A3A', 0, 220, 1.2); fill.castShadow = false; scene.add(fill);
  scene.fog = new THREE.FogExp2('#C9A890', .0012);
  const SEAZ = 74;
  // the court: paving round the temple, a lawn beyond, the sea wall, the sea
  const ground = mesh3(scene, new THREE.PlaneGeometry(3000, 1600), pbr3('paving', { rep: [300, 160], tint: '#D8C6A6', env: .4 }), [0, 0, SEAZ - 800], { rot: [-Math.PI / 2, 0, 0], cast: false });
  const wallM = new THREE.MeshStandardMaterial({ color: '#BFAE90', roughness: .95 });
  mesh3(scene, new THREE.BoxGeometry(3000, 4.5, 2.4), wallM, [0, -1.4, SEAZ + 1.2]);
  mesh3(scene, new THREE.BoxGeometry(3000, .5, 2.8), wallM, [0, .95, SEAZ + 1.2]);
  const nrm = tex3('som_seanrm', 512, 512, (g, w, h) => {
    const img = g.createImageData(w, h), d = img.data;
    const f = (x, y) => Math.sin(x * .07 + Math.sin(y * .05) * 2) + Math.sin(y * .11 + x * .03) * .7 + Math.sin((x + y) * .19) * .35 + Math.sin((x * .9 - y) * .31) * .2;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = f(x + 1, y) - f(x - 1, y), dy = f(x, y + 1) - f(x, y - 1), i = (y * w + x) * 4; d[i] = 128 + dx * 40; d[i + 1] = 128 + dy * 40; d[i + 2] = 255; d[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  }, { data: true });
  nrm.repeat.set(1200, 1200);
  const sea = mesh3(scene, new THREE.PlaneGeometry(40000, 40000), new THREE.MeshStandardMaterial({ color: '#1E3E4C', roughness: .12, metalness: .1, normalMap: nrm, normalScale: new THREE.Vector2(.3, .3), envMapIntensity: 1 }), [0, -2.6, SEAZ + 20000], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false });
  // surf along the wall
  const foam = []; const ft = tex3('som_foam', 256, 64, (g, w, h) => { const r = lcg(3); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,${.1 + r() * .4})`; g.beginPath(); g.ellipse(r() * w, h * .5 + (r() - .5) * h * .6, 4 + r() * 14, 1 + r() * 3, 0, 0, TAU); g.fill(); } });
  for (let i = 0; i < 3; i++) foam.push(mesh3(scene, new THREE.PlaneGeometry(3000, 3 + i * 2), new THREE.MeshBasicMaterial({ map: ft.rep(120, 1), transparent: true, opacity: .5, depthWrite: false }), [0, -2.5 + i * .01, SEAZ + 3 + i * 3], { rot: [-Math.PI / 2, 0, 0], cast: false, receive: false }));
  // the Baan Stambh: a pillar on the sea wall, a globe, an arrow on top pointing south (+z)
  const ST = new THREE.Group(); scene.add(ST); ST.position.set(-10, 1.2, SEAZ + .6);
  const sm = new THREE.MeshStandardMaterial({ color: '#E4D0AA', roughness: .85 });
  mesh3(ST, new THREE.BoxGeometry(1.6, .8, 1.6), sm, [0, .4, 0]);
  mesh3(ST, new THREE.CylinderGeometry(.42, .5, 5.2, 12), sm, [0, 3.4, 0]);
  mesh3(ST, new THREE.CylinderGeometry(.62, .5, .4, 12), sm, [0, 6.1, 0]);
  mesh3(ST, new THREE.SphereGeometry(.4, 24, 16), sm, [0, 6.75, 0]);
  const arM = new THREE.MeshStandardMaterial({ color: '#7A5A30', roughness: .55, metalness: .4 });
  mesh3(ST, new THREE.CylinderGeometry(.06, .06, 0.6, 8), arM, [0, 7.35, 0]);
  mesh3(ST, new THREE.CylinderGeometry(.07, .07, 2.4, 8), arM, [0, 7.7, .2], { rot: [Math.PI / 2, 0, 0] });
  mesh3(ST, new THREE.ConeGeometry(.22, .6, 12), arM, [0, 7.7, 1.6], { rot: [Math.PI / 2, 0, 0] });
  mesh3(ST, new THREE.BoxGeometry(.015, .24, .4), arM, [0, 7.7, -.85]); mesh3(ST, new THREE.BoxGeometry(.24, .015, .4), arM, [0, 7.7, -.85]);
  ST.tip = [-10, 1.2 + 7.7, SEAZ + .6 + 1.9];
  // lamps along the court (for the blue hour)
  const lamps = []; for (let i = -6; i <= 8; i++) for (const z of [-26, 26]) lamps.push(glow3(scene, [i * 8, 3.4, z], 2.2, '#FFC870', 0));
  // the sun's direction from the evening HDRI (its brightest texel), turned to sit low in the west-south-west over the sea
  const SUN0 = V3(.7685, .1619, .619).normalize(), ROT = o.rot ?? -1.95, sunDir = SUN0.clone().applyAxisAngle(V3(0, 1, 0), ROT);
  const mood = (name, m = {}) => {
    const c = m.center || [14, 0, 0];
    foam.forEach((f, i) => { f.material.map.offset.x = (m.t || 0) * .01 * (i + 1); f.material.opacity = .45 - i * .1; });
    nrm.offset.set((m.t || 0) * .003, (m.t || 0) * .002);
    lamps.forEach(l => l.material.opacity = name === 'blue' ? .9 : 0);
    if (name === 'night') {
      env3(scene, 'night2', { bg: true, k: m.envK ?? .35, rot: 0, bgK: m.bgK ?? .5 });
      sun.color.set('#8AA0D0'); sun.intensity = m.sun ?? .5; hemi.intensity = m.hemi ?? .12; hemi.color.set('#40507A'); hemi.groundColor.set('#200C06');
      fill.intensity = m.fire ?? 1400; fill.position.set(...(m.fireAt || [30, 10, 30])); fill.color.set('#FF7A2A');
      scene.fog.color.set(m.fogCol || '#2A140C'); scene.fog.density = m.fog ?? .006;
      sunDir.set(-.4, .5, -.6).normalize();
    } else {
      env3(scene, 'evening', { bg: true, k: m.envK ?? (name === 'blue' ? .5 : .85), rot: ROT, bgK: m.bgK ?? (name === 'blue' ? .55 : 1) });
      sun.color.set(name === 'blue' ? '#FFB07A' : '#FFC890'); sun.intensity = m.sun ?? (name === 'blue' ? 1.4 : 3.2);
      hemi.intensity = m.hemi ?? .35; hemi.color.set('#B8C8E8'); hemi.groundColor.set('#5A4636');
      fill.intensity = m.fire ?? 0; scene.fog.color.set(m.fogCol || '#C9A890'); scene.fog.density = m.fog ?? .0011;
      sunDir.copy(SUN0).applyAxisAngle(V3(0, 1, 0), ROT);
    }
    sun.position.set(c[0] + sunDir.x * 200, c[1] + sunDir.y * 200, c[2] + sunDir.z * 200); sun.target.position.set(...c);
    return m.exposure ?? (name === 'night' ? 1.1 : name === 'blue' ? 1.05 : 1);
  };
  return { scene, sun, hemi, fill, sea, ground, stambh: ST, lamps, mood, SEAZ };
}

// ---------- the faceless shadow raiders ----------
// black silhouettes on sprites (a cloaked walker with a spear, a horseman), torches in their hands; nothing that names or
// marks them. .set(t, { on, walk (metres moved along dir), fade (0..1 dissolving into smoke) })
function raiders3(parent, n = 90, o = {}) {
  const G = new THREE.Group(); parent.add(G);
  const fig = (key, draw) => tex3(key, 256, 512, (g, w, h) => { g.fillStyle = '#000'; draw(g, w, h); });
  const walker = fig('rd_walk', (g, w, h) => {
    g.beginPath(); g.ellipse(128, 120, 30, 36, 0, 0, TAU); g.fill();                                   // hooded head
    g.beginPath(); g.moveTo(96, 110); g.quadraticCurveTo(128, 60, 160, 110); g.lineTo(186, 330); g.lineTo(206, 500); g.lineTo(56, 500); g.lineTo(74, 330); g.closePath(); g.fill();   // cloak
    g.fillRect(186, 20, 7, 480); g.beginPath(); g.moveTo(189, 0); g.lineTo(200, 34); g.lineTo(178, 34); g.closePath(); g.fill();   // spear
    g.beginPath(); g.moveTo(150, 200); g.lineTo(192, 250); g.lineTo(186, 262); g.lineTo(140, 228); g.fill();
  });
  const torch = fig('rd_torch', (g, w, h) => {
    g.beginPath(); g.ellipse(128, 120, 30, 36, 0, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(96, 110); g.quadraticCurveTo(128, 60, 160, 110); g.lineTo(184, 330); g.lineTo(200, 500); g.lineTo(60, 500); g.lineTo(76, 330); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(104, 190); g.lineTo(52, 90); g.lineTo(62, 84); g.lineTo(120, 180); g.fill(); g.fillRect(44, 40, 12, 60);   // arm raised, torch
  });
  const horse = tex3('rd_horse', 512, 512, (g) => {
    g.fillStyle = '#000';
    g.beginPath(); g.ellipse(250, 300, 150, 62, 0, 0, TAU); g.fill();                                   // body
    g.beginPath(); g.moveTo(370, 280); g.lineTo(440, 170); g.lineTo(470, 160); g.lineTo(490, 190); g.lineTo(440, 230); g.lineTo(400, 320); g.fill();   // neck, head
    for (const [x, a] of [[140, .2], [190, -.15], [320, .25], [370, -.1]]) { g.save(); g.translate(x, 330); g.rotate(a); g.fillRect(-9, 0, 18, 170); g.restore(); }
    g.beginPath(); g.moveTo(110, 280); g.quadraticCurveTo(60, 330, 80, 420); g.lineTo(95, 420); g.quadraticCurveTo(90, 340, 120, 300); g.fill();   // tail
    g.beginPath(); g.ellipse(260, 170, 26, 30, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(225, 180); g.lineTo(300, 180); g.lineTo(310, 270); g.lineTo(215, 270); g.fill();   // rider
    g.fillRect(300, 40, 7, 230);
  });
  const R = lcg(o.seed ?? 7), list = [];
  const at = o.at || [70, 0, 30], dir = o.dir || [-1, 0, -.35], spread = o.spread || [60, 26];
  const dl = Math.hypot(dir[0], dir[2]), ux = dir[0] / dl, uz = dir[2] / dl, px = -uz, pz = ux;
  for (let i = 0; i < n; i++) {
    const kind = R() < .22 ? 'horse' : R() < .4 ? 'torch' : 'walk', map = kind === 'horse' ? horse : kind === 'torch' ? torch : walker;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color: '#000000', transparent: true, alphaTest: .3, fog: true }));
    const back = R() * spread[0], side = (R() - .5) * spread[1], hgt = kind === 'horse' ? 2.9 : 1.75 + R() * .15;
    s.scale.set(kind === 'horse' ? hgt : hgt * .5, hgt, 1); s.center.set(.5, 0);
    G.add(s);
    const fl = kind === 'torch' || (kind === 'walk' && R() < .25) ? glow3(G, [0, 0, 0], 1.6, '#FF9A3A', 1) : null;
    list.push({ s, fl, back, side, kind, ph: R() * TAU, sp: .8 + R() * .4, hgt });
  }
  G.set = (t, s = {}) => {
    const on = s.on ?? 1, walk = s.walk ?? 0, fade = s.fade ?? 0; G.visible = on > .01;
    for (const r of list) {
      const d = walk * r.sp - r.back, x = at[0] + ux * d + px * r.side, z = at[2] + uz * d + pz * r.side;
      const bob = Math.abs(Math.sin(t * 5 * r.sp + r.ph)) * .06 * r.hgt;
      const f = clamp(fade * 1.6 - (r.back / spread[0]) * .6);
      r.s.position.set(x, (s.y ?? 0) + bob + f * 2, z); r.s.material.opacity = on * (1 - f); r.s.material.alphaTest = .3 + f * .65;
      if (r.fl) { r.fl.position.set(x + (r.kind === 'torch' ? -.45 : .3), (s.y ?? 0) + r.hgt * (r.kind === 'torch' ? 1.12 : .62) + bob, z); r.fl.material.opacity = on * (1 - f) * (.75 + .25 * Math.sin(t * 17 + r.ph)); const k = 1.4 + .3 * Math.sin(t * 11 + r.ph); r.fl.scale.set(k, k, 1); }
    }
  };
  G.list = list;
  return G;
}

// ---------- smoke: dark billowing sprites that rise and drift ----------
function smoke3(parent, n = 40, o = {}) {
  const G = new THREE.Group(); parent.add(G);
  const tx = tex3('md_smoke', 256, 256, (g) => { const r = lcg(17); for (let i = 0; i < 40; i++) { const x = 60 + r() * 136, y = 60 + r() * 136, rr = 30 + r() * 60, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); } });
  const R = lcg(o.seed ?? 23), at = o.at || [0, 0, 0], box = o.box || [40, 20], list = [];
  for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, color: o.col || '#1A1410', transparent: true, depthWrite: false, opacity: 0, rotation: R() * TAU })); G.add(s); list.push({ s, x: (R() - .5) * box[0], z: (R() - .5) * box[1], ph: R(), sz: 10 + R() * 18 }); }
  G.set = (t, s = {}) => {
    const on = s.on ?? 1; G.visible = on > .01;
    for (const p of list) { const u = (t * .08 * (s.speed ?? 1) + p.ph) % 1; p.s.position.set(at[0] + p.x + u * 10, at[1] + 2 + u * (o.rise ?? 50), at[2] + p.z); const k = p.sz * (1 + u * 1.8); p.s.scale.set(k, k, 1); p.s.material.opacity = on * (o.a ?? .7) * Math.sin(Math.PI * u); p.s.material.color.set(s.col || o.col || '#1A1410'); }
  };
  return G;
}
