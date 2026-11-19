// mn_cast.js: the Miniature style's cast (needs miniature.js). Figures stand on (0, 0), facing right, ~1000 units tall,
// drawn in profile as Kangra painters drew them: a long straight brow-and-nose line, a long fish-shaped eye with kajal,
// a small chin, slender proportions, cloth with fine fold lines and a gold border.
//   mnMira(c, x, y, s, o): Mirabai: a white odhni with a gold border over a saffron choli, a white ghagra, a tulsi mala,
//     a sandal tilak. o: pose 'stand' | 'sit' | 'dance' | 'parrot' | 'walk', ektara (true), eyes (0 shut..1 open),
//     look (-1..1 the iris down..up), mouth (0..1 open, singing), tilt (head, radians), t (breathing, cloth),
//     flare (the skirt, dance), arms (override: { near: [[x,y]...3], far: [...] }), flip, alpha, close (detail).
//   mnMan(c, x, y, s, o): the bahroopiya: a man painted blue and dressed as Krishna (peacock-feather mukut, yellow
//     pitambar, a mala), playing a flute; o.crown 0..1 (1 on his head, 0 lifted off in his hand), o.flute (1 at the lips,
//     0 lowered), o.grin.
//   mnParrot, mnMurti (Giridhar Gopal in his niche), mnPeacock, mnDiya, mnEktara, mnInstruments.

function mnScaleLines(s, fn) { const k = MN.lw; MN.lw = k / Math.max(.05, s); try { fn(); } finally { MN.lw = k; } }

// ---------- heads ----------
// mnHead(c, o): a woman's head in profile in the figure's units (the chin near (36, -890)). o.eyes, o.look, o.mouth,
// o.skin, o.hair, o.tilak, o.close (adds lashes and a finer eye)
function mnHead(c, o = {}) {
  const C = MN.col, skin = o.skin || C.skin, eyes = o.eyes ?? 1, m = o.mouth || 0;
  // skin: the face's profile line (forehead and nose one straight line, as Kangra painters drew it), then the head
  const face = [[19, -984], [25.5, -968], [31, -953], [41.5, -929, 1], [35.5, -923.5], [36.4, -918, 1], [33.4, -914.6 + m * 1.2, 1], [35.2, -910 + m * 2.8, 1], [31, -905 + m * 2.4], [32.8, -898 + m * 2], [26.5, -890 + m * 1.5], [13, -887], [11, -866], [17, -828, 1], [-21, -828, 1], [-18, -866], [-34, -900], [-45, -942], [-30, -988]];
  mnFill(c, face, skin, { shade: [C.skinSh, 34, 0, -40, 0], shadeA: .4 });
  // cheek warmth
  c.save(); c.clip(mnPath(face)); glow(c, 12, -918, 16, '#E98C80', .14, 'source-over'); c.restore();
  if (m > .05) mnFill(c, [[33.4, -914.4], [35.6, -912.6], [33, -909.8 + m * 2.6]], '#5A1A18', { line: false });
  // lips
  mnFill(c, [[36.4, -918], [32.6, -915.2], [34.4, -913.8]], '#C2403A', { line: false });
  mnFill(c, [[33.4, -913.4 + m * 1.2], [35.2, -910.2 + m * 2.8], [31.4, -907.8 + m * 2.6]], '#C2403A', { line: false });
  // hair: a black mass over the top and back, a lock along the temple, the bun at the nape
  const hair = [[20, -985], [10, -997], [-14, -1003], [-40, -991], [-54, -960], [-58, -925], [-62, -900], [-48, -884], [-30, -890], [-24, -905], [-12, -918], [-7, -936], [-5, -955], [5, -973]];
  mnFill(c, hair, o.hair || C.black, { line: '#000000' });
  mnStroke(c, [[17, -983], [4, -973], [-4, -956], [-6, -936]], 'rgba(255,255,255,.18)', MN.lw * .8);
  // ear and a small jhumka
  mnEll(c, -9, -930, 5.5, 9, skin, { lw: MN.lw * .8 });
  mnStroke(c, [[-9, -922], [-9, -915]], C.gold, MN.lw * .8);
  mnFill(c, [[-13.5, -912, 1], [-4.5, -912, 1], [-2.5, -905], [-9, -902], [-15.5, -905]], C.gold, { lw: MN.lw * .6 });
  for (let i = 0; i < 3; i++) mnDot(c, -13 + i * 4, -900.5, 1.1, C.gold);
  // the eye: a long fish shape, kajal to the temple, the iris against the upper lid
  const ey = -949.5, open = clamp(eyes), ex = 25;
  if (open > .08) {
    const up = 6 * open, lo = 3.3 * open, look = (o.look || 0) * 1.4;
    const eye = [[ex, ey + .8, 1], [ex - 10, ey - up], [ex - 22, ey - up * .55], [ex - 28, ey - .6, 1], [ex - 19, ey + lo * .9], [ex - 8, ey + lo]];
    mnFill(c, eye, '#FBF7EE', { line: false });
    c.save(); c.clip(mnPath(eye)); mnDot(c, ex - 8.5, ey - up * .2 - look, 4.3, '#17100C'); mnDot(c, ex - 7.4, ey - up * .42 - look, 1.1, 'rgba(255,255,255,.8)'); c.restore();
    mnStroke(c, [[ex + .5, ey + .6], [ex - 10, ey - up - .5], [ex - 22, ey - up * .6], [ex - 28, ey - .8], [ex - 36, ey - 2.4]], '#140C08', MN.lw * 1.2);
    mnStroke(c, [[ex - 1, ey + 1.2], [ex - 9, ey + lo + .2], [ex - 19, ey + lo * .9], [ex - 28, ey - .2]], '#140C08', MN.lw * .65);
    
  } else {
    // shut: one long downward arc with lashes
    mnStroke(c, [[ex, ey + 1], [ex - 11, ey + 3.2], [ex - 24, ey + 1.6], [ex - 33, ey - 1.5]], '#140C08', MN.lw * 1.2);
    if (o.close) for (let i = 0; i < 6; i++) { const u = .12 + i * .14, px = lerp(ex - 2, ex - 30, u), py = ey + 1.6 + Math.sin(u * Math.PI) * 1.6; mnStroke(c, [[px, py], [px - 1.4, py + 3.6]], '#140C08', MN.lw * .45); }
  }
  // brow: a long thin arc
  mnStroke(c, [[25.5, -960], [14, -964.5], [0, -963], [-8, -959]], '#1B120C', MN.lw * 1.0);
  // nostril
  mnStroke(c, [[36.5, -925], [33.5, -924]], mnLineCol(skin), MN.lw * .65);
  // tilak: a sandal stroke on the brow
  if (o.tilak !== false) { mnStroke(c, [[23.6, -968], [20.6, -979]], '#F3E6C8', MN.lw * 1.6); mnStroke(c, [[22.9, -970], [21.4, -977]], '#C9372A', MN.lw * .6); }
}

// ---------- the ektara ----------
// mnEktara(c, x, y, len, ang, o): the gourd at (x, y), the bamboo neck up along ang (radians from vertical), a peg, a string
function mnEktara(c, x, y, len = 400, ang = .12, o = {}) {
  const C = MN.col, tx = x + Math.sin(ang) * len, ty = y - Math.cos(ang) * len;
  mnLimb(c, [[x, y], [tx, ty]], [9, 7], '#B07A3E');
  mnFill(c, [[tx - 9, ty - 4, 1], [tx + 9, ty - 4, 1], [tx + 7, ty - 22, 1], [tx - 7, ty - 22, 1]], C.vermilion, { lw: MN.lw * .8 });
  mnEll(c, x, y + 8, 36, 40, '#C8954E', { shade: ['#6E4520', x + 30, y, x - 36, y], shadeA: .55 });
  mnEll(c, x + 4, y + 10, 16, 18, '#7A5030', { lw: MN.lw * .7 });
  mnStroke(c, [[tx, ty - 6], [x + 2, y + 6]], 'rgba(250,240,210,.9)', MN.lw * .6);
  if (o.pluck) { c.save(); c.globalAlpha = o.pluck; mnStroke(c, [[lerp(tx, x, .7) - 4, lerp(ty, y, .7)], [lerp(tx, x, .85) - 4, lerp(ty, y, .85)]], 'rgba(255,240,200,.8)', MN.lw * 1.4); c.restore(); }
}

// ---------- hands ----------
// a slender hand at the end of a forearm: (x, y) the wrist, a the direction it points, o.fingers 'open' | 'pluck' | 'hold'
function mnHand(c, x, y, a, skin, o = {}) {
  c.save(); c.translate(x, y); c.rotate(a);
  const f = o.fingers || 'open';
  mnFill(c, [[-2, -7], [14, -8], [26, -5], [26, 5], [12, 8], [-2, 7]], skin, { lw: MN.lw * .8 });
  if (f === 'open' || f === 'pluck') {
    for (const [dy, L, bend] of [[-5, 22, 0], [-1.5, 25, .05], [2, 23, .1], [5.2, 18, .16]]) mnLimb(c, [[22, dy], [22 + L * .6, dy + L * bend * 1.5], [22 + L, dy + L * bend * 3 + (f === 'pluck' ? 5 : 0)]], [4.4, 3.4], skin, { lw: MN.lw * .6 });
  } else {
    mnFill(c, [[20, -7], [34, -6], [36, 3], [24, 8]], skin, { lw: MN.lw * .7 });
  }
  mnLimb(c, [[8, -6], [16, -14], [24, -16]], [5, 3.6], skin, { lw: MN.lw * .6 });   // thumb
  mnDot(c, 30, 0, 2.2, '#C9372A');   // a mehndi/alta dot
  c.restore();
}
// an arm from shoulder through elbow to wrist with a hand; bangles at the wrist
function mnArm(c, P, skin, o = {}) {
  mnLimb(c, P, [24, 19, 15], skin);
  const [ex, ey] = P[1], [wx, wy] = P[2], a = Math.atan2(wy - ey, wx - ex);
  for (let i = 0; i < 3; i++) { const k = .88 - i * .05; mnStroke(c, [[lerp(ex, wx, k) - Math.sin(a) * 8, lerp(ey, wy, k) + Math.cos(a) * 8], [lerp(ex, wx, k) + Math.sin(a) * 8, lerp(ey, wy, k) - Math.cos(a) * 8]], o.bangle || '#F3EEDF', MN.lw * 1.4); }
  mnHand(c, wx, wy, o.ha ?? a, skin, o);
}

// ---------- Mira ----------
const MIRA = {
  skin: '#F1CDB0', odhni: '#F6F1E4', ghagra: '#F3EDDF', choli: '#E39A3A', border: '#C9372A', gold: '#D9A93A', fold: '#B9AE98',
};
const MIRA_ARMS = {
  stand: { far: [[6, -818], [40, -755], [86, -905]], near: [[-4, -815], [-16, -720], [44, -700]], ektara: [70, -690, 420, .1], farFingers: 'hold', nearFingers: 'pluck' },
  sit: { far: [[6, -818], [40, -755], [86, -905]], near: [[-4, -815], [-16, -720], [44, -700]], ektara: [70, -690, 420, .1], farFingers: 'hold', nearFingers: 'pluck' },
  parrot: { far: [[6, -818], [30, -730], [60, -690]], near: [[-4, -815], [60, -800], [128, -850]], farFingers: 'hold', nearFingers: 'open' },
  letter: { far: [[6, -818], [34, -735], [70, -760]], near: [[-4, -815], [10, -730], [62, -770]], farFingers: 'hold', nearFingers: 'hold' },
  dance: { far: [[6, -818], [70, -880], [150, -930]], near: [[-4, -815], [-60, -900], [-30, -1010]], farFingers: 'open', nearFingers: 'open' },
  dance2: { far: [[6, -818], [60, -760], [140, -770]], near: [[-4, -815], [-70, -760], [-120, -820]], farFingers: 'open', nearFingers: 'open' },
  walk: { far: [[6, -818], [26, -730], [44, -660]], near: [[-4, -815], [-20, -725], [40, -695]], ektara: [62, -684, 420, .16], farFingers: 'hold', nearFingers: 'hold' },
  pray: { far: [[6, -818], [44, -760], [64, -840]], near: [[-4, -815], [36, -765], [62, -838]], farFingers: 'open', nearFingers: 'open' },
  diya: { far: [[6, -818], [40, -735], [96, -700]], near: [[-4, -815], [30, -735], [92, -712]], farFingers: 'open', nearFingers: 'open' },
};
function mnMira(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(o.flip ? -s : s, s); if (o.alpha != null) c.globalAlpha *= o.alpha; if (o.rot) c.rotate(o.rot);
  mnScaleLines(s * (o.lineK || 1), () => mnMiraDraw(c, o));
  c.restore();
}
function mnMiraDraw(c, o) {
  const C = MN.col, M = MIRA, t = o.t || 0, pose = o.pose || 'stand', A = { ...MIRA_ARMS[pose === 'sit' ? 'sit' : pose] || MIRA_ARMS.stand, ...(o.arms || {}) };
  const sit = pose === 'sit' || o.seated, dy = sit ? 400 : 0, flare = o.flare ?? (pose === 'dance' ? 1 : 0), sw = o.swirl || 0;
  const br = Math.sin(t * 1.6) * 1.2, wind = o.wind ?? 0;
  // the odhni's long drape down her back (behind everything)
  c.save(); c.translate(0, dy);
  const flow = Math.sin(t * 1.3) * 8 * (1 + wind) + wind * 40 + sw * 60;
  const drape = [[-24, -1000], [-60, -975], [-78, -900], [-92, -800], [-112 - flow * .3, -680], [-128 - flow * .6, -560], [-150 - flow, -470 + (sit ? 120 : 0), 1], [-112 - flow * .7, -500 + (sit ? 120 : 0)], [-70 - flow * .4, -560], [-44, -700], [-30, -830]];
  if (!sit || true) mnFill(c, drape, M.odhni, { shade: [M.fold, 0, -900, -140, -500], shadeA: .5 });
  mnStroke(c, drape.slice(5, 8).map(p => [p[0] + 6, p[1]]), M.gold, MN.lw * 2.2);
  c.restore();
  // the far arm (behind the body)
  const lift = ([px, py]) => [px, py + dy];
  if (A.far && o.arms !== false) mnArm(c, A.far.map(lift), mixCol(M.skin, '#C08A6A', .25), { fingers: A.farFingers, bangle: '#EDE5D2' });
  // the ektara behind the near arm, in front of the body
  // ghagra
  if (!sit) {
    const hf = 130 + flare * 120, hb = -140 - flare * 110 - sw * 40, hy = -18 + flare * -40;
    const sk = [[-26, -706], [28, -706], [56, -520], [hf * .8, -260], [hf + sw * 30, hy, 1], [hf * .5, hy + 14 - flare * 10], [0, hy + 18 - flare * 14], [hb * .5, hy + 14 - flare * 10], [hb, hy - 6 + sw * 20, 1], [hb * .78, -250], [-54, -520]];
    mnFill(c, sk, M.ghagra, { shade: [M.fold, 60, 0, -140, 0], shadeA: .55 });
    // pleats fanning from the waist, and the gold border along the hem
    for (let i = 0; i < 11; i++) { const u = i / 10, hx = lerp(hb * .92, hf * .92, u), mid = lerp(-40, 44, u); mnStroke(c, [[mid * .5, -690], [lerp(mid, hx, .5), -360], [hx, hy + 8 + Math.sin(u * Math.PI) * 10 - flare * 6]], M.fold, MN.lw * .9); }
    const hem = mnPts([[hb, hy - 6 + sw * 20], [hb * .5, hy + 14 - flare * 10], [0, hy + 18 - flare * 14], [hf * .5, hy + 14 - flare * 10], [hf + sw * 30, hy]], false, 8);
    c.save(); c.strokeStyle = M.gold; c.lineWidth = 14; c.lineCap = 'butt'; c.beginPath(); hem.forEach(([px, py], i) => i ? c.lineTo(px, py - 8) : c.moveTo(px, py - 8)); c.stroke();
    c.strokeStyle = M.border; c.lineWidth = 4; c.stroke(); c.restore();
    // feet with alta, under the hem; ghungroo on the ankles when dancing
    const fy = flare ? hy + 22 : 0, fx = flare ? 40 : 70;
    mnFill(c, [[fx, fy - 18], [fx + 40, fy - 6], [fx + 44, fy, 1], [fx, fy + 1, 1]], M.skin, {});
    mnStroke(c, [[fx + 2, fy], [fx + 42, fy]], '#C9372A', MN.lw * 2.2);
    if (o.bells) for (let i = 0; i < 6; i++) mnDot(c, fx + 4 + i * 4, fy - 16 + Math.sin(i) * 1.5, 2.6, C.gold);
  } else {
    // seated: the ghagra as a broad mound, knees forward
    const sk = [[-26, -306], [30, -306], [80, -250], [180, -150], [205, -40, 1], [150, -2], [0, 0], [-120, -2], [-150, -20, 1], [-120, -150], [-60, -260]];
    mnFill(c, sk, M.ghagra, { shade: [M.fold, 0, -300, 0, 0], shadeA: .5 });
    for (let i = 0; i < 7; i++) { const u = i / 6; mnStroke(c, [[lerp(-20, 30, u), -300], [lerp(-100, 120, u), -150], [lerp(-130, 170, u), -8]], M.fold, MN.lw * .9); }
    c.save(); c.strokeStyle = M.gold; c.lineWidth = 12; c.beginPath(); mnPts([[-150, -20], [-120, -6], [0, -4], [150, -6], [205, -40]], false).forEach(([px, py], i) => i ? c.lineTo(px, py - 6) : c.moveTo(px, py - 6)); c.stroke(); c.strokeStyle = M.border; c.lineWidth = 3.5; c.stroke(); c.restore();
    mnFill(c, [[190, -30], [232, -14], [236, -6, 1], [196, -4, 1]], M.skin, {});
    mnStroke(c, [[198, -5], [234, -5]], '#C9372A', MN.lw * 2);
  }
  c.save(); c.translate(0, dy);
  if (o.lean) c.rotate(o.lean);
  // torso: the choli and her midriff under the odhni
  const torso = [[-20, -834], [16, -834], [24, -822], [48, -800 + br * .3], [54, -780 + br * .3], [44, -756], [30, -742], [28, -706, 1], [-26, -706, 1], [-34, -760], [-38, -812]];
  mnFill(c, torso, M.skin, { shade: [M.skin === MIRA.skin ? '#DDA98A' : '#000000', 40, 0, -40, 0], shadeA: .35 });
  mnFill(c, [[-20, -834], [16, -834], [24, -822], [48, -800 + br * .3], [54, -780 + br * .3], [44, -756], [-30, -752], [-38, -812]], M.choli, { shade: ['#9A4A18', 50, 0, -40, 0], shadeA: .4 });
  mnStroke(c, [[52, -768], [40, -758], [-28, -754]], M.gold, MN.lw * 1.4);
  // waistband
  mnFill(c, [[-27, -712, 1], [29, -712, 1], [30, -700, 1], [-28, -700, 1]], M.gold, { lw: MN.lw * .7 });
  c.restore();
  // the head (tilts about the neck), then the odhni over it
  c.save(); c.translate(0, dy); if (o.lean) c.rotate(o.lean);
  c.translate(0, -840); c.rotate(o.tilt || 0); c.translate(0, 840);
  mnHead(c, { eyes: o.eyes, look: o.look, mouth: o.mouth, close: o.close });
  // odhni over the head, framing the face, falling over the near shoulder and across the chest
  const od = [[21, -990], [8, -1006], [-26, -1010], [-56, -986], [-68, -940], [-74, -880], [-60, -820], [-46, -760], [-36, -706], [0, -700], [30, -716], [56, -760, 1], [40, -788], [16, -808], [-6, -830], [-14, -862], [-13, -905], [-9, -945], [3, -973]];
  mnFill(c, od, M.odhni, { shade: [M.fold, 30, -1000, -60, -760], shadeA: .45, alpha: o.veil ?? 1 });
  // the border along its front edge and the fold lines
  mnStroke(c, [[21, -990], [3, -973], [-9, -945], [-13, -905], [-14, -862], [-6, -830], [16, -808], [40, -788], [56, -760]], M.gold, MN.lw * 2.6);
  mnStroke(c, [[21, -990], [3, -973], [-9, -945], [-13, -905], [-14, -862], [-6, -830], [16, -808], [40, -788], [56, -760]], M.border, MN.lw * .7);
  for (const k of [0, 1, 2]) mnStroke(c, [[-30 - k * 10, -980 + k * 6], [-50 - k * 6, -900], [-40 - k * 4, -790 + k * 12]], M.fold, MN.lw * .8);
  // tulsi mala at the throat
  for (let i = 0; i < 11; i++) mnDot(c, lerp(-2, 30, i / 10) + Math.sin(i / 10 * Math.PI) * 4, -826 + Math.sin(i / 10 * Math.PI) * 16, 1.9, '#7A4A2A');
  c.restore();
  // the ektara, then the near arm over it
  if (A.ektara && o.ektara !== false && o.arms !== false) { const [ex, ey, el, ea] = A.ektara; mnEktara(c, ex, ey + dy, el, ea, { pluck: o.pluck || 0 }); }
  if (o.hold) o.hold(c, dy);
  if (A.near && o.arms !== false) mnArm(c, A.near.map(lift), M.skin, { fingers: A.nearFingers });
  if (o.after) o.after(c, dy);
}

// ---------- the bahroopiya ----------
const BAHRU = { skin: '#4A6DB5', skinSh: '#2C4686', dhoti: '#E8B83C', sash: '#C9372A', hair: '#1B1512', stubble: '#2A2420' };
function mnMan(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(o.flip ? -s : s, s); if (o.alpha != null) c.globalAlpha *= o.alpha;
  mnScaleLines(s, () => mnManDraw(c, o)); c.restore();
}
function mnManDraw(c, o) {
  const C = MN.col, B = BAHRU, t = o.t || 0, crown = o.crown ?? 1, fl = o.flute ?? 1, sk = B.skin;
  const bob = Math.sin(t * 4) * 3 * (o.dance || 0);
  c.translate(0, bob);
  // far arm and leg
  const farArm = fl > .5 ? [[8, -800], [60, -760], [100, -870]] : [[8, -800], [30, -700], [70, -620]];
  mnArm(c, farArm, mixCol(sk, '#1C2C60', .25), { fingers: 'hold', bangle: C.gold });
  mnLimb(c, [[-10, -470], [-8, -240], [-20, -20]], [44, 32, 24], mixCol(sk, '#1C2C60', .25));
  // the dhoti: pitambar from waist to mid-calf, pleats in front
  const dh = [[-46, -560], [44, -560], [60, -420], [70, -230, 1], [10, -210], [-6, -260], [-30, -210], [-70, -230, 1], [-60, -420]];
  mnFill(c, dh, B.dhoti, { shade: ['#9A6A10', 50, 0, -60, 0], shadeA: .45 });
  for (let i = 0; i < 4; i++) mnStroke(c, [[10 + i * 8, -540], [20 + i * 10, -380], [24 + i * 12, -226]], '#A87A18', MN.lw);
  mnStroke(c, [[-70, -236], [10, -216], [70, -236]], C.vermilion, MN.lw * 3);
  // near leg
  mnLimb(c, [[14, -470], [24, -240], [30, -20]], [46, 34, 24], sk);
  mnFill(c, [[18, -24], [62, -12], [64, 0, 1], [16, 0, 1]], sk, {});
  mnStroke(c, [[16, -40], [44, -38]], C.gold, MN.lw * 2.2);
  // torso, bare and blue, with a sash
  const tor = [[-36, -840], [34, -840], [56, -800], [58, -720], [46, -600], [44, -556, 1], [-48, -556, 1], [-52, -640], [-48, -760]];
  mnFill(c, tor, sk, { shade: [B.skinSh, 50, 0, -50, 0], shadeA: .5 });
  mnFill(c, [[-50, -600], [48, -616], [50, -580], [-50, -566]], B.sash, {});
  // vaijayanti mala to the knees, of many colours
  for (let i = 0; i < 26; i++) { const u = i / 25, px = lerp(-14, 42, u) + Math.sin(u * Math.PI) * 30, py = lerp(-836, -380, u); mnDot(c, px, py, 5, ['#C9372A', '#F4EEDF', '#E8B83C', '#4F7A3E'][i % 4]); }
  // head: a man's profile, blue
  c.save(); c.translate(0, -850); c.rotate(o.tilt || 0); c.translate(0, 850);
  const face = [[24, -995], [33, -975], [36, -960], [53, -930, 1], [44, -924], [45, -917, 1], [41, -912, 1], [43, -906, 1], [38, -900], [41, -890], [32, -880], [18, -876], [14, -856], [16, -838, 1], [-26, -838, 1], [-22, -866], [-40, -900], [-50, -950], [-34, -996]];
  mnFill(c, face, sk, { shade: [B.skinSh, 40, 0, -40, 0], shadeA: .5 });
  // eye and brow
  const ey = -955;
  mnFill(c, [[31, ey + .8, 1], [20, ey - 6], [6, ey - 3.5], [0, ey - .5, 1], [9, ey + 3], [21, ey + 3.4]], '#F6F2E6', { line: false });
  mnDot(c, 21 + (o.lookX || 0), ey - 1.5, 4.2, '#140C08');
  mnStroke(c, [[31.5, ey + .6], [20, ey - 6.5], [6, ey - 4], [-1, ey - 1], [-8, ey - 2.5]], '#0E0806', MN.lw * 1.2);
  mnStroke(c, [[32, -967], [19, -972], [4, -969]], '#0E0806', MN.lw * 1.3);
  mnFill(c, [[45, -917], [41, -913], [43, -910]], '#7A2A3A', { line: false });
  // the moustache: only when the flute is down
  if (fl < .6) { const g = o.grin || 0; mnFill(c, [[44, -918], [36, -916], [24, -912 - g * 3], [14, -916 - g * 5], [24, -919], [36, -922]], '#151010', { line: false, alpha: 1 - fl / .6 }); }
  if (crown < 1) {
    // his own hair: short, with a choti, and a tilak smudge
    mnFill(c, [[24, -995], [10, -1008], [-20, -1010], [-46, -990], [-52, -955], [-40, -930], [-26, -950], [-6, -985]], B.hair, {});
  }
  // ear, earring, tilak
  mnEll(c, -8, -935, 6, 10, sk, { lw: MN.lw * .8 }); mnDot(c, -8, -918, 4.5, C.gold);
  mnStroke(c, [[33, -972], [29, -990]], '#F4EAD0', MN.lw * 1.8); mnStroke(c, [[32, -974], [30, -986]], C.vermilion, MN.lw * .6);
  c.restore();
  // the crown: a gold mukut with a peacock feather, on his head or in his hand
  const cr = (cx, cy, a) => {
    c.save(); c.translate(cx, cy); c.rotate(a);
    mnFill(c, [[-48, 0, 1], [36, 0, 1], [40, -40], [24, -96], [-6, -116], [-36, -100], [-52, -46]], C.gold, { shade: ['#8A5A10', 40, 0, -50, 0], shadeA: .4 });
    for (let i = 0; i < 4; i++) mnDot(c, -30 + i * 20, -18, 4, i % 2 ? '#C9372A' : '#2E7A5A');
    mnStroke(c, [[-46, -6], [38, -6]], '#F4EEDF', MN.lw * 2.4);
    // feather: a curved quill and the eye
    mnStroke(c, [[-6, -110], [-14, -160], [-34, -200]], '#3C6A3A', MN.lw * 1.6);
    mnEll(c, -36, -206, 16, 24, '#2E7A5A', { rot: .5, lw: MN.lw * .8 }); mnEll(c, -36, -206, 10, 15, '#2A5DA8', { rot: .5, line: false }); mnEll(c, -36, -207, 5, 8, '#1A2050', { rot: .5, line: false }); mnDot(c, -37, -208, 2.6, C.gold);
    c.restore();
  };
  if (crown >= 1) cr(-6, -990, 0);
  // near arm: flute at the lips, or lowered; the crown in his hand when lifted off
  const fla = fl > .5;
  if (fla) {
    mnArm(c, [[-6, -800], [40, -720], [88, -880]], sk, { fingers: 'hold', bangle: C.gold });
    // the flute along the lips, angled down to his right
    c.save(); c.translate(48, -912); c.rotate(.22);
    mnFill(c, [[-10, -4, 1], [190, -4, 1], [190, 4, 1], [-10, 4, 1]], '#9C6A34', { lw: MN.lw * .8 });
    for (let i = 0; i < 6; i++) mnDot(c, 70 + i * 18, 0, 2, '#2A1A10');
    mnStroke(c, [[0, 0], [-6, 22], [-2, 40]], C.vermilion, MN.lw * 1.6); mnDot(c, -2, 44, 5, C.vermilion);
    c.restore();
  } else {
    const k = 1 - crown;   // 0..1 lifted
    const hx = lerp(-6, 70, k), hy = lerp(-990, -1080 + k * 40, k);
    if (crown < 1) { mnArm(c, [[-6, -800], [lerp(10, 50, k), lerp(-880, -900, k)], [hx + 10, hy + 30]], sk, { fingers: 'hold', bangle: C.gold }); cr(hx, hy, -.3 * k); }
    else mnArm(c, [[-6, -800], [10, -700], [60, -640]], sk, { fingers: 'hold', bangle: C.gold });
    // the flute tucked in the sash
    mnLimb(c, [[-40, -640], [60, -560]], [7, 7], '#9C6A34');
  }
}

// ---------- birds, the shrine, lamps, instruments ----------
function mnParrot(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(o.flip ? -s : s, s);
  const flap = o.flap || 0;
  mnFill(c, [[0, 0], [-6, -30], [6, -48], [22, -44], [26, -24], [14, 4]], '#4FA04A', {});
  mnFill(c, [[-2, -4], [-22, 34], [-14, 36], [6, 2]], '#2E7A3A', {});   // tail
  mnFill(c, [[-4, -30], [-12 - flap * 10, -12 - flap * 30], [10, -6]], '#3E8A3E', {});   // wing
  mnEll(c, 14, -52, 12, 11, '#5EB05A', {});
  mnFill(c, [[22, -56], [32, -52], [30, -42], [22, -46]], '#D0342A', { lw: MN.lw * .8 });
  mnDot(c, 15, -55, 2.4, '#140C08');
  mnStroke(c, [[6, -44], [22, -40]], '#1A1A1A', MN.lw * .8); mnStroke(c, [[6, -44], [22, -40]], '#E26A8A', MN.lw * .4);
  if (o.letter) { c.save(); c.translate(34, -44); c.rotate(.3); mnFill(c, [[0, -6, 1], [26, -6, 1], [26, 6, 1], [0, 6, 1]], '#F2E8CC', { lw: MN.lw * .7 }); mnStroke(c, [[4, 0], [22, 0]], '#C9372A', MN.lw * .6); c.restore(); }
  c.restore();
}
// Giridhar Gopal: a small black murti in tribhanga, flute, mukut, yellow dhoti, in a gold-lit niche (front view)
function mnMurti(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  mnScaleLines(s, () => {
    const C = MN.col, bk = '#26242E';
    mnFill(c, [[-60, 0, 1], [60, 0, 1], [56, -24, 1], [-56, -24, 1]], C.gold, {});
    mnLimb(c, [[-8, -24], [-14, -100], [-4, -170]], [16, 16, 18], bk); mnLimb(c, [[10, -24], [24, -100], [10, -170]], [16, 16, 18], bk);
    mnFill(c, [[-22, -180], [26, -180], [30, -130], [-22, -120]], C.yellow, {});
    mnFill(c, [[-22, -262], [26, -262], [32, -200], [24, -176], [-22, -176], [-28, -220]], bk, {});
    mnEll(c, 0, -290, 20, 24, bk, {});
    mnFill(c, [[-22, -300, 1], [22, -300, 1], [16, -340], [0, -352], [-16, -340]], C.gold, {});
    mnStroke(c, [[6, -350], [16, -380]], '#2E7A5A', MN.lw * 1.5); mnEll(c, 18, -384, 6, 9, '#2A5DA8', { rot: .4, lw: MN.lw * .5 });
    mnLimb(c, [[-22, -250], [-40, -214], [-8, -232]], [12, 10], bk); mnLimb(c, [[24, -250], [36, -218], [14, -234]], [12, 10], bk);
    mnStroke(c, [[-34, -240], [40, -226]], '#9C6A34', MN.lw * 2.4);
    for (let i = 0; i < 11; i++) { const u = i / 10; mnDot(c, lerp(-18, 20, u), -258 + Math.sin(u * Math.PI) * 70, 3.6, i % 2 ? '#E8B83C' : '#F4EEDF'); }
    mnDot(c, -7, -292, 1.8, '#F4EEDF'); mnDot(c, 7, -292, 1.8, '#F4EEDF');
  });
  c.restore();
}
function mnDiya(c, x, y, s, t, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const fl = 1 + Math.sin(t * 13) * .08 + Math.sin(t * 7.3) * .06;
  glow(c, 0, -26, 90 * (o.glow ?? 1), '#FFC864', .45 * (o.glow ?? 1), 'lighter');
  mnFill(c, [[-26, -8], [26, -8], [18, 6], [-18, 6]], '#B5622E', { lw: 1.4 });
  if (o.lit !== false) { c.save(); c.translate(0, -10); c.scale(1, fl); mnFill(c, [[0, -30], [8, -8], [0, 2], [-8, -8]], '#FFD36A', { line: '#E07A1A', lw: 1 }); mnFill(c, [[0, -16], [3.5, -5], [0, 0], [-3.5, -5]], '#FFF6D8', { line: false }); c.restore(); }
  c.restore();
}
function mnPeacock(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.scale(o.flip ? -s : s, s);
  mnScaleLines(s, () => {
    const C = MN.col;
    // the long train hanging down behind
    const tr = [[-10, -40], [-150, -10], [-260, 40], [-300, 80, 1], [-250, 76], [-130, 30], [-10, -10]];
    mnFill(c, tr, '#2F6B4A', { shade: ['#10301E', 0, -40, 0, 80], shadeA: .5 });
    for (let i = 0; i < 9; i++) { const u = .25 + i * .085, px = lerp(-30, -290, u), py = lerp(-25, 74, u) - 4; mnEll(c, px, py, 9, 7, '#1A2E6A', { lw: .8 }); mnDot(c, px, py, 3, C.gold); }
    mnEll(c, 0, -50, 40, 32, '#245A9A', { shade: ['#0A1A40', 0, -80, 0, -20] });
    mnFill(c, [[22, -66], [34, -110], [44, -130], [56, -128], [52, -112], [40, -96], [34, -60]], '#2A68B8', {});
    mnDot(c, 48, -122, 2.4, '#140C08'); mnFill(c, [[56, -126], [66, -120], [56, -116]], '#7A6A50', { lw: .8 });
    for (let i = 0; i < 4; i++) mnStroke(c, [[46, -130], [44 + i * 4 - 6, -152]], '#245A9A', 1.4), mnDot(c, 44 + i * 4 - 6, -154, 3, '#2A68B8');
    mnStroke(c, [[0, -20], [4, 10]], '#7A6A50', 3); mnStroke(c, [[14, -22], [16, 10]], '#7A6A50', 3);
  });
  c.restore();
}
function mnInstruments(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  mnScaleLines(s, () => {
    // mridang lying on its side
    mnFill(c, [[-120, -40], [-20, -52], [10, -26], [-20, 0], [-120, -10]], '#8A4A26', { shade: ['#3A1A08', 0, -50, 0, 0] });
    mnEll(c, -122, -25, 14, 22, '#E8D8B0', {}); mnEll(c, 12, -26, 16, 28, '#E8D8B0', {}); mnDot(c, 12, -26, 8, '#2A2420');
    for (let i = 0; i < 6; i++) mnStroke(c, [[-112 + i * 22, -46 + i * .6], [-110 + i * 22, -4]], '#E8D8B0', 1);
    // a daf (frame drum) leaning
    mnEll(c, 110, -54, 52, 56, '#C8A060', { rot: .2 }); mnEll(c, 110, -54, 44, 48, '#EDE0C0', { rot: .2, lw: 1 });
  });
  c.restore();
}
