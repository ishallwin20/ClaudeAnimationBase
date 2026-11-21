# Kanha vs Radha

A series of tiny Cel-style skits (CEL_GUIDE.md, cast in `src/cel_vraj.js`) asked for on 18 Nov 2026 after an Instagram
example the owner liked: two chibi kids on a plain ground, one handwritten line at a time, a punchline from a real lila.
The owner's brief: Cel, and "extremely cute". We take the format, never the example's characters, colours, lettering or
gags (its punchline was the Damodar rope: don't reuse it).

## Rules

- **10–16 s, one fixed frame**, 3–5 short lines (2.5–3.5 s each, one speaker at a time), a plain cream ground, no voice:
  each kid babbles in pitched blips (`tools/kvr1_sfx.mjs`). No end card (it breaks the loop); @therishikatha under the
  feet; the ask goes in the caption and the pinned comment.
- **Radha always wins.** Kanha brags; she deflates him; he charms his way back. Sweet and friendly, never romantic:
  they are small children.
- **The punchline points to a sourced lila** (Bhagavata Skandha 10 mostly), listed in the episode's "Facts used". The
  bickering itself is performance and claims no plot fact. Radha comes from the Brahmavaivarta Purana, the Garga
  Samhita, the Gita Govinda and Braj tradition, not the Bhagavata; say so when viewers ask. A Braj folk tradition can
  carry an episode if the caption calls it one.
- Branches `reel/kanha-radha-<n>-<idea>`; deliverables `out/kvr<n>_<idea>_out/`.

## Episodes

| # | setup → punchline | source | status |
|---|---|---|---|
| 1 | "Nobody can catch the butter thief!" / "Kanha… your face." / "The MONKEYS ate it!" / a monkey with a full pot and a clean face: "Not me." / "…want some?" She melts. | BhP 10.8.29, 10.9.8 | built 18 Nov 2026, `reel/kanha-radha-1-butter` |
| 2 | Mud on his face: "I did NOT eat mud." / "Open." The universe bursts out of his mouth and they float in it; a tiny Radha waves from a tiny Vraja (10.8.39: Yashoda saw herself inside) / a clod drifts past: "…is that MUD?" He gulps it all back. / "That's a planet." She cracks up. | BhP 10.8.32–39 | built 20 Nov 2026, `reel/kanha-radha-2-universe` |
| 3 | A tiny Govardhan on his palm, a grumpy cloud raining on it: "I lifted a MOUNTAIN with one hand!" / "For 7 days!" / "Then carry my pot home." He tries one hand, then both: it won't budge. / "…I'm tired." / She flicks the pot onto her palm in his pose: "One hand." / "So strong…!" Ask: finger or hand? | BhP 10.25.19–23 (one hand, "like a child holds a mushroom"; "little finger" is not in the text) | built 21 Nov 2026, `reel/kanha-radha-3-govardhan` |
| 4 | "I danced on Kaliya's hoods!" / Radha holds up Yashoda's stick. He bursts into tears. | BhP 10.16; 10.9.9–11 (he ran from her stick, crying) | |
| 5 | Radha hides the flute; the cows stop coming; Kanha panics. | Braj tradition (Surdas's pads), labelled as such | |
| 6 | "When Brahma hid my friends, I became all of them for a year." / "So THAT's why Shridama shared his laddoos." | BhP 10.13 (the mothers loved their sons more that year) | |
| 7 | "Why does everyone say Radhe-Krishna? I'm the famous one." All of Braj: "Radhe Radhe." He gives in. Ask: "Radhe Radhe, Jai Shri Krishna or Hare Krishna: what does YOUR family say?" | the Braj greeting (living tradition) | the strongest comment lever |
| 8 | Lathmar Holi: the Nandgaon boys arrive; Barsana's girls are waiting with lathis. | the Barsana–Nandgaon Holi (living tradition) | hold for Holi, March 2027 |

New cast each episode may need (the cosmos kit and mud on his face are in since #2, Govardhan, the rain cloud and the water pot since #3): Yashoda (Cel), Kaliya, a calf, Brahma, gopas.
Add them to `src/cel_vraj.js` on main.
