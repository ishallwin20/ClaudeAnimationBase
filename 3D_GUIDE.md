# The 3D style

> **The film look (29 Oct 2026):** the engine upgrade planned after ad 58 is on main: `src/cine3d_fx.js` (HDRI light,
> scanned materials, depth of field, HDR bloom, light shafts, a colour grade, sunbeams, motes, caustics). Use it on
> every new 3D reel (see "The film look" below); ad 61 (Shaligram) is its first reel. Still design for a striking frame:
> bright readable light, one hero subject, fewer and longer shots, places and objects over characters.

A lit 3D world rendered with three.js, under the Cinematic style's 2D layer: the camera moves through a real set
(dollies, orbits, a walker's point of view, straight-down maps), lamps light the stone, the sun casts shadows that
swing round, water runs; captions, bloom, vignette, grain and the RK card are cine.js's, as in the Cinematic style.
First used on `ad/31-books123-pradakshina` ("Why do Hindus walk around a temple CLOCKWISE?"), its reference reel.

Read [CINEMATIC_GUIDE.md](CINEMATIC_GUIDE.md) too: shots, `say()` captions, POST, `LOOK`, the card and the Voice
section all work the same way here.

## Files
| file | what |
|---|---|
| `src/vendor/three.min.js` | three.js r170 as a classic script (`window.THREE`), so `studio.html` still opens from `file://` (ES modules don't). Built with esbuild from `three` + `RoundedBoxGeometry` + `BufferGeometryUtils`; to rebuild, bundle an entry that re-exports them: `npx esbuild entry.js --bundle --format=iife --global-name=THREE --minify` |
| `src/cine3d.js` | the bridge: one WebGL renderer (shadows, ACES, sRGB) and `render3()`, the camera, meshes, procedural textures (granite, water, glow, flame, footprints), lamps, water, footprints, skies and the moods (`world3()`) |
| `src/cine3d_temple.js` | the shrine set: `shrine3(scene)` and the pradakshina path `path3(s)` |
| `src/cine3d_havan.js` | a havan: `havan3(scene, { at })`, a brick kund with white/red/black mekhalas, a particle fire (flare, dull, gold), embers, smoke, the sruva tipping ghee, gold lights rising to the sky; kalash, ghee bowl, samagri, lamps, rangoli; a tarpan plate (water and black sesame on kusha) and a dakshina plate. First used on `ad/49-books123-swaha` |
| `src/cine3d_kailash.js` | Mount Kailash and its plateau (1 unit = 100 m): `kailash3()` builds the ledged, snow-banded peak, the kora valley and the Dolma La, the lakes and far ranges, coloured per pixel by a terrain shader (`terrainMat3`); moods morning / day / golden / alpen / blue / map; `kora(s)`, `ribbon()`, `river()`, `flags()`, clouds and the summit's plume. Set `CAM3.far = 4500`. First used on `ad/41-books123-kailash` |
| `src/cine3d_india.js` | India as a relief map (1 unit = 10 km, centred on 80° E 22° N; `MAP3.xz(lon, lat)`): real heights and sea floor (`src/data/india_dem.js`), India's outline as the Survey of India draws it (`src/data/india_geo.js`, Natural Earth's India view), tinted like a satellite picture; `india3()` → `.at(lon, lat)`, `.mood(name, { focus, edge, … })` (space, day, golden, dusk, night; `focus` dims the land outside India), `.border` / `.lanka` glowing outlines. Shared helpers: `dem3(name)`, `line3(parent, pts)` (a map line of constant width, `.set(on, w, a)`), `pillar3(parent, pos, o)` (a beam of light, `.set(t, on)`), `pin3(c, txt, p, t, at, o)`. Load after `cine3d_kailash.js`, `src/vendor/pako_inflate.min.js` and the data files. First used on `ad/43-books123-jyotirlinga` |
| `src/cine3d_setu.js` | the Palk Strait (1 unit = 100 m): Rameswaram, the Dhanushkodi spit, Mannar (`src/data/palk_dem.js`), the shoals laid in between, clear water coloured by depth, impact waves, a Milky Way night; the Ramayana's bridge growing along the shoals with flying rocks and splashes, the army's torches, fire arrows, the Ocean god's light. `setu3()`; first used on `ad/42-books123-ram-setu` |
| `tools/terrain.mjs`, `tools/geo.mjs` | make the data files: real heights from open terrain tiles (registry.opendata.aws/terrain-tiles: SRTM, GEBCO, ETOPO) for any lon/lat box, and country outlines from Natural Earth (public domain). A page with both India and the strait builds for ~9 s: render with `--workers=1` (two pages building at once pass the 30 s load limit) |
| `src/cine3d_fx.js`, `tools/hdri.mjs`, `tools/pbr.mjs`, `src/data/hdri_*.js`, `src/data/pbr_*.js`, `cine3d_fx.html` | the film look (below): HDRI light, scanned materials, the post chain (DOF, bloom, shafts, grade), sunbeams, motes, caustics |
| `cine3d.html`, `src/scenes/cine3d_sheet.js` | the studio page on main: the shrine in its three moods ([docs/cine3d_set.jpg](docs/cine3d_set.jpg)) |

## The film look (src/cine3d_fx.js)
Load after `cine3d.js`, with `src/vendor/pako_inflate.min.js` and the data files a reel uses
([docs/cine3d_fx.jpg](docs/cine3d_fx.jpg): before, after, a product shot, the sea; `cine3d_fx.html` on main).
- **Light from a real sky.** `env3(scene, name, { k, rot, bg, bgK })` lights a scene with an HDRI packed by
  `node tools/hdri.mjs --id=<polyhaven id> --name=<name> [--bg=4096]` into `src/data/hdri_<name>.js` (on main: `studio`,
  `day`, `dawn` (both with a sharp sky to show behind), `lamplit`). `studioEnv3({ boxes, room, floor })` is a photo studio
  of softboxes built in code, for products. **Metal, gloss and water need one of these**: with nothing to reflect they
  go dull brown (the old `metal3` look).
- **Scanned materials.** `pbr3(name, { rep, tint, normalK, rough, metal, ao })` from `node tools/pbr.mjs --id=<ambientCG id>
  --name=<name>` → `src/data/pbr_<name>.js` (on main: `pebbles`, `sand`, `cliff`, `mountain`, `darkwood`, `redwool`).
- **The lens.** `render3(c, scene, cam, { exposure, fx })` with `fx`: `dof: { focus (m), aperture (px of blur far away),
  max, nearK }`, `bloom: { k, thresh, knee, radius }` (HDR, before tone mapping: set `LOOK.bloom` low or 0 so cine.js
  doesn't bloom twice), `rays: { at: [x, y, z] | screen: [u, v], k, thresh, decay, len, col, minZ }` (light shafts from
  the bright, far parts of the frame), `ca` (chromatic fringe, ~.002), `tone: 'neutral'` (Khronos neutral instead of ACES,
  truer product colours), `grade: { contrast, sat, temp, tint, lift, gamma, gain, shadows, highlights, split }`.
  Without `fx` a reel renders as before.
- **In the world.** `shafts3()` sunbeams (through water, a window), `motes3()` dust or plankton (they write depth, so the
  lens turns near and far ones into bokeh), `caustics3()` light dancing on a sea floor, `blob3()` a soft contact shadow.
- **Cost:** 70–300 ms a frame on the M4 (the DOF gather and the shafts are the dear parts), so a 60 s reel renders in
  2–5 minutes.

## Start a reel in this style
1. Branch off `main` as usual. `cp cine3d.html studio.html`; swap the inline `PROJECT` for `<script src="src/config.js">`
   and `cine3d_sheet.js` for your scene files.
2. Build the scene graph once, at load: `const W3 = world3(), T3 = shrine3(W3.scene);` plus the reel's own meshes.
3. Each shot sets everything that moves from `t` (camera, lights, visibility, opacity, water), then lays the 3D frame
   down; 2D on top as in the Cinematic style:
```js
SHOTS.push({ a: 4, b: 8.4, xf: .4, draw(c, u, t) {
  const ex = W3.mood('dusk');                    // sky, fill, sun, fog; returns the exposure
  T3.set(t, { lamps: 1, water: clamp(u / 2) });   // flicker the lamps, run the water
  render3(c, W3.scene, cam3({ pos: kf(u, [[0, [3.4, 1.7, .5]], [4.4, [2.2, 1.45, -.2]]], easeIO), at: [0, 1.25, -.25], fov: 42 }), { exposure: ex });
  text(c, '…', 540, 640, '50px Marcellus', '#FFE2A0');   // any cine.js 2D after it
} });
```
   Because objects persist between frames, a shot must set (or hide) every object it shares with another shot: reset
   them at the top of each shot (`reset()` in `prad.js`).

## The API (src/cine3d.js)
- **Units:** metres; y up; **north = -z, east = +x**. Clockwise seen from above is east → south → west → north.
- `render3(c, scene, cam, { exposure })` renders and blits the frame to the 2D canvas.
- `cam3({ pos, at, fov, roll, up })`: the shared camera. `fov` is vertical; on 9:16 the horizontal view is only ~56% of
  it (fov 46 is about 26° across): frame wider than feels right. A camera looking straight down gets north up.
  `toScreen3([x, y, z])` gives the screen point of a world point (pin 2D letters to the ground with it).
- `mesh3(parent, geo, mat, pos, { rot, scale, cast, receive })`, `box3`, `block3` (a box standing on its foot),
  `lathe3([[r, y], …])` (pots, lamps, the linga, the amalaka), `smooth3(points)`.
- `tex3(key, w, h, draw)` a cached canvas texture (each use a clone: `.rep(rx, ry)`); `stoneTex(o)` / `stone3(o)`
  granite with mortar joints (`col`, `rows`, `cols`, `seed`, `rep`, `speck`, `mottle`, `bumpK`); `metal3(col, rough)`.
- `glow3(parent, pos, size, col, a)` an additive sprite; `flame3(parent, pos, k, { light, power, range, shadow })` a
  flame, its halo and its point light, `.set(t, on)`.
- `stream3(parent, points, r, o)` water along a curve, `.set(t, on)` scrolls it and grows it along the curve;
  `sheet3(parent, w, l, pos, o)` a flat flowing sheet (a channel). The texture flows from the curve's start to its end.
- `foot3(parent, x, z, yaw, side, o)` a glowing footprint; `yawOf(dx, dz)` turns a heading into its yaw.
- `world3()` → `{ scene, sun, hemi, mood(name, o) }`: moods `dusk`, `day`, `night`; `o.sunAt [x, y, z]` moves the sun
  (its shadows cover ±14 m), `o.hemi`, `o.sun`, `o.exposure`.

## The shrine (src/cine3d_temple.js)
`shrine3(scene)` builds a granite Nagara shrine facing east (moulded plinth, walls with niches, a 14-course shikhara,
amalaka and brass kalasha, steps and a bell at the door), inside a black linga on its pitha under a dripping copper pot
between two standing lamps, the pitha's spout and the outer pranala to the north, the channel across the path, a paved
courtyard inside a low prakara wall lined with lamps, trees beyond. `T3.set(t, { lamps, inner, water, bell })`.
`path3(s)`: the pradakshina path (a rounded square 3.9 m out): s 0 east, .25 south, .5 west, .75 north (the channel).

## What worked (ad 31)
- **The camera as the devotee, no characters.** Our cast is 2D; a 3D reel without figures was quick and looked
  finished. POV walks, straight-down maps with gold footprints, and a sun crossing the set all explain things a flat
  picture can't.
- **Walking past something, aim at it.** A POV looking along the path never shows the shrine beside you; aim the
  camera at a corner ahead (`pov(s, { at })`) so it stays on the right of the frame.
- **Keep the sun high.** Below ~20° the courtyard wall shades everything.
- **Speed:** ~20 ms a frame on the M4 (a 54 s reel renders in under a minute), so iterate with full sheets.
- **Frame 0:** put the hook's words fully lit (`at` all -1) and its start before 0, so the caption is up at frame 0.
- **ffmpeg:** in the mix, `apad` needs `whole_dur`; a bare `apad` ran forever with `loudnorm`.

## What worked (ads 42–43)
- **Real ground for real places.** A map from actual heights reads as true at once; a pillar of light standing on a
  site, or a bridge growing along the real shoals, explains the place better than a flat map.
- **Tilt a map to stand things up on it.** Seen straight down, a pillar is a dot; at ~60° it stands, and India still reads.
- **Lines on a map are as wide as the camera is high** (`w = altitude × .005`), or they vanish as the camera climbs.
- **Captions sit lower over a map of India** (y 1385) so the country fills the frame above them.
- **Break caption lines yourself** (`|`): at 56px Cinzel a line over ~820px wraps and strands a word ("SEA,").
