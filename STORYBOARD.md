# Ad 116 · "There's a forest in Vrindavan that NOBODY is allowed to enter after SUNSET"

**Style:** 3D, with GLB models from the owner's library (`assets/glb/`, loaded by `src/cine3d_glb.js`), directed like
the owner's two reference reels (`ig_hyperrealistic_3d*.mp4`): still models made alive by the camera (slow push-ins,
cranes, a rack of focus), shallow depth of field, teal/amber grade, mono labels in black boxes, a red sticker, tall
condensed headlines. **Voice:** girish_en_devotional (Sarvam), pace 1.22. **Score:** Lyria take 2, cut to the picture.
**Length:** 96.0 s (voice ends 88.3 s, card from 89.5 s). **Card:** Navadurga set, no price.

**The idea:** the owner's script (the belief, the bed, the warning, "are these stories true?"), made into a mystery
that turns at the end: the reel never answers whether anyone has gone mad, and instead hands over to what the
Bhagavatam itself says about the Raas: Krishna became as many as there were gopis; no one in Vraj noticed; and you
were never meant to see it, only to hear it. A corner label says, the whole way through, which kind of claim is on
screen: **LOCAL BELIEF** (red) or **BHAGAVATA PURANA · 10.33** (gold).

## Shots (times from `src/scenes/nidhi_tl.js`)
| t | shot | voice |
|---|---|---|
| 0 | A: an old brass Aligarh lock on the gate's chain at dusk, pushing in (frame 0 = the lock + the hook) | There's a forest in Vrindavan that nobody is allowed to enter after sunset. |
| 4.1 | B: low through the gate bars, the sunset over the grove | And the reason… is hard to believe. |
| 6.5 | C: down the path at dusk to the Rang Mahal's dome; NIDHIVAN headline; tags | It's called Nidhivan. The grove where Banke Bihari ji first appeared, to Swami Haridas. |
| 13.5 | D: night falls; the moon rises over the dome, lamplight in its door | Devotees believe that every night, Krishna returns here… to dance the Maharaas… |
| 21.8 | E: a pair of twisted trees wrapped round each other, the moon behind | Its trees grow in pairs… Locals say that at night… they become the gopis. |
| 28.7 | F: into the Rang Mahal: the carved bed, red silk, petals, a diya | Every evening, a bed is made inside the Rang Mahal. |
| 32.4 | G: macro on each offering, a tag each: lota, paan, laddoos, neem datun, bangles + sindoor | Water. Paan. Sweets. A neem twig to brush with. Bangles, and sindoor. |
| 38.6 | H: the doors close from inside; cut to the lock snapping shut under the moon; to black | Then the doors are locked… from the outside. |
| 41.4 | I: a neighbour's wall, its window bricked up | Neighbours shut their windows at the evening aarti. Some have bricked them up. |
| 46.0 | J: POV creeping through leaves toward a golden glow; dancers out of focus; LOCAL STORIES sticker; white-out on SIGHT; black on MIND | Because local stories warn: whoever stays to watch… loses their sight. Or their mind. |
| 52.8 | K: dawn, the doors open: the bed slept in, the lota empty, a paan eaten | At dawn, the priests say… the bed looks slept in. The water is gone. The paan, eaten. |
| 59.1 | L: the gate at dawn; TRUE? | Are these stories true? No one has ever filmed it. No one is supposed to. |
| 64.1 | M: one Radha-Krishna on the Yamuna's sand; on MANY eleven more appear in flashes of light; crane up to the ring from above | But the Bhagavatam tells a stranger story. On the night of the Raas, Krishna became as many as there were gopis. |
| 71.3 | N: the ring far off across the dark bank | And all of Vraj never noticed. Each man thought his wife was right beside him. |
| 77.0 | O: Radha-Krishna close, warm, a slow orbit | You were never meant to see the Raas. Whoever simply hears it with faith, it says, is freed from the heart's disease. |
| 84.9 | P: the lock under the moon; YES or NO? | Would you stay inside after sunset? Yes… or no? |
| 89.5 | card | |

## Facts used
Local belief (said on screen as belief, "locals say", "local stories", "the priests say"; the corner label reads LOCAL BELIEF):
- Nidhivan is a grove in Vrindavan, closed after the evening aarti; devotees believe Krishna and Radha perform the Raas
  there each night, and that its paired, intertwined tulsi trees become gopis. (Wikipedia, "Nidhivan, Vrindavan";
  brajbhoomi.com/temples/nidhivan; vrindavan.com/nidhivan)
- Every evening the Rang Mahal is laid with a bed, water, paan, sweets and a neem datun (and shringar), then locked from
  outside; in the morning the bed is said to look used and the offerings tasted. (Same sources; the priests' account.)
- Neighbours close their windows at the evening aarti; many have bricked them up; the belief is that those who peeked
  lost their sight or their mind. (Wikipedia; tourmyindia.com)
- Banke Bihari ji appeared at Nidhivan to Swami Haridas (16th century), who first called him Kunj Bihari; worshipped
  there until the Banke Bihari temple was built (c. 1864); Haridas's samadhi is in Nidhivan. (bihariji.org temple
  history; Wikipedia, "Banke Bihari Temple")

Scripture (corner label BHAGAVATA PURANA · 10.33; Vedabase, Prabhupada translation):
- 10.33.3: in the rasa circle Krishna entered between each pair of gopis, each thinking he stood beside her alone.
- 10.33.19: "Expanding Himself as many times as there were cowherd women…" → "Krishna became as many as there were gopis."
- 10.33.37: the cowherd men, bewildered by his maya, thought their wives had remained home at their sides, and felt no
  jealousy → "All of Vraj never noticed. Each man thought his wife was right beside him."
- 10.33.39: whoever faithfully hears or describes this lila attains devotion and quickly conquers lust, "the disease of
  the heart" → "Whoever simply hears it with faith… is freed from the heart's disease."

Not claimed: that anyone actually lost sight or sanity (only "local stories warn"); that monkeys or birds leave at dusk
(no source found, so left out); the "night of Brahma" in 10.33.38 (translations differ: some read brahma-muhurta).
The Bhagavatam places the Raas on the Yamuna's bank in Vrindavan, not in Nidhivan by name: shots M–O are on a
riverbank, not in the grove. The Raas ring uses one Radha-Krishna model repeated: it shows "a Krishna beside every gopi",
and claims nothing more.

## Sound
Score: `tools/nidhi_score.txt` → `assets/nidhi_score_1/2.mp3` (Lyria stretched the brief to 136/146 s); take 2 cut
to the picture by loudness in `tools/nidhi_sfx.mjs`. The SFX and the mix are built by the same file:
`node tools/nidhi_sfx.mjs` → `assets/nidhi_mix.wav`.

## Make it
```
node tools/sarvam_tts.mjs --script=tools/nidhi_vo.json      # the voice + src/scenes/nidhi_vo.js
node tools/nidhi_sfx.mjs                                      # score cut, SFX, mix
rm -rf out/frames; node render.mjs --frames --workers=1 && node render.mjs --encode --out=out/nidhivan_out/nidhivan.mp4
node render.mjs --page=cover.html --stills=0 --out=out/nidhivan_out   # → cover.png
```
GLBs in `assets/glb/` (dry_tree, magical_pink_tree, radha_krishna_01) are the owner's library models.
