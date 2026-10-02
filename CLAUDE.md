# Working in this repo

Read [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) before drawing anything. This file adds what the guide doesn't say: how this
project makes Instagram reels, mostly for Rishi Katha (rishikatha.com, @therishikatha), and what the owner has learned works.

## Branches
- `main` holds the engine and the shared characters (Clawd, Bappa, Bal Bappa, Mooshak, Vayu, Shiva, Kartikeya, Parvati,
  Nandi, Shailputri, Kamadeva and his parrot) and opens the demo. Shared characters and engine changes are committed to `main`.
- Each video gets its own branch off `main`: `reel/<idea>` for comedy reels, `ad/<n>-<book>-<idea>` for Rishi Katha
  book ads (e.g. `ad/1-book1-bull`). The branch holds `STORYBOARD.md`, `src/scenes/<name>.js` (+ `_props.js`),
  `tools/<name>_sfx.mjs` and its WAV in `assets/`, and the reel's `src/config.js` and `studio.html`. Merge `main` into it
  when the shared code moves on.
- `ad/1-book1-bull` ("Why does Shailputri ride a bull?") is the reference for an explainer + book ad: start a new ad by
  reading its storyboard and scene.

## Reel rules (from what worked and what didn't)
- **9:16, 1080×1920.** Captions and every story read sit inside Instagram's safe band: y 420–1500, left of x 930
  (`SAFE` / `caption()` in core.js). The top and bottom are covered by the app.
- **Frame 0 is a finished picture**: the hook caption is already up (pass it an age offset, e.g. `caption(txt, y, t + 1, …)`),
  one simple subject on a plain background, no fade or iris in. Check it with `node render.mjs --stills=0`.
- **Ads end on the full call-to-action card** (no fade out): real covers via `picture()`, the RK logo, the price line,
  the `rishikatha.com` pill, "Follow @therishikatha". Model it on `assets/last_slide_sample.png`, but use the current
  offer: **Set of 3 for ₹600**.
- No voiceover by default: captions carry the explanation, a synthesized SFX track sits under it (`tools/sfx.mjs`), and
  music is added on Instagram, so always render a `--audio=none` copy too.
- With a finished reel, also write the Instagram caption: the keyword question in the first ~125 characters, the
  explanation, the book offer with rishikatha.com (link in bio), a save/share/comment prompt, and 12–15 hashtags.

## Brand assets
- `assets/rk/book1.jpg … book9.jpg` (Navadurga order: Shailputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata,
  Katyayani, Kalaratri, Mahagauri, Siddhidatri) and `logo.png`, embedded as data URIs in `src/scenes/rk_images.js` by
  `tools/rk_images.mjs` (`PICS.book1` … `PICS.book9`, `PICS.logo`). Add `<script src="src/scenes/rk_images.js">` to a
  reel's `studio.html` to use them.
- Print-resolution cover wraps (`assets/<n>-<slug>/`) are kept out of git; the tool uses them when present, else the
  copies in `assets/rk/`.
- Brand colours: teal `#2E5F5A`, orange `#F15A24`, peach `#FBE0CF`; card fonts Marcellus + Poppins (`PROJECT.fonts`).
