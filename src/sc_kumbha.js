// sc_kumbha.js: Kumbhakarna asleep, for the Scribble style (load after scribble.js and sc_cast.js), a myna, and his
// palace hall at night.
//
// Kumbhakarna lies on his back on a crimson mattress, head to the left on a gold bolster, his face turned to us: dark
// cloud-blue skin (Valmiki's rakshasas are "like a dark cloud"), a mop of black hair, a gold mukut knocked askew, bushy
// brows, a curling moustache, two little fangs, gold hoops; a huge round belly with his near hand resting on top of it,
// a red dhoti with a gold border, his feet sticking up at the right. scKumbha() → { bed, legs, belly, head, mouth,
// moustache }; the head parts are drawn upright round SCK.head and turned by SCK.rot (scKumbhaHead lays them down).
//   scMyna() → part, a myna drawn round (0, 0) standing on (0, 0)
//   scHall(c, o): the palace hall at night far out of focus: arched windows of moonlight, torches on the pillars
const SCK = { head: [232, 1408], rot: -1.18, belly: [600, 1640], bellyTop: [700, 1288], mouth: [232, 1508], hand: [612, 1296] };
const SC_KUM = { skin: '#5D6C95', dk: '#36415F', lt: '#93A2C8', hair: '#1D1B26', hairLt: '#3E3A52', gold: '#EDB838', goldDk: '#A97818',
  goldLt: '#FFE48A', red: '#B8322A', redDk: '#7E1C16', redLt: '#DE5A48', bed: '#8E2438', bedDk: '#5A1424', bedLt: '#C04A5E',
  pillow: '#E2A63A', pillowDk: '#A8701C', mouth: '#5A1A22', tongue: '#D85A6A', fang: '#FBF4E6', ink: '#14121C' };
const scKumCols = () => [SC_KUM.lt, SC_KUM.skin, SC_KUM.dk];
const SCK_SKIN = { len: 28, w: 1.3, dens: 1.5, hair: .15, outline: 6, under: .88, underBlur: 2.5, jit: .14, lt: .16, dk: .08, follow: 1.2, curl: .45, inkCol: '#1A1A2A' };

function scKumbha() {
  const K = SC_KUM, [HX, HY] = SCK.head;
  const bed = scPart('kb-bed', [0, 1480, 1080, 300], [{
    len: 34, w: 1.4, dens: 1.5, flow: 0, follow: .9, hair: .15, outline: 6, under: .8, inkCol: '#3A0A14',
    draw(c) {   // the mattress, and the bolster under his head
      c.save(); c.beginPath(); c.moveTo(-20, 1606); c.quadraticCurveTo(540, 1590, 1100, 1606); c.lineTo(1100, 1740); c.lineTo(-20, 1740); c.closePath();
      const g = c.createLinearGradient(0, 1590, 0, 1740); g.addColorStop(0, K.bedLt); g.addColorStop(.3, K.bed); g.addColorStop(1, K.bedDk); c.fillStyle = g; c.fill(); c.restore();
      c.save(); c.translate(150, 1560); c.rotate(-.05); scBall(c, 0, 0, 170, 66, ['#FFE08A', K.pillow, K.pillowDk]); c.restore();
    },
    ink(c, rnd) {
      scInk(c, [[-20, 1676], [540, 1668], [1100, 1676]], 10, K.gold, rnd, { alpha: .9 });
      for (let x = 20; x < 1080; x += 46) scDot(c, x, 1700 + Math.sin(x) * 2, 4, K.goldLt, rnd);
      [40, 260].forEach(x => scInk(c, [[x, 1510], [x - 8, 1560], [x, 1612]], 6, K.red, rnd, { alpha: .85 }));
    },
  }], { seed: 71 });

  const legs = scPart('kb-legs', [700, 1380, 380, 260], [{
    ...SCK_SKIN, flow: 0,
    draw(c) {   // shins along the bed, the feet standing up at the end, soles to the right
      limb(c, [[760, 1580], [880, 1584], [990, 1574]], [96, 80, 62], K.dk);
      limb(c, [[756, 1574], [880, 1578], [986, 1568]], [84, 70, 54], K.skin);
      c.save(); c.translate(1018, 1500); c.rotate(.12); scBall(c, 0, 0, 46, 84, scKumCols()); c.restore();
      c.save(); c.translate(1032, 1508); c.rotate(.12); scBall(c, 0, 0, 24, 64, ['#C9C4D8', '#A9A4C0', '#7E7898']); c.restore();
    },
    ink(c, rnd) {   // gold anklets, toes
      scInk(c, [[968, 1530], [978, 1574], [972, 1610]], 7, K.gold, rnd);
      [[1010, 1420], [1024, 1418], [1038, 1422], [1050, 1430]].forEach(([x, y]) => scDot(c, x, y, 7, K.dk, rnd));
    },
  }, {
    len: 30, w: 1.4, dens: 1.5, flow: 0, follow: 1, hair: .15, outline: 5, under: .85, inkCol: '#4A0A08',
    draw(c) {   // the dhoti over his thighs
      c.save(); c.beginPath(); c.moveTo(720, 1430); c.quadraticCurveTo(820, 1470, 900, 1520); c.lineTo(910, 1604); c.quadraticCurveTo(800, 1620, 720, 1610); c.closePath();
      const g = c.createLinearGradient(0, 1430, 0, 1610); g.addColorStop(0, K.redLt); g.addColorStop(.5, K.red); g.addColorStop(1, K.redDk); c.fillStyle = g; c.fill(); c.restore();
    },
    ink(c, rnd) { scInk(c, [[900, 1522], [908, 1560], [910, 1602]], 7, K.gold, rnd); },
  }], { seed: 73 });

  const belly = scPart('kb-belly', [240, 1240, 640, 400], [{
    ...SCK_SKIN, flow: (x, y) => Math.atan2(y - 1560, x - 600) + Math.PI / 2,
    draw(c) {   // the chest leading up to his head, and the great round belly
      scBall(c, 400, 1540, 150, 100, scKumCols(), -.2);
      c.save(); c.beginPath(); c.rect(0, 0, 2000, 1620); c.clip(); scBall(c, 600, 1560, 266, 290, scKumCols(), 0, -.25, -.55); c.restore();
      c.save(); c.globalAlpha = .4; scBall(c, 560, 1380, 110, 90, ['#C8D2EC', K.lt, K.skin]); c.restore();
    },
    ink(c, rnd) {
      scInk(c, [[620, 1470], [632, 1484], [644, 1472]], 3, '#232A44', rnd, { alpha: .7 });   // his navel
      // gold necklaces across the chest
      scInk(c, [[330, 1480], [380, 1530], [440, 1556]], 7, K.gold, rnd); scInk(c, [[310, 1508], [370, 1570], [430, 1600]], 5, K.gold, rnd);
      scDot(c, 386, 1540, 8, '#D2283A', rnd);
    },
  }, {
    len: 30, w: 1.4, dens: 1.5, flow: 0, follow: 1, hair: .15, outline: 5, under: .85, inkCol: '#4A0A08',
    draw(c) {   // the dhoti's waist across the bottom of the belly
      c.save(); c.beginPath(); c.moveTo(700, 1360); c.quadraticCurveTo(830, 1420, 860, 1620); c.lineTo(720, 1620); c.quadraticCurveTo(760, 1480, 700, 1360); c.closePath();
      const g = c.createLinearGradient(700, 0, 860, 0); g.addColorStop(0, K.redLt); g.addColorStop(.5, K.red); g.addColorStop(1, K.redDk); c.fillStyle = g; c.fill(); c.restore();
      c.save(); c.strokeStyle = K.gold; c.lineWidth = 16; c.beginPath(); c.moveTo(700, 1362); c.quadraticCurveTo(752, 1480, 722, 1618); c.stroke(); c.restore();
    },
  }, {
    ...SCK_SKIN, follow: 1.5,
    draw(c) {   // his near arm, the hand resting on top of the belly
      limb(c, [[350, 1480], [440, 1418], [530, 1352], [596, 1310]], [84, 74, 62, 52], K.dk);
      limb(c, [[346, 1474], [436, 1412], [526, 1346], [592, 1304]], [70, 62, 52, 44], K.skin);
      scBall(c, 616, 1300, 40, 30, scKumCols(), -.5);
      [[640, 1278, -.6], [650, 1294, -.3], [652, 1312, 0]].forEach(([x, y, a]) => { c.save(); c.translate(x, y); c.rotate(a); scBall(c, 0, 0, 18, 10, scKumCols()); c.restore(); });
    },
    ink(c, rnd) { scInk(c, [[560, 1300], [578, 1326], [586, 1350]], 9, K.gold, rnd); scInk(c, [[420, 1396], [440, 1420], [446, 1446]], 9, K.gold, rnd); },
  }], { seed: 75 });

  // the head, upright round (HX, HY); laid down turned by SCK.rot
  const head = scPart('kb-head', [HX - 230, HY - 320, 460, 520], [{
    len: 46, w: 1.5, dens: 1.6, follow: 1.2, hair: 1.1, outline: 8, curl: .6, inkCol: '#000000', jit: .3, lt: .2, dk: .2,
    flow: (x, y) => Math.atan2(y - HY, x - HX),
    draw(c) {   // the wild black hair behind the face
      for (let i = 0; i < 11; i++) { const a = Math.PI * (1.05 + i / 10 * .9), r = 150; scBall(c, HX + Math.cos(a) * r * 1.05, HY + 10 + Math.sin(a) * r, 70, 64, [K.hairLt, K.hair, '#08080C']); }
      scBall(c, HX, HY - 20, 176, 150, [K.hairLt, K.hair, '#08080C']);
    },
  }, {
    ...SCK_SKIN, flow: (x, y) => Math.atan2(y - HY, x - HX) + Math.PI / 2,
    draw(c) {   // the face and ears
      scBall(c, HX - 150, HY + 10, 34, 44, scKumCols()); scBall(c, HX + 150, HY + 10, 34, 44, scKumCols());
      scBall(c, HX, HY + 20, 150, 140, scKumCols());
      scBall(c, HX, HY + 30, 40, 34, scKumCols());   // the nose
      [[HX - 90, HY + 60], [HX + 90, HY + 60]].forEach(([x, y]) => { const b = c.createRadialGradient(x, y, 2, x, y, 40); b.addColorStop(0, 'rgba(200,110,160,.4)'); b.addColorStop(1, 'rgba(200,110,160,0)'); c.fillStyle = b; c.fillRect(x - 42, y - 42, 84, 84); });
    },
    ink(c, rnd) {
      const I = K.ink;
      // bushy brows, heavy closed eyes
      scInk(c, [[HX - 112, HY - 54], [HX - 80, HY - 72], [HX - 30, HY - 60]], 12, I, rnd); scInk(c, [[HX + 30, HY - 60], [HX + 80, HY - 72], [HX + 112, HY - 54]], 12, I, rnd);
      scInk(c, [[HX - 100, HY - 20], [HX - 78, HY - 4], [HX - 50, HY - 4], [HX - 30, HY - 18]], 5, I, rnd);
      scInk(c, [[HX + 30, HY - 18], [HX + 50, HY - 4], [HX + 78, HY - 4], [HX + 100, HY - 20]], 5, I, rnd);
      scInk(c, [[HX, HY - 100], [HX, HY - 74]], 9, '#E0401E', rnd);   // a red tilak
      scDot(c, HX - 14, HY + 44, 5, '#1A1E30', rnd); scDot(c, HX + 14, HY + 44, 5, '#1A1E30', rnd);
      [[HX - 152, HY + 64], [HX + 152, HY + 64]].forEach(([x, y]) => { c.save(); c.strokeStyle = K.gold; c.lineWidth = 8; c.beginPath(); c.ellipse(x + (rnd() - .5) * 1.5, y, 22, 26, 0, 0, TAU); c.stroke(); c.restore(); });
    },
  }, {
    len: 18, w: 1.3, dens: 1.8, flow: Math.PI / 2, follow: 1, hair: .1, outline: 4, under: .9, underBlur: 2, inkCol: '#7A5A1C',
    draw(c) {   // the mukut, knocked to one side
      c.save(); c.translate(HX + 36, HY - 160); c.rotate(.32);
      c.beginPath(); c.moveTo(-90, 40); c.lineTo(-80, -40); c.quadraticCurveTo(-40, -70, 0, -120); c.quadraticCurveTo(40, -70, 80, -40); c.lineTo(90, 40); c.quadraticCurveTo(0, 20, -90, 40); c.closePath();
      const g = c.createLinearGradient(-90, 0, 90, 0); g.addColorStop(0, K.goldLt); g.addColorStop(.45, K.gold); g.addColorStop(1, K.goldDk); c.fillStyle = g; c.fill(); c.restore();
    },
    ink(c, rnd) { c.save(); c.translate(HX + 36, HY - 160); c.rotate(.32); scDot(c, 0, -20, 14, '#2E8A5A', rnd); [-50, 0, 50].forEach(x => scDot(c, x, 26, 6, '#D2283A', rnd)); c.restore(); },
  }], { seed: 77 });

  const mouth = scPart('kb-mouth', [HX - 60, HY + 60, 120, 100], [{
    len: 12, w: 1.2, dens: 1.8, flow: 0, follow: 1, hair: 0, outline: 3, under: .95, underBlur: 1, soft: 5, inkCol: '#2A0A10',
    draw(c) { scBall(c, HX, SCK.mouth[1] - 2, 40, 34, ['#7A2A34', K.mouth, '#2A0810']); c.fillStyle = K.tongue; c.beginPath(); c.ellipse(HX, SCK.mouth[1] + 16, 22, 12, 0, 0, TAU); c.fill(); },
    ink(c, rnd) {   // two little fangs pointing up from the lower lip
      [-26, 26].forEach(dx => { c.save(); c.fillStyle = K.fang; c.beginPath(); c.moveTo(HX + dx - 8, SCK.mouth[1] + 30); c.lineTo(HX + dx, SCK.mouth[1] + 6); c.lineTo(HX + dx + 8, SCK.mouth[1] + 30); c.closePath(); c.fill(); c.restore(); });
    },
  }], { seed: 79, pad: 20 });

  const moustache = scPart('kb-moustache', [HX - 170, HY + 30, 340, 120], [{
    len: 20, w: 1.4, dens: 1.8, follow: 1.5, hair: .25, outline: 2, curl: .4, inkCol: '#000000', jit: .2, lt: .25, dk: .1, under: .95, underBlur: 1.5,
    flow: 0,
    draw(c) {   // a big curling moustache, a little lighter than the hair so it reads against it
      [-1, 1].forEach(m => limb(c, [[HX + m * 6, HY + 66], [HX + m * 60, HY + 80], [HX + m * 112, HY + 76], [HX + m * 150, HY + 50], [HX + m * 144, HY + 26], [HX + m * 124, HY + 34]], [46, 50, 40, 28, 18, 12], '#2E2A3E'));
    },
    ink(c, rnd) { [-1, 1].forEach(m => scInk(c, [[HX + m * 20, HY + 70], [HX + m * 80, HY + 80], [HX + m * 132, HY + 64], [HX + m * 146, HY + 36]], 2, '#6A6488', rnd, { alpha: .6 })); },
  }], { seed: 81, pad: 20 });
  return { bed, legs, belly, head, mouth, moustache };
}
// lay the head parts down, turned by SCK.rot about SCK.head; o: { dy, rot, mouth: [sx, sy], tash: [sx, rot] }
function scKumbhaHead(c, P, t, o = {}) {
  const [HX, HY] = SCK.head;
  c.save(); c.translate(HX, HY + (o.dy || 0)); c.rotate(SCK.rot + (o.rot || 0)); c.translate(-HX, -HY);
  scDraw(c, P.head, t);
  const [msx, msy] = o.mouth || [1, 1], [tsx, trot] = o.tash || [1, 0];
  scDraw(c, P.mouth, t, { ax: HX, ay: SCK.mouth[1], sx: msx, sy: msy });
  scDraw(c, P.moustache, t, { ax: HX, ay: HY + 72, sx: tsx, rot: trot });
  c.restore();
}
// where a point of the upright head lands on screen
function scKumbhaAt(x, y, dy = 0) {
  const [HX, HY] = SCK.head, a = SCK.rot, dx = x - HX, dd = y - HY;
  return [HX + dx * Math.cos(a) - dd * Math.sin(a), HY + dy + dx * Math.sin(a) + dd * Math.cos(a)];
}

// ---------- a myna ----------
function scMyna() {
  return scPart('myna', [-60, -90, 120, 96], [{
    len: 12, w: 1.2, dens: 2, flow: 0, follow: 1.2, hair: .5, outline: 4, under: .85, underBlur: 1.5, soft: 5, inkCol: '#1A1008',
    draw(c) {
      c.fillStyle = '#3A2416'; c.beginPath(); c.moveTo(28, -46); c.lineTo(60, -26); c.lineTo(26, -26); c.closePath(); c.fill();   // tail
      scBall(c, 4, -36, 34, 28, ['#B08A6A', '#7A5238', '#4A2E1E'], -.2);
      scBall(c, -22, -62, 20, 19, ['#4A4A52', '#1E1E26', '#08080C']);
      c.fillStyle = '#F2C230'; c.beginPath(); c.moveTo(-38, -66); c.lineTo(-58, -58); c.lineTo(-38, -54); c.closePath(); c.fill();
      c.fillStyle = '#F4D04A'; c.beginPath(); c.ellipse(-26, -62, 8, 7, 0, 0, TAU); c.fill();
      c.strokeStyle = '#E2B020'; c.lineWidth = 3; c.beginPath(); c.moveTo(-4, -10); c.lineTo(-8, 4); c.moveTo(10, -10); c.lineTo(8, 4); c.stroke();
    },
    ink(c, rnd) { scDot(c, -26, -64, 3, '#100808', rnd); scInk(c, [[0, -40], [18, -32], [30, -36]], 1.4, '#F2E8D8', rnd, { alpha: .7 }); },
  }], { seed: 83, pad: 14 });
}

// ---------- the palace hall at night ----------
function scHall(c, o = {}) {
  const w = o.w || W, h = o.h || H, dy = o.dy || 0;
  const cv = sprite(`sc-hall${w}x${h}+${dy}`, w, h, x => {
    const raw = scCanvas(w, h), r = raw.getContext('2d');
    const g = r.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1C1424'); g.addColorStop(.5, '#3A2430'); g.addColorStop(1, '#24161C');
    r.fillStyle = g; r.fillRect(0, 0, w, h);
    r.translate(0, dy);
    // three tall arched windows of moonlit sky
    [[150, 360], [540, 300], [930, 360]].forEach(([wx, wy], i) => {
      const ww = 230, wh = 820;
      const sg = r.createLinearGradient(0, wy - 200, 0, wy + wh); sg.addColorStop(0, '#2A3C78'); sg.addColorStop(1, '#5A78B8');
      r.fillStyle = sg; r.beginPath(); r.moveTo(wx - ww / 2, wy + wh); r.lineTo(wx - ww / 2, wy); r.arc(wx, wy, ww / 2, Math.PI, 0); r.lineTo(wx + ww / 2, wy + wh); r.closePath(); r.fill();
      if (i === 1) { const mg = r.createRadialGradient(wx + 30, wy + 60, 0, wx + 30, wy + 60, 120); mg.addColorStop(0, 'rgba(250,250,255,1)'); mg.addColorStop(.35, 'rgba(230,236,255,.8)'); mg.addColorStop(1, 'rgba(200,215,255,0)'); r.fillStyle = mg; r.fillRect(wx - 90, wy - 60, 240, 240); }
      const lg = r.createLinearGradient(0, wy + wh, 0, wy + wh + 500); lg.addColorStop(0, 'rgba(120,150,220,.35)'); lg.addColorStop(1, 'rgba(120,150,220,0)');   // moonlight on the floor
      r.fillStyle = lg; r.beginPath(); r.moveTo(wx - ww / 2, wy + wh); r.lineTo(wx + ww / 2, wy + wh); r.lineTo(wx + ww, wy + wh + 500); r.lineTo(wx - ww * .2, wy + wh + 500); r.closePath(); r.fill();
    });
    // pillars between the windows, with torches
    [345, 735].forEach(px => {
      r.fillStyle = '#2A1A20'; r.fillRect(px - 50, -dy - 40, 100, 1540 + dy);
      const tg = r.createRadialGradient(px, 820, 0, px, 820, 220); tg.addColorStop(0, 'rgba(255,200,110,.95)'); tg.addColorStop(.3, 'rgba(255,140,60,.45)'); tg.addColorStop(1, 'rgba(255,120,40,0)');
      r.fillStyle = tg; r.fillRect(px - 220, 600, 440, 440);
    });
    r.fillStyle = '#1A1016'; r.fillRect(-40, 1460, w + 80, h);
    x.filter = window.SC_SHARP ? 'none' : 'blur(22px)'; x.drawImage(raw, -40, -40, w + 80, h + 80); x.filter = 'none';
    const rb = scRnd(23); x.save(); x.globalCompositeOperation = 'screen';
    for (let i = 0; i < 14; i++) { const bx = rb() * w, by = dy + 700 + rb() * 600, br = 14 + rb() * 26; x.fillStyle = `rgba(255,${170 + rb() * 60 | 0},90,${.15 + rb() * .2})`; x.beginPath(); x.arc(bx, by, br, 0, TAU); x.fill(); }
    x.restore();
  });
  c.drawImage(cv, 0, 0);
}
