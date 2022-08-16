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
    enum RoughDiamondShape {
        NO_SHAPE,
        MAKEABLE
    }

    struct RoughDiamondMetadata {
        RoughDiamondShape shape;
        uint pointsReduction;
    }

    struct CutDiamondMetadata {
        uint pointsReduction;
    }

    struct DiamondDawnMetadata {
        DiamondDawnType type_;
        RoughDiamondMetadata rough;
        CutDiamondMetadata cut;
        DiamondCertificate certificate;
    }


    bool public isMineOpen = false; // mine is closed until it's initialized.
    bool public isMineLocked = false; // mine is locked forever when the project ends (immutable).

    string public mineEntranceVideoUrl;
    mapping(uint => string) public roughShapeToVideoUrls;
    mapping(uint => string) public cutShapeToVideoUrls;
    mapping(uint => string) public polishShapeToVideoUrls;
    mapping(uint => string) public diamondDawnTypeToShipVideoUrls;

    // Carat loss of ~35% to ~65% from rough stone to the polished diamond.
    uint private constant MIN_ROUGH_TO_DIAMOND_POINTS_REDUCTION = 38;
    uint private constant MAX_ROUGH_TO_DIAMOND_POINTS_REDUCTION = 74;
    // Carat loss from ~2% to ~8% in the polish process.
    uint private constant MIN_POLISH_PROCESS_POINTS_REDUCTION = 1;
    uint private constant MAX_POLISH_PROCESS_POINTS_REDUCTION = 4;

    uint private _randNonce = 0;
    mapping(uint => DiamondDawnMetadata) private _tokenIdToMetadata;
    mapping(uint => bool) private _diamondDawnTypeToIsRevealed;
    address private _diamondDawnContract;
    DiamondCertificate[] private _mineDiamonds;

    constructor(address[] memory adminAddresses) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        // TODO: remove admins after testing
        for (uint i = 0; i < adminAddresses.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, adminAddresses[i]);
        }
    }

    /**********************     Modifiers     ************************/
    // TODO: Make the contract immutable by adding 2 functions (mine closed, mine dried).

    modifier onlyDiamondDawn() {
        require(msg.sender == _diamondDawnContract, "OnlyDiamondDawn allowed");
        _;
    }

    modifier onlyDiamondDawnType(
        uint tokenId,
        DiamondDawnType diamondDawnType
    ) {
        require(
            diamondDawnType == _tokenIdToMetadata[tokenId].type_,
            "Invalid diamond dawn type"
        );
        _;
    }

    modifier mineClosed() {
        require(!isMineOpen, "Diamond Dawn Mine is open");
        _;
    }

    modifier mineNotLocked() {
        require(!isMineLocked, "Diamond Dawn Mine is locked forever");
        _;
    }

    modifier mineNotDry() {
        require(_mineDiamonds.length > 0, "Diamond Dawn Mine is empty");
        _;
    }

    /**********************     External Functions     ************************/

    function initialize(address diamondDawnContract)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _diamondDawnContract = diamondDawnContract;
        isMineOpen = true;
    }

    function populateDiamonds(DiamondCertificate[] calldata diamonds)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < diamonds.length; i++) {
            _mineDiamonds.push(diamonds[i]);
        }
    }

    function setIsMineOpen(bool isMineOpen_) external
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

    function setRoughVideoUrl(string calldata roughUrl)
        external
        mineNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        roughShapeToVideoUrls[uint(RoughDiamondShape.MAKEABLE)] = roughUrl;
        _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.ROUGH)] = true;
    }

    function setCutVideoUrl(
        string calldata pearUrl,
        string calldata roundUrl,
        string calldata ovalUrl,
        string calldata radiantUrl
    ) external
    mineNotLocked
    onlyRole(DEFAULT_ADMIN_ROLE) {
        cutShapeToVideoUrls[uint(DiamondShape.PEAR)] = pearUrl;
        cutShapeToVideoUrls[uint(DiamondShape.ROUND)] = roundUrl;
        cutShapeToVideoUrls[uint(DiamondShape.OVAL)] = ovalUrl;
        cutShapeToVideoUrls[uint(DiamondShape.RADIANT)] = radiantUrl;
        _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.CUT)] = true;
    }

    function setPolishVideoUrl(
        string calldata pearUrl,
        string calldata roundUrl,
        string calldata ovalUrl,
        string calldata radiantUrl
    ) external
    mineNotLocked
    onlyRole(DEFAULT_ADMIN_ROLE) {
        polishShapeToVideoUrls[uint(DiamondShape.PEAR)] = pearUrl;
        polishShapeToVideoUrls[uint(DiamondShape.ROUND)] = roundUrl;
        polishShapeToVideoUrls[uint(DiamondShape.OVAL)] = ovalUrl;
        polishShapeToVideoUrls[uint(DiamondShape.RADIANT)] = radiantUrl;
        _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.POLISHED)] = true;
    }

    function setShipVideoUrls(
        string calldata burnUrl,
        string calldata rebirthUrl
    ) external
    mineNotLocked
    onlyRole(DEFAULT_ADMIN_ROLE) {
        diamondDawnTypeToShipVideoUrls[uint(DiamondDawnType.BURNED)] = burnUrl;
        diamondDawnTypeToShipVideoUrls[
            uint(DiamondDawnType.REBORN)
        ] = rebirthUrl;
        _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.BURNED)] = true;
        _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.REBORN)] = true;
    }

    function replaceLostShipment(uint tokenId, DiamondCertificate calldata diamond) external
    mineNotLocked
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        DiamondDawnMetadata storage metadata = _tokenIdToMetadata[tokenId];
        require(metadata.type_ == DiamondDawnType.REBORN || metadata.type_ == DiamondDawnType.BURNED, "Diamond isn't in shipping stage");
        metadata.certificate = diamond;
    }


    function enterMine(uint tokenId) external
    onlyDiamondDawn {
        _tokenIdToMetadata[tokenId] = DiamondDawnMetadata({
            type_: DiamondDawnType.ENTER_MINE,
            rough: RoughDiamondMetadata({
                shape: RoughDiamondShape.NO_SHAPE,
                pointsReduction: 0
            }),
            cut: CutDiamondMetadata({pointsReduction: 0}),
            certificate: DiamondCertificate({
                points: 0,
                clarity: "",
                color: "",
                cut: "",
                depth: "",
                fluorescence: "",
                length: "",
                polish: "",
                reportDate: 0,
                reportNumber: 0,
                shape: DiamondShape.NO_SHAPE,
                symmetry: "",
                width: ""
            })
        });
    }

    function mine(uint tokenId) external onlyDiamondDawn mineNotDry {
        uint pointsReduction = _getRandomNumberInRange(
            MIN_ROUGH_TO_DIAMOND_POINTS_REDUCTION,
            MAX_ROUGH_TO_DIAMOND_POINTS_REDUCTION
        );
        DiamondDawnMetadata storage metadata = _tokenIdToMetadata[tokenId];
        metadata.type_ = DiamondDawnType.ROUGH;
        metadata.rough = RoughDiamondMetadata({
            shape: RoughDiamondShape.MAKEABLE,
            pointsReduction: pointsReduction
        });
        metadata.certificate = _mineDiamond();
    }

    function cut(uint256 tokenId)
        external
        onlyDiamondDawn
        onlyDiamondDawnType(tokenId, DiamondDawnType.ROUGH)
    {
        // TODO: fix random points creation
        uint pointsReduction = _getRandomNumberInRange(
            MIN_POLISH_PROCESS_POINTS_REDUCTION,
            MAX_POLISH_PROCESS_POINTS_REDUCTION
        );
        DiamondDawnMetadata storage diamondDawnMetadata = _tokenIdToMetadata[
            tokenId
        ];
        diamondDawnMetadata.cut.pointsReduction = pointsReduction;
        diamondDawnMetadata.type_ = DiamondDawnType.CUT;
    }

    function polish(uint256 tokenId)
        external
        onlyDiamondDawn
        onlyDiamondDawnType(tokenId, DiamondDawnType.CUT)
    {
        _tokenIdToMetadata[tokenId].type_ = DiamondDawnType.POLISHED;
    }

    function burn(uint256 tokenId)
        external
        onlyDiamondDawn
        onlyDiamondDawnType(tokenId, DiamondDawnType.POLISHED)
    {
        _tokenIdToMetadata[tokenId].type_ = DiamondDawnType.BURNED;
    }

    function rebirth(uint256 tokenId)
        external
        onlyDiamondDawn
        onlyDiamondDawnType(tokenId, DiamondDawnType.BURNED)
    {
        _tokenIdToMetadata[tokenId].type_ = DiamondDawnType.REBORN;
    }

    function lockMine() external mineClosed onlyDiamondDawn {
        isMineLocked = true;
    }

    function getDiamondCount()
        external
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint)
    {
        return _mineDiamonds.length;
    }

    function getDiamondMetadata(uint tokenId)
        external
        view
        onlyDiamondDawn
        returns (string memory)
    {
        DiamondDawnMetadata memory diamondDawnMetadata = _tokenIdToMetadata[
            tokenId
        ];
        string memory videoUrl = _getDiamondDawnVideoUrl(diamondDawnMetadata);
        string memory base64Json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        _getDiamondDawnMetadataJson(
                            diamondDawnMetadata,
                            tokenId,
                            videoUrl
                        )
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
        return _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.ROUGH)];
    }

    function isCutReady() external view returns (bool) {
        return _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.CUT)];
    }

    function isPolishReady() external view returns (bool) {
        return _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.POLISHED)];
    }

    function isShipReady() external view returns (bool) {
        return
            _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.BURNED)] &&
            _diamondDawnTypeToIsRevealed[uint(DiamondDawnType.REBORN)];
    }

    /**********************     Private Functions     ************************/

    function _mineDiamond() private returns (DiamondCertificate memory) {
        // TODO: check if there's a library that pops a random element from the list.
        uint randomIndex = _getRandomNumberInRange(0, _mineDiamonds.length - 1);
        DiamondCertificate memory diamond = _mineDiamonds[randomIndex];

        // TODO: Move the last element into the place to delete
        if (_mineDiamonds.length > 1) {
            _mineDiamonds[randomIndex] = _mineDiamonds[
                _mineDiamonds.length - 1
            ];
        }
        _mineDiamonds.pop();
        return diamond;
    }

    function _getRandomNumberInRange(uint minNumber, uint maxNumber)
        private
        returns (uint)
    {
        _randNonce++;
        uint randomNumber = rand(_randNonce);
        uint range = maxNumber - minNumber + 1;
        return (randomNumber % range) + minNumber;
    }

    function _getDiamondDawnVideoUrl(
        DiamondDawnMetadata memory diamondDawnMetadata
    ) private view returns (string memory) {
        DiamondDawnType diamondDawnType = diamondDawnMetadata.type_;
        string memory videoUrl;
        if (DiamondDawnType.ENTER_MINE == diamondDawnType) {
            videoUrl = mineEntranceVideoUrl;
        } else if (DiamondDawnType.ROUGH == diamondDawnType) {
            videoUrl = roughShapeToVideoUrls[
                uint(diamondDawnMetadata.rough.shape)
            ];
        } else if (DiamondDawnType.CUT == diamondDawnType) {
            videoUrl = cutShapeToVideoUrls[
                uint(diamondDawnMetadata.certificate.shape)
            ];
        } else if (DiamondDawnType.POLISHED == diamondDawnType) {
            videoUrl = polishShapeToVideoUrls[
                uint(diamondDawnMetadata.certificate.shape)
            ];
        } else if (DiamondDawnType.BURNED == diamondDawnType) {
            videoUrl = diamondDawnTypeToShipVideoUrls[
                uint(DiamondDawnType.BURNED)
            ];
        } else if (DiamondDawnType.REBORN == diamondDawnType) {
            videoUrl = diamondDawnTypeToShipVideoUrls[
                uint(DiamondDawnType.REBORN)
            ];
        } else {
            revert("Failed fetching DiamondDawn video url - unknown type");
        }
        return string.concat(_videoBaseURI(), videoUrl);
    }

    function _videoBaseURI() private pure returns (string memory) {
        // TODO: in production we'll get the full ipfs/arweave url - base URI will change.
        // TODO: galk to check what's the best approach
        return
            "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";
    }

    function _getDiamondDawnMetadataJson(
        DiamondDawnMetadata memory diamondDawnMetadata,
        uint tokenId,
        string memory videoUrl
    ) private pure returns (string memory) {
        // TODO: Add real description
        ERC721MetadataStructure memory metadata = ERC721MetadataStructure({
            name: string(
                abi.encodePacked("Diamond Dawn #", Strings.toString(tokenId))
            ),
            description: "Diamond Dawn tokens description",
            createdBy: "Diamond Dawn",
            image: videoUrl,
            attributes: _getDiamondDawnJsonAttributes(diamondDawnMetadata)
        });

        return generateERC721Metadata(metadata);
    }

    function _getDiamondDawnJsonAttributes(
        DiamondDawnMetadata memory diamondDawnMetadata
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        //assert(diamondDawnMetadata.certificate.points > 0);

        DiamondDawnType diamondDawnType = diamondDawnMetadata.type_;
        if (DiamondDawnType.ENTER_MINE == diamondDawnType) {
            return _getMineEntranceJsonAttributes();
        } else if (DiamondDawnType.ROUGH == diamondDawnType) {
            return
                _getRoughDiamondJsonAttributes(
                    diamondDawnMetadata.rough,
                    diamondDawnMetadata.certificate
                );
        } else if (DiamondDawnType.CUT == diamondDawnType) {
            return
                _getCutDiamondJsonAttributes(
                    diamondDawnMetadata.cut,
                    diamondDawnMetadata.certificate
                );
        } else if (DiamondDawnType.POLISHED == diamondDawnType) {
            return
                _getPolishedDiamondJsonAttributes(
                    diamondDawnMetadata.certificate
                );
        } else if (DiamondDawnType.BURNED == diamondDawnType) {
            return _getBurnedDiamondJsonAttributes();
        } else if (DiamondDawnType.REBORN == diamondDawnType) {
            return
                _getRebornDiamondJsonAttributes(
                    diamondDawnMetadata.certificate
                );
        }
        revert("Failed fetching DiamondDawn json attributes - unknown type");
    }

    function _getTypeAttribute(DiamondDawnType diamondDawnType)
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
        metadataAttributes[0] = _getTypeAttribute(DiamondDawnType.ENTER_MINE);
        return metadataAttributes;
    }

    function _getBaseDiamondDawnJsonAttributes(
        DiamondDawnType diamondDawnType,
        uint points
    ) private pure returns (ERC721MetadataAttribute[] memory) {
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
            _pointsToCaratString(points)
        );
        return metadataAttributes;
    }

    function _getRoughDiamondJsonAttributes(
        RoughDiamondMetadata memory rough,
        DiamondCertificate memory certificate
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        assert(rough.pointsReduction > 0);
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseDiamondDawnJsonAttributes(
                DiamondDawnType.ROUGH,
                certificate.points + rough.pointsReduction
            );
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](7);
        // TODO make it more generic
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];

        // TODO: validate that the rough carat exists
        metadataAttributes[4] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Color",
            "CAPE"
        );
        metadataAttributes[5] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toRoughDiamondShapeString(rough.shape)
        );
        metadataAttributes[6] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Mine",
            "Underground"
        );
        return metadataAttributes;
    }

    function _getCutDiamondJsonAttributes(
        CutDiamondMetadata memory cutMetadata,
        DiamondCertificate memory certificate
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        assert(cutMetadata.pointsReduction > 0);
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseDiamondDawnJsonAttributes(
                DiamondDawnType.CUT,
                certificate.points + cutMetadata.pointsReduction
            );
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](11);
        // TODO make it more generic
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];

        metadataAttributes[4] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Color",
            certificate.color
        );
        metadataAttributes[5] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Cut",
            certificate.cut
        );
        metadataAttributes[6] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Depth",
            certificate.depth
        );
        metadataAttributes[7] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Fluorescence",
            certificate.fluorescence
        );
        metadataAttributes[8] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Length",
            certificate.length
        );
        metadataAttributes[9] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toDiamondShapeString(certificate.shape)
        );
        metadataAttributes[10] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Width",
            certificate.width
        );
        return metadataAttributes;
    }

    function _getPolishedDiamondJsonAttributes(
        DiamondCertificate memory certificate
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseDiamondDawnJsonAttributes(
                DiamondDawnType.POLISHED,
                certificate.points
            );
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](14);
        // TODO make it more generic
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];

        metadataAttributes[4] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Color",
            certificate.color
        );
        metadataAttributes[5] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Cut",
            certificate.cut
        );
        metadataAttributes[6] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Depth",
            certificate.depth
        );
        metadataAttributes[7] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Fluorescence",
            certificate.fluorescence
        );
        metadataAttributes[8] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Length",
            certificate.length
        );
        metadataAttributes[9] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toDiamondShapeString(certificate.shape)
        );
        metadataAttributes[10] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Width",
            certificate.width
        );
        // Polish
        metadataAttributes[11] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Clarity",
            certificate.clarity
        );
        metadataAttributes[12] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Polish",
            certificate.polish
        );
        metadataAttributes[13] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Symmetry",
            certificate.symmetry
        );
        return metadataAttributes;
    }

    function _getBurnedDiamondJsonAttributes()
        private
        pure
        returns (ERC721MetadataAttribute[] memory)
    {
        // TODO decide what are the burned parameters and choose carat accordingly
        return _getBaseDiamondDawnJsonAttributes(DiamondDawnType.BURNED, 1000);
    }

    function _getRebornDiamondJsonAttributes(
        DiamondCertificate memory certificate
    ) private pure returns (ERC721MetadataAttribute[] memory) {
        assert(certificate.points > 0);

        ERC721MetadataAttribute[]
            memory baseAttributes = _getBaseDiamondDawnJsonAttributes(
                DiamondDawnType.REBORN,
                certificate.points
            );
        ERC721MetadataAttribute[]
            memory metadataAttributes = new ERC721MetadataAttribute[](17);
        // TODO make it more generic
        metadataAttributes[0] = baseAttributes[0];
        metadataAttributes[1] = baseAttributes[1];
        metadataAttributes[2] = baseAttributes[2];
        metadataAttributes[3] = baseAttributes[3];

        metadataAttributes[4] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Color",
            certificate.color
        );
        metadataAttributes[5] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Cut",
            certificate.cut
        );
        metadataAttributes[6] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Depth",
            certificate.depth
        );
        metadataAttributes[7] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Fluorescence",
            certificate.fluorescence
        );
        metadataAttributes[8] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Length",
            certificate.length
        );
        metadataAttributes[9] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Shape",
            _toDiamondShapeString(certificate.shape)
        );
        metadataAttributes[10] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Width",
            certificate.width
        );
        // Polish
        metadataAttributes[11] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Clarity",
            certificate.clarity
        );
        metadataAttributes[12] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Polish",
            certificate.polish
        );
        metadataAttributes[13] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Symmetry",
            certificate.symmetry
        );

        // Rebirth
        metadataAttributes[14] = getERC721MetadataAttribute(
            false,
            true,
            true,
            "",
            "Laboratory",
            "GIA"
        );
        metadataAttributes[15] = getERC721MetadataAttribute(
            false,
            true,
            false,
            "",
            "Report Date",
            Strings.toString(certificate.reportDate)
        );
        metadataAttributes[16] = getERC721MetadataAttribute(
            false,
            true,
            false,
            "",
            "Report Number",
            Strings.toString(certificate.reportNumber)
        );
        return metadataAttributes;
    }

    function _toDiamondDawnTypeString(DiamondDawnType type_)
        private
        pure
        returns (string memory)
    {
        if (type_ == DiamondDawnType.ENTER_MINE) {
            return "Mine Entrance";
        } else if (type_ == DiamondDawnType.ROUGH) {
            return "Rough";
        } else if (type_ == DiamondDawnType.CUT) {
            return "Cut";
        } else if (type_ == DiamondDawnType.POLISHED) {
            return "Polished";
        } else if (type_ == DiamondDawnType.BURNED) {
            return "Burned";
        } else if (type_ == DiamondDawnType.REBORN) {
            return "Reborn";
        }
        revert("Failed to convert DiamondDawnType");
    }

    function _toRoughDiamondShapeString(RoughDiamondShape shape)
        private
        pure
        returns (string memory)
    {
        if (shape == RoughDiamondShape.MAKEABLE) {
            return "Makeable";
        }
        revert("Failed to convert RoughDiamondShape");
    }

    function _toDiamondShapeString(DiamondShape shape)
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
}
