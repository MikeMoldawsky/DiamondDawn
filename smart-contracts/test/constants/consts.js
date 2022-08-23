const enumToType = (i) => {
  switch (i) {
    case 1:
      return "Mine Entrance";
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
      return "Makeable";
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
      return "Radiant";
    default:
      throw new Error("No shape");
  }
};

const enumToColor = (i) => {
  switch (i) {
    case 1:
      return "M";
    case 2:
      return "N";
    case 3:
      return "O";
    case 4:
      return "P";
    case 5:
      return "Q";
    case 6:
      return "R";
    case 7:
      return "S";
    case 8:
      return "T";
    case 9:
      return "U";
    case 10:
      return "V";
    case 11:
      return "W";
    case 12:
      return "X";
    case 13:
      return "Y";
    case 14:
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

module.exports = {
  enumToType,
  enumToRoughShape,
  enumToShape,
  enumToColor,
  enumToClarity,
  enumToGrade,
  enumToFluorescence,
};