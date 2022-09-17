// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";
import "./objects/Mine.sol";
import "./objects/Diamond.sol";
import "./utils/NFTSerializer.sol";
import "./utils/StringUtils.sol";
import "./utils/MathUtils.sol";
import "./objects/Mine.sol";
import "./objects/Mine.sol";
import "./objects/Mine.sol";
import "./objects/Mine.sol";
import "./objects/Mine.sol";

// TODO: write description
/**
 * @title DiamondDawnMine NFT Contract
 * @author Diamond Dawn
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
        require(_metadata[tokenId].stage_ != Stage.NO_STAGE, "Don't exist");
        _;
    }

    modifier canProcess(uint tokenId, Stage stage_) {
        require(!isLocked, "Locked");
        require(stage_ == _metadata[tokenId].stage_, "Wrong stage");
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
        _metadata[tokenId].stage_ = Stage.INVITE;
        emit Enter(tokenId);
    }

    function mine(uint tokenId) external onlyDiamondDawn mineNotDry canProcess(tokenId, Stage.INVITE) {
        uint extraPoints = _getRandomBetween(MIN_EXTRA_ROUGH_POINTS, MAX_EXTRA_ROUGH_POINTS);
        Metadata storage metadata = _metadata[tokenId];
        metadata.stage_ = Stage.MINE;
        metadata.rough.id = ++_mineCounter;
        metadata.rough.extraPoints = uint8(extraPoints);
        metadata.rough.shape = extraPoints % 2 == 0 ? RoughShape.MAKEABLE_1 : RoughShape.MAKEABLE_2;
        metadata.certificate = _mineDiamond();
        emit Mine(tokenId);
    }

    function cut(uint tokenId) external onlyDiamondDawn canProcess(tokenId, Stage.MINE) {
        uint extraPoints = _getRandomBetween(MIN_EXTRA_POLISH_POINTS, MAX_EXTRA_POLISH_POINTS);
        Metadata storage metadata = _metadata[tokenId];
        metadata.stage_ = Stage.CUT;
        metadata.cut.id = ++_cutCounter;
        metadata.cut.extraPoints = uint8(extraPoints);
        emit Cut(tokenId);
    }

    function polish(uint tokenId) external onlyDiamondDawn canProcess(tokenId, Stage.CUT) {
        Metadata storage metadata = _metadata[tokenId];
        metadata.stage_ = Stage.POLISH;
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
        require(_metadata[tokenId].stage_ == Stage.POLISH, "Wrong stage");
        _metadata[tokenId].stage_ = Stage.SHIP;
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
        require(metadata.stage_ == Stage.POLISH || metadata.stage_ == Stage.SHIP, "Wrong stage");
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

    function getMetadata(uint tokenId) external view onlyDiamondDawn exists(tokenId) returns (string memory) {
        Metadata memory metadata = _metadata[tokenId];
        string memory videoURI = _getVideoURI(metadata);
        string memory base64Json = Base64.encode(bytes(_getMetadataJson(tokenId, metadata, videoURI)));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    function isReady(Stage stage_) external view returns (bool) {
        require(_msgSender() == diamondDawn || hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Only DD or admin");
        if (stage_ == Stage.INVITE || stage_ == Stage.SHIP) return _isVideoExist(stage_, 0);
        if (stage_ == Stage.MINE)
            return diamondCount == maxDiamonds && _isAllVideosExist(stage_, uint(type(RoughShape).max));
        if (stage_ == Stage.CUT || stage_ == Stage.POLISH)
            return _isAllVideosExist(stage_, uint(type(Shape).max));
        return false;
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
        string memory videoUrl = _getVideo(metadata.stage_, _getShapeNumber(metadata));
        return string.concat(_videoBaseURI(), videoUrl);
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
        string memory videoURI
    ) private pure returns (string memory) {
        // TODO: add description and created by when ready.
        NFTMetadata memory nftMetadata = NFTMetadata({
            name: getName(metadata, tokenId),
            description: "description",
            createdBy: "dd",
            image: videoURI,
            attributes: _getJsonAttributes(metadata)
        });
        return serialize(nftMetadata);
    }

    function _getJsonAttributes(Metadata memory metadata) private pure returns (Attribute[] memory) {
        Stage stage_ = metadata.stage_;
        Attribute[] memory attributes = new Attribute[](_getNumAttributes(stage_));
        attributes[0] = toStrAttribute("Type", toStageStr(stage_));
        if (stage_ == Stage.INVITE) {
            return attributes;
        }

        attributes[1] = toStrAttribute("Origin", "Metaverse");
        attributes[2] = toStrAttribute("Identification", "Natural");
        attributes[3] = toAttribute("Carat", toDecimalStr(_getPoints(metadata)), "");
        if (stage_ == Stage.MINE) {
            attributes[4] = toStrAttribute("Color", "Cape");
            attributes[5] = toStrAttribute("Shape", toRoughShapeStr(metadata.rough.shape));
            attributes[6] = toStrAttribute("Mine", "Underground");
            return attributes;
        }

        Certificate memory certificate = metadata.certificate;
        if (uint(Stage.CUT) <= uint(stage_)) {
            attributes[4] = toStrAttribute("Color", toColorStr(certificate.color));
            attributes[5] = toStrAttribute("Cut", toGradeStr(certificate.cut));
            attributes[6] = toStrAttribute("Fluorescence", toFluorescenceStr(certificate.fluorescence));
            attributes[7] = toStrAttribute(
                "Measurements",
                toMeasurementsStr(certificate.shape, certificate.length, certificate.width, certificate.depth)
            );
            attributes[8] = toStrAttribute("Shape", toShapeStr(certificate.shape));
        }
        if (uint(Stage.POLISH) <= uint(stage_)) {
            attributes[9] = toStrAttribute("Clarity", toClarityStr(certificate.clarity));
            attributes[10] = toStrAttribute("Polish", toGradeStr(certificate.polish));
            attributes[11] = toStrAttribute("Symmetry", toGradeStr(certificate.symmetry));
        }
        if (uint(Stage.SHIP) <= uint(stage_)) {
            attributes[12] = toStrAttribute("Laboratory", "GIA");
            attributes[13] = toAttribute("Report Date", Strings.toString(certificate.date), "date");
            attributes[14] = toAttribute("Report Number", Strings.toString(certificate.number), "");
            attributes[15] = toAttribute("Physical Id", Strings.toString(metadata.reborn.id), "");
        }
        return attributes;
    }

    function _videoBaseURI() private pure returns (string memory) {
        // TODO: change to ipfs or ar baseURL before production
        return "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";
    }

    function _getShapeNumber(Metadata memory metadata) private pure returns (uint) {
        Stage stage_ = metadata.stage_;
        if (stage_ == Stage.CUT || stage_ == Stage.POLISH) return uint(metadata.certificate.shape);
        if (stage_ == Stage.MINE) return uint(metadata.rough.shape);
        if (stage_ == Stage.INVITE || stage_ == Stage.SHIP) return 0;
        revert("Shape number");
    }

    function _getNumAttributes(Stage stage_) private pure returns (uint) {
        if (stage_ == Stage.INVITE) return 1;
        if (stage_ == Stage.MINE) return 7;
        if (stage_ == Stage.CUT) return 9;
        if (stage_ == Stage.POLISH) return 12;
        if (stage_ == Stage.SHIP) return 16;
        revert("Attributes number");
    }

    function _getPoints(Metadata memory metadata) private pure returns (uint) {
        assert(metadata.certificate.points > 0);
        if (metadata.stage_ == Stage.MINE) {
            assert(metadata.rough.extraPoints > 0);
            return metadata.certificate.points + metadata.rough.extraPoints;
        } else if (metadata.stage_ == Stage.CUT) {
            assert(metadata.cut.extraPoints > 0);
            return metadata.certificate.points + metadata.cut.extraPoints;
        } else if (metadata.stage_ == Stage.POLISH || metadata.stage_ == Stage.SHIP)
            return metadata.certificate.points;
        revert("Points");
    }
}
