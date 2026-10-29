# The Painterly style

A cinemagraph that looks like a digital painting: a forest clearing full of light, a god sitting in it, painted in
visible brush strokes, with only a few things moving (a tail swaying, राम turning in rings round him, god rays and a
halo breathing, dust drifting, sparkles on his rim light, a lyric line). It is made **only in code**, with no AI
images, so Instagram does not label it as AI. It suits devotional loops set to a bhajan, quiet darshans and live
wallpapers. See [docs/painterly_sheet.jpg](docs/painterly_sheet.jpg) (the design and the painting made from it).

The first reel is `reel/hanuman-ram-loop` ("Ram hi paar lagavenge", 16.7 s, Oct 2026). The owner asked for it after an
Instagram example (a hand-painted Hanuman cinemagraph) and wanted it without AI images.

## What makes it

- **Design, then paint.** Each layer is first drawn as a DESIGN: clean canvas shapes with gradients, the way an artist
  blocks in colour. `ptLayer()` then repaints that design in curved brush strokes, coarse to fine (after Hertzmann,
  "Painterly rendering with curved brush strokes of multiple sizes", 1998). Each brush size paints only where the
  canvas still differs from the design blurred to that size. Every stroke follows the forms (along the edges, across
  the gradient) and has a few lighter and darker bristle streaks. Big flat areas get a few broad strokes; edges and
  faces get many small ones.
- **Baked once.** A painting is made the first time a frame needs it (about 3 s for a full frame plus a figure),
  seeded so every render worker paints the same picture, and cached. After that a frame costs 40–70 ms, so a 30 s reel
  renders in under a minute.
- **Cut-outs.** Figures are painted on their own layers (`alpha: true`); strokes stay inside the design's shape and the
  edge is slightly ragged. Moving parts are baked as several poses and stepped through (the tail: 12–18 poses a sway).
- **Light on top.** God rays, a halo behind the figure, rim light along the edges facing the sun (`ptRim`), sparkles
  that sit on that rim, dust motes, bloom and a little grain. These move every frame; the painting doesn't.
- **Seamless loops.** Everything that moves repeats exactly over the loop: periodic motion is `sin(n · 2π · t / DUR)`,
  and anything that drifts (dust, rays) is drawn at t and at t − DUR and crossfaded across the loop (`looped()` in the
  scenes). Instagram replays a reel, and a wallpaper loops, without a seam.

## AI label: a warning (29 Oct 2026)

The Painterly reels were not labelled as AI on Instagram. But a brush-painted anime-style snowy landscape (the Cel
style's snowfield through `ptLayer`) was. In silent, metadata-free test posts, the painted snowfield alone was
labelled, while the same scene left as its clean design was not. Meta's classifier judges the look, and a soft, dreamy
painted landscape is a common AI-image genre. Before posting a new painted set (especially sky, clouds, snow or water
filling the frame), post a short silent test to a test account. If it's labelled, render with `window.PT_RAW = 1`
(the clean design) or make the set less dreamy.

## Files

| file | what |
|---|---|
| `src/painterly.js` | the engine, over `src/cine.js`: `ptLayer`, `ptDraw`, `ptPaint`, `ptRim`, `twinkle`, `nameRing`, `PT.k`, and the design helpers |
| `src/pt_cast.js` | the cast and sets, as designs: `ptForest`, `ptHanuman`, `ptTail`, `ptGada` (constants `PT_SUN`, `PT_HX`, `PT_HY`, `PT_TAIL_BOX`, `PT_SKIN`, `PT_GOLD`) |
| `painterly.html` | the studio; on main it plays `src/scenes/pt_demo.js`, the cast as a 6 s loop |
| `docs/painterly_sheet.jpg` | the design next to its painting |

## Start a reel in this style

1. Branch off `main` (`reel/<idea>`, or `ad/<n>-<book>-<idea>` for a book ad).
2. Copy `painterly.html` to `studio.html`: load `src/config.js` instead of the inline PROJECT, and swap
   `src/scenes/pt_demo.js` for your scene. Copy `pt_demo.js` as the starting scene.
3. If the reel is set to a song, find when each line is sung: `whisper-cli -m ~/.cache/whisper/ggml-small.bin -l hi
   -f song.wav` (16 kHz mono; add `-ml 1` for word times). Set `PROJECT.duration` to the clip's length so the loop and
   the song end together.
4. Frame 0 is the finished painting with the first line already up. Check it with `node render.mjs --stills=0`, and
   check the motion with `--strip`.
5. Render with `node render.mjs --clip --fps=30 [--audio=<song>] --out=...`. Keep a copyrighted song clip out of git.
   Make a `cover.html` (studio.html plus a cover scene that hides the lyrics and puts the title inside y 240–1680).

To see the designs unpainted, open `painterly.html?design` (or set `window.PT_RAW = 1` before the scripts).

## The API

- `ptLayer(key, box, design, o)`: bakes or fetches a painted layer. `box = [x, y, w, h]` in design px; `design(c)` draws
  in design px. Options:
  - `alpha`: a cut-out.
  - `seed`: the painting's random seed.
  - `brushes`: coarse to fine, default `PT_BRUSHES` (radii 22, 11, 5.5, 2.8). For figures use `PT_BRUSHES.slice(1)`
    and for small parts `.slice(2)`.
  - `fine: [[x, y, r]]`: discs that get two more passes with tiny brushes (faces, hands).
  - `keep: [[x, y, r, a]]`: discs where the clean design shows back through at `a`, so a face stays legible
    (0.55 works).
  - `flow(x, y)`: the stroke angle in flat areas.
  - `rough`: how far a cut-out's edge wanders, in px.
- `ptDraw(c, L, alpha, op)`: lays it down.
- `ptRim(L, { dx, dy, col, blur, density })`: a rim-light canvas for a cut-out. `(dx, dy)` points toward the light in
  px; `dy: -5` lights the top edges. Lay it with `'screen'` and breathe its alpha. Its `.pts` are seats for
  `twinkle(c, x, y, r, a)`.
- `nameRing(c, cx, cy, rx, ry, a0, a1, word, o)`: a word repeated along an elliptical arc, each copy turned to the
  curve. For a loop, use `o.rot` (an angle) and `o.ph` (the shimmer's phase) rather than `t`.
- `PT.k`: paint resolution, in canvas px per design px. A reel is 1. A 1290 × 2796 wallpaper drawing the 1080-wide
  design sets `PT.k = W / 1080` and scales `c` by the same, so the painting is made at full wallpaper resolution, not
  scaled up.
- Design helpers:
  - `ptLin`, `ptRad`: gradients.
  - `ptShape(c, svgPath, fill)`.
  - `ptForm(c, points, widths, { dk, base, lt }, lx, ly)`: a rounded lit form, for arms and fingers.
  - `ptMottle(...)`: blotches of near colours over what is drawn.
  - `ptFlowers(c, points, r, cols, rnd)`: garlands.
  - `ptLock(c, points, w, rnd)`: hair.
- cine.js still does the rest: `rays`, `glow`, `motes`, `text`, `LOOK` (bloom 0.22, vignette 0.45, grain 0.045 suit
  it), `SHOTS`.

## Building a character

Draw the design in the frame's px, as you would in the Cinematic style, but think like a painter:

- **Shade every form.** Use a dark under-colour, the body shifted toward the light, and a highlight (`ptForm`), plus a
  radial gradient on big masses (torso, face).
- **Never fill one flat colour.** `ptMottle` over each material gives the brush strokes colour to pick up.
- **Grade the whole figure at the end** with `source-atop`: warm light from above and a little green bounce from the
  grass below, so it sits in the scene.
- **Keep the face clean.** Add a `fine` disc and a `keep` disc on it. Features under 4 px won't survive the paint.
- **Watch `globalAlpha`.** Restore it after every translucent shape; a stray alpha bakes into the layer. The engine
  resets its own (a bug that once made the whole figure 75% opaque).
- **Contact shadow.** Paint it into the set, under the figure.

## What worked

- The forest reads as a painting straight away. Figures need the most care: anatomy, hands and the folded legs.
- A soft dark scrim under lyric lines (a squashed `glow`) keeps Devanagari readable over garlands.
- Stepped poses (about 5–6 a second) feel hand-animated, like the example. Crossfading poses ghosts.
- The same scene makes a live wallpaper: draw it in the 1080 × 2340 design space with `PT.k = W / 1080`, and extend
  the forest upward (`ptForest(c, top)`) so the clock sits over the canopy.
