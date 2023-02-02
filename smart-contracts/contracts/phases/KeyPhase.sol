// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "../interface/IDiamondDawnPhase.sol";
import "../interface/IDiamondDawnPhaseAdmin.sol";
import "../libraries/NFTs.sol";
import "../objects/Mint.sol";
import "../objects/Key.sol";

/**
 * @title KeyPhase
 * @author Mike Moldawsky (Tweezers)
 */
contract KeyPhase is AccessControlEnumerable, IDiamondDawnPhase, IDiamondDawnPhaseAdmin {
    using NFTs for NFTs.Metadata;

    bool public isLocked; // phase is locked forever.
    address public diamondDawn;

    string public phaseName = "key";
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

    function evolve(uint256 _tokenId, bytes memory prevAttributes) external view returns (bytes memory) {
        // TODO: add randomization
        MintAttributes memory mintAttributes = abi.decode(prevAttributes, (MintAttributes));
        if (mintAttributes.honorary)
            return abi.encode(KeyAttributes({honorary: mintAttributes.honorary, material: "pearl"}));
        return abi.encode(KeyAttributes({honorary: mintAttributes.honorary, material: "iron"}));
    }

    function getName() external view returns (string memory) {
        return phaseName;
    }

    function canEvolveFrom(IDiamondDawnPhase from) external view returns (bool) {
        require(address(from) != address(0), "From phase doesn't exist");
        return _supportedNames[from.getName()] || _supportedPhases[address(from)];
    }

    function getMetadata(uint256 tokenId, bytes memory attributes) external view returns (string memory) {
        KeyAttributes memory mintAttributes = abi.decode(attributes, (KeyAttributes));
        string memory noExtensionURI = _getNoExtensionURI(mintAttributes);
        string memory base64Json = Base64.encode(bytes(_getMetadataJson(tokenId, mintAttributes, noExtensionURI)));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    /**********************     Private Functions     ************************/
    function _getNoExtensionURI(KeyAttributes memory attributes) private view returns (string memory) {
        string memory name = _getResourceName(attributes);
        return string.concat(_baseTokenURI, _manifest, "/", name);
    }

    function _getResourceName(KeyAttributes memory attributes) private pure returns (string memory) {
        if (attributes.honorary) return "key-honorary";
        return "key";
    }

    function _getMetadataJson(
        uint256 tokenId,
        KeyAttributes memory attributes,
        string memory noExtensionURI
    ) private pure returns (string memory) {
        NFTs.Metadata memory nftMetadata = NFTs.Metadata({
            name: string.concat("Mine Key #", Strings.toString(tokenId)),
            image: string.concat(noExtensionURI, ".jpeg"),
            animationUrl: string.concat(noExtensionURI, ".mp4"),
            attributes: _getJsonAttributes(attributes)
        });
        return nftMetadata.serialize();
    }

    function _getJsonAttributes(KeyAttributes memory keyAttributes) private pure returns (NFTs.Attribute[] memory) {
        NFTs.Attribute[] memory attributes;
        if (keyAttributes.honorary) {
            attributes = new NFTs.Attribute[](2);
            attributes[0] = NFTs.toStrAttribute("Attribute", "Honorary");
            attributes[1] = NFTs.toStrAttribute("Material", "Diamonds");
            return attributes;
        }
        attributes = new NFTs.Attribute[](1);
        attributes[0] = NFTs.toStrAttribute("Material", "Gold");
        return attributes;
    }
}
