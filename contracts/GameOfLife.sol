pragma solidity ^0.4.8;

import "./Cell.sol";

contract GameOfLife {
    address[] public cells;
    uint8 public state;
    uint public rows;
    uint public cols;

    function GameOfLife(uint _rows, uint _cols) public payable {
        rows = _rows;
        cols = _cols;
    }

    function addCell(address c) public {
        cells.push(c);
    }

    function setState(uint8 newState) public {
        state = newState;
    }

    function getState() view public returns (uint8) {
        return state;
    }

    function getCells() view public returns (address[]) {
        return cells;
    }

    function cellCount() view public returns (uint) {
        return cells.length;
    }

    // Advance n generations in a single transaction
    function stepN(uint8 n) public {
        uint8 k;
        for (k = 0; k < n; k++) {
            _step();
        }
    }

    // Advance one generation
    function step() public {
        _step();
    }

    // Internal step logic — called by both step() and stepN().
    // Reads all states to find the active zone (alive cells + 1-cell boundary).
    // Only alive cells and their immediate neighbours can change state, so we
    // skip the rest entirely — no rules are pre-computed here, each Cell still
    // reads its own neighbours and applies GoL logic in computeNext().
    function _step() internal {
        uint i;
        uint r;
        uint c;
        uint dr;
        uint dc;
        uint nr;
        uint nc;

        // Phase 1: snapshot current states to identify active zone
        uint[] memory states = new uint[](cells.length);
        for (i = 0; i < cells.length; i++) {
            states[i] = Cell(cells[i]).getState();
        }

        // Phase 2: mark candidates — any alive cell and its Moore neighbourhood
        bool[] memory candidate = new bool[](cells.length);
        for (r = 0; r < rows; r++) {
            for (c = 0; c < cols; c++) {
                if (states[r * cols + c] == 1) {
                    for (dr = 0; dr < 3; dr++) {
                        for (dc = 0; dc < 3; dc++) {
                            if (dr == 0 && r == 0) continue;
                            if (dc == 0 && c == 0) continue;
                            if (dr == 2 && r == rows - 1) continue;
                            if (dc == 2 && c == cols - 1) continue;
                            nr = r + dr - 1;
                            nc = c + dc - 1;
                            candidate[nr * cols + nc] = true;
                        }
                    }
                }
            }
        }

        // Phase 3: each candidate cell reads its own neighbours and computes next state
        for (i = 0; i < cells.length; i++) {
            if (candidate[i]) Cell(cells[i]).computeNext();
        }

        // Phase 4: commit — all at once to preserve parallel-update semantics
        for (i = 0; i < cells.length; i++) {
            if (candidate[i]) Cell(cells[i]).commit();
        }
    }
}
