// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";
import {getERC721Attribute, generateERC721Metadata, ERC721Attribute, ERC721Metadata} from "./utils/ERC721MetadataUtils.sol";
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
            shape: Shape.NO_SHAPE,
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

    function _getVideoUrlForShape(Type type_, Shape shape)
        private
        view
        returns (string memory)
    {
        // TODO: assert type cut or polished
        if (shape == Shape.PEAR) {
            return type_ == Type.CUT ? cutPearVideoUrl : polishPearVideoUrl;
        } else if (shape == Shape.ROUND) {
            return type_ == Type.CUT ? cutRoundVideoUrl : polishRoundVideoUrl;
        } else if (shape == Shape.OVAL) {
            return type_ == Type.CUT ? cutOvalVideoUrl : polishOvalVideoUrl;
        } else if (shape == Shape.RADIANT) {
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
        ERC721Metadata memory erc721Metadata = ERC721Metadata({
            name: string(
                abi.encodePacked("Diamond #", Strings.toString(tokenId))
            ),
            description: "description",
            createdBy: "dd",
            image: videoUrl,
            attributes: _getAttributes(metadata)
        });
        return generateERC721Metadata(erc721Metadata);
    }

    function _getAttributes(Metadata memory metadata)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        Type diamondDawnType = metadata.type_;
        if (Type.ENTER_MINE == diamondDawnType) {
            return _getMineEntranceAttributes();
        } else if (Type.ROUGH == diamondDawnType) {
            return
                _getRoughDiamondAttributes(
                    metadata.rough,
                    metadata.certificate
                );
        } else if (Type.CUT == diamondDawnType) {
            return _getCutDiamondAttributes(metadata.cut, metadata.certificate);
        } else if (Type.POLISHED == diamondDawnType) {
            return _getPolishedDiamondAttributes(metadata.certificate);
        } else if (Type.REBORN == diamondDawnType) {
            return _getRebornDiamondAttributes(metadata.certificate);
        }
        revert("Unknown type");
    }

    function _getTypeAttribute(Type diamondDawnType)
        private
        pure
        returns (ERC721Attribute memory)
    {
        return
            getERC721Attribute(
                false,
                true,
                true,
                "",
                "Type",
                _toDiamondDawnTypeString(diamondDawnType)
            );
    }

    function _getMineEntranceAttributes()
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        ERC721Attribute[] memory mineEntranceAttributes = new ERC721Attribute[](
            1
        );
        mineEntranceAttributes[0] = _getTypeAttribute(Type.ENTER_MINE);
        return mineEntranceAttributes;
    }

    function _getBaseAttributes(Type diamondDawnType, uint points)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721Attribute[3] memory)).
        assert(points > 0);
        ERC721Attribute[] memory baseAttributes = new ERC721Attribute[](4);
        baseAttributes[0] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Origin",
            "Metaverse"
        );
        baseAttributes[1] = _getTypeAttribute(diamondDawnType);
        baseAttributes[2] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Identification",
            "Natural"
        );
        baseAttributes[3] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Carat",
            _toCaratString(points)
        );
        return baseAttributes;
    }

    function _getRoughAttributes(RoughMetadata memory rough)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721Attribute[3] memory)).
        ERC721Attribute[] memory roughAttributes = new ERC721Attribute[](3);
        roughAttributes[0] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Color",
            "CAPE"
        );
        roughAttributes[1] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toRoughShapeString(rough.shape)
        );
        roughAttributes[2] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Mine",
            "Underground"
        );
        return roughAttributes;
    }

    function _getCutAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721Attribute[5] memory)).
        ERC721Attribute[] memory cutAttributes = new ERC721Attribute[](5);
        cutAttributes[0] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Color",
            certificate.color
        );
        cutAttributes[1] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Cut",
            certificate.cut
        );
        cutAttributes[2] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Fluorescence",
            certificate.fluorescence
        );
        cutAttributes[3] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Measurements",
            certificate.measurements
        );
        cutAttributes[4] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toShapeString(certificate.shape)
        );
        return cutAttributes;
    }

    function _getPolishedAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721Attribute[5] memory)).
        ERC721Attribute[] memory polishedAttributes = new ERC721Attribute[](3);
        polishedAttributes[0] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Clarity",
            certificate.clarity
        );
        polishedAttributes[1] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Polish",
            certificate.polish
        );
        polishedAttributes[2] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Symmetry",
            certificate.symmetry
        );
        return polishedAttributes;
    }

    function _getRebirthAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (ERC721Attribute[5] memory)).
        ERC721Attribute[] memory rebirthAttributes = new ERC721Attribute[](3);
        rebirthAttributes[0] = getERC721Attribute(
            false,
            true,
            true,
            "",
            "Laboratory",
            "GIA"
        );
        rebirthAttributes[1] = getERC721Attribute(
            false,
            true,
            false,
            "",
            "Report Date",
            Strings.toString(certificate.reportDate)
        );
        rebirthAttributes[2] = getERC721Attribute(
            false,
            true,
            false,
            "",
            "Report Number",
            Strings.toString(certificate.reportNumber)
        );
        return rebirthAttributes;
    }

    function _getRoughDiamondAttributes(
        RoughMetadata memory rough,
        Certificate memory certificate
    ) private pure returns (ERC721Attribute[] memory) {
        assert(rough.pointsReduction > 0);
        assert(certificate.points > 0);

        ERC721Attribute[] memory baseAttributes = _getBaseAttributes(
            Type.ROUGH,
            certificate.points + rough.pointsReduction
        );

        ERC721Attribute[] memory roughAttributes = _getRoughAttributes(rough);

        ERC721Attribute[] memory metadataAttributes = new ERC721Attribute[](7);
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

    function _getCutDiamondAttributes(
        CutMetadata memory cutMetadata,
        Certificate memory certificate
    ) private pure returns (ERC721Attribute[] memory) {
        assert(cutMetadata.pointsReduction > 0);
        assert(certificate.points > 0);

        ERC721Attribute[] memory baseAttributes = _getBaseAttributes(
            Type.CUT,
            certificate.points + cutMetadata.pointsReduction
        );
        ERC721Attribute[] memory cutAttributes = _getCutAttributes(certificate);
        ERC721Attribute[] memory metadataAttributes = new ERC721Attribute[](9);

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

    function _getPolishedDiamondAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        assert(certificate.points > 0);

        ERC721Attribute[] memory baseAttributes = _getBaseAttributes(
            Type.POLISHED,
            certificate.points
        );
        ERC721Attribute[] memory cutAttributes = _getCutAttributes(certificate);
        ERC721Attribute[] memory polishAttributes = _getPolishedAttributes(
            certificate
        );

        ERC721Attribute[] memory metadataAttributes = new ERC721Attribute[](12);
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

    function _getRebornDiamondAttributes(Certificate memory certificate)
        private
        pure
        returns (ERC721Attribute[] memory)
    {
        assert(certificate.points > 0);

        ERC721Attribute[] memory baseAttributes = _getBaseAttributes(
            Type.REBORN,
            certificate.points
        );
        ERC721Attribute[] memory cutAttributes = _getCutAttributes(certificate);
        ERC721Attribute[] memory polishAttributes = _getPolishedAttributes(
            certificate
        );
        ERC721Attribute[] memory rebirthAttributes = _getRebirthAttributes(
            certificate
        );
        ERC721Attribute[] memory metadataAttributes = new ERC721Attribute[](15);
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
        if (type_ == Type.ENTER_MINE) return "Mine Entrance";
        else if (type_ == Type.ROUGH) return "Rough";
        else if (type_ == Type.CUT) return "Cut";
        else if (type_ == Type.POLISHED) return "Polished";
        else if (type_ == Type.REBORN) return "Reborn";
        revert("Unknown type");
    }

    function _toRoughShapeString(RoughShape shape)
        private
        pure
        returns (string memory)
    {
        if (shape == RoughShape.MAKEABLE) return "Makeable";
        revert("Unknown shape");
    }

    function _toShapeString(Shape shape) private pure returns (string memory) {
        if (shape == Shape.PEAR) return "Pear";
        else if (shape == Shape.ROUND) return "Round";
        else if (shape == Shape.OVAL) return "Oval";
        else if (shape == Shape.RADIANT) return "Radiant";
        revert("Unknown shape");
    }

    function _toCaratString(uint points) private pure returns (string memory) {
        uint remainder = points % 100;
        string memory caratRemainder = remainder < 10
            ? string.concat("0", Strings.toString(remainder))
            : Strings.toString(remainder);
        string memory carat = Strings.toString(points / 100);
        return string.concat(carat, ".", caratRemainder);
    }
}
