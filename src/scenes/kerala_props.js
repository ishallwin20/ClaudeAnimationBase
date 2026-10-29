// kerala_props.js: the props of "Kerala was pulled out of the SEA" (ad 62). Parshurama as a silhouette (the series'
// Painted character, src/parshurama.js, is drawn in p5.brush; here he is a lit shape on the Cinematic layer), his axe
// (flying on its own), the shore at sunset (2D), and in the 3D world the Kerala coast in high detail (src/data/kerala_dem.js
// over India's map), the sea that once reached the Ghats, drawn back behind the axe, and the coastline as a line of light.

// ---------- Parshurama (a silhouette, facing screen left, feet at (0, 0), ~1040 tall to the jata's tip) ----------
// o: t, col, arm (radians: the axe arm's angle, 0 = pointing screen right, -PI/2 straight up), axe (true: in his hand),
// reach (0..1 the far arm reaches forward), wind.
const PSR_SH = [14, -688];
const psrHand = (arm, len = 300) => [PSR_SH[0] + Math.cos(arm) * len, PSR_SH[1] + Math.sin(arm) * len];
function psrSil(c, o = {}) {
  const col = o.col || '#0C0810', t = o.t || 0, wd = (o.wind ?? .5) * (.6 + .4 * Math.sin(t * 1.9)), rc = o.reach || 0, arm = o.arm ?? -1.75;
  // the quiver on his back
  c.save(); c.translate(52, -700); c.rotate(.38);
  fillPath(c, 'M -20 0 L 20 0 L 16 260 L -16 260 Z', col); for (let i = -1; i <= 1; i++) fillPath(c, `M ${i * 11 - 5} 4 L ${i * 11} -54 L ${i * 11 + 5} 4 Z`, col);
  c.restore();
  // the far arm: by his side, or reaching forward for balance
  const fe = [lerp(-4, -120, rc), lerp(-570, -640, rc)], fh = [lerp(-14, -250, rc), lerp(-450, -610, rc)];
  limb(c, [[-20, -686], fe, fh], [54, 44, 34], col); ellipse(c, fh[0] - 8, fh[1] + (rc > .5 ? -4 : 12), 24, 22, col);
  // legs planted wide, the front foot to the left
  limb(c, [[22, -480], [70, -262], [96, -44]], [96, 74, 50], col); fillPath(c, 'M 116 -52 C 120 -20 122 -6 118 0 L 30 0 C 26 -12 46 -22 72 -30 L 76 -52 Z', col);
  limb(c, [[-16, -480], [-80, -262], [-128, -44]], [96, 74, 50], col); fillPath(c, 'M -112 -52 C -108 -20 -106 -6 -110 0 L -200 0 C -204 -12 -182 -22 -156 -30 L -152 -52 Z', col);
  // the dhoti to the knees, the blackbuck skin's ragged hem over it
  fillPath(c, 'M -64 -510 C -96 -430 -124 -340 -140 -250 C -60 -236 30 -236 92 -250 C 84 -340 74 -430 62 -510 Z', col);
  fillPath(c, 'M -70 -520 L -96 -400 L -80 -410 L -66 -380 L -50 -404 L -30 -372 L -14 -400 L 8 -366 L 24 -398 L 46 -370 L 60 -404 L 74 -386 L 70 -520 Z', col);
  // the torso: a warrior's chest, broad shoulders
  fillPath(c, 'M -60 -506 C -84 -566 -120 -630 -116 -672 C -108 -712 -60 -736 0 -740 C 60 -738 108 -716 112 -670 C 116 -616 88 -556 64 -506 Z', col);
  for (const x of [-36, 40]) ellipse(c, x, -696, 56, 46, col);
  // the neck, the head in profile, the beard, the locks blowing back
  limb(c, [[-4, -726], [-14, -780]], [54, 46], col);
  for (let i = 0; i < 3; i++) limb(c, [[10, -850 + i * 22], [60 + wd * 30, -800 + i * 26], [96 + wd * 60, -742 + i * 30], [118 + wd * 90, -690 + i * 34]], [30, 24, 16, 4], col, false);
  ellipse(c, -12, -832, 50, 58, col);
  fillPath(c, 'M -54 -852 C -62 -842 -66 -830 -58 -822 L -46 -816 Z', col);   // the nose
  fillPath(c, 'M -58 -806 C -66 -780 -60 -746 -34 -730 C -14 -724 6 -738 10 -770 L 0 -800 Z', col);   // the beard
  // the jatamukuta: matted hair piled high, a tapering bun with a loop on top
  fillPath(c, 'M -52 -868 C -60 -900 -44 -930 -36 -960 C -30 -996 -14 -1018 -4 -1024 C 8 -1016 22 -994 26 -958 C 34 -928 44 -898 34 -866 Z', col);
  ellipse(c, -6, -1030, 16, 18, col);
  // the axe arm (near), the axe in his fist
  const H = psrHand(arm), E = [PSR_SH[0] + Math.cos(arm + .35) * 160, PSR_SH[1] + Math.sin(arm + .35) * 160];
  limb(c, [PSR_SH, E, H], [58, 46, 36], col); ellipse(c, H[0], H[1], 28, 26, col);
  if (o.axe !== false) parashuSil(c, H[0], H[1], arm, 1, { col });
}
// the parashu at a grip point (x, y), its haft along `ang` (the blade at the far end), k = scale (~1 for the silhouette)
function parashuSil(c, x, y, ang, k = 1, o = {}) {
  const col = o.col || '#0C0810';
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(k, k);
  fillPath(c, 'M -90 -9 L 250 -10 L 254 10 L -90 9 Z', col);   // the haft
  ellipse(c, -92, 0, 14, 14, col);
  // the blade on one side of the haft: a broad crescent edge, a short spike on the other side, a finial
  fillPath(c, 'M 200 -9 C 192 -50 172 -96 158 -136 C 204 -160 272 -162 318 -140 C 302 -96 282 -52 272 -9 Z', col);
  fillPath(c, 'M 226 9 L 236 54 L 252 9 Z', col);
  fillPath(c, 'M 252 -7 L 292 0 L 252 7 Z', col);
  c.restore();
}
// the axe glowing (Shiva's gift): the same shape in light with a halo
function parashuGlow(c, x, y, ang, k, a = 1, t = 0) {
  if (a <= .01) return;
  const bx = x + Math.cos(ang) * 260 * k, by = y + Math.sin(ang) * 260 * k;
  const nx = Math.cos(ang - Math.PI / 2) * 70 * k, ny = Math.sin(ang - Math.PI / 2) * 70 * k;
  glow(c, bx + nx, by + ny, 240 * k, '#FF9A30', .45 * a); glow(c, bx + nx, by + ny, 90 * k, '#FFE0A0', .35 * a * (.85 + .15 * Math.sin(t * 9)));
  c.save(); c.globalAlpha = a; c.shadowColor = 'rgba(255,170,60,.95)'; c.shadowBlur = 26 * k;
  parashuSil(c, x, y, ang, k, { col: '#E89A3A' }); c.restore();
  c.save(); c.globalAlpha = a * .8; c.globalCompositeOperation = 'lighter'; c.translate(nx * .06, ny * .06); parashuSil(c, x, y, ang, k * .97, { col: 'rgba(255,230,170,.5)' }); c.restore();
}

// ---------- the shore at sunset (2D): sky, sun, the sea's glitter, the headland he stands on ----------
// o: sun (screen [x, y]), glow (0..1 the sea lights up: Varuna), sunk (how far the sun has set, 0..1), cam (plane cam)
function shore(c, t, o = {}) {
  const [sx, sy] = o.sun || [300, 980], cam = o.cam || {};
  sky(c, [[0, '#120C24'], [420, '#2C1A3E'], [760, '#7A3A4A'], [960, '#E07A4A'], [1060, '#FFB86A'], [1080, '#F4A060']]);
  plane(c, cam, .15, c => {
    glow(c, sx, sy, 900, '#FF9A50', .45, 'screen');
    sunDisc(c, sx, sy, 110, t, { col: '#FFE0A0' });
    // far clouds, streaks lit from below
    for (let i = 0; i < 7; i++) { const y = 640 + i * 52 + hash(i) * 30, x = (hash(i * 3.1) * 1400 - 160 + t * (4 + i)) % 1400 - 160;
      ellipse(c, x, y, 220 + hash(i * 7) * 200, 10 + hash(i * 5) * 8, rgba(i < 3 ? '#5A2A4A' : '#C0604A', .55)); }
  });
  // the sea: dark bands with a glitter path toward the sun
  const hz = 1080;
  c.fillStyle = (() => { const g = c.createLinearGradient(0, hz, 0, H); g.addColorStop(0, '#6A3A48'); g.addColorStop(.25, '#2A1A30'); g.addColorStop(1, '#0A0812'); return g; })();
  c.fillRect(0, hz, W, H - hz);
  plane(c, cam, .4, c => {
    for (let i = 0; i < 150; i++) {
      const r = hash(i * 1.3), y = hz + 4 + Math.pow(r, 1.6) * 820, sp = (y - hz) / 820, x = sx + (hash(i * 2.7) - .5) * (60 + sp * 900) + Math.sin(t * 2 + i) * 14 * sp;
      const a = (1 - sp * .7) * (.35 + .65 * Math.max(0, Math.sin(t * 3.1 + i * 1.7)));
      ellipse(c, x, y, 10 + sp * 46, 1.5 + sp * 3, rgba('#FFD090', a * .8));
    }
  });
  const gl = o.glow || 0;
  if (gl > .01) {   // Varuna: the sea lights from within
    glow(c, sx, 1260, 760, '#40D0E0', .5 * gl, 'screen'); glow(c, sx, 1300, 300, '#BFF8FF', .55 * gl, 'lighter');
    for (let i = 0; i < 5; i++) { const k = (t * .5 + i / 5) % 1; c.save(); c.globalAlpha = gl * (1 - k) * .6; c.strokeStyle = '#BFF4FF'; c.lineWidth = 3; c.beginPath(); c.ellipse(sx, 1280, 60 + k * 520, 12 + k * 80, 0, 0, TAU); c.stroke(); c.restore(); }
  }
}
// the headland: a dark rock under his feet, the foreground right; returns the point his feet stand on
function headland(c, cam, col = '#07050A') {
  let foot;
  plane(c, cam, 1, c => {
    fillPath(c, 'M 380 1920 C 440 1820 540 1740 640 1712 C 720 1692 840 1690 920 1702 C 990 1714 1040 1736 1080 1754 L 1080 1920 Z', col);
    fillPath(c, 'M 540 1800 C 580 1780 620 1788 640 1810 L 580 1840 Z', '#120C14');
    foot = [780, 1706];
  });
  return foot;
}

// ---------- the 3D coast ----------
// keralaPatch(I3): the Kerala DEM (0.006°, ~650 m) as its own mesh over India's coarser map, the same projection,
// heights and tint (the coarse map under it loses the depth test by polygon offset); .sync() copies India's mood
// (focus, edge) into its material each frame.
function keralaPatch(I3) {
  const D = dem3('kerala'), nx = D.w, nz = D.h, pos = new Float32Array(nx * nz * 3), ae = new Float32Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const lon = D.lon0 + (i + .5) * D.res, lat = D.lat1 - (j + .5) * D.res, e = D.e[j * nx + i], [x, z] = MAP3.xz(lon, lat), k = j * nx + i;
    pos[k * 3] = x; pos[k * 3 + 1] = I3.hy(e); pos[k * 3 + 2] = z; ae[k] = e;
  }
  const idx = new Uint32Array((nx - 1) * (nz - 1) * 6); let q = 0;
  for (let b = 0; b < nz - 1; b++) for (let a = 0; a < nx - 1; a++) { const k = b * nx + a; idx[q++] = k; idx[q++] = k + nx; idx[q++] = k + 1; idx[q++] = k + 1; idx[q++] = k + nx; idx[q++] = k + nx + 1; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aE', new THREE.BufferAttribute(ae, 1)); geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeVertexNormals();
  const mat = indiaMat3(); Object.assign(mat, { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
  const m = mesh3(I3.scene, geo, mat); m.renderOrder = 1;
  m.sync = () => { const A = I3.mat.userData.U, B = mat.userData.U; B.uFocus.value = A.uFocus.value; B.uEdge.value = A.uEdge.value; };
  return m;
}
// the coastline, Gokarna to Kanyakumari: for each latitude the first land cell from the west (smoothed); and the
// foothills (the first cell above 350 m east of it), how far the old sea may reach
const KER_N = 14.55, KER_S = 8.08;
function keralaCoast() {
  const D = dem3('kerala'), rows = [];
  for (let lat = KER_N; lat >= KER_S - .001; lat -= .02) {
    let lon = D.lon0 + .02, hill = 77.8;
    const land = l => D.at(l, lat) > 2 && D.at(l + .04, lat) > 2 && D.at(l + .09, lat) > 2;   // a run of land, not an islet
    while (lon < 77.9 && !land(lon)) lon += .006;
    let l2 = lon; while (l2 < 77.9 && D.at(l2, lat) < 350) l2 += .006; hill = l2;
    rows.push([lon, lat, hill]);
  }
  const med = rows.map((r, i) => rows.slice(Math.max(0, i - 3), i + 4).map(q => q[0]).sort((a, b) => a - b)[3] ?? r[0]);
  rows.forEach((r, i) => { if (Math.abs(r[0] - med[i]) > .12) r[0] = med[i]; });
  for (let p = 0; p < 3; p++) for (let i = 1; i < rows.length - 1; i++) rows[i][0] = (rows[i - 1][0] + rows[i][0] * 2 + rows[i + 1][0]) / 4;
  return rows;
}
// the old sea: a water sheet over the coast whose level (metres) is set per latitude each frame; a vertex outside the
// coast's reach (north of Gokarna, east of the foothills, the Tamil coast) sinks out of sight. .set(level(lat) → m, a)
function oldSea(I3, rows) {
  const lon0 = 73.6, lon1 = 77.9, lat0 = 7.95, lat1 = 14.7, nx = 170, nz = 270;
  const g = new THREE.PlaneGeometry(1, 1, nx - 1, nz - 1), P = g.attributes.position, reach = new Float32Array(nx * nz), LL = [];
  const hillAt = lat => { const i = clamp(Math.round((KER_N - lat) / .02), 0, rows.length - 1); return rows[i][2]; };
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const k = j * nx + i, lon = lerp(lon0, lon1, i / (nx - 1)), lat = lerp(lat1, lat0, j / (nz - 1)), [x, z] = MAP3.xz(lon, lat);
    P.setXYZ(k, x, -1, z); LL.push(lat);
    const lim = lat > KER_N ? -1 : Math.min(hillAt(lat) + .05, lat < 8.6 ? 77.5 : 99);
    reach[k] = lon < lim && dem3('kerala').at(lon, lat) > -3 ? 1 : 0;
  }
  g.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color: '#3AAEB8', roughness: .22, metalness: 0, transparent: true, opacity: .9, depthWrite: true, side: THREE.DoubleSide });
  const m = mesh3(I3.scene, g, mat, [0, 0, 0], { cast: false, receive: true }); m.frustumCulled = false; m.renderOrder = 2;
  m.set = (level, a = .9) => {
    m.visible = a > .01; mat.opacity = a;
    for (let k = 0; k < nx * nz; k++) { const L = reach[k] ? level(LL[k]) : 0; P.setY(k, L > .5 ? I3.hy(L) : -.2); }
    P.needsUpdate = true;
  };
  m.set(() => 0, 0);
  return m;
}

// a soft dark band (under captions or a list)
function band(c, y0, y1, a = .5) {
  if (a <= 0) return; c.save(); const g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, 'rgba(6,4,6,0)'); g.addColorStop(.25, `rgba(6,4,6,${a})`); g.addColorStop(.75, `rgba(6,4,6,${a})`); g.addColorStop(1, 'rgba(6,4,6,0)');
  c.fillStyle = g; c.fillRect(0, y0, W, y1 - y0); c.restore();
}
