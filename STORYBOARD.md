# "What you POUR on SHIVA decides what you GET" (ad 69 · Books 1–3 · 3D)

A 68.4 s reel in the **3D** style, #3 of the five-reel push (31 Oct–1 Nov 2026), in the shape of ads 50/54: a ritual
almost every Hindu does (abhishek on a linga), a "have I been doing it wrong?" sting by 3 s ("Not a SPLASH"), a number
per liquid with its verse on screen, the screenshot board, an ask, next: the Diwali aarti-along (#4). English VO (Sarvam
`girish_en_devotional`, pace 1.2), karaoke captions, SFX under it (music added on Instagram). One set: a black stone
linga in a lamp-lit sanctum, each liquid poured from a lota as a stream in a true arc that runs down the stone in
rivulets, pools in the pitha and drips from the somasutra spout. Matte (owner, 30 Oct: ad 64's Pushpak too shiny):
basalt roughness .52 with little environment, brass metalness .45 / roughness .56 / env .4, no fx bloom, cine.js bloom
.12; the lens is only depth of field and a gentle grade. Card: Navadurga Set, no price (owner, 31 Oct).

## Facts used
All from the Shiva Purana, Rudra Samhita, Srishti Khanda, chapter 14 (Dhara puja), J. L. Shastri's translation
([wisdomlib, doc225982](https://www.wisdomlib.org/hinduism/book/the-shiva-purana/d/doc225982.html)). On screen as
"Rudra Samhita 1.14.n", as in ad 66.

| claim in the reel | source |
|---|---|
| Not a splash: a stream that never breaks; on screen "The devotees shall pour water in a continuous stream." | 14.67 (the Dhara puja: "after performing the regular worship of Śiva… the devotees shall pour water in a continuous stream") |
| Water, in a stream: it eases fever | 14.68–70: "This Dhārā worship is very efficacious in delirium due to fever" |
| Ghee: your family flourishes | 14.72: "If Dhārā worship is performed with ghee… the family will undoubtedly flourish" |
| Milk with sugar: a mind as sharp as Brihaspati, the guru of the gods | 14.74–75: "sugar shall be added to milk… His intellect will become as keen as that of Bṛhaspati" |
| Honey: wealth like Kubera | 14.80: "If honey is used, the devotee will become Kubera (God of wealth)" |
| Sugarcane juice: every joy | 14.80: "The Dhārā of sugarcane juice is conducive to all pleasures" |
| One more defeats enemies (named on the board: mustard oil) | 14.78–79: "Oil-Dhārā… for harassing enemies"; "If mustard oil is used, enemies will be exterminated". Not "only against enemies": 14.79 also says scented oil increases worldly pleasures (in the pinned comment) |
| Only one gives the joys of this life AND moksha: Ganga jal | 14.81–82: "The Dhārā of Gaṅgā water yields worldly pleasures and salvation" (the only one in the list that names salvation) |
| With every stream, the Mahamrityunjaya mantra, ten thousand times | 14.81–82: "In all these Dhārās Mṛtyuñjaya mantra shall be muttered ten thousand times" |
| On screen: ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् | the Mahamrityunjaya mantra's first line (Rig Veda 7.59.12) |

Performance only (no claim): the sanctum, lamps and lota; the thrown splash and ✗; the drop row; the dark red light on
"enemies"; the light opening above and Ganga's stream falling from it; the counter to 10,000; the aarti plate (a teaser
for the next reel). "Before Monday": Monday is Shiva's day (a custom, not a claim from this chapter).

## Voiceover (tools/pour_vo.json; captions are the script)
```
hook     What you POUR on SHIVA / decides what you GET.
splash   Not a SPLASH.
stream   The SHIVA PURANA says: a STREAM that never breaks.
water    WATER, in a stream: it eases FEVER.
ghee     GHEE: your FAMILY flourishes.
milk     MILK with SUGAR: a mind as sharp as BRIHASPATI, / the guru of the gods.
honey    HONEY: wealth like KUBERA.
cane     SUGARCANE JUICE: every JOY.
enemy    And one more? It defeats ENEMIES.
only     Only ONE gives you the joys of this life AND MOKSHA:
ganga    GANGA JAL.
mantra   With every stream, the MAHAMRITYUNJAYA mantra. / TEN THOUSAND times.
save     SCREENSHOT THIS before Monday.
ask      Which one will YOU pour? Comment!
next     NEXT: do your DIWALI AARTI WITH this reel. / FOLLOW so you don't miss it.
```
Speech-to-text (saaras:v3) on every take, word for word after two fixes: "this life's joys" was heard as "this life's
choice" (now "the joys of this life"), and "one is poured" merged into "one is sport" in every phrasing tried (now
"And one more? It defeats enemies.").

## Shots (times from the voice: src/scenes/pour_tl.js)
| | time | shot |
|---|---|---|
| A | 0–3.7 | frame 0: milk pouring from the lota, running down the black linga in rivulets; the hook up |
| B | 3.7–4.9 | water thrown from the side: drops splatter, wet blotches, red ✗ on "SPLASH" |
| C | 4.9–9.8 | close on the crown: one clean stream meeting the stone; gold ✓; the verse (14.67) |
| D–H | 9.8–33.3 | one liquid a shot, each its own camera: water (wet black stone), ghee (low, gold), milk (white rivulets), honey (slow amber fingers), sugarcane; the drop row fills; verse tags |
| I | 33.3–38.1 | the lamps die, red rim light, a dark oil pour; the ? drop |
| J | 38.1–41.8 | dim sanctum; a light opens above |
| K | 41.8–44.6 | GANGA JAL: the stream falls from the light; big gold title; tag 14.81–82 |
| L | 44.6–49.9 | orbit; the Mahamrityunjaya in Devanagari; the counter to 10,000 |
| M | 49.9–53.0 | the screenshot board (seven liquids, gifts, verses; mustard oil revealed), a shutter |
| N | 53.0–55.5 | milk from above; the six drops round "which one will YOU pour?" |
| O | 55.5–61.2 | NEXT: DIWALI AARTI; an aarti plate circles the linga; the camera pulls back |
| card | 61.2–68.4 | rkCardCine: MEET OUR GODS, the Navadurga Set is out now, link in bio |

## Files
`src/scenes/pour.js` (shots), `pour_props.js` (the sanctum, lota, the liquids: `tube3` stream, `coat3` film,
`spray3`, `throw3`; the drop row, marks, tags, board), `pour_tl.js`, `pour_vo.js` (from the TTS tool), `pour_cover.js`,
`tools/pour_vo.json`, `tools/pour_sfx.mjs` → `assets/pour_sfx.wav`, `assets/pour_mix.wav`.
`rm -rf out/frames && node render.mjs --frames --workers=2 && node render.mjs --encode --out=out/pour_out/pour.mp4`;
cover: `node render.mjs --page=cover.html --stills=0 --out=out/pour_out` then rename `t0_00.png` to `cover.png`.

## Lessons
- A liquid film as one opaque shell read as paint; a thin skin (`sheet`) plus rivulets that wander down the stone,
  fully wet only at the crown, reads as liquid. A streak texture on the lathe tiled into bricks: noise in the shader instead.
- In 9:16 a pitha is wider than the frame at 2 m: frame from ~2.8 m with the target low (y .6) so the crown sits near
  y 560 and the captions land on the dark pitha.
