// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Required for DefaultOperatorFilterer.
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import "./interface/IDiamondDawnV2.sol";
import "./interface/IDiamondDawnAdminV2.sol";
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
    Pausable,
    IDiamondDawnV2,
    IDiamondDawnAdminV2
{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using ECDSA for bytes32;
    using Phases for Phases.Phase;
    using Phases for Phases.TokenMetadata;

    uint8 public constant MAX_MINT = 10;
    uint16 public constant MAX_TOKENS = 5555;

    bool public isLocked; // immutable
    bool public isActive;

    string private _currentPhase;
    uint16 private _numTokens;
    address private _signer;
    mapping(address => bool) private _minted;
    mapping(address => bool) private _mintedHonorary;
    mapping(string => Phases.Phase) private _phases;
    mapping(uint => Phases.TokenMetadata) private _metadata;

    constructor(address signer, address ddPhase) ERC721("DiamondDawn", "DD") {
        _signer = signer;
        _setDefaultRoyalty(_msgSender(), 1000);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _currentPhase = "reveal";
        _phases[_currentPhase].initialize(ddPhase, _currentPhase, MAX_TOKENS, 0, "");
    }

    /**********************          Modifiers          ************************/

    modifier isNotLocked() {
        require(!isLocked, "Locked forever");
        _;
    }

    modifier canMint(uint256 quantity) {
        require((_numTokens + quantity) <= MAX_TOKENS, "Max capacity");
        _;
    }

    modifier canEvolve(string memory name) {
        require(isActive, "Stage is inactive");
        require(
            msg.value == _phases[name].getPrice(),
            string.concat("Cost is: ", Strings.toString(_phases[name].getPrice()))
        );
        _;
    }

    modifier canEvolveMany(string memory name, uint quantity) {
        require(isActive, "Stage is inactive");
        require(
            msg.value == (_phases[name].getPrice() * quantity),
            string.concat("Cost is: ", Strings.toString(_phases[name].getPrice() * quantity))
        );
        _;
    }

    modifier isOwner(uint tokenId) {
        require(_msgSender() == ERC721.ownerOf(tokenId), "Not owner");
        _;
    }

    /**********************     External Functions     ************************/

    function mint(bytes calldata signature, uint256 quantity)
        external
        payable
        canMint(quantity)
        canEvolve(_currentPhase)
    {
        _mint(signature, quantity);
    }

    function mintHonorary(bytes calldata signature) external payable canMint(1) canEvolve(_currentPhase) {
        _mintHonorary(signature);
    }

    function safeEvolveCurrentPhase(uint tokenId)
        external
        payable
        isNotLocked
        isOwner(tokenId)
        canEvolve(_currentPhase)
    {
        require(isActive, "DD isn't active");
        _metadata[tokenId].evolve(_phases[_currentPhase], tokenId);
    }

    function safeOpenPhase() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        require(_phases[_currentPhase].exists(), "Phase doesn't exist exists");
        _phases[_currentPhase].open();
        isActive = true;
        emit PhaseOpen(_currentPhase);
    }

    function safeClosePhase() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        require(_phases[_currentPhase].exists(), "Phase doesn't exist exists");
        _phases[_currentPhase].close();
        isActive = false;
        emit PhaseClose(_currentPhase);
    }

    function safeSetNextPhase(
        address ddPhase,
        string memory name,
        uint16 maxSupply,
        uint price,
        string memory supportedPhase
    ) public onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        require(!isActive, "Current phase is open");
        require(!_phases[_currentPhase].isOpen(), "Current phase is open");
        require(!_phases[name].exists(), "Phase already exists");
        _phases[name].initialize(ddPhase, name, maxSupply, price, supportedPhase);
        require(_phases[name].supportsPhase(_currentPhase), "Next phase doesn't support previous");
        emit PhaseChange(_currentPhase, name);
        _currentPhase = name;
    }

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

    function setActive(bool boolean) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        isActive = boolean;
    }

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
        Phases.TokenMetadata memory tokenMetadata = _metadata[tokenId];
        return _phases[tokenMetadata.phaseName].getMetadata(tokenId, tokenMetadata);
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

    function _mintHonorary(bytes calldata signature) private {
        require(_isValid(signature, bytes32(uint256(uint160(_msgSender())))), "Not allowed to mint");
        require(!_mintedHonorary[_msgSender()], "Already minted");
        _mintedHonorary[_msgSender()] = true;
        _safeMint(_msgSender(), ++_numTokens);
        _metadata[_numTokens].attributes = 1; // honorary
        _metadata[_numTokens].evolve(_phases[_currentPhase], _numTokens);
    }

    function _mint(bytes calldata signature, uint256 quantity) private {
        require(_isValid(signature, bytes32(abi.encodePacked(_msgSender(), uint96(quantity)))), "Not allowed to mint");
        require(quantity <= MAX_MINT, "Exceeds max quantity");
        require(!_minted[_msgSender()], "Already minted");
        _minted[_msgSender()] = true;
        uint16 newNumTokens = _numTokens;
        for (uint i = 0; i < quantity; i++) {
            _safeMint(_msgSender(), ++newNumTokens);
            _metadata[newNumTokens].evolve(_phases[_currentPhase], newNumTokens);
        }
        _numTokens = newNumTokens;
    }

    function _isValid(bytes calldata signature, bytes32 message) private view returns (bool) {
        return _signer == message.toEthSignedMessageHash().recover(signature);
    }
}
