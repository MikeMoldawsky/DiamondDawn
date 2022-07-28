// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./types/Stage.sol";

/**
 * @title DiamondDawn NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawnMine is AccessControl , IDiamondDawnMine {

    struct DiamondMetadata {
        string carat;
        string clarity;
        string color;
        string cut;
        string depth;
        string fluorescence;
        string length;
        string polish;
        uint reportDate;
        uint reportNumber;
        string shape;
        string symmetry;
        string width;
    }

    struct ERC721MetadataStructure {
        string name;
        string description;
        string createdBy;
        string image;
        ERC721MetadataAttribute[] attributes;
    }

    struct ERC721MetadataAttribute {
        bool includeDisplayType;
        bool includeTraitType;
        bool isValueAString;
        string displayType;
        string traitType;
        string value;
    }

    address private _diamondDawnContract;
    DiamondMetadata[] public _unassignedDiamonds;
    mapping(uint => DiamondMetadata) public _tokenIdToAssignedDiamonds;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    modifier onlyDiamondDawn() {
        require(
            msg.sender == _diamondDawnContract,
            "DiamondDawnMine: onlyDiamondDawn allowed");
        _;
    }

    function initialize(address diamondDawnContract) public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _diamondDawnContract = diamondDawnContract;
    }

    function populateDiamonds(DiamondMetadata[] memory diamonds) public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < diamonds.length; i++) {
            _unassignedDiamonds.push(diamonds[i]);
        }
    }

    function _getRandomNumber(uint maxNumber) internal view returns (uint) {
        if (maxNumber == 0) {
            return 0;
        }
        // TODO: Add the comments below to the method inline documentation.
        // maxNumber instead of range in-order to save gas assuming the randomization will always start with 0.
        // maxNumber is inclusive.
        return
            uint(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % maxNumber;
    }

    function _popUnassignedDiamond(uint index) internal returns (DiamondMetadata memory) {
        DiamondMetadata memory diamond = _unassignedDiamonds[index];
        
        // Move the last element into the place to delete
        if (_unassignedDiamonds.length > 1) {
            _unassignedDiamonds[index] = _unassignedDiamonds[_unassignedDiamonds.length - 1];
        }
        _unassignedDiamonds.pop();
        
        return diamond;
    }

    modifier _requireExistingUnassignedDiamond() {
        require(_unassignedDiamonds.length > 0, "DiamondDawnMine: Insufficient diamonds in the pool");
        _;
    }

    function allocateDiamond(uint256 tokenId) external
        onlyDiamondDawn
        _requireExistingUnassignedDiamond
    {
        uint randomIndex = _getRandomNumber(_unassignedDiamonds.length - 1);
        DiamondMetadata memory diamond = _popUnassignedDiamond(randomIndex);
        _tokenIdToAssignedDiamonds[tokenId] = diamond;
    }

    function _requireExistingAssignedDiamond(uint tokenId) internal view {
        require(_tokenIdToAssignedDiamonds[tokenId].reportNumber > 0, "DiamondDawnMine: Diamond does not exist");
    }
    
    function getDiamondMetadata(
        uint tokenId,
        Stage stage,
        string memory videoUrl
    ) external view returns (string memory)
    {
        // TODO: only diamond dawn contract.
        // TODO: add validation that the diamond exists
        _requireExistingAssignedDiamond(tokenId);

        DiamondMetadata memory diamondMetadata = _tokenIdToAssignedDiamonds[tokenId];
        string memory base64Json = Base64.encode(bytes(string(abi.encodePacked(_getJson(diamondMetadata, tokenId, stage, videoUrl)))));
        
        return string(abi.encodePacked('data:application/json;base64,', base64Json));
    }

    function _getTypeAttribute(Stage stage) private pure returns (string memory) {
        if (stage == Stage.MINE){
            return "Rough";
        } else if (stage == Stage.CUT){
            return "Cut";
        }else if (stage == Stage.POLISH){
            return "Polished";
        } else if (stage == Stage.PHYSICAL){
            return "Burned";
        } else if (stage == Stage.REBIRTH){
            return "Reborn";
        }
        return "Unknown";
    }

    function _getJson(
        DiamondMetadata memory diamondMetadata,
        uint tokenId,
        Stage stage,
        string memory videoUrl
    ) private pure returns (string memory) {        
        ERC721MetadataStructure memory metadata = ERC721MetadataStructure({
            name: string(abi.encodePacked("Diamond Dawn #", Strings.toString(tokenId))),
            // TODO: Add real description
            description: "Diamond Dawn tokens description",
            createdBy: "Diamond Dawn",
            image: videoUrl,
            attributes: _getJsonAttributes(diamondMetadata, stage)
        });

        return _generateERC721Metadata(metadata);
    }  

    function _getJsonAttributes(DiamondMetadata memory diamondMetadata, Stage stage) private pure returns (ERC721MetadataAttribute[] memory) {
        // TODO: Populate the attributes by stage visibility
        ERC721MetadataAttribute[] memory metadataAttributes = new ERC721MetadataAttribute[](17);

        metadataAttributes[0] = _getERC721MetadataAttribute(false, true, true, "", "Carat", diamondMetadata.carat);
        metadataAttributes[1] = _getERC721MetadataAttribute(false, true, true, "", "Clarity", diamondMetadata.clarity);
        metadataAttributes[2] = _getERC721MetadataAttribute(false, true, true, "", "Color", diamondMetadata.color);
        metadataAttributes[3] = _getERC721MetadataAttribute(false, true, true, "", "Cut", diamondMetadata.cut);
        metadataAttributes[4] = _getERC721MetadataAttribute(false, true, true, "", "Depth", diamondMetadata.depth);
        metadataAttributes[5] = _getERC721MetadataAttribute(false, true, true, "", "Fluorescence", diamondMetadata.fluorescence);
        metadataAttributes[6] = _getERC721MetadataAttribute(false, true, true, "", "Identification", "Natural");
        metadataAttributes[7] = _getERC721MetadataAttribute(false, true, true, "", "Laboratory", "GIA");
        metadataAttributes[8] = _getERC721MetadataAttribute(false, true, true, "", "Length", diamondMetadata.length);
        metadataAttributes[9] = _getERC721MetadataAttribute(false, true, true, "", "Origin", "Metaverse");
        metadataAttributes[10] = _getERC721MetadataAttribute(false, true, true, "", "Polish", diamondMetadata.polish);
        metadataAttributes[11] = _getERC721MetadataAttribute(false, true, false, "", "Report Date", Strings.toString(diamondMetadata.reportDate));
        metadataAttributes[12] = _getERC721MetadataAttribute(false, true, false, "", "Report Number", Strings.toString(diamondMetadata.reportNumber));
        metadataAttributes[13] = _getERC721MetadataAttribute(false, true, true, "", "Shape", diamondMetadata.shape);
        metadataAttributes[14] = _getERC721MetadataAttribute(false, true, true, "", "Symmetry", diamondMetadata.symmetry);
        metadataAttributes[15] = _getERC721MetadataAttribute(false, true, true, "", "Type", _getTypeAttribute(stage));
        metadataAttributes[16] = _getERC721MetadataAttribute(false, true, true, "", "Width", diamondMetadata.width);

        return metadataAttributes;
    }

    function _getERC721MetadataAttribute(bool includeDisplayType, bool includeTraitType, bool isValueAString, string memory displayType, string memory traitType, string memory value) private pure returns (ERC721MetadataAttribute memory) {
        ERC721MetadataAttribute memory attribute = ERC721MetadataAttribute({
            includeDisplayType: includeDisplayType,
            includeTraitType: includeTraitType,
            isValueAString: isValueAString,
            displayType: displayType,
            traitType: traitType,
            value: value
        });

        return attribute;
    }

    function _generateERC721Metadata(ERC721MetadataStructure memory metadata) private pure returns (string memory) {
        bytes memory byteString;
        byteString = abi.encodePacked(byteString, _openJsonObject());
        byteString = abi.encodePacked(byteString, _pushJsonPrimitiveStringAttribute("name", metadata.name, true));
        byteString = abi.encodePacked(byteString, _pushJsonPrimitiveStringAttribute("description", metadata.description, true));
        byteString = abi.encodePacked(byteString, _pushJsonPrimitiveStringAttribute("created_by", metadata.createdBy, true));
        byteString = abi.encodePacked(byteString, _pushJsonPrimitiveStringAttribute("image", metadata.image, true));
        byteString = abi.encodePacked(byteString, _pushJsonComplexAttribute("attributes", _getAttributes(metadata.attributes), false));
        byteString = abi.encodePacked(byteString, _closeJsonObject());
        return string(byteString);
    }

    function _getAttributes(ERC721MetadataAttribute[] memory attributes) private pure returns (string memory) {
        bytes memory byteString;
        byteString = abi.encodePacked(byteString, _openJsonArray());
        for (uint i = 0; i < attributes.length; i++) {
          ERC721MetadataAttribute memory attribute = attributes[i];
          byteString = abi.encodePacked(byteString, _pushJsonArrayElement(_getAttribute(attribute), i < (attributes.length - 1)));
        }
        byteString = abi.encodePacked(byteString, _closeJsonArray());
        return string(byteString);
    }

    function _getAttribute(ERC721MetadataAttribute memory attribute) private pure returns (string memory) {
        bytes memory byteString;
        
        byteString = abi.encodePacked(
          byteString,
          _openJsonObject());
    
        if(attribute.includeDisplayType) {
          byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute("display_type", attribute.displayType, true));
        }
    
        if(attribute.includeTraitType) {
          byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute("trait_type", attribute.traitType, true));
        }
    
        if(attribute.isValueAString) {
          byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute("value", attribute.value, false));
        } else {
          byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveNonStringAttribute("value", attribute.value, false));
        }
    
        byteString = abi.encodePacked(
          byteString,
          _closeJsonObject());
    
        return string(byteString);
    }

    function _openJsonObject() private pure returns (string memory) {        
        return string(abi.encodePacked("{"));
    }

    function _closeJsonObject() private pure returns (string memory) {
        return string(abi.encodePacked("}"));
    }

    function _openJsonArray() private pure returns (string memory) {        
        return string(abi.encodePacked("["));
    }

    function _closeJsonArray() private pure returns (string memory) {        
        return string(abi.encodePacked("]"));
    }

    function _pushJsonPrimitiveStringAttribute(string memory key, string memory value, bool insertComma) private pure returns (string memory) {
        return string(abi.encodePacked('"', key, '": "', value, '"', insertComma ? ',' : ''));
    }

    function _pushJsonPrimitiveNonStringAttribute(string memory key, string memory value, bool insertComma) private pure returns (string memory) {
        return string(abi.encodePacked('"', key, '": ', value, insertComma ? ',' : ''));
    }

    function _pushJsonComplexAttribute(string memory key, string memory value, bool insertComma) private pure returns (string memory) {
        return string(abi.encodePacked('"', key, '": ', value, insertComma ? ',' : ''));
    }

    function _pushJsonArrayElement(string memory value, bool insertComma) private pure returns (string memory) {
        return string(abi.encodePacked(value, insertComma ? ',' : ''));
    }
}
