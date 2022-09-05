// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnAdmin {
    event StageChanged(Stage stage);

    enum Stage {
        INVITATIONS,
        MINE_OPEN,
        CUT_OPEN,
        POLISH_OPEN,
        SHIP,
        COMPLETE
    }

    function withdraw() external;

    function allowEntrance(bytes32[] calldata hashes) external;

    function lockDiamondDawn() external;

    function setStage(uint stage_) external;

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) external;

    function pause() external;

    function unpause() external;
}
