# "The whole world bows to the RISING sun. ONE festival bows first to the SETTING sun." (ad 97 · 3D)

A 75.97 s explainer of Chhath Puja in the **3D** style (owner, 15 Nov 2026, the day of Sandhya Arghya: "a 3D explainer
for Chhath puja. End with Jai Chhathi Maiya. End card of the Ashwatthama comic, no price. Make it a viral reel").
English VO (Sarvam `girish_en_devotional`, pace 1.28), karaoke captions, a mild SFX bed (a Chhath song goes on top on
Instagram), the Ashwatthama comic card. Matte look, low bloom, DOF.

**The idea:** the hook is the one thing everyone half-knows about Chhath (the setting sun is worshipped), said as a
contrast with the whole world. Then what makes it unlike other festivals (no priest, no idol, no temple; a 36-hour
fast), the four days as a numbered list (the format of ads 50/54), who Chhathi Maiya is, and an emotional close that
returns to the hook: Chhath bows to the one who sets, because he will rise again. The ask is a place call-out (your
ghat) and a line everyone can type: Jai Chhathi Maiya.

## Facts used
| claim in the reel | source |
|---|---|
| Chhath worships the setting sun first, then the rising sun | The festival's two arghyas: Sandhya Arghya (evening, Kartik Shukla Shashthi) then Usha Arghya (next dawn, Saptami). Bihar Tourism's festival page; Wikipedia "Chhath" ("arghya is offered to the setting sun", then "to the rising sun"). The reel says "one festival bows first to the setting sun", not "the only one" |
| Chhath = the sixth; the sixth day after Diwali | *Chhath* < Sanskrit *ṣaṣṭhī*, the sixth tithi of Kartik's bright half (Diwali is the new moon). 2026: Nahay Khay 13 Nov, Kharna 14 Nov, Sandhya Arghya 15 Nov, Usha Arghya 16 Nov |
| No priest, no idol, no temple | The vrati performs the rites herself at a river or pond; the offering is made to the sun itself. Widely described (e.g. Bihar Tourism; Wikipedia). Said as the tradition's character: some ghats today do set up Surya images |
| A fast of 36 hours, no food, no water | The nirjala fast runs from the Kharna prasad (evening of day 2) to the paran after Usha Arghya (morning of day 4), about 36 hours. Standard in every account of the vrat |
| Day 1, Nahay Khay ("bathe and eat"): a holy dip, one pure meal of rice, chana dal and lauki | *Kaddu-bhaat*: arwa rice, chana dal, bottle gourd, cooked without onion or garlic (Wikipedia "Chhath": "lauki bhaat", bottle gourd and Bengal gram with arva rice) |
| Day 2, Kharna: fast all day; at night jaggery kheer and roti, off a clay stove | *Rasiao* (gur ki kheer) and roti/sohari, cooked on a new mud chulha with mango wood, eaten after sunset (Wikipedia "Chhath"; all vrat guides) |
| Day 3, Sandhya Arghya: waist-deep in the river, a soop of fruit and thekua raised to the setting sun | The arghya is offered standing in water, holding a bamboo soop of thekua, fruit, sugarcane (Wikipedia "Chhath"; Bihar Tourism) |
| Day 4, Usha Arghya: back in the water before dawn; the fast breaks after the sun rises | The dawn arghya, then the paran (Wikipedia "Chhath") |
| Chhathi Maiya is Shashthi Devi, the guardian of children | *Ṣaṣṭhī-devy-upākhyāna*: Devi Bhagavata Purana 9.46 (also Brahma Vaivarta, Prakriti Khanda 43): the sixth part of Prakriti, hence Shashthi; presiding deity of children; she gives King Priyavrata's stillborn son his life. The chapter's summary was checked against Wikipedia "Shashthi" and SWAHA's digest on 15 Nov 2026; the translated text itself did not load that day (verse wording not quoted on screen, only the chapter) |
| Folk songs call her the Sun's sister | The living tradition of Bihar and Purvanchal (Chhath geet; Wikipedia "Chhath": "the sixth form of Prakriti and Surya's sister"). Tagged in the line itself as what the songs say, not a purana |
| "Chhath bows to the one who sets, because he will rise again" | The reel's reading of the two arghyas, the one people commonly give. A meaning, not a scriptural claim |

Not said (kept out on purpose): that Chhath is "the only Vedic festival" or "the oldest festival"; Karna, Draupadi or
Sita starting it (regional legends, sourced to news features only); Usha and Pratyusha as the two goddesses of the
arghyas (popular, no text found); health or "science of sun rays" claims.

## Voiceover (tools/chhath_vo.json; captions are the script)
```
hook   The whole world bows | to the RISING sun. / ONE festival bows first | to the SETTING sun.
what   CHHATH. | No priest. No idol. No temple. / Just a river, the sun, | and a fast of 36 HOURS.
d1     DAY ONE: Nahay Khay. | A holy dip, / then one pure meal: | rice, dal and lauki.
d2     DAY TWO: Kharna. | Fast all day. / At night: jaggery kheer | and roti, off a clay stove. / Then 36 HOURS. | No food. | Not a drop of WATER.
d3     DAY THREE: | Sandhya Arghya. / Waist-deep in the river, | a SOOP of fruit and thekua / is raised | to the SETTING sun.
d4     DAY FOUR: | Usha Arghya. / Before dawn, they are back | in the cold water. / Waiting...
rise   And then, | the sun RISES. / Only then | does the fast break.
maiya  And CHHATHI MAIYA? | She is SHASHTHI DEVI, / the guardian of children. / Folk songs call her | the Sun's own SISTER.
mean   The world salutes | whoever is RISING. / Chhath bows | to the one who SETS, / because he will | RISE again.
ask    Tell us your GHAT, | and say it with us: / JAI CHHATHI MAIYA!
```
Spoken (tts): छठ and छठी मैया in Devanagari (owner, 15 Nov: the Latin spelling was mispronounced), Nahaay Khaay, Kharnaa, Sandhyaa, Ushaa, thekuaa, Maiyaa, Shashthee, ghaat. Speech-to-text (whisper small)
on the whole take: right. A 1.7 s gap before "And then, the sun rises" is the held breath.

## Shots (times from the voice: src/scenes/chhath_tl.js)
- **A 0–5.8 hook.** Frame 0: a woman in a yellow sari, waist-deep in a river at dusk, seen from behind, the sun huge
  over the far bank, its path on the water, her reflection, lamps. On ONE… SETTING she lifts the soop to it.
- **B –13.0 Chhath.** From the steps, past a basket and the diyas: छठ · "the sixth day after Diwali"; PRIEST, IDOL,
  TEMPLE struck out in red one by one. Then along the line of vratis, soops up: a big 36 · HOURS · NO FOOD · NO WATER.
- **C –19.7 day 1.** DAY 1 OF 4 · NAHAY KHAY · "bathe and eat": the river in daylight, the women in the water; then the
  meal on a banana leaf in a mud courtyard (rice-paste border on the wall): RICE, CHANA DAL, LAUKI.
- **D –29.3 day 2.** KHARNA · the last meal: night, a clay stove, the brass pot of kheer steaming, rotis on a leaf: GUR
  KHEER, ROTI. Then the push into the stove as the fire dies to embers: 36 HOURS, FOOD and WATER struck out.
- **F –36.2 day 3.** SANDHYA ARGHYA · the evening offering: her face (eyes closed, the long orange sindoor), the SOOP
  (bananas, coconut, thekua, fruit, a lamp), the lamp-lit steps behind. Then from behind: soops rise as the sun touches
  the bank.
- **G –42.7 day 4.** USHA ARGHYA · the dawn offering: blue night going to first light, stars, mist, lamps; the camera
  drifts round to her back. "Waiting…": near silence.
- **H –47.9 the sunrise.** The sun breaks over the bank, the sky goes gold, light shafts, the soops go up: a conch and
  a bell. "Only then does the fast break."
- **I –54.8 Chhathi Maiya.** Her face at dawn: CHHATHI MAIYA · SHASHTHI DEVI, guardian of children · DEVI BHAGAVATA
  PURANA 9.46.
- **J –61.8 the meaning.** One held frame from behind: the sun high (rising), then it sinks and the sky turns to dusk
  (the one who sets), then it climbs back into dawn (he will rise again).
- **K –67.0 the ask.** The ghat at dawn, everyone's soop raised: YOUR GHAT?; then जय छठी मैया · JAI CHHATHI MAIYA!
- **Card –73.5.** NEW · A COMIC FROM RISHI KATHA: the Ashwatthama cover, "The man who cannot die · CHIRANJEEVI 1",
  rishikatha.com, "Out now · link in bio · Follow @therishikatha". No price.

## Files
`src/scenes/chhath.js` (shots), `chhath_sets.js` (SET: the ghat: a sky and a water shader sharing one sky function,
palettes that blend (dusk, night, predawn, dawn, day), the sun's elevation as a number, a planar reflection pass, the
vratis (`vrati3`), soops, baskets, sugarcane kosis, diyas, mist; AANGAN: the courtyard, day 1's meal, day 2's stove),
`chhath_base.js` + `chhath_props.js` (helpers from ads 87/91/92), `chhath_tl.js`, `chhath_vo.js`, `chhath_cover.js` +
`cover.html`, `chhath_lab.js` + `lab.html` (framing tests, not in the reel); `tools/chhath_vo.json`,
`tools/chhath_sfx.mjs`; `assets/chhath_vo.wav`, `chhath_sfx.wav`, `chhath_mix.wav` (−14 LUFS);
`assets/rk/ashwatthama_cover.jpg` (the comic's lettered cover, from `comic/1-ashwatthama`).
