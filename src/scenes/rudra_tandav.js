// rudra_tandav.js: "Rudra Tandav" (Cel style, 16 s loop): the fierce version of "Shiv Tandav", on the same song and
// beat map (150 BPM, a key pose every two beats). Kailash in a storm: a violet-black sky burning red at the horizon,
// lightning on the hits (twin bolts on frame 0, strikes into the trishul), a ring of fire behind him, embers rising,
// stomps that crack the ground with fire and shake the frame. His face is the Rudra face (no blush, brows down, a roar
// on the big hits), his jata lash out on both sides, and the third eye opens and burns on the stomps, the rage and
// the Nataraja.
const GROUND = 1500, SX = 540, SS = .88, RING = [SX, GROUND - 560 * SS], RING_R = 400, TRI_X = 170, TRI_TOP = 640;
const SP = CEL_SHIVA_POSES, M = celMirror, OPEN = new Set(['squat', 'rage', 'nataraja']);
// every move bigger: more lean and head tilt; the third eye open (eye: 1) on the stomps, the rage and the Nataraja
const hot = (name, mir) => { const p = mir ? M(SP[name]) : SP[name]; return { ...p, lean: (p.lean || 0) * 1.4, head: (p.head || 0) * 1.4, eye: OPEN.has(name) ? 1 : 0 }; };
const RUDRA = [['squat'], ['wide'], ['damaru'], ['kick'], ['jump'], ['squat'], ['thrust'], ['thrust', 1], ['lunge'], ['lunge', 1],
  ['damaru', 1], ['kick', 1], ['rage'], ['cross'], ['jump'], ['squat'], ['wide', 1], ['thrust'], ['damaru'], ['nataraja']].map(([n, m]) => hot(n, m));
// lightning: [time, x0, y0, x1, y1, seed]; the flickers light the sky without a bolt
const BOLTS = [[0, 300, -60, 210, 1170, 11], [0, 820, -60, 950, 1140, 12], [1.6, 90, -60, TRI_X, TRI_TOP - 10, 21], [4.0, 900, -60, 1010, 1190, 31],
  [6.4, -20, 330, 430, 540, 41], [8.0, 760, -60, 860, 1160, 51], [9.6, 280, -60, 210, 1190, 61], [9.6, 800, -60, 890, 1170, 62],
  [12.0, 960, -60, 900, 1200, 71], [13.6, 1100, 240, 620, 430, 81], [15.2, 90, -60, TRI_X, TRI_TOP - 10, 91]];
const FLICKERS = [1.2, 7.6, 10.8, 13.0, 14.4];
const TRI_HITS = BOLTS.filter(b => b[3] === TRI_X).map(b => b[0]);
const looped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };
const PAL = { skin: '#3F6FD6', sh: '#26449E', lt: '#7FA2F2' };
SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    const P = celDance(t, RUDRA, { every: 2, tr: .4, over: 1.9 }), td = P.td;
    const L = clamp(strikes(t, [...new Set(BOLTS.map(b => b[0])), ...FLICKERS]));
    // a stomp (or the rage) shakes the frame
    const big = (P.next.stomp || P.next.mouth === 'o' && P.next.squash >= .5) && P.land >= 0 ? Math.exp(-P.land * 7) : 0;
    if (big > .02) { c.translate(W / 2, H / 2); c.scale(1.035, 1.035); c.translate(-W / 2 + (hash(CEL.d + 1) - .5) * 34 * big, -H / 2 + (hash(CEL.d + 7) - .5) * 34 * big); }
    ptDraw(c, ptLayer('storm', [0, 0, W, H], celStormfield, { seed: 5 }));
    // the storm lit by the lightning, the horizon breathing with the beat
    flash(c, .2 * L, '#9A7ADF');
    glow(c, 540, CEL_HZ - 30, 640, '#FF5A22', .2 + .08 * Math.exp(-(P.beatLand ?? 1) * 6), 'screen');
    for (const [t0, x0, y0, x1, y1, seed] of BOLTS) { const k = t - t0; if (k >= 0 && k < .7) bolt(c, x0, y0, x1, y1, seed, clamp(strikes(t, [t0])), '#D6C6FF'); }
    looped(t, (tt, k) => motes(c, { n: 40, seed: 3, box: [0, 300, W, 1600], r: 2.2, col: '#FF8A4A', a: .5 * k, vx: 8, vy: -40, t: tt }));
    // the trishul, red-hot in the snow at his right, white when the lightning strikes it
    const tri = clamp(strikes(t, TRI_HITS));
    celTrishulGlow(c, TRI_X, GROUND - 10, TRI_TOP, .6 + .25 * Math.exp(-(P.beatLand ?? 1) * 6), '#FF5A1F');
    celTrishulGlow(c, TRI_X, GROUND - 10, TRI_TOP, tri, '#D6C6FF');
    // the ring of fire behind him: it leaps on every landing, most on a stomp
    const flare = P.land >= 0 ? Math.exp(-P.land * 6) * (P.next.stomp ? 1 : .45) : 0;
    celFlameRing(c, RING[0], RING[1], RING_R, td, 1, flare);
    // fire cracks in the ground on a stomp, and a shock ring
    if (P.next.stomp && P.land >= 0) {
      celCracks(c, SX, GROUND + 4, 100 + P.slot, Math.exp(-P.land * 1.5));
      const r = easeOut(P.land / .6); if (r < 1) { c.save(); c.translate(SX, GROUND + 6); c.scale(1, .2); c.globalCompositeOperation = 'lighter'; c.globalAlpha = (1 - r) * .8; c.strokeStyle = '#FF7A2A'; c.lineWidth = 20; c.beginPath(); c.arc(0, 0, 160 + r * 460, 0, TAU); c.stroke(); c.restore(); }
    }
    for (const f of [P.fL, P.fR]) {
      const a = .55 * clamp(1 + f[1] / 120), fx = SX + f[0] * SS;
      c.save(); c.translate(fx, GROUND + 6); c.scale(1, .22); const g = c.createRadialGradient(0, 0, 0, 0, 0, 90);
      g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(-90, -90, 180, 180); c.restore();
    }
    // Shiva: fire from the ring and the ground on his edges and underside, the lightning on his top-left edge
    let A;
    const eye3 = P.eye ?? 0;
    figure(c, (l) => {
      figure(l, (m) => { A = celShiva(m, SX, GROUND, SS, P, { fierce: true, eye3, locks: 6, pal: PAL }); }, { rim: { col: '#FF6A2A', dx: 2, dy: 8, a: .9, blur: 2 } });
    }, { grade: [[560, 'rgba(40,8,70,.18)'], [1500, 'rgba(120,18,28,.26)']], edge: { col: '#FF5A2A', w: 3, a: .7 }, rim: { col: '#D6C6FF', dx: -6, dy: -8, a: .25 + .7 * L, blur: 1.5 } });
    // the third eye burns
    if (eye3 > .3) {
      const [ex, ey] = A.eye3, k = (eye3 - .3) / .7 * (.85 + .15 * Math.sin(td * 20));
      glow(c, ex, ey, 110 * k, '#FF3B1F', .9 * k); glow(c, ex, ey, 30 * k, '#FFE6A0', 1 * k);
      c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .7 * k; limb(c, [[ex - 170 * k, ey], [ex, ey], [ex + 170 * k, ey]], [1, 6, 1], '#FFB27A'); c.restore();
    }
    // the Ganga still curls from his bun, cool against the fire
    const [bx, by] = A.bun, wp = [[bx, by + 6], [bx - 24 + Math.sin(td * 3) * 8, by - 46], [bx + 12 + Math.sin(td * 3 + 1) * 10, by - 90], [bx - 10 + Math.sin(td * 3 + 2) * 12, by - 128]];
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .22; limb(c, wp, [16, 18, 14, 4], '#59CFFF'); c.globalAlpha = .7; limb(c, wp, [5, 6, 5, 1.5], '#D8F7FF'); c.restore();
    // sparks thrown up where a foot lands
    if (P.land >= 0 && P.land < .5) for (const [f0, f1] of [[P.prev.fL, P.next.fL], [P.prev.fR, P.next.fR]]) {
      if (f1[1] < -5 || Math.hypot(f1[0] - f0[0], f1[1] - f0[1]) < 20) continue;
      const fx = SX + f1[0] * SS, u2 = P.land / .5, k2 = P.next.stomp ? 1.8 : 1;
      for (let i = 0; i < 12; i++) { const a = Math.PI + (i + .5) / 12 * Math.PI, sp = (50 + hash(i + f1[0]) * 70) * k2;
        glow(c, fx + Math.cos(a) * sp * easeOut(u2) * 1.3, GROUND + Math.sin(a) * sp * easeOut(u2) * 1.1 + u2 * u2 * 60, 8 + 4 * k2, '#FF9A4A', .9 * (1 - u2)); }
    }
    // embers rising through the frame, the big ones in front
    looped(t, (tt, k) => motes(c, { n: 34, seed: 9, box: [0, 0, W, H], r: 5, col: '#FFB24A', a: .8 * k, vx: 18, vy: -120, t: tt }));
    flash(c, .06 * L, '#E6DCFF');
  }
});
// the title, up from frame 0 (above him, in the safe band)
POST.push((c) => {
  c.save(); const g = c.createLinearGradient(0, 340, 0, 620); g.addColorStop(0, 'rgba(6,2,10,0)'); g.addColorStop(.4, 'rgba(6,2,10,.45)'); g.addColorStop(1, 'rgba(6,2,10,0)'); c.fillStyle = g; c.fillRect(0, 340, W, 280); c.restore();
  text(c, 'HAR HAR MAHADEV', 540, 445, '600 30px Poppins', '#FFE2C2', { glow: ['rgba(40,0,0,.95)', 14], spacing: 10 });
  text(c, 'रुद्र ताण्डव', 540, 522, '84px "Tiro Devanagari Sanskrit"', '#FFA84A', { glow: ['rgba(60,0,0,.95)', 26], maxW: 900 });
});
LOOK.bloom = .4; LOOK.vignette = .62; LOOK.grain = .05;
