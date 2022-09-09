// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/Diamond.sol";
import "../objects/Mine.sol";
import "../objects/System.sol";

interface IDiamondDawnMineAdmin {
    function eruption(Certificate[] calldata diamonds) external;

    function lockMine() external;

    function lostShipment(uint tokenId, Certificate calldata diamond) external;

    function setOpen(bool isOpen) external;

    function setStageVideos(Stage stage_, ShapeVideo[] calldata shapeVideos) external;
}
