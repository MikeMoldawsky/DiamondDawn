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
import "./interface/IDiamondDawnMine.sol";
import "./interface/IDiamondDawn.sol";
import "./interface/IDiamondDawnAdmin.sol";

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

    Counters.Counter private _tokenIdCounter;
    IDiamondDawnMine private _diamondDawnMine;
    mapping(uint256 => address) private _burnedTokenToOwner;
    mapping(address => EnumerableSet.UintSet) private _ownerToBurnedTokens; // API

    Stage public stage; // API
    uint public constant MINING_PRICE = 0.002 ether; // API
    mapping(address => bool) public mintAllowedAddresses; // API

    /**********************          Modifiers          ************************/

    modifier allowedMiner() {
        require(
            mintAllowedAddresses[_msgSender()],
            "The miner is not allowed to mint tokens"
        );
        _;
    }

    modifier onlyStage(Stage _stage) {
        require(
            stage == _stage,
            string.concat(
                "The stage should be ",
                Strings.toString(uint(_stage)),
                " to perform this action"
            )
        );
        _;
    }

    modifier whenRebirthIsActive() {
        require(
            (stage == Stage.BURN) || stage == Stage.REBIRTH,
            "A stage should be active to perform this action"
        );
        _;
    }

    modifier _requireAssignedMineContract() {
        require(
            address(_diamondDawnMine) != address(0),
            "DiamondDawn: DiamondDawnMine contract is not set"
        );
        _;
    }

    /**********************          Constructor          ************************/

    constructor(
        uint96 _royaltyFeesInBips,
        address _diamondDawnMineContract,
        address[] memory adminAddresses
    ) ERC721("DiamondDawn", "DD") {
        // TODO: remove allow-list + admin from production and use grant role
        _setAdminAndAddToAllowList(adminAddresses);
        //        mintAllowedAddresses[_msgSender()] = true;
        // Production starts from here
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        stage = Stage.MINE;
        setRoyaltyInfo(_msgSender(), _royaltyFeesInBips);
        _diamondDawnMine = IDiamondDawnMine(_diamondDawnMineContract);
        _pause();
        _tokenIdCounter.increment();
    }

    /**********************     Diamond Dawn Mine Functions     ************************/

    function mine()
        external
        payable
        onlyStage(Stage.MINE)
        allowedMiner
        _requireAssignedMineContract
    {
        _requireValidPayment(msg.value);
        // Restrict another mint by the same miner
        delete mintAllowedAddresses[_msgSender()];

        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_msgSender(), tokenId);
        _diamondDawnMine.mine(tokenId);

        address[] memory wlAddresses = new address[](1);
        wlAddresses[0] = _msgSender();
        emit WhitelistUpdated(WhitelistAction.USE, wlAddresses);
        emit TokenProcessed(tokenId, Stage.MINE);
    }

    function cut(uint256 tokenId) external onlyStage(Stage.CUT) {
        _diamondDawnMine.cut(tokenId);
        emit TokenProcessed(tokenId, Stage.CUT);
    }

    function polish(uint256 tokenId) external onlyStage(Stage.POLISH) {
        _diamondDawnMine.polish(tokenId);
        emit TokenProcessed(tokenId, Stage.POLISH);
    }

    function burnAndShip(uint256 tokenId) external onlyStage(Stage.BURN) {
        super.burn(tokenId);
        _diamondDawnMine.burn(tokenId);
        _burnedTokenToOwner[tokenId] = _msgSender();
        _ownerToBurnedTokens[_msgSender()].add(tokenId);
        emit TokenProcessed(tokenId, Stage.BURN);
    }

    function rebirth(uint256 tokenId) external whenRebirthIsActive {
        address burner = _burnedTokenToOwner[tokenId];
        require(
            _msgSender() == burner,
            string.concat(
                "Rebirth failed - only burner is allowed to perform rebirth"
            )
        );
        delete _burnedTokenToOwner[tokenId];
        _ownerToBurnedTokens[_msgSender()].remove(tokenId);
        _diamondDawnMine.rebirth(tokenId);
        _safeMint(_msgSender(), tokenId);
        emit TokenProcessed(tokenId, Stage.REBIRTH);
    }

    function getBurnedTokens(address owner)
        external
        view
        returns (uint[] memory)
    {
        return _ownerToBurnedTokens[owner].values();
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

    /*************** Functions *****************************/

    function tokenURI(uint256 tokenId)
        public
        view
        override
        _requireAssignedMineContract
        returns (string memory)
    {
        // TODO - this require blocks getting the tokenURI of burnt tokens
        // require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        return _diamondDawnMine.getDiamondMetadata(tokenId);
    }

    /**********************     Others     ************************/
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl, ERC2981)
        returns (bool)
    {
        // EIP2981 supported for royalties
        return super.supportsInterface(interfaceId);
    }

    /**************************************************************************
     *                                                                        *
     *                       Administrator functions                          *
     *                                                                        *
     **************************************************************************/

    /**********************     Internal & Helpers     ************************/

    // TODO: Add withdraw funds method

    /**********************        Transactions        ************************/

    /**
     * @notice Sets the royalty percentage and the royalties reciever address.
     *
     * @dev This function is only available to the admin role.
     * @dev Using inherited ERC2981 functionality.
     *
     * @param _receiver an address of the receiver of the royalties.
     * @param _royaltyFeesInBips the numerator of the percentage of the royalties where denominator is 10000.
     */
    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(_receiver, _royaltyFeesInBips);
    }

    /**
     * @notice Sets the contract into a paused mode.
     *
     * @dev This function is only available to the admin role.
     * @dev No transactions other than admin API can be executed while the contract is in the paused mode.
     */
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Sets the contract into an unpaused mode.
     *
     * @dev This function is only available to the admin role.
     */
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Adding a list of addresses to the list of allowed addresses to mint tokens.
     *
     * @dev This function is only available to the admin role.
     *
     * @param addresses a list of addresses to be added to the list of allowed addresses.
     */
    function addToAllowList(address[] memory addresses)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < addresses.length; i++) {
            mintAllowedAddresses[addresses[i]] = true;
        }

        emit WhitelistUpdated(WhitelistAction.ADD, addresses);
    }

    /**
     * @notice Removing a list of addresses from the list of allowed addresses to mint tokens.
     *
     * @dev This function is only available to the admin role.
     *
     * @param addresses a list of addresses to be removed from the list of allowed addresses.
     */
    function removeFromAllowList(address[] memory addresses)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint i = 0; i < addresses.length; i++) {
            delete mintAllowedAddresses[addresses[i]];
        }

        emit WhitelistUpdated(WhitelistAction.REMOVE, addresses);
    }

    /**
     * @notice Making a function to set Address for Diamond Metadata Contract.
     *
     * @dev This function is only available to the admin role.
     *
     * @param _diamondDawnMineContract a address of diamond metadata contract.
     */
    function setDiamondDawnMine(address _diamondDawnMineContract)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            address(_diamondDawnMineContract) != address(0),
            "DiamondDawn: Address zero passed as DiamondDawnMetadata Contract"
        );
        _diamondDawnMine = IDiamondDawnMine(_diamondDawnMineContract);
    }

    /***********  TODO: Remove before production - Dev Tooling  **************/

    function completeCurrentStageAndRevealNextStage()
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        assert(uint(stage) < uint(type(Stage).max));
        stage = Stage(uint(stage) + 1);
        emit StageChanged(stage);
    }

    function _setAdminAndAddToAllowList(address[] memory addresses) internal {
        for (uint i = 0; i < addresses.length; i++) {
            mintAllowedAddresses[addresses[i]] = true;
            _grantRole(DEFAULT_ADMIN_ROLE, addresses[i]);
        }

        emit WhitelistUpdated(WhitelistAction.ADD, addresses);
    }

    /**************************************************************************
     *                                                                        *
     *                             Client functions                           *
     *                                                                        *
     **************************************************************************/
    /**********************           Guards            ************************/

    function _requireValidPayment(uint value) internal pure {
        require(
            value == MINING_PRICE,
            string.concat(
                "Wrong payment - payment should be: ",
                Strings.toString(MINING_PRICE)
            )
        );
    }
}
