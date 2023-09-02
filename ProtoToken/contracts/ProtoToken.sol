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
     * Allowances structure
     * 
     * Wallet addr1 allows addr2 to transfer until 10 tokens
     * [addr1][addr2] = 10
     */
    mapping( address => mapping(address => uint256) ) private _allowances;


    /**
     * Transfer event
     */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    /**
     * Approval event
     */
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);



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

    /**
     * Approves delegated balance transfer
     */
    function approve(address _spender, uint256 _value) public returns (bool success){
        // add 
        _allowances[msg.sender][_spender] = _value;

        // Emits the approves event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    /**
     * Verify delegated balance approval
     */
    function allowance(address _owner, address _spender) public view returns (uint256 remaining){
        // return remaining value
        return _allowances[_owner][_spender];
    }

}
