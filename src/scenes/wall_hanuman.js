// wall_hanuman.js: "Up to the sun": Bal Hanuman flying up toward a big rising sun at dawn, reaching for it with
// sparkly eyes, his tail streaming, clouds rushing down past him, birds, the sun's rays turning.
(() => {
  const C = { skyHi: '#6FA6DC', skyMid: '#F4B98A', skyLo: '#FFE0B0', sun: '#FFC93C', sunDk: '#F29A1E', sunLt: '#FFF1B0' };
  wallpaper('wall_hanuman', t => {
    boilSeed('wh sky');
    paint(rectPts(-60, -60, DW + 120, DH + 120), { wash: C.skyHi, ink: null });
    // dawn rings round the sun, as washes (a warm fill over blue would mix green), softened by same-hue fills
    paint(ellPts(760, 1060, 1150, 1250, 48), { wash: '#A9C3E0', ink: null }); paint(ellPts(760, 1060, 1180, 1280, 48), { fill: '#A9C3E0', fillOp: 120, bleed: .3, tex: .2, ink: null });
    paint(ellPts(760, 1060, 880, 940, 44), { wash: '#F2C6A6', ink: null }); paint(ellPts(760, 1060, 910, 970, 44), { fill: '#F2C6A6', fillOp: 120, bleed: .3, tex: .2, ink: null });
    paint(ellPts(760, 1040, 600, 640, 40), { wash: C.skyMid, ink: null }); paint(ellPts(760, 1040, 630, 670, 40), { fill: C.skyMid, fillOp: 120, bleed: .3, tex: .2, ink: null });
    paint(ellPts(760, 1020, 400, 420, 36), { wash: C.skyLo, ink: null }); paint(ellPts(760, 1020, 430, 450, 36), { fill: C.skyLo, fillOp: 120, bleed: .3, tex: .2, ink: null });
    glow(760, 1040, 1100, '#FFD8A8', .35);
    // the sun, right of centre under the clock; its rays turn one ray-step a loop
    const sx = 760, sy = 1010, sr = 210, pk = .5 + .5 * lsin(t, 2);
    glow(sx, sy, 760, '#FFC860', .6); glow(sx, sy, 400, '#FFE9A0', .5 + .15 * pk);
    boilSeed('wh rays');
    const nr = 14, rot = t / WL * TAU / nr;
    for (let i = 0; i < nr; i++) { const a = rot + i / nr * TAU, r0 = sr * 1.12, r1 = sr * (1.55 + .08 * (i % 2)) + 10 * pk;
      paint([[sx + Math.cos(a - .09) * r0, sy + Math.sin(a - .09) * r0], [sx + Math.cos(a) * r1, sy + Math.sin(a) * r1], [sx + Math.cos(a + .09) * r0, sy + Math.sin(a + .09) * r0]], { wash: i % 2 ? '#FFD35A' : '#FFB83C', washOp: 230, ink: null, curv: .3 }); }
    boilSeed('wh sun');
    paint(ellPts(sx, sy, sr, sr, 40), { wash: C.sun, fill: C.sunDk, fillOp: 70, tex: .5, border: .5, ink: '#C9620F', sw: 1.2 });
    paint(ellPts(sx - 50, sy - 60, 90, 70, 20), { wash: C.sunLt, washOp: 170, ink: null });
    // a sleepy sun face, so he looks like a fruit you'd want to bite
    for (const s of [-1, 1]) inkLine([[sx + s * 70 - 26, sy - 8], [sx + s * 70, sy + 6], [sx + s * 70 + 26, sy - 8]], 1.6, '#A0480C', 'ink', .6);
    paint(ellPts(sx - 105, sy + 40, 30, 18, 12), { wash: '#F58A5A', washOp: 150, ink: null }); paint(ellPts(sx + 105, sy + 40, 30, 18, 12), { wash: '#F58A5A', washOp: 150, ink: null });
    inkLine([[sx - 26, sy + 52], [sx, sy + 66], [sx + 26, sy + 52]], 1.4, '#A0480C', 'ink', .6);
    // birds far off, flapping
    for (let i = 0; i < 3; i++) { const bx = 230 + i * 110 + lsin(t, 1, i * .3) * 20, by = 880 + i * 40 + lsin(t, 2, i * .2) * 10, f = lsin(t, 8, i * .3) * 14;
      boilSeed('wh bird ' + i); inkLine([[bx - 26, by - f], [bx - 8, by - 4], [bx, by + 2], [bx + 8, by - 4], [bx + 26, by - f]], 1.2, '#5A4A6A', 'ink', .5); }
    // cloud banks rushing down past him (two laps a loop: he's flying up)
    for (let j = 0; j < 5; j++) {
      const y = frac(hash(j * 4.1) + t / WL * 2) * 1700 + 1050, x = hash(j * 2.7) * DW, w = 220 + hash(j * 9.3) * 160, fade = clamp((y - 1050) / 260);
      boilSeed('wh cl ' + j);
      paint(ellPts(x, y, w, w * .3, 22), { fill: '#F9DCC8', fillOp: 170 * fade, bleed: .25, tex: .3, border: .3, ink: null });
      paint(ellPts(x - w * .25, y - w * .12, w * .6, w * .3, 20), { fill: '#FFF6EC', fillOp: 210 * fade, bleed: .2, tex: .3, border: .3, ink: null });
    }
    // speed streaks behind him
    for (let i = 0; i < 6; i++) { const k = frac(hash(i * 3.3) + t / WL * 3), x = 250 + hash(i * 1.7) * 280, y = 1700 + k * 520;
      boilSeed('wh streak ' + i); inkLine([[x, y], [x - 50, y + 160]], 1.2, '#FFFFFF', 'inkfine', 0); }
    // Bal Hanuman, flying up and right, reaching for the sun
    const hx = 380 + lsin(t, 1) * 18, hy = 1720 + lsin(t, 2, .1) * 26, u = 46;
    rigClock(t, 'kid', 1, () => balHanuman(hx, hy, u, {
      pose: 'fly', rot: .5 + lsin(t, 1, .2) * .05, eyes: 'sparkle', mouth: 'open', mouthK: .5 + .15 * lsin(t, 2), blush: .5,
      tail: 'stream', tailSway: t / WL * 2, kick: t / WL * 4, lookX: .5, lookY: -.4,
      handL: [-4.9, -9.6 + lsin(t, 2, .3) * .3], handR: [4.9, -10.4 + lsin(t, 2) * .35], handShapeL: 'open', handShapeR: 'claw',
      boilKey: 'wh hanu', noShadow: true,
    }), { at: 1, noBlink: true });
  });
})();
