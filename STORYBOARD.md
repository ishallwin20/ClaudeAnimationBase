# "This bridge across the SEA was built in FIVE DAYS." (ad 42 · Books 1–3 · 15K Family Deal card · the third 3D reel)

A 74.2 s retelling in the **3D** style, made for a trial reel. The Palk Strait is built from real terrain
(`src/cine3d_setu.js`: Rameswaram, the Dhanushkodi spit, Mannar, with the shoals laid in between) and India is a relief
map (`src/cine3d_india.js`, Survey of India borders). The cine.js captions and card sit on top. English VO (Sarvam
`girish_en_devotional`, pace 1.2) with karaoke captions timed to the voice and SFX under it; music is added on Instagram.
The hook's twist: Ram didn't build it. The Ocean god names NALA, son of Vishwakarma, and the five days' count is
Valmiki's own. There are no characters: the army is torchlight, the Ocean god a beam of light, and the bridge grows on screen.

## Facts used
| claim in the reel | source |
|---|---|
| Ram's army of vanaras reached the sea; Lanka lay across it | Valmiki Ramayana, Yuddha Kanda 4–5, 21 |
| For three nights Ram lay on kusha grass on the shore, honouring the Ocean; the Ocean did not appear | Yuddha Kanda 21.1–12 ("spent a time of three nights there"; "the careless ocean did not appear in his personal form") |
| So he raised his bow; his arrows struck the sea and the waves rose like mountains | Yuddha Kanda 21.21–31 (waves "resembling Vindhya and Mandhara mountains") |
| The Ocean god rose: he cannot change his nature (fathomless, not to be forded) | Yuddha Kanda 22.17–27 |
| "But Nala, son of Vishwakarma, can build a bridge, and I will hold it" | Yuddha Kanda 22.44–45 |
| The vanaras hurled trees and rocks as big as elephants | Yuddha Kanda 22.54–57 (sala, palmyra, bamboo… "elephant-sized rocks and mountains") |
| Day 1: 14 yojanas, day 2: 20, day 3: 21, day 4: 22, day 5: 23 | Yuddha Kanda 22.66–70 |
| 100 yojanas long, 10 wide | Yuddha Kanda 22.74 |
| The gods watched from the sky; it shone like the Milky Way | Yuddha Kanda 22.72–73 |
| Ram crossed on Hanuman's shoulders, Lakshman on Angad's | Yuddha Kanda 22.80–81 |
| Today a 48 km chain of shoals runs from India (Pamban/Rameswaram) to Sri Lanka (Mannar); Hindus call it Ram Setu | Wikipedia, "Adam's Bridge" |

Verse numbers follow the valmikiramayan.net (Gita Press) text.
Left out on purpose: the floating stones with Ram's name and the squirrel (later tellings, not in Valmiki); "NASA
proved it" and the man-made-or-natural debate; the 1480 cyclone; any conversion of yojanas to km (the reel never puts
the 100 yojanas beside the 48 km); the Rameswaram linga (it belongs to the Jyotirlinga reel).
Performance only (no claim): the geography of the mythic bridge (laid along the real shoals, its width at Valmiki's
1:10); the camp's torches, the night counter, the Ocean god as light, the fire arrows' look, the time-lapse sun, the
Milky Way sky.

## Voiceover (tools/setu_vo.json; captions are the script)
```
hook   This bridge across the SEA was built in FIVE DAYS.
name   It's RAM SETU. And it wasn't RAM who built it.
reach  Ram's army of VANARAS reached the sea. LANKA lay across it.
nights For three nights, Ram prayed to the OCEAN. It never came.
bow    So he raised his BOW, and the waves rose like MOUNTAINS.
god    The OCEAN GOD rose: "I cannot change my nature.
nala   But NALA, son of VISHWAKARMA, can build a bridge. And I will hold it."
rocks  The vanaras hurled TREES and ROCKS as big as ELEPHANTS.
d1–d5  DAY 1: 14 yojanas. DAY 2: 20. DAY 3: 21. DAY 4: 22. DAY 5: 23.
size   100 YOJANAS long. 10 wide.
milky  The gods watched from the sky. It shone like the MILKY WAY on the sea.
cross  RAM crossed on HANUMAN'S shoulders, LAKSHMAN on ANGAD'S.
today  Today, a 48 KM chain of shoals still runs from India to SRI LANKA. Hindus call it RAM SETU.
ask    Have you been to RAMESWARAM? Comment your CITY!
```
Speech-to-text (saaras:v3) came back right on every take. The days needed a stop between the day and the number
("Day two. Twenty."): run together, "Day two: twenty" came back as "Day 220", and "Day four" as "Therefore".

## Shots (times from the voice: src/scenes/setu_tl.js)
| | time | shot |
|---|---|---|
| A | 0–3.2 | the finished bridge from behind India's end, running to Mannar in golden light (frame 0: the caption up) |
| B | 3.2–6.8 | India from space, Survey of India border; the dive to the strait, Ram Setu's line and glow |
| C | 6.8–11.2 | dawn on the Dhanushkodi spit, the army's torches; LANKA across the sea |
| D | 11.2–15.3 | night, the camp fire, the Milky Way; NIGHT 1 · 2 · 3 |
| E | 15.3–19.2 | dusk: four fire arrows, impacts, spray, the waves rise |
| F | 19.2–22.9 | the Ocean god rises as a beam of emerald light, rings on the water |
| G | 22.9–28.1 | NALA · son of Vishwakarma; the camera rises as the bridge's gold line is drawn |
| H | 28.1–32.1 | golden light: trees and rocks fly in and splash at the bridge's end |
| I | 32.1–41.9 | five days in time-lapse (the sun crosses once a day), DAY n, +yojanas, the bar filling to 100 |
| J | 41.9–44.9 | the whole bridge from above: 100 long, 10 wide |
| K | 44.9–49.8 | night, the Milky Way above, the bridge lit with torches |
| L | 49.8–54.6 | the army's torches cross at dawn |
| M | 54.6–62.6 | today: the shoals from above (no bridge), the gold line, 48 km, INDIA, SRI LANKA, RAM SETU |
| N | 62.6–66.6 | the ask: low over the shoals in golden light, RAMESWARAM |
| O | 66.6–74.2 | the 15K Family Deal card |

## Files
`src/scenes/setu.js` (shots), `setu_props.js` (the camp, dimension marks, the day counter, the deal card), `setu_tl.js`
(the timeline from the voice), `setu_vo.js` (written by the TTS tool), `setu_cover.js`, `tools/setu_vo.json`,
`tools/setu_sfx.mjs` → `assets/setu_sfx.wav`, `assets/setu_mix.wav`.
`rm -rf out/frames && node render.mjs --frames --workers=1 && node render.mjs --encode --out=out/setu_out/setu.mp4`
(one worker: two pages building both sets at once pass the page's 30 s load limit).
