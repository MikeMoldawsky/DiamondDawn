// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnMine {

    function mine(uint tokenId) external;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function burn(uint tokenId) external;

    function rebirth(uint tokenId) external;

    function getDiamondMetadata(uint tokenId)
        external
        view
        returns (string memory);

    function isMineReady() external view returns (bool);

    function isCutReady() external view returns (bool);

    function isPolishReady() external view returns (bool);

    function isShipReady() external view returns (bool);
}
