# "Who is protecting you? Maa." The nine forms of Maa Durga (Cinematic, 21 s)

A remake of an Instagram trend reel (meme hook → each Navadurga form with her name → Jai Maa Durga), with the owner's
nine paintings (`assets/durga-maa-all-avatars/1–9.png`, kept out of git; 1080-wide copies in `assets/navadurga/`,
embedded by `tools/navadurga_images.mjs` as `PICS.nd1..nd9`). No drawn characters: the Cinematic engine shoots the
paintings like film (a slow push toward each face, gold dust, a light sweep, gold flash cuts, grain). Captions in
English, Cinzel. No audio: the owner adds music in Edits.

Scene `src/scenes/navadurga.js`. Render: `node render.mjs --clip --audio=none --out=out/navadurga.mp4`.

**Beat grid for the music:** every cut sits on 90 BPM (one beat = 0.667 s). Pick a 90 or 180 BPM track and put its
downbeat at 0.0 s: the hook flicks every 2/9 s (triplets), the forms every 1.333 s (two beats) from 2.0, the mosaic at 14.0.

| time | shot | text |
|------|------|------|
| 0.0–2.0 | hook: all nine forms flick by in order (2/9 s each, hard cuts), one push across the hook | Them: "Who is protecting you?" / Me: "Maa." 🔱 (lights at 0.8 s) |
| 2.0–14.0 | the nine forms, 1.333 s each, a push toward the face | DAY 1 MAA SHAILPUTRI … DAY 9 MAA SIDDHIDATRI |
| 14.0–18.1 | the nine tiles pop into a 3×3 mosaic, gold grid lines, it dims | Jai Maa Durga 🔱 |
| 17.6–21.0 | soft follow card: RK logo, nine painting thumbnails, no price, held | Nine forms. Nine stories. / Their stories, in the Rishi Katha books / Follow @therishikatha / rishikatha.com |
