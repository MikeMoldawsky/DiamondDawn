// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/System.sol";

interface IDiamondDawnAdmin {
    event StageChanged(Stage stage);

    function setStage(Stage stage) external;

    function completeStage(Stage stage) external;

    function lockDiamondDawn() external;

    function pause() external;

    function unpause() external;

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external;

    function withdraw() external;
}
