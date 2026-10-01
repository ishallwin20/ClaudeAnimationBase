# Why does Shailputri ride a bull?

A 42-second vertical reel (1080×1920, 24 fps, bpm 100) for Rishi Katha's Navadurga picture books, starring Maa Shailputri and Nandi.
Scene: [src/scenes/shailputri_bull.js](src/scenes/shailputri_bull.js), sets and props: [src/scenes/shailputri_props.js](src/scenes/shailputri_props.js),
characters: [src/nandi.js](src/nandi.js), [src/shailputri.js](src/shailputri.js),
brand images: [tools/rk_images.mjs](tools/rk_images.mjs) → `src/scenes/rk_images.js` (drawn with `picture()`),
sound effects: [tools/shailputri_sfx.mjs](tools/shailputri_sfx.mjs) → `assets/shailputri_sfx.wav`. No voiceover: captions carry it.

```
Logline: Everyone knows Shailputri rides a bull; nobody asks why. The bull proves what he is (he shatters a boulder,
         stands through a gale, waits a whole night in the snow), then all that power bows to the lotus in her hand.
         That is the answer, and the first page of a book.
Hook:    "WHY DOES SHAILPUTRI / RIDE A BULL?" is already up on frame 0, over one simple picture: her on Nandi,
         against the blue face of the mountain. No fade in.
World:   From the cover of Book 1: blue mountains, cream snow, a coral saree, a white bull, orange and white flowers.
         Colour arc: cool dawn blue (A–C) → a golden morning with flowers (D) → festive teal with lamps (E) → the
         brand's peach (F). Palette: SP in shailputri_props.js.
Motifs:  Nandi's bell (frame 0, the bow, every step of the ride). Flowers: none until she guides him, then one at
         every hoof-fall. The trishul and the lotus: held from frame 0, questioned in E, answered by the book.
         The ending rhymes with the opening: the painted pair of frame 0 is the cover of Book 1.
Text:    every caption sits inside Instagram's safe band (y 420–1500, left of x 930).
Arcs:    Shailputri: gentle → delight (the pat, the wave, the shake) → serene (the lotus, the bow) → gentle → a wink
         Nandi:      calm → "?" → "!" → determined (the boulder, the gale) → asleep under snow → happy (she comes) →
                     wild (the shake) → soft → eyes shut (the bow) → happy (the ride)
Shots:   (times from shot C on are scene time: on screen they land 1.8 s later, because B's title card holds longer;
         see HOLD in the scene)
  A  0–3.6     [no transition in: frame 0 is a finished picture]  the hook
     reads: 0–1.4 the caption and the pair (bell swinging, hair settling) · 1.5–2.2 Nandi's eye slides to us, an ear
            flicks, a "?" pops · 2.3–3.0 she pats his hump, eyes smiling shut · 3.0–3.6 the caption fades, the
            camera starts back
  B  3.6–9.6   [the same camera move carries on]  who she is
     reads: 3.6–5.0 pull back: the mountain, a glint on the summit · 5.0–6.6 "SHAIL = mountain" (the peak glows) ·
            6.7–8.1 "PUTRI = daughter" (she waves the lotus up at it, a heart floats to the peak) · 8.2–11.1
            "Daughter of the Mountain / the first of Maa Durga's nine forms" (held 1.8 s longer)
  C  9.6–18.6  [a snow-coloured brush wipe]  the bull: three words, shown
     reads: 9.9 "Her bull isn't random." · 10.5 he hears it: "!" · 10.8–11.4 a boulder rolls down; he braces ·
            11.4 IMPACT: he doesn't move, the boulder cracks and bursts: STRENGTH · 12.3 a proud snort ·
            12.6–14.6 a gale: flags flat, pines bent, a bird blown onto his horn; not a hoof moves: STABILITY ·
            14.8 the bird chirps · 15.0–17.2 a whole night passes, snow piles on him: STEADFASTNESS ·
            17.4–18.6 dawn: she walks in, his tail wags
  D  18.6–27.0 [same set, the camera carries]  the deeper meaning
     reads: 18.9 the mighty shake: the snow bursts off, he rears · 19.2 STOMP: "All that power…" · 19.8–20.6 she
            steps in and offers the lotus; it glows; his forehead comes down to it (bell) · 21.0–21.7 he kneels:
            "…bows to her calm." · 22.2–23.1 light and petals; she is up, he rises · 23.1–26.2 the ride: the land
            scrolls, the sky warms, a flower at every hoof-fall: "Divine strength, gently guiding the mightiest
            forces on earth." · 26.2–27.0 dusk, an arch-shaped iris closes on them
  E  27.0–34.2 [match cut: the iris is the arch of a lamp niche]  nine nights
     reads: 27.0–28.2 pull back from niche 1 to a wall of nine · 28.2–30.5 niches 2–9 light one by one, a
            silhouette in each: "Nine nights. Nine forms of Maa Durga." · 30.6–32.3 niche 1 glows: "Navratri begins
            with her: strong, steady, grounded." · 32.4–33.9 push in: "Why a trishul?" (it glints, "?") "Why a
            lotus?" (it glints, "?"), a wink
  F  34.2–40.2 [a brush wipe in the brand's orange]  the book
     reads: 34.5 the real cover of Book 1 pops: "That's another story…" · 35.0 Books 2 and 3 fan out · 35.5 the RK
            logo · 35.9 "The Navadurga Series" · 36.3 "Picture books · Ages 4–8 · Set of 3 for ₹600" · 36.7 the
            pill: rishikatha.com · 37.3 "Follow @therishikatha for more stories" · hold to 40.2
  [no fade out: the last frame is the whole card, so the call to action survives a pause and the loop]
```

Render: `node tools/rk_images.mjs` (once, or when the covers change) and `node tools/shailputri_sfx.mjs`, then
`node render.mjs --frames --workers=4` and `node render.mjs --encode --out=out/shailputri_bull.mp4` (picks up
`PROJECT.audio`); `--audio=none --out=out/shailputri_bull_silent.mp4` for a copy to add music to on Instagram.
