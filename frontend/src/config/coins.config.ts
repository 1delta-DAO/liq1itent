import USDC from "../../public/assets/images/svg/tokens/usdc.svg";
import USDT from "../../public/assets/images/svg/tokens/usdt.svg";
import WBTC from "../../public/assets/images/svg/tokens/wbtc.svg";
import LINK from "../../public/assets/images/svg/tokens/link.svg";
import AAVE from "../../public/assets/images/svg/tokens/aave.svg";
import EURS from "../../public/assets/images/svg/tokens/eurs.svg";
import JEUR from "../../public/assets/images/svg/tokens/jeur.svg";
import AGEUR from "../../public/assets/images/svg/tokens/ageur.svg";
import GHST from "../../public/assets/images/svg/tokens/ghst.svg";
import DAI from "../../public/assets/images/svg/tokens/dai.svg";
import { Coin } from "./networks.config";

export const SUPPORTED_STABLES_DOLLAR = [
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
    icon: DAI,
    decimals: 18,
  },
  {
    name: "GDAI",
    symbol: "GDAI",
    address: "0x91993f2101cc758D0dEB7279d41e880F7dEFe827",
    icon: DAI,
    decimals: 18,
  },
  {
    name: "GHST",
    symbol: "GHST",
    address: "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
    icon: GHST,
    decimals: 18,
  },
  {
    name: "VGHST",
    symbol: "VGHST",
    address: "0x51195e21BDaE8722B29919db56d95Ef51FaecA6C",
    icon: GHST,
    decimals: 18,
  },
];

export const SUPPORTED_STABLES_EURO = [
  {
    name: "EURS",
    symbol: "EURS",
    address: "0xe111178a87a3bff0c8d18decba5798827539ae99",
    icon: EURS,
    decimals: 2,
  },
  {
    name: "JEUR",
    symbol: "JEUR",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    icon: JEUR,
    decimals: 18,
  },
  {
    name: "AGEUR",
    symbol: "AGEUR",
    address: "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4",
    icon: AGEUR,
    decimals: 18,
  },
];
export const SUPPORTED_COINS = [
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
    decimals: 18,
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
];

interface Pair {
  pairName: string;
  tvPairName: string;
  coinCollateral: Coin;
  coinBorrow: Coin;
}

export const SUPPORTED_PAIRS: Pair[] = [
  {
    pairName: "USDC:EURS",
    tvPairName: "CRYPTO:EURSUSD",
    coinCollateral: SUPPORTED_STABLES_DOLLAR.find((c) => c.symbol === "USDC")!,
    coinBorrow: SUPPORTED_STABLES_EURO.find((c) => c.symbol === "EURS")!,
  },
  {
    pairName: "AGEUR:USDC",
    tvPairName: "UNISWAP3ETH:AGEURUSDC",
    coinCollateral: SUPPORTED_STABLES_EURO.find((c) => c.symbol === "AGEUR")!,
    coinBorrow: SUPPORTED_STABLES_DOLLAR.find((c) => c.symbol === "USDC")!,
  },
  {
    pairName: "USDC:USDT",
    tvPairName: "UNISWAP3POLYGON:USDCUSDT",
    coinCollateral: SUPPORTED_STABLES_DOLLAR.find((c) => c.symbol === "USDC")!,
    coinBorrow: SUPPORTED_STABLES_DOLLAR.find((c) => c.symbol === "USDT")!,
  },

  {
    pairName: "USDT:GHST",
    tvPairName: "USDCUSDT",
    coinCollateral: SUPPORTED_STABLES_DOLLAR.find((c) => c.symbol === "USDT")!,
    coinBorrow: SUPPORTED_STABLES_DOLLAR.find((c) => c.symbol === "GHST")!,
  },
];

export const ALL_COINS = [
  {
    address: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
    icon: 'https://assets.coingecko.com/coins/images/30980/standard/token-logo.png?1696529819',
    symbol: 'wMNT',
    name: 'Wrapped Mantle',
    decimals: 18
  },
  {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    icon: 'https://assets.coingecko.com/coins/images/4713/standard/polygon.png?1698233745',
    symbol: 'wMATIC',
    name: 'Wrapped MATIC',
    decimals: 18
  },
  {
    address: '',
    icon: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756',
    symbol: 'wSOL',
    name: 'Wrapped SOL',
    decimals: 9
  }
]


