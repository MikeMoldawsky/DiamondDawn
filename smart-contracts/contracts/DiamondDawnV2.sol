// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Required for DefaultOperatorFilterer.
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import "./interface/IDiamondDawn.sol";
import "./interface/IDiamondDawnAdmin.sol";
import "./interface/IDiamondDawnMine.sol";
import "./utils/Phases.sol";

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
contract DiamondDawnV2 is
    ERC721,
    ERC721Enumerable,
    ERC721Royalty,
    DefaultOperatorFilterer,
    AccessControl,
    Ownable,
    Pausable
{
    using EnumerableSet for EnumerableSet.AddressSet;
    using Phases for Phases.Phase;
    using ECDSA for bytes32;
    using Counters for Counters.Counter;

    uint8 public constant PRICE = 0;
    uint8 public constant MAX_MINT = 10;
    uint16 public constant MAX_ENTRANCE = 5555;

    bool public isLocked; // immutable
    bool public isActive;

    uint16 private _numTokens;
    address private _signer;
    string private _currentPhase;
    mapping(address => bool) private _minted;
    mapping(address => bool) private _mintedHonorary;
    mapping(string => Phases.Phase) private _phases;
    mapping(uint => Phases.TokenMetadata) private _metadata;

    constructor(address signer, address ddPhase) ERC721("DiamondDawn", "DD") {
        _signer = signer;
        _setDefaultRoyalty(_msgSender(), 1000);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _currentPhase = "reveal";
        _phases[_currentPhase].initialize(ddPhase, _currentPhase, MAX_ENTRANCE, 0, "");
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

    modifier canEvolve(string memory name) {
        require(isActive, "Stage is inactive");
        require(_phases[name].isPrice(msg.value), string.concat("Cost is: ", Strings.toString(_phases[name].getPrice())));
        _;
    }


    modifier costs(uint price, uint quantity) {
        require(msg.value == (price * quantity), string.concat("Cost is: ", Strings.toString(price * quantity)));
        _;
    }

    modifier isOwner(uint tokenId) {
        require(_msgSender() == ERC721.ownerOf(tokenId), "Not owner");
        _;
    }

    /**********************     External Functions     ************************/


    function mint(bytes calldata signature, uint256 quantity) external payable isNotFull(quantity) costs(PRICE, quantity) {
        _mint(signature, quantity);
    }

    function mintHonorary(bytes calldata signature) external payable isNotFull(1) costs(PRICE, 1) {
        _mintHonorary(signature);
    }

    function safeEvolveCurrentPhase(uint tokenId) external payable isNotLocked isOwner(tokenId) canEvolve(_currentPhase) {
        // TODO: add costs etc
        // TODO: increase supply;
        _phases[_currentPhase].evolve(_numTokens, _metadata[_numTokens]);
    }
//
//    function safeAddCurrentPhase(address ddPhase, uint maxSupply, uint price) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked isValidNextPhase(ddPhase) {
//        require(!currentPhase.ddPhase.isOpen(), "current phase is open");
////        currentPhase = addPhase(ddPhase, maxSupply, price);
//    }
//
    function safeOpenCurrentPhase() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _phases[_currentPhase].open();
    }
//
//    function safeCloseCurrentPhase() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
//        closePhase(currentPhase.ddPhase.getName());
//    }
//
//    function evolve(uint tokenId, string name) public isOwner(tokenId) {
////        ddMine.mine(tokenId);
//    }
//
//    function closePhase(string name) public onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
////        Phase memory phase = phases[name];
////        require(phases, "Phase doesn't exist");
////        phase.ddPhase.close();
//    }
//
    function openPhase(string memory name) public onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _phases[name].open(); // TODO: check if it is ok to do it in one call
    }
//
//    function safeAddPhase(address ddPhase, uint maxSupply, uint price) public onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
//        string name = ddPhase.getName();
//        require(!phases[name], "Phase already exists");
//        return _setPhase(name, ddPhase, maxSupply, price);
//    }
//
//
//    function safeReplacePhase(string name, address ddPhase_, uint maxSupply, uint price) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
//        require(!phases[name], "Phase doesn't exist");
//        IDiamondDawnPhase memory ddPhase = IDiamondDawnPhase(ddPhase_);
//        require(ddPhase.getName() == name, "Wrong name");
////        Phase memory oldPhase = phases[name];
////        require(!oldPhase.ddPhase.open(), "Phase is open");
////        require(phasesAddress.remove(address(oldPhase.ddPhase)), "phase not in address map");
////        return _setPhase(name, ddPhase_, maxSupply, price);
//    }
//
//
//    function _setPhase(string name, address ddPhase, uint maxSupply, uint price) public onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
////        Phase memory phase = Phase({ddPhase: IDiamondDawnPhase(ddPhase), maxSupply: maxSupply, price: price});
////        phases[name] = phase;
////        phasesAddress.add(ddPhase);
////        return phase;
//    }



    function lockDiamondDawn() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        // TODO: iterate over diamond dawn and lock all phases.
//        require(stage == Stage.COMPLETED, "Not Completed");
//        ddMine.lockMine();
//        isLocked = true;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _unpause();
    }

//    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external onlyRole(DEFAULT_ADMIN_ROLE) {
//        _setDefaultRoyalty(receiver, feeNumerator);
//    }

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
        return _phases[_currentPhase].getMetadata(tokenId, _metadata[tokenId]);
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


    function _mintHonorary(bytes calldata signature) private  isNotFull(1) {
        require(_isValid(signature, bytes32(uint256(uint160(_msgSender())))), "Not allowed to mint");
        require(!_mintedHonorary[_msgSender()], "Already minted");
        _mintedHonorary[_msgSender()] = true;
        _safeMint(_msgSender(), ++_numTokens);
        _phases[_currentPhase].evolve(_numTokens, _metadata[_numTokens]);
    }

    function _mint(bytes calldata signature, uint256 quantity) private  isNotFull(quantity) {
        require(
            _isValid(signature, bytes32(abi.encodePacked(_msgSender(), uint96(quantity)))),
            "Not allowed to mint"
        );

        require(quantity <= MAX_MINT, "Exceeds max quantity");
        require(!_minted[_msgSender()], "Already minted");
        _minted[_msgSender()] = true;
        uint16 newNumTokens = _numTokens;
        for (uint i = 0; i < quantity; i++) {
            _safeMint(_msgSender(), ++newNumTokens);
            _metadata[newNumTokens]._phaseName = "reveal";
        }
        _numTokens = newNumTokens;
    }

    function _isValid(bytes calldata signature, bytes32 message) private view returns (bool) {
        return _signer == message.toEthSignedMessageHash().recover(signature);
    }
}
