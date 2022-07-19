// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IDiamondMetaData {
    function tokenMetadata(
        uint256 tokenId,
        string calldata _videoUrl,
        uint256 _stage,
        uint256 _shape,
        string calldata _cutable,
        string calldata _polishable
    ) external view returns (string memory);
}

/**
 * @title DiamondDawn NFT Contract
 * @author Diamond Dawn
 */
contract DiamondMetaData is AccessControl {
    address public DiamondDawnNft;

    constructor() {
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function tokenMetadata(
        uint256 tokenId,
        string calldata _videoUrl,
        uint256 _stage,
        uint256 _shape,
        string calldata _cutable,
        string calldata _polishable
    ) external view returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Diamond Dawn", "description": "This is the description of Diamond Dawn Project", "image": "',
                        _videoUrl,
                        '", "animation_url": "',
                        _videoUrl,
                        '", "stage": ',
                        Strings.toString(_stage),
                        ', "shape": ',
                        Strings.toString(_shape),
                        ', "cutable": ',
                        _cutable,
                        ', "polishable": ',
                        _polishable,
                        " }"
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
