// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

function getRandomInRange(
    uint256 min,
    uint256 max,
    uint256 nonce
) view returns (uint256) {
    uint256 rand = _rand(nonce);
    uint256 range = max - min + 1;
    return (rand % range) + min;
}

function _rand(uint256 nonce) view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, tx.origin, nonce)));
}
