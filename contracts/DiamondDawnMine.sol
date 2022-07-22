// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";

/**
 * @title DiamondDawn NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawnMine is AccessControl , IDiamondDawnMine {

    struct DiamondMetadata {
        uint GIAReportDate;
        uint GIAReportId;
        string measurements;
        string shape;
        string caratWeight;
        string colorGrade;
        string clarityGrade;
        string cutGrade;
        string polish;
        string symmetry;
        string fluorescence;
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
    DiamondMetadata[] private _unassignedDiamonds;
    mapping(uint => DiamondMetadata) private _assignedDiamonds;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    modifier onlyDiamondDawn() {
        require(msg.sender == _diamondDawnContract);
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

    function allocateDiamond() public 
        onlyDiamondDawn
        returns (uint)
    {
        require(_unassignedDiamonds.length > 0, "DDMine: Insufficient diamonds in the pool");
        // TODO: Consider randomization of the popped index
        DiamondMetadata memory diamond = _unassignedDiamonds.pop();
        uint diamondId = diamond.GIAReportId;

        _assignedDiamonds[diamondId] = diamond;

        return diamond.GIAReportId;
    }
    
    function getDiamondMetadata(
        uint diamondId,
        uint tokenId,
        Stage stage,
        string memory videoUrl
    ) external view returns (string memory) {
        // TODO: add validation that the diamond exists
        DiamondMetadata memory diamondMetadata = _assignedDiamonds[diamondId];
        string memory base64Json = Base64.encode(bytes(string(abi.encodePacked(_getJson(diamondMetadata, tokenId, stage, videoUrl)))));
        
        return string(abi.encodePacked('data:application/json;base64,', base64Json));
    }

    function _getJson(
        DiamondMetadata memory diamondMetadata,
        uint tokenId,
        Stage stage,
        string memory videoUrl
    ) private view returns (string memory) {        
        ERC721MetadataStructure memory metadata = ERC721MetadataStructure({
            name: string(abi.encodePacked("Diamond Dawn #", tokenId.toString())),
            // TODOL: Add real description
            description: "Diamond Dawn tokens description",
            createdBy: "Diamond Dawn",
            image: videoUrl,
            attributes: _getJsonAttributes(diamondMetadata)
        });

        return _generateERC721Metadata(metadata);
    }  

    function _getJsonAttributes(DiamondMetadata memory diamondMetadata, Stage stage) private pure returns (ERC721MetadataAttribute[] memory) {
        // TODO: Populate the attributes by stage visibility
        ERC721MetadataAttribute[] memory metadataAttributes = new ERC721MetadataAttribute[](11);

        metadataAttributes[0] = _getERC721MetadataAttribute(false, true, false, "", "GIA Report ID", diamondMetadata.GIAReportId.toString());
        metadataAttributes[1] = _getERC721MetadataAttribute(false, true, false, "", "GIA Report Date", diamondMetadata.GIAReportDate.toString());
        metadataAttributes[2] = _getERC721MetadataAttribute(false, true, false, "", "Shape and Cutting Style", diamondMetadata.shape);
        metadataAttributes[3] = _getERC721MetadataAttribute(false, true, false, "", "Measurements", diamondMetadata.measurements);
        metadataAttributes[4] = _getERC721MetadataAttribute(false, true, false, "", "Carat Weight", diamondMetadata.caratWeight);
        metadataAttributes[5] = _getERC721MetadataAttribute(false, true, false, "", "Color Grade", diamondMetadata.colorGrade);
        metadataAttributes[6] = _getERC721MetadataAttribute(false, true, false, "", "Clarity Grade", diamondMetadata.clarityGrade);
        metadataAttributes[7] = _getERC721MetadataAttribute(false, true, false, "", "Cut Grade", diamondMetadata.cutGrade);
        metadataAttributes[8] = _getERC721MetadataAttribute(false, true, false, "", "Polish", diamondMetadata.polish);
        metadataAttributes[9] = _getERC721MetadataAttribute(false, true, false, "", "Symmetry", diamondMetadata.symmetry);
        metadataAttributes[10] = _getERC721MetadataAttribute(false, true, false, "", "Fluorescence", diamondMetadata.fluorescence);

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
    
        byteString = abi.encodePacked(
          byteString,
          _openJsonObject());
    
        byteString = abi.encodePacked(
          byteString,
          _pushJsonPrimitiveStringAttribute("name", metadata.name, true));
    
        byteString = abi.encodePacked(
          byteString,
          _pushJsonPrimitiveStringAttribute("description", metadata.description, true));
    
        byteString = abi.encodePacked(
          byteString,
          _pushJsonPrimitiveStringAttribute("created_by", metadata.createdBy, true));
    
        if(metadata.isImageLinked) {
            byteString = abi.encodePacked(
                byteString,
                _pushJsonPrimitiveStringAttribute("image", metadata.image, true));
        } else {
            byteString = abi.encodePacked(
                byteString,
                _pushJsonPrimitiveStringAttribute("image_data", metadata.image, true));
        }

        byteString = abi.encodePacked(
          byteString,
          _pushJsonComplexAttribute("attributes", _getAttributes(metadata.attributes), false));
    
        byteString = abi.encodePacked(
          byteString,
          _closeJsonObject());
    
        return string(byteString);
    }

    function _getAttributes(ERC721MetadataAttribute[] memory attributes) private pure returns (string memory) {
        bytes memory byteString;
    
        byteString = abi.encodePacked(
          byteString,
          _openJsonArray());
    
        for (uint i = 0; i < attributes.length; i++) {
          ERC721MetadataAttribute memory attribute = attributes[i];

          byteString = abi.encodePacked(
            byteString,
            _pushJsonArrayElement(_getAttribute(attribute), i < (attributes.length - 1)));
        }
    
        byteString = abi.encodePacked(
          byteString,
          _closeJsonArray());
    
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
