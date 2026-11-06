// sb_dashavatar.js: the Dashavatar cast in the Storybook style (load after sb_cast.js). Front views, origin between
// the feet, y up is negative, like sb_cast.js. Vishnu's blue is Bal Krishna's (SB_KRISHNA.skin), so every avatar who
// shows it reads as the same god.
//   sbVamana(c, x, y, s, o)      the boy Vamana: a palm-leaf parasol (o.parasol), a brass kamandalu, the sacred thread,
//                                a deerskin over his dhoti, a shikha; ~1000 tall with the parasol
//   sbBali(c, x, y, s, o)        King Bali, the generous asura king: violet and gold, a short black beard, a tall crown.
//                                o.pose 'give' (a gold water pot held out) | 'stand' | 'kneel' (hands joined, head bowed)
//   sbShukra(c, x, y, s, o)      Shukracharya, the asuras' guru: white beard and bun, saffron, a staff.
//                                o.pose 'wary' (eyes sideways, brows down) | 'shock' (hands on his head, mouth open)
//   sbTrivikrama(c, x, y, s, o)  Vishnu grown to fill the sky: stands on his right foot at (x, y), his left leg raised
//                                high to screen left (sbTrivikramaFoot(o) gives that sole's centre in local units),
//                                four arms (conch, chakra, a blessing hand, a hand on the hip), the kirita; ~1350 tall
//   sbYagna(c, x, y, k, o)       a brick fire-pit with a living fire (o.t), ~300 wide at k 1
//   sbStar(c, x, y, r, col)      a four-point sparkle
const SB_VAMANA = { skin: '#6F95D8', dk: '#5A7CC0', hair: '#1E1A2C', dhoti: '#F6C445', dk2: '#E0A72C', deer: '#C8955E', deerDk: '#A87642', spot: '#F6E6CC',
  thread: '#FFFDF4', palm: '#E0AE52', palmDk: '#B07E2E', staff: '#8A5230', brass: '#E8AE3E', brassDk: '#B07A22', red: '#E2483D', sandal: '#8A5230' };
function sbParasol(c, x, y, k, P, o = {}) {   // the chhatra, its staff's foot at (x, y), ~720 tall at k 1
  c.save(); c.translate(x, y); c.scale(k, k); c.rotate(o.rot || 0);
  sbLine(c, [[0, 0], [0, -700]], 14, P.staff, { taper: .1, trem: .4 });
  const dome = []; for (let i = 0; i <= 20; i++) { const a = Math.PI + i / 20 * Math.PI; dome.push([Math.cos(a) * 230, -650 + Math.sin(a) * 120]); }
  for (let i = 1; i < 12; i++) { const f = i / 12; dome.push([230 - f * 460, -650 + (i % 2 ? 26 : 6)]); }
  sbShape(c, dome, P.palm, { shade: ['rgba(120,60,0,.25)', 1.2], ang: 1.2 });
  for (let i = 0; i < 9; i++) { const a = Math.PI + (i + .5) / 9 * Math.PI; sbLine(c, [[0, -768], [Math.cos(a) * 222, -654 + Math.sin(a) * 110 + 8]], 5, P.palmDk, { taper: .4, alpha: .7 }); }
  sbDot(c, 0, -775, 16, '#F2B33D');
  c.restore();
}
function sbKamandalu(c, x, y, k, P) {   // hanging from (x, y) by its handle
  c.save(); c.translate(x, y); c.scale(k, k);
  sbLine(c, [[-38, 66], [-30, 6], [0, -6], [30, 6], [38, 66]], 10, P.brassDk, { taper: .1 });
  sbEll(c, 0, 108, 62, 54, P.brass, { tex: false, shade: ['rgba(120,60,0,.3)', .6], spot: [-20, 90, 30, 'rgba(255,255,255,.35)'] });
  sbEll(c, 0, 58, 30, 12, P.brassDk, { tex: false });
  sbLine(c, [[50, 92], [86, 70], [104, 40]], 12, P.brass, { taper: .4 });
  c.restore();
}
function sbVamana(c, x, y, s, o = {}) {
  const P = { ...SB_VAMANA, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 1.8, 5), bl = sbBlink(o), ps = o.parasol ?? 1;
  sbAt(c, x, y, s, () => {
    if (ps > .01) sbParasol(c, -168, -250, ps, P);
    for (const sd of [-1, 1]) { sbEll(c, sd * 50, -72, 38, 66, P.skin, { tex: false }); sbEll(c, sd * 56, -6, 52, 13, P.sandal, { tex: false }); sbEll(c, sd * 56, -16, 40, 17, P.dk, { tex: false }); }
    c.translate(0, br * .4);
    const dh = sbPoly([[-128, -110], [-80, -98], [0, -104], [80, -98], [128, -110], [106, -250], [-106, -250]], { n: 6 });
    sbShape(c, dh, P.dhoti, { shade: ['rgba(150,90,0,.2)', .4] });
    c.save(); sbPath(c, dh); c.clip(); sbDry(c, [[0, -245], [8, -180], [0, -106]], 10, P.dk2, .5, 4, { n: 10 }); c.restore();
    // the deerskin over the dhoti, a ragged hem, white spots
    const ds = sbPoly([[-120, -262], [120, -262], [118, -196], [70, -170], [30, -186], [-20, -160], [-70, -182], [-118, -168]], { n: 6 });
    sbShape(c, ds, P.deer, { shade: ['rgba(90,40,0,.22)', .5] });
    for (const [a, b] of [[-80, -226], [-34, -200], [20, -232], [64, -204], [96, -238], [-100, -196]]) sbDot(c, a, b, 9, P.spot);
    sbEll(c, 0, -345, 108, 112, P.skin, { pear: .1, shade: ['rgba(20,30,90,.18)', .5] });
    sbLine(c, [[96, -440], [30, -360], [-40, -300], [-104, -262]], 6, P.thread, { taper: .2, trem: .3 });   // the sacred thread, "/" over his left shoulder
    // arms: his right (screen left) up to the parasol staff, his left down with the pot
    sbLimb(c, [-96, -420], [-150, -500], 34, P.skin); sbEll(c, -168, -508, 30, 32, P.skin, { tex: false });
    sbLimb(c, [96, -420], [146, -270], 34, P.skin); sbEll(c, 152, -250, 30, 30, P.skin, { tex: false });
    sbKamandalu(c, 152, -262, .9, P);
    // head: short hair, a shikha tied on top, the U tilak
    c.save(); c.translate(0, -470); c.rotate(Math.sin(t * TAU / 3.6) * .03 + (o.tilt || 0)); c.translate(0, 470);
    sbEll(c, 0, -548, 126, 124, P.hair, { tex: false });
    sbEll(c, 0, -532, 118, 116, P.skin, { shade: ['rgba(20,30,90,.14)', .6] });
    sbShape(c, sbPoly([[-120, -560], [-96, -632], [-30, -662], [40, -658], [100, -626], [120, -560], [78, -608], [10, -618], [-58, -604]], { n: 6 }), P.hair, { tex: false });
    sbEll(c, 6, -676, 30, 26, P.hair, { tex: false }); sbLine(c, [[20, -690], [52, -712], [44, -740]], 10, P.hair, { taper: .6 });
    sbLine(c, [[-18, -626], [-14, -592], [0, -582], [14, -592], [18, -626]], 7, '#FFFFFF', { taper: .2 }); sbLine(c, [[0, -620], [0, -590]], 5, P.red, { taper: .3 });
    for (const sd of [-1, 1]) sbEye(c, sd * 44, -540, 17, { blink: bl, happy: o.happy, look: o.look });
    sbCheek(c, -76, -488, 38); sbCheek(c, 76, -488, 38);
    sbMouth(c, 0, -474, 42, o.mouth || 'smile');
    c.restore();
  }, o);
}

// ---------- King Bali ----------
const SB_BALI = { skin: '#D99A6A', dk: '#BE7E50', hair: '#231B2A', dhoti: '#7A4AB0', dk2: '#5A3488', shawl: '#F2B33D', shawlDk: '#D49422', gold: '#F2B33D', gem: '#D8323C', pot: '#F2B33D' };
function sbBali(c, x, y, s, o = {}) {
  const P = { ...SB_BALI, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 2.2, 5), bl = sbBlink(o), pose = o.pose || 'give', kneel = pose === 'kneel';
  sbAt(c, x, y, s, () => {
    if (kneel) {   // folded legs: two knees in the violet dhoti, the soles just showing behind
      for (const sd of [-1, 1]) sbEll(c, sd * 150, -14, 40, 18, P.dk, { tex: false });
      sbShape(c, sbPoly([[-200, -10], [200, -10], [190, -150], [120, -210], [-120, -210], [-190, -150]], { n: 6 }), P.dhoti, { shade: ['rgba(30,0,60,.25)', 1.4] });
      for (const sd of [-1, 1]) sbEll(c, sd * 90, -90, 100, 72, P.dhoti, { rot: sd * -.2, shade: ['rgba(30,0,60,.2)', 1.4] });
      sbDry(c, [[-200, -22], [0, -6], [200, -22]], 18, P.gold, .9, 6, { n: 16, dry: .03 });
      c.translate(0, -190 + 480);   // the waist sits at -190, not -480
    } else {
      for (const sd of [-1, 1]) sbEll(c, sd * 56, -14, 50, 20, P.dk, { tex: false });
      const dh = sbPoly([[-150, -30], [-60, -22], [60, -22], [150, -30], [140, -300], [120, -480], [-120, -480], [-140, -300]], { n: 6 });
      sbShape(c, dh, P.dhoti, { shade: ['rgba(30,0,60,.25)', .4], ang: -1.4 });
      c.save(); sbPath(c, dh); c.clip(); sbDry(c, [[-160, -44], [0, -30], [160, -44]], 26, P.gold, .9, 8, { n: 16, dry: .03 }); sbDry(c, [[0, -470], [12, -260], [0, -40]], 14, P.dk2, .6, 5, { n: 14 }); c.restore();
    }
    c.translate(0, br * .4);
    // torso, the gold shawl across it, a jewelled necklace
    sbEll(c, 0, -640, 160, 190, P.skin, { pear: .12, shade: ['rgba(80,30,10,.2)', .5] });
    sbDry(c, [[-150, -470], [0, -462], [150, -470]], 30, P.gold, .95, 9, { n: 14, dry: .02, fade: .1 });
    sbDry(c, [[-140, -760], [-20, -640], [120, -500]], 34, P.shawl, .95, 10, { n: 16, dry: .03, fade: .15 });
    for (let i = 0; i <= 12; i++) { const a = Math.PI * i / 12; sbDot(c, -90 * Math.cos(a), -790 + Math.sin(a) * 90, 12, i === 6 ? P.gem : P.gold); }
    // arms
    if (kneel) {   // hands joined in front of the chest
      for (const sd of [-1, 1]) { sbLimb(c, [sd * 140, -770], [sd * 150, -620], 40, P.skin); sbLimb(c, [sd * 150, -620], [sd * 30, -700], 36, P.skin); sbDry(c, [[sd * 128, -650], [sd * 168, -640]], 12, P.gold, .9, 4, { n: 6 }); }
      for (const sd of [-1, 1]) sbEll(c, sd * 16, -740, 24, 62, P.skin, { tex: false, rot: sd * -.08 });
    } else {
      sbLimb(c, [-140, -770], [-180, -560], 40, P.skin); sbEll(c, -186, -526, 36, 38, P.skin, { tex: false });
      sbDry(c, [[-200, -600], [-160, -606]], 12, P.gold, .9, 4, { n: 6 });
      if (pose === 'give') {   // his left arm out, a gold water pot on the palm, ready to pour the gift
        sbLimb(c, [140, -770], [250, -640], 40, P.skin); sbLimb(c, [250, -640], [340, -700], 36, P.skin); sbDry(c, [[236, -640], [262, -676]], 12, P.gold, .9, 4, { n: 6 });
        sbEll(c, 356, -704, 40, 30, P.skin, { tex: false });
        sbEll(c, 360, -770, 56, 50, P.pot, { tex: false, shade: ['rgba(140,70,0,.3)', .6], spot: [344, -786, 22, 'rgba(255,255,255,.4)'] });
        sbEll(c, 360, -820, 26, 12, '#D49422', { tex: false }); sbLine(c, [[404, -786], [440, -810], [456, -836]], 12, P.pot, { taper: .4 });
      } else { sbLimb(c, [140, -770], [180, -560], 40, P.skin); sbEll(c, 186, -526, 36, 38, P.skin, { tex: false }); }
    }
    // head: hair to the shoulders, the crown, a short beard
    c.save(); c.translate(0, -840); c.rotate(Math.sin(t * TAU / 4.2) * .02 + (o.tilt || 0)); if (kneel) c.translate(0, 40); c.translate(0, 840);
    sbShape(c, sbPoly([[-135, -960], [135, -960], [150, -830], [120, -790], [-120, -790], [-150, -830]], { n: 6 }), P.hair, { tex: false });
    sbEll(c, 0, -900, 120, 126, P.skin, { shade: ['rgba(80,30,10,.14)', .6] });
    sbShape(c, sbPoly([[-104, -890], [-80, -830], [-40, -790], [0, -780], [40, -790], [80, -830], [104, -890], [70, -850], [0, -836], [-70, -850]], { n: 6 }), P.hair, { tex: false });
    sbLine(c, [[-52, -862], [-20, -870], [0, -864], [20, -870], [52, -862]], 12, P.hair, { taper: .6 });
    sbShape(c, sbPoly([[-118, -980], [118, -980], [96, -1090], [52, -1060], [24, -1150], [0, -1180], [-24, -1150], [-52, -1060], [-96, -1090]], { n: 6 }), P.gold, { shade: ['rgba(140,70,0,.25)', .3] });
    sbDry(c, [[-120, -986], [0, -998], [120, -986]], 18, '#D49422', .9, 6, { n: 12, dry: .02 });
    sbDot(c, 0, -1052, 18, P.gem); for (const sd of [-1, 1]) sbDot(c, sd * 60, -1030, 10, P.gem);
    for (const sd of [-1, 1]) { sbDot(c, sd * 122, -880, 16, P.gold); sbDot(c, sd * 122, -856, 10, P.gem); }
    if (kneel) for (const sd of [-1, 1]) sbEye(c, sd * 46, -916, 16, { happy: true });
    else for (const sd of [-1, 1]) sbEye(c, sd * 46, -918, 16, { blink: bl, happy: o.happy, look: o.look });
    sbCheek(c, -78, -872, 34, '#E2706A', .6); sbCheek(c, 78, -872, 34, '#E2706A', .6);
    if (!kneel) sbMouth(c, 0, -846, 40, o.mouth || 'smile', { col: '#6A2A2A' });
    c.restore();
  }, o);
}

// ---------- Shukracharya ----------
const SB_SHUKRA = { skin: '#E8B48A', dk: '#CF9568', robe: '#F08A3A', robeDk: '#C8641E', beard: '#F6F2EA', beardDk: '#D8D0C4', bead: '#7A3A22', staff: '#8A5230', ash: '#FFFFFF' };
function sbShukra(c, x, y, s, o = {}) {
  const P = { ...SB_SHUKRA, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 2.6, 4), bl = sbBlink(o), shock = o.pose === 'shock';
  sbAt(c, x, y, s, () => {
    if (!shock) sbLine(c, [[200, 0], [200, -900]], 16, P.staff, { taper: .1, trem: .4 });
    for (const sd of [-1, 1]) sbEll(c, sd * 52, -14, 46, 18, P.dk, { tex: false });
    c.translate(0, br * .4);
    const robe = sbPoly([[-150, -26], [150, -26], [130, -300], [120, -560], [-120, -560], [-130, -300]], { n: 6 });
    sbShape(c, robe, P.robe, { shade: ['rgba(120,40,0,.25)', .4], ang: -1.4 });
    c.save(); sbPath(c, robe); c.clip(); sbDry(c, [[-120, -560], [20, -300], [140, -60]], 30, P.robeDk, .6, 8, { n: 16, dry: .04 }); c.restore();
    for (let i = 0; i <= 14; i++) { const a = Math.PI * i / 14; sbDot(c, -84 * Math.cos(a), -560 + Math.sin(a) * 160, 10, P.bead); }
    // arms
    if (shock) {   // both hands clapped to the sides of his head
      for (const sd of [-1, 1]) { sbLimb(c, [sd * 120, -540], [sd * 200, -620], 36, P.robe); sbLimb(c, [sd * 200, -620], [sd * 130, -760], 32, P.skin); sbEll(c, sd * 124, -770, 34, 40, P.skin, { tex: false }); }
    } else {
      sbLimb(c, [-120, -540], [-150, -360], 36, P.robe); sbEll(c, -152, -336, 32, 34, P.skin, { tex: false });
      sbLimb(c, [120, -540], [190, -430], 36, P.robe); sbEll(c, 200, -420, 34, 36, P.skin, { tex: false });
    }
    // head: a white bun, the beard to his chest, three lines of ash
    c.save(); c.translate(0, -600); c.rotate((o.tilt || 0) + Math.sin(t * TAU / 5) * .015); c.translate(0, 600);
    sbEll(c, 0, -800, 70, 60, P.beard, { tex: false }); sbEll(c, 0, -720, 118, 60, P.beard, { tex: false });
    sbEll(c, 0, -660, 110, 112, P.skin, { shade: ['rgba(80,30,10,.14)', .6] });
    sbShape(c, sbPoly([[-104, -650], [-90, -560], [-50, -490], [0, -460], [50, -490], [90, -560], [104, -650], [60, -606], [0, -598], [-60, -606]], { n: 6 }), P.beard, { shade: ['rgba(60,50,40,.12)', 1.5] });
    sbLine(c, [[-56, -620], [-20, -628], [0, -620], [20, -628], [56, -620]], 13, P.beardDk, { taper: .6 });
    for (const yy of [-730, -714, -698]) sbLine(c, [[-54, yy], [54, yy]], 6, P.ash, { taper: .5, alpha: .9 });
    const look = shock ? [0, 0] : (o.look || [.8, 0]);
    for (const sd of [-1, 1]) {
      sbEye(c, sd * 40, -664, 14, { blink: shock ? 0 : bl, look, white: shock });
      const by = -690, tilt = shock ? -14 : 12;   // the brows: down toward the nose when wary, up when shocked
      sbLine(c, [[sd * 64, by - tilt * .2], [sd * 18, by + tilt]], 8, P.beardDk, { taper: .4 });
    }
    sbCheek(c, -64, -628, 26, '#E2706A', .45); sbCheek(c, 64, -628, 26, '#E2706A', .45);
    if (shock) sbMouth(c, 0, -602, 50, 'o', { col: '#5A2A2A' }); else sbMouth(c, 0, -604, 30, 'flat', { col: '#5A2A2A' });
    c.restore();
  }, o);
}

// ---------- Trivikrama ----------
const SB_TRIVI = { skin: '#6F95D8', dk: '#5A7CC0', lt: '#9DB9E8', sole: '#F2A6A6', hair: '#1E1A2C', dhoti: '#F6C445', dk2: '#E0A72C', sash: '#E2483D',
  gold: '#F2B33D', goldDk: '#D49422', gem: '#D8323C', mala: '#F7F0E0', conch: '#FFF8EE', conchDk: '#E8D8C4' };
const SB_TV_FOOT = [-730, -1000];   // the raised sole's centre, in local units
const sbTrivikramaFoot = () => SB_TV_FOOT;
function sbTrivikrama(c, x, y, s, o = {}) {
  const P = { ...SB_TRIVI, ...(o.pal || {}) }, t = o.t || 0, br = sbBreath(o, 3, 6), bl = sbBlink(o);
  sbAt(c, x, y, s, () => {
    // the raised left leg (screen left), drawn first: one long stride up through the sky, the sole turned to us
    const hip = [-60, -560], knee = [-360, -760], ank = [-640, -946];
    sbLimb(c, hip, knee, 86, P.skin, { shade: ['rgba(20,30,90,.18)', 1.6] }); sbLimb(c, knee, ank, 70, P.skin, { shade: ['rgba(20,30,90,.18)', 1.6] });
    sbEll(c, knee[0], knee[1], 78, 78, P.skin, { tex: false });
    const [fx, fy] = SB_TV_FOOT, fa = -.6, ca = Math.cos(fa), sa = Math.sin(fa);
    sbDry(c, [[ank[0] + 30, ank[1] - 64], [ank[0] + 56, ank[1] + 46]], 24, P.gold, .95, 6, { n: 8 });   // anklet
    sbEll(c, fx, fy, 120, 82, P.skin, { rot: fa, tex: false });
    sbEll(c, fx - 10, fy + 6, 92, 58, P.sole, { rot: fa, tex: false, alpha: .9 });
    for (const [a, b, r] of [[-128, -50, 28], [-116, -6, 22], [-100, 30, 19], [-80, 58, 17], [-54, 78, 15]]) sbDot(c, fx + a * ca - b * sa, fy + a * sa + b * ca, r, P.skin);
    // the planted right leg (screen right), to the foot at the origin
    sbLimb(c, [40, -560], [70, -300], 82, P.skin, { shade: ['rgba(20,30,90,.18)', 1.2] }); sbLimb(c, [70, -300], [70, -60], 66, P.skin, { shade: ['rgba(20,30,90,.18)', 1.2] });
    sbEll(c, 90, -18, 92, 30, P.dk, { tex: false });
    sbDry(c, [[30, -96], [110, -96]], 22, P.gold, .95, 6, { n: 8 });
    c.translate(0, br * .3);
    // the dhoti, its ends flying
    const dh = sbPoly([[-170, -470], [-60, -430], [60, -440], [160, -480], [140, -640], [-150, -640]], { n: 6 });
    sbShape(c, dh, P.dhoti, { shade: ['rgba(150,90,0,.22)', .5] });
    sbDry(c, [[-160, -470], [0, -440], [160, -478]], 24, P.dk2, .85, 8, { n: 14, dry: .03 });
    sbDry(c, [[150, -620], [250, -560 + Math.sin(t * 2) * 10], [330, -600 + Math.sin(t * 2 + 1) * 16]], 30, P.sash, .9, 8, { n: 12 });
    // the back arms, raised: the chakra (screen right) and the conch (screen left)
    for (const sd of [-1, 1]) { c.save(); c.translate(sd * 150, -880); c.rotate(sd * .7); sbEll(c, 0, -110, 40, 120, P.skin, { tex: false }); sbEll(c, 0, -230, 42, 42, P.skin, { tex: false }); sbDry(c, [[-34, -180], [34, -180]], 12, P.gold, .9, 4, { n: 6 }); c.restore(); }
    const ch = [150 + Math.sin(.7) * 230, -880 - Math.cos(.7) * 230 - 60];
    c.save(); c.translate(...ch); c.rotate(t * 2);
    sbEll(c, 0, 0, 74, 74, P.gold, { tex: false }); sbEll(c, 0, 0, 44, 44, P.goldDk, { tex: false }); sbEll(c, 0, 0, 22, 22, P.gold, { tex: false });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.save(); c.rotate(a); sbShape(c, sbPoly([[-12, -70], [12, -70], [0, -100]], { n: 3, jit: .5 }), P.gold, { tex: false }); c.restore(); }
    c.restore();
    const cn = [-150 - Math.sin(.7) * 230, -880 - Math.cos(.7) * 230 - 50];
    c.save(); c.translate(...cn); c.rotate(-.5);
    sbShape(c, sbPoly([[0, -80], [44, -40], [50, 20], [24, 70], [-10, 80], [-40, 30], [-46, -30]], { n: 6 }), P.conch, { shade: ['rgba(120,90,60,.25)', .6] });
    for (const yy of [-30, 0, 30]) sbLine(c, [[-30, yy + 10], [30, yy - 6]], 5, P.conchDk, { taper: .5 });
    sbLine(c, [[-6, -78], [10, -96], [26, -84]], 9, P.conch, { taper: .5 });
    c.restore();
    // the chest and the vaijayanti garland
    sbEll(c, 0, -790, 176, 200, P.skin, { pear: -.1, shade: ['rgba(20,30,90,.18)', .5], spot: [-60, -840, 110, 'rgba(255,255,255,.12)'] });
    sbDry(c, [[-150, -940], [-10, -800], [150, -650]], 36, P.sash, .9, 10, { n: 16, dry: .03, fade: .1 });
    for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; sbDot(c, -120 * Math.cos(a), -930 + Math.sin(a) * 260, 13, i % 3 === 1 ? P.sash : i % 3 === 2 ? P.gold : P.mala); }
    // the front arms: both hands on his hips
    for (const sd of [-1, 1]) { sbLimb(c, [sd * 160, -900], [sd * 260, -760], 44, P.skin); sbLimb(c, [sd * 260, -760], [sd * 160, -640], 40, P.skin); sbEll(c, sd * 150, -630, 40, 36, P.skin, { tex: false }); sbDry(c, [[sd * 236, -720], [sd * 276, -730]], 14, P.gold, .9, 4, { n: 6 }); }
    // the head, smiling down
    c.save(); c.translate(0, -1000); c.rotate(-.06 + Math.sin(t * TAU / 4) * .02); c.translate(0, 1000);
    sbEll(c, 0, -1068, 150, 150, P.hair, { tex: false });
    sbEll(c, 0, -1060, 134, 136, P.skin, { shade: ['rgba(20,30,90,.14)', .6] });
    sbShape(c, sbPoly([[-150, -1110], [150, -1110], [124, -1240], [70, -1210], [36, -1320], [0, -1370], [-36, -1320], [-70, -1210], [-124, -1240]], { n: 6 }), P.gold, { shade: ['rgba(140,70,0,.25)', .3] });
    sbDry(c, [[-152, -1116], [0, -1132], [152, -1116]], 22, P.goldDk, .9, 6, { n: 12, dry: .02 });
    sbDot(c, 0, -1190, 22, P.gem); for (const sd of [-1, 1]) sbDot(c, sd * 72, -1168, 12, P.gem);
    for (const sd of [-1, 1]) { sbDot(c, sd * 138, -1030, 20, P.gold); sbDot(c, sd * 138, -1000, 13, P.sash); }
    sbLine(c, [[-20, -1124], [-16, -1088], [0, -1076], [16, -1088], [20, -1124]], 8, '#FFFFFF', { taper: .2 }); sbLine(c, [[0, -1118], [0, -1086]], 6, P.sash, { taper: .3 });
    for (const sd of [-1, 1]) sbEye(c, sd * 50, -1060, 19, { blink: bl, happy: o.happy ?? true, look: o.look });
    sbCheek(c, -86, -1004, 42); sbCheek(c, 86, -1004, 42);
    sbMouth(c, 0, -990, 56, o.mouth || 'smile');
    c.restore();
  }, o);
}

// ---------- props ----------
function sbYagna(c, x, y, k = 1, o = {}) {
  const t = o.t || 0;
  c.save(); c.translate(x, y); c.scale(k, k);
  if (o.glow ?? 1) { c.save(); const g = c.createRadialGradient(0, -120, 0, 0, -120, 300); g.addColorStop(0, 'rgba(255,200,90,.45)'); g.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = g; c.fillRect(-300, -420, 600, 600); c.restore(); }
  // the flames: three layers of tongues, each licking upward on its own beat
  const tongues = (n, w, h, col, ph) => { for (let i = 0; i < n; i++) { const f = (i + .5) / n - .5, hh = h * (1 - Math.abs(f) * 1.2) * (1 + .12 * Math.sin(t * 7 + i * 2.1 + ph)), sw = Math.sin(t * 5 + i + ph) * 10;
    sbShape(c, sbPoly([[f * w * 2 - 34, -40], [f * w * 2 + 34, -40], [f * w * 2 + 20 + sw, -hh * .55], [f * w * 2 + sw * 2, -hh], [f * w * 2 - 20 + sw, -hh * .55]], { n: 5, jit: 1 }), col, { tex: false }); } };
  tongues(5, 120, 260, '#E2483D', 0); tongues(4, 90, 200, '#F7891B', 1.3); tongues(3, 60, 130, '#FFD24A', 2.6);
  // the brick kund
  sbShape(c, sbPoly([[-150, -50], [150, -50], [130, 40], [-130, 40]], { n: 4, jit: 1 }), '#C8643A', { shade: ['rgba(80,20,0,.25)', 1.4] });
  sbShape(c, sbPoly([[-160, -62], [160, -62], [160, -44], [-160, -44]], { n: 4, jit: .8 }), '#E08A5A', { tex: false });
  for (const yy of [-16, 14]) sbLine(c, [[-140, yy], [140, yy]], 4, 'rgba(90,30,10,.5)', { taper: .2 });
  for (const [xx, yy] of [[-90, -30], [-10, -30], [70, -30], [-50, 0], [30, 0], [110, 0], [-110, 28], [-30, 28], [50, 28]]) sbLine(c, [[xx, yy - 12], [xx, yy + 12]], 4, 'rgba(90,30,10,.45)', { taper: .2 });
  // sparks
  const r = lcg(o.seed || 4); for (let i = 0; i < 8; i++) { const f = frac(t * .6 + r()), sx = (r() - .5) * 200 + Math.sin(t * 3 + i) * 20; sbDot(c, sx, -200 - f * 260, 7 * (1 - f), '#FFD24A'); }
  c.restore();
}
function sbStar(c, x, y, r, col = '#FFFDF4') {
  sbShape(c, sbPoly([[0, -r], [r * .22, -r * .22], [r, 0], [r * .22, r * .22], [0, r], [-r * .22, r * .22], [-r, 0], [-r * .22, -r * .22]].map(([a, b]) => [x + a, y + b]), { n: 3, jit: .4 }), col, { tex: false });
}
