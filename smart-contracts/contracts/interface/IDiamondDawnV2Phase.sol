// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnV2Phase {
    function initialize() external;

    function getName() external view returns (string memory);

    function canEvolveFrom(IDiamondDawnV2Phase from) external view returns (bool);

    function evolve(uint tokenId, bytes calldata prevAttributes) external view returns (bytes calldata);

    function getMetadata(uint tokenId, bytes memory attributes) external view returns (string memory);

    function lock() external;
}
