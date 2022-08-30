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
    uint8 extraPoints;
}

struct CutMetadata {
    uint8 extraPoints;
}

struct RebornMetadata {
    uint16 physicalId;
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
    RebornMetadata reborn;
    Certificate certificate;
}

struct ShapeVideo {
    uint8 shape;
    string video;
}
