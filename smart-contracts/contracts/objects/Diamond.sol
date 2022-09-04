// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

enum Shape {
    NO_SHAPE,
    PEAR,
    ROUND,
    OVAL,
    RADIANT
}

enum Grade {
    NO_GRADE,
    GOOD,
    VERY_GOOD,
    EXCELLENT
}

enum Clarity {
    NO_CLARITY,
    VS2,
    VS1,
    VVS2,
    VVS1,
    IF,
    FL
}

enum Fluorescence {
    NO_FLUORESCENCE,
    FAINT,
    NONE
}

enum Color {
    NO_COLOR,
    M,
    N,
    O,
    P,
    Q,
    R,
    S,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z
}

struct Certificate {
    uint32 date; // TODO: check that all dates fits
    uint32 number; // TODO: check that all dates fits
    uint16 length;
    uint16 width;
    uint16 depth;
    uint8 points;
    Clarity clarity;
    Color color;
    Grade cut;
    Grade symmetry;
    Grade polish;
    Fluorescence fluorescence;
    Shape shape;
}
