// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract MessageStorage {
  string private message;

  constructor() {
    message = "Welcome";
  }

  function write(string memory _message) public {
      message = _message;
  }

  function read() public view returns (string memory msg1) {
    return message;
  }
}
