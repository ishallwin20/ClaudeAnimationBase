// The cast test for Issue 2 (cast_ink.html): one page per sheet, no words.
const FACE = { edge0: .14, edge1: .3 };
const COMIC = { slug: 'hanuman_cast', pages: {
  1: { panels: [
    { r: [24, 24, 508, 640], art: 'tBalSit', ink: FACE },
    { r: [548, 24, 508, 640], art: 'tBalWonder', ink: FACE },
    { r: [24, 680, 508, 646], art: 'tBalLeap', ink: FACE },
    { r: [548, 680, 508, 646], art: 'tBalFall', ink: FACE },
  ] },
  2: { panels: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ r: [24 + (i % 3) * 344, 24 + Math.floor(i / 3) * 440, 328, 424], art: 'tBalExpr', o: { i }, ink: FACE })) },
  3: { panels: [
    { r: [24, 24, 1032, 640], art: 'tHanHead', ink: FACE },
    { r: [24, 680, 340, 646], art: 'tHanStand' },
    { r: [380, 680, 340, 646], art: 'tHanRoar', ink: FACE },
    { r: [736, 680, 320, 646], art: 'tHanOld', ink: FACE },
  ] },
  4: { panels: [0, 1, 2, 3, 4, 5].map(i => ({ r: [24 + (i % 2) * 524, 24 + Math.floor(i / 2) * 440, 508, 424], art: 'tGod', o: { i }, ink: FACE })) },
  5: { panels: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ r: [24 + (i % 3) * 344, 24 + Math.floor(i / 3) * 440, 328, 424], art: 'tGodExpr', o: { i }, ink: FACE })) },
  6: { panels: [
    { r: [24, 24, 1032, 640], art: 'tAiravata' },
    { r: [24, 680, 508, 646], art: 'tHanBust', ink: FACE },
    { r: [548, 680, 508, 646], art: 'tVayuChild', ink: FACE },
  ] },
  7: { panels: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ r: [24 + (i % 3) * 344, 24 + Math.floor(i / 3) * 440, 328, 424], art: 'tGod2', o: { i }, ink: FACE })) },
  8: { panels: [0, 1, 2, 3, 4, 5].map(i => ({ r: [24 + (i % 3) * 344, 24 + Math.floor(i / 3) * 660, 328, 644], art: 'tHanFig', o: { i }, ink: FACE })) },
  9: { panels: [
    { r: [24, 24, 1032, 640], art: 'tRavana', ink: FACE },
    ...[0, 1, 2, 3, 4, 5].map(i => ({ r: [24 + (i % 3) * 344, 680 + Math.floor(i / 3) * 331, 328, 315], art: 'tLanka', o: { i }, ink: FACE })),
  ] },
  10: { panels: [0, 1, 2, 3, 4, 5].map(i => ({ r: [24 + (i % 3) * 344, 24 + Math.floor(i / 3) * 660, 328, 644], art: 'tLanka2', o: { i }, ink: FACE })) },
} };
