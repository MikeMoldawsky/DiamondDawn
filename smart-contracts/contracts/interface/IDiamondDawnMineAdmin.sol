// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnMineAdmin {
    enum DiamondShape {
        NO_SHAPE,
        PEAR,
        ROUND,
        OVAL,
        RADIANT
    }

    struct DiamondCertificate {
        string clarity;
        string color;
        string cut;
        string fluorescence;
        string measurements;
        uint points;
        string polish;
        uint reportDate;
        uint reportNumber;
        DiamondShape shape;
        string symmetry;
    }

    function initialize(address diamondDawnContract) external;

    function populateDiamonds(DiamondCertificate[] calldata diamonds) external;

    function setIsMineOpen(bool isMineOpen) external;

    function setMineEntranceVideoUrl(string calldata mineEntranceUrl) external;

    function setRoughVideoUrl(string calldata makeable) external;

    function replaceLostShipment(
        uint tokenId,
        DiamondCertificate calldata diamond
    ) external;

    function setCutVideoUrl(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external;

    function setPolishVideoUrl(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external;

    function setRebirthVideoUrls(string calldata rebirth) external;
}
