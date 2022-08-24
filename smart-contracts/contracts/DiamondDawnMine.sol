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

/**
 * @title DiamondDawnMine NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawnMine is
    AccessControl,
    IDiamondDawnMine,
    IDiamondDawnMineAdmin
{
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
        require(_metadata[tokenId].type_ != Type.NO_TYPE, "No token");
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
            metadata.type_ == Type.POLISHED || metadata.type_ == Type.REBORN
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
            attributes: _getJsonAttributes(metadata)
        });
        return toJsonMetadata(nftMetadata);
    }

    function _getJsonAttributes(Metadata memory metadata)
        private
        pure
        returns (Attribute[] memory)
    {
        Type diamondDawnType = metadata.type_;
        Certificate memory certificate = metadata.certificate;
        Attribute[] memory attributes = new Attribute[](
            _getNumAttributes(diamondDawnType)
        );
        attributes[0] = getStringAttribute(
            "Type",
            toTypeString(diamondDawnType)
        );
        if (Type.ENTER_MINE == diamondDawnType) {
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
        if (Type.ROUGH == diamondDawnType) {
            attributes[4] = getStringAttribute("Color", "Cape");
            attributes[5] = getStringAttribute(
                "Shape",
                toRoughShapeString(metadata.rough.shape)
            );
            attributes[6] = getStringAttribute("Mine", "Underground");
            return attributes;
        }

        if (uint(Type.CUT) <= uint(diamondDawnType)) {
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
        if (uint(Type.POLISHED) <= uint(diamondDawnType)) {
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
        if (uint(Type.REBORN) <= uint(diamondDawnType)) {
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
