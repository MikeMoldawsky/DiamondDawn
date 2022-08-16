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
import "./interface/IDiamondDawn.sol";
import "./interface/IDiamondDawnAdmin.sol";
import "./interface/IDiamondDawnMine.sol";

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

    bool public isDiamondDawnLocked = false; // diamond dawn is locked forever when the project ends (immutable).
    uint public constant MAX_MINE_ENTRANCE = 333;
    uint public constant MINING_PRICE = 0.002 ether;
    IDiamondDawnMine public diamondDawnMine;
    SystemStage public systemStage;

    mapping(address => EnumerableSet.UintSet) private _ownerToShippingTokenIds;
    mapping(uint256 => address) private _shippedTokenIdToOwner;
    mapping(bytes32 => bool) private _invitations;
    Counters.Counter private _tokenIdCounter;

    constructor(
        uint96 _royaltyFeesInBips,
        address _diamondDawnMineContract,
        address[] memory adminAddresses
    ) ERC721("DiamondDawn", "DD") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        systemStage = SystemStage.INVITATIONS;
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

    modifier diamondDawnNotLocked() {
        require(!isDiamondDawnLocked, "Diamond Dawn is locked forever");
        _;
    }

    modifier onlySystemStage(SystemStage _stage) {
        require(
            systemStage == _stage,
            string.concat(
                "The stage should be ",
                Strings.toString(uint(_stage)),
                " to perform this action"
            )
        );
        _;
    }

    modifier isDiamondDawnMineReady(SystemStage systemStage_) {
        if (systemStage_ == SystemStage.INVITATIONS) {
            require(
                diamondDawnMine.isMineEntranceReady(),
                "DiamondDawnMine entrance isn't ready"
            );
        } else if (systemStage_ == SystemStage.MINE_OPEN) {
            require(
                diamondDawnMine.isMineReady(),
                "DiamondDawnMine mine isn't ready"
            );
        } else if (systemStage_ == SystemStage.CUT_OPEN) {
            require(
                diamondDawnMine.isCutReady(),
                "DiamondDawnMine cut isn't ready"
            );
        } else if (systemStage_ == SystemStage.POLISH_OPEN) {
            require(
                diamondDawnMine.isPolishReady(),
                "DiamondDawnMine polish isn't ready"
            );
        } else if (systemStage_ == SystemStage.SHIP) {
            require(
                diamondDawnMine.isShipReady(),
                "DiamondDawnMine burn isn't ready"
            );
        }
        _;
    }

    modifier validSystemStage(uint _systemStage) {
        require(_systemStage >= uint(type(SystemStage).min));
        require(_systemStage <= uint(type(SystemStage).max));
        _;
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

    modifier mineEntranceLeft() {
        require(
            _tokenIdCounter.current() <= MAX_MINE_ENTRANCE,
            "Diamond Dawn's mine is at max capacity."
        );
        _;
    }

    modifier useInvite(bytes32 password) {
        bytes32 passwordHash = keccak256(abi.encodePacked(password));
        require(
            _invitations[passwordHash],
            "You can't enter the mine, you're not invited"
        );
        delete _invitations[passwordHash];
        _;
    }

    /**********************     External Functions     ************************/
    function allowMineEntrance(bytes32[] calldata passwordsHash)
        external
        diamondDawnNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
        onlySystemStage(SystemStage.INVITATIONS)
    {
        for (uint i = 0; i < passwordsHash.length; i++) {
            _invitations[passwordsHash[i]] = true;
        }
    }

    function enterMine(bytes32 password)
        external
        payable
        assignedDiamondDawnMine
        onlySystemStage(SystemStage.INVITATIONS)
        isDiamondDawnMineReady(SystemStage.INVITATIONS)
        costs(MINING_PRICE)
    //        useInvite(password)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_msgSender(), tokenId);
        diamondDawnMine.enterMine(tokenId);
        emit EnterMine(tokenId);
    }

    function mine(uint tokenId)
        external
        assignedDiamondDawnMine
        onlySystemStage(SystemStage.MINE_OPEN)
        isDiamondDawnMineReady(SystemStage.MINE_OPEN)
    {
        diamondDawnMine.mine(tokenId);
        emit Mine(tokenId);
    }

    function cut(uint256 tokenId)
        external
        assignedDiamondDawnMine
        onlySystemStage(SystemStage.CUT_OPEN)
        isDiamondDawnMineReady(SystemStage.CUT_OPEN)
    {
        diamondDawnMine.cut(tokenId);
        emit Cut(tokenId);
    }

    function polish(uint256 tokenId)
        external
        assignedDiamondDawnMine
        onlySystemStage(SystemStage.POLISH_OPEN)
        isDiamondDawnMineReady(SystemStage.POLISH_OPEN)
    {
        diamondDawnMine.polish(tokenId);
        emit Polish(tokenId);
    }

    function ship(uint256 tokenId)
        external
        assignedDiamondDawnMine
        onlySystemStage(SystemStage.SHIP)
        isDiamondDawnMineReady(SystemStage.SHIP)
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
        isDiamondDawnMineReady(SystemStage.SHIP)
        onlyShippedDiamondOwner(tokenId)
    {
        delete _shippedTokenIdToOwner[tokenId];
        _ownerToShippingTokenIds[_msgSender()].remove(tokenId);
        diamondDawnMine.rebirth(tokenId);
        _safeMint(_msgSender(), tokenId);
        emit Rebirth(tokenId);
    }

    function setDiamondDawnMine(address diamondDawnMine_)
        external
        diamondDawnNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        diamondDawnMine = IDiamondDawnMine(diamondDawnMine_);
    }

    function lockDiamondDawn()
        external
        diamondDawnNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _diamondDawnMineContract.lockMine();
        isDiamondDawnLocked = true;
    }

    function setSystemStage(uint systemStage_)
        external
        diamondDawnNotLocked
        validSystemStage(systemStage_)
        isDiamondDawnMineReady(SystemStage(systemStage_))
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // TODO: Mine Open should be open when we had 333 diamonds at the beginning
        systemStage = SystemStage(systemStage_);
        emit SystemStageChanged(systemStage);
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

    function pause() public diamondDawnNotLocked onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause()
        public
        diamondDawnNotLocked
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
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
