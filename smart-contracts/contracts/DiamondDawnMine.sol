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
import "./utils/Serializer.sol";

/**
 *    ________    .__                                           .___
 *    \______ \   |__| _____      _____     ____     ____     __| _/
 *     |    |  \  |  | \__  \    /     \   /  _ \   /    \   / __ |
 *     |    `   \ |  |  / __ \_ |  Y Y  \ (  <_> ) |   |  \ / /_/ |
 *    /_______  / |__| (____  / |__|_|  /  \____/  |___|  / \____ |
 *            \/            \/        \/                \/       \/
 *    ________
 *    \______ \   _____    __  _  __   ____
 *     |    |  \  \__  \   \ \/ \/ /  /    \
 *     |    `   \  / __ \_  \     /  |   |  \
 *    /_______  / (____  /   \/\_/   |___|  /
 *            \/       \/                 \/                                ,
 *       _____    .__
 *      /     \   |__|   ____     ____
 *     /  \ /  \  |  |  /    \  _/ __ \
 *    /    Y    \ |  | |   |  \ \  ___/
 *    \____|__  / |__| |___|  /  \___  >
 *            \/            \/       \/                          ,
 *
 * @title DiamondDawnMine
 * @author Mike Moldawsky (Tweezers)
*/
// TODO: Warning: Contract code size is 27937 bytes and exceeds 24576 bytes (a limit introduced in Spurious Dragon).
// TODO: This contract may not be deployable on mainnet. Consider enabling the optimizer (with a low "runs" value!),
// TODO: turning off revert strings, or using libraries.
contract DiamondDawnMine is AccessControlEnumerable, IDiamondDawnMine, IDiamondDawnMineAdmin {
    bool public isLocked; // mine is locked forever.
    bool public isInitialized;
    uint16 public maxDiamonds;
    uint16 public diamondCount;
    address public diamondDawn;
    mapping(uint => string) public manifests;

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
        for (uint i = 0; i < diamonds.length; i++) {
            _mine.push(diamonds[i]);
        }
        diamondCount += uint16(diamonds.length);
    }

    function lostShipment(uint tokenId, Certificate calldata diamond) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Metadata storage metadata = _metadata[tokenId];
        require(metadata.state_ == Stage.POLISH || metadata.state_ == Stage.SHIP, "Wrong shipment state");
        metadata.certificate = diamond;
    }

    function setManifest(Stage stage_, string calldata manifest) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(stage_ != Stage.NO_STAGE);
        manifests[uint(stage_)] = manifest;
    }

    function setBaseTokenURI(string calldata baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = baseTokenURI;
    }

    function getMetadata(uint tokenId) external view onlyDiamondDawn exists(tokenId) returns (string memory) {
        Metadata memory metadata = _metadata[tokenId];
        string memory noExtensionURI = _getNoExtensionURI(metadata);
        string memory base64Json = Base64.encode(bytes(_getMetadataJson(tokenId, metadata, noExtensionURI)));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    function isReady(Stage stage_) external view returns (bool) {
        require(_msgSender() == diamondDawn || hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Only DD or admin");
        if (stage_ == Stage.NO_STAGE) return true;
        if (stage_ == Stage.DAWN) return true;
        if (stage_ == Stage.MINE && diamondCount != maxDiamonds) return false;
        return bytes(manifests[uint(stage_)]).length > 0;
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

    function _getNoExtensionURI(Metadata memory metadata) private view returns (string memory) {
        string memory manifest = manifests[uint(metadata.state_)];
        string memory name = _getResourceName(metadata);
        return string.concat(_baseTokenURI, manifest, "/", name);
    }

    function _getMetadataJson(
        uint tokenId,
        Metadata memory metadata,
        string memory noExtensionURI
    ) private view returns (string memory) {
        // TODO: add description and created by when ready or remove them.
        Serializer.NFTMetadata memory nftMetadata = Serializer.NFTMetadata({
            name: Serializer.getName(metadata, tokenId),
            description: "description",
            createdBy: "dd",
            image: string.concat(noExtensionURI, ".jpeg"),
            animationUrl: string.concat(noExtensionURI, ".mp4"),
            attributes: _getJsonAttributes(metadata)
        });
        return Serializer.serialize(nftMetadata);
    }

    function _getJsonAttributes(Metadata memory metadata) private view returns (Serializer.Attribute[] memory) {
        Stage state_ = metadata.state_;
        Serializer.Attribute[] memory attributes = new Serializer.Attribute[](_getStateAttrsNum(state_));
        attributes[0] = Serializer.toStrAttribute("Type", Serializer.toTypeStr(state_));
        if (state_ == Stage.INVITE) {
            return attributes;
        }

        attributes[1] = Serializer.toStrAttribute("Origin", "Metaverse");
        attributes[2] = Serializer.toStrAttribute("Identification", "Natural");
        attributes[3] = Serializer.toAttribute("Carat", Serializer.toDecimalStr(_getPoints(metadata)), "");
        attributes[4] = Serializer.toMaxValueAttribute(
            "Mined",
            Strings.toString(metadata.rough.id),
            Strings.toString(_mineCounter),
            "number"
        );
        if (state_ == Stage.MINE) {
            attributes[5] = Serializer.toStrAttribute("Color", "Cape");
            attributes[6] = Serializer.toStrAttribute("Shape", Serializer.toRoughShapeStr(metadata.rough.shape));
            attributes[7] = Serializer.toStrAttribute("Mine", "Underground");
            return attributes;
        }

        Certificate memory certificate = metadata.certificate;
        if (uint(Stage.CUT) <= uint(state_)) {
            attributes[5] = Serializer.toStrAttribute("Color", Serializer.toColorStr(certificate.color, certificate.toColor));
            attributes[6] = Serializer.toStrAttribute("Cut", Serializer.toGradeStr(certificate.cut));
            attributes[7] = Serializer.toStrAttribute("Fluorescence", Serializer.toFluorescenceStr(certificate.fluorescence));
            attributes[8] = Serializer.toStrAttribute(
                "Measurements",
                Serializer.toMeasurementsStr(certificate.shape, certificate.length, certificate.width, certificate.depth)
            );
            attributes[9] = Serializer.toStrAttribute("Shape", Serializer.toShapeStr(certificate.shape));
            // TODO: validate that OpenSea works with 2 attributes called "Cut" or change name
            attributes[10] = Serializer.toMaxValueAttribute(
                "Cut",
                Strings.toString(metadata.cut.id),
                Strings.toString(_cutCounter),
                "number"
            );
        }
        if (uint(Stage.POLISH) <= uint(state_)) {
            attributes[11] = Serializer.toStrAttribute("Clarity", Serializer.toClarityStr(certificate.clarity));
            attributes[12] = Serializer.toStrAttribute("Polish", Serializer.toGradeStr(certificate.polish));
            attributes[13] = Serializer.toStrAttribute("Symmetry", Serializer.toGradeStr(certificate.symmetry));
            attributes[14] = Serializer.toMaxValueAttribute(
                "Polished",
                Strings.toString(metadata.polished.id),
                Strings.toString(_polishedCounter),
                "number"
            );
        }
        if (uint(Stage.SHIP) <= uint(state_)) {
            attributes[15] = Serializer.toStrAttribute("Laboratory", "GIA");
            attributes[16] = Serializer.toAttribute("Report Date", Strings.toString(certificate.date), "date");
            attributes[17] = Serializer.toAttribute("Report Number", Strings.toString(certificate.number), "");
            attributes[18] = Serializer.toMaxValueAttribute(
                "Physical",
                Strings.toString(metadata.reborn.id),
                Strings.toString(_rebornCounter),
                "number"
            );
        }
        return attributes;
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

    // TODO: might need to use toShapeStr instead in order to reduce the contract size.
    function _getResourceName(Metadata memory metadata) private pure returns (string memory) {
        if (metadata.state_ == Stage.INVITE || metadata.state_ == Stage.SHIP) return "resource";
        else if (metadata.state_ == Stage.MINE) {
            if (metadata.rough.shape == RoughShape.MAKEABLE_1) return "makeable1";
            if (metadata.rough.shape == RoughShape.MAKEABLE_2) return "makeable2";
        } else if (metadata.certificate.shape == Shape.PEAR) return "pear";
        else if (metadata.certificate.shape == Shape.ROUND) return "round";
        else if (metadata.certificate.shape == Shape.OVAL) return "oval";
        else if (metadata.certificate.shape == Shape.CUSHION) return "cushion";
        revert();
    }
}
