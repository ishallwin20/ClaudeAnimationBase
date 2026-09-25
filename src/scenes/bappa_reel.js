// bappa_reel.js: "Bappa ki 3 complaints", a 32.7 s 9:16 reel. See STORYBOARD.md for the shots, reads and captions.
// World coordinates equal screen coordinates (1080 × 1920) unless a shot moves the camera.
(() => {
  const C = {
    marigold: '#F2A93B', saffron: '#E8772E', verm: '#D2452F', leaf: '#5E8F46',
    river: '#3A9C98', riverDk: '#23706E', chalk: '#CFCBC2', stone: '#C9B79C', stoneDk: '#A48F72',
    duskTop: '#3B2F5C', duskLow: '#F29A5B', dayTop: '#A9CBE0', dayLow: '#EEF0E6', goldTop: '#F4B860', goldLow: '#FCE6B8',
  };

  // ---------- world pieces ----------
  function sky(y0, y1, top, low, n = 20) {
    boilSeed('sky');
    const h = (y1 - y0) / n;
    for (let i = 0; i < n; i++) paint(rectPts(-60, y0 + i * h - 2, W + 120, h + 4), { wash: mixCol(top, low, i / (n - 1)), ink: null });
  }
  function city(y, col, seed = 0) {   // far skyline: flat pale blocks
    boilSeed('city' + seed);
    for (let i = 0; i < 11; i++) {
      const w = 70 + 70 * hash(i + seed), h = 50 + 150 * hash(i * 3.1 + seed), x = i * 100 - 30 + 20 * hash(i * 7 + seed);
      paint(rectPts(x, y - h, w, h + 30, 2), { wash: col, ink: null });
    }
  }
  function river(y0, y1, col, t, grey = 0) {
    boilSeed('river');
    paint(rectPts(-60, y0, W + 120, y1 - y0), { wash: col, fill: mixCol(col, C.riverDk, .5), fillOp: 80, bleed: .1, tex: .5, border: .3, ink: null });
    boilSeed('ripples');
    for (let i = 0; i < 16; i++) {
      const y = y0 + 30 + (y1 - y0 - 60) * hash(i * 2.7), x = W * hash(i * 5.3) + 30 * wob(t, .2, hash(i)), w = 40 + 70 * hash(i * 1.9);
      inkLine([[x - w, y], [x, y - 4], [x + w, y]], .8, mixCol(col, PAL.cream, .55), 'inkfine', .5);
    }
  }
  function ghat(y) {   // riverside stone steps, foreground
    boilSeed('ghat');
    for (let i = 0; i < 3; i++) {
      const yy = y + i * 110, sh = mixCol(C.stone, C.stoneDk, i * .3);
      paint(rectPts(-60, yy, W + 120, 2600), { wash: sh, fill: C.stoneDk, fillOp: 50, tex: .7, border: .4, ink: null });
      inkLine([[-20, yy + 2], [W / 2, yy - 2], [W + 20, yy + 3]], 1.1, PAL.ink, 'ink', .4);
    }
  }
  function toran(y, t) {   // a marigold garland across the top of the frame
    boilSeed('toran');
    const pts = []; for (let k = 0; k <= 12; k++) { const x = -40 + k * (W + 80) / 12; pts.push([x, y + 70 * Math.sin(Math.PI * k / 12) + 6 * wob(t, .5, k * .1)]); }
    inkLine(pts, 1.2, PAL.ink, 'inkfine', .6);
    pts.forEach(([x, yy], k) => {
      if (k % 2) paint([[x - 16, yy + 6], [x, yy + 44 + 6 * wob(t, .7, k)], [x + 16, yy + 6]], { wash: C.leaf, ink: PAL.ink, sw: .6, curv: .4 });
      paint(ellPts(x, yy, 25, 25, 16, 2), { wash: k % 2 ? C.marigold : C.saffron, fill: C.saffron, fillOp: 90, tex: .8, ink: PAL.ink, sw: .7 });
    });
  }
  function diyas(y, t) {   // small lamps along the ghat edge
    for (let i = 0; i < 7; i++) {
      const x = 60 + i * 160 + 30 * hash(i); boilSeed('diya' + i);
      glow(x, y - 14, 70 + 12 * wob(t, 1.3, hash(i)), '#FFB04A', .8);
      paint(ellPts(x, y, 22, 9, 12), { wash: C.saffron, ink: PAL.ink, sw: .6 });
      paint([[x - 5, y - 6], [x, y - 26 - 4 * wob(t, 2, i)], [x + 5, y - 6]], { wash: '#FFE07A', ink: null, curv: .5 });
    }
  }
  function petals(t, n = 26) {   // marigold petals drifting down, closed form
    for (let i = 0; i < n; i++) {
      const sp = 140 + 90 * hash(i * 3.3), y = ((hash(i * 1.7) * H + t * sp) % (H + 100)) - 50, x = W * hash(i * 9.1) + 40 * Math.sin(t * 1.3 + i);
      boilSeed('petal' + i);
      paint(ellPts(x, y, 11, 7, 10, 1, t * 2 + i), { wash: i % 3 ? C.marigold : C.saffron, ink: null });
    }
  }
  // ripples on water: flat rings spreading from (x, y) from time t0, one every `every` seconds
  function ripples(x, y, age, n = 3, big = 1) {
    if (age < 0) return;
    for (let k = 0; k < n; k++) {
      const a = age - k * .18; if (a <= 0 || a > 1.4) continue;
      const r = (40 + 380 * easeOut(a / 1.4)) * big; boilSeed('rip' + k);
      inkLine(ellPts(x, y, r, r * .22, 30).concat([ellPts(x, y, r, r * .22, 30)[0]]), 1.6 * (1 - a / 1.4) + .2, PAL.cream, 'inkfine', .3);
    }
  }
  function splash(x, y, age, s = 1) {   // a crown of water: a column and droplets on gravity arcs
    if (age < 0 || age > 1.1) return;
    boilSeed('splash');
    const colH = 220 * s * Math.sin(Math.PI * clamp(age / .55));
    if (colH > 5) paint(ribbon([[x, y], [x + 4, y - colH * .6], [x - 3, y - colH]], 70 * s, 26 * s), { wash: '#D9F0EC', fill: C.river, fillOp: 60, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (hash(i * 4.1) - .5) * 2.4, v = (500 + 500 * hash(i * 2.2)) * s, tt = age;
      const dx = Math.cos(a) * v * tt, dy = Math.sin(a) * v * tt + 1500 * s * tt * tt;
      if (dy > 20) continue;
      const r = (10 + 12 * hash(i)) * s * (1 - age / 1.2);
      paint(ellPts(x + dx, y + dy, r, r * 1.2, 10), { wash: i % 3 ? '#E4F5F2' : C.river, ink: PAL.ink, sw: .5 });
    }
    ripples(x, y + 10, age - .05, 3, s);
  }
  function speedLines(k, dir = 1) {   // screen-space vertical smears for a whip tilt
    if (k <= .02) return;
    boilSeed('speed');
    for (let i = 0; i < 14; i++) {
      const x = W * hash(i * 3.7), l = (300 + 700 * hash(i)) * k, y = H * hash(i * 1.3);
      inkLine([[x, y], [x + jit(4), y + dir * l]], 1.5 + 3 * hash(i * 2), mixCol(PAL.paper, PAL.ink, .25), 'dry', .2);
    }
  }
  function fish(x, y, s, o = {}) {   // a little koi; o.eyes 'x' | 'happy' | 'dot'; o.rot; o.col; o.belly 0..1 rolls it belly-up
    boilSeed('fish' + (o.key || ''));
    push(); translate(x, y); rotate(o.rot || 0); if (o.flip) scale(-1, 1);
    if (o.belly) { const c = Math.cos(Math.PI * o.belly); scale(1, Math.abs(c) < .08 ? .08 * Math.sign(c || 1) : c); }
    const col = o.col || '#EE8A4E';
    paint([[-1.3 * s, 0], [-2.1 * s, -.7 * s], [-2 * s, .7 * s]], { wash: col, ink: PAL.ink, sw: .8 });
    paint(ellPts(0, 0, 1.5 * s, .8 * s, 18), { wash: col, fill: '#FFF1DE', fillOp: 70, tex: .5, ink: PAL.ink, sw: .9 });
    paint([[-.2 * s, -.7 * s], [.4 * s, -1.2 * s], [.6 * s, -.7 * s]], { wash: col, ink: PAL.ink, sw: .6 });
    const ex = .8 * s, ey = -.15 * s, e = o.eyes || 'dot';
    if (e === 'x') { inkLine([[ex - .2 * s, ey - .2 * s], [ex + .2 * s, ey + .2 * s]], 1, PAL.ink, 'ink', 0); inkLine([[ex - .2 * s, ey + .2 * s], [ex + .2 * s, ey - .2 * s]], 1, PAL.ink, 'ink', 0); }
    else if (e === 'happy') inkLine([[ex - .22 * s, ey + .08 * s], [ex, ey - .15 * s], [ex + .22 * s, ey + .08 * s]], 1, PAL.ink, 'ink', .3);
    else paint(ellPts(ex, ey, .14 * s, .18 * s, 8), { wash: PAL.ink, ink: null });
    if (o.cough) paint(ellPts(1.45 * s, .25 * s, .22 * s, .26 * s, 10), { wash: '#6A2E35', ink: PAL.ink, sw: .5 });
    pop();
  }
  // Murtis are Bappa drawn serene and still. kind: clay (the good one), pop (glossy plaster), giant (the ego one)
  function murti(x, y, u, kind, o = {}) {
    const K = {
      clay:  { col: '#BD8659', dk: '#8C5B37', lt: '#DDB08A' },
      pop:   { col: '#FF9EC7', dk: '#E0609A', lt: '#FFE6F3' },
      giant: { col: '#F79AB8', dk: '#D55A86', lt: '#FFE0EC' },
    }[kind];
    bappa(x, y, u, { ...K, eyes: 'closed', mouth: 'smile', aL: .35, aR: .35, noShadow: true, boilKey: 'murti ' + kind, ...o });
  }
  // the tower of speakers: base centre (x, y), scale s. `beat` 0..1 pumps the cones
  function speakers(x, y, s, beat = 0, rot = 0) {
    push(); translate(x, y); rotate(rot); scale(s);
    boilSeed('speakers');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
      const bx = -200 + c * 200, by = -230 * (r + 1);
      paint(rrPts(bx, by, 196, 226, 14, 2), { wash: '#3A3550', fill: '#23202F', fillOp: 90, tex: .5, ink: PAL.ink, sw: 1.4 });
      const cr = 62 * (1 + .14 * beat);
      paint(ellPts(bx + 98, by + 130, cr, cr, 22), { wash: '#6B6680', ink: PAL.ink, sw: 1.1 });
      paint(ellPts(bx + 98, by + 130, cr * .45, cr * .45, 14), { wash: '#26222F', ink: null });
      paint(ellPts(bx + 98, by + 42, 22, 22, 12), { wash: '#6B6680', ink: PAL.ink, sw: .8 });
    }
    pop();
  }
  // the right hand's hook, holding something upright whatever the arm angle
  const holdUp = (a, fn) => (u, sw) => { push(); rotate(a); fn(u, sw); pop(); };
  // a fist with the index finger pointing along the arm: "1"
  const finger = (u, sw) => paint(ribbon([[u * .5, -u * .15], [u * 1.7, -u * .2]], u * .55, u * .42), { wash: BAP.skin, ink: PAL.ink, sw: sw * .8 });

  // ---------- A: hook ----------
  function shotA(t, lt, dur) {
    const u = 58, bx = 560, by = 1790;
    const aR = kf(lt, [[2.0, -.6], [2.25, 1.5]], backOut);
    const tip = [bx + 3.1 * u + Math.cos(aR) * 5.3 * u, by - 7.6 * u - Math.sin(aR) * 5.3 * u];
    const punch = easeIn(seg(lt, 2.2, dur));
    camBegin(lerp(540, tip[0], punch), lerp(960 - 10 * lt, tip[1], punch), 1 + .025 * lt + 1.6 * punch);
    sky(-100, 1300, C.duskTop, C.duskLow);
    glow(540, 1230, 700, '#FF9A5A', .5);
    city(1300, mixCol(C.duskTop, C.duskLow, .35), 1);
    river(1290, 1620, mixCol(C.river, C.duskTop, .35), t);
    ghat(1600);
    diyas(1640, t);
    toran(90, t);
    const mood = emotions(lt, [[0, 'angry'], [2.0, 'determined']], { take: .6 });
    const cross = lt < 2.0 ? 1 : 0;
    bappa(bx, by, u, { ...mood, cross, trunkTap: pulse(t, 5), aR, aL: -.7, boilKey: 'bappa',
      armR: cross ? (uu) => modak(0, uu * .6, uu * 1.3) : finger,
      armL: cross ? null : (uu) => modak(uu * .6, uu * .5, uu * 1.3) });
    const cp = lt >= 1.5;
    mooshak(150, 1850, 26, { eyes: cp ? 'angry' : 'normal', lookX: cp ? 0 : .8, cross: cp ? 1 : 0, sq: take(lt, 1.5, .7).sq,
      emote: cp ? 'anger' : null, emoteK: seg(lt, 1.6, 1.85), emoteAge: lt - 1.6, boilKey: 'mooshak' });
    const face = toScreen(bx, by - 12 * u);
    camEnd();
    caption('Bappa ki\n3 complaints 😤', 380, lt - .25, { life: 2.2, size: 112, color: '#FFE9A8' });
    flushLetters();
    if (lt < .45) iris(face[0], face[1], lerp(0, 1500, easeOut(lt / .45)));
  }

  // ---------- B: #1 size ----------
  function shotB(t, lt, dur) {
    const u = 22, bx = 520, by = 1720;
    // open tight on tiny Bappa, pull back and tilt up the giant; whip back down; push in for the payoff; whip down into C
    let cy = kf(lt, [[.6, 1480], [2.3, 380], [2.7, 380]]), zoom = 1 + .9 * (1 - ease(seg(lt, .6, 1.7)));
    if (lt > 2.7) cy = lerp(380, 1150, backOut(seg(lt, 2.7, 3.1)));
    const pin = ease(seg(lt, 3.2, 6.4));
    cy = lerp(cy, 1470, pin); zoom += .6 * pin;
    const pin2 = ease(seg(lt, 6.1, 6.9));   // push right in on the palm-sized murti so nobody misses it
    const cx = lerp(540, 610, pin2); cy = lerp(cy, 1400, pin2); zoom += .9 * pin2;
    cy += 1300 * easeIn(seg(lt, dur - .3, dur));
    camBegin(cx, cy, zoom);
    sky(-800, 1500, '#8FC0E0', C.dayLow);
    glow(600, -130, 520, '#FFE9A8', 1);   // the sun, which the giant crown blots out
    city(1450, '#B9C6CC', 2);
    // the crane: a lattice tower on the right and a boom over the murti
    boilSeed('crane');
    paint(rectPts(930, -330, 70, 1800), { wash: C.marigold, ink: null });
    for (let k = 0; k < 18; k++) inkLine([[930, -330 + k * 100], [1000, -280 + k * 100]], 1, PAL.ink, 'inkfine', 0);
    inkLine([[930, -330], [930, 1450]], 1.4, PAL.ink, 'ink', 0); inkLine([[1000, -330], [1000, 1450]], 1.4, PAL.ink, 'ink', 0);
    paint(rectPts(380, -380, 640, 56), { wash: C.marigold, ink: PAL.ink, sw: 1.2 });
    inkLine([[560, -325], [560 + 3 * wob(t, .3), -110]], 1.4, PAL.ink, 'ink', 0);
    // the stage and the giant, gaudy murti
    boilSeed('stage');
    paint(rectPts(40, 1400, 1000, 200, 3), { wash: C.verm, fill: '#9E2E22', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.2 });
    murti(560, 1420, 78, 'giant', { tint: 'gold', tintK: .25 });
    for (let i = 0; i < 17; i++) {   // a huge marigold garland: more is more
      const a = Math.PI * (.1 + .8 * i / 16), gx = 560 + Math.cos(a) * 250, gy = 1420 - 8.4 * 78 + Math.sin(a) * 300;
      boilSeed('mala' + i); paint(ellPts(gx, gy, 38, 38, 14, 2), { wash: i % 2 ? C.marigold : C.saffron, fill: C.verm, fillOp: 60, tex: .8, ink: PAL.ink, sw: .9 });
    }
    for (let i = 0; i < 26; i++) {   // blinking LED lights all over it
      const a = i / 26 * TAU, gx = 560 + Math.cos(a) * 560 * (.8 + .2 * hash(i)), gy = 620 + Math.sin(a) * 760;
      if ((beatN(t) + i) % 3) glow(gx, gy, 70, ['#FF5E9A', '#5EE0FF', '#FFE45E'][i % 3], .9);
    }
    // the crowd, tiny
    for (let i = 0; i < 22; i++) { boilSeed('crowd' + i); paint(ellPts(60 + i * 45 + 10 * hash(i), 1610 + 15 * hash(i * 3), 14, 16, 10), { wash: ['#6D86BE', PAL.violet, C.saffron, PAL.sap][i % 4], ink: PAL.ink, sw: .5 }); }
    ghat(1640);
    const mood = emotions(lt, [[0, 'determined'], [.5, 'surprised', { lookY: -1 }], [3.15, 'nervous', { lookY: -.8, lookX: .2 }], [3.5, 'sad'], [6.05, 'proud']], { take: .8 });
    const palm = ease(seg(lt, 3.45, 3.6)) * (1 - ease(seg(lt, 5.8, 6.0)));
    const aR = lt < 5.9 ? kf(lt, [[.3, 1.5], [.7, -.6]], ease) : kf(lt, [[5.9, -.6], [6.15, 1]], backOut);
    const mini = lt > 6.0;
    bappa(bx, by, u, { ...mood, ...(mini ? { emote: null } : {}), aR, aL: lt < 3.5 ? -.6 : -.8, trunk: 'curl', trunk2: TRUNKS.palm, trunkK: palm, boilKey: 'bappa',
      armR: lt < .6 ? finger : mini ? holdUp(aR, (uu) => { murti(uu * .5, -uu * .4, uu * .4, 'clay'); emote('spark', uu * 6.2, -uu * 8.6, uu * .7, seg(lt, 6.15, 6.4), lt - 6.15); }) : null });
    mooshak(860, 1760, 16, { eyes: lt > .6 && lt < 3.2 ? 'wide' : lt > 6.1 ? 'happy' : lt > 3.5 ? 'closed' : 'normal', lookY: lt < 3.2 ? -1 : 0, mouth: lt > .6 && lt < 3.2 ? 'O' : null,
      rot: lt > 3.5 && lt < 6.0 ? .1 * Math.sin(lt * 14) : 0, boilKey: 'mooshak' });
    camEnd();
    caption('1. Murti ka SIZE 📏', 330, lt - .05, { life: 1, size: 80 });
    caption('Bada murti ka matlab\nbadi bhakti NAHI ❌', 400, lt - 3.1, { life: 1.8, size: 92, maxW: 920 });   // two separate beats so each one lands
    caption('Yeh toh bas\nEGO hai 🙄', 400, lt - 4.9, { life: 1.4, size: 110, color: '#FFE9A8', maxW: 900 });
    caption('Mujhe toh bas\nitna chahiye 🤏', 400, lt - 6.5, { life: 1.4, size: 86, color: '#FFE9A8' });
    flushLetters();
    speedLines(Math.sin(Math.PI * seg(lt, 2.7, 3.05)), -1);
    speedLines(seg(lt, dur - .3, dur), -1);
  }

  // ---------- C: #3 material ----------
  function shotC(t, lt, dur) {
    const u = 22, bx = 360, by = 1780, S = [640, 1130], M = [590, 1470];
    camBegin(540, 1170, 1.22);
    sky(-1400, 800, C.dayTop, C.dayLow);
    city(760, '#B7C3C5', 3);
    river(750, 1560, C.river, t);
    // the waste spreading chalky grey through the water, then clearing from where the clay murti went in
    const grey = ease(seg(lt, 1.1, 2.6)), clear = ease(seg(lt, 6.25, 7));
    if (grey > .01) {
      boilSeed('chalk');
      paint(ellPts(S[0], S[1] + 60, 900 * grey, 380 * grey, 30, 8), { wash: '#B9B5AC', washOp: 225 * (1 - clear), fill: '#E3DFD6', fillOp: 200 * (1 - clear), bleed: .2, tex: .8, border: .7, ink: null });
      for (let i = 0; i < 14; i++) { const fx = S[0] + (hash(i) - .5) * 1000 * grey, fy = S[1] + (hash(i * 3) - .4) * 500 * grey; paint(ellPts(fx, fy, 9, 5, 8), { wash: PAL.cream, washOp: 200 * (1 - clear), ink: null }); }
    }
    if (clear > 0 && clear < 1) { boilSeed('clearing'); paint(ellPts(M[0], M[1] - 20, 1100 * clear, 420 * clear, 30, 6), { fill: '#5FB3C9', fillOp: 90 * (1 - clear), bleed: .2, tex: .5, ink: null }); }
    ghat(1560);
    // the glossy idol drops in from above and splashes on the beat
    if (lt > .3 && lt < 1) murti(lerp(700, S[0], seg(lt, .3, 1)), lerp(-200, S[1], easeIn(seg(lt, .3, 1))), 7, 'pop', { rot: .9 * seg(lt, .3, 1) });
    splash(S[0], S[1], lt - 1, 1);
    // the fish: the big one surfaces coughing and rolls belly-up; two more float up dead. All flip back to life when the water clears
    const FISH = [[720, 1290, 60, 1.8, 2.9], [330, 1220, 42, 3.0, 3.0], [900, 1440, 46, 3.25, 3.25]];
    FISH.forEach(([fx, fyy, fs, t0, tDie], i) => {
      if (lt < t0) return;
      const up = easeOut(seg(lt, t0, t0 + .35)), alive = lt > 6.6, jmp = seg(lt, 6.7 + i * .12, 7.2 + i * .12);
      const belly = alive ? 1 - ease(seg(lt, 6.6, 6.75)) : ease(seg(lt, tDie, tDie + .35));
      const hop = jmp > 0 && jmp < 1 ? 260 * 4 * jmp * (1 - jmp) * (i ? .6 : 1) : 0;
      const fy = fyy + 70 * (1 - up) + (belly > .5 ? 4 : 8) * wob(t, belly > .5 ? .4 : 1.1, i) - hop;
      const dead = belly > .5 && !alive;
      fish(fx, fy, fs, { key: i, eyes: alive ? 'happy' : 'x', cough: !dead && !alive && i === 0 && pulse(t, 4) > .4, belly,
        rot: jmp > 0 && jmp < 1 ? -jmp * TAU : .08 * wob(t, .5, i), flip: i !== 1, col: mixCol('#EE8A4E', '#9A958C', dead ? .65 : .35 * grey * (1 - clear)) });
      if (i === 0 && !dead && !alive) for (let k = 0; k < 3; k++) { const a = frac(t * .9 + k / 3); boilSeed('bub' + k); paint(ellPts(fx - 60 - 10 * k, fyy - 40 - a * 180, 9 + 5 * a, 9 + 5 * a, 10), { wash: PAL.cream, washOp: 200 * (1 - a), ink: PAL.ink, sw: .4 }); }
    });
    // Bappa: looks, recoils, kneels crying, then puts his little clay murti in the river
    const mood = emotions(lt, [[0, 'neutral', { lookY: -.9, lookX: .6 }], [1.05, 'surprised', { lookX: .7 }], [1.55, 'disgusted'], [3.0, 'cry', { lookX: .8, lookY: .6 }], [4.2, 'sad', { lookX: .8, lookY: .6 }], [5.5, 'determined'], [6.3, 'relieved'], [6.75, 'happy']], { take: .7 });
    const kneel = ease(seg(lt, 3.0, 3.3)) * (1 - ease(seg(lt, 5.4, 5.7)));
    const aR = kf(lt, [[5.4, -.6], [5.7, .15]], backOut), dropK = seg(lt, 6.0, 6.3);
    const hand = [bx + 3.1 * u + Math.cos(aR) * 4.2 * u, by - 7.6 * u - Math.sin(aR) * 4.2 * u];
    bappa(bx, by, u, { ...mood, sq: (mood.sq || 0) + .14 * kneel, dy: (mood.dy || 0), ...(lt > 5.45 && lt < 6.0 ? { aR } : {}), boilKey: 'bappa',
      armR: lt > 5.45 && lt < 6.0 ? holdUp(aR, (uu) => murti(uu * .5, -uu * .4, uu * .2, 'clay')) : null });
    if (dropK > 0 && dropK < 1) { const p = arcPt(hand, M, 90, dropK); murti(p[0], p[1], u * .2, 'clay', { rot: dropK * 1.2 }); }
    if (lt > 6.3) {   // it melts: a soft brown swirl
      const a = seg(lt, 6.3, 7.1); boilSeed('swirl');
      if (a < 1) { const P = []; for (let k = 0; k <= 16; k++) { const r = 8 + k * 7 * (1 + a), an = k * .7 + a * 5; P.push([M[0] + Math.cos(an) * r, M[1] - 20 + Math.sin(an) * r * .35]); } inkLine(P, 2 * (1 - a) + .3, '#8C5B37', 'dry', .6); }
      ripples(M[0], M[1] - 15, lt - 6.3, 2, .6);
    }
    // the sprout on the bank
    const sp = backOut(seg(lt, 6.7, 7.1));
    if (sp > 0) {
      boilSeed('sprout'); const sx = 850, sy = 1600, h = 110 * sp;
      inkLine([[sx, sy], [sx + 6, sy - h * .5], [sx, sy - h]], 3, C.leaf, 'ink', .5);
      paint(ellPts(sx - 26 * sp, sy - h, 30 * sp, 14 * sp, 12, 0, .5), { wash: '#7DBA5A', ink: PAL.ink, sw: .7 });
      paint(ellPts(sx + 26 * sp, sy - h - 10, 30 * sp, 14 * sp, 12, 0, -.5), { wash: '#7DBA5A', ink: PAL.ink, sw: .7 });
    }
    const nose = lt > 2.3 && lt < 6.3;
    mooshak(215, 1830, 17, { eyes: nose ? 'squeeze' : lt > 6.5 ? 'happy' : 'normal', nose: nose ? 1 : 0, lookX: .8, emote: nose ? 'sweat' : null, emoteK: seg(lt, 2.4, 2.6), boilKey: 'mooshak', ...(lt > 6.8 ? jump(lt, 6.8, 7.2, 1.2) : {}) });
    camEnd();
    caption('3. Murti ka MATERIAL 🧪', 330, lt - 1.05, { life: 1.5, size: 78, maxW: 900 });
    caption('Main ghar gaya…\nkachra nadi mein\nreh gaya 🐟', 430, lt - 3.4, { life: 2.6, size: 80, maxW: 900 });
    flushLetters();
    if (lt < .3) brushWipe(.5 + lt / .6, [C.river, '#BFE3DF']);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [C.goldTop, C.goldLow]);
  }

  // ---------- D: #2 loudspeakers ----------
  function shotD(t, lt, dur) {
    const u = 21, SP = [740, 1640], R = [620, 1150];
    const arrive = 1 - easeOut(seg(lt, 0, .35));   // lands from B's whip down
    camBegin(540 + 6 * wob(t, .25), 1170 - 1300 * arrive, 1.22);
    sky(-1400, 800, C.dayTop, C.dayLow);
    city(760, '#B7C3C5', 3);
    river(750, 1560, C.river, t);
    const bassOn = lt < 3.5, drop = lt >= 3.5;
    // bass rings from the speakers, one per beat
    if (bassOn) for (let k = 0; k < 2; k++) {
      const a = frac(bpOf(t)) * BEAT + k * BEAT, r = 120 + a * 1500; if (r > 1200) continue;
      boilSeed('bass' + k);
      const pts = ellPts(SP[0], 1250, r, r, 40); pts.push(pts[0]);
      inkLine(pts, 9 * (1 - r / 1200) + 1, mixCol(PAL.violet, PAL.ink, .2), 'ink', .4);
      inkLine(ellPts(SP[0], 1250, r - 18, r - 18, 40).concat([ellPts(SP[0], 1250, r - 18, r - 18, 40)[0]]), 3 * (1 - r / 1200) + .4, PAL.cream, 'inkfine', .4);
    }
    ghat(1560);
    // the cart
    boilSeed('cart');
    paint(rectPts(520, 1590, 440, 90, 2), { wash: C.saffron, fill: C.verm, fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.2 });
    for (const wx of [590, 890]) paint(ellPts(wx, 1700, 50, 50, 16), { wash: '#4B4458', ink: PAL.ink, sw: 1.2 });
    // lift and throw: the tower goes from the cart, over Bappa's head, into the river
    const lift = ease(seg(lt, 4.4, 4.9)), thr = seg(lt, 5.1, 5.5);
    const bxx = lerp(300, 520, easeOut(seg(lt, 4.0, 4.35)));
    const hop = jump(lt, 4.0, 4.35, 1.5);
    const head = [bxx, 1740 - 20 * u];
    let st = { x: lerp(SP[0], head[0], lift), y: lerp(1590, head[1] + 40, lift), s: lerp(1, .62, lift), rot: lift * .06 * Math.sin(t * 30) * seg(lt, 4.8, 5.1) };
    if (thr > 0) { const p = arcPt([head[0], head[1] + 40], [R[0], R[1] + 40], 380, easeIn(thr * .7 + .3 * thr * thr)); st = { x: p[0], y: p[1], s: lerp(.62, .22, thr), rot: -2 * thr }; }
    const behind = thr >= .5;   // far away in the air, the tower is behind Bappa
    const bassHit = bassOn ? pulse(t - .12, 5) : 0;
    if (lt < 5.5 && behind) speakers(st.x, st.y, st.s, bassHit, st.rot);
    splash(R[0], R[1], lt - 5.5, 1.8);
    const mood = emotions(lt, [[0, 'surprised'], [.6, 'angry'], [1.85, 'furious'], [3.5, 'idea'], [3.95, 'smug'], [4.35, 'determined'], [5.2, 'excited'], [5.8, 'relieved']], { take: .8 });
    const trumpet = ease(seg(lt, 1.85, 2.05)) * (1 - ease(seg(lt, 3.4, 3.55)));
    const armsUp = lift > 0 && lt < 5.3 ? 1.5 : null;
    const dust = lt > 5.8 ? .25 * Math.sin(t * TAU * 4) : 0;
    bappa(bxx, 1740, u, { ...mood, dy: (mood.dy || 0) + hop.dy, sq: (mood.sq || 0) + hop.sq + (lt > 4.8 && lt < 5.1 ? .15 : 0),
      ear: .25 + 1.1 * bassHit, dx: -.35 * bassHit, crownTilt: -.3 * bassHit, rot: (mood.rot || 0) - .06 * bassHit,
      trunk: 'curl', trunk2: TRUNKS.up, trunkK: trumpet, boilKey: 'bappa',
      ...(armsUp ? { aL: armsUp, aR: armsUp } : {}), ...(lt > 5.8 ? { aL: -.2 + dust, aR: -.2 - dust } : {}),
      ...(lt > 3.95 && lt < 4.35 ? { lookX: 0, lookY: 0 } : {}) });
    if (lt < 5.5 && !behind) speakers(st.x, st.y, st.s, bassHit, st.rot);
    const blown = ease(seg(lt, .9, 1.1)) * (1 - ease(seg(lt, 5.9, 6.2)));
    mooshak(215 - 30 * blown, 1820, 16, { flat: blown, eyes: blown > .5 ? 'x' : lt > 5.9 ? 'happy' : 'wide', tail: t * 4, boilKey: 'mooshak',
      emote: lt > 6.1 ? 'sweat' : null, emoteK: seg(lt, 6.1, 6.3), sq: take(lt, 6.0, .8).sq });
    camEnd();
    caption('2. Visarjan ka DJ 🔊', 330, lt - .45, { life: 1.3, size: 80 });
    caption('Itne bade kaan hai mere… 👂\ndheere bajao!!', 400, lt - 1.85, { life: 1.65, size: 76, maxW: 900 });
    caption('Is baar visarjan…\nMAIN karunga 🌊', 420, lt - 5.7, { life: 1.6, size: 100, color: '#FFE9A8', maxW: 900 });
    flushLetters();
    speedLines(arrive, -1);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [C.river, '#BFE3DF']);
  }

  // ---------- E: outro (rhymes with A) ----------
  function shotE(t, lt, dur) {
    const u = 58, bx = 560, by = 1790;
    camBegin(540, 960 - 6 * lt, 1.05 - .012 * lt);
    sky(-100, 1300, C.goldTop, C.goldLow);
    glow(540, 1230, 700, '#FFD27A', .6);
    city(1300, mixCol(C.goldTop, '#C9A58A', .5), 1);
    river(1290, 1620, '#4FA3C7', t);
    ghat(1600);
    diyas(1640, t);
    toran(90, t);
    const mood = emotions(lt, [[0, 'happy'], [.95, 'love'], [2.3, 'happy'], [4.4, 'playful']], { take: .6 });
    const toMouth = seg(lt, .55, .9), bite = seg(lt, .95, 1.2);
    const hand = [bx + 3.1 * u + Math.cos(.5) * 4.2 * u, by - 7.6 * u - Math.sin(.5) * 4.2 * u], mouthP = [bx - 1.35 * u, by - 8.7 * u];
    bappa(bx, by, u, { ...mood, aL: .5 + .1 * Math.sin(t * 3), aR: .5, mouth: lt > .85 && lt < 1.3 ? 'O' : mood.mouth, boilKey: 'bappa',
      armR: lt < .55 ? (uu) => modak(uu * .6, uu * .5, uu * 1.3) : null });
    if (lt >= .55 && bite < .95) { const p = arcPt(hand, mouthP, 120, ease(toMouth)); modak(p[0], p[1] + u * .5, u * 1.3 * (1 - bite)); }
    const cr = seg(lt, 1.15, 1.6);   // the crumb flies to Mooshak
    if (cr > 0 && cr < 1) { const p = arcPt(mouthP, [170, 1690], 200, cr); boilSeed('crumb'); paint(ellPts(p[0], p[1], 12, 10, 8), { wash: '#F7E6C4', ink: PAL.ink, sw: .6 }); }
    const mj = lt > 2.5 ? jump(lt, 2.5 + BEAT * Math.floor((lt - 2.5) / BEAT), 2.5 + BEAT * Math.floor((lt - 2.5) / BEAT) + .35, .8) : lt > 1.6 ? jump(lt, 1.6, 1.95, 1.5) : {};   // bops on every beat
    mooshak(150, 1850, 21, { eyes: lt > 1.6 ? 'happy' : 'look', lookX: .8, lookY: -.6, mouth: lt > 1.6 ? 'smile' : 'o', ...mj,
      aL: lt > 1.55 ? 1.2 : -.7, aR: lt > 1.55 ? 1.2 : -.7, boilKey: 'mooshak', emote: lt > 1.65 ? 'heart' : null, emoteK: seg(lt, 1.65, 1.9) });
    petals(t);
    const face = toScreen(bx, by - 12 * u);
    camEnd();
    caption('Ganpati Bappa Morya 🙏', 360, lt - 1.2, { life: 4.9, size: 92, color: '#FFE9A8', maxW: 900 });
    caption('Loud speaker wale dost\nko tag karo 😂', 520, lt - 2.0, { life: 4.1, size: 66 });
    flushLetters();
    if (lt < .3) brushWipe(.5 + lt / .6, [C.goldTop, C.goldLow]);
    if (lt > dur - .6) iris(face[0], face[1], lerp(1500, 0, easeIn(seg(lt, dur - .6, dur - .15))));
  }

  shots([[0, shotA], [2.5, shotB], [10.7, shotD], [18.2, shotC], [26.2, shotE]]);   // size → DJ → material → outro
})();
