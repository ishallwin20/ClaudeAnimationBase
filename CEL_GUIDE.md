# The Cel style

A cel-animated chibi character dancing to a song: flat fills with a cel shade and a lit band, a navy ink line that
varies in weight and boils, drawn fresh every frame but held on threes (10 drawings a second at 30 fps), posed pose to
pose by a rig with two-bone IK and timed to the beat. The set behind is a Painterly design, left unpainted. Made only in
code, no AI images. See [docs/cel_sheet.jpg](docs/cel_sheet.jpg) (`cel.html`: the calm tandav, then the Rudra tandav).

The owner asked for it after an Instagram example (StudioLKY's chibi Shiva dancing on snow). The first reels are
`reel/shiva-tandav-cel` (Oct 2026): "Shiv Tandav" (calm, on the snowfield) and "Rudra Tandav" (the fierce version in
a storm), both on the example's Shiv Tandav clip at 150 BPM.

## What makes it

- **Held on threes.** `celDance` snaps time to the drawing it falls in (`celHold`), so the character changes 10 times a
  second, like hand-drawn animation. Effects (snow, lightning, embers) run at the full frame rate on top.
- **Pose to pose, on the beat.** A dance is a list of key poses; one lands every `every` beats (`PROJECT.bpm`,
  `offset`). Each move takes `tr` seconds, arrives on the beat with an overshoot (`backOut`), and the character dips
  and squashes on the beats between. Hair swings a drawing late (`P.lag`).
- **Ink that boils.** Every outline wobbles by low-frequency noise along its length, re-rolled each drawing, and is
  stroked in short segments of varying weight. Each part keeps its seed, so a held drawing doesn't shimmer.
- **Cel shading.** `celShape` fills a shape, lays a shade band on the side away from the light and a lit band on the
  side toward it (both offsets of the shape itself, clipped inside it), then inks it. `figure()` (cine.js) adds the rim
  light and the grade on the whole character.
- **The set is a design.** Draw it with gradients and shapes (`celSnowfield`, `celStormfield`) and bake it with
  `ptLayer`. Keep `window.PT_RAW = 1` in the page so it is NOT repainted in brush strokes (below).

## AI label (tested 29 Oct 2026)

Instagram labelled "Shiv Tandav" as AI content although nothing in it was AI-made and the file carried no metadata.
Silent 8 s test posts isolated it. The painted snowfield on its own was labelled. The same reel with the snowfield left
as its clean design, and the character on a flat background, were not labelled. So a brush-painted, dreamy anime
landscape reads as AI to Meta's classifier; the cel character, ink and effects don't. (The Painterly reels themselves
were not labelled.) Keep Cel sets unpainted (`PT_RAW`), and post a test before using a painted landscape. Don't mux
audio cut from someone else's reel either: if it's an AI remix, its watermark comes along.

## Files

| file | what |
|---|---|
| `src/cel.js` | the engine, over `src/cine.js` (and `src/painterly.js` for sets): `celShape`, `celEll`/`celOval`, `celTube`, `celLine`, `celBand`, `celIK`, `celDance`, `celMirror`, `celHold`, `CEL` |
| `src/cel_cast.js` | `celShiva` and `CEL_SHIVA_POSES` (`CEL_SHIVA_DANCE`: eight of them); sets `celSnowfield`, `celStormfield`, `celCloudBank`; effects `celDamaru`, `celTrishulGlow`, `celChakra`, `celFlameRing`, `celCracks` |
| `cel.html` | the studio; on main it plays `src/scenes/cel_demo.js` (8 s: calm, then Rudra) |
| `docs/cel_sheet.jpg` | the reference sheet |

## Start a reel in this style

1. Branch off `main` (`reel/<idea>`, or `ad/<n>-<book>-<idea>`).
2. Copy `cel.html` to `studio.html`: load `src/config.js` instead of the inline PROJECT and swap in your scene (copy
   `cel_demo.js` to start). Keep `window.PT_RAW = 1`.
3. Find the song's tempo and first beat: an onset envelope and autocorrelation, then check the strong onsets sit on the
   grid (the Tandav clip: 150 BPM, beat 0.400 s from t = 0). Set `PROJECT.bpm`, `offset` and `duration`. If the
   example's dancer changes pose every two beats, use `every: 2`.
4. Write the dance as key poses from `CEL_SHIVA_POSES` (and `celMirror` of them); put the stomps and big poses on the
   song's strong hits, and end on a pose that leads back into frame 0 for a seamless loop.
5. Frame 0 is a finished picture with the title or hook up. Check with `node render.mjs --stills=0` and the motion with
   `--strip`. Render with `node render.mjs --clip --fps=30 [--audio=...]`. Make a `cover.html` too.

## The API

- `celShape(c, P, fill, o)`: a closed shape through control points `P` (smoothed), or a dense outline with
  `o.dense`. Options:
  - `shade: [col, dx, dy]`: a shade band on the (dx, dy) side
  - `lt: [col, dx, dy]`: a lit band on the other side
  - `w`: ink width
  - `ink: false`: no ink
  - `boil`: how much it wobbles
  - `over(c)`: draws inside it, clipped (gradients, highlights)
- `celOval(c, x, y, rx, ry, fill, o)`; `celTube(P, widths)`: a tapered tube outline along P (limbs, snakes, locks);
  `celLine(c, P, w, o)`: an open tapered ink line (`o.under`: a colour inside it, for ash or a thread);
  `celBand(c, a, b, f, w, th, col)`: an arm band or anklet across a tube.
- `celIK(A, T, l1, l2, pref)`: [joint, end] from root A toward target T, the joint bent toward `pref`.
- `celDance(t, keys, { bpm, offset, every, tr, over })`: the pose at t. It also returns:
  - `.land`: seconds since the last landing
  - `.beatLand`: seconds since the last beat
  - `.lag`: the pose a drawing late
  - `.prev`, `.next`: the poses on either side
  - `.slot`: which key pose this is
  - `.td`: the held time

  Number fields of a pose are mixed, so you can add your own (the Rudra reel adds `eye`).
- `celShiva(c, x, y, s, P, o)`: chibi Shiva, about 1040 px tall at s = 1, feet at (x, y). It returns screen anchors
  `{ bun, feet, eye3 }`. Options:
  - `pal`: colours
  - `fierce`: the Rudra face (no blush, brows down, eyes shut tight, grim; a pose with `mouth: 'o'` roars)
  - `eye3` (0..1): the third eye opens
  - `locks`: the number of jata flying out
- A pose:
  - `hip`, `lean`, `head`
  - hands `hL`/`hR` (in the upper body's frame), elbows `eL`/`eR`
  - feet `fL`/`fR` (on the ground, y 0, or lifted), knees `kL`/`kR`
  - `front` ('L'/'R': a leg crossing in front, drawn over the dhoti with the cloth wrapped round its thigh)
  - `handL`/`handR` ('open', 'fist', 'damaru'), `mouth`
  - `squash`: negative stretches, as in a jump
  - `stomp`: the scene shakes and cracks

  "L" is screen left (his right).
- Effects:
  - `celTrishulGlow(c, x, y0, y1, a, col)`
  - `celChakra(c, x, y, u)`: rings bursting out as u goes 0 → 1
  - `celFlameRing(c, x, y, r, td, a, flare)`: the Nataraja's ring of fire
  - `celCracks(c, x, y, seed, a)`: fire in the ground
  - `celDamaru`
  - from cine.js: `bolt`, `strikes`, `flash`, `glow`, `motes`

## Building a character

Build it like `celShiva`: an IK rig of tubes and shapes, drawn back to front:
1. the hair behind (lagging)
2. the back leg
3. the dhoti
4. the front leg
5. the torso
6. the head
7. the snake
8. the arms

Keep the head huge (chibi) and the limbs short and thick. Give every part its own `celShape` so it gets its own ink
line. Draw the features with `celLine` and keep them simple. Faces read at reel size, but under about 4 px a line is lost.

## What worked

- Changing pose every two beats with a bounce on the beat between kept him always moving, like the example; one pose
  every beat at 150 BPM would be frantic.
- Raised hands are lost against the big head (short chibi arms): send them out to the sides.
- A leg that crosses in front has to be drawn over the dhoti (`front`), or it reads as behind his body (owner).
- The fierce version: no blush, the third eye opening on the stomps, lightning on the strong hits, a ring of fire, and
  every lean × 1.4 made the same dance read as intense. Keep the lightning flashes subtle (`flash` ≈ 0.2) or the
  frame goes milky.
