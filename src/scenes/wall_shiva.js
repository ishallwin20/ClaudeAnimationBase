// wall_shiva.js: "Om Namah Shivaya" (Painted): Shiva in meditation on Kailash at night, eyes closed, a soft blue aura,
// the Ganga trickling from his jata, Vasuki lifting his head and flicking his tongue, snow drifting, stars, and the
// snowy peak behind him.
(() => {
  const C = { skyHi: '#0E1630', skyMid: '#1C2A55', skyLo: '#2E4478', snow: '#EEF4FA', snowDk: '#B8C8E0', rock: '#3A4466', rockDk: '#262E4A', aura: '#9CC8FF' };
  function scene(t, snake) {
    boilSeed('ws sky');
    paint(rectPts(-60, -60, DW + 120, DH + 120), { wash: C.skyHi, ink: null });
    glow(540, 1500, 1500, '#2A4A9A', .9); glow(540, 1400, 900, '#3A5CB0', .6);   // night light rising from the horizon
    twinkle(t, 60, 'ws', { y1: 1400, col: '#EAF2FF' });
    // Kailash: the snowy peak behind him, with two lower ridges
    boilSeed('ws peak');
    paint([[-60, 1700], [160, 1420], [300, 1520], [420, 1330], [540, 980], [660, 1300], [780, 1240], [900, 1450], [1140, 1560], [1140, 2400], [-60, 2400]], { wash: C.rock, fill: C.rockDk, fillOp: 60, tex: .4, ink: null });
    paint([[400, 1360], [470, 1190], [540, 980], [610, 1170], [680, 1330], [640, 1300], [600, 1380], [560, 1300], [520, 1400], [480, 1310], [440, 1390]], { wash: C.snow, fill: C.snowDk, fillOp: 70, tex: .4, ink: null, curv: .2 });
    paint([[100, 1500], [160, 1420], [230, 1470], [190, 1500], [150, 1480]], { wash: C.snow, ink: null });
    paint([[740, 1280], [780, 1240], [840, 1330], [800, 1310], [770, 1340]], { wash: C.snow, ink: null });
    glow(540, 980, 260, '#CFE4FF', .3);
    // the aura behind him: rings breathing out, one a loop
    const sx = 540, sy = 2010, u = 40;
    for (let i = 0; i < 3; i++) { const k = frac(i / 3 + t / WL), r = 300 + k * 420; glow(sx, sy - 13 * u, r, C.aura, .28 * Math.sin(k * Math.PI)); }
    glow(sx, sy - 12 * u, 430, '#BFDBFF', .45);
    // the rock ledge he sits on, snow on it
    boilSeed('ws ledge');
    paint([[-60, 2000], [200, 1960], [540, 1975], [880, 1955], [1140, 1990], [1140, 2400], [-60, 2400]], { wash: C.rockDk, fill: '#1A2038', fillOp: 70, tex: .4, ink: null, curv: .5 });
    paint([[-60, 2010], [200, 1965], [540, 1980], [880, 1960], [1140, 1995], [1140, 2050], [880, 2025], [540, 2050], [200, 2030], [-60, 2060]], { wash: C.snow, fill: C.snowDk, fillOp: 60, tex: .4, ink: null, curv: .5 });
    // Shiva
    const breath = lsin(t, 2) * .1;
    rigClock(t, 'shiva', 0, () => shiva(sx, sy, u, {
      ...SHV_SKIN, eyes: 'closed', mouth: 'smile', ganga: 1, dy: -breath, sq: breath * .2, htilt: lsin(t, 1, .2) * .025,
      moonWob: lsin(t, 2) * .05, ...snake, boilKey: 'ws shiva', noShadow: true,
    }), { noBlink: true });
    // snow drifting down in front
    petalFall(t, 40, 'ws snow', { y0: 120, s: 7, cols: [['#FFFFFF', '#DDE8F6'], ['#EEF4FF', '#C8D8EE']] });
  }
  // the loop (Android, the website): Vasuki lifts his head and flicks his tongue once a loop
  wallpaper('wall_shiva', t => {
    const up = Math.max(0, lsin(t, 1, .55)), tongue = Math.max(0, lsin(t, 6, .1)) * (up > .6 ? 1 : 0);
    scene(t, { snakeUp: .55 * up, snakeEyes: up > .4 ? 'open' : 'closed', snakeTongue: tongue, snakeTongueFront: 1.4, snakeLook: lsin(t, 1, .3) * .6 });
  });
  // the iPhone wake-up (2 s; the lock screen plays ~1.5 s of a Live Photo, then holds the still at WAKE_KEY): Vasuki,
  // asleep on his shoulder, pops up (anticipation, overshoot), flicks his tongue at you twice and settles, smiling
  const WAKE_KEY = 1.5;
  LOOPS.wall_shiva_wake = t => {
    wallBegin();
    const dip = .06 * Math.sin(Math.PI * seg(t, .12, .3)), rise = backOut(seg(t, .3, .62)), settle = spring(t, .62, 7, 16) * .12;
    const flick = (a) => Math.sin(Math.PI * seg(t, a, a + .26));   // long enough to read on the lock screen
    scene(t, {
      snakeUp: clamp(.88 * rise - dip + settle, 0, 1), snakeEyes: t < .36 ? 'closed' : t < 1.25 ? 'open' : 'happy',
      snakeTongue: Math.max(flick(.66), flick(1.0)), snakeTongueFront: 1.4, snakeLook: lerp(-.9, .15, ease(seg(t, .35, .8))),
    });
    wallEnd();
  };
  LOOPS.wall_shiva_wake.len = 2;
  LOOPS.wall_shiva_wake.key = WAKE_KEY;
})();
