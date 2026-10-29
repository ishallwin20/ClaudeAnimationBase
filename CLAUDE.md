# Working in this repo

Every reel is made in a named style ([STYLES.md](STYLES.md)): **Painted** ([ANIMATION_GUIDE.md](ANIMATION_GUIDE.md), the
hand-painted p5.brush cartoon), **Cinematic** ([CINEMATIC_GUIDE.md](CINEMATIC_GUIDE.md), the film-lit motion comic), **Storybook** ([STORYBOOK_GUIDE.md](STORYBOOK_GUIDE.md), a flat picture-book look with brush lettering on cine.js:
`src/storybook.js`, `src/sb_cast.js`, `storybook.html`; for riddles, sweet moments, wallpapers and the books), **Painterly** ([PAINTERLY_GUIDE.md](PAINTERLY_GUIDE.md), a digital-painting cinemagraph made only in code, no AI images:
`src/painterly.js`, `src/pt_cast.js`, `painterly.html`; for devotional loops and live wallpapers; first reel `reel/hanuman-ram-loop`), **Cel** ([CEL_GUIDE.md](CEL_GUIDE.md), cel animation in code: a chibi character with a boiling ink line, held on threes, posed by an IK rig and danced to the beat over an unpainted Painterly set: `src/cel.js`, `src/cel_cast.js`, `cel.html`; first reels `reel/shiva-tandav-cel`) or **3D**
([3D_GUIDE.md](3D_GUIDE.md), a three.js world under the Cinematic layer: `src/cine3d.js`, `cine3d.html`, the shrine set in
`src/cine3d_temple.js`, Mount Kailash in `src/cine3d_kailash.js`, India as a relief map in `src/cine3d_india.js`, the Palk Strait and Ram Setu in `src/cine3d_setu.js`; trial reel `ad/31-books123-pradakshina`). The owner
names the style; read that style's guide before drawing anything. This file adds what the guides don't say: how this
project makes Instagram reels, mostly for Rishi Katha (rishikatha.com, @therishikatha), and what the owner has learned works.

## Branches
- `main` holds the engine and the shared characters (Clawd, Bappa, Bal Bappa, Mooshak, Vayu, Shiva, Kartikeya (recoloured: other children, Surya's six), Parvati,
  Nandi, Shailputri, Brahmacharini, Chandraghanta, Menavati, Kalaratri and her donkey, Kamadeva and his parrot, a modern boy in a mustard tee, Aarav, the turquoise-tee kid of the book-doorway reels, Sher, Durga's lion, who also draws Chandraghanta's tigress and runs and leaps in side view, Maa Durga with her ten
  arms and the gods' gifts, Mahishasura, the buffalo demon, with his buffalo form, the other asuras on his rig (Shumbha and Nishumbha, Chanda and Munda, Dhumralochana, a messenger), Raktabija, the blood-seed demon whose clones sprout from the ground, Maa Kali with her tongue out, Shiva lying down, Ravana with his ten heads (each a personality) and twenty arms, Bal Hanuman, baby Hanuman with golden fur, a curly tuft and a long tail, who sits, stands and flies, Hanuman grown up on Narad's rig (mukut, gada, tail; `sindoor` turns him vermilion), Panchmukhi Hanuman (`src/panchmukhi.js`: his four other faces, Narasimha, Garuda, Varaha and Hayagriva, pop out round his head and blow; Makardhwaja, his half-fish son; Ahiravana on the asura rig), Ram (kirita, Kodanda) and Lakshman on the same rig, Sita on Parvati's rig, Indra on Airavata, his four-tusked white elephant, with the vajra, Shani Dev with his crow (eyes on his feet, the cursed violet gaze, the limp), Yama on Shani's rig with his noose, mace and buffalo, Vishnu seated with four arms (or two, as a king, with a jayamala), riding Garuda (the parrot rig recoloured) or on Shesha, Narad Muni with his veena (standing, sitting, on a cloud; with the monkey face Vishnu gave him), baby Ganesha with the human face he was born with, Bal Krishna with his peacock feather and flute (mud on his face, the universe in his mouth), Yashoda on Parvati's rig in an odhni, Maa Lakshmi with four arms, lotuses and pouring coins, her owl (a barn owl whose head spins right round, with sunglasses), a cow on Nandi's rig, the cows and calves of Vraja (`src/cow.js`: soft, round, lashed eyes, painted horns, five coats; `calf: 1`; clues `tilak` and `feather`), and the Ramayan series kit, `src/ramayan.js` + `src/ramayan_sets.js`: Valmiki, the nishada hunter with his bow, four-faced Brahma on his lotus, the krauncha (a sarus crane: dance, cry, fallen), Dasharatha, Kaikeyi, Manthara, Lav and Kush, Devanagari verses, the RAMAYAN ident and the series follow card, the ashram, the Tamasa, Ayodhya's court and a night chamber) and opens the demo. It also holds the Cinematic
  style: its engine (`src/cine.js`), `cine.html` with the cast and lighting sheet, and its cast (`src/cine_shiva.js`: Shiva in
  colour with the third eye, and the Nataraja; `src/cine_cast.js`: Sati, who becomes Shailputri with a trishul and lotus,
  Daksha, crowds, the Rudra Tandava, Shiva seated, Nandi (a zebu bull) lying and standing, white or as the black stone temple Nandi, the Sudarshan chakra, the yagna fire, the
  Pushpak, Shiva's foot, Parvati clinging, Hanuman leaping, and the Nandi
  story's silhouettes: a rishi with a plough, the boy Nandi, a devotee, Nandanar; `src/cine_devi.js`: the Devi in colour with four arms, first as Bhramari with her bees, the base for a
  Cinematic Durga; `src/cine_asura.js`: Arunasura, a horned demon king on his throne or in tapas (recoloured, Mali and Sumali; with `crown: 'mukut'` and sleep/yawn faces the rig is Kumbhakarna); `src/cine_kumbha.js`: Kumbhakarna (standing, in tapas, lying asleep in silhouette; his face asleep, yawning, possessed), a running elephant (four-tusked Airavata), Brahma with four heads on his lotus, Saraswati's colours; `src/cine_surya.js`: Surya, the sun god, with lotuses; `src/cine_yama.js`: Yama on Surya's rig (noose, mace, burning eyes), his buffalo and Yama riding it, Markandeya clinging to the linga, Shiva's kick; `src/cine_ravana.js`: Ravana with ten heads and twenty arms, who
  stands, lifts Kailash, is pinned under it, bows, sits on his gold throne, reaches down to grab, loses his crowns, carries Sita, swings a sword, loses his left arms (they grow back), and rides his gold chariot drawn by ghost-faced mules;
  `src/cine_ganga.js`: the descent of the Ganga (the torrent, water streams, Shiva's jata spread wide to catch her, Ganga, a horse and chariot, Bhagiratha on one toe, a ghat with lamps); `src/cine_temple.js`: temple architecture (an axonometric renderer for sun-lit stone solids with shadows, niches and galleries, and the Kailasa temple at Ellora as a model that can be dug and carved from the top down; a stone elephant, a copper-plate grant, a stone carver, a chisel close); `src/cine_jatayu.js`: Jatayu, the king of eagles (perched, wings spread, fallen with his wings cut, his head and talon close); `src/cine_sita.js`: Sita in colour (standing, carried, kneeling); `src/cine_vanara.js`: Angad, a vanara prince
  in colour (stand, walk, plant, strike, bow; his foot close; kneeling), recolourable into other vanaras; Ram in silhouette with the Kodanda in `src/cine_cast.js`, also kneeling and with hands joined) and sets (`src/cine_sets.js`: Kailash, uprooted Kailash, cliffs,
  clouds, the ring of fire, a fire-lit hall, cracks, meteors, stars, shrines, debris, shock rings, burning Lanka, Devanagari
  verses, a linga, oil lamps, the sanctum doorway, furrows, a river, a gopuram, bees and swarms, the macro bee, the
  demon's throne, the sun (blazing or dead), the thrown trishul, frost, Ganesha in lines of light, Ravana's gold throne, a forest hut, a great tree, a funeral pyre, the end card). `tools/lyria.mjs` makes a reel's score; `tools/sarvam_tts.mjs` a voiceover. Shared characters and engine changes, in either style, are committed to `main`: enrich them there when a reel
  needs more.
- Each video gets its own branch off `main`: `reel/<idea>` for comedy reels, `ad/<n>-<book>-<idea>` for Rishi Katha
  book ads (e.g. `ad/1-book1-bull`). The branch holds `STORYBOARD.md`, `src/scenes/<name>.js` (+ `_props.js`),
  `tools/<name>_sfx.mjs` and its WAV in `assets/`, and the reel's `src/config.js` and `studio.html`. Merge `main` into it
  when the shared code moves on.
- `ad/1-book1-bull` ("Why does Shailputri ride a bull?") is the reference for an explainer + book ad: start a new ad by
  reading its storyboard and scene. `reel/shiva-cinematic` ("There is one dance even the gods fear") is the reference for
  the Cinematic style: its `studio.html` is a copy of `cine.html` loading `src/config.js` and the reel's scene.

## Reel rules (from what worked and what didn't)
- **9:16, 1080×1920.** Captions and every story read sit inside Instagram's safe band: y 420–1500, left of x 930
  (`SAFE` / `caption()` in core.js). The top and bottom are covered by the app.
- **Retellings stay true to a source.** When a reel retells a purana, epic or temple legend, every plot beat (who did
  what, why, and what it caused) comes from a citable source (the purana, the temple's sthala purana, a recognised
  retelling) and is listed with it in the storyboard's "Facts used". Where versions differ, use the scriptural or most
  widely cited one, never a variant picked because it's funnier. The comedy lives in the performance: faces, reactions,
  timing, the caption voice, and hidden gags that claim no plot fact (a gag that implies one, like Varuna hiding in the
  water pot, counts as a claim). Pure comedy concepts with an obviously made-up premise (Vahana Union) are fine, but every
  fact they teach must be true. Ad 17 (Gokarna) was deleted after viewers pointed out Ravana stopped for his evening
  prayers, not a toilet.
- **Frame 0 is a finished picture**: the hook caption is already up (pass it an age offset, e.g. `caption(txt, y, t + 1, …)`),
  one simple subject on a plain background, no fade or iris in. Check it with `node render.mjs --stills=0`.
- **Ads end on the full call-to-action card** (no fade out): real covers via `picture()`, the RK logo, the price line,
  the `rishikatha.com` pill, "Follow @therishikatha". Model it on `assets/last_slide_sample.png`, but use the current
  offer: **Books 1–3, set of 3 for ₹500** (as of Oct 2026; Book 7 is "coming soon").
- In the Cinematic style, captions are karaoke chunks (`say()`, 2.2–3 s each, names in gold) and the card is
  `rkCardCine()`; the same safe band, frame-0 and card rules apply.
- **Caption font (Painted):** set `PROJECT.letterFont: 'Bangers'` in a new reel's config (owner, Oct 2026: a viewer found
  Permanent Marker hard to read). Bangers is all caps, so emphasis is gold and size, not CAPS.
- No voiceover by default (when the owner asks for one, see the Cinematic guide's Voice section): captions carry the explanation, a synthesized SFX track sits under it (`tools/sfx.mjs`), and
  music is added on Instagram. Render one final MP4, the SFX version (no `--audio=none` copy; owner, Oct 2026). Clear
  `out/frames` first: the frame cache is resumable and will reuse the previous reel's frames.
- With a finished reel, also write the Instagram caption: the keyword question in the first ~125 characters, the
  explanation, the book offer with rishikatha.com (link in bio), a save/share/comment prompt, and 12–15 hashtags.
- **Deliver each reel in one folder, `out/<name>_out/`** (owner, Oct 2026): the MP4 (`<name>.mp4`), the cover
  (`cover.png`, from the reel's `cover.html`, the title inside the 3:4 grid crop y 240–1680) and `captions.txt` (the
  Instagram caption, then the pinned comment at the bottom). Every reel gets a cover.

## Books (Navagraha series, from Oct 2026)
- Kids' picture books (ages 3–10), one per graha, drawn in the **Painted** style; the **Storybook** style is meant for the
  books too (owner, Oct 2026), through `tools/book.mjs --page=` (see STORYBOOK_GUIDE.md). Each book gets a branch `book/<n>-<graha>`
  (Book 1: `book/1-surya`) holding `books/<slug>/STORY.md` (the text, art notes and "Facts used": the retelling rules
  above apply), `books/<slug>/book.js` (the words and where they sit, in mm on the trim), `src/scenes/<slug>_book.js`
  (the art) and the branch's `src/config.js` / `studio.html`.
- Format (owner, Oct 2026): 14 × 22 cm portrait pages, spreads 28 × 22 cm, 16 interior pages (4 sheets of 22 × 28) plus a
  separate 4-page cover. 7 story spreads with 2–4 short lines a page and a few speech bubbles, p1 the title page, p16
  "Meet <graha>" (weekday, family, a real-planet fact, the moral), inside covers "This book belongs to" and the series.
- Art: each spread is a 1-second slot of the scene (slot 0 inside front | p1, 1–7 the spreads, 8 p16 | inside back,
  9 back | front cover), rendered at t = slot + .5 on a 3378 × 2668 canvas (300 dpi with 3 mm bleed; `vignette: false`).
  Draw in the half-size design space under `camBegin(…, 2)`: the reel rigs' u ranges apply as they are. No words in the
  art; leave each page's text zone quiet, faces 12 mm off the fold.
- Layout: `node tools/book.mjs --book=books/<slug> [--pages=6,7] [--render]` writes `out/books/<slug>_out/`: the interior
  PDF (single pages with bleed, live text, Andika 16 pt; titles Marcellus; fonts in `assets/fonts`), the cover PDF, a
  spreads preview PDF and a fixed-layout EPUB 3 (check it with epubcheck: `java -jar epubcheck.jar <file>`).

## Brand assets
- `assets/rk/book1.jpg … book9.jpg` (Navadurga order: Shailputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata,
  Katyayani, Kalaratri, Mahagauri, Siddhidatri) and `logo.png`, embedded as data URIs in `src/scenes/rk_images.js` by
  `tools/rk_images.mjs` (`PICS.book1` … `PICS.book9`, `PICS.logo`). Add `<script src="src/scenes/rk_images.js">` to a
  reel's `studio.html` to use them.
- Print-resolution cover wraps (`assets/<n>-<slug>/`) are kept out of git; the tool uses them when present, else the
  copies in `assets/rk/`.
- Brand colours: teal `#2E5F5A`, orange `#F15A24`, peach `#FBE0CF`; card fonts Marcellus + Poppins (`PROJECT.fonts`).
