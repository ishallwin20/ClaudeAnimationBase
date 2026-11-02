// parshu4.js: "PARSHURAMA vs the KING with 1000 ARMS" (ad 72, Parshurama series Part 4, ~87 s, Bangers captions, SFX,
// no voice). Bhagavata Purana 9.15.17-41 (one version, named): Kartavirya Arjuna, king of the Haihayas, worships
// Dattatreya and gets a thousand arms (17-19); sporting in the Narmada with women he stops the river with his arms, it
// flows back and floods Ravana's camp (20-21); Ravana offends him and is seized, held at Mahishmati and let go "like a
// monkey" (22); out hunting he comes to Jamadagni's ashram, and the sage feeds him and his army from the kamadhenu
// (23-24); he covets her (25) and his men drag her off, crying, with her calf (26); Rama comes home, hears, and takes
// up his axe, shield, bow and quiver (27-28); the king sends seventeen akshauhinis and Rama destroys them alone
// (30-32); the king looses arrows from 500 bows at once, Rama cuts them with one bow (33); the king tears up hills and
// trees, Rama cuts his arms with the axe (34) and his head (35, never shown: a crown rolls in the dust); Rama brings
// the cow and calf home (36); Jamadagni: "we brahmins are honoured for forgiveness" (38-40); he atones (41; 9.16.1).
// A fast cold open (Part 3's), then Part 2's pace. STORYBOARD.md has the plan and the sources; sets and props are in
// parshu4_props.js (and parshu1/2/3_props.js). All times are video time (t); tools/parshu4_sfx.mjs uses the same
// constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu4_sfx.mjs)
  const B0 = 3.6, C0 = 7.2;
  const D0 = 9.8, SPROUT = 11.0;
  const E0 = 15.2, F0 = 20.2, WAVE = 21.4;
  const G0 = 25.0, CAUGHT = 26.6;
  const H0 = 30.0, I0 = 35.0, J0 = 39.6;
  const K0 = 44.6, SEE = 46.4, L0 = 48.6;
  const M0 = 53.0, N0 = 58.4, LOOSE = 59.8, N1 = 60.6;
  const O0 = 63.4, LEAP = 64.5, AXE = 65.0;
  const P0 = 68.0, Q0 = 72.6, R0 = 78.4, CARD = 83.4;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };

  const GOLDC = '#F5C542', CREAM = '#FFF5E2', REDC = '#FF6A4A';
  const pop = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const talk = (t, a, b, rest = 'flat', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const cutFlash = (lt, col = '#FFFFFF', d = .12, a = .6) => { if (lt < d) flash(a * (1 - lt / d), col); };
  const BURST = [P4.burstA, P4.burstB], DUST = [P2.plainMid, P2.plainLo], LEAF = [P1.leaf, P1.leafDk];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['THIS KING HAD 1000 ARMS', 470, -1, B0 + .9, 80], ['AND CAPTURED', 575, -1, B0 + .9, 76], ['RAVANA.', 690, -1, B0 + .9, 124, GOLDC],
    ['THEN HE STOLE A COW', 470, B0 + .1, C0 - B0 - .2, 84], ['FROM PARSHURAMA\'S FATHER.', 575, B0 + .3, C0 - B0 - .4, 70, GOLDC],
    ['BIG MISTAKE.', 470, C0 + .4, D0 - C0 - .6, 136, GOLDC],
    ['KING KARTAVIRYA ARJUNA', 470, D0 + .4, 5.0, 78, GOLDC], ['PRAYED TO DATTATREYA', 570, D0 + .6, 4.8, 64], ['AND GOT 1000 ARMS.', 665, SPROUT + .2, E0 - SPROUT - .4, 78],
    ['IN THE NARMADA, HE STOPPED', 470, E0 + .4, 4.6, 66], ['THE RIVER WITH HIS ARMS.', 570, E0 + .6, 4.4, 72, GOLDC],
    ['THE RIVER FLOWED BACK', 470, F0 + .3, 4.5, 74], ['AND FLOODED RAVANA\'S CAMP.', 570, F0 + .5, 4.3, 68, GOLDC],
    ['RAVANA PICKED A FIGHT.', 470, G0 + .2, 4.6, 76], ['THE KING CAUGHT HIM', 570, CAUGHT + .1, G0 + 4.8 - CAUGHT - .1, 76], ['LIKE A MONKEY!', 680, CAUGHT + .3, G0 + 4.8 - CAUGHT - .3, 112, GOLDC],
    ['SAGE JAMADAGNI FED HIS ARMY', 470, H0 + .4, 4.4, 64], ['FROM HIS WISH-COW, KAMADHENU.', 565, H0 + .6, 4.2, 62, GOLDC],
    ['A SAGE RICHER THAN A KING?', 470, I0 + .3, 4.2, 70], ['THE KING WANTED HER.', 570, I0 + 1.2, 3.3, 84, GOLDC],
    ['HIS MEN DRAGGED HER AWAY,', 470, J0 + .3, 4.6, 70], ['CRYING, WITH HER CALF.', 570, J0 + .6, 4.3, 76, REDC],
    ['RAMA CAME HOME.', 470, K0 + .3, 3.7, 84], ['THE COW WAS GONE.', 575, SEE - .2, L0 - SEE, 92, GOLDC],
    ['HE TOOK HIS AXE AND BOW', 470, L0 + .3, 4.0, 76], ['AND WENT AFTER THE KING.', 570, L0 + .5, 3.8, 74, GOLDC],
    ['THE KING SENT 17 ARMIES.', 470, M0 + .3, 5.0, 76], ['RAMA FOUGHT THEM ALONE.', 570, M0 + 1.2, 4.1, 78, GOLDC],
    ['HE SHOT 500 BOWS AT ONCE.', 470, N0 + .3, O0 - N0 - .5, 72], ['RAMA HAD ONE.', 575, N1 + .1, O0 - N1 - .3, 108, GOLDC],
    ['ONE AXE.', 520, AXE + .35, P0 - AXE - .5, 150, GOLDC], ['1000 ARMS.', 660, AXE + 1.2, P0 - AXE - 1.35, 104],
    ['HE BROUGHT HER HOME,', 470, P0 + .3, 4.2, 80], ['AND HER CALF.', 575, P0 + .9, 3.6, 96, GOLDC],
    ['BUT HIS FATHER SAID:', 460, Q0 + .3, R0 - Q0 - .5, 70], ['"WE ARE BRAHMINS, SON.', 560, Q0 + 1.0, R0 - Q0 - 1.2, 76], ['OUR STRENGTH IS FORGIVENESS."', 655, Q0 + 1.6, R0 - Q0 - 1.8, 64, GOLDC],
    ['WHO HUMBLED', 470, R0 + .3, CARD - R0 - .3, 92], ['PARSHURAMA?', 580, R0 + .5, CARD - R0 - .5, 120, GOLDC], ['COMMENT BELOW', 695, R0 + 1.1, CARD - R0 - 1.1, 66],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // Rama: young (clean-shaven), his right hand on screen left (flip: 1)
  const RAMA = { flip: 1, beard: false, quiver: true, boilKey: 'rama', seed: 7 };
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });
  const KING = { boilKey: 'kart', seed: 41 };
  const king = (x, y, u, o = {}) => kartavirya(x, y, u, { ...KING, ...o });

  // ================= A · the hook: the king, his thousand arms, Ravana dangling from one hand =================
  function shotHook(t, lt, dur) {
    camBegin(560, 1270 - lt * 8, 1.12 + .015 * lt);
    sunburst(t, 470, 1300);
    const sw = Math.sin(t * 2.4) * .5, rx = 800 + sw * 6, ry = 1120;
    king(370, 1940, 27, { eyes: 'smug', mouth: 'grin', brow: -.2, puff: .5, lookX: .6, lookY: -.2 });
    kartReach(370, 1940, 27, rx, ry, 'hreach');
    ravanaTied(rx, ry + 24.6 * 15, 15, { boilKey: 'rvh', spread: .62, all: { eyes: 'angry', mouth: 'frown', brows: -.8 }, heads: { 0: { eyes: 'sleepy' }, 2: { mouth: 'pout' }, 8: { eyes: 'shut' } }, noShadow: true, still: true });
    paint(ellPts(rx, ry, 34, 29, 10), { wash: KART_PAL.skin, ink: P4.ink, sw: 1.2 });   // his fist over the crown
    camEnd();
    caps(t);
    if (lt > dur - .1) flash(.7, '#FFFFFF');
  }

  // ================= B · the theft (a flash of it) =================
  function shotTheft(t, lt, dur) {
    camBegin(560 + lt * 30, 1420, 1.22 + .03 * lt);
    ashramSet(t, 'sunset');
    const x = 400 + lt * 40, CO = { lift: .35, mouth: 'moo', mouthK: .8 + .2 * Math.sin(t * 6), eyes: 'wide', ear: -.3, walk: t * .8, glowK: .4, dx: -.3 };
    kamadhenu(x, 1760, 21, CO);
    const [ex, ey] = cowHeadPt(x, 1760, 21, CO, -.55, -.25); tears(ex, ey + 8, lt, 'btear', 1.2);
    for (let i = 1; i >= 0; i--) {
      const sx = 760 + i * 160 + lt * 40;
      const [hx, hy] = cowHead(x, 1760, 21, CO);
      soldier(sx, 1780, 19, { v: i, walk: t * 5 + i, lean: 1.4, eyes: 'angry', brow: -1, mouth: 'grin', lookX: -1, handL: [-4.5, -12], bendL: .3, spear: i === 1 });
      if (i === 0) rope([hx + 30, hy + 30], [sx - 4.5 * 19, 1780 - 12 * 19], 20, 'brope');
    }
    grade('sunset', .2);
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .8);
  }

  // ================= C · big mistake =================
  function shotMistake(t, lt, dur) {
    const hb = Math.max(0, Math.sin((t - C0) * 2 * Math.PI * 1.1)) ** 8;
    camBegin(540, 1180, 1.25 + .05 * lt);
    bloodGround(t, 540, 1100);
    glow(540, 1150, 500, '#FF4A2A', .25 + .2 * hb);
    const opened = t > C0 + .35, o = { axe: 'hold', axeGlow: .4 + .5 * hb, eyes: opened ? 'angry' : 'closed', lookX: 0, lookY: 0, brow: -1, mouth: 'flat', wind: .6 };
    rama(540, 2060, 40, o);
    if (opened) { const [hx, hy] = naradaHead(540, 2060, 40, { ...RAMA, ...o }); eyeBlaze(hx, hy + .3 * 40, 40, .8 * ease(seg(t, C0 + .35, C0 + .7)), P3.red, 'cblaze'); }
    camEnd();
    whipStreaks(lt < .08 ? 1 - lt / .08 : 0);
    caps(t);
    if (lt > dur - .4) { flushLetters(); iris(540, 1150, lerp(1700, 0, easeIn((lt - dur + .4) / .4)), '#0A0408'); }
  }

  // ================= D · the boon: a light from above, the arms sprout ring by ring =================
  function shotBoon(t, lt, dur) {
    camBegin(540, 1300 - lt * 12, 1.0 + .015 * lt);
    court(t, 'dct');
    const k = ease(seg(t, SPROUT, SPROUT + 2.6)), lit = ease(seg(t, D0, D0 + 1));
    lightBeam(540, 1760, 520, lit * (1 - .5 * k), 'dbeam', '#FFF0C8');
    king(540, 1760, 21, { fan: k, eyes: k > .1 ? (k < .9 ? 'wide' : 'happy') : 'closed', mouth: k > .1 ? (k < .9 ? 'O' : 'grin') : 'smile', pray: k < .1 ? 1 : 0,
      handL: k >= .1 ? [-6.5, -18] : undefined, handR: k >= .1 ? [6.5, -18] : undefined, bendL: .6, bendR: .6, fanWave: 1 + k });
    if (k > 0 && k < 1) { flushLetters(); sparkleBurst(540, 1760 - 15 * 21, 300, k, 'dsp', 14); }
    camEnd();
    caps(t);
    if (lt < .45) { flushLetters(); iris(540, 1300, lerp(0, 1700, easeOut(lt / .45)), '#0A0408'); }
  }

  // ================= E · the Narmada: he holds the river back with his arms =================
  function shotNarmada(t, lt, dur) {
    camBegin(560, 1380, 1.12 + .02 * lt);
    const k = ease(seg(t, E0 + .6, E0 + 3));
    riverSet(t, () => {
      waterWall(1450, 420, k, t, 'ewall');
      const sp = Math.sin(t * 3.1);
      queen4(0, 220, 1460, 11, { eyes: 'happy', mouth: 'open', handL: [-5, -21 - sp * 2], bendL: .4, lookX: 1 });
      queen4(1, 900, 1460, 11, { eyes: 'happy', mouth: 'grin', handR: [5, -21 + sp * 2], bendR: .4, lookX: -1 });
      king(560, 1640, 22, { fanRange: [-.75, Math.PI + .75], fanWave: .6, eyes: 'happy', mouth: 'grin', puff: .4, handL: [-7, -16], handR: [7, -16], bendL: .4, bendR: .4 });
    }, { waistY: 1440, bankY: 1700 });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#8CC8EA', '#E8F4F2']); }
  }

  // ================= F · Ravana's camp flooded =================
  function shotFlood(t, lt, dur) {
    const sh = shake(t, WAVE + .4, .6, 10);
    camBegin(560 + sh[0], 1330 + sh[1], 1.1);
    campSet(t, 'fcamp');
    const hit = t > WAVE + .45, a = t - WAVE - .45, bob = hit ? Math.sin(a * 4) * .4 : 0;
    const R = hit
      ? { all: { eyes: 'wide', mouth: 'O', sweat: 1 }, heads: { 0: { eyes: 'wide', mouth: 'O', hat: 'none' }, 1: { mouth: 'wobble', puff: 0 }, 4: { eyes: 'angry', mouth: 'teeth', brows: -1 } }, dy: bob, shake: a < 1 ? .5 : 0 }
      : { heads: { 1: { mouth: 'chew' } }, all: {} };
    ravana(640, 1720, 19, { boilKey: 'rvf', sit: 1, ...R });
    if (hit) {
      drips(640, 1720 - 18 * 19, 26 * 19, 1720, t, 'fdrip', 12);
      boilSeed('fwater'); paint(rectPts(-300, 1610 + Math.sin(t * 2) * 8, W + 600, 900), { wash: P4.water, washOp: 220, ink: null });   // the water stays, chest-deep
      for (let i = 0; i < 6; i++) inkLine([[i * 200 - 100 + 40 * Math.sin(t + i), 1620], [i * 200 - 10 + 40 * Math.sin(t + i), 1624]], 2, P4.waterLt, 'inkfine', 0);
      boilSeed('fcap'); const cx = 260 + a * 60, cy = 1605 + Math.sin(a * 3) * 8; paint([[cx - 30, cy], [cx, cy - 46], [cx + 30, cy]], { wash: RVN.cap, ink: RVN.ink, sw: 1, curv: .3 }); paint(ellPts(cx, cy - 46, 10, 10, 8), { wash: RVN.pom, ink: RVN.ink, sw: .8 });   // the sleepy head's nightcap floats off
    }
    const fx = lerp(-500, 1700, easeIn(seg(t, WAVE, WAVE + 1.2)));
    if (t > WAVE && t < WAVE + 1.3) floodWave(fx, 1700, t, 'fwave');
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, ['#7FB8D2', '#BCE0EE']); }
  }

  // ================= G · Ravana picks a fight; caught like a monkey =================
  function shotFight(t, lt, dur) {
    if (t < CAUGHT) {   // Ravana storms in, dripping, all ten heads furious
      const sh = shake(t, G0, .3, 6);
      camBegin(540 + sh[0], 1250, 1.15 + .06 * lt);
      bloodGround(t, 540, 1200);
      ravana(540, 1880, 25, { boilKey: 'rvg', all: { eyes: 'angry', mouth: 'teeth', brows: -1, tint: RVN.angry, tintK: .3 }, step: Math.sin(t * 9), dy: -Math.abs(Math.sin(t * 9)) * .3 });
      drips(540, 1880 - 22 * 25, 30 * 25, 1880, t, 'gdrip', 12);
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .12, .5);
      return;
    }
    // the river bank: the king holds him up like a monkey by the scruff; the queens laugh
    const l = t - CAUGHT, sh = shake(t, CAUGHT, .4, 14);
    camBegin(560 + sh[0], 1330 + sh[1], 1.1 + .02 * l);
    riverSet(t, null, { waistY: 1500, bankY: 1560 });
    queen4(0, 120, 1860, 13, { eyes: 'happy', mouth: 'open', pray: .6, lookX: 1, htilt: .1 * Math.sin(t * 8) });
    queen4(1, 980, 1860, 13, { eyes: 'happy', mouth: 'grin', handR: [2.5, -18.5], bendR: .8, lookX: -1, htilt: -.1 * Math.sin(t * 8 + 1) });
    const swing = Math.sin(l * 3) * 14, rx = 800 + swing, ry = 1130;
    king(340, 1960, 23, { eyes: 'happy', mouth: 'grin', lookX: .8, lookY: -.3, puff: .6 });
    kartReach(340, 1960, 23, rx, ry, 'greach');
    ravanaTied(rx, ry + 24.6 * 15, 15, { boilKey: 'rvc', spread: .62, heads: { 0: { eyes: 'sleepy', mouth: 'wobble' }, 2: { mouth: 'pout', eyes: 'side' }, 3: { eyes: 'angry' }, 4: { eyes: 'side', mouth: 'frown', brows: .6 }, 8: { eyes: 'shut', chinUp: 1 }, 7: { sweat: 1 } }, all: { blush: .6 }, noShadow: true, still: true });
    boilSeed('gfist'); paint(ellPts(rx, ry, 30, 26, 10), { wash: KART_PAL.skin, ink: P4.ink, sw: 1 });
    camEnd();
    caps(t);
    if (l < .2) flash(.6 * (1 - l / .2), '#FFF6DA');
  }

  // ================= H · the ashram: the wish-cow feeds the whole army =================
  function shotFeast(t, lt, dur) {
    camBegin(540, 1480 - lt * 6, 1.04 + .015 * lt);
    ashramSet(t, 'day');
    jamadagni(130, 1720, 15, { boilKey: 'jamh', seed: 5, sit: 1, mudra: .5, eyes: 'happy', mouth: 'smile', handR: [6, -15], bendR: .8 });
    kamadhenu(350, 1730, 14, { eyes: 'happy', mouth: 'smile', glowK: 1, lift: .1 });
    king(930, 1710, 13, { eyes: 'wide', mouth: 'O', lookX: -1, fanWave: .4 });
    for (let i = 0; i < 3; i++) {
      const sx = 540 + i * 130, f = seg(t, H0 + .8 + i * .5, H0 + 1.3 + i * .5);
      soldier(sx, 1730, 12, { v: i, sit: 1, spear: false, eyes: f > .5 ? 'happy' : 'wide', mouth: f > .5 ? (Math.sin(t * 9 + i) > 0 ? 'open' : 'smile') : 'O', lookX: -.6, handR: f > .5 ? [1.6, -18 - Math.max(0, Math.sin(t * 4 + i)) * 2] : undefined, bendR: .9, noShadow: true });
      leafPlate(sx, 1790, 120, f, 'hplate' + i);
      if (f > 0 && f < 1) { flushLetters(); sparkleBurst(sx, 1770, 70, f, 'hsp' + i, 6); }
    }
    camEnd();
    caps(t);
    if (lt < .45) { flushLetters(); iris(500, 1400, lerp(0, 1700, easeOut(lt / .45)), '#0A0408'); }
  }

  // ================= I · greed =================
  function shotGreed(t, lt, dur) {
    camBegin(540, 1230, 1.08 + .04 * lt);
    ashramSet(t, 'day', 'ias');
    const o = { eyes: 'look', lookX: 1, lookY: .15, brow: -.6, mouth: t > I0 + 1.2 ? 'grin' : 'flat', hx: .45, fanWave: .5 };
    king(330, 2420, 46, o);
    const [hx, hy] = naradaHead(330, 2420, 46, o);
    if (t > I0 + 1.0) eyeBlaze(hx + 10, hy + .3 * 46, 46, .55 * ease(seg(t, I0 + 1, I0 + 1.6)), '#FFC830', 'iglint');
    glow(850, 1580, 300, '#FFE6A0', .35);
    kamadhenu(850, 1740, 11, { eyes: blinkAt(t, 36.8) ? 'closed' : 'normal', mouth: 'chew', glowK: 1, flip: true });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFF6DA', .15, .5);
  }

  // ================= J · dragged away, crying, with her calf =================
  function shotTaken(t, lt, dur) {
    camBegin(560, 1500, 1.22 + .012 * lt);
    ashramSet(t, 'sunset', 'jas');
    jamadagni(170, 1700, 13, { boilKey: 'jamj', seed: 5, sit: 1, mudra: 1, eyes: 'closed', mouth: 'frown', brow: .5 });
    const dx = lt * 34, CO = { lift: .3, mouth: 'moo', mouthK: .6 + .4 * Math.sin(t * 5), eyes: 'closed', walk: t * .7, dx: -.4, glowK: .2 };
    const x = 480 + dx;
    kamadhenu(x, 1760, 17, CO);
    const [ex, ey] = cowHeadPt(x, 1760, 17, CO, -.55, -.25); tears(ex, ey + 6, lt, 'jtear', 1.1);
    const CF = { calf: 1, walk: t * 1.1, mouth: 'moo', mouthK: .7 + .3 * Math.sin(t * 6 + 1), eyes: 'closed', coat: 'dhavala', boilKey: 'jcalf', lift: .4 };
    cow(270 + dx, 1790, 12, CF);
    const [cx2, cy2] = cowHeadPt(270 + dx, 1790, 12, CF, -.55, -.25); tears(cx2, cy2 + 4, lt + .5, 'jtear2', .8);
    const [hx, hy] = cowHead(x, 1760, 17, CO), sx = 790 + dx;
    soldier(sx + 140, 1780, 16, { v: 2, walk: t * 4 + .5, eyes: 'normal', brow: -.6, mouth: 'flat', lookX: 1 });
    soldier(sx, 1780, 16, { v: 1, walk: t * 4, lean: 1.6, eyes: 'normal', brow: -.8, mouth: 'grin', lookX: -1, handL: [-4.5, -12], bendL: .3, spear: false });
    rope([hx + 24, hy + 24], [sx - 4.5 * 16, 1780 - 12 * 16], 18, 'jrope');
    grade('sunset', .2);
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [P3.sunset, '#F28A3A']); }
  }

  // ================= K · Rama comes home: the empty post =================
  function shotHome(t, lt, dur) {
    const push2 = ease(seg(t, SEE + .6, L0));
    camBegin(lerp(560, 400, push2), lerp(1440, 1260, push2), lerp(1.15, 1.7, push2));
    ashramSet(t, 'sunset', 'kas'); grade('sunset', .25);
    stake(640, 1730, 150, 'kstake');
    const wk = ease(seg(t, K0, K0 + 1.6)), seen = t > SEE, mad = t > SEE + .9;
    const o = { axe: 'shoulder', walk: wk < 1 ? t * 7 : 0, eyes: mad ? 'angry' : seen ? 'wide' : 'happy', lookX: .9, brow: mad ? -1 : seen ? .8 : 0, mouth: mad ? 'frown' : seen ? 'O' : 'smile', wind: .4 };
    rama(lerp(-80, 380, wk), 1730, 19, o);
    if (mad) { const [hx, hy] = naradaHead(380, 1730, 19, { ...RAMA, ...o }); eyeBlaze(hx, hy + .3 * 19, 19, ease(seg(t, SEE + .9, SEE + 1.5)), P3.red, 'kblaze'); }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [P3.sunset, '#F28A3A']); }
  }

  // ================= L · he goes after the king =================
  function shotRun(t, lt, dur) {
    camBegin(540, 1300, 1.08);
    dustPlain(t, { groundY: 1520 });
    boilSeed('lrocks');
    for (let i = 0; i < 7; i++) { const x = 1300 - frac(hash(i * 3.3) + lt * .7) * 1700, y = 1600 + hash(i * 5.1) * 380; paint(ellPts(x, y, 24 + 16 * hash(i), 10 + 6 * hash(i), 10), { wash: P2.dustDk, ink: P2.ink, sw: .6 }); }
    for (let i = 0; i < 4; i++) { const a = frac(lt * 2.2 + i / 4); smokePuff(420 - a * 300, 1760 - 10, 110, a, 'ldust' + i, [-1, -.3], P2.dustLt); }
    const bob = Math.abs(Math.sin(t * 11)) * .5;
    rama(560, 1770, 22, { axe: 'hold', axeGlow: .3, dhanush: .9, walk: t * 13, lean: 2.6, dy: -bob, eyes: 'angry', brow: -1, mouth: 'frown', lookX: .7, wind: 1, windDir: -1 });
    boilSeed('lspeed'); for (let i = 0; i < 9; i++) { const y = 900 + hash(i * 2.9) * 1000, x = 1200 - frac(hash(i * 1.7) + lt * 2) * 1600; inkLine([[x, y], [x + 220, y]], 2, '#FFE2B0', 'inkfine', 0); }
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .15, .6);
  }

  // ================= M · seventeen armies =================
  function shotArmies(t, lt, dur) {
    const sh = shake(t, M0 + 1.2, 3.8, 7);
    camBegin(540 + sh[0], 1350 + sh[1], 1.05 - .02 * lt);
    dustPlain(t, { groundY: 1460 });
    // the far ranks: helmets and spears to the horizon
    boilSeed('mranks');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 18; i++) {
      const x = -150 + i * 80 + r * 40 + Math.sin(t * 5 + i) * 3, y = 1500 + r * 50, s = 14 + r * 4;
      paint(ellPts(x, y, s, s * .8, 8), { wash: r === 2 ? '#6A5A6E' : '#4E4058', ink: null });
      inkLine([[x + s, y + s], [x + s * 1.3, y - s * 3.2]], 1.5, '#3A2E40', 'inkfine', 0);
    }
    const k = ease(seg(t, M0 + .8, M0 + 1.4)) * (1 - ease(seg(t, N0 - .5, N0)));
    brawlCloud(540, 1700, 270, t, k, 'mbrawl');
    // soldiers flung out of the cloud in arcs, swirl-eyed
    for (let i = 0; i < 4; i++) {
      const ph = frac((t - M0) * .55 + i * .25); if (t < M0 + 1.4) continue;
      const dir = i % 2 ? 1 : -1, x = 540 + dir * ph * 720, y = 1650 - Math.sin(ph * Math.PI) * 560;
      soldier(x, y, 9, { v: i, rot: dir * ph * 7, eyes: 'swirl', mouth: 'O', noShadow: true, handL: [-6, -20], handR: [6, -20], spear: false, boilKey: 'fly' + i });
    }
    // Rama pops up out of the dust, axe high
    const up = Math.max(0, Math.sin((t - M0 - 1.6) * 1.6)); if (t > M0 + 1.6 && up > .2) rama(540, 1700 - up * 260, 13, { axe: 'raise', axeGlow: .8, eyes: 'angry', brow: -1, mouth: 'open', noShadow: true });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, DUST); }
  }

  // ================= N · five hundred bows; Rama has one =================
  function shotBows(t, lt, dur) {
    if (t < N1) {
      const sh = shake(t, LOOSE, .4, 10);
      camBegin(540 + sh[0], 1280 + sh[1], 1.06 + .03 * lt);
      dustPlain(t, { groundY: 1600 });
      king(540, 2080, 27, { fanHeld: 'bow', fanRange: [-.15, Math.PI + .15], fanWave: .3, eyes: 'angry', brow: -1, mouth: t > LOOSE ? 'open' : 'grin', handL: [-6.5, -17], handR: [6.5, -17] });
      if (t > LOOSE) arrowVolley(540, 1200, -200, 2400, 14, (t - LOOSE) / .8, 'nvol', 2, 700);
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .14, .6);
      return;
    }
    const l = t - N1;
    camBegin(560, 1300, 1.08);
    dustPlain(t, { groundY: 1520 });
    // flip: 1 mirrors body x, so his bow hand (left) goes to screen right with a NEGATIVE x: the bow's belly and the arrow then face the volley
    rama(330, 1800, 22, { dhanush: 1, arrow: Math.sin(l * 12) > 0 ? 1 : 0, axe: false, eyes: 'angry', brow: -1, mouth: 'frown', lookX: .7, lookY: -.4, wind: .7, handL: [-7.4, -17.4], bendL: .25, handR: [1.0, -16.4], bendR: .9 });
    // their volley pours in from the top right; his arrows meet it and break it into pieces
    arrowVolley(1350, 400, 380, 1500, 16, frac(l * .7) * 1.0 + .1, 'nin', .62, 520);
    arrowVolley(1350, 450, 380, 1500, 12, frac(l * .7 + .5) * 1.0 + .1, 'nin2', .62, 520);
    arrowVolley(460, 1390, 1000, 820, 5, frac(l * 1.6), 'nout', 2, 160);
    camEnd();
    caps(t);
    cutFlash(lt);
  }

  // ================= O · the hill; the axe; a crown in the dust =================
  function shotAxe(t, lt, dur) {
    if (t < LEAP) {   // the king tears up a hill and lifts it in his thousand hands
      const l = t - O0, lift = ease(seg(t, O0, O0 + .8)), sh = shake(t, O0, 1.2, 9);
      camBegin(540 + sh[0], 1300 + sh[1], 1.0);
      dustPlain(t, { groundY: 1600 });
      const o = { fanRange: [Math.PI * .28, Math.PI * .72], fanHeld: 'grip', fanWave: .2, eyes: 'angry', brow: -1, mouth: 'roar', sweat: true, handL: [-5, -24], handR: [5, -24], bendL: .4, bendR: .4 };
      king(540, 2040, 24, o);
      hillProp(540, lerp(1500, 1230, lift), 620, Math.sin(l * 4) * .04, 'ohill');
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .12, .6);
      return;
    }
    if (t < AXE) {   // Rama leaps, the axe high, against the sun
      const l = t - LEAP, up = Math.sin(clamp(l / .5) * Math.PI * .5);
      camBegin(540, 1250, 1.05 + .2 * l);
      sunsetRidge(t, { top: 1700 });
      glow(540, 1200, 700, '#FFD27A', .5);
      rama(540, 1700 - up * 300, 26, { axe: 'raise', axeGlow: 1, pal: silPal(PSR), col: '#1C0E16', dk: '#1C0E16', lt: '#1C0E16', tilak: false, eyes: 'closed', mouth: 'flat', wind: 1, noShadow: true, aura: .6 });
      camEnd();
      caps(t);
      return;
    }
    // a white flash; then a gold crown rolls across the dust and falls still
    const l = t - AXE;
    camBegin(540, 1500, 1.25);
    dustPlain(t, { groundY: 1380 }); grade('dusk', .35);
    const roll = easeOut(seg(t, AXE + .2, AXE + 1.6)), cx = lerp(1250, 560, roll), wob = (1 - roll) * Math.sin(l * 14) * .5;
    push(); translate(cx, 1700); rotate(wob + (1 - roll) * -6); crownProp(0, 0, 130, 'ocrown'); pop();
    for (let i = 0; i < 3; i++) smokePuff(cx + 60 + i * 50, 1690, 120, clamp(l * .6 - i * .1), 'odust' + i, [1, -.4], P2.dustLt);
    camEnd();
    caps(t);
    if (l < .35) flash(1 - l / .35, '#FFFFFF');
  }

  // ================= P · home again, the cow and her calf =================
  function shotReturn(t, lt, dur) {
    camBegin(560, 1440 - lt * 5, 1.2 + .015 * lt);
    ashramSet(t, 'day', 'pas');
    const hop = Math.max(0, Math.sin(t * 5)), CO = { eyes: 'happy', mouth: 'smile', lift: -.2, flip: true, glowK: 1, ear: Math.sin(t * 4) * .2 };
    kamadhenu(700, 1730, 14, CO);
    cow(900, 1760, 9.5, { calf: 1, coat: 'dhavala', hop, eyes: 'happy', mouth: 'smile', flip: true, boilKey: 'pcalf' });
    rama(400, 1730, 19, { axe: 'shoulder', eyes: blinkAt(t, 70.4) ? 'closed' : 'happy', mouth: 'smile', lookX: 1, lookY: .3, hx: .3, wind: .3 });
    if (t > P0 + 1.4) { boilSeed('pheart'); emote('heart', 560, 1450, 30, pop(t, P0 + 1.4), t - P0 - 1.4); }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, LEAF); }
  }

  // ================= Q · his father: "our strength is forgiveness" =================
  function shotFather(t, lt, dur) {
    camBegin(560, 1150, 1.12 + .03 * lt);
    ashramSet(t, 'dusk', 'qas');
    glow(560, 1250, 600, '#FFE6B0', .25);
    const o = { boilKey: 'jamq', seed: 5, eyes: lt < 1.2 ? 'closed' : 'normal', brow: .4, mouth: talk(t, Q0 + 1.0, Q0 + 4.2, 'flat', 'o'), lookX: .4, lookY: .3, handR: [6.4, -16.6], bendR: .8 };
    jamadagni(520, 2200, 42, o);
    grade('dusk', .2);
    camEnd();
    caps(t);
    if (lt < .4) { flushLetters(); brushWipe(.5 + lt / .8, [P3.night, P3.dusk]); }
  }

  // ================= R · the ask: a ladder of strength =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1180 - lt * 4, 1 + .01 * lt);
    sunburst(t, 540, 1300);
    const S = [[30, 1720], [285, 1600], [540, 1480], [795, 1360]], Wd = 255;
    S.forEach(([x, y], i) => podium(x, y, Wd, 1960 - y + 60, 'rpod' + i));
    ravanaTied(157, 1720, 6.2, { boilKey: 'rvr', heads: { 4: { eyes: 'side', mouth: 'pout' }, 8: { eyes: 'shut', chinUp: 1 } }, all: { mouth: 'frown' }, noShadow: true, still: true });
    king(412, 1600, 8.6, { eyes: 'normal', mouth: 'frown', brow: .4, fanWave: .2, noShadow: true });
    rama(667, 1480, 10.5, { axe: 'hold', axeGlow: .4 + .2 * Math.sin(t * 3), eyes: blinkAt(t, 81.2) ? 'closed' : 'normal', brow: -.3, mouth: 'flat', aura: .4, noShadow: true });
    const q = pop(t, R0 + .9);
    glow(922, 1220, 220 * q, '#FFE6A0', .8);
    boilSeed('rq'); letter('?', 922, 1230, 220, CREAM, { screen: false, ink: false, pop: q * 2, rot: .06 * Math.sin(t * 2) });
    ['RAVANA', 'KARTAVIRYA', 'PARSHURAMA', '???'].forEach((n, i) => nameTag(n, S[i][0] + Wd / 2, S[i][1] + 70, pop(t, R0 + .3 + i * .25), 'rtag' + i));
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, BURST); }
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
  }

  shots([[0, shotHook], [B0, shotTheft], [C0, shotMistake], [D0, shotBoon], [E0, shotNarmada], [F0, shotFlood], [G0, shotFight],
    [H0, shotFeast], [I0, shotGreed], [J0, shotTaken], [K0, shotHome], [L0, shotRun], [M0, shotArmies], [N0, shotBows],
    [O0, shotAxe], [P0, shotReturn], [Q0, shotFather], [R0, shotAsk], [CARD, shotCard]]);
})();
