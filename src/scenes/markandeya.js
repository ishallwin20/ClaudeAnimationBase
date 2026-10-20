// markandeya.js: "The day YAMRAJ DIED." (ad/25-books123-markandeya), in the Cinematic style (src/cine.js), no voice.
// The Markandeya story as Thirukkadaiyur tells it (the Amritaghateswarar temple's sthala purana, Shiva as Kalasamhara)
// and the Puranic retelling: the sage Mrikandu begs Shiva for a son and is offered a dull son with a long life or a
// wise son who dies at sixteen; he chooses the wise one, Markandeya. On the day he is to die the boy is worshipping
// the linga; Yama's messengers cannot touch him; Yama comes himself, on his buffalo, and throws his noose; it falls
// round the boy and the linga. Shiva bursts out in fury and kicks Yama dead. Nobody can die; the Earth cannot bear
// the weight; Vishnu and the gods beg Shiva, who brings Yama back, and Markandeya stays sixteen forever.
// Times are in TL, laid on the Lyria score (assets/markandeya_score.mp3, take 2): its sections at 5.75, 16.0, 21.25,
// the hit at 26.75 (Death arrives), the fall-off at 32.5 into the hush 34.0–36.6, the drop at 37.1, the hit at 42.75,
// the fade from 60. tools/markandeya_sfx.mjs uses the same TL.
const TL = { hook: 0, nobody: 2.9, boon: 5.75, ask: 8.3, wise: 10.9, chose: 13.5, mark: 16.0, day: 18.6, duta: 21.25,
  flare: 24.1, yama: 26.75, hug: 29.6, throw: 32.5, loop: 34.0, crack: 35.9, drop: 37.1, fury: 39.9, kick: 42.75,
  dead: 45.4, earth: 48.0, gods: 50.6, revive: 53.2, forever: 55.8, ask2: 58.6, card: 61.6, end: 66.5 };
const shake = (t, t0, k = 14, d = 5) => { const u = t - t0; if (u < 0 || u > 1.4) return [0, 0]; const e = Math.exp(-u * d) * k; return [Math.sin(t * 53) * e, Math.cos(t * 41) * e]; };
const pulse = (t, t0, d = 4) => t < t0 ? 0 : Math.exp(-(t - t0) * d);
// a head close-up: translate to where the face goes, scale, back to the rig's head
const atFace = (f, x, y, k, r = 0) => { f.translate(x, y); if (r) f.rotate(r); f.scale(k, k); f.translate(0, 815); };
const sparks = (c, t, seed, n = 50, vy = -60, col = '#FFA060') => motes(c, { n, seed, box: [-100, 200, W + 100, 1950], r: 3, col, a: .55, vx: 10, vy, t });
const floor = (c, y, col) => fillPath(c, `M -200 ${y} L 1280 ${y} L 1280 2200 L -200 2200 Z`, col);

// ---------- 1. the hook: Yama's face in red, his eyes burning (frame 0 is finished) ----------
SHOTS.push({ a: TL.hook, b: TL.boon + .3, draw(c, u, t) {
  const wide = ease(seg(t, 5.05, 5.3)), cam = { z: lerp(1, 1.09, easeIO(u / 6)), fx: 540, fy: 720 };
  plane(c, cam, 0, (c) => { SKY.blood(c); glow(c, 540, 760, 760, '#FF3A1A', .3); });
  plane(c, cam, .4, (c) => sparks(c, t, 3));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { atFace(f, 540, 700, 4.7); yamaC(f, { t, eyes: lerp(.78, 1.08, wide), fierce: 1 - wide * .7, mouth: wide * .4, wind: .2 }); },
      { ...FX.red, grade: [[1050, 'rgba(0,0,0,0)'], [1330, 'rgba(8,2,4,.92)']] });
    c.save(); atFace(c, 540, 700, 4.7); yamaEyeGlow(c, (.75 + .25 * Math.sin(t * 2.4)) * (1 - wide * .5), { r: .55 }); c.restore();
  });
} });
say(-.35, TL.nobody, 'The day | *YAMRAJ* | DIED.', { y: 1380, size: 76, at: Array(4).fill(-.35) });
say(TL.nobody, TL.boon, 'And NOBODY on Earth | could die.', { y: 1410 });

// ---------- 2. the boon: a sage and his wife pray at a forest linga; Shiva's light appears ----------
SHOTS.push({ a: TL.boon, b: TL.ask + .4, xf: .25, draw(c, u, t) {
  const sh = ease(seg(t, TL.boon + 1.0, TL.boon + 2.2)), cam = { z: lerp(1, 1.08, easeIO(u / 3)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => { SKY.night(c); stars(c, 70, 4, t, .6); glow(c, 540, 1100, 700, '#7F97CC', .18 + .25 * sh); });
  plane(c, cam, .3, (c) => { ridge(c, 1330, 70, 5, '#0C0E1C'); haze(c, 1330, 160, '#3A4468', .3); });
  plane(c, cam, .6, (c) => { forestTree(c, 90, 1560, .9, { t, col: '#08080E' }); forestTree(c, 1010, 1560, .8, { t, col: '#08080E' }); });
  plane(c, cam, 1, (c) => {
    floor(c, 1570, '#07070C');
    if (sh > 0) figure(c, (f) => { f.translate(470, 1520); f.scale(1.0, 1.0); shiva(f, { t, eyes: 1, arm: 'abhaya', wind: .2 }); },
      { tint: ['#C9D8FF', .5], edge: { col: '#FFFFFF', w: 3, a: .9 }, rim: { col: '#FFFFFF', dx: 0, dy: -5, a: .8, blur: 2 }, alpha: .85 * sh, op: 'screen' });
    linga(c, 470, 1580, 1.15, { glow: .5 + .5 * sh, lit: '#FFC070' });
    deepa(c, 300, 1580, .7, t, 1, 1); deepa(c, 650, 1580, .7, t, 1, 2);
    figure(c, (f) => { f.translate(830, 1600); f.scale(.78, .78); rishi(f, { t, pose: 'sit' }); }, FX.sil(.9, '#FFC070'));
    figure(c, (f) => { f.translate(1000, 1605); f.scale(.7, .7); devotee(f, { t, pose: 'pray' }); }, FX.sil(.9, '#FFC070'));
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 8, box: [-100, 600, W + 100, 1800], r: 2.5, col: '#CFE0FF', a: .5, vx: 4, vy: -12, t }));
} });
say(TL.boon + .1, TL.ask, 'A sage begged *Shiva* | for a son.', { y: 540 });

// ---------- 3. the choice: two lamps in the dark, a dim one that burns long, a bright one that burns out ----------
SHOTS.push({ a: TL.ask, b: TL.mark + .3, xf: .3, draw(c, u, t) {
  const a1 = ease(seg(t, TL.ask + .1, TL.ask + .9)), a2 = ease(seg(t, TL.wise + .1, TL.wise + .7)), pick = seg(t, TL.chose, TL.chose + .8), out = ease(seg(t, TL.chose + .2, TL.chose + .7));
  const cam = { z: lerp(1, 1.06, easeIO(seg(t, TL.ask, TL.chose))) + .16 * easeIO(seg(t, TL.chose, TL.mark)), fx: lerp(540, 760, easeIO(seg(t, TL.chose, TL.mark))), fy: 1240 };
  plane(c, cam, 0, (c) => { SKY.void(c); glow(c, 760, 1180, 600, '#FF9A3A', .2 * a2 + .25 * ease(pick)); });
  plane(c, cam, 1, (c) => {
    floor(c, 1380, '#0A0608'); fillPath(c, 'M -200 1380 C 300 1360 800 1370 1280 1390 L 1280 1400 L -200 1400 Z', rgba('#FFB070', .08 + .08 * a2));
    // the dim lamp: a small, steady, sullen flame; it goes out when they choose
    if (a1 > 0) deepa(c, 320, 1380, .9, t * .4, a1 * .42 * (1 - out), 3);
    if (out > 0 && out < 1) for (let i = 0; i < 5; i++) { const k = seg(t, TL.chose + .3 + i * .1, TL.chose + 2.4); if (k > 0 && k < 1) ellipse(c, 320 + Math.sin(k * 6 + i) * 18, 1290 - k * 380, 14 + k * 40, 10 + k * 30, rgba('#8A8090', .22 * (1 - k))); }
    if (a1 > 0) { c.save(); c.globalAlpha = a1; c.translate(320, 1380); c.scale(.9, .9); fillPath(c, 'M -26 0 L 26 0 L 14 -10 L 6 -50 L -6 -50 L -14 -10 Z', '#5A3A1A'); fillPath(c, 'M -40 -50 C -30 -66 30 -66 40 -50 C 30 -44 -30 -44 -40 -50 Z', '#7A5A2A'); c.restore(); }
    // the bright lamp: a big flame, blazing; it flares when they choose it
    if (a2 > 0) deepa(c, 760, 1380, 1.55 + .25 * ease(pick), t, a2 * (1.1 + .5 * pulse(t, TL.chose, 1.5)), 4);
  });
  plane(c, cam, 1.2, (c) => a2 > 0 && motes(c, { n: 30, seed: 9, box: [560, 700, 960, 1360], r: 2.5, col: '#FFD08A', a: .6 * a2, vx: 0, vy: -60, t }));
} });
say(TL.ask + .05, TL.wise, '*Shiva* asked: "A dull son | who lives LONG…', { y: 600 });
say(TL.wise, TL.chose, '…or a WISE son | who dies at *16*?"', { y: 600 });
say(TL.chose, TL.mark, 'They chose | the WISE son.', { y: 600, size: 64 });

// ---------- 4. Markandeya at prayer: his face in the lamplight, Om Namah Shivaya rising ----------
SHOTS.push({ a: TL.mark, b: TL.duta + .3, xf: .3, draw(c, u, t) {
  const gust = ease(seg(t, 20.1, 20.6)) * (1 - ease(seg(t, 20.9, 21.25))), cam = { z: lerp(1, 1.1, easeIO(u / 5.4)), fx: 540, fy: 960 };
  plane(c, cam, 0, (c) => { SKY.void(c); glow(c, 540, 1000, 700, '#FF8A2A', .3 * (1 - gust * .6)); glow(c, 540, 1000, 600, '#5A6AA0', .25 * gust); });
  plane(c, cam, .5, (c) => stotram(c, ['ॐ नमः शिवाय', 'ॐ नमः शिवाय', 'ॐ नमः शिवाय'], 540, 470, t, TL.mark + .4, { size: 46, gap: 1.6, rise: 26, fade: 2.4 }));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { atFace(f, 540, 1000, 4); markHead(f, { t, eyes: 0, pain: .12 + .6 * gust }); markBust(f, { t }); },
      { ...FX.lamp, tint: [gust > .1 ? '#141A30' : '#2A1206', .2 + .1 * gust], grade: [[1280, 'rgba(0,0,0,0)'], [1560, 'rgba(6,3,4,.88)']] });
    for (const [x, s] of [[170, 1], [910, 2]]) deepa(c, x, 1900, 1.4, t + gust * 3 * Math.sin(t * 30), 1 - gust * .7, s);
  });
} });
say(TL.mark + .1, TL.day, 'His name: | *MARKANDEYA*.', { y: 1420, size: 66 });
say(TL.day, TL.duta, 'The day he was to die, | he was praying to *Shiva*.', { y: 1420 });

// ---------- 5. the Yamadutas close in on the sanctum; the linga flares and they reel back ----------
SHOTS.push({ a: TL.duta, b: TL.yama + .2, xf: .3, draw(c, u, t) {
  const fl = ease(seg(t, TL.flare, TL.flare + .25)), back = easeOut(seg(t, TL.flare, TL.flare + 1.4)), come = easeIO(seg(t, TL.duta, TL.flare));
  const [sx, sy] = shake(t, TL.flare, 10), cam = { z: lerp(1, 1.08, u / 5.5), fx: 540, fy: 1100, x: sx, y: sy };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#04030A'], [1200, '#140A12'], [1920, '#0A0508']]); glow(c, 540, 1200, 700, '#FFB050', .2 + .5 * fl * (1 - back * .5)); });
  plane(c, cam, 1, (c) => {
    floor(c, 1650, '#0C0708');
    sanctum(c, 540, 1650, 2, t, { open: .35 + .65 * fl });
    figure(c, (f) => { f.translate(540, 1650 - 8); f.scale(.62, .62); markHug(f, { t, linga: false, eyes: 0 }); }, { ...FX.lamp, tint: ['#1A0806', .5] });
    if (fl > 0) rays(c, 540, 1420, { n: 16, dir: -Math.PI / 2, spread: 3.4, len: 900, w: 160, col: '#FFD890', a: .5 * fl * (1 - back * .6), t, seed: 3 });
    const a = 1 - ease(seg(t, TL.flare + .7, TL.flare + 1.6));
    duta(c, lerp(-60, 170, come) - 140 * back, 1700, .5, { t, a, lean: -.25 * back });
    duta(c, lerp(1140, 910, come) + 140 * back, 1700, .5, { t, a, lean: .25 * back, flip: true });
  });
  plane(c, cam, 1.2, (c) => sparks(c, t, 11, 30, -40, '#FFC070'));
} });
say(TL.duta + .1, TL.flare - .1, '*Yama*\'s messengers | came for him…', { y: 520 });
say(TL.flare - .1, TL.yama, '…but they could not | even TOUCH him.', { y: 520 });

// ---------- 6. Death rides in: Yama on his buffalo under a blood moon ----------
SHOTS.push({ a: TL.yama, b: TL.hug + .3, xf: .15, draw(c, u, t) {
  const fl = strikes(t, [TL.yama, TL.yama + 1.6]), cam = { z: lerp(1, 1.12, easeIO(u / 3)), fx: 480, fy: 1250 };
  plane(c, cam, 0, (c) => { SKY.blood(c); flash(c, fl * .25, '#FF8A6A'); bolt(c, 860, -40, 760, 700, 9, strikes(t, [TL.yama + 1.6])); });
  plane(c, cam, .15, (c) => { glow(c, 560, 1060, 700, '#FF3A1A', .45); ellipse(c, 560, 1060, 330, 330, '#C8301E'); ellipse(c, 560, 1060, 330, 330, rgba('#FF8A5A', .25)); });
  plane(c, cam, .3, (c) => { clouds(c, [[-300 + u * 60, 1220, 900, 21, 20], [400 - u * 40, 820, 800, 23, 30, true]], t, PALETTES.nightFar, .55); gopuram(c, 980, 1450, .32, { col: '#12040A' }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1460 C 200 1420 600 1440 1280 1480 L 1280 2200 L -200 2200 Z', '#0C0306');
    figure(c, (f) => { f.translate(lerp(200, 380, u / 3), 1460); f.scale(.66, .66); yamaRider(f, { t, walk: u * .55, eye: 1, gadaA: .12 }); }, { ...FX.sil(.9), rim: { ...FX.sil().rim, a: .9 + fl } });
  });
  plane(c, cam, 1.25, (c) => sparks(c, t, 13, 40, -30, '#FF7A50'));
} });
say(TL.yama + .1, TL.hug, 'So *YAMRAJ* came | HIMSELF.', { y: 520, size: 70 });

// ---------- 7. the boy clings to the linga; Yama's shadow with the noose grows on the wall ----------
SHOTS.push({ a: TL.hug, b: TL.throw + .25, xf: .25, draw(c, u, t) {
  const sh = easeIO(u / 3), cam = { z: lerp(1, 1.08, sh), fx: 540, fy: 1100 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#1A0A08'], [1000, '#4A2414'], [1920, '#120806']]); glow(c, 900, 1300, 700, '#FF9A3A', .35); glow(c, 120, 900, 700, '#FF2A1A', .15 + .2 * sh); });
  plane(c, cam, .6, (c) => { c.save(); c.globalAlpha = .8 * sh; c.translate(lerp(-120, 80, sh), 1700); c.scale(1.3, 1.3); const P = {}; for (const k in YAMA_C) P[k] = '#050203'; yamaC(c, { t, pal: P }); c.restore(); });
  plane(c, cam, 1, (c) => {
    floor(c, 1720, '#0A0506');
    figure(c, (f) => { f.translate(600, 1720); f.scale(1.7, 1.7); markHug(f, { t: t * 3, eyes: 0, pain: 1 }); }, { ...FX.lamp, tint: ['#2A0806', .18 + .1 * sh] });
    deepa(c, 960, 1730, .9, t, 1, 5);
  });
} });
say(TL.hug + .05, TL.throw, 'The boy hugged | the *Shiva* *linga*.', { y: 520 });

// ---------- 8. Yama throws the noose ----------
SHOTS.push({ a: TL.throw, b: TL.loop + .2, xf: .12, draw(c, u, t) {
  const k = easeOut(seg(t, TL.throw + .3, TL.loop)), cam = { z: lerp(1.04, 1.12, u / 1.7), fx: 400, fy: 900 };
  plane(c, cam, 0, (c) => { SKY.blood(c); glow(c, 540, 800, 700, '#FF3A1A', .35); });
  plane(c, cam, .4, (c) => sparks(c, t, 15, 40, -50));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { atFace(f, 540, 660, 1.5); yamaC(f, { t, eyes: 1.0, noose: lerp(1, .2, k), mouth: .3 }); }, { ...FX.red, grade: [[1250, 'rgba(0,0,0,0)'], [1520, 'rgba(8,2,4,.92)']] });
    c.save(); atFace(c, 540, 660, 1.5); yamaEyeGlow(c, 1, { r: .7 }); c.restore();
    yamaRope(c, [[219, 900], [430, 1010], [760, 1000], [1000, 940], [1260, 880]], k, { w: 7, loop: false });
  });
} });
say(TL.throw + .1, TL.crack, 'His NOOSE caught | the boy… | AND the *linga*.', { y: 1430 });

// ---------- 9. the loop falls round the boy and the linga; silence; the stone cracks with light ----------
SHOTS.push({ a: TL.loop, b: TL.drop + .05, xf: .15, draw(c, u, t) {
  const tf = Math.min(t, TL.loop + .7), lk = easeOut(seg(t, TL.loop, TL.loop + .55)), cr = ease(seg(t, TL.crack, TL.drop)), wht = easeIn(seg(t, TL.drop - .4, TL.drop));
  const [sx, sy] = shake(t, TL.loop + .5, 6), cam = { z: lerp(1, 1.06, easeIO(u / 3)) + .1 * easeIn(seg(t, TL.crack, TL.drop)), fx: 520, fy: 1080, x: sx + Math.sin(t * 61) * 4 * cr, y: sy };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0406'], [1100, '#24100C'], [1920, '#0A0406']]); glow(c, 900, 1300, 700, '#FF9A3A', .3); });
  plane(c, cam, 1, (c) => {
    floor(c, 1360, '#0A0506');
    figure(c, (f) => { f.translate(580, 1360); f.scale(1.25, 1.25); markHug(f, { t: tf * 3, eyes: 0, pain: 1 }); }, { ...FX.lamp, tint: ['#2A0806', .2] });
    lingaCrack(c, 580, 1360, 2.5, cr, t);
    const r = lerp(560, 300, lk), cx = 540, cy = 1360 - 330 * 1.25;
    yamaRope(c, [[-200, 300], [120, 560], [cx - r, cy - 20]], 1, { w: 8, loop: false });
    c.save(); c.translate(cx, cy); c.rotate(-.12);
    for (const [w, col] of [[14, YAMA_C.ropeDk], [8, YAMA_C.rope]]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.ellipse(0, 0, r, r * .32, 0, 0, TAU); c.stroke(); }
    c.restore();
    deepa(c, 960, 1370, .7, tf, 1 - cr * .5, 5);
  });
  POSTWHITE = wht;
} });

// ---------- 10. Shiva bursts out of the linga ----------
SHOTS.push({ a: TL.drop, b: TL.fury + .3, draw(c, u, t) {
  const up = easeOut(seg(t, TL.drop, TL.drop + .8)), [sx, sy] = shake(t, TL.drop, 22, 3), cam = { z: lerp(1.18, 1.0, easeOut(u / 2.6)), fx: 540, fy: 1300, x: sx, y: sy };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0A20'], [700, '#1E1A3A'], [1300, '#5A3A40'], [1920, '#1A0A0A']]); });
  plane(c, cam, .2, (c) => { rays(c, 540, 1600, { n: 28, dir: -Math.PI / 2, spread: 3.6, len: 1700, w: 260, col: '#FFE6B0', a: .55, t, seed: 7 }); glow(c, 540, 1600, 900, '#FFC870', .55); });
  plane(c, cam, .5, (c) => clouds(c, [[-300 + u * 80, 1700, 1000, 31, 20], [500 - u * 60, 1800, 900, 33, 30, true]], t, PALETTES.nightFar, .5));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, lerp(2240, 1910, up)); f.scale(.98, .98); shiva(f, { t, eyes: 1, third: 1, arm: 'abhaya', wind: 1 }); },
      { tint: ['#1A1030', .1], edge: { col: '#FFF2D0', w: 3.2, a: .9 }, rim: { col: '#FFFFFF', dx: 0, dy: -7, a: 1, blur: 2 } });
    c.save(); c.translate(540, lerp(2240, 1910, up)); c.scale(.98, .98); glow(c, 0, -858, 60, '#FF8A3A', .9); c.restore();
    fillPath(c, 'M -200 1760 C 200 1720 700 1740 1280 1770 L 1280 2200 L -200 2200 Z', '#07040A');
    for (let i = 0; i < 9; i++) { const k = seg(t, TL.drop, TL.drop + 1.6), x = 540 + (hash(i) - .5) * 900 * k, y = 1700 - 700 * k * (1 - k) * 2 * hash(i + 3) + 400 * k * k; if (k < 1) poly(c, [[x - 18, y], [x + 4, y - 22], [x + 20, y + 6], [x - 4, y + 16]], '#1A1014'); }
    figure(c, (f) => { f.translate(210, 1790); f.scale(.42, .42); markHug(f, { t, eyes: 0 }); }, FX.sil(.92, '#FFE2B0'));
    figure(c, (f) => { f.translate(lerp(860, 960, up), 1800); f.rotate(.18 * up); f.scale(.42, .42); yamaC(f, { t, noose: false }); }, FX.sil(.92, '#FFE2B0'));
  });
  plane(c, cam, 1.3, (c) => sparks(c, t, 17, 60, -160, '#FFE0A0'));
} });
say(TL.drop + .15, TL.fury, '*SHIVA* | burst out!', { y: 480, size: 82 });

// ---------- 11. Shiva's face, the third eye open, in fury ----------
SHOTS.push({ a: TL.fury, b: TL.kick + .1, xf: .2, draw(c, u, t) {
  const cam = { z: lerp(1, 1.14, easeIn(u / 2.85)), fx: 540, fy: 860 };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#120406'], [900, '#3A0A0A'], [1920, '#120406']]); glow(c, 540, 700, 700, '#FF6A2A', .35); });
  plane(c, cam, .4, (c) => sparks(c, t, 19, 60, -120));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { atFace(f, 540, 880, 4); shiva(f, { t, eyes: 1, third: 1, arm: 'down', wind: .8 }); },
      { tint: ['#3A0A10', .14], edge: { col: '#FF9A6A', w: 3, a: .7 }, rim: { col: '#FFC09A', dx: 9, dy: -4, a: .9, blur: 1.5 }, grade: [[1250, 'rgba(0,0,0,0)'], [1500, 'rgba(8,2,4,.9)']] });
    c.save(); atFace(c, 540, 880, 4); glow(c, 0, -858, 36, '#FF8A3A', .8 + .2 * Math.sin(t * 9)); glow(c, 0, -858, 10, '#FFF2C0', 1); c.restore();
  });
} });
say(TL.fury, TL.kick, 'FURIOUS that *Death* | dared touch his devotee.', { y: 1430 });

// ---------- 12. the kick: Shiva strikes Yama in the chest; Death flies, his crown spinning ----------
SHOTS.push({ a: TL.kick - .25, b: TL.dead + .3, xf: .1, draw(c, u, t) {
  const kk = easeOut(seg(t, TL.kick - .2, TL.kick)), fly = easeOut(seg(t, TL.kick, TL.kick + 1.2)), [sx, sy] = shake(t, TL.kick, 30, 3.5);
  const cam = { z: lerp(1.0, 1.08, easeOut(seg(t, TL.kick, TL.dead))), fx: 600, fy: 1100, x: sx, y: sy };
  plane(c, cam, 0, (c) => { sky(c, [[0, '#160504'], [620, '#5A1A0E'], [1080, '#FFE2A8'], [1500, '#C8461E'], [1920, '#2A0A08']]); glow(c, 740, 1080, 800, '#FFF0C0', .5 + .5 * pulse(t, TL.kick, 2)); });
  plane(c, cam, .3, (c) => { shockRings(c, 740, 1080, t, [TL.kick]); rays(c, 740, 1080, { n: 22, dir: 0, spread: 6.2, len: 1200, w: 200, col: '#FFF2D0', a: .45 * pulse(t, TL.kick, .8), t, seed: 5 }); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1660 C 300 1640 800 1650 1280 1670 L 1280 2200 L -200 2200 Z', '#0A0406');
    figure(c, (f) => { f.translate(lerp(720, 1180, fly), 1660 - 260 * Math.sin(fly * Math.PI) * .6 + 120 * fly); f.rotate(lerp(-.05, 1.1, fly)); f.scale(.82, .82); yamaC(f, { t, noose: false, crown: fly < .05, gada: fly < .2 }); }, FX.sil(.9, '#FFB08A'));
    figure(c, (f) => { f.translate(300, 1660); f.scale(.98, .98); shivaKick(f, { t, k: kk }); }, FX.sil(.92, '#FFE2B0'));
    if (fly > .02) yamaCrownC(c, lerp(760, 1060, fly) + 60 * fly, 820 - 520 * fly + 600 * fly * fly, .8, fly * 7);
    if (fly > .15) { c.save(); c.translate(lerp(880, 1250, fly), 1000 - 500 * fly + 900 * fly * fly); c.rotate(-fly * 9); c.scale(.8, .8); gadaC(c, 0, 0, 0, YAMA_C); c.restore(); }
  });
  plane(c, cam, 1.3, (c) => sparks(c, t, 21, 70, -200, '#FFE0A0'));
} });
say(TL.kick + .1, TL.dead, 'He KICKED | *YAMRAJ*.', { y: 520, size: 82 });

// ---------- 13. Death lies dead, his crown fallen, the noose slack ----------
SHOTS.push({ a: TL.dead, b: TL.earth + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1, 1.08, easeIO(u / 2.9)), fx: 640, fy: 1150 }, die = 1 - ease(seg(t, TL.dead + .2, TL.dead + 1.2));
  plane(c, cam, 0, (c) => { sky(c, [[0, '#0A0608'], [1000, '#241418'], [1920, '#0A0608']]); glow(c, 600, 1100, 700, '#8A3A2A', .3); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 0 L 1280 0 L 1280 2200 L -200 2200 Z', '#1A1012');
    figure(c, (f) => { atFace(f, 760, 1150, 3, -Math.PI / 2 + .06); yamaC(f, { t: 0, eyes: 0, pain: .2, crown: false, noose: false, gada: false, wind: 0 }); }, { tint: ['#20101A', .35], edge: { col: '#C08A8A', w: 2.4, a: .5 }, rim: { col: '#E0B0A0', dx: 0, dy: -5, a: .6, blur: 1 } });
    c.save(); atFace(c, 760, 1150, 3, -Math.PI / 2 + .06); yamaEyeGlow(c, die * .9, { r: .5 }); c.restore();
    yamaCrownC(c, 330, 1290, 1.4, -1.75);
    yamaRope(c, [[-60, 1560], [200, 1620], [420, 1540], [640, 1640], [900, 1580], [1140, 1640]], 1, { w: 8, loop: false });
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 30, seed: 23, box: [-100, 400, W + 100, 1900], r: 3, col: '#B0A0A8', a: .35, vx: 10, vy: -16, t }));
} });
say(TL.dead + .1, TL.earth, '*Death* himself | was DEAD.', { y: 520, size: 66 });

// ---------- 14. nobody can die: the Earth crowded to the horizon, cracking under the weight ----------
SHOTS.push({ a: TL.earth, b: TL.gods + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.12, 1.0, easeOut(u / 2.9)), fx: 540, fy: 1200 }, [sx, sy] = shake(t, TL.earth + 1.2, 6, 2);
  cam.x = sx; cam.y = sy;
  plane(c, cam, 0, (c) => { SKY.ochre(c); glow(c, 540, 1180, 800, '#E0A050', .3); });
  plane(c, cam, .4, (c) => { for (let r = 0; r < 4; r++) crowd(c, -60, 1140, 1200 + r * 40, 40 - r * 4, .16 + r * .06, t, 0, mixCol('#3A2A1E', '#1A120E', r / 4), r + 1, 1); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1300 L 1280 1300 L 1280 2200 L -200 2200 Z', '#120C0A');
    cracks(c, 540, 1500, ease(seg(t, TL.earth + .6, TL.earth + 2.2)), t, 5);
    for (let r = 0; r < 4; r++) crowd(c, -100, 1180, 1420 + r * 130, 12 - r * 2, .45 + r * .22, t, 0, '#0C0806', r + 7, 1);
  });
} });
say(TL.earth + .1, TL.gods, 'NOBODY could die. | The *Earth* groaned.', { y: 560 });

// ---------- 15. Vishnu and the gods beg Shiva ----------
SHOTS.push({ a: TL.gods, b: TL.revive + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1, 1.07, easeIO(u / 2.9)), fx: 640, fy: 1200 };
  plane(c, cam, 0, (c) => { SKY.night(c); stars(c, 60, 12, t, .5); glow(c, 720, 1180, 800, '#9FB0E8', .35); });
  plane(c, cam, .3, (c) => { kailash(c, 720, 760, 900); haze(c, 1360, 260, '#3A4468', .4); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1560 C 300 1530 800 1540 1280 1570 L 1280 2200 L -200 2200 Z', '#070812');
    figure(c, (f) => { f.translate(760, 1420); f.scale(1.15, 1.15); shivaSeated(f, { t }); }, { ...LIGHTS.moonSilhouette, rim: { ...LIGHTS.moonSilhouette.rim, a: 1 } });
    glow(c, 760, 1000, 320, '#C9D8FF', .35);
    [[150, .5, 1], [300, .46, 2], [440, .42, 3], [560, .38, 4]].forEach(([x, s, i]) => figure(c, (f) => { f.translate(x, 1640); f.scale(s, s); bhagiratha(f, { t: t + i, arms: 'namaste' }); }, LIGHTS.moonSilhouette));
    chakra(c, 150 + 120, 1640 - 1000 * .5 - 40, 48, t * 6, .9, t);   // Vishnu's Sudarshan
  });
} });
say(TL.gods + .1, TL.revive, '*Vishnu* and the gods | begged *Shiva*.', { y: 520 });

// ---------- 16. Yama wakes, in the dawn ----------
SHOTS.push({ a: TL.revive, b: TL.forever + .3, xf: .3, draw(c, u, t) {
  const op = ease(seg(t, TL.revive + .6, TL.revive + 1.6)), cam = { z: lerp(1, 1.08, easeIO(u / 2.9)), fx: 540, fy: 860 };
  plane(c, cam, 0, (c) => { SKY.dawn(c); glow(c, 760, 700, 800, '#FFC870', .35 + .2 * op); });
  plane(c, cam, .3, (c) => rays(c, 900, 200, { n: 14, dir: 2.1, spread: .9, len: 1600, w: 200, col: '#FFE6B0', a: .3 + .2 * op, t, seed: 9 }));
  plane(c, cam, 1, (c) => figure(c, (f) => { atFace(f, 540, 860, 3.6); yamaC(f, { t, eyes: op * .95, fierce: 0, pain: (1 - op) * .4, smile: op * .3 }); },
    { ...FX.dawn, grade: [[1250, 'rgba(0,0,0,0)'], [1500, 'rgba(10,4,4,.88)']] }));
  plane(c, cam, 1.2, (c) => motes(c, { n: 40, seed: 25, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFE2A0', a: .5, vx: 6, vy: -30, t }));
} });
say(TL.revive + .1, TL.forever, 'He brought *Yama* back… | on ONE condition:', { y: 1430 });

// ---------- 17. Markandeya at dawn, sixteen forever ----------
SHOTS.push({ a: TL.forever, b: TL.ask2 + .3, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1.08, 1.0, easeOut(u / 2.9)), fx: 540, fy: 1200 };
  plane(c, cam, 0, (c) => { SKY.dawn(c); ellipse(c, 820, 1150, 230, 230, '#FFE9B8'); glow(c, 820, 1150, 900, '#FFB45A', .55); });
  plane(c, cam, .25, (c) => { rays(c, 820, 1150, { n: 20, dir: Math.PI, spread: 6.2, len: 1300, w: 180, col: '#FFE6B0', a: .35, t, seed: 11 }); ridge(c, 1450, 60, 9, '#3A1A20'); });
  plane(c, cam, 1, (c) => {
    fillPath(c, 'M -200 1680 C 300 1660 800 1670 1280 1690 L 1280 2200 L -200 2200 Z', '#1E0E10');
    figure(c, (f) => { f.translate(520, 1690); f.scale(1.45, 1.45); markHug(f, { t, eyes: 1, pain: 0, smile: 1, tilt: .12, look: [.3, 0] }); }, FX.dawn);
  });
  plane(c, cam, 1.2, (c) => motes(c, { n: 50, seed: 27, box: [-100, 300, W + 100, 1900], r: 3, col: '#FFE2A0', a: .6, vx: 6, vy: -40, t }));
} });
say(TL.forever + .1, TL.ask2, '*Markandeya* | stays 16 FOREVER.', { y: 540, size: 64 });

// ---------- 18. the ask: Shiva, the conqueror of Death, at dawn ----------
SHOTS.push({ a: TL.ask2, b: TL.card + .2, xf: .3, draw(c, u, t) {
  const cam = { z: lerp(1, 1.06, easeIO(u / 3)), fx: 540, fy: 1000 };
  plane(c, cam, 0, (c) => { SKY.dawn(c); glow(c, 540, 1200, 900, '#FFB45A', .55); ellipse(c, 540, 1240, 280, 280, '#FFE9B8'); });
  plane(c, cam, .3, (c) => rays(c, 540, 1240, { n: 24, dir: -Math.PI / 2, spread: 6.2, len: 1400, w: 200, col: '#FFE6B0', a: .4, t, seed: 13 }));
  plane(c, cam, 1, (c) => {
    figure(c, (f) => { f.translate(540, 1960); f.scale(1.05, 1.05); shiva(f, { t, eyes: 1, arm: 'abhaya', wind: .3 }); }, { ...LIGHTS.dawnBack, tint: ['#2A1018', .3], grade: [[1450, 'rgba(0,0,0,0)'], [1620, 'rgba(12,4,6,.85)']] });
    fillPath(c, 'M -200 1800 C 300 1780 800 1790 1280 1810 L 1280 2200 L -200 2200 Z', '#1A0A0E');
  });
} });
say(TL.ask2 + .1, TL.card, 'Comment | *HAR HAR MAHADEV*', { y: 490, size: 66 });

// ---------- 19. the card, held to the end ----------
SHOTS.push({ a: TL.card, b: TL.end + 1, xf: .25, draw(c, u, t) { dealCardCine(c, u, t); } });

// ---------- flashes ----------
let POSTWHITE = 0;
POST.push((c, t) => {
  flash(c, pulse(t, TL.boon, 5) * .5 + Math.max(0, 1 - Math.abs(t - TL.boon + .12) / .12) * .4, '#FFD0B0');
  flash(c, strikes(t, [TL.yama]) * .35, '#FF9A7A');
  if (t > TL.loop && t < TL.drop) flash(c, POSTWHITE, '#FFF6E6');
  flash(c, pulse(t, TL.drop, 3) * 1.1, '#FFFFFF');
  flash(c, pulse(t, TL.kick, 4) * .9, '#FFF2D8');
  flash(c, pulse(t, TL.revive + .6, 3) * .25, '#FFE2A8');
});
