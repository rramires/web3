// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract AccessModifiers{

    /*
      *** Note: They serve to restrict calls and organize the code.
                But they are not 100% efficient in terms of privacy (reading).
                Remember: Blockchains are public!
    */

    /*
    internal = default <=> protected in other langauges
    Can be accessed in this contract on your children (by inheritance)
    */
    string internal internalValues = "Test";


    /*
    private = more restrictive, access only by this contract. 
    NO access by inheritance
    */
    string private privateValues = "Test";


    /*
    public = everyone can access
    NOTE: solidity automatically generates a function to access public
    */
    string public publicValues = "Test";


    /*
    external = external access only - for functions only - function externalValues() external { };
    */
    
}
