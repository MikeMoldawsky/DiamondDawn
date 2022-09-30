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
 * @title DiamondDawn NFT Contract
 * @author Mike Moldawsky aka Tweezers
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
    //    uint16 public constant MAX_ENTRANCE = 333;
    uint16 public MAX_ENTRANCE; // TODO: change to constant once the script is ready

    bool public isLocked; // locked forever (immutable).
    bool public isActive;
    Stage public stage;
    IDiamondDawnMine public ddMine;

    uint16 private _numTokens;
    mapping(address => EnumerableSet.UintSet) private _shipped;
    mapping(address => bool) private _minted;

    address private _signer;

    constructor(
        address mine_,
        uint16 maxEntrance_,
        address signer_
    ) ERC721("DiamondDawn", "DD") {
        _signer = signer_;
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setDefaultRoyalty(_msgSender(), 1000);
        ddMine = IDiamondDawnMine(mine_);
        MAX_ENTRANCE = maxEntrance_; // TODO: remove maxEntrance_ once staging is deploying 333 automatically.
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

    function enter(bytes calldata signature) external payable costs(PRICE) {
        _enter(signature);
    }

    function enterWedding(bytes calldata signature) external payable costs(PRICE_WEDDING) {
        _enter(signature);
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

    function rebirth(uint tokenId) external isDawnAllowed(tokenId) {
        // TODO: protect rebirth with a signature.
        _shipped[_msgSender()].remove(tokenId);
        ddMine.rebirth(tokenId);
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

    function _isValid(bytes calldata signature) private view returns (bool) {
        return
            _signer ==
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", bytes32(uint256(uint160(_msgSender()))))
            ).recover(signature);
    }

    function _enter(bytes calldata signature) private isActiveStage(Stage.INVITE) isNotFull {
        require(_isValid(signature), "Not allowed to mint");
        // TODO: uncomment before production
        // require(!_minted[_msgSender()], "Already minted");
        _minted[_msgSender()] = true;
        uint256 tokenId = ++_numTokens;
        ddMine.enter(tokenId);
        _safeMint(_msgSender(), tokenId);
    }
}
