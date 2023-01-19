// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../interface/IDiamondDawnPhase.sol";


/**
 * @title DiamondDawnMine
 * @author Mike Moldawsky (Tweezers)
 */
contract RevealPhase is IDiamondDawnPhase{

	function evolve(uint tokenId, uint prevMetadata) external view returns (uint) {
		return 0;
	}

	function getMetadata(uint tokenId, uint metadata) external view returns (string memory) {
		return "";
	}

	function lock() external {

	}



}