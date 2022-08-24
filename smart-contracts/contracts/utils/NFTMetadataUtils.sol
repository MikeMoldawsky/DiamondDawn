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
    bool isValueAString;
}

function getStringNFTAttribute(string memory traitType, string memory value)
    pure
    returns (Attribute memory)
{
    return getNFTAttribute(traitType, value, "", true);
}

function getNFTAttribute(
    string memory traitType,
    string memory value,
    string memory displayType,
    bool isValueAString
) pure returns (Attribute memory) {
    return
        Attribute({
            isValueAString: isValueAString,
            displayType: displayType,
            traitType: traitType,
            value: value
        });
}

function toJsonMetadata(NFTMetadata memory metadata)
    pure
    returns (string memory)
{
    bytes memory byteString;
    byteString = abi.encodePacked(byteString, _openObject());
    byteString = abi.encodePacked(
        byteString,
        _pushStringAttribute("name", metadata.name, true)
    );
    byteString = abi.encodePacked(
        byteString,
        _pushStringAttribute("description", metadata.description, true)
    );
    byteString = abi.encodePacked(
        byteString,
        _pushStringAttribute("created_by", metadata.createdBy, true)
    );
    byteString = abi.encodePacked(
        byteString,
        _pushStringAttribute("image", metadata.image, true)
    );
    byteString = abi.encodePacked(
        byteString,
        _pushComplexAttribute(
            "attributes",
            _getAttributes(metadata.attributes),
            false
        )
    );
    byteString = abi.encodePacked(byteString, _closeObject());

    return string(byteString);
}

function _getAttributes(Attribute[] memory attributes)
    pure
    returns (string memory)
{
    bytes memory byteString;
    byteString = abi.encodePacked(byteString, _openArray());
    for (uint i = 0; i < attributes.length; i++) {
        Attribute memory attribute = attributes[i];
        byteString = abi.encodePacked(
            byteString,
            _pushArrayElement(
                _getAttribute(attribute),
                i < (attributes.length - 1)
            )
        );
    }
    byteString = abi.encodePacked(byteString, _closeArray());
    return string(byteString);
}

function _getAttribute(Attribute memory attribute)
    pure
    returns (string memory)
{
    bytes memory byteString;

    byteString = abi.encodePacked(byteString, _openObject());

    if (bytes(attribute.displayType).length > 0) {
        byteString = abi.encodePacked(
            byteString,
            _pushStringAttribute("display_type", attribute.displayType, true)
        );
    }
    byteString = abi.encodePacked(
        byteString,
        _pushStringAttribute("trait_type", attribute.traitType, true)
    );

    byteString = attribute.isValueAString
        ? abi.encodePacked(
            byteString,
            _pushStringAttribute("value", attribute.value, false)
        )
        : abi.encodePacked(
            byteString,
            _pushNonStringAttribute("value", attribute.value, false)
        );

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

function _pushStringAttribute(
    string memory key,
    string memory value,
    bool insertComma
) pure returns (string memory) {
    return
        string(
            abi.encodePacked(
                '"',
                key,
                '": "',
                value,
                '"',
                insertComma ? "," : ""
            )
        );
}

function _pushNonStringAttribute(
    string memory key,
    string memory value,
    bool insertComma
) pure returns (string memory) {
    return
        string(
            abi.encodePacked('"', key, '": ', value, insertComma ? "," : "")
        );
}

function _pushComplexAttribute(
    string memory key,
    string memory value,
    bool insertComma
) pure returns (string memory) {
    return
        string(
            abi.encodePacked('"', key, '": ', value, insertComma ? "," : "")
        );
}

function _pushArrayElement(string memory value, bool insertComma)
    pure
    returns (string memory)
{
    return string(abi.encodePacked(value, insertComma ? "," : ""));
}
