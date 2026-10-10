// heads.js: "Imagine waking up as RAVANA", a ~61.6 s captioned reel. Ravana's morning with TEN heads (each a
// personality): one alarm and twenty hands, 320 teeth and one mirror, ten mouths and one stomach, one sneeze = ten,
// ten opinions and one door. Then the real story (Valmiki Ramayana, Uttara Kanda): he offered his heads into the
// sacred fire for Brahma's boon, asked that NOBODY could kill him, and left out humans ("like GRASS to me"). Guess who
// was human: RAMA. Many say the ten heads are ten bad habits; that's why on Dussehra we burn all ten. The ask: "Which
// head are YOU in the MORNING?" The card sells Books 1–3. Storyboard: STORYBOARD.md. Sets and effects:
// heads_props.js. All times are video time (t); the SFX (tools/heads_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/heads_sfx.mjs)
  const TEN = 2.7, PEEK = 1.4, RING = 4.4, WAKE = 4.7, REACH = 5.1, SMASH = 6.5, NINE = 7.3, YELL = 8.4, C0 = 9.5;
  const BRUSH = 9.6, MIRROR = 12.0, SHOVE = 12.9, FIB = 13.4, D0 = 14.6;
  const TRAY = 14.7, GOBBLE = 15.2, MINE = 16.4, SWELL = 16.9, UGH = 17.4, BURP0 = 18.2, E0 = 20.8;
  const SNIFF = 21.0, AH = 21.4, ACHOO = 22.8, CROWN = 24.0, CLANK = 24.8, F0 = 25.6;
  const OPIN = 25.7, SHOUT0 = 25.9, DOOR = 28.0, SMACK1 = 28.5, SMACK2 = 29.4, SQUEEZE = 29.8, POP0 = 30.0, G0 = 31.4;
  const CRAZY = 31.5, PEN = 33.6, OFFER0 = 34.0, BRAHMA = 36.8, RESTORE = 38.0, WISH = 39.0, GRASS = 41.4, FLICK = 42.0, HUMAN = 43.6, RAMA = 44.2, H0 = 46.0;
  const BAD = 46.1, TAGS = 48.4, BURN = 51.0, FW = 51.2, I0 = 53.6;
  const ASK = 53.7, WIPE = 56.8;
  const CARD = 57.1, CARD_CAP = 57.2, COVERS = 57.4, PRICE = 58.1, LOGO = 58.4, PILL = 58.7, FOLLOW = 59.1;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  const talkK = (t, sp = 13, ph = 0) => .35 + .75 * Math.abs(Math.sin(t * sp + ph));
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const wake = i => WAKE + (i - 1) * .13;                                   // head i (1..9) wakes; 0 never does
  const ACHOO_ORDER = [0, 1, 2, 3, 4, 6, 7, 8, 9];                          // head 5 goes last, biggest
  const achooT = i => i === 5 ? CROWN : ACHOO + ACHOO_ORDER.indexOf(i) * .12;
  const OFFER_ORDER = [9, 0, 8, 1, 7, 2, 6, 3, 5];                          // the boss (4) is the last head left
  const offerT = i => { const j = OFFER_ORDER.indexOf(i); return j < 0 ? 1e9 : OFFER0 + j * .26; };
  const SHOUTS = ['SLEEP!', 'FOOD!', 'SELFIE!', 'FIGHT!', 'FOLLOW ME!', 'WHY HIM?', 'MINE!', "I'M SICK!", 'NO.', 'HAHA!'];
  const TAGW = ['LAZY', 'GREEDY', 'SHOW-OFF', 'ANGRY', 'EGO', 'JEALOUS', 'SELFISH', 'LIAR', 'STUBBORN', 'MEAN'];
  const NAMES = ['SLEEPY', 'HUNGRY', 'SHOW-OFF', 'ANGRY', 'BOSS', 'SIDE-EYE', 'MINE!', 'FIBBER', 'STUBBORN', 'PRANKSTER'];
  const local = (wx, wy, X, Y, u) => [(wx - X) / u, (wy - Y) / u];         // world px → Ravana's body space (u)

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['Imagine waking up as', 500, -1, TEN - .1 + 1, 62], ['RAVANA.', 618, -1, TEN - .1 + 1, 132, GOLDC],
    ['TEN heads.', 500, TEN, REACH - TEN - .1, 84], ['ONE alarm.', 610, TEN + .35, REACH - TEN - .45, 96, GOLDC],
    ['TWENTY hands grabbed it.', 520, REACH, NINE - REACH - .1, 64],
    ['Nine heads woke up.', 500, NINE, C0 - NINE - .1, 64], ['One did NOT.', 600, NINE + .5, C0 - NINE - .6, 88, GOLDC],
    ['Then: brushing', 480, BRUSH, MIRROR - BRUSH - .1, 62], ['320 TEETH.', 590, BRUSH + .35, MIRROR - BRUSH - .45, 104, GOLDC],
    ['With ONE mirror.', 500, MIRROR, D0 - MIRROR - .1, 84, GOLDC],
    ['Ten mouths.', 480, TRAY, SWELL - TRAY - .1, 80], ['ONE stomach.', 590, TRAY + .4, SWELL - TRAY - .5, 100, GOLDC],
    ['HUNGRY ate 50 laddoos…', 480, SWELL, E0 - SWELL - .1, 66], ['…NINE heads got', 580, SWELL + .7, E0 - SWELL - .8, 66, GOLDC], ['the tummy ache.', 665, SWELL + .8, E0 - SWELL - .9, 66, GOLDC],
    ['One sneeze…', 500, SNIFF, ACHOO + .2 - SNIFF, 84],
    ['…= TEN sneezes.', 560, ACHOO + .2, F0 - ACHOO - .3, 100, GOLDC],
    ['Ten heads.', 480, OPIN, DOOR - OPIN - .1, 80], ['TEN opinions.', 585, OPIN + .35, DOOR - OPIN - .45, 96, GOLDC],
    ["He couldn't even", 480, DOOR, G0 - DOOR - .1, 70], ['fit through a DOOR.', 580, DOOR + .3, G0 - DOOR - .4, 88, GOLDC],
    ["But here's the CRAZY part:", 480, CRAZY, PEN - CRAZY - .1, 56], ['he GAVE them away.', 572, CRAZY + .4, PEN - CRAZY - .5, 82, GOLDC],
    ['Every 1000 years,', 480, PEN, BRAHMA - PEN - .1, 60], ['ONE head into the sacred fire.', 568, PEN + .4, BRAHMA - PEN - .5, 54, GOLDC],
    ['Before the last one…', 478, BRAHMA, WISH - BRAHMA - .1, 58], ['BRAHMA appeared.', 568, BRAHMA + .35, WISH - BRAHMA - .45, 84, GOLDC],
    ['His wish: NOBODY can kill me.', 478, WISH, GRASS - WISH - .1, 52], ['No god. No demon. No snake.', 562, WISH + .6, GRASS - WISH - .7, 52, GOLDC],
    ["'Humans? Pfft.'", 478, GRASS, HUMAN - GRASS - .1, 66], ["'They're like GRASS to me.'", 570, GRASS + .45, HUMAN - GRASS - .55, 62, GOLDC],
    ['Guess who was HUMAN?', 500, HUMAN, H0 - HUMAN - .15, 66], ['RAMA.', 640, RAMA, H0 - RAMA - .15, 160, GOLDC],
    ['Many say the ten heads are', 480, BAD, TAGS - BAD - .1, 54], ['TEN bad habits.', 575, BAD + .4, TAGS - BAD - .5, 92, GOLDC],
    ["That's why on", 470, BURN, I0 - BURN - .1, 58], ['DUSSEHRA', 568, BURN + .25, I0 - BURN - .35, 116, GOLDC], ['we burn ALL TEN.', 1420, BURN + .7, I0 - BURN - .8, 72],
    ['Which head are YOU', 480, ASK, WIPE - ASK + .1, 68], ['in the MORNING?', 580, ASK + .3, WIPE - ASK - .2, 92, GOLDC], ['Comment: SLEEPY? HUNGRY? ANGRY?', 1440, ASK + .8, WIPE - ASK - .7, 50],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= A+B · bed: the alarm, twenty hands, the one who did NOT wake =================
  const RX = 496, RY = 1715, RU = 29, CLK = [575, 1465];
  const SLEEPM = ['O', 'smile', 'pout', 'frown', 'flat', 'frown', 'smile', 'wobble', 'pout', 'smirk'];
  const sleepFace = (i, t) => ({ eyes: 'closed', mouth: SLEEPM[i], tilt: (i % 2 ? .1 : -.1) + Math.sin(t * 1.3 + i) * .04, sweat: 0 });
  function bedRavana(t, ask) {
    const heads = [];
    for (let i = 0; i < 10; i++) {
      let h = {};
      const awake = !ask && i > 0 && t >= wake(i);
      if (!awake) h = sleepFace(i, t);
      if (i === 0) h.bubble = .45 + .45 * Math.sin(t * 2.6);
      if (!ask && t < RING && [0, 4, 8].includes(i)) { h.emote = 'zzz'; h.emoteK = 1; h.emoteAge = t + i * .3; }
      if (!ask && i === 4 && inW(t, PEEK, PEEK + 1.1)) { h.eyes = ['closed', 'normal']; h.lookX = .3; h.brows = .6; h.mouth = 'smirk'; }
      if (awake) {
        const a = t - wake(i);
        if (a < .35) { h.eyes = 'wide'; h.mouth = 'O'; }
        h.sq = spring(t, wake(i), 7, 22) * .22;
        if (t < SMASH + .3) { const [hx] = rvHeadPos({}, i); h.lookX = clamp(((CLK[0] - RX) / RU - hx) / 5, -1, 1); h.lookY = .8; if (a > .35 && t > REACH) h.mouth = 'O'; }
        if (inW(t, SMASH, SMASH + .25)) h.eyes = 'squeeze';
        if (inW(t, SMASH + .25, NINE)) { h.eyes = 'happy'; h.mouth = 'smile'; }
        if (t > NINE + .3) { h.lookX = -1; h.lookY = 0; }
        if (i === 3 && inW(t, YELL, YELL + .75)) { h.eyes = 'angry'; h.mouth = 'open'; h.mouthK = 1.4; h.tilt = -.3; h.dx = -.9; h.emote = 'steam'; h.emoteK = 1; h.emoteAge = t - YELL; }
        if (i === 1 && t > NINE + .6) { h.mouth = 'smile'; h.lookX = -1; }
      }
      if (!ask && i === 0) {
        if (inW(t, YELL + .1, YELL + .5)) h.bubble = 0;
        h.mouth = t > YELL + .1 && t < C0 ? 'smile' : h.mouth;
      }
      if (ask) {   // the ask: a yawn wave, left to right; SLEEPY just keeps sleeping
        const y0 = ASK + .2 + i * .14, a = t - y0;
        if (i > 0) { h = {}; if (a > 0 && a < .9) { h.mouth = 'yawn'; h.mouthK = Math.sin(clamp(a / .9) * Math.PI); h.eyes = 'closed'; h.chinUp = 1; } else if (a >= .9) h.eyes = i === 3 ? 'angry' : h.eyes; }
      }
      heads.push(h);
    }
    const o = { boilKey: 'rvbed', heads, noShadow: true };
    if (!ask && t > REACH - .1) {
      const ck = local(CLK[0], CLK[1] - 10, RX, RY, RU);
      o.arm = (a, s, k, d) => {
        const go = ease(seg(t, REACH + hash(a * 3.7) * .25, REACH + .55 + hash(a * 3.7) * .25)), back = ease(seg(t, SMASH + .55, SMASH + 1.2));
        const reach = go * (1 - back);
        if (reach <= .02) return null;
        const jig = inW(t, REACH + .7, SMASH) ? .3 : 0, slam = t > SMASH ? Math.max(0, 1 - (t - SMASH) / .3) * .5 : 0;
        const tgt = [ck[0] + (hash(a * 1.3) - .5) * 5.6 + Math.sin(t * 31 + a) * jig, ck[1] + (hash(a * 2.7) - .5) * 2.6 - .9 + Math.cos(t * 27 + a * 2) * jig + slam];
        return { hand: [lerp(d.hand[0], tgt[0], reach), lerp(d.hand[1], tgt[1], reach)], front: reach > .35, shape: reach > .8 ? 'fist' : 'open', bend: .9 };
      };
    }
    o.between = () => {
      quilt(t, { top: 1395 });
      if (!ask) {
        alarmClock(CLK[0], CLK[1], 52, { ring: inW(t, RING, SMASH) ? 1 : 0, smashed: t > SMASH ? 1 : 0 });
        clockBits(CLK[0], CLK[1], t - SMASH);
      }
    };
    return o;
  }
  function shotBed(t, lt) {
    const ask = t >= I0, sh = shakeXY(t, 16 * (1 - seg(t, SMASH, SMASH + .45)) * (t > SMASH ? 1 : 0));
    if (ask) camK(t, [[I0, [540, 960, 1.0]], [WIPE, [540, 975, 1.04]]], sh);
    else camK(t, [[0, [540, 960, 1.0]], [RING, [540, 965, 1.01]], [REACH, [540, 990, 1.0]], [NINE, [540, 990, 1.0]], [NINE + .7, [330, 1080, 1.45]], [C0, [310, 1080, 1.5]]], sh);
    bedSet(t, { morning: ask ? 1 : 0 });
    ravana(RX, RY, RU, bedRavana(t, ask));
    if (!ask) {
      impact(CLK[0], CLK[1] - 20, t - SMASH, 90, 'smash');
      if (inW(t, RING, SMASH)) sfx('RIIING!', 800, 1330, 64, '#E2574A', t - RING, { life: SMASH - RING, rot: .08 });
      sfx('SMASH!', 360, 1350, 78, '#E2574A', t - SMASH, { life: .9 });
      if (inW(t, YELL + .1, YELL + .9)) { const [bx, by] = ravanaHead(RX, RY, RU, {}, 0); sparkleBurst(bx + 30, by + 30, 40, t - YELL - .1, 'bubpop', 6, ['#CDEBFA', '#FFFFFF']); }
      if (inW(t, YELL, YELL + .75)) { const [hx, hy] = ravanaHead(RX, RY, RU, {}, 3); sfx('WAKE UP!!', hx - 40, hy - 150, 46, '#FFF5E2', t - YELL, { life: .75, stroke: LK.ink, sw: .2 }); }
    } else {
      for (let i = 0; i < 10; i++) {   // name tags under every head
        const [hx, hy, r] = rvHeadPos({}, i), x = RX + hx * RU, y = RY + (hy + r) * RU + 30 + (i % 2) * 60;
        tagPill(NAMES[i], x, y, t - (ASK + 1.0 + i * .08), { size: 25, lead: [x, y - 30], ink: i === 0 || i === 1 || i === 3 ? '#B8322A' : LK.ink });
      }
    }
    camEnd();
    if (ask && lt < .35) flash(1 - lt / .35, '#FFF6DC');
    if (!ask) whipH(seg(t, C0 - .28, C0), 1, t);
    caps(t);
    if (ask && t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [TK.marigold, TK.rkOrange]); }
  }

  // ================= C · the bathroom: we ARE the mirror =================
  const MX = 540, MU = 36, MY = MIR.y - 90 + 21.2 * MU;
  const BRUSH_ARM = [1, 3, 5, 7, 19, 17, 15, 13, 11, 10];
  function shotMirror(t, lt) {
    camK(t, [[C0, [540, 960, 1.0]], [MIRROR, [540, 960, 1.02]], [D0, [540, 960, 1.04]]]);
    mirrorBack(t);
    const heads = [], go = ease(seg(t, BRUSH, BRUSH + .4)), hog = ease(seg(t, MIRROR, MIRROR + .35)) * (1 - ease(seg(t, SHOVE, SHOVE + .25)));
    for (let i = 0; i < 10; i++) {
      const h = { mouth: 'grin' };
      if (i === 0) { h.eyes = 'sleepy'; h.bubble = 0; }
      if (i === 7) h.mouth = 'grin';
      if (t > MIRROR + .2 && i !== 2) { const [hx] = rvHeadPos({}, i), [h2] = rvHeadPos({}, 2); h.lookX = clamp((h2 + 7 - hx) / 4, -1, 1); if (t < SHOVE) h.mouth = 'frown'; }
      heads.push(h);
    }
    // SHOW-OFF hogs the mirror: slides to the middle, bigger (closer), kissy; then the BOSS shoves him out
    const h2 = heads[2];
    if (hog > 0) { h2.dx = 7.1 * hog; h2.dy = -.6 * hog; h2.s = 1 + .32 * hog; h2.z = 5; h2.eyes = 'lash'; h2.mouth = 'pout'; }
    if (t > SHOVE) { const k = seg(t, SHOVE, SHOVE + .6); h2.dx = lerp(7.1, -1.2, easeOut(k)) * (1 - seg(t, SHOVE + .6, D0)); h2.tilt = Math.sin(k * 9) * .5 * (1 - k); h2.eyes = t < SHOVE + 1 ? 'swirl' : 'lash'; h2.z = 5; heads[4].eyes = 'angry'; heads[4].mouth = 'teeth'; heads[3].eyes = 'happy'; heads[3].mouth = 'open'; heads[3].mouthK = talkK(t, 14); }
    if (t > FIB) { const h7 = heads[7]; h7.eyes = 'normal'; h7.lookX = 1; h7.mouth = 'grin'; h7.brows = .7; }
    const o = { boilKey: 'rvmirror', heads, noShadow: true };
    const HP = []; for (let i = 0; i < 10; i++) HP.push(rvHeadPos(o, i));
    o.arm = (a, s, k, d) => {
      const i = BRUSH_ARM.indexOf(a); if (i < 0 || go <= 0) return null;
      const [hx, hy, r] = HP[i], side = i <= 3 ? -1 : 1, m = [hx + side * .35 * r, hy + r * .58];
      let hand = [hx + side * (r * 1.05 + .5) + Math.cos(t * 24 + i * 1.7) * .35, hy + r * .7 + Math.sin(t * 24 + i * 1.7) * .14], dry = false, up = 0;
      if (i === 2 && hog > .05) return null;
      if (i === 7) { up = ease(seg(t, FIB, FIB + .3)); hand = [hx + r * 1.3 + .4, hy + r * .3 - up * 2.4]; dry = true; }
      const H2 = [lerp(d.hand[0], hand[0], go), lerp(d.hand[1], hand[1], go)];
      const tip = dry ? [H2[0] + .3, H2[1] - 2.3] : m;
      return { hand: H2, front: true, shape: 'hold', bend: 1.1, held: (u, sw) => toothbrush([0, 0], [(tip[0] - H2[0]) * u, (tip[1] - H2[1]) * u], sw, dry) };
    };
    ravana(MX, MY, MU, o);
    for (let i = 0; i < 10; i++) {   // foam on every brushing mouth (not the fibber's)
      if (i === 7 || (i === 2 && hog > .05)) continue;
      const [hx, hy, r] = HP[i];
      foam(MX + hx * MU, MY + (hy + r * .62) * MU, r * MU * .55, seg(t, BRUSH + .3, BRUSH + 1.8), 'foam' + i);
    }
    if (t > SHOVE) { const [bx, by, br] = HP[4]; bonk(MX + (bx - br) * MU, MY + by * MU, t - SHOVE - .05, 50, 'shove'); }
    if (t > FIB) { const [hx, hy, r] = HP[7]; bubble('DONE!', Math.min(860, MX + (hx + .6) * MU), MY + (hy - r * 2.2) * MU, 48, t - FIB - .15, { tail: [MX + (hx + .3) * MU, MY + (hy - r * .9) * MU] }); }
    camEnd();
    mirrorFrame(t);
    if (lt < .25) whipH(1 - lt / .25, 1, t);
    caps(t);
    if (t > D0 - .3) { flushLetters(); brushWipe((t - (D0 - .3)) / .6, [LK.foamDk, '#FFFFFF']); }
  }

  // ================= D+E · breakfast: ten mouths, one stomach; one sneeze = ten =================
  const PILE = [600, 1478];
  function shotDine(t, lt) {
    const sh = shakeXY(t, t > CROWN ? 8 * (1 - seg(t, CROWN, CROWN + .4)) : 0);
    camK(t, [[D0, [540, 1080, 1.05]], [GOBBLE - .1, [540, 1100, 1.08]], [GOBBLE + .5, [400, 1240, 1.45]], [MINE - .5, [430, 1240, 1.45]], [MINE, [560, 1200, 1.3]], [SWELL, [540, 1150, 1.15]], [E0 - .4, [540, 1120, 1.12]], [E0, [540, 1100, 1.1]], [E0 + .7, [540, 1060, 1.25]], [ACHOO, [540, 1070, 1.28]], [CROWN, [470, 1060, 1.28]], [CLANK, [380, 1060, 1.35]], [F0, [370, 1060, 1.38]]], sh);
    dineSet(t);
    const eaten = t < MINE ? Math.floor(seg(t, GOBBLE, MINE) * (PILE_N - 1)) : PILE_N - 1 + (t > MINE + .1 ? 1 : 0);
    const heads = [], belly = easeOut(seg(t, SWELL, SWELL + .4)) + spring(t, SWELL + .4, 8, 18) * .08;
    for (let i = 0; i < 10; i++) {
      const h = {}, [hx] = rvHeadPos({}, i);
      if (i === 0 && t < CLANK) { h.eyes = 'closed'; h.mouth = 'O'; h.bubble = .45 + .45 * Math.sin(t * 2.6); }
      // breakfast: the HUNGRY head gobbles; the rest stare at him
      if (t < E0) {
        if (i === 1 && inW(t, GOBBLE, SWELL)) { h.mouth = 'chew'; h.puff = 1; h.eyes = 'happy'; }
        if (i > 1 && t > GOBBLE + .5 && t < UGH) { const [h1] = rvHeadPos({}, 1); h.lookX = clamp((h1 - hx) / 4, -1, 1); h.mouth = i === 4 ? 'teeth' : 'O'; if (i === 4) h.eyes = 'angry'; }
        if (i === 6 && inW(t, MINE + .25, SWELL + .2)) { h.mouth = 'chew'; h.puff = .8; h.eyes = 'happy'; }
        if (t > UGH && i !== 1) {
          const bt = BURP0 + i * .16, rel = seg(t, bt + .35, bt + .8);
          h.tint = RVN.sick; h.tintK = .7 * (1 - rel); h.sweat = 1 - rel;
          if (t < bt) { h.eyes = i === 0 ? 'closed' : ['x', 'swirl', 'squeeze'][i % 3]; h.mouth = 'sick'; }
        }
        if (i === 1 && t > SWELL) { h.eyes = 'happy'; h.mouth = 'smile'; h.puff = .8; }
        const bt = BURP0 + i * .16;
        if (inW(t, bt, bt + .38)) { h.mouth = 'O'; h.mouthK = 1.2; h.eyes = 'squeeze'; h.dy = -Math.sin(seg(t, bt, bt + .38) * Math.PI) * .5; h.sq = -.08; }
        if (inW(t, bt + .38, E0) && i !== 0) { h.eyes = 'happy'; h.mouth = 'smile'; }
      } else {
        // the sneeze: SIDE-EYE sniffs, the AH… wave, the ACHOO wave, the big one blows the BOSS's mukut onto SLEEPY
        const ah = ease(seg(t, AH + Math.abs(i - 5) * .06, ACHOO - .1)), at = achooT(i);
        if (i === 5 && inW(t, SNIFF, AH)) { h.eyes = 'squeeze'; h.mouth = 'O'; h.mouthK = .4; h.chinUp = 1; h.dy = -.15 * Math.sin(t * 30); }
        if (t >= AH && t < at) { h.chinUp = 1; h.dy = -.4 * ah; h.mouth = 'O'; h.mouthK = .3 + .7 * ah; h.eyes = i === 0 ? 'closed' : 'squeeze'; if (i === 5 && t > ACHOO) { h.dy = -.4 - .5 * ease(seg(t, ACHOO + 1, CROWN)); h.mouthK = 1.3; } }
        if (inW(t, at, at + .3)) { h.mouth = 'open'; h.mouthK = 1.3; h.eyes = 'squeeze'; h.dy = .5 * (1 - seg(t, at, at + .3)); h.sq = spring(t, at, 9, 22) * .18; }
        if (inW(t, at + .3, at + .6)) h.eyes = 'swirl';
        if (i === 4 && t > CROWN) { h.hat = 'none'; h.eyes = t < CROWN + .7 ? 'wide' : 'angry'; h.mouth = t < CROWN + .7 ? 'O' : 'teeth'; h.lookX = -1; }
        if (i === 0 && t > CLANK) { h.hat = 'mukut'; h.eyes = t < CLANK + .3 ? 'wide' : 'happy'; h.mouth = 'grin'; h.s = 1 + .08 * ease(seg(t, CLANK + .3, CLANK + .6)); h.sparkle = 1; h.bubble = 0; h.sq = spring(t, CLANK, 9, 20) * .2; }
        if (t > CLANK + .4 && i > 0 && i !== 4) { h.lookX = -1; h.eyes = h.eyes === 'swirl' ? 'normal' : h.eyes; }
      }
      heads.push(h);
    }
    const o = { boilKey: 'rvdine', heads, noShadow: true };
    const HP = []; for (let i = 0; i < 10; i++) HP.push(rvHeadPos(o, i));
    const pileTop = local(PILE[0], PILE[1] - 40 - Math.max(0, 6 - Math.floor(eaten / 4)) * 30, RX, RY, RU);
    o.arm = (a, s, k, d) => {
      // two arms feed the HUNGRY head, turn about
      if ((a === 3 || a === 5) && inW(t, GOBBLE - .3, MINE)) {
        const ph = frac((t - GOBBLE) / .42 + (a === 5 ? .5 : 0)), m = [HP[1][0] + .4, HP[1][1] + HP[1][2] * .6];
        const p = ph < .5 ? arcPt(pileTop, m, 2.5, ease(ph * 2)) : arcPt(m, pileTop, 1.2, ease((ph - .5) * 2));
        const w = ease(seg(t, GOBBLE - .3, GOBBLE));
        return { hand: [lerp(d.hand[0], p[0], w), lerp(d.hand[1], p[1], w)], front: true, shape: 'hold', bend: 1, held: ph < .5 ? (u, sw) => laddoo(0, -u * .5, u * .7) : null };
      }
      // MINE! grabs the last one
      if (a === 12 && inW(t, MINE - .45, SWELL + .1)) {
        const m = [HP[6][0] - .3, HP[6][1] + HP[6][2] * .6], k1 = ease(seg(t, MINE - .45, MINE)), k2 = ease(seg(t, MINE, MINE + .3));
        const p = t < MINE ? [lerp(d.hand[0], pileTop[0] + .8, k1), lerp(d.hand[1], pileTop[1] + 1.5, k1)] : arcPt([pileTop[0] + .8, pileTop[1] + 1.5], m, 2, k2);
        return { hand: p, front: true, shape: 'hold', bend: 1, held: t < MINE + .3 ? (u, sw) => laddoo(0, -u * .5, u * .7) : null };
      }
      // the HUNGRY head pats the belly
      if (a === 9 && t > SWELL + .3 && t < E0) return { hand: [-1.6, -11.2 + Math.abs(Math.sin(t * 7)) * .5], shape: 'open', front: true };
      return null;
    };
    if (belly > 0) o.held = (u, sw) => {
      boilSeed('belly');
      paint(ellPts(0, -11.2 * u, (4.2 + 1.1 * belly) * u, (2.9 + 1.0 * belly) * u, 26), { wash: RVN.vest, fill: RVN.vestDk, fillOp: 40, tex: .4, ink: RVN.ink, sw: sw * .8 });
      paint(rectPts(-.6 * u, -14.1 * u, 1.2 * u, 5.6 * u), { wash: RVN.gold, ink: RVN.ink, sw: sw * .4 });
      if (t < SWELL + .3) for (const k of [-13, -11.5]) paint(ellPts(0, k * u, .26 * u, .26 * u, 10), { wash: RVN.ruby, ink: RVN.ink, sw: sw * .4 });
    };
    o.between = () => { dineTable(t); laddooPile(PILE[0], PILE[1], PILE_N - eaten, 25); };
    ravana(RX, RY, RU, o);
    // the buttons ping off; burps; sneezes; pepper
    if (t > SWELL + .3) for (let k = 0; k < 2; k++) { const a = t - SWELL - .3; if (a < 1) { const [cx, cy] = ravanaChest(RX, RY, RU); paint(ellPts(cx + (k ? 1 : -1) * 260 * a, cy - 30 + (-500 * a + 900 * a * a), 8, 8, 8), { wash: RVN.ruby, ink: RVN.ink, sw: .5 }); } }
    for (let i = 0; i < 10; i++) {
      const [hx, hy, r] = HP[i], mx = RX + hx * RU, my = RY + (hy + r * .7) * RU;
      vanishPuff(mx, my - 20, 34, t - (BURP0 + i * .16) - .05, 'burp' + i, ['#D8EAB8', '#B8D890']);
      if (t > E0) vanishPuff(mx, my + 10, i === 5 ? 80 : 44, t - achooT(i) - .02, 'sneeze' + i, ['#FFFFFF', '#DDEFFF']);
    }
    if (inW(t, SNIFF - .4, AH + .4)) { boilSeed('pepper'); const [hx, hy] = HP[5]; for (let k = 0; k < 6; k++) { const a = t - SNIFF + .4 + k * .1; paint(ellPts(RX + (hx + .6 + Math.sin(a * 4 + k) * .5) * RU, RY + (hy + 2 - a * 1.6) * RU, 4, 4, 6), { wash: '#3A2A20', ink: null }); } }
    if (t > CROWN && t < CLANK + .02) {   // the mukut flies from the BOSS to SLEEPY
      const k = seg(t, CROWN, CLANK), [bx, by] = ravanaHead(RX, RY, RU, o, 4), [zx, zy] = ravanaHead(RX, RY, RU, o, 0), p = arcPt([bx, by], [zx, zy], 260, ease(k));
      boilSeed('flycrown'); push(); translate(p[0], p[1]); rotate(-k * TAU * 1.5); rvHat('mukut', HP[4][2] * RU, 1.3); pop();
    }
    if (t > CLANK) { const [zx, zy, ] = ravanaHead(RX, RY, RU, o, 0); bonk(zx, zy - HP[0][2] * RU * 1.2, t - CLANK, 50, 'clank'); }
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [LK.foamDk, '#FFFFFF']); }
    whipH(seg(t, F0 - .28, F0), 1, t);
    caps(t);
  }

  // ================= F · ten opinions, one door =================
  const DPOP = [4, 3, 5, 2, 6, 1, 7, 0, 9, 8];
  const dpopT = i => i === 8 ? POP0 + 1.0 : POP0 + DPOP.indexOf(i) * .09;
  function shotDoor(t, lt) {
    const sh = shakeXY(t, (t > SMACK1 ? 12 * (1 - seg(t, SMACK1, SMACK1 + .35)) : 0) + (t > SMACK2 ? 14 * (1 - seg(t, SMACK2, SMACK2 + .35)) : 0));
    camK(t, [[F0, [540, 1215, 1.75]], [DOOR, [540, 1225, 1.8]], [DOOR + .45, [540, 990, 1.0]], [SQUEEZE, [540, 975, 1.02]], [G0, [540, 990, 1.0]]], sh);
    // where he is: far in the room, rushing the door, bounced, again, squeezed through
    const u = kf(t, [[F0, 15], [DOOR, 15], [SMACK1, 27], [SMACK1 + .45, 23], [SMACK2 - .25, 23], [SMACK2, 27], [SQUEEZE, 27], [SQUEEZE + .35, 36], [G0, 37]], ease);
    const fy = kf(t, [[F0, 1560], [DOOR, 1560], [SMACK1, 1700], [SMACK1 + .45, 1660], [SMACK2 - .25, 1660], [SMACK2, 1700], [SQUEEZE, 1700], [SQUEEZE + .35, 1880], [G0, 1890]], ease);
    const lurch = t < DOOR ? Math.sin(t * 4.6) * 1.4 : 0, through = t > SQUEEZE + .12;
    const squeeze = t < SMACK2 + .2 ? 0 : ease(seg(t, SMACK2 + .2, SQUEEZE));
    const heads = [];
    for (let i = 0; i < 10; i++) {
      const h = {}, [bx] = rvHeadPos({}, i);
      if (i === 0) { h.hat = 'mukut'; h.eyes = 'happy'; h.mouth = 'grin'; }
      if (i === 4) { h.hat = 'none'; h.eyes = 'angry'; h.mouth = 'teeth'; }
      const st = SHOUT0 + i * .15;
      if (inW(t, st, DOOR)) { h.mouth = 'open'; h.mouthK = talkK(t, 12, i); }
      // the smacks: the heads outside the doorway hit the frame
      for (const sm of [SMACK1, SMACK2]) if (inW(t, sm, sm + .5) && Math.abs((bx + lurch) * u) > 270) { h.sq = .25 * (1 - seg(t, sm, sm + .5)); h.eyes = 'x'; h.mouth = 'O'; h.tilt = Math.sign(bx) * .3 * (1 - seg(t, sm, sm + .5)); }
      if (squeeze > 0 && t < SQUEEZE + .5) { h.eyes = 'squeeze'; h.mouth = 'teeth'; }
      // through: each head pops back out to its place
      if (t > SQUEEZE) { const pk = backOut(clamp((t - dpopT(i)) / .3)); h.dx = bx * (lerp(.28, 1, pk) - .28); if (pk < .05) h.eyes = 'squeeze'; else if (t < dpopT(i) + .4) { h.eyes = 'wide'; h.mouth = 'O'; } }
      if (i === 8 && t > POP0 + .45) { h.eyes = 'shut'; h.mouth = 'pout'; h.chinUp = 1; }
      heads.push(h);
    }
    const o = { boilKey: 'rvdoor', heads, spread: t > SQUEEZE ? .28 : lerp(1, .28, squeeze), dx: lurch, rot: t < DOOR ? Math.sin(t * 4.6 + 1) * .04 : 0, noShadow: true };
    if (inW(t, OPIN, DOOR + .3)) o.arm = (a, s, k, d) => {   // ten directions at once
      const ang = hash(a * 4.1) * TAU, w = ease(seg(t, OPIN + hash(a) * .5, OPIN + .4 + hash(a) * .5)) * (1 - ease(seg(t, DOOR, DOOR + .3)));
      const tgt = [s * 3 + Math.cos(ang) * 7, -14.5 + Math.sin(ang) * 5.5 - 1];
      return { hand: [lerp(d.hand[0], tgt[0], w), lerp(d.hand[1], tgt[1], w)], shape: w > .5 ? 'point' : d.shape, bend: .9 };
    };
    doorRoom(t);
    if (!through) { ravana(540, fy, u, o); doorWall(t); }
    else { doorWall(t); ravana(540, fy, u, o); }
    for (const sm of [SMACK1, SMACK2]) for (const sd of [-1, 1]) bonk(sd < 0 ? DOORWAY.x0 : DOORWAY.x1, fy - 20.5 * u, t - sm, 60, 'smk' + sm + sd);
    // the opinions
    for (let i = 0; i < 10; i++) {
      const [hx, hy, r] = rvHeadPos(o, i), x = 540 + (hx + lurch) * u, y = fy + (hy - r) * u - (i % 2 ? 105 : 50);
      bubble(SHOUTS[i], x, y, 19, t - (SHOUT0 + i * .15), { life: DOOR - (SHOUT0 + i * .15), tail: [x, fy + (hy - r * .6) * u] });
    }
    if (t > POP0 - .1) for (let i = 0; i < 10; i++) { const [hx, hy] = rvHeadPos(o, i); sparkleBurst(540 + hx * u, fy + hy * u, 50, t - dpopT(i), 'dpop' + i, 6); }
    if (t > POP0 + .45) { const [hx, hy, r] = rvHeadPos(o, 8); bubble('NO.', clamp(540 + hx * u, 140, 880), fy + (hy - r * 2.1) * u, 44, t - POP0 - .45, { tail: [540 + hx * u, fy + (hy - r) * u] }); }
    camEnd();
    if (lt < .25) whipH(1 - lt / .25, 1, t);
    caps(t);
    if (t > G0 - .3) { flushLetters(); brushWipe((t - (G0 - .3)) / .6, [LK.sepia, '#8A6A4A']); }
  }

  // ================= G · long ago: the heads into the fire; Brahma; "humans? like GRASS" =================
  const GX = 520, GY = 1500, GU = 23, FIRE = [540, 1535], BRX = 540, BRY = 905, BRS = .95;
  function shotPenance(t, lt) {
    camK(t, [[G0, [540, 960, 1.04]], [PEN, [540, 975, 1.0]], [BRAHMA, [540, 960, 1.0]], [WISH, [540, 975, 1.04]], [HUMAN, [540, 980, 1.06]]]);
    penanceSet(t, { lapse: inW(t, PEN, BRAHMA) ? Math.min(seg(t, PEN, PEN + .3), 1 - seg(t, BRAHMA - .3, BRAHMA)) : 0, lapseT: t - PEN });
    if (t > BRAHMA) {   // Brahma appears in gold light above the fire
      const k = backOut(clamp((t - BRAHMA) / .45));
      push(); translate(BRX, BRY); scale(k); translate(-BRX, -BRY);
      brahma(BRX, BRY, BRS, { eyes: t < BRAHMA + .5 ? 'closed' : 'normal', lookX: t > FLICK ? 1 : -.4, brows: t > FLICK ? .8 : 0, bless: inW(t, WISH + .6, GRASS) ? ease(seg(t, WISH + .6, WISH + 1)) : 0, glow: 1 });
      pop();
      sparkleBurst(BRX, BRY - 120, 140, t - BRAHMA, 'brin', 10);
    }
    const restored = i => t > RESTORE + Math.abs(i - 4) * .07;
    const heads = [];
    for (let i = 0; i < 10; i++) {
      const h = { hat: 'none', tint: null, sweat: 0, sparkle: 0, crumbs: 0, puff: 0, curl: 0, goldTooth: 0 };
      if (t < BRAHMA + .3) { h.eyes = 'closed'; h.mouth = 'smile'; h.chinUp = 0; }
      if (t > offerT(i) && !restored(i)) h.hide = true;
      if (i === 4 && inW(t, BRAHMA + .3, RESTORE)) { h.eyes = 'wide'; h.mouth = 'O'; h.lookY = -1; h.lookX = .1; h.brows = 1; }
      if (restored(i)) { const a = t - (RESTORE + Math.abs(i - 4) * .07); h.s = i === 4 ? 1 : backOut(clamp(a / .3)); if (a < .5) { h.eyes = 'wide'; h.mouth = 'O'; } }
      if (inW(t, WISH, GRASS)) { h.mouth = 'open'; h.mouthK = talkK(t, 11, i * 1.3); h.lookY = -.6; }
      if (inW(t, GRASS, FLICK + .05) && i === 4) { h.eyes = 'normal'; h.mouth = 'smirk'; h.brows = .5; h.lookX = -.6; h.lookY = .6; }
      if (t > FLICK + .05) { h.eyes = 'happy'; h.mouth = 'open'; h.mouthK = talkK(t, 15, i); h.dy = -Math.abs(Math.sin(t * 13 + i)) * .3; }
      if (i === 0 && t > RESTORE + .5) { h.hat = 'cap'; }
      heads.push(h);
    }
    const o = { boilKey: 'rvpen', young: true, sit: true, heads, noShadow: true, handL: [-2.4, -4.2], handR: [2.4, -4.2] };
    // counting Brahma's heads; plucking the grass; flicking it
    if (inW(t, BRAHMA + .3, RESTORE)) {
      const tgts = [[-1.15, -6.9], [0, -7.2], [1.15, -6.9]], j = clamp(Math.floor((t - BRAHMA - .35) / .27), 0, 2);
      const tw = local(BRX + tgts[j][0] * 30 * BRS, BRY + tgts[j][1] * 30 * BRS, GX, GY, GU), w = ease(seg(t, BRAHMA + .3, BRAHMA + .5));
      o.handR = [lerp(2.4, tw[0] * .55 + 1.5, w), lerp(-4.2, tw[1] * .55 - 8, w)];
      o.arm = (a, s, k, d) => a === 19 ? { shape: 'point', front: true } : null;
    }
    let grassAt = null;
    if (t > GRASS - .1) {
      const pl = ease(seg(t, GRASS - .1, GRASS + .2)), up = ease(seg(t, GRASS + .25, FLICK - .1)), fl = seg(t, FLICK - .1, FLICK + .1);
      const hand = up > 0 ? [lerp(-6.0, -4.2, up), lerp(-.6, -16.5, up) - fl * .8] : [lerp(-2.4, -6.0, pl), lerp(-4.2, -.6, pl)];
      o.handL = t > FLICK + .4 ? [lerp(hand[0], -2.4, ease(seg(t, FLICK + .4, FLICK + .9))), lerp(hand[1], -4.2, ease(seg(t, FLICK + .4, FLICK + .9)))] : hand;
      o.arm = (a, s, k, d) => a === 9 ? { shape: t < FLICK ? 'hold' : 'open', front: true, held: t < FLICK && pl > .9 ? (u, sw) => grassBlade(0, -u * 1.0, u * 2.2, -.2) : null } : null;
      if (t > FLICK) grassAt = seg(t, FLICK, HUMAN);
    }
    ravana(GX, GY, GU, o);
    // the heads float to the fire, one every 0.26 s, and puff into it
    let flare = 0;
    for (const i of OFFER_ORDER) {
      const t0 = offerT(i), k = seg(t, t0, t0 + .5);
      if (t > t0 && k < 1 && !restored(i)) {
        const [hx, hy, r] = rvHeadPos({}, i), p = arcPt([GX + hx * GU, GY + hy * GU], [FIRE[0], FIRE[1] - 60], 120, easeIn(k) * .7 + k * .3);
        ravanaLoneHead(p[0], p[1], r * GU * (1 - .55 * k), i, { hat: 'none', tint: null, sweat: 0, sparkle: 0, crumbs: 0, puff: 0, eyes: 'closed', mouth: 'smile', tilt: Math.sin(k * 6) * .3 }, { boilKey: 'fly' });
      }
      vanishPuff(FIRE[0], FIRE[1] - 80, 70, t - t0 - .5, 'offpuff' + i);
      flare = Math.max(flare, Math.max(0, 1 - Math.abs(t - t0 - .55) / .25));
    }
    firePit(FIRE[0], FIRE[1], t, flare * .7 + (t > BRAHMA && t < BRAHMA + .4 ? .8 : 0));
    if (t > RESTORE - .05) for (let i = 0; i < 10; i++) if (i !== 4) { const [hx, hy] = rvHeadPos({}, i); sparkleBurst(GX + hx * GU, GY + hy * GU, 45, t - (RESTORE + Math.abs(i - 4) * .07), 'rest' + i, 6); }
    // the counter (10 → 2) and the count of Brahma's heads
    if (inW(t, OFFER0, BRAHMA)) { const n = 10 - OFFER_ORDER.filter(i => t > offerT(i)).length; letter(String(n), 860, 1150, 120, GOLDC, { screen: true, stroke: PAL.ink, sw: .2, ink: false, pop: 5 * (t - Math.max(OFFER0, ...OFFER_ORDER.map(offerT).filter(x => x < t))) }); }
    if (inW(t, BRAHMA + .35, RESTORE)) ['1', '2', '3', '4?!'].forEach((n, j) => sfx(n, BRX + [-70, 0, 70, 150][j], BRY - 300 + (j === 3 ? -20 : 0), j === 3 ? 56 : 46, '#FFF5E2', t - (BRAHMA + .35 + j * .27), { life: RESTORE - (BRAHMA + .35 + j * .27), stroke: LK.ink, sw: .2 }));
    if (grassAt != null) { const p = arcPt([GX - 4.2 * GU, GY - 18.5 * GU], [1250, 250], 300, easeOut(grassAt * 1.6)); grassBlade(p[0], p[1], 46, grassAt * 20); }
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [LK.sepia, '#8A6A4A']); }
    if (t > BRAHMA && t < BRAHMA + .3) flash(1 - (t - BRAHMA) / .3, '#FFF0C0');
    whipH(seg(t, HUMAN - .25, HUMAN), 1, t, ['#FFE6A0', '#F6A06A']);
    caps(t);
  }
  function shotRama(t, lt) {
    camK(t, [[HUMAN, [540, 960, 1.0]], [H0, [540, 990, 1.08]]]);
    sunriseSet(t);
    rama(540, 1300, 560, { rim: ease(seg(t, RAMA, RAMA + .5)), glint: t > RAMA ? 1 : 0, glintAge: clamp((t - RAMA) * .6, 0, .3) + (t > RAMA + .5 ? .3 * Math.abs(Math.sin(t * 2)) : 0) });
    const k = seg(t, HUMAN, RAMA + .4), p = [lerp(-40, 610, easeOut(k)) + Math.sin(k * 9) * 40, lerp(420, 1296, ease(k))];
    grassBlade(p[0], p[1], 46, k < 1 ? Math.sin(k * 8) * .8 : 1.45);
    camEnd();
    if (lt < .25) whipH(1 - lt / .25, 1, t, ['#FFE6A0', '#F6A06A']);
    caps(t);
    if (t > H0 - .3) { flushLetters(); brushWipe((t - (H0 - .3)) / .6, [LK.night, LK.nightMid]); }
  }

  // ================= H · Dussehra night: ten bad habits; we burn all ten =================
  const EX = 515, EY = 1440, EU = 24;
  function shotDussehra(t, lt) {
    camK(t, [[H0, [540, 990, 1.1]], [TAGS, [540, 960, 1.04]], [BURN, [540, 960, 1.02]], [I0, [540, 940, 1.05]]]);
    dussehraSet(t);
    const burn = ease(seg(t, BURN, BURN + .6));
    glow(EX, EY - 300, 700 * burn + 1, '#FF9A3A', .6 * burn);
    for (let i = 0; i < 9; i++) firework(140 + hash(i * 2.3) * 780, 520 + hash(i * 5.1) * 330, t - (FW + i * .26), 150 + 60 * hash(i), LK.spark[i % 5], 'fw' + i);
    bamboo(EX, EY, EU);
    const o = { boilKey: 'rvfig', effigy: true, noShadow: true, still: true, arm: (a, s, k, d) => ({ shape: 'open' }) };
    ravana(EX, EY, EU, o);
    fountain(EX - 150, EY + 10, t, burn, 'fl'); fountain(EX + 150, EY + 10, t + .3, burn, 'fr'); fountain(EX, EY + 30, t + .6, burn * .8, 'fm');
    crowd(t, burn);
    for (let i = 0; i < 10; i++) {
      const [hx, hy, r] = rvHeadPos(o, i), x = EX + hx * EU, top = EY + (hy - r * (i === 4 ? 2.4 : 1.35)) * EU, y = top - 50 - (i % 2) * 74 - (i === 4 ? 10 : 0);
      tagPill(TAGW[i], x, y, t - (TAGS + i * .18), { size: 29, lead: [x, top] });
    }
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [LK.night, LK.nightMid]); }
    caps(t);
  }

  // ================= the card =================
  function shotCard(t, lt) {
    rkCard3(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(200, 740, k), lerp(1100, 840, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [TK.marigold, TK.rkOrange]); }
  }

  shots([[0, shotBed], [C0, shotMirror], [D0, shotDine], [F0, shotDoor], [G0, shotPenance], [HUMAN, shotRama], [H0, shotDussehra], [I0, shotBed], [CARD, shotCard]]);
})();
