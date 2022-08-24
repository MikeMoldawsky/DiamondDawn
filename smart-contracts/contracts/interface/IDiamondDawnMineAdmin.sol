// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {Certificate} from "../objects/DiamondObjects.sol";

interface IDiamondDawnMineAdmin {
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
