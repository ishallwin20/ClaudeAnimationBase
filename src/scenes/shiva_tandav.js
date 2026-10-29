// shiva_tandav.js: "Shiv Tandav" (Cel style, 16 s loop). Chibi Shiva dances on the Kailash snowfield to the Shiv Tandav
// clip (150 BPM, a beat every 0.4 s from t = 0): a key pose lands every two beats (20 a loop) and he bounces on the beat
// between, held on threes. A gold chakra burst on the first hit, the trishul in light as he starts and again behind his
// Nataraja at the end (so the loop closes on it), stomps that shake the frame, the Ganga's wisp, snow.
const GROUND = 1500, SX = 540, SS = .88;
const SP = CEL_SHIVA_POSES, M = celMirror;
const TANDAV = [
  SP.hook, SP.wide, SP.damaru, SP.kick, SP.jump, SP.squat, SP.thrust, M(SP.thrust), SP.cross, SP.ears,
  M(SP.wide), M(SP.kick), SP.lunge, M(SP.lunge), SP.damaru, M(SP.cross), SP.jump, SP.squat, SP.ears, SP.nataraja,
];
const looped = (t, draw) => { const u = t / DUR; draw(t, 1 - u); draw(t - DUR, u); };
const TRISHUL = t => Math.max(1 - seg(t, .9, 1.9), seg(t, 15.0, 15.4));   // full at the loop's seam, gone in between
SHOTS.push({
  a: 0, b: DUR, draw(c, u, t) {
    const P = celDance(t, TANDAV, { every: 2, tr: .45 }), td = P.td;
    // a stomp shakes the frame (on threes, like him)
    const st = P.next.stomp && P.land >= 0 ? Math.exp(-P.land * 8) : 0;
    if (st > .02) { c.translate(W / 2, H / 2); c.scale(1.025, 1.025); c.translate(-W / 2 + (hash(CEL.d + 1) - .5) * 22 * st, -H / 2 + (hash(CEL.d + 7) - .5) * 22 * st); }
    ptDraw(c, ptLayer('snow', [0, 0, W, H], celSnowfield, { seed: 3 }));
    glow(c, 380, 880, 560, '#FFF8E6', .22 + .04 * Math.sin(t * TAU / DUR), 'screen');
    looped(t, (tt, k) => motes(c, { n: 60, seed: 2, box: [0, 200, W, 1500], r: 2.4, col: '#EAF3FF', a: .6 * k, vx: -14, vy: 46, t: tt }));
    // the trishul in light, standing in the snow at his right
    const tr = TRISHUL(td);
    celTrishulGlow(c, 196, GROUND - 10, 640, tr * (.85 + .15 * Math.sin(td * 9)));
    // the chakra burst on the first hit (the loop's seam)
    celChakra(c, SX, GROUND - 520 * SS, (t + .2) / 1.1, 3);
    // contact shadows under the planted feet
    for (const f of [P.fL, P.fR]) {
      const a = .4 * clamp(1 + f[1] / 120), fx = SX + f[0] * SS;
      c.save(); c.translate(fx, GROUND + 6); c.scale(1, .22); const g = c.createRadialGradient(0, 0, 0, 0, 0, 90);
      g.addColorStop(0, `rgba(30,55,130,${a})`); g.addColorStop(1, 'rgba(30,55,130,0)'); c.fillStyle = g; c.fillRect(-90, -90, 180, 180); c.restore();
    }
    // a stomp sends a ring through the snow
    if (st > .02) { const r = easeOut(P.land / .6); c.save(); c.translate(SX, GROUND + 6); c.scale(1, .2); c.globalAlpha = (1 - r) * .7; c.strokeStyle = '#F6FAFF'; c.lineWidth = 18; c.beginPath(); c.arc(0, 0, 160 + r * 420, 0, TAU); c.stroke(); c.restore(); }
    let A;
    figure(c, (l) => { A = celShiva(l, SX, GROUND, SS, P); }, { rim: { col: '#EEF6FF', dx: -6, dy: -8, a: .85, blur: 1.5 }, grade: [[600, 'rgba(255,248,235,0)'], [1500, 'rgba(40,70,160,.16)']] });
    // the Ganga: a glowing wisp curling up from his bun
    const [bx, by] = A.bun, wp = [[bx, by + 6], [bx - 24 + Math.sin(td * 3) * 8, by - 46], [bx + 12 + Math.sin(td * 3 + 1) * 10, by - 90], [bx - 10 + Math.sin(td * 3 + 2) * 12, by - 128]];
    c.save(); c.globalCompositeOperation = 'lighter';
    c.globalAlpha = .28; limb(c, wp, [16, 18, 14, 4], '#59CFFF'); c.globalAlpha = .9; limb(c, wp, [5, 6, 5, 1.5], '#D8F7FF'); c.restore();
    glow(c, bx - 6, by - 64, 84, '#7FDCFF', .35);
    for (let i = 0; i < 5; i++) { const ph = frac(td * .7 + i / 5); glow(c, bx + Math.sin(i * 2.1 + td) * 30, by - 56 - ph * 100, 10, '#BFF2FF', .7 * (1 - ph)); }
    // snow puffs where a foot lands (a foot that moved since the last pose); a stomp throws more
    if (P.land >= 0 && P.land < .5) for (const [f0, f1] of [[P.prev.fL, P.next.fL], [P.prev.fR, P.next.fR]]) {
      if (f1[1] < -5 || Math.hypot(f1[0] - f0[0], f1[1] - f0[1]) < 20) continue;
      const fx = SX + f1[0] * SS, u2 = P.land / .5, big = P.next.stomp ? 1.8 : 1;
      for (let i = 0; i < 9; i++) { const a = Math.PI + (i + .5) / 9 * Math.PI, sp = (40 + hash(i + f1[0]) * 50) * big;
        glow(c, fx + Math.cos(a) * sp * easeOut(u2) * 1.4, GROUND + Math.sin(a) * sp * easeOut(u2) * .7 + u2 * u2 * 30, (14 + 10 * u2) * big, '#F4F8FF', .7 * (1 - u2), 'screen'); }
    }
    looped(t, (tt, k) => motes(c, { n: 26, seed: 7, box: [0, 0, W, H], r: 6, col: '#F4F8FF', a: .75 * k, vx: -24, vy: 110, t: tt }));
    // the last hit (15.6 s): a gold flash behind the Nataraja, opening into the burst at the seam
    glow(c, SX, GROUND - 500 * SS, 700, '#FFE3A0', .5 * seg(t, 15.4, 15.95), 'screen');
  }
});
// the title, up from frame 0 (above him, in the safe band)
POST.push((c) => {
  c.save(); const g = c.createLinearGradient(0, 340, 0, 620); g.addColorStop(0, 'rgba(14,30,80,0)'); g.addColorStop(.4, 'rgba(14,30,80,.3)'); g.addColorStop(1, 'rgba(14,30,80,0)'); c.fillStyle = g; c.fillRect(0, 340, W, 280); c.restore();
  text(c, 'HAR HAR MAHADEV', 540, 445, '600 30px Poppins', '#FFF6DA', { glow: ['rgba(10,25,70,.9)', 14], spacing: 10 });
  text(c, 'शिव ताण्डव', 540, 522, '84px "Tiro Devanagari Sanskrit"', '#FFE08A', { glow: ['rgba(10,25,70,.95)', 24], maxW: 900 });
});
LOOK.bloom = .26; LOOK.vignette = .3; LOOK.grain = .035;
