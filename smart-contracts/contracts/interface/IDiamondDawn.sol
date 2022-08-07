// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;


interface IDiamondDawn {
    enum SystemStage {
        MINE_OPEN,
        CUT_OPEN,
        POLISH_OPEN,
        SHIP,
        COMPLETE
    }

    event SystemStageChanged(SystemStage stage);
    // TODO: maybe dedicated events for Cut, Polish etc

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
