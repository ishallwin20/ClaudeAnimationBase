// rp6.js: Ramayan Part 6, "The Golden Deer" (78.5 s, Painted, no voice: captions in Bangers, retro cartoon SFX, a soft
// tanpura under Sita alone). Told from the Valmiki Ramayana: Ravana hears of Khara's fall (Aranya 31–34) and goes to
// Maricha, who trembles: as a boy, Ram's arrow had thrown him a hundred yojanas into the ocean (Bala 30; Aranya 38);
// Ravana: help me or die; Maricha chooses Ram's arrow (Aranya 40–41); he becomes a golden deer with silver spots and
// gem-tipped antlers (42); Sita asks Ram to catch it; Lakshman warns it is Maricha (43); Ram leaves Lakshman to guard her
// and chases it far, the deer vanishing and appearing; his arrow strikes and the dying demon cries in Ram's voice, "Ha
// Sita! Ha Lakshmana!" (44); Sita begs Lakshman to go, he refuses, her harsh words drive him off (45); no line is drawn:
// there is no Lakshman Rekha in Valmiki; a holy man comes to the door (46). The Part 7 tease (the holy man was Ravana)
// and the follow card.
// STORYBOARD.md has the plan and the sources; sets and cast in rp6_props.js, src/ramayan_sets.js, src/ramayan.js. Every
// time comes from src/scenes/rp6_tl.js (TL), which tools/rp6_sfx.mjs reads too.
(() => {
  const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K1, L0, M0, N0, K0, SHADOW, REVENGE, SHOOK, SHOT, YOJ, CHOSE, ARROW, TURN, SPOTS, CATCH, WARN, GUARD, CHASED,
    STRUCK, VOICE, HA, NO, HARSH, LINE, REKHA, HOLY, RAVANA7, CARD } = TL;
  window.RP6_T = TL;
  // a mouth that flaps while a character speaks a caption's line (a..b), else the resting one
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;
  const OCEAN = SHOT + 1.3;

  const GOLDC = P6.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], HALLC = [P6.hall, P6.gold2], SEAC = [P6.sea, P6.sand], SEPC = [P6.sepia, '#8E6E48'], DAYC = [P1.skyHi, P1.earth], FORC = ['#2E5A34', '#5E9A5A'], NIGHTC = [P1.nightHi, P1.nightLo];

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

  // ================= A · the hook: the cute golden deer, and its shadow is a demon =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 10, 1 + lt * .012);
    nightForest(t, 'ha', .7);
    const sh = ease(seg(t, SHADOW, SHADOW + .8));
    demonShadow(540, 1720, 720, sh, 'hads');
    if (sh > .3) { for (const ex of [-40, 40]) glow(540 + ex * .7, 1720 - 720 * .75, 34 * sh, '#FF3030', .7 * sh); }
    goldenDeer(520, 1720, 380, { key: 'hd', glow: 1, neck: .3, cute: 1, blink: t > 2.2 && t < 2.45, look: t > 2.8 ? 'back' : undefined });
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 6, 'THE GOLDEN DEER'); wipeIn(lt, CARDC); wipeOut(lt, dur, HALLC); }

  // ================= C · Ravana hears what Ram did, and wants revenge =================
  function shotRavana(t, lt, dur) {
    const angry = t > REVENGE - .2, sh = shakeXY(t, angry && t < REVENGE + .4 ? 6 : 0);
    camBegin(540 + sh[0], 1300 + sh[1], .95 + lt * .015);
    lankaHall(t, 'c');
    throne(540, 1450, 380, 'cth');
    ravana(540, 1500, 15, { boilKey: 'cr', sit: true, all: { eyes: angry ? 'angry' : 'wide', brows: angry ? -.8 : .5, mouth: angry ? 'teeth' : 'O', emote: angry ? 'anger' : undefined, emoteK: 1, emoteAge: t - REVENGE },
      heads: { 4: { eyes: angry ? 'angry' : 'wide', mouth: angry ? talk(t, REVENGE, REVENGE + 1, 'teeth', 'open') : 'O' } }, shake: angry ? .3 : 0 });
    asura(270, 1830, 15, { kind: 'messenger', boilKey: 'cm', eyes: 'scared', mouth: talk(t, C0, REVENGE - .3, angry ? 'wobble' : 'O'), sweat: true, lean: .5, shake: angry ? .6 : 0 });
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
    wipeOut(lt, dur, SEAC);
  }

  // ================= D · he goes to Maricha, who shakes with fear =================
  function shotMaricha(t, lt, dur) {
    const z = ease(seg(t, SHOOK - .3, SHOOK + .5));
    camBegin(lerp(540, 650, z), lerp(1400, 1440, z), lerp(1.0, 1.15, z));
    seaShore(t, 'd');
    hut(820, 1560, 320, 'dhut');
    const fear = t > SHOOK - .3;
    maricha(700, 1830, 19, { boilKey: 'dm', eyes: fear ? 'scared' : 'normal', mouth: fear ? 'wobble' : 'smile', sweat: fear, shake: fear ? 1.4 : 0, emote: fear ? '!!' : undefined, emoteK: 1, emoteAge: t - SHOOK });
    const inK = easeOut(seg(t, D0, D0 + 1));
    ravana(lerp(-150, 300, inK), 1840, 12, { boilKey: 'dr', walk: inK < 1 ? t * 2 : undefined, all: { eyes: 'narrow', mouth: talk(t, D0 + .9, SHOOK - .2, 'smirk') }, heads: { 4: { eyes: 'narrow', mouth: talk(t, D0 + .9, SHOOK - .2, 'smirk') } } });
    camEnd();
    caps(t);
    wipeOut(lt, dur, SEPC);
  }

  // ================= E · years ago (sepia): the boy Ram shoots him into the ocean, a hundred yojanas =================
  function shotPast(t, lt, dur) {
    const far = ease(seg(t, YOJ - .3, YOJ + .5));
    camBegin(lerp(540, 820, far), lerp(1400, 1300, far), lerp(1.0, 1.6, far));
    seaShore(t, 'e', 1);
    const shot = t > SHOT;
    boyRam(220, 1830, 22, { boilKey: 'eb', eyes: shot && t > OCEAN ? 'happy' : 'angry', mouth: shot && t > OCEAN ? 'grin' : 'flat', tint: P6.sepia, tintK: .3, aR: shot ? .3 : -.2 });
    const k = ease(seg(t, SHOT, OCEAN));
    if (t < SHOT + .05) maricha(720, 1830, 18, { boilKey: 'em', eyes: 'angry', mouth: 'roar', tint: P6.sepia, tintK: .3 });
    else if (k < 1) { const p = arcPt([720, 1500], [880, 1250], -500, k); push(); translate(p[0], p[1]); rotate(k * 9); maricha(0, 300, 18 * (1 - k * .7), { boilKey: 'em', eyes: 'swirl', mouth: 'O', tint: P6.sepia, tintK: .3, noShadow: true }); pop(); arrowAt(p[0] - 40, p[1] + 60, -.3, 140, 'earr'); }
    if (t > SHOT) { boilSeed('etrail'); const n = Math.floor(14 * k); for (let i = 1; i < n; i++) { const p = arcPt([720, 1500], [880, 1250], -500, i / 14); paint(ellPts(p[0], p[1], 5, 5, 6), { wash: sep6('#FFF5E2'), washOp: 200, ink: null }); } }
    if (k >= .98) { boilSeed('esplash'); const q = seg(t, OCEAN, OCEAN + 1); for (let i = 0; i < 7; i++) { const a = -Math.PI * (.15 + .7 * i / 6); inkLine([[880, 1260], [880 + Math.cos(a) * 120 * q, 1260 + Math.sin(a) * 160 * q]], 4 * (1 - q), sep6('#BCE0EE'), 'ink', .3); } }
    if (t > YOJ - .4) {   // far out at sea his head bobs up, dizzy
      const up = backOut(clamp((t - YOJ + .4) * 2.5)), by = 1300 - up * 18 + Math.sin(t * 4) * 4;
      maricha(880, by + 84, 4.5, { boilKey: 'eh', eyes: 'swirl', mouth: 'wobble', tint: P6.sepia, tintK: .3, noShadow: true, emote: 'stars', emoteK: 1, emoteAge: t - YOJ });
      boilSeed('ewave'); paint(ellPts(880, by + 80, 80, 58, 16), { wash: sep6(P6.sea), ink: null }); inkLine([[830, by + 18], [855, by + 12], [880, by + 18], [905, by + 12], [930, by + 18]], 1.4, sep6(P6.seaLt), 'inkfine', .5);
    }
    camEnd();
    caps(t);
    wipeIn(lt, SEPC);
    wipeOut(lt, dur, SEAC);
  }

  // ================= F · help me or die; Maricha chooses Ram's arrow =================
  function shotThreat(t, lt, dur) {
    const c = kf(t, [[F0, [540, 1380, 1.05]], [CHOSE, [640, 1380, 1.2]]], ease);
    camBegin(c[0], c[1], c[2]);
    seaShore(t, 'f');
    const sword = ease(seg(t, F0 + .6, F0 + 1));
    const rm = talk(t, F0 + .2, CHOSE - .4, 'teeth');
    ravana(300, 1840, 14, { boilKey: 'fr', all: { eyes: 'angry', brows: -.8, mouth: rm }, heads: { 4: { mouth: rm } }, arm: (a, s, k, def) => a === 19 ? { ...def, hand: [lerp(4, 8, sword), lerp(-8, -19, sword)], shape: 'fist', front: true, held: (u, sw) => khadga(u * 1.6, sw, -.4) } : def });
    const chose = t > CHOSE - .2;
    maricha(780, 1830, 19, { boilKey: 'fm', eyes: chose ? 'closed' : 'scared', mouth: chose ? 'wobble' : 'O', sweat: true, shake: chose ? .2 : .9, emote: chose ? 'sweat' : undefined, emoteK: 1, emoteAge: t - CHOSE });
    if (chose) { const k = backOut(clamp((t - CHOSE + .2) * 3)), bx = 760, by = 1150; boilSeed('fbub'); paint(ellPts(bx, by, 190 * k, 140 * k, 22, 4), { wash: '#E6EEFA', ink: P6.ink, sw: 1, curv: .8 }); for (const [dx, dy, r] of [[40, 190, 22], [20, 240, 13]]) paint(ellPts(bx + dx, by + dy, r * k, r * k, 10), { wash: '#E6EEFA', ink: P6.ink, sw: .8 }); if (k > .5) { ram(bx - 40, by + 110, 7 * k, { boilKey: 'fbr', eyes: 'angry', mouth: 'flat', handL: [-7.6, -18], bendL: .3, handR: [-.4, -18.6], bendR: .9 }); if (t > ARROW - .2) arrowAt(bx + 140, by + 10, 0, 120, 'fbar'); } }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DAYC);
  }

  // ================= G · he becomes the golden deer: silver spots, jewelled antlers =================
  function shotDeer(t, lt, dur) {
    const c = kf(t, [[G0, [540, 1400, 1.0]], [SPOTS, [600, 1450, 1.25]], [SPOTS + 1.2, [640, 1330, 1.45]]], ease);
    camBegin(c[0], c[1], c[2]);
    ashram(t, 'g');
    if (t < TURN) maricha(620, 1830, 19, { boilKey: 'gm', eyes: 'narrow', mouth: 'smirk', handR: [5, -20] });
    else goldenDeer(620, 1830, 380, { key: 'gd', glow: 1, cute: 1, walk: t < SPOTS ? t * .8 : undefined, blink: t > SPOTS + 1.6 && t < SPOTS + 1.85, neck: t > SPOTS ? .1 + .1 * Math.sin(t * 2) : .3 });
    poof(620, 1600, 260, (t - TURN + .3) / 1.2, 'gpoof');
    if (t > TURN + .2) { boilSeed('gspark'); for (let i = 0; i < 7; i++) { const q = frac(t * 1.2 + i / 7); paint(starPts(500 + hash(i * 3.3) * 300, 1450 - q * 200 + hash(i) * 100, 12 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFFFFF', ink: null }); } }
    camEnd();
    caps(t);
    wipeIn(lt, DAYC);
  }

  // ================= H · Sita: catch it for me; Lakshman: it's Maricha =================
  function shotSita(t, lt, dur) {
    camBegin(540, 1400, 1.0 + lt * .01);
    ashram(t, 'h');
    goldenDeer(900, 1700, 260, { key: 'hd', glow: 1, cute: 1, walk: t * .6, flip: true, look: Math.sin(t * .8) > .3 ? 'back' : undefined, blink: frac(t * .4) > .93 });
    const ask = t > CATCH - .4;
    sita(200, 1830, 21, { boilKey: 'hs', eyes: ask ? 'shine' : 'wide', mouth: talk(t, CATCH, WARN - .3, 'grin'), blush: .6, handR: ask ? [8.5, -17] : [2, -15], handL: ask ? undefined : [-2, -15], bendR: .3, bendL: .9, lookX: .8, hx: .3, emote: 'hearts', emoteK: 1, emoteAge: t - H0 });
    ram(420, 1840, 22, { boilKey: 'hr', eyes: 'happy', mouth: 'smile', lookX: .8, hx: .3 });
    const warn = t > WARN - .2;
    lakshman(620, 1840, 21, { boilKey: 'hl', eyes: warn ? 'narrow' : 'normal', brow: warn ? -.6 : 0, mouth: warn ? talk(t, WARN, WARN + 2.2, 'flat') : 'flat', hx: warn ? Math.sin(t * 9) * .4 : 0, handR: warn ? [7.4, -18.5] : undefined, bendR: .4, emote: t > WARN + 1.4 ? '!' : undefined, emoteK: 1, emoteAge: t - WARN - 1.4 });
    camEnd();
    caps(t);
    wipeOut(lt, dur, FORC);
  }

  // ================= I · Ram: guard Sita; he chases it; it keeps vanishing and appearing =================
  // the deer pops between hiding places: [time it appears, x, y]
  const HIDES = [[CHASED - .6, 620, 1780], [CHASED + .5, 980, 1760], [CHASED + 1.3, 300, 1800], [CHASED + 2.1, 820, 1770], [CHASED + 2.8, 1150, 1760]];
  function shotChase(t, lt, dur) {
    camBegin(540, 1400, 1.0);
    nightForest(t, 'i', .2 + .3 * seg(t, I0, J0));
    let hide = HIDES[0]; for (const h of HIDES) if (t >= h[0]) hide = h;
    const hi = HIDES.indexOf(hide), lt2 = t - hide[0], next = HIDES[hi + 1], gone = next && t > next[0] - .2;
    if (!gone) goldenDeer(hide[1], hide[2], 260, { key: 'id', cute: 1, glow: .8, flip: hi % 2 === 1, look: lt2 > .25 ? 'back' : undefined, blink: lt2 > .45 && lt2 < .6 });
    if (hi > 0) poof(hide[1], hide[2] - 120, 160, lt2 / .6, 'ipf' + hi);
    if (next && t > next[0] - .2) poof(hide[1], hide[2] - 120, 160, (t - next[0] + .2) / .6, 'ipo' + hi);
    const run = t > CHASED - .4, rk = seg(t, CHASED - .4, J0), rx = lerp(260, 780, rk) + Math.sin(t * 3.3) * 160 * rk;
    ram(run ? rx : 260, 1840, 22, { boilKey: 'ir', walk: run ? t * 3 : undefined, lean: run ? 2 : 0, flip: run && Math.cos(t * 3.3) < -.3, eyes: run ? 'wide' : 'normal', mouth: talk(t, GUARD, GUARD + 1.1, run ? 'O' : 'flat'), hx: .5, lookX: 1, kodanda: true, handR: t < GUARD + 1.2 && t > GUARD - .3 ? [7.2, -16] : undefined, bendR: .4, emote: run && hi > 1 ? '?' : undefined, emoteK: 1, emoteAge: t - HIDES[2][0] });
    camEnd();
    caps(t);
    wipeIn(lt, FORC);
  }

  // ================= J · the arrow strikes; the dying demon cries in Ram's voice =================
  function shotShot(t, lt, dur) {
    const sh = shakeXY(t, t > HA && t < K1 ? 6 : 0);
    camBegin(540 + sh[0], 1400 + sh[1], 1.0);
    nightForest(t, 'j', .6);
    const hit = t > STRUCK;
    ram(220, 1840, 22, { boilKey: 'jr', flip: true, eyes: hit ? (t > HA ? 'wide' : 'normal') : 'angry', mouth: t > HA ? 'O' : 'flat', kodanda: false, hx: -.5, lookX: -1, handL: [-7.6, -18], bendL: .3, handR: hit ? [-1.8, -16.6] : [-.6, -18.6], bendR: .9, armL: heldBow(hit ? 0 : 1, !hit), emote: t > HA + .3 ? '!!' : undefined, emoteK: 1, emoteAge: t - HA - .3 });
    if (!hit) goldenDeer(760, 1780, 280, { key: 'jd', glow: .8, cute: 1, leap: (Math.sin(t * 6) + 1) / 2 });
    else {
      const turn = ease(seg(t, STRUCK + .2, STRUCK + .8)), fall = ease(seg(t, VOICE + .3, VOICE + 1.2));
      if (turn < .5) goldenDeer(760, 1780, 280, { key: 'jd', glow: .8 * (1 - turn * 2), cute: 1, blink: true });
      else maricha(760, 1830, 18, { boilKey: 'jm', eyes: 'swirl', mouth: t > HA ? talk(t, HA, HA + 1.6, 'O', 'roar') : 'O', rot: fall * 1.3, dy: fall * 2 });
      poof(760, 1620, 220, (t - STRUCK - .2) / 1.1, 'jpoof');
      if (t < STRUCK + .2) { const q = seg(t, STRUCK - .3, STRUCK); arrowAt(lerp(380, 740, q), 1560, 0, 150, 'jarr'); }
      if (t > HA - .1) { boilSeed('jwaves'); for (let i = 0; i < 4; i++) { const q = frac((t - HA) * .9 + i / 4); inkLine(ellPts(760, 1450, 80 + q * 500, 60 + q * 380, 28).slice(14, 28), 4 * (1 - q), '#FFE6A0', 'ink', .5); } }
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DAYC);
  }

  // ================= K · Sita begs; Lakshman: no; her harsh words; he goes =================
  function shotHarsh(t, lt, dur) {
    const c = kf(t, [[K1, [540, 1400, 1.05]], [NO - .2, [640, 1420, 1.2]], [HARSH - .2, [420, 1400, 1.2]], [HARSH + 1.8, [540, 1400, 1.05]]], ease);
    camBegin(c[0], c[1], c[2]);
    ashram(t, 'k');
    const angry = t > HARSH - .2, go = ease(seg(t, HARSH + 1.6, L0 + .3)), no = t > NO - .2 && t < HARSH - .2;
    sita(330, 1830, 22, { boilKey: 'ks', eyes: angry ? 'angry' : 'cry', mouth: angry ? talk(t, HARSH, HARSH + 1.5, 'frown') : talk(t, K1 + .3, NO - .3, 'wobble'), lookX: .8, hx: .3, handR: angry ? [8.5, -18] : [6.5, -15], handL: angry ? undefined : [-1, -16], bendR: .4, emote: angry ? 'anger' : 'sweat', emoteK: 1, emoteAge: t });
    if (!angry) tears(330 + 1.3 * 22, 1830 - 20.1 * 22, t, 'kst', .8);   // under Sita's right eye (parvati(): eyes at ±1.1, -20.1)
    lakshman(lerp(700, 1250, go), 1840, 22, { boilKey: 'kl', flip: go > .05, walk: go > .05 && go < 1 ? t * 2 : undefined, eyes: no ? 'closed' : angry ? 'cry' : 'normal', mouth: no ? talk(t, NO, NO + .5, 'flat') : angry ? 'wobble' : 'flat',
      hx: no ? Math.sin(t * 10) * .5 : -.3, htilt: no ? -.12 : 0, bow: angry && go < .05 ? .4 : 0, pray: angry && go < .05 ? 1 : 0, kodanda: true });
    if (angry && go < .9) tears(...naradaEye(lerp(700, 1250, go), 1840, 22, { hx: -.3 }, 1), t, 'klt', .8);
    camEnd();
    caps(t);
  }

  // ================= L · no, he drew no line: there is no Lakshman Rekha in Valmiki =================
  function shotRekha(t, lt, dur) {
    const hitK = t > REKHA + .1 && t < REKHA + .5, sh = shakeXY(t, hitK ? 8 : 0);
    camBegin(540 + sh[0], 1450 + sh[1], 1.05);
    ashram(t, 'l');
    sita(300, 1700, 18, { boilKey: 'ls', eyes: t > REKHA + .1 ? 'wide' : 'normal', mouth: t > REKHA + .1 ? 'O' : 'flat', lookX: .6, lookY: .5, emote: t > LINE + .8 && t < REKHA ? '?' : undefined, emoteK: 1, emoteAge: t - LINE - .8 });
    const draw = seg(t, LINE, LINE + 1), cross = seg(t, REKHA - .1, REKHA + .3);
    crossLine(560, 1760, 640, draw, cross, 'lx');
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= M · Sita alone; a holy man at the door =================
  function shotDoor(t, lt, dur) {
    camBegin(560, 1420, 1.1 + lt * .02);
    ashram(t, 'm');
    hut(560, 1700, 640, 'mhut');
    sita(380, 1830, 20, { boilKey: 'ms', eyes: t > HOLY + .6 ? 'wide' : 'sad', mouth: t > HOLY + .6 ? 'O' : 'frown', lookX: .8, hx: .3, emote: t > HOLY + .6 ? '!' : undefined, emoteK: 1, emoteAge: t - HOLY - .6 });
    const inK = easeOut(seg(t, HOLY - .3, HOLY + 1.6));
    holyShadow(lerp(1300, 720, inK), 1830, 420, 'mhs');
    camEnd();
    caps(t);
  }

  // ================= N · the tease: his shadow on the hut has ten heads =================
  function shotTease(t, lt, dur) {
    camBegin(560, 1420, 1.18 + lt * .02);
    ashram(t, 'n');
    hut(560, 1700, 640, 'nhut');
    tenHeadShadow(760, 1690, 560, ease(seg(t, RAVANA7 - .8, RAVANA7)), 'nts');
    sita(380, 1830, 20, { boilKey: 'ns', eyes: 'wide', mouth: 'O', lookX: .8, hx: .3 });
    holyShadow(720, 1830, 420, 'nhs');
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= O · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 7, title: 'RAVANA TAKES SITA', at: CARD }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotRavana], [D0, shotMaricha], [E0, shotPast], [F0, shotThreat], [G0, shotDeer], [H0, shotSita], [I0, shotChase], [J0, shotShot],
    [K1, shotHarsh], [L0, shotRekha], [M0, shotDoor], [N0, shotTease], [K0, shotCard]]);
})();
