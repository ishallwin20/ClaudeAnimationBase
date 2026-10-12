# Ad 15: "RAVANA lifted Kailash with SHIVA on it" (Cinematic · Books 1–3 · 65.4 s)

This is a captioned explainer in the **Cinematic** style ([CINEMATIC_GUIDE.md](CINEMATIC_GUIDE.md)). It tells the Uttara
Kanda story of Ravana lifting Mount Kailash and Shiva pressing it down with one toe, and the popular tradition that the
**Shiv Tandav Stotram** was born under that mountain. There is no voice. The captions tell it, synthesized SFX carry the
hits, and a Lyria 3 Pro score sits underneath. It ends on the Books 1–3 card (set of 3 for ₹500).

```
Logline: RAVANA lifted Kailash with SHIVA on it. Shiva's answer? ONE TOE. Ravana had stolen the Pushpak; over Kailash it
         stopped. Nandi blocked the way, Ravana laughed, and Nandi cursed him: monkeys will burn your Lanka. So Ravana
         put twenty arms under the mountain and lifted it. Parvati held on; Shiva didn't open his eyes. He pressed down
         with one toe, and twenty arms were crushed. Ravana's scream shook the three worlds and became his name, RAVANA,
         "the one who roars". Trapped, he sang to Shiva for a thousand years: the Shiv Tandav Stotram. Shiva forgave
         him and gave him the sword Chandrahas. Nandi's curse came true: Hanuman set Lanka on fire.
Why it should travel: it is ad 14's winning shape (a villain, a famous god, a tease of the "answer"). It has a
         two-second flex everyone shares (ONE TOE), three "never knew that" facts (where his name and the stotram come
         from, and that Nandi's curse is why Hanuman burned Lanka), the most-heard Shiva song in India, and a NAME
         call-out (the best comment lever so far: ad 14 got 58 comments, Shiva Tandav 50).
Comment: "Is your name SHIVA, SHANKAR, MAHESH or RUDRA? Comment it!" Pinned: "Type the FIRST LINE of Shiv Tandav without
         Google 🔱".
```

| time | shot | palette | caption |
|------|------|---------|---------|
| 0.0–5.3 | **The hook.** Ravana under Kailash, holding it up on an arch of twenty arms (the Ellora composition); Shiva a speck of blue light on the summit; storm, lightning, falling rock. Frame 0 is finished, with the caption lit. | red storm | RAVANA lifted / KAILASH / with SHIVA on it. → Shiva's answer? / ONE TOE. |
| 5.0–10.2 | The Pushpak flies in at dusk and jolts to a stop at 8.6 against an invisible wall (a ripple at the prow). | dusk gold | Ravana had stolen / a flying chariot: / the Pushpak. → Over Kailash, / it suddenly STOPPED. |
| 9.8–14.6 | Nandi, the great white bull, on a rock before Kailash; the Pushpak hovers. | violet dusk | Nandi / blocked the way. → "No one flies / over Mahadev." |
| 14.2–17.5 | Ravana close on his deck, all ten heads laughing, weapons fanned. | dusk | Ravana LAUGHED / at him. |
| 17.2–20.3 | A push in on Nandi's face; his eyes flare gold (18.1). | violet | Nandi cursed him: / "MONKEYS will / burn your Lanka." |
| 20.0–25.4 | He crouches, grips (21.6) and lifts (22.4–24.6). The mountain rises off a glowing scar; rocks fall; a flash as it tears free. | red storm | So Ravana decided / to LIFT the mountain. → All TWENTY arms. / Kailash rose / into the sky. |
| 25.0–29.8 | The summit tilts in the storm, snow sliding off. Parvati clutches Shiva's arm, and Shiva sits in a calm blue glow. | red storm | Parvati grabbed / Shiva's arm. → Shiva didn't even / open his eyes. |
| 29.4–33.7 | **ONE TOE.** Shiva's blue foot on snow. The big toe presses (30.6–31.6) and lights up; a boom and rings of light at 31.6. | night blue | He pressed down / with ONE TOE. |
| 33.4–37.7 | The slam (33.65): white flash, a dust wall, a big shake. Ravana is crushed onto his knees, his arms folded under the cave. | red storm | Twenty arms, / crushed under / the mountain. |
| 37.4–43.4 | The roar: ten heads screaming under the mountain's underside, with shock rings and falling stars. | red | His SCREAM shook / the three worlds. → That scream became / his name: RAVANA, / "the one who roars." |
| 43.0–50.8 | Night as the moon crosses: ages pass. Ravana is pinned in a cave at the foot of Kailash, singing; the stotram's first verse rises in glowing Devanagari. | night | Trapped, he sang / to Shiva for a / THOUSAND years. → That song is the / SHIV TANDAV / STOTRAM. → Yes. Ravana / wrote it. |
| 50.4–54.6 | Dawn: Ravana bows; the crescent sword Chandrahas descends to him. | dawn gold | Shiva forgave him / and gave him the / sword Chandrahas. |
| 54.2–58.0 | Lanka burns. Hanuman leaps across, his tail on fire. | fire | And Nandi's curse? / Hanuman set / Lanka on fire. |
| 57.6–61.7 | Kailash at dusk with Shiva seated on top. | dusk | Is your name SHIVA, / SHANKAR, MAHESH / or RUDRA? / Comment it! |
| 61.2–65.4 | `rkCardCine`: HAR HAR MAHADEV, "Parvati's story begins in Book 1", covers, Books 1–3 · set of 3 for ₹500, rishikatha.com, Follow. Held, with no fade. | teal | |

## Files
- Scene: `src/scenes/ravana_kailash.js` (times in `TL`; `liftSet()` draws shots 1, 6 and 9 from Ravana's arch of hands, `ravanaArch()`).
- New shared Cinematic cast (on `main`):
  - `src/cine_ravana.js`: Ravana, ten heads, twenty arms; stand, lift, pinned and bow poses; calm, smirk, laugh, scream, sing and grit faces.
  - `src/cine_cast.js`: `nandiStanding`, `pushpak`, `shivaFoot`, `parvatiCling`, `hanumanLeap`.
  - `src/cine_sets.js`: `uprooted`, `debris`, `shockRings`, `lanka`, `stotram`.
- Sound:
  - `tools/ravana_kailash_sfx.mjs` → `assets/ravana_kailash_sfx.wav` (new kit instruments `roar` and `rockfall` in `tools/sfx.mjs`).
  - It then mixes `assets/ravana_kailash_score.mp3` → `assets/ravana_kailash_mix.wav`, at score volume .38 and loudnorm −15 LUFS. The score is cut at 57.6 s and crossfaded into its own fade-out at 81 s.
- The score: one `google/lyria-3-pro-preview` generation on OpenRouter ($0.08; it needs `stream: true` and `modalities: ['audio', 'text']`). It came back as a 92.7 s MP3 that followed the timestamped prompt: a dip at 31 s, a hit at 32 s, and "Har Har Mahadev" chanted at 43 and 48.5 s.

## Render
```sh
node tools/ravana_kailash_sfx.mjs
node render.mjs --clip --out=out/ravana_kailash.mp4                       # score + SFX (PROJECT.audio)
ffmpeg -i out/ravana_kailash.mp4 -i assets/ravana_kailash_sfx.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/ravana_kailash_sfx.mp4
ffmpeg -i out/ravana_kailash.mp4 -map 0:v -c:v copy out/ravana_kailash_silent.mp4    # for music in Edits
```
