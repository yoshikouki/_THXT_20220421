//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract THXT is ERC721PresetMinterPauserAutoId {
    string private _name = "Thanks Token";
    string private _symbol = "THXT";
    string private _baseTokenURI = "https://example.com/baseTokenURI";

    constructor()
        ERC721PresetMinterPauserAutoId(_name, _symbol, _baseTokenURI)
    {}
}
