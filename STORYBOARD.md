# The Cosmic Wi-Fi Battle

A 28-second vertical reel (1080×1920, 24 fps, bpm 120) starring Kartikeya, Bal Bappa and Shiva (with Vasuki).
Scene: [src/scenes/wifi_battle.js](src/scenes/wifi_battle.js), sets and props: [src/scenes/wifi_props.js](src/scenes/wifi_props.js),
characters: [src/kartikeya.js](src/kartikeya.js) (the VR headset rides his `head` hook), [src/bal_bappa.js](src/bal_bappa.js), [src/shiva.js](src/shiva.js),
sound effects: [tools/wifi_sfx.mjs](tools/wifi_sfx.mjs) → `assets/wifi_sfx.wav`.

```
Logline: On Kailash, Kartikeya's VR game and Bal Bappa's 4K modak tutorial buffer at the same moment, so the brothers
         fight over the router's antennas, until the Wi-Fi dies: Shiva has unplugged it to meditate, and Vasuki
         slurps the cord up like a noodle, dragging router and boys in with it.
Hook:    "Sibling rivalry is universal… especially over the Wi-Fi." (caption, 0.3–3.9)
Sting:   "Mahadev: the original parental control." (caption over the last wide, 25.0–27.3)
World:   A cave-room on Kailash at night: indigo stone, an arched window (moon, the peak), a rug split teal | saffron
         with the router on the seam. The rivalry is in the light: teal glow on Kartikeya's side, saffron on Bappa's,
         gold → white-hot at the router as the tug peaks; the blackout drops to moon-blue; Shiva's alcove has one diya.
         Palette: WB in wifi_props.js.
Motif:   the router's LED and Wi-Fi fan: the film opens on the LED dot growing into a Wi-Fi-shaped iris, and closes
         with an old-TV switch-off to a dot (so it loops). The cord is planted along the wall from the first wide and
         pays off in the reveal. Both screens buffer on the same spinner, in sync.
Text:    the hook and the sting, plus overlays (the brief asked for them, to make the setup unmistakable):
           1.0–2.45   "Kartikeya: VR boss fight" (teal, under his hologram)
           2.45–4.1   "Ganesha: 4K YouTube tutorial / 'How to make 10,000 modaks'" (saffron, under the TV; the TV has a red play badge)
           4.7 / 5.45–6.25  "buffering…" under each screen as it freezes
           6.45–7.5   "Who's hogging the Wi-Fi?!"      8.37–9.3  "Tug-of-Wi-Fi."
           9.3–10.4 / 11.1–11.95  "back online!" under the winner's screen
           14.45–15.9 "No signal."                     18.7–20.35 "Dad unplugged it. / He just wanted to meditate."
           20.45 "SLURRRP!" · 21.5 "gulp." (comic sound words by Vasuki)
           23.65–24.8 "Suddenly… very spiritual."
         All of it sits inside Instagram's safe band (y 420–1500, left of x 930). Screens stay pictures.
Arcs:    Kartikeya: excited → confused → suspicious → angry → determined → smug → surprised → angry → straining →
                    blank → accusing → curious → scared → dizzy → jaw-drop → "meditating" (sweating)
         Bappa:     happy / love → confused → suspicious → angry → determined → nervous → smug → straining → blank →
                    accusing → curious → scared → dizzy → jaw-drop → "meditating" → a sneaky peek → caught
         Shiva:     serene all film; one eye opens (the kids), closes smiling; one eye again (Bappa's peek), closes
Shots:
  A  0–4.4     [in: the router's LED dot grows into a Wi-Fi fan, whose tip drops away as it sweeps over the frame]
     reads: 0–.95 the LED → Wi-Fi fan · 0.3–3.9 hook caption · 0.9–2.2 on Kartikeya: VR headset, the vel swung like a
            controller, his game projected above him · 2.2–3.6 on Bappa: the TV's modak mountain growing, eating
            along, love · 3.6–4.4 the wide: data flowing from the router to both screens, the cord along the wall
  B  4.4–8.0   [camera carries]  the buffer
     reads: 4.6 his game freezes → spinner; "?" · 4.95 / 5.2 bonks the headset with his shield · 5.35 the TV freezes →
            the same spinner; "?" · 5.7 / 5.95 trunk jabs at the TV · 6.05 visor up · 6.2 heads turn · 6.45–7.05
            the glare (lightning between them) · 7.15 both eyes snap to the router (one flickering bar) · 7.55 crouch
            · 7.75 launch
  C  8.0–14.2  [cut on action, mid-hop]  the tug-of-war
     reads: 8.35 vel hooks the left antenna, trunk the right · 9.0 / 9.5 / 10.0 his yanks: router lurches left, the
            fan leans to him, his game comes back, smug · 10.5 / 11.0 / 11.5 Bappa's yanks: lurches right, the TV
            comes back, smug · 12.0–14.2 all-out: flushed, antennas stretch, router shakes and heats to white, sparks,
            the fan spins, push in
  D  14.2–17.6 [hard snap to dark]  the blackout
     reads: 14.2 every light dies, silence · 15.0 they look at the dead router · 15.3 one jiggle: nothing · 15.9
            they blame each other (Bappa jabs a finger) · 16.55 their eyes travel up and along the cord ·
            17.2–17.6 whip pan right along it
  E  17.6–22.6 [whip pan along the cord]  the reveal
     reads: 17.6–18.3 the cord ends at the socket, empty, its holes shocked · 18.6–19.9 Shiva in lotus, serene, the
            plug dangling from his fingers; a temple bell · 19.9–20.35 eyes still shut, he feeds it to Vasuki ·
            20.4–21.35 SLURRRP: the clips pop off the wall, the cord goes taut, router and boys come skidding in ·
            21.35 thud, dizzy · 21.5 gulp · 21.95 jaws drop, "!!"
  F  22.6–28   [push in on his face, then out]  the button
     reads: 22.95 one eye opens at them · 23.55 they snap to it: eyes shut, Bappa plops cross-legged ("Suddenly… very
            spiritual.") · 24.2 the wide · 25.0 sting caption · 25.3 Bappa peeks at the router · 25.75 Shiva's eye slides to him · 26.15 snaps shut,
            sweat · 27.25–27.95 old-TV switch-off to a dot
  [out: CRT off to the LED dot, then ink]
```

Render: `node tools/wifi_sfx.mjs`, then `node render.mjs --frames --workers=4` and `node render.mjs --encode --out=out/wifi_battle.mp4`
(picks up `PROJECT.audio`); `--audio=none --out=out/wifi_battle_silent.mp4` for a copy to add music to on Instagram.
