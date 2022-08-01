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
import "./types/Stage.sol";

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
    ERC721Enumerable
{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    struct Metadata {
        Stage stage;
    }

    event StageChanged(Stage stage, bool isStageActive);

    enum WhitelistAction {
        ADD,
        REMOVE,
        USE
    }

    event WhitelistUpdated(WhitelistAction action, address[] addresses);

    Counters.Counter private _tokenIdCounter;
    Stage private constant MAX_STAGE = Stage.REBIRTH;
    Stage public stage;
    IDiamondDawnMine private _diamondDawnMine;
    uint public constant MINING_PRICE = 0.002 ether;
    bool public isStageActive;
    mapping(address => bool) public mintAllowedAddresses;
    mapping(uint256 => Metadata) private _tokensMetadata;
    mapping(uint256 => address) private _burnedTokenToOwner;
    mapping(address => EnumerableSet.UintSet) private _ownerToBurnedTokens;

    /**************************************************************************
     *                                                                        *
     *                               General                                  *
     *                                                                        *
     **************************************************************************/

    constructor(uint96 _royaltyFeesInBips, address _diamondDawnMineContract, address[] memory adminAddresses) ERC721("DiamondDawn", "DD") {
        // TODO: remove allow-list + admin from production and use grant role
        _setAdminAndAddToAllowList(adminAddresses);
//        mintAllowedAddresses[_msgSender()] = true;
        // Production starts from here
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        stage = Stage.MINE;
        isStageActive = false;
        setRoyaltyInfo(_msgSender(), _royaltyFeesInBips);
        _diamondDawnMine = IDiamondDawnMine(_diamondDawnMineContract);
        _pause();
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) 
        whenNotPaused 
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId) public view
        override(ERC721, ERC721Enumerable, AccessControl, ERC2981)
        returns (bool)
    {
        // EIP2981 supported for royalties
        return super.supportsInterface(interfaceId);
    }

    /** 
    * @notice Returns the next stage enum value given a stage enum value.
    *
    * @dev throws an error if the next stage is out of bounds (greater than MAX_STAGE).
    *
    * @param _stage a Stage enum value.
    *
    * @return Stage Stage enum value containing the next stage of _stage param.
    */
    function _getNextStage(Stage _stage) internal pure returns (Stage) {
        require(
            uint(_stage) < uint(MAX_STAGE),
            string.concat(
                "The stage should be less than ",
                Strings.toString(uint(MAX_STAGE))
            )
        );

        return Stage(uint(_stage) + 1);
    }

    /**************************************************************************
     *                                                                        *
     *                       Administrator functions                          *
     *                                                                        *
     **************************************************************************/

    /**********************     Internal & Helpers     ************************/

    /** 
    * @notice Sets the flow in an active stage mode.
    *
    * @dev This function is only available to the admin role.
    */
    function _activateStage() internal
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        isStageActive = true;
    }

    /** 
    * @notice Sets the flow in an inactive stage mode.
    *
    * @dev This function is only available to the admin role.
    */
    function _deactivateStage() internal 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        isStageActive = false;
    }

    /** 
    * @notice Sets the flow stage to the next stage of the currenly assigned stage.
    *
    * @dev This function is only available to the admin role.
    */
    function _nextStage() internal 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        stage = _getNextStage(stage);
    }

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
    function setRoyaltyInfo(address _receiver, uint96 _royaltyFeesInBips) public
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
    function pause() public
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _pause();
    }

    /** 
    * @notice Sets the contract into an unpaused mode.
    *
    * @dev This function is only available to the admin role.
    */
    function unpause() public 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _unpause();
    }

    /** 
    * @notice Activating the currently assigned stage and setting its video URL.
    *
    * @dev This function is only available to the admin role.
    * @dev Emitting StageChanged event triggering frontend to update the UI.
    *
    */
    function revealStage() public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _activateStage();

        emit StageChanged(stage, isStageActive);
    }

    /** 
    * @notice Completing the current stage by setting the next stage as the current stage in an inactive mode.
    *
    * @dev This function is only available to the admin role.
    * @dev Emitting StageChanged event triggering frontend to update the UI.
    */
    function completeCurrentStage() public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _deactivateStage();
        _nextStage();

        emit StageChanged(stage, isStageActive);
    }

    /** 
    * @notice Adding a list of addresses to the list of allowed addresses to mint tokens.
    *
    * @dev This function is only available to the admin role.
    *
    * @param addresses a list of addresses to be added to the list of allowed addresses.
    */
    function addToAllowList(address[] memory addresses) public
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
    function removeFromAllowList(address[] memory addresses) public
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
    function setDiamondDawnMine(address _diamondDawnMineContract) public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(address(_diamondDawnMineContract) != address(0),"DiamondDawn: Address zero passed as DiamondDawnMetadata Contract");
        _diamondDawnMine = IDiamondDawnMine(_diamondDawnMineContract);
    }


    /***********  TODO: Remove before production - Dev Tooling  **************/

    function dev__ResetStage() public {
        stage = Stage(0);
        isStageActive = false;

        emit StageChanged(stage, isStageActive);
    }

    function completeCurrentStageAndRevealNextStage() public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        completeCurrentStage();
        revealStage();
    }

    function _setAdminAndAddToAllowList(address[] memory addresses) internal
    {
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

    /**********************     Internal & Helpers     ************************/

    function _getNextStageForToken(uint tokenId) internal view returns (Stage) {
        return _getNextStage(_tokensMetadata[tokenId].stage);
    }

    function _process(uint256 tokenId) internal {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: caller is not token owner nor approved"
        );
        require(
            uint(_tokensMetadata[tokenId].stage) == uint(stage) - 1,
            string.concat(
                "The level of the diamond should be ",
                Strings.toString(uint(stage) - 1),
                " to perform this action"
            )
        );

        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
    }

    /**********************           Guards            ************************/

    function _requireActiveStage() internal view {
        require(
            isStageActive,
            "A stage should be active to perform this action"
        );
    }

    function _requireSpecificStage(Stage _stage) internal view {
        require(
            stage == _stage,
            string.concat(
                "The stage should be ",
                Strings.toString(uint(_stage)),
                " to perform this action"
            )
        );
    }

    function _requireValidPayment(uint value)
        internal
        pure
    {
        require(
            value == MINING_PRICE,
            string.concat(
                "Wrong payment - payment should be: ",
                Strings.toString(MINING_PRICE)
            )
        );
    }

    /**********************          Modifiers          ************************/

    modifier _requireAllowedMiner() {
        require(
            mintAllowedAddresses[_msgSender()],
            "The miner is not allowed to mint tokens"
        );
        _;
    }

    modifier whenStageIsActive(Stage _stage) {
        _requireActiveStage();
        _requireSpecificStage(_stage);
        _;
    }

    modifier whenRebirthIsActive() {
        require(
            (stage == Stage.BURN && isStageActive) ||
                stage == Stage.REBIRTH,
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

    /**********************        Transactions        ************************/

    function mine() public payable
        whenStageIsActive(Stage.MINE)
        _requireAllowedMiner
        _requireAssignedMineContract
    {
        _requireValidPayment(msg.value);
        // Restrict another mint by the same miner
        delete mintAllowedAddresses[_msgSender()];

        // Regular mint logics
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_msgSender(), tokenId);
        _diamondDawnMine.allocateDiamond(tokenId);

        // Store token metadata
        _tokensMetadata[tokenId] = Metadata({
            stage: Stage.MINE
        });

        address[] memory wlAddresses = new address[](1);
        wlAddresses[0] = _msgSender();
        emit WhitelistUpdated(WhitelistAction.USE, wlAddresses);
    }

    function cut(uint256 tokenId) public 
        whenStageIsActive(Stage.CUT) 
    {
        _process(tokenId);
    }

    function polish(uint256 tokenId) public
        whenStageIsActive(Stage.POLISH)
    {
        _process(tokenId);
    }

    function burn(uint256 tokenId) public override
        whenStageIsActive(Stage.BURN)
    {
        super.burn(tokenId);
        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
        _burnedTokenToOwner[tokenId] = _msgSender();
        _ownerToBurnedTokens[_msgSender()].add(tokenId);
    }

    function rebirth(uint256 tokenId) public whenRebirthIsActive {
        address burner = _burnedTokenToOwner[tokenId];
        require(
            _msgSender() == burner,
            string.concat(
                "Rebirth failed - only burner is allowed to perform rebirth"
            )
        );
        delete _burnedTokenToOwner[tokenId];
        _ownerToBurnedTokens[_msgSender()].remove(tokenId);
        _tokensMetadata[tokenId].stage = _getNextStageForToken(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    /**********************            Read            ************************/

    function walletOfOwner(address _owner) public view returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokenIds;
    }

    function getBurnedTokens(address owner) public view returns (uint256[] memory)
    {
        return _ownerToBurnedTokens[owner].values();
    }

    function tokenURI(uint256 tokenId) public view override
        _requireAssignedMineContract
        returns (string memory)
    {
        // TODO - this require blocks getting the tokenURI of burnt tokens
        // require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        Stage diamondStage = _tokensMetadata[tokenId].stage;
        return _diamondDawnMine.getDiamondMetadata(tokenId, diamondStage);
    }
}
