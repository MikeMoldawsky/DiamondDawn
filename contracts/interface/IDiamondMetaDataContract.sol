// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IDiamondMetaData {
    function tokenMetadata(
        string calldata _videoUrl,
        uint256 _stage,
        uint256 _physichalAttribute,
        uint256 _shape,
        string calldata _cutable,
        string calldata _polishable
    ) external view returns (string memory);
}