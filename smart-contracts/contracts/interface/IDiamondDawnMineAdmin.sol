// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../DiamondDawnMine.sol";

interface IDiamondDawnMineAdmin {
    enum DiamondShape {
        PEAR,
        ROUND,
        OVAL,
        RADIANT
    }

    struct PolishedDiamondCertificate {
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

    function setRoughVideoUrl(string calldata roughUrl) external;

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

    function setBurnVideoUrl(string calldata burnUrl) external;

    function setRebirthVideoUrl(string calldata rebirthUrl) external;

    function populateDiamonds(PolishedDiamondCertificate[] memory diamonds)
        external;
}
