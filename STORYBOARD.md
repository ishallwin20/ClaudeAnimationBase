# "No human has EVER climbed this mountain." (ad 41 · Books 1–3 · 15K Family Deal card · the second 3D reel)

A 66.1 s explainer in the **3D** style: Mount Kailash built procedurally in three.js (`src/cine3d_kailash.js`: the ice
dome, the ledged faces and the south face's cleft, the kora valley and the Dolma La, Manasarovar and Rakshastal, Gurla
Mandhata), cine.js captions and card on top. English VO (Sarvam `girish_en_devotional`, pace 1.2), karaoke captions
timed to the voice, SFX under it (music added on Instagram). It is the sequel to ad 31 (pradakshina, the first 3D
trial, which did fairly well): the twist calls back to it, shrine, footprints and temple bell. No characters: the camera
flies the mountain; the gold line is the walk.

## Facts used
| claim in the reel | source |
|---|---|
| No human has ever climbed Kailash: "no known successful ascents" | Wikipedia, "Mount Kailash" (Climbing), citing its refs [44] |
| Kailash is 6,638 m | Wikipedia, "Mount Kailash" (infobox, refs [1][2]) |
| Everest (8,849 m) is ~2.2 km taller and has been climbed over 13,000 times | Everest 8,848.86 m (Nepal–China survey, 2020); Himalayan Database via Alan Arnette, "Everest by the Numbers: 2026 Edition": 13,737 summits 1922–2025 |
| Kailash is the home of Shiva | Shiva Purana (Rudra Samhita); Kalidasa, *Kumarasambhava*; Britannica, "Kailas Range" |
| Ravana once lifted the mountain | Valmiki Ramayana, Uttara Kanda 16 (the same telling as ad 15) |
| Four great rivers begin near it: Indus, Sutlej, Brahmaputra, Karnali | Wikipedia, "Mount Kailash": the Yarlung Tsangpo (Brahmaputra), Indus, Sutlej and Ghaghara (Karnali) all rise within a 60 km stretch; the map's four directions follow the Tibetan four mouths (lion north, elephant west, peacock south, horse east) |
| Reinhold Messner, the first to climb all 14 eight-thousanders, was offered the chance (mid-1980s) and declined: "If we conquer this mountain, then we conquer something in people's souls" | Wikipedia, "Mount Kailash", ref [42]; Messner completed the fourteen in 1986 (Britannica, "Reinhold Messner") |
| Today climbing it is forbidden | Wikipedia, "Mount Kailash": Chinese authorities stated any climbing activities are strictly prohibited (after the 2001 Spanish request was refused) |
| Pilgrims walk around it; over 50 km; a pass at ~5,600 m (the Dolma La, ~5,630–5,650 m); Hindus, Buddhists and Jains clockwise | Wikipedia, "Mount Kailash" (Pilgrimage: 53 km; the Drölma pass 5,650 m; clockwise for Hindus, Buddhists, Jains, counter-clockwise for Bon) |
| Pradakshina = keeping the deity on your right | as ad 31 (Monier-Williams, *pradakṣiṇa*) |

Left out on purpose: the "time runs faster", "man-made pyramid", "axis mundi energy" and "climbers age / die" claims
(pseudo-science); the Garpön's "only a man free of sin… turn himself into a bird" (good, but no room); the Bon's
anticlockwise kora (in the IG caption only as "sacred to Bon too"); Lake Manasarovar's Brahma origin.
Performance only (no claim): the stylised geography (distances compressed; the Dolma La sees Kailash closer than it
does), the headlamp queue on Everest, the mountain shaking on "Ravana", the crescent moon, the gold line and its walker.

## Voiceover (tools/kai_vo.json; captions are the script)
```
hook     No human has EVER climbed this MOUNTAIN.
everest  EVEREST is two km taller. It's been climbed over 13,000 TIMES.
zero     This one? ZERO.
name     This is MOUNT KAILASH, the home of SHIVA.
ravana   The mountain RAVANA once lifted.
rivers   Four great rivers begin near it: the INDUS, the SUTLEJ, the BRAHMAPUTRA and the KARNALI.
messner  REINHOLD MESSNER, the first man to climb all 14 of the world's highest peaks, was offered the chance. He REFUSED.
quote    He said: "If we conquer this mountain, we conquer something in people's SOULS."
ban      Today, climbing it is FORBIDDEN.
twist    So pilgrims don't climb it. They walk AROUND it.
kora     Over 50 KM, across a pass at 5,600 METRES, keeping SHIVA on their right.
prad     It's PRADAKSHINA, around Shiva's own home.
ask      Has anyone in YOUR FAMILY done the KAILASH YATRA? Comment your CITY!
```
Speech-to-text (saaras:v3) on the takes came back right ("Kailash", "Sutlej", "Brahmaputra", "Karnali", "Pradakshina",
"Kailash Yatra"; "Reinhard Messner", "Ravan" close enough).

## Shots (times from the voice: src/scenes/kai_tl.js)
| | time | shot |
|---|---|---|
| A | 0–2.66 | the south face in the morning, the camera pushing in (frame 0: the caption up) |
| B | 2.66–9.75 | the height stage at night: Everest beside Kailash, a queue of headlamps up Everest, heights, +2.2 km, the climbs counting to 13,000+; the camera moves to Kailash: a gold 0 |
| D | 9.75–13.03 | Kailash in golden light (Shiva's home), the damru |
| E | 13.03–15.5 | alpenglow, low; the mountain shakes on "Ravana" |
| F | 15.5–22.0 | the map: the four rivers flow out north, west, east, south, named as they're said |
| G | 22.0–29.97 | the north face at dusk under the moon (Messner), then the summit in gold on "refused" |
| H | 29.97–35.17 | the summit at sunset, its plume (the quote) |
| I | 35.17–38.52 | night, stars, the crescent moon (forbidden) |
| J | 38.52–42.22 | the camera cranes up to the map; a gold line goes round the mountain clockwise from Darchen |
| K | 42.22–49.5 | the Dolma La: prayer flags, Kailash ahead, DOLMA LA · 5,630 m; then high over the kora, Kailash on the right |
| L | 49.5–52.95 | ad 31's shrine with its gold footprints, dissolving to Kailash's map with its gold ring |
| M | 52.95–58.55 | the ask: Kailash at sunset, the gold ring round its foot |
| N | 58.55–66.15 | the 15K Family Deal card |

## Files
`src/scenes/kai.js` (shots), `kai_props.js` (the height stage, rivers, labels, the shrine's footprints, prayer flags,
the deal card), `kai_tl.js` (the timeline from the voice), `kai_vo.js` (written by the TTS tool), `kai_cover.js`,
`tools/kai_vo.json`, `tools/kai_sfx.mjs` → `assets/kai_sfx.wav`, `assets/kai_mix.wav`.
`rm -rf out/frames && node render.mjs --frames --workers=2 && node render.mjs --encode --out=out/kai_out/kai.mp4`.
