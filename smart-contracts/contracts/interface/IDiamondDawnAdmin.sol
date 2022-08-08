// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnAdmin {
    function nextStage() external;

    function setDiamondDawnMine(address diamondDawnMine_) external;
}
