# GethOfLife

Conway's Game of Life implemented on Ethereum — each cell is a deployed smart contract.

## Running locally

**Prerequisites:** Node.js, npm

```bash
npm install
```

**Terminal 1 — start a local Hardhat node:**
```bash
npm run node
```

**Terminal 2 — deploy contracts:**
```bash
npm run deploy
```

This deploys a `GameOfLife` contract and a 5×5 grid of `Cell` contracts, wires up their Moore neighbourhoods, and writes `deployed.json`.

**Terminal 2 — serve the frontend:**
```bash
npm run serve
```

Then open `http://localhost:3000` in your browser.

## How it works

- Click any cell to toggle it alive/dead (sends a transaction to that `Cell` contract)
- **Step** — advances all cells one generation using Conway's rules (calls `GameOfLife.step()`)
- **Auto** — steps automatically every 3 seconds
- **Clear** — kills all cells

## Project structure

```
contracts/
  Cell.sol        # Individual cell contract with GoL step logic
  GameOfLife.sol  # Manager: holds cell registry, orchestrates step()
scripts/
  deploy.js       # Hardhat deploy script
index.html        # Frontend (ethers.js, no build step)
hardhat.config.js
```
