# "This stone is 150 MILLION years old" (ad 61 · Books 1–3 · 3D, the film look)

A 75.4 s explainer in the **3D** style, the first reel on the engine upgrade (`src/cine3d_fx.js`: HDRI light, scanned
materials, depth of field, HDR bloom, light shafts, grade). The owner's pick after the Diwali trial (ad 58, 148k): the
Shaligram, "like worshipping a part of nature". The shape of the viral ads 50/54 (a thing people have at home, a sourced
rule, a twist) with a bigger hook: the stone on the altar is a 150-million-year-old fossil. Two stories of one stone: the
Purana's (Tulsi's curse, Vishnu a stone on the Gandaki's bank, creatures carving his chakras) and science's (an ammonite
of the Tethys sea, lifted into the Himalaya, washing out of the Kali Gandaki); they meet ("Same river. Same stone. Same
spiral."); a puja worships a piece of the Himalaya with tulsi and river water; the Gita's "of what stands still, I am the
Himalaya"; nature itself is sacred; never without tulsi. English VO (Sarvam `girish_en_devotional`, pace 1.35), karaoke
captions, synthesized SFX under it (music added on Instagram). Card: Books 1–3, set of 3 for ₹500.

## Facts used
| claim in the reel | source |
|---|---|
| Hindus worship the Shaligram as Vishnu himself | Devi Bhagavatam 9.24 (Vijnanananda tr., [sacred-texts](https://sacred-texts.com/hin/db/bk09ch24.htm)): "Where there is the Śālagrāma stone there exists Śrī Hari Himself"; a non-anthropomorphic form of Vishnu ([Wikipedia, Shaligram](https://en.wikipedia.org/wiki/Shaligram)) |
| Vishnu broke the heart of his devotee Tulsi; she cursed him: your heart is stone, become a stone | DB 9.24: "O Lord! Thou art like a stone. Thou hast no mercy. By hypocrisy Thou hast destroyed my chastity… and for that reason didst kill my husband… Thy heart is like a stone. So let Thee be turned into a stone." Her tapas for Narayana: Vishnu's reply (HBV quoting the Brahmavaivarta Purana, Prakriti Khanda: "For many years you underwent very difficult penances to achieve Me", [bvmlu.org](https://bvmlu.org/contemporary/aosat.htm)) |
| Vishnu accepted: she would be the river Gandaki and the tulsi plant, he a stone on her bank | DB 9.24: "This body of yours will be known by the name of Gaṇḍakī… Your hairs will be turned into sacred trees… Tulasī… I will be turned into stone by your curse; I will remain in India close to the bank of the river Gaṇḍakī." |
| Tiny creatures with sharp teeth will carve my chakras in them | DB 9.24: "Millions and millions of insects with their sharp teeth will make rings (the convolutions in the Śālagrāma…) representing Me"; the stones named by their chakras ("those that have one Chakra are called Sudarśanas") |
| A Shaligram is an ammonite, a sea creature turned to stone, from the Tethys sea | "a fossilized stone or ammonite from the prehistoric Tethys sea" (Wikipedia, Shaligram) |
| 150 million years ago, with the dinosaurs | the Spiti Shale ammonites of the Gandaki date "from the Early Oxfordian to the Late Tithonian… some 165–140 million years ago" ([Bristol Dino Project, guest post](https://dinoproject.blogs.bristol.ac.uk/?p=880); Blanford 1863: Upper Jurassic); the Late Jurassic is the age of the sauropods |
| India crashed into Asia; the sea floor rose and became the Himalayas | the Tethyan sediments were lifted when the Indian plate collided with Asia (~50 Ma); [Wikipedia, Geology of the Himalaya](https://en.wikipedia.org/wiki/Geology_of_the_Himalaya) |
| Today these fossils wash out of one river: the Gandaki (Muktinath on the map) | collected from the Kali Gandaki's bed in Nepal; sacred sites Muktinath and Damodar Kund (Wikipedia, Shaligram) |
| "Of all that stands still, I am the Himalaya" | Bhagavad Gita 10.25: *sthāvarāṇāṃ himālayaḥ* |
| A Shaligram is never worshipped without tulsi | DB 9.24: "He who worships the Śālagrāma stone without offering Tulasī leaves on it or separates the Tulasī leaves from the stone, will have to suffer…" |

Checked, not used: the Shiva Purana's Vrinda–Jalandhara variant (the reel follows DB 9.24 / the Brahmavaivarta); the
list of Shaligram types by chakra count (DB 9.24, a follow-up reel?); Tulsi Vivah (in the Instagram caption only; dates
vary 19–21 Nov 2026 by calendar).
Performance only (no claim): Tulsi and Vishnu as lights on a dark stage, the light hardening into the stone, the river of
light, the carving as a glowing front (the creatures not shown), the sauropod silhouettes on the shore, the split screen
"Purana | Science", the sea's crinoids and sponges (Jurassic sea life, not specific to the Gandaki beds).
Framing: "Same river. Same stone. Same spiral." says only what both name; it claims no prediction by the Purana.

## Shots (times from the voice: src/scenes/shaligram_tl.js)
A the stone on maroon cloth, gold light (frame 0: the hook up) · B the altar: brass plate, tulsi, lamps · C SHALIGRAM
(Devanagari + Cinzel), the light turns cold on SCIENCE · D the stage: the tulsi sprig, the tear; the curse; Vishnu's light
falls and becomes the stone · E the river of light, the bush grows, the stone on its bank · F the carving · G the stone
splits on its spiral · H the living ammonite, turning to stone · I the Tethys sea; up through the surface to the
Jurassic shore (over-under) · J the geology block: India into Asia, the layers fold into the Himalayas · K the real
Himalaya (DEM), the Gandaki drawn from Muktinath to the Ganga; down to the stone on the riverbed · L Purana | Science,
three beats · M the puja: leaves fall, the lota pours · N the Himalaya at dawn, Gita 10.25 · O the riverbed at golden
hour, a tulsi leaf drifting · P a leaf lands on the stone · Q the ask · R the card.

## Files
`src/scenes/shaligram.js` (shots), `shaligram_props.js` (the stone and its carve shader, the cut face, the ammonite, tulsi,
the chakra, light-beings), `shaligram_sets.js` (studio, altar, stage, sea, shore, strata, riverbed, Himalaya), `shaligram_tl.js`,
`shaligram_vo.js` (from the TTS tool), `shaligram_cover.js`, `tools/shaligram_vo.json`, `tools/shaligram_sfx.mjs` →
`assets/shaligram_sfx.wav`, `assets/shaligram_mix.wav`.
`rm -rf out/frames && node render.mjs --frames --workers=1 && node render.mjs --encode --out=out/shaligram_out/shaligram.mp4`
(~95 ms a frame); cover: `node render.mjs --page=cover.html --stills=0 --out=out/shaligram_out`, rename `t0_00.png` to `cover.png`.
