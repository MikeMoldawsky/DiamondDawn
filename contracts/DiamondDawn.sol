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
        PHYSICAL,
        REBIRTH
    }

    struct Metadata {
        Stage stage;
        uint processesLeft;
    }

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    Stage private constant MAX_STAGE = Stage.REBIRTH;
    Stage public stage;
    uint public constant MINING_PRICE = 0.2 ether;
    uint public constant CUT_PRICE = 0.4 ether;
    uint public constant POLISH_PRICE = 0.6 ether;
    uint public constant PREPAID_CUT_PRICE = 0.2 ether;
    uint public constant PREPAID_POLISH_PRICE = 0.4 ether;
    bool public isStageActive;

    mapping(Stage => string) private _videoUrls;
    mapping(uint256 => Metadata) private _tokensMetadata;
    mapping(address => bool) private _mintAllowedAddresses;
    mapping(uint256 => address) private _burnedTokens;

    constructor(uint96 _royaltyFeesInBips) ERC721("DiamondDawn", "DD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _mintAllowedAddresses[msg.sender] = true;

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

    modifier _requireAllowedMiner() {
        require(
            _mintAllowedAddresses[_msgSender()],
            "P2D: The miner is not allowed to mint tokens"
        );
        _;
    }

    function _requireValidProcessesPurchased(uint processesPurchased)
        internal
        pure
    {
        require(
            processesPurchased <= uint(MAX_STAGE) - 1,
            string.concat(
                "P2D: Purchased processes should be less than or equal to ",
                Strings.toString(uint(MAX_STAGE) - 1)
            )
        );
    }

    function _requireValidPayment(uint processesPurchased, uint value)
        internal
        pure
    {
        uint price = MINING_PRICE;
        if (processesPurchased > 0) {
            price += PREPAID_CUT_PRICE;
        }
        if (processesPurchased > 1) {
            price += PREPAID_POLISH_PRICE;
        }

        require(
            value == price,
            string.concat(
                "P2D: Wrong payment - payment should be: ",
                Strings.toString(price)
            )
        );
    }

    modifier whenStageIsActive(Stage _stage) {
        _requireActiveStage();
        _requireSpecificStage(_stage);
        _;
    }

    modifier whenRebirthIsActive() {
        require(
            (stage == Stage.PHYSICAL && isStageActive) || stage == Stage.REBIRTH,
            "P2D: A stage should be active to perform this action"
        );
        _;
    }

    function _getNextStageForToken(uint tokenId) internal view returns (Stage) {
        return _getNextStage(_tokensMetadata[tokenId].stage);
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
        //        processingPrice = price;
    }

    function revealStage(string memory videoUrl)
        public
    //        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _activateStage();
        _assignCurrentStageVideo(videoUrl);
    }

    function completeCurrentStage() public //    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _deactivateStage();
        _nextStage();
    }

    function addToAllowList(address[] memory addresses)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < addresses.length; i++) {
            _mintAllowedAddresses[addresses[i]] = true;
        }
    }

    function dev__ResetStage() public {
        stage = Stage(0);
        isStageActive = false;
    }

    // Client API - Write

    function mine(uint processesPurchased)
        public
        payable
        whenStageIsActive(Stage.MINE)
        _requireAllowedMiner
    {
        _requireValidProcessesPurchased(processesPurchased);
        _requireValidPayment(processesPurchased, msg.value);

        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);

        // Store token metadata
        _tokensMetadata[tokenId] = Metadata({
            stage: Stage.MINE,
            processesLeft: processesPurchased
        });

        // Restrict another mint by the same miner
        _mintAllowedAddresses[_msgSender()] = false;
    }

    function _process(uint256 tokenId, uint processingPrice) internal {
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

        if (_tokensMetadata[tokenId].processesLeft > 0) {
            _tokensMetadata[tokenId].processesLeft--;
        }
        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
    }

    function cut(uint256 tokenId) public payable whenStageIsActive(Stage.CUT) {
        _process(tokenId, CUT_PRICE);
    }

    function polish(uint256 tokenId)
        public
        payable
        whenStageIsActive(Stage.POLISH)
    {
        _process(tokenId, POLISH_PRICE);
    }

    function burn(uint256 tokenId)
        public
        override
        whenStageIsActive(Stage.PHYSICAL)
    {
        super.burn(tokenId);
        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
        _burnedTokens[tokenId] = _msgSender();
    }

    function rebirth(uint256 tokenId) public whenRebirthIsActive() {
        address burner = _burnedTokens[tokenId];
        require(
            _msgSender() == burner,
            string.concat(
                "Rebirth failed - only burner is allowed to perform rebirth"
            )
        );
        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
        _safeMint(_msgSender(), tokenId);
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
                        '", "stage": "',
                            Strings.toString(uint(_tokensMetadata[tokenId].stage)),
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
