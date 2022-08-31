// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../objects/DiamondObjects.sol";
import "../objects/MineObjects.sol";
import "../objects/MineObjects.sol";

function toColorString(Color color) pure returns (string memory) {
    if (color == Color.M) return "M";
    if (color == Color.N) return "N";
    if (color == Color.O) return "O";
    if (color == Color.P) return "P";
    if (color == Color.Q) return "Q";
    if (color == Color.R) return "R";
    if (color == Color.S) return "S";
    if (color == Color.T) return "T";
    if (color == Color.U) return "U";
    if (color == Color.V) return "V";
    if (color == Color.W) return "W";
    if (color == Color.X) return "X";
    if (color == Color.Y) return "Y";
    if (color == Color.Z) return "Z";
    revert();
}

function toGradeString(Grade grade) pure returns (string memory) {
    if (grade == Grade.GOOD) return "Good";
    if (grade == Grade.VERY_GOOD) return "Very Good";
    if (grade == Grade.EXCELLENT) return "Excellent";
    revert();
}

function toClarityString(Clarity clarity) pure returns (string memory) {
    if (clarity == Clarity.VS2) return "VS2";
    if (clarity == Clarity.VS1) return "VS1";
    if (clarity == Clarity.VVS2) return "VVS2";
    if (clarity == Clarity.VVS1) return "VVS1";
    if (clarity == Clarity.IF) return "IF";
    if (clarity == Clarity.FL) return "FL";
    revert();
}

function toFluorescenceString(Fluorescence fluorescence) pure returns (string memory) {
    if (fluorescence == Fluorescence.FAINT) return "Faint";
    if (fluorescence == Fluorescence.NONE) return "None";
    revert();
}

function toShapeString(Shape shape) pure returns (string memory) {
    if (shape == Shape.PEAR) return "Pear";
    if (shape == Shape.ROUND) return "Round";
    if (shape == Shape.OVAL) return "Oval";
    if (shape == Shape.RADIANT) return "Radiant";
    revert();
}

function toRoughShapeString(RoughShape shape) pure returns (string memory) {
    if (shape == RoughShape.MAKEABLE_1) return "Makeable 1";
    if (shape == RoughShape.MAKEABLE_2) return "Makeable 2";
    revert();
}

function getName(Metadata memory metadata, uint tokenId) pure returns (string memory) {
    if (metadata.type_ == Type.ENTER_MINE) return string.concat("Mine Entrance #", Strings.toString(tokenId));
    if (metadata.type_ == Type.ROUGH)
        return string.concat("Rough Diamond #", Strings.toString(metadata.rough.id));
    if (metadata.type_ == Type.CUT) return string.concat("Cut Diamond #", Strings.toString(metadata.cut.id));
    if (metadata.type_ == Type.POLISHED)
        return string.concat("Polished Diamond #", Strings.toString(metadata.polished.id));
    if (metadata.type_ == Type.REBORN)
        return string.concat("Diamond Dawn #", Strings.toString(metadata.reborn.id));
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
    if (type_ == Type.ROUGH) return "Rough";
    if (type_ == Type.CUT) return "Cut";
    if (type_ == Type.POLISHED) return "Polished";
    if (type_ == Type.REBORN) return "Reborn";
    revert();
}
