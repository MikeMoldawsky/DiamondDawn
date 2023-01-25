// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnV1 {
    function forge(bytes calldata signature, uint256 quantity) external payable;

    function forgeWithPartner(bytes calldata signature, uint256 quantity) external payable;

    function mine(uint tokenId) external;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function ship(uint tokenId) external;

    function dawn(uint tokenId, bytes calldata signature) external;
}
