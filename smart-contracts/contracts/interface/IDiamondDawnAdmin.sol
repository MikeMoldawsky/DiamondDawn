// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnAdmin {
    event StageChanged(SystemStage stage);

    enum SystemStage {
        INVITATIONS,
        MINE_OPEN,
        CUT_OPEN,
        POLISH_OPEN,
        SHIP,
        COMPLETE
    }

    function withdraw() external;

    function allowMineEntrance(bytes32[] calldata passwordsHash) external;

    function lockDiamondDawn() external;

    function setSystemStage(uint systemStage_) external;

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) external;

    function pause() external;

    function unpause() external;
}
