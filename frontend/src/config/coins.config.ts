import { Coin } from "./networks.config";

interface Pair {
  pairName: string;
  tvPairName: string;
  coinCollateral: Coin;
  coinBorrow: Coin;
}

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


