// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
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
    ERC721Royalty,
    AccessControl,
    Pausable,
    IDiamondDawn,
    IDiamondDawnAdmin
{
    using EnumerableSet for EnumerableSet.UintSet;

    uint public constant PRICE = 0.002 ether; // TODO: change to 3.33eth
    uint16 public constant MAX_MINE_ENTRANCE = 333;

    bool public isLocked; // locked forever (immutable).
    bool public isStageActive;
    Stage public stage;
    IDiamondDawnMine public ddMine;

    uint16 private _tokenIdCounter;
    mapping(address => EnumerableSet.UintSet) private _ownerToShippedIds;
    mapping(bytes32 => bool) private _invites;

    constructor(address mine_, uint16 maxEntrance_) ERC721("DiamondDawn", "DD") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setDefaultRoyalty(_msgSender(), 1000); // 10 %
        ddMine = IDiamondDawnMine(mine_);
        // TODO: remove maxMineEntrance_ once staging is deploying 333 automatically.
        ddMine.initialize(address(this), maxEntrance_);
        // diamondDawnMine.initialize(address(this), MAX_MINE_ENTRANCE);
    }

    /**********************          Modifiers          ************************/

    modifier isNotLocked() {
        require(!isLocked, "Locked forever");
        _;
    }

    modifier isActiveReadyStage(Stage stage_) {
        require(stage == stage_, "Wrong stage");
        require(isStageActive, "Stage is inactive");
        require(ddMine.isReady(stage_), "Stage not ready");
        _;
    }

    modifier isInactiveReadyStage(Stage stage_) {
        require(!isStageActive, "Stage is active");
        require(ddMine.isReady(stage_), "Stage not ready");
        _;
    }

    modifier costs(uint price) {
        require(msg.value == price, string.concat("Cost is: ", Strings.toString(price)));
        _;
    }

    modifier isShippedOwner(uint tokenId) {
        require(_ownerToShippedIds[_msgSender()].contains(tokenId), "No shipping");
        _;
    }

    modifier isOwner(uint tokenId) {
        require(_msgSender() == ERC721.ownerOf(tokenId), "Not owner");
        _;
    }

    modifier entranceLeft() {
        require(_tokenIdCounter <= MAX_MINE_ENTRANCE, "Max capacity.");
        _;
    }

    /**********************     External Functions     ************************/

    function enter(string calldata password) external payable costs(PRICE) isActiveReadyStage(Stage.INVITE) {
        //        require(balanceOf(_msgSender()) == 0, "1 token per wallet");
        //        bytes32 passwordHash = keccak256(abi.encodePacked(password));
        //        require(_invitations[passwordHash], "Not invited");
        //        delete _invitations[passwordHash];
        uint256 tokenId = ++_tokenIdCounter;
        // TODO: should _safeMint be before/after enter().
        ddMine.enter(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function mine(uint tokenId) external isOwner(tokenId) isActiveReadyStage(Stage.MINE) {
        ddMine.mine(tokenId);
    }

    function cut(uint tokenId) external isOwner(tokenId) isActiveReadyStage(Stage.CUT) {
        ddMine.cut(tokenId);
    }

    function polish(uint tokenId) external isOwner(tokenId) isActiveReadyStage(Stage.POLISH) {
        ddMine.polish(tokenId);
    }

    function ship(uint tokenId) external isOwner(tokenId) isActiveReadyStage(Stage.SHIP) {
        _burn(tokenId); // Disable NFT transfer while diamond is in transit.
        ddMine.ship(tokenId);
        _ownerToShippedIds[_msgSender()].add(tokenId);
    }

    function rebirth(uint tokenId) external isShippedOwner(tokenId) {
        // TODO: protect rebirth with a stupid password. e.g. (keccak256(tokenId)).
        _ownerToShippedIds[_msgSender()].remove(tokenId);
        ddMine.rebirth(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function allowEntrance(bytes32[] calldata hashes)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        isNotLocked
        entranceLeft
    {
        for (uint i = 0; i < hashes.length; i++) {
            _invites[hashes[i]] = true;
        }
    }

    function completeStage(Stage stage_) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        require(stage == stage_, "Wrong stage");
        isStageActive = false;
        emit StageChanged(stage);
    }

    function setStage(Stage stage_)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        isNotLocked
        isInactiveReadyStage(stage_)
    {
        stage = Stage(stage_);
        isStageActive = true;
        emit StageChanged(stage);
    }

    function lockDiamondDawn() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        isLocked = true;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _unpause();
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /**********************     Public Functions     ************************/

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return ddMine.getMetadata(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Royalty, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**********************     Internal Functions     ************************/

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }
}
