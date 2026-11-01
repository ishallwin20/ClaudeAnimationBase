# Be Like A Tortoise (Fable style: FABLE_GUIDE.md)

**What it is:** an original modern fable on a Bhagavad Gita verse, made as a trial for the kids' storybooks (owner,
1 Nov 2026: "moral stories for kids and adults", a modern topic such as teens on their phones, tied to the Gita). The
Fable look: a black 9:16 frame, a two-line headline with one yellow word, the story in the band from y 600 to 1380, no
words in the story; music + SFX, no voice. 37.5 s: 33 s of story, then the verse and a follow line.

**Headline** (frame 0 to the end): *This Is Why The Gita Says / Be Like A* **Tortoise**: a question the ending answers.

**Logline:** A teenage monkey scrolls on a branch all afternoon and waves his friends away. A buzz knocks the phone out
of his hands onto an old tortoise, who answers every buzz by calmly drawing in her legs, then her head. He tries it and
fails (his own tail sneaks off for the phone), then shuts the phone in a tree hollow under a leaf, looks up, and finds
a sunset and his friends.

**The verse** (Gita 2.58, the tail card): यदा संहरते चायं कूर्मोऽङ्गानीव सर्वशः । इन्द्रियाणीन्द्रियार्थेभ्यस्तस्य प्रज्ञा प्रतिष्ठिता ॥
"As a tortoise draws in its limbs, one who draws the senses in from what pulls at them stands firm in wisdom."

**Motif:** the tucked-in tortoise doodle, three times: her lesson (buzzes bouncing off the shell), his reminder
mid-struggle, and her last bubble with a heart. The likes doodle comes back too: first as the hook, then as the
temptation.

## Cast (src/fable.js, on main)
- **The monkey** (`monkey()`): a chibi teen in a red hoodie, 3/4 view; IK arms and legs, `light` (the phone's blue,
  the sunset's orange), `tailTo` + `tailK` (the tail reaches for something on its own), `hunch`, the tired eyes.
- **The friends:** the same rig, `pal` recoloured (light fur; dark fur in a green hoodie).
- **The old tortoise** (`tortoise()` with `brows`, `tuckLegs`, `tuckHead`, `flip`).
- **The phone** (`fablePhone()`): held, falling, lying flat, buzzing.

## Beats (src/scenes/phone_tl.js is the source of truth; the scene and tools/phone_sfx.mjs read it)
```
A  0–11.5  on the branch (camera in at 1.45, a slow push); late-afternoon light
   0.0       frame 0: hunched over the phone, face lit blue; the headline up
   1.0–2.6   bubble: a phone with hearts (likes); he grins, kicks his feet
   2.75–4.35 bubble: a dancing cat; he laughs
   4.5–6.3   bubble: a show-off in sunglasses with a giant mango; he sulks
   6.35–9.3  two friends swing in on vines; bubble: monkeys swinging (come play!); he raises a hand without
             looking up; they shrug and swing off
   9.6–10.9  tired eyes; buzz, buzz, buzz
   10.9–11.45 a big buzz: the phone jumps out of his hands, he juggles it, loses it
B  11.45–17.5 the ground (the camera follows the fall: whip lines, out to 1.2)
   12.15     BONK on the old tortoise's shell; the phone bounces to the ground
   12.4      she opens one eye
   12.55–13.05 he jumps down
   12.95     buzz: she draws in her legs.   13.5 buzz: she draws in her head. He freezes: ?
   14.0–14.8 the phone buzz-walks into her shell: tok tok tok; nothing; he scratches his head
   14.9      she comes out, looks at him
   15.15–16.95 her bubble: the tortoise tucked in, the buzzes bouncing off (motif 1); !
   17.0–17.5 he nods, sits
C  17.5–27.5 the struggle (the camera in on him)
   17.6      he tucks up like her, eyes squeezed; proud
   18.7–19.3 buzz: one eye pops, his hand shoots out; the other hand slaps it back (she tucks in, calm)
   19.6–21.1 buzz buzz: his TAIL sneaks off for the phone; he catches it, yanks it back, sheepish grin
   21.2–22.8 his bubble: the hearts again (temptation); sweat, twitch
   22.95–24.5 his bubble: the tucked tortoise (motif 2); he calms
   24.5–25.1 a deep breath in, out
   25.1–27.35 he picks the phone up at arm's length, face turned away, walks it to the tree hollow, stuffs it
             in, a leaf over the hole, dusts his hands (the music's hush)
D  27.5–33  the sunset (the camera pulls out to 1.0; the sky blooms orange as he looks up)
   27.5      eyes sparkle; the music swells
   28.6–30.5 the friends swing across the sunset laughing; a vine swings to him; he leaps, catches it, swings off
   31.0–32.6 her bubble: the tucked tortoise with a heart (motif 3); she tucks her head in, content
   31.8      the leaf over the hollow buzzes once; nobody cares
   32.6–33.0 the band fades
E  33.0–37.5 the verse (Devanagari, the English, "Bhagavad Gita 2.58"), "Follow @therishikatha for more stories"
```

## Sound
- **SFX** (`node tools/phone_sfx.mjs` → assets/phone_sfx.wav): thumb swipes, bubble plinks, phone vibrations, a "tonk"
  on the shell, "thwip" as she tucks in, tok-tok-tok, a slap, a tiptoe pizzicato for the tail, a breath, steps,
  the leaf, claps, laughter and whooshes for the swings, chimes on the verse.
- **Score** (Lyria 3 Pro, `tools/phone_score.txt`, 96 BPM, 15 bars; three takes, all long: 56–63 s). Take 2
  (assets/phone_score_2.mp3) cut to picture → assets/phone_score.wav: its groove 0–11.45 (a dead stop as the phone
  flies), silence through the fall, its calm section (take 13.6–31.55) from 15.65, so its hush lands on the leaf and
  its swell on the reveal at 27.5; its own ending (take 50.0–54.6) crossfaded in at 32.6.
- **Mix:** music 0.2 under act A, 0.3 after; SFX on top; loudnorm −15 LUFS → assets/phone_mix.wav.
```sh
S=assets/phone_score_2.mp3; ffmpeg -y -i $S -i $S -i $S -filter_complex "[0]atrim=0:11.45,asetpts=PTS-STARTPTS,afade=t=out:st=11.36:d=0.09[a];[1]atrim=13.6:31.55,asetpts=PTS-STARTPTS,afade=t=in:d=0.5,afade=t=out:st=16.95:d=1.0,adelay=15650|15650[b];[2]atrim=50.0:54.6,asetpts=PTS-STARTPTS,afade=t=in:d=1.0,afade=t=out:st=4.1:d=0.5,adelay=32600|32600[c];[a][b][c]amix=inputs=3:normalize=0,apad,atrim=0:37.5[out]" -map "[out]" -ar 48000 -ac 2 assets/phone_score.wav
ffmpeg -y -i assets/phone_sfx.wav -i assets/phone_score.wav -filter_complex "[1]volume='if(lt(t,11.5),0.2,0.3)':eval=frame[m];[0][m]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11,atrim=0:37.5[o]" -map "[o]" -ar 48000 -ac 2 assets/phone_mix.wav
```

## Facts used
- **Bhagavad Gita 2.58** (Bhishma Parva; Sthitaprajna verses 2.55–72): *yadā saṁharate cāyaṁ kūrmo 'ṅgānīva sarvaśaḥ /
  indriyāṇīndriyārthebhyas tasya prajñā pratiṣṭhitā*: "When one draws the senses back from their objects on every
  side, as a tortoise draws in its limbs, his wisdom is firmly established." The card's English is a plain rendering
  of this (cf. the translations of Edwin Arnold, Swami Gambhirananda, Eknath Easwaran).
- The story is original (a made-up modern premise, like Vahana Union): no character or event in it is claimed from
  scripture. The one teaching it carries is the verse's image, and the card quotes the verse exactly.
