// cine_mbh.js: the Mahabharata cast for the Cinematic engine (cine.js), first drawn for CHIRANJEEVI Issue 1 (the Inked
// comic style, COMIC_GUIDE.md). Needs cine_surya.js (suryaHead) and cine_yama.js (withSur). Units as the Cinematic cast:
// a head centred at (0, -815), shoulders at about -700; full figures stand with the feet at (0, 0).
//
//   MBH[who]              palettes over SUR's: drona, kripa, krishna, arjuna, bhima, yudhi, duryo, dhrish, kripi
//   mbhHead(c, o)         a face on the Surya rig: o.who (a palette), o.crown ('kirita' | false), o.bun, o.beard
//                         ('long' | 'short' | false), o.stache ('full' | false), o.age (0..1 lines), o.feather (Krishna's
//                         peacock feather), plus suryaHead's options (eyes, look, fierce, pain, smile, mouth, tilak, …)
//   mbhBust(c, o)         head and shoulders: o.dress 'armor' | 'bare' (a sacred thread and a shawl) | 'royal' (bare,
//                         jewelled, a shawl; Krishna's yellow), o.broad (Bhima: 1.15), o.head (a function that draws the
//                         head instead, e.g. ashHead), and mbhHead's options
//   CAST                  each person's look in one place: CAST.drona = { who, beard, … } (spread into mbhBust)
//   manSil(c, o)          a man in profile facing screen left, one colour: o.pose stand | walk | smash | raise | shout |
//                         draw | kneel | sitBow | ride, o.head knot | kirita | turban | hood | bare, o.beard, o.prop bow |
//                         mace | sword | spear, o.col. Feet at (0, 0), ~960 tall ('ride': the seat at (0, 0)).
//   womanSil(c, o)        a woman in profile facing screen right in a sari, a bundle (a baby) cradled at her chest
//   wanderer(c, o)        a man from behind, walking away: a shawl wrapped over his head and shoulders, a staff
//   babyHead(c, o)        a newborn's face, centred at (0, 0), ~200 across: o.cry (0..1), o.eyes, o.gem
//   wheel(c, x, y, r, o)  a chariot wheel, side on: an iron tyre, twelve spokes, the hub
//   kalash(c, x, y, k, o) a brass water pot, its base at (x, y), ~130 tall at k 1; o.tip (radians, pouring)
const MBH = {
  drona: { skin: '#AE7A58', skinSh: '#86563C', skinDk: '#4E2E20', lip: '#6A3428', lipLo: '#84463A', hair: '#E6E0D4', hairLt: '#FFFFFF', brow: '#D2CABC', bead: '#5E2F1B', iris: '#2A1A12' },
  kripa: { skin: '#B88660', skinSh: '#8E5E40', skinDk: '#563424', lip: '#6E3A2C', lipLo: '#8A4C3C', hair: '#B8B2A8', hairLt: '#E2DED6', brow: '#9A948A', bead: '#5E2F1B' },
  krishna: { skin: '#3E64A8', skinSh: '#2C4A82', skinDk: '#182C56', palm: '#6A8CC8', lip: '#5A2A44', lipLo: '#7A3A58', hair: '#0C0A12', hairLt: '#22202E', iris: '#14100C', brow: '#0A0810', gold: '#E8B442', goldSh: '#9A6A1E', goldLt: '#FFE38E' },
  arjuna: { skin: '#8E6448', skinSh: '#6A4632', skinDk: '#3C2418', lip: '#5E2C22', lipLo: '#7A3E30', hair: '#0E0A0C', hairLt: '#2A2024' },
  bhima: { skin: '#A06A46', skinSh: '#7A4C30', skinDk: '#46281A', lip: '#64302A', lipLo: '#82443A', hair: '#100B0C', hairLt: '#2C2024' },
  yudhi: { skin: '#B8875E', skinSh: '#906444', skinDk: '#56382A', lip: '#6E3628', lipLo: '#8C4A38', hair: '#16100E', hairLt: '#342622' },
  duryo: { skin: '#B07650', skinSh: '#86563A', skinDk: '#4C2C1E', lip: '#6A2E24', lipLo: '#884036', hair: '#120C0C', hairLt: '#2E2220' },
  dhrish: { skin: '#C28A5E', skinSh: '#98663E', skinDk: '#5A3624', lip: '#723426', lipLo: '#904838', hair: '#120C0C', hairLt: '#2E2220' },
};
// dress colours: armour, the shawl or uttariya
const MBH_DRESS = {
  drona: { armor: '#3A3530', armorSh: '#1E1B18', armorLt: '#5E564C', cloth: '#E6DCC4', clothSh: '#B4A888' },
  kripa: { armor: '#34383E', armorSh: '#1A1C20', armorLt: '#565C66', cloth: '#C8B48A', clothSh: '#94845E' },
  krishna: { cloth: '#F0C030', clothSh: '#B8861A' },
  arjuna: { armor: '#2E3A4A', armorSh: '#161C26', armorLt: '#50627A', cloth: '#E8E2D2', clothSh: '#B0A890' },
  bhima: { armor: '#3E2E26', armorSh: '#1E1612', armorLt: '#62483A', cloth: '#7A5A1E', clothSh: '#4A3410' },
  yudhi: { armor: '#3A3A44', armorSh: '#1C1C24', armorLt: '#5E5E6E', cloth: '#E8DDC0', clothSh: '#B4A684' },
  duryo: { armor: '#3A2A30', armorSh: '#1C1216', armorLt: '#5E4650', cloth: '#7A1A2A', clothSh: '#4A0E18' },
  dhrish: { armor: '#3A3428', armorSh: '#1C1912', armorLt: '#5E5644', cloth: '#C84A1E', clothSh: '#862E10' },
};
const CAST = {
  drona: { who: 'drona', bun: true, beard: 'long', age: .9, tilak: 'tripundra' },
  kripa: { who: 'kripa', bun: true, beard: 'long', age: .7, tilak: 'tripundra' },
  krishna: { who: 'krishna', crown: 'kirita', feather: true, kundala: 'sun', dress: 'royal', tilak: 'namam' },
  arjuna: { who: 'arjuna', crown: 'kirita', stache: 'full' },
  bhima: { who: 'bhima', crown: false, bun: true, stache: 'full', beard: 'short', broad: 1.16 },
  yudhi: { who: 'yudhi', crown: 'kirita', beard: 'short', age: .3 },
  duryo: { who: 'duryo', crown: 'kirita', stache: 'full' },
  dhrish: { who: 'dhrish', crown: 'kirita' },
};

// ---------- heads ----------
function mbhHead(c, o = {}) {
  const P = { ...SUR, ...(MBH[o.who] || {}), ...(o.pal || {}) };
  withSur(P, () => {
    // hair behind the neck: long for the old, a brahmin's
    if (o.longHair) for (const k of [-1, 1]) fillPath(c, `M ${k * 42} -872 C ${k * 66} -840 ${k * 70} -770 ${k * 64} -700 L ${k * 40} -700 C ${k * 44} -760 ${k * 42} -810 ${k * 38} -840 Z`, P.hair);
    else for (const k of [-1, 1]) fillPath(c, `M ${k * 40} -870 C ${k * 62} -850 ${k * 64} -800 ${k * 52} -770 C ${k * 46} -760 ${k * 40} -766 ${k * 40} -780 Z`, P.hair);
    suryaHead(c, { curls: false, kundala: 'ring', ...o, tilak: o.tilak === 'namam' ? false : (o.tilak ?? false), crown: false, bun: o.bun ?? !o.crown });
    // a kirita lower than Surya's, so the face leads
    if (o.crown === 'kirita') { c.save(); c.translate(0, -872); c.scale(1.04, .58); c.translate(0, 872); suryaCrown(c, 0, 1); c.restore(); }
  });
  if (o.age) faceAge(c, P.skinDk, o.age);
  if (o.beard === 'long') {
    fillPath(c, 'M -47 -812 C -52 -770 -44 -720 -26 -680 C -16 -660 -6 -640 0 -626 C 6 -640 16 -660 26 -680 C 44 -720 52 -770 47 -812 C 42 -788 34 -770 22 -760 C 16 -767 8 -768 0 -767 C -8 -768 -16 -767 -22 -760 C -34 -770 -42 -788 -47 -812 Z', P.hair);
    for (let i = -3; i <= 3; i++) strokePath(c, `M ${i * 10} -752 C ${i * 9} -720 ${i * 6} -690 ${i * 3} -650`, rgba(P.hairLt || '#FFFFFF', .35), 1.4);
    for (let i = -2; i <= 2; i++) strokePath(c, `M ${i * 12 + 5} -750 C ${i * 11 + 4} -715 ${i * 7 + 3} -685 ${i * 4 + 2} -660`, rgba(P.skinDk, .25), 1.2);
  } else if (o.beard === 'short') {
    fillPath(c, 'M -47 -806 C -48 -772 -30 -742 0 -737 C 30 -742 48 -772 47 -806 C 42 -786 34 -770 22 -760 C 16 -767 8 -768 0 -767 C -8 -768 -16 -767 -22 -760 C -34 -770 -42 -786 -47 -806 Z', P.hair);
  }
  if (o.beard || o.stache === 'full') for (const k of [-1, 1]) fillPath(c, `M 0 -781 C ${k * 10} -785 ${k * 22} -783 ${k * 27} -768 C ${k * 20} -774 ${k * 10} -776 0 -775 Z`, P.hair);
  if (o.stache === 'full' && !o.beard) for (const k of [-1, 1]) fillPath(c, `M ${k * 24} -772 C ${k * 30} -768 ${k * 33} -760 ${k * 31} -754 C ${k * 28} -760 ${k * 25} -764 ${k * 20} -768 Z`, P.hair);
  if (o.tilak === 'namam') {   // Krishna's: a white U and a red line
    strokePath(c, 'M -9 -862 C -9 -846 -6 -838 0 -836 C 6 -838 9 -846 9 -862', '#F4EEE2', 3.4);
    strokePath(c, 'M 0 -864 L 0 -842', '#D02A20', 3);
  }
  if (o.feather) {   // a peacock feather tucked in the kirita, leaning out to screen left
    c.save(); c.translate(-22, -940); c.rotate(-.42);
    strokePath(c, 'M 0 40 C -2 0 -2 -60 0 -110', '#C8B880', 2.4);
    for (let i = 0; i < 16; i++) { const y = 20 - i * 8; for (const s of [-1, 1]) strokePath(c, `M 0 ${y} q ${s * 12} -6 ${s * 22} -${4 + i * .3}`, rgba('#2E8A5A', .9), 1.6); }
    ellipse(c, 0, -112, 24, 30, '#1E7A4A'); ellipse(c, 0, -108, 16, 20, '#D8B032'); ellipse(c, 0, -104, 10, 13, '#1A7A8A'); ellipse(c, 0, -102, 6, 8, '#0E2A6A');
    c.restore();
  }
}

// lines of age on a Surya-rig face (head units): the forehead, nose to mouth, the corners of the eyes
function faceAge(c, dk, age) {
  const a = .25 + age * .4;
  for (let i = 0; i < 3; i++) strokePath(c, `M ${-22 + i * 3} ${-846 - i * 6} Q 0 ${-850 - i * 6} ${22 - i * 3} ${-846 - i * 6}`, rgba(dk, a), 1.3);
  for (const s of [-1, 1]) {
    strokePath(c, `M ${s * 15} -797 Q ${s * 22} -783 ${s * 19} -768`, rgba(dk, a), 1.6);
    strokePath(c, `M ${s * 33} -814 l ${s * 7} 2 M ${s * 33} -818 l ${s * 7} -2`, rgba(dk, a * .8), 1.1);
    strokePath(c, `M ${s * 12} -810 Q ${s * 19} -806 ${s * 27} -810`, rgba(dk, a * .7), 1.1);
  }
}

// ---------- busts ----------
function mbhBust(c, o = {}) {
  const P = { ...SUR, ...(MBH[o.who] || {}), ...(MBH_DRESS[o.who] || {}), ...(o.pal || {}) }, br = Math.sin((o.t || 0) * 1.4) * 2, dress = o.dress || 'armor';
  c.save(); if (o.broad) c.scale(o.broad, 1);
  const TOR = 'M -230 -360 C -236 -470 -214 -600 -160 -650 C -120 -690 -70 -704 -34 -708 L 34 -708 C 70 -704 120 -690 160 -650 C 214 -600 236 -470 230 -360 Z';
  if (dress === 'armor') {
    fillPath(c, TOR, P.armor);
    inside(c, TOR, () => {
      fillPath(c, 'M -260 -720 L -110 -720 C -130 -620 -150 -520 -150 -360 L -260 -360 Z', P.armorSh);
      for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const y = -640 + i * 34; fillPath(c, `M ${s * 120} ${y} C ${s * 170} ${y - 26} ${s * 226} ${y - 8} ${s * 240} ${y + 30} L ${s * 236} ${y + 46} C ${s * 214} ${y + 14} ${s * 170} ${y + 4} ${s * 124} ${y + 22} Z`, i % 2 ? P.armorLt : mixCol(P.armor, P.armorLt, .5)); strokePath(c, `M ${s * 124} ${y + 22} C ${s * 170} ${y + 4} ${s * 214} ${y + 14} ${s * 236} ${y + 46}`, P.goldSh, 3); }
      strokePath(c, 'M -110 -690 C -70 -620 70 -620 110 -690', P.gold, 6);
      for (let r = 0; r < 4; r++) for (let i = -3; i <= 3; i++) { const x = i * 34 + (r % 2) * 17, y = -600 + r * 34; strokePath(c, `M ${x - 16} ${y} Q ${x} ${y + 14} ${x + 16} ${y}`, rgba(P.armorSh, .8), 3); }   // scales
      const UT = 'M 70 -700 C 140 -690 200 -650 230 -560 L 230 -470 C 140 -520 40 -470 -60 -380 L -140 -360 C -40 -470 40 -560 70 -700 Z';
      fillPath(c, UT, P.cloth); inside(c, UT, () => { for (let i = 0; i < 4; i++) strokePath(c, `M ${90 + i * 30} -690 C ${60 + i * 30} -600 ${0 + i * 30} -500 ${-80 + i * 30} -390`, rgba(P.clothSh, .7), 5); });
    });
    fillPath(c, 'M -52 -700 C -50 -726 -40 -740 -34 -742 L 34 -742 C 40 -740 50 -726 52 -700 C 30 -690 -30 -690 -52 -700 Z', P.armorSh);
  } else {
    // bare: the chest, a shawl over the left shoulder (screen right), the sacred thread "/" across (brahmins), or jewels
    fillPath(c, TOR, P.skin);
    inside(c, TOR, () => {
      fillPath(c, 'M -260 -720 L -120 -720 C -140 -620 -160 -520 -160 -360 L -260 -360 Z', rgba(P.skinSh, .9));
      for (const s of [-1, 1]) strokePath(c, `M ${s * 130} ${-590 + br} C ${s * 90} ${-556 + br} ${s * 40} ${-552 + br} ${s * 10} ${-570 + br}`, rgba(P.skinDk, .55), 4);
      if (o.age) for (let i = 0; i < 3; i++) strokePath(c, `M ${-60 + i * 8} ${-660 + i * 10} q 60 8 120 0`, rgba(P.skinDk, .25), 2);
      if (dress === 'bare') strokePath(c, 'M 150 -660 C 80 -580 0 -480 -110 -370', rgba('#F2EADA', .95), 5);
      const SH = dress === 'royal' ? 'M 60 -706 C 150 -700 220 -640 236 -540 L 236 -360 L 150 -360 C 160 -460 140 -560 60 -706 Z M -60 -706 C -150 -700 -220 -640 -236 -540 L -236 -360 L -150 -360 C -160 -460 -140 -560 -60 -706 Z'
        : 'M 40 -706 C 140 -700 214 -650 236 -560 L 236 -360 L 120 -360 C 140 -450 120 -560 40 -706 Z';
      fillPath(c, SH, P.cloth); inside(c, SH, () => { for (let i = 0; i < 5; i++) strokePath(c, `M ${70 + i * 34} -700 C ${100 + i * 30} -600 ${110 + i * 26} -480 ${120 + i * 24} -360`, rgba(P.clothSh, .7), 5); for (let i = 0; i < 5; i++) strokePath(c, `M ${-70 - i * 34} -700 C ${-100 - i * 30} -600 ${-110 - i * 26} -480 ${-120 - i * 24} -360`, rgba(P.clothSh, .7), 5); });
    });
    if (dress === 'royal') {   // necklaces and a garland of forest flowers (the vaijayanti)
      for (let r = 0; r < 2; r++) for (let i = 0; i <= 18; i++) { const u = i / 18, x = lerp(-40 - r * 14, 40 + r * 14, u), y = -716 + Math.pow(Math.sin(u * Math.PI), .8) * (36 + r * 26) + br; ellipse(c, x, y, 4.5 - r * .5, 4.5 - r * .5, r ? P.goldLt : P.gold); }
      for (let i = 0; i <= 26; i++) { const u = i / 26, x = lerp(-110, 110, u), y = -700 + Math.pow(Math.sin(u * Math.PI), .7) * 250 + br; ellipse(c, x, y, 10, 10, i % 3 === 0 ? '#E8E0C8' : i % 3 === 1 ? '#C8302A' : '#3A8A3A'); }
    }
  }
  c.restore();
  if (o.head) o.head(c); else mbhHead(c, o);
  if (dress === 'armor') {
    c.save(); if (o.broad) c.scale(o.broad, 1);
    fillPath(c, 'M -40 -716 C -38 -734 -34 -744 -30 -748 L 30 -748 C 34 -744 38 -734 40 -716 C 20 -708 -20 -708 -40 -716 Z', P.armor);
    strokePath(c, 'M -40 -716 C -20 -708 20 -708 40 -716', P.gold, 3);
    c.restore();
  }
}

// ---------- silhouettes ----------
// joint tables: hip, neck, the front (near) arm [elbow, hand], the back arm, the front leg [knee, foot], the back leg;
// x toward screen left is negative (he faces left)
const SIL_POSE = {
  stand: { hip: [0, -480], neck: [-6, -736], fa: [[-34, -600], [-52, -480]], ba: [[34, -600], [52, -484]], fl: [[-24, -250], [-46, -24]], bl: [[22, -250], [40, -24]] },
  walk: { hip: [0, -470], neck: [-14, -722], fa: [[20, -596], [44, -486]], ba: [[-44, -596], [-80, -500]], fl: [[-70, -250], [-130, -24]], bl: [[34, -244], [104, -44]] },
  smash: { hip: [0, -440], neck: [-150, -660], fa: [[-290, -600], [-400, -500]], ba: [[-230, -620], [-370, -520]], fl: [[-150, -250], [-230, -24]], bl: [[70, -230], [170, -24]], tilt: .5 },
  raise: { hip: [0, -470], neck: [10, -724], fa: [[-30, -880], [10, -990]], ba: [[60, -600], [50, -490]], fl: [[-80, -250], [-130, -24]], bl: [[60, -246], [110, -24]], tilt: -.15 },
  shout: { hip: [0, -480], neck: [-10, -728], fa: [[-130, -700], [-260, -770]], ba: [[30, -600], [40, -490]], fl: [[-50, -250], [-90, -24]], bl: [[30, -250], [60, -24]], tilt: -.35 },
  draw: { hip: [0, -480], neck: [6, -728], fa: [[-170, -726], [-330, -730]], ba: [[110, -720], [-30, -776]], fl: [[-90, -250], [-150, -24]], bl: [[50, -250], [100, -24]] },
  kneel: { hip: [0, -290], neck: [-20, -546], fa: [[-80, -420], [-120, -330]], ba: [[30, -420], [-30, -340]], fl: [[-170, -300], [-176, -24]], bl: [[60, -26], [230, -20]], tilt: .25 },
  sitBow: { hip: [0, -150], neck: [-6, -410], fa: [[-60, -280], [-110, -230]], ba: [[50, -280], [-60, -220]], fl: [[-150, -110], [-60, -20]], bl: [[-130, -60], [40, -20]], tilt: .35 },
  ride: { hip: [0, 0], neck: [-60, -240], fa: [[-120, -130], [-220, -110]], ba: [[-80, -140], [-200, -100]], fl: [[-60, 90], [-20, 210]], bl: [[-50, 80], [-10, 200]], tilt: .2 },
};
function manSil(c, o = {}) {
  const col = o.col || '#0C0A10', J = { ...SIL_POSE[o.pose || 'stand'], ...(o.joints || {}) }, sh = [J.neck[0] + 4, J.neck[1] + 26];
  const foot = (k, f, back) => { const a = Math.atan2(f[1] - k[1], f[0] - k[0]) - Math.PI / 2; c.save(); c.translate(f[0], f[1]); c.rotate(back ? a * .4 : 0); fillPath(c, 'M 22 -20 C 24 -6 22 6 20 12 L -60 12 C -62 0 -44 -8 -24 -12 L -22 -24 Z', col); c.restore(); };
  // props held in the back hand go behind
  if (o.prop === 'bow' && o.pose === 'draw') { const [hx, hy] = J.fa[1]; strokePath(c, `M ${hx + 30} ${hy - 440} C ${hx - 70} ${hy - 260} ${hx - 70} ${hy + 260} ${hx + 30} ${hy + 440}`, col, 13); strokePath(c, `M ${hx + 30} ${hy - 440} L ${J.ba[1][0]} ${J.ba[1][1]} L ${hx + 30} ${hy + 440}`, col, 2.5); strokePath(c, `M ${J.ba[1][0]} ${J.ba[1][1]} L ${hx - 80} ${hy}`, col, 4); }
  const along = (u, off = 0) => { const dx = J.neck[0] - J.hip[0], dy = J.neck[1] - J.hip[1], d = Math.hypot(dx, dy); return [J.hip[0] + dx * u - dy / d * off, J.hip[1] + dy * u + dx / d * off]; };
  limb(c, [sh, ...J.ba], [46, 38, 30], col); ellipse(c, J.ba[1][0], J.ba[1][1], 20, 18, col);
  limb(c, [J.hip, ...J.bl], [84, 62, 40], col); foot(J.bl[0], J.bl[1], true);
  // the dhoti over the hips and thighs, flaring a little
  for (const L of [J.fl, J.bl]) limb(c, [along(.08), [lerp(J.hip[0], L[0][0], .66), lerp(J.hip[1], L[0][1], .66)]], [112, 100], col);
  // the torso: narrow at the waist, broad in the chest and shoulders, the chest pushed forward
  limb(c, [along(0), along(.3, -4), along(.72, -10), along(1, -4)], [96, 82, 134, 112], col);
  ellipse(c, sh[0] - 18, sh[1] + 6, 46, 40, col); ellipse(c, sh[0] + 24, sh[1] + 6, 44, 40, col);
  limb(c, [J.hip, ...J.fl], [86, 64, 40], col); foot(J.fl[0], J.fl[1], false);
  // the head, on a neck, tilted by J.tilt (forward +)
  const tl = J.tilt || 0, ang = Math.atan2(J.neck[1] - J.hip[1], J.neck[0] - J.hip[0]);
  const hx = J.neck[0] + Math.cos(ang) * 84, hy = J.neck[1] + Math.sin(ang) * 84;
  limb(c, [J.neck, [lerp(J.neck[0], hx, .6), lerp(J.neck[1], hy, .6)]], [46, 42], col);
  c.save(); c.translate(hx, hy); c.rotate(ang + Math.PI / 2 - tl);
  ellipse(c, 0, 0, 46, 54, col);
  fillPath(c, 'M -42 -16 L -60 4 L -42 10 Z', col);   // the nose
  fillPath(c, 'M -42 16 C -44 34 -34 48 -18 52 L -10 26 Z', col);   // the chin
  const hd = o.head || 'knot';
  if (hd === 'knot') { ellipse(c, 14, -54, 28, 22, col); ellipse(c, 20, -72, 18, 14, col); }
  else if (hd === 'kirita') { fillPath(c, 'M -46 -34 L -36 -96 L -26 -144 C -18 -156 18 -158 26 -144 L 36 -96 L 44 -34 Z', col); ellipse(c, 0, -166, 13, 15, col); fillPath(c, 'M -6 -176 L 0 -210 L 6 -176 Z', col); }
  else if (hd === 'turban') { ellipse(c, 6, -36, 58, 40, col); ellipse(c, 10, -60, 44, 26, col); }
  else if (hd === 'hood') fillPath(c, 'M -40 -50 C -30 -80 30 -84 56 -50 C 78 -10 80 50 72 120 L 20 120 C 30 60 20 10 -6 -20 Z', col);
  if (o.beard === 'long') fillPath(c, 'M -40 16 C -62 60 -70 130 -60 190 C -44 150 -24 110 -6 80 C 4 60 12 40 14 30 Z', col);
  else if (o.beard === 'short') fillPath(c, 'M -42 10 C -50 40 -40 66 -16 70 C 4 60 14 40 16 24 Z', col);
  if (o.mouth) fillPath(c, `M -46 22 L -${46 + o.mouth * 22} ${28 + o.mouth * 10} L -40 ${36 + o.mouth * 12} Z`, '#000');   // an open mouth (a gap in the profile)
  c.restore();
  // the near arm and what it holds
  limb(c, [sh, ...J.fa], [48, 40, 32], col);
  const [ex, ey] = J.fa[0], [hx2, hy2] = J.fa[1], ha = Math.atan2(hy2 - ey, hx2 - ex);
  ellipse(c, hx2 + Math.cos(ha) * 10, hy2 + Math.sin(ha) * 10, 21, 19, col);
  if (o.prop === 'mace') { const L = o.propLen || 320, mx = hx2 + Math.cos(ha) * L, my = hy2 + Math.sin(ha) * L; limb(c, [[hx2 - Math.cos(ha) * 40, hy2 - Math.sin(ha) * 40], [mx, my]], [22, 30], col); ellipse(c, mx + Math.cos(ha) * 40, my + Math.sin(ha) * 40, 74, 74, col); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; fillPath(c, `M ${mx + Math.cos(ha) * 40 + Math.cos(a - .2) * 66} ${my + Math.sin(ha) * 40 + Math.sin(a - .2) * 66} L ${mx + Math.cos(ha) * 40 + Math.cos(a) * 96} ${my + Math.sin(ha) * 40 + Math.sin(a) * 96} L ${mx + Math.cos(ha) * 40 + Math.cos(a + .2) * 66} ${my + Math.sin(ha) * 40 + Math.sin(a + .2) * 66} Z`, col); } }
  if (o.prop === 'sword') { const a = o.propA ?? ha, L = 300; strokePath(c, `M ${hx2 - Math.cos(a) * 20} ${hy2 - Math.sin(a) * 20} L ${hx2 + Math.cos(a) * L} ${hy2 + Math.sin(a) * L}`, o.blade || col, 14); strokePath(c, `M ${hx2 + Math.cos(a + 1.57) * 30} ${hy2 + Math.sin(a + 1.57) * 30} L ${hx2 - Math.cos(a + 1.57) * 30} ${hy2 - Math.sin(a + 1.57) * 30}`, col, 10); }
  if (o.prop === 'spear') { strokePath(c, `M ${hx2 + 30} ${hy2 + 500} L ${hx2 - 10} ${hy2 - 600}`, col, 9); fillPath(c, `M ${hx2 - 10} ${hy2 - 680} L ${hx2 + 4} ${hy2 - 600} L ${hx2 - 22} ${hy2 - 600} Z`, col); }
  if (o.prop === 'bow' && o.pose !== 'draw') { strokePath(c, `M ${hx2 - 10} ${hy2 - 430} C ${hx2 - 110} ${hy2 - 250} ${hx2 - 110} ${hy2 + 250} ${hx2 - 10} ${hy2 + 430}`, col, 13); strokePath(c, `M ${hx2 - 10} ${hy2 - 430} L ${hx2 - 10} ${hy2 + 430}`, col, 2.5); }
  if (o.quiver) { c.save(); c.translate(sh[0] + 40, sh[1] - 10); c.rotate(.42 + tl * .3); fillPath(c, 'M -18 0 L 18 0 L 15 250 L -15 250 Z', col); for (let i = -1; i <= 1; i++) fillPath(c, `M ${i * 10 - 4} 4 L ${i * 10} -50 L ${i * 10 + 4} 4 Z`, col); c.restore(); }
}
// a woman in profile facing screen right: a sari to the feet, the pallu over her head, a baby cradled at her chest
function womanSil(c, o = {}) {
  const col = o.col || '#0C0A10';
  fillPath(c, 'M -70 -500 C -100 -340 -120 -160 -130 0 L 110 0 C 96 -160 70 -340 50 -500 Z', col);   // the sari skirt
  fillPath(c, 'M -64 -500 C -76 -580 -70 -660 -40 -706 L 40 -706 C 70 -660 66 -580 56 -500 Z', col);   // the body
  // the head bowed toward the baby, the pallu over it falling down her back
  c.save(); c.translate(6, -800); c.rotate(.28);
  ellipse(c, 0, 0, 44, 52, col); fillPath(c, 'M 40 -10 L 56 8 L 40 14 Z', col); fillPath(c, 'M 40 18 C 42 34 34 46 18 50 L 10 24 Z', col);
  fillPath(c, 'M -10 -62 C 30 -66 56 -40 54 -20 L 30 -20 C 20 -40 -20 -44 -50 -20 C -70 40 -80 160 -96 300 L -130 300 C -110 140 -90 0 -70 -40 C -60 -56 -40 -62 -10 -62 Z', col);
  c.restore();
  // the bundle at her chest, the arms round it
  ellipse(c, 70, -600, 84, 50, col, -.2); ellipse(c, 132, -626, 38, 36, col);
  limb(c, [[-20, -680], [10, -560], [110, -580]], [40, 34, 28], col);
  limb(c, [[20, -690], [80, -650], [150, -650]], [38, 32, 26], col);
}
// a man from behind walking away, a shawl over his head and shoulders to the knees, a staff
function wanderer(c, o = {}) {
  const col = o.col || '#0C0A10', st = o.step ?? .5;
  limb(c, [[-30, -460], [-36 - st * 10, -250], [-40 - st * 16, -30]], [70, 54, 36], col); ellipse(c, -44 - st * 16, -16, 26, 16, col);
  limb(c, [[30, -460], [34, -240], [30, -50 + st * 20]], [70, 54, 36], col); ellipse(c, 30, -40 + st * 20, 24, 16, col);
  fillPath(c, 'M -110 -700 C -150 -560 -160 -400 -150 -250 C -100 -230 100 -230 150 -250 C 160 -400 150 -560 110 -700 C 70 -740 -70 -740 -110 -700 Z', col);   // the shawl round the body
  fillPath(c, 'M -62 -720 C -76 -800 -54 -870 0 -876 C 54 -870 76 -800 62 -720 Z', col);   // the head, wrapped
  for (let i = 0; i < 3; i++) fillPath(c, `M ${120 - i * 12} -300 L ${150 - i * 6} -220 L ${100 - i * 14} -250 Z`, col);   // the shawl's torn hem
  if (o.staff !== false) { strokePath(c, 'M 160 0 L 140 -940', col, 12); ellipse(c, 140, -946, 10, 12, col); limb(c, [[100, -660], [146, -560], [146, -600]], [40, 32, 26], col); }
}

// ---------- props and faces ----------
function babyHead(c, o = {}) {
  const P = { skin: '#C8906A', skinSh: '#A06C4C', skinDk: '#6A402C', lip: '#9A4038', mouth: '#3A1210', hair: '#1A1012', ...(o.pal || {}) }, cr = o.cry ?? 1;
  for (const s of [-1, 1]) ellipse(c, s * 98, 4, 22, 30, P.skinSh);   // ears
  const F = 'M 0 -104 C 60 -104 104 -60 104 0 C 104 64 60 102 0 102 C -60 102 -104 64 -104 0 C -104 -60 -60 -104 0 -104 Z';
  fillPath(c, F, P.skin);
  inside(c, F, () => {
    fillPath(c, 'M -130 -120 L -60 -120 C -84 -60 -84 40 -40 120 L -130 120 Z', rgba(P.skinSh, .7));
    for (const s of [-1, 1]) ellipse(c, s * 56, 30, 30, 22, rgba('#E07060', .35 * cr));   // red cheeks
    for (let i = 0; i < 6; i++) strokePath(c, `M ${-30 + i * 12} -100 q 4 -14 0 -26`, P.hair, 3);   // a wisp of hair
  });
  // eyes squeezed shut, the brows knotted
  for (const s of [-1, 1]) {
    const ex = s * 38, ey = -10;
    if ((o.eyes ?? 0) > .2) { ellipse(c, ex, ey, 14, 9, '#F2E8D8'); ellipse(c, ex, ey, 7, 8, '#1A0E0A'); }
    else strokePath(c, `M ${ex - 18} ${ey - 2 * cr} Q ${ex} ${ey + 8} ${ex + 18} ${ey - 2 * cr}`, P.skinDk, 3.4);
    for (let i = 0; i < 3 * cr; i++) strokePath(c, `M ${ex + s * 18} ${ey - 4 + i * 6} l ${s * 8} ${-2 + i * 2}`, rgba(P.skinDk, .6), 1.6);
    strokePath(c, `M ${s * 12} ${-34 - cr * 2} Q ${s * 30} ${-40 + cr * 6} ${s * 52} -32`, rgba(P.skinDk, .55), 2.4);
  }
  ellipse(c, 0, 22, 12, 8, P.skinSh); ellipse(c, -5, 24, 3, 2, P.skinDk); ellipse(c, 5, 24, 3, 2, P.skinDk);
  if (cr > .05) { const mw = 22 + cr * 10, mh = 8 + cr * 26; ellipse(c, 0, 58, mw, mh, P.mouth); ellipse(c, 0, 58 + mh * .5, mw * .6, mh * .4, '#B05050'); strokePath(c, `M ${-mw} 58 Q 0 ${58 - mh * 1.1} ${mw} 58`, P.lip, 3); }
  else strokePath(c, 'M -14 56 Q 0 62 14 56', P.lip, 3);
}
function wheel(c, x, y, r, o = {}) {
  const col = o.col || '#3A2A1E', iron = o.iron || '#22242A', sp = o.spin || 0;
  c.save(); c.translate(x, y);
  c.strokeStyle = col; c.lineWidth = r * .07;
  for (let i = 0; i < 12; i++) { const a = sp + i * TAU / 12; c.beginPath(); c.moveTo(Math.cos(a) * r * .14, Math.sin(a) * r * .14); c.lineTo(Math.cos(a) * r * .86, Math.sin(a) * r * .86); c.stroke(); }
  c.lineWidth = r * .14; c.strokeStyle = col; c.beginPath(); c.arc(0, 0, r * .86, 0, TAU); c.stroke();
  c.lineWidth = r * .07; c.strokeStyle = iron; c.beginPath(); c.arc(0, 0, r * .96, 0, TAU); c.stroke();
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; ellipse(c, Math.cos(a) * r * .96, Math.sin(a) * r * .96, r * .02, r * .02, '#6A6C74'); }
  ellipse(c, 0, 0, r * .2, r * .2, col); ellipse(c, 0, 0, r * .1, r * .1, iron); ellipse(c, 0, 0, r * .05, r * .05, '#C8A040');
  c.restore();
}
function kalash(c, x, y, k = 1, o = {}) {
  const B = o.col || '#C8902E', D = o.dk || '#7A5418', L = o.lt || '#FFD27A';
  c.save(); c.translate(x, y); c.rotate(o.tip || 0); c.scale(k, k);
  const POT = 'M -30 -130 L 30 -130 C 30 -116 24 -108 30 -100 C 70 -88 86 -54 80 -24 C 72 6 40 12 0 12 C -40 12 -72 6 -80 -24 C -86 -54 -70 -88 -30 -100 C -24 -108 -30 -116 -30 -130 Z';
  fillPath(c, POT, B);
  inside(c, POT, () => { fillPath(c, 'M -100 -140 L -40 -140 C -60 -90 -60 -20 -30 20 L -100 20 Z', D); ellipse(c, 30, -60, 14, 34, rgba(L, .8), -.3); strokePath(c, 'M -76 -60 Q 0 -44 76 -60', rgba(D, .9), 3); });
  ellipse(c, 0, -130, 36, 9, D); ellipse(c, 0, -132, 28, 6, '#1A120A');
  c.restore();
}
