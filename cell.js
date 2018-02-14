var Web3 = require("web3");
var fs = require("fs");
web3 = new Web3(new Web3.providers.HttpProvider("http://dev.gol:8080"));

var gol;
account = '';
web3.eth.getAccounts().then(
    function(accounts) {
        account = accounts[0];

        gol = new web3.eth.Contract(
            JSON.parse(fs.readFileSync('GameOfLife.abi').toString()),
            fs.readFileSync('GameOfLife.addr').toString(),
            {from: account}
        );

        function loadCell(cell) {
            return new web3.eth.Contract(
                JSON.parse(fs.readFileSync('Cell.abi').toString()),
                cell,
                {from: account}
            );
        }

        function getCellState(cell) {
            return cell.methods.getState().call(function(err, res) {
                if (err) console.log("Error: " + err)
                console.log("Cell State: " + res)
                return res;
            });
        }

        function getCellNeighbours(cell) {
            return cell.methods.getNeighbours().call(function(err, res) {
                if (err) console.log("Error: " + err);
                console.log("Cell Neighbours: ");
                console.log(res);
            });
        }

        function addCellNeighbour(cell, neighbour) {
            cell.methods.addNeighbour(neighbour).send({from: account}, function(err) {
                if (err) console.log("Error: " + err)
                getCellNeighbours(cell)
            })
        }

        function addCell(cell) {
            gol.methods.addCell(cell).send({from: account, value: 50000}, function(error, res) {
                getCells()
            })
        }

        function changeState(newState) {
            gol.methods.setState(newState).send({from: account, value: 50000}, function(error) {
                getCells()
            });
        }

        function getCells() {
            gol.methods.getCells().call(function(err, res) {
                console.log(err, res)
            });
        }

        cells = fs.readFileSync('Cell.addr').toString().split("\n")
        rows = [[], [], [], [], []]
        neighbours = {}

        for (var c=0; c<cells.length;c++){
            neighbours[cells[c]] = []
        }

        for (var r=0; r<5; r++) {
            for (var c=0;c<5;c++) {
                rows[r][c] = cells[r*5+c];
            }
        }

        // Build neighbour graph.
        for (var r=0;r<5;r++) {
            for (var c=0;c<5;c++) {
                current = cells[r*5+c];

                // Add above and below
                if (rows[r-1] !== void 0) neighbours[current].push(rows[r-1][c])
                if (rows[r+1] !== void 0) neighbours[current].push(rows[r+1][c])
                // Add left and right of us.
                if (rows[r][c-1] !== void 0) neighbours[current].push(rows[r][c-1])
                if (rows[r][c+1] !== void 0) neighbours[current].push(rows[r][c+1])
                // Add left above and below us.
                if (rows[r-1] !== void 0 && rows[r-1][c-1] !== void 0) neighbours[current].push(rows[r-1][c-1])
                if (rows[r+1] !== void 0 && rows[r+1][c-1] !== void 0) neighbours[current].push(rows[r+1][c-1])
                // Add right above and below us.
                if (rows[r-1] !== void 0 && rows[r-1][c+1] !== void 0) neighbours[current].push(rows[r-1][c+1])
                if (rows[r+1] !== void 0 && rows[r+1][c+1] !== void 0) neighbours[current].push(rows[r+1][c+1])
            }
        }

        // Add neighbours
        if (false)
            for (var addr in neighbours) {
                for (var i=0; i<neighbours[addr].length;i++) {
                    cell = loadCell(addr);
                    addCellNeighbour(cell, neighbours[addr][i])
                }
            }

        // Check that all went through (manual.)
        for (var addr in cells) {
            cell = loadCell(addr);
            getCellNeighbours(cell)
        }
    });