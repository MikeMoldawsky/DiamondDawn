// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnPhase {
    function initialize() external;

    function getName() external view returns (string memory);

    function canEvolveFrom(IDiamondDawnPhase from) external view returns (bool);

    function evolve(uint tokenId, uint prevAttributes) external view returns (uint);

    function getMetadata(uint tokenId, uint attributes) external view returns (string memory);

    function lock() external;
}
