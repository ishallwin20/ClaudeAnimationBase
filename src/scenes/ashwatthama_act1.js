// ashwatthama_act1.js: CHIRANJEEVI Issue 1, the panel art of the cover, the cold open and Act 1 (pp. 1–10), and the
// close (pp. 39–41). The cast is in cine_mbh.js and ashwatthama_cast.js; at() and the night lights are in
// ashwatthama_comic.js (load it first).
const WARM = { tint: ['#2A1208', .12], edge: { col: '#FFD9A0', w: 2, a: .5 }, rim: { col: '#FFF0C8', dx: 6, dy: -4, a: .8, blur: 1 } };
const DUSTL = { tint: ['#3A1A0A', .26], grade: [[0, 'rgba(0,0,0,0)'], [2700, 'rgba(30,10,4,.45)']], edge: { col: '#FFC890', w: 2, a: .55 }, rim: { col: '#FFD8A0', dx: -6, dy: -4, a: .85, blur: 1 } };
const SILW = { tint: ['#140A08', .9], edge: { col: '#FFB070', w: 1.6, a: .6 }, rim: { col: '#FFD08A', dx: 3, dy: -3, a: .9 } };
const DAWNSIL = { tint: ['#1A0C14', .88], edge: { col: '#FFD9A0', w: 1.6, a: .6 }, rim: { col: '#FFE8B8', dx: -3, dy: -3, a: .9 } };
const sil = (c, x, y, k, flip, draw) => { c.save(); c.translate(x, y); c.scale(k * (flip ? -1 : 1), k); draw(c); c.restore(); };
const bust = (c, x, y, k, o, L, lo = {}) => { figure(c, (f) => { at(f, x, y, k, -815); if (o.ash) ashBust(f, o); else mbhBust(f, o); }, lit(L, lo)); if (o.ash && o.gem !== false) { c.save(); at(c, x, y, k, -815); ashGemGlow(c, o.glow ?? .8); c.restore(); } };
// the battlefield behind a scene: a dusty sky, a low sun, the armies' banners and spears along the horizon
function battleSky(c, P, o = {}) {
  const hy = o.hy ?? P.h * .62;
  sky(c, o.stops || [[0, '#3A160E'], [hy * .7, '#A8441E'], [hy, '#E8904A'], [P.h, '#2A120A']]);
  if (o.sun !== false) { glow(c, o.sx ?? P.w * .7, o.sy ?? hy - 40, 260, '#FFC070', .5); ellipse(c, o.sx ?? P.w * .7, o.sy ?? hy - 40, 46, 46, '#FFE6B0'); }
  const rnd = lcg(o.seed || 9);
  c.fillStyle = '#2A120C';
  for (let i = 0; i < 70; i++) { const x = rnd() * P.w, h = 40 + rnd() * 110; c.fillRect(x, hy - h, 2.4, h); }
  for (let i = 0; i < 12; i++) { const x = rnd() * P.w, h = 120 + rnd() * 90, f = (rnd() - .5) * 10; c.fillRect(x, hy - h, 3, h); fillPath(c, `M ${x + 3} ${hy - h} L ${x + 44} ${hy - h + 12 + f} L ${x + 3} ${hy - h + 26} Z`, '#2A120C'); }
  ridge(c, hy, 18, o.seed || 3, '#2A120C', { freq: .02, x0: -20, x1: P.w + 20, bottom: P.h + 20 });
  haze(c, hy - 10, 120, '#E8A060', .35);
  c.fillStyle = '#1E0E08'; c.fillRect(0, hy + 30, P.w, P.h);
  haze(c, hy + 40, 60, '#C87040', .25);
}

// ---------- p1 · cover ----------
ART.cover = (c, P) => {
  nightSky(c, P.w, P.h, { stops: [[0, '#04060E'], [P.h * .45, '#121C38'], [P.h, '#05060B']] });
  moon(c, 840, 210, 62, 1.1);
  c.save(); at(c, 516, 1180, .62); banyanRoots(c, { col: '#05060B', seed: 4 }); c.restore();
  figure(c, (f) => { f.save(); at(f, 516, 1180, .62); banyan(f, { col: '#06060B', seed: 4 }); f.restore(); }, lit(TREESIL, { k: .8 }));
  const rnd = lcg(21);
  figure(c, (f) => { for (let i = 0; i < 26; i++) { const x = 40 + rnd() * (P.w - 80), y = 330 + rnd() * 190 + Math.abs(x - 516) * .12; crow(f, x, y, .32 + rnd() * .12, { dir: rnd() < .5 ? 1 : -1, tuck: rnd() < .4 }); } }, lit({ ...NIGHTSIL, tint: ['#070810', .7], edge: { col: '#C9D7F5', w: 1.6, a: .6 } }, { k: .6 }));
  owlEyes(c, 168, 300, .42);
  bust(c, 516, 760, 3.3, { ash: true, eyes: .86, look: [0, -.55], fierce: .8, pain: .05 }, MOONLIT, { k: 1.4 });
};

// ---------- p2 / p39 · the wanderer in a forest at night ----------
function nightForest(c, P, o = {}) {
  sky(c, [[0, '#03050C'], [P.h * .5, '#0C1428'], [P.h, '#04050A']]);
  glow(c, P.w * .62, P.h * .28, 520, '#7F97CC', .35);
  rays(c, P.w * .66, -40, { n: 7, dir: 1.9, spread: .5, len: P.h * .9, w: 160, col: '#AFC2EA', a: .3, t: 2, seed: o.seed || 2 });
  const rnd = lcg((o.seed || 2) + 40);
  for (const [n, w0, col] of [[14, 14, '#16203A'], [10, 26, '#0C1226'], [7, 44, '#070A16']]) for (let i = 0; i < n; i++) {
    const x = rnd() * P.w, w = w0 * (.7 + rnd() * .6), lean = (rnd() - .5) * 30;
    if (Math.abs(x - P.w * .5) < 90 + w0 * 2) continue;   // keep the path clear
    fillPath(c, `M ${x - w / 2} ${P.h * .8} L ${x - w * .3 + lean} -10 L ${x + w * .3 + lean} -10 L ${x + w / 2} ${P.h * .8} Z`, col);
    if (w0 > 20) strokePath(c, `M ${x + lean * .6} ${P.h * (.2 + rnd() * .3)} q ${(rnd() < .5 ? -1 : 1) * 80} -40 ${(rnd() < .5 ? -1 : 1) * 160} -60`, col, w * .3);
  }
  haze(c, P.h * .72, 220, '#6A7CA8', .3);
  fillPath(c, `M 0 ${P.h * .78} C ${P.w * .3} ${P.h * .76} ${P.w * .7} ${P.h * .8} ${P.w} ${P.h * .77} L ${P.w} ${P.h} L 0 ${P.h} Z`, '#05070E');
  fillPath(c, `M ${P.w * .44} ${P.h * .78} C ${P.w * .5} ${P.h * .85} ${P.w * .4} ${P.h * .93} ${P.w * .3} ${P.h} L ${P.w * .7} ${P.h} C ${P.w * .62} ${P.h * .92} ${P.w * .58} ${P.h * .85} ${P.w * .56} ${P.h * .78} Z`, '#141C30');   // a path
  for (const [x, k] of [[-40, 1.1], [P.w + 30, 1.2]]) forestTree(c, x, P.h + 40, k, { col: '#020308' });
}
ART.coldWalk = (c, P) => {
  nightForest(c, P);
  figure(c, (f) => sil(f, P.w * .5, P.h * .8, .36, false, (g) => wanderer(g, { step: .6 })), lit(NIGHTSIL));
};
ART.coldWalkEnd = (c, P) => {
  nightForest(c, P, { seed: 5 });
  figure(c, (f) => sil(f, P.w * .52, P.h * .78, .2, false, (g) => wanderer(g, { step: .2 })), lit(NIGHTSIL));
  haze(c, P.h * .8, 160, '#6A7CA8', .3);
};

// ---------- p3 · he turns ----------
function ashOld(c, o = {}) {
  // the hood of his shawl behind the head, then the head with a cloth bound round the brow where the gem was
  fillPath(c, 'M -100 -700 C -110 -820 -90 -930 0 -960 C 90 -930 110 -820 100 -700 Z', '#16121A');
  ashHead(c, { ...o, gem: false });
  faceAge(c, ASH.skinDk, .8);
  for (let i = 0; i < 7; i++) strokePath(c, `M ${-30 + i * 10} -756 q ${(i % 2 ? 2 : -2)} 7 ${(i - 3) * 1.2} 12`, rgba('#B8B0A4', .55), 1);   // grey in the beard
  const BAND = 'M -52 -884 C -30 -904 30 -904 52 -884 L 52 -848 C 30 -866 -30 -866 -52 -848 Z';
  fillPath(c, BAND, '#4A2E28'); inside(c, BAND, () => { for (let i = 0; i < 6; i++) strokePath(c, `M ${-56 + i * 22} -900 l 18 50`, rgba('#2A1A16', .7), 3); });
  fillPath(c, 'M 40 -868 C 60 -860 72 -840 70 -810 C 62 -830 52 -846 38 -852 Z', '#4A2E28');   // the knot of the cloth
  fillPath(c, 'M -100 -700 C -96 -760 -80 -800 -60 -830 L -54 -760 C -58 -740 -70 -720 -76 -700 Z M 100 -700 C 96 -760 80 -800 60 -830 L 54 -760 C 58 -740 70 -720 76 -700 Z', '#16121A');   // the hood's edges round the face
}
ART.coldTurn = (c, P) => {
  sky(c, [[0, '#03040A'], [P.h, '#0A1020']]);
  glow(c, P.w + 60, 260, 760, '#7F97CC', .4);
  for (const [x, k] of [[120, .9], [-60, 1.2]]) forestTree(c, x, P.h, k, { col: '#05070E' });
  figure(c, (f) => {
    at(f, 560, 600, 6.2, -815); ashOld(f, { eyes: .9, look: [.85, .1], fierce: .55, pain: .2 });
    f.save(); f.setTransform(1, 0, 0, 1, 0, 0); f.globalCompositeOperation = 'source-atop';
    const g = f.createLinearGradient(0, 0, W * .62, 0); g.addColorStop(0, 'rgba(2,3,8,.96)'); g.addColorStop(.62, 'rgba(2,3,8,.9)'); g.addColorStop(1, 'rgba(2,3,8,0)');
    f.fillStyle = g; f.fillRect(0, 0, W, H); f.restore();
  }, lit({ ...MOONLIT, rim: { ...MOONLIT.rim, dx: 8, dy: -2 } }, { k: 1.6, inkW: 1.8 }));
};

// ---------- p4 · the birth ----------
ART.birthHut = (c, P) => {
  sky(c, [[0, '#1A1E3A'], [P.h * .45, '#7A4A5A'], [P.h * .72, '#F0A060'], [P.h, '#3A1A12']]);
  glow(c, 880, P.h * .7, 360, '#FFD090', .6); ellipse(c, 880, P.h * .72, 40, 40, '#FFF0C8');
  ridge(c, P.h * .72, 50, 6, '#3A2030', { freq: .006, x0: -20, x1: P.w + 20, bottom: P.h + 20 });
  haze(c, P.h * .74, 90, '#F8C090', .4);
  c.fillStyle = '#2A140E'; c.fillRect(0, P.h * .8, P.w, P.h);
  hut(c, 170, P.h * .82, 1.15, { col: '#2A1810', lit: .8 });
  const DAWN = { tint: ['#3A1A20', .18], edge: { col: '#FFD9A0', w: 2, a: .5 }, rim: { col: '#FFE8B8', dx: 6, dy: -3, a: .85, blur: 1 } };
  figure(c, (f) => { f.save(); f.translate(470, 900); f.scale(.74, .74); kripiWithBaby(f); f.restore(); }, lit(DAWN));
  person(c, 760, 905, .76, { ...CAST.drona, dress: 'bare', longHair: true, look: [-.7, .3], smile: .35, pain: 0, arms: { l: [[200, -580], [150, -520]], r: 'down' } }, DAWN);
};
ART.babyCry = (c, P) => {
  sky(c, [[0, '#3A2018'], [P.h, '#1A0C0A']]);
  glow(c, P.w * .3, 80, 420, '#FFC890', .35);
  // the swaddling cloth round the face
  fillPath(c, `M ${P.w * .5 - 300} ${P.h} C ${P.w * .5 - 330} 200 ${P.w * .5 - 160} 40 ${P.w * .5} 40 C ${P.w * .5 + 160} 40 ${P.w * .5 + 330} 200 ${P.w * .5 + 300} ${P.h} Z`, '#E8DCC4');
  for (let i = 0; i < 6; i++) strokePath(c, `M ${P.w * .5 - 280 + i * 20} ${P.h} C ${P.w * .5 - 300 + i * 30} 300 ${P.w * .5 - 160 + i * 20} 100 ${P.w * .5 - 60 + i * 10} 60`, rgba('#B8A888', .7), 4);
  figure(c, (f) => { f.save(); f.translate(P.w * .5, 350); f.scale(2.1, 2.1); babyHead(f, { cry: 1 }); ashGemAt(f, 0, -62, 2.2); f.restore(); }, lit(WARM, { k: 1.2 }));
  c.save(); c.translate(P.w * .5, 350); c.scale(2.1, 2.1); glow(c, 0, -62, 40, '#7FD8FF', .5); c.restore();
};
// the gem alone, centred at (x, y), k times its size on his forehead
function ashGemAt(c, x, y, k) { c.save(); c.translate(x, y); c.scale(k, k); c.translate(0, 857); ashGem(c, 1); c.restore(); }
ART.skyVoice = (c, P) => {
  sky(c, [[0, '#FFF2D0'], [P.h * .3, '#C88A50'], [P.h, '#2A140C']]);
  rays(c, P.w * .5, -60, { n: 9, dir: Math.PI / 2, spread: .9, len: P.h * 1.1, w: 200, col: '#FFF0C0', a: .55, t: 1, seed: 3 });
  bust(c, P.w * .5, 470, 1.9, { ...CAST.drona, dress: 'bare', longHair: true, look: [0, -1], eyes: 1, pain: .2, smile: .1 }, { ...WARM, rim: { ...WARM.rim, dx: 0, dy: -7 } });
};

// ---------- p5 · the gem ----------
ART.gemBaby = (c, P) => {
  sky(c, [[0, '#1A0E0C'], [P.h, '#2A1610']]);
  glow(c, P.w * .5, 330, 600, '#FFB070', .2);
  fillPath(c, `M -40 ${P.h} C 0 300 200 120 ${P.w * .5} 110 C ${P.w - 200} 120 ${P.w + 40} 300 ${P.w + 40} ${P.h} Z`, '#D8CCB2');
  figure(c, (f) => { f.save(); f.translate(P.w * .5, 560); f.scale(3.4, 3.4); babyHead(f, { cry: 0 }); ashGemAt(f, 0, -62, 2.6); f.restore(); }, lit(WARM, { k: 1.4 }));
  c.save(); c.translate(P.w * .5, 560); c.scale(3.4, 3.4); glow(c, 0, -62, 70, '#7FD8FF', .55); glow(c, 0, -62, 16, '#E8FBFF', .7); c.restore();
};
function gemLight(c, x, y, r) { glow(c, x, y, r * 2.2, '#3A9ACC', .45); glow(c, x, y, r, '#7FD8FF', .6); glow(c, x, y, r * .25, '#E8FBFF', .8); ashGemAt(c, x, y, r / 40); }
ART.gemWeapon = (c, P) => {
  sky(c, [[0, '#04070E'], [P.h, '#0A1424']]);
  gemLight(c, P.w * .62, P.h * .42, 70);
  for (let i = 0; i < 5; i++) {
    const y = P.h * .2 + i * 52, a = -.2 + i * .1, bx = P.w * .62 - 110 + Math.abs(i - 2) * 12;
    c.save(); c.translate(bx, y); c.rotate(a);
    strokePath(c, 'M -160 0 L -20 0', '#C8B890', 4); for (const s of [-1, 1]) fillPath(c, `M -160 0 L -186 ${s * 12} L -170 0 Z`, '#B8402A');
    c.rotate(.5 + i * .2); strokePath(c, 'M 0 0 L 40 0', '#C8B890', 4); fillPath(c, 'M 40 -6 L 58 0 L 40 6 Z', '#9AA2AE'); c.restore();
  }
};
ART.gemHunger = (c, P) => {
  sky(c, [[0, '#2A1A0E'], [P.h * .55, '#6A4422'], [P.h, '#2A180C']]);
  c.fillStyle = '#7A5230'; c.fillRect(0, P.h * .56, P.w, P.h);
  const rc = lcg(8); for (let i = 0; i < 16; i++) { let x = rc() * P.w, y = P.h * .58 + rc() * P.h * .4; const pts = [[x, y]]; for (let k = 0; k < 4; k++) { x += (rc() - .5) * 90; y += (rc() - .3) * 40; pts.push([x, y]); } strokePath(c, 'M ' + pts.map(q => q.join(' ')).join(' L '), '#2A160A', 3); }
  fillPath(c, `M ${P.w * .5 - 80} ${P.h * .62} C ${P.w * .5 - 70} ${P.h * .62 + 60} ${P.w * .5 + 70} ${P.h * .62 + 60} ${P.w * .5 + 80} ${P.h * .62} Z`, '#6A3418');
  ellipse(c, P.w * .5, P.h * .62, 80, 14, '#2A1208');
  gemLight(c, P.w * .5, P.h * .3, 46);
};
ART.gemDisease = (c, P) => {
  sky(c, [[0, '#1A0608'], [P.h, '#0A0306']]);
  for (let i = 0; i < 18; i++) { const a = hash(i) * TAU, d = 150 + hash(i + 4) * 200; glow(c, P.w * .5 + Math.cos(a) * d, P.h * .38 + Math.sin(a) * d, 70 + hash(i + 9) * 60, '#B82A1A', .4, 'source-over'); }
  ellipse(c, P.w * .5, P.h * .38, 120, 120, '#06101E');
  c.save(); c.strokeStyle = rgba('#7FD8FF', .8); c.lineWidth = 4; c.beginPath(); c.arc(P.w * .5, P.h * .38, 122, 0, TAU); c.stroke(); c.restore();
  gemLight(c, P.w * .5, P.h * .38, 56);
};
ART.gemStrip = (c, P) => { c.fillStyle = '#05060B'; c.fillRect(0, 0, P.w, P.h); gemLight(c, P.w - 60, P.h * .5, 34); };

// ---------- p6 · the teacher's son ----------
ART.dronaTeach = (c, P) => {
  sky(c, [[0, '#F0C890'], [P.h * .55, '#E89A50'], [P.h * .8, '#B8602A'], [P.h, '#3A1C0E']]);
  glow(c, 160, P.h * .62, 300, '#FFF0C0', .6);
  ridge(c, P.h * .66, 40, 2, '#9A5030', { freq: .005, x0: -20, x1: P.w + 20, bottom: P.h + 20 });
  haze(c, P.h * .68, 100, '#FFD8A0', .45);
  c.fillStyle = '#6A3A1A'; c.fillRect(0, P.h * .74, P.w, P.h);
  strokePath(c, `M 40 ${P.h * .76} L 40 ${P.h * .62}`, '#2A1208', 6); ellipse(c, 40, P.h * .6, 22, 26, '#2A1208');   // a straw target
  figure(c, (f) => { for (const [x, k] of [[200, .26], [300, .25], [400, .26]]) sil(f, x, P.h * .8, k, false, (g) => manSil(g, { pose: 'draw', head: 'kirita', prop: 'bow', quiver: true })); }, lit({ tint: ['#3A1A0A', .85], edge: { col: '#FFE0A8', w: 1.4, a: .6 }, rim: { col: '#FFF0C8', dx: -3, dy: -3, a: .9 } }));
  const SUN = { ...WARM, rim: { ...WARM.rim, dx: -6, dy: -3 } };
  person(c, 700, 980, .7, { ...CAST.drona, dress: 'bare', longHair: true, look: [-.8, 0], pain: 0, fierce: .3, arms: { l: 'point', r: 'hip' } }, SUN);
  person(c, 900, 960, .48, { who: 'ash', pal: ASH, dress: 'bare', boy: true, head: ashBoyHead, arms: { l: 'down', r: 'down' }, props: { r: 'bow' } }, SUN);
};
ART.warRanks = (c, P) => {
  battleSky(c, P, { hy: P.h * .7, sx: P.w * .5, seed: 6 });
  bust(c, 300, 340, 1.5, { ...CAST.drona, dress: 'armor', longHair: true, look: [.4, 0], fierce: .5, pain: 0 }, DUSTL);
  bust(c, 740, 360, 1.5, { ash: true, look: [-.3, 0], fierce: .6, pain: 0, glow: .5 }, DUSTL);
};

// ---------- p7 · day 15 ----------
ART.dronaRage = (c, P) => {
  battleSky(c, P, { hy: P.h * .74, sx: P.w * .15, seed: 11, stops: [[0, '#2A0C08'], [P.h * .5, '#8A2A14'], [P.h * .74, '#E87A3A'], [P.h, '#1A0806']] });
  for (let i = 0; i < 16; i++) { const x = hash(i) * P.w, y = 60 + hash(i + 3) * 260; strokePath(c, `M ${x} ${y} l -80 18`, rgba('#1A0806', .9), 3); }
  figure(c, (f) => { for (const [x, r] of [[80, 1.45], [180, 1.5], [960, -1.4]]) sil(f, x, P.h * .93, .2, false, (g) => { g.rotate(r); manSil(g, { pose: 'stand', head: 'turban' }); }); }, lit(SILW));
  figure(c, (f) => sil(f, 470, P.h * .84, 1, false, (g) => chariot(g, { gallop: 1.3, t: 7, col: '#3A2214' })), lit(DUSTL));
  person(c, 400, P.h * .84 - 20, .5, { ...CAST.drona, dress: 'armor', longHair: true, look: [-.9, 0], fierce: 1, pain: 0, arms: { l: 'bow', r: 'draw' }, props: { l: 'bow' }, drawTo: [70, -706] }, DUSTL);
};
ART.krishnaPlan = (c, P) => {
  // Krishna (left) speaks; Arjuna (right) turns away from it
  sky(c, [[0, '#5A2410'], [P.h, '#1A0A06']]);
  glow(c, P.w * .5, 120, 460, '#FFB070', .4);
  bust(c, 850, 430, 1.45, { ...CAST.arjuna, eyes: .12, pain: .7, look: [.8, .3] }, DUSTL);
  bust(c, 230, 410, 1.5, { ...CAST.krishna, look: [.5, .1], fierce: .25, pain: 0 }, DUSTL);
};
ART.arjunaNo = (c, P) => {
  sky(c, [[0, '#4A1A0C'], [P.h, '#140806']]);
  glow(c, 60, 80, 380, '#FFB070', .4);
  bust(c, P.w * .5, 420, 1.65, { ...CAST.arjuna, eyes: .12, pain: .7, look: [.8, .3] }, DUSTL);
};
ART.elephant = (c, P) => {
  battleSky(c, P, { hy: P.h * .8, sx: P.w * .85, seed: 13, stops: [[0, '#3A160A'], [P.h * .6, '#C8662A'], [P.h, '#2A0E06']] });
  figure(c, (f) => {
    f.save(); f.translate(960, P.h * 1.04); f.scale(-1.55, 1.55); f.rotate(.1);
    elephantSide(f, { run: 0, trunk: 1, pal: 0 });
    // a war elephant: a red cloth with a gold border over its back, a bell
    const CL = 'M -170 -330 C -60 -362 80 -360 160 -330 L 150 -190 C 60 -176 -60 -176 -170 -196 Z';
    fillPath(f, CL, '#8A1A1A'); strokePath(f, 'M 150 -190 C 60 -176 -60 -176 -170 -196', '#D9A441', 10); for (let i = 0; i < 6; i++) ellipse(f, -140 + i * 54, -270, 10, 10, '#D9A441');
    f.restore();
  }, lit(DUSTL));
  for (let i = 0; i < 10; i++) glow(c, 560 + hash(i) * 380, P.h * .92 + hash(i + 2) * 30, 70, '#E8A060', .35, 'source-over');
  person(c, 230, P.h * .99, .64, { ...CAST.bhima, dress: 'armor', legs: 'wide', fierce: 1, pain: 0, mouth: .5, look: [.9, .2], arms: { l: [[-80, -620], [-250, -610]], r: [[240, -660], [300, -600]] }, props: { r: 'mace' }, maceA: -.3 }, DUSTL);
};

// ---------- p8 · "Ashwatthama is dead" ----------
ART.bhimaShout = (c, P) => {
  battleSky(c, P, { hy: P.h * .8, sx: P.w * .9, seed: 17 });
  bust(c, 290, 420, 1.9, { ...CAST.bhima, mouth: 1, fierce: .7, pain: .3, look: [-.9, .3] }, DUSTL);
};
ART.dronaAsks = (c, P) => {
  sky(c, [[0, '#6A2A12'], [P.h, '#1A0A06']]);
  glow(c, P.w, 60, 380, '#FFB070', .45);
  bust(c, 270, 370, 2.05, { ...CAST.drona, dress: 'armor', longHair: true, pain: .75, eyes: 1, look: [.7, 0] }, DUSTL, { k: 1.2 });
};
ART.yudhiLies = (c, P) => {
  sky(c, [[0, '#5A2410'], [P.h, '#140806']]);
  glow(c, 0, 60, 380, '#FFB070', .4);
  bust(c, 770, 400, 2.05, { ...CAST.yudhi, eyes: .35, look: [-.2, 1], pain: .55 }, DUSTL, { k: 1.2 });
};
ART.chariotTouches = (c, P) => {
  // the wheel slams down into the ground: the earth cracks, the dust bursts out both ways
  const G = P.h * .72, wx = P.w * .52, wy = G - 196, R = 236;
  sky(c, [[0, '#5A2410'], [G, '#C8703A'], [P.h, '#3A1A0A']]);
  c.fillStyle = '#3A1C0C'; c.fillRect(0, G, P.w, P.h);
  fillPath(c, `M 0 ${G} L ${P.w} ${G} L ${P.w} ${G + 12} L 0 ${G + 12} Z`, '#5A2E14');
  c.save(); c.translate(wx, G); c.rotate(-.04);
  fillPath(c, `M -560 ${-196 - R - 60} L 520 ${-196 - R - 60} L 520 ${-196 - R} L -560 ${-196 - R} Z`, '#3A2014');   // the car's floor
  strokePath(c, `M -540 ${-196 - R - 60} L 500 ${-196 - R - 60}`, '#C8902E', 6);
  c.restore();
  figure(c, (f) => wheel(f, wx, wy, R, { col: '#5A3420' }), lit(DUSTL, { k: .9 }));
  // the crater and the cracks, dark
  fillPath(c, `M ${wx - 250} ${G} C ${wx - 180} ${G + 30} ${wx + 180} ${G + 30} ${wx + 250} ${G} Z`, '#1E0C04');
  const rc = lcg(12);
  for (let i = 0; i < 9; i++) { let x = wx + (rc() - .5) * 200, y = G + 10; const s = i % 2 ? 1 : -1, pts = [[x, y]]; for (let j = 0; j < 5; j++) { x += s * (50 + rc() * 70); y += 8 + rc() * 22; pts.push([x, y]); } strokePath(c, 'M ' + pts.map(q => q.join(' ')).join(' L '), '#160802', 5 - i * .3); }
  // the dust thrown out both ways, and clods in the air
  for (let i = 0; i < 26; i++) { const s = hash(i) < .5 ? -1 : 1, d = 120 + hash(i + 1) * 380; glow(c, wx + s * d, G - 20 - hash(i + 3) * 120 * (1 - d / 600), 50 + hash(i + 5) * 70, '#D89A5A', .55, 'source-over'); }
  for (let i = 0; i < 16; i++) { const s = hash(i + 40) < .5 ? -1 : 1; ellipse(c, wx + s * (160 + hash(i + 41) * 300), G - 60 - hash(i + 42) * 200, 6 + hash(i) * 8, 5 + hash(i + 1) * 6, '#2A1408', hash(i)); }
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) strokePath(c, `M ${wx + s * (270 + i * 30)} ${G - 20 - i * 30} q ${s * 60} -30 ${s * 140} -20`, rgba('#FFE0B0', .6), 3);   // the shock
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) strokePath(c, `M ${wx + s * (R + 30 + i * 26)} ${wy - 150 - i * 40} C ${wx + s * (R + 50 + i * 26)} ${wy - 60} ${wx + s * (R + 40 + i * 26)} ${wy + 40} ${wx + s * (R + 16 + i * 20)} ${wy + 120}`, rgba('#FFF0D0', .75 - i * .2), 6 - i);   // it came down hard
};

// ---------- p9 · Drona falls ----------
ART.dronaDown = (c, P) => {
  sky(c, [[0, '#4A160C'], [P.h * .6, '#C85A28'], [P.h, '#2A0C06']]);
  glow(c, P.w * .5, P.h * .55, 300, '#FFC070', .5);
  bust(c, 300, 330, 1.8, { ...CAST.drona, dress: 'armor', longHair: true, eyes: 0, pain: 0 }, DUSTL, { k: 1.2 });
  // his bow, laid down across the chariot's floor in front of him
  figure(c, (f) => { f.save(); f.translate(P.w * .52, P.h - 40); f.rotate(-.18); strokePath(f, 'M -300 0 C -150 -70 150 -70 300 0', '#3A2414', 16); strokePath(f, 'M -300 0 L 300 0', '#D8C8A0', 2.5); for (const s of [-1, 1]) ellipse(f, s * 300, 0, 10, 10, '#C8902E'); f.restore(); }, lit(DUSTL));
};
ART.arjunaShout = (c, P) => {
  sky(c, [[0, '#5A2410'], [P.h, '#140806']]);
  glow(c, 0, 120, 420, '#FFB070', .4);
  bust(c, 790, 310, 1.75, { ...CAST.arjuna, mouth: .8, pain: .7, look: [-.6, 0] }, DUSTL, { k: 1.2 });
};
ART.dronaDeath = (c, P) => {
  sky(c, [[0, '#1A0606'], [P.h * .5, '#8A1E10'], [P.h * .72, '#E86A2A'], [P.h, '#1A0606']]);
  glow(c, 600, P.h * .56, 360, '#FFB060', .55); ellipse(c, 600, P.h * .56, 110, 110, '#FFD8A0');
  ridge(c, P.h * .78, 20, 4, '#1A0806', { freq: .01, x0: -20, x1: P.w + 20, bottom: P.h + 20 });
  figure(c, (f) => {
    sil(f, 560, P.h * .8, .42, false, (g) => chariot(g, { flag: true, t: 3 }));
    sil(f, 560, P.h * .8 - 4, .34, false, (g) => rishi(g, { pose: 'sit' }));
    sil(f, 470, P.h * .8 - 4, .34, true, (g) => manSil(g, { pose: 'raise', head: 'kirita', prop: 'sword', propA: -1.9 }));
    sil(f, 130, P.h * .82, .11, false, (g) => manSil(g, { pose: 'stand', head: 'knot' }));
  }, lit({ ...SILW, rim: { ...SILW.rim, dx: 0, dy: -3 } }));
};

// ---------- p10 · the last commander ----------
ART.lakeDusk = (c, P) => {
  sky(c, [[0, '#1A1030'], [P.h * .45, '#7A3A4A'], [P.h * .62, '#E8885A'], [P.h, '#1A0C12']]);
  glow(c, 760, P.h * .6, 260, '#FFC890', .5);
  // the lake, the sky in it
  fillPath(c, `M 0 ${P.h * .64} L ${P.w} ${P.h * .64} L ${P.w} ${P.h * .8} L 0 ${P.h * .8} Z`, '#5A3040');
  for (let i = 0; i < 9; i++) strokePath(c, `M ${600 + hash(i) * 300} ${P.h * .66 + i * 7} l ${60 + hash(i + 2) * 80} 0`, rgba('#FFD8A8', .6), 2);
  c.fillStyle = '#120A0E'; c.fillRect(0, P.h * .8, P.w, P.h);
  for (let i = 0; i < 70; i++) { const x = hash(i * 3) * P.w; if (x > 120 && x < 900) continue; strokePath(c, `M ${x} ${P.h * .82} q ${(hash(i) - .5) * 20} -20 ${(hash(i + 1) - .5) * 40} -${20 + hash(i + 2) * 40}`, '#120A0E', 2.4); }
  figure(c, (f) => {
    sil(f, 500, P.h * .8 + 4, .62, false, (g) => sleeper(g, { who: 'king', col: '#1A1018' }));
    f.save(); f.translate(810, P.h * .8 + 2); f.rotate(.12); limb(f, [[0, 0], [-140, 0]], [12, 16], '#1A1018'); ellipse(f, 30, 0, 40, 40, '#1A1018'); f.restore();   // his mace
  }, lit({ tint: ['#1A0C12', .7], edge: { col: '#FFC890', w: 1.6, a: .5 }, rim: { col: '#FFD8A0', dx: 3, dy: -3, a: .9 } }));
};
ART.ashVow = (c, P) => {
  sky(c, [[0, '#2A1430'], [P.h, '#0E0810']]);
  glow(c, P.w, P.h * .5, 400, '#E8885A', .4);
  lyingBust(c, 840, 560, 1.35, { ...CAST.duryo, dress: 'armor', eyes: .8, look: [-1, -.3], pain: .5, tilt: .25 }, { ...WARM, tint: ['#2A1020', .35] });
  bust(c, 290, 360, 2, { ash: true, fierce: 1, pain: .1, mouth: .25, look: [.6, .3], glow: .7 }, { ...WARM, tint: ['#2A1020', .3], rim: { ...WARM.rim, dx: 7, dy: 0 } }, { k: 1.2 });
};
ART.anoint = (c, P) => {
  // Duryodhana, on the ground at the left, gives the order; Kripa's arm (right) pours the water over the bowed head
  const W2 = { ...WARM, tint: ['#2A1020', .3], rim: { ...WARM.rim, dx: 7, dy: -2 } };
  sky(c, [[0, '#2A1430'], [P.h * .7, '#3A1A2A'], [P.h, '#0E0810']]);
  glow(c, P.w, 60, 420, '#E8885A', .4);
  c.fillStyle = '#140A10'; c.fillRect(0, P.h * .84, P.w, P.h);
  const hx = 680, hy0 = 400, k = 1.95, hy = hy0 - 120 * k;
  bust(c, hx, hy0, k, { ash: true, eyes: 0, pain: 0, look: [0, 1], glow: .6 }, W2, { k: 1.2 });
  strokePath(c, `M ${P.w * .86} 132 C ${P.w * .78} 140 ${hx + 40} 150 ${hx + 8} ${hy}`, rgba('#BFE0FF', .8), 12);
  strokePath(c, `M ${P.w * .86} 132 C ${P.w * .78} 140 ${hx + 40} 150 ${hx + 8} ${hy}`, rgba('#FFFFFF', .7), 4);
  for (let i = 0; i < 12; i++) ellipse(c, hx - 80 + hash(i) * 170, hy + hash(i + 3) * 80, 4, 6, rgba('#CFE8FF', .8));
  figure(c, (f) => { kalash(f, P.w * .93, 136, 1.15, { tip: -2.2 }); limb(f, [[P.w + 40, 50], [P.w * .95, 76]], [58, 50], MBH.kripa.skin); }, lit(W2));
  // mirrored, so his body runs off the panel's left edge and his head (top toward Ashwatthama) is all we see of him
  c.save(); c.translate(2 * 300, 0); c.scale(-1, 1); lyingBust(c, 300, P.h * .8, 1.45, { ...CAST.duryo, dress: 'armor', eyes: 1, look: [-.4, -.8], pain: .4, mouth: .5, tilt: -.3 }, W2, { k: 1.2 }); c.restore();
};
ART.riders = (c, P) => {
  sky(c, [[0, '#0A0C1A'], [P.h * .7, '#3A2838'], [P.h, '#0A080E']]);
  glow(c, P.w, P.h * .7, 300, '#C87050', .35);
  for (const [x, k] of [[30, .5], [-40, .62]]) forestTree(c, x, P.h, k, { col: "#05060B" });
  c.fillStyle = '#05060B'; c.fillRect(0, P.h * .88, P.w, P.h);
  // three riders, apart, galloping to screen left into the forest; each sits astride, leaning toward the horse's head
  figure(c, (f) => {
    for (const [x, ph, k] of [[230, 0, .5], [560, 1.3, .48], [880, 2.4, .46]]) sil(f, x, P.h * .95, k, true, (g) => {
      horse(g, { gallop: ph, t: 3 });
      g.save(); g.translate(10, -300); g.scale(-1, 1); manSil(g, { pose: 'ride', head: 'knot' }); g.restore();
    });
  }, lit({ tint: ['#08080E', .86], edge: { col: '#E8A890', w: 1.6, a: .6 }, rim: { col: '#FFC8A8', dx: -3, dy: -3, a: .9 } }));
};

// ---------- p40 · facts, p41 · the back page ----------
ART.paper = (c, P) => {
  sky(c, [[0, '#0E0C12'], [P.h, '#060509']]);
  glow(c, P.w * .5, P.h * .4, 700, '#2A2438', .5);
};
ART.backPage = (c, P) => {
  sky(c, [[0, '#05060B'], [P.h * .6, '#141024'], [P.h, '#05060B']]);
  glow(c, P.w * .5, P.h * .5, 460, '#E8B442', .3);
  // the seven in a row, dark; Hanuman in the middle, lit
  const y = P.h * .64;
  figure(c, (f) => {
    const row = [
      [90, .3, (g) => manSil(g, { pose: 'stand', head: 'hood' })],                    // Ashwatthama
      [205, .3, (g) => manSil(g, { pose: 'stand', head: 'kirita' })],                 // Bali
      [320, .3, (g) => rishi(g, { pose: 'stand' })],                                  // Vyasa
      [420, .21, (g) => manSil(g, { pose: 'stand', head: 'knot' })],                  // Markandeya, the boy
      [630, .3, (g) => manSil(g, { pose: 'stand', head: 'kirita' })],                 // Vibhishana
      [760, .3, (g) => rishi(g, { pose: 'stand', staff: false })],                    // Kripa
      [900, .31, (g) => manSil(g, { pose: 'stand', head: 'knot', beard: 'short', prop: 'spear' })],   // Parshurama
    ];
    for (const [x, k, d] of row) sil(f, x, y, k, x > P.w / 2, d);
  }, lit({ tint: ['#06060C', .9], edge: { col: '#E8D4A0', w: 1.4, a: .45 }, rim: { col: '#FFE7A6', dx: 0, dy: -3, a: .7 } }));
  glow(c, P.w * .5, P.h * .48, 300, '#FFD27A', .5);
  figure(c, (f) => sil(f, P.w * .5, y, .4, false, (g) => {
    const col = '#0C0A10';
    limb(g, [[30, -470], [170, -540], [220, -740], [150, -900], [96, -862]], [34, 30, 24, 18, 12], col);   // the tail, raised in a curl
    manSil(g, { pose: 'stand', head: 'kirita', prop: 'mace', col, joints: { fa: [[-40, -600], [-70, -500]] } });
    ellipse(g, -52, -806, 26, 20, col);   // the muzzle
  }), lit({ tint: ['#1A0C04', .8], edge: { col: '#FFE7A6', w: 2, a: .9 }, rim: { col: '#FFF4D0', dx: 0, dy: -5, a: 1 } }));
  c.fillStyle = '#05060B'; c.fillRect(0, y, P.w, P.h);
};

// a person in colour, placed with the feet at (x, y), k the scale, lit
const person = (c, x, y, k, o, L, lo = {}) => figure(c, (f) => { f.save(); f.translate(x, y); f.scale(k * (o.flip ? -1 : 1), k); mbhFigure(f, o); f.restore(); }, lit(L, lo));
// Ashwatthama as a boy: the Surya rig in his colours, no beard, the gem
const ashBoyHead = (c) => { mbhHead(c, { pal: ASH, bun: true, kundala: 'ring', look: [-.4, 0], smile: .2 }); ashGem(c, 1); };
// Kripi: Sita's figure in Kripi's colours is not needed; Sita's rig with a baby in her arms
function kripiWithBaby(c) {
  // the swaddled baby lies across her chest, his head in the crook of her arm (screen right), his face up to us
  sita(c, { pose: 'stand', cradle: true, look: [.5, .7], eyes: .6, wind: .1, inArms: (g) => {
    const B = 'M -130 -600 C -140 -652 -70 -684 20 -680 C 100 -676 150 -654 160 -614 C 166 -570 120 -546 30 -544 C -60 -544 -122 -558 -130 -600 Z';
    fillPath(g, B, '#EDE2CC'); inside(g, B, () => { for (let i = 0; i < 5; i++) strokePath(g, `M ${-100 + i * 40} -680 q 16 64 -2 134`, rgba('#B8A888', .7), 3); });
    ellipse(g, 122, -632, 76, 72, '#F4EBD8');   // the cloth round his head
    g.save(); g.translate(124, -628); g.rotate(-.45); g.scale(.52, .52); babyHead(g, { cry: 0, eyes: 0 }); g.restore();
    strokePath(g, 'M 56 -676 C 96 -716 176 -706 200 -646', '#D8CCB2', 7);   // the hood's edge
  } });
}
