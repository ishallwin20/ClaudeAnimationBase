# Ramayan · Part 5: "One Man, 14,000 Demons" (ad 37 · the Ramayan series)

Part 5 of the 12-part Ramayan series (format in ad 33's storyboard). Painted, **no voice** (owner, 23 Oct: the chibi
reels without a VO do best): Bangers captions carry the story (timeline and captions in `src/scenes/rp5_tl.js`), the
characters talk with moving mouths, and a retro cartoon SFX track sits under it (about -16 LUFS, fixed gain); the only
music is a soft tanpura and veena under the hug. 69.7 s. The voiced 68.0 s cut is kept in `out/rp5_out`. The hook: Ram
fought 14,000 demons, alone. The kicker: Valmiki gives the time, one and a half muhurtas, about 72 minutes (over three
demons a second), and one demon escaped to Ravana, which sets up Part 6. A "DEMONS LEFT" counter runs down in the battle.

## Facts used (Valmiki Ramayana, Aranya Kanda; valmikiramayan.net numbering)
| claim in the reel | source |
|---|---|
| At Panchavati, Surpanakha, Ravana's sister, sees Ram and desires him | Aranya 17 |
| Ram: I am married; he points her to Lakshman (in jest); Lakshman sends her back | Aranya 18.1–15 |
| She rushes at Sita; Lakshman cuts off her nose and ears | Aranya 18.16–21 |
| She runs to her brother Khara; he sends fourteen rakshasas; Ram kills them | Aranya 19–20 |
| Khara marches with fourteen thousand, with Dushana and Trishira | Aranya 22–23 |
| Ram sends Lakshman with Sita to a mountain cave and faces the army alone | Aranya 24 |
| Dushana falls; Trishira falls; Khara falls | Aranya 26, 27, 30 |
| He destroyed them in one and a half muhurtas ("ardha adhika muhurtena"; a muhurta is 48 minutes); "over 3 demons every second" is the arithmetic, 14,000 ÷ 4,320 s ≈ 3.2 | Aranya 30.30–31 ([sarga 30](https://www.valmikiramayan.net/aranya/sarga30/aranyaitrans30.htm)) |
| Sita comes out of the cave and embraces him | Aranya 30.37–41 |
| One rakshasa, Akampana, escapes and tells Ravana | Aranya 31 |
| The Part 6 tease: Ravana's plan and the golden deer | Aranya 31–42 (Part 6) |

Not claimed: the name Akampana on screen (the captions say "one demon"); Surpanakha taking a beautiful form (later
tellings); Lakshman being unmarried (Ram's line in the text is a jest; the reel says only "try my brother"). The
mutilation is a sword flash and her hands over her face, nothing shown. Performance only: her heart eyes and swoon, the
brothers' grins, the arrows' arcs, the counter, the generals' swirl eyes, Ravana's head over the far towers.

## Shots
| | time | shot | sound |
|---|---|---|---|
| A | 0–3.6 | dusk: Ram, bow drawn, against the horde (frame 0) | wind, the horde growls, the bow creaks, a slow war drum; he looses into the ident |
| B | 3.6–6.4 | the ident: PART 5 · ONE MAN, 14,000 DEMONS | conch, pops |
| C | 6.4–20.4 | Panchavati: Surpanakha walks in and falls for Ram (hearts); "I'm married, try my brother"; to Lakshman and sent back; she lunges at Sita; Lakshman's sword flash; her hands over her face; she flees | birds; her tuba footsteps; heartbeats, a slide whistle up, a sigh; Ram's mumble and a "ting" on "married"; her "hey~"; Lakshman's mumble, a slide whistle down, the brothers chuckle; a snarl, Sita's "eek", the sword's shing, her scream fading off |
| D | 20.4–27.7 | Khara roars beside her; fourteen demons charge and fall under a burst of arrows | her wailing; his roar and orders; "yaaa!"s and scurrying; a hail of thwips, fourteen bonks, a ding, Khara's "huh?!" |
| E | 27.7–35.8 | the army marches in; Sita and Lakshman go into the cave; Ram steps forward and draws | stomps, war horns, a roaring crowd; Ram's mumble, their scurry; his two steps, the creak, one drum, a lonely wind whistle on "ALONE" |
| F | 35.8–53.0 | the battle: arrows like rain, rows of demons fall, the counter runs 14,000 → 0; Dushana, Trishira, Khara fall; Ram lowers his bow; the sun sets; 72 minutes, 3 a second | war drums, bow twangs, the arrows' hail, bonks, the counter ticking; each general's falling "whoaa" and thud; a boom for Khara and an 8-bit victory jingle at zero; tick-tock, a DING on "72 minutes"; one-two-three bonks |
| G | 53.0–55.8 | Sita runs out and hugs him; Lakshman follows | a soft tanpura, her running feet, a harp and veena, heart pops |
| H | 55.8–59.2 | one demon runs off toward the far towers of Lanka; Ravana's head looms | scurrying, panting, a zip; a drum and thunder; Ravana's growl |
| I | 59.2–62.7 | the tease: a forest at night, the golden deer steps in and looks back | crickets, light hooves, a sparkle, three rising veena notes |
| K | 62.7–69.7 | the follow card: NEXT · PART 6 · THE GOLDEN DEER | conch, pops, a plink |

## Files
`src/scenes/rp5.js`, `rp5_props.js` (the dusk field, the cave, the horde, the arrows' rain, the counter), `rp5_tl.js`
(the timeline and captions), `rp5_cover.js`, `tools/rp5_sfx.mjs` → `assets/rp5_sfx.wav`, `assets/rp5_mix.wav`; Surpanakha and
the golden deer in `src/ramayan.js`; Khara is `asura()` recoloured.
