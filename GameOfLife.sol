// We have to specify what version of compiler this code will compile with
pragma solidity ^0.4.18;

contract GameOfLife {
    uint8 public state;
    address[] neighbours;

    // Get neighbours
    function getNeighbours() public returns (address neighbour) {
        return neighbours;
    }

    // Get neighbours count
    function getNeighbourCount() public constant returns (uint count) {
        return neighbours.length;
    }

    // Add new neighbour
    function addNeighbour(address neighbour) public {
        if (this.getNeighbourCount() > 7) {
            return;
        }

        neighbours.push(address);
    }

    // Take a step forward
    function step() public {
        uint8 aliveNeighbours = 0;

        for (uint i; i < this.getNeighbourCount(); i++) {
            if (this.neighbours[i].getState() == 0) {
                aliveNeighbours++;
            }
        }

        if (this.getState() == 1) {
            if (aliveNeighbours < 2) {
                // I starve.
                this.setState(0);
            } else if (aliveNeighbours == (2 | 3)) {
                // I survive.
            } else if (aliveNeighbours > 3) {
                // I erupt.
                this.setState(0);
            }
        } else {
            if (aliveNeighbours == 3) {
                // I emerge.
                this.setState(1);
            }
        }
    }

    // Set state to argument.
    function setState(uint8 newState) public {
        state = newState;
    }

    // Return the current state.
    function getState() view public returns (uint8) {
        return state;
    }
}
