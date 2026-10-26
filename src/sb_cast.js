// sb_cast.js: the Storybook style's characters (load after storybook.js). Each is drawn in its own units with the
// origin between its feet (y up is negative), so sbX(c, x, y, s, o) stands it on (x, y) at scale s. They are round
// and simple, picture-book fashion: flat shapes, dot eyes, blush, dry-brush fur. Shared options: blink (0..1),
// happy (∩ eyes), look ([dx, dy]), mouth, hop (0..1: squash and stretch for a jump; lift it with y yourself), t (the
// time, for breathing and idle twitches; pass the shot's t).
function sbAt(c, x, y, s, draw, o = {}) {
  c.save(); c.translate(x, y); if (o.flip) c.scale(-1, 1);
  const h = o.hop || 0, sq = h < 0 ? 1 + h * .12 : 1 + h * .08; c.scale(s / Math.sqrt(sq), s * sq); if (o.rot) c.rotate(o.rot);
  draw(); c.restore();
}
const sbBreath = (o, f = 1.6, a = 6) => Math.sin((o.t || 0) * TAU / f) * a;
const sbBlink = o => o.blink ?? (frac(((o.t || 0) + (o.ph || 0)) / 3.1) > .955 ? 1 : 0);
// sbLimb(c, a, b, w, col): an arm or leg as one soft oval from point a to point b, w its half-width
function sbLimb(c, [ax, ay], [bx, by], w, col, o = {}) { const L = Math.hypot(bx - ax, by - ay); sbEll(c, (ax + bx) / 2, (ay + by) / 2, w, L / 2 + w * .5, col, { tex: false, ...o, rot: Math.atan2(by - ay, bx - ax) - Math.PI / 2 }); }

// ---------- Mooshak, Bappa's mouse (side view facing left, sitting up) ----------
// o: hold ('modak' | null), ear (0..1 a twitch), tail (-1..1 sway), nose (a sniff), mouth ('smile' | 'grin' | 'o')
const SB_MOUSE = { fur: '#8E8A93', belly: '#B7B2BB', mark: '#ECE7EF', pink: '#EFA2A0', nose: '#E46A78' };
function sbMouse(c, x, y, s, o = {}) {
  const P = { ...SB_MOUSE, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o), bl = sbBlink(o);
  const sway = o.tail ?? Math.sin(t * 2.1) * .5, ear = o.ear ?? (frac(t / 2.4) < .15 ? Math.sin(frac(t / 2.4) / .15 * Math.PI) : 0), nose = o.nose ?? (frac(t / 1.9) < .25 ? Math.sin(t * 40) * 3 : 0);
  sbAt(c, x, y, s, () => {
    sbDry(c, [[160, -80], [280, -70 + sway * 30], [340, -150 + sway * 50], [300, -210], [260, -180]], 16, P.pink, 1, 7, { n: 30 });
    c.translate(0, br * .5);
    sbEll(c, 35, -250, 215, 255, P.fur, { pear: .22, rot: -.06, shade: ['rgba(40,30,60,.22)', .5] });
    sbEll(c, -20, -200, 120, 165, P.belly, { pear: .2, rot: -.1, ang: -1.2 });
    sbChevrons(c, [[-45, -285], [5, -250], [-50, -210], [10, -170], [-35, -125]], 11, P.mark);
    sbEll(c, -70, -10, 62, 24, P.pink, { rot: -.05, tex: false }); sbEll(c, 100, -5, 62, 24, P.pink, { rot: .05, tex: false });
    c.save(); c.translate(-20, -580); c.rotate(Math.sin(t * TAU / 3.2) * .03 + (o.tilt || 0)); c.translate(20, 580);
    c.save(); c.translate(-110, -740); c.rotate(-ear * .14); c.translate(110, 740);
    sbEll(c, -110, -740, 98, 102, P.fur); sbEll(c, -104, -732, 62, 66, P.pink, { tex: false }); c.restore();
    sbEll(c, 110, -760, 108, 112, P.fur); sbEll(c, 106, -752, 70, 74, P.pink, { tex: false });
    sbEll(c, 5, -580, 180, 160, P.fur, { rot: .1, shade: ['rgba(40,30,60,.18)', .4] });
    sbEll(c, -140, -540, 125, 80, P.fur, { rot: .18, pear: -.1 });
    sbDot(c, -254 + nose * .3, -528 + nose, 24, P.nose);
    sbEye(c, -82, -600, 20, { blink: bl, happy: o.happy, look: o.look });
    sbCheek(c, -35, -520, 54);
    sbMouth(c, -182, -484, 56, o.mouth || 'smile');
    for (const [dy, k] of [[-14, -.12], [4, 0], [22, .14]]) sbDry(c, [[-240, -530 + dy], [-310, -540 + dy + k * 60], [-365, -545 + dy + k * 130]], 2.5, SB.ink, .8, 2, { n: 10 });
    c.restore();
    if (o.hold === 'modak') sbModak(c, -120, -270, 1);
    sbEll(c, -180, -315, 38, 30, P.fur, { rot: .5 }); sbEll(c, -60, -310, 38, 30, P.fur, { rot: -.5 });
  }, o);
}
// a modak standing on (x, y), about 130 tall at k 1
function sbModak(c, x, y, k = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(k, k);
  const P = [[0, -175], [32, -100], [64, -50], [58, -8], [0, 4], [-58, -8], [-64, -50], [-32, -100]];
  sbShape(c, sbPoly(P, { n: 8 }), o.col || '#FBEBD0', { ang: -1.5, shade: ['rgba(150,90,30,.18)', .3] });
  for (const dx of [-36, -12, 12, 36]) sbDry(c, [[dx * .15, -160], [dx * .7, -80], [dx, -10]], 5, '#E3C79D', .9, 3, { n: 10 });
  c.restore();
}

// ---------- the owl (Maa Lakshmi's, a barn owl, front view) ----------
// o: flap (0..1 the wings out), tilt (head), turn (0..1 the head right round), coin (true: a gold coin in her feet)
const SB_OWL = { body: '#D8A35A', wing: '#B9853F', breast: '#F6EBDD', face: '#FBF5EC', beak: '#E9B9A0', feet: '#E9A14A', speck: '#8A6A44' };
function sbOwl(c, x, y, s, o = {}) {
  const P = { ...SB_OWL, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 1.8, 5), bl = sbBlink(o), fl = o.flap || 0;
  sbAt(c, x, y, s, () => {
    sbEll(c, -55, -10, 36, 18, P.feet, { tex: false }); sbEll(c, 55, -10, 36, 18, P.feet, { tex: false });
    c.translate(0, br * .4);
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * 170, -420); c.rotate(sd * (.18 + fl * .9)); sbEll(c, sd * 30, 120, 95, 210, P.wing, { rot: sd * .12, shade: ['rgba(60,30,10,.2)', 1.6] });
      for (let i = 0; i < 4; i++) sbDry(c, [[sd * 10, 120 + i * 50], [sd * 40, 140 + i * 50], [sd * 70, 120 + i * 50]], 9, P.breast, .55, 5, { n: 8 }); c.restore(); }
    sbEll(c, 0, -300, 230, 290, P.body, { pear: .12, shade: ['rgba(60,30,10,.2)', .6] });
    sbEll(c, 0, -250, 150, 205, P.breast, { pear: .1, ang: -1.4 });
    const sp = lcg(31); for (let i = 0; i < 16; i++) { const a = sp() * TAU, r = Math.sqrt(sp()) * .8; sbDot(c, Math.cos(a) * 130 * r, -250 + Math.sin(a) * 180 * r, 5, P.speck); }
    c.save(); c.translate(0, -580); c.rotate(o.tilt ?? Math.sin(t * TAU / 4) * .06); c.translate(0, 580);
    sbEll(c, 0, -590, 220, 180, P.body, { top: .1 });
    sbDry(c, [[-120, -720], [0, -755], [120, -720]], 14, P.wing, .5, 6, { n: 12 });
    // o.turn (0..1): the head turns right round (a yaw): the face slides off one side, the back of the head shows
    // (a dry crown of feathers), and the face comes round from the other side
    const th = (o.turn || 0) * TAU, cs = Math.cos(th), sn = Math.sin(th);
    if (cs < .15) for (let i = 0; i < 4; i++) sbDry(c, [[-110 + i * 8, -650 + i * 45], [0, -610 + i * 45], [110 - i * 8, -650 + i * 45]], 12, P.wing, .5 * (1 - Math.max(0, cs) / .15), 6, { n: 12 });
    if (cs > -.05) {
      c.save(); c.translate(sn * 120, 0); c.scale(Math.max(.04, cs), 1);
      sbShape(c, sbPoly([[0, -470], [-120, -515], [-185, -610], [-120, -690], [0, -655], [120, -690], [185, -610], [120, -515]], { n: 8 }), P.face, { tex: false });
      sbEye(c, -75, -598, 30, { blink: bl, happy: o.happy, look: o.look }); sbEye(c, 75, -598, 30, { blink: bl, happy: o.happy, look: o.look });
      sbCheek(c, -105, -540, 40); sbCheek(c, 105, -540, 40);
      sbShape(c, sbPoly([[-16, -585], [16, -585], [0, -530]], { n: 5, jit: .6 }), P.beak, { tex: false });
      c.restore();
    }
    c.restore();
    if (o.coin) sbCoin(c, 0, -22, 1);
  }, o);
}
// a gold coin, face on, radius 34 at k 1; o.spin (0..1 turns it edge-on)
function sbCoin(c, x, y, k = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(k * Math.max(.08, Math.abs(Math.cos((o.spin || 0) * Math.PI))), k);
  sbEll(c, 0, 0, 34, 34, '#F2B33D', { tex: false, wob: .03 }); sbEll(c, 0, 0, 24, 24, '#F8CF5F', { tex: false, wob: .03 });
  sbDry(c, [[-10, -12], [0, -16], [10, -12]], 4, '#FFF2B8', .9, 2, { n: 6 }); c.restore();
}

// ---------- the donkey (Maa Kalaratri's, side view facing left) ----------
// o: ears (-1 droop … 1 perk), tail (-1..1), bray (0..1: the head goes up and the mouth opens: hee-haw), walk (a phase)
const SB_DONKEY = { coat: '#9C8F86', belly: '#C9BFB6', muzzle: '#E0D6CC', mane: '#4E433D', hoof: '#4A3F3A', pink: '#EFA2A0' };
function sbDonkey(c, x, y, s, o = {}) {
  const P = { ...SB_DONKEY, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 2, 4), bl = sbBlink(o), bray = o.bray || 0;
  const ears = o.ears ?? Math.sin(t * 1.3) * .2, tail = o.tail ?? Math.sin(t * 2.6) * .6, wk = o.walk;
  sbAt(c, x, y, s, () => {
    const leg = (lx, ph, back) => { const sw = wk == null ? 0 : Math.sin(wk * TAU + ph) * 16;
      sbShape(c, sbPoly([[lx - 24, -300], [lx + 24, -300], [lx + 21 + sw * .4, -40], [lx - 21 + sw * .4, -40]], { n: 5, jit: 1 }), back ? mixCol(P.coat, '#000000', .12) : P.coat, { tex: false });
      sbEll(c, lx + sw * .45, -24, 28, 26, P.hoof, { tex: false }); };
    c.save(); c.translate(0, 40);
    leg(-90, Math.PI, true); leg(190, 0, true);
    sbDry(c, [[250, -440], [300 + tail * 20, -360], [320 + tail * 40, -270]], 10, P.coat, 1, 5, { n: 16 });
    sbEll(c, 326 + tail * 44, -262, 20, 42, P.mane, { rot: -.2 - tail * .2, tex: false });
    c.save(); c.translate(0, br * .3);
    sbEll(c, 50, -390, 255, 150, P.coat, { shade: ['rgba(40,25,20,.22)', 1.3] });
    sbEll(c, 40, -320, 190, 80, P.belly, { ang: -.1 });
    c.restore();
    c.restore(); c.translate(0, 40);
    leg(-140, 0, false); leg(140, Math.PI, false);
    // neck and head, pivoting at the shoulder
    c.save(); c.translate(-150, -470); c.rotate(-bray * .35 + Math.sin(t * TAU / 3.4) * .02); c.translate(150, 470);
    sbShape(c, sbPoly([[-200, -440], [-110, -470], [-170, -640], [-260, -690], [-300, -600]], { n: 8 }), P.coat, { tex: false });
    sbShape(c, sbPoly([[-120, -485], [-150, -500], [-205, -620], [-255, -705], [-228, -712], [-170, -628]], { n: 6 }), P.mane, { tex: false });
    for (let i = 0; i < 6; i++) { const f = i / 5, mx = lerp(-130, -240, f), my = lerp(-495, -705, f); sbDry(c, [[mx, my], [mx + 22, my - 18]], 10, P.mane, .8, 4, { n: 5 }); }
    for (const [ex, er, ph] of [[-215, .22, 0], [-260, -.18, .6]]) { c.save(); c.translate(ex, -720); c.rotate(er - ears * .25 * (ph ? 1 : -1) + Math.sin(t * 2 + ph) * .03);
      sbEll(c, 0, -80, 34, 100, P.coat, { tex: false }); sbEll(c, 0, -72, 16, 70, P.pink, { tex: false }); c.restore(); }
    // the head is one long, soft wedge from the poll to the muzzle; the muzzle is the same shape painted lighter
    const head = sbPoly([[-250, -742], [-196, -690], [-196, -610], [-262, -548], [-350, -518], [-418, -520], [-458, -560], [-452, -616], [-408, -656], [-332, -712]], { n: 8 });
    sbShape(c, head, P.coat, { shade: ['rgba(40,25,20,.15)', .8] });
    c.save(); sbPath(c, head); c.clip();
    sbShape(c, sbPoly([[-372, -690], [-330, -620], [-318, -540], [-360, -500], [-480, -500], [-480, -690]], { n: 8 }), P.muzzle, { ang: -.3 });
    c.restore();
    sbDot(c, -432, -585, 9, P.mane);
    if (bray > .2) sbMouth(c, -390, -540, 70 * (.6 + bray * .5), 'grin'); else sbMouth(c, -396, -538, 50, o.mouth || 'smile');
    sbEye(c, -288, -672, 17, { blink: bl, happy: o.happy || bray > .5, look: o.look });
    sbCheek(c, -240, -610, 44);
    c.restore();
  }, o);
}

// ---------- Bal Bappa (front view, standing) ----------
// o: arm ('abhaya': the right hand raised in blessing | 'wave' | 'down'), modak (true: one in his left hand), trunk (-1..1 swing), dance (a phase)
const SB_BAPPA = { skin: '#F3A7A0', dk: '#E28C86', trunk: '#F7B4AC', ear: '#EC9890', dhoti: '#F6C445', sash: '#E2483D', gold: '#F2B33D', gem: '#D8323C', tusk: '#FFF6E8' };
function sbBappa(c, x, y, s, o = {}) {
  const P = { ...SB_BAPPA, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 1.7, 5), bl = sbBlink(o), tr = o.trunk ?? Math.sin(t * 1.7) * .4;
  sbAt(c, x, y, s, () => {
    sbEll(c, -62, -55, 46, 62, P.skin, { tex: false }); sbEll(c, 62, -55, 46, 62, P.skin, { tex: false });
    sbEll(c, -70, -6, 52, 20, P.dk, { tex: false }); sbEll(c, 70, -6, 52, 20, P.dk, { tex: false });
    c.translate(0, br * .4);
    sbEll(c, 0, -150, 160, 95, P.dhoti, { pear: .15, shade: ['rgba(150,90,20,.2)', .6] });
    sbEll(c, 0, -290, 150, 140, P.skin, { pear: .1, shade: ['rgba(150,50,50,.16)', .5], spot: [-40, -330, 90, 'rgba(255,255,255,.18)'] });
    sbDot(c, 0, -250, 7, P.dk);
    sbDry(c, [[-120, -400], [-10, -320], [120, -205]], 30, P.sash, .95, 9, { n: 16, dry: .04, fade: .15 });
    // arms: the modak in his left hand (screen right), his right hand (screen left) raised in blessing
    const arm = o.arm || 'abhaya', wave = arm === 'wave' ? Math.sin(t * 9) * .35 : 0;
    sbEll(c, 150, -280, 42, 78, P.skin, { rot: -.5, tex: false, shade: ['rgba(150,50,50,.15)', 1.5] });
    if (o.modak !== false) sbModak(c, 192, -205, .62);
    sbEll(c, 188, -235, 34, 30, P.skin, { tex: false });
    if (arm === 'down') sbEll(c, -152, -280, 42, 78, P.skin, { rot: .5, tex: false });
    else { c.save(); c.translate(-130, -350); c.rotate(-wave); sbEll(c, -40, -30, 38, 78, P.skin, { rot: .55, tex: false }); sbEll(c, -74, -96, 40, 44, P.skin, { tex: false }); sbDot(c, -74, -96, 8, P.gem); c.restore(); }
    // head
    c.save(); c.translate(0, -520); c.rotate(Math.sin(t * TAU / 3) * .03 + (o.tilt || 0)); c.translate(0, 520);
    const ef = Math.sin(t * 3) * .05;
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * 120, -540); c.rotate(sd * (.12 + ef)); sbEll(c, sd * 50, 10, 115, 125, P.skin, { rot: sd * -.2 }); sbEll(c, sd * 60, 18, 72, 84, P.ear, { rot: sd * -.2, tex: false }); c.restore(); }
    sbEll(c, 0, -520, 140, 135, P.skin, { shade: ['rgba(150,50,50,.14)', .6] });
    sbShape(c, sbPoly([[-78, -620], [78, -620], [64, -700], [30, -680], [0, -735], [-30, -680], [-64, -700]], { n: 6 }), P.gold, { tex: false });
    sbDot(c, 0, -650, 12, P.gem);
    sbLine(c, [[0, -598], [0, -580]], 9, P.gem, { taper: .4 });
    sbEye(c, -55, -540, 16, { blink: bl, happy: o.happy, look: o.look }); sbEye(c, 55, -540, 16, { blink: bl, happy: o.happy, look: o.look });
    sbCheek(c, -88, -488, 40); sbCheek(c, 88, -488, 40);
    sbEll(c, -48, -455, 12, 30, P.tusk, { rot: .35, tex: false }); sbEll(c, 44, -462, 10, 12, P.tusk, { tex: false });
    sbMouth(c, -40, -428, 34, o.mouth || 'smile');
    const trunk = [[0, -505], [4 + tr * 8, -440], [26 + tr * 20, -385], [70 + tr * 24, -360], [98 + tr * 16, -385]];
    sbLine(c, trunk.map(([x, y]) => [x + 6, y + 6]), 56, 'rgba(150,50,50,.18)', { taper: .5, trem: .3 });
    sbLine(c, trunk, 54, P.trunk, { taper: .55, trem: .3 });
    for (let i = 0; i < 3; i++) sbLine(c, [[-16 + tr * 4, -462 + i * 20], [18 + tr * 4, -458 + i * 20]], 4, P.dk, { taper: .6, alpha: .7 });
    c.restore();
  }, o);
}

// ---------- a Devi (front view, a bell of a sari, picture-book style): Maa Lakshmi, Maa Kalaratri ----------
// The body is one bell shape (the reference's nun), the head small and round, four arms. o.pal picks her colours
// (SB_LAKSHMI, SB_KALARATRI), o.kind 'lakshmi' (closed, smiling eyes; lotuses in the raised hands; gold coins pour
// from the right hand while o.coins > 0; she stands on a pink lotus) or 'kalaratri' (wild hair, three eyes,
// a lightning garland; a sword raised in the back left hand, a thunderbolt in the back right; abhaya and varada).
// o.coinT: the coins' own clock (default o.t), so a loop can run them a whole number of times
const SB_LAKSHMI = { skin: '#EDB98C', dk: '#D99C6C', sari: '#D8323C', sari2: '#B8222D', border: '#F2B33D', hair: '#2A1E1E', gold: '#F2B33D', lotus: '#F29AB0', lotus2: '#FBD0DA', leaf: '#5E9C6A' };
const SB_KALARATRI = { skin: '#3A3760', dk: '#2C2A4C', sari: '#B8232E', sari2: '#8E1A24', border: '#F2B33D', hair: '#14121C', gold: '#F2B33D', bolt: '#FFE066', blade: '#D9E2EA' };
function sbLotus(c, x, y, k = 1, P = SB_LAKSHMI, o = {}) {
  c.save(); c.translate(x, y); c.scale(k, k);
  for (const [a, l] of [[-1.1, .8], [1.1, .8], [-.55, 1], [.55, 1], [0, 1.05]]) { c.save(); c.rotate(a * .9); sbShape(c, sbPoly([[0, 0], [-34 * l, -60 * l], [0, -120 * l], [34 * l, -60 * l]], { n: 6, jit: .8 }), a === 0 ? P.lotus2 : P.lotus, { tex: false }); c.restore(); }
  c.restore();
}
function sbDevi(c, x, y, s, o = {}) {
  const kind = o.kind || 'lakshmi', P = { ...(kind === 'kalaratri' ? SB_KALARATRI : SB_LAKSHMI), ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 2.2, 4), bl = sbBlink(o);
  sbAt(c, x, y, s, () => {
    if (kind === 'lakshmi') { for (const [lx, sc] of [[-170, 1], [170, 1], [-90, 1.15], [90, 1.15], [0, 1.25]]) sbEll(c, lx, -16, 80 * sc, 34 * sc, sc > 1.2 ? P.lotus2 : P.lotus, { tex: false }); sbEll(c, 0, 0, 230, 30, P.leaf, { tex: false, alpha: .8 }); }
    c.translate(0, br * .3);
    // bw: the body's width; Lakshmi is slimmer (o.slim, 0..1, default 1 for her, 0 for Kalaratri)
    const bw = 1 - .22 * (o.slim ?? (kind === 'lakshmi' ? 1 : 0)), dx = 125 * (1 - bw);
    // back arms, raised
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * 110 * bw, -470); c.rotate(sd * ((kind === 'kalaratri' ? .85 : .55) + Math.sin(t * 1.5 + sd) * .03)); if (kind === 'kalaratri') c.scale(1.15, 1.15);
      sbEll(c, 0, -80, 30, 95, P.skin, { tex: false }); sbEll(c, 0, -172, 34, 34, P.skin, { tex: false });
      if (kind === 'lakshmi') sbLotus(c, 0, -190, .75, P);
      else if (sd < 0) { c.save(); c.translate(0, -175); c.rotate(-.35); sbShape(c, sbPoly([[-10, 10], [10, 10], [22, -150], [60, -250], [6, -190], [-12, -40]], { n: 6 }), P.blade, { tex: false }); sbEll(c, 0, 20, 40, 12, P.gold, { tex: false }); c.restore(); }
      else { c.save(); c.translate(0, -190); sbBolt(c, 0, 0, 1, P.bolt); c.restore(); }
      c.restore(); }
    // the bell of the sari
    const bell = sbPoly([[-250, -30], [-120, -6], [120, -6], [250, -30], [170, -330], [100, -470], [-100, -470], [-170, -330]].map(([x, y]) => [x * bw, y]), { n: 8 });
    sbShape(c, bell, P.sari, { shade: ['rgba(40,0,10,.25)', .4], ang: -1.3 });
    c.save(); sbPath(c, bell); c.clip(); c.scale(bw, 1);
    sbDry(c, [[-260, -48], [0, -14], [260, -48]], 34, P.border, .95, 10, { n: 20, dry: .03, fade: .1 });
    sbShape(c, sbPoly([[-100, -470], [10, -470], [210, -120], [150, -100]], { n: 6 }), P.sari2, { tex: false, alpha: .9 });
    sbDry(c, [[10, -470], [120, -290], [215, -120]], 16, P.border, .9, 6, { n: 16, dry: .03, fade: .1 });
    for (let i = 0; i < 7; i++) sbDot(c, -150 + i * 45 + (i % 2) * 10, -220 + (i % 3) * 50, 6, P.border);
    c.restore();
    // front arms
    c.save(); c.translate(-125 + dx, -400); c.rotate(.35); sbEll(c, -10, 70, 30, 90, P.skin, { tex: false }); sbEll(c, -20, 160, 34, 34, P.skin, { tex: false }); c.restore();
    c.save(); c.translate(125 - dx, -400); c.rotate(-.9); sbEll(c, 10, 70, 30, 90, P.skin, { tex: false }); c.restore();
    sbEll(c, 210 - dx, -440, 36, 40, P.skin, { tex: false });   // abhaya: the right palm up and out
    sbDot(c, 210 - dx, -440, 9, kind === 'lakshmi' ? P.sari : P.gold);
    if (kind === 'lakshmi' && (o.coins ?? 1) > 0) { const ct = o.coinT ?? t; for (let i = 0; i < 7; i++) { const f = frac(ct * .9 + i / 7); sbCoin(c, -150 + dx + Math.sin(i * 2.3) * 16, -290 + f * 260, .55, { spin: f * 2 + i * .3, ...(f > .92 ? {} : {}) }); } }
    // neck, jewellery, head
    sbEll(c, 0, -480, 40, 34, P.dk, { tex: false });
    if (kind === 'kalaratri') sbBoltGarland(c, 0, -455, P.bolt, t); else sbDry(c, [[-80, -462], [0, -410], [80, -462]], 14, P.gold, .95, 5, { n: 14 });
    c.save(); c.translate(0, -580); c.rotate(Math.sin(t * TAU / 4) * .025 + (o.tilt || 0)); c.translate(0, 580);
    if (kind === 'kalaratri') { // wild, loose hair: a lobed mane round her head to the shoulders, and locks flying out
      const hp = []; for (let i = 0; i <= 60; i++) { const th = (200 - i / 60 * 220) * Math.PI / 180, R = 1 + .1 * Math.sin(th * 9 + t * 2.4) + .05 * Math.sin(th * 15 - t * 3);
        hp.push([Math.cos(th) * 215 * R, -585 - Math.sin(th) * 215 * R]); }
      hp.push([150, -430], [80, -470], [-80, -470], [-150, -430]);
      sbShape(c, hp, P.hair, { tex: false });
      for (const [deg, len, sd] of [[188, 1, -1], [160, .8, -1], [128, .65, -1], [52, .65, 1], [20, .8, 1], [-8, 1, 1]]) {   // locks like dark flames
        const th = deg * Math.PI / 180, wv = Math.sin(t * 2.6 + deg) * 10, bx = Math.cos(th) * 195, by = -585 - Math.sin(th) * 195, ox = Math.cos(th) * 120 * len, oy = -Math.sin(th) * 120 * len + 50 * len;
        sbShape(c, sbPoly([[bx - 40 * Math.sin(th), by - 40 * Math.cos(th)], [bx + ox * .6 + wv, by + oy * .5 - 10], [bx + ox + wv * 2 + sd * 10, by + oy + 20], [bx + ox * .5 - wv, by + oy * .6 + 30], [bx + 40 * Math.sin(th), by + 40 * Math.cos(th)]], { n: 6 }), P.hair, { tex: false }); }
    } else { sbEll(c, 0, -655, 95, 70, P.hair, { tex: false }); sbEll(c, 0, -590, 128, 125, P.hair, { tex: false }); }
    sbEll(c, 0, -575, 108, 112, P.skin, { shade: ['rgba(60,20,10,.12)', .6] });
    if (kind === 'lakshmi') { sbShape(c, sbPoly([[-82, -650], [82, -650], [60, -720], [28, -700], [0, -770], [-28, -700], [-60, -720]], { n: 6 }), P.gold, { tex: false }); sbDot(c, 0, -688, 11, P.sari); }
    else { sbShape(c, sbPoly([[-74, -655], [74, -655], [58, -712], [26, -695], [0, -748], [-26, -695], [-58, -712]], { n: 6 }), P.gold, { tex: false }); sbDot(c, 0, -688, 9, P.sari); }
    for (const sd of [-1, 1]) sbDot(c, sd * 112, -545, 13, P.gold);
    if (kind === 'kalaratri') {
      for (const sd of [-1, 1]) sbEye(c, sd * 44, -585, 15, { blink: bl, white: true, look: o.look, happy: o.happy });
      c.save(); c.translate(0, -630); c.rotate(Math.PI / 2); sbEye(c, 0, 0, 10, { blink: bl, white: true, happy: o.happy }); c.restore();
      sbCheek(c, -62, -535, 34, '#E2577A', .6); sbCheek(c, 62, -535, 34, '#E2577A', .6);
      sbMouth(c, 0, -520, 46, o.mouth || 'smile', { col: '#E25A6A' });
    } else {
      for (const sd of [-1, 1]) sbEye(c, sd * 42, -580, 14, { happy: false, blink: 1 });
      sbDot(c, 0, -625, 9, P.sari);
      sbCheek(c, -62, -535, 34); sbCheek(c, 62, -535, 34);
      sbMouth(c, 0, -520, 40, o.mouth || 'smile', { col: '#B23A3A' });
    }
    c.restore();
  }, o);
}
// a thunderbolt (vajra) as a zigzag of light, ~150 tall at k 1
function sbBolt(c, x, y, k = 1, col = '#FFE066') {
  c.save(); c.translate(x, y); c.scale(k, k);
  sbShape(c, sbPoly([[-6, 0], [30, -70], [6, -70], [34, -150], [-30, -60], [-6, -60], [-34, 0]], { n: 3, jit: .6 }), col, { tex: false }); c.restore();
}
// Kalaratri's garland that shines like lightning
function sbBoltGarland(c, x, y, col, t) {
  const P = []; for (let i = 0; i <= 10; i++) { const f = i / 10, a = Math.PI * f; P.push([x - Math.cos(a) * 95, y - 10 + Math.sin(a) * 60 + (i % 2 ? -12 : 12)]); }
  c.save(); c.globalAlpha *= .85 + .15 * Math.sin(t * 9); sbLine(c, P, 9, col, { taper: .2, trem: 1.5 }); c.restore();
}

// ---------- a clay diya ----------
// sbDiya(c, x, y, k, o): a clay lamp standing on (x, y), about 120 wide at k 1. o.lit (0..1: the flame grows from a
// spark), o.fl (-1..1: the flicker, from the caller's clock), o.glow (the warm halo, 1), o.col (the clay)
function sbDiya(c, x, y, k = 1, o = {}) {
  const lit = clamp(o.lit ?? 1), fl = o.fl || 0, col = o.col || '#C8673A';
  c.save(); c.translate(x, y); c.scale(k, k);
  if (lit > 0 && (o.glow ?? 1) > 0) { const R = 190 * (.85 + .1 * fl) * (.4 + .6 * lit), g = c.createRadialGradient(0, -70, 0, 0, -70, R);
    g.addColorStop(0, rgba('#FFC860', .55 * lit * (o.glow ?? 1))); g.addColorStop(.45, rgba('#FF9A3C', .2 * lit * (o.glow ?? 1))); g.addColorStop(1, rgba('#FF9A3C', 0));
    c.fillStyle = g; c.fillRect(-R, -70 - R, R * 2, R * 2); }
  sbShape(c, sbPoly([[-62, -38], [-30, -6], [0, 0], [30, -6], [62, -38], [78, -46], [40, -48], [-40, -48]], { n: 6, jit: .6 }), col, { tex: false, shade: ['rgba(60,20,0,.3)', 1.5] });
  sbEll(c, -4, -44, 52, 9, mixCol(col, '#3A1608', .45), { tex: false });
  for (const dx of [-30, -10, 10, 30]) sbDot(c, dx, -22, 4, '#F2C04A');
  if (lit > 0) {
    const h = (62 + 8 * fl) * lit, w = 17 * (.5 + .5 * lit), sw = fl * 5, bx = 52;
    sbShape(c, sbPoly([[bx - w, -50], [bx - w * .8 + sw * .3, -50 - h * .45], [bx + sw, -50 - h], [bx + w * .8 + sw * .3, -50 - h * .45], [bx + w, -50]], { n: 5, jit: .5 }), '#FFAA33', { tex: false });
    sbShape(c, sbPoly([[bx - w * .5, -50], [bx + sw * .5, -50 - h * .6], [bx + w * .5, -50]], { n: 5, jit: .4 }), '#FFF3C4', { tex: false });
  }
  c.restore();
}

// ---------- Bal Hanuman (front view, golden fur, a red langot) ----------
// o.pose: 'fly' (one arm reaching up, a knee tucked, the other leg trailing; rotate him with o.rot so he flies up and
// to the right) or 'stand'. o.reach (0..1: the reaching arm's stretch), o.mouth ('smile' | 'grin' | 'o' | 'wide': a
// big open "aaa" for a bite), o.tail (-1..1 a curl), o.kick (-1..1, the trailing leg)
const SB_HANUMAN = { fur: '#E79E3A', dk: '#C98226', face: '#F7D6AE', muzzle: '#FBE6CB', langot: '#D8323C', gold: '#F2B33D', tilak: '#E2483D', ear: '#F2BE94' };
function sbHanuman(c, x, y, s, o = {}) {
  const P = { ...SB_HANUMAN, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 1.5, 5), bl = sbBlink(o), fly = (o.pose || 'fly') === 'fly';
  const tl = o.tail ?? Math.sin(t * 1.9) * .5, rc = o.reach ?? 1, kick = o.kick ?? Math.sin(t * 3.1) * .5;
  sbAt(c, x, y, s, () => {
    // the tail, behind: out from the hip, a long sweep and a curl at the tip
    const tail = [[-60, -200], [-200, -170 - tl * 20], [-310, -240 - tl * 40], [-330, -360 - tl * 50], [-270, -420 - tl * 40], [-215, -380 - tl * 30], [-238, -330 - tl * 25]];
    sbLine(c, tail, 34, P.fur, { taper: .35, trem: .4 }); sbDry(c, tail.slice(0, 4), 14, P.dk, .35, 5, { n: 18 });
    // legs
    if (fly) {
      sbEll(c, 70, -150, 50, 78, P.fur, { rot: -1.1, tex: false }); sbEll(c, 140, -110, 46, 66, P.fur, { rot: .4, tex: false }); sbEll(c, 160, -55, 44, 26, P.face, { rot: .3, tex: false });
      c.save(); c.translate(-50, -170); c.rotate(.35 + kick * .1); sbEll(c, 0, 75, 46, 95, P.fur, { tex: false }); sbEll(c, -6, 170, 46, 27, P.face, { rot: -.2, tex: false }); sbDry(c, [[-30, 145], [0, 150], [30, 145]], 9, P.gold, .9, 3, { n: 6 }); c.restore();
    } else for (const sd of [-1, 1]) { sbEll(c, sd * 55, -70, 46, 80, P.fur, { tex: false }); sbEll(c, sd * 64, -10, 50, 22, P.face, { tex: false }); }
    c.translate(0, br * .4);
    // body, belly, langot
    sbEll(c, 0, -290, 118, 140, P.fur, { pear: .12, shade: ['rgba(120,60,10,.2)', .5] });
    sbEll(c, 0, -285, 76, 98, P.face, { pear: .1, tex: false });
    sbShape(c, sbPoly([[-112, -205], [112, -205], [96, -150], [30, -130], [0, -110], [-30, -130], [-96, -150]], { n: 6 }), P.langot, { tex: false, shade: ['rgba(60,0,0,.2)', 1.4] });
    sbDry(c, [[-112, -205], [0, -196], [112, -205]], 16, P.gold, .95, 5, { n: 14, dry: .02 });
    // arms: the left (screen left) out and back, the right (screen right) reaching up
    c.save(); c.translate(-100, -390); c.rotate(fly ? .9 : .3); sbEll(c, 0, 70, 36, 80, P.fur, { tex: false }); sbEll(c, 0, 150, 34, 32, P.face, { tex: false }); sbDry(c, [[-30, 118], [30, 118]], 10, P.gold, .9, 3, { n: 6 }); c.restore();
    const ra = fly ? -2.72 + (1 - rc) * .9 : -.3, rk = fly ? .95 + .8 * rc : 1;
    c.save(); c.translate(100, -390); c.rotate(ra); c.scale(1, rk); sbEll(c, 0, 75, 36, 85, P.fur, { tex: false }); c.restore();
    { const a = ra, L = 165 * rk, hx = 100 - Math.sin(a) * L, hy = -390 + Math.cos(a) * L;
      sbEll(c, hx, hy, 36, 34, P.face, { tex: false }); sbDry(c, [[hx - 28, hy + 26], [hx + 28, hy + 26]], 10, P.gold, .9, 3, { n: 6 }); }
    sbDry(c, [[-80, -410], [0, -370], [80, -410]], 12, P.gold, .95, 5, { n: 14 }); sbDot(c, 0, -368, 11, P.langot);
    // head
    c.save(); c.translate(0, -520); c.rotate(Math.sin(t * TAU / 3.4) * .04 + (o.tilt || 0)); c.translate(0, 520);
    for (const sd of [-1, 1]) { sbEll(c, sd * 148, -560, 56, 58, P.fur, { tex: false }); sbEll(c, sd * 150, -556, 34, 36, P.ear, { tex: false }); }
    sbEll(c, 0, -570, 155, 145, P.fur, { shade: ['rgba(120,60,10,.16)', .6] });
    // the curly tuft
    sbShape(c, sbPoly([[-30, -705], [10, -770], [70, -790], [92, -748], [60, -730], [30, -742], [24, -706]], { n: 6 }), P.fur, { tex: false });
    sbDry(c, [[-40, -712], [-60, -735], [-48, -760]], 18, P.fur, 1, 6, { n: 8 });
    // the face: a mask round the eyes, the puffed muzzle (Hanuman: "the one with the jaw")
    sbEll(c, -50, -592, 68, 62, P.face, { tex: false }); sbEll(c, 50, -592, 68, 62, P.face, { tex: false });
    sbEll(c, 0, -492, 102, 72, P.muzzle, { tex: false, shade: ['rgba(150,80,20,.12)', 1.5] });
    sbLine(c, [[0, -690], [0, -650]], 13, P.tilak, { taper: .3 });
    sbEye(c, -48, -596, 18, { blink: bl, happy: o.happy, look: o.look }); sbEye(c, 48, -596, 18, { blink: bl, happy: o.happy, look: o.look });
    sbCheek(c, -98, -500, 42); sbCheek(c, 98, -500, 42);
    sbDot(c, -10, -530, 5, SB.ink); sbDot(c, 10, -530, 5, SB.ink);
    const m = o.mouth || 'smile';
    if (m === 'wide') { const k = o.open ?? 1; sbEll(c, 0, -482, 44 * (.6 + .4 * k), 36 * k + 6, SB.ink, { tex: false }); if (k > .3) sbEll(c, 0, -466 + 6 * k, 26 * k, 12 * k, '#E86A78', { tex: false }); }
    else sbMouth(c, 0, -488, 58, m);
    c.restore();
  }, o);
}

// ---------- Shiva in dhyana (front view, seated cross-legged) and Vasuki ----------
// Blue skin, closed eyes, the third eye and the tripundra, a jata bun with the crescent moon and the Ganga springing
// from it, rudraksha, a tiger skin, the hands in jnana mudra on the knees, and Vasuki round his neck. o.snake:
// { pop (0..1: his head rises over the right shoulder), tongue (0..1: the forked tongue flicks out, big), look, sway },
// o.ganga (a phase: the drops run down the stream), o.trishul (true: the trishul and damaru planted beside him)
const SB_SHIVA = { skin: '#86A9DC', dk: '#6C8FC8', jata: '#2C2440', moon: '#FFF6D8', ganga: '#9FDCF2', tiger: '#E8A23C', stripe: '#6A3A1A', ash: '#FFFFFF', third: '#E2483D', bead: '#7A3A22', snake: '#62B072', belly: '#CDE7A6', gold: '#F2B33D' };
function sbShiva(c, x, y, s, o = {}) {
  const P = { ...SB_SHIVA, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 2.6, 6), sn = { pop: 1, tongue: 0, ...(o.snake || {}) };
  sbAt(c, x, y, s, () => {
    if (o.trishul !== false) {
      sbLine(c, [[300, 0], [300, -930]], 16, '#8A6A4A', { taper: .1, trem: .4 });
      sbShape(c, sbPoly([[270, -925], [330, -925], [312, -950], [300, -1060], [288, -950]], { n: 4, jit: .6 }), '#D8E0E8', { tex: false });
      for (const sd of [-1, 1]) sbShape(c, sbPoly([[300, -925], [300 + sd * 70, -940], [300 + sd * 78, -1030], [300 + sd * 50, -960]], { n: 4, jit: .6 }), '#D8E0E8', { tex: false });
      // the damaru tied below the prongs, its ribbon fluttering
      c.save(); c.translate(300, -870); sbShape(c, sbPoly([[-40, -32], [40, -32], [8, 0], [40, 32], [-40, 32], [-8, 0]], { n: 4, jit: .6 }), '#C8673A', { tex: false });
      sbEll(c, 0, -32, 40, 9, '#F2C04A', { tex: false }); sbEll(c, 0, 32, 40, 9, '#F2C04A', { tex: false });
      sbDry(c, [[8, 0], [60, 20 + Math.sin(t * 2) * 8], [100, 10 + Math.sin(t * 2 + 1) * 14]], 12, '#E2483D', .9, 4, { n: 10 }); c.restore();
    }
    // the crossed legs (two thighs meeting in the lap, a sole showing on each), the tiger skin over the lap
    for (const sd of [-1, 1]) sbEll(c, sd * 120, -82, 150, 66, P.skin, { rot: sd * .1, shade: ['rgba(30,40,90,.2)', 1.5] });
    for (const sd of [-1, 1]) { sbEll(c, sd * 70, -70, 56, 30, P.dk, { rot: sd * -.25, tex: false }); sbEll(c, sd * 72, -74, 40, 18, '#A9C2E8', { rot: sd * -.25, tex: false }); }
    c.translate(0, br * .3);
    const skin = sbPoly([[-175, -175], [175, -175], [150, -115], [60, -95], [0, -100], [-60, -95], [-150, -115]], { n: 6 });
    sbShape(c, skin, P.tiger, { tex: false, shade: ['rgba(90,40,0,.2)', 1.5] });
    c.save(); sbPath(c, skin); c.clip(); for (const sx of [-130, -70, -10, 50, 110]) sbDry(c, [[sx, -180], [sx + 18, -140], [sx + 4, -100]], 10, P.stripe, .8, 4, { n: 8 }); c.restore();
    // torso and arms down to the knees
    sbEll(c, 0, -330, 140, 170, P.skin, { pear: .14, shade: ['rgba(30,40,90,.2)', .5], spot: [-50, -380, 90, 'rgba(255,255,255,.14)'] });
    // the arms: upper arms out to the elbows, forearms down to the hands resting on the knees in jnana mudra
    for (const sd of [-1, 1]) {
      sbLimb(c, [sd * 118, -440], [sd * 196, -270], 40, P.skin); sbLimb(c, [sd * 196, -270], [sd * 222, -150], 36, P.skin);
      sbDot(c, sd * 214, -186, 9, P.bead); sbDot(c, sd * 226, -184, 9, P.bead);
      const hx = sd * 226, hy = -128; sbEll(c, hx, hy, 40, 32, P.skin, { tex: false }); sbEll(c, hx + sd * 26, hy - 18, 14, 14, P.skin, { tex: false });
      sbLine(c, [[hx + sd * 16, hy - 26], [hx + sd * 32, hy - 30], [hx + sd * 38, hy - 16]], 5, P.dk, { taper: .3 });
    }
    for (let i = 0; i <= 12; i++) { const f = i / 12, a = Math.PI * f; sbDot(c, -78 * Math.cos(a), -470 + Math.sin(a) * 130, 11, P.bead); }
    // the head: hair behind, the jata bun, the moon, the Ganga
    c.save(); c.translate(0, -560); c.rotate(Math.sin(t * TAU / 5) * .015); c.translate(0, 560);
    sbShape(c, sbPoly([[-150, -620], [-110, -720], [110, -720], [150, -620], [165, -470], [110, -440], [-110, -440], [-165, -470]], { n: 6 }), P.jata, { tex: false });
    sbEll(c, 0, -505, 42, 40, P.dk, { tex: false });
    sbEll(c, 0, -790, 78, 100, P.jata, { tex: false }); sbEll(c, 0, -720, 112, 40, P.jata, { tex: false });
    for (const [a, b] of [[-50, -840], [10, -870], [52, -800]]) sbDry(c, [[a, b], [a + 18, b + 40], [a + 6, b + 80]], 10, '#4A3F66', .7, 4, { n: 8 });
    sbEll(c, -48, -812, 48, 48, P.moon, { tex: false }); sbEll(c, -26, -826, 42, 42, P.jata, { tex: false });   // the crescent
    const gp = o.ganga ?? t * .8;
    sbLine(c, [[20, -880], [70, -925], [130, -905], [160, -840]], 16, P.ganga, { taper: .5, trem: .5, alpha: .95 });
    for (let i = 0; i < 4; i++) { const f = frac(gp + i / 4); sbDot(c, 166 + f * 14, -830 + f * 110, 8 * (1 - f * .5), P.ganga); }
    sbEll(c, 0, -590, 118, 122, P.skin, { shade: ['rgba(30,40,90,.14)', .6] });
    for (const sd of [-1, 1]) sbDot(c, sd * 118, -555, 14, P.gold);
    for (const yy of [-668, -650, -632]) sbLine(c, [[-62, yy], [62, yy]], 7, P.ash, { taper: .5, alpha: .9 });
    sbEll(c, 0, -650, 9, 20, P.third, { tex: false }); sbLine(c, [[0, -664], [0, -636]], 3, SB.ink, { taper: .3 });
    for (const sd of [-1, 1]) sbEye(c, sd * 44, -588, 16, { blink: 1 });
    sbCheek(c, -70, -540, 38); sbCheek(c, 70, -540, 38);
    sbMouth(c, 0, -528, 44, o.mouth || 'smile', { col: '#3A2A4A' });
    c.restore();
    // Vasuki: coiled round the neck, rising over the right shoulder (screen right), out clear of the hair
    const pop = clamp(sn.pop), sw = sn.sway ?? Math.sin(t * 1.3) * .5;
    const hx = 200 + sw * 18 + pop * 30, hy = -470 - pop * 300 + Math.abs(sw) * 8;
    sbLine(c, [[-120, -470], [-60, -438], [0, -430], [70, -442], [130, -470], [150, -480]], 38, P.snake, { taper: .1, trem: .3 });
    sbLine(c, [[-140, -462], [-170, -480], [-160, -510]], 28, P.snake, { taper: .8, trem: .3 });
    if (pop > .02) {
      const neck = [[140, -476], [200, -500 - pop * 30], [hx + 30, hy + 140], [hx + 6, hy + 50]];
      sbLine(c, neck, 38, P.snake, { taper: .05, trem: .3 });
      sbLine(c, neck.slice(0, 3).map(([a, b]) => [a - 8, b]), 14, P.belly, { taper: .4, trem: .3, alpha: .8 });
      c.save(); c.translate(hx, hy); c.rotate(sw * .12);
      sbEll(c, 0, 0, 78, 62, P.snake, { tex: false, shade: ['rgba(20,60,30,.2)', 1.4] }); sbEll(c, 0, 20, 50, 32, P.belly, { tex: false });
      for (const sd of [-1, 1]) sbEye(c, sd * 32, -14, 13, { blink: sn.blink ?? 0, look: sn.look, happy: sn.happy });
      sbCheek(c, -50, 14, 22); sbCheek(c, 50, 14, 22);
      const tg = clamp(sn.tongue);
      if (tg > .02) { const L = 190 * tg, b = 34; sbLine(c, [[0, b], [0, b + L * .72]], 15, '#E2483D', { taper: .05 }); for (const sd of [-1, 1]) sbLine(c, [[0, b + L * .7], [sd * 34 * tg, b + L]], 13, '#E2483D', { taper: .35 }); sbEll(c, 0, b - 4, 20, 10, SB.ink, { tex: false }); }
      else sbMouth(c, 0, 26, 34, 'smile', { col: '#2A4A2A' });
      c.restore();
    }
  }, o);
}

// ---------- Bal Krishna (front view, standing) ----------
// Blue skin, a yellow pitambar, a peacock feather in his hair, a flute tucked into his sash, a vaijayanti garland.
// o.arm: 'hug' (his left arm, screen right, out round a friend's neck) | 'hip' | 'none' (the scene draws it, over a friend); o.feather (-1..1 sway), o.happy
const SB_KRISHNA = { skin: '#6F95D8', dk: '#5A7CC0', hair: '#1E1A2C', dhoti: '#F6C445', dk2: '#E0A72C', sash: '#E2483D', gold: '#F2B33D', flute: '#9A6A3A', feather: '#2E9C7A', eye: '#2B5FBF', mala: '#F7F0E0' };
function sbKrishna(c, x, y, s, o = {}) {
  const P = { ...SB_KRISHNA, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 1.8, 5), bl = sbBlink(o), fs = o.feather ?? Math.sin(t * 1.6) * .5;
  sbAt(c, x, y, s, () => {
    for (const sd of [-1, 1]) { sbEll(c, sd * 52, -75, 40, 70, P.skin, { tex: false }); sbEll(c, sd * 58, -12, 46, 20, P.dk, { tex: false }); sbDry(c, [[sd * 52 - 30, -38], [sd * 52 + 30, -38]], 9, P.gold, .9, 3, { n: 6 }); }
    c.translate(0, br * .4);
    const dh = sbPoly([[-135, -110], [-80, -96], [0, -104], [80, -96], [135, -110], [110, -260], [-110, -260]], { n: 6 });
    sbShape(c, dh, P.dhoti, { shade: ['rgba(150,90,0,.2)', .4] });
    c.save(); sbPath(c, dh); c.clip(); sbDry(c, [[-140, -118], [0, -110], [140, -118]], 22, P.dk2, .9, 7, { n: 16, dry: .03 }); sbDry(c, [[0, -255], [10, -180], [0, -105]], 10, P.dk2, .5, 4, { n: 10 }); c.restore();
    sbEll(c, 0, -350, 112, 118, P.skin, { pear: .1, shade: ['rgba(20,30,90,.18)', .5] });
    sbDry(c, [[-118, -262], [0, -250], [118, -262]], 24, P.sash, .95, 8, { n: 14, dry: .03, fade: .1 });
    // the flute, tucked into the sash
    sbLine(c, [[-120, -300], [140, -232]], 15, P.flute, { taper: .05, trem: .2 }); for (const f of [.62, .7, .78, .86]) sbDot(c, lerp(-120, 140, f), lerp(-300, -232, f) - 1, 3.5, '#3A2A1A');
    sbDry(c, [[-112, -298], [-130, -260], [-120, -228]], 9, P.sash, .9, 3, { n: 8 });
    // the vaijayanti garland
    for (let i = 0; i <= 14; i++) { const f = i / 14, a = Math.PI * f; sbDot(c, -84 * Math.cos(a), -440 + Math.sin(a) * 150, 11, i % 3 === 1 ? P.sash : i % 3 === 2 ? P.gold : P.mala); }
    // arms
    c.save(); c.translate(-100, -420); c.rotate(.28); sbEll(c, 0, 80, 34, 88, P.skin, { tex: false }); sbEll(c, 0, 168, 32, 30, P.skin, { tex: false }); sbDry(c, [[-28, 140], [28, 140]], 9, P.gold, .9, 3, { n: 6 }); c.restore();
    if (o.arm === 'none') {}   // the scene draws that arm itself (over a friend)
    else if ((o.arm || 'hug') === 'hug') { c.save(); c.translate(100, -420); c.rotate(-1.75); sbEll(c, 0, 92, 34, 100, P.skin, { tex: false }); sbDry(c, [[-28, 150], [28, 150]], 9, P.gold, .9, 3, { n: 6 }); sbEll(c, 0, 196, 32, 32, P.skin, { tex: false }); c.restore(); }
    else { c.save(); c.translate(100, -420); c.rotate(-.5); sbEll(c, 0, 70, 34, 80, P.skin, { tex: false }); c.restore(); }
    // head
    c.save(); c.translate(0, -500); c.rotate(Math.sin(t * TAU / 3.6) * .03 + (o.tilt || 0)); c.translate(0, 500);
    sbEll(c, 0, -548, 132, 128, P.hair, { tex: false });
    sbEll(c, 0, -530, 118, 118, P.skin, { shade: ['rgba(20,30,90,.14)', .6] });
    sbShape(c, sbPoly([[-124, -560], [-100, -640], [-30, -672], [40, -668], [104, -632], [124, -560], [80, -620], [10, -628], [-60, -612]], { n: 6 }), P.hair, { tex: false });
    // the crown band and the peacock feather, swaying
    sbDry(c, [[-112, -612], [0, -650], [112, -612]], 18, P.gold, .95, 6, { n: 14, dry: .02 });
    c.save(); c.translate(40, -650); c.rotate(.28 + fs * .1);
    sbShape(c, sbPoly([[-10, 0], [-34, -90], [-26, -170], [0, -210], [26, -170], [34, -90], [10, 0]], { n: 6 }), P.feather, { tex: false });
    for (let i = 0; i < 6; i++) sbDry(c, [[0, -20 - i * 30], [(i % 2 ? 1 : -1) * 36, -40 - i * 30]], 6, '#7FD0A8', .7, 3, { n: 5 });
    sbEll(c, 0, -160, 26, 32, P.gold, { tex: false }); sbEll(c, 0, -158, 18, 22, '#2FB6B0', { tex: false }); sbEll(c, 0, -155, 10, 13, P.eye, { tex: false });
    c.restore();
    for (const sd of [-1, 1]) { sbDot(c, sd * 120, -500, 13, P.gold); sbDot(c, sd * 120, -478, 8, P.sash); }
    sbLine(c, [[-16, -625], [0, -585], [16, -625]], 6, '#FFFFFF', { taper: .3 }); sbLine(c, [[0, -620], [0, -592]], 5, P.sash, { taper: .3 });
    sbEye(c, -44, -540, 17, { blink: bl, happy: o.happy, look: o.look }); sbEye(c, 44, -540, 17, { blink: bl, happy: o.happy, look: o.look });
    sbCheek(c, -76, -486, 38); sbCheek(c, 76, -486, 38);
    sbMouth(c, 0, -472, o.mouth === 'grin' ? 58 : 44, o.mouth || 'smile');
    c.restore();
  }, o);
}

// ---------- a calf (side view facing left), soft and round, and Nandi the bull ----------
// o: lick (0..1: the tongue out and up), head (-1..1: the head lifts), tail (-1..1), ear (a flick)
const SB_CALF = { coat: '#F4EBDD', patch: '#B9835A', muzzle: '#F2B8A8', hoof: '#6A4A3A', nub: '#E8D8B8', cord: '#D8323C', bell: '#F2B33D' };
function sbCalf(c, x, y, s, o = {}) {
  const P = { ...SB_CALF, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 1.6, 4), bl = sbBlink(o), tail = o.tail ?? Math.sin(t * 2.4) * .7, hd = o.head || 0;
  sbAt(c, x, y, s, () => {
    const leg = (lx, back) => { sbShape(c, sbPoly([[lx - 20, -230], [lx + 20, -230], [lx + 17, -36], [lx - 17, -36]], { n: 5, jit: 1 }), back ? mixCol(P.coat, '#8A7A6A', .2) : P.coat, { tex: false }); sbEll(c, lx, -22, 22, 22, P.hoof, { tex: false }); };
    leg(-60, true); leg(150, true);
    sbDry(c, [[210, -330], [250 + tail * 16, -270], [262 + tail * 30, -190]], 8, P.coat, 1, 4, { n: 14 }); sbEll(c, 266 + tail * 32, -184, 14, 26, P.patch, { rot: -.2 - tail * .2, tex: false });
    c.save(); c.translate(0, br * .3);
    sbEll(c, 50, -300, 190, 112, P.coat, { shade: ['rgba(90,60,30,.2)', 1.3] });
    sbEll(c, 120, -340, 70, 50, P.patch, { rot: .3, tex: false }); sbEll(c, -10, -260, 44, 34, P.patch, { rot: -.2, tex: false, alpha: .9 });
    c.restore();
    leg(-100, false); leg(110, false);
    // the head on a short neck, pivoting at the shoulder
    c.save(); c.translate(-90, -330); c.rotate(-hd * .3 + Math.sin(t * TAU / 3.3) * .02); c.translate(90, 330);
    sbShape(c, sbPoly([[-150, -260], [-60, -290], [-90, -400], [-170, -440], [-210, -360]], { n: 6 }), P.coat, { tex: false });
    sbDry(c, [[-150, -262], [-120, -300], [-60, -292]], 14, P.cord, .95, 5, { n: 10 }); sbEll(c, -128, -258, 20, 22, P.bell, { tex: false }); sbDot(c, -128, -244, 5, '#8A5A1A');
    const ef = o.ear ?? Math.sin(t * 2.2) * .2;
    for (const [ex, ph] of [[-150, 0], [-230, 1]]) { c.save(); c.translate(ex, -462); c.rotate((ph ? -.5 : .5) + ef * (ph ? -.3 : .3)); sbEll(c, ph ? -46 : 46, 0, 56, 22, P.coat, { tex: false }); sbEll(c, ph ? -44 : 44, 0, 34, 12, P.muzzle, { tex: false }); c.restore(); }
    sbEll(c, -205, -450, 14, 10, P.nub, { tex: false }); sbEll(c, -170, -462, 14, 10, P.nub, { tex: false });
    sbEll(c, -200, -400, 98, 86, P.coat, { rot: -.15, shade: ['rgba(90,60,30,.12)', .8] });
    sbEll(c, -170, -440, 42, 30, P.patch, { rot: .4, tex: false });
    sbEll(c, -262, -360, 60, 48, P.muzzle, { rot: -.2, tex: false });
    sbDot(c, -290, -372, 8, '#B06A60'); sbDot(c, -258, -378, 7, '#B06A60');
    const lk = clamp(o.lick || 0);
    if (lk > .02) sbShape(c, sbPoly([[-282, -338], [-300 - lk * 30, -360 - lk * 70], [-276 - lk * 40, -380 - lk * 90], [-256 - lk * 18, -350 - lk * 40], [-252, -334]], { n: 5, jit: .5 }), '#EE7F8E', { tex: false });
    else sbMouth(c, -262, -334, 34, 'smile', { col: '#8A4A40' });
    sbEye(c, -218, -420, 15, { blink: bl, happy: o.happy, look: o.look });
    if (bl < .6 && !o.happy) for (const k of [-.8, -.2, .4]) sbLine(c, [[-218 + k * 14, -436], [-218 + k * 22, -450]], 3, SB.ink, { taper: .3 });
    sbCheek(c, -200, -370, 28);
    c.restore();
  }, o);
}
const SB_NANDI = { coat: '#F3EEE6', shade: '#D9D0C4', hump: '#ECE5DA', muzzle: '#D8C4BE', hoof: '#5A4A44', horn: '#E2683A', tip: '#F2B33D', cloth: '#C8323C', border: '#F2B33D', mari: '#F7891B', mari2: '#FFC93C', bell: '#F2B33D', tuft: '#5A4A44' };
function sbNandi(c, x, y, s, o = {}) {
  const P = { ...SB_NANDI, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 2.2, 4), bl = sbBlink(o), tail = o.tail ?? Math.sin(t * 2) * .6;
  sbAt(c, x, y, s, () => {
    const leg = (lx, back) => { sbShape(c, sbPoly([[lx - 42, -300], [lx + 42, -300], [lx + 34, -40], [lx - 34, -40]], { n: 5, jit: 1 }), back ? P.shade : P.coat, { tex: false }); sbEll(c, lx, -24, 40, 28, P.hoof, { tex: false }); };
    leg(-90, true); leg(200, true);
    sbDry(c, [[270, -470], [310 + tail * 18, -380], [322 + tail * 36, -250]], 12, P.coat, 1, 5, { n: 16 }); sbEll(c, 326 + tail * 38, -236, 20, 44, P.tuft, { rot: -.2 - tail * .2, tex: false });
    c.save(); c.translate(0, br * .3);
    sbEll(c, 50, -440, 300, 205, P.coat, { shade: ['rgba(70,50,30,.2)', 1.3] });
    sbEll(c, -150, -610, 135, 115, P.hump, { tex: false, shade: ['rgba(70,50,30,.12)', 1.2] });
    sbEll(c, -190, -470, 150, 175, P.coat, { tex: false, shade: ['rgba(70,50,30,.1)', 1.6] });   // the deep chest
    // the jhool: a red cloth over his back, a gold border and little mirrors
    const cl = sbPoly([[-30, -625], [210, -620], [250, -390], [-50, -380]], { n: 6 });
    sbShape(c, cl, P.cloth, { tex: false, shade: ['rgba(60,0,0,.2)', 1.4] });
    c.save(); sbPath(c, cl); c.clip(); sbDry(c, [[-70, -385], [90, -378], [240, -392]], 26, P.border, .95, 8, { n: 16, dry: .02 }); for (let i = 0; i < 5; i++) sbDot(c, 0 + i * 45, -480 + (i % 2) * 30, 9, '#DCE6F0'); c.restore();
    c.restore();
    leg(-150, false); leg(150, false);
    // the dewlap and the head
    c.save(); c.translate(-200, -480); c.rotate(Math.sin(t * TAU / 3.6) * .02 + (o.tilt || 0)); c.scale(1.3, 1.3); c.translate(200, 480 - 40);
    sbShape(c, sbPoly([[-170, -500], [-120, -460], [-140, -330], [-210, -300], [-250, -380], [-290, -560]], { n: 6 }), P.coat, { tex: false, shade: ['rgba(70,50,30,.12)', 1.6] });
    // the horns, painted, with gold tips
    for (const [hx, sd, d] of [[-330, -1, .85], [-262, 1, 1]]) { const P0 = [hx, -680], P1 = [hx + sd * 12 * d, -760 * d - 680 * (1 - d) + 10], P2 = [hx + sd * 52 * d, -800 * d - 680 * (1 - d) + 6];
      sbLine(c, [P0, P1, P2], 30 * d, P.horn, { taper: .45, trem: .3 }); sbDot(c, P2[0], P2[1], 10 * d, P.tip); }
    for (const [ex, sd] of [[-230, 1], [-370, -1]]) { c.save(); c.translate(ex, -660); c.rotate(sd * .3 + Math.sin(t * 2.4 + sd) * .05); sbEll(c, sd * 50, 0, 60, 24, P.coat, { tex: false }); sbEll(c, sd * 48, 0, 36, 12, P.muzzle, { tex: false }); c.restore(); }
    const head = sbPoly([[-250, -700], [-215, -640], [-235, -560], [-300, -500], [-380, -490], [-420, -540], [-410, -620], [-350, -700]], { n: 8 });
    sbShape(c, head, P.coat, { shade: ['rgba(70,50,30,.12)', .8] });
    c.save(); sbPath(c, head); c.clip(); sbShape(c, sbPoly([[-430, -600], [-350, -590], [-310, -520], [-340, -470], [-440, -470]], { n: 6 }), P.muzzle, { tex: false }); c.restore();
    sbDot(c, -400, -540, 8, '#8A6A60'); sbDot(c, -372, -546, 7, '#8A6A60');
    sbMouth(c, -360, -508, 36, o.mouth || 'smile', { col: '#6A4A40' });
    sbLine(c, [[-318, -680], [-318, -650]], 9, '#E2483D', { taper: .3 });
    sbEye(c, -300, -620, 16, { blink: bl, happy: o.happy, look: o.look });
    if (bl < .6 && !o.happy) for (const k of [-.8, -.2, .4]) sbLine(c, [[-300 + k * 14, -637], [-300 + k * 22, -651]], 3, SB.ink, { taper: .3 });
    sbCheek(c, -268, -570, 32);
    // the marigold garland and the bell
    for (let i = 0; i <= 10; i++) { const f = i / 10; sbDot(c, lerp(-150, -250, f) + Math.sin(f * Math.PI) * -20, lerp(-470, -380, f) + Math.sin(f * Math.PI) * 60, 15, i % 2 ? P.mari2 : P.mari); }
    sbEll(c, -205, -315, 24, 26, P.bell, { tex: false }); sbDot(c, -205, -298, 6, '#8A5A1A');
    c.restore();
  }, o);
}

// ---------- Bal Radha (front view, standing) ----------
// A little girl in a flared lehenga with a gold border, a choli, an odhni over her head and round her shoulders, a long
// plait, a bindi, a nose ring, flowers in her hair. o.arm: 'hold' (her right arm, screen left, out to hold a hand) |
// 'down' | 'none' (the scene draws it); o.lotus (true: a lotus in her other hand); o.odhni (-1..1: the cloth stirs), o.happy, o.look, o.tilt
const SB_RADHA = { skin: '#F4C6A0', dk: '#E0A47E', hair: '#2A1E1E', lehenga: '#E85A8A', dk2: '#C2406E', border: '#F2B33D', choli: '#F2C230', odhni: '#FBD0B0', odhniDk: '#F2A88A', gold: '#F2B33D', red: '#D8323C', flower: '#FFFFFF' };
function sbRadha(c, x, y, s, o = {}) {
  const P = { ...SB_RADHA, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 1.9, 5), bl = sbBlink(o), ow = o.odhni ?? Math.sin(t * 1.4) * .5;
  sbAt(c, x, y, s, () => {
    // the plait behind, down her back
    sbLine(c, [[60, -620], [120, -520], [110, -380], [130, -300]], 40, P.hair, { taper: .3, trem: .4 }); sbDot(c, 132, -292, 16, P.red);
    for (const sd of [-1, 1]) { sbEll(c, sd * 40, -20, 36, 16, P.dk, { tex: false }); sbDry(c, [[sd * 40 - 28, -34], [sd * 40 + 28, -34]], 8, P.gold, .9, 3, { n: 6 }); }
    c.translate(0, br * .4);
    // the lehenga: a wide flared bell with a gold border
    const sk = sbPoly([[-190, -40], [-80, -20], [80, -20], [190, -40], [120, -290], [-120, -290]], { n: 8 });
    sbShape(c, sk, P.lehenga, { shade: ['rgba(80,0,30,.22)', .4], ang: -1.3 });
    c.save(); sbPath(c, sk); c.clip();
    sbDry(c, [[-200, -56], [0, -30], [200, -56]], 30, P.border, .95, 10, { n: 20, dry: .03, fade: .1 });
    for (let i = 0; i < 9; i++) sbDot(c, -150 + i * 38, -120 - (i % 2) * 60, 6, P.border);
    for (const k of [-1, 0, 1]) sbDry(c, [[k * 30, -285], [k * 80, -60]], 8, P.dk2, .45, 4, { n: 10 });
    c.restore();
    // the choli and the bare midriff, the odhni round her shoulders
    sbEll(c, 0, -330, 92, 64, P.skin, { tex: false });
    sbEll(c, 0, -380, 100, 74, P.choli, { shade: ['rgba(120,80,0,.2)', 1.5] });
    sbShape(c, sbPoly([[-120, -420], [120, -420], [150 + ow * 10, -260], [190 + ow * 30, -120], [120 + ow * 20, -150], [60, -320], [-60, -320], [-150, -200], [-170, -240]], { n: 6 }), P.odhni, { alpha: .88, shade: ['rgba(200,90,60,.18)', .6] });
    sbDry(c, [[-150, -200], [0, -330], [190 + ow * 30, -120]], 10, P.border, .6, 4, { n: 14 });
    // arms
    if (o.arm === 'none') {}   // the scene draws that arm (holding a hand)
    else if ((o.arm || 'hold') === 'hold') { c.save(); c.translate(-95, -400); c.rotate(1.6); sbEll(c, 0, 80, 30, 88, P.skin, { tex: false }); sbDry(c, [[-26, 130], [26, 130]], 9, P.red, .9, 3, { n: 6 }); sbEll(c, 0, 172, 30, 30, P.skin, { tex: false }); c.restore(); }
    else { c.save(); c.translate(-95, -400); c.rotate(.25); sbEll(c, 0, 80, 30, 88, P.skin, { tex: false }); sbEll(c, 0, 170, 30, 30, P.skin, { tex: false }); c.restore(); }
    c.save(); c.translate(95, -400); c.rotate(-.35); sbEll(c, 0, 80, 30, 88, P.skin, { tex: false }); sbDry(c, [[-26, 130], [26, 130]], 9, P.red, .9, 3, { n: 6 }); sbEll(c, 0, 170, 30, 30, P.skin, { tex: false });
    if (o.lotus !== false) sbLotus(c, 6, 158, .55, { lotus: '#F29AB0', lotus2: '#FBD0DA' });
    c.restore();
    // head: hair, face, the odhni over the head
    c.save(); c.translate(0, -520); c.rotate(Math.sin(t * TAU / 3.8) * .03 + (o.tilt || 0)); c.translate(0, 520);
    sbEll(c, 0, -555, 128, 126, P.hair, { tex: false });
    sbEll(c, 0, -540, 112, 114, P.skin, { shade: ['rgba(140,60,40,.12)', .6] });
    sbShape(c, sbPoly([[-114, -570], [-80, -640], [0, -662], [80, -640], [114, -570], [60, -620], [0, -628], [-60, -620]], { n: 6 }), P.hair, { tex: false });
    sbShape(c, sbPoly([[-150, -470], [-140, -600], [-90, -680], [0, -705], [90, -680], [140, -600], [150, -470], [118, -500], [112, -600], [60, -655], [0, -668], [-60, -655], [-112, -600], [-118, -500]], { n: 6 }), P.odhni, { alpha: .9 });
    sbDry(c, [[-140, -600], [0, -700], [140, -600]], 9, P.border, .8, 4, { n: 14 });
    for (const [fx, fy] of [[-100, -610], [-80, -640], [-112, -580]]) sbDot(c, fx, fy, 10, P.flower);
    for (const sd of [-1, 1]) sbDot(c, sd * 114, -505, 12, P.gold);
    sbDot(c, 0, -612, 8, P.red);
    sbEye(c, -42, -545, 17, { blink: bl, happy: o.happy, look: o.look }); sbEye(c, 42, -545, 17, { blink: bl, happy: o.happy, look: o.look });
    for (const sd of [-1, 1]) if (bl < .6 && !o.happy) for (const k of [-.6, 0]) sbLine(c, [[sd * (42 + 14) + k * 6 * sd, -560], [sd * (42 + 24) + k * 6 * sd, -572]], 3, SB.ink, { taper: .3 });
    sbCheek(c, -74, -492, 36); sbCheek(c, 74, -492, 36);
    sbLine(c, [[14, -500], [20, -490], [12, -484]], 3, P.gold, { taper: .2 });   // the nose ring
    sbMouth(c, 0, -476, o.mouth === 'grin' ? 54 : 40, o.mouth || 'smile', { col: '#B23A4A' });
    c.restore();
  }, o);
}
