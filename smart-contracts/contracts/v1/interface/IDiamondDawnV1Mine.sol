// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/Mine.sol";
import "../objects/System.sol";

interface IDiamondDawnV1Mine {
    event Forge(uint256 tokenId);
    event Mine(uint256 tokenId);
    event Cut(uint256 tokenId);
    event Polish(uint256 tokenId);
    event Ship(uint256 tokenId, uint16 physicalId, uint64 number);
    event Dawn(uint256 tokenId);

    function initialize(uint16 maxDiamond) external;

    function forge(uint256 tokenId) external;

    function mine(uint256 tokenId) external;

    function cut(uint256 tokenId) external;

    function polish(uint256 tokenId) external;

    function ship(uint256 tokenId) external;

    function dawn(uint256 tokenId) external;

    function lockMine() external;

    function getMetadata(uint256 tokenId) external view returns (string memory);

    function isReady(Stage stage) external view returns (bool);
}
