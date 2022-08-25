// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/DiamondObjects.sol";
import "../objects/MineObjects.sol";

interface IDiamondDawnMineAdmin {
    function initialize(address diamondDawn) external;

    function diamondEruption(Certificate[] calldata diamonds) external;

    function setTypeVideos(Type type_, ShapeVideo[] calldata shapeVideos)
        external;

    function setIsMineOpen(bool isMineOpen) external;

    function replaceLostShipment(uint tokenId, Certificate calldata diamond)
        external;

    // TODO: delete this function
    function getDiamondCount() external view returns (uint);
}
