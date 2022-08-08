// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnAdmin {
    function setSystemStage(uint systemStage_) external;

    function setDiamondDawnMine(address diamondDawnMine_) external;
}
