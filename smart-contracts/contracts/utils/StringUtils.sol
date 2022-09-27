// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../objects/Diamond.sol";
import "../objects/Mine.sol";
import "../objects/Mine.sol";

function toColorStr(Color color) pure returns (string memory) {
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

function toGradeStr(Grade grade) pure returns (string memory) {
    if (grade == Grade.GOOD) return "Good";
    if (grade == Grade.VERY_GOOD) return "Very Good";
    if (grade == Grade.EXCELLENT) return "Excellent";
    revert();
}

function toClarityStr(Clarity clarity) pure returns (string memory) {
    if (clarity == Clarity.VS2) return "VS2";
    if (clarity == Clarity.VS1) return "VS1";
    if (clarity == Clarity.VVS2) return "VVS2";
    if (clarity == Clarity.VVS1) return "VVS1";
    if (clarity == Clarity.IF) return "IF";
    if (clarity == Clarity.FL) return "FL";
    revert();
}

function toFluorescenceStr(Fluorescence fluorescence) pure returns (string memory) {
    if (fluorescence == Fluorescence.FAINT) return "Faint";
    if (fluorescence == Fluorescence.NONE) return "None";
    revert();
}

function toMeasurementsStr(
    Shape shape,
    uint16 length,
    uint16 width,
    uint16 depth
) pure returns (string memory) {
    string memory separator = shape == Shape.ROUND ? " - " : " x ";
    return string.concat(toDecimalStr(length), separator, toDecimalStr(width), " x ", toDecimalStr(depth));
}

function toShapeStr(Shape shape) pure returns (string memory) {
    if (shape == Shape.PEAR) return "Pear";
    if (shape == Shape.ROUND) return "Round";
    if (shape == Shape.OVAL) return "Oval";
    if (shape == Shape.RADIANT) return "Radiant";
    revert();
}

function toRoughShapeStr(RoughShape shape) pure returns (string memory) {
    if (shape == RoughShape.MAKEABLE_1) return "Makeable 1";
    if (shape == RoughShape.MAKEABLE_2) return "Makeable 2";
    revert();
}

function getName(Metadata memory metadata, uint tokenId) pure returns (string memory) {
    if (metadata.state_ == Stage.INVITE) return string.concat("Mine Entrance #", Strings.toString(tokenId));
    if (metadata.state_ == Stage.MINE)
        return string.concat("Rough Diamond #", Strings.toString(metadata.rough.id));
    if (metadata.state_ == Stage.CUT)
        return string.concat("Cut Diamond #", Strings.toString(metadata.cut.id));
    if (metadata.state_ == Stage.POLISH)
        return string.concat("Polished Diamond #", Strings.toString(metadata.polished.id));
    if (metadata.state_ == Stage.SHIP)
        return string.concat("Diamond Dawn #", Strings.toString(metadata.reborn.id));
    revert();
}

function toDecimalStr(uint percentage) pure returns (string memory) {
    uint remainder = percentage % 100;
    string memory quotient = Strings.toString(percentage / 100);
    if (remainder < 10) return string.concat(quotient, ".0", Strings.toString(remainder));
    return string.concat(quotient, ".", Strings.toString(remainder));
}

function toTypeStr(Stage state_) pure returns (string memory) {
    if (state_ == Stage.INVITE) return "Mine Entrance";
    if (state_ == Stage.MINE) return "Rough";
    if (state_ == Stage.CUT) return "Cut";
    if (state_ == Stage.POLISH) return "Polished";
    if (state_ == Stage.SHIP) return "Reborn";
    revert();
}
