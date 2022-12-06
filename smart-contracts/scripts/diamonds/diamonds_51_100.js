const {
  COLOR,
  SHAPE,
  GRADE,
  CLARITY,
  FLUORESCENCE,
} = require("../utils/consts");

const DIAMONDS_51_100 = [
  {
    number: 6411591331,
    date: 1639440000,
    shape: SHAPE.ROUND,
    length: 509,
    width: 513,
    depth: 319,
    points: 51,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1417167605,
    date: 1638921600,
    shape: SHAPE.ROUND,
    length: 506,
    width: 510,
    depth: 311,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2416326390,
    date: 1638921600,
    shape: SHAPE.ROUND,
    length: 494,
    width: 499,
    depth: 315,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2416598549,
    date: 1639180800,
    shape: SHAPE.ROUND,
    length: 495,
    width: 498,
    depth: 321,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1413166478,
    date: 1638921600,
    shape: SHAPE.ROUND,
    length: 509,
    width: 512,
    depth: 310,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7436491958,
    date: 1653955200,
    shape: SHAPE.ROUND,
    length: 497,
    width: 499,
    depth: 313,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1419170237,
    date: 1638921600,
    shape: SHAPE.ROUND,
    length: 516,
    width: 519,
    depth: 313,
    points: 51,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1393337592,
    date: 1628467200,
    shape: SHAPE.ROUND,
    length: 527,
    width: 530,
    depth: 334,
    points: 57,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.GOOD,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 7402470932,
    date: 1634688000,
    shape: SHAPE.ROUND,
    length: 495,
    width: 498,
    depth: 321,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7432807603,
    date: 1656028800,
    shape: SHAPE.ROUND,
    length: 491,
    width: 499,
    depth: 317,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6445025734,
    date: 1657670400,
    shape: SHAPE.ROUND,
    length: 508,
    width: 511,
    depth: 318,
    points: 51,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6445459818,
    date: 1661299200,
    shape: SHAPE.ROUND,
    length: 485,
    width: 491,
    depth: 324,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.EX,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1438956424,
    date: 1657670400,
    shape: SHAPE.ROUND,
    length: 482,
    width: 486,
    depth: 322,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6415139424,
    date: 1637107200,
    shape: SHAPE.ROUND,
    length: 481,
    width: 489,
    depth: 323,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2346302919,
    date: 1576454400,
    shape: SHAPE.ROUND,
    length: 484,
    width: 494,
    depth: 326,
    points: 50,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.EX,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 7228631610,
    date: 1463011200,
    shape: SHAPE.ROUND,
    length: 490,
    width: 498,
    depth: 319,
    points: 50,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6421617363,
    date: 1646870400,
    shape: SHAPE.CUSHION,
    length: 450,
    width: 447,
    depth: 309,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6422763074,
    date: 1649894400,
    shape: SHAPE.OVAL,
    length: 536,
    width: 404,
    depth: 281,
    points: 50,
    color: COLOR.W,
    toColor: COLOR.X,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 5423477663,
    date: 1647907200,
    shape: SHAPE.CUSHION,
    length: 467,
    width: 444,
    depth: 307,
    points: 51,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 5172121035,
    date: 1429747200,
    shape: SHAPE.OVAL,
    length: 624,
    width: 480,
    depth: 301,
    points: 56,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2436868497,
    date: 1656633600,
    shape: SHAPE.OVAL,
    length: 647,
    width: 439,
    depth: 278,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: ,
    date: ,
    shape: SHAPE.ROUND,
    length: ,
    width: ,
    depth: ,
    points: ,
    color: COLOR.,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.,
    cut: GRADE.,
    polish: GRADE.,
    symmetry: GRADE.,
    fluorescence: FLUORESCENCE.,
  },
  {
    number: 6432896923,
    date: 1657670400,
    shape: SHAPE.PEAR,
    length: 756,
    width: 413,
    depth: 264,
    points: 51,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2434506022,
    date: 1654732800,
    shape: SHAPE.CUSHION,
    length: 512,
    width: 460,
    depth: 321,
    points: 55,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6362349697,
    date: 1604448000,
    shape: SHAPE.PEAR,
    length: 647,
    width: 437,
    depth: 300,
    points: 50,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6415450691,
    date: 1654473600,
    shape: SHAPE.CUSHION,
    length: 449,
    width: 442,
    depth: 307,
    points: 50,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 3385200235,
    date: 1617148800,
    shape: SHAPE.OVAL,
    length: 610,
    width: 445,
    depth: 285,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 7398759356,
    date: 1628035200,
    shape: SHAPE.CUSHION,
    length: 443,
    width: 442,
    depth: 308,
    points: 51,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6445728492,
    date: 1665014400,
    shape: SHAPE.PEAR,
    length: 711,
    width: 445,
    depth: 268,
    points: 60,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2444728311,
    date: 1664755200,
    shape: SHAPE.PEAR,
    length: 607,
    width: 406,
    depth: 274,
    points: 50,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7443728628,
    date: 1664755200,
    shape: SHAPE.PEAR,
    length: 598,
    width: 396,
    depth: 276,
    points: 51,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446728358,
    date: 1665014400,
    shape: SHAPE.PEAR,
    length: 672,
    width: 417,
    depth: 286,
    points: 61,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6445728610,
    date: 1665014400,
    shape: SHAPE.PEAR,
    length: 623,
    width: 400,
    depth: 299,
    points: 60,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 5446728366,
    date: 1665014400,
    shape: SHAPE.PEAR,
    length: 580,
    width: 366,
    depth: 255,
    points: 41,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6445728601,
    date: 1664755200,
    shape: SHAPE.PEAR,
    length: 571,
    width: 375,
    depth: 263,
    points: 43,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1448728398,
    date: 1665014400,
    shape: SHAPE.PEAR,
    length: 566,
    width: 370,
    depth: 269,
    points: 44,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6441728564,
    date: 1664755200,
    shape: SHAPE.PEAR,
    length: 632,
    width: 423,
    depth: 283,
    points: 57,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6442763907,
    date: 1665014400,
    shape: SHAPE.OVAL,
    length: 553,
    width: 378,
    depth: 257,
    points: 43,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2448765475,
    date: 1664323200,
    shape: SHAPE.OVAL,
    length: 593,
    width: 424,
    depth: 274,
    points: 51,
    color: COLOR.K,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 5446727128,
    date: 1665014400,
    shape: SHAPE.OVAL,
    length: 559,
    width: 408,
    depth: 276,
    points: 52,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6147328908,
    date: 1327449600,
    shape: SHAPE.ROUND,
    length: 462,
    width: 464,
    depth: 295,
    points: 40,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 7441727262,
    date: 1665014400,
    shape: SHAPE.OVAL,
    length: 575,
    width: 425,
    depth: 278,
    points: 52,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2448762448,
    date: 1664755200,
    shape: SHAPE.OVAL,
    length: 531,
    width: 389,
    depth: 290,
    points: 50,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 3445727074,
    date: 1664668800,
    shape: SHAPE.OVAL,
    length: 582,
    width: 437,
    depth: 307,
    points: 66,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6442728125,
    date: 1665014400,
    shape: SHAPE.CUSHION,
    length: 455,
    width: 393,
    depth: 309,
    points: 54,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6441728160,
    date: 1665014400,
    shape: SHAPE.CUSHION,
    length: 444,
    width: 426,
    depth: 318,
    points: 58,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 3445727996,
    date: 1664668800,
    shape: SHAPE.CUSHION,
    length: 436,
    width: 412,
    depth: 314,
    points: 53,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7441727973,
    date: 1665014400,
    shape: SHAPE.CUSHION,
    length: 448,
    width: 423,
    depth: 321,
    points: 57,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: ,
    date: ,
    shape: SHAPE.ROUND,
    length: ,
    width: ,
    depth: ,
    points: ,
    color: COLOR.,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.,
    cut: GRADE.,
    polish: GRADE.,
    symmetry: GRADE.,
    fluorescence: FLUORESCENCE.,
  },
  {
    number: ,
    date: ,
    shape: SHAPE.ROUND,
    length: ,
    width: ,
    depth: ,
    points: ,
    color: COLOR.,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.,
    cut: GRADE.,
    polish: GRADE.,
    symmetry: GRADE.,
    fluorescence: FLUORESCENCE.,
  },
];

module.exports = { DIAMONDS_51_100 };
