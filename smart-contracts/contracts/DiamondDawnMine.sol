// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";
import {getERC721MetadataAttribute, generateERC721Metadata, ERC721MetadataAttribute, ERC721MetadataStructure} from "./utils/ERC721MetadataUtils.sol";
import {rand} from "./utils/RandomUtils.sol";

/**
 * @title DiamondDawnMine NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawnMine is
    AccessControl,
    IDiamondDawnMine,
    IDiamondDawnMineAdmin
{
    enum RoughShape {
        NO_SHAPE,
        MAKEABLE
    }

    struct RoughMetadata {
        RoughShape shape;
        uint pointsReduction;
    }

    struct CutMetadata {
        uint pointsReduction;
    }

    struct Metadata {
        Type type_;
        RoughMetadata rough;
        CutMetadata cut;
        Certificate certificate;
    }

    bool public isMineOpen = false; // mine is closed until it's initialized.
    bool public isMineLocked = false; // mine is locked forever when the project ends (immutable).

    // Video Urls
    string public mineEntranceVideoUrl;
    string public roughMakeableVideoUrl;
    string public cutPearVideoUrl;
    string public cutRoundVideoUrl;
    string public cutOvalVideoUrl;
    string public cutRadiantVideoUrl;
    string public polishPearVideoUrl;
    string public polishRoundVideoUrl;
    string public polishOvalVideoUrl;
    string public polishRadiantVideoUrl;
    string public rebirthVideoUrl;

    // Carat loss of ~35% to ~65% from rough stone to the polished diamond.
    uint private constant MIN_ROUGH_POINTS_REDUCTION = 38;
    uint private constant MAX_ROUGH_POINTS_REDUCTION = 74;
    // Carat loss from ~2% to ~8% in the polish process.
    uint private constant MIN_POLISH_POINTS_REDUCTION = 1;
    uint private constant MAX_POLISH_POINTS_REDUCTION = 4;

    uint private _randNonce = 0;
    mapping(uint => Metadata) private _metadata;
    address private _diamondDawn;
    Certificate[] private _diamonds;
    Certificate private NO_DIAMOND =
        Certificate({
            clarity: "",
            color: "",
            cut: "",
            fluorescence: "",
            measurements: "",
            points: 0,
            polish: "",
            reportDate: 0,
            reportNumber: 0,
            shape: DiamondShape.NO_SHAPE,
            symmetry: ""
        });

    constructor(address[] memory adminAddresses) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        // TODO: remove admins after testing
        for (uint i = 0; i < adminAddresses.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, adminAddresses[i]);
        }
    }

    /**********************     Modifiers     ************************/
    modifier onlyDiamondDawn() {
        require(msg.sender == _diamondDawn, "OnlyDiamondDawn allowed");
        _;
    }

    modifier onlyExistingTokens(uint tokenId) {
        require(_metadata[tokenId].type_ != Type.NO_TYPE, "No token id");
        _;
    }

    modifier onlyDiamondDawnType(uint tokenId, Type diamondDawnType) {
        require(diamondDawnType == _metadata[tokenId].type_, "Invalid type");
        _;
    }

    modifier mineClosed() {
        require(!isMineOpen, "Mine is open");
        _;
    }

    modifier mineOpen() {
        require(isMineOpen, "Mine is closed");
        _;
    }

    modifier mineNotLocked() {
        require(!isMineLocked, "Mine is locked forever");
        _;
    }

    modifier mineNotDry() {
        require(_diamonds.length > 0, "Mine is empty");
        _;
    }

    /**********************     External Functions     ************************/

    function initialize(address diamondDawn)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _diamondDawn = diamondDawn;
        isMineOpen = true;
    }

    function diamondEruption(Certificate[] calldata diamonds)
        external
        mineNotLocked
        //        mineClosed
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < diamonds.length; i++) {
            _diamonds.push(diamonds[i]);
        }
    }

    function setIsMineOpen(bool isMineOpen_)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        isMineOpen = isMineOpen_;
    }

    function setMineEntranceVideoUrl(string calldata mineEntranceUrl)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        mineEntranceVideoUrl = mineEntranceUrl;
    }

    function setRoughVideoUrl(string calldata makeable)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        roughMakeableVideoUrl = makeable;
    }

    function setCutVideoUrls(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external mineNotLocked onlyRole(DEFAULT_ADMIN_ROLE) {
        cutPearVideoUrl = pear;
        cutRoundVideoUrl = round;
        cutOvalVideoUrl = oval;
        cutRadiantVideoUrl = radiant;
    }

    function setPolishVideoUrls(
        string calldata pear,
        string calldata round,
        string calldata oval,
        string calldata radiant
    ) external mineNotLocked onlyRole(DEFAULT_ADMIN_ROLE) {
        polishPearVideoUrl = pear;
        polishOvalVideoUrl = oval;
        polishRoundVideoUrl = round;
        polishRadiantVideoUrl = radiant;
    }

    function setRebirthVideoUrl(string calldata rebirth_)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rebirthVideoUrl = rebirth_;
    }

    function replaceLostShipment(uint tokenId, Certificate calldata diamond)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Metadata storage metadata = _metadata[tokenId];
        require(
            metadata.type_ == Type.POLISHED || metadata.type_ == Type.REBORN,
            "Not in ship stage"
        );
        metadata.certificate = diamond;
    }

    function enterMine(uint tokenId) external onlyDiamondDawn mineOpen {
        _metadata[tokenId] = Metadata({
            type_: Type.ENTER_MINE,
            rough: RoughMetadata({
                shape: RoughShape.NO_SHAPE,
                pointsReduction: 0
            }),
            cut: CutMetadata({pointsReduction: 0}),
            certificate: NO_DIAMOND
        });
    }

    function mine(uint tokenId) external onlyDiamondDawn mineOpen mineNotDry {
        uint pointsReduction = _getRandomNumberInRange(
            MIN_ROUGH_POINTS_REDUCTION,
            MAX_ROUGH_POINTS_REDUCTION
        );
        Metadata storage metadata = _metadata[tokenId];
        metadata.type_ = Type.ROUGH;
        metadata.rough = RoughMetadata({
            shape: RoughShape.MAKEABLE,
            pointsReduction: pointsReduction
        });
        metadata.certificate = _mineDiamond();
    }

    function cut(uint256 tokenId)
        external
        onlyDiamondDawn
        mineOpen
        onlyDiamondDawnType(tokenId, Type.ROUGH)
    {
        uint pointsReduction = _getRandomNumberInRange(
            MIN_POLISH_POINTS_REDUCTION,
            MAX_POLISH_POINTS_REDUCTION
        );
        Metadata storage diamondDawnMetadata = _metadata[tokenId];
        diamondDawnMetadata.cut.pointsReduction = pointsReduction;
        diamondDawnMetadata.type_ = Type.CUT;
    }

    function polish(uint256 tokenId)
        external
        onlyDiamondDawn
        mineOpen
        onlyDiamondDawnType(tokenId, Type.CUT)
    {
        _metadata[tokenId].type_ = Type.POLISHED;
    }

    function rebirth(uint256 tokenId)
        external
        onlyDiamondDawn
        onlyDiamondDawnType(tokenId, Type.POLISHED)
    {
        _metadata[tokenId].type_ = Type.REBORN;
    }

    function lockMine() external onlyDiamondDawn mineClosed {
        isMineLocked = true;
    }

    function getDiamondCount()
        external
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint)
    {
        return _diamonds.length;
    }

    function getDiamondMetadata(uint tokenId)
        external
        view
        onlyDiamondDawn
        onlyExistingTokens(tokenId)
        returns (string memory)
    {
        Metadata memory metadata = _metadata[tokenId];
        string memory videoUrl = _getVideoUrl(metadata);
        string memory base64Json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        _getMetadataJson(tokenId, metadata, videoUrl)
                    )
                )
            )
        );

        return
            string(
                abi.encodePacked("data:application/json;base64,", base64Json)
            );
    }

    function isMineEntranceReady() external view returns (bool) {
        return bytes(mineEntranceVideoUrl).length > 0;
    }

    function isMineReady() external view returns (bool) {
        return bytes(roughMakeableVideoUrl).length > 0;
    }

    function isCutReady() external view returns (bool) {
        return
            bytes(cutPearVideoUrl).length > 0 &&
            bytes(cutRoundVideoUrl).length > 0 &&
            bytes(cutOvalVideoUrl).length > 0 &&
            bytes(cutRadiantVideoUrl).length > 0;
    }

    function isPolishReady() external view returns (bool) {
        return
            bytes(polishPearVideoUrl).length > 0 &&
            bytes(polishRoundVideoUrl).length > 0 &&
            bytes(polishOvalVideoUrl).length > 0 &&
            bytes(polishRadiantVideoUrl).length > 0;
    }

    function isShipReady() external view returns (bool) {
        return bytes(rebirthVideoUrl).length > 0;
    }

    /**********************     Private Functions     ************************/

    function _mineDiamond() private returns (Certificate memory) {
        // TODO: check if there's a library that pops a random element from the list.
        uint randomIndex = _getRandomNumberInRange(0, _diamonds.length - 1);
        Certificate memory diamond = _diamonds[randomIndex];

        // TODO: Move the last element into the place to delete
        if (_diamonds.length > 1) {
            _diamonds[randomIndex] = _diamonds[_diamonds.length - 1];
        }
        _diamonds.pop();
        return diamond;
    }

    function _getRandomNumberInRange(uint minNumber, uint maxNumber)
        private
        returns (uint)
    {
        _randNonce++;
        uint range = maxNumber - minNumber + 1;
        uint randomNumber = rand(_randNonce);
        return (randomNumber % range) + minNumber;
    }

    function _getVideoUrl(Metadata memory metadata)
        private
        view
        returns (string memory)
    {
        Type diamondDawnType = metadata.type_;
        string memory videoUrl;
        if (Type.ENTER_MINE == diamondDawnType) {
            videoUrl = mineEntranceVideoUrl;
        } else if (Type.ROUGH == diamondDawnType) {
            videoUrl = roughMakeableVideoUrl;
        } else if (
            Type.CUT == diamondDawnType || Type.POLISHED == diamondDawnType
        ) {
            videoUrl = _getVideoUrlForShape(
                diamondDawnType,
                metadata.certificate.shape
            );
        } else if (Type.REBORN == diamondDawnType) {
            videoUrl = rebirthVideoUrl;
        } else {
            revert("Unknown type");
        }
        return string.concat(_videoBaseURI(), videoUrl);
    }

    function _getVideoUrlForShape(Type type_, DiamondShape shape)
        private
        view
        returns (string memory)
    {
        // TODO: assert type cut or polished
        if (shape == DiamondShape.PEAR) {
            return type_ == Type.CUT ? cutPearVideoUrl : polishPearVideoUrl;
        } else if (shape == DiamondShape.ROUND) {
            return type_ == Type.CUT ? cutRoundVideoUrl : polishRoundVideoUrl;
        } else if (shape == DiamondShape.OVAL) {
            return type_ == Type.CUT ? cutOvalVideoUrl : polishOvalVideoUrl;
        } else if (shape == DiamondShape.RADIANT) {
            return
                type_ == Type.CUT ? cutRadiantVideoUrl : polishRadiantVideoUrl;
        }
        revert("Unknown shape");
    }

    function _videoBaseURI() private pure returns (string memory) {
        // TODO: in production we'll get the full ipfs/arweave url - base URI will change.
        // TODO: galk to check what's the best approach
        return
            "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";
    }

    function _getMetadataJson(
        uint tokenId,
        Metadata memory metadata,
        string memory videoUrl
    ) private pure returns (string memory) {
        // TODO: Add real description
        ERC721MetadataStructure
            memory erc721Metadata = ERC721MetadataStructure({
                name: string(
                    abi.encodePacked("Diamond #", Strings.toString(tokenId))
                ),
                description: "description",
                createdBy: "dd",
                image: videoUrl,
                attributes: _getJsonAttributes(metadata)
            });
        return generateERC721Metadata(erc721Metadata);
    }

    function _getJsonAttributes(Metadata memory metadata)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        Type diamondDawnType = metadata.type_;
        if (Type.ENTER_MINE == diamondDawnType) {
            return _getMineEntranceJsonAttributes();
        } else if (Type.ROUGH == diamondDawnType) {
            return
                _getRoughDiamondJsonAttributes(
                    metadata.rough,
                    metadata.certificate
                );
        } else if (Type.CUT == diamondDawnType) {
            return
                _getCutDiamondJsonAttributes(
                    metadata.cut,
                    metadata.certificate
                );
        } else if (Type.POLISHED == diamondDawnType) {
            return _getPolishedDiamondJsonAttributes(metadata.certificate);
        } else if (Type.REBORN == diamondDawnType) {
            return _getRebornDiamondJsonAttributes(metadata.certificate);
        }
        revert("Unknown type");
    }

    function _getTypeAttribute(Type diamondDawnType)
        private
        pure
        returns (ERC721MetadataAttribute memory)
    {
        return
            getERC721MetadataAttribute(
                false,
                true,
                true,
                "",
                "Type",
                _toDiamondDawnTypeString(diamondDawnType)
            );
    }

    function _getMineEntranceJsonAttributes()
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](1);
        metadataAttributes[0] = _getTypeAttribute(Type.ENTER_MINE);
        return metadataAttributes;
    }

    function _getBaseJsonAttributes(Type diamondDawnType, uint points)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721MetadataAttribute[3] memory)).
        assert(points > 0);
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](4);
        metadataAttributes[0] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Origin",
            "Metaverse"
        );
        metadataAttributes[1] = _getTypeAttribute(diamondDawnType);
        metadataAttributes[2] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Identification",
            "Natural"
        );
        metadataAttributes[3] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Carat",
            _toCaratString(points)
        );
        return metadataAttributes;
    }

    function _getRoughJsonAttributes(RoughMetadata memory rough)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721MetadataAttribute[3] memory)).
        ERC721MetadataAttribute[]
            memory roughMetadataAttributes = new ERC721MetadataAttribute[](3);
        roughMetadataAttributes[0] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Color",
            "CAPE"
        );
        roughMetadataAttributes[1] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toRoughShapeString(rough.shape)
        );
        roughMetadataAttributes[2] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Mine",
            "Underground"
        );
        return roughMetadataAttributes;
    }

    function _getCutJsonAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721MetadataAttribute[5] memory)).
        ERC721MetadataAttribute[]
            memory cutMetadataAttributes = new ERC721MetadataAttribute[](5);
        cutMetadataAttributes[0] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Color",
            certificate.color
        );
        cutMetadataAttributes[1] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Cut",
            certificate.cut
        );
        cutMetadataAttributes[2] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Fluorescence",
            certificate.fluorescence
        );
        cutMetadataAttributes[3] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Measurements",
            certificate.measurements
        );
        cutMetadataAttributes[4] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toShapeString(certificate.shape)
        );
        return cutMetadataAttributes;
    }

    function _getPolishJsonAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721MetadataAttribute[5] memory)).
        ERC721MetadataAttribute[]
            memory polishMetadataAttributes = new ERC721MetadataAttribute[](3);
        polishMetadataAttributes[0] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Clarity",
            certificate.clarity
        );
        polishMetadataAttributes[1] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Polish",
            certificate.polish
        );
        polishMetadataAttributes[2] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Symmetry",
            certificate.symmetry
        );
        return polishMetadataAttributes;
    }

    function _getRebirthJsonAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721MetadataAttribute[5] memory)).
        ERC721MetadataAttribute[]
            memory rebirthMetadataAttributes = new ERC721MetadataAttribute[](3);
        rebirthMetadataAttributes[0] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Laboratory",
            "GIA"
        );
        rebirthMetadataAttributes[1] = getERC721MetadataAttribute(
            false,
            true,
            false,
            "",
            "Report Date",
            Strings.toString(certificate.reportDate)
        );
        rebirthMetadataAttributes[2] = getERC721MetadataAttribute(
            false,
            true,
            false,
            "",
            "Report Number",
            Strings.toString(certificate.reportNumber)
        );
        return rebirthMetadataAttributes;
    }

    function _getRoughDiamondJsonAttributes(
        RoughMetadata memory rough,
        Certificate memory certificate
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        assert(rough.pointsReduction > 0);
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseJsonAttributes(
                Type.ROUGH,
                certificate.points + rough.pointsReduction
            );

        ERC721MetadataAttribute[]
            memory roughAttributes = _getRoughJsonAttributes(rough);

        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](7);
        // TODO make it more generic
        // Base
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];
        // Rough
        metadataAttributes[4] = roughAttributes[0];
        metadataAttributes[5] = roughAttributes[1];
        metadataAttributes[6] = roughAttributes[2];
        return metadataAttributes;
    }

    function _getCutDiamondJsonAttributes(
        CutMetadata memory cutMetadata,
        Certificate memory certificate
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        assert(cutMetadata.pointsReduction > 0);
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseJsonAttributes(
                Type.CUT,
                certificate.points + cutMetadata.pointsReduction
            );
        ERC721MetadataAttribute[] memory cutAttributes = _getCutJsonAttributes(
            certificate
        );
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](9);

        // TODO make it more generic
        // Base
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];
        // Cut
        metadataAttributes[4] = cutAttributes[0];
        metadataAttributes[5] = cutAttributes[1];
        metadataAttributes[6] = cutAttributes[2];
        metadataAttributes[7] = cutAttributes[3];
        metadataAttributes[8] = cutAttributes[4];
        return metadataAttributes;
    }

    function _getPolishedDiamondJsonAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseJsonAttributes(
                Type.POLISHED,
                certificate.points
            );
        ERC721MetadataAttribute[] memory cutAttributes = _getCutJsonAttributes(
            certificate
        );
        ERC721MetadataAttribute[]
            memory polishAttributes = _getPolishJsonAttributes(certificate);

        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](12);
        // TODO make it more generic
        // Base
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];
        // Cut
        metadataAttributes[4] = cutAttributes[0];
        metadataAttributes[5] = cutAttributes[1];
        metadataAttributes[6] = cutAttributes[2];
        metadataAttributes[7] = cutAttributes[3];
        metadataAttributes[8] = cutAttributes[4];
        // Polish
        metadataAttributes[9] = polishAttributes[0];
        metadataAttributes[10] = polishAttributes[1];
        metadataAttributes[11] = polishAttributes[2];
        return metadataAttributes;
    }

    function _getRebornDiamondJsonAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseJsonAttributes(
                Type.REBORN,
                certificate.points
            );
        ERC721MetadataAttribute[] memory cutAttributes = _getCutJsonAttributes(
            certificate
        );
        ERC721MetadataAttribute[]
            memory polishAttributes = _getPolishJsonAttributes(certificate);
        ERC721MetadataAttribute[]
            memory rebirthAttributes = _getRebirthJsonAttributes(certificate);
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](15);
        // TODO make it more generic
        // Base
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];
        // Cut
        metadataAttributes[4] = cutAttributes[0];
        metadataAttributes[5] = cutAttributes[1];
        metadataAttributes[6] = cutAttributes[2];
        metadataAttributes[7] = cutAttributes[3];
        metadataAttributes[8] = cutAttributes[4];
        // Polish
        metadataAttributes[9] = polishAttributes[0];
        metadataAttributes[10] = polishAttributes[1];
        metadataAttributes[11] = polishAttributes[2];
        // Rebirth
        metadataAttributes[12] = rebirthAttributes[0];
        metadataAttributes[13] = rebirthAttributes[1];
        metadataAttributes[14] = rebirthAttributes[2];
        return metadataAttributes;
    }

    function _toDiamondDawnTypeString(Type type_)
        private
        pure
        returns (string memory)
    {
        if (type_ == Type.ENTER_MINE) {
            return "Mine Entrance";
        } else if (type_ == Type.ROUGH) {
            return "Rough";
        } else if (type_ == Type.CUT) {
            return "Cut";
        } else if (type_ == Type.POLISHED) {
            return "Polished";
        } else if (type_ == Type.REBORN) {
            return "Reborn";
        }
        revert("Unknown type");
    }

    function _toRoughShapeString(RoughShape shape)
        private
        pure
        returns (string memory)
    {
        if (shape == RoughShape.MAKEABLE) {
            return "Makeable";
        }
        revert("Unknown shape");
    }

    function _toShapeString(DiamondShape shape)
        private
        pure
        returns (string memory)
    {
        if (shape == DiamondShape.PEAR) {
            return "Pear";
        } else if (shape == DiamondShape.ROUND) {
            return "Round";
        } else if (shape == DiamondShape.OVAL) {
            return "Oval";
        } else if (shape == DiamondShape.RADIANT) {
            return "Radiant";
        }
        revert("Unknown shape");
    }

    function _toCaratString(uint points) private pure returns (string memory) {
        uint pointsRemainder = points % 100;
        string memory pointsRemainderString = pointsRemainder < 10
            ? string.concat("0", Strings.toString(pointsRemainder))
            : Strings.toString(pointsRemainder);
        string memory caratString = Strings.toString(points / 100);
        return string.concat(caratString, ".", pointsRemainderString);
    }
}
