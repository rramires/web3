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
    address payable private immutable owner;


    /**
     * Contract constructor
     */
    constructor(){
        // get address of who deployed this contract
        owner = payable(msg.sender);
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
     * Finish Game
     * Param newStatus string
     */
    function finishGame(address winner, string memory newStatus) private {
        // If there's a winner
        if(winner != address(0)){
            // Get contract address
            address contractAddr = address(this);
            // Transfer 90% to winner
            payable(winner).transfer((contractAddr.balance / 100) * 90);
            // Transfer the rest to the owner
            owner.transfer(contractAddr.balance);
        }
        // Status
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
            finishGame(player1, "Rock breaks Scissors. Player 1 WON!");
        }
        else if(choice1 == Options.PAPER && newChoice == Options.ROCK){ 
            finishGame(player1, "Paper wraps Rock. Player 1 WON!");
        }
        else if(choice1 == Options.SCISSORS && newChoice == Options.PAPER){ 
            finishGame(player1, "Scissors cuts Paper. Player 1 WON!");
        }
        // If player 2 WON
        else if(choice1 == Options.SCISSORS && newChoice == Options.ROCK){ 
            finishGame(msg.sender, "Rock breaks Scissors. Player 2 WON!");
        }
        else if(choice1 == Options.ROCK && newChoice == Options.PAPER){ 
            finishGame(msg.sender, "Paper wraps Rock. Player 2 WON!");
        }
        else if(choice1 == Options.PAPER && newChoice == Options.SCISSORS){ 
            finishGame(msg.sender, "Scissors cuts Paper. Player 2 WON!");
        }
        // If there is a tie, do not pay and accumulate
        else {
            finishGame(address(0), "Draw game!");
        }
    }
}