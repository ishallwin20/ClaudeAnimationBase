# Ramayan · Part 12: "The Last Arrow" (ad 47 · the Ramayan series finale)

Part 12 of the 12-part Ramayan series (format in ad 33's storyboard), the finale. Painted, **no voice**, like Parts
2–11: Bangers captions carry the story (timeline and captions in `src/scenes/rp12_tl.js`), the characters talk with
moving mouths, retro cartoon SFX under it (about -16 LUFS, fixed gain); the only music is a soft tanpura under the hymn
and a gentle shehnai-like tune for the homecoming and the end. 67.0 s. Made cute and grand: Ravana's heads popping back
with a smug sparkle, the short sage Agastya, Ram chanting with little suns rising, the glowing Brahmastra, the crowns
tumbling, petals raining on the cheering monkeys, the Pushpaka with swan prows, Hanuman at Ram's feet in Ayodhya, the
four together on the sunburst.

The hook: Ram cut off Ravana's head… it GREW BACK (frame 0: Ravana facing left, an arrow on its way to his middle
head).

**Battle re-cut (owner, 25 Oct, before posting):** Ravana is never shown smaller than Ram and the two chariots never
share a frame. C is three shots (Ravana's chariot rolls in alone, Ram alone on foot, Indra's chariot comes down from the
clouds and lands clear of him); E is Ravana alone with the arrows from off frame, then a quickening intercut Ram ↔ heads;
F, G and the return have Ram in Indra's chariot with Matali. The Brahmastra is six shots: Ram charging it in close-up
as the sky darkens → the release → the arrow in flight, a comet over the field → Ravana, huge and alone, his ten faces
turning one by one from smug to terror as the light grows (the boss first, the sleepy and the stubborn heads last) → a
beat of silence and the KABOOM → the zoom out as he goes over the back of his chariot → the arrow home. 60 → 67 s; the
60 s cut is kept in out/rp12_v1/.

The card is the finale card (owner, 24 Oct): "Missed a part? Start from Part 1" + "Follow @therishikatha" +
"Comment JAI SHRI RAM 🙏" + the books line.

## Facts used (Valmiki Ramayana, Yuddha Kanda; valmikiramayan.net numbering)
| claim in the reel | source |
|---|---|
| Ravana fights from his chariot while Ram is on foot; Indra sends his chariot, driven by Matali | Yuddha 102.5–20 |
| The sage Agastya comes and teaches Ram the Aditya Hridayam, a hymn to the Sun | Yuddha 105 |
| Ram recites it three times and feels new strength | Yuddha 105.27–29 |
| Ram cuts off Ravana's heads, but new ones grow back | Yuddha 107.54–57 |
| A hundred heads cut, again and again | Yuddha 107.57–58 |
| Matali tells Ram to use the Brahma weapon | Yuddha 108.1–4 |
| Ram charges it with mantras and looses it; it strikes Ravana's heart | Yuddha 108.5–18 |
| The arrow blazes like the Sun (the wind in its feathers, fire and the sun at its point) | Yuddha 108.5–14 |
| Ravana falls from his chariot to the ground | Yuddha 108.19–20 |
| The arrow comes back to Ram's quiver | Yuddha 108.21 |
| The gods shower flowers | Yuddha 108.27 |
| Ram, Sita and Lakshman (with Hanuman and the others) fly home to Ayodhya on the Pushpaka | Yuddha 121–126 |
| Ram is crowned king of Ayodhya | Yuddha 128 |

Not claimed: Sita's ordeal by fire (Yuddha 116–118), Vibhishana's crowning (112), Bharata's welcome (125–127), left out
for time; Ayodhya lit with lamps (Diwali), which Valmiki doesn't describe. Kept gentle: Ravana "fell" (the text: was
killed). Performance only: Ravana's faces turning from smug to terror as the arrow comes, the darkening sky, the heads' smug sparkle and swirl eyes, the "?", the little suns over the chant, the
lightbulb when Matali speaks, the tumbling crowns, Hanuman's hearts.

## Reads (the captions)
| from | to | caption |
|---|---|---|
| 0 | 3.5 | Ram cut off Ravana's head… / **IT GREW BACK!** |
| 6.4 | 8.4 | Ravana fought / from a **CHARIOT**… |
| 8.5 | 10.5 | …and Ram, / **ON FOOT.** |
| 10.7 | 13.9 | So Indra sent his own chariot, / driven by MATALI! |
| 14.1 | 17.5 | The sage AGASTYA taught Ram / a hymn to the Sun: / **ADITYA HRIDAYAM.** |
| 17.6 | 20.7 | Ram chanted it 3 times… / **AND FELT NEW STRENGTH!** |
| 20.9 | 24.1 | Ram cut off Ravana's heads… / but they kept / **GROWING BACK!** |
| 24.2 | 27.1 | Again and again… / **A HUNDRED TIMES!** |
| 27.3 | 30.1 | Then Matali said: / **"USE THE BRAHMASTRA!"** |
| 30.3 | 33.7 | Ram chanted the mantras / and drew the BRAHMASTRA… |
| 33.9 | 37.1 | It flew, / **BLAZING LIKE THE SUN!** |
| 37.1 | 38.7 | (no caption: Ravana's faces change; the silence before the strike) |
| 38.7 | 41.4 | It struck Ravana's / **HEART.** |
| 41.5 | 43.5 | And Ravana / **FELL.** |
| 43.6 | 45.6 | The arrow flew back / into Ram's quiver. |
| 45.7 | 48.5 | The gods showered / **FLOWERS!** |
| 48.7 | 51.9 | Ram, Sita and Lakshman / flew home to AYODHYA… |
| 52.0 | 55.5 | …and Ram / **BECAME KING.** |
| 55.7 | 58.9 | THE END. / **JAI SHRI RAM!** |

## Files
`src/scenes/rp12.js`, `rp12_props.js` (the battlefield, the sky route, the sunburst; petals, the Sun, the Pushpaka; the
war chariots, Agastya, Matali, Sugriva and the vanaras), `rp12_tl.js`, `rp12_cover.js`, `tools/rp12_sfx.mjs` →
`assets/rp12_sfx.wav`, `assets/rp12_mix.wav`; `followCard()` in src/ramayan.js takes `finale: true`.
