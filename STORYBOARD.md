# "There is one dance even the gods fear": Shiva's Tandava, Sati and the Shakti Peethas (62 s)

A captioned explainer in a new look, the "cinematic motion comic": flat vector figures with semi-realistic
proportions, lit like film (gradient skies, drifting clouds, haze, god rays, rim light, bloom, vignette, film grain,
lightning), slow camera pushes, crossfades and flashes between shots, and karaoke captions (Cinzel; each word lights
up in reading order, names in gold). No voice and no music: the captions tell it and a synthesized SFX bed carries it.
It ends on the Books 1–3 Thank You Sale card (₹400, ends 11 Oct 2026 at midnight).

Engine `src/cine.js` (Canvas 2D, not p5.brush). Characters `src/cine_shiva.js` (Shiva in colour, Nataraja) and
`src/cine_cast.js` (Sati, Daksha, crowds, the Rudra Tandava, Shiva seated, Nandi lying, the Sudarshan chakra, the
yagna fire). Scene `src/scenes/shiva_cine.js` (times in `TL`), SFX `tools/shiva_cine_sfx.mjs` → `assets/shiva_cine_sfx.wav`.

| time | shot | caption |
|------|------|---------|
| 0.0–4.4 | Kailash at night in a storm; Shiva small on a cliff edge; far lightning | There is one dance / that even the gods fear. |
| 3.9–8.4 | Shiva knees-up, eyes closed, abhaya; close lightning | Shiva's Tandava. / When he dances in rage, |
| 8.0–10.9 | his face: eyes open, the third eye opens, push in, white-out | worlds end. |
| 10.7–15.5 | Sati from behind, before Daksha's yagna fire | He danced it like that only once. / For Sati, his wife. |
| 15.0–20.9 | the hall: Daksha on his throne points at her; the guests laugh | Her father Daksha held a great yagna / and insulted Shiva in front of everyone. |
| 20.4–25.6 | Sati walks into the fire; it roars up; white-out | Sati could not bear it. / She gave up her body in the fire. |
| 25.3–33.2 | red storm: Shiva stamps the Rudra Tandava with her body in his arms; cracks of fire, meteors, lightning | Shiva lifted her body / and danced the Rudra Tandava. / The universe began to end. |
| 32.8–36.2 | the Sudarshan chakra streaks in and strikes; gold flash | To stop him, Vishnu sent the Sudarshan Chakra. |
| 35.9–41.8 | night hills: 51 embers fall, each lights a shrine | Where her body fell, 51 places became holy: / the Shakti Peethas. |
| 41.4–44.7 | Kailash, snow, the moon crossing the sky; Shiva seated in meditation | Shiva sat in silence for ages, |
| 44.2–49.5 | dawn: Shailputri (from behind, trishul and lotus) on a peak with Nandi | until she came back / as Shailputri, daughter of the mountains. |
| 49.0–57.4 | the Nataraja in a ring of fire before the rising sun | And he danced again. / This time, in joy. / Is there a Shakti Peeth near YOU? Comment your city! |
| 56.8–62.0 | the card: RK logo, THANK YOU SALE, "Shailputri's story is Book 1", covers, Books 1–3 for ₹400, ends tonight, rishikatha.com, Follow | |

Render: `node render.mjs --clip --out=out/shiva_cine_sfx.mp4` and `--audio=none` for the silent copy.
To check: the Nataraja follows the texts (left leg raised and swung across, lower left hand pointing to it); confirm the
orientation against a bronze before reusing it.
