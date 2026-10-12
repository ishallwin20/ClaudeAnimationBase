// cine_sheet.js: the Cinematic style's reference sheet (cine.html). One panel a second, each a lit, finished frame:
//   0–9   the cast and sets: what each function draws, in the light it was made for
//   10–14 the lighting presets (LIGHTS.*) on the same Shiva, each against its own sky
//   15–22 Ravana and the Kailash story (ad 15): Ravana's poses and faces, Nandi standing, the Pushpak, Shiva's foot, the sets
// Rebuild the docs images after changing a character:
//   node render.mjs --page=cine.html --sheet=0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5 --cols=5 --w=300 --out=docs/cine_cast.jpg
//   node render.mjs --page=cine.html --sheet=10.5,11.5,12.5,13.5,14.5 --cols=5 --w=300 --out=docs/cine_lighting.jpg
//   node render.mjs --page=cine.html --sheet=15.5,16.5,17.5,18.5,19.5,20.5,21.5,22.5 --cols=4 --w=300 --out=docs/cine_cast_ravana.jpg
const panel = (i, label, draw) => SHOTS.push({ a: i, b: i + 1, draw(c, u, t) { draw(c, u + 2, t); const g = c.createLinearGradient(0, 1540, 0, 1760); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.8)'); c.fillStyle = g; c.fillRect(0, 1540, W, 400); text(c, label, 540, 1700, '700 42px Cinzel', '#F4C46A', { glow: ['rgba(0,0,0,.9)', 18], maxW: 980 }); } });
const cam0 = { z: 1 };
const nightSky = (c) => { sky(c, [[0, '#070B17'], [700, '#152039'], [1400, '#2F3B5B'], [1900, '#3E4A68']]); glow(c, 840, 420, 520, '#7F97CC', .42); ellipse(c, 840, 420, 44, 44, '#E6ECF6'); };
const dawnSky = (c) => { sky(c, [[0, '#24183A'], [560, '#5E2E4E'], [1000, '#C9663D'], [1380, '#FFCF86'], [1600, '#FFE2A8']]); glow(c, 540, 1190, 900, '#FFB45A', .55); ellipse(c, 540, 1190, 235, 235, '#FFE9B8'); };
const redSky = (c) => { sky(c, [[0, '#12040A'], [600, '#3A0A12'], [1200, '#8A1E16'], [1650, '#D0461E']]); glow(c, 540, 1650, 1000, '#FF5A1E', .45); };
const fireSky = (c) => { hallSky(c); glow(c, 540, 1300, 700, '#FF7A26', .45); };

// ---------- the cast ----------
panel(0, 'shiva()  ·  LIGHTS.moon', (c, t) => { nightSky(c); clouds(c, [[0, 900, 900, 13, 26]], t, PALETTES.nightFar, .9);
  figure(c, (f) => { f.translate(540, 2210); f.scale(1.75, 1.75); shiva(f, { t, wind: .7, eyes: 0, arm: 'abhaya' }); }, LIGHTS.moon); });
panel(1, 'shivaHead(): eyes, third eye', (c, t) => { sky(c, [[0, '#060914'], [1900, '#1D2846']]);
  figure(c, (f) => { f.translate(540, 930); f.scale(6.6, 6.6); f.translate(0, 815); shiva(f, { t, eyes: 1, third: 1, arm: 'abhaya' }); }, { ...LIGHTS.moon, edge: { ...LIGHTS.moon.edge, w: 3, a: .3 }, rim: { ...LIGHTS.moon.rim, dx: 9, dy: -4, blur: 2 } });
  glow(c, 540, 930 - 38 * 6.6, 520, '#FF7A2A', .35); });
panel(2, 'nataraja()  ·  fireRing()  ·  LIGHTS.dawnBack', (c, t) => { dawnSky(c); fireRing(c, 545, 1110, 470, t);
  figure(c, (f) => { f.translate(560, 1570); f.scale(.74, .74); nataraja(f, { t }); }, { edge: { col: '#FFD9A0', w: 2.6, a: .85 }, rim: { col: '#FFF0C8', dx: 0, dy: -4, a: .7, blur: 1 } }); });
panel(3, 'rudra(): the Tandava with Sati  ·  LIGHTS.storm', (c, t) => { redSky(c); ridge(c, 1760, 60, 22, '#12050A'); cracks(c, 540, 1740, 1, t, 9);
  figure(c, (f) => { f.translate(540, 1740); rudra(f, { t: t + .4 }); }, LIGHTS.storm); });
panel(4, 'shivaSeated()  ·  LIGHTS.moonSilhouette', (c, t) => { nightSky(c); kailash(c, 540, 860, 600); haze(c, 1420, 320, '#7886A6', .5); ledge(c, 400, 1450, '#0C111D', '#B9C8EA');
  figure(c, (f) => { f.translate(560, 1452); f.scale(.7, .7); shivaSeated(f, { t }); }, { ...LIGHTS.moonSilhouette, rim: { ...LIGHTS.moonSilhouette.rim, dx: 5 } }); });
panel(5, 'sati() from behind  ·  yagna()  ·  LIGHTS.fire', (c, t) => { fireSky(c); pillars(c, 560, 1380, 560, '#2A130F', t); yagna(c, 560, 1440, 340, t, 1);
  figure(c, (f) => { f.translate(400, 2080); f.scale(1.45, 1.45); sati(f, { t, wind: .15 }); }, LIGHTS.fire); });
panel(6, 'sati({ trishul, lotus })  ·  nandiLying()', (c, t) => { dawnSky(c); ridge(c, 1520, 90, 62, '#2E1828');
  fillPath(c, 'M -100 1720 C 120 1680 260 1650 380 1648 C 560 1640 760 1660 900 1700 L 1180 1800 L 1180 2100 L -100 2100 Z', '#1C111B');
  figure(c, (f) => { f.translate(730, 1676); f.scale(.5, .5); nandiLying(f, { t }); }, { edge: { col: '#FFD9A0', w: 2.2, a: .8 }, rim: { col: '#FFF0C8', dx: 4, dy: -3, a: .8 } });
  figure(c, (f) => { f.translate(430, 1652); f.scale(.62, .62); sati(f, { t, wind: .7, trishul: true, lotus: true }); }, LIGHTS.dawnBack); });
panel(7, 'daksha()  ·  crowd()  ·  pillars()', (c, t) => { fireSky(c); pillars(c, 600, 1440, 470, '#2A130F', t, 8, 40); yagna(c, 400, 1520, 240, t, .95);
  figure(c, (f) => { f.translate(760, 1590); f.scale(.7, .7); daksha(f, { t, point: 1, laugh: 1 }); }, { edge: { col: '#FF9A50', w: 2, a: .7 }, rim: { col: '#FFC07A', dx: -5, dy: -2, a: .9 } });
  crowd(c, -60, 1140, 1900, 7, 1.4, t, 1, '#0A0505', 9); });
panel(8, 'chakra()  ·  meteors()  ·  stars()', (c, t) => { sky(c, [[0, '#070614'], [1300, '#3E3260']]); stars(c, 140, 3, t); meteors(c, t, t - 1, 9, 3); chakra(c, 540, 900, 150, t * 6, 1, t); });
panel(9, 'kailash()  ·  ledge()  ·  clouds()  ·  rays()', (c, t) => {
  sky(c, [[0, '#060A15'], [650, '#111A30'], [1200, '#283350'], [1520, '#47516E']]); glow(c, 800, 520, 560, '#7F97CC', .38); ellipse(c, 800, 520, 50, 50, '#E6ECF6');
  rays(c, 800, 520, { n: 9, dir: 1.98, spread: .8, len: 1600, w: 300, col: '#A9BCE6', a: .13, t });
  clouds(c, [[100, 300, 760, 1, 9], [700, 420, 620, 2, 12, true]], t, PALETTES.nightFar, .9); kailash(c, 540, 860, 600); haze(c, 1420, 320, '#7886A6', .5);
  ridge(c, 1470, 110, 3, '#1A2133', { freq: .006 }); ledge(c, 500, 1590, '#0C111D', '#B9C8EA', .5);
  figure(c, (f) => { f.translate(560, 1592); f.scale(.27, .27); shiva(f, { t, wind: .9, arm: 'down' }); }, LIGHTS.moonSilhouette); });

// ---------- the lighting presets, on the same Shiva ----------
const lit = (i, name, bg) => panel(i, 'LIGHTS.' + name, (c, t) => { bg(c, t); figure(c, (f) => { f.translate(540, 2210); f.scale(1.75, 1.75); shiva(f, { t, wind: .6, arm: 'abhaya' }); }, LIGHTS[name]); });
lit(10, 'moon', nightSky);
lit(11, 'fire', (c, t) => { fireSky(c); pillars(c, 560, 1380, 560, '#2A130F', t); yagna(c, 860, 1440, 300, t, 1.2); });
lit(12, 'dawnBack', dawnSky);
lit(13, 'storm', redSky);
lit(14, 'moonSilhouette', nightSky);

// ---------- Ravana and the Kailash story (cine_ravana.js, and the later additions to cine_cast.js / cine_sets.js) ----------
panel(15, 'ravana({ weapons })  ·  LIGHTS.storm', (c, t) => { redSky(c); ridge(c, 1760, 60, 22, '#12050A');
  figure(c, (f) => { f.translate(540, 1720); f.scale(.95, .95); ravana(f, { t, weapons: true, expr: 'smirk' }); }, LIGHTS.storm); });
panel(16, 'ravana(): colour, LIGHTS.fire', (c, t) => { fireSky(c); pillars(c, 560, 1380, 560, '#2A130F', t);
  figure(c, (f) => { f.translate(540, 2100); f.scale(1.25, 1.25); ravana(f, { t, weapons: true, expr: 'smirk', armFx: { edge: { col: '#FFB070', w: 2, a: .6 } } }); }, LIGHTS.fire); });
panel(17, "ravana({ pose: 'lift' })", (c, t) => { redSky(c); ridge(c, 1760, 60, 22, '#12050A');
  figure(c, (f) => { f.translate(540, 1760); f.scale(.9, .9); ravana(f, { t, pose: 'lift', expr: 'grit', strain: 1 }); }, { ...LIGHTS.fire, tint: ['#1A0806', .35] }); });
panel(18, "ravanaHeads(): laugh", (c, t) => { fireSky(c);
  figure(c, (f) => { f.translate(540, 1000); f.scale(1.45, 1.45); f.translate(0, 800); ravanaHeads(f, { t, expr: 'laugh' }); }, { ...LIGHTS.fire, tint: ['#1A0806', .25] }); });
panel(19, "ravanaHeads(): scream · sing · grit", (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(540, 900); f.scale(4.6, 4.6); f.translate(0, 815); rvHead(f, { t, expr: 'scream', crown: 'mukut', neck: true }); }, { ...LIGHTS.fire, tint: ['#1A0806', .2] });
  figure(c, (f) => { f.translate(250, 1500); f.scale(2, 2); f.translate(0, 815); rvHead(f, { t, expr: 'sing', neck: true }); }, { ...LIGHTS.moon, tint: ['#16224A', .25] });
  figure(c, (f) => { f.translate(830, 1500); f.scale(2, 2); f.translate(0, 815); rvHead(f, { t, expr: 'grit', neck: true }); }, { ...LIGHTS.fire, tint: ['#1A0806', .2] }); });
panel(20, 'nandiStanding()  ·  pushpak()', (c, t) => { dawnSky(c); ridge(c, 1500, 120, 62, '#3A1E34');
  c.save(); c.translate(560, 560); c.scale(.85, .85); pushpak(c, { t, layer: 'back' }); figure(c, (f) => { f.translate(40, 0); f.scale(.2, .2); ravana(f, { t, expr: 'smirk' }); }, { ...LIGHTS.dawnBack, tint: ['#2A1018', .3] }); pushpak(c, { t, layer: 'front' }); c.restore();
  fillPath(c, 'M -100 1640 C 200 1600 500 1590 700 1600 C 900 1610 1100 1640 1180 1660 L 1180 2100 L -100 2100 Z', '#24121E');
  figure(c, (f) => { f.translate(600, 1620); f.scale(1.15, 1.15); nandiStanding(f, { t, eyes: 1 }); }, { tint: ['#3A1830', .15], edge: { col: '#FFD9A0', w: 2.2, a: .7 }, rim: { col: '#FFF0C8', dx: 5, dy: -3, a: .9, blur: 1 } }); });
panel(21, 'shivaFoot({ press })  ·  shockRings()', (c, t) => { sky(c, [[0, '#060914'], [1900, '#1D2846']]);
  fillPath(c, 'M -100 1300 C 300 1270 700 1280 1180 1310 L 1180 2100 L -100 2100 Z', '#C7D3EA'); fillPath(c, 'M -100 1340 C 300 1320 700 1330 1180 1350 L 1180 2100 L -100 2100 Z', '#1A2236');
  shockRings(c, 780, 1300, t, [t - .4]);
  figure(c, (f) => { f.translate(260, 1300); f.scale(1.8, 1.8); shivaFoot(f, { t, press: 1 }); }, LIGHTS.moon); });
panel(22, 'uprooted()  ·  parvatiCling()  ·  lanka()  ·  hanumanLeap()  ·  stotram()', (c, t) => { redSky(c);
  lanka(c, 1800, t, 1); const tip = [0, 0];
  c.save(); c.translate(540, 1500); c.scale(.6, .6); const tt = hanumanLeap(c, { t }); glow(c, tt[0], tt[1], 120, '#FF8A2A', .9); c.restore();
  c.save(); c.translate(540, 200); c.scale(.6, .6); c.translate(-540, 0); uprooted(c, 540, 0, 600, t); c.restore();
  figure(c, (f) => { f.translate(500, 214); f.scale(.25, .25); shivaSeated(f, { t }); f.translate(250, 0); parvatiCling(f, { t }); }, LIGHTS.storm);
  stotram(c, ['जटाटवीगलज्जलप्रवाहपावितस्थले', 'गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्'], 540, 1000, t, t - 3); });
