# The day the SUN went out. Who saved the world? (ad/16-book4-sun)

A Cinematic reel (see CINEMATIC_GUIDE.md), 60.7 s, 9:16, and the launch ad for Book 4 (Kushmanda, out 16 Oct 2026 at
₹200). Idea from the owner's wife: the sun goes out, the story of Mali and Sumali, and a cliffhanger, "Who did Shiva ask
to become the sun?", answered only by the card, which unveils the Book 4 cover. Voiced like reel/bhramari-bees: the same
Sarvam voices (no new auditions), a Lyria score ducked under the voice, synthesized SFX.

```
Logline: Mali and Sumali, rakshasa brothers and devotees of Shiva, were burned to ashes by Surya. Shiva, furious,
         hurled his trishul at the sun; Surya fell unconscious and the world went dark and cold. Surya's father
         Kashyapa cursed Shiva: one day your son will lose his head (that is why Ganesha has an elephant head). The world
         needed a new sun: Shiva turned to ONE goddess. She stepped out of the light and wrapped the earth in warmth.
         Who was she? Find out in Book 4 (the card: KUSHMANDA, new, 16 Oct).
Sources: the Brahma Vaivarta Purana (Mali and Sumali, Shiva's trishul, Surya unconscious, Kashyapa's curse and Ganesha's
         head); Book 4 of the Navadurga series for Kushmanda's light ("wrapped around the earth like a big, cozy blanket").
Why it should travel: a hook nobody has seen (a black sun over a frozen world), a god striking the sun, a famous-name
         twist people share (why Ganesha has an elephant head), and a question held to the end with the answer on the card.
Comment: "Who did Shiva ask to become the sun? Comment your guess!" (in the reel). Pinned: "Did you know this is why
         Ganesha has an elephant head? 🐘"
```

| time | shot | palette | voice / caption |
|------|------|---------|-----------------|
| 0.0–4.8 | **The hook.** A dead black sun with a cold corona over a frozen plain, huts, frost, snow. Frame 0 is finished, the caption lit. | cold blue | The day the SUN went out... → Who saved the world from the cold and the dark? |
| 4.3–9.6 | **The devotees.** Mali (slate blue) and Sumali (red-brown) in tapas, namaste, either side of a lamp-lit linga. | lamp orange | Two rakshasa brothers, *Mali* and *Sumali*, → were great devotees of *Shiva*. |
| 9.2–11.6 | **Surya** blazing in his sun disc over cracking land. | molten gold | But *Surya*, the sun god, |
| 11.2–13.7 | The brothers go white-hot, then grey, and crumble into ash and embers. | white-hot → ash | burned them to ASHES. |
| 13.3–15.5 | **Fury.** Shiva's face; the eyes snap open, then the third eye; lightning. | storm blue + orange | *Shiva* was furious. |
| 15.2–18.3 | **The trishul** streaks from the dark to the sun: a white flash, shock rings, the sun cracks. | night red | He hurled his *trishul* at the sun. |
| 18.0–19.7 | Surya's face, his eyes closing, the cracked sun behind. | dim gold | *Surya* fell unconscious. |
| 19.4–22.2 | The sun falls out of the sky like a meteor; darkness sweeps the land. | dusk → black | The world went DARK. |
| 21.8–26.5 | **The cold.** The lamps go out, frost creeps, the river freezes, the flowers droop. | blue-black | Then cold. → Rivers froze. Flowers died. |
| 26.0–34.0 | **The curse.** Kashyapa's silhouette on a cliff, pointing; lightning on "cursed" and "head"; push in. | violet storm | Surya's father, *Kashyapa*, cursed *Shiva*: → "One day, YOUR son will lose his head!" (a second voice) |
| 33.5–37.2 | **Ganesha** drawn in gold lines of light. | gold on black | That is why *Ganesha* has an elephant head. |
| 36.7–41.5 | Shiva alone on a dark ledge under black Kailash; a point of light appears. | cold blue | The world needed a new sun. → *Shiva* turned to ONE goddess. |
| 41.1–45.5 | **She steps out** of a blinding light: an eight-armed silhouette; the land turns gold, the frost melts, the flowers open. | gold dawn | She stepped out of the light, → and wrapped the earth in warmth. |
| 45.0–50.2 | Her silhouette in the sun's halo (no face: the answer is kept for the card). | dawn | Who did *Shiva* ask to become the SUN? → Comment your guess! |
| 49.8–60.7 | **The card** (a white flash): FIND OUT IN BOOK 4, the KUSHMANDA cover with NEW · 16 OCT, "Book 4 · ₹200 · ships 16 Oct", Books 1–3 in a row, "Books 1–3 out now: set of 3 for ₹500", rishikatha.com, Follow @therishikatha. Held, no fade. | teal | (voice only) Find out in Book 4 of the Navadurga series, shipping from 16 October. Books 1 to 3 are out now. |

## Files
- Voice: `tools/surya_vo.json` → `node tools/sarvam_tts.mjs --script=tools/surya_vo.json` → `assets/surya_vo.wav` and
  `src/scenes/surya_vo.js`. Narrator `girish_en_devotional` at pace 1.2; Kashyapa's curse `rustom_en_suspense` (pace .95,
  no fx). Every take checked with Sarvam STT (`saaras:v3`); "Two rakshasa" came back "Guru Rakshas", so that line's `tts`
  spells it "Raakshasa". Raw takes in `assets/vo/surya/`.
- Timeline: `src/scenes/surya_tl.js` builds `TL` from `VO`; the scene and the SFX both read it.
- Scene: `src/scenes/surya.js`, props `src/scenes/surya_props.js` (the eight-armed silhouette `devi8`, `flower`/`flowerBed`,
  `huts`). New shared code on `main`: `src/cine_surya.js` (Surya, `suryaHead`), `arunasura({ pal })` for Mali and Sumali,
  and in `src/cine_sets.js` `sunDisc`, `trishulProp`, `frost`, `ganeshaLine` and `rkCardCine({ hero })`.
- Sound: `tools/surya_sfx.mjs` → `assets/surya_sfx.wav`, then the mix: the voice on top, the score
  (`assets/surya_score.mp3`, Lyria take 2 of 3, its first 61 s; take 1 ran 150 s stretched, take 3 put its silence in
  the wrong place) on a level curve (near silence for the frozen world, low at the plea, full as she steps out),
  side-chain ducked under the voice, the SFX at .85, `loudnorm` −14 LUFS → `assets/surya_mix.wav`; also
  `assets/surya_vo_sfx.wav` (no score). Score brief: `tools/surya_score.txt`.

## Render
```sh
node tools/sarvam_tts.mjs --script=tools/surya_vo.json
node tools/surya_sfx.mjs
node render.mjs --clip --out=out/surya.mp4                                   # voice + SFX + score (PROJECT.audio)
ffmpeg -i out/surya.mp4 -i assets/surya_vo_sfx.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/surya_vo_sfx.mp4
ffmpeg -i out/surya.mp4 -map 0:v -c:v copy out/surya_silent.mp4
```

## Cover
`cover.html` (studio.html + `src/scenes/surya_cover.js`): the black sun over the frozen land, "THE DAY THE / SUN WENT
OUT" and "WHO SAVED / THE WORLD?", inside the 3:4 grid crop (y 240–1680).
`node render.mjs --page=cover.html --stills=0 --out=out/surya_cover`

## Instagram caption
```
What happened the day the SUN went out? ☀️🌑 Who saved the world from the cold and the dark?

Mali and Sumali, two rakshasa brothers, were great devotees of Shiva. Surya, the sun god, burned them to ashes. Shiva
was furious: he hurled his trishul at the sun, and Surya fell unconscious. The world went dark. Rivers froze. Flowers
died.

Surya's father, Kashyapa, cursed Shiva: "One day, your son will lose his head." 🐘 That is why Ganesha has an elephant
head! (Brahma Vaivarta Purana)

The world needed a new sun, and Shiva turned to ONE goddess. Who did he ask to become the sun? 🔥
Find out in Book 4 of our Navadurga series, launching 16 October (₹200).
Books 1–3 are out now: the set of 3 for ₹500. Order at rishikatha.com (link in bio) 📚

Comment your guess before you watch the end! 👇 Save this, and share it with someone who loves Shiva's stories. 🙏

#suryadev #shiva #mahadev #ganesha #kushmanda #navadurga #navratri #maadurga #hindumythology #sanatandharma #puranas #mythologystories #indianmythology #kidsbooks #rishikatha
```
