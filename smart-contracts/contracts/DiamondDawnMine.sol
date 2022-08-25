// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";
import "./objects/MineObjects.sol";
import "./objects/DiamondObjects.sol";
import "./utils/NFTMetadataUtils.sol";
import "./utils/StringUtils.sol";
import "./utils/RandomUtils.sol";
import "./objects/MineObjects.sol";

/**
 * @title DiamondDawnMine NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawnMine is
    AccessControl,
    IDiamondDawnMine,
    IDiamondDawnMineAdmin
{
    bool public isClosed = true; // mine is closed until it's initialized.
    bool public isLocked = false; // mine is locked forever when the project ends (immutable).
    mapping(uint => mapping(uint => string)) public typeToShapeVideo;

    uint private constant NO_SHAPE_NUM = 0;
    // Carat loss of ~35% to ~65% from rough stone to the polished diamond.
    uint private constant MIN_ROUGH_EXTRA_POINTS = 38;
    uint private constant MAX_ROUGH_EXTRA_POINTS = 74;
    // Carat loss of ~2% to ~8% in the polish process.
    uint private constant MIN_POLISH_EXTRA_POINTS = 1;
    uint private constant MAX_POLISH_EXTRA_POINTS = 4;

    uint private _maxDiamonds;
    uint private _diamondsCnt = 0;
    uint private _randNonce = 0;
    mapping(uint => Metadata) private _metadata;
    address private _diamondDawn;
    Certificate[] private _mine;
    Certificate private EMPTY_DIAMOND =
        Certificate({
            points: 0,
            reportDate: 0,
            reportNumber: 0,
            measurements: "",
            clarity: Clarity.NO_CLARITY,
            color: Color.NO_COLOR,
            cut: Grade.NO_GRADE,
            symmetry: Grade.NO_GRADE,
            polish: Grade.NO_GRADE,
            fluorescence: Fluorescence.NO_FLUORESCENCE,
            shape: Shape.NO_SHAPE
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
        require(msg.sender == _diamondDawn, "Only DD");
        _;
    }

    modifier exists(uint tokenId) {
        require(_metadata[tokenId].type_ != Type.NO_TYPE, "Don't exist");
        _;
    }

    modifier onlyType(uint tokenId, Type diamondDawnType) {
        require(diamondDawnType == _metadata[tokenId].type_, "Wrong type");
        _;
    }

    modifier mineClosed() {
        require(isClosed, "Open mine");
        _;
    }

    modifier mineOpen() {
        require(!isClosed, "Closed mine");
        _;
    }

    modifier mineNotLocked() {
        require(!isLocked, "Locked mine");
        _;
    }

    modifier mineOverflow(uint cnt) {
        require((_diamondsCnt + cnt) <= _maxDiamonds, "Mine overflow");
        _;
    }

    modifier mineNotDry() {
        require(_mine.length > 0, "Dry mine");
        _;
    }

    /**********************     External Functions     ************************/

    function enter(uint tokenId)
        external
        onlyDiamondDawn
        mineOpen
        onlyType(tokenId, Type.NO_TYPE)
    {
        _metadata[tokenId] = Metadata({
            type_: Type.ENTER_MINE,
            rough: RoughMetadata({shape: RoughShape.NO_SHAPE, extraPoints: 0}),
            cut: CutMetadata({extraPoints: 0}),
            certificate: EMPTY_DIAMOND
        });
    }

    function mine(uint tokenId) external onlyDiamondDawn mineOpen mineNotDry onlyType(tokenId, Type.ENTER_MINE) {
        uint extraPoints = _getRandomBetween(
            MIN_ROUGH_EXTRA_POINTS,
            MAX_ROUGH_EXTRA_POINTS
        );
        Metadata storage metadata = _metadata[tokenId];
        metadata.type_ = Type.ROUGH;
        metadata.rough = RoughMetadata({
            shape: RoughShape.MAKEABLE,
            extraPoints: extraPoints
        });
        metadata.certificate = _mineDiamond();
    }

    function cut(uint256 tokenId)
        external
        onlyDiamondDawn
        mineOpen
        onlyType(tokenId, Type.ROUGH)
    {
        uint extraPoints = _getRandomBetween(
            MIN_POLISH_EXTRA_POINTS,
            MAX_POLISH_EXTRA_POINTS
        );
        Metadata storage diamondDawnMetadata = _metadata[tokenId];
        diamondDawnMetadata.cut.extraPoints = extraPoints;
        diamondDawnMetadata.type_ = Type.CUT;
    }

    function polish(uint256 tokenId)
        external
        onlyDiamondDawn
        mineOpen
        onlyType(tokenId, Type.CUT)
    {
        _metadata[tokenId].type_ = Type.POLISHED;
    }

    function rebirth(uint256 tokenId)
        external
        onlyDiamondDawn
        onlyType(tokenId, Type.POLISHED)
    {
        _metadata[tokenId].type_ = Type.REBORN;
    }

    function initialize(address diamondDawn, uint maxDiamonds)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _diamondDawn = diamondDawn;
        _maxDiamonds = maxDiamonds;
        isClosed = false;
    }

    function eruption(Certificate[] calldata diamonds)
        external
        mineNotLocked
        mineOverflow(diamonds.length)
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < diamonds.length; i++) {
            _mine.push(diamonds[i]);
        }
        _diamondsCnt += diamonds.length;
    }

    function replaceLostShipment(uint tokenId, Certificate calldata diamond)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Metadata storage metadata = _metadata[tokenId];
        require(
            metadata.type_ == Type.POLISHED || metadata.type_ == Type.REBORN
        );
        metadata.certificate = diamond;
    }

    function setClosed(bool isClosed_)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        isClosed = isClosed_;
    }

    function setTypeVideos(Type type_, ShapeVideo[] calldata shapeVideos)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(type_ != Type.NO_TYPE);
        for (uint i = 0; i < shapeVideos.length; i++) {
            require(bytes(shapeVideos[i].video).length > 0);
            _setVideo(type_, shapeVideos[i].shape, shapeVideos[i].video);
        }
    }

    function lockMine() external onlyDiamondDawn mineClosed {
        isLocked = true;
    }

    function getDiamondCount()
        external
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint)
    {
        return _diamondsCnt;
    }

    function getDiamondMetadata(uint tokenId)
        external
        view
        onlyDiamondDawn
        exists(tokenId)
        returns (string memory)
    {
        Metadata memory metadata = _metadata[tokenId];
        string memory videoURI = _getVideoURI(metadata);
        string memory base64Json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        _getMetadataJson(tokenId, metadata, videoURI)
                    )
                )
            )
        );

        return
            string(
                abi.encodePacked("data:application/json;base64,", base64Json)
            );
    }

    function isMineReady(Type type_) external view returns (bool) {
        if (type_ == Type.ENTER_MINE || type_ == Type.REBORN) return _isVideoExist(type_, NO_SHAPE_NUM);
        if (type_ == Type.ROUGH && _diamondsCnt != _maxDiamonds) return false;
        uint maxShape = type_ == Type.ROUGH ? uint(type(RoughShape).max) : uint(type(Shape).max);
        for (uint i = 1; i <= maxShape; i++) {
            // skipping 0 - no shape
            if (!_isVideoExist(type_, maxShape)) return false;
        }
        return true;
    }

    /**********************     Private Functions     ************************/

    function _mineDiamond() private returns (Certificate memory) {
        // TODO: check if there's a library that pops a random element from the list.
        uint randomIndex = _getRandomBetween(0, _mine.length - 1);
        Certificate memory diamond = _mine[randomIndex];

        // TODO: Move the last element into the place to delete
        if (_mine.length > 1) {
            _mine[randomIndex] = _mine[_mine.length - 1];
        }
        _mine.pop();
        return diamond;
    }

    function _getRandomBetween(uint min, uint max) private returns (uint) {
        _randNonce++;
        return getRandomInRange(min, max, _randNonce);
    }

    function _setVideo(
        Type type_,
        uint shape,
        string memory videoUrl
    ) private {
        typeToShapeVideo[uint(type_)][shape] = videoUrl;
    }

    function _getVideoURI(Metadata memory metadata)
        private
        view
        returns (string memory)
    {
        string memory videoUrl = _getVideo(
            metadata.type_,
            _getShapeNumber(metadata)
        );
        return string.concat(_videoBaseURI(), videoUrl);
    }

    function _isVideoExist(Type type_, uint shape) private view returns (bool) {
        return bytes(_getVideo(type_, shape)).length > 0;
    }

    function _getVideo(Type type_, uint shape)
        private
        view
        returns (string memory)
    {
        return typeToShapeVideo[uint(type_)][shape];
    }

    function _getMetadataJson(
        uint tokenId,
        Metadata memory metadata,
        string memory videoURI
    ) private pure returns (string memory) {
        // TODO: Add real description
        NFTMetadata memory nftMetadata = NFTMetadata({
            name: string(
                abi.encodePacked("Diamond #", Strings.toString(tokenId))
            ),
            description: "description",
            createdBy: "dd",
            image: videoURI,
            attributes: _getJsonAttributes(metadata)
        });
        return toJsonMetadata(nftMetadata);
    }

    function _getJsonAttributes(Metadata memory metadata)
        private
        pure
        returns (Attribute[] memory)
    {
        Type type_ = metadata.type_;
        Attribute[] memory attributes = new Attribute[](
            _getNumAttributes(type_)
        );
        attributes[0] = getStringAttribute("Type", toTypeString(type_));
        if (type_ == Type.ENTER_MINE) {
            return attributes;
        }

        attributes[1] = getStringAttribute("Origin", "Metaverse");
        attributes[2] = getStringAttribute("Identification", "Natural");
        attributes[3] = getAttribute(
            "Carat",
            getCaratString(_getPoints(metadata)),
            "",
            false
        );
        if (type_ == Type.ROUGH) {
            attributes[4] = getStringAttribute("Color", "Cape");
            attributes[5] = getStringAttribute(
                "Shape",
                toRoughShapeString(metadata.rough.shape)
            );
            attributes[6] = getStringAttribute("Mine", "Underground");
            return attributes;
        }

        Certificate memory certificate = metadata.certificate;
        if (uint(Type.CUT) <= uint(type_)) {
            attributes[4] = getStringAttribute(
                "Color",
                toColorString(certificate.color)
            );
            attributes[5] = getStringAttribute(
                "Cut",
                toGradeString(certificate.cut)
            );
            attributes[6] = getStringAttribute(
                "Fluorescence",
                toFluorescenceString(certificate.fluorescence)
            );
            attributes[7] = getStringAttribute(
                "Measurements",
                certificate.measurements
            );
            attributes[8] = getStringAttribute(
                "Shape",
                toShapeString(certificate.shape)
            );
        }
        if (uint(Type.POLISHED) <= uint(type_)) {
            attributes[9] = getStringAttribute(
                "Clarity",
                toClarityString(certificate.clarity)
            );
            attributes[10] = getStringAttribute(
                "Polish",
                toGradeString(certificate.polish)
            );
            attributes[11] = getStringAttribute(
                "Symmetry",
                toGradeString(certificate.symmetry)
            );
        }
        if (uint(Type.REBORN) <= uint(type_)) {
            attributes[12] = getStringAttribute("Laboratory", "GIA");
            attributes[13] = getAttribute(
                "Report Date",
                Strings.toString(certificate.reportDate),
                "date",
                false
            );
            attributes[14] = getAttribute(
                "Report Number",
                Strings.toString(certificate.reportNumber),
                "",
                false
            );
        }
        return attributes;
    }

    function _videoBaseURI() private pure returns (string memory) {
        // TODO: in production we'll get the full ipfs/arweave url - base URI will change.
        // TODO: galk to check what's the best approach
        return
            "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";
    }

    function _getShapeNumber(Metadata memory metadata)
        private
        pure
        returns (uint)
    {
        Type type_ = metadata.type_;
        if (type_ == Type.CUT || type_ == Type.POLISHED)
            return uint(metadata.certificate.shape);
        if (type_ == Type.ROUGH) return uint(metadata.rough.shape);
        if (type_ == Type.ENTER_MINE || type_ == Type.REBORN)
            return NO_SHAPE_NUM;
        revert();
    }

    function _getNumAttributes(Type type_) private pure returns (uint) {
        if (type_ == Type.ENTER_MINE) return 1;
        else if (type_ == Type.ROUGH) return 7;
        else if (type_ == Type.CUT) return 9;
        else if (type_ == Type.POLISHED) return 12;
        else if (type_ == Type.REBORN) return 15;
        revert();
    }

    function _getPoints(Metadata memory metadata) private pure returns (uint) {
        assert(metadata.certificate.points > 0);
        if (metadata.type_ == Type.ROUGH) {
            assert(metadata.rough.extraPoints > 0);
            return metadata.certificate.points + metadata.rough.extraPoints;
        } else if (metadata.type_ == Type.CUT) {
            assert(metadata.cut.extraPoints > 0);
            return metadata.certificate.points + metadata.cut.extraPoints;
        } else if (
            metadata.type_ == Type.POLISHED || metadata.type_ == Type.REBORN
        ) return metadata.certificate.points;
        revert();
    }
}
