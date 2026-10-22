# The 3D style

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
| `cine3d.html`, `src/scenes/cine3d_sheet.js` | the studio page on main: the shrine in its three moods ([docs/cine3d_set.jpg](docs/cine3d_set.jpg)) |

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
