// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../types/Stage.sol";

interface IDiamondDawnMine {

    function allocateDiamond(uint tokenId) external;
    
    function getDiamondMetadata(
        uint tokenId,
        Stage stage,
        string memory videoUrl
    ) external view returns (string memory);
}
