// dasha_cast.js: the Dashavatar book's cast sheets for review (one sheet per slot, rendered at t = slot + .5), in the
// book's design space (DW × DH = half the 300 dpi spread canvas, under scale 2). Gods: src/po_dasha_gods.js.
(() => {
  const DW = W / 2, DH = H / 2, K = W / DW;
  PT.k = K;
  Object.assign(LOOK, { bloom: .04, vignette: 0, grain: .02 });
  // a frontal figure with its soles at (x, y)
  const front = (c, x, y, s, fn, o = {}) => { c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -PF_SOLE); fn(c, o); c.restore(); };
  const side = (c, x, y, s, fn, o = {}, flip = false) => { c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); fn(c, o); c.restore(); };
  const paper = (c, seed) => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(poPaper(W, H, seed), 0, 0); c.restore(); };
  const label = (c, x, y, txt) => { c.save(); c.font = '600 22px Poppins'; c.fillStyle = 'rgba(60,40,40,.7)'; c.textAlign = 'center'; c.fillText(txt, x, y); c.restore(); };
  function gods(c) {
    paper(c, 3);
    c.save(); c.scale(K, K);
    const gy = 1250;
    front(c, 330, gy, .95, pdVishnuStand, {});
    front(c, 900, gy, .95, pdBrahma, { pose: 'pray' });
    front(c, 1430, gy, .95, pdBrahma, { pose: 'bless' });
    front(c, 1920, gy, .95, pdShivaStand, {});
    front(c, 2340, gy, .95, pdIndra, {});
    c.restore();
  }
  SHOTS.push({ a: 0, b: 1, draw: gods });

  // Vishnu asleep on Shesha (po_cast.js) recoloured to the book's cloud blue, Brahma on the navel lotus
  function ananta(c, x, y, s, o = {}) {
    const keep = { ...PO.skin }; Object.assign(PO.skin, PDX.vishnu);
    c.save(); c.translate(x, y); c.scale(s, s); c.translate(-566, -1340);
    pdHalo(c, ...PO_ANANTA.halo, PO_ANANTA.haloR * 1.05, { a: .9 });
    poAnantaHood(c); poAnantaBed(c);
    poAnantaNavel(.3, 1)(c);
    const [lx, ly] = PO_ANANTA.lotus; c.save(); c.translate(lx, ly - 6); c.scale(.17, .17); c.translate(0, -190); pdBrahma(c, { pose: 'seat', halo: .8 }); c.restore();
    c.restore();
    Object.assign(PO.skin, keep);
  }
  function gods2(c) {
    paper(c, 4);
    c.save(); c.scale(K, K);
    const gy = 1230;
    ananta(c, 520, 1060, .78);
    side(c, 1090, gy - 40, .62, pdLakshmi, { pose: 'serve' }, true);
    side(c, 1400, gy, .62, pdLakshmi, { pose: 'seat' });
    side(c, 1920, gy - 10, .62, pdBhumiCow, { mood: 'sad' });
    side(c, 2360, gy - 10, .5, pdBhumiCow, { mood: 'hope' }, true);
    front(c, 1650, 620, .42, pdBrahma, { pose: 'seat' });
    c.restore();
  }
  function folk(c) {
    paper(c, 6);
    c.save(); c.scale(K, K);
    const gy = 1230, s = .78;
    // a child helping an elder across the path
    side(c, 200, gy, s, pdPerson, { kind: 'elder', legs: 'walk', near: [.5, .3, 'grip'], far: [.4, -.2, 'up'], prop: { near: 'stick' }, eye: 'low' });
    side(c, 340, gy, s, pdPerson, { kind: 'boy', legs: 'walk', far: [-.6, -1.4, 'up'], near: [.2, .3, 'open'], tilt: -.15, top: PW.leafCloth });
    // a farmer sharing grain with a woman
    side(c, 680, gy, s, pdPerson, { kind: 'man', near: [.9, 1.5, 'grip'], far: [.8, 1.3, 'grip'], prop: { near: 'basket', far: 'grain' }, tilt: .1, lean: .1 });
    side(c, 1000, gy, s, pdPerson, { kind: 'woman', near: [.7, 1.4, 'up'], far: [.6, 1.3, 'up'], prop: { near: 'bowl' }, tilt: .05 }, true);
    // a teacher under a banyan with two students
    side(c, 1300, gy, s, pdPerson, { kind: 'sage', legs: 'sit', near: [.5, 1.6, 'open'], far: [.4, 1.2, 'up'], prop: { far: 'leaf' } });
    side(c, 1560, gy, s, pdPerson, { kind: 'girl', legs: 'sit', near: [.3, 1.1, 'grip'], far: [.3, 1, 'up'], prop: { near: 'leaf' }, tilt: -.1 }, true);
    side(c, 1700, gy, s, pdPerson, { kind: 'boy', legs: 'sit', near: [.3, 1.2, 'join'], far: [.3, 1.2, 'join'], tilt: -.1 }, true);
    // a boy returning a lost purse
    side(c, 1950, gy, s, pdPerson, { kind: 'boy', near: [1.2, 1.5, 'up'], far: [.2, .3, 'open'], prop: { near: 'purse' }, top: PW.rust });
    side(c, 2200, gy, s, pdPerson, { kind: 'man', near: [.5, 1.2, 'open'], far: [.2, .2, 'open'], tilt: .2, eye: 'wide', brow: 1, mouth: 'smile', pagri: PW.rust }, true);
    // worried villagers
    side(c, 2420, gy, s, pdPerson, { kind: 'woman', near: [.3, 2.6, 'open'], far: [.2, 2.5, 'open'], eye: 'wide', brow: -1, mouth: 'calm', tilt: -.25, cloth: PW.leafCloth, top: PW.rust }, true);
    c.restore();
  }
  SHOTS.push({ a: 1, b: 2, draw: gods2 });
  SHOTS.push({ a: 2, b: 3, draw: folk });

  function furniture(c) {
    paper(c, 8);
    c.save(); c.scale(K, K);
    // a spread in miniature: the left page wilted, the right in bloom (pp. 7-8); a plain page below the medallions
    pdPageFrame(c, 70, 70, 620, 620, { bw: 44, bleed: 0, wilt: 1, accent: '#C9A24A', seed: 3 });
    pdPageFrame(c, 620, 70, 1170, 620, { bw: 44, bleed: 0, bloom: 1, accent: '#C9A24A', seed: 4 });
    pdBanner(c, 620, 760, 1000, 110);
    pdWisdomBox(c, 620, 1060, 760, 300);
    const icons = ['fish', 'tortoise', 'boar', 'lion', 'vamana', 'axe', 'bow', 'flute', 'buddha', 'horse'];
    icons.forEach((ic, i) => pdMedallion(c, 1360 + (i % 5) * 270, 200 + Math.floor(i / 5) * 270, 100, ic, { glow: .4 }));
    ['shankha', 'chakra', 'gada', 'padma'].forEach((ic, i) => pdMedallion(c, 1360 + i * 230, 760, 86, ic, { field: '#6E1E2A', fieldGlow: '#A2364A' }));
    pdGoldenLotus(c, 2280, 1150, 170);
    c.restore();
  }
  SHOTS.push({ a: 3, b: 4, draw: furniture });

  // two page mock-ups: the title page (p. 1) and Vishnu rising over the clouds (the right page of pp. 7-8)
  function mocks(c) {
    paper(c, 9);
    c.save(); c.scale(K, K);
    const PW2 = DW / 2, b = 18, hz = 820;
    // p. 1: the night over the glowing ocean, the golden lotus, ten lights, the chakra rising behind the title
    c.save(); const cl = new Path2D(); cl.rect(0, 0, PW2, DH); c.clip(cl);
    pdNightSky(c, 0, 0, PW2, hz, { seed: 3 });
    c.save(); c.globalAlpha = .5; pdChakra(c, PW2 / 2, 330, 150); c.restore();
    glow(c, PW2 / 2, 330, 420, '#FFE2A0', .25, 'source-over');
    pdMilkOcean(c, 0, hz, PW2, DH, {});
    pdGoldenLotus(c, PW2 / 2, 1000, 200);
    for (let i = 0; i < 10; i++) { const a = Math.PI * (1.12 + i / 9 * .76), x = PW2 / 2 + Math.cos(a) * 420, y = 760 + Math.sin(a) * 260; glow(c, x, y, 40, '#FFE6A0', .9, 'source-over'); ellipse(c, x, y, 7, 7, '#FFF6DC'); }
    pdPageFrame(c, b, b, PW2 - b, DH - b, { bw: 64, bleed: 30, accent: '#C9A24A', seed: 1 });
    c.restore();
    // p. 8: Vishnu rises over the clouds in a burst of gold, the ten forms faint in an arc
    c.save(); c.translate(PW2, 0); const cr = new Path2D(); cr.rect(0, 0, PW2, DH); c.clip(cr);
    pdNightSky(c, 0, 0, PW2, DH, { stops: [[0, '#2A2460'], [.5, '#7A5A8E'], [1, '#E8B88A']], seed: 9, stars: 60 });
    glow(c, PW2 / 2, 520, 700, '#FFD88A', .55, 'source-over');
    const icons = ['fish', 'tortoise', 'boar', 'lion', 'vamana', 'axe', 'bow', 'flute', 'buddha', 'horse'];
    icons.forEach((ic, i) => { const a = Math.PI * (1.08 + i / 9 * .84), x = PW2 / 2 + Math.cos(a) * 500, y = 640 + Math.sin(a) * 470; c.save(); c.globalAlpha = .55; c.translate(x, y); c.scale(.42, .42); glow(c, 0, 0, 110, '#FFF0C0', .6, 'source-over'); pdIcon(c, ic); c.restore(); });
    front(c, PW2 / 2, 1640, .98, pdVishnuStand, { bless: true, seat: false });
    pdCloud(c, PW2 / 2 + 60, DH - 120, 900, 4, 1, '#F8EEE6', 'rgba(170,130,150,.6)');
    pdCloud(c, PW2 / 2 - 380, DH + 10, 700, 7, 1, '#F4E6E0', 'rgba(170,130,150,.6)');
    pdCloud(c, PW2 / 2 + 400, DH + 30, 640, 11, 1, '#F4E6E0', 'rgba(170,130,150,.6)');
    pdPageFrame(c, b, b, PW2 - b, DH - b, { bw: 64, bleed: 30, bloom: 1, accent: '#C9A24A', seed: 2 });
    c.restore();
    c.restore();
  }
  SHOTS.push({ a: 4, b: 5, draw: mocks });
})();
