// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

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
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawn.sol";
import "./interface/IDiamondDawnAdmin.sol";

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
    ERC721Enumerable,
    IDiamondDawn,
    IDiamondDawnAdmin
{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    uint public constant MINING_PRICE = 0.002 ether;
    SystemStage public stage;
    IDiamondDawnMine public diamondDawnMine;

    mapping(address => EnumerableSet.UintSet) private _ownerToShippingTokenIds;
    mapping(uint256 => address) private _shippedTokenIdToOwner;
    Counters.Counter private _tokenIdCounter;

    constructor(
        uint96 _royaltyFeesInBips,
        address _diamondDawnMineContract,
        address[] memory adminAddresses
    ) ERC721("DiamondDawn", "DD") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        stage = SystemStage.MINE_OPEN;
        setRoyaltyInfo(_msgSender(), _royaltyFeesInBips);
        diamondDawnMine = IDiamondDawnMine(_diamondDawnMineContract);
        _tokenIdCounter.increment();
        _pause();
        // TODO: remove in production
        for (uint i = 0; i < adminAddresses.length; i++) {
            _grantRole(DEFAULT_ADMIN_ROLE, adminAddresses[i]);
        }
    }

    /**********************          Modifiers          ************************/

    modifier onlyStage(SystemStage _stage) {
        require(
            stage == _stage,
            string.concat(
                "The stage should be ",
                Strings.toString(uint(_stage)),
                " to perform this action"
            )
        );
        _;
    }

    modifier notLastStage() {
        require(uint(stage) < uint(type(SystemStage).max));
    }

    modifier costs(uint price) {
        require(
            msg.value == price,
            string.concat("Cost should be: ", Strings.toString(price))
        );
        _;
    }

    modifier onlyShippedDiamondOwner(uint tokenId) {
        address shippingOwner = _shippedTokenIdToOwner[tokenId];
        require(shippingOwner != address(0), "DiamondDawn is not shipping");
        require(shippingOwner == _msgSender(), "Sender isn't a diamond holder");
        _;
    }

    modifier assignedDiamondDawnMine() {
        require(
            address(diamondDawnMine) != address(0),
            "DiamondDawnMine contract is not set"
        );
        _;
    }

    /**********************     External Functions     ************************/

    function mine()
        external
        payable
        assignedDiamondDawnMine
        onlyStage(SystemStage.MINE_OPEN)
        costs(MINING_PRICE)
    {
        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_msgSender(), tokenId);
        diamondDawnMine.mine(tokenId);
        emit Mine(tokenId);
    }

    function cut(uint256 tokenId)
        external
        assignedDiamondDawnMine
        onlyStage(SystemStage.CUT_OPEN)
    {
        diamondDawnMine.cut(tokenId);
        emit Cut(tokenId);
    }

    function polish(uint256 tokenId)
        external
        assignedDiamondDawnMine
        onlyStage(SystemStage.POLISH_OPEN)
    {
        diamondDawnMine.polish(tokenId);
        emit Polish(tokenId);
    }

    function ship(uint256 tokenId)
        external
        assignedDiamondDawnMine
        onlyStage(SystemStage.SHIP)
    {
        super.burn(tokenId);
        diamondDawnMine.burn(tokenId);
        _shippedTokenIdToOwner[tokenId] = _msgSender();
        _ownerToShippingTokenIds[_msgSender()].add(tokenId);
        emit Ship(tokenId);
    }

    function rebirth(uint256 tokenId)
        external
        assignedDiamondDawnMine
        onlyStage(SystemStage.SHIP)
        onlyShippedDiamondOwner(tokenId)
    {
        address burner = _shippedTokenIdToOwner[tokenId];
        delete _shippedTokenIdToOwner[tokenId];
        _ownerToShippingTokenIds[_msgSender()].remove(tokenId);
        diamondDawnMine.rebirth(tokenId);
        _safeMint(_msgSender(), tokenId);
        emit Rebirth(tokenId);
    }

    function setDiamondDawnMine(address diamondDawnMine_)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        diamondDawnMine = IDiamondDawnMine(diamondDawnMine_);
    }

    function nextStage() external onlyRole(DEFAULT_ADMIN_ROLE) notLastStage {
        stage = SystemStage(uint(stage) + 1);
        emit SystemStageChanged(stage);
    }

    function getTokenIdsByOwner(address owner)
        external
        view
        returns (uint[] memory)
    {
        uint ownerTokenCount = balanceOf(owner);
        uint[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }

    function getShippingTokenIds(address owner)
        external
        view
        returns (uint[] memory)
    {
        return _ownerToShippingTokenIds[owner].values();
    }

    /**********************     Public Functions     ************************/
    // TODO: Add withdraw funds method

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        assignedDiamondDawnMine
        returns (string memory)
    {
        // TODO - this require blocks getting the tokenURI of burnt tokens
        // require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        // TODO! shouldn't we add a require that checks for "tokenId is (burned or exists)"?
        return diamondDawnMine.getDiamondMetadata(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl, ERC2981)
        returns (bool)
    {
        // EIP2981 supported for royalties
        return super.supportsInterface(interfaceId);
    }

    /**********************     Internal Functions     ************************/

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
