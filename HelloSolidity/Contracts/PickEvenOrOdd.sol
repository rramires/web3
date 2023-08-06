// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

// npm install @openzeppelin/contracts 
import "@openzeppelin/contracts/utils/Strings.sol";

contract PickEvenOrOdd{

    /**
     * Compare two strings
     */
    function compareString(string memory str1, string memory str2) private pure returns(bool) {
        bytes memory arrA = bytes(str1);
        bytes memory arrB = bytes(str2);
        return arrA.length == arrB.length && keccak256(arrA) == keccak256(arrB);
    }


    // Player 1
    // address
    address public player1;
    // EVEN or ODD choice
    string public  choicePlayer1 = ""; 
    // Player 1 move
    uint private movePlayer1;

    // status of game
    string public gameStatus;

    

    /**
     * Player 1 - choice EVEN or ODD 
     */
    function choose(string memory newChoice) public{

        // Checks if player 1 is choosing again
        string memory message = string.concat("Player 1 already choose: ", choicePlayer1);
        require(compareString(choicePlayer1, ""), message);

        // Checks whether EVEN or ODD was chosen
        require(compareString(newChoice, "EVEN") || compareString(newChoice, "ODD"), "Choose: EVEN or ODD");
    
        // Set choice
        choicePlayer1 = newChoice;

        // Set caller address
        player1 = msg.sender;

        // Change status
        gameStatus = string.concat("Player 1 is ", Strings.toHexString(player1), " and choose ", choicePlayer1, ".");
    }


    /**
     * Player 1 or 2 - move 1 or 2 values
     */
    function play(uint8 move) public {

        // Choose validation
        require(!compareString(choicePlayer1, ""), "First, Player 1 must choose: EVEN or ODD");

        
        // Checks if player 1 or 2 is playing
        if(msg.sender == player1){ 
            // If player 1
            movePlayer1 = move;

            // Change status
            gameStatus = "Player 1 already played. Waiting for player 2's move.";
        }
        else{
            // If player 2

            // Decides whether it's even or odd
            bool isEven = (movePlayer1 + move) % 2 == 0;

            // Return message
            string memory message = string.concat("Player 1 choose: ", choicePlayer1, 
                                                ", and plays: ", Strings.toString(movePlayer1), 
                                                ". Player 2, plays: ", Strings.toString(move));

            // returns
            if(isEven && compareString(choicePlayer1, "EVEN")) {
                gameStatus = string.concat(message, " - Player 1 WON!");
            }
            else if(!isEven && compareString(choicePlayer1, "ODD")) {
                gameStatus = string.concat(message, " - Player 1 WON!");
            }
            else {
                gameStatus = string.concat(message, " - Player 2 WON!");
            }  

            // clear for next game
            player1 = address(0);
            choicePlayer1 = ""; 
            movePlayer1 = 0;
        }   
    }
}


