// rp7.js: Ramayan Part 7, "Ravana Takes Sita" (69.2 s, Painted, no voice: captions in Bangers, retro cartoon SFX, a
// soft tanpura under the sad scenes). Told from the Valmiki Ramayana, Aranya Kanda: Sita welcomes the mendicant as a
// guest; he reveals himself as Ravana (46–47); be my queen; she answers: a jackal wants a lioness? (47.37); he seizes her
// and his golden chariot, yoked with donkeys, rises (49); she cries out to the trees, the river and the deer to tell Ram
// (49); Jatayu fights until Ravana cuts his wings (50–51); over a hill she sees five monkeys and drops her jewels tied in
// her upper cloth (54); Ram comes home to an empty hut and searches, calling her (60–64); dying Jatayu tells him Ravana
// took her (67–68); Ram cremates him as he would his father (68). The twist: one of the five monkeys was Hanuman
// (Kishkindha 6). The Part 8 tease and the follow card.
// STORYBOARD.md has the plan and the sources; sets and cast in rp7_props.js, src/ramayan_sets.js, src/ramayan.js. Every
// time comes from src/scenes/rp7_tl.js (TL), which tools/rp7_sfx.mjs reads too.
(() => {
  const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K1, L0, M0, K0, FACE, GUEST, QUEEN, ANSW, LIONESS, ROSE, DONKEYS, TREES, DEER, CUT, FIVE, TIED, DROPPED,
    SEARCH, BREATH, TOOK, HANU, TREE, CARD } = TL;
  window.RP7_T = TL;
  // a mouth that flaps while a character speaks a caption's line (a..b), else the resting one
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P7.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], DAYC = [P1.skyHi, P1.earth], SKYC = [P7.skyHi, P7.skyLo], DUSKC = ['#E2865A', '#7A2236'], FORC = ['#2E5A34', '#5E9A5A'];

  function caps(t) {
    for (const [a, b, ...lines] of TL.CAPS) {
      if (t < a || t > b) continue;
      let y = 480, prev = 0;
      lines.forEach((l, i) => {
        const huge = l[0] === '^', gold = huge || l.includes('*'), size = huge ? 112 : gold ? 88 : 74, age = a < 0 ? t - a : t - a - i * .35;
        if (i) y += (prev + size) * .56; prev = size;
        caption(l.replace(/[*^]/g, '').toUpperCase(), y, age, { life: b - a - (a < 0 ? 0 : i * .35), size, color: gold ? GOLDC : undefined });
      });
    }
  }
  const sita = (x, y, u, o) => parvati(x, y, u, { pal: SITA_PAL, ...SITA_SKIN, ...o });
  const MEND = { dhoti: '#C8862E', dhotiDk: '#9A5E18', dhotiLt: '#E8A85A', hair: '#2A2030', skin: '#C8946A', skinDk: '#A0704A', skinLt: '#E2B08A' };
  const brownDeer = { coat: '#A8784A', coatDk: '#7A5430', coatLt: '#C89A6A', spot: '#E8D8C0', belly: '#E8D2B0', gem: '#A8784A', gem2: '#A8784A', antler: '#A8784A' };

  // ================= A · the hook: a bundle of jewels falling from the sky =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1200, 1);
    skyChase(t, 'ha', .3);
    const y = 1180 + lt * 60, sp = Math.sin(t * 2) * .3;
    push(); translate(540, y + 60); rotate(sp); bundle(0, 0, 360, .4 + .2 * Math.sin(t * 3), 'hb'); pop();
    boilSeed('hasp'); for (let i = 0; i < 6; i++) { const q = frac(t * .8 + i / 6); paint(starPts(540 + Math.sin(i * 2.3) * 160, y - 200 - q * 200, 12 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFF6DA', ink: null }); }
    if (t > 1.4) { const q = backOut(clamp((t - 1.4) * 3)); emote('?', 800, 1000, 60 * q, 1, t); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 7, 'RAVANA TAKES SITA'); wipeIn(lt, CARDC); wipeOut(lt, dur, DAYC); }

  // ================= C · Sita welcomes the holy man; he shows his true face =================
  function shotGuest(t, lt, dur) {
    const sh = shakeXY(t, t > FACE && t < FACE + .4 ? 7 : 0);
    camBegin(560 + sh[0], 1400 + sh[1], 1.05);
    ashram(t, 'c');
    hut(250, 1640, 420, 'chut');
    const rev = t > FACE - .1;
    sita(380, 1830, 21, { boilKey: 'cs', eyes: rev ? 'wide' : 'happy', mouth: rev ? 'O' : talk(t, GUEST, GUEST + 1.2, 'smile'), lookX: .8, hx: .3, handR: rev ? [2, -21] : [6.5, -14.5], handL: rev ? [-2, -21] : undefined, bendR: rev ? 1 : .5, bendL: 1,
      emote: rev ? '!!' : undefined, emoteK: 1, emoteAge: t - FACE, armR: !rev ? (u, sw) => { boilSeed('cbowl'); paint(ellPts(0, -.4 * u, 1.3 * u, .5 * u, 12), { wash: '#C8A040', ink: P7.ink, sw: sw * .6 }); for (const [fx, fc] of [[-.5, '#E2283A'], [.1, '#F2A23A'], [.6, '#8AC24A']]) paint(ellPts(fx * u, -1 * u, .45 * u, .4 * u, 8), { wash: fc, ink: P7.ink, sw: sw * .4 }); } : undefined });
    if (!rev) valmiki(760, 1840, 22, { boilKey: 'cm', pal: MEND, beard: '#2A2030', eyes: t > FACE - 1 ? 'narrow' : 'happy', mouth: t > FACE - 1 ? 'smirk' : 'smile', lookX: -.8, hx: -.3, handR: [4.6, -20], bendR: .4, armR: (u, sw) => inkLine([[0, 12 * u], [0, -6 * u]], sw * 2.6, '#7A4A22', 'ink', 0) });
    else ravana(760, 1850, 13, { boilKey: 'cr', all: { eyes: 'narrow', mouth: 'grin' }, heads: { 4: { eyes: 'narrow', mouth: talk(t, FACE + .3, FACE + 1.3, 'grin', 'laugh') } } });
    poof(760, 1500, 320, (t - FACE + .25) / 1.1, 'cpoof');
    camEnd();
    caps(t);
    wipeIn(lt, DAYC);
  }

  // ================= D · "be my queen"; "a jackal wants a lioness?" =================
  function shotQueen(t, lt, dur) {
    const c = kf(t, [[D0, [620, 1380, 1.05]], [ANSW - .3, [620, 1380, 1.05]], [ANSW + .4, [420, 1380, 1.25]], [LIONESS, [560, 1380, 1.1]]], ease);
    camBegin(c[0], c[1], c[2]);
    ashram(t, 'd');
    hut(250, 1640, 420, 'dhut');
    const fierce = t > ANSW - .2, shock = t > LIONESS;
    if (fierce) glow(380, 1450, 380, '#FFB040', .45 + .1 * Math.sin(t * 5));
    sita(380, 1830, 21, { boilKey: 'ds', eyes: fierce ? 'angry' : 'wide', brow: fierce ? -.8 : .6, mouth: fierce ? talk(t, ANSW, LIONESS + .6, 'frown') : 'O', lookX: .8, hx: .3, handR: fierce ? [8.5, -18] : undefined, bendR: .3 });
    const love = !fierce, rm = love ? talk(t, QUEEN, QUEEN + 1.3, 'grin') : shock ? 'O' : 'flat';
    ravana(780, 1850, 13, { boilKey: 'dr', all: { eyes: love ? 'heart' : shock ? 'wide' : 'normal', mouth: love ? 'grin' : shock ? 'O' : 'flat', blush: love ? .8 : 0, emote: love ? 'hearts' : shock ? 'sweat' : undefined, emoteK: 1, emoteAge: love ? t - D0 : t - LIONESS },
      heads: { 4: { eyes: love ? 'heart' : shock ? 'wide' : 'normal', mouth: rm } }, shake: shock ? .5 : 0, dy: shock ? .8 * backOut(clamp((t - LIONESS) * 3)) : 0 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, SKYC);
  }

  // ================= E · he grabs her; the chariot rises; pulled by donkeys =================
  function shotGrab(t, lt, dur) {
    const rise = ease(seg(t, ROSE - .6, ROSE + 1)), z = ease(seg(t, DONKEYS - .3, DONKEYS + .4));
    camBegin(lerp(560, 840, z), lerp(lerp(1350, 1100, rise), 1000, z), lerp(lerp(1.0, .85, rise), 1.55, z));
    ashram(t, 'e');
    const cy = lerp(1780, 1000, rise), cx = 520 + rise * 60;
    skyChariot(cx, cy, 300, t, { riders: ([sx, sy]) => {
      sita(sx - 100, sy, 14, { boilKey: 'es', eyes: 'cry', mouth: Math.sin(t * 8) > 0 ? 'wail' : 'open', handL: [-5, -21], handR: [5, -21], bendL: .6, bendR: .6, noShadow: true });
      ravana(sx + 70, sy, 10, { boilKey: 'er', all: { eyes: 'narrow', mouth: 'grin' }, noShadow: true });
    } });
    if (t > DONKEYS + .3) { const q = backOut(clamp((t - DONKEYS - .3) * 3)); emote('music', 930, 900, 40 * q, 1, t); }
    camEnd();
    caps(t);
    wipeIn(lt, DAYC);
    wipeOut(lt, dur, SKYC);
  }

  // ================= F · she cries out to the trees, the river, the deer =================
  function shotCall(t, lt, dur) {
    camBegin(540, 1250, 1.0);
    skyChase(t, 'f', 1);
    // the forest below: treetops, the river, a deer looking up
    boilSeed('fbelow'); paint(rectPts(-600, 1550, W + 1200, 1200), { wash: '#5E8A4A', ink: null });
    paint(ribbon([[-300, 1800], [300, 1700], [700, 1780], [1400, 1680]], 90, 70), { wash: P1.water, ink: P7.ink, sw: .8 });
    for (let i = 0; i < 6; i++) { const x = -60 + i * 220, sway = t > TREES && t < TREES + 1 ? Math.sin(t * 14) * 8 : 0; paint(ellPts(x + sway, 1560, 120, 70, 14, 3), { wash: i % 2 ? '#4E8A52' : '#3E7442', ink: P7.ink, sw: .7 }); }
    goldenDeer(860, 1900, 200, { key: 'fd', col: brownDeer, neck: t > DEER ? -.4 : -.1, cute: 1, blink: t > DEER + .6 && t < DEER + .8 });
    if (t > DEER + .2) { const q = backOut(clamp((t - DEER - .2) * 3)); emote('!', 900, 1700, 36 * q, 1, t); }
    const lean = Math.sin(t * 2) * 20;
    skyChariot(380 + lean, 1460, 300, t, { riders: ([sx, sy]) => {
      sita(sx - 90, sy, 14, { boilKey: 'fs', eyes: 'cry', mouth: Math.sin(t * 8) > 0 ? 'wail' : 'open', handR: [8.5, -14], bendR: .3, handL: [-4, -21], noShadow: true });
      ravana(sx + 70, sy, 10, { boilKey: 'fr', all: { eyes: 'narrow', mouth: 'grin' }, noShadow: true });
    } });
    camEnd();
    caps(t);
    wipeOut(lt, dur, SKYC);
  }

  // ================= G · Jatayu fights until Ravana cuts his wings =================
  function shotJatayu(t, lt, dur) {
    const sh = shakeXY(t, t > CUT - .1 && t < CUT + .5 ? 8 : 0);
    camBegin(540 + sh[0], 1250 + sh[1], 1.0);
    skyChase(t, 'g', 1);
    skyChariot(300, 1480, 300, t, { riders: ([sx, sy]) => {
      sita(sx - 90, sy, 14, { boilKey: 'gs', eyes: 'wide', mouth: t > CUT ? 'wail' : 'O', noShadow: true });
      const sw = ease(seg(t, CUT - .4, CUT));
      ravana(sx + 70, sy, 10, { boilKey: 'gr', all: { eyes: 'angry', mouth: 'teeth', emote: t > G0 + .6 && t < CUT ? 'anger' : undefined, emoteK: 1 }, noShadow: true, arm: (a, s, k, def) => a === 19 ? { ...def, hand: [lerp(4, 9, sw), lerp(-8, -18, sw)], shape: 'fist', front: true, held: (u, swd) => khadga(u * 1.6, swd, lerp(-.8, 1.2, sw)) } : def });
    } });
    const att = seg(t, G0, CUT), fall = ease(seg(t, CUT, H0 + .3));
    const jx = lerp(1150, 720, ease(att)) + Math.sin(t * 6) * 30 * (1 - fall) + fall * 60, jy = lerp(1000, 1280, ease(att)) + fall * 900;
    jatayu(jx, jy, 30, { boilKey: 'gj', flip: true, fly: 1, flap: fall > 0 ? -1 : Math.sin(t * 14), squawk: fall > 0 ? 0 : .5 + .5 * Math.sin(t * 9), eyes: fall > 0 ? 'closed' : 'angry', rot: fall * 2 });
    if (t > CUT && t < CUT + .8) { boilSeed('gfeath'); const q = seg(t, CUT, CUT + .8); for (let i = 0; i < 10; i++) paint(ellPts(jx + (i - 5) * 40 * q * 2, jy - 80 + q * 200 + (i % 3) * 30, 18, 6, 8, 0, i), { wash: JATAYU_PAL.wing, washOp: 255 * (1 - q), ink: P7.ink, sw: .4 }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, SKYC);
  }

  // ================= H · over a hill, five monkeys; she ties her jewels in her scarf and drops them =================
  function shotMonkeys(t, lt, dur) {
    camBegin(540, 1300, 1.0);
    skyChase(t, 'h', .6);
    monkeyHill(560, 1700, 640, 'hhill');
    const seen = t > FIVE - .2, drop = t > DROPPED + .3;
    for (let i = 0; i < 5; i++) vanaraOn(250 + i * 150, 1790 + (i % 2) * 24, 12, { boilKey: 'hv' + i, fur: i === 2 ? null : i, crown: false, eyes: drop ? 'wide' : seen ? 'normal' : 'happy', lookY: seen ? -.8 : 0, lookX: seen ? -.4 : 0, mouth: drop ? 'O' : 'smile', seed: i,
      emote: drop && t < I0 - .3 ? (i % 2 ? '!' : '?') : undefined, emoteK: 1, emoteAge: t - DROPPED - .3 - i * .08, dy: drop ? -.8 * Math.abs(Math.sin((t - DROPPED) * 9 + i)) * (1 - seg(t, DROPPED + .3, DROPPED + 1.2)) : 0 });
    skyChariot(240 + lt * 40, 1330, 240, t, { riders: ([sx, sy]) => {
      sita(sx - 80, sy, 12, { boilKey: 'hs', eyes: seen ? 'wide' : 'cry', mouth: seen ? 'O' : 'frown', handR: t > TIED ? [7, -10] : [3, -12], bendR: .4, noShadow: true, lookX: .3, lookY: .7 });
      ravana(sx + 60, sy, 9, { boilKey: 'hr', all: { eyes: 'narrow', mouth: 'grin', lookX: 1 }, noShadow: true });
    } });
    if (t > DROPPED - .3) { const q = easeIn(seg(t, DROPPED - .3, DROPPED + .3)); bundle(lerp(380, 560, q), lerp(1400, 1720, q), 80, 0, 'hbd'); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= I · Ram comes home to an empty hut; he searches, calling her =================
  function shotEmpty(t, lt, dur) {
    camBegin(560, 1400, 1.05);
    ashram(t, 'i');
    hut(250, 1640, 420, 'ihut');
    const call = t > SEARCH - .3;
    ram(560, 1840, 22, { boilKey: 'ir', eyes: call ? 'cry' : 'wide', mouth: call ? talk(t, SEARCH, J0, 'wail', 'wail') : 'O', handL: call ? [-2.5, -18.4] : undefined, handR: call ? [2.5, -18.4] : undefined, bendL: .5, bendR: .5, hx: Math.sin(t * 2) * .5, lookX: Math.sin(t * 2), emote: call ? undefined : '?', emoteK: 1, emoteAge: t - I0 });
    lakshman(820, 1840, 20, { boilKey: 'il', eyes: call ? 'cry' : 'wide', mouth: call ? 'wobble' : 'O', lookX: -.6 });
    if (call) tears(...naradaEye(560, 1840, 22, {}, 1), t, 'irt', .9);
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= J · dying Jatayu: "Ravana took her" =================
  function shotDying(t, lt, dur) {
    camBegin(540, 1450, 1.12);
    boilSeed('jsky'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#E2865A', ink: null });
    paint(ellPts(540, 1300, 900, 500, 24), { fill: '#F7C98E', fillOp: 220, bleed: .3, tex: .4, ink: null });
    boilSeed('jgr'); paint(rectPts(-400, 1600, W + 800, 1200), { wash: '#8A6A44', ink: null });
    const gone = t > TOOK + 1;
    jatayu(700, 1720, 26, { boilKey: 'jj', flip: true, flap: -1, rot: -.4, eyes: gone ? 'closed' : 'sad', squawk: t > BREATH && t < TOOK + .8 ? (Math.sin((t - BREATH) * 13) > 0 ? .7 : .1) : 0 });
    ram(330, 1840, 22, { boilKey: 'jr', sit: 1, bow: .4, eyes: gone ? 'closed' : 'cry', mouth: gone ? 'frown' : 'wobble', lookX: .8, hx: .3, handR: [7.5, -12], bendR: .4 });
    tears(...naradaEye(330, 1840, 22, { sit: 1, bow: .4, hx: .3 }, 1), t, 'jrt', .9);
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= K · Ram cremates him like his own father =================
  function shotPyre(t, lt, dur) {
    camBegin(540, 1450, 1.05 + lt * .01);
    boilSeed('ksky'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#6E3A4A', ink: null });
    paint(ellPts(540, 1300, 900, 500, 24), { fill: '#C8603A', fillOp: 200, bleed: .3, tex: .4, ink: null });
    boilSeed('kgr'); paint(rectPts(-400, 1600, W + 800, 1200), { wash: '#4A3428', ink: null });
    pyre(680, 1720, 360, t, ease(seg(t, K1, K1 + 1.5)), 'kpy');
    ram(320, 1840, 22, { boilKey: 'kr', pray: 1, bow: .3, eyes: 'closed', mouth: 'frown', tint: '#FF9A40', tintK: .12 });
    lakshman(140, 1830, 20, { boilKey: 'kl', pray: 1, eyes: 'closed', mouth: 'frown' });
    camEnd();
    caps(t);
    wipeOut(lt, dur, SKYC);
  }

  // ================= L · the twist: one of the five monkeys was Hanuman =================
  function shotTwist(t, lt, dur) {
    const z = ease(seg(t, HANU - .8, HANU));
    camBegin(lerp(540, 550, z), lerp(1450, 1560, z), lerp(1.0, 1.7, z));
    skyChase(t, 'l', 0);
    monkeyHill(560, 1700, 640, 'lhill');
    for (let i = 0; i < 5; i++) if (i !== 2) vanaraOn(250 + i * 150, 1790 + (i % 2) * 24, 12, { boilKey: 'lv' + i, fur: i, crown: false, eyes: 'normal', mouth: 'smile', seed: i, lookX: i < 2 ? .8 : -.8 });
    glow(550, 1560, 200 * (.5 + z), '#FFE070', .4 + .3 * z);
    const hi = t > HANU;
    vanaraOn(550, 1790, 12, { boilKey: 'lh', crown: false, eyes: hi ? 'happy' : 'normal', mouth: hi ? 'grin' : 'smile', blush: hi ? .6 : 0, handR: [3, -12], handL: [-3, -12], armR: (u, sw) => bundle(-1.6 * u, .3 * u, 3.4 * u, hi ? .6 : 0, 'lbd'),
      emote: hi ? 'spark' : undefined, emoteK: 1, emoteAge: t - HANU, dy: hi ? -.6 * Math.abs(Math.sin((t - HANU) * 6)) : 0 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, FORC);
  }

  // ================= M · the tease: Ram meets Hanuman; an arrow by the tree =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1400, 1.0 + lt * .02);
    ashram(t, 'm');
    tree(560, 1650, 900, 'mtree', Math.sin(t * .8) * .2);
    ram(300, 1840, 22, { boilKey: 'mr', eyes: 'happy', mouth: 'smile', lookX: .8, hx: .3 });
    hanuman(780, 1840, 22, { boilKey: 'mh', crown: false, pray: 1, bow: .4, eyes: 'happy', mouth: 'grin', blush: .5, lookX: -.8, hx: -.3, gada: 0, emote: 'heart', emoteK: 1, emoteAge: t - M0 });
    if (t > TREE - .4) { const q = easeIn(seg(t, TREE - .4, TREE)); arrowAt(lerp(500, 640, q), lerp(1200, 1180, q), 0, 160, 'marr'); }
    camEnd();
    caps(t);
    wipeIn(lt, FORC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= N · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 8, title: 'THE ARROW FROM BEHIND A TREE', at: CARD }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotGuest], [D0, shotQueen], [E0, shotGrab], [F0, shotCall], [G0, shotJatayu], [H0, shotMonkeys], [I0, shotEmpty], [J0, shotDying],
    [K1, shotPyre], [L0, shotTwist], [M0, shotTease], [K0, shotCard]]);
})();
