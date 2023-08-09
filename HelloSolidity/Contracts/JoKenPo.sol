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
    function play(Options newChoice) public {

        // Validation
        require(newChoice != Options.NONE, "Invalid choice!");
        require(player1 != msg.sender, "Await another player.");

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