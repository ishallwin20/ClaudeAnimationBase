// hanu8.js: "RAM gave everyone JEWELS. HANUMAN asked for this." (ad 96, Hanuman series Part 8, 92.2 s, Bangers captions,
// retro SFX, no voice). Valmiki Ramayana, Uttara Kanda, read verse by verse in Sanskrit on 15 Nov 2026 in the edition at
// heritage.iitk.ac.in/VRAM (sargas 39, 40, 107, 108 there): the kings' gifts reach Ram and he gives them to Sugriva,
// Vibhishana and the others, who wear them on their heads and arms (39.8–15); they stay over a month, then a second,
// and it feels like a moment (39.27–29); Ram sends Sugriva to Kishkindha and Vibhishana to Lanka (40.1–11); Hanuman
// bows and speaks: "let my love for you stay always, my devotion steady, my heart go nowhere else (40.15); as long as
// Ram's story goes about the earth, let breath stay in my body (40.16); let apsaras tell it to me (40.17); hearing it I
// will scatter my longing as wind does a line of cloud (40.18)"; Ram rises from his throne and embraces him (40.19):
// "so it will be: as long as my story goes about the world, your fame and your breath will last (40.20); my story
// will stand as long as the worlds stand (40.21); for each good deed of yours I would give my life (40.22)"; he takes
// from his own neck a necklace bright as the moon, a vaidurya at its centre, and ties it on Hanuman (40.23–24); the
// others bow and go in tears, like a soul leaving its body (40.25–29). At the end the people of Ayodhya (107.12–16)
// and the vanaras, bears and rakshasas (108.17–22) ask to go with Ram and he agrees (108.26, 38); to Hanuman: "you set
// your mind on living: do not break your promise; as long as my story goes about the world, be glad, keeping my word"
// (108.33–34); Hanuman, in great joy: "I will stay on earth, keeping your command" (108.35–36).
// The text has no "ask for anything": Hanuman speaks unasked. STORYBOARD.md has the plan and the sources; props are in
// hanu8_props.js (and hanu4/5/6/7_props.js, sanj_props.js); the kit is src/hanuman_series.js. Times are video time (t);
// tools/hanu8_sfx.mjs uses the same constants.
(() => {
  // ---- time constants (keep in sync with STORYBOARD.md and tools/hanu8_sfx.mjs)
  const ASK = 2.6;
  const B0 = 4.4, C0 = 8.8, GIVE = 9.8, D0 = 13.2, E0 = 17.6, NOGOLD = 19.2, NOCROWN = 20.4, F0 = 22.2, G0 = 27.2, H0 = 32.2, BLOW = 35.4;
  const I0 = 37.4, HUG = 38.9, J0 = 41.8, K0 = 47.0, L0 = 51.6, LIFT = 52.4, TIE = 53.8, M0 = 56.6, N0 = 61.2, O0 = 66.0, YES = 66.7;
  const P0 = 70.4, TURN = 71.2, Q0 = 75.4, GLAD = 78.2, U0 = 80.6, V0 = 85.4, GONE = 86.6, ASH = 87.2, CARD = 88.6;
  const CARDC = hsCardTimes(CARD);

  const GOLDC = '#F5C542';
  const popk = (t, t0, k = 4) => backOut(clamp((t - t0) * k));
  const wipeIn = (lt, cols) => { if (lt < .3) { flushLetters(); brushWipe(.5 + lt / .6, cols); } };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) { flushLetters(); brushWipe((lt - (dur - .3)) / .6, cols); } };
  const talk = (t, a, b, rest = 'smile', open = 'open') => (t > a && t < b && Math.sin((t - a) * 19) > -.2) ? open : rest;
  const blinkAt = (t, t0, d = .13) => t > t0 && t < t0 + d;
  const kick = (t, t0) => t > t0 ? .05 * Math.exp(-(t - t0) * 6) * Math.cos((t - t0) * 20) : 0;
  const hop = (g, a = .3, f = 8, d = 1.6) => g > 0 ? -a * Math.abs(Math.sin(g * f)) * Math.exp(-g * d) : 0;
  const hearts = (x, y, t, t0, key, n = 3, s = 22) => { if (t < t0) return; boilSeed(key); for (let i = 0; i < n; i++) { const a = t - t0 - i * .22; if (a < 0 || a > 1.6) continue; const px = x + (i - 1) * s * 2.1 + Math.sin(a * 5 + i) * s * .6, py = y - a * s * 7, r = s * backOut(clamp(a * 4)) * (1 - clamp((a - 1.1) / .5)); paint(heartPts(px, py, r), { wash: '#F2557A', ink: HSK.ink, sw: .8 }); } };
  const heartAt = (x, y, r, key, col = '#F2557A') => { boilSeed(key); paint(heartPts(x, y, r), { wash: col, ink: HSK.ink, sw: clamp(r / 30, .5, 1.2) }); };
  const HALLW = [P1.hall, P1.hallDk], PEACH = [HSK.marigold, HSK.petal], GOLDW = ['#F5C542', '#E8A030'], DUSKW = [H8.duskHi, H8.duskLo], LATEW = [H8.lateHi, H8.lateLo];

  // ---- the cast's fixed options
  const HN = { boilKey: 'hanu', seed: 60, gada: 0 };
  const RM = { boilKey: 'ram', seed: 12, kodanda: false };
  const SG = { boilKey: 'sug', seed: 21 }, AG = { boilKey: 'ang', seed: 27 }, JB = { boilKey: 'jam', seed: 33, staff: 0 }, VB = { boilKey: 'vib' };
  // the throne and the two-shot before it
  const TX = 250, TY = 1650, RU = 12, HX = 660, HY = 1720, HU = 12.5;
  const hallCam = (lt, z = 1.45, cx = 560, cy = 1368) => camBegin(cx, cy - lt * 3, z + .005 * lt);
  const ramOnThrone = (o = {}) => ram(TX, TY, RU, { ...RM, sit: 1, hx: .4, lookX: .8, eyes: 'happy', mouth: 'smile', ...o });
  const tearsOf = (x, y, u, o, t, key, s = .8) => { const [ex, ey] = naradaHead(x, y, u, o); tears(ex + (o.flip ? -12 : 12), ey + 30, t, key, s); };

  // ---- every caption: [text, y, t0, life, size, colour]
  const two = (a, b, t0, life, sa = 72, sb = 76, gold = 1) => [[a, 470, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 470 + (sa + sb) * .68, t0 + .35, life - .35, sb, gold === 1 ? GOLDC : undefined]];
  const three = (a, b, c, t0, life, sa = 60, sb = 60, sc = 70, gold = 2) => [[a, 466, t0 + .1, life - .1, sa, gold === 0 ? GOLDC : undefined], [b, 466 + (sa + sb) * .68, t0 + .4, life - .4, sb, gold === 1 ? GOLDC : undefined], [c, 466 + (sa + sb) * .68 + (sb + sc) * .68, t0 + 1.2, life - 1.2, sc, gold === 2 ? GOLDC : undefined]];
  const CAPS = [
    ['RAM GAVE EVERYONE JEWELS.', 470, -1, B0 + .85, 80], ['HANUMAN', 590, -1, B0 + .85, 150, GOLDC], ['ASKED FOR THIS.', 714, -1, B0 + .85, 96],
    ...two('RAM WAS KING. HIS FRIENDS STAYED ON', 'FOR OVER A MONTH. IT FELT LIKE A MOMENT.', B0, 4.3, 56, 50),
    ...two('KINGS SENT RAM HEAPS OF JEWELS.', 'HE GAVE THEM AWAY TO HIS FRIENDS.', C0, 4.3, 62, 62),
    ...two('THEN IT WAS TIME TO GO HOME.', 'SUGRIVA TO KISHKINDHA. VIBHISHANA TO LANKA.', D0, 4.3, 68, 46, -1),
    ...two('BUT FIRST, HANUMAN BOWED TO RAM.', 'HE DID NOT ASK FOR GOLD. OR A KINGDOM.', E0, 4.5, 60, 54),
    ...three('"MY KING, LET MY LOVE FOR YOU LAST.', 'LET MY DEVOTION STAY STEADY.', 'LET MY HEART GO NOWHERE ELSE."', F0, 4.9, 54, 62, 60, -1),
    ...three('"AND AS LONG AS YOUR STORY', 'IS TOLD ON THIS EARTH,', 'LET ME STAY ALIVE."', G0, 4.9, 66, 66, 96),
    ...three('"LET APSARAS SING IT TO ME.', 'IT WILL BLOW AWAY MY LONGING,', 'LIKE WIND BLOWS AWAY A CLOUD."', H0, 5.1, 62, 60, 58, -1),
    ...two('RAM ROSE FROM HIS THRONE', 'AND HUGGED HIM.', I0, 4.3, 70, 100).map((c, i) => i === 1 ? [c[0], c[1], HUG, J0 - HUG - .1, c[4], c[5]] : c),
    ...three('"SO IT WILL BE. AS LONG AS MY STORY', 'IS TOLD, YOU WILL LIVE. AND IT WILL BE TOLD', 'AS LONG AS THE WORLD STANDS."', J0, 5.1, 54, 46, 64),
    ...two('"FOR EACH THING YOU DID FOR ME,', 'I WOULD GIVE MY LIFE."', K0, 4.5, 62, 88),
    ...two('RAM TOOK THE NECKLACE OFF HIS OWN NECK,', 'BRIGHT AS THE MOON, AND TIED IT ON HANUMAN.', L0, 4.9, 50, 46, 0),
    ...two('THE OTHERS WENT HOME IN TEARS,', '"LIKE A SOUL LEAVING ITS BODY."', M0, 4.5, 62, 62, -1),
    ...two('YEARS LATER, RAM\'S TIME ON EARTH ENDED.', 'EVERYONE BEGGED: "TAKE US WITH YOU!"', N0, 4.7, 50, 56),
    ...two('RAM SAID YES. TO SUGRIVA, TO THE VANARAS,', 'TO THE PEOPLE OF AYODHYA.', O0, 4.3, 48, 70, -1),
    ...three('THEN HE TURNED TO HANUMAN:', '"YOU CHOSE TO LIVE.', 'DON\'T BREAK YOUR PROMISE."', P0, 4.9, 62, 84, 70, 1).map((c, i) => i === 2 ? [c[0], c[1], c[2], c[3], c[4], GOLDC] : c),
    ...three('"AS LONG AS MY STORY IS TOLD,', 'STAY. AND BE HAPPY."', 'AND HANUMAN WAS.', Q0, 5.1, 60, 84, 84, 1).map((c, i) => i === 2 ? [c[0], c[1], GLAD, U0 - GLAD - .1, c[4], '#FFFFFF'] : c),
    ...two('HANUMAN ASKED FOR RAM\'S STORY.', 'WHAT WOULD YOU ASK RAM FOR?', U0, 4.7, 62, 74),
    ...two('NEXT: THE MOMENT HANUMAN LEFT,', 'ARJUNA\'S CHARIOT TURNED TO ASH.', V0, 3.1, 58, 62),
  ];
  // the series marks: the part pill and the source line show in the opening only, then fade out (owner, 11 Nov)
  const MARKS = D0 - .2;
  const caps = t => {
    for (const [txt, y, t0, life, size, color] of CAPS) caption(txt, y, t - t0, { life, size, color });
    if (t < MARKS && t > B0) { hsPill(8, (1 - seg(t, MARKS - .3, MARKS)) * clamp((t - B0) * 4)); hsSource('VALMIKI RAMAYAN · UTTARA KAND', t - B0 - .3, MARKS - B0 - .3); }
  };

  // ================= A · the hook: a heap of jewels he isn't looking at; he asks for something else =================
  function shotHook(t, lt, dur) {
    const g = t - ASK, asked = g >= 0;
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbA', 540, 1300);
    h8Jewels(250, 1860, 440, t, 'jwA', 8);
    const ho = { ...HN, boilKey: 'hA', sit: 1, pray: 1, hx: .35, lookX: .7, lookY: -.6, eyes: asked ? 'happy' : blinkAt(t, 1.4) ? 'closed' : 'normal', mouth: asked ? talk(t, ASK, ASK + 1.4, 'smile', 'open') : 'smile', blush: .5, tailSway: t * 3, bow: .06 + .03 * Math.sin(t * 2) };
    hanuman(640, 1850, 22, ho);
    // what he asked for: not told yet
    const bk = popk(t, ASK, 5);
    h4Bubble(880, 1215, 125, 115, 790, 1400, bk, 'bbA', '#FFFDF2');
    if (bk > .9) { glow(880, 1215, 120, H8.goldLt, .5); letter('?', 880, 1221, 150 + 10 * Math.sin(t * 6), GOLDC, { stroke: HSK.ink, sw: .2, ink: false, rot: .06 * Math.sin(t * 3) }); }
    if (asked) sparkleBurst(880, 1215, 170, g * .8, 'spkA', 8, ['#FFFFFF', GOLDC]);
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLW);
  }

  // ================= B · Ram is king; his friends stay on, over a month, like a moment (39.26–29) =================
  const guests = (t, o = {}) => {
    sugriva(545, 1730, 11.5, { ...SG, hx: -.4, lookX: -.8, eyes: 'happy', mouth: 'grin', tailSway: t * 3, ...(o.sug || {}) });
    jambavan(850, 1740, 11.5, { ...JB, sit: 1, hx: -.4, lookX: -.8, eyes: 'happy', mouth: 'smile', ...(o.jam || {}) });
    hanuman(700, 1760, 12, { ...HN, boilKey: 'hB', sit: 1, hx: -.4, lookX: -.8, eyes: 'heart', mouth: 'smile', blush: .5, tailSway: t * 4, ...(o.han || {}) });
  };
  const mango = (x, y, s, key) => { boilSeed(key); paint(ellPts(x, y, s, s * .8, 12, 0, -.4), { wash: '#F6B23C', fill: '#E2702A', fillOp: 60, tex: .3, ink: HSK.ink, sw: .7 }); paint(ellPts(x + s * .5, y - s * .8, s * .45, s * .2, 8, 0, -.6), { wash: '#5E9A5A', ink: HSK.ink, sw: .5 }); };
  function shotStay(t, lt, dur) {
    const g = t - B0;
    hallCam(lt, 1.45, 560, 1437);
    h8Hall(t, 'hlB', TX, TY);
    ramOnThrone({ boilKey: 'rmB', handR: [5.4, -14 + .6 * Math.sin(t * 3)], bendR: -1, eyes: blinkAt(t, B0 + 2.2) ? 'closed' : 'happy' });
    const mh = { handR: [4.4, -15 + 1.2 * Math.sin(t * 5)], bendR: -1 };
    guests(t, { sug: { ...mh, dy: hop(g - .4, .4, 7, 1) }, han: { handL: [-4.4, -15 - 1.2 * Math.sin(t * 5)], bendL: 1 }, jam: { mouth: talk(t, B0 + 1, B0 + 3, 'smile', 'open') } });
    { const [mx, my] = naradaHand(545, 1730, 11.5, { ...mh, dy: hop(g - .4, .4, 7, 1) }, 1); mango(mx + 8, my - 16, 20, 'mgB1'); }
    { const ho = { sit: 1, handL: [-4.4, -15 - 1.2 * Math.sin(t * 5)], bendL: 1 }; const [mx, my] = naradaHand(700, 1760, 12, ho, -1); mango(mx - 6, my - 16, 20, 'mgB2'); }
    hearts(430, 1340, t, B0 + 1.2, 'hB1', 3, 16); hearts(760, 1330, t, B0 + 2.6, 'hB2', 3, 16);
    notes(830, 1440, t, 'ntB', GOLDC, 3);
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
  }

  // ================= C · the kings' gifts: Ram gives them away; they wear them on heads and arms (39.8–15) =================
  const gemHat = (n, key) => (u, sw) => { for (let i = 0; i < n; i++) h8Gem((i - (n - 1) / 2) * 1.5 * u, (-25.2 - (i % 2) * .9) * u, .9 * u, [H8.ruby, H8.emerald, H8.sapphire][i % 3], key + i, (i - 1) * .3); };
  function shotGifts(t, lt, dur) {
    const g = t - GIVE, given = g >= 0, k = easeOut(clamp(g / .6));
    hallCam(lt, 1.45 + kick(t, GIVE), 560, 1437);
    h8Hall(t, 'hlB', TX, TY);
    ramOnThrone({ boilKey: 'rmB', handR: given ? [6.6, -15] : [4.4, -12], bendR: -1, mouth: talk(t, C0 + .2, GIVE, 'smile', 'open') });
    h8Jewels(lerp(455, 430, k), 1790, lerp(300, 150, k), t, 'jwC', given ? 4 : 8);
    // each one, dressed in what he was given
    const wow = given ? { eyes: 'wide', mouth: 'O' } : {};
    sugriva(575, 1730, 11.5, { ...SG, hx: -.3, lookX: given ? .2 : -.8, lookY: given ? -.8 : 0, ...wow, eyes: given && g > .8 ? 'happy' : wow.eyes || 'happy', mouth: given && g > .8 ? 'grin' : wow.mouth || 'smile', tailSway: t * 3, dy: hop(g, .5, 8, 1.4), hat: given ? gemHat(3, 'ghS') : undefined, handR: given ? [5, -20] : undefined, bendR: -1 });
    jambavan(850, 1740, 11.5, { ...JB, sit: 1, hx: -.4, lookX: -.6, eyes: given && g > .5 ? 'happy' : 'normal', mouth: 'smile', dy: hop(g - .25, .4, 8, 1.6) });
    if (given && g > .25) { const [jx, jy] = naradaHead(850, 1740, 11.5, { sit: 1 }); h8Gem(jx - 4, jy - 62 + hop(g - .25, .4, 8, 1.6) * 11.5, 22, H8.ruby, 'gmJ', .1); }
    const hv = { ...HN, boilKey: 'hB', sit: 1, hx: -.4, lookX: -.8, eyes: 'happy', mouth: 'smile', blush: .4, tailSway: t * 4, dy: hop(g - .4, .4, 8, 1.6) };
    hanuman(715, 1760, 12, hv);
    if (given) { sparkleBurst(600, 1480, 260, g * .7, 'spkC', 10, ['#FFFFFF', GOLDC]); for (let i = 0; i < 3; i++) { const a = g - i * .12; if (a > 0 && a < .6) h8Gem(lerp(430, [575, 850, 715][i], a / .6), 1700 - Math.sin(a / .6 * Math.PI) * 260, 20, [H8.ruby, H8.emerald, H8.sapphire][i], 'fly' + i, a * 9); } }
    camEnd();
    caps(t);
  }

  // ================= D · time to go: Ram embraces Sugriva again and again; Vibhishana bows (40.1–11) =================
  function shotGo(t, lt, dur) {
    const g = t - D0, hug = easeOut(seg(t, D0 + .4, D0 + 1.0));
    hallCam(lt, 1.45, 620, 1368);
    h8Hall(t, 'hlB', TX, TY);
    const ro = { ...RM, boilKey: 'rmD', hx: .4, lookX: .8, lean: 1.3 * hug, eyes: hug > .8 ? 'closed' : 'normal', mouth: 'smile', handR: [6.4, -15.4], handL: [3.6, -12.4], bendR: -1, bendL: -1 };
    ram(470, 1730, 12, ro);
    const so = { ...SG, boilKey: 'sgD', hx: -.5, lookX: -.8, lean: -1.2 * hug, eyes: hug > .8 ? 'closed' : 'wide', mouth: hug > .8 ? 'frown' : 'O', handL: [-5.6, -14], handR: [-2.4, -12.6], bendL: -1, bendR: 1, tail: 'droop' };
    sugriva(620, 1730, 11.5, so);
    if (hug > .8) tearsOf(620, 1730, 11.5, so, t, 'trD1', .7);
    vibhishana(880, 1735, 11.5, { ...VB, flip: true, lookX: -1, eyes: g > 2.2 ? 'closed' : 'normal', mouth: 'flat', bow: g > 2.2 ? .25 : 0 });
    if (g > 2.4) tears(858, 1440, t, 'trD2', .7);
    hearts(545, 1330, t, D0 + 1.2, 'hD', 3, 16);
    camEnd();
    caps(t);
    wipeOut(lt, dur, HALLW);
  }

  // ================= E · but first Hanuman bows: not gold, not a kingdom (40.14) =================
  const kneel = (t, o = {}) => hanuman(HX, HY, HU, { ...HN, boilKey: 'hE', sit: 1, pray: 1, hx: -.45, lookX: -.8, lookY: -.5, eyes: 'normal', mouth: 'smile', tailSway: t * 2.5, ...o });
  const miniCrown = (x, y, s, key) => { boilSeed(key); paint([[x - s, y + s * .5], [x - s, y - s * .3], [x - s * .5, y + s * .05], [x, y - s * .8], [x + s * .5, y + s * .05], [x + s, y - s * .3], [x + s, y + s * .5]], { wash: H8.gold, fill: H8.goldDk, fillOp: 50, tex: .3, ink: HSK.ink, sw: 1 }); paint(ellPts(x, y + s * .1, s * .2, s * .24, 8), { wash: H8.ruby, ink: HSK.ink, sw: .5 }); };
  function shotBow(t, lt, dur) {
    const g = t - E0, b = ease(seg(t, E0 + .3, E0 + 1.0));
    hallCam(lt, 1.45, 500, 1360);
    h8Hall(t, 'hlB', TX, TY);
    ramOnThrone({ boilKey: 'rmB', eyes: g > 1.4 ? 'normal' : 'happy', brow: g > 1.4 ? .6 : 0, mouth: 'smile', emote: g > 3.0 ? '?' : null, emoteK: popk(t, E0 + 3.0, 6), emoteAge: g - 3.0 });
    kneel(t, { bow: .3 * b * (1 - seg(t, E0 + 1.6, E0 + 2.0)), eyes: g < 1.8 ? 'closed' : 'normal' });
    // not this… not this either
    const k1 = popk(t, NOGOLD - .5, 5), k2 = popk(t, NOCROWN - .5, 5);
    h4Bubble(420, 1265, 92, 84, HX - 60, HY - 250, k1, 'bbE1', '#FFFDF2');
    if (k1 > .9) { h8Jewels(420, 1305, 120, t, 'jwE', 4); h4Cross(420, 1265, 120, clamp((t - NOGOLD) * 5), 'xE1'); }
    h4Bubble(640, 1215, 92, 84, HX - 20, HY - 270, k2, 'bbE2', '#FFFDF2');
    if (k2 > .9) { miniCrown(640, 1220, 46, 'crE'); h4Cross(640, 1215, 120, clamp((t - NOCROWN) * 5), 'xE2'); }
    camEnd();
    caps(t);
    wipeIn(lt, HALLW);
  }

  // ================= F · "let my love for you last, my devotion stay steady, my heart go nowhere else" (40.15) =================
  function shotLove(t, lt, dur) {
    const g = t - F0;
    hallCam(lt, 1.5, 520, 1330);
    h8Hall(t, 'hlB', TX, TY);
    ramOnThrone({ boilKey: 'rmB', eyes: g > 2.6 ? 'happy' : 'normal', mouth: 'smile', blush: g > 2.6 ? .4 : 0 });
    kneel(t, { mouth: talk(t, F0 + .3, F0 + 4.2, 'smile', 'open'), eyes: g > 3.2 ? 'closed' : 'normal', blush: .5 });
    // his heart, and who is in it
    const bk = popk(t, F0 + .6, 5), beat = 1 + .06 * pulse(t, 2);
    if (bk > .05) { glow(470, 1300, 150 * bk, '#FFB0C0', .4); heartAt(470, 1292, 88 * bk * beat, 'htF'); }
    if (bk > .9) ram(470, 1346, 4.2, { ...RM, boilKey: 'rmF', noShadow: true, eyes: 'happy', mouth: 'smile' });
    hearts(600, 1300, t, F0 + 2.2, 'hF', 3, 14);
    camEnd();
    caps(t);
  }

  // ================= G · "as long as your story is told on this earth, let me stay alive" (40.16) =================
  const storyWorld = (x, y, t, k, key) => {
    if (k <= .05) return;
    glow(x, y, 190 * k, H8.goldLt, .5 * k);
    h8Earth(x, y + 34, 78 * k, t, key + 'er');
    if (k > .9) { h8Pothi(x, y - 84 + 5 * Math.sin(t * 2.4), 128, t, key + 'pt', 1); hanuman(x + 4, y - 38, 2.6, { ...HN, boilKey: key + 'h', sit: 1, noShadow: true, tail: false, eyes: 'happy', mouth: 'smile', lookY: -1 }); }
  };
  function shotAlive(t, lt, dur) {
    const g = t - G0;
    hallCam(lt, 1.5, 520, 1330);
    h8Hall(t, 'hlB', TX, TY);
    paint(rectPts(-300, -600, W + 600, 3400), { wash: '#3A1420', washOp: 70 * seg(t, G0 + .4, G0 + 1.4), ink: null });
    ramOnThrone({ boilKey: 'rmB', eyes: g > 1.6 ? 'wide' : 'normal', mouth: g > 1.6 ? 'O' : 'smile' });
    kneel(t, { mouth: talk(t, G0 + .3, G0 + 4.0, 'smile', 'open'), eyes: 'happy', blush: .5, lookY: -.8 });
    storyWorld(465, 1300, t, popk(t, G0 + .7, 4), 'swG');
    camEnd();
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= H · "let apsaras sing it to me; it will blow my longing away like wind a cloud" (40.17–18) =================
  function shotSing(t, lt, dur) {
    const g = t - H0, b = t - BLOW, blown = b >= 0, away = easeIn(clamp(b / .9));
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbH', 540, 1300);
    for (let i = 0; i < 2; i++) cloudPuff(180 + i * 720, 1960 + i * 30, 240, 'clH' + i, 230, '#FFF6EC', '#F2D2B0');
    // two apsaras, singing
    for (const [x, fl, ph] of [[180, false, 0], [900, true, 1.3]]) {
      const ay = 1790 + 8 * Math.sin(t * 2.4 + ph);
      glow(x, ay - 300, 260, '#E6F8FF', .4);
      apsara(x, ay, 15, { boilKey: 'apH' + ph, flip: fl, hx: fl ? -.3 : .3, lookX: fl ? -.6 : .6, eyes: 'happy', mouth: Math.sin(t * 7 + ph) > 0 ? 'open' : 'smile', blush: .4, handR: [4.6, -17 + Math.sin(t * 3 + ph)], bendR: -1 });
      notes(x + (fl ? -150 : 110), ay - 420, t + ph, 'ntH' + ph, GOLDC, 3);
    }
    // he listens; the cloud over him goes
    hanuman(540, 1930, 19, { ...HN, boilKey: 'hH', sit: 1, eyes: blown ? 'happy' : 'closed', mouth: 'smile', blush: blown ? .6 : .3, brow: blown ? 0 : 1, htilt: .08 * Math.sin(t * 2.4), tailSway: t * 2.5 });
    if (away < 1) h8Cloud(540 + away * 700, 1425 - away * 60, 150, 235 * (1 - away), 'lgH');
    if (blown && b < 1.2) { boilSeed('wnH'); for (let i = 0; i < 4; i++) inkLine([[300 + b * 500 + i * 30, 1390 + i * 26], [470 + b * 500 + i * 30, 1390 + i * 26]], 2, '#FFFFFF', 'inkfine', 0); }
    if (blown) hearts(540, 1440, t, BLOW + .5, 'hH', 3, 20);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, HALLW);
  }

  // ================= I · Ram rises from his throne and embraces him (40.19) =================
  function shotHug(t, lt, dur) {
    const g = t - I0, h = t - HUG, hug = h >= 0, hk = ease(clamp(h / .35)), walk = ease(seg(t, I0 + .5, HUG));
    hallCam(lt, 1.5 + .08 * hk, 540, 1385);
    h8Hall(t, 'hlB', TX, TY);
    const up = g > .5, rx = lerp(TX + 60, 500, walk);
    if (!up) ramOnThrone({ boilKey: 'rmB', eyes: 'wide', mouth: 'smile' });
    else ram(rx, 1730, 12.5, { ...RM, boilKey: 'rmI', walk: hug ? undefined : t * 3, hx: .4, lookX: .8, lean: 1.5 * hk, eyes: hug ? 'closed' : 'happy', mouth: 'smile', blush: hug ? .5 : 0, handR: hug ? [7, -15.4] : [5.4, -16], handL: hug ? [3.8, -12.2] : undefined, bendR: -1, bendL: -1 });
    const stood = seg(t, HUG - .5, HUG - .1);
    hanuman(lerp(HX, 648, stood), lerp(HY, 1730, stood), HU, { ...HN, boilKey: 'hE', sit: stood < .5 ? 1 : 0, pray: hug ? 0 : 1, hx: -.45, lookX: -.8, lookY: hug ? 0 : -.5, lean: -1.4 * hk, eyes: hug ? (h < .5 ? 'wide' : 'closed') : 'wide', mouth: hug ? 'smile' : 'O', blush: hug ? .8 : .3,
      handL: hug ? [-5.6, -14] : undefined, handR: hug ? [-2.4, -12.4] : undefined, bendL: -1, bendR: 1, tailSway: t * (hug ? 6 : 2.5) });
    if (hug) { sparkleBurst(575, 1430, 240, h * .7, 'spkI', 10, ['#FFFFFF', GOLDC]); hearts(575, 1300, t, HUG + .3, 'hI1', 3, 20); hearts(575, 1300, t, HUG + 1.5, 'hI2', 3, 20); }
    camEnd();
    if (hug && h < .12) flash((1 - h / .12) * .45, '#FFF6D8');
    caps(t);
    wipeIn(lt, HALLW);
  }

  // ================= J · "so it will be: as long as my story is told, you will live" (40.20–21) =================
  const RSX = 400, RSY = 1730, RSU = 12.5, KX = 690, KY = 1740;
  const standRam = (t, o = {}) => ram(RSX, RSY, RSU, { ...RM, boilKey: 'rmJ', hx: .4, lookX: .8, lookY: .3, eyes: 'happy', mouth: 'smile', ...o });
  const kneel2 = (t, o = {}) => hanuman(KX, KY, HU, { ...HN, boilKey: 'hJ', sit: 1, pray: 1, hx: -.45, lookX: -.8, lookY: -.6, eyes: 'happy', mouth: 'smile', blush: .5, tailSway: t * 3, ...o });
  function shotGrant(t, lt, dur) {
    const g = t - J0;
    hallCam(lt, 1.45, 540, 1330);
    h8Hall(t, 'hlB', TX, TY);
    paint(rectPts(-300, -600, W + 600, 3400), { wash: '#3A1420', washOp: 70, ink: null });
    standRam(t, { mouth: talk(t, J0 + .3, J0 + 4.4, 'smile', 'open'), handR: [5.6, -21.4], bendR: -1 });
    kneel2(t, { eyes: g > 1.4 ? 'heart' : 'wide', mouth: g > 1.4 ? 'grin' : 'O', dy: hop(g - 1.4, .4, 8, 2) });
    storyWorld(555, 1305, t, popk(t, J0 + .5, 4), 'swJ');
    // the blessing comes down on him
    if (g > 1.2) for (let i = 0; i < 6; i++) { const q = frac(t * .6 + i / 6); boilSeed('blJ' + i); paint(starPts(KX - 90 + hash(i * 3.1) * 180, 1380 + q * 160, 10 * Math.sin(q * Math.PI), .4, 4), { wash: '#FFF2C0', ink: null }); }
    camEnd();
    caps(t);
  }

  // ================= K · "for each thing you did for me, I would give my life" (40.22) =================
  function shotDebt(t, lt, dur) {
    const g = t - K0;
    hallCam(lt, 1.45, 540, 1370);
    h8Hall(t, 'hlB', TX, TY);
    standRam(t, { mouth: talk(t, K0 + .3, K0 + 3.8, 'smile', 'open'), eyes: g > 2.8 ? 'closed' : 'normal', handR: [1.4, -15], bendR: 1, handL: [-3.2, -11] });
    kneel2(t, { eyes: g > 1.2 ? 'closed' : 'wide', mouth: g > 1.2 ? 'sheepish' : 'O', blush: .9 * seg(t, K0 + .8, K0 + 1.6), bow: .16 * seg(t, K0 + 1.2, K0 + 1.8), lookY: .2 });
    // what he did: the leap to Lanka, Sita found, the mountain of herbs
    const B = [[500, 1265], [655, 1225], [810, 1275]];
    B.forEach(([x, y], i) => {
      const k = popk(t, K0 + .5 + i * .6, 5);
      h4Bubble(x, y, 74, 70, i === 0 ? RSX + 60 : x, i === 0 ? RSY - 300 : y + 50, k, 'bbK' + i, '#FFFDF2');
      if (k > .9) {
        if (i === 0) { h5Lanka(x, y + 22, 96, 'lkK'); speedLines(x - 40, y - 26, 40, 'spK', 2, 10); hanuman(x - 6, y - 4, 1.9, { ...HN, boilKey: 'hK0', crown: false, noShadow: true, rot: 1.2, tail: 'droop', handL: [-2.4, -26], handR: [2.4, -26] }); }
        if (i === 1) h5Jewel(x, y + 4, 54, 1, 'cmK', t);
        if (i === 2) herbPeak(x, y + 46, 100, t, { key: 'pkK', herbs: 6 });
        heartAt(x + 56, y - 52, 17 * popk(t, K0 + 2.3 + i * .25, 6), 'htK' + i);
      }
    });
    camEnd();
    caps(t);
  }

  // ================= L · the necklace from his own neck, bright as the moon, tied on Hanuman (40.23–24) =================
  function shotNecklace(t, lt, dur) {
    const g = t - L0, lift = ease(seg(t, LIFT, LIFT + .6)), carry = ease(seg(t, LIFT + .6, TIE)), d = t - TIE, tied = d >= 0;
    hallCam(lt, 1.7 + kick(t, TIE), 560, 1425);
    h8Hall(t, 'hlB', TX, TY);
    paint(rectPts(-300, -600, W + 600, 3400), { wash: '#3A1420', washOp: 90 * seg(t, LIFT, TIE), ink: null });
    const hands = lift > 0 && !tied;
    const ro = { ...RM, boilKey: 'rmJ', hx: .4, lookX: .8, lookY: .3, eyes: tied ? 'happy' : 'normal', mouth: 'smile', lean: 1.0 * carry * (tied ? Math.exp(-d * 2) : 1),
      handR: hands ? [lerp(2.2, 7.4, carry), lerp(-17.6, -16.4, carry) - 3 * lift * (1 - carry)] : tied ? [5, -13] : undefined, handL: hands ? [lerp(-2.2, 4.2, carry), lerp(-17.6, -15.6, carry) - 3 * lift * (1 - carry)] : undefined, bendR: -1, bendL: carry > .3 ? -1 : 1 };
    ram(RSX + 30, RSY, RSU, ro);
    if (lift <= 0) h8Neck(RSX + 30, RSY, RSU, ro, 'nkR', .4 + .2 * Math.sin(t * 5));
    const ho = { ...HN, boilKey: 'hJ', sit: 1, pray: tied ? 0 : 1, hx: -.45, lookX: tied ? .2 : -.8, lookY: tied ? .9 : -.5, eyes: tied ? (d > .9 ? 'heart' : 'wide') : 'wide', mouth: tied ? (d > .9 ? 'grin' : 'O') : 'smile', blush: tied ? .8 : .4, tailSway: t * (tied ? 6 : 3), dy: hop(d - .9, .5, 8, 1.8),
      handL: tied ? [-2.6, -12.6] : undefined, handR: tied ? [2.6, -12.6] : undefined, bendL: 1, bendR: -1 };
    hanuman(KX - 20, KY, HU, ho);
    if (hands) { const [ax, ay] = naradaHand(RSX + 30, RSY, RSU, ro, -1), [bx, by] = naradaHand(RSX + 30, RSY, RSU, ro, 1); h8NeckLoop((ax + bx) / 2, (ay + by) / 2, Math.max(70, Math.abs(bx - ax)), 'nlL', 1); }
    if (tied) {
      const [cx, cy] = naradaLocal(KX - 20, KY, HU, ho, 0, -14.6);
      glow(cx, cy, 240, '#FFFFFF', .45 * (1 - .5 * clamp(d / 2)));
      h8Neck(KX - 20, KY, HU, ho, 'nkH', 1);
      sparkleBurst(cx, cy, 240, d * .7, 'spkL', 12, ['#FFFFFF', '#DFF4FF']);
      hearts(cx + 20, cy - 300, t, TIE + 1.0, 'hL', 3, 18);
    }
    camEnd();
    if (tied && d < .12) flash((1 - d / .12) * .5, '#FFFFFF');
    caps(t);
    wipeOut(lt, dur, DUSKW);
  }

  // ================= M · the others bow and go home in tears, "like a soul leaving its body" (40.25–29) =================
  function shotLeave(t, lt, dur) {
    const g = t - M0, w = g * 34;
    camBegin(540, 1400 - lt * 2, 1.26 + .004 * lt);
    h8Dusk(t, 'dkM', 1720, 0, 820);
    // Ram at the gate, a hand raised
    ram(170, 1750, 11.5, { ...RM, boilKey: 'rmM', hx: .4, lookX: .9, eyes: 'normal', mouth: 'flat', brow: 1, handR: [5, -22 + .8 * Math.sin(t * 3)], bendR: -1 });
    // they walk away, looking back
    const lookBack = { hx: -.5, lookX: -.9, eyes: 'closed', mouth: 'frown' };
    const so = { ...SG, boilKey: 'sgM', walk: t * 2.4, ...lookBack, tail: 'droop', handL: [-4.6, -19 + Math.sin(t * 4)], bendL: 1 };
    jambavan(900 + w, 1760, 11, { ...JB, boilKey: 'jbM', staff: 1, walk: t * 2.0, hx: -.3, lookX: -.6, eyes: 'closed', mouth: 'frown' });
    vibhishana(760 + w, 1765, 11, { ...VB, boilKey: 'vbM', walk: t * 2.2, lookX: -1, eyes: 'closed', mouth: 'frown' });
    angad(610 + w, 1770, 10.5, { ...AG, boilKey: 'agM', walk: t * 2.6 + 1, ...lookBack, tail: 'droop' });
    sugriva(450 + w, 1775, 11.5, so);
    tearsOf(450 + w, 1775, 11.5, so, t, 'trM1', .7); tears(600 + w, 1500, t + .3, 'trM2', .7); tears(748 + w, 1470, t + .6, 'trM3', .7);
    camEnd();
    caps(t);
    wipeIn(lt, DUSKW);
    wipeOut(lt, dur, LATEW);
  }

  // ================= N · years later: Ram's time on earth ends; everyone begs to go with him (107.12–15, 108.17–21) =================
  const crowd = (t, glad = 0, g = 0) => {
    const face = glad ? { eyes: 'happy', mouth: 'grin', blush: .4 } : { eyes: 'wide', mouth: 'open', brow: 1 };
    const arms = i => glad ? { handL: [-4.6, -24], handR: [4.6, -24], bendL: -1, bendR: -1, dy: hop(g - i * .08, .7, 8, 1.2) } : { pray: 1, bow: .08 + .05 * Math.sin(t * 3 + i) };
    h8Citizen(1010, 1700, 9.5, 1, { boilKey: 'c1', flip: true, hx: -.4, lookX: -.8, ...face, ...arms(4) });
    h8Citizen(850, 1690, 9.5, 2, { boilKey: 'c2', flip: true, hx: -.4, lookX: -.8, ...face, ...arms(3) });
    h8Vanara(700, 1705, 9.5, 2, { boilKey: 'v1', seed: 5, hx: -.4, lookX: -.8, ...face, ...arms(2), tailSway: t * 3 });
    h8Citizen(940, 1790, 11, 0, { boilKey: 'c0', flip: true, hx: -.4, lookX: -.8, ...face, ...arms(1) });
    h8Vanara(770, 1800, 11, 0, { boilKey: 'v0', seed: 9, hx: -.4, lookX: -.8, ...face, ...arms(1.5), tailSway: t * 3.4 });
    const so = { ...SG, boilKey: 'sgN', hx: -.4, lookX: -.8, ...face, ...arms(0), tailSway: t * 3 };
    sugriva(590, 1810, 12, so);
    if (!glad) { tearsOf(590, 1810, 12, so, t, 'trN1', .7); tears(770, 1530, t + .4, 'trN2', .6); tears(925, 1520, t + .7, 'trN3', .6); }
  };
  const lateRam = (t, o = {}) => { glow(250, 1500, 300, '#FFF2C0', .45); ram(250, 1800, 13, { ...RM, boilKey: 'rmN', hx: .4, lookX: .8, eyes: 'normal', mouth: 'smile', ...o }); };
  function shotBeg(t, lt, dur) {
    camBegin(540, 1400 - lt * 2, 1.22 + .004 * lt);
    h8Dusk(t, 'dkN', 1730, 1, 250);
    lateRam(t, { eyes: blinkAt(t, N0 + 2) ? 'closed' : 'normal' });
    crowd(t, 0);
    camEnd();
    caps(t);
    wipeIn(lt, LATEW);
  }

  // ================= O · Ram says yes: to Sugriva, the vanaras, the people of Ayodhya (107.16, 108.22, 26, 38) =================
  function shotYes(t, lt, dur) {
    const g = t - YES, yes = g >= 0;
    camBegin(540, 1400 - lt * 2, 1.22 + .004 * lt + kick(t, YES));
    h8Dusk(t, 'dkN', 1730, 1, 250);
    lateRam(t, { eyes: yes ? 'happy' : 'normal', mouth: talk(t, O0 + .2, YES + .6, 'smile', 'open'), handR: yes ? [6, -17] : undefined, bendR: -1 });
    crowd(t, yes ? 1 : 0, g);
    if (yes) { sparkleBurst(780, 1420, 300, g * .6, 'spkO', 12, ['#FFFFFF', GOLDC]); hearts(700, 1380, t, YES + .4, 'hO1', 3, 18); hearts(900, 1360, t, YES + 1.2, 'hO2', 3, 18); }
    camEnd();
    caps(t);
  }

  // ================= P · then he turns to Hanuman: "you chose to live; don't break your promise" (108.33) =================
  const PRX = 330, PHX = 740, PY = 1790, PU = 13;
  const lastCam = (lt, z = 1.32) => camBegin(540, 1410 - lt * 3, z + .005 * lt);
  const lastHanu = (t, o = {}) => { const ho = { ...HN, boilKey: 'hP', hx: -.45, lookX: -.8, lookY: -.3, tailSway: t * 3, ...o }; hanuman(PHX, PY, PU, ho); h8Neck(PHX, PY, PU, ho, 'nkP', .5 + .2 * Math.sin(t * 4)); return ho; };
  function shotTurn(t, lt, dur) {
    const g = t - TURN, turned = g >= 0, said = t > P0 + 2.0;
    lastCam(lt);
    h8Dusk(t, 'dkN', 1730, 1, 540);
    glow(PRX, 1500, 300, '#FFF2C0', .4);
    ram(PRX, PY, PU, { ...RM, boilKey: 'rmP', hx: turned ? .45 : -.4, lookX: turned ? .8 : -.8, eyes: 'normal', mouth: talk(t, TURN + .2, P0 + 4.2, 'smile', 'open'), handR: said ? [5.4, -19.4] : [4, -14], bendR: -1 });
    lastHanu(t, { pray: 1, eyes: said ? 'wide' : 'happy', mouth: said ? 'O' : 'smile', emote: said ? '!' : null, emoteK: popk(t, P0 + 2.0, 6), emoteAge: t - P0 - 2.0, bow: turned && !said ? .1 : 0 });
    camEnd();
    caps(t);
    wipeIn(lt, LATEW);
  }

  // ================= Q · "as long as my story is told, stay, and be happy." And Hanuman was. (108.34–36) =================
  function shotStayOn(t, lt, dur) {
    const g = t - Q0, d = t - GLAD, glad = d >= 0;
    camBegin(540, 1361 - lt * 3, 1.4 + .005 * lt + kick(t, GLAD));
    h8Dusk(t, 'dkN', 1730, 1, 540);
    glow(PRX, 1500, 300, '#FFF2C0', .4);
    ram(PRX + 60, PY, PU, { ...RM, boilKey: 'rmP', hx: .45, lookX: .8, lookY: .3, lean: .8, eyes: glad ? 'happy' : 'normal', mouth: talk(t, Q0 + .2, GLAD - .3, 'smile', 'open'), handR: [8.4, -22.6], bendR: -1 });
    lastHanu(t, { pray: 1, bow: glad ? .1 : .2, eyes: glad ? 'happy' : 'closed', mouth: glad ? 'grin' : 'smile', blush: glad ? .8 : .4, lookY: glad ? -.6 : .3, dy: hop(d, .5, 8, 1.8), tailSway: t * (glad ? 6 : 3) });
    storyWorld(575, 1322, t, popk(t, Q0 + .6, 4), 'swQ');
    if (glad) { sparkleBurst(PHX, 1480, 260, d * .7, 'spkQ', 12, ['#FFFFFF', GOLDC]); hearts(PHX, 1330, t, GLAD + .3, 'hQ1', 3, 20); hearts(PHX, 1330, t, GLAD + 1.3, 'hQ2', 3, 20); }
    camEnd();
    if (glad && d < .12) flash((1 - d / .12) * .45, '#FFF6D8');
    caps(t);
    wipeOut(lt, dur, PEACH);
  }

  // ================= U · the ask: what would you ask Ram for? =================
  function shotAsk(t, lt, dur) {
    const g = t - U0;
    camBegin(540, 1180, 1.0 + .006 * lt);
    warmBack(t, 'wbU', 540, 1300);
    ram(280, 1890, 20, { ...RM, boilKey: 'rmU', hx: .4, lookX: .2, lookY: 0, eyes: 'happy', mouth: 'smile', handR: [6.4, -16], bendR: -1 });
    const ho = { ...HN, boilKey: 'hU', sit: 1, hx: -.2, eyes: 'heart', mouth: 'smile', blush: .7, handL: [-2.6, -13], handR: [2.6, -13], bendL: 1, bendR: -1, tailSway: t * 4, htilt: .06 * Math.sin(t * 3) };
    hanuman(770, 1900, 19, ho);
    h8Neck(770, 1900, 19, ho, 'nkU', .4);
    { const [cx, cy] = naradaLocal(770, 1900, 19, ho, 0, -12.2); h8Pothi(cx, cy, 190, t, 'ptU', 1); }
    const bk = popk(t, U0 + 1.4, 5);
    h4Bubble(560, 1160, 100, 92, 420, 1330, bk, 'bbU', '#FFFDF2');
    if (bk > .9) letter('?', 560, 1166, 130 + 8 * Math.sin(t * 6), HSK.orange, { stroke: HSK.ink, sw: .2, ink: false, rot: .06 * Math.sin(t * 3) });
    hearts(770, 1420, t, U0 + 2.2, 'hU', 3, 22);
    camEnd();
    caps(t);
    wipeIn(lt, PEACH);
    wipeOut(lt, dur, PEACH);
  }

  // ================= V · next: the moment Hanuman left, Arjuna's chariot turned to ash =================
  function shotNext(t, lt, dur) {
    const g = t - V0, gone = t >= GONE, a = t - ASH, ash = a >= 0;
    camBegin(540, 1250, 1.0 + .01 * lt);
    h8Dusk(t, 'dkV', 1740, .5, 300);
    const cx = 520, cy = 1790, cu = 30;
    if (!ash || a < .5) {
      h8Banner(cx - 40, cy - 7 * cu, 330, t, 'bnV', gone ? 0 : 1);
      suryaChariot(cx, cy, cu, { part: 'back', boilKey: 'chV' });
      suryaChariot(cx, cy, cu, { part: 'front', boilKey: 'chV', pole: [cx + 330, cy - 110] });
    }
    if (gone) poof(cx + 90, cy - 7 * cu - 250, 150, (t - GONE) / .5, 'pfV', ['#FFF2C8', '#F2D890']);
    if (ash) {
      h7Flames(cx, cy - 20, 560, 420 * (1 - clamp((a - .4) / .8)), t, 'flV', 7);
      if (a > .5) { boilSeed('ashV'); paint([[cx - 260, cy + 6], [cx - 150, cy - 50], [cx, cy - 84], [cx + 150, cy - 46], [cx + 270, cy + 6]], { wash: '#6E6A7A', fill: '#4A4658', fillOp: 70, tex: .6, ink: HSK.ink, sw: 1, curv: .5 }); for (let i = 0; i < 4; i++) { const q = frac(t * .6 + i / 4); paint(ellPts(cx - 150 + i * 100 + Math.sin(q * 6 + i) * 20, cy - 90 - q * 260, 26 * (1 - q) + 8, 20 * (1 - q) + 6, 10), { wash: '#8E8A9A', washOp: 170 * (1 - q), ink: null }); } }
      emote('!?', cx + 300, cy - 420, 30, popk(t, ASH + .2, 6), a);
    }
    camEnd();
    if (ash && a < .12) flash((1 - a / .12) * .6, '#FFE0A0');
    caps(t);
    wipeIn(lt, PEACH);
  }
  const speedLines = (x, y, len, key, n = 4, gap = 14, dir = 1) => { boilSeed(key); for (let i = 0; i < n; i++) inkLine([[x - dir * len * (1 + .3 * hash(i)), y + (i - (n - 1) / 2) * gap], [x - dir * len * .2, y + (i - (n - 1) / 2) * gap]], 1.4, '#FFFFFF', 'inkfine', 0); };
  function shotCard(t, lt, dur) { hsCard(t, CARDC); }

  shots([[0, shotHook], [B0, shotStay], [C0, shotGifts], [D0, shotGo], [E0, shotBow], [F0, shotLove], [G0, shotAlive], [H0, shotSing], [I0, shotHug], [J0, shotGrant], [K0, shotDebt],
    [L0, shotNecklace], [M0, shotLeave], [N0, shotBeg], [O0, shotYes], [P0, shotTurn], [Q0, shotStayOn], [U0, shotAsk], [V0, shotNext], [CARD, shotCard]]);
})();
