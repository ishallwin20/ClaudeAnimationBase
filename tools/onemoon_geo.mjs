// onemoon_geo.mjs: the country outlines for "One moon" (ad 114): India and Thailand, from the Natural Earth file
// tools/geo.mjs caches (its India view). Writes src/data/bay_geo.js: GEO.thai = [ring, ...] (GEO.india comes from
// src/data/india_geo.js).   node tools/geo.mjs && node tools/onemoon_geo.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const fc = JSON.parse(readFileSync('out/ne/ne_10m_admin_0_countries_ind.geojson', 'utf8'));
function simplify(P, tol) {
  if (P.length < 3) return P;
  const keep = new Uint8Array(P.length); keep[0] = keep[P.length - 1] = 1; const st = [[0, P.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let md = 0, mi = -1; const [ax, ay] = P[a], [bx, by] = P[b], dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy);
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
const GEO = { thai: rings('THA', .05) };
writeFileSync('src/data/bay_geo.js', `// bay_geo.js: written by tools/onemoon_geo.mjs (Natural Earth, public domain); don't edit.\nvar GEO = window.GEO || (window.GEO = {});\nGEO.thai = ${JSON.stringify(GEO.thai)};\n`);
console.log('thai rings', GEO.thai.length, GEO.thai.map(r => r.length));
