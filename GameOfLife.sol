// We have to specify what version of compiler this code will compile with
pragma solidity ^0.4.18;

contract GameOfLife {
    uint8 public state;

    function ChangeState(uint8 newState) public {
        state = newState;
    }
}
