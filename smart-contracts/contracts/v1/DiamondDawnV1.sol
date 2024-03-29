// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Required for DefaultOperatorFilterer.
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import "./interface/IDiamondDawnV1.sol";
import "./interface/IDiamondDawnV1Admin.sol";
import "./interface/IDiamondDawnV1Mine.sol";

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
contract DiamondDawnV1 is
    ERC721,
    ERC721Burnable,
    ERC721Enumerable,
    ERC721Royalty,
    DefaultOperatorFilterer,
    AccessControl,
    Ownable,
    Pausable,
    IDiamondDawnV1,
    IDiamondDawnV1Admin
{
    using EnumerableSet for EnumerableSet.UintSet;
    using ECDSA for bytes32;

    uint256 public constant PRICE = 4.44 ether;
    uint256 public constant PRICE_MARRIAGE = 4.99 ether;
    uint8 public constant MAX_MINT = 2;
    uint16 public constant MAX_ENTRANCE = 333;

    bool public isLocked; // immutable
    bool public isActive;
    Stage public stage;
    IDiamondDawnV1Mine public ddMine;

    uint16 private _numTokens;
    mapping(address => EnumerableSet.UintSet) private _shipped;
    mapping(address => bool) private _minted;
    address private _signer;

    constructor(address mine_, address signer) ERC721("DiamondDawn", "DD") {
        ddMine = IDiamondDawnV1Mine(mine_);
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

    modifier isNotFull(uint256 quantity) {
        require((_numTokens + quantity) <= MAX_ENTRANCE, "Max capacity");
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

    modifier isDawnAllowed(uint256 tokenId) {
        require(stage == Stage.DAWN || stage == Stage.COMPLETED, "Wrong stage");
        require(_shipped[_msgSender()].contains(tokenId), "No shipment");
        require(ddMine.isReady(Stage.DAWN), "Dawn not ready");
        _;
    }

    modifier costs(uint256 price, uint256 quantity) {
        require(msg.value == (price * quantity), string.concat("Cost is: ", Strings.toString(price * quantity)));
        _;
    }

    modifier isOwner(uint256 tokenId) {
        require(_msgSender() == ERC721.ownerOf(tokenId), "Not owner");
        _;
    }

    /**********************     External Functions     ************************/

    function forge(bytes calldata signature, uint256 quantity) external payable costs(PRICE, quantity) {
        _forge(signature, quantity);
    }

    function forgeWithPartner(bytes calldata signature, uint256 quantity)
        external
        payable
        costs(PRICE_MARRIAGE, quantity)
    {
        _forge(signature, quantity);
    }

    function mine(uint256 tokenId) external isOwner(tokenId) isActiveStage(Stage.MINE) {
        ddMine.mine(tokenId);
    }

    function cut(uint256 tokenId) external isOwner(tokenId) isActiveStage(Stage.CUT) {
        ddMine.cut(tokenId);
    }

    function polish(uint256 tokenId) external isOwner(tokenId) isActiveStage(Stage.POLISH) {
        ddMine.polish(tokenId);
    }

    function ship(uint256 tokenId) external isOwner(tokenId) isActiveStage(Stage.DAWN) {
        _burn(tokenId);
        ddMine.ship(tokenId);
        _shipped[_msgSender()].add(tokenId);
    }

    function dawn(uint256 tokenId, bytes calldata signature) external isDawnAllowed(tokenId) {
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
        require(stage == Stage.COMPLETED, "Not Completed");
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

    function setApprovalForAll(address operator, bool approved)
        public
        override(ERC721, IERC721)
        onlyAllowedOperatorApproval(operator)
    {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId)
        public
        override(ERC721, IERC721)
        onlyAllowedOperatorApproval(operator)
    {
        super.approve(operator, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override(ERC721, IERC721) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }

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
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }

    /**********************     Private Functions     ************************/

    function _forge(bytes calldata signature, uint256 quantity) private isActiveStage(Stage.KEY) isNotFull(quantity) {
        require(_isValid(signature, bytes32(uint256(uint160(_msgSender())))), "Not allowed to mint");
        require(quantity <= MAX_MINT, "Exceeds max quantity");
        require(!_minted[_msgSender()], "Already minted");
        _minted[_msgSender()] = true;
        for (uint256 i = 0; i < quantity; i++) {
            _forgeOne();
        }
    }

    function _forgeOne() private {
        uint256 tokenId = ++_numTokens;
        ddMine.forge(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function _isValid(bytes calldata signature, bytes32 message) private view returns (bool) {
        return _signer == message.toEthSignedMessageHash().recover(signature);
    }
}
