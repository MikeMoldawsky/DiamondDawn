// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/DiamondObjects.sol";
import "../objects/MineObjects.sol";

interface IDiamondDawnMineAdmin {
    function initialize(address diamondDawn, uint16 maxDiamond) external;

    function eruption(Certificate[] calldata diamonds) external;

    function lostShipment(uint tokenId, Certificate calldata diamond)
        external;

    function setOpen(bool isOpen) external;

    function setTypeVideos(Type type_, ShapeVideo[] calldata shapeVideos)
        external;

    // TODO: delete this function
    function getDiamondCount() external view returns (uint);
}
