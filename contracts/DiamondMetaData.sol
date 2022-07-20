// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondMetaDataContract.sol";

/**
 * @title DiamondDawn NFT Contract
 * @author Diamond Dawn
 */
contract DiamondMetaData is AccessControl , IDiamondMetaData {
    address public DiamondDawnNft;

    constructor() {
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function tokenMetadata(
        string calldata _videoUrl,
        uint256 _stage,
        uint256 _physichalAttribute,
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
                        '",'
                        '"attributes" :',
                        getDiamondAttributes(
                            _stage,
                            _physichalAttribute,
                            _shape,
                            _cutable,
                            _polishable
                        ),
                        " }"
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getDiamondAttributes(
        uint256 _stage,
        uint256 _physichalAttribute,
        uint256 _shape,
        string calldata _cutable,
        string calldata _polishable
    ) internal view returns (string memory) {
        return (
            string(
                abi.encodePacked(
                    "["
                        "{"
                          '"display_type": "number",'
                          '"trait_type": "stage",'
                          '"value":', Strings.toString(_stage),
                        "},"
                        "{"
                          '"trait_type": "physical",'
                          '"value":', Strings.toString(_physichalAttribute),
                        "},"
                        "{"
                          '"display_type": "number",'
                          '"trait_type": "shape", '
                          '"value":', Strings.toString(_shape),
                        "},"
                        "{"
                          '"trait_type": "type", '
                          '"value": "Cape" '
                        "},"
                        "{"
                          '"trait_type": "cutable",'
                          '"value":', _cutable,
                        "},"
                        "{"
                          '"trait_type": "polishable", '
                          '"value":', _polishable,
                        "}"
                    "]"
                )
            )
        );
    }
}
