# Ad 80: "PARSHURAMA'S 3 STUDENTS" (Parshurama series, Part 8, the finale)

A ~97 s Painted reel with Bangers captions, no voiceover and SFX. It stands on its own and closes the series: the
cold open names three Mahabharata legends, each gets a chapter, the twist is that all three led the same army at
Kurukshetra and fell there, and the last beat is that Parshurama never died: he still lives on Mahendra, and his next
student isn't born yet. Ends on the Navadurga card (no price); the caption and pinned comment point to Parts 1–7.

**Pacing:** Part 6–7's shape (owner, 5 Nov: "pacing is good now"). A fast cold open (0–11.0 s: the hook 3.8 s, then
three names at 2.4 s each), then 16 caption groups in ~82 s, two-line captions up ≥ 3.5 s, three-liners and quotes
≥ 4.5 s.

```
Logline: Parshurama had three famous students. BHISHMA, who refused his guru's order over princess Amba and fought him
         for 23 days at Kurukshetra until Narada and Parshurama's own ancestors stopped it: "No warrior on earth is your
         equal." DRONA, who came when Parshurama had given everything away: "Only my body and my weapons are left.
         Choose." "All your weapons." KARNA, who said "I am a brahmin" and learned the Brahmastra; an insect bored into
         his thigh while his guru slept on his lap and he didn't move; "No brahmin could bear this pain. Who are you?"
         "Karna, son of Radha." "You learned it with a lie: when you face your equal, you will forget it. Go. But no
         warrior on earth will be your equal." Years later all three led the same army at Kurukshetra, one after
         another, and all three fell there. Parshurama never died. He still lives on Mahendra. His next student isn't
         born yet (Kalki).
Why it should travel: three of the biggest Mahabharata names in the hook (and Karna, whose fans fight in every comment
         section), a teacher-vs-student duel, the most famous curse in the epic told from the text, a real twist (the
         first three commanders of the Kaurava army were all his students) and a goosebump ending (he's still alive;
         Kalki). The same words, "no warrior on earth is your equal", go to Bhishma as a blessing and to Karna with a
         curse. The ask is a fan fight: "WHO WAS HIS GREATEST STUDENT? BHISHMA, DRONA OR KARNA?"
Hook:    Frame 0: Parshurama on the crimson sunburst, the axe on his shoulder, looking at us.
         "PARSHURAMA" (gold) / "HAD 3 FAMOUS STUDENTS."
World:   sunburst → blood-red (Bhishma) → gold void (Drona) → violet night (Karna) → Kurukshetra by day and night
         (the duel) → violet night (the sleep weapon) → dawn (the ancestors) → Mahendra by day (Drona, Karna) → dusk
         (the curse) → Kurukshetra at dusk, the five red lakes of Part 5 (all three fall) → Mahendra at dawn → sunrise
         (Kalki) → sunburst → card.
Motif:   THE SAME WORDS ("no warrior on earth is your equal") said twice; THE LAMPS (three lit, three out at
         Kurukshetra); KURUKSHETRA (Part 5's field of five lakes is where his students fight and fall).
```

## Characters
- **Rama (Parshurama)**: `parshurama()`, `flip: 1`, bearded (since Part 5), the axe; his bow (`plainBow()`) in the duel.
- **Bhishma**: `bhishma()` in `parshu8_props.js`, Ram's rig (`ram()`, `crown: 'small'`) in white and silver, a silver
  beard; a plain bow (`plainBow()`), on a chariot (`royalChariot()`, Part 6) in the duel.
- **Amba**: `amba()`, Parvati's rig in a princess's rose and gold, teary.
- **Narada**: `narada()` on a cloud.
- **Rama's ancestors**: `ancestor()` (Part 5), gold ghosts.
- **Drona**: `drona()`, Valmiki's rig, a young brahmin's black beard, a faded dhoti (he came poor).
- **Karna**: `karna()`, Ram's rig with no crown and no bow: golden skin, the gold kundalas he was born with (glowing)
  and the gold kavacha across his chest; a plain white dhoti (he came as a brahmin).
- **The insect** `alarka()`: eight legs, bristles, hog-snouted (Shanti 3).
- **Kalki** `kalki()` + `kalkiHorse()` (src/dashavatar.js), a silhouette.

## Time constants (video s; shared by `src/scenes/parshu8.js` and `tools/parshu8_sfx.mjs`)
```js
B0 = 3.8, C0 = 6.2, D0 = 8.6
F0 = 11.0, FREV = 15.8, G0 = 19.4, H0 = 25.0, NARADA = 26.8, J0 = 30.0, KNEEL = 31.6
L0 = 35.6, M0 = 40.2, MREV = 43.8, GIFT = 44.4
O0 = 46.6, P0 = 51.6, BITE = 53.4, R0 = 57.2, RREV = 60.8, S0 = 63.8, DRAIN = 66.6, T0 = 69.2
U0 = 73.6, W0 = 79.2, X0 = 83.8, Y0 = 88.2, CARD = 92.8, END = 96.8
```

## Shots and reads (captions inside y 420–1500, left of x 930)
**The cold open (fast)**
- **A 0–3.8 · the hook.** Parshurama on the crimson sunburst, axe on his shoulder, looking at us. "PARSHURAMA" / "HAD 3
  FAMOUS STUDENTS."
- **B 3.8–6.2 · Bhishma.** Bhishma close on blood-red, bow drawn. "BHISHMA" / "FOUGHT HIM."
- **C 6.2–8.6 · Drona.** Drona close in gold, the astras circling into his open hands. "DRONA" / "GOT EVERYTHING."
- **D 8.6–11.0 · Karna.** Karna close on violet night, his kundalas glowing, eyes down, a tear. "KARNA" / "LIED TO HIM."
  Iris out.

**Student 1: Bhishma**
- **F 11.0–19.4 · the order.** Kurukshetra by day: Parshurama, Amba weeping behind him, points; 15.8 cut to Bhishma
  close, a hand on his heart, head shaking. "STUDENT 1: BHISHMA." / "HIS GURU ORDERED HIM" / "TO TAKE BACK PRINCESS
  AMBA." → "\"I CANNOT.\"" / "\"NOT EVEN FOR MY GURU.\""
- **G 19.4–25.0 · 23 days.** Intercut, faster and faster: Parshurama looses (left), Bhishma on his chariot looses
  (right), volleys clash in the middle; the sky flips day/night; a gold day count runs 1 → 23. "SO GURU AND STUDENT
  FOUGHT" / "AT KURUKSHETRA" / "FOR 23 DAYS."
- **H 25.0–30.0 · the sleep weapon.** Night. Bhishma draws an arrow glowing violet; 26.8 Narada drops in on his cloud,
  palm up; Bhishma lowers it. "BHISHMA RAISED A WEAPON OF SLEEP." / "NARADA STOPPED HIM:" / "\"HE IS YOUR GURU!\""
- **J 30.0–35.6 · the same words, first time.** Dawn: gold ancestors at Parshurama's shoulders; he lowers his bow and
  lays it down; 31.6 Bhishma, arrows in his armour, kneels; Parshurama's hand on his head. "PARSHURAMA LAID DOWN HIS
  BOW:" / "\"NO WARRIOR ON EARTH" / "IS YOUR EQUAL.\""

**Student 2: Drona**
- **L 35.6–40.2 · nothing left.** Mahendra: Parshurama alone on the rock, bow and axe beside him; Drona climbs in,
  thin, in a faded dhoti, and bows. "STUDENT 2: DRONA." / "BY THEN, PARSHURAMA HAD GIVEN" / "EVERYTHING AWAY."
- **M 40.2–46.6 · choose.** Parshurama close, one hand on his chest, the other to the weapons: "\"ONLY MY BODY AND MY
  WEAPONS" / "ARE LEFT. CHOOSE.\"" 43.8 cut to Drona: "\"ALL YOUR WEAPONS.\"" 44.4 the astras stream into his hands.

**Student 3: Karna**
- **O 46.6–51.6 · the lie.** Mahendra: Karna bows; Parshurama lays a glowing light (the Brahmastra) in his palms.
  "STUDENT 3: KARNA." / "\"I AM A BRAHMIN,\" HE LIED," / "AND LEARNED THE BRAHMASTRA."
- **P 51.6–57.2 · the lap.** Under a tree: Parshurama asleep, head on Karna's lap; the insect crawls up; 53.4 close on
  Karna: it bites, he squeezes his eyes, sweats, doesn't move; a drop of blood. "HIS GURU SLEPT ON HIS LAP." / "AN
  INSECT BORED INTO HIS THIGH." / "KARNA DIDN'T MOVE."
- **R 57.2–63.8 · who are you?** Parshurama wakes, sits up, sees the blood, his eyes blaze: "\"NO BRAHMIN COULD BEAR
  THIS PAIN." / "WHO ARE YOU?\"" 60.8 Karna close, kneeling, tears: "\"KARNA," (huge gold) / "SON OF RADHA.\""
- **S 63.8–69.2 · the curse.** Low angle, dusk, violet: Parshurama, the curse wave; 66.6 Karna's light drains out of
  his hands. "\"YOU LEARNED IT WITH A LIE." / "WHEN YOU FACE YOUR EQUAL," / "YOU WILL FORGET IT.\""
- **T 69.2–73.6 · the same words, second time.** Wide dusk: Parshurama turns away; Karna walks off down the mountain.
  "\"GO. BUT NO WARRIOR ON EARTH" / "WILL BE YOUR EQUAL.\""

**The twist and the ending**
- **U 73.6–79.2 · Kurukshetra.** Dusk over the five red lakes (Part 5); three silhouettes with name tags and a lamp each
  (BHISHMA, DRONA, KARNA) light up one after another; then the lamps go out one by one and the figures sink into the
  dust. "AT KURUKSHETRA, ALL THREE" / "LED THE SAME ARMY, ONE BY ONE." / "ALL THREE FELL THERE."
- **W 79.2–83.8 · still alive.** Mahendra at dawn: Parshurama in meditation, the axe and bow laid on the rock. "BUT
  PARSHURAMA NEVER DIED." / "HE STILL LIVES ON MAHENDRA MOUNTAIN." / tag "BHAGAVATA PURANA 9.16"
- **X 83.8–88.2 · the next student.** Sunrise: a rider on a white horse crosses the far ridge, sword raised (a
  silhouette); Parshurama opens his eyes and smiles. "HIS NEXT STUDENT" / "ISN'T BORN YET." / tag "KALKI PURANA"
- **Y 88.2–92.8 · the ask.** Sunburst, three portraits with name tags. "WHO WAS HIS GREATEST STUDENT?" / "BHISHMA, DRONA
  OR KARNA?" / "COMMENT!"
- **card 92.8–96.8.** `navCard()`.

## Facts used
All Mahabharata beats from K. M. Ganguli's translation (sacred-texts numbering; read on a mirror of it), one version
each. Parshurama's living on Mahendra is the Bhagavata Purana; Kalki's teacher is the Kalki Purana, labelled on screen.

| Beat | Source |
|---|---|
| Rama tells Amba he takes up arms only for those who know the Vedas, but promises Bhishma will obey him; comes to Kurukshetra with her | Udyoga 180 |
| "Thou knowest me to be thy preceptor, and yet thou acceptest not, for pleasing me, this daughter of the ruler of Kasi" | Udyoga 181 |
| Bhishma refuses: "I cannot, by any means, bestow this girl on my brother"; "I would not, even from fear of Vasava, forsake duty"; "Thou art my preceptor" | Udyoga 181 |
| Ganga tries to make Bhishma desist; they fight at Kurukshetra | Udyoga 181 |
| "And it lasted for three and twenty days together" | Udyoga 185 |
| Eight Brahmanas in a dream give Bhishma the Praswapa (sleep) weapon: "asleep or dead we reckon it as the same" | Udyoga 186 |
| A voice and the gods forbid it; Narada: "he is, again, thy preceptor! Never humiliate him." | Udyoga 188 |
| Rama's Pitris: never fight Bhishma or any Kshatriya again, "throw thy bow aside"; "the Pitris caused [him] to place aside his weapons" | Udyoga 188 |
| Bhishma, "though mangled exceedingly", approaches Rama and worships him | Udyoga 188 |
| Rama: "There is no Kshatriya equal to thee on the earth! Go now, O Bhishma, for in this combat thou hast pleased me highly." | Udyoga 188 |
| Drona hears of Rama's weapons and goes to Mahendra; Rama: gold and wealth given to Brahmanas, the earth to Kasyapa, "I have now my body alone and my various valuable weapons left… which thou wouldst have"; Drona: "all thy weapons together with the mysteries of hurling and recalling them"; Rama gives them | Adi 131 |
| Karna to Rama on Mahendra: "I am a Brahmana of Bhrigu's race" | Shanti 2 |
| Rama sleeps with his head on Karna's lap; a worm called Alarka, eight feet, keen teeth, needle bristles, hog-shaped, pierces his thigh; "through fear of awaking his preceptor" he doesn't move | Shanti 3 |
| Rama wakes, wet with the blood: "no Brahmana could endure such agony… Tell me the truth" | Shanti 3 |
| Karna: "People call me Karna the son of Radha" | Shanti 3 |
| The curse: "Since thou hast, from avarice of weapons, behaved here with falsehood… this Brahma weapon shall not… dwell in thee when thou shalt be engaged with a warrior equal to thyself" | Shanti 3 |
| "Go hence… On earth, no Kshatriya will be thy equal in battle." | Shanti 3 |
| Bhishma, then Drona, then Karna commanded the Kaurava army (the Bhishma, Drona and Karna Parvas) and fell at Kurukshetra | MBh 6–8 |
| Kurukshetra = Samantapanchaka, the five lakes (Part 5) | Adi 2 |
| "Lord Parasurama still lives… in the mountainous country known as Mahendra… having given up all the weapons" | Bhagavata 9.16.26 |
| Kalki is trained by Parashurama | Kalki Purana (labelled) |

**On screen, honestly:** "TO TAKE BACK PRINCESS AMBA" condenses 181 ("acceptest not… this daughter of the ruler of
Kasi"); "I CANNOT. NOT EVEN FOR MY GURU." condenses 181 ("I cannot, by any means…", "even from fear of Vasava",
"thou art my preceptor"). "A WEAPON OF SLEEP" is the Praswapa (186). "NO WARRIOR ON EARTH" is Ganguli's "no
Kshatriya", in both places. "LAID DOWN HIS BOW" is 188 (the Pitris made him put his weapons aside). "STUDENT" for
Bhishma rests on 181–182 ("thy disciple", "my preceptor"). "WHEN YOU FACE YOUR EQUAL, YOU WILL FORGET IT" joins the
curse's two halves ("shall not dwell in thy remembrance", "engaged with a warrior equal to thyself"). "LED THE SAME
ARMY, ONE BY ONE" is the order of the commanders. "NEVER DIED" rests on 9.16.26 (he still lives). "HIS NEXT STUDENT
ISN'T BORN YET" is the Kalki Purana, labelled. Not claimed: Amba drawn beside Rama in the order shot, Ganga's charioteering
(left out), the arrows drawn in Bhishma's armour (188: "mangled"), Kalki's look. Left out: the brahmin's homa-cow curse
(the chariot wheel; in the pinned comment), Amba's vow and Shikhandi, Karna's death.

**The pinned comment:** the sources by chapter, the second curse (the homa cow: "the earth shall swallow the wheel of
thy car", Shanti 2) and how both curses came true on the 17th day, and Alarka's past life (the asura Dansa, cursed by
Bhrigu, freed by Rama's glance).

## Cover
`src/scenes/parshu8_cover.js` (`cover.html`): Parshurama centre, Bhishma left, Karna right; the orange "PART 8 ·
FINALE" pill over "PARSHURAMA'S" (gold) / "3 STUDENTS".

## Out
`out/parshu8_out/` (parshu8.mp4, cover.png, captions.txt).
