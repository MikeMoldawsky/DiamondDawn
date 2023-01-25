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
import "./interface/IDiamondDawnV2Admin.sol";
import "./utils/Phases.sol";
import "./objects/Mint.sol";

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
    IDiamondDawnV2Admin
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

    mapping(address => bool) private _minted;
    mapping(address => bool) private _mintedHonorary;
    mapping(string => Phases.Phase) private _phases;
    mapping(uint => Phases.TokenMetadata) private _metadata;
    address private _signer;
    uint16 private _tokenId;
    string private _mintPhaseName;
    string private _currPhaseName;

    constructor(address signer, address mintPhase) ERC721("DiamondDawn", "DD") {
        _signer = signer;
        _setDefaultRoyalty(_msgSender(), 1000);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _mintPhaseName = _safeSetCurrentPhase(mintPhase, MAX_TOKENS, 0);
    }

    /**********************          Modifiers          ************************/

    modifier isNotLocked() {
        require(!isLocked, "Locked forever");
        _;
    }

    modifier canMint(
        uint256 quantity,
        bytes calldata signature,
        bytes32 message
    ) {
        require((_tokenId + quantity) <= MAX_TOKENS, "Max capacity");
        require(quantity <= MAX_MINT, "Exceeds max quantity");
        require(_isValid(signature, message), "Not allowed to mint");
        _;
    }

    modifier canEvolve(string memory name) {
        require(isActive, "Phase is inactive");
        require(
            msg.value == _phases[name].getPrice(),
            string.concat("Cost is: ", Strings.toString(_phases[name].getPrice()))
        );
        require(_phases[name].isOpen(), "Phase is closed");
        _;
    }

    modifier isOwner(uint tokenId) {
        require(_msgSender() == ERC721.ownerOf(tokenId), "Not owner");
        _;
    }

    /**********************     External Functions     ************************/

    function mint(
        bytes calldata signature,
        uint256 quantity
    )
        external
        payable
        canMint(quantity, signature, bytes32(abi.encodePacked(_msgSender(), uint96(quantity))))
        canEvolve(_mintPhaseName)
    {
        _mint(quantity);
    }

    function mintHonorary(
        bytes calldata signature
    ) external payable canMint(1, signature, bytes32(uint256(uint160(_msgSender())))) canEvolve(_mintPhaseName) {
        _mintHonorary();
    }

    function safeEvolveCurrentPhase(
        uint tokenId
    ) external payable isNotLocked isOwner(tokenId) canEvolve(_currPhaseName) {
        _metadata[tokenId].evolve(_phases[_currPhaseName], tokenId);
    }

    function safeOpenPhase() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        isActive = true;
        _openPhase(_currPhaseName);
    }

    function safeClosePhase() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        isActive = false;
        _closePhase(_currPhaseName);
    }

    function safeSetNextPhase(
        address ddPhase,
        uint16 maxSupply,
        uint price
    ) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _safeSetCurrentPhase(ddPhase, maxSupply, price);
    }

    function closePhase(string memory name) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _closePhase(name);
    }

    function openPhase(string memory name) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        _openPhase(name);
    }

    function _closePhase(string memory name) internal {
        require(_phases[name].isConfigured(), "Phase doesn't exist");
        _phases[name].close();
        emit Phase(name, _phases[name].getPhaseAddress(), PhaseAction.Close);
    }

    function _openPhase(string memory name) internal {
        require(_phases[name].isConfigured(), "Phase doesn't exist");
        _phases[name].open();
        emit Phase(name, _phases[name].getPhaseAddress(), PhaseAction.Open);
    }

    function _safeSetCurrentPhase(address ddPhase, uint16 maxSupply, uint price) internal returns (string memory) {
        require(!isActive, "Diamond Dawn is active");
        require(!_phases[_currPhaseName].isOpen(), "Current phase is open");
        Phases.Phase memory nextPhase = _addPhase(ddPhase, maxSupply, price);
        require(nextPhase.canEvolveFrom(_phases[_currPhaseName]), "Next phase should support current");
        _currPhaseName = nextPhase.getName();
        return _currPhaseName;
    }

    function _addPhase(address ddPhase, uint16 maxSupply, uint price) internal returns (Phases.Phase memory) {
        Phases.Phase memory phase = Phases.toPhase(ddPhase, maxSupply, price);
        string memory name = phase.getName();
        require(!_phases[name].isConfigured(), "Phase already exist");
        phase.initialize();
        _phases[name] = phase;
        emit Phase(name, phase.getPhaseAddress(), PhaseAction.Add);
        return phase;
    }

    //        function replacePhase(string name, address ddPhase_, uint maxSupply, uint price) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
    //            require(phases[name].exists(), "Phase doesn't exist");
    //            IDiamondDawnPhase memory ddPhase = IDiamondDawnPhase(ddPhase_);
    //            require(ddPhase.getName() == name, "Wrong name");
    //        Phase memory oldPhase = phases[name];
    //        require(!oldPhase.ddPhase.open(), "Phase is open");
    //        require(phasesAddress.remove(address(oldPhase.ddPhase)), "phase not in address map");
    //        return _setPhase(name, ddPhase_, maxSupply, price);
    //        }

    function setActive(bool boolean) external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
        isActive = boolean;
    }

    function lock() external onlyRole(DEFAULT_ADMIN_ROLE) isNotLocked {
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

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override(ERC721, IERC721) onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function approve(
        address operator,
        uint256 tokenId
    ) public override(ERC721, IERC721) onlyAllowedOperatorApproval(operator) {
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
        return tokenMetadata.getMetadata(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, ERC721Royalty, AccessControl) returns (bool) {
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

    function _mintHonorary() private {
        require(!_mintedHonorary[_msgSender()], "Already minted");
        _mintedHonorary[_msgSender()] = true;
        uint16 tokenId = ++_tokenId;
        _safeMint(_msgSender(), tokenId);
        _evolveMint(tokenId, true);
    }

    function _mint(uint256 quantity) private {
        require(!_minted[_msgSender()], "Already minted");
        _minted[_msgSender()] = true;
        uint16 tokenId = _tokenId;
        for (uint i = 0; i < quantity; i++) {
            _safeMint(_msgSender(), ++tokenId);
            _evolveMint(tokenId, false);
        }
        _tokenId = tokenId;
    }

    function _evolveMint(uint16 tokenId, bool isHonorary) private {
        Phases.TokenMetadata storage tokenMetadata = _metadata[tokenId];
        tokenMetadata.attributes = abi.encode(MintAttributes({honorary: isHonorary})); // set metadata base condition
        tokenMetadata.evolve(_phases[_mintPhaseName], tokenId);
    }

    function _isValid(bytes calldata signature, bytes32 message) private view returns (bool) {
        return _signer == message.toEthSignedMessageHash().recover(signature);
    }
}
