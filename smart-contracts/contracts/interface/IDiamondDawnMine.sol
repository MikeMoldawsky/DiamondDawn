// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnMine {
    enum Type {
        NO_TYPE,
        ENTER_MINE,
        ROUGH,
        CUT,
        POLISHED,
        REBORN
    }

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

    function isMineEntranceReady() external view returns (bool);

    function isMineReady() external view returns (bool);

    function isCutReady() external view returns (bool);

    function isPolishReady() external view returns (bool);

    function isShipReady() external view returns (bool);
}
