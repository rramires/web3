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
     * Transfer event
     */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);


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

    /**
     * Balance transfer
     */
    function transfer(address _to, uint256 _value) public returns (bool success){
        // Check balance
        require(balanceOf(msg.sender) >= _value, "Insufficient balance.");

        // Calcs
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        
        // Emits the transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
