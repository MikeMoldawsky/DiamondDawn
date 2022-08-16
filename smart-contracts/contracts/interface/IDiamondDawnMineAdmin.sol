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
        uint points;
        string clarity;
        string color;
        string cut;
        string depth;
        string fluorescence;
        string length;
        string polish;
        uint reportDate;
        uint reportNumber;
        DiamondShape shape;
        string symmetry;
        string width;
    }

    function initialize(address diamondDawnContract) external;

    function populateDiamonds(DiamondCertificate[] calldata diamonds) external;

    function setIsMineOpen(bool isMineOpen) external;

    function setMineEntranceVideoUrl(string calldata mineEntranceUrl) external;

    function setRoughVideoUrl(string calldata roughUrl) external;

    function replaceLostShipment(
        uint tokenId,
        DiamondCertificate calldata diamond
    ) external;

    function setCutVideoUrl(
        string calldata pearUrl,
        string calldata roundUrl,
        string calldata ovalUrl,
        string calldata radiantUrl
    ) external;

    function setPolishVideoUrl(
        string calldata pearUrl,
        string calldata roundUrl,
        string calldata ovalUrl,
        string calldata radiantUrl
    ) external;

    function setShipVideoUrls(
        string calldata burnUrl,
        string calldata rebirthUrl
    ) external;
}
