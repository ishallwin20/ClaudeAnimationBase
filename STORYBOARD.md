# Ad 114 · "One moon": Thailand floated lamps… for GANGA

3D style + VO (girish_en_devotional, pace 1.28) + Lyria score + SFX, 71.1 s. Built 25 Nov 2026, the day after the full
moon of Kartik (24 Nov 2026), when Loy Krathong / Yi Peng, Dev Deepawali and Karthigai Deepam all fell on one night.
Follows ad 110 (Deepam, viral): Arunachala is ad 110's world. Card: the Navadurga Set (no price).

## Beats (the captions are the script: tools/onemoon_vo.json)
| t | caption | picture |
|---|---|---|
| 0 | LAST NIGHT, THAILAND floated lamps… for GANGA. | the Thai river at night: a krathong in front, hundreds drifting, sky lanterns, a lit prang, the full moon (frame 0 finished) |
| 3.5 | They call her PHRA MAE KHONGKHA. MOTHER GANGA. | push in to the krathong; พระแม่คงคา; tilt up to the lanterns: ยี่เป็ง Yi Peng |
| 8.3 | The SAME night, KASHI lit its ghats for the gods. | match cut on the moon → the ghats of Kashi lined with lamps; देव दीपावली |
| 13.2 | And ARUNACHALA lit its FIRE. | match cut on the moon → ad 110's Arunachala, the Maha Deepam; கார்த்திகை தீபம் |
| 16.5 | 2,000 KM apart. Same night. Same MOON. | the Bay of Bengal relief map at night: beams at Kashi, Arunachala, Bangkok, Chiang Mai; the arc Kashi → Bangkok |
| 20.6 | Coincidence? / Thailand's own king, RAMA IV, wrote that this festival began as a HINDU one. | push in to Thailand, its outline glows; RAMA IV · King Mongkut, 1863 |
| 27.5 | It came across the SEA. / On this full moon, ODISHA still floats tiny lamp BOATS… | before dawn: little bark boats with paper sails and lamps; ବୋଇତ ବନ୍ଦାଣ Boita Bandana |
| 32.9 | for its old sailors, who sailed to BALI and JAVA. | the map: the route from Odisha through the Malacca strait to Sumatra, Java, Bali; boats sailing |
| 37.3 | They carried a SCRIPT: Thailand's first letter comes from our KA. | Kanchipuram (Pallava) → Angkor (Khmer) → Sukhothai (Thai); क → ก |
| 42.6 | A CITY: AYUTTHAYA, named after AYODHYA. | the arc Ayodhya → Ayutthaya; अयोध्या, อยุธยา |
| 46.6 | And songs: Bangkok's royal priests still chant TAMIL hymns to SHIVA. | the prang close, lit gold; திருவெம்பாவை Tiruvempavai |
| 52.7 | So last night, under ONE full moon… | three moon-matched cuts: Thailand, Kashi, Arunachala |
| 55.1 | one old FAMILY lit the SAME lamp. | the whole bay at night, every place lit, the moon rising |
| 59.8 | Where did YOU light yours? Comment your CITY. | back to the krathong, the camera rises; ONE MOON |
| 64.6 | card | rkCardCine: MEET OUR GODS, the Navadurga Set is out now, link in bio |

## Facts used
- **Dates.** Loy Krathong: the full moon of the 12th Thai month, 24 Nov 2026 (Wikipedia, Loy Krathong infobox; TAT News
  lists 24 Nov events). Yi Peng: the full moon of the 2nd Lanna month = the 12th Thai month (Wikipedia, Yi Peng).
  Dev Deepawali / Kartik Purnima: 24 Nov 2026 (panchang sites; the tithi ran to 8:23 PM IST). Karthigai Deepam: the Maha
  Deepam lit ~6 PM on 24 Nov 2026 (ad 110).
- **"for Ganga" / Phra Mae Khongkha.** "Many Thais use the krathong to thank the Goddess of Water, the Hindu Goddess Ganga,
  Phra Mae Khongkha (พระแม่คงคา)" (Wikipedia, Loy Krathong, History). Other meanings (honouring the Buddha, letting go of
  bad luck) exist; the hook says what the lamps are for, the second line names her.
- **Rama IV, 1863.** "According to King Rama IV, writing in 1863, it was a Hindu festival that was adapted by Thai Buddhists"
  (Wikipedia, Loy Krathong). Historians (Pasuk & Baker) call it "a complex mix of Khmer Brahminism and local water rites";
  the Nang Nopphamat origin story is a Bangkok-period fiction, so it is not used.
- **Boita Bandana.** On Kartik Purnima Odias float miniature boats with lamps in memory of the sadhabas, mariners who sailed
  in boitas to Bali, Java, Sumatra (and Borneo, Sri Lanka) (Odisha Review, Nov 2017 "Bali Yatra"; OdishaTV; Organiser,
  5 Nov 2025; Wikipedia, Boita Bandana / Bali Jatra). "On this full moon" = the floating, not a claim that every voyage
  started that night.
- **The script.** Thai script ← Old Khmer ← Pallava script of South India (a southern Brahmi script) (Wikipedia, Thai script;
  Sukhothai script; Pallava script). ก (ko kai) is the first Thai consonant and the ka of that line. The Pallava glyph is
  drawn in a Grantha font (Grantha descends from Pallava).
- **Ayutthaya** is named after Ayodhya (standard; Thai อยุธยา from Sanskrit Ayodhyā).
- **The Tamil hymns.** The Thai royal Brahmins chant the Tamil Tiruvempavai (Manikkavacakar, to Shiva) and Tiruppavai
  (Andal, to Vishnu) in Tamil at the Triyampawai-Tripawai ceremony at Bangkok's Devasathan / Giant Swing (Wikipedia,
  Triyampawai ceremony; Giant Swing; Hinduism Today, "Siamese Brahmins assist the king"). The caption says "to Shiva".
- **Distance.** Varanasi–Bangkok ≈ 2,240 km great-circle; Tiruvannamalai–Bangkok ≈ 2,300 km ("2,000 KM", "2,000+ KM").

Kept out: "Loy Krathong comes from Diwali" (uncited); "ancient kings migrated" as a claim (Kaundinya and the Naga
princess Soma, Funan's founding legend, is real but Cambodian: it went to the pinned comment as a teaser); Bon Om Touk
(Cambodia cancelled it in 2026); Myanmar's Tazaungdaing (date not checked).

## Build
- `src/scenes/onemoon_sets.js`: RV (river: thai / kashi / boita, sky + water shaders, planar reflections, krathong3,
  boita3, boat3, sky lanterns, the prang, Kashi's ghats and palaces) and MP (the Bay of Bengal map from
  `src/data/bay_dem.js`, made with `node tools/terrain.mjs --name=bay --bbox=58,-11,124,40 --z=6 --res=.035`; Thailand's
  outline `src/data/bay_geo.js` by `tools/onemoon_geo.mjs`; edges fade into the fog).
- `src/scenes/onemoon_aru.js`: ad 110's world (SET → ARU, pillar3 → arPillar3).
- Score: Lyria take 1 (70.9 s) slowed to .965 (`assets/onemoon_score_cut.wav`); mix in `tools/onemoon_sfx.mjs`.
