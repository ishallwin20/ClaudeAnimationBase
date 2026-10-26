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
// o: flap (0..1 the wings out), tilt (head), coin (true: a gold coin in her feet)
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
    sbShape(c, sbPoly([[0, -470], [-120, -515], [-185, -610], [-120, -690], [0, -655], [120, -690], [185, -610], [120, -515]], { n: 8 }), P.face, { tex: false });
    sbEye(c, -75, -598, 30, { blink: bl, happy: o.happy, look: o.look }); sbEye(c, 75, -598, 30, { blink: bl, happy: o.happy, look: o.look });
    sbCheek(c, -105, -540, 40); sbCheek(c, 105, -540, 40);
    sbShape(c, sbPoly([[-16, -585], [16, -585], [0, -530]], { n: 5, jit: .6 }), P.beak, { tex: false });
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
    // back arms, raised
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * 110, -470); c.rotate(sd * ((kind === 'kalaratri' ? .85 : .55) + Math.sin(t * 1.5 + sd) * .03)); if (kind === 'kalaratri') c.scale(1.15, 1.15);
      sbEll(c, 0, -80, 30, 95, P.skin, { tex: false }); sbEll(c, 0, -172, 34, 34, P.skin, { tex: false });
      if (kind === 'lakshmi') sbLotus(c, 0, -190, .75, P);
      else if (sd < 0) { c.save(); c.translate(0, -175); c.rotate(-.35); sbShape(c, sbPoly([[-10, 10], [10, 10], [22, -150], [60, -250], [6, -190], [-12, -40]], { n: 6 }), P.blade, { tex: false }); sbEll(c, 0, 20, 40, 12, P.gold, { tex: false }); c.restore(); }
      else { c.save(); c.translate(0, -190); sbBolt(c, 0, 0, 1, P.bolt); c.restore(); }
      c.restore(); }
    // the bell of the sari
    const bell = sbPoly([[-250, -30], [-120, -6], [120, -6], [250, -30], [170, -330], [100, -470], [-100, -470], [-170, -330]], { n: 8 });
    sbShape(c, bell, P.sari, { shade: ['rgba(40,0,10,.25)', .4], ang: -1.3 });
    c.save(); sbPath(c, bell); c.clip();
    sbDry(c, [[-260, -48], [0, -14], [260, -48]], 34, P.border, .95, 10, { n: 20, dry: .03, fade: .1 });
    sbShape(c, sbPoly([[-100, -470], [10, -470], [210, -120], [150, -100]], { n: 6 }), P.sari2, { tex: false, alpha: .9 });
    sbDry(c, [[10, -470], [120, -290], [215, -120]], 16, P.border, .9, 6, { n: 16, dry: .03, fade: .1 });
    for (let i = 0; i < 7; i++) sbDot(c, -150 + i * 45 + (i % 2) * 10, -220 + (i % 3) * 50, 6, P.border);
    c.restore();
    // front arms
    c.save(); c.translate(-125, -400); c.rotate(.35); sbEll(c, -10, 70, 30, 90, P.skin, { tex: false }); sbEll(c, -20, 160, 34, 34, P.skin, { tex: false }); c.restore();
    c.save(); c.translate(125, -400); c.rotate(-.9); sbEll(c, 10, 70, 30, 90, P.skin, { tex: false }); c.restore();
    sbEll(c, 210, -440, 36, 40, P.skin, { tex: false });   // abhaya: the right palm up and out
    sbDot(c, 210, -440, 9, kind === 'lakshmi' ? P.sari : P.gold);
    if (kind === 'lakshmi' && (o.coins ?? 1) > 0) { const k = o.coins ?? 1; for (let i = 0; i < 7; i++) { const f = frac(t * .9 + i / 7); sbCoin(c, -150 + Math.sin(i * 2.3) * 16, -290 + f * 260, .55, { spin: f * 2 + i * .3, ...(f > .92 ? {} : {}) }); } }
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
