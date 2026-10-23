// rp1.js: Ramayan Part 1, "The world's first poem was a curse" (~80 s, Painted, an English voiceover with captions in
// Bangers, SFX). Told from the Valmiki Ramayana, Bala Kanda 1–4: Valmiki asks Narad who on earth is perfect; Narad
// names Ram (1); at the Tamasa a hunter kills one of a pair of krauncha birds; Valmiki's grief bursts out as a curse
// in perfect metre, "ma nishada…" (2.9–15); from shoka came shloka (2.18); Brahma comes: the verse came by his will,
// tell Ram's story; as long as mountains and rivers last, it will be told (2.23–36); Ram's sons Lav and Kush sing it
// before Ram himself (4). The Part 2 tease (Kaikeyi's two boons) and the follow card.
// STORYBOARD.md has the plan and the sources; the sets and props are in src/ramayan_sets.js, the series cast in src/ramayan.js.
// Every time comes from the voice (src/scenes/rp1_vo.js, written by tools/sarvam_tts.mjs from tools/rp1_vo.json);
// tools/rp1_sfx.mjs reads the same file and recomputes these times.
(() => {
  // ---- times from the voice
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const B0 = mid('hook', 'intro'), C0 = mid('intro', 'ask'), D0 = mid('narad', 'river'), F0 = mid('arrow', 'burst'), F2 = mid('shloka', 'curse');
  const G0 = mid('curse', 'froze'), H0 = mid('shoka', 'brahma'), I0 = mid('promise', 'twist'), J0 = mid('twist', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
  const PERFECT = Wd('ask', 1, 7), SMILED = Wd('narad', 0, 1), RAMW = Wd('narad', 0, 7);
  const TAMASA = Wd('river', 0, 3), KRAUNCHA = Wd('river', 1, 3), TOGETHER = Wd('river', 1, 6);
  const ARROW = Wd('arrow', 0, 3), MALE = Wd('arrow', 0, 6), HIT = MALE - .2, MATE = Wd('arrow', 1, 1), CRIED = Wd('arrow', 1, 2);
  const BROKE = Wd('burst', 0, 2), BURST = Wd('burst', 0, 5), SHL = LN.shloka.a, HUNTER = LN.curse.a, LOVE = Wd('curse', 1, 5);
  const FROZE = Wd('froze', 0, 2), GRIEF = Wd('froze', 1, 1), RHYTHM = Wd('froze', 1, 6), SUNG = Wd('froze', 1, 11);
  const SHOKA = Wd('shoka', 0, 1), SHLOKA = Wd('shoka', 0, 6), BRAHMA = Wd('brahma', 0, 1), WILL = Wd('brahma', 1, 5), STORY = Wd('brahma', 2, 3);
  const MOUNT = Wd('promise', 0, 3), RIVERS = Wd('promise', 0, 6), TOLD = Wd('promise', 1, 4);
  const SING = Wd('twist', 0, 4), SONS = Wd('twist', 1, 2), LAV = Wd('twist', 1, 3), HIMSELF = Wd('twist', 2, 4);
  const CROWNED = Wd('next', 0, 7), QUEEN = Wd('next', 1, 1), BOONS = Wd('next', 1, 4);
  const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };
  window.RP1_T = { B0, C0, D0, F0, F2, G0, H0, I0, J0, K0, END, PERFECT, SMILED, RAMW, TAMASA, KRAUNCHA, TOGETHER, ARROW, MALE, HIT, MATE, CRIED, BROKE, BURST, SHL, HUNTER, LOVE,
    FROZE, GRIEF, RHYTHM, SUNG, SHOKA, SHLOKA, BRAHMA, WILL, STORY, MOUNT, RIVERS, TOLD, SING, SONS, LAV, HIMSELF, CROWNED, QUEEN, BOONS, CARD };

  const GOLDC = P1.gold;
  const VERSE = ['मा निषाद प्रतिष्ठां', 'त्वमगमः शाश्वतीः समाः ।', 'यत्क्रौञ्चमिथुनादेकम्', 'अवधीः काममोहितम् ॥'];   // the four padas (Bala 2.15)
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const RIVERC = [P1.water, P1.grass], DAYC = [P1.skyHi, P1.earth], GOLDW = ['#FFE2A0', '#F5C542'], HALLC = [P1.hall, P1.pillar], NIGHTC = [P1.nightHi, P1.nightLo], CARDC = [RMY.maroon, RMY.saffron];

  // ---- the captions are the voice's chunks: line by line, the line with *starred* words in gold (none over the
  // ident, whose title says it, or the card, which says it)
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

  // ================= A · the hook: Valmiki mid-curse, his verse blazing =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1180 - lt * 12, 1 + lt * .012);
    warmBack(t, 'ha', 540, 1150);
    glow(700, 1040, 420, '#FFE080', .5 + .1 * Math.sin(t * 6));
    boilSeed('harays');
    for (let i = 0; i < 9; i++) { const a = -1.2 + i * .3 + Math.sin(t * 2 + i) * .03; inkLine([[760 + Math.cos(a) * 140, 1040 + Math.sin(a) * 140], [760 + Math.cos(a) * 300, 1040 + Math.sin(a) * 300]], 3, GOLDC, 'ink', 0); }
    valmiki(440, 2000, 34, { boilKey: 'vh', eyes: 'angry', brow: -.9, mouth: 'open', handR: [8.2, -24.2], bendR: .3, handL: [-3.8, -12], tint: 'flush', tintK: .25, hx: .3, lookX: .8 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the series ident =================
  function shotIdent(t, lt, dur) {
    ramayanIdent(t, lt, 1, 'THE FIRST POEM');
    wipeIn(lt, CARDC);
    wipeOut(lt, dur, DAYC);
  }

  // ================= C · the ashram: Valmiki asks, Narad names Ram =================
  function shotAsk(t, lt, dur) {
    const c = kf(t, [[C0, [540, 1250, 1.0]], [SMILED - .3, [540, 1250, 1.0]], [RAMW, [600, 1180, 1.06]]], ease);
    camBegin(c[0], c[1], c[2]);
    ashram(t, 'c');
    // Narad drifts down on his cloud and lands; smiles; strums; the bubble of Ram
    const land = easeOut(seg(t, C0, C0 + 1.6)), ny = lerp(1100, 1700, land) + Math.sin(t * 1.6) * 8;
    const smile = t > SMILED - .1, strum = t > SMILED + .3 && t < RAMW + 1.2 ? 1 : 0;
    narada(790, ny, 22, { boilKey: 'nc', cloud: 1, eyes: smile ? 'happy' : 'normal', mouth: smile ? 'grin' : 'smile', strum, lookX: -.5, hx: -.2 });
    // Valmiki: bows his welcome, then asks with an open hand; "?" on "perfect"; wide eyes on "Ram"
    const bow = ease(seg(t, C0 + 1.2, C0 + 1.6)) * (1 - ease(seg(t, C0 + 2.6, C0 + 3)));
    const ask = t > LN.ask.a + 2.2 && t < LN.narad.a;
    valmiki(290, 1720, 22, { boilKey: 'vc', bow: bow * .5, pray: bow, eyes: t > RAMW ? 'wide' : 'normal', mouth: t > RAMW ? 'O' : ask ? 'open' : 'smile', lookX: .7, hx: .3,
      handR: ask ? [7.2, -15.5] : undefined, bendR: .4, emote: t > PERFECT && t < LN.narad.a + .6 ? '?' : undefined, emoteK: clamp((t - PERFECT) * 4), emoteAge: t - PERFECT });
    if (t > RAMW - .25) {   // a glowing bubble with Ram in it, over Narad's head
      const [hx, hy] = naradaHead(790, ny, 22, {});
      const k = backOut(clamp((t - RAMW + .25) * 3)), bx = hx - 150, by = hy - 420;
      glow(bx, by, 260 * k, '#FFE6A0', .6);
      boilSeed('cbub');
      for (let i = 0; i < 3; i++) paint(ellPts(lerp(hx - 40, bx, (i + 1) / 4), lerp(hy - 110, by + 160, (i + 1) / 4), (12 + i * 6) * k, (12 + i * 6) * k, 10), { wash: P1.cream, ink: P1.ink, sw: .8 });
      paint(ellPts(bx, by, 220 * k, 200 * k, 24, 4), { wash: '#FFF4D8', ink: P1.ink, sw: 1.2, curv: .8 });
      if (k > .3) ram(bx, by + 170 * k, 10.5 * k, { boilKey: 'cram', eyes: 'normal', mouth: 'smile', handR: [4.4, -17.6], bendR: .6 });
    }
    camEnd();
    caps(t);
    wipeIn(lt, DAYC);
    wipeOut(lt, dur, RIVERC);
  }

  // ================= D–E · the Tamasa: the krauncha pair; the arrow; his mate cries =================
  function shotRiver(t, lt, dur) {
    const c = kf(t, [[D0, [520, 1220, 1.0]], [KRAUNCHA - .4, [540, 1230, 1.04]], [KRAUNCHA + .6, [660, 1330, 1.35]], [ARROW - .3, [660, 1330, 1.35]], [HIT, [620, 1320, 1.25]], [CRIED, [700, 1350, 1.45]]], ease);
    const sh = shakeXY(t, t > HIT ? 7 * Math.exp(-(t - HIT) * 5) : 0);
    camBegin(c[0] + sh[0], c[1] + sh[1], c[2]);
    riverBank(t, 'd');
    // Valmiki walks in at the left along the bank and stops to watch
    const w = easeOut(seg(t, D0, TAMASA + .8)), vx = lerp(-60, 300, w), stopped = w > .98;
    valmiki(vx, 1640, 15, { boilKey: 'vd', walk: stopped ? undefined : t * 1.6, eyes: t > HIT ? 'wide' : stopped ? 'happy' : 'normal', mouth: t > HIT ? 'O' : 'smile', lookX: .8, hx: .3,
      emote: t > KRAUNCHA && t < HIT ? 'heart' : t > HIT && t < HIT + 1.2 ? '!' : undefined, emoteK: 1, emoteAge: t - KRAUNCHA });
    // the pair: the male (left) and his mate (right) dance on the bank, necks entwining
    const dance = t < HIT, mx = 560, fx = 790;
    const wingM = dance ? Math.max(0, Math.sin((t - D0) * 2.2)) * .9 : 0, wingF = dance ? Math.max(0, Math.sin((t - D0) * 2.2 + 1.8)) * .8 : 0;
    const bob = dance ? Math.sin(t * 2.8) * .12 : 0;
    // the arrow: from off left, along a flat arc, into his side on HIT
    const fly = seg(t, HIT - .5, HIT);
    if (t > HIT - .5 && t < HIT) arrowAt(lerp(1350, mx + 30, fly), lerp(1000, 1380, fly), Math.PI - .29, 170, 'darrow');   // from the hunter's bushes, off right
    const fallK = ease(seg(t, HIT, HIT + .45));
    if (fallK < 1) {
      push(); translate(mx, 1660); rotate(-fallK * 1.2); translate(-mx, -1660);
      krauncha(mx, 1660, 230, { key: 'km', wings: wingM, neck: dance ? .25 + bob : .6, beak: t > HIT ? 1 : 0, eye: t > HIT ? 'closed' : 'open' });
      if (t > HIT) arrowAt(mx + 30, 1380, Math.PI - .29, 170, 'dstuck');
      pop();
    } else {
      krauncha(mx - 40, 1680, 230, { key: 'km', dead: 1, flip: true });
      arrowAt(mx - 60, 1530, -Math.PI + .9, 150, 'dstuck2');
    }
    if (t > HIT && t < HIT + .2) { boilSeed('dhit'); paint(starPts(mx + 30, 1380, 90 * backOut(seg(t, HIT, HIT + .1)), .45, 8), { wash: '#FFF2C0', ink: P1.ink, sw: 1 }); }
    if (t > HIT && t < HIT + 1.2) { boilSeed('dfeath'); const k = seg(t, HIT, HIT + 1.2); for (let i = 0; i < 5; i++) paint(ellPts(mx + (i - 2) * 50 * k * 1.5, 1380 - 60 * k + k * k * 220 + i * 10, 14, 6, 8, 0, i), { wash: KRC.bodyLt, washOp: 255 * (1 - k), ink: P1.ink, sw: .4 }); }
    // his mate: leans in during the dance; after the hit, startles, then throws her head back and cries
    const cry = t > MATE - .2, fo = { key: 'kf', flip: true, wings: wingF, neck: dance ? .35 - bob : cry ? -.45 + Math.sin(t * 7) * .06 : .1, beak: cry ? (Math.sin(t * 9) > 0 ? 1 : .4) : 0 };
    const [kh] = [krauncha(fx, 1660, 215, fo)];
    if (cry) tears(kh.head[0] - 8, kh.head[1] + 20, t - MATE, 'dtears', 1.1);
    if (dance && t > KRAUNCHA) { boilSeed('dheart'); const k = backOut(clamp((t - KRAUNCHA) * 2)), hy = 1150 - Math.sin(t * 2) * 10; paint(heartPts(675, hy, 34 * k * (1 + .08 * pulse(t, 2))), { wash: '#E2476E', ink: P1.ink, sw: .9 }); }
    camEnd();
    caps(t);
    wipeIn(lt, RIVERC);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= F · Valmiki's heart breaks; the shloka bursts out =================
  function shotBurst(t, lt, dur) {
    const fire = ease(seg(t, BURST - .3, SHL + .4)), sh = shakeXY(t, t > SHL && t < SHL + .5 ? 6 : 0);
    camBegin(540 + sh[0], lerp(1300, 1250, fire) + sh[1], lerp(1.0, 1.08, ease(seg(t, F0, F2))));
    riverBank(t, 'f', { dim: .25 * fire });
    krauncha(860, 1700, 150, { key: 'fm', dead: 1, flip: true });
    krauncha(1010, 1690, 140, { key: 'ff', flip: true, neck: -.3, beak: Math.sin(t * 9) > 0 ? .8 : .3 });
    glow(650, 1060, 560 * fire, '#FFD870', .5 * fire);
    if (fire > .1) { boilSeed('frays'); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .4; inkLine([[650 + Math.cos(a) * 330, 1060 + Math.sin(a) * 330], [650 + Math.cos(a) * (390 + 60 * fire), 1060 + Math.sin(a) * (390 + 60 * fire)]], 3, GOLDC, 'ink', 0); } }
    const broke = t > BROKE - .1, point = ease(seg(t, SHL - .3, SHL + .2));
    valmiki(250, 1820, 26, { boilKey: 'vf', eyes: t > BURST - .2 ? 'angry' : broke ? 'closed' : 'wide', brow: t > BURST - .2 ? -.9 : .8, mouth: t > SHL ? 'open' : broke ? 'frown' : 'O',
      tint: t > BURST - .2 ? 'flush' : 'blue', tintK: .25, hx: .3, lookX: .6, handR: [lerp(3.6, 8.4, point), lerp(-11, -23.5, point)], bendR: .3,
      handL: broke && t < BURST ? [-.6, -15.6] : undefined, bendL: .9 });
    if (broke && t < BURST) tears(...naradaEye(250, 1820, 26, { hx: .3 }, 1), t - BROKE, 'ftear', 1.2);
    camEnd();
    if (t > SHL - .1) rkVerse(VERSE, 660, 820, 62, t - SHL + .1, { stagger: 1.05, maxW: 520 });
    caps(t);
    wipeIn(lt, GOLDW);
  }

  // ================= F2 · the curse lands on the hunter =================
  function shotCurse(t, lt, dur) {
    const c = kf(t, [[F2, [440, 1320, 1.15]], [F2 + .5, [620, 1300, 1.0]]], ease);
    camBegin(c[0], c[1], c[2]);
    riverBank(t, 'f2', { dim: .25 });
    tree(1080, 1480, 560, 'f2t', Math.sin(t) * .2);
    // the hunter in the bushes on the right: bow down, then he cowers and backs off
    const cw = ease(seg(t, HUNTER, HUNTER + .5)), back = ease(seg(t, LOVE - .2, LOVE + .9));
    nishada(830 + back * 180, 1700, 23, { boilKey: 'nf', flip: true, aim: 1, cower: cw, eyes: cw > .5 ? 'wide' : 'angry', mouth: cw > .5 ? 'scream' : 'flat', sweat: cw > .5, lean: -cw * 1.5 });
    bush(780, 1720, 190, 'f2b1'); bush(1010, 1730, 170, 'f2b2', P1.leafDk, '#2E5A34');
    // Valmiki pointing from the left, golden light between them
    glow(300, 1080, 420, '#FFD870', .45);
    boilSeed('f2beam');
    const pk = 1 + .1 * Math.sin(t * 8);
    paint([[520, 1040], [800, 1150 - 60 * pk], [800, 1150 + 60 * pk]], { wash: '#FFE6A0', washOp: 90, ink: null });
    valmiki(230, 1760, 24, { boilKey: 'vf2', eyes: 'angry', brow: -.9, mouth: Math.sin(t * 9) > -.3 ? 'open' : 'frown', tint: 'flush', tintK: .25, hx: .4, lookX: 1, handR: [8.6, -22], bendR: .3 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, RIVERC);
  }

  // ================= G · he froze: perfect rhythm; from shoka, shloka =================
  function shotFroze(t, lt, dur) {
    camBegin(540, 1300, 1.0 + lt * .008);
    riverBank(t, 'g', { dim: .15 });
    krauncha(870, 1690, 150, { key: 'gm', dead: 1, flip: true });
    krauncha(1010, 1680, 140, { key: 'gf', flip: true, neck: .9, eye: 'closed' });   // her head bowed over him
    // the verse hangs in the air, glowing; he stares, counts the beats on his fingers, then the notes rise
    const count = t > RHYTHM - .5 && t < SUNG + .3, cnt = count ? Math.floor((t - RHYTHM + .5) * 3) % 4 : 0;
    valmiki(250, 1820, 26, { boilKey: 'vg', eyes: t > SHLOKA ? 'happy' : 'wide', brow: .9, mouth: t > SHOKA ? 'smile' : 'O', hx: .1, lookY: -.6, lookX: .3,
      handR: count ? [5.6, -20.5 + (cnt % 2) * .6] : undefined, bendR: .6, emote: t > FROZE && t < GRIEF ? '!' : t > SUNG ? 'music' : undefined, emoteK: 1, emoteAge: t - FROZE });
    if (t > SUNG - .2) notes(470, 1180, t - SUNG, 'gnotes');
    if (t > SHOKA - .2 && t < SHLOKA + 1.2) { const [ex, ey] = naradaEye(250, 1820, 26, { hx: .1 }, 1), k = seg(t, SHOKA, SHLOKA); glow(ex + k * 80, ey + 40 - k * 260, 60 + k * 120, '#FFE080', .7); boilSeed('gtear'); paint([[ex + k * 80, ey + 20 - k * 260], [ex + k * 80 + 12, ey + 40 - k * 260], [ex + k * 80, ey + 52 - k * 260], [ex + k * 80 - 12, ey + 40 - k * 260]], { wash: mixCol('#9ED0F0', GOLDC, k), ink: P1.ink, sw: .6, curv: .6 }); }
    camEnd();
    glow(660, 960, 420, '#FFE080', .35 + .1 * Math.sin(t * 3));
    rkVerse(VERSE, 660, 820, 62, 9, { stagger: 0, maxW: 520 });
    caps(t);
    wipeIn(lt, RIVERC);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= H · Brahma comes; "as long as mountains stand and rivers flow" =================
  function shotBrahma(t, lt, dur) {
    const back = ease(seg(t, MOUNT - .5, RIVERS + .6));
    camBegin(540, lerp(1200, 1080, back), lerp(1.0, .74, back));
    ashram(t, 'h');
    if (back > 0) {   // the world around: mountains to the horizon, a river winding out (drawn over the far sky)
      boilSeed('hmount');
      paint([[-900, 1150], [-600, 720], [-380, 900], [-120, 640], [140, 1000], [-900, 1260]], { wash: '#8C9CC8', fill: '#6A7AA8', fillOp: 50, tex: .4, ink: P1.ink, sw: 1, curv: .1, washOp: 255 * back });
      paint([[940, 1000], [1220, 640], [1480, 880], [1700, 700], [1980, 1150], [940, 1200]], { wash: '#8C9CC8', fill: '#6A7AA8', fillOp: 50, tex: .4, ink: P1.ink, sw: 1, curv: .1, washOp: 255 * back });
      for (const [px, py] of [[-120, 640], [1220, 640], [1700, 700]]) paint([[px - 60, py + 70], [px, py], [px + 60, py + 70]], { wash: '#F2F4FA', washOp: 255 * back, ink: null });
      boilSeed('hriv');
      paint(ribbon([[-900, 2300], [-300, 2000], [200, 2150], [700, 1950], [1300, 2100], [2000, 1900]], 160, 120), { wash: P1.water, washOp: 255 * back, fill: P1.waterDk, fillOp: 60 * back, ink: P1.ink, sw: 1 });
      glow(540, 1200, 1200 * back, '#FFE6A0', .3 * back);
    }
    heavenSky(t, ease(seg(t, H0, BRAHMA + .6)), 'h');
    // Brahma floats down on his lotus, blesses on "will"; the manuscript floats to Valmiki on "story"
    const dn = easeOut(seg(t, H0 + .2, BRAHMA + 1.2)), by = lerp(560, 1260, dn) + Math.sin(t * 1.3) * 10;
    brahma(640, by, 24, { boilKey: 'bh', bless: ease(seg(t, WILL - .4, WILL)), eyes: t > WILL - .4 ? 'happy' : 'closed', mouth: 'smile', hx: -.2, lookX: -.4 });
    const leaf = t > STORY - .2;
    const fly = ease(seg(t, STORY - .2, STORY + .7));
    valmiki(260, 1720, 22, { boilKey: 'vh2', pray: leaf ? 0 : ease(seg(t, BRAHMA, BRAHMA + .4)), bow: leaf ? 0 : .5 * ease(seg(t, BRAHMA, BRAHMA + .4)), eyes: leaf ? 'happy' : 'closed', mouth: 'smile', leaf: fly > .98 ? 1 : 0, lookX: .7, lookY: -.6,
      emote: t > TOLD ? 'spark' : undefined, emoteK: 1, emoteAge: t - TOLD });
    if (leaf && fly < .98) { const p = arcPt([640, by - 500], naradaHand(260, 1720, 22, { leaf: 1 }, -1), -200, fly); push(); translate(p[0], p[1]); palmLeaf(22, 1.1); pop(); glow(p[0] + 80, p[1], 120, '#FFE6A0', .5); }
    camEnd();
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, HALLC);
  }

  // ================= I · the twist: Lav and Kush sing it before Ram himself =================
  function shotCourt(t, lt, dur) {
    const push2 = ease(seg(t, HIMSELF - .4, HIMSELF + .6));
    camBegin(540, lerp(1300, 1080, push2), lerp(1.0, 1.35, push2));
    court(t, 'i');
    throne(540, 1300, 300, 'ith');
    const moved = t > SONS;
    ram(540, 1330, 16, { boilKey: 'ir', sit: 1, kodanda: false, eyes: moved ? (t > HIMSELF ? 'closed' : 'happy') : 'normal', mouth: 'smile', handR: moved ? [1.6, -14.8] : undefined, bendR: .8, lookY: .6 });
    if (t > HIMSELF) tears(...naradaEye(540, 1330, 16, { sit: 1 }, 1).map((v, i) => v + (i ? 10 : 0)), t - HIMSELF, 'itear', .7);
    for (const [x, s, sd] of [[330, 1, 1], [750, -1, 2]]) {
      const bob = Math.sin(t * 3 + sd) * .08;
      lavKush(x, 1800, 22, { boilKey: 'ilk' + sd, flip: s < 0, eyes: 'happy', mouth: Math.sin(t * 6 + sd) > 0 ? 'open' : 'O', dy: bob, hx: s * .3, seed: sd, emote: t > LAV - .2 && t < LAV + .8 ? undefined : undefined });
      if (t > SING - .3) notes(x + s * 60, 1380, t + sd, 'inotes' + sd, GOLDC, 2);
    }
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= J · the tease: the night before the crowning, a queen and two boons =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1250, 1.0 + lt * .02);
    chamber(t, 1, 'j');
    // a lamp flickers; the queen in silhouette, her palm turning up on "queen", two golden lights rising on "boons"
    const fl = .85 + .15 * Math.sin(t * 13) * Math.sin(t * 7.3);
    glow(780, 1450, 420 * fl, P1.lamp, .55);
    boilSeed('jlamp'); paint(ellPts(780, 1560, 60, 22, 14), { wash: '#B8862E', ink: P1.ink, sw: .8 }); paint([[780, 1470 - 20 * fl], [796, 1535], [780, 1548], [764, 1535]], { wash: '#FFD27A', ink: null, curv: .6 });
    const palm = ease(seg(t, QUEEN - .3, QUEEN + .3));
    parvati(430, 1760, 26, { boilKey: 'jq', pal: { saree: '#2E5A3A', sareeDk: '#1E3E28', sareeLt: '#4E7A5A', blouse: '#6E1A30', blouseDk: '#4A0E20' }, tint: '#1A1430', tintK: .78, eyes: 'normal', mouth: 'flat', lookX: .6, hx: .3, handR: [lerp(3.3, 5.2, palm), lerp(-11.2, -15.8, palm)], bendR: .6 });
    if (t > BOONS - .2) {
      const [hx, hy] = parvatiHand ? parvatiHand(430, 1760, 26, { handR: [5.2, -15.8], bendR: .6 }, 1) : [560, 1350];
      for (let i = 0; i < 2; i++) { const k = easeOut(clamp((t - BOONS + .2 - i * .25) * 1.4)), bx = hx + (i ? 50 : -40), byy = hy - 40 - k * 180 - i * 30; if (k <= 0) continue; glow(bx, byy, 90, '#FFD870', .7 * k); boilSeed('jboon' + i); paint(ellPts(bx, byy, 24 * k, 24 * k, 14), { wash: '#FFE6A0', ink: P1.ink, sw: .6 }); }
    }
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the follow card =================
  function shotCard(t, lt) {
    followCard(t, lt, { part: 2, title: 'THE TWO BOONS', at: CARD });
    wipeIn(lt, CARDC);
  }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotAsk], [D0, shotRiver], [F0, shotBurst], [F2, shotCurse], [G0, shotFroze], [H0, shotBrahma], [I0, shotCourt], [J0, shotTease], [K0, shotCard]]);
})();
