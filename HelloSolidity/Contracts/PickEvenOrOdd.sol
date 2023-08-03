// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

// npm install @openzeppelin/contracts 
import "@openzeppelin/contracts/utils/Strings.sol";

contract PickEvenOrOdd{

    string public  choice = ""; // EVEN or ODD

    /*
    compare two strings
    *** In solidity string is an array of bytes, similar to C.
        There is no way to compare using "a" == "b"
    */
    function compareString(string memory str1, string memory str2) private pure returns(bool) {
        bytes memory arrA = bytes(str1);
        bytes memory arrB = bytes(str2);
        return arrA.length == arrB.length && keccak256(arrA) == keccak256(arrB);
    }


    /**
     * newChoice EVEN or ODD
     */
    function choose(string memory newChoice) public{

        /* 
         Use require for validation
         require reverts the transaction
        */
        require(compareString(newChoice, "EVEN") || compareString(newChoice, "ODD"), "Choose: EVEN or ODD");

        // set
        choice = newChoice;
    }


    /*
    *** IMPORTANT: The purpose is didactic! This could be a security hole.
        It is possible to "guess" a random number in an EVM due to slowness.
        Returns 0 or 1 by % 2
    */
    function random() private view returns(uint) {
        return uint( keccak256( abi.encodePacked(block.timestamp, choice) ) ) % 2;
    }


    function play(uint8 number) public view returns(string memory) {

        // param validation
        require(number >= 0 && number <= 2, "Play with: 0, 1 or 2");

        // choose validation
        require(!compareString(choice, ""), "First, choose: EVEN or ODD");

        // get CPU ramdom option
        uint cpuNumber = random();

        // validation 
        bool isEven = (cpuNumber + number) % 2 == 0;

        // return message
        string memory message = string.concat("Player choose: ", choice, 
                                              ", and plays: ", Strings.toString(number), 
                                              ". CPU plays: ", Strings.toString(cpuNumber));

        // returns
        if(isEven && compareString(choice, "EVEN")){
            return string.concat(message, " Player WON!");
        }
        else if(!isEven && compareString(choice, "ODD")) {
            return string.concat(message, " Player WON!");
        }
        else{
            return string.concat(message, " CPU WON!");
        }        
    }
}


