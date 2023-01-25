// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IDiamondDawnPhaseAdmin {
    function setBaseTokenURI(string calldata baseTokenURI) external;

    function setManifest(string calldata manifest) external;
}
