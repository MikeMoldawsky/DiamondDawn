// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";
import "./types/Stage.sol";

/**
 * @title DiamondDawn NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawnMine is AccessControl , IDiamondDawnMine, IDiamondDawnMineAdmin {

    enum Shape {
        MAKEABLE,
        PEAR,
        ROUND,
        OVAL,
        RADIANT,
        NO_SHAPE
    }

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
        Shape shape;
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
    mapping(uint => mapping(uint => string)) private _stageToShapeVideoUrls;

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

    function initialize(address diamondDawnContract) external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _diamondDawnContract = diamondDawnContract;
    }

    function populateDiamonds(DiamondMetadata[] memory diamonds) external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < diamonds.length; i++) {
            _unassignedDiamonds.push(diamonds[i]);
        }
    }

    function setRoughVideoUrl(string calldata roughUrl) external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setVideoUrl(Stage.MINE, Shape.MAKEABLE, roughUrl);
    }

    function setCutVideoUrl(string calldata pearUrl, string calldata roundUrl, string calldata ovalUrl, string calldata radiantUrl) external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setVideoUrl(Stage.CUT, Shape.PEAR, pearUrl);
        _setVideoUrl(Stage.CUT, Shape.ROUND, roundUrl);
        _setVideoUrl(Stage.CUT, Shape.OVAL, ovalUrl);
        _setVideoUrl(Stage.CUT, Shape.RADIANT, radiantUrl);
    }

    function setPolishVideoUrl(string calldata pearUrl, string calldata roundUrl, string calldata ovalUrl, string calldata radiantUrl) external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setVideoUrl(Stage.POLISH, Shape.PEAR, pearUrl);
        _setVideoUrl(Stage.POLISH, Shape.ROUND, roundUrl);
        _setVideoUrl(Stage.POLISH, Shape.OVAL, ovalUrl);
        _setVideoUrl(Stage.POLISH, Shape.RADIANT, radiantUrl);
    }

    function setBurnVideoUrl(string calldata burnUrl) external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setVideoUrl(Stage.BURN, Shape.NO_SHAPE, burnUrl);
    }

    function setRebirthVideoUrl(string calldata rebirthUrl) external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setVideoUrl(Stage.REBIRTH, Shape.NO_SHAPE, rebirthUrl);
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
        Stage stage
    ) external view returns (string memory)
    {
        // TODO: only diamond dawn contract.
        // TODO: add validation that the diamond exists
        _requireExistingAssignedDiamond(tokenId);
        DiamondMetadata memory diamondMetadata = _tokenIdToAssignedDiamonds[tokenId];
        string memory videoUrl = _getDiamondVideoUrl(stage, diamondMetadata);
        string memory base64Json = Base64.encode(bytes(string(abi.encodePacked(_getJson(diamondMetadata, tokenId, stage, videoUrl)))));
        
        return string(abi.encodePacked('data:application/json;base64,', base64Json));
    }

    function _getTypeAttributeForStage(Stage stage) private pure returns (string memory) {
        if (stage == Stage.MINE){
            return "Rough";
        } else if (stage == Stage.CUT){
            return "Cut";
        }else if (stage == Stage.POLISH){
            return "Polished";
        } else if (stage == Stage.BURN){
            return "Burned";
        } else if (stage == Stage.REBIRTH){
            return "Reborn";
        }
        return "Unknown";
    }

    function _getShapeAttributeFromShape(Shape shape) private pure returns (string memory) {
        if (shape == Shape.MAKEABLE){
            return "Makeable";
        } else if (shape == Shape.PEAR){
            return "Pear";
        } else if (shape == Shape.ROUND){
            return "Round";
        } else if (shape == Shape.OVAL){
            return "Oval";
        } else if (shape == Shape.RADIANT){
            return "Radiant";
        } else if (shape == Shape.NO_SHAPE){
            return "No Shape";
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
        // TODO: Make this function more elegant & generic.
        // TODO: Check how we should handle the dynamic array creation
        uint size;
        if (stage == Stage.MINE){
            size = 7;
        } else if (stage == Stage.CUT){
            size = 11;
        }else if (stage == Stage.POLISH){
            size = 14;
        } else if (stage == Stage.BURN){
            size = 3;
        } else if (stage == Stage.REBIRTH){
            size = 17;
        }
        ERC721MetadataAttribute[] memory metadataAttributes = new ERC721MetadataAttribute[](size);
        metadataAttributes[0] = _getERC721MetadataAttribute(false, true, true, "", "Origin", "Metaverse");
        metadataAttributes[1] = _getERC721MetadataAttribute(false, true, true, "", "Type", _getTypeAttributeFromStage(stage));
        metadataAttributes[2] = _getERC721MetadataAttribute(false, true, true, "", "Identification", "Natural");

        if (stage == Stage.MINE){
            // TODO: randomly calculate the carat
            metadataAttributes[3] = _getERC721MetadataAttribute(false, true, true, "", "Carat", "0.92");
            metadataAttributes[4] = _getERC721MetadataAttribute(false, true, true, "", "Color", "CAPE");
            metadataAttributes[5] = _getERC721MetadataAttribute(false, true, true, "", "Shape", _getShapeAttributeFromShape(diamondMetadata.shape));
            metadataAttributes[6] = _getERC721MetadataAttribute(false, true, true, "", "Mine", "Underground");
            return metadataAttributes;
        }
        if (stage == Stage.CUT){
            // TODO: randomly calculate the carat
            metadataAttributes[3] = _getERC721MetadataAttribute(false, true, true, "", "Carat", diamondMetadata.carat);
            metadataAttributes[4] = _getERC721MetadataAttribute(false, true, true, "", "Color", diamondMetadata.color);
            metadataAttributes[5] = _getERC721MetadataAttribute(false, true, true, "", "Cut", diamondMetadata.cut);
            metadataAttributes[6] = _getERC721MetadataAttribute(false, true, true, "", "Depth", diamondMetadata.depth);
            metadataAttributes[7] = _getERC721MetadataAttribute(false, true, true, "", "Fluorescence", diamondMetadata.fluorescence);
            metadataAttributes[8] = _getERC721MetadataAttribute(false, true, true, "", "Length", diamondMetadata.length);
            metadataAttributes[9] = _getERC721MetadataAttribute(false, true, true, "", "Shape", _getShapeAttributeFromShape(diamondMetadata.shape));
            metadataAttributes[10] = _getERC721MetadataAttribute(false, true, true, "", "Width", diamondMetadata.width);
            return metadataAttributes;
        }else if (stage == Stage.POLISH){
            // Cut
            metadataAttributes[3] = _getERC721MetadataAttribute(false, true, true, "", "Carat", diamondMetadata.carat);
            metadataAttributes[4] = _getERC721MetadataAttribute(false, true, true, "", "Color", diamondMetadata.color);
            metadataAttributes[5] = _getERC721MetadataAttribute(false, true, true, "", "Cut", diamondMetadata.cut);
            metadataAttributes[6] = _getERC721MetadataAttribute(false, true, true, "", "Depth", diamondMetadata.depth);
            metadataAttributes[7] = _getERC721MetadataAttribute(false, true, true, "", "Fluorescence", diamondMetadata.fluorescence);
            metadataAttributes[8] = _getERC721MetadataAttribute(false, true, true, "", "Length", diamondMetadata.length);
            metadataAttributes[9] = _getERC721MetadataAttribute(false, true, true, "", "Shape", _getShapeAttributeFromShape(diamondMetadata.shape));
            metadataAttributes[10] = _getERC721MetadataAttribute(false, true, true, "", "Width", diamondMetadata.width);
            // Polish
            metadataAttributes[11] = _getERC721MetadataAttribute(false, true, true, "", "Clarity", diamondMetadata.clarity);
            metadataAttributes[12] = _getERC721MetadataAttribute(false, true, true, "", "Polish", diamondMetadata.polish);
            metadataAttributes[13] = _getERC721MetadataAttribute(false, true, true, "", "Symmetry", diamondMetadata.symmetry);
            return metadataAttributes;
        } else if (stage == Stage.BURN){
            // TODO: decide on burn attributes
            return metadataAttributes;
        } else if (stage == Stage.REBIRTH){
            metadataAttributes[3] = _getERC721MetadataAttribute(false, true, true, "", "Carat", diamondMetadata.carat);
            metadataAttributes[4] = _getERC721MetadataAttribute(false, true, true, "", "Color", diamondMetadata.color);
            metadataAttributes[5] = _getERC721MetadataAttribute(false, true, true, "", "Cut", diamondMetadata.cut);
            metadataAttributes[6] = _getERC721MetadataAttribute(false, true, true, "", "Depth", diamondMetadata.depth);
            metadataAttributes[7] = _getERC721MetadataAttribute(false, true, true, "", "Fluorescence", diamondMetadata.fluorescence);
            metadataAttributes[8] = _getERC721MetadataAttribute(false, true, true, "", "Length", diamondMetadata.length);
            metadataAttributes[9] = _getERC721MetadataAttribute(false, true, true, "", "Shape", _getShapeAttributeFromShape(diamondMetadata.shape));
            metadataAttributes[10] = _getERC721MetadataAttribute(false, true, true, "", "Width", diamondMetadata.width);
            // Polish
            metadataAttributes[11] = _getERC721MetadataAttribute(false, true, true, "", "Clarity", diamondMetadata.clarity);
            metadataAttributes[12] = _getERC721MetadataAttribute(false, true, true, "", "Polish", diamondMetadata.polish);
            metadataAttributes[13] = _getERC721MetadataAttribute(false, true, true, "", "Symmetry", diamondMetadata.symmetry);
            // Rebirth
            metadataAttributes[14] = _getERC721MetadataAttribute(false, true, true, "", "Laboratory", "GIA");
            metadataAttributes[15] = _getERC721MetadataAttribute(false, true, false, "", "Report Date", Strings.toString(diamondMetadata.reportDate));
            metadataAttributes[16] = _getERC721MetadataAttribute(false, true, false, "", "Report Number", Strings.toString(diamondMetadata.reportNumber));
        }
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

    /**********************     Internal & Helpers     ************************/

    function _videoBaseURI() internal pure returns (string memory) {
        // TODO: in production we'll get the full ipfs/arweave url - base URI will change.
        return "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";
    }

    /**
    * @notice Sets the video URL for the given stage.
    *
    * @dev This function is only available to the admin role.
    *
    * @param stage the video's stage.
    * @param shape the diamond's shape.
    * @param videoUrl a string containing the video url of the above stage and shape.
    */
    function _setVideoUrl(Stage stage, Shape shape, string memory videoUrl) internal
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _stageToShapeVideoUrls[uint(stage)][uint(shape)] = videoUrl;
    }

    function _getDiamondVideoUrl(Stage stage, DiamondMetadata memory diamondMetadata) internal view returns (string memory)
    {
        string memory videoUrl;
        if (stage == Stage.BURN || stage == Stage.REBIRTH){
            videoUrl = _stageToShapeVideoUrls[uint(stage)][uint(Shape.NO_SHAPE)];
        } else {
            videoUrl = _stageToShapeVideoUrls[uint(stage)][uint(diamondMetadata.shape)];
        }
        return string.concat(_videoBaseURI(), videoUrl);
    }
}
