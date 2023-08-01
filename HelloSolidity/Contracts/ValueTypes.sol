// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract ValueTypes{

    string public message = "Hi...";

    // default int size = 256 bytes = 77 decimal places (12345678901234567890123456789012345678901234567890123456789012345678901234567)
    // int public age = 105; *** Wrong! Allocates too much memory to just save the age.

    // Use the smallest possible size to save fees, but int -128 to +127
    //int8 public age = 105; 

    // If it's only positive numbers, use uint - Unsigned Tnteger - 0 to 255
    uint8 public age = 105; // OK

    /*
      *** Note: There is no float in solidity !!!
                Use the smallest fraction of value. 
                Decimals are only used on the frontend
    */

    // address = wallet address or contract number (test wallet acc1 address)
    address public wallet1 = 0x0213677c1881078E4e649E1cF1DbB2e816FB1CD0;

    // boolean
    bool public isValid = true;

    /*
    bytes1 to bytes32 - binary type
    */
    bytes1 public oneByte = 0x65;

    /*
    enumerator - pre defined values
    */
    enum Chave {ON, OFF}
    // accepts only ON, OFF values
    Chave public status = Chave.ON;
}