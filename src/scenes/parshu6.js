// parshu6.js: "PARSHURAMA challenged LORD RAM" (ad 75, Parshurama series Part 6, 88 s, Bangers captions, SFX, no voice).
// One version, Valmiki (Bala Kanda 74–76, 77.1): on the road home from Mithila, after Ram broke Shiva's bow and married
// Sita, birds shriek and the animals go round the party clockwise; Vasishtha reads the omens (74.8-13); a gale fells
// trees, darkness hides the sun, dust and ash cover the army (74.13-16); out of it comes Jamadagni's son, matted hair, the
// axe on his shoulder, a bow and a fearsome arrow (74.16-19); the sages murmur "has he come to wipe out the kings again?"
// (74.20-22); he tells Ram: I heard you broke the bow; draw this one, fit an arrow, then I'll give you a duel (75.1-4);
// Dasharatha, palms joined, begs protection for his sons (75.5-9); two bows were made by Vishvakarma, Shiva's (given to
// Devarata of Videha, the one Ram broke) and Vishnu's (given to Richika, then Jamadagni) (75.11-23); Ram takes the bow
// and arrow, strings it, fits the arrow (76.4-5): "you are a brahmin, and kin of Vishvamitra: I will not loose this at
// your life; I'll destroy your speed of mind or your worlds won by tapas; this arrow does not go in vain" (76.6-8); the
// gods led by Brahma gather to watch (76.9-10); Parshurama is drained of his vigour (76.11); "Kashyapa told me not to
// live in his domain, so I spend no night on earth: spare my speed, destroy my worlds; I know you are Vishnu; there is no
// disgrace in this" (76.13-19); the arrow destroys his worlds (76.21-22); he goes round Ram and leaves for Mahendra; the
// darkness lifts (76.22-24).
// A fast cold open, then Part 2's pace. STORYBOARD.md has the plan and the sources; sets and props are in
// parshu6_props.js (and parshu1–5_props.js). All times are video time (t); tools/parshu6_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/parshu6_sfx.mjs)
  const B0 = 3.8, C0 = 7.4;
  const D0 = 10.2, E0 = 15.0, F0 = 19.6, REVEAL = 21.8;
  const G0 = 24.8, H0 = 29.4, REV = 32.2, I0 = 34.4;
  const J0 = 39.0, SNAP = 41.0, DESC = 42.6;
  const L0 = 45.0, GRAB = 45.5, STRUNG = 46.6, NOCK = 47.4;
  const M0 = 49.8, N0 = 54.8, O0 = 59.8, DRAIN = 60.2;
  const P0 = 65.4, Q0 = 70.4, LOOSE = 70.9, HIT = 71.7;
  const R0 = 74.8, GONE = 78.0, S0 = 79.4, CARD = 84.4;
  const CARDC = { cap: CARD + .1, covers: CARD + .3, line: CARD + 1.0, logo: CARD + 1.3, pill: CARD + 1.6, bio: CARD + 1.9, follow: CARD + 2.2 };

  const GOLDC = '#F5C542', REDC = '#FF6A4A', BLUEC = '#9FDCFF';
  const talk = (t, a, b, rest = 'flat', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const shake = (t, t0, d, a) => (t > t0 && t < t0 + d) ? shakeXY(t, a * (1 - (t - t0) / d)) : [0, 0];
  const cutFlash = (lt, col = '#FFFFFF', d = .12, a = .6) => { if (lt < d) flash(a * (1 - lt / d), col); };
  const BURST = [P4.burstA, P4.burstB], STORM = [P6.stormHi, P6.stormMid], LEAF = [P1.leaf, P1.leafDk], GOLDW = [P6.fbHi, P6.fbMid];
  const BLUEBURST = ['#14204A', '#2A4A8A', '#5A8ACE'];

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['PARSHURAMA', 470, -1, B0 + .9, 132, GOLDC], ['CHALLENGED LORD RAM.', 600, -1, B0 + .9, 84],
    ['BOTH WERE', 470, B0 + .1, C0 - B0 - .2, 92], ['AVATARS OF VISHNU.', 585, B0 + .4, C0 - B0 - .5, 96, BLUEC],
    ['ONE BOW', 470, C0 + .2, D0 - C0 - .4, 104], ['DECIDED IT.', 600, C0 + .5, D0 - C0 - .7, 120, GOLDC],
    ['RAM HAD JUST BROKEN SHIVA\'S BOW', 470, D0 + .4, 4.2, 60], ['AND MARRIED SITA.', 570, D0 + .7, 3.9, 84, GOLDC],
    ['ON THE WAY HOME,', 470, E0 + .3, 4.1, 80], ['BIRDS SHRIEKED.', 570, E0 + .7, 3.7, 78], ['THE SKY WENT DARK.', 670, E0 + 1.2, 3.2, 84, GOLDC],
    ['OUT OF THE STORM', 470, F0 + .4, G0 - F0 - .6, 86], ['CAME PARSHURAMA.', 585, REVEAL, G0 - REVEAL - .2, 104, GOLDC],
    ['THE SAGES WHISPERED:', 470, G0 + .3, 4.1, 80], ['"HAS HE COME', 575, G0 + .7, 3.7, 88, GOLDC], ['FOR THE KINGS AGAIN?"', 680, G0 + 1.0, 3.4, 84, GOLDC],
    ['"YOU BROKE SHIVA\'S BOW?', 470, H0 + .3, 4.5, 74, GOLDC], ['STRING THIS ONE.', 570, H0 + 1.3, 3.5, 84, GOLDC], ['THEN FIGHT ME."', 670, REV, I0 - REV - .2, 92, REDC],
    ['KING DASHARATHA BEGGED:', 470, I0 + .3, 4.1, 76], ['"SPARE MY SONS!"', 580, I0 + .8, 3.6, 104, GOLDC],
    ['TWO BOWS WERE ONCE MADE:', 470, J0 + .3, L0 - J0 - .5, 70], ['SHIVA\'S, WHICH RAM BROKE,', 570, SNAP - .2, L0 - SNAP, 72, P6.sAshLt], ['AND VISHNU\'S. THIS ONE.', 670, DESC, L0 - DESC - .2, 80, GOLDC],
    ['RAM TOOK THE BOW,', 470, L0 + .3, 4.3, 86], ['STRUNG IT, AND NOCKED AN ARROW.', 570, STRUNG, M0 - STRUNG - .2, 62, GOLDC],
    ['"YOU ARE A BRAHMIN,', 470, M0 + .3, 4.5, 80], ['AND VISHVAMITRA\'S KIN.', 570, M0 + .7, 4.1, 76, GOLDC], ['I WON\'T TAKE YOUR LIFE."', 670, M0 + 1.2, 3.6, 78],
    ['"BUT THIS ARROW NEVER MISSES.', 470, N0 + .3, 4.5, 64], ['CHOOSE: YOUR SPEED OF MIND,', 565, N0 + .9, 3.9, 66, GOLDC], ['OR THE HEAVENS YOUR TAPAS WON."', 660, N0 + 1.5, 3.3, 62, GOLDC],
    ['PARSHURAMA\'S POWER', 470, O0 + 1.4, P0 - O0 - 1.6, 82], ['LEFT HIM.', 575, O0 + 1.6, P0 - O0 - 1.8, 104, REDC], ['HE KNEW: RAM WAS VISHNU.', 690, O0 + 2.6, P0 - O0 - 2.8, 66, BLUEC],
    ['"TAKE MY HEAVENS.', 470, P0 + .3, 4.5, 84, GOLDC], ['LEAVE ME MY SPEED:', 570, P0 + .9, 3.9, 80], ['I CAN\'T STAY ON EARTH AT NIGHT."', 665, P0 + 1.4, 3.4, 58],
    ['RAM\'S ARROW', 470, Q0 + .3, R0 - Q0 - .5, 96], ['DESTROYED HIS HEAVENS.', 580, HIT, R0 - HIT - .2, 84, GOLDC],
    ['PARSHURAMA WALKED AROUND RAM,', 470, R0 + .3, S0 - R0 - .5, 62], ['BOWED, AND LEFT FOR MAHENDRA.', 565, R0 + .7, S0 - R0 - .9, 64, GOLDC],
    ['WHY COULDN\'T PARSHURAMA', 470, S0 + .3, CARD - S0 - .3, 76], ['STAY ON EARTH AT NIGHT?', 575, S0 + .5, CARD - S0 - .5, 84, GOLDC], ['COMMENT IF YOU KNOW', 690, S0 + 1.1, CARD - S0 - 1.1, 62],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // Parshurama: bearded since the 21 wars (Part 5), his right hand on screen left (flip: 1), Vishnu's bow in his left
  const RAMA = { flip: 1, beard: PSR.hair, beardLen: .5, quiver: true, boilKey: 'rama', seed: 7 };
  const rama = (x, y, u, o = {}) => parshurama(x, y, u, { ...RAMA, ...o });
  const bowHeld = (g = .3, strung = true) => ({ handL: [-5.4, -13.6], bendL: .8, armL: vishnuBow(0, false, g, strung) });
  // Ram: the bridegroom's mala; aiming screen right (flip) with Vishnu's bow
  const RAMJ = { boilKey: 'ramj', seed: 3, chest: flowerMala };
  const ramj = (x, y, u, o = {}) => ram(x, y, u, { ...RAMJ, ...o });
  const aimPose = (draw, g, o = {}) => ({ flip: true, kodanda: false, handL: [-7.6, -18], bendL: .3, handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, armL: vishnuBow(draw, true, g), ...o });
  const silO = { pal: silPal(PSR), col: '#1C0E16', dk: '#1C0E16', lt: '#1C0E16', tilak: false, noShadow: true };

  // ================= A · the hook: Parshurama with Vishnu's bow =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 8, 1.05 + .015 * lt);
    sunburst(t, 540, 1250);
    const o = { axe: 'hold', axeGlow: .6 + .2 * Math.sin(t * 3), ...bowHeld(.5), eyes: blinkAt(t, 2.2) ? 'closed' : 'angry', brow: -1, mouth: 'frown', wind: .5, aura: .6, puff: .3 };
    rama(540, 2080, 28, o);
    camEnd();
    caps(t);
    if (lt > dur - .1) flash(.7, '#FFFFFF');
  }

  // ================= B · Ram, the bow drawn, the arrow lit =================
  function shotRamAim(t, lt, dur) {
    camBegin(540, 1250 - lt * 10, 1.08 + .02 * lt);
    sunburst(t, 600, 1300, BLUEBURST);
    ramj(400, 1980, 27, aimPose(1, .8 + .2 * Math.sin(t * 4), { eyes: blinkAt(t, 5.6) ? 'closed' : 'normal', brow: -.2, mouth: 'flat', lookX: 1, chest: undefined }));
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .14, .8);
  }

  // ================= C · the blue light on Parshurama's face; his fire flickers =================
  function shotFace(t, lt, dur) {
    camBegin(540, 1180, 1.25 + .05 * lt);
    bloodGround(t, 540, 1100);
    const fade = ease(seg(t, C0 + 1.2, D0 - .3));
    glow(540, 1150, 500, '#FF4A2A', .3 * (1 - fade));
    glow(-60, 1250, 700, P6.vGlow, .35 + .3 * fade);
    const o = { axe: 'hold', axeGlow: .7 * (1 - fade), eyes: fade > .3 ? 'wide' : 'angry', brow: fade > .3 ? .6 : -1, mouth: fade > .3 ? 'O' : 'frown', wind: .6, lookX: -.6 };
    rama(560, 2060, 40, o);
    camEnd();
    whipStreaks(lt < .08 ? 1 - lt / .08 : 0);
    caps(t);
    if (lt > dur - .4) { flushLetters(); iris(540, 1150, lerp(1700, 0, easeIn((lt - dur + .4) / .4)), '#0A0408'); }
  }

  // ================= D · the wedding party on the road home =================
  function shotRoad(t, lt, dur) {
    camBegin(540, 1500 - lt * 6, 1.04 + .02 * lt);
    roadSet(t, 0, 'droad');
    const go = lt * 18;
    royalChariot(780 + go * .4, 1580, 270, t, { key: 'dch', run: .25, riders: ([sx, sy]) => dasharatha(sx, sy, 10.4, { boilKey: 'ddash', eyes: 'happy', mouth: 'smile', lookX: -.6 }) });
    sita6(470 + go, 1820, 16, { eyes: blinkAt(t, 13.1) ? 'closed' : 'happy', mouth: 'smile', blush: .6, lookX: -.8, hx: -.3 });
    ramj(250 + go, 1830, 17, { eyes: 'happy', mouth: 'smile', lookX: .8, hx: .3 });
    petals(t, D0, 'dpet', 22);
    camEnd();
    caps(t);
    if (lt < .45) { flushLetters(); iris(540, 1300, lerp(0, 1700, easeOut(lt / .45)), '#0A0408'); }
  }

  // ================= E · the omens: birds shriek, the deer go round, the sky darkens =================
  function shotOmens(t, lt, dur) {
    const dk = .55 * ease(seg(t, E0 + 1.0, F0));
    camBegin(540, 1480, 1.06 + .015 * lt);
    roadSet(t, dk, 'eroad');
    crowBirds(t, 560, 1000, 380, 8, 'ecrow', 1.8);
    dasharatha(330, 1800, 17, { boilKey: 'edash', eyes: 'wide', brow: 1, mouth: lt > 1.4 ? 'O' : 'flat', lookY: -.8, lookX: .3, sweat: lt > 1.6, handR: [5.5, -15.5], bendR: .7 });
    vasishtha(760, 1800, 16, { eyes: 'normal', brow: .2, mouth: talk(t, E0 + 2.4, E0 + 3.8, 'flat'), lookX: -1, handL: [-6.8, -17], bendL: .5 });
    // the deer go round the party clockwise: across the front to the right, round the back to the left
    for (let i = 0; i < 3; i++) {
      const a = (lt * .45 + i / 3) % 1, front = a < .5, k = front ? a * 2 : (a - .5) * 2;
      const x = front ? lerp(-150, 1230, k) : lerp(1130, -50, k), y = front ? 2000 : 1520;
      if (!front) chital(x, y, 110, { walk: t * 4 + i, flip: true, key: 'ed' + i });
    }
    for (let i = 0; i < 3; i++) {
      const a = (lt * .45 + i / 3) % 1;
      if (a < .5) chital(lerp(-150, 1230, a * 2), 2000, 200, { walk: t * 4 + i, key: 'ef' + i });
    }
    grade('dusk', dk * .5);
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, LEAF); }
  }

  // ================= F · the storm: a figure walks out of the dust; lightning; Parshurama =================
  function shotStorm(t, lt, dur) {
    if (t < REVEAL) {
      const k = ease(seg(t, F0, REVEAL)), sh = shake(t, F0, 1.4, 5);
      camBegin(540 + sh[0], 1460 + sh[1], 1.05 + .04 * lt);
      roadSet(t, 1, 'froad');
      dustSwirl(t, .9, 'fsw');
      const u = lerp(5, 11, k), y = lerp(1430, 1560, k), o = { ...silO, axe: 'shoulder', ...bowHeld(0), walk: t * 4, eyes: 'closed', mouth: 'flat', wind: .9 };
      rama(540, y, u, o);
      const [hx, hy] = naradaHead(540, y, u, { ...RAMA, ...o }); eyeBlaze(hx, hy + .3 * u, u, .9, P3.red, 'fbl');
      dustSwirl(t + 3, .6, 'fsw2');
      camEnd();
      caps(t);
      if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, STORM); }
      return;
    }
    const l = t - REVEAL, bolt = l < .5 ? 1 - l / .5 : (Math.abs(l - 1.9) < .1 ? .6 : 0);
    camBegin(540, 1380 - l * 14, 1.0 + .03 * l);
    stormSky(t, { bolt, floorY: 1900 });
    dustSwirl(t, .5, 'fsw3');
    rama(540, 2160, 30, { axe: 'shoulder', axeGlow: .5, ...bowHeld(.3), eyes: 'angry', brow: -1, mouth: 'frown', wind: 1, aura: .7, lookY: .2 });
    camEnd();
    caps(t);
    if (l < .3) flash(1 - l / .3, '#FFFFFF');
  }

  // ================= G · the sages whisper =================
  function shotWhisper(t, lt, dur) {
    camBegin(540, 1470, 1.12 + .02 * lt);
    roadSet(t, .85, 'groad'); dustSwirl(t, .3, 'gsw');
    vasishtha(400, 1860, 19, { eyes: 'look', lookX: 1, brow: .8, mouth: talk(t, G0 + .6, G0 + 2.2, 'flat', 'O'), lean: .8, sweat: true, hx: .4 });
    sage6(690, 1860, 18.5, { eyes: 'wide', lookX: -1, brow: 1, mouth: talk(t, G0 + 2.3, G0 + 4, 'O'), lean: -.6, sweat: true, hx: -.4, handL: [-3.4, -18.4], bendL: 1 });
    grade('dusk', .5);
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .1, .4);
  }

  // ================= H · "You broke Shiva's bow? String this one. Then fight me." / Ram's calm face =================
  function shotChallenge(t, lt, dur) {
    if (t < REV) {
      const sh = shake(t, H0 + 1.3, .3, 5);
      camBegin(560 + sh[0], 1360 + sh[1], 1.05 + .03 * lt);
      stormSky(t, { floorY: 1900 }); grade('dusk', .25);
      rama(600, 2180, 29, { axe: 'shoulder', axeGlow: .4, handL: [-7.4, -17.4], bendL: .4, armL: vishnuBow(0, false, .45, false), eyes: 'angry', brow: -1, mouth: talk(t, H0 + .3, REV - .3, 'frown', 'open'), lookX: -.7, wind: .7, aura: .5 });
      camEnd();
      caps(t);
      cutFlash(lt, '#FFFFFF', .12, .5);
      return;
    }
    const l = t - REV;
    camBegin(540, 1300, 1.2 + .03 * l);
    roadSet(t, .85, 'hroad'); grade('dusk', .4);
    ramj(480, 2150, 30, { eyes: blinkAt(t, 33.4) ? 'closed' : 'normal', brow: -.1, mouth: 'flat', lookX: 1, hx: .3 });
    camEnd();
    caps(t);
    cutFlash(l, '#FFFFFF', .1, .4);
  }

  // ================= I · Dasharatha begs; Parshurama does not look at him =================
  function shotBeg(t, lt, dur) {
    camBegin(560, 1480, 1.08 + .02 * lt);
    roadSet(t, .85, 'iroad'); grade('dusk', .4);
    rama(770, 1880, 19, { axe: 'shoulder', axeGlow: .3, ...bowHeld(.25), eyes: 'look', lookX: -1, lookY: -.3, brow: -.8, mouth: 'flat', hx: -.3, wind: .5 });
    dasharatha(330, 1880, 16, { boilKey: 'idash', pray: 1, bow: .35 + .05 * Math.sin(t * 3), eyes: 'wide', brow: 1, mouth: talk(t, I0 + .8, I0 + 2.6, 'frown', 'open'), lookX: 1, lookY: -.4, sweat: true, tint: '#C8D2E2', tintK: .2 });
    if (lt > 1.4) { const [hx, hy] = naradaHead(330, 1880, 16, { bow: .35 }); tears(hx + .8 * 16, hy + .6 * 16, lt - 1.4, 'itr', 1); }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, STORM); }
  }

  // ================= J · the two bows: Shiva's (broken), Vishnu's (handed down) =================
  function shotBows(t, lt, dur) {
    camBegin(540, 1200, 1.0 + .015 * lt);
    boilSeed('jbg'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: P6.fbHi, ink: null });
    paint(ellPts(540, 1250, 900, 1000, 30), { fill: P6.fbMid, fillOp: 220, bleed: .3, tex: .5, border: .3, ink: null });
    paint(ellPts(540, 1250, 520, 620, 26), { fill: P6.fbLo, fillOp: 120, bleed: .35, tex: .5, ink: null });
    const sn = ease(seg(t, SNAP, SNAP + 1.0)), dn = ease(seg(t, DESC, L0 - .3)), bob = Math.sin(t * 1.6) * 14;
    if (sn < 1) divineBow(320, 1180 + bob + sn * 60, 560, -.08, 'shiva', { snap: sn, key: 'jsh' });
    divineBow(lerp(760, 640, dn), lerp(1180 - bob, 1500, dn), lerp(560, 460, dn), lerp(.08, .25, dn), 'vishnu', { glow: 1 + dn * .5, key: 'jvi' });
    // the line it came down: Richika, Jamadagni, Rama (silhouettes rise below as it descends)
    if (dn > 0) {
      for (let i = 0; i < 3; i++) {
        const k = ease(seg(t, DESC + .3 + i * .5, DESC + .8 + i * .5)), x = [260, 540, 820][i];
        if (k <= 0) continue;
        glow(x, 1990 - 200 + (1 - k) * 200, 260, '#FFD27A', .45 * k);
        const so = { ...silO, eyes: 'closed', mouth: 'flat', axe: i === 2 ? 'hold' : false, beard: i === 0 ? PSR.hair : i === 1 ? '#5A5258' : PSR.hair };
        if (i < 2) valmiki(x, 1990 + (1 - k) * 200, 13, { ...so, pal: silPal(VALMIKI_PAL), boilKey: 'jsil' + i, beardLen: 1 });
        else rama(x, 1990 + (1 - k) * 200, 13, so);
      }
    }
    camEnd();
    caps(t);
    if (t > SNAP && t < SNAP + .15) flash(.5, '#FFFFFF');
    if (lt < .4) { flushLetters(); brushWipe(.5 + lt / .8, GOLDW); }
  }

  // ================= L · Ram takes the bow, strings it, nocks an arrow =================
  function shotString(t, lt, dur) {
    const sh = shake(t, STRUNG, .25, 6);
    camBegin(520 + sh[0], 1330 + sh[1], 1.1 + .04 * lt);
    roadSet(t, .9, 'lroad'); grade('dusk', .45);
    const had = t > GRAB, strung = t > STRUNG, draw = ease(seg(t, NOCK, NOCK + .7)), g = ease(seg(t, NOCK + .3, NOCK + 1.4));
    if (g > 0) glow(700, 1350, 700, P6.vGlow, .3 * g);
    const o = had ? { flip: true, kodanda: false, handL: [-7.6, -18], bendL: .3, ...(strung ? { handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9 } : {}), armL: vishnuBow(draw, true, g, strung) }
      : { flip: true, kodanda: false, handL: [-7.2, -17], bendL: .4 };
    ramj(430, 2080, 28, { ...o, eyes: g > .5 ? 'angry' : 'normal', brow: -.3, mouth: 'flat', lookX: 1 });
    if (!had) { const k = ease(seg(t, L0, GRAB)); push(); translate(lerp(1300, 760, k), lerp(1300, 1570, k)); rotate(lerp(1.2, 0, k)); vishnuBow(0, false, .3, false)(28, 1.6); pop(); }
    if (t > STRUNG && t < STRUNG + .5) sparkleBurst(560, 1300, 180, (t - STRUNG) / .5, 'lsp', 10, ['#FFFFFF', P6.vGlow]);
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, GOLDW); }
    if (t > GRAB && t < GRAB + .1) flash(.3, '#FFFFFF');
  }

  // ================= M · "You are a brahmin, and Vishvamitra's kin: I won't take your life." =================
  function shotSpare(t, lt, dur) {
    camBegin(560, 1440, 1.05 + .02 * lt);
    roadSet(t, .9, 'mroad'); grade('dusk', .45);
    glow(780, 1400, 360, P6.vGlow, .3);
    rama(800, 1820, 15, { axe: 'shoulder', axeGlow: .25, eyes: 'wide', brow: .6, mouth: 'flat', lookX: -1, hx: -.3, sweat: lt > 2 });
    ramj(260, 2050, 23, aimPose(1, .9, { eyes: 'normal', brow: -.2, mouth: talk(t, M0 + .3, M0 + 4.2, 'flat', 'open'), lookX: 1 }));
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .1, .4);
  }

  // ================= N · "This arrow never misses. Choose: your speed, or your heavens." =================
  function shotChoose(t, lt, dur) {
    camBegin(560, 1250, 1.2 + .05 * lt);
    sunburst(t, 700, 1300, BLUEBURST);
    glow(860, 1240, 300, P6.vHot, .5 + .1 * Math.sin(t * 8));
    ramj(330, 2120, 36, aimPose(1, 1, { eyes: 'angry', brow: -.5, mouth: talk(t, N0 + .3, N0 + 4.3, 'flat', 'open'), lookX: 1 }));
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .12, .5);
  }

  // ================= O · the gods gather to watch; Parshurama's power leaves him =================
  function shotDrain(t, lt, dur) {
    const d = ease(seg(t, DRAIN, DRAIN + 2.0)), op = ease(seg(t, O0, O0 + 1.2));
    camBegin(540, 1070 - lt * 8, 1.0 + .02 * lt);
    roadSet(t, .9, 'oroad'); grade('dusk', .4);
    heavenGlow(t, 540, 760, op, 'ohv');
    for (let i = 0; i < 5; i++) cloudPuff(-120 + i * 330, 1060 + (i % 2) * 30, 170, 'ocl' + i, 230 * op, '#FFF2DA', '#F2D2A8');
    if (op > .05) {
      brahma(540, 1010 + (1 - op) * 40, 8.5, { boilKey: 'obr', eyes: 'normal', mouth: 'smile', lookY: .6, lotusGlow: op });
      ancestor(1, 250, 1050 + (1 - op) * 40, 7.5, { eyes: 'normal', mouth: 'O', lookY: .6, glowA: op });
      ancestor(2, 830, 1050 + (1 - op) * 40, 7.5, { eyes: 'wide', mouth: 'O', lookY: .6, glowA: op });
    }
    for (let i = 0; i < 4; i++) cloudPuff(-60 + i * 380, 1110, 140, 'ocf' + i, 240 * op, '#FFF6EC', '#F2D8B8');
    const o = { axe: 'hold', axeGlow: .8 * (1 - d), eyes: d > .5 ? 'wide' : 'angry', brow: lerp(-1, .9, d), mouth: d > .6 ? 'O' : 'frown', lookX: -.8, aura: .8 * (1 - d), wind: .6 * (1 - d), sweat: d > .7, tint: '#9AA8C8', tintK: .25 * d };
    rama(620, 2150, 26, o);
    if (d > 0 && d < 1) { const [hx, hy] = naradaHead(620, 2150, 26, { ...RAMA, ...o }); for (let i = 0; i < 6; i++) { const a = hash(i * 2.3) * TAU, r = 200 + d * 300; glow(hx + Math.cos(a) * r * (1 - d * .3), hy + 160 + Math.sin(a) * r * .6 - d * 300, 50, '#FFB060', .5 * (1 - d)); } }
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, STORM); }
  }

  // ================= P · "Take my heavens. Leave me my speed: I can't stay on earth at night." =================
  function shotYield(t, lt, dur) {
    camBegin(540, 1300, 1.15 + .02 * lt);
    roadSet(t, .85, 'proad'); grade('dusk', .4);
    glow(-100, 1400, 600, P6.vGlow, .25);
    boilSeed('paxe'); push(); translate(820, 2050); rotate(1.35); parashu(26, 1.6, { glow: 0 }); pop();
    rama(560, 2150, 29, { axe: false, pray: 1, bow: .15, eyes: blinkAt(t, 68.6) ? 'closed' : 'normal', brow: .5, mouth: talk(t, P0 + .3, P0 + 4.2, 'smile', 'open'), lookX: -.8, hx: -.3, tint: '#9AA8C8', tintK: .1 });
    camEnd();
    caps(t);
    cutFlash(lt, '#FFFFFF', .1, .4);
  }

  // ================= Q · Ram looses: the arrow destroys his heavens =================
  function shotArrow(t, lt, dur) {
    if (t < LOOSE + .3) {
      const draw = t < LOOSE ? 1 : 0;
      camBegin(560, 1250, 1.22 + .05 * lt);
      sunburst(t, 700, 1300, BLUEBURST);
      ramj(330, 2120, 36, aimPose(draw, 1, { eyes: 'angry', brow: -.5, mouth: 'flat', lookX: 1, handR: draw ? undefined : [-1.6, -15.5] }));
      if (!draw) astraStreak(900, 1250, 1600, 1100, (t - LOOSE) / .3, 'qst');
      camEnd();
      caps(t);
      if (t > LOOSE && t < LOOSE + .12) flash(.8, '#FFFFFF');
      return;
    }
    const l = t - LOOSE - .3;
    camBegin(540, 1200, 1.0);
    boilSeed('qsky'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#141030', ink: null });
    heavenGlow(t, 540, 1050, .45, 'qhv');
    const ISL = [[300, 1050, 320, HIT + .2], [780, 900, 360, HIT + .6], [560, 1380, 300, HIT + 1.0]];
    for (const [x, y, s, th] of ISL) lokaIsle(x, y, s, t, { burst: (t - th) / 1.2, key: 'qi' + x });
    for (let i = 0; i < 3; i++) { const [x, y, , th] = ISL[i], x0 = i ? ISL[i - 1][0] : -100, y0 = i ? ISL[i - 1][1] : 2000, t0 = i ? ISL[i - 1][3] : LOOSE + .3; astraStreak(x0, y0, x, y, (t - t0) / (th - t0), 'qa' + i); }
    camEnd();
    caps(t);
    for (const [, , , th] of ISL) if (t > th && t < th + .12) flash(.6, '#FFFFFF');
  }

  // ================= R · he walks round Ram, bows, and is gone; the darkness lifts =================
  function shotRound(t, lt, dur) {
    const clear = ease(seg(t, GONE - .2, S0 - .2));
    camBegin(540, 1480, 1.08 + .01 * lt);
    roadSet(t, .85 * (1 - clear), 'rroad'); grade('dusk', .4 * (1 - clear));
    const a = ease(seg(t, R0 + .3, GONE - .2)) * TAU, gone = t > GONE;
    const px = 540 + Math.sin(a) * 300, py = 1830 - Math.cos(a) * 50, pu = 16 + Math.cos(a) * 1.5, front = Math.cos(a) > 0;
    const po = { axe: false, pray: 1, eyes: 'closed', mouth: 'smile', walk: a > 0 && !gone ? t * 5 : 0, flip: Math.cos(a) > 0 ? 1 : 0 };
    if (!gone && !front) rama(px, py, pu, po);
    ramj(540, 1840, 17, { kodanda: false, flip: true, handL: [-5.4, -13.6], bendL: .8, armL: vishnuBow(0, false, .3), eyes: 'happy', mouth: 'smile', lookX: Math.sin(a) * .8 });
    if (!gone && front) rama(px, py, pu, po);
    if (t > GONE && t < GONE + .6) { const k = (t - GONE) / .6; astraStreak(540, 1600, 1500, 400, k * 2, 'rgo'); sparkleBurst(540, 1600, 200, k, 'rsp', 10, ['#FFFFFF', '#FFD27A']); }
    if (gone) glow(540, 1000, 700, '#FFE6A0', .3 * clear);
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, STORM); }
  }

  // ================= S · the ask: why no night on earth? (Mahendra, under the moon) =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1250 - lt * 4, 1 + .01 * lt);
    boilSeed('snight'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: P3.night, ink: null });
    paint(ellPts(540, 1300, 900, 700, 26), { fill: '#2A2A5A', fillOp: 200, bleed: .3, tex: .4, ink: null });
    boilSeed('sstars'); for (let i = 0; i < 22; i++) paint(starPts(hash(i * 2.3) * 1080, 300 + hash(i * 6.7) * 1100, 3 + 4 * hash(i * 3.3), .4, 4), { wash: '#FFF6DA', washOp: 200 + 55 * Math.sin(t * 3 + i), ink: null });
    boilSeed('smoon'); glow(860, 1180, 260, '#FFF2C8', .4); paint(ellPts(860, 1180, 90, 90, 24), { wash: '#FFF6DA', ink: P6.ink, sw: 1 }); paint(ellPts(896, 1164, 80, 82, 24), { wash: '#2A2A5A', ink: null });
    boilSeed('speak'); paint([[-300, 2400], [-300, 1900], [220, 1700], [420, 1560], [560, 1520], [700, 1580], [980, 1760], [1380, 1880], [1380, 2400]], { wash: '#1E1830', fill: '#120E20', fillOp: 70, tex: .4, ink: P6.ink, sw: 1, curv: .3 });
    rama(560, 1600, 14, { sit: 1, axe: false, mudra: 1, eyes: 'closed', mouth: 'smile', aura: .25, noShadow: true });
    camEnd();
    caps(t);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, [P3.night, '#2A2A5A']); }
    if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, BURST); }
  }

  function shotCard(t, lt) {
    navCard(t, CARDC);
    if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, BURST); }
  }

  shots([[0, shotHook], [B0, shotRamAim], [C0, shotFace], [D0, shotRoad], [E0, shotOmens], [F0, shotStorm], [G0, shotWhisper],
    [H0, shotChallenge], [I0, shotBeg], [J0, shotBows], [L0, shotString], [M0, shotSpare], [N0, shotChoose],
    [O0, shotDrain], [P0, shotYield], [Q0, shotArrow], [R0, shotRound], [S0, shotAsk], [CARD, shotCard]]);
})();
