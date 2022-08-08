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
    event Mine(uint tokenId);
    event Cut(uint tokenId);
    event Polish(uint indexed tokenId);
    event Ship(uint tokenId);
    event Rebirth(uint tokenId);

    function mine() external payable;

    function cut(uint tokenId) external;

    function polish(uint tokenId) external;

    function ship(uint tokenId) external;

    function rebirth(uint tokenId) external;

    function getTokenIdsByOwner(address owner)
        external
        view
        returns (uint[] memory);

    // TODO: check with Asaf if we need this function
    function getShippingTokenIds(address owner)
        external
        view
        returns (uint[] memory);
}
