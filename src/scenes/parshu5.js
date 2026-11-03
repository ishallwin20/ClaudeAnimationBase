// parshu5.js: "PARSHURAMA won the whole EARTH, then gave it away" (ad 74, Parshurama series Part 5, 84 s, Bangers
// captions, SFX, no voice). One version, the Mahabharata (Ganguli): while Rama is out for sacred fuel, Kartavirya's
// sons come to the ashram and kill Jamadagni, who is in tapas and will not fight, crying "Rama!" again and again (Vana
// 3.116; Shanti 12.49); Rama comes back bearing the fuel, laments, cremates his father and vows; alone he kills the sons
// (3.117); thrice seven times he rids the earth of the warrior kings (3.117; 12.49); at Samantapanchaka he fills five
// lakes and offers to his ancestors, who appear, led by Richika, are "gratified" and bid him "be pacified", and the
// lakes become holy; that is where the Kurukshetra war was fought (Adi 1.2; 3.117); at a horse sacrifice he gives the
// earth to Kashyapa, who tells him to leave his land for the southern ocean (12.49; 3.117); the earth asks Kashyapa for
// kings, the princes hidden among bears, cows and calves, and he crowns them (12.49).
// Killing never shown (the lamp goes out; crowns in the dust). A fast cold open, then Part 2's pace. STORYBOARD.md has
// the plan and the sources; sets and props are in parshu5_props.js (and parshu1–4_props.js). All times are video time
// (t); tools/parshu5_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu5_sfx.mjs)
  const B0 = 3.8, C0 = 7.4;
  const D0 = 10.2, E0 = 15.0, F0 = 19.6;
  const G0 = 24.6, CRY = 25.4, LAMP = 26.6, OUT = 27.4;
  const H0 = 29.2, DROP = 31.0, I0 = 33.8, VOW = 36.4;
  const J0 = 38.8, CROWNS = 41.4, K0 = 43.6, TALLY = 44.2, TOP = 48.0;
  const L0 = 50.0, M0 = 54.8, O0 = 60.0, CALM = 60.2, KURU = 61.6;
  const P0 = 64.8, GIVE = 65.4, LEAVE = 67.0, R0 = 69.6, CROWN1 = 71.6, S0 = 75.0, CARD = 80.0;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };

  const GOLDC = '#F5C542', REDC = '#FF6A4A';
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const talk = (t, a, b, rest = 'flat', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const cutFlash = (lt, col = '#FFFFFF', d = .12, a = .6) => { if (lt < d) flash(a * (1 - lt / d), col); };
  const BURST = [P4.burstA, P4.burstB], DUST = [P2.plainMid, P2.plainLo], LEAF = [P1.leaf, P1.leafDk], NIGHT = [P3.night, P3.dusk];
  // the tally: the n-th war's tick (n = 1..21) comes faster and faster from TALLY to TOP
  const tick = n => TALLY + (TOP - TALLY) * Math.sqrt((n - 1) / 20);

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['PARSHURAMA WON', 470, -1, B0 + .9, 90], ['THE WHOLE EARTH.', 580, -1, B0 + .9, 104, GOLDC],
    ['THEN HE GAVE IT AWAY.', 470, B0 + .1, C0 - B0 - .2, 80], ['"NOW LEAVE MY LAND."', 575, B0 + 1.2, C0 - B0 - 1.3, 84, GOLDC],
    ['IT TOOK', 470, C0 + .3, D0 - C0 - .5, 96], ['21 WARS.', 600, C0 + .6, D0 - C0 - .8, 150, GOLDC],
    ['THE KING WITH 1000 ARMS HAD FALLEN.', 470, D0 + .4, 4.2, 60], ['HIS SONS WANTED REVENGE.', 570, D0 + .7, 3.9, 76, GOLDC],
    ['ONE DAY, RAMA WENT', 470, E0 + .3, 4.1, 82], ['TO FETCH FIREWOOD.', 575, E0 + .5, 3.9, 86, GOLDC],
    ['THE SONS CAME FOR HIS FATHER.', 470, F0 + .3, 4.6, 62], ['HE WAS DEEP IN TAPAS.', 565, F0 + .6, 4.3, 72], ['HE WOULD NOT FIGHT.', 660, F0 + 1.0, 3.9, 80, GOLDC],
    ['HE CALLED OUT:', 470, G0 + .2, H0 - G0 - .4, 80], ['"RAMA! RAMA!"', 585, CRY, H0 - CRY - .2, 124, GOLDC],
    ['RAMA CAME BACK', 470, H0 + .3, 4.1, 90], ['TOO LATE.', 580, DROP + .4, I0 - DROP - .6, 124, REDC],
    ['HE LIT HIS FATHER\'S PYRE', 470, I0 + .3, 4.5, 76], ['AND MADE A VOW.', 570, VOW - .3, J0 - VOW + .1, 92, GOLDC],
    ['HE WENT TO THE KING\'S CITY', 470, J0 + .3, 4.4, 70], ['AND FACED THE SONS ALONE.', 570, J0 + .6, 4.1, 70, GOLDC],
    ['THEN HE FOUGHT ARROGANT KINGS', 470, K0 + .3, TOP - K0 - .3, 62], ['ALL OVER THE EARTH.', 565, K0 + .6, TOP - K0 - .6, 76, GOLDC],
    ['TIMES.', 1150, TOP + .05, L0 - TOP - .2, 110, GOLDC],
    ['AT SAMANTAPANCHAKA,', 470, L0 + .3, 4.4, 78], ['HE FILLED FIVE LAKES WITH BLOOD.', 570, L0 + .6, 4.1, 62, REDC],
    ['THEN HIS ANCESTORS APPEARED.', 470, M0 + .3, 4.9, 66], ['"RAMA, WE ARE PLEASED.', 570, M0 + 1.4, 3.8, 76, GOLDC], ['NOW BE AT PEACE."', 670, M0 + 1.8, 3.4, 84, GOLDC],
    ['THOSE LAKES ARE IN', 470, O0 + .3, 4.4, 76], ['KURUKSHETRA.', 590, KURU, P0 - KURU - .2, 130, GOLDC], ['WHERE THE MAHABHARATA WAR WAS FOUGHT.', 705, KURU + .5, P0 - KURU - .7, 50],
    ['HE GAVE THE WHOLE EARTH', 470, P0 + .3, 4.5, 74], ['TO SAGE KASHYAPA,', 570, P0 + .6, 4.2, 84, GOLDC], ['AND LEFT FOR THE SEA.', 670, LEAVE, R0 - LEAVE - .2, 72],
    ['BEARS AND COWS HAD RAISED', 470, R0 + .3, 5.1, 70], ['A FEW HIDDEN PRINCES.', 570, R0 + .6, 4.8, 76], ['KASHYAPA MADE THEM KINGS.', 670, CROWN1, S0 - CROWN1 - .2, 72, GOLDC],
    ['WHY EXACTLY', 470, S0 + .3, CARD - S0 - .3, 92], ['21 TIMES?', 585, S0 + .5, CARD - S0 - .5, 124, GOLDC], ['COMMENT IF YOU KNOW', 700, S0 + 1.1, CARD - S0 - 1.1, 62],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // Rama: young (clean-shaven) as in Parts 2–4, his right hand on screen left (flip: 1); after the 21 wars, bearded
  const RAMA = { flip: 1, beard: false, quiver: true, boilKey: 'rama', seed: 7 };
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });
  const RAMA2 = { beard: PSR.hair, beardLen: .5 };

  // ================= A · the hook: Parshurama standing on top of the whole earth =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 8, 1.05 + .015 * lt);
    sunburst(t, 540, 1250);
    earthBall(540, 1930, 400, t, 'aearth');
    rama(540, 1545, 17, { ...RAMA2, axe: 'hold', axeGlow: .6 + .2 * Math.sin(t * 3), eyes: blinkAt(t, 2.2) ? 'closed' : 'normal', brow: -.3, mouth: 'flat', wind: .5, aura: .5, puff: .4 });
    camEnd();
    caps(t);
    if (lt > dur - .1) flash(.7, '#FFFFFF');
  }

  // ================= B · he gives it away; the new owner shows him the door =================
  function shotGive(t, lt, dur) {
    camBegin(540, 1450, 1.1 + .02 * lt);
    ashramSet(t, 'day', 'bas');
    yagnaKund(560, 1840, 200, t, .2, 'bkund');
    const said = t > B0 + 1.2;
    kashyapa(760, 1760, 19, { earth: 2.6, ladle: 1, ladleA: said ? -.9 : 0, handL: said ? [-8.6, -19.5] : [-5, -13], bendL: said ? .2 : .6, handR: [5.2, -15], bendR: .7,
      eyes: said ? 'normal' : 'happy', brow: said ? -.4 : 0, mouth: talk(t, B0 + 1.2, B0 + 2.6, 'smug', 'open'), lookX: -1 });
    rama(300, 1760, 18, { ...RAMA2, axe: 'shoulder', eyes: said ? 'wide' : 'happy', brow: said ? .9 : 0, mouth: said ? 'O' : 'smile', lookX: 1, sweat: said });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .8);
  }

  // ================= C · 21 wars =================
  function shotWars(t, lt, dur) {
    const hb = Math.max(0, Math.sin((t - C0) * 2 * Math.PI * 1.1)) ** 8;
    camBegin(540, 1180, 1.25 + .05 * lt);
    bloodGround(t, 540, 1100);
    glow(540, 1150, 500, '#FF4A2A', .25 + .2 * hb);
    const opened = t > C0 + .35, o = { axe: 'hold', axeGlow: .4 + .5 * hb, eyes: opened ? 'angry' : 'closed', brow: -1, mouth: 'flat', wind: .6 };
    rama(540, 2060, 40, o);
    if (opened) { const [hx, hy] = naradaHead(540, 2060, 40, { ...RAMA, ...o }); eyeBlaze(hx, hy + .3 * 40, 40, .8 * ease(seg(t, C0 + .35, C0 + .7)), P3.red, 'cblaze'); }
    camEnd();
    whipStreaks(lt < .08 ? 1 - lt / .08 : 0);
    caps(t);
    if (lt > dur - .4) { flushLetters(); iris(540, 1150, lerp(1700, 0, easeIn((lt - dur + .4) / .4)), '#0A0408'); }
  }

  // ================= D · Mahishmati: the empty throne, the sons =================
  function sonsCourt(t, key) {
    court(t, key);
    throne(540, 1530, 330, key + 'th');
    crownProp(540, 1500, 110, key + 'crown');
    grade('dusk', .55);
  }
  function shotSons(t, lt, dur) {
    camBegin(540, 1420 - lt * 6, 1.05 + .02 * lt);
    sonsCourt(t, 'dct');
    glow(540, 1430, 200, '#FFD27A', .35);
    const mad = lt > 1.4;
    kartSon(0, 210, 1840, 19, { eyes: mad ? 'angry' : 'normal', brow: mad ? -1 : -.3, mouth: mad ? 'frown' : 'flat', lookX: .8, handR: mad ? [5.5, -15.5] : undefined, bendR: .9 });
    kartSon(1, 870, 1840, 19, { eyes: mad ? 'angry' : 'look', brow: -1, mouth: mad ? 'teeth' : 'frown', lookX: -.8, handL: mad ? [-6, -17] : undefined, bendL: .6 });
    if (mad) for (const [x, o] of [[210, { lookX: .8 }], [870, { lookX: -.8 }]]) { const [hx, hy] = naradaHead(x, 1840, 19, o); eyeBlaze(hx, hy + .3 * 19, 19, .6 * ease(seg(t, D0 + 1.4, D0 + 2)), P3.red, 'dbl' + x); }
    camEnd();
    caps(t);
    if (lt < .45) { flushLetters(); iris(540, 1300, lerp(0, 1700, easeOut(lt / .45)), '#0A0408'); }
  }

  // ================= E · the ashram by day: Rama goes for firewood, his father in tapas =================
  function shotFetch(t, lt, dur) {
    camBegin(540, 1460, 1.08 + .015 * lt);
    ashramSet(t, 'day', 'eas');
    jamadagni(250, 1760, 16, { boilKey: 'jame', seed: 5, sit: 1, mudra: 1, eyes: 'closed', mouth: 'smile' });
    yagnaKund(520, 1800, 170, t, 0, 'ekund');
    const wk = ease(seg(t, E0 + .6, E0 + 4.4));
    rama(lerp(760, 1180, wk), 1760, 18, { axe: 'shoulder', walk: wk > 0 && wk < 1 ? t * 7 : 0, eyes: 'happy', mouth: 'smile', lookX: -1, hx: -.3, wind: .2 });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, LEAF); }
  }

  // ================= F · dusk: the sons creep in; the sage does not open his eyes =================
  const bowSil = (u, sw) => { inkLine(U([[.4, -5], [-1.2, -2.6], [-1.6, 0], [-1.2, 2.6], [.4, 5]], u), sw * 1.6, '#1C0E16', 'ink', .6); inkLine(U([[.4, -5], [.4, 5]], u), sw * .4, '#5A3A4A', 'inkfine', 0); };
  function shotCome(t, lt, dur) {
    camBegin(560, 1460, 1.1 + .02 * lt);
    ashramSet(t, 'dusk', 'fas');
    jamadagni(380, 1760, 18, { boilKey: 'jamf', seed: 5, sit: 1, mudra: 1, eyes: 'closed', mouth: 'flat' });
    yagnaKund(640, 1800, 160, t, 0, 'fkund');
    grade('dusk', .25);
    for (let i = 1; i >= 0; i--) {
      const x = lerp(1300 + i * 120, 760 + i * 180, ease(seg(t, F0 + .3, F0 + 3.4))), o = { fan: 0, pal: silPal(KART_PAL), col: '#1C0E16', dk: '#1C0E16', lt: '#1C0E16', walk: t * 3 + i, lookX: -1, eyes: 'closed', mouth: 'flat', noShadow: true, handL: [-5.5, -14], bendL: .6, armL: bowSil };
      kartavirya(x, 1780, 18 - i * 1.5, { boilKey: 'fsil' + i, seed: 80 + i, ...o });
      const [hx, hy] = naradaHead(x, 1780, 18 - i * 1.5, o); eyeBlaze(hx, hy + .3 * 18, 18 - i * 1.5, .9, P3.red, 'fbl' + i);
    }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, NIGHT); }
  }

  // ================= G · he calls out "Rama! Rama!"; arrows; the lamp goes out =================
  function shotCry(t, lt, dur) {
    if (t < LAMP) {
      const sh = shake(t, CRY, .4, 6);
      camBegin(540 + sh[0], 1180 + sh[1], 1.15 + .05 * lt);
      ashramSet(t, 'night', 'gas');
      glow(540, 1200, 600, '#FF9A4A', .2);
      const called = t > CRY, o = { boilKey: 'jamg', seed: 5, sit: 1, mudra: called ? 0 : 1, eyes: called ? 'wide' : 'closed', brow: called ? .8 : .3, mouth: called ? talk(t, CRY, LAMP, 'O', 'scream') : 'flat', lookX: -.6, lookY: -.2, sweat: called };
      jamadagni(540, 2240 - 8.6 * 42 + 80, 42, o);
      camEnd();
      caps(t);
      if (lt < .4) { flushLetters(); brushWipe(.5 + lt / .8, NIGHT); }
      return;
    }
    // the lamp by the wall: the arrows' shadows sweep over it, the flame shudders and dies
    const l = t - LAMP, sh = shake(t, LAMP, .5, 8);
    camBegin(540 + sh[0], 1240 + sh[1], 1.2 + .03 * l);
    boilSeed('gwall'); paint(rectPts(-300, -300, W + 600, H + 1400), { wash: '#2A1A22', ink: null }); paint(ellPts(560, 1250, 700, 600, 26), { fill: '#4A2E2A', fillOp: 200, bleed: .3, tex: .5, ink: null });
    const lit = t < OUT ? 1 + .4 * Math.sin(t * 40) : 0;
    if (lit > 0) glow(600, 1190, 520, '#FF9A4A', .4 * lit);
    if (l < .9) { boilSeed('gsh'); for (let i = 0; i < 6; i++) { const p = clamp(l * 2.2 - i * .12), x = lerp(1500, -400, p), y = 820 + i * 90; if (p > 0 && p < 1) arrow(x, y, Math.PI + .12, 260, 'gsh' + i, '#140A10'); } }
    diya(480, 1320, 90, lit, 'glamp');
    if (t >= OUT) wick(480 + 90 * .95, 1320 - 90 * .8, 20, t - OUT, 'gwick');
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .4);
  }

  // ================= H · Rama comes back with the firewood; the bundle falls =================
  function shotBack(t, lt, dur) {
    const push2 = ease(seg(t, DROP + .6, I0 - .4));
    camBegin(lerp(560, 700, push2), lerp(1440, 1250, push2), lerp(1.12, 1.6, push2));
    ashramSet(t, 'sunset', 'has'); grade('sunset', .3);
    const wk = ease(seg(t, H0, DROP)), x = lerp(1220, 760, wk), seen = t > DROP;
    const o = { axe: false, walk: !seen && wk < 1 ? t * 7 : 0, eyes: seen ? 'wide' : 'happy', brow: seen ? 1 : 0, mouth: seen ? 'O' : 'smile', lookX: -1, lookY: seen ? .2 : 0, wind: .3,
      ...(seen ? { handR: [5.5, -11], bendR: .8, handL: [-5.5, -11], bendL: .8 } : { handR: [1.5, -15.4], bendR: 1.1, armR: firewood }) };
    rama(x, 1760, 19, o);
    if (seen) sticks(x - 30, 1760 - 15.4 * 19, 1770, 170, t - DROP, 'hsticks');
    if (t > DROP + 1.4) { const [hx, hy] = naradaHead(x, 1760, 19, { ...RAMA, ...o }); boilSeed('htear'); tears(hx - 1.2 * 19, hy + .6 * 19, t - DROP - 1.4, 'ht1', 1); tears(hx + 1.2 * 19, hy + .6 * 19, t - DROP - 1.2, 'ht2', 1); }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [P3.sunset, '#F28A3A']); }
  }

  // ================= I · the pyre; the vow =================
  function shotPyre(t, lt, dur) {
    camBegin(540, 1520 - lt * 8, 1.05 + .03 * lt);
    boilSeed('inight'); paint(rectPts(-300, -300, W + 600, H + 1400), { wash: P3.night, ink: null }); paint(ellPts(540, 1500, 800, 700, 26), { fill: '#3A2238', fillOp: 220, bleed: .3, tex: .4, ink: null });
    boilSeed('istars'); for (let i = 0; i < 16; i++) paint(starPts(hash(i * 2.3) * 1080, 400 + hash(i * 6.7) * 600, 3 + 4 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', washOp: 200, ink: null });
    const vowed = t > VOW, o = { ...RAMA2, sit: 1, pray: vowed ? 0 : 1, axe: vowed ? 'hold' : false, axeGlow: vowed ? ease(seg(t, VOW, VOW + .6)) : 0, eyes: vowed ? 'angry' : 'closed', brow: vowed ? -1 : .6, mouth: vowed ? 'flat' : 'frown',
      tint: '#FF8A3A', tintK: .2, wind: .3, aura: vowed ? .5 * ease(seg(t, VOW, VOW + .8)) : 0 };
    // the pyre behind him, across the clearing; Rama close in front, lit by it, looking at it
    boilSeed('iground'); paint([[-300, 1640], [500, 1620], [1380, 1650], [1380, 2600], [-300, 2600]], { wash: '#1E1626', ink: null, curv: .4 });
    pyreFire(730, 1700, 400 * (1 + .15 * ease(seg(t, VOW, VOW + .4))), t, 'ipyre');
    glow(560, 1700, 700, '#FF8A3A', .25);
    const RX = 360, RY = 2120, RU = 30, o2 = { ...o, lookX: vowed ? 0 : .7, lookY: vowed ? 0 : -.1, hx: vowed ? 0 : .25 };
    rama(RX, RY, RU, o2);
    const [hx, hy] = naradaHead(RX, RY, RU, { ...RAMA, ...o2 });
    if (!vowed) { tears(hx - 1.2 * RU, hy + .6 * RU, lt, 'it1', 1.4); tears(hx + 1.2 * RU, hy + .6 * RU, lt + .4, 'it2', 1.4); }
    else eyeBlaze(hx, hy + .3 * RU, RU, .8 * ease(seg(t, VOW, VOW + .5)), P3.red, 'iblaze');
    camEnd();
    caps(t);
    if (lt < .4) { flushLetters(); brushWipe(.5 + lt / .8, NIGHT); }
  }

  // ================= J · the king's city: he faces the sons alone; two crowns in the dust =================
  function shotCity(t, lt, dur) {
    if (t < CROWNS) {
      const sh = shake(t, J0 + 1.2, .5, 8);
      camBegin(540 + sh[0], 1420 + sh[1], 1.05 + .03 * lt);
      sonsCourt(t, 'jct');
      const scared = t > J0 + 1.2;
      kartSon(0, 700, 1800, 16, { eyes: scared ? 'wide' : 'smug', brow: scared ? 1 : -.4, mouth: scared ? 'scream' : 'grin', lookX: -1, sweat: scared, lean: scared ? -1 : 0, handL: scared ? [-6, -19] : undefined, bendL: .6 });
      kartSon(1, 950, 1800, 16, { eyes: scared ? 'wide' : 'smug', brow: scared ? 1 : -.4, mouth: scared ? 'O' : 'grin', lookX: -1, sweat: scared, lean: scared ? -1 : 0 });
      const k = ease(seg(t, J0 + .2, J0 + 1.2));
      rama(lerp(-200, 250, k), 2020, 25, { ...RAMA2, axe: 'raise', axeGlow: .9, walk: k < 1 ? t * 6 : 0, eyes: 'angry', brow: -1, mouth: 'frown', lookX: .8, wind: .8, aura: .8 });
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .12, .5);
      return;
    }
    const l = t - CROWNS;
    camBegin(540, 1500, 1.2);
    dustPlain(t, { groundY: 1380 }); grade('dusk', .35);
    for (let i = 0; i < 2; i++) {
      const roll = easeOut(seg(t, CROWNS + .15 + i * .3, CROWNS + 1.5 + i * .3)), cx = lerp(1250 + i * 200, 400 + i * 330, roll), wob = (1 - roll) * Math.sin(l * 14 + i) * .5;
      push(); translate(cx, 1690 + i * 40); rotate(wob + (1 - roll) * -6); crownProp(0, 0, 120, 'jcrown' + i); pop();
      for (let j = 0; j < 2; j++) smokePuff(cx + 60 + j * 50, 1680 + i * 40, 110, clamp(l * .6 - j * .1 - i * .2), 'jdust' + i + j, [1, -.4], P2.dustLt);
    }
    camEnd();
    caps(t);
    if (l < .35) flash(1 - l / .35, '#FFFFFF');
  }

  // ================= K · 21 times: days and nights race; he marches on; the tally climbs =================
  function shotTally(t, lt, dur) {
    let n = 0; for (let i = 1; i <= 21; i++) if (t >= tick(i)) n = i;
    const tn = n ? tick(n) : TALLY, days = lt * .4 + n * .55 + (t - tn) * 1.2;
    const sh = n ? shake(t, tn, .18, 4 + n * .3) : [0, 0];
    camBegin(540 + sh[0], 1300 + sh[1], 1.0);
    skyLapse(t, days, 'klapse');
    grade('sunset', .55);
    ridgeFront(1700, '#1C0E16', 'kridge');
    rama(780, 1730, 11, { ...RAMA2, axe: 'shoulder', axeGlow: .6, pal: silPal(PSR), col: '#1C0E16', dk: '#1C0E16', lt: '#1C0E16', tilak: false, eyes: 'closed', mouth: 'flat', walk: t * 6, wind: .8, noShadow: true, aura: .5 });
    camEnd();
    caps(t);
    if (n) { if (t - tn < .08) flash(.25, '#FFE6A0'); bigCount(n, 540, 900, n === 21 ? 380 : 320, t - tn); }
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
  }

  // ================= L · Samantapanchaka: five lakes of blood; he offers to his fathers =================
  function shotLakes(t, lt, dur) {
    camBegin(540, 1250 - lt * 10, 1.0 + .03 * lt);
    lakesSet(t, 0);
    rama(540, 1110, 8, { ...RAMA2, axe: false, pray: 1, eyes: 'closed', mouth: 'flat', noShadow: true });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [P5.lakeRedDk, '#3A1E3E']); }
  }

  // ================= M · the ancestors in the sky, led by Richika: "We are pleased. Now be at peace." =================
  function shotAncestors(t, lt, dur) {
    const open = ease(seg(t, M0, M0 + 1.4));
    camBegin(540, 1260 + (1 - open) * 60, 1.0 + .02 * lt);
    boilSeed('msky'); paint(rectPts(-300, -300, W + 600, H + 1400), { wash: mixCol('#2A1A3A', '#F2B87A', open * .8), ink: null });
    heavenSky(t, open, 'mhv');
    for (let i = 0; i < 6; i++) cloudPuff(-150 + i * 260, 1560 + (i % 2) * 40, 170, 'mcl' + i, 240, '#FFF2DA', '#F2D2A8');
    const rise = 60 * (1 - open);
    ancestor(2, 230, 1370 + rise, 11, { eyes: 'closed', mouth: 'smile', pray: 1, glowA: open });
    ancestor(3, 850, 1370 + rise, 11, { eyes: 'closed', mouth: 'smile', pray: 1, glowA: open });
    ancestor(1, 370, 1460 + rise, 12.5, { eyes: blinkAt(t, 57.6) ? 'closed' : 'happy', mouth: 'smile', glowA: open, lookY: .4 });
    ancestor(0, 620, 1520 + rise, 14, { eyes: 'happy', mouth: talk(t, M0 + 1.4, M0 + 4.2, 'smile', 'open'), brow: .3, lookY: .5, lookX: .3, handR: [6.5, -19.5], bendR: .5, glowA: open });
    for (let i = 0; i < 4; i++) cloudPuff(-60 + i * 380, 1640, 150, 'mcf' + i, 250, '#FFF6EC', '#F2D8B8');
    // Rama below, looking up, his aura going out
    const o = { ...RAMA2, axe: 'hold', axeGlow: .2, eyes: 'wide', brow: .6, mouth: 'O', lookY: -1, lookX: -.3, aura: .5 * (1 - open) };
    rama(900, 2420, 26, o);
    camEnd();
    caps(t);
    if (lt < .4) { flushLetters(); brushWipe(.5 + lt / .8, ['#2A1A3A', '#7A2A3A']); }
  }

  // ================= O · at peace; the lakes clear; this is Kurukshetra =================
  function shotKuru(t, lt, dur) {
    const b = ease(seg(t, CALM, CALM + 1.4));
    camBegin(540, 1200 - lt * 10, 1.0 + .02 * lt);
    lakesSet(t, b, { gold: b });
    banners(-60, 1140, 812, ease(seg(t, KURU + .4, KURU + 1.4)), t, 'oban');
    rama(540, 1110, 8, { ...RAMA2, axe: false, sit: 1, pray: 1, eyes: 'closed', mouth: 'smile', noShadow: true });
    signPost(800, 1760, 300, 'KURUKSHETRA', pop(t, KURU, 3), 'osign');
    camEnd();
    caps(t);
    cutFlash(lt, '#FFF6DA', .2, .5);
  }

  // ================= P · the horse sacrifice: the earth to Kashyapa; Rama leaves =================
  function shotDana(t, lt, dur) {
    camBegin(540, 1460, 1.08 + .015 * lt);
    ashramSet(t, 'day', 'pas');
    const g = ease(seg(t, GIVE, GIVE + 1.2)), gone = ease(seg(t, LEAVE, R0));
    yagnaKund(540, 1880, 230, t, .3 + .3 * Math.sin(t * 2), 'pkund');
    kashyapa(820, 1760, 18, { ladle: 1, earth: g >= 1 ? 2.4 : 0, eyes: g >= 1 ? 'happy' : 'normal', mouth: g >= 1 ? 'smile' : 'flat', lookX: -1, handR: g < 1 ? [6.2, -16] : [5.2, -15], bendR: .6 });
    const rx = lerp(260, -260, gone), walking = gone > 0 && gone < 1;
    rama(rx, 1760, 18, { ...RAMA2, axe: g >= 1 ? 'shoulder' : false, handR: g < 1 ? [6.2, -16] : undefined, handL: g < 1 ? [-6.2, -16] : undefined, bendR: .6, bendL: .6,
      eyes: walking ? 'happy' : 'normal', mouth: 'smile', lookX: walking ? -1 : 1, walk: walking ? t * 6 : 0 });
    if (g < 1) { const ex = lerp(rx + 7 * 18, 820 + 5.5 * 18, g), ey = 1760 - 18 * 16 - 2.4 * 18 - Math.sin(g * Math.PI) * 220; earthBall(ex, ey, 2.4 * 18, t, 'pearth'); if (g > 0) sparkleBurst(ex, ey, 140, g, 'psp', 8); }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, LEAF); }
  }

  // ================= R · the hidden princes: raised by bears, by cows and calves; Kashyapa crowns them =================
  function shotPrinces(t, lt, dur) {
    camBegin(540, 1480 - lt * 5, 1.08 + .015 * lt);
    ashramSet(t, 'day', 'ras');
    kashyapa(540, 1700, 15, { eyes: 'happy', mouth: 'smile', handL: [-6.5, -19], handR: [6.5, -19], bendL: .5, bendR: .5 });
    jambavan(150, 1790, 14, { staff: 0, eyes: 'happy', mouth: 'smile', handR: [6, -11], bendR: .8, boilKey: 'rbear' });
    const c0 = ease(seg(t, CROWN1, CROWN1 + .3)), c1 = ease(seg(t, CROWN1 + .6, CROWN1 + .9));
    littlePrince(0, 330, 1800, 13, { crownK: c0, eyes: c0 > .5 ? 'happy' : 'normal', mouth: c0 > .5 ? 'open' : 'smile', lookX: .5 });
    cow(930, 1800, 12, { coat: 'gauri', flip: true, eyes: 'happy', mouth: 'smile', boilKey: 'rcow' });
    cow(1010, 1830, 8, { calf: 1, coat: 'kapila', flip: true, hop: Math.max(0, Math.sin(t * 5)), eyes: 'happy', mouth: 'smile', boilKey: 'rcalf' });
    littlePrince(1, 760, 1810, 13, { crownK: c1, eyes: c1 > .5 ? 'happy' : 'normal', mouth: c1 > .5 ? 'open' : 'smile', lookX: -.5 });
    if (c0 > 0 && c0 < 1) sparkleBurst(330, 1800 - 18 * 13, 120, c0 * 2 % 1, 'rsp0', 8);
    if (c1 > 0 && c1 < 1) sparkleBurst(760, 1810 - 18 * 13, 120, c1 * 2 % 1, 'rsp1', 8);
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, LEAF); }
  }

  // ================= S · the ask: why 21? =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1200 - lt * 4, 1 + .01 * lt);
    sunburst(t, 540, 1300);
    const q = pop(t, S0 + .2);
    glow(540, 1230, 420 * q, '#FFE6A0', .5);
    boilSeed('s21'); letter('21', 540, 1240, 380, P5.cream, { screen: false, ink: false, pop: q * 2, rot: .04 * Math.sin(t * 2), stroke: P5.ink, sw: .12 });
    rama(540, 1960, 17, { ...RAMA2, axe: 'hold', axeGlow: .4 + .2 * Math.sin(t * 3), eyes: blinkAt(t, 77.4) ? 'closed' : 'normal', brow: -.3, mouth: 'flat', aura: .4 });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, BURST); }
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
  }

  shots([[0, shotHook], [B0, shotGive], [C0, shotWars], [D0, shotSons], [E0, shotFetch], [F0, shotCome], [G0, shotCry],
    [H0, shotBack], [I0, shotPyre], [J0, shotCity], [K0, shotTally], [L0, shotLakes], [M0, shotAncestors],
    [O0, shotKuru], [P0, shotDana], [R0, shotPrinces], [S0, shotAsk], [CARD, shotCard]]);
})();
