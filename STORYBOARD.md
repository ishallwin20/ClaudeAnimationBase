# "Why do Hindus walk around a temple CLOCKWISE?" (ad 31 · Books 1–3 · 15K Family Deal card · the first 3D trial)

A 55.35 s explainer in the new **3D** style: a stone Shiva shrine at dusk built and lit in three.js (`src/cine3d.js`,
`src/cine3d_temple.js`), the camera as the devotee walking round it, cine.js captions and card on top. English VO
(Sarvam `girish_en_devotional`, pace 1.2), karaoke captions timed to the voice, SFX under it (music added on Instagram).
It is the second "Why do Hindus…?" follower trial (ad 30, "Why are Hindu gods BLUE?", got 75k views in its first 3–4
hours) and the first test of 3D: same format, new look. No characters: the camera is the devotee, the footprints are
the walk.

## Facts used
| claim in the reel | source |
|---|---|
| *Pradakshina*: from *dakshina*, "right"; walking round with the deity on your right | Monier-Williams, *pradakṣiṇa* ("moving to the right; circumambulation from left to right, so that the right side is turned towards the person or object"); Britannica, "pradakshina" |
| The right side is the auspicious one | Monier-Williams, *dakṣiṇa* ("right; … dexterous; … favourable, auspicious"); Encyclopedia of Religion, "Circumambulation" |
| You go east → south → west, the direction the sun moves through the day | Encyclopedia of Religion / Britannica, "pradakshina": "beginning in the east and keeping the sacred object on his right hand, proceeds to the south, thus moving in the direction followed daily by the course of the sun" |
| The water of the abhisheka runs out through a channel on the north side: the somasutra | Shiva Rahasya, Ugra amsha (7), ch. 26, v. 56: *maheśasyottaraṁ sthānaṁ somasūtrasthalaṁ smṛtam / pūrvābhimukhaliṅge tu* (the place north of Shiva is the somasutra, for an east-facing linga) ([sanskritdocuments](https://sanskritdocuments.org/doc_shiva/shivalingapradakShiNavidhyupadesham.html)); the pranala on the north wall: Wikipedia, "Pranala" |
| The water that has bathed the linga is *tirtha* | Swami Harshananda, *A Concise Encyclopedia of Hinduism*, "Somasūtra" ("the water collected in the vessel is used as tīrtha by the devotees") ([hindupedia](https://www.hindupedia.com/en/Somasutra)) |
| You never step over it; you walk round to it, turn back and go the other way | Harshananda, ibid. ("the somasūtra should not be crossed. The devotee should start from it, go round the liṅga clockwise and return anticlockwise after reaching the other side"); Shiva Rahasya 7.26.78–80 (*somasūtram anullaṅghya*, *somasūtraṁ na laṅghayet*) |
| "The Shiva Rahasya says it plainly: do not cross the somasutra" / on screen *सोमसूत्रं न लङ्घयेत्* | Shiva Rahasya 7.26.80, *vihitaṁ vāstv avihitaṁ somasūtraṁ na laṅghayet* (prescribed there or not, one should not cross the somasutra) |

Left out on purpose: the "temples are energy machines / magnetic fields" explanations of pradakshina (pseudo-science),
the name "Chandra/ardha pradakshina" (common, but not in these sources), the Shiva Rahasya's nine stations (Nandi,
Chanda, somasutra) and its rule against worshipping facing south (too much for 50 s), and why the rule exists beyond
"the water is tirtha" (folk reasons vary: the reel gives none).
Performance only (no claim): the gold footprints, the sun's orb on its arc, the temple bell on "show your child".

## Voiceover (tools/prad_vo.json; captions are the script)
```
hook   Why do Hindus walk around a temple CLOCKWISE?
name   It's called PRADAKSHINA. DAKSHINA means right.
right  You keep God on your right side, the auspicious side, all the way round.
sun    East, then south, then west: the path the sun takes every day.
twist  But in a Shiva temple, you NEVER finish the circle.
water  The water poured on the Shiva linga flows out through a channel to the north: the SOMASUTRA.
tirtha That water is TIRTHA, holy. You never step over it.
back   You walk round until you reach it, then turn back and go the other way.
text   The Shiva Rahasya says it plainly: do not cross the somasutra.
kid    Next temple visit, show your child.
ask    Did you know this Shiva rule? Comment YES or NO!
```
Speech-to-text (saaras:v3) on the takes came back "Pradakshina", "Shivalinga", "Soma Sutra", "Tirtha", "Shiva Rahasya".

```
Logline: Hindus walk round a temple keeping God on the right, east to south to west like the sun; but in a Shiva
         temple you stop at the channel that carries the abhisheka water, turn back, and go the other way.
Hook:    Frame 0: the stone shrine alone against a violet dusk sky, its lamps lit, caption already up.
World:   one shrine, one courtyard: dusk (lamp-lit) for the story, day for the sun, the dark sanctum for the water.
Style:   3D (three.js under cine.js): granite, brass lamps, real lamp light and shadows, bloom, grain, vignette;
         Cinzel karaoke captions at y 1290, names in gold.
Card:    15K Family Deal: Books 1–3 ₹500 → ₹350, only till 25 Oct midnight, Comment FAMILY, link in bio, Follow.
```

## Shots (times from the voice: src/scenes/prad_tl.js)
| | time | shot |
|---|---|---|
| A | 0–3.35 | the shrine at dusk from the south-east, the camera already circling clockwise |
| B | 3.35–7.4 | the map, straight down, north up: gold footprints go round clockwise from the east door |
| C | 7.4–12.2 | the walk: along the south side, the lamp-lit shrine wall on your right, sunset ahead |
| D | 12.2–17.3 | day, from above the north: the sun's orb rises in the east, crosses the south, sets in the west; the shikhara's shadow swings round; EAST / SOUTH / WEST pinned to the ground; footprints follow the sun |
| E | 17.3–20.85 | the twist: the walk up the west side and round the corner; the walker stops on "NEVER", the channel ahead |
| F | 20.85–27.05 | the sanctum: the copper pot drips on the linga, the water runs down the pitha's spout to the north drain; outside, it pours from the pranala into the channel across the path |
| G | 27.05–30.95 | tirtha: the walker comes to the channel's edge and stops; a stop line glows on the kerb |
| H | 30.95–34.95 | the map: footprints go round from the channel's east side to its west side, then turn back on the outside and go the other way |
| I | 34.95–39.9 | close on the channel at dusk; *सोमसूत्रं न लङ्घयेत्* / somasūtraṁ na laṅghayet / Shiva Rahasya 7.26.80 |
| J | 39.9–43.1 | in front of the door (the linga within), the temple bell swings; the camera pulls back to the whole shrine |
| K | 43.1–47.75 | the map with Shiva's way glowing, both stop lines lit: the ask |
| L | 47.75–55.35 | the 15K Family Deal card |

## Files
`src/scenes/prad.js` (shots), `prad_props.js` (footprint trails, stop lines, the walker, ground pins, the deal card),
`prad_tl.js` (the timeline from the voice), `prad_vo.js` (written by the TTS tool), `prad_cover.js` (the cover),
`tools/prad_vo.json`, `tools/prad_sfx.mjs` → `assets/prad_sfx.wav`, `assets/prad_mix.wav`.
`node render.mjs --frames --workers=2 && node render.mjs --encode --out=out/prad_out/prad.mp4`.
