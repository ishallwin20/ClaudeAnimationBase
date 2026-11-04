# Ad 75: "PARSHURAMA challenged LORD RAM" (Parshurama series, Part 6)

An 88.4 s Painted reel with Bangers captions, no voiceover and SFX: a royal brass and a blue shimmer for the cold open,
wedding bells on the road, caws, a gale and thunder for the omens and the storm, a war drum under the challenge, plucks
for the flashback, a bowstring creak, twang and rising whine for Vishnu's bow, three blasts for the heavens, birdsong as
the sky clears. It stands on its own and ends on the Navadurga card (no price).

**Pacing:** Parts 4–5's shape. A fast cold open (0–10.2 s: the hook 3.8 s, "BOTH WERE AVATARS OF VISHNU." 3.6 s, "ONE
BOW DECIDED IT." 2.8 s), then Part 2's pace: 15 caption groups in ~74 s, two-line captions up ≥ 3.5 s, three-liners and
quotes ≥ 4.5 s.

```
Logline: On the road home from Mithila, after Ram broke Shiva's bow and married Sita, the birds shriek, the sky goes dark
         and out of a storm walks Parshurama with Vishnu's bow: "You broke Shiva's bow? String this one. Then fight me."
         Dasharatha begs; he isn't heard. Ram takes the bow, strings it, nocks an arrow: "You are a brahmin and
         Vishvamitra's kin: I won't take your life. Choose: your speed of mind, or the heavens your tapas won." The gods
         gather; Parshurama's power leaves him; he knows Ram is Vishnu. "Take my heavens. Leave me my speed." The arrow
         destroys his worlds; he walks round Ram and leaves for Mahendra.
Why it should travel: two avatars of Vishnu face to face (the hook), the bow that is the TWIN of the one Ram broke, a
         famous name in every frame, and the payoff of Part 4's ask ("WHO HUMBLED PARSHURAMA?"). The ask, "WHY COULDN'T
         PARSHURAMA STAY ON EARTH AT NIGHT?", is answered by Part 5 (Kashyapa), so it sends people back a part; the
         pinned comment also asks "Valmiki or Tulsidas?" for the people who grew up on the Manas telling.
Hook:    Frame 0: Parshurama, axe glowing, Vishnu's bow in his left hand, on the crimson sunburst.
         "PARSHURAMA" (gold) / "CHALLENGED LORD RAM."
World:   sunburst → blue sunburst (Ram aims) → blood-maroon → the road by day → the road darkening → the storm →
         the storm sky (reveal) → the dark road → the gold flashback → the dark road → blue sunburst → the dark road +
         heaven opening → the night sky of the heavens → the road clearing → Mahendra at night → card.
Motif:   THE BOW (Vishnu's: gold, a blue-white light; held unstrung by Parshurama, strung by Ram), THE LIGHT (his warm
         aura drains as Ram's blue light grows), THE AXE (laid on the ground when he yields).
```

## Characters
- **Rama (Parshurama)**: `parshurama()`, `flip: 1`, bearded (since the 21 wars, Part 5); Vishnu's bow in his left hand
  (`vishnuBow()` as armL), `strung: false` when he holds it out.
- **Ram**: `ram()` with the bridegroom's mala (`flowerMala` as chest); `aimPose(draw, glow)` draws Vishnu's bow at
  screen right (flip).
- **Sita** `sita6()`, **Dasharatha** `dasharatha()` (in `royalChariot()`, then on foot), **Vasishtha** `vasishtha()`,
  another rishi `sage6()`, **Brahma** `brahma()` with two rishis of light (`ancestor()`), the lineage in silhouette
  (Richika, Jamadagni, Rama).

## Time constants (video s; shared by `src/scenes/parshu6.js` and `tools/parshu6_sfx.mjs`)
```js
B0 = 3.8, C0 = 7.4
D0 = 10.2, E0 = 15.0, F0 = 19.6, REVEAL = 21.8
G0 = 24.8, H0 = 29.4, REV = 32.2, I0 = 34.4
J0 = 39.0, SNAP = 41.0, DESC = 42.6
L0 = 45.0, GRAB = 45.5, STRUNG = 46.6, NOCK = 47.4
M0 = 49.8, N0 = 54.8, O0 = 59.8, DRAIN = 60.2
P0 = 65.4, Q0 = 70.4, LOOSE = 70.9, HIT = 71.7      // the three heavens burst at HIT + .2, + .6, + 1.0
R0 = 74.8, GONE = 78.0, S0 = 79.4, CARD = 84.4, END = 88.4
```

## Shots and reads (captions inside y 420–1500, left of x 930)
**The cold open (fast)**
- **A 0–3.8 · the hook.** Parshurama, axe glowing, Vishnu's bow. "PARSHURAMA" / "CHALLENGED LORD RAM."
- **B 3.8–7.4 · Ram.** Blue sunburst; Ram draws the bow, the arrowhead lit. "BOTH WERE" / "AVATARS OF VISHNU."
- **C 7.4–10.2 · one bow.** Parshurama close on blood-maroon; a blue light falls across him, his fire flickers, his
  eyes go wide. "ONE BOW" / "DECIDED IT."

**The story (Part 2's pace)**
- **D 10.2–15.0 · the road home.** Ram (mala) and Sita walk ahead of Dasharatha's chariot; petals. "RAM HAD JUST BROKEN
  SHIVA'S BOW" / "AND MARRIED SITA."
- **E 15.0–19.6 · the omens.** Birds wheel and shriek; deer go round the party; Dasharatha looks up, sweating;
  Vasishtha raises a calm hand. The sky darkens. "ON THE WAY HOME," / "BIRDS SHRIEKED." / "THE SKY WENT DARK."
- **F 19.6–24.8 · the storm.** Trees bend, ash blows; a silhouette with burning eyes walks out of the dust; at 21.8
  lightning and the low-angle reveal. "OUT OF THE STORM" / "CAME PARSHURAMA."
- **G 24.8–29.4 · the whisper.** Vasishtha and a rishi lean together, sweating. "THE SAGES WHISPERED:" / "\"HAS HE COME"
  / "FOR THE KINGS AGAIN?\""
- **H 29.4–34.4 · the challenge.** Low angle: he holds the unstrung bow out, talking; 32.2 cut to Ram, calm. "\"YOU BROKE
  SHIVA'S BOW?" / "STRING THIS ONE." / "THEN FIGHT ME.\""
- **I 34.4–39.0 · the plea.** Dasharatha, palms joined, crying; Parshurama looks over his head at Ram. "KING DASHARATHA
  BEGGED:" / "\"SPARE MY SONS!\""
- **J 39.0–45.0 · the two bows.** A gold flashback: two bows float; 41.0 Shiva's snaps and falls; 42.6 Vishnu's glides
  down over three silhouettes rising (Richika, Jamadagni, Rama). "TWO BOWS WERE ONCE MADE:" / "SHIVA'S, WHICH RAM BROKE,"
  / "AND VISHNU'S. THIS ONE."
- **L 45.0–49.8 · the stringing.** The bow flies into Ram's hand (45.5); a creak; 46.6 a twang, the string taut; 47.4
  he nocks an arrow and it lights blue-white. "RAM TOOK THE BOW," / "STRUNG IT, AND NOCKED AN ARROW."
- **M 49.8–54.8 · spared.** Ram aims at Parshurama down the road; the blue light on his face. "\"YOU ARE A BRAHMIN," /
  "AND VISHVAMITRA'S KIN." / "I WON'T TAKE YOUR LIFE.\""
- **N 54.8–59.8 · the choice.** Ram close on the blue sunburst. "\"BUT THIS ARROW NEVER MISSES." / "CHOOSE: YOUR SPEED
  OF MIND," / "OR THE HEAVENS YOUR TAPAS WON.\""
- **O 59.8–65.4 · the drain.** The sky opens: Brahma on his lotus and two rishis on clouds; below, Parshurama's aura
  and axe glow run out, his anger turns to awe (no caption for 1.4 s). "PARSHURAMA'S POWER" / "LEFT HIM." / "HE KNEW: RAM
  WAS VISHNU."
- **P 65.4–70.4 · he yields.** His axe on the ground; palms joined. "\"TAKE MY HEAVENS." / "LEAVE ME MY SPEED:" / "I
  CAN'T STAY ON EARTH AT NIGHT.\""
- **Q 70.4–74.8 · the arrow.** Ram looses (a beat of silence, then the twang); the streak flies up through three
  floating heavens, each bursting. "RAM'S ARROW" / "DESTROYED HIS HEAVENS."
- **R 74.8–79.4 · pradakshina.** He walks once round Ram, palms joined, and is gone in a streak (78.0); the storm
  clears. "PARSHURAMA WALKED AROUND RAM," / "BOWED, AND LEFT FOR MAHENDRA."
- **S 79.4–84.4 · the ask.** Night: Parshurama in tapas on a peak under the moon. "WHY COULDN'T PARSHURAMA" / "STAY ON
  EARTH AT NIGHT?" / "COMMENT IF YOU KNOW"
- **card 84.4–88.4.** `navCard()`.

## Sound
`tools/parshu6_sfx.mjs` → assets/parshu6_sfx.wav; assets/parshu6_mix.wav is it +18 dB through a limiter (0.8 ceiling):
−16.8 LUFS integrated, true peak −1.5 dB. Both kept out of git.
`ffmpeg -i assets/parshu6_sfx.wav -af "volume=18dB,alimiter=limit=0.8:level=false" assets/parshu6_mix.wav`

## Facts used
One version: **Valmiki Ramayana**, Bala Kanda 74–76 (and 77.1), checked against valmikiramayan.net (Desiraju Hanumanta
Rao's word-for-word translation).

| Beat | Source |
|---|---|
| After the weddings, Dasharatha's party sets out for Ayodhya | 1.74.1-7 |
| Birds shriek harshly; the animals go round the party clockwise | 1.74.8-10 |
| Vasishtha: danger is coming, but the animals say it will pass | 1.74.11-13 |
| A gale shakes the earth and fells trees; darkness hides the sun; dust and ash cover the army | 1.74.13-16 |
| Jamadagni's son appears: matted hair, an axe on his shoulder, a bow and a fearsome arrow | 1.74.16-19 |
| The sages murmur: will he wipe out the kings again, or is his anger spent? | 1.74.20-22 |
| He has heard Ram broke Shiva's bow; "draw this bow, fit an arrow; then I'll give you a duel" | 1.75.1-4, 1.75.27-28 |
| Dasharatha, palms joined, begs protection for his young sons | 1.75.5-9 |
| He ignores Dasharatha's words and speaks only to Ram | 1.75.10 |
| Vishvakarma made two bows, Shiva's and Vishnu's; Shiva's went to Devarata of Videha (Janaka's line), Vishnu's to Richika, then Jamadagni | 1.75.11-23 |
| Ram takes the bow and arrow, strings it, fits the arrow | 1.76.4-5 |
| "You are a brahmin, worthy of my respect, and related to Vishvamitra: I won't loose this arrow at your life" | 1.76.6 |
| "I will destroy your speed of mind, or your unequalled worlds won by tapas" | 1.76.7 |
| The arrow "will not fall in vain" | 1.76.8 |
| The gods, led by Brahma, with the sages, gather to watch | 1.76.9-10 |
| Parshurama is rendered vigourless (*nirvīrya*) | 1.76.11 |
| Kashyapa said "my domain is not for you"; since then he spends no night on earth; "don't destroy my speed, destroy my worlds" | 1.76.13-16 |
| He knows Ram is Vishnu, Madhusudana | 1.76.17 |
| No disgrace in being defeated by the lord of the three worlds | 1.76.19 |
| The arrow destroys his worlds | 1.76.21-22 |
| He goes round Ram (pradakshina) and leaves for Mahendra; the darkness clears | 1.76.22-24 |
| Both are avatars of Vishnu | Bhagavata 1.3.20 (Parshurama), 1.3.22 (Ram); Ram as Vishnu: 1.76.17 |

**On screen, honestly:** "STRING THIS ONE. THEN FIGHT ME." is our wording of 75.3-4 (draw it, fit an arrow; then a
duel). "SPARE MY SONS!" is 75.6's plea for protection (*abhaya*). "AND VISHVAMITRA'S KIN" is 76.6 (the kinship runs
through Satyavati, Richika's wife and Vishvamitra's sister: Part 1). "YOUR SPEED OF MIND" is 76.7's *gati*. "HE KNEW: RAM
WAS VISHNU" is 76.17. "WALKED AROUND RAM, BOWED" is 76.24's pradakshina. Not claimed: the petals and wedding bells, the
deer's species, the flying bow, the floating pavilions (Valmiki says "worlds", the reel draws them), the silhouettes of
the lineage, the moonlit peak. Left out: the Shiva–Vishnu contest of 75.14-20 (the humkara that stilled Shiva's bow:
true to the text, but it would turn the reel into a Shaiva–Vaishnava fight it is not about), Ram giving the bow to
Varuna (77.1) and Dasharatha's embrace (77.4-5). Ram's line about Parshurama's revenge (76.2) is cut for time.

**The pinned comment:** the night answer (76.13-15, Part 5's Kashyapa) and the Ramcharitmanas difference (the meeting
in Janaka's court, Lakshman's teasing: Bal Kand, after the bow-breaking), as a "Valmiki or Tulsidas?" question.

## Cover
`src/scenes/parshu6_cover.js` (`cover.html`): the face-off on the sunburst, Parshurama (axe glowing) left, Ram drawing
Vishnu's bow at him right; the orange PART 6 pill over "PARSHURAMA" (gold) / "CHALLENGED" / "LORD RAM" (blue).

## Out
`out/parshu6_out/` (parshu6.mp4, cover.png, captions.txt).
