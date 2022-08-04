// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";

/**
 * @title DiamondDawnMine NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawnMine is
    AccessControl,
    IDiamondDawnMine,
    IDiamondDawnMineAdmin
{
    enum DiamondDawnType {
        ROUGH,
        CUT,
        POLISHED,
        BURNED,
        REBORN
    }

    enum RoughDiamondShape {
        MAKEABLE
    }


    enum DiamondShape {
        PEAR,
        ROUND,
        OVAL,
        RADIANT
    }

    struct RoughDiamondMetadata {
        RoughDiamondShape shape;
        uint points;
    }

    struct CutDiamondMetadata {
        uint points;
    }

    struct PolishedDiamondCertificate {
        uint points;
        string clarity;
        string color;
        string cut;
        string depth;
        string fluorescence;
        string length;
        string polish;
        uint reportDate;
        uint reportNumber;
        DiamondShape shape;
        string symmetry;
        string width;
    }

    struct DiamondDawnMetadata {
        DiamondDawnType diamondDawnType;
        RoughDiamondMetadata roughDiamondMetadata;
        CutDiamondMetadata cutDiamondMetadata;
        PolishedDiamondCertificate polishedDiamond;
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

    uint private constant MIN_ROUGH_DIAMOND_POINTS = 85;
    uint private constant MAX_ROUGH_DIAMOND_POINTS = 99;
    uint private constant MIN_POLISH_POINTS_REDUCTION = 1;
    uint private constant MAX_POLISH_POINTS_REDUCTION = 7;

    address private _diamondDawnContract;
    mapping(uint => string) private _roughShapeToVideoUrls;
    mapping(uint => string) private _cutShapeToVideoUrls;
    mapping(uint => string) private _polishShapeToVideoUrls;
    string private _burnVideoUrl;
    string private _rebirthVideoUrl;

    PolishedDiamondCertificate[] private _mineDiamonds;

    mapping(uint => DiamondDawnMetadata) public _tokenIdToDiamondDawnMetadata;

    constructor(address[] memory adminAddresses) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        // TODO: remove admins after testing
        _setAdminAndAddToAllowList(adminAddresses);
    }

    modifier onlyDiamondDawn() {
        require(
            msg.sender == _diamondDawnContract,
            "DiamondDawnMine: onlyDiamondDawn allowed"
        );
        _;
    }

    modifier requireDiamondDawnType(uint tokenId, DiamondDawnType diamondDawnType) {
        require(
            diamondDawnType == _tokenIdToDiamondDawnMetadata[tokenId].diamondDawnType,
            "Invalid diamond dawn type"
        );
        _;
    }

    function initialize(address diamondDawnContract)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _diamondDawnContract = diamondDawnContract;
    }

    function populateDiamonds(PolishedDiamondCertificate[] memory diamonds)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < diamonds.length; i++) {
            _mineDiamonds.push(diamonds[i]);
        }
    }

    function setRoughVideoUrl(string calldata roughUrl)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _roughShapeToVideoUrls[uint(RoughDiamondShape.MAKEABLE)] = roughUrl;
    }

    function setCutVideoUrl(
        string calldata pearUrl,
        string calldata roundUrl,
        string calldata ovalUrl,
        string calldata radiantUrl
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _cutShapeToVideoUrls[uint(DiamondShape.PEAR)] = pearUrl;
        _cutShapeToVideoUrls[uint(DiamondShape.ROUND)] = roundUrl;
        _cutShapeToVideoUrls[uint(DiamondShape.OVAL)] = ovalUrl;
        _cutShapeToVideoUrls[uint(DiamondShape.RADIANT)] = radiantUrl;
    }

    function setPolishVideoUrl(
        string calldata pearUrl,
        string calldata roundUrl,
        string calldata ovalUrl,
        string calldata radiantUrl
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _polishShapeToVideoUrls[uint(DiamondShape.PEAR)] = pearUrl;
        _polishShapeToVideoUrls[uint(DiamondShape.ROUND)] = roundUrl;
        _polishShapeToVideoUrls[uint(DiamondShape.OVAL)] = ovalUrl;
        _polishShapeToVideoUrls[uint(DiamondShape.RADIANT)] = radiantUrl;
    }

    function setBurnVideoUrl(string calldata burnUrl)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _burnVideoUrl = burnUrl;
    }

    function setRebirthVideoUrl(string calldata rebirthUrl)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _rebirthVideoUrl = rebirthUrl;
    }

    function _getRandomNumberInRange(uint minNumber, uint maxNumber)
        internal
        view
        returns (uint)
    {
        uint range = maxNumber - minNumber + 1;
        uint randomNumber = _getRandomNumber();

        return (randomNumber % range) + minNumber;
    }

    function _getRandomNumber() internal view returns (uint) {
        // TODO: make sure that using tx.origin is fine and check for a better implementation.
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        tx.origin
                    )
                )
            );
    }

    function _mineDiamond()
        internal
        returns (PolishedDiamondCertificate memory)
    {
        uint randomIndex = _getRandomNumberInRange(
            0,
            _mineDiamonds.length - 1
        );
        PolishedDiamondCertificate memory diamond = _mineDiamonds[randomIndex];

        // TODO: Move the last element into the place to delete
        if (_mineDiamonds.length > 1) {
            _mineDiamonds[randomIndex] = _mineDiamonds[
                _mineDiamonds.length - 1
            ];
        }
        _mineDiamonds.pop();

        return diamond;
    }

    modifier _requireMineNotDry() {
        require(
            _mineDiamonds.length > 0,
            "Diamond Dawn Mine is empty"
        );
        _;
    }

    function mine(uint tokenId) external onlyDiamondDawn _requireMineNotDry {
        // TODO: change to carat calculate randomly according to polished weight
        uint randomPoints = _getRandomNumberInRange(
            MIN_ROUGH_DIAMOND_POINTS,
            MAX_ROUGH_DIAMOND_POINTS
        );
        _tokenIdToDiamondDawnMetadata[tokenId] = DiamondDawnMetadata({
            diamondDawnType: DiamondDawnType.ROUGH,
            roughDiamondMetadata: RoughDiamondMetadata({ shape: RoughDiamondShape.MAKEABLE, points: randomPoints}),
            polishedDiamond: _mineDiamond()
        });
    }

    function cut(uint256 tokenId)
        external
        onlyDiamondDawn
        requireDiamondDawnType(tokenId, DiamondDawnType.ROUGH)
    {
        // TODO: fix random points creation
        uint polishPointsReduction = _getRandomNumberInRange(
            MIN_POLISH_POINTS_REDUCTION,
            MAX_POLISH_POINTS_REDUCTION
        );
        DiamondDawnMetadata storage diamondDawnMetadata = _tokenIdToDiamondDawnMetadata[tokenId];
        diamondDawnMetadata.cutDiamondMetadata = CutDiamondMetadata({
            points: diamondDawnMetadata.polishedDiamond.points + polishPointsReduction
        });
        diamondDawnMetadata.diamondDawnType = DiamondDawnType.CUT;
    }

    function getDiamondMetadata(uint tokenId)
        external
        view
        returns (string memory)
    {
        // TODO: only diamond dawn contract.
        DiamondDawnMetadata memory diamondDawnMetadata = _tokenIdToDiamondDawnMetadata[
            tokenId
        ];
        string memory videoUrl = _getDiamondDawnVideoUrl(diamondDawnMetadata);
        string memory base64Json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        _getJson(diamondDawnMetadata, tokenId, videoUrl)
                    )
                )
            )
        );

        return
            string(
                abi.encodePacked("data:application/json;base64,", base64Json)
            );
    }

    function _toDiamondDawnTypeString(DiamondDawnType _type)
        private
        pure
        returns (string memory)
    {
        if (_type == DiamondDawnType.ROUGH) {
            return "Rough";
        } else if (_type == DiamondDawnType.CUT) {
            return "Cut";
        } else if (_type == DiamondDawnType.POLISHED) {
            return "Polished";
        } else if (_type == DiamondDawnType.BURNED) {
            return "Burned";
        } else if (_type == DiamondDawnType.REBORN) {
            return "Reborn";
        }
        revert("Failed to convert DiamondDawn type");
    }


    function _toRoughDiamondShapeString(RoughDiamondShape shape)
    private
    pure
    returns (string memory){
        if (shape == RoughDiamondShape.MAKEABLE) {
            return "Makeable";
        }
    revert("Failed to convert Diamond shape");
    }

    function _toDiamondShapeString(DiamondShape shape)
        private
        pure
        returns (string memory){
        if (shape == DiamondShape.PEAR) {
            return "Pear";
        } else if (shape == DiamondShape.ROUND) {
            return "Round";
        } else if (shape == DiamondShape.OVAL) {
            return "Oval";
        } else if (shape == DiamondShape.RADIANT) {
            return "Radiant";
        }
        revert("Failed converting Diamond shape");
    }

    function _pointsToCaratString(uint points)
        private
        pure
        returns (string memory)
    {
        return
            string.concat(
                Strings.toString(points / 100),
                ".",
                Strings.toString(points % 100)
            );
    }

    function _getJson(
        DiamondDawnMetadata memory diamondDawnMetadata,
        uint tokenId,
        string memory videoUrl
    ) private view returns (string memory) {
        // TODO: Add real description
        ERC721MetadataStructure memory metadata = ERC721MetadataStructure({
            name: string(
                abi.encodePacked("Diamond Dawn #", Strings.toString(tokenId))
            ),
            description: "Diamond Dawn tokens description",
            createdBy: "Diamond Dawn",
            image: videoUrl,
            attributes: _getJsonAttributes(diamondDawnMetadata, tokenId)
        });

        return _generateERC721Metadata(metadata);
    }

    function _getJsonAttributes(
        DiamondDawnMetadata memory diamondDawnMetadata
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        // TODO: Make this function more elegant & generic.
        // TODO: Check how we should handle the dynamic array creation
        DiamondDawnType diamondDawnType = diamondDawnMetadata.diamondDawnType;
        uint size;
        if (DiamondDawnType.ROUGH == diamondDawnType) {
            size = 7;
        } else if (DiamondDawnType.CUT == diamondDawnType) {
            size = 11;
        } else if (DiamondDawnType.POLISHED == diamondDawnType) {
            size = 14;
        } else if (DiamondDawnType.BURNED == diamondDawnType) {
            size = 3;
        } else if (DiamondDawnType.REBORN == diamondDawnType) {
            size = 17;
        } else {
            revert("Failed fetching DiamondDawn json attributes - unknown type");
        }
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](size);
        metadataAttributes[0] = _getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Origin",
            "Metaverse"
        );
        metadataAttributes[1] = _getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Type",
            _toDiamondDawnTypeString(diamondDawnType)
        );
        metadataAttributes[2] = _getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Identification",
            "Natural"
        );

        if (DiamondDawnType.ROUGH == diamondDawnType) {
            // TODO: validate that the rough carat exists
            RoughDiamondMetadata memory roughDiamondMetadata = diamondDawnMetadata.roughDiamondMetadata;
            metadataAttributes[3] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Carat",
                _pointsToCaratString(roughDiamondMetadata.points)
            );
            metadataAttributes[4] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Color",
                "CAPE"
            );
            metadataAttributes[5] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Shape",
                _toRoughDiamondShapeString(roughDiamondMetadata.shape)
            );
            metadataAttributes[6] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Mine",
                "Underground"
            );
            return metadataAttributes;
        }
        PolishedDiamondCertificate memory polishedDiamond = diamondDawnMetadata.polishedDiamond;
        if (DiamondDawnType.CUT == diamondDawnType) {
            // TODO: validate that the additional carat exists
            CutDiamondMetadata memory cutDiamondMetadata = diamondDawnMetadata.cutDiamondMetadata;
            metadataAttributes[3] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Carat",
                _pointsToCaratString(cutDiamondMetadata.points)
            );
            metadataAttributes[4] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Color",
                polishedDiamond.color
            );
            metadataAttributes[5] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Cut",
                polishedDiamond.cut
            );
            metadataAttributes[6] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Depth",
                    polishedDiamond.depth
            );
            metadataAttributes[7] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Fluorescence",
                    polishedDiamond.fluorescence
            );
            metadataAttributes[8] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Length",
                    polishedDiamond.length
            );
            metadataAttributes[9] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Shape",
                _toDiamondShapeString(polishedDiamond.shape)
            );
            metadataAttributes[10] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Width",
                    polishedDiamond.width
            );
            return metadataAttributes;
        } else if (DiamondDawnType.POLISHED == diamondDawnType) {
            // Cut
            metadataAttributes[3] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Carat",
                _pointsToCaratString(polishedDiamond.points)
            );
            metadataAttributes[4] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Color",
                    polishedDiamond.color
            );
            metadataAttributes[5] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Cut",
                    polishedDiamond.cut
            );
            metadataAttributes[6] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Depth",
                    polishedDiamond.depth
            );
            metadataAttributes[7] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Fluorescence",
                    polishedDiamond.fluorescence
            );
            metadataAttributes[8] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Length",
                    polishedDiamond.length
            );
            metadataAttributes[9] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Shape",
                _toDiamondShapeString(polishedDiamond.shape)
            );
            metadataAttributes[10] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Width",
                    polishedDiamond.width
            );
            // Polish
            metadataAttributes[11] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Clarity",
                    polishedDiamond.clarity
            );
            metadataAttributes[12] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Polish",
                    polishedDiamond.polish
            );
            metadataAttributes[13] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Symmetry",
                    polishedDiamond.symmetry
            );
            return metadataAttributes;
        } else if (DiamondDawnType.BURNED == diamondDawnType) {
            // TODO: decide on burn attributes
            return metadataAttributes;
        } else if (DiamondDawnType.REBORN == diamondDawnType) {
            metadataAttributes[3] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Carat",
                _pointsToCaratString(polishedDiamond.points)
            );
            metadataAttributes[4] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Color",
                    polishedDiamond.color
            );
            metadataAttributes[5] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Cut",
                    polishedDiamond.cut
            );
            metadataAttributes[6] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Depth",
                    polishedDiamond.depth
            );
            metadataAttributes[7] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Fluorescence",
                    polishedDiamond.fluorescence
            );
            metadataAttributes[8] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Length",
                    polishedDiamond.length
            );
            metadataAttributes[9] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Shape",
                _toDiamondShapeString(polishedDiamond.shape)
            );
            metadataAttributes[10] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Width",
                    polishedDiamond.width
            );
            // Polish
            metadataAttributes[11] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Clarity",
                    polishedDiamond.clarity
            );
            metadataAttributes[12] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Polish",
                    polishedDiamond.polish
            );
            metadataAttributes[13] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Symmetry",
                    polishedDiamond.symmetry
            );
            // Rebirth
            metadataAttributes[14] = _getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Laboratory",
                "GIA"
            );
            metadataAttributes[15] = _getERC721MetadataAttribute(
                false,
                true,
                false,
                "",
                "Report Date",
                Strings.toString(polishedDiamond.reportDate)
            );
            metadataAttributes[16] = _getERC721MetadataAttribute(
                false,
                true,
                false,
                "",
                "Report Number",
                Strings.toString(polishedDiamond.reportNumber)
            );
        }else {
            revert("Failed to create diamond json attributes");
        }
        return metadataAttributes;
    }

    function _getERC721MetadataAttribute(
        bool includeDisplayType,
        bool includeTraitType,
        bool isValueAString,
        string memory displayType,
        string memory traitType,
        string memory value
    ) private pure returns (ERC721MetadataAttribute memory) {
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

    function _generateERC721Metadata(ERC721MetadataStructure memory metadata)
        private
        pure
        returns (string memory)
    {
        bytes memory byteString;
        byteString = abi.encodePacked(byteString, _openJsonObject());
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute("name", metadata.name, true)
        );
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute(
                "description",
                metadata.description,
                true
            )
        );
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute(
                "created_by",
                metadata.createdBy,
                true
            )
        );
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute("image", metadata.image, true)
        );
        byteString = abi.encodePacked(
            byteString,
            _pushJsonComplexAttribute(
                "attributes",
                _getAttributes(metadata.attributes),
                false
            )
        );
        byteString = abi.encodePacked(byteString, _closeJsonObject());

        return string(byteString);
    }

    function _getAttributes(ERC721MetadataAttribute[] memory attributes)
        private
        pure
        returns (string memory)
    {
        bytes memory byteString;
        byteString = abi.encodePacked(byteString, _openJsonArray());
        for (uint i = 0; i < attributes.length; i++) {
            ERC721MetadataAttribute memory attribute = attributes[i];
            byteString = abi.encodePacked(
                byteString,
                _pushJsonArrayElement(
                    _getAttribute(attribute),
                    i < (attributes.length - 1)
                )
            );
        }
        byteString = abi.encodePacked(byteString, _closeJsonArray());

        return string(byteString);
    }

    function _getAttribute(ERC721MetadataAttribute memory attribute)
        private
        pure
        returns (string memory)
    {
        bytes memory byteString;

        byteString = abi.encodePacked(byteString, _openJsonObject());

        if (attribute.includeDisplayType) {
            byteString = abi.encodePacked(
                byteString,
                _pushJsonPrimitiveStringAttribute(
                    "display_type",
                    attribute.displayType,
                    true
                )
            );
        }

        if (attribute.includeTraitType) {
            byteString = abi.encodePacked(
                byteString,
                _pushJsonPrimitiveStringAttribute(
                    "trait_type",
                    attribute.traitType,
                    true
                )
            );
        }

        if (attribute.isValueAString) {
            byteString = abi.encodePacked(
                byteString,
                _pushJsonPrimitiveStringAttribute(
                    "value",
                    attribute.value,
                    false
                )
            );
        } else {
            byteString = abi.encodePacked(
                byteString,
                _pushJsonPrimitiveNonStringAttribute(
                    "value",
                    attribute.value,
                    false
                )
            );
        }

        byteString = abi.encodePacked(byteString, _closeJsonObject());

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

    function _pushJsonPrimitiveStringAttribute(
        string memory key,
        string memory value,
        bool insertComma
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '"',
                    key,
                    '": "',
                    value,
                    '"',
                    insertComma ? "," : ""
                )
            );
    }

    function _pushJsonPrimitiveNonStringAttribute(
        string memory key,
        string memory value,
        bool insertComma
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked('"', key, '": ', value, insertComma ? "," : "")
            );
    }

    function _pushJsonComplexAttribute(
        string memory key,
        string memory value,
        bool insertComma
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked('"', key, '": ', value, insertComma ? "," : "")
            );
    }

    function _pushJsonArrayElement(string memory value, bool insertComma)
        private
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(value, insertComma ? "," : ""));
    }

    /**********************     Internal & Helpers     ************************/

    function _videoBaseURI() internal pure returns (string memory) {
        // TODO: in production we'll get the full ipfs/arweave url - base URI will change.
        return
            "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";
    }

    function _getDiamondDawnVideoUrl(
        DiamondDawnMetadata memory diamondDawnMetadata
    ) internal view returns (string memory) {
        DiamondDawnType diamondDawnType = diamondDawnMetadata.diamondDawnType;
        string memory videoUrl;
        if (DiamondDawnType.ROUGH == diamondDawnType) {
            videoUrl = _roughShapeToVideoUrls[uint(diamondDawnMetadata.roughDiamondMetadata.shape)];
        } else if (DiamondDawnType.CUT == diamondDawnType) {
            videoUrl = _cutShapeToVideoUrls[uint(diamondDawnMetadata.polish.shape)];
        } else if (DiamondDawnType.POLISHED == diamondDawnType) {
            videoUrl = _polishShapeToVideoUrls[uint(diamondDawnMetadata.polish.shape)];
        } else if (DiamondDawnType.BURNED == diamondDawnType) {
            videoUrl = _burnVideoUrl;
        } else if (DiamondDawnType.REBORN == diamondDawnType) {
            videoUrl = _rebirthVideoUrl;
        } else {
            revert("Failed fetching DiamondDawn video url - unknown type");
        }
        return string.concat(_videoBaseURI(), videoUrl);
    }

    function _setAdminAndAddToAllowList(address[] memory addresses) internal {
        for (uint i = 0; i < addresses.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, addresses[i]);
        }
    }
}
