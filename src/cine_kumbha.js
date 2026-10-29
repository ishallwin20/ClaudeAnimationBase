// cine_kumbha.js: the Kumbhakarna story for the Cinematic style (src/cine.js): Kumbhakarna (the asura rig of
// cine_asura.js in his colours, with a gold kirita), lying asleep in silhouette, a running elephant (Airavata with four
// tusks), Brahma (four heads, on his lotus) and Saraswati's colours for deviHead().
//   KUMBHA_PAL                   Kumbhakarna's colours over arunasura()'s: dusky skin, a maroon dhoti, red-orange eyes
//   kumbhakarna(c, o)            arunasura() with his palette and crown: o as arunasura (pose, arms, expr, eyes, ...)
//   kumbhaHead(c, o)             asuraHead() likewise, at (0, -815); expr 'sleep' | 'yawn' | 'speak' | 'shock' | ...
//   kumbhaLying(c, o)            asleep on his back, side view, head to the left, ~2200 long, the ground at y 0; a
//                                silhouette (o.col); o.t, o.breath (0..1 how much the belly rises and falls)
//   elephantSide(c, o)           an elephant running, side view facing right, feet at (0, 0), ~380 tall; o.t, o.col
//                                (one colour: a silhouette), o.run (0..1 the gait), o.tusks (2 | 4: Airavata), o.lost
//                                (true: the front tusk torn out), o.trunk (0..1 raised)
//   brahma(c, o)                 Brahma seated on his lotus, front view, four heads (three seen) with crowns and beards,
//                                four arms (the Vedas, a rosary, the kamandalu, a blessing); feet at (0, 0), ~900 tall;
//                                drawn in o.col (a silhouette for figure()'s backlight) with gold details (o.gold)
//   SARASWATI_PAL                Saraswati through deviHead({ pal }): fair, a white sari with a gold border, pearls

const KUMBHA_PAL = {
  skin: '#5C424A', skinSh: '#3E2A31', skinDk: '#21151A', lip: '#2A1418', hair: '#0A0708', hairLt: '#241A1E',
  eye: '#FF7A3A', eyeHot: '#FFD0A0', dhoti: '#6A1A1C', dhotiSh: '#3A0C0E', border: '#C8912E', helm: '#2A1A14',
};
function kumbhakarna(c, o = {}) { arunasura(c, { crown: 'mukut', ...o, pal: { ...KUMBHA_PAL, ...(o.pal || {}) } }); }
function kumbhaHead(c, o = {}) { asuraHead(c, { crown: 'mukut', ...o, pal: { ...KUMBHA_PAL, ...(o.pal || {}) } }); }

// ---------- asleep, side view (a silhouette) ----------
function kumbhaLying(c, o = {}) {
  const col = o.col || '#0C080A', t = o.t || 0, br = Math.sin(t * 1.1) * 26 * (o.breath ?? 1);
  // the crown, lying back, and the head in profile, face up
  poly(c, [[-985, -96], [-1215, -150], [-985, -228]], col);
  ellipse(c, -880, -150, 122, 128, col);
  fillPath(c, 'M -905 -270 C -890 -300 -870 -300 -858 -276 Z', col);   // the nose
  fillPath(c, 'M -800 -250 C -790 -268 -770 -262 -772 -240 Z', col);   // the chin and beard
  // the body: shoulders, the chest, the great belly rising and falling, the hips
  fillPath(c, `M -780 0 L -800 -210 C -760 -300 -640 -330 -540 -330 C -420 -330 -380 -${400 + br * .4} -260 -${440 + br} C -120 -${490 + br} 40 -${470 + br} 140 -${360 + br * .5} C 200 -300 260 -260 300 -230 L 300 0 Z`, col);
  // the legs and the feet, toes up
  limb(c, [[220, -140], [600, -110], [930, -80]], [250, 190, 130], col);
  limb(c, [[920, -60], [960, -150], [970, -240]], [120, 90, 60], col);
  // the near arm lying along the side
  limb(c, [[-640, -240], [-320, -190], [40, -150], [120, -130]], [120, 100, 86, 70], col);
  if (o.lit) strokePath(c, `M -540 -330 C -420 -330 -380 -${400 + br * .4} -260 -${440 + br} C -120 -${490 + br} 40 -${470 + br} 140 -${360 + br * .5}`, rgba(o.lit, .5), 4);
}

// ---------- an elephant running, side view ----------
function elephantSide(c, o = {}) {
  const t = o.t || 0, col = o.col, run = o.run ?? 1, w = t * 9;
  const C = (k) => col || { body: '#5A5258', sh: '#3A343A', lit: '#8A8288', tusk: '#EEE4CC', ear: '#4A4248' }[k];
  const bob = Math.abs(Math.sin(w)) * 10 * run;
  c.save(); c.translate(0, -bob);
  // the far legs, then the body, then the near legs
  const leg = (x, ph, near) => { const a = Math.sin(w + ph) * .45 * run, kx = x + Math.sin(a) * 120, ky = -20 + Math.max(0, Math.cos(w + ph)) * -30 * run; limb(c, [[x, -170], [x + Math.sin(a) * 60, -90], [kx, ky + bob]], [74, 64, 60], near ? C('body') : C('sh')); ellipse(c, kx, ky + bob + 8, 34, 12, near ? C('body') : C('sh')); };
  leg(-110, Math.PI, false); leg(130, 0, false);
  fillPath(c, 'M -230 -200 C -240 -290 -170 -350 -40 -352 C 80 -354 180 -330 230 -270 C 250 -230 240 -180 200 -150 C 100 -120 -100 -118 -190 -140 C -220 -150 -230 -170 -230 -200 Z', C('body'));
  limb(c, [[-226, -230], [-262, -170], [-270, -110]], [16, 10, 6], C('body'));   // the tail
  // the head, the ear, the trunk, the eye, the tusks
  ellipse(c, 238, -280, 100, 96, C('body'));
  fillPath(c, 'M 170 -330 C 120 -340 90 -280 100 -210 C 110 -170 160 -160 200 -190 C 210 -240 200 -300 170 -330 Z', C('ear'));
  const tr = o.trunk ?? 0, sw = Math.sin(w * .5) * 20 * run;
  limb(c, [[300, -260], [338 + tr * 30, -190 - tr * 80], [334 + sw + tr * 60, -110 - tr * 170], [356 + sw + tr * 80, -50 - tr * 250]], [56, 44, 32, 22], C('body'));
  if (!col) { ellipse(c, 268, -300, 7, 6, '#120C0E'); strokePath(c, 'M 150 -350 C 200 -372 260 -370 300 -340', rgba(C('lit'), .5), 4); }
  const tusk = (dx, dy, k) => limb(c, [[288 + dx, -214 + dy], [340 + dx, -188 + dy], [372 + dx, -210 + dy]], [16 * k, 11 * k, 3], col || C('tusk'));
  if (!o.lost) tusk(0, 0, 1);
  if ((o.tusks || 2) === 4) tusk(-14, 22, .85);
  leg(-80, Math.PI * .5, true); leg(160, Math.PI * 1.5, true);
  c.restore();
}

// ---------- Brahma on his lotus ----------
function brahma(c, o = {}) {
  const col = o.col || '#2A1A20', gold = o.gold || '#E8B85A', t = o.t || 0;
  // the lotus: two rows of petals
  for (let i = -5; i <= 5; i++) fillPath(c, `M ${i * 64 - 50} 0 C ${i * 64 - 50} -60 ${i * 64 - 10} -110 ${i * 64} -120 C ${i * 64 + 10} -110 ${i * 64 + 50} -60 ${i * 64 + 50} 0 Z`, mixCol(col, '#C86A7A', .25));
  for (let i = -4; i <= 4; i++) fillPath(c, `M ${i * 70 - 46} -40 C ${i * 70 - 40} -110 ${i * 70 - 8} -150 ${i * 70} -160 C ${i * 70 + 8} -150 ${i * 70 + 40} -110 ${i * 70 + 46} -40 Z`, mixCol(col, '#E890A0', .3));
  // crossed legs, the dhoti, the torso
  fillPath(c, 'M -230 -110 C -230 -190 -120 -220 0 -218 C 120 -220 230 -190 230 -110 C 150 -96 -150 -96 -230 -110 Z', col);
  fillPath(c, 'M -80 -200 C -90 -300 -110 -380 -120 -430 C -80 -452 -40 -458 0 -460 C 40 -458 80 -452 120 -430 C 110 -380 90 -300 80 -200 Z', col);
  strokePath(c, 'M 100 -420 C 40 -380 -40 -300 -90 -210', rgba(gold, .7), 6);   // the sacred thread, over his left shoulder (screen right)
  // four arms: the upper pair raised (the Vedas, a rosary), the lower pair (the kamandalu, a blessing)
  limb(c, [[-110, -420], [-210, -470], [-240, -560]], [44, 36, 30], col); fillPath(c, 'M -290 -560 L -190 -560 L -196 -620 L -284 -620 Z', gold);
  limb(c, [[110, -420], [210, -470], [240, -560]], [44, 36, 30], col); for (let i = 0; i < 9; i++) ellipse(c, 240 + Math.cos(i / 9 * TAU) * 30, -600 + Math.sin(i / 9 * TAU) * 40, 6, 6, gold);
  limb(c, [[-112, -400], [-180, -300], [-150, -230]], [42, 34, 28], col); fillPath(c, 'M -190 -250 C -200 -200 -110 -200 -120 -250 C -130 -270 -180 -270 -190 -250 Z', gold);
  limb(c, [[112, -400], [180, -320], [170, -250]], [42, 34, 28], col); fillPath(c, 'M 150 -300 C 150 -340 190 -340 190 -300 L 190 -250 L 150 -250 Z', col);
  // the four heads: the side heads turned out in profile, then the front one; long white beards, tall crowns
  const beard = o.beard || '#EDE6DA';
  for (const s of [-1, 1]) {
    c.save(); c.translate(s * 104, -556);
    ellipse(c, 0, -40, 62, 70, col); fillPath(c, `M ${s * 50} -54 L ${s * 82} -36 L ${s * 52} -22 Z`, col);
    fillPath(c, `M ${s * 46} -18 C ${s * 50} 30 ${s * 10} 70 ${-s * 14} 62 C ${-s * 30} 40 ${-s * 30} 0 ${-s * 20} -16 Z`, beard);
    fillPath(c, 'M -46 -96 L -34 -170 L 0 -204 L 34 -170 L 46 -96 Z', gold);
    c.restore();
  }
  ellipse(c, 0, -600, 70, 80, col);
  fillPath(c, 'M -50 -566 C -50 -500 -24 -450 0 -440 C 24 -450 50 -500 50 -566 C 28 -544 -28 -544 -50 -566 Z', beard);   // the long white beard
  fillPath(c, 'M -60 -660 L -44 -760 L 0 -806 L 44 -760 L 60 -660 Z', gold); ellipse(c, 0, -720, 9, 12, '#C81E3A');
  glow(c, 0, -600, 260, gold, .2 + .05 * Math.sin(t * 2));
}

const SARASWATI_PAL = {
  skin: '#E2BC9E', skinSh: '#C09478', skinDk: '#8A6450', palm: '#F0CCB0', lip: '#B04050', lipLo: '#C85868',
  hair: '#120C12', hairLt: '#3A2C34', sari: '#FAF6EE', sariSh: '#D8CCB8', sariLt: '#FFFFFF', border: '#D8A84A', borderSh: '#A07A2A',
  blouse: '#D8A84A', gold: '#EAC46A', goldSh: '#A6863A', goldLt: '#FFF2C8', ruby: '#FFFFFF', emerald: '#9AD0E8', pearl: '#FFFFFF', bindi: '#C8303A',
};
