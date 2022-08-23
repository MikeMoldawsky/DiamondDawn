// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnMineAdmin {
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
        uint points;
        uint reportDate;
        uint reportNumber;
        string measurements;
        Clarity clarity;
        Color color;
        Grade cut;
        Grade symmetry;
        Grade polish;
        Fluorescence fluorescence;
        Shape shape;
    }

    function initialize(address diamondDawn) external;

    function diamondEruption(Certificate[] calldata diamonds) external;

    function setMineEntranceVideoUrl(string calldata mineEntranceUrl) external;

    function setRoughVideoUrl(string calldata makeable) external;

    function setCutVideoUrls(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external;

    function setPolishVideoUrls(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external;

    function setRebirthVideoUrl(string calldata rebirth) external;

    function setIsMineOpen(bool isMineOpen) external;

    function replaceLostShipment(uint tokenId, Certificate calldata diamond)
        external;

    // TODO: delete this function
    function getDiamondCount() external view returns (uint);
}
