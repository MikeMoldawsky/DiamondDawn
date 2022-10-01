// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/Diamond.sol";
import "../objects/Mine.sol";
import "../objects/System.sol";

interface IDiamondDawnMineAdmin {
    function eruption(Certificate[] calldata diamonds) external;

    function lostShipment(uint tokenId, Certificate calldata diamond) external;

    function setStageVideos(Stage stage_, ShapeVideo[] calldata shapeVideos) external;

    function setBaseTokenURI(string calldata baseTokenURI) external;
}
