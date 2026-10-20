// cine_sheet.js: the Cinematic style's reference sheet (cine.html). One panel a second, each a lit, finished frame:
//   0–9   the cast and sets: what each function draws, in the light it was made for
//   10–14 the lighting presets (LIGHTS.*) on the same Shiva, each against its own sky
//   15–22 Ravana and the Kailash story (ad 15): Ravana's poses and faces, Nandi standing, the Pushpak, Shiva's foot, the sets
//   28–31 the Bhramari story: the Devi (Bhramari, four arms, bees), Arunasura on his throne, the macro bee, the swarm
//   32–37 the sun story (ad 16): Surya and sunDisc(), Mali and Sumali (arunasura pal), the dead sun and frost, ganeshaLine(), the hero card
//   38–40 the Durgama story (ad 19): devi({ durga }) with eight arms, deviHead({ tears }), arunasura standing (ash pal)
//   41–48 the Angad story (ad 20): vanara() as Angad (stand, head, plant, strike), vanaraFoot(), Ravana seated on
//         goldThrone(), crowns off and rvCrown(), ramSil() with vanaraKneel()
//   49–61 the Jatayu story: jatayu() perched, its head's faces, spread, fallen, its talon and a feather, black
//         silhouette checks; sita() carried, kneeling, close; Ravana's chariot and mules, carrying Sita; the sword,
//         lostLeft and rvBlade(); ramKneel(); hut(), forestTree(), ramSil({ namaste }), pyre()
//   62–65 the Markandeya story (cine_yama.js): Yama on Surya's rig (standing, his head, the burning eyes, the noose
//         in flight), his buffalo and Yama riding it, markHug() clinging to the linga, markHead(), shivaKick()
//   23–27 Nandi (a zebu: hump, dewlap, black muzzle) and the Nandi story: the stone temple Nandi, rishi, boy, devotee, Nandanar, sets
// Rebuild the docs images after changing a character:
//   node render.mjs --page=cine.html --sheet=0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5 --cols=5 --w=300 --out=docs/cine_cast.jpg
//   node render.mjs --page=cine.html --sheet=10.5,11.5,12.5,13.5,14.5 --cols=5 --w=300 --out=docs/cine_lighting.jpg
//   node render.mjs --page=cine.html --sheet=15.5,16.5,17.5,18.5,19.5,20.5,21.5,22.5 --cols=4 --w=300 --out=docs/cine_cast_ravana.jpg
//   node render.mjs --page=cine.html --sheet=28.5,29.5,30.5,31.5 --cols=4 --w=300 --out=docs/cine_cast_bhramari.jpg
//   node render.mjs --page=cine.html --sheet=32.5,33.5,34.5,35.5,36.5,37.5 --cols=6 --w=300 --out=docs/cine_cast_surya.jpg
//   node render.mjs --page=cine.html --sheet=41.5,42.5,43.5,44.5,45.5,46.5,47.5,48.5 --cols=4 --w=300 --out=docs/cine_cast_angad.jpg
//   node render.mjs --page=cine.html --sheet=49.5,50.9,51.5,52.3,53.2,54.5,55.3,56.5,57.5,58.5,59.9,60.5 --cols=6 --w=300 --out=docs/cine_cast_jatayu.jpg
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

// ---------- Nandi (redrawn as a zebu) and the Nandi story (reel/nandi-whisper) ----------
//   node render.mjs --page=cine.html --sheet=23.5,24.5,25.5,26.5,27.5 --cols=5 --w=300 --out=docs/cine_cast_nandi.jpg
const templeSky = (c) => { sky(c, [[0, '#0E0806'], [1900, '#2A1610']]); glow(c, 250, 1200, 700, '#FF9A40', .5); };
panel(23, 'nandiStanding()  ·  col: a bull, not a goat', (c, t) => { dawnSky(c); fillPath(c, 'M -100 1640 C 200 1600 500 1590 700 1600 C 900 1610 1100 1640 1180 1660 L 1180 2100 L -100 2100 Z', '#24121E');
  figure(c, (f) => { f.translate(560, 900); f.scale(.8, .8); nandiStanding(f, { t, col: '#140C12' }); }, { edge: { col: '#FFD9A0', w: 2, a: .7 } });
  figure(c, (f) => { f.translate(560, 1620); f.scale(1.15, 1.15); nandiStanding(f, { t }); }, { tint: ['#3A1830', .15], edge: { col: '#FFD9A0', w: 2.2, a: .7 }, rim: { col: '#FFF0C8', dx: 5, dy: -3, a: .9, blur: 1 } }); });
panel(24, 'nandiLying({ stone, ear })  ·  sanctum()  ·  deepa()', (c, t) => { templeSky(c); fillPath(c, 'M -100 1400 L 1180 1400 L 1180 2100 L -100 2100 Z', '#1A0E0A'); sanctum(c, 170, 1440, .9, t, { open: .6 });
  figure(c, (f) => { f.translate(760, 1400); f.scale(1.2, 1.2); nandiLying(f, { t, stone: true, ear: .6 }); }, { edge: { col: '#FFB070', w: 2.2, a: .5 }, rim: { col: '#FFD08A', dx: -6, dy: -3, a: .85, blur: 1 } });
  figure(c, (f) => { f.translate(560, 920); f.scale(.7, .7); nandiLying(f, { t }); }, { edge: { col: '#FFD9A0', w: 2, a: .7 } }); });
panel(25, "rishi({ pose })  ·  plough()  ·  boy({ pose })", (c, t) => { dawnSky(c); fillPath(c, 'M -100 1500 L 1180 1500 L 1180 2100 L -100 2100 Z', '#1C111B');
  figure(c, (f) => { f.translate(140, 1000); f.scale(.55, .55); rishi(f, { t }); f.setTransform(c.getTransform()); f.translate(400, 1000); f.scale(.55, .55); rishi(f, { t, pose: 'sit' });
    f.setTransform(c.getTransform()); f.translate(470, 1000); f.scale(.55, .55); plough(f); f.setTransform(c.getTransform()); f.translate(800, 1000); f.scale(.55, .55); rishi(f, { t, pose: 'plough' });
    f.setTransform(c.getTransform()); f.translate(200, 1500); boy(f, { t, pose: 'baby' }); f.setTransform(c.getTransform()); f.translate(540, 1500); boy(f, { t, pose: 'sit' }); f.setTransform(c.getTransform()); f.translate(840, 1500); boy(f, { t }); }, { ...LIGHTS.dawnBack, tint: ['#1A0C14', .85] }); });
panel(26, "devotee({ pose })  ·  nandanar({ raise })", (c, t) => { dawnSky(c); fillPath(c, 'M -100 1500 L 1180 1500 L 1180 2100 L -100 2100 Z', '#1C111B');
  figure(c, (f) => { f.translate(240, 1500); f.scale(.9, .9); devotee(f, { t }); f.setTransform(c.getTransform()); f.translate(560, 1500); f.scale(.9, .9); devotee(f, { t, pose: 'pray' }); f.setTransform(c.getTransform()); f.translate(880, 1500); f.scale(.9, .9); nandanar(f, { t }); }, { ...LIGHTS.dawnBack, tint: ['#1A0C14', .85] }); });
panel(27, 'gopuram()  ·  furrows()  ·  river()  ·  linga()', (c, t) => { sky(c, [[0, '#0E0A1E'], [700, '#2A1838'], [1100, '#6A3048']]); river(c, 1100, 160, t, 540); gopuram(c, 380, 1500, .8, { door: .8 }); furrows(c, 1500, t); linga(c, 820, 1460, .9, { glow: .6 }); });

// ---------- the Bhramari story ----------
const violetSky = (c) => { sky(c, [[0, '#08040F'], [700, '#1A0C2A'], [1300, '#3A1A48'], [1900, '#2A1230']]); glow(c, 540, 700, 700, '#C08AFF', .18); };
panel(28, 'devi(): Bhramari, four arms, bees', (c, t) => { violetSky(c); glow(c, 540, 1000, 600, '#FFC860', .2);
  figure(c, (f) => { f.translate(540, 1830); f.scale(1.35, 1.35); devi(f, { t, bees: 1, wind: .5 }); }, { tint: ['#1A0A28', .12], edge: { col: '#FFD9A0', w: 2.4, a: .7 }, rim: { col: '#FFE6B0', dx: 6, dy: -3, a: .8, blur: 1 } }); });
panel(29, 'deviHead({ fire })', (c, t) => { sky(c, [[0, '#0A0512'], [1900, '#24102E']]);
  figure(c, (f) => { f.translate(540, 900); f.scale(6.2, 6.2); f.translate(0, 815); deviHead(f, { t, eyes: 1, fire: .6 }); }, { tint: ['#1A0A28', .1], edge: { col: '#FFD9A0', w: 3, a: .35 }, rim: { col: '#FFE6B0', dx: 9, dy: -4, a: .7, blur: 1.5 } }); });
panel(30, "arunasura() on throne()  ·  expr: 'laugh'", (c, t) => { redSky(c); ridge(c, 1700, 80, 31, '#12050A');
  figure(c, (f) => { f.translate(540, 1720); f.scale(1.1, 1.1); throne(f, { layer: 'back' }); arunasura(f, { t, expr: 'laugh', lean: -.06 }); throne(f, { layer: 'front' }); }, { tint: ['#2A0A10', .2], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } }); });
panel(31, 'bee({ lit })  ·  swarm()  ·  lotusLight()', (c, t) => { sky(c, [[0, '#0A0610'], [1900, '#1E1218']]); lotusLight(c, 820, 420, 110, t, .9);
  swarm(c, t, { mode: 'stream', n: 900, path: [[-100, 1500], [300, 1300], [700, 1450], [1200, 1200]], spread: [40, 200], k: .7, seed: 3, speed: .25 });
  bee(c, 540, 900, { k: 1.3, t, lit: Math.min(6, Math.floor(t * 2)), wings: 0, rot: -.2 }); });

// ---------- the sun story (ad 16) ----------
const MALI = { skin: '#3E5A7A', skinSh: '#2A4060', skinDk: '#16243A', dhoti: '#5A1A1A', dhotiSh: '#2E0C0C' };
panel(32, 'surya()  ·  sunDisc()', (c, t) => { sky(c, [[0, '#3A0E08'], [900, '#C2481A'], [1900, '#FFB050']]); sunDisc(c, 540, 860, 330, t);
  figure(c, (f) => { f.translate(540, 1900); f.scale(1.45, 1.45); surya(f, { t }); }, { tint: ['#3A1206', .12], edge: { col: '#FFF0C0', w: 2.4, a: .8 }, rim: { col: '#FFF6D8', dx: 0, dy: -6, a: .9, blur: 1 } }); });
panel(33, 'suryaHead({ eyes })', (c, t) => { sky(c, [[0, '#2A0A06'], [1900, '#8A2E10']]); sunDisc(c, 540, 820, 600, t, { life: .6 });
  figure(c, (f) => { f.translate(540, 940); f.scale(6.2, 6.2); f.translate(0, 815); suryaHead(f, { t, eyes: .5 + .5 * Math.sin(t * 2) }); }, { tint: ['#3A1206', .1], edge: { col: '#FFF0C0', w: 3, a: .4 }, rim: { col: '#FFF6D8', dx: 0, dy: -9, a: .8, blur: 1.5 } }); });
panel(34, "arunasura({ pal }): Mali and Sumali in tapas", (c, t) => { templeSky(c); fillPath(c, 'M -100 1500 L 1180 1500 L 1180 2100 L -100 2100 Z', '#1A0E0A'); linga(c, 540, 1530, .8, { glow: .7 });
  for (const [x, pal] of [[250, MALI], [830, null]]) figure(c, (f) => { f.translate(x, 1560); f.scale(.62, .62); arunasura(f, { t, pose: 'tapas', arms: 'namaste', expr: 'chant', pal }); }, LIGHTS.fire); });
panel(35, 'sunDisc({ life: 0 })  ·  frost()  ·  trishulProp()', (c, t) => { sky(c, [[0, '#04060C'], [1100, '#121C2E'], [1900, '#2A3448']]); sunDisc(c, 540, 640, 200, t, { life: 0 });
  fillPath(c, 'M -100 1300 C 300 1270 700 1280 1180 1310 L 1180 2100 L -100 2100 Z', '#1A2234'); frost(c, 1300, .5 + .5 * Math.sin(t), t);
  trishulProp(c, 820, 1000, .45, .6, { glow: 1 }); });
panel(36, 'ganeshaLine()', (c, t) => { sky(c, [[0, '#050302'], [1900, '#140A04']]); ganeshaLine(c, 540, 860, .9, Math.min(1, (t - 2) * 2), { fill: .6 }); });
panel(37, 'rkCardCine({ hero })', (c, t) => { c.save(); rkCardCine(c, 3, t, { hero: 'book4', badge: 'NEW · 16 OCT', title: 'FIND OUT IN BOOK 4', price: 'Book 4 · ₹200 · ships 16 Oct', note: 'Books 1–3 out now: set of 3 for ₹500', books: ['book1', 'book2', 'book3'] }); c.restore(); });
// ---------- the Durgama story (ad 19): Durga with eight arms, Shatakshi's tears, a demon standing ----------
const ASH = { skin: '#4A4246', skinSh: '#322C30', skinDk: '#1C181B', eye: '#FF5A2A', eyeHot: '#FFD0A0', dhoti: '#5A1418', dhotiSh: '#320A0E', helm: '#141014' };
panel(38, 'devi({ durga }): eight arms, the gods\' gifts', (c, t) => { redSky(c); glow(c, 540, 1000, 700, '#FFC860', .25);
  figure(c, (f) => { f.translate(540, 1800); f.scale(1.15, 1.15); devi(f, { t, durga: true, upper: 'open', wind: .6, fire: .7 }); }, { tint: ['#2A0A10', .12], edge: { col: '#FFD9A0', w: 2.4, a: .7 }, rim: { col: '#FFE6B0', dx: 6, dy: -3, a: .8, blur: 1 } }); });
panel(39, 'deviHead({ tears })', (c, t) => { sky(c, [[0, '#060A18'], [1900, '#18233E']]);
  figure(c, (f) => { f.translate(540, 900); f.scale(6.2, 6.2); f.translate(0, 815); deviHead(f, { t, eyes: .8, tears: 1, look: [0, .6] }); }, { tint: ['#0E1A3A', .18], edge: { col: '#CFE0FF', w: 3, a: .3 }, rim: { col: '#E4EEFF', dx: 9, dy: -4, a: .7, blur: 1.5 } }); });
panel(40, "arunasura({ pose: 'stand', arms: 'roar', pal })", (c, t) => { redSky(c); ridge(c, 1760, 80, 33, '#12050A');
  figure(c, (f) => { f.translate(540, 1800); f.scale(1.15, 1.15); arunasura(f, { t, pose: 'stand', arms: 'roar', expr: 'scream', pal: ASH }); }, { tint: ['#2A0A10', .15], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } }); });
// ---------- the Angad story (ad 20): Angad, Vali's son, in Ravana's court ----------
const courtLight = { tint: ['#1A0806', .22], edge: { col: '#FFB070', w: 2.4, a: .7 }, rim: { col: '#FFD08A', dx: 6, dy: -3, a: .85, blur: 1 } };
panel(41, "vanara(): Angad  ·  expr: 'calm'", (c, t) => { fireSky(c); pillars(c, 520, 1500, 540, '#120806', t);
  figure(c, (f) => { f.translate(540, 1800); f.scale(1.25, 1.25); vanara(f, { t }); }, courtLight); });
panel(42, "vanaraHead({ expr: 'smirk' })", (c, t) => { sky(c, [[0, '#0A0507'], [1900, '#3A1A12']]);
  figure(c, (f) => { f.translate(540, 900); f.scale(6.4, 6.4); f.translate(0, 815); vanaraHead(f, { t, expr: ['calm', 'smirk', 'fierce', 'laugh', 'tears'][Math.floor(t * 2) % 5] }); }, { tint: ['#1A0806', .12], edge: { col: '#FFB070', w: 3, a: .35 }, rim: { col: '#FFD08A', dx: 9, dy: -4, a: .75, blur: 1.5 } }); });
panel(43, "vanara({ pose: 'plant' })  ·  arms 'fold'", (c, t) => { fireSky(c); pillars(c, 520, 1500, 540, '#120806', t);
  figure(c, (f) => { f.translate(540, 1800); f.scale(1.25, 1.25); vanara(f, { t, pose: 'plant', expr: 'smirk' }); }, courtLight); });
panel(44, "vanara({ pose: 'strike' })", (c, t) => { fireSky(c); cracks(c, 540, 1790, 1, t, 4);
  figure(c, (f) => { f.translate(540, 1800); f.scale(1.25, 1.25); vanara(f, { t, pose: 'strike', expr: 'fierce' }); }, courtLight); });
panel(45, 'vanaraFoot({ press })', (c, t) => { fireSky(c); fillPath(c, 'M -100 1400 L 1180 1400 L 1180 2100 L -100 2100 Z', '#1A0C08');
  figure(c, (f) => { f.translate(430, 1400); f.scale(1.6, 1.6); vanaraFoot(f, { t, press: .5 + .5 * Math.sin(t * 3) }); }, { tint: ['#1A0806', .15], edge: { col: '#FFB070', w: 2.6, a: .6 }, rim: { col: '#FFD08A', dx: 8, dy: -4, a: .8, blur: 1 } }); });
panel(46, "ravana({ pose: 'sit' }) on goldThrone()", (c, t) => { fireSky(c); pillars(c, 420, 1500, 540, '#120806', t);
  figure(c, (f) => { f.translate(540, 1780); f.scale(.95, .95); goldThrone(f, { layer: 'back' }); ravana(f, { t, pose: 'sit', expr: 'laugh' }); goldThrone(f, { layer: 'front' }); }, courtLight); });
panel(47, "ravana({ crowns: false, front: 'grab' })  ·  rvCrown()", (c, t) => { fireSky(c);
  figure(c, (f) => { f.translate(540, 1800); f.scale(1.0, 1.0); ravana(f, { t, pose: 'bow', front: 'grab', expr: 'grit', crowns: [1, 1, 0, 1, 0, 0, 1, 0, 1, 1] }); }, courtLight);
  figure(c, (f) => { for (const [x, y, r, k] of [[250, 600, -.5, 'crown'], [800, 520, .4, 'mukut']]) { f.save(); f.translate(x, y); f.rotate(r); f.scale(1.3, 1.3); rvCrown(f, { kind: k }); f.restore(); } }, courtLight); });
panel(48, 'ramSil({ bless })  ·  vanaraKneel()', (c, t) => { dawnSky(c); fillPath(c, 'M -100 1560 L 1180 1560 L 1180 2100 L -100 2100 Z', '#1C111B');
  figure(c, (f) => { f.translate(800, 1560); f.scale(.95, .95); ramSil(f, { t, bless: 1 }); f.setTransform(c.getTransform()); f.translate(260, 1560); f.scale(.9, .9); vanaraKneel(f, { t, bow: .5 + .5 * Math.sin(t * 2) }); }, { ...LIGHTS.dawnBack, tint: ['#1A0C14', .85] }); });
// ---------- the Jatayu story: the king of eagles fights Ravana for Sita ----------
const duskSky = (c) => { sky(c, [[0, '#140A1E'], [700, '#3A1A36'], [1300, '#9A3A2E'], [1700, '#E07A3A']]); glow(c, 700, 1450, 700, '#FF9A4A', .4); };
const birdLight = { tint: ['#1A0A10', .12], edge: { col: '#FFC890', w: 2.4, a: .6 }, rim: { col: '#FFE0B0', dx: 6, dy: -3, a: .85, blur: 1 } };
panel(49, "jatayu({ pose: 'perch' })", (c, t) => { duskSky(c);
  strokePath(c, 'M -40 1350 C 300 1330 700 1360 1120 1300', '#140A0C', 34);
  figure(c, (f) => { f.translate(500, 1340); f.scale(1.25, 1.25); jatayu(f, { t, pose: 'perch', tuck: Math.max(0, Math.sin(t)), eyes: Math.sin(t) > .3 ? 0 : 1 }); }, birdLight); });
panel(50, "jatayuHead({ expr })", (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(420, 860); f.scale(3.4, 3.4); jatayuHead(f, { t, expr: ['calm', 'fierce', 'pain'][Math.floor(t * 1.5) % 3] }); }, { ...birdLight, rim: { ...birdLight.rim, dx: 9, dy: -4, blur: 1.5 } }); });
panel(51, "jatayu({ pose: 'spread', flap })", (c, t) => { redSky(c); ellipse(c, 540, 1300, 300, 300, '#FFB060');
  figure(c, (f) => { f.translate(540, 960); f.scale(.62, .62); jatayu(f, { t, pose: 'spread', flap: .5 + .5 * Math.sin(t * 2), strike: .5 + .5 * Math.sin(t * 1.3), expr: 'fierce' }); }, birdLight); });
panel(52, "jatayu({ pose: 'fallen', wings: 'stumps' })", (c, t) => { nightSky(c); fillPath(c, 'M -100 1300 L 1180 1300 L 1180 2100 L -100 2100 Z', '#0E1220');
  figure(c, (f) => { f.translate(420, 1300); f.scale(.95, .95); jatayu(f, { t, pose: 'fallen', wings: Math.sin(t) > 0 ? 'stumps' : true, breath: 1 }); }, LIGHTS.moon); });
panel(53, 'jatayuTalon({ grip })  ·  feather()', (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(500, 1100); f.scale(1.3, 1.3); jatayuTalon(f, { t, grip: .5 + .5 * Math.sin(t * 2) }); }, birdLight);
  feather(c, 860, 600, 1.2, .5 + Math.sin(t) * .3); });
panel(54, 'silhouette check (col)', (c, t) => { sky(c, [[0, '#E8E0D0'], [1900, '#C8C0B0']]);
  c.save(); c.translate(540, 700); c.scale(.4, .4); jatayu(c, { t, pose: 'spread', col: '#000' }); c.restore();
  c.save(); c.translate(300, 1500); c.scale(.6, .6); jatayu(c, { t, pose: 'perch', col: '#000' }); c.restore();
  c.save(); c.translate(700, 1560); c.scale(.4, .4); jatayu(c, { t, pose: 'fallen', col: '#000', wings: true }); c.restore(); });
const sitaLight = { tint: ['#2A0A10', .1], edge: { col: '#FFC890', w: 2.4, a: .6 }, rim: { col: '#FFE0B0', dx: 6, dy: -3, a: .8, blur: 1 } };
panel(55, "sita({ pose: 'carried', reach })", (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(600, 1800); f.scale(1.25, 1.25); sita(f, { t, pose: 'carried', reach: .5 + .5 * Math.sin(t * 2), lean: -.1, wind: .8, tears: .6 }); }, sitaLight); });
panel(56, "sita({ pose: 'kneel', tears })", (c, t) => { sky(c, [[0, '#060A18'], [1900, '#18233E']]); fillPath(c, 'M -100 1640 L 1180 1640 L 1180 2100 L -100 2100 Z', '#0E1220');
  figure(c, (f) => { f.translate(440, 1640); f.scale(1.25, 1.25); sita(f, { t, pose: 'kneel', tears: 1 }); }, LIGHTS.moon); });
panel(57, "sita() close  ·  silhouette", (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(540, 900); f.scale(4.2, 4.2); f.translate(0, 815); sita(f, { t, pose: 'carried', reach: 1, wind: .6, tears: .5, look: [-1, 0] }); }, { ...sitaLight, rim: { ...sitaLight.rim, dx: 9, blur: 1.5 } });
  c.save(); c.translate(860, 1700); c.scale(.4, .4); sita(c, { t, pose: 'carried', col: '#000' }); c.restore(); });
const stormLight = { tint: ['#2A0A10', .18], edge: { col: '#FF9A6A', w: 2.4, a: .7 }, rim: { col: '#FFB08A', dx: 0, dy: -5, a: .8, blur: 1 } };
panel(58, "ravanaChariot()  ·  rvMule()  ·  ravana({ frontR: 'carry' })  ·  sita()", (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(330, 1250); f.scale(.42, .42);
    for (const dx of [1250, 1080]) { f.save(); f.translate(dx, -60 + (dx - 1080) * .2); f.scale(.95, .95); rvMule(f, { t: t + dx }); f.restore(); }
    ravanaChariot(f, { t, layer: 'back', driver: true, glow: 1 });
    f.save(); f.translate(-40, -40); f.scale(.82, .82); ravana(f, { t, frontR: 'carry', frontL: 'bow', expr: 'laugh' });
    f.save(); f.translate(330, 20); f.scale(.85, .85); sita(f, { t, pose: 'carried', reach: 1, wind: .8 }); f.restore();
    rvCarryArm(f, { t, hold: [300, -470] }); f.restore();
    ravanaChariot(f, { t, layer: 'front' }); }, stormLight); });
panel(59, "ravana({ frontL: 'sword', swing, lostLeft })  ·  rvBlade()", (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(440, 1800); f.scale(.9, .9); ravana(f, { t, frontL: 'sword', swing: .5 + .5 * Math.sin(t * 2), lostLeft: clamp((t - 2) * 1.25), expr: 'grit' }); }, stormLight);
  figure(c, (f) => { f.translate(900, 1500); f.rotate(.15); f.scale(.9, .9); rvBlade(f, { glint: frac(t * .6) }); }, stormLight); });
panel(60, "ramKneel() with jatayu({ pose: 'fallen' })  ·  ramSil({ namaste })  ·  pyre()", (c, t) => { nightSky(c); fillPath(c, 'M -100 1500 L 1180 1500 L 1180 2100 L -100 2100 Z', '#0A0C16');
  figure(c, (f) => { f.translate(160, 1500); f.scale(.55, .55); jatayu(f, { t, pose: 'fallen', wings: 'stumps', eyes: .3 }); }, LIGHTS.moon);
  figure(c, (f) => { f.translate(660, 1500); f.scale(.8, .8); ramKneel(f, { t, hold: [-300, -110] }); }, LIGHTS.moonSilhouette); });
panel(61, "hut()  ·  forestTree()  ·  ramSil({ namaste })  ·  pyre()", (c, t) => { duskSky(c); fillPath(c, 'M -100 1560 L 1180 1560 L 1180 2100 L -100 2100 Z', '#140A10');
  forestTree(c, 300, 1560, .7, { t }); hut(c, 760, 1560, .7, { t });
  pyre(c, 300, 1800, 380, t, 1);
  figure(c, (f) => { f.translate(760, 1900); f.scale(.6, .6); ramSil(f, { t, namaste: 1 }); }, LIGHTS.fire); });
// ---------- the Markandeya story (cine_yama.js) ----------
//   node render.mjs --page=cine.html --sheet=62.5,63.5,64.5,65.5 --cols=4 --w=300 --out=docs/cine_cast_yama.jpg
panel(62, 'yamaC()  ·  yamaHeadC()  ·  yamaEyeGlow()  ·  yamaRope()', (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(300, 1500); f.scale(1.1, 1.1); yamaC(f, { t, eyes: .8 }); }, { ...LIGHTS.fire, tint: ['#3A0A10', .2] });
  figure(c, (f) => { f.translate(800, 620); f.scale(3, 3); f.translate(0, 815); yamaHeadC(f, { t, eyes: .75, mouth: .5 }); }, { ...LIGHTS.fire, tint: ['#3A0A10', .12], rim: { ...LIGHTS.fire.rim, dx: 8 } });
  c.save(); c.translate(800, 620); c.scale(3, 3); c.translate(0, 815); yamaEyeGlow(c, .8); c.restore();
  yamaRope(c, [[560, 1100], [800, 960], [980, 1180]], 1, { r: 80 }); });
panel(63, 'buffaloSide()  ·  yamaRider()', (c, t) => { redSky(c); ridge(c, 1500, 40, 3, '#12040A');
  figure(c, (f) => { f.translate(520, 1500); f.scale(1.05, 1.05); yamaRider(f, { t, walk: t * .6, eye: 1 }); }, { ...LIGHTS.fire, tint: ['#2A0A10', .25] });
  figure(c, (f) => { f.translate(560, 900); f.scale(.6, .6); yamaRider(f, { t, walk: t * .6, eye: 1, col: '#0C060A' }); }, LIGHTS.storm); });
panel(64, 'markHug()  ·  markHead()', (c, t) => { fireSky(c);
  figure(c, (f) => { f.translate(560, 1560); f.scale(1.5, 1.5); markHug(f, { t, eyes: 0 }); }, LIGHTS.fire);
  figure(c, (f) => { f.translate(860, 560); f.scale(2.2, 2.2); f.translate(0, 815); markHead(f, { t, eyes: 1, smile: 1 }); }, LIGHTS.fire);
  figure(c, (f) => { f.translate(230, 900); f.scale(.6, .6); markHug(f, { t, col: '#120C10' }); }, LIGHTS.dawnBack); });
panel(65, 'shivaKick()', (c, t) => { redSky(c);
  figure(c, (f) => { f.translate(380, 1500); f.scale(1.1, 1.1); shivaKick(f, { t, k: 1 }); }, LIGHTS.storm);
  figure(c, (f) => { f.translate(380, 800); f.scale(.4, .4); shivaKick(f, { t, k: .3 }); }, LIGHTS.storm); });
