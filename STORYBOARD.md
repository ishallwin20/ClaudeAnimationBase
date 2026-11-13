# Ad 90: "8 BOONS. 8 SIDDHIS. 9 NIDHIS." (Hanuman series, Part 2.1)

An 84.8 s Painted reel with Bangers captions, no voiceover, retro cartoon SFX and music only as mild beds. A bonus
part of the Hanuman Ji series (`HANUMAN_SERIES.md` on `main`), between Part 2 (the eight boons, ad 86) and Part 3; it
stands alone, and ends on the no-price Navadurga card. Owner, 13 Nov 2026: "use the popular source but quote it; if
it's Valmiki, perfect."

```
Logline: Every home sings "ashta siddhi nau nidhi ke data". Most people think the 8 siddhis are the 8 boons baby
         Hanuman got from 8 gods. They are three different things: the boons are a SHIELD (what can't hurt him), the
         siddhis are POWERS (what he can do: Valmiki shows him tiny, huge and heavy), the nidhis are TREASURES
         (Kubera's). Twist: "ke data": he is the GIVER, and the Chalisa says Sita Mata gave him that boon.
Why it should travel: it settles a confusion people have sung past all their lives; a list to save (three rows that
         fill on screen, each name said once); Valmiki "proof" scenes for the siddhis viewers already know (the cat,
         Surasa, Meru, the mountain that sank); an identity ask (your Chalisa line).
Hook:    Frame 0: Hanuman on warm gold, three number badges round him (8 · 8 · 9). Caption up: "8 BOONS. 8 SIDDHIS.
         9 NIDHIS." / "MOST PEOPLE MIX THEM UP!" (gold). 1.2 he looks from badge to badge; 2.6 scratches his head, "?".
Motif:   THE ROWS. Part 2's row of eight boon slots, then a violet row of eight siddhi slots that fill one by one as each
         siddhi is shown, then a green row of nine nidhi slots that fill as the names are read; the summary shows the
         three as badges.
Sources on screen: every proof scene carries a small line under its caption ("VALMIKI · SUNDARA 2.49"); the shloka
         and the Amarakosha are named the same way; the Chalisa line is shown in Devanagari.
```

## Characters
- **Hanuman** (`hanuman()`, no gada), grown: sizes change in the siddhi scenes.
- **Bal Hanuman** (`balHanuman()`), for the boons recap (C, D).
- **Sita** (`parvati()` + `SITA_PAL`, no crown) in the Ashoka grove (F2, K).
- **Surasa** (NEW prop `h21Surasa`, scene only): the mother of the nagas (5.1.145), a giant green serpent head rising
  from the sea, her mouth opening wider and wider; she smiles at the end (5.1.170–171).
- **Kubera** (series kit `kubera()`) with nine treasures circling him (G, H).
- A cat on Lanka's wall for scale (F1, performance only).

## Time constants (video s; shared by `src/scenes/hanu21.js` and `tools/hanu21_sfx.mjs`)
```js
LOOK = 1.2, SCRATCH = 2.6
B0 = 4.4, C0 = 9.0, QM = 11.4, D0 = 13.4, BOLT = 14.0, ARROW = 15.0, MACE = 16.0, E0 = 17.8
F1 = 22.6, SHRINK = 23.5, F2 = 26.8, GROW = 27.6, F3 = 31.0, SG = [31.4, 32.0, 32.6], THUMB = 33.3, INTO = 33.7, OUT = 34.3
F4 = 35.6, PRESS = 36.3, SINK = 36.5, LEAP = 36.7, F5 = 40.0, F6 = 44.0, F7 = 48.6, PAIR = 2.2
G0 = 53.2, H0 = 57.6, I0 = 62.4, K0 = 67.0, BLESS = 68.2, L0 = 71.8, M0 = 76.4, CARD = 80.8, END = 84.8
```

## Shots and reads (captions inside y 420–1500, left of x 930; 2-liners ≥ 3.5 s, 3-liners ≥ 4.5 s)
18 caption groups in 81 s (≤ 15 a minute). The "HANUMAN · PART 2.1" pill and the source line ("HANUMAN CHALISA")
show in B only (4.4–9.0), then fade out (owner's rule, 11 Nov).

| time | shot | caption | small source line |
|---|---|---|---|
| 0–4.4 | the hook (above) | 8 BOONS. 8 SIDDHIS. 9 NIDHIS. / MOST PEOPLE MIX THEM UP! | |
| 4.4–9.0 | warm gold: he sits by a diya, eyes shut, singing (notes); the line in gold Devanagari: अष्ट सिद्धि नौ निधि के दाता | IN THE CHALISA WE SING: / (Devanagari) / ASHT SIDDHI NAU NIDHI KE DATA | (pill) HANUMAN CHALISA |
| 9.0–13.4 | the boon stage: baby Hanuman on a cloud, Part 2's eight boon slots lit; 11.4 "?" | AS A BABY, HE GOT 8 BOONS FROM 8 GODS. / ARE THOSE THE 8 SIDDHIS? | |
| 13.4–17.8 | a gold bubble round the baby: a bolt, an arrow and a mace bounce off it | NO. THE 8 BOONS ARE A SHIELD: / NOTHING CAN HURT HIM. | VALMIKI · UTTARA KANDA 36 |
| 17.8–22.6 | a violet stage: grown Hanuman meditating, an aura; eight empty violet slots tick in; the shloka in Devanagari | THE 8 SIDDHIS ARE POWERS / HE CAN USE, LIKE A YOGI. | THE POPULAR SHLOKA · LISTS VARY |
| 22.6–26.8 | Lanka's wall at night: 23.5 poof, he is the size of the cat beside him, who stares; he tiptoes off. Slot 1 | 1 · ANIMA: BECOME TINY / HE ENTERED LANKA THE SIZE OF A CAT! | VALMIKI · SUNDARA 2.49 |
| 26.8–31.0 | the Ashoka grove: 27.6 he grows and grows, blazing, beside Sita; she gasps. Slot 2 | 2 · MAHIMA: BECOME HUGE / FOR SITA, HE GREW LIKE MOUNT MERU! | VALMIKI · SUNDARA 37.35 |
| 31.0–35.6 | over the sea: Surasa's mouth widens three times, he grows three times; 33.3 poof, thumb-sized; 33.7 zips in, 34.3 out; she smiles | AGAINST SURASA HE USED BOTH: / HUGE… THEN THE SIZE OF A THUMB! | VALMIKI · SUNDARA 1.166–168 |
| 35.6–40.0 | Mount Arishta: he presses down (36.3), leaps away (36.7) and the mountain sinks into the earth (36.5–38.5). Slot 3 | 3 · GARIMA: BECOME HEAVY / A MOUNTAIN SANK UNDER HIS FEET! | VALMIKI · SUNDARA 56.26–33 |
| 40.0–44.0 | the sky: he floats on a feather, eyes shut, bobbing. Slot 4 | 4 · LAGHIMA: BECOME LIGHT / AS LIGHT AS A FEATHER. | |
| 44.0–48.6 | violet stage: he reaches up and a star drops into his hand (5); a wish bubble, a laddoo appears (6) | 5 · PRAPTI / REACH ANYTHING, ANYWHERE · 6 · PRAKAMYA / ANY WISH COMES TRUE | |
| 48.6–53.2 | a crown of light round him (7); he points and the wind turns (8). All eight hop | 7 · ISHITVA / LORDSHIP OVER ALL · 8 · VASHITVA / EVERYTHING OBEYS | |
| 53.2–57.6 | a green-gold stage: Kubera, nine treasures circling him; nine empty green slots tick in | THE 9 NIDHIS ARE TREASURES, / AND THEY BELONG TO KUBERA. | AMARAKOSHA 1.1.71 |
| 57.6–62.4 | the treasures fly into the slots in time with the names | PADMA, MAHAPADMA, SHANKHA, / MAKARA, KACHCHHAPA, MUKUNDA, / KUNDA, NILA, KHARVA. | |
| 62.4–67.0 | warm gold: Hanuman holds out his cupped hands; the treasures and the siddhi icons float from them toward us; the Devanagari line, दाता glowing | NOW HEAR THE LINE AGAIN: / "…KE DATA": THE GIVER! | |
| 67.0–71.8 | the Ashoka grove: Sita raises her hand in blessing (68.2); gold light settles on him; he bows, palms joined | AND WHO GAVE HIM THAT BOON? / "AS BAR DEEN JANAKI MATA." / SITA MATA HERSELF. | |
| 71.8–76.4 | warm gold: three badges pop in turn under him (a shield 8, a violet 8, a green 9) | BOONS: HIS SHIELD. / SIDDHIS: HIS POWERS. / NIDHIS: HIS GIFTS TO GIVE. | |
| 76.4–80.8 | he sits singing by the diya, notes, hearts | WHICH CHALISA LINE DO YOU / KNOW BY HEART? / COMMENT IT! | |
| 80.8–84.8 | `hsCard()` (no-price Navadurga card); ends on the full card | | |

## Sound (tools/hanu21_sfx.mjs → assets/hanu21_sfx.wav → assets/hanu21_mix.wav at about −16 LUFS)
Part 2's palette: pops for the badges and the "?"; a sung "ashta siddhi" phrase as a hummed tune over a tanpura-like
drone; chimes as the boon slots light; a zap, a twang and a bonk off the shield; a soft om under the meditation and
ticks for the empty slots; per siddhi a rising fanfare note (a step higher each time) when its slot fills; a poof
and a tiny squeak for anima and a cat's "mrrp?"; a deep rising whoosh and rumble for mahima; Surasa's three growls
against his three "hup"s, the poof, a zip in, a zip out and her laugh; a heavy thud, rockfall and rumble as the
mountain sinks, a boing for the leap; a soft breeze and harp for the feather; a twinkle for the star, a "pop!" for
the laddoo; a shimmer for the crown, a gust for the wind; coins-and-bells shimmer for Kubera and nine plinks up a
scale for the nidhis; a warm swell for the giver; a harp and a soft chord for Sita's blessing; three pops for the
badges; a music box under the ask; card pops. No tease of the next part: 2.1 posts before Parts 3 and 4 (owner, 13 Nov).

## Facts used
**Hanuman Chalisa (Tulsidas), chaupai 31:** "अष्ट सिद्धि नौ निधि के दाता । अस बर दीन जानकी माता ॥" — "Giver of the eight
siddhis and the nine nidhis: Mother Janaki gave you this boon." (The only source for "giver" and for Sita's boon;
named on screen. Valmiki does not say Sita gave him siddhis.)

**The eight boons: Valmiki Ramayana, Uttara Kanda 36.10–21** (read for Part 2, ad 86, in Sanskrit at
heritage.iitk.ac.in/VRAM/7.36.N): Indra (his vajra will not kill him), Surya (a hundredth of his light, and the
shastras), Varuna (noose and water), Yama (his staff; no illness), Kubera (his mace), Shiva (his weapons), Brahma
(Brahma-weapons; long life), Vishvakarma (the weapons he made). All are "cannot be killed / harmed by…" plus Surya's
gift of light and learning, hence "a shield". On screen: a bolt, an arrow and a mace bounce off.

**The eight siddhis, the popular list:** "अणिमा महिमा चैव गरिमा लघिमा तथा । प्राप्तिः प्राकाम्यमीशित्वं वशित्वं चाष्टसिद्धयः ॥"
(aṇimā, mahimā, garimā, laghimā, prāpti, prākāmya, īśitva, vaśitva). This is the list most people learn. One site
attributes it to the Skanda Purana (Brahmottara Khanda 7.41), but that page could not be read on 13 Nov, so the
reel names it only "the popular shloka". **Lists vary** (said on screen in small type and in the pinned comment):
- Bhagavata Purana 11.15.4–5 (read at vedabase.io): aṇimā, mahimā, laghimā, prāpti, prākāmya, īśitā, vaśitā and
  kāmāvasāyitā ("whatever one desires, one obtains"). No garimā.
- Markandeya Purana 40.29 (read at enjoylearningsanskrit.com): aṇimā, laghimā, mahimā, prāpti, prākāmya, īśitva,
  vaśitva "and another". No garimā.
Plain meanings on screen (kid-simple glosses of the names): anima tiny, mahima huge, garima heavy, laghima light,
prapti reach anything, prakamya any wish fulfilled, ishitva lordship, vashitva control ("everything obeys").

**Valmiki shows three of them** (Sundara Kanda, verse numbers as at valmikiramayan.net/utf8/sundara/sarga{1,2,37,56}/
sundarasans{N}.htm, read 13 Nov 2026). Valmiki never uses the word "siddhi" for these; the reel says "he entered
Lanka the size of a cat", not "Valmiki says anima".
- **Tiny:** 5.2.49: after sunset he shrank his body to the size of a cat (vṛṣadaṃśaka-mātraḥ), "a wonderful sight";
  5.2.50: he entered the city.
- **Huge:** 5.37.33–35: to give Sita confidence he showed his form and began to grow; he shone like Meru and
  Mandara, blazing like fire; 5.37.37: "I can carry Lanka itself".
- **Both, with Surasa:** 5.1.145–147 the gods ask Surasa, mother of the nagas, to open a mouth as wide as the sky;
  5.1.160–166 she widens her mouth, he grows to match, up to ninety yojanas; 5.1.167 he shrank his body to the size of
  a thumb (aṅguṣṭhamātrakaḥ); 5.1.168 he quickly entered her mouth and came out; 5.1.170–171 Surasa, in her own form,
  tells him to go and bring Sita and Ram together.
- **Heavy:** 5.56.22: the rocks under the soles of his feet were crushed; 5.56.26 and 32: pressed by him, Mount
  Arishta sank into the earth; 5.56.33: it was levelled with the ground (as he leapt back across the sea).
- Laghima and siddhis 5–8 get no Valmiki proof scene: only their meanings are shown.

**The nine nidhis: Amarakosha 1.1.71** (read at kosha.sanskrit.today): "महापद्मश्च पद्मश्च शङ्खो मकरकच्छपौ ।
मुकुन्दकुन्दनीलाश्च खर्वश्च निधयो नव ॥" — Mahapadma, Padma, Shankha, Makara, Kachchhapa, Mukunda, Kunda, Nila, Kharva,
in the Amarakosha's section on the guardians of the directions, as Kubera's treasures. (Markandeya Purana 68.5–6 names
eight, with Nandaka and without Kunda and Kharva: in the pinned comment.) On screen: lotus, a bigger lotus, a conch, a
makara, a tortoise and four jewels, after the names; no coins or money piles (the nidhis are named treasures).

Not claimed: that Valmiki names the siddhis; that Sita gave him the siddhis in Valmiki (only the Chalisa says so);
what he does with them, or to whom he gives them (only "giver", the Chalisa's word); which list is "right".
Performance only (no plot claims): the cat on the wall, the feather, the star and the laddoo (5, 6), the crown of light
and the turning wind (7, 8), Sita's raised hand, the badges, Hanuman counting and scratching his head.

## Cover, caption, pinned comment
`src/scenes/hanu21_cover.js` (`cover.html`): Hanuman with the three badges, the orange PART 2.1 pill over "8 BOONS ·
8 SIDDHIS" / "9 NIDHIS" (gold) / "NOT THE SAME!". The Instagram caption and the pinned comment are in
`out/hanu21_out/captions.txt`.
