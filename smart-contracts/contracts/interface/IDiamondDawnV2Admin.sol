// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/System.sol";

interface IDiamondDawnV2Admin {
    enum PhaseAction {
        Add,
        Replace,
        Remove,
        Open,
        Close
    }
    event Phase(string name, address phase, PhaseAction action);

    function safeOpenPhase() external;

    function safeClosePhase() external;

    function safeSetNextPhase(address ddPhase, uint16 maxSupply, uint price) external;

    function setActive(bool boolean) external;

    function lock() external;

    function pause() external;

    function unpause() external;

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external;

    function withdraw() external;
}
