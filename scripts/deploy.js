const { ethers } = require("hardhat");
const fs = require("fs");

const ROWS = 10;
const COLS = 10;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy GameOfLife manager
  const GameOfLife = await ethers.getContractFactory("GameOfLife");
  const gol = await GameOfLife.deploy(ROWS, COLS);
  await gol.waitForDeployment();
  const golAddress = await gol.getAddress();
  console.log("GameOfLife deployed to:", golAddress);

  // Deploy Cell contracts
  const Cell = await ethers.getContractFactory("Cell");
  const cellGrid = [];

  for (let r = 0; r < ROWS; r++) {
    cellGrid[r] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = await Cell.deploy();
      await cell.waitForDeployment();
      const addr = await cell.getAddress();
      cellGrid[r][c] = { contract: cell, address: addr };
      await gol.addCell(addr);
      process.stdout.write(`  Cell [${r},${c}] -> ${addr}\n`);
    }
  }

  // Wire up Moore neighbourhood (8 surrounding cells)
  console.log("Wiring up neighbours...");
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = cellGrid[r][c].contract;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            await cell.addNeighbour(cellGrid[nr][nc].address);
          }
        }
      }
    }
  }

  // Save deployment info for the frontend
  const deployed = {
    gameOfLife: golAddress,
    rows: ROWS,
    cols: COLS,
    cells: cellGrid.map((row) => row.map((c) => c.address)),
  };

  fs.writeFileSync("deployed.json", JSON.stringify(deployed, null, 2));
  console.log("\nDeployment complete. Info saved to deployed.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
