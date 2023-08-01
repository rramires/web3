// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Functions{

    int8 private _age = 48;

    /*
     *** view specifies read only - no gas required
         the function must not make any changes to the blockchain
    */
    function getAge() public view returns(int8) {
        return _age;
    }

    /*
     *** this function make change in blockchain - need to pay gas
         IMPORTANT: the return of this function is the hash of transaction 
         there is no way to return something else, because it needs 
         the validation of the miners to happen
    */
    function setAge(int8 newAge) public {
        _age = newAge;
    }

    /*
        TIP: If _age were public, there would be no need to have this getAge function. 
        Only setAge, in case you need to change its value. As for the gas, it would be the same, 
        the decision to do it or not is a matter of project design
    */
}