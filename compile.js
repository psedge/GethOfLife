Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
var fs = require('fs')
solc = require('solc')

var print = function(m) {
    process.stdout.write("[X] " + m + "\n");
}

var deploy = function(name) {
    print("Compiling "+name+".sol...");

    code = fs.readFileSync(name + '.sol').toString();
    compiled = solc.compile(code)

    if (compiled.errors) {
        print("Errors in " +name + "sol...")
        for (var i=0; i<compiled.errors.length; i++) {
            print(compiled.errors[i])
        }
        process.exit()
    }

    com = compiled.contracts[':'+name]
    abiDefinition = com['interface']
    cntrct = new web3.eth.Contract(JSON.parse(abiDefinition))

    var deployedContract;
    return web3.eth.getAccounts().then(
        function(accounts) {
            deployedContract = cntrct.deploy({data: "0x" + com.bytecode, arguments: []}).send({
                from: accounts[0],
                gas: 4712388,
                gasLimit: 500000000
            })

            fs.writeFile(name + ".abi", abiDefinition, function (err) {
                if (err) return console.log(err);
                print("ABI written to file.");
            });
            return deployedContract;
        });
}

print("Attaching to Private Testnet on RPC interface: http://localhost:8080");

// Deploy manager
if (false)
    deploy("GameOfLife").then(function(dep) {
        print("GoL deployed to " + dep._address)

        // Write contract address to file for autoconf during dev.
        fs.writeFile("GameOfLife.addr", dep._address, function (err) {
            if (err) return console.log(err);
            print("GoL address written to file.");
        });
    })


// Deploy X Cells
for (var cs=0; cs<1; cs++) {
    deploy("Cell").then((dep) => {
        print("Cell deployed to " + dep._address)

        // Write contract address to file for autoconf during dev.
        fs.appendFile("Cell.addr", "\n"+dep._address, function (err) {
            if (err) return console.log(err);
            print("Cell address written to file.");
        });
    }).catch((e) => {
        print("Error:" + e)
    })
}
