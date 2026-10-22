# "Why did Hanuman bring the WHOLE MOUNTAIN?" (ad 32 · Books 1–3 · 15K Family Deal card)

A 62.9 s Painted explainer for the main followers, told as **Valmiki** tells it (the owner's pick over the Manas), with
an English voiceover (Sarvam `girish_en_devotional`, pace 1.2), captions in **Bangers** timed to the voice, SFX under
it (music added on Instagram). The story everyone knows (Lakshman falls, Hanuman brings the mountain), with the twist
most people don't: in Valmiki it was his *second* mountain.

## Facts used (Valmiki Ramayana, Yuddha Kanda; Gita Press / valmikiramayan.net numbering)
| claim in the reel | source |
|---|---|
| Ravana hurls a spear made by Maya, hung with eight loudly ringing bells | Yuddha 100.30–31 ("adorned with eight loudly clamouring bells, designed by Maya the demon") ([valmikiramayan.net](https://sanskritdocuments.org/sites/valmikiramayan/yuddha/sarga100/yuddhaitrans100.htm)) |
| It strikes Lakshman in the chest; he falls | Yuddha 100.34 (*mamajja urasi*: it sank into his chest) |
| Ram pulls it out and breaks it | Yuddha 100.43 (*vicakarṣa … babhañja ca*) |
| Ram weeps: "What will I tell mother Sumitra?" | Yuddha 101 ([prose](https://www.sanskritdocuments.org/sites/valmikiramayan/yuddha/sarga101/yuddha_101_prose.htm)) |
| Sushena (the vanara physician): his face hasn't darkened; he's alive | Yuddha 101 ("His countenance is not changed, nor has it become dark … the repeatedly beating heart") |
| Sushena sends Hanuman for four herbs from Mount Mahodaya | Yuddha 101 (Mahodaya; Vishalyakarani, Savarnyakarani, Sanjivakarani, Sandhanakarani) |
| Hanuman can't tell the herbs apart, shakes the peak three times and brings the whole peak | Yuddha 101 ("shaking it violently for three times and uprooting the mountain-peak") |
| Sushena crushes the herbs; Lakshman breathes them in and rises | Yuddha 101 (given through the nose; he rises freed of the spear and the pain) |
| It was his second mountain: the first time, the herbs hid from him, so he took that mountain too, and afterwards carried it back | Yuddha 74 (after Indrajit's Brahmastra; Jambavan sends him; the herbs "disappeared from Hanuma's view"; he uproots the mountain; the army revives on its fragrance; "carried away that mountain of herbs quickly back to the mountains of Himalayas") ([prose](https://www.sanskritdocuments.org/sites/valmikiramayan/yuddha/sarga74/yuddha_74_prose.htm)) |

Not claimed: the Manas details (Meghnad's shakti, Sushen brought from Lanka with his house, Kalanemi, Bharat's arrow,
the dawn deadline); the herbs' colours; Lakshman's blood (Valmiki has it; the reel keeps it bloodless).
Performance only: Ravana's ten heads grinning, the bells swinging, Ram's tears, the heart over Lakshman's chest, the
thought bubble of four herbs, Hanuman's "?" and head scratch, the herbs ducking with little eyes, his steam, the
smug dusting of hands, the sepia flashback, the second mountain in his other hand.

## Voiceover (tools/sanj_vo.json; captions are the script)
```
hook   Why did Hanuman bring the WHOLE MOUNTAIN?
spear  In Valmiki's Ramayana, Ravana hurls a spear made by Maya, ringing with eight bells.
fall   It strikes Lakshman in the chest. He falls.
ram    Ram pulls it out and breaks it, then weeps: "What will I tell mother Sumitra?"
sush   The vaidya Sushena looks closer: his face hasn't darkened. He's alive!
herbs  Bring four herbs from Mount Mahodaya. Go, Hanuman!
same   But up there, Hanuman can't tell one herb from another.
lift   So he shakes the peak three times, and brings the whole thing!
wake   Sushena crushes the herbs. Lakshman breathes them in, and rises!
twist  And most people don't know: this was his SECOND mountain.
hid    The first time, the herbs HID from him. So he took that mountain too, and later carried it back!
ask    Did you know Hanuman did it twice? Comment YES or NO!
```
Speech-to-text (saaras:v3) came back "Valmiki's Ramayana", "Ravana", "Maya", "Sumitra", "Sushena", "Mount Mahodaya".

## Shots (times from the voice: src/scenes/sanj.js)
| | time | shot |
|---|---|---|
| A | 0–2.5 | Hanuman flying through a warm sky, the herb peak held up overhead (frame 0, the hook caption up) |
| B | 2.5–8.7 | Lanka at dusk: Ravana raises the spear; push in on the bells as they ring; he hurls it |
| C | 8.7–11.8 | the spear flies in, strikes Lakshman's chest (a flash); he topples back on "falls" |
| D–F | 11.8–25.8 | the camp at nightfall: Ram pulls the spear out and snaps it, weeps; Sushena hops in, leans close, the face glows, a heart beats; "He's alive!"; a bubble of four herbs; Hanuman steps in, crouches and launches on "Go" |
| G–H | 25.8–33.7 | the Himalaya at night: he drops onto the herb peak, looks left, right, "?", scratches his head; grips it, three shakes, tears it loose, lifts it overhead and flies |
| I | 33.7–39.4 | the camp at night, the peak set down glowing: Sushena grinds, holds a leaf to Lakshman's nose; he breathes, opens his eyes and springs up |
| J | 39.4–43.6 | Hanuman with the peak on one palm; on "SECOND" a second (sepia) peak pops into his other hand |
| K | 43.6–49.7 | sepia flashback (Yuddha 74): the herbs see him and duck; he steams; takes the mountain; sets it back down and dusts his hands |
| L | 49.7–55.3 | Hanuman sitting on top of the peak, grinning: the ask |
| M | 55.3–62.9 | the 15K Family Deal card |

## Files
`src/scenes/sanj.js` (shots), `sanj_props.js` (sets, the spear of bells, herbs, the herb peak, the mortar, Sushena,
the deal card), `sanj_vo.js` (written by the TTS tool), `sanj_cover.js` (the cover), `tools/sanj_vo.json`,
`tools/sanj_sfx.mjs` → `assets/sanj_sfx.wav`, `assets/sanj_mix.wav`.
