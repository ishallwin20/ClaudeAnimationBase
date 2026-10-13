# Why do people WHISPER in Nandi's ear? (reel/nandi-whisper)

A Cinematic reel (see CINEMATIC_GUIDE.md), 65.6 s, 9:16, with a Lyria score under the SFX. The owner's wife suggested
it after ad 15 (Ravana lifts Kailash) passed 1M views. Nandi was redrawn as a zebu for it, because a viewer called ad 15's
Nandi a goat. It ends on a follow card with no offer.

```
Logline: Why do people whisper in Nandi's ear? Sage Shilada begged Shiva for a son who would never die, and found a
         glowing child in the field he was ploughing: Nandi, "the one who brings joy". Two sages foretold that the boy
         would die at eight. He didn't cry; he prayed by the river, and Shiva came and made him immortal, his gatekeeper
         and his vahana. Shiva meditates, Nandi guards the door, so devotees whisper their wish to Nandi, and Nandi
         tells Shiva. That's why every Nandi faces Shiva. The same Nandi cursed Ravana. And at Thirupunkur, Nandi moved
         aside so Nandanar, kept outside, could see Shiva.
Sources: the Shiva Purana (Shatarudra Samhita) for Shilada and the age-8 prophecy; the Periya Puranam for Nandanar.
         The whisper is a temple belief; the captions say "devotees whisper", not that it's scripture.
Why it should travel: a ritual everyone has seen and few can explain ("known yet unknown"), a death-at-eight turn, a
         callback to the 1M Ravana reel, a surprise ending (the Nandi that moved), and a PLACE call-out (the Shiv Tandav
         reel's "comment your city" brought 50 comments).
Comment: "Which temple's NANDI have YOU whispered to? Comment your city!" Pinned: "Lepakshi, Thanjavur, Bengaluru's Bull
         Temple… which Nandi is the BIGGEST you've seen? 🐂"
```

| time | shot | palette | caption |
|------|------|---------|---------|
| 0.0–5.4 | **The hook.** A temple at night: the black stone Nandi on his pedestal, a lamp, a woman whispering at his ear (it perks at 1.2). Frame 0 is finished, with the caption lit. | lamp amber | Why do people / WHISPER in / NANDI's ear? → It begins with a boy / who was told he'd / die at EIGHT. |
| 5.0–8.4 | Sage Shilada in meditation by a yagna fire under Kailash. | night violet | Sage SHILADA begged / Shiva for a son / who would never die. |
| 8.0–13.4 | Dawn, a ploughed field; he ploughs; at 9.6 the earth flashes; a glowing baby rises (10.4). | dawn gold | One day, ploughing / the sacred field… → …he found a / GLOWING child / in the earth. |
| 13.0–16.0 | The boy beside his father at sunset. | sunset | He named him NANDI: / "the one who / brings JOY." |
| 15.6–21.3 | Two sages walk in and point; the light drains to night at 18.4; a heartbeat. | sunset → cold blue | Then two sages / looked at the boy / and said: → "He will die / at EIGHT." |
| 20.9–26.3 | Night by the river; the boy prays; the moon crosses (time passes). | night blue | Little NANDI / didn't cry. → He sat by the river / and prayed / to SHIVA. |
| 26.0–30.3 | Shiva appears in a column of light (26.6); the boy turns to light (28.8). | moonlight | And SHIVA / came. → He made the boy / IMMORTAL… |
| 30.0–34.5 | White-out into the great white bull in a gold sunrise. | dawn gold | …his gatekeeper / and his vahana: / NANDI, the bull. |
| 34.0–39.8 | Kailash at night: Shiva meditating at its foot, Nandi standing guard. | night blue | Shiva meditates / on Kailash… → …and NANDI / guards the door. |
| 39.4–45.2 | The temple again, with the sanctum: she whispers; a thread of light runs from his ear to the linga (42.2), which glows. | lamp amber | So devotees whisper / their wish / to NANDI… → …and NANDI / tells SHIVA. |
| 44.8–49.9 | The wide: Nandi facing the sanctum, pillars, a band of light between them. | lamp amber | That's why every / NANDI faces SHIVA. → Waiting. / Always. |
| 49.6–52.9 | The callback: Nandi before burning Lanka, his eyes flaring; Hanuman leaps across. | fire red | Yes, the NANDI / whose curse burned / RAVANA's Lanka. |
| 52.6–58.8 | Thirupunkur at dusk: Nandi lies in the gopuram's gateway; Nandanar outside. At 54.6 Nandi slides aside, the light pours out, Nandanar raises his hands. | dusk | But at THIRUPUNKUR, / NANDI MOVED. → Shiva asked him / to step aside, so / NANDANAR, kept outside, / could see him. |
| 58.4–62.1 | Back to the hook's image. | lamp amber | Which temple's NANDI / have YOU / whispered to? / Comment your city! |
| 61.6–65.6 | The follow card: RK logo, HAR HAR MAHADEV, Nandi, "Stories of Shiva and the gods", the Follow @therishikatha pill, rishikatha.com. Held, with no fade. | teal | |

## Files
- Scene: `src/scenes/nandi.js` (times in `TL`; `templeNandi()` draws the temple shots 1, 10, 11 and 14).
- New shared Cinematic cast and sets (on `main`, ac5a291): Nandi redrawn as a zebu (`nandiStanding`, `nandiLying`,
  `stone`, `ear`), `rishi`, `plough`, `boy`, `devotee`, `nandanar`; `linga`, `deepa`, `sanctum`, `furrows`, `river`,
  `gopuram`; `tools/lyria.mjs`.
- Sound: `tools/nandi_sfx.mjs` → `assets/nandi_sfx.wav`, then mixes `assets/nandi_score.mp3` (its first 65.6 s, at .5)
  under it → `assets/nandi_mix.wav` (loudnorm −15 LUFS).
- The score: `node tools/lyria.mjs --prompt=tools/nandi_score.txt --out=assets/nandi_score.mp3` (two takes, $0.16 in
  all). Take 1 stretched every section ×2.34 (154 s) and began with 6 s of near silence. Take 2, with the length
  stated at the start and the end of the brief, follows the timestamps for 0–65 s; it then goes silent and plays an
  unrelated tail, which is cut off.

## Render
```sh
node tools/nandi_sfx.mjs
node render.mjs --clip --out=out/nandi.mp4                       # score + SFX (PROJECT.audio)
ffmpeg -i out/nandi.mp4 -i assets/nandi_sfx.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/nandi_sfx.mp4
ffmpeg -i out/nandi.mp4 -map 0:v -c:v copy out/nandi_silent.mp4  # for music in Edits
node render.mjs --stills=0 --out=out/stills                      # the cover: frame 0, inside the 3:4 grid crop (y 240–1680)
```

## Instagram caption
```
Why do people WHISPER in Nandi's ear? 🐂🔱 The answer begins with a boy who was told he would die at EIGHT.

Sage Shilada prayed to Shiva for a son who would never die. While ploughing the sacred field, he found a glowing child in the earth and named him Nandi, "the one who brings joy."

Then two sages looked at the boy and said: "He will die at eight."

Little Nandi didn't cry. He sat by the river and prayed to Shiva, and Shiva came. He made Nandi immortal: his gatekeeper and his vahana.

Shiva is always in meditation, and Nandi guards the door. So devotees whisper their wish into Nandi's ear, and Nandi tells Shiva. That's why every Nandi faces Shiva: waiting, always.

Yes, this is the same Nandi whose curse burned Ravana's Lanka. And at Thirupunkur in Tamil Nadu, Shiva asked Nandi to step aside so his devotee Nandanar, kept outside the temple, could see him. That Nandi still sits to one side.

👇 Which temple's Nandi have YOU whispered to? Comment your city!
💾 Save this for your next temple visit, and send it to someone who always whispers to Nandi.
📚 Stories of Shiva, Devi and the gods for children: rishikatha.com (link in bio). Follow @therishikatha for more.

#Nandi #Nandikeshwara #LordShiva #Mahadev #HarHarMahadev #Shiva #ShivaTemple #HinduMythology #ShivaPurana #Kailash #Sanatan #Bholenath #IndianMythology #RishiKatha
```
