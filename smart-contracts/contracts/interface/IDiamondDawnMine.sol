// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnMine {
    function lockMine() external;

    function enterMine(uint tokenId) external;

    function mine(uint tokenId) external;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function rebirth(uint tokenId) external;

    function getDiamondMetadata(uint tokenId)
        external
        view
        returns (string memory);

    function isMineReady(Type type_) external view returns (bool);

    // TODO: delete the following functions

    function isMineEntranceReady() external view returns (bool);

    function isMineReady() external view returns (bool);

    function isCutReady() external view returns (bool);

    function isPolishReady() external view returns (bool);

    function isShipReady() external view returns (bool);
}
