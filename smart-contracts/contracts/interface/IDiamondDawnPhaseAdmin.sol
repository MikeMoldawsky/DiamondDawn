// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnPhase {
    function initialize() external;

    function evolve(uint tokenId) external;

    function canEvolve(string memory phaseName) external view returns (bool);

    function getMetadata(uint tokenId) external view returns (string memory);

    function getAttributes(uint tokenId) external view returns (uint);

    function isReady() external view returns (bool);

    function lock() external;
}
