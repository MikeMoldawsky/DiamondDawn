// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnV1 {
    function forge(bytes calldata signature, uint256 quantity) external payable;

    function forgeWithPartner(bytes calldata signature, uint256 quantity) external payable;

    function mine(uint256 tokenId) external;

    function cut(uint256 tokenId) external;

    function polish(uint256 tokenId) external;

    function ship(uint256 tokenId) external;

    function dawn(uint256 tokenId, bytes calldata signature) external;
}
