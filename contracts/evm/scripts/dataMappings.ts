export enum ChainId {
    MANTLE = 5000,
    POLYGON = 137,
    ARBITRUM = 42161,
    SOLANA = 0,
}

export const WRAPPED_NATIVE: { [c: number]: string } = {
    [ChainId.MANTLE]: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
    [ChainId.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
}

export const SETTLEMENT_ADDRESSES = {
    [ChainId.MANTLE]: '0x1d051eeD29Df13E1A1d1546329E54036A57AEb77',
    [ChainId.POLYGON]: '0x1280Bdbe692fA1ae7b69B9356daD6Cc211cbEA41',
    [ChainId.ARBITRUM]: '',
    [ChainId.SOLANA]: '',
}

export const ENDPOINT_ADDRESSES = {
    [ChainId.MANTLE]: '0x1a44076050125825900e736c501f859c50fE728c',
    [ChainId.POLYGON]: '0x1a44076050125825900e736c501f859c50fE728c',
    [ChainId.ARBITRUM]: '0x1a44076050125825900e736c501f859c50fE728c',
    [ChainId.SOLANA]: '76y77prsiCMvXMjuoZ5VRrhG5qYBrUMYTE5WgHqgjEn6',
}

export const ENDPOINT_IDS = {
    [ChainId.MANTLE]: 30181,
    [ChainId.POLYGON]: 30109,
    [ChainId.ARBITRUM]: 30110,
    [ChainId.SOLANA]: 30168,
}

const MANTLE_CONFIGS = {
    maxFeePerGas: 0.02 * 1e9,
    maxPriorityFeePerGas: 0.02 * 1e9
}

export function getConfig(c: number) {
    if (c === ChainId.MANTLE) return MANTLE_CONFIGS
    return {}
}