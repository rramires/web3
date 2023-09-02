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
     * Number of decimal places
     */
    uint8 public decimals = 18;

    /**
     * Total supply
     * eg: 21 million 
     */
    uint256 public totalSupply = 21000000 * 10 ** decimals;

    /**
     * Balances structure
     */
    mapping(address => uint256) private _balances;


    /**
     * Contract constructor
     */
    constructor(){
        // Set the entire opening balance for the contract owner
        _balances[msg.sender] = totalSupply;
    }


    /**
     * Returns the wallet balance
     */
    function balanceOf(address _owner) public view returns (uint256 balance){
        return _balances[_owner];
    }


}
