# Shiva's Tandava: cinematic style test (15.2 s)

A test of a new look for Rishi Katha reels, modelled on "cinematic motion comic" story reels: flat vector characters
with semi-realistic proportions, lit like film (gradient skies, drifting clouds, haze, god rays, rim light, bloom,
vignette, film grain, lightning), slow camera pushes, crossfaded shots, and karaoke captions (Cinzel, words light up
as they're spoken, names in gold). Built on a new Canvas 2D engine, `src/cine.js`, not p5.brush; the character is
`src/cine_shiva.js`. It's the opening of the planned Shiv Tandav reel.

| # | time | shot | caption |
|---|------|------|---------|
| 1 | 0.0–4.4 | Kailash at night in a storm, the moon's rays; Shiva small on a cliff edge with the trishul; far lightning at 2.75 | There is one dance / that even the gods fear. |
| 2 | 3.9–8.4 | Shiva knees-up, eyes closed, abhaya hand, wind in his locks and the trishul's sash; close lightning at 6.35 | Shiva's Tandava. / When he dances in rage, |
| 3 | 8.0–10.9 | his face: the eyes open (8.85), the third eye opens (9.5–10.1), push in to it, white-out | worlds end. |
| 4 | 10.7–15.2 | dawn: the Nataraja silhouette in a ring of fire, backlit by the sun, golden embers | When he dances in joy, / they begin again. |

Sound: `tools/shiva_cine_sfx.mjs` → `assets/shiva_cine_sfx.wav` (wind, thunder, damru roll, the eyes' boom, the third
eye's fire, the white-out, a temple bell and the damru rhythm at dawn). Captions are auto-timed until a voice track
exists; with TTS, pass each chunk's word start times as `say(a, b, text, { at: [...] })`.

Render: `node render.mjs --clip --out=out/shiva_cine_sfx.mp4` and `--audio=none` for the silent copy.
