# Ad 88: "HANUMAN met RAM in DISGUISE" (Hanuman series, Part 3)

An 89.2 s Painted reel with Bangers captions, no voiceover, retro cartoon SFX and music only as mild beds (a plucked
vamp at the lake, a warm pad and harp over the dusk flight, a music box under the ask). Part 3 of the 10-part Hanuman
Ji series (`HANUMAN_SERIES.md` on `main`); it stands alone, and ends on the no-price Navadurga card.

```
Logline: The first time Hanuman met Ram, he wasn't a monkey at all. Sugriva, terrified of two strangers with bows,
         sent him as a wandering monk. He praised them, got no answer, gave himself away, and Ram turned to Lakshman
         and praised... his words. Then he became himself again and carried both brothers on his back.
Why it should travel: a secret identity in the hook (the monk winks, poofs into Hanuman and back: "shh"), a cute
         awkward silence everyone knows, the nugget to share (Ram's first praise was for his speech, not his
         strength), and a devotional comment ask.
Hook:    Frame 0: the little saffron monk, palms joined, eyes shut, on warm gold. Caption up: "HANUMAN MET RAM" /
         "IN DISGUISE" (gold). 0.9 one eye opens; 1.5 poof: it's Hanuman, waving; 2.7 poof: the monk again,
         startled; 3.3 a finger to his lips, a wink.
Arc:     Sugriva: scared → panicking → pleading. Hanuman: calm → a bright idea → (as the monk) polite → starry-eyed
         → awkward → found out, blushing → overwhelmed by praise → glad, carrying them.
Ending rhyme: the twist and the ask go back to frame 0's warm gold.
```

## Characters (new ones in the series kit, `src/hanuman_series.js` on `main`)
- **Hanuman** (`hanuman()`, no crown, no gada: he is Sugriva's minister, not yet Ram's).
- **The bhikshu** (NEW, `bhikshu()`): Hanuman's disguise on Narad's rig with a human face: saffron robes, a tawny
  jata with a marigold, a rudraksha mala, his sindoor tilak, no tail, a little blush.
- **Sugriva** (NEW, `sugriva()`): Hanuman's rig, tawny fur, a teal dhoti, a king's mukut.
- **Ram, Lakshman in the forest** (NEW, `vanRam()`, `vanLakshman()`): jata, bark cloth, rudraksha, no crown or gold;
  the bows stay (3.16).

## Time constants (video s; shared by `src/scenes/hanu3.js` and `tools/hanu3_sfx.mjs`)
```js
PEEK = .9, POOF1 = 1.5, POOF2 = 2.7, SHH = 3.3
B0 = 4.6, SEE = 6.2, DUCK = 7.2, C0 = 9.0, CATCH = 11.6, D0 = 13.4, E0 = 17.6, SPIN = 18.3, POOF = 19.0, CHECK = 20.2, PHEW = 21.1
F0 = 22.2, BOWS = 23.9, G1 = 26.4, G2 = 30.6, G3 = 34.8, WHY = 36.0, H1 = 39.8, H2 = 44.2
I1 = 48.2, I2 = 53.0, I3 = 57.4, J0 = 62.2, WORDS = 64.6
K0 = 67.2, KPOOF = 67.8, LIFT = 69.2, LEAP = 71.2, L0 = 72.4, ASK0 = 77.4, NEXT0 = 81.8, CARD = 85.2, END = 89.2
```

## Shots and reads (captions inside y 420–1500, left of x 930; 2-liners ≥ 3.5 s, 3-liners ≥ 4.5 s)
The "HANUMAN · PART 3" pill shows for the opening only (0–8.8 s), the source line ("VALMIKI RAMAYAN · KISHKINDHA
KANDA") beside it from 4.9 s; both fade out before the panic (owner's rule, 11 Nov).

| time | shot | caption |
|---|---|---|
| 0–4.6 | the hook (above) | HANUMAN MET RAM / IN DISGUISE |
| 4.6–9.0 | Rishyamuka: Sugriva peeks over a rock, Hanuman meditates; two tiny archers by the lake far below; 6.2 "!", teeth chatter; 7.2 he ducks, only his eyes show | SUGRIVA, A MONKEY KING, WAS HIDING / FROM HIS BROTHER, VALI. |
| 9.0–13.4 | he boings rock to rock, "!!"; Hanuman sweats; 11.6 lands by Hanuman, who steadies him | ONE DAY HE SAW TWO STRANGERS WITH BOWS. / "VALI HAS SENT THEM!" |
| 13.4–17.6 | Sugriva pleads; a bubble: an ordinary man, "?"; 16.3 Hanuman: "ji!", a sparkle | "HANUMAN, GO AS A COMMON MAN. / FIND OUT WHO THEY ARE!" |
| 17.6–22.2 | a bulb; 18.3 he spins up in light; 19.0 POOF: a monk; 20.2 he checks behind him (no tail!); 21.1 hands up, glee | SO HANUMAN HID HIS MONKEY FORM / AND BECAME A WANDERING MONK. |
| 22.2–26.4 | lake Pampa: the monk walks in, 23.9 joins his palms and bows; Lakshman wary, a hand on his bow | HE BOWED TO THE TWO BROTHERS / AND BEGAN TO SPEAK… |
| 26.4–30.6 | crowns pop over their heads, then halos; "?" | "YOU LOOK LIKE KINGS… OR GODS! / WHO ARE YOU?" |
| 30.6–34.8 | heart eyes; bubbles: a little elephant, then a lotus opening; Ram blushes, Lakshman goes shy | "ARMS LIKE ELEPHANT TRUNKS! / EYES LIKE LOTUS PETALS!" |
| 34.8–39.8 | silence: "…", a leaf goes by, a cricket; 36.0 the monk pleads, pouting | "I KEEP ON TALKING… / WHY DON'T YOU SAY SOMETHING?" |
| 39.8–44.2 | he scratches his head, blushing; a bubble: the real Hanuman waving; Lakshman "!" | "I AM HANUMAN, A VANARA. / THIS MONK IS ONLY A DISGUISE." |
| 44.2–48.2 | palms joined; a bubble: Sugriva, palms joined, a heart | "MY KING, SUGRIVA, / WANTS TO BE YOUR FRIEND." |
| 48.2–53.0 | push in on Ram talking to Lakshman; three Vedas stack up beside him, one by one | RAM TURNED TO LAKSHMAN: / "ONLY ONE WHO KNOWS ALL THREE VEDAS / CAN SPEAK LIKE THIS." |
| 53.0–57.4 | push in on the monk, overwhelmed: shining eyes, wobbly mouth, notes, hearts | "HE SAID SO MUCH… / AND NOT ONE WORD WAS WRONG." |
| 57.4–62.2 | he hides his face, steaming; Ram's bubble: a raised sword goes soft and becomes a heart | "EVEN AN ENEMY WITH A RAISED SWORD / WOULD MELT, HEARING HIM." |
| 62.2–67.2 | warm gold: a bubble of strength (Hanuman with his gada) dims; 64.6 burst of light from the monk's mouth | THE FIRST THING RAM PRAISED / WAS NOT HIS STRENGTH. / IT WAS HIS WORDS. |
| 67.2–72.4 | 67.8 POOF: Hanuman; 69.2 the brothers sail up onto his shoulders; 71.2 he leaps out of frame | THEN HE BECAME HIMSELF AGAIN / AND PUT BOTH BROTHERS ON HIS BACK! |
| 72.4–77.4 | flying over dusk hills, Ram patting his head, Lakshman cheering, hearts | RAM HAD LOST HIS KINGDOM AND HIS SITA. / THAT DAY, HE FOUND HANUMAN. |
| 77.4–81.8 | warm gold, Hanuman with joined palms, hearts | IF YOU LOVE HANUMAN JI, / COMMENT / JAI SHRI RAM! |
| 81.8–85.2 | night: Hanuman sits alone, a rain cloud over him | NEXT: THE NIGHT HANUMAN / ALMOST GAVE UP |
| 85.2–89.2 | `hsCard()` (no-price Navadurga card); ends on the full card | |

## Sound (tools/hanu3_sfx.mjs → assets/hanu3_sfx.wav → assets/hanu3_mix.wav, −16.8 LUFS)
Poofs and giggles for the disguise and a "shh"; birds and a breeze on the hill; Sugriva's eek, chattering teeth,
boing hops and thuds; Hanuman's calm buzzy talk; a chime for the bright idea, a rising shimmer and a big poof for the
change, pat-pat (no tail), glee; footsteps and a plucked vamp at the lake; pops for the crowns, a shimmer for the
halos, a tiny trumpet for the elephant; one cricket in the silence; three chimes for the Vedas; a music box for "not
one word wrong"; steam and a soft boing for the melting sword; a drum and a swelling chord for "his words"; the
lift, a launch and a "wheee"; a warm pad and harp over the dusk flight; a music box under the ask; a rain cloud and
crickets for the tease; card pops.

## Facts used
**Valmiki Ramayana, Kishkindha Kanda** (verse numbers as at valmikiramayan.net/utf8/kish/sarga2–4, read 12 Nov 2026):
- 2.1–5: Sugriva sees Rama and Lakshmana, "wielders of the best weapons", and is terrified, unable to stay in one place.
- 2.6, 2.21: he thinks they come in disguise and that Vali has sent them.
- 2.9–10: the vanaras flee, leaping from mountain to mountain. (On screen: Sugriva hops from rock to rock.)
- 2.14–16: Hanuman: Vali is not here; there is nothing to fear.
- 2.24–27: Sugriva: "go to them in the form of a common man (prakṛta), since your monkey form would be known; learn
  their intentions from their looks and their speech."
- 3.2: casting off his monkey form, Hanuman took the form of a mendicant (bhikṣu).
- 3.3–5: he greeted them softly and bowed.
- 3.5–14: his praise: like royal sages or gods (3.5, 3.11, 3.13), arms like elephants' trunks (3.10), eyes like
  lotus petals (3.12), ascetics in jata and bark cloth (3.8, 3.12).
- 3.19: "while I keep speaking like this, why do you not answer me?"
- 3.20–23: Sugriva, a righteous vanara, cast out by his brother Vali; "I am Hanuman, a vanara, his minister, son of
  the Wind; Sugriva wants your friendship; I came in a mendicant's form to please him."
- 3.25–28: Ram, pleased, to Lakshman: no one who has not learnt the Rig, the Yajur and the Sama Veda can speak like this.
- 3.29: he has surely learnt grammar well; for all he said, not one word was wrong.
- 3.33: whose heart would not be won by such speech, even an enemy's with his sword raised.
- 4.9–14: Lakshman tells him Ram has lost his kingdom and that his wife has been carried off.
- 4.34: putting off the mendicant's form, Hanuman took his own, set the two heroes on his back and went to Sugriva.
- 4.35: he went gladly, like one whose hard task is done.
- Not claimed: anything Hanuman felt at seeing Ram (Valmiki gives only his gladness, 3.39, 4.1); the Manas meeting
  (Hanuman as a brahmin, falling at Ram's feet) is a different text and is not used.
- Performance only (no plot claims): the hook's poofs and wink, the crowns and halos, the elephant and lotus bubbles,
  the leaf and the cricket, the tail check, the melting sword, the flight at dusk (the text says only that he carried
  them to Sugriva's mountain), Ram patting his head. "That day, he found Hanuman" is the caption's voice, not a quote.

## Cover, caption, pinned comment
`src/scenes/hanu3_cover.js` (`cover.html`): the winking monk with a finger to his lips and Hanuman beside him,
grinning; the orange PART 3 pill over "HANUMAN MET RAM" / "IN DISGUISE" (gold). The Instagram caption and the pinned
comment are in `out/hanu3_out/captions.txt`.
