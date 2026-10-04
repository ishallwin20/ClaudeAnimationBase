# "Addicted", animated: the A/B twin of ad 001

The live-action ad `ad-maker/ads/001-addicted/out/hinglish_9x16.mp4` (16 s) uses an AI-generated clip for 0–9 s,
then the real Shailputri spread (9–12.5 s), then the end card. This branch redraws **only the 0–9 s picture** in the
house style. Everything else stays byte-for-byte the same, so the picture style is the only variable in the A/B:
- the mother's Hinglish VO and the music
- the captions (text, timing, font, position)
- the dissolve into the real art, the petals and the end card

How it fits together:
- This repo renders 217 JPEG frames (t = 0 … 9.0 s at 24 fps).
- ad-maker's `scene.js` draws them in place of `gen/clip_frames`, through the variant `hinglish_anim`. Its captions, art
  shot and end card render on top as before.
- The shipped ad's audio track is muxed back on unchanged.

Scene: [src/scenes/addicted.js](src/scenes/addicted.js), sets and props: [src/scenes/addicted_props.js](src/scenes/addicted_props.js),
character: [src/boy.js](src/boy.js), the book art: [tools/addicted_art.mjs](tools/addicted_art.mjs) → `src/scenes/addicted_art.js`.
No captions or SFX here: ad-maker adds the captions, and the audio is the original's.

```
Logline: A mother confesses her son is addicted. We assume screens. The TV is dark, the tablet buzzes face-down
         and he doesn't look up. He's lost in a book: hers, the real one.
Hook:    frame 0 is a finished picture: a boy from behind, hunched on a jute rug, head down, a big dark TV above him.
         The caption "Mera beta addicted ho gaya hai." fades in at 0.4 s (ad-maker, unchanged).
World:   One evening living room, lit by one floor lamp on the left: muted umber walls, a slate-dark TV, a jute rug,
         a mustard tee. Everything is held back, so the real painted page is the richest image in the film.
Motif:   Light. The only light is the lamp: on his hair and shoulder, and as a glint sliding across the dead TV. Then
         the book's own colour takes over the frame.
Misdirect (fair play, no screen glow on him): head down, still, an elbow that moves like a swipe (it's a page turn).
Shots:
  A  0–5.95  [frame 0 is a finished picture]  one multiplane shot from behind him
     reads: 0–2.5   the hunched boy, the dark TV above (caption 1 sits on the TV)
            1.5–1.9 his right elbow twitches out and back: a "swipe"
            2.5–5.45 the camera pushes in and rises: the boy grows faster than the wall, so the TV fills the top
            2.8–3.7 a lamp glint slides across the TV: it's OFF (caption 2 from 2.7)
            4.15–4.9 the tablet face-down on the pouf lights at its edges and buzzes. He doesn't look up; his head dips
                     a little lower
            5.45–5.95 the camera pushes into his right shoulder until the mustard tee fills the frame
  B  5.95–9.04 [cut under the cover of the shirt; the shoulder slides off]  over his shoulder, looking down into his lap
     reads: 5.95–6.35 the shoulder clears: an open picture book in his hands
            6.45     caption 3 "…ek kitaab se." (ad-maker, at y 430 over his hair)
            6.8–7.45 his right thumb lifts the corner and the page flips over: Menavati praying by the Ganga
            7.5–8.0  his cheek rises (a smile), he leans in
            8.0–9.0  the camera dives and rotates into the right page until it fills the frame exactly as ad-maker's
                     first art frame does (drawCover fx .745, fy .46, zoom 1.18), so its 8.8–9.2 dissolve is a match cut
  [out: ad-maker's dissolve into the real art at 8.8–9.2, then its shots 4–5 unchanged]
```

Render:
- `node tools/addicted_art.mjs` (once) and `node render.mjs --frames --workers=4`.
- Copy `out/frames` to `ad-maker/ads/001-addicted/gen/anim_frames` (1-based, f00001.jpg …).
- In ad-maker, run `node engine/render.mjs --ad=001-addicted --variant=hinglish_anim --clip --out=ads/001-addicted/out/hinglish_anim_silent.mp4`,
  then mux the shipped ad's audio onto it and crop the 4:5 copy (see the end of this file once it ships).
