const {
  COLOR,
  SHAPE,
  GRADE,
  CLARITY,
  FLUORESCENCE,
} = require("../utils/consts");

const DIAMONDS_51_100 = [
  {
    number: 7391148858,
    date: 1624233600,
    shape: SHAPE.PEAR,
    length: 622,
    width: 406,
    depth: 254,
    points: 40,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1409724012,
    date: 1633737600,
    shape: SHAPE.PEAR,
    length: 679,
    width: 405,
    depth: 240,
    points: 41,
    color: COLOR.L,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 5383550309,
    date: 1620172800,
    shape: SHAPE.PEAR,
    length: 643,
    width: 405,
    depth: 225,
    points: 41,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1447624027,
    date: 1663027200,
    shape: SHAPE.CUSHION,
    length: 475,
    width: 416,
    depth: 287,
    points: 51,
    color: COLOR.L,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
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
    number: 6422524532,
    date: 1646179200,
    shape: SHAPE.CUSHION,
    length: 491,
    width: 396,
    depth: 288,
    points: 50,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6212795266,
    date: 1456272000,
    shape: SHAPE.CUSHION,
    length: 467,
    width: 467,
    depth: 313,
    points: 50,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 3425331768,
    date: 1647475200,
    shape: SHAPE.CUSHION,
    length: 433,
    width: 403,
    depth: 302,
    points: 50,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1423860302,
    date: 1650499200,
    shape: SHAPE.CUSHION,
    length: 428,
    width: 368,
    depth: 286,
    points: 40,
    color: COLOR.Y,
    toColor: COLOR.Z,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2226171001,
    date: 1460332800,
    shape: SHAPE.CUSHION,
    length: 472,
    width: 467,
    depth: 310,
    points: 56,
    color: COLOR.W,
    toColor: COLOR.X,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 1388123790,
    date: 1616544000,
    shape: SHAPE.PEAR,
    length: 633,
    width: 444,
    depth: 329,
    points: 60,
    color: COLOR.L,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2447114286,
    date: 1658448000,
    shape: SHAPE.PEAR,
    length: 727,
    width: 470,
    depth: 281,
    points: 61,
    color: COLOR.L,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.EX,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7423375548,
    date: 1647820800,
    shape: SHAPE.CUSHION,
    length: 521,
    width: 457,
    depth: 318,
    points: 70,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6422318506,
    date: 1646265600,
    shape: SHAPE.OVAL,
    length: 647,
    width: 447,
    depth: 302,
    points: 70,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6251255024,
    date: 1489968000,
    shape: SHAPE.ROUND,
    length: 485,
    width: 489,
    depth: 321,
    points: 50,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VS2,
    cut: GRADE.GOOD,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6221922695,
    date: 1465948800,
    shape: SHAPE.ROUND,
    length: 487,
    width: 492,
    depth: 322,
    points: 50,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VS1,
    cut: GRADE.GOOD,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6441801859,
    date: 1664496000,
    shape: SHAPE.ROUND,
    length: 489,
    width: 497,
    depth: 318,
    points: 50,
    color: COLOR.Q,
    toColor: COLOR.R,
    clarity: CLARITY.VS2,
    cut: GRADE.VG,
    polish: GRADE.EX,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 5443938675,
    date: 1666224000,
    shape: SHAPE.OVAL,
    length: 509,
    width: 399,
    depth: 297,
    points: 49,
    color: COLOR.Y,
    toColor: COLOR.Z,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446938746,
    date: 1666137600,
    shape: SHAPE.OVAL,
    length: 531,
    width: 388,
    depth: 294,
    points: 50,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7446938669,
    date: 1666224000,
    shape: SHAPE.OVAL,
    length: 642,
    width: 457,
    depth: 318,
    points: 64,
    color: COLOR.W,
    toColor: COLOR.X,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6442957957,
    date: 1666224000,
    shape: SHAPE.OVAL,
    length: 593,
    width: 429,
    depth: 258,
    points: 52,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.FAINT,
  },
  {
    number: 6441938743,
    date: 1665878400,
    shape: SHAPE.OVAL,
    length: 740,
    width: 406,
    depth: 258,
    points: 61,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6442938757,
    date: 1666224000,
    shape: SHAPE.PEAR,
    length: 621,
    width: 415,
    depth: 291,
    points: 56,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6441958524,
    date: 1666224000,
    shape: SHAPE.PEAR,
    length: 673,
    width: 412,
    depth: 275,
    points: 57,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446938755,
    date: 1666137600,
    shape: SHAPE.PEAR,
    length: 666,
    width: 437,
    depth: 279,
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
    number: 6445938674,
    date: 1666224000,
    shape: SHAPE.PEAR,
    length: 743,
    width: 480,
    depth: 280,
    points: 62,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2446957939,
    date: 1666569600,
    shape: SHAPE.PEAR,
    length: 736,
    width: 459,
    depth: 272,
    points: 60,
    color: COLOR.W,
    toColor: COLOR.X,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1448938754,
    date: 1665878400,
    shape: SHAPE.PEAR,
    length: 710,
    width: 450,
    depth: 269,
    points: 52,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1443938673,
    date: 1665878400,
    shape: SHAPE.PEAR,
    length: 678,
    width: 465,
    depth: 304,
    points: 61,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS2,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7441964430,
    date: 1666224000,
    shape: SHAPE.CUSHION,
    length: 428,
    width: 423,
    depth: 320,
    points: 53,
    color: COLOR.M,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 6442964367,
    date: 1666569600,
    shape: SHAPE.CUSHION,
    length: 479,
    width: 440,
    depth: 319,
    points: 62,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 5443964402,
    date: 1666569600,
    shape: SHAPE.CUSHION,
    length: 469,
    width: 428,
    depth: 328,
    points: 62,
    color: COLOR.U,
    toColor: COLOR.V,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.VG,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 1449964461,
    date: 1666569600,
    shape: SHAPE.CUSHION,
    length: 447,
    width: 439,
    depth: 303,
    points: 55,
    color: COLOR.Y,
    toColor: COLOR.Z,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 7446964316,
    date: 1666569600,
    shape: SHAPE.CUSHION,
    length: 514,
    width: 466,
    depth: 307,
    points: 64,
    color: COLOR.W,
    toColor: COLOR.X,
    clarity: CLARITY.VS1,
    cut: GRADE.EMPTY,
    polish: GRADE.VG,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 2447964335,
    date: 1666569600,
    shape: SHAPE.CUSHION,
    length: 484,
    width: 436,
    depth: 326,
    points: 66,
    color: COLOR.O,
    toColor: COLOR.P,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 5446964143,
    date: 1666224000,
    shape: SHAPE.PEAR,
    length: 647,
    width: 420,
    depth: 237,
    points: 40,
    color: COLOR.N,
    toColor: COLOR.EMPTY,
    clarity: CLARITY.VVS1,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
  {
    number: 3445964199,
    date: 1666569600,
    shape: SHAPE.PEAR,
    length: 647,
    width: 417,
    depth: 242,
    points: 42,
    color: COLOR.S,
    toColor: COLOR.T,
    clarity: CLARITY.VVS2,
    cut: GRADE.EMPTY,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
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
    clarity: CLARITY.2,
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

module.exports = { DIAMONDS_51_100 };
