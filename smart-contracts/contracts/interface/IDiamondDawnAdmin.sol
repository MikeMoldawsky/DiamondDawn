// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnAdmin {
    enum SystemStage {
        MINE_OPEN,
        CUT_OPEN,
        POLISH_OPEN,
        SHIP,
        COMPLETE
    }

    event SystemStageChanged(SystemStage stage);

    function setSystemStage(uint systemStage_) external;

    function setDiamondDawnMine(address diamondDawnMine_) external;
}
