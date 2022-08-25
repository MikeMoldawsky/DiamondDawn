// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/DiamondObjects.sol";
import "../objects/MineObjects.sol";

interface IDiamondDawnMineAdmin {
    function initialize(address diamondDawn) external;

    function diamondEruption(Certificate[] calldata diamonds) external;

    function setMineEntranceVideo(string calldata mineEntrance) external;

    function setRoughVideo(string calldata makeable) external;

    function setCutVideos(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external;

    function setPolishVideos(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external;

    function setRebirthVideo(string calldata rebirth) external;

    function setTypeVideos(Type type_, ShapeVideo[] calldata shapeVideos) external;

    function setIsMineOpen(bool isMineOpen) external;

    function replaceLostShipment(uint tokenId, Certificate calldata diamond)
        external;

    // TODO: delete this function
    function getDiamondCount() external view returns (uint);
}
