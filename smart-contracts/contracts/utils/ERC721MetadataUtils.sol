// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

struct ERC721MetadataStructure {
    string name;
    string description;
    string createdBy;
    string image;
    ERC721MetadataAttribute[] attributes;
}

struct ERC721MetadataAttribute {
    bool includeDisplayType;
    bool includeTraitType;
    bool isValueAString;
    string displayType;
    string traitType;
    string value;
}

function getERC721MetadataAttribute(
    bool includeDisplayType,
    bool includeTraitType,
    bool isValueAString,
    string memory displayType,
    string memory traitType,
    string memory value
) pure returns (ERC721MetadataAttribute memory) {
    ERC721MetadataAttribute memory attribute = ERC721MetadataAttribute({
        includeDisplayType: includeDisplayType,
        includeTraitType: includeTraitType,
        isValueAString: isValueAString,
        displayType: displayType,
        traitType: traitType,
        value: value
    });

    return attribute;
}

function generateERC721Metadata(ERC721MetadataStructure memory metadata)
    pure
    returns (string memory)
{
    bytes memory byteString;
    byteString = abi.encodePacked(byteString, _openJsonObject());
    byteString = abi.encodePacked(
        byteString,
        _pushJsonPrimitiveStringAttribute("name", metadata.name, true)
    );
    byteString = abi.encodePacked(
        byteString,
        _pushJsonPrimitiveStringAttribute(
            "description",
            metadata.description,
            true
        )
    );
    byteString = abi.encodePacked(
        byteString,
        _pushJsonPrimitiveStringAttribute(
            "created_by",
            metadata.createdBy,
            true
        )
    );
    byteString = abi.encodePacked(
        byteString,
        _pushJsonPrimitiveStringAttribute("image", metadata.image, true)
    );
    byteString = abi.encodePacked(
        byteString,
        _pushJsonComplexAttribute(
            "attributes",
            _getAttributes(metadata.attributes),
            false
        )
    );
    byteString = abi.encodePacked(byteString, _closeJsonObject());

    return string(byteString);
}

function _getAttributes(ERC721MetadataAttribute[] memory attributes)
    pure
    returns (string memory)
{
    bytes memory byteString;
    byteString = abi.encodePacked(byteString, _openJsonArray());
    for (uint i = 0; i < attributes.length; i++) {
        ERC721MetadataAttribute memory attribute = attributes[i];
        byteString = abi.encodePacked(
            byteString,
            _pushJsonArrayElement(
                _getAttribute(attribute),
                i < (attributes.length - 1)
            )
        );
    }
    byteString = abi.encodePacked(byteString, _closeJsonArray());

    return string(byteString);
}

function _getAttribute(ERC721MetadataAttribute memory attribute)
    pure
    returns (string memory)
{
    bytes memory byteString;

    byteString = abi.encodePacked(byteString, _openJsonObject());

    if (attribute.includeDisplayType) {
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute(
                "display_type",
                attribute.displayType,
                true
            )
        );
    }

    if (attribute.includeTraitType) {
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute(
                "trait_type",
                attribute.traitType,
                true
            )
        );
    }

    if (attribute.isValueAString) {
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveStringAttribute("value", attribute.value, false)
        );
    } else {
        byteString = abi.encodePacked(
            byteString,
            _pushJsonPrimitiveNonStringAttribute(
                "value",
                attribute.value,
                false
            )
        );
    }

    byteString = abi.encodePacked(byteString, _closeJsonObject());

    return string(byteString);
}

function _openJsonObject() pure returns (string memory) {
    return string(abi.encodePacked("{"));
}

function _closeJsonObject() pure returns (string memory) {
    return string(abi.encodePacked("}"));
}

function _openJsonArray() pure returns (string memory) {
    return string(abi.encodePacked("["));
}

function _closeJsonArray() pure returns (string memory) {
    return string(abi.encodePacked("]"));
}

function _pushJsonPrimitiveStringAttribute(
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

function _pushJsonPrimitiveNonStringAttribute(
    string memory key,
    string memory value,
    bool insertComma
) pure returns (string memory) {
    return
        string(
            abi.encodePacked('"', key, '": ', value, insertComma ? "," : "")
        );
}

function _pushJsonComplexAttribute(
    string memory key,
    string memory value,
    bool insertComma
) pure returns (string memory) {
    return
        string(
            abi.encodePacked('"', key, '": ', value, insertComma ? "," : "")
        );
}

function _pushJsonArrayElement(string memory value, bool insertComma)
    pure
    returns (string memory)
{
    return string(abi.encodePacked(value, insertComma ? "," : ""));
}
