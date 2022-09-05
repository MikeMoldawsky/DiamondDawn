// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
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
contract DiamondDawnMine is AccessControl, IDiamondDawnMine, IDiamondDawnMineAdmin {
    bool public isInitialized;
    bool public isOpen; // mine is closed until it's initialized.
    uint16 public maxDiamonds;
    uint16 public diamondCount;
    address public diamondDawn;
    mapping(uint => mapping(uint => string)) public typeToShapeVideo;

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
        require(msg.sender == diamondDawn, "Only DD");
        _;
    }

    modifier notInitialized() {
        require(!isInitialized, "Initialized");
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

    modifier isMineOpen(bool isOpen_) {
        require(isOpen == isOpen_, string.concat("Mine ", isOpen ? "Open" : "Closed"));
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
    function initialize(address diamondDawn_, uint16 maxDiamonds_) external notInitialized {
        diamondDawn = diamondDawn_;
        maxDiamonds = maxDiamonds_;
        isInitialized = true;
        isOpen = true;
    }

    function enter(uint tokenId) external onlyDiamondDawn isMineOpen(true) onlyType(tokenId, Type.NO_TYPE) {
        _metadata[tokenId].type_ = Type.ENTER_MINE;
        emit Enter(tokenId);
    }

    function mine(uint tokenId)
        external
        onlyDiamondDawn
        isMineOpen(true)
        mineNotDry
        onlyType(tokenId, Type.ENTER_MINE)
    {
        uint extraPoints = _getRandomBetween(MIN_EXTRA_ROUGH_POINTS, MAX_EXTRA_ROUGH_POINTS);
        Metadata storage metadata = _metadata[tokenId];
        metadata.type_ = Type.ROUGH;
        metadata.rough.id = ++_mineCounter;
        metadata.rough.extraPoints = uint8(extraPoints);
        metadata.rough.shape = extraPoints % 2 == 0 ? RoughShape.MAKEABLE_1 : RoughShape.MAKEABLE_2;
        metadata.certificate = _mineDiamond();
        emit Mine(tokenId);
    }

    function cut(uint tokenId) external onlyDiamondDawn isMineOpen(true) onlyType(tokenId, Type.ROUGH) {
        uint extraPoints = _getRandomBetween(MIN_EXTRA_POLISH_POINTS, MAX_EXTRA_POLISH_POINTS);
        Metadata storage metadata = _metadata[tokenId];
        metadata.type_ = Type.CUT;
        metadata.cut.id = ++_cutCounter;
        metadata.cut.extraPoints = uint8(extraPoints);
        emit Cut(tokenId);
    }

    function polish(uint tokenId) external onlyDiamondDawn isMineOpen(true) onlyType(tokenId, Type.CUT) {
        Metadata storage metadata = _metadata[tokenId];
        metadata.type_ = Type.POLISHED;
        metadata.polished.id = ++_polishedCounter;
        emit Polish(tokenId);
    }

    function ship(uint tokenId) external onlyDiamondDawn isMineOpen(true) onlyType(tokenId, Type.POLISHED) {
        Metadata storage metadata = _metadata[tokenId];
        require(metadata.reborn.id == 0);
        metadata.reborn.id = ++_rebornCounter;
        emit Ship(tokenId);
    }

    function rebirth(uint tokenId) external onlyDiamondDawn {
        require(_metadata[tokenId].reborn.id > 0, "Not shipped");
        _metadata[tokenId].type_ = Type.REBORN;
        emit Rebirth(tokenId);
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
        require(metadata.type_ == Type.POLISHED || metadata.type_ == Type.REBORN, "Wrong type");
        metadata.certificate = diamond;
    }

    function setOpen(bool isOpen_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isOpen = isOpen_;
    }

    function setTypeVideos(Type type_, ShapeVideo[] calldata shapeVideos)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(type_ != Type.NO_TYPE);
        for (uint i = 0; i < shapeVideos.length; i++) {
            _setVideo(type_, shapeVideos[i].shape, shapeVideos[i].video);
        }
    }

    function lockMine() external onlyRole(DEFAULT_ADMIN_ROLE) isMineOpen(false) {
        // lock mine forever
        renounceRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function getMetadata(uint tokenId) external view onlyDiamondDawn exists(tokenId) returns (string memory) {
        Metadata memory metadata = _metadata[tokenId];
        string memory videoURI = _getVideoURI(metadata);
        string memory base64Json = Base64.encode(bytes(_getMetadataJson(tokenId, metadata, videoURI)));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    function isMineReady(Type type_) external view returns (bool) {
        if (type_ == Type.ENTER_MINE || type_ == Type.REBORN) return _isVideoExist(type_, 0);
        if (type_ == Type.ROUGH && diamondCount != maxDiamonds) return false;
        uint maxShape = type_ == Type.ROUGH ? uint(type(RoughShape).max) : uint(type(Shape).max);
        for (uint i = 1; i <= maxShape; i++) {
            // skipping 0 - no shape
            if (!_isVideoExist(type_, i)) return false;
        }
        return true;
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
        Type type_,
        uint shape,
        string memory videoUrl
    ) private {
        typeToShapeVideo[uint(type_)][shape] = videoUrl;
    }

    function _getVideoURI(Metadata memory metadata) private view returns (string memory) {
        string memory videoUrl = _getVideo(metadata.type_, _getShapeNumber(metadata));
        return string.concat(_videoBaseURI(), videoUrl);
    }

    function _isVideoExist(Type type_, uint shape) private view returns (bool) {
        return bytes(_getVideo(type_, shape)).length > 0;
    }

    function _getVideo(Type type_, uint shape) private view returns (string memory) {
        return typeToShapeVideo[uint(type_)][shape];
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
        Type type_ = metadata.type_;
        Attribute[] memory attributes = new Attribute[](_getNumAttributes(type_));
        attributes[0] = toStrAttribute("Type", toTypeStr(type_));
        if (type_ == Type.ENTER_MINE) {
            return attributes;
        }

        attributes[1] = toStrAttribute("Origin", "Metaverse");
        attributes[2] = toStrAttribute("Identification", "Natural");
        attributes[3] = toAttribute("Carat", toDecimalStr(_getPoints(metadata)), "");
        if (type_ == Type.ROUGH) {
            attributes[4] = toStrAttribute("Color", "Cape");
            attributes[5] = toStrAttribute("Shape", toRoughShapeStr(metadata.rough.shape));
            attributes[6] = toStrAttribute("Mine", "Underground");
            return attributes;
        }

        Certificate memory certificate = metadata.certificate;
        if (uint(Type.CUT) <= uint(type_)) {
            attributes[4] = toStrAttribute("Color", toColorStr(certificate.color));
            attributes[5] = toStrAttribute("Cut", toGradeStr(certificate.cut));
            attributes[6] = toStrAttribute("Fluorescence", toFluorescenceStr(certificate.fluorescence));
            attributes[7] = toStrAttribute(
                "Measurements",
                toMeasurementsStr(certificate.shape, certificate.length, certificate.width, certificate.depth)
            );
            attributes[8] = toStrAttribute("Shape", toShapeStr(certificate.shape));
        }
        if (uint(Type.POLISHED) <= uint(type_)) {
            attributes[9] = toStrAttribute("Clarity", toClarityStr(certificate.clarity));
            attributes[10] = toStrAttribute("Polish", toGradeStr(certificate.polish));
            attributes[11] = toStrAttribute("Symmetry", toGradeStr(certificate.symmetry));
        }
        if (uint(Type.REBORN) <= uint(type_)) {
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
        Type type_ = metadata.type_;
        if (type_ == Type.CUT || type_ == Type.POLISHED) return uint(metadata.certificate.shape);
        if (type_ == Type.ROUGH) return uint(metadata.rough.shape);
        if (type_ == Type.ENTER_MINE || type_ == Type.REBORN) return 0;
        revert("Shape number");
    }

    function _getNumAttributes(Type type_) private pure returns (uint) {
        if (type_ == Type.ENTER_MINE) return 1;
        if (type_ == Type.ROUGH) return 7;
        if (type_ == Type.CUT) return 9;
        if (type_ == Type.POLISHED) return 12;
        if (type_ == Type.REBORN) return 16;
        revert("Attributes number");
    }

    function _getPoints(Metadata memory metadata) private pure returns (uint) {
        assert(metadata.certificate.points > 0);
        if (metadata.type_ == Type.ROUGH) {
            assert(metadata.rough.extraPoints > 0);
            return metadata.certificate.points + metadata.rough.extraPoints;
        } else if (metadata.type_ == Type.CUT) {
            assert(metadata.cut.extraPoints > 0);
            return metadata.certificate.points + metadata.cut.extraPoints;
        } else if (metadata.type_ == Type.POLISHED || metadata.type_ == Type.REBORN)
            return metadata.certificate.points;
        revert("Points");
    }
}
