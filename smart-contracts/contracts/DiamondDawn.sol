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
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
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
    mapping(address => EnumerableSet.UintSet) private _ownerToShippedIds;

    address public signer;

    constructor(
        address mine_,
        uint16 maxEntrance_,
        address signer_
    ) ERC721("DiamondDawn", "DD") {
        signer = signer_;
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setDefaultRoyalty(_msgSender(), 1000); // 10 %
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
        _burn(tokenId); // Disable NFT transfer while diamond is in transit.
        ddMine.ship(tokenId);
        _ownerToShippedIds[_msgSender()].add(tokenId);
    }

    function rebirth(uint tokenId) external isShippedOwner(tokenId) {
        // TODO: protect rebirth with a stupid password. e.g. (keccak256(tokenId)) or a signature.
        _ownerToShippedIds[_msgSender()].remove(tokenId);
        ddMine.rebirth(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function completeStage(Stage stage_) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        require(stage == stage_, "Wrong stage");
        isActive = false;
        emit StageChanged(stage);
    }

    function setStage(Stage stage_) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked isReadyStage(stage_) {
        stage = stage_;
        isActive = true;
        emit StageChanged(stage);
    }

    function lockDiamondDawn() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        ddMine.lockMine();
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

    /**********************     Private Functions     ************************/

    function _recoverSigner(bytes calldata signature) private view returns (bool) {
        return
            signer ==
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", bytes32(uint256(uint160(msg.sender))))
            ).recover(signature);
    }

    function _enter(bytes calldata signature) private isActiveStage(Stage.INVITE) isNotFull {
        require(_recoverSigner(signature), "Address not allowed to mint");

        uint256 tokenId = ++_numTokens;
        ddMine.enter(tokenId);
        _safeMint(_msgSender(), tokenId);
    }
}
