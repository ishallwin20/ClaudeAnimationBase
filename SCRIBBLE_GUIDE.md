# Scribble

A character drawn in hundreds of thin, boiling hair-strokes, like coloured pencil scribbled fast, sitting sharp in
front of a "photograph" that isn't one: a landscape made in code and thrown far out of focus. The character barely
moves (breathes, sways, blinks) while its lines boil 12 times a second. It's built on **cine.js** (`src/cine.js`:
`SHOTS`, `LOOK`, `text()`, `glow()`, `sprite()`, the render hooks), so skim [CINEMATIC_GUIDE.md](CINEMATIC_GUIDE.md)
for the engine. This guide covers what Scribble adds.

- **Where it came from** (owner, 13 Nov 2026): an Instagram box-breathing reel, a scribbled tortoise breathing over a
  blurred photo of mountains ("Inhale / Hold / Exhale / Hold", 32 s). "I love this", "build a new style if needed".
  We borrow the format, never that reel's character or photo.
- **Best for:** calm loops a viewer saves and comes back to: breathe-with-me, a mantra count, a quiet darshan, a
  sleepy goodnight, a wallpaper. One character, one place, little motion. It is not for stories with action: the
  strokes are baked per part, so a character can't change pose without a new bake.
- **Reference reel:** `reel/breathe-hanuman`, "Breathe with Bal Hanuman" (32 s seamless loop, two rounds of box
  breathing, Kalam words with the Sanskrit term under them, synthesized tanpura + breath + bowls). Start a new
  Scribble reel by reading its `STORYBOARD.md` and `src/scenes/breathe.js`.
- **Files:** `src/scribble.js` (the engine; its header is the API), `src/sc_cast.js` (Bal Hanuman in four parts, the
  blurred Himalaya, the granite boulder), `scribble.html` + `src/scenes/sc_demo.js` (the demo: one 16 s breath). The
  sheet is [docs/scribble_sheet.jpg](docs/scribble_sheet.jpg). Open any Scribble page with `?design` to see the
  clean designs under the strokes.

## The look

- **The character is strokes, not fills.** Each stroke takes its colour from the design under it (with a little
  jitter, some lighter, some darker) and runs along the form: with the contour near an edge, along a flow direction
  inside. A soft blurred underpaint sits beneath so the body never looks hollow. Loose hairs fray the silhouette and a
  few dark ink loops wander round the outline. It reads as fur, wool, feathers or a woolly jumper.
- **Faces are inked, not scribbled.** Closed eyes, nostrils, a smile, a tilak, earrings go in a layer's `ink()`, drawn
  after the strokes with `scInk()` (two jittered passes) and `scDot()`. Give the face its own layer with short strokes
  (`len` ~30), low `dk`, a high `under` and a small `underBlur`, so the skin stays smooth and the features stay sharp.
- **The set is a photo out of focus.** Paint it in code (gradients, ridged noise for mountains, noise-picked snow,
  a treeline, a few bright bokeh blobs) and blur it 20–30 px. Something sharp in the foreground (the boulder: per-pixel
  granite with mica, lichen and cracks, its near edge falling out of focus) puts the character in a real place.
- **Words** (when the reel has them) are Kalam, white, with a soft dark glow, in the sky above the character, inside
  the safe band. Sanskrit under English in a smaller size.
- **Finish:** `LOOK.bloom = .1; LOOK.vignette = .28; LOOK.grain = .05`. Nothing shiny.

## How it works

- A **design** is drawn once with ordinary canvas calls (shapes, radial gradients lit from the upper left:
  `scBall()`, `limb()`). `scDesign()` reads it back and blurs its alpha into a field: the field's gradient is the
  contour's normal, so strokes near the edge turn to follow it.
- A **part** (`scPart(key, box, layers, o)`) is a sprite of one or more layers. It is baked in `SC.variants` (4)
  versions with different seeds; `part.at(t)` picks one by `SC.boil` (12/s), so the lines boil. Each variant bakes
  lazily on first use and is cached in `SC_PARTS` by key.
- A scene lays parts down with `scDraw(c, part, t, { ax, ay, sx, sy, rot, dx, dy, alpha })` around a pivot in design
  px. Split a character at its joints into parts (Bal Hanuman: `tail`, `legs`, `torso`, `head`) and move the parts:
  the breath is the torso scaled about the lap (+3 % wide, +6 % tall), the head lifted ~27 px about the neck, the tail
  turned a hair about its root. Draw them back to front.

### A layer's knobs

| key | what it does | typical |
|---|---|---|
| `draw(c)` | the clean design, in frame px | |
| `len`, `w` | stroke length and width | fur 60–86, 1.5; face 30, 1.2; small parts 18–24 |
| `dens` | strokes per area (×1/110 px²) | 1.5–1.8 |
| `flow` | the inside direction: an angle, or `(x, y) => angle` (fur growing out from the face) | `Math.PI / 2` down a body, `0` across a lap |
| `follow` | how hard edges pull strokes along the contour | .8–1.5 |
| `curl` | how much a stroke bends | .5–.6 |
| `hair` | loose hairs per edge pixel | fur .8–1, skin .2–.3 |
| `outline`, `inkCol` | dark ink loops round the edge, and their colour | 2–10 |
| `under`, `underBlur` | the underpaint's opacity and blur | .5 / 4 (fur), .85–.95 / 2 (skin, hands) |
| `jit`, `lt`, `dk` | colour jitter, share of lighter and darker strokes | .28 / .14 / .14 |
| `soft` | the field's blur (how far in the contour is felt) | 9 |
| `ink(c, rnd)` | crisp features inked after the strokes | |

## Starting a reel

1. Branch `reel/<idea>` off `main`. Copy `scribble.html` to `studio.html`, replace the inline `PROJECT` with
   `<script src="src/config.js"></script>` and swap `sc_demo.js` for your scene.
2. New characters and sets go in `src/sc_cast.js` on `main` (a design function per part, its pivots in a constant like
   `SCH`). Check the designs with `?design` first: if the design reads, the strokes will.
3. A loop: make the last frame land on the first (the breath is a 16 s cycle; the reel is two of them). Frame 0
   already shows the first word.
4. Check stills (`node render.mjs --stills=0`) at phone size: the strokes should read as fur, not noise. Too noisy:
   longer `len`, lower `dens`, more `under`. Too clean: more `hair` and `outline`.

## What worked (first reel)

- One character, centred low on a rock, eyes closed; the sky above is where the word lives.
- Motion small and slow: the breath, a whisper of sway in the holds. The boil does the rest.
- Faint light motes (prana) that gather in on the in-breath and drift out on the out-breath tie the background to
  the breath without words.
- The word rises and grows on the in-breath, waits up high, sinks and shrinks on the out-breath.
- The blurred, photo-like plate could trip Instagram's AI label (see the Cel and Painterly notes): test-post a silent
  copy before relying on it.

## Four looks (14 Nov 2026, the Bal Hanuman wallpapers)

The owner shared four Instagram Hanuman pieces (thread art on dark paper, colour scribble on black, coloured pencil on
cream paper, a dark rainy night) as style references, never as subjects. `src/sc_hanu.js` turns them into looks a layer
can take (`scLook(look, layer)`, `SCL` / `SCL_FACE`):

- **thread**: long thin strands (`len` ~104, `w` ~1), lots of loose hairs and ink loops, on `scPaperDark`, with
  `scStrays` (loose threads floating round the scene) and a beam of moonlight in threads (`scMoonbeam`).
- **color**: the default strokes with pale loops, on pure black, a glow behind the subject.
- **pencil**: short diagonal hatching (`flow` -.95, `curl` ~.2, low `under`) and the part option `tooth` (`scTooth`
  knocks the paper's grain out of the strokes); lay the parts down with `multiply` on `scPaperCream`. Sets in pencil:
  `scPencilSun`, `scPencilCloud`, `scPencilHills`.
- **fur** (the default) over a blurred plate still works for night scenes: `scRainNight` + `scRain` (seamless streaks),
  graded with a cool `multiply` and relit by a diya.

The poses (all Bal Hanuman, on the head and proportions of `scHanuman`): `scHanuGada` (asleep against his gada, ball
on top), `scHanuStone` (hugging a floating stone with राम on it, feet dangling), `scHanuLeap` (leaping at the sun, eyes
open), `scHanuLeaf` (under a banana leaf in the rain). `scBalHead({ eyes: 'open', gaze, mouth: 'open' | 'o' })` gives
him big shiny eyes and an open delighted mouth. Lessons: a gada drawn with its ball at the bottom and a thin shaft read
as a veena (put the ball on top, shaft ≥ 34 px); peepal leaves need short strokes, high `under` and a pale outline
inked round each leaf or they turn into grass; a stone wants short strokes and no hair, or it reads as a fuzzy belly.
