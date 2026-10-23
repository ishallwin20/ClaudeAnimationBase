// rp4.js: Ramayan Part 4, "The Crow and the Grass" (~70 s, Painted, an English voiceover with captions in Bangers,
// SFX). Told from the Valmiki Ramayana, Sundara Kanda 38, where Sita tells it to Hanuman as a token only Ram would know:
// at Chitrakoot, by the water, a crow (Indra's son) pecks at Sita; she throws a clod of earth; it comes back and claws
// her till she bleeds; Ram wakes, takes up a blade of kusha grass and charges it with the Brahma-astra; the crow flees
// through the three worlds; his father, the gods and the sages give him no refuge; he falls at Ram's feet; the astra
// cannot be in vain, so he gives up his right eye and is spared. Sita then asks: for a crow, a Brahmastra; why not for
// the one who took me? The Part 5 tease (one man against fourteen thousand) and the follow card.
// STORYBOARD.md has the plan and the sources; sets in rp4_props.js, src/ramayan_sets.js; the crow is shaniCrow().
// Every time comes from the voice (src/scenes/rp4_vo.js from tools/rp4_vo.json); tools/rp4_sfx.mjs recomputes them.
(() => {
  const LN = VO.lines, capOf = id => VO.caps.filter(c => c.id === id), Wd = (id, ci, wi) => capOf(id)[ci].at[wi];
  const mid = (a, b) => (LN[a].end + LN[b].a) / 2;
  const B0 = mid('hook', 'intro'), C0 = mid('intro', 'rest'), D0 = mid('wake', 'grass'), E0 = mid('grass', 'flee'), F0 = mid('flee', 'back'), G0 = mid('eye', 'twist');
  const H0 = mid('why', 'next'), K0 = mid('next', 'follow'), END = LN.follow.end + 2.5;
  const CROWH = Wd('hook', 0, 7), PECK = Wd('peck', 0, 3), CLOD = Wd('peck', 0, 9), CAME = Wd('peck', 1, 1), CLAW = Wd('peck', 1, 4), BLED = Wd('peck', 1, 8);
  const WOKE = Wd('wake', 0, 1), BLOOD = Wd('wake', 0, 5), INDRAS = Wd('wake', 1, 7);
  const PICK = Wd('grass', 0, 1), BLADE = Wd('grass', 0, 4), BRAHM = Wd('grass', 0, 12), FLED = Wd('flee', 0, 2), WORLDS = Wd('flee', 0, 6);
  const FATHER = Wd('flee', 1, 1), GODS = Wd('flee', 1, 4), SAGES = Wd('flee', 1, 6), NOONE = Wd('flee', 1, 7), FEET = Wd('back', 0, 7);
  const WASTED = Wd('eye', 0, 5), RIGHT = Wd('eye', 1, 6), SPARED = Wd('eye', 1, 10), LANKA = Wd('twist', 0, 3), HANU = Wd('twist', 0, 6), ONLY = Wd('twist', 1, 2);
  const ASKED = Wd('why', 0, 2), WHYNOT = Wd('why', 1, 0), TOOK = Wd('why', 1, 6), FOURTEEN = Wd('next', 0, 6);
  const CARD = { head: K0 + .1, title: K0 + .5, pill: LN.follow.a + .2, ask: Wd('follow', 1, 1), books: Wd('follow', 1, 2) + .6 };
  window.RP4_T = { B0, C0, D0, E0, F0, G0, H0, K0, END, CROWH, PECK, CLOD, CAME, CLAW, BLED, WOKE, BLOOD, INDRAS, PICK, BLADE, BRAHM, FLED, WORLDS, FATHER, GODS, SAGES, NOONE, FEET,
    WASTED, RIGHT, SPARED, LANKA, HANU, ONLY, ASKED, WHYNOT, TOOK, FOURTEEN, CARD };

  const GOLDC = P4.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], DAYC = [P4.skyHi, P4.grass], GOLDW = ['#FFE2A0', '#F5C542'], NIGHTC = [P4.grove, P4.groveLo], DUSKC = ['#E2865A', '#7A2236'];

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
  const sita = (x, y, u, o) => parvati(x, y, u, { pal: SITA_PAL, ...SITA_SKIN, ...o });
  // a tiny gold crown floating over the crow's head: Indra's son
  const crowCrown = (x, y, s, k) => { if (k <= 0) return; boilSeed('ccr'); push(); translate(x, y); scale(k); paint([[-s * .5, s * .3], [-s * .5, -s * .1], [-s * .25, s * .08], [0, -s * .35], [s * .25, s * .08], [s * .5, -s * .1], [s * .5, s * .3]], { wash: GOLDC, ink: P4.ink, sw: .8 }); pop(); glow(x, y, s * 1.6 * k, '#FFE070', .4); };

  // ================= A · the hook: Ram holds up a blazing blade of grass; a crow flaps away =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1220 - lt * 10, 1 + lt * .012);
    warmBack(t, 'ha', 600, 1100);
    const [hx, hy] = naradaHand(420, 2000, 34, { handR: [6.6, -24.5], bendR: .4 }, 1);
    glow(hx + 30, hy - 150, 300, '#FFE070', .5);
    ram(420, 2000, 34, { boilKey: 'hr', eyes: 'angry', brow: -.7, mouth: 'flat', handR: [6.6, -24.5], bendR: .4, lookX: .6, lookY: -.6, hx: .3 });
    grassStar(hx + 14, hy - 120, -Math.PI / 2 + .2, 260, 'hgs', 0);
    if (t > CROWH - .3) { const k = seg(t, CROWH - .3, B0 + .3); shaniCrow(lerp(820, 1250, k), lerp(1050, 760, k), 18, { boilKey: 'hc', flap: Math.sin(t * 20), fly: 1, eyes: 'wide' }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 4, 'THE CROW AND THE GRASS'); wipeIn(lt, CARDC); wipeOut(lt, dur, DAYC); }

  // ================= C · Chitrakoot: the crow pecks, comes back, claws; Ram wakes; Indra's son =================
  function shotCrow(t, lt, dur) {
    const c = kf(t, [[C0, [540, 1350, 1.0]], [PECK - .3, [480, 1420, 1.15]], [WOKE - .2, [500, 1420, 1.15]], [INDRAS - .3, [600, 1350, 1.05]]], ease);
    camBegin(c[0], c[1], c[2]);
    chitrakoot(t, 'c');
    // the crow: swoops in, pecks (bobbing at her), flies up when the clod comes, returns and claws; then caught in the light
    const peckOn = t > PECK - .5 && t < CLOD + .1, flee1 = seg(t, CLOD + .1, CAME), back = t > CAME - .1 && t < BLOOD;
    let cx = 1300, cy = 700, flap = Math.sin(t * 18), fly = 1, ceyes = 'normal';
    if (t < PECK - .5) { const k = ease(seg(t, C0 + 1, PECK - .5)); [cx, cy] = arcPt([1350, 500], [560, 1330], 100, k); }
    else if (peckOn) { cx = 560 + Math.sin(t * 9) * 14; cy = 1330 + Math.abs(Math.sin(t * 9)) * 16; flap = Math.sin(t * 9) * .4; }
    else if (t < CAME) { [cx, cy] = arcPt([560, 1330], [900, 750], -40, flee1); ceyes = 'wide'; }
    else if (back) { const k = ease(seg(t, CAME - .1, CAME + .4)); cx = lerp(900, 520, k) + Math.sin(t * 12) * 18; cy = lerp(750, 1290, k); flap = Math.sin(t * 22); ceyes = 'normal'; }
    else { const k = ease(seg(t, BLOOD, INDRAS)); cx = lerp(520, 820, k); cy = lerp(1290, 1250, k) - Math.sin(t * 3) * 20; ceyes = 'wide'; }
    // Sita kneels behind the mound; flinches, throws a clod, cries out
    const thr = ease(seg(t, CLOD - .35, CLOD)), hurt = t > CLAW;
    sita(380, 1890, 21, { boilKey: 'cs', eyes: hurt ? 'closed' : t > PECK - .3 ? 'wide' : 'normal', mouth: hurt ? 'O' : t > PECK - .3 ? 'O' : 'smile', hx: .3, lookX: .7, lookY: -.4, noShadow: true,
      handR: t > CLOD - .4 && t < CLOD + .4 ? [lerp(3.3, 6.5, thr), lerp(-11.2, -21, thr)] : hurt ? [-2.6, -15.4] : undefined, bendR: .5, handL: hurt ? [-3.2, -14.6] : undefined, emote: hurt && t < WOKE + .5 ? '!!' : undefined, emoteK: 1, emoteAge: t - CLAW });
    mound(400, 1790, 560, 'cmd');
    if (t > CLOD && t < CLOD + .6) { const k = seg(t, CLOD, CLOD + .6); const p = arcPt([480, 1400], [760, 900], -120, k); clod(p[0], p[1], 16, 'ccl'); }
    drops(470, 1770, ease(seg(t, BLED - .2, BLED + .3)), 'cdr');
    // Ram dozes sitting beside her; wakes, sees the drops, turns angry
    const awake = t > WOKE - .1;
    ram(700, 1800, 19, { boilKey: 'cr', sit: 1, kodanda: false, eyes: !awake ? 'closed' : t > BLOOD ? 'angry' : 'wide', brow: t > BLOOD ? -.8 : 0, mouth: awake ? (t > BLOOD ? 'flat' : 'O') : 'smile', htilt: awake ? 0 : -.25, hx: awake ? -.4 : -.2, lookX: t > BLOOD && t < INDRAS - .3 ? -.6 : .4, lookY: t > BLOOD && t < INDRAS - .3 ? .7 : -.6,
      emote: !awake ? 'zzz' : t < BLOOD + .3 ? '!' : undefined, emoteK: 1, emoteAge: t });
    shaniCrow(cx, cy, 20, { boilKey: 'cc', flip: true, flap, fly, eyes: ceyes, caw: peckOn || back ? .5 + .5 * Math.sin(t * 9) : 0 });
    crowCrown(cx + 14, cy - 95, 60, backOut(clamp((t - INDRAS + .2) * 3)));
    camEnd();
    caps(t);
    wipeIn(lt, DAYC);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= D · the blade of grass becomes the Brahmastra =================
  function shotGrass(t, lt, dur) {
    const c = kf(t, [[D0, [560, 1250, 1.15]], [BRAHM - .3, [600, 1150, 1.35]]], ease);
    camBegin(c[0], c[1], c[2]);
    chitrakoot(t, 'd');
    const lift = ease(seg(t, PICK - .2, BLADE)), charge = ease(seg(t, BLADE, BRAHM + .3));
    glow(560, 1150, 300 + 500 * charge, '#FFE070', .3 + .4 * charge);
    if (charge > .05) { boilSeed('drings'); for (let i = 0; i < 3; i++) { const k = frac(t * .9 + i / 3); inkLine(ellPts(660, 1000, 60 + k * 260, 60 + k * 260, 28), 2.4 * (1 - k), GOLDC, 'ink', .5); } }
    const hand = [lerp(3.4, 6.6, lift), lerp(-11, -24.5, lift)];
    ram(480, 1800, 26, { boilKey: 'dr', eyes: charge > .3 ? 'closed' : 'angry', brow: -.8, mouth: 'flat', handR: hand, bendR: .4, lookX: .5, lookY: -.6, hx: .2 });
    const [hx, hy] = naradaHand(480, 1800, 26, { handR: hand, bendR: .4 }, 1);
    if (lift > .1) grassStar(hx + 14, hy - 130, -Math.PI / 2 + .2, 220, 'dgs', 0);
    camEnd();
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= E · the crow flees through the three worlds; no one shelters him =================
  function shotFlee(t, lt, dur) {
    const k = ease(seg(t, E0, NOONE));
    camBegin(540, 1150, 1.0);
    worlds(t, k, 'e');
    // the crow flies right to left across, the glowing grass chasing behind
    const cx = 540 + Math.sin(t * 1.4) * 240, cy = 1200 + Math.sin(t * 2.3) * 110;
    shaniCrow(cx, cy, 24, { boilKey: 'ec', flip: true, flap: Math.sin(t * 24), fly: 1, eyes: 'wide', caw: .4 + .4 * Math.sin(t * 11), rot: Math.cos(t * 1.4) * .2 });
    grassStar(cx + 340 + Math.sin(t * 1.4 - .6) * 60, cy + 40, Math.PI + Math.cos(t * 1.4) * .2, 140, 'egs', 1);
    // Indra on Airavata on a cloud, shaking his head; then a sage on a cloud
    const iK = backOut(clamp((t - FATHER + .4) * 2)) * (1 - ease(seg(t, GODS + .6, GODS + 1.2))), sK = backOut(clamp((t - SAGES + .4) * 2));
    if (iK > .02) { cloudPuff(800, 1700, 260 * iK, 'eic', 255); airavata(800, 1670, 19 * iK, { boilKey: 'ea', eyes: 'closed', trunk: 'curl', indra: { eyes: 'closed', mouth: 'frown', handR: [2.6, -3.4], vajra: 0, lean: Math.sin(t * 8) * .12 } }); }
    if (sK > .02) { cloudPuff(260, 1760, 220 * sK, 'esc', 255); valmiki(260, 1740, 19 * sK, { boilKey: 'es', eyes: 'closed', mouth: 'frown', hx: Math.sin(t * 9) * .6, handR: [5.4, -19], bendR: .4 }); }
    if (t > NOONE - .2) { boilSeed('eno'); const q = backOut(clamp((t - NOONE + .2) * 3)); paint(starPts(cx, cy - 120, 30 * q, .45, 6), { wash: '#FFF2C0', ink: P4.ink, sw: .8 }); }
    camEnd();
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, DAYC);
  }

  // ================= F · at Ram's feet; the astra takes his right eye; spared =================
  function shotFeet(t, lt, dur) {
    const c = kf(t, [[F0, [540, 1450, 1.05]], [RIGHT - .3, [620, 1600, 1.4]], [SPARED, [560, 1450, 1.05]]], ease);
    camBegin(c[0], c[1], c[2]);
    chitrakoot(t, 'f');
    sita(260, 1820, 20, { boilKey: 'fs', eyes: 'normal', mouth: 'O', lookX: .8, hx: .3 });
    ram(520, 1830, 23, { boilKey: 'fr', eyes: t > SPARED - .2 ? 'closed' : 'normal', mouth: t > SPARED - .2 ? 'smile' : 'flat', lookX: .7, lookY: .7, hx: .3, handR: t > SPARED - .2 ? [5.6, -17] : undefined, bendR: .5 });
    // the crow drops in at his feet, bows; the grass hovers, strikes his eye; he flies off
    const land = easeOut(seg(t, F0, FEET)), off = ease(seg(t, SPARED + .3, G0));
    const cx = lerp(1250, 760, land) + off * 500, cy = lerp(900, 1790, land) - off * 900, hit = t > RIGHT;
    shaniCrow(cx, cy, 20, { boilKey: 'fc', flip: true, flap: off > 0 || land < 1 ? Math.sin(t * 20) : -.6, fly: off > 0 || land < 1 ? 1 : 0, eyes: hit ? 'closed' : land >= 1 ? 'wide' : 'normal', rot: land >= 1 && off <= 0 ? .35 : 0, caw: hit && t < RIGHT + .6 ? 1 : 0 });
    if (t > FEET - .2 && t < RIGHT + .1) { const q = ease(seg(t, RIGHT - .5, RIGHT)); grassStar(lerp(1000, cx + 70, q), lerp(1500, cy - 40, q) + Math.sin(t * 4) * 20, Math.PI * .9, 90, 'fgs', q); }
    if (hit && t < RIGHT + .25) { boilSeed('fhit'); paint(starPts(cx + 70, cy - 40, 70 * backOut(seg(t, RIGHT, RIGHT + .1)), .45, 8), { wash: '#FFF2C0', ink: P4.ink, sw: 1 }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= G · Lanka, years later: Sita tells Hanuman; "why not for the demon who took me?" =================
  function shotLanka(t, lt, dur) {
    camBegin(540, 1400, 1.0 + lt * .01);
    ashokaGrove(t, 'g');
    const ask = t > WHYNOT - .3;
    sita(380, 1830, 22, { boilKey: 'gs', eyes: ask ? 'closed' : 'normal', mouth: Math.sin(t * 7) > 0 ? 'open' : 'smile', lookX: .7, hx: .3, handR: ask ? [6.5, -15] : [4.6, -14], bendR: .5, handL: ask ? [-6, -15] : undefined });
    if (ask) tears(...parvatiHand(380, 1830, 22, { handR: [6.5, -15] }, 1).map((v, i) => i ? v - 230 : v - 70), t, 'gst', .8);
    hanuman(760, 1830, 22, { boilKey: 'gh', sit: 1, pray: 1, eyes: t > ONLY ? 'wide' : 'normal', mouth: 'O', lookX: -.7, hx: -.3, tail: 'droop', gada: 0 });
    // her bubble: the crow and the glowing grass; then on "who took me", Ravana's crowned head in shadow
    if (t > LANKA - .2) {
      const k = backOut(clamp((t - LANKA + .2) * 3)), bx = 640, by = 1190;
      boilSeed('gbub'); paint(ellPts(bx, by, 240 * k, 170 * k, 22, 4), { wash: '#E6E0F2', ink: P4.ink, sw: 1, curv: .8 });
      if (k > .6 && t < TOOK - .2) { shaniCrow(bx - 70, by + 20, 13, { boilKey: 'gbc', flip: true, fly: 1, flap: Math.sin(t * 20), eyes: 'wide' }); grassStar(bx + 130, by + 20, Math.PI, 80, 'gbg', .4); }
      if (t > TOOK - .2) { const q = backOut(clamp((t - TOOK + .2) * 3)); ravanaLoneHead(bx, by + 10, 110 * q, 4, { eyes: 'angry', mouth: 'grin' }); }
    }
    camEnd();
    caps(t);
    wipeOut(lt, dur, DUSKC);
  }

  // ================= H · the tease: one man against fourteen thousand =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1350, 1.0 + lt * .015);
    boilSeed('hsky'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#C8603A', ink: null });
    paint(ellPts(540, 1300, 900, 500, 24), { fill: '#F2A060', fillOp: 220, bleed: .3, tex: .4, ink: null });
    glow(760, 1250, 260, '#FFD890', .5); paint(ellPts(760, 1260, 90, 90, 20), { wash: '#FFE0A8', ink: null });
    boilSeed('hgr'); paint(rectPts(-400, 1480, W + 800, 1200), { wash: '#5A2A2A', ink: null });
    demonHorde(t, 'hd', 40);
    const draw = ease(seg(t, FOURTEEN - .6, FOURTEEN));
    ram(250, 1820, 24, { boilKey: 'hr', tint: '#2A1418', tintK: .8, eyes: 'angry', mouth: 'flat', kodanda: false, flip: true, handL: [-7.6, -18], bendL: .3, handR: [lerp(-2.6, -.4, draw), lerp(-14.4, -18.6, draw)], bendR: .9, armL: heldBow(draw), hx: -.5, lookX: -1 });   // flipped: the bow aims screen right, at the horde
    camEnd();
    caps(t);
    wipeIn(lt, DUSKC);
    wipeOut(lt, dur, CARDC);
  }

  // ================= I · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 5, title: 'ONE MAN, 14,000 DEMONS', at: CARD }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotCrow], [D0, shotGrass], [E0, shotFlee], [F0, shotFeet], [G0, shotLanka], [H0, shotTease], [K0, shotCard]]);
})();
