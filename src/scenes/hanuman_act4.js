// Issue 2, Acts 4–5 and the coda (pp. 41–53): the mountain, the crowning, the ask, the embrace, the Sarayu, Bhima and the
// old monkey, the last page, the back matter. Ashwatthama's head is Issue 1's (comic/1-ashwatthama, ashwatthama_cast.js).
const ASH = {
  skin: '#C48A5E', skinSh: '#976044', skinDk: '#56301F', palm: '#E2B08A', lip: '#6A3022', lipLo: '#8E4430',
  hair: '#120D0F', hairLt: '#2E2226', eyeW: '#EDE3D2', iris: '#2A1A12', brow: '#120C0C', bead: '#120D0F', tilak: '#C81E2A',
  gold: '#D9A441', goldSh: '#8A5E1E', goldLt: '#FFE08A',
  armor: '#2C313D', armorSh: '#171A22', armorLt: '#4C5568', cloth: '#6A1F1C', clothSh: '#3E0F0E', gem: '#A8EEFF', gemDk: '#2E8FB8',
};
// ---------- Ashwatthama ----------
function ashGem(c, a = 1) {
  if (a === false) return;
  const P = 'M 0 -870 L 8 -857 L 0 -844 L -8 -857 Z';
  fillPath(c, P, ASH.gemDk); inside(c, P, () => { fillPath(c, 'M 0 -870 L 8 -857 L 0 -857 Z', ASH.gem); fillPath(c, 'M -8 -857 L 0 -844 L 0 -857 Z', mixCol(ASH.gem, ASH.gemDk, .4)); });
  strokePath(c, P, ASH.gold, 1.6);
  ellipse(c, -2, -862, 1.6, 2.4, '#FFFFFF');
}
function ashGemGlow(c, a = 1) {
  if (!a) return;
  glow(c, 0, -857, 70, '#7FD8FF', .55 * a); glow(c, 0, -857, 22, '#E8FBFF', .7 * a);
}
function ashHead(c, o = {}) {
  withSur(ASH, () => {
    // short hair behind the ears, down to the nape (no hanging locks)
    for (const k of [-1, 1]) fillPath(c, `M ${k * 40} -870 C ${k * 62} -850 ${k * 64} -800 ${k * 52} -770 C ${k * 46} -760 ${k * 40} -766 ${k * 40} -780 Z`, ASH.hair);
    suryaHead(c, { crown: false, bun: true, curls: false, kundala: 'ring', tilak: false, ...o });
  });
  // stubble along the jaw: a soldier's, not a sage's beard
  inside(c, SUR_FACE, () => fillPath(c, 'M -46 -790 C -40 -760 -20 -746 0 -746 C 20 -746 40 -760 46 -790 C 34 -770 18 -762 0 -762 C -18 -762 -34 -770 -46 -790 Z', rgba('#1A1010', .28)));
  // a short warrior's beard along the jaw (the mouth left clear) and a fuller moustache
  fillPath(c, 'M -47 -806 C -48 -772 -30 -742 0 -737 C 30 -742 48 -772 47 -806 C 42 -786 34 -770 22 -760 C 16 -767 8 -768 0 -767 C -8 -768 -16 -767 -22 -760 C -34 -770 -42 -786 -47 -806 Z', ASH.hair);
  for (const k of [-1, 1]) fillPath(c, `M 0 -781 C ${k * 10} -785 ${k * 22} -783 ${k * 27} -768 C ${k * 20} -774 ${k * 10} -776 0 -775 Z`, ASH.hair);
  if (o.gem !== false) ashGem(c, o.gem ?? 1);
}
function ashBust(c, o = {}) {
  const A = ASH, br = Math.sin((o.t || 0) * 1.4) * 2;
  // shoulders and armour
  const TOR = `M -230 -360 C -236 -470 -214 -600 -160 -650 C -120 -690 -70 -704 -34 -708 L 34 -708 C 70 -704 120 -690 160 -650 C 214 -600 236 -470 230 -360 Z`;
  fillPath(c, TOR, A.armor);
  inside(c, TOR, () => {
    fillPath(c, 'M -260 -720 L -110 -720 C -130 -620 -150 -520 -150 -360 L -260 -360 Z', A.armorSh);
    for (const s of [-1, 1]) {   // pauldrons: three lames each
      for (let i = 0; i < 3; i++) { const y = -640 + i * 34; fillPath(c, `M ${s * 120} ${y} C ${s * 170} ${y - 26} ${s * 226} ${y - 8} ${s * 240} ${y + 30} L ${s * 236} ${y + 46} C ${s * 214} ${y + 14} ${s * 170} ${y + 4} ${s * 124} ${y + 22} Z`, i % 2 ? A.armorLt : mixCol(A.armor, A.armorLt, .5)); strokePath(c, `M ${s * 124} ${y + 22} C ${s * 170} ${y + 4} ${s * 214} ${y + 14} ${s * 236} ${y + 46}`, A.goldSh, 3); }
    }
    // the breastplate's gold edge and a sun boss
    strokePath(c, 'M -110 -690 C -70 -620 70 -620 110 -690', A.gold, 6);
    ellipse(c, 0, -560 + br, 30, 30, A.goldSh); ellipse(c, 0, -560 + br, 22, 22, A.gold); ellipse(c, -6, -566 + br, 6, 6, A.goldLt);
    // the red uttariya over his left shoulder (screen right), across the chest
    const UT = `M 70 -700 C 140 -690 200 -650 230 -560 L 230 -470 C 140 -520 40 -470 -60 -380 L -140 -360 C -40 -470 40 -560 70 -700 Z`;
    fillPath(c, UT, A.cloth); inside(c, UT, () => { for (let i = 0; i < 4; i++) strokePath(c, `M ${90 + i * 30} -690 C ${60 + i * 30} -600 ${0 + i * 30} -500 ${-80 + i * 30} -390`, rgba(A.clothSh, .7), 5); });
  });
  // a gorget round the neck, gold-edged
  fillPath(c, 'M -52 -700 C -50 -726 -40 -740 -34 -742 L 34 -742 C 40 -740 50 -726 52 -700 C 30 -690 -30 -690 -52 -700 Z', A.armorSh);
  strokePath(c, 'M -50 -704 C -30 -694 30 -694 50 -704', A.gold, 4);
  ashHead(c, o);
  fillPath(c, 'M -40 -716 C -38 -734 -34 -744 -30 -748 L 30 -748 C 34 -744 38 -734 40 -716 C 20 -708 -20 -708 -40 -716 Z', A.armor);
  strokePath(c, 'M -40 -716 C -20 -708 20 -708 40 -716', A.gold, 3);
}

const RAM = { who: 'ram', crown: 'kirita', tilak: 'namam', hair: 'long' };
const BHIMA = { who: 'bhima', crown: 'band', stache: true, build: 1.22, hair: 'long', cloth: '#7A5A1E', clothSh: '#4A3410' };
const OLD = { age: 1, crown: false };
// a necklace bright as the moon, with a beryl at its heart (7.39.20), laid on a bust at (x, y), scale k
function moonNecklace(c, x, y, k) { c.save(); c.translate(x, y); c.scale(k, k); glow(c, 0, 220, 160, '#F4F8FF', .5); for (let i = 0; i <= 20; i++) { const a = Math.PI * .12 + i / 20 * Math.PI * .76; ellipse(c, Math.cos(a) * -90, 150 + Math.sin(a) * 120, 9, 9, '#F8F6EE'); } ellipse(c, 0, 274, 16, 20, '#3AA8C8'); ellipse(c, -4, 268, 5, 6, '#E8FAFF'); c.restore(); }
function nightSky(c, P, o = {}) { vgrad(c, P, [[0, o.top || '#060A1E'], [1, o.bot || '#1E2A4A']]); const R = lcg(o.seed || 3); for (let i = 0; i < (o.n ?? 70); i++) ellipse(c, P.w * R(), P.h * R() * (o.h ?? .7), 1.5 + R() * 2, 1.5 + R() * 2, '#E8ECF8'); }
function himalaya(c, P, y, col = '#E8EEF8', sh = '#9AA8C8', seed = 2) {
  // rock below, snow on the peaks; the shadow on each peak's far face
  const R = lcg(seed), pts = []; let up = true;
  for (let x = -60; x <= P.w + 140; x += 110 + R() * 130) { pts.push([x, up ? y - P.h * (.08 + R() * .14) : y + R() * P.h * .03, up]); up = !up; }
  const M = 'M -60 ' + (P.h + 20) + ' ' + pts.map(([x, yy]) => `L ${x} ${yy}`).join(' ') + ` L ${P.w + 140} ${P.h + 20} Z`;
  const rock = mixCol(sh, '#2E3A5A', .45);
  fillPath(c, M, rock);
  inside(c, M, () => pts.forEach(([x, yy, pk], i) => {
    if (!pk) return; const L = pts[i - 1] || [x - 120, y], Rt = pts[i + 1] || [x + 120, y], k = .45;
    const ax = lerp(x, L[0], k), ay = lerp(yy, L[1], k), bx = lerp(x, Rt[0], k), by = lerp(yy, Rt[1], k);
    const SN = `M ${x} ${yy} L ${bx} ${by} L ${lerp(x, bx, .7)} ${by - 14} L ${lerp(x, bx, .4)} ${by + 6} L ${x} ${by - 20} L ${lerp(x, ax, .45)} ${ay + 4} L ${lerp(x, ax, .75)} ${ay - 12} L ${ax} ${ay} Z`;
    fillPath(c, SN, col); fillPath(c, `M ${x} ${yy} L ${bx} ${by} L ${lerp(x, bx, .7)} ${by - 14} L ${lerp(x, bx, .4)} ${by + 6} L ${x} ${by - 20} Z`, sh);
    fillPath(c, `M ${x} ${by - 20} L ${lerp(x, bx, .4)} ${by + 6} L ${Rt[0]} ${Rt[1]} L ${Rt[0]} ${P.h + 20} L ${x + 20} ${P.h + 20} Z`, rgba(mixCol(rock, '#000000', .3), .5));
  }));
  strokePath(c, M, mixCol(sh, '#000000', .35), 3);
}
function plantain(c, x, base, h, k = 1, col = '#5A9A3A') {
  strokePath(c, `M ${x} ${base} C ${x - 6} ${base - h * .5} ${x + 6} ${base - h * .8} ${x} ${base - h}`, '#6A7A3A', 30 * k);
  for (const [a, l] of [[-2.5, 1], [-.6, 1], [-1.9, .85], [-1.25, .9], [-2.95, .7], [-.15, .75]]) {
    c.save(); c.translate(x, base - h); c.rotate(a); const L = 230 * k * l;
    const Lf = `M 0 0 C ${L * .3} -50 ${L * .7} -40 ${L} ${L * .25} C ${L * .7} 10 ${L * .3} 30 0 0 Z`;
    fillPath(c, Lf, a < -1.5 ? mixCol(col, '#000000', .15) : col); strokePath(c, `M 0 0 C ${L * .4} -14 ${L * .75} 0 ${L} ${L * .25}`, mixCol(col, '#000000', .35), 3); c.restore();
  }
  for (let i = 0; i < 6; i++) ellipse(c, x + (i % 2 ? 10 : -10), base - h + 40 + i * 16, 9, 18, '#E8C840');
}
// =================== p41 · the mountain ===================
ART.mountain = (c, P) => {
  nightSky(c, P, { top: '#04060E', bot: '#2A1A2A', seed: 7 });
  // the battlefield below: the army fallen, fires
  fillPath(c, `M -20 ${P.h * .8} Q ${P.w * .5} ${P.h * .74} ${P.w + 20} ${P.h * .8} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#1A1418');
  bodies(c, P, .82, 40, 4, .6);
  for (const x of [.15, .55, .85]) { glow(c, P.w * x, P.h * .8, 80, '#FF8A2A', .6); blaze(c, P.w * x, P.h * .81, 50, 70, Math.round(x * 50)); }
  // the peak, bright as the sun, herbs blazing on it
  const cx = P.w * .52, cy = P.h * .36;
  glow(c, cx, cy, 520, '#FFE8A0', .55);
  fig(c, cx + 40, cy + 170, .3, { legs: 'leap', arms: ['up', 'up'], expr: 'fierce', look: [1, -.2], tail: 'stream', crown: 'band' }, lit(DAY()), hanFigure, 1.1);
  const M = `M ${cx - 300} ${cy + 40} L ${cx - 200} ${cy - 120} L ${cx - 80} ${cy - 180} L ${cx + 20} ${cy - 260} L ${cx + 140} ${cy - 160} L ${cx + 300} ${cy - 60} L ${cx + 320} ${cy + 40} C ${cx + 100} ${cy + 90} ${cx - 100} ${cy + 90} ${cx - 300} ${cy + 40} Z`;
  fillPath(c, M, '#7A6A5A'); inside(c, M, () => { fillPath(c, `M ${cx + 20} ${cy - 260} L ${cx + 320} ${cy + 40} L ${cx + 320} ${cy + 100} L ${cx} ${cy + 100} Z`, '#5A4A3E'); const R = lcg(5); for (let i = 0; i < 26; i++) { const x = cx - 240 + R() * 500, y = cy - 140 + R() * 190; for (const a of [-.6, 0, .6]) strokePath(c, `M ${x} ${y} l ${Math.sin(a) * 22} ${-Math.cos(a) * 22}`, ['#C8FF90', '#FFE870', '#90FFC8'][i % 3], 6); } for (let i = 0; i < 7; i++) { const x = cx - 220 + i * 70, y = cy - 120 - Math.sin(i / 6 * Math.PI) * 90; strokePath(c, `M ${x} ${y + 40} L ${x} ${y - 30}`, '#3A2A1A', 8); puffs(c, x, y - 30, 90, '#3A6A3A', i + 4, 4); } });
  strokePath(c, M, '#2A2018', 4);
};

// =================== p42 · Ravana falls, the crowning ===================
ART.ravanaFalls = (c, P) => {
  vgrad(c, P, [[0, '#1A0A10'], [.6, '#8A2A1A'], [1, '#E8803A']]);
  glow(c, P.w * .5, P.h * .45, 400, '#FFE8A0', .4);
  c.save(); c.translate(P.w * .5, P.h * .4); c.rotate(-.35); c.scale(.36, .36); figure(c, (c) => dashaBust(c, { expr: 'pain', exprs: null, look: [0, -1], arms: ['up', 'throw'], extra: 4 }), FIREL()); c.restore();
  // Ram's arrow through his heart
  strokePath(c, `M ${P.w * .02} ${P.h * .62} L ${P.w * .48} ${P.h * .54}`, '#FFF6D0', 9); glow(c, P.w * .48, P.h * .54, 70, '#FFE08A', .9);
  const R = lcg(3); for (let i = 0; i < 5; i++) { c.save(); c.translate(P.w * (.6 + R() * .35), P.h * (.08 + R() * .3)); c.rotate(R() * 3); c.scale(.16, .16); fillPath(c, 'M -80 0 L -74 -60 C -60 -150 60 -150 74 -60 L 80 0 Z', '#E8B84A'); strokePath(c, 'M -80 0 L -74 -60 C -60 -150 60 -150 74 -60 L 80 0 Z', '#8A5A1A', 6); c.restore(); }
};
ART.ramSita = (c, P) => {
  vgrad(c, P, [[0, '#F8D8A0'], [1, '#E8A070']]); glow(c, P.w * .5, P.h * .4, 300, '#FFF6D0', .5);
  bust(c, P.w * .7, P.h * 0.545, 0.55, { ...RAM, expr: 'kind', look: [-1, .2], turn: -.3, arms: ['down', 'down'] }, lit(DAY()));
  sitaAt(c, P.w * .28, P.h * 0.571, 0.52, { expr: 'smile', look: [1, -.2], turn: .3, arms: ['down', 'down'] }, lit(DAY()));
};
ART.crowned = (c, P) => {
  vgrad(c, P, [[0, '#8A2A2A'], [1, '#E8A040']]);
  // the white parasol over the throne
  fillPath(c, `M ${P.w * .15} ${P.h * .14} Q ${P.w * .5} ${P.h * -.04} ${P.w * .85} ${P.h * .14} Z`, '#F8F4E8'); strokePath(c, `M ${P.w * .5} ${P.h * .06} L ${P.w * .5} ${P.h * .2}`, '#C8963A', 6);
  // the throne's gold back
  { const TB = `M ${P.w * .14} ${P.h * .7} L ${P.w * .14} ${P.h * .36} C ${P.w * .14} ${P.h * .2} ${P.w * .62} ${P.h * .2} ${P.w * .62} ${P.h * .36} L ${P.w * .62} ${P.h * .7} Z`; fillPath(c, TB, '#E8B84A'); strokePath(c, TB, '#8A5A1A', 4); inside(c, TB, () => fillPath(c, ellP(P.w * .38, P.h * .4, P.w * .18, P.h * .14), '#C21E2A')); }
  bust(c, P.w * .38, P.h * .38, .4, { ...RAM, expr: 'kind', look: [.6, .6], arms: ['down', 'abhaya'] }, lit(DAY()));
  bust(c, P.w * .8, P.h * .52, .26, { expr: 'tender', look: [-.8, -.6], turn: -.3, arms: ['namaste', 'namaste'], crown: 'band' }, lit(DAY()), hanBust);
  { const D = `M -20 ${P.h + 20} L -20 ${P.h * .66} L ${P.w + 20} ${P.h * .66} L ${P.w + 20} ${P.h + 20} Z`; fillPath(c, D, '#D8A040'); strokePath(c, `M -20 ${P.h * .66} L ${P.w + 20} ${P.h * .66}`, '#8A5A1A', 5); strokePath(c, `M -20 ${P.h * .7} L ${P.w + 20} ${P.h * .7}`, '#F6D27A', 4); for (let i = 0; i < 9; i++) ellipse(c, P.w * (i + .5) / 9, P.h * .68, 6, 6, i % 2 ? '#C21E2A' : '#1E8A5A'); }
};

// the court from behind: heads and shoulders dark in the foreground
function courtBacks(c, P, y, n, seed = 2, col = '#4A2A1A') {
  const R = lcg(seed);
  for (let i = 0; i < n; i++) { const x = P.w * (i + .5 + (R() - .5) * .5) / n, Y = P.h * (y + R() * .05), k = .9 + R() * .3; c.save(); c.translate(x, Y); c.scale(k, k);
    fillPath(c, 'M -110 260 C -110 120 -80 90 -30 80 L 30 80 C 80 90 110 120 110 260 Z', mixCol(col, '#000000', R() * .3)); fillPath(c, ellP(0, 20, 52, 62), '#1A100C');
    if (R() < .35) { fillPath(c, 'M -46 -10 L -40 -70 L 40 -70 L 46 -10 Z', '#C8963A'); strokePath(c, 'M -46 -10 L 46 -10', '#8A5A1A', 4); }
    c.restore(); }
}
// =================== p43 · the gifts, the ask ===================
function ayodhyaHall(c, P) {
  vgrad(c, P, [[0, '#E8C890'], [1, '#D8986A']]);
  const n = Math.max(2, Math.round(P.w / 260)), aw = P.w / n;
  for (let i = 0; i < n; i++) { const x = aw * (i + .5), A = `M ${x - aw * .3} ${P.h * .86} L ${x - aw * .3} ${P.h * .3} Q ${x} ${P.h * .08} ${x + aw * .3} ${P.h * .3} L ${x + aw * .3} ${P.h * .86} Z`; fillPath(c, A, '#F2DCB0'); strokePath(c, A, '#B8946A', 3); }
  for (const x of [.02, .98]) { fillPath(c, `M ${P.w * x - 26} 0 L ${P.w * x + 26} 0 L ${P.w * x + 26} ${P.h} L ${P.w * x - 26} ${P.h} Z`, '#F4ECD8'); strokePath(c, `M ${P.w * x + 26} 0 L ${P.w * x + 26} ${P.h}`, '#B89A6A', 3); }
  fillPath(c, `M -20 ${P.h * .86} L ${P.w + 20} ${P.h * .86} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#B88A5A');
}
ART.gifts = (c, P) => {
  ayodhyaHall(c, P);
  bust(c, P.w * .1, P.h * 0.657, 0.28, { ...RAM, expr: 'smile', look: [1, .2], turn: .3, arms: ['down', 'reach'] }, lit(DAY()));
  // Sugriva, Vibhishana, Angada, Jambavan, vanaras: gold in their hands
  bust(c, P.w * .3, P.h * 0.709, 0.24, { expr: 'smile', look: [-1, 0], turn: -.2, crown: 'mukut', arms: ['down', 'cradle'], pal: { skin: '#C8A050', skinSh: '#987028', cloth: '#2E5A9A', clothSh: '#1A3A6A' } }, lit(DAY()), hanBust);
  bust(c, P.w * .46, P.h * 0.709, 0.24, { ...VIBHI, expr: 'smile', look: [-1, 0], turn: -.2, arms: ['down', 'cradle'] }, lit(DAY()));
  bust(c, P.w * .62, P.h * 0.709, 0.24, { expr: 'smile', look: [-1, 0], turn: -.2, arms: ['down', 'cradle'] }, lit(DAY()), jambBust);
  [[.78, 0], [.9, 2]].forEach(([x, v]) => bust(c, P.w * x, P.h * 0.735, 0.22, { v, expr: 'smile', look: [-1, 0], turn: -.2, arms: ['down', 'cradle'] }, lit(DAY()), vanaraBust));
  const R = lcg(4); for (let i = 0; i < 18; i++) { const x = P.w * (.25 + R() * .72), y = P.h * (.78 + R() * .1); ellipse(c, x, y, 8, 8, ['#F0B83A', '#FFE48A', '#C21E2A', '#1E8A5A'][i % 4]); }
};
ART.hanAsks = (c, P) => { ayodhyaHall(c, P); bust(c, P.w * .26, P.h * 0.52, 0.392, { expr: 'tender', look: [1, 0], turn: .3, tilt: .1, arms: ['namaste', 'namaste'], crown: 'band' }, lit(DAY()), hanBust); };
ART.hanAsks2 = (c, P) => { ayodhyaHall(c, P); c.save(); c.translate(P.w * .24, P.h * .56); c.scale(1.35, 1.35); figure(c, (c) => hanHead(c, { expr: 'calm', look: [1, -.2], turn: .3, crown: 'band', t: P.t }), lit(DAY())); c.restore(); };

// =================== p44 · the embrace ===================
ART.embrace = (c, P) => {
  ayodhyaHall(c, P);
  glow(c, P.w * .5, P.h * .5, 520, '#FFF6D0', .55);
  // Ram has risen from the throne and holds him
  bust(c, P.w * .66, P.h * .44, .72, { ...RAM, expr: 'kind', look: [-1, .3], turn: -.35, arms: ['reach', 'down'] }, lit(DAY()));
  bust(c, P.w * .34, P.h * .5, .7, { expr: 'tender', look: [1, -.3], turn: .35, arms: ['namaste', 'namaste'], crown: 'band' }, lit(DAY()), hanBust);
  moonNecklace(c, P.w * .34, P.h * .5 + 20, .7 * .82);
  courtBacks(c, P, .7, 7, 5);
};

// =================== p45 · two deathless ones ===================
ART.ashwatthama = (c, P) => {
  vgrad(c, P, [[0, '#14202E'], [1, '#2E4A5E']]);
  c.save(); c.translate(P.w * .5, P.h * .36); c.scale(1.25, 1.25); c.translate(0, 815);
  figure(c, (c) => { ashBust(c, { gem: false, eyes: 1, pain: .3, look: [0, .2] }); fillPath(c, 'M -10 -874 C -2 -870 6 -866 11 -860 C 6 -852 -2 -848 -10 -846 C -6 -856 -6 -866 -10 -874 Z', '#7A1418'); strokePath(c, 'M -6 -868 Q 2 -860 -4 -850', '#C83A2A', 2.5); }, { ...lit(KLIGHT(-4, -4, { rim: '#A8D0FF' })), tint: ['#2A3A5A', .25] });
  c.restore();
};
ART.jambaEcho = (c, P) => { vgrad(c, P, [[0, '#E8A040'], [1, '#FFE0A0']]); c.fillStyle = 'rgba(255,220,160,.2)'; c.fillRect(0, 0, P.w, P.h); bust(c, P.w * .5, P.h * .74, .34, { ...JAMB, expr: 'speak', look: [0, 0] }, lit(DAY()), jambBust); };
ART.steps = (c, P) => {
  nightSky(c, P, { top: '#060A1E', bot: '#2A3A6A', seed: 4 });
  ellipse(c, P.w * .82, P.h * .16, 44, 44, '#F6F2DE'); glow(c, P.w * .82, P.h * .16, 160, '#DDE6FF', .35);
  for (let i = 0; i < 7; i++) { const y = P.h * (.56 + i * .065); fillPath(c, `M -20 ${y} L ${P.w + 20} ${y} L ${P.w + 20} ${y + P.h * .065} L -20 ${y + P.h * .065} Z`, i % 2 ? '#C8BCA8' : '#B0A490'); strokePath(c, `M -20 ${y} L ${P.w + 20} ${y}`, '#6A6050', 3); }
  for (const x of [.08, .7]) { fillPath(c, `M ${P.w * x} 0 L ${P.w * x + 60} 0 L ${P.w * x + 60} ${P.h * .56} L ${P.w * x} ${P.h * .56} Z`, '#E8E0CC'); strokePath(c, `M ${P.w * x + 60} 0 L ${P.w * x + 60} ${P.h * .56}`, '#9A9080', 3); }
  fig(c, P.w * .3, P.h * .32, .2, { legs: 'crouch', arms: [[1.3, -.2, 'fist'], [1.2, .2, 'rest']], expr: 'calm', look: [1, -.5], tail: 'curl', crown: 'band' }, NIGHTL());
  moonNecklace(c, P.w * .3, P.h * .32, .2 * .82);
};

// =================== p46 · Ram's last words, the Sarayu ===================
ART.ramLast = (c, P) => { ayodhyaHall(c, P); bust(c, P.w * .2, P.h * .62, .5, { ...RAM, age: .3, expr: 'speak', look: [1, 0], turn: .3, arms: ['down', 'abhaya'] }, lit(DAY())); };
ART.sarayu = (c, P) => {
  vgrad(c, P, [[0, '#2A1E4A'], [.4, '#E8806A'], [.55, '#F8C890'], [.551, '#5A6A9A'], [1, '#2A3A5A']]);
  redSun(c, P.w * .62, P.h * .5, 70, { a: .6 });
  for (let i = 0; i < 12; i++) strokePath(c, `M ${P.w * (.1 + (i % 4) * .22)} ${P.h * (.6 + i * .03)} q 70 -6 140 0`, 'rgba(255,210,170,.45)', 3);
  // Ram walking into the river, light round him, everyone who followed him behind
  glow(c, P.w * .6, P.h * .58, 160, '#FFF2C0', .7);
  for (let i = 0; i < 9; i++) { const x = P.w * (.56 - i * .05), y = P.h * (.66 + i * .02), k = .16 + i * .01; c.save(); c.translate(x, y); c.scale(-k, k); manSil(c, { pose: 'walk', head: i ? (i % 3 ? 'knot' : 'bare') : 'kirita', col: i ? '#2A2238' : '#3A3A6A' }); c.restore(); }
  // on the bank, from behind, the one who stays
  fillPath(c, `M -20 ${P.h * .88} Q ${P.w * .3} ${P.h * .84} ${P.w * .5} ${P.h * .9} L ${P.w * .5} ${P.h + 20} L -20 ${P.h + 20} Z`, '#2A2218');
  fig(c, P.w * .2, P.h * .62, .2, { legs: 'stand', arms: ['side', 'side'], expr: 'calm', tail: 'up', crown: 'band' }, { ...lit(DAY()), tint: ['#140E1A', .96] });
};

// =================== p47–49 · an age later ===================
function grove2(c, P) { vgrad(c, P, [[0, '#7AA0C8'], [1, '#E8E0B0']]); himalaya(c, P, P.h * .42, '#EEF2FA', '#A8B8D4', 6); for (let i = 0; i < 9; i++) puffs(c, P.w * (i + .5) / 9, P.h * (.5 + (i % 3) * .04), 260, i % 2 ? '#3E6A34' : '#4A7A3A', i + 30, 6); fillPath(c, `M -20 ${P.h * .56} L ${P.w + 20} ${P.h * .56} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#3A5E30'); const R = lcg(9); for (let i = 0; i < 6; i++) plantain(c, P.w * (i + .5) / 6 + (R() - .5) * 40, P.h + 20, P.h * (.55 + R() * .25), .8); fillPath(c, `M -20 ${P.h * .9} L ${P.w + 20} ${P.h * .9} L ${P.w + 20} ${P.h + 20} L -20 ${P.h + 20} Z`, '#7A8A4A'); }
ART.bhimaGrove = (c, P) => {
  grove2(c, P);
  const R = lcg(3); for (let i = 0; i < 6; i++) { c.save(); c.translate(P.w * (.5 + R() * .45), P.h * (.2 + R() * .5)); c.rotate(R() * 3); plantain(c, 0, 0, 120, .5); c.restore(); }
  bust(c, P.w * .7, P.h * 0.64, 0.4, { ...BHIMA, expr: 'fierce', look: [-1, 0], turn: -.3, arms: ['down', 'up'], hold: 'mace' }, lit(DAY()));
};
function stone(c, P, y) { const S = `M ${P.w * .05} ${y} C ${P.w * .1} ${y - 70} ${P.w * .7} ${y - 80} ${P.w * .82} ${y - 20} L ${P.w * .86} ${y + 60} L ${P.w * .02} ${y + 60} Z`; fillPath(c, S, '#8A8478'); inside(c, S, () => fillPath(c, `M -20 ${y + 10} L ${P.w} ${y + 10} L ${P.w} ${y + 80} L -20 ${y + 80} Z`, '#6A645A')); strokePath(c, S, '#3A3630', 4); }
ART.oldMonkey = (c, P) => {
  grove2(c, P); stone(c, P, P.h * .72);
  // the old monkey lying along the stone, his tail across the path
  limb(c, [[P.w * .6, P.h * .7], [P.w * .78, P.h * .78], [P.w * .9, P.h * .9], [P.w + 30, P.h * .92]], [36, 34, 30, 26], '#C8B490');
  fig(c, P.w * .16, P.h * .56, .3, { ...OLD, legs: [[1.65, .1], [1.55, .2]], arms: ['side', [1.9, -2.4, 'rest']], expr: 'calm', look: [1, .6], tail: false, pal: { skin: '#C8B490', skinSh: '#9A866A' } }, lit(DAY()), hanFigure, -1.4);
};
const TAILG = (c, P, y) => limb(c, [[-30, P.h * y], [P.w * .4, P.h * (y + .02)], [P.w + 30, P.h * (y - .02)]], [44, 42, 38], '#C8B490');
// the hands where devaBust's 'down' arm ends (build 1.22, bodyK .82): (±145, 549) in bust units
function gripTail(c, x, y, k, sides, S = devaPal({ who: 'bhima' })) { for (const s of sides) { c.save(); c.translate(x + s * 145 * k, y + 549 * k); c.scale(k * .82 * 1.22 * (s < 0 ? -1 : 1), k * .82 * 1.22); devaHand(c, [0, 0], 1.7, 'fist', S); c.restore(); } }
ART.tailOneHand = (c, P) => { grove2(c, P); const y = P.h * .36, k = .52; bust(c, P.w * .5, y, k, { ...BHIMA, expr: 'smile', look: [.2, 1], arms: ['hip', 'down'] }, lit(DAY())); TAILG(c, P, (y + 560 * k) / P.h); gripTail(c, P.w * .5, y, k, [1]); };
ART.tailTwoHands = (c, P) => {
  grove2(c, P);
  const y = P.h * .36, k = .52; bust(c, P.w * .5, y, k, { ...BHIMA, expr: 'pain', look: [0, -.4], arms: ['down', 'down'] }, lit(DAY())); TAILG(c, P, (y + 560 * k) / P.h); gripTail(c, P.w * .5, y, k, [-1, 1]);
  for (const s of [-1, 1]) strokePath(c, `M ${P.w * .5 + s * 160} ${P.h * .96} q ${s * 20} -14 ${s * 40} 0 M ${P.w * .5 + s * 150} ${P.h * .99} q ${s * 26} -18 ${s * 52} 0`, '#5A4A2A', 3);
  for (const [x, y] of [[.36, .3], [.66, .28], [.62, .4], [.4, .44]]) fillPath(c, `M ${P.w * x} ${P.h * y} q -8 14 0 18 q 8 -4 0 -18 Z`, '#BEE6FF');
};
ART.bhimaBows = (c, P) => { grove2(c, P); bust(c, P.w * .5, P.h * .84, .5, { ...BHIMA, expr: 'kind', look: [0, .3], tilt: .1, arms: ['namaste', 'namaste'] }, lit(DAY())); };
ART.iAmHanuman = (c, P) => { grove2(c, P); bust(c, P.w * .5, P.h * .84, .5, { ...OLD, expr: 'smile', look: [0, 0], arms: ['down', 'down'] }, lit(DAY()), hanBust); };
ART.oldTells = (c, P) => { grove2(c, P); bust(c, P.w * .2, P.h * .66, .5, { ...OLD, expr: 'tender', look: [1, 0], turn: .3, arms: ['down', 'abhaya'] }, lit(DAY()), hanBust); };
ART.singing = (c, P) => {
  grove2(c, P);
  glow(c, P.w * .5, P.h * .6, 300, '#FFF6D0', .4);
  [[.12, .62, 0], [.86, .62, 1], [.27, .7, 2], [.73, .7, 3]].forEach(([x, y, i]) => bust(c, P.w * x, P.h * y, .2, { who: i % 2 ? 'base' : 'sita', fem: !(i % 2), hair: 'long', crown: 'mukut', tilak: 'dot', dress: i % 2 ? 'royal' : 'sari', cloth: ['#E86A9A', '#3A8AC8', '#F0B83A', '#8A3AC8'][i], expr: 'smile', look: [x < .5 ? 1 : -1, 0], turn: x < .5 ? .3 : -.3, arms: ['down', i % 2 ? 'up' : 'abhaya'] }, lit(DAY())));
  for (let i = 0; i < 8; i++) puffs(c, P.w * (i + .5) / 8, P.h * .9, 200, i % 2 ? '#3E6A34' : '#4A7A3A', i + 40, 5);
  bust(c, P.w * .52, P.h * .66, .44, { ...OLD, expr: 'tender', look: [0, 0], arms: ['namaste', 'namaste'] }, lit(DAY()), hanBust);
};

// =================== p50 · the last page ===================
ART.lastPage = (c, P) => {
  vgrad(c, P, [[0, '#2A1E4A'], [.45, '#E8806A'], [1, '#F8D0A0']]);
  redSun(c, P.w * .74, P.h * .4, 120);
  himalaya(c, P, P.h * .62, '#E8EEF8', '#B8C4DA', 3);
  c.save(); c.translate(P.w * .42, P.h * .56); c.scale(2.6, 2.6); figure(c, (c) => hanHead(c, { expr: 'tender', look: [0, 0], age: 1, crown: false, t: P.t }), WARM()); c.restore();
};

// =================== back matter ===================
ART.paper = (c, P) => { vgrad(c, P, [[0, '#1A1418'], [1, '#2A2024']]); };
ART.backPage = (c, P) => {
  vgrad(c, P, [[0, '#0E0A1E'], [.55, '#3A2A4A'], [1, '#0E0A14']]);
  const R = lcg(5); for (let i = 0; i < 50; i++) ellipse(c, P.w * R(), P.h * R() * .5, 1.5 + R() * 2, 1.5 + R() * 2, '#E8ECF8');
  // the shadow the boy will become: a giant striding across the sky (Vamana's three steps)
  fig(c, P.w * .66, P.h * .1, .62, { who: 'ram', crown: 'kirita', expr: 'calm', look: [0, .6], legs: [[1.95, .1], [.9, .3]], arms: ['up', 'down'], dhoti: '#3A2A5A' }, { ...lit(DAY()), tint: ['#2A1E4A', .92], alpha: .4 }, devaFigure);
  // the yajna platform
  const PL = `M -20 ${P.h + 20} L -20 ${P.h * .56} L ${P.w + 20} ${P.h * .56} L ${P.w + 20} ${P.h + 20} Z`;
  glow(c, P.w * .44, P.h * .44, 420, '#FFC060', .4);
  // Bali, the asura king, pouring the water of the gift
  bust(c, P.w * .28, P.h * .38, .44, { who: 'base', crown: 'kirita', stache: true, tilak: 'dot', build: 1.1, expr: 'kind', look: [1, .5], turn: .3, arms: ['down', 'reach'], hold: 'kamandalu', pal: { skin: '#B07A52', skinSh: '#8A5838', skinDk: '#4E2E1C', skinLt: '#D09A6E', cloth: '#7A2A8A', clothSh: '#4A1A5A' } }, WARM());
  fillPath(c, PL, '#2E2026'); strokePath(c, `M -20 ${P.h * .56} L ${P.w + 20} ${P.h * .56}`, '#C8963A', 6);
  // Vamana: a small brahmin boy with a parasol, holding out his hand
  const bx = P.w * .66, by = P.h * .395;
  fig(c, bx, by, .14, { who: 'ram', crown: 'jata', tilak: 'namam', expr: 'smile', look: [-1, -.4], turn: -.3, dress: 'rishi', legs: 'stand', arms: ['down', 'reach'], dhoti: '#F0C030' }, WARM(), devaFigure);
  strokePath(c, `M ${bx + 34} ${by - 60} L ${bx + 34} ${by + 110}`, '#6A4A2A', 5);
  fillPath(c, `M ${bx - 50} ${by - 54} Q ${bx + 34} ${by - 116} ${bx + 118} ${by - 54} Z`, '#F0E8D0'); strokePath(c, `M ${bx - 50} ${by - 54} Q ${bx + 34} ${by - 116} ${bx + 118} ${by - 54} Z`, '#8A7A5A', 3);
  // the water falling from the king's vessel
  strokePath(c, `M ${P.w * .5} ${P.h * .42} C ${P.w * .54} ${P.h * .44} ${P.w * .57} ${P.h * .45} ${P.w * .6} ${P.h * .47}`, 'rgba(190,230,255,.9)', 6);
};
