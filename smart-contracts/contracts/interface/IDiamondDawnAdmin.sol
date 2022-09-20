// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/System.sol";

interface IDiamondDawnAdmin {
    event StageChanged(Stage stage);

    function withdraw() external;

    function lockDiamondDawn() external;

    function setStage(Stage stage) external;

    function completeStage(Stage stage) external;

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external;

    function pause() external;

    function unpause() external;
}
