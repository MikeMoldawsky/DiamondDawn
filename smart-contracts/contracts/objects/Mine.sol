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

//TODO: 34 bytes, should check if we can save 2 bytes for 1 word.
struct Metadata {
    Type type_; // 1 byte
    RoughMetadata rough; // 4 bytes
    CutMetadata cut; // 3 bytes
    PolishedMetadata polished; // 2 bytes
    RebornMetadata reborn; // 2 bytes
    Certificate certificate; // 22 bytes
}

struct ShapeVideo {
    uint8 shape;
    string video;
}
