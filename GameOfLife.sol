pragma solidity ^0.4.8;

contract GameOfLife {
    address[] public cells;
    uint8 public state;

    function GameOfLife() public payable {
    }

    function addCell(address c) public payable {
        cells.push(c);
    }

    function setState(uint8 newState) public payable {
        state = newState;
    }

    function getState() view public returns (uint8) {
        return state;
    }

    function getCells() view public returns (address[]) {
        return cells;
    }
}


