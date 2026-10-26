# Instagram Story: a parent's review of Book 1 (Storybook, 24 s)

A five-star Amazon review of Book 1 (Nikhil, 21 Oct 2026, Verified Purchase) from a parent who found the book on
Instagram. The Story letters their words verbatim (trimmed, never reworded), one beat a wall, and asks more parents to
try Book 1. Offer (owner, 26 Oct 2026): **Book 1 · ₹200**, "or Books 1–3 for ₹500". Stories cover the top ~220 px and
the bottom ~280 px, so everything sits in y 220–1640; the card leaves y ~1510–1620 empty for the link sticker.

| time | wall | picture | lettering |
|---|---|---|---|
| 0–4.2 | teal | NEW REVIEW · BOOK 1 tag, five stars twinkling in turn, Mooshak holding Book 1 hops (frame 0 finished) | "Finally, something *different!*" / from a parent who found us on Insta |
| 4.2–8.6 | lavender | a phone with the @therishikatha post of the Book 1 cover; the heart fills at 5.6 | "Saw this on my *Insta* feed and took a chance…" / 6.4 "So glad I *did!*" |
| 8.6–13.4 | coral | Mooshak reading Book 1, nodding; question marks pop round his head from 10.9 | "My little one keeps asking to *re-read* it…" / "…and has so many *questions* every time" |
| 13.4–17.4 | sky | the review slip: Book 1, five stars, Nikhil, Verified Purchase · Amazon | "Such an easy way to introduce *Indian history* at this age." |
| 17.4–24 | peach | the card: logo, Book 1 cover, stars, "So glad I did!" — Nikhil, a parent, **Book 1 · Shailputri · ₹200**, or Books 1–3 for ₹500, rishikatha.com, TAP THE LINK ↓ | "Your little one's *next favourite* book?" |

Files: `story_review.html` (a copy of `storybook.html` with its own PROJECT), `src/scenes/story_review.js`,
`tools/story_review_sfx.mjs` → `assets/story_review.wav`.

```sh
node tools/story_review_sfx.mjs
rm -rf out/frames && node render.mjs --page=story_review.html --clip --out=out/story_book1_review_out/story_book1_review.mp4
```
