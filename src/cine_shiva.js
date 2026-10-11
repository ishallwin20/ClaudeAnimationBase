// cine_shiva.js: Shiva for the cinematic engine (cine.js). Flat shapes, semi-realistic proportions, lit by figure().
// Units: the feet stand at (0, 0), up is -y, the top of the jata is about -1000 (the trishul's tip -1265). Scale and
// place him with the canvas transform. The head (shivaHead) is drawn in the same units, so a close-up is the same head
// scaled up: translate to where the face should sit, scale(k), translate(0, 815).
//
// o (all optional): t (seconds, for wind and breathing), eyes (0 closed .. 1 open), third (0..1 the third eye opening),
// wind (-1..1 strength, + blows to screen right), light (1 = lit from screen right, -1 from the left),
// arm ('abhaya' raised blessing hand | 'down'), trishul (true), look ([-1..1, -1..1] where the irises point).
const SHV = {
  skin: '#5C88C6', skinSh: '#3F67A0', skinDk: '#2E4D80', throat: '#2B427A', palm: '#7E9FD0',
  hair: '#17192B', hairLt: '#2C3050', lip: '#34467C', lipLo: '#4F64A0', eyeW: '#E9E3D8', iris: '#2B1C14',
  ash: '#EFE8DA', third: '#FF8A3A', brow: '#15172A',
  tiger: '#D88A35', tigerSh: '#A9612A', tigerLt: '#F1C27A', stripe: '#2E2018',
  gold: '#D9A441', goldSh: '#93692A', bead: '#5E2F1B', beadLt: '#8A4E2E',
  snake: '#2E6A5D', snakeSh: '#1D4A41', snakeLt: '#8CBF97', steel: '#C3CAD3', steelSh: '#7E8794', wood: '#6D4227',
  sash: '#C8452B', sashSh: '#8E2C1E', moon: '#F6EED6',
};
const mirrorX = d => d.replace(/(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)/g, (m, x, _a, y) => `${-x} ${y}`);

// ---------- head ----------
const SHV_FACE = 'M 0 -746 C 9 -746 16 -748 22 -752 C 32 -760 40 -773 44 -788 C 47 -800 48.5 -812 48.5 -824 C 49 -844 46 -861 38 -872 C 28 -883 -28 -883 -38 -872 C -46 -861 -49 -844 -48.5 -824 C -48.5 -812 -47 -800 -44 -788 C -40 -773 -32 -760 -22 -752 C -16 -748 -9 -746 0 -746 Z';
const SHV_NECK = 'M -31 -700 C -29 -728 -31 -756 -36 -792 L 36 -792 C 31 -756 29 -728 31 -700 Z';
function shivaHead(c, o = {}) {
  const t = o.t || 0, eyes = o.eyes ?? 0, third = o.third ?? 0, L = o.light ?? 1, g = o.wind ?? 0, S = SHV;
  // neck: Neelkantha's throat, the jaw's shadow, the far side in shade
  fillPath(c, SHV_NECK, S.skin);
  inside(c, SHV_NECK, () => {
    const tg = c.createRadialGradient(0, -726, 0, 0, -726, 26); tg.addColorStop(0, rgba(S.throat, .85)); tg.addColorStop(1, rgba(S.throat, 0)); c.fillStyle = tg; c.fillRect(-40, -760, 80, 70);
    c.save(); c.scale(L, 1); fillPath(c, 'M -40 -800 L -20 -800 C -18 -760 -20 -730 -24 -700 L -40 -700 Z', rgba(S.skinSh, .9)); c.restore();
    for (const s of [-1, 1]) strokePath(c, `M ${s * 30} -780 C ${s * 22} -752 ${s * 12} -726 ${s * 5} -706`, rgba(S.skinSh, .8), 2.2);
    fillPath(c, 'M -46 -800 C -34 -766 -14 -754 0 -754 C 14 -754 34 -766 46 -800 L 46 -770 C 30 -742 -30 -742 -46 -770 Z', rgba(S.skinDk, .75));
  });
  // locks falling past the ears onto the shoulders (behind the ears)
  for (const s of [-1, 1]) {
    const w = g * s;
    limb(c, [[s * 46, -846], [s * 56, -806], [s * (60 + w * 4), -768], [s * (70 + w * 9), -730], [s * (84 + w * 14), -692]], [18, 20, 18, 13, 3], S.hair, false);
    limb(c, [[s * 50, -820], [s * (64 + w * 3), -786], [s * (78 + w * 8), -752], [s * (96 + w * 14), -718]], [12, 13, 9, 2], S.hairLt, false);
  }
  // ears and kundala
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 45} -836 C ${s * 56} -840 ${s * 59} -824 ${s * 57} -811 C ${s * 56} -801 ${s * 51} -795 ${s * 45} -797 Z`, s === -L ? S.skinSh : S.skin);
    strokePath(c, `M ${s * 48} -829 C ${s * 54} -829 ${s * 54} -815 ${s * 50} -806`, S.skinDk, 1.6);
    const sw = Math.sin(t * 1.3 + s) * .8;
    c.strokeStyle = S.gold; c.lineWidth = 3.2; c.beginPath(); c.arc(s * 51 + sw, -787, 8, 0, TAU); c.stroke();
    ellipse(c, s * 51 + sw, -779, 2.4, 2.4, S.goldSh);
  }
  // face
  fillPath(c, SHV_FACE, S.skin);
  inside(c, SHV_FACE, () => {
    c.save(); c.scale(L, 1);   // the far side (screen left when lit from the right) in shade
    fillPath(c, 'M -60 -900 L -30 -884 C -36 -862 -36 -840 -34 -822 C -33 -806 -30 -790 -25 -777 C -19 -765 -11 -756 -3 -748 L -60 -740 Z', S.skinSh);
    fillPath(c, 'M -47 -806 C -38 -800 -30 -793 -23 -781 C -31 -785 -40 -789 -49 -791 Z', rgba(S.skinDk, .45));
    fillPath(c, 'M -2 -830 C -5 -815 -8 -802 -11 -792 C -8 -788 -4 -787.5 -1 -789 C -2 -800 -2 -815 -2 -830 Z', S.skinSh);
    strokePath(c, 'M 2.5 -826 C 3.5 -812 4.5 -801 4 -794', rgba('#9CB8E6', .55), 2.4);
    c.restore();
    for (const s of [-1, 1]) ellipse(c, s * 19, -824, 15, 7, rgba(S.skinDk, .16));
    ellipse(c, 0, -783.5, 7, 2.2, rgba(S.skinDk, .6));
    ellipse(c, 0, -760.5, 8, 2.8, rgba(S.skinSh, .9));
  });
  // eyes
  for (const s of [-1, 1]) {
    const ex = s * 19, ey = -820, up = lerp(4, -8, eyes), lw = 12.5;
    const shape = `M ${ex - lw} ${ey + 1} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw} ${ey - 1} Q ${ex} ${ey + 6.5} ${ex - lw} ${ey + 1} Z`;
    if (eyes > .04) {
      fillPath(c, shape, S.eyeW);
      inside(c, shape, () => {
        const lx = (o.look ? o.look[0] : 0) * 4, ly = (o.look ? o.look[1] : 0) * 2;
        ellipse(c, ex + lx, ey + .5 + ly, 5.4, 6, S.iris);
        ellipse(c, ex + lx, ey + .5 + ly, 2.5, 2.9, '#0D0907');
        ellipse(c, ex + lx + 1.7, ey - 1.5 + ly, 1.3, 1.3, '#FFF8EC');
        ellipse(c, ex, ey + up * .9, lw + 2, 5, rgba(S.skinDk, .45));
      });
    }
    strokePath(c, `M ${ex - lw - 1} ${ey + 1.5} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw + 1} ${ey - .5}`, S.brow, 2.5);
    if (eyes < .3) for (let i = 0; i < 4; i++) { const u = (i + 1) / 5, x = lerp(ex - lw, ex + lw, u), y = ey + 1.5 + (up * 1.25 - 1) * 2 * u * (1 - u) * 1.2; strokePath(c, `M ${x} ${y} l ${(u - .5) * 2} 2.4`, S.brow, 1); }
    fillPath(c, `M ${s * 6} -830.5 C ${s * 14} -838 ${s * 26} -839.5 ${s * 35} -834 C ${s * 26} -835 ${s * 15} -833.5 ${s * 7} -827 Z`, S.brow);
  }
  // nose tip, mouth
  strokePath(c, 'M -7.5 -790 C -4.5 -786.5 4.5 -786.5 7.5 -790', S.skinDk, 1.9);
  fillPath(c, 'M -12 -771 C -6.5 -774.5 -2 -772.8 0 -773.6 C 2 -772.8 6.5 -774.5 12 -771 C 6 -769.6 -6 -769.6 -12 -771 Z', S.lip);
  fillPath(c, 'M -10 -770.6 C -5.5 -763.5 5.5 -763.5 10 -770.6 C 5 -769.6 -5 -769.6 -10 -770.6 Z', S.lipLo);
  strokePath(c, 'M -12.5 -771 C -6 -769.6 6 -769.6 12.5 -771', S.skinDk, 1.5);
  // tripundra and the third eye
  for (let i = 0; i < 3; i++) { const y = -847 - i * 6.3; strokePath(c, `M -27 ${y + 1.5} Q 0 ${y - 3.2} 27 ${y + 1.5}`, S.ash, 3); }
  if (third > .02) {
    glow(c, 0, -853, 30 + 50 * third, S.third, .9 * third);
    fillPath(c, `M 0 ${-864 - 2 * third} C ${5 * third + 1} -858 ${5 * third + 1} -848 0 ${-842 + 2 * third} C ${-5 * third - 1} -848 ${-5 * third - 1} -858 0 ${-864 - 2 * third} Z`, mixCol('#8A1E14', '#FFD27A', third));
    ellipse(c, 0, -853, 1.6 * third, 4 * third, '#FFFBEA');
  } else strokePath(c, 'M 0 -862 L 0 -844', '#7A1C17', 2.3);
  // hair cap, parted in the middle, over the tops of the ears
  const CAP = 'M -51 -800 C -60 -846 -50 -893 0 -899 C 50 -893 60 -846 51 -800 C 51 -822 47 -846 39 -860 C 31 -872 12 -879 3 -872 L 0 -868 L -3 -872 C -12 -879 -31 -872 -39 -860 C -47 -846 -51 -822 -51 -800 Z';
  fillPath(c, CAP, S.hair);
  inside(c, CAP, () => { for (const s of [-1, 1]) for (let k = 0; k < 3; k++) strokePath(c, `M ${s * (5 + k * 3)} ${-886 + k * 3} C ${s * (26 + k * 3)} ${-886 + k * 4} ${s * (42 + k * 2)} ${-870 + k * 4} ${s * (50 - k)} ${-836 + k * 8}`, rgba(S.hairLt, .9), 1.6); });
  // jata: thick matted locks gathered up from the hairline into a high knot, a few spilling down
  const sw = Math.sin(t * .8) * .6, KX = 2 + sw, KY = -1004;
  fillPath(c, `M -46 -884 C -52 -920 -40 -960 ${KX - 20} ${KY + 4} L ${KX + 20} ${KY + 4} C 40 -960 52 -920 46 -884 Z`, S.hair);
  const locks = [-40, -27, -14, 0, 14, 27, 40];
  locks.forEach((x, i) => {
    const bend = (i - 3) * 4, P = [[x, -886], [x * .86 + bend, -920], [x * .55 + bend * .6 + KX * .4, -960], [KX + x * .18, KY + 8]];
    limb(c, P, [17, 16, 14, 10], i % 2 ? S.hair : mixCol(S.hair, S.hairLt, .3), false);
    strokePath(c, `M ${P[0][0] + 4} ${P[0][1] - 4} C ${P[1][0] + 4} ${P[1][1]} ${P[2][0] + 3} ${P[2][1]} ${P[3][0] + 2} ${P[3][1] + 4}`, rgba(S.hairLt, .8), 1.6);
  });
  // the knot: a lock wound round on top
  ellipse(c, KX, KY - 4, 26, 16, S.hair);
  strokePath(c, `M ${KX - 22} ${KY} C ${KX - 10} ${KY + 8} ${KX + 14} ${KY + 4} ${KX + 24} ${KY - 6}`, S.hairLt, 2);
  strokePath(c, `M ${KX - 18} ${KY - 10} C ${KX - 6} ${KY - 2} ${KX + 12} ${KY - 6} ${KX + 18} ${KY - 14}`, S.hairLt, 1.8);
  ellipse(c, KX + 4, KY - 20, 12, 10, S.hair); strokePath(c, `M ${KX - 4} ${KY - 20} C ${KX + 2} ${KY - 14} ${KX + 10} ${KY - 18} ${KX + 12} ${KY - 26}`, S.hairLt, 1.6);
  limb(c, [[-38, -950], [-52, -926], [-56, -896], [-58, -872]], [12, 11, 8, 2], S.hair, false);
  c.save(); c.scale(L, 1); inside(c, `M -46 -884 C -52 -920 -40 -960 -18 -1000 L 0 -1000 L 0 -884 Z`, () => fillPath(c, 'M -70 -880 L -70 -1030 L -16 -1030 C -26 -980 -34 -930 -26 -880 Z', rgba('#000', .22))); c.restore();
  for (let i = 0; i < 13; i++) { const u = i / 12, x = lerp(-44, 44, u), y = -887 + Math.sin(u * Math.PI) * 5; ellipse(c, x, y, 3.6, 3.6, S.bead); ellipse(c, x - .9, y - 1.1, 1.3, 1.1, S.beadLt); }
  glow(c, 34, -948, 54, '#DCE8FF', .35);
  c.fillStyle = S.moon; c.beginPath(); c.arc(34, -948, 15, -1.1, 2.3); c.arc(39.5, -953, 12.5, 2.15, -1.0, true); c.closePath(); c.fill();
}
// A cobra's raised hood seen from the front: belly scales facing us, the head on top. At (x, y), size k.
function cobra(c, x, y, rot, t, k = 1) {
  const S = SHV;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  fillPath(c, 'M 0 30 C -11 22 -25 8 -25 -8 C -25 -22 -15 -33 0 -35 C 15 -33 25 -22 25 -8 C 25 8 11 22 0 30 Z', S.snake);
  fillPath(c, 'M 0 26 C -6 18 -12 6 -12 -6 C -12 -16 -6 -22 0 -24 C 6 -22 12 -16 12 -6 C 12 6 6 18 0 26 Z', S.snakeLt);
  for (let i = 0; i < 6; i++) strokePath(c, `M ${-9 + Math.abs(i - 2) * 1.2} ${-17 + i * 7} Q 0 ${-15 + i * 7} ${9 - Math.abs(i - 2) * 1.2} ${-17 + i * 7}`, rgba(S.snakeSh, .6), 1.1);
  fillPath(c, 'M -9 -33 C -11 -44 -6 -52 0 -53 C 6 -52 11 -44 9 -33 C 5 -30 -5 -30 -9 -33 Z', S.snakeSh);
  for (const s of [-1, 1]) ellipse(c, s * 4.5, -44, 1.7, 1.5, '#F2D04A');
  if (Math.sin(t * 2.7) > .55) strokePath(c, 'M 0 -53 L 0 -59 l -2.5 -5 M 0 -59 l 2.5 -5', '#C8452B', 1.2);
  c.restore();
}

// ---------- body (front view) ----------
function shiva(c, o = {}) {
  const t = o.t || 0, L = o.light ?? 1, wind = o.wind ?? .4, S = SHV, br = Math.sin(t * 1.6) * 1.2;   // breathing
  const gust = wind * (1 + .35 * Math.sin(t * 2.3) + .2 * Math.sin(t * 5.1));
  // hair behind the shoulders: a fall of heavy locks, narrower than the shoulders, the ends lifted by the wind
  const g = gust;
  fillPath(c, 'M -50 -874 C -80 -850 -100 -800 -104 -740 L -90 -660 L 90 -660 L 104 -740 C 100 -800 80 -850 50 -874 Z', S.hair);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const x0 = s * (54 + i * 14), y0 = -850 + i * 22, ph = t * 1.7 + i * 1.3 + s, len = 150 + i * 16;
    limb(c, [[x0, y0], [s * (78 + i * 16) + g * 6, y0 + len * .4 + Math.sin(ph) * 3], [s * (92 + i * 15) + g * 16, y0 + len * .75 + Math.sin(ph + 1) * 6], [s * (100 + i * 14) + g * 28, y0 + len + Math.sin(ph + 2) * 9]], [30, 30, 22, 4], i % 2 ? S.hair : mixCol(S.hair, S.hairLt, .35), false);
  }
  // loose locks flying in the wind
  for (let i = 0; i < 4; i++) {
    const s = i % 2 ? 1 : -1, y = -830 + i * 30, ph = t * (2 + i * .3) + i;
    const P = [[s * 52, y], [s * 80 + gust * 16, y + 20 + Math.sin(ph) * 6], [s * 104 + gust * 34, y + 42 + Math.sin(ph + 1) * 10], [s * 124 + gust * 54, y + 70 + Math.sin(ph + 2) * 14]];
    limb(c, P, [13, 10, 6, 1.2], S.hair, false);
  }
  // trishul (behind the hand that holds it), with the damru tied under the prongs and a sash flying
  if (o.trishul !== false) {
    const X = -205;
    fillPath(c, `M ${X - 5} 10 L ${X - 5} -1130 L ${X + 5} -1130 L ${X + 5} 10 Z`, S.steelSh);
    fillPath(c, `M ${X - 1} 10 L ${X - 1} -1130 L ${X + 4} -1130 L ${X + 4} 10 Z`, S.steel);
    fillPath(c, `M ${X - 46} -1138 C ${X - 52} -1170 ${X - 48} -1205 ${X - 34} -1228 C ${X - 38} -1200 ${X - 36} -1170 ${X - 22} -1146 Z M ${X + 46} -1138 C ${X + 52} -1170 ${X + 48} -1205 ${X + 34} -1228 C ${X + 38} -1200 ${X + 36} -1170 ${X + 22} -1146 Z`, S.steel);
    fillPath(c, `M ${X - 48} -1128 C ${X - 30} -1150 ${X + 30} -1150 ${X + 48} -1128 L ${X + 40} -1122 C ${X + 20} -1138 ${X - 20} -1138 ${X - 40} -1122 Z`, S.steelSh);
    fillPath(c, `M ${X} -1268 C ${X + 14} -1240 ${X + 12} -1180 ${X + 6} -1138 L ${X - 6} -1138 C ${X - 12} -1180 ${X - 14} -1240 ${X} -1268 Z`, S.steel);
    fillPath(c, `M ${X} -1268 C ${X + 14} -1240 ${X + 12} -1180 ${X + 6} -1138 L ${X} -1138 Z`, S.steelSh);
    // sash knotted under the prongs, streaming with the wind
    const sy = -1112, f = (k, ph) => Math.sin(t * 6 - k * 3 + ph) * 10 * k;
    limb(c, [[X, sy], [X + 20 + gust * 22, sy + 10 + f(.3, 0)], [X + 44 + gust * 46, sy + 12 + f(.6, 0)], [X + 66 + gust * 70, sy + 24 + f(1, 0)]], [14, 16, 12, 3], S.sash, false);
    limb(c, [[X, sy + 4], [X + 16 + gust * 18, sy + 26 + f(.3, 1)], [X + 36 + gust * 40, sy + 40 + f(.6, 1)], [X + 54 + gust * 60, sy + 58 + f(1, 1)]], [11, 11, 8, 2], S.sashSh, false);
    // damru: an hourglass drum, its waist tied to the staff
    const dy = -1066 + Math.sin(t * 3) * 1.5;
    fillPath(c, `M ${X - 34} ${dy - 22} L ${X - 4} ${dy - 5} L ${X - 4} ${dy + 5} L ${X - 34} ${dy + 22} Z M ${X + 34} ${dy - 22} L ${X + 4} ${dy - 5} L ${X + 4} ${dy + 5} L ${X + 34} ${dy + 22} Z`, S.wood);
    ellipse(c, X - 34, dy, 6, 22, '#E8D3B0'); ellipse(c, X + 34, dy, 6, 22, '#E8D3B0');
    strokePath(c, `M ${X - 32} ${dy - 20} L ${X + 32} ${dy + 20} M ${X - 32} ${dy + 20} L ${X + 32} ${dy - 20}`, '#B83A28', 2);
    fillPath(c, `M ${X - 6} ${dy - 7} L ${X + 6} ${dy - 7} L ${X + 6} ${dy + 7} L ${X - 6} ${dy + 7} Z`, S.sash);
    for (const s of [-1, 1]) { const a = Math.sin(t * 3 + s) * .25; strokePath(c, `M ${X} ${dy + 6} q ${s * 14} ${18} ${s * 22 + a * 20} ${30}`, '#3A2418', 1.4); ellipse(c, X + s * 22 + a * 20, dy + 36, 4, 4, S.bead); }
  }
  // legs and feet (below the tiger skin)
  for (const s of [-1, 1]) {
    const leg = 'M 26 -300 L 86 -300 C 94 -240 95 -175 82 -122 C 74 -84 69 -58 66 -40 L 40 -40 C 37 -72 30 -112 27 -160 C 23 -212 22 -262 26 -300 Z';
    const foot = 'M 37 -44 C 35 -24 30 -8 34 0 L 98 0 C 103 -9 94 -17 81 -23 C 73 -28 69 -36 67 -44 Z';
    fillPath(c, s > 0 ? leg : mirrorX(leg), S.skin);
    fillPath(c, s > 0 ? foot : mirrorX(foot), S.skin);
    if (s === -L) { fillPath(c, s > 0 ? leg : mirrorX(leg), rgba(S.skinSh, .9)); fillPath(c, s > 0 ? foot : mirrorX(foot), rgba(S.skinSh, .9)); }
    else { const inner = 'M 20 -300 L 46 -300 C 42 -230 40 -160 48 -40 L 20 -40 Z'; inside(c, s > 0 ? leg : mirrorX(leg), () => fillPath(c, s > 0 ? inner : mirrorX(inner), rgba(S.skinSh, .7))); }
    ellipse(c, s * 53, -46, 17, 5, S.gold); ellipse(c, s * 53, -50, 15, 2, S.goldSh);   // anklets
    for (let i = 0; i < 4; i++) ellipse(c, s * (44 + i * 6), -36 - (i % 2) * 2, 2.2, 2.2, S.goldSh);
  }
  // tiger skin, knotted at the waist with a red sash
  const SKIRT = 'M -86 -484 C -98 -440 -114 -396 -122 -350 L -129 -292 L -112 -268 L -96 -291 L -76 -262 L -54 -290 L -32 -268 L -8 -292 L 14 -265 L 36 -290 L 58 -263 L 80 -291 L 102 -268 L 129 -292 L 122 -350 C 114 -396 98 -440 86 -484 Q 0 -474 -86 -484 Z';
  fillPath(c, SKIRT, S.tiger);
  inside(c, SKIRT, () => {
    const rnd = lcg(42);
    for (let row = 0; row < 5; row++) for (let k = 0; k < 6; k++) {
      const x = -125 + k * 50 + (row % 2) * 25 + (rnd() - .5) * 14, y = -468 + row * 40 + (rnd() - .5) * 10, w = 22 + rnd() * 18, a = (rnd() - .5) * .5, th = 5 + rnd() * 4;
      c.save(); c.translate(x, y); c.rotate(a); fillPath(c, `M ${-w} 0 C ${-w * .4} ${-th} ${w * .4} ${-th} ${w} ${th * .3} C ${w * .3} ${-th * .2} ${-w * .3} ${-th * .1} ${-w} 0 Z`, S.stripe); c.restore();
    }
    c.save(); if (L < 0) c.scale(-1, 1); fillPath(c, 'M -140 -490 C -100 -440 -70 -370 -64 -260 L -140 -260 Z', rgba(S.tigerSh, .75)); c.restore();
    fillPath(c, 'M -130 -296 L 130 -296 L 130 -250 L -130 -250 Z', rgba(S.tigerLt, .35));
  });
  // torso
  const TORSO = `M -84 -478 C -92 -540 -114 -600 -124 -642 C -132 -668 -140 -690 -150 -700 C -116 -720 -64 ${-722 + br} -27 -728 L 27 -728 C 64 ${-722 + br} 116 -720 150 -700 C 140 -690 132 -668 124 -642 C 114 -600 92 -540 84 -478 Z`;
  fillPath(c, TORSO, S.skin);
  inside(c, TORSO, () => {
    c.save(); if (L < 0) c.scale(-1, 1);
    fillPath(c, 'M -84 -478 C -92 -540 -114 -600 -124 -642 C -132 -668 -140 -690 -160 -700 L -150 -700 C -116 -690 -84 -660 -74 -620 C -64 -580 -68 -520 -62 -478 Z', S.skinSh);
    c.restore();
    for (const s of [-1, 1]) strokePath(c, `M ${s * 112} ${-628 + br} C ${s * 84} ${-602 + br} ${s * 40} ${-598 + br} ${s * 6} ${-612 + br}`, S.skinSh, 4);   // pectorals
    strokePath(c, `M 0 ${-668 + br} L 0 -618`, rgba(S.skinSh, .7), 2.5);
    for (const [y, w] of [[-572, 26], [-536, 24]]) for (const s of [-1, 1]) strokePath(c, `M ${s * 6} ${y} q ${s * w / 2} -3 ${s * w} 2`, rgba(S.skinSh, .7), 2.4);
    strokePath(c, 'M 0 -590 L 0 -505', rgba(S.skinSh, .5), 2);
    ellipse(c, 0, -500, 3.5, 5, S.skinDk);
  });
  // sash at the waist, its knot and ends
  fillPath(c, 'M -88 -492 Q 0 -480 88 -492 L 86 -470 Q 0 -460 -86 -470 Z', S.sash);
  strokePath(c, 'M -88 -490 Q 0 -478 88 -490', S.gold, 2.5); strokePath(c, 'M -86 -471 Q 0 -461 86 -471', S.gold, 2.5);
  ellipse(c, 18, -476, 11, 9, S.sashSh);
  limb(c, [[18, -472], [22 + gust * 6, -440], [26 + gust * 12, -405]], [14, 12, 8], S.sash, false);
  limb(c, [[22, -472], [34 + gust * 8, -446], [44 + gust * 16, -418]], [10, 9, 6], S.sashSh, false);
  shivaHead(c, o);
  // rudraksha mala on the chest
  for (let i = 0; i <= 22; i++) { const u = i / 22, x = lerp(-34, 34, u), y = -716 + Math.pow(Math.sin(u * Math.PI), .8) * 112 + br; ellipse(c, x, y, 4.3, 4.3, S.bead); ellipse(c, x - 1.1, y - 1.3, 1.5, 1.3, S.beadLt); }
  ellipse(c, 0, -600 + br, 6.5, 7.5, S.gold);
  // the snake: coiled round the neck, its hood raised over the right shoulder (screen left), tail on the chest
  const hs = Math.sin(t * 1.1) * 3, hn = Math.sin(t * .7) * .06 - .12;
  limb(c, [[-30, -712 + br], [-56, -720], [-74, -742], [-82, -768], [-84 + hs, -790]], [17, 17, 16, 15, 14], S.snake, false);
  limb(c, [[46, -716 + br], [20, -703 + br], [-10, -702 + br], [-36, -710 + br], [-50, -716]], [18, 19, 19, 18, 17], S.snake, false);
  limb(c, [[46, -716 + br], [20, -708 + br], [-10, -707 + br], [-36, -714 + br]], [6, 6, 6, 6], rgba(S.snakeLt, .6), false);
  limb(c, [[46, -716 + br], [64, -694], [76, -664], [72, -634], [62, -614]], [18, 16, 13, 8, 2], S.snake, false);
  limb(c, [[50, -712 + br], [66, -692], [76, -664]], [5, 5, 4], rgba(S.snakeLt, .5), false);
  cobra(c, -84 + hs, -800, hn, t, 1);
  // arms
  const arm = (s, mode) => figure(c, (a) => {
    const sx = s * 140;
    ellipse(a, s * 146, -680, 33, 42, S.skin, s * -.2);    // deltoid
    if (mode === 'trishul') {
      limb(a, [[sx, -690], [s * 160, -620], [s * 178, -560]], [64, 56, 46], S.skin);
      limb(a, [[s * 178, -560], [s * 190, -514], [s * 198, -474]], [46, 42, 34], S.skin);
      if (s === -L) { limb(a, [[sx - s * 6, -690], [s * 166, -620], [s * 184, -560], [s * 196, -514], [s * 204, -474]], [26, 24, 20, 18, 14], rgba(S.skinSh, .9)); }
      // fist around the staff
      fillPath(a, `M ${s * 180} -478 C ${s * 178} -458 ${s * 182} -436 ${s * 194} -428 L ${s * 222} -430 C ${s * 228} -446 ${s * 228} -466 ${s * 222} -480 Z`, S.skin);
      for (let i = 0; i < 3; i++) strokePath(a, `M ${s * 186} ${-468 + i * 11} L ${s * 218} ${-468 + i * 11}`, S.skinSh, 2);
      fillPath(a, `M ${s * 216} -482 C ${s * 230} -478 ${s * 232} -462 ${s * 222} -452 L ${s * 210} -458 Z`, S.skinSh);   // thumb over the staff
    } else if (mode === 'abhaya') {
      limb(a, [[sx, -690], [s * 176, -616], [s * 206, -548]], [64, 56, 46], S.skin);
      limb(a, [[s * 206, -548], [s * 212, -600], [s * 214, -650]], [46, 42, 34], S.skin);
      if (s === -L) limb(a, [[s * 146, -690], [s * 184, -614], [s * 214, -548]], [26, 22, 18], rgba(S.skinSh, .9));
      else limb(a, [[s * 214, -560], [s * 222, -600], [s * 224, -646]], [18, 16, 12], rgba(S.skinSh, .6));
      // open palm facing us, fingers up, thumb toward the body
      const hx = s * 214, hy = -652;
      const PALM = `M ${hx - 20} ${hy} C ${hx - 22} ${hy - 18} ${hx - 22} ${hy - 36} ${hx - 20} ${hy - 48} L ${hx + 20} ${hy - 48} C ${hx + 22} ${hy - 36} ${hx + 21} ${hy - 18} ${hx + 19} ${hy} Z`;
      [[-14, 31], [-4.6, 37], [4.8, 35], [14, 27]].forEach(([fx, len]) => limb(a, [[hx - s * fx, hy - 44], [hx - s * fx * 1.06, hy - 44 - len]], [10.5, 9], S.skin));
      fillPath(a, PALM, S.skin);
      inside(a, PALM, () => { ellipse(a, hx, hy - 22, 13, 15, rgba(S.palm, .8)); strokePath(a, `M ${hx - 14} ${hy - 30} Q ${hx} ${hy - 36} ${hx + 14} ${hy - 32}`, rgba(S.skinSh, .7), 1.4); });
      for (const fx of [-9.3, 0, 9.4]) strokePath(a, `M ${hx - s * fx} ${hy - 48} L ${hx - s * fx * 1.05} ${hy - 70}`, rgba(S.skinSh, .9), 1.6);
      limb(a, [[hx - s * 15, hy - 10], [hx - s * 27, hy - 24], [hx - s * 33, hy - 40]], [15, 12, 9.5], S.skin);
    } else {
      limb(a, [[sx, -690], [s * 162, -620], [s * 172, -548]], [64, 56, 46], S.skin);
      limb(a, [[s * 172, -548], [s * 178, -470], [s * 180, -400]], [46, 40, 32], S.skin);
      ellipse(a, s * 180, -380, 18, 26, S.skin);
    }
    // armlet and bracelet (gold with a rudraksha), drawn on the limb
    const up = mode === 'abhaya' ? [s * 176, -616] : [s * 162, -622], wr = mode === 'trishul' ? [s * 200, -486] : mode === 'abhaya' ? [s * 214, -640] : [s * 179, -420];
    ellipse(a, up[0], up[1], 30, 7, S.gold, s * .25); ellipse(a, up[0], up[1] + 2, 6, 6, S.bead);
    ellipse(a, wr[0], wr[1], 19, 6, S.gold, mode === 'trishul' ? s * .2 : 0);
  }, o.armFx || {});
  arm(-1, 'trishul');
  arm(1, o.arm || 'abhaya');
}

// ---------- Nataraja, the dance (silhouette pose; reads best dark with a rim light) ----------
// As the bronzes have it: the right foot (screen left) on Apasmara; the left leg raised and swung across the body; four
// arms: damru (back right), fire (back left), abhaya (front right), gaja hasta (front left, across the chest, the hand
// drooping toward the raised foot). The locks fly out on both sides. o: t, col (fill), fire (0..1, the flame in the hand).
function nataraja(c, o = {}) {
  const t = o.t || 0, col = o.col || '#1C1420', sw = Math.sin(t * 1.4) * .5;
  // flying locks, fanned out on both sides of the head, waving
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) {
    const y0 = -850 + i * 13, len = 250 + (i % 3) * 30 - i * 8, ph = t * 2.2 + i * .8 + (s > 0 ? 1.3 : 0), dip = i * 18;
    const P = [[s * 34, y0], [s * (34 + len * .3), y0 - 22 + dip * .2 + Math.sin(ph) * 8], [s * (34 + len * .62), y0 - 6 + dip * .6 + Math.sin(ph + 1) * 16], [s * (34 + len), y0 + 18 + dip + Math.sin(ph + 2) * 24]];
    limb(c, P, [30, 24, 14, 2], col, false);
  }
  // Apasmara, lying under the right foot, his head raised
  fillPath(c, 'M -230 0 C -232 -26 -214 -40 -190 -40 C -150 -44 -100 -48 -60 -42 C -36 -38 -20 -24 -16 0 Z', col);
  ellipse(c, -236, -40, 20, 18, col);
  // standing leg (right), knee bent out
  limb(c, [[-30, -470], [-92, -300], [-74, -110], [-70, -56]], [72, 54, 36, 28], col);
  fillPath(c, 'M -92 -62 C -104 -50 -116 -46 -128 -40 L -40 -40 C -46 -52 -54 -60 -58 -64 Z', col);
  // raised leg (left): the thigh lifted across in front of the hips, the shin hanging, the foot pointing down
  limb(c, [[34, -476], [-40, -486], [-120, -470], [-168, -458]], [70, 62, 52, 42], col);
  limb(c, [[-168, -458], [-196, -400], [-218, -336], [-226, -300]], [42, 36, 28, 22], col);
  fillPath(c, 'M -238 -306 C -226 -318 -212 -316 -210 -300 C -214 -276 -226 -254 -244 -240 C -248 -262 -246 -286 -238 -306 Z', col);
  // waist cloth, sash ends flying
  fillPath(c, 'M -70 -520 C -96 -486 -100 -456 -86 -430 L 66 -444 C 86 -470 86 -500 70 -520 Z', col);
  for (const s of [-1, 1]) limb(c, [[s * 64, -490], [s * 150, -500 + Math.sin(t * 3 + s) * 12], [s * 250, -470 + Math.sin(t * 3 + 1 + s) * 22]], [16, 11, 2], col, false);
  // torso
  fillPath(c, 'M -70 -510 C -80 -570 -98 -630 -118 -690 C -90 -712 -46 -722 -20 -728 L 22 -728 C 52 -722 96 -712 120 -690 C 102 -630 86 -570 72 -510 Z', col);
  // back arms: damru up on screen left, the flame up on screen right
  limb(c, [[-112, -688], [-200, -760], [-236, -856], [-238, -930]], [48, 38, 30, 24], col);
  fillPath(c, 'M -272 -954 L -248 -940 L -248 -926 L -272 -912 Z M -204 -954 L -228 -940 L -228 -926 L -204 -912 Z', col);
  ellipse(c, -238, -933, 12, 6, col);
  limb(c, [[112, -688], [200, -748], [244, -840], [250, -906]], [48, 38, 30, 24], col);
  ellipse(c, 252, -918, 15, 11, col);
  // front right: abhaya, the forearm up and the palm open
  limb(c, [[-104, -676], [-170, -604], [-178, -664], [-176, -716]], [44, 36, 30, 24], col);
  fillPath(c, 'M -194 -716 C -196 -746 -188 -772 -176 -778 C -164 -772 -156 -746 -158 -716 Z', col);
  // front left: gaja hasta, across the chest, the hand drooping toward the raised foot
  limb(c, [[104, -676], [60, -612], [-20, -590], [-96, -566], [-140, -530]], [44, 38, 32, 28, 22], col);
  fillPath(c, 'M -134 -544 C -156 -530 -172 -508 -176 -488 C -160 -490 -140 -506 -126 -520 Z', col);
  // neck, head, the crown of locks, earrings
  fillPath(c, 'M -22 -726 L -20 -760 L 20 -760 L 22 -726 Z', col);
  ellipse(c, 2 + sw, -808, 40, 54, col);
  fillPath(c, `M ${-42 + sw} -846 C ${-46 + sw} -890 ${-30 + sw} -930 ${2 + sw} -944 C ${34 + sw} -930 ${50 + sw} -890 ${46 + sw} -846 Z`, col);
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .32; limb(c, [[2 + sw + Math.cos(a) * 30, -900 + Math.sin(a) * 30], [2 + sw + Math.cos(a) * 64, -900 + Math.sin(a) * 60]], [12, 3], col, false); }
  for (const s of [-1, 1]) ellipse(c, s * 44 + sw, -786, 7, 11, col);
  // the flame in the back-left hand
  const f = o.fire ?? 1;
  if (f > 0) {
    const fx = 252, fy = -928;
    glow(c, fx, fy - 20, 120, '#FF9A3C', .8 * f);
    for (let i = 0; i < 3; i++) { const h = 50 + 16 * Math.sin(t * 9 + i * 2), w = 18 - i * 4; fillPath(c, `M ${fx - w} ${fy} C ${fx - w} ${fy - h * .5} ${fx + Math.sin(t * 7 + i) * 8} ${fy - h * .8} ${fx + Math.sin(t * 6 + i) * 6} ${fy - h} C ${fx + w * .8} ${fy - h * .6} ${fx + w} ${fy - h * .3} ${fx + w} ${fy} Z`, ['#FF7A2A', '#FFB347', '#FFF0B8'][i]); }
  }
}
