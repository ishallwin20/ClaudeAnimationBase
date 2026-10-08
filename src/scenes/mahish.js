// mahish.js: "Mahishasura turned into a LION. In front of HER lion.", a ~59 s captioned reel for Navratri: the sequel to
// the Vahana Union. A cold open (the lion face-off), the boon, the gods' light becomes Durga, the gifts, Sher, the fight
// (buffalo → lion → elephant → buffalo, the trishul), nine nights and Vijayadashami, Sher's demands; the card sells
// Books 1–3. Storyboard: STORYBOARD.md. Sets and effects: mahish_props.js. All times are video time (t); the SFX
// (tools/mahish_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/mahish_sfx.mjs)
  const REVEAL = 2.3, BRO = 2.9, LOOK = 3.5, REWIND = 4.9, B0 = 5.4;
  const POOF_M = 5.7, MEET = 6.3, BOON = 8.7, KICK = 11.0, SWAT = 11.3, C0 = 12.9;
  const ANGRY = 13.0, CONVERGE = 13.5, BLAZE = 14.9, RISE = 15.2, NOTGOD = 15.4, FAN = 15.6, DURGA = 17.2;
  const GIFTS = 19.4, G = [20.0, 20.75, 21.5, 22.25, 23.0], VOLLEY = 23.75, MOUNTAIN = 24.9, SHER_IN = 25.5, SKID = 26.2, ME = 26.4, JUMP = 27.75, E0 = 28.0;
  const HOP = 28.0, CHARGE = 28.4, BUF1 = 28.7, LEAP1 = 29.85, CLASH = 30.2, LIONF = 31.2, POOF_L = 31.5, TWITCH = 32.1,
    COPYTW = 32.6, SLAP = 33.4, SLAPCAP = 33.6, ELE = 35.4, POOF_E = 35.5, TRUMPET = 35.9, SLASH = 36.9, BUF2 = 38.6,
    LEAP = 39.3, PIN = 40.0, EMERGE = 40.4, STRIKE = 41.2, F0 = 42.4;
  const NINE = 42.6, DIYAS = 43.0, VIJAY = 45.0, DEMANDS = 47.6, BROW = 49.1, JMD = 49.5, ASK = 51.0, WIPE = 54.2;
  const CARD = 54.5, CARD_CAP = 54.6, COVERS = 54.8, PRICE = 55.6, LOGO = 55.9, PILL = 56.2, FOLLOW = 56.6;

  const GOLDC = '#F5C542';
  const inW = (t, a, b) => t >= a && t < b;
  const talkK = (t, sp = 13, ph = 0) => .35 + .75 * Math.abs(Math.sin(t * sp + ph));
  const camK = (t, keys) => { const c = kf(t, keys); camBegin(c[0], c[1], c[2]); return c; };
  const twitch = (t, t0) => inW(t, t0, t0 + .12) || inW(t, t0 + .22, t0 + .32) || inW(t, t0 + .42, t0 + .5);

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['Mahishasura turned into a LION…', 560, -1, REVEAL + .2 + 1, 58], ['…in front of HER lion.', 660, -1, REVEAL + .2 + 1, 74, GOLDC],
    ['Bro.', 470, BRO, REWIND - BRO, 96], ["That's MY look.", 575, LOOK, REWIND - LOOK, 84, GOLDC],
    ["Let's rewind.", 520, REWIND + .05, MEET - REWIND - .1, 80],
    ['Meet MAHISHASURA,', 480, MEET, BOON - MEET - .05, 80, GOLDC], ['the buffalo demon.', 575, MEET + .3, BOON - MEET - .35, 58],
    ['His boon: no GOD, no MAN', 480, BOON, KICK - BOON - .05, 60], ['could ever kill him.', 575, BOON + .3, KICK - BOON - .35, 60, GOLDC],
    ['So he kicked the gods', 480, KICK, C0 - KICK - .1, 62], ['OUT of heaven.', 575, KICK + .25, C0 - KICK - .35, 84, GOLDC],
    ['The gods got SO angry…', 560, ANGRY, BLAZE - ANGRY + .1, 62], ['…their light became ONE.', 655, ANGRY + .5, BLAZE - ANGRY - .35, 62, GOLDC],
    ['Not a god. Not a man.', 560, NOTGOD, DURGA - NOTGOD - .1, 66],
    ['MAA DURGA.', 580, DURGA, GIFTS - DURGA - .05, 124, GOLDC],
    ['Every god gave her a GIFT:', 470, GIFTS, MOUNTAIN - GIFTS - .1, 60, GOLDC], ['…and MORE.', 1420, VOLLEY, MOUNTAIN - VOLLEY, 56, GOLDC],
    ['And the mountain king', 560, MOUNTAIN, ME - MOUNTAIN - .05, 62], ['gave her…', 655, MOUNTAIN + .3, ME - MOUNTAIN - .35, 62],
    ['…ME.', 600, ME, E0 - ME - .05, 150, GOLDC],
    ['He came as a BUFFALO.', 480, BUF1, CLASH - BUF1 + .9, 66],
    ['So he became… a LION.', 480, LIONF, SLAP - LIONF - .1, 66], ['Sher handled THAT one.', 480, SLAPCAP, ELE - SLAPCAP - .05, 66, GOLDC],
    ['Then an ELEPHANT!', 480, ELE, SLASH - ELE + .9, 76],
    ['Then a BUFFALO again.', 480, BUF2, EMERGE - BUF2, 66],
    ['Jai MAA DURGA!', 520, STRIKE + .1, NINE - STRIKE - .1, 104, GOLDC],
    ['That battle lasted', 720, NINE + .1, VIJAY - NINE - .15, 62], ['NINE nights.', 815, NINE + .4, VIJAY - NINE - .45, 104, GOLDC],
    ['On day TEN, she WON:', 720, VIJAY, DEMANDS - VIJAY - .05, 62], ['VIJAYADASHAMI.', 815, VIJAY + .4, DEMANDS - VIJAY - .45, 92, GOLDC],
    ['So… about my DEMANDS…', 480, DEMANDS + .1, JMD - DEMANDS - .15, 64],
    ['JAI MATA DI!!', 490, JMD + .05, ASK - JMD - .1, 110, GOLDC],
    ['Tag the DURGA of your house', 1335, ASK, WIPE - ASK + .1, 58, GOLDC], ['(the one who fixes EVERYTHING)', 1428, ASK + .15, WIPE - ASK - .05, 42],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= the lion face-off (the cold open, and the lion beat of the fight) =================
  const GY = 1560, LU = 24, SX = 250, CX2 = 800, DRU = LU * .6;
  // f: { t, sher: lionRun opts, copy: opts | null, durga: opts, copyX, copyRot, copyK }
  function faceoff(f) {
    const so = { boilKey: 'sher', ...f.sher };
    const ds = lionRunSeat(SX, GY, LU, so);
    lionRun(SX, GY, LU, { ...so, rider: () => durga(ds[0], ds[1], DRU, { ...DRG_SKIN, sit: 1, boilKey: 'dr', noShadow: true, ...f.durga }) });
    if (f.copy) {
      const k = f.copyK ?? 1;
      if (k > .02) lionRun(f.copyX ?? CX2, GY, LU * k, { flip: true, pal: DEMON_PAL, hat: demonLionHat(), boilKey: 'copy', ...f.copy });
    }
  }
  const DUR_FACE = { eyes: 'determined', hair: .3, handL: [-4.8, -17.5], trishulA: .35, mouth: 'flat' };

  // ================= A · the cold open =================
  function shotOpen(t, lt) {
    const c = camK(t, [[0, [440, 1300, 3.3]], [REVEAL, [450, 1300, 3.2]], [REVEAL + .6, [540, 1270, 1.15]], [REWIND, [540, 1260, 1.2]], [B0, [400, 1300, 1.5]]]);
    battleSet(t, { scroll: 0 });
    const tw = twitch(t, 1.4), talk = inW(t, BRO, BRO + .45) || inW(t, LOOK, LOOK + .9), swMul = clamp(1.7 / c[2], .5, 1);   // finer ink in the close-up
    faceoff({
      sher: { eyes: tw ? 'squeeze' : 'angry', mouth: talk ? 'talk' : 'frown', mouthK: talkK(t), wind: .25, nod: tw ? .04 : 0, sq: .015 * Math.sin(t * 2), swMul },
      copy: { eyes: twitch(t, LOOK - .1) ? 'squeeze' : t > 3.0 ? 'side' : 'angry', mouth: t > 3.0 ? 'smirk' : 'frown', wind: -.2, swMul },
      durga: { ...DUR_FACE, browL: t > REVEAL + .4 ? .7 : 0, lookX: .6, eyes: t > REVEAL + .4 ? 'normal' : 'determined', swMul },
    });
    camEnd();
    // the rewind: streaks run backwards, a ◀◀ mark
    const rw = seg(t, REWIND, REWIND + .3);
    whipH(rw, -1, t, ['#FFF4DC', '#F6B27A']);
    rewindMark(rw * (1 - seg(t, B0 - .1, B0)));
    if (t > B0 - .15) veil('#FFF4DC', seg(t, B0 - .15, B0));
    caps(t);
  }

  // ================= B · heaven: the boon =================
  const MX = 400, MY = 1660, MU = 28;
  const ORBS0 = [[700, 960], [900, 1140], [560, 820], [880, 1400], [720, 1240]];
  function shotHeaven(t, lt) {
    camK(t, [[B0, [520, 1190, 1.2]], [KICK, [540, 1170, 1.15]], [C0, [600, 1150, 1.1]]]);
    heavenSet(t);
    throne(800, 1560, 50);
    // the gods' lights, trembling, then swatted out of heaven
    ORBS0.forEach(([ox, oy], i) => {
      const sw = seg(t, SWAT + i * .06, SWAT + i * .06 + .7);
      if (sw >= 1) return;
      const out = [[1300, 300], [1350, 900], [900, -300], [1400, 1500], [1200, 1900]][i];
      const p = sw > 0 ? arcPt([ox, oy], out, 300, easeIn(sw) * .3 + sw * .7) : [ox + Math.sin(t * 30 + i) * (t > BOON ? 4 : 1.5), oy + Math.sin(t * 2 + i) * 14];
      godOrb(p[0], p[1], 64, i, { face: t > BOON + .2 ? 'shock' : 'calm', k: backOut(seg(t, B0 + .4 + i * .1, B0 + .8 + i * .1)), spin: sw * 12 });
    });
    // Mahishasura: poofs in laughing, flexes; taps his chest (the boon); swats the lights; hops onto the throne, arms crossed
    const tin = seg(t, POOF_M, POOF_M + .25);
    if (tin > 0) {
      const hop = seg(t, SWAT + .9, SWAT + 1.3), [hx, hy] = arcPt([MX, MY], [800, 1570], 160, ease(hop));
      const laugh = t < BOON, swat = inW(t, SWAT - .25, SWAT + .5), sp = seg(t, SWAT - .25, SWAT + .15);
      const o = {
        boilKey: 'mahish', sq: (1 - backOut(tin)) * .3 + spring(t, POOF_M + .25, 7, 20) * .06 + (hop > 0 && hop < 1 ? -.06 : 0) + spring(t, SWAT + 1.3, 8, 20) * .08,
        eyes: laugh ? 'happy' : swat ? 'angry' : 'normal', mouth: laugh ? 'laugh' : swat ? 'roar' : 'smirk', mouthK: talkK(t, 18), brows: laugh || swat ? undefined : .6,
        handR: laugh ? [5.6, -16.8 + Math.sin(t * 9) * .4] : swat ? [lerp(-1, 7.4, ease(sp)), lerp(-17, -13, ease(sp))] : t > SWAT + .9 ? [-1.6, -12.4] : [1.0, -13.4 + (inW(t, BOON + .3, BOON + 1.4) ? Math.abs(Math.sin((t - BOON) * 9)) * .6 : 0)],
        handL: laugh ? [-4.4, -11.2] : t > SWAT + .9 ? [1.6, -12.8] : [-4.6, -10.6], bendL: t > SWAT + .9 ? -1 : 1, bendR: t > SWAT + .9 ? -1 : 1,
        sword: false, shield: false, nod: laugh ? Math.abs(Math.sin(t * 9)) * .25 : 0, lookX: t > SWAT + .9 ? -.4 : .5, hx: t > BOON ? .2 : 0, noShadow: hop > 0,
      };
      mahishasura(hx, hy, MU * (.6 + .4 * backOut(tin)), o);
    }
    vanishPuff(MX, MY - 340, 320, t - POOF_M, 'mpoof', ['#5A4A6A', '#8A7AA0']);
    camEnd();
    whipH(1 - seg(t, B0, B0 + .35), -1, t, ['#FFF4DC', '#F6B27A']);
    if (t < B0 + .2) veil('#FFF4DC', 1 - seg(t, B0, B0 + .2));
    caps(t);
    if (t > C0 - .3) { flushLetters(); brushWipe((t - (C0 - .3)) / .6, [MH.nightLt, MH.night]); }
  }

  // ================= C + D · the gods' light becomes Durga; the gifts; Sher =================
  const DX = 540, DY = 1480, DU = 22;
  const GPOS = [[170, 1000], [910, 1000], [170, 1420], [910, 1420], [780, 1760]];
  // where each gift lands: [name, side s (-1 screen-left), back pair k or -1 for the front hand, giver orb i or -1]
  const GIFTMAP = [['trishul', -1, -1, 0], ['chakra', -1, 0, 1], ['vajra', -1, 2, 2], ['shankh', 1, 0, 3], ['dhanush', 1, 1, 4], ['baan', 1, 2, 4],
    ['khadga', -1, 1, -1], ['gada', -1, 3, -1], ['lotus', 1, 3, -1]];
  const giftT = name => { const i = GIFTMAP.findIndex(g => g[0] === name); return i < 5 ? G[i] : i === 5 ? G[4] + .12 : VOLLEY + (i - 6) * .12; };
  function durgaBirthOpts(t) {
    const rise = seg(t, RISE, RISE + .9), open = t > DURGA - .1, done = t > VOLLEY + .5;
    return {
      ...DRG_SKIN, boilKey: 'durga', aura: t < RISE ? 0 : clamp(1.2 - seg(t, DURGA, DURGA + 1.5) * .5), arms: ease(seg(t, FAN, FAN + 1.0)),
      gifts: n => t < giftT(n) ? 0 : 1, eye3: open ? clamp(1 - seg(t, DURGA + 1.2, DURGA + 2)) * .8 + (t > GIFTS ? .25 : 0) : 0,
      eyes: !open ? 'closed' : t > G[2] ? 'determined' : 'normal', mouth: t > VOLLEY + .3 && t < MOUNTAIN ? 'grin' : 'smile', brows: t > ME + .6 ? .5 : undefined,
      hair: .2 + .3 * Math.sin(t * 1.3), wild: t > G[0] ? .35 : 0, fire: t < RISE ? 0 : .5 + .3 * pulse(t, 3),
      handL: done ? [-5.4, -18.6] : [-4.4, -13.6], trishulA: done ? -.25 : -.1, sq: (1 - backOut(rise)) * .2,
      lookX: t > SHER_IN && t < ME + .8 ? -.7 : 0, emote: undefined,
    };
  }
  function shotBirth(t, lt) {
    const tagAt = [];
    const c = camK(t, [[C0, [540, 1050, 1.0]], [BLAZE, [540, 1000, 1.05]], [RISE + .9, [540, 1150, 1.25]], [DURGA, [540, 1130, 1.3]], [GIFTS - .3, [540, 1130, 1.3]], [GIFTS + .2, [540, 1170, 1.22]], [MOUNTAIN, [540, 1170, 1.22]], [MOUNTAIN + .5, [540, 960, .95]], [SHER_IN - .1, [540, 960, .95]], [SKID, [540, 1130, .85]], [E0, [540, 1100, .85]]]);
    himalayaSet(t, seg(t, BLAZE, BLAZE + .9));
    // the gods' lights fly in angry, circle, and spiral into one
    if (t < BLAZE + .05) GODS.forEach((g, i) => {
      const a0 = i / 5 * TAU - Math.PI / 2, inK = ease(seg(t, C0 + i * .08, C0 + .6 + i * .08)), sp = easeIn(seg(t, CONVERGE, BLAZE));
      const R = lerp(900, 330, inK) * (1 - sp), a = a0 + sp * 5 + Math.sin(t * 2 + i) * .05;
      godOrb(DX + Math.cos(a) * R, 960 + Math.sin(a) * R * .9, 60 * (1 - sp * .5), i, { face: 'angry', spin: sp * 8 });
    });
    if (t > CONVERGE) { const k = seg(t, CONVERGE, BLAZE); glow(DX, 960, 200 + 700 * k, '#FFE7A0', k); }
    // the blaze: rays, then Durga rises out of the light
    const bk = seg(t, BLAZE, BLAZE + 1.2);
    if (bk > 0 && bk < 1) {
      boilSeed('rays');
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + t * .3, r = 1400; paint([[DX, 960], [DX + Math.cos(a - .05) * r, 960 + Math.sin(a - .05) * r], [DX + Math.cos(a + .05) * r, 960 + Math.sin(a + .05) * r]], { wash: '#FFF4D0', washOp: 220 * (1 - bk), ink: null }); }
    }
    if (t > RISE) {
      const rise = seg(t, RISE, RISE + .9), jump = seg(t, JUMP, E0 + .05);
      durga(DX, DY - (1 - ease(rise)) * 260 - Math.sin(Math.PI * Math.min(1, jump * 1.2)) * 900 * (jump > 0 ? 1 : 0) - easeIn(jump) * 600, DU * lerp(.35, 1, backOut(rise)), durgaBirthOpts(t));
    }
    // the givers: small lights round her, each throwing its gift on a comet into the right hand
    if (t > GIFTS - .3 && t < MOUNTAIN + .3) GODS.forEach((g, i) => {
      const k = backOut(seg(t, GIFTS - .3 + i * .08, GIFTS + i * .08)) * (1 - seg(t, MOUNTAIN, MOUNTAIN + .3)), [gx, gy] = GPOS[i];
      godOrb(gx, gy + Math.sin(t * 2 + i) * 10, 52, i, { k, face: t > giftT(g[2]) ? 'calm' : 'calm' });
    });
    const dop = durgaBirthOpts(t);
    GIFTMAP.forEach(([name, s, k, orb], j) => {
      const tg = giftT(name), fk = seg(t, tg - .5, tg);
      const to = k < 0 ? durgaHand(DX, DY, DU, dop, s) : durgaBackHand(DX, DY, DU, dop, k, s);
      const from = orb >= 0 ? GPOS[orb] : [[300, -200], [540, -260], [780, -200]][j - 6];
      const col = orb >= 0 ? GODS[orb][1] : '#FFE08A';
      comet(from, to, orb >= 0 ? 220 : 0, fk, col, 46, sz => { const d = { trishul: trishul, chakra: (u, sw) => chakra(u, sw, t * 9), vajra: vajra, shankh: shankh, dhanush: dhanush, baan: baan, khadga: khadga, gada: gada, lotus: (u, sw) => lotus(u, sw, 1) }[name]; d(sz / 9, 1.2); }, 'g' + j);
      sparkleBurst(to[0], to[1], 90, t - tg, 'gb' + j);
      if (orb >= 0 && name !== 'baan' && inW(t, tg, MOUNTAIN)) tagAt.push([toScreen(...to), GODS[orb][0], t - tg, s]);
    });
    // Sher gallops in from the left, skids, and poses: "…ME."
    if (t > SHER_IN) {
      const k = seg(t, SHER_IN, SKID), x = lerp(-560, 290, easeOut(k)), run = (t - SHER_IN) * 2.1, stop = seg(t, SKID - .2, SKID + .25);
      const so = { run: stop < 1 ? run : undefined, stride: 1 - stop, pitch: stop > 0 && stop < 1 ? -.12 * Math.sin(stop * Math.PI) : t > ME ? -.05 : 0,
        eyes: t > ME + .7 ? (inW(t, ME + .7, ME + 1.0) ? 'closed' : 'happy') : 'normal', mouth: t > ME ? 'grin' : 'open', mouthK: .6, boilKey: 'sherb', land: spring(t, SKID, 8, 18) * .5,
        crouch: t > JUMP - .2 ? seg(t, JUMP - .2, JUMP) : 0 };
      lionRun(x, 1830, 40, so);
      dust(x - 100, 1810, 160, t - SKID, 'skid');
      dust(x + 80, 1820, 120, t - SKID - .1, 'skid2');
    }
    camEnd();
    if (t < C0 + .3) { flushLetters(); brushWipe(.5 + (t - C0) / .6, [MH.nightLt, MH.night]); }
    if (t > BLAZE - .05) flash(1 - seg(t, BLAZE, BLAZE + .5), '#FFF6DC');
    whipH(seg(t, JUMP + .05, E0), 1, t, ['#FFF4DC', '#FFD9A0']);
    // each giver's name, by the hand his gift landed in
    const TAGOFF = { Shiva: [-60, 95], Vishnu: [-150, -40], Indra: [-150, 10], Varuna: [130, -40], Vayu: [140, 20] };
    for (const [[x, y], name, age, s] of tagAt) { const [ox, oy] = TAGOFF[name]; giftTag(clamp(x + ox, 130, 830), y + oy, name.toUpperCase(), age, { w: 170, rot: s * .04 }); }
    caps(t);
  }

  // ================= E · the fight =================
  // ground scroll while they charge
  const scrollAt = t => 950 * (clamp(t, CHARGE, CLASH + .4) - CHARGE) + 950 * .5 * .6 * easeOut(seg(t, CLASH + .4, CLASH + 1.0));
  const BUX = t => lerp(1500, 700, seg(t, BUF1, CLASH));      // the buffalo's charge
  function sherFight(t) {
    const runK = (1 - seg(t, CLASH + .5, CLASH + 1.0)) * seg(t, CHARGE - .1, CHARGE + .2), lp = seg(t, LEAP1, CLASH + .35);
    const leap = Math.sin(Math.PI * lp), hop = Math.sin(Math.PI * seg(t, LEAP1, CLASH + .4));
    const x = SX + 60 * runK + 30 * leap, run = runK > .02 ? (t - CHARGE) * 1.9 : undefined;
    let o = { run, stride: runK, leap: leap * .9, dy: -hop * 4.5, land: spring(t, CLASH + .4, 7, 18) * .6, eyes: 'angry', mouth: runK > .3 ? 'roar' : 'frown', mouthK: .8, wind: .3 + runK * .8 };
    if (t > LIONF) {   // the face-off: he stands; twitches; the SLAP
      const tw = twitch(t, TWITCH), wind = ease(seg(t, SLAP - .55, SLAP - .12)), hit = seg(t, SLAP - .12, SLAP - .02), back = ease(seg(t, SLAP + .3, SLAP + .75));
      o = { eyes: tw ? 'squeeze' : t > SLAP + .35 ? 'happy' : 'angry', mouth: t > SLAP + .35 ? 'grin' : inW(t, SLAP - .5, SLAP + .1) ? 'roar' : 'frown', mouthK: .6,
        raise: wind * (1 - hit), reach: hit * (1 - back), dx: (hit * 2.4 - wind * .4) * (1 - back), pitch: -wind * .07 * (1 - hit) + hit * .1 * (1 - back), wind: .2 };
      if (t > ELE) o = { eyes: inW(t, POOF_E, TRUMPET + .4) ? 'wide' : 'angry', mouth: inW(t, TRUMPET, SLASH) ? 'O' : t > SLASH + .2 ? 'grin' : 'frown', crouch: inW(t, TRUMPET, SLASH) ? .5 : 0, wind: .2 };
      if (t > BUF2) o = { eyes: 'angry', mouth: t > PIN ? 'grin' : 'roar', mouthK: .7, crouch: inW(t, BUF2, LEAP) ? .6 : 0, pitch: inW(t, LEAP - .1, LEAP + .2) ? .1 : 0, wind: .2 };
    }
    return { x, o };
  }
  function durgaRide(t) {
    const base = { eyes: 'determined', hair: .7, wild: .5, aura: .3, eye3: .3, fire: .7, handL: [-4.8, -17.8], trishulA: .7, mouth: 'flat' };
    if (t < CHARGE + .3) return { ...base, handL: [-5.4, -18.6], trishulA: -.25, mouth: 'roar' };
    if (inW(t, BUF1 + .6, CLASH + .3)) return { ...base, mouth: 'roar', trishulA: 1.1, handL: [-3.6, -16.4] };
    if (inW(t, LIONF, ELE)) return { ...DUR_FACE, browL: inW(t, TWITCH, SLAP) ? .8 : 0, eyes: t > SLAP + .2 ? 'happy' : 'normal', mouth: t > SLAP + .2 ? 'grin' : 'flat', lookX: .5, aura: .2 };
    if (inW(t, ELE, BUF2)) {   // the khadga (back pair 1, screen-left) sweeps across
      const sw = seg(t, SLASH - .35, SLASH + .1), back = seg(t, SLASH + .5, SLASH + 1.0);
      return { ...base, mouth: inW(t, SLASH - .4, SLASH + .3) ? 'roar' : 'grin', eyes: t > SLASH + .3 ? 'happy' : 'determined',
        backAt: (k, s) => k === 1 && s < 0 && back < 1 ? [lerp(lerp(-5, -8.5, sw * 3 > 1 ? 1 : sw * 3), 8.6, ease(clamp(sw * 1.4 - .4))) * (1 - back) + -7.7 * back, lerp(lerp(-20, -24.5, Math.min(1, sw * 3)), -15, ease(clamp(sw * 1.4 - .4))) * (1 - back) + -18.3 * back] : null };
    }
    return base;
  }
  function shotFight(t, lt) {
    const sh = shakeXY(t, 14 * (Math.max(0, 1 - Math.abs(t - CLASH) / .35) + Math.max(0, 1 - Math.abs(t - SLAP) / .25) * .6 + Math.max(0, 1 - Math.abs(t - PIN) / .3) + Math.max(0, 1 - Math.abs(t - STRIKE) / .4) * 1.4 + (inW(t, TRUMPET, TRUMPET + .9) ? .5 : 0)));
    const c = kf(t, [[E0, [470, 1280, 1.25]], [BUF1, [560, 1280, 1.15]], [CLASH, [600, 1270, 1.25]], [LIONF, [540, 1280, 1.12]], [TWITCH - .2, [540, 1290, 1.32]], [SLAP + .6, [560, 1280, 1.2]],
      [ELE, [600, 1240, 1.05]], [TRUMPET, [620, 1080, .8]], [SLASH + 1.2, [600, 1140, .9]], [BUF2, [600, 1280, 1.1]], [LEAP, [640, 1230, 1.1]], [PIN, [690, 1290, 1.35]], [STRIKE, [690, 1270, 1.5]], [F0, [690, 1270, 1.7]]]);
    camBegin(c[0] + sh[0], c[1] + sh[1], c[2]);
    battleSet(t, { scroll: scrollAt(t) });
    // ---- the buffalo, first charge, flung
    if (inW(t, BUF1, CLASH + 1.0)) {
      const fl = seg(t, CLASH + .05, CLASH + .8), p = fl > 0 ? arcPt([BUX(CLASH), GY], [1250, 260], 500, easeOut(fl)) : [BUX(t), GY];
      if (fl < 1) mahishBuffalo(p[0], p[1], LU * (1 - fl * .5), { flip: true, run: fl > 0 ? undefined : (t - BUF1) * 2.2, charge: seg(t, CLASH - .5, CLASH - .2), eyes: fl > 0 ? 'swirl' : 'angry', mouth: fl > 0 ? 'open' : 'flat', snort: seg(t, BUF1 + .1, BUF1 + .8), rot: fl * 9, noShadow: fl > 0, boilKey: 'buf1' });
    }
    twinkle(1010, 520, t - (CLASH + .8), 46, 'tw1');
    // ---- Sher + Durga
    const { x: sx, o: so } = sherFight(t);
    const dOpts = durgaRide(t), leaping = t > LEAP;
    const ds = lionRunSeat(sx, GY, LU, { boilKey: 'sher', ...so });
    lionRun(sx, GY, LU, { boilKey: 'sher', ...so, rider: leaping ? undefined : () => durga(ds[0], ds[1], DRU, { ...DRG_SKIN, sit: 1, boilKey: 'dr', noShadow: true, ...dOpts }) });
    if (inW(t, CHARGE, CLASH + .3)) dust(sx - 160, GY - 20, 70, frac((t - CHARGE) * 2.4) * .6, 'rund');
    // ---- the lion copy: poof, face-off, slapped into a spin
    if (inW(t, POOF_L, SLAP + .9)) {
      const spin = seg(t, SLAP + .12, SLAP + .65), squish = inW(t, SLAP - .02, SLAP + .12) ? .18 : 0;
      lionRun(CX2 + spin * 260, GY - Math.sin(spin * Math.PI) * 120, LU * (spin > 0 ? 1 - spin * .4 : Math.max(.05, backOut(seg(t, POOF_L, POOF_L + .3)))), { flip: true, pal: DEMON_PAL, hat: demonLionHat(), boilKey: 'copy', rot: spin * 14, sq: -squish, dx: squish * 1.2, nod: squish * 1.5,
        eyes: spin > 0 || squish ? 'squeeze' : twitch(t, COPYTW) ? 'squeeze' : t > TWITCH ? 'side' : 'angry', mouth: spin > 0 ? 'open' : t > TWITCH ? 'smirk' : 'frown', noShadow: spin > 0 });
    }
    vanishPuff(CX2, GY - 220, 200, t - POOF_L, 'lpoof', ['#5A4A6A', '#8A7AA0']);
    vanishPuff(CX2 + 260, GY - 160, 200, t - (SLAP + .67), 'lpoof2', ['#5A4A6A', '#8A7AA0']);
    // ---- the elephant
    if (inW(t, POOF_E, SLASH + .2)) {
      demonElephant(860, GY + 20, 44 * Math.max(.05, backOut(seg(t, POOF_E, POOF_E + .3))), { flip: true, rear: ease(seg(t, TRUMPET, TRUMPET + .5)) * (1 - .3 * seg(t, SLASH - .1, SLASH + .1)), eyes: t > SLASH ? 'swirl' : 'angry', boilKey: 'ele' });
    }
    vanishPuff(860, GY - 360, 320, t - POOF_E, 'epoof', ['#5A4A6A', '#8A7AA0']);
    vanishPuff(860, GY - 420, 460, t - (SLASH + .15), 'epoof2', ['#5A4A6A', '#8A7AA0']);
    if (inW(t, SLASH - .3, SLASH + .5)) { const hp = durgaBackHand(ds[0], ds[1], DRU, { ...DRG_SKIN, sit: 1, ...dOpts }, 1, -1); slashArc(hp[0], hp[1], 560, -2.5, .5, seg(t, SLASH - .3, SLASH), t - SLASH, 'slash'); }
    // ---- the second buffalo: it charges, she leaps off Sher and pins it; he bursts out; the trishul
    const bx2 = lerp(1450, 760, easeOut(seg(t, BUF2 + .1, LEAP + .5))), pin = seg(t, PIN, PIN + .12), gone = seg(t, STRIKE + .05, STRIKE + .7);
    const bo = { flip: true, run: t < LEAP + .4 ? (t - BUF2) * 2.2 : undefined, stride: 1 - seg(t, LEAP + .2, LEAP + .5), charge: seg(t, LEAP, LEAP + .3), eyes: t > PIN ? 'swirl' : 'angry', mouth: t > PIN ? 'open' : 'flat', sq: pin * .22 - spring(t, PIN + .12, 8, 20) * .06, snort: seg(t, BUF2 + .2, BUF2 + .9), boilKey: 'buf2' };
    if (inW(t, BUF2, STRIKE + .7) && gone < .6) mahishBuffalo(bx2, GY, LU, bo);
    if (t > LEAP) {
      // her leap from the saddle to its back (slow motion), then standing on it; she turns to him and strikes
      const lp = seg(t, LEAP, PIN), back = buffaloWorld(bx2, GY, LU, bo, ...buffaloLocal(bo, -1.6, -9.8));
      const from = lionRunSeat(sx, GY, LU, { boilKey: 'sher', ...so }), drop = seg(t, STRIKE + .35, STRIKE + .7);
      const p = lp < 1 ? arcPt([from[0], from[1] + 11 * DRU], back, 420, ease(lp)) : drop > 0 ? arcPt(back, [back[0] - 20, GY], -40, easeIn(drop)) : back;
      const raise = seg(t, EMERGE + .2, STRIKE - .15), thrust = seg(t, STRIKE - .12, STRIKE + .02), rec = seg(t, STRIKE + .5, STRIKE + .9);
      durga(p[0], p[1], DRU, { ...DRG_SKIN, boilKey: 'drs', noShadow: true, eyes: 'determined', mouth: inW(t, EMERGE, STRIKE + .3) ? 'roar' : t > STRIKE + .6 ? 'smile' : 'flat', hair: lp < 1 ? -.8 : .5, wild: .8, aura: .5 + raise * .5, eye3: raise, fire: 1,
        handL: rec > 0 ? [lerp(-6.6, -5.4, ease(rec)), lerp(-15.8, -19.4, ease(rec))] : thrust > 0 ? [lerp(-3.5, -6.6, ease(thrust)), lerp(-23, -15.8, ease(thrust))] : [lerp(-4.8, -3.5, raise), lerp(-17.8, -23, raise)],
        trishulA: rec > 0 ? lerp(-2.3, -.2, ease(rec)) : thrust > 0 ? lerp(-.4, -2.3, ease(thrust)) : lerp(.7, -.4, raise),
        rot: lp < 1 ? Math.sin(lp * Math.PI) * -.25 : 0, sq: lp >= 1 ? spring(t, PIN, 8, 18) * .12 + spring(t, STRIKE + .7, 8, 18) * .1 : -.05, noShadow: drop < 1 });
      // Mahishasura bursts out of the neck, roaring, sword up; then dissolves into light
      if (t > EMERGE && gone < .5) {
        const nk = buffaloNeck(bx2, GY, LU, bo), em = Math.max(.05, backOut(seg(t, EMERGE, EMERGE + .3)));
        mahishasura(nk[0] - 30, nk[1] + 70, 16 * em, { upper: true, boilKey: 'mup', eyes: t > STRIKE ? 'scared' : 'angry', mouth: t > STRIKE ? 'O' : 'roar', mouthK: talkK(t, 20), handR: [5.4, -19.5], swordA: -.4, handL: [-4.2, -13], shield: true, lookX: .8, hx: .3, shake: t > STRIKE ? 1 : 0, sq: (1 - em) * .4 });
      }
      if (t > STRIKE) { const nk = buffaloNeck(bx2, GY, LU, bo); sparkleBurst(nk[0], nk[1] - 120, 260, (t - STRIKE) * .7, 'gone', 14); vanishPuff(nk[0], nk[1] - 60, 300, t - STRIKE - .1, 'gonep', ['#FFF3D6', '#FFE08A']); }
    }
    // ---- impacts
    impact(560, GY - 300, t - CLASH, 260, 'i1');
    impact(CX2 - 150, GY - 300, t - (SLAP - .02), 150, 'i2');
    impact(800, GY - 240, t - PIN, 170, 'i3');
    impact(800, GY - 420, t - STRIKE, 380, 'i4');
    camEnd();
    // ---- screen space: her landing on Sher (cut on action), speed lines, the whiteout
    if (lt < .45) zoomLines(540, 900, 1 - lt / .45, t);
    if (inW(t, CHARGE, CLASH)) whipH(.5 * seg(t, CHARGE, CHARGE + .3), -1, t, ['#FFF4DC', '#FFD9A0']);
    if (inW(t, LEAP, PIN)) zoomLines(...toScreen(800, GY - 300, LAST_CAM), .8, t);
    if (inW(t, STRIKE - .05, STRIKE + .4)) zoomLines(540, 900, 1, t);
    caps(t);
    if (t > F0 - .55) { flushLetters(); flash(ease(seg(t, F0 - .55, F0)), '#FFF6DC'); }
  }

  // ================= F · victory, Sher's demands, the ask =================
  const VX = 380, VY = 1650, VU = 23, LX = 790, LY = 1700, LUF = 29;
  function shotVictory(t, lt) {
    camK(t, [[F0, [540, 1180, 1.0]], [DEMANDS, [540, 1180, 1.0]], [DEMANDS + .4, [640, 1330, 1.35]], [JMD + .4, [640, 1330, 1.35]], [ASK, [540, 1180, 1.0]]]);
    battleSet(t, { dawn: 1, embers: .4 });
    const brow = t > BROW, jmd = t > JMD;
    durga(VX, VY, VU, { ...DRG_SKIN, boilKey: 'dv', aura: .6, fire: .6, eye3: .3,
      eyes: inW(t, BROW, JMD + .3) ? 'normal' : jmd ? 'happy' : t > DEMANDS ? 'normal' : 'happy', mouth: brow && !jmd ? 'flat' : 'smile', browL: inW(t, BROW, JMD + .3) ? 1 : 0,
      lookX: t > DEMANDS ? .8 : 0, hx: t > DEMANDS ? .25 : 0, handL: t < DEMANDS ? [-5.4, -19.2] : [-4.4, -13.6], trishulA: t < DEMANDS ? -.2 : -.1, hair: .3, sq: spring(t, BROW, 8, 16) * .03 });
    // Sher sits beside her: proud; then the headband; the look; the salute
    const pull = seg(t, DEMANDS, DEMANDS + .5), hide = seg(t, JMD, JMD + .25);
    const lo = { boilKey: 'sherv', eyes: t < DEMANDS ? 'happy' : inW(t, BROW, JMD) ? 'wide' : jmd ? 'squeeze' : 'side', mouth: t < DEMANDS ? 'grin' : inW(t, BROW, JMD) ? 'O' : jmd ? 'open' : 'smirk', mouthK: jmd ? talkK(t, 14) : 1, lookX: t > DEMANDS && t < JMD ? -.8 : 0,
      hx: inW(t, DEMANDS, JMD) ? -.3 : 0, inhale: t < DEMANDS ? .4 : 0, sweat: 0, take: spring(t, BROW + .1, 9, 20) * .08,
      pawR: jmd ? [2.6, -13.4] : t > DEMANDS ? [lerp(1.05, 3.6, ease(pull)), lerp(-.55, -7.6, ease(pull))] : undefined, pawShapeR: jmd ? 'pad' : 'hold', pawAR: jmd ? -2.2 : undefined,
      tail: Math.sin(t * 3) * .5, mane: jmd ? .3 : 0 };
    lion(LX, LY, LUF, lo);
    if (t > DEMANDS && hide < 1) { const pp = lionPaw(LX, LY, LUF, lo, 1); heldBand(lerp(pp[0] + 30, LX + 160, hide), lerp(pp[1] - 10, LY - 120, hide), 22 * (1 - hide * .6), -.3 + hide * 2, 'hb'); }
    sparkleBurst(LX, LY - 400, 120, t - JMD, 'jmd');
    camEnd();
    // nine diyas for nine nights
    if (t > NINE) diyaRow(t, Array.from({ length: 9 }, (_, i) => t > DIYAS + i * .18 ? t - (DIYAS + i * .18) : null));
    petalRain(t, VIJAY + .2, { n: 30 });
    if (t > ASK) veil(MH.ink, .38 * seg(t, ASK, ASK + .4));
    if (lt < .6) flash(1 - ease(seg(t, F0, F0 + .6)), '#FFF6DC');
    caps(t);
    if (t > WIPE) { flushLetters(); brushWipe((t - WIPE) / .6, [TK.marigold, TK.peach]); }
  }

  // ================= the card =================
  function shotCard(t, lt) {
    mahishCard(t, { cap: CARD_CAP, covers: COVERS, price: PRICE, logo: LOGO, pill: PILL, follow: FOLLOW });
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { flushLetters(); boilSeed('sparkle'); paint(starPts(lerp(240, 700, k), lerp(1000, 760, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [TK.marigold, TK.peach]); }
  }

  shots([[0, shotOpen], [B0, shotHeaven], [C0, shotBirth], [E0, shotFight], [F0, shotVictory], [CARD, shotCard]]);
})();
