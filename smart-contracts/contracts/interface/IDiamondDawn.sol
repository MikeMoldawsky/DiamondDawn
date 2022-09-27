// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawn {
    function enter(bytes calldata signature) external payable;

    function enterWedding(bytes calldata signature) external payable;

    function mine(uint tokenId) external;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function ship(uint tokenId) external;

    function rebirth(uint tokenId) external;
}
