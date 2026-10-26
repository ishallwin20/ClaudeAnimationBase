# "You've been doing AARTI wrong" (ad 54 · Books 1–3 · 3D)

A 56.2 s explainer in the **3D** style, a sibling of the pradakshina reels (ad 31, and ad 50, which went viral and drew
"what about the other gods' numbers?" comments): one practical rule with a number for each part, that a family can try
at the next aarti. A lamp-lit stone sanctum, a dark bronze (panchaloha) Vishnu murti with four arms (chakra, conch,
varada, hand on the hip), the camera as the devotee holding a five-wick aarti lamp whose light trails stay in gold,
one ring a circle, each a little bigger and nearer so the count reads, a chime climbing a step per circle. English VO
(Sarvam `girish_en_devotional`, pace 1.2), karaoke captions timed to the voice, SFX under it (music added on
Instagram). Card: Books 1–3, set of 3 for ₹500.

## Facts used
| claim in the reel | source |
|---|---|
| In temples the lamp follows a path: four circles at the feet, two at the navel, three at the face, seven round the whole body | ISKCON's temple worship manuals: *Pancaratra Pradipa* (GBC Deity Worship Ministry), "Offer the burning ghee-wick by making four circles to the Lord's lotus feet, two circles to His navel, three to His face, and seven to His whole body" (quoted in *Back to Godhead*, "Offering Arati", Rohininandana Dasa); *Arcana Paddhati* (1978), part I §9: camphor "four times to the lotus feet, twice to the navel region, three times to the lotus face, and seven times to all the limbs". Both credit the count to the Brahma Vaivarta Purana as quoted by Sanatana Gosvami (akincana.net, "Is ISKCON's Arcana-paddhati authorized?"); we did not find that verse ourselves, so the reel says "in temples", not "the scriptures" |
| "Many homes do the face just once" (the ask: 1 or 3?) | the count most Hindi and puja sites give: feet 4, navel 2, face **1**, whole body 7 (Punjab Kesari, Aaj Tak, Bharatkosh "आरती पूजन", Swaminarayan.faith, Pratidin Time), none of them citing a verse |
| The flame: ghee or camphor, an odd number of wicks | Hari Bhakti Vilasa 8.298: *prajvālayet tad-arthaṁ ca karpūreṇa ghṛtena vā / ārātrikaṁ śubhe pātre viṣamāneka-vartikam* (light it with camphor or ghee, in a fine vessel, with many wicks in an odd number) ([wisdomlib, HBV ch. 8](https://www.wisdomlib.org/hinduism/book/hari-bhakti-vilasa-sanskrit-text/d/doc493474.html)). On screen "3 · 5 · 7": many (more than one) and odd |
| Forgot the mantras? Got the steps wrong? In the Skanda Purana Shiva tells Parvati: do the aarti, and the puja becomes complete | Hari Bhakti Vilasa 8.302, *tatraiva śrī-śivomā-saṁvāde* (in the Skanda Purana, in the dialogue of Shiva and Uma): *mantrahīnaṁ kriyāhīnaṁ yat kṛtaṁ pūjanaṁ hareḥ / sarvaṁ sampūrṇatām eti kṛte nīrājane śive* (a worship of Hari lacking mantras and lacking the rites all becomes complete when the nirajana is done, O Shivā). The verse is on screen in Devanagari with "Skanda Purana, in the Hari Bhakti Vilasa 8.302". The puja shown is Vishnu's, as the verse says (*hareḥ*) |

Checked and not used: the Hari Bhakti Vilasa's own aarti section (8.296–325) gives no body-part counts; the
conch water circled three times over the deity after the aarti (8.315), the lamp waved over the head (8.299–300, 8.323),
and the Padma Purana "five or seven wicks" line (Bharatkosh, second-hand), left out for time.
Performance only (no claim): the murti's look (a generic standing four-armed Vishnu; the conch and chakra in the upper
hands as in most images), the clockwise direction of the circles, the "round and round" scribble (a common habit, not a
teaching), the hand bell, the sanctum.

## Voiceover (tools/aarti_vo.json; captions are the script)
```
hook     You've been doing AARTI wrong.
most     Most of us just wave the lamp ROUND AND ROUND.
path     But in temples, the lamp follows a PATH, / with a NUMBER for each part.
feet     FOUR circles at his FEET.
navel    TWO, at his NAVEL.
face     THREE at his FACE.
whole    Then SEVEN round his WHOLE BODY.
wicks    And the flame? GHEE or CAMPHOR, / with an ODD number of wicks.
twist    Forgot the mantras? Got the steps WRONG?
shiva    In the SKANDA PURANA, SHIVA tells PARVATI: / do the aarti, and the puja becomes COMPLETE.
kid      Tonight, let your child hold the lamp and COUNT: / 4, 2, 3, 7.
ask      Many homes circle the face just ONCE. / What does YOUR family do? Comment 1 or 3!
```
Speech-to-text (saaras:v3) on every take came back word for word (after rewording three that misheard: "Two" → "do",
"And the lamp" → "either lamp", "face" → "phase").

```
Logline: Most of us wave the aarti round and round; temples give the lamp a path: 4 at the feet, 2 at the navel,
         3 at the face, 7 round the body. Ghee or camphor, odd wicks. And if you get it wrong, the Skanda Purana says
         the aarti itself completes the puja.
Hook:    Frame 0: the murti in the dark sanctum, lit by the aarti lamp by his face; the caption up; the
         AARTI · THE TEMPLE WAY tag under it.
World:   one sanctum at night; the lamp's light casts the murti's shadow on the wall as it circles.
Style:   3D (three.js under cine.js), Cinzel karaoke captions at y 1300 over a soft dark band.
Card:    rkCardCine: MEET OUR GODS · Books 1–3 · set of 3 for ₹500 · rishikatha.com · Follow.
```

## Shots (times from the voice: src/scenes/aarti_tl.js)
| | time | shot |
|---|---|---|
| A | 0–2.0 | the murti, the lamp glowing by his face; the tag |
| B | 2.0–5.3 | round and round: the lamp scribbles loops all over him, the bell rung any old way |
| C | 5.3–10.0 | the scribble fades; a faint circle at each place, a "?" by each |
| D | 10.0–12.5 | the feet: four circles, the count climbing |
| E | 12.5–14.9 | the navel: two |
| F | 14.9–17.3 | the face: three |
| G | 17.3–21.1 | the whole body: seven big circles |
| H | 21.1–26.6 | the lamp by his face: the five wicks catch one by one; "3 5 7" |
| I | 26.6–29.8 | forgot the mantras? the scribble again |
| J | 29.8–35.4 | the verse in Devanagari; on COMPLETE every circle lights at once, the temple bell |
| K | 35.4–41.7 | every circle, the counts 4 · 2 · 3 · 7 popping as they're said: the save frame |
| L | 41.7–49.0 | the face: "1 or 3", the ask |
| M | 49.0–56.2 | the card |

## Files
`src/scenes/aarti.js` (shots), `aarti_props.js` (sanctum, murti, lamp, trails, pins), `aarti_tl.js`, `aarti_vo.js`
(from the TTS tool), `aarti_cover.js` (the cover), `tools/aarti_vo.json`, `tools/aarti_sfx.mjs` → `assets/aarti_sfx.wav`,
`assets/aarti_mix.wav`. `rm -rf out/frames && node render.mjs --frames --workers=2 && node render.mjs --encode
--out=out/aarti_out/aarti.mp4` (17 ms a frame); cover: `node render.mjs --page=cover.html --stills=0 --out=out/aarti_out`
then rename `t0_00.png` to `cover.png`.
