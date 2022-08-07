// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawn {
    enum WhitelistAction {
        ADD,
        REMOVE,
        USE
    }

    enum Stage {
        MINE,
        CUT,
        POLISH,
        BURN,
        REBIRTH
    }

    event StageChanged(Stage stage);
    event TokenProcessed(uint tokenId, Stage stage);

    function mine() external payable;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function burnAndShip(uint tokenId) external;

    function rebirth(uint tokenId) external;

    function getTokenIdsByOwner(address owner)
        external
        view
        returns (uint[] memory);
}
