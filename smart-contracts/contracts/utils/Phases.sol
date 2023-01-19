// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../objects/Diamond.sol";
import "../objects/Mine.sol";

import "../interface/IDiamondDawnPhase.sol";


library Phases {
    struct Phase {
        IDiamondDawnPhase _phase;
        string _name;
        bool _isOpen;
        uint16 _maxSupply;
        uint16 _evolved;
        uint _price;
        mapping(string => bool) _supportedPhases;
    }

    struct TokenMetadata {
        string _phaseName;
        uint _metadata;
    }

    function initialize(Phase storage phase, address ddPhase, string memory name, uint16 maxSupply, uint price, string memory supportedPhase) internal {
        phase._phase = IDiamondDawnPhase(ddPhase);
        phase._name = name;
        phase._maxSupply = maxSupply;
        phase._price = price;
        phase._supportedPhases[supportedPhase] = true;
    }


    function evolve(Phase storage phase, uint tokenId, TokenMetadata storage currentMetadata) internal {
        require(phase._isOpen, "phase is closed");
        require(phase._evolved < phase._maxSupply, "max evolved");
        require(phase._supportedPhases[currentMetadata._phaseName], "not supported phase");
        phase._evolved += 1;
        currentMetadata._metadata = phase._phase.evolve(tokenId, currentMetadata._metadata);
        currentMetadata._phaseName = phase._name;
    }

    function open(Phase storage phase) internal {
        phase._isOpen = true;
    }

    function close(Phase storage phase) internal {
        phase._isOpen = false;
    }

    function getMetadata(Phase storage phase, uint tokenId, TokenMetadata memory metadata) internal view returns (string memory) {
        require( keccak256(bytes(phase._name)) == keccak256(bytes(metadata._phaseName)), "Wrong token phase");
        return phase._phase.getMetadata(tokenId, metadata._metadata);
    }

    function isOpen(Phase storage phase) internal view returns (bool) {
        return phase._isOpen;
    }

    function getPrice(Phase storage phase) internal view returns (uint) {
        return phase._price;
    }

    function isPrice(Phase storage phase, uint price) internal view returns (bool) {
        return phase._price == price;
    }
}
