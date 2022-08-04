// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../DiamondDawnMine.sol";

interface IDiamondDawnMineAdmin {
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

    function populateDiamonds(PolishedDiamondCertificate[] memory diamonds) external;
}
