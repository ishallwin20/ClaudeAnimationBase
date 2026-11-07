# "Your grandmother hung MANGO LEAVES over the door. She wasn't decorating." (ad 82 · 3D)

A 51.7 s explainer in the **3D** style (owner, 7 Nov 2026: hook ideas on why we hang torans, "direct the next viral reel";
picked 3D with the Girish VO). Built the day before Lakshmi Puja (8 Nov 2026), when every home is tying one.

**The idea:** nostalgia + a reveal. Hook 3 from the owner's list, tightened into a statement with a twist ("She wasn't
decorating"). The answer is in the word and in two Bhagavata homecomings: a toran is a *torana*, a gateway; when Dhruva
and Krishna came home, every gate and door was dressed for them. So a toran says "someone we love is coming home", and
this Diwali that's Lakshmi. The ask is a regional call-out (mango leaves, marigolds or beads, comment your state), and
a share prompt aimed at the person who ties it ("Send this to the one who ties yours").

English VO (Sarvam `girish_en_devotional`, pace 1.2), karaoke captions, SFX under it (music added on Instagram), the
Navadurga card (no price). Matte look: no fx bloom, cine.js bloom .14, DOF and a gentle warm grade.

## Facts used
| claim in the reel | source |
|---|---|
| A toran is named from *toraṇa*, the Sanskrit word for a gateway | Monier-Williams *toraṇa*: "an arched doorway, portal, gateway" ([wisdomlib](https://www.wisdomlib.org/definition/torana)); [Wikipedia: Torana](https://en.wikipedia.org/wiki/Torana) |
| The stone gateways of the Great Stupa at Sanchi are toranas, c. 1st century BCE | the four Sanchi toranas date from the 1st century BCE to the early 1st century CE ([Wikipedia: Torana](https://en.wikipedia.org/wiki/Torana), [Sanchi](https://en.wikipedia.org/wiki/Sanchi)); shown as "c. 1st century BCE" |
| In the Bhagavatam, little Dhruva left home crying | Bhagavata 4.8: hurt by his stepmother Suruchi's words, the boy goes weeping to his mother Suniti, then leaves for the forest ([vedabase 4.8](https://vedabase.io/en/library/sb/4/8/)) |
| Dhruva became the Pole Star | Bhagavata 4.9.20–25: Vishnu grants him Dhruvaloka, the pole star round which the planets turn ([vedabase 4.9](https://vedabase.io/en/library/sb/4/9/)) |
| When he came back, every gate had mango leaves, pots of water and burning lamps | Bhagavata 4.9.55: *cūta-pallava-vāsaḥ-sraṅ-muktā-dāma-vilambibhiḥ / upaskṛtaṁ prati-dvāram apāṁ kumbhaiḥ sadīpakaiḥ*: "at each and every gate… big waterpots [full of water]… burning lamps… hanging mango leaves" (also cloth, garlands, pearl strings, all shown) ([vedabase](https://vedabase.io/en/library/sb/4/9/55/)) |
| When Krishna came home to Dwarka, every door wore a torana | Bhagavata 1.11.13: *gopura-dvāra-mārgeṣu kṛta-kautuka-toraṇām*: festive toranas at the city gates, the doors and the roads, with flags (*dhvaja-patākā*) ([vedabase](https://vedabase.io/en/library/sb/1/11/13/)). The Sanskrit has no mango here, so the reel says only "torana" and shows arches, flags and leaves |
| The same leaves crown the kalash at every puja | common practice (the purna kumbha with mango leaves and a coconut); 4.9.55 itself pairs the leaves with water pots at the gates |
| This Diwali, that's Lakshmi | practice, not scripture: Lakshmi is welcomed into homes on Diwali night (Lakshmi Puja); the footprints drawn walking in are a custom. The reel never says a toran is required for her to come |

Not said (kept out on purpose): mango leaves "purify the air", "release oxygen", "absorb negative energy"; Lakshmi only
enters homes with a toran; mango leaves at Ayodhya on Ram's return (Valmiki's Yuddha 127 names flags and decoration,
not mango leaves); any region owning one style. Marigold strands and beaded bandhanwars are shown as what homes hang,
not tied to states.

## Voiceover (tools/toran_vo.json; captions are the script)
```
hook     Your grandmother hung | MANGO LEAVES over the door. / She wasn't | DECORATING.
toran    It's called a TORAN, | from TORANA: / the Sanskrit word | for a GATEWAY.
leave    In the BHAGAVATAM, | little DHRUVA | left home crying.
back     When he came back, | EVERY GATE in the city / had MANGO LEAVES, | pots of water | and burning LAMPS.
dwarka   When KRISHNA came home | to DWARKA, / every door wore | a TORANA.
kalash   The same leaves | crown the KALASH | at every puja.
never    So it was never | decoration. / It says: | SOMEONE WE LOVE | is coming home.
lakshmi  This Diwali, | that's LAKSHMI.
ask      MANGO LEAVES, | MARIGOLDS | or BEADS? / What's on YOUR door? | Comment your STATE!
send     SEND this | to the one who ties yours.
```
Spoken (tts): Bhaagavatam, Dhruv, Dwaarka, कलश in Devanagari (owner: "kulush" sounded wrong; "kalash", "kallash" came back as "Kailash"),
"toranaa" (the plain spelling dropped its final vowel). Speech-to-text (Sarvam saarika:v2.5) on every take: all right.

## Shots (times from the voice: src/scenes/toran_tl.js)
- **A 0–6 hook.** A house front in morning sun: ochre lime wall with a painted border, a teak double door, the mango
  toran over it, swaying. Frame 0 is finished. On DECORATING a push into the leaves; on TORAN the word over them.
- **B –8.8 torana.** Dissolve to Sanchi's north gateway in sandstone (elephant capitals, three scrolled architraves,
  the dharmachakra), the stupa behind; तोरण · TORANA · a gateway; GATEWAY; the Sanchi tag.
- **C –12.6 Dhruva leaves.** A bare street at blue dusk, child's-eye height, drifting back from the palace gate; cold grade.
  DHRUVA, "who became the Pole Star"; Bhagavata 4.8.
- **D –18.9 he comes back.** Warm dusk, tracking along the gates: each gets its toran (on EVERY GATE, a wave), cloth swag
  and pearls, two copper pots (POTS), lamps (LAMPS); the verse 4.9.55 in Devanagari and English.
- **E –23.2 Dwarka.** Day; festive arches with mango leaves and pennants rise across the street; a crane up; DWARKA and
  1.11.13.
- **F –27.3 kalash.** Home, morning: the kalash with five mango leaves and a coconut, a crane up to the toran.
- **G –32.7 never decoration.** Blue hour; six diyas light along the step; on SOMEONE WE LOVE the doors swing open on a
  warm room.
- **H –35.2 Lakshmi.** Gold footprints walk in over the rangoli to the threshold, an anklet's bells on each step.
- **I –40.3 the ask.** The toran swaps on the words: mango leaves, marigold strands, a beaded bandhanwar; YOUR STATE?
- **J –45.3 send.** The mango toran back, a slow push to the door.
- **Card –51.7.** The Navadurga card, no price.

## Files
`src/scenes/toran.js` (shots), `toran_sets.js` (HOME, SANCHI, CITY; `toran3()` mango / marigold / beads, `kalash3()`,
`diya3()`, `door3()`), `toran_base.js` + `toran_props.js` (helpers from ad 81), `toran_tl.js`, `toran_vo.js`,
`toran_cover.js` + `cover.html`; `tools/toran_vo.json`, `tools/toran_sfx.mjs`; `assets/toran_vo.wav`, `toran_sfx.wav`,
`toran_mix.wav` (−14 LUFS).
