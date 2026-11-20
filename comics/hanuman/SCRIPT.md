# CHIRANJEEVI · Issue 2 · HANUMAN: *He Could Die Any Day He Chose*

Season plan: [CHIRANJEEVI.md](../../CHIRANJEEVI.md). Style: **Inked** ([COMIC_GUIDE.md](../../COMIC_GUIDE.md)). Swipe
pages are 4:5 (1080 × 1350 design units, made at 2160 × 2700). Adult reader: violence is shown when the text describes
it (Simhika, the kinkaras, Aksha, Lanka burning), never added to.

**Sources.** Valmiki Ramayana, **critical edition** (Baroda), Sanskrit from GRETIL, cited as kanda.sarga.verse
(4 Kishkindha, 5 Sundara, 6 Yuddha, 7 Uttara). The critical numbers differ from the vulgate's (valmikiramayan.net) by a
sarga or two in Sundara and Yuddha, and from the IIT Kanpur Uttara text (used by reels 86, 96, 99) by one sarga at
Uttara 39–40: both are given where they differ. Mahabharata, critical edition (BORI, GRETIL) for the coda. Read on
20 Nov 2026. Lines in quotes are close paraphrases of the verse cited; nobody says more than the text gives them.

---

## Why the Ashwatthama preview didn't sell, and what this issue does about it

The funnel (owner, 20 Nov): 140 visitors → 82 swiped past page 1 (59%) → 55 reached the preview's end (67% of them) →
7 tapped buy (13%) → 6 paid. The payment flow is fine (6 of 7). **The problem is the moment the preview ends.**

Ashwatthama's free pages were: the cover · a forest with a prayer quoted · a splash saying "This is how it began" · a
baby is born. Three of four pages were mood; the one story page ends on a happy birth. The reader left the preview
with nothing at stake and no question to answer. (140 is a small sample, but the shape is clear.)

Rules for this issue's preview, which every later issue can follow:
1. **A question on the first story page.** p2 asks something the reader wants answered and cannot guess: *Ram said
   Hanuman was stronger than Ravana. So why did he stand by while his best friend was hunted?*
2. **Every preview page is an event.** No mood pages, no quotes-on-black. Each swipe raises the stakes: a hungry baby
   → the leap → the sun → a demon's head → a god's thunderbolt → the baby falls → the whole universe starts to die.
3. **Stop at the worst moment.** The preview ends with every living thing in three worlds suffocating because a child
   was hit. The reader paid attention for 8 pages and now must know how it resolves (and still has the p2 question
   open). The first paid page delivers immediately.
4. **Sell what's behind the wall.** A lettered "preview end" page for the site (not in the PDF): three locked panels
   from the paid pages (Simhika torn open, Lanka burning, Ram's embrace), "45 more pages", the question again, the buy
   button. Readers buy what they can see.
5. **Bal Hanuman is the hook, adult Hanuman is the payoff.** The beloved child in mortal danger opens; the Lanka
   chapter is the action the 18–34 reader came for.

**Preview length: 8 pages** (cover + 7). A 4-page preview cannot reach a cliff worth paying for (Ashwatthama's
proves it). If the site's preview is fixed at 4, the fallback cut is: cover · p3+p4 merged (the hungry baby leaps) ·
p6+p7 merged (Airavata, the vajra, the fall) · p8 (the wind stops), with the p2 question moved into the cover's
subtitle. **Owner to decide.** Also worth testing on the site: open the reader on p2, not on the cover (the visitor has
already seen the cover on Instagram; 41% never swiped past it).

---

**The idea of the issue.** Ashwatthama lives because he was cursed. Hanuman lives because he asked. On the day he was
born he was hit by Indra's thunderbolt, and his father nearly killed the universe over it; the gods paid him back with
boons, and one of them (Jambavan reminds him, Kishkindha 4.65.27) was that he would die only when he chose. Then rishis
made him forget his own strength. The strongest being in the Ramayana spent years not knowing what he was, until an
old bear reminded him on a beach. And when, after everything, Ram's court handed out gold, he asked for one thing: to
stay alive as long as Ram's story is told. *He could die any day he chose. He chose to listen.*

**Structure.** A frame: Ram's court after the war, where Ram asks Agastya a question in Hanuman's presence (Uttara
7.35.1–14, *hanūmataḥ samakṣam*: "before Hanuman's eyes"). Agastya's answer is the childhood. The Ramayana proper
follows, and the court closes the story with Hanuman's ask. A coda an age later (Bhima) proves he kept his word.

**Tone.** Act 1 is golden and tender, then terrifying. Act 3 is night, fire and blood: Hanuman as a force of nature
("like Death at the end of the worlds", 7.36.43). The last act is quiet.

**Motif.** *The young sun* (bālārka). The newborn is "like the young sun in a body" (7.35.24) and leaps at it. In
Lanka he kills Aksha, a boy "bright as the young sun" (5.45.26), and the text has him not want to. The sun's red disc
appears at each turning point: the leap, Aksha, the mountain carried along the sun's path (6.61.63), and the last page.

**Cast** (to design and test before any page is drawn; the owner asked for the cast to look awesome):
- **Bal Hanuman**, newborn to small boy: golden fur "like the ear of rice" (7.35.21 *śāliśūka*), big amber eyes, a
  curl on the crown, a long tail, small and fierce. New rig for the Inked look.
- **Hanuman**, grown: the vanara rig (`src/cine_vanara.js`) recoloured gold, broader, the kundala and the munja
  thread; a **giant** form (Mahendra, Lanka); an **old** form for the coda (grey muzzle, the same eyes).
- Vayu (Cinematic deva), Anjana, Surya (`src/cine_surya.js`), Rahu (a head with no body), Indra on four-tusked
  Airavata (`src/cine_kumbha.js` has Airavata and Brahma), the eight boon-gods (busts), rishis.
- Ram, Lakshman, Sita (`src/cine_sita.js`), Agastya, Sugriva, Vali, Jambavan (an old bear), Ravana
  (`src/cine_ravana.js`), Vibhishana, Indrajit, Aksha (a young rakshasa prince), kinkaras, Simhika, Bhima (`cine_mbh.js`).

---

## FREE PREVIEW (pp. 1–8)

## p1 · Cover
Bal Hanuman, tiny, at full stretch in the sky, one hand reaching for a sun that fills the top half of the page, red as
a hibiscus. From the top corner a white-violet bolt is already coming for him. The page is the sun's red and the
child's gold.
- Title: **CHIRANJEEVI · 2** (small, top) · **HANUMAN** · *He could die any day he chose.*

## p2 · The question (7.35.1–18; 7.36.38–40)
- P1 (wide, a flashback in cooler colours): Vali, huge, beating Sugriva down on a rocky hill. Behind them, a young
  vanara stands with his fists at his sides and does nothing.
  Box: *After the war, in Ayodhya, Ram asked the sage Agastya a question in front of the whole court.*
- P2 (row: Ram at the right, the balloon left): *"Vali and Ravana had strength no one could match. Neither was equal
  to Hanuman."* (35.2)
- P3 (row: Ram): *"So when Vali hunted his friend Sugriva, why didn't Hanuman burn him like a dry creeper?"* (35.11)
- P4 (row: Hanuman at Ram's feet, head bowed, eyes closed; Agastya's balloon from off panel): *"Because he didn't
  know he could. Listen to what he did as a child."* (Ram himself guesses it at 35.12; Agastya: the rishis' curse,
  35.16; "listen", 35.18)

## p3 · Hungry (7.35.19–23)
- P1: Dawn on Mount Meru's forest. Anjana walks into the deep woods with a basket to gather fruit. Box: *His mother
  Anjana left him for a moment, to gather fruit.* (35.21)
- P2: The newborn alone on a rock, golden as ripe rice, crying hard, tiny fists up. Box: *He was a newborn. He was
  hungry.* (35.21–22)
- P3: Over the hills, the rising sun, red as a hibiscus. No text. (35.23 *japāpuṣpa*)
- P4: Close: his wet eyes go wide, the red disc in each. Thought balloon: *Fruit.* (35.23 *phalalobhāt*)

## p4 · The leap (7.35.23–29) · splash
- Splash: the newborn launched into the sky, the forest dropping away below, a trail of torn leaves. Huge empty sky,
  the sun ahead. SFX: **WHOOOSH**
- Box: *He jumped at the sun.*
- Box (lower): *Gods, demons and siddhas watched him go. "Not the Wind, not Garuda, not even the mind moves like
  this. If this is the baby, what will he be when he's grown?"* (35.25–27)
- Inset (bottom right): Vayu, a vast blue-white figure of air, flying beside his son, breathing cold snow over him.
  Box: *His father, the Wind, flew behind him, cold as snow, so the sun would not burn him.* (35.28)

## p5 · The sun · Rahu (7.35.30–42)
- P1 (wide): the sun's fire filling the panel, Surya's face in the flames looking down at the small gold shape coming
  at him. Box: *The Sun did not burn him. "He's a child. He doesn't know what he's doing. And great work waits for
  him."* (35.30)
- P2: Out of the dark beside the sun: a colossal head with no body, teeth bared, coming to swallow the sun. Box: *It
  was an eclipse day. Rahu had come to eat the sun.* (35.31)
- P3: The baby turns from the sun and lunges at Rahu instead; the giant head recoils. Box: *The baby grabbed for him
  instead.* (35.32, 40)
- P4: Rahu fleeing across the sky, screaming. Balloon (Rahu): **"INDRA! INDRA!"** (35.42)

## p6 · A bigger fruit (7.35.33–46)
- P1: Indra rides out on Airavata, the white four-tusked elephant, gold bells ringing, Rahu flying ahead of him.
  Box: *Indra, king of the gods, came on his elephant.* (35.36–38) Balloon (Indra): *"Don't be afraid. I'll kill
  it."* (35.43)
- P2: The baby sees Airavata: bigger, whiter, rounder than the sun. Thought: *Bigger fruit.* (35.44)
- P3: He charges. For a moment his small body blazes like fire. Box: *For a moment he looked terrible, blazing like
  Indra and Agni together.* (35.45)
- P4: Indra's hand opens; the vajra leaves it. Box: *Indra wasn't even very angry.* (35.46 *nātikruddhaḥ*)

## p7 · The vajra (7.35.46–47) · splash
- Splash, top two thirds: the thunderbolt strikes the tiny body: a white-violet star, the child's silhouette black
  inside it. SFX: **KRA-KOOM**
- Bottom third: he falls onto a mountain. A small golden body on black rock, still. Blood at the corner of the mouth.
  Box: *He fell onto a mountain. His left jaw broke.* (35.47) Box: *His jaw: in Sanskrit, his hanu.*

## p8 · The wind stops (7.35.48–51) · the preview's last page
- P1: Vayu kneels and lifts the limp child. His face: grief turning to rage. Box: *The Wind was furious with Indra.*
  (35.48)
- P2: Vayu walks into a cave with the child, and the air goes in after him: grass, banners, flames all bending toward
  the cave mouth. Box: *He took his son into a cave. And he took his breath with him: out of every living body in
  the three worlds.* (35.48–49)
- P3 (wide, the last panel of the preview): a rishi at his fire, hands at his throat; a deer on its knees; the fire
  standing dead straight; a god in the clouds clutching his chest. Box: *Gods. Demons. Humans. Everything that
  breathed began to choke.* (35.50–52)

### Site: the preview-end page (lettered, web only)
Three panels from the paid pages, each half-hidden behind a torn edge: Hanuman bursting out of Simhika · Lanka in
flames · Ram rising from his throne to embrace him. Text: *Did the universe survive? Why did the strongest being in
the Ramayana do nothing while his friend was hunted? And what did he ask for, when Ram offered everyone gold?* ·
**45 more pages** · the buy button.

---

## Act 1 · The boy who forgot (pp. 9–16)

## p9 · Hell (7.35.49–51, 53, 62) · splash
The three worlds without air. Bodies stiff as wood; joints cracking; a gandharva frozen mid-fall; the gods' bellies
swollen like the sick; sacrificial fires out, no prayers. A city of people standing still as walls.
- Box: *Their joints cracked. Their bodies went stiff as wood. No offering went up, no prayer.* (35.50–51)
- Box: *The three worlds looked like hell.* (35.51 *nirayastham*)

## p10 · To Brahma (7.35.52–63)
- P1: The gods, swollen-bellied, gasping, with gandharvas, asuras and men behind them, at Brahma's lotus. Balloon
  (the gods): *"You made the Wind lord of our lives. Why has he shut himself up inside us?"* (35.53–55)
- P2 (row: Brahma, four faces): *"Indra struck down his son today. Without the Wind, a body is no different from
  dust."* (35.59–60)
- P3: *"Come. We beg him, or we all die."* (35.63)

## p11 · Alive (7.35.64–7.36.6)
- P1: The cave. Vayu sits with the child in his lap; the child glows like the sun, fire and gold. Brahma and every god
  crowd the mouth of the cave. (35.64–65)
- P2: Vayu, holding the boy, falls at Brahma's feet. (36.1–2)
- P3: Brahma's hand on the small head. The eyes open. Box: *At one touch the child came back, like a crop given
  water.* (36.3–4)
- P4: The wind rushes back out of the cave: grass, cloth, hair all streaming; people gasping, laughing. Box: *Seeing
  his son breathe, the Wind moved through every living thing again.* (36.5–6)

## p12 · The boons, 1 (7.36.7–16)
Grid. Each god a bust with his gift glowing.
- Brahma: *"This child will do work for you all. Give him boons."* (36.9)
- **Indra**, a lotus garland in his hand: *"My vajra broke his jaw: his hanu. He will be called Hanuman. My vajra will
  never kill him."* (36.11–12)
- **Surya**: *"A hundredth of my own light. And when he is old enough, I will teach him everything."* (36.13–14)
- **Varuna**: *"No noose of mine, no water will kill him."* (36.15)
- **Yama**: *"My staff won't touch him. He'll never be ill."* (36.16)

## p13 · The boons, 2 (7.36.17–25)
- **Kubera**: *"My mace won't kill him."* (36.17) · **Shiva**: *"Neither I nor my weapons."* (36.18) · **Brahma**:
  *"No weapon of mine."* (36.19) · **Vishvakarma**: *"Nothing I ever forged."* (36.20–21)
- Bottom (row: Brahma to Vayu, the boy on Vayu's shoulder grinning): *"Your son will be a terror to his enemies.
  Unconquerable. He will take any form he wants and go anywhere."* (36.23–25)

## p14 · Trouble (7.36.28–31)
- P1: A forest ashram. The boy, full of new strength, flips a rishi's ladle into the air, sacrificial pots flying.
- P2: He swings on a line of drying bark-cloth until it tears. A rishi's face goes red.
- P3: Kesari, Vayu and Anjana, all three, telling him no. He's already gone.
- Box: *Brahma had made him safe from any rishi's curse. So they put up with him. Again. And again.* (36.30–31)

## p15 · The curse (7.36.32–34)
- P1 (row): The rishis of Bhrigu's and Angiras's lines, hands raised. Box: *Then they lost patience. Only a little.*
  (36.32) Balloon: *"You trouble us because you trust your strength. Then you will not know it. For a long, long
  time."* (36.33)
- P2: Close: the boy's eyes. The gold light in them goes out.
- P3: The boy walking past the same ashram, gently, carrying a pot of water for them. Box: *After that he went
  through the ashrams gently.* (36.34)

## p16 · The answer (7.36.38–43)
- P1: The flashback from p2 again, now understood: Vali beating Sugriva; the young Hanuman standing still, fists
  clenched, and nothing coming. Box: *So when Vali drove out Sugriva, his closest friend, Hanuman stood there. He
  didn't know what he was.* (36.38–40)
- P2 (the court; row: Agastya): *"Who in the world is his equal? Who could stand in front of him? He is the ocean when
  it wants to drown the worlds, the fire when it wants to burn them, Death at the end of everything."* (36.41–43)
- P3: Hanuman at Ram's feet, eyes still lowered. Box: *But one day, someone reminded him.*

## Act 2 · Remember (pp. 17–21)

## p17 · The shore (4.64)
- P1 (wide): The southern ocean at dusk, endless. A vast army of vanaras on the beach.
  Box: *Years later. Sita had been taken across this sea. A hundred yojanas of water to Lanka.*
- P2: Vanaras one after another: *"Ten yojanas."* *"Twenty."* *"Thirty."* *"Fifty."* (4.64.3–6) Faces falling.
- P3: Far from them, alone on a rock, Hanuman sits silent.

## p18 · Jambavan (4.65.1–28)
- P1 (row: Jambavan, an old bear, grey, leaning on a staff): *"Why do you sit alone and silent, Hanuman? You're
  greater than every living thing. Why don't you know who you are?"* (65.2, 7)
- P2: *"As a baby you leapt at the rising sun. Indra's vajra broke your jaw on a mountain peak. That's why you're
  called Hanuman."* (65.19–22)
- P3: *"When Indra saw you healed, he gave you a boon: you will die only when you choose."* (65.26–27
  *svacchandataś ca maraṇam*) Close on Hanuman's eyes, lifting.
- P4: *"You are the Wind's own son. In leaping, you are his equal."* (65.28)

## p19 · Rise (4.65.32–36)
- P1 (row: Jambavan): *"I'm old now. My strength is gone. Yours is the time."* (65.32)
- P2: *"Get up. Cross the ocean. The whole army wants to see what you are."* (65.33–34)
- P3: Hanuman rising to his feet, the vanaras turning toward him.

## p20 · He grows (4.66.1–7) · splash
Hanuman swelling to the size of a hill, tail lashing, yawning like a lion in a mountain cave, his face blazing "like
a smokeless fire". The vanaras tiny around his feet.
- Box: *As they praised him, he grew. He yawned like a lion waking in its cave.* (66.1–3)
- Balloon: *"I am the Wind's own son. No one alive can leap like me."* (66.7)

## p21 · Mahendra (5.1.10–21) · splash
He crouches on Mount Mahendra and pushes. The mountain shudders: water bursts out of the rock, every tree drops its
flowers, cliffs split, snakes come out and bite the rocks until the rocks catch fire, sky-dwellers flee the peak.
- Box: *He gripped the mountain with his hands and feet. It bled water like an elephant in rut. Snakes bit the rocks,
  and the rocks burst into flame.* (1.10–18)

## Act 3 · Lanka (pp. 22–40)

## p22 · The leap (5.1) · splash
The full page: Hanuman stretched across the sky over the ocean, the sea pulled up in his wake.
- Box: *A hundred yojanas of sea.*

## p23 · Simhika (5.1.166–174)
- P1: Something huge rising out of the water below. Box: *In the sea lived Simhika, a rakshasi who caught things by
  their shadow.* (1.166, 171)
- P2: His shadow on the water seized; Hanuman jerked to a stop in mid-air like a ship in a headwind. (1.168–169)
- P3: He grows. Her mouth opens, wide as the sky, deep as the underworld. (1.172–173)

## p24 · Inside (5.1.175–179) · splash
- P1: He shrinks to nothing and dives into her mouth. Box: *The siddhas watched him vanish into her, like the moon
  swallowed by Rahu.* (1.175–176)
- P2 (splash): he bursts out of her body, nails red, her vitals torn out. SFX: **SHRRAKK**
  Box: *With his nails he tore out her vitals, and flew out.* (1.177)
- P3: She sinks dead. Voices from the sky: *"A terrible thing, and well done."* (1.178–179)

## p25 · The golden city (5.2–5.10)
- P1 (wide): Lanka at night on its mountain, gold walls, a hundred thousand guards. (5.3.34)
- P2: Hanuman, small now, slipping across moonlit roofs, peering into palaces, sleeping women, Ravana's halls.
- P3: Hanuman sitting on a wall at dawn, nowhere left to look. Box: *He looked everywhere. She wasn't anywhere.*
  Thought: *"Not giving up is the root of every good thing."* (5.10.10 *anirvedaḥ śriyo mūlam*)

## p26 · Two months (5.13–5.20)
- P1: The Ashoka grove. Sita under a shimshapa tree, thin, in one soiled garment, rakshasis around her.
- P2 (row: Ravana, ten crowned heads, looming over her): *"Two months. If you don't come to my bed by then, my cooks
  will cut you up in the kitchen for my breakfast."* (5.20.8–9)
- P3: In the leaves above: Hanuman's eyes. His fist closes on a branch until the bark splits.

## p27 · The ring (5.33–5.36)
- P1: Hanuman drops softly to her; she recoils. He holds out Ram's ring.
- P2: Sita pressing the ring to her face. (5.34)
- P3: She gives him her hair jewel for Ram. (5.36) [verse numbers for the ring and the jewel to be read at art time]

## p28 · A message for Ravana (5.39–5.40)
Hanuman tearing the grove apart: trees uprooted, pavilions smashed, ponds churned. One tree untouched: hers.
- Thought: *"I found her. Now let them see what Ram's messenger is."*
  [verse numbers for 5.39–40's reasoning to be read at art time]

## p29 · Eighty thousand (5.40.23–29; 5.41.5–9) · splash
At the grove gate, Hanuman, as big as a hill, lashes his tail on the ground; eighty thousand kinkaras with hammers and
maces pour toward him "like moths into a fire". He roars.
- Box: *Ravana sent the kinkaras: eighty thousand, huge-bellied, huge-fanged.* (40.24–26)
- Balloon (huge): **"VICTORY TO RAM! I AM HANUMAN, SERVANT OF RAM! A THOUSAND RAVANAS COULD NOT STAND AGAINST
  ME!"** (41.6–8)

## p30 · The iron bar (5.40.31–34)
- P1: He tears the iron beam out of the gate.
- P2: The beam swinging through bodies; rakshasas broken and flying. SFX **KRUNCH**
- P3: The gate, Hanuman sitting on it, the ground covered in dead. Box: *He killed them all, then sat back down on the
  gate, waiting for more.* (40.34)

## p31 · More (5.40.36 – 5.44)
Three panels, faster each time: Jambumali, Prahasta's son, with his bow · the ministers' seven sons in their
chariots · five generals with their armies. Each ends under the same gate. [verse numbers to be read at art time]

## p32 · Aksha (5.45.1–25)
- P1 (row: Ravana on his throne, turning his eyes on his young son): Box: *Then Ravana looked at his son Aksha.*
  (45.1)
- P2: Aksha: young, beautiful, a gold-painted bow, a chariot of eight horses, rising like a fire fed with ghee.
  (45.2, 31)
- P3: Aksha's arrows punch into Hanuman's chest. Hanuman roars. (45.25)

## p33 · The young sun (5.45.26–29)
- P1 (row: Hanuman, blood on his chest, looking at the boy with something like admiration): Thought: *"He's just a
  boy, bright as the young sun, and he fights like a man. I don't want to kill him."* (45.26)
- P2: Thought: *"But a fire that keeps growing can't be ignored."* (45.29)
- Inset (small, gold, the only warm panel): the newborn from p4, leaping at the young sun.

## p34 · Whirled (5.45.31–39) · splash
- P1: With his palms Hanuman kills the eight horses; the chariot crashes. Aksha leaps into the air with his sword.
  (45.31–33)
- P2 (splash): Hanuman catches him by both feet in mid-air and whirls him round and round, a blur, "as Garuda whirls
  a great snake". (45.34–35)
- P3: The body on the ground: arms, thighs, waist and head broken, blood running, bones and eyes crushed. (45.36)
  Box: *The gods and the great rishis stared.* (45.38) Box: *He went back to the gate, like Death at the end of the
  world, and waited.* (45.39)

## p35 · Bound (5.46)
- P1: Indrajit in his chariot, drawing the Brahma weapon. P2: Hanuman wrapped in its coils, falling. P3: his eyes,
  calm: he lets it hold him, to meet Ravana. [verse numbers to be read at art time]

## p36 · Ravana's court (5.47–5.51)
- P1 (wide): Ravana on a crystal throne blazing with gems; Hanuman bound before him.
- P2 (row: Hanuman): *"Give Sita back."* [the speech, 5.49, to be read at art time]
- P3 (row: Ravana): *"Kill him."* P4 (row: Vibhishana): *"A messenger is never killed."* P5 (row: Ravana): *"Then
  burn his tail."* (5.50–51)

## p37 · Be cool (5.51)
- P1: Oiled rags wound round his tail; torches; the crowd jeering as he's dragged through the streets. (5.51)
- P2: In the grove, Sita hears and prays to the fire. Balloon: *"If I have been faithful to one husband, be cool for
  Hanuman."* (5.51.24)
- P3: The tail in full flame. Hanuman's face: surprised. It doesn't burn. [verse to be read]

## p38–39 · Lanka burns (5.51–5.52) · two splash pages
- p38: Hanuman bursts his ropes and runs roof to roof, his tail a torch. Palaces of gold catch.
  Box: *Mansions of gold and pearl came crashing down, like the palaces of the blessed falling out of heaven when
  their merit runs out.* (52.10–11)
- p39: The whole city on fire from above; rivers of melted gold, silver and gems running out of the houses; rakshasas
  burning in the streets. Box: *Fire is never full of wood. Hanuman was never full of killing.* (52.12–13)

## p40 · Sita (5.53.1–7)
- P1: Hanuman on the shore, his tail out in the sea, Lanka burning behind him. Box: *Then he looked at what he'd
  done.* (53.1)
- P2 (row, his face in horror): *"If Lanka burned, Sita burned. I've killed the one I came to save."* (53.4–7)
- P3: Thought: *"Blessed are those who put out their anger with wisdom, as water puts out fire."* (53.3)
- P4: He flies back over the smoke to the grove: Sita, alive, under her tree. [the end of sarga 53, to be read]

## Act 4 · The war (pp. 41–42)

## p41 · The mountain (6.61) · splash
Night battlefield, the army dying below; Hanuman crossing the sky holding a whole mountain peak "bright as the sun",
along the sun's own path. (6.61.33, 63)
- Box: *In the war, when Ram's army lay dying, he brought back a mountain.*

## p42 · Victory (Yuddha, brief)
Three panels: Ravana falls · Sita and Ram · Ram crowned, Hanuman at his feet. One box: *Ravana fell. Ram was crowned.
And everyone who had fought for him came to Ayodhya.* [Yuddha verses to be listed at art time]

## Act 5 · The choice (pp. 43–46)

## p43 · Gifts (7.39.11–16; IITK 7.40)
- P1 (wide): The court. Sugriva, Vibhishana, the vanaras and bears receiving gold and jewels, taking leave.
- P2 (row: Hanuman bowing, hands joined): *"My love for you will never move. My devotion goes nowhere else."* (39.15)
- P3 (row): *"As long as I can hear Ram's story on this earth, let my life stay in my body."* (39.16)

## p44 · The embrace (7.39.17–21) · splash
Ram rises from the throne and holds him.
- Balloon (Ram): *"So it will be. As long as the worlds stand, my story will stand. And as long as it is told, your
  life stays in your body."* (39.18–19)
- Box: *He took the necklace from his own neck, bright as the moon, and put it on Hanuman. Hanuman looked like a
  golden mountain with the moon on its peak.* (39.20–21)

## p45 · The choice
- P1: Small, cool colours: Ashwatthama from Issue 1, the wound on his forehead. Box: *Ashwatthama cannot die. It is
  a curse.*
- P2: Jambavan's line again: *"You will die only when you choose."* (4.65.27)
- P3 (wide): Hanuman, alone on the palace steps at night, the necklace catching the moon. Box: *Hanuman could die any
  day he chose. He chose to stay and listen.*

## p46 · Ram leaves (7.98.24–7.100)
- P1 (row: Ram, at the end of his reign): *"You set your mind on living. Don't break your promise. As long as my
  stories go through the world, keep your life."* (98.24–25; IITK 108.33–36)
- P2 (wide): Ram walking into the Sarayu with all who followed him; on the bank, from behind, one figure who stays.
  [the departure, 7.99–100, to be read at art time]

## Coda · An age later (pp. 47–50)

## p47 · The path (Mahabharata 3.146)
- P1: Gandhamadana. Bhima smashing through a grove of golden plantains. (146.42, 70)
- P2: An old monkey asleep across the path on a broad stone, his tail across the way. He yawns and opens his eyes a
  little. (146.59–64, 73)
- Box: *An age later. Another son of the Wind.*

## p48 · The tail (3.146–147)
- P1: Bhima takes the tail in one hand, carelessly. P2: Both hands; sweat, eyes rolling. It does not move.
  [verses as read for ad 57 and ad 99: 3.147.15–18 to be confirmed in the critical text]
- P3 (row: Bhima, bowing): *"Who are you?"* · (row: the old monkey): *"I am Hanuman."*

## p49 · Still listening (3.147.37–39)
- P1 (row: old Hanuman): *"When Ram was crowned, I asked him: as long as Ram's story is told in the worlds, let me
  live. He said: so be it."* (147.37)
- P2 (wide): Hanuman with his eyes closed in the plantain grove, gandharvas and apsaras singing around him.
  Box: *"Here, they sing his deeds to me."* (147.39)

## p50 · Last page
One panel: the same old eyes, closed, smiling, the young sun rising red behind the Himalaya.
- Box: *He asked to live as long as Ram's story is told.*
- Box (lower): *You just read fifty pages of it.*

## p51 · Facts used
Every verse above, page by page.

## p52 · What the texts don't say
- He **swallowed** the sun: the Hanuman Chalisa (*leelyo tahi madhur phal janu*); in Valmiki he leaps to seize it.
- The sun looked like a **mango**: popular retellings; Valmiki compares it to a hibiscus (japa) flower.
- "You'll remember your strength **when someone reminds you**": the popular form of the curse; the critical text
  says only "for a long time" (7.36.33), and Jambavan's reminder is how the Kishkindha Kanda shows it end.
- Hanuman made a **throne of his tail** in Ravana's court; the tail **grew** as they ran out of cloth: later tellings.
- Hanuman is **present wherever the Ramayana is recited**: an old prayer (*yatra yatra raghunātha-kīrtanam*), not
  traced to a source text.

## p53 · Next
Issue 3: **BALI**, *the king who gave away everything.* · Issue 1, **Ashwatthama**, is out now. · Follow @therishikatha.

---

## Facts used (verse by verse, critical edition)

**Uttara Kanda (7)**
- 35.1–14: Ram asks Agastya, in Hanuman's presence, why Hanuman, stronger than Vali and Ravana, did not destroy Vali
  for Sugriva; 35.12, Ram's own guess: he did not know his strength. 35.15–18: Agastya: true; a curse from rishis; he
  will tell the boyhood.
- 35.19–20: Mount Sumeru, ruled by Kesari; Anjana his wife; Vayu fathered the son. 35.21: golden as rice ears; Anjana
  went into the forest for fruit. 35.22: hungry, missing his mother, he cried. 35.23: the rising sun, red as japa
  flowers; out of greed for fruit he leapt. 35.24: the child like the young sun in a body. 35.25–27: gods, demons,
  siddhas amazed: not the Wind, Garuda or the mind so fast; what when he's grown? 35.28: Vayu followed, cold as snow,
  guarding him from the sun's heat. 35.29: many thousands of yojanas. 35.30: the Sun did not burn him (a child,
  knowing no wrong; a task depends on him).
- 35.31–35: the same day Rahu came for the sun; touched by the child, he fled to Indra, frowning: "you gave me sun and
  moon to eat; someone else has it". 35.36–38: Indra rose with his gold garland, mounted four-tusked Airavata, Rahu
  ahead. 35.39–42: the child left the sun for Rahu; Rahu, only a face, turned and fled crying "Indra! Indra!".
  35.43: "don't fear, I'll kill him". 35.44: he saw Airavata, "a big fruit", and ran at it. 35.45: his form blazing
  like Indra and Agni. 35.46: Indra, not very angry, struck him with the vajra. 35.47: he fell on a mountain; his left
  jaw broke.
- 35.48–49: Vayu, angry at Indra, stopped himself within all beings. 35.50: beings breathless, joints breaking, like
  wood. 35.51: no svadha, no vashat, no rites: the three worlds like hell. 35.52–56: all ran to Brahma; the gods with
  swollen bellies: "why has the lord of our life shut himself up in us?" 35.59–62: Brahma: Indra struck his son; the
  body without wind is like dust; today they stand like wood and walls. 35.63: "let us go to him". 35.64–65: to the
  cave; the son in Vayu's lap, bright as sun, fire and gold.
- 36.1–2: Vayu, with the child, falls at Brahma's feet. 36.3–4: Brahma raised him, stroked the child; he lived again
  like a crop given water. 36.5–6: the Wind moved in all beings again; they rejoiced. 36.9: "this child will do your
  work: give him boons". 36.10–21: the eight boons (as told in ad 86): Indra (the name, 36.11; the vajra, 36.12),
  Surya, Varuna, Yama, Kubera, Shiva, Brahma, Vishvakarma. 36.23–25: Brahma to Vayu: terror to enemies, unconquerable,
  any form, anywhere.
- 36.28–31: he troubled the ashrams; safe from rishis' curses by Brahma's boon (36.30), they bore it; forbidden by
  Kesari, Vayu and Anjana, he crossed every line. 36.32–33: the Bhrigu and Angiras rishis, not too angry: "the
  strength you trouble us with, deluded by our curse, you will not know for a long time". 36.34: he went gently.
- 36.38–40: his friendship with Sugriva; under the curse he did not know his strength when Vali and Sugriva fell out,
  even while Vali hounded Sugriva. 36.41: who is greater than Hanuman? 36.43: who would stand before him, like the
  ocean about to flood, fire about to burn the worlds, Death at the end of the worlds?
- 39.14–16 (IITK 40.14–16): Hanuman bowed: "my love for you is lasting, my devotion fixed, my heart goes nowhere else;
  as long as I hear Ram's story on earth, so long may my life stay in my body". 39.17–19: Ram rose from his seat,
  embraced him: "so it will be; as long as the worlds stand my story will stand; as long as it goes about the worlds,
  your life stays in your body". 39.20–21: the moon-bright necklace with a vaidurya from his own neck; Hanuman like
  the king of golden mountains with the moon on its peak.
- 98.24–25 (IITK 108.33–36): "you have set your mind on living; do not break your promise; as long as my stories go
  about the world, keep your life and keep your promise".

**Kishkindha Kanda (4)**
- 64.3–6: the vanaras' leaps: ten, twenty, thirty, forty, fifty yojanas.
- 65.1–2: Jambavan to Hanuman, sitting alone: "why are you silent?" 65.7: "you are superior among all beings: why
  don't you know yourself?" 65.19–22: the leap at the rising sun, the vajra, the left jaw broken on a peak, hence the
  name. 65.23–25: Vayu stopped blowing; Brahma's boon. 65.26: Indra, seeing him healed (virujam) from the vajra.
  **65.27: Indra's boon, "may your death be by your own will" (svacchandataś ca maraṇam).** (Jambavan calls Indra
  angry, 65.21; the Uttara says "not very angry", 7.35.46: the childhood pages follow the Uttara.) 65.28: Vayu's son, his
  equal in leaping. 65.32: "I'm old, my strength is gone". 65.33–35: "show your strength; rise, cross the ocean".
- 66.1–4: he grew; yawned like a lion in a mountain cave; his face like a smokeless fire. 66.7: "no one equals me in
  leaping".

**Sundara Kanda (5)**
- 1.10–21: Mahendra pressed: flowers shed, water streams, rocks split, snakes bite the rocks which blaze, vidyadharas
  flee. 1.166–179: Simhika: catches his shadow (168), he is dragged like a ship in a headwind (169), he grows (172),
  her mouth like the underworld and the sky (173), he shrinks and falls in (175), "like the full moon swallowed by
  Rahu" (176), with sharp nails he tears out her vitals and flies out (177), the sky-beings: "a terrible deed" (179).
- 3.34: a hundred thousand guards. 10.10: *anirvedaḥ śriyo mūlam*. 20.8–9: Ravana: two months; then the cooks will cut
  her up in the kitchen for his breakfast.
- 40.23–34: eighty thousand kinkaras with hammers and maces; huge bellies and fangs (25); "like moths into a fire"
  (26); he lashes his tail and roars (28); the iron beam of the gate (31–32); kills them all, back on the gate (34).
- 41.5–9: the war cry: "victory to Ram, mighty Lakshman, King Sugriva; I am the servant of Ram, Hanuman, son of the
  Wind; a thousand Ravanas could not match me".
- 45.1–2: Ravana looks to Aksha; Aksha rises like fire fed with ghee, a gold-painted bow. 45.25: arrows pierce
  Hanuman's chest. 45.26: "not like a boy, bright as the young sun, he does great deeds; I have no wish to kill him".
  45.29: "ignored, he will overpower me; a growing fire cannot be ignored". 45.31–32: his palms kill the eight horses;
  the chariot falls. 45.33: Aksha leaps into the sky with bow and sword. 45.34–35: Hanuman seizes his feet, whirls him
  a thousand times like Garuda a great snake, hurls him down. 45.36: arms, thighs, hips, head broken, blood flowing,
  bones and eyes crushed. 45.38: rishis, gods and Indra astonished. 45.39: back to the gate, like Time at the
  destruction of creatures.
- 51.24–27: Sita: "if I have been faithful to one husband… be cool for Hanuman".
- 52.10–13: gold, pearl and gem palaces fall like the mansions of siddhas from the sky when merit is spent; streams of
  molten diamond, coral, beryl, pearl and silver; as fire is never sated with wood and grass, Hanuman with killing
  rakshasa lords.
- 53.1–7: seeing the burning city, fear and self-disgust; "blessed are those who check rising anger by wisdom, as
  fire by water" (53.3); "if Lanka is burnt, Sita is burnt; I have ruined my master's work".

**Yuddha Kanda (6)**: 61.33: *mṛtasaṃjīvanī* and *viśalyakaraṇī*; 61.63: he carried the sun-bright peak along the
sun's path.

**Mahabharata, Vana Parva (3), critical edition**: 146.42, 59–64, 70, 73 (the plantain grove, the sleeping monkey);
147.37: "when Ram was established I asked him: as long as Ram's story lasts in the worlds, may I live; so be it, he
said"; 147.39: apsaras and gandharvas sing his deeds to him here. (147.37f*, Sita's grace bringing him heavenly food,
is starred in the critical edition: left out.)

**Read for the Lanka pages and the ending (20 Nov 2026)**: 5.34.2–4 (the ring; "as if her husband had come"; her face
like the moon freed from Rahu), 5.36.52 (the jewel), 5.39.1–4 (he decides on force), 5.40.19 (the shimshapa spared),
5.42 (Jambumali), 5.43 (the ministers' sons), 5.44 (five generals), 5.46.37–45 (he lets the Brahma weapon hold him, to
meet Ravana; bound with hemp and bark), 5.47.9 (the crystal throne), 5.50.6–11 (Vibhishana: a messenger is not
killed), 5.51.3–7 (monkeys prize their tails; old cotton cloths; he grew as they wound), 5.51.29–30 (the fire burns
but feels cold as frost), 5.53.20–28 and 5.54.1 (Sita unharmed; "by good fortune I see you unharmed"), 7.100.5 (Ram
steps into the Sarayu), MBh 3.147.17–20 (Bhima: the left hand, smiling, then both arms; brows raised, eyes rolling,
sweat; he cannot lift it).
