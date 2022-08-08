// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

function rand(uint randNonce) view returns (uint) {
    return
        uint(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    tx.origin,
                    randNonce
                )
            )
        );
}
