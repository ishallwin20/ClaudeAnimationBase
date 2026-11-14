// ashwatthama_act3.js: CHIRANJEEVI Issue 1, Act 3 (the discus, the blade of grass, the two weapons, the sages, the gem,
// the curse). Load after ashwatthama_act2.js.
MBH.vyasa = { skin: '#5E3E2C', skinSh: '#462C1E', skinDk: '#2A1810', lip: '#4A2420', lipLo: '#5E3028', hair: '#3A3430', hairLt: '#6A625A', brow: '#2A2420', bead: '#5E2F1B' };
MBH_DRESS.vyasa = { cloth: '#C8822A', clothSh: '#8A5418' };
MBH_SKIRT.vyasa = '#C8822A';
CAST.vyasa = { who: 'vyasa', bun: true, beard: 'long', age: .8, longHair: true, tilak: 'tripundra', dress: 'bare' };
MBH.narada = { skin: '#D0A07A', skinSh: '#A87A58', skinDk: '#6A4A34', lip: '#8A4A3A', lipLo: '#A85A48', hair: '#E8E2D8', hairLt: '#FFFFFF', brow: '#C8C0B4' };
MBH_DRESS.narada = { cloth: '#F0E8D8', clothSh: '#B8AC98' };
MBH_SKIRT.narada = '#F0E8D8';
CAST.narada = { who: 'narada', bun: true, beard: 'short', age: .4, dress: 'bare', tilak: 'namam' };
// Ashwatthama by the Ganga: a cloth of kusha grass, his hair full of dust
const ASHG = { ...ASH, cloth: '#A8A060', clothSh: '#6E6A38', hair: '#2E2824', hairLt: '#4A423C' };
const DAY = { tint: ['#2A1A10', .08], edge: { col: '#FFF0D0', w: 2, a: .5 }, rim: { col: '#FFF6E0', dx: 6, dy: -4, a: .8, blur: 1 } };
const BLAZE = { tint: ['#3A1406', .15], edge: { col: '#FFD9A0', w: 2, a: .6 }, rim: { col: '#FFF0C0', dx: 0, dy: -6, a: .9, blur: 1 } };
const ashG = (c, x, y, k, h, L, lo = {}) => { bust(c, x, y, k, { who: 'ash', pal: ASHG, dress: 'bare', head: (g) => ashHead(g, { ...h, pal: undefined }) }, L, lo); if (h.gem !== false) { c.save(); at(c, x, y, k, -815); ashGemGlow(c, h.glow ?? .5); c.restore(); } };
function riverBank(c, P, o = {}) {
  sky(c, o.stops || [[0, '#8AA8C8'], [P.h * .5, '#E8D8B8'], [P.h, '#5A4A3A']]);
  fillPath(c, `M 0 ${P.h * .48} L ${P.w} ${P.h * .44} L ${P.w} ${P.h * .62} L 0 ${P.h * .66} Z`, '#7A98B0');
  for (let i = 0; i < 10; i++) strokePath(c, `M ${hash(i) * P.w} ${P.h * (.5 + hash(i + 2) * .12)} l ${60 + hash(i + 3) * 80} 0`, rgba('#E8F0F8', .6), 2);
  c.fillStyle = '#8A7458'; c.beginPath(); c.moveTo(0, P.h * .66); c.lineTo(P.w, P.h * .62); c.lineTo(P.w, P.h); c.lineTo(0, P.h); c.fill();
}
function hand(c, x, y, k, a, col, o = {}) {   // a hand, fingers curled round something at (x, y), pointing along a
  c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k);
  if (o.arm) limb(c, [[-260, 0], [-40, 0]], [90, 72], o.arm);
  ellipse(c, 0, 0, 46, 40, col);
  for (let i = 0; i < 4; i++) { limb(c, [[20, -30 + i * 20], [50, -32 + i * 20], [44, -14 + i * 20]], [20, 17, 14], col); }
  limb(c, [[-10, -34], [20, -52], [36, -40]], [22, 18, 15], col);
  c.restore();
}

// ---------- p30 · the discus ----------
ART.krishnaTells = (c, P) => {
  sky(c, [[0, '#7A9AB8'], [P.h, '#E8C8A0']]);
  for (let i = 0; i < 8; i++) strokePath(c, `M ${P.w} ${60 + i * 40} l -${200 + hash(i) * 300} 0`, rgba('#FFFFFF', .35), 3);   // speed
  bust(c, 230, 270, 1.25, { ...CAST.krishna, eyes: 1, look: [.6, 0], pain: .1 }, DAWNL);
};
const WARMPAST = (c, P) => { sky(c, [[0, '#E8B870'], [P.h, '#8A4A1A']]); glow(c, P.w * .5, P.h * .4, 360, '#FFF0C0', .5); };
ART.liftLeft = (c, P) => {
  WARMPAST(c, P);
  chakra(c, P.w * .55, P.h * .58, 150, .3, 1, 0);
  figure(c, (f) => hand(f, P.w * .55 - 150, P.h * .58, .9, 0, ASH.skin, { arm: ASH.armorSh }), lit(WARM));
};
ART.liftAll = (c, P) => {
  WARMPAST(c, P);
  bust(c, P.w * .5, 330, 1.7, { ash: true, eyes: .6, fierce: 1, pain: .8, mouth: .5, look: [0, .6], glow: .5 }, WARM);
  chakra(c, P.w * .5, P.h * .88, 170, .3, 1, 0);
  figure(c, (f) => { hand(f, P.w * .5 - 170, P.h * .88, .8, 0, ASH.skin, { arm: ASH.armorSh }); hand(f, P.w * .5 + 170, P.h * .88, .8, Math.PI, ASH.skin, { arm: ASH.armorSh }); }, lit(WARM));
};
ART.krishnaRash = (c, P) => {
  sky(c, [[0, '#7A9AB8'], [P.h, '#E8C8A0']]);
  bust(c, 230, 270, 1.25, { ...CAST.krishna, eyes: .8, look: [.4, 0], smile: .25, pain: 0 }, DAWNL);
};

// ---------- p31–32 · the blade of grass ----------
ART.gangaBank = (c, P) => {
  riverBank(c, P);
  figure(c, (f) => { for (const [x, k] of [[90, .26], [170, .24], [250, .25]]) sil(f, x, P.h * .78, k, true, (g) => rishi(g, { pose: 'sit' })); }, lit({ tint: ['#3A2A1C', .6], edge: { col: '#FFF0D0', w: 1.2, a: .5 }, rim: { col: '#FFF6E0', dx: 3, dy: -3, a: .7 } }));
  person(c, 410, P.h * .98, .5, { ...CAST.vyasa, legs: 'sit', arms: { l: 'down', r: 'forward' }, eyes: .7, look: [.6, 0] }, DAY);
  person(c, 760, P.h * 1.02, .58, { who: 'ash', pal: ASHG, dress: 'bare', skirt: '#A8A060', legs: 'sit', arms: { l: 'down', r: 'down' }, head: (g) => ashHead(g, { eyes: .9, look: [-.5, 0], pain: .3 }) }, DAY);
  c.save(); c.translate(760, P.h * 1.02 + 0); c.scale(.58, .58); ashGemGlow(c, .5); c.restore();
};
ART.bhimaStop = (c, P) => {
  riverBank(c, P);
  person(c, 380, P.h * 1.5, .7, { ...CAST.bhima, dress: 'armor', fierce: 1, pain: 0, mouth: 1, look: [.6, 0], arms: { l: 'bow', r: 'draw' }, props: { l: 'bow' }, drawTo: [70, -706] }, DAY);
};
ART.grass = (c, P) => {
  sky(c, [[0, '#B8A888'], [P.h, '#6A5A44']]);
  for (let i = 0; i < 40; i++) { const x = hash(i) * P.w; strokePath(c, `M ${x} ${P.h} q ${(hash(i + 1) - .5) * 30} -${80 + hash(i + 2) * 120} ${(hash(i + 3) - .5) * 60} -${120 + hash(i + 4) * 160}`, i % 2 ? '#7A8A3A' : '#5A6A2A', 4); }
  strokePath(c, `M ${P.w * .5} ${P.h * .62} q 10 -120 -20 -260`, '#9AAA4A', 7);
  figure(c, (f) => hand(f, P.w * .5, P.h * .6, 1.6, -Math.PI / 2 - .1, ASH.skin, { arm: ASH.skinSh }), lit(DAY));
};
ART.apandavaya = (c, P) => {
  sky(c, [[0, '#E8C8A0'], [P.h, '#8A5A3A']]);
  bust(c, P.w * .5, 330, 3.6, { who: 'ash', pal: ASHG, dress: 'bare', head: (g) => ashHead(g, { eyes: 1, fierce: 1, mouth: 1, look: [0, 0] }) }, DAY, { k: 1.8 });
};
ART.grassFire = (c, P) => {
  sky(c, [[0, '#3A1406'], [P.h, '#0A0302']]);
  glow(c, P.w * .5, P.h * .4, 520, '#FF7A22', .7); glow(c, P.w * .5, P.h * .4, 200, '#FFF0B0', .8);
  beingFlames(c, P.w * .5, P.h * .5, .9, 4);
  figure(c, (f) => hand(f, P.w * .5, P.h * .62, 1.2, -Math.PI / 2, ASH.skin, { arm: ASH.skinSh }), lit(FIRELIT));
};

// ---------- p33 · Arjuna answers ----------
ART.krishnaNow = (c, P) => {
  riverBank(c, P);
  bust(c, 780, 520, 1.5, { ...CAST.arjuna, dress: 'armor', eyes: 1, fierce: .5, look: [-.7, 0] }, DAY);
  bust(c, 260, 470, 1.8, { ...CAST.krishna, eyes: 1, fierce: .5, pain: 0, look: [.7, 0] }, DAY, { k: 1.2 });
};
ART.arjunaPeace = (c, P) => {
  riverBank(c, P);
  person(c, P.w * .5, P.h * 1.7, .8, { ...CAST.arjuna, dress: 'armor', eyes: 0, pain: 0, arms: { l: 'namaste', r: 'namaste' } }, DAY);
};
ART.arjunaRelease = (c, P) => {
  sky(c, [[0, '#3A2A4A'], [P.h, '#C87A3A']]);
  glow(c, P.w * .2, P.h * .62, 200, '#FFF0B0', .8);
  person(c, P.w * .5, P.h * 1.7, .8, { ...CAST.arjuna, dress: 'armor', eyes: 1, fierce: .8, pain: 0, look: [-.8, 0], arms: { l: 'bow', r: 'draw' }, props: { l: 'bow' }, drawTo: [70, -706] }, BLAZE);
};
ART.twoFires = (c, P) => {
  sky(c, [[0, '#0A0204'], [P.h * .5, '#3A0A06'], [P.h, '#0A0204']]);
  ridge(c, P.h * .7, 160, 7, '#1A0806', { freq: .004, x0: -20, x1: P.w + 20, bottom: P.h + 20 });
  for (const [x, y] of [[P.w * .26, P.h * .44], [P.w * .74, P.h * .44]]) { glow(c, x, y, 420, '#FF5A1A', .7); glow(c, x, y, 220, '#FFB040', .9); glow(c, x, y, 100, '#FFFFFF', 1); }
  for (let i = 0; i < 14; i++) { const x = hash(i) * P.w, y = hash(i + 4) * P.h * .4; strokePath(c, `M ${x} ${y} l ${-80 - hash(i) * 60} ${-120}`, rgba('#FFD08A', .8), 4); glow(c, x, y, 18, '#FFF0C0', .9); }
  fillPath(c, `M 0 ${P.h * .78} L ${P.w} ${P.h * .76} L ${P.w} ${P.h * .84} L 0 ${P.h * .86} Z`, '#5A2010');   // the river, burning
  cracks(c, P.w * .5, P.h * .92, 1, 1, 9);
};
ART.sagesBetween = (c, P) => {
  sky(c, [[0, '#1A0604'], [P.h, '#3A1006']]);
  glow(c, 0, P.h * .5, 400, '#FF5A1A', .7); glow(c, P.w, P.h * .5, 400, '#FF5A1A', .7);
  glow(c, P.w * .5, P.h * .5, 360, '#FFE7A6', .5);
  person(c, P.w * .38, P.h * 1.2, .72, { ...CAST.narada, eyes: 1, pain: 0, smile: .1, arms: { l: 'down', r: 'up' } }, BLAZE);
  person(c, P.w * .62, P.h * 1.2, .72, { ...CAST.vyasa, eyes: 1, pain: 0, arms: { l: 'up', r: 'down' } }, BLAZE);
};
ART.sagesSpeak = (c, P) => {
  sky(c, [[0, '#2A0A06'], [P.h, '#1A0604']]);
  glow(c, P.w * .5, P.h, 500, '#FFB060', .4);
  bust(c, 190, 450, 1.5, { ...CAST.narada, eyes: 1, pain: 0, look: [.5, 0] }, BLAZE);
  bust(c, 840, 450, 1.5, { ...CAST.vyasa, eyes: 1, pain: 0, look: [-.5, 0] }, BLAZE);
};

// ---------- p35–36 · the weapon that won't come back ----------
ART.arjunaWithdraws = (c, P) => {
  sky(c, [[0, '#2A1A3A'], [P.h, '#5A3A2A']]);
  person(c, 330, P.h * 1.35, .78, { ...CAST.arjuna, dress: 'armor', eyes: .3, pain: .2, arms: { l: 'bow', r: 'down' }, props: { l: 'bow' } }, BLAZE);
  for (let i = 0; i < 6; i++) { const a = i * .5; strokePath(c, `M ${900 - i * 40} ${120 + i * 50} C ${700} ${200 + i * 40} ${560} ${300} ${430} ${P.h * .45}`, rgba('#FFC060', .7 - i * .08), 14 - i * 1.5); }
  glow(c, 430, P.h * .45, 90, '#FFF0B0', .9);
};
ART.ashStrains = (c, P) => {
  sky(c, [[0, '#3A0A06'], [P.h, '#0A0202']]);
  beingFlames(c, P.w * .5, 40, .6, 5);
  ashG(c, P.w * .5, 430, 1.75, { eyes: .5, fierce: 1, pain: .9, mouth: .4, look: [0, -1] }, FIRELIT, { k: 1.3 });
};
ART.ashCant = (c, P) => {
  riverBank(c, P);
  ashG(c, P.w * .5, 450, 1.7, { eyes: 1, pain: 1, fierce: 0, mouth: .3, look: [.4, -.2] }, DAY, { k: 1.3 });
};
ART.vyasaGem = (c, P) => {
  riverBank(c, P);
  bust(c, P.w * .5, 450, 1.7, { ...CAST.vyasa, eyes: 1, fierce: .7, pain: 0, look: [-.4, 0] }, DAY, { k: 1.3 });
};
ART.ashGemHand = (c, P) => {
  riverBank(c, P);
  ashG(c, P.w * .5, 440, 1.75, { eyes: .6, pain: .6, look: [0, -1], glow: .9 }, DAY, { k: 1.3 });
  figure(c, (f) => hand(f, P.w * .5 + 70, 440 - 70 * 1.75, .9, Math.PI + .5, ASH.skin, { arm: ASH.skinSh }), lit(DAY));
};
ART.ashTurns = (c, P) => {
  sky(c, [[0, '#5A3A2A'], [P.h, '#2A1A14']]);
  ashG(c, P.w * .5, 420, 1.6, { gem: false, eyes: 1, fierce: 1, pain: .2, look: [0, 0] }, DAY, { k: 1.3 });
  for (const [x, a] of [[110, -.3], [P.w - 110, Math.PI + .3]]) figure(c, (f) => hand(f, x, P.h * .86, 1, a - Math.PI / 2, ASH.skin, { arm: ASH.skinSh }), lit(DAY));
  gemLight(c, 110, P.h * .74, 30);
  glow(c, P.w - 110, P.h * .7, 120, '#FF7A22', .8); beingFlames(c, P.w - 110, P.h * .76, .25, 6);
};
ART.fireTurns = (c, P) => {
  sky(c, [[0, '#2A0A06'], [P.h, '#0A0202']]);
  strokePath(c, `M ${P.w * .1} 40 C ${P.w * .9} ${P.h * .2} ${P.w * .7} ${P.h * .6} ${P.w * .45} ${P.h}`, rgba('#FF7A22', .8), 60);
  strokePath(c, `M ${P.w * .1} 40 C ${P.w * .9} ${P.h * .2} ${P.w * .7} ${P.h * .6} ${P.w * .45} ${P.h}`, rgba('#FFF0B0', .9), 18);
  glow(c, P.w * .45, P.h, 200, '#FF5A1A', .8);
};

// ---------- p37–39 · Krishna's curse ----------
ART.krishnaProphecy = (c, P) => {
  riverBank(c, P);
  bust(c, 260, 470, 1.8, { ...CAST.krishna, eyes: .9, smile: .3, pain: 0, look: [.5, 0] }, DAY, { k: 1.2 });
};
ART.ashDefy = (c, P) => {
  riverBank(c, P);
  ashG(c, 780, 470, 1.8, { gem: false, eyes: 1, fierce: 1, pain: .1, mouth: .4, look: [-.6, 0] }, DAY, { k: 1.2 });
};
ART.krishnaCalm = (c, P) => {
  sky(c, [[0, '#6A7A9A'], [P.h, '#2A2A3A']]);
  bust(c, 260, 450, 2, { ...CAST.krishna, eyes: .8, pain: 0, fierce: .2, look: [.5, 0] }, DAWNL, { k: 1.3 });
};
ART.curse1 = (c, P) => {
  sky(c, [[0, '#1A1A2A'], [P.h, '#0A0A14']]);
  bust(c, P.w * .5, 560, 3.2, { ...CAST.krishna, eyes: .7, fierce: 1, pain: 0, look: [0, 0] }, DAWNL, { k: 1.6 });
};
ART.curse2 = (c, P) => {
  sky(c, [[0, '#2A2A3A'], [P.h, '#0A0A14']]);
  ashG(c, P.w * .5, 450, 1.8, { gem: false, eyes: 1, pain: 1, fierce: 0, look: [-.2, -1] }, { ...DAWNL, tint: ['#1A2030', .25] }, { k: 1.3 });
};
ART.curseSplash = (c, P) => {
  sky(c, [[0, '#0A0A10'], [P.h * .6, '#2A2830'], [P.h, '#0A0A0C']]);
  glow(c, P.w * .5, P.h * .62, 400, '#4A4A5A', .4);
  ridge(c, P.h * .72, 60, 3, '#14141A', { freq: .006, x0: -20, x1: P.w + 20, bottom: P.h + 20 });
  for (let i = 0; i < 5; i++) { const x = 80 + i * 230 + hash(i) * 60; strokePath(c, `M ${x} ${P.h * .74} L ${x + 6} ${P.h * .58}`, '#0A0A0E', 7); for (let k = 0; k < 3; k++) strokePath(c, `M ${x + 4} ${P.h * (.62 + k * .03)} l ${(k % 2 ? 1 : -1) * 50} -40`, '#0A0A0E', 4); }
  person(c, P.w * .5, P.h * .86, .42, { who: 'ash', pal: ASHG, dress: 'bare', skirt: '#6E6A38', arms: { l: 'down', r: 'down' }, head: (g) => ashHead(g, { gem: false, eyes: .4, pain: .8, look: [0, 1] }) }, { tint: ['#14141E', .45], edge: { col: '#C8C8D8', w: 1.6, a: .5 }, rim: { col: '#E0E0F0', dx: 4, dy: -3, a: .7 } });
};

// ---------- p40 · the gem ----------
ART.givesGem = (c, P) => {
  riverBank(c, P);
  person(c, P.w * .45, P.h * 1.5, .78, { who: 'ash', pal: ASHG, dress: 'bare', skirt: '#A8A060', arms: { l: 'down', r: 'reach' }, head: (g) => ashHead(g, { gem: false, eyes: .5, pain: .6, look: [.6, .4] }) }, DAY);
  gemLight(c, P.w * .45 + 350 * .78 + 16, P.h * 1.5 - 560 * .78 - 26, 26);
};
ART.walksAway = (c, P) => {
  riverBank(c, P, { stops: [[0, '#6A7A9A'], [P.h, '#4A3A2E']] });
  for (const [x, k] of [[P.w * .55, .6], [P.w * .75, .7], [P.w * .9, .5]]) forestTree(c, x, P.h * .6, k, { col: '#2A3020' });
  figure(c, (f) => sil(f, P.w * .62, P.h * .66, .14, true, (g) => manSil(g, { pose: 'walk', head: 'knot' })), lit({ tint: ['#1A1A20', .8], edge: { col: '#E8E0D0', w: 1.2, a: .4 }, rim: { col: '#F0E8D8', dx: 2, dy: -2, a: .5 } }));
  for (const [x, k] of [[80, 1.2], [240, 1.15]]) figure(c, (f) => { at(f, x, P.h * .92, k, -815); mbhBust(f, x < 100 ? { ...CAST.bhima, dress: 'armor' } : { ...CAST.arjuna, dress: 'armor' }); }, lit({ tint: ['#140C08', .85], edge: { col: '#FFF0D0', w: 1.6, a: .6 }, rim: { col: '#FFF6E0', dx: 4, dy: -3, a: .8 } }));
};
ART.draupadiGemGiven = (c, P) => {
  sky(c, [[0, '#6A6A72'], [P.h, '#2A2420']]);
  wbust(c, 800, 400, 1.55, { pal: DRAUPADI, look: [-.6, .3], eyes: .8 }, DAWNL, { k: 1.2 });
  bust(c, 240, 400, 1.55, { ...CAST.bhima, dress: 'armor', eyes: 1, pain: .3, look: [.7, .2] }, DAWNL, { k: 1.2 });
  figure(c, (f) => hand(f, 520, 470, .8, 0, MBH.bhima.skin, { arm: MBH_DRESS.bhima.armorSh }), lit(DAWNL));
  gemLight(c, 576, 456, 24);
};
ART.gemStripEnd = (c, P) => {
  c.fillStyle = '#05060B'; c.fillRect(0, 0, P.w, P.h);
  figure(c, (f) => hand(f, P.w - 90, P.h * .7, .6, -Math.PI / 2, DRAUPADI.skin, {}), lit(DAWNL));
  gemLight(c, P.w - 90, P.h * .42, 24);
};
