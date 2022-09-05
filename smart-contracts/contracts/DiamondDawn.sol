// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interface/IDiamondDawn.sol";
import "./interface/IDiamondDawnAdmin.sol";
import "./interface/IDiamondDawnMine.sol";

/**
 * @title DiamondDawn NFT Contract
 * @author Diamond Dawn
 */
contract DiamondDawn is
    ERC721,
    ERC721Burnable,
    ERC721Enumerable,
    ERC721Royalty,
    AccessControl,
    Pausable,
    IDiamondDawn,
    IDiamondDawnAdmin
{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    bool public isLocked; // diamond dawn is locked forever when the project ends (immutable).
    uint public constant PRICE = 0.002 ether; // TODO: change to 3.33eth
    uint16 public constant MAX_MINE_ENTRANCE = 333;

    IDiamondDawnMine public ddMine;
    SystemStage public systemStage;

    mapping(address => EnumerableSet.UintSet) private _ownerToShippingTokenIds;
    mapping(uint256 => address) private _shippedTokenIdToOwner;
    mapping(bytes32 => bool) private _invitations;
    Counters.Counter private _tokenIdCounter;

    constructor(address _mineContract, uint16 maxMineEntrance_) ERC721("DiamondDawn", "DD") {
        _pause();
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setDefaultRoyalty(_msgSender(), 1000); // 10 %
        systemStage = SystemStage.INVITATIONS;
        ddMine = IDiamondDawnMine(_mineContract);
        // diamondDawnMine.initialize(address(this), MAX_MINE_ENTRANCE);
        ddMine.initialize(address(this), maxMineEntrance_); // TODO: remove maxMineEntrance_ once 333
    }

    /**********************          Modifiers          ************************/

    modifier diamondDawnNotLocked() {
        require(!isLocked, "Locked forever");
        _;
    }

    modifier onlySystemStage(SystemStage _stage) {
        require(systemStage == _stage, "Wrong stage");
        _;
    }

    modifier isMineReady(SystemStage systemStage_) {
        if (systemStage_ == SystemStage.INVITATIONS)
            require(ddMine.isMineReady(Type.ENTER_MINE), "Mine entrance not ready");
        if (systemStage_ == SystemStage.MINE_OPEN) require(ddMine.isMineReady(Type.ROUGH), "Rough not ready");
        if (systemStage_ == SystemStage.CUT_OPEN) require(ddMine.isMineReady(Type.CUT), "Cut not ready");
        if (systemStage_ == SystemStage.POLISH_OPEN)
            require(ddMine.isMineReady(Type.POLISHED), "Polish not ready");
        if (systemStage_ == SystemStage.SHIP) require(ddMine.isMineReady(Type.REBORN), "Ship not ready");

        _;
    }

    modifier validSystemStage(uint _systemStage) {
        require(_systemStage >= uint(type(SystemStage).min));
        require(_systemStage <= uint(type(SystemStage).max));
        _;
    }

    modifier costs(uint price) {
        require(msg.value == price, string.concat("Cost should be: ", Strings.toString(price)));
        _;
    }

    modifier onlyShippedDiamondOwner(uint tokenId) {
        address shippingOwner = _shippedTokenIdToOwner[tokenId];
        require(shippingOwner != address(0), "DiamondDawn is not shipping");
        require(shippingOwner == _msgSender(), "Sender isn't a diamond holder");
        _;
    }

    modifier isOwner(uint tokenId) {
        address owner = ERC721.ownerOf(tokenId);
        require(_msgSender() == owner, "Not owner");
        _;
    }

    modifier mineEntranceLeft() {
        require(_tokenIdCounter.current() <= MAX_MINE_ENTRANCE, "Diamond Dawn's mine is at max capacity.");
        _;
    }

    /**********************     External Functions     ************************/

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function allowMineEntrance(bytes32[] calldata passwordsHash)
        external
        diamondDawnNotLocked
        mineEntranceLeft
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlySystemStage(SystemStage.INVITATIONS)
    {
        for (uint i = 0; i < passwordsHash.length; i++) {
            _invitations[passwordsHash[i]] = true;
        }
    }

    function enter(string calldata password)
        external
        payable
        onlySystemStage(SystemStage.INVITATIONS)
        isMineReady(SystemStage.INVITATIONS)
        costs(PRICE)
    {
        // TODO: only 1 per wallet
        //        bytes32 passwordHash = keccak256(abi.encodePacked(password));
        //        require(
        //            _invitations[passwordHash],
        //            "You can't enter the mine, you're not invited"
        //        );
        //        delete _invitations[passwordHash];
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        // TODO: check if safeMint after or before mint.
        _safeMint(_msgSender(), tokenId);
        ddMine.enter(tokenId);
    }

    function mine(uint tokenId)
        external
        onlySystemStage(SystemStage.MINE_OPEN)
        isMineReady(SystemStage.MINE_OPEN)
        isOwner(tokenId)
    {
        ddMine.mine(tokenId);
    }

    function cut(uint tokenId)
        external
        onlySystemStage(SystemStage.CUT_OPEN)
        isMineReady(SystemStage.CUT_OPEN)
        isOwner(tokenId)
    {
        ddMine.cut(tokenId);
    }

    function polish(uint tokenId)
        external
        onlySystemStage(SystemStage.POLISH_OPEN)
        isMineReady(SystemStage.POLISH_OPEN)
        isOwner(tokenId)
    {
        ddMine.polish(tokenId);
    }

    function ship(uint tokenId)
        external
        onlySystemStage(SystemStage.SHIP)
        isMineReady(SystemStage.SHIP)
        isOwner(tokenId)
    {
        _burn(tokenId); // Disable NFT transfer while diamond is in transit.
        ddMine.ship(tokenId);
        _shippedTokenIdToOwner[tokenId] = _msgSender();
        _ownerToShippingTokenIds[_msgSender()].add(tokenId);
    }

    function rebirth(uint tokenId)
        external
        isMineReady(SystemStage.SHIP)
        onlyShippedDiamondOwner(tokenId)
    // isOwner(tokenId) TODO: check how to solve only owner
    {
        // TODO: Only owner
        // TODO: protect rebirth with a stupid password (keccak256(tokenId) for example.
        delete _shippedTokenIdToOwner[tokenId];
        _ownerToShippingTokenIds[_msgSender()].remove(tokenId);
        ddMine.rebirth(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function lockDiamondDawn() external diamondDawnNotLocked onlyRole(DEFAULT_ADMIN_ROLE) {
        isLocked = true;
    }

    function setSystemStage(uint systemStage_)
        external
        diamondDawnNotLocked
        validSystemStage(systemStage_)
        isMineReady(SystemStage(systemStage_))
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // TODO: Mine Open should be open when we had 333 diamonds at the beginning
        systemStage = SystemStage(systemStage_);
        emit SystemStageChanged(systemStage);
    }

    function getShippingTokenIds(address owner) external view returns (uint[] memory) {
        return _ownerToShippingTokenIds[owner].values();
    }

    /**********************     Public Functions     ************************/

    function pause() public diamondDawnNotLocked onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public diamondDawnNotLocked onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // TODO - this require blocks getting the tokenURI of burnt tokens
        // require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        // TODO! shouldn't we add a require that checks for "tokenId is (burned or exists)"?
        return ddMine.getMetadata(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721Royalty, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**********************     Internal Functions     ************************/

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        // TODO: there is a problem with ERC721Enumerable and burn mechanism - should implement in another way
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }
}
