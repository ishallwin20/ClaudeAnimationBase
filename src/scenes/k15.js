// k15.js: "We hit 15,000. So the cast threw a PARTY.", the 15K thank-you reel (~61 s, captions, SFX, no voiceover).
// Every caption holds at least 3 s (the owner asked for longer text). The cast of the hit reels throws a party and each one wrecks it with a callback: Sher carries the cake (Vahana
// Union), Maa Kali cuts the cake with ONE swing of her khadga, Bal Hanuman eats the lamp (the sun reel), Shumbha proposes
// in the dark and gets ONE LOOK (ad 14), a goat poses as Nandi (the "looks like a goat" comment), Ravana lifts the whole
// table and Shiva answers with ONE TOE (ad 15). The wreck, the thank-you, the group photo, the gift, the 15K Family
// Deal card. STORYBOARD.md has the plan; the sets and props are in k15_props.js.
// All times are video time (t); the SFX (tools/k15_sfx.mjs) uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/k15_sfx.mjs)
  const UP = 0.6, B0 = 2, SET = 3.7, PHEW = 4.7, B2 = 5, C0 = 8;
  const RAISE = 8.9, SWING = 10, BEAT = 10.2, SPLIT = 10.9, WINK = 12.2, D0 = 14.8;
  const EYE = 15.1, DROOL = 15.8, WIG = 17.2, LEAP = 17.7, GULP = 18.3, DARK = 18.45, E0 = 22.6;
  const RING = 23, KNEEL = 23.4, LOOK = 26, EYE3 = 26.3, FLEE = 27.2, F0 = 29.8;
  const GOAT = 29.9, NANDI = 32.4, BUTT = 33.2, LISTEN = 33.3, G0 = 36.4;
  const MINE = 36.8, GRAB = 39.4, LIFT = 39.8, TOE = 42.8, SPLAT = 43.4, MILLION = 44.4, H0 = 46.8;
  const TOPPER = 47, HOST = 50.2, TIMER = 52.2, FLASH = 53.6, I0 = 58.4;
  const GIFT = 58.6, OPEN = 59.8, FLY = 60.6, CARD = 62.8;
  const CAP_T = 62.9, COVERS = 63.2, PRICE = 64, STRIKE = 64.5, DEAD = 65, PILL = 65.5, SUB = 66, FOLLOW = 66.5;
  const CARDC = { cap: CAP_T, covers: COVERS, price: PRICE, strike: STRIKE, dead: DEAD, pill: PILL, sub: SUB, follow: FOLLOW, logo: CAP_T - .1 };

  const GOLDC = '#F5C542';
  const { TX, TY, TW, FY, CX } = HALL;
  const inW = (t, a, b) => t >= a && t < b;
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const local = (wx, wy, X, Y, u) => [(wx - X) / u, (wy - Y) / u];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['We just hit', 470, -1, B0 + 1 - .1, 70], ['15,000', 610, -1, B0 + 1 - .1, 200, GOLDC], ['followers!', 750, -1, B0 + 1 - .1, 70],
    ['So the whole cast', 480, B0, B2 - B0 - .1, 64], ['threw a PARTY.', 580, B0 + .35, B2 - B0 - .45, 92, GOLDC],
    ['SHER carried the cake.', 480, B2, C0 - B2 - .1, 64, GOLDC], ['(He does ALL the work.)', 570, B2 + .4, C0 - B2 - .5, 56],
    ['Maa KALI was asked', 480, C0, SPLIT + .1 - C0, 66], ['to cut the cake.', 575, C0 + .4, SPLIT + .1 - C0 - .4, 80, GOLDC],
    ['ONE swing.', 500, SPLIT + .2, D0 - SPLIT - .3, 120, GOLDC], ['Perfect slices.', 625, SPLIT + .7, D0 - SPLIT - .8, 66],
    ['Bal HANUMAN saw the lamp…', 455, D0, DARK - D0 + .05, 54], ['…and thought it was a MANGO.', 535, D0 + 1.2, DARK - D0 - 1.15, 54, GOLDC],
    ['NOT AGAIN,', 500, DARK + .1, E0 - DARK - .2, 80], ['HANUMAN!', 610, DARK + .35, E0 - DARK - .45, 118, GOLDC],
    ['In the dark, SHUMBHA', 480, E0, LOOK - E0 - .1, 60], ['proposed to DURGA. AGAIN.', 565, E0 + .4, LOOK - E0 - .5, 58, GOLDC],
    ['Her answer?', 490, LOOK, F0 - LOOK - .1, 70], ['ONE LOOK.', 605, LOOK + .5, F0 - LOOK - .6, 120, GOLDC],
    ['You said our NANDI', 480, F0, LISTEN - F0 - .1, 62], ['looked like a GOAT…', 570, F0 + .4, LISTEN - F0 - .5, 66, GOLDC],
    ['We LISTENED.', 520, LISTEN, G0 - LISTEN - .1, 104, GOLDC],
    ['RAVANA wanted', 480, G0, GRAB + .2 - G0 - .1, 66], ['the WHOLE cake.', 575, G0 + .35, GRAB + .2 - G0 - .45, 80, GOLDC],
    ['So he lifted', 1330, GRAB + .2, TOE - GRAB - .3, 66], ['the WHOLE TABLE.', 1425, GRAB + .55, TOE - GRAB - .65, 80, GOLDC],
    ["Shiva's answer?", 1310, TOE, H0 - TOE - .1, 66], ['ONE TOE.', 1420, TOE + .55, H0 - TOE - .65, 124, GOLDC],
    ['(1 MILLION of you watched this one.)', 500, MILLION, H0 - MILLION - .1, 46],
    ['The party was', 480, TOPPER, HOST - TOPPER - .1, 66], ['a DISASTER.', 580, TOPPER + .35, HOST - TOPPER - .45, 96, GOLDC],
    ['But YOU made us', 480, HOST, FLASH - HOST - .1, 66], ['a FAMILY of 15,000.', 580, HOST + .4, FLASH - HOST - .5, 76, GOLDC],
    ['THANK YOU', 500, FLASH + .25, I0 - FLASH - .3, 150, GOLDC], ['for every like, share & comment.', 625, FLASH + .7, I0 - FLASH - .75, 48],
    ['Our GIFT to the', 480, I0, CARD - I0 - .1, 66], ['15K FAMILY:', 590, I0 + .4, CARD - I0 - .5, 110, GOLDC],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // ================= A + B · the hook: the cake on Sher's head; he sets it on the table =================
  const SX = 150, SU = 17, CS = .85;
  function shotSher(t, lt) {
    camK(t, [[0, [150, 940, 1.8]], [UP, [150, 940, 1.8]], [B0 + .5, [300, 1170, 1.5]], [C0, [310, 1170, 1.52]]]);
    hallSet(t);
    table(TX, TY, TW);
    // Sher: the cake on his head, paws up steadying it; leans and tips it onto the table; slumps, wipes his brow
    const tip = ease(seg(t, SET - .8, SET)), back = ease(seg(t, SET + .1, SET + .6)), lean = 2.2 * tip * (1 - back);
    const wob = t < SET - .8 ? Math.sin(t * 7) : 0;
    const lo = { boilKey: 'sher', hat: lionBand(), lean: lean + wob * .25, htilt: .28 * tip * (1 - back) + wob * .03, noShadow: false };
    if (t < SET) Object.assign(lo, { eyes: 'squeeze', mouth: 'wobble', pawL: [-3.0, -15.6], pawR: [3.0, -15.6], pawShapeL: 'pad', pawShapeR: 'pad', worry: 1, emote: 'sweat', emoteK: 1, emoteAge: t });
    else if (t < PHEW) Object.assign(lo, { eyes: 'wide', mouth: 'O', lookX: .8, emote: 'sweat', emoteK: 1, emoteAge: t });
    else Object.assign(lo, { eyes: 'tired', mouth: 'open', mouthK: .4 + .3 * Math.abs(Math.sin(t * 7)), slump: .6 * ease(seg(t, PHEW, PHEW + .4)), pawR: [1.6, -13.2 + Math.sin(t * 9) * .3], pawShapeR: 'pad', lookX: -.3, emote: 'sweat', emoteK: 1, emoteAge: t });
    lion(SX, FY, SU, lo);
    // the cake: on his head (wobbling), slides off on an arc onto the table
    const head = [SX + (lean + wob * .25) * SU * .7, FY - 16.5 * SU], spot = [CX, TY - 8];
    const k = ease(seg(t, SET - .6, SET));
    const p = k <= 0 ? head : k >= 1 ? spot : arcPt(head, spot, 60, k);
    const rot = t < SET - .6 ? wob * .04 + Math.sin(t * 2.3) * .02 : (1 - k) * .12 + (t > SET ? spring(t, SET, 9, 18) * .04 : 0);
    push(); translate(p[0], p[1]); rotate(rot); cake(0, 0, CS, t, { key: 'cake' }); pop();
    if (t > SET && t < SET + .5) vanishPuff(spot[0], spot[1], 70, t - SET, 'setpuff', ['#FFF3E8', '#F4D6C6']);
    camEnd();
    caps(t);
    if (t > C0 - .3) { flushLetters(); whipH(seg(t, C0 - .3, C0) * 1.3, 1, t, [KP.wall, KP.marigold]); }
  }

  // ================= C · Maa Kali cuts the cake: ONE swing =================
  const KX = 640, KY = 1400, KU = 20;
  function shotKali(t, lt) {
    camK(t, [[C0, [520, 1090, 1.45]], [SWING, [500, 1080, 1.5]], [SPLIT + .3, [480, 1070, 1.6]], [WINK, [520, 1060, 1.56]], [D0, [520, 1060, 1.58]]]);
    hallSet(t);
    // Kali behind the table: smiles at the cake, raises her khadga, ONE swing (eyes calmly shut), the beat, the slices; a wink
    const up = ease(seg(t, RAISE - .4, RAISE)), sw = easeIn(seg(t, SWING - .12, SWING + .03)), back = ease(seg(t, SPLIT + .6, WINK));
    const raised = [6.5, -31], low = [-7.5, -14], rest = [5.6, -26];
    const hand = t < SWING - .12 ? [lerp(rest[0], raised[0], up), lerp(rest[1], raised[1], up)] : t < SPLIT + .6 ? [lerp(raised[0], low[0], sw), lerp(raised[1], low[1], sw)] : [lerp(low[0], rest[0], back), lerp(low[1], rest[1], back)];
    const ko = { boilKey: 'kali', backR: hand, khadgaA: t < SWING - .12 ? -.2 * up : t < SPLIT + .6 ? lerp(-.2, -2.3, sw) : lerp(-2.3, 0, back), hx: -.4 };
    if (t < RAISE - .4) Object.assign(ko, { eyes: 'happy', lookX: -.8, lookY: .5 });
    else if (t < SWING - .12) Object.assign(ko, { eyes: 'determined', lookX: -.8, lookY: .5 });
    else if (t < WINK) Object.assign(ko, { eyes: 'closed', hx: -.2 });
    else Object.assign(ko, { eyes: 'wink', hx: 0, emote: 'spark', emoteK: 1, emoteAge: t - WINK });
    kali(KX, KY, KU, ko);
    table(TX, TY, TW);
    const cut = t < SPLIT ? 0 : .001 + ease(seg(t, SPLIT, SPLIT + .4));
    cake(CX, TY - 8, CS, t, { key: 'cake', cut });
    // the gleam: one diagonal arc through the cake
    slashGleam([[KX + 120, 820], [CX + 110, 960], [CX, 1110], [CX - 140, 1270]], seg(t, SWING - .12, SWING + .03), t - SWING - .03, 'kslash');
    if (t > SPLIT) sparkleBurst(CX, TY - 120, 120, t - SPLIT, 'splitburst', 8);
    camEnd();
    if (lt < .3) whipH(1 - lt / .3, 1, t, [KP.wall, KP.marigold]);
    caps(t);
    if (t > D0 - .3) { flushLetters(); whipV(seg(t, D0 - .3, D0) * 1.3, 1, t, [KP.wall, KP.paperLt]); }
  }

  // ================= D · Bal Hanuman eats the lamp =================
  const HX = 255, HY = TY - 8, HU = 12, LP = [560, 950], LR = 92;
  function shotHanuman(t, lt) {
    camK(t, [[D0, [400, 1080, 1.6]], [LEAP, [420, 1060, 1.55]], [DARK + .6, [330, 1150, 1.75]], [E0, [330, 1160, 1.8]]]);
    hallSet(t, { dark: t > DARK });
    table(TX, TY, TW);
    const ctop = cake(CX, TY - 8, CS, t, { key: 'cake', cut: 1 });
    // the lamp: hangs, shines, shrinks into his mouth at the gulp
    const fly = seg(t, LEAP, GULP), gone = t > GULP + .05;
    const ho = { boilKey: 'hanu' };
    let hx = HX, hy = HY;
    if (t < LEAP) {
      Object.assign(ho, { pose: 'sit', eyes: t > EYE ? 'sparkle' : 'normal', lookX: .7, lookY: -1, mouth: t > DROOL ? 'O' : 'smile', drool: ease(seg(t, DROOL, DROOL + .5)), wiggle: t > WIG ? Math.sin((t - WIG) * 26) * .9 : 0, handL: t > WIG ? [-1.5, -6] : undefined, handR: t > WIG ? [1.5, -6] : undefined });
      if (t > WIG) ho.dy = .5 * Math.sin(seg(t, WIG, LEAP) * Math.PI);
    } else if (t < GULP + .7) {   // the leap: an arc up to the lamp, belly first; AAM
      const a = arcPt([HX, HY - 60], [LP[0] - 10, LP[1] + 40], 120, easeOut(fly));
      const fall = seg(t, GULP + .2, GULP + .7);
      hx = lerp(a[0], HX + 40, ease(fall)); hy = lerp(a[1], HY - 60, easeIn(fall));
      Object.assign(ho, { pose: 'fly', rot: lerp(.6, .1, fly), kick: t * 9, tail: 'stream', eyes: t < GULP ? 'sparkle' : 'happy', mouth: t < GULP ? 'aam' : 'puff', mouthK: 1.2, puff: t > GULP ? 1 : 0, cheekGlow: t > GULP ? 1 : 0, handL: [-2.2, -12], handR: [2.2, -12] });
    } else {   // back on the table: cheeks full of lamp, glowing in the dark
      hx = HX + 40;
      const land = spring(t, GULP + .7, 9, 14);
      Object.assign(ho, { pose: 'sit', sq: land * .2, eyes: t < GULP + 2.2 ? 'happy' : 'wide', lookX: t < GULP + 2.2 ? 0 : .6, mouth: 'puff', puff: 1, cheekGlow: 1, blush: .4, emote: t > GULP + 2.2 ? '!?' : null, emoteK: 1, emoteAge: t - GULP - 2.2 });
    }
    if (!gone) {
      const s = 1 - easeIn(seg(t, GULP - .15, GULP + .05)) * .9;
      lantern(LP[0], LP[1], LR * s, t, { on: 1, cord: true });
    } else { boilSeed('cordend'); inkLine([[LP[0], -200], [LP[0], LP[1] - LR]], 2, KP.ink, 'ink', 0); }
    balHanuman(hx, hy, HU, ho);
    // the dark: everything but the candles and his cheeks
    if (t > DARK) {
      veil(easeOut(seg(t, DARK, DARK + .12)), KP.dark, 'darkveil', 205);
      candleFlames(CX, ctop, CS, t);
      for (const s of [-1, 1]) { const c = bhCheek(hx, hy, HU, ho, s); glow(c[0], c[1], 44, KP.paperLt, .9); }
      glow(...bhHead(hx, hy, HU, ho), 120, KP.paper, .35);
    }
    camEnd();
    if (lt < .3) whipV(1 - lt / .3, 1, t, [KP.wall, KP.paperLt]);
    caps(t);
  }

  // ================= E · Shumbha proposes in the candlelight; Durga's third eye =================
  const UX = 330, UY = 1560, UU = 12.5, DX = 760, DY = 1560, DU = 11.5;
  function shotShumbha(t, lt) {
    const sh = inW(t, EYE3, EYE3 + .5) ? shakeXY(t, 10) : [0, 0];
    camK(t, [[E0, [545, 1160, 1.55]], [LOOK, [560, 1155, 1.6]], [EYE3 + .2, [620, 1140, 1.7]], [F0, [580, 1150, 1.6]]], sh);
    hallSet(t, { dark: true });
    table(TX, TY, TW);
    const ctop = cake(CX, TY - 8, CS, t, { key: 'cake', cut: 1 });
    boilSeed('cordend'); inkLine([[LP[0], -200], [LP[0], LP[1] - LR]], 2, KP.ink, 'ink', 0);
    // Durga: smiles politely, then one look; the third eye opens
    const e3 = ease(seg(t, EYE3, EYE3 + .25));
    const dgo = { boilKey: 'durga', eyes: t < LOOK ? 'normal' : 'angry', mouth: t < LOOK ? 'smile' : 'flat', brows: t < LOOK ? 0 : -1, lookX: -.7, hx: -.2, eye3: e3, aura: e3 * .8 };
    durga(DX, DY, DU, dgo);
    // Shumbha: walks in, the ring box held out, bows; then terror, the box drops, he flees in a puff
    const fled = t > FLEE;
    const ux = lerp(UX - 120, UX, ease(seg(t, E0, RING)));
    const uo = { boilKey: 'shumbha', kind: 'shumbha', sword: false, shield: false, fistR: false, fistL: false, lookX: .8 };
    const bow = ease(seg(t, KNEEL, KNEEL + .4)) * (1 - ease(seg(t, EYE3, EYE3 + .2)));
    if (t < EYE3) Object.assign(uo, { eyes: 'happy', mouth: 'grin', blush: .8, nod: bow * 1.2, lean: bow * .8, handR: [5.2, -12.5 + bow], handL: [-2.2, -10], emote: t > RING ? 'hearts' : null, emoteK: 1, emoteAge: t - RING, walk: t < RING ? t * 9 : undefined });
    else Object.assign(uo, { eyes: 'scared', mouth: 'wobble', sweat: 1, shake: 1, handR: [4.2, -9], handL: [-3.5, -16], lookX: 1, sq: spring(t, EYE3, 10, 18) * .15 });
    const ringOpen = ease(seg(t, RING, RING + .3));
    if (!fled) {
      if (t < EYE3) uo.armR = (u, sw) => ringBox(0, -.2 * u, 3.6 * u, ringOpen, 'ringbox');
      asura(ux, UY, UU, uo);
    }
    if (t > EYE3) {   // the dropped ring box, on the floor
      const k = easeIn(seg(t, EYE3, EYE3 + .35)), hand = [UX + 5.2 * UU, UY - 12.5 * UU];
      ringBox(hand[0] + 20 * k, lerp(hand[1], UY + 10, k), 3.6 * UU, 1, 'ringbox');
    }
    vanishPuff(UX, UY - 150, 160, t - FLEE, 'fleepuff', ['#4A3A5A', '#8A7A9A']);
    // the candlelight veil; the glare
    veil(1, KP.dark, 'darkveil', 170 * (1 - .6 * e3));
    candleFlames(CX, ctop, CS, t);
    if (!fled && t > RING && t < EYE3) { const hp = asuraHand(ux, UY, UU, uo, 1); glow(hp[0], hp[1] - 2.4 * UU, 120, '#FFF6D6', .8 * ringOpen); }
    if (e3 > 0) {
      const eye = durgaEye3(DX, DY, DU, dgo);
      veil(e3 * (1 - .5 * seg(t, EYE3 + .3, F0)), KP.red, 'redveil', 120);
      glow(eye[0], eye[1], 260 * e3, '#FF5A3A', .9);
      glow(eye[0], eye[1], 60, '#FFF0D0', .9 * e3);
    }
    camEnd();
    caps(t);
    if (t > F0 - .15) flash(seg(t, F0 - .15, F0), '#FFF0D8');
  }

  // ================= F · the goat; the real Nandi =================
  function shotGoat(t, lt) {
    camK(t, [[F0, [180, 1330, 1.6]], [NANDI, [160, 1330, 1.6]], [BUTT - .2, [150, 1360, 1.75]], [G0, [150, 1370, 1.8]]]);
    hallSet(t);
    table(TX, TY, TW);
    cake(CX, TY - 8, CS, t, { key: 'cake', cut: 1 });
    lantern(LP[0], LP[1], LR, t, { on: 1 });   // he spat it back out (a little sheepish lamp)
    // the goat: trots in from the door, poses, chin up; butted out of frame on an arc
    const GU = 16, gy = 1600;
    const gx = kf(t, [[F0, -260], [GOAT + 1.6, 230]], easeOut);
    const flyK = seg(t, BUTT, BUTT + .9);
    const gp = flyK > 0 ? arcPt([230, gy], [900, gy - 120], 360, easeOut(flyK)) : [gx, gy];
    const pose = t > GOAT + 1.6 && t < BUTT;
    goat(gp[0], gp[1], GU, { boilKey: 'goat', walk: t < GOAT + 1.6 ? t * 9 : null, chinUp: pose, eyes: flyK > 0 ? 'wide' : pose ? 'happy' : 'normal', grin: pose ? 1 : 0, rot: flyK * 5 });
    if (t > BUTT) { const [gx2, gy2] = goatHead(gp[0], gp[1], GU); const bxm = Math.min(gx2 + 30, 330); bubble('MEH!', bxm, gy2 - 110, 46, t - BUTT, { life: 1.0, tail: [Math.min(gx2, 360), gy2 - 30] }); }
    // Nandi: walks in, lowers his head, butts; stands proud
    if (t > NANDI - .2) {
      const nx = kf(t, [[NANDI - .2, -340], [BUTT - .2, 30], [BUTT + .05, 70], [BUTT + .5, 40]], ease);
      const nod = t < BUTT - .3 ? .05 : t < BUTT + .2 ? .45 * Math.sin(seg(t, BUTT - .3, BUTT + .2) * Math.PI) : -.2 * ease(seg(t, BUTT + .4, BUTT + .9));
      nandi(nx, 1610, 13, { boilKey: 'nandi', walk: t < BUTT - .2 ? t * 7 : 0, nod, eyes: t < BUTT - .2 ? 'determined' : t > BUTT + .5 ? 'happy' : 'normal', emote: t > BUTT + .7 ? 'spark' : null, emoteK: 1, emoteAge: t - BUTT - .7 });
    }
    sparkleBurst(175, 1470, 60, t - BUTT, 'buttburst', 7);
    camEnd();
    if (lt < .25) flash(1 - lt / .25, '#FFF0D8');
    caps(t);
    if (t > G0 - .3) { flushLetters(); brushWipe((t - (G0 - .3)) / .6, [KP.marigold, KP.dado]); }
  }

  // ================= G · Ravana lifts the table; ONE TOE; SPLAT =================
  const RX = 520, RY = 1500, RU = 24, LIFTY = 835;
  function shotRavana(t, lt) {
    const sh = shakeXY(t, (inW(t, LIFT, TOE) ? 4 : 0) + (t > SPLAT ? 26 * (1 - seg(t, SPLAT, SPLAT + .6)) : 0));
    camK(t, [[G0, [480, 1140, 1.15]], [GRAB, [480, 1130, 1.12]], [LIFT + .6, [480, 1000, .95]], [TOE + .2, [480, 980, .95]], [SPLAT, [480, 1080, 1.0]], [H0, [480, 1100, 1.04]]], sh);
    hallSet(t);
    lantern(LP[0] + 260, LP[1] - 300, LR * .8, t, { on: 1 });
    // the table: lifted overhead (LIFT), shaking; slammed down at the splat
    const up = ease(seg(t, LIFT, LIFT + .9)), down = easeIn(seg(t, SPLAT - .12, SPLAT));
    const ty = lerp(TY, LIFTY, up * (1 - down)) + (inW(t, LIFT + .9, SPLAT) ? Math.sin(t * 30) * 4 : 0);
    const trot = inW(t, LIFT, SPLAT) ? Math.sin(t * 3) * .03 * up : 0;
    const lifted = up > .02 && t < SPLAT;
    const squash = t > SPLAT ? .3 * (1 - .5 * seg(t, SPLAT + .8, H0)) + spring(t, SPLAT, 8, 16) * .06 : 0;
    const heads = [];
    for (let i = 0; i < 10; i++) {
      let h = {};
      if (i === 0) h = { eyes: 'closed', mouth: 'O', bubble: .45 + .45 * Math.sin(t * 2.6) };
      else if (t < MINE) h = { eyes: 'normal', mouth: 'smile', lookY: .8, lookX: -.3 };
      else if (t < GRAB) h = { eyes: 'wide', sparkle: 1, mouth: 'open', mouthK: .8, drool: 1, lookY: .8, lookX: -.4, sq: spring(t, MINE + i * .05, 9, 20) * .15 };
      else if (t < TOE) h = { eyes: 'squeeze', mouth: 'teeth', sweat: 1, tint: RVN.angry, tintK: .2 + .4 * up };
      else if (t < SPLAT) h = { eyes: 'wide', mouth: 'O', lookY: -1, sweat: 1 };
      else h = { eyes: i % 3 ? 'swirl' : 'x', mouth: 'wobble' };
      if (i === 6 && inW(t, MINE, GRAB)) Object.assign(h, { mouth: 'open', mouthK: 1.3, goldTooth: true });
      if (i === 0 && t > SPLAT + .3) Object.assign(h, { eyes: 'normal', mouth: 'O', bubble: 0, emote: '?', emoteK: 1, emoteAge: t - SPLAT - .3 });
      heads.push(h);
    }
    const ro = { boilKey: 'ravana', heads, sq: squash, shake: inW(t, LIFT, SPLAT) ? .5 : 0 };
    let ctop = 0;
    ro.between = () => {   // the table and cake: over the heads, under the front arms
      table(TX, ty, TW, { rot: trot, legs: lifted, h: lifted ? 60 : undefined, key: 'rtable' });
      push(); translate(TX, ty); rotate(trot); translate(-TX, -ty);
      ctop = cake(CX, ty - 8, CS, t, { key: 'cake', cut: 1, splat: t > SPLAT ? 1 : 0, topper: t < SPLAT, candles: t < SPLAT });
      pop();
    };
    if (t > GRAB && t < SPLAT) ro.arm = (a, s, k, d) => {   // the upper five pairs grip the table's underside
      if (k > 4) return null;
      const w = ease(seg(t, GRAB + hash(a) * .2, GRAB + .3 + hash(a) * .2));
      const ex = TX + s * (40 + k * 45), tg = local(ex, ty + 26, RX, RY, RU);
      return { hand: [lerp(d.hand[0], tg[0], w), lerp(d.hand[1], tg[1], w)], front: false, shape: w > .8 ? 'fist' : 'open', bend: .9 };
    };
    ravana(RX, RY, RU, ro);
    // ONE TOE: Shiva's foot from above, onto the cake
    if (inW(t, TOE, SPLAT + .5)) {
      const drop = kf(t, [[TOE, -700], [TOE + .45, 0]], easeIn), lift = t > SPLAT ? 700 * easeIn(seg(t, SPLAT + .1, SPLAT + .5)) : 0;
      shivaFoot(CX + 26, ty - 8 - 205 * CS + drop - lift + (t > TOE + .45 ? 30 * down : 0), 88, { ash: true });
    }
    if (t > SPLAT) {   // frosting everywhere
      const age = t - SPLAT;
      for (let i = 0; i < 9; i++) splat(TX - 380 + hash(i * 3.7) * 760, TY - 520 + hash(i * 5.1) * 420, 26 + 22 * hash(i), 'g' + i, i % 3 ? KP.pink : KP.icing, seg(age, i * .03, .25 + i * .03));
      impact(CX, TY - 60, age, 190, 'splatimp');
    }
    if (inW(t, MINE, GRAB)) { const [hx, hy] = ravanaHead(RX, RY, RU, ro, 6); bubble('MINE!', hx + 30, hy - 2.9 * RU, 44, t - MINE - .3, { life: GRAB - MINE - .3, tail: [hx + 10, hy - 2.2 * RU] }); }
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [KP.marigold, KP.dado]); }
    if (t > SPLAT) {   // splats on the lens
      const age = t - SPLAT, fade = 1 - seg(t, SPLAT + 1.6, SPLAT + 2.2);
      for (let i = 0; i < 3; i++) splat([150, 900, 230][i], [1380, 1250, 1460][i], [70, 90, 55][i], 'lens' + i, i % 2 ? KP.pink : KP.icing, seg(age, .05 + i * .06, .3 + i * .06) * fade);
    }
    caps(t);
    if (t > H0 - .3) { flushLetters(); brushWipe((t - (H0 - .3)) / .6, [KP.pink, KP.icing]); }
  }

  // ================= H · the wreck; thank you; the group photo =================
  function shotWreck(t0, lt) {
    const t = Math.min(t0, FLASH);   // the photo freezes
    const frz = t0 > FLASH;
    camK(t, [[H0, [480, 1420, 1.2]], [HOST, [480, 1420, 1.22]], [TIMER, [480, 1425, 1.2]], [FLASH, [480, 1425, 1.2]]]);
    hallSet(t);
    lantern(LP[0] + 220, LP[1] - 300, LR * .7, t, { on: 1 });
    const photo = t > TIMER + .2;   // everyone looks at the camera
    // the back row: Durga, Ravana behind the wrecked table, Kali
    const DO = { boilKey: 'hdurga', eyes: photo ? 'happy' : 'normal', mouth: photo ? 'grin' : 'flat', lookX: .5 };
    durga(165, 1560, 9.5, DO);
    splat(...durgaHead(165, 1560, 9.5, DO).map((v, i) => v - i * 40), 22, 'hd', KP.pink);
    const rheads = [];
    for (let i = 0; i < 10; i++) rheads.push(i === 0 ? { eyes: 'closed', mouth: 'O', bubble: .5 + .4 * Math.sin(t * 2.6) } : photo ? { eyes: 'happy', mouth: 'grin' } : { eyes: i % 2 ? 'swirl' : 'normal', mouth: 'wobble' });
    const ro = { boilKey: 'hravana', heads: rheads, between: () => {
      table(TX, TY + 170, TW, { key: 'htable', rot: .03 });
      cake(CX, TY + 162, CS, t, { key: 'hcake', splat: 1, topper: false, candles: false });
      const k = easeIn(seg(t, TOPPER, TOPPER + .5));   // the 15K topper falls in and lands upright in the mess
      if (t > TOPPER) topper15K(CX - 60, lerp(TY - 700, TY + 125, k), 62 * CS, k < 1 ? (1 - k) * 2 : spring(t, TOPPER + .5, 7, 12) * .25, 'htopper');
    } };
    ravana(TX, 1540, 13, ro);
    [1, 4, 7].forEach((i, j) => { const [hx, hy] = ravanaHead(TX, 1540, 13, ro, i); splat(hx + 6, hy - 22, 16, 'hr' + j, j % 2 ? KP.pink : KP.icing); });
    const KO = { boilKey: 'hkali', eyes: photo ? 'happy' : 'wide', bite: photo ? 0 : .6, blush: .4, hx: -.3 };
    kali(790, 1560, 10, KO);
    splat(...kaliMouth(790, 1560, 10, KO).map((v, i) => v - i * 80), 18, 'hk', KP.icing);
    // Hanuman on the table's end
    balHanuman(700, TY + 162, 8, { boilKey: 'hhanu', pose: 'sit', eyes: photo ? 'happy' : 'normal', mouth: photo ? 'grin' : 'smile', blush: .3 });
    // the front row: Nandi peeking in, Sher, Bal Bappa, Shiva seated
    nandi(20, 1730, 10, { boilKey: 'hnandi', eyes: photo ? 'happy' : 'normal', lookX: .5 });
    lion(250, 1730, 11, { boilKey: 'hsher', hat: lionBand(), eyes: photo ? 'happy' : 'tired', mouth: photo ? 'grin' : 'flat', slump: photo ? 0 : .5 });
    splat(250, 1730 - 15.5 * 11, 22, 'hs', KP.pink);
    shiva(840, 1790, 7.5, { boilKey: 'hshiva', ...feel('serene', t), eyes: photo ? 'happy' : 'closed', mouth: 'smile' });
    // Bal Bappa, the host: thank-you, arms folded, a little bow
    const bowK = ease(seg(t, HOST, HOST + .5)) * (1 - ease(seg(t, TIMER - .3, TIMER)));
    balBappa(520, 1760, 11, { boilKey: 'hbappa', stand: 1, eyes: t > HOST ? 'happy' : 'normal', mouth: 'smile', cross: ease(seg(t, HOST, HOST + .4)) * (photo ? 0 : 1), aL: photo ? .9 : undefined, aR: photo ? .9 : undefined, dy: bowK * .6, htilt: bowK * .15, trunk: photo ? 'up' : 'curl', blush: t > HOST ? .6 : 0, emote: inW(t, HOST + .3, TIMER) ? 'hearts' : null, emoteK: 1, emoteAge: t - HOST - .3 });
    splat(500, 1760 - 19.5 * 11, 18, 'hb', KP.icing);
    // the self-timer camera (front left), Mooshak running from it into the photo
    const blink = t > TIMER ? (Math.sin((t - TIMER) * (8 + (t - TIMER) * 14)) > 0 ? 1 : 0) : 0;
    if (t > HOST) selfCam(80, 1770, 55, t, { blink });
    const mk = seg(t, TIMER, FLASH - .1), mx = lerp(110, 650, easeOut(mk)), run = mk > 0 && mk < 1;
    if (t > TIMER - .4) mooshak(mx, 1770 - (run ? Math.abs(Math.sin(t * 22)) * 12 : 0), 9, { boilKey: 'hmoo', eyes: mk >= 1 ? 'happy' : 'wide', mouth: 'smile', rot: run ? .15 : 0, tail: t * 6 });
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [KP.pink, KP.icing]); }
    if (frz) {   // the photo: a white flash, then a cream polaroid border
      const a = t0 - FLASH;
      if (a < .25) flash(1 - a / .25, '#FFFFFF');
      boilSeed('polaroid');
      const b = 34;
      paint(rectPts(-20, -20, W + 40, 360 + b), { wash: TK.cream, ink: null });
      paint(rectPts(-20, 1560, W + 40, 400), { wash: TK.cream, ink: null });
      paint(rectPts(-20, -20, b + 20, H + 40), { wash: TK.cream, ink: null });
      paint(rectPts(W - b, -20, b + 20, H + 40), { wash: TK.cream, ink: null });
      inkLine([[b, 360 + b], [W - b, 360 + b], [W - b, 1560], [b, 1560], [b, 360 + b]], 1.5, TK.grey, 'inkfine', 0);
    }
    caps(t0);
    if (t0 > I0 - .3) { flushLetters(); brushWipe((t0 - (I0 - .3)) / .6, [KP.dado, KP.marigold]); }
  }

  // ================= I · the gift =================
  function shotGift(t, lt) {
    camK(t, [[I0, [520, 1250, 1.45]], [OPEN, [520, 1240, 1.5]], [CARD, [520, 1220, 1.6]]]);
    hallSet(t);
    lantern(LP[0], LP[1] - 250, LR, t, { on: 1 });
    table(TX, TY, TW);
    // the gift: pushed up from behind the cloth onto the table, opens
    const rise = easeOut(seg(t, GIFT, GIFT + .7));
    giftBox(TX - 40, lerp(TY + 200, TY - 8, rise), 230, ease(seg(t, OPEN, OPEN + .35)), t, 'gift');
    table(TX, TY, TW, { key: 'gtable2', h: 40 });   // the table top again, over the box's bottom as it rises
    if (t > OPEN) sparkleBurst(TX - 40, TY - 200, 160, t - OPEN, 'giftburst', 10);
    // Sher, front right, with frosting in his mane: claps for it
    const clap = t > OPEN ? Math.abs(Math.sin((t - OPEN) * 10)) : 0;
    lion(790, 1660, 15, { boilKey: 'gsher', hat: lionBand(), eyes: t > OPEN ? 'happy' : 'normal', mouth: t > OPEN ? 'grin' : 'smile', lookX: -.8, pawL: [-.4 - clap * 1.2, -8.5], pawR: [.4 + clap * 1.2, -8.5], pawShapeL: 'pad', pawShapeR: 'pad' });
    splat(760, 1660 - 16 * 15, 26, 'gs', KP.pink);
    camEnd();
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [KP.dado, KP.marigold]); }
    // the three covers fly out of the box toward us (screen space)
    const bx = 540 + (TX - 40 - 520) * 1.5, by = 960 + (TY - 120 - 1240) * 1.5;
    if (t > FLY) [['book1', -1], ['book2', 0], ['book3', 1]].forEach(([b, i], j) => {
      const k = easeOut(seg(t, FLY + j * .12, FLY + .7 + j * .12));
      if (k > 0) picture(PICS[b], lerp(bx, 540 + i * 290, k), lerp(by, 1000 + Math.abs(i) * 30, k) - Math.sin(k * Math.PI) * 140, lerp(50, 290, k), lerp(50, 290, k), { rot: i * .12 + (1 - k) * 2, r: 10, shadow: 22 });
    });
    caps(t);
    if (t > CARD - .3) { flushLetters(); brushWipe((t - (CARD - .3)) / .6, [TK.marigold, TK.rkOrange]); }
  }

  // ================= J · the card =================
  function shotCard(t, lt) {
    k15Card(t, CARDC);
    flushLetters();
    k15Strike(t, CARDC);
    const k = frac((t - FOLLOW) / 1.6);
    if (t > FOLLOW) { boilSeed('sparkle'); paint(starPts(lerp(200, 740, k), lerp(1060, 820, k), 34 * Math.sin(k * Math.PI), .3, 4), { wash: '#FFFDF6', ink: null }); }
    if (lt < .3) brushWipe(.5 + lt / .6, [TK.marigold, TK.rkOrange]);
  }

  shots([[0, shotSher], [C0, shotKali], [D0, shotHanuman], [E0, shotShumbha], [F0, shotGoat], [G0, shotRavana], [H0, shotWreck], [I0, shotGift], [CARD, shotCard]]);
})();
