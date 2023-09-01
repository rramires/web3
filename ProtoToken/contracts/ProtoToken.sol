// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract ProtoToken{

    /**
     * Token Name
     */
    string public name = "ProtoToken";

    /**
     * Token Symbol
     */
    string public symbol = "PROTK";

    /**
     * Number of decimals
     */
    uint8 public decimals = 18;

    /**
     * Total supply
     * Number of coinn * decimal places ex: 21 million 
     */
    uint256 public totalSupply = 21000000 * 10 ** decimals;



}
