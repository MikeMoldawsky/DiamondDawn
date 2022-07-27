// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../types/Stage.sol";

interface IDiamondDawnMine {

    function allocateDiamond() external returns(uint);
    
    function getDiamondMetadata(
        uint diamondId,
        uint tokenId,
        Stage stage,
        string memory videoUrl
    ) external view returns (string memory);
}
