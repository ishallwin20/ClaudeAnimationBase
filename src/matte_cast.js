// matte_cast.js: the Matte style's characters, as cutRig() definitions over their generated pictures (PICS, from
// src/matte_images.js, made by tools/cutout.mjs). Measure a new one on matte_rig.html. Load after matte.js.
//   KUSH       Maa Kushmanda, eight arms, on her lion (assets/matte/kushmanda_a.png); KUSH_LEGS the walk phases.
//              Drawn at scale .6 she is about 910 px wide and 830 tall; her face is at source (1421, 276).

// the lion's legs and tail, in the source picture's pixels (assets/matte/kushmanda_a.png, 2752 × 1536), measured
// on matte_rig.html. Far legs first: they're drawn in this order behind the body; the tail hangs in front of the hock.
const KUSH = {
  pic: 'kushmanda', anchor: [1420, 1460],
  parts: [
    { name: 'hindFar', poly: [[1078, 1100], [1255, 1100], [1252, 1220], [1240, 1290], [1275, 1340], [1335, 1400], [1335, 1452], [1190, 1452], [1120, 1370], [1095, 1300], [1100, 1240], [1078, 1170]], cut: 1140, pivot: [1165, 1120] },
    { name: 'hindNear', poly: [[826, 1170], [1075, 1170], [1080, 1215], [1040, 1290], [990, 1360], [970, 1482], [800, 1482], [800, 1330], [818, 1250]], cut: 1205, pivot: [930, 1185] },
    { name: 'foreFar', poly: [[1600, 1180], [1700, 1180], [1712, 1300], [1712, 1462], [1575, 1462], [1572, 1330], [1590, 1250], [1597, 1215]], cut: 1215, pivot: [1645, 1200] },
    { name: 'foreNear', poly: [[1702, 1130], [1850, 1100], [1915, 1195], [1960, 1270], [2005, 1350], [2040, 1420], [2040, 1478], [1880, 1478], [1830, 1420], [1770, 1345], [1730, 1290], [1710, 1230]], cut: 1210, pivot: [1790, 1150] },
    { name: 'tail', z: 1, poly: [[862, 925], [915, 925], [897, 1048], [878, 1122], [854, 1195], [828, 1240], [792, 1290], [762, 1322], [762, 1385], [600, 1385], [600, 1278], [718, 1268], [788, 1212], [818, 1110], [842, 1000]], pivot: [885, 945] },
  ],
};
// each leg's phase in the walk at t = 0, matching the painting (the near hind and far fore back, the other two forward)
const KUSH_LEGS = { hindNear: .45, foreFar: .3, hindFar: .95, foreNear: 0 };

