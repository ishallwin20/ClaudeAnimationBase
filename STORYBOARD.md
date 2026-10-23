# "Shiva appeared as LIGHT in 12 places in India." (ad 43 · Books 1–3 · 15K Family Deal card · the fourth 3D reel)

A 74.5 s explainer in the **3D** style, made for a trial reel. The relief map of India (`src/cine3d_india.js`, Survey of
India borders) shows the twelve Jyotirlingas as pillars of light. A cosmic void holds the pillar of fire, the ad 31 shrine
the linga, and the ad 42 Palk Strait set Rameswaram. English VO (Sarvam `girish_en_devotional`, pace 1.2) with karaoke
captions timed to the voice and SFX under it; music is added on Instagram. The comment levers are a place call-out
("Which Jyotirlinga is closest to YOUR city?") and the two contested sites. The sequel to ad 42: Rameswaram is where Ram
worshipped Shiva before the war.

## Facts used
| claim in the reel | source |
|---|---|
| Brahma and Vishnu argued who is greater; a pillar of fire with no end rose between them; Brahma flew up as a swan, Vishnu went down as a boar; neither found its end | Shiva Purana, Vidyeshvara Samhita 6–8; Wikipedia, "Jyotirlinga" (Legend) |
| The pillar was Shiva: a linga of light, a jyotirlinga | Shiva Purana, Vidyeshvara Samhita; Wikipedia, "Jyotirlinga" ("Shiva pierced the three worlds, appearing as a huge, infinite pillar of light, the jyotirlinga") |
| The Shiva Purana names twelve, in this order: Somnath, Mallikarjuna, Mahakal, Omkareshwar, Kedarnath, Bhimashankar, Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Rameswaram, Grishneshwar | Shiva Purana, Kotirudra Samhita 1 (Somanatha in Saurashtra … Ghushmesha in Shivalaya); stories in chapters 14–33 |
| Their places and states | Wikipedia, "Jyotirlinga" (the table of the twelve) |
| Kedarnath is 3,583 m up in the Himalaya | Wikipedia, "Kedarnath Temple" (elevation 3,583 m) |
| At Rameswaram, Ram worshipped Shiva before the war | Shiva Purana, Kotirudra Samhita 31 (Rama makes a parthiva linga and worships Shiva, who grants him victory over Ravana) |
| Vaidyanath is argued over (Deoghar vs Parli); Nageshwar is claimed by Dwarka, Aundha Nagnath and Jageshwar | Wikipedia, "Jyotirlinga" (disputed locations); the Dvadasha Jyotirlinga Stotram's "Paralyam Vaidyanatham" |

Left out on purpose: the Ketaki flower and Brahma's curse (good, but no room); the viral "all twelve on one straight
line / on the same longitude" claim (false); temple-architecture claims; the Bhimashankar (Assam) claim (less widely cited).
Performance only (no claim): the void, the orbs for Brahma and Vishnu, the pillars of light standing at the sites, the
map's exaggerated relief, the count 1–12.

## Voiceover (tools/jyoti_vo.json; captions are the script)
```
hook    SHIVA appeared as LIGHT in 12 PLACES in India.
you     How many have YOU been to?
argue   BRAHMA and VISHNU once argued: who is greater?
pillar  Between them rose a pillar of FIRE with no end.
search  Brahma flew UP as a swan. Vishnu dug DOWN as a wild boar. But neither found its end.
shiva   The pillar was SHIVA: a linga of light, a JYOTIRLINGA.
purana  The SHIVA PURANA names twelve places where he shines:
n1–n4   SOMNATH, MALLIKARJUNA, MAHAKAL, / OMKARESHWAR, KEDARNATH, BHIMASHANKAR, / KASHI VISHWANATH, TRIMBAKESHWAR, VAIDYANATH, / NAGESHWAR, RAMESWARAM, GRISHNESHWAR.
kedar   From KEDARNATH, 3,583 metres up in the Himalaya,
rames   to RAMESWARAM by the sea, where RAM worshipped Shiva before the war.
debate  Two of them are still argued over. VAIDYANATH: Deoghar vs Parli. NAGESHWAR: Dwarka, Aundha and Jageshwar all claim it.
ask     Which JYOTIRLINGA is closest to YOUR city? Comment it!
```
Speech-to-text (saaras:v3) on the takes: all twelve names came back right. "Boar" came back as "bow" and "Neither" as
"Nita" (fixed with "a wild boar", "But neither"). "Deoghar or Parli" came back as "Deoghar aur Parli", which means
"Deoghar AND Parli" to a Hindi ear, so the line became "Deoghar, versus Parli".

## Shots (times from the voice: src/scenes/jyoti_tl.js)
| | time | shot |
|---|---|---|
| A | 0–6.0 | India at dusk from space, twelve pillars of light, the border glowing; the count 1–12 pops on "YOU" (frame 0: the caption up) |
| B | 6.0–20.8 | the void: gold Brahma and blue Vishnu; the pillar of fire erupts; Brahma rises, Vishnu sinks; far back, no end either way |
| C | 20.8–25.3 | the ad 31 shrine at night: the linga, light rising from it (the pot hidden), ज्योतिर्लिङ्ग |
| D | 25.3–42.5 | India: शिव पुराण, then a pillar rises at each site as it is named, its name and state beside it, n / 12 |
| E | 42.5–47.9 | Kedarnath's pillar in the golden Himalaya, 3,583 m |
| F | 47.9–53.0 | Rameswaram on the Palk Strait set, its pillar rising, the shoals' gold line |
| G | 53.0–62.3 | India: Vaidyanath (Deoghar? Parli?), then Nageshwar (Dwarka? Aundha? Jageshwar?) flickering |
| H | 62.3–67.0 | the ask: all twelve shining |
| I | 67.0–74.5 | the 15K Family Deal card |

## Files
`src/scenes/jyoti.js` (shots), `jyoti_props.js` (the twelve and the claimants, labels, the void and its pillar of fire,
the deal card), `jyoti_tl.js`, `jyoti_vo.js` (written by the TTS tool), `jyoti_cover.js`, `tools/jyoti_vo.json`,
`tools/jyoti_sfx.mjs` → `assets/jyoti_sfx.wav`, `assets/jyoti_mix.wav`.
`rm -rf out/frames && node render.mjs --frames --workers=1 && node render.mjs --encode --out=out/jyoti_out/jyoti.mp4`.
