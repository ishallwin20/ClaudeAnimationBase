// rp5.js: Ramayan Part 5, "One Man, 14,000 Demons" (69.7 s, Painted, no voice: captions in Bangers, retro cartoon SFX,
// a soft tanpura under the hug). Told from the Valmiki Ramayana, Aranya Kanda: at Panchavati Surpanakha sees Ram and
// wants him (17); Ram, married, sends her to Lakshman, who sends her back (18); she lunges at Sita and Lakshman cuts off
// her nose and ears (18); she runs to her brother Khara, who sends fourteen rakshasas, and Ram's arrows finish them
// (19–20); Khara comes with fourteen thousand (22–23); Ram sends Sita and Lakshman to a cave and faces them alone (24);
// Dushana, Trishira and at last Khara fall (26–30); in one and a half muhurtas (30.30); Sita comes out and embraces him
// (30.39); Akampana escapes and runs to Ravana (31). The Part 6 tease (Ravana's plan, the golden deer) and the card.
// STORYBOARD.md has the plan and the sources; sets in rp5_props.js and src/ramayan_sets.js; Surpanakha and the deer in
// src/ramayan.js; Khara is asura() (src/asuras.js). Every time comes from src/scenes/rp5_tl.js (TL), which
// tools/rp5_sfx.mjs reads too.
(() => {
  const { B0, C0, D0, E0, F0, G0, H0, I0, K0, ALONE0, WALKIN, MARRIED, BROTHER, SENT, LUNGED, CUT, KHARA, FOURTEEN, FINISHED, ARMY, CAVE, FACED,
    RAIN, DUSH, TRISH, LASTK, HUGGED, RAVANA, DEER, CARD } = TL;
  window.RP5_T = TL;
  // a mouth that flaps while a character speaks a caption's line (a..b), else the resting one
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P5.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], DAYC = [P1.skyHi, P1.earth], DUSKC = [P5.duskHi, P5.duskLo], NIGHTC = [P1.nightHi, P1.nightLo];

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
  const bowPose = (draw, o = {}) => ({ flip: true, handL: [-7.6, -18], bendL: .3,   // flipped: the bow arm points screen right (callers turn the head with hx < 0, lookX < 0)
    handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, kodanda: false, armL: heldBow(draw), ...o });
  const KHARA_O = { kind: 'nishumbha', pal: { skin: '#6A4A8A', skinDk: '#4A2E6A', skinLt: '#8E6EAE' } };

  // ================= A · the hook: Ram, bow drawn, against the horde =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1300 - lt * 10, 1 + lt * .012);
    duskField(t, 'ha');
    horde(t, 'hah', 0, 40, 460);
    const draw = ease(seg(t, -1, ALONE0 - .2));
    ram(260, 1880, 30, { boilKey: 'hr', eyes: 'angry', brow: -.7, mouth: 'flat', kodanda: true, hx: -.5, lookX: -1, ...bowPose(draw) });
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 5, 'ONE MAN, 14,000 DEMONS'); wipeIn(lt, CARDC); wipeOut(lt, dur, DAYC); }

  // ================= C · Panchavati: Surpanakha; "I am married"; sent back; she lunges; Lakshman's sword =================
  function shotPanch(t, lt, dur) {
    const c = kf(t, [[C0, [540, 1350, 1.0]], [LUNGED - .3, [540, 1350, 1.0]], [CUT, [500, 1380, 1.12]], [D0, [520, 1380, 1.05]]], ease);
    const sh = shakeXY(t, t > CUT && t < CUT + .4 ? 8 : 0);
    camBegin(c[0] + sh[0], c[1] + sh[1], c[2]);
    ashram(t, 'c');
    // where she goes: first to Ram (the middle), then to Lakshman (the right), sent back, then lunges at Sita (the left)
    const sxAt = t => kf(t, [[C0, 1350], [WALKIN, 760], [BROTHER - .2, 760], [BROTHER + .4, 930], [SENT + .3, 930], [SENT + .8, 700], [LUNGED - .3, 640], [LUNGED + .2, 330], [CUT + .3, 330], [D0, 1350]], ease), sx = sxAt(t);
    const lunge = t > LUNGED - .3 && t < CUT + .2, hurt = t > CUT + .1, flee = t > CUT + .6;
    const SWOON = C0 + .9, swooned = t > SWOON && t < BROTHER;
    sita(170, 1800, 20, { boilKey: 'cs', eyes: lunge || hurt ? 'wide' : 'normal', mouth: lunge ? 'O' : 'smile', lookX: .8, hx: .3, handL: lunge ? [-2.4, -21] : undefined, handR: lunge ? [2.4, -21] : undefined, bendL: 1, bendR: 1 });
    ram(450, 1810, 21, { boilKey: 'cr', eyes: t > MARRIED - .3 && t < BROTHER + .4 ? 'happy' : 'normal', mouth: talk(t, MARRIED + .3, MARRIED + 2.2, 'smile'), handR: t > BROTHER - .4 && t < BROTHER + .6 ? [8, -17] : undefined, bendR: .4, lookX: .6, hx: .2 });
    const sword = ease(seg(t, CUT - .3, CUT)) * (1 - ease(seg(t, CUT + .5, CUT + 1)));
    lakshman(lunge || hurt ? lerp(980, 520, ease(seg(t, LUNGED, CUT - .2))) : 980, 1820, 21, { boilKey: 'cl', flip: true, eyes: t > SENT - .2 && t < SENT + 1.4 ? 'happy' : lunge ? 'angry' : 'normal', mouth: t > SENT - .2 && t < SENT + 1.4 ? talk(t, SENT, SENT + 1.3, 'grin') : lunge ? 'open' : 'smile', brow: lunge ? -.8 : 0,
      handR: sword > 0 ? [lerp(4, 7.5, sword), lerp(-14, -22, sword)] : t > SENT - .3 && t < SENT + .5 ? [7.4, -16] : undefined, bendR: .4, armR: sword > 0 ? (u, sw) => { push(); rotate(lerp(-.6, 1.6, sword)); khadga(u * 1.8, sw); pop(); } : undefined });
    if (t > CUT - .05 && t < CUT + .25) { boilSeed('cslash'); const k = seg(t, CUT - .05, CUT + .25); inkLine([[260, 1300 - k * 80], [520, 1180 + k * 60]], 6 * (1 - k), '#FFF2C0', 'ink', .3); }
    surpanakha(sx, 1800, 21, { boilKey: 'csp', flip: sx > 700 && t < SENT + .3 ? false : true, walk: Math.abs(sx - sxAt(t + .05)) > 1 ? t * 2 : undefined,
      eyes: swooned ? 'heart' : lunge ? 'angry' : 'normal', mouth: swooned ? 'grin' : lunge ? 'teeth' : 'smile', hurt: hurt ? 1 : 0, lookX: -.7, hx: -.3,
      handR: lunge && !hurt ? [8, -18] : undefined, handL: lunge && !hurt ? [-6, -19] : undefined, bendR: .3, emote: swooned ? 'hearts' : hurt ? '!!' : undefined, emoteK: 1, emoteAge: t - SWOON });
    camEnd();
    caps(t);
    wipeIn(lt, DAYC);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= D · Khara: she runs screaming to him; he sends fourteen; Ram finishes them =================
  function shotKhara(t, lt, dur) {
    camBegin(540, 1350, 1.0);
    duskField(t, 'd');
    const roar = t > KHARA - .2 && t < FOURTEEN;
    asura(700, 1820, 22, { ...KHARA_O, boilKey: 'dk', eyes: 'angry', mouth: roar ? 'roar' : talk(t, FOURTEEN - .1, FOURTEEN + 1, 'laugh', 'roar'), handR: t > FOURTEEN - .2 ? [6, -20] : undefined });
    surpanakha(330, 1820, 19, { boilKey: 'dsp', hurt: 1, flip: false });
    // fourteen little demons charge left; then arrows; they topple
    if (t > FOURTEEN - .2) {
      const run = seg(t, FOURTEEN, FINISHED), downK = seg(t, FINISHED - .6, FINISHED + .2);
      for (let i = 0; i < 14; i++) { const x = lerp(900, 80, run) + (i % 7) * 60 - 200, y = 1560 + Math.floor(i / 7) * 60, dn = downK * 14 > i; raktabija(x, y, 5, { boilKey: 'dfd' + i, lod: 1, rot: dn ? 1.4 : 0, eyes: dn ? 'x' : 'angry' }); }
      if (t > FINISHED - .8 && t < FINISHED + .3) arrowRain(t, -200, 1400, 8, 'dar');
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= E · Khara comes with 14,000; Ram sends Sita and Lakshman into the cave and faces them alone =================
  function shotArmy(t, lt, dur) {
    const c = kf(t, [[E0, [700, 1300, .85]], [CAVE - .9, [700, 1300, .85]], [CAVE - .5, [450, 1380, 1.0]], [FACED, [380, 1400, 1.1]]], ease);
    camBegin(c[0], c[1], c[2]);
    duskField(t, 'e');
    caveMouth(150, 1560, 520, 'ecave');
    const march = ease(seg(t, E0, CAVE - .6));
    horde(t, 'eh', 0, 48, lerp(1300, 560, march));
    asura(lerp(1500, 900, march), 1700, 18, { ...KHARA_O, boilKey: 'ek', eyes: 'angry', mouth: 'roar', walk: march < 1 ? t * 1.6 : undefined });
    // Sita and Lakshman go into the cave; Ram steps forward with his bow
    const inK = ease(seg(t, CAVE + .3, CAVE + 1.5));
    if (inK < .98) { sita(lerp(330, 150, inK), 1800 - inK * 220, 18 * (1 - inK * .5), { boilKey: 'es', eyes: 'wide', mouth: 'O', flip: true }); lakshman(lerp(420, 180, inK), 1810 - inK * 220, 19 * (1 - inK * .5), { boilKey: 'el', flip: true, eyes: 'normal', mouth: 'flat' }); }
    const step = ease(seg(t, CAVE + 1, FACED));
    ram(lerp(380, 460, step), 1840, 24, { boilKey: 'er', eyes: t > FACED - .2 ? 'angry' : 'normal', brow: -.6, mouth: talk(t, CAVE, CAVE + 1, 'flat'), kodanda: true, hx: -.4, lookX: -1, ...bowPose(ease(seg(t, FACED - .4, FACED + .2))) });
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= F · the battle: arrows like rain; the counter runs down; Dushana, Trishira, Khara fall; 72 minutes =================
  function shotFight(t, lt, dur) {
    const sh = shakeXY(t, t > DUSH && t < LASTK + .5 ? 4 : 0);
    camBegin(560 + sh[0], 1350 + sh[1], .95);
    const k = clamp(seg(t, RAIN - .8, LASTK + .3));
    duskField(t, 'f', seg(t, F0, G0));
    horde(t, 'fh', k, 48, 480);
    // the three generals in front of their army, falling in turn
    const gens = [[DUSH, 'chanda', 640], [TRISH, 'dhumra', 760], [LASTK, 'nishumbha', 880]];
    gens.forEach(([tf, kind, x], i) => { const dn = ease(seg(t, tf - .1, tf + .4)); asura(x, 1720, 15, { ...(kind === 'nishumbha' ? KHARA_O : { kind }), boilKey: 'fg' + i, eyes: dn > .5 ? 'swirl' : 'angry', mouth: dn > .5 ? 'O' : 'roar', rot: dn * 1.4, dy: dn * 1.5 }); });
    const done = t > LASTK + .5, draw = done ? 0 : .5 + .5 * Math.sin(t * 8);   // he stops firing once Khara falls
    ram(240, 1850, 25, { boilKey: 'fr', eyes: done ? 'normal' : 'angry', brow: done ? -.2 : -.7, mouth: 'flat', kodanda: true, hx: -.5, lookX: -1, ...bowPose(draw) });
    if (t < LASTK + .3) arrowRain(t, 380, 1380, 12, 'far');
    camEnd();
    // the counter
    const n = Math.max(0, Math.round(14000 * (1 - k) / 10) * 10);
    counter(n, 560, 1440, clamp((t - RAIN + 1) * 3));
    caps(t);
    wipeIn(lt, DUSKC);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= G · Sita runs out and hugs him =================
  function shotHug(t, lt, dur) {
    camBegin(540, 1400, 1.05 + lt * .02);
    duskField(t, 'g', 1);
    caveMouth(150, 1560, 520, 'gcave');
    horde(t, 'gh', 1, 24, 640);
    const run = easeOut(seg(t, G0, HUGGED));
    ram(560, 1840, 24, { boilKey: 'gr', eyes: t > HUGGED ? 'happy' : 'normal', mouth: 'smile', kodanda: true, lookX: -.6, hx: -.3, handL: t > HUGGED ? [-3.6, -16] : undefined });
    sita(lerp(180, 420, run), 1840 - (1 - run) * 120, 22, { boilKey: 'gs', walk: run < 1 ? t * 2.4 : undefined, eyes: 'happy', mouth: 'grin', lookX: .6, handR: t > HUGGED - .2 ? [6, -16] : undefined, bendR: .5, emote: t > HUGGED ? 'hearts' : undefined, emoteK: 1, emoteAge: t - HUGGED });
    lakshman(lerp(160, 260, run), 1830 - (1 - run) * 120, 21, { boilKey: 'gl', eyes: 'happy', mouth: 'grin', walk: run < 1 ? t * 2.2 : undefined });
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= H · but one demon escaped, and ran to Ravana =================
  function shotEscape(t, lt, dur) {
    camBegin(540, 1350, 1.0);
    duskField(t, 'h', 1);
    boilSeed('hlanka'); for (let i = 0; i < 6; i++) { const x = 760 + i * 50, h = 80 + 90 * hash(i * 4.7); paint([[x - 18, 1420], [x - 18, 1420 - h], [x, 1420 - h - 40], [x + 18, 1420 - h], [x + 18, 1420]], { wash: '#B8862E', ink: P5.ink, sw: .7, curv: .1 }); }
    glow(880, 1330, 160, '#FFD070', .4);
    const run = seg(t, H0, I0), x = lerp(150, 760, run);
    asura(x, lerp(1820, 1480, run), lerp(16, 6, run), { kind: 'messenger', boilKey: 'ha', walk: t * 2.6, eyes: 'scared', mouth: 'O', sweat: true, lean: 1 });
    if (t > RAVANA - .2) { const q = backOut(clamp((t - RAVANA + .2) * 3)); ravanaLoneHead(840, 1290, 120 * q, 4, { eyes: 'angry', mouth: talk(t, RAVANA + .2, RAVANA + 1.2, 'teeth') }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= I · the tease: Ravana's plan, a golden deer =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1350, 1.0 + lt * .02);
    boilSeed('isky'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#1E3A2A', ink: null });
    paint(ellPts(540, 1300, 900, 600, 24), { fill: '#3E6A48', fillOp: 200, bleed: .3, tex: .4, ink: null });
    for (const [x, h, k] of [[40, 900, 'a'], [1060, 1000, 'b']]) tree(x, 1600, h, 'i' + k, Math.sin(t * .6) * .2);
    boilSeed('igr'); paint(rectPts(-400, 1580, W + 800, 1200), { wash: '#2E4A30', ink: null });
    const appear = ease(seg(t, DEER - .8, DEER));
    goldenDeer(lerp(1300, 600, appear), 1720, 300, { key: 'ideer', walk: appear < 1 ? t * 1.5 : undefined, glow: appear, look: t > DEER + .4 ? 'back' : undefined });
    camEnd();
    caps(t);
    wipeIn(lt, NIGHTC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= K · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 6, title: 'THE GOLDEN DEER', at: CARD }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotPanch], [D0, shotKhara], [E0, shotArmy], [F0, shotFight], [G0, shotHug], [H0, shotEscape], [I0, shotTease], [K0, shotCard]]);
})();
