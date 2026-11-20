// mira.js: "Saanwaro nahi aayo", a poem in Mira's voice, written and sung by Shivangi Singh (@thebrowngirl_ss).
// Miniature style. The verse is timed to her recording (assets/vo/mira/shivangi_1_reverb.mp3): each line lands on
// the inscription band as she sings it, with its English meaning under it.
const TL = {
  L1: 1.2, L2: 10.8, L3: 20.5, L3b: 25.5, L4: 29.4, L5: 35.5, L5b: 38.0, L5c: 41.7, L6: 45.5, L7: 55.6, L7b: 60.8, L8: 64.7, L9: 69.8,
  L10: 75.8, L10b: 81.3, L11: 86.1, L12: 96.4, L12b: 101.6, L13: 105.8, L14: 110.7, L15: 115.8, END: 120.9, CARD: 121.4,
  OFF: 4,   // the music's intro: everything below is timed to her recording and shifted by OFF at the bottom of the file
};
MN.verse = [
  { a: -.4, b: 10.2, hi: 'सांवल रूप निहारौ आए, | सांवरो नाही आयो', en: 'I came to gaze upon his dark form… | my Saanwara did not come.', instant: true },
  { a: 10.5, b: 19.9, hi: 'पलकन छांवो उतारौ आए, | सांवरो नाही आयो', en: 'I came to keep him in the shade of my eyelids… | my Saanwara did not come.' },
  { a: 20.3, b: 29.1, hi: 'दूर देस के बेहरूपी ने | मोहन रूप दिखायो', en: 'A shape-shifter from a far-off land | showed me his form: Mohan, the enchanter…' },
  { a: 29.3, b: 34.9, hi: 'मेरो सांवरो नाही आयो', en: 'My Saanwara did not come.', hs: 60 },
  { a: 35.3, b: 44.7, hi: 'बिनत करूँ न, पाँव पडूँ न, | न भेजूं कोई तार', en: 'I do not plead, I do not fall at his feet, | I send no word.' },
  { a: 45.2, b: 54.9, hi: 'गीत माला कंठन में डाले, | गाऊं सौ सौ बार', en: 'With a garland of songs around my throat, | I sing a hundred times.' },
  { a: 55.3, b: 64.3, hi: 'न मृदंग न डफ़ली बाजे, | पायल शोर मचायो', en: 'No mridang, no daf is played; | only my anklets ring.' },
  { a: 64.5, b: 69.6, hi: 'मेरो सांवरो नाही आयो', en: 'My Saanwara did not come.', hs: 60 },
  { a: 69.75, b: 75.4, hi: 'मेरो सांवरो नाही आयो', en: 'My Saanwara did not come.', hs: 60 },
  { a: 75.6, b: 85.7, hi: 'फिरत रहूँ मैं, बन के सरिता, | चंचल मोरी चाल', en: 'I wander on, I become a river, | restless is my flow.' },
  { a: 85.9, b: 95.8, hi: 'तोहरे मुख की लहरी देखे, | लागे बीते साल', en: 'Since I saw the play of light on your face, | it feels like years have passed.' },
  { a: 96.2, b: 105.5, hi: 'कल भी न आयो, फिर दोहरायो, | सागर न मिल पायो', en: 'You did not come yesterday, nor again today: | the river never found its sea.' },
  { a: 105.65, b: 110.5, hi: 'मेरो सांवरो नाही आयो', en: 'My Saanwara did not come.', hs: 60 },
  { a: 110.6, b: 115.6, hi: 'मेरो सांवरो नाही आयो', en: 'My Saanwara did not come.', hs: 60 },
  { a: 115.7, b: 121.2, hi: 'मेरो सांवरो नाही आयो', en: 'My Saanwara did not come.', hs: 60 },
];

// the title cartouche, up from frame 0 until the first line has been sung
MN.after = (c, t) => {
  const a = 1 - seg(t, 8.6, 9.6); if (a <= 0) return;
  c.save(); c.globalAlpha = a;
  const x0 = 150, x1 = 930, y0 = 452, y1 = 640;
  c.fillStyle = 'rgba(233,190,71,.97)'; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.strokeStyle = '#141010'; c.lineWidth = 1.6; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
  c.strokeStyle = MC.red; c.lineWidth = 3; c.strokeRect(x0 + 6, y0 + 6, x1 - x0 - 12, y1 - y0 - 12);
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = `76px ${MN.devFont}`; c.fillStyle = '#5A1410'; c.fillText('सांवरो नाही आयो', 540, 527); c.fillStyle = '#8E1F18'; c.fillText('सांवरो नाही आयो', 540, 525);
  c.font = `italic 600 36px ${MN.enFont}`; c.fillStyle = '#1F2A55'; c.fillText('Mira’s song · a poem by Shivangi Singh', 540, 598);
  c.restore();
};

// ---------- 1. the terrace at dusk: she watches the path ----------
SHOTS.push({ a: 0, b: 10.6, draw(c, u, t) {
  const cam = { z: lerp(1, 1.1, easeIO((u + TL.OFF) / (10.6 + TL.OFF))), fx: 520, fy: 800 };
  plane(c, cam, .6, (c) => { mrSkyTerrace(c, t); for (let i = 0; i < 5; i++) mnCrane(c, 100 + i * 52 + t * 30, 780 + Math.abs(i - 2) * 20 - t * 5, .8, t * 1.4 + i * .23); });
  plane(c, cam, .85, (c) => { c.save(); c.translate(0, 120); mrFarHills(c, t); c.restore(); });
  plane(c, cam, 1, (c) => {
    c.save(); c.translate(0, 220); mrTerrace(c, t); mrPavilion(c, t, { x0: 780 }); c.restore();
    const blink = (t % 4.1) > 3.95 ? .1 : 1;
    mnMira(c, 520, 1560, .76, { t, flip: true, eyes: blink, look: -.2, wind: .2 });
    c.save(); c.translate(0, 220); mrRail(c, t); c.restore();
  });
} });

// ---------- 2. her face: she lays her lashes down ----------
SHOTS.push({ a: 10.2, b: 20.4, xf: .8, draw(c, u, t) {
  const cam = { z: lerp(1, 1.06, easeIO(u / 10)), fx: 540, fy: 760 };
  plane(c, cam, .5, (c) => { mrSkyTerrace(c, t, { night: .15 }); });
  plane(c, cam, .7, (c) => { c.save(); c.translate(0, 300); mrFarHills(c, t, { night: .1 }); c.restore(); });
  plane(c, cam, 1, (c) => {
    const k = seg(t, 12.2, 15.5), k2 = seg(t, 16.2, 18.4);
    const eyes = lerp(1, .55, ease(k)) * (1 - ease(k2) * .95), blink = (t % 3.7) > 3.58 && k < .05 ? .1 : 1;
    mnMira(c, 610, 760 + 949.5 * 7, 7, { t, flip: true, eyes: eyes * blink, look: lerp(0, -1, ease(k)), close: true, arms: false, tilt: -.04 * ease(k) });
    // a tear on the lower lid, after the lashes come down
    const tk = seg(t, 17.6, 19.8); if (tk > 0) { const ty = 760 + 10 + tk * 120 * tk; c.save(); c.globalAlpha = Math.min(1, tk * 4) * (1 - seg(tk, .85, 1)); mnFill(c, [[610 - 7 * 7, ty - 14], [610 - 7 * 7 + 7, ty], [610 - 7 * 7, ty + 6], [610 - 7 * 7 - 7, ty]], 'rgba(220,235,255,.85)', { line: 'rgba(120,140,170,.8)', lw: 1.2 }); c.restore(); }
  });
} });

// ---------- 3. the temple, years ago: the shape-shifter shows her his Mohan form ----------
// (the poet: Mira sees Krishna's murti in a temple as a little girl, is spellbound, and waits for him ever since;
// "Mohan" is both his name and "the one who enchants"; his crown always stays on)
const TEMPLE_CAM = [[19.9, [1.0, 540, 800]], [24.4, [1.1, 520, 800]], [25.4, [1.75, 640, 720]], [27.4, [1.85, 640, 700]], [28.2, [1.9, 330, 800]], [29.3, [1.95, 330, 800]], [30.4, [1.12, 500, 800]], [35.4, [1.18, 480, 800]]];
SHOTS.push({ a: 19.9, b: 35.4, xf: .6, draw(c, u, t) {
  const [z, px, py] = kf(t, TEMPLE_CAM, easeIO), cam = mnLook(z, px, py);
  plane(c, cam, 1, (c) => {
    const reveal = seg(t, 25.2, 26.6) * (1 - seg(t, 29.6, 31.2) * .7);
    mrTemple(c, t, { glow: ease(reveal) });
    // the little girl, hands joined, gazing up at him; her eyes go wide when he shows his form
    const grown = ease(seg(t, 30.2, 31.8)), down = seg(t, 32.6, 34.2), wow = seg(t, 25.6, 26.6);
    const X = 300, Y = 1236, sway = Math.sin(t * 1.3) * .015;
    if (grown < 1) mnMira(c, X, Y, .54, { t, child: 1, pose: 'pray', ektara: false, alpha: 1 - grown, eyes: lerp(.85, 1.05, wow), look: lerp(.5, .9, wow), mouth: wow * .25, tilt: -.08 - wow * .06 + sway, wind: .1,
      pal: { ghagra: '#D9503A', fold: '#9A2A1E', choli: '#E8B83C', border: '#E8B83C' } });
    // …and the years pass where she stands: Mira grown, still waiting before him
    if (grown > 0) mnMira(c, X, Y, .6, { t, pose: 'pray', ektara: false, alpha: grown, eyes: lerp(.9, .3, down), look: lerp(.6, -.7, down), tilt: lerp(-.1, .08, down) });
  });
} });

// ---------- 4. the parrot: she takes her letter back ----------
SHOTS.push({ a: 34.9, b: 45.6, xf: .7, draw(c, u, t) {
  const cam = { z: lerp(1.04, 1.12, easeIO(u / 10.7)), fx: 520, fy: 760 };
  plane(c, cam, 1, (c) => {
    mrChamber(c, t, { wx: 790, wy: 860 }); mrCage(c, 160, 560, t);
    const take = ease(seg(t, 41.8, 42.9)), fly = seg(t, 42.4, 43.6);
    const arms = {}; for (const k of ['near', 'far']) arms[k] = MIRA_ARMS.parrot[k].map((p, i) => [lerp(p[0], MIRA_ARMS.letter[k][i][0], take), lerp(p[1], MIRA_ARMS.letter[k][i][1], take)]);
    arms.nearFingers = take > .5 ? 'hold' : 'open'; arms.farFingers = 'hold';
    const X = 380, Y = 1210, S = .92;
    mnMira(c, X, Y, S, { t, pose: 'parrot', seated: true, arms, eyes: 1, look: lerp(.5, -.6, take), tilt: lerp(-.05, .06, take),
      after: (c, dy) => {
        // the letter in her hand at her heart, once she has taken it
        if (take > .5) { c.save(); c.translate(64, -772 + dy); c.rotate(-.5); mnFill(c, [[0, -8, 1], [34, -8, 1], [34, 8, 1], [0, 8, 1]], '#F2E8CC', { lw: MN.lw * .8 }); mnStroke(c, [[5, 0], [29, 0]], '#C9372A', MN.lw * .8); c.restore(); }
      } });
    // the parrot: on her finger with the letter, then off to the window sill, where it stays
    const p0 = [X + 128 * S, Y + (-850 + 400) * S - 6], p1 = [790 - 60, 860 + 4], k = ease(fly);
    const px = lerp(p0[0], p1[0], k), py = lerp(p0[1], p1[1], k) - Math.sin(k * Math.PI) * 120;
    mnParrot(c, px, py, 1.25, { letter: take < .5, flap: fly > 0 && fly < 1 ? Math.abs(Math.sin(t * 22)) : 0, flip: false });
  });
} });

// ---------- 5. the shrine: a garland of songs (each "Krishna" she sings becomes a flower) ----------
const GARLAND = mnPts([[-20, -834], [-26, -790], [-12, -738], [16, -712], [44, -718], [56, -752], [40, -800], [22, -830]], false, 3);
SHOTS.push({ a: 45.1, b: 55.6, xf: .7, draw(c, u, t) {
  const cam = mnLook(lerp(1.3, 1.5, easeIO(u / 10.5)), 380, 840, 720);
  plane(c, cam, 1, (c) => {
    mrChamber(c, t, { window: false }); mrShrine(c, 780, 1080, t);
    const sing = Math.max(0, Math.sin(t * 5.3) * .5 + Math.sin(t * 2.1) * .5) * (t > 45.5 && t < 54.1 ? 1 : 0);
    const n = GARLAND.length, X = 330, Y = 1236, S = .95, mouth = [36, -910];
    mnMira(c, X, Y, S, { t, pose: 'sit', eyes: .45, look: .6, mouth: sing * .7, pluck: Math.max(0, Math.sin(t * 6)), tilt: -.03,
      hold: (c, dy) => {
        // "कृष्ण" leaves her lips, word by word; each word turns into a flower and strings itself round her throat
        for (let i = 0; i < n; i++) {
          const t0 = 45.9 + i / n * 6.9, k = seg(t, t0, t0 + 1.6); if (k <= 0) continue;
          const [gx, gy] = GARLAND[i], mx = mouth[0] + 16, my = mouth[1] + dy, e = ease(k);
          const fx = lerp(mx, gx, e) + Math.sin(k * Math.PI) * 170, fy = lerp(my, gy + dy, e) - Math.sin(k * Math.PI) * (90 + (i % 3) * 40);
          const word = 1 - seg(k, .5, .78), bloom = seg(k, .55, .85), col = i % 3 === 1 ? '#F7F0E0' : '#F0A020';
          if (word > 0) {
            c.save(); c.globalAlpha *= word * seg(k, .04, .22); c.translate(fx, fy); c.scale(.7 + .5 * seg(k, 0, .3) - .4 * (1 - word), .7 + .5 * seg(k, 0, .3) - .4 * (1 - word));
            c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `34px ${MN.devFont}`;
            glow(c, 0, 0, 40, '#FFD27A', .35, 'lighter');
            c.lineWidth = 4; c.strokeStyle = 'rgba(255,240,200,.85)'; c.strokeText('कृष्ण', 0, 0); c.fillStyle = '#8E1F18'; c.fillText('कृष्ण', 0, 0);
            c.restore();
          }
          if (bloom > 0) {
            const r = 11.5 * ease(bloom);
            if (k < 1) glow(c, fx, fy, 30, '#FFD27A', .5 * (1 - k), 'lighter');
            mnEll(c, fx, fy, r, r, col, { lw: MN.lw * .7 }); for (let q = 0; q < 6; q++) mnDot(c, fx + Math.cos(q * 1.05) * r * .55, fy + Math.sin(q * 1.05) * r * .55, 2.4 * bloom, mixCol(col, '#B05A10', .35)); mnDot(c, fx, fy, 2.8 * bloom, i % 3 === 1 ? '#E8B83C' : '#C9372A');
          }
        }
      } });
  });
} });

// ---------- 6. she dances; only her anklets ring ----------
SHOTS.push({ a: 55.2, b: 61.0, xf: .7, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 5.8)), fx: 540, fy: 800 };
  plane(c, cam, 1, (c) => {
    mrChamber(c, t, { wx: 800, wy: 820 });
    const ph = (Math.sin(t * 2.4) + 1) / 2, A0 = MIRA_ARMS.dance, A1 = MIRA_ARMS.dance2;
    const arms = { farFingers: 'open', nearFingers: 'open' }; for (const k of ['near', 'far']) arms[k] = A0[k].map((p, i) => [lerp(p[0], A1[k][i][0], ph), lerp(p[1], A1[k][i][1], ph)]);
    const turn = Math.cos(t * 1.2 * Math.PI);   // she turns: front to back
    c.save(); c.translate(500, 0); c.scale(Math.sign(turn) * (.75 + .25 * Math.abs(turn)), 1); c.translate(-500, 0);
    mnMira(c, 500, 1230, .8, { t, pose: 'dance', ektara: false, arms, flare: .9 + .25 * Math.abs(Math.sin(t * 2.4)), swirl: Math.sin(t * 2.4) * .5, eyes: .6, look: .3, bells: true, wind: .6 });
    c.restore();
    mnInstruments(c, 860, 1236, .9);
  });
} });
SHOTS.push({ a: 60.6, b: 64.9, xf: .4, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.06, easeIO(u / 4.3)), fx: 540, fy: 1000 };
  plane(c, cam, 1, (c) => {
    const bells = mrFeetClose(c, t);
    // the bells ring: little gold arcs and sparks round the ankle that's lifting
    for (const [fx, fy, k] of bells) {
      for (let i = 0; i < 3; i++) { const r = 40 + i * 26 + (t * 70 % 26); c.save(); c.globalAlpha = .55 * (1 - i / 3) * k; c.strokeStyle = MC.goldLt; c.lineWidth = 3; c.beginPath(); c.arc(fx, fy, r, -2.4, -.6); c.stroke(); c.restore(); }
      motes(c, { n: 10, seed: fx, box: [fx - 120, fy - 160, fx + 120, fy + 20], r: 5, col: '#FFD27A', a: .8 * k, vx: 0, vy: -50, t });
    }
  });
} });

// ---------- 7. night: the lamp, the peacock, the rain clouds ----------
SHOTS.push({ a: 64.5, b: 76.2, xf: .8, draw(c, u, t) {
  const push = easeIO(seg(t, 69.6, 75.8)), cam = { z: lerp(1.0, 1.2, push), fx: 520, fy: 760 }, fl = strikes(t, [66.7, 71.3]);
  plane(c, cam, .6, (c) => {
    mrSkyTerrace(c, t, { night: 1, moon: [210, 300] });
    mnLightning(c, 720, 140, 820, 560, 11, Math.min(1, fl)); mnLightning(c, 300, 180, 420, 470, 17, Math.min(1, strikes(t, [71.3]) * 1.2));
  });
  plane(c, cam, .85, (c) => { c.save(); c.translate(0, 60); mrFarHills(c, t, { night: 1 }); c.restore(); });
  plane(c, cam, 1, (c) => {
    c.save(); c.translate(0, 40); mrTerrace(c, t, { night: .8 }); mrPavilion(c, t, { x0: 700, night: .7, peacock: true }); c.restore();
    const droop = ease(seg(t, 70.4, 74.8));
    mnMira(c, 560, 1262, .9, { t, pose: 'sit', flip: true, eyes: lerp(.5, 0, droop), look: -.5, tilt: .1 * droop, pluck: 0 });
    flash(c, fl * .18, '#FFE9B0');
  });
} });

// ---------- 8. she becomes a river; the seasons turn on its banks ----------
const SEASONS = [[86.1, 'spring'], [88.5, 'monsoon'], [90.9, ''], [92.2, 'autumn'], [93.6, 'winter']];
const seasonAt = t => { let s = ''; for (const [a, k] of SEASONS) if (t >= a) s = k; return t >= 95.2 ? 'spring' : s; };
function mrRiverWorld(c, t) {
  // the sky and the palace gate at the top of the scroll
  mnSky(c, 'dawn', { hy: 1000, y0: -100, below: '#6E8C5C' });
  mnCloudBand(c, 140 + t * 3, 280, 380, { seed: 41, col: '#F1D2BE' });
  mnHill(c, [[-40, 900], [260, 780], [540, 820], [820, 760], [1120, 820], [1120, 6400, 1], [-40, 6400, 1]], '#6E8C5C', { rimN: 5, top: 700, bot: 1600, shadeA: .2 });
  for (let i = 0; i < 12; i++) {
    const y = 1500 + i * 420, ph = i * 1.7, P = [];
    for (let k = 0; k <= 8; k++) P.push([-60 + k * 155, y - 60 - Math.sin(k * .9 + ph) * 70 - hash(i * 9 + k) * 30]);
    mnHill(c, [...P, [1180, y + 700, 1], [-60, y + 700, 1]], ['#74925F', '#68875A', '#7A9866'][i % 3], { rimN: 9, rim: '#E6E2B4', top: y - 120, bot: y + 500, shadeA: .22 });
  }
  // the gate
  const g = MC.white, gx = 540, gy = 1020;
  const p = new Path2D(); p.rect(gx - 170, gy - 300, 340, 300); p.addPath(mnArchPath(gx, gy, 150, 160));
  c.save(); c.fillStyle = g; c.fill(p, 'evenodd'); c.strokeStyle = mnLineCol(g); c.lineWidth = 1.6; c.stroke(p); c.restore();
  mnFill(c, mnArchPath(gx, gy, 150, 160), '#5A2A1E', { line: false, alpha: .9 });
  mnDome(c, gx - 120, gy - 300, 90); mnDome(c, gx + 120, gy - 300, 90); mnDome(c, gx, gy - 300, 150);
  // the river, revealed as it runs down from her
  const reach = RIVER.top + Math.max(0, t - 78.6) * 900;
  if (reach > RIVER.top + 10) mnWater(c, mrRiverPath(RIVER.top, Math.min(RIVER.bot, reach)), t, { flow: [0, 40], scale: 1.1, col: '#7FA6B8' });
  // the banks: rows of trees and hills all the way down, in the season of the moment
  const season = seasonAt(t);
  for (let i = 0; i < 26; i++) {
    const y = 1260 + i * 135, [cx, hw] = mrRiverAt(y), side = i % 2 ? 1 : -1, x = cx + side * (hw + 70 + hash(i) * 120);
    if (x < -40 || x > 1120) continue;
    mnTree(c, x, y, 130 + hash(i + 3) * 70, ['dome', 'mango', 'cypress', 'blossom', 'dome'][i % 5], { seed: 90 + i, season: y > 2100 ? season : '' });
    const x2 = cx - side * (hw + 160 + hash(i + 7) * 160); if (x2 > -40 && x2 < 1120) mnTree(c, x2, y + 60, 110 + hash(i + 9) * 50, i % 3 ? 'dome' : 'cypress', { seed: 140 + i, season: y > 2100 ? season : '' });
  }
  // a village by the water on the way down
  for (const [hx, hy] of [[150, 2300], [880, 3050], [160, 3800]]) { mnFill(c, [[hx - 50, hy, 1], [hx + 50, hy, 1], [hx + 50, hy - 60, 1], [hx - 50, hy - 60, 1]], '#F2E9DA', { lw: 1.3 }); mnFill(c, [[hx - 60, hy - 60, 1], [hx, hy - 110], [hx + 60, hy - 60, 1]], '#B5622E', { lw: 1.3 }); }
}
SHOTS.push({ a: 75.6, b: 96.2, xf: .8, draw(c, u, t) {
  const sy = kf(t, [[75.6, 300], [79.6, 420], [85, 1700], [95.6, 3500]], easeIO);
  const cam = mnLook(1, 540, sy + 640, 640);
  plane(c, cam, 1, (c) => {
    mrRiverWorld(c, t);
    // Mira walks out of the gate and down; her odhni trails behind her and becomes the river
    const k = seg(t, 75.8, 80.2), mx = 540 + Math.sin(k * 2) * 10, my = 1030 + k * 120, fade = 1 - seg(t, 79.2, 80.8);
    if (fade > 0) {
      if (k > .1) mnWater(c, [[540 - 8, 1030], [mx - 30, my - 20], [mx - 4, my + 4], [540 + 8, 1030]], t, { flow: [0, 40], scale: .7, col: '#BFD6DE', alpha: fade });
      mnMira(c, mx, my, .26, { t, pose: 'walk', alpha: fade, wind: .8 });
      glow(c, mx, my - 120, 200 * (1 - fade + .2), '#FFF3D0', .5 * (1 - fade) * fade * 4, 'lighter');
    }
  });
  // the weather of each season, over everything
  const season = seasonAt(t), sk = Math.min(seg(t, 86, 86.6), 1);
  if (season === 'monsoon') { c.save(); c.strokeStyle = 'rgba(230,236,245,.55)'; c.lineWidth = 1.6; for (let i = 0; i < 120; i++) { const x = (hash(i) * 1200 + t * 300) % 1200 - 60, y = (hash(i + 5) * 1400 + t * 1500) % 1400; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 10, y + 34); c.stroke(); } c.restore(); mnLightning(c, 820, 80, 900, 380, 7, Math.min(1, strikes(t, [89.4]))); }
  if (season === 'winter') motes(c, { n: 110, seed: 3, box: [40, 40, 1040, 1300], r: 4, col: '#FFFFFF', a: .9, vx: 20, vy: 90, t });
  if (season === 'autumn') for (let i = 0; i < 26; i++) { const x = (hash(i) * 1100 + t * 40) % 1100, y = (hash(i + 2) * 1300 + t * 160) % 1300; c.save(); c.translate(x, y); c.rotate(t * 3 + i); mnEll(c, 0, 0, 7, 3.5, i % 2 ? '#C27A2E' : '#A84A20', { lw: .8 }); c.restore(); }
  if (season === 'spring' && t > 86) for (let i = 0; i < 20; i++) { const x = (hash(i) * 1100 + t * 30) % 1100, y = (hash(i + 2) * 1300 + t * 90) % 1300; mnDot(c, x, y, 3.5, '#F6C6D0'); }
} });

// ---------- 9. the sea: dawn after dawn, the river never reaches it ----------
function mrSea(c, t) {
  // the sun's day: up from the sea and down again, twice
  const sunH = t < 101.4 ? Math.sin(seg(t, 96.0, 101.4) * Math.PI) : Math.sin(seg(t, 101.4, 106.8) * Math.PI) * .9;
  const day = clamp(sunH * 1.4), dusk = 1 - day;
  mnSky(c, 'dawn', { hy: 600, to: 'day', k: day * .8 });
  if (dusk > .4) mnStars(c, 40, [60, 60, 1020, 500], 8, t, (dusk - .4) * 1.2);
  const sx = 640, sy = 590 - sunH * 420;
  glow(c, sx, sy, 260, '#FFC070', .5, 'screen');
  c.save(); c.beginPath(); c.rect(0, 0, W, 590); c.clip(); mnEll(c, sx, sy, 46, 46, mixCol('#F05A2A', '#F6C84A', day), { line: '#B0401A', lw: 1.6 }); c.restore();
  mnCloudBand(c, 120 + t * 4, 300, 360, { seed: 51, col: mixCol('#E6A88C', '#F4EEDF', day) });
  // the sea at the horizon
  mnWater(c, [[-40, 590], [1120, 590], [1120, 680, 1], [-40, 680, 1]], t, { col: mixCol('#24407A', '#3E6A9A', day), flow: [10, 0], scale: .8, line: rgba('#D8E4F0', .55) });
  // the shore and the plain
  mnFill(c, [[-40, 680, 1], [1120, 680, 1], [1120, 2000, 1], [-40, 2000, 1]], '#E3C48E', { lw: 1.4 });
  mnHill(c, [[-40, 820], [300, 790], [700, 810], [1120, 790], [1120, 2000, 1], [-40, 2000, 1]], '#9CAE6E', { rim: '#F0E6B8', top: 790, bot: 1600 });
  // the river: wide at the bottom, narrowing toward the sea, ending in the sand short of it
  const L = [], R = [];
  for (let i = 0; i <= 30; i++) { const u = i / 30, y = lerp(1900, 760, u), cx = 540 + Math.sin(u * 4.2) * 160 * (1 - u * .6), hw = lerp(260, 14, Math.pow(u, .7)); L.push([cx - hw, y]); R.unshift([cx + hw, y]); }
  mnWater(c, L.concat(R), t, { flow: [0, -26], col: '#7FA6B8' });
  for (let i = 0; i < 7; i++) mnTree(c, 90 + i * 150 + (i % 2) * 40, 900 + (i % 3) * 120, 110, i % 2 ? 'plantain' : 'dome', { seed: 200 + i });
  // Mira, small, at the river's end, looking at the sea
  mnMira(c, 540 + Math.sin(4.2) * 160 * .4 + 30, 770, .13, { t, pose: 'stand', ektara: true });
}
SHOTS.push({ a: 95.8, b: 106.0, xf: .8, draw(c, u, t) {
  const cam = { z: lerp(1.0, 1.08, easeIO(u / 10.2)), fx: 540, fy: 640 };
  plane(c, cam, 1, (c) => mrSea(c, t));
} });

// ---------- 10. the last night: she sets a lamp on the water ----------
function mrNightBank(c, t) {
  mnSky(c, 'night', { hy: 900 });
  mnStars(c, 120, [60, 60, 1020, 860], 21, t);
  mnMoon(c, 760, 330, 40, { glow: .35 });
  mnCloudBand(c, 100 + t * 3, 520, 380, { seed: 61, col: '#5C6B96', under: '#1A2348' });
  // far hills with the palace on them
  mnHill(c, [[-40, 860], [220, 760], [480, 820], [760, 770], [1120, 830], [1120, 1100, 1], [-40, 1100, 1]], '#25354F', { rim: '#7A88B0', top: 760, bot: 1100 });
  mnFill(c, [[200, 760, 1], [330, 760, 1], [330, 700, 1], [200, 700, 1]], '#C9C8D6', { lw: 1.2 }); mnDome(c, 265, 700, 90, '#C9C8D6');
  for (let i = 0; i < 8; i++) mnTree(c, 60 + i * 140, 870 + (i % 2) * 20, 90, i % 3 === 1 ? 'cypress' : 'dome', { seed: 300 + i, leaf: '#14241A' });
  // the river across the frame, the moon's road on it
  mnWater(c, [[-40, 900], [1120, 880], [1120, 1240, 1], [-40, 1240, 1]], t, { col: '#2A4A72', line: rgba('#BFD0EE', .5), flow: [22, 0] });
  c.save(); c.globalAlpha = .55; for (let i = 0; i < 14; i++) { const y = 905 + i * 22, w = 60 - i * 2 + Math.sin(t * 2 + i) * 10; mnStroke(c, [[760 - w, y], [760 + w, y]], '#F4EEDF', 3); } c.restore();
  // the near bank
  mnFill(c, [[-40, 1240, 1], [1120, 1240, 1], [1120, 2000, 1], [-40, 2000, 1]], '#3A4A3A', { lw: 1.4 });
  mnHill(c, [[-40, 1180], [200, 1150], [430, 1200], [560, 1260], [560, 2000, 1], [-40, 2000, 1]], '#3E5240', { rim: '#7A8A70', top: 1150, bot: 1500 });
}
SHOTS.push({ a: 105.6, b: 121.6, xf: .8, draw(c, u, t) {
  const pull = easeIO(seg(t, 109.5, 120.2)), cam = mnLook(lerp(1.45, 1.0, pull), lerp(340, 540, pull), lerp(960, 760, pull), 760);
  plane(c, cam, 1, (c) => {
    mrNightBank(c, t);
    const place = ease(seg(t, 106.4, 108.2)), drift = seg(t, 108.0, 121);
    const X = 300, Y = 1236, S = .7;
    // the lamp: in her hands, then on the water, then floating away toward the moon's road
    const hx = X + 100 * S, hy = Y + (-706 + 400) * S, wx = 470, wy = 1150;
    let lx, ly, ls;
    if (drift <= 0) { lx = lerp(hx, wx, place); ly = lerp(hy, wy, place) - Math.sin(place * Math.PI) * 30; ls = 1; }
    else { const e = easeOut(drift); lx = lerp(wx, 790, e); ly = lerp(wy, 930, e) + Math.sin(t * 2) * 4; ls = lerp(1, .45, e); }
    mnMira(c, X, Y, S, { t, pose: 'diya', seated: true, ektara: false, eyes: lerp(.6, .3, drift), look: -.6, tilt: .05 + place * .06 });
    c.save(); c.globalAlpha = .4; mnStroke(c, [[lx - 30 * ls, ly + 10 * ls], [lx + 30 * ls, ly + 10 * ls]], '#FFD27A', 3 * ls); c.restore();
    mnDiya(c, lx, ly, 1.1 * ls, t, { glow: 1.3 });
  });
} });

// ---------- the card: follow both ----------
SHOTS.push({ a: 121.2, b: 127.5, xf: .9, draw(c, u, t) {
  c.fillStyle = '#F2E7CC'; c.fillRect(0, 0, W, H);
  // a small vine border inside the window
  c.save(); c.strokeStyle = MC.red; c.lineWidth = 2; c.strokeRect(90, 330, 900, 1220); c.strokeStyle = MC.gold; c.lineWidth = 1.2; c.strokeRect(100, 340, 880, 1200); c.restore();
  mnLotus(c, 540, 430, 1.6);
  text(c, 'सांवरो नाही आयो', 540, 545, `80px ${MN.devFont}`, '#8E1F18', { pop: u - .2 });
  text(c, 'Mira’s song, in a poem', 540, 625, `italic 600 42px ${MN.enFont}`, '#18224A', { pop: u - .35 });
  text(c, 'WORDS & VOICE', 540, 760, '600 26px Poppins', '#8A6A3A', { pop: u - .5, spacing: 4 });
  text(c, 'Shivangi Singh', 540, 820, `600 58px ${MN.enFont}`, '#18224A', { pop: u - .55 });
  text(c, '@thebrowngirl_ss', 540, 880, '600 36px Poppins', '#8E1F18', { pop: u - .6 });
  text(c, 'PAINTING & ANIMATION', 540, 1010, '600 26px Poppins', '#8A6A3A', { pop: u - .75, spacing: 4 });
  if (PICS.logo) picture(c, PICS.logo, 540, 1090, 96, 96, { pop: u - .8 });
  text(c, '@therishikatha', 540, 1180, '600 36px Poppins', '#8E1F18', { pop: u - .85 });
  const k = popK(u - 1.1);
  if (k > .01) { c.save(); c.translate(540, 1340); c.scale(k, k); c.fillStyle = '#2E5F5A'; c.beginPath(); c.roundRect(-230, -44, 460, 88, 44); c.fill(); c.restore(); text(c, 'Follow both', 540, 1342, '600 42px Poppins', '#FBE0CF', { pop: u - 1.1 }); }
} });
MN.band.hold = true; MN.band.hideAfter = 121.2;

// ---------- the intro: the music plays OFF seconds before she sings; shift everything (the terrace holds from 0) ----------
for (const s of SHOTS) { const d = s.draw, first = s.a === 0; if (!first) s.a += TL.OFF; s.b += TL.OFF; s.draw = (c, u, t) => d(c, first ? u - TL.OFF : u, t - TL.OFF); }
for (const v of MN.verse) { if (!v.instant) v.a += TL.OFF; v.b += TL.OFF; }
{ const f = MN.after; MN.after = (c, t) => f(c, t - TL.OFF); }
MN.band.hideAfter += TL.OFF;
