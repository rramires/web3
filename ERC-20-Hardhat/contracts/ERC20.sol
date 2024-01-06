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

    /**
     * Balances structure 
     * eg: [addr] = 10
     */
    mapping(address => uint256) private _balances;

    /**
     * Allowances structure
     * 
     * Wallet addr1 allows addr2 to transfer until 10 tokens
     * 1:N eg:
     * [addr1][addr2] = 10
     * [addr1][addr3] = 20
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
        // Set the initial balance for the contract owner
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

        // Transfer
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
        // add 1:N = [addr1][addr2] = 10
        _allowances[msg.sender][_spender] = _value;

        // Emits the approves event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }
}
