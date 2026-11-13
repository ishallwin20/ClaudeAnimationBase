// palm_lab.js: framing test (not part of the reel): one camera candidate per second
SHOTS.length = 0; CAPTIONS.length = 0;
const LABV = [
  { pos: [.018, .43, .155], at: [.018, 0, -.034], fov: 40 },
  { pos: [-.12, .29, .15], at: [-.012, 0, -.025], fov: 40 },
  { pos: [.13, .29, .16], at: [.03, 0, .0], fov: 40 },
  { pos: [.17, .26, .06], at: [.04, 0, -.015], fov: 40 },
  { pos: [.15, .22, .0], at: [.045, 0, -.015], fov: 36 },
];
const LABV0 = [
  { pos: [.018, .44, .17], at: [.018, 0, -.02], fov: 40 },
  { pos: [.02, .40, .13], at: [.02, 0, -.03], fov: 40 },
  { pos: [-.2, .24, .08], at: [-.01, 0, -.025], fov: 40 },
  { pos: [.12, .30, .17], at: [.03, 0, .01], fov: 40 },
  { pos: [.2, .22, -.02], at: [.04, 0, -.015], fov: 40 },
  { pos: [.24, .12, .1], at: [.04, 0, -.01], fov: 40 },
  { pos: [-.1, .3, .2], at: [-.01, 0, -.02], fov: 40 },
  { pos: [.16, .3, .1], at: [.035, 0, .0], fov: 40 },
];
const LABS = [
  [{ pos: [.03, .17, .16], at: [0, .03, -.08], fov: 40 }, { hand: REST, pour: 1, pourFlow: 1, pool: .7 }],
  [{ pos: [-.2, .1, .05], at: [0, -.03, -.08], fov: 40 }, { hand: tiltTo(1, SET.DEVA_E), devaFlow: 1, pool: .3 }],
  [{ pos: [.12, .02, -.2], at: [.05, -.04, -.02], fov: 40 }, { hand: tiltTo(1, SET.PITRI_E), pitriFlow: 1, til: 1, pool: .2, cold: 1 }],
  [{ pos: [.2, -.02, -.12], at: [.05, -.05, -.02], fov: 40 }, { hand: tiltTo(1, SET.PITRI_E), pitriFlow: 1, til: 1, pool: .2, cold: 1 }],
  [{ pos: [.0, .12, -.22], at: [.04, -.04, -.03], fov: 40 }, { hand: tiltTo(1, SET.PITRI_E), pitriFlow: 1, til: 1, pool: .2, cold: 1 }],
  [{ pos: [.018, .43, .155], at: [.018, 0, -.034], fov: 40 }, { hand: REST, pool: .9 }],
  [{ pos: [.02, .16, .12], at: [.005, 0, -.01], fov: 40 }, { hand: REST, pool: .9 }],
  [{ pos: [0, .24, .24], at: [.01, 0, -.03], fov: 44 }, { hand: { pos: [0, .09, .1], rot: [.6, -.15, .25] }, pool: .8, poolO: { dz: .02, dx: .01 } }],
];
SHOTS.push({ a: 0, b: 99, draw(c, u, t) {
  const [v, st] = LABS[Math.floor(t) % LABS.length];
  const ex = SET.set(t, { mk: ALL({ pitri: [1, 'cold'] }), ...st });
  cam3(v);
  render3(c, SET.S, CAM3, { exposure: ex, fx: lens(dist(v.at), 3) });
  [['1', P.deva], ['2', P.praja], ['3', P.brahma], ['4', P.pitri], ['T', SET.H.TH.J[3]]].forEach(([n, p]) => { const [x, y] = toScreen3(W3(p)); text(c, n, x, y, '700 50px Cinzel', '#00FFAA'); });
  c.save(); c.strokeStyle = 'rgba(0,255,170,.6)'; c.lineWidth = 3; c.strokeRect(80, 420, 850, 1080); c.restore();
  text(c, 'V' + (Math.floor(t) % LABV.length), 100, 380, '700 50px Cinzel', '#fff');
} });
