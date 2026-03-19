require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.4.26",
  networks: {
    hardhat: {
      chainId: 1337,
      blockGasLimit: 100000000,
      gas: 100000000,
    },
  },
};
