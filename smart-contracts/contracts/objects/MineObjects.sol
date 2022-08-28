// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./DiamondObjects.sol";

enum RoughShape {
    NO_SHAPE,
    MAKEABLE_1,
    MAKEABLE_2
}

struct RoughMetadata {
    RoughShape shape;
    uint extraPoints;
}

struct CutMetadata {
    uint extraPoints;
}

enum Type {
    NO_TYPE,
    ENTER_MINE,
    ROUGH,
    CUT,
    POLISHED,
    REBORN
}

struct Metadata {
    Type type_;
    RoughMetadata rough;
    CutMetadata cut;
    Certificate certificate;
}

struct ShapeVideo {
    uint8 shape;
    string video;
}
