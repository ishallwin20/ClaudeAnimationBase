# Fable

A wordless moral story in a black 9:16 frame. A bold two-line headline states the moral, with one word in yellow
("This Is Why You Don't Need / To **Reply** To Everyone"). Below it, in a band across the middle of the screen,
animals act out a fable with no captions and no voice. They think in grey thought bubbles that hold pencil doodles,
and the punchline makes the headline true. It's built on the **Painted** engine (`src/core.js` + p5.brush), so read
[ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) first. Its animation principles, timing rules (rule 4), `boilSeed`
discipline and review loop all apply. This guide covers what Fable adds.

- **Where it came from** (owner, 1 Nov 2026): a viral reposted short, a wordless film about wildebeest arguing whether
  a shape in the water is a log or a crocodile, with a moral headline over a black frame. We borrow the format,
  never that film's story.
- **Best for:** moral fables the page can own, such as the Panchatantra, the Hitopadesha, the Jatakas and moral
  moments from the puranas. They run 25–40 s and loop well, and with no words there's no caption read time to fit.
- **Reference reel:** `reel/tortoise-geese`, "The tortoise who couldn't keep quiet" (Panchatantra 1, 31 s). Start a
  new Fable reel by reading its `STORYBOARD.md` and `src/scenes/tortoise.js`.
- **Second reel, the modern fable:** `reel/fable-phone`, "Be Like A Tortoise" (37.5 s). It's an original story on a
  Gita verse (2.58) for kids and adults: a teen monkey glued to his phone learns from an old tortoise. It was a trial
  for the kids' storybooks. It has music (a Lyria score cut to picture), one continuous set with a moving camera, and a
  verse card at the end. Read it for a story with a modern premise, a monkey, or a score.
- **Files:** `src/fable.js` holds the frame, the bubbles, the doodles, `tortoise()` (with `tuckLegs` / `tuckHead`
  into her shell and white elder `brows`), `hamsa()`, `monkey()` (a teen in a hoodie or a plain monkey: IK limbs,
  `light`, a tail that reaches with `tailTo`) and `fablePhone()`; its header is the API. The sheets are
  [docs/fable_sheet.jpg](docs/fable_sheet.jpg) (`?loop=fable`, `?loop=fabledoodles`, `?loop=fablemonkey`).

## The look

- **The frame.** Black bars (`#0D0C0E`) cover everything outside the band from y 600 to 1380. That band is the whole
  picture, and it sits inside Instagram's safe area. Call `fableFrame(lines)` last in every shot.
- **The headline** is the reel's only text, and it's up from frame 0 to the end. Use Poppins 700 at 50 px, centred
  on lines at y 498 and 560, in white with ONE keyword yellow (`*Reply*`). It's two short lines in the reference's
  pattern: "This Is Why You Don't Need / To *X* …", "This Is Why You Should *Never* …", "This Is Why *Y* …". It
  states the moral and gives away nothing of the plot.
- **The sets** are warm, dusty and nearly empty, like the reference: a pale ochre sky, one ground plane, a few props
  and a muted palette. Give the characters one strong colour each (the swans' orange beaks, the tortoise's olive).
  Use one set per act (two acts is plenty) and a mostly locked camera with a slow push. Go in about 1.2× on the
  band, because at 1.0 the characters are too small.
- **The characters** are chibi animals in side view with big pale eyes and heavy lids, so a deadpan look is one
  lid change away. Any Painted rig can join them (the reference reel's village kids are `kartikeya()` with `pal`).
  New animals go in `src/fable.js` on `main`.
- **No words in the story.** No captions, no speech, no signs, no letters in the doodles. The emotes (`!`, a bulb,
  sweat) are fine.

## Thought bubbles: how the story talks

- A bubble is a pale grey blob with a pencil outline and a point aimed at the thinker's head. Inside is a grey
  pencil doodle: a lake, a plan, a zipped mouth, a cart wheel. It reads like a child's drawing: a few strokes, one
  idea.
- **One bubble at a time.** Each one stays up 1.4–2.0 s (`fableLife(t, a, b)` pops it in and out), with about
  0.2 s between bubbles. Before a bubble, the thinker looks up or gets an idea. After it, someone reacts.
- **A motif doodle comes back three times**, and each time it lands differently: a warning, a reminder, and an
  "I told you so" after the fall (the zipped mouth in the reference reel).
- **Escalate with doodles**, e.g. a cart wheel, then a cart wheel with legs and a laughing face.
- **The doodle carries the plot fact.** When the source says the townsfolk called him "like a cart wheel", the
  doodle is a cart wheel. Write a doodle for each beat of the source.
- Add new doodles to `DOODLE` in `src/fable.js`. Draw them in unit space (about -1..1) with `dl()` and `dlE()`,
  make them big and simple, and check them in `?loop=fabledoodles` at phone size.

## Story and timing (from the first reel)

- **Retellings stay true to the source** (CLAUDE.md): every plot beat comes from the text and is listed in
  "Facts used". The Panchatantra's version wins over modern retellings (in it, the tortoise proposes the stick plan
  himself). Keep deaths off screen: a drop out of frame and a thud.
- **Structure:**
  1. The setup: the problem, in one picture (the last puddle dries up).
  2. The plan, shown in bubbles.
  3. The warning (the motif).
  4. The temptation, building up through bubbles and reactions.
  5. The mistake.
  6. The consequence, off screen.
  7. The motif one last time, then a short hold.
- **Act it big.** Use takes, nods, puffing up, going red (`tint: 'flush'`), an eye twitch, kids rolling with laughter.
  The comedy is in the faces and the timing.
- **Timing:** the reference reel's reads were 1–2 s each with a held beat after every big one, about 12 s for the
  first act and 19 s for the second. Render a contact sheet every 0.4 s and read it like a viewer.
- **Modern fables on a verse** (owner, 1 Nov 2026) work too: an original premise (a phone, worry, comparison) acted by
  animals, with one scripture verse as the moral. The story makes no scriptural claim. The verse is quoted exactly
  on a card after the story (Devanagari in Tiro Devanagari Sanskrit, a plain English line, the reference in yellow), and
  the headline names the source ("This Is Why The Gita Says / …"). Pick a verse with a picture in it (the tortoise of
  2.58) so the animal can act the picture.
- **Sound:** SFX (`tools/<name>_sfx.mjs`, cued from the scene's constants), and music when the owner asks for it.
  For music, a Lyria score pinned to bars works: cut a take to picture as `reel/fable-phone` did. Put a dead stop on
  the mishap, let the SFX carry the silence, put the hush on the decision and the swell on the payoff. Keep the music
  at 0.2 under busy SFX. Give a bubble a plink when it pops
  in, a squeak when it goes, and a "zzzip" when the zipped mouth appears. Add wing whooshes, giggles (`laughter()`),
  a slide whistle for a fall, a thud, and a soft wind bed. Music can go on in Instagram.

## Starting a Fable reel

1. Branch off `main`: `reel/fable-<story>` (or `ad/<n>-…` if it's an ad).
2. Write `STORYBOARD.md`: the headline, the logline, the beats with times, the bubbles and their doodles, and Facts
   used.
3. Set `src/config.js` to `w: 1080, h: 1920, duration, bpm, audio` and `fonts: ['700 50px Poppins']`.
4. Write the scene in `src/scenes/<story>.js`. In `studio.html`, replace `demo.js` with it (`src/fable.js` is
   already loaded).
5. Write every shot like this:
   ```js
   camBegin(cx, cy, 1.2); set(t); characters(t); bubble(...); camEnd(); fableFrame(HEADLINE, fadeAtEnd);
   ```
6. Check it: `node render.mjs --stills=0` (frame 0 should show the headline over one clear subject), then contact
   sheets of each act cropped to the band (`--crop=0,600,1080,780`), then strips of the key motions.
7. Render: clear `out/frames`, then `--frames`, then `--encode` into `out/<name>_out/`, along with `cover.png` and
   `captions.txt` (CLAUDE.md).

## Gotchas

- **Don't name a helper `pop`** (the tortoise scene's `const pop = (t, t0) => …` pop-in). It shadows p5's `pop()`, so
  any `push()/pop()` later in that scene file leaks a transform. In `reel/fable-phone` everything drawn after the
  first leaf moved off frame and the black bars slid over the headline. Call it `popIn`.
- **The HB doodle pencil breaks into dots under a zoomed camera** (1.45×, bold lines): a dancing cat read as a black
  blob. Set `FABLE.pencil = 'pen'`, `pencilW .62` and a soft grey `pencilCol` in the scene. Check bubbles at full size,
  not only on a contact sheet.
- **Chibi monkeys have huge heads:** a phone held up at the face reads as drinking from it. Hold it low in the lap
  with the head bowed (`hunch`, `htilt`). A monkey hanging from a vine holds it with the FAR hand, because the near
  arm is drawn over the face. Keep the near hand free to wave, out front at chest height.
- **A colour change as the payoff:** if the light shifts slowly through the whole reel, the reveal is spent by the time
  it comes. Hold the light, then let the sky bloom in the second before the look-up (`dusk()` in `phone.js`).

- **2-point pencil lines need curvature 0, or they vanish.** `dl()` handles this; plain `inkLine` calls don't.
- **Leave bubbles room.** Under a zoomed camera the band's visible area shrinks, so a bubble near the top gets cut
  off. With the camera at `camBegin(560, 1105, 1.2)`, keep bubble centres at y 930 or lower and their height at 220
  or less.
- **Draw order sets depth.** In the reference reel the tortoise is drawn behind the town while he falls, so he
  drops beyond the houses instead of in front of the kids.
- **Holding things:** place a character from its contact point. Draw the swan at `target - hamsaBeak(0, 0, u, o)`
  and the tortoise at `stick - tortoiseMouth(0, 0, u, o)`, so the beak and mouth always touch what they hold.
- **Render time** is about 0.2–0.4 s a frame, roughly 4 minutes for a 31 s reel.

## Still to improve

- The swans' wing flaps are stiff, so add a down-stroke smear and more feathers. The landings and the act 1 to
  act 2 whip (`fableWhip`) are rough.
- End card (owner, 1 Nov 2026): a clean ending plus a follow line. `reel/fable-phone` fades the band after the
  story and shows the verse, then "Follow @therishikatha for more stories".

## Story ideas (each needs a source check)
- The Monkey and the Crocodile (Panchatantra 4): "This Is Why You Should *Never* Panic"
- The Blue Jackal (Panchatantra 1): "This Is Why You Can't *Fake* Who You Are"
- The Lion and the Hare at the well (Panchatantra 1): "This Is Why *Brains* Beat Size"
- The Monkey and the Wedge (Panchatantra 1): "This Is Why You Don't *Meddle*"
- The Lion Makers (Panchatantra 5): "This Is Why Knowledge Needs *Common Sense*"
