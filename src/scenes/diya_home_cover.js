// diya_home_cover.js: the cover for "Pass it on" (cover.html): frame 0 (her diya on the tulsi chaura, her in the
// doorway), three sparks lifting, the hook big inside the 3:4 grid crop (y 240–1680).
window.COVER = 1;
POST.unshift((c) => {
  const T0 = 1.6; sparks3(c, 548, 820, T0, 1, 1.1);
  textC(c, 'Far from home', 540, 400, 104, '#FFF1D6', 1);
  textC(c, 'this Diwali?', 540, 520, 104, '#FFD36A', 1, { glow: 'rgba(255,190,90,.6)' });
});
