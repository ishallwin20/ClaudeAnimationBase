// rp3.js: Ramayan Part 3, "The King's Curse" (~74 s, Painted, an English voiceover with captions in Bangers, SFX). Told
// from the Valmiki Ramayana, Ayodhya Kanda: Ram leaves with Sita and Lakshman, the city weeps and the king follows the
// chariot (40); Sumantra comes back without them (57); that night Dasharatha tells Kausalya what he did as a prince
// (63): he could shoot by sound; one rainy night at the Sarayu he heard what he took for an elephant drinking, shot,
// and a young ascetic filling his pot for his blind parents cried out; "take them this water", and he died; the
// parents asked why their son was silent; the prince told them; the father cursed him: you too will die grieving for
// your son (64); Dasharatha dies that night, crying for Ram (64). The twist: back then he had no son at all. The Part 4
// tease (the crow and the blade of grass) and the follow card.
// STORYBOARD.md has the plan and the sources; sets and cast in rp3_props.js, src/ramayan_sets.js and src/ramayan.js.
// Every time comes from the voice (src/scenes/rp3_vo.js from tools/rp3_vo.json); tools/rp3_sfx.mjs recomputes them.
(() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const B0 = mid('hook', 'intro'), C0 = mid('intro', 'leave'), D0 = mid('leave', 'back'), E0 = mid('back', 'night'), F0 = mid('night', 'young'), F1 = mid('young', 'river');
  const G0 = mid('ask', 'parents'), H0 = mid('curse', 'twist'), I0 = mid('twist', 'died'), J0 = mid('died', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
  const KILLED = Wd('hook', 0, 2), HIM = Wd('hook', 0, 11), WEPT = Wd('leave', 1, 2), RAN = Wd('leave', 1, 7), ALONE = Wd('back', 0, 6);
  const SECRET = Wd('night', 0, 7), SKILL = Wd('young', 0, 7), BYSOUND = Wd('young', 0, 11);
  const SARAYU = Wd('river', 0, 5), SOUND = Wd('river', 0, 9), ELEPH = Wd('river', 0, 12), SHOT = Wd('shot', 0, 1), BOY = Wd('shot', 0, 4);
  const ASCETIC = Wd('pot', 0, 2), BLIND = Wd('pot', 0, 8), TAKE = Wd('ask', 0, 0), DIED = Wd('ask', 0, 7);
  const QUIET = Wd('parents', 0, 6), TRUTH = Wd('parents', 1, 7), CURSED = Wd('curse', 0, 2), GRIEV = Wd('curse', 0, 8);
  const NOSON = Wd('twist', 0, 4), CRYING = Wd('died', 0, 1), VERY = Wd('died', 0, 7), CROW = Wd('next', 0, 7), GRASS = Wd('next', 1, 5);
  const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };
  window.RP3_T = { B0, C0, D0, E0, F0, F1, G0, H0, I0, J0, K0, END, KILLED, HIM, WEPT, RAN, ALONE, SECRET, SKILL, BYSOUND, SARAYU, SOUND, ELEPH, SHOT, BOY, ASCETIC, BLIND, TAKE, DIED,
    QUIET, TRUTH, CURSED, GRIEV, NOSON, CRYING, VERY, CROW, GRASS, CARD };

  const GOLDC = P3.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], DAYC = [P3.dayHi, P3.road], DUSKC = [P3.duskHi, P3.duskLo], NIGHTC = [P1.nightHi, P1.nightLo], RAINC = [P3.nHi, P3.nLo], FORC = ['#2E5A34', '#5E9A5A'];

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
  const lyingKing = (x, y, u, o) => dasharatha(x, y, u, { rot: -Math.PI / 2 * .97, noShadow: true, ...o });   // on his back, head to the left

  // ================= A · the hook: the young prince draws his bow in the dark; it turns on him =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1220 - lt * 10, 1 + lt * .012);
    boilSeed('hbg'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#1A2A44', ink: null });
    paint(ellPts(540, 1150, 700, 800, 26), { fill: '#2E4468', fillOp: 220, bleed: .3, tex: .4, ink: null });
    const red = ease(seg(t, HIM - .3, HIM + .3));
    if (red > 0) glow(540, 1100, 700, '#C8323A', .5 * red);
    const aim = ease(seg(t, -1, KILLED - .1)), shot = t > KILLED;
    youngKing(560, 2000, 34, { boilKey: 'hy', eyes: shot && t < HIM ? 'wide' : 'angry', brow: -.6, mouth: shot ? 'O' : 'flat', hx: -.3, lookX: -.8,
      handL: [-8.4, -18.4], bendL: .3, handR: shot ? [-1.8, -16.6] : [lerp(-2.6, -.6, aim), lerp(-14.4, -18.6, aim)], bendR: .9,
      armL: (u, sw) => { push(); scale(1.7); inkLine(U([[.6, -4.5], [.6 + (shot ? 0 : aim * 2.6), 0], [.6, 4.5]], u / 1.7), sw * .45, '#F0E2C0', 'inkfine', 0); paint(ribbon(U([[.6, -4.6], [-.55, -2.8], [-.95, -.6], [-.95, .6], [-.55, 2.8], [.6, 4.6]], u / 1.7), .22 * u / 1.7, .22 * u / 1.7), { wash: '#7A4A22', ink: NRD.ink, sw: sw * .5 }); pop(); } });
    if (shot) { const k = easeIn(seg(t, KILLED, KILLED + .3)); const [bx, by] = naradaHand(560, 2000, 34, { handL: [-8.4, -18.4] }, -1); arrowAt(bx - 40 - k * 700, by, Math.PI, 150, 'harr'); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 3, "THE KING'S CURSE"); wipeIn(lt, CARDC); wipeOut(lt, dur, DAYC); }

  // ================= C · Ram leaves; the city weeps; the old king runs after the chariot =================
  function shotLeave(t, lt, dur) {
    const c = kf(t, [[C0, [540, 1350, 1.0]], [RAN - .5, [600, 1380, .98]], [D0, [440, 1420, 1.05]]], ease);
    camBegin(c[0], c[1], c[2]);
    ayodhyaGate(t, 'c');
    // the chariot rolls out to the right with Sumantra, Ram, Sita and Lakshman
    const go = easeIn(seg(t, C0 + .5, D0 + .3)), X = lerp(560, 1500, go), gal = t * 1.6;
    suryaHorse(X + 380, 1560, 18, { boilKey: 'ch1', gallop: gal, mane: '#6A3A2A', coat: '#E8D8C4', coatDk: '#C8B49A' });
    suryaChariot(X, 1720, 20, { part: 'back', boilKey: 'cc' });
    const [sx, sy] = suryaChariotSeat(X, 1720, 20);
    parvati(sx - 120, sy, 15, { boilKey: 'csi', pal: SITA_PAL, ...SITA_SKIN, eyes: 'closed', mouth: 'flat', noShadow: true });
    ram(sx - 40, sy, 16, { boilKey: 'cra', eyes: 'normal', mouth: 'smile', handR: [4.4, -17.6], bendR: .6, hx: -.4, lookX: -.8, noShadow: true });
    lakshman(sx + 40, sy, 15, { boilKey: 'cla', eyes: 'normal', mouth: 'flat', lookX: -.5, noShadow: true });
    sumantra(sx + 110, sy, 15, { boilKey: 'csu', eyes: 'closed', mouth: 'frown', lean: 1.2, handL: [3.6, -13.2], handR: [5.4, -13.6], noShadow: true });
    suryaChariot(X, 1720, 20, { part: 'front', boilKey: 'cc', spin: gal * 4, pole: suryaHorseBit(X + 380, 1560, 18) });
    // people at the gate weep
    for (let i = 0; i < 3; i++) { const px = -40 + i * 150; narada(px, 1700, 14, { boilKey: 'cp' + i, veena: false, pal: { dhoti: ['#C8A040', '#5E9A6A', '#B8643A'][i], dhotiDk: '#6E4A2A' }, eyes: 'closed', mouth: 'wobble', pray: .6, seed: i }); tears(...naradaEye(px, 1700, 14, {}, 1), t + i, 'cpt' + i, .6); }
    // the king runs after it, arms out, and falls to his knees
    const run = seg(t, RAN - .4, D0), kx = lerp(260, 620, easeOut(run)), fall = ease(seg(t, D0 - 1, D0 - .4));
    if (t > RAN - .5) {
      dasharatha(kx, 1760, 20, { boilKey: 'ck', walk: fall < .5 ? t * 2.4 : undefined, lean: 1.5, eyes: 'cry', mouth: 'wail', handR: [8.5, -18], bendR: .3, handL: [6.5, -17], bendL: .4, sit: fall > .5 ? 1 : 0 });
      tears(...naradaEye(kx, 1760, 20, { lean: 1.5, sit: fall > .5 ? 1 : 0 }, 1), t, 'ckt', .8);
    }
    boilSeed('cdust'); for (let i = 0; i < 4; i++) { const k = frac(t * .8 + i / 4); paint(ellPts(X - 200 - k * 300, 1700 - k * 40, 60 + k * 60, 30 + k * 20, 12), { wash: P3.roadDk, washOp: 140 * (1 - k), ink: null }); }
    camEnd();
    caps(t);
    wipeIn(lt, DAYC);
  }

  // ================= D · days later, the charioteer comes back alone =================
  function shotBack(t, lt, dur) {
    camBegin(540, 1380, 1.0);
    ayodhyaGate(t, 'd', 1);
    const come = easeOut(seg(t, D0, ALONE - .2)), X = lerp(1400, 520, come), gal = come < 1 ? t * 1.2 : 0;
    suryaHorse(X - 380, 1560, 18, { boilKey: 'dh', flip: true, gallop: gal, mane: '#6A3A2A', coat: '#E8D8C4', coatDk: '#C8B49A' });
    suryaChariot(X, 1720, 20, { part: 'back', boilKey: 'dc', flip: true });
    const [sx, sy] = suryaChariotSeat(X, 1720, 20, { flip: true });
    sumantra(sx, sy, 15, { boilKey: 'dsu', flip: true, eyes: 'closed', mouth: 'frown', bow: .6, noShadow: true, handL: [3.6, -13.2], handR: [5.4, -13.6] });
    suryaChariot(X, 1720, 20, { part: 'front', boilKey: 'dc', flip: true, spin: -gal * 4, pole: suryaHorseBit(X - 380, 1560, 18, { flip: true }) });
    if (t > ALONE - .3) { boilSeed('dempty'); const k = backOut(clamp((t - ALONE + .3) * 3)); glow(sx + 60, sy - 260, 140 * k, '#FFE6B0', .25); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= E · that night he tells Kausalya =================
  function shotNight(t, lt, dur) {
    camBegin(540, 1420, 1.05 + lt * .015);
    bedroom(t, 'e', 1);
    lyingKing(720, 1555, 17, { boilKey: 'ek', eyes: 'normal', mouth: Math.sin(t * 8) > 0 ? 'open' : 'flat', brow: .8, lookY: -.5 });
    kausalya(880, 1780, 21, { boilKey: 'ekq', eyes: 'normal', mouth: 'O', brow: .6, lookX: -.8, hx: -.3, handL: [-4.6, -14], bendL: .4 });
    if (t > SECRET - .3) { const k = backOut(clamp((t - SECRET + .3) * 3)); boilSeed('ebub'); for (let i = 0; i < 3; i++) paint(ellPts(lerp(300, 420, i / 3), lerp(1330, 1150, i / 3), (10 + i * 6) * k, (10 + i * 6) * k, 10), { wash: '#C8D6EE', ink: P3.ink, sw: .8 }); paint(ellPts(520, 980, 220 * k, 170 * k, 22, 4), { wash: '#1E2A44', ink: P3.ink, sw: 1.2, curv: .8 }); if (k > .5) youngKing(520, 1120, 7 * k, { boilKey: 'eby', mouth: 'flat' }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, RAINC);
  }

  // ================= F · the flashback: the prince who shoots by sound; the Sarayu; the shot; the boy =================
  function shotRiver(t, lt, dur) {
    const c = kf(t, [[F0, [540, 1380, 1.12]], [F1, [540, 1380, 1.0]], [SHOT, [600, 1380, 1.0]], [BOY + .3, [760, 1420, 1.2]], [ASCETIC, [720, 1460, 1.3]], [DIED + .3, [700, 1470, 1.36]]], ease);
    camBegin(c[0], c[1], c[2]);
    rainNight(t, 'f');
    // the prince at the left: eyes shut, listening; draws on the sound; looses; then runs to the boy
    const listen = t > SKILL - .3 && t < SHOT, aim = ease(seg(t, ELEPH - .3, SHOT - .1)), shot = t > SHOT, runK = easeOut(seg(t, BOY + .3, ASCETIC + .3)), px = lerp(260, 600, runK);
    const bowArm = (u, sw) => { push(); scale(1.7); inkLine(U([[.6, -4.5], [.6 + (shot ? 0 : aim * 2.6), 0], [.6, 4.5]], u / 1.7), sw * .45, '#F0E2C0', 'inkfine', 0); paint(ribbon(U([[.6, -4.6], [-.55, -2.8], [-.95, -.6], [-.95, .6], [-.55, 2.8], [.6, 4.6]], u / 1.7), .22 * u / 1.7, .22 * u / 1.7), { wash: '#7A4A22', ink: NRD.ink, sw: sw * .5 }); pop(); };
    const kneel = t > ASCETIC - .2;
    youngKing(px, 1760, 22, { boilKey: 'fy', flip: !kneel, walk: runK > 0 && runK < 1 ? t * 2.4 : undefined, eyes: listen ? 'closed' : t > BOY ? 'wide' : 'angry', mouth: t > BOY ? 'O' : 'flat', brow: t > BOY ? .9 : -.4,
      sit: kneel ? 1 : 0, bow: kneel ? .4 : 0, hx: kneel ? .3 : 0, lookX: kneel ? .8 : 0, sweat: t > BOY,
      handL: !kneel ? [-8.4, -18.4] : t > TAKE ? [6.6, -10.5] : [5, -12.5], bendL: .3, handR: !kneel ? (shot ? [-1.8, -16.6] : [lerp(-2.6, -.6, aim), lerp(-14.4, -18.6, aim)]) : [6.4, -12.2], bendR: .9, armL: !kneel ? bowArm : undefined });
    if (listen && t > BYSOUND - .2) { boilSeed('fear'); const [hx, hy] = naradaHead(px, 1760, 22, { flip: true }); for (let i = 0; i < 3; i++) { const k = frac((t - BYSOUND) * .9 + i / 3); inkLine(ellPts(hx + 60, hy, 30 + k * 90, 40 + k * 110, 16).slice(-6).concat(ellPts(hx + 60, hy, 30 + k * 90, 40 + k * 110, 16).slice(0, 6)), 2, mixCol(GOLDC, P3.nHi, k), 'inkfine', .5); } }
    // the sound at the water: ripples and a thought of an elephant
    const bx = 1000;
    if (t > SOUND - .3 && t < SHOT) { boilSeed('fsnd'); for (let i = 0; i < 3; i++) { const k = frac((t - SOUND) * .8 + i / 3); inkLine(ellPts(bx, 1560, 40 + k * 140, 14 + k * 40, 18).slice(9, 19), 2, P3.nWaterLt, 'inkfine', .5); } }
    if (t > ELEPH - .3 && t < SHOT + .2) { const k = backOut(clamp((t - ELEPH + .3) * 3)); boilSeed('fel'); paint(ellPts(bx - 160, 1220, 230 * k, 170 * k, 20, 4), { wash: '#2A3A5A', ink: P3.ink, sw: 1, curv: .8 }); if (k > .5) { push(); translate(bx - 160, 1250); scale(.55 * k); airavata(0, 120, 18, { trunk: 'down', boilKey: 'fela' }); pop(); } }
    // the arrow flies across into the reeds
    if (shot && t < SHOT + .35) { const k = easeIn(seg(t, SHOT, SHOT + .35)); arrowAt(lerp(px + 100, bx - 30, k), lerp(1380, 1500, k), .25, 150, 'far'); }
    // the boy among the reeds: hidden, then revealed, slumped with his pot; he speaks and dies
    if (t > BOY - .2) {
      const reveal = ease(seg(t, BOY + .3, ASCETIC)), died = ease(seg(t, DIED - .2, DIED + .4));
      ascetic(bx - 40, 1760, 20, { boilKey: 'fb', rot: lerp(-.5, -1.4, died), dy: 1.5, eyes: t > DIED - .2 ? 'closed' : 'wide', mouth: t > DIED ? 'flat' : t > TAKE ? (Math.sin(t * 7) > 0 ? 'open' : 'O') : 'O', noShadow: true, aR: -.2 });
      arrowAt(bx - 10, 1600, .25 + lerp(-.5, -1.4, died), 140, 'fstuck');
      pot(bx + 140, 1740, 80, 1.3, 'fpot', t > BLIND ? 1 : 0);
      if (reveal < 1) { bush(bx + 20, 1780, 220 * (1 - reveal * .6), 'fbush', '#2A5038', '#1E3A2A'); }
    }
    camEnd();
    rain(t, 'frain');
    caps(t);
    wipeIn(lt, RAINC);
    wipeOut(lt, dur, FORC);
  }

  // ================= G · the blind parents: "son, why so quiet?"; the truth; the curse =================
  function shotParents(t, lt, dur) {
    const c = kf(t, [[G0, [540, 1400, 1.0]], [TRUTH - .3, [540, 1400, 1.0]], [CURSED - .2, [400, 1380, 1.12]], [GRIEV, [380, 1340, 1.25]]], ease);
    const sh = shakeXY(t, t > GRIEV - .1 && t < GRIEV + .6 ? 6 : 0);
    camBegin(c[0] + sh[0], c[1] + sh[1], c[2]);
    rainNight(t, 'g');
    hut(330, 1560, 420, 'ghut');
    glow(330, 1440, 220, P3.lamp, .3);
    const rise = ease(seg(t, CURSED - .4, CURSED + .2)), point = ease(seg(t, GRIEV - .4, GRIEV));
    blindFather(220, 1820, 20, { boilKey: 'gf', sit: rise > .5 ? 0 : 1, mouth: t > CURSED ? (Math.sin(t * 9) > -.2 ? 'open' : 'frown') : t > QUIET - .6 && t < QUIET + .3 ? 'open' : 'smile', brow: t > TRUTH ? .9 : 0, tint: t > CURSED ? 'flush' : null, tintK: .25,
      handR: point > 0 ? [lerp(3.4, 8.6, point), lerp(-11, -21, point)] : undefined, bendR: .3, hx: .4, emote: t > TRUTH && t < CURSED ? 'cloud' : undefined, emoteK: 1, emoteAge: t });
    blindMother(470, 1820, 18, { boilKey: 'gm', mouth: t > TRUTH ? 'wobble' : 'smile', hx: .3, handR: t > TRUTH ? [.4, -21.5] : undefined, bendR: 1.2 });
    if (t > TRUTH) { tears(...naradaEye(220, 1820, 20, { sit: rise > .5 ? 0 : 1, hx: .4 }, 1), t, 'gft', .8); }
    if (t > CURSED) glow(...naradaHand(220, 1820, 20, { handR: [8.6, -21], bendR: .3 }, 1), 200 * point, '#FF7050', .6 * point);
    // the prince comes with the pot, kneels, confesses
    const inK = easeOut(seg(t, G0, G0 + 1.4)), kn = t > QUIET;
    youngKing(lerp(1300, 700, inK), 1820, 21, { boilKey: 'gy', flip: true, walk: inK < 1 ? t * 1.4 : undefined, sit: kn ? 1 : 0, bow: kn ? .5 : 0, pray: t > TRUTH ? 1 : 0, eyes: t > CURSED ? 'wide' : 'closed', mouth: t > TRUTH ? 'open' : 'frown', brow: .9, sweat: t > CURSED,
      handL: !kn || t < TRUTH ? [-4.6, -13.4] : undefined, armL: !kn || t < TRUTH ? (u, sw) => pot(0, -.8 * u, 2.6 * u, 0, 'gpot') : undefined });
    camEnd();
    rain(t, 'grain', .7);
    caps(t);
    wipeIn(lt, FORC);
    wipeOut(lt, dur, ['#F2E2C8', '#C8A87A']);
  }

  // ================= H · the twist: back then he had no son at all =================
  function shotTwist(t, lt, dur) {
    camBegin(540, 1350, 1.0 + lt * .015);
    boilSeed('hbg'); paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#E8D8C0', ink: null });
    paint(ellPts(540, 1250, 700, 700, 26), { fill: '#F6ECDA', fillOp: 220, bleed: .3, tex: .4, ink: null });
    cradle(720, 1760, 300, 'hcr');
    youngKing(330, 1800, 24, { boilKey: 'hy2', eyes: t > NOSON ? 'wide' : 'normal', mouth: t > NOSON ? 'O' : 'flat', lookX: .8, hx: .3, emote: t > NOSON ? '?' : undefined, emoteK: clamp((t - NOSON) * 4), emoteAge: t - NOSON });
    camEnd();
    caps(t);
    wipeIn(lt, ['#F2E2C8', '#C8A87A']);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= I · now, crying for Ram, he dies that very night (the lamp goes out) =================
  function shotDied(t, lt, dur) {
    camBegin(540, 1420, 1.08 + lt * .012);
    const out = 1 - ease(seg(t, VERY - .3, VERY + .5));
    bedroom(t, 'i', out);
    const gone = t > VERY;
    lyingKing(720, 1555, 17, { boilKey: 'ik', eyes: gone ? 'closed' : 'cry', mouth: gone ? 'flat' : Math.sin(t * 6) > 0 ? 'wail' : 'open', brow: .9, handR: gone ? undefined : [6.8, -21], bendR: .4 });
    if (!gone && t > CRYING) { const [hx, hy] = naradaHead(720, 1555, 17, { rot: -Math.PI / 2 * .97 }); const k = backOut(clamp((t - CRYING) * 3)) * out; glow(hx + 260, hy - 260, 240 * k, '#9EC8FF', .4); boilSeed('ibub'); paint(ellPts(hx + 260, hy - 260, 180 * k, 170 * k, 22, 3), { wash: '#E6EEFA', washOp: 255 * out, ink: P3.ink, sw: 1, curv: .8 }); if (k > .5) ram(hx + 260, hy - 125, 10 * k, { boilKey: 'iram', mouth: 'smile' }); }
    kausalya(880, 1780, 21, { boilKey: 'iq', eyes: gone ? 'closed' : 'normal', mouth: gone ? 'wobble' : 'O', brow: .9, lookX: -.8, hx: -.3, pray: gone ? 1 : 0, bow: gone ? .3 : 0 });
    if (gone) tears(...naradaEye(880, 1780, 21, {}, 1).map((v, i) => v + (i ? 0 : -30)), t, 'iqt', .8);
    camEnd();
    caps(t);
    wipeOut(lt, dur, FORC);
  }

  // ================= J · the tease: a crow swoops at Sita; Ram picks up a blade of grass =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1380, 1.0 + lt * .02);
    ashram(t, 'j');
    parvati(380, 1800, 21, { boilKey: 'js', pal: SITA_PAL, ...SITA_SKIN, eyes: t > CROW ? 'wide' : 'normal', mouth: t > CROW ? 'O' : 'smile', handL: t > CROW ? [-2, -21] : undefined, handR: t > CROW ? [2, -21] : undefined, bendL: 1, bendR: 1, hx: .3, lookX: .8, lookY: -.7 });
    const sw = ease(seg(t, CROW - .6, CROW + .2)), [cx, cy] = arcPt([1300, 600], [560, 1240], 120, sw);
    shaniCrow(cx, cy, 16, { boilKey: 'jc', flip: true, flap: Math.sin(t * 18), fly: 1, caw: t > CROW ? .8 : 0, eyes: 'wide' });
    const pick = ease(seg(t, GRASS - .6, GRASS));
    ram(800, 1820, 22, { boilKey: 'jr', eyes: t > GRASS - .6 ? 'angry' : 'normal', brow: -.6, mouth: 'flat', handR: [lerp(3.4, 6.2, pick), lerp(-11, -21, pick)], bendR: .5, lookX: -.6 });
    if (pick > .2) { const [hx, hy] = naradaHand(800, 1820, 22, { handR: [6.2, -21], bendR: .5 }, 1); glow(hx, hy - 80, 160, '#FFE070', .6 * pick); boilSeed('jgr'); inkLine([[hx, hy], [hx + 10, hy - 90], [hx + 26, hy - 170]], 3, '#8CC27A', 'ink', .5); }
    camEnd();
    caps(t);
    wipeIn(lt, FORC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 4, title: 'THE CROW AND THE GRASS', at: CARD }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotLeave], [D0, shotBack], [E0, shotNight], [F0, shotRiver], [G0, shotParents], [H0, shotTwist], [I0, shotDied], [J0, shotTease], [K0, shotCard]]);
})();
