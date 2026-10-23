# Ramayan · Part 2: "The Two Boons" (ad 34 · the Ramayan series)

Part 2 of the 12-part Ramayan series (see ad 33's storyboard for the series format: hook → the ident → the story → the
next part's tease → the follow card). Painted, chibi, **no voice** (owner, 23 Oct 2026: the no-VO chibi reels do best;
this part was first made with the girish voiceover, kept in git history): Bangers captions carry the story, the
characters speak their lines (mouths, emotes), a Lyria score and SFX. 69.4 s. The hook is the paradox Valmiki actually
tells: Kaikeyi was overjoyed at first.

## Facts used (Valmiki Ramayana, Ayodhya Kanda; valmikiramayan.net numbering)
| claim in the reel | source |
|---|---|
| Dasharatha decides to anoint Ram as yuvaraja, the next day (Pushya) | Ayodhya 1–4 |
| The city is decked out; Manthara, Kaikeyi's hunchbacked maid, sees it from the terrace and learns of the anointing | Ayodhya 7.1–8 ([sarga 7](https://www.valmikiramayan.net/utf8/ayodhya/sarga7/ayodhyasans7.htm)) |
| Kaikeyi is delighted and gives Manthara an ornament; "I see no difference between Rama and Bharata" | Ayodhya 7.31–35 |
| Manthara throws the ornament away; Ram will banish Bharat or have him killed | Ayodhya 8 ([sarga 8](https://www.valmikiramayan.net/utf8/ayodhya/sarga8/ayodhyasans8.htm)) |
| Kaikeyi first defends Ram (eldest, righteous) | Ayodhya 8 |
| The war against Shambara (Vaijayanta, Dandaka): the king wounded, Kaikeyi carries him off the field; he grants two boons | Ayodhya 9.11–17 ([sarga 9](https://www.valmikiramayan.net/utf8/ayodhya/sarga9/ayodhyasans9.htm)) |
| Manthara: go to the room of anger, lie on the floor without ornaments; ask Bharat's crowning and Ram's exile for 14 years | Ayodhya 9.20–30 |
| She takes off her ornaments and lies on the floor of the krodhagara | Ayodhya 9–10 |
| The king finds her and swears by Ram to grant her wish | Ayodhya 10–11 |
| The two boons: Bharat anointed; Ram to the Dandaka forest for fourteen years | Ayodhya 11 |
| He falls, pleads all night; she does not yield | Ayodhya 12–14 |
| Ram hears it, unruffled: "Let it be as you said. I shall go to the forest" | Ayodhya 19.1–2 ([sarga 19](https://www.valmikiramayan.net/utf8/ayodhya/sarga19/ayodhyasans19.htm)) |
| The tease: the king remembers a curse from his youth (the ascetic's son shot by sound at night) | Ayodhya 63–64 (Part 3) |

Not claimed: Manthara's motive from a previous life or the gods' plan (later tellings); the chariot's wheel axle story
(Kaikeyi's finger in the axle: a folk / later telling, not drawn: she only drives and carries him off). Kaikeyi is
shown driving the chariot out of the battle (Valmiki: she carried him away from the field). Performance only: the
hearts, the sparkle, the necklace's arc, Bharat's little bubble, the sweat, the "!!", the crown and tree icons, the
stars turning in the window, Ram's closed eyes and smile.

## Captions and sound
Every time is in `src/scenes/rp2_tl.js` (`TL`, with the captions in `TL.CAPS`); the scene and the SFX read it. Each
caption is up 2 s or more, 3.2 s or more with three lines; gold for names and the key words, a huge gold line for the
punch ("SEND HIM AWAY?", "MANTHARA.", "TWO BOONS.", "ROOM OF ANGER.", "14 YEARS!", "I WILL GO.").
Score: `tools/rp2_score.txt` (90 BPM, 26 bars, 69 s) → `node tools/lyria.mjs --prompt=tools/rp2_score.txt --out=assets/rp2_score.mp3`
(take A of 2: 70.2 s; take B ran 121 s). `node tools/rp2_sfx.mjs` writes the SFX and the mix (score .55 under SFX, -14 LUFS).

## Shots
| | time | shot |
|---|---|---|
| A | 0–3.6 | Kaikeyi, a heart over her (frame 0), turns cold and points away on "send him away" |
| B | 3.6–6.4 | the ident: PART 2 · THE TWO BOONS |
| C | 6.4–10.4 | the court: Dasharatha on his throne raises his hand; Ram bows; marigold petals fall |
| D | 10.4–15.2 | Ayodhya lit at night, fireworks; push in on Manthara at the terrace rail, narrowing her eyes, fuming (steam) |
| E–F | 15.2–28.0 | Kaikeyi's chamber: Manthara scurries in (dust, speed lines) shouting the news; Kaikeyi overjoyed, gives the necklace (it arcs over); hand on heart; Manthara flings it away; whispers; a bubble of little Bharat walking away; Kaikeyi's sweat |
| G | 28.0–34.0 | sepia, the war: Kaikeyi drives the chariot, the wounded king slumped behind her, arrows raining; two golden boons rise |
| H–K | 34.0–51.7 | the room of anger: she tears off her jewels and lies down, fuming (steam); the king comes with a lamp, swears (a bubble of Ram); she sits up: a light becomes Bharat's crown, a second a forest tree; "14 years"; he falls, begs all night (stars wheel past the window); she turns away |
| L | 51.7–58.0 | dawn through the window: Ram stands calm, eyes closed, smiling, hands joined: "I will go"; the king weeps |
| M | 58.0–62.4 | the tease: night, a river, a young archer drawing his bow at a sound in the dark |
| N | 62.4–69.4 | the follow card: NEXT · PART 3 · THE KING'S CURSE |

## Files
`src/scenes/rp2.js`, `rp2_tl.js`, `rp2_props.js`, `rp2_cover.js`, `tools/rp2_score.txt` → `assets/rp2_score.mp3`,
`tools/rp2_sfx.mjs` → `assets/rp2_sfx.wav`, `assets/rp2_mix.wav`; the series kit `src/ramayan.js`, `src/ramayan_sets.js`.
