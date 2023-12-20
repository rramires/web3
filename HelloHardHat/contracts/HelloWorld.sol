// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract HelloWorld {
    
    string public message = "Hello World";

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}
