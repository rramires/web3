// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract HelloTruffle{
	
	string public message = "HelloTruffle";

	function setMessage(string memory newMessage) public{
		message = newMessage;
	}
}
