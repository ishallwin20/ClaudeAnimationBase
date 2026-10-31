// parshu2.js: "PARSHURAMA fought a DEMON ARMY with NO WEAPONS" (ad 68, Parshurama series Part 2, ~78 s, Bangers
// captions, cartoon SFX, no voice). Mahabharata 8.24 (Critical Edition; Ganguli's Karna Parva 34): Rama, Jamadagni's son,
// pleases Shiva with austerities to win weapons; Shiva: "I will give them when you are pure; they burn the unfit"; he
// worships for many years; Shiva praises him to his consort and the gods; the Danavas oppress the gods and Shiva sends
// him; "I have no weapons!"; "Go, you will slay them"; he kills them with blows alone, comes back wounded, is healed by
// Shiva's touch and given divine weapons. The axe: MBh 13.18.11, in his own words. Paraśu + Rāma = Parshurama.
// Paced slow on purpose (a viewer found Part 1 too fast): 14 caption groups, quotes up ≥ 4.5 s, gaps between.
// STORYBOARD.md has the plan and the sources; sets and props are in parshu2_props.js (and parshu1_props.js). All times
// are video time (t); tools/parshu2_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu2_sfx.mjs)
  const B0 = 5.4;
  const PRAY = 5.8, SHIVA_IN = 9.9, SAYS = 10.9, C0 = 15.5;
  const HOT = 15.6, WARN = 16.0, D0 = 20.6;
  const LAPSE = 20.8, E0 = 25.6;
  const SMILE = 26.0, F0 = 31.0;
  const STOMP = 31.0, SEND = 33.8, G0 = 36.0;
  const SHRUG = 36.4, H0 = 41.5;
  const GO = 41.9, I0 = 46.6;
  const STRIDE = 46.6, BRAWL = 47.8, CLEAR = 50.2, J0 = 53.1;
  const KNEEL = 53.2, TOUCH = 55.2, K0 = 58.6;
  const GIFTS = 58.8, AXE_IN = 61.0, CATCH = 62.0, L0 = 64.6;
  const N1 = 65.0, N2 = 66.2, NAME = 67.4, M0 = 70.6;
  const ASK = 70.7, CARD = 74.3;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };

  const GOLDC = '#F5C542', CREAM = '#FFF5E2', REDC = '#FF8A5A';
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const GOLD = [GOLDC, '#F39A2E'], PEACH = [TK.marigold, TK.petal], DUSK = [P2.plainMid, P2.plainHi], ICE = ['#CFEFFF', '#8EC8F0'], STORM = [P2.cloudR, P2.stormHi];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['PARSHURAMA', 470, -1, 5.9, 124, GOLDC], ['FOUGHT A DEMON ARMY', 590, -1, 5.9, 84], ['WITH NO WEAPONS!', 690, -1, 5.9, 88, GOLDC],
    ['HIS NAME WAS JUST RAMA.', 470, PRAY, 4.1, 80, GOLDC], ['HE PRAYED TO SHIVA FOR WEAPONS.', 575, PRAY + .2, 3.9, 62],
    ['"I WILL GIVE THEM TO YOU', 470, SAYS, 4.5, 74], ['WHEN YOU ARE PURE."', 575, SAYS + .2, 4.3, 84, GOLDC],
    ['"THEY BURN ANYONE', 470, WARN, 4.5, 88], ['WHO IS UNFIT."', 585, WARN + .2, 4.3, 104, REDC],
    ['SO HE KEPT PRAYING…', 470, LAPSE + .2, 4.1, 84], ['FOR YEARS.', 585, LAPSE + .5, 3.8, 112, GOLDC],
    ['"THIS RAMA', 470, SMILE, 4.5, 100, GOLDC], ['IS DEVOTED TO ME."', 585, SMILE + .2, 4.3, 88],
    ['WHEN DEMONS ATTACKED THE GODS,', 470, STOMP + .4, 4.4, 62], ['SHIVA SENT RAMA TO FIGHT THEM.', 570, STOMP + .6, 4.2, 64, GOLDC],
    ['"BUT LORD…', 470, SHRUG, 4.5, 90], ['I HAVE NO WEAPONS!"', 585, SHRUG + .3, 4.2, 86, GOLDC],
    ['"GO.', 470, GO, 4.5, 140, GOLDC], ['YOU WILL WIN."', 600, GO + 1.0, 3.5, 90],
    ['HE BEAT THEM ALL', 470, BRAWL + .4, 4.6, 92], ['WITH HIS BARE HANDS!', 585, BRAWL + .6, 4.4, 86, GOLDC],
    ['HE CAME BACK WOUNDED.', 470, KNEEL + .3, 4.7, 80], ['ONE TOUCH OF SHIVA HEALED HIM.', 575, TOUCH + .2, 2.8, 64, GOLDC],
    ["SHIVA'S GIFTS:", 470, GIFTS + .2, 5.3, 90, GOLDC], ['DIVINE WEAPONS…', 565, GIFTS + .4, 5.1, 78], ['…AND ONE AXE.', 1430, CATCH + .2, 2.1, 104, GOLDC],
    ['PARASHU = AXE', 470, N1, L0 + 6 - N1, 84], ['RAMA + PARASHU =', 580, N2, L0 + 6 - N2, 84], ['PARSHURAMA', 720, NAME, M0 - NAME, 136, GOLDC],
    ['COMMENT "HAR HAR MAHADEV"', 1430, ASK, CARD - ASK, 72, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // Rama: young (clean-shaven), his right hand on screen left (flip: 1)
  const RAMA = { flip: 1, beard: false, axe: false, quiver: false, boilKey: 'rama', seed: 7 };
  const FISTS = { handR: [3.3, -17.4], bendR: .95, handL: [-2.7, -16.6], bendL: .8 };
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });

  // ================= A · the hook: no weapons =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1150 - lt * 6, 1 + .02 * lt);
    peachGround(t, 540, 1250);
    const glance = t > 4.9, o = { ...FISTS, eyes: glance ? 'look' : 'normal', lookX: glance ? -1 : 0, lookY: glance ? .3 : 0, brow: glance ? .6 : -.4, mouth: glance ? 'O' : 'flat',
      dy: -.15 * Math.abs(Math.sin(t * 2.6)) - (glance ? .25 * Math.sin(seg(t, 4.9, 5.3) * Math.PI) : 0), wind: .3 };
    rama(560, 1720, 26, o);
    // the axe that should be in his right hand (screen left): a dashed outline beside it, bobbing, a "?" by it
    const [hx, hy] = naradaHand(560, 1720, 26, { ...RAMA, ...o }, 1);
    axeOutline(hx - 140, hy + 110 + Math.sin(t * 2) * 6, 30, -.12, 1, '#B8401A', 'ghost');
    boilSeed('hookq'); emote('?', hx - 290, hy - 10, 54, pop(t, -1), t);
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLD);
  }

  // ================= B · tapas; Shiva answers =================
  const RX = 340, RY = 1572, RU = 19, SX = 770, SY = 1130, SU = 16;
  function shotTapas(t, lt, dur) {
    camBegin(540, 1160 - lt * 4, 1 + .008 * lt);
    tapasSet(t, { sky: SKY_DAWN });
    const inK = ease(seg(t, SHIVA_IN, SHIVA_IN + .9)), up = t > SHIVA_IN + .4;
    // Shiva on a cloud in a soft halo, the clouds parting
    if (t > SHIVA_IN - .3) {
      halo(SX, SY - 15 * SU, 9 * SU * inK, inK, 'bhalo');
      cloudPuff(SX - 180 - inK * 120, SY + 10, 120, 'bc1', 255 * (1 - inK * .6));
      cloudPuff(SX + 120 + inK * 120, SY + 20, 110, 'bc2', 255 * (1 - inK * .6));
      if (inK > .05) {
        cloudPuff(SX, SY + 30, 150, 'bseat');
        const sk = .6 + .4 * backOut(inK);
        shiva(SX, SY, SU * sk, { boilKey: 'shivab', seed: 3, eyes: blinkAt(t, 13.2) ? 'closed' : 'normal', lookX: -.7, lookY: .5, hx: -.3, mouth: talk(t, SAYS, SAYS + 3.8, 'smile', 'o'), ganga: 1, noShadow: true });
        if (inK < 1) poof(SX, SY - 10 * SU, 260, inK, 'bpoof');
      }
    }
    if (up) glow(RX, RY - 15 * RU, 260, '#FFE6A0', .35 * inK);
    rama(RX, RY, RU, { sit: 1, mudra: 1, eyes: up ? 'look' : 'closed', lookX: up ? .7 : 0, lookY: up ? -.7 : 0, hx: up ? .35 : 0, mouth: up ? 'O' : 'smile', aura: .25 + .1 * Math.sin(t * 1.5), wind: .2 });
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    if (lt > dur - .25) flash((lt - dur + .25) / .25, '#FFFDF6');
  }

  // ================= C · the warning: they burn the unfit =================
  function shotWarn(t, lt, dur) {
    camBegin(540, 1200, 1.02 + .02 * lt);
    tapasSet(t, { sky: { hi: '#4E5E9A', mid: '#9AA6D0', lo: '#D6E2F2' } });
    const k = ease(seg(t, HOT, HOT + .5)), [hx, hy] = naradaHead(250, 1830, 32, { ...RAMA, sit: 1 });
    glow(hx + 60, hy, 300, P2.hotGlow, .45 * k);
    const o = { sit: 1, eyes: 'wide', lookX: .9, lookY: -.3, hx: .3, brow: .8, mouth: 'O', sweat: t > HOT + .8, handR: [3.6, -15.8], bendR: .7, handL: [-3.4, -15.2], bendL: .6, lean: -.5 - .2 * k };
    rama(250, 1830, 32, o);
    celestialWeapons(720, 1120, 34, t, { heat: 1, k, key: 'cwhot' });
    camEnd();
    caps(t);
    if (lt < .25) flash(1 - lt / .25, '#FFFDF6');
    if (lt > dur - .5) { flushLetters(); iris(...[760, 1180], lerp(1600, 0, easeIn((lt - dur + .5) / .5)), '#1E2350'); }
  }

  // ================= D · the years =================
  function shotYears(t, lt, dur) {
    const k = (t - LAPSE) * 1.5 + .25, S = lapseSky(k);
    camBegin(540, 1180, 1.06 - .02 * lt);
    tapasSet(t, { sky: S, snow: .5 + .5 * Math.sin(k * 1.3), flowers: clamp(Math.sin(k * 1.3 + 3)), skyFx: () => {
      if (S.day < .6) { boilSeed('dstars'); for (let i = 0; i < 20; i++) paint(starPts(hash(i * 2.3) * 1080, 220 + hash(i * 6.7) * 900, 3 + 4 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', washOp: 255 * (1 - S.day / .6), ink: null }); }
      const a = Math.PI * (1 - frac(k)), a2 = Math.PI * (1 - frac(k + .5));
      sunDisc(540 + Math.cos(a) * 640, 1360 - Math.sin(a) * 820, 64, 'dsun');
      const mx = 540 + Math.cos(a2) * 640, my = 1360 - Math.sin(a2) * 820;
      boilSeed('dmoon'); glow(mx, my, 150, '#FFF4D2', .4); paint(ellPts(mx, my, 48, 48, 20), { wash: CP.moon, ink: CP.ink, sw: 1 });
    } });
    const o = { sit: 1, mudra: 1, eyes: 'closed', mouth: 'smile', aura: .3 + .5 * seg(t, LAPSE, E0), wind: .3 * Math.sin(k * 3) };
    rama(540, 1572, 20, o);
    snowOn(540, 1572, 20, { ...RAMA, ...o }, clamp(.5 + .7 * Math.sin(k * 1.3)), 'dsnow');
    if (Math.sin(k * 1.3) > .2) { boilSeed('dfall'); for (let i = 0; i < 26; i++) { const x = frac(hash(i * 3.1) + t * .03) * 1200 - 60, y = frac(hash(i * 7.3) + t * .35) * 1500 + 400; paint(ellPts(x, y, 5, 5, 8), { wash: P2.snow, ink: null }); } }
    camEnd();
    caps(t);
    if (lt < .5) { flushLetters(); iris(540, 1300, lerp(0, 1600, easeOut(lt / .5)), '#1E2350'); }
    if (lt > dur - .3) { const p = (lt - dur + .3) / .3; flushLetters(); boilSeed('dwhip'); for (let i = 0; i < 14; i++) { const x = hash(i * 2.7) * 1080; inkLine([[x, -100], [x, 2100]], 34 * p, i % 2 ? '#BFE0F4' : '#8EC4EC', 'ink', 0); } }
  }

  // ================= E · Kailash: "this Rama is devoted to me" =================
  function shotKailash(t, lt, dur) {
    camBegin(540, 1220 + (1 - easeOut(clamp(lt / .4))) * 500, 1.0 + .02 * lt);
    kailashDay(t);
    const turned = t > SMILE, warm = t > SMILE + 1.6;
    halo(420, 1600 - 15 * 22, 9 * 22, .7, 'ehalo');
    shiva(420, 1600, 22, { boilKey: 'shivae', seed: 3, eyes: turned ? 'normal' : 'look', lookX: turned ? 1 : -.3, lookY: turned ? 0 : .7, hx: turned ? .45 : -.1, mouth: talk(t, SMILE + .1, SMILE + 2.4, 'smile', 'o'), ganga: 1 });
    parvati(780, 1620, 21, { boilKey: 'umae', seed: 9, eyes: warm ? 'happy' : 'look', lookX: -1, lookY: turned ? 0 : .6, hx: -.3, mouth: 'smile', blush: warm ? .5 : 0, pray: warm ? .6 : 0 });
    if (warm) { glow(600, 1300, 300 * pop(t, SMILE + 1.6), '#FFE6B0', .3); boilSeed('eheart'); emote('heart', 870, 1620 - 28 * 21, 28, pop(t, SMILE + 1.7), t - SMILE - 1.7); }
    camEnd();
    caps(t);
  }

  // ================= F · the demons; Shiva sends him =================
  function shotStorm(t, lt, dur) {
    const sh = [0, 1, 2, 3].map(i => shake(t, STOMP + .2 + i * .6, .25, 6)).reduce((a, b) => [a[0] + b[0], a[1] + b[1]]);
    camBegin(540 + sh[0], 1200 + sh[1], 1);
    stormSky(t, { bolt: 1 - seg(t, STOMP, STOMP + .35) });
    // the devas run off the right edge
    for (let i = 0; i < 3; i++) {
      const x = 600 + (t - STOMP) * 170 + i * 110; if (x > 1250) continue;
      deva(x, 1540 - i * 6, 9, { boilKey: 'deva' + i, seed: 30 + i, walk: t * 9 + i, eyes: 'wide', mouth: 'O', sweat: true, lean: 1.2, handL: [-3, -22], handR: [3, -22], noShadow: true });
    }
    // the Danavas stomp in from the left, clubs up, grinning
    for (let i = 0; i < 4; i++) {
      const x = -120 + i * 185 + (t - STOMP) * 105, u = 17 + i * .5;
      danava(x, 1580, u, { v: i, boilKey: 'dn' + i, seed: 40 + i, walk: t * 4 + i * .7, eyes: i % 2 ? 'angry' : 'happy', mouth: i % 2 ? 'roar' : 'laugh', brows: -.8, handR: [4.5, -17.5], bendR: .8, lookX: 1 });
    }
    camEnd();
    caps(t);
  }
  function shotSend(t, lt, dur) {
    camBegin(540, 1150, 1.02 + .02 * lt);
    kailashDay(t, { ledgeY: 1820 });
    const pt = ease(seg(t, SEND + .2, SEND + .7));
    halo(540, 1820 - 15 * 34, 9 * 34, .8, 'fhalo');
    shiva(540, 1820, 34, { boilKey: 'shivaf', seed: 3, eyes: 'normal', lookX: -.4, lookY: .8, brow: -.3, mouth: 'flat', ganga: 1, handL: pt > 0 ? [lerp(-4.6, -8.6, pt), lerp(-3.8, -4.4, pt)] : undefined, bendL: .3 });
    if (pt > .5) lightBeam(260, 2000, 120 * pt, pt, 'fbeam');
    camEnd();
    caps(t);
    if (lt < .25) { flushLetters(); brushWipe(.5 + lt / .5, STORM); }
  }

  // ================= G · "but Lord… I have no weapons!" =================
  function shotShrug(t, lt, dur) {
    camBegin(540, 1220, 1 + .015 * lt);
    tapasSet(t, { sky: SKY_NOON, rockY: 1700 });
    glow(760, 300, 600, '#FFE6A0', .45);
    const out = ease(seg(t, SHRUG, SHRUG + .5)), look = t < SHRUG + .9 ? 0 : t < SHRUG + 1.9 ? -1 : t < SHRUG + 2.9 ? 1 : 0, up = t > SHRUG + 3.5;
    const shrug = Math.max(0, Math.sin(seg(t, SHRUG + .3, SHRUG + 1.1) * Math.PI)) + Math.max(0, Math.sin(seg(t, SHRUG + 2.9, SHRUG + 3.5) * Math.PI)) * .7;
    const o = { eyes: up ? 'look' : 'wide', lookX: up ? .4 : look, lookY: up ? -.9 : (look ? .7 : 0), hx: look * .3 + (up ? .2 : 0), brow: .9, mouth: up ? 'smile' : talk(t, SHRUG, SHRUG + 2.8, 'O', 'open'),
      handR: [lerp(1.6, 6.2, out), lerp(-7.5, -12.8 - shrug * .8, out)], bendR: -.4, handL: [lerp(-1.6, -6.2, out), lerp(-7.5, -12.8 - shrug * .8, out)], bendL: -.4,
      dy: -shrug * .25, sweat: t > SHRUG + 1, wind: .2 };
    rama(540, 1720, 32, o);
    for (const s of [-1, 1]) if (out > .9 && !up) { boilSeed('gpalm' + s); const [px, py] = naradaHand(540, 1720, 32, { ...RAMA, ...o }, s); paint(ellPts(px, py + 4, 34, 10, 12), { wash: '#FFF2D8', washOp: 120, ink: null }); }
    boilSeed('gq'); if (t > SHRUG + .6 && !up) emote('?', 760, 1720 - 33 * 32, 46, pop(t, SHRUG + .6), t - SHRUG);
    camEnd();
    caps(t);
    if (lt < .25) flash(.6 * (1 - lt / .25), '#FFF6DA');
  }

  // ================= H · "Go. You will win." =================
  function shotGo(t, lt, dur) {
    const p = pulse2(t, 1) * 0, hit = clamp(1 - (t - GO) / .6);
    camBegin(540, 1250, 1.02 + .015 * lt);
    tapasSet(t, { sky: SKY_NOON, rockY: 1890 });
    halo(540, 1890 - 15 * 40, 10 * 40 * (1 + .08 * (t > GO ? hit : 0)), .9, 'hhalo');
    shiva(540, 1890, 40, { boilKey: 'shivah', seed: 3, eyes: blinkAt(t, 44.3) ? 'closed' : 'normal', lookX: 0, lookY: .2, mouth: talk(t, GO, GO + .5, 'smile', 'o') === 'o' || talk(t, GO + 1.0, GO + 2.2, 'smile', 'o') === 'o' ? 'o' : 'smile',
      handR: [5.6, -12.6], bendR: .8, ganga: 1 });
    if (t > GO && hit > 0) shockRing(540, 1890 - 15 * 40, 300 + (1 - hit) * 500, hit, 'hring', '#FFF2C0', 1);
    camEnd();
    caps(t);
  }

  // ================= I · bare hands =================
  const HEAP = [[680, 1610, -1.35, 0], [860, 1600, 1.4, 1], [770, 1530, -1.5, 2], [790, 1450, 1.45, 3]];
  function shotFight(t, lt, dur) {
    const inB = t > BRAWL && t < CLEAR + .2, sh = inB ? shakeXY(t, 7) : [0, 0];
    camBegin(560 + sh[0], 1220 + sh[1], 1.02);
    dustPlain(t);
    const bk = t < BRAWL ? 0 : t < CLEAR ? 1 : 1 - seg(t, CLEAR, CLEAR + .5);
    if (t < BRAWL + .15) {
      // the line of Danavas laughs; Rama strides in from the left and cracks his knuckles
      for (let i = 0; i < 4; i++) danava(620 + i * 120, 1620 - (i % 2) * 10, 14, { v: i, boilKey: 'fd' + i, seed: 50 + i, eyes: 'happy', mouth: 'laugh', brows: -.4, handR: [4.5, -16], bendR: .8, dy: -.2 * Math.abs(Math.sin(t * 8 + i)), lookX: -1, flip: 1 });
      const wk = ease(seg(t, STRIDE, STRIDE + .9)), x = lerp(-120, 330, wk), crack = t > STRIDE + 1.0;
      rama(x, 1630, 17, { walk: t < STRIDE + .9 ? t * 7 : 0, eyes: 'angry', brow: -1, mouth: crack ? 'smile' : 'flat', lookX: 1, hx: .3, wind: .6,
        handR: crack ? [1.2, -14.6] : undefined, handL: crack ? [-1.2, -14.4] : undefined, bendR: .9, bendL: .9, dy: crack ? -.1 * Math.sin((t - STRIDE - 1) * 30) : 0 });
    }
    if (t > CLEAR - .1) {
      // the heap: swirl-eyed Danavas piled up; Rama beside it, dusting off his hands
      HEAP.forEach(([x, y, r, v], i) => danava(x, y, 12, { v, boilKey: 'fh' + i, seed: 60 + i, rot: r, eyes: 'swirl', mouth: 'wobble', sword: false, armR: undefined, noShadow: i > 1 }));
      const dust = Math.sin(t * 16) > 0;
      rama(350, 1630, 18, { eyes: 'happy', mouth: 'smile', hx: .2, handR: [dust ? 1.4 : .4, -12.6], handL: [dust ? -.4 : -1.4, -12.2], bendR: .8, bendL: .8, wind: .4 });
      boilSeed('fstars'); for (let i = 0; i < 4; i++) { const a = t * 4 + i * 1.6; paint(starPts(780 + Math.cos(a) * 90, 1330 + Math.sin(a) * 26, 14, .4, 5), { wash: '#FFE36A', ink: P2.ink, sw: .6 }); }
    }
    brawlCloud(600, 1470, 330, t, bk, 'brawl');
    if (t > 49.0 && t < 50.4) { const k = seg(t, 49.0, 50.4); push(); translate(lerp(700, 1250, k), lerp(1300, 700, k) + 300 * k * k); rotate(k * 14); club(22, 1.2); pop(); }
    camEnd();
    caps(t);
    if (lt < .2) flash(.4 * (1 - lt / .2), '#FFF6DA');
    wipeOut(lt, dur, GOLD);
  }

  // ================= J · the touch =================
  const JR = [575, 1650, 20], JS = [770, 1600, 25];
  function shotTouch(t, lt, dur) {
    camBegin(670, 1330 - lt * 4, 1.3 + .015 * lt);
    tapasSet(t, { sky: SKY_GOLD });
    const reach = ease(seg(t, TOUCH - .6, TOUCH)), heal = seg(t, TOUCH + .2, TOUCH + 1.2), looked = t > TOUCH + 1.4;
    const ro = { sit: 1, pray: 1, bow: looked ? .05 : .45, eyes: looked ? 'look' : 'closed', lookX: .8, lookY: -.5, hx: looked ? .3 : 0, mouth: looked ? 'smile' : 'flat', lean: .4, wind: .2 };
    const [hx, hy] = naradaHead(JR[0], JR[1], JR[2], { ...RAMA, ...ro });
    // Shiva's left hand (screen left) comes to rest on Rama's head
    const target = [(hx + 6 - JS[0]) / JS[2], (hy - 3.7 * JR[2] - JS[1]) / JS[2]];
    halo(JS[0], JS[1] - 15 * JS[2], 9 * JS[2], .7, 'jhalo');
    // Shiva's body, then Rama, then Shiva's arms: his hand rests on top of Rama's head
    const so = { boilKey: 'shivaj', seed: 3, eyes: 'normal', lookX: -.9, lookY: .5, hx: -.35, mouth: 'smile', ganga: 1, lean: -.6 * reach,
      handL: reach > 0 ? [lerp(-4.6, target[0], reach), lerp(-3.8, target[1], reach)] : undefined, bendL: .6 };
    shiva(JS[0], JS[1], JS[2], { ...so, only: 'body' });
    rama(JR[0], JR[1], JR[2], ro);
    bruises(JR[0], JR[1], JR[2], { ...RAMA, ...ro }, 1 - heal, 'jbr');
    shiva(JS[0], JS[1], JS[2], { ...so, only: 'arms' });
    if (t > TOUCH) { glow(hx, hy - 40, 340 * (1 - .4 * heal), '#FFE6A0', .7 * (1 - heal * .5)); sparkleBurst(hx, hy + 120, 160, (t - TOUCH - .2) / 1.4, 'jsp', 10); }
    if (t > TOUCH + .2 && t < TOUCH + 1.4) shockRing(hx, hy - 10, 60 + heal * 300, 1 - heal, 'jring', '#FFF2C0', .4);
    camEnd();
    caps(t);
    wipeIn(lt, GOLD);
    if (lt > dur - .35) flash((lt - dur + .35) / .35 * .9, '#FFF0C8');   // the light of the touch blooms into the gifts
  }

  // ================= K · the gifts; the axe =================
  function shotGifts(t, lt, dur) {
    const caught = t > CATCH, a = t - CATCH, sh = shake(t, CATCH, .5, 14);
    camBegin(540 + sh[0], 1300 + sh[1], 1 + .012 * lt);
    tapasSet(t, { sky: SKY_GOLD, rockY: 1720 });
    const RU2 = 22, RY2 = 1700, [cx, cy] = naradaLocal(540, RY2, RU2, { ...RAMA }, 0, -14.6);
    // the weapons come down calm and gold, circle him and sink into him one by one, each with a chime
    celestialWeapons(540, 1200, 24, t, { heat: 0, key: 'cwgold', at: i => {
      const t0 = GIFTS + .1 + i * .12, t1 = GIFTS + 1.0 + i * .32, k1 = ease(seg(t, t0, GIFTS + .9)), k2 = easeIn(seg(t, t1, t1 + .5));
      if (t < t0 || k2 >= 1) return null;
      const a0 = (i - 2) * .55, fx = 540 + Math.sin(a0) * 280, fy = 1270 - Math.cos(a0) * 170 + Math.abs(i - 2) * 50 + Math.sin(t * 2.2 + i) * 8;
      const sx = lerp(fx, 540 + (i - 2) * 40, -0.4 * (1 - k1) + 0), sy = lerp(fy - 400, fy, k1);
      return [lerp(sx, cx, k2), lerp(sy, cy, k2), backOut(k1) * (1 - k2 * .9)];
    } });
    for (let i = 0; i < 5; i++) { const t1 = GIFTS + 1.5 + i * .32; if (t > t1 && t < t1 + .7) sparkleBurst(cx, cy, 90, (t - t1) / .7, 'ksp' + i, 6); }
    // one last light, alone: the axe, down a beam into his raised right hand
    const reachUp = ease(seg(t, AXE_IN + .2, AXE_IN + .8));
    const o = { eyes: t > AXE_IN ? 'look' : 'happy', lookX: t > AXE_IN && !caught ? -.4 : 0, lookY: t > AXE_IN && !caught ? -.9 : 0, mouth: caught ? 'smile' : 'O', brow: caught ? -.4 : .5, wind: .5 + .3 * (caught ? 1 : 0), aura: caught ? clamp(a * 2) : .2 + .1 * seg(t, GIFTS, AXE_IN) };
    if (caught) Object.assign(o, { axe: 'raise', axeA: -.55, axeGlow: .6 + .4 * Math.sin(t * 4), ...(() => { const tk = take(t, CATCH, 1.2); return { sq: tk.sq, dy: tk.dy }; })() });
    else if (reachUp > 0) Object.assign(o, { handR: [lerp(1.6, 3.7, reachUp), lerp(-8, -24.2, reachUp)], bendR: 1.2 });
    const hand = naradaHand(540, RY2, RU2, { ...RAMA, ...o, handR: [3.7, -24.2] }, 1);
    const falling = t > AXE_IN && !caught, k = easeIn(seg(t, AXE_IN, CATCH)), ay = lerp(380, hand[1], k);
    if (falling) { lightBeam(hand[0], hand[1], 150, clamp((t - AXE_IN) * 3), 'kbeam'); glow(hand[0] + 40, ay - 6.6 * RU2, 4.4 * RU2, '#FFE6A0', .8); }
    rama(540, RY2, RU2, o);
    // the falling axe is drawn last: a transformed parashu() drawn before him knocked him out of the frame
    if (falling && t > AXE_IN + .25) { push(); translate(hand[0], ay); rotate(-.55 + (1 - k) * .4); parashu(RU2, 1.2, {}); pop(); }
    if (caught && a < 1) shockRing(540, RY2 - 20, 140 + a * 900, 1 - a, 'kring', '#FFE6A0', .3);
    camEnd();
    caps(t);
    if (caught && a < .25) flash(.55 * (1 - a / .25), '#FFF0C8');
    if (lt < .35) flash(.9 * (1 - lt / .35), '#FFF0C8');
    wipeOut(lt, dur, GOLD);
  }

  // ================= L/M · the name; the ask =================
  function shotName(t, lt, dur) {
    const hit = t > NAME, a = t - NAME, sh = shake(t, NAME, .45, 12);
    camBegin(540 + sh[0], 1220 - lt * 5 + sh[1], 1 + .012 * lt);
    peachGround(t, 540, 1250);
    const o = { ...FISTS, handR: undefined, bendR: undefined, axe: 'hold', axeGlow: .6 + .4 * Math.sin(t * 3), eyes: blinkAt(t, 69.2) || blinkAt(t, 72.4) ? 'closed' : 'normal', brow: -.4, mouth: hit ? 'smile' : 'flat', wind: .5,
      aura: .35 + (hit ? .55 * clamp(a * 2) : 0), dy: -.12 * Math.abs(Math.sin(t * 2.6)) };
    rama(540, 1720, 27, o);
    if (hit && a < 1) shockRing(540, 1700, 140 + a * 900, 1 - a, 'nring', '#FFE6A0', .3);
    if (t > N1 && t < N1 + .7) { const [ax, ay] = parshuramaAxe(540, 1720, 27, { ...RAMA, ...o }); sparkleBurst(ax, ay, 120, (t - N1) / .7, 'nsp', 8); }
    camEnd();
    caps(t);
    if (hit && a < .2) flash(.45 * (1 - a / .2), '#FFF0C8');
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, GOLD); }
    wipeOut(lt, dur, PEACH);
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, PEACH); }
  }

  shots([[0, shotHook], [B0, shotTapas], [C0, shotWarn], [D0, shotYears], [E0, shotKailash], [F0, shotStorm], [SEND, shotSend],
    [G0, shotShrug], [H0, shotGo], [I0, shotFight], [J0, shotTouch], [K0, shotGifts], [L0, shotName], [CARD, shotCard]]);
})();
