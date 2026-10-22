// blue.js: "Why are Hindu gods BLUE?" (reel/blue-gods → ad 30, ~55 s, Painted, an English voiceover with captions in
// Bangers, SFX). Krishna literally means dark; Ghanshyam, dark as a rain cloud; Tulsidas's Ram, dark as a blue lotus;
// the Vishnu shloka's megha-varnam, the colour of a cloud; paintings made that dark blue. The twist: Shiva is karpura-
// gauram, white as camphor, and only his throat is blue, from the Halahala. The parent line, the ask, the 15K Family
// Deal card. STORYBOARD.md has the plan and the sources; sets and props are in blue_props.js.
// Every time comes from the voice (src/scenes/blue_vo.js, written by tools/sarvam_tts.mjs from tools/blue_vo.json), so a
// re-recorded line moves its shot; tools/blue_sfx.mjs reads the same file.
(() => {
  // ---- times from the voice
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const B0 = mid('names', 'krsna'), C0 = mid('ghana', 'ram'), D0 = mid('ram', 'vish'), E0 = mid('vish', 'paint');
  const F0 = mid('paint', 'twist'), I0 = mid('throat', 'kid'), J0 = mid('kid', 'ask'), CARD = LN.ask.end + 1.4;
  const N0 = Wd('names', 0, 0), NAMES = Wd('names', 0, 6);
  const DARK = Wd('krsna', 0, 3), GHAN = Wd('ghana', 0, 5), RAINC = Wd('ghana', 1, 3);
  const RAMW = Wd('ram', 0, 4), BLOTUS = Wd('ram', 1, 3);
  const VISH = Wd('vish', 0, 2), MEGHA = Wd('vish', 1, 0);
  const MONS = LN.paint.a, SO = Wd('paint', 1, 0), BLUEW = Wd('paint', 1, 6);
  const NOTB = Wd('twist', 1, 3), KARP = LN.karp.a, AARTI = Wd('karp', 1, 5), THR0 = LN.throat.a, THROAT = Wd('throat', 0, 2), SAVE = Wd('throat', 2, 0);
  const ASKK = Wd('kid', 0, 4), NOWK = Wd('kid', 1, 0), YES = Wd('ask', 1, 1);
  const CAP_T = CARD + .1, CARDC = { cap: CAP_T, covers: CARD + .4, price: CARD + 1.2, strike: CARD + 1.7, dead: CARD + 2.2, pill: CARD + 2.7, sub: CARD + 3.2, follow: CARD + 3.7, logo: CAP_T - .1 };
  window.BLUE_T = { B0, C0, D0, E0, F0, I0, J0, CARD, N0, NAMES, DARK, GHAN, RAINC, RAMW, BLOTUS, VISH, MEGHA, MONS, SO, BLUEW, NOTB, KARP, AARTI, THR0, THROAT, SAVE, ASKK, NOWK, YES };

  const GOLDC = '#F5C542';
  const camK = (t, keys) => { const c = kf(t, keys, ease); camBegin(c[0], c[1], c[2]); return c; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const blinkAt = (t, t0) => t > t0 && t < t0 + .14 ? 'closed' : null;
  const popIn = (t, t0, x, y, draw) => {   // scale a character up from its feet, with overshoot
    const k = backOut(clamp((t - t0) / .4));
    if (t < t0 || k < .02) return;
    push(); translate(x, y); scale(k, k); translate(-x, -y); draw(); pop();
  };
  const PEACH = [BG.peachDk, BG.peach], DUSK = [BG.lotusDk, BG.duskHi], BLUES = [BG.cloudDk, BG.cloud], HOME = [BG.wallDk, BG.wall];

  // ---- the captions are the voice's chunks: line by line, the line with *starred* words in gold
  function caps(t) {
    for (const k of VO.caps) {
      const a = k.id === 'hook' ? -1 : k.a, b = k.id === 'ask' ? CARD - .05 : k.b;
      if (t < a || t > b) continue;
      let lines = k.text.split('|').map(s => s.trim()), y0 = 470;
      if (k.id === 'ask' && k.text.startsWith('Comment')) { lines = [lines.join(' ')]; y0 = 720; }
      lines.forEach((l, i) => {
        const gold = l.includes('*');
        caption(l.replace(/\*/g, '').toUpperCase(), y0 + i * 112, t - a - i * .12, { life: b - a - i * .12, size: gold ? 96 : 80, color: gold ? GOLDC : undefined });
      });
    }
  }

  // ================= A · the hook: Krishna puzzled at his blue hands; the others pop in =================
  function shotHook(t, lt, dur) {
    const out = ease(seg(t, N0 - .1, N0 + .9));
    camBegin(540, lerp(1250, 1440, out), lerp(1.0, .74, out) + .008 * lt);
    peachGround(t);
    const flipH = t > .9 && t < 1.8, look = t > 1.9 && t < N0;
    const named = t > NAMES - .1;
    // the others: Ram, Vishnu, Shiva, each looking at his own blue arm; all look at us on "names"
    popIn(t, N0, 0, 1960, () => ram(0, 1960, 30, { boilKey: 'hram', seed: 3, kodanda: true, hx: named ? 0 : .3, lookX: named ? 0 : .8, lookY: named ? 0 : .35,
      eyes: blinkAt(t, 4.1) || 'normal', brow: named ? 0 : .7, mouth: named ? 'smile' : 'O', handR: named ? undefined : [4.6, -17.2], bendR: 1.1 }));
    popIn(t, N0 + .3, 255, 1870, () => vishnu(255, 1870, 40, { boilKey: 'hvsn', chakraSpin: t * 2.2, lookX: named ? 0 : .7, eyes: named ? 'happy' : 'wide', brows: named ? 0 : .6,
      mouth: named ? 'smile' : 'O', handR: named ? undefined : [3.0, -4.6] }));
    popIn(t, N0 + .6, 850, 1960, () => shiva(850, 1960, 27, { boilKey: 'hshv', seed: 4, eyes: named ? 'normal' : 'look', lookX: named ? 0 : .7, lookY: named ? 0 : .5,
      mouth: named ? 'smile' : 'o', brow: named ? 0 : .6, handR: named ? undefined : [5.2, -9.6], bendR: 1.2 }));
    // Krishna, frowning at his palms; flips them; looks up at us; then at the others
    const kO = {
      boilKey: 'hkr', seed: 2, pose: 'stand', hx: t > N0 ? (t < N0 + .9 ? -.5 : .5) * (named ? 0 : 1) : .05 * Math.sin(t * 1.3),
      lookX: t > N0 && !named ? (t < N0 + .9 ? -.9 : .9) : 0, lookY: look || named ? 0 : (t > N0 ? 0 : .75),
      eyes: blinkAt(t, 1.95) || (named ? 'innocent' : t > N0 ? 'wide' : 'look'), brows: t < N0 ? -.6 : .5,
      mouth: named ? 'smile' : t > N0 ? 'O' : look ? 'flat' : 'pout', htilt: t < N0 ? .07 * Math.sin(t * 2.1) : 0,
      handL: named ? undefined : [-2.7, -9.6], handR: named ? undefined : [2.7, -9.6], handShapeL: 'open', handShapeR: 'open',
      handAL: flipH ? -1.1 : -2.0, handAR: flipH ? -2.0 : -1.1,
      emote: t < N0 ? '?' : undefined, emoteK: t < .4 ? 1 : 1, emoteAge: t + 1,
    };
    balKrishna(540, 1960, 36, kO);
    camEnd();
    caps(t);
    if (t > B0 - .45) { flushLetters(); cloudWipe(seg(t, B0 - .45, B0 + .45)); }
  }

  // ================= B · Krishna = dark; Ghanshyam, dark as a rain cloud; the rain =================
  function shotMonsoon(t, lt, dur) {
    const whip = t > C0 - .25 ? easeIn(seg(t, C0 - .25, C0)) * 800 : 0;
    camBegin(540 + whip, 1250, 1.0 + .012 * lt);
    monsoon(t, .5 * ease(seg(t, B0, GHAN)));
    const cx = lerp(1250, 790, ease(seg(t, B0, B0 + 2.6))), cy = lerp(1080, 1150, ease(seg(t, GHAN - .2, GHAN + .6)));
    const rk = clamp(seg(t, RAINC - .1, RAINC + .5));
    rain(t, cx - 300, cx + 300, cy + 60, 2000, rk, 'rainc');
    rain(t, -200, 1300, 700, 2000, .6 * clamp(seg(t, RAINC + .3, RAINC + 1.2)), 'rainw');
    rainCloud(cx, cy, 560, 1, 'rcloud');
    const reach = t > GHAN - .3, joy = t > RAINC;
    const X = 400, Y = 1920, u = 34;
    const kO = {
      boilKey: 'mkr', seed: 5, pose: 'stand',
      lookX: joy ? 0 : reach ? .8 : t > DARK ? 0 : .7, lookY: joy ? -.3 : reach ? -.6 : t > DARK ? .5 : -.7,
      eyes: blinkAt(t, B0 + 1.3) || (joy ? 'happy' : reach ? 'wide' : t > DARK ? 'sparkle' : 'look'), brows: reach && !joy ? .7 : 0,
      mouth: joy ? 'giggle' : reach ? 'O' : t > DARK ? 'smile' : 'O', wiggle: joy ? .5 * Math.sin((t - RAINC) * 9) : 0,
      handShapeL: 'open', handShapeR: 'open',
      dy: joy ? -.35 * Math.abs(Math.sin((t - RAINC) * 6)) : 0,
    };
    if (joy) { kO.handL = [-4.2, -15.6 + .6 * Math.sin(t * 9)]; kO.handR = [4.2, -15.6 + .6 * Math.cos(t * 9)]; }
    else if (reach) { kO.handR = kf(t, [[GHAN - .3, [2.4, -9.4]], [GHAN + .2, [6.4, -15.8]]], ease); kO.handL = [-2.6, -9.4]; }
    else if (t > DARK - .2) { kO.handL = [-2.7, -9.4]; kO.handR = [2.7, -9.4]; }
    balKrishna(X, Y, u, kO);
    if (reach && !joy && t > GHAN + .2) {   // the swatch: his hand against the cloud, the same blue
      const h = bkHand(X, Y, u, kO, 1), a = seg(t, GHAN + .2, GHAN + .9);
      glow(h[0] + 40, h[1] - 30, 120, '#CFE0FF', .6 * Math.sin(Math.PI * clamp(a * 1.2)));
      boilSeed('swatch');
      emote('spark', h[0] + 70, h[1] - 70, 26, backOut(clamp(a * 3)), t - GHAN);
    }
    camEnd();
    caps(t);
    if (t < B0 + .45) { flushLetters(); cloudWipe(seg(t, B0 - .45, B0 + .45)); }
  }

  // ================= C · Ram, dark as a blue lotus =================
  function shotPond(t, lt, dur) {
    const whip = t < C0 + .25 ? (1 - easeOut(seg(t, C0, C0 + .25))) * -800 : 0;
    camBegin(540 + whip, 1300, 1.05 + .012 * lt);
    pond(t);
    pondLotuses(t);
    const up = ease(seg(t, BLOTUS - .35, BLOTUS + .35));
    const rO = {
      boilKey: 'pram', seed: 6, kodanda: true, hx: lerp(.35, .2, up), lookX: lerp(.6, .3, up), lookY: lerp(.5, 0, up), htilt: .12 * up,
      eyes: up > .6 ? 'closed' : blinkAt(t, C0 + 1.2) || (t > RAMW ? 'happy' : 'normal'), mouth: 'smile', nod: 0,
      handR: [lerp(3.7, 3.1, up), lerp(-12.6, -19.0, up)], bendR: 1.1,
      armR: (uu, sw) => blueLotus(uu * .95, sw, 1, true),
    };
    ram(330, 1800, 24, rO);
    if (t > BLOTUS + .35) {
      const h = naradaHand(330, 1800, 24, rO, 1), a = seg(t, BLOTUS + .35, BLOTUS + 1.1);
      glow(h[0], h[1] - 40, 110, '#C8D8FF', .55 * Math.sin(Math.PI * clamp(a)));
      boilSeed('lspark');
      emote('spark', h[0] + 60, h[1] - 90, 22, backOut(clamp(a * 3)), t - BLOTUS);
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSK);
  }

  // ================= D · Vishnu on Shesha; megha-varnam: the clouds turn his blue =================
  function shotOcean(t, lt, dur) {
    const push_ = t > E0 - .45 ? easeIn(seg(t, E0 - .45, E0)) : 0;
    camBegin(540, lerp(1250, 1180, push_), 1.0 + .015 * lt + 1.6 * push_);
    const cl = ease(seg(t, MEGHA - .1, MEGHA + 1.0));
    ocean(t, cl);
    const awake = t > VISH - .1, up = t > MEGHA;
    shesha(540, 1640, 52, { boilKey: 'oss', eyes: awake ? 'normal' : 'closed', sway: .03 * Math.sin(t * 1.2) });
    vishnu(540, 1640, 52, { boilKey: 'ovs', chakraSpin: t * 2.4, eyes: up ? 'happy' : awake ? 'normal' : 'closed', lookX: up ? .2 : 0, brows: up ? .5 : 0,
      mouth: 'smile', handR: up ? kf(t, [[MEGHA, [2.4, -2.6]], [MEGHA + .5, [3.2, -6.0]]], ease) : undefined });
    if (up) { const a = seg(t, MEGHA + .3, MEGHA + 1.2); glow(540, 800, 420, '#CFE0FF', .35 * Math.sin(Math.PI * clamp(a))); }
    camEnd();
    caps(t);
    wipeIn(lt, DUSK);
    if (push_ > 0) { flushLetters(); flash(push_, '#FBF4E6'); }
  }

  // ================= E · paintings: the monsoon-dark stroke; the dark becomes blue; Krishna in it =================
  const SKY = [[130, 880], [380, 840], [660, 900], [930, 850]], SKY2 = [[160, 980], [470, 950], [900, 990]];
  const BL1 = [[350, 1110], [540, 1060], [730, 1120]], BL2 = [[320, 1260], [540, 1220], [770, 1280]], BL3 = [[350, 1420], [540, 1380], [730, 1430]];
  function shotPaper(t, lt, dur) {
    camBegin(540, 1100, 1.0 + .01 * lt);
    paperSheet(t);
    paintBowl(230, 1650, 90, BG.slate, 'bowl1');
    paintBowl(450, 1670, 90, BK.skin, 'bowl2');
    // the strokes and the brush that lays them
    const k1 = ease(seg(t, MONS + .2, MONS + 1.2)), k1b = ease(seg(t, MONS + 1.2, MONS + 1.9));
    const k2 = ease(seg(t, SO + .1, SO + .6)), k3 = ease(seg(t, SO + .6, SO + 1.1)), k4 = ease(seg(t, SO + 1.1, SO + 1.6));
    const e1 = brushStroke(SKY, k1, 130, BG.slate, 'sk1');
    const e1b = brushStroke(SKY2, k1b, 90, mixCol(BG.slate, '#5A6A8A', .4), 'sk2');
    const e2 = brushStroke(BL1, k2, 170, '#44609E', 'bl1');
    const e3 = brushStroke(BL2, k3, 200, '#4F74C0', 'bl2');
    const e4 = brushStroke(BL3, k4, 170, BK.skin, 'bl3');
    let tip, load = null;
    if (t < MONS + .2) { tip = kf(t, [[E0, [1150, 1250]], [MONS - .5, [230, 1625]], [MONS, [230, 1625]], [MONS + .2, SKY[0]]], ease); load = t > MONS - .3 ? BG.slate : null; }
    else if (t < MONS + 1.2) { tip = e1 || SKY[0]; load = BG.slate; }
    else if (t < MONS + 1.9) { tip = e1b || SKY2[0]; load = BG.slate; }
    else if (t < SO + .1) { tip = kf(t, [[MONS + 1.9, SKY2[2]], [SO - .45, [450, 1645]], [SO - .15, [450, 1645]], [SO + .1, BL1[0]]], ease); load = t > SO - .3 ? BK.skin : BG.slate; }
    else if (t < SO + .6) { tip = e2 || BL1[0]; load = BK.skin; }
    else if (t < SO + 1.1) { tip = e3 || BL2[0]; load = BK.skin; }
    else if (t < SO + 1.6) { tip = e4 || BL3[0]; load = BK.skin; }
    else tip = kf(t, [[SO + 1.6, BL3[2]], [BLUEW + .4, [1300, 900]]], ease), load = BK.skin;
    // Krishna, in the blue
    popIn(t, BLUEW - .05, 540, 1560, () => balKrishna(540, 1560, 26, { boilKey: 'pkr', seed: 7, pose: 'stand', eyes: t > BLUEW + .9 && t < BLUEW + 1.4 ? ['normal', 'happy'] : 'happy',
      mouth: 'grin', handR: [4.6, -14.4 + .5 * Math.sin(t * 8)], handShapeR: 'open' }));
    if (t < BLUEW + .5) paintBrush(tip[0], tip[1], -.75, load, 'brush');
    camEnd();
    caps(t);
    if (lt < .35) { flushLetters(); flash(1 - lt / .35, '#FBF4E6'); }
    wipeOut(lt, dur, BLUES);
  }

  // ================= F · Shiva: not blue at all; Karpura Gauram and the aarti; the throat =================
  function shotShiva(t, lt, dur) {
    camK(t, [[F0, [540, 1250, 1.0]], [KARP, [540, 1250, 1.06]], [THR0, [540, 1300, 1.12]], [THR0 + 1.1, [540, 1390, 1.75]], [I0, [540, 1395, 1.82]]]);
    kailash(t);
    const X = 540, Y = 1720, u = 32;
    const wk = ease(seg(t, NOTB - .15, NOTB + .75)), TAKE = NOTB + .75;
    const col = mixCol(SHV.skin, SHV_WHITE.col, wk), dk = mixCol(SHV.skinDk, SHV_WHITE.dk, wk), lt_ = mixCol(SHV.skinLt, SHV_WHITE.lt, wk);
    const tk = take(t, TAKE, .9), shocked = t > TAKE && t < KARP + .3;
    const drink = t > THR0 - .3 && t < SAVE + .2, tipK = ease(seg(t, THROAT - .35, THROAT + .05)) * (1 - ease(seg(t, THROAT + .6, THROAT + 1.0)));
    const sO = {
      boilKey: 'fshv', seed: 8, col, dk, lt: lt_, throat: ease(seg(t, THROAT, THROAT + .7)),
      eyes: shocked ? 'wide' : t > SAVE + .2 ? 'happy' : 'closed', mouth: shocked ? 'O' : 'smile', brow: shocked ? .8 : 0,
      lookX: shocked ? .15 : 0, sq: tk.sq, dy: tk.dy,
      emote: shocked ? '!' : undefined, emoteK: backOut(clamp((t - TAKE) * 4)), emoteAge: t - TAKE,
    };
    if (drink) {
      sO.handR = kf(t, [[THR0 - .3, [5.6, -4.6]], [THR0 + .3, [1.6, -9.6]], [THROAT + .9, [1.6, -9.6]], [SAVE + .2, [5.4, -5.0]]], ease); sO.bendR = 1.2;
      sO.armR = (uu, sw) => { push(); rotate(-.9 * tipK); poisonBowl(uu * 1.15, sw, t, 1 - seg(t, THROAT + .3, THROAT + 1.2)); pop(); };
    }
    shiva(X, Y, u, sO);
    if (wk > 0 && wk < 1) {   // the white sweeps down him like light
      const yb = lerp(Y - 22 * u, Y - 1 * u, wk);
      glow(X, yb, 300, '#FFFFFF', .55 * Math.sin(Math.PI * wk));
    }
    if (t > THROAT) glow(X, Y - 9.25 * u, 90, '#7FA6FF', .5 * ease(seg(t, THROAT, THROAT + .7)) * (1 - .3 * Math.sin(t * 3) ** 2));
    // the aarti: a devotee's thali circling clockwise before him, its camphor flame lighting his face
    if (t > KARP + .1 && t < THR0 - .2) {
      const a = (t - KARP) * 2.6, enter = ease(seg(t, KARP + .1, KARP + .7)), leave = ease(seg(t, THR0 - .9, THR0 - .2));
      const c = [X + 10, Y - 6.2 * u], hp = [lerp(1150, c[0] + 170 * Math.cos(a), enter - leave * enter), lerp(2000, c[1] + 70 * Math.sin(a), enter - leave * enter)];
      glow(X, Y - 12 * u, 260, '#FFC070', .3 * enter * (1 - leave));
      boilSeed('fthali'); push(); translate(hp[0], hp[1]); aartiThali(30, 1.2, 1); pop();
    }
    camEnd();
    caps(t);
    wipeIn(lt, BLUES);
    wipeOut(lt, dur, HOME);
  }

  // ================= I · the child colouring Krishna blue; "now you know" =================
  function shotKid(t, lt, dur) {
    camBegin(540, 1250, 1.04 + .01 * lt);
    home(t);
    boilSeed('divan');
    paint(rrPts(120, 1560, 840, 70, 30), { wash: BG.divan, fill: BG.divanDk, fillOp: 50, tex: .4, ink: BG.ink, sw: 1.2 });
    paint(rectPts(140, 1620, 800, 190, 3), { wash: BG.divanDk, ink: BG.ink, sw: 1.2 });
    const show = ease(seg(t, NOWK - .2, NOWK + .3)), asks = t > ASKK && t < NOWK;
    const ck = clamp(seg(t, I0 + .2, ASKK));
    const X = 540, Y = 1620, u = 38;
    const by = -3.9 + .4 * show;
    const aO = {
      boilKey: 'kaa', seed: 9, pose: 'sit', kick: .25 * Math.sin(t * 2.4),
      lookY: show || asks ? 0 : .7, lookX: 0, eyes: show ? 'happy' : asks ? 'wide' : 'look', brows: asks ? .8 : 0,
      mouth: show ? 'open' : asks ? 'O' : 'smirk', htilt: asks ? .12 : .05 * Math.sin(t * 1.7),
      handL: [-3.05, by + .4], handShapeL: 'hold',
      handR: show ? [3.05, by + .4] : t < ASKK ? [.4 + .9 * Math.sin(t * 13), -3.9 + .45 * Math.cos(t * 9.5)] : [1.4, -3.2], handShapeR: show ? 'hold' : 'fist',
      held: (uu, sw) => drawingBoard(0, by * uu, 6.6 * uu, 4.6 * uu, ck, sw),
      emote: asks ? '?' : show ? 'spark' : undefined, emoteK: backOut(clamp((t - (show ? NOWK : ASKK)) * 4)), emoteAge: t - ASKK,
    };
    aarav(X, Y, u, aO);
    if (!show) {   // the blue crayon in his fist
      const h = aaravHand(X, Y, u, aO, 1);
      boilSeed('crayon');
      paint(ribbon([[h[0] - 6, h[1] + 20], [h[0] + 10, h[1] - 18], [h[0] + 22, h[1] - 46]], 12, 14), { wash: BG.crayon, ink: BG.ink, sw: 1 });
    }
    camEnd();
    caps(t);
    wipeIn(lt, HOME);
    wipeOut(lt, dur, PEACH);
  }

  // ================= J · the ask: white Shiva and Krishna =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1250, 1.0 + .01 * lt);
    peachGround(t, 'peach2');
    shiva(330, 1840, 24, { boilKey: 'ashv', seed: 10, ...SHV_WHITE, throat: 1, eyes: blinkAt(t, J0 + 2.2) || 'normal', mouth: 'smile', handR: [4.4, -12.6], bendR: 1.2,
      armR: undefined });
    const wave = Math.sin((t - J0) * 7);
    balKrishna(760, 1850, 28, { boilKey: 'akr', seed: 11, pose: 'stand', eyes: t > YES && t < YES + .6 ? ['normal', 'happy'] : 'happy', mouth: 'grin',
      handR: [5.2 + .7 * wave, -15.2], handShapeR: 'open', hx: -.15, lookX: -.2 });
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  // ================= K · the card =================
  function shotCard(t, lt) {
    dealCard(t, CARDC);
    dealStrike(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, PEACH); }
  }

  shots([[0, shotHook], [B0, shotMonsoon], [C0, shotPond], [D0, shotOcean], [E0, shotPaper], [F0, shotShiva], [I0, shotKid], [J0, shotAsk], [CARD, shotCard]]);
})();
