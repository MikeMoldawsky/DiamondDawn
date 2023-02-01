// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnPhase {
    function initialize() external;

    function getName() external view returns (string memory);

    function canEvolveFrom(IDiamondDawnPhase from) external view returns (bool);

    function evolve(uint256 tokenId, bytes calldata prevAttributes) external view returns (bytes calldata);

    function getMetadata(uint256 tokenId, bytes memory attributes) external view returns (string memory);

    function lock() external;
}
