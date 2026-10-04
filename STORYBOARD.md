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
         and he doesn't look up. Then we see his face for the first time: he's lost in a book (the real one), and he
         can't wait to show it to us.
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
  B  5.95–9.04 [cut under the cover of the shirt; the shoulder slides off left as the camera comes round]  his face
     reads: 5.95–6.35 the camera has come round to the front: he holds an open book up, only his eyes over it
            6.35–7.05 the real Book 1 cover faces us (SHAILPUTRI, the RK logo); his eyes scan the page, the page's warm
                     light is on his face and story sparks rise off it (caption 3 "…ek kitaab se." from 6.45, over the wall)
            7.05–7.35 he lowers it: a huge grin, eyes shut with joy
            7.45–7.8  he spins it round to show us: Menavati praying by the Ganga; his eyes open on us
            7.8–8.05  a proud little bounce
            8.05–9.0  the camera dives and rotates into the right page until it fills the frame exactly as ad-maker's
                     first art frame does (drawCover fx .745, fy .46, zoom 1.18), so its 8.8–9.2 dissolve is a match cut
  [out: ad-maker's dissolve into the real art at 8.8–9.2, then its shots 4–5 unchanged]
```

Render:
- `node tools/addicted_art.mjs` (once) and `node render.mjs --frames --workers=4`.
- ad-maker isn't edited. Composite from a scratch mirror of it:
  - copy `engine/` and symlink `brand`, `assets`, `node_modules` and `ads/001-addicted/vo`;
  - copy `scene.js`, with the clip dir read from `VARIANT.clip` and the dive amplitude from `VARIANT.dive`;
  - write `variants/hinglish_anim.js` as `hinglish.js` plus `clip: 'ads/001-addicted/gen/anim_frames', dive: 0`;
  - copy `out/frames` into it, renumbered from 1 (f00001.jpg …).
- Render it there with `node engine/render.mjs --ad=001-addicted --variant=hinglish_anim --clip`.
- Mux the shipped `hinglish_9x16.mp4` audio onto it (`-c copy`), and crop the 4:5 copy with `crop=1080:1350:0:250`.
  Only these exports go to `ad-maker/ads/001-addicted/out/hinglish_anim_{9x16,4x5,silent}.mp4`.
