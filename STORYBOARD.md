# "How many times should you walk around EACH god?" (ad 50 · Books 1–3 · Pradakshina Part 2 · 3D)

A 51.3 s explainer in the **3D** style, the sequel to ad 31 ("Why do Hindus walk around a temple CLOCKWISE?", the reel
that has brought the most new followers so far). A dusk courtyard of five shrines (Shiva's in the middle, with Part 1's
somasutra; Devi, Ganesha, Vishnu and Surya at the corners), each god's emblem in lines of light over their shikhara,
gold footprint rings round each shrine, one ring a round, each a step further out so the count can be read and heard (a
chime climbs a step as each round closes). English VO (Sarvam `girish_en_devotional`, pace 1.2), karaoke captions timed
to the voice, SFX under it (music added on Instagram). Card: Books 1–3, set of 3 for ₹500 (the 15K Family Deal ended
25 Oct).

## Facts used
| claim in the reel | source |
|---|---|
| Each god has their own number of rounds: Devi one, Surya seven, Ganesha three, Vishnu four, Shiva half | Hari Bhakti Vilasa 8.394, quoting the Narasimha Purana (*nārasiṁhe*): *ekāṁ caṇḍyāṁ ravau sapta tisro dadyād vināyake / catasraḥ keśave dadyāt śive tv ardhapradakṣiṇām* ([wisdomlib, HBV ch. 8](https://www.wisdomlib.org/hinduism/book/hari-bhakti-vilasa-sanskrit-text/d/doc493474.html)); the same verse is widely quoted in puja manuals ([sanskritdocuments](https://sanskritdocuments.org/articles/Note_pradakShiNA_AshirvAda.html)) |
| "Devi, the Mother" for *caṇḍī* | Chandi is the Devi (Durga) of the Devi Mahatmya; Britannica / Wikipedia, "Chandi" |
| Seven for Surya is the most of the five | the same verse |
| "It's all in one verse of the Narasimha Purana" / the verse on screen in Devanagari | HBV 8.394 names its source *nārasiṁhe*; on screen: "Narasimha Purana, in the Hari Bhakti Vilasa 8.394" |
| Shiva's half: you never cross the water from his shrine; you walk up to it and turn back (Part 1) | Shiva Rahasya 7.26.80 (*somasūtraṁ na laṅghayet*); Harshananda, *A Concise Encyclopedia of Hinduism*, "Somasūtra" (start from it, go round clockwise, return anticlockwise after reaching the other side), as in ad 31 |

Left out on purpose: the other count verse some South Indian families use (*ekaṁ vināyake kuryāt dve sūrye tisra
īśvare…*: Ganesha 1, Surya 2, Shiva 3, Vishnu 4, Devi 5, Skanda 6, ashvattha 7; unattributed in what we found): the
reel gives one sourced verse, and the Instagram caption says traditions differ. Also left out: the Varaha Purana's
reward lines that follow in HBV 8.395–396 (no Yama's city; three rounds with a full prostration = ten ashvamedhas),
for time; and the word *panchayatana* (the five-shrine courtyard is a picture, not a claim).
Performance only (no claim): the courtyard and where each god's shrine stands, the emblems (trishul, Ganesha in lines of
light, Sudarshan chakra, sun disc, linga), the rings stepping outward, the chimes, "Most of us do the same rounds for
every god" (a common habit, not a teaching).

## Voiceover (tools/rounds_vo.json; captions are the script)
```
hook     How many times should you walk around EACH GOD?
same     Most of us do the SAME rounds for every god.
own      But the scriptures give each god their OWN NUMBER.
devi     For DEVI, the Mother: just ONE round.
ganesha  For GANESHA: THREE.
vishnu   For VISHNU: FOUR.
surya    For SURYA, the Sun: SEVEN, the most of all.
shiva    And for SHIVA? Only HALF.
why      Remember PART 1? You never cross the water from his shrine. / You walk up to it, and TURN BACK.
verse    It's all in one verse of the NARASIMHA PURANA.
kid      Next temple visit, COUNT THEM with your child.
ask      How many rounds do YOU do? Comment YOUR NUMBER!
```
Speech-to-text (saaras:v3) on every take came back word for word ("Devi", "Ganesha", "Surya", "Narasimha Purana").

```
Logline: Most of us walk round every god the same number of times; the Narasimha Purana gives each their own: Devi
         one, Ganesha three, Vishnu four, Surya seven, Shiva only half (Part 1's somasutra).
Hook:    Frame 0: the five-shrine courtyard at dusk from the south, the emblems glowing over the shrines, the
         PRADAKSHINA · PART 2 tag, the caption up.
World:   one courtyard at dusk; maps straight down from ~72 m (fog pushed back), orbits round each corner shrine.
Style:   3D (three.js under cine.js), Cinzel karaoke captions at y 1290 (1385 over the maps).
Card:    rkCardCine: MEET OUR GODS · Books 1–3 · set of 3 for ₹500 · rishikatha.com · Follow.
```

## Shots (times from the voice: src/scenes/rounds_tl.js)
| | time | shot |
|---|---|---|
| A | 0–3.1 | the courtyard from the south, high, drifting clockwise; the five emblems; the Part 2 tag |
| B | 3.1–5.9 | the map: three rings land round every shrine at once, the same chime each time, "3" by each |
| C | 5.9–9.6 | the rings fade; a "?" pops by each god in turn |
| D | 9.6–13.7 | Devi's shrine (NE): the trishul in light; one ring, "1" |
| E | 13.7–16.2 | Ganesha's (SE): three rings, the count climbing |
| F | 16.2–19.0 | Vishnu's (SW): the chakra; four rings |
| G | 19.0–24.0 | Surya's (NW): the sun; seven rings |
| H | 24.0–27.1 | the middle shrine: the linga in light, "½" |
| I | 27.1–30.7 | Part 1: the pranala pouring into the channel across the path; the stop lines glow |
| J | 30.7–33.8 | the middle shrine's map: footprints round to the channel, then back the other way |
| K | 33.8–36.9 | the whole map with every count; the verse in Devanagari over it |
| L | 36.9–40.5 | from the east gate, the temple bell rings, the camera rises over the courtyard |
| M | 40.5–44.1 | the map, every count pulsing: the ask |
| N | 44.1–51.3 | the card |

## Files
`src/scenes/rounds.js` (shots), `rounds_props.js` (courtyard, rings, emblems, counts, stop lines), `rounds_tl.js`,
`rounds_vo.js` (from the TTS tool), `rounds_cover.js` (the cover), `tools/rounds_vo.json`, `tools/rounds_sfx.mjs` →
`assets/rounds_sfx.wav`, `assets/rounds_mix.wav`. On main: shrine3's `court / soma / linga / lights` options (ceda27c).
`node render.mjs --frames --workers=2 && node render.mjs --encode --out=out/rounds_out/rounds.mp4` (21 ms a frame);
cover: `node render.mjs --page=cover.html --stills=0 --out=out/rounds_out` then rename `t0_00.png` to `cover.png`.
