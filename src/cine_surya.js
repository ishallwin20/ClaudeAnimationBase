// cine_surya.js: Surya, the sun god, for the cinematic engine (cine.js). Front view, in colour, lit by figure().
// Units as cine_shiva.js: the feet at (0, 0), up is -y, the face centred at (0, -815), the crown's tip at about -1040;
// suryaHead() draws the head at its rest position, so a close-up is translate, scale(k), translate(0, 815).
// As the temple images have him: golden skin, a tall gold kirita, great gold kundalas, a gold kavach (breastplate) with
// a sun medallion, a saffron dhoti to the shins, both hands raised to the shoulders, each holding a pink lotus.
// The blazing disc behind him is not part of the figure: draw sunDisc() (cine_sets.js) behind him, so figure() lights
// only him.
//
// surya(c, o): o (all optional): t, light (1 | -1), eyes (0 closed .. 1 open; closed with a furrowed brow, he is
//   falling unconscious), wind, look ([x, y]), armFx (figure() options per arm), lotus (false to leave the hands empty).
// suryaHead(c, o): the head alone: t, light, eyes, look.
const SUR = {
  skin: '#D98A4A', skinSh: '#B0642F', skinDk: '#7A3E1C', palm: '#EDB07A', lip: '#7E3220', lipLo: '#A24A30',
  hair: '#1A0F0E', hairLt: '#3A2420', eyeW: '#F2E8D8', iris: '#2B1A10', brow: '#1A0F0C', tilak: '#C81E2A',
  gold: '#E8B442', goldSh: '#9A6A1E', goldLt: '#FFE38E', ruby: '#C81E2A', emerald: '#1E8A5A',
  dhoti: '#E0602A', dhotiSh: '#A8401C', dhotiLt: '#F5904A', lotus: '#F59AB0', lotusSh: '#D8607E', stem: '#3E7A3A',
};
const SUR_FACE = 'M 0 -746 C 9 -746 16 -748 22 -752 C 32 -760 40 -773 44 -788 C 47 -800 48.5 -812 48.5 -824 C 49 -844 46 -861 38 -872 C 28 -883 -28 -883 -38 -872 C -46 -861 -49 -844 -48.5 -824 C -48.5 -812 -47 -800 -44 -788 C -40 -773 -32 -760 -22 -752 C -16 -748 -9 -746 0 -746 Z';
const SUR_NECK = 'M -31 -700 C -29 -728 -31 -756 -36 -792 L 36 -792 C 31 -756 29 -728 31 -700 Z';

// ---------- head ----------
function suryaHead(c, o = {}) {
  const t = o.t || 0, eyes = o.eyes ?? 1, L = o.light ?? 1, S = SUR, pain = 1 - eyes;
  fillPath(c, SUR_NECK, S.skin);
  inside(c, SUR_NECK, () => {
    c.save(); c.scale(L, 1); fillPath(c, 'M -40 -800 L -20 -800 C -18 -760 -20 -730 -24 -700 L -40 -700 Z', rgba(S.skinSh, .9)); c.restore();
    fillPath(c, 'M -46 -800 C -34 -766 -14 -754 0 -754 C 14 -754 34 -766 46 -800 L 46 -770 C 30 -742 -30 -742 -46 -770 Z', rgba(S.skinDk, .6));
  });
  // curls falling behind the ears to the shoulders
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) limb(c, [[s * (44 + i * 4), -850], [s * (54 + i * 6), -810], [s * (60 + i * 8), -770 + Math.sin(t * 1.5 + i) * 2], [s * (66 + i * 10), -728]], [16, 17, 14, 4], i % 2 ? S.hairLt : S.hair, false);
  // ears with the great kundalas (sun discs)
  for (const s of [-1, 1]) {
    fillPath(c, `M ${s * 45} -836 C ${s * 56} -840 ${s * 59} -824 ${s * 57} -811 C ${s * 56} -801 ${s * 51} -795 ${s * 45} -797 Z`, s === -L ? S.skinSh : S.skin);
    const sw = Math.sin(t * 1.3 + s) * .8, kx = s * 54 + sw, ky = -772;
    for (let k = 0; k < 12; k++) { const a = k * TAU / 12; fillPath(c, `M ${kx + Math.cos(a - .18) * 11} ${ky + Math.sin(a - .18) * 11} L ${kx + Math.cos(a) * 19} ${ky + Math.sin(a) * 19} L ${kx + Math.cos(a + .18) * 11} ${ky + Math.sin(a + .18) * 11} Z`, S.gold); }
    ellipse(c, kx, ky, 12, 12, S.gold); ellipse(c, kx, ky, 7, 7, S.ruby); ellipse(c, kx - 2, ky - 2, 2.2, 2.2, '#FFB0A0');
  }
  // face
  fillPath(c, SUR_FACE, S.skin);
  inside(c, SUR_FACE, () => {
    c.save(); c.scale(L, 1);
    fillPath(c, 'M -60 -900 L -30 -884 C -36 -862 -36 -840 -34 -822 C -33 -806 -30 -790 -25 -777 C -19 -765 -11 -756 -3 -748 L -60 -740 Z', S.skinSh);
    fillPath(c, 'M -2 -830 C -5 -815 -8 -802 -11 -792 C -8 -788 -4 -787.5 -1 -789 C -2 -800 -2 -815 -2 -830 Z', S.skinSh);
    strokePath(c, 'M 2.5 -826 C 3.5 -812 4.5 -801 4 -794', rgba('#FFD8A8', .6), 2.4);
    c.restore();
    for (const s of [-1, 1]) ellipse(c, s * 19, -824, 15, 7, rgba(S.skinDk, .14));
    ellipse(c, 0, -783.5, 7, 2.2, rgba(S.skinDk, .55));
    ellipse(c, 0, -760.5, 8, 2.8, rgba(S.skinSh, .9));
  });
  // eyes: open, or shut with the brow drawn together (falling)
  for (const s of [-1, 1]) {
    const ex = s * 19, ey = -820, up = lerp(4, -8, eyes), lw = 12.5;
    const shape = `M ${ex - lw} ${ey + 1} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw} ${ey - 1} Q ${ex} ${ey + 6.5} ${ex - lw} ${ey + 1} Z`;
    if (eyes > .04) {
      fillPath(c, shape, S.eyeW);
      inside(c, shape, () => {
        const lx = (o.look ? o.look[0] : 0) * 4, ly = (o.look ? o.look[1] : 0) * 2;
        ellipse(c, ex + lx, ey + .5 + ly, 5.4, 6, S.iris); ellipse(c, ex + lx, ey + .5 + ly, 2.5, 2.9, '#0D0907');
        ellipse(c, ex + lx + 1.7, ey - 1.5 + ly, 1.3, 1.3, '#FFF8EC');
        ellipse(c, ex, ey + up * .9, lw + 2, 5, rgba(S.skinDk, .4));
      });
    }
    strokePath(c, `M ${ex - lw - 1} ${ey + 1.5} Q ${ex - 2 * s} ${ey + up * 1.25} ${ex + lw + 1} ${ey - .5}`, S.brow, 2.5);
    if (eyes < .3) for (let i = 0; i < 4; i++) { const u = (i + 1) / 5, x = lerp(ex - lw, ex + lw, u), y = ey + 1.5 + (up * 1.25 - 1) * 2 * u * (1 - u) * 1.2; strokePath(c, `M ${x} ${y} l ${(u - .5) * 2} 2.4`, S.brow, 1); }
    const by = pain * 3, bi = pain * 4;   // in pain the inner ends of the brows rise
    fillPath(c, `M ${s * 6} ${-830.5 - bi} C ${s * 14} ${-838 - bi * .6} ${s * 26} ${-839.5 + by * .3} ${s * 35} ${-834 + by} C ${s * 26} ${-835 + by * .3} ${s * 15} ${-833.5 - bi * .5} ${s * 7} ${-827 - bi} Z`, S.brow);
  }
  // nose tip, moustache (thin), mouth
  strokePath(c, 'M -7.5 -790 C -4.5 -786.5 4.5 -786.5 7.5 -790', S.skinDk, 1.9);
  for (const s of [-1, 1]) fillPath(c, `M 0 -777 C ${s * 8} -779 ${s * 16} -778 ${s * 20} -772 C ${s * 14} -775 ${s * 7} -775 0 -774 Z`, rgba(S.hair, .8));
  const m = pain * 2.5;
  fillPath(c, `M -12 ${-771 + m * .4} C -6.5 -774.5 -2 -772.8 0 -773.6 C 2 -772.8 6.5 -774.5 12 ${-771 + m * .4} C 6 -769.6 -6 -769.6 -12 ${-771 + m * .4} Z`, S.lip);
  fillPath(c, `M -10 -770.6 C -5.5 ${-763.5 + m} 5.5 ${-763.5 + m} 10 -770.6 C 5 -769.6 -5 -769.6 -10 -770.6 Z`, S.lipLo);
  // a red tilak
  fillPath(c, 'M 0 -864 C 3 -856 3 -848 0 -842 C -3 -848 -3 -856 0 -864 Z', S.tilak);
  // hair under the crown's band
  fillPath(c, 'M -51 -800 C -60 -846 -50 -885 0 -890 C 50 -885 60 -846 51 -800 C 51 -822 47 -846 39 -860 C 30 -870 -30 -870 -39 -860 C -47 -846 -51 -822 -51 -800 Z', S.hair);
  suryaCrown(c, t, L);
}
// the kirita: a tall tiered gold crown, a jewelled band over the brow, a lotus-bud finial
function suryaCrown(c, t, L) {
  const S = SUR;
  const BODY = 'M -50 -872 C -52 -900 -48 -940 -40 -980 C -34 -1006 -22 -1022 0 -1030 C 22 -1022 34 -1006 40 -980 C 48 -940 52 -900 50 -872 Z';
  fillPath(c, BODY, S.gold);
  inside(c, BODY, () => {
    c.save(); c.scale(L, 1); fillPath(c, 'M -60 -870 L -60 -1040 L -12 -1040 C -22 -990 -30 -930 -26 -870 Z', rgba(S.goldSh, .7)); c.restore();
    for (let i = 0; i < 4; i++) { const y = -905 - i * 30, w = 50 - i * 6; strokePath(c, `M ${-w} ${y} Q 0 ${y - 8} ${w} ${y}`, S.goldSh, 3); for (let k = -2; k <= 2; k++) ellipse(c, k * (w / 3), y - 10 + Math.abs(k) * 1.5, 3.4, 3.4, i % 2 ? S.ruby : S.emerald); }
    strokePath(c, 'M 6 -1020 C 14 -980 18 -930 16 -880', rgba(S.goldLt, .7), 3);
  });
  // the band over the brow, with flaps over the ears
  fillPath(c, 'M -56 -862 C -40 -880 40 -880 56 -862 L 54 -846 C 36 -862 -36 -862 -54 -846 Z', S.gold);
  strokePath(c, 'M -56 -862 C -40 -880 40 -880 56 -862', S.goldSh, 2);
  for (let k = -3; k <= 3; k++) ellipse(c, k * 14, -866 + Math.abs(k) * 1.6, 4.2, 4.2, k === 0 ? S.ruby : S.goldLt);
  for (const s of [-1, 1]) { ellipse(c, s * 56, -858, 10, 14, S.gold); ellipse(c, s * 56, -858, 5, 7, S.ruby); }   // rosettes at the band's ends
  // the centre plaque: a small sun
  ellipse(c, 0, -930, 16, 16, S.goldLt); ellipse(c, 0, -930, 9, 9, S.ruby);
  for (let k = 0; k < 8; k++) { const a = k * TAU / 8; strokePath(c, `M ${Math.cos(a) * 18} ${-930 + Math.sin(a) * 18} L ${Math.cos(a) * 25} ${-930 + Math.sin(a) * 25}`, S.goldSh, 2.6); }
  // the finial: a gold lotus bud
  fillPath(c, 'M 0 -1066 C 12 -1050 14 -1036 0 -1026 C -14 -1036 -12 -1050 0 -1066 Z', S.gold);
  strokePath(c, 'M 0 -1060 L 0 -1030', S.goldSh, 2);
}
// a pink lotus in bloom at (x, y) (its base), facing us
function suryaLotus(c, x, y, k = 1, t = 0) {
  const S = SUR;
  c.save(); c.translate(x, y); c.scale(k, k); c.rotate(Math.sin(t * 1.1 + x) * .03);
  for (const [a, l, w, col] of [[-1.1, 46, 18, S.lotusSh], [1.1, 46, 18, S.lotusSh], [-.6, 56, 20, S.lotus], [.6, 56, 20, S.lotus], [0, 62, 22, S.lotus]]) {
    c.save(); c.rotate(a); fillPath(c, `M 0 0 C ${-w} ${-l * .4} ${-w * .6} ${-l * .85} 0 ${-l} C ${w * .6} ${-l * .85} ${w} ${-l * .4} 0 0 Z`, col); strokePath(c, `M 0 -6 L 0 ${-l * .8}`, rgba(S.lotusSh, .6), 1.5); c.restore();
  }
  ellipse(c, 0, -8, 12, 6, S.gold);
  c.restore();
}

// ---------- body (front view) ----------
function surya(c, o = {}) {
  const t = o.t || 0, L = o.light ?? 1, S = SUR, br = Math.sin(t * 1.4) * 1.2, wind = o.wind ?? .3;
  const gust = wind * (1 + .35 * Math.sin(t * 2.3) + .2 * Math.sin(t * 5.1));
  // hair behind the shoulders
  fillPath(c, 'M -50 -874 C -80 -850 -96 -800 -98 -740 L -86 -680 L 86 -680 L 98 -740 C 96 -800 80 -850 50 -874 Z', S.hair);
  // feet and shins below the dhoti
  for (const s of [-1, 1]) {
    const shin = 'M 30 -150 L 78 -150 C 76 -110 70 -70 66 -40 L 40 -40 C 38 -70 32 -110 30 -150 Z';
    const foot = 'M 37 -44 C 35 -24 30 -8 34 0 L 98 0 C 103 -9 94 -17 81 -23 C 73 -28 69 -36 67 -44 Z';
    fillPath(c, s > 0 ? shin : mirrorX(shin), s === -L ? S.skinSh : S.skin);
    fillPath(c, s > 0 ? foot : mirrorX(foot), s === -L ? S.skinSh : S.skin);
    ellipse(c, s * 53, -46, 17, 5, S.gold); ellipse(c, s * 53, -50, 15, 2, S.goldSh);
  }
  // the dhoti: full to the shins, pleats down the front, a gold border
  const DHOTI = 'M -90 -490 C -102 -430 -118 -360 -122 -280 C -124 -220 -112 -170 -96 -140 L -24 -146 L 0 -132 L 24 -146 L 96 -140 C 112 -170 124 -220 122 -280 C 118 -360 102 -430 90 -490 Q 0 -478 -90 -490 Z';
  fillPath(c, DHOTI, S.dhoti);
  inside(c, DHOTI, () => {
    c.save(); if (L < 0) c.scale(-1, 1); fillPath(c, 'M -140 -490 C -100 -420 -80 -300 -86 -130 L -140 -130 Z', rgba(S.dhotiSh, .75)); c.restore();
    for (let i = -2; i <= 2; i++) { const x = i * 11; strokePath(c, `M ${x} -470 C ${x + gust * 3} -360 ${x - 2 + gust * 6} -250 ${x + i * 3 + gust * 8} -138`, rgba(S.dhotiSh, .8), 2.4); strokePath(c, `M ${x + 4} -470 C ${x + 4} -360 ${x + 2} -250 ${x + 4 + i * 3} -140`, rgba(S.dhotiLt, .5), 1.4); }
    for (const s of [-1, 1]) strokePath(c, `M ${s * 40} -440 C ${s * 70} -360 ${s * 86} -260 ${s * 92} -160`, rgba(S.dhotiSh, .5), 2);
    strokePath(c, 'M -96 -150 L -24 -156 L 0 -142 L 24 -156 L 96 -150', S.gold, 7);
  });
  // torso, and the kavach over it
  const TORSO = `M -84 -478 C -92 -540 -114 -600 -124 -642 C -132 -668 -140 -690 -150 -700 C -116 -720 -64 ${-722 + br} -27 -728 L 27 -728 C 64 ${-722 + br} 116 -720 150 -700 C 140 -690 132 -668 124 -642 C 114 -600 92 -540 84 -478 Z`;
  fillPath(c, TORSO, S.skin);
  const KAV = `M -100 -560 C -112 -610 -126 -660 -132 -700 C -100 -716 -60 ${-720 + br} -26 -724 L 26 -724 C 60 ${-720 + br} 100 -716 132 -700 C 126 -660 112 -610 100 -560 C 60 -540 -60 -540 -100 -560 Z`;
  fillPath(c, KAV, S.gold);
  inside(c, KAV, () => {
    c.save(); if (L < 0) c.scale(-1, 1); fillPath(c, 'M -140 -560 L -140 -720 L -110 -720 C -100 -660 -84 -600 -70 -550 Z', rgba(S.goldSh, .75)); c.restore();
    for (const s of [-1, 1]) strokePath(c, `M ${s * 110} ${-640 + br} C ${s * 80} ${-612 + br} ${s * 40} ${-606 + br} ${s * 8} ${-618 + br}`, S.goldSh, 3.5);
    for (let i = 0; i < 3; i++) strokePath(c, `M -96 ${-574 + i * 0} C -50 ${-556} 50 ${-556} 96 -574`, rgba(S.goldSh, .6), 2);
    strokePath(c, 'M 30 -716 C 70 -706 100 -690 118 -668', rgba(S.goldLt, .7), 3);
  });
  // the sun medallion on the chest
  const my = -640 + br;
  for (let k = 0; k < 16; k++) { const a = k * TAU / 16; fillPath(c, `M ${Math.cos(a - .14) * 22} ${my + Math.sin(a - .14) * 22} L ${Math.cos(a) * 36} ${my + Math.sin(a) * 36} L ${Math.cos(a + .14) * 22} ${my + Math.sin(a + .14) * 22} Z`, S.goldLt); }
  ellipse(c, 0, my, 24, 24, S.goldLt); ellipse(c, 0, my, 17, 17, S.ruby); ellipse(c, -5, my - 5, 5, 5, rgba('#FFC0B0', .7));
  // the bare belly between the kavach and the belt, the belt
  inside(c, TORSO, () => strokePath(c, 'M 0 -540 L 0 -505', rgba(S.skinSh, .5), 2));
  fillPath(c, 'M -90 -500 Q 0 -488 90 -500 L 88 -474 Q 0 -462 -88 -474 Z', S.gold);
  strokePath(c, 'M -88 -486 Q 0 -474 88 -486', S.goldSh, 2.4);
  ellipse(c, 0, -480, 14, 12, S.ruby); ellipse(c, 0, -480, 18, 16, rgba(S.goldLt, .0));
  // a sash at the hips, its ends streaming
  for (const s of [-1, 1]) limb(c, [[s * 80, -470], [s * (100 + gust * 10), -420], [s * (112 + gust * 22), -370], [s * (118 + gust * 34), -320]], [12, 12, 10, 3], s > 0 ? S.ruby : '#A0141E', false);
  suryaHead(c, o);
  // necklaces
  for (let r = 0; r < 2; r++) for (let i = 0; i <= 20; i++) { const u = i / 20, x = lerp(-36 - r * 8, 36 + r * 8, u), y = -720 + Math.pow(Math.sin(u * Math.PI), .8) * (40 + r * 26) + br; ellipse(c, x, y, 4 - r * .6, 4 - r * .6, r ? S.goldLt : S.gold); }
  // shoulder pauldrons of the kavach
  for (const s of [-1, 1]) { fillPath(c, `M ${s * 108} -722 C ${s * 140} -730 ${s * 172} -712 ${s * 182} -680 C ${s * 160} -690 ${s * 130} -694 ${s * 112} -690 Z`, S.gold); strokePath(c, `M ${s * 116} -712 C ${s * 140} -716 ${s * 162} -704 ${s * 176} -684`, S.goldSh, 2); }
  // arms: both raised to the shoulders, each fist holding a lotus on a stem
  const arm = (s) => figure(c, (a) => {
    const sx = s * 140;
    ellipse(a, s * 146, -672, 33, 40, S.skin, s * -.2);
    limb(a, [[sx, -680], [s * 176, -612], [s * 206, -548]], [62, 54, 46], S.skin);
    limb(a, [[s * 206, -548], [s * 212, -600], [s * 214, -650]], [46, 42, 34], S.skin);
    if (s === -L) limb(a, [[s * 146, -680], [s * 184, -610], [s * 214, -548]], [26, 22, 18], rgba(S.skinSh, .9));
    else limb(a, [[s * 214, -560], [s * 222, -600], [s * 224, -646]], [18, 16, 12], rgba(S.skinSh, .6));
    ellipse(a, s * 176, -612, 30, 7, S.gold, s * .25); ellipse(a, s * 214, -640, 19, 6, S.gold);
    // the fist, the stem up through it, the lotus over the shoulder
    const hx = s * 214, hy = -664;
    if (o.lotus !== false) { limb(a, [[hx, hy + 30], [hx + s * 2, hy - 30], [hx + s * 6, hy - 90]], [6, 6, 5], S.stem, false); suryaLotus(a, hx + s * 6, hy - 88, 1.1, t); }
    fillPath(a, `M ${hx - 20} ${hy + 16} C ${hx - 24} ${hy} ${hx - 22} ${hy - 18} ${hx - 14} ${hy - 22} L ${hx + 14} ${hy - 22} C ${hx + 22} ${hy - 18} ${hx + 24} ${hy} ${hx + 20} ${hy + 16} Z`, S.skin);
    for (let i = 0; i < 3; i++) strokePath(a, `M ${hx - 16} ${hy - 12 + i * 9} L ${hx + 16} ${hy - 12 + i * 9}`, S.skinSh, 1.8);
  }, o.armFx || {});
  arm(-1); arm(1);
}
