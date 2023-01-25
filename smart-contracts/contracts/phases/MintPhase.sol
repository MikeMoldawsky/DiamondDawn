// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "../interface/IDiamondDawnV2Phase.sol";
import "../interface/IDiamondDawnV2PhaseAdmin.sol";
import "../utils/NFTs.sol";
import "../objects/Mint.sol";
import "../objects/Mint.sol";

/**
 * @title MintPhase
 * @author Mike Moldawsky (Tweezers)
 */
contract MintPhase is AccessControlEnumerable, IDiamondDawnV2Phase, IDiamondDawnV2PhaseAdmin {
    using NFTs for NFTs.Metadata;

    bool public isLocked; // phase is locked forever.
    address public diamondDawn;
    string public phaseName = "mint";

    string private _baseTokenURI = "ar://";
    string private _manifest;
    mapping(string => bool) private _supportedNames; // TODO add setter
    mapping(address => bool) private _supportedPhases;

    constructor(string memory manifest) {
        _manifest = manifest;
        _supportedPhases[address(0)] = true; // base condition
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

    function evolve(uint _tokenId, bytes calldata prevAttributes) external view onlyDiamondDawn returns (bytes memory) {
        MintAttributes memory attributes = abi.decode(prevAttributes, (MintAttributes));
        return abi.encode(attributes); // Mint is the recursion base condition
    }

    function getName() external view returns (string memory) {
        return phaseName;
    }

    function canEvolveFrom(IDiamondDawnV2Phase from) external view returns (bool) {
        return _supportedPhases[address(from)] || _supportedNames[from.getName()];
    }

    function getMetadata(uint tokenId, bytes memory attributes) external view returns (string memory) {
        MintAttributes memory mintAttributes = abi.decode(attributes, (MintAttributes));
        string memory noExtensionURI = _getNoExtensionURI(mintAttributes);
        string memory base64Json = Base64.encode(bytes(_getMetadataJson(tokenId, mintAttributes, noExtensionURI)));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    /**********************     Private Functions     ************************/

    function _getNoExtensionURI(MintAttributes memory attributes) private view returns (string memory) {
        string memory name = _getResourceName(attributes);
        return string.concat(_baseTokenURI, _manifest, "/", name);
    }

    function _getResourceName(MintAttributes memory attributes) private pure returns (string memory) {
        if (attributes.honorary) return "logo-honorary";
        return "logo";
    }

    function _getMetadataJson(
        uint tokenId,
        MintAttributes memory attributes,
        string memory noExtensionURI
    ) private pure returns (string memory) {
        NFTs.Metadata memory nftMetadata = NFTs.Metadata({
            name: string.concat("Diamond Dawn #", Strings.toString(tokenId)),
            image: string.concat(noExtensionURI, ".jpeg"),
            animationUrl: string.concat(noExtensionURI, ".mp4"),
            attributes: _getJsonAttributes(attributes)
        });
        return nftMetadata.serialize();
    }

    function _getJsonAttributes(MintAttributes memory mintAttributes) private pure returns (NFTs.Attribute[] memory) {
        if (mintAttributes.honorary) {
            NFTs.Attribute[] memory attributes = new NFTs.Attribute[](1);
            attributes[0] = NFTs.toStrAttribute("Attribute", "Honorary");
            return attributes;
        }
        return new NFTs.Attribute[](0);
    }
}
