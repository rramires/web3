// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ERC20 {
    
    /**
     * Token Name
     */
    string public name = "ERCSample";

    /**
     * Token Symbol
     */
    string public symbol = "ERCS";

    /**
     * Number of decimal places
     */
    uint8 public decimals = 18;

    /**
     * Total supply
     * eg: 21 million 
     */
    uint256 public totalSupply = 21000000 * 10 ** decimals;

}
