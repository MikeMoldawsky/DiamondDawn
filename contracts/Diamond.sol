// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title DiamondDawn NFT Contract
 * @author Diamond Dawn
 */
contract Diamond {
    address public DiamondDawnNft;

    constructor(address _diamondDawnNft) {
        DiamondDawnNft = _diamondDawnNft;
    }
}
