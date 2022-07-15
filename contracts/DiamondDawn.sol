// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

/**
 * @title DiamondDawn NFT Contract 
 * @author Diamond Dawn
 */
contract DiamondDawn is
    ERC721,
    ERC2981,
    Pausable,
    AccessControl,
    ERC721Burnable,
    ERC721Enumerable
{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    enum Stage {
        MINE,
        CUT,
        POLISH,
        PHYSICAL,
        REBIRTH
    }

    enum Shape {
        OVAL,
        RADIANT,
        PEAR,
        ROUGH
    }

    struct Metadata {
        Stage stage;
        bool cutable;
        bool polishable;
        Shape shape;
    }

    event StageChanged(Stage stage, bool isStageActive);

    Counters.Counter private _tokenIdCounter;
    Stage private constant MAX_STAGE = Stage.REBIRTH;
    Stage public stage;
    uint public constant MINING_PRICE = 0.2 ether;
    uint public constant CUT_PRICE = 0.4 ether;
    uint public constant POLISH_PRICE = 0.6 ether;
    uint public constant PREPAID_CUT_PRICE = 0.2 ether;
    uint public constant PREPAID_POLISH_PRICE = 0.4 ether;
    bool public isStageActive;
    mapping(address => bool) public mintAllowedAddresses;
    mapping(Stage => string) private _videoUrls;
    mapping(uint256 => Metadata) private _tokensMetadata;
    mapping(uint256 => address) private _burnedTokenToOwner;
    mapping(address => EnumerableSet.UintSet) private _ownerToBurnedTokens;

    /**************************************************************************
     *                                                                        *
     *                               General                                  *
     *                                                                        *
     **************************************************************************/

    constructor(uint96 _royaltyFeesInBips) ERC721("DiamondDawn", "DD") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        mintAllowedAddresses[_msgSender()] = true;
        stage = Stage.MINE;
        isStageActive = false;
        setRoyaltyInfo(_msgSender(), _royaltyFeesInBips);
        _pause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId) public view
        override(ERC721, ERC721Enumerable, AccessControl, ERC2981)
        returns (bool)
    {
        // EIP2981 supported for royalties
        return super.supportsInterface(interfaceId);
    }

    function _getNextStage(Stage _stage) internal pure returns (Stage) {
        require(
            uint(_stage) < uint(MAX_STAGE),
            string.concat(
                "The stage should be less than ",
                Strings.toString(uint(MAX_STAGE))
            )
        );

        return Stage(uint(_stage) + 1);
    }

    /**************************************************************************
     *                                                                        *
     *                       Administrator functions                          *
     *                                                                        *
     **************************************************************************/

    /**********************     Internal & Helpers     ************************/

    function _activateStage() internal
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        isStageActive = true;
    }

    function _nextStage() internal 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        stage = _getNextStage(stage);
    }

    function _deactivateStage() internal 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        isStageActive = false;
    }

    function _assignCurrentStageVideo(string memory videoUrl) internal
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _videoUrls[stage] = videoUrl;
    }

    /**********************        Transactions        ************************/

    function safeMint(address to) public onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function revealStage(string memory videoUrl) public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _activateStage();
        _assignCurrentStageVideo(videoUrl);

        emit StageChanged(stage, isStageActive);
    }

    function completeCurrentStage() public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _deactivateStage();
        _nextStage();

        emit StageChanged(stage, isStageActive);
    }

    function completeCurrentStageAndRevealNextStage(string memory videoUrl ) public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        completeCurrentStage();
        revealStage(videoUrl);
    }

    function addToAllowList(address[] memory addresses) public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < addresses.length; i++) {
            mintAllowedAddresses[addresses[i]] = true;
        }
    }

    // TODO: Remove this method before production
    function dev__ResetStage() public {
        stage = Stage(0);
        isStageActive = false;

        emit StageChanged(stage, isStageActive);
    }

    /**********************            Read            ************************/

    /**************************************************************************
     *                                                                        *
     *                             Client functions                           *
     *                                                                        *
     **************************************************************************/

    /**********************     Internal & Helpers     ************************/

    function _baseURI() internal pure override returns (string memory) {
        return "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/";
    }

    function _getNextStageForToken(uint tokenId) internal view returns (Stage) {
        return _getNextStage(_tokensMetadata[tokenId].stage);
    }

    function _process(uint256 tokenId, uint processingPrice) internal {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: caller is not token owner nor approved"
        );
        require(
            uint(_tokensMetadata[tokenId].stage) == uint(stage) - 1,
            string.concat(
                "The level of the diamond should be ",
                Strings.toString(uint(stage) - 1),
                " to perform this action"
            )
        );

        if (
            (stage == Stage.CUT && !_tokensMetadata[tokenId].cutable) ||
            (stage == Stage.POLISH && !_tokensMetadata[tokenId].polishable)
        ) {
            require(
                msg.value == processingPrice,
                string.concat(
                    "Wrong payment - payment should be: ",
                    Strings.toString(processingPrice)
                )
            );
        }

        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
    }

    function _getVideoUrl(uint256 tokenId) internal view returns (string memory)
    {
        return
            string.concat(
                _baseURI(),
                _videoUrls[_tokensMetadata[tokenId].stage]
            );
    }

    function _getRandomNumber() internal view returns (uint) {
        uint randomNumber = _randomModulo(100);
        // 0  - 34 it will be shape 1
        // 35 - 70 it will be shape 2
        // 70 - 99 it will be shape 3
        if (randomNumber <= 34) {
            return 0;
        } else if (randomNumber >= 35 && randomNumber <= 70) {
            return 1;
        } else {
            return 2;
        }
    }

    function _randomModulo(uint modulo) internal view returns (uint) {
        return
            uint(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % modulo;
    }

    /**********************           Guards            ************************/

    function _requireActiveStage() internal view {
        require(
            isStageActive,
            "A stage should be active to perform this action"
        );
    }

    function _requireSpecificStage(Stage _stage) internal view {
        require(
            stage == _stage,
            string.concat(
                "The stage should be ",
                Strings.toString(uint(_stage)),
                " to perform this action"
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
                "Wrong payment - payment should be: ",
                Strings.toString(price)
            )
        );
    }

    function _requireValidProcessesPurchased(uint processesPurchased)
        internal
        pure
    {
        require(
            processesPurchased <= uint(MAX_STAGE) - 1,
            string.concat(
                "Purchased processes should be less than or equal to ",
                Strings.toString(uint(MAX_STAGE) - 1)
            )
        );
    }

    /**********************          Modifiers          ************************/

    modifier _requireAllowedMiner() {
        require(
            mintAllowedAddresses[_msgSender()],
            "The miner is not allowed to mint tokens"
        );
        _;
    }

    modifier whenStageIsActive(Stage _stage) {
        _requireActiveStage();
        _requireSpecificStage(_stage);
        _;
    }

    modifier whenRebirthIsActive() {
        require(
            (stage == Stage.PHYSICAL && isStageActive) ||
                stage == Stage.REBIRTH,
            "A stage should be active to perform this action"
        );
        _;
    }

    /**********************        Transactions        ************************/

    function mine(uint processesPurchased) public payable
        whenStageIsActive(Stage.MINE)
        _requireAllowedMiner
    {
        _requireValidProcessesPurchased(processesPurchased);
        _requireValidPayment(processesPurchased, msg.value);

        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_msgSender(), tokenId);

        // Store token metadata
        _tokensMetadata[tokenId] = Metadata({
            stage: Stage.MINE,
            cutable: processesPurchased >= 1,
            polishable: processesPurchased == 2,
            shape: Shape.ROUGH
        });

        // Restrict another mint by the same miner
        delete mintAllowedAddresses[_msgSender()];
    }

    function cut(uint256 tokenId) public payable 
        whenStageIsActive(Stage.CUT) 
    {
        _process(tokenId, CUT_PRICE);

        uint randomNumber = _getRandomNumber();
        _tokensMetadata[tokenId].shape = Shape(randomNumber);
    }

    function polish(uint256 tokenId) public payable
        whenStageIsActive(Stage.POLISH)
    {
        _process(tokenId, POLISH_PRICE);
    }

    function burn(uint256 tokenId) public override
        whenStageIsActive(Stage.PHYSICAL)
    {
        super.burn(tokenId);
        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
        _burnedTokenToOwner[tokenId] = _msgSender();
        _ownerToBurnedTokens[_msgSender()].add(tokenId);
    }

    function rebirth(uint256 tokenId) public whenRebirthIsActive {
        address burner = _burnedTokenToOwner[tokenId];
        require(
            _msgSender() == burner,
            string.concat(
                "Rebirth failed - only burner is allowed to perform rebirth"
            )
        );
        delete _burnedTokenToOwner[tokenId];
        _ownerToBurnedTokens[_msgSender()].remove(tokenId);
        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    /**********************            Read            ************************/

    function walletOfOwner(address _owner) public view returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function getBurnedTokens(address owner) public view returns (uint256[] memory)
    {
        return _ownerToBurnedTokens[owner].values();
    }

    function getShapeForToken(uint tokenId) public view returns (Shape) {
        return _tokensMetadata[tokenId].shape;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory videoUrl = _getVideoUrl(tokenId);
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Diamond Dawn", "description": "This is the description of Diamond Dawn Project", "image": "',
                        videoUrl,
                        '", "animation_url": "',
                        videoUrl,
                        '", "stage": ',
                        Strings.toString(uint(_tokensMetadata[tokenId].stage)),
                        ', "shape": ',
                        Strings.toString(uint(_tokensMetadata[tokenId].shape)),
                        ', "cutable": ',
                        _tokensMetadata[tokenId].cutable ? "true" : "false",
                        ', "polishable": ',
                        _tokensMetadata[tokenId].polishable ? "true" : "false",
                        " }"
                    )
                )
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
