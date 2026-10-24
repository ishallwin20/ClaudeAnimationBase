# Live wallpapers (test batch 1, branch `wall/1-test`)

Six phone wallpapers to test whether people want (and will pay for) Rishi Katha live wallpapers: four cute Painted
gods, and Shiva in both Painted and Cinematic for the "pick your style" test.

| loop | style | what it is | the motion |
|---|---|---|---|
| `wall_bappa` | Painted | Bal Bappa on a pink lotus at dusk, a modak in his hand, Mooshak nibbling one, two diyas, a marigold garland across the top | breathing, ears and trunk swaying, a double blink, Mooshak chewing and swishing his tail, diya flames, petals falling, the halo and the rangoli turning |
| `wall_krishna` | Painted | Makhan chor: Kanha by a pot of butter under a full Vrindavan moon, a kadamba branch overhead | his hand dips into the butter and he licks his fingers; the feather sways, kadamba flowers swing, fireflies, stars |
| `wall_hanuman` | Painted | Bal Hanuman flying up to a big, sleepy-faced rising sun | flight bob, legs kicking, tail streaming, clouds rushing down past him, the rays turning, birds |
| `wall_owl` | Painted | Diwali: Maa Lakshmi's owl on a parapet of diyas, a diya in his wings, coins, Lakshmi's footprints in the rangoli | his head turns right round once a loop; fireworks, the town's lamp strings, coins glinting |
| `wall_shiva` | Painted | Shiva in meditation on Kailash at night | breathing, Vasuki lifting his head and flicking his tongue, the Ganga trickling, aura rings, snow |
| `wall_shiva_cine` | Cinematic | Shiva standing on Kailash before the full moon, eyes closed, the hand in abhaya | breath and wind in the jata, moonlight rays, the moon's glow, snow (`studio_wall_cine.html`) |

## The files (`node tools/wallpaper.mjs --name=<loop> [--lock]`)
`out/wallpapers/<loop>/`: `_iphone.mp4` (1290×2796), `_android.mp4` (1080×2400), `_live.jpg` + `_live.mov` (a
paired iPhone Live Photo: the still is frame 0, the motion the first 3 s), `_iphone.png` / `_android.png` (the stills),
`_lock.mp4` (the loop under a mock lock screen, for the reel and the website). The Cinematic one:
`node tools/wallpaper.mjs --name=wall_shiva_cine --page=studio_wall_cine.html`.

## iPhone: what the lock screen really does (tested on the owner's iPhone, 23 Oct 2026)
- A pair made by `makelive` alone (the `_live.jpg` + `_live.mov` that tools/wallpaper.mjs still writes) imports as a
  Live Photo but says "Motion Not Available". `tools/livephoto.swift` writes it as the camera does (HEVC ≤1920 px,
  30 fps, the key photo ≥0.5 s in, the live-photo-info and still-image-time tracks) and that works. Wire it into
  tools/wallpaper.mjs next.
- The lock screen plays only ~1–2 s of motion on wake, then holds the still; it never loops (5 s clips and a late key
  photo didn't change that). So the iPhone version is a short wake-up moment: `LOOPS.wall_shiva_wake` (2 s, the key
  at 1.5 s: Vasuki pops up, flicks his tongue, smiles), built with
  `node render.mjs --loop=wall_shiva_wake --png --fps=30 --out=<dir>` then
  `swift tools/livephoto.swift --frames=<dir> --still=<dir>/f0045.png --key=45 --fadeIn=0 --fadeOut=0 --out=<base>`,
  and `makelive --pvt --manual <base>.heic <base>.mov` for an AirDrop package.
- Loops are 24 fps (Painted boils at 12), Live Photos 30 fps.

## Getting it onto a phone
- **iPhone** (iOS 17+): Photos → the Live Photo → Share → Use as Wallpaper. The motion plays when the phone wakes, then
  holds the still; nothing on iOS loops a video wallpaper. A Live Photo only survives as a pair: AirDrop the `.pvt` or
  share an iCloud link from Photos. A plain download from a web page arrives as two separate files. The fallback is the
  MP4 plus a free converter app (intoLive and similar).
- **Samsung** (One UI): Settings → Wallpaper → Lock screen → pick the `_android.mp4` (≤15 s video). It loops.
- **Pixel / others**: no built-in video wallpaper; a free "video live wallpaper" app loops the MP4.
- Every pack also has the still PNG, which works everywhere.

## How a wallpaper is built (src/scenes/wall_kit.js)
- The canvas is 1290×2796. Scenes draw in a 1080×2340 design space (`wallBegin()`), so the reel rigs' sizes apply.
- **Quiet top:** the date, clock and widgets cover design y ~170–720, so put sky there (a garland may hang above
  y 170). The subject lives in y 900–2100, clear of the bottom buttons (y ~2175).
- **Frame 0 is the still**, so it must be the prettiest pose with the eyes open.
- **Seamless loops:** WL = 6 s, which is 8 beats at 80 bpm and 72 boil drawings. Every motion is a whole number of
  cycles a loop (`lsin`, `petalFall`, `twinkle`, `cloudBank`). The rigs' own idles and blinks run on T at their own
  rates, so `rigClock()` runs a rig on a clock that swings back and forth once a loop, with its blink placed where
  you ask (`at`, a double blink). Check the seam: `--sheet=5.875,5.917,5.958,0,0.042,0.083`.
- `LOOPS.<name>_lock` draws the lock screen over it (Cinematic: times 100–106).

## Facts used
Wallpapers tell no story; each motif is a common, sourced image:
- Ganesha's love of modaks and his mouse vahana, Mooshak (Ganesha Purana; Mudgala Purana).
- Krishna stealing butter as a child in Gokul (Bhagavata Purana 10.8–10.9). The kadamba is the tree of Vrindavan
  (Bhagavata 10.22).
- Baby Hanuman leaping at the rising sun, which he took for a ripe fruit (Valmiki Ramayana, Kishkindha Kanda 66;
  Uttara Kanda 35). The sun's face is a cartoon gag and claims nothing.
- The owl (Uluka) as Lakshmi's vahana, worshipped with her on Diwali night (the Bengal tradition of the lokkhi pencha).
  Lakshmi's footprints drawn at the door on Diwali are a household custom.
- Shiva in meditation on Kailash with the crescent moon, the Ganga in his jata and Vasuki round his neck (Shiva Purana).

## Batch 2 (branch `wall/2-batch`, 24 Oct 2026): ten packs, six files each
`node tools/wallpack.mjs [--only=01,sindoor]` writes `out/wallpapers2/<NN>-<slug>/`: `wallpaper.png` (the still, the
Live Photo's key frame), `wallpaper_with_time.png`, `live_wallpaper_ios(.heic/.mov/.pvt)` and `_with_time`, and
`live_wallpaper_android.mp4` and `_with_time`. The lock screens are `tools/lockscreen.py` (iPhone in San Francisco;
Samsung One UI for Android).
- **iPhone:** 1 s, ending on the still. The loops are rendered at 30 fps; each frame is used twice for a 60 fps movie
  (owner's ask; batch 1's tested pair was 30 fps, so if 60 shows "Motion Not Available", re-run with 30). The window is
  the loop's last second (5–6 s, a little beat that lands on frame 0) or a chosen moment: the owl's head turn (3.1–4.1),
  Kanha's lick (2.2–3.2), Shiva's `wall_shiva_wake` (.5–1.5).
- **Android:** the 6 s loop twice (12 s, under Samsung's 15 s cap), 1080×2400, 30 fps.
- New loops (`src/scenes/wall_batch2.js`): Hanuman in sindoor at sunrise, Kanha patting his cow, Maa Lakshmi on her
  lotus pouring coins, Narad Muni on a cloud with his veena, Maa Durga with Sher. Bal Bappa's modak hand now rests on
  his knee (it read as part of the tusk when raised beside the trunk) and the other hand blesses; Mooshak is bigger.
- Facts: Hanuman's sindoor for Ram's long life (a widely told tradition, as in ad 29), Krishna the cowherd of Vrindavan
  (Bhagavata 10.11ff), Lakshmi on the lotus with coins (Sri Sukta), Narad's veena and Narayana's name (Bhagavata 1.6),
  Durga's ten arms and the gods' gifts, her lion (Devi Mahatmya ch. 2).
