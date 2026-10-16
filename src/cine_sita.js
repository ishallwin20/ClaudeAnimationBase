// cine_sita.js: Sita for the cinematic engine (cine.js), front view, in colour, lit by figure(). Same units as
// cine_shiva.js: the feet at (0, 0), up is -y, the face centred at about (0, -815). Her face is the Devi's
// (deviHead() in cine_devi.js, without the mukut, in her own skin tones), with a gold sheesh patti and maang tikka; a
// saffron-yellow sari with a red border, the pallu over the left shoulder, a red blouse, gold bangles; her hair loose
// and long down her back (Ravana seizes her by it in the Aranya Kanda). Needs cine_devi.js.
//
// sita(c, o): o (all optional):
//   pose: 'stand' | 'carried' (leaning away, one arm flung out reaching to screen left, the other pushing at
//     screen right; the sari's hem and the pallu flying) | 'kneel' (sitting back on her heels, bent toward screen
//     right over something in her lap, both hands down to it)
//   t, reach (0..1 'carried': how far the arm is flung out), lean (radians, + toward screen right), wind (0..1),
//   eyes, tears (0..1), look ([x, y] irises), col (one colour: a silhouette)
const SITA = {
  skin: '#B47A56', skinSh: '#8C5A3E', skinDk: '#6A402A', palm: '#C89070', lip: '#8E2A2E', lipLo: '#B03A3C',
  sari: '#E3A62A', sariSh: '#A8741A', sariLt: '#F6CE62', border: '#B0202C', borderSh: '#741018', blouse: '#A61C28',
  hair: '#120C12', hairLt: '#2E2230', gold: '#E2AE45', goldSh: '#9A6E25', ruby: '#C81E3A', pearl: '#F3EBD8',
};
const SITA_HEAD = { skin: SITA.skin, skinSh: SITA.skinSh, skinDk: SITA.skinDk, palm: SITA.palm, lip: SITA.lip, lipLo: SITA.lipLo };

function stArm(c, S, C, P, w, hand) {
  limb(c, P, [w, w * .86, w * .7], C('skin'));
  const [ex, ey] = P[P.length - 1], [px, py] = P[P.length - 2], a = Math.atan2(ey - py, ex - px);
  if (!C.one) { ellipse(c, lerp(px, ex, .8), lerp(py, ey, .8), w * .42, w * .2, S.gold, a + Math.PI / 2); ellipse(c, lerp(px, ex, .72), lerp(py, ey, .72), w * .4, w * .18, S.border, a + Math.PI / 2); }
  // the hand: an open palm with the fingers spread (reaching) or flat (pushing)
  c.save(); c.translate(ex, ey); c.rotate(a);
  ellipse(c, 16, 0, 20, 15, C('skin'));
  const spread = hand === 'reach' ? .32 : .12;
  for (let k = 0; k < 4; k++) { const fa = (k - 1.5) * spread; limb(c, [[26, (k - 1.5) * 6], [26 + Math.cos(fa) * 34, (k - 1.5) * 6 + Math.sin(fa) * 34]], [9, 7], C('skin')); }
  limb(c, [[12, -12], [26, -30]], [10, 8], C('skin'));
  c.restore();
}

function sita(c, o = {}) {
  const S = SITA, one = o.col, C = (k) => one || S[k]; C.one = !!one;
  const t = o.t || 0, pose = o.pose || 'stand', wd = o.wind ?? .4, gust = wd * (1 + .35 * Math.sin(t * 2.3) + .2 * Math.sin(t * 5.1));
  const kneel = pose === 'kneel', carried = pose === 'carried', rc = o.reach ?? 1;
  c.save(); c.rotate(o.lean || 0);
  // the hair: a long dark fall behind her, loose, lifting in the wind
  const HY = kneel ? 300 : 0;
  c.save(); c.translate(0, HY);
  fillPath(c, 'M -44 -880 C -80 -850 -100 -790 -104 -700 C -110 -620 -104 -520 -80 -400 C -50 -440 -20 -420 0 -450 C 20 -420 50 -440 80 -400 C 104 -520 110 -620 104 -700 C 100 -790 80 -850 44 -880 Z', C('hair'));
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const x0 = s * (56 + i * 10), y0 = -800 + i * 50, ph = t * 1.6 + i * 1.2 + s, len = 280 - i * 30, gx = gust * (carried ? 60 : 24);
    limb(c, [[x0, y0], [s * (92 + i * 8) - gx * .3, y0 + len * .4 + Math.sin(ph) * 4], [s * (104 + i * 10) - gx * .6, y0 + len * .75 + Math.sin(ph + 1) * 8], [s * (110 + i * 12) - gx, y0 + len + Math.sin(ph + 2) * 12]], [30, 28, 20, 4], one || (i % 2 ? S.hair : mixCol(S.hair, S.hairLt, .35)), false);
  }
  c.restore();
  // the lower sari: standing, a skirt of pleats to the feet; kneeling, a broad mound over the folded legs
  const hem = (x0, x1, y, amp) => { let d = ''; for (let i = 0; i <= 12; i++) { const x = lerp(x1, x0, i / 12); d += ` L ${x} ${y + Math.sin(i * 1.9 + t * 4) * amp}`; } return d; };
  const SK = kneel ? `M -66 -320 C -150 -300 -230 -170 -250 0 ${hem(250, -250, 0, 2)} C 230 -170 150 -300 66 -320 Z`
    : `M -62 -490 C -84 -360 ${-120 - (carried ? gust * 40 : 0)} -160 ${-150 - (carried ? gust * 70 : 0)} 0 L ${150 - (carried ? gust * 30 : 0)} 0 C 120 -160 84 -360 62 -490 Z`;
  fillPath(c, SK, C('sari'));
  if (!one) inside(c, SK, () => {
    for (let i = -3; i <= 3; i++) strokePath(c, kneel ? `M ${i * 18} -310 C ${i * 40} -200 ${i * 70} -100 ${i * 76} 0` : `M ${i * 12} -480 C ${i * 18} -300 ${i * 30 - (carried ? gust * 30 : 0)} -120 ${i * 40 - (carried ? gust * 50 : 0)} 0`, rgba(S.sariSh, .8), 4);
    fillPath(c, 'M 40 -520 L 300 -520 L 300 40 L 60 40 Z', rgba(S.sariSh, .45));
    fillPath(c, `M -320 -40 L 320 -40 L 320 40 L -320 40 Z`, S.border);
    strokePath(c, 'M -320 -44 L 320 -44', S.gold, 5);
  });
  if (!kneel) for (const s of [-1, 1]) { ellipse(c, s * 40 - (carried ? gust * 40 : 0), -6, 26, 9, C('skin')); ellipse(c, s * 40 - (carried ? gust * 40 : 0), -16, 22, 4, C('gold')); }   // feet and anklets
  // the upper body: kneeling, it sits on the mound and bends toward screen right
  c.save();
  if (kneel) { c.translate(0, -320); c.rotate(.22 + Math.sin(t * 1.2) * .01); c.translate(0, 490); }
  const TORSO = 'M -78 -702 C -88 -650 -72 -560 -60 -490 L 60 -490 C 72 -560 88 -650 78 -702 C 50 -716 -50 -716 -78 -702 Z';
  fillPath(c, TORSO, C('blouse'));
  if (!one) inside(c, TORSO, () => { fillPath(c, 'M -90 -600 L 90 -600 L 90 -480 L -90 -480 Z', S.skin); fillPath(c, 'M -90 -560 C -40 -540 40 -540 90 -560 L 90 -470 L -90 -470 Z', rgba(S.skinSh, .6)); fillPath(c, 'M 30 -720 L 100 -720 L 100 -470 L 40 -470 Z', rgba(S.skinDk, .35)); });
  // the pallu: across the chest from the right hip over the left shoulder, then flying out behind
  const PL = 'M -70 -500 C -30 -560 30 -650 66 -712 L 92 -690 C 62 -620 14 -530 -30 -480 Z';
  fillPath(c, PL, C('sari'));
  if (!one) { inside(c, PL, () => strokePath(c, 'M -60 -498 C -20 -560 36 -650 72 -706', S.border, 12)); }
  const pf = carried ? gust * 1.6 : gust * .6, PP = [], PB = [];
  for (let i = 0; i <= 6; i++) { const u = i / 6, x = 80 + u * (180 + pf * 150), y = -700 + u * (90 - pf * 30) + Math.sin(t * 3.4 - u * 4) * 24 * u; PP.push([x, y]); PB.push([x + 4, y - lerp(26, 34, u)]); }
  limb(c, PP, [52, 62, 66, 64, 56, 44, 26], C('sari'), false);
  if (!one) { limb(c, PB, [10, 11, 12, 12, 11, 9, 6], S.border, false); limb(c, PP.map(([x, y]) => [x, y + 14]), [14, 18, 20, 18, 16, 12, 6], rgba(S.sariSh, .7), false); }
  // the neck, the head (the Devi's face, no mukut), jewellery
  c.save(); c.translate(0, -700); c.rotate(carried ? -.12 * rc : kneel ? .18 : 0); c.translate(0, 700);
  if (one) { ellipse(c, 0, -815, 48, 66, one); fillPath(c, 'M -24 -700 L -28 -790 L 28 -790 L 24 -700 Z', one); }
  else {
    deviHead(c, { t, crown: false, pal: SITA_HEAD, eyes: o.eyes ?? (kneel ? .55 : 1), tears: o.tears ?? 0, look: o.look, wind: carried ? -gust : 0 });
    strokePath(c, 'M -46 -862 C -24 -884 24 -884 46 -862', S.gold, 4);   // the sheesh patti along the hairline
    for (let i = 0; i < 7; i++) ellipse(c, lerp(-40, 40, i / 6), -870 - Math.sin(i / 6 * Math.PI) * 10, 3, 3, i % 2 ? S.ruby : S.pearl);
    for (let i = 0; i < 9; i++) { const u = i / 8, x = lerp(-34, 34, u), y = -706 + Math.sin(u * Math.PI) * 26; ellipse(c, x, y, 4, 4, i % 3 === 1 ? S.ruby : S.gold); }   // a necklace
  }
  c.restore();
  // the arms
  if (carried) {
    const a = rc, sx = -80, sy = -690;
    stArm(c, S, C, [[sx, sy], [lerp(-120, -220, a), lerp(-600, -730, a)], [lerp(-130, -350, a), lerp(-520, -790, a)]], 40, 'reach');
    stArm(c, S, C, [[80, -690], [150, -610], [196, -668]], 40, 'push');
  } else if (kneel) {
    stArm(c, S, C, [[-78, -690], [-60, -580], [30, -520]], 38, 'push');
    stArm(c, S, C, [[78, -690], [130, -590], [150, -500]], 38, 'push');
  } else {
    stArm(c, S, C, [[-80, -690], [-110, -580], [-100, -470]], 40, 'push');
    stArm(c, S, C, [[80, -690], [110, -580], [100, -470]], 40, 'push');
  }
  c.restore();
  c.restore();
}
