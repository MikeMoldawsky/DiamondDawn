// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../objects/Diamond.sol";
import "../objects/Mine.sol";

import "../interface/IDiamondDawnV2Phase.sol";

library Phases {
    struct Phase {
        IDiamondDawnV2Phase _phase;
        string _name;
        uint16 _maxSupply;
        uint _price;
        uint16 _evolved;
        bool _isOpen;
    }

    struct TokenMetadata {
        IDiamondDawnV2Phase phase;
        bytes attributes;
    }

    function initialize(Phase memory phase) internal {
        return phase._phase.initialize();
    }

    function evolve(
        TokenMetadata storage metadata,
        Phase memory newPhase,
        uint tokenId
    ) internal {
        require(newPhase._isOpen, "phase is closed");
        require(newPhase._evolved < newPhase._maxSupply, "max evolved");
        require(canEvolveFrom(newPhase, metadata.phase), "not supported phase");
        newPhase._evolved += 1;
        metadata.attributes = newPhase._phase.evolve(tokenId, metadata.attributes);
        metadata.phase = newPhase._phase;
    }

    function open(Phase storage phase) internal {
        phase._isOpen = true;
    }

    function close(Phase storage phase) internal {
        phase._isOpen = false;
    }

    function getMetadata(TokenMetadata memory metadata, uint tokenId) internal view returns (string memory) {
        return metadata.phase.getMetadata(tokenId, metadata.attributes);
    }

    function toPhase(
        address ddPhase,
        uint16 maxSupply,
        uint price
    ) internal view returns (Phase memory) {
        IDiamondDawnV2Phase phase = IDiamondDawnV2Phase(ddPhase);
        return
            Phase({
                _phase: phase,
                _name: phase.getName(),
                _maxSupply: maxSupply,
                _price: price,
                _evolved: 0,
                _isOpen: false
            });
    }

    function canEvolveFrom(Phase memory to, Phase memory from) internal view returns (bool) {
        return canEvolveFrom(to, from._phase);
    }

    function canEvolveFrom(Phase memory to, IDiamondDawnV2Phase from) internal view returns (bool) {
        return to._phase.canEvolveFrom(from);
    }

    function isOpen(Phase memory phase) internal pure returns (bool) {
        return phase._isOpen;
    }

    function getPrice(Phase memory phase) internal pure returns (uint) {
        return phase._price;
    }

    function isConfigured(Phase memory phase) internal pure returns (bool) {
        return phase._maxSupply > 0 && bytes(phase._name).length > 0;
    }

    function getEvolved(Phase memory phase) internal pure returns (uint16) {
        return phase._evolved;
    }

    function getName(Phase memory phase) internal pure returns (string memory) {
        return phase._name;
    }

    function getPhaseAddress(Phase memory phase) internal pure returns (address) {
        return address(phase._phase);
    }
}
