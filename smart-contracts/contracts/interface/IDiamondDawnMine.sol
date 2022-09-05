// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/Mine.sol";
import "../objects/System.sol";

interface IDiamondDawnMine {
    event Enter(uint tokenId);
    event Mine(uint tokenId);
    event Cut(uint tokenId);
    event Polish(uint tokenId);
    event Ship(uint tokenId);
    event Rebirth(uint tokenId);

    function initialize(address diamondDawn, uint16 maxDiamond) external;

    function enter(uint tokenId) external;

    function mine(uint tokenId) external;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function ship(uint tokenId) external;

    function rebirth(uint tokenId) external;

    function getMetadata(uint tokenId) external view returns (string memory);

    function isReady(Stage stage) external view returns (bool);
}
