// phone_cover.js: the Instagram cover for "Be Like A Tortoise" (cover.html = studio.html + this): the temptation beat
// (the phone buzzing, the monkey sweating, the tortoise calm in her shell) under a big title, inside the 3:4 grid crop
// (y 240–1680).   node render.mjs --page=cover.html --stills=0 --out=out/phone_cover
SHOTS.length = 0;
(() => {
  shots([[0, () => {
    window.PHONE_COVER = true;
    PHONE_STORY(21.95);
    const L = (txt, y, px, col, w = 700) => letter(txt, W / 2, y, px, col, { screen: true, font: `${w} ${px}px Poppins`, ink: false });
    L('The Gita says:', 400, 58, '#FFFFFF', 500);
    L('Be like a', 490, 84, '#FFFFFF');
    L('TORTOISE', 1475, 120, FABLE.yellow);
    L('a story for kids… and grown-ups', 1575, 34, '#BDB6AA', 500);
  }]]);
})();
