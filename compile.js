Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));

var print = function(m) {
    process.stdout.write("[X] " + m + "\n");
}

print("Attaching to Private Testnet on RPC interface: http://localhost:8080");

print("Compiling GameOfLife.sol...");

var fs = require('fs')
code = fs.readFileSync('GameOfLife.sol').toString();
solc = require('solc')
compiled = solc.compile(code)

account = web3.eth.accounts[0]
print("Account " + account + " has balance: " + web3.eth.getBalance(account)/1000000000000000000 + "E")

abiDefinition = JSON.parse(compiled.contracts[':GameOfLife'].interface)
GoL = web3.eth.contract(abiDefinition)
byteCode = compiled.contracts[':GameOfLife'].bytecode
deployedContract = GoL.new([], {data: "0x"+byteCode, from: web3.eth.accounts[0], gas: 2567354})

contractAddress = '';
while (contractAddress == '') {
    transactionReceipt = web3.eth.getTransactionReceipt(deployedContract['transactionHash'])
    if (transactionReceipt) {
        contractAddress = transactionReceipt['contractAddress'];
    }
}

contract = GoL.at(contractAddress)

print("Contract compiled at address: " + contractAddress)
