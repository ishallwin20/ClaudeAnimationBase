// rp11.js: Ramayan Part 11, "Ram vs the Ocean" (58.0 s, Painted, no voice: captions in Bangers, retro cartoon SFX, a
// soft tanpura under the three days of waiting). Told from the Valmiki Ramayana, Yuddha Kanda: Ravana's brother
// Vibhishana comes over to Ram; the monkeys call him a spy; Ram: I protect all who come to me, even if it were Ravana
// himself (17–18); Ram prays to the Ocean by the shore for three nights, with no answer (21); angry, his arrows churn the
// sea, and he takes up the Brahmastra (21–22); the Ocean rises in person, hands joined; the drawn arrow must fly, and
// Ram shoots it far to the north; the Ocean says Nala can build a bridge and he will hold it up (22); Nala and the
// monkeys build it, a hundred yojanas, in five days, and the army crosses (22). The finale tease and the follow card.
// STORYBOARD.md has the plan and the sources; sets and cast in rp11_props.js, src/ramayan_sets.js, src/ramayan.js.
// Every time comes from src/scenes/rp11_tl.js (TL), which tools/rp11_sfx.mjs reads too.
(() => {
  const { B0, C0, D0, E0, F0, G0, H0, I0, ARRIVE, SPY, SAFE, DAYS, SHOOT, ASTRA, RISE, NORTH, FLY, NALA, FIVE, MARCH, CARD } = TL;
  window.RP11_T = TL;
  const talk = (t, a, b, rest, open = 'open') => t > a && t < b && Math.sin((t - a) * 15) > -.2 ? open : rest;

  const GOLDC = P11.gold;
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const CARDC = [RMY.maroon, RMY.saffron], SEAC = [P11.sea, P11.skyHi], NIGHTC = [P11.nightHi, P11.sea], STORMC = [P11.angry, '#6A4A5A'];

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
  // Ram with his bow drawn, aiming screen right (flipped: callers turn the head with hx < 0, lookX < 0); up 0..1 raises the aim
  const bowPose = (draw, o = {}, up = 0) => ({ flip: true, handL: [-7.6 + up * 2.4, -18 - up * 6], bendL: .3, handR: [lerp(-2.6, -.4, draw) + up * .8, lerp(-14.4, -18.6, draw) - up * 3], bendR: .9, kodanda: false, armL: heldBow(draw), ...o });
  const astraGlow = (x, y, k, t) => { if (k <= 0) return; glow(x, y, 160 + 30 * Math.sin(t * 12), '#FFE070', .7 * k); glow(x, y, 60, '#FFFFFF', .6 * k); };

  // ================= A · the hook: Ram at the shore, the bow drawn at the sea =================
  function shotHook(t, lt, dur) {
    camBegin(540, 1360 - lt * 8, 1 + lt * .012);
    shore(t, 'ha', { angry: .35, churn: .3 });
    const o = { boilKey: 'har', eyes: 'angry', brow: -.8, mouth: 'flat', hx: -.5, lookX: -1, emote: 'anger', emoteK: 1, emoteAge: t };
    ram(280, 1860, 25, { ...o, ...bowPose(1) });
    camEnd();
    caps(t);
    wipeOut(lt, dur, CARDC);
  }

  // ================= B · the ident =================
  function shotIdent(t, lt, dur) { ramayanIdent(t, lt, 11, 'RAM VS THE OCEAN'); wipeIn(lt, CARDC); wipeOut(lt, dur, SEAC); }

  // ================= C · Vibhishana comes over; "he's a spy!"; Ram: "even Ravana!" =================
  function shotVibhishana(t, lt, dur) {
    camBegin(540, 1400, 1.0);
    shore(t, 'c', { lanka: true });
    // Vibhishana flies in over the sea from Lanka and hovers, hands joined
    const inK = easeOut(seg(t, C0, ARRIVE)), vx = lerp(1300, 820, inK), vy = 1500 + Math.sin(t * 2.2) * 14;
    vibhishana(vx, vy, 15, { boilKey: 'cv', flip: true, noShadow: true, eyes: t > SAFE + .3 ? 'happy' : 'normal', mouth: talk(t, ARRIVE, SPY - .3, t > SAFE + .3 ? 'smile' : 'flat'), lookX: -1, handL: [-1.4, -14], handR: [1.4, -14], bendL: .4, bendR: .4,
      emote: t > SPY && t < SAFE ? 'sweat' : t > SAFE + .3 ? 'hearts' : undefined, emoteK: 1, emoteAge: t - (t > SAFE ? SAFE : SPY) });
    if (t > SAFE + .3) tears(vx + 34, vy - 15 * 18.6, t, 'cvt', .5);
    // the monkeys: Sugriva and two vanaras on the sand; on SPY they leap up angry; on SAFE their jaws drop
    const spy = t > SPY && t < SAFE + .2, safe = t > SAFE + .2, hop = spy ? Math.abs(Math.sin((t - SPY) * 7)) * .8 : 0;
    vanaraKing(200, 1870, 17, { boilKey: 'cs', eyes: spy ? 'angry' : safe ? 'wide' : 'normal', mouth: spy ? talk(t, SPY + .1, SAFE - .2, 'teeth') : safe ? 'O' : 'flat', lookX: 1, hx: .3, dy: -hop,
      handR: spy ? [8, -19] : undefined, bendR: .2, emote: spy ? 'anger' : safe ? '!' : undefined, emoteK: 1, emoteAge: t - SPY });
    vanara(60, 1880, 14, 2, { boilKey: 'cv1', eyes: spy ? 'angry' : safe ? 'wide' : 'normal', mouth: spy ? 'teeth' : safe ? 'O' : 'smile', lookX: 1, dy: -(spy ? Math.abs(Math.sin((t - SPY) * 7 + 1)) * .8 : 0) });
    // Ram: calm; on SAFE he raises his hand (abhaya) and smiles
    ram(440, 1860, 19, { boilKey: 'cr', eyes: safe ? 'happy' : 'normal', mouth: talk(t, SAFE + .1, D0 - .5, 'smile'), lookX: .8, hx: .3, handR: t > SAFE - .1 ? [6.2, -19.6] : undefined, bendR: .3 });
    camEnd();
    caps(t);
    wipeIn(lt, SEAC);
    wipeOut(lt, dur, NIGHTC);
  }

  // ================= D · three days of prayer by the shore; no answer =================
  function shotWait(t, lt, dur) {
    camBegin(540, 1420, 1.1);
    const ph = (t - D0) / ((E0 - D0 - .6) / 3), night = (1 - Math.cos(ph * TAU)) / 2 * (t < E0 - .6 ? 1 : 0), day = Math.min(3, Math.floor(ph + .5) + 1);
    const sa = ph * TAU / 2 % Math.PI;
    shore(t, 'd', { night, dawn: (1 - night) * .4, sun: [540 + Math.cos(Math.PI - sa) * 500, 1300 - Math.sin(sa) * 600, 1 - night], moon: [540 + Math.cos(Math.PI - sa) * 500, 1300 - Math.sin(sa) * 600, night] });
    boilSeed('dmat'); paint(ellPts(420, 1720, 230, 40, 18), { wash: '#B8A05A', fill: '#8A7A3A', fillOp: 50, tex: .5, ink: P11.ink, sw: .8 });   // the darbha grass mat
    const fed = t > DAYS + .3;
    ram(420, 1720, 18, { boilKey: 'dr', sit: 1, pray: fed ? 0 : 1, mudra: fed ? 1 : 0, eyes: fed ? 'normal' : 'closed', mouth: fed ? 'frown' : 'smile', brow: fed ? -.6 : 0, lookX: .8, hx: .3, kodanda: false });
    if (fed) emote('dots', 760, 1180, 70, 1, t);
    camEnd();
    dayPill(`DAY ${day}`, 820, 1420, clamp((t - D0 - .2) * 3));
    caps(t);
    wipeIn(lt, NIGHTC);
    wipeOut(lt, dur, STORMC);
  }

  // ================= E · his arrows churn the sea; the Brahmastra =================
  function shotAnger(t, lt, dur) {
    const sh = shakeXY(t, t > SHOOT ? 4 + 4 * seg(t, ASTRA, F0) : 0);
    camBegin(540 + sh[0], 1380 + sh[1], 1.0);
    const ang = ease(seg(t, E0, SHOOT + 1)), ch = ease(seg(t, SHOOT, SHOOT + 1.2));
    shore(t, 'e', { angry: ang, churn: ch });
    // arrows streak into the sea, splashing; fish and crabs leap out in a panic
    const shots = [SHOOT, SHOOT + .6, SHOOT + 1.2];
    for (const s of shots) { if (t > s && t < s + .35) { const q = seg(t, s, s + .35); arrowAt(lerp(460, 900, q), lerp(1500, 1420, q), -.15, 150, 'ea' + s); } }
    if (t > SHOOT + .4) for (let i = 0; i < 5; i++) { const q = frac((t - SHOOT) * .7 + i / 5), x = 560 + i * 110, y = 1420 - Math.sin(q * Math.PI) * 260; fish(x + q * 60, y, 70, -1.2 + q * 2.4, 'ef' + i, i % 2 ? '#F2A03A' : '#E2706A'); }
    if (t > SHOOT + .8) crab(820, 1520 - Math.abs(Math.sin(t * 5)) * 60, 90, (Math.sin(t * 14) + 1) / 2, 'ecr');
    // Ram: shoots three arrows; then draws the Brahmastra, which glows at the arrow
    const astra = t > ASTRA, draw = astra ? ease(seg(t, ASTRA, ASTRA + 1)) : shots.reduce((d, s) => t > s - .5 && t < s ? ease(seg(t, s - .5, s - .05)) : d, 0);
    const o = { boilKey: 'er', eyes: 'angry', brow: -.9, mouth: astra ? 'flat' : 'teeth', hx: -.5, lookX: -1, tint: astra ? '#C8283A' : undefined, tintK: .12 };
    ram(280, 1860, 24, { ...o, ...bowPose(draw) });
    if (astra) astraGlow(...naradaHand(280, 1860, 24, bowPose(draw), -1).map((v, i) => i ? v - 10 : v + 40), draw, t);
    camEnd();
    caps(t);
    wipeIn(lt, STORMC);
  }

  // ================= F · the Ocean rises; the arrow flies north; "Nala can build a bridge" =================
  function shotSagara(t, lt, dur) {
    camBegin(540, 1400, 1.0);
    const calm = ease(seg(t, RISE, RISE + 1));
    shore(t, 'f', { angry: 1 - calm, churn: .6 * (1 - calm) });
    // Sagara rises out of the sea, hands joined (his feet under the water)
    const up = easeOut(seg(t, RISE, RISE + 1)), sx = 780, sy = lerp(2300, 1640, up);
    glow(sx, sy - 300, 340, '#BFE8FF', .3 * up);
    sagara(sx, sy, 19, { boilKey: 'fs', flip: true, pray: t < NALA ? 1 : 0, handR: t > NALA ? [-7, -18] : undefined, bendR: .3, eyes: t > NALA ? 'happy' : 'closed', mouth: talk(t, F0 + .8, NORTH - .3, talk(t, NALA + .1, G0 - .4, 'smile')), lookX: -1, hx: -.3 });
    frontSea(t, 1600, 'ffs', { angry: (1 - calm) * .5 });
    // Ram: the Brahmastra still drawn; at NORTH he raises his aim and lets it fly up out of frame
    const fly = t > FLY, aim = ease(seg(t, NORTH + .1, FLY - .1));
    ram(240, 1860, 22, { boilKey: 'fr', eyes: t > FLY + .5 ? 'normal' : 'angry', brow: t > FLY + .5 ? 0 : -.6, mouth: 'flat', hx: -.5, lookX: -1, lookY: -aim, ...bowPose(fly ? 0 : 1, {}, aim) });
    if (!fly) astraGlow(...naradaHand(240, 1860, 22, bowPose(1, {}, aim), -1).map((v, i) => i ? v - 10 - aim * 40 : v + 40), 1, t);
    if (fly && t < FLY + .6) { const q = easeIn(seg(t, FLY, FLY + .6)), x = lerp(330, 560, q), y = lerp(1300, -300, q); glow(x, y, 140, '#FFE070', .8); boilSeed('ffly'); inkLine([[x, y], [x - 50, y + 260]], 9, '#FFF2B0', 'ink', 0); }
    if (fly && t < FLY + .4) flash(.4 * (1 - seg(t, FLY, FLY + .4)), '#FFF4D0');
    // Nala pops up on the sand at NALA, thumbs up
    if (t > NALA + .3) { const k = backOut(clamp((t - NALA - .3) * 3)); nala(470, 1880, 13 * k, { boilKey: 'fn', eyes: 'happy', mouth: 'grin', lookX: .5, handR: [5, -20], bendR: .2, emote: '!', emoteK: 1, emoteAge: t - NALA - .3 }); }
    camEnd();
    caps(t);
    wipeOut(lt, dur, SEAC);
  }

  // ================= G · the bridge in five days; the army marches across =================
  function shotBridge(t, lt, dur) {
    camBegin(540, 1380, 1.0);
    shore(t, 'g', { lanka: true, sy: 1760, hy: 1300 });
    const k = ease(seg(t, G0 + .2, FIVE + 2.6)), bx0 = -200, len = 1500, end = bx0 + len * k;
    bridge(bx0, 1560, len, k, 70, 'gbr');
    // vanaras hop along it carrying boulders to the growing end; Nala at the end, pointing
    if (t < MARCH) {
      for (let i = 0; i < 3; i++) { const q = frac((t - G0) * .55 + i / 3), x = lerp(-100, end - 40, q), y = 1525 - Math.abs(Math.sin(q * 18)) * 18;
        vanara(x, y, 7, i, { boilKey: 'gv' + i, walk: t * 3 + i, eyes: 'happy', mouth: 'grin', handL: [-1.6, -26], handR: [1.6, -26], bendL: -.2, bendR: -.2, noShadow: true });
        rockLoad(x, y - 7 * 28.5, 40, 'grk' + i); }
      nala(Math.min(end - 30, 1000), 1525, 8, { boilKey: 'gn', eyes: 'happy', mouth: talk(t, G0 + .3, FIVE, 'grin'), lookX: -1, flip: true, handR: [-7, -17], bendR: .2, noShadow: true });
    } else {
      // the march: Ram, Lakshman, Sugriva and the vanaras walk right across it
      const m = t - MARCH, xs = [ram, lakshman, vanaraKing, vanara, vanara], us = [9, 8.5, 8.5, 7, 7];
      xs.forEach((f, i) => { const x = -40 + m * 230 - i * 110 + (i ? 0 : 0), args = [x, 1525, us[i]]; const o = { boilKey: 'gm' + i, walk: t * 2.6 + i * .7, eyes: 'normal', mouth: 'smile', lookX: 1, noShadow: true };
        if (f === vanara) vanara(...args, i, o); else f(...args, o); });
    }
    camEnd();
    const dd = Math.min(5, Math.floor(seg(t, G0 + .2, FIVE + 2.6) * 5) + 1);
    if (t < MARCH) dayPill(`DAY ${dd}`, 820, 1420, clamp((t - G0 - .3) * 3));
    caps(t);
    wipeIn(lt, SEAC);
    wipeOut(lt, dur, ['#2A1A3A', '#6A2E3A']);
  }

  // ================= H · the finale tease: Ravana glares from Lanka's wall =================
  function shotTease(t, lt, dur) {
    camBegin(540, 1400, 1.0 + lt * .02);
    lankaWall(t, 1600, 'h');
    ravana(540, 1780, 18, { boilKey: 'hr', all: { eyes: 'angry', brows: -.9, mouth: 'teeth', lookX: -.3, emote: 'anger', emoteK: 1, emoteAge: t }, heads: { 0: { eyes: 'angry', hat: 'cap' }, 1: { mouth: 'teeth' } } });
    lankaWallFront(1600, 'hw');
    camEnd();
    caps(t);
    wipeIn(lt, ['#2A1A3A', '#6A2E3A']);
    wipeOut(lt, dur, CARDC);
  }

  // ================= I · the follow card =================
  function shotCard(t, lt) { followCard(t, lt, { part: 12, title: 'THE LAST ARROW', at: CARD, ask: 'Comment JAI SHRI RAM 🙏' }); wipeIn(lt, CARDC); }

  shots([[0, shotHook], [B0, shotIdent], [C0, shotVibhishana], [D0, shotWait], [E0, shotAnger], [F0, shotSagara], [G0, shotBridge], [H0, shotTease], [I0, shotCard]]);
})();
