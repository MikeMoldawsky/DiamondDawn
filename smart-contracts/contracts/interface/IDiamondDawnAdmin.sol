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

    event SystemStageChanged(SystemStage stage);

    function setSystemStage(uint systemStage_) external;

    function setDiamondDawnMine(address diamondDawnMine_) external;

    function allowMineEntrance(bytes32[] calldata passwordsHash) external;
}
