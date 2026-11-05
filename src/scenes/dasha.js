// dasha.js: "VISHNU has arrived 9 times. The 10th is yet to ARRIVE." (ad 77, Dashavatar, ~108 s, Bangers captions, SFX, no
// voice). The ten avatars, each one the shape the trouble needed, each arriving as a light falling from the top of the
// frame (avatara: the descent), counted 1 → 10 by a gold badge. The list follows the Agni Purana (2–16); the stories
// the Bhagavata (Matsya 8.24, Kurma 8.7, Varaha 3.13, Narasimha 7.3 + 7.8, Vamana 8.18–22, Kalki 12.2), Valmiki Bala 16
// (Ravana's boon left out men) and the Gita (4.7–8). The 9th is the Buddha, as in the Agni Purana (16).
// STORYBOARD.md has the plan and the sources; sets and props are in dasha_props.js, the new cast in src/dashavatar.js.
// All times are video time (t); tools/dasha_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/dasha_sfx.mjs)
  const FLASH0 = 2.4;
  const M0 = 4.4, MGROW = 9.0;
  const K0 = 14.0, KRISE = 16.6;
  const V0 = 22.4, VBURST = 25.8;
  const N0 = 31.4, STRIKE = 36.6, PILLAR = 37.2, FEAR = 39.6, ROAR2 = 41.0;
  const W0 = 43.4, WGROW = 49.0, STEP1 = 49.8, STEP2 = 51.1, HEAD = 52.3;
  const P0 = 55.3, PAXE = 58.5, PFLEE = 61.1;
  const R0 = 63.3, RAM = 68.1, REV = 70.7;
  const G0 = 72.7;
  const B9 = 82.7;
  const X0 = 90.2, YET = 95.0;
  const ASK = 99.0, CARD = 104.5;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };

  const GOLDC = '#F5C542', REDC = '#FF6A4A', BLUEC = '#9FDCFF', SRC = '#CFE6FF';
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const spike = (t, t0, k = 4) => t > t0 ? Math.exp(-(t - t0) * k) : 0;
  const cutFlash = (lt, col = '#FFFFFF', d = .12, a = .6) => { if (lt < d) flash(a * (1 - lt / d), col); };
  const outFlash = (lt, dur, d = .15) => { if (lt > dur - d) flash((lt - dur + d) / d, '#FFFFFF'); };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['VISHNU', 470, -1, M0 + .9, 150, GOLDC], ['HAS ARRIVED 9 TIMES.', 600, -1, M0 + .9, 92], ['THE 10TH IS YET TO ARRIVE.', 710, -1, M0 + .9, 74, GOLDC],
    ['A TINY FISH ASKED KING MANU', 580, M0 + .5, MGROW - M0 - .6, 64], ['TO SAVE IT.', 675, M0 + .9, MGROW - M0 - 1.0, 86, GOLDC],
    ['THEN IT GREW HUGE', 580, MGROW + .3, K0 - MGROW - .4, 86, GOLDC], ['AND TOWED HIS BOAT THROUGH THE FLOOD.', 680, MGROW + .7, K0 - MGROW - .8, 52],
    ['THE CHURNING MOUNTAIN WAS SINKING.', 580, K0 + .5, V0 - K0 - .7, 56], ['SO HE BECAME A TURTLE', 670, KRISE + .3, V0 - KRISE - .5, 74, GOLDC], ['AND HELD IT UP.', 765, KRISE + .7, V0 - KRISE - .9, 78, GOLDC],
    ['A DEMON SANK THE EARTH', 580, V0 + .5, N0 - V0 - .7, 72], ['IN THE OCEAN.', 670, V0 + .8, N0 - V0 - 1.0, 72], ['HE DIVED AS A BOAR', 770, VBURST + .4, N0 - VBURST - .6, 76, GOLDC], ['AND LIFTED IT ON HIS TUSKS.', 862, VBURST + .8, N0 - VBURST - 1.0, 64, GOLDC],
    ['HIS BOON:', 580, N0 + .5, STRIKE - N0 - .6, 84, REDC], ['NO MAN, NO BEAST,', 680, N0 + 1.2, STRIKE - N0 - 1.3, 74], ['NOT DAY, NOT NIGHT,', 770, N0 + 2.0, STRIKE - N0 - 2.1, 74], ['NOT INSIDE, NOT OUTSIDE.', 860, N0 + 2.8, STRIKE - N0 - 2.9, 66],
    ['SO HE APPEARED HALF-MAN, HALF-LION,', 580, PILLAR + .6, W0 - PILLAR - .8, 60, GOLDC], ['AT DUSK, ON THE DOORSTEP.', 680, PILLAR + 1.2, W0 - PILLAR - 1.4, 66],
    ['KING BALI HAD WON ALL 3 WORLDS.', 580, W0 + .5, WGROW - W0 - .6, 58], ['A LITTLE BOY ASKED HIM', 670, W0 + 1.4, WGROW - W0 - 1.5, 70, GOLDC], ['FOR 3 STEPS OF LAND.', 760, W0 + 1.8, WGROW - W0 - 1.9, 76, GOLDC],
    ['2 STEPS COVERED EVERYTHING.', 580, STEP1 + .2, P0 - STEP1 - .4, 68, GOLDC], ['BALI OFFERED HIS HEAD FOR THE 3RD.', 680, HEAD - .2, P0 - HEAD, 54],
    ['KINGS GREW ARROGANT AND CRUEL.', 580, P0 + .5, R0 - P0 - .7, 60], ['HE ARRIVED WITH SHIVA\'S AXE.', 680, PAXE + .2, R0 - PAXE - .4, 70, GOLDC],
    ['RAVANA\'S BOON:', 580, R0 + .5, RAM - R0 - .6, 84, REDC], ['NO GOD OR DEMON COULD KILL HIM.', 680, R0 + 1.2, RAM - R0 - 1.3, 56], ['HE DIDN\'T BOTHER WITH HUMANS.', 775, R0 + 2.3, RAM - R0 - 2.4, 58],
    ['SO VISHNU WAS BORN A MAN:', 580, RAM + .3, G0 - RAM - .5, 64], ['RAM.', 710, RAM + .8, G0 - RAM - 1.0, 150, GOLDC],
    ['KRISHNA TOLD US WHY:', 580, G0 + .5, B9 - G0 - .7, 70, BLUEC], ['"WHENEVER DHARMA FALLS,', 900, G0 + 3.6, B9 - G0 - 3.8, 66, GOLDC], ['I APPEAR, AGE AFTER AGE."', 990, G0 + 4.2, B9 - G0 - 4.4, 66, GOLDC],
    ['HE SPOKE AGAINST', 580, B9 + 1.0, X0 - B9 - 1.3, 76], ['ANIMAL SACRIFICE,', 680, B9 + 1.4, X0 - B9 - 1.7, 84, GOLDC], ['OUT OF COMPASSION.', 785, B9 + 2.0, X0 - B9 - 2.3, 76, GOLDC],
    ['AT THE END OF KALI YUGA,', 580, X0 + .5, YET - X0 - .6, 70], ['HE WILL ARRIVE ON A WHITE HORSE.', 680, X0 + 1.0, YET - X0 - 1.1, 60, GOLDC],
    ['HE HASN\'T ARRIVED YET.', 600, YET + .3, ASK - YET - .5, 90, GOLDC],
    ['WHICH AVATAR', 580, ASK + .4, CARD - ASK - .5, 84], ['IS YOUR FAVOURITE?', 690, ASK + .9, CARD - ASK - 1.0, 84, GOLDC], ['COMMENT!', 800, ASK + 1.6, CARD - ASK - 1.7, 100, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };
  const BADGES = [[1, 'MATSYA', M0, K0], [2, 'KURMA', K0, V0], [3, 'VARAHA', V0, N0], [4, 'NARASIMHA', N0, W0], [5, 'VAMANA', W0, P0],
    [6, 'PARSHURAMA', P0, R0], [7, 'RAM', R0, G0], [8, 'KRISHNA', G0, B9], [9, 'BUDDHA', B9, X0], [10, 'KALKI', X0, ASK]];
  const words = t => { badges(t); caps(t); };
  function badges(t) { for (const [n, name, a, b] of BADGES) badge(n, name, t - a - .3, b - a - .45); }

  // Kalki on his horse, the pair turned about the horse's middle by rear (radians, - rears up)
  function kalkiRide(hx, hy, hu, ru, o = {}) {
    push(); translate(hx, hy); rotate(o.rear || 0);
    kalki(-.4 * hu, -8.2 * hu + 12.2 * ru, ru, { boilKey: 'kr' + (o.key || ''), swordGlow: o.glow ?? 1, noShadow: true });
    kalkiHorse(0, 0, hu, { boilKey: 'kh' + (o.key || ''), gallop: o.gallop ?? 0 });
    pop();
  }
  const RAMA = { flip: 1, beard: PSR.hair, beardLen: .5, quiver: false, boilKey: 'rama', seed: 7 };

  // ================= A · the hook: Vishnu on Shesha; lightning shows the white horse =================
  function shotHook(t, lt, dur) {
    const fl = spike(t, FLASH0, 2.6) * (t > FLASH0 ? 1 : 0);
    camBegin(540, 1150 - lt * 6, 1.0 + .01 * lt);
    cosmicOcean(t, { seaY: 1640 });
    if (fl > .03) {
      bolt(boltPts(1010, 700, 900, 1060, 5, 3), fl, 'abolt', 9);
      glow(880, 1090, 300, '#DCE8FF', .7 * fl);
      if (fl > .12) kalkiRide(880, 1110, 9.5, 4.2, { rear: -.45, key: 'a', glow: fl });
    }
    shesha(470, 1660, 38, { boilKey: 'ash' });
    vishnu(470, 1660, 38, { boilKey: 'avi', eyes: blinkAt(t, 1.5) ? 'closed' : 'normal', mouth: 'smile', chakraSpin: t * 3, lookX: t > FLASH0 + .2 ? .7 : 0 });
    camEnd();
    words(t);
    outFlash(lt, dur, .2);
  }

  // ================= 1a · Matsya: the light lands in Manu's palms as a tiny pleading fish =================
  function shotFishHands(t, lt, dur) {
    const land = M0 + .6, grow = easeIn(seg(t, MGROW - .7, MGROW));
    camBegin(540, 1330 + grow * 40, 1.18 + .012 * lt + grow * .5);
    riverDawn(t);
    const mo = { boilKey: 'mmanu', handL: [-1.15, -14.4], handR: [1.15, -14.4], bendL: .9, bendR: .9, eyes: t < land + .2 ? 'look' : (t < land + 2.4 ? 'wide' : 'happy'), lookY: .9, lookX: 0, brow: .4,
      mouth: t < land + .2 ? 'smile' : (t < land + 2.4 ? 'O' : 'smile'), bow: .12, noShadow: true };
    manu(540, 2240, 38, mo);
    const [h1x, h1y] = naradaHand(540, 2240, 38, { ...mo, pal: MANU_PAL }, -1), [h2x, h2y] = naradaHand(540, 2240, 38, { ...mo, pal: MANU_PAL }, 1);
    const HX = (h1x + h2x) / 2, HY = (h1y + h2y) / 2 - 10;
    boilSeed('mpool'); paint(ellPts(HX, HY + 6, 110, 30, 18), { wash: DP.river, fill: DP.riverDk, fillOp: 40, ink: DP.ink, sw: 1.2 });
    const on = t > land, pop = backOut(clamp((t - land) * 3));
    const fo = { boilKey: 'mfish', eyes: t < land + 2.2 ? 'plead' : 'happy', mouth: t < land + 2.2 ? 'O' : 'smile', swim: t * 2.5, rot: Math.sin(t * 3) * .08, blush: .5, horn: grow };
    if (on) matsya(HX, HY - 18 - grow * 200, lerp(13, 46, grow) * pop, grow > .05 ? { ...fo, eyes: 'wide', mouth: 'smile' } : fo);
    if (t > land && t < land + .9) sparkleBurst(HX, HY - 30, 170, (t - land) / .9, 'msp', 10, ['#FFFFFF', '#FFE6A0']);
    descentBeam(HX, HY - 10, (t - M0) / .6, 'mdesc', '#FFE6A0');
    camEnd();
    words(t);
    cutFlash(lt, '#FFFFFF', .2, .8);
    outFlash(lt, dur, .15);
  }

  // ================= 1b · the flood: the giant horned fish tows Manu's boat =================
  function shotFlood(t, lt, dur) {
    const b = Math.max(spike(t, MGROW + .9), .7 * spike(t, MGROW + 2.9));
    camBegin(540 + lt * 12, 1150, 1.0);
    stormSea(t, { bolt: b, boltPts: boltPts(900, 300, 760, 980, 6, 11) });
    const SY = 1380;
    floodWaves(t, SY - 60, 'back', 'mfw');
    const rock = Math.sin(t * 2.2) * .1, bx = 150 + lt * 14, by = SY + Math.sin(t * 2.2 + 1) * 16, BS = 80;
    manu(bx + 1.15 * BS, by - .15 * BS, 5.8, { pray: 1, eyes: t > MGROW + 1 ? 'happy' : 'wide', mouth: t > MGROW + 1 ? 'smile' : 'O', noShadow: true, lookX: .8 });
    boat(bx, by, BS, rock, 'mboat');
    const fx = 640 + lt * 16, fy = 1210 + Math.sin(t * 2) * 18, fs = 40, fo = { boilKey: 'mbig', horn: 1, eyes: 'happy', mouth: 'smile', swim: t * 1.4, glowK: .3, rot: Math.sin(t * 2) * .05 };
    const horn = matsyaHorn(fx, fy, fs, fo);
    matsya(fx, fy, fs, fo);
    boilSeed('mrope');
    inkLine(through([boatBow(bx, by, BS, rock), [(bx + horn[0]) / 2, Math.min(by, horn[1]) - 170], horn]), 6, '#3E8A6A', 'ink', .5);   // Vasuki, the rope
    floodWaves(t, SY - 330, 'front', 'mfw');
    camEnd();
    words(t);
    cutFlash(lt, '#FFFFFF', .2, .9);
    outFlash(lt, dur);
  }

  // ================= 2 · Kurma: the mountain sinks; the light dives; the turtle lifts it =================
  function shotKurma(t, lt, dur) {
    const sinkK = ease(seg(t, K0 + .4, KRISE - .3)), riseK = easeOut(seg(t, KRISE + .1, KRISE + 1.1));
    const sink = 190 * sinkK * (1 - riseK), tilt = .17 * sinkK * (1 - riseK), sh = shake(t, KRISE + .1, .6, 12);
    camBegin(540 + sh[0], 1150 + sh[1], 1.0);
    const SY = 1330;
    milkOcean(t, { seaY: SY });
    const ko = { boilKey: 'kkurma', eyes: riseK > .5 ? 'happy' : 'normal', mouth: 'smile', neck: 1, neckA: -.75, noShadow: true };
    if (t > KRISE) kurma(520, SY + 330 + 240 * (1 - riseK), 60, ko);
    const spin = t > KRISE + .8 ? (t - KRISE - .8) * 1.1 : 0;
    mandara(540, SY + sink, 150, { key: 'kmdr', tilt, spin });
    // the front of the milk over the turtle and the mountain's foot
    boilSeed('kfront');
    paint(rectPts(-300, SY + 150, W + 600, 900), { wash: DP.milk, washOp: 225, fill: DP.milkDk, fillOp: 40, tex: .3, ink: null });
    inkLine(Array.from({ length: 12 }, (_, j) => [-150 + j * 130, SY + 152 + Math.sin(t * 2.4 + j) * 6]), 1.8, DP.milkDk, 'ink', .5);
    // the pullers: the devas on the left, the asuras on the right with Vasuki's head
    const pull = Math.sin(t * 3) * 10, worry = t < KRISE + .6;
    const top = [540 - 130 + Math.sin(tilt) * 260, SY - 240 + sink], top2 = [540 + 110 + Math.sin(tilt) * 260, SY - 280 + sink];
    vasukiRope(top, [175 + pull, SY - 200], 'kropeL');
    vasukiRope(top2, [905 - pull, SY - 200], 'kropeR', true);
    cloudPuff(130, SY + 10, 150, 'kclL'); cloudPuff(950, SY + 10, 150, 'kclR');
    deva(130 + pull, SY, 9.2, { boilKey: 'kdv', seed: 2, eyes: worry && t > K0 + 1 ? 'wide' : 'happy', mouth: worry && t > K0 + 1 ? 'O' : 'smile', handR: [3.4, -15.2], handL: [2.4, -14.4], bendL: .5, bendR: .5, noShadow: true });
    asura(950 - pull, SY, 8.6, { kind: 'nishumbha', boilKey: 'kas', seed: 5, sword: false, shield: false, eyes: worry && t > K0 + 1 ? 'wide' : 'happy', mouth: worry && t > K0 + 1 ? 'O' : 'grin', handL: [-3.6, -13.2], handR: [-2.4, -12.4], noShadow: true });
    descentBeam(540, SY + 20, (t - KRISE + .6) / .6, 'kdesc');
    if (t > KRISE) splash(540, SY + 20, 420, (t - KRISE) / 1.1, 'kspl');
    camEnd();
    words(t);
    cutFlash(lt, '#FFFFFF', .2, .9);
    outFlash(lt, dur);
  }

  // ================= 3 · Varaha: the earth sinks in the dark; the boar bursts up into dawn with it =================
  function shotVaraha(t, lt, dur) {
    if (t < VBURST) {
      camBegin(540, 1150 + lt * 20, 1.0);
      depthSet(t);
      const ey = lerp(980, 1470, ease(seg(t, V0, VBURST)));
      earthBall(600, ey, 105, t, 'vearth', false);
      boilSeed('vbub'); for (let i = 0; i < 8; i++) { const k = frac(t * .5 + i / 8); paint(ellPts(600 + Math.sin(i * 2.3 + t) * 70, ey - 120 - k * 500, 8 + 6 * hash(i), 8 + 6 * hash(i), 8), { wash: '#4E8AB8', washOp: 200 * (1 - k), ink: '#8ABCE0', sw: .8 }); }
      hiranyaksha(230, 1820, 16, { eyes: 'happy', mouth: 'laugh', lookX: .6, handL: [5.5, -12], bendL: .4, shield: false, noShadow: true });
      descentBeam(600, ey, (t - VBURST + .6) / .6, 'vdesc');
      camEnd();
      words(t);
      cutFlash(lt, '#FFFFFF', .2, .9);
      return;
    }
    const l = t - VBURST, rise = backOut(clamp(l / .9)), SY = 1380;
    const sh = shake(t, VBURST, .5, 10);
    camBegin(540 + sh[0], 1150 + sh[1], 1.05 - .03 * clamp(l / 3));
    dawnSea(t, SY);
    const bx = 460, by = lerp(1760, 1280, rise), vo = { boilKey: 'vboar', lift: .62, legs: false, eyes: l > .9 ? 'happy' : 'wide', mouth: 'smile', glowK: .2 };
    varaha(bx, by, 38, vo);
    const [tx, ty] = varahaTusk(bx, by, 38, vo);
    earthBall(tx, ty - 92, 92, t, 'vearth2');
    boilSeed('vfront');
    paint(rectPts(-300, SY + 40, W + 600, 900), { wash: DP.surf, washOp: 230, fill: DP.riverDk, fillOp: 50, tex: .3, ink: null });
    inkLine(Array.from({ length: 12 }, (_, j) => [-150 + j * 130, SY + 42 + Math.sin(t * 2.4 + j) * 7]), 2.4, '#FFF2DC', 'ink', .5);
    splash(bx + 60, SY + 30, 460, l / 1.2, 'vspl');
    if (l > .6) drips(bx + 40, by - 150, 220, SY + 40, t, 'vdrip', 7);
    camEnd();
    words(t);
    if (l < .15) flash(.9 * (1 - l / .15), '#FFFFFF');
    outFlash(lt, dur);
  }

  // ================= 4 · Narasimha: the boon; the fist on the pillar; out he comes, at dusk, on the doorstep =================
  function shotNarasimha(t, lt, dur) {
    if (t < PILLAR) {
      const sh = shake(t, STRIKE, .6, 14), walk = ease(seg(t, STRIKE - 1.0, STRIKE - .4)), wind = ease(seg(t, STRIKE - .45, STRIKE - .05)), hit = t > STRIKE;
      camBegin(540 + sh[0], 1180 + sh[1], 1.0 + .01 * lt);
      hallDusk(t, { door: 790, floorY: 1640 });
      pillar(290, 1640, 130, 760, ease(seg(t, STRIKE, PILLAR)), 0, t, 'npil');
      const laugh = t < N0 + 2.6;
      hiranyakashipu(lerp(620, 470, walk), 1640, 19, { eyes: hit ? 'angry' : (laugh ? 'happy' : 'angry'), mouth: hit ? 'roar' : (laugh ? 'laugh' : 'smirk'), lookX: walk > .3 ? -.9 : 0, hx: walk > .3 ? -.4 : 0,
        handL: hit ? [-9.4, -13.5] : (wind > 0 ? [lerp(-4.6, -1.2, wind), lerp(-14, -18.4, wind)] : (laugh ? [-5.2, -18.6] : undefined)), bendL: .5, shield: false, walk: walk > 0 && walk < 1 ? t * 3 : undefined });
      prahlad(950, 1640, 11, { eyes: hit ? 'wide' : 'closed', mouth: 'smile', aL: .3, aR: .3, hx: -.3 });
      if (hit) shockRing(360, 1290, 60 + 500 * (t - STRIKE), 1 - (t - STRIKE) / .5, 'nring', '#FFE6A0', .5);
      descentBeam(290, 1260, (t - STRIKE) / .6, 'ndesc', '#FFE6A0');
      camEnd();
      words(t);
      cutFlash(lt, '#FFFFFF', .2, .9);
      return;
    }
    const l = t - PILLAR;
    if (t > FEAR && t < ROAR2) {   // the reverse: the demon's face as it dawns on him
      const k = t - FEAR;
      camBegin(520, 1300, 1.7 + .05 * k);
      hallDusk(t, { door: 900, floorY: 1640 });
      glow(900, 1250, 520, '#FFD27A', .5);
      hiranyakashipu(520, 1640, 19, { eyes: 'scared', mouth: 'wobble', sweat: 1, shake: .6, lookX: .9, hx: .3, shield: false, sword: false, handL: [-3, -12], handR: [3, -12] });
      camEnd();
      words(t);
      cutFlash(k, '#FFFFFF', .1, .4);
      return;
    }
    const sh = shake(t, PILLAR, .8, 18), sh2 = shake(t, ROAR2, .5, 10), pop = backOut(clamp(l / .45));
    camBegin(540 + sh[0] + sh2[0], 1260 + sh[1] + sh2[1], 1.08 + .025 * l);
    hallDusk(t, { door: 540, floorY: 1640 });
    pillar(540, 1640, 130, 760, 0, clamp(l / 1.3), t, 'npil2');
    const roar = t < PILLAR + 1.4 || (t > ROAR2 && t < ROAR2 + 1.2);
    if (roar) for (let i = 0; i < 2; i++) shockRing(540, 1180, 120 + 700 * frac((t - PILLAR) * .9 + i * .5), 1 - frac((t - PILLAR) * .9 + i * .5), 'nroar' + i, '#FFE6A0', .5);
    narasimha(540, 1640, 21 * (.85 + .15 * pop), { boilKey: 'nsm', eyes: 'angry', mouth: roar ? 'roar' : 'frown', lionPuff: roar ? .4 : 0, handL: [-6.8, -21.5], handR: [6.8, -21.5], bendL: .6, bendR: .6, sq: .04 * Math.sin(t * 9) * (roar ? 1 : 0) });
    camEnd();
    words(t);
    if (l < .18) flash(1 - l / .18, '#FFFFFF');
    if (t > ROAR2 && t < ROAR2 + .1) flash(.5, '#FFE6A0');
    outFlash(lt, dur);
  }

  // ================= 5 · Vamana: a boy asks Bali for three steps; he grows; two steps; Bali's head =================
  function footprint(x, y, s, key, rot = 0) {   // a little sole, toes up, with its five toe dots
    boilSeed(key);
    push(); translate(x, y); rotate(rot);
    paint([[-.3 * s, .9 * s], [-.42 * s, .2 * s], [-.36 * s, -.45 * s], [0, -.62 * s], [.36 * s, -.45 * s], [.3 * s, .2 * s], [.2 * s, .9 * s], [0, 1.0 * s]], { wash: '#8A5A3A', ink: null, curv: .6 });
    for (let i = 0; i < 5; i++) { const a = -2.5 + i * .3; paint(ellPts(Math.cos(a) * .55 * s + .05 * s, -.62 * s + Math.sin(a) * .3 * s + .05 * s, (i ? .1 : .15) * s, (i ? .1 : .15) * s, 8), { wash: '#8A5A3A', ink: null }); }
    pop();
  }
  function shotVamana(t, lt, dur) {
    if (t < STEP1) {
      const land = W0 + .6, grow = easeIn(seg(t, WGROW, STEP1 - .05)), bub = ease(seg(t, W0 + 1.5, W0 + 2.0)) * (1 - ease(seg(t, WGROW - .4, WGROW)));
      camBegin(540, 1200 - grow * 500, 1.0 - grow * .25);
      yagnaSet(t, { groundY: 1640 });
      yagnaKund(560, 1640, 170, t, .2, 'wkund');
      const nod = t > W0 + 3.0 && t < W0 + 4.2 ? Math.sin((t - W0 - 3.0) * 9) * .3 : 0;
      bali(290, 1650, 17, { eyes: t > W0 + 3.0 && t < W0 + 4.3 ? 'happy' : 'normal', mouth: t > W0 + 3.0 && t < W0 + 4.3 ? 'grin' : 'smile', lookX: .8, hx: .3 + nod, handR: [6, -14], bendR: .7 });
      if (t > land) {
        const p = backOut(clamp((t - land) * 3));
        if (grow > 0) glow(820, 1500 - grow * 600, 300 + grow * 900, '#FFE6A0', .6 * grow);
        vamana(820, 1650, 12 * p * (1 + grow * 6), { boilKey: 'vmn', eyes: 'normal', mouth: 'smile', lookX: -.7, hx: -.3, noShadow: grow > .2 });
      }
      if (t > land && t < land + .9) sparkleBurst(820, 1500, 200, (t - land) / .9, 'wsp', 10, ['#FFFFFF', '#FFE6A0']);
      if (bub > 0) {   // his wish: three steps
        thoughtBubble(720, 1180, 300, 190, bub, 800, 1390, 'wbub');
        if (bub > .7) for (let i = 0; i < 3; i++) footprint(630 + i * 90, 1205 - i * 18 + (i % 2) * 22, 34, 'wfp' + i, .35);
      }
      descentBeam(820, 1600, (t - W0) / .6, 'wdesc', '#FFE6A0');
      camEnd();
      words(t);
      cutFlash(lt, '#FFFFFF', .2, .9);
      if (t > STEP1 - .12) flash((t - STEP1 + .12) / .12, '#FFFFFF');
      return;
    }
    if (t < HEAD) {   // the two steps: one on the earth, one across the sky
      const l = t - STEP1, st2 = t > STEP2, sh = shake(t, STEP1 + .45, .5, 16);
      camBegin(540 + sh[0], 1150 + sh[1] - (st2 ? (t - STEP2) * 250 : 0), 1.0);
      starSky(t);
      if (!st2) {
        earthBall(540, 1420, 150, t, 'wearth');
        const fy = lerp(-300, 1272, easeOut(clamp(l / .45)));
        trivikramaFoot(420, fy, 48, { boilKey: 'wf1', glowK: .4, legLen: 40 });
        if (l > .45) shockRing(560, 1280, 100 + 900 * (l - .45), 1 - (l - .45) / .5, 'wring', '#FFE6A0', .3);
      } else {
        const k = (t - STEP2) / (HEAD - STEP2);
        speedLines(.9, 1, 'wspd', '#FFE6A0');
        sunDisc(860, 820, 60, 'wsun');
        trivikramaFoot(lerp(-700, 1500, ease(k)), 1000, 48, { boilKey: 'wf2', glowK: .4, legLen: 40 });
      }
      camEnd();
      words(t);
      if (st2 && t < STEP2 + .1) flash(.6, '#FFFFFF');
      cutFlash(l, '#FFFFFF', .15, .7);
      return;
    }
    // Bali kneels, crown off, and the foot comes down on his head, gently
    const l = t - HEAD, down = easeOut(seg(t, HEAD + .3, HEAD + 1.3));
    camBegin(540, 1300, 1.12 + .02 * l);
    yagnaSet(t, { groundY: 1680 });
    glow(540, 1200, 600, '#FFE6A0', .45 * down);
    const bo = { sit: 1, pray: 1, bow: .45, crown: false, eyes: 'closed', mouth: 'smile', boilKey: 'bali2' };
    bali(540, 1700, 21, bo);
    const [hx, hy] = naradaHead(540, 1700, 21, { ...bo, pal: BALI_PAL });
    const top = hy - 3.4 * 21 * 1.16, FS = 26;
    trivikramaFoot(hx - 1.2 * FS, lerp(top - 900, top + 4, down), FS, { boilKey: 'wf3', glowK: .5, legLen: 60 });
    if (down > .98) sparkleBurst(hx, top, 220, (t - HEAD - 1.3) / 1.0, 'wbl', 10, ['#FFFFFF', '#FFE6A0']);
    camEnd();
    words(t);
    cutFlash(l, '#FFFFFF', .15, .7);
    outFlash(lt, dur);
  }

  // ================= 6 · Parshurama: arrogant kings; the axe; they run =================
  function shotParshu(t, lt, dur) {
    if (t < PAXE) {
      camBegin(540, 1300 + lt * 6, 1.05);
      bloodGround(t, 540, 1150);
      for (let i = 0; i < 3; i++) kartSon(i, 230 + i * 310, 1760, 14, { eyes: 'smug', mouth: 'grin', puff: .7, lookX: i === 0 ? .6 : -.4, hx: Math.sin(t * 2 + i) * .2, walk: t * 1.6 + i * .3, lean: Math.sin(t * 3 + i) * .3 });
      descentBeam(540, 1500, (t - PAXE + .6) / .6, 'pdesc', '#FFE6A0');
      camEnd();
      words(t);
      cutFlash(lt, '#FFFFFF', .2, .9);
      if (t > PAXE - .1) flash((t - PAXE + .1) / .1, '#FFFFFF');
      return;
    }
    if (t < PFLEE) {
      const l = t - PAXE;
      camBegin(540, 1280 - l * 12, 1.06 + .02 * l);
      bloodGround(t, 540, 1150);
      rama(540, 2100, 30, { axe: 'raise', axeGlow: .8 + .2 * Math.sin(t * 5), eyes: blinkAt(t, PAXE + 1.2) ? 'closed' : 'angry', brow: -1, mouth: 'frown', wind: .6, aura: .75, puff: .3 });
      camEnd();
      words(t);
      cutFlash(l, '#FFFFFF', .15, .8);
      return;
    }
    const l = t - PFLEE, run = easeIn(clamp(l / 1.6));
    camBegin(540, 1300, 1.05);
    bloodGround(t, 540, 1150);
    glow(1200, 1300, 700, '#FFE6A0', .5);
    for (let i = 0; i < 3; i++) {
      const dir = i === 2 ? 1 : -1, x = 230 + i * 310 + dir * run * 900;
      kartSon(i, x, 1760, 14, { eyes: 'wide', brow: 1, mouth: 'scream', sweat: true, lookX: 1, walk: t * 7 + i, lean: -dir * .8, handL: [-6, -19], bendL: .6 });
      if (l > .2) crownProp(230 + i * 310 + dir * 60, lerp(1400, 1760, easeIn(clamp((l - .2) / .5))), 70, 'pcr' + i);
    }
    camEnd();
    words(t);
    cutFlash(l, '#FFFFFF', .12, .5);
    outFlash(lt, dur);
  }
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });

  // ================= 7 · Ram: Ravana's boon left out men; Ram draws the Kodanda; the ten heads gulp =================
  const LANKA = ['#1E0A22', '#3E1438', '#6A2442'];
  function shotRam(t, lt, dur) {
    if (t < RAM) {
      const shrug = t > R0 + 1.8;
      camBegin(540, 1360, 1.0 + .015 * lt);
      sunburst(t, 540, 1300, LANKA);
      const bob = Math.abs(Math.sin(t * 7)) * (shrug ? .1 : .3);
      ravana(540, 1800, 20, { dy: -bob, all: shrug ? { eyes: 'side', mouth: 'smirk' } : { eyes: 'happy', mouth: 'grin' }, heads: shrug ? { 4: { eyes: 'closed', mouth: 'smirk', chinUp: true } } : {} });
      camEnd();
      words(t);
      cutFlash(lt, '#FFFFFF', .2, .9);
      descentBeam(540, 1500, (t - RAM + .6) / .6, 'rdesc', '#BFE0FF');
      if (t > RAM - .1) flash((t - RAM + .1) / .1, '#FFFFFF');
      return;
    }
    if (t < REV) {
      const l = t - RAM, draw = ease(seg(t, RAM + .4, RAM + 1.6));
      camBegin(540, 1300 - l * 10, 1.05 + .025 * l);
      sunburst(t, 540, 1250);
      ram(560, 2120, 29, { flip: 1, kodanda: false, handL: [-7.6, -18], handR: [lerp(-4, -1.6, draw), -18.4], bendR: .5, armL: heldBow(draw, true), eyes: blinkAt(t, RAM + 1.1) ? 'closed' : 'normal', brow: -.3, mouth: 'flat', boilKey: 'rram' });
      camEnd();
      words(t);
      if (l < .15) flash(1 - l / .15, '#FFFFFF');
      return;
    }
    const l = t - REV;
    camBegin(540, 1360, 1.15 + .04 * l);
    sunburst(t, 540, 1300, LANKA);
    ravana(540, 1800, 20, { shake: .5, all: { eyes: 'wide', mouth: 'wobble', sweat: 1, brows: 1 }, heads: { 0: { eyes: 'wide', mouth: 'O' } } });
    camEnd();
    words(t);
    cutFlash(l, '#FFFFFF', .1, .4);
    outFlash(lt, dur);
  }

  // ================= 8 · Krishna: on the chariot, the Gita: why he comes =================
  function shotKrishna(t, lt, dur) {
    const push = ease(seg(t, G0 + 1.8, G0 + 5.0)), lit = ease(seg(t, G0 + .8, G0 + 4.0));
    const z = lerp(1.0, 1.4, push);
    camBegin(lerp(540, 470, push), lerp(960, 1080, push), z);
    dustPlain(t, { groundY: 1780 });
    banners(-100, 1200, 1640, 1, t, 'gban');
    let kh = null;
    royalChariot(330, 1930, 300, t, { key: 'gch', riders: ([sx, sy]) => {
      kh = naradaHead(sx + 50, sy, 15.5, { pal: KRS });
      halo(kh[0], kh[1], 160 + 60 * lit, lit, 'ghalo', '#FFE6A0');
      glow(kh[0], kh[1], 500 + 300 * lit, '#FFE6A0', .5 * lit);
      arjuna(sx - 80, sy + 40, 13, { sit: 1, pray: 1, bow: .25, eyes: 'look', lookX: .8, lookY: -.6, mouth: 'O', hx: .3 });
      krishna(sx + 50, sy, 15.5, { boilKey: 'gkrs', eyes: blinkAt(t, G0 + 4.9) ? 'closed' : 'happy', mouth: t > G0 + 3.6 && t < G0 + 6.6 ? (Math.sin(t * 16) > -.2 ? 'open' : 'smile') : 'smile', lookX: -.7, hx: -.3, handL: [-5.6, -18.8], bendL: .6, flute: 'hand' });
    } });
    camEnd();
    words(t);
    rkVerse(['यदा यदा हि धर्मस्य', '… सम्भवामि युगे युगे'], 540, 700, 62, t - G0 - 1.2, { stagger: .7 });
    cutFlash(lt, '#FFFFFF', .2, .9);
    descentBeam(540, 1300, (lt) / .6, 'gdesc', '#FFE6A0');
    outFlash(lt, dur);
  }

  // ================= 9 · the Buddha: the light lands under the bodhi tree; a goat walks free from the post and settles beside him =================
  function shotNine(t, lt, dur) {
    const land = B9 + .6, walk = ease(seg(t, B9 + 1.8, B9 + 4.0)), sit = ease(seg(t, B9 + 4.1, B9 + 4.6));
    camBegin(540, 1330, 1.0 + .012 * lt);
    coolGrove(t, { groundY: 1680 });
    bodhiTree(560, 1700, 180, t, 'b9tree');
    boilSeed('b9post'); paint(rectPts(70, 1380, 34, 330), { wash: DP.bark, fill: DP.barkDk, fillOp: 50, ink: DP.ink, sw: 1.2 });
    inkLine([[104, 1500], [140, 1560], [130, 1640], [160, 1690]], 3, '#C8A27A', 'ink', .6);   // the loose rope
    glow(560, 1430, 420, '#FFF2C8', .35 * clamp((t - land) * 2));
    if (t > land) buddha(560, 1720, 19 * backOut(clamp((t - land) * 3)), { boilKey: 'b9bud2', mouth: 'smile', blush: .2 * sit });
    if (t > land && t < land + .9) sparkleBurst(560, 1500, 220, (t - land) / .9, 'b9sp', 10, ['#FFFFFF', '#FFF2C8']);
    goat(lerp(150, 330, walk), 1730, 26, { key: 'b9goat', walk: walk < 1 ? t * 1.8 : undefined, sit });
    if (sit > .9) emote('heart', 360, 1560, 26, clamp((t - B9 - 4.6) * 3), t);
    descentBeam(560, 1560, (t - B9) / .6, 'b9desc', '#FFF2C8');
    camEnd();
    words(t);
    cutFlash(lt, '#FFFFFF', .2, .9);
    outFlash(lt, dur);
  }

  // ================= 10 · Kalki: the storm; the white horse; he rears; "he hasn't come yet" =================
  function shotKalki(t, lt, dur) {
    const b = Math.max(spike(t, X0 + .05, 3), spike(t, YET, 1.6), .6 * spike(t, X0 + 2.4, 4));
    const go = easeOut(seg(t, X0 + .3, YET - .1)), rear = backOut(seg(t, YET, YET + .6)) * (1 - .3 * ease(seg(t, YET + 1.8, YET + 2.6)));
    const sh = shake(t, YET, .6, 12);
    camBegin(540 + sh[0], 1300 + sh[1], 1.0 + .03 * clamp(t - YET, 0, 3));
    kalkiStorm(t, { bolt: b, floorY: 1700, boltPts: t > YET - .1 ? boltPts(820, 200, 700, 1300, 7, 21) : boltPts(300, 200, 420, 1100, 6, 17) });
    const hx = lerp(-300, 520, go);
    kalkiRide(hx, 1600, 25, 11, { rear: -.5 * rear, gallop: frac(t * lerp(2.4, .4, go)), key: 'x', glow: .6 + .4 * b });
    if (t > YET) for (let i = 0; i < 2; i++) snowPuff(hx + 160 + i * 60, 1700, 90, (t - YET - i * .1) / .9, 'xdust' + i);
    camEnd();
    words(t);
    cutFlash(lt, '#FFFFFF', .2, .9);
    outFlash(lt, dur);
  }

  // ================= ASK · Vishnu on Shesha, ringed by his forms =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 990 - lt * 6, 1.0 + .008 * lt);
    cosmicOcean(t, { seaY: 1640 });
    shesha(520, 1660, 25, { boilKey: 'qsh' });
    vishnu(520, 1660, 25, { boilKey: 'qvi', eyes: blinkAt(t, ASK + 3.1) ? 'closed' : 'happy', mouth: 'smile', chakraSpin: t * 3 });
    for (let i = 0; i < 10; i++) {
      const a = Math.PI + (i + .5) / 10 * Math.PI, x = 520 + Math.cos(a) * 400, y = 1480 + Math.sin(a) * 440;
      medallion(i, x, y, 54, t, (t - ASK - .2 - i * .12) * 3);
    }
    camEnd();
    words(t);
    cutFlash(lt, '#FFFFFF', .25, .9);
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, ['#16245A', '#2A3E86']); }
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#16245A', '#2A3E86']); }
  }

  shots([[0, shotHook], [M0, shotFishHands], [MGROW, shotFlood], [K0, shotKurma], [V0, shotVaraha], [N0, shotNarasimha],
    [W0, shotVamana], [P0, shotParshu], [R0, shotRam], [G0, shotKrishna], [B9, shotNine], [X0, shotKalki], [ASK, shotAsk], [CARD, shotCard]]);
})();
