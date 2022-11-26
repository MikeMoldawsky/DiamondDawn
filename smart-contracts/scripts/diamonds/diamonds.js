const { SHAPE, COLOR, CLARITY, GRADE, FLUORESCENCE } = require("./consts");
const DIAMONDS_1 = [
  {
    number: 1111111111,
    date: 1659254421,
    points: 55,
    length: 512,
    width: 512,
    depth: 350,
    shape: SHAPE.PEAR,
    color: COLOR.M,
    toColor: COLOR.X,
    clarity: CLARITY,
    cut: GRADE.EXCELLENT,
    polish: GRADE.GOOD,
    symmetry: GRADE.GOOD,
    fluorescence: FLUORESCENCE.NONE,
  },
];

module.exports = { DIAMONDS_1 };
