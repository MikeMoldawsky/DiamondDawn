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

module.exports = { DIAMONDS_101_150 };
