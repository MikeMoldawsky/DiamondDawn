// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {Certificate} from "./DiamondObjects.sol";

enum RoughShape {
    NO_SHAPE,
    MAKEABLE
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
