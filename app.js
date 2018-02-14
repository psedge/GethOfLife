web3 = new Web3(new Web3.providers.HttpProvider("http://dev.gol:8080"));

var contract;
account = '';
web3.eth.getAccounts().then(
    function(accounts) {
        account = accounts[0];
    }
);

$.ajax("GameOfLife.abi").done(function(data) {
    var address;
    $.ajax("GameOfLife.addr").done(function(addr) {
        address = addr;
        contract = new web3.eth.Contract(JSON.parse(data), address, {from: account});
    }).fail(function(error) {
        console.log("Couldn't fetch address from file.");
    });
}).fail(function(error) {console.log("Couldn't fetch ABI from file.");});

function addCell(cell) {
    contract.methods.addCell(cell).send({from: account, value: 50000}, function(error, res) {
        getCells()
    })
}

function changeState(newState) {
    contract.methods.setState(newState).send({from: account, value: 50000}, function(error) {
        getCells()
    });
}

function getCells() {
    contract.methods.getCells().call(function(err, res) {
        console.log(err, res)
    });
}