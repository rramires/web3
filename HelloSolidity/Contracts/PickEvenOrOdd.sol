// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract PickEvenOrOdd{

    uint8 public  choice = 0;


    /**
     * newChoice 1 = odd or 2 = even
     */
    function choose(uint8 newChoice) public{

        /* 
         Use require for validation
         require reverts the transaction
        */
        require(newChoice == 1 || newChoice == 2, "Choose: 1 = odd or 2 = even");

        // set
        choice = newChoice;
    }


    /*
    *** IMPORTANT: The purpose is didactic! This could be a security hole.
        It is possible to "guess" a random number in an EVM due to slowness.
    */
    function random() private view returns(uint) {
        return uint( keccak256( abi.encodePacked(block.timestamp, choice) ) );
    }


    function play(uint8 number) public view returns(bool) {

        // param validation
        require(number >= 0 && number <= 2, "Play with: 0, 1 or 2");

        // choose validation
        require(choice != 0, "First, choose: 1 = odd or 2 = even");

        uint cpuNumber = random();

        // validation 
        bool isEven = (cpuNumber + number) %2 == 0;

        // returns
        if(isEven && choice == 1){
            return true;
        }
        else if(!isEven && choice == 2) {
            return true;
        }
        else{
            return false;
        }        
    }
}


