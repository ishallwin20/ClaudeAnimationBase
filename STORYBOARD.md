# Ad 53: "Guess whose ride I am?" (Books 1–3)

**Style:** Storybook (`src/storybook.js` on `src/cine.js`, see STORYBOOK_GUIDE.md), its first reel: a test of the flat
picture-book look the owner liked in a set of joke cards (Oct 2026). No voice; SFX only (`tools/guess_ride_sfx.mjs`),
music is added on Instagram. 25 s.

**Format:** a guessing game, three rounds from easy to hard. A vahana waits on a flat wall while dots tick off the
guessing time, then its god springs in beside it and the answer is lettered. **Ask:** "How many did you get? Comment
1, 2 or 3!" **Card:** `sbCard`, "Read their stories", Books 1–3 set of 3 for ₹500, "Book 7, Maa Kalaratri: coming soon".

## Beats
| t | picture | lettering |
|---|---|---|
| 0 | marigold wall, Mooshak with a modak (frame 0 finished) | 1 of 3 · EASY / Guess whose *ride* I am? / three dots |
| 3.4 | Mooshak hops, Bal Bappa springs in waving | *Ganesha's!* |
| 5.4 | paint wipe to a sky wall: the barn owl with a coin | 2 of 3 · MEDIUM / Guess whose ride I am? |
| 8.8 | the owl flaps, Maa Lakshmi on her lotus, coins pouring | Maa *Lakshmi's!* |
| 11.0 | wipe to lavender: the donkey (four dots: a longer wait) | 3 of 3 · HARD / Guess whose ride I am? |
| 15.0 | hee-haw, Maa Kalaratri springs in (three eyes, wild hair, sword, vajra) | Maa *Kalaratri's!* / the 7th form of Durga |
| 17.6 | coral wall, the three vahanas hop in a row | How many did you get? / Comment *1, 2 or 3!* (3.4 s) |
| 21.0 | the card | Read their stories · Books 1–3 · ₹500 · rishikatha.com · Follow |

## Facts used
- Ganesha's vahana is the mouse (Mushika, Mooshak): Ganesha Purana and Mudgala Purana.
- Lakshmi's vahana is the owl (Uluka): the widely followed iconography (e.g. Kojagari Lakshmi Puja in Bengal).
- Kalaratri rides a donkey: her dhyana shloka, "ekaveṇī japākarṇapūrā nagnā kharāsthitā" (kharāsthitā, seated on a
  donkey). She is the 7th of the Navadurga: the Devi Kavacham ("saptamaṁ kālarātrīti"). Her four arms with a sword
  (khadga) and a vajra-like weapon, abhaya and varada, the lightning garland and three eyes follow the same dhyana.

## Files
`src/scenes/guess_ride.js` (scene, the cue times in `GR`), `src/scenes/guess_ride_cover.js` + `cover.html` (cover),
`tools/guess_ride_sfx.mjs` → `assets/guess_ride_sfx.wav`. Deliverables in `out/guess_ride_out/`.
