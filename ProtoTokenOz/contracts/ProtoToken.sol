// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Inheritance in Solidity is done with: "is"
contract ProtoToken is ERC20{

    // To call the parent's constructor, simply call 
    // the function with the same name: ERC20(args)
    constructor() ERC20("ProtoTokenOz", "PROTZ"){

        // Mint is the process of generating coins
        // Msg.sender is contract creator
        _mint(msg.sender, 21000000 * 10 ** decimals());
    }
}
