// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

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
        uint8 level;
        uint8 enhancementsLeft;
    }

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint8 private constant MAX_LEVEL = 3;
    uint8 private _currentStage = 0;
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => TokenMetadata) private _tokensMetadata;

    constructor() ERC721("PhysicalToDigital", "PTD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
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
        // TODO: change to tokenUri storage instead of multiple ifs? base uri + level
        if (_tokensMetadata[tokenId].level == 0) {
            return "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        } else if (_tokensMetadata[tokenId].level == 1) {
            return "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
        } else if (_tokensMetadata[tokenId].level == 2) {
            return "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
        } else if (_tokensMetadata[tokenId].level == 3) {
            return "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
        }
    }

    function setStage(uint8 stage) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _currentStage = stage;
    }

    function mine(uint8 enhancementsCount) 
        public
        whenNotPaused
    {
        // TODO: replace magic number with constant
        require(enhancementsCount <= MAX_LEVEL, "Enhancements count must be less than or equal to 3");

        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        
        // Store token metadata
        _tokensMetadata[tokenId] = TokenMetadata({
            level: 0,
            enhancementsLeft: enhancementsCount
        });
    }

    function _enhance(uint256 tokenId)
        // TODO: change to internal after testing 
        public 
        whenNotPaused
    {
        // _requireMinted(tokenId);
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner nor approved");
        require(_tokensMetadata[tokenId].enhancementsLeft > 0, "Insufficient enhancements");
        // TODO: decide whether it should be _tokensMetadata[tokenId].level = _currentStage - 1
        require(_tokensMetadata[tokenId].level < _currentStage, "The diamond was already enhanced in this stage");

        _tokensMetadata[tokenId].level++;
        _tokensMetadata[tokenId].enhancementsLeft--;
    }
}
