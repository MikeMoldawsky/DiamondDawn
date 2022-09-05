// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnAdmin {
    enum SystemStage {
        INVITATIONS,
        MINE_OPEN,
        CUT_OPEN,
        POLISH_OPEN,
        SHIP,
        COMPLETE
    }

    event StageChanged(SystemStage stage);

    function lockDiamondDawn() external;

    function setSystemStage(uint systemStage_) external;

    function allowMineEntrance(bytes32[] calldata passwordsHash) external;

    function withdraw() external;

    //    function royalties() external; // TODO?
}
