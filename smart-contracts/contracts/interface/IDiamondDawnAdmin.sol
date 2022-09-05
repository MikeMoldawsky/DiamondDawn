// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnAdmin {
    event StageChanged(Stage stage);

    enum Stage {
        NO_STAGE,
        INVITATIONS,
        MINE_OPEN,
        CUT_OPEN,
        POLISH_OPEN,
        SHIP
    }

    function withdraw() external;

    function allowEntrance(bytes32[] calldata hashes) external;

    function lockDiamondDawn() external;

    function setStage(Stage stage) external;

    function completeStage(Stage stage) external;

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external;

    function pause() external;

    function unpause() external;
}
