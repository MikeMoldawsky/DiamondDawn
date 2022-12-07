const {
  COLOR,
  SHAPE,
  GRADE,
  CLARITY,
  FLUORESCENCE,
} = require("../utils/consts");

const DIAMONDS_101_150 = [
  {
    number: 6441728656,
    date: 1665014400,
    shape: SHAPE.CUSHION,
    length: 493,
    width: 483,
    depth: 333,
    points: 76,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6445728727,
    date: 1664755200,
    shape: SHAPE.CUSHION,
    length: 480,
    width: 465,
    depth: 338,
    points: 74,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1443727970,
    date: 1665014400,
    shape: SHAPE.CUSHION,
    length: 476,
    width: 472,
    depth: 332,
    points: 70,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6442728707,
    date: 1665014400,
    shape: SHAPE.CUSHION,
    length: 471,
    width: 443,
    depth: 354,
    points: 70,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6442727992,
    date: 1665014400,
    shape: SHAPE.CUSHION,
    length: 507,
    width: 488,
    depth: 319,
    points: 74,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2446727932,
    date: 1664323200,
    shape: SHAPE.CUSHION,
    length: 473,
    width: 458,
    depth: 319,
    points: 64,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1449765550,
    date: 1665014400,
    shape: SHAPE.OVAL,
    length: 500,
    width: 370,
    depth: 272,
    points: 41,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7442763908,
    date: 1664755200,
    shape: SHAPE.OVAL,
    length: 541,
    width: 368,
    depth: 265,
    points: 43,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 7441763906,
    date: 1664323200,
    shape: SHAPE.OVAL,
    length: 508,
    width: 369,
    depth: 270,
    points: 42,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1448728562,
    date: 1665014400,
    shape: SHAPE.OVAL,
    length: 495,
    width: 352,
    depth: 268,
    points: 40,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 5186865601,
    date: 1418688000,
    shape: SHAPE.ROUND,
    length: 472,
    width: 475,
    depth: 287,
    points: 40,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS1,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446728599,
    date: 1665014400,
    shape: SHAPE.OVAL,
    length: 477,
    width: 354,
    depth: 278,
    points: 40,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6445728579,
    date: 1665014400,
    shape: SHAPE.OVAL,
    length: 494,
    width: 361,
    depth: 272,
    points: 42,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1443875980,
    date: 1665014400,
    shape: SHAPE.ROUND,
    length: 526,
    width: 530,
    depth: 324,
    points: 56,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446875999,
    date: 1665014400,
    shape: SHAPE.ROUND,
    length: 505,
    width: 508,
    depth: 320,
    points: 51,
    color: COLOR.L,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 7441875972,
    date: 1665014400,
    shape: SHAPE.ROUND,
    length: 499,
    width: 503,
    depth: 319,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1443875993,
    date: 1665014400,
    shape: SHAPE.ROUND,
    length: 481,
    width: 486,
    depth: 307,
    points: 45,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6441875975,
    date: 1665014400,
    shape: SHAPE.ROUND,
    length: 489,
    width: 491,
    depth: 305,
    points: 45,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6442875971,
    date: 1665273600,
    shape: SHAPE.ROUND,
    length: 474,
    width: 476,
    depth: 296,
    points: 42,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VVS2,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2444977030,
    date: 1666915200,
    shape: SHAPE.CUSHION,
    length: 436,
    width: 367,
    depth: 268,
    points: 40,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 7438719439,
    date: 1655251200,
    shape: SHAPE.ROUND,
    length: 467,
    width: 469,
    depth: 292,
    points: 40,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS1,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2426897976,
    date: 1648771200,
    shape: SHAPE.ROUND,
    length: 453,
    width: 459,
    depth: 296,
    points: 40,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.GOOD,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446110887,
    date: 1659657600,
    shape: SHAPE.ROUND,
    length: 457,
    width: 462,
    depth: 297,
    points: 40,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1445709757,
    date: 1663545600,
    shape: SHAPE.ROUND,
    length: 456,
    width: 462,
    depth: 296,
    points: 40,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7418782360,
    date: 1640304000,
    shape: SHAPE.ROUND,
    length: 456,
    width: 459,
    depth: 297,
    points: 40,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 3405619860,
    date: 1635206400,
    shape: SHAPE.ROUND,
    length: 460,
    width: 466,
    depth: 297,
    points: 40,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6442563830,
    date: 1663027200,
    shape: SHAPE.ROUND,
    length: 451,
    width: 462,
    depth: 296,
    points: 40,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446542837,
    date: 1662076800,
    shape: SHAPE.ROUND,
    length: 455,
    width: 461,
    depth: 295,
    points: 40,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1267247837,
    date: 1499212800,
    shape: SHAPE.ROUND,
    length: 460,
    width: 462,
    depth: 303,
    points: 40,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.GOOD,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2161735403,
    date: 1415318400,
    shape: SHAPE.ROUND,
    length: 457,
    width: 465,
    depth: 297,
    points: 40,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 5186795585,
    date: 1417737600,
    shape: SHAPE.ROUND,
    length: 469,
    width: 471,
    depth: 294,
    points: 40,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1449542897,
    date: 1662076800,
    shape: SHAPE.ROUND,
    length: 447,
    width: 452,
    depth: 297,
    points: 40,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
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
    number: 6222822561,
    date: 1465171200,
    shape: SHAPE.ROUND,
    length: 486,
    width: 488,
    depth: 304,
    points: 44,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1303238378,
    date: 1534550400,
    shape: SHAPE.ROUND,
    length: 495,
    width: 499,
    depth: 319,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 3445736759,
    date: 1663632000,
    shape: SHAPE.ROUND,
    length: 497,
    width: 505,
    depth: 309,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2447355234,
    date: 1661126400,
    shape: SHAPE.ROUND,
    length: 491,
    width: 498,
    depth: 317,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2426091587,
    date: 1643846400,
    shape: SHAPE.ROUND,
    length: 494,
    width: 497,
    depth: 321,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.VG,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2447356424,
    date: 1660608000,
    shape: SHAPE.ROUND,
    length: 478,
    width: 485,
    depth: 319,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.GOOD,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1447709450,
    date: 1663545600,
    shape: SHAPE.ROUND,
    length: 491,
    width: 499,
    depth: 320,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 2436352341,
    date: 1652313600,
    shape: SHAPE.ROUND,
    length: 515,
    width: 518,
    depth: 310,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 5446415517,
    date: 1660867200,
    shape: SHAPE.ROUND,
    length: 478,
    width: 489,
    depth: 321,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.EX,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6431518615,
    date: 1653436800,
    shape: SHAPE.ROUND,
    length: 493,
    width: 498,
    depth: 321,
    points: 50,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VS1,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1379403819,
    date: 1611532800,
    shape: SHAPE.ROUND,
    length: 504,
    width: 507,
    depth: 317,
    points: 50,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6371055329,
    date: 1610928000,
    shape: SHAPE.ROUND,
    length: 507,
    width: 509,
    depth: 319,
    points: 51,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2436514040,
    date: 1653436800,
    shape: SHAPE.ROUND,
    length: 510,
    width: 513,
    depth: 319,
    points: 51,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6431514603,
    date: 1653436800,
    shape: SHAPE.ROUND,
    length: 509,
    width: 512,
    depth: 320,
    points: 51,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VVS2,
    cut: GRADE.EX,
    polish: GRADE.EX,
    symmetry: GRADE.EX,
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

module.exports = { DIAMONDS_101_150 };
