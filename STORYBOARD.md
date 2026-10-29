# Ad 63: "PARSHURAMA was born a WARRIOR because of a KHEER MIX-UP" (Parshurama series, Part 1)

A 73 s Painted reel with Bangers captions, no voiceover, retro cartoon SFX and only a mild bed under the story. It
stands on its own (anyone can start the series here) and ends on the Books 1–3 card, ₹500 for the set.

```
Logline: A king's queen swaps two bowls of sacred kheer that a sage made for her and her daughter: one would give a calm
         sage, the other a fierce warrior. The daughter begs, and the warrior's fire skips her son and lands on her
         grandson: Parshurama. The same swap gave the queen a son who became Vishvamitra.
Why it should travel: everyone knows Parshurama as the brahmin with an axe; almost nobody knows WHY a sage's son was born
         a warrior. The answer is a family kitchen mix-up, and it carries a second twist (Vishvamitra). "Known yet unknown."
Hook:    Frame 0: two clay bowls of kheer side by side on a plain peach ground, steam rising, one with a soft gold glow,
         one with a red-orange glow. Caption up: "PARSHURAMA WAS BORN A WARRIOR" / "BECAUSE OF A KHEER MIX-UP" (the name
         and KHEER gold). At 1.2 s a hand slides them past each other: SWAP.
World:   the peach hook → King Gadhi's court (Ayodhya's court from the Ramayan kit, recoloured) → a river bank at noon
         (Varuna's horses) → Richika's ashram kitchen at dusk (the fire, the two bowls) → the same, lamplit (the swap,
         tiptoe comedy) → a cooler stern light (Richika knows) → warm again (the plea) → a cradle, then years (a soft
         time-lapse) → Parshurama on a ridge at sunset, the aura → Vishvamitra in tapas → the hook's bowls → the card.
Motif:   THE TWO BOWLS: gold = the calm sage, red = the warrior. Their two glows recur: the gold glow round baby
         Jamadagni, the red glow as Parshurama's aura, the gold glow round Vishvamitra. The bowls open and close the reel.
Arc:     puzzled (frame 0) → smug king → wonder (the horses) → hope (both want sons) → sneaky → busted → begging →
         relief → awe (Parshurama) → twist (Vishvamitra).
```

## Characters
- **Richika** (Bhrigu's son): `valmiki()` with a black beard and hair (young), a white dhoti, a rudraksha mala.
- **Satyavati**: `parvati()` in a soft yellow saree, a red border, no crown, a little bindi.
- **The queen** (Gadhi's wife; the sources don't name her, so the captions call her "her MOTHER"): `kaikeyi()`
  recoloured to plum and gold.
- **King Gadhi**: `dasharatha()` recoloured (a teal and gold dhoti, a black beard going grey).
- **The thousand horses**: `suryaHorse()` in white, with a new `earL` / `earR` colour option on the shared rig for the
  one black ear; walking at a canter, not flying.
- **Varuna**: the river heaving up in a glowing wave the horses gallop out of (no figure).
- **Baby Jamadagni**: swaddled in a cradle, a tiny tilak, the gold glow; new prop in the scene's `_props.js`.
- **Parshurama** (shared `parshurama()`, `flip: 1` so the axe is in his right hand): standing, the axe raised and
  glowing, wind in his locks, the red aura.
- **Vishvamitra**: `valmiki()` with a dark grey beard and a king's gold armbands kept, in tapas, the gold glow.

## Time constants (video s; shared by `src/scenes/parshu1.js` and `tools/parshu1_sfx.mjs`)
```js
SWAP = 1.2, B0 = 3.6
WALK0 = 3.7, FOLD = 4.7, SLY = 6.6, C0 = 8.6
FINGER = 8.8, BUBBLE = 11.2, RICH = 13.4, D0 = 15.6
LIFT = 15.8, HEAVE = 16.2, HORSE0 = 16.9, GJAW = 19.0, WED = 19.8, E0 = 22.0
BOWLS = 25.0, VIS = 25.6, LABEL = 27.2, BATHE = 29.6, F0 = 30.6
EYE = 30.8, WHISPER = 32.2, NOD = 33.0, SWAP2 = 33.5, EAT = 34.6, DOOR = 36.6, G0 = 37.6
KNOW = 38.0, SCARED = 40.2, H0 = 43.0
PLEA = 43.2, SIGH = 45.4, PALM = 45.8, DRIFT = 46.4, I0 = 49.2
YAWN = 50.6, LAPSE = 52.4, J0 = 54.6
REVEAL = 56.4, K0 = 60.6
VISH = 62.6, L0 = 65.4
ASK = 66.0, CARD = 69.0, END = 73.0
```

## Shots and reads (as built; captions inside y 420–1500, left of x 930; ≥ 2 s each, 3-liners ≥ 3.2 s)
**A 0–3.6 · the hook.** The two bowls on peach, the gold one left, the red right, a slow push. "PARSHURAMA" (gold) /
"WAS BORN A WARRIOR" / "BECAUSE OF A KHEER MIX-UP!" up from frame 0. 1.2 the bowls hop past each other (whoosh,
clink); the red one hisses at 2.4. [gold wipe]

**B 3.6–8.6 · the court.** Gadhi on his throne, Satyavati on the right; Richika walks in from the left and joins his
hands. "SAGE RICHIKA ASKED / TO MARRY PRINCESS SATYAVATI." 6.6 "KING GADHI SMILED…" (smug).

**C 8.6–15.6 · the bride price.** Closer on Gadhi, his hand up, talking: "FINE. BRING ME / 1,000 WHITE HORSES…" 11.2 a
thought bubble (a white horse, one black ear, ×1000): "…EACH WITH ONE BLACK EAR!" 13.4 Richika in his ashram, a calm
smile: "THE KING WAS SURE / HE COULD NEVER DO IT."

**D 15.6–22.0 · Varuna's horses.** The river: Richika raises his arms; the water heaves up in a glowing wave and white
horses gallop out of it toward us, each with one black ear, a long line of tiny ones trotting off along the far bank.
"HE GOT THEM FROM VARUNA, / LORD OF THE WATERS!" 19.0 Gadhi, jaw dropped, "!!". 19.8 the wedding: garlands, petals,
a conch: "WEDDING: DONE!"

**E 22.0–30.6 · two wishes, two bowls.** The ashram: the queen and Satyavati, hands joined, before Richika (hearts):
"BOTH MOTHER AND DAUGHTER / WANTED A SON." 25.0 at the yagna fire, the two bowls; a sage in gold light rises over one,
a warrior with a sword in red over the other: "HE MADE TWO BOWLS / OF SACRED KHEER:" 27.2 "GOLD: A WISE SAGE, FOR HIS
WIFE." / "RED: A WARRIOR, FOR HER MOTHER." 29.6 he gets up with a towel and goes to bathe. [dusk wipe]

**F 30.6–37.6 · the swap.** The ashram kitchen by lamplight, the hearth, a doorway to the dusk. The queen side-eyes the
gold bowl: "HER MOTHER THOUGHT: / "HIS WIFE'S BOWL MUST BE BETTER!"" She whispers; Satyavati nods; tiptoes, the bowls
cross: "SO THEY SWAPPED." Both eat (slurps). 36.6 Richika in the doorway; "!" "!".

**G 37.6–43.0 · busted.** Close on Richika over the two empty bowls; a ring of light: "WHAT HAVE YOU DONE?" 40.2
Satyavati, scared, a red glow pulsing on her: "YOUR SON WILL BE / A FIERCE WARRIOR!"

**H 43.0–49.2 · the plea.** Satyavati, hands joined, tears: "NOT MY SON, PLEASE!" Richika sighs, softens, raises his
palm: "THEN… / YOUR GRANDSON." The red light leaves her and drifts off into the future.

**I 49.2–54.6 · Jamadagni.** A cradle in gold light, the baby yawns and opens his eyes: "HER SON, JAMADAGNI, / WAS BORN
A CALM SAGE." 52.4 a sky time-lapse: "YEARS LATER…" [ember wipe]

**J 54.6–60.6 · Parshurama.** A sunset ridge, wind: a dark silhouette with an axe, "AND HIS SON…"; the swell cuts to
silence; 56.4 the hit: he's lit, the axe raised and glowing in his right hand (flip: 1), the red aura, a shock ring:
"PARSHURAMA" / "A BRAHMIN WITH A WARRIOR'S FIRE."

**K 60.6–65.4 · the twist.** A cradle in gold light on the same ridge, cooler: "AND THE QUEEN'S SON?" 62.6 poof: a sage
in tapas, his crown set down beside him: "VISHVAMITRA: / THE KING WHO BECAME A SAGE."

**L 65.4–69.0 · the ask.** Peach: Parshurama with the red bowl, Vishvamitra with the gold: "ONE BOWL SWAPPED. / TWO
LEGENDS." 66.0 "COMMENT "JAI PARSHURAM"".

**M 69.0–73.0 · the card.** The Books 1–3 card (ad 60's): covers, the RK logo, "Set of 3 for ₹500", rishikatha.com,
"Follow @therishikatha". No fade.

## Sound
Retro cartoon SFX (tools/parshu1_sfx.mjs → assets/parshu1_sfx.wav; assets/parshu1_mix.wav is it at -14.5 LUFS, two-pass loudnorm): the swap whoosh + clink, a court fanfare sting,
Gadhi's sly "hmm" (a low bassoon blip), the river heave, hoof gallops building, a conch at the wedding, the fire
crackle and bubbling kheer, tiptoe pizzicato, slurps, a bell for "he knows", a soft harp for the plea and the cradle,
the time-lapse whoosh, wind on the ridge, a deep taiko hit at PARSHURAMA after a beat of silence, a temple bell on
Vishvamitra. A mild tanpura bed under it all, never loud. Mixed to -14 LUFS.

## Facts used
| Beat | Source |
|---|---|
| Gadhi's daughter Satyavati; the sage Richika (Bhrigu's line) asks for her | Bhagavata 9.15.4–5; MBh 3.115 (Ganguli); MBh 12.49 |
| Gadhi asks a bride price of 1,000 moon-white horses, each with one black ear, meaning to refuse | Bhagavata 9.15.5–6; MBh 3.115; MBh 13.4 |
| Richika gets the horses from Varuna and marries her | Bhagavata 9.15.7; MBh 3.115 (Ashvatirtha) |
| Wife and mother-in-law both want a son; he prepares two oblations (charu), the wife's with a brahmana mantra, the mother's with a kshatriya mantra; he goes to bathe | Bhagavata 9.15.8; Vishnu Purana 4.7; MBh 12.49 |
| The mother, thinking her daughter's must be better, asks for it; Satyavati gives it and eats her mother's | Bhagavata 9.15.9; Vishnu Purana 4.7; MBh 12.49 |
| Richika: her son will be a fierce kshatriya, her brother a knower of Brahman | Bhagavata 9.15.10 |
| She pleads; "then your grandson"; Jamadagni is born | Bhagavata 9.15.11; Vishnu Purana 4.7; MBh 12.49 |
| Jamadagni's son Rama (Parashurama), an avatar of Vishnu | Bhagavata 9.15.12–14 |
| The mother's son is Vishvamitra, a kshatriya who became a brahmarishi | Vishnu Purana 4.7; MBh 12.49; MBh 13.4 |

**Version:** the Bhagavata / Vishnu Purana telling (Richika, two bowls of charu, the mother asks for the swap), also in
MBh 12.49. MBh 3.115 tells it through Bhrigu, with trees to embrace as well as the charu; we don't use that version.
"Kheer" is our word for the charu (rice cooked in milk and ghee as an offering); the captions say "sacred kheer".
Gadhi's queen is unnamed in these sources, so she stays "her mother" / "the queen".

**Gags (claim no plot fact):** Gadhi's crown slipping, the thought bubble of horses, the bathing towel, the tiptoe, the
slurps, the red bowl steaming harder.
