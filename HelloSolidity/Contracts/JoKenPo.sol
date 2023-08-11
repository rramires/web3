// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract JoKenPo {

    // Play options
    enum Options { NONE, ROCK, PAPER, SCISSORS } // 0, 1, 2 or 3

    // Player 1
    Options private choice1 = Options.NONE; // Choice
    address private player1 = msg.sender; // Identifies by address

    // The game status
    string public status = "";

    // Contract owner
    address private immutable owner;


    /**
     * Contract constructor
     */
    constructor(){
        // get address of who deployed this contract
        owner = msg.sender;
    }


    /**
     * Get Balance - only contract owner access
     */
    function getBalance() public view returns (uint){
        // *** Note: Contract balance is public, this a didactic example 
        require(owner == msg.sender, "You don't have permissions to access this.");
        // returns the contract balance
        return address(this).balance;
    }


    /**
     * Set status
     * Param newStatus string
     */
    function setStatus(string memory newStatus) private {
        status = newStatus;
        // Reset
        player1 = address(0);
        choice1 = Options.NONE;
    }

    /**
     * The game
     * param newChoice = 0, 1, 2 or 3 
     */
    function play(Options newChoice) public payable {

        // Validation
        require(newChoice != Options.NONE, "Invalid choice!");
        require(player1 != msg.sender, "Await another player.");
        // requires payment
        require(msg.value >= 0.01 ether , "Invalid bid."); // accepts ether gwei wei

        // If player 1 
        if(choice1 == Options.NONE){
            player1 = msg.sender;
            choice1 = newChoice;
            status = "Player 1 chose his option. Waiting for player 2.";
        }
        // If player 1 WON
        else if(choice1 == Options.ROCK && newChoice == Options.SCISSORS){ 
            setStatus("Rock breaks Scissors. Player 1 WON!");
        }
        else if(choice1 == Options.PAPER && newChoice == Options.ROCK){ 
            setStatus("Paper wraps Rock. Player 1 WON!");
        }
        else if(choice1 == Options.SCISSORS && newChoice == Options.PAPER){ 
            setStatus("Scissors cuts Paper. Player 1 WON!");
        }
        // If player 2 WON
        else if(choice1 == Options.SCISSORS && newChoice == Options.ROCK){ 
            setStatus("Rock breaks Scissors. Player 2 WON!");
        }
        else if(choice1 == Options.ROCK && newChoice == Options.PAPER){ 
            setStatus("Paper wraps Rock. Player 2 WON!");
        }
        else if(choice1 == Options.PAPER && newChoice == Options.SCISSORS){ 
            setStatus("Scissors cuts Paper. Player 2 WON!");
        }
        // If there was a tie
        else {
            setStatus("Draw game!");
        }
    }
}