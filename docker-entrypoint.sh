#!/bin/sh
set -e

echo "==> Starting Hardhat node..."
npx hardhat node --port 8545 &
NODE_PID=$!

# Wait for the node to be ready
echo "==> Waiting for node..."
until curl -sf -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' > /dev/null 2>&1; do
  sleep 0.5
done
echo "==> Node ready."

echo "==> Deploying contracts..."
npx hardhat run scripts/deploy.js --network localhost

echo "==> Serving frontend on port 4545..."
exec npx serve . -p 4545
