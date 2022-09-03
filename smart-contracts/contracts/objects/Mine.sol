// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./Diamond.sol";

enum RoughShape {
    NO_SHAPE,
    MAKEABLE_1,
    MAKEABLE_2
}

struct RoughMetadata {
    uint16 id;
    uint8 extraPoints;
    RoughShape shape;
}

struct CutMetadata {
    uint16 id;
    uint8 extraPoints;
}

struct PolishedMetadata {
    uint16 id;
}

struct RebornMetadata {
    uint16 id;
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
    PolishedMetadata polished;
    RebornMetadata reborn;
    Certificate certificate;
}

struct ShapeVideo {
    uint8 shape;
    string video;
}
