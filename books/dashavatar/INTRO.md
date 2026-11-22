# Dashavatar: Introduction (pp. 1–9), first draft

The owner's plot for the opening section (22 Nov 2026), for ages 6–10, in the **Pothi** style with a Pichwai and Tanjore
richness: deep indigo night grounds, gold leaf, gems and pearls, lotus everywhere. Every page has a border of deep
indigo with a gold lotus vine; each avatar chapter will later get its own accent colour (the thin line inside the band).

The cast comes first, so the owner can correct how everyone looks and acts before any page is composed. The review
sheets are in `out/books/dashavatar_out/cast/` (render: `node render.mjs --page=book_dasha.html --sheet=0.5 --cols=1
--w=3000`, slots 0–4):

| sheet | shows | code |
|---|---|---|
| 01 gods standing | Vishnu on a lotus with chakra, shankha, padma and gada; Brahma praying (eyes closed) and bending to bless; Shiva and Indra with hands joined | `src/po_dasha_gods.js`: `pdVishnuStand`, `pdBrahma`, `pdShivaStand`, `pdIndra` |
| 02 | Vishnu asleep on Shesha (the Shantakaram figure in the book's blue) with Brahma on the navel lotus; Lakshmi serving at his feet and seated with a lotus; Brahma seated on his lotus; Bhumi Devi as a cow, sad (head low, a tear) and hopeful | `pdLakshmi`, `pdBhumiCow` in `src/po_dasha_world.js`; `poAnanta*` in `src/po_cast.js` |
| 03 villagers | the dharma-tree scenes: a boy helping an old woman, a farmer sharing grain, a teacher with two students, a boy returning a purse; a worried villager | `pdPerson` (kinds, poses, props) |
| 04 furniture | the border (wilted / in bloom), the ten avatar medallions, Vishnu's four treasures, the verse scroll, the "Dharma wisdom" box, the golden lotus | `src/po_dasha_frame.js` |
| 05 mock-ups | p. 1 (night, the Ocean of Milk, the golden lotus, ten lights, the chakra rising) and p. 8 (Vishnu rising over the clouds, the ten forms faint in an arc) | `src/scenes/dasha_cast.js` |

## The pages (first draft, 22 Nov)

The art is `book_dasha_pages.html` (`src/scenes/dasha_book.js`, one slot per spread), the words are live text in
`books/dashavatar/book.js`, and the review spreads are in `out/books/dashavatar_out/intro/spreads/` (with the print
interior PDF, the reader preview PDF and the EPUB):

```
node tools/book.mjs --book=books/dashavatar --pages=1,2,3,4,5,6,7,8,9,10,11 --render=all --page=book_dasha_pages.html --art=out/book_dashavatar/art_pages --out=out/books/dashavatar_out/intro --jpg
```

In print, a spread is always an even page on the left and an odd page on the right, with p. 1 alone on the right. So
the plot's pp. 7–8 spread would be split by a page turn. To keep it whole, the introduction is 11 pages, not 9:

| pages | what | why it moved |
|---|---|---|
| inside cover, 1 | an indigo endpaper of gold lotus rosettes; the title page | |
| 2–3 | The Silent Ocean, one picture across the spread (the plot's "wide, majestic scene"); the verse on a scroll | was p. 2; the wordiest page, it now has two |
| 4 | The One Who Is Everywhere; the four treasures as medallions round Vishnu, each with its line | was p. 3 |
| 5 | What Is Dharma?; the dharma tree with its four scenes in gold roundels; the verse in the Dharma Wisdom box | was p. 4 |
| 6 | When the World Grew Heavy (border wilted) | was p. 5 |
| 7 | The Ocean of Milk (border half wilted) | was p. 6 |
| 8–9 | The Promise, one picture; the left border wilted, the right in bloom | was pp. 7–8 |
| 10–11 | Ten Times He Came: five medallions and lines a page, on scrolls | was p. 9; ten lines on one page would need tiny type |

The first story then opens on a fresh spread (pp. 12–13), so "Turn the page" still holds. Art choices on these pages:
the gold verse on p. 8 sits on the left page, not across the fold (it would vanish into the binding); Vishnu's face
above the ten medallions is replaced by a small Vishnu on Shesha at the foot of p. 11, the Silent Ocean returning; the
"Karna Parva" verse number is left off the page until it is checked against the Critical Edition.

## The words, with the changes made for accuracy

Most of the text is the owner's as given. Changes:

- **p. 2.** The ocean at the start of creation is not called Kshir Sagar in the Bhagavata. Book 3.8 calls it the
  waters of the dissolution, with Vishnu lying on Shesha and Brahma born from the navel lotus. So p. 2 says "a silent,
  shining ocean", and the name **Kshir Sagar** comes on p. 6, where the Bhagavata uses it (10.1.20). The art looks the
  same on both pages, so p. 9 still comes back to the same ocean. "Sureshām" in the verse is corrected to **sureśam**.
- **p. 4.** The verse's second line is **yat syād dhāraṇa-saṃyuktaṃ** (not "yaḥ … saṃyuktaḥ").
- **pp. 7–8.** In the Bhagavata, the voice Brahma hears promises that the Lord will be born in Vasudeva's house, as
  Krishna (10.1.22–23). So the draft's "ages later, as Krishna" can't stand. The text now says this time he came as
  Krishna, that it was neither the first time nor the last (Gita 4.5: "many births of mine have passed"), and that as
  Krishna he later said the promise aloud to Arjuna.
- **p. 9.** It now opens "This is the promise he keeps, age after age", which follows from the change on pp. 7–8.

**p. 1** DASHAVATAR · The Ten Descents of Lord Vishnu · ॐ नमो भगवते वासुदेवाय · Om Namo Bhagavate Vasudevaya

**p. 2 The Silent Ocean.** Long, long ago, before the first sunrise and before the first star, there was only a silent,
shining ocean. It was not cold or dark. It glowed softly, like moonlight on pearl. On its gentle waves floated the great
serpent Shesha, his thousand hoods spread wide like a canopy. And on his coils, calm as a sleeping lake, rested Lord
Vishnu, the Preserver of the world. Goddess Lakshmi sat beside him, smiling. From Vishnu's navel rose a golden lotus,
and on the lotus sat Brahma, the Creator, ready to begin the work of making the world. Soon there would be mountains
and rivers, forests and animals, and people. And Vishnu, calm and watchful, would hold it all in his care.
*Banner:* शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं … (as given, with सुरेशं; the meaning as given).

**p. 3 The One Who Is Everywhere.** As given.

**p. 4 What Is Dharma?** As given; the verse: धारणाद्धर्ममित्याहुर्धर्मो धारयते प्रजाः । यत्स्याद्धारणसंयुक्तं स धर्म इति
निश्चयः ॥ Dhāraṇād dharmam ity āhur dharmo dhārayate prajāḥ, yat syād dhāraṇa-saṃyuktaṃ sa dharma iti niścayaḥ.

**p. 5 When the World Grew Heavy.** As given.

**p. 6 The Ocean of Milk.** So Brahma, with Bhumi Devi, Lord Shiva and all the gods, travelled far across the sky to
the shore of Kshir Sagar, the Ocean of Milk, where Vishnu rests. There they stood quietly, bowed their heads, and sang an
ancient prayer, the Purusha Sukta … (the rest as given).

**pp. 7–8 The Promise.** "Do not be afraid," said Brahma to the gods and to Bhumi Devi. "The Lord has heard us. He will
come himself, born on Earth in a form this world can touch and see, to take away the weight from her."
And so he did: he was born as Krishna. It was not the first time the Lord had come, and it would not be the last.
As Krishna, he later spoke this promise aloud to a young prince named Arjuna, on a great battlefield, in the sacred
song called the Bhagavad Gita. Here are the words, as they were sung.
*Verse and meaning:* Gita 4.7–8 as given.

**p. 9 Ten Times He Came.** This is the promise he keeps, age after age, each time in the form the world needs most.
(The ten lines as given.) Turn the page, and let the first story begin.

## Facts used

| beat | source |
|---|---|
| Before creation, Vishnu lies on Shesha in the waters; a lotus rises from his navel and Brahma is born on it | Bhagavata 3.8.10–15 |
| Lakshmi beside him; "Lakshmikantam" | iconography (Anantashayana) and the dhyana shloka; the shloka is a later devotional verse, not Purana (noted on the page in the owner's draft) |
| "Vishnu" from *viś*, to enter or pervade: "because all this is pervaded by him" | Vishnu Purana 3.1.45 |
| *Dharma* from *dhṛ*, to hold; "dhāraṇād dharmam ity āhuḥ …" | Mahabharata, Karna Parva 69.58 (vulgate numbering; check the Critical Edition number before print) |
| The Earth, burdened by armies of proud kings who were asuras in disguise, went to Brahma as a cow, in tears | Bhagavata 10.1.17–18 |
| Brahma went with the gods, Shiva (the three-eyed) and the Earth to the shore of the Ocean of Milk | 10.1.19 |
| There he worshipped the Lord with the Purusha Sukta | 10.1.20 |
| In meditation Brahma heard a voice, and told the gods what it said | 10.1.21 |
| The Lord already knew the Earth's distress and would be born in Vasudeva's house; the gods should be born in the Yadu line to help | 10.1.22–23 |
| "Many births of mine have passed, and of yours, Arjuna" | Gita 4.5 |
| "Whenever dharma declines … I come, age after age" | Gita 4.7–8 |
| The ten and their reasons: the flood (Matsya, Bhag. 8.24), Mandara sinking (Kurma, 8.7), the Earth under the waters (Varaha, 3.13), Prahlada (Narasimha, 7.8), Bali (Vamana, 8.18–22), the kings who forgot their duty (Parashurama, 9.15–16), Rama, Krishna, the Buddha's compassion (Jayadeva, Gita Govinda 1.13 "sadaya-hṛdaya"), Kalki on a horse (Bhag. 12.2.19; the horse's whiteness is later tradition) | as listed |

Art choices that claim no plot fact: the golden lotus and the ten lights on the title page, the chakra like a rising
sun, the indigo-and-gold border wilting and blooming, the medallions, everyone's clothes and jewels, Indra among the
gods on p. 6 (the Bhagavata says "the gods"), the dharma tree.
