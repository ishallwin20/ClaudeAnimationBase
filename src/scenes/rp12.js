// rp12.js: Ramayan Part 12, "The Last Arrow", the series finale (60.0 s, Painted, no voice: captions in Bangers, retro
// cartoon SFX, a soft tanpura under the hymn and the homecoming). Told from the Valmiki Ramayana, Yuddha Kanda: Ravana
// fights from his chariot and Ram on foot, so Indra sends his own chariot with Matali (102); the sage Agastya teaches
// Ram the Aditya Hridayam, which he recites three times and feels new strength (105); Ram cuts off Ravana's heads but
// they grow back, a hundred times (107); Matali tells him to use the Brahma weapon; it strikes Ravana's heart, Ravana
// falls, and the arrow returns to Ram's quiver (108); the gods shower flowers (108); Ram, Sita and Lakshman fly home to
// Ayodhya on the Pushpaka and Ram is crowned (123–128). The end, and the finale card (start from Part 1).
// STORYBOARD.md has the plan and the sources; sets and cast in rp12_props.js, src/ramayan_sets.js, src/ramayan.js.
// Every time comes from src/scenes/rp12_tl.js (TL), which tools/rp12_sfx.mjs reads too.
(() => {
  const { GROWS, CUT, B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, INDRA, MATALI, AGASTYA, THRICE, STRONG, CUTS, HUNDRED, LOOSE, HEART, FELL, BACK, KING, CROWN, CARD } = TL;
  window.RP12_T = TL;
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P12.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], DUSKC = [P12.duskHi, P12.earth], SKYC = [P12.skyHi, '#FFF6EC'], HALLC = [P1.hall, P1.pillar];

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
  const bowPose = (draw, o = {}) => ({ flip: true, handL: [-7.6, -18], bendL: .3, handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, kodanda: false, armL: heldBow(draw), ...o });
  const sita = (x, y, u, o) => parvati(x, y, u, { pal: SITA_PAL, ...SITA_SKIN, ...o });
  // Ravana standing on the right, facing Ram (flipped); cut: for each head i, the time it was cut (it regrows over .5 s)
  const RVX = 760, RVY = 1840, RVU = 14;
  function ravanaCut(t, cuts, o = {}) {
    const heads = {};
    for (let i = 0; i < 10; i++) {
      const c = cuts[i]; if (c == null || t < c) continue;
      const g = t - c;
      heads[i] = g < .3 ? { hide: true } : { s: backOut(clamp((g - .3) / .4)), eyes: 'happy', mouth: 'grin', emote: g < 1.2 ? 'spark' : undefined, emoteK: 1, emoteAge: g - .3 };
    }
    ravana(RVX, RVY, RVU, { boilKey: 'rv', flip: true, all: { eyes: 'narrow', mouth: 'smirk', ...(o.all || {}) }, ...o, heads: { ...heads, ...(o.heads || {}) } });
    // the cut heads tumbling away (up and right) for .9 s
    for (let i = 0; i < 10; i++) { const c = cuts[i]; if (c == null || t < c || t > c + .9) continue; const [hx, hy, hr] = rvHeadPos({}, i), q = (t - c) / .9; ravanaLoneHead(RVX - hx * RVU + q * 260, RVY + hy * RVU - Math.sin(q * Math.PI) * 220 + q * 120, hr * RVU * (1 - q * .3), i, { eyes: 'swirl', mouth: 'O', tilt: q * 6 }, { boilKey: 'rvc' + i }); }
  }

  // ================= A · the hook: an arrow cuts off a head; it grows back =================
  function shotHook(t, lt, dur) {
    camBegin(720, 1580 - lt * 6, 1.55 + lt * .02);
    battlefield(t, 'ha');
    ravanaCut(t, { 4: CUT });
    if (t < CUT) { const q = seg(t, 0, CUT); arrowAt(lerp(380, 740, q), lerp(1580, 1540, q), -.1, 150, 'haar'); }
    if (t > GROWS) emote('?', 920, 1300, 60, 1, t);
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 12, 'THE LAST ARROW'); wipeIn(lt, CARDC); wipeOut(lt, dur, DUSKC); }

  // ================= C · Ravana in his chariot, Ram on foot; Indra sends his chariot with Matali =================
  function shotChariot(t, lt, dur) {
    camBegin(540, 1420, 1.0);
    battlefield(t, 'c');
    warChariot(760, 1840, 300, t, { key: 'crc', team: 'donkeys', flip: true, riders: ([sx, sy]) => ravana(sx, sy, 9, { boilKey: 'crr', flip: true, noShadow: true, all: { eyes: 'narrow', mouth: 'smirk', lookX: -1 } }) });
    // Indra's chariot comes down from the sky at INDRA and lands by Ram
    const land = easeOut(seg(t, INDRA, INDRA + 1.2)), ix = lerp(-300, 120, land), iy = lerp(900, 1860, land);
    if (t > INDRA) { glow(ix + 60, iy - 200, 260, '#FFF0B0', .35); warChariot(ix, iy, 260, t, { key: 'cic', team: 'horses', run: land < 1 ? 1 : .2, riders: ([sx, sy]) => matali(sx, sy, 9, { boilKey: 'cm', eyes: 'happy', mouth: talk(t, MATALI, D0 - .3, 'smile') }) }); }
    const rx = t > INDRA + 1.2 ? 330 : 300;
    ram(rx, 1860, 17, { boilKey: 'cr', eyes: t > INDRA ? 'wide' : 'determined', mouth: t > INDRA ? 'O' : 'flat', lookX: t > INDRA && t < INDRA + 1.4 ? -.8 : .8, hx: .3, emote: t > INDRA + .2 && t < INDRA + 1.6 ? '!' : undefined, emoteK: 1, emoteAge: t - INDRA });
    camEnd();
    caps(t);
    wipeIn(lt, DUSKC);
    wipeOut(lt, dur, ['#FFC860', '#F7C08E']);
  }

  // ================= D · Agastya teaches the Aditya Hridayam; three times; new strength =================
  function shotHymn(t, lt, dur) {
    camBegin(540, 1400, 1.08);
    battlefield(t, 'd');
    const sk = ease(seg(t, D0 + 1.4, THRICE)), strong = t > STRONG;
    bigSun(560, 1020, 120 + 30 * sk, t, .3 + .7 * sk, 'dsun');
    // Agastya walks in, small and bright-eyed, and talks; Ram listens, palms joined, then chants three times
    const ain = easeOut(seg(t, D0, AGASTYA + .6));
    agastya(lerp(-120, 220, ain), 1850, 13, { boilKey: 'da', walk: ain < 1 ? t * 2.5 : undefined, eyes: 'happy', mouth: talk(t, AGASTYA + .6, THRICE - .3, 'smile'), lookX: .8, hx: .3, handR: t > AGASTYA + .6 && t < THRICE ? [6, -19] : undefined, bendR: .2 });
    const chant = t > THRICE && t < STRONG;
    ram(560, 1860, 19, { boilKey: 'dr', pray: strong ? 0 : 1, eyes: chant ? 'closed' : strong ? 'determined' : 'normal', mouth: chant ? talk(t, THRICE, STRONG, 'smile') : strong ? 'grin' : 'smile', lookX: -.8, hx: -.3,
      handR: strong ? [6.4, -20] : undefined, bendR: .2, puff: strong ? .5 : 0, emote: strong ? 'spark' : undefined, emoteK: 1, emoteAge: t - STRONG });
    if (chant) for (let k = 0; k < 3; k++) { const q = clamp((t - THRICE - k * .45) / 1.2); if (q > 0 && q < 1) { boilSeed('dch' + k); paint(starPts(560 + (k - 1) * 60, 1380 - q * 360, 18 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFE070', ink: null }); } }
    if (strong) glow(560, 1500, 300, '#FFE070', .4 * clamp((t - STRONG) * 3));
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= E · the heads grow back, again and again =================
  function shotHeads(t, lt, dur) {
    const z = ease(seg(t, HUNDRED - .4, HUNDRED + .4));
    camBegin(lerp(560, 600, z), 1420, lerp(1.0, 1.1, z));
    battlefield(t, 'e');
    // cuts cycle through the heads; after HUNDRED they fly off fast (one every .2 s)
    const cuts = {}; const ord = [4, 2, 7, 0, 9, 5, 3, 8];
    CUTS.forEach((c, k) => { if (t > c) cuts[ord[k]] = c; });
    if (t > HUNDRED) for (let i = 0; i < 10; i++) { const c = HUNDRED + .1 + ((i * 3) % 10) * .2 + Math.floor((t - HUNDRED - .1 - ((i * 3) % 10) * .2) / 2) * 2; if (t > c) cuts[i] = Math.max(cuts[i] ?? -9, c); }
    ravanaCut(t, cuts, { all: { eyes: 'narrow', mouth: 'smirk', emote: t > HUNDRED ? 'stars' : undefined } });
    // Ram shoots arrow after arrow (sweat by the end)
    const last = CUTS.filter(c => c < t + .3).pop(), draw = last != null && t < last ? ease(seg(t, last - .3, last - .05)) : t > HUNDRED ? .5 + .5 * Math.sin(t * 9) : 0;
    ram(250, 1860, 19, { boilKey: 'er', eyes: t > HUNDRED ? 'wide' : 'angry', brow: -.6, mouth: t > HUNDRED ? 'O' : 'flat', hx: -.5, lookX: -1, sweat: t > HUNDRED, ...bowPose(draw) });
    for (const c of CUTS) if (t > c - .25 && t < c) { const q = seg(t, c - .25, c); arrowAt(lerp(340, 700, q), lerp(1500, 1440, q), -.1, 140, 'ear' + c); }
    camEnd();
    caps(t);
  }

  // ================= F · Matali: "use the Brahmastra!" =================
  function shotMatali(t, lt, dur) {
    camBegin(400, 1480, 1.25);
    battlefield(t, 'f');
    warChariot(80, 1860, 300, t, { key: 'fic', team: 'horses', run: .2, riders: ([sx, sy]) => matali(sx, sy, 10, { boilKey: 'fm', eyes: 'normal', mouth: talk(t, F0 + .3, G0 - .4, 'smile'), handR: [6, -20], bendR: .2 }) });
    ram(520, 1860, 19, { boilKey: 'fr', eyes: t > F0 + 1.2 ? 'determined' : 'wide', mouth: 'flat', lookX: -.8, hx: -.3, emote: t > F0 + 1.2 ? 'bulb' : undefined, emoteK: 1, emoteAge: t - F0 - 1.2 });
    camEnd();
    caps(t);
    wipeIn(lt, DUSKC);
  }

  // ================= G · the Brahmastra strikes Ravana's heart; he falls; the arrow returns =================
  function shotArrow(t, lt, dur) {
    const sh = shakeXY(t, t > HEART && t < HEART + .5 ? 9 : 0);
    camBegin(560 + sh[0], 1420 + sh[1], 1.0);
    battlefield(t, 'g');
    const GX = 620;   // Ravana stands nearer here, so he falls back inside the frame
    const draw = ease(seg(t, G0 + .2, LOOSE - .1)), loosed = t > LOOSE;
    // Ravana: hit at HEART, wobbles, falls back at FELL; crowns tumble
    const fall = ease(seg(t, FELL - .4, FELL + .4)), hit = t > HEART;
    const hs = {}; if (fall > .3) for (let i = 0; i < 10; i++) hs[i] = { hat: 'none' };
    ravana(GX, RVY, RVU, { boilKey: 'gv', flip: true, rot: fall * 1.45, dy: fall * 1.5, noShadow: fall > .3, shake: hit && !fall ? .6 : 0, all: { eyes: fall > .2 ? 'closed' : hit ? 'wide' : 'angry', mouth: hit ? 'O' : 'teeth', brows: hit ? .6 : -.8 }, heads: hs });
    if (fall > .3) for (let i = 0; i < 4; i++) { const q = clamp((t - FELL + .1) / 1); if (q < 1) { boilSeed('gcr' + i); push(); translate(GX - 120 + i * 80 + q * 60 * (i - 1.5), RVY - 380 - Math.sin(q * Math.PI) * 200 + q * 340); rotate(q * 6 + i); paint([[-22, 10], [-26, -14], [-10, -4], [0, -22], [10, -4], [26, -14], [22, 10]], { wash: '#F2C24A', ink: P12.ink, sw: .8 }); pop(); } }
    if (hit && t < HEART + .3) { boilSeed('ghit'); paint(starPts(GX - 20, RVY - 14 * 13, 120 * backOut(seg(t, HEART, HEART + .15)), .45, 8), { wash: '#FFF2C0', ink: P12.ink, sw: 1 }); flash(.5 * (1 - seg(t, HEART, HEART + .3)), '#FFF6D0'); }
    // Ram draws the glowing Brahmastra; it flies; at BACK it streaks back to his quiver
    ram(250, 1860, 20, { boilKey: 'gr', eyes: t > FELL + .5 ? 'normal' : 'determined', mouth: 'flat', hx: -.5, lookX: -1, ...bowPose(loosed ? 0 : draw), kodanda: t > BACK + .4 });
    if (!loosed && draw > .2) { const [hx, hy] = naradaHand(250, 1860, 20, bowPose(draw), -1); glow(hx + 40, hy - 10, 150 + 30 * Math.sin(t * 12), '#FFE070', .7 * draw); glow(hx + 40, hy - 10, 60, '#FFFFFF', .6 * draw); }
    if (loosed && !hit) { const q = easeIn(seg(t, LOOSE, HEART)), x = lerp(360, GX - 20, q); glow(x, 1600, 150, '#FFE070', .9); boilSeed('gas'); inkLine([[x, 1600], [x - 200, 1610]], 10, '#FFF2B0', 'ink', 0); }
    if (t > BACK && t < BACK + .6) { const q = ease(seg(t, BACK, BACK + .6)), x = lerp(GX, 250, q), y = lerp(1500, 1460, q) - Math.sin(q * Math.PI) * 240; glow(x, y, 110, '#FFE070', .8); boilSeed('gbk'); inkLine([[x, y], [x + 120, y - 30 * Math.cos(q * Math.PI)]], 7, '#FFF2B0', 'ink', .3); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, ['#FFD45A', '#F4A6B8']);
  }

  // ================= H · the gods shower flowers; the army cheers =================
  function shotFlowers(t, lt, dur) {
    camBegin(540, 1420, 1.0);
    battlefield(t, 'h');
    glow(540, 600, 600, '#FFF0C0', .35);
    const hop = i => Math.abs(Math.sin(t * 6 + i)) * 1.2;
    vanara(80, 1880, 13, 2, { boilKey: 'hv1', eyes: 'happy', mouth: 'grin', dy: -hop(1), handL: [-6, -24], handR: [6, -24], bendL: .2, bendR: .2 });
    lakshman(230, 1870, 16, { boilKey: 'hl', eyes: 'happy', mouth: 'grin', lookX: .5, handR: [6, -21], bendR: .2 });
    ram(450, 1860, 19, { boilKey: 'hr', eyes: 'happy', mouth: 'smile', lookY: -.6, pray: 1, kodanda: true });
    hanuman(700, 1870, 17, { crown: false, gada: 1, boilKey: 'hh', eyes: 'happy', mouth: 'grin', dy: -hop(2), handL: [-6, -24], bendL: .2, tail: 'curl', emote: 'hearts', emoteK: 1, emoteAge: t - H0 });
    vanaraKing(900, 1880, 15, { boilKey: 'hs', eyes: 'happy', mouth: 'grin', dy: -hop(3), handL: [-6, -24], handR: [6, -24], bendL: .2, bendR: .2 });
    petals(t, clamp((t - H0) * 1.5), 'hpt', 46);
    camEnd();
    caps(t);
    wipeIn(lt, ['#FFD45A', '#F4A6B8']);
    wipeOut(lt, dur, SKYC);
  }

  // ================= I · home on the Pushpaka; then the coronation =================
  function shotHome(t, lt, dur) {
    camBegin(540, 1300, 1.0);
    skyRoute(t, 'i');
    const bob = Math.sin(t * 1.8) * 16;
    pushpaka(540, 1520 + bob, 760, t, { key: 'ipk', riders: ([x, y]) => {
      lakshman(x - 200, y - 50, 11, { boilKey: 'il', eyes: 'happy', mouth: 'smile', lookX: 1, noShadow: true });
      ram(x - 40, y - 50, 12, { boilKey: 'ir', eyes: 'happy', mouth: 'smile', lookX: .5, noShadow: true, handR: [6, -21 + Math.sin(t * 6)], bendR: .2 });
      sita(x + 100, y - 50, 11.5, { boilKey: 'is', eyes: 'happy', mouth: 'smile', lookX: -.5, noShadow: true });
      hanuman(x + 230, y - 50, 10.5, { crown: false, gada: 0, boilKey: 'ih', eyes: 'happy', mouth: 'grin', tail: 'curl', noShadow: true, pray: 1 });
    } });
    camEnd();
    caps(t);
    wipeIn(lt, SKYC);
    wipeOut(lt, dur, HALLC);
  }
  function shotKing(t, lt, dur) {
    camBegin(540, 1450, 1.15 + lt * .015);
    court(t, 'k');
    glow(540, 1350, 460, '#FFD070', .4);
    throne(540, 1560, 420, 'kth');
    ram(540, 1640, 15, { boilKey: 'kr', sit: 1, eyes: 'happy', mouth: 'smile', kodanda: false, mudra: 1, lookY: .2 });
    sita(760, 1720, 15, { boilKey: 'ks', eyes: 'happy', mouth: 'smile', lookX: -.6 });
    lakshman(320, 1720, 15, { boilKey: 'kl', eyes: 'happy', mouth: 'smile', lookX: .6 });
    hanuman(540, 1840, 12, { crown: false, gada: 0, boilKey: 'kh', eyes: 'closed', mouth: 'smile', pray: 1, bow: .4, tail: 'curl', emote: 'hearts', emoteK: 1, emoteAge: t - KING });
    if (t > CROWN) { glow(540, 1350, 200, '#FFF0B0', .5 * clamp((t - CROWN) * 3)); emote('spark', 640, 1150, 70, 1, t); }
    petals(t, clamp((t - KING - .4) * 1.2), 'kpt', 30);
    camEnd();
    caps(t);
    wipeIn(lt, HALLC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= J · the end: Jai Shri Ram =================
  function shotEnd(t, lt, dur) {
    camBegin(540, 1300 - lt * 6, 1.0 + lt * .015);
    sunburst(t, 'j', 1250);
    lakshman(250, 1880, 18, { boilKey: 'jl', eyes: 'happy', mouth: 'smile', lookX: .4 });
    ram(470, 1860, 21, { boilKey: 'jr', eyes: 'happy', mouth: 'smile', handR: [6.2, -19.6], bendR: .3, kodanda: true });
    sita(690, 1870, 19.5, { boilKey: 'js', eyes: 'happy', mouth: 'smile', lookX: -.4 });
    hanuman(880, 1890, 16, { crown: false, gada: 0, boilKey: 'jh', eyes: 'happy', mouth: 'grin', pray: 1, tail: 'curl', emote: 'hearts', emoteK: 1, emoteAge: t - J0 });
    camEnd();
    caps(t);
    wipeIn(lt, CARDC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the finale card =================
  function shotCard(t, lt) { followCard(t, lt, { finale: true, at: CARD, ask: 'Comment JAI SHRI RAM 🙏' }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotChariot], [D0, shotHymn], [E0, shotHeads], [F0, shotMatali], [G0, shotArrow], [H0, shotFlowers], [I0, shotHome], [KING, shotKing], [J0, shotEnd], [K0, shotCard]]);
})();
