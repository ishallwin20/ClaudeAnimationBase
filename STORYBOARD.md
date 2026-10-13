# No creature with 2 legs or 4 legs could kill him. Maa Durga's answer? SIX LEGS. (reel/bhramari-bees)

A Cinematic reel (see CINEMATIC_GUIDE.md), 65.7 s, 9:16. It's the first reel with a voiceover: an English narrator from
Sarvam TTS (v1; a Hindi v2 is planned to compare), a synthesized SFX track, and a Lyria score ducked under the voice.
It ends on a follow card with no offer. The owner wanted a fight with a Durga avatar that could go as viral as ad 15
(Ravana and the toe, 1M+ views); this one has the same shape: an unbeatable demon, then the god's teased "answer".

```
Logline: Arunasura prayed for 40,000 years (on leaves, then water, then air, then nothing) and Brahma gave him a boon:
         no weapon, nothing with two legs, nothing with four could kill him. He took heaven. His shield was the Gayatri
         mantra; Brihaspati tricked him into dropping it. The gods prayed to the Devi. One bee landed on his throne. He
         laughed: "A tiny bee?" Count its legs: SIX. Maa Durga came as Bhramari, the goddess of bees: "Not two legs.
         Not four." Millions of bees poured from her hands and hair; no boon could stop them. He feared every lion,
         every elephant. He never feared a bee. At Srisailam, devotees say you can still hear her bees.
Sources: the Devi Bhagavata Purana, Book 10, ch. 13 (Arunasura, the boon, the Gayatri, Brihaspati, the six-legged
         bees); the Srisailam and Kateel temple traditions (Bhramaramba; the bees heard behind the shrine is a belief,
         so the caption says "devotees say").
Why it should travel: ad 15's winning shape (SIX LEGS for ONE TOE), a loophole people share, a famous goddess in a form
         few know, a frame nobody has seen (a goddess made of bees), a countable moment (the six legs light up with
         numbers), a quotable line ("He never feared a BEE"), and a PLACE call-out.
Comment: "Have you been to SRISAILAM or KATEEL? Comment your city!" Pinned: "Name ONE more demon who lost to a LOOPHOLE 👇"
```

| time | shot | palette | voice / caption |
|------|------|---------|-----------------|
| 0.0–5.9 | **The hook.** Arunasura on his rock throne in a red storm, laughing; lightning. A gold bee zips past on "SIX LEGS". Frame 0 is finished, with the caption lit. | red storm | No creature with TWO legs or FOUR legs could kill him. → Maa Durga's answer? SIX LEGS. |
| 5.4–14.2 | **Tapas.** Cross-legged in a desert; days race (the sun and moon arc, a ticking speeds up); the Gayatri rises; leaves fall, a drop ripples, a gust; then stillness and stars. | dusk ↔ night | The demon Arunasura prayed to Brahma for FORTY THOUSAND years. → On leaves. Then water. Then air. Then NOTHING. |
| 13.7–18.6 | **The boon.** Brahma's lotus of light opens; three seals lock round him (a sword, two footprints, four hoofprints). | gold on black | Brahma granted it: no weapon, no two legs, no four legs. |
| 18.1–22.0 | **Heaven falls.** Amaravati burns in the clouds, the gods tumble, his horned head laughing in the corner. | fire | He stormed HEAVEN and threw the gods out. |
| 21.5–26.7 | **The shield.** He chants inside a turning ring of Gayatri letters; Brihaspati comes; the letters fall. | violet | His shield was the Gayatri mantra. → Brihaspati tricked him into dropping it. |
| 26.2–29.4 | Gods with halos kneel at night; a point of gold appears. | night violet | The gods prayed to the Devi. |
| 29.0–36.9 | **THE BEE.** It lands on the throne's arm; he laughs, out of focus behind. The camera pushes in; its legs light up 1 to 6. A sub drop on SIX. | dark, gold | "A tiny BEE?" → Count its legs. → SIX. |
| 36.4–40.1 | Specks across the dark gather into the Devi. | deep violet + gold | "Not two legs. Not four." (the Devi's voice) |
| 39.6–44.1 | Her face; her eyes open burning gold. | violet + gold | Maa Durga came as BHRAMARI, the goddess of bees. |
| 43.6–47.4 | Rivers of bees from her hands into the army. | red storm | From her hands, her hair: MILLIONS of bees. |
| 47.0–49.8 | The swarm engulfs him; he screams. | red storm | No boon could stop them. |
| 49.3–54.9 | Silence. The empty throne; his crown falls and rocks; one bee comes to it. | cold blue | He feared every lion, every elephant. → He never feared a BEE. |
| 54.4–58.8 | Srisailam at dawn: the gopuram, lamps, gold bees going home. | dawn gold | At Srisailam, devotees say you can still HEAR her bees. |
| 58.3–62.6 | Bhramari, calm, in a halo of bees. | violet + gold | Have you been to SRISAILAM or KATEEL? Comment your city! |
| 62.1–65.7 | The follow card: JAI MAA BHRAMARI, the Devi, "Stories of the Devi and the gods", Follow @therishikatha, rishikatha.com. Held, no fade. | teal | |

## Files
- Voice: `tools/bhramari_vo.json` → `node tools/sarvam_tts.mjs --script=tools/bhramari_vo.json` → `assets/bhramari_vo.wav` and
  `src/scenes/bhramari_vo.js` (each line's times and the karaoke word times). Narrator `girish_en_devotional` at pace 1.2;
  the Devi `aditi_en_stories` (reverb and an octave-down double); Arunasura `rustom_en_suspense`, pitched down. The raw
  takes are cached in `assets/vo/bhramari/` (a changed line is the only one re-requested).
- Timeline: `src/scenes/bhramari_tl.js` builds `TL` from `VO`; the scene and the SFX both read it.
- Scene: `src/scenes/bhramari.js`. New shared cast on `main`: `src/cine_devi.js` (the Devi), `src/cine_asura.js`
  (Arunasura), and in `src/cine_sets.js` the bees, `swarm()`, the macro `bee()`, `throne()`, `lotusLight()`.
- Sound: `tools/bhramari_sfx.mjs` → `assets/bhramari_sfx.wav`, then the mix: the voice on top, the score
  (`assets/bhramari_score.mp3`, Lyria take 1 of 2, 66 s of music then silence) shaped by a level curve (near silence for
  the bee, low under the swarm's hum, almost nothing at the empty throne; Lyria played through the silences the brief
  asked for) and side-chain ducked under the voice, the SFX at .85, `loudnorm` −14 LUFS → `assets/bhramari_mix.wav`;
  also `assets/bhramari_vo_sfx.wav` (no score).
- Score brief: `tools/bhramari_score.txt`.

## Render
```sh
node tools/sarvam_tts.mjs --script=tools/bhramari_vo.json
node tools/bhramari_sfx.mjs
node render.mjs --clip --out=out/bhramari.mp4                                   # voice + SFX + score (PROJECT.audio)
ffmpeg -i out/bhramari.mp4 -i assets/bhramari_vo_sfx.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/bhramari_vo_sfx.mp4
ffmpeg -i out/bhramari.mp4 -map 0:v -c:v copy out/bhramari_silent.mp4
```

## Instagram caption
```
No creature with 2 legs or 4 legs could kill him. So Maa Durga came with SIX. 🐝

Arunasura prayed for 40,000 years (on leaves, then water, then air, then nothing) until Brahma gave him a boon: no
weapon, nothing with two legs, nothing with four could kill him. He threw the gods out of heaven.

So the Devi came as BHRAMARI, the goddess of black bees. Millions of six-legged bees poured from her hands and hair,
and no boon could stop them. He feared every lion and every elephant. He never feared a bee.

At Srisailam she is worshipped as Bhramaramba, and devotees say you can still hear her bees behind the shrine.
(Devi Bhagavata Purana, Book 10)

Have you been to SRISAILAM or KATEEL? Comment your city! 👇
Save this for Navratri, and share it with someone who loves the Devi's stories. 🙏

More stories of the Devi and the gods: follow @therishikatha · rishikatha.com (link in bio)

#bhramari #maadurga #durgamaa #navadurga #srisailam #bhramaramba #kateel #devibhagavatam #hindumythology #sanatandharma #jaimatadi #mythologystories #indianmythology #reelsindia #rishikatha
```
