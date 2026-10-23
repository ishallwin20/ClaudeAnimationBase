// rp8.js: Ramayan Part 8, "The Arrow from Behind a Tree" (67.2 s, Painted, no voice: captions in Bangers, retro cartoon
// SFX, a soft tanpura under the anklets and Vali's last words). Told from the Valmiki Ramayana, Kishkindha Kanda: by lake
// Pampa, Hanuman comes to Ram as a mendicant (3); Ram marvels that his speech has no flaw (3.28–32); Sugriva shows Ram
// the jewels Sita dropped (6); Lakshman knows only her anklets: he bowed at her feet every day (6.22–23); Vali had driven
// Sugriva out and taken his wife (8–10); at the first fight the brothers look so alike that Ram can't shoot, and Sugriva
// is beaten (12); he wears a garland of flowers and fights again (12); from behind a tree, Ram's arrow strikes Vali (16);
// dying, Vali asks whether that is dharma (17); Ram: you took your brother's wife; the land is Bharat's and I punish in
// his name (18); Vali accepts and entrusts Angad to Ram (18). The ask: was it fair? The Part 9 tease (Hanuman's leap)
// and the follow card.
// STORYBOARD.md has the plan and the sources; sets and cast in rp8_props.js, src/ramayan_sets.js, src/ramayan.js. Every
// time comes from src/scenes/rp8_tl.js (TL), which tools/rp8_sfx.mjs reads too.
(() => {
  const { B0, C0, D0, E0, F0, G0, H0, I0, J0, K0, FAIR0, HANU, AMAZED, JEWELS, EARR, ANK, BOWED, THROWN, WIFE, ALIKE, BEATEN, GARL, STRUCK, TOOK, BHARAT, ACCEPT, ANGAD,
    YESNO, LEAPS, CARD } = TL;
  window.RP8_T = TL;
  // a mouth that flaps while a character speaks a caption's line (a..b), else the resting one
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P8.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], LAKEC = [P8.lake, P1.grass], ROCKC = ['#E8A870', P8.dust], DUSKC = ['#E2865A', P8.sea];

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
  const bowPose = (draw, o = {}) => ({ flip: true, handL: [-7.6, -18], bendL: .3,   // flipped: the bow arm points screen right (callers turn the head with hx < 0, lookX < 0)
    handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, kodanda: false, armL: heldBow(draw), ...o });
  const bigTree = (x, y, h, key, t) => { tree(x, y, h, key, Math.sin(t * .7) * .1); boilSeed(key + 'trunk'); paint(ribbon([[x, y], [x + 4, y - h * .5], [x, y - h * .8]], h * .2, h * .14), { wash: P1.bark, fill: P1.barkDk, fillOp: 50, tex: .5, ink: P8.ink, sw: 1 }); };

  // ================= A · the hook: Ram behind a tree, bow drawn; "was it fair?" =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 10, 1 + lt * .012);
    kishkindha(t, 'ha');
    ram(300, 1880, 28, { boilKey: 'hr', eyes: 'angry', brow: -.6, mouth: 'flat', kodanda: true, hx: -.5, lookX: -1, ...bowPose(1) });
    bigTree(720, 1900, 1100, 'hat', t);
    if (t > FAIR0 - .2) { const q = backOut(clamp((t - FAIR0 + .2) * 3)); emote('?', 780, 1150, 90 * q, 1, t); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 8, 'THE ARROW FROM BEHIND A TREE'); wipeIn(lt, CARDC); wipeOut(lt, dur, LAKEC); }

  // ================= C · lake Pampa: Hanuman comes as a monk; Ram amazed by his speech =================
  function shotMeet(t, lt, dur) {
    const z = ease(seg(t, AMAZED - .3, AMAZED + .5));
    camBegin(lerp(560, 480, z), lerp(1420, 1440, z), lerp(1.05, 1.18, z));
    pampa(t, 'c');
    const am = t > AMAZED - .2;
    ram(300, 1840, 22, { boilKey: 'cr', eyes: am ? 'shine' : 'normal', mouth: am ? 'grin' : 'smile', lookX: .8, hx: .3, emote: am ? '!' : undefined, emoteK: 1, emoteAge: t - AMAZED });
    lakshman(120, 1830, 20, { boilKey: 'cl', eyes: am ? 'wide' : 'normal', mouth: am ? 'O' : 'flat', lookX: .8 });
    const inK = easeOut(seg(t, C0, HANU));
    hanuman(lerp(1200, 760, inK), 1840, 22, { boilKey: 'ch', crown: false, shawl: true, pal: { ...HNM, dhoti: '#E8862E', dhotiDk: '#B85E18', dhotiLt: '#FFB870', shawl: '#F2A23A', shawlDk: '#C87A1E' }, walk: inK < 1 ? t * 1.6 : undefined, pray: inK >= 1 ? 1 : 0, bow: inK >= 1 ? .3 : 0,
      eyes: 'happy', mouth: talk(t, HANU + .2, AMAZED + 1.6, 'smile'), blush: .4, lookX: -.8, hx: -.3, gada: 0, tail: 'droop' });
    if (am) notes(700, 1300, t, 'cnotes', GOLDC, 3);
    camEnd();
    caps(t);
    wipeIn(lt, LAKEC);
  }

  // ================= D · Sugriva shows the jewels; Lakshman knows only the anklets =================
  function shotJewels(t, lt, dur) {
    const c = kf(t, [[D0, [560, 1420, 1.05]], [EARR, [380, 1440, 1.25]], [ANK + .3, [330, 1460, 1.45]]], ease);
    camBegin(c[0], c[1], c[2]);
    pampa(t, 'd');
    vanaraKing(820, 1840, 21, { boilKey: 'ds', eyes: 'normal', mouth: talk(t, D0 + .3, JEWELS, 'smile'), lookX: -.8, hx: -.3, handR: t > JEWELS - .4 ? [-4.6, -15] : undefined, bendR: .4 });
    hanuman(1000, 1830, 18, { boilKey: 'dh', crown: false, gada: 0, eyes: t > JEWELS ? 'sad' : 'normal', mouth: 'smile', lookX: -.8 });
    const open = ease(seg(t, JEWELS - .3, JEWELS + .4));
    if (t > JEWELS - .5) bundle8(620, 1520, 160, open, 'dbd');
    ram(450, 1840, 22, { boilKey: 'dr', eyes: t > JEWELS ? 'cry' : 'normal', mouth: t > JEWELS ? 'wobble' : 'smile', lookX: .7, lookY: .5, hx: .3 });
    if (t > JEWELS) tears(...naradaEye(450, 1840, 22, { hx: .3 }, 1), t, 'drt', .8);
    const shy = t > EARR - .2 && t < ANK - .3, ank = t > ANK - .3;
    lakshman(230, 1830, 21, { boilKey: 'dl', eyes: ank ? 'cry' : shy ? 'closed' : 'normal', mouth: ank ? talk(t, ANK, BOWED + 1.2, 'wobble') : shy ? talk(t, EARR, EARR + 1.4, 'flat') : 'flat', blush: shy ? .7 : 0, hx: shy ? Math.sin(t * 9) * .4 : .2,
      lookX: ank ? .3 : .8, lookY: ank ? .6 : 0, handR: ank ? [5.4, -15] : undefined, handL: ank ? [-1, -15] : undefined, bendR: .4, bow: t > BOWED - .2 ? .3 : 0, emote: shy ? 'sweat' : undefined, emoteK: 1, emoteAge: t - EARR });
    if (ank) { const [hx, hy] = naradaHand(230, 1830, 21, { handR: [5.4, -15], bendR: .4 }, 1); anklet(hx + 10, hy - 30, 90 * backOut(clamp((t - ANK + .3) * 3)), 'dak'); tears(...naradaEye(230, 1830, 21, { hx: .2 }, 1), t, 'dlt', .8);
      if (t > ANK + .3) { boilSeed('dsp'); for (let i = 0; i < 4; i++) { const q = frac(t * 1.1 + i / 4); paint(starPts(hx + 10 + Math.cos(i * 1.7) * 70, hy - 30 - q * 80, 9 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFFFFF', ink: null }); } } }
    camEnd();
    caps(t);
    wipeOut(lt, dur, ROCKC);
  }

  // ================= E · Vali threw him out and took his wife =================
  function shotVali(t, lt, dur) {
    camBegin(540, 1400, 1.0);
    kishkindha(t, 'e');
    const shove = ease(seg(t, THROWN - .3, THROWN + .3)), fly = easeOut(seg(t, THROWN, THROWN + .9));
    vanaraKing(420, 1840, 22, { boilKey: 'ev', eyes: 'angry', brow: -.8, mouth: t < THROWN + .6 ? 'teeth' : 'smirk', handR: [lerp(4, 9, shove), -16], bendR: .3, lookX: 1, hx: .3, puff: .5, emote: t > THROWN ? 'anger' : undefined, emoteK: 1, emoteAge: t - THROWN });
    const sx = lerp(700, 1000, fly), sy = 1840 - Math.sin(fly * Math.PI) * 180 + fly * 20;
    vanaraKing(sx, sy, 20, { boilKey: 'es', eyes: fly > .05 ? 'swirl' : 'wide', mouth: 'O', rot: fly * 1.2, lookX: -1, sweat: true, flip: true, noShadow: fly > .05 && fly < .95, emote: fly > .9 ? 'stars' : undefined, emoteK: 1, emoteAge: t - THROWN - .9 });
    if (t > WIFE - .3) { const k = backOut(clamp((t - WIFE + .3) * 3)); parvati(220, 1830, 18 * k, { boilKey: 'eru', pal: { saree: '#5E9A6A', sareeDk: '#3E7A4A', skin: '#C89A6A', skinDk: '#9A704A', skinLt: '#E2B88A' }, col: '#C89A6A', dk: '#9A704A', lt: '#E2B88A', eyes: 'cry', mouth: 'frown', crown: false }); }
    camEnd();
    caps(t);
  }

  // ================= F · the first fight: too alike to shoot; Sugriva beaten; the garland; they fight again =================
  function shotFight(t, lt, dur) {
    const sh = shakeXY(t, 4);
    camBegin(560 + sh[0], 1420 + sh[1], 1.0);
    kishkindha(t, 'f');
    const g = t > GARL + .2, out = t > BEATEN && t < GARL + .2, ok = easeOut(seg(t, BEATEN, BEATEN + .6));
    // the two wrestle in a dust cloud in the middle; they swap sides as they tumble
    const sw = Math.sin(t * 3), ax = 720 + sw * 70, bx = 720 - sw * 70;
    if (!out) { boilSeed('fdust'); for (let i = 0; i < 6; i++) { const a = t * 3 + i, r = 160 + 30 * Math.sin(t * 5 + i); paint(ellPts(720 + Math.cos(a) * r, 1780 + Math.sin(a) * r * .3, 90, 50, 12), { wash: P8.dust, washOp: 170, ink: null }); } }
    vanaraKing(out ? 700 : ax, 1840, 19, { boilKey: 'fv', flip: out ? true : sw < 0, eyes: out ? 'smug' : 'angry', mouth: out ? 'smirk' : 'teeth', handR: [8, -17 + Math.sin(t * 9) * 2], bendR: .3, lean: out ? 0 : 1.2 });
    if (out) vanaraKing(lerp(bx, 1000, ok), 1840, 19, { boilKey: 'fs', flip: false, eyes: 'swirl', mouth: 'wobble', rot: .15 * Math.sin(t * 5), emote: 'stars', emoteK: 1, emoteAge: t - BEATEN });
    else vanaraKing(bx, 1840, 19, { boilKey: 'fs', flip: sw >= 0, eyes: 'angry', mouth: 'teeth', handR: [8, -16 + Math.cos(t * 9) * 2], bendR: .3, lean: 1.2, garland: g ? 1 : 0 });
    if (t > GARL - .1 && t < GARL + .5) { const q = seg(t, GARL - .1, GARL + .5); boilSeed('fgsp'); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; paint(starPts(bx + Math.cos(a) * 120 * q, 1500 + Math.sin(a) * 80 * q, 14 * (1 - q), .4, 4), { wash: '#FFF6DA', ink: null }); } }
    // Ram behind a tree on the left, bow drawn, unsure; "?" ; then the garland pops on
    // he draws as they fight, eases off when he can't tell them apart, and draws again once the garland is on
    const fdraw = t < ALIKE ? ease(seg(t, F0 + .2, F0 + 1.2)) : t < GARL + .2 ? lerp(1, .35, ease(seg(t, ALIKE, ALIKE + .5))) : lerp(.35, 1, ease(seg(t, GARL + .2, GARL + 1)));
    ram(150, 1860, 20, { boilKey: 'fr', eyes: t > ALIKE && !g ? 'wide' : 'angry', mouth: 'flat', kodanda: true, hx: -.5, lookX: -1, ...bowPose(fdraw), emote: t > ALIKE && t < GARL ? '?' : undefined, emoteK: 1, emoteAge: t - ALIKE });
    bigTree(430, 1880, 900, 'ft', t);
    camEnd();
    caps(t);
    wipeOut(lt, dur, ROCKC);
  }

  // ================= G · from behind a tree, Ram's arrow strikes Vali =================
  function shotArrow(t, lt, dur) {
    const hit = t > STRUCK - .1, sh = shakeXY(t, hit && t < STRUCK + .5 ? 8 : 0);
    camBegin(560 + sh[0], 1420 + sh[1], 1.0);
    kishkindha(t, 'g');
    const fall = ease(seg(t, STRUCK, STRUCK + .6));
    vanaraKing(680, 1840, 20, { boilKey: 'gv', eyes: hit ? 'wide' : 'angry', mouth: hit ? 'O' : 'teeth', rot: -fall * 1.45, dy: fall * 2, flip: true, noShadow: fall > .5 });
    vanaraKing(880, 1840, 19, { boilKey: 'gs', garland: 1, eyes: hit ? 'wide' : 'angry', mouth: hit ? 'O' : 'teeth', flip: true, emote: hit ? '!!' : undefined, emoteK: 1, emoteAge: t - STRUCK });
    const draw = ease(seg(t, G0 + .3, STRUCK - .3));
    ram(150, 1860, 21, { boilKey: 'gr', eyes: 'angry', brow: -.6, mouth: 'flat', kodanda: true, hx: -.5, lookX: -1, ...bowPose(t > STRUCK - .3 ? 0 : draw) });
    bigTree(400, 1880, 900, 'gt', t);
    if (t > STRUCK - .3 && t < STRUCK) { const q = easeIn(seg(t, STRUCK - .3, STRUCK)); arrowAt(lerp(470, 600, q), lerp(1480, 1500, q), .15, 160, 'garr'); }
    if (hit && t < STRUCK + .25) { boilSeed('ghit'); paint(starPts(670, 1510, 90 * backOut(seg(t, STRUCK - .1, STRUCK)), .45, 8), { wash: '#FFF2C0', ink: P8.ink, sw: 1 }); }
    camEnd();
    caps(t);
  }

  // ================= H · "is that dharma?"; Ram's answer; Vali accepts and entrusts Angad =================
  const VL = [330, 1800, 575, 1785];   // Vali lying in H: his feet x, y; the arrow in his chest x, y
  function shotDharma(t, lt, dur) {
    const c = kf(t, [[H0, [520, 1500, 1.0]], [TOOK - .3, [520, 1500, 1.0]], [BHARAT, [480, 1470, .98]], [ACCEPT, [540, 1500, 1.0]]], ease);
    camBegin(c[0], c[1], c[2]);
    kishkindha(t, 'h');
    const acc = t > ACCEPT - .2;
    // Ram stands on the left; Vali lies in front of him on the ground, feet towards Ram, head to the right, looking up at him
    ram(170, 1840, 22, { boilKey: 'hr', eyes: 'normal', mouth: talk(t, TOOK, ACCEPT - .3, 'flat'), lookX: .8, lookY: .5, hx: .3, kodanda: true, handR: t > BHARAT - .3 && t < ACCEPT ? [7.5, -17] : undefined, bendR: .4 });
    vanaraKing(VL[0], VL[1], 16, { boilKey: 'hv', rot: Math.PI / 2 * .95, noShadow: true, lookY: .8, eyes: acc ? 'happy' : 'angry', mouth: t < TOOK ? talk(t, H0 + .3, TOOK - .2, 'frown') : acc ? talk(t, ACCEPT, ANGAD + .4, 'smile') : 'flat', brow: acc ? .4 : -.6 });
    arrowAt(VL[2], VL[3], 1.3, 150, 'hstuck');
    if (t > BHARAT - .3 && t < ACCEPT) { const q = backOut(clamp((t - BHARAT + .3) * 3)), bx = 440, by = 1330; boilSeed('hbub'); paint(ellPts(bx, by, 170 * q, 130 * q, 22, 3), { wash: '#F6ECDA', ink: P8.ink, sw: 1, curv: .8 }); if (q > .5) ram(bx, by + 110, 6.5 * q, { boilKey: 'hbh', pal: { skin: '#E8B48A', skinDk: '#C68A60', skinLt: '#FAD2AE' }, kodanda: false, mouth: 'smile' }); }
    const ax = lerp(1180, 960, ease(seg(t, ANGAD - .6, ANGAD)));
    if (t > ANGAD - .6) angad(ax, 1840, 15, { boilKey: 'ha', eyes: 'cry', mouth: 'wobble', lookX: -.8, flip: true, walk: t < ANGAD ? t * 2 : undefined });
    if (t > ANGAD) tears(...naradaEye(ax, 1840, 15, { flip: true }, 1), t, 'hat', .6);
    camEnd();
    caps(t);
    wipeOut(lt, dur, [P8.cream, '#E8B84A']);
  }

  // ================= I · the ask: was it fair? =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1350, 1.0);
    boilSeed('ibg'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#F6E2C0', ink: null });
    paint(ellPts(540, 1250, 700, 700, 26), { fill: '#FFF2DA', fillOp: 220, bleed: .3, tex: .4, ink: null });
    scales(540, 1700, 520, Math.sin(t * 2.4), 'isc');
    camEnd();
    if (t > YESNO - .2) { const k = clamp((t - YESNO + .2) * 4); const a = .3 * Math.sin(t * 2.4); letter('YES', 540 - Math.cos(a) * 286, 1700 - 520 - Math.sin(a) * 286 + 210, 64, '#2E7A3A', { screen: true, ink: false, pop: k, stroke: '#FFF5E2', sw: .2 }); letter('NO', 540 + Math.cos(a) * 286, 1700 - 520 + Math.sin(a) * 286 + 210, 64, '#C8283A', { screen: true, ink: false, pop: k, stroke: '#FFF5E2', sw: .2 }); }
    caps(t);
    wipeIn(lt, [P8.cream, '#E8B84A']);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= J · the tease: Hanuman crouches on the sea cliff, ready to leap =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1150, 1.0 + lt * .02);
    oceanCliff(t, 'j');
    // the cliff ledge he stands on (oceanCliff's big curved polygon loses its fill: a rectangle with a drawn edge)
    boilSeed('jledge'); paint(rectPts(-300, 1515, 860, 1300), { wash: P8.cliff, fill: P8.cliffDk, fillOp: 60, tex: .5, ink: null });
    inkLine([[-300, 1512], [100, 1505], [420, 1520], [560, 1540], [560, 2800]], 1, P8.ink, 'ink', .4);
    const crouch = ease(seg(t, LEAPS - .4, LEAPS + .3));
    if (crouch > .5) glow(330, 1250, 300, '#FFE070', .35 * crouch);
    hanuman(330, 1520, 24, { boilKey: 'jh', crown: false, gada: 0, eyes: 'determined', mouth: crouch > .5 ? 'grin' : 'flat', lookX: 1, hx: .4, sq: .12 * crouch, lean: 1.5 * crouch, tail: 'curl', handL: [-4, -10], handR: [4, -10], emote: crouch > .9 ? 'spark' : undefined, emoteK: 1, emoteAge: t - LEAPS - .3 });
    camEnd();
    caps(t);
    wipeIn(lt, DUSKC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 9, title: "HANUMAN'S LEAP", at: CARD, ask: 'Fair? Comment YES or NO 👇' }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotMeet], [D0, shotJewels], [E0, shotVali], [F0, shotFight], [G0, shotArrow], [H0, shotDharma], [I0, shotAsk], [J0, shotTease], [K0, shotCard]]);
})();
