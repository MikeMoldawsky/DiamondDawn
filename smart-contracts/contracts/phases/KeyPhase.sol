// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "../interface/IDiamondDawnPhase.sol";
import "../interface/IDiamondDawnPhaseAdmin.sol";
import "../utils/NFTs.sol";

/**
 * @title KeyPhase
 * @author Mike Moldawsky (Tweezers)
 */
contract KeyPhase is AccessControlEnumerable, IDiamondDawnPhase, IDiamondDawnPhaseAdmin {
    using NFTs for NFTs.Metadata;

    bool public isLocked; // phase is locked forever.
    address public diamondDawn;

    string private _baseTokenURI = "ar://";
    string private _manifest;
    mapping(string => bool) private _supportedNames; // TODO add setter
    mapping(address => bool) private _supportedPhases;

    constructor(string memory manifest) {
        _manifest = manifest;
        _supportedNames["mint"] = true;
    }

    /**********************     Modifiers     ************************/

    modifier onlyDiamondDawnOrAdmin() {
        require(_msgSender() == diamondDawn || hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Only DD or admin");
        _;
    }

    modifier onlyDiamondDawn() {
        require(_msgSender() == diamondDawn, "Only DD");
        _;
    }

    modifier notInitialized() {
        require(diamondDawn == address(0), "Initialized");
        _;
    }

    /**********************     External Functions     ************************/
    function initialize() external notInitialized {
        diamondDawn = _msgSender();
    }

    function lock() external onlyDiamondDawnOrAdmin {
        while (0 < getRoleMemberCount(DEFAULT_ADMIN_ROLE)) {
            _revokeRole(DEFAULT_ADMIN_ROLE, getRoleMember(DEFAULT_ADMIN_ROLE, 0));
        }
        isLocked = true;
    }

    function setManifest(string calldata manifest) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _manifest = manifest;
    }

    function setBaseTokenURI(string calldata baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = baseTokenURI;
    }

    function evolve(uint tokenId, uint prevAttributes) external view returns (uint) {
        // TODO: add randomization
        if (prevAttributes == 0) return 2;
        else if (prevAttributes == 1) return 3;
        revert("Wrong prev metadata");
    }

    function getName() external view returns (string memory) {
        return "key";
    }

    function canEvolveFrom(IDiamondDawnPhase from) external view returns (bool) {
        require(address(from) != address(0), "From phase doesn't exist");
        return _supportedNames[from.getName()] || _supportedPhases[address(from)];
    }

    function getMetadata(uint tokenId, uint attributes) external view returns (string memory) {
        string memory noExtensionURI = _getNoExtensionURI(attributes);
        string memory base64Json = Base64.encode(bytes(_getMetadataJson(tokenId, attributes, noExtensionURI)));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    /**********************     Private Functions     ************************/
    function _getNoExtensionURI(uint metadata) private view returns (string memory) {
        string memory name = _getResourceName(metadata);
        return string.concat(_baseTokenURI, _manifest, "/", name);
    }

    function _getResourceName(uint metadata) private pure returns (string memory) {
        if (metadata == 2) return "key";
        else if (metadata == 3) return "key-honorary";
        revert();
    }

    function _getMetadataJson(
        uint tokenId,
        uint metadata,
        string memory noExtensionURI
    ) private view returns (string memory) {
        NFTs.Metadata memory nftMetadata = NFTs.Metadata({
            name: string.concat("Mine Key #", Strings.toString(tokenId)),
            image: string.concat(noExtensionURI, ".jpeg"),
            animationUrl: string.concat(noExtensionURI, ".mp4"),
            attributes: _getJsonAttributes(metadata)
        });
        return nftMetadata.serialize();
    }

    function _getJsonAttributes(uint metadata) private view returns (NFTs.Attribute[] memory) {
        if (metadata == 2) {
            NFTs.Attribute[] memory attributes = new NFTs.Attribute[](1);
            attributes[0] = NFTs.toStrAttribute("Material", "Gold");
            return attributes;
        } else if (metadata == 3) {
            NFTs.Attribute[] memory attributes = new NFTs.Attribute[](2);
            attributes[0] = NFTs.toStrAttribute("Attribute", "Honorary");
            attributes[1] = NFTs.toStrAttribute("Material", "Diamonds");
            return attributes;
        }
        revert("wrong metadata");
    }
}
