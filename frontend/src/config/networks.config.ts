/* eslint-disable max-len */
import BinanceSmartChain from "../../public/assets/images/svg/blockchains/bsc.svg";
import Ethereum from "../../public/assets/images/svg/blockchains/ethereum.svg";
import Polygon from "../../public/assets/images/svg/blockchains/polygon.svg";

import BUSD from "../../public/assets/images/svg/tokens/busd.svg";
import USDC from "../../public/assets/images/svg/tokens/usdc.svg";
import USDT from "../../public/assets/images/svg/tokens/usdt.svg";
import WBTC from "../../public/assets/images/svg/tokens/wbtc.svg";
import LINK from "../../public/assets/images/svg/tokens/link.svg";
import AAVE from "../../public/assets/images/svg/tokens/aave.svg";
import EURS from "../../public/assets/images/svg/tokens/eurs.svg";
import JEUR from "../../public/assets/images/svg/tokens/jeur.svg";

export interface Coin extends NativeCoin {
  address: string;
}

export interface NativeCoin {
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
}

export interface Network {
  name: string;
  icon: string;
  rpc: string;
  chainId: number;
  blockExplorerUrls: string[];
  active: boolean;
  contractAddress?: string;
  contractFactoryAddress?: string;
  contractLensAddress?: string;
  contractAavePoolAddress?: string;
  nativeCurrency?: NativeCoin;
  supportedStableCoinsDol?: Coin[];
  supportedCoins?: Coin[];
  supportedStableCoinsEur?: Coin[];
}

export function getNetwork(chainId: number | undefined): Network {
  if (!chainId) {
    throw new Error("No chainId specified");
  }
  const network = networks.find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(
      "Unable to find Network with chainId: " + chainId.toString()
    );
  }
  return network;
}

const getRandomRPC = (rpcString: string): string => {
  const rpcList = rpcString.split(",");
  const index = Math.floor(Math.random() * rpcList.length);
  return rpcList[index] as string;
};

const getSupportedChainIds = (): number[] => {
  const chainsIds: number[] = [];
  const splitted = process.env.NETWORK.split("|");
  splitted.forEach((chainId) => {
    if (chainId && chainId != "" && chainId != undefined) {
      chainsIds.push(Number(chainId));
    }
  });
  return chainsIds;
};

export const chainIds = getSupportedChainIds();

export const networks: Network[] = [
  {
    name: "Ethereum",
    icon: Ethereum,
    rpc: getRandomRPC(
      "https://mainnet.infura.io/v3/0c94aec7289f455ab6dd1aa270acce0c"
    ),
    chainId: 1,
    active: chainIds.indexOf(1) > 0,
    contractAddress: "0x0",
    blockExplorerUrls: [""],
    supportedStableCoinsDol: [
      {
        name: "USDT",
        symbol: "USDT",
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        icon: USDT,
        decimals: 6,
      },
      {
        name: "USDC",
        symbol: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        icon: USDC,
        decimals: 6,
      },
    ],
  },
  {
    name: "Goerli",
    icon: Ethereum,
    rpc: getRandomRPC(
      "https://eth-goerli.g.alchemy.com/v2/GQmJcHqdJX4mkZbpybS0KH5c7z7oDcGl"
    ),
    chainId: 5,
    active: chainIds.indexOf(5) > 0,
    contractAddress: "0xBb8396f4ccc2D25042CC733a227c1B3e64B29b1d",
    blockExplorerUrls: [""],
    supportedStableCoinsDol: [
      {
        name: "USDC",
        symbol: "USDC",
        address: "0x59E00d31Fe1eC64e95Ba6E224AC19040aAd7f5A7",
        icon: BUSD,
        decimals: 6,
      },
    ],
  },
  {
    name: "Binance Smart Chain",
    icon: BinanceSmartChain,
    rpc: getRandomRPC(
      "https://bsc-dataseed.binance.org/,https://bsc-dataseed1.defibit.io/,https://bsc-dataseed1.ninicoin.io/"
    ),
    chainId: 56,
    active: chainIds.indexOf(56) > 0,
    contractAddress: "0x0",
    blockExplorerUrls: [""],
    supportedStableCoinsDol: [
      {
        name: "BUSD",
        symbol: "BUSD",
        address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        icon: BUSD,
        decimals: 18,
      },
    ],
  },
  {
    name: "BSC Test",
    icon: BinanceSmartChain,
    rpc: getRandomRPC("https://data-seed-prebsc-2-s3.binance.org:8545/"),
    chainId: 97,
    active: chainIds.indexOf(97) > 0,
    contractAddress: "0x539a0872C99728462fb8C26Ca80b4011ea24F3E0",
    blockExplorerUrls: [""],
    supportedStableCoinsDol: [
      {
        name: "BUSD",
        symbol: "BUSD",
        address: "0x7E187C16fdD4CB394727570F62b15C1287B8849F",
        icon: BUSD,
        decimals: 18,
      },
    ],
  },
  {
    name: "Mumbai",
    icon: Polygon,
    rpc: getRandomRPC("https://rpc-mumbai.maticvigil.com/"),
    chainId: 80001,
    active: chainIds.indexOf(80001) > 0,
    contractAddress: "0x25e38433127d8eBDBf54198A3f06A328ecad554f",
    blockExplorerUrls: [""],
    supportedStableCoinsDol: [
      {
        name: "USDC",
        symbol: "USDC",
        address: "0x88E22BE47D7539b2B1Dc4274d44483e252003642",
        icon: USDC,
        decimals: 18,
      },
    ],
  },
  {
    name: "Polygon",
    icon: Polygon,
    rpc: getRandomRPC("https://polygon-rpc.com/"),
    chainId: 137,
    active: chainIds.indexOf(137) > 0,
    contractAddress: "0x0",
    contractFactoryAddress: "0x648cE75895873BECBC4c9a291A28CA1EF121953B",
    contractLensAddress: "0xAe3C2d45270791Ef8aD023D1E66d275255db0499",
    contractAavePoolAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    blockExplorerUrls: [""],
    supportedStableCoinsDol: [
      {
        name: "USDT",
        symbol: "USDT",
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        icon: USDT,
        decimals: 6,
      },
      {
        name: "USDC",
        symbol: "USDC",
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        icon: USDC,
        decimals: 6,
      },
      {
        name: "DAI",
        symbol: "DAI",
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        icon: USDC,
        decimals: 18,
      },
      {
        name: "GDAI",
        symbol: "GDAI",
        address: "0x91993f2101cc758D0dEB7279d41e880F7dEFe827",
        icon: USDC,
        decimals: 18,
      },
      {
        name: "GHST",
        symbol: "GHST",
        address: "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
        icon: USDC,
        decimals: 18,
      },
      {
        name: "VGHST",
        symbol: "VGHST",
        address: "0x51195e21BDaE8722B29919db56d95Ef51FaecA6C",
        icon: USDC,
        decimals: 18,
      },
    ],
    supportedStableCoinsEur: [
      {
        name: "EURS",
        symbol: "EURS",
        address: "0xe111178a87a3bff0c8d18decba5798827539ae99",
        icon: EURS,
        decimals: 18,
      },
      {
        name: "JEUR",
        symbol: "JEUR",
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        icon: JEUR,
        decimals: 18,
      },
    ],
    supportedCoins: [
      {
        name: "AAVE",
        symbol: "AAVE",
        address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        icon: AAVE,
        decimals: 18,
      },
      {
        name: "WBTC",
        symbol: "WBTC",
        address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
        icon: WBTC,
        decimals: 8,
      },
      {
        name: "LINK",
        symbol: "LINK",
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "MIMATIC",
        symbol: "MIMATIC",
        address: "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "Balancer",
        symbol: "BAL",
        address: "0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "Curve",
        symbol: "CRV",
        address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "DPI",
        symbol: "DPI",
        address: "0x85955046df4668e1dd369d2de9f3aeb98dd2a369",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "MATICX",
        symbol: "MATICX",
        address: "0xfa68fb4628dff1028cfec22b4162fccd0d45efb6",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "WETH",
        symbol: "WETH",
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "WSTETH",
        symbol: "WSTETH",
        address: "0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "WMATIC",
        symbol: "WMATIC",
        address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "STMATIC",
        symbol: "STMATIC",
        address: "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4",
        icon: LINK,
        decimals: 18,
      },
      {
        name: "SUSHI",
        symbol: "SUSHI",
        address: "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
        icon: LINK,
        decimals: 18,
      },
    ],
  },
];
