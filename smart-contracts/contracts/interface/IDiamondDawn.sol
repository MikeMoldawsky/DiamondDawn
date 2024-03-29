// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawn {
    function mint(bytes calldata signature, uint256 quantity) external payable;

    function mintHonorary(bytes calldata signature) external payable;

    function safeEvolveCurrentPhase(uint256 tokenId) external payable;
}
