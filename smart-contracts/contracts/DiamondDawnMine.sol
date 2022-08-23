// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawnMineAdmin.sol";
import {getStringNFTAttribute, getNFTAttribute, toJsonMetadata, Attribute, NFTMetadata} from "./utils/NFTMetadataUtils.sol";
import {getRandomInRange} from "./utils/RandomUtils.sol";

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
        uint extraPoints;
    }

    struct CutMetadata {
        uint extraPoints;
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
    uint private constant MIN_ROUGH_EXTRA_POINTS = 38;
    uint private constant MAX_ROUGH_EXTRA_POINTS = 74;
    // Carat loss of ~2% to ~8% in the polish process.
    uint private constant MIN_POLISH_EXTRA_POINTS = 1;
    uint private constant MAX_POLISH_EXTRA_POINTS = 4;

    uint private _randNonce = 0;
    mapping(uint => Metadata) private _metadata;
    address private _diamondDawn;
    Certificate[] private _diamonds;
    Certificate private NO_DIAMOND =
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
        require(msg.sender == _diamondDawn);
        _;
    }

    modifier onlyExistingTokens(uint tokenId) {
        require(_metadata[tokenId].type_ != Type.NO_TYPE);
        _;
    }

    modifier onlyDiamondDawnType(uint tokenId, Type diamondDawnType) {
        require(diamondDawnType == _metadata[tokenId].type_);
        _;
    }

    modifier mineClosed() {
        require(!isMineOpen);
        _;
    }

    modifier mineOpen() {
        require(isMineOpen);
        _;
    }

    modifier mineNotLocked() {
        require(!isMineLocked);
        _;
    }

    modifier mineNotDry() {
        require(_diamonds.length > 0);
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
            rough: RoughMetadata({shape: RoughShape.NO_SHAPE, extraPoints: 0}),
            cut: CutMetadata({extraPoints: 0}),
            certificate: NO_DIAMOND
        });
    }

    function mine(uint tokenId) external onlyDiamondDawn mineOpen mineNotDry {
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
        onlyDiamondDawnType(tokenId, Type.ROUGH)
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
        uint randomIndex = _getRandomBetween(0, _diamonds.length - 1);
        Certificate memory diamond = _diamonds[randomIndex];

        // TODO: Move the last element into the place to delete
        if (_diamonds.length > 1) {
            _diamonds[randomIndex] = _diamonds[_diamonds.length - 1];
        }
        _diamonds.pop();
        return diamond;
    }

    function _getRandomBetween(uint min, uint max) private returns (uint) {
        _randNonce++;
        return getRandomInRange(min, max, _randNonce);
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
            revert();
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
        revert();
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
        NFTMetadata memory nftMetadata = NFTMetadata({
            name: string(
                abi.encodePacked("Diamond #", Strings.toString(tokenId))
            ),
            description: "description",
            createdBy: "dd",
            image: videoUrl,
            attributes: _getAttributes(metadata)
        });
        return toJsonMetadata(nftMetadata);
    }

    function _getAttributes(Metadata memory metadata)
        private
        pure
        returns (Attribute[] memory)
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
        revert();
    }

    function _getTypeAttribute(Type diamondDawnType)
        private
        pure
        returns (Attribute memory)
    {
        return getStringNFTAttribute("Type", _toTypeString(diamondDawnType));
    }

    function _getMineEntranceAttributes()
        private
        pure
        returns (Attribute[] memory)
    {
        Attribute[] memory mineEntranceAttributes = new Attribute[](1);
        mineEntranceAttributes[0] = _getTypeAttribute(Type.ENTER_MINE);
        return mineEntranceAttributes;
    }

    function _getBaseAttributes(Type diamondDawnType, uint points)
        private
        pure
        returns (Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (Attribute[3] memory)).
        assert(points > 0);
        Attribute[] memory baseAttributes = new Attribute[](4);
        baseAttributes[0] = getStringNFTAttribute("Origin", "Metaverse");
        baseAttributes[1] = _getTypeAttribute(diamondDawnType);
        baseAttributes[2] = getStringNFTAttribute("Identification", "Natural");
        baseAttributes[3] = getStringNFTAttribute(
            "Carat",
            _toCaratString(points)
        );
        return baseAttributes;
    }

    function _getRoughAttributes(RoughMetadata memory rough)
        private
        pure
        returns (Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (Attribute[3] memory)).
        Attribute[] memory roughAttributes = new Attribute[](3);
        roughAttributes[0] = getStringNFTAttribute("Color", "Cape");
        roughAttributes[1] = getStringNFTAttribute(
            "Shape",
            _toRoughShapeString(rough.shape)
        );
        roughAttributes[2] = getStringNFTAttribute("Mine", "Underground");
        return roughAttributes;
    }

    function _getCutAttributes(Certificate memory certificate)
        private
        pure
        returns (Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (Attribute[5] memory)).
        Attribute[] memory cutAttributes = new Attribute[](5);
        cutAttributes[0] = getStringNFTAttribute(
            "Color",
            _toColorString(certificate.color)
        );
        cutAttributes[1] = getStringNFTAttribute(
            "Cut",
            _toGradeString(certificate.cut)
        );
        cutAttributes[2] = getStringNFTAttribute(
            "Fluorescence",
            _toFluorescenceString(certificate.fluorescence)
        );
        cutAttributes[3] = getStringNFTAttribute(
            "Measurements",
            certificate.measurements
        );
        cutAttributes[4] = getStringNFTAttribute(
            "Shape",
            _toShapeString(certificate.shape)
        );
        return cutAttributes;
    }

    function _getPolishedAttributes(Certificate memory certificate)
        private
        pure
        returns (Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (Attribute[5] memory)).
        Attribute[] memory polishedAttributes = new Attribute[](3);
        polishedAttributes[0] = getStringNFTAttribute(
            "Clarity",
            _toClarityString(certificate.clarity)
        );
        polishedAttributes[1] = getStringNFTAttribute(
            "Polish",
            _toGradeString(certificate.polish)
        );
        polishedAttributes[2] = getStringNFTAttribute(
            "Symmetry",
            _toGradeString(certificate.symmetry)
        );
        return polishedAttributes;
    }

    function _getRebirthAttributes(Certificate memory certificate)
        private
        pure
        returns (Attribute[] memory)
    {
        // TODO: check about fix sized array in returns type (returns (Attribute[5] memory)).
        Attribute[] memory rebirthAttributes = new Attribute[](3);
        rebirthAttributes[0] = getStringNFTAttribute("Laboratory", "GIA");
        rebirthAttributes[1] = getNFTAttribute(
            "Report Date",
            Strings.toString(certificate.reportDate),
            "",
            false
        );
        rebirthAttributes[2] = getNFTAttribute(
            "Report Number",
            Strings.toString(certificate.reportNumber),
            "",
            false
        );
        return rebirthAttributes;
    }

    function _getRoughDiamondAttributes(
        RoughMetadata memory rough,
        Certificate memory certificate
    ) private pure returns (Attribute[] memory) {
        assert(rough.extraPoints > 0);
        assert(certificate.points > 0);

        Attribute[] memory base = _getBaseAttributes(
            Type.ROUGH,
            certificate.points + rough.extraPoints
        );

        Attribute[] memory roughAttributes = _getRoughAttributes(rough);

        Attribute[] memory attributes = new Attribute[](7);
        // TODO make it more generic
        // Base
        attributes[0] = base[0];
        attributes[1] = base[1];
        attributes[2] = base[2];
        attributes[3] = base[3];
        // Rough
        attributes[4] = roughAttributes[0];
        attributes[5] = roughAttributes[1];
        attributes[6] = roughAttributes[2];
        return attributes;
    }

    function _getCutDiamondAttributes(
        CutMetadata memory cutMetadata,
        Certificate memory certificate
    ) private pure returns (Attribute[] memory) {
        assert(cutMetadata.extraPoints > 0);
        assert(certificate.points > 0);

        Attribute[] memory base = _getBaseAttributes(
            Type.CUT,
            certificate.points + cutMetadata.extraPoints
        );
        Attribute[] memory cutAttributes = _getCutAttributes(certificate);
        Attribute[] memory attributes = new Attribute[](9);

        // TODO make it more generic
        // Base
        attributes[0] = base[0];
        attributes[1] = base[1];
        attributes[2] = base[2];
        attributes[3] = base[3];
        // Cut
        attributes[4] = cutAttributes[0];
        attributes[5] = cutAttributes[1];
        attributes[6] = cutAttributes[2];
        attributes[7] = cutAttributes[3];
        attributes[8] = cutAttributes[4];
        return attributes;
    }

    function _getPolishedDiamondAttributes(Certificate memory certificate)
        private
        pure
        returns (Attribute[] memory)
    {
        assert(certificate.points > 0);

        Attribute[] memory base = _getBaseAttributes(
            Type.POLISHED,
            certificate.points
        );
        Attribute[] memory cutAttributes = _getCutAttributes(certificate);
        Attribute[] memory polished = _getPolishedAttributes(certificate);

        Attribute[] memory attributes = new Attribute[](12);
        // TODO make it more generic
        // Base
        attributes[0] = base[0];
        attributes[1] = base[1];
        attributes[2] = base[2];
        attributes[3] = base[3];
        // Cut
        attributes[4] = cutAttributes[0];
        attributes[5] = cutAttributes[1];
        attributes[6] = cutAttributes[2];
        attributes[7] = cutAttributes[3];
        attributes[8] = cutAttributes[4];
        // Polish
        attributes[9] = polished[0];
        attributes[10] = polished[1];
        attributes[11] = polished[2];
        return attributes;
    }

    function _getRebornDiamondAttributes(Certificate memory certificate)
        private
        pure
        returns (Attribute[] memory)
    {
        assert(certificate.points > 0);

        Attribute[] memory base = _getBaseAttributes(
            Type.REBORN,
            certificate.points
        );
        Attribute[] memory cutAttributes = _getCutAttributes(certificate);
        Attribute[] memory polished = _getPolishedAttributes(certificate);
        Attribute[] memory rebirthAttributes = _getRebirthAttributes(
            certificate
        );
        Attribute[] memory attributes = new Attribute[](15);
        // TODO make it more generic
        // Base
        attributes[0] = base[0];
        attributes[1] = base[1];
        attributes[2] = base[2];
        attributes[3] = base[3];
        // Cut
        attributes[4] = cutAttributes[0];
        attributes[5] = cutAttributes[1];
        attributes[6] = cutAttributes[2];
        attributes[7] = cutAttributes[3];
        attributes[8] = cutAttributes[4];
        // Polish
        attributes[9] = polished[0];
        attributes[10] = polished[1];
        attributes[11] = polished[2];
        // Rebirth
        attributes[12] = rebirthAttributes[0];
        attributes[13] = rebirthAttributes[1];
        attributes[14] = rebirthAttributes[2];
        return attributes;
    }

    function _toTypeString(Type type_) private pure returns (string memory) {
        if (type_ == Type.ENTER_MINE) return "Mine Entrance";
        else if (type_ == Type.ROUGH) return "Rough";
        else if (type_ == Type.CUT) return "Cut";
        else if (type_ == Type.POLISHED) return "Polished";
        else if (type_ == Type.REBORN) return "Reborn";
        revert();
    }

    function _toRoughShapeString(RoughShape shape)
        private
        pure
        returns (string memory)
    {
        if (shape == RoughShape.MAKEABLE) return "Makeable";
        revert();
    }

    function _toColorString(Color color) private pure returns (string memory) {
        if (color == Color.M) return "M";
        else if (color == Color.N) return "N";
        else if (color == Color.O) return "O";
        else if (color == Color.P) return "P";
        else if (color == Color.Q) return "Q";
        else if (color == Color.R) return "R";
        else if (color == Color.S) return "S";
        else if (color == Color.T) return "T";
        else if (color == Color.U) return "U";
        else if (color == Color.V) return "V";
        else if (color == Color.W) return "W";
        else if (color == Color.X) return "X";
        else if (color == Color.Y) return "Y";
        else if (color == Color.Z) return "Z";
        revert();
    }

    function _toGradeString(Grade grade) private pure returns (string memory) {
        if (grade == Grade.GOOD) return "Good";
        else if (grade == Grade.VERY_GOOD) return "Very Good";
        else if (grade == Grade.EXCELLENT) return "Excellent";
        revert();
    }

    function _toClarityString(Clarity clarity)
        private
        pure
        returns (string memory)
    {
        if (clarity == Clarity.VS2) return "VS2";
        else if (clarity == Clarity.VS1) return "VS1";
        else if (clarity == Clarity.VVS2) return "VVS2";
        else if (clarity == Clarity.VVS1) return "VVS1";
        else if (clarity == Clarity.IF) return "IF";
        else if (clarity == Clarity.FL) return "FL";
        revert();
    }

    function _toFluorescenceString(Fluorescence fluorescence)
        private
        pure
        returns (string memory)
    {
        if (fluorescence == Fluorescence.FAINT) return "Faint";
        else if (fluorescence == Fluorescence.NONE) return "None";
        revert();
    }

    function _toShapeString(Shape shape) private pure returns (string memory) {
        if (shape == Shape.PEAR) return "Pear";
        else if (shape == Shape.ROUND) return "Round";
        else if (shape == Shape.OVAL) return "Oval";
        else if (shape == Shape.RADIANT) return "Radiant";
        revert();
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
