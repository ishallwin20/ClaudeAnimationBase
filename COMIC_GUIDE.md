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
| [src/cine_mbh.js](src/cine_mbh.js) | the Mahabharata cast: `mbhBust()` / `mbhHead()` (Drona, Kripa, Krishna, Arjuna, Bhima, Yudhishthira, Duryodhana, Dhrishtadyumna on the Surya rig; `CAST.<who>` holds each look), `manSil()` (a man in profile, one colour, nine poses, bow / mace / sword / spear), `womanSil()`, `wanderer()`, `babyHead()`, `wheel()`, `kalash()` |
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
- Sizes on the phone: 31–33 px words are the floor (a page shows ~390 pt wide). Keep a caption under ~25 words, a
  balloon under ~20. Long speeches split across two panels.
- Lines in quotes are close paraphrases of the cited verse; nobody says more than the text gives them.

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
- PDF size: the halftone doesn't compress well (~1.9 MB a page in the Inked look). Lower the art JPEG quality in
  `comic.mjs` for the reader edition if needed.
- **Scale silhouettes to the panel.** `manSil()` stands ~960 units tall, so in a 400–700-unit panel use k .25–.45 (a
  chariot with its horses ~1100 wide: k .3–.4). The first pass at k .5–.6 filled the panels with giants.
- **Busts under balloons:** the words sit at the top of a panel, so put the head low (its centre at ~.7 of the panel
  height, k 1.3–1.5) and let the shoulders run off the bottom. Move a caption to the top rather than over a face.
- `mbhHead()` draws the kirita at .58 of Surya's height: the full crown is taller than the face and steals every panel.
- A figure lying down reads only against something brighter: put Duryodhana's outline on the lit lake, not on the
  dark bank.

