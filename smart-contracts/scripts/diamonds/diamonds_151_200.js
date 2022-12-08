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
    clarity: CLARITY.
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
    clarity: CLARITY.1,
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
    clarity: CLARITY.1,
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
    clarity: CLARITY.2,
    cut: GRADE.EMPTY,
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
