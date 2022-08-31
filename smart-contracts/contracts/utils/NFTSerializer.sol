// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

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

    function serialize(NFTMetadata memory metadata) pure returns (string memory) {
        bytes memory byteString;
        byteString = abi.encodePacked(byteString, _openObject());
        byteString = abi.encodePacked(byteString, _pushStrAttribute("name", metadata.name, true));
        byteString = abi.encodePacked(
            byteString,
            _pushStrAttribute("description", metadata.description, true)
        );
        byteString = abi.encodePacked(byteString, _pushStrAttribute("created_by", metadata.createdBy, true));
        byteString = abi.encodePacked(byteString, _pushStrAttribute("image", metadata.image, true));
        byteString = abi.encodePacked(
            byteString,
            _pushAttribute("attributes", _getAttributes(metadata.attributes), false)
        );
        byteString = abi.encodePacked(byteString, _closeObject());

        return string(byteString);
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

function _getAttributes(Attribute[] memory attributes) pure returns (string memory) {
    bytes memory byteString;
    byteString = abi.encodePacked(byteString, _openArray());
    for (uint i = 0; i < attributes.length; i++) {
        Attribute memory attribute = attributes[i];
        byteString = abi.encodePacked(
            byteString,
            _pushArray(_getAttribute(attribute), i < (attributes.length - 1))
        );
    }
    byteString = abi.encodePacked(byteString, _closeArray());
    return string(byteString);
}

function _getAttribute(Attribute memory attribute) pure returns (string memory) {
    bytes memory byteString;

    byteString = abi.encodePacked(byteString, _openObject());

    if (bytes(attribute.displayType).length > 0) {
        byteString = abi.encodePacked(
            byteString,
            _pushStrAttribute("display_type", attribute.displayType, true)
        );
    }
    byteString = abi.encodePacked(byteString, _pushStrAttribute("trait_type", attribute.traitType, true));

    byteString = attribute.isString
        ? abi.encodePacked(byteString, _pushStrAttribute("value", attribute.value, false))
        : abi.encodePacked(byteString, _pushAttribute("value", attribute.value, false));

    byteString = abi.encodePacked(byteString, _closeObject());

    return string(byteString);
}

function _openObject() pure returns (string memory) {
    return string(abi.encodePacked("{"));
}

function _closeObject() pure returns (string memory) {
    return string(abi.encodePacked("}"));
}

function _openArray() pure returns (string memory) {
    return string(abi.encodePacked("["));
}

function _closeArray() pure returns (string memory) {
    return string(abi.encodePacked("]"));
}

function _pushStrAttribute(
    string memory key,
    string memory value,
    bool insertComma
) pure returns (string memory) {
    return string(abi.encodePacked('"', key, '": "', value, '"', insertComma ? "," : ""));
}

function _pushAttribute(
    string memory key,
    string memory value,
    bool insertComma
) pure returns (string memory) {
    return string(abi.encodePacked('"', key, '": ', value, insertComma ? "," : ""));
}

function _pushArray(string memory value, bool insertComma) pure returns (string memory) {
    return string(abi.encodePacked(value, insertComma ? "," : ""));
}
