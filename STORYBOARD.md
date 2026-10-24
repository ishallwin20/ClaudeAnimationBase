# "Every time you say SWAHA, you're calling a GODDESS." (ad 49 · Books 1–3 · 15K Family Deal card · 3D)

A 68.2 s "Why do Hindus…?"-format explainer in the **3D** style, the follow-up to ad 31 (pradakshina), the owner's pick
of five pitches (24 Oct 2026): an everyday act, a sourced fact almost nobody knows, then "Did you know? YES or NO".
A havan at night in the shrine's courtyard (`src/cine3d_havan.js`, new on main, in front of `shrine3`), the camera as
the devotee; Svaha appears as a vision in the flames (the Devi's head from `cine_devi.js`, lit by the fire, 2D over 3D).
English VO (Sarvam `girish_en_devotional`, pace 1.2), karaoke captions from the voice, SFX under it (music on Instagram).

## Facts used
| claim in the reel | source |
|---|---|
| "Svāhā" is said with each offering into the fire; "agnaye svāhā", to Agni | Yajur Veda formulas (deity in the dative + svāhā: *agnaye svāhā*, *somāya svāhā*); Wikipedia, "Svaha" |
| It's said at havans, weddings, griha pravesh | the vivaha homa and the griha pravesh homa both offer into the fire with svāhā (common practice) |
| The Devi Bhagavatam says Svaha is a goddess | Devi Bhagavata Purana 9.43 ("On the story of Svaha"), tr. Swami Vijnanananda ([sacred-texts](https://sacred-texts.com/hin/db/bk09ch43.htm)) |
| Once, the offerings never reached the gods; they went hungry | 9.43: the Devas "did not get the offerings of the clarified butters … They all brought to the notice of Brahma the scarcity about their food" |
| Brahma prayed, and from the Devi came a goddess, Svaha | 9.43: Brahma meditated on Krishna, who told him to worship Mula Prakriti; "from the part of Prakriti" Svaha appeared |
| She became Agni's power to burn, and his wife | 9.43: Brahma: "Let Thou be the burning power of Fire"; Krishna: "be the Energy of Fire and be His wife"; Fire married her with mantras |
| End the offering with her name and it reaches the gods | 9.43: "At the conclusion of any Mantra, whoever taking Thy name, will pour oblations in the Fire to the Gods, will cause those oblations to go to the Gods and reach them" |
| A mantra without Svaha is a snake without poison | 9.43: "all the mantras without 'Svaha' in the end became impotent as snakes become when void of poison" |
| Svadha, said when offering to the ancestors, is a goddess | 9.44: Brahma advised "whenever they would offer anything to the Pitris, they should offer duly with the mantra Svadha pronounced at the end"; she is the Pitris' wife |
| Dakshina, the gift to the priest, is a goddess | 9.45 ("On the anecdote of Dakshina"): born from Lakshmi's shoulder, wife of Yajna; "that Karma only gets fruits where Dakshinas are paid" |

Left out on purpose: Svaha's tapas for Krishna and his boon (she'd be his wife as Nagnajiti in the next kalpa), her
three sons (the Dakshina, Garhapatya and Ahavaniya fires), the Mahabharata's Svaha (Vana Parva: she takes the forms of the
rishis' wives, Skanda's birth), the etymology "su + āha, well said", and the punishments for withholding dakshina.
Performance only (no claim): the gold lights spiralling up to the stars (the offering reaching the gods), the dull red
fire and failed sparks (the gods hungry), Svaha's face in the flames, the rangoli, the floating ladle and lota.

## Voiceover (tools/swaha_vo.json; captions are the script)
```
hook   Every time you say SWAHA, you're calling a GODDESS.
said   At every HAVAN, every wedding, every griha pravesh.
veda   In the VEDAS, it ends every offering: AGNAYE SWAHA. To Agni, swaha.
name   But the DEVI BHAGAVATAM says Swaha is a NAME.
hungry Once, the offerings never reached the gods. The GODS went hungry.
appear BRAHMA prayed, and from the Devi came a goddess: SWAHA.
agni   She became AGNI'S power to burn, and his wife.
rule   Brahma's rule: end the offering with her name, and it reaches the GODS.
snake  A mantra without SWAHA, says the Purana, is a snake without poison.
others And she isn't alone. SWADHA: the name we say when we feed our ancestors. DAKSHINA: the gift to the priest. Both are goddesses as well.
kid    Next havan, tell your child whose name they're saying.
ask    Did you know SWAHA was a goddess? Comment YES or NO!
```
Speech-to-text (saaras:v3) on the takes: "Swaha", "Devi Bhagavatam", "Swadha", "Dakshina", "grihapravesh", "Agnaya Swaha".
"Both are goddesses too" came back "…goddesses. Two." (a pause before "too"), so it says "as well".

## Shots (times from the voice: src/scenes/swaha_tl.js)
| | time | shot |
|---|---|---|
| A | 0–3.7 | close on the fire, the ladle over it; it tips on "SWAHA", the ghee runs, the fire flares |
| B | 3.7–7.6 | a slow orbit on the south side: the kund, the rangoli, the shrine; a flare on havan, wedding, griha pravesh |
| C | 7.6–13.7 | low, by the ladle; *अग्नये स्वाहा* (Yajur Veda) burns in; flares on both "swaha"s |
| D | 13.7–17.6 | the flames rising; *देवी भागवत पुराण*, then *स्वाहा* big on "NAME", a gold flash |
| E | 17.6–22.6 | the fire dull and smoky; an offering fizzles, its sparks die low; the camera tilts up into an empty starry sky |
| F | 22.6–27.3 | the fire turns gold; Svaha's face rises out of the flames on "goddess", a flash on "SWAHA" |
| G | 27.3–31.2 | she stays; the fire surges on "burn"; she fades into the flames on "wife" |
| H | 31.2–36 | an offering with her name: gold lights spiral up; the camera follows them to the stars on "GODS", a flash |
| I | 36–41.1 | an offering without her: a dead fizz, smoke |
| J | 41.1–46 | the tarpan plate: water and black sesame on kusha grass; *स्वधा* |
| K | 46–48.4 | the dakshina plate: coins on a betel leaf glinting; *दक्षिणा* |
| L | 48.4–51.2 | straight down: the three, each with its name |
| M | 51.2–55.3 | wide, the lights rising from the fire |
| N | 55.3–60.6 | close on the fire, *स्वाहा*, the ask; a flare on "YES" |
| O | 60.6–68.2 | the 15K Family Deal card |

## Files
`src/scenes/swaha.js` (shots), `swaha_props.js` (offerings, stars, Devanagari lettering, Svaha's vision, the deal card),
`swaha_tl.js` (the timeline from the voice), `swaha_vo.js` (written by the TTS tool), `swaha_cover.js` + `cover.html`,
`tools/swaha_vo.json`, `tools/swaha_sfx.mjs` → `assets/swaha_sfx.wav`, `assets/swaha_mix.wav`.
`node render.mjs --frames --workers=2 && node render.mjs --encode --out=out/swaha_out/swaha.mp4` (21 ms a frame).
