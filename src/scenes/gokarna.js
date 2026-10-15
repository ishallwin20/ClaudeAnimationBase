// gokarna.js: "VISHNU faked a SUNSET.", a ~60 s captioned reel (no voiceover), the Gokarna legend as the sources tell it
// (STORYBOARD.md, "Facts used"). Shiva gives Ravana the Atmalinga: wherever it touches the ground, it stays. The gods
// panic, so Vishnu hides the sun to fake an early dusk; Ravana never misses his evening prayers, but he can't pray holding
// it, and can't put it down. A little brahmin boy (totally NOT Ganesha, in a fake moustache) holds it, calls him three
// times VERY fast while he prays, and sets it down: it stays forever. Ravana pulls with all twenty arms and it takes the
// shape of a cow's ear: GO-KARNA. He strikes the boy, and the Ganesha at Gokarna still has the dent. The ask: "Have you
// been to GOKARNA?" The card sells Books 1–3. Sets and props: gokarna_props.js.
// All times are video time (t); the SFX (tools/gokarna_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/gokarna_sfx.mjs)
  const TEASE = 2.7, B0 = 5.6;
  const PRAY = 5.7, GIVE = 7.0, ATMA = 8.4, RULE = 10.6, FAKE = 12.0, CATCH = 12.5, C0 = 14.0;
  const PANIC = 14.1, WALK = 16.6, SUN = 17.0, DUSK = 17.9, UP = 18.1, D0 = 19.6;
  const EVE = 19.7, WAVE = 20.4, FRET = 21.2, NOT = 23.2, LOOK = 23.8, E0 = 26.0;
  const BOY = 26.1, TOTALLY = 28.4, SLIP = 29.0, SUSPECT = 29.6, KID = 30.7, HAND = 31.4, F0 = 33.0;
  const DEAL = 33.1, RUN = 33.9, SIT = 34.6, COUNT = 35.5, N1 = 35.8, N2 = 36.0, N3 = 36.2, WAIT = 36.35, DOWN = 36.6, BOOM = 36.85, STAY = 37.9, G0 = 40.2;
  const PULL = 40.3, GRIP = 40.5, TWIST = 42.4, EAR = 42.9, FLICK = 43.6, H0 = 46.2;
  const ANGRY = 46.3, BONK = 47.1, TODAY = 48.6, I0 = 52.2;
  const ASK = 52.3, WIPE = 55.5;
  const CARD = 55.8, CARD_CAP = 55.9, COVERS = 56.1, PRICE = 56.8, LOGO = 57.1, PILL = 57.4, FOLLOW = 57.8;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  const talkK = (t, sp = 13, ph = 0) => .35 + .75 * Math.abs(Math.sin(t * sp + ph));
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const local = (wx, wy, X, Y, u) => [(wx - X) / u, (wy - Y) / u];         // world px → a rig's body space (u)
  // fretting: a nervous sway from foot to foot (no prayer, no putting it down)
  const fret = (t, k) => k <= 0 ? {} : { step: k * .5 * Math.sin(t * TAU * 1.6), dx: k * .2 * Math.sin(t * TAU * .8), rot: k * .02 * Math.sin(t * TAU * .8 + .5) };
  const DESP_E = ['closed', 'wide', 'teary', 'wide', 'wide', 'side', 'shifty', 'shifty', 'wide', 'teary'];
  const DESP_M = ['O', 'O', 'wobble', 'flat', 'wobble', 'flat', 'O', 'wobble', 'O', 'wobble'];
  const sleepy = (t) => ({ eyes: 'closed', mouth: 'O', bubble: .45 + .45 * Math.sin(t * 2.6) });

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['VISHNU faked', 480, -1, TEASE - .1 + 1, 78], ['a SUNSET.', 600, -1, TEASE - .1 + 1, 142, GOLDC],
    ["…and that's why GANESHA", 480, TEASE, B0 - TEASE - .1, 60], ['has a DENT on his head.', 580, TEASE + .4, B0 - TEASE - .5, 70, GOLDC],
    ['Shiva was so pleased, he gave', 480, PRAY, ATMA - PRAY - .1, 52], ['Ravana his own SOUL in a stone:', 560, PRAY + .4, ATMA - PRAY - .5, 52, GOLDC],
    ['the ATMALINGA.', 520, ATMA, RULE - ATMA - .1, 110, GOLDC],
    ['ONE rule:', 470, RULE, C0 - RULE - .1, 70, GOLDC], ['if it touches the ground,', 560, RULE + .4, C0 - RULE - .5, 56], ['it STAYS there. FOREVER.', 640, RULE + .8, C0 - RULE - .9, 60, GOLDC],
    ['The gods PANICKED.', 490, PANIC, WALK - PANIC - .1, 76, GOLDC], ['With it, Ravana would be UNBEATABLE.', 590, PANIC + .4, WALK - PANIC - .5, 48],
    ['So VISHNU hid the SUN', 480, WALK, D0 - WALK - .1, 66], ['to fake an early SUNSET.', 572, WALK + .4, D0 - WALK - .5, 62, GOLDC],
    ['And Ravana NEVER missed', 480, EVE, NOT - EVE - .1, 62], ['his EVENING PRAYERS.', 580, EVE + .35, NOT - EVE - .45, 80, GOLDC],
    ["He couldn't pray holding it,", 480, NOT, E0 - NOT - .1, 56], ['and could NOT put it DOWN.', 568, NOT + .35, E0 - NOT - .45, 62, GOLDC],
    ['Just then, a little', 480, BOY, TOTALLY - BOY - .1, 62], ['BRAHMIN boy walked by.', 565, BOY + .35, TOTALLY - BOY - .45, 62],
    ['(Totally NOT Ganesha.)', 520, TOTALLY, KID - TOTALLY - .1, 74, GOLDC],
    ["'KID! Hold this!", 480, KID, F0 - KID - .1, 70], ["Don't put it DOWN!'", 575, KID + .35, F0 - KID - .45, 70, GOLDC],
    ["'I'll call you THREE times.", 480, DEAL, COUNT - DEAL - .1, 56], ["Then I put it DOWN.'", 562, DEAL + .4, COUNT - DEAL - .5, 62, GOLDC],
    ['He called out three times…', 480, COUNT, STAY - COUNT - .1, 58], ['VERY fast.', 585, COUNT + .5, STAY - COUNT - .6, 104, GOLDC],
    ['It touched the ground…', 480, STAY, G0 - STAY - .1, 62], ['…and STAYED. Forever.', 572, STAY + .4, G0 - STAY - .5, 70, GOLDC],
    ['Ravana pulled with', 480, PULL, EAR - PULL - .1, 64], ['all TWENTY arms…', 572, PULL + .35, EAR - PULL - .45, 82, GOLDC],
    ["It took the shape of a COW'S EAR:", 480, EAR, H0 - EAR - .1, 52], ['GO-KARNA.', 605, EAR + .7, H0 - EAR - .8, 140, GOLDC],
    ['So he STRUCK the boy', 480, ANGRY, TODAY - ANGRY - .1, 66], ['on the head.', 572, ANGRY + .35, TODAY - ANGRY - .45, 72, GOLDC],
    ['Even TODAY, the Ganesha', 480, TODAY, I0 - TODAY - .1, 62], ['at GOKARNA', 575, TODAY + .3, I0 - TODAY - .4, 92, GOLDC], ['has a DENT on his head.', 672, TODAY + .6, I0 - TODAY - .7, 62],
    ['Have you been to', 480, ASK, WIPE - ASK + .1, 68], ['GOKARNA?', 595, ASK + .3, WIPE - ASK - .2, 124, GOLDC], ['Comment your city!', 715, ASK + .8, WIPE - ASK - .7, 62],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= A · the hook: Ravana hugging the linga, staring up as the chakra eats the sun =================
  const HX = 480, HY = 1700, HU = 23;
  const lingaHeld = (key, s = 3.5) => (u, sw) => atmalinga(0, -9.3 * u, s * u, { key });
  function shotHook(t, lt) {
    camK(t, [[0, [520, 1150, 1.1]], [B0, [520, 1140, 1.14]]]);
    hookBg(t);
    sunChakra(756, 975, 72, t, { cover: lerp(.42, .7, seg(t, 0, B0)), finger: true });
    const turn = t > TEASE + .55, heads = [];
    for (let i = 0; i < 10; i++) {
      const h = { eyes: DESP_E[i] === 'side' ? 'side' : 'wide', mouth: DESP_M[i], sweat: 1, lookX: .8, lookY: -1 };
      if (i === 0) Object.assign(h, sleepy(t));
      else if (turn) { const a = t - TEASE - .55 - i * .04; if (a > 0) Object.assign(h, { eyes: 'normal', lookX: 0, lookY: 0, mouth: 'wobble', blush: clamp(a * 3) * .9, sq: spring(t, TEASE + .55 + i * .04, 8, 20) * .15 }); }
      heads.push(h);
    }
    ravana(HX, HY, HU, { boilKey: 'rvhook', heads, ...fret(t, 1), handL: [-2.0, -11.4], handR: [2.0, -11.4], held: lingaHeld('hooklinga'), noShadow: true });
    camEnd();
    whipV(seg(t, B0 - .3, B0) * 1.2, -1, t, [GK.snow, GK.snowSky]);
    caps(t);
  }

  // ================= B · Kailash: the gift, the rule, the prankster =================
  const SX = 215, SY = 1150, SU = 20, KX = 600, KY = 1700, KU = 17;
  function shotKailash(t, lt) {
    camK(t, [[B0, [540, 980, 1.06]], [ATMA, [540, 960, 1.0]], [C0, [540, 965, 1.02]]]);
    kailashSet(t);
    // Shiva: serene; cups his hands to give; then raises one finger and wags it (the rule)
    const give = ease(seg(t, GIVE - .5, GIVE)) * (1 - ease(seg(t, GIVE + 1.2, GIVE + 1.6))), rule = ease(seg(t, RULE - .2, RULE + .2)) * (1 - ease(seg(t, FAKE - .1, FAKE + .3)));
    const so = { ...feel('serene', t), boilKey: 'kshiva', noShadow: true, eyes: t > ATMA - .4 ? 'normal' : 'closed', lookX: .9 };
    if (give > 0) { so.handL = [lerp(-4.6, -1.4, give), lerp(-3.6, -6.8, give)]; so.handR = [lerp(4.6, 1.6, give), lerp(-3.6, -6.8, give)]; so.mudra = false; }
    if (rule > 0) { so.handR = [lerp(4.6, 5.2, rule) + Math.sin(t * 14) * .5 * rule, lerp(-3.6, -14.5, rule)]; so.mudra = false; so.armR = (u, sw) => { boilSeed('kfinger'); paint(ribbon([[0, 0], [0, -1.6 * u]], .5 * u, .35 * u), { wash: SHV.skin, ink: SHV.ink, sw: sw * .6 }); }; so.mouth = 'smile'; }
    if (t > FAKE && t < C0) { so.eyes = t < CATCH + .3 ? 'wide' : 'normal'; so.mouth = t < CATCH + .3 ? 'O' : 'smile'; }
    shiva(SX, SY, SU, so);
    // the linga: in Shiva's palms, floats over, settles in Ravana's hands; the prankster's fake drop
    const sHands = give > 0 ? [(shivaHand(SX, SY, SU, so, -1)[0] + shivaHand(SX, SY, SU, so, 1)[0]) / 2, (shivaHand(SX, SY, SU, so, -1)[1] + shivaHand(SX, SY, SU, so, 1)[1]) / 2] : [SX, SY - 6.8 * SU];
    const rHold = [KX, KY - 9.6 * KU];
    const fly = ease(seg(t, GIVE, GIVE + 1.2));
    let L = fly <= 0 ? sHands : fly >= 1 ? rHold : arcPt(sHands, rHold, 220, fly);
    const dip = t < FAKE ? 0 : t < CATCH ? easeIn(seg(t, FAKE, FAKE + .22)) * 2.4 * KU : 2.4 * KU * (1 - easeOut(seg(t, CATCH, CATCH + .3)));
    L = [L[0], L[1] + dip];
    // Ravana, sitting: hands joined in prayer, then receiving
    const heads = [], got = t > GIVE + 1.05;
    for (let i = 0; i < 10; i++) {
      const h = { eyes: 'closed', mouth: 'smile', sweat: 0, tint: null };
      if (i === 0) Object.assign(h, sleepy(t), { hat: 'cap' });
      else if (t > ATMA - .1) {
        const a = t - ATMA + .1 - i * .03;
        if (a > 0) Object.assign(h, a < 1.3 ? { eyes: 'wide', mouth: 'O', sparkle: 1, lookX: -.6, lookY: .4, sq: spring(t, ATMA - .1 + i * .03, 8, 20) * .12 } : { eyes: 'happy', mouth: 'grin' });
        if (i === 9 && t > RULE + 1.0 && t < FAKE + .1) Object.assign(h, { eyes: 'sly', mouth: 'smirk', lookX: -1, lookY: .6 });
        if (t > FAKE + .05 && t < CATCH + .5 && i !== 9) Object.assign(h, { eyes: 'wide', mouth: 'O', mouthK: 1.3, sweat: 1, sq: spring(t, FAKE + .05, 9, 22) * .2, tint: RVN.angry, tintK: 0 });
        if (t > CATCH + .5 && i !== 9) Object.assign(h, { eyes: 'angry', mouth: 'teeth', lookX: 1 });
        if (i === 9 && t > FAKE) Object.assign(h, { eyes: 'happy', mouth: 'grin', emote: 'music', emoteK: 1, emoteAge: t - FAKE });
      }
      heads.push(h);
    }
    const ro = { boilKey: 'rvkail', sit: true, heads, noShadow: true };
    const recv = ease(seg(t, GIVE + .8, GIVE + 1.1));
    const lh = local(L[0], L[1], KX, KY, KU);
    ro.handL = [lerp(-.55, lh[0] - 2.0, recv), lerp(-13.4, lh[1] - 1.9, recv)];
    ro.handR = [lerp(.55, lh[0] + 2.0, recv), lerp(-13.4, lh[1] - 1.9, recv)];
    if (inW(t, FAKE, CATCH)) { ro.handL = [-4.9, -10]; ro.handR = [4.9, -10]; }
    ro.arm = (a, s, k, d) => {
      if (a === 18 && inW(t, RULE + 1.0, FAKE + .2)) { const w = ease(seg(t, RULE + 1.0, RULE + 1.4)); return { hand: [lerp(d.hand[0], lh[0] + 1.6, w), lerp(d.hand[1], lh[1] - 1.4, w)], front: true, shape: t < FAKE ? 'hold' : 'open', bend: .5 }; }
      if (inW(t, CATCH - .15, CATCH + .4) && k >= 4 && k <= 8) { const w = ease(seg(t, CATCH - .15, CATCH)) * (1 - ease(seg(t, CATCH + .15, CATCH + .4))); return { hand: [lerp(d.hand[0], lh[0] + s * (1.5 + (k - 4) * .5), w), lerp(d.hand[1], lh[1] + .6, w)], front: w > .4, shape: 'open', bend: .5 }; }
      return null;
    };
    ro.between = () => { if (got) atmalinga(L[0], L[1] + 1.4 * KU, 3.4 * KU, { key: 'klinga' }); };
    ravana(KX, KY, KU, ro);
    if (!got) atmalinga(L[0], L[1] + 1.2 * KU, lerp(2.6, 3.4, fly) * KU, { key: 'klinga', glow: 1 + .6 * Math.sin(fly * Math.PI) });
    if (t > GIVE && t < GIVE + 1.4) sparkleBurst(L[0], L[1] - 30, 50, (t - GIVE) % .45, 'kspark' + Math.floor((t - GIVE) / .45), 6);
    camEnd();
    if (lt < .3) whipV(1 - lt / .3, -1, t, [GK.snow, GK.snowSky]);
    caps(t);
    if (t > C0 - .3) { flushLetters(); brushWipe((t - (C0 - .3)) / .6, [GK.cloud, GK.sky]); }
  }

  // ================= C1 · the gods panic =================
  function shotIndra(t, lt) {
    const sh = shakeXY(t, 5);
    camK(t, [[C0, [540, 1180, 1.12]], [WALK, [540, 1160, 1.18]]], sh);
    skySet(t);
    const bite = Math.sin(t * 30) * .25;
    airavata(540, 1640, 34, { boilKey: 'airav', earOut: 1, ear: t * 9, trunk: 'up', trunkSway: Math.sin(t * 8) * .5, eyes: 'wide', sweat: 1, dx: Math.sin(t * 40) * .04,
      indra: { eyes: 'wide', mouth: 'O', vajra: 0, sweat: 1, handR: [.45 + bite * .2, -4.35 + bite * .1], handL: [-1.4, -1.6], brows: 1 } });
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [GK.cloud, GK.sky]); }
    whipV(seg(t, WALK - .3, WALK) * 1.2, 1, t, [GK.heatLt, GK.heat]);
    caps(t);
  }

  // ================= C2 + D · the road: Vishnu's chakra fakes a sunset; evening prayers, and he can't put it down =================
  const RX = 480, RY = 1700, RU = 23;
  function shotRoad(t, lt) {
    const bossW = [RX, RY - 21.2 * RU];
    camK(t, [[WALK, [540, 1000, 1.0]], [SUN, [600, 960, 1.0]], [DUSK + .3, [600, 960, 1.0]], [UP + 1.2, [540, 1000, 1.0]],
      [NOT, [540, 1000, 1.0]], [LOOK, [bossW[0] - 40, bossW[1] + 80, 1.55]], [E0, [bossW[0] - 40, bossW[1] + 80, 1.6]]]);
    const cover = ease(seg(t, SUN, DUSK)), dusk = ease(seg(t, SUN + .3, DUSK + .3));
    roadSet(t, { heat: 1, dusk, cover, finger: true });
    const walking = t < UP, fk = ease(seg(t, FRET - .3, FRET + .2));
    const wph = t * TAU * 1.6, body = walking ? { step: Math.sin(wph) * .8, dy: -.2 * Math.abs(Math.sin(wph)), rot: .02 * Math.sin(wph) } : fret(t, fk);
    const heads = [];
    for (let i = 0; i < 10; i++) {
      let h = { sweat: t < SUN ? 1 : 0 };
      if (i === 0) Object.assign(h, sleepy(t));
      else if (t < SUN + .3) Object.assign(h, { eyes: 'sleepy', mouth: 'open', mouthK: .25 + .2 * Math.abs(Math.sin(t * 7 + i)), tint: RVN.angry, tintK: .25 });
      else if (t < UP) Object.assign(h, { eyes: 'normal', mouth: 'flat', lookX: .4, lookY: -.6 });
      const u0 = UP + i * .07;   // the ten heads look up at the "sunset", left to right
      if (i > 0 && t > u0 && t < D0 + .4) Object.assign(h, { eyes: 'wide', mouth: 'O', lookX: .9, lookY: -1, sq: spring(t, u0, 9, 22) * .15, tint: null });
      if (t >= D0 + .4) {
        const w0 = WAVE + i * .08;   // prayer time! a wave of panic
        if (i > 0) Object.assign(h, { eyes: 'normal', mouth: 'smile', lookX: .6, lookY: -.8 });
        if (i > 0 && t > w0) {
          const a = t - w0;
          Object.assign(h, { eyes: a < .5 ? 'wide' : DESP_E[i], mouth: a < .5 ? 'O' : DESP_M[i], sweat: 1, lookX: a < .5 ? 0 : Math.sin(t * 2 + i) * .8, lookY: a < .5 ? 1 : -.4, sq: spring(t, w0, 9, 22) * .2 });
          if (t > FRET) h.tilt = Math.sin(t * TAU * .8 + i) * .08;
        }
        if (i === 4 && t > LOOK) {   // the BOSS: linga → the ground → the sky → us, about to cry
          const seq = t < LOOK + .6 ? { lookX: 0, lookY: 1 } : t < LOOK + 1.1 ? { lookX: .3, lookY: 1 } : t < LOOK + 1.6 ? { lookX: .8, lookY: -1 } : { lookX: 0, lookY: 0 };
          Object.assign(h, { eyes: t > LOOK + 1.6 ? 'teary' : 'wide', mouth: t > LOOK + 1.6 ? 'wobble' : 'flat', ...seq, sweat: 1 });
        }
      }
      heads.push(h);
    }
    // the noon shadow: still short and right under him, sunset or not
    boilSeed('noonshadow'); paint(ellPts(RX + (body.dx || 0) * RU, RY + 6, 4.2 * RU, .7 * RU, 20), { wash: '#6A4A3A', washOp: 90, ink: null });
    const o = { boilKey: 'rvroad', heads, noShadow: true, ...body, handL: [-2.0, -11.4], handR: [2.0, -11.4], held: lingaHeld('roadlinga') };
    // fretting: pairs of hands try to join for the prayer, and can't (the front two hold the linga)
    if (t > FRET) o.arm = (a, s, k, d) => {
      if (k < 3 || k > 6) return null;
      const w = ease(seg(t, FRET + k * .15, FRET + .3 + k * .15)) * (.6 + .4 * Math.abs(Math.sin(t * 3 + k)));
      return { hand: [lerp(d.hand[0], s * (2.6 + (k - 3) * .9), w), lerp(d.hand[1], -13.0 - (k - 3) * 1.1, w)], front: false, shape: 'open', bend: .6 };
    };
    ravana(RX, RY, RU, o);
    camEnd();
    if (lt < .3) whipV(1 - lt / .3, 1, t, [GK.heatLt, GK.heat]);
    caps(t);
    if (t > E0 - .3) { flushLetters(); brushWipe((t - (E0 - .3)) / .6, [GK.sea, GK.sand]); }
  }

  // ================= E–H · the coast: the brahmin boy, the prayers and three calls, the cow's ear, the BONK =================
  const CY = 1640, CU = 16, BU = 14, LG = [720, 1672], COW = [205, 1302, 8.5], SC = [790, 1010, 6];
  const ravX = t => kf(t, [[E0, 380], [KID, 380], [KID + .5, 470], [RUN, 470], [SIT, 300], [G0 - .5, 300], [PULL, 470]], ease);
  const bapX = t => kf(t, [[BOY, 1180], [BOY + 1.6, 770], [STAY, 770], [STAY + .5, 845]], ease);
  function batu(t, x, o = {}) {
    // Bal Bappa as the brahmin boy: the sacred thread, a fake moustache, a staff, a kamandalu with Mooshak in it;
    // o: holding (the linga), bump
    const walkP = inW(t, BOY, BOY + 1.6) ? (t - BOY) * 1.7 : inW(t, STAY, STAY + .5) ? (t - STAY) * 2 : null;
    const holding = o.holding, sq = o.sq || 0, dy = o.dy || 0;
    const bo = { boilKey: 'batu', stand: 1, held: sacredThread, eyes: o.eyes || 'normal', mouth: o.mouth || 'smile', walk: walkP, dy, sq, hx: o.hx ?? 0, trunk: o.trunk || 'rest', trunkTap: o.trunkTap || 0, seed: 3, blush: o.blush || 0, noShadow: false };
    if (holding) bo.cross = 1;
    else if (!o.noStick) bo.armL = shepherdStick;
    if (o.aL != null) bo.aL = o.aL; if (o.aR != null) bo.aR = o.aR;
    if (o.emote) Object.assign(bo, { emote: o.emote, emoteK: 1, emoteAge: o.emoteAge });
    balBappa(x, CY, BU, bo);
    kamandalu(x - 3.7 * BU, CY + dy * BU - 5.4 * BU, 2.1 * BU, t, o.peek ?? 1);
    if (holding) atmalinga(x + .1 * BU, CY + dy * BU - 7.3 * BU * (1 - sq), 3.0 * BU, { key: 'blinga' });
    const hx = clamp(bo.hx, -1, 1), top = [x - .3 * BU, CY + dy * BU - 19.3 * BU * (1 - sq)];
    if (o.bump > 0) { boilSeed('bump'); paint(ellPts(top[0], top[1] - o.bump * .5 * BU, .9 * BU * o.bump, .75 * BU * o.bump, 16), { wash: '#F79A86', fill: '#E0705A', fillOp: 60, tex: .4, ink: BAL.ink, sw: .8 }); paint(ellPts(top[0] - .25 * BU, top[1] - o.bump * .8 * BU, .2 * BU * o.bump, .12 * BU * o.bump, 8), { wash: '#FFD2C4', ink: null }); }
    if (o.stache !== false) fakeStache(x + hx * 1.4 * BU + (o.stDx || 0) * BU, CY + dy * BU - (10.9 - (o.stDy || 0)) * BU * (1 - sq), 1.6 * BU, o.stRot || 0, 'stache');
    return top;
  }
  function shotCoast(t, lt) {
    const boomSh = t > BOOM ? 18 * (1 - seg(t, BOOM, BOOM + .5)) : 0, pullSh = inW(t, GRIP + .3, TWIST + .3) ? 6 : 0, bonkSh = t > BONK ? 14 * (1 - seg(t, BONK, BONK + .35)) : 0;
    const sh = shakeXY(t, boomSh + pullSh + (t < TODAY ? bonkSh : 0));
    const bump0 = [bapX(t) - .3 * BU, CY - 19.6 * BU];
    camK(t, [[E0, [478, 1300, 1.3]], [HAND + .6, [478, 1300, 1.3]], [RUN + .3, [470, 1300, 1.1]], [COUNT, [470, 1300, 1.1]], [DOWN, [520, 1330, 1.25]], [BOOM + .6, [540, 1330, 1.25]], [G0, [560, 1320, 1.22]], [TWIST - .5, [578, 1330, 1.25]], [TWIST - .1, [LG[0], LG[1] - 50, 1.9]], [FLICK - .2, [LG[0], LG[1] - 50, 1.95]], [FLICK + .15, [500, 1300, 1.15]], [H0, [520, 1300, 1.2]], [BONK + .25, [600, 1300, 1.25]], [BONK + .6, [600, 1300, 1.25]], [TODAY, [bump0[0], bump0[1], 2.6]]], sh);
    coastSet(t);
    // the cow (the cow's-ear gag): grazing at the back; flicks its ear on cue
    nandi(COW[0], COW[1], COW[2], { boilKey: 'cow', cloth: false, garland: false, tint: '#A86A3A', tintK: .55, nod: .35 + .08 * Math.sin(t * 1.3), ear: inW(t, FLICK, FLICK + .5) ? Math.sin((t - FLICK) * 30) * .9 : 0, eyes: inW(t, FLICK, FLICK + 1.2) ? 'wide' : 'normal', lookX: t > FLICK ? .9 : 0 });
    // Shiva peeks from a cloud: counts along, then winces at the bonk
    if (t > SIT - .3) {
      const pk = ease(seg(t, SIT - .3, SIT + .2));
      const hand = Math.max(...[N1, N2, N3].map(n => Math.max(0, 1 - Math.abs(t - n - .03) / .12)));
      push(); translate(0, (1 - pk) * 60);
      shivaCloud(SC[0], SC[1], SC[2], t, { hand, wince: inW(t, BONK, BONK + 1.2), smile: t > STAY && t < BONK, look: t > BONK - .4 ? .6 : -.7 });
      pop();
    }
    // Ravana
    const X = ravX(t), running = inW(t, RUN, SIT) || inW(t, G0 - .5, PULL), praying = inW(t, SIT - .05, G0 - .45);
    const heads = [];
    const pulling = inW(t, GRIP, TWIST + .5), strain = ease(seg(t, GRIP + .3, TWIST));
    for (let i = 0; i < 10; i++) {
      let h = { sweat: 1 };
      if (i === 0 && t < BONK + .05) Object.assign(h, sleepy(t));
      else if (t < BOY + .6) Object.assign(h, { eyes: DESP_E[i], mouth: DESP_M[i] });
      else if (t < HAND) {
        Object.assign(h, { eyes: 'wide', mouth: t > KID ? 'open' : 'grin', mouthK: t > KID ? talkK(t, 12, i) : 1, lookX: 1, lookY: .3 });
        if (i === 5 && t > SUSPECT) Object.assign(h, { eyes: 'side', lookX: 1, brows: -1, mouth: 'flat', emote: '?', emoteK: 1, emoteAge: t - SUSPECT });
      } else if (t < RUN) Object.assign(h, { eyes: 'happy', mouth: 'grin', lookX: -1 });
      else if (t < WAIT) Object.assign(h, praying ? { eyes: i === 5 && t > N1 ? ['closed', 'side'] : 'closed', lookX: 1, mouth: 'open', mouthK: .3 + .3 * Math.abs(Math.sin(t * 5 + i * .7)), sweat: 0 } : { eyes: 'wide', mouth: 'O', lookX: -1, sweat: 1 });
      else if (t < PULL) Object.assign(h, { eyes: 'wide', mouth: t < DOWN + .5 ? 'open' : 'O', mouthK: 1.3, lookX: 1, lookY: .5, dy: t < DOWN + .4 ? -1.3 * easeOut(seg(t, WAIT, WAIT + .12)) : 0 });
      else if (t < TWIST + .2) Object.assign(h, { eyes: 'squeeze', mouth: 'teeth', tint: RVN.angry, tintK: .2 + .6 * strain, lookY: 1, sq: -.05 * strain });
      else if (t < ANGRY) Object.assign(h, { eyes: 'wide', mouth: 'O', lookX: .6, lookY: 1, tint: null });
      else Object.assign(h, { eyes: 'angry', mouth: 'teeth', tint: RVN.angry, tintK: .55, lookX: 1, lookY: .4 });
      if (i === 0 && t >= BONK + .05) Object.assign(h, { eyes: t < BONK + .6 ? 'wide' : 'normal', mouth: 'O', lookX: 1, bubble: 0, emote: '!?', emoteK: 1, emoteAge: t - BONK, tint: null });
      if (i === 4 && t > SIT && t < WAIT) Object.assign(h, { emote: 'music', emoteK: 1, emoteAge: t - SIT });
      if (i === 4 && t > ANGRY && t < TODAY) Object.assign(h, { emote: 'steam', emoteK: 1, emoteAge: t - ANGRY });
      heads.push(h);
    }
    const body = running ? { step: Math.sin(t * TAU * 4.5), rot: (t < SIT ? .12 : -.12), dy: -.4 * Math.abs(Math.sin(t * TAU * 4.5)) } : praying ? { sit: true } : t < HAND + .3 ? fret(t, 1) : pulling ? { rot: .04 * strain, shake: strain * .6, knock: .3 } : {};
    const ro = { boilKey: 'rvcoast', heads, ...body };
    if (t < HAND + .5) { ro.handL = [-2.0, -11.4]; ro.handR = [2.0, -11.4]; }
    if (praying) { ro.handL = [-.55, -13.4]; ro.handR = [.55, -13.4]; }   // hands joined: the evening prayers
    // the hand-over: the linga travels from his belly to the boy's; twenty hands push it over
    const hk = ease(seg(t, HAND, HAND + .45)), bX = bapX(t);
    const lingaR = [X + (ro.dx || 0) * CU, CY - 9.3 * CU], lingaB = [bX + .1 * BU, CY - 7.3 * BU];
    if (t < HAND + .45) ro.held = hk <= 0 ? lingaHeld('clinga', 3.5) : null;
    const lp = local(lerp(lingaR[0], lingaB[0], hk), lerp(lingaR[1], lingaB[1], hk), X, CY, CU);
    ro.arm = (a, s, k, d) => {
      if (inW(t, HAND - .25, HAND + .9)) {   // the thrust
        const w = ease(seg(t, HAND - .25, HAND)) * (1 - ease(seg(t, HAND + .5, HAND + .9)));
        if (a === 9 || a === 19) return { hand: [lerp(s * 2.0, lp[0] + s * 1.7, w), lerp(-11.4, lp[1] - 2, w)], front: true, shape: 'hold' };
        if (s > 0 && k >= 3 && k <= 7) { const tg = [lp[0] - 2.5 + (k - 3) * .6, lp[1] - 4.5 + (k - 3) * 1.3]; return { hand: [lerp(d.hand[0], tg[0], w), lerp(d.hand[1], tg[1], w)], front: w > .4, shape: 'open', bend: .9 }; }
      }
      if (pulling) {   // all twenty arms reach to the linga
        const L = local(LG[0], LG[1] - 2.4 * CU, X, CY, CU), w = ease(seg(t, GRIP + hash(a * 3.1) * .25, GRIP + .3 + hash(a * 3.1) * .25)) * (1 - ease(seg(t, TWIST + .25, TWIST + .5)));
        if (w > .01) { const tg = [L[0] + (hash(a * 1.7) - .5) * 1.6 + Math.sin(t * 30 + a) * .15 * strain, L[1] + (hash(a * 2.3) - .5) * 1.4 - .4]; return { hand: [lerp(d.hand[0], tg[0], w), lerp(d.hand[1], tg[1], w)], front: w > .3, shape: w > .8 ? 'fist' : 'open', bend: .6 }; }
      }
      if (a === 10 && inW(t, ANGRY + .1, TODAY)) {   // the BONK
        const top = local(bX - .3 * BU, CY - 19.4 * BU, X, CY, CU), up = ease(seg(t, ANGRY + .1, BONK - .25)), down = easeIn(seg(t, BONK - .12, BONK)), back = ease(seg(t, BONK + .5, BONK + .9));
        const hi = [top[0] - 3, top[1] - 6];
        const p = t < BONK - .12 ? [lerp(d.hand[0], hi[0], up), lerp(d.hand[1], hi[1], up)] : t < BONK + .5 ? [lerp(hi[0], top[0], down), lerp(hi[1], top[1] - .6, down)] : [lerp(top[0], d.hand[0], back), lerp(top[1] - .6, d.hand[1], back)];
        return { hand: p, front: true, shape: 'fist', bend: 1.2 };
      }
      return null;
    };
    ravana(X, CY, CU, ro);
    if (running) vanishPuff(X + (t < SIT ? 60 : -60), CY - 10, 40, (t - RUN) % .3, 'dust' + Math.floor((t - RUN) / .3), [GK.sandDk, GK.sand]);
    // the linga: in the boy's arms, set down; stays; twists
    const tw = ease(seg(t, TWIST, TWIST + .4));
    const downK = ease(seg(t, DOWN, DOWN + .25)), placed = t > DOWN + .25;
    if (placed) {
      groundCrack(LG[0], LG[1], t - BOOM, 150);
      atmalinga(LG[0], LG[1] + (t > BOOM ? 6 * easeOut(seg(t, BOOM, BOOM + .2)) : 0), lerp(3.0, 4.4, easeOut(seg(t, BOOM, BOOM + .3))) * BU, { key: 'glinga', twist: tw, glow: 1 + (t > BOOM ? 1.5 * (1 - seg(t, BOOM, BOOM + 1)) : 0), rot: pulling && t < TWIST ? Math.sin(t * 40) * .03 * strain : 0 });
    }
    // the boy
    const bo = { holding: t > HAND + .45 && !placed };
    if (t < TOTALLY) Object.assign(bo, { eyes: 'happy', mouth: 'smile' });
    if (inW(t, TOTALLY, SLIP)) Object.assign(bo, { eyes: ['normal', 'wink'], mouth: 'grin', hx: .3 });
    if (inW(t, SLIP, SLIP + .3)) Object.assign(bo, { stRot: .9 * ease(seg(t, SLIP, SLIP + .15)), stDy: -.6 * ease(seg(t, SLIP, SLIP + .15)), stDx: -.3, eyes: 'wide', mouth: 'O' });
    if (inW(t, SLIP + .3, SLIP + .6)) Object.assign(bo, { stRot: .9 * (1 - ease(seg(t, SLIP + .35, SLIP + .55))), stDy: -.6 * (1 - ease(seg(t, SLIP + .35, SLIP + .55))), stDx: -.3, trunk: 'up', eyes: 'squeeze', mouth: 'smile' });
    if (inW(t, SLIP + .6, HAND)) Object.assign(bo, { eyes: 'normal', mouth: 'smile', lookX: -.6 });
    if (t > HAND) { const a = t - HAND - .45; Object.assign(bo, { eyes: a < .5 ? 'wide' : 'happy', mouth: a < .5 ? 'O' : 'smile', sq: a > 0 && a < 1 ? spring(t, HAND + .45, 8, 18) * .15 : 0 }); }
    if (inW(t, DEAL, COUNT)) Object.assign(bo, { eyes: 'happy', mouth: 'grin', trunk: 'curl' });
    if (inW(t, COUNT, DOWN)) { Object.assign(bo, { eyes: ['normal', 'wink'], mouth: 'grin' }); bo.trunkTap = Math.max(...[N1, N2, N3].map(n => Math.max(0, 1 - Math.abs(t - n) / .1))); }
    if (inW(t, DOWN, BOOM + .4)) Object.assign(bo, { dy: .5 * Math.sin(downK * Math.PI), sq: .15 * Math.sin(downK * Math.PI), eyes: 'happy', mouth: 'smile' });
    if (inW(t, BOOM + .4, BONK)) Object.assign(bo, { eyes: 'happy', mouth: 'grin', noStick: true, aL: .5 + .3 * Math.abs(Math.sin(t * 16)), aR: .5 + .3 * Math.abs(Math.cos(t * 16)) });
    if (inW(t, STAY + .6, BONK)) Object.assign(bo, { aL: null, aR: null, eyes: t > ANGRY + .3 ? 'wide' : 'happy', mouth: t > ANGRY + .3 ? 'O' : 'smile', lookX: -1 });
    if (t > BONK) Object.assign(bo, { eyes: 'swirl', mouth: 'wobble', stache: false, sq: spring(t, BONK, 10, 18) * .3, bump: easeOut(seg(t, BONK + .05, BONK + .4)) });
    if (t > HAND - .1) bo.noStick = true;
    if (bo.aL === null) delete bo.aL; if (bo.aR === null) delete bo.aR;
    const top = batu(t, bX, bo);
    // the staff, dropped on the sand
    if (t > HAND) { boilSeed('stickdown'); inkLine([[bX + 1.5 * BU, CY + 8], [bX + 9 * BU, CY - 4], [bX + 9.8 * BU, CY - 18], [bX + 9.2 * BU, CY - 26]], 4, GK.stick, 'ink', .5); }
        if (!placed && t > DOWN) { const p = [lerp(lingaB[0], LG[0], downK), lerp(lingaB[1], LG[1], downK)]; atmalinga(p[0], p[1], 3.0 * BU, { key: 'blinga' }); }
    // the moustache flies off at the bonk
    if (t > BONK && t < BONK + 1) { const k = seg(t, BONK, BONK + 1), p = arcPt([bX, CY - 10.9 * BU], [bX + 260, CY + 10], 220, easeOut(k)); fakeStache(p[0], p[1], 1.6 * BU, k * 9, 'stachefly'); }
    // effects and words
    if (inW(t, COUNT, DOWN)) [N1, N2, N3].forEach((n, j) => sfx('RAVANA!', bX - 70 + j * 12, CY - 30 * BU - j * 56, 50 + j * 6, '#FFF5E2', t - n, { life: DOWN + .3 - n, stroke: GK.ink, sw: .22, rot: -.08 + j * .06 }));
    if (inW(t, WAIT, DOWN + .8)) { const [hx, hy] = ravanaHead(X, CY, CU, ro, 4); bubble('WAIT!!', hx, hy - 3.6 * CU, 42, t - WAIT, { life: DOWN + .8 - WAIT, tail: [hx, hy - 2.6 * CU], col: '#FFF5E2' }); }
    impact(LG[0], LG[1] - 40, t - BOOM, 140, 'boom');
    if (inW(t, TWIST, TWIST + .6)) sparkleBurst(LG[0] + 20, LG[1] - 1.2 * 4.4 * BU, 60, t - TWIST, 'twist', 8);
    if (t > BONK) bonk(top[0], top[1] - 10, t - BONK, 60, 'bonkstars');
    if (inW(t, BONK, BONK + .9)) sfx('BONK!', top[0] - 40, top[1] - 120, 84, '#E2574A', t - BONK, { life: .9, stroke: GK.ink, sw: .2 });
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [GK.sea, GK.sand]); }
    if (t > TODAY - .12) flash(seg(t, TODAY - .12, TODAY), '#FFF0C8');
    caps(t);
  }

  // ================= H2 · today: the black stone Ganesha of Gokarna, with the dent =================
  const IX = 540, IY = 1790, IU = 38;
  function shotIdol(t, lt) {
    const dent = [IX - .3 * IU, IY - 19.3 * IU];
    camK(t, [[TODAY, [dent[0], dent[1], 2.6]], [TODAY + .25, [dent[0], dent[1], 2.5]], [TODAY + 1.4, [540, 1270, 1.0]], [I0 - .4, [540, 1180, 1.12]], [I0, [540, 1170, 1.14]]]);
    sanctumSet(t);
    diya(300, 1560, 34, t, 'diyaL'); diya(780, 1560, 34, t, 'diyaR');
    stoneBappa(IX, IY, IU, { dent: .6 + .4 * Math.sin(t * 3) });
    boilSeed('idolgarland');
    for (let k = 0; k < 15; k++) { const a = Math.PI * (.12 + .76 * k / 14), x = IX + Math.cos(a) * 3.4 * IU, y = IY - 9.0 * IU + Math.sin(a) * 2.6 * IU; paint(ellPts(x, y, 13, 12, 10), { wash: k % 3 === 1 ? '#E8573A' : TK.marigold, ink: GK.ink, sw: .5 }); }
    camEnd();
    if (lt < .25) flash(1 - lt / .25, '#FFF0C8');
    caps(t);
    if (t > I0 - .3) { flushLetters(); brushWipe((t - (I0 - .3)) / .6, [GK.dusk, GK.duskTop]); }
  }

  // ================= I · the ask: a sunset at Gokarna =================
  function shotAsk(t, lt) {
    camK(t, [[I0, [540, 1180, 1.0]], [CARD, [540, 1190, 1.04]]]);
    sunsetSet(t);
    // far away, Ravana walks home with empty hands, ten heads drooping
    const fx = lerp(560, 930, seg(t, I0, CARD)), ph = t * TAU * 1.5;
    ravana(fx, 1352, 5.2, { boilKey: 'rvfar', all: { eyes: 'sleepy', mouth: 'frown', sweat: 0, tint: null }, heads: [{ eyes: 'closed', mouth: 'O' }], step: Math.sin(ph) * .8, dy: -.2 * Math.abs(Math.sin(ph)), handL: [-4.9, -9.2], handR: [4.9, -9.2], arm: (a, s, k, d) => (a === 9 || a === 19) ? { shape: 'open' } : null, noShadow: true });
    // Bappa with an ice bag on his bump; Mooshak fans him with a leaf
    const bx = 400, by = 1560, bu = 21;
    balBappa(bx, by, bu, { ...feel('relieved', t), boilKey: 'askbappa', eyes: 'happy', mouth: 'smile', trunk: 'curl', blush: .5 });
    boilSeed('askbump'); paint(ellPts(bx - .3 * bu, by - 17.0 * bu, .9 * bu, .7 * bu, 14), { wash: '#F79A86', ink: BAL.ink, sw: .8 });
    iceBag(bx - .3 * bu + Math.sin(t * 2) * 3, by - 16.6 * bu, 2.4 * bu, t);
    const fan = Math.sin(t * 9);
    mooshak(650, 1572, 10, { boilKey: 'askmoo', eyes: 'happy', mouth: 'smile', aR: 1.0 + fan * .4, aL: -.7 });
    boilSeed('leaf'); const lx = 650 + (1.5 + Math.cos(1 + fan * .4) * 1.4) * 10, ly = 1572 - (2.7 + Math.sin(1 + fan * .4) * 1.4) * 10;
    paint([[lx, ly], [lx - 60 + fan * 20, ly - 70], [lx - 10 + fan * 20, ly - 110], [lx + 25, ly - 40]], { wash: GK.palm, ink: GK.ink, sw: .7, curv: .5 });
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [GK.dusk, GK.duskTop]); }
    caps(t);
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [TK.marigold, TK.rkOrange]); }
  }

  // ================= the card =================
  function shotCard(t, lt) {
    rkCard3(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(200, 740, k), lerp(1100, 840, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [TK.marigold, TK.rkOrange]); }
  }

  shots([[0, shotHook], [B0, shotKailash], [C0, shotIndra], [WALK, shotRoad], [E0, shotCoast], [TODAY, shotIdol], [I0, shotAsk], [CARD, shotCard]]);
})();
