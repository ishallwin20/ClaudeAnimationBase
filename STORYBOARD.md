# 2 AM Modak Run

A 35-second vertical reel (1080×1920, 24 fps, bpm 100) starring Bal Bappa. Scene: [src/scenes/modak_2am.js](src/scenes/modak_2am.js), sets and props: [src/scenes/modak_props.js](src/scenes/modak_props.js), Vayu: [src/vayu.js](src/vayu.js), sound effects: [tools/modak_sfx.mjs](tools/modak_sfx.mjs) (built with [tools/sfx.mjs](tools/sfx.mjs)) → `assets/modak_sfx.wav`.

```
Logline: Bal Bappa wants modaks at 2 AM, but Parvati's padlock (with a watchful third eye) zaps him, so he orders
         21 on Swarga-Mart and Vayu delivers them through a meteor shower. The lock, of course, notices.
World:   Kailash at night. Cold indigo walls and a warm diya pool → violet cosmos → the golden light of an open bag
         → a cool violet sting. Palette: MK in modak_props.js.
Motif:   the rumble (belly quake) → rhymed at the end by a burp. The padlock's eye: closed → glares → zaps →
         the final eye-shaped iris.
Text:    only in the world: the hook caption, "Swarga-Mart" (phone, bag sticker) and the "21" counter.
Bappa's arc:  sleepy → surprised → shy → mischief → love (the smell) → surprised → determined → scared → KO → sad
              → idea → starstruck → love → happy → shy (burp)
Shots:
  A  0–4.0    [in: iris from ink on the diya]  the room; Bappa reads a palm leaf, nods off, jolts awake · the hook caption
     reads: 0.6–1.8 room + Bappa reading · 1.8–2.4 the nod · 2.42 jolt · 3.35–3.9 a gurgle; his eyes drop to his belly
  B  4.0–7.4  [cut on action to a belly close-up]  the rumble
     reads: 4.0–5.2 the belly quakes, face in shock · 5.2–6.0 wide: room shakes, lota falls, Mooshak bolts awake "!!"
            6.05–6.75 shy · 6.75–7.1 mischief, eyes slide right (to the kitchen) · 7.12 whip pan right
  C  7.4–11.4 [whip smear in]  corridor: tiptoe (one step a beat), Mooshak copying behind
     reads: 7.55–9.2 sneaking · 8.8–9.6 smell wisps come from under the door; the trunk reaches · 9.55–10.3 he floats
            on the smell (love) · 10.55 the padlock — "!" · 11.0–11.4 push in
  D  11.4–16.2 [push continues]  the padlock
     reads: 11.4–12.4 he hangs off it, heaving · 12.45 the eye opens: scared · 13.0 ZAP (violet flash) · 13.42 lands
            KO, smoking · 13.8–15.35 sad, rain cloud; Mooshak pats him · 15.35 bulb! · 15.55 the phone comes out
            · 15.85–16.2 push to the phone, its glow fills the frame
  E  16.2–19.8 [match cut on light]  the phone
     reads: 16.25–17.2 Swarga-Mart splash · 17.25–18.5 trunk taps +, count 1 → 21, faster and faster · 18.5–18.95
            "21" lands, trunk up in triumph · 19.2 hover over the bolt key · 19.45 TAP; the bolt shoots up · white flash
  F  19.8–23.6 [flash]  the meteor run
     reads: 19.85–20.45 Vayu blasts in (shades, pack) · 20.2–21.3 the big meteor; he loops round it · 21.3–21.9 ducks
            a second · 22.1–23.1 Kailash rises, one lit window · 22.85–23.45 the dive into the window · flash
  G  23.6–27.2 [cut on action: the gust]  the corridor window
     reads: 23.6–24.4 gust, Vayu in, Mooshak blown flat · 24.5–24.85 shades up, grin · 24.9 the bag held out
            · 25.35 starstruck · 25.9 handoff · 26.4–27.2 bag on the floor, opens: gold light, steam
  H  27.2–31.0 [continuous]  the bite, the rating
     reads: 27.2–27.9 trunk dips in, comes back with a modak · 27.98 / 28.2 chomp, chomp · 28.3 gulp, hearts
            · 28.4–29.8 the phone rises; five stars, one by one · 29.4 Vayu glows with pride · 29.95 salute, wave
            · 30.3 gone out of the window
  I  31.0–35.0 [wind-swirl wipe from his exit]  after; the sting
     reads: 31.0–31.9 the opening room again: Bappa rounder, empty bag, Mooshak hugging modak no. 21 · 31.95 BURP
            (the room shakes a little: the rhyme) · 32.25 shy · 32.45 whip pan · 33.05–33.6 the padlock's eye opens
            · 33.65 it looks toward his room · 33.95 narrows · 34.25–34.9 an eye-shaped iris shuts on it
  [out: eye iris to ink]
```

Render: `node tools/modak_sfx.mjs`, `node render.mjs --frames --workers=4`, then
`node render.mjs --encode --audio=assets/modak_sfx.wav --out=out/modak_2am.mp4`.
