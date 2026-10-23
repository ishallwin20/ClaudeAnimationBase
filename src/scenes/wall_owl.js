// wall_owl.js: "Shubh Deepavali": Maa Lakshmi's owl on a parapet lined with diyas on Diwali night, a diya in his
// wings, the town's lamp strings twinkling behind, fireworks blooming, gold coins and Lakshmi's footprints in the
// rangoli. Once a loop his head turns right round (owls can't, he can).
(() => {
  const C = { skyHi: '#140F33', skyMid: '#2A1D5A', skyLo: '#4A2E6E', roof: '#1C1640', roofLt: '#2C2458', wall: '#E9B98A', wallDk: '#C98E5E', rangoli: '#FFF3DC' };
  // a firework: a ring of sparks from (x, y), age 0..1
  function firework(x, y, r, age, cols, key) {
    if (age <= 0 || age >= 1) return;
    const k = easeOut(age), fade = 1 - seg(age, .45, 1), n = 18;
    
    boilSeed(key);
    for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i + x) * .2, d = r * k, dr = 1 + .25 * (i % 2), px = x + Math.cos(a) * d * dr, py = y + Math.sin(a) * d * dr + 60 * age * age;
      inkLine([[x + Math.cos(a) * d * dr * .7, y + Math.sin(a) * d * dr * .7 + 40 * age * age], [px, py]], 1.4 * fade + .2, cols[i % 2], 'inkfine', 0);
      if (i % 3 === 0) glow(px, py, 34 * fade + 4, cols[i % 2], .8 * fade);
      paint(ellPts(px, py, 6 * fade + 1, 6 * fade + 1, 6), { wash: cols[i % 2], washOp: 255 * fade, ink: null }); }
  }
  // Lakshmi's footprint (a rangoli pagla), at (x, y), s long
  function pagla(x, y, s, a, key) {
    boilSeed(key); push(); translate(x, y); rotate(a);
    paint(ellPts(0, 0, s * .26, s * .42, 16), { wash: '#E2476E', washOp: 220, ink: null });
    for (let i = 0; i < 5; i++) paint(ellPts(-s * .2 + i * s * .1, -s * .52 - (i === 1 || i === 2 ? s * .05 : 0), s * .055, s * .07, 8), { wash: '#E2476E', washOp: 220, ink: null });
    paint(ellPts(0, -s * .05, s * .1, s * .12, 10), { wash: '#FFF3DC', ink: null });
    pop();
  }
  wallpaper('wall_owl', t => {
    boilSeed('wo sky');
    paint(rectPts(-60, -60, DW + 120, DH + 120), { wash: C.skyHi, ink: null });
    glow(540, 1650, 1500, '#5A2E8A', .85); glow(540, 1700, 800, '#8A4A8A', .5);   // the town's light on the night sky
    twinkle(t, 30, 'wo', { y1: 1100, s: .8 });
    // fireworks: two blooms a loop either side, under the clock
    firework(250, 980, 190, seg(t, .2, 1.9), ['#FFD35A', '#FF8A5A'], 'wo fw1');
    firework(840, 1120, 160, seg(t, 2.6, 4.2), ['#8AE0FF', '#E58AE0'], 'wo fw2');
    firework(470, 860, 120, seg(t, 4.3, 5.8), ['#FFF0A0', '#7AF0B0'], 'wo fw3');
    // the town: rooftops with strings of lamps
    boilSeed('wo town');
    const roofs = [[-60, 1560], [80, 1500], [200, 1530], [260, 1440], [380, 1440], [440, 1520], [600, 1500], [660, 1400], [760, 1460], [880, 1470], [940, 1530], [1140, 1510]];
    paint([...roofs, [1140, 2400], [-60, 2400]], { wash: C.roof, ink: null });
    for (let i = 0; i < 9; i++) { const x = 40 + i * 120, y = 1560 + hash(i * 3.1) * 60; paint(rrPts(x, y, 34, 46, 6), { wash: '#FFC870', washOp: 200, ink: null }); glow(x + 17, y + 23, 60, '#FFB347', .35); }
    for (let s = 0; s < 3; s++) for (let i = 0; i < 14; i++) {
      const k = i / 13, x = lerp(-20 + s * 360, 380 + s * 360, k), y = 1490 + s * 22 + Math.sin(k * Math.PI) * 70, b = .5 + .5 * lsin(t, 2 + (i % 3), hash(i * 7 + s));
      glow(x, y, 26, i % 2 ? '#FFD35A' : '#FF8A6A', .55 * b); paint(ellPts(x, y, 5, 5, 6), { wash: i % 2 ? '#FFE9A0' : '#FFB49A', washOp: 150 + 105 * b, ink: null });
    }
    // the parapet: a warm lit wall top, a rangoli ring on the terrace floor below it
    boilSeed('wo wall');
    paint(rectPts(-60, 1940, DW + 120, 500), { wash: '#7A3E5A', fill: '#5A2A44', fillOp: 60, tex: .4, ink: null });
    paint(rectPts(-60, 1930, DW + 120, 70), { wash: C.wall, fill: C.wallDk, fillOp: 60, tex: .4, ink: PAL.ink, sw: 1 });
    paint(ellPts(540, 2160, 440, 110, 40), { wash: C.rangoli, washOp: 200, ink: null });
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; paint(ellPts(540 + Math.cos(a) * 340, 2160 + Math.sin(a) * 78, 24, 11, 10, 0, a), { wash: i % 2 ? '#E2476E' : '#F7A21B', ink: null }); }
    pagla(470, 2190, 70, -.15, 'wo p1'); pagla(600, 2140, 70, .15, 'wo p2');
    // gold coins on the parapet, glinting
    for (let i = 0; i < 5; i++) { const x = [300, 350, 720, 770, 745][i], y = [1930, 1922, 1930, 1922, 1912][i], g = Math.max(0, lsin(t, 2, i * .21));
      lakshmiCoin(x, y, 20, .9, 'wo coin ' + i); if (g > .85) { glow(x, y - 6, 50, '#FFF2B0', (g - .85) * 6); paint(starPts(x + 8, y - 10, 16, .2, 4), { wash: '#FFFBE0', ink: null }); } }
    // a row of diyas along the parapet
    for (let i = 0; i < 4; i++) diya([70, 210, 870, 1010][i], 1935, 120, t, 'wo diya ' + i);
    // the owl, a diya held in both wings; his head turns right round at 3.1–4.1 s
    const ox = 540, oy = 1932, u = 56, sp = seg(t, 3.1, 4.1), spinning = sp > 0 && sp < 1;
    const OO = {
      eyes: spinning ? 'wide' : t > 4.1 && t < 5 ? 'happy' : 'normal', mouth: spinning ? 'O' : 'smile', blush: .5,
      hturn: ease(sp), spin: Math.sin(sp * Math.PI), hx: spinning ? 0 : lsin(t, 1, .1) * .15, htilt: lsin(t, 1, .3) * .06,
      puff: .3 + .1 * lsin(t, 2), dy: -lsin(t, 2) * .08, lookY: .2,
      wingL: [-1.5, -4.3], wingR: [1.5, -4.3], wingShapeL: 'hold', wingShapeR: 'hold', boilKey: 'wo owl',
    };
    rigClock(t, 'owl', 0, () => owl(ox, oy, u, OO), { at: .8 });
    const [lx, ly] = owlWing(ox, oy, u, OO, -1), [rx, ry] = owlWing(ox, oy, u, OO, 1);
    diya((lx + rx) / 2, (ly + ry) / 2 + 26, 150, t, 'wo held');
  });
})();
