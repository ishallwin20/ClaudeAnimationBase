// narad.js: "Narad Muni thought he looked like VISHNU." (ad 22, ~102 s, captions in Bangers, SFX, no voiceover).
// The Ramcharitmanas's telling (Bal Kand 125–139): Narada's tapas and Kama's failed arrows, his pride, Shiva's "don't
// tell Vishnu", the tree of pride, the magic city and Vishwamohini's palm, "give me your looks", the monkey face, the
// swayamvara, the pond, the curse on the ganas and on Vishnu (the Ramayana in a vision), the illusion gone, "it was my
// will". STORYBOARD.md has the plan and the sources; the sets and props are in narad_props.js. All times are video
// time (t); tools/narad_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/narad_sfx.mjs)
  const B0 = 3.6, D0 = 7.6, E0 = 16.9, F0 = 26.2, G0 = 32.4, P0 = 38.6, H0 = 44.8, I0 = 54.1, J0 = 66.5, K0 = 75.8, M0 = 85.1, N0 = 91.3, CARD = 95.1;
  const PREEN = 1.0, TING = 2.0, VIS = 3.9, RAMV = 4.3, DEERV = 4.9, VANV = 5.5;
  const KAMA_IN = 7.9, LAND = 8.9, BLOOM = 8.6, AIM = 10.4, SHOTS = [10.9, 11.6, 12.3], BEE = 12.8, GUARD = 13.8, GIVEUP = 14.9, BOWK = 15.4, NOPEN = 15.9;
  const WAG = 20.3, NOD = 22.6, ZOOM = 23.2, PALM = 24.0;
  const MIME = 26.4, FLEX = 27.3, SPROUT = 27.6, NOTICE = 27.9, WINK = 29.9, SPARK = 30.6;
  const CITY = 32.9, PRIN = 35.4, HEARTS = 36.6, LINES = 39.0, SWOON = 42.4;
  const VIN = 45.3, WINK2 = 48.6, POOF = 51.3, PREEN2 = 52.3, TING2 = 52.9, VOUT = 53.4;
  const GIG = 54.4, PIN = 59.4, SEES = 60.6, POPS = [61.1, 61.8, 62.5], KING = 63.4, GARL = 64.4, JAW = 65.2;
  const LOOK = 67.8, REFLECT = 68.2, SCREAM = 68.8, WIDE2 = 69.7, CURSEG = 70.0, DEMON = 70.4, FLEE = 71.3, FACEBACK = 73.0, STEAM = 73.8;
  const CURSE = 76.2, RAM_V = 76.6, SITA_V = 77.6, VAN_V = 79.3, ACCEPT = 82.3, VANISH = 83.4;
  const FALL = 85.4, BLESS = 86.4, LOOKUP = 87.4, DROP = 88.6;
  const CAP_T = CARD + .1, COVERS = CARD + .4, PRICE = CARD + 1.2, STRIKE = CARD + 1.7, DEAD = CARD + 2.2, PILL = CARD + 2.7, SUB = CARD + 3.2, FOLLOW = CARD + 3.7;
  const CARDC = { cap: CAP_T, covers: COVERS, price: PRICE, strike: STRIKE, dead: DEAD, pill: PILL, sub: SUB, follow: FOLLOW, logo: CAP_T - .1 };

  const GOLDC = '#F5C542';
  const LAK_PAL = { saree: '#D92B3A', sareeDk: '#A01C2A', sareeLt: '#F06A70', blouse: '#F2C230', blouseDk: '#B88A1C', bangle: '#F2C230' };
  const PRI_PAL = { saree: '#E86AA0', sareeDk: '#B8447A', sareeLt: '#F7A5C6', blouse: '#F2C230', blouseDk: '#B88A1C', bangle: '#E8394A', gold: '#F2C230' };
  // feel() / emotions() for the cast: drop the body colours (they're Clawd's) and keep the current key's name
  const mood = (name, t, over = {}) => { const k = feel(name, t, over); delete k.col; delete k.dk; delete k.lt; return k; };
  const act = (t, keys, o) => { const k = emotions(t, keys, o); let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++; delete k.col; delete k.dk; delete k.lt; k.name = keys[i][1]; return k; };
  const camK = (t, keys, sh = [0, 0]) => { const c = kf(t, keys); camBegin(c[0] + sh[0], c[1] + sh[1], c[2]); return c; };
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const ROSE = [NP.roseDk, NP.rose], GOLDW = [TK.marigold, TK.gold], VIOL = [NP.duskDk, NP.dusk];

  // the tree of pride on his topknot: it sprouts at Vishnu's, grows with the love story, wilts and drops when he bows
  const pride = t => {
    const g = .55 * ease(seg(t, SPROUT, SPROUT + 1.2)) + .25 * ease(seg(t, SWOON, SWOON + .8)) + .2 * ease(seg(t, PREEN2, PREEN2 + .5));
    const fall = seg(t, DROP + .3, DROP + 1.1);
    if (fall >= 1) return undefined;
    return sapling(g, ease(seg(t, DROP - .5, DROP + .2)), easeIn(fall) * 3);
  };

  // ---- every caption: [text, y, t0, life, size, colour]
  const CAPS = [
    ['NARAD MUNI THOUGHT HE LOOKED', 470, -1, B0 + .9, 64], ['JUST LIKE VISHNU.', 580, -1, B0 + .9, 104, GOLDC],
    ['THIS FACE MADE HIM CURSE VISHNU.', 455, B0 + .1, 3.8, 56], ['THAT CURSE BECAME', 548, B0 + .4, 3.5, 70], ['THE RAMAYANA.', 665, B0 + .8, 3.1, 118, GOLDC],
    ["IT BEGAN WITH NARAD'S TAPAS.", 460, 7.7, 3.0, 62], ['INDRA SENT KAMADEVA TO BREAK IT.', 555, 8.0, 2.7, 58, GOLDC],
    ["KAMA'S FLOWER ARROWS DID NOTHING.", 460, 10.8, 3.0, 54], ["NARAD DIDN'T EVEN BLINK.", 555, 11.1, 2.7, 72, GOLDC],
    ["HE DIDN'T KNOW VISHNU", 470, 13.9, 3.0, 76], ['WAS GUARDING HIM.', 575, 14.2, 2.7, 92, GOLDC],
    ['NARAD WAS SO PROUD,', 470, 17.0, 3.0, 78], ['HE FLEW TO TELL SHIVA.', 575, 17.3, 2.7, 84, GOLDC],
    ['SHIVA: "WONDERFUL. BUT', 460, 20.1, 3.0, 70], ['DON\'T TELL VISHNU."', 565, 20.4, 2.7, 92, GOLDC],
    ['SO HE FLEW STRAIGHT', 470, 23.2, 3.0, 80], ['TO VISHNU.', 585, 23.5, 2.7, 124, GOLDC],
    ['HE BRAGGED. VISHNU SAW A TREE', 460, 26.3, 3.0, 58], ['OF PRIDE SPROUT IN HIM.', 555, 26.6, 2.7, 74, GOLDC],
    ['SO VISHNU...', 470, 29.4, 2.9, 86], ['MADE A PLAN.', 585, 29.9, 2.4, 112, GOLDC],
    ['ON HIS WAY, A MAGIC CITY', 470, 32.5, 3.0, 70], ['APPEARED.', 585, 32.8, 2.7, 112, GOLDC],
    ['ITS PRINCESS WAS CHOOSING', 470, 35.6, 2.9, 70], ['A HUSBAND.', 585, 35.9, 2.6, 112, GOLDC],
    ['HER PALM SAID: WHOEVER WEDS HER', 460, 38.7, 3.0, 56], ['WILL NEVER DIE.', 560, 39.0, 2.7, 96, GOLDC],
    ['THE MAN WHO BEAT DESIRE', 470, 41.8, 2.9, 72], ['FELL IN LOVE IN SECONDS.', 575, 42.1, 2.6, 80, GOLDC],
    ['HE BEGGED: "HARI, GIVE ME', 460, 44.9, 3.0, 70], ['YOUR LOOKS!"', 570, 45.2, 2.7, 112, GOLDC],
    ['VISHNU: "I\'LL DO WHAT\'S', 460, 48.0, 3.0, 72], ['BEST FOR YOU."', 570, 48.3, 2.7, 104, GOLDC],
    ['...AND GAVE HIM', 470, 51.1, 2.9, 80], ["A MONKEY'S FACE.", 585, 51.5, 2.5, 110, GOLDC],
    ["SHIVA'S GANAS GIGGLED:", 460, 54.2, 3.0, 76], ['"HE LOOKS JUST LIKE HARI!"', 565, 54.5, 2.7, 78, GOLDC],
    ['"HARI" MEANS VISHNU...', 460, 57.3, 3.0, 80], ['BUT ALSO MONKEY!', 570, 57.8, 2.5, 106, GOLDC],
    ["SHE WOULDN'T LOOK AT HIM.", 460, 60.4, 3.0, 72], ['HE KEPT POPPING UP.', 565, 60.7, 2.7, 92, GOLDC],
    ['THEN VISHNU CAME AS A KING.', 460, 63.5, 2.9, 66], ['SHE CHOSE HIM.', 565, 63.8, 2.6, 112, GOLDC],
    ['THE GANAS: "CHECK YOUR FACE', 460, 66.6, 3.0, 64], ['IN THE WATER!"', 565, 66.9, 2.7, 104, GOLDC],
    ['HE CURSED THEM TO BE', 470, 69.7, 3.0, 80], ['BORN AS DEMONS!', 580, 70.0, 2.7, 104, GOLDC],
    ['HIS FACE CAME BACK.', 470, 72.8, 2.9, 84], ["HIS ANGER DIDN'T.", 580, 73.3, 2.4, 100, GOLDC],
    ['"BE BORN A HUMAN! LOSE YOUR', 460, 75.9, 3.0, 62], ['WIFE, AS I LOST MINE!"', 560, 76.2, 2.7, 82, GOLDC],
    ['"AND MAY MONKEYS', 470, 79.0, 3.0, 84], ['HAVE TO HELP YOU!"', 580, 79.3, 2.7, 96, GOLDC],
    ['VISHNU SMILED, ACCEPTED IT...', 460, 82.1, 2.9, 64], ['AND THE ILLUSION VANISHED.', 560, 82.6, 2.4, 72, GOLDC],
    ['NARAD FELL AT HIS FEET.', 460, 85.2, 3.0, 76], ['VISHNU: "IT WAS MY WILL."', 560, 85.5, 2.7, 80, GOLDC],
    ['HE BEAT DESIRE...', 470, 88.3, 2.9, 90], ['BUT LOST TO PRIDE.', 585, 88.8, 2.4, 104, GOLDC],
    ['IS YOUR NAME HARI,', 470, 91.4, 3.6, 80], ['NARAYAN OR VISHNU?', 575, 91.7, 3.3, 88, GOLDC], ['COMMENT IT!', 685, 92.1, 2.9, 72],
  ];
  const caps = t => { for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color }); };

  // a bee (Kama's bowstring is made of them), in side view, facing f (±1)
  function bee(x, y, s, f = 1) {
    boilSeed('bee');
    const fl = Math.sin(T * 60) * .5;
    for (const k of [-1, 1]) paint(ellPts(x - 2 * s * f, y - 7 * s + k * fl * 2 * s, 6 * s, 3.5 * s, 10, 0, -.6 * f), { wash: '#FFFFFF', washOp: 170, ink: NP.ink, sw: .4 });
    paint(ellPts(x, y, 7 * s, 5 * s, 12), { wash: KMD.bee, ink: NP.ink, sw: .6 });
    for (const k of [-2.6, .4]) paint(rectPts(x + k * s, y - 4.3 * s, 1.4 * s, 8.6 * s), { wash: KMD.beeDk, ink: null });
    paint(ellPts(x + 6.5 * s * f, y - 1 * s, 2.6 * s, 2.6 * s, 8), { wash: KMD.beeDk, ink: null });
  }

  // ================= A · the hook: the monkey face, preening =================
  function shotHook(t, lt, dur) {
    camBegin(540, 960, 1 + .012 * lt);
    roseSet(t);
    const pr = ease(seg(t, PREEN - .3, PREEN + .2)) * (1 - ease(seg(t, PREEN + 1.1, PREEN + 1.5)));
    const o = { boilKey: 'hook', monkey: 1, eyes: 'smug', mouth: 'grin', puff: .5, htilt: -.08 * pr + .02 * Math.sin(t * 2), hx: .15 * pr, seed: 1,
      handR: [lerp(3.45, 4.3, pr), lerp(-10.8, -25.2, pr)], bendR: lerp(.6, 2.2, pr) };
    narada(540, 2300, 50, o);
    const m = naradaMouth(540, 2300, 50, o);
    sparkleBurst(m[0] + 30, m[1] - 10, 60, t - TING, 'ting', 6, ['#FFFFFF', '#FFF2B0']);
    camEnd();
    caps(t);
    if (lt > dur - .25) whipV(seg(lt, dur - .25, dur), 1, t, [TK.cream, NP.visGold]);
  }

  // ================= B · the tease: the Ramayana in a vision =================
  function shotVision(t, lt, dur) {
    camBegin(540, 1000, 1.04 + .015 * lt);
    visionSet(t, backOut(seg(t, VIS - .3, VIS + .15)));
    visions(t, [RAMV, DEERV, VANV], 540, 1000, 1.2);
    camEnd();
    caps(t);
    if (lt < .25) whipV(1 - lt / .25, 1, t, [TK.cream, NP.visGold]);
    wipeOut(lt, dur, [NP.grassDk, NP.grass]);
  }

  // ================= D · the tapas: Kama's arrows, the bee, the guardian =================
  const NX = 250, NY = 1610, NU = 19, KX = 770, KY = 1500, KS = 15, KU = 13;
  function shotKama(t, lt, dur) {
    camK(t, [[D0, [480, 1300, 1.22]], [AIM, [500, 1320, 1.25]], [GUARD, [360, 1360, 1.5]], [GIVEUP, [490, 1340, 1.28]], [E0, [480, 1340, 1.3]]]);
    caveSet(t, seg(t, BLOOM, BLOOM + 1.6));
    // Indra peeks from a cloud: sweating, then points Kama in
    const ik = ease(seg(t, D0, D0 + .5)) * (1 - ease(seg(t, AIM - .4, AIM)));
    if (ik > .01) {
      const ix = 720 + 420 * (1 - ik), iy = 1170;
      boilSeed('indracloud');
      for (const [dx, r] of [[-90, 75], [0, 95], [90, 75]]) paint(ellPts(ix + dx * .8, iy + 30, r * .8, r * .5, 14, 2), { wash: '#FFFFFF', fill: NP.skyDk, fillOp: 40, tex: .3, ink: NP.ink, sw: .6 });
      indra(ix, iy + 6 * Math.sin(t * 1.3), 17, { boilKey: 'indraD', eyes: t > KAMA_IN ? 'normal' : 'wide', sweat: 1, mouth: t > KAMA_IN ? 'smile' : 'O', lookX: -1, vajra: 0, handR: t > KAMA_IN - .2 ? [3.2, -4.5] : undefined, bendR: .3 });
    }
    // Narada: in tapas, eyes shut, a soft gold aura
    const open = t > NOPEN, bl = ease(seg(t, NOPEN + .3, NOPEN + .6));
    glow(NX, NY - 190, 210 + 20 * Math.sin(t * 2), '#FFE9A8', .45);
    const no = { boilKey: 'narD', sit: 1, eyes: open ? 'happy' : 'closed', mouth: 'smile', seed: 2, handR: bl > .01 ? [lerp(4.6, 3.4, bl), lerp(-9.6, -19, bl)] : undefined, bendR: -.4 };
    narada(NX, NY, NU, no);
    // the guard: a blue glow round him that the arrows ping off; at GUARD it flares and shows a chakra
    const gk = clamp(SHOTS.reduce((a, s) => a + Math.exp(-Math.max(0, t - s - .25) * 6) * (t > s + .25 ? 1 : 0), 0)) * .7 + 1.2 * ease(seg(t, GUARD, GUARD + .3)) * (1 - ease(seg(t, GIVEUP, GIVEUP + .6)));
    if (gk > .02) {
      boilSeed('shield');
      glow(NX, NY - 160, 260, NP.blue, .5 * clamp(gk));
      inkLine(ellPts(NX, NY - 160, 235, 250, 40), 3 + 4 * clamp(gk), mixCol(NP.blueLt, '#FFFFFF', .3), 'inkfine', .5);
    }
    const ck = backOut(seg(t, GUARD + .1, GUARD + .5)) * (1 - ease(seg(t, GIVEUP, GIVEUP + .5)));
    if (ck > .02) { push(); translate(NX, NY - 470); scale(ck); glow(0, 0, 120, '#FFE08A', .6); chakra(26, 1.2, t * 5, NP.ink); pop(); sparkleBurst(NX, NY - 470, 90, t - GUARD - .1, 'chakspark', 8); }
    // Kama: swoops in on his parrot from the right, lands, aims, shoots three times, droops, bows
    const inK = ease(clamp((t - KAMA_IN) / (LAND - KAMA_IN))), kx = lerp(1350, KX, inK), ky = lerp(900, KY, inK) - Math.sin(inK * Math.PI) * 120;
    const flying = inK < 1, fly = { flap: flying ? Math.sin(t * 14) : .25 * Math.sin(t * 3), fly: flying, flip: true, boilKey: 'parrotD', squawk: 0 };
    kamaParrot(kx, ky, KS, { ...fly, only: 'body' });
    const seat = parrotSeat(kx, ky, KS, fly);
    let shot = -1; for (let i = 0; i < 3; i++) if (t > SHOTS[i] - .5) shot = i;
    const relT = shot >= 0 ? t - SHOTS[shot] : -1, drawK = shot >= 0 && relT < 0 ? ease(clamp((relT + .5) / .4)) : 0;
    const aim = ease(seg(t, AIM, AIM + .3)) * (1 - ease(seg(t, GIVEUP, GIVEUP + .3)));
    const km = act(t, [[0, 'cool'], [SHOTS[1] + .3, 'confused'], [GUARD + .3, 'nervous'], [GIVEUP, 'sad'], [BOWK + .3, 'shy']], { take: .6 });
    const bow = ease(seg(t, BOWK, BOWK + .4));
    const ko = { ...km, ...KMD_SKIN, rot: -.25 * bow, boilKey: 'kamaD', sit: 1, flip: true, aim, draw: drawK, twang: relT >= 0 ? relT : undefined, arrow: aim > .5 && (relT < 0 || relT > .5) && t < SHOTS[2] + .2,
      bow: t < GIVEUP + .1, lookX: -1, scarf: flying ? 1 : .4 };
    if (bow > .01) { ko.handL = [-1.1, -8.4]; ko.handR = [1.1, -8.4]; }
    kamadeva(seat[0], seat[1], KU, ko);
    kamaParrot(kx, ky, KS, { ...fly, only: 'wing' });
    if (t > GIVEUP && t < GIVEUP + .9) {   // the dropped bow tumbles to the grass
      const f = seg(t, GIVEUP, GIVEUP + .5);
      push(); translate(seat[0] - 60 - 40 * f, seat[1] - 40 + 180 * easeIn(f)); rotate(-1.2 * f); kamaBow(KU, .8, -.6, 0, c => c, KMD.ink); pop();
    }
    // the flower arrows: fly to the glow, ping off it, tumble to the grass
    const tip0 = [KX - 60, KY - 2.25 * KS - 6.5 * KU];
    SHOTS.forEach((s, i) => {
      const a = t - s; if (a < 0 || a > 1.3) return;
      const hit = [NX + 230 * Math.cos(-.25 + i * .18), NY - 160 - 250 * Math.sin(-.25 + i * .18) * .3 - 40 + i * 30];
      let p, ang;
      if (a < .25) { const k = a / .25; p = [lerp(tip0[0], hit[0], k), lerp(tip0[1], hit[1], k)]; ang = Math.atan2(hit[1] - tip0[1], hit[0] - tip0[0]); }
      else { const k = (a - .25) / 1.05; p = [hit[0] + 160 * k, hit[1] - 220 * k + 520 * k * k]; ang = Math.PI + 1.5 + 9 * k; }
      boilSeed('arrow' + i);
      push(); translate(p[0], p[1]); rotate(ang); translate(-6.9 * KU, 0); kamaFlowerArrow(KU, .8); pop();
      if (a > .25) sparkleBurst(hit[0], hit[1], 60, a - .25, 'ping' + i, 6, ['#FFFFFF', NP.blueLt]);
    });
    // the bee: off the bowstring, loops in, lands on his nose; he doesn't move
    if (t > BEE && t < GIVEUP + 1.5) {
      const k = ease(clamp((t - BEE) / .5)), nose = naradaLocal(NX, NY, NU, no, 0, _nrH(-19.4)), from = [KX - 90, KY - 120];
      const bx = lerp(from[0], nose[0] + 6, k) + Math.sin(k * 9) * 50 * (1 - k), by = lerp(from[1], nose[1] - 4, k) - Math.sin(k * Math.PI) * 140;
      bee(bx, by, 3.4, -1);
    }
    camEnd();
    caps(t);
    wipeIn(lt, [NP.grassDk, NP.grass]);
    if (lt > dur - .25) whipH(seg(lt, dur - .25, dur), 1, t);
  }

  // ================= E · Kailash: "don't tell Vishnu"; he zooms straight off =================
  function shotShiva(t, lt, dur) {
    camK(t, [[E0, [520, 1400, 1.25]], [WAG, [500, 1410, 1.3]], [ZOOM, [540, 1400, 1.24]], [E0 + 9.3, [460, 1420, 1.3]]]);
    kailashSet(t);
    // Shiva: serene; hears him out; wags a finger; watches him zoom; facepalms
    const wag = t > WAG && t < NOD, palm = ease(seg(t, PALM, PALM + .3));
    const sm = act(t, [[0, 'serene'], [WAG - .3, 'determined'], [ZOOM + .1, 'surprised'], [PALM, 'bored']], { take: .5 });
    const so = { ...sm, boilKey: 'shivaE', eyes: t > PALM ? 'closed' : t > ZOOM ? 'wide' : t > WAG - .3 ? 'normal' : 'closed', mouth: wag ? 'open' : t > PALM ? 'flat' : 'smile', lookX: t > ZOOM && t < PALM ? 1 : .6 };
    if (wag) { so.handR = [7.2 + Math.sin((t - WAG) * 14) * .7, -15.5]; so.bendR = .4; }
    if (palm > .01) { so.handR = [lerp(5.6, 1.6, palm), lerp(-3.55, -13.2, palm)]; so.bendR = -1; so.emote = 'sweat'; }
    shiva(270, 1520, 19, so);
    // Narada: sails in on his cloud from the left, chest puffed, strumming; nods hard; ZOOMS off to the right
    const inN = ease(clamp((t - E0) / 1.5)), zk = easeIn(seg(t, ZOOM, ZOOM + .35));
    const nx = lerp(-260, 730, inN) + 1100 * zk, ny = 1460 + 14 * Math.sin(t * 2.2);
    const nod = t > NOD && t < ZOOM ? Math.abs(Math.sin((t - NOD) * 16)) : 0;
    const nm = t > WAG && t < NOD ? 'flat' : 'smug';
    const no = { boilKey: 'narE', cloud: 1, puff: t < WAG ? 1 : .4, eyes: t > WAG && t < NOD ? 'normal' : 'smug', mouth: t > NOD ? 'grin' : nm, hx: -.5, lookX: -1, bow: .5 * nod, strum: t < WAG ? 1 : 0, seed: 3, rot: -.15 * zk };
    if (t < ZOOM + .5) narada(nx, ny, 18.5, no);
    if (zk > 0 && zk < 1) { boilSeed('zoomlines'); for (let i = 0; i < 5; i++) { const x0 = Math.max(nx - 110 - i * 15, 560), x1 = Math.max(nx - 380 - i * 30, 540); if (x0 - x1 > 20) inkLine([[x0, ny - 420 + i * 70], [x1, ny - 420 + i * 70]], 3, '#FFFFFF', 'inkfine', 0); } }
    vanishPuff(730, ny - 30, 120, t - ZOOM - .05, 'zoompuff', ['#FFFFFF', '#DDEBF7']);
    camEnd();
    caps(t);
    if (lt < .25) whipH(1 - lt / .25, 1, t);
    if (lt > dur - .25) whipH(seg(lt, dur - .25, dur), 1, t);
  }

  // ================= F · the milk ocean: he brags; the tree of pride; Vishnu's wink =================
  function shotOcean(t, lt, dur) {
    camK(t, [[F0, [540, 1380, 1.2]], [SPROUT, [420, 1300, 1.38]], [WINK - .3, [540, 1380, 1.22]], [WINK + .2, [740, 1270, 1.6]], [G0, [740, 1270, 1.66]]]);
    oceanSet(t);
    // Vishnu on Shesha: listening, notices the sprout (brows up), winks at us, the chakra sparkles
    const wk = t > WINK && t < WINK + 1.2;
    const vo = { boilKey: 'vishF', lookX: t > WINK - .2 && t < WINK + 1.4 ? 0 : -.8, brows: t > NOTICE && t < WINK ? .9 : 0, mouth: wk ? 'sheepish' : 'smile', wink: wk, eyes: 'normal', chakraSpin: t * (t > SPARK ? 14 : 4) };
    shesha(790, 1440, 23, { boilKey: 'sheshaF' });
    vishnu(790, 1440, 23, vo);
    const ch = vishnuChakra(790, 1440, 23, vo);
    sparkleBurst(ch[0], ch[1], 80, t - SPARK, 'chakF', 8);
    // Narada on his cloud: brags with a mime of the bow, flexes, the sapling sprouts on his topknot
    const mime = ease(seg(t, MIME, MIME + .25)) * (1 - ease(seg(t, FLEX - .2, FLEX)));
    const flex = ease(seg(t, FLEX, FLEX + .3));
    const no = { boilKey: 'narF', cloud: 1, puff: .6 + .4 * flex, eyes: 'smug', mouth: mime > .5 ? 'open' : 'smug', hx: .45, lookX: .8, seed: 4, hat: pride(t), veena: true };
    if (mime > .01) { no.handR = [lerp(3.45, 7.8, mime), lerp(-10.8, -17.5, mime)]; no.handL = [lerp(-2.35, 2.2, mime), lerp(-13.2, -16.8, mime)]; no.bendR = .2; }
    else if (flex > .01) { no.handR = [lerp(3.45, 3.1, flex), lerp(-10.8, -12.3, flex)]; no.bendR = 2; }
    narada(280, 1560 + 12 * Math.sin(t * 2), 20, no);
    camEnd();
    caps(t);
    if (lt < .25) whipH(1 - lt / .25, 1, t);
    if (lt > dur - .2) flash(seg(lt, dur - .2, dur), '#FFF6DC');
  }

  // ================= G · the magic city rises; the princess; hearts =================
  function shotCity(t, lt, dur) {
    camK(t, [[G0, [540, 1050, .95]], [CITY + 1.6, [540, 1120, .98]], [PRIN - .6, [560, 1420, 1.3]], [P0, [540, 1440, 1.38]]]);
    citySet(t, seg(t, CITY, CITY + 1.6));
    // Narada floats in on his cloud and steps down onto the road
    const inN = ease(clamp((t - G0) / 2.2)), land = ease(seg(t, PRIN - 1, PRIN - .4));
    const nx = lerp(-200, 330, inN), ny = lerp(1280, 1620, land) + 10 * Math.sin(t * 2) * (1 - land);
    const nm = act(t, [[0, 'smug'], [HEARTS - .2, 'surprised'], [HEARTS + .2, 'love']], { take: .8 });
    const love = t > HEARTS;
    const no = { ...nm, boilKey: 'narG', cloud: 1 - land, noShadow: land < .9, puff: love ? 0 : .5, eyes: love ? 'heart' : t > HEARTS - .2 ? 'wide' : 'smug', mouth: love ? 'grin' : t > HEARTS - .2 ? 'O' : 'smug', hx: .5, lookX: 1, seed: 5, hat: pride(t), blush: love ? .8 : 0, emote: love ? 'hearts' : undefined };
    narada(nx, ny, 16, no);
    // the princess walks in from the right holding her garland
    const pw = ease(clamp((t - PRIN) / 1.1)), px = lerp(1250, 790, pw);
    const po = { boilKey: 'priG', pal: PRI_PAL, walk: pw < 1 ? (t - PRIN) * 1.6 : undefined, eyes: 'normal', mouth: 'smile', lookX: -.4, hx: -.2, handL: [-2.3, -12.6], handR: [2.3, -12.6], bendL: 1.2, bendR: 1.2 };
    if (t > PRIN) { parvati(px, 1640, 16, po); garlandInHands(px, 1640, 16, po); }
    camEnd();
    caps(t);
    if (lt < .2) flash(1 - lt / .2, '#FFF6DC');
  }
  function garlandInHands(x, y, u, o) {
    const a = parvatiHand(x, y, u, o, -1), b = parvatiHand(x, y, u, o, 1), P = [];
    for (let i = 0; i <= 10; i++) { const k = i / 10; P.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * Math.PI) * 4.2 * u]); }
    boilSeed('garland hands');
    through(P).forEach((p, i) => { if (i % 2 === 0) paint(ellPts(p[0], p[1], .38 * u, .36 * u, 10), { wash: i % 3 === 1 ? VSN.flower : VSN.flower2, ink: NP.ink, sw: .4 }); });
  }

  // ================= P · her palm; he swoons =================
  function shotPalm(t, lt, dur) {
    camBegin(540, 1180 - 10 * lt, 1.0 + .015 * lt);
    palaceSet(t);
    const sw = ease(seg(t, SWOON, SWOON + .5));
    const nm = act(t, [[0, 'surprised'], [LINES + .9, 'love'], [SWOON, 'starstruck']], { take: .7 });
    const no = { ...nm, boilKey: 'narP', eyes: t > LINES + .9 ? 'heart' : 'wide', mouth: t > LINES + .9 ? 'grin' : 'O', lookY: .7, seed: 6, hat: pride(t), blush: t > LINES + .9 ? .9 : 0,
      sweat: t > LINES + .3 && t < SWOON, rot: sw * .1 * Math.sin((t - SWOON) * 3), handL: [-2.6, -8.8], handR: [2.8, -8.8], bendL: -1, bendR: -1, veena: false, emote: t > SWOON ? 'hearts' : undefined };
    narada(500, 1830, 36, no);
    // her arm from the right, the palm in his hands
    boilSeed('priarm');
    paint(ribbon([[1250, 1720], [900, 1660], [660, 1610]], 60, 46), { wash: PRV.skin, fill: PRV.skinDk, fillOp: 40, tex: .4, ink: PRV.ink, sw: 1.2 });
    for (const k of [0, 1, 2]) inkLine([[740 + k * 24, 1595], [748 + k * 24, 1665]], 9, k === 1 ? PRI_PAL.gold : PRI_PAL.bangle, 'ink', 0);
    palmClose(505, 1550, .5, seg(t, LINES, LINES + 1.2), t);
    camEnd();
    caps(t);
    wipeOut(lt, dur, GOLDW);
  }

  // ================= H · "give me your looks"; Vishnu's wink; POOF: the monkey face =================
  function shotBeg(t, lt, dur) {
    camK(t, [[H0, [560, 1380, 1.22]], [POOF - .3, [540, 1380, 1.25]], [POOF + .1, [350, 1200, 1.85]], [I0, [350, 1190, 1.95]]]);
    citySet(t, 1);
    // Vishnu: pops in on a cloud, listens, winks at us, makes the face; leaves
    const vin = backOut(seg(t, VIN, VIN + .35)), vout = seg(t, VOUT, VOUT + .2);
    if (t > VIN && vout < 1) {
      const vx = 780, vy = 1240 + 10 * Math.sin(t * 1.7);
      boilSeed('vcloud');
      for (const [dx, r] of [[-110, 80], [0, 100], [110, 80]]) paint(ellPts(vx + dx * vin, vy + 30, r * vin, r * .5 * vin, 16, 2), { wash: '#FFFFFF', fill: NP.skyDk, fillOp: 30, tex: .3, ink: NP.ink, sw: .6 });
      const wk = t > WINK2 && t < WINK2 + 1.1;
      push(); translate(vx, vy); scale(vin * (1 - vout)); translate(-vx, -vy);
      vishnu(vx, vy, 19, { boilKey: 'vishH', lookX: wk ? 0 : -.8, wink: wk, mouth: wk ? 'sheepish' : 'smile', handR: t > POOF - .4 && t < POOF + .5 ? [3.4, -6.2] : undefined });
      pop();
      sparkleBurst(vx, vy - 100, 120, t - VIN, 'vin', 8);
      sparkleBurst(vx, vy - 100, 120, t - VOUT, 'vout', 8);
    }
    // Narada: begs (palms joined, bobbing); the POOF; feels his face, loves it, preens (the hook's rhyme)
    const monk = t > POOF + .12, feelK = ease(seg(t, POOF + .4, POOF + .6)) * (1 - ease(seg(t, PREEN2 - .2, PREEN2)));
    const pr = ease(seg(t, PREEN2, PREEN2 + .25)) * (1 - ease(seg(t, PREEN2 + 1.1, PREEN2 + 1.4)));
    const beg = t < POOF - .2;
    const no = { boilKey: 'narH', monkey: monk ? 1 : 0, pray: beg ? 1 : 0, bow: beg ? .3 + .25 * Math.abs(Math.sin(t * 5)) : 0, eyes: beg ? 'happy' : monk ? (feelK > .5 ? 'wide' : 'smug') : 'closed', mouth: beg ? 'open' : monk ? 'grin' : 'O',
      hx: beg ? .3 : 0, puff: monk ? .5 : 0, seed: 7, hat: pride(t), htilt: -.08 * pr };
    if (feelK > .01) { no.handL = [-3.2, -19.6]; no.handR = [3.2, -19.6]; no.bendL = -1; no.bendR = 1; }
    if (pr > .01) { no.handR = [lerp(3.45, 4.3, pr), lerp(-10.8, -25.2, pr)]; no.bendR = lerp(.6, 2.2, pr); }
    narada(330, 1640, 19, no);
    vanishPuff(330, 1640 - 21 * 19, 150, t - POOF, 'poof', ['#FFF3D6', '#E8C8A0']);
    const m = naradaMouth(330, 1640, 19, no);
    sparkleBurst(m[0] + 14, m[1] - 4, 36, t - TING2, 'ting2', 6, ['#FFFFFF', '#FFF2B0']);
    camEnd();
    caps(t);
    wipeIn(lt, GOLDW);
    wipeOut(lt, dur, [NP.hallDk, NP.hall]);
  }

  // ================= I · the swayamvara: the ganas giggle; she won't look; he pops up; she garlands Vishnu =================
  function shotHall(t, lt, dur) {
    camK(t, [[I0, [330, 1400, 1.6]], [PIN - .6, [340, 1400, 1.6]], [PIN, [470, 1360, 1.36]], [KING - .2, [560, 1360, 1.3]], [KING + .4, [700, 1360, 1.24]], [JAW - .3, [700, 1360, 1.24]], [JAW, [420, 1390, 1.5]], [J0, [410, 1390, 1.55]]]);
    hallSet(t);
    // the ganas, in brahmin disguise, behind him: giggle, point
    const giggle = Math.abs(Math.sin(t * 9)) * .3;
    for (const [i, gx, gy, gu] of [[0, 120, 1610, 12], [1, 240, 1575, 11.5]]) {
      const pt = (t > GIG + .4 + i * .3 && t < PIN) || t > JAW;
      ganaBrahmin(gx, gy, gu, { boilKey: 'gana' + i, eyes: 'happy', mouth: 'laugh', dy: -giggle, seed: i, handL: pt ? [-3.6, -13] : [-1, -16.2], handR: pt ? [6.5, -17] : [1, -16.2], fistR: !pt, fistL: true, hx: .3 });
    }
    // Narada (the monkey face) standing tall, smug; pops up on his toes every time she looks away
    let hop = 0; for (const p of POPS) hop += Math.exp(-Math.max(0, t - p) * 3.5) * (t > p ? 1 : 0) * Math.sin(Math.min(Math.PI / 2, (t - p) * 12));
    const jaw = t > JAW;
    const nm = act(t, [[0, 'smug'], [SEES + .2, 'surprised'], [POPS[0], 'excited'], [JAW, 'surprised']], { take: .5 });
    const no = { ...nm, boilKey: 'narI', monkey: 1, eyes: jaw ? 'wide' : t > SEES ? 'normal' : 'smug', mouth: jaw ? 'scream' : t > SEES + .3 ? 'grin' : 'smug', puff: jaw ? 0 : .8, seed: 8, hat: pride(t),
      dy: nm.dy - 3.2 * hop, sq: (nm.sq || 0) - .22 * hop, lookX: t > PIN ? 1 : 0, hx: t > PIN ? .4 : 0, handR: hop > .2 ? [5.4, -24] : undefined, bendR: -.5 };
    narada(400, 1660, 19, no);
    // Vishnu, a king: two arms, on a throne at the right
    const kin = backOut(seg(t, KING, KING + .4));
    if (kin > .01) {
      boilSeed('throne');
      paint(rrPts(870, 1300, 260, 340, 30), { wash: TK.gold, fill: TK.goldDk, fillOp: 60, tex: .5, ink: NP.ink, sw: 1 });
      paint(rrPts(830, 1520, 340, 70, 20), { wash: NP.hallDk, ink: NP.ink, sw: .8 });
      push(); translate(1000, 1530); scale(kin); translate(-1000, -1530);
      vishnu(1000, 1530, 21, { boilKey: 'vishI', four: false, garland: seg(t, GARL, GARL + .5) * (t > GARL ? 1 : 0), eyes: t > GARL + .3 ? 'happy' : 'normal', lookX: -.6, mouth: 'smile', chakra: 0, shankh: 0 });
      pop();
      sparkleBurst(1000, 1400, 140, t - KING, 'king', 9);
    }
    // the princess: walks in, sees him, turns her face away (each pop, further), walks to the king, garlands him
    if (t > PIN) {
      const pw = ease(clamp((t - PIN) / 1)), pw2 = ease(seg(t, KING + .3, GARL - .1));
      const px = lerp(1350, 690, pw) + 150 * pw2, away = t > SEES ? clamp(.6 + .2 * POPS.filter(p => t > p).length) : 0;
      const pm = act(t, [[0, 'happy'], [SEES, 'disgusted'], [KING + .3, 'love']], { take: .5 });
      const garl = t > GARL - .4 && t < GARL;
      const po = { ...pm, boilKey: 'priI', pal: PRI_PAL, walk: (pw < 1 || (pw2 > 0 && pw2 < 1)) ? t * 1.6 : undefined, hx: t > KING + .3 ? .6 : away, lookX: t > KING + .3 ? 1 : t > SEES ? 1 : -1, eyes: t > KING + .3 ? 'normal' : t > SEES ? 'closed' : 'normal', mouth: t > SEES && t < KING ? 'flat' : 'smile',
        handL: garl ? [-2.6, -19] : [-2.3, -12.6], handR: garl ? [2.6, -19] : [2.3, -12.6], bendL: 1.2, bendR: 1.2 };
      parvati(px, 1660, 16, po);
      if (t < GARL) garlandInHands(px, 1660, 16, po);
      if (t > SEES && t < KING) emote('anger', px + 70, 1660 - 26 * 16, 16, clamp((t - SEES) * 4), t);
    }
    camEnd();
    caps(t);
    wipeIn(lt, [NP.hallDk, NP.hall]);
    if (lt > dur - .25) whipH(seg(lt, dur - .25, dur), 1, t);
  }

  // ================= J · the pond: the reflection, the scream, the ganas cursed, his face back, still fuming =================
  function pov(t, monkey, o) {   // looking down into the water: his face looks back
    camBegin(540, 980 + 8 * Math.sin(t * 1.3), 1);
    pondWater(t, 'under');
    narada(540, 2330, 56, { boilKey: 'narJpov', monkey, noShadow: true, veena: false, seed: 9, hat: pride(t), ...o });
    pondWater(t, 'over', o.ripple || 0);
    camEnd();
  }
  function shotPond(t, lt, dur) {
    if (t >= REFLECT && t < WIDE2) {
      const scr = t > SCREAM;
      pov(t, 1, { eyes: scr ? 'wide' : t > REFLECT + .4 ? 'wide' : 'smug', mouth: scr ? 'scream' : t > REFLECT + .4 ? 'O' : 'grin', handL: scr ? [-4.4, -20] : undefined, handR: scr ? [4.4, -20] : undefined, bendL: -1, bendR: 1, ripple: scr ? 1 : 0, dx: scr ? .15 * Math.sin(t * 50) : 0 });
      caps(t);
      if (t < REFLECT + .15) flash(1 - (t - REFLECT) / .15, NP.waterLt);
      if (t > WIDE2 - .15) flash(seg(t, WIDE2 - .15, WIDE2), '#FFFFFF');
      return;
    }
    if (t >= FACEBACK) {
      const ang = t > STEAM;
      pov(t, 0, { eyes: ang ? 'angry' : 'happy', mouth: ang ? 'frown' : 'smile', brow: ang ? -1 : .3, emote: ang ? 'steam' : undefined, emoteK: clamp((t - STEAM) * 4), handL: t < STEAM ? [-3.2, -19.6] : undefined, handR: t < STEAM ? [3.2, -19.6] : undefined, bendL: -1, bendR: 1, tint: ang ? '#E86A50' : undefined, tintK: ang ? .25 * seg(t, STEAM, STEAM + .5) : 0 });
      caps(t);
      if (t < FACEBACK + .15) flash(1 - (t - FACEBACK) / .15, NP.waterLt);
      if (lt > dur - .25) whipH(seg(lt, dur - .25, dur), 1, t, [TK.cream, NP.duskLt]);
      return;
    }
    // the wide garden: he walks to the pond and leans over; later the curse on the ganas, who turn into demons and run
    camK(t, [[J0, [500, 1360, 1.22]], [LOOK, [460, 1380, 1.32]], [WIDE2, [540, 1340, 1.18]], [FACEBACK, [560, 1340, 1.22]]]);
    gardenSet(t);
    const after = t > WIDE2, walkK = ease(clamp((t - J0) / 1.2));
    const nx = after ? 360 : lerp(170, 360, walkK);
    const cur = ease(seg(t, CURSEG - .25, CURSEG));
    const no = { boilKey: 'narJ', monkey: 1, walk: !after && walkK < 1 ? t * 1.6 : undefined, bow: after ? 0 : ease(seg(t, LOOK, LOOK + .3)), eyes: after ? 'angry' : 'smug', mouth: after ? 'open' : 'grin', brow: after ? -1 : 0, seed: 10, hat: pride(t), lookX: after ? 1 : .3, lookY: after ? 0 : .8 };
    if (cur > .01) { no.handR = [lerp(3.45, 8.2, cur), lerp(-10.8, -17.5, cur)]; no.bendR = .2; }
    narada(nx, 1460, 17, no);
    // the ganas: laugh and point; the curse; POOF, demons; they run off right
    for (const [i, gx, gy, gu] of [[0, 760, 1480, 12], [1, 880, 1450, 11.5]]) {
      const dm = t > DEMON, fl = seg(t, FLEE + i * .15, FLEE + i * .15 + 1.6), x = gx + 900 * easeIn(fl);
      if (fl >= 1) continue;
      const o = dm ? { eyes: t < FLEE ? 'wide' : 'scared', mouth: t < FLEE ? 'O' : 'wobble', walk: t > FLEE ? t * 3 : undefined, sweat: 1, handL: [-4.5, -17.5], handR: [4.5, -17.5], fistL: false, fistR: false }
        : { eyes: 'happy', mouth: 'laugh', dy: -Math.abs(Math.sin(t * 9)) * .3, handL: [-1, -16.2], handR: [-6, -17], fistR: false };
      ganaBrahmin(x, gy, gu, { boilKey: 'ganaJ' + i, demon: dm ? 1 : 0, seed: i, ...o });
      vanishPuff(gx, gy - 14 * gu, 110, t - DEMON, 'ganapuff' + i, ['#FFD0C0', '#FF8A6A']);
    }
    if (t > CURSEG - .05) {
      const h = naradaHand(nx, 1460, 17, no, 1);
      bolt(h, [800, 1300], (t - CURSEG) / .7, NP.curse, 'curseJ');
    }
    camEnd();
    caps(t);
    if (t > REFLECT - .15 && t < REFLECT) flash(seg(t, REFLECT - .15, REFLECT), NP.waterLt);
    if (t > FACEBACK - .15) flash(seg(t, FACEBACK - .15, FACEBACK), NP.waterLt);
    if (t > WIDE2 && t < WIDE2 + .15) flash(1 - (t - WIDE2) / .15, '#FFFFFF');
    if (lt < .25) whipH(1 - lt / .25, 1, t);
  }

  // ================= K · the curse on Vishnu: the vision; he accepts; the illusion vanishes =================
  const GX = 650, GY = 1580, GS = 22;
  function shotCurse(t, lt, dur) {
    camK(t, [[K0, [560, 1290, 1.08]], [CURSE, [560, 1280, 1.1]], [ACCEPT, [600, 1300, 1.16]], [M0, [600, 1300, 1.2]]], shakeXY(t, 8 * (t > CURSE && t < CURSE + .4 ? 1 : 0)));
    const maya = 1 - ease(seg(t, VANISH, VANISH + .8));
    roadSet(t, maya);
    // the vision in the sky
    const vk = backOut(seg(t, CURSE + .2, CURSE + .5)) * (1 - ease(seg(t, ACCEPT - .3, ACCEPT + .2)));
    if (vk > .01) {
      boilSeed('kvision');
      glow(560, 1000, 300 * vk, '#FF9A4A', .5);
      paint(ellPts(560, 1000, 210 * vk, 210 * vk, 36, 3), { wash: NP.visGold, fill: '#F2A040', fillOp: 70, bleed: .2, tex: .5, ink: null });
      const pk = t0 => backOut(clamp((t - t0) / .35)) * vk;
      ramSil(470, 1120, .42, pk(RAM_V));
      deerSil(630, 1040, .48, pk(SITA_V), t * 8);
      for (let i = 0; i < 4; i++) vanaraSil(420 + i * 95, 1170 + (i % 2) * 10, .3, pk(VAN_V + i * .1), t * 9 + i);
    }
    // Lakshmi and the princess beside Vishnu, until the illusion goes
    for (const [i, lx, pal, hook] of [[0, 960, LAK_PAL, (u, sw) => lotus(u * .9, sw, 1)], [1, 845, PRI_PAL, null]]) {
      const v = seg(t, VANISH + i * .15, VANISH + i * .15 + .3);
      if (v < 1) { push(); translate(lx, 1580); scale(1 - v * .3, 1 - v); translate(-lx, -1580); parvati(lx, 1580, 13, { boilKey: 'womanK' + i, pal, eyes: t > CURSE ? 'wide' : 'normal', mouth: t > CURSE ? 'O' : 'smile', lookX: -1, hx: -.3, armL: hook, handL: hook ? [-3, -15] : undefined }); pop(); }
      sparkleBurst(lx, 1580 - 200, 130, t - VANISH - i * .15, 'vanish' + i, 9);
    }
    // Vishnu on Garuda (landed): takes the curse calmly, bows, palms joined, smiling
    const acc = ease(seg(t, ACCEPT, ACCEPT + .4));
    const gp = { flap: .2 * Math.sin(t * 3), flip: true, pal: GARUDA_PAL, ring: false, hat: garudaCrown, brow: true, boilKey: 'garK', eyes: t > CURSE && t < ACCEPT ? 'wide' : 'normal' };
    kamaParrot(GX, GY, GS, { ...gp, only: 'body' });
    const seat = parrotSeat(GX, GY, GS, gp);
    vishnu(seat[0], seat[1], 17, { boilKey: 'vishK', flip: true, joined: acc, bow: acc * .6, eyes: acc > .5 ? 'closed' : 'normal', mouth: 'smile', lookX: -.6 });
    kamaParrot(GX, GY, GS, { ...gp, only: 'wing' });
    // Narada: his own face, furious, points the curse; then blinks
    const pt = ease(seg(t, CURSE - .3, CURSE)) * (1 - ease(seg(t, ACCEPT + .2, ACCEPT + .6)));
    const nm = act(t, [[0, 'angry'], [CURSE - .3, 'furious'], [VANISH + .4, 'surprised']], { take: .5 });
    const no = { ...nm, boilKey: 'narK', eyes: t > VANISH + .4 ? 'wide' : 'angry', brow: t > VANISH + .4 ? .8 : -1, mouth: t > VANISH + .4 ? 'O' : 'open', seed: 11, hat: pride(t), lookX: 1, hx: .3,
      tint: t < VANISH ? '#E86A50' : undefined, tintK: t < VANISH ? .3 : 0, emote: t > VANISH + .4 ? '?' : 'steam', emoteK: 1 };
    if (pt > .01) { no.handR = [lerp(3.45, 8.4, pt), lerp(-10.8, -18, pt)]; no.bendR = .2; }
    narada(200, 1640, 18, no);
    if (t > CURSE - .05) bolt(naradaHand(200, 1640, 18, no, 1), [seat[0], seat[1] - 120], (t - CURSE) / 1, NP.curse, 'curseK');
    if (t > VAN_V - .05) bolt(naradaHand(200, 1640, 18, no, 1), [seat[0], seat[1] - 120], (t - VAN_V) / 1, NP.curse, 'curseK2');
    camEnd();
    caps(t);
    if (lt < .25) whipH(1 - lt / .25, 1, t, [TK.cream, NP.duskLt]);
    if (lt > dur - .25) flash(seg(lt, dur - .25, dur), '#FFF0C4');
  }

  // ================= M · at his feet; "it was my will"; the tree of pride drops =================
  function shotForgive(t, lt, dur) {
    camK(t, [[M0, [460, 1420, 1.25]], [DROP, [380, 1460, 1.4]], [N0, [370, 1470, 1.44]]]);
    goldSet(t);
    const bl = ease(seg(t, BLESS, BLESS + .3));
    boilSeed('mcloud');
    for (const [dx, r] of [[-130, 90], [0, 115], [130, 90]]) paint(ellPts(640 + dx, 1440, r, r * .5, 16, 2), { wash: '#FFFFFF', fill: NP.skyDk, fillOp: 30, tex: .3, ink: NP.ink, sw: .6 });
    if (bl > .01) glow(640 + 3 * 21, 1410 - 5.5 * 21, 180 * bl, '#FFE9A8', .5);
    vishnu(640, 1410 + 8 * Math.sin(t * 1.5), 21, { boilKey: 'vishM', eyes: 'happy', mouth: 'smile', lookX: -.7, handR: bl > .01 ? [lerp(2.7, 3.2, bl), lerp(-4.7, -6.2, bl)] : undefined });
    const up = ease(seg(t, LOOKUP, LOOKUP + .4)) * (1 - ease(seg(t, DROP + 1.4, DROP + 1.8)));
    const no = { boilKey: 'narM', sit: 1, pray: 1, bow: 1 - .7 * up, eyes: up > .5 ? 'happy' : 'closed', mouth: up > .5 ? 'sheepish' : 'flat', hx: .4, lookX: .8, seed: 12, hat: pride(t), veena: true };
    narada(270, 1650, 19, no);
    if (t > DROP + .3 && t < DROP + 1.6) sparkleBurst(270, 1650, 60, t - DROP - 1.1, 'leafland', 5, [NP.sapWilt, '#FFF0C4']);
    camEnd();
    caps(t);
    if (lt < .25) flash(1 - lt / .25, '#FFF0C4');
    wipeOut(lt, dur, [TK.marigold, TK.petal]);
  }

  // ================= N · the ask =================
  function shotAsk(t, lt, dur) {
    camBegin(540, 1200, 1.05);
    peachSet(t);
    boilSeed('askfloor');
    paint(ellPts(470, 1660, 300, 60, 20, 3), { fill: '#C8925A', fillOp: 70, bleed: .2, tex: .4, ink: null });
    const wk = t > N0 + 2.4 && t < N0 + 3.2;
    narada(470, 1650, 22, { boilKey: 'narN', strum: 1, eyes: wk ? 'wink' : 'closed', mouth: wk ? 'grin' : 'smile', hx: .1 * Math.sin(t * 2.4), htilt: .06 * Math.sin(t * 2.4), dy: -.2 * Math.abs(Math.sin(t * 2.4)), emote: 'music', seed: 13 });
    camEnd();
    caps(t);
    wipeIn(lt, [TK.marigold, TK.petal]);
    wipeOut(lt, dur, [TK.marigold, TK.rkOrange]);
  }

  // ================= O · the card =================
  function shotCard(t, lt) {
    narCard(t, CARDC);
    flushLetters();
    narStrike(t, CARDC);
    if (lt < .3) brushWipe(.5 + lt / .6, [TK.marigold, TK.rkOrange]);
  }

  shots([[0, shotHook], [B0, shotVision], [D0, shotKama], [E0, shotShiva], [F0, shotOcean], [G0, shotCity], [P0, shotPalm], [H0, shotBeg], [I0, shotHall], [J0, shotPond], [K0, shotCurse], [M0, shotForgive], [N0, shotAsk], [CARD, shotCard]]);
})();
