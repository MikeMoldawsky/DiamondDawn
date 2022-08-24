// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../objects/DiamondObjects.sol";
import "../objects/MineObjects.sol";

function toColorString(Color color) pure returns (string memory) {
    if (color == Color.M) return "M";
    else if (color == Color.N) return "N";
    else if (color == Color.O) return "O";
    else if (color == Color.P) return "P";
    else if (color == Color.Q) return "Q";
    else if (color == Color.R) return "R";
    else if (color == Color.S) return "S";
    else if (color == Color.T) return "T";
    else if (color == Color.U) return "U";
    else if (color == Color.V) return "V";
    else if (color == Color.W) return "W";
    else if (color == Color.X) return "X";
    else if (color == Color.Y) return "Y";
    else if (color == Color.Z) return "Z";
    revert();
}

function toGradeString(Grade grade) pure returns (string memory) {
    if (grade == Grade.GOOD) return "Good";
    else if (grade == Grade.VERY_GOOD) return "Very Good";
    else if (grade == Grade.EXCELLENT) return "Excellent";
    revert();
}

function toClarityString(Clarity clarity) pure returns (string memory) {
    if (clarity == Clarity.VS2) return "VS2";
    else if (clarity == Clarity.VS1) return "VS1";
    else if (clarity == Clarity.VVS2) return "VVS2";
    else if (clarity == Clarity.VVS1) return "VVS1";
    else if (clarity == Clarity.IF) return "IF";
    else if (clarity == Clarity.FL) return "FL";
    revert();
}

function toFluorescenceString(Fluorescence fluorescence)
    pure
    returns (string memory)
{
    if (fluorescence == Fluorescence.FAINT) return "Faint";
    else if (fluorescence == Fluorescence.NONE) return "None";
    revert();
}

function toShapeString(Shape shape) pure returns (string memory) {
    if (shape == Shape.PEAR) return "Pear";
    else if (shape == Shape.ROUND) return "Round";
    else if (shape == Shape.OVAL) return "Oval";
    else if (shape == Shape.RADIANT) return "Radiant";
    revert();
}

function toRoughShapeString(RoughShape shape) pure returns (string memory) {
    if (shape == RoughShape.MAKEABLE) return "Makeable";
    revert();
}

function getCaratString(uint points) pure returns (string memory) {
    uint remainder = points % 100;
    string memory caratRemainder = remainder < 10
        ? string.concat("0", Strings.toString(remainder))
        : Strings.toString(remainder);
    string memory carat = Strings.toString(points / 100);
    return string.concat(carat, ".", caratRemainder);
}

function toTypeString(Type type_) pure returns (string memory) {
    if (type_ == Type.ENTER_MINE) return "Mine Entrance";
    else if (type_ == Type.ROUGH) return "Rough";
    else if (type_ == Type.CUT) return "Cut";
    else if (type_ == Type.POLISHED) return "Polished";
    else if (type_ == Type.REBORN) return "Reborn";
    revert();
}
