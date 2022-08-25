// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawn {
    event Enter(uint tokenId);
    event Mine(uint tokenId);
    event Cut(uint tokenId);
    event Polish(uint tokenId);
    event Ship(uint tokenId);
    event Rebirth(uint tokenId);

    function enter(string calldata password) external payable;

    function mine(uint tokenId) external;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function ship(uint tokenId) external;

    function rebirth(uint tokenId) external;

    function getTokenIdsByOwner(address owner)
        external
        view
        returns (uint[] memory);

    // TODO: check with Asaf if we need this function
    function getShippingTokenIds(address owner)
        external
        view
        returns (uint[] memory);
}
