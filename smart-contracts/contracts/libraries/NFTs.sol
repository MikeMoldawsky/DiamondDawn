// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Strings.sol";

library NFTs {
    struct Metadata {
        string name;
        string image;
        string animationUrl;
        Attribute[] attributes;
    }

    struct Attribute {
        string traitType;
        string value;
        string maxValue;
        string displayType;
        bool isString;
    }

    function toStrAttribute(string memory traitType, string memory value) internal pure returns (Attribute memory) {
        return Attribute({traitType: traitType, value: value, maxValue: "", displayType: "", isString: true});
    }

    function toAttribute(
        string memory traitType,
        string memory value,
        string memory displayType
    ) internal pure returns (Attribute memory) {
        return Attribute({traitType: traitType, value: value, maxValue: "", displayType: displayType, isString: false});
    }

    function toMaxValueAttribute(
        string memory traitType,
        string memory value,
        string memory maxValue,
        string memory displayType
    ) internal pure returns (Attribute memory) {
        return
            Attribute({
                traitType: traitType,
                value: value,
                maxValue: maxValue,
                displayType: displayType,
                isString: false
            });
    }

    function serialize(Metadata memory metadata) internal pure returns (string memory) {
        bytes memory bytes_;
        bytes_ = abi.encodePacked(bytes_, _openObject());
        bytes_ = abi.encodePacked(bytes_, _pushAttr("name", metadata.name, true, false));
        bytes_ = abi.encodePacked(bytes_, _pushAttr("image", metadata.image, true, false));
        bytes_ = abi.encodePacked(bytes_, _pushAttr("animation_url", metadata.animationUrl, true, false));
        bytes_ = abi.encodePacked(bytes_, _pushAttr("attributes", _serializeAttrs(metadata.attributes), false, true));
        bytes_ = abi.encodePacked(bytes_, _closeObject());
        return string(bytes_);
    }

    function _serializeAttrs(Attribute[] memory attributes) private pure returns (string memory) {
        bytes memory bytes_;
        bytes_ = abi.encodePacked(bytes_, _openArray());
        for (uint256 i = 0; i < attributes.length; i++) {
            Attribute memory attribute = attributes[i];
            bytes_ = abi.encodePacked(bytes_, _pushArray(_serializeAttr(attribute), i == attributes.length - 1));
        }
        bytes_ = abi.encodePacked(bytes_, _closeArray());
        return string(bytes_);
    }

    function _serializeAttr(Attribute memory attribute) private pure returns (string memory) {
        bytes memory bytes_;
        bytes_ = abi.encodePacked(bytes_, _openObject());
        if (bytes(attribute.displayType).length > 0) {
            bytes_ = abi.encodePacked(bytes_, _pushAttr("display_type", attribute.displayType, true, false));
        }
        if (bytes(attribute.maxValue).length > 0) {
            bytes_ = abi.encodePacked(bytes_, _pushAttr("max_value", attribute.maxValue, attribute.isString, false));
        }
        bytes_ = abi.encodePacked(bytes_, _pushAttr("trait_type", attribute.traitType, true, false));
        bytes_ = abi.encodePacked(bytes_, _pushAttr("value", attribute.value, attribute.isString, true));
        bytes_ = abi.encodePacked(bytes_, _closeObject());
        return string(bytes_);
    }

    // Objects
    function _openObject() private pure returns (bytes memory) {
        return abi.encodePacked("{");
    }

    function _closeObject() private pure returns (bytes memory) {
        return abi.encodePacked("}");
    }

    function _pushAttr(
        string memory key,
        string memory value,
        bool isStr,
        bool isLast
    ) private pure returns (bytes memory) {
        if (isStr) value = string.concat('"', value, '"');
        return abi.encodePacked('"', key, '": ', value, isLast ? "" : ",");
    }

    // Arrays
    function _openArray() private pure returns (bytes memory) {
        return abi.encodePacked("[");
    }

    function _closeArray() private pure returns (bytes memory) {
        return abi.encodePacked("]");
    }

    function _pushArray(string memory value, bool isLast) private pure returns (bytes memory) {
        return abi.encodePacked(value, isLast ? "" : ",");
    }
}
