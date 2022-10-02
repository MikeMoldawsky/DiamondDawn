// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";
import "./objects/Diamond.sol";
import "./objects/Mine.sol";
import "./utils/MathUtils.sol";
import "./utils/NFTSerializer.sol";
import "./utils/StringUtils.sol";

/**
 * @title DiamondDawnMine
 * @author Mike Moldawsky (Tweezers)
 */
contract DiamondDawnMine is AccessControlEnumerable, IDiamondDawnMine, IDiamondDawnMineAdmin {
    bool public isLocked; // mine is locked forever.
    bool public isInitialized;
    uint16 public maxDiamonds;
    uint16 public diamondCount;
    address public diamondDawn;
    mapping(uint => mapping(uint => string)) public stageToShapeVideo;

    // Carat loss of ~35% to ~65% from rough stone to the polished diamond.
    uint8 private constant MIN_EXTRA_ROUGH_POINTS = 37;
    uint8 private constant MAX_EXTRA_ROUGH_POINTS = 74;
    // Carat loss of ~2% to ~8% in the polish process.
    uint8 private constant MIN_EXTRA_POLISH_POINTS = 1;
    uint8 private constant MAX_EXTRA_POLISH_POINTS = 4;

    uint16 private _mineCounter;
    uint16 private _cutCounter;
    uint16 private _polishedCounter;
    uint16 private _rebornCounter;
    uint16 private _randNonce = 0;
    Certificate[] private _mine;
    mapping(uint => Metadata) private _metadata;
    string private _baseTokenURI = "ar://";

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**********************     Modifiers     ************************/
    modifier onlyDiamondDawn() {
        require(_msgSender() == diamondDawn, "Only DD");
        _;
    }

    modifier notInitialized() {
        require(!isInitialized, "Initialized");
        _;
    }

    modifier exists(uint tokenId) {
        require(_metadata[tokenId].state_ != Stage.NO_STAGE, "Don't exist");
        _;
    }

    modifier canProcess(uint tokenId, Stage state_) {
        require(!isLocked, "Locked");
        require(state_ == _metadata[tokenId].state_, "Can't process");
        _;
    }

    modifier mineOverflow(uint cnt) {
        require((diamondCount + cnt) <= maxDiamonds, "Mine overflow");
        _;
    }

    modifier mineNotDry() {
        require(_mine.length > 0, "Dry mine");
        _;
    }

    /**********************     External Functions     ************************/
    function initialize(uint16 maxDiamonds_) external notInitialized {
        diamondDawn = _msgSender();
        maxDiamonds = maxDiamonds_;
        isInitialized = true;
    }

    function enter(uint tokenId) external onlyDiamondDawn canProcess(tokenId, Stage.NO_STAGE) {
        _metadata[tokenId].state_ = Stage.INVITE;
        emit Enter(tokenId);
    }

    function mine(uint tokenId) external onlyDiamondDawn mineNotDry canProcess(tokenId, Stage.INVITE) {
        uint extraPoints = _getRandomBetween(MIN_EXTRA_ROUGH_POINTS, MAX_EXTRA_ROUGH_POINTS);
        Metadata storage metadata = _metadata[tokenId];
        metadata.state_ = Stage.MINE;
        metadata.rough.id = ++_mineCounter;
        metadata.rough.extraPoints = uint8(extraPoints);
        metadata.rough.shape = extraPoints % 2 == 0 ? RoughShape.MAKEABLE_1 : RoughShape.MAKEABLE_2;
        metadata.certificate = _mineDiamond();
        emit Mine(tokenId);
    }

    function cut(uint tokenId) external onlyDiamondDawn canProcess(tokenId, Stage.MINE) {
        uint extraPoints = _getRandomBetween(MIN_EXTRA_POLISH_POINTS, MAX_EXTRA_POLISH_POINTS);
        Metadata storage metadata = _metadata[tokenId];
        metadata.state_ = Stage.CUT;
        metadata.cut.id = ++_cutCounter;
        metadata.cut.extraPoints = uint8(extraPoints);
        emit Cut(tokenId);
    }

    function polish(uint tokenId) external onlyDiamondDawn canProcess(tokenId, Stage.CUT) {
        Metadata storage metadata = _metadata[tokenId];
        metadata.state_ = Stage.POLISH;
        metadata.polished.id = ++_polishedCounter;
        emit Polish(tokenId);
    }

    function ship(uint tokenId) external onlyDiamondDawn canProcess(tokenId, Stage.POLISH) {
        Metadata storage metadata = _metadata[tokenId];
        require(metadata.reborn.id == 0, "Shipped");
        metadata.reborn.id = ++_rebornCounter;
        emit Ship(tokenId, metadata.reborn.id, metadata.certificate.number);
    }

    function rebirth(uint tokenId) external onlyDiamondDawn {
        require(_metadata[tokenId].reborn.id > 0, "Not shipped");
        require(_metadata[tokenId].state_ == Stage.POLISH, "Wrong state");
        _metadata[tokenId].state_ = Stage.SHIP;
        emit Rebirth(tokenId);
    }

    function lockMine() external onlyDiamondDawn {
        while (0 < getRoleMemberCount(DEFAULT_ADMIN_ROLE)) {
            _revokeRole(DEFAULT_ADMIN_ROLE, getRoleMember(DEFAULT_ADMIN_ROLE, 0));
        }
        isLocked = true;
    }

    function eruption(Certificate[] calldata diamonds)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        mineOverflow(diamonds.length)
    {
        for (uint i = 0; i < diamonds.length; i = uncheckedInc(i)) {
            _mine.push(diamonds[i]);
        }
        diamondCount += uint16(diamonds.length);
    }

    function lostShipment(uint tokenId, Certificate calldata diamond) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Metadata storage metadata = _metadata[tokenId];
        require(metadata.state_ == Stage.POLISH || metadata.state_ == Stage.SHIP, "Wrong shipment state");
        metadata.certificate = diamond;
    }

    function setStageVideos(Stage stage_, ShapeVideo[] calldata shapeVideos)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(stage_ != Stage.NO_STAGE);
        for (uint i = 0; i < shapeVideos.length; i++) {
            _setVideo(stage_, shapeVideos[i].shape, shapeVideos[i].video);
        }
    }

    function setBaseTokenURI(string calldata baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = baseTokenURI;
    }

    function getMetadata(uint tokenId) external view onlyDiamondDawn exists(tokenId) returns (string memory) {
        Metadata memory metadata = _metadata[tokenId];
        string memory videoURI = _getVideoURI(metadata);
        string memory imageURI = _getVideoURI(metadata); // TODO: change to image URI
        string memory base64Json = Base64.encode(
            bytes(_getMetadataJson(tokenId, metadata, imageURI, videoURI))
        );
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    function isReady(Stage stage_) external view returns (bool) {
        require(_msgSender() == diamondDawn || hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Only DD or admin");
        if (stage_ == Stage.NO_STAGE) return true;
        if (stage_ == Stage.INVITE) return _isVideoExist(stage_, 0);
        if (stage_ == Stage.MINE)
            return diamondCount == maxDiamonds && _isAllVideosExist(stage_, uint(type(RoughShape).max));
        if (stage_ == Stage.POLISH || stage_ == Stage.CUT)
            return _isAllVideosExist(stage_, uint(type(Shape).max));
        if (stage_ == Stage.SHIP) return _isVideoExist(stage_, 0);
        if (stage_ == Stage.DAWN) return true;
        revert();
    }

    /**********************     Private Functions     ************************/

    function _mineDiamond() private returns (Certificate memory) {
        assert(_mine.length > 0);
        uint index = _getRandomBetween(0, _mine.length - 1);
        Certificate memory diamond = _mine[index];
        _mine[index] = _mine[_mine.length - 1]; // swap last diamond with mined diamond
        _mine.pop();
        return diamond;
    }

    function _getRandomBetween(uint min, uint max) private returns (uint) {
        _randNonce++;
        return getRandomInRange(min, max, _randNonce);
    }

    function _setVideo(
        Stage stage_,
        uint shape,
        string memory videoUrl
    ) private {
        stageToShapeVideo[uint(stage_)][shape] = videoUrl;
    }

    function _getVideoURI(Metadata memory metadata) private view returns (string memory) {
        string memory videoUrl = _getVideo(metadata.state_, _getShapeNumber(metadata));
        return string.concat(_baseTokenURI, videoUrl);
    }

    function _isAllVideosExist(Stage stage_, uint maxShape) private view returns (bool) {
        for (uint i = 1; i <= maxShape; i++) {
            // skipping 0 - no shape
            if (!_isVideoExist(stage_, i)) return false;
        }
        return true;
    }

    function _isVideoExist(Stage stage_, uint shape) private view returns (bool) {
        return bytes(_getVideo(stage_, shape)).length > 0;
    }

    function _getVideo(Stage stage_, uint shape) private view returns (string memory) {
        return stageToShapeVideo[uint(stage_)][shape];
    }

    function _getMetadataJson(
        uint tokenId,
        Metadata memory metadata,
        string memory imageURI,
        string memory videoURI
    ) private view returns (string memory) {
        // TODO: add description and created by when ready.
        // TODO: check if we need to add image in addition to animation_url.
        NFTMetadata memory nftMetadata = NFTMetadata({
            name: getName(metadata, tokenId),
            description: "description",
            createdBy: "dd",
            image: imageURI,
            animationUrl: videoURI,
            attributes: _getJsonAttributes(metadata)
        });
        return serialize(nftMetadata);
    }

    function _getJsonAttributes(Metadata memory metadata) private view returns (Attribute[] memory) {
        Stage state_ = metadata.state_;
        Attribute[] memory attributes = new Attribute[](_getStateAttrsNum(state_));
        attributes[0] = toStrAttribute("Type", toTypeStr(state_));
        if (state_ == Stage.INVITE) {
            return attributes;
        }

        attributes[1] = toStrAttribute("Origin", "Metaverse");
        attributes[2] = toStrAttribute("Identification", "Natural");
        attributes[3] = toAttribute("Carat", toDecimalStr(_getPoints(metadata)), "");
        attributes[4] = toMaxValueAttribute(
            "Mined",
            Strings.toString(metadata.rough.id),
            Strings.toString(_mineCounter),
            "number"
        );
        if (state_ == Stage.MINE) {
            attributes[5] = toStrAttribute("Color", "Cape");
            attributes[6] = toStrAttribute("Shape", toRoughShapeStr(metadata.rough.shape));
            attributes[7] = toStrAttribute("Mine", "Underground");
            return attributes;
        }

        Certificate memory certificate = metadata.certificate;
        if (uint(Stage.CUT) <= uint(state_)) {
            attributes[5] = toStrAttribute("Color", toColorStr(certificate.color));
            attributes[6] = toStrAttribute("Cut", toGradeStr(certificate.cut));
            attributes[7] = toStrAttribute("Fluorescence", toFluorescenceStr(certificate.fluorescence));
            attributes[8] = toStrAttribute(
                "Measurements",
                toMeasurementsStr(certificate.shape, certificate.length, certificate.width, certificate.depth)
            );
            attributes[9] = toStrAttribute("Shape", toShapeStr(certificate.shape));
            // TODO: validate that OpenSea works with 2 attributes called "Cut" or change name
            attributes[10] = toMaxValueAttribute(
                "Cut",
                Strings.toString(metadata.cut.id),
                Strings.toString(_cutCounter),
                "number"
            );
        }
        if (uint(Stage.POLISH) <= uint(state_)) {
            attributes[11] = toStrAttribute("Clarity", toClarityStr(certificate.clarity));
            attributes[12] = toStrAttribute("Polish", toGradeStr(certificate.polish));
            attributes[13] = toStrAttribute("Symmetry", toGradeStr(certificate.symmetry));
            attributes[14] = toMaxValueAttribute(
                "Polished",
                Strings.toString(metadata.polished.id),
                Strings.toString(_polishedCounter),
                "number"
            );
        }
        if (uint(Stage.SHIP) <= uint(state_)) {
            attributes[15] = toStrAttribute("Laboratory", "GIA");
            attributes[16] = toAttribute("Report Date", Strings.toString(certificate.date), "date");
            attributes[17] = toAttribute("Report Number", Strings.toString(certificate.number), "");
            attributes[18] = toMaxValueAttribute(
                "Physical",
                Strings.toString(metadata.reborn.id),
                Strings.toString(_rebornCounter),
                "number"
            );
        }
        return attributes;
    }

    function _getShapeNumber(Metadata memory metadata) private pure returns (uint) {
        Stage state_ = metadata.state_;
        if (state_ == Stage.CUT || state_ == Stage.POLISH) return uint(metadata.certificate.shape);
        if (state_ == Stage.MINE) return uint(metadata.rough.shape);
        if (state_ == Stage.INVITE || state_ == Stage.SHIP) return 0;
        revert("Shape number");
    }

    function _getStateAttrsNum(Stage state_) private pure returns (uint) {
        if (state_ == Stage.INVITE) return 1;
        if (state_ == Stage.MINE) return 8;
        if (state_ == Stage.CUT) return 11;
        if (state_ == Stage.POLISH) return 15;
        if (state_ == Stage.SHIP) return 19;
        revert("Attributes number");
    }

    function _getPoints(Metadata memory metadata) private pure returns (uint) {
        assert(metadata.certificate.points > 0);
        Stage state_ = metadata.state_;
        if (state_ == Stage.MINE) {
            assert(metadata.rough.extraPoints > 0);
            return metadata.certificate.points + metadata.rough.extraPoints;
        } else if (state_ == Stage.CUT) {
            assert(metadata.cut.extraPoints > 0);
            return metadata.certificate.points + metadata.cut.extraPoints;
        } else if (state_ == Stage.POLISH || state_ == Stage.SHIP) return metadata.certificate.points;
        revert("Points");
    }
}
