# This temple was never BUILT. It was CARVED from ONE rock. (reel/kailasa-ellora)

The first temple-architecture reel (the owner's trial of a temple explainer series). A Cinematic reel (see
CINEMATIC_GUIDE.md), 79.7 s, 9:16, with a voiceover: the English narrator from the Ganga reel (Sarvam
`girish_en_devotional`, pace 1.2), a synthesized SFX track and a Lyria score ducked under the voice. It ends on a
follow card with no offer. The temple is drawn as a lit stone model (`src/cine_temple.js`: an axonometric renderer and
the Kailasa model, which can be dug and carved from the top down), so the method itself can be shown: three trenches,
the island of rock, the tower, then the halls, then the floor.

```
Logline: The Kailasa temple at Ellora wasn't built from blocks; it was cut out of one hill of basalt, 1,200 years ago.
         They cut three trenches down into the hill, left an island of rock and carved it from the top down: the tower
         first, then the halls, then the floor they stood on. Up to 200,000 tonnes of rock came out by hand, and nothing
         could be put back. What stayed: a shrine over 30 m tall on a plinth of elephants, Nandi's pavilion joined by a
         rock bridge, Ravana lifting Kailash on its wall. A copper plate of 812 says the gods in their sky-chariots were
         struck with wonder ("this temple made itself"), and its architect asked: "Oh, how was it that I built it?"
Why it should travel: Kailasa is the most viral Indian temple online (the "how was this possible?" hook); the reel
         shows HOW, step by step, which the photos can't; it closes on a real 1,200-year-old quote; and the ask feeds
         the series (viewers name the next temple).
Comment: "Which temple should we explain NEXT? Comment its name!"
Pinned:  "Brihadeeswarar? Konark? Meenakshi? Kedarnath? Name the temple you want next 👇"
```

## Facts used (every claim, with its source)
- The Kailasa temple is Cave 16 at Ellora (Maharashtra), a UNESCO World Heritage Site; it is the largest monolithic
  rock-cut excavation in the world and is dedicated to Shiva: ASI, Ellora Caves page (asi.nic.in); Guinness World
  Records, "Largest monolithic building".
- Named for and designed to recall Mount Kailash, Shiva's abode ("Shiva's mountain, in stone"): Wikipedia, Kailasa
  temple, Ellora (with its sources).
- 8th century, generally attributed to the Rashtrakuta king Krishna I (r. c. 756–773): ASI; Wikipedia (which notes the
  attribution isn't completely certain; the reel doesn't name a king). "1,200 years ago" rounds c. 760.
- Carved out of the rock, not built: no blocks, no mortar (a monolith): ASI; Guinness.
- Three huge trenches cut at right angles straight down into the hillside, leaving an isolated island of rock, which
  was then carved: Percy Brown's description, as quoted by the Ministry of Culture's Indian Culture portal
  (indianculture.gov.in, "Kailasa: majestic temple, Ellora").
- Carved from the top down ("carvers started at the top of the original rock and excavated downward"), standing on the
  rock not yet removed: Wikipedia; Indian Culture portal.
- 150,000–200,000 tonnes of rock removed ("up to 200,000"): Guinness. By hand: chisels and hammers (M. K. Dhavalikar's
  estimate of the labour assumes hand cutting, ~4 cu ft a person a day), via Wikipedia.
- "Nothing could be added back. Every strike was final.": the consequence of carving a monolith (nothing is assembled),
  not a quoted claim.
- Over 30 m tall: 32.6 m above the courtyard (Wikipedia); "30 m (100 ft) at its highest point" (Guinness).
- The plinth carved so that elephants seem to hold the temple up: Wikipedia ("elephants are holding the structure
  aloft").
- Nandi in his own mandapa in front of the main shrine, joined to its porch by a rock bridge: Wikipedia.
- The relief of Ravana lifting (shaking) Mount Kailash, Shiva and Parvati above: Wikipedia; it is the famous
  Ravananugraha panel of Kailasa (its exact date is debated; the reel doesn't date it).
- The Baroda (Vadodara) copper-plate grant of Karkaraja II, c. 812–813 CE, describes Krishnaraja's temple on the hill
  at Elapura (Ellora): "on seeing which the best of immortals who move in celestial cars, struck with astonishment,
  think much constantly, saying, 'this temple of Shiva is self-existent; in a thing made by art such beauty is not
  seen'", and its architect-builder "was himself suddenly struck with astonishment, saying 'Oh, how was it that I built
  it?'": J. F. Fleet's translation (Indian Antiquary); ASI ("even the architect who caused it was wonder struck that he
  could build it"). Most scholars take it to mean the Kailasa (Wikipedia).

Not claimed: the popular "built in 18 years", "no debris found", "Aurangzeb's 1,000 men for 3 years" and alien
stories (unsourced or false); the legend of Kokasa and the queen's vow (Katha-Kalpataru, a late text; left out). The
drawing is a simplified model (proportions from the published dimensions; the galleries, niches and the scale of the
corner shrines are schematic). The score's "Om Namah Shivaya" is a chant, not a claim.

## Voice and captions (the captions ARE the script, in `tools/kailasa_vo.json`; ~150 words)
| id | caption chunks (`|` = line break) |
|----|-----------------------------------|
| hook1 | This temple | was never BUILT. (64 px, lit at frame 0) |
| hook2 | It was CARVED | from ONE rock. (68 px) |
| name | *Kailasa*, at *Ellora*. | *Shiva's* mountain, | in stone. |
| none | No bricks. No blocks. | No mortar. → Just one hill | of solid rock. |
| trench | 1,200 years ago, they | cut three trenches → straight down | into the hill, |
| island | and left an island | of rock standing. |
| topdown | Then they carved | that island | from the TOP down. |
| order | The tower first. | Then the halls. → Then the floor | they stood on. |
| tonnes | Up to | 200,000 TONNES | of rock → cut away | by HAND. |
| final, final2 | Nothing could be | added back. → Every strike | was FINAL. |
| reveal | What remained: | a shrine over | 30 metres tall, |
| elephants | held up by | stone ELEPHANTS. |
| nandi, nandi2 | *Nandi* in his | own pavilion, → joined by | a bridge of rock. |
| ravana | And on its wall, | *Ravana* lifting | Mount *Kailash*. |
| plate | A copper plate | from the year 812 → says the gods | in their sky-chariots → were STRUCK | with wonder: |
| gods, gods2 | "This temple | made ITSELF. → Such beauty is | never man-made." |
| arch | Even its architect | was stunned: |
| archq | "Oh, how was it | that I BUILT it?" (64 px, pace .95) |
| ask, ask2 | Which temple | should we explain | NEXT? → Comment its name! (y 600) |

Every take was checked with Sarvam STT (saaras:v3): all lines came back as written ("Kailasa" spelled "Kailaasa" for
the voice). Chunks under 2 s were merged or given pauses; the three-line chunks get 3.2 s or more.

## Shots (times from TL, `src/scenes/kailasa_tl.js`)
| # | beat | picture | palette |
|---|------|---------|---------|
| 1 | hook | the finished temple in its pit at dawn, from above, slowly orbiting; "CARVED": a flash and dust | dawn |
| 2 | name | low and frontal; Mount Kailash rises ghostly in the sky behind | gold |
| 3 | none | gold line drawings (a brick wall, a stone block, a trowel), each struck through on its word | dark rock |
| 4 | hill | the untouched hill above the valley | dawn |
| 5 | trench | from above, the three trenches cut down one after another; the island outlined in light | dawn |
| 6 | topdown, order | the island carved down level by level (tower, halls, floor), carvers and lamps on the cut | dawn |
| 7 | tonnes | four carvers in silhouette on a ledge at dusk, striking in turn; the half-cut tower behind | dusk |
| 8 | final | the chisel and mallet, close: three blows, the fourth breaks a chip that falls away; FINAL flash | lamp |
| 9 | reveal | the finished shrine, tiny people for scale, a "30 M" height mark | gold |
| 10 | elephants | the plinth's elephants in a row, lamp-lit | lamp |
| 11 | nandi | the black stone Nandi between carved pillars | lamp |
| 12 | bridge | a cutaway close on the Nandi mandapa and the bridge, a light running along it | gold |
| 13 | ravana | the relief: Ravana's twenty arms under the mountain, Shiva and Parvati on top, all stone, in a niche | torch |
| 14 | plate | the copper plate, a light sweeping the engraved lines, its seal | lamp |
| 15 | gods | three sky-chariots gliding over clouds, slowing over the temple's glow | night to gold |
| 16 | quote | the temple by moonlight, lamps lit, a gold swell on "ITSELF" | moon |
| 17 | arch | the architect from behind before the temple, his hands lifting; "BUILT": the biggest flash | gold |
| 18 | ask | the temple at night, every lamp lit | night |
| 19 | card | the follow card: logo, KAILASA, ELLORA, the model turning in gold light, Follow @therishikatha | teal |

## Sound
`tools/kailasa_sfx.mjs` (same TL): a hit on frame 0, dawn wind, a chisel strike + hit + sub on "CARVED"; a temple bell
and om; strike-throughs on bricks/blocks/mortar; picks and chisels and rockfalls through the trenches and the carving
(a rockfall on each level); the four carvers' blows on their mallets; the chisel close-up's three blows, the chip
breaking and clinking far below, a heavy hit on FINAL (the score drops away under it); a conch on the reveal; lamps
and bells; the mountain groaning under Ravana; a metallic shimmer over the plate; high wind and chimes for the gods, om
on "struck with wonder"; the biggest hit and a conch on "BUILT"; crickets and bells at night; chimes on the card.
Score: Lyria take 3 of `tools/kailasa_score.txt` (90 BPM, 30 bars, 80 s brief; 87.6 s back, a hit on the first beat),
trimmed to the reel and faded, side-chain ducked under the voice; loudnorm −14 LUFS.

## Files
- `src/cine_temple.js` (shared, on main): `isoCam`, `box`/`frustum`/`oct`, `isoDraw`, `kailasaSolids`, `ellora`,
  `TEMPLE_PAL`, `elephantFront`, `copperPlate`, `carver`, `chiselClose`
- `src/scenes/kailasa.js`, `kailasa_props.js` (skies, `lineIcon`, `ravanaRelief`, `nandiPavilion`, `sthapati`,
  `heightMark`), `kailasa_tl.js`, `kailasa_vo.js`, `kailasa_cover.js`
- `tools/kailasa_vo.json`, `tools/kailasa_sfx.mjs`, `tools/kailasa_score.txt`
- `assets/kailasa_vo.wav`, `kailasa_sfx.wav`, `kailasa_mix.wav`, `kailasa_score.mp3`; raw takes in `assets/vo/kailasa/`

## Render
```
node tools/sarvam_tts.mjs --script=tools/kailasa_vo.json
node tools/kailasa_sfx.mjs
rm -rf out/frames && node render.mjs --frames --workers=4 && node render.mjs --encode --out=out/kailasa_out/kailasa.mp4
node render.mjs --page=cover.html --stills=0 --out=out/kailasa_out   (t0_00.png → cover.png)
```
Deliverables in `out/kailasa_out/`: `kailasa.mp4`, `cover.png`, `captions.txt`.

## Instagram caption
See `out/kailasa_out/captions.txt` (also below).

Can you carve a whole temple out of ONE rock? 🛕 At Ellora, 1,200 years ago, they did. Kailasa was never built. It was
carved.

No bricks, no blocks, no mortar: just one hill of basalt. The carvers cut three giant trenches straight down into the
hill, left an island of rock standing, and carved it from the TOP down: the tower first, then the halls, then the very
floor they stood on. Up to 200,000 tonnes of rock came out by hand, and nothing could be added back.

What remained: a shrine over 30 m tall on a plinth of stone elephants, Nandi in his own pavilion joined by a bridge of
rock, and Ravana lifting Mount Kailash on its wall.

A copper plate from 812 CE says the gods in their sky-chariots were struck with wonder: "This temple made itself." And
its architect asked, "Oh, how was it that I built it?" 🙏

Which temple should we explain next? Comment its name 👇 Save this for your Ellora trip, and share it with someone who
loves temples.

More temples and stories of Shiva: follow @therishikatha · rishikatha.com (link in bio)

#kailasatemple #ellora #elloracaves #kailashtemple #templearchitecture #indianarchitecture #ancientindia #mahadev
#shiva #harharmahadev #rockcut #unesco #maharashtra #incredibleindia #rishikatha
