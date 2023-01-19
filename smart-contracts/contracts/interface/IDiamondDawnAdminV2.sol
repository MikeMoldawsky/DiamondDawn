// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../objects/System.sol";

interface IDiamondDawnAdminV2 {
    event PhaseOpen(string name);
    event PhaseClose(string name);
    event PhaseChange(string from, string to);

    function safeOpenPhase() external;

    function safeClosePhase() external;

    function safeSetNextPhase(
        address ddPhase,
        string memory name,
        uint16 maxSupply,
        uint price,
        string memory supportedPhase
    ) external;

    function setActive(bool boolean) external;

    function lockDiamondDawn() external;

    function pause() external;

    function unpause() external;

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external;

    function withdraw() external;
}
