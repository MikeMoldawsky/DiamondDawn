// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnPhase {
    function evolve(uint tokenId, uint prevMetadata) external view returns (uint);

    function getMetadata(uint tokenId, uint metadata) external view returns (string memory);

    function lock() external;
}
