// cel_demo.js: the Cel style's demo (cel.html): chibi Shiva's eight-pose tandav at 120 BPM, a pose landing on each
// beat, held on threes. 0–4 s calm on the Kailash snowfield (snow, the trishul in light, the Ganga's wisp, snow puffs);
// 4–8 s the same dance as the Rudra tandav in the storm (the fierce face, flying jata, the third eye, the ring of fire,
// lightning, fire cracks on the stomp). Each half is a seamless 4 s loop.
const GROUND = 1490, SX = 540, SS = .92, HALF = 4;
const looped = (t, draw, d = HALF) => { const u = t / d; draw(t, 1 - u); draw(t - d, u); };
const feetShadows = (c, P, col) => { for (const f of [P.fL, P.fR]) {
  const a = .45 * clamp(1 + f[1] / 120), fx = SX + f[0] * SS;
  c.save(); c.translate(fx, GROUND + 6); c.scale(1, .22); const g = c.createRadialGradient(0, 0, 0, 0, 0, 90);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(-90, -90, 180, 180); c.restore(); } };
// the calm tandav
SHOTS.push({
  a: 0, b: HALF, draw(c, u) {
    ptDraw(c, ptLayer('snow', [0, 0, W, H], celSnowfield, { seed: 3 }));
    glow(c, 380, 880, 560, '#FFF8E6', .24, 'screen');
    looped(u, (tt, k) => motes(c, { n: 60, seed: 2, box: [0, 200, W, 1500], r: 2.4, col: '#EAF3FF', a: .6 * k, vx: -14, vy: 46, t: tt }));
    const P = celDance(u, CEL_SHIVA_DANCE);
    celTrishulGlow(c, 190, GROUND - 10, 660, .8);
    feetShadows(c, P, '#1E3782');
    let A; figure(c, (l) => { A = celShiva(l, SX, GROUND, SS, P); }, { rim: { col: '#EEF6FF', dx: -6, dy: -8, a: .85, blur: 1.5 }, grade: [[600, 'rgba(255,248,235,0)'], [1500, 'rgba(40,70,160,.16)']] });
    const [bx, by] = A.bun, td = P.td, wp = [[bx, by + 6], [bx - 24 + Math.sin(td * 3) * 8, by - 46], [bx + 12 + Math.sin(td * 3 + 1) * 10, by - 90], [bx - 10 + Math.sin(td * 3 + 2) * 12, by - 128]];
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .28; limb(c, wp, [16, 18, 14, 4], '#59CFFF'); c.globalAlpha = .9; limb(c, wp, [5, 6, 5, 1.5], '#D8F7FF'); c.restore();
    looped(u, (tt, k) => motes(c, { n: 26, seed: 7, box: [0, 0, W, H], r: 6, col: '#F4F8FF', a: .75 * k, vx: -24, vy: 110, t: tt }));
  }
});
// the Rudra tandav
SHOTS.push({
  a: HALF, b: 2 * HALF, draw(c, u) {
    const P = celDance(u, CEL_SHIVA_DANCE), td = P.td, L = clamp(strikes(u, [0, 2]));
    const st = P.next.stomp && P.land >= 0 ? Math.exp(-P.land * 7) : 0;
    if (st > .02) { c.translate(W / 2, H / 2); c.scale(1.035, 1.035); c.translate(-W / 2 + (hash(CEL.d + 1) - .5) * 30 * st, -H / 2 + (hash(CEL.d + 7) - .5) * 30 * st); }
    ptDraw(c, ptLayer('storm', [0, 0, W, H], celStormfield, { seed: 5 }));
    flash(c, .2 * L, '#9A7ADF');
    bolt(c, 300, -60, 210, 1170, 11, clamp(strikes(u, [0])), '#D6C6FF'); bolt(c, 820, -60, 950, 1140, 12, clamp(strikes(u, [2])), '#D6C6FF');
    looped(u, (tt, k) => motes(c, { n: 40, seed: 3, box: [0, 300, W, 1600], r: 2.2, col: '#FF8A4A', a: .5 * k, vx: 8, vy: -40, t: tt }));
    celFlameRing(c, SX, GROUND - 560 * SS, 410, td, 1, P.land >= 0 ? Math.exp(-P.land * 6) * (P.next.stomp ? 1 : .45) : 0);
    if (st > .02) celCracks(c, SX, GROUND + 4, 7, Math.exp(-P.land * 1.5));
    feetShadows(c, P, '#000000');
    const eye3 = P.next.stomp ? clamp(seg(td, 1.75, 2)) * (1 - seg(td, 2.4, 2.5)) : 0;
    let A; figure(c, (l) => figure(l, (m) => { A = celShiva(m, SX, GROUND, SS, P, { fierce: true, eye3, locks: 6, pal: { skin: '#3F6FD6', sh: '#26449E', lt: '#7FA2F2' } }); }, { rim: { col: '#FF6A2A', dx: 2, dy: 8, a: .9, blur: 2 } }),
      { grade: [[560, 'rgba(40,8,70,.18)'], [1500, 'rgba(120,18,28,.26)']], edge: { col: '#FF5A2A', w: 3, a: .7 }, rim: { col: '#D6C6FF', dx: -6, dy: -8, a: .25 + .7 * L, blur: 1.5 } });
    if (eye3 > .3) { const [ex, ey] = A.eye3; glow(c, ex, ey, 110 * eye3, '#FF3B1F', .9 * eye3); glow(c, ex, ey, 30 * eye3, '#FFE6A0', eye3); }
    looped(u, (tt, k) => motes(c, { n: 34, seed: 9, box: [0, 0, W, H], r: 5, col: '#FFB24A', a: .8 * k, vx: 18, vy: -120, t: tt }));
  }
});
LOOK.bloom = .3; LOOK.vignette = .4; LOOK.grain = .04;
