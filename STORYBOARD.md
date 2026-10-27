# "Count the lines on your RUDRAKSHA" (ad 56 · Books 1–3 · 3D)

A 69.2 s explainer in the **3D** style, in the shape of the viral ads 50 and 54: one practical thing a viewer already
owns and can check right away (the lines on their rudraksha), a number for each god from a source, a list to save, and
an identity ask ("comment your number"). A macro rudraksha over crimson velvet (bead3: a procedural seed with tubercles,
1–14 grooves, the bore), its lines lighting in gold as they're counted; the origin in a moonlit Himalayan clearing
(Shiva's face as a vision in the sky, his tear, the tree growing); the blue fruit opening on the seed; the count with a
gold halo per god; the heap of five-line beads; Kalagni's ring of fire; a mala of 108; the list of 14. English VO
(Sarvam `girish_en_devotional`, pace 1.2), karaoke captions timed to the voice, SFX under it (music added on
Instagram). Card: Books 1–3, set of 3 for ₹500.

## Facts used
| claim in the reel | source |
|---|---|
| Shiva sat in tapas for thousands of divine years; he opened his eyes and tears fell; from them grew the rudraksha trees | Shiva Purana, Vidyeshvara Samhita 25.5–7 (J. L. Shastri tr., [wisdomlib](https://www.wisdomlib.org/hinduism/book/shiva-purana-english/d/doc225964.html)): "Formerly I had been performing penance for thousands of divine years… I… just opened my eyes… Drops of tears fell… From those tear-drops there cropped up the Rudrākṣa plants." |
| Rudra + aksha = the eye of Rudra (Shiva) | the compound *rudra* + *akṣa* "eye" ([Wikipedia, Rudraksha](https://en.wikipedia.org/wiki/Rudraksha)) |
| Its fruit is blue; the bead is the seed (stone) inside | Elaeocarpus ganitrus: the ripe drupe is blue by structural colouration, not pigment (Wikipedia, Rudraksha) |
| 1 Shiva himself · 4 Brahma · 6 Kartikeya · 9 Durga in nine forms · 10 Vishnu (Janardana) · 12 the twelve Adityas · 14 the highest Shiva | Shiva Purana, Vidyeshvara Samhita 25.64–80 (Shastri): 1 "is Śiva Himself" (64); 4 "is Brahmā Himself" (68); 6 "is Kārtikeya" (71); 9 "presiding goddess is Durgā of nine forms" (74); 10 "is Lord Janārdana Himself" (76); 12 "all the twelve Ādityas (suns) are present therein" (78); 14 "is the highest Śiva" (80) |
| The list: 2 Isha, lord of the gods · 3 all learning · 5 Kalagni Rudra · 7 Ananga · 8 Bhairava · 11 Rudra · 13 Vishvedevas | ibid. 66 (two: "Īśa, the lord of devas"), 67 (three: "all lores become firmly established": no god named, so the list says ALL LEARNING), 69 (five: "Rudra Himself. Its name is kālāgni"), 72 (seven: "called Anaṅga"; Ananga is Kamadeva's epithet), 73 (eight: "Vasumūrti and Bhairava"), 77 (eleven: "is Rudra"), 79 (thirteen: "is Viśvedeva") |
| Almost every rudraksha has five lines | "Almost 99% beads are five loculed and are called as panch mukhi" ([Vikaspedia](https://en.vikaspedia.in/viewcontent/agriculture/crop-production/package-of-practices/medicinal-and-aromatic-plants/elaeocarpus-sphaericus), Govt of India); the reel says "almost every" |
| Chant on it and a mantra is a crore times stronger | ibid. 25.58: "A mantra repeated with Rudrākṣa is a crore times more efficacious" |

Checked and not used: the popular 3-mukhi = Agni and 2-mukhi = Ardhanarishvara (other texts, not this chapter), the
wearing counts (25.26–36), the colours by varna (25.12), the size grades (25.14–15).
Performance only (no claim): Shiva's face as a vision in the sky, one tear falling to the clearing (the text has many
tears), the gold halos and their signs (tripundra, lotus, vel, trishul, chakra, sun, crescent and damaru, fire), the velvet,
the heap on a brass plate, the mala of 108 with its meru and tassel.

## Voiceover (tools/rudraksha_vo.json; captions are the script)
hook "Count the lines on your RUDRAKSHA." · god "Each number belongs to a different GOD." · tapas · tears · trees · name
"RUDRA · AKSHA: the EYE of Shiva." · blue · count · one/four/six/nine/ten/twelve/fourteen · five "But almost every
rudraksha has FIVE lines. And FIVE is RUDRA himself: KALAGNI." · crore · save · ask "Now count YOURS. How many lines?
COMMENT the number!". Speech-to-text (saaras:v3) on every take came back right after rewording three ("aksha" →
"Akshaa", "Ten?" → "Ten.", "suns" → "sun gods", which was heard as "sons").

## Shots (times from the voice: src/scenes/rudraksha_tl.js)
A hook, the bead turning, its five lines glowing · B the numerals 1–14 ring it · C night clearing, Shiva in tapas in
the sky · D his eyes open, the tear falls · E it lands, a ring of light, the tree grows, more tears, more trees · F the
forest; रुद्र + अक्ष → रुद्राक्ष · G into the canopy to the blue fruit; it opens on the seed · H the lines trace top to
bottom · I the count: one shot per god (the bead turns to its N, the lines light and are ticked, the halo and sign, the
number) · J the heap of five-line beads, "5"; Kalagni: the ring of fire · K the mala, bead by bead, "× 1,00,00,000" ·
L the list of 14 (save frame), the ask · M the card.

## Files
`src/scenes/rudraksha.js` (shots), `rudraksha_props.js` (bead, studio, fruit, emblems, mala, heap, trees, forest),
`rudraksha_tl.js`, `rudraksha_vo.js` (from the TTS tool), `rudraksha_cover.js`, `tools/rudraksha_vo.json`,
`tools/rudraksha_sfx.mjs` → `assets/rudraksha_sfx.wav`, `assets/rudraksha_mix.wav`.
`rm -rf out/frames && node render.mjs --frames --workers=2 && node render.mjs --encode --out=out/rudraksha_out/rudraksha.mp4`
(~25 ms a frame); cover: `node render.mjs --page=cover.html --stills=0 --out=out/rudraksha_out`, then rename `t0_00.png`
to `cover.png`.
