const enumToType = (i) => {
  switch (i) {
    case 1:
      return "Key";
    case 2:
      return "Rough";
    case 3:
      return "Cut";
    case 4:
      return "Polished";
    case 5:
      return "Reborn";
    default:
      throw new Error("No type");
  }
};

const enumToRoughShape = (i) => {
  switch (i) {
    case 1:
      return "Makeable 1";
    case 2:
      return "Makeable 2";
    default:
      throw new Error("No rough shape");
  }
};

const enumToShape = (i) => {
  switch (i) {
    case 1:
      return "Pear";
    case 2:
      return "Round";
    case 3:
      return "Oval";
    case 4:
      return "Cushion";
    default:
      throw new Error("No shape");
  }
};

const enumToColor = (i) => {
  switch (i) {
    case 1:
      return "K";
    case 2:
      return "L";
    case 3:
      return "M";
    case 4:
      return "N";
    case 5:
      return "O";
    case 6:
      return "P";
    case 7:
      return "Q";
    case 8:
      return "R";
    case 9:
      return "S";
    case 10:
      return "T";
    case 11:
      return "U";
    case 12:
      return "V";
    case 13:
      return "W";
    case 14:
      return "X";
    case 15:
      return "Y";
    case 16:
      return "Z";
    default:
      throw new Error("No color");
  }
};

const enumToClarity = (i) => {
  switch (i) {
    case 1:
      return "VS2";
    case 2:
      return "VS1";
    case 3:
      return "VVS2";
    case 4:
      return "VVS1";
    case 5:
      return "IF";
    case 6:
      return "FL";
    default:
      throw new Error("No Clarity");
  }
};
const enumToGrade = (i) => {
  switch (i) {
    case 1:
      return "Good";
    case 2:
      return "Very Good";
    case 3:
      return "Excellent";
    default:
      throw new Error("No grade");
  }
};

const enumToFluorescence = (i) => {
  switch (i) {
    case 1:
      return "Faint";
    case 2:
      return "None";
    default:
      throw new Error("No fluorescence");
  }
};

const STAGE = {
  NO_STAGE: 0,
  KEY: 1,
  MINE: 2,
  CUT: 3,
  POLISH: 4,
  DAWN: 5,
};

module.exports = {
  enumToType,
  enumToRoughShape,
  enumToShape,
  enumToColor,
  enumToClarity,
  enumToGrade,
  enumToFluorescence,
  STAGE,
};
