# 12 JYOTIRLINGAS: a 3D series. "Broken. Rebuilt. Still standing."

Owner, 27 Nov 2026: a series on the 12 Jyotirlingas: (1) their stories, (2) how they look, a good 3D explainer, (3) the
invaders who tried to destroy them (never glorified by naming them), (4) the kings who saved and rebuilt them, (5) unique
FAQs. At least 12 episodes, more than one per Jyotirlinga where needed. "Glorious and viral worthy. Great cinematography.
A blockbuster, slightly controversial, beautiful, and should get us a lot of followers." All 3D explainers. A trailer
first, Episode 1 a few hours later the same day.

## The rule (said in the trailer and in every episode)
**"We will NOT say the names of the men who broke them. We WILL name every king and queen who rebuilt them."**
- On screen and in the VO the destroyers are only a year and a role: "1026 · a raider from the west", "1669 · an
  emperor's order". Their name slot is a **black redaction bar** (the series' signature image). The Instagram caption
  doesn't name them either. The storyboard's "Facts used" names them, because accuracy needs it.
- Raiders are drawn as **faceless shadows**: black silhouettes in smoke and torchlight. No faces, flags, script, dress or
  symbol of any faith, and no mosque on screen. The series is about what happened to the stones and who put them back.
  It makes no claim about any community today.
- The rebuilders get the light: dawn gold, their names in gold, the year and what they did, the stones flying back.
- **Each rebuilder gets real time** (owner, 27 Nov 2026): not just a name and a year, but who they were and the rest of
  their work for people: the ghats, wells, roads, rest houses, free kitchens, schools and other temples they built, how
  they governed, what it cost them. The hero rebuilders get a short portrait of 8–12 s each (an emblem of their seal or
  a silhouette in gold, a map of their other works lighting up, one line about their life). The rest get a quick gold
  roll. Every deed needs a source, like the plot beats.
- This rule is the series' built-in argument ("hiding history!" vs "deny them the fame") and pulls in comments without
  claiming anything false. The pinned comment explains it once: we're not erasing history, we're choosing who to remember.

## Owner decisions (27 Nov 2026)
- **Episode 1's shape is approved** (the outline below).
- **Government stories go in** where they're part of a temple's history: they add controversy and keep people watching.
  Facts and dates only, both sides' documented positions, no verdict; source every line like a plot beat. Candidates
  (verify each): Somnath 1947–51 (Patel's order; Gandhi asking for public, not state, money; Munshi overruled by Nehru
  on government involvement; the President at the 1951 installation, and the Nehru–Prasad letters if the primary text
  holds up); the Somnath Trust and who sits on it; the 2026 "Somnath Swabhiman Parv" (1,000 years since 1026); the
  Kashi Vishwanath Corridor (2021) and what was cleared for it; Mahakal Lok (2022) and its 2023 storm damage; Kedarnath's
  rebuilding after 2013; state control of temple boards and funds (HR&CE-style boards) where a Jyotirlinga is affected.
- **End card:** the series follow card ("Follow @therishikatha for Episode N+1") plus both products, with no price: the
  Navadurga picture-book set and the CHIRANJEEVI comics. "Check the link in bio, or DM us."
- **Kashi Vishwanath (Parts I–II):** review the plan with the owner when we start building it.

## Format (every episode)
3D film look (3D_GUIDE.md: matte stone, low bloom), girish VO, Lyria score under the SFX (owner, 26 Nov), 80–100 s.
"The light" is the longest beat; where a temple has a lot of story too, split the episode (Part I the story and the
look, Part II the dark and the light) rather than shortening the rebuilders.
| beat | time | what |
|---|---|---|
| Hook | 0–3 s | the temple in 3D, the caption up at frame 0; the episode's most shocking true line |
| Ident | 3 s | a pillar of light strikes the India map at the site, "N / 12", the series title |
| The story | ~20 s | the purana's story in 3D (silhouettes, light, sets); corner tag SHIVA PURANA · KOTIRUDRA NN (gold) |
| The look | ~15 s | an orbit and a fly-through of the temple with mono labels (style, height, the sanctum, what's unique) |
| The dark | ~12 s | night falls on the temple, faceless shadows, the stones fly apart; redacted bars with years |
| The light | ~25–30 s | dawn: the stones fly back; 1–2 hero rebuilders get a portrait (the deed here, then their other works for people lighting up on the map, one line on their life), the others a gold roll with year and deed; corner tag HISTORY (teal) |
| FAQ / myth bust | ~10 s | one or two questions nobody answers, each with its source; LOCAL BELIEF (red) where it's only tradition |
| Ask + next | ~6 s | a place call-out or a this-or-that ask, then "Next: N+1 · <name>" |
| Card | ~6 s | series follow card: RK logo, "12 JYOTIRLINGAS", "Episode N+1 next", follow; the Navadurga books and the CHIRANJEEVI comics (covers, no price), "link in bio or DM us"; score up under it |

Shared code, built on Episode 1's branch and merged to main: `src/cine3d_mandir.js`. It has a temple generator made of
instanced stone blocks: stepped-square courses, a curved shikhara with urushringas, a mandapa with a pyramid roof, a
jagati, an amalaka, a kalasha and the flag. Every block can fly apart (`break`) and back (`build`). The generator is
reused, re-proportioned, for each temple (Nagara north, Dravida with a gopuram for Rameswaram and Mallikarjuna,
Hemadpanti black basalt for Grishneshwar and Bhimashankar, Kedarnath's grey stone in snow). It also holds the shadow
raiders, the redaction bar and the gold name plate. The India ident reuses ad 43's map and pillars (`cine3d_india.js`).

## The episodes (Shiva Purana order, Kotirudra Samhita 1, as ad 43)
"Verify" marks a fact to confirm in that episode's research before it goes on screen (the retelling rules apply).
| # | Jyotirlinga | story (source) | the dark (years only on screen) | the light | FAQ / controversy lever |
|---|---|---|---|---|---|
| 0 | **Trailer** (ad 119, today) | the endless pillar of light (Vidyeshvara 6–8) | "They tried to ERASE these temples. Again and again." | Kumarapala, Ahilyabai Holkar, Ranoji Shinde, Maharaja Ranjit Singh, Sardar Patel | "We won't say their names"; three FAQ teasers |
| 1 | **Somnath I** (ad 120, today) | Daksha curses the Moon to waste away; Chandra's tapas at Prabhasa; Shiva lets him wax and wane (Kotirudra 14) | 1026, 1299, 1395, 1451, 1706 (Wikipedia: Somnath temple) | Mularaja (before 997), Kumarapala (1169 inscription), Mahipala (1308), Ahilyabai (1783, a separate temple), Patel's vow (12 Nov 1947), the installation on 11 May 1951 | **Myth bust: not "17 times".** The 17 was the raider's campaigns into India; Somnath was hit five times. Ask: "Have you been to Somnath?" |
| 2 | **Somnath II: the FAQs** | (recap 5 s) | — | Prabhashankar Sompura, the architect who rebuilt it in the old Maru-Gurjara style | The **Baan Stambh** arrow ("no land from here to the South Pole": what it says, what we can check, its age unknown); **the 1842 "Gates of Somnath"** the British carried back from Ghazni turned out to be deodar, not sandalwood, and not Gujarati (they still sit in Agra Fort); 1951: Munshi overruled on government involvement (verify the Nehru–Prasad letters before using) |
| 3 | **Mallikarjuna** (Srisailam) | Kartikeya leaves Kailash after the race and Ganesha's wedding; his parents follow him to Krauncha mountain as Mallika and Arjuna (Kotirudra 15) | verify the raids | the Reddi kings, Krishnadevaraya, Chhatrapati Shivaji (visited March 1677, gopuram: verify) | It's a Jyotirlinga AND a Shakti Peetha (Bhramaramba) on one hill; Shiva and Parvati visit their son on Amavasya and Purnima |
| 4 | **Mahakal** (Ujjain) | the demon Dushana and the Brahmin's sons; Shiva bursts from the earth as Mahakala (Kotirudra 16–17); the boy Shrikar (verify chapter) | 1234–35 (the linga said thrown into a tank: verify) | Ranoji Shinde (1730s; sources say 1732–36: show "1730s") | **Dakshinamukhi**, the only Jyotirlinga facing south; Ujjain was India's **prime meridian** (Surya Siddhanta); the Bhasma Aarti; Simhastha 2028 |
| 5 | **Omkareshwar** | Vindhya's tapas; Mandhata (Kotirudra 18) | verify | the Paramaras; the Holkars (verify) | two lingas, Omkareshwar and Amaleshwar: which is the Jyotirlinga? The island "shaped like Om" (show the real island from a DEM: let viewers judge) |
| 6 | **Kedarnath I** | Nara and Narayana's tapas (Kotirudra 19); the Pandavas and the bull's hump (later tradition: LOCAL BELIEF tag, Kedarkhand) | — | Adi Shankaracharya (tradition: the samadhi behind the temple) | the linga is a **hump**, not a pillar; Panch Kedar; why it shuts for six months (the doli to Ukhimath) |
| 7 | **Kedarnath II: the night of 16–17 June 2013** | — | **the destroyer was nature**: the flood (no name to hide) | the **Bhim Shila**: a boulder that stopped behind the temple and split the flood; the rebuilding after 2013 (the samadhi rebuilt 2021) | "400 years under snow?" (a scientist's hypothesis: present it as a theory or leave it out) |
| 8 | **Bhimashankar** | Bhima, **Kumbhakarna's son**, wars on the gods; Shiva burns him (Kotirudra 20–21; callback to our Kumbhakarna reels) | verify | Nana Phadnavis (18th-c shikhara: verify); Shivaji's grants (verify) | **three states claim it**: Maharashtra (Pune), Assam (Dakini), Odisha/others (verify): a state call-out |
| 9 | **Kashi Vishwanath I** | Avimukta: the city Shiva never leaves; Kashi on his trishul; the Taraka mantra at death (Kotirudra 22–23) | — | — | why "dying in Kashi" means moksha; the gold domes |
| 10 | **Kashi Vishwanath II** | — | 1194, the 15th c (verify), **1669** (the order, and the structure built on the site in 1678) | a Gujarati merchant (13th c, verify), Raja Todar Mal with Narayan Bhatt (1585: sources differ, say "according to"), **Ahilyabai Holkar (1780)**, **Maharaja Ranjit Singh's gold (1835)**, the corridor (2021) | **the Nandi who still faces the old site**; the Gyanvapi well. HIGHEST controversy, and the matter is in court: facts and dates only, no verdict, wording approved by the owner |
| 11 | **Trimbakeshwar** | Gautama, the cow, Ganga brought down as the Godavari (Kotirudra 24–26) | 1690 (verify) | Peshwa Balaji Bajirao, "Nanasaheb" (1755–86) | a hollow with **three tiny lingas**: Brahma, Vishnu, Mahesh; the source of the Godavari; Kumbh at Nashik 2027 (verify dates) |
| 12 | **Vaidyanath** | Ravana carries the linga to Lanka; it's set down and won't move (Kotirudra 27–28; callback to our Ravana reels) | verify | Raja Puran Mal (1596, Deoghar, verify); Ahilyabai (Parli, verify) | **Deoghar vs Parli vs Baijnath (HP)**, the biggest state fight; Shravani Mela's 105 km kanwar walk; a Shakti Peetha too (verify) |
| 13 | **Nageshwar** | the demons Daruka and Daruki; the merchant Supriya chanting in prison (Kotirudra 29–30) | verify | verify per site | **Dwarka vs Aundha Nagnath vs Jageshwar**; Aundha's temple that "turned round" for Sant Namdev (LOCAL BELIEF) |
| 14 | **Rameswaram** | Ram worships Shiva before the war (Kotirudra 31; callback to ad 42 Ram Setu) | 1311 (verify) | the **Setupati kings** (the world's longest temple corridor, ~1,200 m: verify) | 22 wells with 22 tastes; Hanuman's Kashi linga worshipped first (sthala purana: LOCAL BELIEF) |
| 15 | **Grishneshwar** | Ghushma's 101 lingas, her son killed by her sister Sudeha, the lake (Kotirudra 32–33) | 13th–14th c, then the Mughal–Maratha wars (verify) | **Maloji Bhosale**, Shivaji's grandfather (16th–17th c; inscription), **Ahilyabai Holkar** (18th c) | the smallest Jyotirlinga temple, a stone's throw from Ellora's Kailasa (callback to our Kailasa reel); men enter bare-chested |
| 16 | **Finale: "One queen rebuilt them"** | — | — | **Ahilyabai Holkar**: Kashi 1780, Somnath 1783, Grishneshwar, Parli and more (verify each), always painted holding a small linga | the biggest follower reel of the series: "Every Hindu should know her name" |
| 17 | **Bonus: the yatra map** | — | — | — | a save-magnet utility reel: all 12 on the map, the best order to visit them, the nearest city, the best month. "SAVE this" |

**Two parts** for Somnath, Kedarnath and Kashi (the densest histories). Others are one episode each; if the research
runs long, split them the same way: Part I is the story and the look, Part II is the dark, the light and the FAQs.

## Episode 1 outline (Somnath I, ad 120, ~85 s)
1. **Hook (0–3 s):** Somnath at sunset, the sea behind it. "This temple was destroyed FIVE times. It's still standing."
2. **Ident:** the pillar strikes Gujarat's coast: "JYOTIRLINGA 1 / 12 · SOMNATH".
3. **The story:** Daksha gave his 27 daughters to the Moon, who loved only Rohini; Daksha's curse made him waste away;
   at Prabhasa, Chandra worshipped Shiva for six months; Shiva let him wax for one fortnight and wane for the other, and
   stayed there as Somanatha, "Lord of the Moon" (Kotirudra 14). 3D: the moon shrinking to a sliver over the sea, then
   waxing.
4. **The look:** an orbit and a fly-through: Maru-Gurjara (Chaulukya) style, Kailash Mahameru Prasad, the sanctum, the
   two mandapas, the flag; on the sea wall, the arrow (the full answer is in Ep 2).
5. **The dark:** five redaction bars, one per hit: 1026, 1299, 1395, 1451, 1706. The temple breaks on each year, faster
   each time.
6. **The light (the longest beat):** a gold roll for Mularaja (before 997), Kumarapala (1169: stone and jewels) and
   Mahipala (1308). Then two portraits:
   - **Ahilyabai Holkar** (1783): when the old site couldn't be used, she built a new Somnath beside it. Her map lights up
     with the rest of her works: ghats, wells, rest houses and free kitchens from Kashi to Rameswaram (verify each).
   - **Sardar Patel**: 13 Nov 1947, standing in the ruins, he vowed to rebuild. The same year he was joining the princely
     states into India. Then the government story: Gandhi's "public money, not state money", Munshi overruled on the
     government's role, and 11 May 1951, the installation by the President (verify every line).
7. **Myth bust:** "Destroyed 17 times? No. Seventeen was the number of his campaigns into India. Somnath was hit five
   times, and rebuilt every time."
8. **Ask + next:** "Have you stood in front of Somnath? Write JAI SOMNATH." "Next: the arrow that points to the South
   Pole, and the gates the British brought back… that weren't Somnath's."

## The rebuilders' other works (portrait notes; verify each before use)
| rebuilder | temples in this series | their wider work for people (to source per episode) |
|---|---|---|
| Ahilyabai Holkar (r. 1767–95, Indore) | Kashi Vishwanath, Somnath, Grishneshwar, Parli, others | ghats, wells, kunds, dharamshalas, annakshetras and roads across India; Maheshwar's weavers; famed for justice ("Punyashlok") |
| Kumarapala (Chaulukya, r. 1143–72) | Somnath | a ban on animal slaughter in his kingdom; patron of Hemachandra's scholarship |
| Ranoji Shinde (Maratha general, d. 1745) | Mahakal | founded the Scindia house of Gwalior; the Ujjain temples' care under his line |
| Maharaja Ranjit Singh (r. 1801–39) | Kashi Vishwanath's gold | the Golden Temple's gilding; grants to temples, gurdwaras and mosques alike |
| Sardar Patel | Somnath | joined 560+ princely states into India; the Junagadh accession, 1947 |
| Chhatrapati Shivaji / the Bhosales | Mallikarjuna, Grishneshwar | temple grants across the Deccan; Maloji's Grishneshwar inscription |
| Peshwa Balaji Bajirao | Trimbakeshwar | the Peshwa's temple and water works in Nashik and Pune |
| the Setupati kings (Ramnad) | Rameswaram | pilgrim rest houses and the guard of the Ram Setu crossing |

## Posting
Trailer, then Episode 1 the same day (27 Nov 2026). Then one episode every day or two. Each episode is built in its own
session (as the Hanuman series). Each ends on "Next: …" and the follow card. The covers show "JYOTIRLINGA N/12" and the
temple's name big; for two-parters, "PART I/II". Ask how each did (views, follows, comment fights) before the next.

## Facts used in the trailer (ad 119)
| claim | source |
|---|---|
| Brahma and Vishnu argued; an endless pillar of fire appeared; neither found its end; that pillar is the Jyotirlinga | Shiva Purana, Vidyeshvara Samhita 6–8 (as ad 43) |
| Twelve Jyotirlingas, from Kedarnath in the Himalaya to Rameswaram by the sea | Shiva Purana, Kotirudra Samhita 1 |
| The temples were attacked again and again (Somnath alone in 1026, 1299, 1395, 1451, 1706; Kashi in 1194 and 1669; Mahakal in 1234–35) | Wikipedia: "Somnath temple", "Kashi Vishwanath Temple", "Mahakaleshwar Jyotirlinga" |
| Kumarapala rebuilt Somnath in stone | the 1169 inscription (Wikipedia: Somnath temple) |
| Ahilyabai Holkar built the present Kashi Vishwanath temple | 1780 (Wikipedia; some sources say 1776–77) |
| Ranoji Shinde rebuilt Mahakal | 1730s (sources say 1732, 1734 or 1736) |
| Maharaja Ranjit Singh gave the gold that covers Kashi Vishwanath's domes | 1835 (Wikipedia) |
| Sardar Patel ordered Somnath rebuilt | 12/13 Nov 1947 at Junagadh (Wikipedia); installed 11 May 1951 |
| The FAQ teasers (the Somnath arrow, the three-state claim, the boulder of 2013) | asked only; answered and sourced in their episodes |
