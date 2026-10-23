// rp2.js: Ramayan Part 2, "The Two Boons" (~74 s, Painted, an English voiceover with captions in Bangers, SFX). Told
// from the Valmiki Ramayana, Ayodhya Kanda: Dasharatha decides to crown Ram (1–4); the city is decked out, and the
// hunchbacked maid Manthara sees it from the terrace (7); Kaikeyi rejoices, gives her a jewel and says she sees no
// difference between Ram and Bharat (7); Manthara throws it away and warns her that Ram will banish Bharat or worse
// (8); she reminds her of the war against Shambara, when Kaikeyi carried the wounded king from the field and he gave
// her two boons, and sends her to the room of anger (9); the king finds her on the floor and swears by Ram (10–11); she
// asks: crown Bharat, and send Ram to the forest for fourteen years (11); he falls and begs her all night (12–14);
// Ram hears it at dawn, unruffled: "Let it be. I will go" (19). The Part 3 tease (the king's curse) and the follow card.
// STORYBOARD.md has the plan and the sources; sets in rp2_props.js and src/ramayan_sets.js, the cast in src/ramayan.js.
// Every time comes from the voice (src/scenes/rp2_vo.js from tools/rp2_vo.json); tools/rp2_sfx.mjs recomputes them.
(() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const B0 = mid('hook', 'intro'), C0 = mid('intro', 'crown'), D0 = mid('crown', 'city'), E0 = mid('city', 'happy'), G0 = mid('throw', 'boons'), H0 = mid('boons', 'room');
  const L0 = mid('fell', 'dawn'), M0 = mid('dawn', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
  const SEND = Wd('hook', 0, 7), TOMORROW = Wd('crown', 0, 3), CROWNED = Wd('crown', 0, 7), LIT = Wd('city', 0, 1), MANTH = Wd('city', 0, 6), WATCH = Wd('city', 0, 7);
  const RAN = Wd('happy', 0, 1), OVERJOY = Wd('happy', 0, 8), GAVE = Wd('happy', 1, 1), JEWEL = Wd('happy', 1, 4), NODIFF = Wd('same', 0, 3), BHARAT1 = Wd('same', 0, 7);
  const THREW = Wd('throw', 0, 1), WAKE = Wd('throw', 0, 5), BANISH = Wd('throw', 0, 9), WORSE = Wd('throw', 0, 13);
  const WAR = Wd('boons', 0, 2), SAVED = Wd('boons', 0, 4), TWO = Wd('boons', 1, 4), USE = Wd('boons', 1, 6);
  const TORE = Wd('room', 0, 2), LAY = Wd('room', 0, 7), ANGER = Wd('room', 0, 13), FOUND = Wd('swear', 0, 2), SWORE = Wd('swear', 0, 6), RAMS = Wd('swear', 0, 8);
  const FIRST = Wd('ask', 0, 0), CROWNB = Wd('ask', 0, 2), SECOND = Wd('ask', 1, 0), FOREST = Wd('ask', 1, 5), YEARS = Wd('ask', 1, 7);
  const FELL = Wd('fell', 0, 1), BEGGED = Wd('fell', 0, 3), NIGHT = Wd('fell', 0, 6), MOVE = Wd('fell', 0, 10);
  const DAWN = Wd('dawn', 0, 1), HEARD = Wd('dawn', 0, 3), FACE = Wd('dawn', 0, 7), LETBE = Wd('dawn', 1, 0), GO = Wd('dawn', 1, 5);
  const CURSE = Wd('next', 0, 6), YOUTH = Wd('next', 0, 9), TRUE = Wd('next', 0, 13);
  const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };
  window.RP2_T = { B0, C0, D0, E0, G0, H0, L0, M0, K0, END, SEND, TOMORROW, CROWNED, LIT, MANTH, WATCH, RAN, OVERJOY, GAVE, JEWEL, NODIFF, BHARAT1, THREW, WAKE, BANISH, WORSE,
    WAR, SAVED, TWO, USE, TORE, LAY, ANGER, FOUND, SWORE, RAMS, FIRST, CROWNB, SECOND, FOREST, YEARS, FELL, BEGGED, NIGHT, MOVE, DAWN, HEARD, FACE, LETBE, GO, CURSE, YOUTH, TRUE, CARD };

  const GOLDC = P2.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], HALLC = [P1.hall, P1.pillar], NIGHTC = [P2.nightHi, P2.nightLo], ROSEC = [P2.rose, P2.silk], SEPC = [P2.sepia, P2.sepiaDk], DARKC = ['#231C3A', '#3A2E58'];

  function caps(t) {
    for (const k of VO.caps) {
      if (k.id === 'intro' || k.id === 'follow') continue;
      const a = k.id === 'hook' ? -1 : k.a, b = k.b;
      if (t < a || t > b) continue;
      const lines = k.text.split('|').map(s => s.trim()), y0 = 470;
      lines.forEach((l, i) => {
        const gold = l.includes('*');
        caption(l.replace(/\*/g, '').toUpperCase(), y0 + i * 104, t - a - i * .12, { life: b - a - i * .12, size: gold ? 92 : 76, color: gold ? GOLDC : undefined });
      });
    }
  }

  // ================= A · the hook: Kaikeyi, loving, then cold, pointing away =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1220 - lt * 10, 1 + lt * .012);
    warmBack(t, 'ha', 540, 1150);
    const cold = ease(seg(t, SEND - .3, SEND + .2));
    kaikeyi(470, 2000, 36, { boilKey: 'kh', eyes: cold > .5 ? 'angry' : 'happy', mouth: cold > .5 ? 'frown' : 'smile', hx: cold * .3, lookX: cold, tint: cold > .5 ? '#3A2E58' : null, tintK: .15 * cold,
      handR: cold > 0 ? [lerp(3.3, 9, cold), lerp(-11.2, -17.5, cold)] : [.8, -15.4], bendR: .5, handL: cold > 0 ? undefined : [-.8, -15.2],
      emote: cold < .5 ? 'heart' : undefined, emoteK: 1, emoteAge: t });
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 2, 'THE TWO BOONS'); wipeIn(lt, CARDC); wipeOut(lt, dur, HALLC); }

  // ================= C · the court: tomorrow Ram will be crowned =================
  function shotCrown(t, lt, dur) {
    camBegin(540, 1280, 1.0 + lt * .01);
    court(t, 'c');
    throne(540, 1290, 300, 'cth');
    const up = ease(seg(t, TOMORROW - .3, TOMORROW + .2));
    dasharatha(540, 1320, 17, { boilKey: 'cd', sit: 1, eyes: 'happy', mouth: 'grin', handR: [lerp(3.4, 6, up), lerp(-11, -19, up)], bendR: .5 });
    const bow = ease(seg(t, CROWNED - .3, CROWNED + .3));
    ram(830, 1850, 20, { boilKey: 'cr', bow: bow * .45, pray: bow, eyes: bow > .5 ? 'closed' : 'normal', mouth: 'smile', lookY: -.6, lookX: -.6, hx: -.3 });
    if (t > CROWNED - .2) petals(t - CROWNED, 'cpet', 14);
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= D · Ayodhya lit up; Manthara watches from the terrace =================
  function shotCity(t, lt, dur) {
    const push2 = ease(seg(t, MANTH - .5, MANTH + .6));
    camBegin(lerp(540, 700, push2), lerp(1150, 1420, push2), lerp(.95, 1.45, push2));
    ayodhyaNight(t, 'd');
    if (t > LIT - .2) { boilSeed('dfw'); for (let i = 0; i < 3; i++) { const k = frac((t - LIT) * .5 + i / 3), fx = 200 + i * 300, fy = 700 - k * 150; for (let j = 0; j < 10; j++) { const a = j / 10 * TAU; inkLine([[fx + Math.cos(a) * 40 * k * 3, fy + Math.sin(a) * 40 * k * 3], [fx + Math.cos(a) * 60 * k * 3, fy + Math.sin(a) * 60 * k * 3]], 2.4, j % 2 ? '#FFD45A' : '#F39A2E', 'ink', 0); } } }
    manthara(820, 1930, 26, { boilKey: 'dm', eyes: t > WATCH ? 'narrow' : 'normal', mouth: t > WATCH ? 'smirk' : 'flat', lookX: -.8, hx: -.4, handL: [-3.6, -13.6], handR: [3.4, -13.4] });
    terrace(540, 1560, 1600, 'dterr');
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTC);
    wipeOut(lt, dur, ROSEC);
  }

  // ================= E–F · Kaikeyi's chamber: joy, the jewel, "no difference"; the jewel thrown; the poison =================
  function shotQueen(t, lt, dur) {
    const c = kf(t, [[E0, [540, 1300, 1.0]], [THREW - .3, [540, 1300, 1.0]], [WAKE, [700, 1250, 1.25]], [BANISH + .4, [560, 1250, 1.15]]], ease);
    camBegin(c[0], c[1], c[2]);
    queenRoom(t, 'e', .3 * ease(seg(t, WAKE, WORSE)));
    // Manthara hurries in from the right
    const inK = easeOut(seg(t, E0, RAN + .5)), mx = lerp(1250, 760, inK);
    const throwK = ease(seg(t, THREW - .25, THREW + .1)), whisper = t > WAKE - .2;
    manthara(mx, 1800, 24, { boilKey: 'em', flip: true, walk: inK < 1 ? t * 2 : undefined, eyes: t > THREW - .3 ? 'angry' : 'narrow', mouth: whisper ? (Math.sin(t * 9) > 0 ? 'open' : 'smirk') : t > THREW - .3 ? 'frown' : 'flat',
      lean: whisper ? -2.2 : 0, handR: t > GAVE && t < THREW + .3 ? [lerp(4.4, 6.2, throwK), lerp(-15, -22, throwK)] : whisper ? [3.2, -20.5] : undefined, bendR: .5 });
    // Kaikeyi: overjoyed, gives the jewel, hand on her heart; then listens, her smile fading, sweat on "banish"
    const joy = t > OVERJOY - .2 && t < WAKE + .3, give = ease(seg(t, GAVE - .1, JEWEL)), heartH = t > NODIFF - .2 && t < THREW;
    kaikeyi(330, 1800, 24, { boilKey: 'ek', eyes: t > BANISH ? 'wide' : joy ? 'happy' : 'normal', mouth: t > BANISH ? 'O' : joy ? 'grin' : t > WAKE ? 'flat' : 'smile', lookX: .7, hx: .3,
      handR: heartH ? [.8, -15.4] : give > 0 && t < NODIFF ? [lerp(3.3, 7.5, give), lerp(-11.2, -15, give)] : undefined, bendR: .5,
      emote: heartH ? 'heart' : t > BANISH ? 'sweat' : joy ? 'spark' : undefined, emoteK: 1, emoteAge: t });
    // the jewel: from her hand to Manthara's (GAVE..JEWEL), held, then flung away over her shoulder
    if (t > GAVE - .1) {
      const [kx, ky] = parvatiHand(330, 1800, 24, { handR: [7.5, -15], bendR: .5 }, 1), [hx, hy] = parvatiHand(mx, 1800, 24, { flip: true, handR: [6.2, -22], bendR: .5 }, 1);
      if (t < JEWEL + .1) { const p = arcPt([kx, ky], [hx + 10, hy + 160], -140, ease(seg(t, GAVE - .1, JEWEL + .1))); necklace(p[0], p[1], 90, 0, 'ejw'); }
      else if (t < THREW - .25) necklace(hx + 10, hy + 160, 90, 0, 'ejw');
      else if (t < THREW + 1.4) { const k = easeOut(seg(t, THREW - .25, THREW + .6)), p = arcPt([hx, hy], [1250, 1700], -500, k); necklace(p[0], p[1], 90, k * 6, 'ejw'); }
    }
    // the whisper: a bubble over Kaikeyi of Bharat walking away, small, a crown falling off
    if (t > BANISH - .3 && t < G0) {
      const k = backOut(clamp((t - BANISH + .3) * 3)), bx = 380, by = 1060;
      boilSeed('ebub'); paint(ellPts(bx, by, 260 * k, 200 * k, 22, 4), { wash: '#E8DCEF', ink: P2.ink, sw: 1, curv: .8 });
      if (k > .5) { const w = clamp((t - BANISH) * .6); kartikeya(bx + 80 - w * 200, by + 150, 13 * k, { boilKey: 'ebh', flip: true, walk: t * 2, feather: false, spear: false, shield: false, crown: 1, eyes: 'wide', mouth: 'wobble' }); }
    }
    camEnd();
    caps(t);
    wipeIn(lt, ROSEC);
    wipeOut(lt, dur, SEPC);
  }

  // ================= G · the war (sepia): Kaikeyi drives the chariot out with the wounded king; two boons =================
  function shotWar(t, lt, dur) {
    const sh = shakeXY(t, 3);
    camBegin(540 + sh[0], 1300 + sh[1], 1.0);
    warField(t, 'g');
    const gal = t * 1.8, X = 520 + Math.sin(t * 1.3) * 20;
    suryaHorse(X + 380, 1560, 20, { boilKey: 'gh', gallop: gal, mane: sep('#6A3A2A', .6), coat: sep('#E8D8C4', .6), coatDk: sep('#C8B49A', .6) });
    suryaChariot(X, 1720, 22, { part: 'back', boilKey: 'gc' });
    const [sx, sy] = suryaChariotSeat(X, 1720, 22);
    dasharatha(sx - 90, sy + 40, 20, { boilKey: 'gd', rot: -.5, eyes: 'closed', mouth: 'frown', brow: .6, tint: P2.sepia, tintK: .35, noShadow: true });
    kaikeyi(sx + 70, sy, 21, { boilKey: 'gk', eyes: 'angry', brow: -.6, mouth: 'flat', lean: 1.5, handL: [3.6, -13.2], handR: [5.4, -13.6], bendL: .4, bendR: .4, tint: P2.sepia, tintK: .3, noShadow: true, lookX: 1, hx: .4 });
    suryaChariot(X, 1720, 22, { part: 'front', boilKey: 'gc', spin: t * 8, pole: suryaHorseBit(X + 380, 1560, 20) });
    const [hx, hy] = parvatiHand(sx + 70, sy, 21, { lean: 1.5, handR: [5.4, -13.6] }, 1);
    inkLine([[hx, hy], suryaHorseBit(X + 380, 1560, 20)], 1.6, P2.sepiaDk, 'ink', .2);   // the reins
    // "two boons": the king, saved, lifts two golden lights from his hands to her
    if (t > TWO - .3) for (let i = 0; i < 2; i++) { const k = ease(clamp((t - TWO + .3 - i * .2) * 1.5)), p = arcPt([sx - 60, sy - 250], [sx + 20 + i * 110, sy - 450], -80, k); boilLight(p, k, i); }
    camEnd();
    caps(t);
    wipeIn(lt, SEPC);
    wipeOut(lt, dur, DARKC);
  }
  const boilLight = (p, k, i) => boonLight(p[0], p[1], 36, k, 'gb' + i);

  // ================= H–K · the room of anger: jewels torn off; the king swears by Ram; the two boons; he falls =================
  function shotAnger(t, lt, dur) {
    const c = kf(t, [[H0, [540, 1350, 1.0]], [FOUND - .3, [540, 1350, 1.0]], [RAMS, [560, 1280, 1.05]], [FIRST - .2, [560, 1330, 1.12]], [FELL - .3, [600, 1400, 1.05]], [MOVE, [620, 1420, 1.1]]], ease);
    camBegin(c[0], c[1], c[2]);
    angerRoom(t, 'h', { night: seg(t, BEGGED, L0) });
    const lit = ease(seg(t, FOUND - .4, FOUND + .3));
    if (lit > 0) glow(760, 1350, 520 * lit, P2.lamp, .45 * lit);
    // Kaikeyi: tears off the crown and the necklace, flings them, lies down on the floor; sits up cold to ask
    const tear = ease(seg(t, TORE - .2, TORE + .4)), down = ease(seg(t, LAY - .1, LAY + .6)), up = ease(seg(t, FIRST - .7, FIRST - .2)), turn = t > MOVE - .4;
    const lying = down * (1 - up);
    kaikeyi(260, 1820, 23, { boilKey: 'hk', plain: tear > .5, hairDown: tear, rot: lying * Math.PI / 2 * .92, dy: lying * 2, noShadow: lying > .3, eyes: lying > .5 ? 'closed' : t > FIRST - .2 ? 'angry' : 'normal', mouth: t > FIRST - .2 ? 'flat' : 'frown', brow: -.6,
      flip: turn, lookX: .8, hx: turn ? -.4 : .3, handR: t > FIRST - .2 && t < FELL ? [lerp(3.6, 6, 1), -20.5 + (t > SECOND - .1 ? -.5 : 0)] : tear > 0 && tear < 1 ? [2.2, -22.5] : undefined, bendR: .4 });
    if (tear > 0 && t < TORE + 1.3) { const k = ease(seg(t, TORE, TORE + 1.2)); boilSeed('hjw'); necklace(lerp(420, 120, k), lerp(1300, 1760, k) - Math.sin(k * Math.PI) * 120, 70, k * 8, 'hnk'); paint(starPts(lerp(380, 700, k), lerp(1240, 1780, k) - Math.sin(k * Math.PI) * 160, 22, .5, 5, k * 9), { wash: P2.gold, ink: P2.ink, sw: .6 }); }
    if (t > TORE + 1.2) { necklace(120, 1760, 70, 1.2, 'hnk'); boilSeed('hcr'); paint(starPts(700, 1780, 22, .5, 5, .6), { wash: P2.gold, ink: P2.ink, sw: .6 }); }
    // the king comes in with a lamp, raises his hand to swear; a glow of Ram over him; then falls and begs
    if (t > FOUND - .6) {
      const inK = easeOut(seg(t, FOUND - .6, FOUND + .4)), dx = lerp(1300, 940, inK), fall = ease(seg(t, FELL - .2, FELL + .3)), beg = t > BEGGED - .2;
      const sw = ease(seg(t, SWORE - .3, SWORE + .1)) * (1 - ease(seg(t, FIRST - .4, FIRST)));
      dasharatha(dx, 1830, 23, { boilKey: 'hd', flip: true, walk: inK < 1 ? t * 1.6 : undefined, eyes: t > FELL ? 'closed' : t > FIRST ? 'wide' : 'normal', mouth: t > FELL ? 'O' : t > FIRST ? 'O' : 'smile', brow: t > FIRST ? .9 : 0,
        sit: beg ? 1 : 0, rot: fall * (beg ? 0 : .6), pray: beg ? 1 : 0, bow: beg ? .5 + .15 * Math.sin(t * 4) : 0, lookX: -.6,
        handR: !beg && sw > 0 ? [lerp(3.4, 4.4, sw), lerp(-11, -21.5, sw)] : !beg ? [3.4, -13.4] : undefined, bendR: .5, sweat: t > FIRST + .3,
        emote: t > FIRST && t < FELL ? '!!' : undefined, emoteK: 1, emoteAge: t - FIRST });
      if (beg) tears(...naradaEye(dx, 1830, 23, { flip: true, sit: 1, bow: .5 }, 1), t - BEGGED, 'hdt', .9);
      if (t > RAMS - .3 && t < FIRST - .2) { const k = backOut(clamp((t - RAMS + .3) * 3)), [hx, hy] = naradaHead(dx, 1830, 23, { flip: true }); const bx = hx - 180, by = hy - 260; glow(bx, by, 220 * k, '#9EC8FF', .5); boilSeed('hrb'); paint(ellPts(bx, by, 170 * k, 160 * k, 22, 3), { wash: '#E6EEFA', ink: P2.ink, sw: 1, curv: .8 }); if (k > .4) ram(bx, by + 130 * k, 9 * k, { boilKey: 'hram', mouth: 'smile' }); }
    }
    // her two asks: the first light becomes Bharat's crown, the second a forest tree; "14 years"
    if (t > FIRST - .2 && t < FELL + .5) {
      const [px, py] = parvatiHand(260, 1820, 23, { handR: [6, -20.5] }, 1), k1 = backOut(clamp((t - FIRST) * 3)), k2 = backOut(clamp((t - SECOND) * 3)), fade = 1 - seg(t, FELL, FELL + .5);
      if (k1 > 0) { boonLight(px + 90, py + 20, 40 * fade, k1, 'hb1'); if (t > CROWNB - .1) miniCrown(px + 90, py - 90, 110 * fade * backOut(clamp((t - CROWNB) * 3)), 'hmc'); }
      if (k2 > 0) { boonLight(px + 270, py + 20, 40 * fade, k2, 'hb2'); if (t > FOREST - .1) tree(px + 270, py - 30, 190 * fade * backOut(clamp((t - FOREST) * 3)), 'hft'); }
    }
    camEnd();
    caps(t);
    wipeIn(lt, DARKC);
  }

  // ================= L · dawn: Ram hears it; his face does not change; "I will go" =================
  function shotDawn(t, lt, dur) {
    camBegin(540, 1330, 1.05 + lt * .012);
    angerRoom(t, 'l', { dawn: ease(seg(t, L0 - .4, L0 + 1.5)) });
    dasharatha(800, 1840, 20, { boilKey: 'ld', flip: true, sit: 1, bow: .6, pray: 1, eyes: 'closed', mouth: 'O', brow: .9, tint: '#3A2E58', tintK: .1 });
    tears(...naradaEye(800, 1840, 20, { flip: true, sit: 1, bow: .6 }, 1), t, 'ldt', .8);
    kaikeyi(200, 1820, 20, { boilKey: 'lk', plain: 1, hairDown: 1, eyes: 'normal', mouth: 'flat', lookX: .6, hx: .2 });
    const pray = ease(seg(t, LETBE - .3, LETBE + .2)), turn = t > GO + .5;
    ram(500, 1830, 25, { boilKey: 'lr', eyes: t > FACE - .1 ? 'closed' : 'normal', mouth: 'smile', pray: turn ? 0 : pray, bow: pray * .25, hx: turn ? .5 : 0, glowK: 1 });
    glow(500, 1350, 260, '#FFE6B0', .35 + .1 * Math.sin(t * 2));
    camEnd();
    caps(t);
    wipeOut(lt, dur, ['#0E1A12', '#1E2A1E']);
  }

  // ================= M · the tease: the young king hunting by night, a sound at the river =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1300, 1.0 + lt * .02);
    boilSeed('msky'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#0E1A22', ink: null });
    paint(ellPts(540, 1100, 900, 600, 24), { fill: '#1E3240', fillOp: 200, bleed: .3, tex: .4, ink: null });
    glow(820, 520, 140, '#E8F0FF', .35); paint(ellPts(820, 520, 46, 46, 16), { wash: '#E8EEF8', ink: null });
    boilSeed('mriv'); paint(rectPts(-400, 1500, W + 800, 220), { wash: '#24485A', ink: null });
    for (let i = 0; i < 6; i++) { const x = frac(hash(i * 2.2) + t * .04) * 1300 - 100; inkLine([[x, 1560 + i * 25], [x + 80, 1560 + i * 25]], 1.4, '#5A8AA0', 'inkfine', 0); }
    for (const [x, h, k] of [[60, 900, 'a'], [1040, 1000, 'b']]) tree(x, 1520, h, 'm' + k, Math.sin(t * .6) * .2, ['#1E3A2A', '#142A1E', '#2E4E3A']);
    const aim = ease(seg(t, M0 + .4, CURSE));
    nishada(330, 1510, 22, { boilKey: 'my', aim, eyes: 'narrow', mouth: 'flat', tint: '#0A1018', tintK: .75, pal: { ...DASH_PAL, ink: '#0A1018' }, beard: '#1A1418', hat: null });
    if (t > YOUTH) { boilSeed('msnd'); for (let i = 0; i < 3; i++) { const k = frac((t - YOUTH) * .8 + i / 3); inkLine(ellPts(860, 1540, 40 + k * 120, 20 + k * 50, 16).slice(10, 26), 2, '#9EC8E0', 'inkfine', .5); } }
    camEnd();
    caps(t);
    wipeIn(lt, ['#0E1A12', '#1E2A1E']);
    wipeOut(lt, dur, CARDC);
  }

  // ================= N · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 3, title: "THE KING'S CURSE", at: CARD }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotCrown], [D0, shotCity], [E0, shotQueen], [G0, shotWar], [H0, shotAnger], [L0, shotDawn], [M0, shotTease], [K0, shotCard]]);
})();
