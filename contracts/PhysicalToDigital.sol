// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @custom:security-contact tweezers@gmail.com
contract PhysicalToDigital is ERC721, Pausable, AccessControl, ERC721Burnable {
    using Counters for Counters.Counter;

    struct TokenMetadata {
        uint level;
        uint processesLeft;
    }

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    
    uint private constant MAX_LEVEL = 4;
    uint public stage;
    uint public constant MINING_PRICE = 0.01 ether;
    uint public constant PREPAID_PROCESSING_PRICE = 0.01 ether;
    uint public processingPrice;
    bool public isStageActive;
    string[MAX_LEVEL + 1] private _videoUrls;
    mapping(uint256 => TokenMetadata) private _tokensMetadata;

    constructor() ERC721("PhysicalToDigital", "PTD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        processingPrice = 0.01 ether;
        stage = 1;
        isStageActive = false;
        _pause();
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

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    // Custom logics

    function _requireActiveStage() internal view {
        require(isStageActive, "P2D: A stage should be active to perform this action");
    }

    function _requireSpecificStage(uint _stage) internal view  {
        require(stage == _stage, string.concat("P2D: The stage should be ", Strings.toString(_stage), " to perform this action"));
    }

    modifier whenStageIsActive(uint _stage) {
        _requireActiveStage();
        _requireSpecificStage(_stage);
        _;
    }

    // Admin API - Write

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
        isStageActive = true;
        _videoUrls[stage] = videoUrl;
    }

    function completeStage()
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        isStageActive = false;
        stage++;
    }

    // Client API - Write

    function mine(uint processesPurchased) 
        public
        payable
        whenStageIsActive(1)
    {
        require(processesPurchased <= MAX_LEVEL - 1, string.concat("P2D: Purchased processes should be less than or equal to ", Strings.toString(MAX_LEVEL - 1)));
        
        uint price = MINING_PRICE + processesPurchased * PREPAID_PROCESSING_PRICE;
        require(msg.value == price, string.concat("P2D: Wrong payment - payment should be: ", Strings.toString(price)));

        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        
        // Store token metadata
        _tokensMetadata[tokenId] = TokenMetadata({
            level: 1,
            processesLeft: processesPurchased
        });
    }

    function _process(uint256 tokenId)
        internal
    {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner nor approved");
        require(_tokensMetadata[tokenId].level == stage - 1, string.concat("P2D: The level of the diamond should be ",  Strings.toString(stage - 1), " to perform this action"));

        if (_tokensMetadata[tokenId].processesLeft == 0) {
            require(msg.value == processingPrice, string.concat("P2D: Wrong payment - payment should be: ", Strings.toString(processingPrice)));
        }

        _tokensMetadata[tokenId].level++;
        _tokensMetadata[tokenId].processesLeft--;
    }

    function polish(uint256 tokenId) 
        public
        payable
        whenStageIsActive(2)
    {
        _process(tokenId);
    }

    function clean(uint256 tokenId) 
        public
        payable
        whenStageIsActive(3)
    {
        _process(tokenId);
    }

    // Client API - Read

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        // _requireMinted(tokenId);

        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Physical To  Digital", "description": "This is the description of Physical To Digital Project", "image": "https://media.niftygateway.com/video/upload/v1639421141/Andrea/DavidAriew/DecCurated/Mystical_Cabaret_-_David_Ariew_1_wzdhuw.png", "animation_url": "', _getVideoUrl(tokenId), '" }'))));
        
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function _getImageUrl(uint256 tokenId) internal view returns (string memory) {
        // _requireMinted(tokenId);

        return "https://media.niftygateway.com/video/upload/v1639421141/Andrea/DavidAriew/DecCurated/Mystical_Cabaret_-_David_Ariew_1_wzdhuw.png";
    }

    function _getVideoUrl(uint256 tokenId) internal view returns (string memory) {
        return _videoUrls[_tokensMetadata[tokenId].level];
    }
}
