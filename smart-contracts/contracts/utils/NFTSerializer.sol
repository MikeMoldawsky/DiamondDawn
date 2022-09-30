// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/**
 * A generic NFT Metadata serializer.
 * Based on https://etherscan.io/address/0x4e1e18aaCCDf9acFd2E8847654A3871dfD234F02#code
 */
struct NFTMetadata {
    string name;
    string description;
    string createdBy;
    string image;
    Attribute[] attributes;
}

struct Attribute {
    string traitType;
    string value;
    string displayType;
    bool isString;
}

function toStrAttribute(string memory traitType, string memory value) pure returns (Attribute memory) {
    return Attribute({traitType: traitType, value: value, displayType: "", isString: true});
}

function toAttribute(
    string memory traitType,
    string memory value,
    string memory displayType
) pure returns (Attribute memory) {
    return Attribute({traitType: traitType, value: value, displayType: displayType, isString: false});
}

function serialize(NFTMetadata memory metadata) pure returns (string memory) {
    bytes memory bytes_;
    bytes_ = abi.encodePacked(bytes_, _openObject());
    bytes_ = abi.encodePacked(bytes_, _pushAttr("name", metadata.name, true, false));
    bytes_ = abi.encodePacked(bytes_, _pushAttr("description", metadata.description, true, false));
    bytes_ = abi.encodePacked(bytes_, _pushAttr("created_by", metadata.createdBy, true, false));
    bytes_ = abi.encodePacked(bytes_, _pushAttr("image", metadata.image, true, false));
    bytes_ = abi.encodePacked(
        bytes_,
        _pushAttr("attributes", _serializeAttrs(metadata.attributes), false, true)
    );
    bytes_ = abi.encodePacked(bytes_, _closeObject());
    return string(bytes_);
}

function _serializeAttrs(Attribute[] memory attributes) pure returns (string memory) {
    bytes memory bytes_;
    bytes_ = abi.encodePacked(bytes_, _openArray());
    for (uint i = 0; i < attributes.length; i++) {
        Attribute memory attribute = attributes[i];
        bytes_ = abi.encodePacked(bytes_, _pushArray(_serializeAttr(attribute), i == attributes.length - 1));
    }
    bytes_ = abi.encodePacked(bytes_, _closeArray());
    return string(bytes_);
}

function _serializeAttr(Attribute memory attribute) pure returns (string memory) {
    bytes memory bytes_;
    bytes_ = abi.encodePacked(bytes_, _openObject());
    if (bytes(attribute.displayType).length > 0) {
        bytes_ = abi.encodePacked(bytes_, _pushAttr("display_type", attribute.displayType, true, false));
    }
    bytes_ = abi.encodePacked(bytes_, _pushAttr("trait_type", attribute.traitType, true, false));
    bytes_ = abi.encodePacked(bytes_, _pushAttr("value", attribute.value, attribute.isString, true));
    bytes_ = abi.encodePacked(bytes_, _closeObject());
    return string(bytes_);
}

// Objects
function _openObject() pure returns (bytes memory) {
    return abi.encodePacked("{");
}

function _closeObject() pure returns (bytes memory) {
    return abi.encodePacked("}");
}

function _pushAttr(
    string memory key,
    string memory value,
    bool isStr,
    bool isLast
) pure returns (bytes memory) {
    if (isStr) value = string.concat('"', value, '"');
    return abi.encodePacked('"', key, '": ', value, isLast ? "" : ",");
}

// Arrays
function _openArray() pure returns (bytes memory) {
    return abi.encodePacked("[");
}

function _closeArray() pure returns (bytes memory) {
    return abi.encodePacked("]");
}

function _pushArray(string memory value, bool isLast) pure returns (bytes memory) {
    return abi.encodePacked(value, isLast ? "" : ",");
}
