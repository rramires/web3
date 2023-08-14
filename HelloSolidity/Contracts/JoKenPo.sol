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

    // Player struct
    struct Player{
        address wallet;
        uint32 wins;
    }

    // Players's list
    Player[] public players;


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
     * Adds to winner or increase win
     */
    function updateWinners(address winner) private {
        for(uint i = 0; i < players.length; i++){
            // if exists
            if(players[i].wallet == winner){
                players[i].wins++;
                return; // Skip for with return. 
            }
        }
        players.push(Player(winner, 1));
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
            // Transfer 10% to owner
            owner.transfer((contractAddr.balance / 100) * 10);
            // Transfer 90% to winner
            payable(winner).transfer((contractAddr.balance / 100) * 90);
        }

        // add to winners list
        updateWinners(winner);

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


    /**
     * Returns the sorted list of winners 
     */
    function getRanking() public view returns(Player[] memory){
        if(players.length < 2){
            return players;
        }
        else{ 
            // *** I'm uses Bubble Sort for simplicity 
            //     This a didactic example - This is an inefficient sort method
            // Create new array
            Player[] memory ranking = new Player[](players.length);
            // Copy elements
            for(uint i = 0; i < players.length; i++){
                ranking[i] = players[i];
            }
            // Inverse Bubble Sort
            for(uint i = 0; i < ranking.length -1; i++){
                for(uint j = 1; j < ranking.length ; j++){
                    // If the next position is higher
                    if(ranking[i].wins < ranking[j].wins){
                        // first position temporary storage
                        Player memory next = ranking[i];
                        // replace first position
                        ranking[i] = ranking[j];
                        // replace next position
                        ranking[j] = next;
                    }
                }
            }
            return  ranking;
        }
    }
}