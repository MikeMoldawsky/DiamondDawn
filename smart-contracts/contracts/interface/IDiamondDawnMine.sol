// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/MineObjects.sol";

interface IDiamondDawnMine {
    function enter(uint tokenId) external;

    function mine(uint tokenId) external;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function ship(uint tokenId) external;

    function rebirth(uint tokenId) external;

    function getMetadata(uint tokenId) external view returns (string memory);

    function isMineReady(Type type_) external view returns (bool);
}
