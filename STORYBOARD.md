# Ad 74: "PARSHURAMA won the whole EARTH, then gave it away" (Parshurama series, Part 5)

An 84 s Painted reel with Bangers captions, no voiceover and SFX: Part 3's dark hits for the death, the lamp and the
vow, a taiko tally for the 21 wars, a tanpura and warm pads for the ashram, the ancestors and the crowning. It stands on
its own and ends on the Navadurga card (no price).

**Pacing:** Part 4's shape. A fast cold open (0–10.2 s: the hook 3.8 s, the gift 3.6 s, "IT TOOK 21 WARS." 2.8 s), then
Part 2's pace: 14 caption groups in ~70 s, two-line captions up ≥ 3.5 s, three-liners and quotes ≥ 4.5 s.

```
Logline: Kartavirya's sons take revenge: while Rama is out fetching firewood they kill his father, who is in tapas and
         will not fight, crying "Rama! Rama!". Rama comes back too late, lights the pyre and vows. Twenty-one times he
         fights the arrogant kings of the earth, until at Samantapanchaka, by five lakes of blood, his ancestors appear:
         "We are pleased. Now be at peace." Those lakes are at Kurukshetra. He gives the whole earth to Kashyapa and
         leaves for the sea; Kashyapa crowns the princes who grew up hidden among bears and cows.
Why it should travel: a paradox hook (he WON the earth, then GAVE IT AWAY, and the new owner told him to leave), the
         most famous number in his story (21) as a tally, a reveal everyone knows (KURUKSHETRA), and a feel-good end
         (bears and cows raised kings). The ask, "WHY EXACTLY 21 TIMES?", draws the people who know the Brahmanda answer;
         the pinned comment gives it.
Hook:    Frame 0: Parshurama, axe glowing, standing on top of the whole earth on the crimson sunburst.
         "PARSHURAMA WON" / "THE WHOLE EARTH." (gold)
World:   sunburst → the ashram by day (the gift) → blood-maroon → Mahishmati's court at dusk → the ashram by day → dusk
         → night → the lamp → the ashram at sunset → the night pyre → the court → the dust → the time-lapse ridge →
         Samantapanchaka at dusk → the ancestors' sky → Samantapanchaka in gold → the ashram (the yagna) → the ashram
         (the princes) → the sunburst → card.
Motif:   THE LAMP and THE CROWN from Parts 3–4 (the lamp goes out; crowns roll in the dust), THE LAKES (blood → clear,
         with lotuses), THE EARTH (a little globe: stood on, handed over, held by Kashyapa).
```

## Characters
- **Rama (Parshurama)**: `parshurama()`, `flip: 1`, clean-shaven before the vow as in Parts 2–4; from the pyre on he
  wears the short beard (`beard: PSR.hair`), the years of the 21 wars.
- **Jamadagni**: `jamadagni()` (Part 3); sitting in tapas.
- **Kartavirya's sons** (`kartSon()` in parshu5_props.js): their father's rig without the thousand arms, gold kiritas,
  three colourways; in F as silhouettes with burning eyes and bows.
- **Kashyapa** (`kashyapa()`): Valmiki's rig, a long white beard, a turmeric dhoti; `ladle` (the sruva), `earth`.
- **The ancestors** (`ancestor()`): Valmiki's rig washed in pale gold with a glow; 0 is Richika (Part 1's dark beard).
- **The hidden princes** (`littlePrince()`): Kartikeya's rig, no spear or shield, `crownK` pops a kirita on; the bear
  is `jambavan()` (no staff), the cows `cow()` (gauri, and a kapila calf).

## Time constants (video s; shared by `src/scenes/parshu5.js` and `tools/parshu5_sfx.mjs`)
```js
B0 = 3.8, C0 = 7.4
D0 = 10.2, E0 = 15.0, F0 = 19.6
G0 = 24.6, CRY = 25.4, LAMP = 26.6, OUT = 27.4
H0 = 29.2, DROP = 31.0, I0 = 33.8, VOW = 36.4
J0 = 38.8, CROWNS = 41.4, K0 = 43.6, TALLY = 44.2, TOP = 48.0      // war n ticks at TALLY + (TOP − TALLY)·√((n−1)/20)
L0 = 50.0, M0 = 54.8, O0 = 60.0, CALM = 60.2, KURU = 61.6
P0 = 64.8, GIVE = 65.4, LEAVE = 67.0, R0 = 69.6, CROWN1 = 71.6, S0 = 75.0, CARD = 80.0, END = 84.0
```

## Shots and reads (captions inside y 420–1500, left of x 930)
**The cold open (fast)**
- **A 0–3.8 · the hook.** Rama on top of the earth, axe glowing. "PARSHURAMA WON" / "THE WHOLE EARTH."
- **B 3.8–7.4 · the gift.** The ashram, a yagna: Kashyapa holds the little earth and points away with his ladle; Rama
  blinks. "THEN HE GAVE IT AWAY." / "\"NOW LEAVE MY LAND.\""
- **C 7.4–10.2 · 21 wars.** Rama close on blood-maroon; his eyes open and blaze. "IT TOOK" / "21 WARS."

**The story (Part 2's pace)**
- **D 10.2–15.0 · the sons.** Mahishmati's court at dusk, the empty throne with the crown on it, two sons turning
  furious. "THE KING WITH 1000 ARMS HAD FALLEN." / "HIS SONS WANTED REVENGE."
- **E 15.0–19.6 · firewood.** The ashram by day: Jamadagni in tapas by the fire; Rama walks off, axe on his shoulder.
  "ONE DAY, RAMA WENT" / "TO FETCH FIREWOOD."
- **F 19.6–24.6 · they come.** Dusk: the sons creep in as silhouettes with bows and burning eyes; the sage does not
  open his eyes. "THE SONS CAME FOR HIS FATHER." / "HE WAS DEEP IN TAPAS." / "HE WOULD NOT FIGHT."
- **G 24.6–29.2 · the cry.** Night, Jamadagni close; at 25.4 his eyes open and he calls out. 26.6 the lamp by the
  wall, arrow shadows sweep over it; 27.4 the flame dies, a wisp of smoke. "HE CALLED OUT:" / "\"RAMA! RAMA!\""
- **H 29.2–33.8 · too late.** Sunset: Rama walks home smiling, a bundle of firewood on his shoulder; at 31.0 he sees,
  the sticks clatter down, the camera pushes in on his tears. "RAMA CAME BACK" / "TOO LATE."
- **I 33.8–38.8 · the pyre.** Night: the pyre burning across the clearing; Rama in front, hands joined, crying; at 36.4
  his eyes open and blaze, the axe in his hand. "HE LIT HIS FATHER'S PYRE" / "AND MADE A VOW."
- **J 38.8–43.6 · the sons.** The court: Rama strides in, axe high; the sons yelp; 41.4 white flash; two crowns roll
  through the dust and fall still. "HE WENT TO THE KING'S CITY" / "AND FACED THE SONS ALONE."
- **K 43.6–50.0 · 21 times.** Days and nights race over a dark ridge, Rama marching in silhouette; a gold tally ticks
  1 → 21, faster and faster, a taiko per war. "THEN HE FOUGHT ARROGANT KINGS" / "ALL OVER THE EARTH." then "TIMES."
  under the 21.
- **L 50.0–54.8 · Samantapanchaka.** Five red lakes on a dusk plain; Rama stands among them, hands joined, offering to
  his fathers. "AT SAMANTAPANCHAKA," / "HE FILLED FIVE LAKES WITH BLOOD."
- **M 54.8–60.0 · the ancestors.** The sky opens gold: four rishis of light on clouds, Richika in front, a hand raised;
  Rama below, looking up, his aura going out. "THEN HIS ANCESTORS APPEARED." / "\"RAMA, WE ARE PLEASED." / "NOW BE AT
  PEACE.\""
- **O 60.0–64.8 · Kurukshetra.** Rama sits in peace; the lakes clear to blue with lotuses, the sky turns gold; a
  signpost pops up; war banners on the horizon. "THOSE LAKES ARE IN" / "KURUKSHETRA." / "WHERE THE MAHABHARATA WAR WAS
  FOUGHT."
- **P 64.8–69.6 · the earth given.** The yagna: the little earth floats from Rama's hands over the fire to Kashyapa;
  Rama shoulders his axe and walks away. "HE GAVE THE WHOLE EARTH" / "TO SAGE KASHYAPA," / "AND LEFT FOR THE SEA."
- **R 69.6–75.0 · new kings.** The ashram: a bear with a little prince, a cow and calf with another; Kashyapa raises his
  hands and crowns pop onto them (71.6, 72.2). "BEARS AND COWS HAD RAISED" / "A FEW HIDDEN PRINCES." / "KASHYAPA MADE
  THEM KINGS."
- **S 75.0–80.0 · the ask.** The sunburst, a big glowing 21, Rama below. "WHY EXACTLY" / "21 TIMES?" / "COMMENT IF YOU
  KNOW"
- **card 80.0–84.0.** `navCard()`.

## Sound
`tools/parshu5_sfx.mjs` → assets/parshu5_sfx.wav; assets/parshu5_mix.wav is it +15 dB through a limiter (0.8 ceiling):
−15.7 LUFS integrated, true peak −1.8 dB. Both kept out of git.
`ffmpeg -i assets/parshu5_sfx.wav -af "volume=15dB,alimiter=limit=0.8:level=false" assets/parshu5_mix.wav`

## Facts used
One version: the **Mahabharata** (K. M. Ganguli's translation): Vana Parva 3.116–117 (the Tirtha-yatra telling at
Mahendra), Adi Parva 1.2 (Samantapanchaka) and Shanti Parva 12.49 (Krishna's telling to Yudhishthira).

| Beat | Source |
|---|---|
| After Rama cut down Kartavirya Arjuna, Arjuna's kin/sons came to the ashram while Rama was away | MBh 3.116 (end); 12.49 |
| Rama was out fetching sacred fuel and grass | 12.49 ("out for fetching sacred fuel and grass"); 3.116 ("bearing in his arms fuel for religious rites") |
| Jamadagni was engaged in penance and would not fight | 3.116 ("being at the time engaged in penances, he would not fight"); 3.117 ("absolutely averse to fighting") |
| He cried out "Rama!" again and again | 3.116 ("he repeatedly shouted the name of Rama") |
| They shot him with arrows and went away | 3.116; 3.117 ("killed thee with hundreds of sharpened shafts") (12.49 says lances: we show arrow shadows, 3.116's) |
| Rama returned with the fuel, found his father dead, and lamented | 3.116 (end); 3.117 |
| He cremated his father and vowed | 3.117 |
| Single-handed, he killed Kartavirya's sons | 3.117 ("singlehanded put Kartavirya's sons to death"); 12.49 |
| He did it thrice seven (21) times | 12.49 ("thrice seven times"); Critical Edition 3.117.9 (*triḥsaptakṛtvaḥ*; Ganguli renders it "thrice … seven times") |
| At Samantapanchaka he made five lakes of blood and offered to his ancestors | 1.2; 3.117 |
| His ancestors, led by Richika, appeared: "we have been gratified … ask a boon"; he asked that the lakes become holy and his sin be absolved; "So shall it be. But be thou pacified." And he was | 1.2; 3.117 ("Richika appeared to him in a visible form, and spake to him words of counsel") |
| The Kuru–Pandava battle was fought at Samantapanchaka | 1.2 |
| At the end of a horse sacrifice he gave the earth to Kashyapa | 12.49; 3.117 |
| Kashyapa, still holding the sacrificial ladle: "repair to the shores of the southern ocean … reside not within my dominion" | 12.49 |
| The earth, unprotected, asked Kashyapa for kings: princes hidden among women; Viduratha's son raised among bears on the Rikshavat; Gopati among cows; Vatsa among calves (and others) | 12.49 |
| Kashyapa sought them out and installed them as kings | 12.49 |

**On screen, honestly:** "WON THE WHOLE EARTH" is 3.117's "subdued the entire world"; "21 WARS" stands for the 21
campaigns. Per the series framing (owner, 29 Oct) the reel says "ARROGANT KINGS" where the text says the warrior class
(12.49 calls Kartavirya's sons "haughty and cruel"; 1.2 says he was "urged by impatience of wrongs"), and it never shows
a killing. "RAMA, WE ARE PLEASED. NOW BE AT PEACE." is our wording of 1.2's "we have been gratified … be thou
pacified". "THOSE LAKES ARE IN KURUKSHETRA" rests on 1.2 (the battle was fought at Samantapanchaka). "LEFT FOR THE SEA"
is 12.49's southern ocean (the ocean then made Shurparaka for him; Part 5 doesn't say so). "BEARS AND COWS" are two of
12.49's hiding places (bears, cows, calves). Not claimed: the empty throne and crown, the sons' bows in F (3.116 says
arrows), the lamp, the dropped bundle, the signpost and banners, the earth as a little globe, the crowns popping on.
12.49's harsher lines (the children) are left out. Jamadagni being restored to life is the Bhagavata's (9.16.24),
another version: not in this part.

**The pinned comment (another text, labelled):** the "why 21" answer is the **Brahmanda Purana**'s (Madhyama Bhaga,
the Parashurama chapters; ch. 30 in the Motilal numbering): Renuka beat her breast 21 times in grief, and Rama vowed to
fight that many times. Not in the reel.

## Cover
`src/scenes/parshu5_cover.js` (`cover.html`): Rama, bearded, axe glowing, on top of the earth on the sunburst; the
orange PART 5 pill over "PARSHURAMA" (gold) / "WON THE WHOLE EARTH" / "& GAVE IT AWAY" (red).

## Out
`out/parshu5_out/` (parshu5.mp4, cover.png, captions.txt).
