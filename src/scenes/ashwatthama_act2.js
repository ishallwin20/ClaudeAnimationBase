// ashwatthama_act2.js: CHIRANJEEVI Issue 1, Act 2 after the owl (pp. 16–29): Kripa's counsel, the being at the gate,
// Shiva, the night in the camp, Duryodhana's death, Draupadi. Load after ashwatthama_act1.js (person(), bust(), sil()).
MBH.krita = { skin: '#9C6A4A', skinSh: '#764C32', skinDk: '#40261A', lip: '#5E2C22', lipLo: '#7A3E30', hair: '#0E0A0C', hairLt: '#2A2024' };
MBH_DRESS.krita = { armor: '#2E3438', armorSh: '#16191C', armorLt: '#4E585E', cloth: '#3A5A3A', clothSh: '#1E321E' };
CAST.krita = { who: 'krita', bun: true, stache: 'full' };
CAST.kripa = { ...CAST.kripa, beard: 'short' };
const NIGHTFACE = { ...MOONLIT, tint: ['#16224A', .2] };
const LAMP = { tint: ['#2A1206', .15], edge: { col: '#FFD9A0', w: 2, a: .5 }, rim: { col: '#FFE0A8', dx: -6, dy: -2, a: .8, blur: 1 } };
const FIRELIT = { tint: ['#3A1406', .2], edge: { col: '#FFB070', w: 2.2, a: .7 }, rim: { col: '#FFE0A0', dx: 0, dy: -6, a: .9, blur: 1 } };
// Ashwatthama as a whole figure: o as mbhFigure, h the head's options; the gem's glow laid on after
function ashPerson(c, x, y, k, o, h, L, lo) {
  person(c, x, y, k, { who: 'ash', pal: ASH, dress: 'armor', ...o, head: (g) => ashHead(g, h || {}) }, L, lo);
  const up = o.legs === 'sit' ? 300 : 0; c.save(); c.translate(x, y + up * k); c.scale(k, k); ashGemGlow(c, o.glow ?? .9); c.restore();
}
// a tent of the camp, its peak at (x, y - 300k), the base on y
function tent(c, x, y, k, col = '#1A2030', lt = null) {
  c.save(); c.translate(x, y); c.scale(k, k);
  fillPath(c, 'M -220 0 C -180 -100 -60 -260 0 -300 C 60 -260 180 -100 220 0 Z', col);
  fillPath(c, 'M 0 -300 C 60 -260 180 -100 220 0 L 60 0 C 50 -100 30 -220 0 -300 Z', mixCol(col, '#000000', .35));
  if (lt) fillPath(c, 'M -40 0 C -30 -60 -10 -120 0 -140 C 10 -120 30 -60 40 0 Z', lt);
  strokePath(c, 'M 0 -300 L 0 -380', col, 6); fillPath(c, 'M 0 -380 L 50 -366 L 0 -350 Z', col);
  c.restore();
}
// a tiny Krishna, four-armed with conch and discus, for the crowds in the flames and the sky
function krishnaMini(c, x, y, k) {
  c.save(); c.translate(x, y); c.scale(k, k);
  mbhFigure(c, { ...CAST.krishna, arms: { l: 'up', r: 'up' } });
  chakra(c, 214, -1000, 46, 0, 1, 0); ellipse(c, -214, -1000, 30, 40, '#F4EEE2');
  c.restore();
}
// the being at the gate: towering, many-armed, a tiger skin dripping blood, a black antelope skin, a great snake for a
// sacred thread, eyes all over, flames from the mouth (feet at 0, 0; about 1500 tall)
function gateBeing(c, o = {}) {
  const SK = '#2A3448', SKd = '#18202E', t = o.t || 0;
  const W8 = ['sword', 'mace', 'disc', 'axe', 'spear', 'bow', 'noose', 'trident'];
  for (let i = 0; i < 8; i++) for (const s of [-1, 1]) {   // the arms, fanned out from the shoulders
    const a = -Math.PI / 2 + s * (.5 + i * .3), S = [s * 170, -1040], E = [S[0] + Math.cos(a) * 260 * (1 + i * .04), S[1] + Math.sin(a) * 200 + i * 30], Hn = [E[0] + Math.cos(a + s * .3) * 240, E[1] + Math.sin(a + s * .3) * 200];
    limb(c, [S, E, Hn], [80, 62, 48], i % 2 ? SK : SKd);
    ellipse(c, E[0], E[1], 34, 12, '#3A7A4A', a);   // a serpent armlet
    const w = W8[(i + (s > 0 ? 3 : 0)) % 8], wa = a + s * .3;
    c.save(); c.translate(Hn[0], Hn[1]); c.rotate(wa + Math.PI / 2);
    if (w === 'sword') fillPath(c, 'M -8 0 L 8 0 L 6 -220 L 0 -250 L -6 -220 Z', '#C8CED8');
    else if (w === 'mace') { strokePath(c, 'M 0 30 L 0 -160', '#8A5E1C', 12); ellipse(c, 0, -190, 40, 44, '#D9A441'); }
    else if (w === 'disc') { c.strokeStyle = '#FFD27A'; c.lineWidth = 10; c.beginPath(); c.arc(0, -80, 60, 0, TAU); c.stroke(); }
    else if (w === 'axe') { strokePath(c, 'M 0 30 L 0 -180', '#6A4A2A', 10); fillPath(c, 'M 0 -170 C 60 -190 90 -140 80 -100 C 50 -110 20 -110 0 -110 Z', '#C8CED8'); }
    else if (w === 'spear') { strokePath(c, 'M 0 60 L 0 -260', '#6A4A2A', 8); fillPath(c, 'M -14 -256 L 0 -330 L 14 -256 Z', '#C8CED8'); }
    else if (w === 'bow') { strokePath(c, 'M -10 -200 C 70 -100 70 100 -10 200', '#5A3418', 12); strokePath(c, 'M -10 -200 L -10 200', '#E8E0CC', 2); }
    else if (w === 'noose') { c.strokeStyle = '#B88A3E'; c.lineWidth = 8; c.beginPath(); c.ellipse(0, -80, 40, 60, 0, 0, TAU); c.stroke(); }
    else { strokePath(c, 'M 0 40 L 0 -220', '#9AA2AE', 8); for (const d of [-30, 0, 30]) fillPath(c, `M ${d - 8} -220 L ${d} -280 L ${d + 8} -220 Z`, '#9AA2AE'); }
    ellipse(c, 0, 0, 30, 28, SK);
    c.restore();
  }
  // legs and the tiger skin round the hips, dripping blood
  for (const s of [-1, 1]) limb(c, [[s * 80, -620], [s * 110, -320], [s * 120, -40]], [130, 100, 70], SKd);
  const TG = 'M -200 -700 C -230 -600 -240 -480 -230 -380 L -150 -400 L -120 -350 L -60 -400 L 0 -340 L 60 -400 L 120 -350 L 150 -400 L 230 -380 C 240 -480 230 -600 200 -700 Z';
  fillPath(c, TG, '#D88A35'); inside(c, TG, () => { for (let i = 0; i < 10; i++) strokePath(c, `M ${-200 + i * 44} -700 q 20 80 -6 180`, '#2E2018', 12); });
  for (let i = 0; i < 9; i++) { const x = -200 + i * 50, l = 40 + hash(i) * 90; limb(c, [[x, -380], [x + 2, -380 + l]], [12, 6], '#A01818'); }
  // the chest and the black antelope skin over the shoulders
  fillPath(c, 'M -230 -700 C -260 -860 -240 -1000 -170 -1060 L 170 -1060 C 240 -1000 260 -860 230 -700 Z', SK);
  fillPath(c, 'M -230 -1000 C -150 -1080 150 -1080 230 -1000 L 250 -900 C 120 -950 -120 -950 -250 -900 Z', '#14141A');
  for (let i = 0; i < 12; i++) ellipse(c, -200 + hash(i) * 400, -1010 + hash(i + 3) * 70, 8, 6, '#E8E0CC');
  // the great snake as the sacred thread, from the left shoulder (screen right) to the right hip
  limb(c, [[170, -1040], [80, -900], [-40, -780], [-170, -680]], [36, 34, 32, 26], '#2E6A3A');
  inside(c, 'M -300 -1100 L 300 -1100 L 300 -600 L -300 -600 Z', () => { for (let i = 0; i < 14; i++) { const u = i / 13; ellipse(c, lerp(170, -170, u), lerp(-1040, -680, u), 8, 5, '#8CBF97'); } });
  fillPath(c, 'M 170 -1040 C 210 -1070 250 -1060 250 -1030 C 230 -1020 200 -1020 180 -1020 Z', '#2E6A3A'); ellipse(c, 236, -1046, 4, 4, '#FFD040');
  // the head: a dark face, burning eyes, the mouth a furnace
  c.save(); c.translate(0, -1190); c.scale(2.6, 2.6); c.translate(0, 815);
  withSur({ ...SUR, skin: SK, skinSh: SKd, skinDk: '#0C1018', hair: '#0A0A10', hairLt: '#1A1A24', lip: '#1A0A0A', lipLo: '#2A0A0A', eyeW: '#FFD27A', iris: '#C81E0A', brow: '#05050A' }, () => {
    suryaHead(c, { crown: false, bun: false, curls: false, kundala: 'ring', tilak: false, fierce: 1, mouth: 1, eyes: 1 });
  });
  glow(c, 0, -760, 40, '#FF8A2A', 1); glow(c, 0, -762, 14, '#FFF0B0', 1);
  c.restore();
  // eyes everywhere, on the chest, the arms, the hips
  const rnd = lcg(77);
  for (let i = 0; i < 30; i++) { const x = (rnd() - .5) * 460, y = -1040 + rnd() * 680; ellipse(c, x, y, 22, 13, '#FFD27A'); ellipse(c, x, y, 8, 10, '#C81E0A'); ellipse(c, x, y, 4, 5, '#100404'); }
}
function beingFlames(c, x, y, k, t) {
  c.save(); c.translate(x, y); c.scale(k, k); c.globalCompositeOperation = 'lighter';
  for (const [col, sc] of [['#C8321A', 1], ['#FF7A22', .75], ['#FFD04A', .5], ['#FFF3C4', .25]]) for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * .3, l = 420 * sc * (.7 + .3 * Math.sin(i * 2.1 + t)), w = 40 * sc + 20;
    c.fillStyle = rgba(col, .7); c.beginPath(); c.moveTo(-w, 0); c.quadraticCurveTo(Math.cos(a) * l * .5 - w, Math.sin(a) * l * .5, Math.cos(a) * l, Math.sin(a) * l); c.quadraticCurveTo(Math.cos(a) * l * .5 + w, Math.sin(a) * l * .5, w, 0); c.closePath(); c.fill();
  }
  c.restore();
}

// ---------- p16 · "How can I sleep?" ----------
const BANYAN_NIGHT = (c, P) => {
  sky(c, [[0, '#060A16'], [P.h, '#141C34']]);
  glow(c, P.w * .8, 0, 520, '#7F97CC', .35);
  for (let i = 0; i < 9; i++) { const x = 30 + i * (P.w / 9) + hash(i) * 30; strokePath(c, `M ${x} -10 C ${x + 8} ${P.h * .3} ${x - 6} ${P.h * .5} ${x + 4} ${P.h * (.5 + hash(i + 1) * .4)}`, '#0A0C16', 3 + (i % 3) * 2); }
};
ART.wakeThem = (c, P) => {
  BANYAN_NIGHT(c, P);
  // his POV: the two of them sitting up, not meeting his eyes
  bust(c, 330, 440, 1.9, { ...CAST.kripa, dress: 'armor', eyes: .3, look: [.3, 1], pain: .6 }, NIGHTFACE, { k: 1.2 });
  bust(c, 720, 460, 1.9, { ...CAST.krita, dress: 'armor', eyes: .3, look: [-.3, 1], pain: .5 }, NIGHTFACE, { k: 1.2 });
};
ART.kripaAdvice = (c, P) => {
  BANYAN_NIGHT(c, P);
  bust(c, P.w * .3, 420, 2, { ...CAST.kripa, dress: 'armor', eyes: .9, look: [.4, 0], pain: .45, smile: 0 }, NIGHTFACE, { k: 1.3 });
};
ART.ashRefuse = (c, P) => {
  sky(c, [[0, '#04050A'], [P.h, '#0C1224']]);
  glow(c, 200, 80, 420, '#5E76AE', .3);
  bust(c, 300, 420, 2.5, { ash: true, eyes: 1, fierce: 1, pain: .45, mouth: .25, look: [.3, 0], glow: .45 }, NIGHTFACE, { k: 1.5 });
  for (const s of [-1, 1]) { c.save(); at(c, 300, 420, 2.5, -815); ellipse(c, s * 19, -812, 9, 2, rgba('#DDEEFF', .7)); c.restore(); }   // the eyes wet
};
ART.kripaWarn = (c, P) => {
  BANYAN_NIGHT(c, P);
  bust(c, 230, 420, 1.8, { ...CAST.kripa, dress: 'armor', eyes: 1, look: [.9, 0], pain: .7 }, NIGHTFACE, { k: 1.2 });
  figure(c, (f) => { sil(f, 820, P.h * .98, .3, true, (g) => manSil(g, { pose: 'walk', head: 'knot', prop: 'bow', quiver: true })); sil(f, 700, P.h * .98, .29, true, (g) => manSil(g, { pose: 'walk', head: 'knot' })); }, lit(NIGHTSIL));
};

// ---------- p17 · the being at the gate ----------
ART.gateBeing = (c, P) => {
  sky(c, [[0, '#0A0204'], [P.h * .5, '#3A0A06'], [P.h, '#0A0304']]);
  glow(c, P.w * .5, P.h * .32, 700, '#FF6A1A', .5);
  glow(c, P.w * .5, P.h * .2, 300, '#FFD27A', .5);   // bright as the sun and the moon
  // the Krishnas pouring out of its flames, all round it
  const rnd = lcg(5);
  beingFlames(c, P.w * .5, 330, .9, 1);
  figure(c, (f) => { for (let i = 0; i < 46; i++) { const a = rnd() * TAU, d = 300 + rnd() * 340; krishnaMini(f, P.w * .5 + Math.cos(a) * d * 1.1, 330 + Math.sin(a) * d * .9 + 60, .05 + rnd() * .04); } }, lit({ tint: ['#3A1406', .25], edge: { col: '#FFD9A0', w: 1.2, a: .5 }, rim: { col: '#FFF0C0', dx: 0, dy: -2, a: .8 } }, { inkW: 1.2 }));
  figure(c, (f) => { f.save(); f.translate(P.w * .5, P.h * .96); f.scale(.6, .6); gateBeing(f); f.restore(); }, lit(FIRELIT));
  // Ashwatthama, small, before it
  figure(c, (f) => sil(f, P.w * .5 - 40, P.h * 1.0, .2, false, (g) => manSil(g, { pose: 'draw', head: 'knot', prop: 'bow' })), lit(SILW));
};

// ---------- p18 · nothing touches it ----------
function beingFace(c, x, y, k) {
  c.save(); c.translate(x, y); c.scale(k, k);
  withSur({ ...SUR, skin: '#2A3448', skinSh: '#18202E', skinDk: '#0C1018', hair: '#0A0A10', hairLt: '#1A1A24', lip: '#1A0A0A', lipLo: '#2A0A0A', eyeW: '#FFD27A', iris: '#C81E0A', brow: '#05050A' }, () => { c.translate(0, 815); suryaHead(c, { crown: false, bun: false, curls: false, kundala: 'ring', tilak: false, fierce: 1, mouth: 1, eyes: 1 }); });
  c.restore();
}
ART.arrowsEaten = (c, P) => {
  sky(c, [[0, '#1A0404'], [P.h, '#0A0202']]);
  figure(c, (f) => beingFace(f, P.w * .58, P.h * .5, 5.2), lit(FIRELIT, { k: 1.4 }));
  beingFlames(c, P.w * .58, P.h * .5 + 50 * 5.2 * 0 + 230, .5, 2);
  const mx = P.w * .58, my = P.h * .5 + 44 * 5.2;
  for (let i = 0; i < 6; i++) { const y0 = P.h * .6 + i * 40, x0 = -10 + i * 12, a = Math.atan2(my - y0, mx - x0), L = 150, tx = x0 + Math.cos(a) * (Math.hypot(mx - x0, my - y0) - 70 - i * 18), ty = y0 + Math.sin(a) * (Math.hypot(mx - x0, my - y0) - 70 - i * 18); strokePath(c, `M ${tx - Math.cos(a) * L} ${ty - Math.sin(a) * L} L ${tx} ${ty}`, '#C8B890', 4); c.save(); c.translate(tx, ty); c.rotate(a); fillPath(c, 'M 0 -6 L 22 0 L 0 6 Z', '#9AA2AE'); fillPath(c, `M ${-L} 0 L ${-L - 16} -10 L ${-L - 6} 0 L ${-L - 16} 10 Z`, '#B8402A'); c.restore(); }
};
ART.spearBreaks = (c, P) => {
  sky(c, [[0, '#2A0806'], [P.h, '#0A0202']]);
  glow(c, P.w * .62, P.h * .5, 260, '#FFF0B0', .9); glow(c, P.w * .62, P.h * .5, 120, '#FFFFFF', .9);
  const rnd = lcg(3);
  for (let i = 0; i < 14; i++) { const a = rnd() * TAU, d = 60 + rnd() * 220; c.save(); c.translate(P.w * .62 + Math.cos(a) * d, P.h * .5 + Math.sin(a) * d); c.rotate(a + rnd()); fillPath(c, 'M -40 -6 L 40 -4 L 46 4 L -40 6 Z', i % 3 ? '#5A3A20' : '#C8CED8'); c.restore(); }
  strokePath(c, `M -20 ${P.h * .7} L ${P.w * .42} ${P.h * .56}`, '#5A3A20', 12);
};
ART.swordGone = (c, P) => {
  sky(c, [[0, '#1A0806'], [P.h, '#0A0202']]);
  c.fillStyle = '#2A3448'; c.fillRect(P.w * .66, 0, P.w, P.h);   // its skin
  for (let i = 0; i < 6; i++) { const x = P.w * .74 + hash(i) * 90, y = 120 + i * 90 + hash(i + 2) * 30; ellipse(c, x, y, 26, 15, '#FFD27A'); ellipse(c, x, y, 10, 12, '#C81E0A'); ellipse(c, x, y, 5, 6, '#100404'); strokePath(c, `M ${x - 30} ${y - 4} Q ${x} ${y - 26} ${x + 30} ${y - 4}`, '#0C1018', 4); }
  // the blade coming apart into tufts of cotton where it touches
  c.save(); c.translate(0, P.h * .56); c.rotate(-.12);
  fillPath(c, 'M -20 -12 L 250 -12 L 250 12 L -20 12 Z', '#C8CED8'); strokePath(c, 'M -20 -2 L 250 -2', '#F2F6FF', 3);
  fillPath(c, 'M -40 -40 L -26 -40 L -26 40 L -40 40 Z', '#D9A441');
  for (let i = 0; i < 16; i++) { const x = 240 + i * 6 + hash(i) * 40, y = (hash(i + 4) - .5) * 60 * (1 + i * .1); glow(c, x, y, 18, '#FFFFFF', .5, 'source-over'); ellipse(c, x, y, 9 + hash(i) * 8, 7 + hash(i + 1) * 6, '#F4F0E8'); }
  c.restore();
};
ART.skyKrishnas = (c, P) => {
  sky(c, [[0, '#1A0A2A'], [P.h, '#06040C']]);
  glow(c, P.w * .5, 0, 600, '#3A5AA8', .5);
  const rnd = lcg(9);
  figure(c, (f) => { for (let i = 0; i < 40; i++) krishnaMini(f, rnd() * P.w, 40 + rnd() * P.h * .5, .06 + rnd() * .05); }, lit({ tint: ['#0A1030', .2], edge: { col: '#D4E0FA', w: 1.2, a: .5 }, rim: { col: '#EAF1FF', dx: 0, dy: -2, a: .8 } }, { inkW: 1.1 }));
  bust(c, P.w * .3, 600, 1.55, { ash: true, eyes: 1, look: [0, -1], pain: .9, fierce: 0, mouth: .3, glow: .4 }, NIGHTFACE, { k: 1.3 });
};

// ---------- p19 · he offers himself ----------
ART.praise = (c, P) => {
  sky(c, [[0, '#08060E'], [P.h, '#1A1020']]);
  glow(c, P.w * .5, P.h * .55, 380, '#C87A3A', .25);
  c.fillStyle = '#0C0A10'; c.fillRect(0, P.h * .9, P.w, P.h);
  ashPerson(c, P.w * .5, P.h * .94, .6, { legs: 'sit', arms: { l: 'namaste', r: 'namaste' } }, { eyes: 0, pain: .3 }, { ...NIGHTFACE, rim: { col: '#FFD8A0', dx: 0, dy: -5, a: .8, blur: 1 } });
};
ART.intoFire = (c, P) => {
  sky(c, [[0, '#0A0204'], [P.h, '#1A0604']]);
  glow(c, P.w * .5, P.h * .7, 520, '#FF8A2A', .55);
  // strange beings crowding in the dark
  figure(c, (f) => { const rnd = lcg(14); for (let i = 0; i < 9; i++) { const x = i < 5 ? 40 + i * 70 : P.w - 40 - (i - 5) * 70; sil(f, x, P.h * (.98 + rnd() * .04), .2 + rnd() * .1, x > P.w / 2, (g) => { manSil(g, { pose: rnd() < .5 ? 'raise' : 'shout', head: ['hood', 'turban', 'bare', 'knot'][i % 4] }); ellipse(g, -10, -860, 40 + rnd() * 40, 20, '#0C0A10'); }); } }, lit({ tint: ['#140604', .9], edge: { col: '#FF9A50', w: 1.4, a: .6 }, rim: { col: '#FFC080', dx: 0, dy: -3, a: .8 } }));
  yagna(c, P.w * .5, P.h * .98, 460, 2, .8);
  ashPerson(c, P.w * .5, P.h * .9, .56, { arms: { l: 'up', r: 'up' } }, { eyes: .5, pain: .2, look: [0, -1] }, FIRELIT);
  pyre(c, P.w * .5, P.h * .96, 300, 3, .9);
};

// ---------- p20 · Shiva ----------
ART.shivaAppears = (c, P) => {
  sky(c, [[0, '#0A0204'], [P.h, '#2A0A04']]);
  glow(c, 300, P.h * .5, 520, '#FF8A2A', .6);
  yagna(c, 300, P.h * 1.02, 520, 2, .7);
  figure(c, (f) => { f.save(); f.translate(300, P.h * .98); f.scale(.6, .6); shiva(f, { eyes: 1, look: [.6, .2], arm: 'abhaya', trishul: true, t: 1 }); f.restore(); }, lit({ ...FIRELIT, tint: ['#3A1406', .1] }));
  pyre(c, 300, P.h * 1.02, 300, 3, .7);
};
ART.shivaTime = (c, P) => {
  sky(c, [[0, '#1A0604'], [P.h, '#0A0204']]);
  glow(c, P.w * .5, P.h * .7, 340, '#FF8A2A', .4);
  figure(c, (f) => { at(f, P.w * .5, 430, 2.2, -815); shivaHead(f, { eyes: .8, look: [0, 0], third: .3 }); }, lit(FIRELIT, { k: 1.4 }));
};
ART.swordGiven = (c, P) => {
  sky(c, [[0, '#2A0A04'], [P.h, '#0A0204']]);
  glow(c, P.w * .5, P.h * .55, 380, '#FFD27A', .7);
  rays(c, P.w * .5, P.h * .55, { n: 12, dir: -Math.PI / 2, spread: 3, len: 520, w: 140, col: '#FFE7A6', a: .5, t: 1, seed: 6 });
  // the sword held up before him, blazing
  c.save(); c.translate(P.w * .76, P.h * .98); c.rotate(-.1); fillPath(c, 'M -12 0 L 12 0 L 10 -440 L 0 -480 L -10 -440 Z', '#E8EEF8'); glow(c, 0, -240, 120, '#FFFFFF', .5); fillPath(c, 'M -46 -6 L 46 -6 L 40 10 L -40 10 Z', '#D9A441'); c.restore();
  bust(c, P.w * .42, 470, 1.6, { ash: true, eyes: 1, fierce: .8, pain: 0, look: [0, -.3], glow: 1.4 }, { ...FIRELIT, tint: ['#5A3006', .25], rim: { col: '#FFF4D0', dx: 0, dy: -7, a: 1, blur: 1 } }, { k: 1.3 });
};

// ---------- p21 · into the camp ----------
ART.noGate = (c, P) => {
  nightSky(c, P.w, P.h, { stops: [[0, '#04060E'], [P.h * .6, '#141E3A'], [P.h, '#06070C']] });
  moon(c, 860, 120, 44, 1);
  for (let i = 0; i < 6; i++) tent(c, 120 + i * 170, P.h * .74, .55 - (i % 2) * .08, '#141A2A', i === 2 ? rgba('#FFB050', .5) : null);
  // the palisade, with a gap
  for (let x = 0; x < P.w; x += 26) { if (x > 610 && x < 760) continue; fillPath(c, `M ${x} ${P.h} L ${x} ${P.h * .7 + hash(x) * 20} L ${x + 9} ${P.h * .68 + hash(x) * 20} L ${x + 18} ${P.h * .7 + hash(x) * 20} L ${x + 18} ${P.h} Z`, '#0A0C14'); }
  ashPerson(c, 690, P.h * .98, .46, { arms: { l: 'down', r: [[200, -600], [230, -480]] }, props: { r: 'sword' }, swordA: .4 }, { eyes: 1, fierce: .7, look: [-.6, 0] }, NIGHTFACE);
};
ART.dhrSleep = (c, P) => {
  sky(c, [[0, '#2A1608'], [P.h, '#120A04']]);
  glow(c, P.w * .85, P.h * .2, 300, '#FFB060', .4);
  // white silk, seen from above, a pillow, flowers scattered
  fillPath(c, `M 40 ${P.h * .36} L ${P.w - 20} ${P.h * .32} L ${P.w + 40} ${P.h} L -40 ${P.h} Z`, '#EEE8DC');
  for (let i = 0; i < 6; i++) strokePath(c, `M ${60 + i * 80} ${P.h * .4} C ${80 + i * 80} ${P.h * .6} ${40 + i * 90} ${P.h * .8} ${30 + i * 100} ${P.h}`, rgba('#C8BCA8', .7), 3);
  ellipse(c, 230, P.h * .52, 170, 90, '#F6F2EA');
  for (let i = 0; i < 12; i++) { const x = 60 + hash(i) * (P.w - 100), y = P.h * .4 + hash(i + 7) * P.h * .55; for (let k = 0; k < 5; k++) ellipse(c, x + Math.cos(k * 1.26) * 7, y + Math.sin(k * 1.26) * 7, 6, 4, i % 2 ? '#F2C8D0' : '#F8E8A0', k * 1.26); ellipse(c, x, y, 3, 3, '#D8A030'); }
  figure(c, (f) => {
    f.save(); f.translate(240, P.h * .54); f.rotate(-Math.PI / 2 + .25); f.scale(1.25, 1.25); f.translate(0, 815); mbhHead(f, { ...CAST.dhrish, eyes: 0, pain: 0, crown: false, bun: true }); f.restore();
    fillPath(f, `M 290 ${P.h * .4} C 400 ${P.h * .36} ${P.w} ${P.h * .44} ${P.w + 20} ${P.h * .6} L ${P.w + 20} ${P.h * .9} C 400 ${P.h * .86} 330 ${P.h * .7} 290 ${P.h * .62} Z`, '#E6DCC8');   // his body under the silk
  }, lit(LAMP, { k: 1.2 }));
  for (let i = 0; i < 3; i++) strokePath(c, `M ${P.w - 60 + i * 10} ${P.h * .3} C ${P.w - 80} ${P.h * .2} ${P.w - 40} ${P.h * .14} ${P.w - 70 + i * 12} 30`, rgba('#D8D0C0', .35), 3);   // incense
};
ART.kickWake = (c, P) => {
  sky(c, [[0, '#2A1608'], [P.h, '#120A04']]);
  fillPath(c, `M 0 0 L ${P.w} 0 L ${P.w} ${P.h} L 0 ${P.h} Z`, '#E6DCC8');
  figure(c, (f) => { f.save(); f.translate(P.w * .42, P.h * .62); f.rotate(-Math.PI / 2 + .25); f.scale(2.2, 2.2); f.translate(0, 815); mbhHead(f, { ...CAST.dhrish, eyes: 1, look: [0, -1], pain: .3, fierce: .2, crown: false, bun: true }); f.restore(); }, lit(LAMP, { k: 1.3 }));
  // a foot pressing his shoulder, from above
  figure(c, (f) => { f.save(); f.translate(P.w * .62, -30); f.rotate(.15); limb(f, [[60, -40], [40, 220]], [96, 74], '#0C0A10'); fillPath(f, 'M 0 200 C -10 250 -60 280 -150 290 C -180 292 -190 270 -170 258 C -110 240 -60 220 -40 190 Z', '#0C0A10'); fillPath(f, 'M -6 196 C 20 230 60 260 80 250 L 84 200 Z', '#0C0A10'); f.restore(); }, lit({ tint: ['#0C0604', .9], edge: { col: '#FFD9A0', w: 1.6, a: .6 }, rim: { col: '#9FE4FF', dx: 0, dy: 3, a: .8 } }));
};

// ---------- p22 · "kill me with a weapon" ----------
ART.dhrPinned = (c, P) => {
  sky(c, [[0, '#1A0E06'], [P.h, '#0A0604']]);
  glow(c, 260, P.h * .4, 380, '#7FD8FF', .25);
  figure(c, (f) => { f.save(); f.translate(280, P.h * .62); f.rotate(.35); f.scale(2.3, 2.3); f.translate(0, 815); mbhHead(f, { ...CAST.dhrish, eyes: 1, look: [.6, -1], pain: .9, mouth: .8, crown: false, bun: true }); f.restore(); }, lit({ ...LAMP, rim: { col: '#CFF0FF', dx: 4, dy: -6, a: .8, blur: 1 } }, { k: 1.4 }));
  // a fist in his hair
  figure(c, (f) => { f.save(); f.translate(356, 92); f.rotate(.35); limb(f, [[-40, -40], [-180, -220]], [90, 80], ASH.armor); fillPath(f, 'M -60 -40 C -66 -80 -20 -96 30 -80 C 70 -66 80 -20 60 10 C 30 30 -40 26 -60 -40 Z', ASH.skin); for (let i = 0; i < 4; i++) { const x = -40 + i * 26; limb(f, [[x, 0], [x + 4, 34], [x - 6, 54]], [22, 19, 15], ASH.skin); strokePath(f, `M ${x + 10} 6 l 2 26`, ASH.skinDk, 2); } f.restore(); }, lit(LAMP));
};
ART.ashAnswer = (c, P) => {
  sky(c, [[0, '#06040A'], [P.h, '#1A0E06']]);
  bust(c, P.w * .74, 370, 1.9, { ash: true, eyes: 1, fierce: 1, pain: 0, look: [-.6, .6], glow: .55 }, { tint: ['#0A0610', .35], edge: { col: '#FFD9A0', w: 2, a: .5 }, rim: { col: '#9FE4FF', dx: 0, dy: 8, a: .9, blur: 1 } }, { k: 1.5 });
};
ART.black = (c, P) => { c.fillStyle = '#000'; c.fillRect(0, 0, P.w, P.h); };
