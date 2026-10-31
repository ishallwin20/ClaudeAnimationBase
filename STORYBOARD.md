# Ad 68: "PARSHURAMA fought a DEMON ARMY with NO WEAPONS" (Parshurama series, Part 2)

A ~78 s Painted reel with Bangers captions, no voiceover, retro cartoon SFX and only a mild bed under the story. It
stands on its own (no Part 1 needed) and ends on the Navadurga card (no price).

**Pacing (owner, 31 Oct, after a viewer called Part 1 "too fast"):** Part 1 had 26 caption groups in 73 s, most up for
2.0–2.3 s, back to back. This one has **14 groups in ~74 s of story** (about 11 a minute): two-line captions stay up ≥ 3.5 s, three-line
captions and quotes ≥ 4.5 s, and there is 0.4–1 s of picture alone between them. Shots hold ≥ 4 s, camera moves are slow,
and the two big moments (the fight and the axe) get a beat of silence first.

```
Logline: Young Rama, Jamadagni's son, prays to Shiva for weapons. Shiva says: "When you are pure. They burn anyone
         unfit." Years later the demons crush the gods and Shiva sends him. "But I have no weapons!" "Go." He beats them
         with his bare hands, comes back wounded, Shiva heals him with a touch and gives him divine weapons and the axe:
         PARASHU. Rama with the axe: PARSHURAMA.
Why it should travel: everyone knows Parshurama by his axe; almost nobody knows he won his first war WITHOUT it, or that
         the axe is where his name comes from. A puzzle in the hook ("no weapons?") and its answer in the last shot.
Hook:    Frame 0: young Parshurama on a plain peach ground, fists up, and beside his right hand the dashed outline of
         the axe that isn't there, a "?" by it. Caption up: "PARSHURAMA" / "FOUGHT A DEMON ARMY" / "WITH NO WEAPONS!"
World:   peach hook → a Himalayan rock at dawn (tapas) → white-hot weapons in a cold blue light (the warning) → the same
         rock through a time-lapse of days and snows → Kailash in bright day (Shiva and Uma) → a red-brown storm sky
         (the demons) → shot / reverse on Rama and Shiva on the rock, noon → a dusty plain at dusk (the fight) → warm gold
         (the healing, the gifts) → the hook's peach, now with the axe (the name) → the card.
Motif:   THE EMPTY HAND. The dashed axe outline by his right hand (the hook), his open empty palms ("no weapons!"), his
         fists (the fight), Shiva's hand on his head (the healing), and the axe landing in that hand (the gift). The hook's
         peach pose returns at the end with the outline filled.
         Second motif: THE WEAPONS' LIGHT. White-hot and hissing when he isn't ready (C), calm gold when he is (K).
Arc:     puzzled (frame 0) → devoted → humbled ("not yet") → patient (years) → loved (Shiva smiles) → alarm (the demons)
         → doubt ("no weapons!") → trust ("go") → fury and grit (the fight) → tenderness (the touch) → awe (the axe) →
         the click (the name).
```

## Characters
- **Rama (young Parshurama)**: shared `parshurama()` with `beard: false` (young, clean-shaven), `flip: 1` (his right hand
  on screen left); `axe: false` until shot K, then `axe: 'raise'` / `'hold'`. Tapas: `sit: 1, mudra: 1`. Bruises and
  scratches for J are a scene overlay (little red-violet strokes on face and arms), cleared by sparkles.
- **Shiva**: shared `shiva()` (seated in lotus pose), blue, the crescent moon, Vasuki. In B he appears seated on a
  cloud in light above the rock; in E on Kailash; in H and J close, with `handR` raised (abhaya) and then on Rama's head.
- **Uma (Parvati)**: shared `parvati()` standing beside him on Kailash (E only), smiling at what he says.
- **The Danavas**: Mahishasura's rig through `asura()`, recoloured so they aren't the named Devi Mahatmya asuras: four
  or five brutes (horns, tusks, clubs; teal, rust, mustard, slate), proud and grinning; heaped with swirl eyes after.
- **The devas**: small figures fleeing across the clouds in F (Narad's rig with gold crowns, recoloured); no faces close.
- **The weapons**: a fan of celestial weapons in light (a bow, a spear, a discus-like ring, a sword, the axe among
  them), drawn in the scene's props; white-hot with heat-shimmer in C, gold and calm in K.

## Time constants (video s; shared by `src/scenes/parshu2.js` and `tools/parshu2_sfx.mjs`)
```js
B0 = 5.4
PRAY = 5.8, SHIVA_IN = 9.9, SAYS = 10.9, C0 = 15.5
HOT = 15.6, WARN = 16.0, D0 = 20.6
LAPSE = 20.8, E0 = 25.6
SMILE = 26.0, F0 = 31.0
STOMP = 31.0, SEND = 33.8, G0 = 36.0
SHRUG = 36.4, H0 = 41.5
GO = 41.9, I0 = 46.6
STRIDE = 46.6, BRAWL = 47.8, CLEAR = 50.2, J0 = 53.1
KNEEL = 53.2, TOUCH = 55.2, K0 = 58.6
GIFTS = 58.8, AXE_IN = 61.0, CATCH = 62.0, L0 = 64.6
N1 = 65.0, N2 = 66.2, NAME = 67.4, M0 = 70.6
ASK = 70.7, CARD = 74.3, END = 78.3
```

## Shots and reads (captions inside y 420–1500, left of x 930)
**A 0–5.4 · the hook.** Peach (`peachGround`), young Rama standing, fists up in a fighter's stance, a slow push. By his
right hand (screen left) the axe's dashed outline floats, bobbing, a painted "?" beside it.
- Caption from frame 0 (age offset): "PARSHURAMA" (gold, big) / "FOUGHT A DEMON ARMY" / "WITH NO WEAPONS!" (gold), up
  to 4.9: **5.9 s of read** with the offset.
- 4.9–5.4 picture alone: he glances at the outline, a little shrug. [gold brush wipe]

**B 5.4–15.5 · tapas; Shiva answers.** A Himalayan rock at dawn: snow peaks, a few pines, a cold pink sky; Rama sits in
lotus pose on the rock, eyes closed, a faint gold aura breathing. Slow drift up.
- 5.8–9.9 "HIS NAME WAS JUST RAMA." / "HE PRAYED TO SHIVA FOR WEAPONS." (gold: RAMA, SHIVA) · **4.1 s**
- 9.9–10.9 picture alone: a damru-roll of light; clouds part above the rock and Shiva appears, seated on a cloud in a
  soft halo. Rama's eyes open and look up (the eyes lead, then the head).
- 10.9–15.4 Shiva, talking, a calm half-smile: "\"I WILL GIVE THEM TO YOU" / "WHEN YOU ARE PURE.\"" · **4.5 s**
  [cut on the light: the halo flares to white]

**C 15.5–20.6 · the warning.** Close on Rama from Shiva's side; between them a fan of celestial weapons floats in
white-hot light, the air rippling with heat, sparks spitting; the light goes cold blue on his face. He leans back, eyes
wide, a sweat drop. Slow push.
- 15.6–16.0 picture alone: the weapons flare in.
- 16.0–20.5 "\"THEY BURN ANYONE" / "WHO IS UNFIT.\"" (UNFIT in red-orange) · **4.5 s** [the light dims to a pinpoint: iris]

**D 20.6–25.6 · the years.** Wide on the rock: a time-lapse (`skyLapse`-style) of suns and moons arcing over; snow
falls and melts on his shoulders, flowers open and close at the rock's foot, his aura grows steadier and warmer. He
doesn't move.
- 21.0–25.1 "SO HE KEPT PRAYING…" / "FOR YEARS." (gold) · **4.1 s** [whip-pan up into the clouds]

**E 25.6–31.0 · Kailash.** Bright day on Kailash: Shiva seated, Uma standing beside him, both looking down (toward
the rock, off screen). Shiva smiles and turns to her; she smiles back, a little bloom of light.
- 25.6–26.0 picture alone.
- 26.0–30.5 Shiva to Uma: "\"THIS RAMA" / "IS DEVOTED TO ME.\"" (gold: RAMA) · **4.5 s** [smash cut on the thunder]

**F 31.0–36.0 · the demons; Shiva sends him.** 31.0–33.8 a red-brown storm sky: a row of Danavas stomps across the
clouds, clubs up, grinning; tiny crowned devas run off the right edge. 33.8–36.0 back on Kailash, closer: Shiva's
open hand points down; on the rock below, Rama looks up.
- 31.0–31.4 picture alone (thunder, the stomp).
- 31.4–35.8 "WHEN DEMONS ATTACKED THE GODS," / "SHIVA SENT RAMA TO FIGHT THEM." (gold: SHIVA, RAMA) · **4.4 s**

**G 36.0–41.5 · "no weapons!"** Rama, medium close, on the rock at noon, Shiva's glow on him from above. He holds up
two empty open palms, shrugs, looks from one hand to the other. A "?" and a sweat drop. (Shot one of a shot / reverse.)
- 36.4–40.9 "\"BUT LORD…" / "I HAVE NO WEAPONS!\"" (gold: NO WEAPONS) · **4.5 s**
- 40.9–41.5 picture alone: he looks up, waiting.

**H 41.5–46.6 · "Go."** Reverse: Shiva close, low angle, calm, his right palm raised (abhaya); the halo pulses once.
- 41.9–46.4 "\"GO." (gold, big) / "YOU WILL WIN.\"" · **4.5 s** [cut on action: Rama's first stride]

**I 46.6–53.1 · bare hands.** A dusty plain at dusk, the Danavas in a line, laughing at the man with no weapons. Rama
strides in from the left; he stops, cracks his knuckles (46.6–47.8: the score drops out: silence and one knuckle crack).
47.8–50.2: a cartoon brawl cloud (dust, flying fists and feet, stars, a club spinning out of it; no blood, nothing seen
landing). 50.2: the dust clears: the Danavas heaped up with swirl eyes, Rama on his feet beside them, dusting his hands.
- 48.2–52.8 "HE BEAT THEM ALL" / "WITH HIS BARE HANDS!" (gold: BARE HANDS) · **4.6 s**
  [gold wipe]

**J 53.1–58.6 · the touch.** Back on the rock, warm afternoon: Rama kneels before Shiva, tired, scratches and bruises on
his arms and face, head bowed. 55.2 Shiva reaches out and lays his hand on Rama's head: gold light spreads from the
palm, the marks fade in a ripple of sparkles, Rama looks up and smiles.
- 53.5–58.2 "HE CAME BACK WOUNDED." then at 55.4 "ONE TOUCH OF SHIVA HEALED HIM." (gold: SHIVA) · **4.7 s**

**K 58.6–64.6 · the gifts; the axe.** The same weapons from C float down around him again, but gold and calm now (no
shimmer, no sparks): he reaches up and they settle into his hands and onto his back, and stay. 61.0 one last light
descends alone; silence; 62.0 it lands in his right hand: THE AXE, glowing (a hit, a shock ring, `axe: 'raise'`).
- 59.0–64.3 "SHIVA'S GIFTS:" / "DIVINE WEAPONS…" and, at 62.2, "…AND ONE AXE." (gold, big) · **5.3 s**
  [brush wipe in the axe's glow colours]

**L 64.6–70.6 · the name.** The hook's peach and pose, rhymed: Parshurama in the same fighter's stance, but the dashed
outline is now the real axe, raised and glowing. The three lines build one by one, with a soft tick each and a big hit
on the name:
- 65.0 "PARASHU = AXE" · 66.2 "RAMA + PARASHU =" · 67.4 "PARSHURAMA" (gold, biggest) · all up to 70.6: **5.6 s**
  for the first line, 3.2 s for the name alone

**M 70.6–74.3 · the ask.** The same image, a slow push, his aura breathing.
- 70.7–74.3 COMMENT "HAR HAR MAHADEV" (gold, low in the band, y ≈ 1430) · **3.6 s**

**N 74.3–78.3 · the card.** The Navadurga card, NO price (owner, 31 Oct): the Books 1–3 covers, the RK logo, "The
Navadurga Set is OUT NOW", the rishikatha.com pill, "Check the link in bio", "Follow @therishikatha". No fade.

## Sound
Retro cartoon SFX (tools/parshu2_sfx.mjs → assets/parshu2_sfx.wav; the mix at -14.5 LUFS, two-pass loudnorm, kept out of
git) over a mild tanpura bed, never loud:
the hook's "?" plink and a little shrug squeak; dawn wind and a bird; a damru roll and a soft choir pad as Shiva appears;
the weapons' white-hot hiss, sizzle and spark crackles (C), a cold glassy drone; the time-lapse whoosh with tick-tocks
of days and a soft wind of snow; Kailash's bright bell; thunder and heavy demon stomps, a growl-laugh; a questioning
bassoon "huh?" on the shrug; a deep, warm bell on "GO"; the knuckle crack in silence, then the brawl (retro thwacks,
boings, a spinning-club whoosh, a cartoon cymbal), a final "thud" as the heap settles and a hand-dust pat; a harp
glissando and shimmer on the touch; soft chimes as each weapon settles; silence, then a taiko hit with a metal ring on
the axe; three rising ticks for the name and a big taiko + bell on PARSHURAMA; a temple bell under the ask; the card
quiet.

## Facts used
| Beat | Source |
|---|---|
| He is called Rama, Jamadagni's son of Bhrigu's line ("became celebrated by the name of Rama") | MBh 8.24 (Critical Ed.) = Karna Parva section 34 (Ganguli); MBh 12.49.29 |
| He pleases Shiva with fierce austerities, to obtain weapons | MBh 8.24 (Ganguli 8.34: "he gratified the god Bhava for obtaining weapons") |
| Shiva: "I will give you the weapons when you become pure. They burn one who is unfit and incapable" | MBh 8.24.135 (dāsyāmi te tadāstrāṇi yadā pūto bhaviṣyasi / apātram asamarthaṃ ca dahanty astrāṇi bhārgava) |
| He goes on worshipping for many years | MBh 8.24 (Ganguli 8.34: "adored Sarva for many long years") |
| Shiva, with his consort and the gods, praises him: "This Rama, of firm vows, is ever devoted to me" | MBh 8.24 (Ganguli 8.34) |
| The Danavas, proud and mighty, oppress the gods; Shiva pledges their destruction and summons Rama | MBh 8.24.145 |
| Rama: "Unskilled in weapons, what power have I to slay all the Danavas, who are armed and proud in war?" | MBh 8.24.147 (akṛtāstrasya … kā śaktir me) |
| Shiva: "Go at my command. You will slay those foes" | MBh 8.24 (Ganguli 8.34) |
| He kills them "with blows alone", blows like Indra's thunderbolt | MBh 8.24.150 (prahārair eva) |
| He comes back wounded; Shiva touches him and the wounds heal at once | MBh 8.24.151 (saṃspṛṣṭaḥ sthāṇunā sadyo nirvraṇaḥ) |
| Shiva, pleased, gives him boons and divine weapons, and he leaves with the gods' leave | MBh 8.24 (Ganguli 8.34: "accept from me these celestial weapons") |
| Shiva gave him the axe (paraśu) and divine weapons, in Parshurama's own words | MBh 13.18.11 (Critical Ed.: paraśuṃ ca dadau devo divyāny astrāṇi caiva me) |
| The axe from Mahadeva, before the Kartavirya story | MBh 12.49 in Ganguli's (vulgate) text only; not in the Critical Edition's 12.49 |
| Paraśu = axe; Paraśurāma = "Rama with the axe" | Sanskrit paraśu (axe); the name is a compound of the two |

**Version:** the Mahabharata's own telling, Karna Parva 8.24 (Duryodhana tells it to Shalya to prove a teacher who got
his weapons this way would not have taught an unworthy Karna). The Brahmanda Purana has a parallel telling (Bhrigu
sends him to tapas on the Himavan, Shiva sends him to protect the devas, then gives him missiles), which we don't use.

**The one join, said honestly:** 8.24 says "divine weapons" without naming the axe; the axe is named as Shiva's gift in
13.18.11 (Rama's own testimony, set later in his life in that chapter) and in Ganguli's 12.49. So the caption says
"SHIVA'S GIFTS: DIVINE WEAPONS… AND ONE AXE" and never claims the axe was handed over on that same day; the picture puts
the gifts together. Gandhamadana is not named (it is only in the vulgate 12.49), and the rock is a generic Himalayan
height. "Bare hands" is our wording for *prahārair eva*, "with blows alone".

**Gags (claim no plot fact):** the dashed axe outline and "?", the shrug and sweat drop, the knuckle crack, the cartoon
brawl cloud and the swirl-eyed heap, the hand-dusting, snow piling on his shoulders in the time-lapse.

## Cover
The series template (`parshu1_cover.js` → `parshu2_cover.js`): the orange "PART 2" pill over the gold title, inside the
3:4 crop (y 240–1680). Title: "PARSHURAMA" / "FOUGHT A DEMON ARMY" / "WITH NO WEAPONS!". Art: young Parshurama on the
dusk plain, fists up, the swirl-eyed Danava heap behind him, the axe's dashed outline by his hand.

## Card
`navCard()` in parshu2_props.js: Part 1's card with the price lines replaced: "The Navadurga Set" / "OUT NOW" (orange),
the rishikatha.com pill, "Check the link in bio", "Follow @therishikatha".

## Build notes
- Young Rama's hook pose is `FISTS`; the axe that isn't there is `axeOutline()` (dashed, on a ghost fill of the blade).
- The touch draws Shiva twice (`only: 'body'`, then Rama, then `only: 'arms'`) so his hand rests on top of Rama's head.
- The falling axe in K is drawn after Rama: a `parashu()` drawn under push/translate/rotate before him, entering from
  above the frame, knocked him out of the frame (p5.brush); after him it's fine.
- Audio: `node tools/parshu2_sfx.mjs` → assets/parshu2_sfx.wav; assets/parshu2_mix.wav is it loudnormed (two-pass,
  linear, TP -1.5) to -15.3 LUFS. Both kept out of git.
