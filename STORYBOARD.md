# "Why are Hindu gods BLUE?" (ad 30 · Books 1–3 · 15K Family Deal card · a follower trial)

A 55.2 s Painted explainer with an English voiceover (Sarvam `girish_en_devotional`, the owner's pick), captions in **Bangers** timed to the voice, SFX under it
(music added on Instagram). It's a test of the "Why do Hindus…?" format that thehindu.archive grew on (88.5k followers in
10 days, Oct 2026), made in our style and kept strictly sourced. The goal is reach and follows. The parent line at the
end points it back at families (our book buyers).

## Facts used
| claim in the reel | source |
|---|---|
| "Krishna" literally means *dark* (Sanskrit *kṛṣṇa*: black, dark, dark-blue) | Monier-Williams, *kṛṣṇa* ([kosha](https://kosha.sanskrit.today/word/sa/kRSNa)) |
| He is also called **Ghanshyam**: *ghana* (a dense rain cloud) + *shyam* (dark) | Sanskrit compound; a common name of Krishna |
| Tulsidas: Ram is *nīlāmbuja-śyāmala*, dark like a blue lotus | Ramcharitmanas, Ayodhya Kand, invocation shloka 3 ([bhaktibharat](https://www.bhaktibharat.com/en/mantra/neelambuj-shyamal-komalangam)) |
| The Vishnu shloka: *gagana-sadṛśaṁ megha-varṇaṁ*, vast as the sky, the colour of a cloud | "Shantakaram Bhujagashayanam", the Vishnu dhyana shloka ([shlokam.org](https://shlokam.org/shloka/shanthakaram-bhujagashayanam.htm)) |
| In paintings that dark became blue | the words themselves cover "dark" and "dark blue" (Monier-Williams); the reel says only that paintings show it as blue |
| Shiva is *karpūra-gauraṁ*, white as camphor; it's sung at the end of aarti | "Karpura Gauram Karunavataram" ([shlokam.org](https://shlokam.org/shloka/karpura-gauram.htm)). Its often-claimed Yajurveda source isn't stated in the reel |
| Only his throat is blue: the Halahala, held in his throat, left it blue (Neelkantha) | Bhagavata Purana 8.7.43, *yac cakāra gale nīlaṁ* ([vedabase](https://vedabase.io/en/library/sb/8/7/43/)) |

Left out on purpose: Parvati pressing Shiva's throat (a popular addition, not in Bhagavata 8.7), the "blue = infinite
sky and ocean" symbolism (common, but an interpretation), and the "Raja Ravi Varma made gods blue" claim (not true: blue
Krishna is centuries older).
Performance only (no claim): Krishna comparing his arm to the cloud, Ram holding a lotus to his cheek, the brush painting
blue over a sketch, Shiva's take when he turns white, the child's blue crayon.

## Voiceover (tools/blue_vo.json; captions are the script)
```
hook   Why are so many Hindu gods BLUE?
names  The answer is hiding in their names.
krsna  Krishna literally means "dark".
ghana  That's why he's also called Ghanshyam: dark as a rain cloud.
ram    Tulsidas sings of Ram as dark as a blue lotus.
vish   And the Vishnu shloka you hear at home? "Megha-varnam": the colour of a cloud.
paint  Dark as a monsoon sky. So in paintings, that dark became blue.
twist  But here's the twist. Shiva isn't blue at all.
karp   "Karpur Gauram": white as camphor. You sing it after every aarti.
throat Only his throat is blue: from the poison he held there to save the world.
kid    Your child will ask you this one day. Now you know.
ask    Did you know Shiva was white? Comment YES or NO!
```

```
Logline: Hindu gods aren't sky-blue: their names and shlokas say "dark as a rain cloud", which paintings show as blue,
         and Shiva, the one everyone pictures blue, is white as camphor, with only his throat blue from the poison.
Hook:    Frame 0: Bal Krishna alone on a plain peach ground, frowning at his own blue hands. Caption already up.
World:   peach hook → monsoon (slate clouds, rain, green) → a lotus pond at dusk → the ocean under clouds (Vishnu) →
         the painter's paper → Kailash snow-white (Shiva) → an evening aarti (camphor flame) → home (the kid) → peach.
         Colour arc: blues that keep matching things in nature, then white breaks the pattern.
Motif:   the SWATCH: each god's skin held against the thing named (a cloud, a lotus, the sky); then the paintbrush.
Rhyme:   opens on Krishna puzzled at his blue hands; ends on the child colouring Krishna blue, and white Shiva waving.
```

## Shots (times set by the voice; see src/scenes/blue_tl.js)
```
A  hook+names  peach: Bal Krishna frowns at his hands ("?"). On "names", Ram, Vishnu and Shiva pop in beside him, all
               blue, all looking at their arms.                                   [out: a rain cloud wipes across]
B  krsna+ghana monsoon: a slate cloud drifts over Krishna; he holds his arm up to it: the same colour. Rain; he grins.
                                                                                   [out: whip to the pond]
C  ram         a lotus pond at dusk: Ram picks a blue lotus and holds it to his cheek; it matches.  [out: brush wipe]
D  vish        Vishnu on Shesha on the ocean, cloud banks behind in the same blue.  [out: push into the paper]
E  paint       a pencil sketch of Krishna on paper; a brush sweeps blue wash over him.   [out: brush wipe]
F  twist       Shiva sitting, blue; on "isn't blue" a white wash sweeps down him: a camphor-white Shiva, eyes pop "!".
G  karp        an aarti thali with a camphor flame circles in front of white Shiva.
H  throat      Shiva drinks from a bowl of dark poison; his throat turns blue; serene smile.   [out: brush wipe]
I  kid         Aarav at home colouring a Krishna drawing with a blue crayon; looks up at us.
J  ask         peach: white Shiva and Bal Krishna side by side, waving. 3-line caption, ≥3.2 s.
K  card        the 15K Family Deal card (7.6 s; Books 1–3 ₹500 → ₹350 till 25 Oct, Comment FAMILY), no fade out.
```

Captions are the voice's chunks (tools/blue_vo.json → src/scenes/blue_vo.js); a line with a *starred* word is gold.
Rebuild: `node tools/sarvam_tts.mjs --script=tools/blue_vo.json` (cached takes), `node tools/blue_sfx.mjs` (SFX + the
mix, assets/blue_mix.wav), then render. Things to notice: the cloud matches Krishna's arm, the lotus matches Ram's
cheek, the clouds turn Vishnu's blue on "megha-varnam", the paint stroke goes from slate to blue.

## Deliverables
`out/blue_out/`: `blue.mp4` (voice + SFX), `cover.png`, `captions.txt` (the Instagram caption, the pinned comment at
the bottom).
