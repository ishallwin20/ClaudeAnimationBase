// sitap.js: "Was RAM right to leave SITA?" (ad 67) in the Painted style: the same voice, score, sound and timeline as the
// Cinematic cut (sita.js; sita_vo.js + sita_tl.js), drawn with p5.brush on the Ramayan series' cast. Four poets testify
// and the reel takes no side: Valmiki (Ayodhya's whispers 7.42, Ram's reason 7.44, his apology 7.88.3, the oath and the
// Earth 7.88, the golden Sita 7.89.4), Kalidasa (Sita's message and prayer, Raghuvamsha 14.61, 14.66, 14.84),
// Bhavabhuti (the reunion), Tulsidas (no exile, Manas Uttarkand 25); the crowd was divided (7.87.12). STORYBOARD.md has
// the sources. The map is painted (sitap_map.js), the poets stand on it where they wrote.
(() => {
  const { B0, C0, C1, D0, E0, E1, F0, G0, H0, I0, J0, K0, L0, L1, M0, M1, N0, O0, CARD, END } = TL;
  const LN = VO.lines;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const DUSKC = [SP.duskHi, SP.duskMid], MAPC = [SP.sea, SP.land], NIGHTC = [SP.nightHi, SP.roof], RIVERC = [P1.water, P1.grass], DAWNC = ['#F7B05A', '#FFE2A0'],
    HALLC = [P1.hall, P1.pillar], GOLDW = ['#FFE2A0', '#F5C542'], CARDC = [SP.peach, SP.rkOrange];
  const talking = (t, id) => t > LN[id].a && t < LN[id].end && Math.sin(t * 17) + Math.sin(t * 7.3) > -.4;   // a mouth flap while a line plays

  // ---- the captions: the voice's chunks line by line at the top of the safe band, starred words in gold
  const MC = document.createElement('canvas').getContext('2d');
  function capLine(line, y, size, age, life) {
    const words = line.split(' ').filter(Boolean).map(w => ({ gold: w.includes('*'), txt: w.replace(/\*/g, '').toUpperCase() }));
    MC.font = `${size}px ${LETTER_FONT}`;
    const sp = MC.measureText(' ').width, ws = words.map(w => MC.measureText(w.txt).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    const sc = Math.min(1, 860 / tot); let x = W * .47 - tot * sc / 2;
    const fade = seg(age, life - .18, life);
    words.forEach((w, i) => {
      const cx = x + ws[i] * sc / 2;
      letter(w.txt, cx, y + (cx - W * .47) * .025, size * sc, w.gold ? SP.gold : SP.cream, { screen: true, pop: age * 5, rot: -.025, alpha: 1 - fade, stroke: SP.ink, sw: .22, ink: false });
      x += (ws[i] + sp) * sc;
    });
  }
  function caps(t) {
    for (const k of VO.caps) {
      const a = k.id === 'hook' ? -1 : k.a, b = k.b;
      if (t < a || t > b) continue;
      const lines = k.text.split('|').map(s => s.trim()), big = k.id === 'hook', sz = big ? 104 : 74, lh = big ? 116 : 88;
      lines.forEach((l, i) => capLine(l, (big ? 500 : 482) + i * lh, sz, t - a - i * .12, b - a - i * .12));
    }
  }
  // the map's camera: wide (the whole of India) → onto a poet's pin
  const WIDE = [540, 1110, 1.12];
  const pinCam = k => { const [x, y] = mapXY(...POETS[k].at); return [x, y - 80, 3.1]; };

  // ================= A · the hook: Sita alone on the Ganga's bank at dusk; the boat going away =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1250 - lt * 10, 1 + lt * .015);
    duskBank(t, 'a', { boat: clamp(.25 + t * .12) });
    const o = { boilKey: 'sa', eyes: 'sad', mouth: 'frown', hx: .45, lookX: 1, lookY: .1, htilt: -.05, lean: -.2 };
    sita(330, 1820, 31, o);
    tears(...sitaEye(330, 1820, 31, o, 1), t + .3, 'atear', 1.1);
    camEnd();
    caps(t);
    wipeOut(lt, dur, MAPC);
  }

  // ================= B · the painted map: four poets drop onto it where they wrote =================
  function shotPoets(t, lt, dur) {
    camBegin(WIDE[0], WIDE[1] - lt * 6, WIDE[2] + lt * .01);
    paintedMap(t, 'b');
    POET_KEYS.forEach((k, i) => poetPin(k, t, TL.POETS + i * .22, 6.4));
    POET_KEYS.forEach((k, i) => poetLabel(k, t, TL.POETS + i * .22 + .15));
    camEnd();
    if (t > TL.POETS + 1) {   // the 2,000 YEARS pill
      const k = backOut(clamp((t - TL.POETS - 1) * 4));
      boilSeed('byears'); push(); translate(540, 1440); scale(k); paint(rrPts(-210, -42, 420, 84, 42), { wash: SP.rkOrange, ink: SP.ink, sw: 1 }); pop();
      letter('2,000 YEARS', 540, 1443, 50, SP.cream, { screen: true, font: '700 50px Poppins', ink: false, pop: (t - TL.POETS - 1) * 5 });
    }
    caps(t);
    wipeIn(lt, MAPC);
  }
  // ================= C / E / L / M · the map dives to one poet: he writes in his beam; his name and era =================
  function mapDive(k, act, wipeCols) {
    return (t, lt, dur) => {
      const c = kf(lt, [[0, WIDE], [.75, pinCam(k)]], ease), c2 = [c[0], c[1] - lt * 4, c[2] + lt * .02];
      camBegin(...c2);
      paintedMap(t, 'm' + k, { sw: 1.6 / c2[2] * 1.4 });
      const away = ease(clamp((lt - .15) / .45));   // the other poets sink into the map as the camera dives
      POET_KEYS.forEach(q => { if (q !== k && away < .85) poetPin(q, t, -9, 6.4 * (1 - away), { act: { tint: '#C8B48E', tintK: .5 } }); });
      poetPin(k, t, -9, 6.4, { act: act(t, lt) });
      camEnd();
      poetLabel(k, t, .55 + t - lt, { big: true });
      caps(t);
      if (k !== 'valmiki') wipeIn(lt, MAPC);   // B → C is one camera move on the same map
      if (wipeCols) wipeOut(lt, dur, wipeCols);
    };
  }
  const writing = (t) => ({ eyes: 'look', lookY: .8, lookX: .3, mouth: 'smile', leaf: 1, handR: [2.8 + Math.sin(t * 9) * .3, -13.2], bendR: .5 });
  const shotValmiki = mapDive('valmiki', (t) => writing(t), NIGHTC);
  const shotKalidasa = mapDive('kalidasa', (t, lt) => lt < 1.6 ? writing(t) : { eyes: 'normal', mouth: talking(t, 'kali') ? 'open' : 'smile', leaf: 1, lookX: .2 }, RIVERC);
  const shotBhava = mapDive('bhava', (t, lt) => ({ eyes: 'closed', mouth: 'frown', leaf: 1, brow: .8, htilt: .1 }), DAWNC);
  const shotTulsi = mapDive('tulsi', (t) => writing(t), null);

  // ================= C1 · Ayodhya at night: the lanes whisper; Ram small on the palace terrace =================
  function shotAyodhya(t, lt, dur) {
    camBegin(540, 1300 - lt * 6, 1 + lt * .01);
    ayodhyaNight(t, 'c1');
    const night = { tint: '#2A2A5E', tintK: .3 };
    ram(830, 942, 7.6, { boilKey: 'c1ram', kodanda: false, eyes: 'sad', mouth: 'frown', lookY: .8, lookX: -.6, hx: -.4, ...night, tintK: .15 });
    // two pairs of gossips lean in; whisper curls fly between them
    const lean = Math.sin(t * 2.2) * .4;
    folk(140, 1790, 16, 1, { boilKey: 'g1', lean: 1.4 + lean, hx: .6, eyes: 'look', lookX: 1, mouth: talking(t, 'valmiki') ? 'open' : 'smirk', handR: [3.4, -19.4], bendR: .8, ...night });
    folk(330, 1800, 16.5, 2, { boilKey: 'g2', lean: -1, hx: -.5, eyes: 'wide', lookX: -1, mouth: t > TL.RAVANA ? 'O' : 'smile', ...night });
    folk(640, 1810, 16, 5, { boilKey: 'g3', lean: 1.2, hx: .5, eyes: 'narrow', lookX: 1, mouth: t > TL.RAVANA + .6 ? 'open' : 'flat', ...night });
    folk(830, 1800, 16.5, 4, { boilKey: 'g4', lean: -1.4 - lean, hx: -.6, eyes: t > TL.RAVANA + 1.2 ? 'wide' : 'look', lookX: -1, mouth: t > TL.RAVANA + 1.2 ? 'O' : 'flat', handL: [-3.2, -19], bendL: .8, ...night });
    whispers(250, 1440, 1, t, 'w1'); whispers(720, 1450, 1, t + .4, 'w2');
    // on RAVANA, the gossip's picture over their heads: his head in a bubble, the boss with the tall mukut
    const bk = backOut(clamp((t - TL.RAVANA + .1) * 3));
    bubble(470, 1080, 170, 140, bk, [560, 1380], 'c1bub', '#E8E0F4');
    if (bk > .4) ravanaLoneHead(470, 1090, 95 * bk, 4, { eyes: 'narrow', mouth: 'smirk' }, { boilKey: 'c1rv' });
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTC);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= D · Ram by the palace window: "my heart knows she is pure… I'd give up my own life" =================
  function shotRamWindow(t, lt, dur) {
    const push2 = ease(seg(t, TL.PURE - .4, TL.PURE + .6)), pushL = ease(seg(t, TL.LIFE - 1.2, TL.LIFE + .2));
    camBegin(lerp(540, 600, push2), lerp(1300, 1200, push2) - pushL * 30, 1 + push2 * .12 + pushL * .1);
    palaceWindow(t, 'd', { wx: 660 });
    // Lakshman listening at the left
    lakshman(150, 1980, 30, { boilKey: 'dlak', kodanda: false, eyes: t > TL.PURE ? 'sad' : 'wide', mouth: t > TL.LIFE - .5 ? 'frown' : 'O', hx: .7, lookX: 1, brow: .8, tint: '#2A3A6E', tintK: .25 });
    const heart = t > TL.PURE - .5;
    const o = { boilKey: 'dram', kodanda: false, eyes: t > TL.LIFE - .4 ? 'closed' : 'sad', mouth: talking(t, 'ram1') ? 'open' : 'frown', hx: -.35, lookX: -.8, brow: .9, bow: t > TL.LIFE - .5 ? .35 : 0,
      handR: heart ? [1.2, -15.6] : undefined, bendR: .7, tint: '#2A3A6E', tintK: .15 };
    glow(640, 1300, 300, '#D8E4FF', .18);
    ram(640, 1930, 33, o);
    if (t > TL.LIFE - .3) tears(...naradaEye(640, 1930, 33, o, -1), t - TL.LIFE, 'dtear', 1.1);
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTC);
    wipeOut(lt, dur, MAPC);
  }

  // ================= E1 · Kalidasa: Sita by the river sends the king a message (Raghuvamsha 14.61) =================
  const R14_61 = ['वाच्यस्त्वया मद्वचनात् स राजा', 'वह्नौ विशुद्धामपि यत् समक्षम्।', 'मां लोकवादश्रवणादहासीः', 'श्रुतस्य किं तत्सदृशं कुलस्य॥'];
  function shotMessage(t, lt, dur) {
    camBegin(540, 1360 - lt * 6, 1 + lt * .012);
    riverBank(t, 'e1', { dim: .2 });
    const fire = t > TL.FIRE - .2 && t < TL.GOSSIP, fam = t > TL.FAMILY - .4;
    const o = { boilKey: 'se1', eyes: t > TL.GOSSIP ? 'teary' : 'sad', mouth: talking(t, 'sita1') ? 'open' : 'frown', hx: .15, lookX: .2, htilt: -.04,
      handR: fire ? [1.4, -15] : fam ? [4.4, -14.6] : undefined, bendR: .7 };
    sita(540, 2360, 46, o);
    if (t > TL.GOSSIP) tears(...sitaEye(540, 2360, 46, o, 1), t - TL.GOSSIP, 'e1tear', 1.4);
    camEnd();
    rkVerse(R14_61, 540, 740, 50, t - E1 - .3, { stagger: .9, maxW: 840 });
    if (t > E1 + 3.8) letter('Raghuvamsha 14.61', 540, 1050, 30, SP.cream, { screen: true, font: '500 30px Poppins', stroke: SP.ink, sw: .25, ink: false, pop: (t - E1 - 3.8) * 5 });
    caps(t);
    wipeIn(lt, RIVERC);
    wipeOut(lt, dur, DAWNC);
  }

  // ================= F · her prayer at sunrise: "even in my next life, be my husband" =================
  function shotPray(t, lt, dur) {
    camBegin(540, 1300 - lt * 8, 1 + lt * .01);
    boilSeed('fsky');
    paint(rectPts(-400, -400, W + 800, 1900), { wash: '#F2A27A', ink: null });
    paint(ellPts(540, 1300, 1000, 700, 28), { fill: '#FFD8A0', fillOp: 220, bleed: .3, tex: .4, ink: null });
    const sy = 1180 - lt * 18;
    glow(540, sy, 520, '#FFD070', .55);
    boilSeed('fsun'); paint(ellPts(540, sy, 230, 230, 32), { wash: '#FFE6A0', ink: null });
    boilSeed('frays'); for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .1; inkLine([[540 + Math.cos(a) * 270, sy + Math.sin(a) * 270], [540 + Math.cos(a) * 340, sy + Math.sin(a) * 340]], 3, '#FFE6A0', 'ink', 0); }
    boilSeed('fhills'); paint([[-400, 1500], [100, 1430], [500, 1480], [900, 1420], [1480, 1470], [1480, 2600], [-400, 2600]], { wash: '#B8805A', fill: '#8A5A3E', fillOp: 60, tex: .5, ink: SP.ink, sw: .9, curv: .5 });
    for (const [x, h] of [[90, 520], [990, 600]]) tree(x, 1520, h, 'f' + x, Math.sin(t * .8 + x) * .2, ['#8A6A4A', '#6A4A34', '#B08A5E']);
    const o = { boilKey: 'sf', pray: ease(seg(t, F0, TL.PRAYS)), eyes: 'closed', mouth: t > TL.HUSBAND - .3 ? 'smile' : talking(t, 'sita2') ? 'o' : 'smile', lookY: -.4, htilt: .05, bow: 0 };
    sita(540, 1960, 32, o);
    if (t > TL.HUSBAND - .2) {   // a small warm heart over her joined hands
      const k = backOut(clamp((t - TL.HUSBAND + .2) * 2.5)), hy = 1400 - (t - TL.HUSBAND) * 30;
      glow(540, hy, 120 * k, '#FFB0B8', .5); boilSeed('fheart'); paint(heartPts(540, hy, 36 * k * (1 + .06 * Math.sin(t * 6))), { wash: '#E2476E', ink: SP.ink, sw: .9 });
    }
    camEnd();
    caps(t);
    wipeIn(lt, DAWNC);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= G · Ram alone under the winter moon: cast out of his house, never out of his heart =================
  function shotHeart(t, lt, dur) {
    camBegin(540, 1300 - lt * 10, 1 + lt * .015);
    palaceWindow(t, 'g', { wx: 440, cold: 1 });
    const o = { boilKey: 'gram', kodanda: false, eyes: t > TL.HEART - 1.2 ? 'closed' : 'sad', mouth: 'frown', hx: -.5, lookX: -.8, lookY: -.3, brow: .9,
      handR: t > TL.HEART - 1.5 ? [1.2, -15.6] : undefined, bendR: .7, tint: '#3A4A8E', tintK: .2 };
    ram(700, 1920, 31, o);
    // his heart: Sita in a bubble over him
    const bk = backOut(clamp((t - TL.HEART + 1.3) * 2.5)), [hx, hy] = naradaHead(700, 1920, 31, o);
    bubble(400, 1020, 200, 210, bk, [hx - 80, hy - 120], 'gbub', '#FFF0F2');
    if (bk > .4) { glow(400, 1020, 200 * bk, '#FFC0C8', .35); sita(400, 1020 + 190 * bk, 9.5 * bk, { boilKey: 'gsita', eyes: 'closed', mouth: 'smile', pray: 1 }); }
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTC);
    wipeOut(lt, dur, HALLC);
  }

  // ================= H · years later, the yagna: Valmiki brings Sita; Ram: "I knew she was sinless. Forgive me." =================
  function hallBack(t, key) {
    court(t, key);
    boilSeed(key + 'crowd');   // the court's people, a row of heads along the far wall
    for (let i = 0; i < 12; i++) { const x = 140 + i * 72 + 10 * hash(i), y = 1520 + 12 * Math.sin(i * 1.7); paint(ellPts(x, y - 50, 26, 30, 12), { wash: mixCol('#5A2A3A', '#3A1A28', hash(i * 2.2)), ink: null }); paint(ellPts(x, y + 10, 40, 50, 12), { wash: '#4A1E2E', ink: null }); }
  }
  function shotYagna(t, lt, dur) {
    const f = ease(seg(t, TL.FORGIVE - .6, TL.FORGIVE + .4));
    camBegin(lerp(540, 700, f), lerp(1330, 1300, f), lerp(1, 1.3, f));
    hallBack(t, 'h');
    const walk = easeOut(seg(t, H0, TL.TELLS_V)), vx = lerp(-60, 320, walk), sx = lerp(-200, 175, walk);
    yagnaFire(500, 1820, .8, t, 'hf');
    sita(sx, 1760, 19, { boilKey: 'hsita', pal: SITA_OCHRE, walk: walk < .99 ? t * 1.5 : undefined, eyes: 'look', lookY: .7, mouth: 'flat', hx: .2 });
    valmiki(vx, 1770, 20, { boilKey: 'hval', walk: walk < .99 ? t * 1.5 + 1 : undefined, eyes: 'normal', mouth: 'smile', lookX: 1, hx: .3, handR: walk > .99 ? [5.2, -14] : undefined, bendR: .4 });
    const sorry = t > TL.SINLESS - .3, pr = ease(seg(t, TL.FORGIVE - .5, TL.FORGIVE + .1));
    ram(810, 1760, 21, { boilKey: 'hram', kodanda: false, eyes: sorry ? 'sad' : 'normal', mouth: talking(t, 'yagna') && t > TL.TELLS_V ? 'open' : 'frown', hx: -.5, lookX: -1, brow: sorry ? .9 : 0, pray: pr, bow: pr * .45 });
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
  }

  // ================= I · Sita's oath: "If I have never thought of anyone but Ram, Mother Earth, open for me" =================
  function shotOath(t, lt, dur) {
    const m = ease(seg(t, TL.MOTHER - .3, TL.OPEN + .6));
    camBegin(540, lerp(1240, 1420, m), lerp(1.18, 1.0, m));
    hallBack(t, 'i');
    yagnaFire(900, 1840, .6, t, 'if');
    const crack = ease(seg(t, TL.MOTHER, J0 + .2));
    goldCracks(540, 1790, 520, crack, 'icr');
    glow(540, 1700, 600 * crack, '#FFD060', .4 * crack);
    sita(540, 1790, 34, { boilKey: 'isita', pal: SITA_OCHRE, pray: 1, eyes: 'closed', mouth: talking(t, 'oath') ? 'o' : 'flat', lookY: .4, htilt: 0, bow: .1 });
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
  }

  // ================= J · the Earth opens: a throne on the nagas' hoods rises; she sits; it sinks; flowers rain =================
  function shotEarth(t, lt, dur) {
    const sh = shakeXY(t, t < J0 + .5 ? 6 : 1.5);
    camBegin(540 + sh[0], 1300 + sh[1], 1.0);
    hallBack(t, 'j');
    const rise = backOut(clamp((t - J0) / .7)), sink = easeIn(seg(t, TL.EARTH + .4, K0 + .1)), Y = 1790;
    glow(540, Y, 700, '#FFD060', .6);
    boilSeed('jhole'); paint(ellPts(540, Y + 10, 330, 70, 26), { wash: '#FFE27A', ink: SP.ink, sw: 1.2 });
    const ty = Y + 40 - rise * 170 + sink * 560;
    nagaThrone(540, ty, 1, t, 'jth');
    sita(540, ty + 6, 26, { boilKey: 'jsita', pal: SITA_OCHRE, pray: 1, eyes: 'closed', mouth: 'smile', lookY: -.3, noShadow: true });
    // the floor in front of the hole hides what sinks below it
    boilSeed('jfront'); paint([[-400, Y + 20], [200, Y + 20], [300, Y + 60], [540, Y + 82], [780, Y + 60], [880, Y + 20], [1480, Y + 20], [1480, 2700], [-400, 2700]], { wash: P1.floor, fill: P1.floorDk, fillOp: 50, tex: .5, ink: SP.ink, sw: 1, curv: .4 });
    goldCracks(540, Y + 60, 560, 1, 'jcr');
    petalRain(t, ease(seg(t, J0 + .3, J0 + 1)), 'jpetals');
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= K · Ram never married again: at every yagna, a Sita of gold stood beside him =================
  function shotGold(t, lt, dur) {
    camBegin(540, 1330 - lt * 10, 1 + lt * .015);
    hallBack(t, 'k');
    yagnaFire(540, 1860, .7, t, 'kf');
    const g = ease(seg(t, TL.GOLD - .3, TL.GOLD + .5));
    glow(740, 1300, 360 + 120 * g, '#FFD870', .45 + .2 * g);
    boilSeed('kped'); paint(rrPts(600, 1760, 280, 60, 12), { wash: SP.stone, fill: SP.stoneDk, fillOp: 60, tex: .5, ink: SP.ink, sw: 1 });
    sita(740, 1765, 21, { boilKey: 'kgold', pal: GOLD_SITA, ...GOLD_SKIN, eyes: 'closed', mouth: 'smile', noShadow: true, pray: 1 });
    if (g > 0) { boilSeed('kspark'); for (let i = 0; i < 6; i++) { const a = t * 1.2 + i * 1.05, r = 230 + 30 * Math.sin(t * 3 + i); paint(starPts(740 + Math.cos(a) * r * .7, 1350 + Math.sin(a) * r, 14 * g, .35, 4), { wash: '#FFF2C0', ink: null }); } }
    ram(330, 1790, 22, { boilKey: 'kram', kodanda: false, eyes: t > TL.NEVER && t < TL.EVERY ? 'closed' : 'sad', mouth: 'frown', hx: .5, lookX: 1, lookY: -.1, brow: .8, pray: ease(seg(t, TL.EVERY, TL.EVERY + .6)) });
    camEnd();
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, MAPC);
  }

  // ================= L1 · Bhavabhuti: in his play, they are reunited (dawn, petals) =================
  function shotReunion(t, lt, dur) {
    const close = ease(seg(t, L1, TL.REUNITED - .2));
    camBegin(540, 1330 - lt * 8, 1 + lt * .02);
    boilSeed('l1sky');
    paint(rectPts(-400, -400, W + 800, 1900), { wash: '#F7C08A', ink: null });
    paint(ellPts(540, 1250, 1000, 600, 28), { fill: '#FFE6B8', fillOp: 230, bleed: .3, tex: .4, ink: null });
    glow(540, 1150, 500, '#FFD890', .5);
    boilSeed('l1g'); paint([[-400, 1520], [300, 1480], [800, 1510], [1480, 1470], [1480, 2600], [-400, 2600]], { wash: P1.grass, fill: P1.grassDk, fillOp: 60, tex: .5, ink: SP.ink, sw: .9, curv: .5 });
    tree(60, 1560, 620, 'l1a', Math.sin(t * .8) * .3); tree(1030, 1560, 560, 'l1b', Math.sin(t * .9 + 1) * .3);
    const re = t > TL.REUNITED - .2;
    ram(lerp(300, 395, close), 1830, 24, { boilKey: 'l1ram', kodanda: true, eyes: re ? 'happy' : 'sad', mouth: re ? 'smile' : 'frown', hx: .5, lookX: 1, handR: close > .6 ? [6.3, -13.2] : undefined, bendR: .4 });
    sita(lerp(780, 690, close), 1830, 24, { boilKey: 'l1sita', eyes: re ? 'closed' : 'teary', mouth: re ? 'smile' : 'frown', hx: -.5, lookX: -1, handL: close > .6 ? [-5.8, -12.6] : undefined, bendL: .4 });
    if (re) { const k = backOut(clamp((t - TL.REUNITED + .2) * 3)); glow(540, 1360, 160 * k, '#FFB0B8', .5); boilSeed('l1heart'); paint(heartPts(540, 1240 - (t - TL.REUNITED) * 20, 40 * k), { wash: '#E2476E', ink: SP.ink, sw: .9 }); }
    petalRain(t, ease(seg(t, TL.REUNITED - .3, TL.REUNITED + .5)), 'l1petals');
    camEnd();
    caps(t);
    wipeIn(lt, DAWNC);
    wipeOut(lt, dur, MAPC);
  }

  // ================= M1 · Tulsidas: the Manas has no exile; Lav and Kush are born in Ram's reign (Uttarkand 25) =================
  const MANAS = ['अहनिसि बिधिहि मनावत रहहीं।', 'दुइ सुत सुंदर सीताँ जाए।', 'लव कुस बेद पुरानन्ह गाए॥'];
  function shotManas(t, lt, dur) {
    camBegin(540, 1200, 1 + lt * .012);   // world y ≈ screen y + 240
    chamber(t, 1, 'm1');
    const fl = .85 + .15 * Math.sin(t * 13) * Math.sin(t * 7.3);
    glow(150, 1560, 360 * fl, P1.lamp, .55);
    boilSeed('m1lamp'); paint(ellPts(150, 1640, 50, 18, 14), { wash: '#B8862E', ink: SP.ink, sw: .8 }); paint([[150, 1570 - 16 * fl], [164, 1622], [150, 1634], [136, 1622]], { wash: '#FFD27A', ink: null, curv: .6 });
    poet('tulsi', 330, 1800, 25, { boilKey: 'm1t', sit: 1, leaf: 1, eyes: t > TL.NOEXILE ? 'happy' : 'look', lookY: .8, lookX: .3, mouth: 'smile', handR: [2.8 + Math.sin(t * 9) * .3, -13.2], bendR: .5 });
    const ic = toScreen(330, 1560);
    // the royal family in a bubble: Ram and Sita with their two boys, at home
    const bk = backOut(clamp((t - TL.NOEXILE + .2) * 2.5));
    bubble(770, 1540, 200, 200, bk, [470, 1640], 'm1bub');
    if (bk > .4) {
      glow(770, 1540, 210 * bk, '#FFE6A0', .45);
      ram(700, 1540 + 160 * bk, 9 * bk, { boilKey: 'm1ram', kodanda: false, eyes: 'happy', mouth: 'smile', hx: .3 });
      sita(845, 1540 + 160 * bk, 9 * bk, { boilKey: 'm1sita', eyes: 'happy', mouth: 'smile', hx: -.3 });
      lavKush(745, 1540 + 170 * bk, 6 * bk, { boilKey: 'm1lav', eyes: 'happy', mouth: 'open', seed: 1 });
      lavKush(805, 1540 + 170 * bk, 6 * bk, { boilKey: 'm1kush', flip: true, eyes: 'happy', mouth: 'O', seed: 2 });
    }
    camEnd();
    // the chaupai: three lines of the page, the boys' line in gold
    MANAS.forEach((l, i) => { const a = t - M1 - .4 - i * .5; if (a > 0) letter(l, 540, 770 + i * 74, 48, i ? SP.gold : SP.cream, { screen: true, font: '48px "Tiro Devanagari Sanskrit"', stroke: SP.ink, sw: .16, ink: false, pop: a * 4, maxW: 860 }); });
    if (t > M1 + 1.6) letter('Ramcharitmanas · Uttarkand 25', 540, 1000, 30, SP.cream, { screen: true, font: '500 30px Poppins', stroke: SP.ink, sw: .25, ink: false, pop: (t - M1 - 1.6) * 5 });
    if (t > M1 + 1.2) letter('Many scholars think Valmiki’s last book was added later.', 520, 1060, 28, '#E8D8C0', { screen: true, font: '500 28px Poppins', stroke: SP.ink, sw: .25, ink: false, pop: (t - M1 - 1.2) * 5, maxW: 820 });
    caps(t);
    if (lt < .45) iris(...ic, lerp(0, 1500, easeIn(lt / .45)), SP.ink);
    wipeOut(lt, dur, HALLC);
  }

  // ================= N · the crowd at the oath was divided: "Well done, Sita!" "Well done, Ram!" And some said: both =================
  function shotSplit(t, lt, dur) {
    camBegin(540, 1320, 1 + lt * .01);
    hallBack(t, 'n');
    const L = ease(seg(t, TL.SITA_W - .3, TL.SITA_W + .2)), R = ease(seg(t, TL.RAM_W - .3, TL.RAM_W + .2)), B = ease(seg(t, TL.BOTH - .3, TL.BOTH + .2));
    const litL = Math.max(L * (1 - R * .6), B), litR = Math.max(R, B);
    glow(260, 1500, 420, '#FFC070', .45 * litL); glow(820, 1500, 420, '#FFC070', .45 * litR);
    // Sita (centre back) between them, in ochre
    sita(540, 1600, 14, { boilKey: 'nsita', pal: SITA_OCHRE, pray: 1, eyes: 'closed', mouth: 'flat' });
    const dark = k => ({ tint: '#3A1A3A', tintK: .45 * (1 - k) });
    const cheer = (k, i) => k > .5 ? { eyes: 'happy', mouth: 'grin', handR: [3.6, -24 + Math.sin(t * 8 + i) * .8], bendR: .3 } : { eyes: 'look', mouth: 'flat' };
    [[70, 1780, 0], [220, 1820, 1], [370, 1850, 2], [150, 1950, 3]].forEach(([x, y, i]) => folk(x, y, 15, i, { boilKey: 'nl' + i, hx: .5, lookX: 1, ...cheer(litL, i), ...dark(litL) }));
    [[710, 1850, 4], [860, 1820, 5], [1010, 1780, 6], [930, 1950, 7]].forEach(([x, y, i]) => folk(x, y, 15, i, { boilKey: 'nr' + i, hx: -.5, lookX: -1, flip: false, ...cheer(litR, i), ...dark(litR) }));
    camEnd();
    const pop = (txt, x, y, at, sz = 60) => { if (t > at) letter(txt, x, y, sz, SP.gold, { screen: true, font: `${sz}px "Tiro Devanagari Sanskrit"`, stroke: SP.ink, sw: .18, ink: false, pop: (t - at) * 4, rot: -.03 }); };
    pop('साधु सीता!', 270, 860, TL.SITA_W - .1); pop('साधु राम!', 790, 860, TL.RAM_W - .1); pop('साधु साधु!', 540, 990, TL.BOTH - .1, 68);
    caps(t);
    wipeIn(lt, HALLC);
    wipeOut(lt, dur, MAPC);
  }

  // ================= O · the ask: the Ramayans of India light up on the map; "…or the one on TV?" =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 950 - lt * 4, .9 + lt * .004);
    paintedMap(t, 'o', { sw: 2 });
    RAMAYANS2.forEach(([lon, lat], i) => leafBook(...mapXY(lon, lat), 1.15, t, O0 + .25 + i * .17, 'o' + i));
    const at = RAMAYANS2.map(([lon, lat]) => toScreen(...mapXY(lon, lat)));
    camEnd();
    RAMAYANS2.forEach(([, , title, lang, dx, dy], i) => {
      const a = O0 + .3 + i * .17; if (t < a) return;
      const x = clamp(at[i][0] + dx, 120, 900), y = at[i][1] + dy;
      letter(lang, x, y, 32, SP.brown, { screen: true, font: '700 32px Poppins', stroke: SP.cream, sw: .3, ink: false, pop: (t - a) * 5 });
      letter(title, x, y + 32, 24, '#6A3A22', { screen: true, font: '500 24px Poppins', stroke: SP.cream, sw: .3, ink: false, pop: (t - a - .1) * 5 });
    });
    if (t > TL.COMMENT + .3) {   // in the Bay of Bengal: the TV
      const k = backOut(clamp((t - TL.COMMENT - .3) * 4));
      push(); translate(800, 1200); scale(k); oldTV(0, 0, .75, t, 'otv'); pop();
      letter('…or the one', 790, 1320, 46, SP.cream, { screen: true, stroke: SP.ink, sw: .22, ink: false, pop: (t - TL.COMMENT - .4) * 5, rot: -.03 });
      letter('on TV?', 790, 1374, 56, SP.gold, { screen: true, stroke: SP.ink, sw: .22, ink: false, pop: (t - TL.COMMENT - .5) * 5, rot: -.03 });
    }
    caps(t);
    wipeIn(lt, MAPC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= P · the card =================
  function shotCard(t, lt) {
    booksCard(t, { logo: CARD + .1, cap: CARD + .3, covers: CARD + .9, price: CARD + 1.4, pill: CARD + 1.6, follow: CARD + 2.0 });
    wipeIn(lt, CARDC);
  }

  shots([[0, shotHook], [B0, shotPoets], [C0, shotValmiki], [C1, shotAyodhya], [D0, shotRamWindow], [E0, shotKalidasa], [E1, shotMessage], [F0, shotPray], [G0, shotHeart],
    [H0, shotYagna], [I0, shotOath], [J0, shotEarth], [K0, shotGold], [L0, shotBhava], [L1, shotReunion], [M0, shotTulsi], [M1, shotManas], [N0, shotSplit], [O0, shotAsk], [CARD, shotCard]]);
})();
