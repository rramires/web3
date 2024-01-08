// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// Inheritance in Solidity is done with: "is"
contract BEP20 is ERC20{

    // To call the parent's constructor, simply call 
    // the function with the same name: ERC20(args)
    constructor() ERC20("BEPSample", "BEPS"){

        // Mint is the process of generating coins
        // Msg.sender is contract creator
        _mint(msg.sender, 21000000 * 10 ** decimals());
    }
    
}
