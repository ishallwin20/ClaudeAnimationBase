// geo.mjs: country outlines for the 3D style's maps, from Natural Earth (public domain) in its India point of view
// (ne_10m_admin_0_countries_ind: India's borders as the Survey of India draws them, all of Jammu & Kashmir, Ladakh and
// Arunachal Pradesh inside). Writes src/data/india_geo.js: GEO.<key> = [ring, ...], a ring [[lon, lat], ...] simplified
// to ~2 km. The download is cached in out/ne/.
//   node tools/geo.mjs
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const F = 'out/ne/ne_10m_admin_0_countries_ind.geojson';
if (!existsSync(F)) {
  mkdirSync('out/ne', { recursive: true });
  const r = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries_ind.geojson');
  writeFileSync(F, Buffer.from(await r.arrayBuffer()));
}
const fc = JSON.parse(readFileSync(F, 'utf8'));
// Douglas–Peucker in degrees
function simplify(P, tol) {
  if (P.length < 3) return P;
  const keep = new Uint8Array(P.length); keep[0] = keep[P.length - 1] = 1; const st = [[0, P.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let md = 0, mi = -1; const [ax, ay] = P[a], [bx, by] = P[b], dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-12;
    for (let i = a + 1; i < b; i++) { const d = L > 1e-12 ? Math.abs(dy * (P[i][0] - ax) - dx * (P[i][1] - ay)) / L : Math.hypot(P[i][0] - ax, P[i][1] - ay); if (d > md) { md = d; mi = i; } }
    if (md > tol) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return P.filter((_, i) => keep[i]);
}
const area = R => { let s = 0; for (let i = 0; i < R.length; i++) { const [x1, y1] = R[i], [x2, y2] = R[(i + 1) % R.length]; s += x1 * y2 - x2 * y1; } return Math.abs(s / 2); };
const rings = (a3, minArea) => {
  const f = fc.features.find(f => f.properties.ADM0_A3 === a3), g = f.geometry, polys = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
  return polys.map(p => p[0]).filter(r => area(r) >= minArea).map(r => simplify(r, .015).map(([x, y]) => [+x.toFixed(3), +y.toFixed(3)]));
};
const GEO = { india: rings('IND', .02), lanka: rings('LKA', .02) };
writeFileSync('src/data/india_geo.js', `// india_geo.js: written by tools/geo.mjs from Natural Earth (public domain), India's point of view; don't edit.\n` +
  `// GEO.india: India's outline (its islands too), GEO.lanka: Sri Lanka's. Rings of [lon, lat].\nvar GEO = window.GEO || (window.GEO = {});\n` +
  Object.entries(GEO).map(([k, v]) => `GEO.${k} = ${JSON.stringify(v)};`).join('\n') + '\n');
console.log(Object.entries(GEO).map(([k, v]) => `${k}: ${v.length} rings, ${v.reduce((s, r) => s + r.length, 0)} points`).join('; '));
