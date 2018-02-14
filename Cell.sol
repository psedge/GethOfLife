pragma solidity ^0.4.0;

contract Cell {
    address[] public neighbours;
    uint public state;

    function setState(uint newState) public {
        state = newState;
    }

    function getState() public view returns (uint) {
        return state;
    }

    // Get neighbours
    function getNeighbours() public view returns (address[] neighbour) {
        return neighbours;
    }

    // Get neighbours count
    function getNeighbourCount() public view returns (uint count) {
        return neighbours.length;
    }

    // Add new neighbour
    function addNeighbour(address neighbour) public {
        if (getNeighbourCount() > 7) {
            return;
        }

        neighbours.push(neighbour);
    }

    // Take a step forward
    function step() public {
        uint8 aliveNeighbours = 0;

        for (uint i=0; i < getNeighbourCount(); i++) {
            Cell c = Cell(neighbours[i]);
            if (c.getState() == 0) {
                aliveNeighbours++;
            }
        }

        if (getState() == 1) {
            if (aliveNeighbours < 2) {
                // I starve.
                setState(0);
            } else if (aliveNeighbours == (2 | 3)) {
                // I survive.
            } else if (aliveNeighbours > 3) {
                // I erupt.
                setState(0);
            }
        } else {
            if (aliveNeighbours == 3) {
                // I emerge.
                setState(1);
            }
        }
    }


}