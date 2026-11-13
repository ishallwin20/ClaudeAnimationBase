# "Your palm has FOUR holy places. One of them belongs to the DEAD." (ad 92 · 3D)

A 71.2 s explainer in the **3D** style (owner, 13 Nov 2026, picked #3 from a pitch list of six: "Your hand has FOUR holy
spots. You may be using the wrong one"). The shape that won ads 50/54/69: something almost every Hindu already does
with their body (achaman, charanamrit, offering water), a number, a "have I been doing it wrong?" sting, a sourced rule,
and a numbered ask. English VO (Sarvam `girish_en_devotional`, pace 1.15), karaoke captions, SFX under it (music added
on Instagram), the Navadurga card (no price). Matte look, no fx bloom, cine.js bloom .1, DOF.

**The idea:** the Dharma Shastras map four tirthas (holy "places", the parts of the palm that hold water) onto the right
hand, each belonging to someone: the fingertips to the gods, below the little finger to Prajapati, the root of the thumb
to Brahma, between the thumb and the first finger to the ancestors. Water for the dead is poured from that last one, so
you never sip from it. The hook ("one of them belongs to the DEAD") is the twist; the payoff is a rule people can use at
the next puja (sip three times from the thumb's root); the ask is a number (1, 2, 3 or 4) everyone can comment.

## Facts used
Translations: Manusmriti with Medhatithi's commentary, tr. Ganganatha Jha (1920), on
[wisdomlib](https://www.wisdomlib.org/hinduism/book/manusmriti-with-the-commentary-of-medhatithi/d/doc145649.html)
(2.58–2.61 and Jha's comparative notes, which quote Yajnavalkya 1.19 and Vishnu Smriti 62).

| claim in the reel | source |
|---|---|
| The palm has four tirthas, named in the law books: Manu, Yajnavalkya, Vishnu | Manu 2.58–59; Yajnavalkya 1.19 (*kaniṣṭhā-deśiny-aṅguṣṭha-mūlāny agraṃ karasya ca / prajāpati-pitṛ-brahma-deva-tīrthāny anukramāt*); Vishnu Smriti 62.1–4. Medhatithi: "tirtha" here is figurative, the part of the hand that holds the water |
| One: the fingertips, the gods' tirtha | Manu 2.59 *agre daivam*; Yajnavalkya 1.19 *agraṃ karasya* = deva; Vishnu 62 |
| Water offered to the gods flows off here | the deva tirtha's use in tarpan (water to the devas over the fingertips; tarpan manuals, after the Linga Purana as cited there). The verse names the place "the gods'"; the reel shows the use |
| Two: below the little finger, Prajapati's (the Creator's), *kaya* | Yajnavalkya 1.19 (root of the little finger = Prajapati); Vishnu 62.1; Kulluka, Narayana, Raghavananda on Manu 2.59. **Medhatithi reads Manu's *aṅgulimūle* as the root of all the fingers**: noted in the pinned comment |
| Three: the base of the thumb, Brahma's | Manu 2.59 *aṅguṣṭhamūlasya tale brāhmaṃ*; Yajnavalkya 1.19; Vishnu 62 |
| The first choice to sip from; when you sip, use three; one or two only if you must | Manu 2.58 *brāhmeṇa… tīrthena nityakālam upaspṛśet / kāyatraidaśikābhyāṃ vā* (sip always with Brahma's, or with Prajapati's or the gods'); the digests (Viramitrodaya) prefer Brahma's "as far as possible" |
| Four: between the thumb and the first finger, the ancestors' (Pitri) | Manu 2.59 *pitryaṃ tayor adhaḥ* (Medhatithi: below the thumb and the index finger); Yajnavalkya 1.19 and Vishnu 62.4 put it at the root of the index finger; Baudhayana 5.1 also between the thumb and the forefinger. The marker sits on the web, which covers both readings |
| Water for the dead is poured from here (water and sesame, in tarpan) | Medhatithi on 2.58: the pitrya tirtha is the one for "the offering of water and such other rites for the Pitṛs"; sesame with water in pitri tarpan is the standard rite |
| From four? Never. Not once. | Manu 2.58 *na pitryeṇa kadācana* (on screen); Medhatithi: not even when the other parts of the hand are hurt |
| Sip three times, then wipe the lips twice | Manu 2.60 *trir ācāmed apaḥ pūrvaṃ dviḥ pramṛjyāt tato mukham*; Yajnavalkya 1.20; Vasishtha 3.29 |
| Water not hot, not foaming | Manu 2.61 *anuṣṇābhir aphenābhir adbhiḥ*; Yajnavalkya 1.20 |

Not said (kept out on purpose): the caste lines of 2.58 and 2.62 (who "vipra" covers; how far the water must reach for
each varna); the direction to face (north or east, 2.61; the set faces east only as a picture of dawn); the gokarna
(cow's-ear) cupping; the claim that "most people sip wrong" (the ask asks instead). Commentators disagree on where kaya
and pitrya sit: the pinned comment says so.

## Voiceover (tools/palm_vo.json; captions are the script)
```
hook   Your PALM has | FOUR holy places. / ONE of them | belongs to the DEAD.
src    Not palm reading. | Each one is a TIRTHA, / named in the old law books: | MANU, YAJNAVALKYA, VISHNU.
one    ONE: the fingertips. | The GODS' tirtha. / Water offered to the gods | flows off HERE.
two    TWO: below the little finger. | PRAJAPATI'S, the Creator's.
three  THREE: the base of the thumb. | BRAHMA'S tirtha. / The FIRST choice | to SIP from.
four   And FOUR: | between thumb and first finger. / The PITRI tirtha. | The ANCESTORS'. / Water for the DEAD | is poured from HERE.
rule   So when you SIP: | use THREE, | the thumb's base. / ONE or TWO | only if you must. / But FOUR? | NEVER. Not ONCE.
how    Sip THREE times | from the thumb's base, / water not hot, | not FOAMING, / then wipe your lips TWICE.
ask    Which one have YOU | been sipping from? / Comment | 1, 2, 3 or 4! / And SAVE this | for your next puja.
```
Spoken (tts): teertha, Yaagyavalkya, Prajaapati, Brahmaa, pooja. Speech-to-text (whisper small) on every line: all
right. The ask's and the rule's word times are measured (whisper + silencedetect) and patched in `palm_tl.js`; the caption line breaks
are re-set in `palm.js` (`BR`) so no caption runs past three lines.

## Shots (times from the voice: src/scenes/palm_tl.js)
- **A 0–4.7 hook.** Frame 0: your right hand, palm up over a river at dawn (lamp bokeh, glints), a red kalava on the
  wrist, the four tirthas lit gold and numbered. On DEAD the fourth turns cold blue-white, the others dim, the camera
  pushes to the web of the thumb: THE DEAD.
- **B –13.1 the source.** A low POV over the wrist toward the sunrise; PALM READING struck out; तीर्थ; Manu 2.59 on screen
  (Devanagari + English); tags MANUSMRITI 2.59 → YAJNAVALKYA 1.19 → VISHNU SMRITI 62.1–4.
- **C –20.2 one.** Close on the fingertips, DEVA TIRTHA; a copper lota swings in from the left and pours into the palm;
  the hand tips forward and water runs off all four fingertips (side view): TO THE GODS.
- **D –24.4 two.** From the little finger's side: PRAJAPATI, the Creator's (kaya).
- **E –31.0 three.** From the thumb's side: BRAHMA TIRTHA; water gathers there as the hand tilts: SIP FROM HERE, a tick.
- **F –39.3 four.** The light goes cold: PITRI TIRTHA, the ancestors'; water and black sesame gather; the hand tips to the
  thumb side and the water runs off the web, down to the river: FOR THE DEAD.
- **G –48.2 the rule.** The whole hand, WHEN YOU SIP: BEST and a tick on 3 (it flares gold), a grey OK on 1 and 2 as
  they're named; on FOUR the marker turns red, a big cross, NEVER with न पित्र्येण कदाचन · Manusmriti 2.58. (Re-cut
  13 Nov after the owner and the owner's wife found the first version unclear: "Fingertips, or little finger, if you must"
  never said *sip*, and three equal ticks didn't rank the spots.)
- **H –54.8 how.** POV: the hand rises to your lips three times, a count 1·2·3; NOT HOT, NO FOAM, WIPE THE LIPS × 2.
- **I –64.2 the ask.** The whole hand, WHICH ONE?, the numbers pop as spoken (GODS, CREATOR, BRAHMA, ANCESTORS), SAVE THIS.
- **Card –71.2.** The Navadurga card, no price.

## Files
`src/scenes/palm.js` (shots), `palm_hand.js` (the hand: a signed-distance field meshed at load with surface nets, 1 mm
cells, creases pressed in, skin per vertex), `palm_sets.js` (SET: the river at dawn, lamps, glints, the kalava, the water
in the palm, the lota and its pour, the falling streams and drops, sesame, the four markers), `palm_base.js` +
`palm_props.js` (helpers from ads 87/91), `palm_tl.js`, `palm_vo.js`, `palm_cover.js` + `cover.html`;
`tools/palm_vo.json`, `tools/palm_sfx.mjs`; `assets/palm_vo.wav`, `palm_sfx.wav`, `palm_mix.wav` (−14 LUFS).
`lab.html` + `palm_lab.js`: the framing test page used to pick the camera angles (not in the reel).
