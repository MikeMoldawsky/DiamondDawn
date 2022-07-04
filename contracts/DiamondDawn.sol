// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

/// @custom:security-contact tweezers@gmail.com
contract DiamondDawn is
    ERC721,
    ERC2981,
    Pausable,
    AccessControl,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    enum Stage {
        MINE,
        CUT,
        POLISH,
        PHYSICAL
    }

    struct Metadata {
        Stage stage;
        uint processesLeft;
    }

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    Stage private constant MAX_STAGE = Stage.PHYSICAL;
    Stage public stage;
    uint public constant MINING_PRICE = 0.01 ether;
    uint public constant PREPAID_PROCESSING_PRICE = 0.01 ether;
    uint public processingPrice;
    bool public isStageActive;
    mapping(Stage => string) private _videoUrls;
    mapping(uint256 => Metadata) private _tokensMetadata;

    constructor(uint96 _royaltyFeesInBips) ERC721("DiamondDawn", "DD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        processingPrice = PREPAID_PROCESSING_PRICE;
        stage = Stage.MINE;
        isStageActive = false;
        setRoyaltyInfo(msg.sender, _royaltyFeesInBips);
        _pause();
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "www.tweezers.com";
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl, ERC2981)
        returns (bool)
    {
        // EIP2981 supported for royalities
        return super.supportsInterface(interfaceId);
    }

    // Custom logics

    function _requireActiveStage() internal view {
        require(
            isStageActive,
            "P2D: A stage should be active to perform this action"
        );
    }

    function _requireSpecificStage(Stage _stage) internal view {
        require(
            stage == _stage,
            string.concat(
                "P2D: The stage should be ",
                Strings.toString(uint(_stage)),
                " to perform this action"
            )
        );
    }

    modifier whenStageIsActive(Stage _stage) {
        _requireActiveStage();
        _requireSpecificStage(_stage);
        _;
    }

    function _getNextStage(Stage _stage) internal pure returns (Stage) {
        require(
            uint(_stage) < uint(MAX_STAGE),
            string.concat(
                "P2D: The stage should be less than ",
                Strings.toString(uint(MAX_STAGE))
            )
        );

        return Stage(uint(_stage) + 1);
    }

    // Admin API - Write

    // Internal

    function _activateStage() internal onlyRole(DEFAULT_ADMIN_ROLE) {
        isStageActive = true;
    }

    function _nextStage() internal onlyRole(DEFAULT_ADMIN_ROLE) {
        stage = _getNextStage(stage);
    }

    function _deactivateStage() internal onlyRole(DEFAULT_ADMIN_ROLE) {
        isStageActive = false;
    }

    function _assignCurrentStageVideo(string memory videoUrl)
        internal
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _videoUrls[stage] = videoUrl;
    }

    // Public

    function setProcessingPrice(uint price)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        processingPrice = price;
    }

    function revealStage(string memory videoUrl)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _activateStage();
        _assignCurrentStageVideo(videoUrl);
    }

    function completeCurrentStage() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _deactivateStage();
        _nextStage();
    }

    // Client API - Write

    function mine(uint processesPurchased)
        public
        payable
        whenStageIsActive(Stage.MINE)
    {
        require(
            processesPurchased <= uint(MAX_STAGE) - 1,
            string.concat(
                "P2D: Purchased processes should be less than or equal to ",
                Strings.toString(uint(MAX_STAGE) - 1)
            )
        );

        uint price = MINING_PRICE +
            (processesPurchased * PREPAID_PROCESSING_PRICE);
        require(
            msg.value == price,
            string.concat(
                "P2D: Wrong payment - payment should be: ",
                Strings.toString(price)
            )
        );

        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);

        // Store token metadata
        _tokensMetadata[tokenId] = Metadata({
            stage: Stage.MINE,
            processesLeft: processesPurchased
        });
    }

    function _process(uint256 tokenId) internal {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: caller is not token owner nor approved"
        );
        require(
            uint(_tokensMetadata[tokenId].stage) == uint(stage) - 1,
            string.concat(
                "P2D: The level of the diamond should be ",
                Strings.toString(uint(stage) - 1),
                " to perform this action"
            )
        );

        if (_tokensMetadata[tokenId].processesLeft == 0) {
            require(
                msg.value == processingPrice,
                string.concat(
                    "P2D: Wrong payment - payment should be: ",
                    Strings.toString(processingPrice)
                )
            );
        }

        _tokensMetadata[tokenId].stage = _getNextStage(
            _tokensMetadata[tokenId].stage
        );
        _tokensMetadata[tokenId].processesLeft--;
    }

    function cut(uint256 tokenId) public payable whenStageIsActive(Stage.CUT) {
        _process(tokenId);
    }

    function polish(uint256 tokenId)
        public
        payable
        whenStageIsActive(Stage.POLISH)
    {
        _process(tokenId);
    }

    // Client API - Read

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        // _requireMinted(tokenId);

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Diamond Dawn", "description": "This is the description of Diamond Dawn Project", "image": "https://media.niftygateway.com/video/upload/v1639421141/Andrea/DavidAriew/DecCurated/Mystical_Cabaret_-_David_Ariew_1_wzdhuw.png", "animation_url": "',
                        _getVideoUrl(tokenId),
                        '" }'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _getImageUrl(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        // _requireMinted(tokenId);

        return
            "https://media.niftygateway.com/video/upload/v1639421141/Andrea/DavidAriew/DecCurated/Mystical_Cabaret_-_David_Ariew_1_wzdhuw.png";
    }

    function _getVideoUrl(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return _videoUrls[_tokensMetadata[tokenId].stage];
    }
}
