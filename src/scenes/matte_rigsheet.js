// matte_rigsheet.js: a rig's source picture with its part polygons, cut lines and pivots over a 100 px grid, to check
// and measure them. Load after the scene that defines the rig; RIGSHEET = { def, x0, y0, w } picks the area (source px).
const RIGSHEET = { def: KUSH, x0: 1500, y0: 900, w: 560 };
SHOTS.length = 0; CAPTIONS.length = 0; LOOK.bloom = 0; LOOK.vignette = 0; LOOK.grain = 0;
SHOTS.push({ a: 0, b: 99, draw(c) {
  const { def, x0, y0, w } = RIGSHEET, s = W / w, img = PICS[def.pic];
  c.fillStyle = '#3a3a44'; c.fillRect(0, 0, W, H);
  c.save(); c.scale(s, s); c.translate(-x0, -y0); c.drawImage(img, 0, 0);
  c.lineWidth = 1 / s; c.strokeStyle = 'rgba(255,255,255,.35)'; c.font = `${14 / s}px sans-serif`; c.fillStyle = '#fff';
  for (let x = Math.ceil(x0 / 100) * 100; x < x0 + w; x += 100) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y0 + H / s); c.stroke(); c.fillText(x, x + 3, y0 + 16 / s); }
  for (let y = Math.ceil(y0 / 100) * 100; y < y0 + H / s; y += 100) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke(); c.fillText(y, x0 + 3, y - 3); }
  def.parts.forEach((p, i) => {
    const col = `hsl(${i * 67},95%,55%)`; c.strokeStyle = col; c.lineWidth = 3 / s; c.beginPath(); p.poly.forEach(([x, y], k) => k ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.stroke();
    if (p.cut != null) { c.setLineDash([10 / s, 8 / s]); c.beginPath(); c.moveTo(Math.min(...p.poly.map(q => q[0])), p.cut); c.lineTo(Math.max(...p.poly.map(q => q[0])), p.cut); c.stroke(); c.setLineDash([]); }
    c.fillStyle = col; c.beginPath(); c.arc(p.pivot[0], p.pivot[1], 8 / s, 0, TAU); c.fill(); c.fillText(p.name, p.pivot[0] + 12 / s, p.pivot[1]);
  });
  c.restore();
}});
