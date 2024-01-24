// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// Inheritance in Solidity is done with: "is"
contract BEP20v2 is ERC20{

    // Contract owner
    address private _owner;

    // Amount of mint 
    uint private _mintAmount = 0;

    // 1 day delay 
    uint64 private _mintDelay = 60 * 60 * 24; 

    // Stores address + delay
    mapping(address => uint256) private nextMint;


    // To call the parent's constructor, simply call 
    // the function with the same name: ERC20(args)
    constructor() ERC20("BEPSampleV2", "BEPS2"){

        // Stores the contract owner
        _owner = msg.sender;

        // Mint is the process of generating coins
        // Msg.sender is contract creator
        _mint(_owner, 21000000 * 10 ** decimals());
    }


    // Modifier to restrict access to contract owner only
    modifier restricted(){
        // Validate
        require(_owner == msg.sender, "You do not have permission.");
        _;
    }

    // Change mint amount
    function setMintAmount(uint newAmount) public restricted{
        _mintAmount = newAmount;
    }

    // Change mint delay
    function setMintDelay(uint64 newDelayInSeconds) public restricted{
        _mintDelay = newDelayInSeconds;
    }
    
    // Mint new tokens
    function mint(address to) public restricted{
        // Validate
        require(_mintAmount > 0, "Minting is not enabled.");
        require(block.timestamp > nextMint[to], "You cannot mint twice in a row.");

        // Generate and send tokens
        _mint(to, _mintAmount);

        // Add address to delay mapping
        nextMint[to] = block.timestamp + _mintDelay;
    }
}
