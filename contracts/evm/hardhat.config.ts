// hardhat.config.ts


import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
import "hardhat-contract-sizer";

dotenv.config();

import type { HardhatUserConfig } from "hardhat/config";

const accounts = {
  mnemonic:
    'test test test test test test test test test test test junk',
  accountsBalance: "990000000000000000000",
};

const pk: string = process.env.PK || '';
const pk1: string = process.env.PK_1 || '';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  etherscan: {
    customChains: [
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz/"
        }
      }
    ],
    apiKey: {
      mantle: 'abc',
      mainnet: process.env.ETHERSCAN_API_KEY ?? '',
      polygon: process.env.POLYGONSCAN_API_KEY ?? ''
    }
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: 'USD',
    enabled: true,
    excludeContracts: ['contracts/mocks/', 'contracts/libraries/'],
  },
  mocha: {
    timeout: 500000,
  },
  networks: {
    localhost: {
      url: 'http://localhost:8545',
      accounts
    },
    hardhat: {
      mining: {
        // auto: false,
        // interval: 0
      },
    },
    moonbase: {
      url: 'https://rpc.testnet.moonbeam.network',
      accounts,
      chainId: 1287,
      gas: 5198000,
      gasMultiplier: 2,
    },
    fantom: {
      url: 'https://rpcapi.fantom.network',
      accounts,
      chainId: 250,
      gasPrice: 22000000000,
    },
    matic: {
      url: 'https://1rpc.io/matic',
      accounts: [pk, pk1],
      chainId: 137,
    },
    mantle: {
      url: 'https://rpc.mantle.xyz',
      accounts: [pk, pk1],
      chainId: 5000,
    },
    xdai: {
      url: 'https://rpc.xdaichain.com',
      accounts,
      chainId: 100,
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org',
      accounts,
      chainId: 56,
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts,
      chainId: 43114,
      gasPrice: 470000000000,
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts,
      chainId: 42161,
      blockGasLimit: 700000,
    },
    celo: {
      url: 'https://forno.celo.org',
      accounts,
      chainId: 42220,
    },
    palm: {
      url: 'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
      accounts,
      chainId: 11297108109,
    },
    'palm-testnet': {
      url: 'https://palm-testnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
      accounts,
      chainId: 11297108099,
      gasMultiplier: 2,
    },
  },
  paths: {
    artifacts: 'artifacts',
    cache: 'cache',
    sources: 'contracts',
    tests: 'test',
  },
  solidity: {
    compilers: [
      // 1delta
      {
        version: '0.8.25',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000_000,
          },
          evmVersion: 'paris',
          viaIR: true
        },
      },
    ],
    overrides: {}
  },
  // typechain: {
  //   outDir: 'types',
  //   target: 'ethers-v6',
  // },
};

export default config;
