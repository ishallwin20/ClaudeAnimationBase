# Ramayan · Part 1: "The world's first poem was a curse" (ad 33 · the Ramayan series)

Part 1 of an 11-part Ramayan series for the main followers (owner, 23 Oct 2026): every part is hook → "Welcome to
Part N of the Ramayan series" (the series ident) → the story → a tease of the next part → the follow card ("Follow
@therishikatha", "Comment JAI SHRI RAM", a small books line: Books 1–3 for ₹500 · rishikatha.com). All parts are built
first and posted as a burst over 1–2 days. Painted, an English voiceover (Sarvam `girish_en_devotional`, pace 1.2),
captions in **Bangers** timed to the voice, SFX under it (music added on Instagram). 79.6 s.

The series kit is `src/ramayan.js` (Valmiki, the hunter, Brahma, the krauncha, the Devanagari verse, the ident, the
follow card); the shared sets and props (first made for this part) are `src/ramayan_sets.js`, its shots `src/scenes/rp1.js`.

## Facts used (Valmiki Ramayana, Bala Kanda; valmikiramayan.net numbering)
| claim in the reel | source |
|---|---|
| Valmiki asks Narada who in the world today is virtuous, valiant, truthful… | Bala 1.1–5 |
| Narada: there is one, Rama, born in the Ikshvaku line; he tells the story in brief | Bala 1.8 ff. |
| Valmiki goes to the Tamasa river to bathe | Bala 2.3–6 ([sarga 2](https://www.valmikiramayan.net/utf8/baala/sarga2/balasans2.htm)) |
| A pair of krauncha birds, moving about together, cooing | Bala 2.9 |
| A hunter (nishada) kills the male while Valmiki looks on | Bala 2.10 |
| The female cries piteously over him | Bala 2.11–12 |
| The verse "mā niṣāda pratiṣṭhāṁ tvam agamaḥ śāśvatīḥ samāḥ / yat krauñca-mithunād ekam avadhīḥ kāma-mohitam": you will find no peace for endless years, for you killed one of the pair, lost in love | Bala 2.15 |
| It came out metrical, of equal syllables, fit for the string and song; born of shoka, let it be called shloka | Bala 2.18 |
| Four-faced Brahma comes to the ashram | Bala 2.23 |
| "That speech sprang forth at my wish alone"; compose Rama's story as you heard it from Narada | Bala 2.31–32 |
| No word of the epic will be false | Bala 2.35 |
| As long as mountains and rivers last on earth, the Ramayana will be told | Bala 2.36 |
| 24,000 verses (said in the storyboard, not the reel) | Bala 4.2 |
| Lava and Kusha learn it and sing it; Rama brings them to his palace and listens from his golden throne | Bala 4.6, 4.13, 4.28–30 ([sarga 4](https://www.valmikiramayan.net/utf8/baala/sarga4/balasans4.htm)) |
| The Part 2 tease: the night before Ram's crowning, a queen asks for her two boons | Ayodhya 7–11 (Part 2's sources) |

Not claimed: Valmiki's past as the robber Ratnakara (later tellings, not Valmiki's own text); the disciple Bharadvaja
(in the text, left out of the picture); that the birds were sarus cranes (the krauncha is drawn as one, the common
reading). Performance only: the hearts, the dance, Narad's bubble with Ram in it, the "?", the hunter's cowering, the
counting on fingers, the tear that turns to gold, the notes, the palm-leaf book flying to Valmiki, Ram's tear.

## Voiceover (tools/rp1_vo.json; captions are the script)
```
hook     The world's FIRST POEM was a CURSE.
intro    Welcome to Part 1 of the Ramayan series.          (the ident; no caption)
ask      The sage Valmiki once asked Narad Muni: Is there anyone on earth who is truly perfect?
narad    Narad smiled. There is. His name is Ram.
river    Later, by the Tamasa river, Valmiki watched two krauncha birds, always together.
arrow    Then a hunter's arrow killed the male. His mate cried over him.
burst    Valmiki's heart broke, and words burst out:
shloka   Maa nishaada, pratishthaam tvam agamah, shaashvateeh samaah!   (the verse in Devanagari on screen)
curse    Hunter, may you never find peace, for you killed a bird lost in love!
froze    Then he froze. His grief had come out in perfect rhythm, fit to be sung.
shoka    From shoka, grief, came the first shloka.
brahma   Then Brahma himself appeared: That verse came by my will. Now tell Ram's whole story in it.
promise  As long as mountains stand and rivers flow, the Ramayan will be told.
twist    And the first to sing it? Ram's own sons, Lav and Kush, in front of Ram himself.
next     Part 2: the night before Ram is crowned, a queen asks for two boons.
follow   Follow, so you don't miss it, and comment, Jai Shri Ram!   (the card; no caption)
```
Speech-to-text (saaras:v3) came back "Valmiki", "Narad Muni", "Tamasa River", "Krancha", "Ma Nishada, Pratishtham Tvam
Agama, Shashvati Sama", "Shoka", "shloka", "Luv and Kush", "Jai Shri Ram".

## Shots (times from the voice: src/scenes/rp1.js)
| | time | shot |
|---|---|---|
| A | 0–2.7 | the hook: Valmiki mid-curse, arm raised, golden rays, a warm plain ground (frame 0, the caption up) |
| B | 2.7–5.7 | the series ident: RAMAYAN in gold, Ram with his bow in a saffron sunburst, "PART 1", "THE FIRST POEM" |
| C | 5.7–15.0 | the ashram: Narad floats down on his cloud; Valmiki bows, asks ("?"); Narad smiles and plays; a bubble with Ram |
| D–E | 15.0–25.5 | the Tamasa: Valmiki walks in; the pair dance, necks entwined, a heart; an arrow from the bushes off right; the male falls; she throws her head back and cries |
| F | 25.5–34.1 | Valmiki's tear, then fury; his arm goes up and the verse rises in four golden padas |
| F2 | 34.1–39.6 | the curse lands: the hunter in the bushes cowers and backs away |
| G | 39.6–48.5 | he froze: the verse hangs in the air; he counts the beats; notes rise; his tear turns gold (shoka → shloka) |
| H | 48.5–59.9 | Brahma floats down on his lotus in a burst of light; blesses; a palm-leaf book flies to Valmiki; the camera pulls back to mountains and a river |
| I | 59.9–66.6 | Ayodhya's court: Lav and Kush sing with their veenas; Ram on his throne, his hand on his heart; push in, a tear |
| J | 66.6–72.7 | the tease: a night chamber, a lamp, a queen (Kaikeyi) turns up her palm; two golden lights rise |
| K | 72.7–79.6 | the follow card: RAMAYAN · NEXT · PART 2 · THE TWO BOONS · Follow @therishikatha · Comment JAI SHRI RAM · books |

## Files
`src/scenes/rp1.js`, `rp1_vo.js` (written by the TTS tool), `rp1_cover.js`, `tools/rp1_vo.json`,
`tools/rp1_sfx.mjs` → `assets/rp1_sfx.wav`, `assets/rp1_mix.wav`; the series kit `src/ramayan.js`, `src/ramayan_sets.js`.
