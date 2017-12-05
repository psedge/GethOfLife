geth --identity "MyNodeName" --rpc --rpcport "8080" --rpccorsdomain "*" --datadir ./testnet --port "30303" --nodiscover --rpcapi "db,eth,net,web3" --networkid 1999 init testnet/genesis.json
