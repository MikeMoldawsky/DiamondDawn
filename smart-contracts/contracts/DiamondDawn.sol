// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interface/IDiamondDawn.sol";
import "./interface/IDiamondDawnAdmin.sol";
import "./interface/IDiamondDawnMine.sol";

/**
 *    ________    .__                                           .___
 *    \______ \   |__| _____      _____     ____     ____     __| _/
 *     |    |  \  |  | \__  \    /     \   /  _ \   /    \   / __ |
 *     |    `   \ |  |  / __ \_ |  Y Y  \ (  <_> ) |   |  \ / /_/ |
 *    /_______  / |__| (____  / |__|_|  /  \____/  |___|  / \____ |
 *            \/            \/        \/                \/       \/
 *    ________
 *    \______ \   _____    __  _  __   ____
 *     |    |  \  \__  \   \ \/ \/ /  /    \
 *     |    `   \  / __ \_  \     /  |   |  \
 *    /_______  / (____  /   \/\_/   |___|  /
 *            \/       \/                 \/
 *
 * @title DiamondDawn
 * @author Mike Moldawsky (Tweezers)
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
    using EnumerableSet for EnumerableSet.UintSet;
    using ECDSA for bytes32;

    uint public constant PRICE = 0.002 ether; // TODO: change to 3.33eth
    uint public constant PRICE_WEDDING = 0.003 ether; // TODO: change to 3.66eth
    uint16 public constant MAX_ENTRANCE = 333;

    bool public isLocked; // immutable
    bool public isActive;
    Stage public stage;
    IDiamondDawnMine public ddMine;

    uint16 private _numTokens;
    mapping(address => EnumerableSet.UintSet) private _shipped;
    mapping(address => bool) private _minted;
    address private _signer; // TODO: set correct signer for production

    constructor(address mine_, address signer) ERC721("DiamondDawn", "DD") {
        ddMine = IDiamondDawnMine(mine_);
        _signer = signer;
        _setDefaultRoyalty(_msgSender(), 1000);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        ddMine.initialize(MAX_ENTRANCE);
    }

    /**********************          Modifiers          ************************/

    modifier isNotLocked() {
        require(!isLocked, "Locked forever");
        _;
    }

    modifier isNotFull() {
        require(_numTokens < MAX_ENTRANCE, "Max capacity");
        _;
    }

    modifier isActiveStage(Stage stage_) {
        require(stage == stage_, "Wrong stage");
        require(isActive, "Stage is inactive");
        require(ddMine.isReady(stage_), "Stage not ready");
        _;
    }

    modifier isReadyStage(Stage stage_) {
        require(!isActive, "Stage is active");
        require(ddMine.isReady(stage_), "Mine not ready");
        _;
    }

    modifier isDawnAllowed(uint tokenId) {
        require(stage == Stage.SHIP || stage == Stage.DAWN, "Wrong stage");
        require(_shipped[_msgSender()].contains(tokenId), "No shipment");
        require(ddMine.isReady(Stage.SHIP), "Ship not ready");
        _;
    }

    modifier costs(uint price) {
        require(msg.value == price, string.concat("Cost is: ", Strings.toString(price)));
        _;
    }

    modifier isOwner(uint tokenId) {
        require(_msgSender() == ERC721.ownerOf(tokenId), "Not owner");
        _;
    }

    /**********************     External Functions     ************************/

    function forge(bytes calldata signature) external payable costs(PRICE) {
        _forge(signature);
    }

    function forgeWithPartner(bytes calldata signature) external payable costs(PRICE_WEDDING) {
        // marriage
        _forge(signature);
    }

    function mine(uint tokenId) external isOwner(tokenId) isActiveStage(Stage.MINE) {
        ddMine.mine(tokenId);
    }

    function cut(uint tokenId) external isOwner(tokenId) isActiveStage(Stage.CUT) {
        ddMine.cut(tokenId);
    }

    function polish(uint tokenId) external isOwner(tokenId) isActiveStage(Stage.POLISH) {
        ddMine.polish(tokenId);
    }

    function ship(uint tokenId) external isOwner(tokenId) isActiveStage(Stage.SHIP) {
        _burn(tokenId);
        ddMine.ship(tokenId);
        _shipped[_msgSender()].add(tokenId);
    }

    function dawn(uint tokenId, bytes calldata signature) external isDawnAllowed(tokenId) {
        require(
            _isValid(signature, bytes32(abi.encodePacked(_msgSender(), uint96(tokenId)))),
            "Not allowed to rebirth"
        );
        _shipped[_msgSender()].remove(tokenId);
        ddMine.dawn(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function setStage(Stage stage_) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked isReadyStage(stage_) {
        stage = stage_;
        isActive = true;
        emit StageChanged(stage);
    }

    function completeStage(Stage stage_) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        require(stage == stage_, "Wrong stage");
        isActive = false;
    }

    function lockDiamondDawn() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        require(stage == Stage.DAWN, "Not Dawn stage");
        ddMine.lockMine();
        isLocked = true;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _unpause();
    }

    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        (bool success, ) = _msgSender().call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    /**********************     Public Functions     ************************/

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
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
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }

    /**********************     Private Functions     ************************/

    function _forge(bytes calldata signature) private isActiveStage(Stage.INVITE) isNotFull {
        require(_isValid(signature, bytes32(uint256(uint160(_msgSender())))), "Not allowed to mint");
        // TODO: uncomment before production
        // require(!_minted[_msgSender()], "Already minted");
        _minted[_msgSender()] = true;
        uint256 tokenId = ++_numTokens;
        ddMine.forge(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function _isValid(bytes calldata signature, bytes32 message) private view returns (bool) {
        return _signer == keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message)).recover(signature);
    }
}
