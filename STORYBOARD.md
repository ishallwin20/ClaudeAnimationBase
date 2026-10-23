# Ramayan · Part 3: "The King's Curse" (ad 35 · the Ramayan series)

Part 3 of the 11-part Ramayan series (format in ad 33's storyboard). Painted, no voice (owner, 23 Oct: the no-VO
chibi reels do best, and Part 2's score felt like too much): Bangers captions carry the story (2 s+ each, 3.2 s+ for
three lines; the characters' mouths move on their lines), retro cartoon SFX in the manner of the Shumbha and Bal
Hanuman sun reels, and the only music a soft tanpura with a few veena notes under the three sad scenes, as the Sindoor
reel's beds sat. 68.6 s, levelled to -16 LUFS. (The first cut, with an English voiceover, is in git history and
`out/rp3_out/`.) The hook: young Dasharatha
killed a boy by mistake, and years later it killed him; the twist: when he was cursed to die grieving for a son, he
had no son at all.

## Facts used (Valmiki Ramayana, Ayodhya Kanda; valmikiramayan.net numbering)
| claim in the reel | source |
|---|---|
| Ram leaves for the forest with Sita and Lakshman; the city weeps; the king follows the chariot | Ayodhya 40 |
| Sumantra, the charioteer, returns without them | Ayodhya 57 |
| That night Dasharatha tells Kausalya what he did as a young prince | Ayodhya 63 ([sarga 63](https://www.valmikiramayan.net/utf8/ayodhya/sarga63/ayodhyasans63.htm)) |
| He was known as a prince who could shoot by sound alone (shabdavedhi) | Ayodhya 63 |
| In the rains, by the Sarayu, at night, he heard what he took for an elephant drinking and shot | Ayodhya 63 |
| The arrow struck a young ascetic filling his pitcher; he cried out | Ayodhya 63 |
| The boy: my blind, aged parents wait for me; go to them; pull out the arrow; he dies | Ayodhya 63 |
| (The boy tells him he is not a brahmin, so no brahmahatya: not in the reel) | Ayodhya 63 |
| He takes the water to the blind parents; they ask why their son is silent; he confesses | Ayodhya 64 ([sarga 64](https://www.valmikiramayan.net/utf8/ayodhya/sarga64/ayodhyasans64.htm)) |
| The father's curse: "you too will die grieving for your son" | Ayodhya 64 |
| Dasharatha dies that night, lamenting Ram, before Kausalya and Sumitra | Ayodhya 64 |
| He had no son then (sons came only after the putrakameshti yagna) | Bala 8–16 |
| The Part 4 tease: a crow attacks Sita; Ram takes up a blade of grass | Sundara 38 (Part 4) |

Not claimed: the name Shravan Kumar (Valmiki doesn't name the boy; the reel doesn't either); the kavad on his shoulders
(later tellings); Dasharatha's "Rama, Rama" as exact words (the caption says "crying for Ram"). Performance only: the red
light on "him", the bubble of the young prince, the sound rings, the elephant in a thought bubble, the bush that hides
the boy, the empty cradle, the lamp going out, the bubble of Ram over the dying king.

## Shots (times from `src/scenes/rp3_tl.js`)
| | time | shot | sound |
|---|---|---|---|
| A | 0–3.7 | night-blue ground: the young prince draws his bow (frame 0, the hook caption up) and looses; red light on "him" | crickets, the bow creaks, a twang, the whoosh, a low drum on the red |
| B | 3.7–6.5 | the ident: PART 3 · THE KING'S CURSE | a soft conch, pops |
| C | 6.5–13.6 | the gate of Ayodhya: the chariot rolls out (Sumantra, Ram, Sita, Lakshman); people weep; the old king runs after it and falls to his knees | a murmuring, sobbing crowd, coconut hooves and creaking wheels trailing off right, his running feet and cry, the thud of his knees |
| D | 13.6–17.1 | dusk: the chariot comes back, Sumantra alone, head bowed | wind, slow hooves in from the right, a sigh, a small falling note |
| E | 17.1–20.7 | night: the king on his bed tells Kausalya; a bubble of the young prince | crickets, the lamp, his low mumble, the tanpura comes in; a harp glissando into the flashback |
| F | 20.7–38.9 | the flashback, rain at the Sarayu: the prince listens, eyes shut (sound rings); ripples, an elephant in a thought bubble; he looses; a cry; he runs; the boy slumped in the reeds with his pot and the arrow; "take them this water"; he dies | rain, river, frogs; the rain falls away while he listens, leaving the glug-glug of the pot; a cartoon trumpet in the bubble; the shot brings the rain back; the boy's cry, the pot spilling, squelching feet, a slowing heart; two veena notes |
| G | 38.9–48.1 | the blind parents at their hut; the prince comes with the pot, kneels, confesses; the father rises and curses him (thunder) | soft rain, crickets, the father's voice, the prince's low one, the mother's sobs, the tanpura; thunder and a drum on the curse |
| H | 48.1–51.7 | the twist: the young prince by an empty cradle, "?" | a still room, the cradle creaking, a "hm?" |
| I | 51.7–56.2 | the bedroom: the king cries for Ram (a bubble of Ram), the lamp goes out; Kausalya weeps | tanpura, his sobs, a slowing heart; the lamp blown out, then silence |
| J | 56.2–61.6 | the tease: a crow swoops at Sita; Ram picks up a blade of grass that glows | birds, wings and caws, Sita's gasp, a shimmer and drum on the grass |
| K | 61.6–68.6 | the follow card: NEXT · PART 4 · THE CROW AND THE GRASS | a soft conch, pops |

## Files
`src/scenes/rp3_tl.js` (every beat and caption), `rp3.js`, `rp3_props.js` (the gate, the rainy Sarayu, the bedroom,
the pot, the cradle; the young king, Sumantra, the ascetic boy, his blind parents, Kausalya), `rp3_cover.js`,
`tools/rp3_sfx.mjs` → `assets/rp3_sfx.wav`, levelled → `assets/rp3_mix.wav`. Delivered in `out/rp3_sfx_out/`.
