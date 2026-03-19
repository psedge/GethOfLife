pragma solidity ^0.4.0;

contract Cell {
    address[] public neighbours;
    uint public state;
    uint public nextState;

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

    // Get neighbour count
    function getNeighbourCount() public view returns (uint count) {
        return neighbours.length;
    }

    // Add new neighbour
    function addNeighbour(address neighbour) public {
        if (getNeighbourCount() >= 8) {
            return;
        }
        neighbours.push(neighbour);
    }

    // Phase 1: read neighbour states and compute next state (do not apply yet)
    function computeNext() public {
        uint8 aliveNeighbours = 0;
        for (uint i = 0; i < getNeighbourCount(); i++) {
            if (Cell(neighbours[i]).getState() == 1) {
                aliveNeighbours++;
            }
        }
        if (getState() == 1) {
            nextState = (aliveNeighbours < 2 || aliveNeighbours > 3) ? 0 : 1;
        } else {
            nextState = (aliveNeighbours == 3) ? 1 : 0;
        }
    }

    // Phase 2: apply the computed next state
    function commit() public {
        state = nextState;
    }
}
