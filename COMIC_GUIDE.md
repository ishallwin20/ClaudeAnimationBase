# The Inked style (comics)

Read this before making a comic page. **Inked** is the style of Rishi Katha Comics: phone-first comic ebooks for the
18–34 audience (the first series is CHIRANJEEVI, planned in [CHIRANJEEVI.md](CHIRANJEEVI.md)). The owner chose it on
14 Nov 2026 over the plain Cinematic look ("Inked is much better").

It is the Cinematic engine drawn as a printed graphic novel. The figures, sets and lighting are cine.js
([CINEMATIC_GUIDE.md](CINEMATIC_GUIDE.md)). An ink pass then puts down outlines, flattens the colour into cel bands and
lays halftone dots in the shadows. The words are lettered as live text over the art: speech and thought balloons,
caption boxes, sound effects.

## The format

- **Swipe pages, 4:5**: 1080 × 1350 design units, rendered at 2160 × 2700. That's Instagram's carousel shape, so the
  same pages are the IG preview, the PDF (WhatsApp-shareable), the CBZ and later the web reader and the EPUB.
- **1–3 panels a page**, at most 5 (a row of three small symbol panels counts as one beat). Every swipe is a page
  turn: end a page on a question, start the next on the answer.
- **~40 pages an issue**, a 10–12 minute read. Margins 24, gutters 16, black gutters.
- Every page carries the watermark `@therishikatha · rishikatha.com` in the bottom margin.
- Retellings follow the CLAUDE.md rules. Every issue ends with a **Facts used** page (book.chapter.verse) and a **What
  the texts don't say** box for folk claims.

## Files

| file | what it is |
|---|---|
| [src/comic.js](src/comic.js) | pages on cine.js: `CK` (the look, the scale), `ART` (panel drawings by name), `lit(L, o)` (a LIGHTS entry in device px; in the Inked look its edge becomes an ink outline), `inkPass()` (the ink, bands and halftone on one panel), `drawPage()`, `thumbPanel()` (a grey panel with its art note, for the thumbnail pass), `comicSetup()` (one SHOT per page) |
| [tools/comic.mjs](tools/comic.mjs) | renders the art from the studio page and letters it: PNG masters, 1080 × 1350 IG JPEGs, the PDF, the CBZ |
| [src/cine_mbh.js](src/cine_mbh.js) | the Mahabharata cast: `mbhBust()` / `mbhHead()` (Drona, Kripa, Krishna, Arjuna, Bhima, Yudhishthira, Duryodhana, Dhrishtadyumna on the Surya rig; `CAST.<who>` holds each look), `manSil()` (a man in profile, one colour, nine poses, bow / mace / sword / spear), `womanSil()`, `wanderer()`, `babyHead()`, `wheel()`, `kalash()`; `mbhFigure()`: a whole person in colour (front view, standing, wide or seated, arm presets `down hip point up forward bow namaste draw reach shoulder`, props bow / mace / sword / spear / pot, `boy` proportions) |
| `comics/<slug>/SCRIPT.md` | the script, page by page and panel by panel, with every beat's verse |
| `comics/<slug>/comic.js` | `COMIC`: the pages, panel rects (`rows()` / `pg()`), the words, the art names and art notes |
| `src/scenes/<slug>_cast.js`, `src/scenes/<slug>_comic.js` | the issue's characters and its panel drawings (`ART.name = (c, P) => …`) |
| `comic_ink.html` (`comic.html` is look A, plain Cinematic) | the studio page: page n at t = n + .5 |
| `assets/fonts/` | Kalam (words, Latin and Devanagari), Bangers (sound effects), Marcellus (titles); SIL OFL |

## Making an issue

1. Branch `comic/<n>-<slug>` off `main` (a worktree is easiest: `git worktree add ../ClaudeAnimationBase-comic<n> -b …`,
   and symlink `node_modules`).
2. **Script** (`SCRIPT.md`): read the source in a verse-numbered edition first (the Mahabharata's critical edition is
   on GRETIL; see the memory on text mirrors). Write each page's panels, words and verse. The owner reviews it.
3. **Thumbnails**: write `comic.js` for every page with `note`s and no art, then
   `node tools/comic.mjs --comic=comics/<slug> --look=ink --render=all`. The grey panels carry the note, so the owner
   can read the whole issue on the phone for pacing and wording before anything is drawn.
4. **Art**: draw `ART` entries page by page. Check with `node render.mjs --page=comic_ink.html --stills=N.5 --out=…`
   (≈0.4 s a page) and a contact sheet of the lettered IG JPEGs.
5. **Letter and deliver**: `tools/comic.mjs` (all pages) → `out/comics/<slug>_out/ink/`.

## Words (comic.js)

- `box` (a caption, cream, ink border), `say` (a balloon; `kind` speech, thought, whisper or sky), `sfx`, `title`.
- Positions are in panel units. A number in (0, 1] is a fraction of the panel, so `x: .5, y: .3` is the centre-top.
- A `tail` points at the speaker. The tool stops it ~100 px past the balloon (130 for thought bubbles), so aim it
  anywhere toward the speaker.
- Sizes on the phone: 31–33 px words are the target and 27 px the hard floor (a page shows ~390 pt wide). Keep a caption under ~25 words, a
  balloon under ~20. Long speeches split across two panels.
- Lines in quotes are close paraphrases of the cited verse; nobody says more than the text gives them.
- `small: true` is 26 px, never less; `tools/comic.mjs` raises any balloon or box `size` under 27 px to 27 (owner,
  21 Nov: the 19-px boxes "look small on phone"). Only the back-matter `list` boxes may go smaller.
- `note: true` is a pale-blue aside box that explains a word or a measure (siddha vs sadhu, a yojana); `gift: true` is
  a gold tag (the boons). A word the reader may not know gets a note the first time it matters.
- `title` with `font: 'Kalam'` and a small size names people in a panel ("KESARI, his father").

## Drawing for the Inked look

- Draw in the panel's own units, with `(0, 0)` at its top-left. Use `at(c, x, y, k, fy)` to place a rig, e.g.
  `at(c, 320, 300, 3.3, -815)` puts a head's centre at (320, 300).
- Light figures with `figure(c, draw, lit(LIGHTS.moon))`. In the Inked look `lit()` turns the light edge into an ink
  outline (`inkW`). Scale the rim for close-ups with `lit(L, { k: 1.3 })`.
- **Night needs light.** Flat bands crush dark gradients to black, so the ink pass lifts the gamma first
  (`inkPass` `gamma .72`). Still keep a lit sky or a moon glow behind anything that must read: a silhouette needs
  something brighter behind it.
- **Faces** get gentler ink: give the panel `ink: { edge0: .14, edge1: .3 }`, or the shade on a face draws a seam.
- **No stars or motes** in the Inked look (`if (!P.ink)`): tiny bright dots become ink rings.
- `figure()` layers aren't clipped to the panel, so a light edge traces shapes beyond it. Thin things (aerial roots,
  strings) inside a lit figure glow like neon: draw them unlit, outside `figure()`.
- Give the hero one visual motif that carries through the issue (Ashwatthama's gem glows in every panel he's in, and
  is gone at the end).

## Lessons from Issue 1 (Ashwatthama)

- The style test (pp. 11–14 in both looks) decided it in one look: the owner picked Inked straight away.
- First drawings fail where they're cute: the owl needed angled lids (a glare), fingered primaries and real talons
  before it read as a predator; crows needed a lit sky behind them and their own outline.
- The Surya head rig (`suryaHead`, with `crown: false, bun: true, curls: false`) plus a beard makes a strong adult male
  face; `withSur(PAL, …)` recolours it.
- PDF size: the halftone doesn't compress well (~1.8 MB a page at full size). So `comic.mjs` writes two PDFs: the
  master (`<slug>.pdf`, art at 2160 × 2700, ~86 MB for 48 pages) and the reader (`<slug>_reader.pdf`, art at
  1440 × 1800, JPEG quality 6, ~16 MB), the one people download. The words are vector text in both, so they stay
  sharp. The EPUB (fixed layout, one page at a time, the lettered page as a 1440 × 1800 JPEG with its words as alt
  text) passes epubcheck 5.1 clean.
- **A trailer reel from the issue's own panels** (`trailer_ashwatthama.html` on the issue's branch): each shot is a
  panel's Inked art (no lettering) moved like a camera, framed with an ink border over a dark blur of itself (or full
  bleed for full-page art), under Cinematic `say()` captions; flash cuts on the hits; an end card with the lettered
  cover. The same page renders the reel cover and the story frames as stills past the reel's end.
- **Scale silhouettes to the panel.** `manSil()` stands ~960 units tall, so in a 400–700-unit panel use k .25–.45 (a
  chariot with its horses ~1100 wide: k .3–.4). The first pass at k .5–.6 filled the panels with giants.
- **Talking heads go in wide rows, the balloon beside the face** (owner's phone review, 14 Nov: "dialogue box
  placement, clearer faces"). In a half-width panel a balloon above a bust lands on the crown or the forehead, and a
  tail aimed at the mouth crosses the face. So a panel with a speaker and a balloon is a full-width row: the head at
  one side (x ~250 or ~780, its centre at ~.55 of the row, k 1.8–2.1 in a 600-unit row), the balloon on the other side
  at the head's height, the tail stopping at the cheek. Two speakers face each other from the two ends with the
  balloon between them (Krishna and Arjuna, p7). Leave room for what sits above the head: Krishna's peacock feather
  runs ~250 units over the head's centre, the kirita ~100. Pages went from 44 to 48.
- `mbhHead()` draws the kirita at .58 of Surya's height: the full crown is taller than the face and steals every panel.
- A figure lying down reads only against something brighter: put Duryodhana's outline on the lit lake, not on the
  dark bank.
- **Characters in colour, silhouettes only where they help** (owner, 14 Nov: "lets not silhouettes everywhere"). Use
  `mbhFigure()` / `mbhBust()` for anyone who acts or speaks; keep silhouettes for night crowds, far figures and the
  odd dramatic backlit beat (Drona's death against the sun, the firelit raid).
- **Clarity over page count** (owner: "we can increase pages"). A page with four or five panels under 460 units tall
  crowds the faces under the balloons: split it into two pages. Issue 1 went from 41 to 44 pages this way.
  `comic.js` lists the pages in order (`numbered([...])`), so a split is just two entries.
- A close-up's gem or light glow scales with the head: keep `ashGemGlow` at .4–.6 when the head is k > 2, or it
  blots out the forehead.
- `deviHead()` draws the Devi's mukut unless `crown: false`: women of the story (Draupadi, Kripi) need it off.
- **Never leave a panel black for pacing**: the owner read p23's black panel as "a black box of nothing". Give the
  other panels the room instead.
- **A head never floats.** A head drawn alone (someone lying in bed) needs the body under a sheet, or it reads as
  severed (`dhrInBed()` in act 2). A baby is held in the crook of an arm, the face to us (`sita(c, { cradle: true,
  inArms })`).
- **A splash needs its people.** Two balls of fire on red read as nothing: show who threw each weapon, the trails
  from their hands, and where they meet (p37). Meteors and sparks must be thick streaks; thin bright lines turn into
  ink.
- **A quote belongs where it's said.** "He would say one day" on p5 confused the owner: narrate early pages, and let
  the character say the line in its own scene (the gem's powers, p40).

## Lessons from Issue 2 (Hanuman), owner's phone review, 21 Nov 2026

- **Lettering sits on clean ground.** On the cover the subtitle ran across a hill's ink outline and the hero's speed
  lines ended in it, so it looked tangled in the art instead of in front of it. Every title, subtitle and caption that
  is not in a box needs a plain field under it: no shape edges, speed lines, limbs or outlines inside the lettering's
  area (a flat colour or a soft gradient is fine). Keep figures and their speed lines above the title zone, end the
  scenery above it, and check a 1:1 crop of the lettering on every cover and splash.
- **Name everyone the first time.** The owner couldn't tell which god was which on the boon pages, or who Vishvakarma
  was. A row of gods, a council, a line-up: give each a name (and who he is, in a few words) and what he does in the
  scene. Lists read best as one wide row per person (the face on one side, the name, the line and a tag on the other).
- **Set up every scene's question before it plays.** The vanaras calling out yojanas made no sense without who was
  asking and why (Sita in Lanka, a hundred yojanas of sea, Angad asking). Before a scene that depends on context, give
  a page that sets it up; pages may grow.
- **Introduce a character before he matters.** Jambavan spoke to Hanuman before anyone had said who he was. Give a
  new character a short panel (who he is, one fact that makes him matter) and then bring him into the story.
- **Say why a beat matters, don't just state it.** "Indra wasn't even very angry" didn't land. Put the contrast in
  the words ("The Sun had spared him: he was only a child. Indra, not even very angry, threw the vajra at a newborn").
- **Show the effect of a curse or a change on the body** (the boy dizzy, spiral eyes, stars) rather than a close-up
  that needs a caption to read.
- **One idea per panel when a page is a montage.** A single splash of "the three worlds" mixed gods, a city and a
  priest into one unreadable picture; three labelled panels (heaven, earth, below) read at once.
- **Use the same word for the same thing.** Vayu took his *wind* out of the worlds (not "breath"): keep the term the
  same in every caption that refers to it.
- **Small faces ink into black "goggles"**: dark irises, kohl and brows merge at panel size. Draw speaking faces at
  bust k ≥ .4, give small faces lighter irises and brown kohl, or close the eyes (Anjana's fond look).
- **A snake, a weapon, an animal must read at a glance.** Shiva's snake as a thin green line read as "a weird green
  thing on his face". Draw it big and in its full shape (the cobra's spread hood, a head with eyes, the tongue),
  clear of the face.
- **Check the PDF, not only the PNGs.** A CSS `text-shadow` on lettering prints into the PDF as an opaque dark box:
  on the cover and the back page the subtitle's box hid the bottom of the title above it ("Next: BALI" cut off),
  while the PNG pages looked fine. `tools/comic.mjs` no longer uses text-shadow; render a few PDF pages to images
  (PDFKit) and look at them before delivering.
- **A tail grows from the hip.** Tails drawn as a separate stroke beside a bust or a turned figure came loose ("attached
  to the clouds", "separate from his body"). Draw the whole figure with `devaFigure`'s `tail` as an array of points
  from the hip (0, 520), `tailW` for thickness, and `tailFn` for anything on it (rags); fire at the tip is drawn after
  the figure (`TIPS`/`tipFires` in hanuman_act3.js), because inside the figure's layer the ink edge scratches it. When
  only the body is cut by the panel's edge, the tail must enter from that same edge.
- **Ropes go round the body** (`bindRopes` via a figure's `after`): loops that stay inside the outline and a knot in
  front. A rope polyline across the panel read as "a Z over him".
- **Caption what the picture can't say.** Every panel the owner couldn't read had no words: say where we are (Lanka),
  who acts (Indrajit, Akshakumara: the full name first, then the short one), what is being shown (the ring "bears
  Ram's name", the grove where Sita was held) and who speaks off-panel (the beings of the sky).
- **Give a big moment its own page** (the tail being lit): a 3-panel page made the tail and the ropes too small to see.
- **A new setting needs its why.** Bhima appeared with no reason to be there: give the age (a new yuga), the place,
  and the errand (Draupadi's lotus) before the meeting, and a line of dialogue before an action (the tail pull).
- **Keep the plain words for sensitive lines** (owner: "come to my bed" is offensive): use the text's other honest
  wording ("if you still refuse to take me as your husband", 5.20.9).

