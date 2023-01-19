// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "../interface/IDiamondDawnPhase.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "../utils/NFTs.sol";


/**
 * @title DiamondDawnMine
 * @author Mike Moldawsky (Tweezers)
 */
contract RevealPhase is IDiamondDawnPhase{

	string private _baseTokenURI = "ar://";
	string private _manifest = "manifest";

	function evolve(uint tokenId, uint prevMetadata) external view returns (uint) {
		return 1;
	}

	function getMetadata(uint tokenId, uint metadata) external view returns (string memory) {
		string memory noExtensionURI = _getNoExtensionURI(metadata);
		string memory base64Json = Base64.encode(bytes(_getMetadataJson(tokenId, metadata, noExtensionURI)));
		return string(abi.encodePacked("data:application/json;base64,", base64Json));
	}

	function lock() external {

	}

	function _getNoExtensionURI(uint metadata) private view returns (string memory) {
		string memory name = _getResourceName(metadata);
		return string.concat(_baseTokenURI, _manifest, "/", name);
	}

	function _getResourceName(uint metadata) private pure returns (string memory) {
		if (metadata == 0 ) return "logo";
		else if (metadata == 1 ) return "logo-honorary";
		revert();
	}

	function _getMetadataJson(
		uint tokenId,
		uint metadata,
		string memory noExtensionURI
	) private view returns (string memory) {
		NFTs.Metadata memory nftMetadata = NFTs.Metadata({
		name: string.concat("Mine Key #", Strings.toString(tokenId)),
		image: string.concat(noExtensionURI, ".jpeg"),
		animationUrl: string.concat(noExtensionURI, ".mp4"),
		attributes: _getJsonAttributes(metadata)
		});
		return NFTs.serialize(nftMetadata);
	}

	function _getJsonAttributes(uint metadata) private view returns (NFTs.Attribute[] memory) {
		if (metadata == 0) return new NFTs.Attribute[](0);
		else if (metadata == 1) {
			NFTs.Attribute[] memory attributes = new NFTs.Attribute[](1);
			attributes[0] = NFTs.toStrAttribute("Attribute", "Honorary");
			return attributes;
		}
		revert("wrong metadata");
	}
}